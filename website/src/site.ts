const configuredUrl = import.meta.env.VITE_SITE_URL || 'https://estera-virid.vercel.app';
const parsedUrl = new URL(configuredUrl);
if (parsedUrl.protocol !== 'https:' || parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash || parsedUrl.username || parsedUrl.password || parsedUrl.port) {
  throw new Error('VITE_SITE_URL must be a bare HTTPS origin, with no path, credentials, port, query or fragment.');
}

export const SITE_URL = parsedUrl.origin;
export const SITE_UPDATED = '2026-10-20';
export const SITE_NOINDEX = import.meta.env.SEO_NOINDEX === true;
export const HOME_TITLE = 'Estera — Free iPhone Location Simulator for Mac';
export const HOME_DESCRIPTION = 'Simulate iPhone locations and routes with Estera, a free, open-source Mac app. Apple Silicon, macOS 15+ and USB required. Download the preview and read setup guides.';
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;
export const normalizePath = (path: string) => path === '/' ? '/' : path.replace(/\/$/, '').replace(/\.html$/, '') || '/';
