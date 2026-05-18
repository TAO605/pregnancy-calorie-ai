# Multilingual Maintenance Process

This document is the permanent maintenance process for the multilingual AI Pregnancy Calorie Calculator website.

## Core Rules

1. English is the single source of truth.
2. All content and UI text changes are made in English first.
3. Non-English language files are generated from the tested English source only.
4. Never edit non-English locale files directly.
5. Never use ChatGPT, Google Translate, browser translation, or any other translation tool for production locale text.
6. All production translations must use the DeepL Free API through the configured `DEEPL_AUTH_KEY` secret.
7. The raw DeepL key must never be committed to this public repository.
8. If `DEEPL_AUTH_KEY` is missing, invalid, or the DeepL API is unavailable, stop the translation task immediately.
9. Always run the full quality gate before deployment.

## Translation Source And Targets

- Source file: `public/locales/en/common.json`
- Target files:
  - `public/locales/es/common.json`
  - `public/locales/fr/common.json`
  - `public/locales/de/common.json`
  - `public/locales/pt/common.json`
  - `public/locales/it/common.json`
  - `public/locales/ru/common.json`
  - `public/locales/ar/common.json`
  - `public/locales/ja/common.json`
  - `public/locales/ko/common.json`
- DeepL endpoint: `https://api-free.deepl.com/v2/translate`
- Required secret name: `DEEPL_AUTH_KEY`

## Incremental Update Process

Use this process for all future content or UI-copy changes.

1. Change only `public/locales/en/common.json`.
2. Run English-only checks and manually verify the English page behavior.
3. Deploy or preview the English version only after the English checks pass.
4. Identify the exact keys that were added or changed in `en/common.json`.
5. For each target language, in order `es`, `fr`, `de`, `pt`, `it`, `ru`, `ar`, `ja`, `ko`:
   - Translate only the changed or added values using the DeepL API.
   - Preserve JSON keys, order, placeholders, punctuation markers, and variable tokens.
   - Update only those changed values in the target `common.json`.
   - Do not touch unrelated keys.
   - Verify JSON syntax.
   - Verify all keys match `en/common.json`.
   - Verify all placeholders match the English source.
   - Verify page layout and calculator behavior for that language.
   - For Arabic, verify `dir="rtl"` behavior and right-aligned form fields.
6. Run the full automated quality gate:

```bash
npm run quality:gate
```

7. Commit changes only after the quality gate passes.
8. Let GitHub Actions run `Quality Gate`.
9. Deploy only when GitHub Actions is green.

## Monthly Maintenance Process

Run this once per month, or after any meaningful SEO or layout change.

1. Run `npm run quality:gate`.
2. Review `.qa/reports/quality-gate-report.json`.
3. Review GitHub Actions for the latest `Quality Gate` result.
4. Review Percy visual snapshots for layout drift.
5. Check user feedback for translation errors.
6. Correct outdated or incorrect translations only through the DeepL API.
7. Re-run the full quality gate before merging or deploying.

## Emergency Rollback Process

Use this if any non-English language causes broken layout, broken calculator behavior, missing text, or harmful mistranslation.

1. Stop deployment if the issue is found before release.
2. If already released, remove the affected language folder from `public/locales/{lang}` and the affected static language routes from `delivery/{lang}`.
3. Keep English available as the fallback experience.
4. Recreate the affected language from `en/common.json` using the DeepL API only.
5. Run the per-language verification pipeline.
6. Run `npm run quality:gate`.
7. Redeploy only after all checks pass.

## Verification Checklist

- [ ] English source changed first.
- [ ] No direct manual edits to non-English translations.
- [ ] DeepL API used through `DEEPL_AUTH_KEY`.
- [ ] No raw API key committed.
- [ ] No missing or extra locale keys.
- [ ] Placeholders preserved exactly.
- [ ] Calculator returns the same result across languages.
- [ ] Arabic RTL layout checked when Arabic changed.
- [ ] `npm run quality:gate` passes locally.
- [ ] GitHub Actions `Quality Gate` passes.
- [ ] Percy visual snapshots are reviewed.

