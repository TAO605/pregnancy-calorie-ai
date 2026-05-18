const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const deliveryRoot = path.join(repoRoot, "delivery");
const localesRoot = path.join(repoRoot, "public", "locales");
const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];
const pagePaths = ["", "pricing", "about", "contact"];

function pathExistsForRoute(route) {
  if (route === "/") return fs.existsSync(path.join(deliveryRoot, "index.html"));
  const clean = route.replace(/^\//, "");
  return (
    fs.existsSync(path.join(deliveryRoot, clean, "index.html")) ||
    fs.existsSync(path.join(deliveryRoot, `${clean}.html`))
  );
}

describe("localized delivery route availability", () => {
  test.each(languages)("homepage route exists for %s", (lang) => {
    const route = lang === "en" ? "/" : `/${lang}`;
    expect(pathExistsForRoute(route)).toBe(true);
  });

  test.each(languages.flatMap((lang) => pagePaths.slice(1).map((page) => [lang, page])))(
    "%s %s route exists",
    (lang, page) => {
      const route = lang === "en" ? `/${page}` : `/${lang}/${page}`;
      expect(pathExistsForRoute(route)).toBe(true);
    }
  );
});

describe("localized content and calculation invariants", () => {
  test("all locale files include the same translation surface for dynamic calculator text", () => {
    const english = JSON.parse(fs.readFileSync(path.join(localesRoot, "en", "common.json"), "utf8"));
    const keys = Object.keys(english).filter((key) => /home\./.test(key));
    expect(keys.length).toBeGreaterThan(50);

    for (const lang of languages) {
      const locale = JSON.parse(fs.readFileSync(path.join(localesRoot, lang, "common.json"), "utf8"));
      for (const key of keys) {
        expect(locale[key]).toBeDefined();
      }
    }
  });

  test("English calculator source still contains the known Week 24 formula dependencies", () => {
    const html = fs.readFileSync(path.join(deliveryRoot, "index.html"), "utf8");
    expect(html).toContain("function calculateBaseResult()");
    expect(html).toContain("Mifflin-St Jeor");
    expect(html).toContain("Week 24");
    expect(html).toContain("Moderate activity");
    expect(html).toContain("Singleton");
  });
});
