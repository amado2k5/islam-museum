// Tafsir Browser data (docs/plan/27-tafsir-browser.md), read from the one graph and nothing else.
// A commentary is a work; a printed volume is a work of kind tafsir-volume, part_of its commentary, whose `sources`
// name the source record the verse digests cite. A verse is "covered" by a volume when its own prose cites that
// volume's source, or when the volume record carries an `about` edge to it: the two are kept in step by the tafsir
// lane, and reading both means a page never shows less than the museum holds.
import { byId, realNodes, edgesFrom, labelOf } from "./graph";
import type { Lang } from "./i18n";

type N = (typeof realNodes)[number];
const works = realNodes.filter((n) => n.class === "work");

/** Every Qur'an commentary in the catalogue, in the catalogue's own order. */
export const commentaries: N[] = works.filter((n) => n.id === "work/jami-al-bayan" || n.data.kind === "tafsir");
/** Every printed volume, in volume order. */
export const volumes: N[] = works
  .filter((n) => n.data.kind === "tafsir-volume")
  .sort((a, b) => String(a.id).localeCompare(String(b.id), "en", { numeric: true }));

/** The commentary a volume belongs to (its part_of edge). */
export const commentaryOf = (volume: N): N | undefined => {
  const e = edgesFrom(volume.id).find((x) => x.type === "part_of" && byId.get(String(x.to))?.class === "work");
  return e ? (byId.get(String(e.to)) as N) : undefined;
};
/** The commentator(s): the commentary's `authors` list and any authored_by relation. */
export const authorsOf = (work: N): N[] => {
  const ids = [...new Set([...(work.data.authors ?? []), ...(work.data.relations ?? []).filter((r: any) => r.type === "authored_by").map((r: any) => r.target)])];
  return ids.map((id) => byId.get(id)).filter(Boolean) as N[];
};
export const volumeHref = (lang: Lang, volume: N) => `/${lang}/tafsir/${volume.id.replace("work/", "")}/`;
export const surahHref = (lang: Lang, sura: number) => `/${lang}/tafsir/surah/${sura}/`;

