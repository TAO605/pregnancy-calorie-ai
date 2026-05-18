import { cookies, headers } from "next/headers";

import {
  LOCALE_COOKIE_NAME,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { fromAcceptLanguage } from "@/lib/i18n/resolve-locale";

export async function getPreferredRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return fromAcceptLanguage(headerStore.get("accept-language"));
}
