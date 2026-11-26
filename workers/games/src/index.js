// The games host: one Worker that answers https://games.islam.museum (and, as its UAT twin, uat-games.islam.museum)
// from objects under games/ in the environment's own R2 bucket. It runs no game logic and keeps no state about a
// visitor: a path comes in, one object goes out, with the headers the host decides.
import { CHANNEL_KEY, MEDIA_CACHE, ROBOTS_DISALLOW_TEXT, cacheControl, contentType, mediaKey, parseChannel, parseRange, releaseKey, resolve, robotsDisallowed, securityHeaders } from "./route.js";

/** How long one running copy of the Worker trusts the pointer before reading it again. A release is live everywhere within this time. */
export const CHANNEL_TTL_MS = 30_000;
let pointer = { at: 0, channel: null };
/** For tests: forget the pointer. */
export const forgetChannel = () => {
  pointer = { at: 0, channel: null };
};

async function channelOf(env, now) {
  if (pointer.channel && now - pointer.at < CHANNEL_TTL_MS) return pointer.channel;
  try {
    const object = await env.GAMES_BUCKET.get(CHANNEL_KEY);
    const channel = object ? parseChannel(await object.text()) : null;
    // A missing or damaged pointer never replaces a good one already in hand.
    if (channel) pointer = { at: now, channel };
  } catch {
    // The bucket could not be read: keep serving the release already known.
  }
  return pointer.channel;
}

export default {
  async fetch(request, env) {
    const security = securityHeaders({ musicOrigin: env.MUSIC_ORIGIN ?? "", noindex: robotsDisallowed(env) });
    const head = request.method === "HEAD";
    const respond = (body, status, headers = {}) => new Response(head || status === 304 ? null : body, { status, headers: { ...headers, ...security } });
    if (request.method !== "GET" && !head) return respond(null, 405, { allow: "GET, HEAD", "cache-control": "no-store" });

    const url = new URL(request.url);
    if (url.pathname === "/robots.txt" && robotsDisallowed(env)) return respond(ROBOTS_DISALLOW_TEXT, 200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });

    const target = resolve(url.pathname);
    if (target.type === "bad") return respond(null, 404, { "cache-control": "no-store" });
    if (target.type === "redirect") return respond(null, 301, { location: target.location + url.search, "cache-control": "no-store" });

    // Music and other shared media do not belong to a release, so they need no pointer.
    if (target.type === "media") {
      const key = mediaKey(target.path);
      const whole = await env.GAMES_BUCKET.head(key);
      if (!whole) return respond(null, 404, { "cache-control": "no-store" });
      const base = { "content-type": contentType(target.path), "cache-control": MEDIA_CACHE, etag: whole.httpEtag, "accept-ranges": "bytes" };
      const range = parseRange(request.headers.get("range"), whole.size);
      if (range === "invalid") return respond(null, 416, { ...base, "content-range": `bytes */${whole.size}` });
      if (!range && request.headers.get("if-none-match") === whole.httpEtag) return respond(null, 304, base);
      if (head) return respond(null, 200, { ...base, "content-length": String(whole.size) });
      const object = await env.GAMES_BUCKET.get(key, range ? { range } : undefined);
      if (!object) return respond(null, 404, { "cache-control": "no-store" });
      return range ? respond(object.body, 206, { ...base, "content-range": `bytes ${range.offset}-${range.offset + range.length - 1}/${whole.size}`, "content-length": String(range.length) }) : respond(object.body, 200, { ...base, "content-length": String(whole.size) });
    }

    const channel = await channelOf(env, Date.now());
    // Nothing has been released into this bucket yet (or its pointer cannot be read and none was ever read).
    if (!channel) return respond(null, 503, { "retry-after": "60", "cache-control": "no-store" });
    if (target.type === "channel") return respond(JSON.stringify(channel), 200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });

    let object = await env.GAMES_BUCKET.get(releaseKey(channel.current, target.path));
    // A page opened just before a release still asks for the scripts of the release it came from. Their names carry
    // the hash of their content, so answering from the release before cannot serve the wrong file.
    if (!object && channel.previous && target.path.startsWith("assets/")) object = await env.GAMES_BUCKET.get(releaseKey(channel.previous, target.path));
    if (!object) {
      const page = await env.GAMES_BUCKET.get(releaseKey(channel.current, "404.html"));
      return respond(page ? page.body : null, 404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    }
    const headers = { "content-type": contentType(target.path), "cache-control": cacheControl(target.path), etag: object.httpEtag };
    if (request.headers.get("if-none-match") === object.httpEtag) {
      await object.body?.cancel?.();
      return respond(null, 304, headers);
    }
    return respond(object.body, 200, headers);
  },
};
