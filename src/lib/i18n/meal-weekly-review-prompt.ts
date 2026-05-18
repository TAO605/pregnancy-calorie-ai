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
    return `\u8bf7\u57fa\u4e8e\u6211\u6700\u8fd1\u4e00\u5468\u7684\u996e\u98df\u8bb0\u5f55\u505a\u4e00\u6b21\u590d\u76d8\u3002\u5f53\u524d\u5b55\u5468\u662f\u7b2c ${weekLabel} \u5468\uff0c\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807\u662f ${targetLabel}\uff0c\u6700\u8fd1 7 \u5929\u91cc\u6709 ${input.trackedDays} \u5929\u8bb0\u5f55\u4e86\u996e\u98df\uff0c\u6709\u8bb0\u5f55\u65e5\u671f\u7684\u5e73\u5747\u6444\u5165\u7ea6\u4e3a ${averageLabel}\uff0c\u8fd9\u4e00\u5468\u5171\u4fdd\u5b58\u4e86 ${input.totalEntries} \u6761\u996e\u98df\u8bb0\u5f55\uff0c\u6700\u5e38\u51fa\u73b0\u7684\u8fdb\u98df\u951a\u70b9\u662f ${mealTypeLabel}\uff0c\u53c2\u8003\u89c4\u5219\u6765\u6e90\u662f ${sourceLabel}\u3002\u8bf7\u544a\u8bc9\u6211\uff1a1\uff09\u8fd9\u4e00\u5468\u7684\u996e\u98df\u8282\u594f\u662f\u5426\u7a33\u5b9a\uff1b2\uff09\u6211\u66f4\u5e94\u8be5\u4f18\u5148\u8865\u8bb0\u5f55\u3001\u8c03\u6574\u9910\u6b21\u7ed3\u6784\uff0c\u8fd8\u662f\u91cd\u65b0\u8ba1\u7b97\u76ee\u6807\uff1b3\uff09\u63a5\u4e0b\u6765 3 \u5929\u6700\u5b9e\u7528\u7684\u8c03\u6574\u5efa\u8bae\u662f\u4ec0\u4e48\u3002`;
  }

  if (locale === "es") {
    return `Haz una revision de mis comidas de la ultima semana. Estoy en la semana ${weekLabel}, mi objetivo guardado es ${targetLabel}, registre comidas en ${input.trackedDays} de los ultimos 7 dias, el promedio de los dias registrados es ${averageLabel}, esta semana guarde ${input.totalEntries} entradas y la comida mas repetida fue ${mealTypeLabel}. La guia de referencia es ${sourceLabel}. Dime: 1) si el ritmo semanal parece estable; 2) si deberia priorizar registrar mejor, cambiar la estructura de comidas o recalcular; 3) cuales son los ajustes mas utiles para los proximos 3 dias.`;
  }

  return `Review my meal logs from the last week. I am in week ${weekLabel}, my saved calorie target is ${targetLabel}, I logged meals on ${input.trackedDays} of the last 7 days, tracked days average ${averageLabel}, I saved ${input.totalEntries} meal entries this week, and the most repeated meal anchor is ${mealTypeLabel}. The guideline source is ${sourceLabel}. Tell me: 1) whether the weekly meal rhythm looks stable; 2) whether I should prioritize better logging, changing meal structure, or recalculating; 3) the most practical adjustments for the next 3 days.`;
}
