// Al-Jazari's room (sim/jazariroom.ts, content/jazari-room.ts): the elephant clock played by flying. A touch in the room
// gives exactly the clock command the page quest gives for the same act (one `put` a placement, `go` for the lever,
// a `flag` for a question or an answer), so the moves, the fewest, the goals and the run are the page quest's. What
// Hudhud carries survives a saved place. And the room's things and door pass the same nearness test as the workshop's.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CLOCK_ROAD, CLOCK_SLACK, clockPuzzle } from "../content/clock";
import { JR_APPROACH, JR_DOOR, JR_ROOM, JR_SCRIPTS, JR_THINGS, JR_WORLD, type JrThing } from "../content/jazari-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { spare } from "../sim/chain";
import { applyClock, clockGoals, newClock, put, restoreClock, type ClockCommand, type ClockStyle } from "../sim/clock";
import { distance, landing, near } from "../sim/door";
import { afterRun, applyRoom, newRoom, restoreRoom, roomGoals, snapshotRoom, whereIs, worthKeeping, type RoomCommand, type RoomState } from "../sim/jazariroom";
import { MOVE, advance, newMover } from "../sim/move";

const STYLES: ClockStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, unknown>;
/** A room past its opening words. */
const ready = (style: ClockStyle): RoomState => applyRoom(newRoom(style), { type: "skip" }).state;
const touch = (s: RoomState, id: string) => applyRoom(s, { type: "touch", id });
const playAll = (s: RoomState, cs: RoomCommand[]) => cs.reduce((x, c) => applyRoom(x, c).state, s);
/** The touches that carry a part to a place: pick it up where it is, then touch the place. */
const carryTo = (s: RoomState, part: string, place: number): RoomCommand[] => {
  const at = whereIs(s, part)!;
  const from = "place" in at ? `place-${at.place + 1}` : `spare-${at.spare + 1}`;
  return [{ type: "touch", id: from }, { type: "touch", id: `place-${place + 1}` }];
};
/** The page quest's moves that put the road in order (as clock.gtest.ts plays it). */
const fix = (s: RoomState): { place: number; part: string }[] => {
  const out: { place: number; part: string }[] = [];
  let p = s.clock.puzzle;
  CLOCK_ROAD.forEach((part, place) => {
    if (p.places[place] === part) return;
    out.push({ place, part });
    p = put(p, place, part);
  });
  return out;
};

describe("al-Jazari's room: a touch is the page quest's command", () => {
  it.each(STYLES)("picking a part up gives no command and moves nothing; putting it in a place is exactly one put, in %s", (style) => {
    const s = ready(style);
    for (let from = 0; from < 5; from++) {
      for (let to = 0; to < 5; to++) {
        const part = s.clock.puzzle.places[from]!;
        const picked = touch(s, `place-${from + 1}`);
        expect(picked.commands).toEqual([]);
        expect(picked.state.carrying).toBe(part);
        expect(picked.state.clock).toBe(s.clock);
        const placed = touch(picked.state, `place-${to + 1}`);
        if (from === to) {
          // Put back where it came from: no move.
          expect(placed.commands).toEqual([]);
          expect(placed.state.clock.moves).toBe(0);
        } else {
          const cmd: ClockCommand = { type: "put", place: to, part };
          expect(placed.commands).toEqual([cmd]);
          expect(placed.state.clock).toEqual(applyClock(s.clock, cmd));
        }
        expect(placed.state.carrying).toBeNull();
      }
    }
  });
  it.each(["explorer", "challenge"] as const)("a spare part from the workbench, put in a place, is the page quest's put of that part, and what stood there goes to the workbench, in %s", (style) => {
    const s = ready(style);
    const parts = spare(s.clock.puzzle).map((x) => x.id);
    expect(parts.length).toBe(2);
    for (const [k, part] of parts.entries()) {
      const picked = touch(s, `spare-${k + 1}`);
      expect(picked.state.carrying).toBe(part);
      const placed = touch(picked.state, "place-3");
      expect(placed.commands).toEqual([{ type: "put", place: 2, part }]);
      expect(placed.state.clock).toEqual(applyClock(s.clock, { type: "put", place: 2, part }));
      expect(spare(placed.state.clock.puzzle).map((x) => x.id)).toContain(s.clock.puzzle.places[2]);
    }
    // Touching another spare part while carrying one puts the first back and takes the second: no command.
    const swapped = touch(touch(s, "spare-1").state, "spare-2");
    expect(swapped.commands).toEqual([]);
    expect(swapped.state.carrying).toBe(parts[1]);
    expect(swapped.happened.map((x) => x.type)).toEqual(["drop", "pick"]);
  });
  it("the lever is the page quest's go, and puts back whatever is carried", () => {
    const s = touch(ready("explorer"), "place-2").state;
    const r = touch(s, "lever");
    expect(r.commands).toEqual([{ type: "go" }]);
    expect(r.state.carrying).toBeNull();
    expect(r.state.clock).toEqual(applyClock(s.clock, { type: "go" }));
    // The run stops where the page quest's does: Explorer's row stops at place 3 with a whistle reaching it.
    expect(r.state.clock.last).toMatchObject({ end: "idle", at: 2, carrying: "whistle" });
  });
  it.each(STYLES)("played to its end by carrying parts, the room reaches the page quest's state in as many moves as the fewest, in %s", (style) => {
    let s = ready(style);
    let page = newClock(style, clockPuzzle(style));
    for (const m of fix(s)) {
      const before = s;
      s = playAll(s, carryTo(s, m.part, m.place));
      page = applyClock(page, { type: "put", ...m });
      expect(s.clock.moves).toBe(before.clock.moves + 1);
    }
    expect(s.clock).toEqual(page);
    const r = touch(s, "lever");
    expect(r.state.clock.done).toBe(true);
    expect(r.state.clock.moves).toBe(page.par);
    expect(roomGoals(r.state)).toEqual(clockGoals(applyClock(page, { type: "go" }), CLOCK_SLACK[style]));
    // Done: Hudhud says the page has come loose, and nothing in the room can be touched any more.
    expect(afterRun(r.state).talk?.script).toBe("done");
    expect(touch(r.state, "place-1").state).toBe(r.state);
  });
});

