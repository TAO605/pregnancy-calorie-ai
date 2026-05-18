import type { Locale } from "@/lib/i18n/config";
import type { WeightSummary } from "@/lib/weight/weight-summary";

export function buildWeightAiPrompt(
  locale: Locale,
  input: {
    summary: WeightSummary;
    targetCalories?: number | null;
  },
) {
  const weekPart =
    typeof input.summary.gestationalWeek === "number"
      ? locale === "zh-CN"
        ? `\u6211\u73b0\u5728\u5927\u7ea6\u5728\u5b55 ${input.summary.gestationalWeek} \u5468\uff0c`
        : locale === "es"
          ? `Estoy aproximadamente en la semana ${input.summary.gestationalWeek} y `
          : `I am around week ${input.summary.gestationalWeek}, and `
      : locale === "zh-CN"
        ? ""
        : "";
  const baselinePart =
    typeof input.summary.prePregnancyDeltaKg === "number"
      ? locale === "zh-CN"
        ? `\u5f53\u524d\u4fdd\u5b58\u4f53\u91cd\u5927\u7ea6\u662f ${input.summary.currentWeightKg} kg\uff0c\u548c\u5b55\u524d\u76f8\u6bd4\u53d8\u5316\u4e86 ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg`
        : locale === "es"
          ? `mi peso guardado actual es ${input.summary.currentWeightKg} kg y esta ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg frente al peso previo al embarazo`
          : `my current saved weight is ${input.summary.currentWeightKg} kg, which is ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg versus pre-pregnancy`
      : locale === "zh-CN"
        ? `\u5f53\u524d\u4fdd\u5b58\u4f53\u91cd\u5927\u7ea6\u662f ${input.summary.currentWeightKg} kg`
        : locale === "es"
          ? `mi peso guardado actual es ${input.summary.currentWeightKg} kg`
          : `my current saved weight is ${input.summary.currentWeightKg} kg`;
  const recentPart =
    typeof input.summary.recentTrendDeltaKg === "number"
      ? locale === "zh-CN"
        ? `\uff0c\u6700\u8fd1\u8fd9\u51e0\u6b21\u8bb0\u5f55\u6574\u4f53\u53d8\u5316\u4e86 ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
        : locale === "es"
          ? ` y en mis registros recientes el cambio acumulado fue de ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
          : `, and across my recent weight logs the overall change was ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
      : "";
  const targetPart =
    typeof input.targetCalories === "number"
      ? locale === "zh-CN"
        ? `\u3002\u6211\u6700\u8fd1\u7684\u70ed\u91cf\u76ee\u6807\u662f ${input.targetCalories} kcal\u3002\u8bf7\u7ed3\u5408\u4f53\u91cd\u8d8b\u52bf\u3001\u996e\u98df\u548c\u5b55\u5468\uff0c\u544a\u8bc9\u6211\u5e94\u8be5\u600e\u4e48\u770b\u8fd9\u4e2a\u53d8\u5316\uff0c\u4ee5\u53ca\u4e0b\u4e00\u6b65\u8be5\u5173\u6ce8\u4ec0\u4e48\u3002`
        : locale === "es"
          ? `. Mi objetivo calorico reciente es ${input.targetCalories} kcal. Ayudame a interpretar esta tendencia junto con mis comidas y la semana de embarazo, y dime que deberia vigilar despues.`
          : `. My recent calorie target is ${input.targetCalories} kcal. Help me interpret this trend alongside meals and pregnancy week, and tell me what to watch next.`
      : locale === "zh-CN"
        ? "\u3002\u8bf7\u7ed3\u5408\u5b55\u671f\u996e\u98df\u548c\u4f53\u91cd\u8282\u594f\uff0c\u544a\u8bc9\u6211\u5e94\u8be5\u600e\u4e48\u770b\u8fd9\u4e2a\u53d8\u5316\uff0c\u4ee5\u53ca\u4e0b\u4e00\u6b65\u8be5\u5173\u6ce8\u4ec0\u4e48\u3002"
        : locale === "es"
          ? `. Ayudame a interpretar este cambio con una mirada practica sobre comida, ritmo y seguimiento.`
          : `. Help me interpret this change with a practical view on meals, pace, and follow-up.`;

  return `${weekPart}${baselinePart}${recentPart}${targetPart}`;
}
