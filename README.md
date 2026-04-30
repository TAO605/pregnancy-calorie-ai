# Pregnancy Calorie AI

A multilingual Next.js product prototype for pregnancy calorie estimation, AI nutrition follow-up, saved profile context, meal logging, weight tracking, and lightweight admin operations.

## What This Project Is

This repo implements an AI tool site with three connected layers:

- acquisition: localized marketing pages and a pregnancy calorie calculator
- activation: explainable result pages and a guarded AI assistant
- retention: saved profiles, meal logs, weight trends, and dashboard workflows

The product currently supports:

- `en`
- `zh-CN`
- `es`

## Current Product Scope

### User-facing

- localized marketing homepage
- pregnancy calorie calculator
- result page with AI CTA
- AI nutrition assistant with saved context, session history, and refresh-safe continuity
- auth-aware AI and result CTA cards that either save to dashboard or continue into tracking
- sign-in flow
- protected dashboard
- profile editor
- meal tracker
- weight tracker
- localized language switcher across marketing and dashboard shells

### Admin-facing

- admin sign-in
- analytics overview
- AI session source, prompt-origin, and saved sign-in source breakdowns
- retention CTA click mix across guest-save and signed-in continue-tracking prompts
- user activity overview
- guideline editor
- content editor

### Persistence

- local JSON files for admin-side content, analytics, and user activity
- local JSON persistence for demo signed-in user data
- local prototype storage for anonymous session and fallback user flows
- optional Firebase sign-in path when environment variables are configured
- automatic seeding of existing local user data into Firebase on first signed-in reads when the cloud profile is still empty

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- optional Firebase Auth

## Local Development

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The root route redirects to `/en`.

## Validation

Run these before claiming a change is complete:

```bash
npm run verify
```

Equivalent manual gates:

```bash
npm run lint
npm run build
```

Current verified baseline:

- `npm run verify`
- `npm run lint`
- `npm run build`

Use this as the minimum acceptance gate after every product or API change.

## Delivery Readiness Notes

The current MVP is suitable for local demo and stakeholder review:

- calculator, result, AI assistant, sign-in, dashboard, meal tracking, weight tracking, admin analytics, content editing, and guideline editing are wired
- non-critical analytics/user-activity writes are best-effort so they do not block calculator, AI, sign-in, or content publishing flows
- API routes return clear `400` responses for malformed JSON and validation failures
- dashboard forms surface saving, success, and failure states instead of failing silently

Before production launch, plan a separate hardening pass for durable persistence, live Firebase/Auth rules, managed multi-instance rate limiting, privacy review, and medical/legal copy review.

## Optional Firebase Configuration

If you want Google sign-in instead of demo-only mode, configure:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

If these are missing, the app stays in prototype-safe demo mode.

Use [.env.example](D:/pregnancy-calorie-ai/.env.example) as the deployment checklist for required and optional environment variables.

## Admin Configuration

`npm run dev` uses the demo admin password from the codebase. `npm run start` and production deployments require:

```bash
ADMIN_DEMO_PASSWORD=
```

Production-mode admin sign-in is rejected when this value is missing.

Optional HTTPS-only hardening:

```bash
ENABLE_HSTS=true
```

Only enable HSTS after confirming the deployed site is served over HTTPS.

## Operational Hardening

The app includes baseline hardening suitable for MVP demos and single-instance deployment:

- security response headers are configured globally in [next.config.ts](D:/pregnancy-calorie-ai/next.config.ts); HSTS is opt-in via `ENABLE_HSTS=true`
- `/robots.txt` disallows admin, API, localized auth sign-in, and localized dashboard routes; `/sitemap.xml` only includes public marketing, tool, legal, and blog URLs
- `/api/v1/health` provides a no-side-effect JSON health check with `Cache-Control: no-store`
- sensitive dynamic JSON APIs use `Cache-Control: no-store`, including admin, demo user data, calculator, AI chat, analytics events, and user snapshot endpoints
- admin session cookies are `HttpOnly`, `SameSite=Lax`, and become `Secure` when the request is HTTPS or forwarded as HTTPS
- client session and locale cookies become `Secure` on HTTPS
- admin sign-in, AI chat, calculator, and analytics event APIs use in-memory rate limiting
- rate-limited APIs expose `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`; `429` responses also include `retry-after`
- local JSON overwrite stores use temp-file plus rename writes to reduce partial-write corruption risk

