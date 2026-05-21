"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { AssistantContext } from "@/lib/ai/assistant-context";
import { syncCurrentUserActivity } from "@/lib/admin/client-user-activity";
import {
  aiChatHistoryLimit,
  getAiSessionEntries,
  groupAiChatSessions,
  normalizeAiChatEntry,
  sortAiChatEntries,
} from "@/lib/ai/chat-history";
import {
  clearStoredAiSessionSelection,
  isStoredNewAiSessionSelection,
  readStoredAiSessionSelection,
  saveStoredActiveAiSessionId,
  saveStoredNewAiSessionSelection,
} from "@/lib/ai/active-session";
import {
  createAiChatEntry,
  readAiChatEntries,
  readCalculatorSessions,
  readMealEntries,
  readUserProfile,
  readWeightEntries,
} from "@/lib/data/user-data";
import {
  buildAssistantContextPrompts,
  getAssistantContextPromptTitle,
} from "@/lib/i18n/assistant-context-prompts";
import {
  getAssistantSessionLabelsCopy,
  getAssistantSessionPromptOriginLabel,
  getAssistantSessionSourceLabel,
} from "@/lib/i18n/assistant-session-labels";
import { trackProductEvent } from "@/lib/analytics/client";
import { getAssistantHistoryCopy } from "@/lib/i18n/assistant-history-copy";
import { getAssistantPanelCopy } from "@/lib/i18n/assistant-panel-copy";
import type { Dictionary } from "@/lib/i18n/copy";
import type { Locale } from "@/lib/i18n/config";
import {
  getDietPreferenceLabel,
  getProfilePreferencesCopy,
} from "@/lib/i18n/profile-preferences-copy";
import { getSavedCalculationCopy } from "@/lib/i18n/saved-calculation-copy";
import { buildWeightSummary } from "@/lib/weight/weight-summary";
import type { AnalyticsAiEntrySource } from "@/types/content";
import type {
  AiChatEntry,
  CalculatorSession,
  MealEntry,
  UserProfile,
  WeightEntry,
} from "@/types/product";

type AssistantPanelProps = {
  locale: Locale;
  copy: Dictionary["ai"];
  initialQuestion?: string;
  entrySource?: AnalyticsAiEntrySource;
};

type AssistantResponsePayload = {
  answer: string;
  bullets: string[];
  riskLevel: "low" | "high";
  medicalEscalation: boolean;
  disclaimer: string;
};

