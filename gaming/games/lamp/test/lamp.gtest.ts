// The Lamp of the Ages: every mission can be completed, every fact the page shows maps to a museum record id, the
// record file is the graph's own (a fresh run of the builder gives the same file), and the save round-trips.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DESTINATIONS, recordIds } from "../src/content";
import { MAX_COMPANIONS, allDone, answer, canTravel, complete, join, meet, newSave, parse, serialize, travel } from "../src/sim";
import { buildRecords } from "../tools/build-records";

const read = (p: string) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
const records = JSON.parse(read("../data/records.json")) as Record<string, { label: Record<string, string>; summary: Record<string, string>; year: number | null; coords: [number, number] | null }>;
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];

describe("the lamp", () => {
  it("has at least five destinations, each a different place and a record-dated century", () => {
    expect(DESTINATIONS.length).toBeGreaterThanOrEqual(5);
    expect(new Set(DESTINATIONS.map((d) => d.place)).size).toBe(DESTINATIONS.length);
    for (const d of DESTINATIONS) {
      expect(records[d.place]!.coords, d.id).not.toBeNull();
      expect(records[d.when]!.year, d.id).toBeGreaterThan(0);
    }
  });

  it("shows only museum records: every id is in the record file, with a label and summary in all seven languages", () => {
    expect(Object.keys(records).sort()).toEqual(recordIds());
    for (const id of recordIds()) for (const l of LANGS) {
      expect(records[id]!.label[l], `${id} ${l}`).toBeTruthy();
      expect(records[id]!.summary[l], `${id} ${l}`).toBeTruthy();
      expect(records[id]!.summary[l], `${id} ${l}`).not.toMatch(/\{cit/);
    }
  });

  it("keeps the record file equal to a fresh copy from data/", () => {
    expect(records).toEqual(JSON.parse(JSON.stringify(buildRecords())));
  });

  it("asks only questions whose answer the record itself names", () => {
    for (const d of DESTINATIONS) {
      const q = d.question;
      expect(records[q.about]!.summary.en, d.id).toContain(q.evidence);
      expect(new Set([q.answer, ...q.options]).size, d.id).toBe(3);
      for (const o of q.options) expect(records[q.about]!.summary.en, `${d.id}: ${o} must not also be named`).not.toContain(records[o]!.label.en!);
    }
  });

  it("can be played through: every mission completes, the gates open with the cards, and figures join", () => {
    const s = newSave();
    const order: string[] = [];
    for (let round = 0; round < DESTINATIONS.length && !allDone(s); round++) {
      for (const d of DESTINATIONS) {
        if (order.includes(d.id) || !canTravel(s, d.id)) continue;
        expect(travel(s, d.id)).toBe(true);
        expect(answer(s, d.question.answer), "no answer before meeting").toBe(false);
        expect(meet(s)).toBe(true);
        expect(answer(s, d.question.options[0])).toBe(false);
        expect(complete(s), "no card before the right answer").toBe(false);
        expect(answer(s, d.question.answer)).toBe(true);
        expect(complete(s)).toBe(true);
        expect(s.cards).toContain(d.gives);
        order.push(d.id);
      }
    }
    expect(allDone(s)).toBe(true);
    expect(order.length).toBe(DESTINATIONS.length);
    for (const d of DESTINATIONS) if (d.needs) expect(order.indexOf(DESTINATIONS.find((x) => x.gives === d.needs)!.id)).toBeLessThan(order.indexOf(d.id));
    expect(join(s, DESTINATIONS[0]!.figure)).toBe(true);
    expect(join(s, DESTINATIONS[1]!.figure)).toBe(true);
    expect(join(s, DESTINATIONS[2]!.figure)).toBe(MAX_COMPANIONS > 2);
  });

  it("does not open a gated way without its card", () => {
    const s = newSave();
    for (const d of DESTINATIONS) if (d.needs) expect(travel(s, d.id)).toBe(false);
  });

  it("round-trips the save, and refuses what is not a save", () => {
    const s = newSave();
    travel(s, "baghdad"); meet(s); answer(s, "building/bayt-al-hikma"); complete(s); join(s, "person/al-khwarizmi");
    expect(parse(serialize(s))).toEqual(s);
    expect(parse("not json")).toEqual(newSave());
    expect(parse(JSON.stringify({ v: 1, at: "atlantis", cards: ["x", "work/kitab-al-hisab-al-khwarizmi"], companions: ["person/nobody"], step: { baghdad: 9 } }))).toEqual({ ...newSave(), cards: ["work/kitab-al-hisab-al-khwarizmi"] });
  });

  it("has its page strings in seven languages and the review mark, and no server or model", () => {
    for (const l of LANGS) {
      const s = JSON.parse(read(`../i18n/${l}.json`)) as Record<string, string>;
      for (const k of ["title", "jinni_1", "jinni_2", "review_note", "art_note"]) expect(s[k], `${l} ${k}`).toBeTruthy();
    }
    const app = read("../src/ui/app.ts");
    // Released: the page no longer carries the prototype label (release-status.json says why and on whose word).
    expect(app).not.toContain('t("prototype")');
    expect(app).toContain('"review_note"');
    expect(app).not.toMatch(/fetch\(|WebSocket|XMLHttpRequest/);
  });
});
