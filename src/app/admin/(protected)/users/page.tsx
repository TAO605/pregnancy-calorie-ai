import { getAdminUserPreviews } from "@/lib/admin/user-activity-store";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

const statusStyles = {
  anonymous: "bg-[rgba(255,122,89,0.08)] text-[#a34c36]",
  saved_profile: "bg-[rgba(10,114,239,0.08)] text-[#0a72ef]",
  active_tracking: "bg-[rgba(28,160,98,0.12)] text-[#1f8d5d]",
} as const;

function formatTimestamp(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminUsersPage() {
  const locale = await getPreferredRequestLocale();
  const copy = getAdminCopy(locale);
  const users = await getAdminUserPreviews();

  return (
    <div className="grid gap-6">
      <section className="surface-card rounded-[2rem] p-8 md:p-10">
        <span className="eyebrow">{copy.usersPage.eyebrow}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
          {copy.usersPage.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {copy.usersPage.body}
        </p>
      </section>

      <section className="surface-card rounded-[1.8rem] p-8">
        <div className="grid gap-4">
          {users.length === 0 ? (
            <article className="rounded-[1.3rem] bg-white/88 p-5 shadow-border">
              <p className="text-base font-semibold tracking-[-0.03em]">
                {copy.usersPage.emptyTitle}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{copy.usersPage.emptyBody}</p>
            </article>
          ) : (
            users.map((user) => (
              <article
                key={user.id}
                className="grid gap-5 rounded-[1.3rem] bg-white/88 p-5 shadow-border xl:grid-cols-[1.2fr_0.95fr_0.95fr_0.9fr_0.95fr_0.9fr]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold tracking-[-0.04em]">
                      {user.name === "Anonymous visitor"
                        ? copy.usersPage.anonymousVisitor
                        : user.name}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${statusStyles[user.status]}`}
                    >
                      {copy.usersPage.statusLabels[user.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {user.email === "No sign-in yet" ? copy.usersPage.noSignInYet : user.email}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {copy.usersPage.signUpSourceLabel}:{" "}
                    {copy.usersPage.signUpSourceLabels[user.signUpSource]}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {formatTimestamp(user.lastActivityAt, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {copy.usersPage.localeRegionLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                    {user.locale} / {user.countryCode}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {copy.usersPage.weekLabel} {user.gestationalWeek ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {copy.usersPage.calculatorLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                    {user.calculatorCount} {copy.usersPage.sessionsSuffix}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {copy.usersPage.latestTargetLabel}: {user.lastRecommendedCalories ?? "--"} kcal
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {copy.usersPage.aiCtaClicksLabel}: {user.resultAiClickCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {copy.usersPage.engagementLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                    {user.dashboardViewCount} {copy.usersPage.dashboardViewsSuffix}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {user.aiChatCount} {copy.usersPage.aiChatsSuffix}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {copy.usersPage.trackingLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                    {user.weightLogCount} {copy.usersPage.weightLogsSuffix}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {user.mealLogCount} {copy.usersPage.mealLogsSuffix}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {copy.usersPage.signalLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                    {copy.usersPage.signalLabels[user.status]}
                  </p>
                  <p className="mt-3 text-sm text-muted">{copy.usersPage.sortHint}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
