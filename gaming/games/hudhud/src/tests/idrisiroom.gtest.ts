// Al-Idrisi's hall (sim/idrisiroom.ts, content/idrisi-room.ts, ui/idrisi.ts, art/idrisi.ts): the scattered sheets played
// by flying. A sheet touched while another is lifted gives exactly the `exchange` the page's second press gives for those
// two places, lifting and putting down give nothing (as the page's first press and its press again), the lamp is the
// page's "Check the map", and a question, an answer or the feather a `flag`, so that the counts, the goals and the three
// ways of playing are the page quest's. The place kept is the quest's own snapshot with the lifted sheet added. The hall
// draws no text, and its sheets are the page's own drawing. And the hall's things and door pass the same nearness test as
// the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SHEETS_SLACK, sheetsMap } from "../content/sheets";
import { ISR_APPROACH, ISR_DOOR, ISR_LEVELS, ISR_ROOM, ISR_SCRIPTS, ISR_SHELF, ISR_TABLE, ISR_TILE, ISR_WORLD, isrThings, levelOf, placeAt, railHalf, railY } from "../content/idrisi-room";
import { KDR_DOOR, KDR_ROOM, KDR_WORLD } from "../content/kindi-room";
import { AKR_DOOR, AKR_ROOM, AKR_WORLD } from "../content/khwarizmi-room";
import { JR_DOOR, JR_ROOM, JR_WORLD } from "../content/jazari-room";
import { TSR_DOOR, TSR_ROOM, TSR_WORLD } from "../content/tusi-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { applySheets, newSheets, restoreSheets, sheetsGoals, snapshotSheets, tally, type SheetsState, type SheetsStyle } from "../sim/sheets";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { applyIdrisiRoom, commandOf, idrisiGoals, keptAfter, newIdrisiRoom, restoreIdrisi, snapshotIdrisi, type IdrisiCommand, type IdrisiState } from "../sim/idrisiroom";

const STYLES: SheetsStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A hall past its opening words. */
const ready = (style: SheetsStyle): IdrisiState => applyIdrisiRoom(newIdrisiRoom(style), { type: "skip" }).state;
const touch = (s: IdrisiState, id: string) => applyIdrisiRoom(s, { type: "touch", id });
const playAll = (s: IdrisiState, cs: IdrisiCommand[]) => cs.reduce((x, c) => applyIdrisiRoom(x, c).state, s);
/** Two sheets exchanged by flight: the first touched (lifted), then the second. */
const swap = (s: IdrisiState, a: number, b: number) => touch(touch(s, `place-${a}`).state, `place-${b}`);
/** The page quest's own way of putting a map in order (as the browser checks do): for the first wrong place, the place where its right sheet lies. */
const nextSwap = (s: SheetsState): [number, number] | null => {
  const p = s.grid.findIndex((id, i) => id !== s.solution[i]);
  return p < 0 ? null : [p, s.grid.indexOf(s.solution[p]!)];
};
const ordered = (style: SheetsStyle): IdrisiState => {
  let s = ready(style);
  for (let pair = nextSwap(s.sheets); pair && !s.sheets.done; pair = nextSwap(s.sheets)) s = swap(s, pair[0], pair[1]).state;
  return s;
};

