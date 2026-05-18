"use client";

import { trackProductEvent } from "@/lib/analytics/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  AnalyticsRetentionPromptDestination,
  AnalyticsRetentionPromptState,
  AnalyticsRetentionPromptSurface,
} from "@/types/content";

type TrackRetentionPromptClickInput = {
  locale: Locale;
  surface: AnalyticsRetentionPromptSurface;
  state: AnalyticsRetentionPromptState;
  destination: AnalyticsRetentionPromptDestination;
  variant?: "primary" | "secondary";
};

export function trackRetentionPromptClick({
  locale,
  surface,
  state,
  destination,
  variant = "primary",
}: TrackRetentionPromptClickInput) {
  void trackProductEvent({
    name: "retention_cta_clicked",
    locale,
    metadata: {
      surface,
      state,
      destination,
      variant,
    },
  });
}
