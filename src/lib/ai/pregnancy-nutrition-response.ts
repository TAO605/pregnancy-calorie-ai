import type { AssistantContext } from "@/lib/ai/assistant-context";
import type { Locale } from "@/lib/i18n/config";
import { formatDietPreferenceList } from "@/lib/i18n/profile-preferences-copy";

export type AssistantResponse = {
  answer: string;
  bullets: string[];
  riskLevel: "low" | "high";
  medicalEscalation: boolean;
  disclaimer: string;
};

export type AssistantConversationTurn = {
  question: string;
  answer: string;
  riskLevel: "low" | "high";
  medicalEscalation: boolean;
};

type MealFocus = "breakfast" | "lunch" | "dinner" | "snack";

const nutritionDisclaimer: Record<Locale, string> = {
  en: "This is general nutrition information and not a diagnosis.",
  "zh-CN": "这是一般性孕期营养建议，不替代医生或营养师诊断。",
  es: "Esto es orientacion nutricional general y no sustituye a un profesional.",
};

function hasPrimaryTopicKeyword(locale: Locale, lowered: string) {
  if (locale === "zh-CN") {
    return [
      "热量",
      "kcal",
      "蛋白",
      "纤维",
      "便秘",
      "体重",
      "医生",
      "早餐",
      "午餐",
      "晚餐",
      "加餐",
      "怎么吃",
    ].some((keyword) => lowered.includes(keyword));
  }

  if (locale === "es") {
    return [
      "caloria",
      "calorias",
      "prote",
      "fibra",
      "estreni",
      "peso",
      "doctor",
      "medico",
      "desayuno",
      "almuerzo",
      "cena",
      "colacion",
      "snack",
    ].some((keyword) => lowered.includes(keyword));
  }

  return [
    "calorie",
    "calories",
    "protein",
    "fiber",
    "constipation",
    "weight",
    "doctor",
    "breakfast",
    "lunch",
    "dinner",
    "snack",
  ].some((keyword) => lowered.includes(keyword));
}

function isFollowUpStyleQuestion(locale: Locale, lowered: string) {
  if (locale === "zh-CN") {
    return ["那", "还有", "比如", "举例", "再具体", "更具体"].some((prefix) =>
      lowered.startsWith(prefix),
    );
  }

  if (locale === "es") {
    return [
      "y ",
      "que hay de",
      "como seria",
      "puedes dar",
      "mas detalle",
      "mas especific",
    ].some((prefix) => lowered.startsWith(prefix));
  }

  return [
    "and ",
    "what about",
    "how about",
    "what if",
    "can you give",
    "more detail",
    "be more specific",
  ].some((prefix) => lowered.startsWith(prefix));
}

function buildEffectiveQuestion(
  locale: Locale,
  question: string,
  history?: AssistantConversationTurn[],
) {
  const trimmed = question.trim();
  const lowered = trimmed.toLowerCase();
  const latestTurn = history?.at(-1);

  if (!latestTurn) {
    return trimmed;
  }

  const shouldBlendHistory =
    lowered.length <= 80 ||
    isFollowUpStyleQuestion(locale, lowered) ||
    !hasPrimaryTopicKeyword(locale, lowered);

  return shouldBlendHistory ? `${latestTurn.question} ${trimmed}`.trim() : trimmed;
}

function detectMealFocus(locale: Locale, lowered: string): MealFocus | null {
  if (locale === "zh-CN") {
    if (lowered.includes("早餐")) return "breakfast";
    if (lowered.includes("午餐")) return "lunch";
    if (lowered.includes("晚餐")) return "dinner";
    if (lowered.includes("加餐") || lowered.includes("点心")) return "snack";
    return null;
  }

  if (locale === "es") {
    if (lowered.includes("desayuno")) return "breakfast";
    if (lowered.includes("almuerzo") || lowered.includes("comida")) return "lunch";
    if (lowered.includes("cena")) return "dinner";
    if (lowered.includes("colacion") || lowered.includes("snack")) return "snack";
    return null;
  }

  if (lowered.includes("breakfast")) return "breakfast";
  if (lowered.includes("lunch")) return "lunch";
  if (lowered.includes("dinner")) return "dinner";
  if (lowered.includes("snack")) return "snack";
  return null;
}

