"use client";

import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";

import { getClientSessionUser } from "@/lib/auth/client-session";
import { normalizeAiChatEntry } from "@/lib/ai/chat-history";
import {
  addStoredAiChatEntry,
  addStoredCalculatorSession,
  addStoredMealEntry,
  addStoredWeightEntry,
  createDefaultProfile,
  getDemoSessionUser,
  getStoredDemoUserDataBundle,
  getStoredAiChatEntries,
  getStoredCalculatorSessions,
  getStoredMealEntries,
  getStoredProfile,
  getStoredWeightEntries,
  hasStoredProfile,
  saveStoredDemoUserDataBundle,
  setDemoSessionUser,
  seedWeightEntryIfEmpty,
  saveStoredAiChatEntries,
  saveStoredCalculatorSessions,
  saveStoredMealEntries,
  saveStoredProfile,
  saveStoredWeightEntries,
} from "@/lib/demo/demo-store";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { NormalizedCalculatorInput } from "@/lib/validations/calculator-input";
import type {
  AiChatEntry,
  CalculatorSession,
  DemoUserDataBundle,
  DemoSessionUser,
  MealEntry,
  UserProfile,
  WeightEntry,
} from "@/types/product";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    displayName: profile.displayName.trim(),
    email: normalizeEmail(profile.email),
    countryCode: profile.countryCode.toUpperCase(),
    updatedAt: new Date().toISOString(),
  };
}

function applySessionEmail(profile: UserProfile, sessionUser?: DemoSessionUser | null) {
  const sessionEmail = normalizeEmail(sessionUser?.email ?? "");

  if (!sessionEmail) {
    return profile;
  }

  return {
    ...profile,
    email: sessionEmail,
  };
}

function hasSessionEmailMismatch(
  profile: Partial<UserProfile> | UserProfile | null | undefined,
  sessionUser?: DemoSessionUser | null,
) {
  const sessionEmail = normalizeEmail(sessionUser?.email ?? "");

  if (!sessionEmail) {
    return false;
  }

  return normalizeEmail(profile?.email ?? "") !== sessionEmail;
}

function syncDemoSessionProfile(
  sessionUser: DemoSessionUser | null | undefined,
  profile: UserProfile,
) {
  if (sessionUser?.provider !== "demo") {
    return;
  }

  const nextDisplayName = profile.displayName.trim() || sessionUser.displayName;
  const nextEmail = normalizeEmail(profile.email);

  if (
    sessionUser.displayName === nextDisplayName &&
    normalizeEmail(sessionUser.email) === nextEmail &&
    sessionUser.locale === profile.locale
  ) {
    return;
  }

  setDemoSessionUser({
    ...sessionUser,
    displayName: nextDisplayName,
    email: nextEmail,
    locale: profile.locale,
  });
}

function mapFirestoreProfile(
  locale: string,
  value: Partial<UserProfile> | undefined,
  sessionUser?: DemoSessionUser | null,
): UserProfile {
  const fallback = createDefaultProfile(locale, sessionUser ?? getDemoSessionUser());

  return normalizeProfile(
    applySessionEmail(
      {
        ...fallback,
        ...value,
        dietPreferences: Array.isArray(value?.dietPreferences)
          ? value.dietPreferences
          : fallback.dietPreferences,
        locale,
      },
      sessionUser,
    ),
  );
}

async function fetchDemoUserDataBundle() {
  try {
    const response = await fetch("/api/v1/demo/user-data", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { bundle?: DemoUserDataBundle | null };
    return payload.bundle ?? null;
  } catch {
    return null;
  }
}

async function persistDemoUserDataBundle(bundle: DemoUserDataBundle) {
  try {
    await fetch("/api/v1/demo/user-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bundle),
      keepalive: true,
    });
  } catch {
    // Ignore prototype persistence failures and keep local state usable.
  }
}

function hasPersistableDemoUserData(bundle: DemoUserDataBundle) {
  return Boolean(
    bundle.profile ||
      bundle.weightEntries.length > 0 ||
      bundle.mealEntries.length > 0 ||
      bundle.calculatorSessions.length > 0 ||
      bundle.aiChatEntries.length > 0,
  );
}

