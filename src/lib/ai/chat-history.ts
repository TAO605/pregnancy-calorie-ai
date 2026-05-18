import {
  analyticsAiChatSourceKeys,
  analyticsAiPromptOrigins,
  type AnalyticsAiChatSourceKey,
  type AnalyticsAiPromptOrigin,
} from "@/types/content";
import type { AiChatEntry } from "@/types/product";

export const aiChatHistoryLimit = 24;

export type AiChatSessionGroup = {
  sessionId: string;
  source: AnalyticsAiChatSourceKey;
  promptOrigin: AnalyticsAiPromptOrigin;
  entries: AiChatEntry[];
  latestEntry: AiChatEntry;
  messageCount: number;
  latestCreatedAt: string;
  hasMedicalEscalation: boolean;
};

export function normalizeAiChatEntry(entry: AiChatEntry): AiChatEntry {
  const promptOrigin =
    typeof entry.promptOrigin === "string" &&
    (analyticsAiPromptOrigins as readonly string[]).includes(entry.promptOrigin)
      ? entry.promptOrigin
      : "manual_submit";
  const source =
    typeof entry.source === "string" &&
    (analyticsAiChatSourceKeys as readonly string[]).includes(entry.source)
      ? entry.source
      : "direct";
  const messageIndex =
    Number.isInteger(entry.messageIndex) && (entry.messageIndex ?? 0) > 0
      ? entry.messageIndex
      : 1;
  const sessionId =
    typeof entry.sessionId === "string" && entry.sessionId.trim().length > 0
      ? entry.sessionId
      : `legacy-${entry.id}`;

  return {
    ...entry,
    sessionId,
    messageIndex,
    promptOrigin: promptOrigin as AnalyticsAiPromptOrigin,
    source: source as AnalyticsAiChatSourceKey,
  };
}

export function sortAiChatEntries(entries: AiChatEntry[]) {
  return [...entries]
    .map((entry) => normalizeAiChatEntry(entry))
    .sort((left, right) => (left.createdAt < right.createdAt ? 1 : -1));
}

export function sortAiChatSessionEntries(entries: AiChatEntry[]) {
  return [...entries]
    .map((entry) => normalizeAiChatEntry(entry))
    .sort((left, right) => {
      if (left.messageIndex !== right.messageIndex) {
        return left.messageIndex - right.messageIndex;
      }

      return left.createdAt > right.createdAt ? 1 : -1;
    });
}

export function getAiSessionEntries(
  entries: AiChatEntry[],
  preferredSessionId?: string | null,
) {
  const sortedEntries = sortAiChatEntries(entries);
  const resolvedSessionId =
    typeof preferredSessionId === "string" &&
    preferredSessionId.trim().length > 0 &&
    sortedEntries.some((entry) => entry.sessionId === preferredSessionId)
      ? preferredSessionId
      : sortedEntries[0]?.sessionId;

  if (!resolvedSessionId) {
    return [];
  }

  return sortAiChatSessionEntries(
    sortedEntries.filter((entry) => entry.sessionId === resolvedSessionId),
  );
}

export function getLatestAiSessionEntries(entries: AiChatEntry[]) {
  return getAiSessionEntries(entries);
}

export function groupAiChatSessions(entries: AiChatEntry[]): AiChatSessionGroup[] {
  const groupedEntries = new Map<string, AiChatEntry[]>();

  for (const entry of sortAiChatEntries(entries)) {
    const normalizedEntry = normalizeAiChatEntry(entry);
    const sessionEntries = groupedEntries.get(normalizedEntry.sessionId) ?? [];

    sessionEntries.push(normalizedEntry);
    groupedEntries.set(normalizedEntry.sessionId, sessionEntries);
  }

  return Array.from(groupedEntries.entries())
    .map(([sessionId, sessionEntries]) => {
      const sortedSessionEntries = sortAiChatSessionEntries(sessionEntries);
      const sessionStartEntry = sortedSessionEntries[0];
      const latestEntry = [...sortedSessionEntries].sort((left, right) =>
        left.createdAt < right.createdAt ? 1 : -1,
      )[0];

      return {
        sessionId,
        source: sessionStartEntry.source,
        promptOrigin: sessionStartEntry.promptOrigin,
        entries: sortedSessionEntries,
        latestEntry,
        messageCount: sortedSessionEntries.length,
        latestCreatedAt: latestEntry.createdAt,
        hasMedicalEscalation: sortedSessionEntries.some((entry) => entry.medicalEscalation),
      };
    })
    .sort((left, right) => (left.latestCreatedAt < right.latestCreatedAt ? 1 : -1));
}
