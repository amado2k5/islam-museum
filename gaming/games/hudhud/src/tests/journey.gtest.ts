// The journey through the built quests (content/journey.ts), its place in the save, the door's nearness test and the
// corridor that leads to it (sim/door.ts), and the strings written for them.
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import atlas from "../content/atlas.v1.json";
import { DOOR_ART } from "../art/corridor";
import { BUILT, JOURNEY, WORKSHOP_QUEST, subjectOf } from "../content/journey";
import { DOOR, THINGS, WORLD } from "../content/workshop";
import { furtherJourney, mergeSaves, newSave, readJourney, readSave, writeSave, type SaveFile } from "../save/save";
import { CORRIDOR, corridorDoor, distance, near, newCorridor, stepCorridor } from "../sim/door";
import { MOVE, newMover, type Intent } from "../sim/move";

const src = resolve(__dirname, "..");
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;

describe("the journey's order", () => {
  it("is the flying scene first, then every quest played on a page in the Atlas's order", () => {
    expect(JOURNEY[0]).toBe(WORKSHOP_QUEST);
    const worldOrder = new Map(atlas.worlds.map((w) => [w.id, w.order]));
    const pages = atlas.subjects
      .filter((s) => BUILT[s.id] !== undefined && BUILT[s.id] !== WORKSHOP_QUEST)
      .sort((a, b) => worldOrder.get(a.world)! - worldOrder.get(b.world)! || a.quest.localeCompare(b.quest))
      .map((s) => BUILT[s.id]);
    expect(JOURNEY.slice(1)).toEqual(pages);
  });
  it("holds every built quest exactly once, and nothing that is not built", () => {
    expect(new Set(JOURNEY).size).toBe(JOURNEY.length);
    expect([...JOURNEY].sort()).toEqual(Object.values(BUILT).sort());
    // Every quest constant the content declares is in it: a quest added later must be added here as well.
    const declared = readdirSync(resolve(src, "content"))
      .filter((f) => f.endsWith(".ts"))
      .flatMap((f) => [...readFileSync(resolve(src, "content", f), "utf8").matchAll(/export const \w+_QUEST = "([a-z0-9-]+)"/g)].map((m) => m[1]!));
    expect(declared.length).toBeGreaterThan(0);
    for (const q of declared) expect(JOURNEY, q).toContain(q);
    // And every quest the page registers in its list of page quests.
    const app = readFileSync(resolve(src, "ui", "app.ts"), "utf8");
    const registered = [...app.matchAll(/^ {4}\[(\w+_QUEST)\]: \{$/gm)].map((m) => m[1]!);
    expect(registered.length).toBe(JOURNEY.length - 1);
  });
  it("names each quest by a subject of the Atlas, and every subject it names is on the Atlas", () => {
    for (const q of JOURNEY) {
      const sub = subjectOf(q);
      expect(sub, q).not.toBeNull();
      expect(atlas.subjects.some((s) => s.id === sub), q).toBe(true);
    }
    expect(subjectOf("w99q9-nothing")).toBeNull();
  });
});

// Every scene a room (asked for by the founder, 27 November 2026; the paper workshop of Samarkand, the thirteenth, was the
// last): with WebGL, no scene of the journey opens a page quest, and so none ends in a corridor. The flying scene is Ibn
// al-Haytham's workshop; every other quest of the journey is opened by the registry in ui/app.ts (PAGE_QUESTS), whose
// entry must have a room (`room: roomsOn` and a `makeRoom`) that leads on through its own door (`through: () => moveOn()`)
// and falls back to its page only without WebGL. The page quests and the corridor stay in the code for that case.
describe("every scene of the journey", () => {
  const app = readFileSync(resolve(src, "ui", "app.ts"), "utf8");
  const registry = app.slice(app.indexOf("const PAGE_QUESTS:"), app.indexOf("function openPage("));
  /** The registry's entry for a quest, by the name of the constant that holds its id in ui/app.ts. */
  const entryOf = (quest: string): string | null => {
    const names = [...registry.matchAll(/\n {4}\[(\w+)\]: \{/g)].map((m) => m[1]!);
    const content = readdirSync(resolve(src, "content")).filter((f) => f.endsWith(".ts")).map((f) => readFileSync(resolve(src, "content", f), "utf8")).join("\n");
    const name = names.find((n) => new RegExp(`export const ${n} = "${quest}";`).test(content));
    if (!name) return null;
    const at = registry.indexOf(`[${name}]: {`);
    const next = registry.slice(at + 1).search(/\n {4}\[\w+\]: \{/);
    return registry.slice(at, next < 0 ? undefined : at + 1 + next);
  };
  it("has a room: the flying scene is one, and every other scene's entry in the registry opens a room with WebGL, leads on through the room's own door and falls back to its page only without WebGL", () => {
    expect(JOURNEY.length).toBe(13);
    for (const quest of JOURNEY) {
      if (quest === WORKSHOP_QUEST) continue;
      const entry = entryOf(quest);
      expect(entry, quest).not.toBeNull();
      expect(entry, quest).toMatch(/\n {6}room: roomsOn,\n {6}makeRoom: \(c, title\) =>/);
      expect(entry, quest).toContain("through: () => moveOn(),");
      expect(entry, quest).toMatch(/fallback: \(\) => openPage\(\w+, inJourney, true\),/);
    }
  });
  it("opens a room whenever rooms are on: openPage builds the page quest only when the entry has no room, rooms are off, or the page is asked for", () => {
    const open = app.slice(app.indexOf("function openPage("), app.indexOf("function closeScene("));
    expect(open).toContain("if (!onPage && page.room?.() && page.makeRoom) {");
    // The corridor follows only a page quest's own finish (the rooms' finish is pageFinish alone).
    expect(open).toContain("finish: (g) => (pageFinish(quest, g), queueMicrotask(() => showCorridor(quest))),");
    expect([...registry.matchAll(/showCorridor/g)]).toHaveLength(0);
  });
});

describe("the journey in the save", () => {
  const withJourney = (j: unknown): string => {
    const s = JSON.parse(writeSave(newSave())) as { slots: Record<string, unknown>[] };
    s.slots[0]!.journey = j;
    return JSON.stringify(s);
  };
  it("is absent from a new save, and an old save without it loads", () => {
    expect(writeSave(newSave())).not.toContain("journey");
    const r = readSave(writeSave(newSave()));
    expect(r.kind).toBe("ok");
    expect(r.save.slots[0]!.journey).toBeUndefined();
  });
  it("is read back as written", () => {
    expect(readSave(withJourney({ at: 3 })).save.slots[0]!.journey).toEqual({ at: 3 });
    expect(readSave(withJourney({ at: 0, round: 2 })).save.slots[0]!.journey).toEqual({ at: 0, round: 2 });
    expect(readSave(withJourney({ at: 13 })).save.slots[0]!.journey).toEqual({ at: 13 });
  });
  it("of a wrong type means no journey, and leaves the rest of the slot as it is", () => {
    for (const bad of ["3", 3, null, [], { at: -1 }, { at: 1.5 }, { at: "2" }, { at: 1e6 }, { at: 2, round: -1 }, { at: 2, round: "1" }, {}]) {
      const r = readSave(withJourney(bad));
      expect(r.kind, JSON.stringify(bad)).toBe("ok");
      expect(r.save.slots[0]!.journey, JSON.stringify(bad)).toBeUndefined();
      expect(r.save.slots[0]!.settings.style).toBe("explorer");
    }
    expect(readJourney({ at: 4, round: 0 })).toEqual({ at: 4 });
  });
  it("is the further of two when saves are merged, whichever page holds it", () => {
    const at = (j: { at: number; round?: number } | undefined): SaveFile => ({ ...newSave(), slots: [{ ...newSave().slots[0]!, ...(j ? { journey: j } : {}) }, null, null] });
    expect(mergeSaves(at({ at: 2 }), at({ at: 5 })).slots[0]!.journey).toEqual({ at: 5 });
    expect(mergeSaves(at({ at: 5 }), at({ at: 2 })).slots[0]!.journey).toEqual({ at: 5 });
    expect(mergeSaves(at(undefined), at({ at: 1 })).slots[0]!.journey).toEqual({ at: 1 });
    expect(mergeSaves(at({ at: 1 }), at(undefined)).slots[0]!.journey).toEqual({ at: 1 });
    expect(mergeSaves(at(undefined), at(undefined)).slots[0]!.journey).toBeUndefined();
    expect("journey" in mergeSaves(at(undefined), at(undefined)).slots[0]!).toBe(false);
    // Begun again after its end: a later round is further than the end of an earlier one.
    expect(mergeSaves(at({ at: 0, round: 1 }), at({ at: 13 })).slots[0]!.journey).toEqual({ at: 0, round: 1 });
    expect(mergeSaves(at({ at: 13 }), at({ at: 0, round: 1 })).slots[0]!.journey).toEqual({ at: 0, round: 1 });
    expect(furtherJourney({ at: 4, round: 1 }, { at: 9 })).toEqual({ at: 4, round: 1 });
  });
});

describe("the door's nearness", () => {
  it("is the same test the workshop's things have always used", () => {
    const bird = { x: 1000, y: WORLD.floor };
    for (const t of THINGS) expect(distance(t, bird)).toBeCloseTo(Math.hypot(t.x - bird.x, t.y - (bird.y - 30)), 9);
    expect(near({ x: 0, y: -30, reach: 10 }, { x: 0, y: 0 })).toBe(true);
    expect(near({ x: 10, y: -30, reach: 10 }, { x: 0, y: 0 })).toBe(false);
  });
  it("puts the workshop's door within the bird's reach on the floor at the garden's far end, and nowhere near the start", () => {
    const right = WORLD.width - 24 - MOVE.half;
    expect(near(DOOR, newMover(right, WORLD.floor))).toBe(true);
    expect(near(DOOR, newMover(2000, WORLD.floor))).toBe(false);
    expect(near(DOOR, newMover(250, WORLD.floor))).toBe(false);
    // Clear of the fountain (its basin reaches x 2286) and the lantern's top, the two perches in the garden, and inside the world.
    expect(DOOR.x - DOOR_ART.w / 2).toBeGreaterThan(2286);
    expect(DOOR.x + DOOR_ART.w / 2).toBeLessThanOrEqual(WORLD.width);
    expect(near(DOOR, newMover(2238, WORLD.floor))).toBe(false);
    expect(near(DOOR, newMover(2242, WORLD.floor))).toBe(true);
    expect(Math.abs(DOOR.x - 1945)).toBeGreaterThan(300);
  });
});

describe("the corridor", () => {
  const right: Intent = { dir: 1, jump: false, down: false };
  const left: Intent = { dir: -1, jump: false, down: false };
  const still: Intent = { dir: 0, jump: false, down: false };
  const walk = (rtl: boolean, intent: Intent) => {
    let c = newCorridor(rtl);
    let steps = 0;
    while (!c.arrived && steps < 2000) {
      c = stepCorridor(c, intent, MOVE.step);
      steps++;
    }
    return { c, steps };
  };
  it("reaches the door from the start in a bounded number of steps at full speed", () => {
    const { c, steps } = walk(false, right);
    expect(c.arrived).toBe(true);
    // About 2.4 seconds of walking at 120 steps a second.
    expect(steps).toBeGreaterThan(250);
    expect(steps).toBeLessThanOrEqual(300);
    expect(near(corridorDoor(false), c.mover)).toBe(true);
  });
  it("stops when the direction is let go, and never reaches the door going the wrong way", () => {
    let c = newCorridor(false);
    for (let i = 0; i < 60; i++) c = stepCorridor(c, right, MOVE.step);
    const moving = c.mover.x;
    for (let i = 0; i < 60; i++) c = stepCorridor(c, still, MOVE.step);
    const stopped = c.mover.x;
    for (let i = 0; i < 60; i++) c = stepCorridor(c, still, MOVE.step);
    expect(c.mover.x).toBe(stopped);
    expect(c.mover.vx).toBe(0);
    expect(stopped).toBeGreaterThan(moving);
    expect(walk(false, left).c.arrived).toBe(false);
  });
  it("is mirrored on a right-to-left page: the bird starts on the right and reaches the door going left", () => {
    const start = newCorridor(true);
    expect(start.mover.x).toBe(CORRIDOR.w - CORRIDOR.start);
    expect(corridorDoor(true).x).toBeLessThan(start.mover.x);
    const { c, steps } = walk(true, left);
    expect(c.arrived).toBe(true);
    expect(steps).toBeLessThanOrEqual(300);
    expect(walk(true, right).c.arrived).toBe(false);
  });
  it("ignores the jump: the bird stays on its one floor", () => {
    let c = newCorridor(false);
    for (let i = 0; i < 120; i++) c = stepCorridor(c, { dir: 1, jump: i % 2 === 0, down: false }, MOVE.step);
    expect(c.mover.y).toBe(CORRIDOR.floor);
    expect(c.mover.hops).toBe(0);
  });
  it("stands still once the door is reached", () => {
    const { c } = walk(false, right);
    expect(stepCorridor(c, right, 1)).toBe(c);
  });
});

describe("the journey's strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(readFileSync(resolve(src, "..", "i18n", `${l}.json`), "utf8")) as Record<string, string>]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("jn_"));
  // They were the last fourteen of every table until al-Jazari's room (27 November 2026) appended its own after them;
  // they are still one block, in the same order, in every table.
  it("are fourteen, one block in every table, in the same order", () => {
    expect(keys).toHaveLength(14);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
    }
  });
  it("carry no digit outside their placeholders, and say nothing about history", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!.replace(/\{\w+\}/g, "");
        expect(v, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/[()]/);
      }
    }
  });
});
