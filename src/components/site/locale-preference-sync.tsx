"use client";

import { useEffect } from "react";

import { LOCALE_COOKIE_NAME, type Locale } from "@/lib/i18n/config";

type LocalePreferenceSyncProps = {
  locale: Locale;
};

export function LocalePreferenceSync({ locale }: LocalePreferenceSyncProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secureAttribute}`;
  }, [locale]);

  return null;
}
