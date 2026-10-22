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
