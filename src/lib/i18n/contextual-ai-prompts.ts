import type { Locale } from "@/lib/i18n/config";

type MealAiPromptInput = {
  targetCalories: number;
  loggedCalories: number;
  remainingCalories: number;
};

export function buildOverviewAiPrompt(
  locale: Locale,
  input: MealAiPromptInput,
) {
  if (locale === "zh-CN") {
    return `\u6211\u4eca\u5929\u7684\u76ee\u6807\u662f ${input.targetCalories} kcal\uff0c\u5df2\u7ecf\u8bb0\u5f55\u4e86 ${input.loggedCalories} kcal\uff0c\u8fd8\u5dee ${input.remainingCalories} kcal\u3002\u63a5\u4e0b\u6765\u4e00\u9910\u548c\u52a0\u9910\u600e\u4e48\u5b89\u6392\u66f4\u7a33\u59a5\uff1f`;
  }

  if (locale === "es") {
    return `Mi objetivo de hoy es ${input.targetCalories} kcal, ya registre ${input.loggedCalories} kcal y me faltan ${input.remainingCalories} kcal. Como deberia repartir la siguiente comida y snack?`;
  }

  return `My target today is ${input.targetCalories} kcal, I have logged ${input.loggedCalories} kcal, and I still have ${input.remainingCalories} kcal left. How should I plan my next meal and snack?`;
}

export function buildMealsAiPrompt(
  locale: Locale,
  input: MealAiPromptInput,
) {
  if (locale === "zh-CN") {
    return `\u6211\u4eca\u5929\u76ee\u6807\u662f ${input.targetCalories} kcal\uff0c\u76ee\u524d\u5df2\u8bb0\u5f55 ${input.loggedCalories} kcal\uff0c\u8fd8\u5dee ${input.remainingCalories} kcal\u3002\u8bf7\u6309\u65e9\u9910\u3001\u5348\u9910\u3001\u665a\u9910\u548c\u52a0\u9910\u7684\u601d\u8def\u5e2e\u6211\u8c03\u6574\u4eca\u5929\u540e\u9762\u7684\u996e\u98df\u3002`;
  }

  if (locale === "es") {
    return `Hoy tengo un objetivo de ${input.targetCalories} kcal, llevo ${input.loggedCalories} kcal registradas y me faltan ${input.remainingCalories} kcal. Ayudame a ajustar el resto del dia entre comidas principales y snacks.`;
  }

  return `My goal today is ${input.targetCalories} kcal, I have logged ${input.loggedCalories} kcal so far, and I have ${input.remainingCalories} kcal left. Help me adjust the rest of today across meals and snacks.`;
}

export function buildResultAiPrompt(
  locale: Locale,
  input: {
    recommendedCalories: number;
    source?: string | null;
  },
) {
  const sourceLabel = input.source?.trim() || "the current guideline";

  if (locale === "zh-CN") {
    return `\u6211\u8fd9\u6b21\u8ba1\u7b97\u7ed3\u679c\u662f ${input.recommendedCalories} kcal\uff0c\u53c2\u8003\u6765\u6e90\u662f ${sourceLabel}\u3002\u8bf7\u5e2e\u6211\u628a\u8fd9\u4e00\u5929\u62c6\u6210\u4e09\u9910\u548c\u52a0\u9910\uff0c\u5e76\u544a\u8bc9\u6211\u6bcf\u9910\u7684\u5927\u81f4\u601d\u8def\u3002`;
  }

  if (locale === "es") {
    return `Mi resultado actual es ${input.recommendedCalories} kcal y la referencia es ${sourceLabel}. Ayudame a repartirlo entre comidas principales y snacks con una estructura practica.`;
  }

  return `My current result is ${input.recommendedCalories} kcal using ${sourceLabel}. Help me split that across meals and snacks with a practical structure for the day.`;
}
