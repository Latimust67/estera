# Estera SEO launch checklist

Recorded **2026-10-20** for `https://estera-virid.vercel.app`. Scope: homepage, download, two guides, compatibility, and privacy. Based on the SEO Implementation Package checklist, Guides 2–15.

**Pass** means the evidence stated in that row is established; local source checks and live checks are distinguished. **Partial** means the evidence covers only part of a compound item. **In progress** means authorized setup is currently running. **Needs work** includes missing access and external evidence. **Needs owner input** identifies a specific unresolved account choice. **Submitted** means a service acknowledged receipt, not that a URL was indexed. **Pending** is reserved for a documented outstanding search-processing state. **Not applicable** means the feature or business model is absent. None of these statuses guarantees a ranking outcome.

Owner for source changes: **site maintainer**. Owner for accounts, publishing, provider settings, and post-launch evidence: **project owner**. Vercel project/account access is confirmed; Google and Bing ownership are verified; the approved Analytics property and production connection are created. See [account-setup.md](account-setup.md). Dates below are this review date unless a future checkpoint is specified.

The original production build and six-page saved-HTML audit passed; the report is [generated-audit.json](generated-audit.json). Independent source review found no material defects. The SEO baseline was published on **2026-10-20**: commit `fbcf205`, Vercel deployment `dpl_ANKUnuu4HmUDazmzhNnVza6SBMYD`, state `READY`, canonical origin `https://estera-virid.vercel.app`. IndexNow acknowledged all six URLs with HTTP 202, then the three changed URLs with HTTP 200. Optional field measurement is published in commit `b395838`; its production measurement ID is now configured, and it remains off until each visitor opts in. Browser, HTTP, representative Google structured-data and performance acceptance are complete; focused consented measurement acceptance is recorded separately in [analytics-acceptance.md](analytics-acceptance.md); see [live-acceptance.md](live-acceptance.md). The research-driven follow-up is published in commit `6811808`; its build/static audit passed with zero warnings, and the affected live content/canonical checks passed. See [followup-deployment.json](evidence/followup-deployment.json).

## A. Access and ownership

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Hosting project/account access and domain boundaries are established. | Pass | Access is confirmed for Vercel project `prj_O0XlfcbrEVZQzLyalfgridXlsrhS` in account `team_ZSY86zD3roAXul5Ntse5tepH`. Production uses the project's Vercel subdomain; there is no CMS or owner-controlled custom-domain registration in this implementation. Future custom-domain ownership would require separate evidence. |
| Search Console and Bing Webmaster Tools verified. | Pass | Both URL-prefix/site properties were verified with public HTML tags in the production environment. Keep both tokens. Google sitemap is Success with 6 pages; Bing sitemap submission encountered a server error. See [account-setup.md](account-setup.md). |
| GA4 property owned by the project; maintainer has Editor access. | Pass | The owner approved and created the Estera account and Estera website property and administered its saved settings. The production stream and ID are configured. All four optional account-sharing settings are off. See [account-setup.md](account-setup.md). |
| Eligible Business Profile owned by the business. | Not applicable | Estera is downloadable software; no eligible local storefront or in-person service business is established. |

