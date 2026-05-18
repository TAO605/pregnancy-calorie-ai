import { NextResponse } from "next/server";
import { z } from "zod";

import { logAdminAuditEvent } from "@/lib/admin/audit-store";
import { logAnalyticsEvent } from "@/lib/analytics/store";
import { hasAuthenticatedAdminSession } from "@/lib/auth/admin-session";
import { getContentPageById, upsertContentPage } from "@/lib/content/content-store";
import { withNoStoreHeaders } from "@/lib/http/no-store";
import { locales } from "@/lib/i18n/config";

const contentSchema = z.object({
  slug: z.string().min(3),
  locale: z.enum(locales),
  title: z.string().min(3),
  description: z.string().min(10),
  body: z.string().min(20),
  status: z.enum(["draft", "published"]),
});

type RouteContext = {
  params: Promise<{ pageId: string }>;
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
      { error: "Unable to read content page payload." },
      withNoStoreHeaders({ status: 500 }),
    );
  }

  const payload = contentSchema.safeParse(json);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid content page payload.", issues: payload.error.issues },
      withNoStoreHeaders({ status: 400 }),
    );
  }

  const { pageId } = await context.params;
  try {
    const previousPage = await getContentPageById(pageId);
    const page = await upsertContentPage({
      id: pageId,
      ...payload.data,
    });
    await logAdminAuditEvent({
      action:
        page.status === "published" && previousPage?.status !== "published"
          ? "content_page_published"
          : "content_page_saved",
      resourceType: "content_page",
      resourceId: page.id,
      summary: `Saved content page: ${page.title}`,
      locale: page.locale,
      metadata: {
        slug: page.slug,
        status: page.status,
      },
    });

    if (page.status === "published" && previousPage?.status !== "published") {
      void logAnalyticsEvent({
        name: "content_page_published",
        locale: page.locale,
        metadata: {
          slug: page.slug,
        },
      }).catch(() => undefined);
    }

    return NextResponse.json(page, withNoStoreHeaders());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save content page.",
      },
      withNoStoreHeaders({ status: 400 }),
    );
  }
}
