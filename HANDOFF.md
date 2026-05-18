# Pregnancy Calorie AI Handoff

## Current State

This project is being rebuilt as a focused Next.js 16 AI pregnancy calorie calculator tool site. The current primary experience is the new Chinese calculator landing page on `/`; the older multilingual dashboard/admin prototype still exists as legacy infrastructure while the new MVP is rebuilt.

Implemented areas:

- rebuilt `/` route with interactive Chinese pregnancy calorie calculator, AI-style explanation, nutrition references, and safety boundaries
- multilingual marketing pages for `en`, `zh-CN`, and `es`
- pregnancy calorie calculator and explainable result page
- guarded AI nutrition assistant with contextual prompts and session history
- demo/Firebase-aware sign-in flow
- protected dashboard with profile, meal, and weight tracking
- admin analytics, content editing, guideline editing, and user activity views with sign-in-source downstream quality splits
- local JSON persistence for MVP/demo data
- health check, security headers, API rate limiting, and safer local file writes
- localized editorial content seed coverage with four published guides per supported locale

## Verification

Default verification command:

```bash
npm run verify
```

This runs:

- `npm run check:prompts`
- `npm run lint`
- `npm run build`

The prompt check guards both source encoding and generated `zh-CN` prompt readability for result, overview, meal, weight, weekly-review, and blog AI entry points.

Latest verified state: `npm run verify` passes.

Production runtime smoke command:

```bash
npm run smoke:prod
```

This starts the built Next.js server on port `3100`, checks the rebuilt root calculator page, legacy public/auth/dashboard/API paths, robots, sitemap, calculator, and AI escalation paths, then stops the server. It also verifies demo-cookie dashboard access, demo user-data access, admin sign-in cookie issuance, protected admin analytics rendering, weekly-review AI conversion rendering with seeded click/context/follow-up data, sign-in-source downstream quality rendering with weight/meal log splits, content/guideline admin audit rendering with readable action labels, analytics event validation, malformed JSON handling for calculator/events APIs, `Cache-Control: no-store` on sensitive JSON APIs, rate-limit headers on admin/calculator/events APIs, and readable Chinese high-risk AI escalation output.

## Runtime Configuration

Required for `npm run start` and production-mode admin sign-in:

```bash
ADMIN_DEMO_PASSWORD=
```

Optional Firebase Auth:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Use [.env.example](D:/pregnancy-calorie-ai/.env.example) as the environment checklist.

## QA Notes

Use [QA.md](D:/pregnancy-calorie-ai/QA.md) for the local production smoke checklist.

Important cleanup after manual QA:

- confirm port `3100` is free before starting `npm run start -- -p 3100`
- stop any leftover Node process on port `3100` after smoke tests so later checks do not hit a stale build
- expect `npm run smoke:prod` to update ignored local runtime files such as `data/user-activity.json`, `data/analytics-events.jsonl`, `data/admin-audit.jsonl`, and `data/guideline-overrides.json`
- `npm run smoke:prod` temporarily saves a content page but restores the original `data/content-pages.json` contents before finishing
- remove any `qa@example.com` records from `data/demo-user-data.json`
- restore guideline override test changes if admin guideline edits are tested
- confirm no `*.tmp` files remain under `data/`
- `.qa/` is local-only and ignored by git
- local runtime files under `data/` are ignored by git; keep only intentional demo seed content such as `data/content-pages.json`
- `public/robots.txt` is the canonical crawler-control file; do not recreate `src/app/robots.ts` or `src/app/robots.txt` unless you re-verify the exact runtime output

## Production Caveats

This is ready for MVP demo and internal iteration, not a fully durable production backend.

Before production launch:

- move local JSON stores to a durable backend
- replace in-memory rate limiting with Redis, edge rules, or WAF-managed limits
- validate live Firebase Auth rules and session behavior
- perform privacy/security review
- perform final medical/legal copy review

## Model Tier Guidance

Default to `GPT-5.5` medium reasoning for ongoing product development. Use lower-cost tiers only when the change is clearly scoped and low risk.

Recommended routing:

- `GPT-5.4` low: quick lookups, small copy edits, simple file location questions, and tiny CSS/text changes.
- `GPT-5.4` medium: localized editorial content, README/QA/HANDOFF updates, focused UI polish, and simple analytics copy or display changes.
- `GPT-5.5` medium: default feature work across calculator, result pages, AI assistant, dashboard, admin, API validation, SEO, and i18n.
- `GPT-5.5` high: auth/session bugs, Firebase demo/live mode, AI assistant context/history, local persistence edge cases, and analytics attribution debugging.
- `GPT-5.5` xhigh: production readiness review, security/privacy review, medical/legal boundary review, durable backend migration, and broad architecture changes.

Switch to high or higher reasoning for:

- live Firebase integration
- security/privacy review
- final launch readiness review
- broad architecture changes
