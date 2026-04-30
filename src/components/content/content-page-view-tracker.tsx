"use client";

import { useEffect } from "react";

type ContentPageViewTrackerProps = {
  locale: string;
  slug: string;
};

export function ContentPageViewTracker({
  locale,
  slug,
}: ContentPageViewTrackerProps) {
  useEffect(() => {
    const storageKey = `nd:content-viewed:${locale}:${slug}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }

      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // If sessionStorage is unavailable, still record the page view best-effort.
    }

    void fetch("/api/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "content_page_viewed",
        locale,
        metadata: {
          slug,
        },
      }),
      keepalive: true,
    });
  }, [locale, slug]);

  return null;
}
