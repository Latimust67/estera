# Fresh independent SEO review

Reviewed **October 20, 2026**. Source/documentation revision: `60a610d60367c47dcd94128ac63ac0a1d7ba5961`. Recorded production code: `1dc597b69f47bae554047e47ec95373e804750cb`, READY deployment `dpl_4FcH59LE5XynhL367KvN1jEEpsDN`, canonical origin `https://estera-virid.vercel.app`.

The initial assessment below is retained. A focused reassessment of subsequent working-tree corrections appears at the end of this report; its implementation score is **8.8/10**, with publication and observation limits stated explicitly.

## Initial decision and score

**8.4/10. The requested 8.5 threshold is not yet justified.** The technical SEO and factual content are strong. Two actionable implementation/package gaps remain: browser-wide analytics withdrawal is not enforced in already-open tabs, and the package's provider-side hostname filter is absent. Measurement also has an honestly documented acceptance boundary: specific hits reached Google's collector, but provider reporting and CLS/INP delivery are unconfirmed.

This is a score for the implemented SEO package and the quality/completeness of its supporting evidence. It is not a ranking forecast, a claim that all six pages are indexed, a legal privacy certification, or a score for the underlying desktop app's hardware compatibility.

| Category | Weight | Score | Basis |
| --- | ---: | ---: | --- |
| Technical SEO and page architecture | 25% | 9.0 | Static primary content, consistent canonicals and sitemap, ordinary internal links, actual 404 behavior, preferred URL redirects, restrained structured data, and dated live evidence. No material crawlability defect found in reviewed source. |
| Search intent, factual copy, and usefulness | 25% | 9.0 | Distinct visitor tasks across six pages; concrete download/setup/route information; release-linked sources; clear limitations and no invented rankings, testimonials, or hardware results. |
| Measurement and privacy implementation | 25% | 7.0 | Sound opt-in and custom-payload design with a real ZIP-click receipt, but withdrawal has an unhandled multi-tab case and a storage-error path; provider reporting is not established. |
| Evidence quality and reporting honesty | 15% | 9.0 | Source, HTTP, browser, lab, account, collection receipt, and processing states are mostly separated carefully. Raw sanitized records retain interruptions and unconfirmed requests. The successful withdrawal claim needs to remain explicitly scoped to the exercised single-tab path. |
| Applicable package coverage and operations | 10% | 8.0 | Broad checklist coverage and a dated operating plan; legitimate exclusions for local business, translations, sales forms, and unobservable download completion. Provider-side hostname filtering remains an applicable missing item. |

Weighted score: **8.40**. Unelapsed launch checkpoints and ordinary indexing delays are not treated as implementation failures.

## Scope and method

This reviewer did not read `independent-final-review.md` or reuse its scores. Reviewed the requested SEO skill, launch checklist, and relevant guide source; current website source/configuration; page plan, redirect map, change log, account setup, search strategy, analytics acceptance, live acceptance, and performance/schema reports; selected raw HTTP, generated-HTML, deployment, and analytics evidence. Spot-checked current release documentation supporting OS/architecture, USB, GPL, route/GPX, privacy, signing, and unverified-hardware claims.

Opened existing local screenshots for the Analytics stream, retention settings, and Google sitemap receipt. These are saved observations, not new account checks. A source diff confirms the changes from recorded production code `1dc597b` to review HEAD `60a610d` are documentation/evidence changes. Public official Google documentation was read narrowly to confirm automatic analytics events and hostname-filter availability. No browser/app/server was launched, no build or test suite was rerun, no test traffic was generated, no account was mutated, and no product source was edited.

Historical authorization comes from the root task's supplied human-authorization context and the account report; this independent review did not replay the original consent conversations. It does not independently certify every historical account action. The saved retention screenshot supports the report's distinction between two-month event retention and fourteen-month user retention.

## Actionable findings

### 1. P2 — Apply analytics withdrawal to every already-open tab, and fail closed if saving the choice fails

**Source:** `website/src/analytics.tsx:20`, `:26`, `:55`, `:79`, and `:100–122`; user-facing browser-wide choice at `:127` and withdrawal promise in `website/src/content.tsx:166`.

Consent is persisted in shared `localStorage`, but the Google tag, `active` flag, and `ga-disable-*` flag are per document. `choose(false)` disables and reloads only its own tab. There is no `storage` listener or resume/focus reconciliation in the module. With two opted-in Estera tabs open, withdrawing in the privacy tab leaves the other document's Google tag loaded with its previous granted state. Custom events call `optedIn()` again, which helps, but that gate does not control the tag's own automatic activity. Google's documentation identifies `user_engagement` as an automatically collected web event, separately from Enhanced Measurement-dependent events. Turning Enhanced Measurement off therefore does not establish cross-tab withdrawal. [Google automatic-event documentation](https://support.google.com/analytics/answer/9234069?hl=en).

There is a second edge in the same withdrawal path: `localStorage.setItem` is attempted before disabling collection. If it throws, lines 101–104 return with an “Analytics remain off” message even when this document was already active. This branch does not run the disabling or cookie-clearing code.

