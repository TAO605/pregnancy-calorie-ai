import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { GuideTopicKey } from "@/lib/content/guide-topic";
import {
  analyticsAiEntryBreakdownKeys,
  analyticsAiChatSourceKeys,
  analyticsAiPromptOriginBreakdownKeys,
  analyticsRetentionPromptDestinationBreakdownKeys,
  analyticsRetentionPromptStateBreakdownKeys,
  analyticsRetentionPromptSurfaceBreakdownKeys,
  analyticsSignUpSourceBreakdownKeys,
  type AnalyticsAiEntryBreakdownKey,
  type AnalyticsAiChatSourceKey,
  type AnalyticsAiPromptOriginBreakdownKey,
  type AnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsRetentionPromptDestinationBreakdownKey,
  type AnalyticsRetentionPromptStateBreakdownKey,
  type AnalyticsRetentionPromptSurfaceBreakdownKey,
  type AnalyticsSignUpSourceBreakdownKey,
} from "@/types/content";

const analyticsFilePath = path.join(process.cwd(), "data", "analytics-events.jsonl");

export const analyticsRanges = ["7d", "30d", "all"] as const;

export type AnalyticsRange = (typeof analyticsRanges)[number];

type AnalyticsOverview = {
  counts: Record<AnalyticsEventName, number>;
  aiEntryTotal: number;
  aiEntryBreakdown: Array<{
    source: AnalyticsAiEntryBreakdownKey;
    count: number;
  }>;
  aiSourceConversionBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    entryClicks: number;
    chatStarts: number;
    conversionRate: number | null;
  }>;
  weeklyReviewEntryBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    entryClicks: number;
    chatStarts: number;
    conversionRate: number | null;
    contextBackedChats: number;
    contextRate: number | null;
    followUpMessages: number;
    sessionsWithFollowUp: number;
  }>;
  aiSourceQualityBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    chatStarts: number;
    contextBackedChats: number;
    contextRate: number | null;
    riskEscalations: number;
    riskRate: number | null;
  }>;
  aiSourceSessionDepthBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    sessions: number;
    totalMessages: number;
    averageMessagesPerSession: number | null;
    followUpMessages: number;
    sessionsWithFollowUp: number;
    continuationRate: number | null;
  }>;
  aiSessionResumeBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    resumes: number;
    shareOfResumes: number | null;
    averageMessagesPerResume: number | null;
    highRiskResumes: number;
    highRiskRate: number | null;
  }>;
  aiPromptOriginBreakdown: Array<{
    origin: AnalyticsAiPromptOriginBreakdownKey;
    chats: number;
    followUpChats: number;
    followUpRate: number | null;
    riskEscalations: number;
    riskRate: number | null;
  }>;
  aiSourcePromptOriginBreakdown: Array<{
    source: AnalyticsAiChatSourceKey;
    chats: number;
    dominantOrigin: AnalyticsAiPromptOriginBreakdownKey;
    dominantShare: number | null;
    origins: Array<{
      origin: AnalyticsAiPromptOriginBreakdownKey;
      chats: number;
      share: number | null;
    }>;
  }>;
  signUpSourceBreakdown: Array<{
    source: AnalyticsSignUpSourceBreakdownKey;
    signUps: number;
    share: number | null;
  }>;
  retentionPromptSurfaceBreakdown: Array<{
    surface: AnalyticsRetentionPromptSurfaceBreakdownKey;
    clicks: number;
    guestClicks: number;
    memberClicks: number;
  }>;
  retentionPromptStateBreakdown: Array<{
    state: AnalyticsRetentionPromptStateBreakdownKey;
    clicks: number;
    share: number | null;
  }>;
  retentionPromptDestinationBreakdown: Array<{
    destination: AnalyticsRetentionPromptDestinationBreakdownKey;
    clicks: number;
    share: number | null;
  }>;
  guideTopicBreakdown: Array<{
    topic: GuideTopicKey | "unknown";
    label: string;
    views: number;
    aiEntryClicks: number;
    aiEntryRate: number | null;
  }>;
  totalEvents: number;
  recentEvents: AnalyticsEvent[];
};

