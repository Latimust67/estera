# SEO audit provenance

`seo-audit.mjs` is an unchanged copy of Larsen's SEO Implementation Package v2.1 audit, from `kit/audit/seo-audit.mjs`, copied on 2026-10-20 at the owner's explicit request to apply that package. It uses Node built-ins and installs no dependencies. Keep package-specific comments and behavior when updating it.

The site wrapper in `../audit.mjs` audits saved HTML and checks the route manifest, internal links, canonical URLs, and generated assets. Run it explicitly after a build with `npm run seo:audit`. It cannot establish Google's indexing, deployed status codes, rich-result eligibility, or browser performance.