**Fix:** Centralize revocation and run it in every active document when the persisted choice changes away from granted, including removal/clear. Reconcile resumed documents as needed. Stop collection before attempting to persist a denial; a storage error must not retain the current document's active tag or claim success inaccurately. Preserve the existing default-off behavior and avoid automatically starting analytics in a different tab merely because another tab opted in.

**Focused acceptance:** Two already-open, opted-in documents; withdraw in one; confirm both stop the tag's collection and cannot recreate analytics cookies. Also exercise failed preference persistence after activation. The existing saved acceptance in `website/docs/seo/analytics-acceptance.md:20` and `evidence/analytics-acceptance.json:39–45` covers withdrawal followed by navigation/refresh, not these cases. This is a source-derived defect, not a claim that post-withdrawal traffic was observed in the saved run.

### 2. P2 — Complete the package's provider-side hostname filter, using its testing state first

**Evidence:** `website/docs/seo/account-setup.md:36` explicitly says no provider-side hostname filter is claimed. `website/src/analytics.tsx:26–28` and `:55–57` enforce this site's canonical origin in its own browser code. Guide 10 of the requested package separately calls for an Include hostname filter.

The client gate prevents this implementation from collecting on its own unintended origins. It does not give the Analytics property an allowlist for other tag senders. Google's current release notes document hostname Include filters, so treating the feature as unavailable would be incorrect. The notes also disclose limits, including Measurement Protocol events being outside these filters. [Google Analytics release notes](https://support.google.com/analytics/answer/9164320?hl=en).

