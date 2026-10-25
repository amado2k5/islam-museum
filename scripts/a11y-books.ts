// A5 — Braille-ready files (.brf) and accessible EPUB3 books, generated at build time
// from the rendered pages in dist/ (docs/plan/23-accessibility.md). Bounded first
// corpus: the teacher pathways, the Kids' Wing easy reads, and the accessibility
// statement — per language (ar/en/ur). Braille comes from liblouis (pure-JS build,
// tables fetched into node_modules/liblouis/tables at first run); EPUB is a
// hand-rolled ZIP (stored entries) with EPUB Accessibility 1.1 metadata.
// Everything lands in dist/books/ and ships with the static site.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { p } from "./lib";

const DIST = p("dist");
const LANGS = ["ar", "en", "ur"] as const;
const BRL_TABLE: Record<string, string> = {
  ar: "/tables/ar-ar-g1.utb", // liblouis has no Arabic contracted table
  en: "/tables/en-ueb-g2.ctb",
  ur: "/tables/ur-pk-g2.ctb",
};
const LIBLOUIS_VERSION = "3.2.0"; // must match the liblouis-build wasm in node_modules

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---- liblouis (JS build) ----
// easy-api.translateString sizes the output buffer to the input and aborts the
// whole wasm heap when output overflows (Latin in an Arabic table expands ~2x).
// Call lou_translateString directly with a 4x output buffer instead.
const tableDir = p("node_modules", "liblouis", "tables");
if (!fs.existsSync(path.join(tableDir, "ar-ar-g1.utb"))) {
  fs.mkdirSync(tableDir, { recursive: true });
  const tgz = path.join(tableDir, "..", "liblouis-tables.tgz");
  execFileSync("curl", ["-sL", `https://github.com/liblouis/liblouis/archive/refs/tags/v${LIBLOUIS_VERSION}.tar.gz`, "-o", tgz]);
  execFileSync("tar", ["xzf", tgz, "-C", path.join(tableDir, ".."), `liblouis-${LIBLOUIS_VERSION}/tables`, "--strip-components=1"]);
  fs.rmSync(tgz);
}
const EasyApi = createRequire(import.meta.url)("liblouis/easy-api").EasyApi;
const lou = new EasyApi();
lou.enableOnDemandTableLoading(tableDir);
function louTranslate(table: string, s: string): string | null {
  const capi = lou.capi, mem = lou.mem;
  const inP = mem.transfer(capi, s);
  const inLen = mem.getBufferLength(s);
  const outP = capi._malloc(inLen * 8); // blP counts cells; utf16 cells are 2 bytes
  const blP = capi._malloc(4), slP = capi._malloc(4);
  capi.setValue(blP, inLen * 4, "i32");
  capi.setValue(slP, inLen, "i32");
  const ok = capi.ccall("lou_translateString", "number", ["string", "number", "number", "number", "number", "number", "number"], [table, inP, slP, outP, blP, null, null, 0]);
  if (!ok) return null;
  const out = mem.read(capi, outP, blP);
  capi._free(outP); capi._free(inP); capi._free(blP); capi._free(slP);
  return mem.buffToString(out);
}

