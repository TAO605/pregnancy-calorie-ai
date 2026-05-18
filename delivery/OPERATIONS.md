# AI Pregnancy Calorie Calculator Operations Workflow

This document is the operating mechanism for future customer feedback, bug fixes, feature iterations, urgent incidents, and online updates.

## 1. Operating Principle

All production changes must follow this path:

```text
Collect feedback -> classify priority -> edit locally -> verify -> preview deploy -> production deploy -> smoke test -> record change -> monitor
```

Never edit production directly without a local backup and verification step.

## 2. Where The Live Site Code Lives

Primary deployable site files are in:

```text
D:\pregnancy-calorie-ai\delivery
```

Important files:

- `index.html`: homepage calculator, GPT UI, Save Result Image, Share Result, footer navigation.
- `api/pregnancy-guidance.js`: serverless AI proxy.
- `medical-disclaimer.html`, `privacy-policy.html`, `terms-of-service.html`, `cookie-policy.html`, `about-us.html`, `contact-us.html`: compliance pages.
- `logo-*.png/svg`, `favicon.*`, `og-cover.png`: brand and social assets.
- `sitemap.xml`, `robots.txt`: SEO files.
- `.env.local`: local secret file, never upload or paste publicly.

## 3. Feedback Intake Template

For every customer issue or suggestion, record:

```text
Date:
Source: customer / analytics / manual QA / production error
Page:
Device:
Browser:
Screenshot/video:
What user expected:
What actually happened:
How often:
Business impact:
Priority:
Owner:
Status:
```

Suggested priority:

- `P0`: site down, calculator unusable, AI API broken for all users, legal/compliance emergency.
- `P1`: important feature broken, mobile layout broken, Save/Share/Customize/Weekly Update unusable.
- `P2`: small bug, copy issue, visual issue, one browser/device issue.
- `P3`: improvement idea, new content, SEO polish, future feature.

## 4. Recommended Codex Model Level

Use this when asking Codex to handle work:

- `GPT-5.5 low`: tiny copy changes, contact email, one link, one color.
- `GPT-5.5 medium`: normal bug fixes, button behavior, modal copy, small UI fixes, legal page edits.
- `GPT-5.5 high`: feature additions, Save/Share/GPT/Weekly Update changes, cross-device debugging.
- `GPT-5.5 xhigh`: urgent production failures, security/privacy-sensitive fixes, large refactors, medical/YMYL logic changes.

## 5. Safe Change Request Prompt

Use this prompt format for future changes:

```text
Only change [specific feature/file].
100% preserve all existing functions, layout, styles, GPT API behavior, local storage, footer navigation, and mobile adaptation.
Do not modify unrelated code.
After editing, run static checks and browser verification.
Tell me exactly which files changed, what was verified, and how to deploy.
```

For urgent incidents:

```text
Production incident: [describe problem].
Priority: P0/P1.
First reproduce the issue, identify the smallest safe fix, patch only the affected code, verify locally, then prepare production deployment and rollback notes.
```

## 6. Local Verification Checklist

Before any deployment, run at least:

```powershell
cd D:\pregnancy-calorie-ai
node -e "const fs=require('fs'); const html=fs.readFileSync('delivery/index.html','utf8'); const scripts=[...html.matchAll(/<script(?![^>]*type=\"application\/ld\+json\")[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]); scripts.forEach(s=>new Function(s)); const json=[...html.matchAll(/<script[^>]*type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]); json.forEach(j=>JSON.parse(j)); console.log('index ok');"
```

Then test in browser:

- Open `delivery/index.html` locally.
- Calculate result.
- Check `Customize My Tips`.
- Check `Weekly Update`.
- Check `Copy AI Tips`.
- Check `Save Result Image`.
- Check `Share Result`, especially Facebook and TikTok in the custom share panel.
- Check footer links.
- Check mobile width around `375px`.

For the automated Codex operations check, run:

```powershell
cd D:\pregnancy-calorie-ai
node scripts\ops-weekly-check.mjs
```

The latest report is written to:

```text
D:\pregnancy-calorie-ai\.qa\ops-weekly-check-latest.json
```

The Codex autonomous workflow details live in:

```text
D:\pregnancy-calorie-ai\delivery\CODEX_AUTOMATION.md
```

For AI API health after deployment:

```text
https://aipregnancycaloriecalculator.online/api/pregnancy-guidance
```

Expected:

```json
{
  "ok": true,
  "configured": true
}
```

## 7. Preview Deployment

Use preview deployment before production when possible:

```powershell
cd D:\pregnancy-calorie-ai\delivery
vercel
```

Open the preview URL and repeat the key smoke tests.

Use preview for:

- new features
- share/save changes
- GPT prompt/API changes
- layout changes
- legal/privacy wording changes

## 8. Production Deployment

After local and preview checks pass:

```powershell
cd D:\pregnancy-calorie-ai\delivery
vercel --prod --yes
```

After deployment, verify:

- homepage opens
- calculate works
- GPT API health endpoint is configured
- Save Result Image downloads
- Share Result shows all 8 platforms
- legal pages return 200
- no obvious mobile overflow

## 9. Rollback Plan

If production has a serious issue after deployment:

1. Open Vercel project deployments:

```text
https://vercel.com/xutaos-projects-04f1c683/delivery/deployments
```

2. Find the last known good deployment.
3. Use Vercel rollback / promote previous deployment.
4. Record the failed deployment reason in `PROGRESS.md`.
5. Fix locally and redeploy only after verification.

## 10. Incident Playbook

### P0: Site down

1. Check domain loads.
2. Check Vercel deployment status.
3. Roll back to last good deployment if needed.
4. Verify homepage and API health.

### P0/P1: AI GPT broken

1. Open `/api/pregnancy-guidance`.
2. Check `configured`, `provider`, `model`, and `baseUrl`.
3. Check Vercel environment variables.
4. Do not put API keys into `index.html`.
5. Redeploy after environment changes if needed.

### P1: Save/Share broken

1. Reproduce locally at `375px` width.
2. Patch only the affected function.
3. Verify button state, success/failure message, and mobile layout.
4. Deploy preview, then production.

### P1: Medical/calculation bug

1. Stop feature work.
2. Confirm formula and affected inputs.
3. Patch minimally.
4. Test multiple scenarios.
5. Keep a written note of the formula change.

## 11. Change Log Rule

After every meaningful change, update:

```text
D:\pregnancy-calorie-ai\TASKS.md
D:\pregnancy-calorie-ai\PROGRESS.md
```

Record:

- what changed
- what was not changed
- what was verified
- production deployment URL or Vercel deployment id, if deployed

## 12. Weekly Maintenance Routine

Once per week:

- run a mobile smoke test
- check AI API health
- test Save Result Image
- test Share Result 8-platform panel
- check footer/legal links
- check sitemap and robots
- review user feedback and classify new items

## 13. Monthly Maintenance Routine

Once per month:

- review privacy/contact/legal pages
- check whether OpenAI-compatible model settings still work
- test on Chrome, Edge, Safari/iPhone if available
- review Vercel environment variables
- export or screenshot important deployment settings
- confirm backup copy of `delivery` exists

## 14. Production Safety Rules

- Never paste API keys into HTML.
- Never skip mobile testing after UI changes.
- Never deploy Share/Save/GPT changes without a browser test.
- Never overwrite unrelated code to fix a small issue.
- Keep rollback ready before major changes.
