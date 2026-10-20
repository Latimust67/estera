#!/usr/bin/env node
/**
 * seo-audit.mjs — zero-dependency technical SEO snapshot for one or more pages.
 *
 * Usage:
 *   node seo-audit.mjs --url https://example.com/            # audit a live page (+ robots.txt and sitemap presence)
 *   node seo-audit.mjs --urls urls.txt                       # one URL per line
 *   node seo-audit.mjs --file page.html --base https://example.com/page/   # audit a saved HTML file
 *   node seo-audit.mjs --robots-file robots.txt              # analyse a robots.txt file on disk
 *   add --json for machine-readable output, --no-robots to skip the robots.txt / sitemap checks
 *
 * What it reports per page: HTTP status and redirect chain, title, meta description, canonical,
 * robots meta and X-Robots-Tag, H1 count, JSON-LD @types, hreflang set, images without alt text,
 * viewport, lang, Open Graph basics, link counts, word count, notes on snippet and archive directives,
 * and warnings that name the guide section explaining the fix. For robots.txt it names each group's
 * purpose (search, training, generic) and warns when a search or citation crawler is fully blocked.
 *
 * Limits: it reads the raw HTML the server returns. Content injected by client-side JavaScript
 * (including plugin-injected JSON-LD) is NOT visible here; confirm those with Google's URL Inspection
 * rendered HTML or the Rich Results Test (Guides 2 and 8). Script, style and template bodies and HTML
 * comments are ignored (only JSON-LD scripts are read). Some hosts block scripts with a 403; that
 * says nothing about how Googlebot is treated.
 *
 * Node 18+ (built-in fetch). No npm install needed.
 */

import { readFileSync } from "node:fs";
import { URL } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const USER_AGENT = "seo-audit-kit/1.5 (+site-owner technical check)";
const FETCH_HEADERS = {
  "user-agent": USER_AGENT,
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};
const asJson = flag("--json");
const checkRobots = !flag("--no-robots");

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (m) return decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  // Boolean form (<img alt>) counts as present with an empty value.
  if (new RegExp(`\\s${name}(?=[\\s/>])`, "i").test(tag)) return "";
  return undefined;
}