type GetAnalyticsOverviewOptions = {
  range?: AnalyticsRange;
};

const defaultCounts: Record<AnalyticsEventName, number> = {
  calculator_completed: 0,
  ai_chat_started: 0,
  ai_session_resumed: 0,
  ai_risk_escalated: 0,
  dashboard_viewed: 0,
  ai_entry_clicked: 0,
  result_ai_clicked: 0,
  weight_ai_clicked: 0,
  retention_cta_clicked: 0,
  signup_completed: 0,
  meal_log_created: 0,
  weight_log_created: 0,
  content_page_viewed: 0,
  content_page_published: 0,
};

export const defaultAnalyticsRange: AnalyticsRange = "30d";

const analyticsRangeDayCount: Record<Exclude<AnalyticsRange, "all">, number> = {
  "7d": 7,
  "30d": 30,
};

const guideTopicKeys: readonly GuideTopicKey[] = [
  "calories",
  "fiber_hydration",
  "first_trimester",
  "third_trimester",
  "weight_trend",
];

const weeklyReviewAiSources: readonly AnalyticsAiEntryBreakdownKey[] = [
  "dashboard_weekly_checkin",
  "dashboard_weight_weekly_review",
  "dashboard_meals_weekly_review",
];

async function ensureAnalyticsFile() {
  await mkdir(path.dirname(analyticsFilePath), { recursive: true });

  try {
    await readFile(analyticsFilePath, "utf8");
  } catch {
    await appendFile(analyticsFilePath, "", "utf8");
  }
}

export async function logAnalyticsEvent(
  event: Omit<AnalyticsEvent, "id" | "createdAt">,
) {
  await ensureAnalyticsFile();

  const entry: AnalyticsEvent = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...event,
  };

  await appendFile(analyticsFilePath, `${JSON.stringify(entry)}\n`, "utf8");
  return entry;
}

function getAiEntrySource(event: AnalyticsEvent): AnalyticsAiEntryBreakdownKey | null {
  const metadataSource = event.metadata?.source;
  const normalizedSource =
    typeof metadataSource === "string" &&
    (analyticsAiEntryBreakdownKeys as readonly string[]).includes(metadataSource)
      ? (metadataSource as AnalyticsAiEntryBreakdownKey)
      : null;

  if (event.name === "ai_entry_clicked") {
    return normalizedSource ?? "unknown";
  }

  if (event.name === "result_ai_clicked") {
    if (normalizedSource) {
      return normalizedSource;
    }

    return typeof event.metadata?.entryPoint === "string"
      ? "calculator_result_follow_up"
      : "calculator_result_primary";
  }

  if (event.name === "weight_ai_clicked") {
    return normalizedSource ?? "dashboard_weight";
  }

  return null;
}

function getAiChatSource(event: AnalyticsEvent): AnalyticsAiChatSourceKey | null {
  if (event.name !== "ai_chat_started") {
    return null;
  }

  const metadataSource = event.metadata?.source;
  if (
    typeof metadataSource === "string" &&
    (analyticsAiChatSourceKeys as readonly string[]).includes(metadataSource)
  ) {
    return metadataSource as AnalyticsAiChatSourceKey;
  }

  return "direct";
}

function getAiRiskSource(event: AnalyticsEvent): AnalyticsAiChatSourceKey | null {
  if (event.name !== "ai_risk_escalated") {
    return null;
  }

  const metadataSource = event.metadata?.source;
  if (
    typeof metadataSource === "string" &&
    (analyticsAiChatSourceKeys as readonly string[]).includes(metadataSource)
  ) {
    return metadataSource as AnalyticsAiChatSourceKey;
  }

  return "unknown";
}

function getAiSessionResumeSource(
  event: AnalyticsEvent,
): AnalyticsAiChatSourceKey | null {
  if (event.name !== "ai_session_resumed") {
    return null;
  }

  const metadataSource = event.metadata?.source;
  if (
    typeof metadataSource === "string" &&
    (analyticsAiChatSourceKeys as readonly string[]).includes(metadataSource)
  ) {
    return metadataSource as AnalyticsAiChatSourceKey;
  }

  return "direct";
}

