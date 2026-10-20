// Package audit, adapted to this site's generated documents. No server or browser.
import { readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, '.prerender-manifest.json'), 'utf8'));
const audit = resolve(root, 'scripts/vendor/seo-audit.mjs');
const sitemap = await readFile(resolve(root, 'dist/sitemap.xml'), 'utf8');
const assets = JSON.parse(await readFile(resolve(root, 'dist/.vite/manifest.json'), 'utf8'));
const knownPaths = new Set(manifest.pages.map(page => page.path));
const linkedPaths = new Set();
const reports = [];
const failures = [];
const titles = new Set();
const descriptions = new Set();
for (const page of manifest.pages) {
  const file = resolve(root, 'dist', page.file);
  const html = await readFile(file, 'utf8');
  const url = `${manifest.url}${page.path}`;
  const result = JSON.parse(execFileSync(process.execPath, [audit, '--file', file, '--base', url, '--json'], { encoding: 'utf8' }));
  if (result.canonical !== url) failures.push(`${page.path}: canonical mismatch`);
  if (result.h1Count !== 1) failures.push(`${page.path}: expected one H1`);
  if (!result.title || titles.has(result.title)) failures.push(`${page.path}: missing or duplicate title`);
  if (!result.metaDescription || descriptions.has(result.metaDescription)) failures.push(`${page.path}: missing or duplicate description`);
  titles.add(result.title); descriptions.add(result.metaDescription);
  if (!result.jsonLdBlocks || result.jsonLdErrors.length) failures.push(`${page.path}: invalid or absent structured data`);
  if (!result.ogImage || !html.includes('name="twitter:card"')) failures.push(`${page.path}: missing social preview`);
  if (result.imagesMissingAlt.length) failures.push(`${page.path}: image missing alt attribute`);
  if (/<!--(?:app-html|seo-head)-->|<div id="root"><\/div>/.test(html)) failures.push(`${page.path}: missing static content`);
  if (page.path === '/') {
    const homeStyles = assets['src/App.tsx']?.css ?? [];
    if (!homeStyles.length || homeStyles.some(file => !html.includes(`rel="stylesheet" href="/${file}"`))) failures.push('Homepage component CSS must be linked in static HTML');
  }
  if (!manifest.noindex && (!sitemap.includes(`<loc>${url}</loc>`) || /content="noindex/.test(html))) failures.push(`${page.path}: public indexing mismatch`);
  if (manifest.noindex && !/content="noindex/.test(html)) failures.push(`${page.path}: preview is indexable`);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), url);
    if (target.origin !== manifest.url) continue;
    if (!knownPaths.has(target.pathname)) failures.push(`${page.path}: unknown internal page ${target.pathname}`);
    if (target.pathname !== page.path) linkedPaths.add(target.pathname);
    if (target.hash) {
      const destination = manifest.pages.find(item => item.path === target.pathname);
      if (destination) {
        const destinationHtml = destination.path === page.path ? html : await readFile(resolve(root, 'dist', destination.file), 'utf8');
        if (!destinationHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) failures.push(`${page.path}: missing anchor ${target.href}`);
      }
    }
  }
  reports.push({ path: page.path, ...result, file: page.file });
}
for (const path of knownPaths) if (!linkedPaths.has(path)) failures.push(`${path}: no incoming internal link`);
for (const file of ['assets/estera-social.png', 'favicon-96.png', 'apple-touch-icon.png', 'indexnow-key.txt', '404.html']) await access(resolve(root, 'dist', file));
const robots = JSON.parse(execFileSync(process.execPath, [audit, '--robots-file', resolve(root, 'dist/robots.txt'), '--json'], { encoding: 'utf8' }));
const notFound = await readFile(resolve(root, 'dist/404.html'), 'utf8');
if (!notFound.includes('content="noindex, follow"')) failures.push('404 must be noindex');
const report = { checkedAt: new Date().toISOString(), mode: 'saved production HTML; no browser or live deployment check', site: manifest.url, noindex: manifest.noindex, failures, pages: reports, robots };
await writeFile(resolve(root, 'docs/seo/generated-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.table(reports.map(page => ({ path: page.path, title: page.titleLength, description: page.metaDescriptionLength, h1: page.h1Count, words: page.wordCount, schema: page.jsonLdTypes.join(', '), warnings: page.warnings.length })));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Passed static SEO checks for ${reports.length} pages. Live status, browser behavior, rich results and performance are not measured.`);
