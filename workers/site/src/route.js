// Pure routing for HTML pages served from R2. No Cloudflare imports, so it can be tested with node:test.
//
// Pages under /ar/, /en/ and /ur/ are stored in R2 under the same paths, with the
// "index.html" file names Astro writes (for example "ar/person/muhammad/index.html").
// The site keeps trailingSlash "always", so a request without a slash is redirected.

export const LANGS = ["ar", "en", "ur"];

const isLangPath = (pathname) => LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

// Founder rule (28 Oct 2026): Cloudflare Pages and the Worker's static assets hold code and logic only. Data,
// content, maps, images, pictures and video are published to R2 and served from there. These folders are stored in
// R2 under the same paths (for example "media/time-browser/explorer/x.webp"); keep this list in step with
// workers/r2-sync/batch/publish.mjs (DATA_TARGETS), wrangler.production.toml (run_worker_first) and deploy.yml.
export const R2_DATA_DIRS = ["media", "edu", "timeline-data", "gift-shop", "brand", "openapi"];
// Data files at the site root (sitemaps, feed, llms.txt, search synonyms, favicons) follow the same rule. Keep in step
// with ROOT_FILES in publish.mjs and workers/r2-sync/src/index.js, run_worker_first and deploy.yml.
export const R2_ROOT_FILES = [/^\/sitemap[\w-]*\.xml$/, /^\/feed\.xml$/, /^\/llms(-full)?\.txt$/, /^\/search-synonyms\.\w+\.json$/, /^\/favicon[\w-]*\.(png|svg|ico)$/, /^\/apple-touch-icon\.png$/];
const isDataPath = (pathname) => R2_DATA_DIRS.some((d) => pathname.startsWith(`/${d}/`)) || R2_ROOT_FILES.some((r) => r.test(pathname));

// Returns { type: "r2", key } | { type: "redirect", location } | { type: "assets" }.
export function resolve(pathname) {
  if (isDataPath(pathname)) {
    return { type: "r2", key: pathname.endsWith("/") ? pathname.slice(1) + "index.html" : pathname.slice(1) };
  }
  if (!isLangPath(pathname)) return { type: "assets" };
  if (pathname === "/ar" || pathname === "/en" || pathname === "/ur") {
    return { type: "redirect", location: `${pathname}/` };
  }
  if (pathname.endsWith("/")) return { type: "r2", key: pathname.slice(1) + "index.html" };
  const last = pathname.split("/").pop();
  if (last.includes(".")) return { type: "r2", key: pathname.slice(1) };
  return { type: "redirect", location: `${pathname}/` };
}

// Parses the static 301/302 rules of a _redirects file. Dynamic rules (with :placeholders) are ignored
// here and must be checked separately.
export function parseRedirects(text) {
  const rules = new Map();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [from, to, status] = line.split(/\s+/);
    if (!from || !to || from.includes("*") || from.includes(":")) continue;
    if (!from.startsWith("/")) continue;
    rules.set(from, { to, status: Number(status ?? 301) });
  }
  return rules;
}

// Redirect rules with :placeholders or a * splat, as Pages reads them. Each rule keeps its
// placeholder names, so the target can be filled in from the matched path.
export function parseDynamicRedirects(text) {
  const rules = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [from, to, status] = line.split(/\s+/);
    if (!from || !to || !from.startsWith("/")) continue;
    if (!from.includes("*") && !from.includes(":")) continue;
    const names = [];
    let pattern = "";
    for (const part of from.split(/(\*|:[A-Za-z_]\w*)/)) {
      if (part === "*") {
        names.push("splat");
        pattern += "(.*)";
      } else if (part.startsWith(":") && part.length > 1) {
        names.push(part.slice(1));
        pattern += "([^/]+)";
      } else {
        pattern += part.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      }
    }
    rules.push({ pattern: new RegExp(`^${pattern}$`), names, to, status: Number(status ?? 301) });
  }
  return rules;
}

// Returns { location, status } for the first dynamic rule that matches, or null.
export function matchDynamicRedirect(rules, pathname) {
  for (const rule of rules) {
    const match = rule.pattern.exec(pathname);
    if (!match) continue;
    const values = Object.fromEntries(rule.names.map((name, i) => [name, match[i + 1]]));
    const location = rule.to.replace(/:(\w+)/g, (whole, name) => (name in values ? values[name] : whole));
    return { location, status: rule.status };
  }
  return null;
}