describe("al-Idrisi's hall: a sheet touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every sheet lifted and every other touched gives the page's exchange of those two places, one move, from the start and from a map part way, and none stays lifted", (style) => {
    const s0 = ready(style);
    const n = s0.sheets.grid.length;
    const mid = swap(swap(s0, 0, n - 1).state, 1, 2).state;
    for (const start of [s0, mid]) {
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (a === b) continue;
          const r = swap(start, a, b);
          const page = applySheets(start.sheets, { type: "exchange", a, b });
          expect(r.state.sheets, `${a} ${b}`).toEqual(page);
          expect(r.commands, `${a} ${b}`).toEqual([{ type: "exchange", a, b }]);
          expect(r.state.sheets.moves).toBe(start.sheets.moves + 1);
          expect(r.state.lifted).toBeNull();
          expect(r.happened[0]).toEqual({ type: "exchange", a, b });
        }
      }
    }
  });
  it.each(STYLES)("in %s, lifting a sheet and putting it down again is not a move and changes nothing of the map, as the page's first press and its press again", (style) => {
    const s = ready(style);
    for (let p = 0; p < s.sheets.grid.length; p++) {
      const up = touch(s, `place-${p}`);
      expect(up.state.lifted).toBe(p);
      expect(up.commands).toEqual([]);
      expect(up.state.sheets).toBe(s.sheets);
      expect(up.happened).toEqual([{ type: "lift", place: p }]);
      const down = touch(up.state, `place-${p}`);
      expect(down.state.lifted).toBeNull();
      expect(down.commands).toEqual([]);
      expect(down.state.sheets).toBe(s.sheets);
      expect(down.happened).toEqual([{ type: "put", place: p }]);
    }
  });
  it("gives the page's command for every touchable thing that has one, and none for a person, the stack or a sheet lifted or put down; the lamp is in Challenge only", () => {
    for (const style of STYLES) {
      const s = ready(style);
      const up: IdrisiState = { ...s, lifted: 0 };
      for (const t of isrThings(style, false)) {
        const c = commandOf(up, t.id);
        if (t.kind === "lamp") expect(c).toEqual({ type: "check" });
        else if (t.kind === "place") expect(c, t.id).toEqual(t.place === 0 ? null : { type: "exchange", a: 0, b: t.place });
        else expect(c, t.id).toBeNull();
        if (t.kind === "place") expect(commandOf(s, t.id), t.id).toBeNull();
      }
      expect(isrThings(style, false).some((t) => t.kind === "lamp"), style).toBe(style === "challenge");
    }
  });
  it("in Challenge the lamp is the page's check: a map not in order is a failed check, counted, with how many seams match; the lifted sheet stays lifted", () => {
    const s = touch(ready("challenge"), "place-3").state;
    const r = touch(s, "lamp");
    const page = applySheets(s.sheets, { type: "check" });
    expect(r.state.sheets).toEqual(page);
    expect(r.commands).toEqual([{ type: "check" }]);
    expect(r.state.sheets.checks).toBe(1);
    expect(r.happened).toEqual([{ type: "check", ...tally(s.sheets) }]);
    expect(r.state.lifted).toBe(3);
  });
  it("in Challenge a map put in order by exchanges is not done until the lamp checks it, as on the page; then the goals are the page's and Hudhud says the page's last line", () => {
    const s = ordered("challenge");
    expect(s.sheets.done).toBe(false);
    expect(s.sheets.grid).toEqual([...s.sheets.solution]);
    const r = touch(s, "lamp");
    expect(r.state.sheets.done).toBe(true);
    expect(r.happened.map((x) => x.type)).toEqual(["check", "opened", "talk"]);
    expect(r.state.talk?.script).toBe("done");
    expect(idrisiGoals(r.state)).toEqual(sheetsGoals(r.state.sheets, SHEETS_SLACK.challenge));
  });
  it.each(["story", "explorer"] as const)("in %s the exchange that puts the map in order finishes it at once, as on the page: the goals are the page's, Hudhud says the page's last line, and nothing more is touched", (style) => {
    let s = ready(style);
    let page = newSheets(style, sheetsMap(style));
    let last = null as ReturnType<typeof swap> | null;
    for (let pair = nextSwap(s.sheets); pair; pair = nextSwap(s.sheets)) {
      page = applySheets(page, { type: "exchange", a: pair[0], b: pair[1] });
      last = swap(s, pair[0], pair[1]);
      s = last.state;
    }
    expect(s.sheets).toEqual(page);
    expect(s.sheets.done).toBe(true);
    expect(last!.happened.map((x) => x.type)).toEqual(["exchange", "opened", "talk"]);
    expect(s.talk?.script).toBe("done");
    expect(ISR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("id_done_1");
    expect(idrisiGoals(s)).toEqual(sheetsGoals(page, SHEETS_SLACK[style]));
    const after = applyIdrisiRoom(s, { type: "skip" }).state;
    for (const t of isrThings(style, false)) expect(touch(after, t.id).state, t.id).toBe(after);
  });
});

