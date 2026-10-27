# Keyword measurement hypothesis and next priorities

Recorded October 27, 2026 after independent review. This plan does not claim validated market demand or improved rankings.

## Audience and market assumption

Primary audience: English-reading iPhone owners with an Apple Silicon Mac on macOS 15+, able to use USB and developer-service setup, who accept a preview for authorized location testing or route simulation. The site is globally accessible. Start with the United States as a **provisional reporting cohort**, consistent with the site's en-US presentation; this is a working measurement choice, not evidence that the owner selected the US as the exclusive market or that US demand was validated. Keep other countries separate so an aggregate shift does not masquerade as US improvement. Country alone cannot establish a visitor's device eligibility or intent.

## Hypothesis and page mapping

Hypothesis: describing Estera as an iPhone location changer, while explaining its simulation mechanism and limits, makes the offer clearer to relevant searchers than relying on simulator wording alone. A sourced comparison serves a distinct selection task. Both are testable propositions, not demonstrated ranking opportunities.

| Task/query family | Destination | Relevant signal |
| --- | --- | --- |
| Free iPhone location changer for Mac; iPhone location simulator on Mac | `/` | Relevant non-branded impressions and clicks reaching the product overview |
| Estera download; Mac location-changer download | `/download` | Acquisition-intent clicks; branded and non-branded searches reported separately |
| How to change iPhone location from Mac; USB location setup; location changer versus VPN | `/guides/iphone-location-simulation` | Queries matching the documented setup/explanation task |
| Compare iPhone location changers; free Mac alternatives; best location-changing apps for iPhone | `/guides/compare-iphone-location-changers` | Queries showing choice/comparison intent, then available aggregate onward/download-click evidence |

Do not count generic `site:vercel.app` discovery queries as target-keyword success. Separate competitor-brand navigation from comparisons. Do not insist that an exact phrase must appear; assess the whole query's task and product fit. Search Console can omit queries for privacy, so visible rows are not an exhaustive demand census.

## Measurement and decision rules

Owner: site maintainer, with the existing authorized Search Console/Bing access. The October 27 account report is the baseline, but its tiny generic/branded sample cannot establish a reliable pre-change rate. Retain the current titles and seven-page structure unless a factual error or technical blocker requires repair.

- **November 3:** observe indexing/discovery, relevant query examples, impressions and clicks for the mapped pages. Include the new comparison URL. This is an early diagnostic checkpoint, not a win/loss decision.
- **A later substantive assessment:** use at least 28 fully reported post-publication days and compare like-for-like country, search type, and device groups where available. A time window alone does not create enough evidence. Keep an inconclusive result if relevant queries/clicks remain too sparse; do not schedule daily title rewrites.
- **Evidence supporting the hypothesis:** relevant non-branded queries actually reach the intended pages, with repeated impressions and clicks rather than a lone appearance. Report the raw counts, dates, query mix, and country/device context. New visibility is an observation, not proof that the title change alone caused it.
- **Evidence suggesting a change:** repeated irrelevant query intent, a mismatch between query and destination, or a documented user question that the current page fails to answer. Make the smallest supported content correction. If URLs remain unindexed, investigate discovery/canonical/processing evidence before treating wording as the cause.
- **Action signal:** once reporting is validated, use consented aggregate Mac-download clicks as intent, not completed downloads, installations, or phone success. Do not divide partial consented Analytics counts by all Search Console visitors and label it a conversion rate. Missing Analytics data makes this signal unavailable, not zero.
- **Google volumes:** unavailable. Bing's all-market research figures are contextual evidence only; do not use them as Google or US forecasts.

## Priority 1: close the existing measurement diagnostic gap

Owner: site maintainer using the already approved Estera property. This is open diagnostic work, not completed measurement acceptance. Inputs: `analytics-acceptance.md`, the October 20 collection receipts, and `evidence/day-7-account-checks.json`.

At the next authorized diagnostic session, reconcile the saved collection measurement ID and hostname with the existing property/stream, inspect the relevant date range and report filters, and check whether the recorded events are excluded or simply absent from reporting. Record the actual cause if established. If it remains unresolved, record the precise missing evidence and escalate through the owner's existing provider support path only if separately authorized to communicate. Do not invent a normal-processing explanation, create another property, generate traffic repeatedly, or activate the hostname filter without a validation sample. A confirmed report row must still be labeled acceptance traffic or genuine traffic according to its evidence.

## Priority 2: obtain original product proof

Owner: project owner/hardware tester, because the evidence requires an available, consented physical Mac/iPhone setup. No suitable device session has been established in this review. Document the exact OS versions, installation result, selected phone, pin behavior, route behavior, and reset result, including failures and any app-specific scope. Keep the preview qualification until that evidence exists. Software build success cannot close this item.

## Priority 3: resolve remaining search-service receipt gaps

Owner: site maintainer/project owner. The missing Bing sitemap receipt remains open in `account-setup.md`. IndexNow acknowledgment is separate and does not resolve that record. The heartbeat's October 21-only submission authorization must not be silently extended by a read-only scheduled run. Do not repeatedly submit unchanged pages.

No new generic synonym landing pages, paid keyword accounts, reviewer loops, or automated changes are created by this plan. Follow-up dates describe evaluation windows; they do not create additional automations.
