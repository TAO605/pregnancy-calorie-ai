import type { Locale } from "@/lib/i18n/config";

type AssistantPanelCopy = {
  sessionTitle: string;
  sessionDescription: string;
  sessionEmpty: string;
  currentBadge: string;
  questionLabel: string;
  answerLabel: string;
  resetSessionLabel: string;
  suggestedTitle: string;
  suggestedDescription: string;
};

const copy: Record<Locale, AssistantPanelCopy> = {
  en: {
    sessionTitle: "Current AI session",
    sessionDescription:
      "Keep the live back-and-forth visible so each follow-up feels like part of one conversation.",
    sessionEmpty:
      "No messages in this session yet. Ask a question, use a context prompt, or tap a suggested prompt to begin.",
    currentBadge: "Current session",
    questionLabel: "Question",
    answerLabel: "Answer",
    resetSessionLabel: "Start new session",
    suggestedTitle: "Suggested prompts",
    suggestedDescription:
      "Use these as quick starts when you want a concrete next question without typing from scratch.",
  },
  "zh-CN": {
    sessionTitle: "\u5f53\u524d AI \u4f1a\u8bdd",
    sessionDescription:
      "\u628a\u8fd9\u4e00\u6b21\u6765\u56de\u5bf9\u8bdd\u4fdd\u7559\u4e0b\u6765\uff0c\u8ba9\u8ffd\u95ee\u66f4\u50cf\u8fde\u7eed\u4ea4\u6d41\uff0c\u800c\u4e0d\u662f\u4e00\u6b21\u6027\u5de5\u5177\u3002",
    sessionEmpty:
      "\u5f53\u524d\u4f1a\u8bdd\u8fd8\u6ca1\u6709\u6d88\u606f\u3002\u4f60\u53ef\u4ee5\u76f4\u63a5\u63d0\u95ee\uff0c\u4f7f\u7528\u4e0a\u4e0b\u6587\u95ee\u9898\uff0c\u6216\u70b9\u4e00\u4e2a\u63a8\u8350\u95ee\u9898\u5f00\u59cb\u3002",
    currentBadge: "\u5f53\u524d\u4f1a\u8bdd",
    questionLabel: "\u95ee\u9898",
    answerLabel: "\u56de\u7b54",
    resetSessionLabel: "\u5f00\u59cb\u65b0\u4f1a\u8bdd",
    suggestedTitle: "\u63a8\u8350\u95ee\u9898",
    suggestedDescription:
      "\u5f53\u4f60\u4e0d\u60f3\u4ece\u96f6\u8f93\u5165\u65f6\uff0c\u53ef\u4ee5\u76f4\u63a5\u4ece\u8fd9\u4e9b\u66f4\u5177\u4f53\u7684\u4e0b\u4e00\u95ee\u5f00\u59cb\u3002",
  },
  es: {
    sessionTitle: "Sesion actual de IA",
    sessionDescription:
      "Mantiene visible el ida y vuelta actual para que cada seguimiento se sienta parte de una sola conversacion.",
    sessionEmpty:
      "Todavia no hay mensajes en esta sesion. Haz una pregunta, usa un prompt de contexto o toca una sugerencia para empezar.",
    currentBadge: "Sesion actual",
    questionLabel: "Pregunta",
    answerLabel: "Respuesta",
    resetSessionLabel: "Empezar sesion nueva",
    suggestedTitle: "Prompts sugeridos",
    suggestedDescription:
      "Usalos como arranque rapido cuando quieras una siguiente pregunta concreta sin escribir desde cero.",
  },
};

export function getAssistantPanelCopy(locale: Locale): AssistantPanelCopy {
  return copy[locale];
}
