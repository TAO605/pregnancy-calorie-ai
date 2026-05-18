import type { Locale } from "@/lib/i18n/config";
import type { MealType } from "@/types/product";

type MealIdeaSeed = {
  id: string;
  mealType: MealType;
  approxCalories: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  flags: {
    vegetarian?: boolean;
    vegan?: boolean;
    pescatarian?: boolean;
    dairyFree?: boolean;
    glutenFree?: boolean;
    nutFree?: boolean;
    soyFree?: boolean;
    halal?: boolean;
  };
};

export type MealIdeaSuggestion = {
  id: string;
  title: string;
  description: string;
  approxCalories: number;
  isFallback?: boolean;
};

type MealIdeasPanelCopy = {
  eyebrow: string;
  description: string;
  preferencesLabel: string;
  generalMode: string;
  approxLabel: string;
  targetLabel: string;
  targetMissingLabel: string;
};

const panelCopy: Record<Locale, MealIdeasPanelCopy> = {
  en: {
    eyebrow: "Preference-aware ideas",
    description:
      "Switch the meal type, then use these ideas as lightweight building blocks for what to eat or log next.",
    preferencesLabel: "Using preferences",
    generalMode: "Using general pregnancy-friendly ideas.",
    approxLabel: "Approx.",
    targetLabel: "Suggested target",
    targetMissingLabel: "Run the calculator to pace this meal more precisely.",
  },
  "zh-CN": {
    eyebrow: "偏好驱动建议",
    description: "切换餐次后，这里会给出更接近你当前偏好和节奏的轻量化吃法建议。",
    preferencesLabel: "当前参考偏好",
    generalMode: "当前使用通用的孕期友好建议。",
    approxLabel: "约",
    targetLabel: "建议目标",
    targetMissingLabel: "先运行计算器，这里才能按目标热量给出更准的节奏。",
  },
  es: {
    eyebrow: "Ideas segun preferencias",
    description:
      "Cambia el tipo de comida y usa estas ideas como bloques ligeros para decidir que comer o registrar despues.",
    preferencesLabel: "Preferencias activas",
    generalMode: "Usando ideas generales aptas para embarazo.",
    approxLabel: "Aprox.",
    targetLabel: "Objetivo sugerido",
    targetMissingLabel: "Ejecuta la calculadora para ajustar mejor esta comida.",
  },
};

const defaultApproxByMealType: Record<MealType, number> = {
  breakfast: 380,
  lunch: 520,
  dinner: 560,
  snack: 220,
};

