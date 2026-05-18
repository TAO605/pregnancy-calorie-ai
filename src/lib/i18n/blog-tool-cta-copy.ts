import type { Locale } from "@/lib/i18n/config";

type BlogToolCtaCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cards: {
    calculator: {
      title: string;
      body: string;
      cta: string;
    };
    ai: {
      title: string;
      body: string;
      cta: string;
    };
    guides: {
      title: string;
      body: string;
      cta: string;
    };
  };
  relatedEyebrow: string;
};

const copy: Record<Locale, BlogToolCtaCopy> = {
  en: {
    eyebrow: "Use the tools, not just the article",
    title: "Turn this guide into a next step while the context is still fresh.",
    description:
      "Move from reading into action: calculate a target, ask the AI to apply the topic to your situation, or keep following the guide path.",
    cards: {
      calculator: {
        title: "Calculate your target",
        body: "Use the calorie calculator when you want this article grounded in an actual daily recommendation.",
        cta: "Open calculator",
      },
      ai: {
        title: "Ask AI to apply this guide",
        body: "Start a follow-up question that uses this article as context instead of beginning from a blank prompt.",
        cta: "Ask AI about this topic",
      },
      guides: {
        title: "Keep the topic chain going",
        body: "Browse more pregnancy nutrition guides so the article becomes part of a connected learning path.",
        cta: "Browse all guides",
      },
    },
    relatedEyebrow: "Related reading",
  },
  "zh-CN": {
    eyebrow: "不要只看文章，也把工具用起来",
    title: "趁着上下文还新鲜，直接把这篇内容变成下一步动作。",
    description:
      "从阅读切到执行：先算热量目标，再让 AI 把这个主题落到你的情况里，或者继续顺着内容路径往下看。",
    cards: {
      calculator: {
        title: "先算你的目标",
        body: "如果你希望把这篇文章放到真实的每日热量建议里看，就直接去跑一次计算器。",
        cta: "打开计算器",
      },
      ai: {
        title: "让 AI 结合这篇文章继续讲",
        body: "不用从空白问题开始，直接把这篇内容当作上下文，继续追问更具体的执行建议。",
        cta: "问 AI 这个主题",
      },
      guides: {
        title: "继续沿着主题读下去",
        body: "把单篇文章变成连续的孕期营养学习路径，而不是只停留在一个页面上。",
        cta: "查看全部指南",
      },
    },
    relatedEyebrow: "相关延伸阅读",
  },
  es: {
    eyebrow: "No uses solo el articulo, usa tambien las herramientas",
    title: "Convierte esta guia en un siguiente paso mientras el contexto sigue fresco.",
    description:
      "Pasa de leer a actuar: calcula un objetivo, pide a la IA que aplique el tema a tu situacion o sigue avanzando por la ruta de guias.",
    cards: {
      calculator: {
        title: "Calcular tu objetivo",
        body: "Usa la calculadora si quieres aterrizar esta guia en una recomendacion diaria real.",
        cta: "Abrir calculadora",
      },
      ai: {
        title: "Pedir a la IA que aplique esta guia",
        body: "Haz una pregunta de seguimiento usando este articulo como contexto en lugar de empezar desde cero.",
        cta: "Preguntar a la IA sobre este tema",
      },
      guides: {
        title: "Seguir la cadena de guias",
        body: "Convierte una sola lectura en una ruta conectada de aprendizaje sobre nutricion en el embarazo.",
        cta: "Ver todas las guias",
      },
    },
    relatedEyebrow: "Lecturas relacionadas",
  },
};

export function getBlogToolCtaCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
