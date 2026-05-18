"use client";

import { useState } from "react";

import type { GuidelinePack } from "@/lib/calculator/guideline-packs";
import { getAdminCopy } from "@/lib/i18n/admin-copy";
import type { Locale } from "@/lib/i18n/config";

type GuidelinesEditorProps = {
  initialPacks: GuidelinePack[];
  locale: Locale;
};

export function GuidelinesEditor({ initialPacks, locale }: GuidelinesEditorProps) {
  const copy = getAdminCopy(locale);
  const [packs, setPacks] = useState<GuidelinePack[]>(initialPacks);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updatePack(
    packId: string,
    field: keyof Omit<GuidelinePack, "trimesterCalories" | "id">,
    value: string,
  ) {
    setPacks((current) =>
      current.map((pack) =>
        pack.id === packId
          ? {
              ...pack,
              [field]: value,
            }
          : pack,
      ),
    );
  }

  function updateCalories(packId: string, key: "t1" | "t2" | "t3", value: number) {
    setPacks((current) =>
      current.map((pack) =>
        pack.id === packId
          ? {
              ...pack,
              trimesterCalories: {
                ...pack.trimesterCalories,
                [key]: value,
              },
            }
          : pack,
      ),
    );
  }

  async function savePack(pack: GuidelinePack) {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/v1/admin/guidelines/${pack.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: pack.displayName,
          countryCode: pack.countryCode,
          trimesterCalories: pack.trimesterCalories,
          disclaimerKey: pack.disclaimerKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? copy.guidelinesEditor.saveError);
      }

      setPacks((current) => current.map((item) => (item.id === data.id ? data : item)));
      setMessage(copy.guidelinesEditor.formatSavedMessage(data.displayName));
    } catch (saveError) {
      setMessage(
        saveError instanceof Error ? saveError.message : copy.guidelinesEditor.saveError,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-[1.3rem] bg-[rgba(10,114,239,0.08)] px-4 py-3 text-sm text-[#0a72ef] shadow-border">
          {message}
        </div>
      ) : null}

      {packs.map((pack) => (
        <article key={pack.id} className="surface-card rounded-[1.8rem] p-8">
          <div className="grid gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {pack.id}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.06em]">
                  {pack.displayName}
                </h2>
              </div>

              <button
                type="button"
                className="cta-primary text-sm"
                onClick={() => void savePack(pack)}
                disabled={isLoading}
              >
                {isLoading ? copy.guidelinesEditor.savingLabel : copy.guidelinesEditor.savePackLabel}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="field-label" htmlFor={`${pack.id}-displayName`}>
                  {copy.guidelinesEditor.displayNameLabel}
                </label>
                <input
                  id={`${pack.id}-displayName`}
                  className="field-input"
                  value={pack.displayName}
                  onChange={(event) => updatePack(pack.id, "displayName", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <label className="field-label" htmlFor={`${pack.id}-countryCode`}>
                  {copy.guidelinesEditor.countryCodeLabel}
                </label>
                <input
                  id={`${pack.id}-countryCode`}
                  className="field-input"
                  value={pack.countryCode}
                  onChange={(event) => updatePack(pack.id, "countryCode", event.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="field-label" htmlFor={`${pack.id}-t1`}>
                  {copy.guidelinesEditor.trimester1Label}
                </label>
                <input
                  id={`${pack.id}-t1`}
                  type="number"
                  className="field-input"
                  value={pack.trimesterCalories.t1}
                  onChange={(event) => updateCalories(pack.id, "t1", Number(event.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <label className="field-label" htmlFor={`${pack.id}-t2`}>
                  {copy.guidelinesEditor.trimester2Label}
                </label>
                <input
                  id={`${pack.id}-t2`}
                  type="number"
                  className="field-input"
                  value={pack.trimesterCalories.t2}
                  onChange={(event) => updateCalories(pack.id, "t2", Number(event.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <label className="field-label" htmlFor={`${pack.id}-t3`}>
                  {copy.guidelinesEditor.trimester3Label}
                </label>
                <input
                  id={`${pack.id}-t3`}
                  type="number"
                  className="field-input"
                  value={pack.trimesterCalories.t3}
                  onChange={(event) => updateCalories(pack.id, "t3", Number(event.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="field-label" htmlFor={`${pack.id}-disclaimerKey`}>
                {copy.guidelinesEditor.disclaimerKeyLabel}
              </label>
              <input
                id={`${pack.id}-disclaimerKey`}
                className="field-input"
                value={pack.disclaimerKey}
                onChange={(event) => updatePack(pack.id, "disclaimerKey", event.target.value)}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
