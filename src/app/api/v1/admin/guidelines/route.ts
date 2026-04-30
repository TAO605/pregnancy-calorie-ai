import { NextResponse } from "next/server";

import { getAllGuidelinePacks } from "@/lib/calculator/guideline-store";
import { hasAuthenticatedAdminSession } from "@/lib/auth/admin-session";
import { withNoStoreHeaders } from "@/lib/http/no-store";

export async function GET() {
  if (!(await hasAuthenticatedAdminSession())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      withNoStoreHeaders({ status: 401 }),
    );
  }

  const packs = await getAllGuidelinePacks();
  return NextResponse.json({ packs }, withNoStoreHeaders());
}
