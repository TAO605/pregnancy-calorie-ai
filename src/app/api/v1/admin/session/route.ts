import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_SESSION_COOKIE_NAME,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/auth/admin-session";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import { buildRateLimitHeaders, checkRateLimit } from "@/lib/security/rate-limit";

const sessionSchema = z.object({
  password: z.string().min(1),
});

function getExpectedPassword() {
  const configuredPassword = process.env.ADMIN_DEMO_PASSWORD?.trim();

  if (configuredPassword) {
    return configuredPassword;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return DEFAULT_ADMIN_PASSWORD;
}

function shouldUseSecureCookie(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  return new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit({
    namespace: "admin-session",
    request,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
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
      { error: "Unable to read admin session payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = sessionSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Password is required." },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const expectedPassword = getExpectedPassword();

  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin password is not configured." },
      withNoStoreHeaders({ status: 503 }),
    );
  }

  if (payload.data.password !== expectedPassword) {
    return NextResponse.json(
      { error: "Invalid admin password." },
      withNoStoreHeaders({ status: 401 }),
    );
  }

  const response = NextResponse.json(
    { ok: true },
    withNoStoreHeaders({
      headers: buildRateLimitHeaders(rateLimit),
    }),
  );
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ ok: true }, withNoStoreHeaders());
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    maxAge: 0,
    path: "/",
  });

  return response;
}
