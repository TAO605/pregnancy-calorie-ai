import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AssistantPanel } from "@/components/ai/assistant-panel";
import { SaveProgressPrompt } from "@/components/auth/save-progress-prompt";
import { MarketingShell } from "@/components/site/marketing-shell";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import { hasAuthenticatedServerSession } from "@/lib/auth/server-session";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { getSaveProgressPromptCopy } from "@/lib/i18n/save-progress-prompt-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { isAnalyticsAiEntrySource } from "@/types/content";

type AiPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: AiPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.aiMetaTitle,
    description: pageCopy.aiMetaDescription,
    path: `/${locale}/ai`,
  });
}

function readString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AiPage({ params, searchParams }: AiPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const savePromptCopy = getSaveProgressPromptCopy(locale);
  const isSignedIn = await hasAuthenticatedServerSession();
  const promptState: "guest" | "member" = isSignedIn ? "member" : "guest";
  const promptCopy = isSignedIn ? savePromptCopy.ai.member : savePromptCopy.ai.guest;
  const query = await searchParams;
  const initialQuestion = readString(query.prompt);
  const initialSource = readString(query.source);

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <section className="app-container py-12 md:py-18">
        <div className="grid gap-8 md:grid-cols-[0.88fr_1.12fr]">
          <div className="grid gap-6">
            <article className="surface-card rounded-[2rem] p-8 md:p-10">
              <span className="eyebrow">{dictionary.ai.eyebrow}</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
                {dictionary.ai.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                {dictionary.ai.description}
              </p>
            </article>

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
                        source: "ai_page_save",
                      }),
                  label: promptCopy.cta,
                  tracking: {
                    locale,
                    surface: "ai" as const,
                    state: promptState,
                    destination: "dashboard" as const,
                  },
                },
                ...(isSignedIn && promptCopy.secondaryCta
                  ? [
                      {
                        href: `/${locale}/dashboard/profile`,
                        label: promptCopy.secondaryCta,
                        variant: "secondary" as const,
                        tracking: {
                          locale,
                          surface: "ai" as const,
                          state: "member" as const,
                          destination: "profile" as const,
                        },
                      },
                    ]
                  : []),
              ]}
            />
          </div>

          <AssistantPanel
            locale={locale}
            copy={dictionary.ai}
            initialQuestion={initialQuestion}
            entrySource={isAnalyticsAiEntrySource(initialSource) ? initialSource : undefined}
          />
        </div>
      </section>
    </MarketingShell>
  );
}
