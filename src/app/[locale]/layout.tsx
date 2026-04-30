import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { LocalePreferenceSync } from "@/components/site/locale-preference-sync";
import { isLocale, locales } from "@/lib/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LocalePreferenceSync locale={locale} />
      {children}
    </>
  );
}
