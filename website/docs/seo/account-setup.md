# Search and measurement account setup

Recorded October 20, 2026. Property: `https://estera-virid.vercel.app/`. Credentials, personal account details and visitor identifiers are intentionally omitted from this public repository. Public configuration identifiers and aggregate acceptance evidence are recorded.

## Google Search Console

- Created the URL-prefix property in the owner's signed-in Google account.
- Added the public `GOOGLE_SITE_VERIFICATION` token to this Vercel project's production environment. Deployment `dpl_BtY8D8zasbraDmfiPzsgcveXDbtw` of commit `6811808` published it. Keep the token after verification.
- Google displayed **Ownership verified**, method **HTML tag**.
- Submitted `/sitemap.xml`. Google displayed **Sitemap submitted successfully**, then **Success**, **6 discovered pages**, submitted/read October 20, 2026.
- Initial home, download and first-session-guide index inspections: **Discovered — currently not indexed**, sitemap recognized, no previous crawl. This is actual pending search processing, not proof of indexed pages.
- Homepage live test, October 20 at 3:38 PM PDT: **URL is available to Google**, **Page can be indexed**, smartphone inspection fetch successful, crawl/indexing allowed, correct declared canonical. Google-selected canonical is only determined after indexing.
- Download live test at 3:40 PM PDT: **URL is available to Google**, **Page can be indexed**, **Breadcrumbs: 1 valid item detected**.
- First-session guide live test at 3:41 PM PDT: **URL is available to Google**, **Page can be indexed**, **Breadcrumbs: 1 valid item detected**.
- One homepage Request indexing attempt returned **Quota Exceeded**, with an instruction to try tomorrow. It was not accepted, and no repeat requests were attempted. The sitemap submission remains successful.
- Search generative AI setting inspected directly: **Inherit control from estera-virid.vercel.app (Default), Current control: Include**. No setting change was needed. This permits inclusion subject to indexing/selection; it is not an AI appearance or traffic result. Settings also showed robots.txt **Valid** and crawl stats **No data available yet**. Evidence: [AI-search inclusion](evidence/google-search-ai-inclusion.png).
- Overview performance/indexing/experience/enhancement reports state **Processing data, please check again in a day or so**. There is no comparable traffic baseline yet; this is unavailable data, not zero visitors.

Evidence: [guide live/schema test](evidence/google-guide-live-schema.png), [ownership](evidence/google-ownership-verified.png), [sitemap receipt](evidence/google-sitemap-submitted.png), [home live fetch](evidence/google-home-live-test.png), [download live/schema test](evidence/google-download-live-schema.png).

## Bing Webmaster Tools

The owner explicitly approved using the same Google account for Bing sign-in. Added the property directly, without granting Bing access to all Search Console properties. The public `BING_SITE_VERIFICATION` token is configured in production. Deployment `dpl_HWnjwmj5hf7p3qejbdhuLQcEM1Z6` (same commit `6811808`) is READY and publishes both verification tags. The Verify action opened the site dashboard with reports processing (up to 48 hours). The sitemap form submitted the canonical XML URL but returned **An unexpected error occurred on the server side**. No receipt was established. The sitemap list also displayed a momentary-service issue. Do not call this successful or repeat unchanged requests; retry after the new property/service becomes ready. Evidence: [server error](evidence/bing-sitemap-server-error.png). Verification is not indexing.

## Google Analytics

The owner approved and completed account creation, business/reporting settings, and acceptance of the US Google Analytics Terms and Google Ads Data Processing Terms. The account is **Estera**, property **Estera website**, with Computers & Electronics / small 1–10 / Understand web/app traffic, US/Pacific reporting time and USD. The owner-created account can administer these settings. All four optional account data-sharing choices are off; optional marketing emails were declined.

Production stream **Estera production website** uses public measurement ID **G-HL1L7MX0B5** and the canonical HTTPS origin. Saved configuration:

