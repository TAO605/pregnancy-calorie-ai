import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { logAnalyticsEvent } from "@/lib/analytics/store";
import { buildAssistantResponse } from "@/lib/ai/pregnancy-nutrition-response";
import { findRiskKeywords } from "@/lib/ai/risk-keywords";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import { locales } from "@/lib/i18n/config";
import {
  analyticsAiEntrySources,
  analyticsAiPromptOrigins,
} from "@/types/content";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/security/rate-limit";

const requestSchema = z.object({
  locale: z.enum(locales),
  question: z.string().trim().min(6).max(500),
  source: z.enum(analyticsAiEntrySources).optional(),
  sessionId: z.string().trim().uuid().optional(),
  isFollowUp: z.boolean().optional(),
  messageIndex: z.number().int().min(1).max(50).optional(),
  promptOrigin: z.enum(analyticsAiPromptOrigins).optional(),
  history: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(500),
        answer: z.string().trim().min(1).max(2000),
        riskLevel: z.union([z.literal("low"), z.literal("high")]),
        medicalEscalation: z.boolean(),
      }),
    )
    .max(6)
    .optional(),
  context: z
    .object({
      latestCalculation: z
        .object({
          recommendedCalories: z.number().int().positive(),
          recommendedRangeMin: z.number().int().positive(),
          recommendedRangeMax: z.number().int().positive(),
          trimester: z.union([z.literal(1), z.literal(2), z.literal(3)]),
          guidelineDisplayName: z.string().trim().min(2).max(120),
          countryCode: z.string().trim().min(2).max(3),
          gestationalWeek: z.number().int().min(1).max(42),
          riskFlags: z.array(z.string()).max(8),
        })
        .optional(),
      mealSummary: z
        .object({
          recentMealCount: z.number().int().min(0).max(365),
          averageMealCalories: z.number().int().min(0).max(4000),
          todayLoggedCalories: z.number().int().min(0).max(6000).optional(),
          lastLoggedDate: z.string().trim().min(8).max(32).optional(),
        })
        .optional(),
      weightSummary: z
        .object({
          currentWeightKg: z.number().positive().max(400),
          recentWeightCount: z.number().int().min(0).max(365),
          latestEntryDeltaKg: z.number().min(-50).max(50).optional(),
          recentTrendDeltaKg: z.number().min(-50).max(50).optional(),
          prePregnancyWeightKg: z.number().positive().max(400).optional(),
          prePregnancyDeltaKg: z.number().min(-100).max(100).optional(),
          lastLoggedDate: z.string().trim().min(8).max(32).optional(),
          gestationalWeek: z.number().int().min(1).max(42).optional(),
        })
        .optional(),
      profilePreferences: z
        .object({
          dietPreferences: z.array(z.string().trim().min(2).max(40)).max(8),
        })
        .optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    namespace: "ai-chat",
    request,
    limit: 30,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many AI requests. Please try again shortly." },
      withNoStoreHeaders({
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }),
    );
  }

  try {
    const json = await request.json();
    const payload = requestSchema.parse(json);
    const matchedKeywords = findRiskKeywords(payload.locale, payload.question);
    const latestHistoryTurn = payload.history?.at(-1);
    const source = payload.source ?? "direct";
    const hasContext = Boolean(payload.context);
    const isFollowUp = payload.isFollowUp ?? false;
    const messageIndex = payload.messageIndex ?? 1;
    const response = buildAssistantResponse(
      payload.locale,
      payload.question,
      matchedKeywords.length > 0,
      payload.context,
      payload.history,
    );
    const shouldEscalate = response.medicalEscalation;
    void logAnalyticsEvent({
      name: "ai_chat_started",
      locale: payload.locale,
      metadata: {
        risk: shouldEscalate,
        source,
        hasContext,
        sessionId: payload.sessionId ?? null,
        isFollowUp,
        messageIndex,
        promptOrigin: payload.promptOrigin ?? "manual_submit",
      },
    }).catch(() => undefined);

    if (shouldEscalate) {
      void logAnalyticsEvent({
        name: "ai_risk_escalated",
        locale: payload.locale,
        metadata: {
          source,
          hasContext,
          sessionId: payload.sessionId ?? null,
          isFollowUp,
          messageIndex,
          promptOrigin: payload.promptOrigin ?? "manual_submit",
          matchedKeywords:
            matchedKeywords.length > 0
              ? matchedKeywords.join(", ")
              : latestHistoryTurn?.medicalEscalation
                ? "session_carryover"
                : "",
        },
      }).catch(() => undefined);
    }

    return NextResponse.json(
      {
        ...response,
        matchedKeywords,
      },
      withNoStoreHeaders({
        headers: buildRateLimitHeaders(rateLimit),
      }),
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Please send a short nutrition question.",
          issues: error.issues,
        },
        withNoStoreHeaders({ status: 400 }),
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Please send a valid JSON request body." },
        withNoStoreHeaders({ status: 400 }),
      );
    }

    return NextResponse.json(
      { error: "Unable to generate a response right now." },
      withNoStoreHeaders({ status: 500 }),
    );
  }
}
