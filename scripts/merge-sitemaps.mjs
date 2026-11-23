// Makes the whole site's sitemap from the sitemaps of the one-language builds (the by-language build,
// .github/workflows/build-lang.yml, docs/engineering/06-deployment.md section 9).
//
// A one-language build writes a sitemap of its own pages only, and without the links to the other languages. This
// script takes the page addresses out of every language's sitemap, joins them, and hands the full list to the same
// two functions of @astrojs/sitemap the one build uses, with the same settings as site/astro.config.mjs. The result is
// the sitemap the one build writes: the same addresses, the same order, the same language links, the same file split.
//
// Usage: node scripts/merge-sitemaps.mjs --out dist <dir of one language's sitemap files> [<dir> ...]
// Writes <out>/sitemap-<n>.xml, <out>/sitemap-index.xml and <out>/sitemap.xml (a copy of the index, as the one build makes).
import { readdirSync, readFileSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { generateSitemap } from "../site/node_modules/@astrojs/sitemap/dist/generate-sitemap.js";
import { writeSitemap } from "../site/node_modules/@astrojs/sitemap/dist/write-sitemap.js";
import { SITEMAP_CONFIG_DEFAULTS } from "../site/node_modules/@astrojs/sitemap/dist/config-defaults.js";

// Keep in step with site/astro.config.mjs (`site` and the sitemap integration's i18n block).
const SITE = "https://islam.museum/";
const I18N = { defaultLocale: "ar", locales: { ar: "ar", en: "en", ur: "ur", fr: "fr", es: "es", tr: "tr", id: "id" } };

const unescape = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Every page address (<loc> of a <url>) in the sitemap-<n>.xml files of one directory. */
export function pagesOf(dir) {
  const pages = [];
  for (const name of readdirSync(dir).filter((n) => /^sitemap-\d+\.xml$/.test(n))) {
    const xml = readFileSync(join(dir, name), "utf8");
    for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>/g)) pages.push(unescape(m[1]));
  }
  return pages;
}

export async function mergeSitemaps(dirs, out) {
  const pages = new Set();
  for (const dir of dirs) {
    const found = pagesOf(dir);
    if (found.length === 0) throw new Error(`no page addresses found in ${dir}: refusing to write a sitemap that misses a language`);
    for (const p of found) pages.add(p);
  }
  const urlData = generateSitemap([...pages], SITE, { i18n: I18N });
  await writeSitemap({ filenameBase: SITEMAP_CONFIG_DEFAULTS.filenameBase, hostname: SITE, destinationDir: resolve(out), publicBasePath: "/", sourceData: urlData, limit: SITEMAP_CONFIG_DEFAULTS.entryLimit });
  copyFileSync(join(out, "sitemap-index.xml"), join(out, "sitemap.xml"));
  return urlData.length;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf("--out");
  if (i < 0 || !argv[i + 1]) throw new Error("usage: node scripts/merge-sitemaps.mjs --out <dist> <dir> [<dir> ...]");
  const out = argv[i + 1];
  const dirs = argv.filter((_, k) => k !== i && k !== i + 1);
  if (dirs.length === 0) throw new Error("no sitemap directories given");
  const n = await mergeSitemaps(dirs, out);
  console.log(`[merge-sitemaps] ${n} page addresses from ${dirs.length} language sitemap(s) written to ${out}`);
}
