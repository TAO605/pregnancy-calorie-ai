import { NextResponse } from "next/server";
import { z } from "zod";

import { upsertUserActivitySnapshot } from "@/lib/admin/user-activity-store";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import { locales } from "@/lib/i18n/config";
import { analyticsSignUpSources } from "@/types/content";

const snapshotSchema = z
  .object({
    anonymousSessionId: z.string().trim().min(8).max(120).optional(),
    email: z.string().trim().email().max(160).optional(),
    displayName: z.string().trim().min(1).max(80).optional(),
    signUpSource: z.enum(analyticsSignUpSources).optional(),
    locale: z.enum(locales),
    countryCode: z.string().trim().min(2).max(3).optional(),
    gestationalWeek: z.number().int().min(1).max(42).optional(),
    status: z.enum(["anonymous", "saved_profile", "active_tracking"]),
    event: z.enum([
      "calculator_completed",
      "signup_completed",
      "profile_saved",
      "ai_chat_started",
      "ai_entry_clicked",
      "result_ai_clicked",
      "dashboard_viewed",
      "weight_log_created",
      "meal_log_created",
    ]),
    lastRecommendedCalories: z.number().int().min(0).max(5000).optional(),
  })
  .refine((value) => Boolean(value.email || value.anonymousSessionId), {
    message: "Email or anonymousSessionId is required.",
    path: ["email"],
  });

export async function POST(request: Request) {
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
      { error: "Unable to read user snapshot payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = snapshotSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid user snapshot.", issues: payload.error.issues },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const record = await upsertUserActivitySnapshot(payload.data);
  return NextResponse.json(record, withNoStoreHeaders());
}
