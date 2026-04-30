"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";

import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import { syncUserActivitySnapshot } from "@/lib/admin/client-user-activity";
import { trackProductEvent } from "@/lib/analytics/client";
import {
  createMealEntry,
  readCalculatorSessions,
  readMealEntries,
  readUserProfile,
} from "@/lib/data/user-data";
import { buildMealsAiPrompt } from "@/lib/i18n/contextual-ai-prompts";
import { getDashboardFormFeedbackCopy } from "@/lib/i18n/dashboard-form-feedback-copy";
import { getDashboardMealsCopy } from "@/lib/i18n/dashboard-meals-copy";
import { getMealWeeklyReviewCopy } from "@/lib/i18n/meal-weekly-review-copy";
import { buildMealWeeklyReviewPrompt } from "@/lib/i18n/meal-weekly-review-prompt";
import type { Locale } from "@/lib/i18n/config";
import { formatDietPreferenceList } from "@/lib/i18n/profile-preferences-copy";
import {
  buildMealIdeasTitle,
  getMealIdeasPanelCopy,
  suggestMealIdeas,
} from "@/lib/meals/suggest-meal-ideas";
import type {
  CalculatorSession,
  MealEntry,
  MealItem,
  MealType,
  UserProfile,
} from "@/types/product";

type MealTrackerProps = {
  locale: Locale;
};

type DraftMealItem = {
  name: string;
  estimatedCalories: string;
};

const mealPlanRatios: Array<{ mealType: MealType; ratio: number }> = [
  { mealType: "breakfast", ratio: 0.25 },
  { mealType: "lunch", ratio: 0.3 },
  { mealType: "dinner", ratio: 0.3 },
  { mealType: "snack", ratio: 0.15 },
];

const defaultDraftItem = (): DraftMealItem => ({
  name: "",
  estimatedCalories: "",
});

function roundCalories(value: number) {
  return Math.round(value);
}

