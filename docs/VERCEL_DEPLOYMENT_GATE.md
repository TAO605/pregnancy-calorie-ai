# Vercel Deployment Gate

This repository now exposes one required deployment gate:

```bash
npm run quality:gate
```

The gate runs:

- Jest unit and integration tests
- Cypress full-flow browser tests
- Percy-backed visual regression snapshots
- report generation under `.qa/reports`

## Required GitHub Settings

To block merges into `main`, enable branch protection for `main` and require the
GitHub Actions check named:

```text
Unit, Integration, E2E, Visual
```

## Required Vercel Settings

Connect Vercel deployments to GitHub and configure production deployments to
only deploy from `main` after required GitHub checks pass. This makes failed
tests block production deployment before Vercel builds the site.

## Required Secrets

Add these GitHub repository secrets:

- `DEEPL_AUTH_KEY`: DeepL Free API key used by the live DeepL smoke test.
- `PERCY_TOKEN`: Percy project token used by visual regression tests.

If either secret is missing in CI, the quality gate is expected to fail.
