export const SESSION_COOKIE_NAME = "nd_session";
export const SESSION_USER_EMAIL_COOKIE_NAME = "nd_user_email";
export const SESSION_PROVIDER_COOKIE_NAME = "nd_provider";

export function isAuthenticatedSession(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function hasUsableAuthenticatedSession(
  sessionValue: string | undefined,
  providerValue?: string,
  emailValue?: string,
): boolean {
  if (!isAuthenticatedSession(sessionValue)) {
    return false;
  }
  return Boolean(emailValue && emailValue.trim().length > 0);
}
