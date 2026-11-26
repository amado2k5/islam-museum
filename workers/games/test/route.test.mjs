// Run: node --test workers/games/test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CHANNEL_KEY, IMMUTABLE, PREFIX, RELEASE_ID, SHORT, cacheControl, contentType, mediaKey, parseChannel, parseRange, releaseKey, resolve, securityHeaders } from "../src/route.js";

test("a folder answers with its index page, and a folder asked for without its slash is redirected", () => {
  assert.deepEqual(resolve("/"), { type: "file", path: "index.html" });
  assert.deepEqual(resolve("/granada/"), { type: "file", path: "granada/index.html" });
  assert.deepEqual(resolve("/granada"), { type: "redirect", location: "/granada/" });
  assert.deepEqual(resolve("/assets/granada-D4RtFkQL.js"), { type: "file", path: "assets/granada-D4RtFkQL.js" });
  assert.deepEqual(resolve("/release.json"), { type: "file", path: "release.json" });
  assert.deepEqual(resolve("/_channel"), { type: "channel" });
});

test("nothing that could leave the release folder becomes an object key", () => {
  for (const path of ["/../secret", "/a/../../b", "/a//b", "//evil.example/x", "/.env", "/a/.git/config", "/a b", "/a%2e%2e/b", "/a\\b", "/a?b", "/é", `/${"a".repeat(600)}`, "", "granada/"]) {
    assert.deepEqual(resolve(path), { type: "bad" }, path);
  }
  // Whatever is asked, the key stays under games/r/<release>/.
  for (const path of ["/", "/granada/", "/assets/x.js", "/release.json"]) {
    const target = resolve(path);
    assert.ok(releaseKey("20261125-a707db02d7f", target.path).startsWith(`${PREFIX}r/20261125-a707db02d7f/`));
  }
  assert.equal(CHANNEL_KEY, "games/channel.json");
});

test("the type comes from the name, and an unknown kind is never a page", () => {
  assert.equal(contentType("granada/index.html"), "text/html; charset=utf-8");
  assert.equal(contentType("assets/a-1.js"), "text/javascript; charset=utf-8");
  assert.equal(contentType("assets/a-1.css"), "text/css; charset=utf-8");
  assert.equal(contentType("release.json"), "application/json; charset=utf-8");
  // An authored model: its entry file, its data and its textures.
  assert.equal(contentType("media/models/granada/mill.gltf"), "model/gltf+json");
  assert.equal(contentType("media/models/granada/mill.bin"), "application/octet-stream");
  assert.equal(contentType("media/models/granada/textures/stone_base.jpg"), "image/jpeg");
  assert.equal(contentType("assets/x.JS"), "text/javascript; charset=utf-8");
  assert.equal(contentType("assets/x.exe"), "application/octet-stream");
  assert.equal(contentType("LICENSE"), "application/octet-stream");
});

test("only files named by their content are cached for long", () => {
  assert.equal(cacheControl("assets/granada-D4RtFkQL.js"), IMMUTABLE);
  assert.equal(cacheControl("granada/index.html"), SHORT);
  assert.equal(cacheControl("release.json"), SHORT);
});

test("the policy lets a page load only from its own address", () => {
  const headers = securityHeaders();
  const csp = headers["content-security-policy"];
  assert.ok(csp.startsWith("default-src 'none'"));
  assert.ok(csp.includes("script-src 'self';"));
  assert.ok(csp.includes("style-src 'self';"));
  assert.ok(!/unsafe-inline|unsafe-eval|\*/.test(csp));
  assert.ok(!/https?:\/\/(?!islam\.museum|uat\.islam\.museum)/.test(csp), "no outside address without a music origin");
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["x-robots-tag"], "noindex");
  assert.equal(securityHeaders({ noindex: false })["x-robots-tag"], undefined);
  assert.ok(securityHeaders({ musicOrigin: "https://media.islam.museum" })["content-security-policy"].includes("media-src 'self' https://media.islam.museum;"));
  for (const bad of ["http://media.islam.museum", "https://media.islam.museum/path", "https://a.example; script-src *", "javascript:alert(1)"]) assert.throws(() => securityHeaders({ musicOrigin: bad }), bad);
});

