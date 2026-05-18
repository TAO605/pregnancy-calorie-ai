"use client";

import { startTransition, useEffect, useState } from "react";

import { syncUserActivitySnapshot } from "@/lib/admin/client-user-activity";
import { getClientSessionUser } from "@/lib/auth/client-session";
import { PROFILE_UPDATED_EVENT } from "@/lib/data/profile-events";
import { readUserProfile, writeUserProfile } from "@/lib/data/user-data";
import {
  dietPreferenceOptionIds,
  getDietPreferenceLabel,
  getProfilePreferencesCopy,
} from "@/lib/i18n/profile-preferences-copy";
import { getDashboardFormFeedbackCopy } from "@/lib/i18n/dashboard-form-feedback-copy";
import { getProfileEditorLockCopy } from "@/lib/i18n/profile-editor-lock-copy";
import type { ProductCopy } from "@/lib/i18n/product-copy";
import type { Locale } from "@/lib/i18n/config";
import type { ActivityLevel, UserProfile } from "@/types/product";

type ProfileEditorProps = {
  locale: Locale;
  copy: ProductCopy["dashboard"];
};

export function ProfileEditor({ locale, copy }: ProfileEditorProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const feedbackCopy = getDashboardFormFeedbackCopy(locale);
  const preferencesCopy = getProfilePreferencesCopy(locale);
  const emailLockCopy = getProfileEditorLockCopy(locale);

  useEffect(() => {
    let alive = true;

    void Promise.all([readUserProfile(locale), getClientSessionUser(locale)]).then(
      ([nextProfile, sessionUser]) => {
        if (!alive) {
          return;
        }

        startTransition(() => {
          setProfile(nextProfile);
          setSessionEmail(sessionUser?.email ?? "");
        });
      },
    );

    return () => {
      alive = false;
    };
  }, [locale]);

  function update<Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  }

  function toggleDietPreference(value: string) {
    setProfile((current) => {
      if (!current) {
        return current;
      }

      const exists = current.dietPreferences.includes(value);

      return {
        ...current,
        dietPreferences: exists
          ? current.dietPreferences.filter((item) => item !== value)
          : [...current.dietPreferences, value],
      };
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const savedProfile = await writeUserProfile(profile);

      void syncUserActivitySnapshot({
        email: savedProfile.email,
        displayName: savedProfile.displayName,
        locale,
        countryCode: savedProfile.countryCode,
        gestationalWeek: savedProfile.gestationalWeek,
        status: "saved_profile",
        event: "profile_saved",
      }).catch(() => undefined);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(PROFILE_UPDATED_EVENT, {
            detail: {
              displayName: savedProfile.displayName,
            },
          }),
        );
      }

      setProfile(savedProfile);
      setMessage(copy.profileSaved);
    } catch {
      setError(feedbackCopy.genericSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  if (!profile) {
    return null;
  }

  const isEmailManaged = Boolean(sessionEmail);
  const displayedEmail = isEmailManaged ? sessionEmail : profile.email;

  return (
    <section className="surface-card rounded-[2rem] p-8 md:p-10">
      <div className="mb-8">
        <span className="eyebrow">{copy.profileTitle}</span>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
          {copy.profileDescription}
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="field-label" htmlFor="displayName">
              {copy.profileFields.displayName}
            </label>
            <input
              id="displayName"
              className="field-input"
              value={profile.displayName}
              onChange={(event) => update("displayName", event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="email">
              {copy.profileFields.email}
            </label>
            <input
              id="email"
              type="email"
              className={`field-input ${isEmailManaged ? "cursor-not-allowed bg-black/[0.03] text-muted" : ""}`}
              value={displayedEmail}
              onChange={
                isEmailManaged ? undefined : (event) => update("email", event.target.value)
              }
              readOnly={isEmailManaged}
              aria-readonly={isEmailManaged}
              aria-describedby={isEmailManaged ? "profile-email-note" : undefined}
            />
            {isEmailManaged ? (
              <p id="profile-email-note" className="text-sm text-muted">
                {emailLockCopy}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="field-label" htmlFor="age">
              {copy.profileFields.age}
            </label>
            <input
              id="age"
              type="number"
              className="field-input"
              value={profile.age}
              onChange={(event) => update("age", Number(event.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="heightCm">
              {copy.profileFields.heightCm}
            </label>
            <input
              id="heightCm"
              type="number"
              className="field-input"
              value={profile.heightCm}
              onChange={(event) => update("heightCm", Number(event.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="gestationalWeek">
              {copy.profileFields.gestationalWeek}
            </label>
            <input
              id="gestationalWeek"
              type="number"
              className="field-input"
              value={profile.gestationalWeek}
              onChange={(event) => update("gestationalWeek", Number(event.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="field-label" htmlFor="prePregnancyWeightKg">
              {copy.profileFields.prePregnancyWeightKg}
            </label>
            <input
              id="prePregnancyWeightKg"
              type="number"
              step="0.1"
              className="field-input"
              value={profile.prePregnancyWeightKg}
              onChange={(event) => update("prePregnancyWeightKg", Number(event.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="currentWeightKg">
              {copy.profileFields.currentWeightKg}
            </label>
            <input
              id="currentWeightKg"
              type="number"
              step="0.1"
              className="field-input"
              value={profile.currentWeightKg}
              onChange={(event) => update("currentWeightKg", Number(event.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="countryCode">
              {copy.profileFields.countryCode}
            </label>
            <input
              id="countryCode"
              className="field-input"
              value={profile.countryCode}
              onChange={(event) => update("countryCode", event.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="field-label" htmlFor="pregnancyType">
              {copy.profileFields.pregnancyType}
            </label>
            <select
              id="pregnancyType"
              className="field-input"
              value={profile.pregnancyType}
              onChange={(event) =>
                update("pregnancyType", event.target.value as UserProfile["pregnancyType"])
              }
            >
              <option value="singleton">{copy.profileFields.singleton}</option>
              <option value="multiple">{copy.profileFields.multiple}</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="field-label" htmlFor="activityLevel">
              {copy.profileFields.activityLevel}
            </label>
            <select
              id="activityLevel"
              className="field-input"
              value={profile.activityLevel}
              onChange={(event) =>
                update("activityLevel", event.target.value as ActivityLevel)
              }
            >
              <option value="sedentary">{copy.profileFields.sedentary}</option>
              <option value="light">{copy.profileFields.light}</option>
              <option value="moderate">{copy.profileFields.moderate}</option>
              <option value="active">{copy.profileFields.active}</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="field-label">{preferencesCopy.sectionTitle}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {preferencesCopy.sectionDescription}
            </p>
            <p className="mt-2 text-sm text-muted">{preferencesCopy.helper}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dietPreferenceOptionIds.map((option) => {
              const checked = profile.dietPreferences.includes(option);

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-[1.2rem] p-4 shadow-border transition ${
                    checked ? "bg-[rgba(10,114,239,0.08)]" : "bg-white/88"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={checked}
                    onChange={() => toggleDietPreference(option)}
                  />
                  <span className="text-sm font-medium leading-6 text-foreground">
                    {getDietPreferenceLabel(locale, option)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {message ? (
          <div
            className="rounded-[1.2rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border"
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            className="rounded-[1.2rem] bg-[rgba(255,91,79,0.08)] px-4 py-3 text-sm text-[#a93c30] shadow-border"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <button type="submit" className="cta-primary w-full sm:w-auto" disabled={isSaving}>
          {isSaving ? feedbackCopy.saving : copy.profileFields.save}
        </button>
      </form>
    </section>
  );
}
