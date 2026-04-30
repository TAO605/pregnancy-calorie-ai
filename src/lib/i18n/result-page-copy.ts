import type { Locale } from "@/lib/i18n/config";

type BmiClass = "underweight" | "normal" | "overweight" | "obese";

type ResultPromptInput = {
  recommendedCalories: number;
  source: string;
};

type ResultPageCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  card: {
    caloriesLabel: string;
    perDayLabel: string;
    rangeLabel: string;
    rangeHint: string;
    formatTrimesterChip: (trimester: number) => string;
    formatSourceChip: (source: string) => string;
  };
  explanation: {
    eyebrow: string;
    title: string;
    extraCaloriesTitle: string;
    formatExtraCaloriesBody: (extraCalories: number, trimester: number) => string;
    sourceTitle: string;
    formatSourceBody: (source: string) => string;
    bmiTitle: string;
    bmiBodies: Record<BmiClass, string>;
    rangeTitle: string;
    rangeBody: string;
  };
  actionTitle: string;
  actions: string[];
  cautionTitle: string;
  cautionBody: string;
  flagTitle: string;
  flagDescriptions: Record<string, { label: string; body: string }>;
  prompts: {
    eyebrow: string;
    title: string;
    items: Array<{
      title: string;
      body: string;
      cta: string;
      buildPrompt: (input: ResultPromptInput) => string;
    }>;
  };
  guides: {
    eyebrow: string;
    title: string;
    body: string;
  };
  missingTitle: string;
  missingBody: string;
  backCta: string;
  aiCta: string;
};

