// Run: node --test workers/site/test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, parseRedirects, parseDynamicRedirects, matchDynamicRedirect, parseHeaders, headersFor } from "../src/route.js";

test("language pages map to index.html keys", () => {
  assert.deepEqual(resolve("/ar/person/muhammad/"), { type: "r2", key: "ar/person/muhammad/index.html" });
  assert.deepEqual(resolve("/en/"), { type: "r2", key: "en/index.html" });
});

test("files with extensions map to their own key", () => {
  assert.deepEqual(resolve("/ar/pagefind-x.json"), { type: "r2", key: "ar/pagefind-x.json" });
});

test("missing trailing slash redirects to the slash form", () => {
  assert.deepEqual(resolve("/ar/person/muhammad"), { type: "redirect", location: "/ar/person/muhammad/" });
  assert.deepEqual(resolve("/ar"), { type: "redirect", location: "/ar/" });
});

test("non-language paths go to static assets", () => {
  assert.deepEqual(resolve("/brand/logo-mark.svg"), { type: "r2", key: "brand/logo-mark.svg" });
  assert.deepEqual(resolve("/media/time-browser/explorer/x.webp"), { type: "r2", key: "media/time-browser/explorer/x.webp" });
  assert.deepEqual(resolve("/timeline-data/en/index.json"), { type: "r2", key: "timeline-data/en/index.json" });
  assert.deepEqual(resolve("/sitemap-index.xml"), { type: "r2", key: "sitemap-index.xml" });
  assert.deepEqual(resolve("/favicon.svg"), { type: "r2", key: "favicon.svg" });
  assert.deepEqual(resolve("/search-synonyms.ar.json"), { type: "r2", key: "search-synonyms.ar.json" });
  assert.deepEqual(resolve("/robots.txt"), { type: "assets" });
  assert.deepEqual(resolve("/_astro/app.js"), { type: "assets" });
  assert.deepEqual(resolve("/"), { type: "assets" });
  assert.deepEqual(resolve("/arabic/x/"), { type: "assets" });
});

test("parseRedirects keeps static rules and skips dynamic ones", () => {
  const rules = parseRedirects([
    "# comment",
    "/api/*  https://api.islam.museum/api/:splat  301",
    "/ar/event/old/ /ar/event/new/ 301",
    "",
  ].join("\n"));
  assert.deepEqual(rules.get("/ar/event/old/"), { to: "/ar/event/new/", status: 301 });
  assert.equal(rules.has("/api/*"), false);
});

test("dynamic /api/* redirect keeps the rest of the path", () => {
  const rules = parseDynamicRedirects("/api/*  https://api.islam.museum/api/:splat  301\n");
  assert.deepEqual(matchDynamicRedirect(rules, "/api/v1/meta/index.json"), {
    location: "https://api.islam.museum/api/v1/meta/index.json",
    status: 301,
  });
  assert.equal(matchDynamicRedirect(rules, "/ar/person/muhammad/"), null);
});

test("dynamic rules fill :placeholders from the path", () => {
  const rules = parseDynamicRedirects("/old/:slug  /new/:slug  302");
  assert.deepEqual(matchDynamicRedirect(rules, "/old/abc"), { location: "/new/abc", status: 302 });
  assert.equal(matchDynamicRedirect(rules, "/old/abc/def"), null);
});

test("_headers blocks apply to exact paths and to /* wildcards", () => {
  const blocks = parseHeaders([
    "# comment",
    "/",
    "  Link: </sitemap.xml>; rel=\"describedby\"",
    "/*",
    "  X-Frame-Options: DENY",
    "/.well-known/api-catalog",
    "  Content-Type: application/linkset+json",
    "",
  ].join("\n"));
  assert.deepEqual(headersFor(blocks, "/"), { Link: '</sitemap.xml>; rel="describedby"', "X-Frame-Options": "DENY" });
  assert.deepEqual(headersFor(blocks, "/.well-known/api-catalog"), {
    "X-Frame-Options": "DENY",
    "Content-Type": "application/linkset+json",
  });
  assert.deepEqual(headersFor(blocks, "/ar/"), { "X-Frame-Options": "DENY" });
});

test("edge cache: HTML and redirects carry an hour of cache, 404s none", async () => {
  const { HTML_CACHE_CONTROL, REDIRECT_CACHE_CONTROL, redirectTo, redirectLocation } = await import("../src/route.js");
  assert.match(HTML_CACHE_CONTROL, /public, max-age=3600, s-maxage=3600/);
  const r = redirectTo("/ar/person/muhammad/", 301);
  assert.equal(r.status, 301);
  assert.equal(r.headers.get("location"), "/ar/person/muhammad/");
  assert.equal(r.headers.get("cache-control"), REDIRECT_CACHE_CONTROL);
  // Same-site targets stay path-only (the cache key has no host); other hosts stay absolute.
  assert.equal(redirectLocation("/ar/person/ikrima-ibn-abi-jahl/"), "/ar/person/ikrima-ibn-abi-jahl/");
  assert.equal(redirectLocation("ar/x/"), "/ar/x/");
  assert.equal(redirectLocation("https://api.islam.museum/api/v1/meta/index.json"), "https://api.islam.museum/api/v1/meta/index.json");
});

test("aliasTarget redirects a former entity id to the current one in the same language", async () => {
  const { aliasTarget } = await import("../src/route.js");
  const aliases = { "person/tughrul-beg": "person/tughril-beg", "event/tulunid-collapse-292": "event/fall-of-tulunids-292" };
  assert.equal(aliasTarget("/ar/person/tughrul-beg/", aliases), "/ar/person/tughril-beg/");
  assert.equal(aliasTarget("/ur/event/tulunid-collapse-292", aliases), "/ur/event/fall-of-tulunids-292/");
  assert.equal(aliasTarget("/en/person/tughril-beg/", aliases), null);
  assert.equal(aliasTarget("/en/search/", aliases), null);
  assert.equal(aliasTarget("/brand/logo-mark.svg", aliases), null);
});


test("host rewrites translate only the listed production hosts in absolute Locations", async () => {
  const { parseHostRewrites, rewriteHost, robotsDisallowed } = await import("../src/route.js");
  const map = parseHostRewrites("api.islam.museum=uat-api.islam.museum, islam.museum=uat.islam.museum");
  assert.equal(map.size, 2);
  assert.equal(rewriteHost("https://api.islam.museum/api/v1/meta/index.json", map), "https://uat-api.islam.museum/api/v1/meta/index.json");
  assert.equal(rewriteHost("https://islam.museum/openapi/v1.json?x=1", map), "https://uat.islam.museum/openapi/v1.json?x=1");
  // Paths, other hosts and malformed values pass through untouched.
  assert.equal(rewriteHost("/ar/person/muhammad/", map), "/ar/person/muhammad/");
  assert.equal(rewriteHost("https://github.com/amado2k5/islam-museum", map), "https://github.com/amado2k5/islam-museum");
  assert.equal(rewriteHost("https://api.islam.museum/x", new Map()), "https://api.islam.museum/x");
  assert.equal(rewriteHost("https://api.islam.museum/x", parseHostRewrites(undefined)), "https://api.islam.museum/x");
  assert.equal(parseHostRewrites("garbage,=x,y=").size, 0);
  // Production: no ROBOTS var, so the site's own robots.txt is served and nothing is marked noindex.
  assert.equal(robotsDisallowed({}), false);
  assert.equal(robotsDisallowed({ ROBOTS: "disallow" }), true);
  assert.equal(robotsDisallowed({ ROBOTS: "Disallow" }), true);
  assert.equal(robotsDisallowed({ ROBOTS: "allow" }), false);
});
