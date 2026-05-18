import type { Locale } from "@/lib/i18n/config";

type DashboardOverviewCopy = {
  currentWeekHint: string;
  caloriePlanTitle: string;
  caloriePlanDescription: string;
  targetLabel: string;
  loggedLabel: string;
  remainingLabel: string;
  overLabel: string;
  progressLabel: string;
  mealsTodayLabel: string;
  noTargetTitle: string;
  noTargetBody: string;
  recentTargetsTitle: string;
  recentTargetsDescription: string;
  recentTargetsEmpty: string;
  latestBadge: string;
  rangeLabel: string;
  calculatorCta: string;
  aiCta: string;
  trackingSnapshotTitle: string;
  trackingSnapshotDescription: string;
  weightTrendTitle: string;
  weightTrendHint: string;
  weightTrendEmpty: string;
  mealRhythmTitle: string;
  mealRhythmHint: string;
  mealRhythmEmpty: string;
  targetShiftTitle: string;
  targetShiftHint: string;
  targetShiftEmpty: string;
  daysLabel: string;
  logsLabel: string;
  sinceLabel: string;
  changeLabel: string;
  weightCta: string;
  mealsCta: string;
};

const copy: Record<Locale, DashboardOverviewCopy> = {
  en: {
    currentWeekHint: "Saved inside profile context.",
    caloriePlanTitle: "Today's calorie plan",
    caloriePlanDescription:
      "Connect the latest saved target with today's meals so the dashboard shows what still needs to happen.",
    targetLabel: "Target",
    loggedLabel: "Logged today",
    remainingLabel: "Remaining",
    overLabel: "Over target",
    progressLabel: "Progress toward today's target",
    mealsTodayLabel: "Meals logged today",
    noTargetTitle: "No saved calorie target yet",
    noTargetBody:
      "Run the calculator once and this area will turn into a daily pacing view for meals and follow-up questions.",
    recentTargetsTitle: "Recent saved targets",
    recentTargetsDescription:
      "Keep a lightweight history of the last calculator sessions so changes in week or guideline pack stay visible.",
    recentTargetsEmpty: "No saved calculator sessions yet.",
    latestBadge: "Latest",
    rangeLabel: "Range",
    calculatorCta: "Open calculator",
    aiCta: "Open AI assistant",
    trackingSnapshotTitle: "Recent tracking snapshot",
    trackingSnapshotDescription:
      "A fast read on whether weight logging, meal logging, and target updates are actually turning into a routine.",
    weightTrendTitle: "Weight trend",
    weightTrendHint: "Compared with your recent saved entries.",
    weightTrendEmpty: "Save at least one weight entry to unlock the trend snapshot.",
    mealRhythmTitle: "7-day meal rhythm",
    mealRhythmHint: "How many of the last 7 days include meal logs.",
    mealRhythmEmpty: "Start logging meals to make your weekly rhythm visible.",
    targetShiftTitle: "Target shift",
    targetShiftHint: "Difference between your latest two saved targets.",
    targetShiftEmpty: "Save another calculator result to compare target changes.",
    daysLabel: "days",
    logsLabel: "logs",
    sinceLabel: "Since",
    changeLabel: "Change",
    weightCta: "Open weight log",
    mealsCta: "Open meals",
  },
  "zh-CN": {
    currentWeekHint: "\u5df2\u4fdd\u5b58\u5728\u6863\u6848\u4e0a\u4e0b\u6587\u4e2d\u3002",
    caloriePlanTitle: "\u4eca\u5929\u7684\u70ed\u91cf\u8fdb\u5ea6",
    caloriePlanDescription:
      "\u628a\u6700\u8fd1\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807\u4e0e\u4eca\u65e5\u996e\u98df\u8bb0\u5f55\u8fde\u8d77\u6765\uff0c\u8ba9 Dashboard \u76f4\u63a5\u544a\u8bc9\u4f60\u8fd8\u5dee\u591a\u5c11\u3002",
    targetLabel: "\u4eca\u65e5\u76ee\u6807",
    loggedLabel: "\u4eca\u65e5\u5df2\u8bb0\u5f55",
    remainingLabel: "\u8fd8\u5dee",
    overLabel: "\u5df2\u8d85\u51fa",
    progressLabel: "\u4eca\u65e5\u76ee\u6807\u8fdb\u5ea6",
    mealsTodayLabel: "\u4eca\u65e5\u5df2\u8bb0\u5f55\u9910\u6b21",
    noTargetTitle: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u70ed\u91cf\u76ee\u6807",
    noTargetBody:
      "\u5148\u8dd1\u4e00\u6b21\u8ba1\u7b97\u5668\uff0c\u8fd9\u91cc\u5c31\u4f1a\u53d8\u6210\u6bcf\u5929\u7684\u70ed\u91cf\u8282\u594f\u89c6\u56fe\u3002",
    recentTargetsTitle: "\u6700\u8fd1\u4fdd\u5b58\u7684\u76ee\u6807",
    recentTargetsDescription:
      "\u7528\u8f7b\u91cf\u7684\u5386\u53f2\u8bb0\u5f55\u4fdd\u7559\u6700\u8fd1\u51e0\u6b21\u8ba1\u7b97\uff0c\u65b9\u4fbf\u5bf9\u7167\u5b55\u5468\u548c\u89c4\u5219\u5305\u53d8\u5316\u3002",
    recentTargetsEmpty: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u7684\u8ba1\u7b97\u8bb0\u5f55\u3002",
    latestBadge: "\u6700\u65b0",
    rangeLabel: "\u53c2\u8003\u533a\u95f4",
    calculatorCta: "\u6253\u5f00\u8ba1\u7b97\u5668",
    aiCta: "\u6253\u5f00 AI \u52a9\u624b",
    trackingSnapshotTitle: "\u6700\u8fd1\u8ddf\u8e2a\u5feb\u7167",
    trackingSnapshotDescription:
      "\u5feb\u901f\u770b\u6e05\u4f53\u91cd\u3001\u996e\u98df\u548c\u70ed\u91cf\u76ee\u6807\u66f4\u65b0\uff0c\u6709\u6ca1\u6709\u771f\u6b63\u53d8\u6210\u6301\u7eed\u4e60\u60ef\u3002",
    weightTrendTitle: "\u4f53\u91cd\u53d8\u5316",
    weightTrendHint: "\u5bf9\u6bd4\u6700\u8fd1\u4fdd\u5b58\u7684\u4f53\u91cd\u8bb0\u5f55\u3002",
    weightTrendEmpty: "\u81f3\u5c11\u4fdd\u5b58\u4e00\u6761\u4f53\u91cd\u8bb0\u5f55\uff0c\u624d\u80fd\u770b\u5230\u8fd9\u91cc\u7684\u8d8b\u52bf\u3002",
    mealRhythmTitle: "\u8fd17\u5929\u996e\u98df\u8282\u594f",
    mealRhythmHint: "\u8fc7\u53bb7\u5929\u91cc\uff0c\u6709\u51e0\u5929\u7559\u4e0b\u4e86\u996e\u98df\u8bb0\u5f55\u3002",
    mealRhythmEmpty: "\u5f00\u59cb\u8bb0\u5f55\u996e\u98df\u540e\uff0c\u8fd9\u91cc\u624d\u4f1a\u770b\u51fa\u6bcf\u5468\u8282\u594f\u3002",
    targetShiftTitle: "\u76ee\u6807\u53d8\u52a8",
    targetShiftHint: "\u5bf9\u6bd4\u6700\u65b0\u4e24\u6b21\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807\u3002",
    targetShiftEmpty: "\u518d\u4fdd\u5b58\u4e00\u6b21\u8ba1\u7b97\u7ed3\u679c\uff0c\u624d\u80fd\u5bf9\u6bd4\u76ee\u6807\u53d8\u5316\u3002",
    daysLabel: "\u5929",
    logsLabel: "\u6761\u8bb0\u5f55",
    sinceLabel: "\u81ea",
    changeLabel: "\u53d8\u5316",
    weightCta: "\u6253\u5f00\u4f53\u91cd\u8bb0\u5f55",
    mealsCta: "\u6253\u5f00\u996e\u98df\u9875",
  },
  es: {
    currentWeekHint: "Guardado dentro del contexto del perfil.",
    caloriePlanTitle: "Plan calorico de hoy",
    caloriePlanDescription:
      "Conecta el objetivo guardado mas reciente con las comidas de hoy para ver de inmediato cuanto falta.",
    targetLabel: "Objetivo",
    loggedLabel: "Registrado hoy",
    remainingLabel: "Pendiente",
    overLabel: "Por encima",
    progressLabel: "Progreso hacia el objetivo de hoy",
    mealsTodayLabel: "Comidas registradas hoy",
    noTargetTitle: "Todavia no hay un objetivo guardado",
    noTargetBody:
      "Ejecuta la calculadora una vez y esta zona se convertira en una vista diaria del ritmo de comidas.",
    recentTargetsTitle: "Objetivos guardados recientes",
    recentTargetsDescription:
      "Mantiene una historia ligera de las ultimas sesiones para ver cambios por semana o por guia.",
    recentTargetsEmpty: "Todavia no hay sesiones guardadas de la calculadora.",
    latestBadge: "Ultimo",
    rangeLabel: "Rango",
    calculatorCta: "Abrir calculadora",
    aiCta: "Abrir asistente IA",
    trackingSnapshotTitle: "Resumen reciente de seguimiento",
    trackingSnapshotDescription:
      "Una lectura rapida para ver si el peso, las comidas y los objetivos guardados ya se estan convirtiendo en rutina.",
    weightTrendTitle: "Tendencia de peso",
    weightTrendHint: "Comparado con tus entradas recientes guardadas.",
    weightTrendEmpty: "Guarda al menos un peso para desbloquear este resumen.",
    mealRhythmTitle: "Ritmo de comidas de 7 dias",
    mealRhythmHint: "Cuantos de los ultimos 7 dias tienen registros de comidas.",
    mealRhythmEmpty: "Empieza a registrar comidas para ver tu ritmo semanal.",
    targetShiftTitle: "Cambio de objetivo",
    targetShiftHint: "Diferencia entre tus dos objetivos guardados mas recientes.",
    targetShiftEmpty: "Guarda otro resultado de calculadora para comparar cambios.",
    daysLabel: "dias",
    logsLabel: "registros",
    sinceLabel: "Desde",
    changeLabel: "Cambio",
    weightCta: "Abrir peso",
    mealsCta: "Abrir comidas",
  },
};

export function getDashboardOverviewCopy(locale: Locale): DashboardOverviewCopy {
  return copy[locale] ?? copy.en;
}
