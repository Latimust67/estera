# Estera SEO implementation

Implementation date: **2026-10-20**. Scope: `website/`, the public Estera demo/download site. The desktop app and backend are unchanged. The documented production origin is **https://estera-virid.vercel.app**. The primary visitor task is understanding the preview and downloading the Mac archive; a clicked link is not evidence of a completed download, installation, or successful phone session.

## Approach and evidence

The live baseline audit returned HTTP 200 for `/`, no canonical, no JSON-LD, no social image, and HTTP 404 for both `/robots.txt` and `/sitemap.xml`. Raw HTML exposed only the 139-word no-JavaScript fallback, with three external links and no internal links. `baseline-source-audit.json` captures the matching source template. This was a read-only public audit; no Search Console or Analytics data was available.

**Reuse verdict: wrap the installed stack.** React/react-dom 19.3.0 and Vite 8.3.0 are already pinned and MIT-licensed. Their server renderer and SSR build provide static HTML without adding a server, head-management package, router, crawler service, or dependency. The package's Node audit is vendored unchanged with provenance. A migration to a different web framework or a headless-browser prerender service would add setup and execution cost for six static pages. No new dependency or external service was installed.

The established design is preserved. The new documentation pages use its existing fonts, colors and controls. Content comes from the actual release documentation and current provider implementation. No rating, testimonial, person, organization registration, address, hardware result, translated edition, or local-business eligibility is invented.

## What is implemented

- Complete generated HTML for `/`, `/download`, `/guides/iphone-location-simulation`, `/guides/routes-and-gpx`, `/compatibility`, and `/privacy`.
- React hydrates the same content. Homepage motion starts in effects; the initial server and client state match. The homepage stylesheet is linked in its static head. Guide pages do not import the homepage's globe/demo JavaScript.
- Unique titles and descriptions, absolute self canonicals, matching Open Graph URLs, PNG social images and Twitter summary cards, square PNG favicon and Apple touch icon.
- WebSite and WebPage structured data on the homepage, and WebPage/BreadcrumbList on each inner page. Breadcrumbs are also visible.
- Real links between all pages, no orphan pages, direct download links with truthful requirements, and useful setup/route/compatibility/privacy content with visible content-update dates.
- Generated XML sitemap and robots.txt with a single allow-all group. Search/citation crawlers inherit this group. No training-crawler policy change has been assumed; this preserves the site's prior unrestricted policy. CDN controls remain an owner check.
- Vercel clean URLs, no trailing slash except `/`, no catch-all rewrite, and a generated `404.html`. Vercel serves that file for unknown paths; live status must be confirmed after publication.
- `noindex, follow` on the 404 and all Vercel preview builds. Preview pages remain crawlable so noindex can be read, and their sitemap is empty. This is **not access control**: protect private previews through hosting settings.
- Optional verification tags, optional opt-in GA4, and an IndexNow public ownership key with an explicitly invoked submission tool.

SoftwareApplication rich-result markup is intentionally omitted: Google requires a genuine rating or review as well as name/price, and the project provides none. Useful FAQ answers remain visible without speculative FAQ/HowTo markup. There is no real site search, translation set, storefront, or in-person service, so SearchAction, hreflang, merchant feeds, LocalBusiness and Business Profile setup do not fit this site.

## Build and update

Run `npm run build` inside `website/` to type-check, bundle, and generate `dist`. Run `npm run seo:audit` explicitly to audit all generated HTML without a browser/server. The report is `generated-audit.json`. Neither command deploys. The `.prerender` bundle is temporary and removed after generation; the ignored `.prerender-manifest.json` supports audit and submission scripts.

Release links have one source in `src/release.ts`. Page content and dates live in `src/content.tsx`; homepage content lives in `src/App.tsx` with its date in `src/site.ts`. Update visible content dates and `dateModified`/sitemap `lastmod` only when content materially changes. Do not replace them with every build's time. Review requirements and all versioned documentation links when changing the release version.

`VITE_SITE_URL` is the single canonical origin (defaults to the verified address above). It must be a bare HTTPS origin. For a future custom domain, set it before building and configure old-host redirects in Vercel after the owner connects that domain. Do not canonicalize to a preview deployment. Public verification and analytics variables are listed in `.env.example`; no secrets are needed in client code.

