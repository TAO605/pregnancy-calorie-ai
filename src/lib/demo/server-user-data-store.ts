import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { writeFileAtomic } from "@/lib/server/atomic-file";
import type { DemoUserDataBundle } from "@/types/product";

const demoUserDataFilePath = path.join(process.cwd(), "data", "demo-user-data.json");

type DemoUserDataStore = Record<string, DemoUserDataBundle>;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureDemoUserDataFile() {
  await mkdir(path.dirname(demoUserDataFilePath), { recursive: true });

  try {
    await readFile(demoUserDataFilePath, "utf8");
  } catch {
    await writeFile(demoUserDataFilePath, "{}", "utf8");
  }
}

async function readDemoUserDataStore(): Promise<DemoUserDataStore> {
  await ensureDemoUserDataFile();
  const raw = await readFile(demoUserDataFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as DemoUserDataStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeDemoUserDataStore(store: DemoUserDataStore) {
  await ensureDemoUserDataFile();
  await writeFileAtomic(demoUserDataFilePath, JSON.stringify(store, null, 2));
}

export async function readDemoUserDataBundle(email: string) {
  const store = await readDemoUserDataStore();
  return store[normalizeEmail(email)] ?? null;
}

export async function writeDemoUserDataBundle(
  email: string,
  bundle: DemoUserDataBundle,
) {
  const store = await readDemoUserDataStore();
  const normalizedEmail = normalizeEmail(email);
  const nextBundle: DemoUserDataBundle = {
    ...bundle,
    updatedAt: new Date().toISOString(),
  };

  store[normalizedEmail] = nextBundle;
  await writeDemoUserDataStore(store);
  return nextBundle;
}
