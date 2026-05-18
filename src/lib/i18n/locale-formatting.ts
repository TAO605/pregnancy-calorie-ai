import formatRules from "@/lib/i18n/locale-formatting.config.json";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

type LocaleFormatRule = {
  bcp47: string;
  numberLocale: string;
  groupSeparator: string;
  decimalSeparator: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "DD.MM.YYYY" | "YYYY/MM/DD" | "YYYY.MM.DD";
  unitSystem: "both" | "metric";
  heightUnit: "cm" | "in";
  weightUnit: "kg" | "lb";
  countryCode: string;
};

type UnitDefaults = Pick<LocaleFormatRule, "heightUnit" | "weightUnit" | "countryCode">;

const rules = formatRules as Record<string, LocaleFormatRule>;

export function getLocaleFormatRule(locale: Locale): LocaleFormatRule {
  return rules[isLocale(locale) ? locale : defaultLocale] ?? rules[defaultLocale];
}

function normalizeSpaces(value: string) {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

export function formatLocalizedNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
) {
  const rule = getLocaleFormatRule(locale);
  const minimumFractionDigits =
    typeof options.minimumFractionDigits === "number" ? options.minimumFractionDigits : 0;
  const maximumFractionDigits =
    typeof options.maximumFractionDigits === "number" ? options.maximumFractionDigits : 0;

  if (maximumFractionDigits >= minimumFractionDigits) {
    const fixed = value.toFixed(maximumFractionDigits);
    const [integerPart = "0", decimalPart = ""] = fixed.split(".");
    const groupedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      rule.groupSeparator,
    );
    const trimmedDecimal =
      maximumFractionDigits === minimumFractionDigits
        ? decimalPart
        : decimalPart.replace(/0+$/, "");

    return trimmedDecimal
      ? `${groupedInteger}${rule.decimalSeparator}${trimmedDecimal}`
      : groupedInteger;
  }

  return normalizeSpaces(new Intl.NumberFormat(rule.numberLocale, options).format(value));
}

export function formatLocalizedCalories(value: number, locale: Locale) {
  return formatLocalizedNumber(value, locale, {
    maximumFractionDigits: 0,
  });
}

export function formatLocalizedRange(min: number, max: number, locale: Locale) {
  return `${formatLocalizedCalories(min, locale)} - ${formatLocalizedCalories(max, locale)}`;
}

export function formatLocalizedBmi(value: number, locale: Locale) {
  return formatLocalizedNumber(value, locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function formatLocalizedWeight(value: number, unit: "kg" | "lb", locale: Locale) {
  return `${formatLocalizedNumber(value, locale, {
    maximumFractionDigits: unit === "kg" ? 1 : 0,
  })} ${unit}`;
}

export function formatLocalizedHeight(value: number, unit: "cm" | "in", locale: Locale) {
  return `${formatLocalizedNumber(value, locale, {
    maximumFractionDigits: unit === "cm" ? 1 : 0,
  })} ${unit}`;
}

export function formatLocalizedDate(date: Date, locale: Locale) {
  const rule = getLocaleFormatRule(locale);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (rule.dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`;
    case "YYYY.MM.DD":
      return `${year}.${month}.${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

export function getDefaultUnitsForLocale(locale: Locale): UnitDefaults {
  const rule = getLocaleFormatRule(locale);

  return {
    heightUnit: rule.heightUnit,
    weightUnit: rule.weightUnit,
    countryCode: rule.countryCode,
  };
}

export function getHtmlLang(locale: Locale) {
  return getLocaleFormatRule(locale).bcp47;
}
