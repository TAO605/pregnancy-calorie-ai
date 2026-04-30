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
    return `请基于我最近一周的体重记录做一次复盘。当前孕周是第 ${weekLabel} 周，保存的热量目标是 ${targetLabel}，最近 7 天里共保存了 ${input.trackedEntries} 条体重记录，最近一次体重是 ${latestWeightLabel}，近 7 天体重变化约为 ${weeklyDeltaLabel}，这一周的体重区间大约是 ${weeklyRangeLabel}，参考规则来源是 ${sourceLabel}。请告诉我：1）这组趋势是否稳定；2）我更应该优先继续记录、调整摄入，还是重新计算；3）什么变化更值得尽快问医生或营养师。`;
  }

  if (locale === "es") {
    return `Haz una revision de mi peso de la ultima semana. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, guarde ${input.trackedEntries} pesos en los ultimos 7 dias, mi ultimo peso es ${latestWeightLabel}, el cambio de 7 dias es ${weeklyDeltaLabel}, el rango semanal es ${weeklyRangeLabel} y la guia de referencia es ${sourceLabel}. Dime: 1) si esta tendencia parece estable; 2) si deberia priorizar seguir registrando, ajustar la ingesta o recalcular; 3) que cambios merecen consultar antes a una clinica o dietista prenatal.`;
  }

  return `Review my weight log from the last week. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged ${input.trackedEntries} weight entries in the last 7 days, my latest weight is ${latestWeightLabel}, my 7-day weight shift is ${weeklyDeltaLabel}, my weekly range is ${weeklyRangeLabel}, and the guideline source is ${sourceLabel}. Tell me: 1) whether this trend looks stable; 2) whether I should prioritize more logging, intake adjustments, or recalculating; 3) what changes should trigger a clinician or prenatal dietitian conversation sooner.`;
}