- Enhanced Measurement **off**; the site supplies explicit page views and ZIP-click intent.
- Google signals and user-provided data collection **off**.
- Advertising personalization **disallowed in all 307 regions**, in addition to the site's denied advertising consent and disabled advertising signals.
- Email redaction **on**. URL-query redaction **on** for 25 keys: `email`, `email_address`, `q`, `query`, `search`, `name`, `first_name`, `last_name`, `phone`, `address`, `lat`, `lng`, `lon`, `latitude`, `longitude`, `location`, `route`, `gpx`, `user_id`, `uid`, `device_id`, `udid`, `serial`, `token`, `code`. The site independently removes all query strings/fragments from supplied page URLs and reduces referrers to their origin; the configured keys are defense in depth, not a wildcard account setting.
- Event-data retention **2 months**, as approved. The separate default user-data period is **14 months**, with reset on new activity on; it was not represented as two months or changed without a request.
- Collection is restricted in the website code to the exact canonical origin and known routes. The fresh independent review found that the separate provider-side Include hostname filter had been missed. **Estera production hostname** has now been created: Web hostname traffic, Include only, exactly matches `estera-virid.vercel.app`, **Testing**. It is not yet an active allowlist. Google recommends waiting 24–36 hours and validating matching data before activation; activation permanently affects incoming processing. The existing Internal Traffic filter also remains Testing. Measurement Protocol traffic is outside the hostname filter. See [saved filter](evidence/google-analytics-hostname-filter-testing.png) and [Google’s filter procedure](https://support.google.com/analytics/answer/16608575?hl=en).

The production-only `VITE_GA4_ID` was published in commit `1dc597b`, READY deployment **dpl_4FcH59LE5XynhL367KvN1jEEpsDN**. A visitor must still explicitly opt in at `/privacy#analytics-preferences`; no Google library loads before consent. The focused delivery/consent acceptance is recorded separately in [analytics-acceptance.md](analytics-acceptance.md): no pre-consent tracking, one actual ZIP-click intent event, no false/duplicate clicks, redacted payloads, and stopped collection/cleared GA cookies after withdrawal. The download event and one actual acceptance-browser LCP measurement received HTTP 204. CLS/INP were unobserved; some navigation/lifecycle requests aborted and not every page view has a response receipt. Bounded observation of Realtime, including one refresh, still displayed no event data. This proves specific collector receipts, not successful reporting for every event. [Realtime evidence](evidence/google-analytics-realtime-pending.png) records that limit. A `download_click` is acquisition intent, not download completion or installation. No success key event is fabricated for the GitHub-hosted ZIP.

Evidence: [stream configuration](evidence/google-analytics-stream-configured.png), [event and user retention](evidence/google-analytics-retention.png), [advertising controls](evidence/google-analytics-ads-disabled.png).

## Hosting and follow-up

Vercel project access is confirmed for `prj_O0XlfcbrEVZQzLyalfgridXlsrhS`, account `team_ZSY86zD3roAXul5Ntse5tepH`. The canonical host is public. SSO protection is enabled as `all_except_custom_domains`; tested secondary-host pages redirect to Vercel sign-in and carry noindex. No account permission or firewall weakening was performed.

The ACTIVE `estera-seo-launch-follow-up` heartbeat runs at 9 AM America/Los_Angeles for 14 daily opportunities, doing useful checks on October 21/23/27 and November 3. It stays quiet on unchanged/non-actionable states. Future observations are scheduled, not completed in advance. Days 1/3 should revisit actual indexing, the Bing sitemap receipt and the single quota-blocked request if appropriate; days 7/14 should compare available query/page evidence without inventing results. The same bounded monitor also checks aggregate reports in the already-approved Analytics property when useful, distinguishes acceptance traffic from real visitors, and does not generate more test traffic.

## Fresh-review corrections

The follow-up source change centralizes withdrawal, handles storage changes/removal/clear in existing tabs, and reconciles resumed pages. A failed preference write stops the current document immediately and does not reload into a stale granted preference; the UI explains that the saved browser-wide choice could not be changed. Five focused offline regression cases pass against the actual analytics module with browser boundaries stubbed. This is not a new live Google or two-tab browser observation. See [review fixes](review-fixes.md).