// --- which source record stands for which volume (cite lines name sources, not works)
const volumeBySource = new Map<string, N>();
for (const v of volumes) for (const s of v.data.sources ?? []) volumeBySource.set(String(s), v);
const CITE = /\{cite:([a-z0-9-]+)/g;
/** The volumes a piece of markdown cites, in order of first mention. */
export const citedVolumes = (md: string): N[] => {
  const out: N[] = [];
  for (const m of md.matchAll(CITE)) {
    const v = volumeBySource.get(`source/${m[1]}`);
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
};
const citesTafsir = (md: string) => citedVolumes(md).length > 0;

// --- verse coverage, computed once
export interface AyahRef { id: string; sura: number; aya: number }
const ayahs = realNodes.filter((n) => n.class === "passage" && n.data.unit === "ayah");
export const surahs: N[] = realNodes.filter((n) => n.class === "passage" && n.data.unit === "sura").sort((a, b) => a.data.sura - b.data.sura);
const ayahsBySura = new Map<number, N[]>();
for (const a of ayahs) (ayahsBySura.get(a.data.sura) ?? ayahsBySura.set(a.data.sura, []).get(a.data.sura)!).push(a);
for (const list of ayahsBySura.values()) list.sort((a, b) => a.data.aya - b.data.aya);
export const ayahsOf = (sura: number): N[] => ayahsBySura.get(sura) ?? [];

const coverage = new Map<string, N[]>(); // passage id -> volumes
const add = (pid: string, v: N) => { const l = coverage.get(pid) ?? coverage.set(pid, []).get(pid)!; if (!l.includes(v)) l.push(v); };
for (const a of ayahs) {
  const doc = a.prose.ar ?? a.prose.en ?? Object.values(a.prose)[0];
  for (const s of doc?.sections ?? []) for (const v of citedVolumes(s.markdown)) add(a.id, v);
}
for (const v of volumes)
  for (const e of edgesFrom(v.id)) if (e.type === "about" && /^passage\/quran-\d+-\d+$/.test(String(e.to)) && byId.has(String(e.to))) add(String(e.to), v);

/** The volumes that comment on a verse (empty when the museum holds no digest for it). */
export const volumesOn = (passageId: string): N[] => coverage.get(passageId) ?? [];
export const isCovered = (passageId: string) => coverage.has(passageId);
export const coveredCount = coverage.size;
/** The verses a volume covers, in mushaf order. */
export const versesOf = (volume: N): N[] =>
  ayahs.filter((a) => volumesOn(a.id).includes(volume)).sort((a, b) => a.data.sura - b.data.sura || a.data.aya - b.data.aya);
/** The commentaries that are read verse by verse today (those with at least one covered verse). */
export const wiredCommentaries: N[] = commentaries.filter((c) => volumes.some((v) => commentaryOf(v) === c && versesOf(v).length > 0));
/** The verse numbers of a surah that carry a digest. */
export const coveredIn = (sura: number): number[] => ayahsOf(sura).filter((a) => isCovered(a.id)).map((a) => a.data.aya as number);
/** The surahs with at least one covered verse. */
export const coveredSurahs: number[] = surahs.map((s) => s.data.sura as number).filter((n) => coveredIn(n).length > 0);

/** Collapse sorted verse numbers into runs: [1,2,4,5,6] -> [[1,2],[4,6]]. */
export const runs = (nums: number[]): [number, number][] => {
  const out: [number, number][] = [];
  for (const n of nums) {
    const last = out[out.length - 1];
    if (last && n === last[1] + 1) last[1] = n; else out.push([n, n]);
  }
  return out;
};
export const runsText = (nums: number[]) => runs(nums).map(([a, b]) => (a === b ? String(a) : `${a}–${b}`)).join(", ");

/** One volume's coverage surah by surah, with the gaps inside the range it covers named as gaps. */
export interface VolumeSurah { sura: number; node: N; covered: number[]; gaps: number[] }
export const volumeSurahs = (volume: N): VolumeSurah[] => {
  const vs = versesOf(volume);
  if (!vs.length) return [];
  const first = vs[0], last = vs[vs.length - 1];
  const out: VolumeSurah[] = [];
  for (let s = first.data.sura; s <= last.data.sura; s++) {
    const node = byId.get(`passage/quran-${s}`) as N | undefined;
    if (!node) continue;
    const all = ayahsOf(s).map((a) => a.data.aya as number);
    const lo = s === first.data.sura ? first.data.aya : 1;
    const hi = s === last.data.sura ? last.data.aya : all[all.length - 1];
    const covered = vs.filter((a) => a.data.sura === s).map((a) => a.data.aya as number);
    // a verse inside the volume's own range that no digest of ANY volume reaches is a gap; one another volume holds is not
    const gaps = all.filter((a) => a >= lo && a <= hi && !covered.includes(a) && !isCovered(`passage/quran-${s}-${a}`));
    out.push({ sura: s, node, covered, gaps });
  }
  return out;
};

// --- the digest inside a verse's prose
export interface ProseSection { heading: string; markdown: string }
export interface TafsirBlock { heading: string | null; markdown: string; volumes: N[] }
const BOLD_LINE = /^\*\*[^\n]*\*\*$/;
/**
 * Lift the commentary out of a verse's prose sections. The digest sits either in a section of its own or at the end of
 * the "place" section, after that section's opening lines; nothing but the digest follows it in a section (measured on
 * all 1,715 digests, 13 November 2026). So: from the first paragraph that cites a tafsir volume (and any bold caption
 * line directly above it) to the end of the section is commentary; what stands before it stays where it was.
 */
export function splitTafsir<T extends ProseSection>(sections: T[]): { rest: T[]; blocks: TafsirBlock[] } {
  const rest: T[] = [];
  const blocks: TafsirBlock[] = [];
  for (const s of sections) {
    const paras = s.markdown.split(/\n\s*\n/).filter((p) => p.trim());
    let cut = paras.findIndex(citesTafsir);
    if (cut < 0) { rest.push(s); continue; }
    while (cut > 0 && BOLD_LINE.test(paras[cut - 1].trim())) cut--;
    const md = paras.slice(cut).join("\n\n");
    blocks.push({ heading: cut === 0 ? s.heading : null, markdown: md, volumes: citedVolumes(md) });
    if (cut > 0) rest.push({ ...s, markdown: paras.slice(0, cut).join("\n\n") });
  }
  return { rest, blocks };
}

/** "Surah name (n)" in the page's language. */
export const surahName = (sura: number, lang: Lang) => { const n = byId.get(`passage/quran-${sura}`); return n ? labelOf(n, lang) : String(sura); };
