import { defaultLocale, type Locale } from "@/lib/i18n/config";

export type Dictionary = {
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    calculator: string;
    aiAssistant: string;
    disclaimer: string;
    signIn: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    bullets: string[];
  };
  calculator: {
    eyebrow: string;
    title: string;
    description: string;
    sourceNote: string;
    submitLabel: string;
    loadingLabel: string;
    helper: string;
  };
  calculatorForm: {
    age: string;
    height: string;
    heightUnit: string;
    prePregnancyWeight: string;
    currentWeight: string;
    weightUnit: string;
    gestationalWeek: string;
    activityLevel: string;
    pregnancyType: string;
    country: string;
    singleton: string;
    multiple: string;
    sedentary: string;
    light: string;
    moderate: string;
    active: string;
    metric: string;
    imperial: string;
    optional: string;
  };
  result: {
    eyebrow: string;
    title: string;
    subtitle: string;
    caloriesLabel: string;
    rangeLabel: string;
    trimesterLabel: string;
    sourceLabel: string;
    actionTitle: string;
    actions: string[];
    cautionTitle: string;
    cautionBody: string;
    missingTitle: string;
    missingBody: string;
    backCta: string;
    aiCta: string;
  };
  ai: {
    eyebrow: string;
    title: string;
    description: string;
    prompts: string[];
    inputLabel: string;
    placeholder: string;
    submitLabel: string;
    loadingLabel: string;
    responseLabel: string;
    riskLabel: string;
    safeLabel: string;
    emptyLabel: string;
  };
  legal: {
    eyebrow: string;
    title: string;
    bullets: string[];
  };
  sections: {
    pipelineTitle: string;
    pipelineBody: string;
    cards: Array<{ title: string; body: string }>;
  };
  content: {
    sectionTitle: string;
    sectionBody: string;
    readMore: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    brand: {
      name: "Nurture Daily",
      tagline: "Pregnancy nutrition, explained clearly.",
    },
    nav: {
      calculator: "Calculator",
      aiAssistant: "AI Assistant",
      disclaimer: "Medical Disclaimer",
      signIn: "Sign in",
    },
    hero: {
      eyebrow: "SEO-first pregnancy nutrition tool",
      title: "Estimate calories, explain the why, and guide the next step.",
      description:
        "A multilingual AI pregnancy calorie calculator for trimester-aware nutrition guidance, clearer results, and higher trust from first visit to repeat use.",
      primaryCta: "Open calculator",
      secondaryCta: "Explore the AI assistant",
      bullets: ["Anonymous first use", "Guideline-aware results", "Built for global audiences"],
    },
    calculator: {
      eyebrow: "Pregnancy calorie calculator",
      title: "Get a trimester-aware daily calorie recommendation in under a minute.",
      description:
        "This tool combines baseline energy needs, activity level, and region-specific guideline packs so the result feels more responsible than a one-size-fits-all calculator.",
      sourceNote:
        "Reference packs currently include US ACOG, UK NHS, and an international fallback. This is nutrition guidance, not a diagnosis.",
      submitLabel: "Calculate my calories",
      loadingLabel: "Calculating...",
      helper:
        "If you choose imperial units, enter height in inches and weight in pounds for this MVP.",
    },
    calculatorForm: {
      age: "Age",
      height: "Height",
      heightUnit: "Height unit",
      prePregnancyWeight: "Pre-pregnancy weight",
      currentWeight: "Current weight",
      weightUnit: "Weight unit",
      gestationalWeek: "Gestational week",
      activityLevel: "Activity level",
      pregnancyType: "Pregnancy type",
      country: "Guideline region",
      singleton: "Singleton",
      multiple: "Multiple pregnancy",
      sedentary: "Sedentary",
      light: "Light activity",
      moderate: "Moderate activity",
      active: "Active",
      metric: "Metric",
      imperial: "Imperial",
      optional: "Optional",
    },
    result: {
      eyebrow: "Explainable result",
      title: "Your daily calorie target",
      subtitle:
        "Use this as a nutrition planning reference. If symptoms or clinician instructions conflict with this result, follow your care team.",
      caloriesLabel: "Recommended calories",
      rangeLabel: "Suggested range",
      trimesterLabel: "Trimester",
      sourceLabel: "Guideline pack",
      actionTitle: "What to do next",
      actions: [
        "Split intake across 3 meals and 1-2 snacks instead of overloading one meal.",
        "Pair energy intake with protein, fiber, and hydration instead of chasing calories alone.",
        "If your appetite or weight trend shifts quickly, re-run the calculator and review the AI explanation.",
      ],
      cautionTitle: "Clinical caution",
      cautionBody:
        "Multiple pregnancy and higher-risk medical situations should be reviewed with a clinician or prenatal dietitian instead of relying on a generic tool.",
      missingTitle: "No result available",
      missingBody:
        "This page needs calculator output. Re-run the calculator to generate a fresh result.",
      backCta: "Back to calculator",
      aiCta: "Ask the AI assistant",
    },
    ai: {
      eyebrow: "AI nutrition explainer",
      title: "Use AI for follow-up questions, not for diagnosis.",
      description:
        "The assistant should extend the calculator result with meal planning, trimester context, and practical phrasing. It should not replace a doctor.",
      prompts: [
        "What does a 2,200 calorie day look like in 3 meals and 2 snacks?",
        "How should protein and fiber change in the second trimester?",
        "What should I ask my doctor if my weight is increasing too fast?",
      ],
      inputLabel: "Ask a nutrition question",
      placeholder: "Example: How should I split 2,200 calories across the day?",
      submitLabel: "Ask assistant",
      loadingLabel: "Thinking...",
      responseLabel: "Assistant response",
      riskLabel: "Escalation triggered",
      safeLabel: "General guidance",
      emptyLabel: "Ask a question or tap one of the suggested prompts.",
    },
    legal: {
      eyebrow: "Medical boundary",
      title: "This product is a nutrition reference, not a medical decision-maker.",
      bullets: [
        "Do not use this tool to diagnose or treat pregnancy complications.",
        "For bleeding, severe pain, chest pain, shortness of breath, or reduced fetal movement, contact a clinician urgently.",
        "Always defer to your own care team if their advice differs from this site.",
      ],
    },
    sections: {
      pipelineTitle: "From quick estimate to lasting utility",
      pipelineBody:
        "The product is designed as a search-friendly first touch that graduates into explanation, AI follow-up, and later retention.",
      cards: [
        {
          title: "Estimate",
          body: "Deliver a fast anonymous answer for high-intent search traffic.",
        },
        {
          title: "Interpret",
          body: "Translate the number into human language with visible rule packs and next-step guidance.",
        },
        {
          title: "Track",
          body: "Turn one-time utility into repeat value with saved profiles and weight trends.",
        },
      ],
    },
    content: {
      sectionTitle: "Featured guides",
      sectionBody:
        "Add explainers that support search intent around trimesters, weight trends, and meal planning.",
      readMore: "Read guide",
    },
  },
  "zh-CN": {
    brand: {
      name: "Nurture Daily",
      tagline: "把孕期营养讲清楚。",
    },
    nav: {
      calculator: "热量计算器",
      aiAssistant: "AI 助手",
      disclaimer: "医疗免责声明",
      signIn: "登录",
    },
    hero: {
      eyebrow: "面向全球的孕期营养工具站",
      title: "先给出热量建议，再把原因和下一步讲明白。",
      description:
        "这是一个多语言 AI 孕期热量计算器，用更可信的规则包、更清晰的解释和更好的结果页，把一次搜索访问变成长期使用。",
      primaryCta: "打开计算器",
      secondaryCta: "查看 AI 助手",
      bullets: ["首次可匿名使用", "按地区规则输出", "适合全球多语言流量"],
    },
    calculator: {
      eyebrow: "孕期热量计算器",
      title: "1 分钟内得到按孕期阶段区分的每日热量建议。",
      description:
        "这个工具会结合基础能量、活动量和地区规则包，输出比普通单公式计算器更负责任的结果。",
      sourceNote:
        "当前内置美国 ACOG、英国 NHS 和国际通用兜底规则。结果属于营养参考，不是医疗诊断。",
      submitLabel: "开始计算",
      loadingLabel: "计算中...",
      helper: "如果你选择英制，这个 MVP 版本请用英寸填写身高，用磅填写体重。",
    },
    calculatorForm: {
      age: "年龄",
      height: "身高",
      heightUnit: "身高单位",
      prePregnancyWeight: "孕前体重",
      currentWeight: "当前体重",
      weightUnit: "体重单位",
      gestationalWeek: "孕周",
      activityLevel: "活动水平",
      pregnancyType: "妊娠类型",
      country: "规则地区",
      singleton: "单胎",
      multiple: "多胎",
      sedentary: "久坐",
      light: "轻度活动",
      moderate: "中度活动",
      active: "高活动量",
      metric: "公制",
      imperial: "英制",
      optional: "选填",
    },
    result: {
      eyebrow: "可解释结果",
      title: "你的每日热量目标",
      subtitle: "请把它当作饮食规划参考。如果症状或医生建议与结果冲突，应优先遵循医生意见。",
      caloriesLabel: "推荐热量",
      rangeLabel: "建议范围",
      trimesterLabel: "孕期阶段",
      sourceLabel: "规则来源",
      actionTitle: "下一步怎么做",
      actions: [
        "建议把热量分配到 3 餐和 1-2 次加餐，而不是集中在一顿里。",
        "热量之外，更要同时关注蛋白质、膳食纤维和补水。",
        "如果食欲或体重变化很快，建议重新计算并结合 AI 解释页面一起看。",
      ],
      cautionTitle: "临床提醒",
      cautionBody: "多胎妊娠或高风险情况，不建议只依赖通用工具，应尽快咨询医生或产科营养师。",
      missingTitle: "当前没有可展示的结果",
      missingBody: "这个页面需要先由计算器生成结果。请返回重新计算。",
      backCta: "返回计算器",
      aiCta: "继续问 AI 助手",
    },
    ai: {
      eyebrow: "AI 营养解释器",
      title: "AI 适合做解释，不适合代替诊断。",
      description:
        "这里的 AI 应该负责把结果讲明白、给出饮食建议和孕周上下文，而不是替代医生做判断。",
      prompts: [
        "2200 千卡的一天可以怎么分配三餐和加餐？",
        "孕中期蛋白质和膳食纤维要怎么调整？",
        "如果我体重增长过快，和医生沟通时该问什么？",
      ],
      inputLabel: "输入一个营养问题",
      placeholder: "例如：2200 千卡应该怎么分配到一天里？",
      submitLabel: "开始提问",
      loadingLabel: "思考中...",
      responseLabel: "助手回复",
      riskLabel: "已触发风险升级",
      safeLabel: "一般建议",
      emptyLabel: "输入问题，或者直接点一个推荐问题开始。",
    },
    legal: {
      eyebrow: "医疗边界",
      title: "本产品是营养参考工具，不是医疗决策工具。",
      bullets: [
        "不要用这个工具诊断或处理妊娠并发症。",
        "如果出现出血、剧烈腹痛、胸痛、呼吸困难或胎动明显减少，请尽快联系医生。",
        "如果你的产检团队给出的建议不同，应优先遵循他们的意见。",
      ],
    },
    sections: {
      pipelineTitle: "从快速估算，到持续使用",
      pipelineBody: "产品结构不是单点计算器，而是搜索入口、解释页和后续留存能力的组合。",
      cards: [
        {
          title: "先估算",
          body: "先承接高意图搜索流量，让用户匿名获得第一份结果。",
        },
        {
          title: "再解释",
          body: "把数字翻译成用户能理解的语言，并明确规则来源和下一步动作。",
        },
        {
          title: "再沉淀",
          body: "后续通过档案、体重趋势和 AI 问答把工具升级为长期使用产品。",
        },
      ],
    },
    content: {
      sectionTitle: "精选内容",
      sectionBody: "用孕周、体重趋势和饮食结构类内容承接更多搜索意图。",
      readMore: "查看内容",
    },
  },
  es: {
    brand: {
      name: "Nurture Daily",
      tagline: "Nutrición en el embarazo, bien explicada.",
    },
    nav: {
      calculator: "Calculadora",
      aiAssistant: "Asistente IA",
      disclaimer: "Aviso médico",
      signIn: "Entrar",
    },
    hero: {
      eyebrow: "Herramienta SEO para nutrición prenatal",
      title: "Calcula calorías, explica el porqué y guía el siguiente paso.",
      description:
        "Una calculadora multilingüe de calorías en el embarazo con IA, pensada para resultados más claros, reglas visibles y mejor confianza desde la primera visita.",
      primaryCta: "Abrir calculadora",
      secondaryCta: "Ver asistente IA",
      bullets: ["Uso anónimo inicial", "Resultados según guía", "Pensado para audiencias globales"],
    },
    calculator: {
      eyebrow: "Calculadora de calorías en el embarazo",
      title: "Obtén una recomendación diaria según el trimestre en menos de un minuto.",
      description:
        "La herramienta combina gasto basal, nivel de actividad y paquetes de guías regionales para ofrecer un resultado más responsable.",
      sourceNote:
        "Actualmente incluye ACOG de EE. UU., NHS del Reino Unido y una referencia internacional genérica. No es un diagnóstico médico.",
      submitLabel: "Calcular calorías",
      loadingLabel: "Calculando...",
      helper: "Si eliges unidades imperiales, en este MVP introduce la altura en pulgadas y el peso en libras.",
    },
    calculatorForm: {
      age: "Edad",
      height: "Altura",
      heightUnit: "Unidad de altura",
      prePregnancyWeight: "Peso antes del embarazo",
      currentWeight: "Peso actual",
      weightUnit: "Unidad de peso",
      gestationalWeek: "Semana de gestación",
      activityLevel: "Nivel de actividad",
      pregnancyType: "Tipo de embarazo",
      country: "Región de guía",
      singleton: "Único",
      multiple: "Múltiple",
      sedentary: "Sedentario",
      light: "Actividad ligera",
      moderate: "Actividad moderada",
      active: "Activa",
      metric: "Métrico",
      imperial: "Imperial",
      optional: "Opcional",
    },
    result: {
      eyebrow: "Resultado explicable",
      title: "Tu objetivo diario de calorías",
      subtitle:
        "Úsalo como referencia nutricional. Si tus síntomas o tu equipo médico indican otra cosa, sigue su criterio.",
      caloriesLabel: "Calorías recomendadas",
      rangeLabel: "Rango sugerido",
      trimesterLabel: "Trimestre",
      sourceLabel: "Guía usada",
      actionTitle: "Qué hacer después",
      actions: [
        "Distribuye la ingesta en 3 comidas y 1-2 colaciones, en lugar de concentrarla en una sola comida.",
        "No persigas solo calorías: combina energía con proteína, fibra e hidratación.",
        "Si el apetito o el peso cambian rápido, recalcula y revisa la explicación de la IA.",
      ],
      cautionTitle: "Precaución clínica",
      cautionBody:
        "Los embarazos múltiples o de alto riesgo deben revisarse con un profesional en lugar de depender de una herramienta genérica.",
      missingTitle: "No hay resultado disponible",
      missingBody: "Esta página necesita una salida previa de la calculadora. Vuelve y genera un nuevo resultado.",
      backCta: "Volver a la calculadora",
      aiCta: "Preguntar a la IA",
    },
    ai: {
      eyebrow: "Explicador de nutrición con IA",
      title: "La IA sirve para explicar, no para diagnosticar.",
      description:
        "El asistente debe ampliar el resultado con ideas de comidas, contexto por trimestre y lenguaje práctico, sin reemplazar a un médico.",
      prompts: [
        "¿Cómo se ve un día de 2.200 calorías en 3 comidas y 2 colaciones?",
        "¿Cómo cambian la proteína y la fibra en el segundo trimestre?",
        "¿Qué debería preguntar a mi médico si aumento de peso demasiado rápido?",
      ],
      inputLabel: "Haz una pregunta de nutrición",
      placeholder: "Ejemplo: ¿Cómo reparto 2.200 calorías durante el día?",
      submitLabel: "Preguntar",
      loadingLabel: "Pensando...",
      responseLabel: "Respuesta del asistente",
      riskLabel: "Escalada activada",
      safeLabel: "Guía general",
      emptyLabel: "Haz una pregunta o toca una de las sugerencias.",
    },
    legal: {
      eyebrow: "Límite médico",
      title: "Este producto es una referencia nutricional, no un sistema de decisiones médicas.",
      bullets: [
        "No uses esta herramienta para diagnosticar o tratar complicaciones del embarazo.",
        "Si tienes sangrado, dolor intenso, dolor torácico, dificultad para respirar o menos movimiento fetal, busca atención médica.",
        "Si tu equipo clínico te indica otra cosa, su criterio tiene prioridad.",
      ],
    },
    sections: {
      pipelineTitle: "De cálculo rápido a utilidad recurrente",
      pipelineBody:
        "El producto se diseña como una primera visita orientada a SEO que evoluciona hacia explicación, IA y retención.",
      cards: [
        {
          title: "Calcular",
          body: "Dar una respuesta rápida y anónima para tráfico de búsqueda con alta intención.",
        },
        {
          title: "Interpretar",
          body: "Convertir el número en lenguaje humano con reglas visibles y recomendaciones claras.",
        },
        {
          title: "Seguir",
          body: "Transformar una utilidad puntual en valor repetido con perfil y tendencias de peso.",
        },
      ],
    },
    content: {
      sectionTitle: "Guías destacadas",
      sectionBody:
        "Añade explicadores que respondan búsquedas sobre trimestres, peso y estructura de comidas.",
      readMore: "Leer guía",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
