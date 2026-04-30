import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { MarketingShell } from "@/components/site/marketing-shell";
import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  hasUsableAuthenticatedSession,
} from "@/lib/auth/session";
import { getDictionary } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import { getProductCopy } from "@/lib/i18n/product-copy";
import { buildMarketingMetadata } from "@/lib/seo/metadata";
import { isAnalyticsSignUpSource } from "@/types/content";

type SignInPageProps = {
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

export async function generateMetadata({
  params,
}: SignInPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const pageCopy = getMarketingPageCopy(locale);

  return buildMarketingMetadata({
    locale,
    title: pageCopy.signInMetaTitle,
    description: pageCopy.signInMetaDescription,
    path: `/${locale}/auth/sign-in`,
    noIndex: true,
  });
}

export default async function SignInPage({ params, searchParams }: SignInPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = getProductCopy(locale);
  const query = await searchParams;
  const nextValue = query.next;
  const nextPath =
    typeof nextValue === "string" && nextValue.startsWith(`/${locale}/`)
      ? nextValue
      : `/${locale}/dashboard`;
  const sourceValue = Array.isArray(query.source) ? query.source[0] : query.source;
  const signUpSource = isAnalyticsSignUpSource(sourceValue) ? sourceValue : undefined;
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const providerValue = cookieStore.get(SESSION_PROVIDER_COOKIE_NAME)?.value;
  const emailValue = cookieStore.get(SESSION_USER_EMAIL_COOKIE_NAME)?.value;

  if (hasUsableAuthenticatedSession(sessionValue, providerValue, emailValue)) {
    redirect(nextPath);
  }

  return (
    <MarketingShell locale={locale} dictionary={dictionary}>
      <section className="app-container py-12 md:py-18">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <article className="surface-card rounded-[2rem] p-8 md:p-10">
            <span className="eyebrow">{copy.auth.eyebrow}</span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
              {copy.auth.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              {copy.auth.description}
            </p>
          </article>

          <article className="surface-card rounded-[2rem] p-8 md:p-10">
            <SignInForm
              locale={locale}
              copy={copy.auth}
              nextPath={nextPath}
              signUpSource={signUpSource}
            />
          </article>
        </div>
      </section>
    </MarketingShell>
  );
}