describe("al-Jazari's room: talk is the page quest's questions and answers", () => {
  it("asking al-Jazari about the float and the balls sets the clock's own two flags, with the narrator's lines", () => {
    let s = touch(ready("explorer"), "jazari").state;
    expect(s.talk?.script).toBe("jazari");
    let r = applyRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedFloat" }]);
    expect(JR_SCRIPTS.jazari!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ck_float_1", mood: "think" });
    r = applyRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedBalls" }]);
    expect(JR_SCRIPTS.jazari!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("ck_balls_1");
    s = r.state;
    expect(roomGoals(s).curiosity).toBe(true);
  });
  it("the apprentice answered kindly is Kindness and is not asked again; answered bluntly she is answered, not kind", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "apprentice" }, { type: "choose", index: 0 }]);
    expect(kind.clock.flags).toEqual(["kind", "answered"]);
    expect(roomGoals(kind).kindness).toBe(true);
    expect(touch(applyRoom(kind, { type: "skip" }).state, "apprentice").state.talk?.script).toBe("apprenticeKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "apprentice" }, { type: "choose", index: 1 }]);
    expect(blunt.clock.flags).toEqual(["answered"]);
    expect(roomGoals(blunt).kindness).toBe(false);
    expect(touch(applyRoom(blunt, { type: "skip" }).state, "apprentice").state.talk?.script).toBe("apprenticeBlunt");
  });
  it("the box on the high shelf holds the feather once, with the page quest's own lines", () => {
    const r = touch(ready("story"), "box");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(JR_SCRIPTS.box!.nodes["1"]!.lines[0]!.key).toBe("ck_box_1");
    const again = touch(applyRoom(r.state, { type: "skip" }).state, "box");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("boxAgain");
  });
  it("while someone speaks nothing in the room is touched", () => {
    const s = newRoom("explorer");
    expect(s.talk?.script).toBe("intro");
    expect(touch(s, "place-1").state).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(JR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the clock quest's", () => {
    const keys = new Set(Object.values(JR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => n.lines.map((l) => l.key))));
    const own = [...keys].filter((k) => !k.startsWith("ck_"));
    expect(own.sort()).toEqual(["jr_jazari_bye", "jr_jazari_hello"]);
  });
});

