import { notFound } from "next/navigation";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getProductCopy } from "@/lib/i18n/product-copy";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const locale = await resolveLocale(params);
  const copy = getProductCopy(locale);

  return <DashboardOverview locale={locale} copy={copy.dashboard} />;
}