## B. Crawling and indexing

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Preview access protection is configured and protected aliases challenge requests. | Pass | Vercel `ssoProtection` is enabled as `all_except_custom_domains`. The secondary alias returned HTTP 302 to Vercel SSO and `noindex` for `/` and `/download`. This is actual protection evidence, separate from [`vite.config.ts`](../../vite.config.ts) preview `noindex`. See [account-setup.md](account-setup.md) for account context. |
| Production robots.txt permits important content, includes Sitemap, and has no crawl-delay. | Pass | Local generation in [`prerender.mjs`](../../scripts/prerender.mjs) uses `User-agent: *`, `Allow: /`, and the canonical sitemap URL for production. WordPress/WooCommerce exclusions from the kit are irrelevant here. Production robots.txt returned 200 with the expected rules; see [live-acceptance.md](live-acceptance.md). |
| No leftover noindex meta or X-Robots-Tag on public pages. | Pass | All six live responses are indexable with no X-Robots-Tag. The real 404 is noindexed; protected aliases are also noindexed. See [live-acceptance.md](live-acceptance.md). |
| Important pages return HTTPS 200 on one host and one slash convention. | Pass | All six canonical HTTPS routes return 200 with exact self canonicals. HTTP, .html and non-root slash variants each redirect once with 308. See [live-acceptance.md](live-acceptance.md). |
| HTTP, non-preferred host, and URL variants redirect in one permanent hop. | Pass | HTTP, .html and slash variants each return one 308 to the preferred route. The secondary host is protected by Vercel SSO and noindexed, rather than publicly duplicated. See [live-acceptance.md](live-acceptance.md). |
| Absolute, self-referencing canonicals match sitemap and internal links. | Pass | [`site.ts`](../../src/site.ts), [`entry-server.tsx`](../../src/entry-server.tsx), and [`prerender.mjs`](../../scripts/prerender.mjs) share the production origin and route list. Canonicals use `/` for home and no trailing slash elsewhere. The baseline is published; live canonical acceptance passed; see [live-acceptance.md](live-acceptance.md). |
| Sitemap contains only preferred indexable 200 URLs, has real lastmod, and is submitted. | Partial | All six canonical URLs return 200/indexable and use the real content date. Google received and read the sitemap: Success, 6 discovered pages. Bing verified ownership but returned a server error on submission; a bounded follow-up is scheduled. See [account-setup.md](account-setup.md). |
| Main content is available in raw/server-rendered HTML. | Pass | The build runs React server rendering into `index.html`, `download.html`, guide HTML files, `compatibility.html`, and `privacy.html`; [`main.tsx`](../../src/main.tsx) hydrates existing content. Primary copy and links are rendered without relying on interaction. Saved-output and live URL Inspection evidence remain separate. |
| Missing/removed pages return 404 or 410 rather than a soft 404. | Pass | The deliberately missing test URL returns an actual 404 with recovery content and noindex. No existing page was removed. See [live-acceptance.md](live-acceptance.md). |
| Redirect map completed and each migration row externally tested. | Not applicable | Existing homepage URL is retained; the five additional pages are new. No deleted or migrated URL list was supplied, so no speculative migration redirects were created. [redirect-map.csv](redirect-map.csv) records the configured `.html` and slash variants; their live acceptance passed; see [live-acceptance.md](live-acceptance.md). Revisit if a domain/path migration is planned. |

## C. Page basics

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Distinct titles, descriptions, and one clear main heading. | Pass | Homepage metadata lives in [`site.ts`](../../src/site.ts); the five page-specific records live in [`content.tsx`](../../src/content.tsx). [`App.tsx`](../../src/App.tsx) and [`GuidePage.tsx`](../../src/GuidePage.tsx) provide main headings. The build audit records generated output separately. |
| Crawlable descriptive internal links; no important page orphaned. | Pass | Homepage directory/footer, guide navigation, contextual links, and related-page links use ordinary `<a href>` elements. All six public pages are connected. Source evidence: [`App.tsx`](../../src/App.tsx), [`JourneyEnd.tsx`](../../src/components/JourneyEnd.tsx), [`GuidePage.tsx`](../../src/GuidePage.tsx), and [`content.tsx`](../../src/content.tsx). |
| Contact, service area, prices, credentials, and policies are accurate and visible. | Pass | Download copy states $0, GPL licensing, requirements, USB-only control, signing limitations, and unverified physical set/reset. Privacy explains website/app differences and external requests; GitHub is the evidenced project/support channel. No invented staff, credentials, address, phone, customer claims, or service area. Source: repository README and release documentation linked from the pages. |
| Forms deliver valid/invalid submissions and survive thank-you refresh. | Not applicable | No inquiry, checkout, signup, or lead form exists. A GitHub archive link is the primary action. |
| Visible truthful update dates and accountable source where expertise matters. | Pass | Guide pages and the homepage directory show October 20, 2026 and link to the Estera project. Guides link release documentation; compatibility distinguishes this page update from dated hardware evidence. No author persona or reviewer credentials were invented. Update dates only for material content changes. |

