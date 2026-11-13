// Shared reads of the passage-detector browsers' signature views (Hasanat and Sayyi'at): the 114 surah records with
// their revelation order and place, which surah an ayah passage belongs to, and which hadith collection (work) a
// passage belongs to. Everything comes from the graph; the helpers only group what the records already say.
import { realNodes, labelOf, href } from "./graph";
import type { Lang } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

/** The surah records `passage/quran-N`, in Mushaf order. */
export const quranSurahs: Node[] = realNodes
  .filter((n) => n.class === "passage" && n.data.unit === "sura")
  .sort((a, b) => Number(a.data.sura) - Number(b.data.sura));

/** The surah number of an ayah passage, or null when the record is not an ayah of the Qur'an. */
export const suraOf = (n: Node): number | null => {
  if (n.class !== "passage" || n.data.unit !== "ayah") return null;
  const s = Number(n.data.sura);
  return Number.isInteger(s) && s >= 1 && s <= 114 ? s : null;
};

/** Surah name without the "Sura N:" lead and without a trailing parenthetical gloss. */
export const surahName = (s: Node, lang: Lang): string =>
  labelOf(s, lang).replace(/^\s*(Sura|Surah)\s*\d+\s*[:\-–—]\s*/i, "").replace(/\s*⁦?\(.*$/, "").trim();

/** A work's short name: no trailing parenthetical gloss and no " — " subtitle. */
export const workShortName = (w: Node, lang: Lang): string =>
  labelOf(w, lang).replace(/\s*⁦?\(.*$/, "").replace(/\s+[—–]\s+.*$/, "").trim();

/** An ayah's number inside its surah, for ordering. */
export const ayaOf = (n: Node): number => Number(n.data.aya) || 0;

export { href };
