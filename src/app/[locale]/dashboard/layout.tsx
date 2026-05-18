import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  hasUsableAuthenticatedSession,
} from "@/lib/auth/session";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getProductCopy } from "@/lib/i18n/product-copy";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const locale = await resolveLocale(params);
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const providerValue = cookieStore.get(SESSION_PROVIDER_COOKIE_NAME)?.value;
  const emailValue = cookieStore.get(SESSION_USER_EMAIL_COOKIE_NAME)?.value;

  if (!hasUsableAuthenticatedSession(sessionValue, providerValue, emailValue)) {
    redirect(
      buildSignInHref({
        locale,
        nextPath: `/${locale}/dashboard`,
        source: "dashboard_gate",
      }),
    );
  }

  return (
    <DashboardShell locale={locale} copy={getProductCopy(locale).dashboard}>
      {children}
    </DashboardShell>
  );
}
