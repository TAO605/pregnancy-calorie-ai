# Multilingual Testing Guide

## Purpose

This project uses a permanent multilingual quality gate so every change is tested before it can reach `main` and production. English is the baseline. Non-English pages must keep the same function, route shape, layout contract, placeholders, and calculator output.

## Test Commands

Run Jest unit and integration tests:

```bash
npm test
```

Run the full quality gate:

```bash
npm run quality:gate
```

Run Cypress E2E tests only:

```bash
npm run test:e2e
```

Run visual regression tests:

```bash
npm run test:visual
```

Open Cypress interactively:

```bash
npm run cypress:open
```

Run Cypress directly:

```bash
npm run cypress:run
```

## Reports

After `npm run quality:gate`, reports are written to:

- `.qa/reports/quality-gate-report.md`
- `.qa/reports/quality-gate-report.json`
- `.qa/reports/unit-integration.stdout.log`
- `.qa/reports/unit-integration.stderr.log`
- `.qa/reports/e2e.stdout.log`
- `.qa/reports/e2e.stderr.log`
- `.qa/reports/visual.stdout.log`
- `.qa/reports/visual.stderr.log`
- `.qa/reports/cypress-console/`
- `cypress/screenshots/`
- `cypress/videos/`

The Markdown report includes:

- Unit test status and failure logs
- Integration test status and calculator/localization coverage
- E2E flow status
- Visual regression status and screenshot locations
- Overall pass rate
- Failed step count
- Deployment decision
- Fix suggestions

## GitHub Actions

Two workflows are configured:

- `.github/workflows/quality-gate.yml`
- `.github/workflows/test.yml`

The protected `main` branch requires these checks:

- `Unit, Integration, E2E, Visual`
- `自动化测试`

If either check fails, merging to `main` is blocked.

## Required GitHub Secrets

The repository must contain:

- `DEEPL_AUTH_KEY`
- `PERCY_TOKEN`

`DEEPL_AUTH_KEY` is required for CI translation smoke checks. `PERCY_TOKEN` is required for visual regression uploads.

## Failure Handling

When a test fails:

1. GitHub Actions exits with a non-zero status.
2. Required status checks block merge and deployment through the protected branch.
3. The quality gate uploads logs, screenshots, console logs, and JSON/Markdown reports as workflow artifacts.
4. On pull requests, the quality gate posts or updates a PR comment containing the report.
5. Fix the issue locally.
6. Re-run `npm run quality:gate`.
7. Commit and push again to trigger GitHub Actions.

## Visual Regression

With `PERCY_TOKEN`, Percy captures snapshots during Cypress runs. Without `PERCY_TOKEN`, local visual tests still create Cypress full-page screenshots under `cypress/screenshots/` so layout drift can be inspected manually.

## Current Known Red Test Outside The Main Gate

The example Jest config `jest.config.js` discovers tests under `__tests__/`. The strict locale structure test intentionally fails while non-English locale files contain six extra SEO meta keys that English does not contain:

- `home.meta.title`
- `home.meta.description`
- `pricing.meta.title`
- `pricing.meta.description`
- `about.meta.title`
- `about.meta.description`

The production quality gate currently uses `jest.config.cjs`, which reflects the existing approved SEO-meta exception.
