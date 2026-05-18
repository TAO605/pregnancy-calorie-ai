import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PregnancyCalculatorForm } from "@/components/calculator/pregnancy-calculator-form";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingShell } from "@/components/site/marketing-shell";
import { getPublishedContentPages } from "@/lib/content/content-store";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";

type CalculatorPageProps = {
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
}: CalculatorPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.calculatorMetaTitle,
    description: pageCopy.calculatorMetaDescription,
    path: `/${locale}/tools/pregnancy-calorie-calculator`,
  });
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const pageCopy = getMarketingPageCopy(locale);
  const contentPages = (await getPublishedContentPages(locale)).slice(0, 3);
  const calculatorUrl = `${SITE_URL}/${locale}/tools/pregnancy-calorie-calculator`;
  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: pageCopy.calculatorMetaTitle,
    description: pageCopy.calculatorMetaDescription,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: calculatorUrl,
  };
  const calculatorFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pageCopy.calculatorFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <JsonLd data={[calculatorSchema, calculatorFaqSchema]} />

      <section className="app-container py-12 md:py-18">
        <div className="grid gap-8">
          <div className="grid gap-8 md:grid-cols-[0.92fr_1.08fr]">
            <article className="surface-card rounded-[2rem] p-8 md:p-10">
              <span className="eyebrow">{dictionary.calculator.eyebrow}</span>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
                {dictionary.calculator.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                {dictionary.calculator.description}
              </p>

              <div className="mt-10 grid gap-4">
                <div className="rounded-[1.4rem] bg-white/84 p-5 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {pageCopy.calculatorRuleAwareLabel}
                  </p>
                  <p className="mt-2 text-base leading-7 text-muted">{dictionary.calculator.sourceNote}</p>
                </div>
                <div className="rounded-[1.4rem] bg-[rgba(255,122,89,0.08)] p-5 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b1563f]">
                    {pageCopy.calculatorWhyLabel}
                  </p>
                  <p className="mt-2 text-base leading-7 text-muted">
                    {pageCopy.calculatorWhyBody}
                  </p>
                </div>
              </div>
            </article>

            <article className="surface-card rounded-[2rem] p-8 md:p-10">
              <PregnancyCalculatorForm
                locale={locale}
                copy={dictionary.calculator}
                labels={dictionary.calculatorForm}
              />
            </article>
          </div>

          {contentPages.length > 0 ? (
            <article className="surface-card rounded-[1.8rem] p-8">
              <span className="eyebrow">{dictionary.content.sectionTitle}</span>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                {dictionary.content.sectionBody}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {contentPages.map((page) => (
                  <article key={page.id} className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {page.locale}
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.06em]">
                      {page.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-muted">{page.description}</p>
                    <Link
                      href={`/${locale}/blog/${page.slug}`}
                      className="cta-secondary mt-6 inline-flex text-sm"
                    >
                      {dictionary.content.readMore}
                    </Link>
                  </article>
                ))}
              </div>
            </article>
          ) : null}

          <article className="surface-card rounded-[1.8rem] p-8 md:p-10">
            <span className="eyebrow">{pageCopy.calculatorFaqEyebrow}</span>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
              {pageCopy.calculatorFaqTitle}
            </h2>

            <div className="mt-8 grid gap-4">
              {pageCopy.calculatorFaqItems.map((item) => (
                <article key={item.question} className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                  <h3 className="text-xl font-semibold tracking-[-0.04em]">{item.question}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{item.answer}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </MarketingShell>
  );
}
