// The Alhambra's court (sim/alhambraroom.ts, content/alhambra-room.ts, ui/alhambraroom.ts, art/alhambra-room.ts,
// scenes/alhambra.ts): the channels of the dry fountain turned by flying. A piece touched gives exactly the `turn` the
// page's press on that piece gives (one move), a piece that looks the same turned gives nothing and is told so, the sluice
// lever is the page's "Open the sluice", and a question, an answer or the feather a `flag`, so that the counts, the goals
// and the three ways of playing are the page quest's. The place kept is the quest's own snapshot. The court draws no
// text, and each piece is the page's own drawing of its place. Every piece can be reached by flight, the mirrored court
// still joins its channels, and the court's things and door pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CHANNELS_SLACK, channelsGrid } from "../content/channels";
import { AHR_APPROACH, AHR_DOOR, AHR_GAP, AHR_LEDGE, AHR_LEVELS, AHR_LEVER, AHR_PANEL, AHR_PITCH, AHR_SCRIPTS, AHR_START, AHR_TILE, AHR_WORLD, LEDGE_HALF, REACH, ahrRoom, ahrThings, ledgeY, mirrorX, placeAt, rimSpot, rowY, spoutMouth } from "../content/alhambra-room";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { DOOR, WORLD } from "../content/workshop";
import { JZR_DOOR, JZR_WORLD, jzrRoom } from "../content/jahiz-room";
import { faults } from "../narrative/dialogue";
import { applyChannels, channelsGoals, flow, gridOf, neighbour, newChannels, opposite, period, restoreChannels, snapshotChannels, turnable, SIDES, type ChannelsState, type ChannelsStyle, type Side } from "../sim/channels";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover, type Room } from "../sim/move";
import { alhambraGoals, applyAlhambraRoom, commandOf, keptAfter, newAlhambraRoom, restoreAlhambra, runOf, snapshotAlhambra, waterShown, type AlhambraCommand, type AlhambraState } from "../sim/alhambraroom";
import { placeLook, viewOf } from "../art/alhambra-room";

const STYLES: ChannelsStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A court past its opening words. */
const ready = (style: ChannelsStyle): AlhambraState => applyAlhambraRoom(newAlhambraRoom(style), { type: "skip" }).state;
const touch = (s: AlhambraState, id: string) => applyAlhambraRoom(s, { type: "touch", id });
const playAll = (s: AlhambraState, cs: AlhambraCommand[]) => cs.reduce((x, c) => applyAlhambraRoom(x, c).state, s);
/** The touches that turn every piece of the road to the answer, worked out from the court's own state (as the browser checks do). */
const toAnswer = (c: ChannelsState): number[] => {
  const out: number[] = [];
  c.cells.forEach((cell, p) => {
    const want = c.answer.wet.get(p);
    if (want === undefined) return;
    for (let t = cell.turn; t % period(cell.kind) !== want; t = (t + 1) % 4) out.push(p);
  });
  return out;
};

