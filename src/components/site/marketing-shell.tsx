import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { MarketingAuthLink } from "@/components/site/marketing-auth-link";
import { LocaleSwitcher, LocaleSwitcherFallback } from "@/components/site/locale-switcher";
import { hasAuthenticatedServerSession } from "@/lib/auth/server-session";
import type { Dictionary } from "@/lib/i18n/copy";
import type { Locale } from "@/lib/i18n/config";
import { getAuthEntryCopy } from "@/lib/i18n/auth-entry-copy";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";

type MarketingShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

export async function MarketingShell({
  locale,
  dictionary,
  children,
}: MarketingShellProps) {
  const pageCopy = getMarketingPageCopy(locale);
  const authEntryCopy = getAuthEntryCopy(locale);
  const isSignedIn = await hasAuthenticatedServerSession();
  const navItems = [
    {
      href: `/${locale}/tools/pregnancy-calorie-calculator`,
      label: dictionary.nav.calculator,
    },
    {
      href: `/${locale}/blog`,
      label: pageCopy.blogNavLabel,
    },
    {
      href: `/${locale}/ai`,
      label: dictionary.nav.aiAssistant,
    },
    {
      href: `/${locale}/legal/medical-disclaimer`,
      label: dictionary.nav.disclaimer,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="app-container py-4">
          <div className="flex items-center justify-between gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-sm font-semibold text-white">
                ND
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-[-0.03em]">
                  {dictionary.brand.name}
                </span>
                <span className="text-xs text-muted">{dictionary.brand.tagline}</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Suspense fallback={<LocaleSwitcherFallback locale={locale} className="shrink-0" />}>
                <LocaleSwitcher locale={locale} className="shrink-0" />
              </Suspense>

              <nav className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-white hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <MarketingAuthLink
                  locale={locale}
                  initialIsSignedIn={isSignedIn}
                  signedInLabel={authEntryCopy.dashboardLabel}
                  signedOutLabel={dictionary.nav.signIn}
                  className="cta-secondary text-sm"
                />
              </nav>
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-muted shadow-border transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <MarketingAuthLink
              locale={locale}
              initialIsSignedIn={isSignedIn}
              signedInLabel={authEntryCopy.dashboardLabel}
              signedOutLabel={dictionary.nav.signIn}
              className="cta-secondary text-sm whitespace-nowrap"
            />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/5 bg-white/70 py-6 backdrop-blur-xl">
        <div className="app-container flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>{dictionary.brand.tagline}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/tools/pregnancy-calorie-calculator`}>
              {dictionary.nav.calculator}
            </Link>
            <Link href={`/${locale}/blog`}>{pageCopy.blogNavLabel}</Link>
            <Link href={`/${locale}/ai`}>{dictionary.nav.aiAssistant}</Link>
            <Link href={`/${locale}/legal/medical-disclaimer`}>
              {dictionary.nav.disclaimer}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
