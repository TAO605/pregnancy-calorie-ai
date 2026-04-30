import type { WeightEntry } from "@/types/product";

export type WeightSummary = {
  currentWeightKg: number;
  recentWeightCount: number;
  latestEntryDeltaKg?: number;
  recentTrendDeltaKg?: number;
  prePregnancyWeightKg?: number;
  prePregnancyDeltaKg?: number;
  lastLoggedDate?: string;
  gestationalWeek?: number;
};

function roundWeight(value: number) {
  return Math.round(value * 10) / 10;
}

export function buildWeightSummary({
  entries,
  currentWeightKg,
  prePregnancyWeightKg,
  gestationalWeek,
}: {
  entries: WeightEntry[];
  currentWeightKg?: number;
  prePregnancyWeightKg?: number;
  gestationalWeek?: number;
}): WeightSummary | null {
  const latestEntry = entries[0];
  const resolvedCurrentWeight =
    latestEntry?.weightKg ??
    (typeof currentWeightKg === "number" && Number.isFinite(currentWeightKg)
      ? currentWeightKg
      : null);

  if (resolvedCurrentWeight === null || resolvedCurrentWeight <= 0) {
    return null;
  }

  const previousEntry = entries[1];
  const recentWindow = entries.slice(0, 4);
  const oldestRecentEntry = recentWindow.at(-1);
  const normalizedPrePregnancyWeight =
    typeof prePregnancyWeightKg === "number" && Number.isFinite(prePregnancyWeightKg)
      ? prePregnancyWeightKg
      : undefined;

  return {
    currentWeightKg: roundWeight(resolvedCurrentWeight),
    recentWeightCount: entries.length,
    latestEntryDeltaKg:
      previousEntry ? roundWeight(resolvedCurrentWeight - previousEntry.weightKg) : undefined,
    recentTrendDeltaKg:
      oldestRecentEntry && recentWindow.length > 1
        ? roundWeight(resolvedCurrentWeight - oldestRecentEntry.weightKg)
        : undefined,
    prePregnancyWeightKg: normalizedPrePregnancyWeight,
    prePregnancyDeltaKg:
      typeof normalizedPrePregnancyWeight === "number"
        ? roundWeight(resolvedCurrentWeight - normalizedPrePregnancyWeight)
        : undefined,
    lastLoggedDate: latestEntry?.date,
    gestationalWeek,
  };
}
