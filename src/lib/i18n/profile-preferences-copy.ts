import type { Locale } from "@/lib/i18n/config";

export const dietPreferenceOptionIds = [
  "vegetarian",
  "vegan",
  "pescatarian",
  "dairy_free",
  "gluten_free",
  "nut_free",
  "soy_free",
  "halal",
] as const;

export type DietPreferenceOptionId = (typeof dietPreferenceOptionIds)[number];

type ProfilePreferencesCopy = {
  sectionTitle: string;
  sectionDescription: string;
  helper: string;
  summaryTitle: string;
  summaryEmpty: string;
  aiSummaryTitle: string;
  options: Record<DietPreferenceOptionId, string>;
};

const copy: Record<Locale, ProfilePreferencesCopy> = {
  en: {
    sectionTitle: "Diet preferences",
    sectionDescription:
      "Save the eating patterns or restrictions that should shape future meal suggestions and AI answers.",
    helper: "Choose any that apply. You can keep this lightweight and update it later.",
    summaryTitle: "Saved diet preferences",
    summaryEmpty: "No diet preferences saved yet.",
    aiSummaryTitle: "Saved food preferences",
    options: {
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      pescatarian: "Pescatarian",
      dairy_free: "Dairy-free",
      gluten_free: "Gluten-free",
      nut_free: "Nut-free",
      soy_free: "Soy-free",
      halal: "Halal",
    },
  },
  "zh-CN": {
    sectionTitle: "\u996e\u98df\u504f\u597d",
    sectionDescription:
      "\u4fdd\u5b58\u4f60\u5e0c\u671b\u540e\u7eed\u996e\u98df\u5efa\u8bae\u548c AI \u56de\u7b54\u4f18\u5148\u9075\u5faa\u7684\u996e\u98df\u65b9\u5f0f\u6216\u9650\u5236\u3002",
    helper: "\u53ef\u4ee5\u591a\u9009\uff0c\u5148\u4fdd\u6301\u8f7b\u91cf\uff0c\u540e\u9762\u518d\u6539\u4e5f\u53ef\u4ee5\u3002",
    summaryTitle: "\u5df2\u4fdd\u5b58\u7684\u996e\u98df\u504f\u597d",
    summaryEmpty: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u996e\u98df\u504f\u597d\u3002",
    aiSummaryTitle: "AI \u5df2\u8bfb\u53d6\u7684\u996e\u98df\u504f\u597d",
    options: {
      vegetarian: "\u7d20\u98df",
      vegan: "\u7eaf\u7d20",
      pescatarian: "\u53ef\u5403\u9c7c\u7d20\u98df",
      dairy_free: "\u65e0\u4e73\u5236\u54c1",
      gluten_free: "\u65e0\u9ea6\u8d28",
      nut_free: "\u65e0\u575a\u679c",
      soy_free: "\u65e0\u5927\u8c46",
      halal: "\u6e05\u771f",
    },
  },
  es: {
    sectionTitle: "Preferencias alimentarias",
    sectionDescription:
      "Guarda los patrones o restricciones que deberian influir en futuras sugerencias de comidas y respuestas de la IA.",
    helper: "Puedes elegir varias. Mantenlo ligero por ahora y ajustalo despues si hace falta.",
    summaryTitle: "Preferencias guardadas",
    summaryEmpty: "Todavia no hay preferencias alimentarias guardadas.",
    aiSummaryTitle: "Preferencias que la IA ya conoce",
    options: {
      vegetarian: "Vegetariana",
      vegan: "Vegana",
      pescatarian: "Pescetariana",
      dairy_free: "Sin lacteos",
      gluten_free: "Sin gluten",
      nut_free: "Sin frutos secos",
      soy_free: "Sin soja",
      halal: "Halal",
    },
  },
};

function fallbackPreferenceLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function getProfilePreferencesCopy(locale: Locale): ProfilePreferencesCopy {
  return copy[locale] ?? copy.en;
}

export function getDietPreferenceLabel(locale: Locale, value: string) {
  const localized = (copy[locale] ?? copy.en).options[value as DietPreferenceOptionId];
  return localized ?? fallbackPreferenceLabel(value);
}

export function formatDietPreferenceList(locale: Locale, values: string[]) {
  return values
    .map((value) => getDietPreferenceLabel(locale, value))
    .join(locale === "zh-CN" ? "、" : ", ");
}
