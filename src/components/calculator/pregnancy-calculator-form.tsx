"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getDailyActivities,
  getPregnancyTypes,
  getPregnancyWeeks,
} from "@/components/calculator/constants";
import { syncUserActivitySnapshot } from "@/lib/admin/client-user-activity";
import { getClientSessionUser } from "@/lib/auth/client-session";
import {
  createCalculatorSession,
  readSavedUserProfile,
  syncProfileFromCalculatorInput,
} from "@/lib/data/user-data";
import { getOrCreateAnonymousSessionId } from "@/lib/demo/demo-store";
import type { Dictionary } from "@/lib/i18n/copy";
import type { Locale } from "@/lib/i18n/config";
import { getDefaultUnitsForLocale } from "@/lib/i18n/locale-formatting";
import {
  calculatorInputSchema,
  normalizeCalculatorInput,
} from "@/lib/validations/calculator-input";
import type { UserProfile } from "@/types/product";

type PregnancyCalculatorFormProps = {
  locale: Locale;
  copy: Dictionary["calculator"];
  labels: Dictionary["calculatorForm"];
};

type FormState = {
  age: string;
  height: string;
  heightUnit: "cm" | "in";
  prePregnancyWeight: string;
  currentWeight: string;
  weightUnit: "kg" | "lb";
  gestationalWeek: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  pregnancyType: "singleton" | "multiple";
  countryCode: string;
};

const defaultsByLocale: Record<string, FormState> = {
  en: {
    age: "31",
    height: "65",
    heightUnit: "in",
    prePregnancyWeight: "128",
    currentWeight: "136",
    weightUnit: "lb",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "US",
  },
  "zh-CN": {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "56",
    currentWeight: "61",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "CN",
  },
  es: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "ES",
  },
  fr: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "FR",
  },
  de: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "DE",
  },
  pt: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "PT",
  },
  it: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "IT",
  },
  ru: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "RU",
  },
  ar: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "SA",
  },
  ja: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "JP",
  },
  ko: {
    age: "30",
    height: "165",
    heightUnit: "cm",
    prePregnancyWeight: "58",
    currentWeight: "62",
    weightUnit: "kg",
    gestationalWeek: "22",
    activityLevel: "moderate",
    pregnancyType: "singleton",
    countryCode: "KR",
  },
};

function buildDefaultFormState(locale: Locale): FormState {
  const fallback = defaultsByLocale.en;
  const defaults = defaultsByLocale[locale] ?? fallback;
  const localizedUnits = getDefaultUnitsForLocale(locale);

  return {
    ...defaults,
    heightUnit: localizedUnits.heightUnit,
    weightUnit: localizedUnits.weightUnit,
    countryCode: localizedUnits.countryCode,
  };
}

function mapProfileToFormState(profile: UserProfile): FormState {
  return {
    age: String(profile.age),
    height: String(profile.heightCm),
    heightUnit: "cm",
    prePregnancyWeight: String(profile.prePregnancyWeightKg),
    currentWeight: String(profile.currentWeightKg),
    weightUnit: "kg",
    gestationalWeek: String(profile.gestationalWeek),
    activityLevel: profile.activityLevel,
    pregnancyType: profile.pregnancyType,
    countryCode: profile.countryCode,
  };
}

