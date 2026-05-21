import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";

const siteUrl = "https://aipregnancycaloriecalculator.online";
const allFeaturesFree = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";
const pages = [
  "",
  ...(allFeaturesFree ? [] : ["/pricing"]),
  "/about",
  "/contact",
] as const;

function localizedPath(locale: string, path: string) {
  if (locale === "en") {
    return path || "/";
  }

  return `/${locale}${path}`;
}

function absoluteUrl(locale: string, path: string) {
  const localized = localizedPath(locale, path);

  return localized === "/" ? siteUrl : `${siteUrl}${localized}`;
}

function languageAlternates(path: string) {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, absoluteUrl(locale, path)]),
    ["x-default", absoluteUrl("en", path)],
  ]);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency: path === "" ? "weekly" : path === "/pricing" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  );
}
