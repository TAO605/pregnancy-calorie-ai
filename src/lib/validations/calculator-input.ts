import { z } from "zod";

import { locales } from "@/lib/i18n/config";

export const calculatorInputSchema = z.object({
  age: z.coerce.number().min(16).max(55),
  height: z.coerce.number().gt(0),
  heightUnit: z.enum(["cm", "in"]),
  prePregnancyWeight: z.coerce.number().gt(0),
  currentWeight: z.coerce.number().gt(0).optional(),
  weightUnit: z.enum(["kg", "lb"]),
  gestationalWeek: z.coerce.number().int().min(1).max(42),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
  pregnancyType: z.enum(["singleton", "multiple"]),
  countryCode: z.string().trim().min(2).max(3),
  locale: z.enum(locales),
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export type NormalizedCalculatorInput = {
  age: number;
  heightCm: number;
  prePregnancyWeightKg: number;
  currentWeightKg?: number;
  gestationalWeek: number;
  activityLevel: CalculatorInput["activityLevel"];
  pregnancyType: CalculatorInput["pregnancyType"];
  countryCode: string;
  locale: CalculatorInput["locale"];
};

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function normalizeCalculatorInput(input: CalculatorInput): NormalizedCalculatorInput {
  const heightCm = input.heightUnit === "cm" ? input.height : input.height * 2.54;
  const prePregnancyWeightKg =
    input.weightUnit === "kg" ? input.prePregnancyWeight : input.prePregnancyWeight * 0.45359237;
  const currentWeightKg =
    typeof input.currentWeight === "number"
      ? input.weightUnit === "kg"
        ? input.currentWeight
        : input.currentWeight * 0.45359237
      : undefined;

  return {
    age: input.age,
    heightCm: round(heightCm),
    prePregnancyWeightKg: round(prePregnancyWeightKg),
    currentWeightKg: typeof currentWeightKg === "number" ? round(currentWeightKg) : undefined,
    gestationalWeek: input.gestationalWeek,
    activityLevel: input.activityLevel,
    pregnancyType: input.pregnancyType,
    countryCode: input.countryCode.toUpperCase(),
    locale: input.locale,
  };
}