**Fix:** Resolve the authorized property's Include-only hostname filter for the exact production hostname, first in the provider's testing state. Record the filter name, match, state, and narrow evidence that legitimate canonical traffic is retained before activation. Do not activate an untested permanent data-discarding filter merely to improve this grade. If the required account UI/capability is unavailable, record the precise blocker and keep this package item incomplete; do not describe the client gate as equivalent. The root task independently supplied the official filter/testing guidance: [hostname data filters](https://support.google.com/analytics/answer/16608575?hl=en) and [data filters](https://support.google.com/analytics/answer/13296761?hl=en).

## Outstanding observations, not established source defects

- **Analytics reporting:** `evidence/analytics-acceptance.json:276–284` records eight observed events, seven with recorded HTTP 204, six aborted collection requests, and reporting/CLS/INP verification all false. `analytics-acceptance.md:35–37` explicitly records empty Realtime. Keep the already-scheduled aggregate check; a 204 alone does not close reporting acceptance. Neither a delivery defect nor normal processing delay is conclusively established by this record. LCP delivery is established only for the exercised acceptance browser, not a representative visitor population.
- **Bing receipt:** `account-setup.md:23` records a server-side submission error after ownership verification. This remains an external receipt gap, separate from the implemented, reachable sitemap and acknowledged IndexNow submission. Use the bounded follow-up already documented; do not repeatedly submit unchanged URLs.
- **Google indexing and future launch checks:** `account-setup.md:11–17` distinguishes live fetch/indexability from “Discovered — currently not indexed” and processing reports. `launch-checklist.md:85–92` schedules later observations rather than claiming they already passed. Future observations and selected canonicals cannot be manufactured today.
- **Field performance:** The dated official lab baselines are useful and explicitly predate analytics activation. They do not establish consented-script overhead or field percentiles. No broad performance rework is warranted from this evidence alone.
- **Other crawler access:** `launch-checklist.md:73` remains partial for provider firewall/crawler inventory. Successful Google smartphone fetches and allow-all robots rules do not establish every AI crawler's access. No evidence supports weakening protection as a remedy.

## Strengths retained in the judgment

The build renderer supplies full useful content and metadata from a small maintained set of page records (`entry-server.tsx:9–34`, `prerender.mjs:15–51`). Raw live evidence supports the six preferred 200 URLs, redirects, sitemap, robots, assets, and genuine 404. The site avoids unsupported rich-result promises and fabricated software ratings. The download and compatibility pages keep ad-hoc signing, clean-machine uncertainty, and unverified physical set/reset visible near decisions (`content.tsx:29–48`, `:129–149`). The routes guide describes operational limits rather than selling a generic keyword page. The research report distinguishes an observed result mix and vendors' published claims from hands-on comparison evidence.

The absence of a fabricated download-completion key event is appropriate: the site can observe a ZIP-link click, not successful installation or a physical-device outcome. The opt-in defaults, canonical URL stripping, origin-only referrers, restricted custom fields, and explicit advertising restrictions are valuable controls. Findings above are specific gaps in that implementation, not a reason to discard those safeguards or inflate the scope.

## Reassessment boundary

Reassess the two actionable findings after their precise source/account changes and targeted evidence. The initial **8.4** should not be silently replaced by a target score. Provider reporting, indexing, and future checkpoints must retain their actual observed status even if the implementation grade improves. No ranking, traffic, rich-result, or AI-citation guarantee is justified.

## Focused reassessment of the corrections

Reassessed October 20, 2026, against the subsequent working-tree changes. **8.8/10 for the reviewed implementation revision; the 8.5 threshold is now justified for that revision.** This does not change the original production-code assessment, certify a deployment that has not yet occurred, or close provider reporting and future observations. At this reassessment, production remains on `1dc597b`; the root task still needs to publish the reviewed correction. The evidence-image privacy issue was resolved and independently confirmed below. No remaining source or evidence-publication blocker was found within this focused scope.

| Category | Weight | Revised score | Change in judgment |
| --- | ---: | ---: | --- |
| Technical SEO and page architecture | 25% | 9.0 | Unchanged; the focused correction does not alter crawlability architecture. |
| Search intent, factual copy, and usefulness | 25% | 9.0 | Unchanged; privacy copy now describes the corrected behavior and its storage-error limitation. |
| Measurement and privacy implementation | 25% | 8.5 | The source-derived withdrawal defect is addressed with centralized revocation, cross-document handling, resume reconciliation, and denial-before-persistence. Provider-visible measurement remains incomplete. |
| Evidence quality and reporting honesty | 15% | 9.0 | Offline test coverage is described as offline, prior live coverage is not retroactively expanded, and Testing is not called active filtering. The replacement screenshot was independently inspected and no longer exposes the personal account tooltip. |
| Applicable package coverage and operations | 10% | 8.5 | The missing hostname-filter item is now configured in Testing with a dated validation follow-up. Validation and activation remain partial rather than being prematurely marked complete. |

Weighted score: **8.825**, reported as **8.8**. The score improvement comes from the concrete fixes and honest staged filter setup, not from assuming external processing has finished.

### Finding 1 — Addressed in reviewed source; focused offline regression evidence accepted

`website/src/analytics.tsx:23–35` centralizes the disable flag and cookie clearing. Lines 96–106 apply withdrawal on relevant storage changes, key removal, storage clear, page-show, and return to visibility. Lines 130–142 disable the current document before saving denial; if saving fails, the code avoids a reload into stale granted storage and explains that only the current tab has been disabled. Other documents granting consent do not automatically activate this document. `website/src/content.tsx:166` reflects those limits. No additional material defect was found in this focused source reassessment.

Reviewed `website/scripts/test-analytics-consent.mjs`, which executes the actual analytics module through the installed compiler with browser boundaries stubbed. Its five cases cover two active documents, removal/clear, resumed documents, denied persistence, and absence of cross-tab grant activation. Assertions check the disable flag, GA-cookie clearing, custom-event suppression, and reload decision. The root task reports **5 passed, 0 failed**, also recorded in `review-fixes.md:11`; this reviewer did not rerun them. The initially incompatible compiler harness and subsequent correction are disclosed. This is useful regression evidence, not real-browser event-loop, network, automatic-Google-event, or live multi-tab certification.

The original single-tab production acceptance remains valid only for its exercised scope. `analytics-acceptance.md:39–41` now explicitly prevents treating it as evidence for the newly fixed cases. If storage refuses the saved denial, other tabs cannot receive a successful storage change; the new UI acknowledges that limitation rather than pretending the browser-wide choice was persisted.

### Finding 2 — Configuration omission addressed; validation and activation still partial

The original saved Analytics table image visibly identified the Estera account/property and the filter **Estera production hostname**, type **Web Hostname Traffic**, operation **Include**, state **Testing**. Its clean replacement shows the filter details: **Include only**, **exactly matches**, hostname **estera-virid.vercel.app**, and **Testing** selected, with Save disabled. This reviewer independently inspected that local image, which now directly supports the exact criteria recorded in `account-setup.md:36` / `review-fixes.md:17`. This reviewer did not inspect the live account.

Moving this filter to Testing is an appropriate correction. It establishes setup without asserting active enforcement or discarding unvalidated data. The recorded October 23 follow-up should validate matching canonical traffic before any activation. The source origin gate remains a separate control. Measurement Protocol exclusions, provider reporting, and the unconfirmed CLS/INP observations retain their stated limits.

### Additional pre-publication evidence issue — resolved

The first version of `evidence/google-analytics-hostname-filter-testing.png` contained an account tooltip exposing personal account details. This reviewer notified the root task immediately. The root replaced it at the same path with a clean direct capture before publishing. A second, image-only inspection confirmed that the tooltip and personal name/email are absent while the filter name, exact hostname criteria, and Testing state remain visible. **The evidence-image publication blocker is closed.** The first unsafe capture must not be restored or published.

### Remaining limits

No new test, browser, network, or account action was performed by this reviewer during reassessment. The production build/deployment of these corrections remains the root task's next step, and no live acceptance of the new revision is claimed. The filter is not active; aggregate GA reporting, CLS/INP delivery, Bing sitemap receipt, actual indexing, field performance, crawler inventory, and future launch checkpoints remain as previously documented. This scoped score does not imply those observations passed.
