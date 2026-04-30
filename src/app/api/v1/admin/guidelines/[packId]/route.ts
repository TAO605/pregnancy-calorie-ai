import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAuthenticatedAdminSession } from "@/lib/auth/admin-session";
import { updateGuidelinePack } from "@/lib/calculator/guideline-store";
import { withNoStoreHeaders } from "@/lib/http/no-store";

const updateSchema = z.object({
  displayName: z.string().min(3),
  countryCode: z.string().min(2).max(5),
  trimesterCalories: z.object({
    t1: z.coerce.number().min(0).max(2000),
    t2: z.coerce.number().min(0).max(2000),
    t3: z.coerce.number().min(0).max(2000),
  }),
  disclaimerKey: z.string().min(3),
});

const packIdSchema = z.enum(["us_acog", "uk_nhs", "intl_generic"]);

type RouteContext = {
  params: Promise<{ packId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await hasAuthenticatedAdminSession())) {
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
      { error: "Unable to read guideline payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = updateSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid guideline payload.", issues: payload.error.issues },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const { packId } = await context.params;
  const parsedPackId = packIdSchema.safeParse(packId);

  if (!parsedPackId.success) {
    return NextResponse.json(
      { error: "Unknown guideline pack." },
      withNoStoreHeaders({ status: 404 }),
    );
  }

  const nextPack = await updateGuidelinePack(parsedPackId.data, payload.data);

  return NextResponse.json(nextPack, withNoStoreHeaders());
}
