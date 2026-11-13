// The wing halls (audit of 13 November 2026, S18 and S32). A hall used to print every record of its wing on one page:
// /people/ was 12,000 cards and 4 MB of HTML. One pattern for every hall now: what the wing promises first (its
// cornerstones, and for Living and Made the kind of record their own description names), then a full index cut into
// linked pages by first letter, or by century in the Time wing. Every record of the wing is on exactly one index page.
import { realNodes, labelOf } from "./graph";
import { timelineKey } from "./dates";
import { WING_CLASSES } from "../../../scripts/wings";
import type { Lang, Wing } from "./i18n";
import type { Node } from "../../../scripts/build-graph";

/** Cards on one index page. 300 cards with their summaries stay under the 500 KB page budget in Arabic. */
export const HALL_PAGE = 300;
/** Cards in a hall's lead sections. */
export const HALL_LEAD = 24;

const cache = new Map<string, Node[]>();
/** The records of a wing that have a label in the language, in the hall's order: time order in Time, the wing's own class first elsewhere. */
export function hallItems(wing: Wing, lang: Lang): Node[] {
  const k = `${wing}:${lang}`;
  if (cache.has(k)) return cache.get(k)!;
  const items = realNodes.filter((n) => n.wings.includes(wing));
  if (wing === "time") {
    // Chronological by start date (see timelineKey); the build fails if the sequence is not non-decreasing.
    const keyed = items.map((n) => ({ n, ...timelineKey(n) })).sort((a, b) => (a.key === b.key ? a.ord - b.ord : a.key < b.key ? -1 : 1));
    for (let i = 1; i < keyed.length; i++) if (keyed[i].key < keyed[i - 1].key) throw new Error(`time wing out of order: ${keyed[i - 1].n.id} before ${keyed[i].n.id}`);
    items.splice(0, items.length, ...keyed.map((x) => x.n));
  } else if (WING_CLASSES[wing]) {
    const primary = new Set(WING_CLASSES[wing]);
    items.sort((a, b) => Number(!primary.has(a.class)) - Number(!primary.has(b.class)));
  }
  const out = items.filter((n) => labelOf(n, lang));
  cache.set(k, out);
  return out;
}

/** The first letter a label is filed under: articles, marks and quotation signs set aside; "other" when it is not a letter of the page's script. */
export function letterOf(label: string, lang: Lang): { id: string; label: string } {
  const bare = label.normalize("NFKD").replace(/[̀-ًͯ-ٰٟـ⁦-⁩]/g, "").replace(/^[\s"'«»“”‘’ʿʾ(\[\-–—.،,]+/, "");
  if (lang === "en") {
    const t = bare.replace(/^(?:al|el|ad|ar|as|at|an|az|ash|ath)-/i, "").replace(/^the\s+/i, "").replace(/^[\s"'‘’ʿʾ`-]+/, "");
    const c = t.charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? { id: c.toLowerCase(), label: c } : { id: "other", label: "#" };
  }
  const t = bare.replace(/^ال(?=[ء-يٱ-ۓ])/, "").replace(/^[أإآٱ]/, "ا");
  const c = t.charAt(0);
  if (/[ء-يٱ-ۓ]/.test(c)) return { id: `u${c.codePointAt(0)!.toString(16).padStart(4, "0")}`, label: c };
  return { id: "other", label: "#" };
}

export interface HallGroup { id: string; label: string; items: Node[] }
const groupCache = new Map<string, HallGroup[]>();
/**
 * The index groups of a hall: letters in the page's alphabet order, each sorted by label; in the Time wing, centuries
 * of the Common Era in time order (the label is the range of years, or null for "before the Common Era" and "undated",
 * which the page words from i18n).
 */
export function hallGroups(wing: Wing, lang: Lang): HallGroup[] {
  const k = `${wing}:${lang}`;
  if (groupCache.has(k)) return groupCache.get(k)!;
  const items = hallItems(wing, lang);
  const groups = new Map<string, HallGroup>();
  const put = (id: string, label: string, n: Node) => (groups.get(id) ?? groups.set(id, { id, label, items: [] }).get(id)!).items.push(n);
  if (wing === "time") {
    for (const n of items) {
      const { key } = timelineKey(n);
      if (!Number.isFinite(key)) put("undated", "", n);
      else if (key < 1) put("bce", "", n);
      else { const c = Math.floor(key / 100); put(`c${String(c).padStart(2, "0")}`, `${c * 100 || 1}–${c * 100 + 99}`, n); }
    }
  } else {
    for (const n of items) { const l = letterOf(labelOf(n, lang), lang); put(l.id, l.label, n); }
    for (const g of groups.values()) g.items.sort((a, b) => labelOf(a, lang).localeCompare(labelOf(b, lang), lang));
  }
  const order = (g: HallGroup) => (g.id === "other" || g.id === "undated" ? "￿" : g.id === "bce" ? "" : wing === "time" ? g.id : g.label);
  const out = [...groups.values()].sort((a, b) => (wing === "time" ? order(a).localeCompare(order(b)) : order(a).localeCompare(order(b), lang)));
  groupCache.set(k, out);
  return out;
}

/** Any list of records by first letter of the label, each letter sorted: the class listings use the same index pages as the halls. */
export function letterGroups(nodes: Node[], lang: Lang): HallGroup[] {
  const groups = new Map<string, HallGroup>();
  for (const n of nodes) { const l = letterOf(labelOf(n, lang), lang); (groups.get(l.id) ?? groups.set(l.id, { id: l.id, label: l.label, items: [] }).get(l.id)!).items.push(n); }
  for (const g of groups.values()) g.items.sort((a, b) => labelOf(a, lang).localeCompare(labelOf(b, lang), lang));
  return [...groups.values()].sort((a, b) => (a.id === "other" ? 1 : b.id === "other" ? -1 : a.label.localeCompare(b.label, lang)));
}

/** What a wing's own description promises, as classes: shown first in Living and Made, whose indexes otherwise open on something else. */
export const HALL_PROMISE: Partial<Record<Wing, readonly string[]>> = { living: ["practice"], made: ["listing"] };
const rank = (n: Node) => (n.data.importance ?? 9) * 100000 - n.degree;
/** The wing's cornerstones (canon records), the most leaned-on first. */
export const hallCornerstones = (wing: Wing, lang: Lang): Node[] =>
  hallItems(wing, lang).filter((n) => n.data.importance === 1 || n.data.importance === 2).sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id)).slice(0, HALL_LEAD);
/** The records of the classes the wing's description names, published ones first, then the most connected. */
export const hallPromised = (wing: Wing, lang: Lang): Node[] => {
  const classes = HALL_PROMISE[wing];
  if (!classes) return [];
  const pub = (n: Node) => Number(n.data.status?.review !== "published");
  return hallItems(wing, lang).filter((n) => classes.includes(n.class)).sort((a, b) => pub(a) - pub(b) || b.degree - a.degree || a.id.localeCompare(b.id)).slice(0, HALL_LEAD);
};
export const hallIndexHref = (lang: Lang, hall: string, groupId: string, pageNo = 1) => (pageNo <= 1 ? `/${lang}/${hall}/all/${groupId}/` : `/${lang}/${hall}/all/${groupId}/${pageNo}/`);
