# Search and measurement account setup

Recorded October 20, 2026. Property: `https://estera-virid.vercel.app/`. Account identifiers and private reporting data are intentionally omitted from this public repository.

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
- Overview performance/indexing/experience/enhancement reports state **Processing data, please check again in a day or so**. There is no comparable traffic baseline yet; this is unavailable data, not zero visitors.

Evidence: [guide live/schema test](evidence/google-guide-live-schema.png), [ownership](evidence/google-ownership-verified.png), [sitemap receipt](evidence/google-sitemap-submitted.png), [home live fetch](evidence/google-home-live-test.png), [download live/schema test](evidence/google-download-live-schema.png).

## Bing Webmaster Tools

The owner explicitly approved using the same Google account for Bing sign-in. Added the property directly, without granting Bing access to all Search Console properties. The public `BING_SITE_VERIFICATION` token is configured in production. Deployment `dpl_HWnjwmj5hf7p3qejbdhuLQcEM1Z6` (same commit `6811808`) is READY and publishes both verification tags. The Verify action opened the site dashboard with reports processing (up to 48 hours). The sitemap form submitted the canonical XML URL but returned **An unexpected error occurred on the server side**. No receipt was established. The sitemap list also displayed a momentary-service issue. Do not call this successful or repeat unchanged requests; retry after the new property/service becomes ready. Evidence: [server error](evidence/bing-sitemap-server-error.png). Verification is not indexing.

## Google Analytics

The owner approved creating an Estera account/property and explicitly approved turning off all four optional account data-sharing settings. Those draft settings are off. Proposed property: Estera website; US/Pacific reporting; USD; Computers & Electronics; small 1–10; understand web/app traffic. Explicit approval of the remaining choices was requested after automatic approval review blocked selecting the reporting objective. Account creation and legal terms acceptance are not yet complete. The approved account identity and sharing choices need not be requested again. No measurement ID is configured in production; analytics remains off. The official consent-gated web-vitals integration is published in commit `b395838`, READY deployment `dpl_9z8gRxM64AvFFMsM4biri4EppFd8`. Its production privacy page still explicitly reports that analytics is not configured.

Before activation: disable Enhanced Measurement and advertising features, enable appropriate redaction, use the approved retention setting, and test consent, actual event delivery, deduplication, withdrawal and payload privacy. A `download_click` is acquisition intent, not download completion or installation. No real success key event can be asserted for a GitHub-hosted ZIP without a completion signal.

## Hosting and follow-up

Vercel project access is confirmed for `prj_O0XlfcbrEVZQzLyalfgridXlsrhS`, account `team_ZSY86zD3roAXul5Ntse5tepH`. The canonical host is public. SSO protection is enabled as `all_except_custom_domains`; tested secondary-host pages redirect to Vercel sign-in and carry noindex. No account permission or firewall weakening was performed.

The ACTIVE `estera-seo-launch-follow-up` heartbeat runs at 9 AM America/Los_Angeles for 14 daily opportunities, doing useful checks on October 21/23/27 and November 3. It stays quiet on unchanged/non-actionable states. Future observations are scheduled, not completed in advance. Days 1/3 should revisit actual indexing and the single quota-blocked request if appropriate; days 7/14 should compare available query/page evidence without inventing results.
