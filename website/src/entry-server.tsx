import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import GuidePage from './GuidePage';
import { contentPages } from './content';
import { absoluteUrl, HOME_DESCRIPTION, HOME_TITLE, SITE_NOINDEX, SITE_UPDATED, SITE_URL } from './site';

export const site = { url: SITE_URL, noindex: SITE_NOINDEX };
export const pages = [
  { path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION, heading: 'Free iPhone location changer for Mac', updated: SITE_UPDATED },
  ...contentPages.map(({ path, title, description, heading, updated }) => ({ path, title, description, heading, updated })),
];

export function render(path: string) {
  const page = contentPages.find(item => item.path === path);
  return renderToString(<StrictMode>{path === '/' ? <App/> : <GuidePage page={page}/>}</StrictMode>);
}

export function structuredData(path: string) {
  const page = pages.find(item => item.path === path);
  if (!page) return null;
  const url = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: 'en', isPartOf: { '@id': `${SITE_URL}/#website` }, dateModified: page.updated, ...(path === '/' ? {} : { breadcrumb: { '@id': `${url}#breadcrumb` } }) },
  ];
  if (path === '/') {
    graph.unshift({ '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Estera', description: HOME_DESCRIPTION, inLanguage: 'en' });
  } else {
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Estera', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.heading, item: url },
    ] });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
