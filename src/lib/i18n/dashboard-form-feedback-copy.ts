import type { Locale } from "@/lib/i18n/config";

type DashboardFormFeedbackCopy = {
  saving: string;
  genericSaveError: string;
  weightSaved: string;
  mealSaved: string;
};

const copy: Record<Locale, DashboardFormFeedbackCopy> = {
  en: {
    saving: "Saving...",
    genericSaveError:
      "We couldn't save this update. Check your connection and try again.",
    weightSaved: "Weight log saved and your profile was updated.",
    mealSaved: "Meal log saved.",
  },
  "zh-CN": {
    saving: "\u4fdd\u5b58\u4e2d...",
    genericSaveError:
      "\u8fd9\u6b21\u66f4\u65b0\u672a\u80fd\u4fdd\u5b58\u3002\u8bf7\u68c0\u67e5\u7f51\u7edc\u540e\u91cd\u8bd5\u3002",
    weightSaved: "\u4f53\u91cd\u8bb0\u5f55\u5df2\u4fdd\u5b58\uff0c\u4e2a\u4eba\u8d44\u6599\u5df2\u540c\u6b65\u66f4\u65b0\u3002",
    mealSaved: "\u996e\u98df\u8bb0\u5f55\u5df2\u4fdd\u5b58\u3002",
  },
  es: {
    saving: "Guardando...",
    genericSaveError:
      "No pudimos guardar este cambio. Revisa tu conexi\u00f3n e int\u00e9ntalo de nuevo.",
    weightSaved: "Registro de peso guardado y perfil actualizado.",
    mealSaved: "Registro de comida guardado.",
  },
};

export function getDashboardFormFeedbackCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