## D. Mobile and performance

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Viewport, readable mobile text, usable targets, and no blocking interstitial. | Pass | All six routes fit 1440px desktop and 390px mobile. Navigation and keyboard dialog checks pass; home/download captures were visually inspected. This is focused acceptance, not a full accessibility certification. See [live-acceptance.md](live-acceptance.md). |
| Hero LCP image is eager, dimensioned, and appropriately sized. | Not applicable | The hero uses text and a canvas globe, not a hero `<img>`. LCP timing was measured separately in the dated PageSpeed reports; an image-specific loading rule does not apply. |
| PageSpeed Insights baseline for home and two priority pages. | Pass | Official mobile performance: home 97, download 100, setup guide 100. Desktop 100 for all three. Accessibility/best practices/basic SEO 100 on each. No CrUX field dataset. See dated [performance-and-schema.md](performance-and-schema.md). |
| If field data is absent, web-vitals events arrive in GA4. | Partial | The configured consent-gated integration sent a real acceptance-browser LCP measurement with HTTP 204 collector receipt. CLS/INP were not observed, and GA Realtime still showed no event data. These are not real-visitor field percentiles or a verified all-metric reporting dataset. See [analytics-acceptance.md](analytics-acceptance.md); the bounded follow-up checks actual reports. |
| Media/fonts/embeds reserve space and do not shift during load. | Pass | Measured lab CLS 0 for home/download/setup on mobile and desktop. Other page layouts fit in browser checks. No real-user CLS distribution is established. See [performance-and-schema.md](performance-and-schema.md). |

## E. Structured data and previews

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Truthful supported structured data validated without errors. | Pass for checked templates | Google Search Console live tests found one valid BreadcrumbList item each on download/setup; all three priority pages are available to Google. All six live JSON-LD documents parse. Standalone Rich Results Test had a service failure; no false success recorded. See [performance-and-schema.md](performance-and-schema.md). |
| One source of truth per structured fact. | Pass | Page records feed metadata, rendering, sitemap, and schema; [`release.ts`](../../src/release.ts) owns release/download URLs. No duplicate SEO plugin or schema dependency is introduced. The separate optional field-metrics integration uses the official web-vitals package. |
| Open Graph image and crawlable square supported favicon. | Pass | Social PNG 1200×630, favicon 96×96 and touch icon 180×180 all return 200 at referenced paths. Social-platform display and search favicon selection remain provider decisions. See [live-acceptance.md](live-acceptance.md). |

## F. Local, international, and other engines

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Business Profile details match website. | Not applicable | No eligible local business or Business Profile is established. |
| Complete reciprocal hreflang for real locale variants. | Not applicable | The site has one English version; no translated or regional equivalents exist. `lang="en"` is provided without invented hreflang URLs. |
| IndexNow key published and public URLs submitted. | Submitted | The public key and `scripts/indexnow.mjs` submission flow are implemented. IndexNow returned HTTP 202 for all six canonical public URLs on 2026-10-20. This is receipt, not indexing; do not automatically resubmit unchanged pages. |
| Bing property verified and sitemap submitted. | Partial | Bing ownership is verified. Exact sitemap submission returned an unexpected server-side error and no receipt. IndexNow previously acknowledged the six URLs. A single next-day retry is scheduled; see [account-setup.md](account-setup.md). |
| Google Search generative AI effective control recorded. | Pass | Search Console displays inherited Default and **Current control: Include**. No change needed. This is eligibility configuration, not actual inclusion or impressions. See [account-setup.md](account-setup.md). |
| AI crawler rules deliberately allow desired search/citation access. | Pass | Generated robots.txt permits all public crawlers through `User-agent: *`; no search, citation, or training-specific exclusion is configured. This makes public pages eligible to be fetched, not guaranteed to appear in answers. The main saved-robots audit records rule analysis separately. |
| CDN/firewall allows desired crawler IPs; no Copilot exclusion headers. | Partial | Google smartphone live inspection successfully fetched home/download/setup; no noarchive/nocache exclusions are emitted. Vercel firewall API returned 404 Config not found, so a complete provider firewall/crawler-IP inventory is unavailable. No protection was weakened. Actual access by every search/AI crawler is not established. |

