# Pregnancy Calorie AI Product Requirements Document

## 1. Product Summary

`Pregnancy Calorie AI` is being rebuilt as a focused AI tool site for pregnant users who want a fast calorie estimate and a clear, safe explanation layer.

The new primary MVP starts with a Chinese single-page experience on `/`: users enter age, height, weight, pregnancy week/stage, and activity level, then receive a daily calorie range, pregnancy extra-calorie estimate, protein/water references, and AI-style interpretation.

The product starts as an SEO-friendly pregnancy calorie calculator and extends into:

- a guarded AI nutrition assistant
- a saved profile and preference layer
- a weight trend tracker
- a meal logging workflow
- an admin system for guideline packs, content, and analytics

This document now treats the previous multilingual dashboard/admin product as legacy infrastructure. The rebuild direction is to validate the root calculator experience first, then decide which legacy modules to retain, simplify, or remove.

## 2. Problem

Pregnant users searching for calorie guidance usually encounter one of two bad options:

- static articles that are generic, hard to personalize, and weak on actionability
- calculators that return a number without explaining the source, confidence, or next step

The trust gap becomes larger when users want follow-up help:

- how to split calories into meals
- whether weight changes still look normal
- how diet preferences affect the plan
- what should trigger a clinician conversation

The product needs to convert one-off search traffic into repeat usage by turning a calorie estimate into a structured, explainable, and trackable experience.

## 3. Product Vision

Build a trustworthy AI nutrition tool site for pregnancy that moves users through this loop:

`search -> calculate -> understand -> ask -> save -> track -> return`

## 4. Goals

### Primary Goals

- Capture high-intent organic traffic around pregnancy calorie estimation.
- Deliver a result that feels more trustworthy than a generic calculator.
- Turn the result into follow-up product usage through AI, saved profile, and tracking.
- Build a lightweight retention layer without requiring a heavy medical-grade product.

### Secondary Goals

- Support multilingual growth across English, Simplified Chinese, and Spanish.
- Let operators adjust rule packs and content without redeploying code.
- Create enough behavioral telemetry to understand conversion from calculator to retention.

## 5. Non-Goals

- Medical diagnosis
- clinical risk scoring
- replacement for prenatal care
- full macro/micro nutrient tracking
- wearable integrations in MVP
- insurance, billing, or provider workflows

## 6. Target Users

### Primary User

Pregnant users who:

- search for calorie intake guidance
- want trimester-aware guidance
- prefer a quick answer before committing to a larger app
- need practical follow-up around meals, appetite, and weight trend

### Secondary User

Partners, caregivers, or family members helping plan meals or understand calorie guidance.

### Internal User

Operator/admin who:

- updates guideline packs
- publishes content pages
- reviews analytics and user activity

## 7. Core Jobs To Be Done

### User Jobs

- "Help me estimate how many calories I should eat during pregnancy."
- "Explain why that number makes sense."
- "Show me how to turn this into meals and snacks."
- "Help me understand whether my weight trend means I should revisit the plan."
- "Let me come back later without re-entering everything."

### Operator Jobs

- "Change guideline logic without a code deployment."
- "Publish SEO-supporting content."
- "See whether users move from calculator to AI to tracking."

## 8. Product Principles

- Trust over magic: show source packs, guidance framing, and clear safety boundaries.
- Low-friction first use: calculator must work before sign-in.
- Context compounding: every saved action should make the next session better.
- Lightweight retention: tracking should feel useful before it feels burdensome.
- AI as explainer, not authority: assistant extends context but does not diagnose.

## 9. User Journey

### Journey A: First-Time Visitor

1. User lands from search on a localized marketing page or calculator page.
2. User enters pregnancy and body data.
3. User receives a calorie target, range, trimester context, and rule-pack source.
4. User clicks into AI for follow-up questions.
5. User is encouraged to save a profile to continue later.

### Journey B: Returning User

1. User signs in and sees dashboard overview.
2. Saved profile preloads into future calculations.
3. User logs meals or weight.
4. User jumps from dashboard context into AI with a prefilled question.
5. User returns because the product now stores useful personal context.

