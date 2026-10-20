// Focused, offline regression for consent across documents and storage failures.
// Runs the actual analytics module with browser boundaries stubbed; no Google hits.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const id = 'G-TEST';
const key = 'estera.analytics-consent.v1';
const origin = 'https://estera-virid.vercel.app';
const download = 'https://example.test/Estera.zip';
const source = readFileSync(new URL('../src/analytics.tsx', import.meta.url), 'utf8')
  .replace('import.meta.env.VITE_GA4_ID', JSON.stringify(id));
const entry = fileURLToPath(new URL('../src/analytics.tsx', import.meta.url));
const bundle = await rolldown({
  input: entry,
  external: ['react', 'react/jsx-runtime', './release', './site', 'web-vitals'],
  transform: { jsx: 'react-jsx' },
  plugins: [{ name: 'test-environment', load: filename => filename === entry ? source : undefined }],
});
const { output } = await bundle.generate({ format: 'cjs' });
await bundle.close();
const outputText = output.find(file => file.type === 'chunk').code;

function bus() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
    dispatch(type, event = {}) { for (const listener of listeners.get(type) || []) listener(event); },
  };
}

function browser(initial = 'granted') {
  const values = new Map(initial ? [[key, initial]] : []);
  const tabs = [];
  function tab() {
    const window = bus();
    const document = { ...bus(), title: 'Privacy', referrer: '', visibilityState: 'visible' };
    const cookies = new Map([['_ga', 'test'], ['site-preference', 'keep']]);
    const scripts = [];
    const states = [];
    const result = { window, document, cookies, scripts, states, reloads: 0, failWrites: false };
    Object.defineProperty(document, 'cookie', {
      get: () => [...cookies].map(([name, value]) => `${name}=${value}`).join('; '),
      set: value => { const name = value.split('=')[0]; if (value.includes('Max-Age=0')) cookies.delete(name); },
    });
    document.createElement = () => ({});
    document.head = { appendChild: script => scripts.push(script) };
    const storage = {
      getItem: name => values.get(name) ?? null,
      setItem(name, value) {
        if (result.failWrites) throw new Error('storage unavailable');
        values.set(name, value);
        for (const other of tabs) if (other !== result) other.window.dispatch('storage', { key: name });
      },
    };
    const location = { origin, hostname: 'estera-virid.vercel.app', pathname: '/privacy', reload: () => result.reloads++ };
    class Element { closest() { return { href: download }; } }
    const module = { exports: {} };
    const react = { useEffect: callback => callback(), useState: initialValue => [initialValue, value => states.push(value)] };
    const jsx = (type, props) => ({ type, props });
    const modules = {
      react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
      './release': { DOWNLOAD_URL: download, RELEASE_VERSION: 'test' },
      './site': { SITE_URL: origin, SITE_NOINDEX: false },
      'web-vitals': { onCLS() {}, onINP() {}, onLCP() {} },
    };
    const context = vm.createContext({ module, exports: module.exports, window, document, location, localStorage: storage, Element, URL,
      require: name => { assert.ok(name in modules, `Unexpected dependency: ${name}`); return modules[name]; } });
    vm.runInContext(outputText, context);
    const exports = module.exports;
    tabs.push(result);
    exports.initializeAnalytics('/privacy');
    result.clickDownload = () => document.dispatch('click', { target: new Element(), defaultPrevented: false });
    result.events = () => (window.dataLayer || []).filter(command => command[0] === 'event');
    result.withdraw = () => {
      function find(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'button' && node.props.children === 'Keep analytics off') return node;
        for (const child of [node.props?.children].flat(Infinity)) { const found = find(child); if (found) return found; }
      }
      const button = find(exports.AnalyticsPreferences());
      assert.ok(button, 'Actual privacy control must be present');
      button.props.onClick();
    };
    return result;
  }
  return { tab, values, tabs };
}

function assertStopped(tab) {
  assert.equal(tab.window[`ga-disable-${id}`], true);
  assert.equal(tab.cookies.has('_ga'), false);
  assert.equal(tab.cookies.get('site-preference'), 'keep');
  const before = tab.events().length;
  tab.clickDownload();
  assert.equal(tab.events().length, before, 'No custom event after withdrawal');
}

test('withdrawal stops both already-active documents and requests library unload', () => {
  const app = browser();
  const first = app.tab();
  const second = app.tab();
  assert.equal(first.scripts.length, 1);
  assert.equal(second.scripts.length, 1);
  first.withdraw();
  for (const tab of app.tabs) { assertStopped(tab); assert.equal(tab.reloads, 1); }
  assert.equal(app.values.get(key), 'denied');
});

test('removal and storage clear revoke an active document', () => {
  for (const eventKey of [key, null]) {
    const app = browser(); const tab = app.tab();
    app.values.clear(); tab.window.dispatch('storage', { key: eventKey });
    assertStopped(tab); assert.equal(tab.reloads, 1);
  }
});

test('resumed documents reconcile a missed withdrawal', () => {
  for (const event of ['pageshow', 'visibilitychange']) {
    const app = browser(); const tab = app.tab(); app.values.set(key, 'denied');
    (event === 'pageshow' ? tab.window : tab.document).dispatch(event);
    assertStopped(tab); assert.equal(tab.reloads, 1);
  }
});

test('failed denial persistence still stops this document without reactivating on reload', () => {
  const app = browser(); const tab = app.tab(); tab.failWrites = true;
  tab.withdraw(); assertStopped(tab);
  assert.equal(tab.reloads, 0, 'Do not reload into a stale granted preference');
  assert.equal(app.values.get(key), 'granted');
  assert.match(tab.states.at(-1), /off in this tab.*could not save/);
});

test('another document granting consent does not auto-start this document', () => {
  const app = browser('denied'); const tab = app.tab();
  app.values.set(key, 'granted'); tab.window.dispatch('storage', { key });
  assert.equal(tab.scripts.length, 0);
  assert.equal(tab.events().length, 0);
});
