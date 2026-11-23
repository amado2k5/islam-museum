// The ledger of Ahmed Elsayed's podcast (harvest/ahmed-el-sayed/ledger.tsv), the citation map the site reads
// (site/src/data/recordings-ahmed-el-sayed.json) and the locator the lane's citation rule names must agree, or a
// citation links nowhere or to the wrong episode. Also keeps the ledger free of typed honorifics and of any address.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { recordingRef } from "../site/src/lib/recordings";

const root = join(__dirname, "..");
const lines = readFileSync(join(root, "harvest/ahmed-el-sayed/ledger.tsv"), "utf8").trimEnd().split("\n");
const header = lines[0].split("\t");
const rows = lines.slice(1).map((l) => Object.fromEntries(l.split("\t").map((v, i) => [header[i], v]))) as Record<string, string>[];
const map = JSON.parse(readFileSync(join(root, "site/src/data/recordings-ahmed-el-sayed.json"), "utf8")) as Record<string, Record<string, { page: string; media: string }>>;
const STATUS = ["listed", "downloaded", "transcribed", "extracted", "drafted", "gated", "merged"];

describe("ahmed-el-sayed ledger", () => {
  it("has the columns of the lane page, in order", () => {
    expect(header.slice(0, 12)).toEqual(["episode_id", "show", "episode_no", "title_ar", "date", "duration", "canonical_url", "audio_url", "also_on", "status", "records_created", "pr"]);
  });
  it("has one row per episode: unique ids, locators and track ids", () => {
    expect(rows.length).toBeGreaterThan(800);
    for (const k of ["episode_id", "locator", "track_id", "canonical_url"]) expect(new Set(rows.map((r) => r[k])).size, k).toBe(rows.length);
  });
  it("uses a known status, and a blocked status names its reason", () => {
    for (const r of rows) expect(STATUS.includes(r.status) || /^blocked:.+/.test(r.status), `${r.episode_id}: ${r.status}`).toBe(true);
  });
  it("points every row at the account's own pages", () => {
    for (const r of rows) {
      expect(r.canonical_url, r.episode_id).toMatch(/^https:\/\/soundcloud\.com\/alsayyed_ah\/[\w-]+$/);
      expect(r.audio_url, r.episode_id).toMatch(/^https:\/\/feeds\.soundcloud\.com\/stream\//);
    }
  });
  it("types no honorific and stores no address", () => {
    const text = lines.join("\n");
    expect(text).not.toMatch(/ﷺ|صلى الله عليه وسلم|صلي الله عليه وسلم|عليه السلام|رضي الله عن|رحمه الله/);
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });
});

describe("ahmed-el-sayed citations", () => {
  it("maps every ledger locator to its episode page", () => {
    for (const r of rows) {
      const ref = recordingRef("source/podcast-ahmed-el-sayed", r.locator);
      expect(ref, r.locator).not.toBeNull();
      expect(ref!.page, r.locator).toBe(r.canonical_url);
      expect(ref!.time, r.locator).toBeUndefined(); // whole-episode citation: no timestamp
    }
  });
  it("holds no map entry the ledger lacks", () => {
    const fromMap = Object.entries(map).flatMap(([series, eps]) => Object.keys(eps).map((ep) => `${series}/ep${ep}`));
    expect(new Set(fromMap)).toEqual(new Set(rows.map((r) => r.locator)));
  });
});
