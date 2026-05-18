import type { Locale } from "@/lib/i18n/config";

type MealWeeklySummaryInput = {
  trackedDays: number;
  targetCalories: number | null;
  averageLoggedCalories: number | null;
  topMealTypeLabel: string | null;
  totalEntries: number;
  gestationalWeek: number | null;
};

type MealWeeklyReviewCopy = {
  eyebrow: string;
  title: string;
  description: string;
  summaryTitle: string;
  aiCta: string;
  cards: {
    coverageTitle: string;
    averageTitle: string;
    patternTitle: string;
    formatCoverageBody: (trackedDays: number, totalEntries: number) => string;
    formatAverageBody: (
      averageLoggedCalories: number | null,
      targetCalories: number | null,
    ) => string;
    formatPatternBody: (topMealTypeLabel: string | null, totalEntries: number) => string;
  };
  formatSummaryBody: (input: MealWeeklySummaryInput) => string;
};

const copy: Record<Locale, MealWeeklyReviewCopy> = {
  en: {
    eyebrow: "Weekly meal review",
    title: "Read the last 7 days as a pattern, not a pile of entries.",
    description:
      "This turns recent meal logs into a weekly pacing view so the next AI question starts from a real eating rhythm.",
    summaryTitle: "What the meal log is showing",
    aiCta: "Ask AI to review this week",
    cards: {
      coverageTitle: "Coverage",
      averageTitle: "Average intake",
      patternTitle: "Most common meal anchor",
      formatCoverageBody: (trackedDays, totalEntries) =>
        trackedDays === 0
          ? "No meals have been logged in the last 7 days yet."
          : `${trackedDays} of the last 7 days include meal logs, across ${totalEntries} saved entries.`,
      formatAverageBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "Add more meal logs to estimate a weekly average.";
        }

        if (targetCalories === null) {
          return `Tracked days are averaging about ${averageLoggedCalories} kcal.`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `Tracked days are averaging about ${averageLoggedCalories} kcal, right on the saved target.`
          : `Tracked days are averaging about ${averageLoggedCalories} kcal, ${Math.abs(delta)} kcal ${delta > 0 ? "above" : "below"} the saved target.`;
      },
      formatPatternBody: (topMealTypeLabel, totalEntries) =>
        topMealTypeLabel
          ? `${topMealTypeLabel} appears most often in the recent log, across ${totalEntries} saved meal entries this week.`
          : "Log more than one meal to make the weekly pattern easier to read.",
    },
    formatSummaryBody: ({
      trackedDays,
      targetCalories,
      averageLoggedCalories,
      topMealTypeLabel,
      totalEntries,
      gestationalWeek,
    }) => {
      if (trackedDays === 0 && targetCalories === null) {
        return "You do not have enough meal signal yet. Save a calorie target, then log a few meals so the assistant can review an actual weekly rhythm.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `In week ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "there is no saved calorie target yet"
          : `the saved target is ${targetCalories} kcal`;
      const coveragePart =
        trackedDays === 0
          ? "meal coverage is still blank this week"
          : `meal logs cover ${trackedDays} of the last 7 days`;
      const averagePart =
        averageLoggedCalories === null
          ? "there is not enough intake history to read the weekly pace"
          : `tracked days average about ${averageLoggedCalories} kcal`;
      const patternPart = topMealTypeLabel
        ? `${topMealTypeLabel} is currently the strongest repeated meal anchor across ${totalEntries} saved entries`
        : "there is not enough repetition yet to identify a clear meal pattern";

      return `${weekPart}${targetPart}, ${coveragePart}, ${averagePart}, and ${patternPart}. Use the AI review when you want help adjusting the next few days instead of just one meal.`;
    },
  },
  "zh-CN": {
    eyebrow: "每周饮食复盘",
    title: "把最近 7 天读成一个节奏，而不是一堆零散记录。",
    description:
      "把饮食记录整理成一周视角后，下一次问 AI 就不再是从空白开始，而是基于真实的进食节奏。",
    summaryTitle: "这周饮食记录释放出的信号",
    aiCta: "让 AI 复盘这一周",
    cards: {
      coverageTitle: "记录覆盖度",
      averageTitle: "平均摄入",
      patternTitle: "最常出现的进食锚点",
      formatCoverageBody: (trackedDays, totalEntries) =>
        trackedDays === 0
          ? "最近 7 天还没有留下饮食记录。"
          : `最近 7 天里有 ${trackedDays} 天留下了饮食记录，共保存了 ${totalEntries} 条记录。`,
      formatAverageBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "先补一些饮食记录，才能看出这一周的平均摄入。";
        }

        if (targetCalories === null) {
          return `当前有记录的日期，平均摄入约为 ${averageLoggedCalories} kcal。`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `当前有记录的日期，平均摄入约为 ${averageLoggedCalories} kcal，和已保存目标基本一致。`
          : `当前有记录的日期，平均摄入约为 ${averageLoggedCalories} kcal，较已保存目标${delta > 0 ? "高出" : "低于"} ${Math.abs(delta)} kcal。`;
      },
      formatPatternBody: (topMealTypeLabel, totalEntries) =>
        topMealTypeLabel
          ? `最近这一周里，${topMealTypeLabel} 是最常出现的进食锚点，共记录了 ${totalEntries} 条饮食条目。`
          : "再多记录几餐后，才更容易看出这一周的进食模式。",
    },
    formatSummaryBody: ({
      trackedDays,
      targetCalories,
      averageLoggedCalories,
      topMealTypeLabel,
      totalEntries,
      gestationalWeek,
    }) => {
      if (trackedDays === 0 && targetCalories === null) {
        return "你现在还没有足够的饮食信号。先保存一个热量目标，再补几条饮食记录，AI 才能基于真实的一周节奏来复盘。";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `以孕周第 ${gestationalWeek} 周来看，` : "";
      const targetPart =
        targetCalories === null
          ? "当前还没有保存热量目标"
          : `已保存热量目标为 ${targetCalories} kcal`;
      const coveragePart =
        trackedDays === 0
          ? "这一周的饮食记录仍然空白"
          : `最近 7 天里有 ${trackedDays} 天留下了饮食记录`;
      const averagePart =
        averageLoggedCalories === null
          ? "还不足以判断这一周的摄入节奏"
          : `有记录日期的平均摄入约为 ${averageLoggedCalories} kcal`;
      const patternPart = topMealTypeLabel
        ? `${topMealTypeLabel} 是目前最明显的重复进食锚点，总共记录了 ${totalEntries} 条饮食条目`
        : "目前还看不出足够清晰的重复进食模式";

      return `${weekPart}${targetPart}，${coveragePart}，${averagePart}，${patternPart}。如果你想知道接下来几天该怎么调，比起只问一餐，直接让 AI 复盘这一周会更有价值。`;
    },
  },
  es: {
    eyebrow: "Revision semanal de comidas",
    title: "Lee los ultimos 7 dias como un patron y no como un monton de entradas sueltas.",
    description:
      "Esto convierte el registro reciente en una vista semanal para que la siguiente pregunta a la IA parta de un ritmo real de comidas.",
    summaryTitle: "Lo que muestra el registro de comidas",
    aiCta: "Pedir revision semanal a la IA",
    cards: {
      coverageTitle: "Cobertura",
      averageTitle: "Promedio de ingesta",
      patternTitle: "Ancla de comida mas repetida",
      formatCoverageBody: (trackedDays, totalEntries) =>
        trackedDays === 0
          ? "Todavia no hay comidas registradas en los ultimos 7 dias."
          : `${trackedDays} de los ultimos 7 dias tienen comidas registradas, con ${totalEntries} entradas guardadas.`,
      formatAverageBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "Registra mas comidas para estimar un promedio semanal.";
        }

        if (targetCalories === null) {
          return `Los dias registrados promedian unas ${averageLoggedCalories} kcal.`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `Los dias registrados promedian unas ${averageLoggedCalories} kcal, justo sobre el objetivo guardado.`
          : `Los dias registrados promedian unas ${averageLoggedCalories} kcal, ${Math.abs(delta)} kcal ${delta > 0 ? "por encima" : "por debajo"} del objetivo guardado.`;
      },
      formatPatternBody: (topMealTypeLabel, totalEntries) =>
        topMealTypeLabel
          ? `${topMealTypeLabel} aparece con mas frecuencia en el registro reciente, con ${totalEntries} entradas guardadas esta semana.`
          : "Registra mas de una comida para que el patron semanal sea mas claro.",
    },
    formatSummaryBody: ({
      trackedDays,
      targetCalories,
      averageLoggedCalories,
      topMealTypeLabel,
      totalEntries,
      gestationalWeek,
    }) => {
      if (trackedDays === 0 && targetCalories === null) {
        return "Todavia no hay suficiente senal de comidas. Guarda un objetivo calorico y luego registra algunas comidas para que la IA revise un ritmo semanal real.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `En la semana ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "todavia no hay un objetivo calorico guardado"
          : `el objetivo guardado es ${targetCalories} kcal`;
      const coveragePart =
        trackedDays === 0
          ? "la cobertura de comidas sigue vacia esta semana"
          : `las comidas cubren ${trackedDays} de los ultimos 7 dias`;
      const averagePart =
        averageLoggedCalories === null
          ? "todavia no hay suficiente historial para leer el ritmo semanal"
          : `los dias registrados promedian unas ${averageLoggedCalories} kcal`;
      const patternPart = topMealTypeLabel
        ? `${topMealTypeLabel} es el ancla mas repetida en ${totalEntries} entradas guardadas`
        : "todavia no hay suficiente repeticion para identificar un patron de comida";

      return `${weekPart}${targetPart}, ${coveragePart}, ${averagePart} y ${patternPart}. Usa la revision con IA cuando quieras ajustar los proximos dias y no solo una comida aislada.`;
    },
  },
};

export function getMealWeeklyReviewCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
