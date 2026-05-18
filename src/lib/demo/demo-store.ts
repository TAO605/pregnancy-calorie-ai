import type {
  AiChatEntry,
  CalculatorSession,
  DemoUserDataBundle,
  DemoSessionUser,
  MealEntry,
  UserProfile,
  WeightEntry,
} from "@/types/product";
import {
  aiChatHistoryLimit,
  normalizeAiChatEntry,
  sortAiChatEntries,
} from "@/lib/ai/chat-history";

const SESSION_USER_KEY = "nd_demo_session_user_v1";
const PROFILE_KEY = "nd_demo_profile_v1";
const WEIGHT_KEY = "nd_demo_weight_entries_v1";
const MEAL_KEY = "nd_demo_meal_entries_v1";
const CALCULATOR_SESSION_KEY = "nd_demo_calculator_sessions_v1";
const AI_CHAT_KEY = "nd_demo_ai_chat_entries_v1";
const ANONYMOUS_SESSION_KEY = "nd_anonymous_session_id_v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or quota-constrained environments.
  }
}

function removeKey(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures; callers can continue with in-memory state.
  }
}

export function createDefaultProfile(locale: string, sessionUser?: DemoSessionUser | null): UserProfile {
  return {
    displayName: sessionUser?.displayName ?? "",
    email: sessionUser?.email ?? "",
    age: 30,
    heightCm: 165,
    prePregnancyWeightKg: 58,
    currentWeightKg: 61,
    gestationalWeek: 22,
    pregnancyType: "singleton",
    activityLevel: "moderate",
    countryCode: locale === "zh-CN" ? "CN" : locale === "es" ? "ES" : "US",
    locale,
    dietPreferences: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getDemoSessionUser(): DemoSessionUser | null {
  return readJson<DemoSessionUser | null>(SESSION_USER_KEY, null);
}

export function setDemoSessionUser(user: DemoSessionUser) {
  writeJson(SESSION_USER_KEY, user);
}

export function clearDemoSessionUser() {
  removeKey(SESSION_USER_KEY);
}

export function getOrCreateAnonymousSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_SESSION_KEY);
    if (existing) {
      return existing;
    }

    const created = crypto.randomUUID();
    window.localStorage.setItem(ANONYMOUS_SESSION_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

export function getStoredProfile(locale: string): UserProfile {
  const sessionUser = getDemoSessionUser();

  return readJson<UserProfile>(PROFILE_KEY, createDefaultProfile(locale, sessionUser));
}

export function hasStoredProfile() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(PROFILE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveStoredProfile(profile: UserProfile) {
  writeJson(PROFILE_KEY, { ...profile, updatedAt: new Date().toISOString() });
}

export function clearStoredProfile() {
  removeKey(PROFILE_KEY);
}

export function getStoredWeightEntries(): WeightEntry[] {
  const items = readJson<WeightEntry[]>(WEIGHT_KEY, []);
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function saveStoredWeightEntries(entries: WeightEntry[]) {
  writeJson(WEIGHT_KEY, entries);
}

export function clearStoredWeightEntries() {
  removeKey(WEIGHT_KEY);
}

export function addStoredWeightEntry(entry: Omit<WeightEntry, "id" | "createdAt">) {
  const items = getStoredWeightEntries();
  const nextEntry: WeightEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeJson(WEIGHT_KEY, [nextEntry, ...items]);
  return nextEntry;
}

export function seedWeightEntryIfEmpty(weightKg: number, note = "Initial profile weight") {
  const items = getStoredWeightEntries();
  if (items.length > 0) {
    return items;
  }

  const seeded = addStoredWeightEntry({
    date: new Date().toISOString().slice(0, 10),
    weightKg,
    note,
  });

  return [seeded];
}

function sortMealEntries(entries: MealEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.date === b.date) {
      return a.createdAt < b.createdAt ? 1 : -1;
    }

    return a.date < b.date ? 1 : -1;
  });
}

export function getStoredMealEntries(): MealEntry[] {
  const items = readJson<MealEntry[]>(MEAL_KEY, []);
  return sortMealEntries(items);
}

export function saveStoredMealEntries(entries: MealEntry[]) {
  writeJson(MEAL_KEY, sortMealEntries(entries));
}

export function clearStoredMealEntries() {
  removeKey(MEAL_KEY);
}

export function addStoredMealEntry(entry: Omit<MealEntry, "id" | "createdAt">) {
  const items = getStoredMealEntries();
  const nextEntry: MealEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeJson(MEAL_KEY, [nextEntry, ...items]);
  return nextEntry;
}

function sortCalculatorSessions(entries: CalculatorSession[]) {
  return [...entries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getStoredCalculatorSessions(): CalculatorSession[] {
  const items = readJson<CalculatorSession[]>(CALCULATOR_SESSION_KEY, []);
  return sortCalculatorSessions(items);
}

export function saveStoredCalculatorSessions(entries: CalculatorSession[]) {
  writeJson(CALCULATOR_SESSION_KEY, sortCalculatorSessions(entries));
}

export function clearStoredCalculatorSessions() {
  removeKey(CALCULATOR_SESSION_KEY);
}

export function addStoredCalculatorSession(
  entry: Omit<CalculatorSession, "id" | "createdAt">,
) {
  const items = getStoredCalculatorSessions();
  const nextEntry: CalculatorSession = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeJson(CALCULATOR_SESSION_KEY, [nextEntry, ...items]);
  return nextEntry;
}

export function getStoredAiChatEntries(): AiChatEntry[] {
  const items = readJson<AiChatEntry[]>(AI_CHAT_KEY, []);
  return sortAiChatEntries(items);
}

export function saveStoredAiChatEntries(entries: AiChatEntry[]) {
  writeJson(AI_CHAT_KEY, sortAiChatEntries(entries));
}

export function clearStoredAiChatEntries() {
  removeKey(AI_CHAT_KEY);
}

export function addStoredAiChatEntry(
  entry: Omit<AiChatEntry, "id" | "createdAt">,
) {
  const items = getStoredAiChatEntries();
  const nextEntry = normalizeAiChatEntry({
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });

  writeJson(AI_CHAT_KEY, [nextEntry, ...items].slice(0, aiChatHistoryLimit));
  return nextEntry;
}

export function getStoredDemoUserDataBundle(): DemoUserDataBundle {
  return {
    profile: hasStoredProfile() ? getStoredProfile("en") : null,
    weightEntries: getStoredWeightEntries(),
    mealEntries: getStoredMealEntries(),
    calculatorSessions: getStoredCalculatorSessions(),
    aiChatEntries: getStoredAiChatEntries(),
    updatedAt: new Date().toISOString(),
  };
}

export function saveStoredDemoUserDataBundle(bundle: DemoUserDataBundle) {
  if (bundle.profile) {
    saveStoredProfile(bundle.profile);
  } else {
    clearStoredProfile();
  }

  saveStoredWeightEntries(bundle.weightEntries);
  saveStoredMealEntries(bundle.mealEntries);
  saveStoredCalculatorSessions(bundle.calculatorSessions);
  saveStoredAiChatEntries(bundle.aiChatEntries);
}

export function clearStoredProductData() {
  clearStoredProfile();
  clearStoredWeightEntries();
  clearStoredMealEntries();
  clearStoredCalculatorSessions();
  clearStoredAiChatEntries();
}
