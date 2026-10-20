# Official performance and schema checks

Recorded October 20, 2026, approximately 3:32 PM PDT, against production commit `fbcf20585cb0d0527c86688c5290ab5e0747e55f`. These are a dated baseline, not a guarantee for every device, future release, or search ranking.

## PageSpeed Insights

The unauthenticated API returned HTTP 429 (shared consumer-project quota). The official browser interface successfully produced the following reports; the API error does not invalidate these completed browser reports.

| Page / report | Device | Performance | Accessibility | Best Practices | Basic SEO | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| [Home](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app/oyedz639ur?form_factor=mobile) | Mobile | 97 | 100 | 100 | 100 | 1.5 s | 2.1 s | 0 ms | 0 | 3.9 s |
| [Home](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app/oyedz639ur?form_factor=desktop) | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 ms | 0 | 0.5 s |
| [Download](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app-download/o6sj6x2ei1?form_factor=mobile) | Mobile | 100 | 100 | 100 | 100 | 1.2 s | 1.2 s | 0 ms | 0 | 1.2 s |
| [Download](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app-download/o6sj6x2ei1?form_factor=desktop) | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 ms | 0 | 0.3 s |
| [First-session guide](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app-guides-iphone-location-simulation/jqk9e0e3q4?form_factor=mobile) | Mobile | 100 | 100 | 100 | 100 | 1.2 s | 1.2 s | 0 ms | 0 | 1.2 s |
| [First-session guide](https://pagespeed.web.dev/analysis/https-estera-virid-vercel-app-guides-iphone-location-simulation/jqk9e0e3q4?form_factor=desktop) | Desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.2 s | 0 ms | 0 | 0.2 s |

Lighthouse 13.5.0, HeadlessChromium 153.0.8010.36. Mobile emulated Moto G Power with Slow 4G throttling; desktop used the service's desktop/custom-throttling profile. Each is a single initial-page-load lab observation. All three reports show **No Data** in the real-user section. No INP or field Core Web Vitals pass is claimed. A 100 basic SEO score covers only Lighthouse's limited checks.

The service suggests render-blocking CSS and unused-JavaScript opportunities. Current lab results do not justify removing the stylesheet that makes the server-rendered page readable, or a broad optimization loop. Revisit with field evidence. Optional consented field measurement remains dependent on analytics account setup.

## Structured data

The live acceptance checks parsed each page's JSON-LD and confirmed the intended types and canonical URLs. Google's Rich Results Test was attempted for `/download` using its smartphone agent. It returned **Something went wrong** and **Could not connect to the reCAPTCHA service**, without a validation report. This is an external tool failure, not a schema pass or a finding that the website blocks Google. No CAPTCHA was solved or bypassed.

The verified Search Console property subsequently provided official live validation: home, download and first-session guide were available to Google and could be indexed. Download and guide each reported **Breadcrumbs: 1 valid item detected**. This establishes representative Google markup acceptance despite the standalone Rich Results Test failure. The same schema renderer supplies the remaining inner pages; no rich-result display or indexing is guaranteed. See [account-setup.md](account-setup.md) and its screenshots.
