"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";

import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import { syncUserActivitySnapshot } from "@/lib/admin/client-user-activity";
import { trackProductEvent } from "@/lib/analytics/client";
import {
  createWeightEntry,
  readCalculatorSessions,
  readUserProfile,
  readWeightEntries,
  writeUserProfile,
} from "@/lib/data/user-data";
import { getDashboardFormFeedbackCopy } from "@/lib/i18n/dashboard-form-feedback-copy";
import { getDashboardWeightCopy } from "@/lib/i18n/dashboard-weight-copy";
import { buildWeightAiPrompt } from "@/lib/i18n/weight-ai-prompt";
import { getWeightWeeklyReviewCopy } from "@/lib/i18n/weight-weekly-review-copy";
import { buildWeightWeeklyReviewPrompt } from "@/lib/i18n/weight-weekly-review-prompt";
import type { ProductCopy } from "@/lib/i18n/product-copy";
import type { Locale } from "@/lib/i18n/config";
import { buildWeightSummary } from "@/lib/weight/weight-summary";
import type { CalculatorSession, UserProfile, WeightEntry } from "@/types/product";

type WeightTrackerProps = {
  locale: Locale;
  copy: ProductCopy["dashboard"];
};

function formatStoredDate(
  locale: Locale,
  value: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const [year, month, day] = value.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString(locale, options);
}

