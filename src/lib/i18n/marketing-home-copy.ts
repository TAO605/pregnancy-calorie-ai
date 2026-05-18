import type { Locale } from "@/lib/i18n/config";

type MarketingHomeCardCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

type MarketingHomeCopy = {
  metadataDescription: string;
  loopEyebrow: string;
  loopTitle: string;
  loopBody: string;
  loopCards: MarketingHomeCardCopy[];
  featureEyebrow: string;
  featureTitle: string;
  featureBody: string;
  featureCards: MarketingHomeCardCopy[];
  guideEmptyTitle: string;
  guideEmptyBody: string;
  guideFallbackCards: MarketingHomeCardCopy[];
};

const copy: Record<Locale, MarketingHomeCopy> = {
  en: {
    metadataDescription:
      "Estimate pregnancy calories, review the reasoning, and keep going with AI follow-up, saved profiles, meal logging, and weight trends.",
    loopEyebrow: "What already ships",
    loopTitle: "The calculator is the entry point. The loop is the product.",
    loopBody:
      "Search can win the first visit, but repeat usage comes from turning one calorie answer into saved context, AI follow-up, and lightweight tracking.",
    loopCards: [
      {
        eyebrow: "01 First answer",
        title: "Calculator with visible rule packs",
        body: "Get a trimester-aware calorie target with source guidance instead of a black-box number.",
        cta: "Run calculator",
      },
      {
        eyebrow: "02 Clarify",
        title: "AI follow-up with saved context",
        body: "Turn the result into meal ideas, weight questions, and practical next steps without retyping everything.",
        cta: "Open AI assistant",
      },
      {
        eyebrow: "03 Return",
        title: "Dashboard for profile, meals, and weight",
        body: "Signed-in users can keep a living plan with saved preferences, meal logs, and trend snapshots.",
        cta: "Open dashboard",
      },
    ],
    featureEyebrow: "Built into this prototype",
    featureTitle: "Four retention surfaces are already live",
    featureBody:
      "The site now behaves like an AI tool product instead of a single landing page. Users can save inputs, revisit trends, and return with sharper questions.",
    featureCards: [
      {
        eyebrow: "Saved profile",
        title: "Keep the next calculation warm",
        body: "Gestational week, region, and dietary preferences can stay ready for the next session instead of being re-entered from scratch.",
        cta: "View profile",
      },
      {
        eyebrow: "Weight trend",
        title: "Review the signal, not one weigh-in",
        body: "Weight entries roll into a summary that can be passed into the AI assistant for interpretation.",
        cta: "Open weight tracker",
      },
      {
        eyebrow: "Meal log",
        title: "Compare intake against the calorie target",
        body: "Simple meal logging is connected to the latest recommended calories and preference-aware idea cards.",
        cta: "Open meals tracker",
      },
      {
        eyebrow: "AI memory",
        title: "Re-enter through context instead of a blank box",
        body: "Users can jump from result, dashboard, or weight review into AI with prefilled prompts and saved history.",
        cta: "Ask AI with context",
      },
    ],
    guideEmptyTitle: "No guides are published yet",
    guideEmptyBody:
      "Until editorial content is added in admin, keep this shelf useful by routing visitors into the calculator, AI follow-up, and saved tracking flow.",
    guideFallbackCards: [
      {
        eyebrow: "Starter route",
        title: "Begin with a calorie estimate",
        body: "The calculator is still the fastest way to turn search traffic into a useful first answer.",
        cta: "Open calculator",
      },
      {
        eyebrow: "Follow-up route",
        title: "Use AI to turn the number into a plan",
        body: "Prompt the assistant for meal timing, appetite changes, and clinician questions once the estimate exists.",
        cta: "Open AI assistant",
      },
      {
        eyebrow: "Retention route",
        title: "Save the profile and start tracking",
        body: "Move from a one-off visit into saved preferences, weight logging, and meal review.",
        cta: "Unlock dashboard",
      },
    ],
  },
  "zh-CN": {
    metadataDescription:
      "\u5148\u4f30\u7b97\u5b55\u671f\u70ed\u91cf\uff0c\u518d\u7ed3\u5408 AI \u8ffd\u95ee\u3001\u5df2\u4fdd\u5b58\u6863\u6848\u3001\u996e\u98df\u8bb0\u5f55\u548c\u4f53\u91cd\u8d8b\u52bf\uff0c\u5f62\u6210\u8fde\u7eed\u4f7f\u7528\u95ed\u73af\u3002",
    loopEyebrow: "\u73b0\u5728\u5df2\u7ecf\u5177\u5907",
    loopTitle: "\u8ba1\u7b97\u5668\u53ea\u662f\u5165\u53e3\uff0c\u95ed\u73af\u624d\u662f\u4ea7\u54c1\u3002",
    loopBody:
      "\u641c\u7d22\u53ef\u4ee5\u5e26\u6765\u7b2c\u4e00\u6b21\u8bbf\u95ee\uff0c\u4f46\u771f\u6b63\u7684\u7559\u5b58\u6765\u81ea\u4e8e\u628a\u4e00\u6b21\u70ed\u91cf\u7ed3\u679c\u53d8\u6210\u53ef\u4fdd\u5b58\u7684\u4e0a\u4e0b\u6587\u3001AI \u8ffd\u95ee\u548c\u8f7b\u91cf\u8ffd\u8e2a\u3002",
    loopCards: [
      {
        eyebrow: "01 \u5148\u7ed9\u7b54\u6848",
        title: "\u5e26\u89c4\u5219\u6765\u6e90\u7684\u70ed\u91cf\u8ba1\u7b97\u5668",
        body: "\u7528\u5206\u5b55\u671f\u9636\u6bb5\u548c\u53ef\u89c1\u6765\u6e90\u7ed9\u51fa\u7ed3\u679c\uff0c\u800c\u4e0d\u662f\u4e00\u4e2a\u9ed1\u76d2\u6570\u5b57\u3002",
        cta: "\u6253\u5f00\u8ba1\u7b97\u5668",
      },
      {
        eyebrow: "02 \u518d\u505a\u89e3\u91ca",
        title: "\u5e26\u4e0a\u4e0b\u6587\u7684 AI \u8ffd\u95ee",
        body: "\u628a\u7ed3\u679c\u8f6c\u6210\u996e\u98df\u5efa\u8bae\u3001\u4f53\u91cd\u95ee\u9898\u548c\u53ef\u6267\u884c\u7684\u4e0b\u4e00\u6b65\uff0c\u4e0d\u7528\u53cd\u590d\u91cd\u65b0\u8f93\u5165\u3002",
        cta: "\u6253\u5f00 AI \u52a9\u624b",
      },
      {
        eyebrow: "03 \u518d\u6b21\u56de\u6765",
        title: "\u6863\u6848\u3001\u996e\u98df\u548c\u4f53\u91cd\u7684 dashboard",
        body: "\u767b\u5f55\u540e\u53ef\u4ee5\u628a\u504f\u597d\u3001\u996e\u98df\u8bb0\u5f55\u548c\u8d8b\u52bf\u5feb\u7167\u4fdd\u7559\u4e0b\u6765\uff0c\u8ba9\u8ba1\u5212\u6301\u7eed\u751f\u957f\u3002",
        cta: "\u6253\u5f00 dashboard",
      },
    ],
    featureEyebrow: "\u8fd9\u4e2a\u539f\u578b\u5df2\u7ecf\u6709",
    featureTitle: "\u56db\u4e2a\u7559\u5b58\u9762\u90fd\u5df2\u7ecf\u8fde\u4e0a",
    featureBody:
      "\u8fd9\u4e2a\u7ad9\u70b9\u73b0\u5728\u5df2\u7ecf\u4e0d\u662f\u5355\u9875\u8ba1\u7b97\u5668\uff0c\u800c\u662f\u4e00\u4e2a\u53ef\u4ee5\u4fdd\u5b58\u8f93\u5165\u3001\u56de\u770b\u8d8b\u52bf\u3001\u5e26\u7740\u4e0a\u4e0b\u6587\u8ffd\u95ee\u7684 AI \u5de5\u5177\u7ad9\u3002",
    featureCards: [
      {
        eyebrow: "\u5df2\u4fdd\u5b58\u6863\u6848",
        title: "\u4e0b\u4e00\u6b21\u8ba1\u7b97\u4e0d\u7528\u4ece\u7a7a\u767d\u5f00\u59cb",
        body: "\u5b55\u5468\u3001\u5730\u533a\u548c\u996e\u98df\u504f\u597d\u53ef\u4ee5\u4fdd\u7559\u4e0b\u6765\uff0c\u4e0b\u6b21\u76f4\u63a5\u5728\u5df2\u6709\u57fa\u7840\u4e0a\u7ee7\u7eed\u3002",
        cta: "\u67e5\u770b\u6863\u6848",
      },
      {
        eyebrow: "\u4f53\u91cd\u8d8b\u52bf",
        title: "\u770b\u6574\u4f53\u4fe1\u53f7\uff0c\u4e0d\u53ea\u770b\u4e00\u6b21\u79f0\u91cd",
        body: "\u4f53\u91cd\u8bb0\u5f55\u4f1a\u88ab\u6574\u7406\u6210\u6458\u8981\uff0c\u7136\u540e\u7ee7\u7eed\u4f20\u7ed9 AI \u505a\u5206\u6790\u3002",
        cta: "\u6253\u5f00\u4f53\u91cd\u8ffd\u8e2a",
      },
      {
        eyebrow: "\u996e\u98df\u8bb0\u5f55",
        title: "\u628a\u5b9e\u9645\u5403\u4e86\u4ec0\u4e48\u548c\u70ed\u91cf\u76ee\u6807\u5bf9\u4e0a",
        body: "\u7b80\u5355\u8bb0\u4e0b\u9910\u98df\u540e\uff0c\u5c31\u80fd\u76f4\u63a5\u5bf9\u7167\u6700\u65b0\u70ed\u91cf\u76ee\u6807\uff0c\u540c\u65f6\u770b\u5230\u504f\u597d\u5339\u914d\u7684\u5efa\u8bae\u5361\u7247\u3002",
        cta: "\u6253\u5f00\u9910\u98df\u8ffd\u8e2a",
      },
      {
        eyebrow: "AI \u4e0a\u4e0b\u6587",
        title: "\u4ece\u7ed3\u679c\u9875\u8fdb\u5165 AI\uff0c\u4e0d\u518d\u662f\u4e00\u4e2a\u7a7a\u767d\u8f93\u5165\u6846",
        body: "\u53ef\u4ee5\u4ece\u7ed3\u679c\u3001dashboard \u6216\u4f53\u91cd\u9875\u76f4\u63a5\u8df3\u8f6c\u5230 AI\uff0c\u5e26\u7740\u9884\u586b prompt \u548c\u5df2\u4fdd\u5b58\u5386\u53f2\u3002",
        cta: "\u7528 AI \u7ee7\u7eed",
      },
    ],
    guideEmptyTitle: "\u8fd8\u6ca1\u6709\u53d1\u5e03\u6307\u5357\u5185\u5bb9",
    guideEmptyBody:
      "\u5728 admin \u8fd8\u6ca1\u6709\u8865\u9f50\u5185\u5bb9\u4e4b\u524d\uff0c\u8fd9\u4e2a\u4f4d\u7f6e\u4ecd\u7136\u53ef\u4ee5\u628a\u8bbf\u5ba2\u5bfc\u5411\u8ba1\u7b97\u5668\u3001AI \u8ffd\u95ee\u548c\u4fdd\u5b58\u8ffd\u8e2a\u6d41\u7a0b\u3002",
    guideFallbackCards: [
      {
        eyebrow: "\u8d77\u70b9\u8def\u5f84",
        title: "\u5148\u7ed9\u51fa\u4e00\u4e2a\u70ed\u91cf\u4f30\u7b97",
        body: "\u5bf9\u9ad8\u610f\u56fe\u641c\u7d22\u6d41\u91cf\u6765\u8bf4\uff0c\u8ba1\u7b97\u5668\u4ecd\u7136\u662f\u6700\u5feb\u7684\u7b2c\u4e00\u4e2a\u6709\u7528\u7ed3\u679c\u3002",
        cta: "\u6253\u5f00\u8ba1\u7b97\u5668",
      },
      {
        eyebrow: "\u8ffd\u95ee\u8def\u5f84",
        title: "\u7528 AI \u628a\u6570\u5b57\u53d8\u6210\u8ba1\u5212",
        body: "\u5728\u6709\u4e86\u4f30\u7b97\u7ed3\u679c\u540e\uff0c\u518d\u8ba9 AI \u5e2e\u4f60\u62c6\u996e\u98df\u8282\u594f\u3001\u98df\u6b32\u53d8\u5316\u548c\u95ee\u533b\u95ee\u9898\u3002",
        cta: "\u6253\u5f00 AI \u52a9\u624b",
      },
      {
        eyebrow: "\u7559\u5b58\u8def\u5f84",
        title: "\u4fdd\u5b58\u6863\u6848\u5e76\u5f00\u59cb\u8ffd\u8e2a",
        body: "\u628a\u4e00\u6b21\u8bbf\u95ee\u53d8\u6210\u53ef\u56de\u6765\u7684\u4f7f\u7528\u4e60\u60ef\uff0c\u8fde\u4e0a\u504f\u597d\u3001\u4f53\u91cd\u548c\u996e\u98df\u8bb0\u5f55\u3002",
        cta: "\u5f00\u542f dashboard",
      },
    ],
  },
  es: {
    metadataDescription:
      "Calcula calorias del embarazo, revisa la explicacion y sigue con IA, perfiles guardados, registro de comidas y tendencias de peso.",
    loopEyebrow: "Lo que ya existe",
    loopTitle: "La calculadora es la entrada. El producto real es el ciclo.",
    loopBody:
      "La busqueda puede traer la primera visita, pero el retorno llega cuando una respuesta puntual se convierte en contexto guardado, seguimiento ligero y preguntas mejores para la IA.",
    loopCards: [
      {
        eyebrow: "01 Primera respuesta",
        title: "Calculadora con reglas visibles",
        body: "Obtiene un objetivo calorico por trimestre con una fuente visible, no solo un numero opaco.",
        cta: "Abrir calculadora",
      },
      {
        eyebrow: "02 Aclarar",
        title: "Seguimiento con IA y contexto guardado",
        body: "Convierte el resultado en ideas de comidas, preguntas sobre el peso y siguientes pasos practicos sin escribir todo otra vez.",
        cta: "Abrir asistente IA",
      },
      {
        eyebrow: "03 Volver",
        title: "Dashboard para perfil, comidas y peso",
        body: "Las personas con sesion iniciada pueden mantener un plan vivo con preferencias guardadas, comidas y resumenes de tendencia.",
        cta: "Abrir dashboard",
      },
    ],
    featureEyebrow: "Ya esta dentro del prototipo",
    featureTitle: "Cuatro superficies de retencion ya estan activas",
    featureBody:
      "El sitio ya se comporta como un producto de herramientas IA y no como una sola landing page. Se pueden guardar datos, revisar tendencias y volver con mejor contexto.",
    featureCards: [
      {
        eyebrow: "Perfil guardado",
        title: "La siguiente calculacion no empieza desde cero",
        body: "Semana de gestacion, region y preferencias dietarias pueden quedarse listas para la siguiente sesion.",
        cta: "Ver perfil",
      },
      {
        eyebrow: "Tendencia de peso",
        title: "Mirar la senal completa, no una sola medicion",
        body: "Las entradas de peso se convierten en un resumen util que puede pasar al asistente IA para interpretacion.",
        cta: "Abrir seguimiento de peso",
      },
      {
        eyebrow: "Registro de comidas",
        title: "Comparar la ingesta con el objetivo calorico",
        body: "El registro simple de comidas ya esta conectado con el ultimo objetivo y con ideas segun preferencias.",
        cta: "Abrir seguimiento de comidas",
      },
      {
        eyebrow: "Contexto IA",
        title: "Entrar en IA desde una situacion real, no desde una caja vacia",
        body: "El usuario puede saltar desde resultados o seguimiento hacia IA con prompts prefijados e historial guardado.",
        cta: "Preguntar a la IA",
      },
    ],
    guideEmptyTitle: "Todavia no hay guias publicadas",
    guideEmptyBody:
      "Mientras el contenido editorial no se cargue desde admin, esta seccion puede seguir siendo util si empuja al usuario hacia calculadora, IA y seguimiento guardado.",
    guideFallbackCards: [
      {
        eyebrow: "Ruta inicial",
        title: "Empezar con una estimacion calorica",
        body: "La calculadora sigue siendo la forma mas rapida de convertir trafico de busqueda en una primera respuesta util.",
        cta: "Abrir calculadora",
      },
      {
        eyebrow: "Ruta de seguimiento",
        title: "Usar IA para convertir el numero en un plan",
        body: "Una vez existe la estimacion, la IA puede ayudar con horarios, apetito y preguntas para el medico.",
        cta: "Abrir asistente IA",
      },
      {
        eyebrow: "Ruta de retencion",
        title: "Guardar el perfil y empezar a seguir",
        body: "Pasa de una visita puntual a preferencias guardadas, peso y revision de comidas.",
        cta: "Desbloquear dashboard",
      },
    ],
  },
};

export function getMarketingHomeCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
