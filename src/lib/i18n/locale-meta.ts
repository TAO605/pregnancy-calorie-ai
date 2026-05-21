import fs from "node:fs";
import path from "node:path";

import type { Locale } from "@/lib/i18n/config";

type PageMetaKey = "home" | "pricing" | "about";

type LocaleMeta = {
  title?: string;
  description?: string;
};

export function getLocaleJsonMeta(locale: Locale, page: PageMetaKey): LocaleMeta {
  if (locale === "en") {
    return {};
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    locale,
    "common.json",
  );

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const title = data[`${page}.meta.title`];
    const description = data[`${page}.meta.description`];

    return {
      title: typeof title === "string" ? title : undefined,
      description: typeof description === "string" ? description : undefined,
    };
  } catch {
    return {};
  }
}