function buildMealSpecificCopy(locale: Locale, mealFocus: MealFocus): AssistantResponse {
  if (locale === "zh-CN") {
    const mealLabel = {
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      snack: "加餐",
    }[mealFocus];
    const shareHint = {
      breakfast: "早餐可以先按全天总量的 20%-25% 去估算。",
      lunch: "午餐通常可以先按全天总量的 25%-30% 去安排。",
      dinner: "晚餐也可以先按全天总量的 25%-30% 去分配。",
      snack: "加餐更适合先按全天总量的 10%-15% 去预留。",
    }[mealFocus];

    return {
      answer: `如果你想把${mealLabel}安排得更具体，可以先给这一餐一个大致的热量区间，再用主食、蛋白质和蔬果把结构补齐。`,
      bullets: [
        shareHint,
        "这一餐尽量同时包括一个明确的蛋白质来源、一份主食，再加上一份蔬菜或水果。",
        "如果这一餐吃完还是很饿，优先微调后面的加餐，而不是一次性过度补吃。",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  if (locale === "es") {
    const mealLabel = {
      breakfast: "el desayuno",
      lunch: "el almuerzo",
      dinner: "la cena",
      snack: "la colacion",
    }[mealFocus];
    const shareHint = {
      breakfast: "El desayuno puede arrancar cerca del 20%-25% del total del dia.",
      lunch: "El almuerzo suele funcionar cerca del 25%-30% del total del dia.",
      dinner: "La cena tambien puede moverse cerca del 25%-30% del total del dia.",
      snack: "La colacion suele encajar mejor cerca del 10%-15% del total del dia.",
    }[mealFocus];

    return {
      answer: `Si quieres aterrizar mejor ${mealLabel}, empieza con un rango calorico aproximado para esa comida y luego arma la estructura alrededor de proteina, carbohidratos y algo de fruta o verdura.`,
      bullets: [
        shareHint,
        "Procura que esa comida tenga una fuente clara de proteina, una base de energia y algo de producto fresco.",
        "Si quedas con hambre despues, ajusta la siguiente colacion o comida en lugar de intentar compensar de golpe.",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  const mealLabel = mealFocus === "snack" ? "a snack" : mealFocus;
  const shareHint = {
    breakfast: "Breakfast can often start around 20%-25% of the full day.",
    lunch: "Lunch often works around 25%-30% of the full day.",
    dinner: "Dinner can also sit around 25%-30% of the full day.",
    snack: "A snack often fits best around 10%-15% of the full day.",
  }[mealFocus];

  return {
    answer: `If you want to make ${mealLabel} more concrete, start with a rough calorie range for that eating moment and then build it around protein, carbohydrates, and some produce.`,
    bullets: [
      shareHint,
      "Try to anchor that meal with one clear protein source, one main carbohydrate source, and something fresh when possible.",
      "If you are still hungry afterward, adjust the next meal or snack instead of trying to over-correct all at once.",
    ],
    riskLevel: "low",
    medicalEscalation: false,
    disclaimer: nutritionDisclaimer[locale],
  };
}

function lowRiskCopy(locale: Locale, question: string): AssistantResponse {
  const lowered = question.toLowerCase();
  const mealFocus = detectMealFocus(locale, lowered);

  if (
    mealFocus &&
    [
      "2200",
      "kcal",
      "calorie",
      "calories",
      "split",
      "meal",
      "热量",
      "分配",
      "怎么吃",
      "caloria",
      "calorias",
    ].some((keyword) => lowered.includes(keyword))
  ) {
    return buildMealSpecificCopy(locale, mealFocus);
  }

  if (locale === "zh-CN") {
    if (lowered.includes("蛋白")) {
      return {
        answer: "孕期更稳妥的做法不是一次性猛补蛋白，而是把蛋白质平均分到三餐和加餐里。",
        bullets: [
          "每餐优先放入一个清晰的蛋白来源，比如鸡蛋、鱼、瘦肉、豆制品或奶制品。",
          "同时搭配主食和蔬果，避免只盯着蛋白而忽略整体能量和均衡。",
          "如果医生对血糖或体重有特别要求，应优先遵循医生方案。",
        ],
        riskLevel: "low",
        medicalEscalation: false,
        disclaimer: nutritionDisclaimer[locale],
      };
    }

    if (lowered.includes("纤维") || lowered.includes("便秘")) {
      return {
        answer: "如果你在孕期更关注纤维，重点不是单个食物，而是把全谷物、蔬菜、水果和饮水一起提升。",
        bullets: [
          "主食里保留一部分燕麦、糙米或全麦面包。",
          "每天至少安排 2-3 次蔬菜和 1-2 次水果。",
          "增加纤维时同步补水，否则反而可能更不舒服。",
        ],
        riskLevel: "low",
        medicalEscalation: false,
        disclaimer: nutritionDisclaimer[locale],
      };
    }

    if (lowered.includes("2200") || lowered.includes("热量") || lowered.includes("分配")) {
      return {
        answer: "如果你的目标大约是 2200 千卡，更实用的做法是先按餐次分配，再根据饥饿感微调。",
        bullets: [
          "早餐约 20%-25%，午餐约 30%，晚餐约 30%。",
          "其余热量分到 1-2 次加餐，优先加在最容易饿的时段。",
          "每餐尽量同时有主食、蛋白质和一点蔬果。",
        ],
        riskLevel: "low",
        medicalEscalation: false,
        disclaimer: nutritionDisclaimer[locale],
      };
    }

    return {
      answer: "这个问题更适合用“先保证总热量方向正确，再细分餐次和食物结构”的方式来回答。",
      bullets: [
        "先确认你当前处于哪个孕周和活动水平。",
        "再把热量目标拆成三餐与加餐，而不是只追单个数字。",
        "如果体重变化过快，可以把具体问题带去和医生确认。",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  if (locale === "es") {
    if (lowered.includes("prote")) {
      return {
        answer: "En el embarazo suele funcionar mejor repartir la proteina a lo largo del dia que concentrarla en una sola comida.",
        bullets: [
          "Incluye una fuente clara de proteina en cada comida principal.",
          "Combinala con carbohidratos de buena calidad y verduras, no solo con calorias vacias.",
          "Si tu equipo medico te dio limites por glucosa o peso, su plan va primero.",
        ],
        riskLevel: "low",
        medicalEscalation: false,
        disclaimer: nutritionDisclaimer[locale],
      };
    }

    if (lowered.includes("fibra") || lowered.includes("estreni")) {
      return {
        answer: "Si tu foco es la fibra, piensa en el patron completo: granos integrales, frutas, verduras y agua.",
        bullets: [
          "Manten parte de los cereales en version integral.",
          "Anade verduras varias veces al dia y fruta en 1-2 momentos.",
          "Subir la fibra sin hidratacion suficiente puede empeorar la molestia.",
        ],
        riskLevel: "low",
        medicalEscalation: false,
        disclaimer: nutritionDisclaimer[locale],
      };
    }

    return {
      answer: "La forma mas util de responder es partir del objetivo calorico y luego repartirlo en comidas mas sostenibles.",
      bullets: [
        "Divide el dia entre 3 comidas y 1-2 colaciones.",
        "Acompana la energia con proteina, fibra e hidratacion.",
        "Si tu peso cambia rapido, conviene revisar el contexto con tu equipo clinico.",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  if (lowered.includes("protein")) {
    return {
      answer: "A practical pregnancy nutrition pattern is to spread protein across the day instead of overloading one meal.",
      bullets: [
        "Anchor each main meal with a clear protein source such as eggs, yogurt, beans, fish, or lean meat.",
        "Pair protein with carbohydrates and produce so the meal supports both calories and satiety.",
        "If you have clinician guidance for glucose or weight gain, use that as the primary plan.",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  if (lowered.includes("fiber") || lowered.includes("constipation")) {
    return {
      answer: "When fiber is the focus, the most useful shift is improving the full pattern rather than adding a single food.",
      bullets: [
        "Keep some grains in higher-fiber forms such as oats or whole grain bread.",
        "Add fruit and vegetables repeatedly across the day instead of trying to catch up at dinner.",
        "Increase fluids alongside fiber so the change is easier to tolerate.",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  if (lowered.includes("2200") || lowered.includes("calories") || lowered.includes("split")) {
    return {
      answer: "If your target is around 2,200 calories, start by distributing the day before micromanaging individual foods.",
      bullets: [
        "Breakfast often works around 20%-25% of the day, lunch around 30%, dinner around 30%.",
        "Use the remaining calories for 1-2 snacks during the hungriest hours.",
        "Keep each eating moment anchored by protein, carbohydrates, and some produce when possible.",
      ],
      riskLevel: "low",
      medicalEscalation: false,
      disclaimer: nutritionDisclaimer[locale],
    };
  }

  return {
    answer: "The safest general approach is to match your calorie target with meal structure, hydration, and consistent nutrient balance.",
    bullets: [
      "Confirm trimester, activity, and any clinician-specific guidance first.",
      "Translate calories into meals and snacks instead of treating the number alone as the goal.",
      "If your weight trend changes quickly, re-check the calculator and ask your care team for context.",
    ],
    riskLevel: "low",
    medicalEscalation: false,
    disclaimer: nutritionDisclaimer[locale],
  };
}

function highRiskCopy(locale: Locale): AssistantResponse {
  if (locale === "zh-CN") {
    return {
      answer: "你的问题里包含高风险症状关键词，这种情况不适合继续给普通饮食建议。",
      bullets: [
        "请尽快联系产科医生、助产士或当地急诊服务。",
        "如果症状正在加重，不要等待线上工具继续判断。",
        "准备好孕周、症状开始时间和伴随表现，方便就医时快速说明。",
      ],
      riskLevel: "high",
      medicalEscalation: true,
      disclaimer: "本工具不能处理疑似急症或并发症判断。",
    };
  }

  if (locale === "es") {
    return {
      answer: "Tu pregunta contiene senales de alto riesgo, asi que no corresponde seguir con orientacion nutricional estandar.",
      bullets: [
        "Contacta cuanto antes a tu equipo obstetrico o a un servicio de urgencias.",
        "Si los sintomas empeoran, no esperes a seguir preguntando en linea.",
        "Ten a mano la semana de gestacion, el inicio del sintoma y cualquier cambio asociado.",
      ],
      riskLevel: "high",
      medicalEscalation: true,
      disclaimer: "Esta herramienta no sirve para evaluar urgencias ni complicaciones.",
    };
  }

  return {
    answer: "Your question includes high-risk symptom language, so this assistant should stop general nutrition guidance here.",
    bullets: [
      "Contact your obstetric clinician, midwife, or urgent care service as soon as possible.",
      "If symptoms are worsening, do not wait for an online tool to guide the next step.",
      "Have your gestational week, symptom timing, and associated changes ready for triage.",
    ],
    riskLevel: "high",
    medicalEscalation: true,
    disclaimer: "This tool is not appropriate for urgent symptom assessment or complication diagnosis.",
  };
}

function applyContext(
  locale: Locale,
  response: AssistantResponse,
  context?: AssistantContext,
): AssistantResponse {
  if (!context) {
    return response;
  }

  const nextBullets = [...response.bullets];
  let nextAnswer = response.answer;

  if (context.latestCalculation) {
    const latest = context.latestCalculation;

    if (locale === "zh-CN") {
      nextAnswer = `基于你最近保存的 ${latest.recommendedCalories} kcal/天、第 ${latest.trimester} 孕期、${latest.guidelineDisplayName} 规则包，${response.answer}`;
      nextBullets.unshift(
        `当前会话已带入你的最新目标区间 ${latest.recommendedRangeMin}-${latest.recommendedRangeMax} kcal。`,
      );
    } else if (locale === "es") {
      nextAnswer = `Tomando tu ultimo resultado guardado de ${latest.recommendedCalories} kcal al dia, trimestre ${latest.trimester}, con la guia ${latest.guidelineDisplayName}, ${response.answer.charAt(0).toLowerCase()}${response.answer.slice(1)}`;
      nextBullets.unshift(
        `La conversacion ya incluye tu rango reciente de ${latest.recommendedRangeMin}-${latest.recommendedRangeMax} kcal.`,
      );
    } else {
      nextAnswer = `Using your latest saved result of ${latest.recommendedCalories} kcal/day in trimester ${latest.trimester} with the ${latest.guidelineDisplayName} guide, ${response.answer.charAt(0).toLowerCase()}${response.answer.slice(1)}`;
      nextBullets.unshift(
        `This reply already includes your recent target range of ${latest.recommendedRangeMin}-${latest.recommendedRangeMax} kcal/day.`,
      );
    }

    if (latest.riskFlags.includes("multiple_pregnancy_requires_clinician_review")) {
      if (locale === "zh-CN") {
        nextBullets.unshift(
          "你的最新计算结果包含多胎妊娠标记，通用建议仍应该由产科或营养师复核。",
        );
      } else if (locale === "es") {
        nextBullets.unshift(
          "Tu ultimo calculo incluye una bandera de embarazo multiple, asi que las recomendaciones generales deben revisarse con un profesional.",
        );
      } else {
        nextBullets.unshift(
          "Your saved calculation includes a multiple-pregnancy flag, so generic advice should still be reviewed with a clinician.",
        );
      }
    }
  }

  if (context.mealSummary && context.mealSummary.recentMealCount > 0) {
    if (typeof context.mealSummary.todayLoggedCalories === "number") {
      if (locale === "zh-CN") {
        nextBullets.unshift(`今天已记录约 ${context.mealSummary.todayLoggedCalories} kcal。`);
      } else if (locale === "es") {
        nextBullets.unshift(
          `Hoy ya llevas registradas unas ${context.mealSummary.todayLoggedCalories} kcal.`,
        );
      } else {
        nextBullets.unshift(
          `You have logged about ${context.mealSummary.todayLoggedCalories} kcal today.`,
        );
      }
    }

    if (locale === "zh-CN") {
      nextBullets.unshift(
        `最近已记录 ${context.mealSummary.recentMealCount} 顿饭，平均每顿约 ${context.mealSummary.averageMealCalories} kcal。`,
      );
    } else if (locale === "es") {
      nextBullets.unshift(
        `Tienes ${context.mealSummary.recentMealCount} comidas guardadas, con un promedio de ${context.mealSummary.averageMealCalories} kcal por comida.`,
      );
    } else {
      nextBullets.unshift(
        `You have ${context.mealSummary.recentMealCount} saved meals with an average of ${context.mealSummary.averageMealCalories} kcal each.`,
      );
    }
  }

  if (context.weightSummary) {
    const weight = context.weightSummary;

    if (locale === "zh-CN") {
      nextBullets.unshift(
        `当前已保存体重约 ${weight.currentWeightKg} kg，体重记录 ${weight.recentWeightCount} 条。`,
      );
      if (typeof weight.prePregnancyDeltaKg === "number") {
        nextBullets.unshift(
          `相对孕前体重变化 ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg。`,
        );
      }
      if (typeof weight.recentTrendDeltaKg === "number") {
        nextBullets.unshift(
          `最近几次体重趋势变化 ${weight.recentTrendDeltaKg > 0 ? "+" : ""}${weight.recentTrendDeltaKg} kg。`,
        );
      }
      nextAnswer = `${nextAnswer}我会同时参考你已保存的体重趋势来解读这些建议。`;
    } else if (locale === "es") {
      nextBullets.unshift(
        `Tu peso guardado actual es ${weight.currentWeightKg} kg y ya hay ${weight.recentWeightCount} registros de peso en contexto.`,
      );
      if (typeof weight.prePregnancyDeltaKg === "number") {
        nextBullets.unshift(
          `El cambio frente al peso previo al embarazo es ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg.`,
        );
      }
      if (typeof weight.recentTrendDeltaKg === "number") {
        nextBullets.unshift(
          `La tendencia acumulada en tus registros recientes es ${weight.recentTrendDeltaKg > 0 ? "+" : ""}${weight.recentTrendDeltaKg} kg.`,
        );
      }
      nextAnswer = `${nextAnswer} Tambien estoy interpretando la recomendacion a la luz de tu tendencia de peso guardada.`;
    } else {
      nextBullets.unshift(
        `Your current saved weight is ${weight.currentWeightKg} kg with ${weight.recentWeightCount} weight logs in context.`,
      );
      if (typeof weight.prePregnancyDeltaKg === "number") {
        nextBullets.unshift(
          `Your saved change versus pre-pregnancy is ${weight.prePregnancyDeltaKg > 0 ? "+" : ""}${weight.prePregnancyDeltaKg} kg.`,
        );
      }
      if (typeof weight.recentTrendDeltaKg === "number") {
        nextBullets.unshift(
          `Across recent logs, your weight trend has changed ${weight.recentTrendDeltaKg > 0 ? "+" : ""}${weight.recentTrendDeltaKg} kg.`,
        );
      }
      nextAnswer = `${nextAnswer} I am also interpreting the recommendation in light of your saved weight trend.`;
    }
  }

  if (context.profilePreferences && context.profilePreferences.dietPreferences.length > 0) {
    const preferenceSummary = formatDietPreferenceList(
      locale,
      context.profilePreferences.dietPreferences,
    );

    if (locale === "zh-CN") {
      nextBullets.unshift(`你已保存的饮食偏好：${preferenceSummary}。`);
      nextAnswer = `${nextAnswer}同时优先按照你已保存的饮食偏好来理解这些建议。`;
    } else if (locale === "es") {
      nextBullets.unshift(`Preferencias guardadas en tu perfil: ${preferenceSummary}.`);
      nextAnswer = `${nextAnswer} Mantendre la recomendacion alineada con las preferencias guardadas en tu perfil.`;
    } else {
      nextBullets.unshift(`Saved diet preferences in your profile: ${preferenceSummary}.`);
      nextAnswer = `${nextAnswer} I am also keeping the recommendation aligned with the diet preferences saved in your profile.`;
    }
  }

  return {
    ...response,
    answer: nextAnswer,
    bullets: nextBullets.slice(0, 5),
  };
}

export function buildAssistantResponse(
  locale: Locale,
  question: string,
  isHighRisk: boolean,
  context?: AssistantContext,
  history?: AssistantConversationTurn[],
) {
  const trimmedQuestion = question.trim();
  const effectiveQuestion = buildEffectiveQuestion(locale, trimmedQuestion, history);

  if (isHighRisk) {
    return highRiskCopy(locale);
  }

  if (history?.at(-1)?.medicalEscalation && effectiveQuestion !== trimmedQuestion) {
    return highRiskCopy(locale);
  }

  return applyContext(locale, lowRiskCopy(locale, effectiveQuestion), context);
}
