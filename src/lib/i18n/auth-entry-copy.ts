import type { Locale } from "@/lib/i18n/config";

type AuthEntryCopy = {
  dashboardLabel: string;
};

const copy: Record<Locale, AuthEntryCopy> = {
  en: {
    dashboardLabel: "Dashboard",
  },
  "zh-CN": {
    dashboardLabel: "仪表盘",
  },
  es: {
    dashboardLabel: "Dashboard",
  },
};

export function getAuthEntryCopy(locale: Locale) {
  return copy[locale];
}
