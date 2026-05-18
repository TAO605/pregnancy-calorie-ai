import type { Locale } from "@/lib/i18n/config";

type SaveProgressPromptStateCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  secondaryCta?: string;
  badge?: string;
};

type SaveProgressPromptSectionCopy = {
  guest: SaveProgressPromptStateCopy;
  member: SaveProgressPromptStateCopy;
};

type SaveProgressPromptCopy = {
  result: SaveProgressPromptSectionCopy;
  ai: SaveProgressPromptSectionCopy;
};

const copy: Record<Locale, SaveProgressPromptCopy> = {
  en: {
    result: {
      guest: {
        eyebrow: "Save this plan",
        title: "Turn this calorie target into a saved dashboard routine.",
        body:
          "Keep the latest target, profile details, meals, and weight check-ins in one place so you do not have to start from zero next time.",
        cta: "Save to dashboard",
      },
      member: {
        eyebrow: "Continue tracking",
        title: "Your dashboard is ready for this calorie target.",
        body:
          "Jump back into your saved routine to review this target, log meals, and keep weight check-ins moving instead of leaving the result as a one-off estimate.",
        cta: "Open dashboard",
        secondaryCta: "Log meals",
        badge: "Signed in",
      },
    },
    ai: {
      guest: {
        eyebrow: "Keep the context",
        title: "Save your profile so AI answers get better on the next visit.",
        body:
          "A saved dashboard gives future AI questions access to your latest target, meal logs, weight trend, and food preferences instead of treating every visit like a cold start.",
        cta: "Unlock saved dashboard",
      },
      member: {
        eyebrow: "Keep the context live",
        title: "Use your saved dashboard before the next AI question.",
        body:
          "Review your profile, latest target, meal history, and weight trend so the next AI follow-up starts from current context instead of a blank slate.",
        cta: "Continue tracking",
        secondaryCta: "Review profile",
        badge: "Signed in",
      },
    },
  },
  "zh-CN": {
    result: {
      guest: {
        eyebrow: "\u4fdd\u5b58\u8fd9\u6b21\u8ba1\u5212",
        title: "\u628a\u8fd9\u6b21\u70ed\u91cf\u76ee\u6807\u53d8\u6210\u53ef\u6301\u7eed\u56de\u6765\u7684 dashboard \u8bb0\u5f55\u3002",
        body:
          "\u628a\u6700\u8fd1\u4e00\u6b21\u76ee\u6807\u3001\u6863\u6848\u4fe1\u606f\u3001\u996e\u98df\u8bb0\u5f55\u548c\u4f53\u91cd\u6253\u5361\u653e\u5728\u4e00\u8d77\uff0c\u4e0b\u6b21\u56de\u6765\u5c31\u4e0d\u7528\u518d\u4ece\u96f6\u5f00\u59cb\u3002",
        cta: "\u4fdd\u5b58\u5230 dashboard",
      },
      member: {
        eyebrow: "\u7ee7\u7eed\u8ffd\u8e2a",
        title: "\u4f60\u7684 dashboard \u5df2\u7ecf\u51c6\u5907\u597d\u627f\u63a5\u8fd9\u6b21\u70ed\u91cf\u76ee\u6807\u3002",
        body:
          "\u56de\u5230\u5df2\u4fdd\u5b58\u7684\u4f7f\u7528\u8282\u594f\uff0c\u5bf9\u6bd4\u8fd9\u6b21\u76ee\u6807\uff0c\u8bb0\u5f55\u9910\u98df\uff0c\u5e76\u8ba9\u4f53\u91cd\u6253\u5361\u7ee7\u7eed\u540c\u6b65\uff0c\u800c\u4e0d\u662f\u628a\u7ed3\u679c\u505c\u5728\u4e00\u6b21\u6027\u4f30\u7b97\u3002",
        cta: "\u6253\u5f00 dashboard",
        secondaryCta: "\u8bb0\u5f55\u9910\u98df",
        badge: "\u5df2\u767b\u5f55",
      },
    },
    ai: {
      guest: {
        eyebrow: "\u4fdd\u7559\u4e0a\u4e0b\u6587",
        title: "\u4fdd\u5b58\u4f60\u7684\u6863\u6848\uff0c\u8ba9\u4e0b\u6b21 AI \u56de\u7b54\u66f4\u8d34\u8fd1\u4f60\u7684\u771f\u5b9e\u60c5\u51b5\u3002",
        body:
          "\u4fdd\u5b58\u540e\u7684 dashboard \u4f1a\u628a\u6700\u65b0\u70ed\u91cf\u76ee\u6807\u3001\u996e\u98df\u8bb0\u5f55\u3001\u4f53\u91cd\u8d8b\u52bf\u548c\u996e\u98df\u504f\u597d\u4e32\u8d77\u6765\uff0c\u4e4b\u540e\u63d0\u95ee\u65f6\u5c31\u4e0d\u518d\u662f\u4e00\u6b21\u6b21\u51b7\u542f\u52a8\u3002",
        cta: "\u5f00\u542f\u5df2\u4fdd\u5b58 dashboard",
      },
      member: {
        eyebrow: "\u8ba9\u4e0a\u4e0b\u6587\u7ee7\u7eed\u751f\u6548",
        title: "\u5728\u4e0b\u4e00\u6b21 AI \u63d0\u95ee\u524d\uff0c\u5148\u7528\u4f60\u5df2\u4fdd\u5b58\u7684 dashboard \u8865\u9f50\u80cc\u666f\u3002",
        body:
          "\u56de\u5230 dashboard \u68c0\u67e5\u6863\u6848\uff0c\u6700\u65b0\u70ed\u91cf\u76ee\u6807\uff0c\u996e\u98df\u8bb0\u5f55\u548c\u4f53\u91cd\u8d8b\u52bf\uff0c\u8ba9\u4e0b\u4e00\u6b21 AI \u8ffd\u95ee\u76f4\u63a5\u63a5\u4f4f\u73b0\u5728\u7684\u60c5\u51b5\u3002",
        cta: "\u7ee7\u7eed\u8ffd\u8e2a",
        secondaryCta: "\u67e5\u770b\u6863\u6848",
        badge: "\u5df2\u767b\u5f55",
      },
    },
  },
  es: {
    result: {
      guest: {
        eyebrow: "Guarda este plan",
        title: "Convierte este objetivo calorico en una rutina guardada del dashboard.",
        body:
          "Mantiene en un solo lugar el objetivo mas reciente, el perfil, las comidas y los controles de peso para no empezar desde cero la proxima vez.",
        cta: "Guardar en dashboard",
      },
      member: {
        eyebrow: "Sigue el seguimiento",
        title: "Tu dashboard ya esta listo para este objetivo calorico.",
        body:
          "Vuelve a tu rutina guardada para revisar este objetivo, registrar comidas y mantener el seguimiento del peso en marcha en vez de dejar el resultado como una estimacion aislada.",
        cta: "Abrir dashboard",
        secondaryCta: "Registrar comidas",
        badge: "Sesion iniciada",
      },
    },
    ai: {
      guest: {
        eyebrow: "Conserva el contexto",
        title: "Guarda tu perfil para que la IA responda mejor en la siguiente visita.",
        body:
          "Un dashboard guardado da a la IA acceso a tu objetivo mas reciente, comidas, tendencia de peso y preferencias alimentarias en vez de tratar cada visita como un inicio en frio.",
        cta: "Activar dashboard guardado",
      },
      member: {
        eyebrow: "Mantener el contexto vivo",
        title: "Usa tu dashboard guardado antes de la siguiente pregunta a la IA.",
        body:
          "Revisa tu perfil, el objetivo mas reciente, las comidas y la tendencia de peso para que la siguiente consulta a la IA parta del contexto actual.",
        cta: "Seguir seguimiento",
        secondaryCta: "Revisar perfil",
        badge: "Sesion iniciada",
      },
    },
  },
};

export function getSaveProgressPromptCopy(locale: Locale) {
  return copy[locale];
}
