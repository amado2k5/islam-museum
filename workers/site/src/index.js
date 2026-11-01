// Serves the HTML pages under /ar/, /en/ and /ur/ from the R2 site prefix.
// Everything else (root pages, images, CSS, JS) comes from static assets, as before.
// Redirects and response headers follow the site's _redirects and _headers files, as Pages does.
//
// The two rule files are bundled at deploy time (scripts/bundle-rules.mjs writes
// src/rules.generated.js): static assets consume _redirects and _headers themselves
// and do not serve them, so they cannot be fetched through env.ASSETS.
import { resolve, parseRedirects, parseDynamicRedirects, matchDynamicRedirect, parseHeaders, headersFor, HTML_CACHE_CONTROL, redirectTo, redirectLocation, aliasTarget, apexRedirect, notFoundKey, BUNDLED_TYPES } from "./route.js";
import { redirectsText, headersText, aliasesText, apiCatalogBody, securityTxtBody } from "./rules.generated.js";

const rules = {
  static: parseRedirects(redirectsText),
  dynamic: parseDynamicRedirects(redirectsText),
  headers: parseHeaders(headersText),
  aliases: JSON.parse(aliasesText),
};

// R2 objects are HTML pages, the accessibility downloads under /{lang}/books/, and the data folders
// (route.js R2_DATA_DIRS): images, maps, video, JSON and other data.
const R2_CONTENT_TYPES = {
  ".epub": "application/epub+zip", ".brf": "text/plain; charset=us-ascii",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".avif": "image/avif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".ogg": "audio/ogg",
  ".json": "application/json; charset=utf-8", ".geojson": "application/geo+json", ".pmtiles": "application/octet-stream",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".csv": "text/csv; charset=utf-8",
  ".pdf": "application/pdf", ".yaml": "text/yaml; charset=utf-8", ".yml": "text/yaml; charset=utf-8",
  ".woff2": "font/woff2", ".woff": "font/woff", ".css": "text/css; charset=utf-8",
};
// Data files change rarely and are not HTML: a day at the edge, then refreshed in the background.
const DATA_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";
function r2ContentType(pathname) {
  const ext = pathname.slice(pathname.lastIndexOf("."));
  return R2_CONTENT_TYPES[ext] ?? "text/html; charset=utf-8";
}

// Copies the _headers values for this path onto a response. The response is rebuilt
// so its headers can be changed.
function withHeaders(response, blocks, pathname) {
  const extra = headersFor(blocks, pathname);
  if (Object.keys(extra).length === 0) return response;
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(extra)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

const BUNDLED_BODIES = {
  "/.well-known/security.txt": securityTxtBody,
  "/.well-known/api-catalog": apiCatalogBody,
  "/api/v1/catalog": apiCatalogBody,
};

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") return env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const respond = (response) => withHeaders(response, rules.headers, url.pathname);

    const www = apexRedirect(url.hostname, url.pathname, url.search);
    if (www) {
      // withHeaders may copy a path's Cache-Control (for example /brand/*) onto this
      // response. Put no-store back afterwards: a cached www redirect is keyed by path
      // alone and would be replayed on the apex.
      const redirected = respond(new Response(null, {
        status: www.status,
        headers: { location: www.location, "cache-control": "no-store", "cdn-cache-control": "no-store" },
      }));
      const headers = new Headers(redirected.headers);
      headers.set("cache-control", "no-store");
      headers.set("cdn-cache-control", "no-store");
      return new Response(null, { status: redirected.status, headers });
    }

    const bundledType = BUNDLED_TYPES[url.pathname];
    const bundledBody = BUNDLED_BODIES[url.pathname];
    if (bundledType && bundledBody) {
      const served = respond(new Response(request.method === "HEAD" ? null : bundledBody, {
        status: 200,
        headers: { "content-type": bundledType, "cache-control": "public, max-age=86400" },
      }));
      const headers = new Headers(served.headers);
      headers.set("content-type", bundledType);
      return new Response(served.body, { status: 200, headers });
    }

    const rule = rules.static.get(url.pathname);
    if (rule) return respond(redirectTo(redirectLocation(rule.to), rule.status));

    const dynamic = matchDynamicRedirect(rules.dynamic, url.pathname);
    if (dynamic) return respond(redirectTo(redirectLocation(dynamic.location), dynamic.status));

    const target = resolve(url.pathname);
    if (target.type === "assets") {
      const asset = await env.ASSETS.fetch(request);
      // The asset layer's own redirects name the request host in Location; keep them
      // out of the host-blind cache.
      if (asset.status >= 300 && asset.status < 400) {
        const headers = new Headers(asset.headers);
        headers.set("cache-control", "no-store");
        return respond(new Response(null, { status: asset.status, headers }));
      }
      return respond(asset);
    }
    if (target.type === "redirect") return respond(redirectTo(target.location + url.search, 301));

    // A former id (alias in data/) redirects to the entity's current page.
    const alias = aliasTarget(url.pathname, rules.aliases);
    if (alias) return respond(redirectTo(alias + url.search, 301));

    const object = await env.SITE_BUCKET.get(target.key);
    if (!object) {
      // Never cached: the page appears as soon as a publish writes it to R2.
      // Prefer the language's own not-found page (published to R2 with the HTML).
      const localized = await env.SITE_BUCKET.get(notFoundKey(url.pathname));
      const notFound = localized ?? await env.ASSETS.fetch(new URL("/404.html", url));
      const headers = new Headers(localized ? undefined : notFound.headers);
      headers.set("content-type", "text/html; charset=utf-8");
      headers.set("cache-control", "no-store");
      const body = localized ? localized.body : notFound.body;
      return respond(new Response(request.method === "HEAD" ? null : body, { status: 404, headers }));
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("content-type", r2ContentType(url.pathname));
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", r2ContentType(url.pathname).startsWith("text/html") ? HTML_CACHE_CONTROL : DATA_CACHE_CONTROL);
    return respond(new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers }));
  },
};