### Journey C: Operator

1. Admin signs in to protected admin.
2. Admin reviews analytics and user activity.
3. Admin edits guideline packs or content pages.
4. Changes persist locally and affect product behavior immediately.

## 10. Current MVP Scope

### 10.1 Marketing and SEO

- localized homepage
- localized calculator, AI, blog index, content detail, and medical disclaimer pages
- content-driven blog pages from local data store
- sitemap and robots metadata routes
- metadata per page
- mobile marketing navigation
- locale switcher across marketing pages

### 10.2 Calculator

- pregnancy calorie calculation API
- trimester-aware recommendation
- region/rule-pack support
- metric and imperial input support
- result page with explainable framing
- result-to-AI CTA
- saved calculator sessions

### 10.3 AI Assistant

- guarded AI nutrition chat endpoint
- context-aware prompt assembly
- prefilled prompts from result page and trackers
- saved assistant history
- context blocks for latest calculation, meals, and weight summary
- current-session thread continuity with refresh-safe restore
- source and prompt-origin tracking across AI sessions
- session resume flow from saved history

### 10.4 User Account and Dashboard

- sign-in flow
- source-aware sign-in routing from marketing, result, AI, and dashboard gate entry points
- protected dashboard routes
- auth-aware retention cards on AI and result pages that switch from save prompts to dashboard continuation prompts after sign-in
- saved profile and preference editing
- dashboard overview with calorie plan snapshot
- locale switcher inside dashboard shell

### 10.5 Weight Tracking

- weight entry logging
- automatic profile weight sync
- trend summary generation
- AI CTA from weight page
- weight summary included in assistant context

### 10.6 Meal Tracking

- meal logging
- calorie-aware meal summaries
- preference-aware meal idea cards
- AI CTA from meals context

### 10.7 Admin

- admin sign-in
- analytics overview
- retention CTA analytics across guest save prompts and logged-in continuation prompts
- user activity overview
- guideline pack editing
- content page editing

### 10.8 Data and Persistence

- local JSON persistence for admin-level stores
- local JSON persistence for demo signed-in user data
- localStorage/client persistence for anonymous and fallback prototype flows
- optional Firebase sign-in path
- automatic first-read seeding of existing local user data into Firebase-backed accounts when remote state is still empty

## 11. Functional Requirements

### FR-1: Calculator Experience

- User must be able to complete a calorie estimate without signing in.
- Input must support age, height, pre-pregnancy weight, current weight, gestational week, activity level, pregnancy type, unit system, and guideline region.
- Output must include recommended calories and supporting explanation context.

### FR-2: Explainable Result

- Result must show the recommendation in plain language.
- Result must show guideline source or rule-pack framing.
- Result must provide next-step actions.
- Result must provide a CTA into AI follow-up.

### FR-3: AI Follow-Up

- AI must accept free-text questions.
- AI must inherit known context when available.
- AI must escalate or warn when content crosses safety boundaries.
- AI must not position itself as a medical decision-maker.

### FR-4: Saved Context

- Signed-in users must be able to save profile data.
- Calculator should preload saved values when a real saved profile exists.
- User preferences should influence downstream suggestions.
- First-time Firebase sign-in should preserve already accumulated local prototype data instead of dropping it.

### FR-5: Weight Tracking

- Users must be able to log weight entries by date.
- Product must generate a recent trend summary, baseline delta, and last logged movement.
- Weight context should be reusable by the AI assistant.

### FR-6: Meal Tracking

- Users must be able to log meals with simple calorie estimates.
- Product must compare recent intake against the latest recommended calorie target.
- Meal context should be reusable by the AI assistant.

### FR-7: Admin Controls

- Admin must be able to update content pages.
- Admin must be able to update guideline packs.
- Admin must be able to view key usage metrics and user funnel states.

### FR-8: Multilingual UX

- Product must support `en`, `zh-CN`, and `es`.
- Shared navigation must allow switching locale across main product surfaces.
- Locale switching should preserve path when the destination route exists.

