# Estera SEO launch checklist

Recorded **2026-10-20** for `https://estera-virid.vercel.app`. Scope: homepage, download, two guides, compatibility, and privacy. Based on the SEO Implementation Package checklist, Guides 2–15.

**Pass** means the stated local implementation is present where identified. It does not imply publication, indexing, browser acceptance, or a ranking outcome. **Needs work** includes missing account access and external evidence. **Pending** is reserved for actual search processing after submission; no such state has been established. **Not applicable** means the feature or business model is absent.

Owner for source changes: **site maintainer**. Owner for accounts, publishing, provider settings, and post-launch evidence: **project owner**. No named account owner has been verified. Dates below are this review date unless a future checkpoint is specified.

The production build and six-page saved-HTML audit passed; the report is [generated-audit.json](generated-audit.json). Independent source review found no material defects. These establish local output only. No deployment, browser tests, performance tests, Rich Results Test, or post-launch checks have been performed for this change.

## A. Access and ownership

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Business owns domain, hosting, CMS, and DNS; helpers have delegated access. | Needs work | The known production address is a Vercel subdomain. Hosting ownership and delegated roles were not supplied. There is no CMS or separate custom-domain registration in this implementation. Project owner: confirm Vercel project/account control and any future custom-domain ownership. |
| Search Console and Bing Webmaster Tools verified. | Needs work | `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` placeholders are in [`.env.example`](../../.env.example); tags are emitted by [`prerender.mjs`](../../scripts/prerender.mjs) only when supplied. No tokens or verified property evidence supplied. Use a URL-prefix property for this Vercel subdomain; a DNS Domain property requires an owner-controlled domain. Verify Bing directly or import a verified Search Console property. |
| GA4 property owned by the project; maintainer has Editor access. | Needs work | `VITE_GA4_ID` is empty by default. No property, stream, account ownership, or role evidence supplied. Configure only in the owner's account if measurement is wanted. |
| Eligible Business Profile owned by the business. | Not applicable | Estera is downloadable software; no eligible local storefront or in-person service business is established. |

## B. Crawling and indexing

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Staging is password-protected and removed or kept private after launch. | Needs work | [`vite.config.ts`](../../vite.config.ts) adds `noindex` for Vercel preview builds; this is not access protection. Project owner: confirm deployment protection for previews. No staging password/access settings were inspected. |
| Production robots.txt permits important content, includes Sitemap, and has no crawl-delay. | Pass | Local generation in [`prerender.mjs`](../../scripts/prerender.mjs) uses `User-agent: *`, `Allow: /`, and the canonical sitemap URL for production. WordPress/WooCommerce exclusions from the kit are irrelevant here. Production HTTP response still requires publication and inspection. |
| No leftover noindex meta or X-Robots-Tag on public pages. | Needs work | Source emits `index, follow, max-image-preview:large` for production public pages; 404 and preview output receive `noindex`. [`vercel.json`](../../vercel.json) adds no indexing header. The generated production output passed the saved-HTML audit. Check actual deployed response headers after publication. |
| Important pages return HTTPS 200 on one host and one slash convention. | Needs work | [`site.ts`](../../src/site.ts) requires a bare HTTPS canonical origin. [`vercel.json`](../../vercel.json) uses `cleanUrls: true` and `trailingSlash: false`. Six static documents are generated. Live status codes, HTTPS, and route handling have not been observed. |
| HTTP, non-preferred host, and URL variants redirect in one permanent hop. | Needs work | Clean URL and trailing-slash configuration is present; no custom alternate host or old URL migration was supplied. Project owner: confirm HTTP, slash, and `.html` behavior after publication and add explicit redirects only for real variants that need them. |
| Absolute, self-referencing canonicals match sitemap and internal links. | Pass | [`site.ts`](../../src/site.ts), [`entry-server.tsx`](../../src/entry-server.tsx), and [`prerender.mjs`](../../scripts/prerender.mjs) share the production origin and route list. Canonicals use `/` for home and no trailing slash elsewhere. Local implementation only; publication remains unverified. |
| Sitemap contains only preferred indexable 200 URLs, has real lastmod, and is submitted. | Needs work | The generator lists the six public routes, excludes 404, and uses `2026-10-20` for this content change. Preview output has no URLs. Live 200 responses and Search Console/Bing submission are unverified. Retain lastmod until content actually changes. |
| Main content is available in raw/server-rendered HTML. | Pass | The build runs React server rendering into `index.html`, `download.html`, guide HTML files, `compatibility.html`, and `privacy.html`; [`main.tsx`](../../src/main.tsx) hydrates existing content. Primary copy and links are rendered without relying on interaction. Saved-output and live URL Inspection evidence remain separate. |
| Missing/removed pages return 404 or 410 rather than a soft 404. | Needs work | A recovery page is generated as `404.html`; an all-path SPA rewrite is absent from [`vercel.json`](../../vercel.json). No existing page was removed. Confirm an unknown URL returns an actual HTTP 404 after publication. |
| Redirect map completed and each migration row externally tested. | Not applicable | Existing homepage URL is retained; the five additional pages are new. No deleted or migrated URL list was supplied, so no speculative migration redirects were created. [redirect-map.csv](redirect-map.csv) records the configured `.html` and slash variants; their live behavior remains unverified. Revisit if a domain/path migration is planned. |

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
| Viewport, readable mobile text, usable targets, and no blocking interstitial. | Needs work | Viewport is present in [`index.html`](../../index.html); responsive styles and user-opened download dialog are implemented. Phone layout, touch targets, keyboard behavior, and dialog acceptance have not been visually tested. Run only if the owner requests that verification. |
| Hero LCP image is eager, dimensioned, and appropriately sized. | Not applicable | The hero uses text and a canvas globe, not a hero `<img>`. This does not establish LCP performance; the actual largest-content element has not been measured. |
| PageSpeed Insights baseline for home and two priority pages. | Needs work | No field/lab performance run was requested or performed. If authorized after publication, record home, `/download`, and `/guides/iphone-location-simulation` with test date/device context. No score is claimed. |
| If field data is absent, web-vitals events arrive in GA4. | Needs work | Field-data availability is unknown. No Web Vitals collection is installed and GA4 is unconfigured. Decide whether field measurement is needed after inspecting available data; do not claim LCP/INP/CLS acceptance. |
| Media/fonts/embeds reserve space and do not shift during load. | Needs work | Source reserves globe aspect ratio and supplies dimensions for the destination artwork. Font stack and responsive layout exist, but layout-shift behavior has not been measured. No browser or performance evidence is available. |