describe("the Alhambra's court: a piece touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every piece touched gives the page's quarter turn of that piece, one move, from the start and from a grid part way; a piece that looks the same turned gives nothing and is told so", (style) => {
    const s0 = ready(style);
    const n = s0.channels.cells.length;
    const turnables = s0.channels.cells.map((c, p) => (turnable(c.kind) ? p : -1)).filter((p) => p >= 0);
    const mid = playAll(s0, turnables.slice(0, 3).map((p) => ({ type: "touch", id: `place-${p}` }) as const));
    for (const start of [s0, mid]) {
      for (let p = 0; p < n; p++) {
        const r = touch(start, `place-${p}`);
        if (!turnable(start.channels.cells[p]!.kind)) {
          expect(r.state, `${p}`).toBe(start);
          expect(r.commands).toEqual([]);
          expect(r.happened).toEqual([{ type: "fixed", place: p }]);
          continue;
        }
        const page = applyChannels(start.channels, { type: "turn", cell: p });
        expect(r.state.channels, `${p}`).toEqual(page);
        expect(r.commands, `${p}`).toEqual([{ type: "turn", cell: p }]);
        expect(r.state.channels.moves).toBe(start.channels.moves + 1);
        expect(r.happened[0]).toEqual({ type: "turn", place: p });
      }
    }
  });
  it("gives the page's command for every touchable thing that has one, and none for a person or the rim; the sluice lever is in Challenge only", () => {
    for (const style of STYLES) {
      const s = ready(style);
      for (const t of ahrThings(style, false)) {
        const c = commandOf(s, t.id);
        if (t.kind === "sluice") expect(c).toEqual({ type: "open" });
        else if (t.kind === "place") expect(c, t.id).toEqual(turnable(s.channels.cells[t.place!]!.kind) ? { type: "turn", cell: t.place } : null);
        else expect(c, t.id).toBeNull();
      }
      expect(ahrThings(style, false).some((t) => t.kind === "sluice"), style).toBe(style === "challenge");
      expect(ahrThings(style, true).some((t) => t.kind === "sluice"), style).toBe(style === "challenge");
    }
  });
  it.each(["story", "explorer"] as const)("in %s the turn that brings the water to every basin finishes it at once, as on the page: the goals are the page's, Hudhud says the page's last line, and nothing more is touched", (style) => {
    let s = ready(style);
    let page = newChannels(style, channelsGrid(style));
    let last = null as ReturnType<typeof touch> | null;
    for (const p of toAnswer(s.channels)) {
      if (s.channels.done) break;
      page = applyChannels(page, { type: "turn", cell: p });
      last = touch(s, `place-${p}`);
      s = last.state;
    }
    expect(s.channels).toEqual(page);
    expect(s.channels.done).toBe(true);
    expect(last!.happened.map((x) => x.type)).toEqual(["turn", "opened", "talk"]);
    expect(s.talk?.script).toBe("done");
    expect(AHR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("ah_done_1");
    expect(alhambraGoals(s)).toEqual(channelsGoals(page, CHANNELS_SLACK[style]));
    const after = applyAlhambraRoom(s, { type: "skip" }).state;
    for (const t of ahrThings(style, false)) expect(touch(after, t.id).state, t.id).toBe(after);
  });
  it("in Challenge the water is not shown until the sluice is opened; a grid that spills (the start, as the quest makes it) is refused and counted; a turn hides the water again; the answer, opened, ends it", () => {
    const s0 = ready("challenge");
    expect(waterShown(s0.channels)).toBe(false);
    // The quest's own Challenge start leaks (channels.gtest.ts): the water runs and spills.
    expect(flow(gridOf(s0.channels)).leaks.length).toBeGreaterThan(0);
    const s = s0;
    expect(s.channels.done).toBe(false);
    expect(waterShown(s.channels)).toBe(false);
    const r = touch(s, "sluice");
    expect(r.state.channels).toEqual(applyChannels(s.channels, { type: "open" }));
    expect(r.commands).toEqual([{ type: "open" }]);
    expect(r.state.channels.done).toBe(false);
    expect(r.state.channels.openings).toBe(1);
    const f0 = flow(gridOf(s.channels));
    expect(r.happened).toEqual([{ type: "open", wet: s.channels.basins.filter((b) => f0.wet[b.cell]).length, basins: 2, leaks: f0.leaks.length }]);
    expect(waterShown(r.state.channels)).toBe(true);
    // A turn hides the water again, as on the page.
    const turned = touch(r.state, `place-${toAnswer(r.state.channels)[0] ?? 1}`).state;
    expect(waterShown(turned.channels)).toBe(false);
    // The answer, then the sluice: done, with the page's goals.
    let t = r.state;
    for (const p of toAnswer(t.channels)) t = touch(t, `place-${p}`).state;
    expect(t.channels.done).toBe(false);
    const end = touch(t, "sluice");
    expect(end.state.channels.done).toBe(true);
    expect(end.happened.map((x) => x.type)).toEqual(["open", "opened", "talk"]);
    expect(alhambraGoals(end.state)).toEqual(channelsGoals(end.state.channels, CHANNELS_SLACK.challenge));
  });
});

