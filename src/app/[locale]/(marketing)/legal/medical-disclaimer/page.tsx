import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingShell } from "@/components/site/marketing-shell";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.legalMetaTitle,
    description: pageCopy.legalMetaDescription,
    path: `/${locale}/legal/medical-disclaimer`,
  });
}

export default async function LegalPage({ params }: LegalPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <section className="app-container py-12 md:py-18">
        <article className="surface-card rounded-[2rem] p-8 md:p-10">
          <span className="eyebrow">{dictionary.legal.eyebrow}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
            {dictionary.legal.title}
          </h1>

          <div className="mt-8 grid gap-4">
            {dictionary.legal.bullets.map((bullet) => (
              <div key={bullet} className="rounded-[1.35rem] bg-white/88 p-5 shadow-border">
                <p className="text-base leading-7 text-muted">{bullet}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </MarketingShell>
  );
}
