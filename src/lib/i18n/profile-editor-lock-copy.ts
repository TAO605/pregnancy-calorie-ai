import type { Locale } from "@/lib/i18n/config";

const copy: Record<Locale, string> = {
  en: "Email is managed by your sign-in session and cannot be edited here.",
  "zh-CN": "\u90ae\u7bb1\u7531\u5f53\u524d\u767b\u5f55\u8eab\u4efd\u7ba1\u7406\uff0c\u4e0d\u80fd\u5728\u8fd9\u91cc\u4fee\u6539\u3002",
  es: "El correo lo gestiona la sesi\u00f3n iniciada y no puede editarse aqu\u00ed.",
};

export function getProfileEditorLockCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}
