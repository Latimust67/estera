import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { loadEnv } from 'vite';
import { pages, render, site, structuredData } from '../.prerender/entry-server.js';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const assets = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) throw new Error('Missing prerender placeholders.');

for (const page of [...pages, { path: '/404', title: 'Page not found — Estera', description: 'Find Estera downloads, setup guides and compatibility information.', noindex: true }]) {
  const noindex = site.noindex || page.noindex;
  const url = `${site.url}${page.path}`;
  const schema = structuredData(page.path);
  const head = [
    ...(page.path === '/' ? (assets['src/App.tsx']?.css ?? []).map(file => `<link rel="stylesheet" href="/${escape(file)}" />`) : []),
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    ...(!page.noindex ? [`<link rel="canonical" href="${escape(url)}" />`] : []),
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Estera" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${site.url}/assets/estera-social.png" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Estera — free, open-source iPhone location simulator for Mac" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    `<meta name="twitter:image" content="${site.url}/assets/estera-social.png" />`,
    '<meta name="twitter:image:alt" content="Estera — free, open-source iPhone location simulator for Mac" />',
    ...(env.GOOGLE_SITE_VERIFICATION ? [`<meta name="google-site-verification" content="${escape(env.GOOGLE_SITE_VERIFICATION)}" />`] : []),
    ...(env.BING_SITE_VERIFICATION ? [`<meta name="msvalidate.01" content="${escape(env.BING_SITE_VERIFICATION)}" />`] : []),
    ...(schema ? [`<script type="application/ld+json">${json(schema)}</script>`] : []),
  ].join('\n    ');
  const html = template.replace(/<title>.*?<\/title>/s, () => `<title>${escape(page.title)}</title>`).replace('<!--seo-head-->', () => head).replace('<!--app-html-->', () => render(page.path));
  const file = resolve(dist, page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
const urls = site.noindex ? [] : pages.map(page => ({ url: `${site.url}${page.path}`, updated: page.updated }));
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(page => `  <url><loc>${escape(page.url)}</loc><lastmod>${page.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile(resolve(dist, 'robots.txt'), `# Public content is crawlable. Preview HTML carries noindex.\nUser-agent: *\nAllow: /\n${site.noindex ? '' : `\nSitemap: ${site.url}/sitemap.xml\n`}`);
await writeFile(resolve(root, '.prerender-manifest.json'), JSON.stringify({ ...site, pages: pages.map(page => ({ ...page, file: page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html` })) }, null, 2) + '\n');
await rm(resolve(root, '.prerender'), { recursive: true });
console.log(`Prerendered ${pages.length} pages and a 404; generated robots.txt and sitemap.xml for ${site.url}${site.noindex ? ' (noindex)' : ''}.`);
