import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const auditFilePath = path.join(process.cwd(), "data", "admin-audit.jsonl");
const maxTextLength = 180;
const maxMetadataEntries = 12;

const adminAuditActions = [
  "content_page_saved",
  "content_page_published",
  "guideline_pack_updated",
] as const;

const adminAuditResourceTypes = ["content_page", "guideline_pack"] as const;

export type AdminAuditAction = (typeof adminAuditActions)[number];
export type AdminAuditResourceType = (typeof adminAuditResourceTypes)[number];

type AdminAuditMetadataValue = string | number | boolean | null;

export type AdminAuditEvent = {
  id: string;
  action: AdminAuditAction;
  resourceType: AdminAuditResourceType;
  resourceId: string;
  summary: string;
  locale?: string;
  metadata?: Record<string, AdminAuditMetadataValue>;
  createdAt: string;
};

function isAdminAuditAction(value: unknown): value is AdminAuditAction {
  return (
    typeof value === "string" &&
    adminAuditActions.includes(value as AdminAuditAction)
  );
}

function isAdminAuditResourceType(value: unknown): value is AdminAuditResourceType {
  return (
    typeof value === "string" &&
    adminAuditResourceTypes.includes(value as AdminAuditResourceType)
  );
}

function sanitizeText(value: string) {
  return value.trim().slice(0, maxTextLength);
}

function sanitizeMetadata(
  metadata: AdminAuditEvent["metadata"] | unknown,
): AdminAuditEvent["metadata"] {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return undefined;
  }

  const entries = Object.entries(metadata)
    .filter((entry): entry is [string, AdminAuditMetadataValue] => {
      const value = entry[1];
      return (
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      );
    })
    .slice(0, maxMetadataEntries)
    .map(([key, value]) => [
      sanitizeText(key),
      typeof value === "string" ? sanitizeText(value) : value,
    ]);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

async function ensureAuditFile() {
  await mkdir(path.dirname(auditFilePath), { recursive: true });

  try {
    await readFile(auditFilePath, "utf8");
  } catch {
    await appendFile(auditFilePath, "", "utf8");
  }
}

export async function logAdminAuditEvent(
  event: Omit<AdminAuditEvent, "id" | "createdAt">,
) {
  await ensureAuditFile();

  const entry: AdminAuditEvent = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    action: event.action,
    resourceType: event.resourceType,
    resourceId: sanitizeText(event.resourceId),
    summary: sanitizeText(event.summary),
    locale: event.locale ? sanitizeText(event.locale) : undefined,
    metadata: sanitizeMetadata(event.metadata),
  };

  await appendFile(auditFilePath, `${JSON.stringify(entry)}\n`, "utf8");
  return entry;
}

export async function getRecentAdminAuditEvents(limit = 8) {
  await ensureAuditFile();

  const raw = await readFile(auditFilePath, "utf8");
  const events = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line): AdminAuditEvent[] => {
      try {
        const event = JSON.parse(line) as Partial<AdminAuditEvent>;

        if (
          typeof event.id !== "string" ||
          typeof event.action !== "string" ||
          typeof event.resourceType !== "string" ||
          typeof event.resourceId !== "string" ||
          typeof event.summary !== "string" ||
          typeof event.createdAt !== "string"
        ) {
          return [];
        }

        if (
          !isAdminAuditAction(event.action) ||
          !isAdminAuditResourceType(event.resourceType)
        ) {
          return [];
        }

        return [
          {
            id: event.id,
            action: event.action,
            resourceType: event.resourceType,
            resourceId: sanitizeText(event.resourceId),
            summary: sanitizeText(event.summary),
            locale: typeof event.locale === "string" ? sanitizeText(event.locale) : undefined,
            metadata: sanitizeMetadata(event.metadata),
            createdAt: event.createdAt,
          },
        ];
      } catch {
        return [];
      }
    });

  return events
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit);
}
