"use client";

import Link from "next/link";

import { trackAiEntryClick, withAiEntrySource } from "@/lib/analytics/ai-entry";
import type { Locale } from "@/lib/i18n/config";
import { buildResultAiPrompt } from "@/lib/i18n/contextual-ai-prompts";

type ResultActionLinksProps = {
  locale: Locale;
  calculatorHref: string;
  aiHref: string;
  backLabel: string;
  aiLabel: string;
  source?: string | null;
  recommendedCalories?: number | null;
};

export function ResultActionLinks({
  locale,
  calculatorHref,
  aiHref,
  backLabel,
  aiLabel,
  source,
  recommendedCalories,
}: ResultActionLinksProps) {
  const aiPromptHref =
    typeof recommendedCalories === "number"
      ? withAiEntrySource(
          `${aiHref}?prompt=${encodeURIComponent(
            buildResultAiPrompt(locale, {
              recommendedCalories,
              source,
            }),
          )}`,
          "calculator_result_primary",
        )
      : withAiEntrySource(aiHref, "calculator_result_primary");

  function handleAiClick() {
    trackAiEntryClick({
      locale,
      source: "calculator_result_primary",
      analyticsEventName: "result_ai_clicked",
      metadata: {
        guidelineSource: source?.trim() || "unknown",
      },
      lastRecommendedCalories:
        typeof recommendedCalories === "number" ? recommendedCalories : undefined,
    });
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href={calculatorHref} className="cta-secondary">
        {backLabel}
      </Link>
      <Link href={aiPromptHref} className="cta-primary" onClick={handleAiClick}>
        {aiLabel}
      </Link>
    </div>
  );
}
