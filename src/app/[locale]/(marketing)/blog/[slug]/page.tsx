import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrackedAiEntryLink } from "@/components/analytics/tracked-ai-entry-link";
import { ContentPageViewTracker } from "@/components/content/content-page-view-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingShell } from "@/components/site/marketing-shell";
import { getContentPageBySlug, getPublishedContentPages } from "@/lib/content/content-store";
import { getGuideTopic } from "@/lib/content/guide-topic";
import { buildBlogAiPrompt } from "@/lib/i18n/blog-ai-prompt";
import { getBlogToolCtaCopy } from "@/lib/i18n/blog-tool-cta-copy";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

type BlogPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function resolveParams(
  params: Promise<{ locale: string; slug: string }>,
): Promise<{ locale: Locale; slug: string }> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return { locale, slug };
}

export async function generateStaticParams() {
  const pages = await getPublishedContentPages();
  return pages.flatMap((page) =>
    isLocale(page.locale) ? [{ locale: page.locale, slug: page.slug }] : [],
  );
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale, slug } = await resolveParams(params);
  const page = await getContentPageBySlug(locale, slug);
  const pageCopy = getMarketingPageCopy(locale);

  if (!page) {
    return buildMarketingMetadata({
      locale,
      title: pageCopy.blogFallbackTitle,
      description: pageCopy.blogFallbackDescription,
      path: `/${locale}/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMarketingMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: `/${locale}/blog/${slug}`,
    languageAlternates: false,
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale, slug } = await resolveParams(params);
  const dictionary = getDictionary(locale);
  const pageCopy = getMarketingPageCopy(locale);
  const toolCtaCopy = getBlogToolCtaCopy(locale);
  const page = await getContentPageBySlug(locale, slug);
  const relatedPages = (await getPublishedContentPages(locale))
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  if (!page) {
    notFound();
  }

  const paragraphs = page.body
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const pageUrl = `${SITE_URL}/${locale}/blog/${slug}`;
  const guideTopic = getGuideTopic(slug, locale);
  const blogAiHref = `/${locale}/ai?prompt=${encodeURIComponent(
    buildBlogAiPrompt(locale, {
      title: page.title,
      description: page.description,
    }),
  )}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    keywords: guideTopic.keywords,
    inLanguage: locale,
    dateModified: page.updatedAt,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageCopy.blogNavLabel,
        item: `${SITE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <ContentPageViewTracker locale={locale} slug={slug} />
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      <section className="app-container py-12 md:py-18">
        <article className="surface-card rounded-[2rem] p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{pageCopy.blogPublishedEyebrow}</span>
            <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold text-[#0a72ef]">
              {guideTopic.label}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{page.description}</p>

          <div className="mt-10 grid gap-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-4xl text-base leading-8 text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-12 rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(10,114,239,0.06)_0%,rgba(255,255,255,0.9)_100%)] p-8 shadow-border md:p-10">
            <span className="eyebrow">{toolCtaCopy.eyebrow}</span>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
              {toolCtaCopy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {toolCtaCopy.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                <p className="text-xl font-semibold tracking-[-0.04em]">
                  {toolCtaCopy.cards.calculator.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {toolCtaCopy.cards.calculator.body}
                </p>
                <Link
                  href={`/${locale}/tools/pregnancy-calorie-calculator`}
                  className="cta-primary mt-5 inline-flex text-sm"
                >
                  {toolCtaCopy.cards.calculator.cta}
                </Link>
              </article>

              <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                <p className="text-xl font-semibold tracking-[-0.04em]">
                  {toolCtaCopy.cards.ai.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {toolCtaCopy.cards.ai.body}
                </p>
                <TrackedAiEntryLink
                  href={blogAiHref}
                  locale={locale}
                  source="blog_article_tool_cta"
                  className="cta-secondary mt-5 inline-flex text-sm"
                  metadata={{ slug }}
                >
                  {toolCtaCopy.cards.ai.cta}
                </TrackedAiEntryLink>
              </article>

              <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                <p className="text-xl font-semibold tracking-[-0.04em]">
                  {toolCtaCopy.cards.guides.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {toolCtaCopy.cards.guides.body}
                </p>
                <Link href={`/${locale}/blog`} className="cta-secondary mt-5 inline-flex text-sm">
                  {toolCtaCopy.cards.guides.cta}
                </Link>
              </article>
            </div>
          </section>

          <div className="mt-10 grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[1.5rem] bg-white/88 p-6 shadow-border">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {dictionary.result.actionTitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/tools/pregnancy-calorie-calculator`}
                  className="cta-primary"
                >
                  {dictionary.hero.primaryCta}
                </Link>
                <TrackedAiEntryLink
                  href={blogAiHref}
                  locale={locale}
                  source="blog_article_footer"
                  className="cta-secondary"
                  metadata={{ slug }}
                >
                  {dictionary.nav.aiAssistant}
                </TrackedAiEntryLink>
                <Link href={`/${locale}/legal/medical-disclaimer`} className="cta-secondary">
                  {dictionary.nav.disclaimer}
                </Link>
              </div>
            </article>

            {relatedPages.length > 0 ? (
              <article className="rounded-[1.5rem] bg-white/88 p-6 shadow-border">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  {toolCtaCopy.relatedEyebrow}
                </p>
                <div className="mt-5 grid gap-4">
                  {relatedPages.map((relatedPage) => (
                    <div key={relatedPage.id} className="rounded-[1.2rem] bg-[rgba(10,114,239,0.06)] p-4">
                      <p className="text-base font-semibold tracking-[-0.03em]">
                        {relatedPage.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {relatedPage.description}
                      </p>
                      <Link
                        href={`/${locale}/blog/${relatedPage.slug}`}
                        className="cta-secondary mt-4 w-fit text-sm"
                      >
                        {dictionary.content.readMore}
                      </Link>
                    </div>
                  ))}
                </div>
              </article>
            ) : (
              <article className="rounded-[1.5rem] bg-white/88 p-6 shadow-border">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  {pageCopy.blogNavLabel}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/${locale}/blog`} className="cta-secondary">
                    {pageCopy.blogIndexCta}
                  </Link>
                </div>
              </article>
            )}
          </div>
        </article>
      </section>
    </MarketingShell>
  );
}
