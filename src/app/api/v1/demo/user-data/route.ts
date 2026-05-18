import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  isAuthenticatedSession,
} from "@/lib/auth/session";
import {
  readDemoUserDataBundle,
  writeDemoUserDataBundle,
} from "@/lib/demo/server-user-data-store";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import {
  analyticsAiChatSourceKeys,
  analyticsAiPromptOrigins,
} from "@/types/content";

const activityLevelSchema = z.enum(["sedentary", "light", "moderate", "active"]);
const pregnancyTypeSchema = z.enum(["singleton", "multiple"]);

const userProfileSchema = z.object({
  displayName: z.string(),
  email: z.string(),
  age: z.number(),
  heightCm: z.number(),
  prePregnancyWeightKg: z.number(),
  currentWeightKg: z.number(),
  gestationalWeek: z.number(),
  pregnancyType: pregnancyTypeSchema,
  activityLevel: activityLevelSchema,
  countryCode: z.string(),
  locale: z.string(),
  dietPreferences: z.array(z.string()),
  updatedAt: z.string(),
});

const weightEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  weightKg: z.number(),
  note: z.string(),
  createdAt: z.string(),
});

const mealEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  items: z.array(
    z.object({
      name: z.string(),
      estimatedCalories: z.number(),
    }),
  ),
  totalCalories: z.number(),
  source: z.literal("manual"),
  createdAt: z.string(),
});

const calculatorSessionSchema = z.object({
  id: z.string(),
  locale: z.string(),
  countryCode: z.string(),
  sourcePage: z.string(),
  input: z.object({
    age: z.number(),
    heightCm: z.number(),
    prePregnancyWeightKg: z.number(),
    currentWeightKg: z.number().optional(),
    gestationalWeek: z.number(),
    activityLevel: activityLevelSchema,
    pregnancyType: pregnancyTypeSchema,
    countryCode: z.string(),
    locale: z.string(),
  }),
  output: z.object({
    recommendedCalories: z.number(),
    recommendedRangeMin: z.number(),
    recommendedRangeMax: z.number(),
    trimester: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    guidelinePackUsed: z.string(),
    guidelineDisplayName: z.string(),
    disclaimerKey: z.string(),
    riskFlags: z.array(z.string()),
    extraCalories: z.number(),
    bmiClass: z.enum(["underweight", "normal", "overweight", "obese"]),
  }),
  createdAt: z.string(),
});

const aiChatEntrySchema = z.object({
  id: z.string(),
  locale: z.string(),
  question: z.string(),
  answer: z.string(),
  bullets: z.array(z.string()),
  riskLevel: z.enum(["low", "high"]),
  medicalEscalation: z.boolean(),
  disclaimer: z.string(),
  sessionId: z.string(),
  messageIndex: z.number(),
  promptOrigin: z.enum(analyticsAiPromptOrigins),
  source: z.enum(analyticsAiChatSourceKeys),
  createdAt: z.string(),
});

const demoUserDataSchema = z.object({
  profile: userProfileSchema.nullable(),
  weightEntries: z.array(weightEntrySchema),
  mealEntries: z.array(mealEntrySchema),
  calculatorSessions: z.array(calculatorSessionSchema),
  aiChatEntries: z.array(aiChatEntrySchema),
  updatedAt: z.string().optional().default(""),
});

async function readAuthorizedEmail() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const providerValue = cookieStore.get(SESSION_PROVIDER_COOKIE_NAME)?.value;
  const emailValue = cookieStore.get(SESSION_USER_EMAIL_COOKIE_NAME)?.value;

  if (
    !isAuthenticatedSession(sessionValue) ||
    providerValue === "firebase" ||
    !emailValue
  ) {
    return null;
  }

  return decodeURIComponent(emailValue).trim().toLowerCase();
}

export async function GET() {
  const email = await readAuthorizedEmail();

  if (!email) {
    return NextResponse.json(
      { error: "Unauthorized." },
      withNoStoreHeaders({ status: 401 }),
    );
  }

  const bundle = await readDemoUserDataBundle(email);
  return NextResponse.json({ bundle }, withNoStoreHeaders());
}

export async function PUT(request: Request) {
  const email = await readAuthorizedEmail();

  if (!email) {
    return NextResponse.json(
      { error: "Unauthorized." },
      withNoStoreHeaders({ status: 401 }),
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
      { error: "Unable to read demo user data payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = demoUserDataSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid demo user data payload.", issues: payload.error.issues },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const bundle = await writeDemoUserDataBundle(email, payload.data);
  return NextResponse.json({ bundle }, withNoStoreHeaders());
}