export function PregnancyCalculatorForm({
  locale,
  copy,
  labels,
}: PregnancyCalculatorFormProps) {
  const router = useRouter();
  const hasHydratedProfileRef = useRef(false);
  const hasUserEditedRef = useRef(false);
  const [form, setForm] = useState<FormState>(() => buildDefaultFormState(locale));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pregnancyWeeks = useMemo(() => getPregnancyWeeks(labels), [labels, locale]);
  const pregnancyTypes = useMemo(() => getPregnancyTypes(labels), [labels, locale]);
  const dailyActivities = useMemo(() => getDailyActivities(labels), [labels, locale]);

  useEffect(() => {
    let alive = true;

    hasHydratedProfileRef.current = false;
    hasUserEditedRef.current = false;
    queueMicrotask(() => {
      if (!alive) {
        return;
      }

      startTransition(() => {
        setForm(buildDefaultFormState(locale));
        setError("");
      });
    });

    void readSavedUserProfile(locale).then((savedProfile) => {
      if (
        !alive ||
        !savedProfile ||
        hasHydratedProfileRef.current ||
        hasUserEditedRef.current
      ) {
        return;
      }

      hasHydratedProfileRef.current = true;
      startTransition(() => {
        setForm(mapProfileToFormState(savedProfile));
      });
    });

    return () => {
      alive = false;
    };
  }, [locale]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    hasUserEditedRef.current = true;
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        age: Number(form.age),
        height: Number(form.height),
        heightUnit: form.heightUnit,
        prePregnancyWeight: Number(form.prePregnancyWeight),
        currentWeight: form.currentWeight ? Number(form.currentWeight) : undefined,
        weightUnit: form.weightUnit,
        gestationalWeek: Number(form.gestationalWeek),
        activityLevel: form.activityLevel,
        pregnancyType: form.pregnancyType,
        countryCode: form.countryCode,
        locale,
      };

      const response = await fetch("/api/v1/calculator/pregnancy-calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to calculate calories.");
      }

      const normalizedInput = normalizeCalculatorInput(calculatorInputSchema.parse(payload));
      const [, syncedProfile] = await Promise.all([
        createCalculatorSession({
          locale,
          countryCode: normalizedInput.countryCode,
          sourcePage: `/${locale}/tools/pregnancy-calorie-calculator`,
          input: normalizedInput,
          output: {
            recommendedCalories: data.recommendedCalories,
            recommendedRangeMin: data.recommendedRangeMin,
            recommendedRangeMax: data.recommendedRangeMax,
            trimester: data.trimester,
            guidelinePackUsed: data.guidelinePackUsed,
            guidelineDisplayName: data.guidelineDisplayName,
            disclaimerKey: data.disclaimerKey,
            riskFlags: Array.isArray(data.riskFlags) ? data.riskFlags : [],
            extraCalories: data.extraCalories,
            bmiClass: data.bmiClass,
          },
        }).catch(() => {
          // Keep the result flow working even if persistence fails.
          return null;
        }),
        syncProfileFromCalculatorInput(normalizedInput).catch(() => {
          // Keep the result flow working even if profile sync fails.
          return null;
        }),
      ]);
      void getClientSessionUser(locale)
        .then((sessionUser) =>
          syncUserActivitySnapshot({
            anonymousSessionId:
              sessionUser?.email || syncedProfile?.email
                ? undefined
                : getOrCreateAnonymousSessionId(),
            email: sessionUser?.email || syncedProfile?.email || undefined,
            displayName: syncedProfile?.displayName || sessionUser?.displayName || undefined,
            locale,
            countryCode: normalizedInput.countryCode,
            gestationalWeek: normalizedInput.gestationalWeek,
            status: sessionUser?.email || syncedProfile?.email ? "saved_profile" : "anonymous",
            event: "calculator_completed",
            lastRecommendedCalories: data.recommendedCalories,
          }),
        )
        .catch(() => undefined);

      const query = new URLSearchParams({
        calories: String(data.recommendedCalories),
        min: String(data.recommendedRangeMin),
        max: String(data.recommendedRangeMax),
        trimester: String(data.trimester),
        pack: String(data.guidelinePackUsed),
        source: String(data.guidelineDisplayName),
        extra: String(data.extraCalories),
        bmi: String(data.bmiClass),
      });

      if (Array.isArray(data.riskFlags) && data.riskFlags.length > 0) {
        query.set("flags", data.riskFlags.join(","));
      }

      router.push(`/${locale}/tools/pregnancy-calorie-calculator/result?${query.toString()}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to calculate calories.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="field-label" htmlFor="age">
            {labels.age}
          </label>
          <input
            id="age"
            type="number"
            min={16}
            max={55}
            className="field-input"
            value={form.age}
            onChange={(event) => updateField("age", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="field-label" htmlFor="gestationalWeek">
            {labels.gestationalWeek}
          </label>
          <input
            id="gestationalWeek"
            type="number"
            list="gestationalWeekOptions"
            min={1}
            max={42}
            className="field-input"
            value={form.gestationalWeek}
            onChange={(event) => updateField("gestationalWeek", event.target.value)}
          />
          <datalist id="gestationalWeekOptions">
            {pregnancyWeeks.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_11rem]">
        <div className="grid gap-2">
          <label className="field-label" htmlFor="height">
            {labels.height}
          </label>
          <input
            id="height"
            type="number"
            min={1}
            step="0.1"
            className="field-input"
            value={form.height}
            onChange={(event) => updateField("height", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="field-label" htmlFor="heightUnit">
            {labels.heightUnit}
          </label>
          <select
            id="heightUnit"
            className="field-input"
            value={form.heightUnit}
            onChange={(event) => updateField("heightUnit", event.target.value as "cm" | "in")}
          >
            <option value="cm">{labels.metric} (cm)</option>
            <option value="in">{labels.imperial} (in)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_11rem]">
        <div className="grid gap-2">
          <label className="field-label" htmlFor="prePregnancyWeight">
            {labels.prePregnancyWeight}
          </label>
          <input
            id="prePregnancyWeight"
            type="number"
            min={1}
            step="0.1"
            className="field-input"
            value={form.prePregnancyWeight}
            onChange={(event) => updateField("prePregnancyWeight", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="field-label" htmlFor="weightUnit">
            {labels.weightUnit}
          </label>
          <select
            id="weightUnit"
            className="field-input"
            value={form.weightUnit}
            onChange={(event) => updateField("weightUnit", event.target.value as "kg" | "lb")}
          >
            <option value="kg">{labels.metric} (kg)</option>
            <option value="lb">{labels.imperial} (lb)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="field-label" htmlFor="currentWeight">
            {labels.currentWeight} <span className="font-normal">{labels.optional}</span>
          </label>
          <input
            id="currentWeight"
            type="number"
            min={1}
            step="0.1"
            className="field-input"
            value={form.currentWeight}
            onChange={(event) => updateField("currentWeight", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="field-label" htmlFor="countryCode">
            {labels.country}
          </label>
          <select
            id="countryCode"
            className="field-input"
            value={form.countryCode}
            onChange={(event) => updateField("countryCode", event.target.value)}
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="ES">Spain</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="PT">Portugal</option>
            <option value="IT">Italy</option>
            <option value="RU">Russia</option>
            <option value="SA">Saudi Arabia</option>
            <option value="JP">Japan</option>
            <option value="KR">South Korea</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="field-label" htmlFor="activityLevel">
            {labels.activityLevel}
          </label>
          <select
            id="activityLevel"
            className="field-input"
            value={form.activityLevel}
            onChange={(event) =>
              updateField(
                "activityLevel",
                event.target.value as FormState["activityLevel"],
              )
            }
          >
            {dailyActivities.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="field-label" htmlFor="pregnancyType">
            {labels.pregnancyType}
          </label>
          <select
            id="pregnancyType"
            className="field-input"
            value={form.pregnancyType}
            onChange={(event) =>
              updateField(
                "pregnancyType",
                event.target.value as FormState["pregnancyType"],
              )
            }
          >
            {pregnancyTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted">{copy.helper}</p>

      {error ? (
        <div
          className="rounded-2xl bg-[rgba(255,91,79,0.08)] px-4 py-3 text-sm text-[#a93c30] shadow-border"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <button type="submit" className="cta-primary w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? copy.loadingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
