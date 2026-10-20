import { useEffect, useState } from 'react';
import type { Metric } from 'web-vitals';
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
let webVitalsStarted = false;

function command(_name: string, ..._values: unknown[]) {
  window.dataLayer ??= [];
  window.dataLayer.push(arguments);
}
function optedIn() {
  try { return localStorage.getItem(preferenceKey) === 'granted'; } catch { return false; }
}
function deactivate(reload = true) {
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
  // Also unload Google's automatic events, including in other opted-in tabs.
  if (wasActive && reload) location.reload();
}
function safeReferrer() {
  try { return new URL(document.referrer).origin; } catch { return ''; }
}
function canMeasure() {
  return active && configured && optedIn() && location.origin === SITE_URL
    && knownPaths.has(currentPath) && location.pathname === currentPath;
}
function reportWebVital({ name, delta, value, id }: Metric) {
  if (!canMeasure() || !['LCP', 'INP', 'CLS'].includes(name)
    || !Number.isFinite(value) || !Number.isFinite(delta)) return;
  // Follow Google's GA4 delta model. Never forward entries, DOM attribution,
  // navigation URLs, or the full metric object. IDs identify metric instances.
  command('event', name, {
    send_to: measurementId, page_location: `${SITE_URL}${currentPath}`,
    value: delta, metric_id: id, metric_value: value, metric_delta: delta,
  });
}
async function startWebVitals() {
  if (webVitalsStarted || !canMeasure()) return;
  try {
    // The standard build is self-hosted in a separate chunk, requested only
    // after opt-in. Its observers provide real metrics, not an INP estimate.
    const { onCLS, onINP, onLCP } = await import('web-vitals');
    if (webVitalsStarted || !canMeasure()) return;
    webVitalsStarted = true;
    onCLS(reportWebVital);
    onINP(reportWebVital);
    onLCP(reportWebVital);
  } catch {
    // Optional measurement failure must not interrupt the site or invent data.
  }
}
function activate() {
  if (active || !configured || !optedIn() || location.origin !== SITE_URL
    || !knownPaths.has(currentPath) || location.pathname !== currentPath) return;
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
  void startWebVitals();
}

export function initializeAnalytics(path: string) {
  currentPath = path;
  if (!configured || location.origin !== SITE_URL || !knownPaths.has(path) || location.pathname !== path) return;
  const syncWithdrawal = () => {
    if (active && !optedIn()) deactivate();
  };
  window.addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) syncWithdrawal();
  });
  // A suspended or cached tab may only learn about withdrawal when it resumes.
  window.addEventListener('pageshow', syncWithdrawal);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncWithdrawal();
  });
  if (optedIn()) activate();
  // One listener, one event per actual ZIP-link click. Dialog opens do not count.
  document.addEventListener('click', event => {
    if (!canMeasure() || event.defaultPrevented || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-download]');
    if (link?.href !== DOWNLOAD_URL) return;
    command('event', 'download_click', { send_to: measurementId, release_version: RELEASE_VERSION, platform: 'macos-arm64', page_location: `${SITE_URL}${path}` });
  });
}

export function AnalyticsPreferences() {
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('Analytics are off unless you choose to allow them.');
  useEffect(() => {
    const syncPreference = () => {
      const granted = optedIn();
      setAllowed(granted);
      setMessage(granted ? 'You have allowed optional analytics in this browser.' : 'Optional analytics are off.');
    };
    syncPreference();
    window.addEventListener('storage', syncPreference);
    return () => window.removeEventListener('storage', syncPreference);
  }, []);
  function choose(granted: boolean) {
    if (!granted) {
      const wasActive = active;
      // Stop immediately, even if the browser refuses to persist this choice.
      deactivate(false);
      setAllowed(false);
      try { localStorage.setItem(preferenceKey, 'denied'); } catch {
        setMessage('Analytics are off in this tab, but your browser could not save the choice. Clear this site’s stored data before opening another page.');
        return;
      }
      setMessage('Optional analytics are off.');
      if (wasActive) location.reload();
      return;
    }
    try { localStorage.setItem(preferenceKey, 'granted'); } catch {
      deactivate(false);
      setAllowed(false);
      setMessage('Your browser could not save this preference. Analytics are off in this tab.');
      return;
    }
    setAllowed(true);
    activate();
    setMessage('Optional analytics allowed. You can turn them off here at any time.');
  }
  return <section className="analytics-preferences" id="analytics-preferences" aria-labelledby="analytics-title">
    <h2 id="analytics-title">Your analytics choice</h2>
    {configured ? <><p>Allow Google Analytics to measure page visits, Mac download-link clicks, and page loading, responsiveness, and layout stability. Google receives browser and network information when enabled. Advertising features are disabled. Your choice applies to this browser.</p><div className="analytics-actions"><button className="button button-secondary" type="button" aria-pressed={allowed} onClick={() => choose(true)}>Allow analytics</button><button className="button button-secondary" type="button" aria-pressed={!allowed} onClick={() => choose(false)}>Keep analytics off</button></div><p role="status">{message}</p><noscript><p>JavaScript is disabled, so optional analytics are off.</p></noscript></> : <p>Optional analytics are not configured for this site. No Google Analytics script is loaded.</p>}
  </section>;
}
