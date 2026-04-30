# Pregnancy Calorie AI QA Checklist

Use this checklist before handing off a demo build or deployment candidate.

## Build Gates

```bash
npm run verify
```

Equivalent manual gates:

```bash
npm run lint
npm run build
```

Both commands must pass before marking work complete.

## Production Runtime Smoke Test

Start a local production server:

```bash
ADMIN_DEMO_PASSWORD=admin123 npm run start -- -p 3100
```

Verify:

- `/` redirects to `/en`.
- `/en`, `/en/tools/pregnancy-calorie-calculator`, `/en/ai`, `/en/auth/sign-in`, `/admin/sign-in`, `/robots.txt`, and `/sitemap.xml` return `200`.
- `/api/v1/health` returns `200`, `{"ok":true,...}`, and `Cache-Control: no-store`.
- unauthenticated `/en/dashboard` redirects to `/en/auth/sign-in?next=%2Fen%2Fdashboard&source=dashboard_gate`.
- calculator API returns `200` for a valid request and `400` for malformed JSON.
- AI chat API returns `200` for a valid question and `400` for malformed JSON.
- AI chat API returns readable UTF-8 answers and disclaimers for `en`, `zh-CN`, and `es`.
- AI chat API sets `medicalEscalation=true` for high-risk pregnancy symptom questions.
- protected demo/admin APIs return `401` without valid cookies.

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
