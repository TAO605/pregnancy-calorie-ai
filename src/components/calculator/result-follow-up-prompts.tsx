"use client";

import Link from "next/link";

import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import type { Locale } from "@/lib/i18n/config";

type ResultFollowUpPrompt = {
  title: string;
  body: string;
  cta: string;
  prompt: string;
};

type ResultFollowUpPromptsProps = {
  locale: Locale;
  source: string;
  recommendedCalories: number;
  aiHref: string;
  items: ResultFollowUpPrompt[];
};

export function ResultFollowUpPrompts({
  locale,
  source,
  recommendedCalories,
  aiHref,
  items,
}: ResultFollowUpPromptsProps) {
  function handleAiClick(entryPoint: string) {
    trackAiEntryClick({
      locale,
      source: "calculator_result_follow_up",
      analyticsEventName: "result_ai_clicked",
      metadata: {
        guidelineSource: source.trim() || "unknown",
        entryPoint,
      },
      lastRecommendedCalories: recommendedCalories,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-[1.4rem] bg-white/88 p-6 shadow-border">
          <h3 className="text-xl font-semibold tracking-[-0.04em]">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
          <Link
            href={withAiEntrySource(
              `${aiHref}?prompt=${encodeURIComponent(item.prompt)}`,
              "calculator_result_follow_up",
            )}
            className="cta-secondary mt-5 inline-flex text-sm"
            onClick={() => handleAiClick(item.title)}
          >
            {item.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}
