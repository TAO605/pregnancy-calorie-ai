# Total Promotion Task Issue Log

This file consolidates issues from the first four preparation batches and the final launch planning batch.

## Batch 1: Keyword Research

### Chrome CDP was not connected

- Impact: Could not access the logged-in Semrush mirror at first.
- Fix: User enabled Chrome remote debugging at `chrome://inspect/#remote-debugging`.
- Lesson: Do not generate SEO data before the real tool is accessible.

### Semrush mirror required login

- Impact: Keyword data could not be collected until the user logged in.
- Fix: Stopped and waited for user login. No credentials were requested or stored.
- Lesson: Any account/login blocker requires user intervention.

### Most keyword rows had KD unavailable

- Impact: 833 raw rows produced only 9 valid KD≤30 keywords after strict filtering.
- Fix: KD-unavailable rows were marked as `数据不可得`, not treated as low difficulty.
- Lesson: Do not estimate KD.

## Batch 2: Competitor Analysis

### Google local Chrome timed out

- Impact: Could not fully rely on local Chrome for Google SERP extraction.
- Fix: Used available web search plus competitor page checks and Semrush domain overview.
- Lesson: Record the limitation and continue only with verifiable data.

### DR was unavailable

- Impact: Current tool provided Semrush Authority Score, not Ahrefs DR.
- Fix: DR was marked as `数据不可得`.
- Lesson: Do not rename Authority Score as DR.

### Some competitor pages blocked local fetches

- Impact: MiniWebTool, CalculatorCorp, and Milkology had partial access issues in local fetch.
- Fix: Used available public search/page data and avoided overclaiming page details.
- Lesson: If a page cannot be verified, say so.

## Batch 3: Backlink List

### DR verification quota was limited

- Impact: dachecker free mode allowed only 9 domain checks without login.
- Fix: Verified 9 DR≥80 platforms and marked the rest as `数据不可得`.
- Lesson: A 50+ candidate list is acceptable only if verified and unverified groups are clearly separated.

### Content platforms could cross the blog-content boundary

- Impact: Medium, WordPress, Blogger, Dev.to, and Hashnode are article platforms.
- Fix: Recommended profile/about links only. No blog titles, outlines, meta descriptions, or article snippets were generated.
- Lesson: Profile links are allowed; article content generation is not.

## Batch 4: Community Templates

### Natural voice vs. disclosure requirement

- Impact: Replies should sound like a real user but must disclose connection to the tool.
- Fix: Every template includes a disclosure line.
- Lesson: Transparent affiliation is safer than stealth promotion.

### Pregnancy nutrition is YMYL-sensitive

- Impact: Replies could be interpreted as medical advice.
- Fix: Templates are limited to general nutrition guidance and refer special cases to professionals.
- Lesson: Never diagnose, treat, or replace clinical advice.

## Batch 5: Launch Plan and Tracking

### GA/GSC UI may change

- Impact: Exact menu names can shift over time.
- Fix: Guide uses stable concepts and notes that current dashboard labels should be followed.
- Lesson: Tracking guides should focus on business metrics and common paths, not brittle UI wording.

## Current Open Limitations

- Full 50+ DR verification remains incomplete until login/paid access to Ahrefs, dachecker, or equivalent tool is available.
- Keyword database has limited numeric KD coverage.
- Community posting still requires manual account creation and rule checks before each post.
