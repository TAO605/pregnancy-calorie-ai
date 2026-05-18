"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getAdminCopy } from "@/lib/i18n/admin-copy";
import type { Locale } from "@/lib/i18n/config";

type AdminSignInFormProps = {
  locale: Locale;
  nextPath: string;
};

export function AdminSignInForm({ locale, nextPath }: AdminSignInFormProps) {
  const router = useRouter();
  const copy = getAdminCopy(locale);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/v1/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          response.status === 400
            ? copy.signInForm.requiredPasswordError
            : response.status === 401
              ? copy.signInForm.invalidPasswordError
              : (typeof data.error === "string" && data.error) || copy.signInForm.genericError,
        );
      }

      router.push(nextPath);
      router.refresh();
    } catch (signInError) {
      setError(
        signInError instanceof Error ? signInError.message : copy.signInForm.genericError,
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="rounded-[1.4rem] bg-[rgba(255,122,89,0.08)] px-4 py-3 text-sm text-[#a34c36] shadow-border">
        {copy.signInForm.hint}
      </div>

      <div className="grid gap-2">
        <label className="field-label" htmlFor="admin-password">
          {copy.signInForm.passwordLabel}
        </label>
        <input
          id="admin-password"
          type="password"
          className="field-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error ? (
        <div
          className="rounded-[1.4rem] bg-[rgba(255,91,79,0.08)] px-4 py-3 text-sm text-[#a93c30] shadow-border"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <button type="submit" className="cta-primary w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? copy.signInForm.submittingLabel : copy.signInForm.submitLabel}
      </button>
    </form>
  );
}
