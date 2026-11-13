import { describe, expect, it } from "vitest";
import { groupPages, indexAlternates } from "../site/src/lib/paged";

// The letter pages of the halls and the class listings (/<lang>/<listing>/all/<letter>/): the letters are those of each
// language's own alphabet, so the header's language switch and the hreflang alternates must never name a page that is
// not built (2,054 broken links in the first sampled link check, 13 November 2026).
describe("indexAlternates: the other-language addresses of a letter page", () => {
  const LANGS = ["ar", "en", "ur"] as const;
  const pages = {
    ar: groupPages([{ id: "u0627", items: Array(700) }, { id: "other", items: Array(10) }], 300),
    en: groupPages([{ id: "a", items: Array(50) }, { id: "other", items: Array(400) }], 300),
    ur: groupPages([{ id: "u0627", items: Array(200) }, { id: "u06d2", items: Array(5) }], 300),
  };
  const alt = (id: string, n: number) => indexAlternates(LANGS, (l) => pages[l], id, n, (l) => `/${l}/people/all/${id}/${n > 1 ? `${n}/` : ""}`, (l) => `/${l}/people/`);

  it("counts each group's pages", () => {
    expect([...pages.ar]).toEqual([["u0627", 3], ["other", 1]]);
  });
  it("keeps the twin where the same letter and page exist, and falls back to the landing where they do not", () => {
    expect(alt("u0627", 1)).toEqual({ ar: "/ar/people/all/u0627/", en: "/en/people/", ur: "/ur/people/all/u0627/" });
    expect(alt("a", 1)).toEqual({ ar: "/ar/people/", en: "/en/people/all/a/", ur: "/ur/people/" });
    expect(alt("u06d2", 1)).toEqual({ ar: "/ar/people/", en: "/en/people/", ur: "/ur/people/all/u06d2/" });
  });
  it("falls back to the landing when the letter exists but runs to fewer pages in the other language", () => {
    expect(alt("u0627", 3)).toEqual({ ar: "/ar/people/all/u0627/3/", en: "/en/people/", ur: "/ur/people/" });
    expect(alt("other", 2)).toEqual({ ar: "/ar/people/", en: "/en/people/all/other/2/", ur: "/ur/people/" });
  });
});
