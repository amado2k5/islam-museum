// Serves the HTML pages under /ar/, /en/ and /ur/ from the R2 site prefix.
// Everything else (root pages, images, CSS, JS) comes from static assets, as before.
// Redirects and response headers follow the site's _redirects and _headers files, as Pages does.
import { resolve, parseRedirects, parseDynamicRedirects, matchDynamicRedirect, parseHeaders, headersFor } from "./route.js";

let rules = null;

// Reads _redirects and _headers once per Worker instance.
async function loadRules(env, request) {
  if (rules) return rules;
  const fetchText = async (path) => {
    const res = await env.ASSETS.fetch(new URL(path, request.url));
    return res.ok ? res.text() : "";
  };
  const [redirects, headers] = await Promise.all([fetchText("/_redirects"), fetchText("/_headers")]);
  rules = {
    static: parseRedirects(redirects),
    dynamic: parseDynamicRedirects(redirects),
    headers: parseHeaders(headers),
  };
  return rules;
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

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") return env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const loaded = await loadRules(env, request);
    const respond = (response) => withHeaders(response, loaded.headers, url.pathname);

    const rule = loaded.static.get(url.pathname);
    if (rule) return respond(Response.redirect(new URL(rule.to, url).toString(), rule.status));

    const dynamic = matchDynamicRedirect(loaded.dynamic, url.pathname);
    if (dynamic) return respond(Response.redirect(new URL(dynamic.location, url).toString(), dynamic.status));

    const target = resolve(url.pathname);
    if (target.type === "assets") return respond(await env.ASSETS.fetch(request));
    if (target.type === "redirect") {
      return respond(Response.redirect(new URL(target.location + url.search, url).toString(), 301));
    }

    const object = await env.SITE_BUCKET.get(target.key);
    if (!object) {
      const notFound = await env.ASSETS.fetch(new URL("/404.html", url));
      return respond(new Response(request.method === "HEAD" ? null : notFound.body, { status: 404, headers: notFound.headers }));
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
    return respond(new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers }));
  },
};
