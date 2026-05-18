import { NextResponse } from "next/server";
import { z } from "zod";

import { logAnalyticsEvent } from "@/lib/analytics/store";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/security/rate-limit";

const eventSchema = z.object({
  name: z.enum([
    "calculator_completed",
    "ai_chat_started",
    "ai_session_resumed",
    "ai_risk_escalated",
    "dashboard_viewed",
    "ai_entry_clicked",
    "result_ai_clicked",
    "weight_ai_clicked",
    "retention_cta_clicked",
    "signup_completed",
    "meal_log_created",
    "weight_log_created",
    "content_page_viewed",
    "content_page_published",
  ]),
  locale: z.string().min(2),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    namespace: "events",
    request,
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many analytics events. Please try again shortly." },
      withNoStoreHeaders({
        status: 429,
        headers: buildRateLimitHeaders(rateLimit),
      }),
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Please send a valid JSON request body." },
        withNoStoreHeaders({ status: 400 }),
      );
    }

    return NextResponse.json(
      { error: "Unable to read analytics event payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = eventSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid analytics event." },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const event = await logAnalyticsEvent(payload.data);
  return NextResponse.json(event, withNoStoreHeaders({
    headers: buildRateLimitHeaders(rateLimit),
  }));
}
