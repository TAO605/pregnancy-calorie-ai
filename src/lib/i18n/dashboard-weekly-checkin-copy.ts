import type { Locale } from "@/lib/i18n/config";

type WeeklyCheckInSummaryInput = {
  trackedMealDays: number;
  targetCalories: number | null;
  averageLoggedCalories: number | null;
  latestWeightKg: number | null;
  weightTrendDeltaKg: number | null;
  gestationalWeek: number | null;
};

type DashboardWeeklyCheckInCopy = {
  eyebrow: string;
  title: string;
  description: string;
  summaryTitle: string;
  aiCta: string;
  mealsCta: string;
  cards: {
    mealCoverageTitle: string;
    averageIntakeTitle: string;
    weightDirectionTitle: string;
    formatMealCoverageBody: (trackedMealDays: number) => string;
    formatAverageIntakeBody: (
      averageLoggedCalories: number | null,
      targetCalories: number | null,
    ) => string;
    formatWeightDirectionBody: (
      latestWeightKg: number | null,
      weightTrendDeltaKg: number | null,
      gestationalWeek: number | null,
    ) => string;
  };
  formatSummaryBody: (input: WeeklyCheckInSummaryInput) => string;
};

const copy: Record<Locale, DashboardWeeklyCheckInCopy> = {
  en: {
    eyebrow: "Weekly check-in",
    title: "Turn saved activity into a real weekly review.",
    description:
      "Use the last 7 days of meals, weight, and target data to see whether the routine is visible enough for a better AI follow-up.",
    summaryTitle: "What this week is saying",
    aiCta: "Ask AI for a weekly review",
    mealsCta: "Log more meals",
    cards: {
      mealCoverageTitle: "Meal coverage",
      averageIntakeTitle: "Average intake",
      weightDirectionTitle: "Weight direction",
      formatMealCoverageBody: (trackedMealDays) =>
        trackedMealDays === 0
          ? "No meals have been logged in the last 7 days yet."
          : `Meals were logged on ${trackedMealDays} of the last 7 days.`,
      formatAverageIntakeBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "Add meal logs to compare an average day against the target.";
        }

        if (targetCalories === null) {
          return `Tracked days are averaging about ${averageLoggedCalories} kcal so far.`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `Tracked days are averaging about ${averageLoggedCalories} kcal, right on the saved target.`
          : `Tracked days are averaging about ${averageLoggedCalories} kcal, ${Math.abs(delta)} kcal ${delta > 0 ? "above" : "below"} the saved target.`;
      },
      formatWeightDirectionBody: (latestWeightKg, weightTrendDeltaKg, gestationalWeek) => {
        if (latestWeightKg === null) {
          return "Save a weight entry to make the weekly review more useful.";
        }

        const weekLabel =
          typeof gestationalWeek === "number" ? ` in week ${gestationalWeek}` : "";

        if (weightTrendDeltaKg === null) {
          return `Latest saved weight is ${latestWeightKg} kg${weekLabel}. Add another entry to unlock a short trend.`;
        }

        return `Latest saved weight is ${latestWeightKg} kg${weekLabel}, with a recent shift of ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg.`;
      },
    },
    formatSummaryBody: ({
      trackedMealDays,
      targetCalories,
      averageLoggedCalories,
      latestWeightKg,
      weightTrendDeltaKg,
      gestationalWeek,
    }) => {
      if (targetCalories === null && trackedMealDays === 0 && latestWeightKg === null) {
        return "You do not have enough saved signal yet. Start with the calculator, then log meals or weight so the assistant can review a real pattern.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `For week ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "there is no saved calorie target yet"
          : `your saved target is ${targetCalories} kcal`;
      const mealsPart =
        trackedMealDays === 0
          ? "meal tracking is still blank this week"
          : `meal logs cover ${trackedMealDays} of the last 7 days`;
      const intakePart =
        averageLoggedCalories === null
          ? "there is not enough intake history to compare daily pacing"
          : `tracked days average about ${averageLoggedCalories} kcal`;
      const weightPart =
        latestWeightKg === null
          ? "weight trend data is still missing"
          : weightTrendDeltaKg === null
            ? `the latest weight entry is ${latestWeightKg} kg`
            : `recent weight movement is ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg`;

      return `${weekPart}${targetPart}, ${mealsPart}, ${intakePart}, and ${weightPart}. Use the AI review when you want help turning that signal into practical next steps.`;
    },
  },
  "zh-CN": {
    eyebrow: "每周复盘",
    title: "把已保存记录变成真正可读的一周总结。",
    description:
      "把最近 7 天的饮食、体重和热量目标放在一起，看当前记录是否已经足够支撑一次更有价值的 AI 跟进。",
    summaryTitle: "这一周释放出的信号",
    aiCta: "让 AI 做一周复盘",
    mealsCta: "继续记录饮食",
    cards: {
      mealCoverageTitle: "饮食覆盖度",
      averageIntakeTitle: "平均摄入",
      weightDirectionTitle: "体重方向",
      formatMealCoverageBody: (trackedMealDays) =>
        trackedMealDays === 0
          ? "最近 7 天还没有留下饮食记录。"
          : `最近 7 天里，有 ${trackedMealDays} 天留下了饮食记录。`,
      formatAverageIntakeBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "先补充饮食记录，才能把平均摄入和目标热量放在一起看。";
        }

        if (targetCalories === null) {
          return `当前有记录的日期，平均摄入大约是 ${averageLoggedCalories} kcal。`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `当前有记录的日期，平均摄入大约是 ${averageLoggedCalories} kcal，和已保存目标基本一致。`
          : `当前有记录的日期，平均摄入大约是 ${averageLoggedCalories} kcal，较已保存目标${delta > 0 ? "高出" : "低于"} ${Math.abs(delta)} kcal。`;
      },
      formatWeightDirectionBody: (latestWeightKg, weightTrendDeltaKg, gestationalWeek) => {
        if (latestWeightKg === null) {
          return "补一条体重记录，会让这次每周复盘更有判断价值。";
        }

        const weekLabel =
          typeof gestationalWeek === "number" ? `，当前孕周第 ${gestationalWeek} 周` : "";

        if (weightTrendDeltaKg === null) {
          return `最近一次保存的体重是 ${latestWeightKg} kg${weekLabel}。再记录一次，才能看到短期趋势。`;
        }

        return `最近一次保存的体重是 ${latestWeightKg} kg${weekLabel}，近期变化约为 ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg。`;
      },
    },
    formatSummaryBody: ({
      trackedMealDays,
      targetCalories,
      averageLoggedCalories,
      latestWeightKg,
      weightTrendDeltaKg,
      gestationalWeek,
    }) => {
      if (targetCalories === null && trackedMealDays === 0 && latestWeightKg === null) {
        return "你现在还没有足够的已保存信号。先跑一次计算器，再补几条饮食或体重记录，AI 才能基于真实节奏做复盘。";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `以孕周第 ${gestationalWeek} 周来看，` : "";
      const targetPart =
        targetCalories === null
          ? "当前还没有保存热量目标"
          : `你保存的热量目标是 ${targetCalories} kcal`;
      const mealsPart =
        trackedMealDays === 0
          ? "这一周的饮食记录还是空白"
          : `最近 7 天里有 ${trackedMealDays} 天留下了饮食记录`;
      const intakePart =
        averageLoggedCalories === null
          ? "还不足以判断平均摄入节奏"
          : `有记录日期的平均摄入约为 ${averageLoggedCalories} kcal`;
      const weightPart =
        latestWeightKg === null
          ? "体重趋势信息仍然缺失"
          : weightTrendDeltaKg === null
            ? `最近一次体重记录为 ${latestWeightKg} kg`
            : `近期体重变化约为 ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg`;

      return `${weekPart}${targetPart}，${mealsPart}，${intakePart}，${weightPart}。如果你想知道接下来该怎么调，就可以直接把这组上下文交给 AI。`;
    },
  },
  es: {
    eyebrow: "Revision semanal",
    title: "Convierte la actividad guardada en una lectura semanal real.",
    description:
      "Junta las comidas, el peso y el objetivo calorico de los ultimos 7 dias para ver si ya existe una rutina lo bastante visible para una mejor consulta con IA.",
    summaryTitle: "Lo que esta diciendo esta semana",
    aiCta: "Pedir revision semanal a la IA",
    mealsCta: "Registrar mas comidas",
    cards: {
      mealCoverageTitle: "Cobertura de comidas",
      averageIntakeTitle: "Ingesta media",
      weightDirectionTitle: "Direccion del peso",
      formatMealCoverageBody: (trackedMealDays) =>
        trackedMealDays === 0
          ? "Todavia no hay comidas registradas en los ultimos 7 dias."
          : `Hay comidas registradas en ${trackedMealDays} de los ultimos 7 dias.`,
      formatAverageIntakeBody: (averageLoggedCalories, targetCalories) => {
        if (averageLoggedCalories === null) {
          return "Registra comidas para comparar un dia promedio contra el objetivo.";
        }

        if (targetCalories === null) {
          return `Los dias registrados promedian unas ${averageLoggedCalories} kcal.`;
        }

        const delta = averageLoggedCalories - targetCalories;
        return delta === 0
          ? `Los dias registrados promedian unas ${averageLoggedCalories} kcal, justo sobre el objetivo guardado.`
          : `Los dias registrados promedian unas ${averageLoggedCalories} kcal, ${Math.abs(delta)} kcal ${delta > 0 ? "por encima" : "por debajo"} del objetivo guardado.`;
      },
      formatWeightDirectionBody: (latestWeightKg, weightTrendDeltaKg, gestationalWeek) => {
        if (latestWeightKg === null) {
          return "Guarda un peso para que la revision semanal sea mas util.";
        }

        const weekLabel =
          typeof gestationalWeek === "number" ? ` en la semana ${gestationalWeek}` : "";

        if (weightTrendDeltaKg === null) {
          return `El ultimo peso guardado es ${latestWeightKg} kg${weekLabel}. Guarda otro dato para ver una tendencia corta.`;
        }

        return `El ultimo peso guardado es ${latestWeightKg} kg${weekLabel}, con un cambio reciente de ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg.`;
      },
    },
    formatSummaryBody: ({
      trackedMealDays,
      targetCalories,
      averageLoggedCalories,
      latestWeightKg,
      weightTrendDeltaKg,
      gestationalWeek,
    }) => {
      if (targetCalories === null && trackedMealDays === 0 && latestWeightKg === null) {
        return "Todavia no hay suficiente senal guardada. Empieza con la calculadora y luego registra comidas o peso para que la IA revise un patron real.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `Para la semana ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "todavia no hay un objetivo calorico guardado"
          : `tu objetivo guardado es ${targetCalories} kcal`;
      const mealsPart =
        trackedMealDays === 0
          ? "el seguimiento de comidas sigue vacio esta semana"
          : `las comidas cubren ${trackedMealDays} de los ultimos 7 dias`;
      const intakePart =
        averageLoggedCalories === null
          ? "todavia no hay suficiente historial para leer el ritmo de ingesta"
          : `los dias registrados promedian unas ${averageLoggedCalories} kcal`;
      const weightPart =
        latestWeightKg === null
          ? "todavia falta senal de peso"
          : weightTrendDeltaKg === null
            ? `el ultimo peso guardado es ${latestWeightKg} kg`
            : `el movimiento reciente del peso es ${weightTrendDeltaKg > 0 ? "+" : ""}${weightTrendDeltaKg} kg`;

      return `${weekPart}${targetPart}, ${mealsPart}, ${intakePart} y ${weightPart}. Usa la revision con IA cuando quieras convertir esa senal en siguientes pasos concretos.`;
    },
  },
};

export function getDashboardWeeklyCheckInCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
