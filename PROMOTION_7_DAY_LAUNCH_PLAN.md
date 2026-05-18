# 7-Day Quick Launch Execution Plan

Project: AI Pregnancy Calorie Calculator  
Website: https://aipregnancycaloriecalculator.online  
Prepared on: 2026-05-14  
Last reviewed: 2026-05-15

## Source Assets Used

- Keyword research: `seo-keyword-research-batch1.md`
- Competitor analysis: `COMPETITOR_ANALYSIS_REPORT.md`
- Differentiation strategy: `DIFFERENTIATION_STRATEGY.md`
- Backlink list: `BACKLINK_DR80_BUILDING_LIST.md`
- Backlink progress table: `BACKLINK_BUILDING_PROGRESS_TABLE.md`
- Community templates: `COMMUNITY_REPLY_TEMPLATES.md`
- Community rules: `COMMUNITY_PROMOTION_RULES.md`

## Core Findings

- Keyword data is limited: only 9 keywords had real numeric KD≤30. KD-unavailable keywords must remain a validation pool, not a low-competition claim.
- Strong competitors rely on free calculator pages and SEO. Most are weak on personalization, product conversion, meal plans, tracking, and subscription framing.
- Verified DR≥80 platforms are available for immediate brand entity links: Facebook, Instagram, LinkedIn, X/Twitter, YouTube, Pinterest, Medium, Reddit, and GitHub.
- Community promotion must be help-first, low-frequency, and transparent about the tool relationship.

## Prerequisites Before Starting

Before Day 1, complete or verify:

- [ ] Verify `https://aipregnancycaloriecalculator.online` loads with a valid SSL certificate (no browser warnings).
- [ ] Verify `http://www.aipregnancycaloriecalculator.online` 301-redirects to `https://aipregnancycaloriecalculator.online`.
- [ ] Verify `https://aipregnancycaloriecalculator.online/robots.txt` is accessible and does not block important pages.
- [ ] Verify `https://aipregnancycaloriecalculator.online/sitemap.xml` returns 200 with all core URLs.
- [ ] Run PageSpeed Insights (mobile) and record baseline Core Web Vitals (LCP, INP, CLS).
- [ ] Run Google Mobile-Friendly Test on the homepage.
- [ ] Run Google Rich Results Test on the homepage to validate structured data.
- [ ] Verify all 7 core public pages return HTTP 200: homepage, pricing, privacy policy, terms, medical disclaimer, about, contact.
- [ ] Create or designate a dedicated brand email address for platform registrations (not a personal email).
- [ ] Set up Google Alerts for "AI Pregnancy Calorie Calculator" to monitor brand mentions.

## Day 0.5: GA4 Installation and GSC Completion

> ⚠️ If GA4 is already installed and GSC is already verified, skip to Day 1.

Tasks:

- If GA4 is not yet installed: add the GA4 measurement tag to `delivery/index.html` and all standalone legal pages. Use Google's gtag.js snippet inside `<head>`.
- Confirm the GSC verification meta tag is present on the production homepage. If using DNS TXT verification instead, confirm the TXT record is resolvable.
- Complete GSC property verification for `https://aipregnancycaloriecalculator.online`.
- If GSC verification was done via meta tag, leave it in place. If via DNS TXT or HTML file, do not remove the verification artifact.

Acceptance criteria:

- GA4 measurement ID is embedded in the production homepage source.
- GSC property shows "Verified" status for `https://aipregnancycaloriecalculator.online`.

## Day 1: Tracking Baseline and Search Console Setup

Tasks:

- Confirm Google Analytics 4 real-time report shows at least one visit from your browser.
- Submit sitemap in GSC: `https://aipregnancycaloriecalculator.online/sitemap.xml`.
- Use URL Inspection for these 7 URLs: homepage, pricing, privacy policy, terms, medical disclaimer, about, contact.
- Request indexing for any URL that shows "URL is not on Google."
- Record baseline metrics in a tracking sheet: indexed pages (count), total clicks (0 for new site), impressions (0 for new site), active users (0), pricing page views (0), PageSpeed mobile score, Mobile-Friendly Test result, Rich Results Test result.
- If any URL inspection returns a crawl error, log it in the issue tracker immediately.

Acceptance criteria:

- GA4 real-time report shows at least one visit from your browser.
- GSC sitemap status is "Submitted" (not necessarily "Success" — processing can take days).
- All 7 core URLs have been inspected or queued for indexing.
- Baseline tracking sheet created with all metrics recorded (zeros are acceptable for a new site).
- No critical crawl errors in URL Inspection results.

## Day 2: P0 Brand Entity Links (Batch 1)

> ⚠️ Do not create all 9 accounts in one sitting. Spread across 2 sessions (morning/afternoon) to avoid triggering platform spam detection.

Tasks:

