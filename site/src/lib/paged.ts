// Paginated listings (audit of 13 November 2026, S18). The browsers rendered their whole corpus into one page and
// filtered it in the browser: /ibadat/ was 4.9 MB of HTML, /people/ 4.0 MB. The mechanism is now: the landing shows
// the first rows of every section, and each section's full list lives on linked sub-pages of a fixed size,
//   /<lang>/<browser>/all/<section>/          (page 1)
//   /<lang>/<browser>/all/<section>/<n>/      (page n)
// every one a real URL, reachable and readable without JavaScript. Every record stays reachable: the landing links
// each section's full list, and the pages link each other. The same template renders the landing and the sub-pages
// (its file is `[...page].astro`), so a row looks the same wherever it is listed.
import type { Lang } from "./i18n";

/** Rows of a section shown on the landing before "all N" takes over. */
export const LANDING_ROWS = 24;
/** Rows on one sub-page. 75 rows of the heaviest section (curated records, in Arabic) stay under the 500 KB page budget (scripts/check-weight.ts). */
export const PAGE_ROWS = 75;

export interface PagedProps { lang: Lang; sectionId?: string; pageNo?: number }
/** getStaticPaths for a `[...page].astro` listing: the landing, then every sub-page of every section longer than the landing shows. */
export function pagedStaticPaths(langs: readonly Lang[], sections: { id: string; count: number }[]) {
  return langs.flatMap((lang) => [
    { params: { lang, page: undefined }, props: { lang } as PagedProps },
    ...sections.filter((s) => s.count > LANDING_ROWS).flatMap((s) =>
      Array.from({ length: Math.ceil(s.count / PAGE_ROWS) }, (_x, k) => ({
        params: { lang, page: k === 0 ? `all/${s.id}` : `all/${s.id}/${k + 1}` },
        props: { lang, sectionId: s.id, pageNo: k + 1 } as PagedProps,
      }))),
  ]);
}

export interface PagedSection<T> { id: string; items: T[]; total: number; all: string | null; first: number }
export interface Paged<T> {
  /** True on the landing, false on a section's sub-page. */
  landing: boolean;
  /** This page's own path. */
  path: string;
  /** "" on the landing; the landing's path on a sub-page (prefix for #anchors back to the landing). */
  home: string;
  /** The sections to render here, their rows already cut to what this page shows. */
  sections: PagedSection<T>[];
  pager: { pageNo: number; pages: number; prev: string | null; next: string | null; from: number; to: number; total: number } | null;
}
/** What one page of a listing shows. `base` is the landing's path, with its closing slash. */
export function pageView<T>(sections: { id: string; items: T[] }[], props: PagedProps, base: string): Paged<T> {
  const url = (id: string, n: number) => (n <= 1 ? `${base}all/${id}/` : `${base}all/${id}/${n}/`);
  if (!props.sectionId) {
    return {
      landing: true, path: base, home: "", pager: null,
      sections: sections.map((s) => ({ id: s.id, items: s.items.slice(0, LANDING_ROWS), total: s.items.length, all: s.items.length > LANDING_ROWS ? url(s.id, 1) : null, first: 1 })),
    };
  }
  const s = sections.find((x) => x.id === props.sectionId);
  if (!s) throw new Error(`paged listing ${base}: no section ${props.sectionId}`);
  const pageNo = props.pageNo ?? 1, pages = Math.ceil(s.items.length / PAGE_ROWS);
  const from = (pageNo - 1) * PAGE_ROWS;
  const items = s.items.slice(from, from + PAGE_ROWS);
  return {
    landing: false, path: url(s.id, pageNo), home: base,
    sections: [{ id: s.id, items, total: s.items.length, all: null, first: from + 1 }],
    pager: { pageNo, pages, prev: pageNo > 1 ? url(s.id, pageNo - 1) : null, next: pageNo < pages ? url(s.id, pageNo + 1) : null, from: from + 1, to: from + items.length, total: s.items.length },
  };
}
/** The numbered pages to offer around the current one: first, last, and two either side. */
export const pageWindow = (pageNo: number, pages: number): number[] => [...new Set([1, pageNo - 2, pageNo - 1, pageNo, pageNo + 1, pageNo + 2, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);

/**
 * A browser's headline count, taken from the very sets its page renders (audit of 13 November 2026, S14: Miracles
 * said 1,035 and listed 1,064, because the subject cards it also renders were left out of the number). The count is
 * the distinct records across the sections and any other list the page prints (`extraIds`). The build fails when a
 * record the browser claims (`claimed`) is in no section, so a number can never include a record the page does not list.
 */
export function renderedHeadline(name: string, sections: { items: { node: { id: string } }[] }[], extraIds: string[] = [], claimed: { node: { id: string } }[] = []): number {
  const ids = new Set<string>([...sections.flatMap((s) => s.items.map((i) => i.node.id)), ...extraIds]);
  for (const c of claimed) if (!ids.has(c.node.id)) throw new Error(`${name}: ${c.node.id} is counted in the headline but no section lists it`);
  return ids.size;
}
