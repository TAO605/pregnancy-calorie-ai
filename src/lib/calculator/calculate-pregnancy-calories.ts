import type { NormalizedCalculatorInput } from "@/lib/validations/calculator-input";
import type { GuidelinePack } from "@/lib/calculator/guideline-packs";
import { resolveGuidelinePack } from "@/lib/calculator/guideline-packs";

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

export type CalculationResult = {
  recommendedCalories: number;
  recommendedRangeMin: number;
  recommendedRangeMax: number;
  trimester: 1 | 2 | 3;
  guidelinePackUsed: string;
  guidelineDisplayName: string;
  disclaimerKey: string;
  riskFlags: string[];
  extraCalories: number;
  bmiClass: "underweight" | "normal" | "overweight" | "obese";
};

function getTrimester(gestationalWeek: number): 1 | 2 | 3 {
  if (gestationalWeek <= 13) {
    return 1;
  }

  if (gestationalWeek <= 26) {
    return 2;
  }

  return 3;
}

function classifyBmi(heightCm: number, weightKg: number): CalculationResult["bmiClass"] {
  const bmi = weightKg / (heightCm / 100) ** 2;

  if (bmi < 18.5) {
    return "underweight";
  }

  if (bmi < 25) {
    return "normal";
  }

  if (bmi < 30) {
    return "overweight";
  }

  return "obese";
}

function roundToNearestTen(value: number) {
  return Math.round(value / 10) * 10;
}

export function calculatePregnancyCalories(
  input: NormalizedCalculatorInput,
  packOverride?: GuidelinePack,
): CalculationResult {
  const trimester = getTrimester(input.gestationalWeek);
  const pack = packOverride ?? resolveGuidelinePack(input.countryCode);
  const workingWeightKg = input.currentWeightKg ?? input.prePregnancyWeightKg;
  const bmr = 10 * workingWeightKg + 6.25 * input.heightCm - 5 * input.age - 161;
  const activityCalories = bmr * activityFactors[input.activityLevel];
  const extraCalories =
    trimester === 1
      ? pack.trimesterCalories.t1
      : trimester === 2
        ? pack.trimesterCalories.t2
        : pack.trimesterCalories.t3;
  const recommendedCalories = roundToNearestTen(activityCalories + extraCalories);
  const riskFlags: string[] = [];

  if (input.pregnancyType === "multiple") {
    riskFlags.push("multiple_pregnancy_requires_clinician_review");
  }

  return {
    recommendedCalories,
    recommendedRangeMin: recommendedCalories - 100,
    recommendedRangeMax: recommendedCalories + 100,
    trimester,
    guidelinePackUsed: pack.id,
    guidelineDisplayName: pack.displayName,
    disclaimerKey: pack.disclaimerKey,
    riskFlags,
    extraCalories,
    bmiClass: classifyBmi(input.heightCm, input.prePregnancyWeightKg),
  };
}
