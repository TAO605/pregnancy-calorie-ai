"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { getAdminCopy } from "@/lib/i18n/admin-copy";
import type { Locale } from "@/lib/i18n/config";

type AdminShellProps = {
  locale: Locale;
  children: ReactNode;
};

export function AdminShell({ locale, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = getAdminCopy(locale);
  const items = [
    { href: "/admin/analytics", label: copy.shell.navAnalytics },
    { href: "/admin/users", label: copy.shell.navUsers },
    { href: "/admin/guidelines", label: copy.shell.navGuidelines },
    { href: "/admin/content", label: copy.shell.navContent },
  ];

  async function handleSignOut() {
    await fetch("/api/v1/admin/session", {
      method: "DELETE",
    });
    router.push("/admin/sign-in");
    router.refresh();
  }

  return (
    <div className="app-container py-8 md:py-10">
      <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
        <aside className="surface-card rounded-[2rem] p-6 md:sticky md:top-24 md:self-start">
          <div className="rounded-[1.4rem] bg-[rgba(255,255,255,0.84)] p-5 shadow-border">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.shell.eyebrow}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">
              {copy.shell.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {copy.shell.body}
            </p>
          </div>

          <nav className="mt-6 grid gap-2">
            {items.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#171717] text-white"
                      : "bg-white/72 text-muted shadow-border hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button type="button" className="cta-secondary mt-6 text-sm" onClick={handleSignOut}>
            {copy.shell.signOut}
          </button>
        </aside>

        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
