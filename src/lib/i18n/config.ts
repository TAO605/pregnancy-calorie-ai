export const locales = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"] as const;

export type Locale = string;

export const defaultLocale = "en";
export const LOCALE_COOKIE_NAME = "nd_locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtlLocale(locale: Locale) {
  return locale === "ar";
}