## 12. Content Requirements

- Each locale should have a homepage, calculator page, AI page, blog index, and disclaimer page.
- Content pages should support `draft` and `published`.
- Content must support SEO-oriented education topics:
  - trimester calories
  - pregnancy weight trends
  - meal timing
  - fiber and hydration

## 13. Safety and Compliance Requirements

- Every AI and calculator flow must maintain a clear nutrition-not-diagnosis boundary.
- Medical disclaimer must remain reachable from key entry points.
- High-risk symptoms should be framed as clinician escalation triggers.
- Product language should avoid claiming clinical accuracy beyond the chosen guidance packs.

## 14. Analytics Requirements

Track at minimum:

- `calculator_completed`
- `result_ai_clicked`
- `weight_ai_clicked`
- `ai_chat_started`
- `ai_session_resumed`
- `dashboard_viewed`
- `meal_log_created`
- `weight_log_created`
- `signup_completed`

Admin should be able to infer:

- calculator to AI conversion
- sign-in conversion by source
- saved-profile adoption
- tracking adoption
- locale mix
- active tracking user share

## 15. Success Metrics

### Acquisition

- organic landing-to-calculator CTR
- calculator completion rate

### Activation

- result-to-AI click rate
- sign-in conversion after calculator or AI use

### Retention

- 7-day return rate
- share of users with saved profile
- share of users with at least one meal or weight log
- AI reuse rate after first saved context

### Operations

- time to publish content
- time to edit rule packs
- admin visibility into recent events and active users

## 16. MVP Risks

- Users may still view calorie guidance as medical advice despite disclaimers.
- Multilingual quality can degrade if copy pipelines are not kept clean.
- Local prototype persistence is good for MVP iteration but not durable enough for production.
- Blog content is locale-specific and not all slugs map one-to-one across languages.

## 17. Open Questions

- Should personalized calorie adjustments eventually consider weight-trend heuristics directly?
- Should AI sessions persist server-side for signed-in users?
- Should admin support content scheduling and preview states beyond draft/published?
- Should the content layer evolve into topic clusters with stronger internal linking rules?
- When should the prototype move from local stores to a production database?

## 18. Recommended Next Roadmap

### Phase 1: Tighten the Current MVP

- add richer locale-aware content coverage
- instrument weekly review entry points and saved-context conversion more clearly
- improve admin analytics around which tool entry points lead to AI usage
- add more AI prompt templates tied to real user context

### Phase 2: Strengthen Retention

- recurring weekly check-in prompts
- saved goals and milestone views
- deeper meal planning templates
- richer trend interpretation across weight + intake + gestational week

### Phase 3: Production Readiness

- move persistence to a durable backend
- strengthen auth and user profiles
- add auditability around guideline edits
- formalize analytics dashboards and event quality checks

## 19. Shipping Definition

This product is ready for MVP iteration when:

- calculator, AI, and dashboard flows work in all supported locales
- sign-in and saved context flows work end-to-end
- admin can change content and guideline packs without code edits
- analytics capture the core acquisition, activation, and retention events
- the product clearly communicates its non-diagnostic boundary

### Current Implementation Status

The current codebase meets the MVP iteration definition for local demo and internal review:

- multilingual marketing, calculator, result, AI assistant, dashboard, meal tracker, weight tracker, and admin routes are implemented
- demo signed-in persistence and optional Firebase sign-in paths are wired
- calculator, AI, sign-in, dashboard save forms, and admin content flows degrade gracefully when non-critical analytics or activity tracking fails
- API validation returns explicit client errors for malformed JSON and invalid payloads
- `npm run verify` is the required verification gate after each change; it runs lint and production build

Production launch remains a separate milestone and requires durable persistence, live Firebase/Auth rules validation, rate limiting, privacy review, and final medical/legal copy review.

### Model Tier Guidance

Use `GPT-5.5` medium reasoning for normal feature work, UI polish, API hardening, and documentation updates. Move to high or higher reasoning when work includes live Firebase integration, security/privacy review, final launch readiness review, or broad architecture changes.
