import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { hasAuthenticatedAdminSession } from "@/lib/auth/admin-session";
import { getPreferredRequestLocale } from "@/lib/i18n/request-locale";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  if (!(await hasAuthenticatedAdminSession())) {
    redirect("/admin/sign-in");
  }

  const locale = await getPreferredRequestLocale();

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
