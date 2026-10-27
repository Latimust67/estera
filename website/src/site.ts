const configuredUrl = import.meta.env.VITE_SITE_URL || 'https://estera-virid.vercel.app';
const parsedUrl = new URL(configuredUrl);
if (parsedUrl.protocol !== 'https:' || parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash || parsedUrl.username || parsedUrl.password || parsedUrl.port) {
  throw new Error('VITE_SITE_URL must be a bare HTTPS origin, with no path, credentials, port, query or fragment.');
}

export const SITE_URL = parsedUrl.origin;
export const SITE_UPDATED = '2026-10-27';
export const SITE_NOINDEX = import.meta.env.SEO_NOINDEX === true;
export const HOME_TITLE = 'Estera — Free iPhone Location Changer for Mac';
export const HOME_DESCRIPTION = 'Explore Estera, a free, open-source iPhone location changer preview for Mac. Apple Silicon, macOS 15+ and USB required. Physical iPhone set/reset remains unverified.';
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;
export const normalizePath = (path: string) => path === '/' ? '/' : path.replace(/\/$/, '').replace(/\.html$/, '') || '/';
