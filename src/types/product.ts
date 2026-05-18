import type {
  AnalyticsAiChatSourceKey,
  AnalyticsAiPromptOrigin,
} from "@/types/content";

export type DemoSessionUser = {
  uid?: string;
  email: string;
  displayName: string;
  locale: string;
  provider: "demo" | "firebase";
  createdAt: string;
};

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export type UserProfile = {
  displayName: string;
  email: string;
  age: number;
  heightCm: number;
  prePregnancyWeightKg: number;
  currentWeightKg: number;
  gestationalWeek: number;
  pregnancyType: "singleton" | "multiple";
  activityLevel: ActivityLevel;
  countryCode: string;
  locale: string;
  dietPreferences: string[];
  updatedAt: string;
};

export type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
  note: string;
  createdAt: string;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealItem = {
  name: string;
  estimatedCalories: number;
};

export type MealEntry = {
  id: string;
  date: string;
  mealType: MealType;
  items: MealItem[];
  totalCalories: number;
  source: "manual";
  createdAt: string;
};

export type SavedCalculationInput = {
  age: number;
  heightCm: number;
  prePregnancyWeightKg: number;
  currentWeightKg?: number;
  gestationalWeek: number;
  activityLevel: ActivityLevel;
  pregnancyType: "singleton" | "multiple";
  countryCode: string;
  locale: string;
};

export type SavedCalculationOutput = {
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

export type CalculatorSession = {
  id: string;
  locale: string;
  countryCode: string;
  sourcePage: string;
  input: SavedCalculationInput;
  output: SavedCalculationOutput;
  createdAt: string;
};

export type AiChatEntry = {
  id: string;
  locale: string;
  question: string;
  answer: string;
  bullets: string[];
  riskLevel: "low" | "high";
  medicalEscalation: boolean;
  disclaimer: string;
  sessionId: string;
  messageIndex: number;
  promptOrigin: AnalyticsAiPromptOrigin;
  source: AnalyticsAiChatSourceKey;
  createdAt: string;
};

export type DemoUserDataBundle = {
  profile: UserProfile | null;
  weightEntries: WeightEntry[];
  mealEntries: MealEntry[];
  calculatorSessions: CalculatorSession[];
  aiChatEntries: AiChatEntry[];
  updatedAt: string;
};
