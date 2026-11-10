// Two fast guards for the site's build inputs (docs/site/checks.md, "Site inputs").
//
// On 17 Oct 2026 a commit rewrote i18n/ar.yaml, i18n/en.yaml and site/package.json wholesale and dropped the
// top-level blocks `reader:`, `hadith:`, `poetry:`, `support:`, `art:`, nested keys such as `landing.shop_cats` and
// `nav.donate`, and the `simple-icons` dependency. `npm run validate` and `npm test` passed; the failure surfaced
// minutes into the Astro build ("Cannot read properties of undefined (reading 'apparel')" on /ar/index.html) and
// broke every deploy for hours. These tests make both mistakes fail in seconds:
//
//   1. every i18n path a page, layout, component or script reads exists in i18n/ar.yaml. The scan follows aliases:
//      `const T = ui(lang)`, `const L = T.landing`, `const R = ui(lang).references`, then `L.shop_cats.apparel`,
//      `T.nav.donate`, `R.title` are checked as the paths `landing.shop_cats.apparel`, `nav.donate`,
//      `references.title`;
//   2. every bare module specifier imported under site/src is declared in site/package.json.
import { readdirSync, readFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { join, relative } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { p, rel } from "./lib";

const SITE_SRC = p("site", "src");
const SOURCE_EXT = [".astro", ".ts", ".svelte", ".mjs", ".js"];

/** Every source file under site/src, sorted for stable messages. */
function sourceFiles(dir = SITE_SRC): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) out.push(...sourceFiles(f));
    else if (SOURCE_EXT.some((x) => e.name.endsWith(x))) out.push(f);
  }
  return out.sort();
}

// ---------------------------------------------------------------------------------------------------------------
// 1. i18n paths

/**
 * Dynamic reads of the i18n table cannot be checked by a scan. `T.wings[w]`, `L.shop_cats[c.key]` still have their
 * static prefix (`wings`, `landing.shop_cats`) checked; the keys they reach can be declared here, per file (relative
 * to site/src), as dotted paths that are then checked like static reads. A dynamic read with no checkable prefix
 * (`T[hall]`) must be declared here or the test fails.
 */
const DYNAMIC_I18N_READS: Record<string, string[]> = {
  // GiftShop.astro reads `L.shop_cats[c.key]` for the eight categories of the carousel (the keys that vanished
  // in the 17 Oct 2026 rewrite).
  "components/GiftShop.astro": ["apparel", "art", "books", "ceramics", "home", "jewelry", "kids", "oud"].map((k) => `landing.shop_cats.${k}`),
};

const IDENT = "[A-Za-z_$][\\w$]*";
const UI_CALL = "ui\\([^()]*\\)";
/** The accessor chain after a head: `.key`, `?.key`, `["key"]`, `[expr]`, repeated. */
const CHAIN = `((?:\\?\\.${IDENT}|\\.${IDENT}|\\[\\s*(?:"[^"]*"|'[^']*'|[^\\]]*)\\s*\\])*)`;
const esc = (s: string) => s.replace(/[$]/g, "\\$");

type Read = { path: string[]; dynamic: boolean; text: string };

/** Split an accessor chain into static segments, stopping at the first dynamic index or optional access. */
function segments(chain: string): { path: string[]; dynamic: boolean } {
  const path: string[] = [];
  const re = new RegExp(`\\?\\.(${IDENT})|\\.(${IDENT})|\\[\\s*(?:"([^"]*)"|'([^']*)'|([^\\]]*))\\s*\\]`, "g");
  for (const m of chain.matchAll(re)) {
    if (m[1] !== undefined) return { path, dynamic: false }; // `?.x` tolerates absence by design
    if (m[2] !== undefined) path.push(m[2]);
    else if (m[3] !== undefined) path.push(m[3]);
    else if (m[4] !== undefined) path.push(m[4]);
    else if (m[5]!.trim() === "") return { path, dynamic: false }; // `T[]` is a type, not a read
    else return { path, dynamic: true };
  }
  return { path, dynamic: false };
}

