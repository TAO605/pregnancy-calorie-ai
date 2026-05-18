# Codex Autonomous Operations Flow

This document turns the site operations workflow into a repeatable Codex process for AI Pregnancy Calorie Calculator.

## 1. What Codex Should Own

Codex can autonomously run read-only checks, classify issues, create local fixes, verify them, and prepare deployment commands.

Codex must not directly change production without an explicit deployment request.

## 2. Autonomous Loop

```text
Trigger -> collect evidence -> classify P0/P1/P2/P3 -> run checks -> decide action -> patch locally if needed -> verify -> report -> deploy only when approved
```

## 3. Triggers

- Customer feedback: bug, screenshot, feature request, confusing result, mobile issue.
- Production health issue: homepage, legal pages, AI API, Save Image, Share Result.
- Weekly maintenance: run the standard smoke check and summarize failures.
- Emergency incident: site down, AI unavailable, Save/Share unusable, medical/calculation issue.

## 4. Priority Rules

- `P0`: site down, calculator unusable, AI endpoint broken for all users, privacy/security/legal emergency.
- `P1`: core feature broken, including GPT generation, Customize, Weekly Update, Save Result Image, Share Result, mobile layout.
- `P2`: small visual or copy issue, one browser/device issue, non-blocking broken asset.
- `P3`: improvement idea, SEO polish, new content, future feature.

## 5. Standard Autonomous Check Command

Run this from the project root:

```powershell
cd D:\pregnancy-calorie-ai
node scripts\ops-weekly-check.mjs
```

The script writes the latest machine-readable report to:

```text
D:\pregnancy-calorie-ai\.qa\ops-weekly-check-latest.json
```

## 6. What The Script Checks

- `delivery/index.html` inline JavaScript parses.
- JSON-LD parses.
- Six required V12 input rows still exist.
- AI anti-hallucination markers exist.
- Save Result Image audit markers exist.
- Share Result still contains exactly the overseas platform set.
- No domestic share platform markers are present.
- No obvious inline API key pattern exists.
- Key delivery assets and legal pages exist.
- Production homepage, legal pages, robots, sitemap, favicon, OG cover, and AI health endpoint respond.
- Production AI endpoint reports configured status.

## 7. Codex Fix Rules

When a check fails, Codex must:

1. Identify the smallest affected file/function.
2. Read the relevant code before editing.
3. Patch only the related code.
4. Preserve calculator logic, GPT API routing, AI audit, Save Image, Share Result eight platforms, Copy, logo/favicon/OG, footer legal links, local storage, and mobile layout.
5. Re-run the failed check plus the standard static parser.
6. Update `TASKS.md` and `PROGRESS.md`.
7. Report changed files, verification evidence, deploy readiness, and rollback plan for P0/P1.

## 8. Deployment Commands

Preview deployment:

```powershell
cd D:\pregnancy-calorie-ai\delivery
vercel
```

Production deployment:

```powershell
cd D:\pregnancy-calorie-ai\delivery
vercel --prod --yes
```

## 9. Rollback

If production breaks after deployment:

1. Open the Vercel deployments page.
2. Promote or roll back to the last known good deployment.
3. Record the failed deployment reason in `PROGRESS.md`.
4. Fix locally and redeploy only after verification.

## 10. Recommended Codex Automation Prompt

```text
Run the AI Pregnancy Calorie Calculator autonomous operations check.
Use D:\pregnancy-calorie-ai\delivery\OPERATIONS.md and D:\pregnancy-calorie-ai\delivery\CODEX_AUTOMATION.md.
Run node scripts\ops-weekly-check.mjs from D:\pregnancy-calorie-ai.
If all checks pass, summarize the report and do not change code.
If a check fails, classify P0/P1/P2/P3, identify the smallest safe fix, patch only the affected code, verify locally, update TASKS.md and PROGRESS.md, and report whether preview/production deployment is recommended.
Do not deploy production unless explicitly instructed.
```