async function readOrBootstrapDemoUserDataBundle() {
  const serverBundle = await fetchDemoUserDataBundle();

  if (serverBundle) {
    saveStoredDemoUserDataBundle(serverBundle);
    return serverBundle;
  }

  const localBundle = getStoredDemoUserDataBundle();

  if (!hasPersistableDemoUserData(localBundle)) {
    return null;
  }

  await persistDemoUserDataBundle(localBundle);
  return localBundle;
}

async function seedFirebaseProfileFromLocalState(
  locale: string,
  sessionUser: DemoSessionUser,
) {
  const client = getFirebaseClient();

  if (!client || sessionUser.provider !== "firebase" || !sessionUser.uid || !hasStoredProfile()) {
    return null;
  }

  const localProfile = mapFirestoreProfile(locale, getStoredProfile(locale), sessionUser);
  await setDoc(doc(client.db, "profiles", sessionUser.uid), localProfile, { merge: true });
  saveStoredProfile(localProfile);
  return localProfile;
}

async function seedFirebaseCollectionFromLocalState<
  TEntry extends { id: string },
>(
  sessionUser: DemoSessionUser,
  collectionName: string,
  entries: TEntry[],
) {
  const client = getFirebaseClient();

  if (!client || sessionUser.provider !== "firebase" || !sessionUser.uid || entries.length === 0) {
    return entries;
  }

  await Promise.all(
    entries.map((entry) =>
      setDoc(doc(client.db, "profiles", sessionUser.uid!, collectionName, entry.id), entry),
    ),
  );

  return entries;
}

export async function readUserProfile(locale: string): Promise<UserProfile> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const profileRef = doc(client.db, "profiles", sessionUser.uid);
    const snapshot = await getDoc(profileRef);

    if (snapshot.exists()) {
      const rawProfile = snapshot.data() as Partial<UserProfile>;
      const profile = mapFirestoreProfile(locale, rawProfile, sessionUser);
      saveStoredProfile(profile);
      syncDemoSessionProfile(sessionUser, profile);
      return profile;
    }

    const seededLocalProfile = await seedFirebaseProfileFromLocalState(locale, sessionUser);

    if (seededLocalProfile) {
      syncDemoSessionProfile(sessionUser, seededLocalProfile);
      return seededLocalProfile;
    }

    const fallback = mapFirestoreProfile(locale, {
      displayName: sessionUser.displayName,
      email: sessionUser.email,
    }, sessionUser);
    saveStoredProfile(fallback);
    syncDemoSessionProfile(sessionUser, fallback);
    return fallback;
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (demoBundle?.profile) {
      const profile = mapFirestoreProfile(locale, demoBundle.profile, sessionUser);
      saveStoredProfile(profile);
      syncDemoSessionProfile(sessionUser, profile);

      if (hasSessionEmailMismatch(demoBundle.profile, sessionUser)) {
        await persistDemoUserDataBundle({
          ...demoBundle,
          profile,
        });
      }

      return profile;
    }

    return mapFirestoreProfile(locale, {
      displayName: sessionUser.displayName,
      email: sessionUser.email,
    }, sessionUser);
  }

  return getStoredProfile(locale);
}

export async function readSavedUserProfile(locale: string): Promise<UserProfile | null> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const profileRef = doc(client.db, "profiles", sessionUser.uid);
    const snapshot = await getDoc(profileRef);

    if (!snapshot.exists()) {
      return seedFirebaseProfileFromLocalState(locale, sessionUser);
    }

    const profile = mapFirestoreProfile(
      locale,
      snapshot.data() as Partial<UserProfile>,
      sessionUser,
    );
    saveStoredProfile(profile);
    syncDemoSessionProfile(sessionUser, profile);
    return profile;
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (!demoBundle?.profile) {
      return null;
    }

    const profile = mapFirestoreProfile(locale, demoBundle.profile, sessionUser);
    saveStoredProfile(profile);
    syncDemoSessionProfile(sessionUser, profile);

    if (hasSessionEmailMismatch(demoBundle.profile, sessionUser)) {
      await persistDemoUserDataBundle({
        ...demoBundle,
        profile,
      });
    }

    return profile;
  }

  if (!hasStoredProfile()) {
    return null;
  }

  return getStoredProfile(locale);
}

