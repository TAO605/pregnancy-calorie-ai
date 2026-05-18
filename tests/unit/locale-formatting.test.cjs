const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const configPath = path.join(
  repoRoot,
  "src",
  "lib",
  "i18n",
  "locale-formatting.config.json",
);
const localeConfigPath = path.join(repoRoot, "src", "lib", "i18n", "config.ts");
const validationPath = path.join(
  repoRoot,
  "src",
  "lib",
  "validations",
  "calculator-input.ts",
);

const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];
const rules = JSON.parse(fs.readFileSync(configPath, "utf8"));

function normalizeSpaces(value) {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

function formatNumber(value, lang) {
  const fixed = value.toFixed(2);
  const [integerPart, decimalPart] = fixed.split(".");
  const groupedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    rules[lang].groupSeparator,
  );

  return normalizeSpaces(`${groupedInteger}${rules[lang].decimalSeparator}${decimalPart}`);
}

function formatDate(date, lang) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (rules[lang].dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`;
    case "YYYY.MM.DD":
      return `${year}.${month}.${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

describe("locale formatting contract", () => {
  test("format config covers exactly the supported languages", () => {
    expect(Object.keys(rules).sort()).toEqual([...languages].sort());

    const localeConfig = fs.readFileSync(localeConfigPath, "utf8");
    expect(localeConfig).toContain(
      'export const locales = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"] as const;',
    );

    const validation = fs.readFileSync(validationPath, "utf8");
    expect(validation).toContain("locale: z.enum(locales)");
  });

  test("number formatting follows the approved language table", () => {
    const expected = {
      en: "1,234.56",
      es: "1.234,56",
      fr: "1 234,56",
      de: "1.234,56",
      pt: "1.234,56",
      it: "1.234,56",
      ru: "1 234,56",
      ar: "1,234.56",
      ja: "1,234.56",
      ko: "1,234.56",
    };

    for (const lang of languages) {
      expect(formatNumber(1234.56, lang)).toBe(expected[lang]);
    }
  });

  test("date formatting follows the approved language table", () => {
    const date = new Date(2026, 4, 18);
    const expected = {
      en: "05/18/2026",
      es: "18/05/2026",
      fr: "18/05/2026",
      de: "18.05.2026",
      pt: "18/05/2026",
      it: "18/05/2026",
      ru: "18.05.2026",
      ar: "18/05/2026",
      ja: "2026/05/18",
      ko: "2026.05.18",
    };

    for (const lang of languages) {
      expect(formatDate(date, lang)).toBe(expected[lang]);
    }
  });

  test("unit defaults follow English-both and metric-for-all-other-languages", () => {
    expect(rules.en.unitSystem).toBe("both");
    expect(rules.en.heightUnit).toBe("in");
    expect(rules.en.weightUnit).toBe("lb");

    for (const lang of languages.filter((item) => item !== "en")) {
      expect(rules[lang].unitSystem).toBe("metric");
      expect(rules[lang].heightUnit).toBe("cm");
      expect(rules[lang].weightUnit).toBe("kg");
    }
  });
});
