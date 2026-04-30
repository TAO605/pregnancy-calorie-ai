const fallbackSiteUrl = "https://pregnancy-calorie-ai.vercel.app";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  fallbackSiteUrl
).replace(/\/$/, "");

export const SITE_NAME = "Nurture Daily";
