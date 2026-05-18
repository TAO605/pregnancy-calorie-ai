"use client";

import Link from "next/link";
import { useState } from "react";

import {
  getGuideTopic,
  guideTopicKeys,
  type GuideTopicKey,
} from "@/lib/content/guide-topic";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
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

function getTopicPreviewCopy(locale: Locale) {
  if (locale === "zh-CN") {
    return {
      allTopicsLabel: "\u5168\u90e8\u4e3b\u9898",
      filterLabel: "\u6309\u4e3b\u9898\u7b5b\u9009",
      label: "\u63a8\u65ad\u4e3b\u9898",
      hint: "\u6839\u636e slug \u81ea\u52a8\u5f52\u7c7b\uff0c\u7528\u4e8e blog \u6807\u7b7e\u3001\u7ed3\u6784\u5316\u6570\u636e\u548c analytics\u3002",
      visibleCount: (visible: number, total: number) =>
        `\u5f53\u524d\u663e\u793a ${visible} / ${total} \u7bc7\u5185\u5bb9`,
    };
  }

  if (locale === "es") {
    return {
      allTopicsLabel: "Todos los temas",
      filterLabel: "Filtrar por tema",
      label: "Tema inferido",
      hint: "Se calcula desde el slug para etiquetas del blog, datos estructurados y analitica.",
      visibleCount: (visible: number, total: number) =>
        `Mostrando ${visible} de ${total} paginas`,
    };
  }

  return {
    allTopicsLabel: "All topics",
    filterLabel: "Filter by topic",
    label: "Inferred topic",
    hint: "Derived from the slug for blog badges, structured data, and analytics.",
    visibleCount: (visible: number, total: number) =>
      `Showing ${visible} of ${total} pages`,
  };
}

export function ContentEditor({ initialPages, locale }: ContentEditorProps) {
  const copy = getAdminCopy(locale);
  const topicPreviewCopy = getTopicPreviewCopy(locale);
  const [pages, setPages] = useState<ContentPage[]>(initialPages);
  const [draft, setDraft] = useState<ContentPage>(createBlankPage(locale));
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<GuideTopicKey | "all">("all");
  const [isSaving, setIsSaving] = useState(false);
  const visiblePages = pages.filter((page) => {
    if (selectedTopic === "all") {
      return true;
    }

    const pageLocale = isLocale(page.locale) ? page.locale : locale;
    return getGuideTopic(page.slug, pageLocale).key === selectedTopic;
  });

  function resetDraft() {
    setDraft(createBlankPage(locale));
  }

  function renderTopicPreview(page: ContentPage) {
    const pageLocale = isLocale(page.locale) ? page.locale : locale;
    const guideTopic = getGuideTopic(page.slug, pageLocale);

    return (
      <div className="rounded-[1.2rem] bg-[rgba(10,114,239,0.06)] px-4 py-3 shadow-border">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {topicPreviewCopy.label}
          </p>
          <span className="rounded-full bg-[rgba(10,114,239,0.1)] px-3 py-1 text-xs font-semibold text-[#0a72ef]">
            {guideTopic.label}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">{topicPreviewCopy.hint}</p>
      </div>
    );
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
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  locale: event.target.value as Locale,
                }))
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
          {renderTopicPreview(draft)}
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

      <section className="surface-card rounded-[1.8rem] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {topicPreviewCopy.filterLabel}
            </p>
            <p className="mt-2 text-sm text-muted">
              {topicPreviewCopy.visibleCount(visiblePages.length, pages.length)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedTopic === "all"
                  ? "bg-[rgb(10,114,239)] text-white shadow-[0_16px_40px_rgba(10,114,239,0.2)]"
                  : "bg-white/88 text-muted shadow-border hover:bg-white"
              }`}
              onClick={() => setSelectedTopic("all")}
            >
              {topicPreviewCopy.allTopicsLabel}
            </button>
            {guideTopicKeys.map((topicKey) => {
              const guideTopic = getGuideTopic(topicKey, locale);
              const isActive = selectedTopic === topicKey;

              return (
                <button
                  key={topicKey}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[rgb(10,114,239)] text-white shadow-[0_16px_40px_rgba(10,114,239,0.2)]"
                      : "bg-white/88 text-muted shadow-border hover:bg-white"
                  }`}
                  onClick={() => setSelectedTopic(topicKey)}
                >
                  {guideTopic.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {visiblePages.map((page) => (
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
                      item.id === page.id
                        ? { ...item, locale: event.target.value as Locale }
                        : item,
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
            {renderTopicPreview(page)}
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
