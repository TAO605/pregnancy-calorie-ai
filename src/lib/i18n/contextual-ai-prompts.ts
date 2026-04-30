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
    return `我今天的目标是 ${input.targetCalories} kcal，已经记录了 ${input.loggedCalories} kcal，还差 ${input.remainingCalories} kcal。接下来一餐和加餐怎么安排更稳妥？`;
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
    return `我今天目标 ${input.targetCalories} kcal，目前已记录 ${input.loggedCalories} kcal，还差 ${input.remainingCalories} kcal。请按早餐、午餐、晚餐和加餐的思路帮我调整今天后面的饮食。`;
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
    return `我这次计算结果是 ${input.recommendedCalories} kcal，参考来源是 ${sourceLabel}。请帮我把这一天拆成三餐和加餐，并告诉我每餐的大致思路。`;
  }

  if (locale === "es") {
    return `Mi resultado actual es ${input.recommendedCalories} kcal y la referencia es ${sourceLabel}. Ayudame a repartirlo entre comidas principales y snacks con una estructura practica.`;
  }

  return `My current result is ${input.recommendedCalories} kcal using ${sourceLabel}. Help me split that across meals and snacks with a practical structure for the day.`;
}
