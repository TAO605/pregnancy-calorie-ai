import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  analyticsSignUpSources,
  type AnalyticsSignUpSource,
  type AnalyticsSignUpSourceBreakdownKey,
} from "@/types/content";
import { writeFileAtomic } from "@/lib/server/atomic-file";

export type AdminUserStatus = "anonymous" | "saved_profile" | "active_tracking";

type UserActivityEvent =
  | "calculator_completed"
  | "signup_completed"
  | "profile_saved"
  | "ai_chat_started"
  | "ai_entry_clicked"
  | "result_ai_clicked"
  | "dashboard_viewed"
  | "weight_log_created"
  | "meal_log_created";

type UserActivityRecord = {
  id: string;
  actorKey: string;
  actorType: "anonymous" | "known";
  displayName: string;
  email: string | null;
  signUpSource: AnalyticsSignUpSource | null;
  locale: string;
  countryCode: string | null;
  gestationalWeek: number | null;
  status: AdminUserStatus;
  calculatorCount: number;
  signInCount: number;
  profileSaveCount: number;
  aiChatCount: number;
  resultAiClickCount: number;
  dashboardViewCount: number;
  weightLogCount: number;
  mealLogCount: number;
  lastRecommendedCalories: number | null;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
};

export type UserActivitySnapshot = {
  anonymousSessionId?: string;
  email?: string;
  displayName?: string;
  signUpSource?: AnalyticsSignUpSource;
  locale: string;
  countryCode?: string;
  gestationalWeek?: number;
  status: AdminUserStatus;
  event: UserActivityEvent;
  lastRecommendedCalories?: number;
};

export type AdminUserPreview = {
  id: string;
  name: string;
  email: string;
  signUpSource: AnalyticsSignUpSourceBreakdownKey;
  locale: string;
  countryCode: string;
  gestationalWeek: number | null;
  status: AdminUserStatus;
  lastRecommendedCalories: number | null;
  lastActivityAt: string;
  calculatorCount: number;
  aiChatCount: number;
  resultAiClickCount: number;
  dashboardViewCount: number;
  weightLogCount: number;
  mealLogCount: number;
};

export type AdminUserActivityOverview = {
  totals: {
    totalProfiles: number;
    anonymousUsers: number;
    savedProfiles: number;
    activeTrackingUsers: number;
  };
  funnel: {
    anonymousToSavedRate: number;
    savedToTrackingRate: number;
    anonymousToTrackingRate: number;
  };
  localeBreakdown: Array<{
    locale: string;
    users: number;
    activeTrackingUsers: number;
  }>;
  signUpSourceRetentionBreakdown: Array<{
    source: AnalyticsSignUpSourceBreakdownKey;
    savedProfiles: number;
    activeTrackingUsers: number;
    trackingRate: number | null;
    shareOfSavedProfiles: number | null;
  }>;
};

const activityFilePath = path.join(process.cwd(), "data", "user-activity.json");

const statusRank: Record<AdminUserStatus, number> = {
  anonymous: 0,
  saved_profile: 1,
  active_tracking: 2,
};

async function ensureActivityFile() {
  await mkdir(path.dirname(activityFilePath), { recursive: true });

  try {
    await readFile(activityFilePath, "utf8");
  } catch {
    await writeFile(activityFilePath, "[]", "utf8");
  }
}