export function MealTracker({ locale }: MealTrackerProps) {
  const copy = getDashboardMealsCopy(locale);
  const feedbackCopy = getDashboardFormFeedbackCopy(locale);
  const mealIdeasCopy = getMealIdeasPanelCopy(locale);
  const weeklyReviewCopy = getMealWeeklyReviewCopy(locale);
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [latestCalculation, setLatestCalculation] = useState<CalculatorSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [items, setItems] = useState<DraftMealItem[]>([defaultDraftItem()]);
  const [showValidation, setShowValidation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    void Promise.all([
      readMealEntries(locale),
      readCalculatorSessions(locale),
      readUserProfile(locale),
    ]).then(([nextEntries, nextCalculations, nextProfile]) => {
        if (!alive) {
          return;
        }

        startTransition(() => {
          setEntries(nextEntries);
          setLatestCalculation(nextCalculations[0] ?? null);
          setProfile(nextProfile);
        });
      },
    );

    return () => {
      alive = false;
    };
  }, [locale]);

  const normalizedItems = useMemo(
    () =>
      items.flatMap((item): MealItem[] => {
        const name = item.name.trim();
        const estimatedCalories = Number(item.estimatedCalories);

        if (!name || !Number.isFinite(estimatedCalories) || estimatedCalories <= 0) {
          return [];
        }

        return [
          {
            name,
            estimatedCalories: roundCalories(estimatedCalories),
          },
        ];
      }),
    [items],
  );

  const draftTotal = useMemo(
    () => normalizedItems.reduce((sum, item) => sum + item.estimatedCalories, 0),
    [normalizedItems],
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = useMemo(
    () => entries.filter((entry) => entry.date === today),
    [entries, today],
  );
  const todayCalories = useMemo(
    () => todayEntries.reduce((sum, entry) => sum + entry.totalCalories, 0),
    [todayEntries],
  );
  const todayMealTypeTotals = useMemo<Record<MealType, number>>(
    () =>
      todayEntries.reduce<Record<MealType, number>>(
        (totals, entry) => ({
          ...totals,
          [entry.mealType]: totals[entry.mealType] + entry.totalCalories,
        }),
        {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          snack: 0,
        },
      ),
    [todayEntries],
  );
  const averageMealCalories = useMemo(() => {
    if (entries.length === 0) {
      return 0;
    }

    return roundCalories(
      entries.reduce((sum, entry) => sum + entry.totalCalories, 0) / entries.length,
    );
  }, [entries]);
  const trackedDays = useMemo(() => new Set(entries.map((entry) => entry.date)).size, [entries]);
  const todayTargetCalories = latestCalculation?.output.recommendedCalories ?? null;
  const remainingCalories =
    todayTargetCalories === null ? null : todayTargetCalories - todayCalories;
  const mealsAiHref =
    todayTargetCalories !== null && remainingCalories !== null
      ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
          buildMealsAiPrompt(locale, {
            targetCalories: todayTargetCalories,
            loggedCalories: todayCalories,
            remainingCalories: Math.max(remainingCalories, 0),
          }),
        )}`
      : `/${locale}/ai`;

  const mealPlanSlots = useMemo(
    () =>
      mealPlanRatios.map(({ mealType: plannedMealType, ratio }) => {
        const targetCalories =
          todayTargetCalories === null ? null : roundCalories(todayTargetCalories * ratio);
        const loggedCalories = todayMealTypeTotals[plannedMealType];
        const delta = targetCalories === null ? null : targetCalories - loggedCalories;

        return {
          mealType: plannedMealType,
          ratio,
          targetCalories,
          loggedCalories,
          delta,
        };
      }),
    [todayMealTypeTotals, todayTargetCalories],
  );
  const selectedMealTarget =
    mealPlanSlots.find((slot) => slot.mealType === mealType)?.targetCalories ?? null;
  const activeDietPreferences = useMemo(
    () => profile?.dietPreferences ?? [],
    [profile?.dietPreferences],
  );
  const sevenDayWindowStart = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return start.toISOString().slice(0, 10);
  }, []);
  const recentEntriesLast7 = useMemo(
    () => entries.filter((entry) => entry.date >= sevenDayWindowStart),
    [entries, sevenDayWindowStart],
  );
  const trackedMealDaysLast7 = useMemo(
    () => new Set(recentEntriesLast7.map((entry) => entry.date)).size,
    [recentEntriesLast7],
  );
  const totalEntriesLast7 = recentEntriesLast7.length;
  const averageLoggedCaloriesLast7 = useMemo(() => {
    if (trackedMealDaysLast7 === 0) {
      return null;
    }

    return roundCalories(
      recentEntriesLast7.reduce((sum, entry) => sum + entry.totalCalories, 0) /
        trackedMealDaysLast7,
    );
  }, [recentEntriesLast7, trackedMealDaysLast7]);
  const topMealTypeLast7 = useMemo<MealType | null>(() => {
    if (recentEntriesLast7.length === 0) {
      return null;
    }

    const counts: Record<MealType, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };

    for (const entry of recentEntriesLast7) {
      counts[entry.mealType] += 1;
    }

    let winner: MealType | null = null;
    let winnerCount = 0;

    for (const candidate of Object.keys(counts) as MealType[]) {
      if (counts[candidate] > winnerCount) {
        winner = candidate;
        winnerCount = counts[candidate];
      }
    }

    return winner;
  }, [recentEntriesLast7]);
  const mealIdeas = useMemo(
    () =>
      suggestMealIdeas({
        locale,
        mealType,
        targetCalories: selectedMealTarget ?? undefined,
        dietPreferences: activeDietPreferences,
      }),
    [activeDietPreferences, locale, mealType, selectedMealTarget],
  );
  const preferenceSummary =
    activeDietPreferences.length > 0
      ? formatDietPreferenceList(locale, activeDietPreferences)
      : mealIdeasCopy.generalMode;
  const topMealTypeLabelLast7 = topMealTypeLast7 ? getMealTypeLabel(topMealTypeLast7) : null;
  const weeklyMealsAiHref =
    todayTargetCalories !== null || totalEntriesLast7 > 0
      ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
          buildMealWeeklyReviewPrompt(locale, {
            targetCalories: todayTargetCalories,
            trackedDays: trackedMealDaysLast7,
            averageLoggedCalories: averageLoggedCaloriesLast7,
            topMealTypeLabel: topMealTypeLabelLast7,
            totalEntries: totalEntriesLast7,
            gestationalWeek: profile?.gestationalWeek ?? null,
            guidelineSource: latestCalculation?.output.guidelineDisplayName ?? null,
          }),
        )}`
      : `/${locale}/ai`;
  const mealsPlanAiHref = withAiEntrySource(mealsAiHref, "dashboard_meals_plan");
  const mealsWeeklyReviewAiHref = withAiEntrySource(
    weeklyMealsAiHref,
    "dashboard_meals_weekly_review",
  );

  const groupedEntries = useMemo(() => {
    const groups = new Map<
      string,
      {
        date: string;
        totalCalories: number;
        entries: MealEntry[];
      }
    >();

    for (const entry of entries) {
      const current = groups.get(entry.date);

      if (current) {
        current.entries.push(entry);
        current.totalCalories += entry.totalCalories;
      } else {
        groups.set(entry.date, {
          date: entry.date,
          totalCalories: entry.totalCalories,
          entries: [entry],
        });
      }
    }

    return Array.from(groups.values());
  }, [entries]);

  function handleAiEntryClick(
    source: "dashboard_meals_plan" | "dashboard_meals_weekly_review",
  ) {
    trackAiEntryClick({
      locale,
      source,
      countryCode: profile?.countryCode,
      gestationalWeek: profile?.gestationalWeek,
      lastRecommendedCalories: todayTargetCalories ?? undefined,
      metadata: {
        trackedDays,
        trackedMealDaysLast7,
        totalEntriesLast7,
        todayCalories,
      },
    });
  }

  function updateItem(index: number, key: keyof DraftMealItem, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  }

  function addItem() {
    setItems((current) => [...current, defaultDraftItem()]);
  }

  function removeItem(index: number) {
    setItems((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function getMealTypeLabel(value: MealType) {
    switch (value) {
      case "breakfast":
        return copy.form.breakfast;
      case "lunch":
        return copy.form.lunch;
      case "dinner":
        return copy.form.dinner;
      case "snack":
        return copy.form.snack;
      default:
        return value;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (normalizedItems.length === 0) {
      setShowValidation(true);
      setMessage("");
      setError("");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const nextEntry = await createMealEntry(
        {
          date,
          mealType,
          items: normalizedItems,
          totalCalories: draftTotal,
          source: "manual",
        },
        locale,
      );

      void trackProductEvent({
        name: "meal_log_created",
        locale,
        metadata: {
          mealType,
          totalCalories: nextEntry.totalCalories,
          itemCount: nextEntry.items.length,
        },
      }).catch(() => undefined);
      void readUserProfile(locale)
        .then((profile) =>
          syncUserActivitySnapshot({
            email: profile.email,
            displayName: profile.displayName,
            locale,
            countryCode: profile.countryCode,
            gestationalWeek: profile.gestationalWeek,
            status: "active_tracking",
            event: "meal_log_created",
          }),
        )
        .catch(() => undefined);

      setEntries((current) => [nextEntry, ...current.filter((entry) => entry.id !== nextEntry.id)]);
      setItems([defaultDraftItem()]);
      setMealType("breakfast");
      setShowValidation(false);
      setMessage(feedbackCopy.mealSaved);
    } catch {
      setError(feedbackCopy.genericSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.pageEyebrow}</span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.pageTitle}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{copy.pageDescription}</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.summary.dailyTarget}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {todayTargetCalories === null ? "--" : todayTargetCalories}
          </p>
          <p className="mt-3 text-sm text-muted">
            {todayTargetCalories === null
              ? copy.summary.targetMissingHint
              : `${latestCalculation?.output.guidelineDisplayName ?? "--"} / kcal`}
          </p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.summary.loggedToday}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">{todayCalories}</p>
          <p className="mt-3 text-sm text-muted">kcal</p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">
            {remainingCalories !== null && remainingCalories < 0
              ? copy.summary.overTarget
              : copy.summary.remaining}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {remainingCalories === null ? "--" : Math.abs(remainingCalories)}
          </p>
          <p className="mt-3 text-sm text-muted">
            {remainingCalories === null ? copy.summary.targetMissingHint : "kcal"}
          </p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.summary.mealsSaved}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">{entries.length}</p>
          <p className="mt-3 text-sm text-muted">{copy.sections.recentEntries}</p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.summary.averageMeal}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">{averageMealCalories}</p>
          <p className="mt-3 text-sm text-muted">kcal</p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.summary.trackedDays}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">{trackedDays}</p>
          <p className="mt-3 text-sm text-muted">{copy.sections.daySummary}</p>
        </article>
      </section>

      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.06em]">{copy.plan.title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
              {copy.plan.description}
            </p>
          </div>
          {todayTargetCalories === null ? (
            <Link
              href={`/${locale}/tools/pregnancy-calorie-calculator`}
              className="cta-primary text-sm"
            >
              {copy.plan.calculatorCta}
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3">
              <div className="rounded-[1.2rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border">
                {copy.summary.dailyTarget}: {todayTargetCalories} kcal
              </div>
              <Link
                href={mealsPlanAiHref}
                className="cta-primary text-sm"
                onClick={() => handleAiEntryClick("dashboard_meals_plan")}
              >
                {copy.plan.aiCta}
              </Link>
            </div>
          )}
        </div>

        {todayTargetCalories === null ? (
          <div className="mt-8 rounded-[1.4rem] bg-white/88 p-5 shadow-border">
            <p className="text-base font-semibold tracking-[-0.03em]">
              {copy.plan.noTargetTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">{copy.plan.noTargetBody}</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mealPlanSlots.map((slot) => (
              <article
                key={slot.mealType}
                className="rounded-[1.4rem] bg-white/88 p-5 shadow-border"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold tracking-[-0.03em]">
                    {getMealTypeLabel(slot.mealType)}
                  </p>
                  <span className="rounded-full bg-[#f4f1eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {Math.round(slot.ratio * 100)}%
                  </span>
                </div>
                <p className="mt-5 text-3xl font-semibold tracking-[-0.06em]">
                  {slot.targetCalories} kcal
                </p>
                <p className="mt-2 text-sm text-muted">{copy.plan.targetLabel}</p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[1.1rem] bg-[rgba(23,23,23,0.03)] p-3 shadow-border">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {copy.plan.loggedLabel}
                    </p>
                    <p className="mt-2 text-sm font-semibold tracking-[-0.02em]">
                      {slot.loggedCalories} kcal
                    </p>
                  </div>
                  <div
                    className={`rounded-[1.1rem] p-3 shadow-border ${
                      slot.delta !== null && slot.delta < 0
                        ? "bg-[rgba(255,122,89,0.09)]"
                        : "bg-[rgba(10,114,239,0.06)]"
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                        slot.delta !== null && slot.delta < 0 ? "text-[#a34c36]" : "text-muted"
                      }`}
                    >
                      {slot.delta !== null && slot.delta < 0
                        ? copy.plan.overLabel
                        : copy.plan.remainingLabel}
                    </p>
                    <p className="mt-2 text-sm font-semibold tracking-[-0.02em]">
                      {slot.delta === null ? "--" : Math.abs(slot.delta)} kcal
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
            href={mealsWeeklyReviewAiHref}
            className="cta-primary text-sm"
            onClick={() => handleAiEntryClick("dashboard_meals_weekly_review")}
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
              trackedDays: trackedMealDaysLast7,
              targetCalories: todayTargetCalories,
              averageLoggedCalories: averageLoggedCaloriesLast7,
              topMealTypeLabel: topMealTypeLabelLast7,
              totalEntries: totalEntriesLast7,
              gestationalWeek: profile?.gestationalWeek ?? null,
            })}
          </p>
        </article>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.coverageTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {trackedMealDaysLast7}/7
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatCoverageBody(
                trackedMealDaysLast7,
                totalEntriesLast7,
              )}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.averageTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {averageLoggedCaloriesLast7 === null ? "--" : `${averageLoggedCaloriesLast7} kcal`}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatAverageBody(
                averageLoggedCaloriesLast7,
                todayTargetCalories,
              )}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyReviewCopy.cards.patternTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {topMealTypeLabelLast7 ?? "--"}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyReviewCopy.cards.formatPatternBody(
                topMealTypeLabelLast7,
                totalEntriesLast7,
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article
          id="meal-log-form"
          className="surface-card rounded-[2rem] p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-2">
                <label className="field-label" htmlFor="meal-date">
                  {copy.form.date}
                </label>
                <input
                  id="meal-date"
                  type="date"
                  className="field-input"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="field-label" htmlFor="meal-type">
                  {copy.form.mealType}
                </label>
                <select
                  id="meal-type"
                  className="field-input"
                  value={mealType}
                  onChange={(event) => setMealType(event.target.value as MealType)}
                >
                  <option value="breakfast">{copy.form.breakfast}</option>
                  <option value="lunch">{copy.form.lunch}</option>
                  <option value="dinner">{copy.form.dinner}</option>
                  <option value="snack">{copy.form.snack}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {items.map((item, index) => (
                <div
                  key={`${index}-${item.name}`}
                  className="grid gap-4 rounded-[1.4rem] bg-white/84 p-4 shadow-border md:grid-cols-[1.3fr_0.8fr_auto]"
                >
                  <div className="grid gap-2">
                    <label className="field-label" htmlFor={`meal-item-name-${index}`}>
                      {copy.form.itemName}
                    </label>
                    <input
                      id={`meal-item-name-${index}`}
                      className="field-input"
                      value={item.name}
                      placeholder={copy.form.itemNamePlaceholder}
                      onChange={(event) => updateItem(index, "name", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="field-label" htmlFor={`meal-item-calories-${index}`}>
                      {copy.form.itemCalories}
                    </label>
                    <input
                      id={`meal-item-calories-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      className="field-input"
                      value={item.estimatedCalories}
                      placeholder={copy.form.itemCaloriesPlaceholder}
                      onChange={(event) =>
                        updateItem(index, "estimatedCalories", event.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="cta-secondary w-full text-sm md:w-auto"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      {copy.form.removeItem}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button type="button" className="cta-secondary text-sm" onClick={addItem}>
                {copy.form.addItem}
              </button>
              <div className="rounded-[1.2rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border">
                {copy.form.draftTotal}: {draftTotal} kcal
              </div>
            </div>

            {showValidation ? (
              <div className="rounded-[1.2rem] bg-[rgba(255,91,79,0.08)] px-4 py-3 text-sm text-[#a93c30] shadow-border">
                {copy.form.emptyItemHint}
              </div>
            ) : null}

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
              {isSaving ? feedbackCopy.saving : copy.form.save}
            </button>
          </form>
        </article>

        <article className="surface-card rounded-[2rem] p-8 md:p-10">
          <span className="eyebrow">{mealIdeasCopy.eyebrow}</span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
            {buildMealIdeasTitle(locale, getMealTypeLabel(mealType))}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {mealIdeasCopy.description}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {mealIdeasCopy.preferencesLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{preferenceSummary}</p>
            </div>
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {mealIdeasCopy.targetLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {selectedMealTarget === null
                  ? mealIdeasCopy.targetMissingLabel
                  : `${selectedMealTarget} kcal`}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {mealIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`rounded-[1.3rem] p-5 shadow-border ${
                  idea.isFallback ? "bg-[rgba(23,23,23,0.03)]" : "bg-white/88"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-base font-semibold tracking-[-0.03em] text-foreground">
                    {idea.title}
                  </p>
                  <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a72ef]">
                    {mealIdeasCopy.approxLabel} {idea.approxCalories} kcal
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{idea.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card rounded-[1.8rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.sections.daySummary}
          </p>
          <div className="mt-6 grid gap-3">
            {groupedEntries.length === 0 ? (
              <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                <p className="text-sm text-muted">{copy.sections.noEntries}</p>
              </div>
            ) : (
              groupedEntries.map((group) => (
                <div key={group.date} className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold tracking-[-0.03em]">{group.date}</p>
                    <p className="text-sm font-medium text-muted">{group.totalCalories} kcal</p>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {group.entries.length} {copy.sections.recentEntries.toLowerCase()}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.sections.recentEntries}
          </p>
          <div className="mt-6 grid gap-3">
            {entries.length === 0 ? (
              <div className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                <p className="text-sm text-muted">{copy.sections.noEntries}</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-[1.2rem] bg-white/88 p-4 shadow-border">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold tracking-[-0.03em]">
                        {getMealTypeLabel(entry.mealType)}
                      </p>
                      <p className="mt-1 text-sm text-muted">{entry.date}</p>
                    </div>
                    <div className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-sm text-[#0a72ef]">
                      {entry.totalCalories} kcal
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.items.map((item) => (
                      <span
                        key={`${entry.id}-${item.name}`}
                        className="rounded-full bg-[#f4f1eb] px-3 py-1 text-xs font-medium text-muted"
                      >
                        {item.name} / {item.estimatedCalories} kcal
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-muted">
                    <span>{copy.sections.totalCalories}: {entry.totalCalories}</span>
                    <span>{copy.sections.items}: {entry.items.length}</span>
                    <span>{copy.sections.sourceManual}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
