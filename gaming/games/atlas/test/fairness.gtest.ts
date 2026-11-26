// A round is fair when the place its question points at is the place its answer is scored at. These tests hold the
// rule, and hold the pack that is shipped to it: no round named for one place and scored at another is in the game.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { heldForItsPlace, namedForAPlace } from "../src/fairness";
import { LANGS, decodePack, type PackFile, type PackLabels, type PackPlace, type PackRound } from "../src/pack";
import { DAILY_SLOTS, EVEN_WEIGHT, buildSchedule } from "../src/schedule";

const data = (name: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")) as unknown;
const pack = decodePack(data("pack.v1.json") as PackFile);
const en = (data("labels.v1.en.json") as PackLabels).labels;
const report = data("report.v1.json") as { leftOut: Record<string, number>; freeSlot: { militaryWeight: number }; inPack: { military: number; people: number; civic: number; rounds: number } };
const review = data("review.v1.json") as { why: string; rounds: Array<{ id: string; label: string; recordedAt: string; recordedAtName: string }> };

describe("what makes a round fair", () => {
  it("knows a name that says where a thing happened", () => {
    for (const label of ["Battle of Abu Klea", "The Battle of Buzakha", "Siege of Acre (1291)", "Second Battle of Panipat", "Treaty of Granada", "Sack of Baghdad", "Great Siege of Malta", "Founding of Fez"]) expect(namedForAPlace(label), label).toBe(true);
    for (const label of ["Al-Mansur enters the city", "The Abbasid revolution", "Death of Saladin", "Ibn Battuta leaves Tangier", "A battle at sea", "Completion of the Great Mosque"]) expect(namedForAPlace(label), label).toBe(false);
  });

  it("holds a round back only when it is named for a place and no label gives the scored place's name", () => {
    expect(heldForItsPlace("Battle of Abu Klea", false)).toBe(true);
    // Another name for the same place, which some language's label does give: asked.
    expect(heldForItsPlace("Battle of Adrianople (1829)", true)).toBe(false);
    // Not named for a place at all: asked, and scored where the record says.
    expect(heldForItsPlace("The Abbasid revolution", false)).toBe(false);
  });
});

describe("the pack that is shipped", () => {
  it("asks no round that is named for one place and scored at another", () => {
    let namedRounds = 0;
    for (const round of pack.rounds) {
      const label = en[round.id]!;
      if (!namedForAPlace(label)) continue;
      namedRounds += 1;
      if (!round.namesPlace) throw new Error(`${round.id} ("${label}") is named for a place and scored at ${pack.places[round.place]!.id}, which none of its labels names`);
    }
    // The rule is not passed by having nothing to check.
    expect(namedRounds).toBeGreaterThan(300);
  });

  it("keeps the rounds it holds back out of the game, each with the record to look at", () => {
    const asked = new Set(pack.rounds.map((r) => r.id));
    expect(review.rounds.length).toBe(report.leftOut["event: named for a place that none of its labels gives as the place it is recorded at"]);
    expect(review.rounds.length).toBeGreaterThan(0);
    for (const held of review.rounds) {
      expect(asked.has(held.id), held.id).toBe(false);
      expect(held.id.startsWith("event/")).toBe(true);
      expect(held.recordedAt.startsWith("place/")).toBe(true);
      expect(namedForAPlace(held.label), held.label).toBe(true);
    }
    // The round that showed the fault: a battle in the desert, recorded at the city it was fought for.
    expect(review.rounds.some((r) => r.id.includes("abu-klea") && r.recordedAt === "place/khartoum")).toBe(true);
    expect(review.why.length).toBeGreaterThan(40);
  });

  it("did not become a game of battles by losing them: the day's mix is what it was", () => {
    // Before the rule the pack held 709 military rounds in 2,125. Holding back 258 battles must not have been
    // answered by asking more of them.
    expect(report.inPack.military / report.inPack.rounds).toBeLessThan(0.36);
    expect(report.inPack.people).toBeGreaterThan(report.inPack.military);
    expect(report.freeSlot.militaryWeight).toBeGreaterThanOrEqual(0.5);
    expect(report.freeSlot.militaryWeight).toBeLessThanOrEqual(1);
  });
});

describe("the free slot of a day", () => {
  // A small world: battles in many places, people in fewer, civic events in few, as in the museum's records.
  const places: PackPlace[] = [];
  const rounds: PackRound[] = [];
  const add = (category: PackRound["category"], n: number, perPlace: number) => {
    for (let i = 0; i < n; i++) {
      const place = places.length;
      places.push({ id: `place/${category}-${i}`, lat: (i * 7) % 60, lon: (i * 13) % 120, precision: "site", kind: "city", region: `region-${i % 6}`, refs: 1 });
      for (let k = 0; k < perPlace; k++) rounds.push({ id: `${category}/${i}-${k}`, type: category === "people" ? "birth" : "event", category, place, year: 900 + i, hijri: 0, datePrecision: "year", namesPlace: false });
    }
  };
  add("civic", 30, 3);
  add("people", 150, 2);
  add("military", 200, 2);
  const mix = (schedule: number[][]) => {
    const count = { civic: 0, people: 0, military: 0 };
    for (const day of schedule) for (const i of day) count[rounds[i]!.category]++;
    return count;
  };

  it("goes to a battle on places alone, and to a person when battles are counted for less", () => {
    const days = 40;
    const even = mix(buildSchedule(places, rounds, days, "t", EVEN_WEIGHT));
    const lean = mix(buildSchedule(places, rounds, days, "t", { civic: 1, people: 1, military: 0.3 }));
    const fixedPeople = DAILY_SLOTS.filter((s) => s === "people").length * days;
    expect(even.military).toBeGreaterThan(lean.military);
    expect(lean.people).toBeGreaterThan(fixedPeople);
    // Either way a day has five rounds and the fixed ones are honoured.
    for (const m of [even, lean]) {
      expect(m.civic + m.people + m.military).toBe(days * DAILY_SLOTS.length);
      expect(m.civic).toBeGreaterThanOrEqual(days);
      expect(m.people).toBeGreaterThanOrEqual(fixedPeople);
      expect(m.military).toBeGreaterThanOrEqual(days);
    }
  });

  it("is the same every time for the same rounds, seed and weight", () => {
    const w = { civic: 1, people: 1, military: 0.62 };
    expect(buildSchedule(places, rounds, 30, "seed", w)).toEqual(buildSchedule(places, rounds, 30, "seed", w));
    expect(LANGS.length).toBe(7);
  });
});

describe("the view a round begins from", () => {
  it("is the whole globe, whatever the last reveal came in to", async () => {
    const { HOME_VIEW, REVEAL_ZOOM, revealZoom } = await import("../src/geo");
    // A guess 149 km from its answer (the round a reviewer answered before the globe seemed to vanish).
    expect(revealZoom(149 / 6371)).toBe(REVEAL_ZOOM.most);
    // A guess a quarter of the world away keeps the whole globe.
    expect(revealZoom(Math.PI / 2)).toBe(REVEAL_ZOOM.least);
    expect(revealZoom(0.3)).toBeCloseTo(3, 5);
    // The view a round begins from shows the whole disc: less than twice the first size, never the reveal's.
    expect(HOME_VIEW.zoom).toBeLessThan(2);
    expect(HOME_VIEW.zoom).toBeLessThan(REVEAL_ZOOM.most / 4);
    expect(Math.abs(HOME_VIEW.lat)).toBeLessThanOrEqual(90);
  });
});
