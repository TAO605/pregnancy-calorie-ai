"use client";

import Link from "next/link";

import { trackRetentionPromptClick } from "@/lib/analytics/retention-prompt";
import type { Locale } from "@/lib/i18n/config";
import type {
  AnalyticsRetentionPromptDestination,
  AnalyticsRetentionPromptState,
  AnalyticsRetentionPromptSurface,
} from "@/types/content";

type SaveProgressPromptActionTracking = {
  locale: Locale;
  surface: AnalyticsRetentionPromptSurface;
  state: AnalyticsRetentionPromptState;
  destination: AnalyticsRetentionPromptDestination;
};

type SaveProgressPromptAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  tracking?: SaveProgressPromptActionTracking;
};

type SaveProgressPromptProps = {
  eyebrow: string;
  title: string;
  body: string;
  badge?: string;
  actions: SaveProgressPromptAction[];
};

export function SaveProgressPrompt({
  eyebrow,
  title,
  body,
  badge,
  actions,
}: SaveProgressPromptProps) {
  return (
    <article className="surface-card relative overflow-hidden rounded-[1.8rem] p-8 md:p-10">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,122,89,0),rgba(255,122,89,0.56),rgba(10,114,239,0.56),rgba(10,114,239,0))]" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-[-0.07em] md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{body}</p>
        </div>

        {badge ? (
          <span className="rounded-full bg-[rgba(10,114,239,0.08)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0a72ef]">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={`${action.href}:${action.label}`}
            href={action.href}
            className={`${action.variant === "secondary" ? "cta-secondary" : "cta-primary"} text-sm`}
            onClick={() => {
              if (!action.tracking) {
                return;
              }

              trackRetentionPromptClick({
                ...action.tracking,
                variant: action.variant,
              });
            }}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