- Create or complete profiles on: Facebook (brand Page), Instagram (Professional account), LinkedIn (Company Page), YouTube (Channel), X/Twitter (profile), Pinterest (Business account).
- Add the canonical website URL to each profile's website/about field.
- Use consistent brand name: `AI Pregnancy Calorie Calculator`.
- Use consistent description: `AI-powered pregnancy calorie calculator with personalized nutrition guidance, meal planning, and progress tracking.`
- For Facebook Page: add cover photo, profile picture, and at least one introductory post before adding the website link.
- For YouTube Channel: complete the About section with description and website link (no videos required at this stage).
- Update `BACKLINK_BUILDING_PROGRESS_TABLE.md` with status and completion date.
- Save all login credentials securely.

Acceptance criteria:

- At least 6 verified DR≥80 profile links are live.
- No platform profile makes medical promises or treatment claims.
- Progress table updated with dates for completed platforms.
- A dedicated brand email was used for all registrations.

## Day 2.5: P0 Brand Entity Links (Batch 2)

Tasks:

- Create or complete profiles on: Medium (profile with bio link), GitHub (profile with website field), Reddit (register account, do NOT add website link yet — see Day 4).
- For GitHub: create a public repository with a README that includes the project name, a 2-3 sentence factual description, and the website link. Optionally upload `delivery/index.html` or a minimal standalone calculator demo.
- For Medium: complete the profile bio with the brand description and website link. Do not publish any articles at this stage.
- For Reddit: register the account, set a profile description that mentions the tool domain factually, but **do not add the website link to the profile yet**. Instead, spend 15 minutes reading r/pregnancy, r/BabyBumps, r/fitpregnancy rules and top posts to understand community norms.
- Update `BACKLINK_BUILDING_PROGRESS_TABLE.md`.

Acceptance criteria:

- All 9 verified DR≥80 platforms have profiles created or completed.
- GitHub repository is public with a README containing the website link.
- Reddit account is registered but has no website link (reserved for Day 4+ community activity).
- Progress table fully updated.

## Day 3: Product and Developer Entity Links

> ⚠️ Before registering on developer platforms, prepare a minimal public code artifact to upload (e.g., a standalone version of the pregnancy calorie formula in a single HTML/JS file, or the core calculation logic as a clean JS module).

Tasks:

- Create or complete profiles on: GitLab (profile + public repo README with website link), CodePen (profile website field + optionally a lightweight calculator demo pen), Dev.to (profile website field only, no articles).
- Create or complete profiles on product platforms: Product Hunt (founder profile, do not launch yet), Indie Hackers (founder profile with factual product description), Crunchbase (organization profile with only verifiable information), Wellfound (startup profile, no fabricated metrics), AlternativeTo (software listing submission).
- For developer platforms: upload the prepared code artifact. README should link to the official website.
- For product platforms: use only factual product information (name, URL, short description, pricing tiers if listed). Do not invent funding rounds, team size, user counts, or medical credentials.
- For Crunchbase specifically: mark the organization as a personal/independent project if applicable. Leave revenue, funding, and employee count blank.

Acceptance criteria:

- At least 5 product/developer profile links are live or submitted for review.
- All links point to the canonical domain or pricing page.
- No unsupported claims (funding, team size, user count, medical credentials) are present on any platform.
- Every developer platform profile has an actual code artifact, not just a link.

## Day 4: Community Warm-Up (Phase 1 — No Links)

Tasks:

- Complete profiles on Quora (credential + bio, no website link yet), Reddit (already registered on Day 2.5 — now begin activity), BabyCenter, and What to Expect.
- Read the rules for each relevant community/subreddit before posting:
  - Reddit: r/pregnancy, r/BabyBumps, r/fitpregnancy rules in sidebar
  - Quora: content policy on external links
  - BabyCenter: community guidelines
  - What to Expect: community guidelines
- Make 3-5 helpful replies across communities **without any links**. Focus on:
  - Sharing practical food/meal ideas for pregnancy
  - Reassuring users about normal appetite changes
  - Suggesting they discuss weight concerns with their provider
  - Answering general pregnancy nutrition questions
- Save promising thread URLs where a calculator link would be genuinely relevant later.
- Do NOT mention the tool, the website, or any product at this stage.

Acceptance criteria:

- Profiles completed on at least 3 communities.
- At least 3 helpful no-link replies posted across communities.
- A list of 5-10 saved thread URLs that are genuine candidates for future tool mentions.
- No account warning, removal, or moderation issue.
- Reddit account has at least 2 organic comments (no links).

## Day 5: Community Warm-Up (Phase 2 — Still No Links)

> ⚠️ The original Day 5 (first linked replies) has been rescheduled to Day 8-10. Community accounts need more activity history before linking. Rushing links on accounts with only 1 day of activity is the #1 cause of bans and removals.

Tasks:

- Continue posting 3-5 helpful no-link replies across communities.
- Engage with replies to your earlier comments (build conversation).
- Add the website link to your Quora profile credential/bio (profile-only, not in answers yet).
- Expand the saved thread list to 10-15 candidates.
- Review which communities/topics got engagement — note patterns for Day 8+ linked replies.
- Begin reading and upvoting other users' helpful content to build community presence.

Acceptance criteria:

- At least 6 total helpful no-link replies posted across communities (cumulative, including Day 4).
- At least 1 reply thread has engagement (upvotes, replies, or thanks).
- 10-15 saved thread URLs for future linked replies.
- No account issues across any community.
- Engagement patterns documented (which communities are most active, which topics resonate).