export function WeightTracker({ locale, copy }: WeightTrackerProps) {
  const feedbackCopy = getDashboardFormFeedbackCopy(locale);
  const weightCopy = getDashboardWeightCopy(locale);
  const weeklyReviewCopy = getWeightWeeklyReviewCopy(locale);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [latestCalculation, setLatestCalculation] = useState<CalculatorSession | null>(null);
  const [weightKg, setWeightKg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    void Promise.all([
      readUserProfile(locale),
      readWeightEntries(locale),
      readCalculatorSessions(locale),
    ]).then(([nextProfile, nextEntries, nextCalculations]) => {
        if (!alive) {
          return;
        }

        startTransition(() => {
          setProfile(nextProfile);
          setWeightKg(
            typeof nextProfile?.currentWeightKg === "number"
              ? String(nextProfile.currentWeightKg)
              : "",
          );
          setEntries(nextEntries);
          setLatestCalculation(nextCalculations[0] ?? null);
        });
      },
    );

    return () => {
      alive = false;
    };
  }, [locale]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWeight = Number(weightKg);
    if (!Number.isFinite(nextWeight) || nextWeight <= 0) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const nextEntry = await createWeightEntry(
        {
          date,
          weightKg: nextWeight,
          note,
        },
        locale,
      );

      const profile = await readUserProfile(locale);
      const savedProfile = await writeUserProfile({
        ...profile,
        currentWeightKg: nextWeight,
      });

      void trackProductEvent({
        name: "weight_log_created",
        locale,
        metadata: {
          weightKg: nextWeight,
        },
      }).catch(() => undefined);
      void syncUserActivitySnapshot({
        email: savedProfile.email,
        displayName: savedProfile.displayName,
        locale,
        countryCode: savedProfile.countryCode,
        gestationalWeek: savedProfile.gestationalWeek,
        status: "active_tracking",
        event: "weight_log_created",
      }).catch(() => undefined);

      setEntries((current) => [nextEntry, ...current.filter((item) => item.id !== nextEntry.id)]);
      setProfile(savedProfile);
      setNote("");
      setMessage(feedbackCopy.weightSaved);
    } catch {
      setError(feedbackCopy.genericSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  const weightSummary = useMemo(
    () =>
      buildWeightSummary({
        entries,
        currentWeightKg: profile?.currentWeightKg,
        prePregnancyWeightKg: profile?.prePregnancyWeightKg,
        gestationalWeek: profile?.gestationalWeek,
      }),
    [entries, profile?.currentWeightKg, profile?.gestationalWeek, profile?.prePregnancyWeightKg],
  );
  const recentAsc = useMemo(() => [...entries].slice(0, 8).reverse(), [entries]);
  const sevenDayWindowStart = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return start.toISOString().slice(0, 10);
  }, []);
  const recentEntriesLast7 = useMemo(
    () => entries.filter((entry) => entry.date >= sevenDayWindowStart),
    [entries, sevenDayWindowStart],
  );
  const recentEntriesLast7Asc = useMemo(
    () => [...recentEntriesLast7].sort((left, right) => left.date.localeCompare(right.date)),
    [recentEntriesLast7],
  );
  const trackedEntriesLast7 = recentEntriesLast7Asc.length;
  const earliestEntryLast7 = recentEntriesLast7Asc[0] ?? null;
  const latestEntryLast7 = recentEntriesLast7Asc.at(-1) ?? null;
  const weeklyDeltaKg =
    earliestEntryLast7 && latestEntryLast7 && trackedEntriesLast7 > 1
      ? Math.round((latestEntryLast7.weightKg - earliestEntryLast7.weightKg) * 10) / 10
      : null;
  const weeklyMinKg = useMemo(() => {
    if (recentEntriesLast7Asc.length === 0) {
      return null;
    }

    return Math.min(...recentEntriesLast7Asc.map((entry) => entry.weightKg));
  }, [recentEntriesLast7Asc]);
  const weeklyMaxKg = useMemo(() => {
    if (recentEntriesLast7Asc.length === 0) {
      return null;
    }

    return Math.max(...recentEntriesLast7Asc.map((entry) => entry.weightKg));
  }, [recentEntriesLast7Asc]);
  const minWeight = useMemo(
    () => Math.min(...recentAsc.map((entry) => entry.weightKg), Number(weightKg) || 0),
    [recentAsc, weightKg],
  );
  const maxWeight = useMemo(
    () => Math.max(...recentAsc.map((entry) => entry.weightKg), Number(weightKg) || 0),
    [recentAsc, weightKg],
  );
  const weightAiHref = weightSummary
    ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
        buildWeightAiPrompt(locale, {
          summary: weightSummary,
          targetCalories: latestCalculation?.output.recommendedCalories ?? null,
        }),
      )}`
    : `/${locale}/ai`;
  const formattedLastLoggedDate = weightSummary?.lastLoggedDate
    ? formatStoredDate(locale, weightSummary.lastLoggedDate, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "--";
  const formattedWeeklyLastLoggedDate = latestEntryLast7
    ? formatStoredDate(locale, latestEntryLast7.date, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const weeklyWeightAiHref =
    trackedEntriesLast7 > 0 || latestCalculation !== null
      ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
          buildWeightWeeklyReviewPrompt(locale, {
            targetCalories: latestCalculation?.output.recommendedCalories ?? null,
            trackedEntries: trackedEntriesLast7,
            latestWeightKg: latestEntryLast7?.weightKg ?? null,
            weeklyDeltaKg,
            weeklyMinKg,
            weeklyMaxKg,
            gestationalWeek: profile?.gestationalWeek ?? null,
            guidelineSource: latestCalculation?.output.guidelineDisplayName ?? null,
          }),
        )}`
      : `/${locale}/ai`;
  const weightSummaryAiHref = withAiEntrySource(
    weightAiHref,
    "dashboard_weight_summary",
  );
  const weightWeeklyReviewAiHref = withAiEntrySource(
    weeklyWeightAiHref,
    "dashboard_weight_weekly_review",
  );

  function handleAiClick(
    source: "dashboard_weight_summary" | "dashboard_weight_weekly_review",
  ) {
    trackAiEntryClick({
      locale,
      source,
      analyticsEventName: "weight_ai_clicked",
      countryCode: profile?.countryCode,
      gestationalWeek: profile?.gestationalWeek,
      lastRecommendedCalories: latestCalculation?.output.recommendedCalories,
      metadata: {
        hasSummary: Boolean(weightSummary),
        hasCalorieTarget: Boolean(latestCalculation),
        recentWeightCount: weightSummary?.recentWeightCount ?? 0,
        trackedEntriesLast7,
      },
    });
  }

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <div className="mb-8">
          <span className="eyebrow">{copy.weightTitle}</span>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
            {copy.weightDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-[0.8fr_0.8fr_1.4fr]">
            <div className="grid gap-2">
              <label className="field-label" htmlFor="weight">
                {copy.weightFields.weightKg}
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                className="field-input"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="field-label" htmlFor="date">
                {copy.weightFields.date}
              </label>
              <input
                id="date"
                type="date"
                className="field-input"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="field-label" htmlFor="note">
                {copy.weightFields.note}
              </label>
              <input
                id="note"
                className="field-input"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={copy.weightFields.notePlaceholder}
              />
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
            {isSaving ? feedbackCopy.saving : copy.weightFields.save}
          </button>
        </form>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.06em]">
              {weightCopy.summaryTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-muted">
              {weightCopy.summaryDescription}
            </p>
          </div>
          <Link
            href={weightSummaryAiHref}
            className="cta-primary text-sm"
            onClick={() => handleAiClick("dashboard_weight_summary")}
          >
            {weightCopy.aiCta}
          </Link>
        </div>

        {!weightSummary ? (
          <div className="mt-6 rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm leading-7 text-muted">{weightCopy.noSummaryHint}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">{weightCopy.currentWeightLabel}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {weightSummary.currentWeightKg} kg
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {weightCopy.entryCountLabel}: {weightSummary.recentWeightCount}
              </p>
            </article>

            <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">{weightCopy.sinceBaselineLabel}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {typeof weightSummary.prePregnancyDeltaKg === "number"
                  ? `${weightSummary.prePregnancyDeltaKg > 0 ? "+" : ""}${weightSummary.prePregnancyDeltaKg} kg`
                  : "--"}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {typeof weightSummary.prePregnancyWeightKg === "number"
                  ? `${weightCopy.baselineWeightLabel}: ${weightSummary.prePregnancyWeightKg} kg`
                  : weightCopy.noTrendHint}
              </p>
            </article>

            <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm font-medium text-muted">{weightCopy.recentTrendLabel}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {typeof weightSummary.recentTrendDeltaKg === "number"
                  ? `${weightSummary.recentTrendDeltaKg > 0 ? "+" : ""}${weightSummary.recentTrendDeltaKg} kg`
                  : "--"}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {typeof weightSummary.latestEntryDeltaKg === "number"
                  ? `${weightCopy.latestChangeLabel}: ${weightSummary.latestEntryDeltaKg > 0 ? "+" : ""}${weightSummary.latestEntryDeltaKg} kg`
                  : weightCopy.noTrendHint}
              </p>
            </article>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[1.3rem] bg-[rgba(10,114,239,0.06)] p-5 shadow-border">
            <p className="text-sm font-medium text-muted">{weightCopy.aiTitle}</p>
            <p className="mt-3 text-sm leading-7 text-muted">{weightCopy.aiDescription}</p>
          </article>
          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">{weightCopy.targetLabel}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
              {latestCalculation ? `${latestCalculation.output.recommendedCalories} kcal` : "--"}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {latestCalculation
                ? `${weightCopy.lastLoggedLabel}: ${formattedLastLoggedDate}`
                : weightCopy.noTargetHint}
            </p>
          </article>
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{weeklyReviewCopy.eyebrow}</span>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
              {weeklyReviewCopy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {weeklyReviewCopy.description}
            </p>
          </div>
          <Link
            href={weightWeeklyReviewAiHref}
            className="cta-primary text-sm"
            onClick={() => handleAiClick("dashboard_weight_weekly_review")}
          >
            {weeklyReviewCopy.aiCta}
          </Link>
        </div>

        <article className="mt-8 rounded-[1.4rem] bg-[rgba(10,114,239,0.06)] p-6 shadow-border">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {weeklyReviewCopy.summaryTitle}
          </p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted">
            {weeklyReviewCopy.formatSummaryBody({
              trackedEntries: trackedEntriesLast7,
              latestWeightKg: latestEntryLast7?.weightKg ?? null,
              weeklyDeltaKg,
              weeklyMinKg,
              weeklyMaxKg,
              targetCalories: latestCalculation?.output.recommendedCalories ?? null,
              gestationalWeek: profile?.gestationalWeek ?? null,
            })}
          </p>
        </article>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.loggingTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {trackedEntriesLast7}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatLoggingBody(
                trackedEntriesLast7,
                formattedWeeklyLastLoggedDate,
              )}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.changeTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {weeklyDeltaKg === null ? "--" : `${weeklyDeltaKg > 0 ? "+" : ""}${weeklyDeltaKg} kg`}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatChangeBody(
                latestEntryLast7?.weightKg ?? null,
                weeklyDeltaKg,
              )}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.rangeTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {weeklyMinKg === null || weeklyMaxKg === null
                ? "--"
                : weeklyMinKg === weeklyMaxKg
                  ? `${weeklyMinKg} kg`
                  : `${weeklyMinKg}-${weeklyMaxKg} kg`}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatRangeBody(weeklyMinKg, weeklyMaxKg)}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[0.92fr_1.08fr]">
        <article
          id="weight-log-form"
          className="surface-card rounded-[1.8rem] p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.weightFields.trendTitle}
          </p>
          <div className="mt-8 flex min-h-52 items-end gap-3">
            {recentAsc.length === 0 ? (
              <p className="text-sm text-muted">{copy.weightFields.noEntries}</p>
            ) : (
              recentAsc.map((entry) => {
                const ratio =
                  maxWeight === minWeight
                    ? 1
                    : (entry.weightKg - minWeight) / (maxWeight - minWeight);
                const height = 64 + ratio * 120;

                return (
                  <div key={entry.id} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-t-[1rem] rounded-b-[0.7rem] bg-[linear-gradient(180deg,#0a72ef_0%,#6fa8ff_100%)] shadow-border"
                      style={{ height }}
                    />
                    <div className="text-center">
                      <p className="text-sm font-semibold tracking-[-0.03em]">
                        {entry.weightKg}
                      </p>
                      <p className="text-xs text-muted">
                        {formatStoredDate(locale, entry.date, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.weightFields.entriesTitle}
          </p>
          <div className="mt-6 grid gap-3">
            {entries.length === 0 ? (
              <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                <p className="text-sm text-muted">{copy.weightFields.noEntries}</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-4 rounded-[1.2rem] bg-white/88 p-4 shadow-border"
                >
                  <div>
                    <p className="text-base font-semibold tracking-[-0.03em]">
                      {entry.weightKg} kg
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatStoredDate(locale, entry.date, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="max-w-[14rem] text-right text-sm text-muted">
                    {entry.note || copy.weightFields.noNote}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
