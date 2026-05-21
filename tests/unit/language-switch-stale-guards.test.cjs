const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const localeCodes = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function expectSourceToMatch(source, pattern) {
  expect(source.replace(/\s+/g, " ")).toMatch(pattern);
}

describe("language switch stale-content guards", () => {
  test("calculator input dropdown memoized data rebuilds when locale changes", () => {
    const source = readSource("src/components/calculator/pregnancy-calculator-form.tsx");

    expectSourceToMatch(
      source,
      /const pregnancyWeeks = useMemo\(\(\) => getPregnancyWeeks\(labels\), \[labels, locale\]\);/,
    );
    expectSourceToMatch(
      source,
      /const pregnancyTypes = useMemo\(\(\) => getPregnancyTypes\(labels\), \[labels, locale\]\);/,
    );
    expectSourceToMatch(
      source,
      /const dailyActivities = useMemo\(\(\) => getDailyActivities\(labels\), \[labels, locale\]\);/,
    );
  });

  test("profile form dropdown memoized data rebuilds when locale changes", () => {
    const source = readSource("src/components/dashboard/profile-editor.tsx");

    expectSourceToMatch(
      source,
      /const pregnancyWeeks = useMemo\( \(\) => getPregnancyWeeks\(copy\.profileFields\), \[copy\.profileFields, locale\], \);/,
    );
    expectSourceToMatch(
      source,
      /const pregnancyTypes = useMemo\( \(\) => getPregnancyTypes\(copy\.profileFields\), \[copy\.profileFields, locale\], \);/,
    );
    expectSourceToMatch(
      source,
      /const dailyActivities = useMemo\( \(\) => getDailyActivities\(copy\.profileFields\), \[copy\.profileFields, locale\], \);/,
    );
  });

  test("assistant localized memoized context rebuilds when locale changes", () => {
    const source = readSource("src/components/ai/assistant-panel.tsx");

    expect(source).toContain("const previousLocaleRef = useRef(locale);");
    expect(source).toContain("if (previousLocaleRef.current === locale)");
    expect(source).toContain("setSessionEntries([]);");
    expect(source).toContain("setIsLoading(false);");
    expect(source).toContain("setError(\"\");");
    expectSourceToMatch(source, /toLocaleDateString\(locale\); \}, \[context, locale\]\);/);
    expectSourceToMatch(
      source,
      /const contextPrompts = useMemo\( \(\) => buildAssistantContextPrompts\(locale, context\), \[context, locale\], \);/,
    );
  });

  test("delivery language switching rerenders static runtime UI and clears old generated content", () => {
    const source = readSource("delivery/index.html");

    expect(source).toContain("const previousLanguage = currentLanguage;");
    expect(source).toContain("refreshLocalizedRuntimeUi(previousLanguage);");
    expect(source).toContain("if (elements && elements.weekDisplay) renderInputs();");
    expect(source).toContain("refreshLanguageScopedStaticText();");
    expect(source).toContain("clearLanguageScopedGeneratedContent(previousLanguage);");
    expect(source).toContain('t("ai.language_switched"');
    expect(source).toContain("language-switched-notice");
    expect(source).toContain("if (elements.aiCards) elements.aiCards.innerHTML =");
    expect(source).toContain("if (elements.nutritionQaAnswer) elements.nutritionQaAnswer.innerHTML =");
    expect(source).toContain("language: currentLanguage");
    expect(source).toContain("lang: currentLanguage");
    expect(source).toContain("if (latestAiContentLanguage && latestAiContentLanguage !== currentLanguage)");
  });

  test("delivery AI API requests and server prompts are scoped to an explicit language", () => {
    const deliverySource = readSource("delivery/index.html");
    const apiSource = readSource("delivery/api/pregnancy-guidance.js");
    const localServerSource = readSource("scripts/serve-delivery.mjs");

    expect(deliverySource).toContain("Every user-visible JSON array item must be written 100% in");
    expect(deliverySource).toContain("Do not mix languages.");
    expect(apiSource).toContain("const SUPPORTED_LANGUAGES = {");
    expect(apiSource).toContain("function getPayloadLanguage(payload)");
    expect(apiSource).toContain("Unsupported language");
    expect(apiSource).toContain("Write every user-visible JSON string 100% in ${language.name}.");
    expect(apiSource).toContain("Do not mix languages. Do not reuse English text unless the requested language is English.");
    expect(apiSource).toContain('process.env.OPENAI_MODEL || "gpt-5.5"');
    expect(localServerSource).toContain('const supportedLanguages = new Set(["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"]);');
  });

  test("delivery input display and conversion text are refreshed from the active language", () => {
    const source = readSource("delivery/index.html");

    expect(source).toContain('const isRTL = currentLanguage === "ar";');
    expect(source).toContain('const startEmbedding = isRTL ? "\\u202B" : "\\u202A";');
    expect(source).toContain("elements.heightDisplayValue.textContent = elements.heightInput.value;");
    expect(source).toContain("elements.weightDisplayValue.textContent = elements.weightInput.value;");
    expect(source).toContain("elements.heightConversionHint.textContent = formatInlineConversionText(formatHeightConversionHint());");
    expect(source).toContain("elements.weightConversionHint.textContent = formatInlineConversionText(formatWeightConversionHint());");
  });

  test("language-switched AI notice exists in every configured locale", () => {
    for (const locale of localeCodes) {
      const copy = JSON.parse(
        fs.readFileSync(path.join(repoRoot, "public", "locales", locale, "common.json"), "utf8"),
      );
      expect(copy["ai.language_switched"]).toEqual(expect.any(String));
      expect(copy["ai.language_switched"].trim().length).toBeGreaterThan(20);
    }
  });
});
