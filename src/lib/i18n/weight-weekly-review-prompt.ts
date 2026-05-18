import type { Locale } from "@/lib/i18n/config";

type WeightWeeklyReviewPromptInput = {
  targetCalories: number | null;
  trackedEntries: number;
  latestWeightKg: number | null;
  weeklyDeltaKg: number | null;
  weeklyMinKg: number | null;
  weeklyMaxKg: number | null;
  gestationalWeek: number | null;
  guidelineSource: string | null;
};

export function buildWeightWeeklyReviewPrompt(
  locale: Locale,
  input: WeightWeeklyReviewPromptInput,
) {
  const weekLabel =
    typeof input.gestationalWeek === "number" ? input.gestationalWeek : "unknown";
  const targetLabel =
    typeof input.targetCalories === "number" ? `${input.targetCalories} kcal` : "not saved yet";
  const latestWeightLabel =
    typeof input.latestWeightKg === "number" ? `${input.latestWeightKg} kg` : "not logged yet";
  const weeklyDeltaLabel =
    typeof input.weeklyDeltaKg === "number"
      ? `${input.weeklyDeltaKg > 0 ? "+" : ""}${input.weeklyDeltaKg} kg`
      : "not enough data yet";
  const weeklyRangeLabel =
    typeof input.weeklyMinKg === "number" && typeof input.weeklyMaxKg === "number"
      ? `${input.weeklyMinKg}-${input.weeklyMaxKg} kg`
      : "not enough range data yet";
  const sourceLabel = input.guidelineSource?.trim() || "the saved guideline";

  if (locale === "zh-CN") {
    return `\u8bf7\u57fa\u4e8e\u6211\u6700\u8fd1\u4e00\u5468\u7684\u4f53\u91cd\u8bb0\u5f55\u505a\u4e00\u6b21\u590d\u76d8\u3002\u5f53\u524d\u5b55\u5468\u662f\u7b2c ${weekLabel} \u5468\uff0c\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807\u662f ${targetLabel}\uff0c\u6700\u8fd1 7 \u5929\u91cc\u5171\u4fdd\u5b58\u4e86 ${input.trackedEntries} \u6761\u4f53\u91cd\u8bb0\u5f55\uff0c\u6700\u8fd1\u4e00\u6b21\u4f53\u91cd\u662f ${latestWeightLabel}\uff0c\u8fd1 7 \u5929\u4f53\u91cd\u53d8\u5316\u7ea6\u4e3a ${weeklyDeltaLabel}\uff0c\u8fd9\u4e00\u5468\u7684\u4f53\u91cd\u533a\u95f4\u5927\u7ea6\u662f ${weeklyRangeLabel}\uff0c\u53c2\u8003\u89c4\u5219\u6765\u6e90\u662f ${sourceLabel}\u3002\u8bf7\u544a\u8bc9\u6211\uff1a1\uff09\u8fd9\u7ec4\u8d8b\u52bf\u662f\u5426\u7a33\u5b9a\uff1b2\uff09\u6211\u66f4\u5e94\u8be5\u4f18\u5148\u7ee7\u7eed\u8bb0\u5f55\u3001\u8c03\u6574\u6444\u5165\uff0c\u8fd8\u662f\u91cd\u65b0\u8ba1\u7b97\uff1b3\uff09\u4ec0\u4e48\u53d8\u5316\u66f4\u503c\u5f97\u5c3d\u5feb\u95ee\u533b\u751f\u6216\u8425\u517b\u5e08\u3002`;
  }

  if (locale === "es") {
    return `Haz una revision de mi peso de la ultima semana. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, guarde ${input.trackedEntries} pesos en los ultimos 7 dias, mi ultimo peso es ${latestWeightLabel}, el cambio de 7 dias es ${weeklyDeltaLabel}, el rango semanal es ${weeklyRangeLabel} y la guia de referencia es ${sourceLabel}. Dime: 1) si esta tendencia parece estable; 2) si deberia priorizar seguir registrando, ajustar la ingesta o recalcular; 3) que cambios merecen consultar antes a una clinica o dietista prenatal.`;
  }

  return `Review my weight log from the last week. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged ${input.trackedEntries} weight entries in the last 7 days, my latest weight is ${latestWeightLabel}, my 7-day weight shift is ${weeklyDeltaLabel}, my weekly range is ${weeklyRangeLabel}, and the guideline source is ${sourceLabel}. Tell me: 1) whether this trend looks stable; 2) whether I should prioritize more logging, intake adjustments, or recalculating; 3) what changes should trigger a clinician or prenatal dietitian conversation sooner.`;
}
