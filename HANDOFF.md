# Pregnancy Calorie AI Handoff

## Current State

This project is a Next.js 16 MVP for an AI pregnancy calorie calculator and retention-oriented tool site.

Implemented areas:

- multilingual marketing pages for `en`, `zh-CN`, and `es`
- pregnancy calorie calculator and explainable result page
- guarded AI nutrition assistant with contextual prompts and session history
- demo/Firebase-aware sign-in flow
- protected dashboard with profile, meal, and weight tracking
- admin analytics, content editing, guideline editing, and user activity views
- local JSON persistence for MVP/demo data
- health check, security headers, API rate limiting, and safer local file writes

## Verification

Default verification command:

```bash
npm run verify
```

This runs:

- `npm run lint`
- `npm run build`

Latest verified state: `npm run verify` passes.

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

- remove any `qa@example.com` records from `data/demo-user-data.json`
- restore guideline override test changes if admin guideline edits are tested
- confirm no `*.tmp` files remain under `data/`
- `.qa/` is local-only and ignored by git
- local runtime files under `data/` are ignored by git; keep only intentional demo seed content such as `data/content-pages.json`

## Production Caveats

This is ready for MVP demo and internal iteration, not a fully durable production backend.

Before production launch:

- move local JSON stores to a durable backend
- replace in-memory rate limiting with Redis, edge rules, or WAF-managed limits
- validate live Firebase Auth rules and session behavior
- perform privacy/security review
- perform final medical/legal copy review

## Model Tier Guidance

Continue using `GPT-5.5` medium reasoning for feature completion, UI polish, API hardening, documentation, and QA work.

Switch to high or higher reasoning for:

- live Firebase integration
- security/privacy review
- final launch readiness review
- broad architecture changes
