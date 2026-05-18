"use client";

import { signInWithPopup, signOut } from "firebase/auth";

import { clearStoredAiSessionSelections } from "@/lib/ai/active-session";
import {
  clearDemoSessionUser,
  clearStoredProductData,
  getDemoSessionUser,
  setDemoSessionUser,
} from "@/lib/demo/demo-store";
import { getFirebaseClient, waitForFirebaseUser } from "@/lib/firebase/client";
import {
  SESSION_COOKIE_NAME,
  SESSION_PROVIDER_COOKIE_NAME,
  SESSION_USER_EMAIL_COOKIE_NAME,
  isAuthenticatedSession,
} from "@/lib/auth/session";
import type { DemoSessionUser } from "@/types/product";

function mapFirebaseUserToSessionUser(
  user: NonNullable<Awaited<ReturnType<typeof waitForFirebaseUser>>>,
  locale: string,
): DemoSessionUser {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? user.email?.split("@")[0] ?? "Guest",
    locale,
    provider: "firebase",
    createdAt: new Date().toISOString(),
  };
}

function readCookieValue(name: string) {
  if (typeof document === "undefined") {
    return undefined;
  }

  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return match ? match.slice(prefix.length) : undefined;
}

function normalizeDemoSessionUser(user: DemoSessionUser, locale: string): DemoSessionUser {
  const normalizedEmail = user.email.trim().toLowerCase();
  const fallbackDisplayName = normalizedEmail.split("@")[0] || "Guest";

  return {
    ...user,
    email: normalizedEmail,
    displayName: user.displayName.trim() || fallbackDisplayName,
    locale,
  };
}

function restoreDemoSessionUserFromCookies(locale: string) {
  const sessionValue = readCookieValue(SESSION_COOKIE_NAME);
  const providerValue = readCookieValue(SESSION_PROVIDER_COOKIE_NAME);
  const emailValue = readCookieValue(SESSION_USER_EMAIL_COOKIE_NAME);

  if (
    !isAuthenticatedSession(sessionValue) ||
    providerValue === "firebase" ||
    typeof emailValue !== "string"
  ) {
    return null;
  }

  const normalizedEmail = decodeURIComponent(emailValue).trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  return {
    email: normalizedEmail,
    displayName: normalizedEmail.split("@")[0] || "Guest",
    locale,
    provider: "demo" as const,
    createdAt: new Date().toISOString(),
  };
}

function clearClientSessionCookies() {
  if (typeof document === "undefined") {
    return;
  }

  const secureAttribute =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_PROVIDER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_USER_EMAIL_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secureAttribute}`;
}

function persistClientSessionCookies(user: DemoSessionUser) {
  if (typeof document === "undefined") {
    return;
  }

  const secureAttribute =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${SESSION_COOKIE_NAME}=authenticated; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_PROVIDER_COOKIE_NAME}=${user.provider}; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
  document.cookie = `${SESSION_USER_EMAIL_COOKIE_NAME}=${encodeURIComponent(user.email)}; Path=/; Max-Age=2592000; SameSite=Lax${secureAttribute}`;
}

export async function getClientSessionUser(locale: string): Promise<DemoSessionUser | null> {
  const firebaseUser = await waitForFirebaseUser();

  if (firebaseUser) {
    const mapped = mapFirebaseUserToSessionUser(firebaseUser, locale);
    setDemoSessionUser(mapped);
    persistClientSessionCookies(mapped);
    return mapped;
  }

  const storedUser = getDemoSessionUser();

  if (storedUser?.provider === "demo") {
    const normalizedUser = normalizeDemoSessionUser(storedUser, locale);
    setDemoSessionUser(normalizedUser);
    persistClientSessionCookies(normalizedUser);
    return normalizedUser;
  }

  if (storedUser?.provider === "firebase") {
    clearDemoSessionUser();
    clearClientSessionCookies();
    return null;
  }

  if (readCookieValue(SESSION_PROVIDER_COOKIE_NAME) === "firebase") {
    clearClientSessionCookies();
    return null;
  }

  const restoredUser = restoreDemoSessionUserFromCookies(locale);

  if (restoredUser) {
    setDemoSessionUser(restoredUser);
    persistClientSessionCookies(restoredUser);
  }

  return restoredUser;
}

export async function signInWithGooglePopup(locale: string): Promise<DemoSessionUser> {
  const client = getFirebaseClient();

  if (!client) {
    throw new Error("Firebase is not configured.");
  }

  const credential = await signInWithPopup(client.auth, client.googleProvider);
  const mapped = mapFirebaseUserToSessionUser(credential.user, locale);
  setDemoSessionUser(mapped);
  persistClientSessionCookies(mapped);
  return mapped;
}

export async function signOutCurrentUser() {
  const client = getFirebaseClient();

  if (client) {
    await signOut(client.auth);
  }

  clearDemoSessionUser();
  clearStoredProductData();
  clearStoredAiSessionSelections();

  clearClientSessionCookies();
}
