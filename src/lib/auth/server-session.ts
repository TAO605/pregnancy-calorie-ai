import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  hasUsableAuthenticatedSession,
} from "@/lib/auth/session";

export async function hasAuthenticatedServerSession() {
  const cookieStore = await cookies();
  return hasUsableAuthenticatedSession(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
    cookieStore.get(SESSION_PROVIDER_COOKIE_NAME)?.value,
    cookieStore.get(SESSION_USER_EMAIL_COOKIE_NAME)?.value,
  );
}
