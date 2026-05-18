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
    return `\u8bf7\u57fa\u4e8e\u6211\u6700\u8fd1\u4e00\u5468\u7684\u5b55\u671f\u8bb0\u5f55\u505a\u4e00\u6b21\u590d\u76d8\u3002\u5f53\u524d\u5b55\u5468\u662f\u7b2c ${weekLabel} \u5468\uff0c\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807\u662f ${targetLabel}\uff0c\u6700\u8fd1 7 \u5929\u91cc\u6709 ${input.trackedMealDays} \u5929\u8bb0\u5f55\u4e86\u996e\u98df\uff0c\u6709\u8bb0\u5f55\u65e5\u671f\u7684\u5e73\u5747\u6444\u5165\u7ea6\u4e3a ${averageLabel}\uff0c\u6700\u8fd1\u4e00\u6b21\u4f53\u91cd\u662f ${weightLabel}\uff0c\u8fd1\u671f\u4f53\u91cd\u53d8\u5316\u662f ${trendLabel}\uff0c\u53c2\u8003\u89c4\u5219\u6765\u6e90\u662f ${sourceLabel}\u3002\u8bf7\u544a\u8bc9\u6211\uff1a1\uff09\u8fd9\u4e00\u5468\u7684\u8282\u594f\u662f\u5426\u7a33\u5b9a\uff1b2\uff09\u63a5\u4e0b\u6765\u66f4\u503c\u5f97\u4f18\u5148\u8c03\u6574\u7684\u662f\u996e\u98df\u7ed3\u6784\u3001\u8bb0\u5f55\u9891\u7387\u8fd8\u662f\u91cd\u65b0\u8ba1\u7b97\uff1b3\uff09\u4ec0\u4e48\u60c5\u51b5\u4e0b\u6211\u5e94\u8be5\u53bb\u95ee\u533b\u751f\u6216\u8425\u517b\u5e08\u3002`;
  }

  if (locale === "es") {
    return `Haz una revision de mi ultima semana de seguimiento del embarazo. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, registre comidas en ${input.trackedMealDays} de los ultimos 7 dias, el promedio de los dias registrados es ${averageLabel}, mi ultimo peso es ${weightLabel}, el cambio reciente del peso es ${trendLabel} y la guia usada es ${sourceLabel}. Dime: 1) si el ritmo semanal parece estable; 2) si deberia priorizar estructura de comidas, frecuencia de registro o recalcular; 3) en que casos deberia consultar a una clinica o dietista prenatal.`;
  }

  return `Review my last week of pregnancy tracking. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged meals on ${input.trackedMealDays} of the last 7 days, tracked days average ${averageLabel}, my latest weight is ${weightLabel}, my recent weight shift is ${trendLabel}, and the guideline source is ${sourceLabel}. Tell me: 1) whether the weekly rhythm looks stable; 2) whether I should prioritize meal structure, more consistent logging, or recalculating; 3) what should trigger a clinician or prenatal dietitian conversation.`;
}
