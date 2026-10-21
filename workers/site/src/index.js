// Serves the HTML pages under /ar/, /en/ and /ur/ from the R2 site prefix.
// Everything else (root pages, images, CSS, JS) comes from static assets, as before.
import { resolve, parseRedirects } from "./route.js";

let redirectRules = null;

async function loadRedirects(env, request) {
  if (redirectRules) return redirectRules;
  const res = await env.ASSETS.fetch(new URL("/_redirects", request.url));
  redirectRules = res.ok ? parseRedirects(await res.text()) : new Map();
  return redirectRules;
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") return env.ASSETS.fetch(request);
    const url = new URL(request.url);

    const rules = await loadRedirects(env, request);
    const rule = rules.get(url.pathname);
    if (rule) return Response.redirect(new URL(rule.to, url).toString(), rule.status);

    const target = resolve(url.pathname);
    if (target.type === "assets") return env.ASSETS.fetch(request);
    if (target.type === "redirect") {
      return Response.redirect(new URL(target.location + url.search, url).toString(), 301);
    }

    const object = await env.SITE_BUCKET.get(target.key);
    if (!object) {
      const notFound = await env.ASSETS.fetch(new URL("/404.html", url));
      return new Response(request.method === "HEAD" ? null : notFound.body, { status: 404, headers: notFound.headers });
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
    return new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers });
  },
};
