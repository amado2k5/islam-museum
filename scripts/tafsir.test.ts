import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The Tafsir Browser pages (docs/plan/27-tafsir-browser.md, docs/site/browsers.md section 4):
// the landing header is searchable, the long lists are kept out of the Pagefind index.
const root = join(__dirname, "..", "site", "src", "pages", "[lang]", "tafsir");
const index = readFileSync(join(root, "index.astro"), "utf8");
const volume = readFileSync(join(root, "[volume].astro"), "utf8");

describe("Tafsir Browser Pagefind markup", () => {
  it("landing header is indexed and the volume list is ignored", () => {
    expect(index).toMatch(/<section data-pagefind-body>/);
    expect(index).toMatch(/aria-labelledby="tafsir-volumes" data-pagefind-ignore/);
  });

  it("volume page header is indexed and its verse list is ignored", () => {
    expect(volume).toMatch(/<section data-pagefind-body>/);
    expect(volume).toMatch(/aria-labelledby="tafsir-verses" data-pagefind-ignore/);
  });
});

// Audit of 13 November 2026 (Part I): the browser is verse first and the commentary is lifted out of a verse's prose
// by a rule, never rewritten.
describe("Tafsir Browser, verse first", () => {
  it("the landing leads with the verse picker and labels one work's volumes as that work's volumes", () => {
    expect(index.indexOf('id="tafsir-by-verse"')).toBeGreaterThan(0);
    expect(index.indexOf('id="tafsir-by-verse"')).toBeLessThan(index.indexOf('id="tafsir-commentaries"'));
    expect(index).toMatch(/X\.volumes_of/);
  });

  it("splitTafsir moves the digest and leaves the rest of the section in place", async () => {
    const { splitTafsir, volumes } = await import("../site/src/lib/tafsir");
    const src = String(volumes[0].data.sources[0]).replace("source/", "");
    const sections = [
      { heading: "Summary", markdown: "Verse 1. {cite:tanzil-quran}" },
      { heading: "Place", markdown: `Its place: verse 1.\n\n**Commentary on verse 1**\n\nThe commentator opens. {cite:${src} p. 1}\n\nThese statements are given as transmitted.` },
      { heading: "In the commentary", markdown: `A second note. {cite:${src} p. 2}` },
    ];
    const { rest, blocks } = splitTafsir(sections);
    expect(rest.map((s) => s.heading)).toEqual(["Summary", "Place"]);
    expect(rest[1].markdown).toBe("Its place: verse 1.");
    expect(blocks).toHaveLength(2);
    expect(blocks[0].heading).toBeNull();
    expect(blocks[0].markdown.startsWith("**Commentary on verse 1**")).toBe(true);
    expect(blocks[0].markdown.endsWith("These statements are given as transmitted.")).toBe(true);
    expect(blocks[1].heading).toBe("In the commentary");
    expect(blocks[0].volumes[0].id).toBe(volumes[0].id);
  });

  it("no verse's prose keeps a tafsir citation outside the Tafsir section, and no digest text is lost", async () => {
    const { splitTafsir, citedVolumes } = await import("../site/src/lib/tafsir");
    const { realNodes } = await import("../site/src/lib/graph");
    let digests = 0;
    for (const n of realNodes) {
      if (n.class !== "passage" || n.data.unit !== "ayah") continue;
      for (const doc of Object.values(n.prose) as any[]) {
        const { rest, blocks } = splitTafsir(doc.sections);
        for (const s of rest) expect(citedVolumes(s.markdown), `${n.id} keeps a tafsir cite in "${s.heading}"`).toHaveLength(0);
        const before = doc.sections.reduce((k: number, s: any) => k + s.markdown.replace(/\s+/g, "").length, 0);
        const after = [...rest, ...blocks].reduce((k: number, s: any) => k + s.markdown.replace(/\s+/g, "").length, 0);
        expect(after, `${n.id}: text lost in the split`).toBe(before);
        if (blocks.length) digests++;
      }
    }
    expect(digests).toBeGreaterThan(0);
  });
});

