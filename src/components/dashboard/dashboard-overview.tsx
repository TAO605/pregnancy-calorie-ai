"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import { syncCurrentUserActivity } from "@/lib/admin/client-user-activity";
import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import { trackProductEvent } from "@/lib/analytics/client";
import {
  readCalculatorSessions,
  readMealEntries,
  readUserProfile,
  readWeightEntries,
} from "@/lib/data/user-data";
import { getDashboardMealsCopy } from "@/lib/i18n/dashboard-meals-copy";
import { getDashboardWeeklyCheckInCopy } from "@/lib/i18n/dashboard-weekly-checkin-copy";
import { buildDashboardWeeklyCheckInPrompt } from "@/lib/i18n/dashboard-weekly-checkin-prompt";
import { buildOverviewAiPrompt } from "@/lib/i18n/contextual-ai-prompts";
import { getDashboardOverviewCopy } from "@/lib/i18n/dashboard-overview-copy";
import type { Locale } from "@/lib/i18n/config";
import {
  getDietPreferenceLabel,
  getProfilePreferencesCopy,
} from "@/lib/i18n/profile-preferences-copy";
import type { ProductCopy } from "@/lib/i18n/product-copy";
import { getSavedCalculationCopy } from "@/lib/i18n/saved-calculation-copy";
import type {
  CalculatorSession,
  MealEntry,
  UserProfile,
  WeightEntry,
} from "@/types/product";

type DashboardOverviewProps = {
  locale: Locale;
  copy: ProductCopy["dashboard"];
};