Development is Vite's client-rendered mode; production is the generated output. `vite preview` is a convenience server, not proof of Vercel redirects or error status codes. Deploy `dist` with the checked-in Vercel configuration. If hosting elsewhere, explicitly serve extensionless HTML and return a real 404 for missing paths.

## Account setup that remains

1. **Search Console:** use a URL-prefix property for `https://estera-virid.vercel.app/`. Supply the owner's public HTML verification token as `GOOGLE_SITE_VERIFICATION`, rebuild/publish, then verify. A DNS Domain property requires an owner-controlled custom domain; it is not appropriate for Vercel's shared parent domain. Keep the token after verification.
2. **Bing Webmaster Tools:** import the verified Search Console property, or supply `BING_SITE_VERIFICATION`. Submit the production `/sitemap.xml` in both consoles. Owner access and reporting baselines are not established by adding HTML tags.
3. **IndexNow:** `public/indexnow-key.txt` is a public proof file, not a secret. After publication, `npm run seo:indexnow` previews the payload without sending anything. `npm run seo:indexnow -- --submit` verifies the deployed key, then submits the six page URLs. Add absolute canonical URL arguments to submit only changed pages, or intentionally removed pages. No submission runs automatically during builds. Record HTTP 200/202 as receipt, not indexing.
4. **Hosting:** confirm domain/project ownership, preferred-host HTTPS redirects, protection of private preview URLs, and CDN search-crawler access. The change does not alter account permissions or firewall policy.
5. **Search processing:** after publication, use URL Inspection, the Rich Results Test, indexing reports and server logs. Until there is evidence of submission/crawling, the checklist records these as work remaining, not as pending Google processing.

## Optional analytics

Tracking is **off by default**. Set an actual `VITE_GA4_ID` only after the owner has a GA4 property and has reviewed the data collection configuration. The `/privacy#analytics-preferences` controls explicitly opt in; no Google script loads before consent. Advertising consent is denied and Google signals/ad personalization are disabled. Collection is restricted to the exact canonical production origin and known page paths; previews and development do not collect. The browser stores the choice locally. Withdrawal disables future collection, clears the site's GA cookies and reloads to unload the library.

Before activation, turn **Enhanced Measurement off** for this stream; this site emits only its own `page_view` and `download_click`. Keep automated form/outbound/download/search collection off so it cannot duplicate clicks or inspect arbitrary interface text. Configure GA4 data redaction, suitable retention and the production-host filter in the owner's account. No user IDs, phone IDs, routes, user-entered text, query strings or URL fragments are supplied by the custom events. Referrers are reduced to the origin, so campaign-level attribution is deliberately limited. Google can receive its standard browser/network information after consent; this is not anonymous-by-assertion telemetry.

`download_click` fires only for a clicked current-release ZIP link, once per click. Opening the dialog, loading or reloading the page, or clicking unrelated links does not trigger it. This is a diagnostic intent event. Do not label it a completed installation, activated device or qualified outcome. There is no website-visible completion signal for a GitHub-hosted download; no fake `generate_lead`/`purchase` or thank-you flow is added.

After activation, the unperformed acceptance checks are: (1) opt in and click the ZIP, confirm one `download_click` in DebugView/Realtime; (2) open/cancel the dialog or click an unrelated link, confirm none; (3) refresh/revisit without clicking, confirm no new download event; (4) deny/withdraw consent, confirm no later Google requests. Check payload privacy. These are documented checks, not results claimed here. Account setup and a visitor choice are both necessary.

No PageSpeed/CrUX baseline or real-user Core Web Vitals dataset has been collected. Use the package's official `web-vitals` integration only after analytics/consent is configured and a lack of public field data is established. This implementation does not add a custom approximation of INP or call a build a performance score.

## Operating cadence

- After publication: submit the sitemap, inspect the home/download/setup URLs, check real HTTP error and redirect behavior, and record the date and actual indexing state.
- Days 1, 3, 7 and 14: follow the corresponding rows in `launch-checklist.md` when those dates are reached. No recurring automation was created.
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

Independent source review returned **pass, no material actionable defects**. The public GitHub `v0.1.2` tree was also read to confirm all seven linked documentation files exist. No browser, visual, performance, deployed-HTTP, Rich Results Test, analytics-delivery, or search-console acceptance result is claimed. Nothing was published, pushed, or submitted to search engines during this task.