describe("al-Jazari's room: the place kept", () => {
  it("keeps what Hudhud carries, and puts it back", () => {
    const s = playAll(ready("challenge"), [{ type: "touch", id: "place-1" }, { type: "touch", id: "place-4" }, { type: "touch", id: "spare-2" }]);
    expect(s.carrying).not.toBeNull();
    expect(worthKeeping(s)).toBe(true);
    const back = restoreRoom(JSON.parse(JSON.stringify(snapshotRoom(s))));
    expect(back).not.toBeNull();
    expect(back!.carrying).toBe(s.carrying);
    expect(back!.clock).toEqual({ ...s.clock, last: null });
    expect(back!.talk).toBeNull();
  });
  it("a part in the beak alone is worth keeping; a fresh room is not", () => {
    expect(worthKeeping(ready("story"))).toBe(false);
    expect(worthKeeping(touch(ready("story"), "place-1").state)).toBe(true);
  });
  it("is the clock's own snapshot: the page quest takes the room's place up, and the room takes the page quest's", () => {
    const s = playAll(ready("explorer"), carryTo(ready("explorer"), "falcon", 1));
    const snap = snapshotRoom(touch(s, "place-3").state);
    expect(restoreClock(snap, clockPuzzle)?.puzzle.places).toEqual(s.clock.puzzle.places);
    const fromPage = { style: "explorer", places: s.clock.puzzle.places, moves: 1, flags: [] };
    expect(restoreRoom(fromPage)).toMatchObject({ carrying: null, clock: { moves: 1 } });
  });
  it("refuses what cannot be trusted, and drops a part that is not in this way of playing", () => {
    expect(restoreRoom(null)).toBeNull();
    expect(restoreRoom({ style: "explorer", places: ["float"], moves: 0, flags: [] })).toBeNull();
    const story = snapshotRoom(ready("story"));
    expect(restoreRoom({ ...story, carrying: "rider" })?.carrying).toBeNull();
    expect(restoreRoom({ ...story, carrying: 7 })?.carrying).toBeNull();
  });
});

describe("al-Jazari's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("jr_"));
  // They were the last twenty-six of every table until al-Tusi's room (27 November 2026) appended its own after them,
  // and al-Khwarizmi's and al-Kindi's rooms, al-Idrisi's hall and al-Razi's study their own after those; they are still
  // one block, in the same order, in every table, and only those five rooms' keys come after them.
  it("are twenty-seven (the goodbye line jr_thanks was added in review on 27 November 2026), one block in every table, in the same order, with only al-Tusi's, al-Khwarizmi's and al-Kindi's rooms' keys, al-Idrisi's hall's, al-Razi's study's and Karima's room's after them", () => {
    expect(keys).toHaveLength(27);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("tsr_") || k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_") || k.startsWith("ahr_") || k.startsWith("smr_")), l).toBe(true);
    }
  });
  it("say that the room and the frame are invented, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.jr_note_room).toBe("الورشة وطاولة العمل والإطار الذي يحمل أجزاء الساعة من خيال اللعب، وليست صورة لساعة الجزري.");
    expect(tables.en!.jr_note_room).toBe("The workshop, the workbench and the frame that holds the clock's parts are invented for play; they are not a picture of al-Jazari's clock.");
  });
  it("carry no parenthesis and no digit outside their placeholders, except the places' numbers in the four languages that write them as digits", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = String(tables[l]![k]).replace(/\{\w+\}/g, "");
        expect(v, `${l} ${k}`).not.toMatch(/[()]/);
        if (!k.startsWith("jr_thing_place_")) expect(v, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
      }
    }
  });
});

describe("the room engine's nearness and door, shared by both rooms", () => {
  const touchable = (s: RoomState, t: JrThing) => t.kind !== "spare" || spare(s.clock.puzzle)[t.index!] !== undefined;
  it.each(STYLES)("every thing in al-Jazari's room, flown to, is in reach where the bird lands, and is the nearest thing there, in %s", (style) => {
    const s = ready(style);
    for (const t of JR_THINGS.filter((x) => touchable(s, x))) {
      const at = landing(t, JR_ROOM, JR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = JR_THINGS.filter((x) => touchable(s, x)).sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
    }
  });
  it("the box needs flight: it is out of reach from the floor and from the workbench", () => {
    const box = JR_THINGS.find((t) => t.id === "box")!;
    expect(near(box, { x: box.x, y: JR_WORLD.floor })).toBe(false);
    expect(near(box, { x: box.x, y: JR_ROOM.perches.find((p) => p.y === 470)!.y })).toBe(false);
  });
  it("has the workshop's door in the workshop's place, the same height and floor, and a world as wide", () => {
    expect(JR_DOOR).toEqual(DOOR);
    expect({ h: JR_WORLD.height, floor: JR_WORLD.floor, view: JR_WORLD.view, w: JR_WORLD.width }).toEqual({ h: WORLD.height, floor: WORLD.floor, view: WORLD.view, w: WORLD.width });
    expect(JR_ROOM.bounds).toEqual(ROOM.bounds);
  });
  it.each([["the workshop", ROOM, DOOR], ["al-Jazari's room", JR_ROOM, JR_DOOR]] as const)("in %s, walking right along the floor reaches the door, by the same test as a thing", (_name, room, door) => {
    let m = newMover(250, room.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(door, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: finishing the clock never takes the bird through it by itself", () => {
    for (const t of JR_THINGS) expect(near(JR_DOOR, landing(t, JR_ROOM, JR_APPROACH[t.kind])), t.id).toBe(false);
  });
});
