import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "nd_admin_session";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

export function isAuthenticatedAdminSession(value: string | undefined): boolean {
  return value === "authenticated";
}

export async function hasAuthenticatedAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  return isAuthenticatedAdminSession(session);
}