## G. Measurement

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Primary outcome key event tested once per real success. | Not applicable to an unobservable completion | The site exposes a GitHub ZIP link with no observable download/installation success signal. No success key event is fabricated. Consent-gated download_click measures intent only. The one ZIP click produced one event with HTTP 204 receipt; dialog/unrelated clicks and refresh did not add download events. Withdrawal passed. GA report display remains unconfirmed. See [analytics-acceptance.md](analytics-acceptance.md). |
| No personal data in custom event values/URLs; redaction configured. | Pass for inspected payloads | Focused production checks passed query/fragment/referrer stripping, no Google requests before opt-in, and withdrawal with no subsequent collection plus cleared GA cookies. Account email/25-key redaction is saved and advertising features are off. See [analytics-acceptance.md](analytics-acceptance.md) for exact coverage and lifecycle-request limits. Standard Google browser/network collection after consent is disclosed; this is not a claim of anonymous telemetry. |
| Search Console and outcome baseline for comparable periods. | Pending search processing | Google overview reports are processing; three priority URLs are discovered but not yet indexed. There is no comparable traffic/outcome dataset. Record unavailable data separately from zero traffic and compare like periods once available. |

## H. Post-launch: first 14 days

Publication was **2026-10-20**. The dates below use days elapsed from publication: Day 1 **October 21**, Day 3 **October 23**, Day 7 **October 27**, and Day 14 **November 3, 2026**. The ACTIVE `estera-seo-launch-follow-up` automation runs daily at 9:00 a.m. America/Los_Angeles for 14 runs, prioritizes these checkpoints, and stays quiet when unchanged. Scheduling does not complete future observations.

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Day 1: inspect Page indexing for accidental exclusions and 5xx spikes. | Needs work | Publication is established; verified Search Console access is required. Record actual report evidence, including intentional preview/404 exclusions separately. |
| Day 1: crawl stats/logs show no error bursts; robots returns 200. | Needs work | Record production crawl stats or accessible logs on the checkpoint date. Current robots HTTP acceptance belongs in [live-acceptance.md](live-acceptance.md); it does not substitute for observing later error spikes. |
| Day 3: URL Inspection on priority URLs, indexed or pending recorded. | Needs work | Inspect all six public URLs; this site does not need ten arbitrary pages. Record declared and Google-selected canonicals and actual index state. Use **Pending** only when search processing is genuinely outstanding. |
| Day 7 and Day 14: compare Performance with baseline and investigate drops. | Needs work | Launch date is 2026-10-20; comparable search data is still required. Compare query/page mix as well as clicks and impressions; use Guide 12 for unexplained drops. Do not attribute a change in click-through rate to copy alone. |

## I. Search intent and content strategy

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Actual result mix and relevant competitors researched. | Pass | [search-strategy.md](search-strategy.md) records the 2026-10-20 search snapshot, four primary competitor sources, and evidence limits. It is not a stable Google rank report or keyword-volume estimate. |
| Content addresses the most suitable query intent without unsupported claims. | Pass | The evaluation criteria and coordinate/IP distinction were published in commit 6811808, deployment dpl_BtY8D8zasbraDmfiPzsgcveXDbtw READY. Affected live pages returned 200 with the new copy and expected canonicals; see [followup-deployment.json](evidence/followup-deployment.json). |
