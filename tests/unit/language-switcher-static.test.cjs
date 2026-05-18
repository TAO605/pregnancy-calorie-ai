const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const homepage = fs.readFileSync(path.join(repoRoot, "delivery", "index.html"), "utf8");
const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

describe("language switcher static contract", () => {
  test("homepage declares all supported language codes", () => {
    for (const lang of languages) {
      expect(homepage).toContain(`code: "${lang}"`);
    }
  });

  test("language switcher writes and reads the persistent language cookie", () => {
    expect(homepage).toContain('const LANGUAGE_COOKIE_NAME = "pcc_language"');
    expect(homepage).toContain("function saveLanguageCookie(code)");
    expect(homepage).toContain("function getCookieValue(name)");
    expect(homepage).toContain("saveLanguageCookie(currentLanguage)");
  });

  test("language options are real anchor links with hreflang attributes", () => {
    expect(homepage).toContain("<a class=\\\"language-option");
    expect(homepage).toContain("href=\\\"");
    expect(homepage).toContain("hreflang=\\\"");
    expect(homepage).toContain("data-language-option=\\\"");
  });

  test("Arabic has RTL metadata in the language configuration", () => {
    expect(homepage).toMatch(/code:\s*"ar"[\s\S]*?dir:\s*"rtl"/);
    expect(homepage).toContain('document.documentElement.dir = language.dir');
  });
});
