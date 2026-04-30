import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logAnalyticsEvent } from "@/lib/analytics/store";
import { calculatePregnancyCalories } from "@/lib/calculator/calculate-pregnancy-calories";
import { getGuidelinePackByCountry } from "@/lib/calculator/guideline-store";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import {
  calculatorInputSchema,
  normalizeCalculatorInput,
} from "@/lib/validations/calculator-input";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    namespace: "calculator",
    request,
    limit: 60,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many calculator requests. Please try again shortly." },
      withNoStoreHeaders({
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }),
    );
  }

  try {
    const json = await request.json();
    const parsed = calculatorInputSchema.parse(json);
    const normalized = normalizeCalculatorInput(parsed);
    const guidelinePack = await getGuidelinePackByCountry(normalized.countryCode);
    const result = calculatePregnancyCalories(normalized, guidelinePack);
    void logAnalyticsEvent({
      name: "calculator_completed",
      locale: normalized.locale,
      metadata: {
        countryCode: normalized.countryCode,
        guidelinePack: result.guidelinePackUsed,
        trimester: result.trimester,
      },
    }).catch(() => undefined);

    return NextResponse.json(result, withNoStoreHeaders({
      headers: buildRateLimitHeaders(rateLimit),
    }));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Please check your inputs and try again.",
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
      { error: "Unable to calculate calories right now." },
      withNoStoreHeaders({ status: 500 }),
    );
  }
}
