// R2 sync Worker: exports objects as zip parts and applies zip parts (with a
// delete list) to the bucket. Every route needs the bearer token in SYNC_TOKEN.
import { zipSync, unzipSync } from "fflate";

const PART_BYTES = 20 * 1024 * 1024; // target size of one export part
const LIST_PAGE = 200; // objects read from R2 per list call

const MIME = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml",
};

const contentType = (key) => MIME[key.split(".").pop().toLowerCase()] ?? "application/octet-stream";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function authorised(request, env) {
  const expected = `Bearer ${env.SYNC_TOKEN}`;
  return Boolean(env.SYNC_TOKEN) && request.headers.get("authorization") === expected;
}

// GET /export?prefix=sync-test/&after=<key>
// Reads objects under prefix in key order, starting after `after`, until about
// PART_BYTES have been collected. Returns one zip (level 0, objects are already
// compressed or small) with entries named relative to the prefix. Headers:
// X-Next-After (pass back as `after`) and X-Done ("true" when nothing is left).
async function exportPart(url, env) {
  const prefix = url.searchParams.get("prefix") ?? "";
  let after = url.searchParams.get("after") ?? undefined;
  const files = {};
  let bytes = 0;
  let lastKey = null;
  let done = false;

  outer: while (true) {
    const page = await env.SYNC_BUCKET.list({ prefix, startAfter: after, limit: LIST_PAGE });
    for (const obj of page.objects) {
      if (bytes > 0 && bytes + obj.size > PART_BYTES) break outer;
      const body = await env.SYNC_BUCKET.get(obj.key);
      const data = new Uint8Array(await body.arrayBuffer());
      files[obj.key.slice(prefix.length)] = data;
      bytes += data.byteLength;
      lastKey = obj.key;
    }
    if (!page.truncated) {
      done = true;
      break;
    }
    after = page.objects.at(-1)?.key ?? after;
    if (!page.objects.length) break;
  }

  const zip = zipSync(files, { level: 0 });
  return new Response(zip, {
    headers: {
      "content-type": "application/zip",
      "x-next-after": lastKey ?? after ?? "",
      "x-done": String(done),
      "x-entries": String(Object.keys(files).length),
    },
  });
}

// POST /apply?prefix=sync-test/   body: zip
// The zip may contain "__delete.json" (a JSON array of relative keys). Deletes run
// first, then every other entry is written, so a file that is removed and
// re-added in the same run ends up present.
async function applyPart(request, url, env) {
  const prefix = url.searchParams.get("prefix") ?? "";
  const entries = unzipSync(new Uint8Array(await request.arrayBuffer()));

  const deleteList = entries["__delete.json"];
  let deleted = 0;
  if (deleteList) {
    const keys = JSON.parse(new TextDecoder().decode(deleteList)).map((k) => prefix + k);
    for (let i = 0; i < keys.length; i += 1000) {
      await env.SYNC_BUCKET.delete(keys.slice(i, i + 1000));
    }
    deleted = keys.length;
  }

  let written = 0;
  for (const [name, data] of Object.entries(entries)) {
    if (name === "__delete.json") continue;
    if (!name || name.endsWith("/")) return json({ error: `bad entry name: "${name}"` }, 400);
    await env.SYNC_BUCKET.put(prefix + name, data, {
      httpMetadata: { contentType: contentType(name) },
    });
    written += 1;
  }
  return json({ written, deleted });
}

export default {
  async fetch(request, env) {
    if (!authorised(request, env)) return json({ error: "unauthorised" }, 401);

    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/export") return await exportPart(url, env);
      if (request.method === "POST" && url.pathname === "/apply") return await applyPart(request, url, env);
      return json({ error: "not found" }, 404);
    } catch (err) {
      return json({ error: String(err?.message ?? err) }, 500);
    }
  },
};
