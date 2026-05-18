import type { AssistantContext } from "@/lib/ai/assistant-context";
import type { Locale } from "@/lib/i18n/config";
import { formatDietPreferenceList } from "@/lib/i18n/profile-preferences-copy";

export function getAssistantContextPromptTitle(locale: Locale) {
  switch (locale) {
    case "zh-CN":
      return "\u57fa\u4e8e\u4f60\u5f53\u524d\u4e0a\u4e0b\u6587\u7684\u63d0\u95ee";
    case "es":
      return "Prompts basados en tu contexto";
    default:
      return "Prompts from your context";
  }
}

export function buildAssistantContextPrompts(
  locale: Locale,
  context: AssistantContext | null,
) {
  const latest = context?.latestCalculation;
  const meals = context?.mealSummary;
  const weight = context?.weightSummary;
  const preferences = context?.profilePreferences?.dietPreferences ?? [];
  const preferenceSummary =
    preferences.length > 0 ? formatDietPreferenceList(locale, preferences) : "";

  if (!latest && !weight) {
    return [];
  }

  const prompts: string[] = [];

  if (locale === "zh-CN") {
    if (latest) {
      prompts.push(
        `\u600e\u4e48\u628a ${latest.recommendedCalories} kcal \u5206\u914d\u5230\u65e9\u9910\u3001\u5348\u9910\u3001\u665a\u9910\u548c\u52a0\u9910\uff1f`,
      );

      if (typeof meals?.todayLoggedCalories === "number") {
        prompts.push(
          `\u6211\u4eca\u5929\u5df2\u7ecf\u8bb0\u4e86 ${meals.todayLoggedCalories} kcal\uff0c\u540e\u9762\u8fd8\u53ef\u4ee5\u600e\u4e48\u5403\u66f4\u63a5\u8fd1 ${latest.recommendedCalories} kcal\uff1f`,
        );
      }

      if (typeof meals?.averageMealCalories === "number") {
        prompts.push(
          `\u6211\u6700\u8fd1\u5e73\u5747\u6bcf\u9910\u7ea6 ${meals.averageMealCalories} kcal\uff0c\u7b2c ${latest.gestationalWeek} \u5468\u8981\u600e\u4e48\u8c03\u6574\u66f4\u7a33\u59a5\uff1f`,
        );
      }

      if (preferences.length > 0) {
        prompts.push(
          `\u5982\u679c\u6211\u60f3\u5728 ${preferenceSummary} \u7684\u524d\u63d0\u4e0b\u8fbe\u5230 ${latest.recommendedCalories} kcal\uff0c\u4eca\u5929\u4e00\u5929\u8be5\u600e\u4e48\u5b89\u6392\uff1f`,
        );
      }
    }

    if (weight) {
      prompts.push(
        `\u6211\u73b0\u5728\u4f53\u91cd\u7ea6 ${weight.currentWeightKg} kg${
          typeof weight.prePregnancyDeltaKg === "number"
            ? `\uff0c\u76f8\u5bf9\u5b55\u524d\u53d8\u5316 ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg`
            : ""
        }\uff0c\u8fd9\u4e2a\u9636\u6bb5\u8be5\u600e\u4e48\u89e3\u8bfb\u8fd9\u4e2a\u8d8b\u52bf\uff1f`,
      );
    }

    return prompts.slice(0, 3);
  }

  if (locale === "es") {
    if (latest) {
      prompts.push(
        `Como reparto ${latest.recommendedCalories} calorias entre desayuno, almuerzo, cena y snacks?`,
      );

      if (typeof meals?.todayLoggedCalories === "number") {
        prompts.push(
          `Hoy ya llevo unas ${meals.todayLoggedCalories} calorias. Que podria comer despues para acercarme a ${latest.recommendedCalories}?`,
        );
      }

      if (typeof meals?.averageMealCalories === "number") {
        prompts.push(
          `Mis comidas recientes promedian ${meals.averageMealCalories} calorias. Como deberia ajustarlas en la semana ${latest.gestationalWeek}?`,
        );
      }

      if (preferences.length > 0) {
        prompts.push(
          `Como puedo llegar a ${latest.recommendedCalories} calorias respetando ${preferenceSummary}?`,
        );
      }
    }

    if (weight) {
      prompts.push(
        `Mi peso guardado actual es ${weight.currentWeightKg} kg${
          typeof weight.prePregnancyDeltaKg === "number"
            ? ` y va ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg frente al inicio`
            : ""
        }. Como deberia interpretar esta tendencia en este momento del embarazo?`,
      );
    }

    return prompts.slice(0, 3);
  }

  if (latest) {
    prompts.push(
      `How should I split ${latest.recommendedCalories} calories across breakfast, lunch, dinner, and snacks?`,
    );

    if (typeof meals?.todayLoggedCalories === "number") {
      prompts.push(
        `I have logged about ${meals.todayLoggedCalories} calories today. What should I eat next to stay near ${latest.recommendedCalories} calories?`,
      );
    }

    if (typeof meals?.averageMealCalories === "number") {
      prompts.push(
        `My recent meals average about ${meals.averageMealCalories} calories. How should I adjust them in week ${latest.gestationalWeek}?`,
      );
    }

    if (preferences.length > 0) {
      prompts.push(
        `How can I reach ${latest.recommendedCalories} calories while staying ${preferenceSummary}?`,
      );
    }
  }

  if (weight) {
    prompts.push(
      `My current saved weight is ${weight.currentWeightKg} kg${
        typeof weight.prePregnancyDeltaKg === "number"
          ? `, which is ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg versus pre-pregnancy`
          : ""
      }. How should I think about this trend right now?`,
    );
  }

  return prompts.slice(0, 3);
}
