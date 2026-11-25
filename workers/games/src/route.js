// Pure rules of the games host: which R2 object answers a path, with which headers. No I/O here, so every rule
// is unit-tested (test/route.test.mjs).
//
// Layout in the bucket (the same in production and in UAT, each in its own bucket):
//   games/channel.json                 the pointer: which release is live, and the one before it
//   games/r/<release>/<game>/index.html
//   games/r/<release>/assets/<name>-<hash>.js|css
//   games/r/<release>/release.json     the manifest of that release
//   games/media/music/<track>.m4a      the music: not part of any release, because the audio is never in git and
//                                      is uploaded on its own from the machine that holds it
// A release folder is never changed after it is uploaded. Releasing and rolling back change only the pointer.

/** Every object this Worker may read is under this prefix. It never reads another part of the bucket. */
export const PREFIX = "games/";
export const CHANNEL_KEY = `${PREFIX}channel.json`;
/** A release id: the commit's date and its hash, for example 20261125-a707db02d7f. */
export const RELEASE_ID = /^[0-9]{8}-[0-9a-f]{7,40}$/;
export const releaseKey = (release, path) => `${PREFIX}r/${release}/${path}`;
/** Media shared by every release: "/media/music/x.m4a" is the object games/media/music/x.m4a. */
export const MEDIA_PATH = "media/";
export const mediaKey = (path) => `${PREFIX}${path}`;

// Letters, digits, dot, dash, underscore and slash only. Anything else (a space, a percent sign, a backslash)
// is refused before it can become part of an object key.
const SAFE = /^\/[A-Za-z0-9._\/-]*$/;

/**
 * Returns { type: "file", path } | { type: "redirect", location } | { type: "channel" } | { type: "bad" }.
 * `path` is relative to the release folder.
 */
export function resolve(pathname) {
  if (typeof pathname !== "string" || pathname.length > 512 || !SAFE.test(pathname)) return { type: "bad" };
  const segments = pathname.split("/").slice(1);
  // No empty segment ("//"), no way up (".."), no hidden file (".env"): the last segment alone may be empty.
  if (segments.some((s, i) => (s === "" && i !== segments.length - 1) || s.startsWith("."))) return { type: "bad" };
  if (pathname === "/_channel") return { type: "channel" };
  if (pathname.endsWith("/")) return { type: "file", path: `${pathname.slice(1)}index.html` };
  const last = segments[segments.length - 1];
  // "/granada" is the game's folder, asked for without its slash.
  if (!last.includes(".")) return { type: "redirect", location: `${pathname}/` };
  if (pathname.startsWith(`/${MEDIA_PATH}`)) return { type: "media", path: pathname.slice(1) };
  return { type: "file", path: pathname.slice(1) };
}

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".m4a": "audio/mp4",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};
/** The type is decided here from the name, never from what the upload said. An unknown kind is never served as a page. */
export function contentType(path) {
  const dot = path.lastIndexOf(".");
  return (dot >= 0 && CONTENT_TYPES[path.slice(dot).toLowerCase()]) || "application/octet-stream";
}

export const IMMUTABLE = "public, max-age=31536000, immutable";
export const SHORT = "public, max-age=60";
/** Files under assets/ carry the hash of their content in their name and never change; everything else is checked again within a minute. */
export const cacheControl = (path) => (path.startsWith("assets/") ? IMMUTABLE : SHORT);
/** A track's name does not change with its contents, so it is checked again after a day. */
export const MEDIA_CACHE = "public, max-age=86400";

/**
 * Reads a Range header for one span of bytes. Returns { offset, length } within a file of `size` bytes, "invalid"
 * for a span that cannot be satisfied, or null when there is no usable Range header (the whole file is sent).
 * A player asks for audio in spans, and some refuse to play at all from a host that cannot answer them.
 */
export function parseRange(header, size) {
  if (typeof header !== "string") return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  if (m[1] === "") {
    const tail = Number(m[2]);
    if (tail === 0) return "invalid";
    const length = Math.min(tail, size);
    return { offset: size - length, length };
  }
  const start = Number(m[1]);
  const end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (!Number.isSafeInteger(start) || start >= size || end < start) return "invalid";
  return { offset: start, length: end - start + 1 };
}

/**
 * The headers every response carries. They belong to the host, not to the release: nothing uploaded can loosen
 * them. Everything a game needs comes from its own address; `musicOrigin` (a Worker variable) is the one outside
 * address a game may play audio from, and it is empty until the music is hosted.
 */
export function securityHeaders({ musicOrigin = "", noindex = true } = {}) {
  if (musicOrigin && !/^https:\/\/[a-z0-9.-]+$/.test(musicOrigin)) throw new Error(`MUSIC_ORIGIN must be an https origin, got ${musicOrigin}`);
  const csp = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    `media-src 'self'${musicOrigin ? ` ${musicOrigin}` : ""}`,
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'self' https://islam.museum https://uat.islam.museum",
  ].join("; ");
  const headers = {
    "content-security-policy": csp,
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  };
  if (noindex) headers["x-robots-tag"] = "noindex";
  return headers;
}

/** Reads the pointer file. Returns null for anything that is not a well-formed pointer, so a damaged file can never name an object key. */
export function parseChannel(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || data.format !== "im.play.channel" || data.version !== 1) return null;
  if (typeof data.current !== "string" || !RELEASE_ID.test(data.current)) return null;
  if (data.previous != null && (typeof data.previous !== "string" || !RELEASE_ID.test(data.previous))) return null;
  return { format: data.format, version: 1, current: data.current, previous: data.previous ?? null, commit: typeof data.commit === "string" ? data.commit : null, updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null };
}

export const ROBOTS_DISALLOW_TEXT = "User-agent: *\nDisallow: /\n";
export const robotsDisallowed = (env) => (env?.ROBOTS ?? "disallow") === "disallow";