// Only send the table's own script through: Latin names, digits and symbols
// pass through verbatim (the BRF convention for uncontracted foreign words).
const ARABIC_RUN = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF][\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF \t.,;:!?()«»"'’\u0640-]*/g;

// Some tables (ur-pk-g2) emit Unicode braille cells; BRF readers want the
// NABCC ASCII codes — the fixed cell-pattern-to-ASCII mapping.
const NABCC = " A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=";
const toBrfAscii = (s: string) => [...s].map((c) => {
  const cp = c.codePointAt(0)!;
  return cp >= 0x2800 && cp <= 0x28ff ? NABCC[cp - 0x2800] : c;
}).join("");

function brailleOf(text: string, lang: string): string {
  const safe = (s: string): string => {
    try {
      return louTranslate(BRL_TABLE[lang], s) ?? s;
    } catch {
      if (!/\s/.test(s) || /^\s+$/.test(s)) return s;
      return s.split(/(\s+)/).map((w) => (/^\s*$/.test(w) ? w : safe(w))).join("");
    }
  };
  // Passthrough must still be valid BRF: Arabic-Indic digits become ASCII
  // digits, every digit run gets the '#' number indicator, and any remaining
  // non-ASCII symbol (dashes, emoji, ornaments) collapses to a space.
  const passthrough = (s: string): string => s
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => String(("\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9".indexOf(d)) % 10))
    .replace(/[0-9]+/g, "#$&")
    .replace(/[^\x20-\x7E]/g, " ");
  const braillePara = (words: string): string => {
    if (lang === "en") return toBrfAscii(passthrough(safe(words)));
    let out = "", last = 0;
    for (const m of words.matchAll(ARABIC_RUN)) {
      out += passthrough(words.slice(last, m.index)) + toBrfAscii(safe(m[0]));
      last = m.index! + m[0].length;
    }
    return out + passthrough(words.slice(last));
  };
  const out: string[] = [];
  for (const para of text.split(/\n{2,}/)) {
    const words = para.replace(/\s+/g, " ").trim();
    if (!words) continue;
    const dots = braillePara(words);
    // 40-cell lines, the BRF convention
    for (let i = 0; i < dots.length; i += 40) out.push(dots.slice(i, i + 40));
    out.push("");
  }
  return out.join("\n") + "\n";
}

// ---- EPUB writer (stored entries, mimetype first) ----
interface ZipEnt { name: string; data: Buffer }
function epub(entries: ZipEnt[]): Buffer {
  const locals: Buffer[] = []; const central: Buffer[] = []; let off = 0;
  const crc = (b: Buffer) => zlib.crc32(b) >>> 0;
  for (const e of entries) {
    const name = Buffer.from(e.name);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x800, 6);
    lh.writeUInt32LE(crc(e.data), 14); lh.writeUInt32LE(e.data.length, 18); lh.writeUInt32LE(e.data.length, 22);
    lh.writeUInt16LE(name.length, 26);
    locals.push(lh, name, e.data);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(20, 8); ch.writeUInt16LE(0x800, 10);
    ch.writeUInt32LE(crc(e.data), 16); ch.writeUInt32LE(e.data.length, 20); ch.writeUInt32LE(e.data.length, 24);
    ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(off, 42);
    central.push(ch, name);
    off += lh.length + name.length + e.data.length;
  }
  const cd = Buffer.concat(central); const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50); eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, eocd]);
}

