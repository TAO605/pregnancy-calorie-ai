"use client";

import { getClientSessionUser } from "@/lib/auth/client-session";
import { readUserProfile } from "@/lib/data/user-data";
import { getOrCreateAnonymousSessionId } from "@/lib/demo/demo-store";
import type { AnalyticsSignUpSource } from "@/types/content";

type UserActivitySnapshotInput = {
  anonymousSessionId?: string;
  email?: string;
  displayName?: string;
  signUpSource?: AnalyticsSignUpSource;
  locale: string;
  countryCode?: string;
  gestationalWeek?: number;
  status: "anonymous" | "saved_profile" | "active_tracking";
  event:
    | "calculator_completed"
    | "signup_completed"
    | "profile_saved"
    | "ai_chat_started"
    | "ai_entry_clicked"
    | "result_ai_clicked"
    | "dashboard_viewed"
    | "weight_log_created"
    | "meal_log_created";
  lastRecommendedCalories?: number;
};

export async function syncUserActivitySnapshot(input: UserActivitySnapshotInput) {
  try {
    await fetch("/api/v1/users/snapshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // Ignore snapshot sync failures in the prototype.
  }
}

type SyncCurrentUserActivityInput = {
  locale: string;
  event: UserActivitySnapshotInput["event"];
  status?: UserActivitySnapshotInput["status"];
  countryCode?: string;
  gestationalWeek?: number;
  lastRecommendedCalories?: number;
};

export async function syncCurrentUserActivity(input: SyncCurrentUserActivityInput) {
  const sessionUser = await getClientSessionUser(input.locale);
  const profile = sessionUser?.email
    ? await readUserProfile(input.locale).catch(() => null)
    : null;

  return syncUserActivitySnapshot({
    anonymousSessionId: sessionUser?.email ? undefined : getOrCreateAnonymousSessionId(),
    email: sessionUser?.email || undefined,
    displayName: profile?.displayName || sessionUser?.displayName || undefined,
    locale: input.locale,
    countryCode: input.countryCode ?? profile?.countryCode,
    gestationalWeek: input.gestationalWeek ?? profile?.gestationalWeek,
    status: input.status ?? (sessionUser?.email ? "saved_profile" : "anonymous"),
    event: input.event,
    lastRecommendedCalories: input.lastRecommendedCalories,
  });
}
