import type { Locale } from "@/lib/i18n/config";
import { formatLocalizedCalories, formatLocalizedRange } from "@/lib/i18n/locale-formatting";

type CalorieResultCardProps = {
  locale: Locale;
  calories: number;
  min: number;
  max: number;
  trimester: number;
  source: string;
  caloriesLabel: string;
  perDayLabel: string;
  rangeLabel: string;
  rangeHint: string;
  trimesterChipLabel: string;
  sourceChipLabel: string;
};

export function CalorieResultCard({
  locale,
  calories,
  min,
  max,
  trimester,
  source,
  caloriesLabel,
  perDayLabel,
  rangeLabel,
  rangeHint,
  trimesterChipLabel,
  sourceChipLabel,
}: CalorieResultCardProps) {
  const formattedCalories = formatLocalizedCalories(calories, locale);
  const formattedRange = formatLocalizedRange(min, max, locale);

  return (
    <section className="surface-card hero-panel rounded-[2rem] p-8 md:p-10">
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="metric-chip bg-[rgba(255,122,89,0.12)] text-[#a34c36]">
          {trimesterChipLabel || `Trimester ${trimester}`}
        </span>
        <span className="metric-chip bg-[rgba(10,114,239,0.08)] text-[#0a72ef]">
          {sourceChipLabel || source}
        </span>
      </div>

      <div className="grid gap-10 md:grid-cols-[1.4fr_0.9fr] md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">
            {caloriesLabel}
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="display-tight text-6xl font-semibold tracking-[-0.1em] text-foreground md:text-8xl">
              {formattedCalories}
            </span>
            <span className="pb-3 text-sm font-medium text-muted">{perDayLabel}</span>
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-[rgba(255,255,255,0.86)] p-5 shadow-border">
          <p className="text-sm font-medium text-muted">{rangeLabel}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
            {formattedRange}
          </p>
          <p className="mt-3 text-sm text-muted">{rangeHint}</p>
        </div>
      </div>
    </section>
  );
}
