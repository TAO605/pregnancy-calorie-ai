import { GuidelinesEditor } from "@/components/admin/guidelines-editor";
import { getAllGuidelinePacks } from "@/lib/calculator/guideline-store";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

export default async function AdminGuidelinesPage() {
  const locale = await getPreferredRequestLocale();
  const copy = getAdminCopy(locale);
  const packs = await getAllGuidelinePacks();

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.guidelinesPage.eyebrow}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.guidelinesPage.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {copy.guidelinesPage.body}
        </p>
      </section>

      <GuidelinesEditor initialPacks={packs} locale={locale} />
    </div>
  );
}
