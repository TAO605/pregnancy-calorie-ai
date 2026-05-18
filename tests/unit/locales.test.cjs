const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const localesRoot = path.join(repoRoot, "public", "locales");
const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

function readLocale(lang) {
  return JSON.parse(fs.readFileSync(path.join(localesRoot, lang, "common.json"), "utf8"));
}

function placeholders(value) {
  return [...String(value).matchAll(/\{[^{}]+\}/g)].map((match) => match[0]).sort();
}

function hasUtf8Bom(filePath) {
  const bytes = fs.readFileSync(filePath);
  return bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

describe("locale JSON integrity", () => {
  const english = readLocale("en");
  const englishKeys = Object.keys(english);

  test.each(languages)("language file %s has identical key order and UTF-8 without BOM", (lang) => {
    const filePath = path.join(localesRoot, lang, "common.json");
    const locale = readLocale(lang);
    expect(Object.keys(locale)).toEqual(englishKeys);
    expect(hasUtf8Bom(filePath)).toBe(false);
  });

  test.each(languages.filter((lang) => lang !== "en"))("language file %s preserves all placeholders", (lang) => {
    const locale = readLocale(lang);
    for (const key of englishKeys) {
      expect(placeholders(locale[key])).toEqual(placeholders(english[key]));
    }
  });

  test.each(languages)("language file %s contains only string values", (lang) => {
    const locale = readLocale(lang);
    for (const key of englishKeys) {
      expect(typeof locale[key]).toBe("string");
      expect(locale[key]).not.toMatch(/\uFFFD|鈥|涓|绂|鏂|鑻|椋|锟|楼/);
    }
  });
});

describe("DeepL translation audit log", () => {
  test("DeepL call log exists and covers all target languages", () => {
    const log = JSON.parse(fs.readFileSync(path.join(localesRoot, "deepl-api-call-log.json"), "utf8"));
    expect(log.endpoint).toBe("https://api-free.deepl.com/v2/translate");
    expect(log.total_values).toBe(Object.keys(readLocale("en")).length);

    const successfulLanguages = new Set(
      log.calls.filter((call) => call.status === "ok").map((call) => call.lang)
    );
    expect([...successfulLanguages].sort()).toEqual(["ar", "de", "es", "fr", "it", "ja", "ko", "pt", "ru"]);
  });

  test("DeepL API smoke test works when DEEPL_AUTH_KEY is configured", async () => {
    if (!process.env.DEEPL_AUTH_KEY) {
      if (process.env.CI) throw new Error("DEEPL_AUTH_KEY GitHub secret is required in CI.");
      console.warn("Skipping live DeepL smoke test because DEEPL_AUTH_KEY is not set locally.");
      return;
    }

    const params = new URLSearchParams();
    params.append("source_lang", "EN");
    params.append("target_lang", "ES");
    params.append("preserve_formatting", "1");
    params.append("text", "Calorie");

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`
      },
      body: params
    });

    expect(response.ok).toBe(true);
    const payload = await response.json();
    expect(payload.translations[0].text).toBeTruthy();
  }, 30000);
});
