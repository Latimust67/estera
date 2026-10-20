# Live analytics acceptance

Checked **October 20, 2026 (America/Los_Angeles)** on `https://estera-virid.vercel.app`, production deployment `dpl_4FcH59LE5XynhL367KvN1jEEpsDN`, commit `1dc597b69f47bae554047e47ec95373e804750cb`. The configured measurement ID was `G-HL1L7MX0B5`.

**Consent, the single download-click event, payload redaction, and withdrawal passed the exercised browser checks.** Google's collection endpoint returned HTTP 204 for the real download-click event and an LCP event. GA Realtime reporting, CLS delivery, and INP delivery are not yet verified.

Evidence: [analytics-acceptance.json](evidence/analytics-acceptance.json). It retains only event names/counts, canonical page paths, redaction checks, numeric metric values, and receipt statuses. It contains no raw collect URLs/bodies, cookie values, client IDs, session IDs, or metric-instance ID values.

| Scenario | Observed result |
| --- | --- |
| Fresh unauthenticated browser, before consent | No Google tag script or analytics event request observed. |
| Explicit “Allow analytics” choice | The privacy page produced one `page_view`, accepted with HTTP 204. The page was intentionally visited with a synthetic query/fragment and a synthetic referrer path to exercise redaction. |
| Known page views | Observed six `page_view` events across the original and continuation sessions for `/privacy`, `/`, and `/download`. Five have a recorded HTTP 204; one continuation consent page view has no recorded response receipt. The download-page refresh added one page view. The setup guide was visited, but its delivery was not established in this bounded run. |
| Open/cancel the download dialog and change the displayed destination | No `download_click`. |
| Load and refresh the download page without clicking its ZIP link | No `download_click`. |
| Click the actual release ZIP link once | Exactly **one `download_click`**, with `release_version=0.1.2`, `platform=macos-arm64`, and canonical `/download` page location. Its request returned **HTTP 204**. The outgoing GitHub archive transfer was deliberately aborted after the real link click; this does not establish a completed download or installation. |
| Subsequent unrelated internal navigation | No additional `download_click`. |
| Enhanced Measurement duplication | No `file_download`, automatic outbound `click`, `scroll`, form, site-search, or video events observed. This agrees with the main task's separately confirmed Enhanced Measurement setting being off. |
| Payload locations and custom fields | All eight observed events targeted the expected measurement ID and known canonical page paths, with no query string or fragment. Referrers were empty or origin-only. Neither synthetic query/referrer marker appeared. Only the expected release/platform or metric custom parameters appeared; no phone, route, or free-text custom fields were observed. This is a custom-payload check, not a claim that Google receives no normal browser/network information. |
| “Keep analytics off” after opting in | The page reloaded without the analytics library; GA cookies were cleared. Subsequent navigation and refresh produced **zero additional observed analytics events or Google tag script requests**. |
| JavaScript execution | No unhandled page errors or console errors observed. |

## Web Vitals and transport limits

One genuine browser-generated **LCP event of 192 milliseconds** was observed on the download page and accepted in the same HTTP 204 request as the download click. Its metric value, delta, event value, and metric-instance identifier were present; the identifier value was not retained.

**No CLS or INP events were observed.** No metrics were synthesized and no extra interactions or traffic were generated to force them. The run therefore verifies LCP delivery only; it does not establish CLS/INP delivery or representative real-user Core Web Vitals performance.

Six Google Analytics requests reported `net::ERR_ABORTED` during the navigation/lifecycle sequence. Their sanitized endpoint/error records are retained. The evidence does not establish delivery of every page-lifecycle request. Accepted HTTP 204 hits and unconfirmed/cancelled requests are deliberately distinguished; no claim of lossless analytics delivery is made.

The first harness stopped after two accepted page views because “Tokyo” matched two different controls. The selector was scoped to the existing destination group, and only unfinished scenarios continued. The first run's checks, accepted hits, and interruption remain in the same evidence file. A fresh, non-persisted browser context required explicitly opting in again as a prerequisite; successful initial checks were not rerun. One isolated browser ran at a time, using the installed Chromium headless shell and Mac Metal GPU flags. All browsers were closed. No software was installed and no account UI was accessed by this worker.

## Provider reporting remains pending

The main task inspected the correct Estera GA property after collection was sent. Realtime still showed **0 active users** and **“No data available”** after bounded observation and one refresh; see [google-analytics-realtime-pending.png](evidence/google-analytics-realtime-pending.png). No more test traffic or dashboard polling was performed to force a result.

HTTP 204 establishes endpoint receipt, not successful processing or appearance in Realtime, DebugView, aggregate reports, or key-event reports. The main task added an aggregate-report check to the next-day monitoring follow-up. Provider-visible processing, plus genuine CLS/INP delivery when available, remain the outstanding measurement evidence.

## Follow-up source regression: cross-tab withdrawal

The fresh review identified scenarios absent from the live run above: other already-open documents and failed preference writes. The correction and five passing offline source-regression cases are recorded in [review-fixes.md](review-fixes.md). The original single-tab live result must not be treated as cross-tab browser evidence. No additional Google traffic or browser run was performed for this correction.
