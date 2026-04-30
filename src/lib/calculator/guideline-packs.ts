export type GuidelinePackId = "us_acog" | "uk_nhs" | "intl_generic";

export type GuidelinePack = {
  id: GuidelinePackId;
  displayName: string;
  countryCode: string;
  trimesterCalories: {
    t1: number;
    t2: number;
    t3: number;
  };
  disclaimerKey: string;
};

export const guidelinePacks: Record<GuidelinePackId, GuidelinePack> = {
  us_acog: {
    id: "us_acog",
    displayName: "United States (ACOG)",
    countryCode: "US",
    trimesterCalories: {
      t1: 0,
      t2: 340,
      t3: 450,
    },
    disclaimerKey: "medical_disclaimer_us",
  },
  uk_nhs: {
    id: "uk_nhs",
    displayName: "United Kingdom (NHS)",
    countryCode: "GB",
    trimesterCalories: {
      t1: 0,
      t2: 0,
      t3: 200,
    },
    disclaimerKey: "medical_disclaimer_uk",
  },
  intl_generic: {
    id: "intl_generic",
    displayName: "International fallback",
    countryCode: "INTL",
    trimesterCalories: {
      t1: 0,
      t2: 250,
      t3: 400,
    },
    disclaimerKey: "medical_disclaimer_global",
  },
};

export function resolveGuidelinePackId(countryCode: string): GuidelinePackId {
  const upper = countryCode.toUpperCase();

  if (upper === "US") {
    return "us_acog";
  }

  if (upper === "GB" || upper === "UK") {
    return "uk_nhs";
  }

  return "intl_generic";
}

export function resolveGuidelinePack(countryCode: string): GuidelinePack {
  return guidelinePacks[resolveGuidelinePackId(countryCode)];
}

export function getGuidelinePackDisplayName(packId: string): string {
  if (packId in guidelinePacks) {
    return guidelinePacks[packId as GuidelinePackId].displayName;
  }

  return guidelinePacks.intl_generic.displayName;
}
