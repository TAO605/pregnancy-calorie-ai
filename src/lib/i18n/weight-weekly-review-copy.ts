import type { Locale } from "@/lib/i18n/config";

type WeightWeeklySummaryInput = {
  trackedEntries: number;
  latestWeightKg: number | null;
  weeklyDeltaKg: number | null;
  weeklyMinKg: number | null;
  weeklyMaxKg: number | null;
  targetCalories: number | null;
  gestationalWeek: number | null;
};

type WeightWeeklyReviewCopy = {
  eyebrow: string;
  title: string;
  description: string;
  summaryTitle: string;
  aiCta: string;
  cards: {
    loggingTitle: string;
    changeTitle: string;
    rangeTitle: string;
    formatLoggingBody: (trackedEntries: number, lastLoggedDate: string | null) => string;
    formatChangeBody: (latestWeightKg: number | null, weeklyDeltaKg: number | null) => string;
    formatRangeBody: (weeklyMinKg: number | null, weeklyMaxKg: number | null) => string;
  };
  formatSummaryBody: (input: WeightWeeklySummaryInput) => string;
};

const copy: Record<Locale, WeightWeeklyReviewCopy> = {
  en: {
    eyebrow: "Weekly weight review",
    title: "Turn weight logs into a weekly signal you can actually interpret.",
    description:
      "This section frames the last 7 days of weight entries as a short trend, so the next AI question starts from a pattern instead of a single number.",
    summaryTitle: "What the scale trend is saying",
    aiCta: "Ask AI to review this week",
    cards: {
      loggingTitle: "Logging cadence",
      changeTitle: "Weekly change",
      rangeTitle: "Weekly range",
      formatLoggingBody: (trackedEntries, lastLoggedDate) =>
        trackedEntries === 0
          ? "No weight entries were saved in the last 7 days."
          : `There are ${trackedEntries} saved weight entries in the last 7 days${lastLoggedDate ? `, most recently on ${lastLoggedDate}` : ""}.`,
      formatChangeBody: (latestWeightKg, weeklyDeltaKg) => {
        if (latestWeightKg === null) {
          return "Save a weight entry to start a weekly review.";
        }

        if (weeklyDeltaKg === null) {
          return `The latest saved weight is ${latestWeightKg} kg. Add another entry to unlock a short weekly trend.`;
        }

        return `The latest saved weight is ${latestWeightKg} kg, with a 7-day shift of ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg.`;
      },
      formatRangeBody: (weeklyMinKg, weeklyMaxKg) => {
        if (weeklyMinKg === null || weeklyMaxKg === null) {
          return "You need at least one recent entry to show a weekly range.";
        }

        if (weeklyMinKg === weeklyMaxKg) {
          return `This week's saved range is holding at ${weeklyMinKg} kg.`;
        }

        return `This week's saved range runs from ${weeklyMinKg} kg to ${weeklyMaxKg} kg.`;
      },
    },
    formatSummaryBody: ({
      trackedEntries,
      latestWeightKg,
      weeklyDeltaKg,
      weeklyMinKg,
      weeklyMaxKg,
      targetCalories,
      gestationalWeek,
    }) => {
      if (trackedEntries === 0 && targetCalories === null) {
        return "You do not have enough weekly signal yet. Save a calorie target, then log weight more than once so the assistant can review a real trend.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `In week ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "there is no saved calorie target yet"
          : `the saved calorie target is ${targetCalories} kcal`;
      const loggingPart =
        trackedEntries === 0
          ? "no weight entries were logged in the last 7 days"
          : `${trackedEntries} weight entries were logged in the last 7 days`;
      const changePart =
        latestWeightKg === null
          ? "there is no saved weight to interpret"
          : weeklyDeltaKg === null
            ? `the latest saved weight is ${latestWeightKg} kg`
            : `the 7-day weight shift is ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg`;
      const rangePart =
        weeklyMinKg === null || weeklyMaxKg === null
          ? "the weekly range is still incomplete"
          : weeklyMinKg === weeklyMaxKg
            ? `the weekly range is holding at ${weeklyMinKg} kg`
            : `the weekly range runs from ${weeklyMinKg} kg to ${weeklyMaxKg} kg`;

      return `${weekPart}${targetPart}, ${loggingPart}, ${changePart}, and ${rangePart}. Use the AI review when you want help deciding whether to log more, re-check intake, or escalate the discussion.`;
    },
  },
  "zh-CN": {
    eyebrow: "每周体重复盘",
    title: "把体重记录整理成一周趋势，而不是只盯着单次数字。",
    description:
      "把最近 7 天的体重记录放进短期趋势后，下一次问 AI 就可以从模式出发，而不只是看某一天的体重。",
    summaryTitle: "这一周体重趋势释放出的信号",
    aiCta: "让 AI 复盘这一周",
    cards: {
      loggingTitle: "记录频率",
      changeTitle: "一周变化",
      rangeTitle: "一周波动区间",
      formatLoggingBody: (trackedEntries, lastLoggedDate) =>
        trackedEntries === 0
          ? "最近 7 天还没有保存体重记录。"
          : `最近 7 天里共保存了 ${trackedEntries} 条体重记录${lastLoggedDate ? `，最近一次是在 ${lastLoggedDate}` : ""}。`,
      formatChangeBody: (latestWeightKg, weeklyDeltaKg) => {
        if (latestWeightKg === null) {
          return "先保存一条体重记录，才能开始做每周复盘。";
        }

        if (weeklyDeltaKg === null) {
          return `最近一次保存的体重是 ${latestWeightKg} kg。再补一条记录，才能看到短期趋势。`;
        }

        return `最近一次保存的体重是 ${latestWeightKg} kg，近 7 天变化约为 ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg。`;
      },
      formatRangeBody: (weeklyMinKg, weeklyMaxKg) => {
        if (weeklyMinKg === null || weeklyMaxKg === null) {
          return "至少要有一条最近记录，才能显示这一周的波动区间。";
        }

        if (weeklyMinKg === weeklyMaxKg) {
          return `这一周保存的体重区间目前稳定在 ${weeklyMinKg} kg。`;
        }

        return `这一周保存的体重区间大约在 ${weeklyMinKg} kg 到 ${weeklyMaxKg} kg 之间。`;
      },
    },
    formatSummaryBody: ({
      trackedEntries,
      latestWeightKg,
      weeklyDeltaKg,
      weeklyMinKg,
      weeklyMaxKg,
      targetCalories,
      gestationalWeek,
    }) => {
      if (trackedEntries === 0 && targetCalories === null) {
        return "你现在还没有足够的一周信号。先保存热量目标，再多记录几次体重，AI 才能基于真实趋势来判断。";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `以孕周第 ${gestationalWeek} 周来看，` : "";
      const targetPart =
        targetCalories === null
          ? "当前还没有保存热量目标"
          : `已保存热量目标为 ${targetCalories} kcal`;
      const loggingPart =
        trackedEntries === 0
          ? "最近 7 天没有留下体重记录"
          : `最近 7 天里保存了 ${trackedEntries} 条体重记录`;
      const changePart =
        latestWeightKg === null
          ? "当前还没有可判断的体重数据"
          : weeklyDeltaKg === null
            ? `最近一次保存的体重是 ${latestWeightKg} kg`
            : `近 7 天体重变化约为 ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg`;
      const rangePart =
        weeklyMinKg === null || weeklyMaxKg === null
          ? "这一周的波动区间还不完整"
          : weeklyMinKg === weeklyMaxKg
            ? `这一周的体重区间目前稳定在 ${weeklyMinKg} kg`
            : `这一周的体重区间大约在 ${weeklyMinKg} kg 到 ${weeklyMaxKg} kg 之间`;

      return `${weekPart}${targetPart}，${loggingPart}，${changePart}，${rangePart}。如果你想判断是继续记录、调整摄入，还是该进一步咨询，把这组一周信号交给 AI 会更有意义。`;
    },
  },
  es: {
    eyebrow: "Revision semanal de peso",
    title: "Convierte el registro de peso en una senal semanal que realmente puedas interpretar.",
    description:
      "Esto coloca los ultimos 7 dias dentro de una tendencia corta, para que la siguiente pregunta a la IA parta de un patron y no solo de un numero suelto.",
    summaryTitle: "Lo que esta diciendo la tendencia del peso",
    aiCta: "Pedir revision semanal a la IA",
    cards: {
      loggingTitle: "Frecuencia de registro",
      changeTitle: "Cambio semanal",
      rangeTitle: "Rango semanal",
      formatLoggingBody: (trackedEntries, lastLoggedDate) =>
        trackedEntries === 0
          ? "Todavia no hay pesos guardados en los ultimos 7 dias."
          : `Hay ${trackedEntries} pesos guardados en los ultimos 7 dias${lastLoggedDate ? `, el ultimo en ${lastLoggedDate}` : ""}.`,
      formatChangeBody: (latestWeightKg, weeklyDeltaKg) => {
        if (latestWeightKg === null) {
          return "Guarda un peso para iniciar una revision semanal.";
        }

        if (weeklyDeltaKg === null) {
          return `El ultimo peso guardado es ${latestWeightKg} kg. Guarda otro dato para ver una tendencia corta.`;
        }

        return `El ultimo peso guardado es ${latestWeightKg} kg, con un cambio de 7 dias de ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg.`;
      },
      formatRangeBody: (weeklyMinKg, weeklyMaxKg) => {
        if (weeklyMinKg === null || weeklyMaxKg === null) {
          return "Necesitas al menos una entrada reciente para mostrar un rango semanal.";
        }

        if (weeklyMinKg === weeklyMaxKg) {
          return `El rango guardado de esta semana se mantiene en ${weeklyMinKg} kg.`;
        }

        return `El rango guardado de esta semana va de ${weeklyMinKg} kg a ${weeklyMaxKg} kg.`;
      },
    },
    formatSummaryBody: ({
      trackedEntries,
      latestWeightKg,
      weeklyDeltaKg,
      weeklyMinKg,
      weeklyMaxKg,
      targetCalories,
      gestationalWeek,
    }) => {
      if (trackedEntries === 0 && targetCalories === null) {
        return "Todavia no hay suficiente senal semanal. Guarda un objetivo calorico y luego registra el peso mas de una vez para que la IA revise una tendencia real.";
      }

      const weekPart =
        typeof gestationalWeek === "number" ? `En la semana ${gestationalWeek}, ` : "";
      const targetPart =
        targetCalories === null
          ? "todavia no hay un objetivo calorico guardado"
          : `el objetivo calorico guardado es ${targetCalories} kcal`;
      const loggingPart =
        trackedEntries === 0
          ? "no hay pesos registrados en los ultimos 7 dias"
          : `hay ${trackedEntries} pesos registrados en los ultimos 7 dias`;
      const changePart =
        latestWeightKg === null
          ? "todavia no hay un peso guardado que interpretar"
          : weeklyDeltaKg === null
            ? `el ultimo peso guardado es ${latestWeightKg} kg`
            : `el cambio de peso en 7 dias es ${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg`;
      const rangePart =
        weeklyMinKg === null || weeklyMaxKg === null
          ? "el rango semanal todavia esta incompleto"
          : weeklyMinKg === weeklyMaxKg
            ? `el rango semanal se mantiene en ${weeklyMinKg} kg`
            : `el rango semanal va de ${weeklyMinKg} kg a ${weeklyMaxKg} kg`;

      return `${weekPart}${targetPart}, ${loggingPart}, ${changePart} y ${rangePart}. Usa la revision con IA cuando quieras decidir si conviene seguir registrando, revisar la ingesta o escalar la conversacion.`;
    },
  },
};

export function getWeightWeeklyReviewCopy(locale: Locale) {
  return copy[locale];
}
