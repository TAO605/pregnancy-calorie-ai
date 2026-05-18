import type { Locale } from "@/lib/i18n/config";

type DashboardWeightCopy = {
  summaryTitle: string;
  summaryDescription: string;
  currentWeightLabel: string;
  sinceBaselineLabel: string;
  baselineWeightLabel: string;
  recentTrendLabel: string;
  latestChangeLabel: string;
  lastLoggedLabel: string;
  entryCountLabel: string;
  noTrendHint: string;
  aiTitle: string;
  aiDescription: string;
  aiCta: string;
  targetLabel: string;
  noTargetHint: string;
  noSummaryHint: string;
};

const copy: Record<Locale, DashboardWeightCopy> = {
  en: {
    summaryTitle: "Weight snapshot",
    summaryDescription:
      "Use quick signals before overreacting to a single weigh-in: baseline change, recent trend, and last logged movement.",
    currentWeightLabel: "Current saved weight",
    sinceBaselineLabel: "Since pre-pregnancy",
    baselineWeightLabel: "Pre-pregnancy baseline",
    recentTrendLabel: "Recent trend",
    latestChangeLabel: "Last change",
    lastLoggedLabel: "Last logged",
    entryCountLabel: "Entries",
    noTrendHint: "Add another weight entry to compare changes.",
    aiTitle: "Review this trend with AI",
    aiDescription:
      "Ask the assistant to interpret your saved weight pattern together with pregnancy week, calorie target, and meal rhythm.",
    aiCta: "Ask AI about weight trend",
    targetLabel: "Latest calorie target",
    noTargetHint: "Run the calculator to connect weight review with a calorie target.",
    noSummaryHint: "Save or sync a weight value first to generate a usable summary.",
  },
  "zh-CN": {
    summaryTitle: "\u4f53\u91cd\u5feb\u7167",
    summaryDescription:
      "\u5148\u7528\u57fa\u7ebf\u53d8\u5316\u3001\u8fd1\u671f\u8d8b\u52bf\u548c\u6700\u540e\u4e00\u6b21\u6ce2\u52a8\u6765\u770b\u4f53\u91cd\uff0c\u4e0d\u8981\u5bf9\u5355\u6b21\u79f0\u91cd\u8fc7\u5ea6\u53cd\u5e94\u3002",
    currentWeightLabel: "\u5f53\u524d\u5df2\u4fdd\u5b58\u4f53\u91cd",
    sinceBaselineLabel: "\u76f8\u5bf9\u5b55\u524d",
    baselineWeightLabel: "\u5b55\u524d\u57fa\u7ebf",
    recentTrendLabel: "\u8fd1\u671f\u8d8b\u52bf",
    latestChangeLabel: "\u6700\u540e\u4e00\u6b21\u53d8\u5316",
    lastLoggedLabel: "\u6700\u540e\u8bb0\u5f55",
    entryCountLabel: "\u8bb0\u5f55\u6570",
    noTrendHint: "\u518d\u6dfb\u52a0\u4e00\u6761\u4f53\u91cd\u8bb0\u5f55\uff0c\u624d\u80fd\u5bf9\u6bd4\u53d8\u5316\u3002",
    aiTitle: "\u7528 AI \u590d\u76d8\u8fd9\u6bb5\u4f53\u91cd\u8d8b\u52bf",
    aiDescription:
      "\u8ba9 AI \u7ed3\u5408\u4f60\u7684\u5b55\u5468\u3001\u70ed\u91cf\u76ee\u6807\u548c\u996e\u98df\u8282\u594f\uff0c\u4e00\u8d77\u770b\u73b0\u5728\u7684\u4f53\u91cd\u8bb0\u5f55\u3002",
    aiCta: "\u8ba9 AI \u5206\u6790\u4f53\u91cd\u8d8b\u52bf",
    targetLabel: "\u6700\u65b0\u70ed\u91cf\u76ee\u6807",
    noTargetHint: "\u5148\u8fd0\u884c\u8ba1\u7b97\u5668\uff0c\u4f53\u91cd\u590d\u76d8\u624d\u80fd\u8fde\u4e0a\u70ed\u91cf\u76ee\u6807\u3002",
    noSummaryHint: "\u5148\u4fdd\u5b58\u6216\u540c\u6b65\u4e00\u6b21\u4f53\u91cd\uff0c\u8fd9\u91cc\u624d\u4f1a\u51fa\u73b0\u53ef\u7528\u6458\u8981\u3002",
  },
  es: {
    summaryTitle: "Resumen de peso",
    summaryDescription:
      "Antes de reaccionar a una sola medicion, mira tres senales rapidas: cambio desde la base, tendencia reciente y ultimo movimiento.",
    currentWeightLabel: "Peso guardado actual",
    sinceBaselineLabel: "Desde antes del embarazo",
    baselineWeightLabel: "Base previa al embarazo",
    recentTrendLabel: "Tendencia reciente",
    latestChangeLabel: "Ultimo cambio",
    lastLoggedLabel: "Ultimo registro",
    entryCountLabel: "Registros",
    noTrendHint: "Guarda otra entrada de peso para comparar cambios.",
    aiTitle: "Revisar esta tendencia con IA",
    aiDescription:
      "Pide a la asistente que interprete tu patron de peso junto con la semana, el objetivo calorico y el ritmo de comidas.",
    aiCta: "Preguntar a la IA por el peso",
    targetLabel: "Ultimo objetivo calorico",
    noTargetHint: "Ejecuta la calculadora para conectar la revision del peso con un objetivo.",
    noSummaryHint: "Guarda o sincroniza un peso primero para generar un resumen util.",
  },
};

export function getDashboardWeightCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