describe("al-Idrisi's hall: the lifted sheet", () => {
  it("survives a snapshot: kept with the page's own snapshot, and put back as it was", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "place-0" }, { type: "touch", id: "place-5" }, { type: "touch", id: "place-7" }]);
    expect(s.lifted).toBe(7);
    const snap = JSON.parse(JSON.stringify(snapshotIdrisi(s)));
    expect(snap).toEqual({ ...snapshotSheets(s.sheets), lifted: 7 });
    const back = restoreIdrisi(snap)!;
    expect(back.lifted).toBe(7);
    expect(back.sheets.grid).toEqual(s.sheets.grid);
    expect(back.sheets.moves).toBe(1);
    expect(back.talk).toBeNull();
    // The page quest takes the hall's place up as it is, and the hall takes the page's with no sheet lifted.
    expect(restoreSheets(snap, sheetsMap)?.grid).toEqual(s.sheets.grid);
    expect(restoreIdrisi(JSON.parse(JSON.stringify(snapshotSheets(s.sheets))))?.lifted).toBeNull();
    // A place that is not on this way of playing's map is not put back as lifted.
    expect(restoreIdrisi({ ...snap, lifted: 12 })?.lifted).toBeNull();
    expect(restoreIdrisi({ ...snap, lifted: -1 })?.lifted).toBeNull();
    expect(restoreIdrisi({ ...snap, lifted: 1.5 })?.lifted).toBeNull();
    expect(restoreIdrisi(null)).toBeNull();
  });
  it("is kept by the page's rule with the lifted sheet added: an exchange, a check, a flag or a sheet lifted keeps the hall; a talk keeps nothing new; a sheet put down with nothing else done clears the place; the map in order keeps nothing", () => {
    const s = ready("challenge");
    const step = (x: IdrisiState, id: string) => {
      const r = touch(x, id);
      return { r, kept: keptAfter(x, r.state, r.commands) };
    };
    expect(step(s, "place-2").kept).toEqual({ ...snapshotSheets(s.sheets), lifted: 2 });
    expect(step(s, "idrisi").kept).toBeUndefined();
    const up = touch(s, "place-2").state;
    expect(step(up, "place-2").kept).toBeNull();
    const swapped = step(up, "place-4");
    expect(swapped.kept).toEqual({ ...snapshotSheets(swapped.r.state.sheets), lifted: null });
    expect(step(s, "lamp").kept).toMatchObject({ checks: 1, lifted: null });
    expect(step(s, "stack").kept).toMatchObject({ flags: ["feather"] });
    const done = touch(ordered("challenge"), "lamp");
    expect(keptAfter(ordered("challenge"), done.state, done.commands)).toBeUndefined();
  });
});

