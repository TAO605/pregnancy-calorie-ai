import type { Locale } from "@/lib/i18n/config";

type DashboardWeeklyCheckInPromptInput = {
  targetCalories: number | null;
  trackedMealDays: number;
  averageLoggedCalories: number | null;
  latestWeightKg: number | null;
  weightTrendDeltaKg: number | null;
  gestationalWeek: number | null;
  guidelineSource: string | null;
};

export function buildDashboardWeeklyCheckInPrompt(
  locale: Locale,
  input: DashboardWeeklyCheckInPromptInput,
) {
  const weekLabel =
    typeof input.gestationalWeek === "number" ? input.gestationalWeek : "unknown";
  const targetLabel =
    typeof input.targetCalories === "number" ? `${input.targetCalories} kcal` : "not saved yet";
  const averageLabel =
    typeof input.averageLoggedCalories === "number"
      ? `${input.averageLoggedCalories} kcal`
      : "not enough data yet";
  const weightLabel =
    typeof input.latestWeightKg === "number" ? `${input.latestWeightKg} kg` : "not logged yet";
  const trendLabel =
    typeof input.weightTrendDeltaKg === "number"
      ? `${input.weightTrendDeltaKg > 0 ? "+" : ""}${input.weightTrendDeltaKg} kg`
      : "not enough weight data yet";
  const sourceLabel = input.guidelineSource?.trim() || "the saved guideline";

  if (locale === "zh-CN") {
    return `请基于我最近一周的孕期记录做一次复盘。当前孕周是第 ${weekLabel} 周，保存的热量目标是 ${targetLabel}，最近 7 天里有 ${input.trackedMealDays} 天记录了饮食，有记录日期的平均摄入约为 ${averageLabel}，最近一次体重是 ${weightLabel}，近期体重变化是 ${trendLabel}，参考规则来源是 ${sourceLabel}。请告诉我：1）这一周的节奏是否稳定；2）接下来更值得优先调整的是饮食结构、记录频率还是重新计算；3）什么情况下我应该去问医生或营养师。`;
  }

  if (locale === "es") {
    return `Haz una revision de mi ultima semana de seguimiento del embarazo. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, registre comidas en ${input.trackedMealDays} de los ultimos 7 dias, el promedio de los dias registrados es ${averageLabel}, mi ultimo peso es ${weightLabel}, el cambio reciente del peso es ${trendLabel} y la guia usada es ${sourceLabel}. Dime: 1) si el ritmo semanal parece estable; 2) si deberia priorizar estructura de comidas, frecuencia de registro o recalcular; 3) en que casos deberia consultar a una clinica o dietista prenatal.`;
  }

  return `Review my last week of pregnancy tracking. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged meals on ${input.trackedMealDays} of the last 7 days, tracked days average ${averageLabel}, my latest weight is ${weightLabel}, my recent weight shift is ${trendLabel}, and the guideline source is ${sourceLabel}. Tell me: 1) whether the weekly rhythm looks stable; 2) whether I should prioritize meal structure, more consistent logging, or recalculating; 3) what should trigger a clinician or prenatal dietitian conversation.`;
}