/** Every i18n read in a source file as a dotted path, following aliases bound in that file. */
export function i18nReads(source: string): Read[] {
  // Names bound to the table or to a sub-block: `const T = ui(lang)`, `const L = T.landing`, `const R = ui(lang).x`.
  const bound = new Map<string, string[]>();
  const headOf = (name: string | null) => (name === null ? UI_CALL : `(?<![\\w$.])${esc(name)}(?![\\w$])`);
  const decl = (head: string) => new RegExp(`\\b(?:const|let|var)\\s+(${IDENT})\\s*=\\s*${head}${CHAIN}\\s*(?=[;,\\n\\r]|$)`, "g");
  // Bind in passes so an alias of an alias (`const C = L.cats`) resolves whatever order it is written in.
  let changed = true;
  while (changed) {
    changed = false;
    for (const name of [null, ...bound.keys()]) {
      const base = name === null ? [] : bound.get(name)!;
      for (const m of source.matchAll(decl(headOf(name)))) {
        const s = segments(m[2]);
        if (s.dynamic || bound.has(m[1])) continue;
        bound.set(m[1], [...base, ...s.path]);
        changed = true;
      }
    }
  }
  const reads: Read[] = [];
  for (const name of [null, ...bound.keys()]) {
    const base = name === null ? [] : bound.get(name)!;
    for (const m of source.matchAll(new RegExp(`${headOf(name)}${CHAIN}`, "g"))) {
      const s = segments(m[1]);
      if (!s.path.length && !s.dynamic) continue; // the bare name (its own declaration, a function argument)
      reads.push({ path: [...base, ...s.path], dynamic: s.dynamic, text: m[0].trim() });
    }
  }
  return reads;
}

/**
 * Walk a dotted path through the parsed table. Returns the missing path, or null when every segment up to the first
 * non-object value exists (a string's `.length` or `.replace` is not an i18n key).
 */
export function missingPath(table: unknown, path: string[]): string | null {
  let cur: any = table;
  for (let i = 0; i < path.length; i++) {
    if (cur === null || typeof cur !== "object" || Array.isArray(cur)) return null;
    if (!(path[i] in cur)) return path.slice(0, i + 1).join(".");
    cur = cur[path[i]];
  }
  return null;
}

// ---------------------------------------------------------------------------------------------------------------
// 2. bare imports

/** Static, re-exported and dynamic import specifiers in a source file (Astro front matter, TS, Svelte script). */
export function importSpecifiers(source: string): string[] {
  const out: string[] = [];
  const RE = [
    /\bimport\s+(?:type\s+)?[\w*{}\s,$]*?\s*from\s*["']([^"']+)["']/g, // import x from "y"; import { a } from "y"
    /\bimport\s*["']([^"']+)["']/g, // import "y" (side-effect import)
    /\bexport\s+(?:type\s+)?[\w*{}\s,$]*?\s*from\s*["']([^"']+)["']/g, // export { a } from "y"
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g, // import("y")
  ];
  for (const re of RE) for (const m of source.matchAll(re)) out.push(m[1]);
  return out;
}

const RELATIVE_OR_VIRTUAL = /^(\.|\/|astro:|node:|virtual:|~|@\/)/;
const NODE_BUILTINS = new Set(builtinModules);

