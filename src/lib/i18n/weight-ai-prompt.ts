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
        ? `我现在大约在孕 ${input.summary.gestationalWeek} 周，`
        : locale === "es"
          ? `Estoy aproximadamente en la semana ${input.summary.gestationalWeek} y `
          : `I am around week ${input.summary.gestationalWeek}, and `
      : locale === "zh-CN"
        ? ""
        : "";
  const baselinePart =
    typeof input.summary.prePregnancyDeltaKg === "number"
      ? locale === "zh-CN"
        ? `当前保存体重大约是 ${input.summary.currentWeightKg} kg，和孕前相比变化了 ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg`
        : locale === "es"
          ? `mi peso guardado actual es ${input.summary.currentWeightKg} kg y esta ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg frente al peso previo al embarazo`
          : `my current saved weight is ${input.summary.currentWeightKg} kg, which is ${input.summary.prePregnancyDeltaKg > 0 ? "+" : ""}${input.summary.prePregnancyDeltaKg} kg versus pre-pregnancy`
      : locale === "zh-CN"
        ? `当前保存体重大约是 ${input.summary.currentWeightKg} kg`
        : locale === "es"
          ? `mi peso guardado actual es ${input.summary.currentWeightKg} kg`
          : `my current saved weight is ${input.summary.currentWeightKg} kg`;
  const recentPart =
    typeof input.summary.recentTrendDeltaKg === "number"
      ? locale === "zh-CN"
        ? `，最近这几次记录整体变化了 ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
        : locale === "es"
          ? ` y en mis registros recientes el cambio acumulado fue de ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
          : `, and across my recent weight logs the overall change was ${input.summary.recentTrendDeltaKg > 0 ? "+" : ""}${input.summary.recentTrendDeltaKg} kg`
      : "";
  const targetPart =
    typeof input.targetCalories === "number"
      ? locale === "zh-CN"
        ? `。我最近的热量目标是 ${input.targetCalories} kcal。请结合体重趋势、饮食和孕周，告诉我应该怎么看这个变化，以及下一步该关注什么。`
        : locale === "es"
          ? `. Mi objetivo calorico reciente es ${input.targetCalories} kcal. Ayudame a interpretar esta tendencia junto con mis comidas y la semana de embarazo, y dime que deberia vigilar despues.`
          : `. My recent calorie target is ${input.targetCalories} kcal. Help me interpret this trend alongside meals and pregnancy week, and tell me what to watch next.`
      : locale === "zh-CN"
        ? "。请结合孕期饮食和体重节奏，告诉我应该怎么看这个变化，以及下一步该关注什么。"
        : locale === "es"
          ? `. Ayudame a interpretar este cambio con una mirada practica sobre comida, ritmo y seguimiento.`
          : `. Help me interpret this change with a practical view on meals, pace, and follow-up.`;

  return `${weekPart}${baselinePart}${recentPart}${targetPart}`;
}
