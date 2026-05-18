# Google Analytics + Google Search Console Tracking Guide

Project: AI Pregnancy Calorie Calculator  
Website: https://aipregnancycaloriecalculator.online  

## Goal

Track whether overseas promotion work is improving:

- Organic search visibility.
- Indexed pages.
- Traffic quality.
- Pricing and subscription intent.
- Community/link-building impact.

## Google Search Console Setup

### 1. Confirm Property

Path:

Google Search Console -> Property selector -> choose `https://aipregnancycaloriecalculator.online`

Check:

- Domain or URL-prefix property is verified.
- HTTPS canonical domain is selected.
- Sitemap is available at `https://aipregnancycaloriecalculator.online/sitemap.xml`.

### 2. Submit Sitemap

Path:

Google Search Console -> Indexing -> Sitemaps

Submit:

`https://aipregnancycaloriecalculator.online/sitemap.xml`

Record:

- Submission date.
- Status.
- Discovered URLs.
- Any sitemap error.

### 3. Request Indexing for Core Pages

Path:

Google Search Console -> URL Inspection

Submit these pages:

- `https://aipregnancycaloriecalculator.online/`
- `https://aipregnancycaloriecalculator.online/pricing.html`
- `https://aipregnancycaloriecalculator.online/about-us.html`
- `https://aipregnancycaloriecalculator.online/contact-us.html`
- `https://aipregnancycaloriecalculator.online/privacy-policy.html`
- `https://aipregnancycaloriecalculator.online/terms-of-service.html`
- `https://aipregnancycaloriecalculator.online/medical-disclaimer.html`
- `https://aipregnancycaloriecalculator.online/cookie-policy.html`

Click:

- Test live URL.
- Request indexing if the page is not indexed or was recently updated.

### 4. Weekly GSC Metrics

Path:

Google Search Console -> Performance -> Search results

Track weekly:

| Metric | Why it matters |
|---|---|
| Total clicks | Measures actual organic visits |
| Total impressions | Measures search visibility growth |
| Average CTR | Shows title/description appeal |
| Average position | Shows ranking movement |
| Top queries | Reveals real keyword opportunities |
| Top pages | Shows which pages Google understands |
| Countries | Confirms US/CA/UK/AU reach |
| Devices | Confirms mobile performance |

Filters to check:

- Country: United States, Canada, United Kingdom, Australia.
- Query contains: `pregnancy`, `calorie`, `trimester`, `weight gain`, `nutrition`.
- Page contains: `/pricing`, `/premium`, `/about`, `/medical-disclaimer`.

### 5. Indexing and Page Experience

Path:

- GSC -> Indexing -> Pages
- GSC -> Experience -> Core Web Vitals

Track:

- Indexed pages count.
- Crawled - currently not indexed.
- Discovered - currently not indexed.
- 404 errors.
- Mobile usability or Core Web Vitals issues.

Action rule:

- If a core page remains not indexed after 7-14 days, inspect the URL, test live URL, confirm canonical, and request indexing again.

## Google Analytics 4 Setup

### 1. Confirm Data Stream

Path:

Google Analytics -> Admin -> Data streams -> Web stream

Check:

- Stream URL is `https://aipregnancycaloriecalculator.online`.
- Measurement ID is installed on the site.
- Enhanced measurement is enabled if appropriate.

### 2. Verify Real-Time Tracking

Path:

Google Analytics -> Reports -> Realtime

Test:

- Open the production homepage in a new browser tab.
- Visit pricing page.
- Run a calculator action.

Expected:

- Realtime active user appears.
- Page views appear for homepage and pricing.

### 3. Recommended Events

Set up or verify these events:

| Event name | Trigger | Purpose |
|---|---|---|
| `calculator_start` | User focuses or changes calculator input | Measures tool engagement |
| `calculator_result_view` | User completes calculation and sees results | Measures core value delivery |
| `pricing_view` | User visits pricing page | Measures buying intent |
| `premium_click` | User clicks premium/pricing CTA | Measures upgrade intent |
| `checkout_start` | User starts Stripe Checkout | Measures payment funnel |
| `subscription_success` | User returns after successful subscription | Measures conversion |
| `share_click` | User opens share modal or copies share link | Measures viral/referral potential |
| `community_referral_visit` | UTM source from Reddit/Quora/BabyCenter/WTE | Measures community promotion |

### 4. Mark Key Events

Path:

Google Analytics -> Admin -> Events -> Mark as key event

Suggested key events:

- `calculator_result_view`
- `premium_click`
- `checkout_start`
- `subscription_success`

Google's current GA4 interface may also show conversion-related settings. Use the current dashboard labels, but keep the same business logic: mark revenue or high-intent actions as key events.

### 5. UTM Tracking for Promotion

Use UTM links for community and profile links.

Format:

`https://aipregnancycaloriecalculator.online/?utm_source=reddit&utm_medium=community&utm_campaign=launch_week`

Recommended UTM examples:

| Channel | URL pattern |
|---|---|
| Reddit | `?utm_source=reddit&utm_medium=community&utm_campaign=launch_week` |
| Quora | `?utm_source=quora&utm_medium=answer&utm_campaign=launch_week` |
| BabyCenter | `?utm_source=babycenter&utm_medium=community&utm_campaign=launch_week` |
| What to Expect | `?utm_source=whattoexpect&utm_medium=community&utm_campaign=launch_week` |
| Pinterest | `?utm_source=pinterest&utm_medium=social&utm_campaign=launch_week` |
| LinkedIn | `?utm_source=linkedin&utm_medium=social&utm_campaign=launch_week` |
| GitHub | `?utm_source=github&utm_medium=profile&utm_campaign=launch_week` |

### 6. Weekly GA4 Report

Path:

Google Analytics -> Reports

Track:

- Users.
- New users.
- Sessions.
- Engagement rate.
- Average engagement time.
- Page views for homepage, pricing, premium, legal pages.
- Traffic acquisition by source/medium.
- Event count for calculator and premium events.
- Key events.

## Simple Weekly Tracking Sheet

Use this table every Monday.

| Date | GSC clicks | GSC impressions | Avg position | Indexed pages | GA users | Pricing views | Premium clicks | Checkout starts | Subscriptions | Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 2026-05-18 |  |  |  |  |  |  |  |  |  |  |

## Decision Rules

- If impressions rise but clicks stay flat: improve title/description only after confirming current SERP snippets.
- If pricing views rise but checkout starts stay flat: improve pricing copy, trust, refund policy, or CTA clarity.
- If community traffic has low engagement: adjust reply targeting and stop linking in weak-fit threads.
- If GSC queries show a repeated non-blog tool intent: consider a new calculator/tool page.
- If a page is discovered but not indexed: improve internal links, content depth, canonical, and request indexing.

## Sources

- Google Search Console Help: URL Inspection and indexing workflows.
- Google Analytics Help: GA4 events, key events, and reporting workflows.
