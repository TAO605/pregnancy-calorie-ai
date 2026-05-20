const fs = require("fs");
const path = require("path");

const siteUrl = "https://aipregnancycaloriecalculator.online";
const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

const envFile = path.join(process.cwd(), ".env.production");
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
const pages = [
  { path: "", changefreq: "weekly", priority: "1" },
  ...(allFeaturesFree ? [] : [{ path: "/pricing", changefreq: "weekly", priority: "0.8" }]),
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
];

function absoluteUrl(language, pagePath) {
  if (language === "en") {
    return `${siteUrl}${pagePath}`;
  }

  return `${siteUrl}/${language}${pagePath}`;
}

function alternateLinks(pagePath) {
  return [
    ...languages.map(
      (language) =>
        `<xhtml:link rel="alternate" hreflang="${language}" href="${absoluteUrl(
          language,
          pagePath,
        )}"/>`,
    ),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(
      "en",
      pagePath,
    )}"/>`,
  ].join("");
}

const lastmod = new Date().toISOString();
const urls = pages
  .flatMap((page) =>
    languages.map(
      (language) =>
        `<url><loc>${absoluteUrl(language, page.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority>${alternateLinks(page.path)}</url>`,
    ),
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");

const indexSitemap = path.join(publicDir, "sitemap-0.xml");
if (fs.existsSync(indexSitemap)) {
  fs.rmSync(indexSitemap);
}

console.log("Generated multilingual sitemap:", path.join(publicDir, "sitemap.xml"));
console.log("Generated robots.txt:", path.join(publicDir, "robots.txt"));
