// Al-Khwarizmi's room (sim/khwarizmiroom.ts, content/khwarizmi-room.ts, ui/khwarizmi.ts): the locked box played by
// flying. A hollow group touched gives exactly the restore the page's button gives for the same side and kind, a weight
// the page's balance of its kind, the scoop the page's share, and a question, an answer or the feather a `flag`, so that
// the counts, the slips, the goals, the sentence in words and the three ways of playing are the page quest's. The place
// kept is the quest's own snapshot. The trays hold every problem the quest can reach. And the room's things and door
// pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ALGEBRA_SLACK, algebraStart, equationWords } from "../content/algebra";
import { AKR_APPROACH, AKR_DOOR, AKR_IDS, AKR_ROOM, AKR_SCRIPTS, AKR_TRAY, AKR_TRAYS, AKR_WORLD, akrThings, hollowSpot, trayOf, type AkrThing } from "../content/khwarizmi-room";
import { JR_DOOR, JR_ROOM, JR_WORLD } from "../content/jazari-room";
import { TSR_DOOR, TSR_ROOM, TSR_WORLD } from "../content/tusi-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { ALL_MOVES, algebraGoals, applyAlgebra, keyOf, moveName, newAlgebra, reachable, restoreAlgebra, shortest, snapshotAlgebra, type AlgebraState, type AlgebraStyle, type Equation, type Move } from "../sim/algebra";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { applyKhwarizmiRoom, hollowThere, keptAfter, khwarizmiGoals, moveOf, newKhwarizmiRoom, restoreKhwarizmi, snapshotKhwarizmi, touchableNow, trayLayout, type KhwarizmiCommand, type KhwarizmiState } from "../sim/khwarizmiroom";

const STYLES: AlgebraStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
/** A room past its opening words. */
const ready = (style: AlgebraStyle): KhwarizmiState => applyKhwarizmiRoom(newKhwarizmiRoom(style), { type: "skip" }).state;
const touch = (s: KhwarizmiState, id: string) => applyKhwarizmiRoom(s, { type: "touch", id });
const playAll = (s: KhwarizmiState, cs: KhwarizmiCommand[]) => cs.reduce((x, c) => applyKhwarizmiRoom(x, c).state, s);
/** The thing of the room that makes a move. */
const thingFor = (m: Move): string => (m.type === "restore" ? `restore-${m.side}-${m.kind}` : m.type === "balance" ? `weight-${m.kind}` : "scoop");
/** The page's buttons (ui/algebra.ts `shown`): a restore only where something is taken away; balancing and sharing always. */
const pageButtons = (a: AlgebraState): Move[] => ALL_MOVES.filter((m) => m.type !== "restore" || a.eq[m.side][m.kind === "things" ? "lessThings" : "lessNumber"] > 0);
/** Every problem a way of playing can reach, rebuilt from the keys the rules' own search keeps. */
const reached = (style: AlgebraStyle): Equation[] =>
  [...reachable(algebraStart(style)).keys()].map((k) => {
    const [l, r] = k.split("|").map((x) => x.split(",").map(Number)) as [number[], number[]];
    const side = (v: number[]) => ({ things: v[0]!, number: v[1]!, lessThings: v[2]!, lessNumber: v[3]! });
    return { left: side(l), right: side(r) };
  });

