const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const deliveryRoot = path.join(repoRoot, "delivery");
const siteUrl = "https://aipregnancycaloriecalculator.online";

const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];
const localizedLanguages = languages.filter((lang) => lang !== "en");
const pages = [
  { name: "home", slug: "", enFile: "index.html" },
  { name: "about", slug: "about", enFile: "about/index.html" },
  { name: "contact", slug: "contact", enFile: "contact/index.html" },
  { name: "privacy", slug: "privacy-policy", enFile: "privacy-policy/index.html" },
  { name: "terms", slug: "terms-of-service", enFile: "terms-of-service/index.html" },
  { name: "refund", slug: "refund-policy", enFile: "refund-policy/index.html" },
  { name: "medical", slug: "medical-disclaimer", enFile: "medical-disclaimer/index.html" },
  { name: "cookie", slug: "cookie-policy", enFile: "cookie-policy/index.html" },
];

const englishAuditPhrases = [
  "Get personalized daily calorie goals tailored to your trimester",
  "Our calculations are based on educational references",
  "Read the medical disclaimer before using this educational tool",
  "Log in / Sign up",
  "Skip to calculator",
  "Privacy Policy",
  "Terms of Service",
  "Refund Policy",
  "Medical Disclaimer",
  "Contact Us",
  "Last updated: May",
];

function fileFor(lang, page) {
  if (lang === "en") return path.join(deliveryRoot, page.enFile);
  return path.join(deliveryRoot, lang, page.slug ? page.slug : "", "index.html");
}

function readPage(lang, page) {
  return fs.readFileSync(fileFor(lang, page), "utf8");
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(html, selector) {
  const match = html.match(selector);
  return match ? match[1] : "";
}

function tagCount(html, tagName) {
  return (html.match(new RegExp(`<${tagName}\\b`, "gi")) || []).length;
}

function canonicalFor(lang, page) {
  const slug = page.slug ? `/${page.slug}` : "";
  return lang === "en" ? `${siteUrl}${slug}` : `${siteUrl}/${lang}${slug}`;
}

describe("multilingual static delivery contract", () => {
  test.each(languages.flatMap((lang) => pages.map((page) => [lang, page])))(
    "%s %s page has correct language, canonical, and hreflang cluster",
    (lang, page) => {
      const html = readPage(lang, page);
      expect(attr(html, /<html[^>]*\blang="([^"]+)"/i)).toBe(lang === "en" ? "en-US" : lang);
      expect(attr(html, /<html[^>]*\bdir="([^"]+)"/i)).toBe(lang === "ar" ? "rtl" : "ltr");
      expect(attr(html, /<link rel="canonical" href="([^"]+)"/i)).toBe(canonicalFor(lang, page));

      for (const code of languages) {
        const expected = canonicalFor(code, page);
        expect(html).toContain(`hreflang="${code}" href="${expected}"`);
      }
      expect(html).toContain(`hreflang="x-default" href="${canonicalFor("en", page)}"`);
    },
  );

  test.each(localizedLanguages.flatMap((lang) => pages.map((page) => [lang, page])))(
    "%s %s visible text has no audited English residue",
    (lang, page) => {
      const text = visibleText(readPage(lang, page));
      const found = englishAuditPhrases.filter((phrase) => text.includes(phrase));
      expect(found).toEqual([]);
    },
  );

  test.each(localizedLanguages.flatMap((lang) => pages.map((page) => [lang, page])))(
    "%s %s page preserves baseline structural shape",
    (lang, page) => {
      const englishHtml = readPage("en", page);
      const localizedHtml = readPage(lang, page);
      for (const tagName of ["h1", "h2", "form", "button", "main", "footer"]) {
        expect(tagCount(localizedHtml, tagName)).toBe(tagCount(englishHtml, tagName));
      }
    },
  );

  test.each(localizedLanguages)("homepage navigation for %s keeps users inside the selected language", (lang) => {
    const html = readPage(lang, pages[0]);
    expect(html).toContain('data-all-features-free="true"');
    expect(html).toContain('id="all-features-free-guard"');
    expect(html).toContain(`href="${siteUrl}/${lang}/about"`);
    expect(html).toContain(`href="${siteUrl}/${lang}/contact"`);
  });
});
