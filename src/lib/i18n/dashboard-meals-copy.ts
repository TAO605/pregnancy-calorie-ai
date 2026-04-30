import type { Locale } from "@/lib/i18n/config";

type DashboardMealsCopy = {
  navLabel: string;
  overviewTitle: string;
  overviewDescription: string;
  pageEyebrow: string;
  pageTitle: string;
  pageDescription: string;
  summary: {
    dailyTarget: string;
    loggedToday: string;
    remaining: string;
    overTarget: string;
    targetMissingHint: string;
    mealsSaved: string;
    averageMeal: string;
    trackedDays: string;
  };
  plan: {
    title: string;
    description: string;
    targetLabel: string;
    loggedLabel: string;
    remainingLabel: string;
    overLabel: string;
    noTargetTitle: string;
    noTargetBody: string;
    calculatorCta: string;
    aiCta: string;
  };
  form: {
    date: string;
    mealType: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    itemName: string;
    itemNamePlaceholder: string;
    itemCalories: string;
    itemCaloriesPlaceholder: string;
    addItem: string;
    removeItem: string;
    save: string;
    draftTotal: string;
    emptyItemHint: string;
  };
  sections: {
    daySummary: string;
    recentEntries: string;
    noEntries: string;
    totalCalories: string;
    items: string;
    sourceManual: string;
  };
};