function epubFor(title: string, lang: string, uid: string, bodyHtml: string): Buffer {
  const dir = lang === "ar" || lang === "ur" ? ' dir="rtl"' : "";
  const chapter = `<?xml version="1.0" encoding="utf-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}"${dir}><head><meta charset="utf-8"/><title>${esc(title)}</title></head><body>${bodyHtml}</body></html>`;
  const nav = `<?xml version="1.0" encoding="utf-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}"${dir}><head><meta charset="utf-8"/><title>${esc(title)}</title></head><body><nav epub:type="toc"><h1>${esc(title)}</h1><ol><li><a href="chapter.xhtml">${esc(title)}</a></li></ol></nav></body></html>`;
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" dir="${lang === "ar" || lang === "ur" ? "rtl" : "ltr"}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">islam.museum:${uid}</dc:identifier>
    <dc:title>${esc(title)}</dc:title><dc:language>${lang}</dc:language>
    <dc:creator>islam.museum</dc:creator><dc:rights>CC BY-SA 4.0</dc:rights>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
    <meta name="schema:accessMode">textual</meta>
    <meta name="schema:accessibilityFeature">tableOfContents</meta>
    <meta name="schema:accessibilityFeature">alternativeText</meta>
    <meta name="schema:accessibilityHazard">noFlashingHazard</meta>
    <meta name="schema:accessibilityHazard">noMotionSimulationHazard</meta>
    <meta name="schema:accessibilityHazard">noSoundHazard</meta>
    <meta property="dcterms:conformsTo">http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-aa</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="c1" href="chapter.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine><itemref idref="c1"/></spine>
</package>`;
  const container = `<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`;
  return epub([
    { name: "mimetype", data: Buffer.from("application/epub+zip") },
    { name: "META-INF/container.xml", data: Buffer.from(container) },
    { name: "OEBPS/content.opf", data: Buffer.from(opf) },
    { name: "OEBPS/nav.xhtml", data: Buffer.from(nav) },
    { name: "OEBPS/chapter.xhtml", data: Buffer.from(chapter) },
  ]);
}

// ---- dist page → (title, article html, plain text) ----
function pageParts(file: string): { title: string; html: string; text: string } | null {
  const html = fs.readFileSync(file, "utf8");
  const title = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
  const main = /<main[\s\S]*?<\/main>/.exec(html)?.[0];
  if (!title || !main) return null;
  const body = main
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/<[^>]*\bclass="[^"]*\bno-print\b[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/g, "");
  const text = body
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (m) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " }[m] ?? m))
    .replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim();
  return { title, html: body.replace(/<main[^>]*>/, "").replace(/<\/main>\s*$/, ""), text: `${title}\n\n${text}` };
}

function* walk(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else if (d.name === "index.html") yield p;
  }
}

const corpus: { dir: string; slug: (f: string) => string }[] = [];
for (const lang of LANGS) {
  corpus.push(
    { dir: path.join(DIST, lang, "learn/teachers/pathways"), slug: (f) => `pathway-${path.basename(path.dirname(f))}` },
    { dir: path.join(DIST, lang, "sighar/read"), slug: (f) => `kids-${path.basename(path.dirname(path.dirname(f)))}-${path.basename(path.dirname(f))}` },
  );
}

let made = 0, skipped = 0;
const indexLinks: Record<string, { slug: string; title: string }[]> = { ar: [], en: [], ur: [] };
for (const lang of LANGS) {
  for (const c of corpus) {
    if (!c.dir.includes(`/${lang}/`)) continue;
    for (const f of walk(c.dir)) {
      const parts = pageParts(f);
      if (!parts || parts.text.length < 200) { skipped++; continue; }
      const slug = c.slug(f);
      const out = path.join(DIST, lang, "books");
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, `${slug}.epub`), epubFor(parts.title, lang, `books/${lang}/${slug}`, parts.html));
      fs.writeFileSync(path.join(out, `${slug}.brf`), brailleOf(parts.text, lang), "utf8");
      indexLinks[lang].push({ slug, title: parts.title });
      made++;
    }
  }
}
// a browsable index per language + an accessibility-statement chapter
for (const lang of LANGS) {
  const out0 = path.join(DIST, lang, "books");
  fs.mkdirSync(out0, { recursive: true });
  const stmt = path.join(DIST, lang, "accessibility", "index.html");
  const p = fs.existsSync(stmt) ? pageParts(stmt) : null;
  if (p) {
    const out = path.join(DIST, lang, "books");
    fs.writeFileSync(path.join(out, "accessibility.epub"), epubFor(p.title, lang, `books/${lang}/accessibility`, p.html));
    fs.writeFileSync(path.join(out, "accessibility.brf"), brailleOf(p.text, lang), "utf8");
    indexLinks[lang].unshift({ slug: "accessibility", title: p.title });
  }
  const dir = lang === "ar" || lang === "ur" ? ' dir="rtl"' : "";
  const lis = indexLinks[lang].map(({ slug, title }) => `<li>${esc(title)} — <a href="${slug}.epub">EPUB</a> · <a href="${slug}.brf">Braille (BRF)</a></li>`).join("\n");
  fs.writeFileSync(path.join(DIST, lang, "books", "index.html"),
    `<!doctype html><html lang="${lang}"${dir}><head><meta charset="utf-8"><title>Books — islam.museum</title></head><body><main><h1>Braille and e-books</h1><ul>\n${lis}\n</ul></main></body></html>`);
}
console.log(`a11y-books: ${made} books (EPUB + BRF) written to dist/<lang>/books/, ${skipped} skipped`);
