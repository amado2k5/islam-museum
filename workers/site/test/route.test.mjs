// Run: node --test workers/site/test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, parseRedirects } from "../src/route.js";

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
  assert.deepEqual(resolve("/brand/logo-mark.svg"), { type: "assets" });
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