describe("al-Idrisi's hall: talk is the page quest's questions and answers", () => {
  it("asking al-Idrisi about his book and about the maps sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the hall's own", () => {
    const s = touch(ready("explorer"), "idrisi").state;
    expect(s.talk?.script).toBe("idrisi");
    let r = applyIdrisiRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedBook" }]);
    expect(ISR_SCRIPTS.idrisi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "id_book_1", mood: "think" });
    r = applyIdrisiRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedMaps" }]);
    expect(ISR_SCRIPTS.idrisi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "id_maps_1", mood: "think" });
    expect(idrisiGoals(r.state).curiosity).toBe(true);
    r = applyIdrisiRoom(r.state, { type: "choose", index: 1 });
    expect(ISR_SCRIPTS.idrisi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("isr_idrisi_bye");
  });
  it("the helper answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "helper" }, { type: "choose", index: 0 }]);
    expect(kind.sheets.flags).toEqual(["kind", "answered"]);
    expect(idrisiGoals(kind).kindness).toBe(true);
    expect(touch(applyIdrisiRoom(kind, { type: "skip" }).state, "helper").state.talk?.script).toBe("helperKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "helper" }, { type: "choose", index: 1 }]);
    expect(blunt.sheets.flags).toEqual(["answered"]);
    expect(idrisiGoals(blunt).kindness).toBe(false);
    expect(touch(applyIdrisiRoom(blunt, { type: "skip" }).state, "helper").state.talk?.script).toBe("helperBlunt");
  });
  it("under the stack of loose sheets is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "stack");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(ISR_SCRIPTS.stack!.nodes["1"]!.lines[0]!.key).toBe("id_feather_1");
    const again = touch(applyIdrisiRoom(r.state, { type: "skip" }).state, "stack");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("stackAgain");
    expect(ISR_SCRIPTS.stackAgain!.nodes["1"]!.lines[0]!.key).toBe("id_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the hall is touched", () => {
    const s = newIdrisiRoom("challenge");
    expect(ISR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "id_intro_1"], ["idrisi", "id_intro_2"]]);
    for (const id of ["place-0", "place-1", "lamp", "stack"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(ISR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the scattered sheets' quest's", () => {
    const keys = new Set(Object.values(ISR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("id_"));
    expect(own.sort()).toEqual(["isr_idrisi_bye", "isr_idrisi_hello", "isr_thanks"]);
  });
});

describe("al-Idrisi's hall: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("isr_"));
  // They were the last sixteen of every table until al-Razi's study (27 November 2026) appended its own after them; they
  // are still one block, in the same order, in every table, and only that study's keys come after them.
  it("are sixteen, one block in every table, in the same order, with only al-Razi's study's keys after them", () => {
    expect(keys).toHaveLength(16);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("rzr_")), l).toBe(true);
    }
  });
  it("say that the hall, the table, the sheets on it and the lamp are invented, and that the drawing is an imagined coast, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.isr_note_room).toBe("القاعة والطاولة الكبيرة والأوراق عليها والمصباح من خيال اللعب، والرسم على الأوراق ساحل متخيَّل، وليس خريطة الإدريسي.");
    expect(tables.en!.isr_note_room).toBe("The hall, the great table, the sheets on it and the lamp are invented for play, and the drawing on the sheets is an imagined coast, not al-Idrisi's map.");
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
  it("name every thing in the hall, in every way of playing and either reading direction", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of isrThings(style, rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the hall's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye"]) expect(tables[l]!.isr_idrisi_bye, l).not.toBe(tables[l]![other]);
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

describe("al-Idrisi's hall: no letters, and the page's own sheets", () => {
  it("its painting, the sheets' drawing it uses, and its scene never write text", () => {
    for (const f of ["art/idrisi.ts", "art/sheets.ts", "art/kit.ts", "scenes/idrisi.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(/);
  });
  it("painting every picture of the hall calls neither fillText nor strokeText", async () => {
    const calls = new Map<string, number>();
    const ctx: Record<string | symbol, unknown> = {};
    const proxy: CanvasRenderingContext2D = new Proxy(ctx, {
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
      const art = await import("../art/idrisi");
      art.idrisiHall(1);
      for (const style of STYLES) for (const sh of sheetsMap(style).sheets) art.sheetArt(1, sh);
      art.sheetShadow(1);
      art.liftFrame(1);
      art.seamMark(1, true);
      art.seamMark(1, false);
      art.looseStack(1);
      art.lamp(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it.each(STYLES)("every sheet of %s on the table is drawn by the page quest's own drawing, call for call (shared code, not a copy)", async (style) => {
    const { drawSheet } = await import("../art/sheets");
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    try {
      const art = await import("../art/idrisi");
      for (const sh of sheetsMap(style).sheets) {
        const hall = recorder();
        g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => hall.ctx }) };
        art.sheetArt(1, sh);
        const page = recorder();
        drawSheet(page.ctx, sh, ISR_TILE);
        // The hall's sheet is a canvas set up by the kit (its scale, joins and caps), then exactly the page's drawing.
        expect(hall.calls.slice(-page.calls.length), `sheet ${sh.id}`).toEqual(page.calls);
        expect(hall.calls.length - page.calls.length, `sheet ${sh.id}`).toBeLessThanOrEqual(3);
      }
    } finally {
      g.document = had;
    }
    expect(source("art/idrisi.ts")).toMatch(/import \{ drawSheet \} from "\.\/sheets";/);
    expect(source("art/idrisi.ts")).not.toMatch(/decodeEdge|function feature/);
  });
});

describe("al-Idrisi's hall: the table and the reading direction", () => {
  it.each(STYLES)("in %s the table has a place for every sheet, in the map's rows, the first column on the left, or on the right on a page read right to left; the ids are the same either way", (style) => {
    const def = sheetsMap(style);
    const ltr = isrThings(style, false).filter((t) => t.kind === "place");
    const rtl = isrThings(style, true).filter((t) => t.kind === "place");
    expect(ltr.map((t) => t.place)).toEqual(Array.from({ length: def.rows * def.cols }, (_, p) => p));
    expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
    for (let r = 0; r < def.rows; r++) {
      const row = (list: typeof ltr) => list.slice(r * def.cols, (r + 1) * def.cols);
      expect(new Set(row(ltr).map((t) => t.y)).size).toBe(1);
      expect(row(ltr).map((t) => t.x)).toEqual([...row(ltr).map((t) => t.x)].sort((a, b) => a - b));
      expect(row(rtl).map((t) => t.x)).toEqual([...row(rtl).map((t) => t.x)].sort((a, b) => b - a));
    }
  });
  it.each(STYLES)("in %s every sheet lies on the table's top, the sheets of a row do not overlap, and each row has its rail just below it", (style) => {
    const def = sheetsMap(style);
    const t = ISR_TABLE;
    for (let p = 0; p < def.rows * def.cols; p++) {
      const at = placeAt(p, def.rows, def.cols, false);
      const half = (ISR_TILE * at.k) / 2;
      const f = (at.y - t.back) / (t.front - t.back);
      const edge = (t.backW + (t.frontW - t.backW) * f) / 2;
      expect(at.y - half).toBeGreaterThan(t.back);
      expect(at.y + half).toBeLessThan(t.front);
      expect(Math.abs(at.x - t.cx) + half).toBeLessThan(edge);
      const l = levelOf(Math.floor(p / def.cols), def.rows);
      expect(railY(l)).toBeGreaterThan(at.y + half);
      expect(Math.abs(at.x - t.cx) + half).toBeLessThan(railHalf(l));
      if (p % def.cols > 0) expect(at.x - placeAt(p - 1, def.rows, def.cols, false).x).toBeGreaterThan(ISR_TILE * at.k);
    }
    // The rows do not overlap either.
    for (let i = 1; i < ISR_LEVELS.length; i++) expect(ISR_LEVELS[i]!.y - (ISR_TILE * ISR_LEVELS[i]!.k) / 2).toBeGreaterThan(railY(ISR_LEVELS[i - 1]!) + 8);
  });
});

describe("al-Idrisi's hall: nearness and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the hall, flown to, is in reach where the bird lands, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    const things = isrThings(style, rtl);
    for (const t of things) {
      const at = landing(t, ISR_ROOM, ISR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
    }
  });
  it("the stack of loose sheets with the feather under it needs flight: it is out of reach from the floor and from the tall shelf's shelves", () => {
    const stack = isrThings("explorer", false).find((t) => t.id === "stack")!;
    expect(near(stack, { x: stack.x, y: ISR_WORLD.floor })).toBe(false);
    for (const y of ISR_SHELF.shelves) for (let x = ISR_SHELF.x; x <= ISR_SHELF.x + ISR_SHELF.w; x += 10) expect(near(stack, { x, y }), `${x} ${y}`).toBe(false);
  });
  it("no sheet can be touched from the floor: the bird flies up to a row's rail", () => {
    for (const style of STYLES) for (const t of isrThings(style, false).filter((k) => k.kind === "place")) for (let x = t.x - 80; x <= t.x + 80; x += 10) expect(near(t, { x, y: ISR_WORLD.floor }), `${style} ${t.id}`).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, JR_DOOR, TSR_DOOR, AKR_DOOR, KDR_DOOR]) expect(ISR_DOOR).toEqual(d);
    for (const w of [WORLD, JR_WORLD, TSR_WORLD, AKR_WORLD, KDR_WORLD]) expect({ h: ISR_WORLD.height, floor: ISR_WORLD.floor, view: ISR_WORLD.view, w: ISR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, JR_ROOM, TSR_ROOM, AKR_ROOM, KDR_ROOM]) expect(ISR_ROOM.bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, ISR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, ISR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(ISR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(ISR_ROOM.bounds.x + ISR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: putting the map in order never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of isrThings(style, rtl)) expect(near(ISR_DOOR, landing(t, ISR_ROOM, ISR_APPROACH[t.kind])), t.id).toBe(false);
  });
});
