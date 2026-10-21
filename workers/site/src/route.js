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

// Redirect rules with :placeholders or a * splat, as Pages reads them. Each rule keeps its
// placeholder names, so the target can be filled in from the matched path.
export function parseDynamicRedirects(text) {
  const rules = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [from, to, status] = line.split(/\s+/);
    if (!from || !to || !from.startsWith("/")) continue;
    if (!from.includes("*") && !from.includes(":")) continue;
    const names = [];
    let pattern = "";
    for (const part of from.split(/(\*|:[A-Za-z_]\w*)/)) {
      if (part === "*") {
        names.push("splat");
        pattern += "(.*)";
      } else if (part.startsWith(":") && part.length > 1) {
        names.push(part.slice(1));
        pattern += "([^/]+)";
      } else {
        pattern += part.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      }
    }
    rules.push({ pattern: new RegExp(`^${pattern}$`), names, to, status: Number(status ?? 301) });
  }
  return rules;
}

// Returns { location, status } for the first dynamic rule that matches, or null.
export function matchDynamicRedirect(rules, pathname) {
  for (const rule of rules) {
    const match = rule.pattern.exec(pathname);
    if (!match) continue;
    const values = Object.fromEntries(rule.names.map((name, i) => [name, match[i + 1]]));
    const location = rule.to.replace(/:(\w+)/g, (whole, name) => (name in values ? values[name] : whole));
    return { location, status: rule.status };
  }
  return null;
}

// Parses a _headers file. A line that starts at column 0 names the paths; indented
// "Name: value" lines below it are the headers for those paths.
export function parseHeaders(text) {
  const blocks = [];
  let current = null;
  for (const raw of text.split("\n")) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(raw)) {
      const source = raw.trim().split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      current = { pattern: new RegExp(`^${source}$`), headers: {} };
      blocks.push(current);
      continue;
    }
    const colon = raw.indexOf(":");
    if (current && colon > 0) current.headers[raw.slice(0, colon).trim()] = raw.slice(colon + 1).trim();
  }
  return blocks;
}

// Headers from every block whose path matches, later blocks overriding earlier ones.
export function headersFor(blocks, pathname) {
  const out = {};
  for (const block of blocks) {
    if (block.pattern.test(pathname)) Object.assign(out, block.headers);
  }
  return out;
}
