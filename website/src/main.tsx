import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './motion.css';
import './guides.css';
import { normalizePath } from './site';
import { initializeAnalytics } from './analytics';

async function start() {
  // Guides do not download the globe and demo code. Navigation uses real documents.
  const path = normalizePath(window.location.pathname);
  const view = path === '/'
    ? React.createElement((await import('./App')).default)
    : React.createElement((await import('./GuidePage')).default, { page: (await import('./content')).contentPages.find(page => page.path === path) });
  const root = document.getElementById('root')!;
  const tree = <React.StrictMode>{view}</React.StrictMode>;
  if (root.childElementCount > 0) ReactDOM.hydrateRoot(root, tree);
  else ReactDOM.createRoot(root).render(tree);
  initializeAnalytics(path);
}
void start();