function getInitialWeightSeedNote(locale: string) {
  switch (locale) {
    case "zh-CN":
      return "\u6765\u81ea\u6700\u8fd1\u4e00\u6b21\u8ba1\u7b97\u5668\u7684\u521d\u59cb\u4f53\u91cd";
    case "es":
      return "Peso inicial guardado desde la ultima calculadora";
    default:
      return "Initial weight saved from the latest calculator";
  }
}

async function ensureInitialWeightEntry(locale: string, weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return;
  }

  const existingEntries = await readWeightEntries(locale);
  if (existingEntries.length > 0) {
    return;
  }

  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (!client || sessionUser?.provider !== "firebase" || !sessionUser.uid) {
    seedWeightEntryIfEmpty(weightKg, getInitialWeightSeedNote(locale));
    return;
  }

  await createWeightEntry(
    {
      date: new Date().toISOString().slice(0, 10),
      weightKg,
      note: getInitialWeightSeedNote(locale),
    },
    locale,
  );
}

export async function syncProfileFromCalculatorInput(
  input: NormalizedCalculatorInput,
): Promise<UserProfile> {
  const savedProfile = await readSavedUserProfile(input.locale);
  const sessionUser = await getClientSessionUser(input.locale);
  const baseProfile = savedProfile ?? createDefaultProfile(input.locale, sessionUser);
  const fallbackCurrentWeight =
    typeof savedProfile?.currentWeightKg === "number" && savedProfile.currentWeightKg > 0
      ? savedProfile.currentWeightKg
      : input.prePregnancyWeightKg;
  const nextProfile = await writeUserProfile({
    ...baseProfile,
    age: input.age,
    heightCm: input.heightCm,
    prePregnancyWeightKg: input.prePregnancyWeightKg,
    currentWeightKg: input.currentWeightKg ?? fallbackCurrentWeight,
    gestationalWeek: input.gestationalWeek,
    pregnancyType: input.pregnancyType,
    activityLevel: input.activityLevel,
    countryCode: input.countryCode,
    locale: input.locale,
  });

  await ensureInitialWeightEntry(input.locale, nextProfile.currentWeightKg);
  return nextProfile;
}

export async function writeUserProfile(profile: UserProfile): Promise<UserProfile> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(profile.locale);
  const normalized = normalizeProfile(applySessionEmail(profile, sessionUser));

  saveStoredProfile(normalized);
  syncDemoSessionProfile(sessionUser, normalized);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    await setDoc(doc(client.db, "profiles", sessionUser.uid), normalized, { merge: true });
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    await persistDemoUserDataBundle(getStoredDemoUserDataBundle());
  }

  return normalized;
}

export async function readWeightEntries(locale: string): Promise<WeightEntry[]> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);
  const localEntries = getStoredWeightEntries();

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const weightQuery = query(
      collection(client.db, "profiles", sessionUser.uid, "weight_entries"),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(weightQuery);

    if (!snapshot.empty) {
      const items = snapshot.docs.map((entry) => entry.data() as WeightEntry);
      saveStoredWeightEntries(items);
      return items;
    }

    if (localEntries.length > 0) {
      await seedFirebaseCollectionFromLocalState(sessionUser, "weight_entries", localEntries);
      return localEntries;
    }
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (demoBundle) {
      return demoBundle.weightEntries;
    }
  }

  return localEntries;
}

