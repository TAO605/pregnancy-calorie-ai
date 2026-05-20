const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const deliveryIndex = path.join(repoRoot, "delivery", "index.html");
const localesRoot = path.join(repoRoot, "public", "locales");
const languages = ["es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

function phraseKey(text) {
  let hash = 5381;
  for (const ch of String(text)) {
    hash = ((hash << 5) + hash) + ch.charCodeAt(0);
    hash |= 0;
  }
  return `phrase.${(hash >>> 0).toString(36)}`;
}

function extractLiteralCalls(html, functionName) {
  const pattern = new RegExp("\\b" + functionName + "\\(\\s*([\"'\\x60])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1", "g");
  const calls = [];
  let match;
  while ((match = pattern.exec(html))) {
    calls.push(match[2].replace(/\\n/g, "\n").replace(/\\"/g, "\"").replace(/\\'/g, "'"));
  }
  return calls;
}

describe("delivery runtime localization coverage", () => {
  const html = fs.readFileSync(deliveryIndex, "utf8");
  const english = JSON.parse(fs.readFileSync(path.join(localesRoot, "en", "common.json"), "utf8"));

  test("all p() runtime phrases have generated phrase keys in every locale", () => {
    const phraseKeys = [...new Set(extractLiteralCalls(html, "p").map(phraseKey))];
    expect(phraseKeys.length).toBeGreaterThan(100);

    for (const key of phraseKeys) {
      expect(Object.prototype.hasOwnProperty.call(english, key)).toBe(true);
    }

    for (const lang of languages) {
      const locale = JSON.parse(fs.readFileSync(path.join(localesRoot, lang, "common.json"), "utf8"));
      for (const key of phraseKeys) {
        expect(Object.prototype.hasOwnProperty.call(locale, key)).toBe(true);
      }
    }
  });

  test("all t() runtime keys used by delivery index exist in English and target locales", () => {
    const translationKeys = [...new Set(extractLiteralCalls(html, "t"))].filter((key) => !key.includes("${"));
    expect(translationKeys.length).toBeGreaterThan(50);

    for (const key of translationKeys) {
      expect(Object.prototype.hasOwnProperty.call(english, key)).toBe(true);
    }

    for (const lang of languages) {
      const locale = JSON.parse(fs.readFileSync(path.join(localesRoot, lang, "common.json"), "utf8"));
      for (const key of translationKeys) {
        expect(Object.prototype.hasOwnProperty.call(locale, key)).toBe(true);
      }
    }
  });
});
