// Ibn Battuta's inn (sim/battutaroom.ts, content/battuta-room.ts, ui/battuta.ts, art/battuta.ts, scenes/battuta.ts): the
// road threaded by flying. A bead touched gives exactly the command the page's button for that bead gives (`go` that
// stop), and the scroll on the lectern exactly the page's "Show the stage again" (`peek`); a question, an answer or the
// feather a `flag`; so the thread, the slips, the sentence, the goals and the three ways of playing are the page quest's.
// The place kept is the quest's own snapshot. The inn draws no text, the ring is not a map (the beads sit in the ring's
// order, never the road's), every bead can be reached by flight and none from the floor, and the inn's things and door
// pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ROUTE_RECORDS, routeStage } from "../content/route";
import { BEAD_REACH, IBR_APPROACH, IBR_BALES, IBR_DOOR, IBR_LECTERN, IBR_LEDGE, IBR_RING, IBR_SCRIPTS, IBR_START, IBR_WORLD, beadAt, ibrRoom, ibrThings, pegOf } from "../content/battuta-room";
import { KRR_DOOR, KRR_WORLD, krrRoom } from "../content/karima-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { faults } from "../narrative/dialogue";
import { ROUTE_SLACK, applyRoute, newRoute, restoreRoute, routeGoals, snapshotRoute, threaded, type RouteCommand, type RouteStyle } from "../sim/route";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover, type Room } from "../sim/move";
import { afterDone, applyBattutaRoom, battutaGoals, commandOf, keptAfter, newBattutaRoom, restoreBattuta, snapshotBattuta, type BattutaCommand, type BattutaState } from "../sim/battutaroom";

const STYLES: RouteStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** An inn past its opening words. */
const ready = (style: RouteStyle): BattutaState => applyBattutaRoom(newBattutaRoom(style), { type: "skip" }).state;
const touch = (s: BattutaState, id: string) => applyBattutaRoom(s, { type: "touch", id });
const playAll = (s: BattutaState, cs: BattutaCommand[]) => cs.reduce((x, c) => applyBattutaRoom(x, c).state, s);
const bead = (stop: string) => `bead-${stop}`;
/** The road threaded by touch, one stop after another. */
const threadBy = (s: BattutaState, stops: string[]) => playAll(s, stops.map((stop) => ({ type: "touch", id: bead(stop) })));

