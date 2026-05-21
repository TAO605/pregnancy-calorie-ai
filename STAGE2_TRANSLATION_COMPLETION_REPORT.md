# Stage 2 Translation Completion Report

## Summary

- English source file: `public/locales/en/common.json`
- Target language files: `es`, `fr`, `de`, `pt`, `it`, `ru`, `ar`, `ja`, `ko`
- Missing target keys after comparison: 0 for every target language
- Translation status: all newly added runtime keys are present in every target language file
- Glossary enforcement: completed for kcal and BMI according to the mandatory terminology table
- Placeholder validation: passed for every English key in every target language

## DeepL API Notes

The new runtime strings had already been translated through the official DeepL Free API endpoint during the previous implementation pass. For this stage, no target language had missing keys, so no additional missing-key batch translation was required. The forced glossary pass did not use any non-DeepL translation source; it only applied the user-provided mandatory terminology table to existing DeepL-generated values.

## Per-Language Status

| Language | English keys present | Extra meta keys | Missing keys | Placeholder errors | Glossary overrides | Status |
|---|---:|---:|---:|---:|---:|---|
| es | 1045/1045 | 6 | 0 | 0 | 0 | Passed |
| fr | 1045/1045 | 6 | 0 | 0 | 0 | Passed |
| de | 1045/1045 | 6 | 0 | 0 | 0 | Passed |
| pt | 1045/1045 | 6 | 0 | 0 | 0 | Passed |
| it | 1045/1045 | 6 | 0 | 0 | 1 | Passed |
| ru | 1045/1045 | 6 | 0 | 0 | 1 | Passed |
| ar | 1045/1045 | 6 | 0 | 0 | 2 | Passed |
| ja | 1045/1045 | 6 | 0 | 0 | 8 | Passed |
| ko | 1045/1045 | 6 | 0 | 0 | 8 | Passed |

## Mandatory Glossary Enforcement

- kcal: preserved as `kcal` for es/fr/de/pt/it, changed to `????` for ru, `???? ??????` for ar, `??????` for ja, and `?????` for ko.
- BMI: enforced as `IMC` for es/fr/pt/it, `BMI` for de/ja/ko, `???` for ru, and `???? ???? ?????` for ar.
- Dynamic placeholders such as `{week}`, `{bmi}`, `{calories}`, `{extra}`, `{total}`, and `{weight}` were verified unchanged.

## Generated Evidence

- Glossary override detail: `.qa/reports/stage2-glossary-overrides.json`
- Locale backup: `public/locales_backup_stage2_20260519_1757`
- Static pages regenerated with: `npm run localize:delivery`