export function AssistantPanel({
  locale,
  copy,
  initialQuestion,
  entrySource,
}: AssistantPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const aiSessionIdRef = useRef<string | null>(null);
  const previousLocaleRef = useRef(locale);
  const [initialEntryContext] = useState(() => ({
    question: initialQuestion?.trim() ?? "",
    source: entrySource,
  }));
  const [question, setQuestion] = useState(() => initialQuestion?.trim() ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [context, setContext] = useState<AssistantContext | null>(null);
  const [history, setHistory] = useState<AiChatEntry[]>([]);
  const [sessionEntries, setSessionEntries] = useState<AiChatEntry[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [pendingPrefilledQuestion, setPendingPrefilledQuestion] = useState(
    () => initialEntryContext.question,
  );
  const [pendingPromptOriginOverride, setPendingPromptOriginOverride] = useState<
    "history_reuse" | null
  >(null);
  const [pendingEntrySource, setPendingEntrySource] = useState<
    AnalyticsAiEntrySource | undefined
  >(() => initialEntryContext.source);
  const historyCopy = getAssistantHistoryCopy(locale);
  const panelCopy = getAssistantPanelCopy(locale);
  const preferencesCopy = getProfilePreferencesCopy(locale);
  const savedCalculationCopy = getSavedCalculationCopy(locale);
  const sessionLabels = getAssistantSessionLabelsCopy(locale);
  const hasInitialQuestion = Boolean(initialEntryContext.question);
  const shouldRestoreStoredSession = !hasInitialQuestion && !initialEntryContext.source;

  useEffect(() => {
    if (previousLocaleRef.current === locale) {
      return;
    }

    previousLocaleRef.current = locale;
    aiSessionIdRef.current = null;
    startTransition(() => {
      setQuestion("");
      setIsLoading(false);
      setError("");
      setContext(null);
      setHistory([]);
      setSessionEntries([]);
      setMessageCount(0);
      setPendingPrefilledQuestion("");
      setPendingPromptOriginOverride(null);
      setPendingEntrySource(undefined);
    });
  }, [locale]);

  useEffect(() => {
    let alive = true;

    void Promise.allSettled([
      readCalculatorSessions(locale),
      readMealEntries(locale),
      readWeightEntries(locale),
      readAiChatEntries(locale),
      readUserProfile(locale),
    ]).then(
      ([
        sessionsResult,
        mealsResult,
        weightsResult,
        chatsResult,
        profileResult,
      ]) => {
        if (!alive) {
          return;
        }

        const sessions: CalculatorSession[] =
          sessionsResult.status === "fulfilled" ? sessionsResult.value : [];
        const meals: MealEntry[] = mealsResult.status === "fulfilled" ? mealsResult.value : [];
        const weights: WeightEntry[] =
          weightsResult.status === "fulfilled" ? weightsResult.value : [];
        const chats: AiChatEntry[] = chatsResult.status === "fulfilled" ? chatsResult.value : [];
        const profile: UserProfile | null =
          profileResult.status === "fulfilled" ? profileResult.value : null;
        const normalizedChats = sortAiChatEntries(chats);
        const storedSessionSelection = shouldRestoreStoredSession
          ? readStoredAiSessionSelection(locale)
          : null;
        const latestSessionEntries = shouldRestoreStoredSession
          ? isStoredNewAiSessionSelection(storedSessionSelection)
            ? []
            : getAiSessionEntries(normalizedChats, storedSessionSelection)
          : [];
        const restoredSessionId = latestSessionEntries[0]?.sessionId ?? null;

        if (shouldRestoreStoredSession) {
          if (restoredSessionId) {
            saveStoredActiveAiSessionId(locale, restoredSessionId);
          } else if (!isStoredNewAiSessionSelection(storedSessionSelection)) {
            clearStoredAiSessionSelection(locale);
          }
        }

        const latestCalculation = sessions[0]
          ? {
              recommendedCalories: sessions[0].output.recommendedCalories,
              recommendedRangeMin: sessions[0].output.recommendedRangeMin,
              recommendedRangeMax: sessions[0].output.recommendedRangeMax,
              trimester: sessions[0].output.trimester,
              guidelineDisplayName: sessions[0].output.guidelineDisplayName,
              countryCode: sessions[0].countryCode,
              gestationalWeek: sessions[0].input.gestationalWeek,
              riskFlags: sessions[0].output.riskFlags,
            }
          : undefined;
        const mealSummary =
          meals.length > 0
            ? {
                recentMealCount: meals.length,
                averageMealCalories: Math.round(
                  meals.reduce((sum, meal) => sum + meal.totalCalories, 0) / meals.length,
                ),
                todayLoggedCalories: meals
                  .filter((meal) => meal.date === new Date().toISOString().slice(0, 10))
                  .reduce((sum, meal) => sum + meal.totalCalories, 0),
                lastLoggedDate: meals[0].date,
              }
            : undefined;
        const profilePreferences =
          profile && profile.dietPreferences.length > 0
            ? {
                dietPreferences: profile.dietPreferences,
              }
            : undefined;
        const weightSummary = buildWeightSummary({
          entries: weights,
          currentWeightKg: profile?.currentWeightKg,
          prePregnancyWeightKg: profile?.prePregnancyWeightKg,
          gestationalWeek: profile?.gestationalWeek,
        }) ?? undefined;

        startTransition(() => {
          setContext(
            latestCalculation || mealSummary || weightSummary || profilePreferences
              ? {
                  latestCalculation,
                  mealSummary,
                  weightSummary,
                  profilePreferences,
                }
              : null,
          );
          setHistory(normalizedChats);
          setSessionEntries(latestSessionEntries);
          setMessageCount(latestSessionEntries.length);
        });

        aiSessionIdRef.current = restoredSessionId;
      },
    );

    return () => {
      alive = false;
    };
  }, [locale, shouldRestoreStoredSession]);

  const contextDate = useMemo(() => {
    if (!context?.mealSummary?.lastLoggedDate) {
      return null;
    }

    return new Date(context.mealSummary.lastLoggedDate).toLocaleDateString(locale);
  }, [context, locale]);
  const weightContextDate = useMemo(() => {
    if (!context?.weightSummary?.lastLoggedDate) {
      return null;
    }

    return new Date(context.weightSummary.lastLoggedDate).toLocaleDateString(locale);
  }, [context, locale]);
  const contextPromptTitle = getAssistantContextPromptTitle(locale);
  const contextPrompts = useMemo(
    () => buildAssistantContextPrompts(locale, context),
    [context, locale],
  );
  const historySessions = useMemo(() => groupAiChatSessions(history).slice(0, 5), [history]);
  const currentSessionId = sessionEntries[0]?.sessionId ?? null;
  const activeSessionMetadataEntry = sessionEntries[0] ?? null;
  const activeSessionSource =
    pendingEntrySource ??
    (sessionEntries[0]?.source !== "direct" ? sessionEntries[0]?.source : undefined);

  function clearEntryParamsFromUrl() {
    if (typeof window === "undefined") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has("prompt") && !searchParams.has("source")) {
      return;
    }

    searchParams.delete("prompt");
    searchParams.delete("source");

    const nextQuery = searchParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function renderSessionMetadataBadges(source: AiChatEntry["source"], promptOrigin: AiChatEntry["promptOrigin"]) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold text-[#0a72ef]">
          {sessionLabels.sourceLabel}: {getAssistantSessionSourceLabel(locale, source)}
        </span>
        <span className="rounded-full bg-[rgba(23,23,23,0.05)] px-3 py-1 text-xs font-semibold text-muted">
          {sessionLabels.promptOriginLabel}:{" "}
          {getAssistantSessionPromptOriginLabel(locale, promptOrigin)}
        </span>
      </div>
    );
  }

  function getOrCreateAiSessionId() {
    if (!aiSessionIdRef.current) {
      aiSessionIdRef.current = crypto.randomUUID();
    }

    return aiSessionIdRef.current;
  }

  async function submitQuestion(
    nextQuestion: string,
    origin:
      | "manual_submit"
      | "context_prompt"
      | "history_reuse"
      | "suggested_prompt" = "manual_submit",
  ) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const sessionId = getOrCreateAiSessionId();
    const isFollowUp = messageCount > 0;
    const messageIndex = messageCount + 1;
    const promptOrigin =
      origin === "manual_submit"
        ? pendingPromptOriginOverride && messageCount > 0
          ? pendingPromptOriginOverride
          : pendingPrefilledQuestion === trimmed && messageCount === 0
            ? "prefilled_prompt"
            : origin
        : origin;

    setQuestion(trimmed);
    setIsLoading(true);
    setError("");

    try {
      void syncCurrentUserActivity({
        locale,
        event: "ai_chat_started",
        countryCode: context?.latestCalculation?.countryCode,
        gestationalWeek: context?.latestCalculation?.gestationalWeek,
        lastRecommendedCalories: context?.latestCalculation?.recommendedCalories,
      }).catch(() => undefined);

      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          question: trimmed,
          context: context ?? undefined,
          source: activeSessionSource,
          sessionId,
          isFollowUp,
          messageIndex,
          promptOrigin,
          history: sessionEntries.slice(-3).map((entry) => ({
            question: entry.question,
            answer: entry.answer,
            riskLevel: entry.riskLevel,
            medicalEscalation: entry.medicalEscalation,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to get an answer.");
      }

      const responseData = data as AssistantResponsePayload;
      const chatPayload = {
        locale,
        question: trimmed,
        answer: responseData.answer,
        bullets: Array.isArray(responseData.bullets) ? responseData.bullets : [],
        riskLevel: responseData.riskLevel,
        medicalEscalation: responseData.medicalEscalation,
        disclaimer: responseData.disclaimer,
        sessionId,
        messageIndex,
        promptOrigin,
        source: activeSessionSource ?? "direct",
      } satisfies Omit<AiChatEntry, "id" | "createdAt">;
      const savedChat = await createAiChatEntry(chatPayload, locale).catch(
        (): AiChatEntry => ({
          ...chatPayload,
          id: `local-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString(),
        }),
      );
      const normalizedSavedChat = normalizeAiChatEntry(savedChat);
      saveStoredActiveAiSessionId(locale, sessionId);
      setPendingPrefilledQuestion("");
      setPendingPromptOriginOverride(null);
      setPendingEntrySource(undefined);
      setMessageCount((current) => current + 1);
      setSessionEntries((current) => [...current, normalizedSavedChat]);
      setHistory((current) =>
        sortAiChatEntries(
          [normalizedSavedChat, ...current.filter((entry) => entry.id !== normalizedSavedChat.id)].slice(
            0,
            aiChatHistoryLimit,
          ),
        ),
      );
      clearEntryParamsFromUrl();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to get an answer.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion(question);
  }

  function handleResetSession() {
    aiSessionIdRef.current = null;
    saveStoredNewAiSessionSelection(locale);
    setPendingPrefilledQuestion("");
    setPendingPromptOriginOverride(null);
    setPendingEntrySource(undefined);
    setSessionEntries([]);
    setMessageCount(0);
    setError("");
    setQuestion("");
    clearEntryParamsFromUrl();
  }

  function handleContinueSession(sessionId: string) {
    const targetSession = historySessions.find((session) => session.sessionId === sessionId);
    if (!targetSession) {
      return;
    }

    void trackProductEvent({
      name: "ai_session_resumed",
      locale,
      metadata: {
        source: targetSession.source,
        promptOrigin: targetSession.promptOrigin,
        sessionId: targetSession.sessionId,
        messageCount: targetSession.messageCount,
        hasMedicalEscalation: targetSession.hasMedicalEscalation,
      },
    }).catch(() => undefined);
    aiSessionIdRef.current = targetSession.sessionId;
    saveStoredActiveAiSessionId(locale, targetSession.sessionId);
    setPendingPrefilledQuestion("");
    setPendingPromptOriginOverride("history_reuse");
    setPendingEntrySource(undefined);
    setSessionEntries(targetSession.entries);
    setMessageCount(targetSession.entries.length);
    setError("");
    setQuestion("");
    clearEntryParamsFromUrl();
  }

  return (
    <div className="grid gap-6">
      <article className="surface-card rounded-[2rem] p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          {savedCalculationCopy.ai.contextTitle}
        </p>

        {!context ? (
          <div className="mt-5 rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm leading-7 text-muted">{savedCalculationCopy.ai.contextEmpty}</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {context.latestCalculation ? (
              <>
                <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                  <p className="text-sm font-medium text-muted">
                    {savedCalculationCopy.ai.latestTargetLabel}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.07em]">
                    {context.latestCalculation.recommendedCalories} kcal
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.rangeLabel}:{" "}
                    {context.latestCalculation.recommendedRangeMin}-
                    {context.latestCalculation.recommendedRangeMax}
                  </p>
                </div>

                <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.weekLabel}: {context.latestCalculation.gestationalWeek}
                  </p>
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.sourceLabel}:{" "}
                    {context.latestCalculation.guidelineDisplayName}
                  </p>
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.regionLabel}: {context.latestCalculation.countryCode}
                  </p>
                </div>
              </>
            ) : null}

            {context.mealSummary ? (
              <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border md:col-span-2">
                <p className="text-sm leading-7 text-muted">
                  {savedCalculationCopy.ai.mealsLabel}: {context.mealSummary.recentMealCount}
                </p>
                <p className="text-sm leading-7 text-muted">
                  {savedCalculationCopy.ai.averageMealLabel}:{" "}
                  {context.mealSummary.averageMealCalories} kcal
                </p>
                {typeof context.mealSummary.todayLoggedCalories === "number" ? (
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.todayLoggedLabel}:{" "}
                    {context.mealSummary.todayLoggedCalories} kcal
                  </p>
                ) : null}
                {contextDate ? (
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.lastMealLabel}: {contextDate}
                  </p>
                ) : null}
              </div>
            ) : null}

            {context.weightSummary ? (
              <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border md:col-span-2">
                <p className="text-sm leading-7 text-muted">
                  {savedCalculationCopy.ai.currentWeightLabel}:{" "}
                  {context.weightSummary.currentWeightKg} kg
                </p>
                <p className="text-sm leading-7 text-muted">
                  {savedCalculationCopy.ai.weightEntriesLabel}:{" "}
                  {context.weightSummary.recentWeightCount}
                </p>
                {typeof context.weightSummary.recentTrendDeltaKg === "number" ? (
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.weightTrendLabel}:{" "}
                    {context.weightSummary.recentTrendDeltaKg > 0 ? "+" : ""}
                    {context.weightSummary.recentTrendDeltaKg} kg
                  </p>
                ) : null}
                {typeof context.weightSummary.prePregnancyDeltaKg === "number" ? (
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.weightBaselineLabel}:{" "}
                    {context.weightSummary.prePregnancyDeltaKg > 0 ? "+" : ""}
                    {context.weightSummary.prePregnancyDeltaKg} kg
                  </p>
                ) : null}
                {weightContextDate ? (
                  <p className="text-sm leading-7 text-muted">
                    {savedCalculationCopy.ai.lastWeightLabel}: {weightContextDate}
                  </p>
                ) : null}
              </div>
            ) : null}

            {context.profilePreferences?.dietPreferences.length ? (
              <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border md:col-span-2">
                <p className="text-sm font-medium text-muted">
                  {preferencesCopy.aiSummaryTitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {context.profilePreferences.dietPreferences.map((value) => (
                    <span
                      key={value}
                      className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a72ef]"
                    >
                      {getDietPreferenceLabel(locale, value)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </article>

      <article className="surface-card rounded-[2rem] p-8 md:p-10">
        <label className="field-label" htmlFor="assistant-question">
          {copy.inputLabel}
        </label>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <textarea
            id="assistant-question"
            className="field-input min-h-36 resize-y"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={copy.placeholder}
            disabled={isLoading}
          />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="cta-primary" disabled={isLoading}>
              {isLoading ? copy.loadingLabel : copy.submitLabel}
            </button>
          </div>
        </form>
      </article>

      <article className="surface-card rounded-[2rem] p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {panelCopy.sessionTitle}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {panelCopy.sessionDescription}
            </p>
            {activeSessionMetadataEntry ? (
              <div className="mt-4">
                {renderSessionMetadataBadges(
                  activeSessionMetadataEntry.source,
                  activeSessionMetadataEntry.promptOrigin,
                )}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="cta-secondary text-sm"
            onClick={handleResetSession}
            disabled={sessionEntries.length === 0 && messageCount === 0 && !error}
          >
            {panelCopy.resetSessionLabel}
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-[1.3rem] bg-[rgba(255,91,79,0.08)] p-4 text-sm text-[#a93c30] shadow-border">
            {error}
          </div>
        ) : null}

        {sessionEntries.length === 0 && !error ? (
          <div className="mt-5 rounded-[1.3rem] bg-white/88 p-5 shadow-border">
            <p className="text-sm leading-7 text-muted">{panelCopy.sessionEmpty}</p>
          </div>
        ) : null}

        {sessionEntries.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {sessionEntries.map((entry, index) => (
              <div key={entry.id} className="rounded-[1.4rem] bg-white/88 p-5 shadow-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {new Date(entry.createdAt).toLocaleTimeString(locale, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                        entry.medicalEscalation
                          ? "bg-[rgba(255,91,79,0.1)] text-[#a93c30]"
                          : "bg-[rgba(10,114,239,0.08)] text-[#0a72ef]"
                      }`}
                    >
                      {entry.medicalEscalation ? copy.riskLabel : copy.safeLabel}
                    </span>
                    {index === sessionEntries.length - 1 ? (
                      <span className="rounded-full bg-[rgba(23,23,23,0.05)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {panelCopy.currentBadge}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {panelCopy.questionLabel}
                </p>
                <p className="mt-2 text-base leading-7 text-foreground">{entry.question}</p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {panelCopy.answerLabel}
                </p>
                <div
                  className={`mt-2 rounded-[1.3rem] p-5 shadow-border ${
                    entry.medicalEscalation
                      ? "bg-[rgba(255,91,79,0.08)]"
                      : "bg-[rgba(10,114,239,0.06)]"
                  }`}
                >
                  <p className="text-base leading-7 text-muted">{entry.answer}</p>
                </div>

                {entry.bullets.length > 0 ? (
                  <div className="mt-4 grid gap-3">
                    {entry.bullets.map((bullet) => (
                      <div
                        key={`${entry.id}-${bullet}`}
                        className="rounded-[1.2rem] bg-[rgba(23,23,23,0.03)] p-4 shadow-border"
                      >
                        <p className="text-sm leading-7 text-muted">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 rounded-[1.2rem] bg-[rgba(23,23,23,0.03)] p-4 shadow-border">
                  <p className="text-sm leading-7 text-muted">{entry.disclaimer}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-5 rounded-[1.3rem] bg-[rgba(10,114,239,0.06)] p-5 shadow-border">
            <p className="text-sm leading-7 text-muted">{copy.loadingLabel}</p>
          </div>
        ) : null}
      </article>

      {contextPrompts.length > 0 ? (
        <article className="surface-card rounded-[2rem] p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {contextPromptTitle}
          </p>
          <div className="mt-6 grid gap-4">
            {contextPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-[1.3rem] bg-[rgba(10,114,239,0.06)] p-5 text-left shadow-border transition hover:-translate-y-[1px]"
                onClick={() => void submitQuestion(prompt, "context_prompt")}
                disabled={isLoading}
              >
                <p className="text-base leading-7 text-muted">{prompt}</p>
              </button>
            ))}
          </div>
        </article>
      ) : null}

      <article className="surface-card rounded-[2rem] p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {historyCopy.title}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {historyCopy.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {history.length === 0 ? (
            <div className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-sm leading-7 text-muted">{historyCopy.empty}</p>
            </div>
          ) : (
            historySessions.map((session, index) => (
              <div
                key={session.sessionId}
                className="rounded-[1.3rem] bg-white/88 p-5 shadow-border"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      {historyCopy.lastUpdatedLabel}:{" "}
                      {new Date(session.latestCreatedAt).toLocaleDateString(locale)}
                    </p>
                    {index === 0 ? (
                      <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a72ef]">
                        {historyCopy.latestBadge}
                      </span>
                    ) : null}
                    {session.sessionId === currentSessionId ? (
                      <span className="rounded-full bg-[rgba(23,23,23,0.05)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {historyCopy.currentBadge}
                      </span>
                    ) : null}
                    {session.hasMedicalEscalation ? (
                      <span className="rounded-full bg-[rgba(255,91,79,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#a93c30]">
                        {copy.riskLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      {historyCopy.messagesLabel}: {session.messageCount}
                    </p>
                    <button
                      type="button"
                      className="cta-secondary text-sm"
                      onClick={() => handleContinueSession(session.sessionId)}
                      disabled={session.sessionId === currentSessionId}
                    >
                      {historyCopy.continueLabel}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  {renderSessionMetadataBadges(session.source, session.promptOrigin)}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {historyCopy.questionLabel}
                </p>
                <p className="mt-2 text-base leading-7 text-foreground">
                  {session.latestEntry.question}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {historyCopy.answerLabel}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">{session.latestEntry.answer}</p>
                {session.latestEntry.bullets.length > 0 ? (
                  <div className="mt-4 grid gap-2">
                    {session.latestEntry.bullets.slice(0, 2).map((bullet) => (
                      <div
                        key={`${session.latestEntry.id}-${bullet}`}
                        className="rounded-[1rem] bg-[rgba(23,23,23,0.03)] p-3 shadow-border"
                      >
                        <p className="text-sm leading-6 text-muted">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </article>

      <article className="surface-card rounded-[2rem] p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          {panelCopy.suggestedTitle}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          {panelCopy.suggestedDescription}
        </p>
        <div className="mt-6 grid gap-4">
          {copy.prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-[1.3rem] bg-white/88 p-5 text-left shadow-border transition hover:-translate-y-[1px]"
              onClick={() => void submitQuestion(prompt, "suggested_prompt")}
              disabled={isLoading}
            >
              <p className="text-base leading-7 text-muted">{prompt}</p>
            </button>
          ))}
        </div>
      </article>
    </div>
  );
}
