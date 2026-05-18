import type { MetadataRoute } from "next";

import { getPublishedContentPages } from "@/lib/content/content-store";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/site";

const localizedStaticPaths = [
  "",
  "/ai",
  "/blog",
  "/legal/medical-disclaimer",
  "/tools/pregnancy-calorie-calculator",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    localizedStaticPaths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/tools/pregnancy-calorie-calculator" ? 0.9 : 0.7,
    })),
  );

  const contentEntries: MetadataRoute.Sitemap = (await getPublishedContentPages()).map((page) => ({
    url: `${SITE_URL}/${page.locale}/blog/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...contentEntries];
}
