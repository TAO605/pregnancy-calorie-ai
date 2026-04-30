import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SaveProgressPrompt } from "@/components/auth/save-progress-prompt";
import { CalorieResultCard } from "@/components/calculator/calorie-result-card";
import { ResultFollowUpPrompts } from "@/components/calculator/result-follow-up-prompts";
import { ResultActionLinks } from "@/components/calculator/result-action-links";
import { MarketingShell } from "@/components/site/marketing-shell";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import { hasAuthenticatedServerSession } from "@/lib/auth/server-session";
import { getPublishedContentPages } from "@/lib/content/content-store";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { getResultPageCopy } from "@/lib/i18n/result-page-copy";
import { getSaveProgressPromptCopy } from "@/lib/i18n/save-progress-prompt-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";

type ResultPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const bmiClasses = ["underweight", "normal", "overweight", "obese"] as const;

type BmiClass = (typeof bmiClasses)[number];

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.resultMetaTitle,
    description: pageCopy.resultMetaDescription,
    path: `/${locale}/tools/pregnancy-calorie-calculator/result`,
    noIndex: true,
    languageAlternates: false,
  });
}

function readNumber(value: string | string[] | undefined): number | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  return Number.isFinite(parsed) ? parsed : null;
}

function readString(value: string | string[] | undefined): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate ? candidate : null;
}

function isBmiClass(value: string | null): value is BmiClass {
  return value !== null && bmiClasses.includes(value as BmiClass);
}

