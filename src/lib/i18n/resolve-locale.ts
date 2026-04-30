import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export function fromAcceptLanguage(value: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  const candidates = value
    .toLowerCase()
    .split(",")
    .map((item) => item.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.startsWith("zh")) {
      return "zh-CN";
    }

    if (candidate.startsWith("es")) {
      return "es";
    }

    if (candidate.startsWith("en")) {
      return "en";
    }
  }

  return defaultLocale;
}

export function resolveLocaleCandidate(value: string | null | undefined): Locale | null {
  return value && isLocale(value) ? value : null;
}
