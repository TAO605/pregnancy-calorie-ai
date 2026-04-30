"use client";

import Link from "next/link";
import { useState } from "react";

import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { locales, type Locale } from "@/lib/i18n/config";
import type { ContentPage } from "@/types/content";

type ContentEditorProps = {
  initialPages: ContentPage[];
  locale: Locale;
};

function createBlankPage(locale: Locale): ContentPage {
  return {
    id: "",
    slug: "",
    locale,
    title: "",
    description: "",
    body: "",
    status: "draft",
    updatedAt: "",
  };
}

export function ContentEditor({ initialPages, locale }: ContentEditorProps) {
  const copy = getAdminCopy(locale);
  const [pages, setPages] = useState<ContentPage[]>(initialPages);
  const [draft, setDraft] = useState<ContentPage>(createBlankPage(locale));
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function resetDraft() {
    setDraft(createBlankPage(locale));
  }

  async function savePage(page: ContentPage, isNew: boolean) {
    setIsSaving(true);
    setMessage("");

    try {
      const nextId = page.id || `page_${crypto.randomUUID().slice(0, 8)}`;
      const response = await fetch(
        isNew ? "/api/v1/admin/content/pages" : `/api/v1/admin/content/pages/${nextId}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: nextId,
            slug: page.slug,
            locale: page.locale,
            title: page.title,
            description: page.description,
            body: page.body,
            status: page.status,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.contentEditor.saveError);
      }

      setPages((current) => {
        const remaining = current.filter((item) => item.id !== data.id);
        return [data, ...remaining].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      });
      setMessage(copy.contentEditor.formatSavedMessage(data.title));

      if (isNew) {
        resetDraft();
      }
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : copy.contentEditor.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-[1.3rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border">
          {message}
        </div>
      ) : null}

      <article className="surface-card rounded-[1.8rem] p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.contentEditor.newPageEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em]">
              {copy.contentEditor.newPageTitle}
            </h2>
          </div>

          <button
            type="button"
            className="cta-primary text-sm"
            onClick={() => void savePage(draft, true)}
            disabled={isSaving}
          >
            {isSaving ? copy.contentEditor.savingLabel : copy.contentEditor.createPageLabel}
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <select
              className="field-input"
              value={draft.locale}
              onChange={(event) => setDraft((current) => ({ ...current, locale: event.target.value }))}
            >
              {locales.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              className="field-input"
              value={draft.slug}
              onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
              placeholder={copy.contentEditor.slugPlaceholder}
            />
            <select
              className="field-input"
              value={draft.status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as ContentPage["status"],
                }))
              }
            >
              <option value="draft">{copy.contentEditor.statusLabels.draft}</option>
              <option value="published">{copy.contentEditor.statusLabels.published}</option>
            </select>
          </div>
          <input
            className="field-input"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder={copy.contentEditor.titlePlaceholder}
          />
          <textarea
            className="field-input min-h-28 resize-y"
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({ ...current, description: event.target.value }))
            }
            placeholder={copy.contentEditor.descriptionPlaceholder}
          />
          <textarea
            className="field-input min-h-44 resize-y"
            value={draft.body}
            onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
            placeholder={copy.contentEditor.bodyPlaceholder}
          />
        </div>
      </article>

      {pages.map((page) => (
        <article key={page.id} className="surface-card rounded-[1.8rem] p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {page.locale} / {copy.contentEditor.statusLabels[page.status]}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em]">{page.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {page.status === "published" ? (
                <Link
                  href={`/${page.locale}/blog/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-secondary text-sm"
                >
                  {copy.contentEditor.openLiveLabel}
                </Link>
              ) : null}
              <button
                type="button"
                className="cta-secondary text-sm"
                onClick={() => void savePage(page, false)}
                disabled={isSaving}
              >
                {isSaving ? copy.contentEditor.savingLabel : copy.contentEditor.saveLabel}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <select
                className="field-input"
                value={page.locale}
                onChange={(event) =>
                  setPages((current) =>
                    current.map((item) =>
                      item.id === page.id ? { ...item, locale: event.target.value } : item,
                    ),
                  )
                }
              >
                {locales.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                className="field-input"
                value={page.slug}
                onChange={(event) =>
                  setPages((current) =>
                    current.map((item) =>
                      item.id === page.id ? { ...item, slug: event.target.value } : item,
                    ),
                  )
                }
              />
              <select
                className="field-input"
                value={page.status}
                onChange={(event) =>
                  setPages((current) =>
                    current.map((item) =>
                      item.id === page.id
                        ? { ...item, status: event.target.value as ContentPage["status"] }
                        : item,
                    ),
                  )
                }
              >
                <option value="draft">{copy.contentEditor.statusLabels.draft}</option>
                <option value="published">{copy.contentEditor.statusLabels.published}</option>
              </select>
            </div>
            <input
              className="field-input"
              value={page.title}
              onChange={(event) =>
                setPages((current) =>
                  current.map((item) =>
                    item.id === page.id ? { ...item, title: event.target.value } : item,
                  ),
                )
              }
            />
            <textarea
              className="field-input min-h-28 resize-y"
              value={page.description}
              onChange={(event) =>
                setPages((current) =>
                  current.map((item) =>
                    item.id === page.id ? { ...item, description: event.target.value } : item,
                  ),
                )
              }
            />
            <textarea
              className="field-input min-h-44 resize-y"
              value={page.body}
              onChange={(event) =>
                setPages((current) =>
                  current.map((item) =>
                    item.id === page.id ? { ...item, body: event.target.value } : item,
                  ),
                )
              }
            />
          </div>
        </article>
      ))}
    </div>
  );
}