describe("al-Khwarizmi's room: a thing touched is the page quest's move", () => {
  it("maps every thing that makes a move to the page's button for the same move, and every move the page has to one thing", () => {
    for (const m of ALL_MOVES) expect(moveOf(thingFor(m)), moveName(m)).toEqual(m);
    const movers = AKR_IDS.filter((id) => moveOf(id) !== null);
    expect(movers.sort()).toEqual(ALL_MOVES.map(thingFor).sort());
    for (const id of ["khwarizmi", "child", "box"]) expect(moveOf(id)).toBeNull();
  });
  it.each(STYLES)("in every problem %s can reach, the things that can be touched are exactly the page's buttons, and each gives the page's command and state", (style) => {
    for (const eq of reached(style)) {
      const s: KhwarizmiState = { algebra: { ...newAlgebra(style, algebraStart(style)), eq }, talk: null };
      const touchable = AKR_IDS.filter((id) => moveOf(id) !== null && touchableNow(s.algebra, id));
      expect(touchable.sort(), keyOf(eq)).toEqual(pageButtons(s.algebra).map(thingFor).sort());
      for (const m of pageButtons(s.algebra)) {
        const r = touch(s, thingFor(m));
        expect(r.commands, `${keyOf(eq)} ${moveName(m)}`).toEqual([m]);
        expect(r.state.algebra, `${keyOf(eq)} ${moveName(m)}`).toEqual(applyAlgebra(s.algebra, m));
      }
    }
  });
  it("a hollow group that is not there gives nothing, as the page has no button for it", () => {
    const s = ready("story");
    for (const id of AKR_IDS.filter((x) => x.startsWith("restore-"))) {
      const r = touch(s, id);
      expect(r.commands, id).toEqual([]);
      expect(r.state, id).toBe(s);
    }
  });
  it("a weight whose kind is not on both sides is a slip, counted, with the problem unchanged, as on the page", () => {
    const s = ready("explorer");
    const r = touch(s, "weight-number");
    expect(r.commands).toEqual([{ type: "balance", kind: "number" }]);
    expect(r.state.algebra.slips).toBe(1);
    expect(r.state.algebra.moves).toBe(0);
    expect(r.state.algebra.eq).toEqual(s.algebra.eq);
    expect(r.state.algebra.last).toEqual({ move: { type: "balance", kind: "number" }, applied: false, slip: "not-on-both" });
    expect(r.happened).toEqual([{ type: "move", move: { type: "balance", kind: "number" }, applied: false }]);
    // The scoop before the problem can be shared is a slip too.
    expect(touch(s, "scoop").state.algebra.last?.slip).toBe("cannot-share");
  });
  it.each(STYLES)("the fewest moves, touched, open the box in %s: the sentence after each is the page's, the box opens, Hudhud says the page's last line, the goals are the page's, and nothing more is touched", (style) => {
    const path = shortest(algebraStart(style))!;
    let s = ready(style);
    let page = newAlgebra(style, algebraStart(style));
    const say = (key: string, vars?: Record<string, string | number>) => `${key}${JSON.stringify(vars ?? {})}`;
    for (const m of path) {
      const r = touch(s, thingFor(m));
      page = applyAlgebra(page, m);
      s = r.state;
      expect(equationWords(s.algebra.eq, say, String)).toBe(equationWords(page.eq, say, String));
    }
    expect(s.algebra).toEqual(page);
    expect(s.algebra.done).toBe(true);
    expect(s.talk?.script).toBe("done");
    expect(AKR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("ak_done_1");
    expect(khwarizmiGoals(s)).toEqual(algebraGoals(page, ALGEBRA_SLACK[style]));
    const after = applyKhwarizmiRoom(s, { type: "skip" }).state;
    for (const id of AKR_IDS) expect(touch(after, id).state, id).toBe(after);
  });
  it("the last move says that the box opened", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "restore-left-number" }, { type: "touch", id: "weight-things" }]);
    const r = touch(s, "scoop");
    expect(r.happened.map((x) => x.type)).toEqual(["move", "opened", "talk"]);
  });
});

