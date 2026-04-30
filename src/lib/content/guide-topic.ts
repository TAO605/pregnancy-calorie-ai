import type { Locale } from "@/lib/i18n/config";

export type GuideTopicKey =
  | "calories"
  | "fiber_hydration"
  | "first_trimester"
  | "third_trimester"
  | "weight_trend";

export const guideTopicKeys: readonly GuideTopicKey[] = [
  "calories",
  "fiber_hydration",
  "first_trimester",
  "third_trimester",
  "weight_trend",
];

type GuideTopic = {
  key: GuideTopicKey;
  label: string;
  keywords: string[];
};

const adjacentTopicKeys: Record<GuideTopicKey, GuideTopicKey[]> = {
  calories: ["first_trimester", "third_trimester", "weight_trend"],
  fiber_hydration: ["calories", "third_trimester", "first_trimester"],
  first_trimester: ["calories", "fiber_hydration", "weight_trend"],
  third_trimester: ["calories", "fiber_hydration", "weight_trend"],
  weight_trend: ["calories", "third_trimester", "first_trimester"],
};

const topicCopy: Record<GuideTopicKey, Record<Locale, Omit<GuideTopic, "key">>> = {
  calories: {
    en: {
      label: "Calories",
      keywords: ["pregnancy calories", "calorie planning", "trimester calories"],
    },
    "zh-CN": {
      label: "\u70ed\u91cf\u89c4\u5212",
      keywords: ["\u5b55\u671f\u70ed\u91cf", "\u70ed\u91cf\u89c4\u5212", "\u5b55\u4e2d\u671f\u70ed\u91cf"],
    },
    es: {
      label: "Calorias",
      keywords: ["calorias en el embarazo", "planificacion de calorias", "calorias por trimestre"],
    },
  },
  fiber_hydration: {
    en: {
      label: "Fiber and hydration",
      keywords: ["pregnancy fiber", "hydration", "meal comfort"],
    },
    "zh-CN": {
      label: "\u7ea4\u7ef4\u548c\u8865\u6c34",
      keywords: ["\u5b55\u671f\u7ea4\u7ef4", "\u5b55\u671f\u8865\u6c34", "\u996e\u98df\u8212\u9002\u5ea6"],
    },
    es: {
      label: "Fibra e hidratacion",
      keywords: ["fibra en el embarazo", "hidratacion", "comodidad digestiva"],
    },
  },
  first_trimester: {
    en: {
      label: "First trimester",
      keywords: ["first trimester appetite", "early pregnancy calories", "nausea"],
    },
    "zh-CN": {
      label: "\u5b55\u65e9\u671f",
      keywords: ["\u5b55\u65e9\u671f\u80c3\u53e3", "\u5b55\u65e9\u671f\u70ed\u91cf", "\u5b55\u5410"],
    },
    es: {
      label: "Primer trimestre",
      keywords: ["apetito primer trimestre", "calorias embarazo temprano", "nauseas"],
    },
  },
  third_trimester: {
    en: {
      label: "Third trimester",
      keywords: ["third trimester meals", "late pregnancy calories", "meal timing"],
    },
    "zh-CN": {
      label: "\u5b55\u665a\u671f",
      keywords: ["\u5b55\u665a\u671f\u9910\u6b21", "\u5b55\u665a\u671f\u70ed\u91cf", "\u5c11\u91cf\u591a\u9910"],
    },
    es: {
      label: "Tercer trimestre",
      keywords: ["comidas tercer trimestre", "calorias embarazo avanzado", "horarios de comida"],
    },
  },
  weight_trend: {
    en: {
      label: "Weight trend",
      keywords: ["pregnancy weight trend", "weight tracking", "weekly trend"],
    },
    "zh-CN": {
      label: "\u4f53\u91cd\u8d8b\u52bf",
      keywords: ["\u5b55\u671f\u4f53\u91cd\u8d8b\u52bf", "\u4f53\u91cd\u8bb0\u5f55", "\u6bcf\u5468\u8d8b\u52bf"],
    },
    es: {
      label: "Tendencia de peso",
      keywords: ["tendencia de peso en el embarazo", "seguimiento de peso", "tendencia semanal"],
    },
  },
};

function getGuideTopicKey(slug: string): GuideTopicKey {
  if (slug.includes("weight")) {
    return "weight_trend";
  }

  if (slug.includes("fiber") || slug.includes("hydration")) {
    return "fiber_hydration";
  }

  if (slug.includes("first-trimester")) {
    return "first_trimester";
  }

  if (slug.includes("third-trimester")) {
    return "third_trimester";
  }

  return "calories";
}

export function getGuideTopic(slug: string, locale: Locale): GuideTopic {
  const key = getGuideTopicKey(slug);

  return {
    key,
    ...topicCopy[key][locale],
  };
}

export function getGuideTopicRelatednessScore(currentSlug: string, candidateSlug: string) {
  const currentKey = getGuideTopicKey(currentSlug);
  const candidateKey = getGuideTopicKey(candidateSlug);

  if (currentKey === candidateKey) {
    return 3;
  }

  if (adjacentTopicKeys[currentKey].includes(candidateKey)) {
    return 2;
  }

  if (candidateKey === "calories") {
    return 1;
  }

  return 0;
}