## E. Structured data and previews

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Truthful supported structured data validated without errors. | Needs work | [`entry-server.tsx`](../../src/entry-server.tsx) emits WebSite, WebPage, and visible-page BreadcrumbList data. No FAQ, HowTo, Product, rating, or LocalBusiness markup is warranted. Main-task JSON parsing checks are separate from Google's Rich Results Test, which has not been run. WebSite/WebPage do not themselves guarantee a rich result. |
| One source of truth per structured fact. | Pass | Page records feed metadata, rendering, sitemap, and schema; [`release.ts`](../../src/release.ts) owns release/download URLs. No duplicate SEO plugin or new dependency is introduced. |
| Open Graph image and crawlable square supported favicon. | Needs work | The prerender template references a 1200×630 PNG social image and page-specific titles/descriptions; [`index.html`](../../index.html) references a 96×96 PNG favicon plus SVG and touch icon. The 1200×630 social PNG, 96×96 favicon and 180×180 touch icon were generated, and their presence in the build passed the saved-HTML audit. Deployed image/favicon responses remain unverified; no social preview service was run. |

## F. Local, international, and other engines

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Business Profile details match website. | Not applicable | No eligible local business or Business Profile is established. |
| Complete reciprocal hreflang for real locale variants. | Not applicable | The site has one English version; no translated or regional equivalents exist. `lang="en"` is provided without invented hreflang URLs. |
| IndexNow key published and Bing sitemap submitted. | Needs work | The local `public/indexnow-key.txt` and `scripts/indexnow.mjs` are implemented; the latter defaults to a dry run. No external IndexNow submission, public key-file fetch, verified Bing property, or Bing sitemap receipt exists yet. Publish before the owner authorizes submission. |
| AI crawler rules deliberately allow desired search/citation access. | Pass | Generated robots.txt permits all public crawlers through `User-agent: *`; no search, citation, or training-specific exclusion is configured. This makes public pages eligible to be fetched, not guaranteed to appear in answers. The main saved-robots audit records rule analysis separately. |
| CDN/firewall allows desired crawler IPs; no Copilot exclusion headers. | Needs work | No `noarchive` or `nocache` directive is emitted by the source. Vercel firewall/bot settings and actual OAI-SearchBot, PerplexityBot, or Claude-SearchBot access have not been inspected. Review provider rules if indexing/citation access is blocked; robots permission alone is insufficient. |

## G. Measurement

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Primary outcome key event tested once per real success. | Needs work | [`analytics.tsx`](../../src/analytics.tsx) supports consent-gated page views and one `download_click` call per exact ZIP-link click. GA4 is unconfigured; consent, delivery, deduplication, and provider settings have not been tested. A click is diagnostic intent, not a verified completed download or installation. Do not label it installation success. |
| No personal data in events/URLs; redaction configured. | Needs work | Source uses known canonical paths, strips referrer paths/query strings, excludes free text and phone/route data, and disables ad features. No Google script is loaded before opt-in. GA4 automatic/enhanced measurement settings, redaction, actual network payloads, and consent withdrawal require owner-side acceptance; no PII-free guarantee is made. |
| Search Console and outcome baseline for comparable periods. | Needs work | No Search Console or GA4 access/data was supplied. [`baseline-source-audit.json`](baseline-source-audit.json) is a source-HTML baseline only, not traffic. Export the prior 28 days and prior-year equivalent if available; record unavailable data honestly. |

## H. Post-launch: first 14 days

These checkpoints begin on the actual publication date; no publication date or automatic follow-up is set by this document.

| Item | Status | Evidence and next action |
| --- | --- | --- |
| Day 1: inspect Page indexing for accidental exclusions and 5xx spikes. | Needs work | Publication and verified Search Console access are required. Record actual report evidence, including intentional preview/404 exclusions separately. |
| Day 1: crawl stats/logs show no error bursts; robots returns 200. | Needs work | No production crawl stats, access logs, or post-deploy robots response has been inspected. Project owner records these after publication. |
| Day 3: URL Inspection on priority URLs, indexed or pending recorded. | Needs work | Inspect all six public URLs; this site does not need ten arbitrary pages. Record declared and Google-selected canonicals and actual index state. Use **Pending** only when search processing is genuinely outstanding. |
| Day 7 and Day 14: compare Performance with baseline and investigate drops. | Needs work | Requires a real launch date and comparable search data. Compare query/page mix as well as clicks and impressions; use Guide 12 for unexplained drops. Do not attribute a change in click-through rate to copy alone. |
