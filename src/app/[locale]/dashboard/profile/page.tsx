import { notFound } from "next/navigation";

import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getProductCopy } from "@/lib/i18n/product-copy";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const locale = await resolveLocale(params);

  return <ProfileEditor locale={locale} copy={getProductCopy(locale).dashboard} />;
}
