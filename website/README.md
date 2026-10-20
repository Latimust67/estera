# Estera website

A standalone marketing website for Estera, the free GPL desktop app for simulating an iPhone’s location. The site is separate from the `web/` application and Python backend; it never requests geolocation, connects to a phone, or calls an app backend.

## Develop and build

```sh
cd website
npm ci
npm run dev
```

The development server uses `http://127.0.0.1:3001` with a strict port. `npm run build` checks TypeScript, bundles the site with Vite, and renders all six public pages into complete HTML in `dist/`. React adds the interactive homepage after the document loads. `npm run seo:audit` explicitly checks generated metadata, content, links, and crawl files without a browser or server.

## Public release links

The header opens [Estera on GitHub](https://github.com/larsenbeenk2-ship-it/estera). Download buttons show system requirements, installation steps, and a direct link to `Estera-0.1.2-macos-arm64.zip` in release `v0.1.2`.

- The first binary is a macOS 15+ Apple Silicon prerelease, without Developer ID signing or Apple notarization. It includes the app runtime; users unzip it, move Estera into Applications, and launch it. Windows is a source-only preview.
- Pin and Journey are capabilities in the same free app. There is no advertised paid Pro tier.
- “Star on GitHub” opens the repository, where signed-in visitors can select Star. This is optional support, with no OAuth, star verification, download gate, or account requirement.
- Release URLs live in `src/release.ts`. When updating the version, review `src/content.tsx` and the homepage claims/dates. The build generates the no-JavaScript content from the same components.
- Publish the corresponding GitHub release and exact ZIP asset before deploying this site. The tag is explicit because GitHub’s latest-release endpoint does not select prereleases.

## Deploy to Vercel

Use `website` as the Vercel project’s root directory. `vercel.json` selects Vite, builds with `npm run build`, and publishes `dist`. The homepage retains its section anchors; five separate guide/download pages use real document links. Clean URLs remove `.html`, trailing slashes are normalized, and unknown paths use `404.html`. Keep the site free of catch-all SPA rewrites so missing pages return 404.

No credentials, backend deployment, or paid services are needed. Optional public settings for the canonical origin, ownership verification and analytics are documented in `.env.example`. The default canonical origin is `https://estera-virid.vercel.app`. Analytics stay disabled without configuration and explicit visitor opt-in. Keep download binaries in GitHub Releases, outside the static site bundle.

## Night Atlas design

- A canvas globe projected from local Natural Earth geography; city selection, drag, keyboard, and scroll controls preserve the original design.
- An illustrative Pin/Journey product preview. Journey follows native scroll in both directions; play/pause/reset takes manual control, and reduced motion retains manual playback.
- A native download dialog, FAQ, accessible navigation, responsive layouts, static globe fallback, and print/forced-colors treatment.
- All geography is local. The default site loads no analytics or third-party scripts. Optional GA4 requires a configured measurement ID and consent via the privacy page.

`npm run build` is the release compilation check. No browser, screenshot, or visual QA is included in this change; rendered appearance and motion remain visually unverified.

## Design records

- [Experience and motion contract](EXPERIENCE.md)
- [Current direction](docs/DIRECTION.md)
- [Earlier research record](docs/RESEARCH.md)
- [Asset credits](public/assets/CREDITS.md)
- [Globe geography provenance](public/assets/atlas-PROVENANCE.md)

The design records preserve the earlier design process; this README and the current site describe release availability and the single free app.

## SEO implementation

See [the SEO implementation and owner setup](docs/seo/README.md), [complete launch checklist](docs/seo/launch-checklist.md), [page plan](docs/seo/page-plan.csv), and [saved HTML audit](docs/seo/generated-audit.json). The technical implementation is local; deployment, search-account verification, submissions, real-user performance, and analytics delivery require the recorded follow-up work.
