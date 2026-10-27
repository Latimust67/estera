# Keyword and comparison correction — October 27, 2026

Status: content implemented; `npm run build` passed on October 27 and generated seven public pages plus a 404. Published to `https://estera-virid.vercel.app` from commit `5cf60ce5b9925208b2d9cf3d1907a608cfc9f031`; Vercel deployment `dpl_7XKJdFSycwLuPchKErxRVRwL6wq4` is READY in production. IndexNow received the four changed/new canonical URLs once with HTTP 200. See [publication receipt](evidence/keyword-correction-deployment.json). Receipt is not indexing confirmation. No visual QA or broad test suite was run. This is a targeted correction, not a declaration that rankings, hardware validation, Analytics reporting, or every launch follow-up is complete.

## Evidence and prioritization

The original October 20 plan did include keyword and search-intent research. It did not establish quantitative demand. Calling it either “no keyword work” or a fully validated demand strategy would be inaccurate.

On October 27, the existing authorized Bing Webmaster Tools Keyword Research report was inspected with country, language, and device set to All and duration 3 M. [Recorded evidence](evidence/keyword-research-2026-10-27.json) preserves the displayed values and missing-data states. These are Bing-wide research impressions, not Estera traffic, Google volumes, monthly volumes, or stable rankings. Exact calendar boundaries were not shown in the observed report.

| Observed phrase | Bing research impressions, displayed | Decision |
| --- | --- | --- |
| location changer | 1.8K | Use this familiar category prominently, qualified by iPhone, Mac, free, and preview to reflect the actual product. The qualified phrase's own volume is unmeasured. |
| location spoofer | 1.3K | Explain this synonym once in the setup/FAQ vocabulary, with coordinate/IP distinctions. No duplicate landing page. |
| location changer iphone | 49 | Directly relevant phone-specific wording, with a small observed sample. |
| how to change location on iphone | 214 | Align the existing setup guide with this task, specifically scoped to Estera's Mac/USB workflow and unverified physical-device behavior. |
| imyfone anyto | 5.2K | Confirms branded comparison context; not permission to target competitor navigation deceptively. AnyTo is one clearly labeled comparison subject. |

All three seed phrases—`iphone location changer`, `iphone location simulator`, and `best location changing apps`—had insufficient data for their own trend. The simulator and best-app seeds had no related rows. This does not mean zero demand, and it cannot establish a numerical demand ratio between the exact seeds. Simulator results also included Xcode simulated-device questions. Best-app results mostly served product comparison. These are intent observations, not proof that changing copy will improve ranking.

Search Console's three generic site queries and Bing's one branded impression from the October 27 account report recorded locally in `evidence/day-7-account-checks.json` are too sparse to establish a target-keyword baseline. Five Google pages were still discovered but unindexed. No claim is made that keyword selection alone caused low visibility.

## Implemented page decisions

| Page | Reader task and changes | Basis |
| --- | --- | --- |
| `/` | Identify a free iPhone location changer for Mac; update title, description, category line, first-view copy, and explanatory FAQ. Preserve preview/device limits. | Related Bing terms plus product fit; exact long-tail demand remains unmeasured. |
| `/download` | Obtain Estera, inspect prerequisites, and understand what is free; align metadata and link to comparison. | Distinct acquisition task; not a duplicate keyword page. |
| `/guides/iphone-location-simulation` | Learn how to change iPhone location with Estera; update title, heading, description, and synonym explanation without changing the URL. | Observed how-to query; existing factual workflow. |
| `/guides/compare-iphone-location-changers` | Compare four relevant Mac/iPhone tools using cost, setup, source, routes, and evidence limits. | User's explicit comparison goal and observed comparison intent. No unsupported “best” winner or testing claims. |

The comparison is discoverable through the homepage directory, download page, guide footer, related links, and generated sitemap. Existing route paths remain unchanged. Page dates change only where content changed. Route/GPX, privacy, and compatibility content is otherwise retained.

## Copy brief and proof requirements

Audience: an iPhone owner with a Mac comparing free tools and commercial trials. Main uncertainty: what “free” includes, whether their hardware fits, whether a computer/cable is required, and whether pins/routes/reset have actual evidence. Primary action: inspect requirements and download a suitable preview. Comparison is an inner informational route, so it begins with selection criteria rather than a second homepage pitch. Recurring language: location changer, Mac, iPhone, USB, pins, routes, free preview.

An independent research worker checked official sources only on October 27; it did not perform a quality rating or hardware tests. Current LocationSimulator2 must not inherit the open-source license or requirements of the legacy LocationSimulator app. Mirage's reviewed sources do not establish GPX support; absence of documentation is not proof that a feature is absent. AnyTo's free download is a limited trial, with paid plan conditions. No prices, competitor reliability rankings, universal compatibility, or undetectability claims were added.

Sources: [Mirage](https://elliotpadfield.github.io/mirage-landing/) and [repository](https://github.com/ElliotPadfield/mirage); [LocationSimulator2 overview](https://locationsimulator.net/), [downloads](https://locationsimulator.net/downloads/), [control-app repository](https://github.com/Schlaubischlump/LocationSimulator2), [helper repository](https://github.com/Schlaubischlump/LocationSpoofer-App); [AnyTo](https://www.imyfone.com/location-changer/), [purchase terms](https://www.imyfone.com/location-changer/purchase/), [desktop guide](https://www.imyfone.com/location-changer/guide/). Estera claims come from its release documentation and existing compatibility/download pages.

## Remaining limits and follow-up

- Google keyword volumes and a country-specific demand estimate are unavailable; no Google Ads account, paid tool, or property was created to obtain them.
- Do not describe the new page as indexed until a search-engine report confirms it. Publication and indexing are separate.
- The existing November 3 checkpoint should record query/page impressions and indexing with October 27 marked as the content-change date. The short, sparse post-change window cannot prove causality or stable rankings.
- Physical-device evidence, Analytics report receipt/filter validation, and the missing Bing sitemap receipt remain tracked separately. This content correction does not close them.
- No broad tests, visual QA, artificial Analytics traffic, account-configuration changes, or hardware claims belong to this correction.
