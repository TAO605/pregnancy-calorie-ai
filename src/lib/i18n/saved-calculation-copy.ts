import type { Locale } from "@/lib/i18n/config";

type SavedCalculationCopy = {
  dashboard: {
    latestTargetLabel: string;
    latestTargetEmpty: string;
    savedLabel: string;
    sourceLabel: string;
    weekLabel: string;
  };
  ai: {
    contextTitle: string;
    contextEmpty: string;
    latestTargetLabel: string;
    rangeLabel: string;
    weekLabel: string;
    sourceLabel: string;
    regionLabel: string;
    mealsLabel: string;
    averageMealLabel: string;
    todayLoggedLabel: string;
    lastMealLabel: string;
    currentWeightLabel: string;
    weightTrendLabel: string;
    weightBaselineLabel: string;
    weightEntriesLabel: string;
    lastWeightLabel: string;
  };
};

const copy: Record<Locale, SavedCalculationCopy> = {
  en: {
    dashboard: {
      latestTargetLabel: "Latest saved target",
      latestTargetEmpty: "Run the calculator once to save a reusable target.",
      savedLabel: "Saved",
      sourceLabel: "Source",
      weekLabel: "Week",
    },
    ai: {
      contextTitle: "Saved context in this assistant",
      contextEmpty: "No saved calculator context yet. Run the calculator first for a more specific answer.",
      latestTargetLabel: "Latest target",
      rangeLabel: "Range",
      weekLabel: "Week",
      sourceLabel: "Guide",
      regionLabel: "Region",
      mealsLabel: "Recent meals",
      averageMealLabel: "Average meal",
      todayLoggedLabel: "Logged today",
      lastMealLabel: "Last meal log",
      currentWeightLabel: "Current weight",
      weightTrendLabel: "Recent weight trend",
      weightBaselineLabel: "Vs pre-pregnancy",
      weightEntriesLabel: "Weight logs",
      lastWeightLabel: "Last weight log",
    },
  },
  "zh-CN": {
    dashboard: {
      latestTargetLabel: "\u6700\u8fd1\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807",
      latestTargetEmpty: "\u5148\u8dd1\u4e00\u6b21\u8ba1\u7b97\u5668\uff0c\u624d\u4f1a\u6709\u53ef\u590d\u7528\u7684\u76ee\u6807\u3002",
      savedLabel: "\u4fdd\u5b58\u65f6\u95f4",
      sourceLabel: "\u89c4\u5219\u6765\u6e90",
      weekLabel: "\u5b55\u5468",
    },
    ai: {
      contextTitle: "AI \u5f53\u524d\u53ef\u7528\u7684\u5df2\u4fdd\u5b58\u4e0a\u4e0b\u6587",
      contextEmpty: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u7684\u8ba1\u7b97\u7ed3\u679c\uff0c\u5148\u8dd1\u4e00\u6b21\u8ba1\u7b97\u5668\uff0cAI \u56de\u7b54\u4f1a\u66f4\u5177\u4f53\u3002",
      latestTargetLabel: "\u6700\u65b0\u76ee\u6807",
      rangeLabel: "\u53c2\u8003\u533a\u95f4",
      weekLabel: "\u5b55\u5468",
      sourceLabel: "\u89c4\u5219\u5305",
      regionLabel: "\u5730\u533a",
      mealsLabel: "\u8fd1\u671f\u996e\u98df",
      averageMealLabel: "\u5e73\u5747\u6bcf\u9910",
      todayLoggedLabel: "\u4eca\u65e5\u5df2\u8bb0\u5f55",
      lastMealLabel: "\u6700\u540e\u4e00\u6b21\u8bb0\u5f55",
      currentWeightLabel: "\u5f53\u524d\u4f53\u91cd",
      weightTrendLabel: "\u8fd1\u671f\u4f53\u91cd\u8d8b\u52bf",
      weightBaselineLabel: "\u76f8\u5bf9\u5b55\u524d",
      weightEntriesLabel: "\u4f53\u91cd\u8bb0\u5f55",
      lastWeightLabel: "\u6700\u540e\u4e00\u6b21\u4f53\u91cd\u8bb0\u5f55",
    },
  },
  es: {
    dashboard: {
      latestTargetLabel: "Ultimo objetivo guardado",
      latestTargetEmpty: "Ejecuta la calculadora una vez para guardar un objetivo reutilizable.",
      savedLabel: "Guardado",
      sourceLabel: "Fuente",
      weekLabel: "Semana",
    },
    ai: {
      contextTitle: "Contexto guardado disponible para esta IA",
      contextEmpty: "Todavia no hay un calculo guardado. Ejecuta la calculadora primero para obtener una respuesta mas especifica.",
      latestTargetLabel: "Ultimo objetivo",
      rangeLabel: "Rango",
      weekLabel: "Semana",
      sourceLabel: "Guia",
      regionLabel: "Region",
      mealsLabel: "Comidas recientes",
      averageMealLabel: "Promedio por comida",
      todayLoggedLabel: "Registrado hoy",
      lastMealLabel: "Ultimo registro",
      currentWeightLabel: "Peso actual",
      weightTrendLabel: "Tendencia reciente de peso",
      weightBaselineLabel: "Vs antes del embarazo",
      weightEntriesLabel: "Registros de peso",
      lastWeightLabel: "Ultimo registro de peso",
    },
  },
};

export function getSavedCalculationCopy(locale: Locale): SavedCalculationCopy {
  return copy[locale] ?? copy.en;
}
