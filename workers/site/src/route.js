// Pure routing for HTML pages served from R2. No Cloudflare imports, so it can be tested with node:test.
//
// Pages under /ar/, /en/ and /ur/ are stored in R2 under the same paths, with the
// "index.html" file names Astro writes (for example "ar/person/muhammad/index.html").
// The site keeps trailingSlash "always", so a request without a slash is redirected.

export const LANGS = ["ar", "en", "ur"];

const isLangPath = (pathname) => LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

// Returns { type: "r2", key } | { type: "redirect", location } | { type: "assets" }.
export function resolve(pathname) {
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