// Parses a _headers file. A line that starts at column 0 names the paths; indented
// "Name: value" lines below it are the headers for those paths.
export function parseHeaders(text) {
  const blocks = [];
  let current = null;
  for (const raw of text.split("\n")) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(raw)) {
      const source = raw.trim().split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      current = { pattern: new RegExp(`^${source}$`), headers: {} };
      blocks.push(current);
      continue;
    }
    const colon = raw.indexOf(":");
    if (current && colon > 0) current.headers[raw.slice(0, colon).trim()] = raw.slice(colon + 1).trim();
  }
  return blocks;
}

// Headers from every block whose path matches, later blocks overriding earlier ones.
export function headersFor(blocks, pathname) {
  const out = {};
  for (const block of blocks) {
    if (block.pattern.test(pathname)) Object.assign(out, block.headers);
  }
  return out;
}

// HTML pages: an hour in the browser and at the edge, a day of stale-while-revalidate.
// A page republished to R2 reaches visitors within the hour; the museum's content
// changes slowly enough for that (founder's decision, 21 October 2026). The edge part
// is Workers Caching ([cache] in wrangler.production.toml): a cached page is served
// without running this Worker or reading R2, once per hour per edge location.
export const HTML_CACHE_CONTROL = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";
// Redirects are fixed by the rule files, so they may be cached for the same hour.
// Workers Caching keys a response by path only, never by host (the same Worker answers
// on workers.dev and on islam.museum), so a same-site redirect must carry a path-only
// Location: an absolute one would be served to visitors of the other host.
export const REDIRECT_CACHE_CONTROL = "public, max-age=3600";

export function redirectTo(location, status) {
  return new Response(null, { status, headers: { location, "cache-control": REDIRECT_CACHE_CONTROL } });
}

// A rule target: kept as is when it is absolute (another host), otherwise a path.
export const redirectLocation = (to) => (/^https?:\/\//.test(to) ? to : to.startsWith("/") ? to : `/${to}`);

// Environments. The build is the same everywhere (one `dist` artifact, built from main), so the
// few absolute production hostnames inside it (the /api/* rule in site/public/_redirects points at
// api.islam.museum) are translated at serve time by the Worker's own configuration, never by a
// different build. HOST_REWRITES is a comma-separated list of "from=to" host pairs set in the
// wrangler environment (`[env.uat.vars]`); production leaves it unset, so nothing is rewritten there.
export function parseHostRewrites(text) {
  const map = new Map();
  for (const pair of (text ?? "").split(",")) {
    const [from, to] = pair.split("=").map((s) => s.trim().toLowerCase());
    if (from && to) map.set(from, to);
  }
  return map;
}

// Rewrites the host of an absolute Location when it is listed; paths and other hosts are unchanged.
export function rewriteHost(location, rewrites) {
  if (!rewrites?.size || !/^https?:\/\//.test(location)) return location;
  let url;
  try {
    url = new URL(location);
  } catch {
    return location;
  }
  const to = rewrites.get(url.hostname.toLowerCase());
  if (!to) return location;
  url.hostname = to;
  return url.toString();
}

// A non-production environment must never be indexed: ROBOTS="disallow" in the wrangler
// environment makes the Worker answer /robots.txt with a blanket Disallow and add an
// X-Robots-Tag to every response. Production leaves ROBOTS unset and serves the site's own robots.txt.
export const ROBOTS_DISALLOW_TEXT = "User-agent: *\nDisallow: /\n";
export const ROBOTS_NOINDEX_TAG = "noindex, nofollow";
export const robotsDisallowed = (env) => String(env?.ROBOTS ?? "").toLowerCase() === "disallow";

// A language page whose "class/slug" is a former id (an alias in data/) redirects to the
// current id in the same language: /ar/person/old-slug/ -> /ar/person/new-slug/.
// Returns the path-only Location, or null when the path is not an alias.
export function aliasTarget(pathname, aliases) {
  const m = pathname.match(/^\/(ar|en|ur)\/([a-z]+)\/([^/]+)\/?$/);
  if (!m) return null;
  const current = aliases[`${m[2]}/${m[3]}`];
  return current ? `/${m[1]}/${current}/` : null;
}

