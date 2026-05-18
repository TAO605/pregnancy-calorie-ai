import type { Locale } from "@/lib/i18n/config";

type MarketingPageCopy = {
  homeMetaTitle: string;
  homeMetaDescription: string;
  calculatorMetaTitle: string;
  calculatorMetaDescription: string;
  calculatorRuleAwareLabel: string;
  calculatorWhyLabel: string;
  calculatorWhyBody: string;
  calculatorFaqEyebrow: string;
  calculatorFaqTitle: string;
  calculatorFaqItems: Array<{ question: string; answer: string }>;
  resultMetaTitle: string;
  resultMetaDescription: string;
  aiMetaTitle: string;
  aiMetaDescription: string;
  legalMetaTitle: string;
  legalMetaDescription: string;
  signInMetaTitle: string;
  signInMetaDescription: string;
  blogIndexMetaTitle: string;
  blogIndexMetaDescription: string;
  blogIndexEyebrow: string;
  blogIndexTitle: string;
  blogIndexDescription: string;
  blogIndexEmptyTitle: string;
  blogIndexEmptyBody: string;
  blogUpdatedLabel: string;
  blogIndexCta: string;
  blogNavLabel: string;
  blogFallbackTitle: string;
  blogFallbackDescription: string;
  blogPublishedEyebrow: string;
  guestName: string;
};

