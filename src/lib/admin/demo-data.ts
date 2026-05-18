export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
};

export type AdminUserPreview = {
  id: string;
  name: string;
  email: string;
  locale: string;
  countryCode: string;
  gestationalWeek: number;
  status: "anonymous" | "saved_profile" | "active_tracking";
};

export const adminMetrics: AdminMetric[] = [
  {
    label: "Calculator completions",
    value: "1,284",
    detail: "Demo metric standing in for event ingestion",
  },
  {
    label: "AI escalations",
    value: "37",
    detail: "High-risk questions intercepted by guardrails",
  },
  {
    label: "Saved profiles",
    value: "214",
    detail: "Users who moved beyond anonymous usage",
  },
  {
    label: "Tracked locales",
    value: "3",
    detail: "English, Simplified Chinese, and Spanish",
  },
];

export const adminUsers: AdminUserPreview[] = [
  {
    id: "usr_1001",
    name: "Sophie M.",
    email: "sophie@example.com",
    locale: "en",
    countryCode: "US",
    gestationalWeek: 22,
    status: "active_tracking",
  },
  {
    id: "usr_1002",
    name: "Lin",
    email: "lin@example.cn",
    locale: "zh-CN",
    countryCode: "CN",
    gestationalWeek: 18,
    status: "saved_profile",
  },
  {
    id: "usr_1003",
    name: "Marina",
    email: "marina@example.es",
    locale: "es",
    countryCode: "ES",
    gestationalWeek: 28,
    status: "anonymous",
  },
  {
    id: "usr_1004",
    name: "Ava J.",
    email: "ava@example.com",
    locale: "en",
    countryCode: "GB",
    gestationalWeek: 31,
    status: "saved_profile",
  },
];
