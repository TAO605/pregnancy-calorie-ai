"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, startTransition, useEffect, useState } from "react";

import { syncCurrentUserActivity } from "@/lib/admin/client-user-activity";
import { trackProductEvent } from "@/lib/analytics/client";
import { LocaleSwitcher, LocaleSwitcherFallback } from "@/components/site/locale-switcher";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { getClientSessionUser } from "@/lib/auth/client-session";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import {
  PROFILE_UPDATED_EVENT,
  type ProfileUpdatedDetail,
} from "@/lib/data/profile-events";
import { readUserProfile } from "@/lib/data/user-data";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { Locale } from "@/lib/i18n/config";
import { getDashboardMealsCopy } from "@/lib/i18n/dashboard-meals-copy";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import type { ProductCopy } from "@/lib/i18n/product-copy";

type DashboardShellProps = {
  locale: Locale;
  copy: ProductCopy["dashboard"];
  children: ReactNode;
};

export function DashboardShell({ locale, copy, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pageCopy = getMarketingPageCopy(locale);
  const [displayName, setDisplayName] = useState(pageCopy.guestName);
  const mealsCopy = getDashboardMealsCopy(locale);

  useEffect(() => {
    let alive = true;

    void Promise.all([
      getClientSessionUser(locale),
      readUserProfile(locale).catch(() => null),
    ])
      .then(([user, profile]) => {
        if (!alive) {
          return;
        }

        if (!user?.email) {
          router.replace(
            buildSignInHref({
              locale,
              nextPath: pathname || `/${locale}/dashboard`,
              source: "dashboard_gate",
            }),
          );
          return;
        }

        startTransition(() => {
          setDisplayName(
            profile?.displayName || user?.displayName || pageCopy.guestName,
          );
        });
      })
      .catch(() => {
        if (!alive) {
          return;
        }

        router.replace(
          buildSignInHref({
            locale,
            nextPath: pathname || `/${locale}/dashboard`,
            source: "dashboard_gate",
          }),
        );
      });

    return () => {
      alive = false;
    };
  }, [locale, pageCopy.guestName, pathname, router]);

  useEffect(() => {
    function handleProfileUpdated(event: Event) {
      const detail = (event as CustomEvent<ProfileUpdatedDetail>).detail;

      if (!detail?.displayName) {
        return;
      }

      startTransition(() => {
        setDisplayName(detail.displayName);
      });
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    if (!pathname || pathname === `/${locale}/dashboard`) {
      return;
    }

    void trackProductEvent({
      name: "dashboard_viewed",
      locale,
      metadata: {
        path: pathname,
      },
    });
    void syncCurrentUserActivity({
      locale,
      event: "dashboard_viewed",
    });
  }, [locale, pathname]);

  const items = [
    { href: `/${locale}/dashboard`, label: copy.navOverview },
    { href: `/${locale}/dashboard/profile`, label: copy.navProfile },
    { href: `/${locale}/dashboard/weight`, label: copy.navWeight },
    { href: `/${locale}/dashboard/meals`, label: mealsCopy.navLabel },
  ];

  return (
    <div className="app-container py-8 md:py-10">
      <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
        <aside className="surface-card rounded-[2rem] p-6 md:sticky md:top-24 md:self-start">
          <div className="rounded-[1.4rem] bg-[rgba(255,255,255,0.84)] p-5 shadow-border">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {isFirebaseConfigured() ? copy.firebaseReady : copy.demoMode}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">{displayName}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {copy.shellHint}
            </p>
            <div className="mt-4">
              <Suspense fallback={<LocaleSwitcherFallback locale={locale} />}>
                <LocaleSwitcher locale={locale} />
              </Suspense>
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0">
            {items.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#171717] text-white"
                      : "bg-white/72 text-muted shadow-border hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6">
            <SignOutButton locale={locale} label={copy.signOut} />
          </div>
        </aside>

        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
