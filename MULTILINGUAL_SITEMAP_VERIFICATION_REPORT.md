# Multilingual Sitemap Verification Report

Date: 2026-05-18

## Summary

Implemented a compliant multilingual sitemap for:

- `https://aipregnancycaloriecalculator.online/`
- `https://aipregnancycaloriecalculator.online/pricing`
- `https://aipregnancycaloriecalculator.online/about`
- `https://aipregnancycaloriecalculator.online/contact`

The sitemap is generated automatically by `next-sitemap` after every production build.

## Files Added Or Updated

- `next-sitemap.config.cjs`
- `src/app/sitemap.ts`
- `public/sitemap.xml`
- `public/robots.txt`
- `package.json`
- `package-lock.json`
- `MULTILINGUAL_SITEMAP_GSC_GUIDE.md`
- `MULTILINGUAL_SITEMAP_VERIFICATION_REPORT.md`

## Verification Results

| Check | Result |
|---|---:|
| `next-sitemap` installed as dev dependency | Pass |
| `postbuild` automatic generation configured | Pass |
| Sitemap uses base URL `https://aipregnancycaloriecalculator.online` | Pass |
| URL paths remain in English | Pass |
| Total URL entries = 4 pages x 10 languages = 40 | Pass |
| Every URL entry includes all 10 language alternates | Pass |
| Every URL entry includes `x-default` | Pass |
| Only ISO 639-1 language codes used | Pass |
| No country-code hreflang values used | Pass |
| `robots.txt` references production sitemap URL | Pass |
| Local production `/sitemap.xml` response validates | Pass |

## Commands Run

```bash
npm install next-sitemap --save-dev
npm run build
npx next-sitemap --config next-sitemap.config.cjs
```

Then the generated sitemap and the locally served sitemap were both parsed and validated.

## Generated Sitemap Evidence

Generated file:

```text
D:\pregnancy-calorie-ai\public\sitemap.xml
```

Served verification copy:

```text
D:\pregnancy-calorie-ai\.qa\served-sitemap.xml
```

Validation result:

```text
public/sitemap.xml: 40 URL entries, 0 problems
.qa/served-sitemap.xml: 40 URL entries, 0 problems
```

## Example URL Cluster

For Spanish pricing:

```xml
<loc>https://aipregnancycaloriecalculator.online/es/pricing</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://aipregnancycaloriecalculator.online/pricing"/>
<xhtml:link rel="alternate" hreflang="es" href="https://aipregnancycaloriecalculator.online/es/pricing"/>
<xhtml:link rel="alternate" hreflang="fr" href="https://aipregnancycaloriecalculator.online/fr/pricing"/>
<xhtml:link rel="alternate" hreflang="de" href="https://aipregnancycaloriecalculator.online/de/pricing"/>
<xhtml:link rel="alternate" hreflang="pt" href="https://aipregnancycaloriecalculator.online/pt/pricing"/>
<xhtml:link rel="alternate" hreflang="it" href="https://aipregnancycaloriecalculator.online/it/pricing"/>
<xhtml:link rel="alternate" hreflang="ru" href="https://aipregnancycaloriecalculator.online/ru/pricing"/>
<xhtml:link rel="alternate" hreflang="ar" href="https://aipregnancycaloriecalculator.online/ar/pricing"/>
<xhtml:link rel="alternate" hreflang="ja" href="https://aipregnancycaloriecalculator.online/ja/pricing"/>
<xhtml:link rel="alternate" hreflang="ko" href="https://aipregnancycaloriecalculator.online/ko/pricing"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://aipregnancycaloriecalculator.online/pricing"/>
```

