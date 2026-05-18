"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { isLocale, locales, type Locale } from "@/lib/i18n/config";

type LocaleSwitcherProps = {
  locale: Locale;
  className?: string;
};

const localeLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
  ja: "日本語",
  ko: "한국어",
};

function swapLocaleInPath(path: string, targetLocale: Locale) {
  const parts = path.split("/");

  if (parts.length > 1 && isLocale(parts[1] ?? "")) {
    parts[1] = targetLocale;
    return parts.join("/");
  }

  return `/${targetLocale}${path === "/" ? "" : path}`;
}

function buildLocaleHref(
  pathname: string | null,
  searchParams: URLSearchParams,
  currentLocale: Locale,
  targetLocale: Locale,
) {
  const safePathname = pathname || `/${currentLocale}`;
  const parts = safePathname.split("/");
  const rest = parts.slice(2);
  const nextParams = new URLSearchParams(searchParams.toString());
  const nextValue = nextParams.get("next");

  if (nextValue?.startsWith(`/${currentLocale}`)) {
    nextParams.set("next", swapLocaleInPath(nextValue, targetLocale));
  }

  const nextPath =
    rest[0] === "blog" && rest.length > 1
      ? `/${targetLocale}`
      : swapLocaleInPath(safePathname, targetLocale);
  const nextQuery = nextParams.toString();

  return nextQuery ? `${nextPath}?${nextQuery}` : nextPath;
}

export function LocaleSwitcherFallback({ locale, className }: LocaleSwitcherProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-white/88 p-1 shadow-border ${
        className ?? ""
      }`}
    >
      <span className="rounded-full bg-[#171717] px-3 py-1.5 text-xs font-semibold text-white">
        {localeLabels[locale]}
      </span>
    </div>
  );
}

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-white/88 p-1 shadow-border ${
        className ?? ""
      }`}
    >
      {locales.map((targetLocale) => {
        const active = targetLocale === locale;

        return (
          <Link
            key={targetLocale}
            href={buildLocaleHref(pathname, params, locale, targetLocale)}
            hrefLang={targetLocale}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-[#171717] text-white"
                : "text-muted hover:bg-white hover:text-foreground"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {localeLabels[targetLocale]}
          </Link>
        );
      })}
    </div>
  );
}