## Day 5.5: First Low-Pressure Community Mentions (Delayed from original Day 5)

> ⚠️ Execute this step no earlier than 3 calendar days after Day 4's first community post. If accounts are too new, wait longer.

Tasks:

- Use `COMMUNITY_REPLY_TEMPLATES.md` to write customized replies (not copy-paste).
- Only reply to threads directly asking about pregnancy calories, pregnancy nutrition, weight gain, or calculator tools.
- Include the disclosure line from `COMMUNITY_PROMOTION_RULES.md` in every linked reply.
- Use a maximum of 1 linked reply per community per day.
- Prioritize threads from your saved list that are the best fit.

Acceptance criteria:

- 2-4 customized community replies posted with links.
- Every linked reply includes disclosure.
- No copy-paste duplicates — each reply is customized to the original post.
- No medical diagnosis or treatment language.

## Day 6: Technical Health Check

> ⚠️ Original plan called for GSC Performance review, but a brand-new domain will have minimal GSC data by Day 6. Re-scoped to technical health verification instead. GSC data review moves to Week 3-4.

Tasks:

- Verify robots.txt is still accessible and not blocking important pages.
- Verify sitemap.xml returns 200 with all core URLs.
- Inspect any GSC URL Inspection results that returned errors or warnings on Day 1.
- Check GSC Coverage report for any "Excluded" or "Error" pages.
- Verify internal linking chain: homepage → pricing, homepage → medical disclaimer, homepage → about/contact, footer legal links (6 pages), premium page entry points.
- Check all external links in footer: Medical Disclaimer, Privacy Policy, Terms of Service, Cookie Policy, About Us, Contact Us.
- Run a quick PageSpeed Insights re-check if GA4 code was added since baseline.
- Verify the 404 page behavior: visit `https://aipregnancycaloriecalculator.online/nonexistent-page` and confirm it returns a proper 404 (not a blank page or 500).
- Verify structured data on homepage using Google Rich Results Test.

Acceptance criteria:

- No critical crawl errors in GSC Coverage or URL Inspection.
- All internal links resolve correctly (no 404s within the site).
- All external legal page links resolve correctly (no broken outbound links).
- 404 page returns proper HTTP 404 status with user-friendly content.
- Structured data passes Rich Results Test with no errors.
- Any new issues found are added to the issue log.

## Day 7: Weekly Review and Next Sprint Planning

Tasks:

- Review `BACKLINK_BUILDING_PROGRESS_TABLE.md`: count completed, in-progress, and not-started platforms.
- Review community replies: note which topics got engagement (upvotes, replies, views), which communities were most responsive, and which templates worked best.
- Check GSC Performance for any early impressions — note: data may be sparse or zero at this stage (normal for a new site).
- Check GA4 for any organic traffic signals (likely minimal — record whatever exists).
- Decide the next 3 non-blog tool pages or product pages to build, based only on real keyword/query data. If no keyword data is available yet, defer this decision and instead focus on:
  - Improving existing pages (page speed, structured data, content depth)
  - Expanding the backlink progress table to the next priority tier
  - Planning Week 2-4 community engagement schedule
- Update `PROMOTION_PERMANENT_KNOWLEDGE_BASE.md` with new lessons learned:
  - Which platforms were easiest/hardest to set up
  - Which community approaches got the best response
  - Any technical issues encountered and how they were resolved
  - Any moderation warnings and how to avoid them going forward

Acceptance criteria:

- 7-day summary written (can be brief bullet points in PROGRESS.md or a standalone note).
- At least 10 external profile/community link opportunities completed or submitted (cumulative across all days).
- Next sprint has 3 specific tasks, each with a clear owner, deadline, and validation criteria.
- `PROMOTION_PERMANENT_KNOWLEDGE_BASE.md` updated with at least 3 new lessons.
- Issue log updated with any unresolved problems from Days 1-7.

## Daily Safety Checklist (Apply Every Day)

- No hidden affiliation — disclose connection to the tool when sharing it.
- No medical advice or diagnosis — the calculator is nutrition guidance only.
- No copied community replies — every reply must be unique and contextual.
- No fabricated metrics — do not invent traffic numbers, user counts, or revenue.
- No blog article titles, outlines, meta descriptions, or content snippets.
- All public claims must be factual and supportable.
- All platform registrations use the dedicated brand email, not personal accounts.
- If a task cannot be completed on its scheduled day, move it to the next day rather than skipping it. Do not mark blocked tasks as "completed" to stay on schedule.

## Contingency Notes

- If GSC verification fails on Day 0.5/1: try alternative verification method (DNS TXT if meta tag failed, or vice versa). Do not proceed to Day 2 without verified GSC.
- If a platform registration triggers a phone verification or ID check: complete it if possible, otherwise skip that platform and note it in the issue log.
- If a community account receives a warning or removal: stop all activity on that community immediately, document the incident, and do not attempt to re-register.
- If Day 6 technical check finds broken links or crawl errors: fix them before the weekly review on Day 7.
- If no GSC data is available by Day 7: this is normal. Record "insufficient data" rather than making assumptions.
