import type { Metadata } from "next";

import { locales, type Locale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

type MarketingMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  languageAlternates?: boolean;
};

export function buildMarketingMetadata({
  locale,
  title,
  description,
  path,
  noIndex = false,
  languageAlternates = true,
}: MarketingMetadataInput): Metadata {
  const canonical = `${SITE_URL}${path}`;
  const localizedPath = path.startsWith(`/${locale}`)
    ? path.slice(locale.length + 1) || ""
    : path;
  const languages = languageAlternates
    ? Object.fromEntries(
        locales.map((item) => [item, `${SITE_URL}/${item}${localizedPath}`]),
      )
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      siteName: SITE_NAME,
      type: "website",
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