describe("al-Khwarizmi's room: talk is the page quest's questions and answers", () => {
  it("asking al-Khwarizmi how he wrote problems and about the two operations sets the quest's two flags, with the narrator's lines (the page's own)", () => {
    const s = touch(ready("explorer"), "khwarizmi").state;
    expect(s.talk?.script).toBe("khwarizmi");
    let r = applyKhwarizmiRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedWords" }]);
    expect(AKR_SCRIPTS.khwarizmi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ak_words_1", mood: "think" });
    r = applyKhwarizmiRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedOps" }]);
    expect(AKR_SCRIPTS.khwarizmi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("ak_ops_1");
    expect(khwarizmiGoals(r.state).curiosity).toBe(true);
    // The goodbye is the room's own, not another room's.
    r = applyKhwarizmiRoom(r.state, { type: "choose", index: 1 });
    expect(AKR_SCRIPTS.khwarizmi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("akr_khwarizmi_bye");
  });
  it("the child answered kindly is Kindness and answered, in the page's order; bluntly the child is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 0 }]);
    expect(kind.algebra.flags).toEqual(["kind", "answered"]);
    expect(khwarizmiGoals(kind).kindness).toBe(true);
    expect(touch(applyKhwarizmiRoom(kind, { type: "skip" }).state, "child").state.talk?.script).toBe("childKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 1 }]);
    expect(blunt.algebra.flags).toEqual(["answered"]);
    expect(khwarizmiGoals(blunt).kindness).toBe(false);
    expect(touch(applyKhwarizmiRoom(blunt, { type: "skip" }).state, "child").state.talk?.script).toBe("childBlunt");
  });
  it("under the locked box is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "box");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(AKR_SCRIPTS.box!.nodes["1"]!.lines[0]!.key).toBe("ak_feather_1");
    const again = touch(applyKhwarizmiRoom(r.state, { type: "skip" }).state, "box");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("boxAgain");
  });
  it("while someone speaks nothing in the room is touched", () => {
    const s = newKhwarizmiRoom("explorer");
    expect(s.talk?.script).toBe("intro");
    expect(AKR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => l.key)).toEqual(["ak_intro_1", "ak_intro_2"]);
    for (const id of ["weight-things", "scoop", "restore-left-number", "box"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(AKR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the locked box's quest's", () => {
    const keys = new Set(Object.values(AKR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("ak_"));
    expect(own.sort()).toEqual(["akr_khwarizmi_bye", "akr_khwarizmi_hello", "akr_thanks"]);
  });
});

describe("al-Khwarizmi's room: the place kept", () => {
  it("is the quest's own snapshot, so that the page quest takes the room's place up and the room takes the page's", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "weight-number" }, { type: "touch", id: "restore-left-number" }, { type: "touch", id: "box" }, { type: "skip" }]);
    expect(snapshotKhwarizmi(s)).toEqual(snapshotAlgebra(s.algebra));
    const page = restoreAlgebra(JSON.parse(JSON.stringify(snapshotKhwarizmi(s))), algebraStart);
    expect(page?.eq).toEqual(s.algebra.eq);
    const back = restoreKhwarizmi(JSON.parse(JSON.stringify(snapshotAlgebra(s.algebra))));
    expect(back).not.toBeNull();
    expect(back!.algebra).toEqual({ ...s.algebra, last: null });
    expect(back!.talk).toBeNull();
  });
  it("is kept by the page's rule: after a move, a slip or a flag, the quest; after the move that opens the box, nothing new; touching a person, nothing", () => {
    const s = ready("explorer");
    const slip = touch(s, "weight-number");
    expect(keptAfter(slip.state, slip.commands)).toEqual(snapshotAlgebra(slip.state.algebra));
    const move = touch(s, "restore-left-number");
    expect(keptAfter(move.state, move.commands)).toEqual(snapshotAlgebra(move.state.algebra));
    const feather = touch(s, "box");
    expect(keptAfter(feather.state, feather.commands)).toEqual(snapshotAlgebra(feather.state.algebra));
    const talk = touch(s, "khwarizmi");
    expect(keptAfter(talk.state, talk.commands)).toBeUndefined();
    const nearly = playAll(s, [{ type: "touch", id: "restore-left-number" }, { type: "touch", id: "weight-things" }]);
    const opened = touch(nearly, "scoop");
    expect(opened.state.algebra.done).toBe(true);
    expect(keptAfter(opened.state, opened.commands)).toBeUndefined();
  });
  it("comes back as it was, with no talk and no last move, and refuses what cannot be trusted", () => {
    const s = playAll(ready("challenge"), [{ type: "touch", id: "restore-right-things" }]);
    const back = restoreKhwarizmi(JSON.parse(JSON.stringify(snapshotKhwarizmi(s))))!;
    expect(back.algebra.eq).toEqual(s.algebra.eq);
    expect(back.algebra.moves).toBe(1);
    expect(back.algebra.last).toBeNull();
    expect(back.talk).toBeNull();
    expect(restoreKhwarizmi(null)).toBeNull();
    expect(restoreKhwarizmi({ style: "explorer", eq: { left: { things: 1, number: 0, lessThings: 0, lessNumber: 0 }, right: { things: 0, number: 5, lessThings: 0, lessNumber: 0 } }, moves: 3, slips: 0, flags: [] })).toBeNull();
  });
});

describe("al-Khwarizmi's room: the trays as drawn", () => {
  it.each(STYLES)("every problem %s can reach fits its trays, with as many boxes and coins, whole and hollow, as the side holds", (style) => {
    for (const eq of reached(style)) {
      for (const side of [eq.left, eq.right]) {
        const { items, fits } = trayLayout(side);
        expect(fits, keyOf(eq)).toBe(true);
        const n = (kind: string, hollow: boolean) => items.filter((i) => i.kind === kind && i.hollow === hollow).length;
        expect([n("box", false), n("coin", false), n("box", true), n("coin", true)], keyOf(eq)).toEqual([side.things, side.number, side.lessThings, side.lessNumber]);
        const inner = AKR_TRAY.w - 2 * AKR_TRAY.pad;
        for (const it of items) {
          const size = (it.kind === "box" ? AKR_TRAY.box : AKR_TRAY.coin).size;
          expect(it.x - size / 2, keyOf(eq)).toBeGreaterThanOrEqual(0);
          expect(it.x + size / 2, keyOf(eq)).toBeLessThanOrEqual(inner);
          if (it.hollow) expect(it.y - size / 2, keyOf(eq)).toBeGreaterThanOrEqual(AKR_TRAY.strip.top);
          else expect(it.y + size / 2, keyOf(eq)).toBeLessThanOrEqual(AKR_TRAY.shownH);
        }
      }
    }
  });
  it("draws each hollow group in its own part of the strip, under the place that is touched to restore it", () => {
    for (const rtl of [false, true]) {
      for (const side of ["left", "right"] as const) {
        const tray = AKR_TRAYS[trayOf(side, rtl)]!;
        const layout = trayLayout({ things: 0, number: 0, lessThings: 1, lessNumber: 4 });
        for (const kind of ["things", "number"] as const) {
          const spot = hollowSpot(side, kind, rtl);
          const xs = layout.items.filter((i) => i.hollow && i.kind === (kind === "things" ? "box" : "coin")).map((i) => tray.x + AKR_TRAY.pad + i.x);
          expect(Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - spot.x), `${rtl} ${side} ${kind}`).toBeLessThan(1);
        }
      }
    }
  });
  it("puts the first side on the left tray, and on the right tray on a page read right to left, as the page's picture does", () => {
    expect([trayOf("left", false), trayOf("right", false)]).toEqual([0, 1]);
    expect([trayOf("left", true), trayOf("right", true)]).toEqual([1, 0]);
    const ltr = akrThings(false).find((t) => t.id === "restore-left-number")!;
    const rtl = akrThings(true).find((t) => t.id === "restore-left-number")!;
    expect(ltr.name).toBe("akr_thing_less_number_left");
    expect(rtl.name).toBe("akr_thing_less_number_right");
    expect(rtl.x).toBeGreaterThan(ltr.x);
    expect(akrThings(true).map((t) => t.id)).toEqual(akrThings(false).map((t) => t.id));
  });
  it("shows a hollow group only while something of its kind is taken away on its side", () => {
    const s = ready("challenge").algebra;
    expect(hollowThere(s, "left", "number")).toBe(true);
    expect(hollowThere(s, "right", "things")).toBe(true);
    expect(hollowThere(s, "left", "things")).toBe(false);
    expect(hollowThere(s, "right", "number")).toBe(false);
  });
});