describe("the Alhambra's court: what is kept", () => {
  it("survives a snapshot: the court keeps the page's own snapshot, and each takes up the other's", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "place-1" }, { type: "touch", id: "place-2" }, { type: "touch", id: "waterkeeper" }, { type: "choose", index: 0 }, { type: "skip" }]);
    expect(s.channels.moves).toBe(2);
    const snap = JSON.parse(JSON.stringify(snapshotAlhambra(s)));
    expect(snap).toEqual(snapshotChannels(s.channels));
    const back = restoreAlhambra(snap)!;
    expect(back.channels.cells).toEqual(s.channels.cells);
    expect(back.channels.moves).toBe(2);
    expect(back.channels.flags).toEqual(["askedWater"]);
    expect(back.talk).toBeNull();
    expect(restoreChannels(snap, channelsGrid)?.cells).toEqual(s.channels.cells);
    expect(restoreAlhambra(null)).toBeNull();
    expect(restoreAlhambra({ ...snap, turns: [1, 2] })).toBeNull();
  });
  it("is kept by the page's rule: a turn, an opening or a flag keeps the court; a talk or a piece that cannot be turned keeps nothing new; the grid done keeps nothing", () => {
    const s = ready("challenge");
    const step = (x: AlhambraState, id: string) => {
      const r = touch(x, id);
      return { r, kept: keptAfter(r.state, r.commands) };
    };
    const p = s.channels.cells.findIndex((c) => turnable(c.kind));
    const fixed = s.channels.cells.findIndex((c) => !turnable(c.kind));
    expect(step(s, `place-${p}`).kept).toEqual(snapshotChannels(touch(s, `place-${p}`).state.channels));
    expect(step(s, `place-${fixed}`).kept).toBeUndefined();
    expect(step(s, "waterkeeper").kept).toBeUndefined();
    expect(step(s, "sluice").kept).toMatchObject({ openings: 1 });
    expect(step(s, "rim").kept).toMatchObject({ flags: ["feather"] });
    let t = s;
    for (const q of toAnswer(t.channels)) t = touch(t, `place-${q}`).state;
    const done = touch(t, "sluice");
    expect(done.state.channels.done).toBe(true);
    expect(keptAfter(done.state, done.commands)).toBeUndefined();
  });
});

