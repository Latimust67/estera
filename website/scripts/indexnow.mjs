import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, '.prerender-manifest.json'), 'utf8'));
if (manifest.noindex) throw new Error('Do not submit a preview or noindex build.');
const key = (await readFile(resolve(root, 'public/indexnow-key.txt'), 'utf8')).trim();
if (!/^[a-f0-9]{32}$/.test(key)) throw new Error('Invalid IndexNow verification key.');
const args = process.argv.slice(2);
if (args.some(arg => arg.startsWith('--') && arg !== '--submit')) throw new Error('Use --submit and optional absolute URLs only.');
const selected = args.filter(arg => arg !== '--submit');
const urlList = selected.length ? selected : manifest.pages.map(page => `${manifest.url}${page.path}`);
for (const value of urlList) {
  const url = new URL(value);
  if (url.origin !== manifest.url || url.search || url.hash || url.username || url.password) throw new Error('Only canonical URLs on the configured production origin may be submitted.');
}
const body = { host: new URL(manifest.url).host, key, keyLocation: `${manifest.url}/indexnow-key.txt`, urlList: [...new Set(urlList)] };
if (!args.includes('--submit')) {
  console.log('Dry run: no request sent. After publication, add --submit to notify IndexNow.');
  console.log(JSON.stringify(body, null, 2));
} else {
  const proof = await fetch(body.keyLocation, { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('The production key is not published. Deploy the reviewed build first.');
  const response = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
  console.log(`IndexNow received ${body.urlList.length} URLs (HTTP ${response.status}). This does not confirm crawling or indexing.`);
}
