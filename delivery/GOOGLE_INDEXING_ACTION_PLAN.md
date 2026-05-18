# Google Search Console Indexing Action Plan

Updated: 2026-05-13

This checklist is for fixing the Google Search Console status "Discovered - currently not indexed" for AI Pregnancy Calorie Calculator.

## Updated URLs

- `https://aipregnancycaloriecalculator.online/`
- `https://aipregnancycaloriecalculator.online/about-us.html`
- `https://aipregnancycaloriecalculator.online/contact-us.html`
- `https://aipregnancycaloriecalculator.online/cookie-policy.html`
- `https://aipregnancycaloriecalculator.online/medical-disclaimer.html`
- `https://aipregnancycaloriecalculator.online/privacy-policy.html`
- `https://aipregnancycaloriecalculator.online/terms-of-service.html`
- `https://aipregnancycaloriecalculator.online/premium`

## What Was Fixed

1. Technical SEO
   - Confirmed `robots.txt` allows public crawling.
   - Confirmed `robots.txt` points to the XML sitemap.
   - Updated `sitemap.xml` with all canonical URLs and fresh `2026-05-13` `lastmod` dates.
   - Confirmed every public page has `index, follow`.
   - Confirmed every page has a canonical URL.

2. E-E-A-T and YMYL Trust Signals
   - Expanded About page with mission, method, references, content review approach, operator, support email, and medical boundary.
   - Expanded Medical Disclaimer with safe-use rules, AI limitations, guideline-based educational estimate wording, and when to seek professional care.
   - Expanded Contact page with support, billing, privacy, correction, and medical-boundary sections.
   - Expanded Cookie Policy with account session, AI cache, subscription, and browser storage details.
   - Added JSON-LD structured data to supporting pages.

3. Internal Linking
   - Footer legal navigation links all seven public pages.
   - Supporting pages link back to the homepage.
   - Related-policy links connect Cookie Policy and Privacy Policy.

## Search Console Steps

1. Open Google Search Console.
2. Select property: `https://aipregnancycaloriecalculator.online/`.
3. Go to `Sitemaps`.
4. Submit or resubmit:

```text
https://aipregnancycaloriecalculator.online/sitemap.xml
```

5. Go to `URL Inspection`.
6. Inspect each URL from the Updated URLs list.
7. Click `Test Live URL`.
8. Confirm the page is not blocked by robots.txt and has canonical URL matching itself.
9. Click `Request Indexing`.
10. Repeat for the six pages currently marked as discovered but not indexed.

## Notes For Review

- "Discovered - currently not indexed" can take time to clear even after fixes. Google still decides when to crawl and index.
- A sitemap helps Google discover and recrawl URLs, but it does not guarantee indexing.
- Do not add doorway pages, hidden text, keyword stuffing, cloaking, or fake medical authority.
- Keep future content focused on pregnancy calorie calculation, nutrition education, meal planning, and safe user support.

## Manual Spot Checks

Use these checks after deployment:

```text
https://aipregnancycaloriecalculator.online/robots.txt
https://aipregnancycaloriecalculator.online/sitemap.xml
https://aipregnancycaloriecalculator.online/about-us.html
https://aipregnancycaloriecalculator.online/contact-us.html
https://aipregnancycaloriecalculator.online/cookie-policy.html
https://aipregnancycaloriecalculator.online/medical-disclaimer.html
https://aipregnancycaloriecalculator.online/privacy-policy.html
https://aipregnancycaloriecalculator.online/terms-of-service.html
```
