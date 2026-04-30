import { NextResponse } from "next/server";

import { getGuidelinePackByCountry } from "@/lib/calculator/guideline-store";

type RouteContext = {
  params: Promise<{ countryCode: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { countryCode } = await context.params;
  const pack = await getGuidelinePackByCountry(countryCode);

  return NextResponse.json(pack);
}
