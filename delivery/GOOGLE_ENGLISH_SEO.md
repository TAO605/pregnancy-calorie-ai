# Google English Independent Site Operations

This site is operated as an English Google organic-search website.

## 1. Positioning

- Primary market: overseas English-speaking users.
- Primary search intent: pregnancy calorie calculator, pregnancy calories, pregnancy calorie needs, pregnancy macros, pregnancy weight gain reference.
- Site type: single-purpose health calculator with AI-assisted educational guidance.
- Compliance posture: YMYL health content, educational only, not medical advice.

## 2. Google Launch Checklist

1. Deploy production from `D:\pregnancy-calorie-ai\delivery`.
2. Confirm homepage returns `200`.
3. Confirm `robots.txt` allows crawling.
4. Confirm `sitemap.xml` contains the canonical homepage and legal pages.
5. Confirm homepage has:
   - `lang="en"`
   - canonical URL
   - index/follow robots meta
   - title and meta description
   - OG/Twitter preview tags
   - JSON-LD structured data
6. Submit the property in Google Search Console.
7. Submit sitemap:

```text
https://aipregnancycaloriecalculator.online/sitemap.xml
```

8. Use URL Inspection for:

```text
https://aipregnancycaloriecalculator.online/
```

9. Request indexing after production verification.

## 3. Weekly Google Operations

Run:

```powershell
cd D:\pregnancy-calorie-ai
npm run ops:weekly
```

Then check Google Search Console:

- Pages indexed / not indexed.
- Sitemap fetch status.
- Query impressions and clicks.
- Mobile usability.
- Core Web Vitals when data is available.
- Manual actions or security issues.

## 4. Content Rules

- Keep all user-facing homepage content in clear English.
- Do not add Chinese social platforms or China-specific share flows.
- Avoid unsupported medical claims.
- Keep disclaimers visible and plain.
- Never expose API keys in HTML.
- Any AI output shown, saved, or shared must pass the built-in audit/fallback flow.

## 5. Iteration Rule

For every Google SEO or content change:

1. Patch the smallest related file.
2. Run `npm run ops:weekly`.
3. Verify production after deployment.
4. Record the change in `TASKS.md` and `PROGRESS.md`.