const copy: Record<Locale, ResultPageCopy> = {
  en: {
    eyebrow: "Explainable result",
    title: "Your daily calorie target",
    subtitle:
      "Use this as a nutrition planning reference. If symptoms or clinician instructions conflict with this result, follow your care team.",
    card: {
      caloriesLabel: "Recommended calories",
      perDayLabel: "kcal/day",
      rangeLabel: "Suggested range",
      rangeHint:
        "Treat the target like a working anchor, not a pass-fail score for the day.",
      formatTrimesterChip: (trimester) => `Trimester ${trimester}`,
      formatSourceChip: (source) => source,
    },
    explanation: {
      eyebrow: "What shapes this number",
      title: "Turn the result into a planning explanation, not just an output.",
      extraCaloriesTitle: "Trimester uplift",
      formatExtraCaloriesBody: (extraCalories, trimester) =>
        `This calculation adds about ${extraCalories} kcal for trimester ${trimester} based on the active guideline pack.`,
      sourceTitle: "Guideline source",
      formatSourceBody: (source) =>
        `${source} is the reference layer behind the estimate, so the result reflects a named rule set instead of a generic calorie guess.`,
      bmiTitle: "Starting-weight context",
      bmiBodies: {
        underweight:
          "A lower pre-pregnancy BMI can make professional follow-up more important if appetite, nausea, or weight gain feel hard to manage.",
        normal:
          "This result assumes a typical baseline context and still works best when combined with real appetite, symptom, and weight-trend judgment.",
        overweight:
          "A higher pre-pregnancy BMI does not make calorie planning irrelevant, but it does make individualized clinical advice more valuable when progress feels unclear.",
        obese:
          "When pre-pregnancy BMI starts higher, calorie planning should stay practical and symptom-aware rather than overly restrictive without clinician input.",
      },
      rangeTitle: "Range mindset",
      rangeBody:
        "The range exists because daily intake is noisy. Consistency across meals, appetite, and weekly patterns matters more than forcing a perfect single-day number.",
    },
    actionTitle: "What to do next",
    actions: [
      "Split intake across 3 meals and 1-2 snacks instead of overloading one meal.",
      "Pair energy intake with protein, fiber, and hydration instead of chasing calories alone.",
      "If appetite, symptoms, or weight trend shift quickly, re-run the calculator and review the AI explanation.",
    ],
    cautionTitle: "Clinical caution",
    cautionBody:
      "Multiple pregnancy and higher-risk medical situations should be reviewed with a clinician or prenatal dietitian instead of relying on a generic tool.",
    flagTitle: "Active caution",
    flagDescriptions: {
      multiple_pregnancy_requires_clinician_review: {
        label: "Multiple pregnancy",
        body: "Twin or higher-order pregnancy often needs a more individualized review than a standard consumer calculator can provide.",
      },
    },
    prompts: {
      eyebrow: "AI follow-up",
      title: "Use the result to ask sharper questions immediately.",
      items: [
        {
          title: "Meal structure",
          body: "Turn the calorie target into a practical day split across meals and snacks.",
          cta: "Ask for a meal split",
          buildPrompt: ({ recommendedCalories, source }) =>
            `My current result is ${recommendedCalories} kcal using ${source}. Help me split that into breakfast, lunch, dinner, and 1-2 snacks with practical calorie ranges.`,
        },
        {
          title: "Protein and fiber",
          body: "Ask how meal quality should support this number instead of tracking calories alone.",
          cta: "Ask about meal quality",
          buildPrompt: ({ recommendedCalories, source }) =>
            `My current result is ${recommendedCalories} kcal based on ${source}. How should I think about protein, fiber, and hydration so this target is easier to follow?`,
        },
        {
          title: "When to revisit",
          body: "Clarify what kinds of appetite or weight changes should trigger another review.",
          cta: "Ask when to re-check",
          buildPrompt: ({ recommendedCalories, source }) =>
            `My current pregnancy calorie result is ${recommendedCalories} kcal using ${source}. What changes in appetite, weight trend, or symptoms should make me re-check the plan or ask a clinician?`,
        },
      ],
    },
    guides: {
      eyebrow: "Related guides",
      title: "Keep the result connected to deeper content.",
      body: "Move from a calorie number into education about trimesters, meal structure, and weight trends.",
    },
    missingTitle: "No result available",
    missingBody:
      "This page needs calculator output. Re-run the calculator to generate a fresh result.",
    backCta: "Back to calculator",
    aiCta: "Ask the AI assistant",
  },
  "zh-CN": {
    eyebrow: "可解释结果",
    title: "你的每日热量目标",
    subtitle:
      "请把它当作饮食规划参考。如果症状或医生建议与结果冲突，应优先遵循医生意见。",
    card: {
      caloriesLabel: "推荐热量",
      perDayLabel: "kcal/天",
      rangeLabel: "建议范围",
      rangeHint: "把目标当作规划锚点，而不是当天必须考满分的数字。",
      formatTrimesterChip: (trimester) => `第 ${trimester} 孕期阶段`,
      formatSourceChip: (source) => source,
    },
    explanation: {
      eyebrow: "这个数字怎么来的",
      title: "把结果变成可以执行的解释，而不只是一个输出数字。",
      extraCaloriesTitle: "孕期阶段加成",
      formatExtraCaloriesBody: (extraCalories, trimester) =>
        `这次计算会根据当前阶段额外加入约 ${extraCalories} kcal，对应的是第 ${trimester} 阶段和当前启用的规则包。`,
      sourceTitle: "规则来源",
      formatSourceBody: (source) =>
        `${source} 是这次估算背后的参考层，所以结果不是一个模糊的通用猜测，而是基于明确规则集得出的范围。`,
      bmiTitle: "孕前体重背景",
      bmiBodies: {
        underweight:
          "如果孕前 BMI 偏低，遇到食欲差、孕吐重或体重增长困难时，更应该结合专业意见看待这个结果。",
        normal:
          "这个结果更适合作为常规基线使用，但依然需要结合你真实的食欲、症状和体重趋势来判断。",
        overweight:
          "如果孕前 BMI 偏高，热量规划仍然有价值，但当过程不顺或变化不清晰时，更值得加上个体化专业建议。",
        obese:
          "如果孕前 BMI 更高，热量规划应以稳定、可持续和症状友好为主，而不是在没有专业指导下过度收紧。",
      },
      rangeTitle: "范围思维",
      rangeBody:
        "之所以给范围，是因为每天的摄入本来就会波动。比起死盯某一天的精准数字，更重要的是一周内的节奏、食欲和饮食结构。",
    },
    actionTitle: "下一步怎么做",
    actions: [
      "把摄入拆分到 3 顿正餐和 1-2 次加餐，而不是把热量压在一餐里完成。",
      "不要只追热量数字，同时把蛋白质、纤维和补水一起考虑进去。",
      "如果食欲、症状或体重趋势变化很快，重新计算一次，再结合 AI 解释继续看。",
    ],
    cautionTitle: "临床提醒",
    cautionBody:
      "多胎妊娠和更高风险的医疗情况，不适合只依赖通用工具，应结合医生或孕期营养师做判断。",
    flagTitle: "当前提醒",
    flagDescriptions: {
      multiple_pregnancy_requires_clinician_review: {
        label: "多胎妊娠",
        body: "双胎或更多胎的营养需求通常更个体化，标准消费级计算器不适合单独作为依据。",
      },
    },
    prompts: {
      eyebrow: "AI 追问",
      title: "拿着结果直接问更具体的问题，而不是从空白开始。",
      items: [
        {
          title: "三餐加餐怎么分",
          body: "把热量目标拆成一整天更容易执行的结构。",
          cta: "让 AI 帮我分配三餐",
          buildPrompt: ({ recommendedCalories, source }) =>
            `我当前的结果是 ${recommendedCalories} kcal，参考规则是 ${source}。请帮我拆成早餐、午餐、晚餐和 1-2 次加餐，并给出比较实用的热量分配思路。`,
        },
        {
          title: "蛋白质和纤维怎么配",
          body: "把重点从“只看热量”转到“怎么吃更稳”。",
          cta: "让 AI 解释饮食结构",
          buildPrompt: ({ recommendedCalories, source }) =>
            `我当前的结果是 ${recommendedCalories} kcal，参考规则是 ${source}。如果我不想只盯热量，蛋白质、纤维和补水应该怎么一起安排？`,
        },
        {
          title: "什么时候该重新评估",
          body: "搞清楚哪些食欲、体重或症状变化值得重新看这个计划。",
          cta: "让 AI 说明何时复查",
          buildPrompt: ({ recommendedCalories, source }) =>
            `我当前的孕期热量结果是 ${recommendedCalories} kcal，参考规则是 ${source}。哪些食欲、体重趋势或症状变化说明我应该重新检查这个计划，或者去问医生？`,
        },
      ],
    },
    guides: {
      eyebrow: "相关指南",
      title: "让结果和更深的内容继续连起来。",
      body: "从一个热量数字继续进入孕期阶段、饮食结构和体重趋势的内容解释。",
    },
    missingTitle: "当前没有结果",
    missingBody: "这个页面需要先有计算结果。请重新运行计算器生成新的输出。",
    backCta: "返回计算器",
    aiCta: "问 AI 助手",
  },
  es: {
    eyebrow: "Resultado explicable",
    title: "Tu objetivo diario de calorias",
    subtitle:
      "Usa esto como referencia para planificar la alimentacion. Si tus sintomas o las indicaciones medicas chocan con este resultado, sigue a tu equipo clinico.",
    card: {
      caloriesLabel: "Calorias recomendadas",
      perDayLabel: "kcal/dia",
      rangeLabel: "Rango sugerido",
      rangeHint: "Trata el objetivo como un ancla de planificacion, no como una nota perfecta que debas cumplir cada dia.",
      formatTrimesterChip: (trimester) => `Trimestre ${trimester}`,
      formatSourceChip: (source) => source,
    },
    explanation: {
      eyebrow: "Que esta moviendo este numero",
      title: "Convierte el resultado en una explicacion util y no solo en una salida numerica.",
      extraCaloriesTitle: "Ajuste por trimestre",
      formatExtraCaloriesBody: (extraCalories, trimester) =>
        `Este calculo suma unas ${extraCalories} kcal para el trimestre ${trimester} segun el paquete de reglas activo.`,
      sourceTitle: "Fuente de la guia",
      formatSourceBody: (source) =>
        `${source} es la capa de referencia detras de la estimacion, asi que el resultado responde a un conjunto de reglas identificable y no a una suposicion generica.`,
      bmiTitle: "Contexto del peso previo",
      bmiBodies: {
        underweight:
          "Si el BMI previo al embarazo es mas bajo, conviene dar mas peso al seguimiento profesional cuando el apetito, las nauseas o la subida de peso se complican.",
        normal:
          "Este resultado funciona bien como base general, pero sigue necesitando contexto real sobre apetito, sintomas y tendencia de peso.",
        overweight:
          "Si el BMI previo es mas alto, planificar calorias sigue siendo util, aunque el valor del consejo individual aumenta cuando la evolucion no esta clara.",
        obese:
          "Si el BMI previo empieza mas alto, el plan debe centrarse en estabilidad, practicidad y tolerancia, no en restringir de mas sin guia clinica.",
      },
      rangeTitle: "Pensar en rangos",
      rangeBody:
        "El rango existe porque la ingesta diaria fluctua. Importa mas la consistencia entre comidas, apetito y tendencia semanal que clavar un numero exacto cada dia.",
    },
    actionTitle: "Que hacer ahora",
    actions: [
      "Reparte la ingesta entre 3 comidas y 1-2 snacks en lugar de cargarlo todo en una sola comida.",
      "No persigas solo calorias: combina energia con proteina, fibra e hidratacion.",
      "Si el apetito, los sintomas o la tendencia del peso cambian rapido, vuelve a calcular y revisa la explicacion con la IA.",
    ],
    cautionTitle: "Cautela clinica",
    cautionBody:
      "El embarazo multiple y las situaciones medicas de mayor riesgo deberian revisarse con una clinica o dietista prenatal en lugar de depender solo de una herramienta general.",
    flagTitle: "Alerta activa",
    flagDescriptions: {
      multiple_pregnancy_requires_clinician_review: {
        label: "Embarazo multiple",
        body: "Un embarazo gemelar o de orden superior suele necesitar una revision mucho mas individualizada que la que puede ofrecer una calculadora de consumo.",
      },
    },
    prompts: {
      eyebrow: "Seguimiento con IA",
      title: "Usa el resultado para hacer preguntas mejores al instante.",
      items: [
        {
          title: "Reparto del dia",
          body: "Convierte el objetivo calorico en una estructura practica de comidas y snacks.",
          cta: "Pedir reparto de comidas",
          buildPrompt: ({ recommendedCalories, source }) =>
            `Mi resultado actual es ${recommendedCalories} kcal usando ${source}. Ayudame a repartirlo entre desayuno, comida, cena y 1-2 snacks con rangos caloricos practicos.`,
        },
        {
          title: "Proteina y fibra",
          body: "Aclara como hacer que el objetivo sea mas sostenible sin mirar solo calorias.",
          cta: "Preguntar por calidad de la comida",
          buildPrompt: ({ recommendedCalories, source }) =>
            `Mi resultado actual es ${recommendedCalories} kcal segun ${source}. Como deberia pensar en proteina, fibra e hidratacion para que este objetivo sea mas facil de seguir?`,
        },
        {
          title: "Cuando revisar de nuevo",
          body: "Entiende que cambios de apetito, peso o sintomas justifican una nueva revision.",
          cta: "Preguntar cuando reevaluar",
          buildPrompt: ({ recommendedCalories, source }) =>
            `Mi resultado actual en el embarazo es ${recommendedCalories} kcal usando ${source}. Que cambios en apetito, tendencia del peso o sintomas deberian hacerme revisar este plan otra vez o consultar a una clinica?`,
        },
      ],
    },
    guides: {
      eyebrow: "Guias relacionadas",
      title: "Mantiene el resultado conectado con contenido mas profundo.",
      body: "Pasa del numero calorico a contenido sobre trimestres, estructura de comidas y tendencia del peso.",
    },
    missingTitle: "No hay resultado disponible",
    missingBody:
      "Esta pagina necesita la salida de la calculadora. Vuelve a ejecutar el calculo para generar un resultado nuevo.",
    backCta: "Volver a la calculadora",
    aiCta: "Preguntar a la IA",
  },
};

export function getResultPageCopy(locale: Locale) {
  return copy[locale];
}
