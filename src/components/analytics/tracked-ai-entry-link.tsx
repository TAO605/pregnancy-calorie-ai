"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import type { Locale } from "@/lib/i18n/config";
import type { AnalyticsAiEntrySource } from "@/types/content";

type TrackedAiEntryLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale: Locale;
  source: AnalyticsAiEntrySource;
  countryCode?: string;
  gestationalWeek?: number;
  lastRecommendedCalories?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export function TrackedAiEntryLink({
  href,
  locale,
  source,
  countryCode,
  gestationalWeek,
  lastRecommendedCalories,
  metadata,
  onClick,
  ...props
}: TrackedAiEntryLinkProps) {
  return (
    <Link
      href={withAiEntrySource(href, source)}
      onClick={(event) => {
        onClick?.(event);
        trackAiEntryClick({
          locale,
          source,
          metadata,
          countryCode,
          gestationalWeek,
          lastRecommendedCalories,
        });
      }}
      {...props}
    />
  );
}
