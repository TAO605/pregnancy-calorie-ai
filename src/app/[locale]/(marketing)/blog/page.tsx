import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { getGuideTopic } from "@/lib/content/guide-topic";
import { MarketingShell } from "@/components/site/marketing-shell";
import { getPublishedContentPages } from "@/lib/content/content-store";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";

type BlogIndexPageProps = {
  params: Promise<{ locale: string }>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: BlogIndexPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.blogIndexMetaTitle,
    description: pageCopy.blogIndexMetaDescription,
    path: `/${locale}/blog`,
  });
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const pageCopy = getMarketingPageCopy(locale);
  const pages = await getPublishedContentPages(locale);
  const blogIndexUrl = `${SITE_URL}/${locale}/blog`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageCopy.blogIndexMetaTitle,
    description: pageCopy.blogIndexMetaDescription,
    inLanguage: locale,
    url: blogIndexUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${blogIndexUrl}/${page.slug}`,
        name: page.title,
      })),
    },
  };

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <JsonLd data={collectionSchema} />

      <section className="app-container py-12 md:py-18">
        <div className="grid gap-8">
          <article className="surface-card rounded-[2rem] p-8 md:p-12">
            <span className="eyebrow">{pageCopy.blogIndexEyebrow}</span>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
              {pageCopy.blogIndexTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {pageCopy.blogIndexDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/tools/pregnancy-calorie-calculator`}
                className="cta-primary"
              >
                {dictionary.hero.primaryCta}
              </Link>
              <Link href={`/${locale}/ai`} className="cta-secondary">
                {dictionary.nav.aiAssistant}
              </Link>
            </div>
          </article>

          {pages.length === 0 ? (
            <article className="surface-card rounded-[1.8rem] p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {pageCopy.blogIndexEmptyTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                {pageCopy.blogIndexEmptyBody}
              </p>
              <Link
                href={`/${locale}/tools/pregnancy-calorie-calculator`}
                className="cta-primary mt-6 w-fit"
              >
                {dictionary.hero.primaryCta}
              </Link>
            </article>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pages.map((page) => (
                <article key={page.id} className="surface-card rounded-[1.8rem] p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {pageCopy.blogPublishedEyebrow}
                    </p>
                    <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold text-[#0a72ef]">
                      {getGuideTopic(page.slug, locale).label}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.06em]">
                    {page.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">{page.description}</p>
                  <p className="mt-5 text-sm text-muted">
                    {pageCopy.blogUpdatedLabel}: {formatDate(page.updatedAt, locale)}
                  </p>
                  <Link
                    href={`/${locale}/blog/${page.slug}`}
                    className="cta-secondary mt-6 w-fit text-sm"
                  >
                    {dictionary.content.readMore}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
