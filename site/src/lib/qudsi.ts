// The Hadith Qudsi Browser's shared reads (docs/plan/32-hadith-qudsi-browser.md): every hadith passage tagged
// `hadith-qudsi`, gathered into one hadith per `qudsi-<slug>` tag and ordered by the theme of its first narration.
// Everything comes from the compiled graph at build time; there is no side list.
import { realNodes } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export const QUDSI_TAG = "hadith-qudsi";
/** The collections in the order the browser lists a hadith's narrations: the six books, then the Muwatta. */
export const QUDSI_WORKS = [
  "work/sahih-al-bukhari", "work/sahih-muslim", "work/sunan-abi-dawud", "work/jami-al-tirmidhi",
  "work/sunan-al-nasai", "work/sunan-ibn-majah", "work/muwatta-malik",
];
/** Theme order of the browser's sections (ids from schema/enums/themes.yaml); a theme not listed here sorts last. */
export const QUDSI_THEMES = [
  "creed", "worship-and-the-pillars", "fasting", "zakat-and-sadaqa", "spirituality-and-sufism", "ethics-and-character",
  "family-marriage-kinship", "care-for-the-vulnerable", "trade-and-finance", "crime-and-punishment", "laws-of-war-and-peace",
  "health-body-death", "afterlife-and-eschatology", "prophets", "scripture-and-its-sciences", "animals-and-mercy",
  "images-and-figural-art", "literature",
];

export const qudsiNodes: Node[] = realNodes.filter((n) => n.class === "passage" && n.tags.includes(QUDSI_TAG));

export interface QudsiHadith { slug: string; theme: string; lead: Node; narrations: Node[] }

const refNum = (n: Node) => parseFloat(String(n.data.ref ?? "").replace(/^\d+\./, "")) || 0;
const byCollection = (a: Node, b: Node) =>
  (QUDSI_WORKS.indexOf(a.data.work) + 99) % 99 - (QUDSI_WORKS.indexOf(b.data.work) + 99) % 99 || refNum(a) - refNum(b) || a.id.localeCompare(b.id);

const bySlug = new Map<string, Node[]>();
for (const n of qudsiNodes) {
  const slug = n.tags.find((t) => t.startsWith("qudsi-"))?.slice(6) ?? n.slug;
  bySlug.set(slug, [...(bySlug.get(slug) ?? []), n]);
}
const themeRank = (t: string) => (QUDSI_THEMES.includes(t) ? QUDSI_THEMES.indexOf(t) : QUDSI_THEMES.length);

export const qudsiHadiths: QudsiHadith[] = [...bySlug.entries()].map(([slug, ns]) => {
  const narrations = [...ns].sort(byCollection);
  const titled = narrations.filter((n) => String(n.label.en ?? "").includes(" — "));
  const lead = titled.find((n) => n.themes.length > 0) ?? titled[0] ?? narrations[0];
  return { slug, theme: lead.themes[0] ?? "", lead, narrations };
}).sort((a, b) => themeRank(a.theme) - themeRank(b.theme) || byCollection(a.lead, b.lead));

/** The hadith's title: the part of the lead narration's label after the collection and number. */
export const qudsiTitle = (h: QudsiHadith, label: string): string => label.split(" — ").slice(1).join(" — ") || label;
/** A narration's short name on its chip: the collection and number before the dash. */
export const narrationName = (label: string): string => label.split(" — ")[0];
