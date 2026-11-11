// The Bayt al-Nubuwwa & Al al-Nabi Browser's shared reads (docs/plan/39-bayt-browser.md):
// everything the museum's sources mention about the Prophet's household and family —
// بيت النبوة وآل النبي — across the Qur'an, the Sunnah, the seerah books and every
// harvested work, plus the curated records on the family itself. Passages are found by
// the shared detector in scripts/bayt.ts at build time, so a mention in a book harvested
// later appears here the day its passage record lands; curated records join through the
// `bayt-browser` tag. There is no side list.
import { byId, realNodes } from "./graph";
import { baytCorpusOf, baytTagSection, BAYT_TAG, isBaytPassage, type BaytSection } from "../../../scripts/bayt";
import type { Node } from "../../../scripts/build-graph";

export { BAYT_SECTIONS, type BaytSection } from "../../../scripts/bayt";

export interface BaytItem {
  node: Node;
  section: BaytSection;
  /** The passage's work record, for the card's source line. */
  work?: Node;
}

const genreOf = (workId: string | undefined): string[] | undefined =>
  workId ? (byId.get(workId)?.data.genre as string[] | undefined) : undefined;

export const baytItems: BaytItem[] = realNodes
  .filter((n) => n.tags.includes(BAYT_TAG) || isBaytPassage(n))
  .map((n) => ({
    node: n,
    section: n.class === "passage"
      ? baytCorpusOf(n.data.work as string | undefined, genreOf(n.data.work as string | undefined), n.data.unit as string | undefined)
      : baytTagSection(n),
    work: n.class === "passage" ? byId.get(n.data.work as string) : undefined,
  }))
  .sort((a, b) => {
    const r = a.section.localeCompare(b.section);
    return r || a.node.id.localeCompare(b.node.id);
  });
