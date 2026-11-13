// Audit S20: where is the footnote apparatus missing, and why? A page's numbered notes come from {cite:…} markers in
// the record's summary and prose. This counts, per browser family (the "<x>-browser" tags) and per class, the records
// that have no marker anywhere, so the cause is visible: the renderer cannot drop notes that were never written.
//   npm run graph && node scripts/audit/s20-footnotes.mjs
import { readFileSync } from "node:fs";
const g = JSON.parse(readFileSync(".cache/graph.json", "utf8"));
const real = g.nodes.filter((n) => !n.stub && n.class !== "passage" && n.class !== "source" && n.class !== "media");
const hasCite = (n) => /\{cite:/.test(JSON.stringify(n.summary)) || Object.values(n.prose).some((d) => d.sections.some((s) => /\{cite:/.test(s.markdown)));
const row = (list) => { const noProse = list.filter((n) => !Object.keys(n.prose).length).length; const noNotes = list.filter((n) => !hasCite(n)).length; const noSources = list.filter((n) => !(n.data.sources ?? []).length).length; return { records: list.length, no_prose: noProse, no_notes: noNotes, no_sources_listed: noSources }; };
const fams = new Map();
for (const n of real) for (const t of n.tags) if (/-browser$/.test(t)) (fams.get(t) ?? fams.set(t, []).get(t)).push(n);
console.log("family".padEnd(26), "records  no prose  no notes  no sources listed");
for (const [t, list] of [...fams].sort((a, b) => row(b[1]).no_notes / b[1].length - row(a[1]).no_notes / a[1].length)) { const r = row(list); console.log(t.padEnd(26), String(r.records).padStart(7), String(r.no_prose).padStart(9), String(r.no_notes).padStart(9), String(r.no_sources_listed).padStart(8)); }
const all = row(real);
console.log("all subject records".padEnd(26), String(all.records).padStart(7), String(all.no_prose).padStart(9), String(all.no_notes).padStart(9), String(all.no_sources_listed).padStart(8));
