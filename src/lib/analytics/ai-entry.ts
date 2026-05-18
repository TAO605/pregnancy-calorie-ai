import { syncCurrentUserActivity } from "@/lib/admin/client-user-activity";
import { trackProductEvent } from "@/lib/analytics/client";
import type { Locale } from "@/lib/i18n/config";
import type { AnalyticsAiEntrySource, AnalyticsEventName } from "@/types/content";

type AnalyticsMetadata = Record<string, string | number | boolean | null>;

type TrackAiEntryClickInput = {
  locale: Locale;
  source: AnalyticsAiEntrySource;
  analyticsEventName?: Extract<
    AnalyticsEventName,
    "ai_entry_clicked" | "result_ai_clicked" | "weight_ai_clicked"
  >;
  metadata?: AnalyticsMetadata;
  countryCode?: string;
  gestationalWeek?: number;
  lastRecommendedCalories?: number;
};

export function withAiEntrySource(
  href: string,
  source: AnalyticsAiEntrySource,
) {
  const [pathname, search = ""] = href.split("?");
  const params = new URLSearchParams(search);
  params.set("source", source);
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}

export function trackAiEntryClick({
  locale,
  source,
  analyticsEventName = "ai_entry_clicked",
  metadata,
  countryCode,
  gestationalWeek,
  lastRecommendedCalories,
}: TrackAiEntryClickInput) {
  void trackProductEvent({
    name: analyticsEventName,
    locale,
    metadata: {
      ...(metadata ?? {}),
      source,
    },
  });

  void syncCurrentUserActivity({
    locale,
    event: "ai_entry_clicked",
    countryCode,
    gestationalWeek,
    lastRecommendedCalories,
  });
}