const copy: Record<Locale, DashboardMealsCopy> = {
  en: {
    navLabel: "Meals",
    overviewTitle: "Meals journal",
    overviewDescription:
      "Save rough meal calories so the dashboard becomes a daily habit instead of a one-time calculator visit.",
    pageEyebrow: "Meals retention loop",
    pageTitle: "Log meals with enough detail to spot the pattern.",
    pageDescription:
      "This is intentionally lighter than a full nutrition tracker. Capture the meal, estimate calories, and build a record you can revisit with the calculator and AI later.",
    summary: {
      dailyTarget: "Today's target",
      loggedToday: "Logged today",
      remaining: "Remaining",
      overTarget: "Over target",
      targetMissingHint: "Run the calculator to unlock target pacing.",
      mealsSaved: "Meals saved",
      averageMeal: "Average meal",
      trackedDays: "Tracked days",
    },
    plan: {
      title: "Suggested meal split",
      description:
        "Use the latest calorie target to pace breakfast, lunch, dinner, and snacks instead of deciding every meal from scratch.",
      targetLabel: "Target",
      loggedLabel: "Logged",
      remainingLabel: "Remaining",
      overLabel: "Over",
      noTargetTitle: "No saved calorie target yet",
      noTargetBody:
        "Run the calculator once and this meals page will turn into a target-aware pacing tool.",
      calculatorCta: "Open calculator",
      aiCta: "Ask AI about today's meals",
    },
    form: {
      date: "Date",
      mealType: "Meal type",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      itemName: "Food item",
      itemNamePlaceholder: "Greek yogurt",
      itemCalories: "Estimated calories",
      itemCaloriesPlaceholder: "180",
      addItem: "Add another item",
      removeItem: "Remove",
      save: "Save meal entry",
      draftTotal: "Draft total",
      emptyItemHint: "Add at least one food item with calories before saving.",
    },
    sections: {
      daySummary: "Daily totals",
      recentEntries: "Recent meals",
      noEntries: "No meals saved yet.",
      totalCalories: "Total calories",
      items: "Items",
      sourceManual: "Manual entry",
    },
  },
  "zh-CN": {
    navLabel: "\u996e\u98df",
    overviewTitle: "\u996e\u98df\u8bb0\u5f55",
    overviewDescription:
      "\u5148\u628a\u6bcf\u9910\u5927\u81f4\u8bb0\u4e0b\u6765\uff0c\u8ba9 Dashboard \u53d8\u6210\u53ef\u4ee5\u6bcf\u5929\u56de\u6765\u7684\u5de5\u5177\u3002",
    pageEyebrow: "\u996e\u98df\u7559\u5b58\u73af",
    pageTitle: "\u8bb0\u5f55\u4e09\u9910\uff0c\u5148\u770b\u89c1\u6a21\u5f0f\u518d\u6c42\u7ec6\u8282\u3002",
    pageDescription:
      "\u8fd9\u4e2a\u7248\u672c\u6545\u610f\u6bd4\u5b8c\u6574\u8425\u517b\u8ddf\u8e2a\u66f4\u8f7b\u3002\u5148\u8bb0\u4e0b\u5403\u4e86\u4ec0\u4e48\u3001\u5927\u81f4\u70ed\u91cf\u662f\u591a\u5c11\uff0c\u8ba9\u540e\u7eed AI \u548c\u8ba1\u7b97\u5668\u6709\u53ef\u8ffd\u6eaf\u7684\u4e0a\u4e0b\u6587\u3002",
    summary: {
      dailyTarget: "\u4eca\u65e5\u76ee\u6807",
      loggedToday: "\u4eca\u65e5\u5df2\u8bb0\u5f55",
      remaining: "\u8fd8\u5dee",
      overTarget: "\u5df2\u8d85\u51fa",
      targetMissingHint: "\u5148\u8fd0\u884c\u8ba1\u7b97\u5668\uff0c\u624d\u80fd\u770b\u5230\u76ee\u6807\u8fdb\u5ea6\u3002",
      mealsSaved: "\u5df2\u4fdd\u5b58\u9910\u6b21",
      averageMeal: "\u5355\u9910\u5e73\u5747",
      trackedDays: "\u8bb0\u5f55\u5929\u6570",
    },
    plan: {
      title: "\u5efa\u8bae\u9910\u6b21\u5206\u914d",
      description:
        "\u76f4\u63a5\u7528\u6700\u8fd1\u4e00\u6b21\u70ed\u91cf\u76ee\u6807\u6765\u5b89\u6392\u65e9\u9910\u3001\u5348\u9910\u3001\u665a\u9910\u548c\u52a0\u9910\uff0c\u800c\u4e0d\u662f\u6bcf\u987f\u90fd\u4ece\u96f6\u5f00\u59cb\u60f3\u3002",
      targetLabel: "\u76ee\u6807",
      loggedLabel: "\u5df2\u8bb0\u5f55",
      remainingLabel: "\u8fd8\u5dee",
      overLabel: "\u5df2\u8d85\u51fa",
      noTargetTitle: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u7684\u70ed\u91cf\u76ee\u6807",
      noTargetBody:
        "\u5148\u8fd0\u884c\u4e00\u6b21\u8ba1\u7b97\u5668\uff0c\u8fd9\u4e2a\u9875\u9762\u5c31\u4f1a\u53d8\u6210\u6709\u76ee\u6807\u611f\u7684\u996e\u98df\u8fdb\u5ea6\u9762\u677f\u3002",
      calculatorCta: "\u6253\u5f00\u8ba1\u7b97\u5668",
      aiCta: "\u8ba9 AI \u5e2e\u6211\u5b89\u6392\u4eca\u5929\u996e\u98df",
    },
    form: {
      date: "\u65e5\u671f",
      mealType: "\u9910\u6b21",
      breakfast: "\u65e9\u9910",
      lunch: "\u5348\u9910",
      dinner: "\u665a\u9910",
      snack: "\u52a0\u9910",
      itemName: "\u98df\u7269",
      itemNamePlaceholder: "\u4f8b\u5982\uff1a\u5e0c\u814a\u9178\u5976",
      itemCalories: "\u4f30\u7b97\u70ed\u91cf",
      itemCaloriesPlaceholder: "180",
      addItem: "\u518d\u6dfb\u52a0\u4e00\u6837",
      removeItem: "\u5220\u9664",
      save: "\u4fdd\u5b58\u996e\u98df\u8bb0\u5f55",
      draftTotal: "\u5f53\u524d\u5408\u8ba1",
      emptyItemHint: "\u81f3\u5c11\u586b\u5199\u4e00\u6837\u98df\u7269\u548c\u70ed\u91cf\u540e\u518d\u4fdd\u5b58\u3002",
    },
    sections: {
      daySummary: "\u6309\u65e5\u6c47\u603b",
      recentEntries: "\u6700\u8fd1\u9910\u6b21",
      noEntries: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u996e\u98df\u8bb0\u5f55\u3002",
      totalCalories: "\u603b\u70ed\u91cf",
      items: "\u98df\u7269\u6570",
      sourceManual: "\u624b\u52a8\u5f55\u5165",
    },
  },
  es: {
    navLabel: "Comidas",
    overviewTitle: "Registro de comidas",
    overviewDescription:
      "Guarda calorias aproximadas por comida para que el panel se convierta en un habito y no en una visita unica.",
    pageEyebrow: "Bucle de retencion de comidas",
    pageTitle: "Registra tus comidas con suficiente detalle para ver el patron.",
    pageDescription:
      "Esto es mas ligero que un rastreador nutricional completo. Guarda la comida, estima las calorias y construye un historial que luego puedas revisar con la calculadora y la IA.",
    summary: {
      dailyTarget: "Objetivo de hoy",
      loggedToday: "Registrado hoy",
      remaining: "Pendiente",
      overTarget: "Por encima",
      targetMissingHint: "Ejecuta la calculadora para desbloquear el ritmo del objetivo.",
      mealsSaved: "Comidas guardadas",
      averageMeal: "Promedio por comida",
      trackedDays: "Dias registrados",
    },
    plan: {
      title: "Distribucion sugerida",
      description:
        "Usa el objetivo calorico mas reciente para repartir desayuno, almuerzo, cena y snacks en lugar de improvisar cada comida.",
      targetLabel: "Objetivo",
      loggedLabel: "Registrado",
      remainingLabel: "Pendiente",
      overLabel: "Por encima",
      noTargetTitle: "Todavia no hay un objetivo guardado",
      noTargetBody:
        "Ejecuta la calculadora una vez y esta pagina de comidas se convertira en una herramienta guiada por objetivo.",
      calculatorCta: "Abrir calculadora",
      aiCta: "Preguntar a la IA por las comidas de hoy",
    },
    form: {
      date: "Fecha",
      mealType: "Tipo de comida",
      breakfast: "Desayuno",
      lunch: "Almuerzo",
      dinner: "Cena",
      snack: "Snack",
      itemName: "Alimento",
      itemNamePlaceholder: "Yogur griego",
      itemCalories: "Calorias estimadas",
      itemCaloriesPlaceholder: "180",
      addItem: "Agregar otro alimento",
      removeItem: "Quitar",
      save: "Guardar comida",
      draftTotal: "Total provisional",
      emptyItemHint: "Agrega al menos un alimento con calorias antes de guardar.",
    },
    sections: {
      daySummary: "Totales por dia",
      recentEntries: "Comidas recientes",
      noEntries: "Todavia no hay comidas guardadas.",
      totalCalories: "Calorias totales",
      items: "Alimentos",
      sourceManual: "Registro manual",
    },
  },
};

export function getDashboardMealsCopy(locale: Locale): DashboardMealsCopy {
  return copy[locale];
}
