// One URL slug per record for a browser's subject pages (the Sacred Places Browser, the
// Genealogies Browser). The slug is the record's own; when two records of different classes
// share one, the later record takes its class as a prefix. It is computed once, from the
// records alone, so it is the same in every language: the page routes, the cards that link to
// them and the language switch all read this one map and cannot disagree.
export interface SlugSource { id: string; class: string; slug?: string }

export function browserSlugs(records: Iterable<SlugSource>): Map<string, string> {
  const seen = new Set<string>();
  const map = new Map<string, string>();
  for (const r of records) {
    let slug = r.slug ?? r.id.split("/")[1];
    if (seen.has(slug)) slug = `${r.class}-${slug}`;
    seen.add(slug);
    map.set(r.id, slug);
  }
  return map;
}
