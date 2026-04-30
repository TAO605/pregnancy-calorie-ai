"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getClientSessionUser } from "@/lib/auth/client-session";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import type { Locale } from "@/lib/i18n/config";

type MarketingAuthLinkProps = {
  locale: Locale;
  initialIsSignedIn: boolean;
  signedInLabel: string;
  signedOutLabel: string;
  className: string;
};

export function MarketingAuthLink({
  locale,
  initialIsSignedIn,
  signedInLabel,
  signedOutLabel,
  className,
}: MarketingAuthLinkProps) {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedIn);

  useEffect(() => {
    if (initialIsSignedIn) {
      return;
    }

    let alive = true;

    void getClientSessionUser(locale)
      .then((user) => {
        if (!alive || !user?.email) {
          return;
        }

        setIsSignedIn(true);
        router.refresh();
      })
      .catch(() => {
        // Keep the signed-out link visible if client-side restoration fails.
      });

    return () => {
      alive = false;
    };
  }, [initialIsSignedIn, locale, router]);

  return (
    <Link
      href={
        isSignedIn
          ? `/${locale}/dashboard`
          : buildSignInHref({
              locale,
              nextPath: `/${locale}/dashboard`,
              source: "marketing_nav",
            })
      }
      className={className}
    >
      {isSignedIn ? signedInLabel : signedOutLabel}
    </Link>
  );
}
