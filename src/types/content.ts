export type ContentPageStatus = "draft" | "published";

export type ContentPage = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  body: string;
  status: ContentPageStatus;
  updatedAt: string;
};

export const analyticsAiEntrySources = [
  "calculator_result_primary",
  "calculator_result_follow_up",
  "dashboard_overview_plan",
  "dashboard_overview_recent_targets",
  "dashboard_weekly_checkin",
  "dashboard_weight_summary",
  "dashboard_weight_weekly_review",
  "dashboard_meals_plan",
  "dashboard_meals_weekly_review",
  "blog_article_tool_cta",
  "blog_article_footer",
] as const;

export type AnalyticsAiEntrySource = (typeof analyticsAiEntrySources)[number];

export const analyticsAiEntryBreakdownKeys = [
  ...analyticsAiEntrySources,
  "dashboard_weight",
  "unknown",
] as const;

export type AnalyticsAiEntryBreakdownKey =
  (typeof analyticsAiEntryBreakdownKeys)[number];

export const analyticsAiChatSourceKeys = [
  ...analyticsAiEntryBreakdownKeys,
  "direct",
] as const;

export type AnalyticsAiChatSourceKey = (typeof analyticsAiChatSourceKeys)[number];

export const analyticsAiPromptOrigins = [
  "manual_submit",
  "prefilled_prompt",
  "context_prompt",
  "history_reuse",
  "suggested_prompt",
] as const;

export type AnalyticsAiPromptOrigin = (typeof analyticsAiPromptOrigins)[number];

export const analyticsAiPromptOriginBreakdownKeys = [
  ...analyticsAiPromptOrigins,
  "unknown",
] as const;

export type AnalyticsAiPromptOriginBreakdownKey =
  (typeof analyticsAiPromptOriginBreakdownKeys)[number];

export const analyticsSignUpSources = [
  "marketing_nav",
  "calculator_result_save",
  "ai_page_save",
  "dashboard_gate",
] as const;

export type AnalyticsSignUpSource = (typeof analyticsSignUpSources)[number];

export const analyticsSignUpSourceBreakdownKeys = [
  ...analyticsSignUpSources,
  "unknown",
] as const;

export type AnalyticsSignUpSourceBreakdownKey =
  (typeof analyticsSignUpSourceBreakdownKeys)[number];

export const analyticsRetentionPromptSurfaces = ["ai", "result"] as const;

export type AnalyticsRetentionPromptSurface =
  (typeof analyticsRetentionPromptSurfaces)[number];

export const analyticsRetentionPromptSurfaceBreakdownKeys = [
  ...analyticsRetentionPromptSurfaces,
  "unknown",
] as const;

export type AnalyticsRetentionPromptSurfaceBreakdownKey =
  (typeof analyticsRetentionPromptSurfaceBreakdownKeys)[number];

export const analyticsRetentionPromptStates = ["guest", "member"] as const;

export type AnalyticsRetentionPromptState =
  (typeof analyticsRetentionPromptStates)[number];

export const analyticsRetentionPromptStateBreakdownKeys = [
  ...analyticsRetentionPromptStates,
  "unknown",
] as const;

export type AnalyticsRetentionPromptStateBreakdownKey =
  (typeof analyticsRetentionPromptStateBreakdownKeys)[number];

export const analyticsRetentionPromptDestinations = [
  "dashboard",
  "profile",
  "meals",
] as const;

export type AnalyticsRetentionPromptDestination =
  (typeof analyticsRetentionPromptDestinations)[number];

export const analyticsRetentionPromptDestinationBreakdownKeys = [
  ...analyticsRetentionPromptDestinations,
  "unknown",
] as const;

export type AnalyticsRetentionPromptDestinationBreakdownKey =
  (typeof analyticsRetentionPromptDestinationBreakdownKeys)[number];

export function isAnalyticsAiEntrySource(
  value: string | null | undefined,
): value is AnalyticsAiEntrySource {
  return (
    typeof value === "string" &&
    (analyticsAiEntrySources as readonly string[]).includes(value)
  );
}

export function isAnalyticsSignUpSource(
  value: string | null | undefined,
): value is AnalyticsSignUpSource {
  return (
    typeof value === "string" &&
    (analyticsSignUpSources as readonly string[]).includes(value)
  );
}

export type AnalyticsEventName =
  | "calculator_completed"
  | "ai_chat_started"
  | "ai_session_resumed"
  | "ai_risk_escalated"
  | "dashboard_viewed"
  | "ai_entry_clicked"
  | "result_ai_clicked"
  | "weight_ai_clicked"
  | "retention_cta_clicked"
  | "signup_completed"
  | "meal_log_created"
  | "weight_log_created"
  | "content_page_viewed"
  | "content_page_published";

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  locale: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};