export function DashboardOverview({ locale, copy }: DashboardOverviewProps) {
  const hasTrackedViewRef = useRef(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [calculations, setCalculations] = useState<CalculatorSession[]>([]);
  const mealsCopy = getDashboardMealsCopy(locale);
  const overviewCopy = getDashboardOverviewCopy(locale);
  const weeklyCheckInCopy = getDashboardWeeklyCheckInCopy(locale);
  const preferencesCopy = getProfilePreferencesCopy(locale);
  const savedCalculationCopy = getSavedCalculationCopy(locale);

  useEffect(() => {
    let alive = true;

    void Promise.all([
      readUserProfile(locale),
      readWeightEntries(locale),
      readCalculatorSessions(locale),
      readMealEntries(locale),
    ]).then(([currentProfile, nextWeights, nextCalculations, nextMeals]) => {
      if (!alive) {
        return;
      }

      startTransition(() => {
        setProfile(currentProfile);
        setWeights(nextWeights);
        setCalculations(nextCalculations);
        setMeals(nextMeals);
      });
    });

    return () => {
      alive = false;
    };
  }, [locale]);

  useEffect(() => {
    hasTrackedViewRef.current = false;
  }, [locale]);

  useEffect(() => {
    if (!profile || profile.locale !== locale || hasTrackedViewRef.current) {
      return;
    }

    hasTrackedViewRef.current = true;
    void trackProductEvent({
      name: "dashboard_viewed",
      locale,
      metadata: {
        hasLatestTarget: Boolean(calculations[0]),
        mealEntryCount: meals.length,
        weightEntryCount: weights.length,
      },
    });
    void syncCurrentUserActivity({
      locale,
      event: "dashboard_viewed",
      status: profile.email ? "saved_profile" : "anonymous",
      countryCode: profile.countryCode,
      gestationalWeek: profile.gestationalWeek,
      lastRecommendedCalories: calculations[0]?.output.recommendedCalories,
    });
  }, [calculations, locale, meals.length, profile, weights.length]);

  const latestCalculation = calculations[0] ?? null;
  const latestWeight = weights[0]?.weightKg ?? profile?.currentWeightKg ?? null;
  const previousWeight = weights[1]?.weightKg ?? null;
  const delta = useMemo(() => {
    if (latestWeight === null || previousWeight === null) {
      return null;
    }

    return Math.round((latestWeight - previousWeight) * 10) / 10;
  }, [latestWeight, previousWeight]);
  const formattedSavedDate = latestCalculation
    ? new Date(latestCalculation.createdAt).toLocaleDateString(locale)
    : null;
  const today = new Date().toISOString().slice(0, 10);
  const todayMeals = useMemo(
    () => meals.filter((entry) => entry.date === today),
    [meals, today],
  );
  const todayMealCalories = useMemo(
    () => todayMeals.reduce((sum, entry) => sum + entry.totalCalories, 0),
    [todayMeals],
  );
  const todayMealCount = todayMeals.length;
  const calorieGap = latestCalculation
    ? latestCalculation.output.recommendedCalories - todayMealCalories
    : null;
  const progressPercent = latestCalculation
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round((todayMealCalories / latestCalculation.output.recommendedCalories) * 100),
        ),
      )
    : 0;
  const progressWidth = Math.max(progressPercent, todayMealCalories > 0 ? 8 : 0);
  const recentCalculations = calculations.slice(0, 3);
  const previousCalculation = calculations[1] ?? null;
  const targetShift =
    latestCalculation && previousCalculation
      ? latestCalculation.output.recommendedCalories - previousCalculation.output.recommendedCalories
      : null;
  const recentWeightWindow = weights.slice(0, 4);
  const earliestRecentWeight = recentWeightWindow.at(-1)?.weightKg ?? null;
  const weightTrendDelta =
    latestWeight !== null &&
    earliestRecentWeight !== null &&
    recentWeightWindow.length > 1
      ? Math.round((latestWeight - earliestRecentWeight) * 10) / 10
      : null;
  const sevenDayWindowStart = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return start.toISOString().slice(0, 10);
  }, []);
  const recentMeals = useMemo(
    () => meals.filter((entry) => entry.date >= sevenDayWindowStart),
    [meals, sevenDayWindowStart],
  );
  const trackedMealDaysLast7 = useMemo(
    () => new Set(recentMeals.map((entry) => entry.date)).size,
    [recentMeals],
  );
  const averageLoggedCaloriesLast7 = useMemo(() => {
    if (trackedMealDaysLast7 === 0) {
      return null;
    }

    return Math.round(
      recentMeals.reduce((sum, entry) => sum + entry.totalCalories, 0) / trackedMealDaysLast7,
    );
  }, [recentMeals, trackedMealDaysLast7]);
  const overviewAiHref =
    latestCalculation && calorieGap !== null
      ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
          buildOverviewAiPrompt(locale, {
            targetCalories: latestCalculation.output.recommendedCalories,
            loggedCalories: todayMealCalories,
            remainingCalories: Math.max(calorieGap, 0),
          }),
        )}`
      : `/${locale}/ai`;
  const weeklyAiHref =
    latestCalculation || trackedMealDaysLast7 > 0 || latestWeight !== null
      ? `${`/${locale}/ai`}?prompt=${encodeURIComponent(
          buildDashboardWeeklyCheckInPrompt(locale, {
            targetCalories: latestCalculation?.output.recommendedCalories ?? null,
            trackedMealDays: trackedMealDaysLast7,
            averageLoggedCalories: averageLoggedCaloriesLast7,
            latestWeightKg: latestWeight,
            weightTrendDeltaKg: weightTrendDelta,
            gestationalWeek: profile?.gestationalWeek ?? null,
            guidelineSource: latestCalculation?.output.guidelineDisplayName ?? null,
          }),
        )}`
      : `/${locale}/ai`;
  const overviewPlanAiHref = withAiEntrySource(
    overviewAiHref,
    "dashboard_overview_plan",
  );
  const overviewRecentTargetsAiHref = withAiEntrySource(
    overviewAiHref,
    "dashboard_overview_recent_targets",
  );
  const weeklyCheckInAiHref = withAiEntrySource(
    weeklyAiHref,
    "dashboard_weekly_checkin",
  );

  function handleAiEntryClick(
    source:
      | "dashboard_overview_plan"
      | "dashboard_overview_recent_targets"
      | "dashboard_weekly_checkin",
  ) {
    trackAiEntryClick({
      locale,
      source,
      countryCode: profile?.countryCode,
      gestationalWeek: profile?.gestationalWeek,
      lastRecommendedCalories: latestCalculation?.output.recommendedCalories,
      metadata: {
        hasLatestTarget: Boolean(latestCalculation),
        todayMealCount,
        trackedMealDaysLast7,
        latestWeightKg: latestWeight ?? null,
      },
    });
  }

  return (
    <>
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.overviewEyebrow}</span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.overviewTitle}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{copy.overviewDescription}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.currentWeekLabel}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {profile?.gestationalWeek ?? "--"}
          </p>
          <p className="mt-3 text-sm text-muted">{overviewCopy.currentWeekHint}</p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.currentWeightLabel}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {latestWeight !== null ? `${latestWeight} kg` : "--"}
          </p>
          <p className="mt-3 text-sm text-muted">
            {delta === null
              ? copy.currentWeightDeltaEmpty
              : `${copy.currentWeightDeltaLabel}: ${delta > 0 ? "+" : ""}${delta} kg`}
          </p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">{copy.guidelineRegionLabel}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {profile?.countryCode ?? "--"}
          </p>
          <p className="mt-3 text-sm text-muted">{copy.guidelineRegionHint}</p>
        </article>
        <article className="surface-card rounded-[1.8rem] p-7">
          <p className="text-sm font-medium text-muted">
            {savedCalculationCopy.dashboard.latestTargetLabel}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.08em]">
            {latestCalculation ? `${latestCalculation.output.recommendedCalories} kcal` : "--"}
          </p>
          <p className="mt-3 text-sm text-muted">
            {latestCalculation
              ? `${savedCalculationCopy.dashboard.weekLabel} ${latestCalculation.input.gestationalWeek} / ${savedCalculationCopy.dashboard.sourceLabel}: ${latestCalculation.output.guidelineDisplayName} / ${savedCalculationCopy.dashboard.savedLabel}: ${formattedSavedDate}`
              : savedCalculationCopy.dashboard.latestTargetEmpty}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {overviewCopy.caloriePlanTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
                {overviewCopy.caloriePlanDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/dashboard/meals`} className="cta-secondary text-sm">
                {mealsCopy.navLabel}
              </Link>
              <Link
                href={overviewPlanAiHref}
                className="cta-primary text-sm"
                onClick={() => handleAiEntryClick("dashboard_overview_plan")}
              >
                {overviewCopy.aiCta}
              </Link>
            </div>
          </div>

          {!latestCalculation ? (
            <div className="mt-8 rounded-[1.4rem] bg-white/88 p-6 shadow-border">
              <p className="text-lg font-semibold tracking-[-0.04em]">
                {overviewCopy.noTargetTitle}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {overviewCopy.noTargetBody}
              </p>
              <div className="mt-5">
                <Link
                  href={`/${locale}/tools/pregnancy-calorie-calculator`}
                  className="cta-primary text-sm"
                >
                  {overviewCopy.calculatorCta}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                  <p className="text-sm font-medium text-muted">{overviewCopy.targetLabel}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                    {latestCalculation.output.recommendedCalories} kcal
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {savedCalculationCopy.dashboard.weekLabel}{" "}
                    {latestCalculation.input.gestationalWeek}
                  </p>
                </div>
                <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                  <p className="text-sm font-medium text-muted">{overviewCopy.loggedLabel}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                    {todayMealCalories} kcal
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {overviewCopy.mealsTodayLabel}: {todayMealCount}
                  </p>
                </div>
                <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                  <p className="text-sm font-medium text-muted">
                    {calorieGap !== null && calorieGap < 0
                      ? overviewCopy.overLabel
                      : overviewCopy.remainingLabel}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                    {calorieGap === null ? "--" : `${Math.abs(calorieGap)} kcal`}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {savedCalculationCopy.dashboard.sourceLabel}:{" "}
                    {latestCalculation.output.guidelineDisplayName}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.4rem] bg-[rgba(255,255,255,0.86)] p-6 shadow-border">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-muted">{overviewCopy.progressLabel}</p>
                  <p className="text-sm font-semibold tracking-[-0.02em]">
                    {progressPercent}%
                  </p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(23,23,23,0.08)]">
                  <div
                    className={`h-full rounded-full ${
                      calorieGap !== null && calorieGap < 0
                        ? "bg-[linear-gradient(90deg,#ff7a59_0%,#ff5b4f_100%)]"
                        : "bg-[linear-gradient(90deg,#0a72ef_0%,#6fa8ff_100%)]"
                    }`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                  <span>
                    {overviewCopy.mealsTodayLabel}: {todayMealCount}
                  </span>
                  <span>
                    {savedCalculationCopy.dashboard.savedLabel}: {formattedSavedDate}
                  </span>
                </div>
              </div>
            </>
          )}
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {overviewCopy.recentTargetsTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted">
                {overviewCopy.recentTargetsDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/tools/pregnancy-calorie-calculator`}
                className="cta-secondary text-sm"
              >
                {overviewCopy.calculatorCta}
              </Link>
              <Link
                href={overviewRecentTargetsAiHref}
                className="cta-primary text-sm"
                onClick={() => handleAiEntryClick("dashboard_overview_recent_targets")}
              >
                {overviewCopy.aiCta}
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {recentCalculations.length === 0 ? (
              <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                <p className="text-sm leading-7 text-muted">
                  {overviewCopy.recentTargetsEmpty}
                </p>
              </div>
            ) : (
              recentCalculations.map((session, index) => (
                <div
                  key={session.id}
                  className="rounded-[1.3rem] bg-white/88 p-5 shadow-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-semibold tracking-[-0.05em]">
                        {session.output.recommendedCalories} kcal
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {savedCalculationCopy.dashboard.weekLabel} {session.input.gestationalWeek} /{" "}
                        {savedCalculationCopy.dashboard.sourceLabel}:{" "}
                        {session.output.guidelineDisplayName}
                      </p>
                    </div>
                    {index === 0 ? (
                      <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a72ef]">
                        {overviewCopy.latestBadge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                    <span>
                      {overviewCopy.rangeLabel}: {session.output.recommendedRangeMin}-
                      {session.output.recommendedRangeMax} kcal
                    </span>
                    <span>
                      {savedCalculationCopy.dashboard.savedLabel}:{" "}
                      {new Date(session.createdAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.06em]">
              {overviewCopy.trackingSnapshotTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-muted">
              {overviewCopy.trackingSnapshotDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/dashboard/weight`} className="cta-secondary text-sm">
              {overviewCopy.weightCta}
            </Link>
            <Link href={`/${locale}/dashboard/meals`} className="cta-primary text-sm">
              {overviewCopy.mealsCta}
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">{overviewCopy.weightTrendTitle}</p>
            {latestWeight === null ? (
              <p className="mt-4 text-sm leading-7 text-muted">{overviewCopy.weightTrendEmpty}</p>
            ) : (
              <>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                  {latestWeight} kg
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {weightTrendDelta === null
                    ? overviewCopy.weightTrendHint
                    : `${overviewCopy.changeLabel}: ${weightTrendDelta > 0 ? "+" : ""}${weightTrendDelta} kg`}
                </p>
              </>
            )}
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">{overviewCopy.mealRhythmTitle}</p>
            {recentMeals.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-muted">{overviewCopy.mealRhythmEmpty}</p>
            ) : (
              <>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                  {trackedMealDaysLast7}/7
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {trackedMealDaysLast7} {overviewCopy.daysLabel} / {recentMeals.length}{" "}
                  {overviewCopy.logsLabel}
                </p>
              </>
            )}
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">{overviewCopy.targetShiftTitle}</p>
            {!latestCalculation ? (
              <p className="mt-4 text-sm leading-7 text-muted">{overviewCopy.targetShiftEmpty}</p>
            ) : (
              <>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                  {targetShift === null
                    ? `${latestCalculation.output.recommendedCalories} kcal`
                    : `${targetShift > 0 ? "+" : ""}${targetShift} kcal`}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {targetShift === null
                    ? overviewCopy.targetShiftHint
                    : `${overviewCopy.sinceLabel}: ${previousCalculation?.output.recommendedCalories} kcal`}
                </p>
              </>
            )}
          </article>
        </div>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{weeklyCheckInCopy.eyebrow}</span>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
              {weeklyCheckInCopy.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {weeklyCheckInCopy.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/dashboard/meals`} className="cta-secondary text-sm">
              {weeklyCheckInCopy.mealsCta}
            </Link>
            <Link
              href={weeklyCheckInAiHref}
              className="cta-primary text-sm"
              onClick={() => handleAiEntryClick("dashboard_weekly_checkin")}
            >
              {weeklyCheckInCopy.aiCta}
            </Link>
          </div>
        </div>

        <article className="mt-8 rounded-[1.4rem] bg-[rgba(10,114,239,0.06)] p-6 shadow-border">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {weeklyCheckInCopy.summaryTitle}
          </p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted">
            {weeklyCheckInCopy.formatSummaryBody({
              trackedMealDays: trackedMealDaysLast7,
              targetCalories: latestCalculation?.output.recommendedCalories ?? null,
              averageLoggedCalories: averageLoggedCaloriesLast7,
              latestWeightKg: latestWeight,
              weightTrendDeltaKg: weightTrendDelta,
              gestationalWeek: profile?.gestationalWeek ?? null,
            })}
          </p>
        </article>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyCheckInCopy.cards.mealCoverageTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {trackedMealDaysLast7}/7
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyCheckInCopy.cards.formatMealCoverageBody(trackedMealDaysLast7)}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyCheckInCopy.cards.averageIntakeTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {averageLoggedCaloriesLast7 === null ? "--" : `${averageLoggedCaloriesLast7} kcal`}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyCheckInCopy.cards.formatAverageIntakeBody(
                averageLoggedCaloriesLast7,
                latestCalculation?.output.recommendedCalories ?? null,
              )}
            </p>
          </article>

          <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm font-medium text-muted">
              {weeklyCheckInCopy.cards.weightDirectionTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              {latestWeight === null ? "--" : `${latestWeight} kg`}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {weeklyCheckInCopy.cards.formatWeightDirectionBody(
                latestWeight,
                weightTrendDelta,
                profile?.gestationalWeek ?? null,
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {copy.profileTitle}
              </h2>
              <p className="mt-2 text-base leading-7 text-muted">
                {copy.profileDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile?.dietPreferences.length ? (
                  profile.dietPreferences.map((value) => (
                    <span
                      key={value}
                      className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a72ef]"
                    >
                      {getDietPreferenceLabel(locale, value)}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted">{preferencesCopy.summaryEmpty}</p>
                )}
              </div>
            </div>
            <Link href={`/${locale}/dashboard/profile`} className="cta-secondary text-sm">
              {copy.navProfile}
            </Link>
          </div>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {copy.weightTitle}
              </h2>
              <p className="mt-2 text-base leading-7 text-muted">
                {copy.weightDescription}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/weight`} className="cta-primary text-sm">
              {copy.navWeight}
            </Link>
          </div>
        </article>

        <article className="surface-card rounded-[1.8rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.06em]">
                {mealsCopy.overviewTitle}
              </h2>
              <p className="mt-2 text-base leading-7 text-muted">
                {mealsCopy.overviewDescription}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/meals`} className="cta-secondary text-sm">
              {mealsCopy.navLabel}
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {copy.quickCards.map((card) => (
          <article key={card.title} className="surface-card rounded-[1.8rem] p-7">
            <h3 className="text-xl font-semibold tracking-[-0.05em]">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
