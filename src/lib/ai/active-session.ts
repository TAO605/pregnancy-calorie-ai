import { locales } from "@/lib/i18n/config";

const ACTIVE_AI_SESSION_KEY_PREFIX = "nd_active_ai_session_v1";
const NEW_AI_SESSION_MARKER = "__new__";

export type StoredAiSessionSelection = string | typeof NEW_AI_SESSION_MARKER | null;

function getActiveAiSessionKey(locale: string) {
  return `${ACTIVE_AI_SESSION_KEY_PREFIX}:${locale}`;
}

export function readStoredAiSessionSelection(locale: string): StoredAiSessionSelection {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(getActiveAiSessionKey(locale));
    if (!value) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

export function saveStoredActiveAiSessionId(locale: string, sessionId: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getActiveAiSessionKey(locale), sessionId);
  } catch {
    // Ignore storage failures; active session can still continue in memory.
  }
}

export function saveStoredNewAiSessionSelection(locale: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getActiveAiSessionKey(locale), NEW_AI_SESSION_MARKER);
  } catch {
    // Ignore storage failures; the UI can still reset current state.
  }
}

export function clearStoredAiSessionSelection(locale: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(getActiveAiSessionKey(locale));
  } catch {
    // Ignore storage failures.
  }
}

export function clearStoredAiSessionSelections() {
  if (typeof window === "undefined") {
    return;
  }

  for (const locale of locales) {
    try {
      window.localStorage.removeItem(getActiveAiSessionKey(locale));
    } catch {
      // Ignore storage failures and continue clearing other locales.
    }
  }
}

export function isStoredNewAiSessionSelection(
  value: StoredAiSessionSelection,
): value is typeof NEW_AI_SESSION_MARKER {
  return value === NEW_AI_SESSION_MARKER;
}
