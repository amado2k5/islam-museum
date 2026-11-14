// Validates docs/library/harvest-register.yaml (see docs/library/README.md). Build-time only.
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const FILE = "docs/library/harvest-register.yaml";
const raw = readFileSync(FILE, "utf8");
const doc = parse(raw) as Record<string, any>;
const errors: string[] = [];
const warnings: string[] = [];
const COMPLETION = new Set(["claimed", "downloaded", "ocr_done", "mining", "mined", "ingested", "complete", "deleted"]);
const ARCHIVE = new Set(["none", "partial", "complete", "verified"]);
const ids = new Set<string>();

if (/(^|[\s"'(=:])\/(Users|home)\/|[A-Za-z]:\\Users\\|\/Volumes\//m.test(raw)) errors.push("absolute home or volume path found; use paths relative to the harvest root");
if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(raw)) errors.push("email address found");

for (const section of ["books", "audio_series", "video_series", "websites", "datasets"]) {
  const list = doc[section] ?? [];
  if (!Array.isArray(list)) { errors.push(`${section}: missing list`); continue; }
  for (const e of list) {
    const id = e?.id;
    if (!id) { errors.push(`${section}: entry without id`); continue; }
    if (ids.has(id)) errors.push(`duplicate id ${id}`);
    ids.add(id);
    if (!e.title) warnings.push(`${id}: no title`);
    if (!e.completion) warnings.push(`${id}: no completion`);
    else if (!COMPLETION.has(e.completion)) errors.push(`${id}: bad completion ${e.completion}`);
    if (section === "books") {
      if (e.ocr_archive?.state && !ARCHIVE.has(e.ocr_archive.state)) errors.push(`${id}: bad ocr_archive.state`);
      if (!e.ocr_archive) warnings.push(`${id}: no ocr_archive block`);
    }
    if (e.completion === "deleted") {
      const d = e.deletion;
      if (!d || !d.date || !d.restore?.url) errors.push(`${id}: deleted without deletion block (date, restore url)`);
      if (!d?.kept?.includes("ocr_archive")) errors.push(`${id}: deleted without kept: [ocr_archive]`);
      if (e.ocr_archive?.state !== "verified" || !e.ocr_archive?.sha256) errors.push(`${id}: deleted but OCR archive not verified with sha256`);
    }
  }
}
for (const w of warnings.slice(0, 50)) console.warn("warn:", w);
if (warnings.length > 50) console.warn(`warn: ${warnings.length - 50} more`);
for (const x of errors) console.error("error:", x);
console.log(`harvest register: ${ids.size} entries, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