async function readActivityRecords(): Promise<UserActivityRecord[]> {
  await ensureActivityFile();
  const raw = await readFile(activityFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as Partial<UserActivityRecord>[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((record) => {
      if (!record || typeof record !== "object" || typeof record.id !== "string") {
        return [];
      }

      return [
        {
          id: record.id,
          actorKey: record.actorKey ?? "",
          actorType: record.actorType === "known" ? "known" : "anonymous",
          displayName: record.displayName ?? "Anonymous visitor",
          email: record.email ?? null,
          signUpSource:
            typeof record.signUpSource === "string" &&
            (analyticsSignUpSources as readonly string[]).includes(record.signUpSource)
              ? (record.signUpSource as AnalyticsSignUpSource)
              : null,
          locale: record.locale ?? "en",
          countryCode: record.countryCode ?? null,
          gestationalWeek: record.gestationalWeek ?? null,
          status:
            record.status === "saved_profile" || record.status === "active_tracking"
              ? record.status
              : "anonymous",
          calculatorCount: record.calculatorCount ?? 0,
          signInCount: record.signInCount ?? 0,
          profileSaveCount: record.profileSaveCount ?? 0,
          aiChatCount: record.aiChatCount ?? 0,
          resultAiClickCount: record.resultAiClickCount ?? 0,
          dashboardViewCount: record.dashboardViewCount ?? 0,
          weightLogCount: record.weightLogCount ?? 0,
          mealLogCount: record.mealLogCount ?? 0,
          lastRecommendedCalories: record.lastRecommendedCalories ?? null,
          lastActivityAt: record.lastActivityAt ?? new Date().toISOString(),
          createdAt: record.createdAt ?? new Date().toISOString(),
          updatedAt: record.updatedAt ?? new Date().toISOString(),
        },
      ];
    });
  } catch {
    return [];
  }
}

async function writeActivityRecords(records: UserActivityRecord[]) {
  await ensureActivityFile();
  await writeFileAtomic(activityFilePath, JSON.stringify(records, null, 2));
}

function getActorKey(input: UserActivitySnapshot) {
  if (input.email) {
    return `email:${input.email.trim().toLowerCase()}`;
  }

  return `anon:${input.anonymousSessionId}`;
}

function incrementCount(record: UserActivityRecord, event: UserActivityEvent) {
  switch (event) {
    case "calculator_completed":
      record.calculatorCount += 1;
      break;
    case "signup_completed":
      record.signInCount += 1;
      break;
    case "profile_saved":
      record.profileSaveCount += 1;
      break;
    case "ai_chat_started":
      record.aiChatCount += 1;
      break;
    case "ai_entry_clicked":
    case "result_ai_clicked":
      record.resultAiClickCount += 1;
      break;
    case "dashboard_viewed":
      record.dashboardViewCount += 1;
      break;
    case "weight_log_created":
      record.weightLogCount += 1;
      break;
    case "meal_log_created":
      record.mealLogCount += 1;
      break;
  }
}

function mergeActivityRecords(
  target: UserActivityRecord,
  source: UserActivityRecord,
): UserActivityRecord {
  target.actorType = target.email ? "known" : source.actorType;
  target.displayName =
    target.displayName === "Anonymous visitor" && source.displayName !== "Anonymous visitor"
      ? source.displayName
      : target.displayName;
  target.email = target.email ?? source.email;
  target.signUpSource = target.signUpSource ?? source.signUpSource;
  target.locale = target.updatedAt >= source.updatedAt ? target.locale : source.locale;
  target.countryCode = target.countryCode ?? source.countryCode;
  target.gestationalWeek = target.gestationalWeek ?? source.gestationalWeek;
  target.status =
    statusRank[source.status] > statusRank[target.status] ? source.status : target.status;
  target.calculatorCount += source.calculatorCount;
  target.signInCount += source.signInCount;
  target.profileSaveCount += source.profileSaveCount;
  target.aiChatCount += source.aiChatCount;
  target.resultAiClickCount += source.resultAiClickCount;
  target.dashboardViewCount += source.dashboardViewCount;
  target.weightLogCount += source.weightLogCount;
  target.mealLogCount += source.mealLogCount;
  target.lastRecommendedCalories =
    target.lastRecommendedCalories ?? source.lastRecommendedCalories;
  target.lastActivityAt =
    source.lastActivityAt > target.lastActivityAt ? source.lastActivityAt : target.lastActivityAt;
  target.createdAt = source.createdAt < target.createdAt ? source.createdAt : target.createdAt;
  target.updatedAt = source.updatedAt > target.updatedAt ? source.updatedAt : target.updatedAt;

  return target;
}

export async function upsertUserActivitySnapshot(
  input: UserActivitySnapshot,
): Promise<UserActivityRecord> {
  const now = new Date().toISOString();
  let records = await readActivityRecords();
  const actorKey = getActorKey(input);
  const anonymousActorKey = input.anonymousSessionId ? `anon:${input.anonymousSessionId}` : null;
  const existing = records.find((record) => record.actorKey === actorKey);
  const anonymousRecord =
    input.email && anonymousActorKey
      ? records.find((record) => record.actorKey === anonymousActorKey)
      : null;

  if (existing) {
    if (anonymousRecord && anonymousRecord.id !== existing.id) {
      mergeActivityRecords(existing, anonymousRecord);
      records = records.filter((record) => record.id !== anonymousRecord.id);
    }

    existing.actorType = input.email ? "known" : existing.actorType;
    existing.displayName =
      input.displayName?.trim() || existing.displayName || "Anonymous visitor";
    existing.email = input.email?.trim().toLowerCase() || existing.email;
    existing.signUpSource = input.signUpSource ?? existing.signUpSource;
    existing.locale = input.locale;
    existing.countryCode = input.countryCode?.toUpperCase() || existing.countryCode;
    existing.gestationalWeek = input.gestationalWeek ?? existing.gestationalWeek;
    existing.status =
      statusRank[input.status] > statusRank[existing.status] ? input.status : existing.status;
    existing.lastRecommendedCalories =
      input.lastRecommendedCalories ?? existing.lastRecommendedCalories;
    existing.lastActivityAt = now;
    existing.updatedAt = now;
    existing.actorKey = actorKey;
    incrementCount(existing, input.event);
    await writeActivityRecords(records);
    return existing;
  }

  if (anonymousRecord && input.email) {
    anonymousRecord.actorKey = actorKey;
    anonymousRecord.actorType = "known";
    anonymousRecord.displayName =
      input.displayName?.trim() || anonymousRecord.displayName || "Anonymous visitor";
    anonymousRecord.email = input.email.trim().toLowerCase();
    anonymousRecord.signUpSource = input.signUpSource ?? anonymousRecord.signUpSource;
    anonymousRecord.locale = input.locale;
    anonymousRecord.countryCode = input.countryCode?.toUpperCase() || anonymousRecord.countryCode;
    anonymousRecord.gestationalWeek = input.gestationalWeek ?? anonymousRecord.gestationalWeek;
    anonymousRecord.status =
      statusRank[input.status] > statusRank[anonymousRecord.status]
        ? input.status
        : anonymousRecord.status;
    anonymousRecord.lastRecommendedCalories =
      input.lastRecommendedCalories ?? anonymousRecord.lastRecommendedCalories;
    anonymousRecord.lastActivityAt = now;
    anonymousRecord.updatedAt = now;
    incrementCount(anonymousRecord, input.event);
    await writeActivityRecords(records);
    return anonymousRecord;
  }

  const created: UserActivityRecord = {
    id: crypto.randomUUID(),
    actorKey,
    actorType: input.email ? "known" : "anonymous",
    displayName: input.displayName?.trim() || "Anonymous visitor",
    email: input.email?.trim().toLowerCase() || null,
    signUpSource: input.signUpSource ?? null,
    locale: input.locale,
    countryCode: input.countryCode?.toUpperCase() || null,
    gestationalWeek: input.gestationalWeek ?? null,
    status: input.status,
    calculatorCount: 0,
    signInCount: 0,
    profileSaveCount: 0,
    aiChatCount: 0,
    resultAiClickCount: 0,
    dashboardViewCount: 0,
    weightLogCount: 0,
    mealLogCount: 0,
    lastRecommendedCalories: input.lastRecommendedCalories ?? null,
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  };

  incrementCount(created, input.event);
  records.push(created);
  await writeActivityRecords(records);
  return created;
}

export async function getAdminUserPreviews(): Promise<AdminUserPreview[]> {
  const records = await readActivityRecords();

  return [...records]
    .sort((a, b) => (a.lastActivityAt < b.lastActivityAt ? 1 : -1))
    .map((record) => ({
      id: record.id,
      name: record.displayName,
      email: record.email ?? "No sign-in yet",
      signUpSource: record.signUpSource ?? "unknown",
      locale: record.locale,
      countryCode: record.countryCode ?? "--",
      gestationalWeek: record.gestationalWeek,
      status: record.status,
      lastRecommendedCalories: record.lastRecommendedCalories,
      lastActivityAt: record.lastActivityAt,
      calculatorCount: record.calculatorCount,
      aiChatCount: record.aiChatCount,
      resultAiClickCount: record.resultAiClickCount,
      dashboardViewCount: record.dashboardViewCount,
      weightLogCount: record.weightLogCount,
      mealLogCount: record.mealLogCount,
    }));
}

function toPercent(value: number) {
  return Math.round(value * 100);
}

export async function getAdminUserActivityOverview(): Promise<AdminUserActivityOverview> {
  const records = await readActivityRecords();
  const totalProfiles = records.length;
  const anonymousUsers = records.filter((record) => record.status === "anonymous").length;
  const savedProfiles = records.filter((record) => statusRank[record.status] >= statusRank.saved_profile).length;
  const activeTrackingUsers = records.filter(
    (record) => record.status === "active_tracking",
  ).length;
  const signUpSourceRetentionMap = new Map<
    AnalyticsSignUpSourceBreakdownKey,
    { savedProfiles: number; activeTrackingUsers: number }
  >();

  const localeMap = new Map<
    string,
    {
      locale: string;
      users: number;
      activeTrackingUsers: number;
    }
  >();

  for (const record of records) {
    const current = localeMap.get(record.locale) ?? {
      locale: record.locale,
      users: 0,
      activeTrackingUsers: 0,
    };

    current.users += 1;
    if (record.status === "active_tracking") {
      current.activeTrackingUsers += 1;
    }

    localeMap.set(record.locale, current);

    if (statusRank[record.status] >= statusRank.saved_profile) {
      const source = record.signUpSource ?? "unknown";
      const currentRetention = signUpSourceRetentionMap.get(source) ?? {
        savedProfiles: 0,
        activeTrackingUsers: 0,
      };

      currentRetention.savedProfiles += 1;
      if (record.status === "active_tracking") {
        currentRetention.activeTrackingUsers += 1;
      }

      signUpSourceRetentionMap.set(source, currentRetention);
    }
  }

  const signUpSourceRetentionBreakdown = Array.from(signUpSourceRetentionMap.entries())
    .map(([source, current]) => ({
      source,
      savedProfiles: current.savedProfiles,
      activeTrackingUsers: current.activeTrackingUsers,
      trackingRate:
        current.savedProfiles > 0
          ? toPercent(current.activeTrackingUsers / current.savedProfiles)
          : null,
      shareOfSavedProfiles:
        savedProfiles > 0 ? toPercent(current.savedProfiles / savedProfiles) : null,
    }))
    .sort((left, right) => {
      if (right.savedProfiles !== left.savedProfiles) {
        return right.savedProfiles - left.savedProfiles;
      }

      return right.activeTrackingUsers - left.activeTrackingUsers;
    });

  return {
    totals: {
      totalProfiles,
      anonymousUsers,
      savedProfiles,
      activeTrackingUsers,
    },
    funnel: {
      anonymousToSavedRate:
        totalProfiles === 0 ? 0 : toPercent(savedProfiles / totalProfiles),
      savedToTrackingRate:
        savedProfiles === 0 ? 0 : toPercent(activeTrackingUsers / savedProfiles),
      anonymousToTrackingRate:
        totalProfiles === 0 ? 0 : toPercent(activeTrackingUsers / totalProfiles),
    },
    localeBreakdown: Array.from(localeMap.values()).sort((a, b) => b.users - a.users),
    signUpSourceRetentionBreakdown,
  };
}
