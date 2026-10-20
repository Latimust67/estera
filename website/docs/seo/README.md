# Estera SEO implementation

Implementation date: **2026-10-20**. Scope: `website/`, the public Estera demo/download site. The desktop app and backend are unchanged. The documented production origin is **https://estera-virid.vercel.app**. The primary visitor task is understanding the preview and downloading the Mac archive; a clicked link is not evidence of a completed download, installation, or successful phone session.

The SEO baseline was **published on 2026-10-20**: commit `fbcf205`, Vercel deployment `dpl_ANKUnuu4HmUDazmzhNnVza6SBMYD`, state `READY`, at [the canonical production site](https://estera-virid.vercel.app). IndexNow returned **HTTP 202 for all six public URLs**. This confirms submission receipt, not indexing or ranking. Account setup is recorded in [account-setup.md](account-setup.md): Google and Bing ownership are verified. Google sitemap submission succeeded with six discovered pages; Bing returned a server-side submission error. Analytics creation awaits remaining setup approval. Completed live/browser/performance acceptance is recorded in [live-acceptance.md](live-acceptance.md). The research-driven copy additions are live in commit `6811808`; the affected HTTP/content/canonical checks passed. The optional field-metrics follow-up is live in commit `b395838`, deployment `dpl_9z8gRxM64AvFFMsM4biri4EppFd8` (READY). Its privacy explanation and tracking-off notice were confirmed live. IndexNow subsequently accepted the three changed URLs with HTTP 200.

## Approach and evidence

The live baseline audit returned HTTP 200 for `/`, no canonical, no JSON-LD, no social image, and HTTP 404 for both `/robots.txt` and `/sitemap.xml`. Raw HTML exposed only the 139-word no-JavaScript fallback, with three external links and no internal links. `baseline-source-audit.json` captures the matching source template. This was a read-only public audit; no Search Console or Analytics data was available.

**Reuse verdict: wrap the installed stack.** React/react-dom 19.3.0 and Vite 8.3.0 are already pinned and MIT-licensed. Their server renderer and SSR build provide static HTML without adding a server, head-management package, router, crawler service, or dependency. The package's Node audit is vendored unchanged with provenance. A migration to a different web framework or a headless-browser prerender service would add setup and execution cost for six static pages. The initial static-HTML work added no dependency. The follow-up adds the official Apache-2.0 `web-vitals` 5.3.0 package, dynamically imported only after analytics opt-in.

The established design is preserved. The new documentation pages use its existing fonts, colors and controls. Content comes from the actual release documentation and current provider implementation. No rating, testimonial, person, organization registration, address, hardware result, translated edition, or local-business eligibility is invented.

## What is implemented

- Complete generated HTML for `/`, `/download`, `/guides/iphone-location-simulation`, `/guides/routes-and-gpx`, `/compatibility`, and `/privacy`.
- React hydrates the same content. Homepage motion starts in effects; the initial server and client state match. The homepage stylesheet is linked in its static head. Guide pages do not import the homepage's globe/demo JavaScript.
- Unique titles and descriptions, absolute self canonicals, matching Open Graph URLs, PNG social images and Twitter summary cards, square PNG favicon and Apple touch icon.
- WebSite and WebPage structured data on the homepage, and WebPage/BreadcrumbList on each inner page. Breadcrumbs are also visible.
- Real links between all pages, no orphan pages, direct download links with truthful requirements, and useful setup/route/compatibility/privacy content with visible content-update dates.
- Generated XML sitemap and robots.txt with a single allow-all group. Search/citation crawlers inherit this group. No training-crawler policy change has been assumed; this preserves the site's prior unrestricted policy. CDN controls remain an owner check.
- Vercel clean URLs, no trailing slash except `/`, no catch-all rewrite, and a generated `404.html`. Live unknown-path status acceptance is recorded separately in [live-acceptance.md](live-acceptance.md).
- `noindex, follow` on the 404 and all Vercel preview builds. Preview pages remain crawlable so noindex can be read, and their sitemap is empty. This is **not access control**: protect private previews through hosting settings.
- Optional verification tags, optional opt-in GA4, and an IndexNow public ownership key with an explicitly invoked submission tool.

SoftwareApplication rich-result markup is intentionally omitted: Google requires a genuine rating or review as well as name/price, and the project provides none. Useful FAQ answers remain visible without speculative FAQ/HowTo markup. There is no real site search, translation set, storefront, or in-person service, so SearchAction, hreflang, merchant feeds, LocalBusiness and Business Profile setup do not fit this site.

The dated [search-intent and competitor review](search-strategy.md) now covers “best location changing apps” and the more specific Mac/open-source queries. Its actionable follow-up adds selection criteria to `/download` and clarifies location-changer vocabulary and coordinate/IP limits in the setup guide. Existing routes cover these tasks without a fabricated “best apps” ranking or duplicate keyword pages.

## Build and update

Run `npm run build` inside `website/` to type-check, bundle, and generate `dist`. Run `npm run seo:audit` explicitly to audit all generated HTML without a browser/server. The report is `generated-audit.json`. Neither command deploys. The `.prerender` bundle is temporary and removed after generation; the ignored `.prerender-manifest.json` supports audit and submission scripts.

Release links have one source in `src/release.ts`. Page content and dates live in `src/content.tsx`; homepage content lives in `src/App.tsx` with its date in `src/site.ts`. Update visible content dates and `dateModified`/sitemap `lastmod` only when content materially changes. Do not replace them with every build's time. Review requirements and all versioned documentation links when changing the release version.

`VITE_SITE_URL` is the single canonical origin (defaults to the verified address above). It must be a bare HTTPS origin. For a future custom domain, set it before building and configure old-host redirects in Vercel after the owner connects that domain. Do not canonicalize to a preview deployment. Public verification and analytics variables are listed in `.env.example`; no secrets are needed in client code.

Development is Vite's client-rendered mode; production is the generated output. `vite preview` is a convenience server, not proof of Vercel redirects or error status codes. Deploy `dist` with the checked-in Vercel configuration. If hosting elsewhere, explicitly serve extensionless HTML and return a real 404 for missing paths.

## Account setup and acceptance

1. **Search Console (verified):** the URL-prefix property is verified by its production HTML tag. Google read the sitemap successfully and discovered all six pages. Home/download/setup live tests pass; download/setup each have one valid breadcrumb item. Initial index state is discovered, not indexed. A manual homepage indexing request hit the daily quota. A public HTML verification token can be supplied as `GOOGLE_SITE_VERIFICATION`, then rebuilt/published and verified. A DNS Domain property requires an owner-controlled custom domain; it is not appropriate for Vercel's shared parent domain. Keep the token after verification. Property ownership and sitemap receipt are recorded in [account-setup.md](account-setup.md), not inferred from a tag.
2. **Bing Webmaster Tools (verified):** the owner approved the account; direct HTML-token verification succeeded. Sitemap submission returned a server-side error, so receipt is not established. A bounded next-day retry is scheduled. See [account-setup.md](account-setup.md). Keep the canonical sitemap available; Google has accepted it and Bing still needs a successful receipt. Owner access and reporting baselines are not established by adding HTML tags; account results belong in [account-setup.md](account-setup.md).
3. **IndexNow (submitted):** the six URLs received HTTP 202 on 2026-10-20. `public/indexnow-key.txt` is a public proof file, not a secret. For subsequent changes, `npm run seo:indexnow` previews the payload without sending anything; `npm run seo:indexnow -- --submit` verifies the deployed key and submits URLs. Add absolute canonical URL arguments to submit only changed or intentionally removed pages. No submission runs automatically during builds. Receipt does not establish indexing.
4. **Hosting:** access is confirmed for Vercel project `prj_O0XlfcbrEVZQzLyalfgridXlsrhS` in account `team_ZSY86zD3roAXul5Ntse5tepH`. `ssoProtection` is enabled as `all_except_custom_domains`; the secondary alias returned HTTP 302 to Vercel SSO with `noindex` for `/` and `/download`. This establishes those protected-alias observations, not every crawler's access. Preferred-origin HTTP acceptance is recorded separately; no permissions or firewall policy were changed.
5. **Search processing:** use URL Inspection, the Rich Results Test, indexing reports and server logs. IndexNow submission is established; Google processing and actual index state must come from their own reports. Representative official Google structured-data and focused browser checks passed; see [live-acceptance.md](live-acceptance.md).

## Optional analytics

Tracking is **off by default**. The owner approved the account and disabled optional sharing. The reporting/business settings still await explicit approval after automatic review rejected selecting an objective. See [account-setup.md](account-setup.md). Set an actual `VITE_GA4_ID` only after the owner has a GA4 property and has reviewed the data collection configuration. The `/privacy#analytics-preferences` controls explicitly opt in; no Google script loads before consent. Advertising consent is denied and Google signals/ad personalization are disabled. Collection is restricted to the exact canonical production origin and known page paths; previews and development do not collect. The browser stores the choice locally. Withdrawal disables future collection, clears the site's GA cookies and reloads to unload the library.

Before activation, turn **Enhanced Measurement off** for this stream; this site emits its own `page_view`, diagnostic `download_click`, and actual LCP/INP/CLS measurements. Keep automated form/outbound/download/search collection off so it cannot duplicate clicks or inspect arbitrary interface text. Configure GA4 data redaction, suitable retention and the production-host filter in the owner's account. No user IDs, phone IDs, routes, user-entered text, query strings or URL fragments are supplied by the custom events. Referrers are reduced to the origin, so campaign-level attribution is deliberately limited. Google can receive its standard browser/network information after consent; this is not anonymous-by-assertion telemetry.

`download_click` fires only for a clicked current-release ZIP link, once per click. Opening the dialog, loading or reloading the page, or clicking unrelated links does not trigger it. This is a diagnostic intent event. Do not label it a completed installation, activated device or qualified outcome. There is no website-visible completion signal for a GitHub-hosted download; no fake `generate_lead`/`purchase` or thank-you flow is added.

After activation, the unperformed acceptance checks are: (1) opt in and click the ZIP, confirm one `download_click` in DebugView/Realtime; (2) open/cancel the dialog or click an unrelated link, confirm none; (3) refresh/revisit without clicking, confirm no new download event; (4) deny/withdraw consent, confirm no later Google requests. Check payload privacy. These are documented checks, not results claimed here. Account setup and a visitor choice are both necessary.

The official PageSpeed browser run reported **97 mobile performance and 100 desktop performance for the homepage**, with **100 for SEO, accessibility, and best practices**, and **no CrUX field dataset**. These are dated lab results, not real-user Core Web Vitals or a ranking score. The download and setup pages each scored 100 on both mobile and desktop; all three reported no CrUX field data. Details are in [performance-and-schema.md](performance-and-schema.md). The optional official `web-vitals` integration is implemented, pending account activation and real delivery acceptance. It reports actual LCP/INP/CLS delta measurements with metric-instance IDs, without DOM attribution or arbitrary URL data. No synthetic INP or real-user performance result is asserted.

## Operating cadence

- Launch follow-up: publication is 2026-10-20. Complete sitemap/account setup, inspect the home/download/setup URLs, and record real HTTP error/redirect behavior and actual indexing state in the live acceptance report.
- Days 1, 3, 7 and 14: use October 21, October 23, October 27, and November 3, 2026 as the scheduled offsets from publication. Follow `launch-checklist.md` when each date is reached; the ACTIVE `estera-seo-launch-follow-up` automation runs daily at 9:00 a.m. America/Los_Angeles for 14 runs, stays quiet when unchanged, and prioritizes those checkpoints. Scheduling is not a completed observation.
- Weekly: look for crawl/indexing failures, changed requirements, download-link problems and useful support questions.
- Monthly: review Search Console page/query demand, genuine outcomes where observable, consented click diagnostics, and traffic sources together; record meaningful changes in `change-log.csv`. Compare like periods and use a three-month trend once available.
- Quarterly: recheck crawler/documentation changes and the release facts. Keep real content improvements ahead of decorative markup or invented keyword pages.

## Primary implementation references

- [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): make content and links accessible in rendered pages.
- [React renderToString](https://react.dev/reference/react-dom/server/renderToString) and [Vite SSR/prerendering](https://vite.dev/guide/ssr.html): reuse the installed renderer at build time.
- [Google software-app markup requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app): genuine rating/review requirement informs omission of that rich-result type.
- [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json) and [custom 404 handling](https://vercel.com/kb/guide/custom-404-page): clean URLs and unknown-route output.
- [GA4 configuration reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/config): deliberate page location/referrer and advertising controls.
- [IndexNow protocol](https://www.indexnow.org/documentation): key proof and explicit submissions.

These references were opened on 2026-10-20. Search indexing, rankings, rich results, AI citations and traffic increases are not guaranteed by implementation.

## Recorded implementation checks

On 2026-10-20, the final production build passed TypeScript, both Vite bundles, and prerendering of six public pages plus the 404. The saved-HTML audit passed all six pages with **zero package warnings** and no contract failures, including actual static homepage CSS links, one H1 per page, unique metadata, self canonicals, parsable JSON-LD, incoming internal links, existing fragment targets and required assets. See `generated-audit.json` for the raw report.

Independent source review returned **pass, no material actionable defects**. The public GitHub `v0.1.2` tree was also read to confirm all seven linked documentation files exist. The follow-up content and opt-in field-metrics code also passed the production build and six-page static audit with zero warnings. The production deployment and six-URL IndexNow receipt are now established above. Completed browser/HTTP results, performance, Google live schema results, account blockers and pending analytics delivery are recorded separately in [live-acceptance.md](live-acceptance.md); only completed evidence there should be reported as passed.
