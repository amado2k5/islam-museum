// Build-time assertions on the rendered site (dist/), run after `npm run build` (see site/package.json).
// Fails on: a Hijri year 0 ("0 هـ"), replacement characters, garbled era marks, footnote links that resolve to nothing,
// placeholder dates. Warns on empty meta descriptions.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { listFiles, p, rel } from "./lib.js";

// Accepts a lazy iterable so callers can read one page at a time; holding every page's HTML in memory
// at once exhausted the Node heap on the full site (about 4 GB).
export function scan(files: Iterable<{ path: string; html: string }>): { errors: string[]; warns: string[] } {
  const errors: string[] = [];
  const warns: string[] = [];
  for (const { path, html } of files) {
    const file = rel(path);
    if (/(^|[^\d٠-٩])0 هـ/.test(html)) errors.push(`${file}: renders year 0 of the Hijri calendar ("0 هـ")`);
    if (html.includes("�")) errors.push(`${file}: contains U+FFFD (replacement character)`);
    if (html.includes("ق.م هـ")) errors.push(`${file}: renders the garbled "ق.م هـ"`);
    if (/\d{4}-\d{2}-\dX/.test(html)) errors.push(`${file}: renders a date with a placeholder digit`);
    const anchors = new Set([...html.matchAll(/\sid="(note-\d+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/href="#(note-\d+)"/g)) {
      if (!anchors.has(m[1])) errors.push(`${file}: footnote link #${m[1]} has no anchor on this page`);
    }
    if (/<meta name="description" content=""/.test(html)) warns.push(`${file}: empty meta description`);
    if (/<li>\s*<\/li>/.test(html)) warns.push(`${file}: empty <li> element`);
  }
  return { errors, warns };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dist = p("dist");
  if (!existsSync(dist)) { console.error("dist/ not found: run npm run build first"); process.exit(2); }
  const paths = listFiles(dist, ".html").filter((f) => !f.includes("/pagefind/"));
  // One page in memory at a time; only the findings are kept.
  function* pages() {
    for (const path of paths) yield { path, html: readFileSync(path, "utf8") };
  }
  const { errors, warns } = scan(pages());
  // the teacher pathway landing pages (E2) must be in the sitemap in the three languages: outreach links to them
  const sitemap = listFiles(dist, ".xml").filter((f) => /sitemap/.test(f)).map((f) => readFileSync(f, "utf8")).join("\n");
  for (const f of listFiles(p("data", "exhibit"), ".yaml").filter((f) => /\/pathway-/.test(f))) {
    const slug = f.replace(/.*\/pathway-/, "").replace(/\.yaml$/, "");
    for (const lang of ["ar", "en", "ur"]) if (!sitemap.includes(`/${lang}/learn/teachers/pathways/${slug}/`)) errors.push(`sitemap: /${lang}/learn/teachers/pathways/${slug}/ is missing`);
  }
  // the teen 60-second pages (E4): every topic's route is in the sitemap in the three languages and
  // its page carries a schema.org Course JSON-LD block
  const topicIds = (readFileSync(p("edu", "topics-50.yaml"), "utf8").match(/^- id: ([a-z0-9-]+)/gm) ?? []).map((m) => m.replace("- id: ", ""));
  for (const lang of ["ar", "en", "ur"]) for (const id of topicIds) {
    if (!sitemap.includes(`/${lang}/shabab/60s/${id}/`)) errors.push(`sitemap: /${lang}/shabab/60s/${id}/ is missing`);
    const f = p("dist", lang, "shabab", "60s", id, "index.html");
    if (!existsSync(f)) { errors.push(`missing page: ${lang}/shabab/60s/${id}/index.html`); continue; }
    if (!readFileSync(f, "utf8").includes('"@type":"Course"')) errors.push(`${lang}/shabab/60s/${id}/ has no Course JSON-LD`);
  }
  // the offline teacher packs (E3 step 5): one self-contained file per pack and language — it exists,
  // is at most 2 MB, and carries no <script src and no absolute http(s) URL (an xmlns is a namespace,
  // not a fetch), so it opens from file:// with no internet
  const packIds = (readFileSync(p("edu", "packs.yaml"), "utf8").match(/- id: ([a-z-]+)/g) ?? []).map((m) => m.replace("- id: ", ""));
  for (const lang of ["ar", "en", "ur"]) for (const id of packIds) {
    const f = p("dist", lang, "learn", "teachers", "offline", `${id}.html`);
    if (!existsSync(f)) { errors.push(`offline pack missing: ${lang}/learn/teachers/offline/${id}.html`); continue; }
    const buf = readFileSync(f);
    if (buf.byteLength > 2 * 1024 * 1024) errors.push(`${lang}/learn/teachers/offline/${id}.html is ${buf.byteLength} bytes; a pack is at most 2 MB`);
    const h = buf.toString("utf8");
    if (/<script[^>]*\ssrc=/.test(h)) errors.push(`${lang}/learn/teachers/offline/${id}.html has a <script src>`);
    const urls = h.replace(/xmlns="[^"]*"/g, "");
    if (/https?:\/\//.test(urls)) errors.push(`${lang}/learn/teachers/offline/${id}.html references an absolute http(s) URL`);
  }
  for (const w of warns) console.log("warn  " + w);
  for (const e of errors) console.log("ERROR " + e);
  console.log(`checked ${paths.length} pages: ${errors.length} errors, ${warns.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}
