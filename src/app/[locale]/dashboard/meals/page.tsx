import { notFound } from "next/navigation";

import { MealTracker } from "@/components/dashboard/meal-tracker";
import { isLocale, type Locale } from "@/lib/i18n/config";

type MealsPageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export default async function MealsPage({ params }: MealsPageProps) {
  const locale = await resolveLocale(params);

  return <MealTracker locale={locale} />;
}
