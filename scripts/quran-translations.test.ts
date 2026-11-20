import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { p } from "./lib";

// The French and Spanish verse translations are third-party content from QuranEnc.com, kept apart from the frozen
// records (docs/data/quran-translations.md). These tests guard their shape and the conditions of re-publication that
// a file or a page can break by accident; they do not, and cannot, judge the translations.
const EDITIONS = [["french_rashid", "fr"], ["spanish_garcia", "es"]] as const;
const frozen = new Set(readdirSync(p("data", "passage")).filter((f) => /^quran-\d+-\d+\.yaml$/.test(f)).map((f) => f.slice(6, -5).replace("-", ":")));
const load = (key: string) => JSON.parse(readFileSync(p("site", "src", "data", "quran-translations", `${key}.json`), "utf8"));

describe("QuranEnc.com verse translations (French, Spanish)", () => {
  it("the frozen records have 6,236 verses", () => expect(frozen.size).toBe(6236));
  for (const [key, lang] of EDITIONS) {
    const e = load(key);
    it(`${key}: one translation for every verse of the frozen records, and no other`, () => {
      expect(new Set(Object.keys(e.verses))).toEqual(frozen);
      for (const v of Object.values<any>(e.verses)) {
        expect(typeof v.t === "string" && v.t.trim().length > 0).toBe(true);
        expect(Object.keys(v).every((k) => k === "t" || k === "f")).toBe(true);
      }
    });
    it(`${key}: carries its language, version, source and the seven terms inside the file`, () => {
      expect(e.key).toBe(key);
      expect(e.language).toBe(lang);
      expect(e.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(e.source).toBe(`https://quranenc.com/en/browse/${key}`);
      expect(e.terms).toHaveLength(7);
      expect(e.terms[0]).toMatch(/No modification/);
    });
    it(`${key}: no Qur'an brackets typed into a translation`, () => {
      for (const v of Object.values<any>(e.verses)) expect(/[﴿﴾]/.test(v.t + (v.f ?? ""))).toBe(false);
    });
  }
  it("every page that shows these translations shows the credit with the version and a link to the source", () => {
    for (const f of [p("site", "src", "components", "Extras.astro"), p("site", "src", "pages", "[lang]", "words", "quran", "[n].astro")]) {
      const s = readFileSync(f, "utf8");
      expect(s).toMatch(/quranTranslation\(/);
      expect(s).toMatch(/translation_credit_quranenc/);
      expect(s).toMatch(/\.source\}/);
    }
  });
  it("the credit string exists in all five languages and names the version", () => {
    for (const l of ["ar", "en", "ur", "fr", "es"]) expect(readFileSync(p("i18n", `${l}.yaml`), "utf8")).toMatch(/translation_credit_quranenc: .*\{tr\}.*\{v\}/);
  });
  it("the translations are not copied into the frozen records", () => {
    const s = readFileSync(p("data", "passage", "quran-2-255.yaml"), "utf8");
    expect(/^\s+(fr|es): \{ text:/m.test(s)).toBe(false);
  });
});