const copy: Record<Locale, MarketingPageCopy> = {
  en: {
    homeMetaTitle: "AI Pregnancy Calorie Calculator",
    homeMetaDescription:
      "Estimate pregnancy calories, review the reasoning, and keep going with AI follow-up, saved profiles, meal logging, and weight trends.",
    calculatorMetaTitle: "Pregnancy Calorie Calculator",
    calculatorMetaDescription:
      "Calculate daily calories during pregnancy with trimester-aware guidance packs and a clearer explanation layer.",
    calculatorRuleAwareLabel: "Rule-aware",
    calculatorWhyLabel: "Why this matters",
    calculatorWhyBody:
      "The calculator should feel safer than a static blog table because users can see both the recommendation and the rule pack underneath it.",
    calculatorFaqEyebrow: "Calculator FAQ",
    calculatorFaqTitle: "Answer the trust questions before users need to ask them.",
    calculatorFaqItems: [
      {
        question: "How accurate is a pregnancy calorie calculator?",
        answer:
          "This tool is best used as a nutrition planning estimate. It combines activity, pregnancy stage, and guideline packs, but it does not replace clinician advice for complications, twins, or medical nutrition needs.",
      },
      {
        question: "Why do calorie needs change by trimester?",
        answer:
          "Energy needs usually rise as pregnancy progresses because maternal tissue, fetal growth, and day-to-day demands change. The calculator uses trimester framing so the result does not pretend one number fits the entire pregnancy.",
      },
      {
        question: "What should I do after I get my result?",
        answer:
          "Use the number as a planning anchor, then spread intake across meals and snacks, review the explanation layer, and use the AI follow-up or saved tracking tools if appetite, weight, or symptoms shift.",
      },
    ],
    resultMetaTitle: "Pregnancy Calorie Result",
    resultMetaDescription:
      "Personalized pregnancy calorie output based on your latest calculator session.",
    aiMetaTitle: "AI Pregnancy Nutrition Assistant",
    aiMetaDescription:
      "A guardrailed AI assistant for nutrition follow-up after the calorie calculator.",
    legalMetaTitle: "Medical Disclaimer",
    legalMetaDescription:
      "The clinical boundary for using the pregnancy calorie calculator and AI assistant.",
    signInMetaTitle: "Sign in",
    signInMetaDescription: "Sign in to save your pregnancy profile and weight trend.",
    blogIndexMetaTitle: "Pregnancy Nutrition Guides",
    blogIndexMetaDescription:
      "Browse pregnancy nutrition guides about calories, weight trends, meal planning, fiber, and hydration.",
    blogIndexEyebrow: "Content library",
    blogIndexTitle: "Browse pregnancy nutrition guides built around calculator intent.",
    blogIndexDescription:
      "Use these pages as the education layer behind the calculator: trimester calories, meal structure, weight trends, hydration, and related follow-up topics.",
    blogIndexEmptyTitle: "No published guides yet",
    blogIndexEmptyBody:
      "Publish content from admin to turn this page into the SEO education hub behind the calculator.",
    blogUpdatedLabel: "Updated",
    blogIndexCta: "Browse all guides",
    blogNavLabel: "Guides",
    blogFallbackTitle: "Content",
    blogFallbackDescription: "Pregnancy nutrition content page.",
    blogPublishedEyebrow: "Published guide",
    guestName: "Guest",
  },
  "zh-CN": {
    homeMetaTitle: "AI \u5b55\u671f\u70ed\u91cf\u8ba1\u7b97\u5668",
    homeMetaDescription:
      "\u5148\u4f30\u7b97\u5b55\u671f\u70ed\u91cf\uff0c\u518d\u7ed3\u5408 AI \u8ffd\u95ee\u3001\u5df2\u4fdd\u5b58\u6863\u6848\u3001\u996e\u98df\u8bb0\u5f55\u548c\u4f53\u91cd\u8d8b\u52bf\uff0c\u5f62\u6210\u8fde\u7eed\u4f7f\u7528\u95ed\u73af\u3002",
    calculatorMetaTitle: "\u5b55\u671f\u70ed\u91cf\u8ba1\u7b97\u5668",
    calculatorMetaDescription:
      "\u7ed3\u5408\u5b55\u671f\u9636\u6bb5\u548c\u89c4\u5219\u5305\uff0c\u8ba1\u7b97\u6bcf\u65e5\u70ed\u91cf\u5efa\u8bae\uff0c\u540c\u65f6\u63d0\u4f9b\u66f4\u6e05\u6670\u7684\u89e3\u91ca\u3002",
    calculatorRuleAwareLabel: "\u5e26\u89c4\u5219\u4f9d\u636e",
    calculatorWhyLabel: "\u4e3a\u4ec0\u4e48\u8fd9\u5f88\u91cd\u8981",
    calculatorWhyBody:
      "\u8fd9\u4e2a\u8ba1\u7b97\u5668\u5e94\u8be5\u6bd4\u9759\u6001\u535a\u5ba2\u8868\u683c\u66f4\u53ef\u4fe1\uff0c\u56e0\u4e3a\u7528\u6237\u53ef\u4ee5\u540c\u65f6\u770b\u5230\u63a8\u8350\u503c\u548c\u80cc\u540e\u7684\u89c4\u5219\u5305\u3002",
    calculatorFaqEyebrow: "\u8ba1\u7b97\u5668 FAQ",
    calculatorFaqTitle: "\u5728\u7528\u6237\u63d0\u95ee\u4e4b\u524d\uff0c\u5148\u56de\u7b54\u4fe1\u4efb\u95ee\u9898\u3002",
    calculatorFaqItems: [
      {
        question: "\u5b55\u671f\u70ed\u91cf\u8ba1\u7b97\u5668\u6709\u591a\u51c6\uff1f",
        answer:
          "\u8fd9\u4e2a\u5de5\u5177\u66f4\u9002\u5408\u88ab\u5f53\u4f5c\u996e\u98df\u89c4\u5212\u4f30\u7b97\u3002\u5b83\u4f1a\u7ed3\u5408\u6d3b\u52a8\u6c34\u5e73\uff0c\u5b55\u671f\u9636\u6bb5\u548c\u89c4\u5219\u5305\uff0c\u4f46\u4e0d\u80fd\u4ee3\u66ff\u533b\u751f\u5bf9\u5e76\u53d1\u75c7\uff0c\u591a\u80ce\u6216\u533b\u7597\u8425\u517b\u9700\u6c42\u7684\u5224\u65ad\u3002",
      },
      {
        question: "\u4e3a\u4ec0\u4e48\u4e0d\u540c\u5b55\u671f\u9636\u6bb5\u7684\u70ed\u91cf\u9700\u6c42\u4f1a\u53d8\uff1f",
        answer:
          "\u968f\u7740\u5b55\u671f\u63a8\u8fdb\uff0c\u4ea7\u5987\u7ec4\u7ec7\u53d8\u5316\uff0c\u80ce\u513f\u751f\u957f\u548c\u65e5\u5e38\u80fd\u91cf\u9700\u6c42\u90fd\u5728\u53d8\u5316\u3002\u8ba1\u7b97\u5668\u6309\u5b55\u671f\u9636\u6bb5\u8f93\u51fa\uff0c\u907f\u514d\u7528\u4e00\u4e2a\u6570\u5b57\u5047\u88c5\u9002\u7528\u6574\u4e2a\u5b55\u671f\u3002",
      },
      {
        question: "\u5f97\u5230\u7ed3\u679c\u540e\u4e0b\u4e00\u6b65\u5e94\u8be5\u505a\u4ec0\u4e48\uff1f",
        answer:
          "\u53ef\u4ee5\u5148\u628a\u8fd9\u4e2a\u6570\u5b57\u5f53\u4f5c\u89c4\u5212\u9528\u70b9\uff0c\u518d\u628a\u6444\u5165\u62c6\u5206\u5230\u6b63\u9910\u548c\u52a0\u9910\uff0c\u770b\u5b8c\u89e3\u91ca\u5c42\uff0c\u5982\u679c\u98df\u6b32\uff0c\u4f53\u91cd\u6216\u75c7\u72b6\u53d8\u5316\uff0c\u518d\u63a5\u7740\u7528 AI \u8ffd\u95ee\u6216\u4fdd\u5b58\u8ffd\u8e2a\u529f\u80fd\u3002",
      },
    ],
    resultMetaTitle: "\u5b55\u671f\u70ed\u91cf\u7ed3\u679c",
    resultMetaDescription:
      "\u57fa\u4e8e\u4f60\u6700\u65b0\u4e00\u6b21\u8ba1\u7b97\u751f\u6210\u7684\u4e2a\u4eba\u5316\u5b55\u671f\u70ed\u91cf\u7ed3\u679c\u3002",
    aiMetaTitle: "AI \u5b55\u671f\u8425\u517b\u52a9\u624b",
    aiMetaDescription:
      "\u5728\u70ed\u91cf\u8ba1\u7b97\u4e4b\u540e\uff0c\u7528\u4e00\u4e2a\u5e26\u5b89\u5168\u8fb9\u754c\u7684 AI \u52a9\u624b\u505a\u8425\u517b\u8ffd\u95ee\u3002",
    legalMetaTitle: "\u533b\u7597\u514d\u8d23\u58f0\u660e",
    legalMetaDescription:
      "\u4f7f\u7528\u5b55\u671f\u70ed\u91cf\u8ba1\u7b97\u5668\u548c AI \u52a9\u624b\u65f6\u9700\u8981\u660e\u786e\u7684\u4e34\u5e8a\u8fb9\u754c\u3002",
    signInMetaTitle: "\u767b\u5f55",
    signInMetaDescription:
      "\u767b\u5f55\u540e\u4fdd\u5b58\u4f60\u7684\u5b55\u671f\u6863\u6848\u3001\u4f53\u91cd\u8d8b\u52bf\u548c\u8ffd\u8e2a\u8bb0\u5f55\u3002",
    blogIndexMetaTitle: "\u5b55\u671f\u8425\u517b\u6307\u5357",
    blogIndexMetaDescription:
      "\u67e5\u770b\u56f4\u7ed5\u5b55\u671f\u70ed\u91cf\u3001\u4f53\u91cd\u8d8b\u52bf\u3001\u996e\u98df\u89c4\u5212\u3001\u7ea4\u7ef4\u548c\u8865\u6c34\u7684\u5185\u5bb9\u6307\u5357\u3002",
    blogIndexEyebrow: "\u5185\u5bb9\u4e2d\u67a2",
    blogIndexTitle: "\u6d4f\u89c8\u56f4\u7ed5\u8ba1\u7b97\u5668\u610f\u56fe\u6784\u5efa\u7684\u5b55\u671f\u8425\u517b\u6307\u5357\u3002",
    blogIndexDescription:
      "\u8fd9\u4e9b\u5185\u5bb9\u662f\u8ba1\u7b97\u5668\u80cc\u540e\u7684\u6559\u80b2\u5c42\uff1a\u5305\u62ec\u5b55\u671f\u9636\u6bb5\u70ed\u91cf\u3001\u996e\u98df\u7ed3\u6784\u3001\u4f53\u91cd\u8d8b\u52bf\u3001\u8865\u6c34\u4ee5\u53ca\u540e\u7eed\u95ee\u9898\u89e3\u91ca\u3002",
    blogIndexEmptyTitle: "\u8fd8\u6ca1\u6709\u5df2\u53d1\u5e03\u7684\u6307\u5357",
    blogIndexEmptyBody:
      "\u53ef\u4ee5\u5728 admin \u540e\u53f0\u53d1\u5e03\u5185\u5bb9\uff0c\u628a\u8fd9\u4e2a\u9875\u9762\u53d8\u6210\u8ba1\u7b97\u5668\u80cc\u540e\u7684 SEO \u6559\u80b2\u4e2d\u67a2\u3002",
    blogUpdatedLabel: "\u66f4\u65b0\u65f6\u95f4",
    blogIndexCta: "\u67e5\u770b\u5168\u90e8\u6307\u5357",
    blogNavLabel: "\u6307\u5357",
    blogFallbackTitle: "\u5185\u5bb9",
    blogFallbackDescription: "\u5b55\u671f\u8425\u517b\u76f8\u5173\u5185\u5bb9\u9875\u9762\u3002",
    blogPublishedEyebrow: "\u5df2\u53d1\u5e03\u6307\u5357",
    guestName: "\u8bbf\u5ba2",
  },
  es: {
    homeMetaTitle: "Calculadora IA de calorias en el embarazo",
    homeMetaDescription:
      "Calcula calorias del embarazo, revisa la explicacion y sigue con IA, perfiles guardados, registro de comidas y tendencias de peso.",
    calculatorMetaTitle: "Calculadora de calorias en el embarazo",
    calculatorMetaDescription:
      "Calcula calorias diarias en el embarazo con guias por trimestre y una capa de explicacion mas clara.",
    calculatorRuleAwareLabel: "Basado en reglas",
    calculatorWhyLabel: "Por que importa",
    calculatorWhyBody:
      "La calculadora debe sentirse mas segura que una tabla estatica porque muestra tanto la recomendacion como el paquete de reglas usado.",
    calculatorFaqEyebrow: "FAQ de la calculadora",
    calculatorFaqTitle: "Responde las preguntas de confianza antes de que la usuaria tenga que hacerlas.",
    calculatorFaqItems: [
      {
        question: "Que tan precisa es una calculadora de calorias en el embarazo?",
        answer:
          "Esta herramienta funciona mejor como una estimacion para planificar la alimentacion. Combina actividad, etapa del embarazo y paquetes de reglas, pero no sustituye la orientacion clinica ante complicaciones, embarazo multiple o necesidades medicas de nutricion.",
      },
      {
        question: "Por que cambian las necesidades caloricas por trimestre?",
        answer:
          "Las necesidades energeticas suelen aumentar a medida que avanza el embarazo porque cambian el crecimiento fetal, los tejidos maternos y la demanda diaria. La calculadora usa el trimestre para no fingir que un solo numero sirve para todo el embarazo.",
      },
      {
        question: "Que hago despues de recibir el resultado?",
        answer:
          "Usa el numero como ancla de planificacion, reparte la ingesta entre comidas y colaciones, revisa la explicacion y luego usa el seguimiento guardado o la IA si cambian el apetito, el peso o los sintomas.",
      },
    ],
    resultMetaTitle: "Resultado de calorias en el embarazo",
    resultMetaDescription:
      "Resultado personalizado de calorias en el embarazo segun tu sesion mas reciente de calculo.",
    aiMetaTitle: "Asistente IA de nutricion en el embarazo",
    aiMetaDescription:
      "Un asistente IA con limites claros para el seguimiento nutricional despues de la calculadora.",
    legalMetaTitle: "Aviso medico",
    legalMetaDescription:
      "El limite clinico para usar la calculadora de calorias y el asistente IA durante el embarazo.",
    signInMetaTitle: "Entrar",
    signInMetaDescription:
      "Inicia sesion para guardar tu perfil de embarazo y la tendencia de peso.",
    blogIndexMetaTitle: "Guias de nutricion en el embarazo",
    blogIndexMetaDescription:
      "Explora guias sobre calorias, tendencia de peso, planificacion de comidas, fibra e hidratacion durante el embarazo.",
    blogIndexEyebrow: "Biblioteca de contenido",
    blogIndexTitle: "Explora guias de nutricion creadas alrededor de la intencion del calculo.",
    blogIndexDescription:
      "Estas paginas funcionan como la capa educativa detras de la calculadora: calorias por trimestre, estructura de comidas, tendencias de peso, hidratacion y preguntas de seguimiento.",
    blogIndexEmptyTitle: "Aun no hay guias publicadas",
    blogIndexEmptyBody:
      "Publica contenido desde admin para convertir esta pagina en el hub SEO educativo detras de la calculadora.",
    blogUpdatedLabel: "Actualizado",
    blogIndexCta: "Ver todas las guias",
    blogNavLabel: "Guias",
    blogFallbackTitle: "Contenido",
    blogFallbackDescription: "Pagina de contenido sobre nutricion en el embarazo.",
    blogPublishedEyebrow: "Guia publicada",
    guestName: "Invitada",
  },
};

export function getMarketingPageCopy(locale: Locale) {
  return copy[locale];
}
