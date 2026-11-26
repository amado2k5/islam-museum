// The founder's 80 thumbnails, the 50 subjects they show, the ten worlds and the museum records: every file once,
// every subject in a world, every record a real one. The pictures themselves are not in git and are not needed here.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import atlas from "../content/atlas.v1.json";

const repo = resolve(__dirname, "..", "..", "..", "..", "..");
const WORLDS: Record<string, string[]> = {
  "sky-stars-time": ["abbas-ibn-firnas", "al-sufi", "al-tusi", "ibn-al-shatir", "al-battani"],
  "machines-numbers-codes": ["al-jazari", "al-khwarizmi", "al-kindi", "banu-musa", "al-shatranj"],
  "light-earth-water-maps": ["ibn-al-haytham", "al-biruni", "al-karaji", "al-idrisi", "thabit-ibn-qurra"],
  "medicine-care": ["ibn-al-nafis", "ibn-sina", "al-zahrawi", "al-razi", "ibn-zuhr"],
  "books-schools-language": ["fatima-al-fihri", "house-of-wisdom", "karima-al-marwaziyya", "al-khalil", "rashid-al-din"],
  "journeys-maps": ["ibn-battuta", "ibn-jubayr", "evliya-celebi", "al-hasan-al-wazzan", "al-masudi"],
  "seas-trade-golden-books": ["sailor-of-sohar", "sindbad", "coffee", "mansa-musa", "timbuktu"],
  "cities-builders-civic-care": ["mimar-sinan", "alhambra", "nur-al-din", "salah-al-din", "ibn-khaldun"],
  "nature-animals-wonders": ["al-jahiz", "ibn-al-baytar", "al-qazwini", "monkey-and-tortoise", "pigeon-post"],
  "voices-wisdom-society": ["wallada", "nana-asmau", "al-ghazali", "usama-ibn-munqidh", "samarqand"],
};

describe("the 80 thumbnails and the 50 subjects", () => {
  it("counts 80 files, 40 in each language, each with its digest and size", () => {
    expect(atlas.sources).toHaveLength(80);
    expect(atlas.sources.filter((s) => s.lang === "en")).toHaveLength(40);
    expect(atlas.sources.filter((s) => s.lang === "ar")).toHaveLength(40);
    expect(new Set(atlas.sources.map((s) => s.file)).size).toBe(80);
    expect(new Set(atlas.sources.map((s) => s.sha256)).size).toBe(80);
    for (const s of atlas.sources) {
      expect(s.sha256, s.file).toMatch(/^[0-9a-f]{64}$/);
      expect(s.bytes, s.file).toBeGreaterThan(100_000);
      expect(s.width / s.height, s.file).toBeCloseTo(16 / 9, 1);
      expect(s.story.length && s.named.length, s.file).toBeGreaterThan(0);
    }
    expect(atlas.archive.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("gives every file to exactly one subject, and every subject at least one file", () => {
    const ids = new Set(atlas.subjects.map((s) => s.id));
    expect(ids.size).toBe(50);
    const claimed = atlas.subjects.flatMap((s) => s.sources);
    expect(claimed).toHaveLength(80);
    expect(new Set(claimed).size).toBe(80);
    for (const s of atlas.sources) {
      expect(ids.has(s.subject), s.file).toBe(true);
      expect(atlas.subjects.find((x) => x.id === s.subject)!.sources, s.file).toContain(s.file);
    }
    for (const s of atlas.subjects) expect(s.sources.length, s.id).toBeGreaterThanOrEqual(1);
  });

  it("finds 30 subjects in both languages, 10 only in English and 10 only in Arabic, as the founder's note says", () => {
    const both = atlas.subjects.filter((s) => s.sources.length === 2);
    const only = (lang: "en" | "ar") => atlas.subjects.filter((s) => s.sources.length === 1 && s.sources[0]!.startsWith(lang === "en" ? "english/" : "arabic/")).map((s) => s.id);
    expect(both).toHaveLength(30);
    for (const s of both) expect(Object.keys(s.titles).sort(), s.id).toEqual(["ar", "en"]);
    expect(only("en")).toHaveLength(10);
    expect(only("ar").sort()).toEqual(["al-battani", "al-hasan-al-wazzan", "alhambra", "coffee", "evliya-celebi", "ibn-al-shatir", "ibn-zuhr", "karima-al-marwaziyya", "pigeon-post", "thabit-ibn-qurra"]);
  });

  it("builds ten worlds of five quests, in the founder's grouping", () => {
    expect(atlas.worlds.map((w) => w.id)).toEqual(Object.keys(WORLDS));
    expect(atlas.worlds.map((w) => w.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const [world, subjects] of Object.entries(WORLDS)) expect(atlas.subjects.filter((s) => s.world === world).map((s) => s.id), world).toEqual(subjects);
    expect(new Set(atlas.subjects.map((s) => s.quest)).size).toBe(50);
    for (const s of atlas.subjects) expect(s.quest, s.id).toMatch(/^w(0[1-9]|10)q[1-5]$/);
  });

  it("joins every subject to museum records that exist, and marks story tradition as literature", () => {
    for (const s of atlas.subjects) {
      expect(s.records.length, s.id).toBeGreaterThanOrEqual(1);
      for (const r of s.records) expect(existsSync(resolve(repo, "data", `${r}.yaml`)), `${s.id}: ${r}`).toBe(true);
      expect(s.review, s.id).toMatch(/pending/);
    }
    expect(atlas.subjects.filter((s) => s.kind === "literature").map((s) => s.id).sort()).toEqual(["monkey-and-tortoise", "sindbad"]);
    // The museum's Book of Sindbad is another work, about a sage; the sailor's voyages are joined to the Nights.
    expect(atlas.subjects.find((s) => s.id === "sindbad")!.records).not.toContain("work/kitab-al-sindbad");
  });

  it("keeps the pictures out of git", () => {
    const ignore = readFileSync(resolve(repo, "gaming", ".gitignore"), "utf8");
    expect(ignore).toMatch(/^media\/$/m);
  });
  it("names every world and every subject in all seven languages, in a table of their own", () => {
    for (const lang of ["ar", "en", "ur", "fr", "es", "tr", "id"]) {
      const names = JSON.parse(readFileSync(resolve(repo, "gaming", "games", "hudhud", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
      for (const w of atlas.worlds) expect(names[`world_${w.order}`]?.trim().length, `${lang} world ${w.order}`).toBeGreaterThan(2);
      for (const s of atlas.subjects) expect(names[`s_${s.id.replace(/-/g, "_")}`]?.trim().length, `${lang} ${s.id}`).toBeGreaterThan(2);
      expect(Object.keys(names)).toHaveLength(61);
    }
  });
});
