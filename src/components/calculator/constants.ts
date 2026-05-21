type CalculatorOption<Value extends string = string> = {
  value: Value;
  label: string;
  description?: string;
};

type PregnancyOptionLabels = {
  gestationalWeek: string;
  singleton: string;
  multiple: string;
  sedentary: string;
  light: string;
  moderate: string;
  active: string;
};

export function getPregnancyWeeks(
  labels: Pick<PregnancyOptionLabels, "gestationalWeek">,
): Array<CalculatorOption<string>> {
  return Array.from({ length: 42 }, (_, index) => {
    const week = String(index + 1);

    return {
      value: week,
      label: `${labels.gestationalWeek} ${week}`,
    };
  });
}

export function getPregnancyTypes(
  labels: Pick<PregnancyOptionLabels, "singleton" | "multiple">,
): Array<CalculatorOption<"singleton" | "multiple">> {
  return [
    {
      value: "singleton",
      label: labels.singleton,
    },
    {
      value: "multiple",
      label: labels.multiple,
    },
  ];
}

export function getDailyActivities(
  labels: Pick<PregnancyOptionLabels, "sedentary" | "light" | "moderate" | "active">,
): Array<CalculatorOption<"sedentary" | "light" | "moderate" | "active">> {
  return [
    {
      value: "sedentary",
      label: labels.sedentary,
    },
    {
      value: "light",
      label: labels.light,
    },
    {
      value: "moderate",
      label: labels.moderate,
    },
    {
      value: "active",
      label: labels.active,
    },
  ];
}
