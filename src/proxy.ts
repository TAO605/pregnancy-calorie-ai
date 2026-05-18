import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE_NAME,
  isAuthenticatedAdminSession,
} from "@/lib/auth/admin-session";
import { buildSignInHref } from "@/lib/auth/sign-in-link";
import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  hasUsableAuthenticatedSession,
} from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/config";

const ADMIN_SIGN_IN_PATH = "/admin/sign-in";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === ADMIN_SIGN_IN_PATH) {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (isAuthenticatedAdminSession(adminSession)) {
      return NextResponse.next();
    }

    const adminSignInUrl = request.nextUrl.clone();
    adminSignInUrl.pathname = ADMIN_SIGN_IN_PATH;
    adminSignInUrl.search = "";
    adminSignInUrl.searchParams.set("next", `${pathname}${search}`);

    return NextResponse.redirect(adminSignInUrl);
  }

  const [, locale, section] = pathname.split("/");

  if (section !== "dashboard" || !locale) {
    return NextResponse.next();
  }

  if (!isLocale(locale)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const provider = request.cookies.get(SESSION_PROVIDER_COOKIE_NAME)?.value;
  const email = request.cookies.get(SESSION_USER_EMAIL_COOKIE_NAME)?.value;

  if (hasUsableAuthenticatedSession(session, provider, email)) {
    return NextResponse.next();
  }

  const signInHref = buildSignInHref({
    locale,
    nextPath: `${pathname}${search}`,
    source: "dashboard_gate",
  });
  const [signInPathname, signInSearch = ""] = signInHref.split("?");
  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = signInPathname;
  signInUrl.search = signInSearch ? `?${signInSearch}` : "";

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/:locale/dashboard/:path*"],
};
