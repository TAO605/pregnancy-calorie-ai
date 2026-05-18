"use client";

import { useRouter } from "next/navigation";

import { signOutCurrentUser } from "@/lib/auth/client-session";

type SignOutButtonProps = {
  locale: string;
  label: string;
};

export function SignOutButton({ locale, label }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOutCurrentUser();
    router.push(`/${locale}/auth/sign-in`);
    router.refresh();
  }

  return (
    <button type="button" className="cta-secondary text-sm" onClick={handleSignOut}>
      {label}
    </button>
  );
}