describe("Ibn Battuta's inn: a bead or the scroll touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every bead touched from the start, from a road part way, and after a slip, gives the page's press on that bead's button: the same state and the same one command", (style) => {
    const s0 = ready(style);
    const road = s0.route.stage.road;
    const mid = threadBy(s0, road.slice(0, 2));
    const wrongStop = s0.route.stage.stops.find((id) => id !== road[2])!;
    const slipped = touch(mid, bead(wrongStop)).state;
    expect(mid.route.at).toBe(2);
    expect(slipped.route.slips).toBe(1);
    for (const start of [s0, mid, slipped]) {
      for (const stop of start.route.stage.stops) {
        const r = touch(start, bead(stop));
        const want: RouteCommand = { type: "go", stop };
        expect(r.state.route, stop).toEqual(applyRoute(start.route, want));
        expect(r.commands, stop).toEqual([want]);
        expect(commandOf(start, bead(stop))).toEqual(want);
        expect(r.happened, stop).toEqual(r.state.route.last!.right ? [{ type: "step", stop }] : [{ type: "slip", stop, reset: style === "challenge" }]);
      }
    }
  });
  it.each(STYLES)("in %s, the scroll on the lectern is the page's 'Show the stage again': it shows a hidden sentence (a slip in Challenge, free otherwise), and does nothing while the sentence is showing", (style) => {
    const s0 = ready(style);
    expect(commandOf(s0, "scroll")).toEqual({ type: "peek" });
    // Showing at the start: the page's button cannot be pressed, and nothing changes.
    const first = touch(s0, "scroll");
    expect(first.state).toBe(s0);
    expect(first.commands).toEqual([]);
    expect(first.happened).toEqual([{ type: "read" }]);
    const after = threadBy(s0, [s0.route.stage.road[0]!]);
    expect(after.route.showing).toBe(style === "story");
    const r = touch(after, "scroll");
    expect(r.state.route).toEqual(applyRoute(after.route, { type: "peek" }));
    expect(r.state.route.showing).toBe(true);
    if (style === "story") expect(r.happened).toEqual([{ type: "read" }]);
    else {
      expect(r.commands).toEqual([{ type: "peek" }]);
      expect(r.state.route.slips).toBe(style === "challenge" ? 1 : 0);
      expect(r.happened).toEqual([{ type: "peek", slip: style === "challenge" }]);
    }
  });
  it("in Challenge a wrong bead sends the thread back to the first stop, exactly as on the page, and Baghdad is threaded twice", () => {
    const s = ready("challenge");
    const road = s.route.stage.road;
    expect(road.filter((x) => x === "baghdad")).toHaveLength(2);
    const part = threadBy(s, road.slice(0, 4));
    const wrong = touch(part, bead("tabriz")); // Jibal is next
    expect(wrong.state.route.at).toBe(0);
    expect(wrong.state.route.slips).toBe(1);
    expect(wrong.happened).toEqual([{ type: "slip", stop: "tabriz", reset: true }]);
    expect(wrong.state.route).toEqual(applyRoute(part.route, { type: "go", stop: "tabriz" }));
    const done = threadBy(wrong.state, road);
    expect(done.route.done).toBe(true);
    expect(threaded(done.route)).toEqual(road);
  });
  it.each(STYLES)("in %s, the road threaded by touch finishes the stage: the goals are the page's, Hudhud says the page's last line, and nothing more is touched", (style) => {
    const s = ready(style);
    const done = threadBy(s, s.route.stage.road);
    expect(done.route.done).toBe(true);
    let page = newRoute(style, routeStage(style));
    for (const stop of page.stage.road) page = applyRoute(page, { type: "go", stop });
    expect(done.route).toEqual(page);
    expect(battutaGoals(done)).toEqual(routeGoals(page, ROUTE_SLACK[style]));
    const after = afterDone(done);
    expect(after.talk?.script).toBe("done");
    expect(IBR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("ib_done_1");
    const quiet = applyBattutaRoom(after, { type: "skip" }).state;
    for (const t of ibrThings(style, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
  it("gives a command for a bead and the scroll only, and none for Ibn Battuta, the child or the saddlebag", () => {
    for (const style of STYLES) {
      const s = ready(style);
      for (const t of ibrThings(style, false)) if (t.kind !== "bead" && t.kind !== "scroll") expect(commandOf(s, t.id), t.id).toBeNull();
      expect(ibrThings(style, false).map((t) => t.kind).filter((k) => k !== "bead")).toEqual(["ibn", "child", "saddlebag", "scroll"]);
    }
  });
});

describe("Ibn Battuta's inn: the place kept", () => {
  it("survives a snapshot: the page's own snapshot, taken up by the page as it is, and the page's taken up by the inn", () => {
    const s = ready("explorer");
    const mid = playAll(s, [{ type: "touch", id: bead("red-sea") }, { type: "touch", id: bead("oman") }, { type: "touch", id: "saddlebag" }, { type: "skip" }]);
    const snap = JSON.parse(JSON.stringify(snapshotBattuta(mid)));
    expect(snap).toEqual(snapshotRoute(mid.route));
    const back = restoreBattuta(snap)!;
    expect(back.route.at).toBe(1);
    expect(back.route.slips).toBe(1);
    expect(back.route.flags).toEqual(["feather"]);
    expect(back.route.showing).toBe(false);
    expect(back.talk).toBeNull();
    expect(restoreRoute(snap, routeStage)?.at).toBe(1);
    expect(restoreBattuta(null)).toBeNull();
    expect(restoreBattuta({ ...snap, slips: -1 })).toBeNull();
  });
  it("is kept by the page's rule: a step, a slip or a flag keeps the road; a talk keeps nothing new; the road finished is left to the host", () => {
    const s = ready("challenge");
    const step = (x: BattutaState, c: BattutaCommand) => {
      const r = applyBattutaRoom(x, c);
      return { r, kept: keptAfter(x, r.state) };
    };
    const first = step(s, { type: "touch", id: bead("mecca") });
    expect(first.kept).toEqual(snapshotRoute(first.r.state.route));
    expect(step(s, { type: "touch", id: "ibn" }).kept).toBeUndefined();
    expect(step(s, { type: "touch", id: "scroll" }).kept).toBeUndefined();
    expect(step(s, { type: "touch", id: "saddlebag" }).kept).toMatchObject({ flags: ["feather"] });
    const road = s.route.stage.road;
    const nearly = threadBy(s, road.slice(0, -1));
    expect(step(nearly, { type: "touch", id: bead(road[road.length - 1]!) }).kept).toBeUndefined();
  });
});

describe("Ibn Battuta's inn: talk is the page quest's questions and answers", () => {
  it("asking Ibn Battuta when he set out and who wrote his journey down sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the inn's own", () => {
    const s = touch(ready("explorer"), "ibn").state;
    expect(s.talk?.script).toBe("ibn");
    let r = applyBattutaRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedLeft" }]);
    expect(IBR_SCRIPTS.ibn!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ib_left_1", mood: "think" });
    r = applyBattutaRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedWritten" }]);
    expect(IBR_SCRIPTS.ibn!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ib_written_1", mood: "think" });
    expect(battutaGoals(r.state).curiosity).toBe(true);
    r = applyBattutaRoom(r.state, { type: "choose", index: 1 });
    expect(IBR_SCRIPTS.ibn!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("ibr_ibn_bye");
  });
  it("the child answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 0 }]);
    expect(kind.route.flags).toEqual(["kind", "answered"]);
    expect(battutaGoals(kind).kindness).toBe(true);
    expect(touch(applyBattutaRoom(kind, { type: "skip" }).state, "child").state.talk?.script).toBe("childKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 1 }]);
    expect(blunt.route.flags).toEqual(["answered"]);
    expect(battutaGoals(blunt).kindness).toBe(false);
    expect(touch(applyBattutaRoom(blunt, { type: "skip" }).state, "child").state.talk?.script).toBe("childBlunt");
    expect(IBR_SCRIPTS.child!.nodes["1"]!.lines[0]!.key).toBe("ib_child_1");
  });
  it("in the saddlebag is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "saddlebag");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(IBR_SCRIPTS.saddlebag!.nodes["1"]!.lines[0]!.key).toBe("ib_feather_1");
    const again = touch(applyBattutaRoom(r.state, { type: "skip" }).state, "saddlebag");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("saddlebagAgain");
    expect(IBR_SCRIPTS.saddlebagAgain!.nodes["1"]!.lines[0]!.key).toBe("ib_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the inn is touched", () => {
    const s = newBattutaRoom("challenge");
    expect(IBR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "ib_intro_1"], ["ibn", "ib_intro_2"]]);
    for (const id of [bead("mecca"), "scroll", "saddlebag", "child"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(IBR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the road's quest's", () => {
    const keys = new Set(Object.values(IBR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("ib_"));
    expect(own.sort()).toEqual(["ibr_ibn_bye", "ibr_ibn_hello", "ibr_thanks"]);
  });
});

describe("Ibn Battuta's inn: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("ibr_"));
  it("are twelve, at the end of every table, in the same order", () => {
    expect(keys).toHaveLength(12);
    for (const l of LANGS) expect(Object.keys(tables[l]!).slice(-keys.length), l).toEqual(keys);
  });
  it("say that the inn, the great ring, the beads on it and the scroll are invented for play and that the ring is not a map, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.ibr_note_room).toBe("الخان والحلقة الكبيرة والخرز عليها واللفافة من خيال اللعب، والحلقة ليست خريطة.");
    expect(tables.en!.ibr_note_room).toBe("The inn, the great ring, the beads on it and the scroll are invented for play, and the ring is not a map.");
  });
  it("carry no parenthesis, no digit and no honorific, and have the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|رضی اللہ/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("name no place, no sea and no direction: the road's places are only in the quest's own lines, and its sea only as 'the Gulf' there", () => {
    const PLACES = /\b(tangier|mecca|damascus|egypt|syria|yemen|aden|zayla|mogadishu|oman|baghdad|persian|arabian|gulf|north|south|east|west)\b/i;
    for (const k of keys) expect(PLACES.test(tables.en![k]!), `en ${k}: ${tables.en![k]}`).toBe(false);
    expect(tables.en!.ib_stop_persian_gulf).toBe("the Gulf");
  });
  it("name every thing in the inn that is not a bead; a bead is named by the page's own words for it", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of ibrThings(style, rtl)) expect(t.kind === "bead" ? t.name === "ib_bead" : keys.includes(t.name), t.id).toBe(true);
  });
  it("give a goodbye of the inn's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["krr_karima_bye", "rzr_razi_bye", "isr_idrisi_bye", "kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye", "d_scholar_bye"]) expect(tables[l]!.ibr_ibn_bye, l).not.toBe(tables[l]![other]);
  });
  it("are every one used by the inn's page or its things", () => {
    const ui = source("ui/battuta.ts") + source("content/battuta-room.ts");
    for (const k of keys) expect(ui, k).toContain(`"${k}"`);
  });
});

/** A canvas context that counts every call made on it. */
function counter(): { ctx: CanvasRenderingContext2D; calls: Map<string, number> } {
  const calls = new Map<string, number>();
  const ctx = new Proxy({} as Record<string | symbol, unknown>, {
    get(o, k) {
      if (k in o) return o[k];
      return (..._a: unknown[]) => {
        calls.set(String(k), (calls.get(String(k)) ?? 0) + 1);
        if (String(k).startsWith("create")) return { addColorStop: () => undefined };
        return undefined;
      };
    },
    set(o, k, v) {
      o[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

describe("Ibn Battuta's inn: no letters, no map, and the page's own signs", () => {
  it("its painting, the page's sign drawing it uses, and its scene never write text", () => {
    for (const f of ["art/battuta.ts", "art/route.ts", "art/kit.ts", "scenes/battuta.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(|font\s*=/);
  });
  it("painting every picture of the inn calls neither fillText nor strokeText", async () => {
    const { ctx, calls } = counter();
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
    try {
      const art = await import("../art/battuta");
      const cast = await import("../art/cast");
      art.battutaRoom(1);
      for (const n of [7, 8, 9]) art.standArt(1, n);
      for (let i = 0; i < 9; i++) for (const on of [true, false]) art.beadArt(1, i, on);
      for (let k = 1; k <= 9; k++) art.dotsArt(1, k);
      art.lastArt(1);
      art.wrongArt(1);
      art.focusArt(1);
      art.threadArt(1);
      art.lecternArt(1);
      art.camelArt(1);
      art.saddlebagArt(1);
      art.lanternArt(1);
      cast.battuta(1);
      cast.camelChild(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it("draws no map: no compass, coast, latitude, longitude, scale or place in its art, scene, content or page code (comments aside); the only prop is the feather", () => {
    const code = (f: string) => source(f).split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*\*)/.test(l)).join("\n");
    for (const f of ["art/battuta.ts", "scenes/battuta.ts", "content/battuta-room.ts", "ui/battuta.ts", "sim/battutaroom.ts"]) expect(code(f), f).not.toMatch(/compass|coast|latitude|longitude|north arrow|drawMap|inscri|calligraph|letter/i);
    expect(source("art/battuta.ts")).not.toMatch(/from "\.\/props"/);
    expect([...source("scenes/battuta.ts").matchAll(/props\.(\w+)/g)].map((m) => m[1])).toEqual(["feather"]);
  });
  it("draws every bead's sign by the page quest's own code (shared, not a copy)", () => {
    const art = source("art/battuta.ts");
    expect(art).toMatch(/import \{ traceSign \} from "\.\/route";/);
    expect(art).toContain("traceSign(c, i);");
    const page = source("art/route.ts");
    expect(page).toContain("export function traceSign(c: Ctx, i: number): void {");
    expect(page).toContain("traceSign(c, i);");
  });
});

describe("Ibn Battuta's inn: the ring is not a map", () => {
  it.each(STYLES)("in %s every bead sits on the ring, the same distance from its middle and from its neighbours, in the ring's order; mirrored on a page read right to left, with the same ids", (style) => {
    const stops = routeStage(style).stops;
    const n = stops.length;
    for (const rtl of [false, true]) {
      const beads = ibrThings(style, rtl).filter((t) => t.kind === "bead");
      expect(beads.map((t) => t.stop)).toEqual(stops);
      for (const t of beads) expect(Math.hypot(t.x - IBR_RING.cx, t.y - IBR_RING.cy)).toBeCloseTo(IBR_RING.r, 6);
      const gaps = beads.map((t, i) => Math.hypot(t.x - beads[(i + 1) % n]!.x, t.y - beads[(i + 1) % n]!.y));
      for (const g of gaps) expect(g).toBeCloseTo(gaps[0]!, 6);
    }
    const ltr = ibrThings(style, false).filter((t) => t.kind === "bead");
    const rtl = ibrThings(style, true).filter((t) => t.kind === "bead");
    ltr.forEach((t, i) => {
      expect(rtl[i]!.x).toBeCloseTo(2 * IBR_RING.cx - t.x, 6);
      expect(rtl[i]!.y).toBeCloseTo(t.y, 6);
      expect(rtl[i]!.id).toBe(t.id);
    });
  });
  it.each(STYLES)("in %s the beads are never in the road's order where they hang: no stop is at the road's place on the ring, and no two stops next to each other on the road hang next to each other", (style) => {
    const { stops, road } = routeStage(style);
    const n = stops.length;
    const things = ibrThings(style, false).filter((t) => t.kind === "bead");
    const at = (stop: string) => things.find((t) => t.stop === stop)!;
    const step = Math.hypot(beadAt(n, 0, false).x - beadAt(n, 1, false).x, beadAt(n, 0, false).y - beadAt(n, 1, false).y);
    // Where the road's k-th stop would hang if the ring were the road: it never does.
    road.forEach((stop, k) => {
      if (k >= n) return;
      const there = beadAt(n, k, false);
      expect(Math.hypot(at(stop).x - there.x, at(stop).y - there.y), `${style} ${stop} at ${k}`).toBeGreaterThan(1);
    });
    for (let k = 0; k + 1 < road.length; k++) {
      if (road[k] === road[k + 1]) continue;
      const a = at(road[k]!);
      const b = at(road[k + 1]!);
      expect(Math.hypot(a.x - b.x, a.y - b.y), `${style} ${road[k]} to ${road[k + 1]}`).toBeGreaterThan(step + 1);
    }
  });
});

/** How high the bird can climb from standing, by hopping and then flapping at every top of its rise, in the way of playing that gives no extra flaps. */
function climb(): number {
  const room: Room = { bounds: { x: 0, y: -2000, w: 400, h: 3000 }, floor: 624, perches: [] };
  let m = newMover(200, room.floor);
  let carry = 0;
  let top = room.floor;
  let wasRising = false;
  for (let i = 0; i < 600; i++) {
    // Press on the first frame, and again just as the bird stops rising.
    const rising = m.vy < 0;
    const press = i === 0 || (wasRising && !rising);
    const r = advance(m, room, { dir: 0, jump: press, down: false }, 1 / 60, carry);
    wasRising = rising;
    m = r.mover;
    carry = r.carry;
    top = Math.min(top, m.y);
  }
  return room.floor - top;
}

describe("Ibn Battuta's inn: every bead is reached by flight", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the inn, flown to, is in reach where the bird lands, and is the nearest thing there; a bead from its own peg, in %s (right to left: %s)", (style, rtl) => {
    const things = ibrThings(style, rtl);
    const room = ibrRoom(routeStage(style).stops.length, rtl);
    for (const t of things) {
      const at = landing(t, room, IBR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
      if (t.kind === "bead") {
        expect(at.y, t.id).toBe(t.y + IBR_RING.peg);
        expect(room.perches.some((p) => p.y === at.y && at.x >= p.x && at.x <= p.x + p.w), t.id).toBe(true);
      }
    }
  });
  it.each(STYLES)("in %s the nearness for a bead is generous: anywhere on its peg the bead is in reach and the nearest bead, and no two beads' reaches meet", (style) => {
    const n = routeStage(style).stops.length;
    const beads = ibrThings(style, false).filter((t) => t.kind === "bead");
    for (const b of beads) {
      const peg = pegOf(b);
      for (let x = peg.x; x <= peg.x + peg.w; x += 2) {
        const nearest = [...beads].sort((p, q) => distance(p, { x, y: peg.y }) - distance(q, { x, y: peg.y }))[0]!;
        expect(nearest.id).toBe(b.id);
        expect(near(b, { x, y: peg.y }), `${b.id} ${x}`).toBe(true);
      }
    }
    const step = Math.hypot(beadAt(n, 0, false).x - beadAt(n, 1, false).x, beadAt(n, 0, false).y - beadAt(n, 1, false).y);
    expect(step).toBeGreaterThan(2 * BEAD_REACH);
  });
  it("no bead can be touched from the floor, wherever the bird stands: every bead needs flight", () => {
    for (const style of STYLES) for (const t of ibrThings(style, false).filter((k) => k.kind === "bead")) for (let x = t.x - 120; x <= t.x + 120; x += 5) expect(near(t, { x, y: IBR_WORLD.floor }), `${style} ${t.id}`).toBe(false);
  });
  it("every peg, the bales and the high ledge can be reached from the floor by flight: each is within one climb (a hop and the flaps of the way of playing with none to spare) of the floor or of another that is", () => {
    const up = climb();
    // The bird's own numbers: a hop and four flaps.
    expect(up).toBeGreaterThan(300);
    expect(up).toBeLessThan(400);
    for (const n of [7, 8, 9]) {
      const perches = ibrRoom(n).perches;
      const reached = new Set<number>();
      let from: number[] = [IBR_WORLD.floor];
      for (let round = 0; round < perches.length && from.length; round++) {
        const next: number[] = [];
        perches.forEach((p, i) => {
          if (reached.has(i)) return;
          // Climbing from a surface, the bird can rise `up` and then come down on any perch below that height.
          if (from.some((y) => y - up <= p.y - 8)) {
            reached.add(i);
            next.push(p.y);
          }
        });
        from = next;
      }
      expect(reached.size, `${n} beads`).toBe(perches.length);
    }
    // The top peg needs more than one climb from the floor: some beads are reached only by flying from peg to peg.
    expect(IBR_WORLD.floor - up).toBeGreaterThan(pegOf(beadAt(8, 0, false)).y);
  });
  it("the saddlebag with the feather in it needs flight: it is out of reach from the floor and from the top of the bales", () => {
    const bag = ibrThings("explorer", false).find((t) => t.id === "saddlebag")!;
    expect(near(bag, { x: bag.x, y: IBR_WORLD.floor })).toBe(false);
    for (let x = IBR_BALES.x; x <= IBR_BALES.x + IBR_BALES.w; x += 10) expect(near(bag, { x, y: IBR_BALES.top }), `${x}`).toBe(false);
    expect(landing(bag, ibrRoom(8), IBR_APPROACH.saddlebag).y).toBe(IBR_LEDGE.y);
  });
  it("has the stage's pegs only: one under each bead of the way of playing, with the bales and the ledge; and the scene keeps only those", () => {
    for (const style of STYLES) expect(ibrRoom(routeStage(style).stops.length).perches).toHaveLength(routeStage(style).stops.length + 2);
    expect(source("scenes/battuta.ts")).toContain("this.layout.room.perches.splice(0, this.layout.room.perches.length, ...ibrRoom(n, rtl).perches);");
  });
});

describe("Ibn Battuta's inn: the door and the people, as in the other rooms", () => {
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, KRR_DOOR]) expect(IBR_DOOR).toEqual(d);
    for (const w of [WORLD, KRR_WORLD]) expect({ h: IBR_WORLD.height, floor: IBR_WORLD.floor, view: IBR_WORLD.view, w: IBR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, krrRoom(3)]) expect(ibrRoom(8).bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    const room = ibrRoom(8);
    let m = newMover(250, room.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(IBR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: threading the road never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of ibrThings(style, rtl)) expect(near(IBR_DOOR, landing(t, ibrRoom(routeStage(style).stops.length, rtl), IBR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("puts Ibn Battuta clear of the ring's stand, the child clear of the lectern and of the door", () => {
    const ibn = drawnBox(SCHOLAR, IBR_START.ibn, IBR_WORLD.floor, "either");
    expect(ibn.right).toBeLessThan(IBR_RING.postL - 30);
    const child = drawnBox(HELPER, IBR_START.child, IBR_WORLD.floor, "either");
    expect(child.left).toBeGreaterThan(IBR_LECTERN.x + 60);
    expect(child.right).toBeLessThan(IBR_DOOR.x - 40);
  });
});

describe("Ibn Battuta's inn: in words, and where it is used", () => {
  it("says the stage's sentence or that it is hidden, every bead with its number and name and whether it is on the thread, and the page's own sentences for a step, a slip and showing the stage again", () => {
    const ui = source("ui/battuta.ts");
    expect(ui).toContain('t(on ? "ib_bead_on" : "ib_bead", { n: num(k.index! + 1), name: stopName(k.stop!) })');
    expect(ui).toContain('t("ib_stage_hidden")');
    expect(ui).toContain('stageBox.setAttribute("aria-live", "polite")');
    expect(ui).toContain('ran.setAttribute("aria-live", "polite")');
    expect(ui).not.toMatch(/\.style\./);
    for (const k of ["ib_step_ok", "ib_end_done", "ib_slip_story", "ib_slip_explorer", "ib_slip_challenge", "ib_peek_slip", "ib_threaded", "ib_slips"]) expect(ui, k).toContain(`"${k}"`);
    expect(ROUTE_RECORDS).toHaveLength(3);
  });
  it("is opened from the Atlas and the journey as Ibn Battuta's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[ROUTE_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*battutaRoom\(/);
    expect(app).toContain("fallback: () => openPage(ROUTE_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(ROUTE_QUEST, restoreBattuta)");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(ROUTE_QUEST, snap)");
    expect(app).toContain("startRoute: () => openPage(ROUTE_QUEST, null, true)");
    expect(app).toContain("startBattuta: () => openPage(ROUTE_QUEST)");
  });
});
