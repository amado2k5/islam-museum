// The counted wings and what each one counts, by class. One mapping for the build (api/v1/meta/counts.json) and the
// site (the landing cards), so the numbers agree everywhere. The three uncounted wings (living, today, made) show a
// phrase instead of a number and are not listed here.
// This file has no imports: the site bundles it, so it must stay free of Node-only dependencies.
export const WING_CLASSES: Record<string, readonly string[]> = {
  time: ["event"], place: ["place"], people: ["person"], ideas: ["concept"], objects: ["object", "building"], words: ["passage"],
};

/** Per-wing entity counts for `nodes` (stubs excluded by the caller), in the order of WING_CLASSES. */
export function wingCounts(nodes: Iterable<{ class: string }>): Record<string, number> {
  const out: Record<string, number> = Object.fromEntries(Object.keys(WING_CLASSES).map((w) => [w, 0]));
  for (const n of nodes) for (const [w, classes] of Object.entries(WING_CLASSES)) if (classes.includes(n.class)) out[w]++;
  return out;
}

export interface FeaturedNode { id: string; class: string; wings?: readonly string[]; label: Record<string, string | undefined>; summary: Record<string, string | undefined>; prose?: Record<string, unknown>; data?: { status?: { review?: string; completeness?: number } } }

const fnv1a = (s: string) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const DRAFT_CARD = /^(Draft card|بطاقة أولية)/;

/** The landing card's "featured" candidates for one wing in one language: up to `n` entries with a label and a real summary
 *  in that language, the ones with prose and a fuller record first. Ordered by a hash of the id, not by file order or the
 *  clock, so the build stays byte-stable and adding an entity changes the pool only when its hash ranks among the first n. */
export function featuredPool<T extends FeaturedNode>(nodes: Iterable<T>, wing: string, lang: string, n = 24): T[] {
  const classes = WING_CLASSES[wing];
  const rich: { h: number; x: T }[] = [], plain: { h: number; x: T }[] = [];
  for (const x of nodes) {
    if (!(classes ? classes.includes(x.class) : (x.wings ?? []).includes(wing))) continue;
    const sum = x.summary[lang] ?? "";
    if (!x.label[lang] || sum.length < 60 || DRAFT_CARD.test(sum)) continue;
    const st = x.data?.status ?? {};
    ((st.review === "published" || (st.completeness ?? 0) >= 2) && x.prose?.[lang] ? rich : plain).push({ h: fnv1a(x.id), x });
  }
  const byHash = (a: { h: number; x: T }, b: { h: number; x: T }) => a.h - b.h || (a.x.id < b.x.id ? -1 : 1);
  return [...rich.sort(byHash), ...plain.sort(byHash)].slice(0, n).map((e) => e.x);
}