describe("al-Khwarizmi's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("akr_"));
  // They were the last twenty of every table until al-Kindi's room (27 November 2026) appended its own after them; they
  // are still one block, in the same order, in every table, and only that room's keys come after them.
  it("are twenty, one block in every table, in the same order, with only al-Kindi's room's keys after them", () => {
    expect(keys).toHaveLength(20);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("kdr_")), l).toBe(true);
    }
  });
  it("say that the room, the trays, the weights, the scoop and the box are invented, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.akr_note_room).toBe("الغرفة والصينيتان على الطاولة والأثقال والمغرفة والصندوق المقفل من خيال اللعب، وليست صورة لمكان عمل الخوارزمي.");
    expect(tables.en!.akr_note_room).toBe("The room, the two trays on the table, the weights, the scoop and the locked box are invented for play; they are not a picture of where al-Khwarizmi worked.");
  });
  it("carry no parenthesis, no digit and no honorific, and the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("name every thing in the room, in either reading direction", () => {
    for (const rtl of [false, true]) for (const t of akrThings(rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the room's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["tsr_tusi_bye", "jr_jazari_bye"]) expect(tables[l]!.akr_khwarizmi_bye, l).not.toBe(tables[l]![other]);
  });
});

describe("al-Khwarizmi's room: nearness and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the room that can be touched, flown to, is in reach where the bird lands, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    // Every hollow group at once, as no problem shows: the test is the harder for it.
    const things = akrThings(rtl);
    const s = ready(style);
    for (const t of things) {
      const at = landing(t, AKR_ROOM, AKR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
    }
    expect(s.talk).toBeNull();
  });
  it("the box with the feather under it needs flight: it is out of reach from the floor and from the long table", () => {
    const box = akrThings(false).find((t) => t.id === "box")!;
    expect(near(box, { x: box.x, y: AKR_WORLD.floor })).toBe(false);
    const table = AKR_ROOM.perches.find((p) => p.y === 470)!;
    for (let x = table.x; x <= table.x + table.w; x += 10) expect(near(box, { x, y: table.y }), String(x)).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, JR_DOOR, TSR_DOOR]) expect(AKR_DOOR).toEqual(d);
    for (const w of [WORLD, JR_WORLD, TSR_WORLD]) expect({ h: AKR_WORLD.height, floor: AKR_WORLD.floor, view: AKR_WORLD.view, w: AKR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, JR_ROOM, TSR_ROOM]) expect(AKR_ROOM.bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, AKR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, AKR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(AKR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(AKR_ROOM.bounds.x + AKR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: opening the box never takes the bird through it by itself", () => {
    for (const rtl of [false, true]) for (const t of akrThings(rtl) as AkrThing[]) expect(near(AKR_DOOR, landing(t, AKR_ROOM, AKR_APPROACH[t.kind])), t.id).toBe(false);
  });
});
