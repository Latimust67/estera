# Fresh-review fixes

Recorded October 20, 2026. The fresh independent review initially scored **8.4/10** and found two actionable gaps. Its original findings are retained in [fresh-independent-review.md](fresh-independent-review.md).

The focused independent reassessment scored the corrected implementation **8.8/10**, above the requested 8.5 threshold. The original score and remaining external observations stay visible in the review report.

## Consent withdrawal

`src/analytics.tsx` now uses shared revocation logic. Existing active documents listen for consent storage changes, removal and clear; resumed documents reconcile the saved choice through page-show and visibility events. Each affected document disables Google collection, clears GA cookies and reloads to unload the library. Another document granting consent does not automatically start this document's tag.

The local denial path disables collection **before** saving. If the browser rejects the storage write, the current document remains disabled and is not reloaded into the old granted preference. The control explicitly reports that it could not save the browser-wide choice and advises clearing site storage before navigating. Other documents cannot receive a storage-change notification when that write failed; no successful browser-wide persistence is claimed in that error state. Privacy copy matches the behavior.

Focused check: `node --test scripts/test-analytics-consent.mjs` — **5 passed, 0 failed**. It executes the real source module using the installed Vite/Rolldown compiler, with browser storage, event, cookie and reload boundaries stubbed. Cases cover two already-active documents, preference removal/clear, resume after a missed notification, failed denial saving, and no automatic activation from another document's grant. It asserts Google’s disable flag, GA-cookie removal, custom-event suppression and the appropriate reload behavior. No network, browser, server or Google test traffic is involved; this is not a live-browser certification.

The initial harness attempted an API that the installed TypeScript package did not expose; it was corrected to reuse the existing Rolldown compiler, after which all five cases passed. No dependency was added. The production deployment subsequently passed its type-check, client/server builds and static prerender.

## Provider hostname filter

The prior assumption that GA4 lacked an Include hostname filter was outdated. The feature was confirmed in [Google's current filter instructions](https://support.google.com/analytics/answer/16608575?hl=en) and the account UI. The new filter **Estera production hostname** is Include only, exact hostname `estera-virid.vercel.app`, state **Testing**. The provider confirmed creation and its saved table shows Testing. [Screenshot](evidence/google-analytics-hostname-filter-testing.png).

Testing does not discard incoming data. Validate the matching canonical data after the recommended 24–36 hours before activating the permanent processing filter. Activation, measurement-report visibility, CLS/INP delivery, indexing and dated follow-ups remain unverified; their statuses were not upgraded to force a passing score.

The existing bounded follow-up now includes hostname-filter validation on October 23. It reports evidence/readiness and does not activate an unvalidated filter.

## Publication after review

The reviewer inspected the clean replacement filter screenshot and closed its publication concern before commit. Source and evidence were pushed in commit `3ffb38f44e0e655bdd49a0016487b89b25abd0d6`. Vercel production deployment `dpl_69KvPXcnDujaAmUoqDVVTrCyFXUG` reached **READY** with canonical alias `estera-virid.vercel.app` and no alias error. The recorded build took approximately six seconds. [Deployment receipt](evidence/fresh-review-deployment.json).

One IndexNow notification for the changed privacy page returned **HTTP 200** after publication. This is a submission receipt, not proof of indexing. No additional browser acceptance or broad test pass is claimed. The independent report's pre-deployment statements describe the review-time state; this section records the subsequent publication without changing the reviewer's score or outstanding observations.