function getAiPromptOrigin(
  event: AnalyticsEvent,
): AnalyticsAiPromptOriginBreakdownKey | null {
  if (event.name !== "ai_chat_started" && event.name !== "ai_risk_escalated") {
    return null;
  }

  const metadataPromptOrigin = event.metadata?.promptOrigin;
  if (
    typeof metadataPromptOrigin === "string" &&
    (analyticsAiPromptOriginBreakdownKeys as readonly string[]).includes(
      metadataPromptOrigin,
    )
  ) {
    return metadataPromptOrigin as AnalyticsAiPromptOriginBreakdownKey;
  }

  return "unknown";
}

function getAiChatSessionId(event: AnalyticsEvent) {
  const sessionId = event.metadata?.sessionId;
  return typeof sessionId === "string" && sessionId.length > 0
    ? sessionId
    : `legacy-${event.id}`;
}

function getSignUpSource(
  event: AnalyticsEvent,
): AnalyticsSignUpSourceBreakdownKey | null {
  if (event.name !== "signup_completed") {
    return null;
  }

  const metadataSource = event.metadata?.source;
  if (
    typeof metadataSource === "string" &&
    (analyticsSignUpSourceBreakdownKeys as readonly string[]).includes(metadataSource)
  ) {
    return metadataSource as AnalyticsSignUpSourceBreakdownKey;
  }

  return "unknown";
}

function getRetentionPromptSurface(
  event: AnalyticsEvent,
): AnalyticsRetentionPromptSurfaceBreakdownKey | null {
  if (event.name !== "retention_cta_clicked") {
    return null;
  }

  const metadataSurface = event.metadata?.surface;
  if (
    typeof metadataSurface === "string" &&
    (analyticsRetentionPromptSurfaceBreakdownKeys as readonly string[]).includes(
      metadataSurface,
    )
  ) {
    return metadataSurface as AnalyticsRetentionPromptSurfaceBreakdownKey;
  }

  return "unknown";
}

function getRetentionPromptState(
  event: AnalyticsEvent,
): AnalyticsRetentionPromptStateBreakdownKey | null {
  if (event.name !== "retention_cta_clicked") {
    return null;
  }

  const metadataState = event.metadata?.state;
  if (
    typeof metadataState === "string" &&
    (analyticsRetentionPromptStateBreakdownKeys as readonly string[]).includes(
      metadataState,
    )
  ) {
    return metadataState as AnalyticsRetentionPromptStateBreakdownKey;
  }

  return "unknown";
}

function getRetentionPromptDestination(
  event: AnalyticsEvent,
): AnalyticsRetentionPromptDestinationBreakdownKey | null {
  if (event.name !== "retention_cta_clicked") {
    return null;
  }

  const metadataDestination = event.metadata?.destination;
  if (
    typeof metadataDestination === "string" &&
    (
      analyticsRetentionPromptDestinationBreakdownKeys as readonly string[]
    ).includes(metadataDestination)
  ) {
    return metadataDestination as AnalyticsRetentionPromptDestinationBreakdownKey;
  }

  return "unknown";
}

function getGuideTopicKeyFromEvent(event: AnalyticsEvent): GuideTopicKey | "unknown" | null {
  if (
    event.name !== "content_page_viewed" &&
    event.name !== "ai_entry_clicked"
  ) {
    return null;
  }

  const metadataGuideTopic = event.metadata?.guideTopic;
  if (
    typeof metadataGuideTopic === "string" &&
    (guideTopicKeys as readonly string[]).includes(metadataGuideTopic)
  ) {
    return metadataGuideTopic as GuideTopicKey;
  }

  if (
    event.name === "content_page_viewed" ||
    event.metadata?.source === "blog_article_tool_cta" ||
    event.metadata?.source === "blog_article_footer"
  ) {
    return "unknown";
  }

  return null;
}

