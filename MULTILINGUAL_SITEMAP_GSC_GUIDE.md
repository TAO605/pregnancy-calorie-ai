# Multilingual Sitemap And Google Search Console Guide

Date: 2026-05-18

## Sitemap Location

Production sitemap URL:

```text
https://aipregnancycaloriecalculator.online/sitemap.xml
```

Robots file:

```text
https://aipregnancycaloriecalculator.online/robots.txt
```

## Included URL Structure

URL paths stay in English. The sitemap includes 4 page paths across 10 languages:

- `/`
- `/pricing`
- `/about`
- `/contact`

English uses the default clean URL:

- `https://aipregnancycaloriecalculator.online`
- `https://aipregnancycaloriecalculator.online/pricing`
- `https://aipregnancycaloriecalculator.online/about`
- `https://aipregnancycaloriecalculator.online/contact`

Non-English pages use the language prefix plus the same English path:

- `https://aipregnancycaloriecalculator.online/es/pricing`
- `https://aipregnancycaloriecalculator.online/fr/about`
- `https://aipregnancycaloriecalculator.online/de/contact`

## Hreflang Rules Applied

Every sitemap URL entry includes:

- `en`
- `es`
- `fr`
- `de`
- `pt`
- `it`
- `ru`
- `ar`
- `ja`
- `ko`
- `x-default`

Only ISO 639-1 language codes are used. No country codes are used.

`x-default` always points to the English clean URL for the same page path.

## Automatic Regeneration

The project uses `next-sitemap`.

Automatic regeneration is configured through:

```json
"postbuild": "next-sitemap --config next-sitemap.config.cjs"
```

On Vercel, every deployment runs the normal build command. After `next build` finishes, `postbuild` automatically regenerates:

- `public/sitemap.xml`
- `public/robots.txt`

## Local Verification Commands

Run:

```bash
npm run build
```

Then verify:

```bash
npm run start
```

Open:

```text
http://127.0.0.1:3000/sitemap.xml
```

Expected result:

- 40 `<url>` entries
- 11 alternate links per entry
- `x-default` included in every entry
- no translated URL paths
- no country-code hreflang values

## Google Search Console Submission Steps

1. Open Google Search Console.
2. Select the property for:

```text
https://aipregnancycaloriecalculator.online/
```

3. In the left menu, click `Sitemaps`.
4. In `Add a new sitemap`, enter:

```text
sitemap.xml
```

5. Click `Submit`.
6. Wait for Google to show `Success`.
7. After submission, inspect these representative URLs:

```text
https://aipregnancycaloriecalculator.online/
https://aipregnancycaloriecalculator.online/es/
https://aipregnancycaloriecalculator.online/fr/pricing
https://aipregnancycaloriecalculator.online/de/about
```

8. Use `URL Inspection -> Test Live URL` for each representative URL.
9. If the live test is valid, click `Request indexing`.

## Maintenance Rule

When a new public page is added, update both sitemap generators:

- `next-sitemap.config.cjs`
- `src/app/sitemap.ts`

Keep the page path in English and add it to the shared page list.

