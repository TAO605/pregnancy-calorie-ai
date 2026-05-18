"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { syncUserActivitySnapshot } from "@/lib/admin/client-user-activity";
import { trackProductEvent } from "@/lib/analytics/client";
import { getClientSessionUser, signInWithGooglePopup } from "@/lib/auth/client-session";
import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
} from "@/lib/auth/session";
import { getOrCreateAnonymousSessionId, setDemoSessionUser } from "@/lib/demo/demo-store";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { ProductCopy } from "@/lib/i18n/product-copy";
import type { Locale } from "@/lib/i18n/config";
import { getMarketingPageCopy } from "@/lib/i18n/marketing-page-copy";
import type { AnalyticsSignUpSource } from "@/types/content";

type SignInFormProps = {
  locale: Locale;
  copy: ProductCopy["auth"];
  nextPath: string;
  signUpSource?: AnalyticsSignUpSource;
};

function writeSessionCookies(
  sessionEmail: string,
  provider: "demo" | "firebase",
) {
  const secureAttribute =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${SESSION_COOKIE_NAME}=authenticated; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_PROVIDER_COOKIE_NAME}=${provider}; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_USER_EMAIL_COOKIE_NAME}=${encodeURIComponent(sessionEmail)}; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
}

export function SignInForm({
  locale,
  copy,
  nextPath,
  signUpSource,
}: SignInFormProps) {
  const router = useRouter();
  const pageCopy = getMarketingPageCopy(locale);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const firebaseReady = useMemo(() => isFirebaseConfigured(), []);

  function completeSession(
    path: string,
    sessionEmail: string,
    provider: "demo" | "firebase",
  ) {
    writeSessionCookies(sessionEmail, provider);
    router.push(path || `/${locale}/dashboard`);
    router.refresh();
  }

  useEffect(() => {
    let alive = true;

    void getClientSessionUser(locale)
      .then((user) => {
        if (!alive || !user?.email) {
          return;
        }

        writeSessionCookies(user.email, user.provider);
        router.push(nextPath || `/${locale}/dashboard`);
        router.refresh();
      })
      .catch(() => {
        // Keep sign-in usable if session restoration fails.
      });

    return () => {
      alive = false;
    };
  }, [locale, nextPath, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const safeDisplayName =
        displayName.trim() || normalizedEmail.split("@")[0] || pageCopy.guestName;

      setDemoSessionUser({
        email: normalizedEmail,
        displayName: safeDisplayName,
        locale,
        provider: "demo",
        createdAt: new Date().toISOString(),
      });

      void trackProductEvent({
        name: "signup_completed",
        locale,
        metadata: {
          provider: "demo",
          source: signUpSource ?? "unknown",
          nextPath,
        },
      }).catch(() => undefined);
      void syncUserActivitySnapshot({
        anonymousSessionId: getOrCreateAnonymousSessionId(),
        email: normalizedEmail,
        displayName: safeDisplayName,
        signUpSource,
        locale,
        status: "saved_profile",
        event: "signup_completed",
      }).catch(() => undefined);

      completeSession(nextPath, normalizedEmail, "demo");
    } catch {
      setError(copy.errorLabel);
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setError("");

    try {
      const user = await signInWithGooglePopup(locale);
      void trackProductEvent({
        name: "signup_completed",
        locale,
        metadata: {
          provider: "google",
          source: signUpSource ?? "unknown",
          nextPath,
        },
      }).catch(() => undefined);
      void syncUserActivitySnapshot({
        anonymousSessionId: getOrCreateAnonymousSessionId(),
        email: user.email,
        displayName: user.displayName,
        signUpSource,
        locale,
        status: "saved_profile",
        event: "signup_completed",
      }).catch(() => undefined);
      completeSession(nextPath, user.email, "firebase");
    } catch {
      setError(copy.errorLabel);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="rounded-[1.4rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border">
        {firebaseReady ? copy.modeReady : copy.modeDemo}
      </div>

      {firebaseReady ? (
        <>
          <button
            type="button"
            className="cta-primary w-full sm:w-auto"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? copy.loadingLabel : copy.googleLabel}
          </button>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="h-px flex-1 bg-black/10" />
            <span>{copy.demoLabel}</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>
        </>
      ) : null}

      <div className="grid gap-2">
        <label className="field-label" htmlFor="displayName">
          {copy.nameLabel}
        </label>
        <input
          id="displayName"
          className="field-input"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Sophie"
        />
      </div>

      <div className="grid gap-2">
        <label className="field-label" htmlFor="email">
          {copy.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          className="field-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="hello@example.com"
          required
        />
      </div>

      <p className="text-sm text-muted">{copy.helper}</p>

      {error ? (
        <div
          className="rounded-[1.4rem] bg-[rgba(255,91,79,0.08)] px-4 py-3 text-sm text-[#a93c30] shadow-border"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <button type="submit" className="cta-primary w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? copy.loadingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
