// The poetry anthology's model (site/src/pages/[lang]/words/poetry/[...page].astro): poems under their poets, the
// verses of each poem, and the pages the verses are cut into. The anthology page lists poets and poems; the verses
// live on /words/poetry/verses/<n>/ (audit S18: one page with every verse was 778 KB).
import { byId, graph, labelOf, realNodes } from "./graph";
import type { Lang } from "./i18n";

/** Verses on one verses page; a poem is never split, so a page can run over by one poem's length. */
export const VERSES_PER_PAGE = 120;

export function poetryModel(lang: Lang) {
  const poems = realNodes.filter((n) => n.class === "work" && n.data.kind === "poem");
  // poet of a poem = person end of an authored edge (person --authored--> work).
  const poetOf = new Map<string, any>();
  for (const e of graph.edges) {
    if (e.type !== "authored" || e.inverse || !e.to.startsWith("work/")) continue;
    const person = byId.get(e.from);
    if (person?.class === "person" && !person.stub) poetOf.set(e.to, person);
  }
  const byPoet = new Map<string, { poet: any; poems: any[] }>();
  const unattributed: any[] = [];
  for (const p of poems) {
    const poet = poetOf.get(p.id);
    if (!poet) { unattributed.push(p); continue; }
    (byPoet.get(poet.id) ?? byPoet.set(poet.id, { poet, poems: [] }).get(poet.id)!).poems.push(p);
  }
  // groups ordered by the poet's death date where known, else alphabetically at the end.
  const deathKey = (poet: any) => poet.data.died?.edtf ?? poet.data.died?.start?.edtf ?? "9999";
  const groups = [...byPoet.values()].sort((a, b) => {
    const ka = deathKey(a.poet), kb = deathKey(b.poet);
    return ka === kb ? labelOf(a.poet, lang).localeCompare(labelOf(b.poet, lang), lang) : ka < kb ? -1 : 1;
  });
  for (const g of groups) g.poems.sort((a, b) => labelOf(a, lang).localeCompare(labelOf(b, lang), lang));
  // Verses (passages of unit poem-line): grouped by poem, poems ordered like the anthology.
  const verses = realNodes.filter((n) => n.class === "passage" && n.data.unit === "poem-line");
  const versesOf = new Map<string, any[]>();
  for (const v of verses) (versesOf.get(v.data.work) ?? versesOf.set(v.data.work, []).get(v.data.work)!).push(v);
  const refKey = (r: string) => r.split(/[^0-9]+/).filter(Boolean).map((x) => x.padStart(5, "0")).join("-") + "~" + r;
  for (const list of versesOf.values()) list.sort((a, b) => refKey(String(a.data.ref ?? "")).localeCompare(refKey(String(b.data.ref ?? ""))) || a.id.localeCompare(b.id));
  const versePoems = [...groups.flatMap((g) => g.poems), ...unattributed].filter((p) => versesOf.has(p.id));
  // the verses pages: poems in anthology order, a new page once the page holds VERSES_PER_PAGE verses
  const pages: any[][] = [];
  let n = 0;
  for (const p of versePoems) {
    if (!pages.length || n >= VERSES_PER_PAGE) { pages.push([]); n = 0; }
    pages[pages.length - 1].push(p); n += versesOf.get(p.id)!.length;
  }
  const pageOf = new Map<string, number>();
  pages.forEach((list, k) => list.forEach((p) => pageOf.set(p.id, k + 1)));
  return { poetOf, groups, unattributed, verses, versesOf, versePoems, pages, pageOf };
}
