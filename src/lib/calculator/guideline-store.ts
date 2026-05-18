import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import {
  guidelinePacks,
  type GuidelinePack,
  type GuidelinePackId,
  resolveGuidelinePackId,
} from "@/lib/calculator/guideline-packs";
import { writeFileAtomic } from "@/lib/server/atomic-file";

const overrideSchema = z.object({
  id: z.enum(["us_acog", "uk_nhs", "intl_generic"]),
  displayName: z.string().min(3),
  countryCode: z.string().min(2).max(5),
  trimesterCalories: z.object({
    t1: z.coerce.number().min(0).max(2000),
    t2: z.coerce.number().min(0).max(2000),
    t3: z.coerce.number().min(0).max(2000),
  }),
  disclaimerKey: z.string().min(3),
});

const overridesFilePath = path.join(process.cwd(), "data", "guideline-overrides.json");

type OverrideMap = Partial<Record<GuidelinePackId, GuidelinePack>>;

async function ensureOverridesFile() {
  await mkdir(path.dirname(overridesFilePath), { recursive: true });

  try {
    await readFile(overridesFilePath, "utf8");
  } catch {
    await writeFile(overridesFilePath, "{}\n", "utf8");
  }
}

async function readOverrides(): Promise<OverrideMap> {
  await ensureOverridesFile();
  const raw = await readFile(overridesFilePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as OverrideMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

async function writeOverrides(overrides: OverrideMap) {
  await ensureOverridesFile();
  await writeFileAtomic(overridesFilePath, `${JSON.stringify(overrides, null, 2)}\n`);
}

export async function getAllGuidelinePacks(): Promise<GuidelinePack[]> {
  const overrides = await readOverrides();

  return (Object.keys(guidelinePacks) as GuidelinePackId[]).map((packId) => ({
    ...guidelinePacks[packId],
    ...overrides[packId],
    trimesterCalories: {
      ...guidelinePacks[packId].trimesterCalories,
      ...overrides[packId]?.trimesterCalories,
    },
  }));
}

export async function getGuidelinePackById(
  packId: GuidelinePackId,
): Promise<GuidelinePack> {
  const packs = await getAllGuidelinePacks();
  const pack = packs.find((item) => item.id === packId);

  if (!pack) {
    return guidelinePacks.intl_generic;
  }

  return pack;
}

export async function getGuidelinePackByCountry(
  countryCode: string,
): Promise<GuidelinePack> {
  const packId = resolveGuidelinePackId(countryCode);
  return getGuidelinePackById(packId);
}

export async function updateGuidelinePack(
  packId: GuidelinePackId,
  payload: Omit<GuidelinePack, "id">,
): Promise<GuidelinePack> {
  const nextPack = overrideSchema.parse({
    id: packId,
    ...payload,
  });
  const overrides = await readOverrides();

  overrides[packId] = nextPack;
  await writeOverrides(overrides);

  return nextPack;
}
