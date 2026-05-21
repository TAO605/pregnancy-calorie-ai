const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const deliveryIndex = fs.readFileSync(
  path.join(repoRoot, "delivery", "index.html"),
  "utf8",
);
const en = require(path.join(repoRoot, "public", "locales", "en", "common.json"));
const es = require(path.join(repoRoot, "public", "locales", "es", "common.json"));
const fr = require(path.join(repoRoot, "public", "locales", "fr", "common.json"));
const de = require(path.join(repoRoot, "public", "locales", "de", "common.json"));
const pt = require(path.join(repoRoot, "public", "locales", "pt", "common.json"));
const it = require(path.join(repoRoot, "public", "locales", "it", "common.json"));
const ru = require(path.join(repoRoot, "public", "locales", "ru", "common.json"));
const ar = require(path.join(repoRoot, "public", "locales", "ar", "common.json"));
const ja = require(path.join(repoRoot, "public", "locales", "ja", "common.json"));
const ko = require(path.join(repoRoot, "public", "locales", "ko", "common.json"));
const localeCodes = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

describe("delivery runtime locale formatting", () => {
  test("homepage runtime defines table-driven number, date, and unit formatting helpers", () => {
    expect(deliveryIndex).toContain("const LOCALE_FORMAT_RULES = {");
    expect(deliveryIndex).toContain('fr: { numberLocale: "fr-FR", groupSeparator: "\\u202f", decimalSeparator: ","');
    expect(deliveryIndex).toContain('ru: { numberLocale: "ru-RU", groupSeparator: "\\u202f", decimalSeparator: ","');
    expect(deliveryIndex).toContain('it: { numberLocale: "it-IT", groupSeparator: ".", decimalSeparator: ","');
    expect(deliveryIndex).toContain('ar: { numberLocale: "en-US", groupSeparator: ",", decimalSeparator: "."');
    expect(deliveryIndex).toContain("function formatNumber(localeOrValue, maybeValue, maybeOptions = {})");
    expect(deliveryIndex).toContain("function formatDate(localeOrDate, maybeDate)");
    expect(deliveryIndex).toContain("function formatUnit(localeOrValue, maybeValue, maybeUnit, maybeOptions = {})");
  });

  test("non-English pages default to metric units before browser-region detection", () => {
    expect(deliveryIndex).toContain('if (currentLanguage !== "en") return "metric";');
  });

  test("future calorie curve shows signed daily change and total kcal, not total kcal/day", () => {
    expect(deliveryIndex).toContain("total: formatEnergy(item.target)");
    expect(deliveryIndex).not.toContain("total: formatEnergyPerDay(item.target)");
  });

  test("weekly future-value translations preserve placeholders and avoid known Arabic mistranslation", () => {
    const locales = { en, ar, de, ko };
    const arabicEmailOrWebsite = new RegExp(
      [
        "\\u0627\\u0644\\u0628\\u0631\\u064a\\u062f",
        "\\u0627\\u0644\\u0625\\u0644\\u0643\\u062a\\u0631\\u0648\\u0646\\u064a",
        "website",
        "email",
      ].join("|"),
      "i",
    );
    for (const copy of Object.values(locales)) {
      expect(copy["weekly.futureValue"]).toContain("{extra}");
      expect(copy["weekly.futureValue"]).toContain("{total}");
      expect(copy["weekly.futureValue"]).not.toMatch(arabicEmailOrWebsite);
      expect(copy["weekly.futureValue"]).toBeTruthy();
    }
  });

  test("visible last-updated dates use approved numeric locale formats", () => {
    expect(en["about_us.0009"]).toBe("05/13/2026");
    expect(es["about_us.0009"]).toBe("13/05/2026");
    expect(fr["about_us.0009"]).toBe("13/05/2026");
    expect(de["about_us.0009"]).toBe("13.05.2026");
    expect(ru["about_us.0009"]).toBe("13.05.2026");
    expect(ar["about_us.0009"]).toBe("13/05/2026");
    expect(ja["about_us.0009"]).toBe("2026/05/13");
    expect(ko["about_us.0009"]).toBe("2026.05.13");
  });

  test("locale JSON files are UTF-8 without BOM and replacement characters", () => {
    for (const lang of localeCodes) {
      const filePath = path.join(repoRoot, "public", "locales", lang, "common.json");
      const buffer = fs.readFileSync(filePath);
      expect(buffer.slice(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))).toBe(false);
      const text = buffer.toString("utf8");
      expect(text).not.toContain("\ufffd");
      expect(() => JSON.parse(text)).not.toThrow();
    }
  });

  test("stage 4 CSS guards wrapping, Japanese/Korean width, and Arabic RTL controls", () => {
    expect(deliveryIndex).toContain("overflow-wrap: break-word;");
    expect(deliveryIndex).toContain("word-wrap: break-word;");
    expect(deliveryIndex).toContain("hyphens: auto;");
    expect(deliveryIndex).toContain("text-overflow: ellipsis;");
    expect(deliveryIndex).toContain('html[lang="ja"] button');
    expect(deliveryIndex).toContain('html[lang="ko"] button');
    expect(deliveryIndex).toContain('html[dir="rtl"] button');
    expect(deliveryIndex).toContain('html[dir="rtl"] .choice-option');
    expect(deliveryIndex).toContain('[dir="rtl"] .dropdown-option');
    expect(deliveryIndex).toContain('[dir="rtl"] .dropdown-arrow');
    expect(deliveryIndex).toContain('html[dir="rtl"] .v12-input-row[data-open-choice]::after');
    expect(deliveryIndex).toContain("left: 16px;");
    expect(deliveryIndex).toContain('html[dir="rtl"] .choice-list');
    expect(deliveryIndex).toContain("unit-inline-control");
    expect(deliveryIndex).toContain("input-content");
    expect(deliveryIndex).toContain("conversion-text");
    expect(deliveryIndex).toContain("unit-label");
    expect(deliveryIndex).toContain("input-value");
    expect(deliveryIndex).toContain("hidden-input");
    expect(deliveryIndex).toContain("heightDisplayValue");
    expect(deliveryIndex).toContain("weightDisplayValue");
    expect(deliveryIndex).toContain("formatInlineConversionText");
    expect(deliveryIndex).toContain('const isRTL = currentLanguage === "ar";');
    expect(deliveryIndex).toContain('const startEmbedding = isRTL ? "\\u202B" : "\\u202A";');
    expect(deliveryIndex).toContain('const endEmbedding = "\\u202C";');
    expect(deliveryIndex).toContain('html[dir="rtl"] .unit-inline-control .unit-button');
    expect(deliveryIndex).toContain('html[dir="rtl"] .unit-inline-control .unit-conversion-hint');
    expect(deliveryIndex).toContain("justify-content: flex-end;");
    expect(deliveryIndex).toContain("list-style-position: outside;");
    expect(deliveryIndex).toContain("transform-origin: right center;");
  });

  test("Arabic dropdown labels and calorie units keep RTL-friendly number-unit order", () => {
    expect(ar["dropdown.pregnancyWeek.week22.label"]).toBe("\u0627\u0644\u0623\u0633\u0628\u0648\u0639 22");
    expect(ar["dropdown.pregnancyWeek.week22.desc"]).toContain("+377 \u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a");
    expect(ar["dropdown.pregnancyWeek.week3.desc"]).toContain("+57 \u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a");
    expect(ar["unit.kcal"]).toBe("\u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a");
    expect(ar["unit.kcalPerDay"]).toBe("\u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a/\u064a\u0648\u0645");
    expect(deliveryIndex).toContain('if (locale === "ar") return formattedNumber + " " + label;');
    expect(deliveryIndex).toContain('kcal: "\u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a"');
    expect(deliveryIndex).toContain('kcalPerDay: "\u0643\u064a\u0644\u0648 \u0643\u0627\u0644\u0648\u0631\u064a/\u064a\u0648\u0645"');
  });

  test("choice dropdown data uses locale keys and rerenders through t()", () => {
    const weeksBlock = deliveryIndex.match(/function getPregnancyWeeks\(translate\) \{[\s\S]*?\n    \}/)?.[0] || "";
    const activitiesBlock = deliveryIndex.match(/function getDailyActivities\(translate\) \{[\s\S]*?\n    \}/)?.[0] || "";
    const pregnancyTypesBlock = deliveryIndex.match(/function getPregnancyTypes\(translate\) \{[\s\S]*?\n    \}/)?.[0] || "";
    expect(weeksBlock).toContain('translate(getDropdownWeekKey(week, "label"), {}, "")');
    expect(weeksBlock).toContain('translate(getDropdownWeekKey(week, "desc"), {}, "")');
    expect(activitiesBlock).toContain('translate("dropdown.dailyActivity.sedentary.label", {}, "")');
    expect(activitiesBlock).toContain('translate("dropdown.dailyActivity.sedentary.desc", {}, "")');
    expect(activitiesBlock).toContain('value: "veryHigh"');
    expect(activitiesBlock).toContain('legacyValue: "extreme"');
    expect(activitiesBlock).not.toContain('labelKey: "activity.sedentary"');
    expect(activitiesBlock).not.toContain('label: "Sedentary"');
    expect(activitiesBlock).not.toContain('description: "Very little exercise');
    expect(pregnancyTypesBlock).toContain('translate("dropdown.pregnancyType.singleton.label", {}, "")');
    expect(pregnancyTypesBlock).toContain('translate("dropdown.pregnancyType.singleton.desc", {}, "")');
    expect(pregnancyTypesBlock).not.toContain('labelKey: "pregnancy.singleton"');
    expect(pregnancyTypesBlock).not.toContain('label: "Singleton"');
    expect(deliveryIndex).toContain('function refreshLocalizedRuntimeUi()');
    expect(deliveryIndex).toContain('renderChoiceOptions(modalKind);');
    expect(deliveryIndex).toContain('function getDropdownWeekKey(week, field)');
    expect(deliveryIndex).toContain('elements.weekChoiceLabel.textContent = t("dropdown.pregnancyWeek.title", {}, "")');
    expect(deliveryIndex).toContain('elements.typeChoiceLabel.textContent = t("dropdown.pregnancyType.title", {}, "")');
    expect(deliveryIndex).toContain('elements.activityChoiceLabel.textContent = t("dropdown.dailyActivity.title", {}, "")');
    expect(deliveryIndex).toContain('if (kind === "week") return t("dropdown.pregnancyWeek.title", {}, "")');
    expect(deliveryIndex).toContain('if (kind === "pregnancyType") return t("dropdown.pregnancyType.title", {}, "")');
    expect(deliveryIndex).toContain('return t("dropdown.dailyActivity.title", {}, "")');
    expect(deliveryIndex).toContain("return getPregnancyWeeks(t);");
    expect(deliveryIndex).toContain("return getPregnancyTypes(t).map");
    expect(deliveryIndex).toContain("return getDailyActivities(t).map");
    expect(deliveryIndex).toContain("applyLanguage(nextCode);");
    expect(deliveryIndex).toContain("history.pushState({ language: nextCode }, \"\", nextUrl);");
    expect(deliveryIndex).toContain("event.preventDefault();");
  });

  test("all locales include explicit dropdown key namespace", () => {
    const dropdownKeys = Object.keys(en).filter((key) => key.startsWith("dropdown."));
    expect(dropdownKeys).toHaveLength(101);
    expect(en["dropdown.pregnancyWeek.week1.label"]).toBe("Week 1");
    expect(en["dropdown.pregnancyWeek.week40.label"]).toBe("Week 40");
    expect(en["dropdown.pregnancyWeek.week42.label"]).toBe("Week 42");
    for (const copy of [es, fr, de, pt, it, ru, ar, ja, ko]) {
      for (const key of dropdownKeys) {
        expect(typeof copy[key]).toBe("string");
        expect(copy[key].length).toBeGreaterThan(0);
      }
    }
  });

  test("mandatory singleton terminology is localized without mojibake placeholders", () => {
    const singletonByLocale = {
      es: es["pregnancy.singleton"],
      fr: fr["pregnancy.singleton"],
      de: de["pregnancy.singleton"],
      pt: pt["pregnancy.singleton"],
      it: it["pregnancy.singleton"],
      ru: ru["pregnancy.singleton"],
      ar: ar["pregnancy.singleton"],
      ja: ja["pregnancy.singleton"],
      ko: ko["pregnancy.singleton"],
    };
    expect(singletonByLocale.es).toBe("Embarazo único");
    expect(singletonByLocale.fr).toBe("Grossesse unique");
    expect(singletonByLocale.de).toBe("Einlingsschwangerschaft");
    expect(singletonByLocale.pt).toBe("Gravidez única");
    expect(singletonByLocale.it).toBe("Gravidanza singola");
    expect(singletonByLocale.ru).toBe("Одиночная беременность");
    expect(singletonByLocale.ar).toBe("حمل واحد");
    expect(singletonByLocale.ja).toBe("単胎妊娠");
    expect(singletonByLocale.ko).toBe("단태임신");
    for (const value of Object.values(singletonByLocale)) {
      expect(value).not.toContain("?");
      expect(value).not.toContain("Singleton");
    }
  });
});
