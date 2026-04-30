import type { Locale } from "@/lib/i18n/config";
import type {
  AnalyticsAiChatSourceKey,
  AnalyticsAiPromptOrigin,
} from "@/types/content";

type AssistantSessionLabelsCopy = {
  sourceLabel: string;
  promptOriginLabel: string;
  sourceValues: Record<AnalyticsAiChatSourceKey, string>;
  promptOriginValues: Record<AnalyticsAiPromptOrigin, string>;
};

const copy: Record<Locale, AssistantSessionLabelsCopy> = {
  en: {
    sourceLabel: "Started from",
    promptOriginLabel: "First prompt",
    sourceValues: {
      calculator_result_primary: "Calculator result",
      calculator_result_follow_up: "Result follow-up",
      dashboard_overview_plan: "Dashboard plan",
      dashboard_overview_recent_targets: "Recent targets",
      dashboard_weekly_checkin: "Weekly check-in",
      dashboard_weight_summary: "Weight summary",
      dashboard_weight_weekly_review: "Weight weekly review",
      dashboard_meals_plan: "Meal plan",
      dashboard_meals_weekly_review: "Meals weekly review",
      blog_article_tool_cta: "Blog tool CTA",
      blog_article_footer: "Blog footer",
      dashboard_weight: "Weight tracker",
      unknown: "Unknown source",
      direct: "Direct visit",
    },
    promptOriginValues: {
      manual_submit: "Typed question",
      prefilled_prompt: "Prefilled prompt",
      context_prompt: "Context prompt",
      history_reuse: "History reuse",
      suggested_prompt: "Suggested prompt",
    },
  },
  "zh-CN": {
    sourceLabel: "\u8fdb\u5165\u6765\u6e90",
    promptOriginLabel: "\u8d77\u59cb\u63d0\u95ee",
    sourceValues: {
      calculator_result_primary: "\u8ba1\u7b97\u7ed3\u679c\u9875",
      calculator_result_follow_up: "\u7ed3\u679c\u9875\u8ffd\u95ee",
      dashboard_overview_plan: "\u603b\u89c8\u884c\u52a8\u8ba1\u5212",
      dashboard_overview_recent_targets: "\u6700\u8fd1\u76ee\u6807",
      dashboard_weekly_checkin: "\u6bcf\u5468\u68c0\u67e5",
      dashboard_weight_summary: "\u4f53\u91cd\u6982\u89c8",
      dashboard_weight_weekly_review: "\u4f53\u91cd\u5468\u56de\u987e",
      dashboard_meals_plan: "\u996e\u98df\u8ba1\u5212",
      dashboard_meals_weekly_review: "\u996e\u98df\u5468\u56de\u987e",
      blog_article_tool_cta: "\u6587\u7ae0\u5de5\u5177\u5165\u53e3",
      blog_article_footer: "\u6587\u7ae0\u5e95\u90e8",
      dashboard_weight: "\u4f53\u91cd\u9875",
      unknown: "\u672a\u77e5\u6765\u6e90",
      direct: "\u76f4\u63a5\u8fdb\u5165",
    },
    promptOriginValues: {
      manual_submit: "\u624b\u52a8\u8f93\u5165",
      prefilled_prompt: "\u9884\u586b\u95ee\u9898",
      context_prompt: "\u4e0a\u4e0b\u6587\u95ee\u9898",
      history_reuse: "\u5386\u53f2\u4f1a\u8bdd\u7eed\u5199",
      suggested_prompt: "\u63a8\u8350\u95ee\u9898",
    },
  },
  es: {
    sourceLabel: "Inicio",
    promptOriginLabel: "Primer prompt",
    sourceValues: {
      calculator_result_primary: "Resultado de calculadora",
      calculator_result_follow_up: "Seguimiento del resultado",
      dashboard_overview_plan: "Plan del panel",
      dashboard_overview_recent_targets: "Metas recientes",
      dashboard_weekly_checkin: "Chequeo semanal",
      dashboard_weight_summary: "Resumen de peso",
      dashboard_weight_weekly_review: "Revision semanal de peso",
      dashboard_meals_plan: "Plan de comidas",
      dashboard_meals_weekly_review: "Revision semanal de comidas",
      blog_article_tool_cta: "CTA de herramienta en blog",
      blog_article_footer: "Pie del articulo",
      dashboard_weight: "Seguimiento de peso",
      unknown: "Origen desconocido",
      direct: "Entrada directa",
    },
    promptOriginValues: {
      manual_submit: "Pregunta escrita",
      prefilled_prompt: "Prompt precargado",
      context_prompt: "Prompt de contexto",
      history_reuse: "Reusar historial",
      suggested_prompt: "Prompt sugerido",
    },
  },
};

export function getAssistantSessionLabelsCopy(locale: Locale): AssistantSessionLabelsCopy {
  return copy[locale];
}

export function getAssistantSessionSourceLabel(
  locale: Locale,
  source: AnalyticsAiChatSourceKey,
) {
  return copy[locale].sourceValues[source] ?? copy[locale].sourceValues.unknown;
}

export function getAssistantSessionPromptOriginLabel(
  locale: Locale,
  promptOrigin: AnalyticsAiPromptOrigin,
) {
  return (
    copy[locale].promptOriginValues[promptOrigin] ??
    copy[locale].promptOriginValues.manual_submit
  );
}