const ideaSeeds: MealIdeaSeed[] = [
  {
    id: "chia-berry-pudding",
    mealType: "breakfast",
    approxCalories: 340,
    title: {
      en: "Chia berry pudding cup",
      "zh-CN": "奇亚籽莓果布丁杯",
      es: "Vaso de chia con frutos rojos",
    },
    description: {
      en: "Chia, berries, oats or seeds, and a dairy-free milk base. Easy to scale without adding heavy sugar.",
      "zh-CN": "用奇亚籽、莓果、燕麦或种子，加无乳奶底做成，容易增减分量，也不会一下子太甜。",
      es: "Chia, frutos rojos, avena o semillas y una base sin lacteos. Facil de ajustar sin cargar azucar.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "greek-yogurt-seed-cup",
    mealType: "breakfast",
    approxCalories: 390,
    title: {
      en: "Greek yogurt seed cup",
      "zh-CN": "希腊酸奶种子杯",
      es: "Copa de yogur griego con semillas",
    },
    description: {
      en: "Greek yogurt, fruit, pumpkin seeds, and a small spoon of oats for a higher-protein start.",
      "zh-CN": "希腊酸奶搭配水果、南瓜籽和少量燕麦，适合想把早餐蛋白质拉高一些的时候。",
      es: "Yogur griego, fruta, semillas de calabaza y un poco de avena para empezar con mas proteina.",
    },
    flags: {
      vegetarian: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "egg-potato-fruit-plate",
    mealType: "breakfast",
    approxCalories: 430,
    title: {
      en: "Egg, potato, and fruit plate",
      "zh-CN": "鸡蛋土豆水果早餐盘",
      es: "Plato de huevo, patata y fruta",
    },
    description: {
      en: "Two eggs, roasted potato, fruit, and leafy greens. Balanced when you want something more filling.",
      "zh-CN": "两个鸡蛋、烤土豆、水果和一份绿叶菜，适合需要更有饱腹感的早餐。",
      es: "Dos huevos, patata asada, fruta y hojas verdes. Equilibrado para una manana con mas hambre.",
    },
    flags: {
      vegetarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "salmon-rice-avocado-bowl",
    mealType: "breakfast",
    approxCalories: 460,
    title: {
      en: "Salmon rice breakfast bowl",
      "zh-CN": "三文鱼米饭早餐碗",
      es: "Bowl matinal de salmon y arroz",
    },
    description: {
      en: "Rice, salmon, avocado, and cucumber for a savory breakfast that carries you further into the day.",
      "zh-CN": "米饭、三文鱼、牛油果和黄瓜的咸口早餐，适合想把上午撑得更稳一些。",
      es: "Arroz, salmon, aguacate y pepino para un desayuno salado que te sostiene mejor.",
    },
    flags: {
      pescatarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "quinoa-chickpea-bowl",
    mealType: "lunch",
    approxCalories: 520,
    title: {
      en: "Quinoa chickpea crunch bowl",
      "zh-CN": "藜麦鹰嘴豆脆蔬碗",
      es: "Bowl crujiente de quinoa y garbanzos",
    },
    description: {
      en: "Quinoa, chickpeas, cucumber, tomato, and olive oil dressing. Steady energy without feeling heavy.",
      "zh-CN": "藜麦、鹰嘴豆、黄瓜、番茄和橄榄油酱汁，热量稳，吃完不会太沉。",
      es: "Quinoa, garbanzos, pepino, tomate y aceite de oliva. Energia estable sin sentirse pesado.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "tofu-rice-veggie-bowl",
    mealType: "lunch",
    approxCalories: 560,
    title: {
      en: "Tofu rice veggie bowl",
      "zh-CN": "豆腐米饭蔬菜碗",
      es: "Bowl de tofu, arroz y verduras",
    },
    description: {
      en: "Rice, baked tofu, broccoli, carrots, and sesame or citrus dressing for an easy vegan lunch.",
      "zh-CN": "米饭、烤豆腐、西兰花和胡萝卜，配芝麻或柑橘风味调味，适合省事的纯素午餐。",
      es: "Arroz, tofu al horno, brocoli, zanahoria y un aderezo citrico o de sesamo para un almuerzo vegano facil.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      halal: true,
    },
  },
  {
    id: "salmon-potato-greens-plate",
    mealType: "lunch",
    approxCalories: 610,
    title: {
      en: "Salmon, potato, and greens plate",
      "zh-CN": "三文鱼土豆绿叶午餐盘",
      es: "Plato de salmon, patata y hojas verdes",
    },
    description: {
      en: "Salmon, roasted potato, greens, and lemon. Useful when lunch needs to carry more calories.",
      "zh-CN": "三文鱼、烤土豆、绿叶菜和柠檬调味，适合午餐需要承担更多热量的时候。",
      es: "Salmon, patata asada, hojas verdes y limon. Util cuando el almuerzo debe cargar mas calorias.",
    },
    flags: {
      pescatarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "lentil-soup-pita-combo",
    mealType: "lunch",
    approxCalories: 480,
    title: {
      en: "Lentil soup and pita combo",
      "zh-CN": "扁豆汤配口袋饼组合",
      es: "Combo de sopa de lentejas con pan pita",
    },
    description: {
      en: "A lentil soup, chopped salad, and pita or rice side. Good when you want something warm and simple.",
      "zh-CN": "一份扁豆汤、切碎沙拉，再配口袋饼或米饭，适合想吃热一点又不复杂的午餐。",
      es: "Sopa de lentejas, ensalada picada y pita o arroz al lado. Funciona bien cuando buscas algo simple y caliente.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "baked-cod-sweet-potato-tray",
    mealType: "dinner",
    approxCalories: 600,
    title: {
      en: "Baked cod sweet potato tray",
      "zh-CN": "鳕鱼红薯烤盘晚餐",
      es: "Bandeja de bacalao y boniato al horno",
    },
    description: {
      en: "Cod, sweet potato, and roasted vegetables on one tray for a low-effort, balanced dinner.",
      "zh-CN": "鳕鱼、红薯和烤蔬菜一盘出，适合想降低准备成本但仍然均衡的晚餐。",
      es: "Bacalao, boniato y verduras al horno en una sola bandeja para una cena equilibrada y simple.",
    },
    flags: {
      pescatarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "lentil-pasta-tomato-spinach",
    mealType: "dinner",
    approxCalories: 560,
    title: {
      en: "Lentil pasta with tomato and spinach",
      "zh-CN": "扁豆意面配番茄菠菜",
      es: "Pasta de lenteja con tomate y espinaca",
    },
    description: {
      en: "Lentil pasta, tomato sauce, spinach, and olive oil. Quick to cook and easier to portion by appetite.",
      "zh-CN": "扁豆意面、番茄酱、菠菜和橄榄油，做得快，也更容易按食欲调节分量。",
      es: "Pasta de lenteja, salsa de tomate, espinaca y aceite de oliva. Rapida y facil de ajustar por apetito.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "stuffed-sweet-potato-beans",
    mealType: "dinner",
    approxCalories: 540,
    title: {
      en: "Stuffed sweet potato with beans",
      "zh-CN": "豆类夹心红薯餐",
      es: "Boniato relleno con frijoles",
    },
    description: {
      en: "Sweet potato, black beans, avocado, and greens. A soft, filling dinner that still feels light.",
      "zh-CN": "红薯、黑豆、牛油果和绿叶菜，口感柔和，有饱腹感，但整体不会太腻。",
      es: "Boniato, frijoles negros, aguacate y hojas verdes. Llena bien sin sentirse demasiado pesada.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "egg-quinoa-veggie-skillet",
    mealType: "dinner",
    approxCalories: 510,
    title: {
      en: "Egg quinoa veggie skillet",
      "zh-CN": "鸡蛋藜麦蔬菜煎锅",
      es: "Sarten de huevo, quinoa y verduras",
    },
    description: {
      en: "Quinoa, eggs, peppers, and spinach in one pan. Good for a shorter prep window in the evening.",
      "zh-CN": "藜麦、鸡蛋、甜椒和菠菜一锅完成，适合晚上准备时间更短的情况。",
      es: "Quinoa, huevo, pimientos y espinaca en una sola sarten. Util cuando por la noche tienes menos tiempo.",
    },
    flags: {
      vegetarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "chia-berry-snack-cup",
    mealType: "snack",
    approxCalories: 220,
    title: {
      en: "Chia berry snack cup",
      "zh-CN": "奇亚籽莓果加餐杯",
      es: "Vaso snack de chia y frutos rojos",
    },
    description: {
      en: "A smaller chia cup with berries and seeds when you want a calm, fiber-forward snack.",
      "zh-CN": "更小份的奇亚籽莓果杯，适合想要更温和、更有纤维感的加餐。",
      es: "Una version mas pequena con chia, frutos rojos y semillas para un snack suave y con fibra.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "boiled-eggs-fruit-snack",
    mealType: "snack",
    approxCalories: 210,
    title: {
      en: "Boiled eggs and fruit",
      "zh-CN": "水煮蛋水果加餐",
      es: "Huevos cocidos con fruta",
    },
    description: {
      en: "Two boiled eggs and fruit for a snack that lands between light and genuinely sustaining.",
      "zh-CN": "两个水煮蛋加一份水果，介于轻加餐和真正能顶一会儿之间。",
      es: "Dos huevos cocidos y fruta para un snack que no se queda demasiado corto.",
    },
    flags: {
      vegetarian: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "hummus-rice-cakes-snack",
    mealType: "snack",
    approxCalories: 230,
    title: {
      en: "Hummus with cucumber rice cakes",
      "zh-CN": "鹰嘴豆泥黄瓜米饼加餐",
      es: "Hummus con pepino y tortitas de arroz",
    },
    description: {
      en: "Rice cakes, hummus, cucumber, and olive oil or seeds if you need a slightly bigger bridge snack.",
      "zh-CN": "米饼、鹰嘴豆泥、黄瓜，必要时再加一点橄榄油或种子，适合稍微更能顶的加餐。",
      es: "Tortitas de arroz, hummus, pepino y un poco de aceite o semillas si necesitas un snack puente mas fuerte.",
    },
    flags: {
      vegetarian: true,
      vegan: true,
      dairyFree: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
  {
    id: "yogurt-seed-parfait",
    mealType: "snack",
    approxCalories: 250,
    title: {
      en: "Yogurt and seed parfait",
      "zh-CN": "酸奶种子酸奶杯",
      es: "Parfait de yogur con semillas",
    },
    description: {
      en: "Yogurt, fruit, and seeds for a cooler snack with a bit more protein than fruit alone.",
      "zh-CN": "酸奶加水果和种子，比单吃水果更有蛋白质，也更适合做偏凉的加餐。",
      es: "Yogur, fruta y semillas para un snack fresco con algo mas de proteina que la fruta sola.",
    },
    flags: {
      vegetarian: true,
      glutenFree: true,
      nutFree: true,
      soyFree: true,
      halal: true,
    },
  },
];

const fallbackIdeas: Record<
  MealType,
  {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }
> = {
  breakfast: {
    title: {
      en: "Build-a-bowl breakfast",
      "zh-CN": "自组早餐碗",
      es: "Desayuno armado en bowl",
    },
    description: {
      en: "Use one starch, one protein that fits your diet, fruit, and a fat source like seeds or olive oil.",
      "zh-CN": "按照一份主食、一份适合你偏好的蛋白质、一份水果，再加少量脂肪来源来拼出早餐。",
      es: "Combina un carbohidrato, una proteina compatible con tu dieta, fruta y una fuente de grasa como semillas o aceite.",
    },
  },
  lunch: {
    title: {
      en: "Balanced lunch formula",
      "zh-CN": "均衡午餐公式",
      es: "Formula de almuerzo equilibrado",
    },
    description: {
      en: "Anchor lunch around a grain or potato, a clear protein, and two vegetables so calories are easier to control.",
      "zh-CN": "午餐以主食或土豆、明确蛋白质和两份蔬菜为核心，更容易把热量稳住。",
      es: "Estructura el almuerzo con cereal o patata, una proteina clara y dos verduras para controlar mejor las calorias.",
    },
  },
  dinner: {
    title: {
      en: "Low-friction dinner plate",
      "zh-CN": "低阻力晚餐盘",
      es: "Cena de baja friccion",
    },
    description: {
      en: "Keep dinner simple: one cooked protein, one warm starch, and vegetables you can finish without extra prep.",
      "zh-CN": "晚餐尽量简单：一份熟蛋白质、一份温热主食，再配能直接完成的蔬菜。",
      es: "Manten la cena simple: una proteina cocida, un carbohidrato caliente y verduras que no pidan mas trabajo.",
    },
  },
  snack: {
    title: {
      en: "Two-part snack rule",
      "zh-CN": "两段式加餐规则",
      es: "Regla del snack en dos partes",
    },
    description: {
      en: "Pair produce with protein or fat so the snack buys real time instead of only a short sugar bump.",
      "zh-CN": "把水果或蔬菜和蛋白质、脂肪搭配起来，让加餐真正顶一段时间，而不是只短暂升糖。",
      es: "Combina fruta o verdura con proteina o grasa para que el snack aguante de verdad y no solo un pico corto.",
    },
  },
};

function matchesPreference(seed: MealIdeaSeed, preference: string) {
  switch (preference) {
    case "vegetarian":
      return Boolean(seed.flags.vegetarian || seed.flags.vegan);
    case "vegan":
      return Boolean(seed.flags.vegan);
    case "pescatarian":
      return Boolean(seed.flags.pescatarian || seed.flags.vegetarian || seed.flags.vegan);
    case "dairy_free":
      return Boolean(seed.flags.dairyFree);
    case "gluten_free":
      return Boolean(seed.flags.glutenFree);
    case "nut_free":
      return Boolean(seed.flags.nutFree);
    case "soy_free":
      return Boolean(seed.flags.soyFree);
    case "halal":
      return Boolean(seed.flags.halal);
    default:
      return true;
  }
}

function buildFallbackIdea(
  locale: Locale,
  mealType: MealType,
  targetCalories?: number,
): MealIdeaSuggestion {
  const fallback = fallbackIdeas[mealType];

  return {
    id: `${mealType}-fallback`,
    title: fallback.title[locale],
    description: fallback.description[locale],
    approxCalories: targetCalories ?? defaultApproxByMealType[mealType],
    isFallback: true,
  };
}

function scoreIdea(seed: MealIdeaSeed, targetCalories?: number) {
  if (typeof targetCalories !== "number") {
    return seed.approxCalories;
  }

  return Math.abs(seed.approxCalories - targetCalories);
}

export function getMealIdeasPanelCopy(locale: Locale) {
  return panelCopy[locale];
}

export function buildMealIdeasTitle(locale: Locale, mealTypeLabel: string) {
  switch (locale) {
    case "zh-CN":
      return `${mealTypeLabel}建议`;
    case "es":
      return `Ideas de ${mealTypeLabel.toLowerCase()}`;
    default:
      return `${mealTypeLabel} ideas`;
  }
}

export function suggestMealIdeas({
  locale,
  mealType,
  targetCalories,
  dietPreferences,
}: {
  locale: Locale;
  mealType: MealType;
  targetCalories?: number;
  dietPreferences: string[];
}) {
  const uniquePreferences = Array.from(new Set(dietPreferences));
  const matchingSeeds = ideaSeeds
    .filter((seed) => {
      if (seed.mealType !== mealType) {
        return false;
      }

      return uniquePreferences.every((preference) => matchesPreference(seed, preference));
    })
    .sort((left, right) => scoreIdea(left, targetCalories) - scoreIdea(right, targetCalories));

  const suggestions = matchingSeeds.slice(0, 2).map<MealIdeaSuggestion>((seed) => ({
    id: seed.id,
    title: seed.title[locale],
    description: seed.description[locale],
    approxCalories: seed.approxCalories,
  }));

  if (suggestions.length < 2) {
    suggestions.push(buildFallbackIdea(locale, mealType, targetCalories));
  }

  return suggestions;
}