describe("the Alhambra's court: talk is the page quest's questions and answers", () => {
  it("asking the keeper of the water about the water and about the courts sets the quest's two flags, with the record's lines (the page's own), and a goodbye of the court's own", () => {
    const s = touch(ready("explorer"), "waterkeeper").state;
    expect(s.talk?.script).toBe("voice");
    expect(AHR_SCRIPTS.voice!.nodes.hello!.lines[0]).toEqual({ who: "voice", key: "ahr_keeper_hello", mood: "glad" });
    let r = applyAlhambraRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedWater" }]);
    expect(AHR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ah_water_1", mood: "think" });
    r = applyAlhambraRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedCourts" }]);
    expect(AHR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ah_court_1", mood: "think" });
    expect(alhambraGoals(r.state).curiosity).toBe(true);
    r = applyAlhambraRoom(r.state, { type: "choose", index: 1 });
    expect(AHR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("ahr_keeper_bye");
  });
  it("the girl answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 0 }]);
    expect(kind.channels.flags).toEqual(["kind", "answered"]);
    expect(alhambraGoals(kind).kindness).toBe(true);
    expect(touch(applyAlhambraRoom(kind, { type: "skip" }).state, "girl").state.talk?.script).toBe("kidKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 1 }]);
    expect(blunt.channels.flags).toEqual(["answered"]);
    expect(alhambraGoals(blunt).kindness).toBe(false);
    expect(touch(applyAlhambraRoom(blunt, { type: "skip" }).state, "girl").state.talk?.script).toBe("kidBlunt");
    expect(AHR_SCRIPTS.kid!.nodes["1"]!.lines[0]!.key).toBe("ah_girl_1");
  });
  it("on the rim of the dry fountain is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "rim");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(AHR_SCRIPTS.rim!.nodes["1"]!.lines[0]!.key).toBe("ah_feather_1");
    const again = touch(applyAlhambraRoom(r.state, { type: "skip" }).state, "rim");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("rimAgain");
    expect(AHR_SCRIPTS.rimAgain!.nodes["1"]!.lines[0]!.key).toBe("ah_feather_again");
  });
  it("opens with the page's own two lines (the keeper of the water says the second), and while someone speaks nothing in the court is touched", () => {
    const s = newAlhambraRoom("challenge");
    expect(AHR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "ah_intro_1"], ["voice", "ah_intro_2"]]);
    for (const id of ["place-0", "place-1", "sluice", "rim"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(AHR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the channels' quest's", () => {
    const keys = new Set(Object.values(AHR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("ah_"));
    expect(own.sort()).toEqual(["ahr_keeper_bye", "ahr_keeper_hello", "ahr_thanks"]);
  });
});

describe("the Alhambra's court: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("ahr_"));
  it("are fourteen, at the end of every table, in the same order", () => {
    expect(keys).toHaveLength(14);
    for (const l of LANGS) expect(Object.keys(tables[l]!).slice(-keys.length), l).toEqual(keys);
  });
  it("say that the court, the panel, the channels that turn, the fountain and the pool are invented and are not the plan of the Alhambra or of its waterworks, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.ahr_note_room).toBe("البهو واللوح الحجري والسواقي التي تُدار والنافورة والبركة من خيال اللعب، وليست مخطّط الحمراء ولا مخطّط مياهها.");
    expect(tables.en!.ahr_note_room).toBe("The court, the stone panel, the channels that turn, the fountain and the pool are invented for play; they are not the plan of the Alhambra, nor of its waterworks.");
  });
  it("carry no parenthesis, no digit and no honorific, and the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|رضی اللہ|رحمۃ اللہ/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("make no historical claim in the court's own lines: no court, lion, myrtle, palace, dynasty, city, aqueduct or date (the record's lines stay the quest's own)", () => {
    const NAMES = /\b(alhambra|granada|nasrid\w*|lions?|myrtles?|comares|palaces?|aqueducts?|mountains?|sultan|king|century|centuries|years?|andalus\w*)\b/i;
    for (const k of keys.filter((x) => x !== "ahr_note_room")) expect(NAMES.test(tables.en![k]!), `en ${k}: ${tables.en![k]}`).toBe(false);
  });
  it("name every thing in the court, in every way of playing and either reading direction", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of ahrThings(style, rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the court's own, not another room's", () => {
    const others = Object.keys(tables.en!).filter((k) => /_bye$/.test(k) && k !== "ahr_keeper_bye");
    expect(others.length).toBeGreaterThanOrEqual(10);
    for (const l of LANGS) for (const other of others) expect(tables[l]!.ahr_keeper_bye, `${l} ${other}`).not.toBe(tables[l]![other]);
  });
});

/** A canvas context that records every call made on it, in order. */
function recorder(): { ctx: CanvasRenderingContext2D; calls: string[] } {
  const calls: string[] = [];
  const o: Record<string | symbol, unknown> = {};
  const ctx = new Proxy(o, {
    get(t, k) {
      if (k in t) return t[k];
      return (...a: unknown[]) => {
        calls.push(`${String(k)}(${a.map((x) => (typeof x === "number" ? x.toFixed(3) : typeof x)).join(",")})`);
        if (String(k).startsWith("create")) return { addColorStop: () => undefined };
        return undefined;
      };
    },
    set(t, k, v) {
      t[k] = v;
      calls.push(`${String(k)}=${typeof v === "number" ? v.toFixed(3) : String(v)}`);
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

describe("the Alhambra's court: no letters, and the page's own pieces", () => {
  it("its painting, the channels' drawing it uses, its scene and its page never write text", () => {
    for (const f of ["art/alhambra-room.ts", "art/channels.ts", "art/kit.ts", "scenes/alhambra.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(|font\s*=/);
  });
  it("painting every picture of the court calls neither fillText nor strokeText", async () => {
    const calls = new Map<string, number>();
    const proxy: CanvasRenderingContext2D = new Proxy({} as Record<string | symbol, unknown>, {
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
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => proxy }) };
    try {
      const art = await import("../art/alhambra-room");
      const cast = await import("../art/cast");
      art.alhambraCourt(1);
      for (const style of STYLES) {
        art.spoutArt(1, style, false);
        art.spoutArt(1, style, true);
        const c = newChannels(style, channelsGrid(style));
        const f = flow(gridOf(c));
        for (let p = 0; p < c.cells.length; p++) art.paintPiece(art.pieceSheet(1), viewOf(c, Infinity, p), p, f.wet[p]!, f.leaks);
      }
      art.leverArt(1, false);
      art.leverArt(1, true);
      cast.waterkeeper(1);
      cast.sweeper(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it.each(STYLES)("every piece of %s on the panel is drawn by the page quest's own drawing of its place, call for call (shared code, not a copy), turned, wet, spilling and marked as the page draws it", async (style) => {
    const { drawPlace } = await import("../art/channels");
    const art = await import("../art/alhambra-room");
    let c = newChannels(style, channelsGrid(style));
    // Part way: a few pieces turned, so that some places are wet and some spill.
    for (const p of c.cells.map((x, i) => (turnable(x.kind) ? i : -1)).filter((i) => i >= 0).slice(0, 4)) c = applyChannels(c, { type: "turn", cell: p });
    c = { ...c, last: { type: "open", wet: 0, basins: c.basins.length, leaks: 0 } };
    const v = viewOf(c, Infinity, 1);
    const f = flow(v.grid);
    for (let p = 0; p < c.cells.length; p++) {
      const court = recorder();
      const canvas = { width: 0, height: 0, getContext: () => court.ctx };
      art.paintPiece({ canvas: canvas as unknown as HTMLCanvasElement, w: 164, h: 164 }, v, p, v.showWater && f.wet[p]!, f.leaks);
      const page = recorder();
      drawPlace(page.ctx, v, p, AHR_TILE, v.showWater && f.wet[p]!, f.leaks, art.PIECE_STROKE.cw, art.PIECE_STROKE.half);
      // The court's piece is its canvas cleared and set up (its scale, joins, caps and the margin), then exactly the page's drawing.
      expect(court.calls.slice(-page.calls.length), `place ${p}`).toEqual(page.calls);
      expect(court.calls.length - page.calls.length, `place ${p}`).toBeLessThanOrEqual(6);
    }
    expect(source("art/alhambra-room.ts")).toMatch(/import \{ CHANNEL_INK, drawPlace, grooveWidth, type ChannelsView \} from "\.\/channels";/);
    expect(source("art/channels.ts")).toContain("drawPlace(c, v, p, tile, wet, leaks, cw, half);");
    expect(art.PIECE_STROKE).toEqual({ cw: Math.max(10, Math.round(AHR_TILE * 0.2)), half: 6 });
  });
  it("paints the water where the way of playing shows it, step by step as the page lets it run, and no water in Challenge until the sluice is opened", () => {
    const e = ready("explorer").channels;
    const f = flow(gridOf(e));
    const wetPlace = f.wet.findIndex(Boolean);
    expect(wetPlace).toBeGreaterThanOrEqual(0);
    expect(JSON.parse(placeLook(e, wetPlace, Infinity, null))[2]).toBe(true);
    expect(JSON.parse(placeLook(e, wetPlace, f.reach[wetPlace]!, null))[2]).toBe(false);
    expect(JSON.parse(placeLook(e, wetPlace, f.reach[wetPlace]! + 1, null))[2]).toBe(true);
    const run = runOf(e);
    expect(run.far).toBe(f.reach.reduce((a, b) => Math.max(a, b), 0) + 1);
    expect(run.delay).toBe(Math.max(25, Math.min(70, Math.floor(700 / run.far))));
    const ch = ready("challenge").channels;
    const cf = flow(gridOf(ch));
    for (let p = 0; p < ch.cells.length; p++) expect(JSON.parse(placeLook(ch, p, Infinity, null)).slice(2, 4), `${p}`).toEqual([false, []]);
    expect(cf.wet.some(Boolean)).toBe(true);
  });
});

describe("the Alhambra's court: the panel and the reading direction", () => {
  it.each(STYLES)("in %s the panel has a place for every piece, in the grid's rows, the first column on the left, or on the right on a page read right to left; the ids are the same either way", (style) => {
    const def = channelsGrid(style);
    const ltr = ahrThings(style, false).filter((t) => t.kind === "place");
    const rtl = ahrThings(style, true).filter((t) => t.kind === "place");
    expect(ltr.map((t) => t.place)).toEqual(Array.from({ length: def.rows * def.cols }, (_, p) => p));
    expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
    for (let r = 0; r < def.rows; r++) {
      const row = (list: typeof ltr) => list.slice(r * def.cols, (r + 1) * def.cols);
      expect(new Set(row(ltr).map((t) => t.y)).size).toBe(1);
      expect(row(ltr).map((t) => t.x)).toEqual([...row(ltr).map((t) => t.x)].sort((a, b) => a - b));
      expect(row(rtl).map((t) => t.x)).toEqual([...row(rtl).map((t) => t.x)].sort((a, b) => b - a));
      expect(row(rtl).map((t) => t.x)).toEqual(row(ltr).map((t) => mirrorX(t.x, true)));
    }
  });
  it.each(STYLES)("in %s every piece lies on the panel's face, the places of a row do not overlap, and each row has its ledge just below it, under every piece and the rim", (style) => {
    const def = channelsGrid(style);
    const P = AHR_PANEL;
    const halfAt = (y: number) => P.backHalf + ((P.frontHalf - P.backHalf) * (y - P.back)) / (P.front - P.back);
    for (let p = 0; p < def.rows * def.cols; p++) {
      const at = placeAt(p, def.rows, def.cols, false);
      expect(at.y - AHR_TILE / 2).toBeGreaterThan(P.back);
      expect(at.y + AHR_TILE / 2).toBeLessThan(P.front);
      expect(Math.abs(at.x - P.cx) + AHR_TILE / 2).toBeLessThan(halfAt(at.y - AHR_TILE / 2));
      expect(ledgeY(at.y)).toBeGreaterThan(at.y + AHR_TILE / 2);
      expect(Math.abs(at.x - P.cx) + AHR_TILE / 2).toBeLessThan(LEDGE_HALF);
      if (p % def.cols > 0) expect(at.x - placeAt(p - 1, def.rows, def.cols, false).x).toBe(AHR_PITCH);
    }
    for (const rtl of [false, true]) {
      const rim = rimSpot(style, rtl);
      expect(Math.abs(rim.x - P.cx) + REACH.rim).toBeLessThan(LEDGE_HALF);
      expect(Math.abs(rim.x - P.cx)).toBeLessThan(halfAt(rim.y));
    }
    // A ledge is inside the panel's face at its height.
    for (const y of AHR_LEVELS) expect(LEDGE_HALF).toBeLessThan(halfAt(ledgeY(y)));
  });
  // The page's picture of a right to left page is its own mirror image, so that its first column is on the right and its
  // channels still meet. The court does the same: every piece is drawn mirrored (scenes/alhambra.ts setFlipX), so its east
  // opening is drawn on its left. Then for every place and every side, where its groove meets the gap (the middle of the
  // gap, as on the page) is exactly where its neighbour's groove on the facing side meets it, across a row and from row to
  // row, in both reading directions; and the spout's pipe ends at that point on the spout's side of its place.
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("in %s (right to left: %s) every channel meets its neighbour's in the middle of the gap, and the spout's pipe meets its place", (style, rtl) => {
    const def = channelsGrid(style);
    const reachOut = AHR_TILE / 2 + AHR_GAP / 2;
    const dir: Record<Side, [number, number]> = { n: [0, -1], e: [rtl ? -1 : 1, 0], s: [0, 1], w: [rtl ? 1 : -1, 0] };
    const seam = (p: number, s: Side) => {
      const at = placeAt(p, def.rows, def.cols, rtl);
      return { x: at.x + dir[s][0] * reachOut, y: at.y + dir[s][1] * reachOut };
    };
    let met = 0;
    for (let p = 0; p < def.rows * def.cols; p++) {
      for (const s of SIDES) {
        const q = neighbour(p, s, def.rows, def.cols);
        if (q === null) continue;
        expect(seam(p, s), `${p} ${s}`).toEqual(seam(q, opposite(s)));
        met++;
      }
    }
    expect(met).toBe(2 * (def.rows * (def.cols - 1) + def.cols * (def.rows - 1)));
    expect(spoutMouth(style, rtl)).toEqual(seam(def.spout.cell, def.spout.side));
    // The scene draws every piece mirrored on a right to left page, and the spout's pipe too.
    const scene = source("scenes/alhambra.ts");
    expect(scene).toContain("const img = this.put(m, key, at.x, at.y).setFlipX(rtl);");
    expect(scene).toMatch(/spoutArt\(ts, c\.style, false\)\), sx, SPOUT_BOX\.y, 0, 0\)\.setFlipX\(rtl\)/);
  });
  it("puts the spout's ledge at the end of the grid's first column: on the left, or on the right on a page read right to left", () => {
    const ltr = ahrRoom(false).perches.at(-1)!;
    const rtl = ahrRoom(true).perches.at(-1)!;
    expect(ltr).toEqual({ x: AHR_LEDGE.x, y: AHR_LEDGE.y, w: AHR_LEDGE.w, h: 12 });
    expect(rtl.x + rtl.w).toBe(mirrorX(AHR_LEDGE.x, true));
    expect(ltr.x + ltr.w).toBeLessThan(AHR_PANEL.cx - LEDGE_HALF);
    expect(rtl.x).toBeGreaterThan(AHR_PANEL.cx + LEDGE_HALF);
    for (const style of STYLES) {
      expect(spoutMouth(style, false).x).toBeLessThan(AHR_PANEL.cx);
      expect(spoutMouth(style, true).x).toBeGreaterThan(AHR_PANEL.cx);
    }
    expect(rowY(0, 5)).toBe(AHR_LEVELS[0]);
    expect(rowY(0, 3)).toBe(AHR_LEVELS[2]);
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

describe("the Alhambra's court: every piece, the rim and the lever are reached by flight", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("in %s (right to left: %s), every thing flown to is in reach where the bird lands, and is the nearest thing in reach there, as the room engine chooses; a piece, the rim and the lever are landed on a ledge", (style, rtl) => {
    const room = ahrRoom(rtl);
    const things = ahrThings(style, rtl);
    for (const t of things) {
      const at = landing(t, room, AHR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const chosen = things.filter((k) => near(k, at)).sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(chosen.id, t.id).toBe(t.id);
      if (t.kind === "place" || t.kind === "rim" || t.kind === "sluice") expect(room.perches.some((p) => p.y === at.y && at.x >= p.x && at.x <= p.x + p.w), t.id).toBe(true);
    }
  });
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("in %s (right to left: %s), the reaches of the pieces, the rim and the lever never meet", (style, rtl) => {
    const small = ahrThings(style, rtl).filter((t) => t.kind !== "waterkeeper" && t.kind !== "girl");
    for (let i = 0; i < small.length; i++) for (let j = i + 1; j < small.length; j++) expect(Math.hypot(small[i]!.x - small[j]!.x, small[i]!.y - small[j]!.y), `${small[i]!.id} ${small[j]!.id}`).toBeGreaterThanOrEqual(small[i]!.reach + small[j]!.reach - 1e-9);
  });
  it("is generous for a child: standing on a piece's ledge within 39 pixels of its middle touches it, and never the row above or below", () => {
    for (const style of STYLES) {
      for (const t of ahrThings(style, false).filter((k) => k.kind === "place")) {
        for (let dx = -39; dx <= 39; dx += 3) {
          const bird = { x: t.x + dx, y: ledgeY(t.y) };
          expect(near(t, bird), `${t.id} ${dx}`).toBe(true);
          for (const o of ahrThings(style, false).filter((k) => k.kind === "place" && k.y !== t.y)) expect(near(o, bird), `${t.id} ${dx} ${o.id}`).toBe(false);
        }
      }
    }
  });
  it("no piece, not the rim and not the lever can be touched from the floor, wherever the bird stands", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of ahrThings(style, rtl).filter((k) => k.kind !== "waterkeeper" && k.kind !== "girl")) for (let x = t.x - 120; x <= t.x + 120; x += 4) expect(near(t, { x, y: AHR_WORLD.floor }), t.id).toBe(false);
  });
  it("every ledge of the panel and the spout's ledge can be reached from the floor by flight, each within one climb of the floor or of another that is, in both reading directions", () => {
    const up = climb();
    for (const rtl of [false, true]) {
      const perches = ahrRoom(rtl).perches;
      const reached = new Set<number>();
      let from: number[] = [AHR_WORLD.floor];
      for (let round = 0; round < perches.length && from.length; round++) {
        const next: number[] = [];
        perches.forEach((p, i) => {
          if (reached.has(i)) return;
          if (from.some((y) => y - up <= p.y - 8)) {
            reached.add(i);
            next.push(p.y);
          }
        });
        from = next;
      }
      expect(reached.size, `right to left: ${rtl}`).toBe(perches.length);
    }
    // The spout's ledge needs flight: it is more than one climb above the floor.
    expect(AHR_WORLD.floor - up).toBeGreaterThan(AHR_LEDGE.y - 8);
  });
  it("the feather on the rim of the dry fountain needs at least a hop up onto the panel, and lies beside the fountain's own place", () => {
    for (const style of STYLES) {
      for (const rtl of [false, true]) {
        const def = channelsGrid(style);
        const fountain = def.basins.find((b) => b.kind === "fountain")!;
        expect(fountain.cell % def.cols, style).toBe(def.cols - 1);
        const at = placeAt(fountain.cell, def.rows, def.cols, rtl);
        const rim = rimSpot(style, rtl);
        expect(rim.y).toBe(at.y);
        expect(Math.abs(rim.x - at.x)).toBe(AHR_TILE / 2 + 40);
        expect(near({ ...rim, reach: REACH.rim }, { x: rim.x, y: AHR_WORLD.floor })).toBe(false);
      }
    }
    expect(mirrorX(AHR_LEVER.x, true)).toBe(2 * AHR_PANEL.cx - AHR_LEVER.x);
  });
});

describe("the Alhambra's court: the door and the people, as in the other rooms", () => {
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, JZR_DOOR]) expect(AHR_DOOR).toEqual(d);
    for (const w of [WORLD, JZR_WORLD]) expect({ h: AHR_WORLD.height, floor: AHR_WORLD.floor, view: AHR_WORLD.view, w: AHR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    expect(ahrRoom(false).bounds).toEqual(jzrRoom(5).bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    for (const rtl of [false, true]) {
      const room = ahrRoom(rtl);
      let m = newMover(250, room.floor);
      let carry = 0;
      let reached = false;
      for (let i = 0; i < 1200 && !reached; i++) {
        const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
        m = r.mover;
        carry = r.carry;
        reached = near(AHR_DOOR, m);
      }
      expect(reached).toBe(true);
      expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
    }
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: turning the pieces never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of ahrThings(style, rtl)) expect(near(AHR_DOOR, landing(t, ahrRoom(rtl), AHR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("puts the keeper of the water and the girl clear of the panel, of the spout's ledge and of each other", () => {
    const keeper = drawnBox(SCHOLAR, AHR_START.waterkeeper, AHR_WORLD.floor, "either");
    const girl = drawnBox(HELPER, AHR_START.girl, AHR_WORLD.floor, "either");
    expect(keeper.right).toBeLessThan(AHR_PANEL.cx - AHR_PANEL.frontHalf - 20);
    expect(girl.left).toBeGreaterThan(AHR_PANEL.cx + AHR_PANEL.frontHalf + 20);
    expect(girl.right).toBeLessThan(AHR_DOOR.x - 60);
  });
});

describe("the Alhambra's court: in words, and where it is used", () => {
  it("says the page's own sentences for a turn, a piece that cannot be turned, an opening and the end, the page's words for every piece, and the quest's notes", () => {
    const room = source("ui/alhambraroom.ts");
    for (const k of ["ah_did_turn", "ah_fixed", "ah_did_open", "ah_did_solved", "ah_progress", "ah_progress_open", "ah_grid_group", "ah_note_1", "ah_note_2", "ah_note_3", "ah_note_4", "ah_review", "ahr_note_room"]) expect(room, k).toContain(`"${k}"`);
    expect(room).toContain('import { channelsWords } from "./channels";');
    expect(room).toContain("words.label(p, f)");
    expect(room).toContain("words.table()");
  });
  it("is opened from the Atlas and the journey as the Alhambra's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[CHANNELS_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*alhambraRoom\(/);
    expect(app).toContain("fallback: () => openPage(CHANNELS_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(CHANNELS_QUEST, restoreAlhambra)");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(CHANNELS_QUEST, snap)");
    expect(app).toContain("finish: (g) => pageFinish(CHANNELS_QUEST, g)");
    expect(app).toContain("startChannels: () => openPage(CHANNELS_QUEST, null, true)");
    expect(app).toContain("startAlhambra: () => openPage(CHANNELS_QUEST)");
  });
  it("lays the court out again for the reading direction it is built for, and lets the water run through the one helper that keeps movement still", () => {
    const scene = source("scenes/alhambra.ts");
    expect(scene).toContain("this.layout.room = ahrRoom(rtl);");
    expect(scene).toMatch(/this\.host\.look\(\)\.reducedMotion/);
    expect(source("ui/alhambraroom.ts")).toContain("reducedMotion: host.reducedMotion()");
    expect(ahrRoom(false).perches.length).toBe(AHR_LEVELS.length + 1);
  });
});