function allTags(html, tagName) {
  // Quote-aware: a ">" inside an attribute value (content="Home > Services") does not end the tag.
  return html.match(new RegExp(`<${tagName}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi")) ?? [];
}

function stripToText(html) {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalise(u) {
  // Hosts are case-insensitive; paths are not (Google treats /A and /a as different URLs).
  try {
    const x = new URL(u);
    x.hash = "";
    x.hostname = x.hostname.toLowerCase();
    let s = x.toString();
    if (s.endsWith("/") && x.pathname !== "/") s = s.slice(0, -1);
    return s;
  } catch {
    return String(u);
  }
}

function resolveUrl(href, base) {
  try {
    return base ? new URL(href, base).toString() : href;
  } catch {
    return href;
  }
}

// ---------- page analysis ----------
const LD_SCRIPT_RE = /<script\b(?:[^>"']|"[^"]*"|'[^']*')*type\s*=\s*["']application\/ld\+json["'](?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/script>/gi;

function analyseHtml(rawHtml, baseUrl) {
  // 1. Keep JSON-LD scripts, blank the bodies of every other script, style and template element so
  //    markup-looking strings inside JavaScript are not counted as links, images or comments.
  // 2. Then strip HTML comments, so commented-out markup is not counted either.
  const isLdScript = (tag) => /type\s*=\s*["']application\/ld\+json/i.test(tag.slice(0, tag.indexOf(">") + 1));
  const html = rawHtml
    .replace(/<script\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/script>/gi, (m) => (isLdScript(m) ? m : "<script></script>"))
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style></style>")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const ldBlocks = [...html.matchAll(LD_SCRIPT_RE)].map((m) => m[1]);
  // Honour <base href> for relative URLs when the caller gave no base.
  const baseTag = (html.match(/<base\b(?:[^>"']|"[^"]*"|'[^']*')*>/i) ?? [null])[0];
  if (!baseUrl && baseTag && attr(baseTag, "href")) baseUrl = attr(baseTag, "href");
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) ?? [html])[0];
  const result = {
    title: null,
    titleLength: 0,
    metaDescription: null,
    metaDescriptionLength: 0,
    canonical: null,
    robotsMeta: [],
    googlebotMeta: [],
    viewport: null,
    lang: null,
    charset: null,
    h1Count: 0,
    h1s: [],
    h2Count: 0,
    jsonLdBlocks: 0,
    jsonLdTypes: [],
    jsonLdErrors: [],
    hreflang: [],
    hreflangRelative: 0,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    imageCount: 0,
    imagesMissingAlt: [],
    linkClassification: baseUrl ? "by hostname" : "unknown (pass --base to classify internal vs external)",
    internalLinks: 0,
    externalLinks: 0,
    unclassifiedLinks: 0,
    nofollowLinks: 0,
    scriptOnlyLinks: 0,
    anchorsWithoutHref: 0,
    scriptAnchorsWithoutHref: 0,
    wordCount: 0,
    warnings: [],
    notes: [],
  };

  const titleMatch = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    result.title = decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim();
    result.titleLength = result.title.length;
  }

  const htmlTag = (html.match(/<html\b[^>]*>/i) ?? [""])[0];
  result.lang = attr(htmlTag, "lang") ?? null;

  for (const tag of allTags(head, "meta")) {
    const name = (attr(tag, "name") ?? attr(tag, "property") ?? attr(tag, "http-equiv") ?? "").toLowerCase();
    const content = attr(tag, "content");
    if (attr(tag, "charset")) result.charset = attr(tag, "charset");
    if (name === "description") {
      result.metaDescription = (content ?? "").replace(/\s+/g, " ").trim();
      result.metaDescriptionLength = result.metaDescription.length;
    } else if (name === "robots") {
      result.robotsMeta.push(...(content ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
    } else if (name === "googlebot") {
      result.googlebotMeta.push(...(content ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
    } else if (name === "viewport") {
      result.viewport = content ?? null;
    } else if (name === "og:title") {
      result.ogTitle = content ?? null;
    } else if (name === "og:description") {
      result.ogDescription = content ?? null;
    } else if (name === "og:image") {
      result.ogImage = content ?? null;
    }
  }

  for (const tag of allTags(html, "link")) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const href = attr(tag, "href");
    if (rel.includes("canonical") && href) result.canonical = resolveUrl(href, baseUrl);
    if (rel.includes("alternate") && attr(tag, "hreflang") && href) {
      if (!/^https?:\/\//i.test(href)) result.hreflangRelative += 1;
      result.hreflang.push({ hreflang: attr(tag, "hreflang"), href: resolveUrl(href, baseUrl) });
    }
  }

  const h1s = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? [];
  result.h1Count = h1s.length;
  result.h1s = h1s.map((h) => stripToText(h)).slice(0, 5);
  result.h2Count = (html.match(/<h2\b[^>]*>/gi) ?? []).length;

  result.jsonLdBlocks = ldBlocks.length;
  for (const body0 of ldBlocks) {
    const body = body0.trim();
    try {
      const data = JSON.parse(body);
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const item of items) {
        const t = item && item["@type"];
        if (Array.isArray(t)) result.jsonLdTypes.push(...t);
        else if (t) result.jsonLdTypes.push(t);
      }
    } catch (e) {
      result.jsonLdErrors.push(String(e.message).slice(0, 120));
    }
  }

  const imgs = allTags(html, "img");
  result.imageCount = imgs.length;
  for (const tag of imgs) {
    if (attr(tag, "alt") === undefined) result.imagesMissingAlt.push((attr(tag, "src") ?? "(no src)").slice(0, 160));
  }

  let host = null;
  try {
    host = baseUrl ? new URL(baseUrl).hostname.replace(/^www\./, "") : null;
  } catch {
    host = null;
  }
  for (const tag of allTags(html, "a")) {
    const href = attr(tag, "href");
    const rel = (attr(tag, "rel") ?? "").toLowerCase();
    if (rel.includes("nofollow")) result.nofollowLinks += 1;
    if (href === undefined) {
      // An <a> with onclick or role="button" but no href is Google's own example of a non-crawlable link.
      // A named anchor (<a name> / <a id>) is a target, not navigation.
      if (/\sonclick\s*=/i.test(tag) || /\srole\s*=\s*["']?button/i.test(tag)) result.scriptAnchorsWithoutHref += 1;
      else result.anchorsWithoutHref += 1;
      continue;
    }
    if (/^javascript:/i.test(href)) {
      result.scriptOnlyLinks += 1;
      continue;
    }
    if ((href === "" || href === "#") && (/\sonclick\s*=/i.test(tag) || /\srole\s*=\s*["']?button/i.test(tag))) {
      // href="#" plus onclick is the most common non-crawlable navigation pattern.
      result.scriptAnchorsWithoutHref += 1;
      continue;
    }
    if (/^(#|mailto:|tel:)/i.test(href)) continue;
    if (!host) {
      result.unclassifiedLinks += 1;
      continue;
    }
    const abs = resolveUrl(href, baseUrl);
    try {
      const h = new URL(abs).hostname.replace(/^www\./, "");
      if (h === host) result.internalLinks += 1;
      else result.externalLinks += 1;
    } catch {
      result.unclassifiedLinks += 1;
    }
  }

  const bodyHtml = (html.match(/<body\b[\s\S]*?<\/body>/i) ?? [html])[0];
  const text = stripToText(bodyHtml);
  result.wordCount = text ? text.split(" ").length : 0;

  // Warnings reference the guide section that explains the fix.
  const w = result.warnings;
  if (!result.title) w.push("No <title>. Add a distinct, descriptive title (Guide 4).");
  if (!result.metaDescription) w.push("No meta description. Write a page-specific one (Guide 4).");
  if (!result.canonical) w.push("No rel=canonical. Add a self-referencing canonical on the preferred URL (Guide 2).");
  else if (baseUrl && normalise(result.canonical) !== normalise(baseUrl)) {
    const caseOnly = normalise(result.canonical).toLowerCase() === normalise(baseUrl).toLowerCase();
    w.push(caseOnly
      ? `Canonical (${result.canonical}) differs from the page URL only by letter case. Google treats these as different URLs; make them identical (Guide 2).`
      : `Canonical points elsewhere (${result.canonical}). Confirm that is intended (Guide 2).`);
  }
  const directives = [...result.robotsMeta, ...result.googlebotMeta];
  if (directives.includes("noindex")) w.push("Page carries noindex. It will not be indexed (Guide 2).");
  if (directives.includes("nofollow")) w.push("Page carries nofollow on all links; internal discovery through this page is blocked (Guide 4).");
  if (directives.includes("nosnippet")) result.notes.push("nosnippet: Google shows no text snippet and does not use the page as direct input to AI Overviews or AI Mode; Bing says nosnippet can limit Copilot citation quality (Guides 9 and 15).");
  const maxSnippet = directives.find((d) => d.startsWith("max-snippet"));
  if (maxSnippet) result.notes.push(`${maxSnippet}: limits the Google snippet and the amount of page text used by AI Overviews and AI Mode (Guide 9).`);
  if (directives.includes("noarchive") || directives.includes("nocache")) result.notes.push("noarchive or nocache: Google no longer uses either; on Bing, noarchive keeps the page out of Copilot answers and grounding, and nocache limits Copilot to the URL, title and snippet (Guide 15).");
  if (result.h1Count === 0) w.push("No H1. Add one clear main heading (Guide 4).");
  if (result.h1Count > 1) result.notes.push(`${result.h1Count} H1 elements. Google says heading count does not matter; just check the page has one clear subject (Guide 4).`);
  if (!result.viewport) w.push("No viewport meta tag. Mobile rendering may be wrong (Guide 7).");
  if (!result.lang) w.push("No lang attribute on <html>. Add the page language (Guide 13).");
  if (result.imagesMissingAlt.length) w.push(`${result.imagesMissingAlt.length} image(s) without an alt attribute (Guide 7).`);
  if (result.scriptOnlyLinks) w.push(`${result.scriptOnlyLinks} link(s) use href="javascript:..." and are not crawlable (Guide 4).`);
  if (result.scriptAnchorsWithoutHref) w.push(`${result.scriptAnchorsWithoutHref} <a> element(s) act through onclick or role="button" with no real href; Google cannot crawl them (Guide 4).`);
  if (result.anchorsWithoutHref) result.notes.push(`${result.anchorsWithoutHref} <a> element(s) have no href and no click handler (named anchors). Informational.`);
  if (result.jsonLdErrors.length) w.push(`JSON-LD parse error(s): ${result.jsonLdErrors.join("; ")} (Guide 8).`);
  if (result.hreflangRelative) w.push(`${result.hreflangRelative} hreflang href(s) are relative; Google requires fully qualified URLs (Guide 13).`);
  if (result.hreflang.length) {
    const self = baseUrl && result.hreflang.some((h) => normalise(h.href) === normalise(baseUrl));
    if (baseUrl && !self) w.push("hreflang set does not include this page itself. Add the self-referencing entry (Guide 13).");
    if (!result.hreflang.some((h) => h.hreflang.toLowerCase() === "x-default")) w.push("hreflang set has no x-default entry (Guide 13).");
  }
  if (result.wordCount < 50) w.push("Very little text in the raw HTML. If content is rendered by JavaScript, confirm with URL Inspection (Guides 2 and 14).");
  if (result.title && result.titleLength > 70) result.notes.push("Title is longer than 70 characters. Google sets no limit but often rewrites or truncates long titles; keep the distinct part first (Guide 4).");

  return result;
}

// ---------- robots.txt analysis (group-aware) ----------
// Token purposes as each vendor documents them (Guide 15). Lower-case; robots.txt tokens are case-insensitive.
const SEARCH_TOKENS = {
  googlebot: "Google Search, AI Overviews and AI Mode",
  bingbot: "Bing search and Copilot",
  applebot: "Siri, Spotlight and Safari search",
  "oai-searchbot": "ChatGPT search",
  "claude-searchbot": "Claude search",
  perplexitybot: "Perplexity",
  "meta-webindexer": "Meta AI citations",
  "amzn-searchbot": "Alexa and Amazon search",
  duckduckbot: "DuckDuckGo",
};
const TRAINING_TOKENS = ["gptbot", "claudebot", "google-extended", "applebot-extended", "meta-externalagent", "ccbot"];
function purposeOf(agents) {
  if (agents.includes("*")) return "generic";
  const search = agents.some((a) => a in SEARCH_TOKENS);
  const training = agents.some((a) => TRAINING_TOKENS.includes(a));
  if (search && training) return "mixed";
  if (search) return "search";
  if (training) return "training";
  return "unknown";
}
export function analyseRobots(body) {
  const groups = []; // { agents: [], rules: [{type, path}] }
  let current = null;
  let lastWasAgent = false;
  const sitemaps = [];
  let crawlDelay = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === "sitemap") {
      sitemaps.push(value);
    } else if (key === "crawl-delay") {
      crawlDelay = true;
    } else if ((key === "allow" || key === "disallow") && current) {
      current.rules.push({ type: key, path: value });
    }
  }
  const notes = [];
  const blocksEverything = (g) => g.rules.some((r) => r.type === "disallow" && (r.path === "/" || r.path === "/*")) && !g.rules.some((r) => r.type === "allow" && (r.path === "/" || r.path === "/*"));
  const wildcard = groups.find((g) => g.agents.includes("*"));
  if (wildcard && blocksEverything(wildcard)) notes.push("The * group disallows the whole site. Every crawler without its own group is blocked (Guide 2).");
  const googlebot = groups.find((g) => g.agents.includes("googlebot"));
  if (googlebot && blocksEverything(googlebot)) notes.push("The Googlebot group disallows the whole site; Google Search cannot crawl it (Guide 2).");
  const fullyBlocked = groups.filter(blocksEverything).flatMap((g) => g.agents).filter((a) => a !== "*" && a !== "googlebot");
  const blockedSearch = fullyBlocked.filter((a) => a in SEARCH_TOKENS);
  const blockedTraining = fullyBlocked.filter((a) => TRAINING_TOKENS.includes(a));
  const blockedOther = fullyBlocked.filter((a) => !(a in SEARCH_TOKENS) && !TRAINING_TOKENS.includes(a));
  if (blockedSearch.length) notes.push(`Blocked search or citation crawlers: ${blockedSearch.join(", ")} (${blockedSearch.map((a) => SEARCH_TOKENS[a]).join("; ")}). The site drops out of those products; a copied "block all AI" list usually causes this. Remove the block unless it is intended (Guide 15).`);
  if (blockedTraining.length) notes.push(`Blocked training-only crawlers: ${blockedTraining.join(", ")}. A separate business decision that, according to each vendor, does not affect search results (Guide 15).`);
  if (blockedOther.length) notes.push(`Other groups that disallow the whole site: ${blockedOther.join(", ")}. Check what each vendor says the token controls before keeping the block (Guide 15).`);
  if (crawlDelay) notes.push("Crawl-delay is present. Google ignores it; Bing, Yandex and Anthropic honour it (Guide 15).");
  if (!sitemaps.length) notes.push("No Sitemap: line. Add one or submit the sitemap in Search Console (Guide 2).");
  return { groups: groups.map((g) => ({ agents: g.agents, purpose: purposeOf(g.agents), rules: g.rules.length })), sitemaps, notes };
}

// ---------- fetching ----------
async function fetchWithChain(url, maxHops = 10) {
  const chain = [];
  let current = url;
  for (let i = 0; i <= maxHops; i++) {
    const res = await fetch(current, { redirect: "manual", headers: FETCH_HEADERS });
    chain.push({ url: current, status: res.status });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location"), current).toString();
      continue;
    }
    const html = await res.text();
    return { finalUrl: current, status: res.status, chain, html, contentType: res.headers.get("content-type"), xRobotsTag: res.headers.get("x-robots-tag") };
  }
  return { finalUrl: current, status: null, chain, html: "", contentType: null, xRobotsTag: null, error: "Too many redirect hops" };
}

async function sitemapContains(sitemapUrls, pageUrl, budget = { fetches: 8, deadline: Date.now() + 25000 }) {
  // Follows sitemap index files within a small budget (8 fetches, 25 seconds, 10 seconds each);
  // returns true, false, or "unknown" when nothing could be read or the budget ran out first.
  const target = normalise(pageUrl);
  const queue = [...sitemapUrls];
  let readAny = false;
  let exhausted = false;
  while (queue.length) {
    if (budget.fetches <= 0 || Date.now() > budget.deadline) {
      exhausted = true;
      break;
    }
    const u = queue.shift();
    budget.fetches -= 1;
    try {
      const r = await fetch(u, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(10000) });
      if (!r.ok) continue;
      const xml = await r.text();
      readAny = true;
      const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => decodeEntities(m[1]));
      if (/<sitemapindex/i.test(xml)) queue.push(...locs.slice(0, 50));
      else if (locs.some((l) => normalise(l) === target)) return true;
    } catch {
      /* unreadable sitemap: keep going */
    }
  }
  if (exhausted) return "unknown (sitemap too large to scan fully)";
  return readAny ? false : "unknown";
}

async function robotsAndSitemap(pageUrl) {
  const origin = new URL(pageUrl).origin;
  const out = { robotsTxtStatus: null, robotsTxtSitemaps: [], robotsGroups: [], sitemapXmlStatus: null, inSitemap: "unknown", notes: [] };
  try {
    const r = await fetch(`${origin}/robots.txt`, { headers: FETCH_HEADERS });
    out.robotsTxtStatus = r.status;
    if (r.ok) {
      const analysed = analyseRobots(await r.text());
      out.robotsTxtSitemaps = analysed.sitemaps;
      out.robotsGroups = analysed.groups;
      out.notes.push(...analysed.notes.filter((n) => !n.startsWith("No Sitemap")));
      if (!analysed.sitemaps.length) out.notes.push("robots.txt declares no Sitemap: line (Guide 2).");
    } else if (r.status >= 500) {
      out.notes.push("robots.txt returns a server error. Google pauses crawling for 12 hours while robots.txt is unreachable (Guide 2).");
    }
  } catch (e) {
    out.notes.push(`robots.txt fetch failed: ${e.message}`);
  }
  try {
    const s = await fetch(`${origin}/sitemap.xml`, { method: "HEAD", headers: FETCH_HEADERS });
    out.sitemapXmlStatus = s.status;
  } catch {
    out.sitemapXmlStatus = null;
  }
  if (!out.robotsTxtSitemaps.length && out.sitemapXmlStatus !== 200) {
    out.notes.push("No sitemap found at /sitemap.xml and none declared in robots.txt. Submit one in Search Console (Guide 2).");
  } else {
    const candidates = out.robotsTxtSitemaps.length ? out.robotsTxtSitemaps : [`${origin}/sitemap.xml`];
    out.inSitemap = await sitemapContains(candidates, pageUrl);
    if (out.inSitemap === false) out.notes.push("This URL is not listed in the sitemap(s) checked. List preferred URLs you want indexed (Guide 2).");
  }
  return out;
}

async function auditUrl(url) {
  const fetched = await fetchWithChain(url);
  const report = { url, finalUrl: fetched.finalUrl, status: fetched.status, chain: fetched.chain, contentType: fetched.contentType, xRobotsTag: fetched.xRobotsTag, ...analyseHtml(fetched.html ?? "", fetched.finalUrl) };
  if (fetched.contentType && !/html|xml/i.test(fetched.contentType)) {
    report.nonHtml = true;
    report.warnings = [`Content-Type is ${fetched.contentType}; this is not an HTML page, so the page-level checks do not apply. Use the X-Robots-Tag header to control indexing of files (Guide 2).`];
    report.notes = [];
  }
  if (fetched.error) report.warnings.unshift(fetched.error);
  if (report.status === 403 || report.status === 429) {
    report.warnings.unshift(`The server answered ${report.status} to this script. Bot protection blocked the request; that does not show how Googlebot is treated. Check with URL Inspection (Guide 2).`);
  } else if (report.status && report.status !== 200) {
    report.warnings.unshift(`Final status is ${report.status}, not 200. Google indexes only pages that return 200 (Guide 2).`);
  }
  if (fetched.chain.length > 3) report.warnings.push(`Redirect chain has ${fetched.chain.length - 1} hops. Point links at the final URL (Guide 2).`);
  if (!/^https:/i.test(fetched.finalUrl)) report.warnings.push("Final URL is not HTTPS (Guide 7).");
  if (report.xRobotsTag && /noindex/i.test(report.xRobotsTag)) report.warnings.unshift("X-Robots-Tag header contains noindex (Guide 2).");
  if (checkRobots) report.site = await robotsAndSitemap(fetched.finalUrl);
  return report;
}

// ---------- output ----------
function printHuman(r) {
  console.log(`\n=== ${r.url ?? r.file} ===`);
  if (r.status !== undefined) console.log(`Status: ${r.status}${r.chain && r.chain.length > 1 ? "  redirect chain: " + r.chain.map((c) => `${c.status} ${c.url}`).join(" -> ") : ""}`);
  if (r.xRobotsTag) console.log(`X-Robots-Tag: ${r.xRobotsTag}`);
  console.log(`Title (${r.titleLength}): ${r.title ?? "(none)"}`);
  console.log(`Description (${r.metaDescriptionLength}): ${r.metaDescription ?? "(none)"}`);
  console.log(`Canonical: ${r.canonical ?? "(none)"}`);
  console.log(`Robots meta: ${r.robotsMeta.length ? r.robotsMeta.join(", ") : "(none)"}`);
  console.log(`Lang: ${r.lang ?? "(none)"}   Viewport: ${r.viewport ? "yes" : "NO"}`);
  console.log(`H1 x${r.h1Count}: ${r.h1s.join(" | ")}   H2 x${r.h2Count}`);
  console.log(`JSON-LD blocks: ${r.jsonLdBlocks}  types: ${r.jsonLdTypes.join(", ") || "(none)"}`);
  console.log(`hreflang entries: ${r.hreflang.length}`);
  console.log(`Images: ${r.imageCount}, missing alt: ${r.imagesMissingAlt.length}`);
  if (r.linkClassification === "by hostname") {
    console.log(`Links: internal ${r.internalLinks}, external ${r.externalLinks}, nofollow ${r.nofollowLinks}, javascript: ${r.scriptOnlyLinks}, script-only anchors ${r.scriptAnchorsWithoutHref}, named anchors ${r.anchorsWithoutHref}`);
  } else {
    console.log(`Links: ${r.unclassifiedLinks} (${r.linkClassification}), nofollow ${r.nofollowLinks}, javascript: ${r.scriptOnlyLinks}, script-only anchors ${r.scriptAnchorsWithoutHref}, named anchors ${r.anchorsWithoutHref}`);
  }
  console.log(`Words in raw HTML: ${r.wordCount}`);
  if (r.site) {
    console.log(`In sitemap: ${r.site.inSitemap}`);
    console.log(`robots.txt: ${r.site.robotsTxtStatus ?? "n/a"}  groups: ${r.site.robotsGroups.map((g) => g.agents.join("/")).join(", ") || "(none)"}  sitemaps declared: ${r.site.robotsTxtSitemaps.join(", ") || "(none)"}  /sitemap.xml: ${r.site.sitemapXmlStatus ?? "n/a"}`);
  }
  const warnings = [...r.warnings, ...(r.site ? r.site.notes : [])];
  console.log(warnings.length ? `Warnings (${warnings.length}):` : "Warnings: none");
  for (const x of warnings) console.log(`  - ${x}`);
  if (r.notes.length) {
    console.log("Notes:");
    for (const x of r.notes) console.log(`  - ${x}`);
  }
}

async function main() {
  const reports = [];
  if (opt("--robots-file")) {
    const analysed = analyseRobots(readFileSync(opt("--robots-file"), "utf8"));
    if (asJson) console.log(JSON.stringify(analysed, null, 2));
    else {
      console.log(`robots.txt groups: ${analysed.groups.map((g) => `${g.agents.join("/")} (${g.purpose}, ${g.rules} rules)`).join(", ")}`);
      console.log(`Sitemaps: ${analysed.sitemaps.join(", ") || "(none)"}`);
      console.log(analysed.notes.length ? "Notes:" : "Notes: none");
      for (const n of analysed.notes) console.log(`  - ${n}`);
    }
    return;
  }
  if (opt("--file")) {
    const file = opt("--file");
    const html = readFileSync(file, "utf8");
    reports.push({ file, ...analyseHtml(html, opt("--base") ?? null) });
  } else if (opt("--url")) {
    reports.push(await auditUrl(opt("--url")));
  } else if (opt("--urls")) {
    const list = readFileSync(opt("--urls"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
    for (const u of list) {
      try {
        reports.push(await auditUrl(u));
      } catch (e) {
        reports.push({ url: u, error: e.message, warnings: [e.message], notes: [] });
      }
    }
  } else {
    console.error("Usage: node seo-audit.mjs --url <url> | --urls <file> | --file <page.html> [--base <url>] | --robots-file <robots.txt>  [--json] [--no-robots]");
    process.exit(2);
  }
  if (asJson) console.log(JSON.stringify(reports.length === 1 ? reports[0] : reports, null, 2));
  else {
    for (const r of reports) printHuman(r);
    console.log("\nNote: this reads raw server HTML. JavaScript-injected content and plugin JSON-LD need the URL Inspection rendered view or the Rich Results Test.");
  }
}

main().catch((e) => {
  console.error("Audit failed:", e.message);
  process.exit(1);
});
