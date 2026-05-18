import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { locales } from "@/lib/i18n/config";
import { writeFileAtomic } from "@/lib/server/atomic-file";
import type { ContentPage } from "@/types/content";

const contentFilePath = path.join(process.cwd(), "data", "content-pages.json");

const contentPageSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  locale: z.enum(locales),
  title: z.string().min(3),
  description: z.string().min(10),
  body: z.string().min(20),
  status: z.enum(["draft", "published"]),
  updatedAt: z.string().min(5),
});

function normalizeContentSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureContentFile() {
  await mkdir(path.dirname(contentFilePath), { recursive: true });

  try {
    await readFile(contentFilePath, "utf8");
  } catch {
    await writeFile(contentFilePath, "[]\n", "utf8");
  }
}

async function readContentPages(): Promise<ContentPage[]> {
  await ensureContentFile();
  const raw = await readFile(contentFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as ContentPage[];
    return parsed
      .map((page) => contentPageSchema.parse(page))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch {
    return [];
  }
}

async function writeContentPages(pages: ContentPage[]) {
  await ensureContentFile();
  await writeFileAtomic(contentFilePath, `${JSON.stringify(pages, null, 2)}\n`);
}

export async function getAllContentPages() {
  return readContentPages();
}

export async function getPublishedContentPages(locale?: string) {
  const pages = await readContentPages();
  return pages.filter(
    (page) => page.status === "published" && (!locale || page.locale === locale),
  );
}

export async function getContentPageById(id: string) {
  const pages = await readContentPages();
  return pages.find((page) => page.id === id) ?? null;
}

export async function getContentPageBySlug(locale: string, slug: string) {
  const pages = await readContentPages();
  return (
    pages.find(
      (page) => page.locale === locale && page.slug === slug && page.status === "published",
    ) ?? null
  );
}

export async function upsertContentPage(
  payload: Omit<ContentPage, "updatedAt">,
): Promise<ContentPage> {
  const pages = await readContentPages();
  const nextPage = contentPageSchema.parse({
    ...payload,
    slug: normalizeContentSlug(payload.slug),
    updatedAt: new Date().toISOString(),
  });
  const duplicatePage = pages.find(
    (page) =>
      page.id !== payload.id &&
      page.locale === nextPage.locale &&
      page.slug === nextPage.slug,
  );

  if (duplicatePage) {
    throw new Error("A content page with the same locale and slug already exists.");
  }

  const existingIndex = pages.findIndex((page) => page.id === payload.id);

  if (existingIndex >= 0) {
    pages[existingIndex] = nextPage;
  } else {
    pages.unshift(nextPage);
  }

  await writeContentPages(pages);
  return nextPage;
}
