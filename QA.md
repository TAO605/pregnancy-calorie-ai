# Pregnancy Calorie AI QA Checklist

Use this checklist before handing off a demo build or deployment candidate.

## Build Gates

```bash
npm run verify
```

Equivalent manual gates:

```bash
npm run check:prompts
npm run lint
npm run build
```

All commands must pass before marking work complete.

`npm run check:prompts` verifies localized AI prompt templates at two levels: prompt source files must stay ASCII-safe with escaped Chinese text, and the generated `zh-CN` prompt outputs must contain readable Chinese for result, overview, meal, weight, weekly-review, and blog AI entry points.

## Production Runtime Smoke Test

Run the automated production smoke test:

```bash
npm run smoke:prod
```

The script starts `next start` on port `3100`, verifies the critical runtime paths, and stops the server process.

If you need to inspect manually, start a local production server:

```bash
ADMIN_DEMO_PASSWORD=admin123 npm run start -- -p 3100
```

Before starting, confirm port `3100` is not already owned by an old Node process. After stopping the smoke-test server, confirm the port is released so later checks do not hit a stale build.

Automated `smoke:prod` coverage:

- `/` redirects to `/en`.
- `/en`, `/en/tools/pregnancy-calorie-calculator`, `/en/ai`, `/en/auth/sign-in`, `/en/blog`, representative localized blog detail pages, `/admin/sign-in`, `/robots.txt`, and `/sitemap.xml` return `200`.
- `/api/v1/health` returns `200`, `{"ok":true,...}`, and `Cache-Control: no-store`.
- unauthenticated `/en/dashboard` redirects to `/en/auth/sign-in?next=%2Fen%2Fdashboard&source=dashboard_gate`.
- demo-cookie `/en/dashboard` returns `200`.
- protected demo/admin APIs return `401` without valid cookies and `Cache-Control: no-store`.
- demo user-data API returns `200` and a `bundle` payload with demo provider cookies.
- analytics events API accepts a valid event with `Cache-Control: no-store` and rate-limit headers.
- analytics events API rejects unknown event names, invalid nested metadata, and malformed JSON with `400` and `Cache-Control: no-store`.
- admin sign-in returns `200`, sets `nd_admin_session`, includes rate-limit headers, and returns `Cache-Control: no-store`.
- admin-cookie `/admin/analytics` returns `200` and renders the weekly review AI conversion module with seeded click, context-backed chat, and follow-up data.
- smoke seeds ignored local user-activity snapshots and verifies the admin sign-in-source downstream quality module, including separate weight-log and meal-log labels.
- smoke temporarily saves a content page, restores the tracked content seed file, updates a guideline pack, and verifies the admin audit log module renders both recent changes with readable action labels.
- calculator API returns `200`, `Cache-Control: no-store`, and rate-limit headers for a valid request, and returns `400` plus `Cache-Control: no-store` for malformed JSON.
- AI chat API returns readable UTF-8 Chinese output and disclaimer text for a high-risk pregnancy symptom question, and returns `400` plus `Cache-Control: no-store` for malformed JSON.
- AI chat API sets `medicalEscalation=true` for high-risk pregnancy symptom questions.
- `/robots.txt` disallows private admin, API, auth sign-in, and dashboard routes.
- `/sitemap.xml` excludes private admin, auth sign-in, and dashboard routes.

Manual API edge cases to check when those routes change:

- AI chat API returns readable UTF-8 answers and disclaimers for `en`, `zh-CN`, and `es`.

## Authenticated Demo Smoke Test

Use cookies:

```text
nd_session=authenticated; nd_provider=demo; nd_user_email=qa%40example.com
```

Verify:

- `/en/dashboard`, `/en/dashboard/profile`, `/en/dashboard/weight`, and `/en/dashboard/meals` return `200`.
- `/api/v1/demo/user-data` returns `200` for demo provider cookies.
- `/api/v1/demo/user-data` returns `401` for firebase provider cookies.

Clean any `qa@example.com` test record from `data/demo-user-data.json` after write tests.

## Security Smoke Test

Verify response headers on `/en`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` appears only when `ENABLE_HSTS=true`

Verify admin login behavior:

- missing `ADMIN_DEMO_PASSWORD` in production mode returns `503`
- configured admin password returns `200`
- wrong admin password returns `401`
- repeated wrong admin password attempts return `429`
- calculator success responses include `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`
- admin `429` responses include `retry-after`, `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`
- sensitive dynamic APIs return `Cache-Control: no-store`, including admin, demo user data, calculator, AI chat, analytics events, and user snapshot endpoints

Verify crawler controls:

- `/robots.txt` disallows `/admin`, `/api/`, and each localized auth sign-in/dashboard route
- `/sitemap.xml` includes public localized marketing/tool/legal/blog URLs only

Verify local persistence hygiene after write tests:

- no `*.tmp` files remain under `data/`
- reset `data/demo-user-data.json` and test guideline overrides if QA writes test records
- `npm run smoke:prod` may update ignored local runtime files such as `data/user-activity.json`, `data/analytics-events.jsonl`, `data/admin-audit.jsonl`, and `data/guideline-overrides.json`; it also temporarily writes `data/content-pages.json` but restores the original file contents before finishing
