import type { Locale } from "@/lib/i18n/config";

const riskKeywordsByLocale: Record<Locale, string[]> = {
  en: [
    "bleeding",
    "severe pain",
    "chest pain",
    "shortness of breath",
    "reduced fetal movement",
    "can't breathe",
    "fainting",
    "high fever",
    "vomiting nonstop",
  ],
  "zh-CN": [
    "出血",
    "剧烈腹痛",
    "胸痛",
    "呼吸困难",
    "胎动减少",
    "晕倒",
    "高烧",
    "持续呕吐",
  ],
  es: [
    "sangrado",
    "dolor fuerte",
    "dolor en el pecho",
    "dificultad para respirar",
    "menos movimiento fetal",
    "desmayo",
    "fiebre alta",
    "vomitos constantes",
  ],
};

export function findRiskKeywords(locale: Locale, question: string): string[] {
  const lowered = question.toLowerCase();
  return riskKeywordsByLocale[locale].filter((keyword) => lowered.includes(keyword.toLowerCase()));
}
