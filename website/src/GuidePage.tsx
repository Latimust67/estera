import { ArrowUpRight, Ghost } from 'lucide-react';
import { contentPages, type ContentPage } from './content';
import { GITHUB_URL, RELEASE_URL, RELEASE_VERSION } from './release';
import { AnalyticsPreferences } from './analytics';
import './guides.css';

export const pageLinks = [
  ['/download', 'Download for Mac'],
  ['/guides/iphone-location-simulation', 'iPhone setup guide'],
  ['/guides/routes-and-gpx', 'Routes and GPX'],
  ['/compatibility', 'Compatibility'],
  ['/guides/compare-iphone-location-changers', 'Compare location changers'],
  ['/privacy', 'Privacy'],
];

export default function GuidePage({ page }: { page?: ContentPage }) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="guide-header wrap">
      <a href="/" className="brand" aria-label="Estera home"><Ghost size={29} strokeWidth={1.6} aria-hidden="true"/><span>estera<span className="brand-period">.</span></span></a>
      <nav aria-label="Main navigation">{pageLinks.slice(0, 4).map(([path, label]) => <a key={path} href={path} aria-current={page?.path === path ? 'page' : undefined}>{label}</a>)}</nav>
    </header>
    <main id="main" className="guide-main wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Estera</a></li><li aria-current="page">{page?.heading ?? 'Page not found'}</li></ol></nav>
      <article className="guide-article">
        <h1>{page?.heading ?? 'This page could not be found.'}</h1>
        {page ? <>
          <p className="guide-intro">{page.intro}</p>
          <p className="guide-updated">Updated <time dateTime={page.updated}>{new Date(`${page.updated}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time> · Estera v{RELEASE_VERSION} preview · <a href={GITHUB_URL}>Estera project</a></p>
          <div className="guide-content">{page.content}</div>
          {page.path === '/privacy' && <AnalyticsPreferences/>}
          <aside className="guide-related" aria-label="Related pages"><h2>Keep exploring</h2><ul>{page.related.map(path => {
            const related = contentPages.find(item => item.path === path);
            return related ? <li key={path}><a href={path}>{related.heading}<ArrowUpRight size={16} aria-hidden="true"/></a></li> : null;
          })}</ul></aside>
        </> : <div className="guide-content"><p>The address may be incorrect or the page may have moved.</p><p><a href="/">Return to Estera</a> or <a href="/download">download the Mac preview</a>.</p></div>}
      </article>
    </main>
    <footer className="guide-footer wrap"><a href="/" className="brand">estera<span className="brand-period">.</span></a><nav aria-label="Footer navigation">{pageLinks.map(([path, label]) => <a key={path} href={path}>{label}</a>)}<a href={GITHUB_URL}>GitHub</a><a href={RELEASE_URL}>Release notes</a></nav><p>Free and open source under GPL-3.0-or-later. Apple Silicon · macOS 15+ · USB.</p></footer>
  </>;
}
