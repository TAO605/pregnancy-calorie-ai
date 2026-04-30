import { AdminSignInForm } from "@/components/admin/admin-sign-in-form";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

type AdminSignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSignInPage({
  searchParams,
}: AdminSignInPageProps) {
  const query = await searchParams;
  const locale = await getPreferredRequestLocale();
  const copy = getAdminCopy(locale);
  const nextValue = query.next;
  const nextPath =
    typeof nextValue === "string" && nextValue.startsWith("/admin/")
      ? nextValue
      : "/admin/analytics";

  return (
    <section className="app-container py-12 md:py-18">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card rounded-[2rem] p-8 md:p-10">
          <span className="eyebrow">{copy.signInPage.eyebrow}</span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
            {copy.signInPage.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {copy.signInPage.body}
          </p>
        </article>

        <article className="surface-card rounded-[2rem] p-8 md:p-10">
          <AdminSignInForm locale={locale} nextPath={nextPath} />
        </article>
      </div>
    </section>
  );
}
