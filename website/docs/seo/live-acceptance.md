# Production SEO and browser acceptance

Checked **October 20, 2026 (America/Los_Angeles)** against **https://estera-virid.vercel.app**. The main task identified the checked deployment as `dpl_ANKUnuu4HmUDazmzhNnVza6SBMYD`, commit `fbcf205`. These results cover its six public pages. Subsequent content or behavior changes require only the affected checks to be repeated.

**Result: no actionable website defect found in the checks below.** All six pages are publicly crawlable, their preferred URL variants work, the mobile and desktop layouts fit, and the tested download/navigation behavior works. This is production acceptance evidence, not proof of indexing, rankings, completed downloads, device compatibility, or full accessibility.

## HTTP, indexing directives, and assets

Evidence: [live-http.json](evidence/live-http.json) and [live-secondary-host.json](evidence/live-secondary-host.json).

| Check | Observed result |
| --- | --- |
| `/`, `/download`, `/guides/iphone-location-simulation`, `/guides/routes-and-gpx`, `/compatibility`, `/privacy` | All **HTTP 200**. Each has one H1, a main content element, its exact self-referencing canonical, `index, follow, max-image-preview:large`, and no `X-Robots-Tag` response header. |
| Structured data in the six public responses | All JSON-LD parses successfully. Home has WebSite/WebPage; inner pages have WebPage/BreadcrumbList. Parsing is not Google's rich-result eligibility validation. See [performance-and-schema.md](performance-and-schema.md) for the separate official-tool attempt. |
| HTTP variants of all six canonical URLs | Each returns **one 308** directly to its preferred HTTPS URL. The destination responses were checked separately above. |
| `.html` variants of all six pages, including `/index.html` | Each returns **one 308** directly to its extensionless canonical path, with `/index.html` going to `/`. |
| Trailing-slash variants of the five non-home pages | Each returns **one 308** directly to the path without a trailing slash. |
| `/__seo_acceptance_missing_20261020` | Actual **HTTP 404**, recovery content and one H1, `noindex, follow`, no canonical or structured data. It is not a soft 404. |
| `/robots.txt` | **HTTP 200**, `text/plain`, `User-agent: *`, `Allow: /`, preferred sitemap URL, no crawl-delay. |
| `/sitemap.xml` | **HTTP 200**, XML content type, exactly the six preferred public URLs and the recorded content-change date `2026-10-20`; no 404 or preview URLs. All six listed URLs were confirmed 200/indexable. This proves availability, not account submission or search-engine processing. |
| Social image, PNG favicon, SVG favicon, Apple touch icon, IndexNow key file | All **HTTP 200** at the referenced public paths. No social-preview-service or favicon-search-display claim is made. |
| Secondary project host `estera-larsenbeenk2-3123s-projects.vercel.app`, home and `/download` | Both return **302 to Vercel sign-in** and `X-Robots-Tag: noindex`. This hostname is protected and is not an openly served duplicate. Its sign-in query values are omitted from saved evidence. These two responses do not prove the protection configuration of every historic/preview deployment. |

## Browser and interaction checks

Used the already-installed Playwright 1.63.0 Chromium headless shell with `--use-angle=metal --enable-gpu --ignore-gpu-blocklist`. No package or browser was installed. Only one isolated browser ran at a time; it used fresh unauthenticated contexts. All launched browsers were closed. No local server, desktop app, account session, actual archive download, or phone flow was started.

The exact evidence is in [live-browser.json](evidence/live-browser.json), [live-browser-remaining.json](evidence/live-browser-remaining.json), and [live-browser-completion.json](evidence/live-browser-completion.json).

| Check | Observed result |
| --- | --- |
| Six pages at **1440 × 900** desktop and **390 × 844** mobile viewport | All 200 with rendered headings/main content and **no document horizontal overflow**. Headers and page navigation are present. |
| Mobile homepage navigation | Keyboard Enter opens the menu; Escape closes it; following “The experience” reaches the section and closes the menu. |
| Desktop and mobile homepage download dialog | Keyboard Enter opens it and moves focus inside. Escape closes it and restores focus to the invoking download link. The close button works with the keyboard. The mobile dialog fits horizontally within the viewport. |
| Modal keyboard navigation | The observed sequence stays among dialog controls while the document has focus. Native Chromium can move focus to browser chrome between cycles (`document.hasFocus()` becomes false); no background page control received focus. This is recorded explicitly rather than treating the browser-chrome transition as a website focus-trap failure. |
| JavaScript disabled: home, download, setup guide | All three expose substantial main content and working ordinary links. The homepage download CTA navigates to `/download`; the download page exposes the direct release ZIP link. The archive itself was not downloaded. Raw main HTML was also confirmed on all six pages by the HTTP checks. |
| Console and hydration | **No console errors or unhandled page errors** were observed during the exercised page loads/interactions. |
| Requests | **No failed requests** and **no Google Analytics/Google Tag Manager requests** were observed in the fresh default state. This verifies the current tracking-off state, not a future GA4 configuration, opt-in payloads, or delivery to an analytics property. |
| Visual inspection | Home and download-page captures were inspected at desktop and mobile sizes, plus the mobile download dialog and mobile hero at readable viewport scale. No clipping or overlap requiring a fix was found in those captures. |

The initial harness stopped because it looked up the menu button by its old accessible name after opening. A continuation also read React state before its update had completed. The final continuation used Playwright's awaited assertions and completed the unfinished mobile/no-JavaScript checks. Those were harness failures, not hidden product fixes: the raw files retain both the interrupted runs and final results. Successful six-page desktop layout checks were not repeated.

## Performance and remaining evidence boundaries

The public PageSpeed API returned **429 daily quota exceeded** on the first request; further API requests were stopped. [pagespeed-insights.json](evidence/pagespeed-insights.json) records that limitation. The main task subsequently used the official PageSpeed web interface successfully; its home/download/setup reports and schema-tool results are recorded separately in [performance-and-schema.md](performance-and-schema.md).

The browser evidence contains unthrottled local timing samples. Those samples are not PageSpeed scores or a representative real-user Core Web Vitals dataset. No field INP or long-term performance outcome is claimed here.

This scope did not establish Search Console/Bing ownership, analytics account configuration, sitemap receipt inside those accounts, completed indexing, search performance, screen-reader support, every accessibility requirement, physical-device rendering, or every historic preview's access protection. Those account, official-tool, and post-launch tasks must retain their own evidence and status.

## Visual evidence

- [Desktop home](evidence/1440-home.png)
- [Desktop download](evidence/1440-download.png)
- [Mobile home, full page](evidence/390-home.png)
- [Mobile home, viewport and keyboard focus](evidence/390-home-viewport.png)
- [Mobile download](evidence/390-download.png)
- [Mobile download dialog](evidence/390-download-dialog.png)

These screenshots are observations from this acceptance run, not automatically accepted visual-regression baselines.
