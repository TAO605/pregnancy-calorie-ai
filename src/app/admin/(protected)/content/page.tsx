import { ContentEditor } from "@/components/admin/content-editor";
import { getAllContentPages } from "@/lib/content/content-store";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

export default async function AdminContentPage() {
  const locale = await getPreferredRequestLocale();
  const copy = getAdminCopy(locale);
  const pages = await getAllContentPages();

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.contentPage.eyebrow}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.contentPage.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {copy.contentPage.body}
        </p>
      </section>

      <ContentEditor initialPages={pages} locale={locale} />
    </div>
  );
}
