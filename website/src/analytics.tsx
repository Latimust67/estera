import { useEffect, useState } from 'react';
import { DOWNLOAD_URL, RELEASE_VERSION } from './release';
import { SITE_NOINDEX, SITE_URL } from './site';

declare global { interface Window { dataLayer?: unknown[]; } }
const measurementId = import.meta.env.VITE_GA4_ID || '';
const configured = /^G-[A-Z0-9]+$/.test(measurementId) && !SITE_NOINDEX;
const preferenceKey = 'estera.analytics-consent.v1';
const knownPaths = new Set(['/', '/download', '/guides/iphone-location-simulation', '/guides/routes-and-gpx', '/compatibility', '/privacy']);
let currentPath = '/';
let active = false;
let pageviewSent = false;

function command(_name: string, ..._values: unknown[]) {
  window.dataLayer ??= [];
  window.dataLayer.push(arguments);
}
function optedIn() {
  try { return localStorage.getItem(preferenceKey) === 'granted'; } catch { return false; }
}
function safeReferrer() {
  try { return new URL(document.referrer).origin; } catch { return ''; }
}
function activate() {
  if (active || !configured || location.origin !== SITE_URL || !knownPaths.has(currentPath)) return;
  active = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  command('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  command('js', new Date());
  command('config', measurementId, {
    send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    cookie_domain: location.hostname, cookie_flags: 'SameSite=Lax;Secure',
    page_location: `${SITE_URL}${currentPath}`, page_referrer: safeReferrer(),
  });
  if (!pageviewSent) {
    command('event', 'page_view', { send_to: measurementId, page_location: `${SITE_URL}${currentPath}`, page_referrer: safeReferrer(), page_title: document.title });
    pageviewSent = true;
  }
  const script = document.createElement('script');
  script.id = 'estera-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function initializeAnalytics(path: string) {
  currentPath = path;
  if (!configured || location.origin !== SITE_URL || !knownPaths.has(path)) return;
  if (optedIn()) activate();
  // One listener, one event per actual ZIP-link click. Dialog opens do not count.
  document.addEventListener('click', event => {
    if (!active || event.defaultPrevented || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-download]');
    if (link?.href !== DOWNLOAD_URL) return;
    command('event', 'download_click', { send_to: measurementId, release_version: RELEASE_VERSION, platform: 'macos-arm64', page_location: `${SITE_URL}${path}` });
  });
}

export function AnalyticsPreferences() {
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('Analytics are off unless you choose to allow them.');
  useEffect(() => {
    const granted = optedIn();
    setAllowed(granted);
    if (granted) setMessage('You have allowed optional analytics in this browser.');
  }, []);
  function choose(granted: boolean) {
    try { localStorage.setItem(preferenceKey, granted ? 'granted' : 'denied'); } catch {
      setMessage('Your browser could not save this preference. Analytics remain off.');
      return;
    }
    setAllowed(granted);
    if (granted) {
      activate();
      setMessage('Optional analytics allowed. You can turn them off here at any time.');
    } else {
      const wasActive = active;
      active = false;
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['', `; Domain=${location.hostname}`, `; Domain=.${location.hostname}`]) {
          document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;
        }
      }
      setMessage('Optional analytics are off.');
      // Unload the previously consented third-party library after withdrawal.
      if (wasActive) location.reload();
    }
  }
  return <section className="analytics-preferences" id="analytics-preferences" aria-labelledby="analytics-title">
    <h2 id="analytics-title">Your analytics choice</h2>
    {configured ? <><p>Allow Google Analytics to measure page visits and Mac download-link clicks. Google receives browser and network information when enabled. Advertising features are disabled. Your choice applies to this browser.</p><div className="analytics-actions"><button className="button button-secondary" type="button" aria-pressed={allowed} onClick={() => choose(true)}>Allow analytics</button><button className="button button-secondary" type="button" aria-pressed={!allowed} onClick={() => choose(false)}>Keep analytics off</button></div><p role="status">{message}</p><noscript><p>JavaScript is disabled, so optional analytics are off.</p></noscript></> : <p>Optional analytics are not configured for this site. No Google Analytics script is loaded.</p>}
  </section>;
}
