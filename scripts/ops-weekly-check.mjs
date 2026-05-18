import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const deliveryDir = path.join(rootDir, "delivery");
const reportDir = path.join(rootDir, ".qa");
const siteUrl = process.env.OPERATIONS_SITE_URL || "https://aipregnancycaloriecalculator.online";
const timeoutMs = Number(process.env.OPERATIONS_FETCH_TIMEOUT_MS || 15000);

const requiredDeliveryFiles = [
  "index.html",
  "api/pregnancy-guidance.js",
  "medical-disclaimer.html",
  "privacy-policy.html",
  "terms-of-service.html",
  "cookie-policy.html",
  "about-us.html",
  "contact-us.html",
  "pricing.html",
  "robots.txt",
  "sitemap.xml",
  "logo-horizontal.png",
  "logo-square.png",
  "favicon.ico",
  "favicon.png",
  "og-cover.png",
];

const requiredIndexMarkers = [
  '<html lang="en-US"',
  'rel="canonical"',
  'meta name="description"',
  'meta name="robots" content="index, follow"',
  'property="og:title"',
  'property="og:image"',
  'name="twitter:card"',
  'application/ld+json',
  'AI Pregnancy Calorie Calculator',
  "AI_FIXED_HALLUCINATION_GUARD",
  "AI_CONTENT_BLOCKED_KEYWORDS",
  "AI_CONTENT_AUDIT_RULES",
  "recordAiAuditLog",
  "auditAiContent",
  "getAuditedAiForExternalUse",
  "SAVE_IMAGE_BLOCKED_KEYWORDS",
  "SHARE_PLATFORMS",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "TikTok",
  "Twitter (X)",
  "Pinterest",
  "Telegram",
  "LinkedIn",
];

const productionPaths = [
  "/",
  "/api/pregnancy-guidance",
  "/medical-disclaimer.html",
  "/privacy-policy.html",
  "/terms-of-service.html",
  "/cookie-policy.html",
  "/about-us.html",
  "/contact-us.html",
  "/pricing.html",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/og-cover.png",
];

function pass(name, details = {}) {
  return { name, ok: true, details };
}

function fail(name, error, details = {}) {
  return {
    name,
    ok: false,
    error: error instanceof Error ? error.message : String(error),
    details,
  };
}

async function checkFileExists(relativePath) {
  const absolutePath = path.join(deliveryDir, relativePath);
  const fileStat = await stat(absolutePath);
  return { relativePath, bytes: fileStat.size };
}

function extractScripts(html) {
  return [...html.matchAll(/<script(?![^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function runStaticChecks(results) {
  const html = await readFile(path.join(deliveryDir, "index.html"), "utf8");

  try {
    for (const script of extractScripts(html)) {
      new Function(script);
    }
    for (const json of extractJsonLd(html)) {
      JSON.parse(json);
    }
    results.push(pass("index-js-jsonld-parse", {
      scripts: extractScripts(html).length,
      jsonld: extractJsonLd(html).length,
    }));
  } catch (error) {
    results.push(fail("index-js-jsonld-parse", error));
  }

  const rowCount = (html.match(/class="v12-input-row/g) || []).length;
  results.push(rowCount === 6
    ? pass("six-input-rows", { rowCount })
    : fail("six-input-rows", `Expected 6 v12 input rows, found ${rowCount}`, { rowCount }));

  const missingMarkers = requiredIndexMarkers.filter((marker) => !html.includes(marker));
  results.push(missingMarkers.length === 0
    ? pass("critical-feature-markers", { checked: requiredIndexMarkers.length })
    : fail("critical-feature-markers", `Missing markers: ${missingMarkers.join(", ")}`, { missingMarkers }));

  const domesticPlatformPattern = /微信|微博|小红书|抖音|QQ|WeChat|Weibo|Douyin/i;
  results.push(!domesticPlatformPattern.test(html)
    ? pass("no-domestic-share-platforms")
    : fail("no-domestic-share-platforms", "Domestic platform keyword found in index.html"));

  const googleBlockingPattern = /noindex|nofollow|Disallow:\s*\/\s*(?:$|\n)/i;
  const robots = await readFile(path.join(deliveryDir, "robots.txt"), "utf8");
  const sitemap = await readFile(path.join(deliveryDir, "sitemap.xml"), "utf8");
  const googleReady = !/noindex|nofollow/i.test(html) &&
    !googleBlockingPattern.test(robots) &&
    sitemap.includes(siteUrl.replace(/\/$/, "") + "/") &&
    html.includes(siteUrl.replace(/\/$/, "") + "/");
  results.push(googleReady
    ? pass("google-english-site-readiness", { canonical: siteUrl, sitemap: "present", robots: "crawlable" })
    : fail("google-english-site-readiness", "Canonical, robots, sitemap, or indexability marker is not Google-ready"));

  const secretPattern = /sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY\s*=\s*["'][^"']+["']/;
  results.push(!secretPattern.test(html)
    ? pass("no-inline-secret-patterns")
    : fail("no-inline-secret-patterns", "Potential inline secret pattern found"));
}

async function runDeliveryFileChecks(results) {
  for (const filePath of requiredDeliveryFiles) {
    try {
      results.push(pass("delivery-file:" + filePath, await checkFileExists(filePath)));
    } catch (error) {
      results.push(fail("delivery-file:" + filePath, error));
    }
  }
}

async function runProductionChecks(results) {
  for (const pathname of productionPaths) {
    const url = siteUrl.replace(/\/$/, "") + pathname;
    try {
      const response = await fetchWithTimeout(url);
      results.push(response.ok
        ? pass("production:" + pathname, { status: response.status })
        : fail("production:" + pathname, `HTTP ${response.status}`, { status: response.status }));

      if (pathname === "/api/pregnancy-guidance" && response.ok) {
        const data = await response.json();
        const configured = Boolean(data && data.configured);
        results.push(configured
          ? pass("production-ai-configured", { provider: data.provider, model: data.model, baseUrl: data.baseUrl })
          : fail("production-ai-configured", "AI endpoint is not configured", data));
      }
    } catch (error) {
      results.push(fail("production:" + pathname, error));
    }
  }
}

async function main() {
  const results = [];
  await runDeliveryFileChecks(results);
  await runStaticChecks(results);
  await runProductionChecks(results);

  const failed = results.filter((result) => !result.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    summary: {
      total: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      status: failed.length ? "failed" : "passed",
    },
    results,
  };

  await mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "ops-weekly-check-latest.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report.summary));
  console.log("Report:", reportPath);

  if (failed.length) {
    console.error("Failed checks:");
    for (const item of failed) {
      console.error("- " + item.name + ": " + item.error);
    }
    process.exit(1);
  }
}

await main();