export async function createWeightEntry(
  entry: Omit<WeightEntry, "id" | "createdAt">,
  locale: string,
): Promise<WeightEntry> {
  const localEntry = addStoredWeightEntry(entry);
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    await setDoc(
      doc(client.db, "profiles", sessionUser.uid, "weight_entries", localEntry.id),
      localEntry,
    );

    const profileRef = doc(client.db, "profiles", sessionUser.uid);
    await setDoc(
      profileRef,
      {
        currentWeightKg: localEntry.weightKg,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    await persistDemoUserDataBundle(getStoredDemoUserDataBundle());
  }

  return localEntry;
}

export async function readMealEntries(locale: string): Promise<MealEntry[]> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);
  const localEntries = getStoredMealEntries();

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const mealQuery = query(
      collection(client.db, "profiles", sessionUser.uid, "meal_entries"),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(mealQuery);

    if (!snapshot.empty) {
      const items = snapshot.docs.map((entry) => entry.data() as MealEntry);
      saveStoredMealEntries(items);
      return items;
    }

    if (localEntries.length > 0) {
      await seedFirebaseCollectionFromLocalState(sessionUser, "meal_entries", localEntries);
      return localEntries;
    }
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (demoBundle) {
      return demoBundle.mealEntries;
    }
  }

  return localEntries;
}

export async function createMealEntry(
  entry: Omit<MealEntry, "id" | "createdAt">,
  locale: string,
): Promise<MealEntry> {
  const localEntry = addStoredMealEntry(entry);
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    await setDoc(
      doc(client.db, "profiles", sessionUser.uid, "meal_entries", localEntry.id),
      localEntry,
    );
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    await persistDemoUserDataBundle(getStoredDemoUserDataBundle());
  }

  return localEntry;
}

export async function readCalculatorSessions(locale: string): Promise<CalculatorSession[]> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);
  const localEntries = getStoredCalculatorSessions();

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const sessionQuery = query(
      collection(client.db, "profiles", sessionUser.uid, "calculator_sessions"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(sessionQuery);

    if (!snapshot.empty) {
      const items = snapshot.docs.map((entry) => entry.data() as CalculatorSession);
      saveStoredCalculatorSessions(items);
      return items;
    }

    if (localEntries.length > 0) {
      await seedFirebaseCollectionFromLocalState(
        sessionUser,
        "calculator_sessions",
        localEntries,
      );
      return localEntries;
    }
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (demoBundle) {
      return demoBundle.calculatorSessions;
    }
  }

  return localEntries;
}

export async function createCalculatorSession(
  entry: Omit<CalculatorSession, "id" | "createdAt">,
): Promise<CalculatorSession> {
  const localEntry = addStoredCalculatorSession(entry);
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(entry.locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    await setDoc(
      doc(client.db, "profiles", sessionUser.uid, "calculator_sessions", localEntry.id),
      localEntry,
    );
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    await persistDemoUserDataBundle(getStoredDemoUserDataBundle());
  }

  return localEntry;
}

export async function readAiChatEntries(locale: string): Promise<AiChatEntry[]> {
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);
  const localEntries = getStoredAiChatEntries();

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    const chatQuery = query(
      collection(client.db, "profiles", sessionUser.uid, "ai_chat_entries"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(chatQuery);

    if (!snapshot.empty) {
      const items = snapshot.docs.map((entry) =>
        normalizeAiChatEntry(entry.data() as AiChatEntry),
      );
      saveStoredAiChatEntries(items);
      return items;
    }

    if (localEntries.length > 0) {
      await seedFirebaseCollectionFromLocalState(sessionUser, "ai_chat_entries", localEntries);
      return localEntries.map((entry) => normalizeAiChatEntry(entry));
    }
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    const demoBundle = await readOrBootstrapDemoUserDataBundle();

    if (demoBundle) {
      return demoBundle.aiChatEntries.map((entry) => normalizeAiChatEntry(entry));
    }
  }

  return localEntries.map((entry) => normalizeAiChatEntry(entry));
}

export async function createAiChatEntry(
  entry: Omit<AiChatEntry, "id" | "createdAt">,
  locale: string,
): Promise<AiChatEntry> {
  const localEntry = addStoredAiChatEntry(entry);
  const client = getFirebaseClient();
  const sessionUser = await getClientSessionUser(locale);

  if (client && sessionUser?.provider === "firebase" && sessionUser.uid) {
    await setDoc(
      doc(client.db, "profiles", sessionUser.uid, "ai_chat_entries", localEntry.id),
      localEntry,
    );
  }

  if (sessionUser?.provider === "demo" && sessionUser.email) {
    await persistDemoUserDataBundle(getStoredDemoUserDataBundle());
  }

  return localEntry;
}