test("a pointer is read only if it is well formed", () => {
  const good = { format: "im.play.channel", version: 1, current: "20261125-a707db02d7f", previous: null, commit: "a707db02d7f", updatedAt: "2026-11-25T20:00:00Z" };
  assert.deepEqual(parseChannel(JSON.stringify(good)), good);
  assert.equal(parseChannel(JSON.stringify({ ...good, previous: "20261124-0123456789a" })).previous, "20261124-0123456789a");
  for (const bad of ["", "not json", "null", JSON.stringify({ ...good, format: "other" }), JSON.stringify({ ...good, version: 2 }), JSON.stringify({ ...good, current: "../../ar" }), JSON.stringify({ ...good, current: "20261125-a707db02d7f/../.." }), JSON.stringify({ ...good, previous: "latest" }), JSON.stringify({ ...good, current: 5 })]) {
    assert.equal(parseChannel(bad), null, bad);
  }
  assert.ok(RELEASE_ID.test("20261125-a707db02d7f"));
  assert.ok(!RELEASE_ID.test("20261125-a707db02d7f\n"));
});

test("production and UAT name different Workers, hosts and buckets, and neither names the website's", () => {
  const text = readFileSync(new URL("../wrangler.production.toml", import.meta.url), "utf8");
  const [production, uat] = text.split(/^\[env\.uat\]$/m);
  assert.ok(uat, "the UAT section exists");
  assert.match(production, /^name = "islam-museum-games"$/m);
  assert.match(production, /pattern = "games\.islam\.museum", custom_domain = true/);
  assert.match(production, /bucket_name = "islam-museum-search"/);
  assert.match(uat, /pattern = "uat-games\.islam\.museum", custom_domain = true/);
  assert.match(uat, /bucket_name = "islam-museum-uat"/);
  // The UAT section's settings (comments aside) name nothing of production's.
  const uatSettings = uat.split("\n").filter((line) => !line.trim().startsWith("#")).join("\n");
  assert.ok(!uatSettings.includes("islam-museum-search"));
  assert.ok(!/"games\.islam\.museum"/.test(uatSettings));
  // Neither section takes the website's host or Worker name.
  for (const section of [production, uatSettings]) {
    assert.ok(!/pattern = "(uat\.)?islam\.museum"/.test(section));
    assert.ok(!section.includes("islam-museum-site"));
  }
  // Both environments keep the same bindings and variables, so the same code runs in each.
  for (const name of ["GAMES_BUCKET", "ROBOTS", "MUSIC_ORIGIN"]) assert.equal(text.split(name).length - 1 >= 2, true, name);
});

test("media has its own place under games/, outside every release", () => {
  assert.deepEqual(resolve("/media/music/02-the-ancient-library.m4a"), { type: "media", path: "media/music/02-the-ancient-library.m4a" });
  assert.equal(mediaKey("media/music/02-the-ancient-library.m4a"), "games/media/music/02-the-ancient-library.m4a");
  assert.deepEqual(resolve("/media/../ar/index.html"), { type: "bad" });
  assert.deepEqual(resolve("/granada/media/x.m4a"), { type: "file", path: "granada/media/x.m4a" });
});

test("a span of bytes is read strictly", () => {
  assert.deepEqual(parseRange("bytes=0-99", 1000), { offset: 0, length: 100 });
  assert.deepEqual(parseRange("bytes=900-", 1000), { offset: 900, length: 100 });
  assert.deepEqual(parseRange("bytes=-100", 1000), { offset: 900, length: 100 });
  assert.deepEqual(parseRange("bytes=-5000", 1000), { offset: 0, length: 1000 });
  assert.deepEqual(parseRange("bytes=0-99999", 1000), { offset: 0, length: 1000 });
  for (const bad of ["bytes=1000-", "bytes=500-100", "bytes=-0"]) assert.equal(parseRange(bad, 1000), "invalid", bad);
  for (const ignored of [null, undefined, "", "bytes=-", "bytes=a-b", "items=0-5", "bytes=0-5,10-15"]) assert.equal(parseRange(ignored, 1000), null, String(ignored));
});