export default async function ResultPage({
  params,
  searchParams,
}: ResultPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const pageCopy = getMarketingPageCopy(locale);
  const resultCopy = getResultPageCopy(locale);
  const savePromptCopy = getSaveProgressPromptCopy(locale);
  const isSignedIn = await hasAuthenticatedServerSession();
  const promptState: "guest" | "member" = isSignedIn ? "member" : "guest";
  const promptCopy = isSignedIn ? savePromptCopy.result.member : savePromptCopy.result.guest;
  const query = await searchParams;
  const contentPages = (await getPublishedContentPages(locale)).slice(0, 2);

  const calories = readNumber(query.calories);
  const min = readNumber(query.min);
  const max = readNumber(query.max);
  const trimester = readNumber(query.trimester);
  const source = readString(query.source);
  const extraCalories = readNumber(query.extra);
  const bmiClass = readString(query.bmi);
  const flags = readString(query.flags)?.split(",").filter(Boolean) ?? [];

  const result =
    calories !== null &&
    min !== null &&
    max !== null &&
    trimester !== null &&
    source !== null
      ? {
          calories,
          min,
          max,
          trimester,
          source,
        }
      : null;

  const explanationResult =
    result && extraCalories !== null && isBmiClass(bmiClass)
      ? {
          ...result,
          extraCalories,
          bmiClass,
        }
      : null;

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <section className="app-container py-12 md:py-18">
        <div className="grid gap-8">
          <div>
            <span className="eyebrow">{resultCopy.eyebrow}</span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
              {resultCopy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
              {resultCopy.subtitle}
            </p>
          </div>

          {result ? (
            <CalorieResultCard
              calories={result.calories}
              min={result.min}
              max={result.max}
              trimester={result.trimester}
              source={result.source}
              caloriesLabel={resultCopy.card.caloriesLabel}
              perDayLabel={resultCopy.card.perDayLabel}
              rangeLabel={resultCopy.card.rangeLabel}
              rangeHint={resultCopy.card.rangeHint}
              trimesterChipLabel={resultCopy.card.formatTrimesterChip(result.trimester)}
              sourceChipLabel={resultCopy.card.formatSourceChip(result.source)}
            />
          ) : (
            <article className="surface-card rounded-[2rem] p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {resultCopy.missingTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                {resultCopy.missingBody}
              </p>
            </article>
          )}

          {result ? (
            <SaveProgressPrompt
              eyebrow={promptCopy.eyebrow}
              title={promptCopy.title}
              body={promptCopy.body}
              badge={promptCopy.badge}
              actions={[
                {
                  href: isSignedIn
                    ? `/${locale}/dashboard`
                    : buildSignInHref({
                        locale,
                        nextPath: `/${locale}/dashboard`,
                        source: "calculator_result_save",
                      }),
                  label: promptCopy.cta,
                  tracking: {
                    locale,
                    surface: "result" as const,
                    state: promptState,
                    destination: "dashboard" as const,
                  },
                },
                ...(isSignedIn && promptCopy.secondaryCta
                  ? [
                      {
                        href: `/${locale}/dashboard/meals`,
                        label: promptCopy.secondaryCta,
                        variant: "secondary" as const,
                        tracking: {
                          locale,
                          surface: "result" as const,
                          state: "member" as const,
                          destination: "meals" as const,
                        },
                      },
                    ]
                  : []),
              ]}
            />
          ) : null}

          {explanationResult ? (
            <section className="surface-card rounded-[1.8rem] p-8 md:p-10">
              <span className="eyebrow">{resultCopy.explanation.eyebrow}</span>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
                {resultCopy.explanation.title}
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                    {resultCopy.explanation.extraCaloriesTitle}
                  </p>
                  <p className="mt-4 text-base leading-7 text-muted">
                    {resultCopy.explanation.formatExtraCaloriesBody(
                      explanationResult.extraCalories,
                      explanationResult.trimester,
                    )}
                  </p>
                </article>
                <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                    {resultCopy.explanation.sourceTitle}
                  </p>
                  <p className="mt-4 text-base leading-7 text-muted">
                    {resultCopy.explanation.formatSourceBody(explanationResult.source)}
                  </p>
                </article>
                <article className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                    {resultCopy.explanation.bmiTitle}
                  </p>
                  <p className="mt-4 text-base leading-7 text-muted">
                    {resultCopy.explanation.bmiBodies[explanationResult.bmiClass]}
                  </p>
                </article>
              </div>

              <article className="mt-4 rounded-[1.4rem] bg-[rgba(10,114,239,0.06)] p-6 shadow-border">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  {resultCopy.explanation.rangeTitle}
                </p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                  {resultCopy.explanation.rangeBody}
                </p>
              </article>
            </section>
          ) : null}

          <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
            <article className="surface-card rounded-[1.8rem] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {resultCopy.actionTitle}
              </p>
              <ul className="mt-5 grid gap-4">
                {resultCopy.actions.map((item) => (
                  <li key={item} className="rounded-[1.3rem] bg-white/88 p-4 shadow-border">
                    <p className="text-sm leading-7 text-muted">{item}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card rounded-[1.8rem] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {resultCopy.cautionTitle}
              </p>
              <p className="mt-5 text-base leading-7 text-muted">
                {resultCopy.cautionBody}
              </p>

              {flags.length > 0 ? (
                <div className="mt-6 grid gap-3">
                  {flags.map((flag) => {
                    const flagCopy = resultCopy.flagDescriptions[flag] ?? {
                      label: flag,
                      body: flag,
                    };

                    return (
                      <div
                        key={flag}
                        className="rounded-[1.3rem] bg-[rgba(255,122,89,0.09)] p-4 shadow-border"
                      >
                        <p className="text-sm font-semibold text-[#a34c36]">
                          {resultCopy.flagTitle}: {flagCopy.label}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted">{flagCopy.body}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <ResultActionLinks
                locale={locale}
                calculatorHref={`/${locale}/tools/pregnancy-calorie-calculator`}
                aiHref={`/${locale}/ai`}
                backLabel={resultCopy.backCta}
                aiLabel={resultCopy.aiCta}
                source={result?.source ?? null}
                recommendedCalories={result?.calories ?? null}
              />
            </article>
          </div>

          {result ? (
            <section className="surface-card rounded-[1.8rem] p-8 md:p-10">
              <span className="eyebrow">{resultCopy.prompts.eyebrow}</span>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
                {resultCopy.prompts.title}
              </h2>

              <div className="mt-8">
                <ResultFollowUpPrompts
                  locale={locale}
                  source={result.source}
                  recommendedCalories={result.calories}
                  aiHref={`/${locale}/ai`}
                  items={resultCopy.prompts.items.map((item) => ({
                    title: item.title,
                    body: item.body,
                    cta: item.cta,
                    prompt: item.buildPrompt({
                      recommendedCalories: result.calories,
                      source: result.source,
                    }),
                  }))}
                />
              </div>
            </section>
          ) : null}

          {contentPages.length > 0 ? (
            <section className="surface-card rounded-[1.8rem] p-8 md:p-10">
              <span className="eyebrow">{resultCopy.guides.eyebrow}</span>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
                {resultCopy.guides.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                {resultCopy.guides.body}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {contentPages.map((page) => (
                  <article key={page.id} className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {pageCopy.blogPublishedEyebrow}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em]">
                      {page.title}
                    </h3>
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
            </section>
          ) : null}
        </div>
      </section>
    </MarketingShell>
  );
}
