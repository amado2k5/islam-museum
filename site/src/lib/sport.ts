// The Sport Browser's shared reads (docs/plan/66-sport-browser.md): every report of sport and
// contest — horsemanship, archery, swimming, wrestling and strength, races and wagered contests,
// play and games, hunting and sport named as sport — that the museum's sources carry: Qur'an
// verses, hadith reports, seerah books and every other harvested work, plus the curated `sport`
// class records, the existing records tagged in place, and the athletes on record. Passages are
// found by the shared detector in scripts/sport.ts at build time, so a sport report in a book
// harvested later appears here the day its passage record lands; curated records join through
// the `sport-browser` tag.
import { byId, realNodes } from "./graph";
import { sportCorpusOf, sportSignalsOf, sportTagSection, sportTopicsOf, SPORT_TAG, isSportPassage, type SportSection, type SportTopic } from "../../../scripts/sport";
import type { Node } from "../../../scripts/build-graph";

export { SPORT_SECTIONS, type SportSection, type SportTopic } from "../../../scripts/sport";

export interface SportItem {
  node: Node;
  section: SportSection;
  /** The sport topics the passage touches (khayl, ramy, sibaha, sira, sabq, laib, sayd, riyada). */
  topics: SportTopic[];
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const sportItems: SportItem[] = realNodes
  .filter((n) => n.tags.includes(SPORT_TAG) || n.class === "sport" || isSportPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? sportCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : sportTagSection(n),
    topics: n.class === "passage" ? sportTopicsOf(n) : [],
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });

/** Athletes on record: person records carrying the schema `sports:` block — the modern shelf
 *  reads them from the graph, no side list. */
export const sportAthletes: Node[] = realNodes
  .filter((n) => n.class === "person" && Array.isArray(n.data.sports) && (n.data.sports as any[]).length > 0)
  .sort((a, b) => a.id.localeCompare(b.id));

/** The named sports (class `sport` records), curated shelf order by kind then id. */
export const namedSports: Node[] = realNodes
  .filter((n) => n.class === "sport")
  .sort((a, b) => String(a.data.kind ?? "").localeCompare(String(b.data.kind ?? "")) || a.id.localeCompare(b.id));

/** Detector debug aid for tests and the API: the matched signal names of a passage. */
export const sportSignals = (n: Node): string[] => sportSignalsOf(n);
