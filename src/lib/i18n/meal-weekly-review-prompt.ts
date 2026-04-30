import type { Locale } from "@/lib/i18n/config";

type MealWeeklyReviewPromptInput = {
  targetCalories: number | null;
  trackedDays: number;
  averageLoggedCalories: number | null;
  topMealTypeLabel: string | null;
  totalEntries: number;
  gestationalWeek: number | null;
  guidelineSource: string | null;
};

export function buildMealWeeklyReviewPrompt(
  locale: Locale,
  input: MealWeeklyReviewPromptInput,
) {
  const weekLabel =
    typeof input.gestationalWeek === "number" ? input.gestationalWeek : "unknown";
  const targetLabel =
    typeof input.targetCalories === "number" ? `${input.targetCalories} kcal` : "not saved yet";
  const averageLabel =
    typeof input.averageLoggedCalories === "number"
      ? `${input.averageLoggedCalories} kcal`
      : "not enough data yet";
  const mealTypeLabel = input.topMealTypeLabel ?? "no clear dominant meal yet";
  const sourceLabel = input.guidelineSource?.trim() || "the saved guideline";

  if (locale === "zh-CN") {
    return `请基于我最近一周的饮食记录做一次复盘。当前孕周是第 ${weekLabel} 周，保存的热量目标是 ${targetLabel}，最近 7 天里有 ${input.trackedDays} 天记录了饮食，有记录日期的平均摄入约为 ${averageLabel}，这一周共保存了 ${input.totalEntries} 条饮食记录，最常出现的进食锚点是 ${mealTypeLabel}，参考规则来源是 ${sourceLabel}。请告诉我：1）这一周的饮食节奏是否稳定；2）我更应该优先补记录、调整餐次结构，还是重新计算目标；3）接下来 3 天最实用的调整建议是什么。`;
  }

  if (locale === "es") {
    return `Haz una revision de mis comidas de la ultima semana. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, registre comidas en ${input.trackedDays} de los ultimos 7 dias, el promedio de los dias registrados es ${averageLabel}, esta semana guarde ${input.totalEntries} entradas y la comida mas repetida fue ${mealTypeLabel}. La guia de referencia es ${sourceLabel}. Dime: 1) si el ritmo semanal parece estable; 2) si deberia priorizar registrar mejor, cambiar la estructura de comidas o recalcular; 3) cuales son los ajustes mas utiles para los proximos 3 dias.`;
  }

  return `Review my meal logs from the last week. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged meals on ${input.trackedDays} of the last 7 days, tracked days average ${averageLabel}, I saved ${input.totalEntries} meal entries this week, and the most repeated meal anchor is ${mealTypeLabel}. The guideline source is ${sourceLabel}. Tell me: 1) whether the weekly meal rhythm looks stable; 2) whether I should prioritize better logging, changing meal structure, or recalculating; 3) the most practical adjustments for the next 3 days.`;
}