Current rate limits:

- admin sign-in: 8 attempts per 15 minutes per client IP
- AI chat: 30 requests per minute per client IP
- calculator: 60 requests per minute per client IP
- analytics events: 120 requests per minute per client IP

For multi-instance production, replace the in-memory rate limiter with Redis, an edge provider rule, or managed WAF/rate limiting so counters are shared across instances. Also move local JSON stores to a durable database or object store with explicit concurrency control.

## Important Project Files

- [PRD.md](D:/pregnancy-calorie-ai/PRD.md): product requirements and roadmap
- [DESIGN.md](D:/pregnancy-calorie-ai/DESIGN.md): design baseline for the UI system
- [QA.md](D:/pregnancy-calorie-ai/QA.md): local smoke-test checklist
- [HANDOFF.md](D:/pregnancy-calorie-ai/HANDOFF.md): current delivery state and next-stage guidance
- [src/app/[locale]/(marketing)/page.tsx](D:/pregnancy-calorie-ai/src/app/[locale]/(marketing)/page.tsx): localized homepage
- [src/app/[locale]/(marketing)/tools/pregnancy-calorie-calculator/page.tsx](D:/pregnancy-calorie-ai/src/app/[locale]/(marketing)/tools/pregnancy-calorie-calculator/page.tsx): calculator route
- [src/components/ai/assistant-panel.tsx](D:/pregnancy-calorie-ai/src/components/ai/assistant-panel.tsx): AI assistant UI and context wiring
- [src/components/dashboard/dashboard-overview.tsx](D:/pregnancy-calorie-ai/src/components/dashboard/dashboard-overview.tsx): dashboard landing experience
- [src/components/dashboard/meal-tracker.tsx](D:/pregnancy-calorie-ai/src/components/dashboard/meal-tracker.tsx): meal tracking flow
- [src/components/dashboard/weight-tracker.tsx](D:/pregnancy-calorie-ai/src/components/dashboard/weight-tracker.tsx): weight tracking flow
- [src/app/admin/(protected)](D:/pregnancy-calorie-ai/src/app/admin/(protected)): protected admin routes

## Data Storage

The prototype writes local operational data under [data](D:/pregnancy-calorie-ai/data):

- `content-pages.json` can be kept as editable demo content seed data.
- `guideline-overrides.json`, `analytics-events.jsonl`, `demo-user-data.json`, and `user-activity.json` are local runtime files and are ignored by git.
- `*.tmp` files under `data/` are temporary atomic-write artifacts and should not remain after successful writes.

This is suitable for MVP iteration, not production durability.

## Notes for Contributors

- The repo has known encoding risk in parts of the older global i18n copy. Prefer adding scoped copy files for new localized text instead of broad edits in corrupted dictionaries.
- Some routes contain `[locale]`; on Windows PowerShell, use `-LiteralPath` when reading those files.
- Do not assume dashboard or admin routes are public. Dashboard requires an authenticated session, and admin has a separate protected flow.
- Use `GPT-5.4` low for tiny copy, CSS, or file-location tasks.
- Use `GPT-5.4` medium for editorial content, documentation, and focused UI polish.
- Use `GPT-5.5` medium as the default for product work across calculator, AI, dashboard, admin, API validation, SEO, and i18n.
- Use `GPT-5.5` high for auth/session issues, Firebase mode work, AI context/history, local persistence edge cases, and analytics attribution debugging.
- Use `GPT-5.5` xhigh for launch readiness, security/privacy, medical/legal review, durable backend migration, and broad architecture changes.

## Next Recommended Work

- continue expanding localized editorial content beyond the current three published guides per locale
- deepen analytics around weekly review entry points and saved-context conversion into retained tracking behavior
- compare sign-in source with later dashboard, meal, and weight retention quality
- move prototype persistence to a durable backend when product iteration stabilizes
