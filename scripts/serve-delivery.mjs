import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repoRoot, "delivery");
const port = Number(process.env.PORT || 4173);

const envFile = path.join(repoRoot, ".env.production");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals < 0) continue;
    const key = trimmed.slice(0, equals).trim();
    const value = trimmed.slice(equals + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const allFeaturesFree = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function resolveRequestPath(requestUrl) {
  let pathname = decodeURIComponent(new URL(requestUrl, "http://127.0.0.1").pathname);
  if (pathname === "/") pathname = "/index.html";
  let candidate = path.normalize(path.join(root, pathname));
  if (!candidate.startsWith(root)) return null;

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }

  if (!fs.existsSync(candidate) && !path.extname(candidate)) {
    const htmlCandidate = path.join(root, `${pathname}.html`);
    if (htmlCandidate.startsWith(root)) candidate = htmlCandidate;
  }

  return candidate;
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function handleLocalPregnancyGuidance(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }
  if (req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      configured: false,
      provider: "local-static-preview",
      endpoint: "/api/pregnancy-guidance"
    });
  }
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const payload = await readJsonBody(req).catch(() => ({}));
  if (payload && payload.requestMode === "nutrition-qa") {
    const week = Number(payload.inputs && payload.inputs.week) || 24;
    const target = Number(payload.result && payload.result.target) || 2200;
    return sendJson(res, 200, {
      source: "local-static-preview",
      model: "fallback",
      answer: [
        `Yes, a balanced choice can fit your Week ${week} nutrition plan.`,
        `With a ${Math.round(target)} kcal/day target, steady meals with protein, fiber, and hydration matter most.`,
        "Choose a comfortable portion today and ask your care team for personal medical guidance."
      ]
    });
  }

  const week = Number(payload.inputs && payload.inputs.week) || 24;
  const target = Number(payload.result && payload.result.target) || 2200;
  return sendJson(res, 200, {
    source: "local-static-preview",
    model: "fallback",
    diet: [
      `Use ${Math.round(target)} kcal/day as a planning target for Week ${week}.`,
      "Split meals into breakfast, lunch, dinner, and two steady snacks.",
      "Pair each meal with a protein food and a fiber-rich carbohydrate.",
      "Choose washed produce and fully cooked eggs, meat, fish, tofu, or beans.",
      "Add calcium-rich dairy or fortified alternatives when they fit your preferences.",
      "Keep snacks simple, such as yogurt, fruit, nuts, toast, or hummus.",
      "Drink water regularly and adjust portions around hunger and fullness.",
      "Use gentle meal prep so the plan stays practical on busy days.",
      "Review personal restrictions with your prenatal care team."
    ],
    exercise: [
      `For Week ${week}, keep movement gentle and matched to your usual activity level.`,
      "Walking, swimming, and prenatal yoga are practical options for many users.",
      "Start with short sessions if energy is low and build gradually.",
      "Pause movement and check in with care if unusual symptoms appear.",
      "Use comfortable shoes, hydration, and an easy pace.",
      "Treat this as educational movement guidance, not medical advice."
    ],
    tips: [
      "Use the calorie number as a guidepost, not a strict rule.",
      "Notice hunger, fullness, energy, and digestion across the week.",
      "Bring your result to a clinician or dietitian for personalized advice."
    ]
  });
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || "/", "http://127.0.0.1").pathname;
  if (pathname === "/api/pregnancy-guidance") {
    handleLocalPregnancyGuidance(req, res).catch((error) => {
      sendJson(res, 500, { error: error.message || "Local guidance failed" });
    });
    return;
  }

  const paidRoute = pathname.match(/^\/(?:(es|fr|de|pt|it|ru|ar|ja|ko)\/)?(?:(?:pricing|premium|refund-policy|billing|subscription-success|subscription-canceled)(?:\/|\.html)?|checkout(?:\/.*)?)$/i);
  if (allFeaturesFree && paidRoute) {
    res.writeHead(301, { Location: paidRoute[1] ? `/${paidRoute[1]}/` : "/" });
    res.end();
    return;
  }

  const file = resolveRequestPath(req.url || "/");
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(error.message);
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.log(`delivery static server already available at http://127.0.0.1:${port}`);
    setInterval(() => {}, 60_000);
    return;
  }
  throw error;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`delivery static server ready at http://127.0.0.1:${port}`);
});
