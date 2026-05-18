import { notFound } from "next/navigation";

import { WeightTracker } from "@/components/dashboard/weight-tracker";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getProductCopy } from "@/lib/i18n/product-copy";

type WeightPageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export default async function WeightPage({ params }: WeightPageProps) {
  const locale = await resolveLocale(params);

  return <WeightTracker locale={locale} copy={getProductCopy(locale).dashboard} />;
}
