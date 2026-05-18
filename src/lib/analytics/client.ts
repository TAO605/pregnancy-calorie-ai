"use client";

import type { AnalyticsEventName } from "@/types/content";

type TrackEventInput = {
  name: AnalyticsEventName;
  locale: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function trackProductEvent(input: TrackEventInput) {
  try {
    await fetch("/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      keepalive: true,
    });
  } catch {
    // Ignore telemetry failures in the prototype.
  }
}
