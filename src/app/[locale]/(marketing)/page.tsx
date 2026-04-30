import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { MarketingShell } from "@/components/site/marketing-shell";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import { hasAuthenticatedServerSession } from "@/lib/auth/server-session";
import { getPublishedContentPages } from "@/lib/content/content-store";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingHomeCopy } from "@/lib/i18n/marketing-home-copy";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

type MarketingHomePageProps = {
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
}: MarketingHomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.homeMetaTitle,
    description: pageCopy.homeMetaDescription,
    path: `/${locale}`,
  });
}

export default async function MarketingHomePage({
  params,
}: MarketingHomePageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const homeCopy = getMarketingHomeCopy(locale);
  const pageCopy = getMarketingPageCopy(locale);
  const [isSignedIn, contentPages] = await Promise.all([
    hasAuthenticatedServerSession(),
    getPublishedContentPages(locale),
  ]);
  const visibleContentPages = contentPages.slice(0, 3);
  const homeUrl = `${SITE_URL}/${locale}`;
  const buildProtectedHref = (nextPath: string) =>
    isSignedIn
      ? nextPath
      : buildSignInHref({
          locale,
          nextPath,
          source: "marketing_nav",
        });
  const loopLinks = [
    `/${locale}/tools/pregnancy-calorie-calculator`,
    `/${locale}/ai`,
    buildProtectedHref(`/${locale}/dashboard`),
  ];
  const featureLinks = [
    buildProtectedHref(`/${locale}/dashboard/profile`),
    buildProtectedHref(`/${locale}/dashboard/weight`),
    buildProtectedHref(`/${locale}/dashboard/meals`),
    `/${locale}/ai`,
  ];
  const fallbackGuideLinks = [
    `/${locale}/tools/pregnancy-calorie-calculator`,
    `/${locale}/ai`,
    buildProtectedHref(`/${locale}/dashboard`),
  ];
  const loopTones = [
    "bg-[rgba(10,114,239,0.06)]",
    "bg-[rgba(255,122,162,0.08)]",
    "bg-[rgba(255,122,89,0.08)]",
  ];
  const featureTones = [
    "bg-[rgba(10,114,239,0.06)]",
    "bg-[rgba(28,160,98,0.08)]",
    "bg-[rgba(255,122,89,0.08)]",
    "bg-[rgba(255,122,162,0.08)]",
  ];
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: homeUrl,
    description: pageCopy.homeMetaDescription,
    inLanguage: locale,
  };

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <JsonLd data={websiteSchema} />

      <section className="app-container py-12 md:py-20">
        <div className="surface-card hero-panel rounded-[2.4rem] p-7 md:p-12">
          <span className="eyebrow">{dictionary.hero.eyebrow}</span>

          <div className="mt-8 grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <h1 className="display-tight text-balance max-w-4xl text-5xl font-semibold tracking-[-0.08em] md:text-7xl">
                {dictionary.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                {dictionary.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/tools/pregnancy-calorie-calculator`}
                  className="cta-primary"
                >
                  {dictionary.hero.primaryCta}
                </Link>
                <Link href={`/${locale}/ai`} className="cta-secondary">
                  {dictionary.hero.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {dictionary.hero.bullets.map((bullet, index) => (
                <div
                  key={bullet}
                  className="rounded-[1.4rem] bg-white/88 p-5 shadow-border"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-lg font-medium tracking-[-0.04em]">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-container pb-16 md:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {dictionary.sections.cards.map((card, index) => (
            <article
              key={card.title}
              className="surface-card rounded-[1.8rem] p-7 fine-grid"
            >
              <div className="metric-chip w-fit bg-[rgba(23,23,23,0.04)] text-muted">
                0{index + 1}
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.06em]">
                {card.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">{card.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.1fr]">
          <article className="surface-card rounded-[1.8rem] p-8">
            <span className="eyebrow">{dictionary.sections.pipelineTitle}</span>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              {dictionary.sections.pipelineBody}
            </p>
          </article>

          <article className="surface-card rounded-[1.8rem] p-8">
            <span className="eyebrow">{homeCopy.loopEyebrow}</span>
            <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-[-0.07em]">
              {homeCopy.loopTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              {homeCopy.loopBody}
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {homeCopy.loopCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`flex h-full flex-col rounded-[1.4rem] p-5 shadow-border ${loopTones[index]}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.05em]">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">{card.body}</p>
                  <Link href={loopLinks[index]} className="cta-secondary mt-5 w-fit text-sm">
                    {card.cta}
                  </Link>
                </article>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-10 grid gap-6">
          <article className="surface-card rounded-[1.8rem] p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <span className="eyebrow">{homeCopy.featureEyebrow}</span>
                <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.08em]">
                  {homeCopy.featureTitle}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                  {homeCopy.featureBody}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {homeCopy.featureCards.map((card, index) => (
                  <article
                    key={card.title}
                    className={`flex h-full flex-col rounded-[1.5rem] p-5 shadow-border ${featureTones[index]}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.05em]">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted">{card.body}</p>
                    <Link
                      href={featureLinks[index]}
                      className="cta-secondary mt-5 w-fit text-sm"
                    >
                      {card.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </article>

          <article className="surface-card rounded-[1.8rem] p-8">
            <span className="eyebrow">{dictionary.content.sectionTitle}</span>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {dictionary.content.sectionBody}
            </p>
          </article>

          <div className="grid gap-6 md:grid-cols-3">
            {visibleContentPages.length > 0
              ? visibleContentPages.map((page) => (
                  <article key={page.id} className="surface-card rounded-[1.8rem] p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {page.locale}
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.06em]">
                      {page.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-muted">{page.description}</p>
                    <Link
                      href={`/${locale}/blog/${page.slug}`}
                      className="cta-secondary mt-6 text-sm"
                    >
                      {dictionary.content.readMore}
                    </Link>
                  </article>
                ))
              : homeCopy.guideFallbackCards.map((card, index) => (
                  <article key={card.title} className="surface-card rounded-[1.8rem] p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {card.eyebrow}
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.06em]">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-muted">{card.body}</p>
                    <Link
                      href={fallbackGuideLinks[index]}
                      className="cta-secondary mt-6 text-sm"
                    >
                      {card.cta}
                    </Link>
                  </article>
                ))}
          </div>

          {visibleContentPages.length > 0 ? (
            <div className="flex justify-start">
              <Link href={`/${locale}/blog`} className="cta-secondary text-sm">
                {pageCopy.blogIndexCta}
              </Link>
            </div>
          ) : null}

          {visibleContentPages.length === 0 ? (
            <article className="surface-card rounded-[1.8rem] p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {homeCopy.guideEmptyTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                {homeCopy.guideEmptyBody}
              </p>
            </article>
          ) : null}
        </div>
      </section>
    </MarketingShell>
  );
}