function getGuideTopicLabelFromEvent(
  event: AnalyticsEvent,
  topic: GuideTopicKey | "unknown",
) {
  const metadataGuideTopicLabel = event.metadata?.guideTopicLabel;
  if (typeof metadataGuideTopicLabel === "string" && metadataGuideTopicLabel.length > 0) {
    return metadataGuideTopicLabel;
  }

  return topic;
}

export function isAnalyticsRange(value: string): value is AnalyticsRange {
  return (analyticsRanges as readonly string[]).includes(value);
}

export function parseAnalyticsRange(
  value: string | string[] | undefined,
): AnalyticsRange {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === "string" && isAnalyticsRange(candidate)
    ? candidate
    : defaultAnalyticsRange;
}

function filterEventsByRange(events: AnalyticsEvent[], range: AnalyticsRange) {
  if (range === "all") {
    return events;
  }

  const startTimestamp =
    Date.now() - analyticsRangeDayCount[range] * 24 * 60 * 60 * 1000;

  return events.filter((event) => {
    const eventTimestamp = Date.parse(event.createdAt);
    return Number.isFinite(eventTimestamp) && eventTimestamp >= startTimestamp;
  });
}

export async function getAnalyticsOverview({
  range = defaultAnalyticsRange,
}: GetAnalyticsOverviewOptions = {}): Promise<AnalyticsOverview> {
  await ensureAnalyticsFile();
  const raw = await readFile(analyticsFilePath, "utf8");
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const allEvents: AnalyticsEvent[] = lines.flatMap((line) => {
    try {
      return [JSON.parse(line) as AnalyticsEvent];
    } catch {
      return [];
    }
  });
  const events = filterEventsByRange(allEvents, range);

  const counts = { ...defaultCounts };
  const aiEntryBreakdownMap = new Map<AnalyticsAiEntryBreakdownKey, number>();
  const aiChatSourceMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiChatContextMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiRiskSourceMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiResumeSourceMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiResumeRiskMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiResumeMessageSumMap = new Map<AnalyticsAiChatSourceKey, number>();
  const aiPromptOriginChatMap = new Map<AnalyticsAiPromptOriginBreakdownKey, number>();
  const aiPromptOriginFollowUpMap = new Map<AnalyticsAiPromptOriginBreakdownKey, number>();
  const aiPromptOriginRiskMap = new Map<AnalyticsAiPromptOriginBreakdownKey, number>();
  const signUpSourceMap = new Map<AnalyticsSignUpSourceBreakdownKey, number>();
  const retentionPromptSurfaceMap = new Map<
    AnalyticsRetentionPromptSurfaceBreakdownKey,
    { clicks: number; guestClicks: number; memberClicks: number }
  >();
  const retentionPromptStateMap = new Map<
    AnalyticsRetentionPromptStateBreakdownKey,
    number
  >();
  const retentionPromptDestinationMap = new Map<
    AnalyticsRetentionPromptDestinationBreakdownKey,
    number
  >();
  const guideTopicMap = new Map<
    GuideTopicKey | "unknown",
    { label: string; views: number; aiEntryClicks: number }
  >();
  const aiSourcePromptOriginMap = new Map<
    AnalyticsAiChatSourceKey,
    Map<AnalyticsAiPromptOriginBreakdownKey, number>
  >();
  const aiSessionMap = new Map<
    AnalyticsAiChatSourceKey,
    Map<string, { totalMessages: number; followUpMessages: number }>
  >();
  for (const event of events) {
    if (!(event.name in counts)) {
      continue;
    }

    counts[event.name] += 1;

    const aiEntrySource = getAiEntrySource(event);
    if (aiEntrySource) {
      aiEntryBreakdownMap.set(
        aiEntrySource,
        (aiEntryBreakdownMap.get(aiEntrySource) ?? 0) + 1,
      );
    }

    const aiChatSource = getAiChatSource(event);
    if (aiChatSource) {
      aiChatSourceMap.set(aiChatSource, (aiChatSourceMap.get(aiChatSource) ?? 0) + 1);
      if (event.metadata?.hasContext === true) {
        aiChatContextMap.set(
          aiChatSource,
          (aiChatContextMap.get(aiChatSource) ?? 0) + 1,
        );
      }

      const sourceSessions =
        aiSessionMap.get(aiChatSource) ??
        new Map<string, { totalMessages: number; followUpMessages: number }>();
      const sessionId = getAiChatSessionId(event);
      const currentSession = sourceSessions.get(sessionId) ?? {
        totalMessages: 0,
        followUpMessages: 0,
      };

      currentSession.totalMessages += 1;
      if (event.metadata?.isFollowUp === true) {
        currentSession.followUpMessages += 1;
      }

      sourceSessions.set(sessionId, currentSession);
      aiSessionMap.set(aiChatSource, sourceSessions);
    }

    const aiPromptOrigin = getAiPromptOrigin(event);
    if (event.name === "ai_chat_started" && aiPromptOrigin) {
      aiPromptOriginChatMap.set(
        aiPromptOrigin,
        (aiPromptOriginChatMap.get(aiPromptOrigin) ?? 0) + 1,
      );
      if (aiChatSource) {
        const sourcePromptOrigins =
          aiSourcePromptOriginMap.get(aiChatSource) ??
          new Map<AnalyticsAiPromptOriginBreakdownKey, number>();
        sourcePromptOrigins.set(
          aiPromptOrigin,
          (sourcePromptOrigins.get(aiPromptOrigin) ?? 0) + 1,
        );
        aiSourcePromptOriginMap.set(aiChatSource, sourcePromptOrigins);
      }
      if (event.metadata?.isFollowUp === true) {
        aiPromptOriginFollowUpMap.set(
          aiPromptOrigin,
          (aiPromptOriginFollowUpMap.get(aiPromptOrigin) ?? 0) + 1,
        );
      }
    }

    const aiRiskSource = getAiRiskSource(event);
    if (aiRiskSource) {
      aiRiskSourceMap.set(aiRiskSource, (aiRiskSourceMap.get(aiRiskSource) ?? 0) + 1);
    }

    const aiResumeSource = getAiSessionResumeSource(event);
    if (aiResumeSource) {
      aiResumeSourceMap.set(
        aiResumeSource,
        (aiResumeSourceMap.get(aiResumeSource) ?? 0) + 1,
      );
      if (event.metadata?.hasMedicalEscalation === true) {
        aiResumeRiskMap.set(
          aiResumeSource,
          (aiResumeRiskMap.get(aiResumeSource) ?? 0) + 1,
        );
      }
      if (typeof event.metadata?.messageCount === "number") {
        aiResumeMessageSumMap.set(
          aiResumeSource,
          (aiResumeMessageSumMap.get(aiResumeSource) ?? 0) + event.metadata.messageCount,
        );
      }
    }

    if (event.name === "ai_risk_escalated" && aiPromptOrigin) {
      aiPromptOriginRiskMap.set(
        aiPromptOrigin,
        (aiPromptOriginRiskMap.get(aiPromptOrigin) ?? 0) + 1,
      );
    }

    const signUpSource = getSignUpSource(event);
    if (signUpSource) {
      signUpSourceMap.set(signUpSource, (signUpSourceMap.get(signUpSource) ?? 0) + 1);
    }

    const retentionPromptSurface = getRetentionPromptSurface(event);
    if (retentionPromptSurface) {
      const retentionPromptState = getRetentionPromptState(event) ?? "unknown";
      const currentRetentionSurface = retentionPromptSurfaceMap.get(
        retentionPromptSurface,
      ) ?? {
        clicks: 0,
        guestClicks: 0,
        memberClicks: 0,
      };

      currentRetentionSurface.clicks += 1;
      if (retentionPromptState === "guest") {
        currentRetentionSurface.guestClicks += 1;
      }
      if (retentionPromptState === "member") {
        currentRetentionSurface.memberClicks += 1;
      }

      retentionPromptSurfaceMap.set(
        retentionPromptSurface,
        currentRetentionSurface,
      );
      retentionPromptStateMap.set(
        retentionPromptState,
        (retentionPromptStateMap.get(retentionPromptState) ?? 0) + 1,
      );

      const retentionPromptDestination = getRetentionPromptDestination(event) ?? "unknown";
      retentionPromptDestinationMap.set(
        retentionPromptDestination,
        (retentionPromptDestinationMap.get(retentionPromptDestination) ?? 0) + 1,
      );
    }

    const guideTopic = getGuideTopicKeyFromEvent(event);
    if (guideTopic) {
      const currentGuideTopic = guideTopicMap.get(guideTopic) ?? {
        label: getGuideTopicLabelFromEvent(event, guideTopic),
        views: 0,
        aiEntryClicks: 0,
      };

      currentGuideTopic.label = getGuideTopicLabelFromEvent(event, guideTopic);

      if (event.name === "content_page_viewed") {
        currentGuideTopic.views += 1;
      }

      if (event.name === "ai_entry_clicked") {
        currentGuideTopic.aiEntryClicks += 1;
      }

      guideTopicMap.set(guideTopic, currentGuideTopic);
    }
  }

  const aiSourceConversionBreakdown = Array.from(
    new Set<AnalyticsAiChatSourceKey>([
      ...Array.from(aiEntryBreakdownMap.keys()),
      ...Array.from(aiChatSourceMap.keys()),
    ]),
  )
    .map((source) => {
      const entryClicks = aiEntryBreakdownMap.get(
        source as AnalyticsAiEntryBreakdownKey,
      ) ?? 0;
      const chatStarts = aiChatSourceMap.get(source) ?? 0;

      return {
        source,
        entryClicks,
        chatStarts,
        conversionRate:
          entryClicks > 0 ? Math.round((chatStarts / entryClicks) * 100) : null,
      };
    })
    .sort((left, right) => {
      const leftWeight = Math.max(left.entryClicks, left.chatStarts);
      const rightWeight = Math.max(right.entryClicks, right.chatStarts);

      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }

      return right.chatStarts - left.chatStarts;
    });
  const weeklyReviewEntryBreakdown = weeklyReviewAiSources
    .map((source) => {
      const entryClicks = aiEntryBreakdownMap.get(source) ?? 0;
      const chatStarts = aiChatSourceMap.get(source) ?? 0;
      const contextBackedChats = aiChatContextMap.get(source) ?? 0;
      const sessionValues = Array.from(aiSessionMap.get(source)?.values() ?? []);
      const followUpMessages = sessionValues.reduce(
        (sum, session) => sum + session.followUpMessages,
        0,
      );
      const sessionsWithFollowUp = sessionValues.filter(
        (session) => session.followUpMessages > 0,
      ).length;

      return {
        source,
        entryClicks,
        chatStarts,
        conversionRate:
          entryClicks > 0 ? Math.round((chatStarts / entryClicks) * 100) : null,
        contextBackedChats,
        contextRate:
          chatStarts > 0 ? Math.round((contextBackedChats / chatStarts) * 100) : null,
        followUpMessages,
        sessionsWithFollowUp,
      };
    })
    .filter(
      (item) =>
        item.entryClicks > 0 ||
        item.chatStarts > 0 ||
        item.contextBackedChats > 0 ||
        item.followUpMessages > 0,
    )
    .sort((left, right) => {
      const leftWeight = left.entryClicks + left.chatStarts + left.followUpMessages;
      const rightWeight = right.entryClicks + right.chatStarts + right.followUpMessages;

      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }

      return left.source.localeCompare(right.source);
    });
  const aiSourceQualityBreakdown = Array.from(
    new Set<AnalyticsAiChatSourceKey>([
      ...Array.from(aiChatSourceMap.keys()),
      ...Array.from(aiRiskSourceMap.keys()),
    ]),
  )
    .map((source) => {
      const chatStarts = aiChatSourceMap.get(source) ?? 0;
      const contextBackedChats = aiChatContextMap.get(source) ?? 0;
      const riskEscalations = aiRiskSourceMap.get(source) ?? 0;

      return {
        source,
        chatStarts,
        contextBackedChats,
        contextRate:
          chatStarts > 0 ? Math.round((contextBackedChats / chatStarts) * 100) : null,
        riskEscalations,
        riskRate:
          chatStarts > 0 ? Math.round((riskEscalations / chatStarts) * 100) : null,
      };
    })
    .sort((left, right) => {
      if (right.chatStarts !== left.chatStarts) {
        return right.chatStarts - left.chatStarts;
      }

      return right.riskEscalations - left.riskEscalations;
    });
  const aiSourceSessionDepthBreakdown = Array.from(aiSessionMap.entries())
    .map(([source, sessions]) => {
      const sessionValues = Array.from(sessions.values());
      const totalMessages = sessionValues.reduce(
        (sum, session) => sum + session.totalMessages,
        0,
      );
      const followUpMessages = sessionValues.reduce(
        (sum, session) => sum + session.followUpMessages,
        0,
      );
      const sessionsWithFollowUp = sessionValues.filter(
        (session) => session.followUpMessages > 0,
      ).length;
      const sessionCount = sessionValues.length;

      return {
        source,
        sessions: sessionCount,
        totalMessages,
        averageMessagesPerSession:
          sessionCount > 0
            ? Math.round((totalMessages / sessionCount) * 10) / 10
            : null,
        followUpMessages,
        sessionsWithFollowUp,
        continuationRate:
          sessionCount > 0
            ? Math.round((sessionsWithFollowUp / sessionCount) * 100)
            : null,
      };
    })
    .sort((left, right) => {
      if (right.sessions !== left.sessions) {
        return right.sessions - left.sessions;
      }

      return right.totalMessages - left.totalMessages;
    });
  const totalResumes = Array.from(aiResumeSourceMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const aiSessionResumeBreakdown = Array.from(aiResumeSourceMap.keys())
    .map((source) => {
      const resumes = aiResumeSourceMap.get(source) ?? 0;
      const highRiskResumes = aiResumeRiskMap.get(source) ?? 0;
      const totalMessagesAcrossResumes = aiResumeMessageSumMap.get(source) ?? 0;

      return {
        source,
        resumes,
        shareOfResumes:
          totalResumes > 0 ? Math.round((resumes / totalResumes) * 100) : null,
        averageMessagesPerResume:
          resumes > 0 ? Math.round((totalMessagesAcrossResumes / resumes) * 10) / 10 : null,
        highRiskResumes,
        highRiskRate:
          resumes > 0 ? Math.round((highRiskResumes / resumes) * 100) : null,
      };
    })
    .sort((left, right) => {
      if (right.resumes !== left.resumes) {
        return right.resumes - left.resumes;
      }

      return right.highRiskResumes - left.highRiskResumes;
    });
  const aiPromptOriginBreakdown = Array.from(
    new Set<AnalyticsAiPromptOriginBreakdownKey>([
      ...Array.from(aiPromptOriginChatMap.keys()),
      ...Array.from(aiPromptOriginRiskMap.keys()),
    ]),
  )
    .map((origin) => {
      const chats = aiPromptOriginChatMap.get(origin) ?? 0;
      const followUpChats = aiPromptOriginFollowUpMap.get(origin) ?? 0;
      const riskEscalations = aiPromptOriginRiskMap.get(origin) ?? 0;

      return {
        origin,
        chats,
        followUpChats,
        followUpRate:
          chats > 0 ? Math.round((followUpChats / chats) * 100) : null,
        riskEscalations,
        riskRate:
          chats > 0 ? Math.round((riskEscalations / chats) * 100) : null,
      };
    })
    .sort((left, right) => {
      if (right.chats !== left.chats) {
        return right.chats - left.chats;
      }

        return right.riskEscalations - left.riskEscalations;
      });
  const aiSourcePromptOriginBreakdown = Array.from(aiSourcePromptOriginMap.entries())
    .map(([source, originMap]) => {
      const chats = Array.from(originMap.values()).reduce((sum, count) => sum + count, 0);
      const origins = Array.from(originMap.entries())
        .map(([origin, originChats]) => ({
          origin,
          chats: originChats,
          share: chats > 0 ? Math.round((originChats / chats) * 100) : null,
        }))
        .sort((left, right) => {
          if (right.chats !== left.chats) {
            return right.chats - left.chats;
          }

          return left.origin.localeCompare(right.origin);
        });
      const dominantOrigin = origins[0]?.origin ?? "unknown";
      const dominantShare = origins[0]?.share ?? null;

      return {
        source,
        chats,
        dominantOrigin,
        dominantShare,
        origins,
      };
    })
    .sort((left, right) => {
      if (right.chats !== left.chats) {
        return right.chats - left.chats;
      }

      return left.source.localeCompare(right.source);
    });
  const totalSignUps = Array.from(signUpSourceMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const signUpSourceBreakdown = Array.from(signUpSourceMap.entries())
    .map(([source, signUps]) => ({
      source,
      signUps,
      share: totalSignUps > 0 ? Math.round((signUps / totalSignUps) * 100) : null,
    }))
    .sort((left, right) => {
      if (right.signUps !== left.signUps) {
        return right.signUps - left.signUps;
      }

      return left.source.localeCompare(right.source);
    });
  const totalRetentionPromptClicks = Array.from(retentionPromptStateMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const retentionPromptSurfaceBreakdown = Array.from(retentionPromptSurfaceMap.entries())
    .map(([surface, counts]) => ({
      surface,
      clicks: counts.clicks,
      guestClicks: counts.guestClicks,
      memberClicks: counts.memberClicks,
    }))
    .sort((left, right) => {
      if (right.clicks !== left.clicks) {
        return right.clicks - left.clicks;
      }

      return left.surface.localeCompare(right.surface);
    });
  const retentionPromptStateBreakdown = Array.from(retentionPromptStateMap.entries())
    .map(([state, clicks]) => ({
      state,
      clicks,
      share:
        totalRetentionPromptClicks > 0
          ? Math.round((clicks / totalRetentionPromptClicks) * 100)
          : null,
    }))
    .sort((left, right) => {
      if (right.clicks !== left.clicks) {
        return right.clicks - left.clicks;
      }

      return left.state.localeCompare(right.state);
    });
  const retentionPromptDestinationBreakdown = Array.from(
    retentionPromptDestinationMap.entries(),
  )
    .map(([destination, clicks]) => ({
      destination,
      clicks,
      share:
        totalRetentionPromptClicks > 0
          ? Math.round((clicks / totalRetentionPromptClicks) * 100)
          : null,
    }))
    .sort((left, right) => {
      if (right.clicks !== left.clicks) {
        return right.clicks - left.clicks;
      }

      return left.destination.localeCompare(right.destination);
    });
  const guideTopicBreakdown = Array.from(guideTopicMap.entries())
    .map(([topic, counts]) => ({
      topic,
      label: counts.label,
      views: counts.views,
      aiEntryClicks: counts.aiEntryClicks,
      aiEntryRate:
        counts.views > 0 ? Math.round((counts.aiEntryClicks / counts.views) * 100) : null,
    }))
    .sort((left, right) => {
      const leftTotal = left.views + left.aiEntryClicks;
      const rightTotal = right.views + right.aiEntryClicks;

      if (rightTotal !== leftTotal) {
        return rightTotal - leftTotal;
      }

      return left.topic.localeCompare(right.topic);
    });

  return {
    counts,
    aiEntryTotal:
      counts.ai_entry_clicked + counts.result_ai_clicked + counts.weight_ai_clicked,
    aiEntryBreakdown: Array.from(aiEntryBreakdownMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((left, right) => right.count - left.count),
    aiSourceConversionBreakdown,
    weeklyReviewEntryBreakdown,
    aiSourceQualityBreakdown,
    aiSourceSessionDepthBreakdown,
    aiSessionResumeBreakdown,
    aiPromptOriginBreakdown,
    aiSourcePromptOriginBreakdown,
    signUpSourceBreakdown,
    retentionPromptSurfaceBreakdown,
    retentionPromptStateBreakdown,
    retentionPromptDestinationBreakdown,
    guideTopicBreakdown,
    totalEvents: events.length,
    recentEvents: events.slice(-10).reverse(),
  };
}