/** The package a bare specifier belongs to: `@scope/name/sub?url` → `@scope/name`, `three/addons` → `three`. */
export function packageOf(spec: string): string | null {
  if (RELATIVE_OR_VIRTUAL.test(spec)) return null;
  const clean = spec.split("?")[0];
  if (NODE_BUILTINS.has(clean)) return null;
  const parts = clean.split("/");
  return clean.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

// ---------------------------------------------------------------------------------------------------------------

describe("site inputs (i18n paths and dependencies)", () => {
  const files = sourceFiles();
  const sources = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

  it("scans the site sources", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it("finds every i18n path the site reads in i18n/ar.yaml", () => {
    const table = parse(readFileSync(p("i18n", "ar.yaml"), "utf8")) as Record<string, unknown>;
    const missing = new Set<string>();
    const undeclared: string[] = [];
    let checked = 0;
    for (const [file, source] of sources) {
      const site = relative(SITE_SRC, file);
      const declared = DYNAMIC_I18N_READS[site] ?? [];
      const reads = [...i18nReads(source), ...declared.map((d) => ({ path: d.split("."), dynamic: false, text: `declared ${d}` }))];
      for (const r of reads) {
        if (r.dynamic && r.path.length === 0 && !(site in DYNAMIC_I18N_READS)) undeclared.push(`${rel(file)}: ${r.text}`);
        if (!r.path.length) continue;
        checked++;
        const miss = missingPath(table, r.path);
        if (miss) missing.add(`${rel(file)}: ${r.text} → i18n path "${miss}" is not in i18n/ar.yaml`);
      }
    }
    for (const site of Object.keys(DYNAMIC_I18N_READS)) if (!sources.has(join(SITE_SRC, site))) missing.add(`DYNAMIC_I18N_READS names a file that does not exist: ${site}`);
    expect(checked).toBeGreaterThan(500); // the scan found the pages; a regex drift would otherwise pass silently
    expect([...missing].sort(), "i18n paths read by the site but absent from i18n/ar.yaml (dropped in a rewrite?)").toEqual([]);
    expect(undeclared, "a dynamic read with no checkable prefix must be declared in DYNAMIC_I18N_READS").toEqual([]);
  });

  it("declares every bare import under site/src in site/package.json", () => {
    const pkg = JSON.parse(readFileSync(p("site", "package.json"), "utf8"));
    const declared = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
    const missing: string[] = [];
    let total = 0;
    for (const [file, source] of sources) {
      for (const spec of importSpecifiers(source)) {
        const name = packageOf(spec);
        if (!name) continue;
        total++;
        if (!declared.has(name)) missing.push(`${rel(file)}: "${spec}" (package ${name})`);
      }
    }
    expect(total).toBeGreaterThan(5);
    expect(missing, "packages imported by the site but not declared in site/package.json (dropped in a rewrite?)").toEqual([]);
  });

  it("recognises the access and import shapes it guards", () => {
    const paths = (src: string) => i18nReads(src).map((r) => (r.dynamic ? `${r.path.join(".")}[*]` : r.path.join("."))).sort();
    // Aliases, nested keys, bracket keys, dynamic indexes and optional chaining.
    expect(paths(`const T = ui(lang);\nconst L = T.landing;\nconst C = L.shop_cats;\n{L.shop_title} {C.oud} {T.nav.donate.length} {ui(lang).wings[w].title} {T["footer"].support} {T.by_values?.x} {T[hall]}`))
      .toEqual(["[*]", "by_values", "footer.support", "landing", "landing.shop_cats", "landing.shop_cats.oud", "landing.shop_title", "nav.donate.length", "wings[*]"]);
    // A `T` that is not the i18n table (a generic, `payload.t`) is not scanned.
    expect(paths(`const T = payload.t ?? {};\nT.ah;\nfunction f<T>(a: T[]) {}`)).toEqual([]);
    // A name bound to a sub-block resolves under it.
    expect(paths(`const T = ui(lang).references;\nT.books;`)).toEqual(["references", "references.books"]);
    const table = { landing: { shop_cats: { oud: "x" }, title: "t" }, nav: { home: "h" } };
    expect(missingPath(table, ["landing", "shop_cats", "oud"])).toBeNull();
    expect(missingPath(table, ["landing", "title", "length"])).toBeNull(); // a string method, not a key
    expect(missingPath(table, ["landing", "shop_cats", "apparel"])).toBe("landing.shop_cats.apparel");
    expect(missingPath(table, ["nav", "donate"])).toBe("nav.donate");
    expect(missingPath(table, ["support"])).toBe("support");
    expect(importSpecifiers(`import { parse } from "yaml";\nimport "./global.css";\nimport type { A } from 'astro';\nexport { x } from "three/addons";\nconst m = await import("marked");`)
      .sort()).toEqual(["./global.css", "astro", "marked", "three/addons", "yaml"]);
    expect(packageOf("@fontsource/amiri/files/x.woff2?url")).toBe("@fontsource/amiri");
    expect(packageOf("three/examples/jsm/x")).toBe("three");
    expect(packageOf("node:fs")).toBeNull();
    expect(packageOf("fs")).toBeNull();
    expect(packageOf("astro:content")).toBeNull();
    expect(packageOf("../lib/i18n")).toBeNull();
  });
});
