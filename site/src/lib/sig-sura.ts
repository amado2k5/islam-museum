// Shared reads for the signature views that lay the Qur'an out by surah (TwoAbodes, QiyamaRevelation): the 114 surah
// records, and the Qur'an ayah passages a hereafter browser holds, grouped by surah. Nothing is typed here: the
// surahs, their revelation order and place, and every ayah come from the graph, and the build throws when they
// stop matching what the views assume.
import { realNodes, labelOf } from "./graph";
import type { Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

export const surahNodes: Node[] = realNodes
  .filter((n) => n.class === "passage" && n.data.unit === "sura")
  .sort((a, b) => a.data.sura - b.data.sura);

/** Throws when the surah records are not exactly suras 1..114 with a revelation order that is a permutation. */
export function checkSurahs(who: string): void {
  if (surahNodes.length !== 114 || surahNodes.some((s, i) => s.data.sura !== i + 1)) throw new Error(`${who}: the surah records are not suras 1..114`);
  const order = surahNodes.map((s) => s.data.revelation_order as number).sort((a, b) => a - b);
  if (order.some((o, i) => o !== i + 1)) throw new Error(`${who}: revelation_order is not a permutation of 1..114`);
  if (surahNodes.some((s) => s.data.revelation_place !== "meccan" && s.data.revelation_place !== "medinan")) throw new Error(`${who}: a surah has no meccan/medinan revelation_place`);
}

/** The surah's short name for the current language: the label without "Sura N:" and without a trailing gloss. */
export const surahShort = (s: Node, lang: Lang): string =>
  labelOf(s, lang).replace(/^\s*(Sura|Surah)\s*\d+\s*:\s*/i, "").replace(/\s*⁦?\(.*$/, "").trim();

/** Ayah numbers per surah (sorted, unique) among the Qur'an passages of a browser's items, by a predicate on the item. */
export function ayahsBySurah<T extends { node: Node; section: string }>(items: T[], keep: (i: T) => boolean = () => true): Map<number, number[]> {
  const out = new Map<number, Set<number>>();
  for (const i of items) {
    if (i.section !== "quran" || i.node.class !== "passage" || !keep(i)) continue;
    const s = i.node.data.sura as number, a = i.node.data.aya as number;
    if (!Number.isInteger(s) || s < 1 || s > 114 || !Number.isInteger(a) || a < 1) throw new Error(`sig-sura: ${i.node.id} is a Qur'an passage without a valid sura and aya`);
    (out.get(s) ?? out.set(s, new Set()).get(s)!).add(a);
  }
  return new Map([...out].map(([s, set]) => [s, [...set].sort((x, y) => x - y)]));
}

/** The path of an ayah's page, without the language: passage/quran-<sura>-<aya>. */
export const ayahId = (sura: number, aya: number) => `passage/quran-${sura}-${aya}`;
