import type { Locale } from "@/lib/i18n/config";
import type { AnalyticsSignUpSource } from "@/types/content";

type BuildSignInHrefOptions = {
  locale: Locale;
  nextPath?: string;
  source?: AnalyticsSignUpSource;
};

export function buildSignInHref({
  locale,
  nextPath,
  source,
}: BuildSignInHrefOptions) {
  const params = new URLSearchParams();

  if (typeof nextPath === "string" && nextPath.startsWith(`/${locale}/`)) {
    params.set("next", nextPath);
  }

  if (source) {
    params.set("source", source);
  }

  const search = params.toString();
  return search ? `/${locale}/auth/sign-in?${search}` : `/${locale}/auth/sign-in`;
}
