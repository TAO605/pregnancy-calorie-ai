export type AssistantContext = {
  latestCalculation?: {
    recommendedCalories: number;
    recommendedRangeMin: number;
    recommendedRangeMax: number;
    trimester: 1 | 2 | 3;
    guidelineDisplayName: string;
    countryCode: string;
    gestationalWeek: number;
    riskFlags: string[];
  };
  mealSummary?: {
    recentMealCount: number;
    averageMealCalories: number;
    todayLoggedCalories?: number;
    lastLoggedDate?: string;
  };
  weightSummary?: {
    currentWeightKg: number;
    recentWeightCount: number;
    latestEntryDeltaKg?: number;
    recentTrendDeltaKg?: number;
    prePregnancyWeightKg?: number;
    prePregnancyDeltaKg?: number;
    lastLoggedDate?: string;
    gestationalWeek?: number;
  };
  profilePreferences?: {
    dietPreferences: string[];
  };
};
