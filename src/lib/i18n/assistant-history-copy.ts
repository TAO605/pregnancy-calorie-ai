import type { Locale } from "@/lib/i18n/config";

type AssistantHistoryCopy = {
  title: string;
  description: string;
  empty: string;
  latestBadge: string;
  currentBadge: string;
  questionLabel: string;
  answerLabel: string;
  messagesLabel: string;
  lastUpdatedLabel: string;
  continueLabel: string;
};

const copy: Record<Locale, AssistantHistoryCopy> = {
  en: {
    title: "Recent AI history",
    description:
      "Keep the most useful follow-up questions visible so the assistant feels cumulative instead of disposable.",
    empty: "No saved AI answers yet. Ask one question and the recent history will appear here.",
    latestBadge: "Latest",
    currentBadge: "Current session",
    questionLabel: "Question",
    answerLabel: "Answer",
    messagesLabel: "Messages",
    lastUpdatedLabel: "Last updated",
    continueLabel: "Continue session",
  },
  "zh-CN": {
    title: "\u6700\u8fd1 AI \u5bf9\u8bdd",
    description:
      "\u628a\u6700\u6709\u7528\u7684\u8ffd\u95ee\u4fdd\u7559\u4e0b\u6765\uff0c\u8ba9 AI \u66f4\u50cf\u4e00\u4e2a\u53ef\u4ee5\u7d2f\u79ef\u7684\u5de5\u5177\u3002",
    empty: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u7684 AI \u56de\u7b54\uff0c\u5148\u63d0\u4e00\u4e2a\u95ee\u9898\u5c31\u4f1a\u51fa\u73b0\u5728\u8fd9\u91cc\u3002",
    latestBadge: "\u6700\u65b0",
    currentBadge: "\u5f53\u524d\u4f1a\u8bdd",
    questionLabel: "\u95ee\u9898",
    answerLabel: "\u56de\u7b54",
    messagesLabel: "\u6d88\u606f\u6570",
    lastUpdatedLabel: "\u6700\u540e\u66f4\u65b0",
    continueLabel: "\u7ee7\u7eed\u8fd9\u8f6e\u4f1a\u8bdd",
  },
  es: {
    title: "Historial reciente de IA",
    description:
      "Mantiene visibles las preguntas mas utiles para que el asistente se sienta acumulativo y no desechable.",
    empty: "Todavia no hay respuestas guardadas. Haz una pregunta y el historial reciente aparecera aqui.",
    latestBadge: "Ultimo",
    currentBadge: "Sesion actual",
    questionLabel: "Pregunta",
    answerLabel: "Respuesta",
    messagesLabel: "Mensajes",
    lastUpdatedLabel: "Ultima actualizacion",
    continueLabel: "Continuar sesion",
  },
};

export function getAssistantHistoryCopy(locale: Locale): AssistantHistoryCopy {
  return copy[locale];
}
