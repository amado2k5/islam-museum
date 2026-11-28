// The paper workshop of Samarkand (sim/samarkandroom.ts, content/samarkand-room.ts, ui/samarkand.ts,
// art/samarkand-room.ts, scenes/samarkand.ts): the paper quest played by flying, the thirteenth and last room of the
// journey. A card touched while another is lifted gives exactly the `put` the page's second press on its picture gives for
// those two places (one move, the two cards change places), lifting and putting down give nothing (as the page's first
// press and its press again), the bell is the page's "Make a sheet" and stops where the page's run stops, and a question,
// an answer or the feather a `flag`, so that the counts, the goals and the three ways of playing are the page quest's.
// The place kept is the quest's own snapshot with the lifted card added. The workshop draws no text, and its cards and the
// material are the page's own drawing. Its things and door pass the same nearness test as the other rooms', and every
// scene of the journey now has a room.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAPER_QUEST, PAPER_SLACK, PAPER_STATES, paperPuzzle } from "../content/paper";
import { PAPER_ART } from "../art/paper";
import { SMR_APPROACH, SMR_BELL, SMR_BENCH, SMR_CARD, SMR_DOOR, SMR_MATERIAL_UP, SMR_RACK, SMR_ROOM, SMR_SCRIPTS, SMR_START, SMR_WORLD, cardSize, placeAt, smrThings } from "../content/samarkand-room";
import { RZR_DOOR, RZR_ROOM, RZR_WORLD } from "../content/razi-room";
import { AHR_DOOR, AHR_WORLD } from "../content/alhambra-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { faults } from "../narrative/dialogue";
import { run } from "../sim/chain";
import { applyPaper, newPaper, paperGoals, restorePaper, snapshotPaper, type PaperState, type PaperStyle } from "../sim/paper";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { afterRun, applySamarkandRoom, commandOf, keptAfter, newSamarkandRoom, restoreSamarkand, samarkandGoals, snapshotSamarkand, type SamarkandCommand, type SamarkandState } from "../sim/samarkandroom";

const STYLES: PaperStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A workshop past its opening words. */
const ready = (style: PaperStyle): SamarkandState => applySamarkandRoom(newSamarkandRoom(style), { type: "skip" }).state;
const touch = (s: SamarkandState, id: string) => applySamarkandRoom(s, { type: "touch", id });
const playAll = (s: SamarkandState, cs: SamarkandCommand[]) => cs.reduce((x, c) => applySamarkandRoom(x, c).state, s);
/** Two cards exchanged by flight: the first touched (lifted), then the other place. */
const swap = (s: SamarkandState, a: number, b: number) => touch(touch(s, `place-${a}`).state, `place-${b}`);
/** The page's own second press on its picture (ui/rowpage.ts): the card of the place pressed put into the place chosen first. */
const pagePress = (s: PaperState, a: number, b: number) => applyPaper(s, { type: "put", place: a, part: s.puzzle.places[b]! });
/** The order that makes a sheet, read from the cards: each takes what the one before gives. */
const answer = (s: PaperState): string[] => {
  const out: string[] = [];
  let carrying = s.puzzle.start;
  for (let i = 0; i < s.puzzle.places.length; i++) {
    const part = s.puzzle.parts.find((p) => p.takes === carrying && !out.includes(p.id))!;
    out.push(part.id);
    carrying = part.gives;
  }
  return out;
};
/** The row put in order by exchanges made by flight: for the first wrong place, the place where its right card stands. */
const ordered = (style: PaperStyle): SamarkandState => {
  let s = ready(style);
  const want = answer(s.paper);
  for (let p = s.paper.puzzle.places.findIndex((id, i) => id !== want[i]); p >= 0; p = s.paper.puzzle.places.findIndex((id, i) => id !== want[i])) s = swap(s, p, s.paper.puzzle.places.indexOf(want[p]!)).state;
  return s;
};

describe("the paper workshop: a card touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every card lifted and every other place touched gives the page's put of those two places, one move, from the start and from a row part way, and none stays lifted", (style) => {
    const s0 = ready(style);
    const n = s0.paper.puzzle.places.length;
    const mid = swap(swap(s0, 0, n - 1).state, 1, 2).state;
    for (const start of [s0, mid]) {
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (a === b) continue;
          const r = swap(start, a, b);
          expect(r.state.paper, `${a} ${b}`).toEqual(pagePress(start.paper, a, b));
          expect(r.commands, `${a} ${b}`).toEqual([{ type: "put", place: a, part: start.paper.puzzle.places[b] }]);
          expect(r.state.paper.moves).toBe(start.paper.moves + 1);
          expect(r.state.paper.puzzle.places[a]).toBe(start.paper.puzzle.places[b]);
          expect(r.state.paper.puzzle.places[b]).toBe(start.paper.puzzle.places[a]);
          expect(r.state.lifted).toBeNull();
          expect(r.happened).toEqual([{ type: "exchange", a, b }]);
        }
      }
    }
  });
  it.each(STYLES)("in %s, lifting a card and putting it down again is not a move and changes nothing of the row, as the page's first press and its press again", (style) => {
    const s = ready(style);
    for (let p = 0; p < s.paper.puzzle.places.length; p++) {
      const up = touch(s, `place-${p}`);
      expect(up.state.lifted).toBe(p);
      expect(up.commands).toEqual([]);
      expect(up.state.paper).toBe(s.paper);
      expect(up.happened).toEqual([{ type: "lift", place: p }]);
      const down = touch(up.state, `place-${p}`);
      expect(down.state.lifted).toBeNull();
      expect(down.commands).toEqual([]);
      expect(down.state.paper).toBe(s.paper);
      expect(down.happened).toEqual([{ type: "put", place: p }]);
    }
  });
  it("maps every touchable card and the bell to the page's command, and gives none for a person, the spare mould or a card only lifted or put down", () => {
    for (const style of STYLES) {
      const s = ready(style);
      const up: SamarkandState = { ...s, lifted: 0 };
      for (const t of smrThings(style, false)) {
        const c = commandOf(up, t.id);
        if (t.kind === "bell") expect(c).toEqual({ type: "go" });
        else if (t.kind === "place") expect(c, t.id).toEqual(t.place === 0 ? null : { type: "put", place: 0, part: s.paper.puzzle.places[t.place!] });
        else expect(c, t.id).toBeNull();
        if (t.kind === "place") expect(commandOf(s, t.id), t.id).toBeNull();
        if (t.kind === "bell") expect(commandOf(s, t.id)).toEqual({ type: "go" });
      }
      expect(smrThings(style, false).map((t) => t.kind).filter((k) => k !== "place")).toEqual(["maker", "child", "mould", "bell"]);
    }
  });
  it.each(STYLES)("in %s the bell is the page's Make a sheet: a wrong row is worked as far as it goes and stops where the page's run stops, counted as a run and not a move; a card lifted is let go", (style) => {
    const s = touch(ready(style), "place-1").state;
    const r = touch(s, "bell");
    expect(r.state.paper).toEqual(applyPaper(s.paper, { type: "go" }));
    expect(r.commands).toEqual([{ type: "go" }]);
    expect(r.happened).toEqual([{ type: "ring" }]);
    expect(r.state.paper.runs).toBe(1);
    expect(r.state.paper.moves).toBe(0);
    expect(r.state.paper.done).toBe(false);
    expect(r.state.paper.last).toEqual(run(s.paper.puzzle));
    expect(r.state.paper.last!.end).not.toBe("done");
    expect(r.state.lifted).toBeNull();
  });
  it.each(STYLES)("in %s the row put in order by flight and the bell rung: the sheet is made, the goals are the page's, Hudhud says the page's last line after the run is shown, and nothing more is touched", (style) => {
    const s = ordered(style);
    expect(s.paper.done).toBe(false);
    expect(run(s.paper.puzzle).end).toBe("done");
    let page = newPaper(style, paperPuzzle(style));
    answer(page).forEach((part, place) => (page = applyPaper(page, { type: "put", place, part })));
    expect(s.paper.puzzle.places).toEqual(page.puzzle.places);
    const r = touch(s, "bell");
    expect(r.state.paper.done).toBe(true);
    expect(samarkandGoals(r.state)).toEqual(paperGoals(r.state.paper, PAPER_SLACK[style]));
    expect(samarkandGoals(r.state).turns).toBe(s.paper.moves);
    // The fewest moves are reached by flight, as on the page: the Ingenuity goal can be met.
    expect(s.paper.moves).toBe(s.paper.par);
    expect(samarkandGoals(r.state).ingenuity).toBe(true);
    const after = afterRun(r.state);
    expect(after.talk?.script).toBe("done");
    expect(SMR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("pp_done_1");
    const quiet = applySamarkandRoom(after, { type: "skip" }).state;
    for (const t of smrThings(style, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
});

describe("the paper workshop: the lifted card", () => {
  it("survives a snapshot: kept with the page's own snapshot, and put back as it was", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "place-0" }, { type: "touch", id: "place-2" }, { type: "touch", id: "place-4" }]);
    expect(s.lifted).toBe(4);
    const snap = JSON.parse(JSON.stringify(snapshotSamarkand(s)));
    expect(snap).toEqual({ ...snapshotPaper(s.paper), lifted: 4 });
    const back = restoreSamarkand(snap)!;
    expect(back.lifted).toBe(4);
    expect(back.paper.puzzle.places).toEqual(s.paper.puzzle.places);
    expect(back.paper.moves).toBe(1);
    expect(back.talk).toBeNull();
    // The page quest takes the workshop's place up as it is, and the workshop takes the page's with no card lifted.
    expect(restorePaper(snap, paperPuzzle)?.puzzle.places).toEqual(s.paper.puzzle.places);
    expect(restoreSamarkand(JSON.parse(JSON.stringify(snapshotPaper(s.paper))))?.lifted).toBeNull();
    // A place that is not in this way of playing's row is not put back as lifted.
    expect(restoreSamarkand({ ...snap, lifted: 7 })?.lifted).toBeNull();
    expect(restoreSamarkand({ ...snap, lifted: -1 })?.lifted).toBeNull();
    expect(restoreSamarkand({ ...snap, lifted: 1.5 })?.lifted).toBeNull();
    expect(restoreSamarkand(null)).toBeNull();
  });
  it("is kept by the page's rule with the lifted card added: a move, a flag or a card lifted keeps the workshop; a run and a talk keep nothing new; a card put down with nothing else done clears the place; a run that lets go of a lifted card keeps the workshop without it", () => {
    const s = ready("challenge");
    const step = (x: SamarkandState, id: string) => {
      const r = touch(x, id);
      return { r, kept: keptAfter(x, r.state, r.commands) };
    };
    expect(step(s, "place-2").kept).toEqual({ ...snapshotPaper(s.paper), lifted: 2 });
    expect(step(s, "maker").kept).toBeUndefined();
    expect(step(s, "bell").kept).toBeUndefined();
    const up = touch(s, "place-2").state;
    expect(step(up, "place-2").kept).toBeNull();
    const swapped = step(up, "place-4");
    expect(swapped.kept).toEqual({ ...snapshotPaper(swapped.r.state.paper), lifted: null });
    expect(step(s, "mould").kept).toMatchObject({ flags: ["feather"], lifted: null });
    const moved = swapped.r.state;
    const liftedThenRung = step(touch(moved, "place-1").state, "bell");
    expect(liftedThenRung.kept).toEqual({ ...snapshotPaper(moved.paper), lifted: null });
    const done = touch(ordered("challenge"), "bell");
    expect(keptAfter(ordered("challenge"), done.state, done.commands)).toBeUndefined();
  });
});

describe("the paper workshop: talk is the page quest's questions and answers", () => {
  it("asking the papermaker about the old report and about how paper was made sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the workshop's own", () => {
    const s = touch(ready("explorer"), "maker").state;
    expect(s.talk?.script).toBe("maker");
    let r = applySamarkandRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedStory" }]);
    expect(SMR_SCRIPTS.maker!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "pp_story_1", mood: "think" });
    r = applySamarkandRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedHow" }]);
    expect(SMR_SCRIPTS.maker!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "pp_how_1", mood: "think" });
    expect(samarkandGoals(r.state).curiosity).toBe(true);
    r = applySamarkandRoom(r.state, { type: "choose", index: 1 });
    expect(SMR_SCRIPTS.maker!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("smr_maker_bye");
  });
  it("the child answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 0 }]);
    expect(kind.paper.flags).toEqual(["kind", "answered"]);
    expect(samarkandGoals(kind).kindness).toBe(true);
    expect(touch(applySamarkandRoom(kind, { type: "skip" }).state, "child").state.talk?.script).toBe("childKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 1 }]);
    expect(blunt.paper.flags).toEqual(["answered"]);
    expect(samarkandGoals(blunt).kindness).toBe(false);
    expect(touch(applySamarkandRoom(blunt, { type: "skip" }).state, "child").state.talk?.script).toBe("childBlunt");
  });
  it("in the spare mould is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "mould");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(SMR_SCRIPTS.mould!.nodes["1"]!.lines[0]!.key).toBe("pp_feather_1");
    const again = touch(applySamarkandRoom(r.state, { type: "skip" }).state, "mould");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("mouldAgain");
    expect(SMR_SCRIPTS.mouldAgain!.nodes["1"]!.lines[0]!.key).toBe("pp_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the workshop is touched", () => {
    const s = newSamarkandRoom("challenge");
    expect(SMR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "pp_intro_1"], ["maker", "pp_intro_2"]]);
    for (const id of ["place-0", "place-1", "bell", "mould"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(SMR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the paper quest's, so it makes no historical claim of its own", () => {
    const keys = new Set(Object.values(SMR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("pp_"));
    expect(own.sort()).toEqual(["smr_maker_bye", "smr_maker_hello", "smr_thanks"]);
    // The old report and the recipe are read by the narrator from the museum's record, as on the page.
    expect(SMR_SCRIPTS.maker!.nodes.story!.lines).toEqual([{ who: "narrator", key: "pp_story_1", mood: "think" }]);
    expect(SMR_SCRIPTS.maker!.nodes.how!.lines).toEqual([{ who: "narrator", key: "pp_how_1", mood: "think" }]);
  });
});

describe("the paper workshop: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("smr_"));
  it("are sixteen, at the end of every table, in the same order", () => {
    expect(keys).toHaveLength(16);
    for (const l of LANGS) expect(Object.keys(tables[l]!).slice(-keys.length), l).toEqual(keys);
  });
  it("say that the workshop, the cards of the steps, the vat and the bell are invented and are not a picture of a paper mill in Samarkand, in the words given in Arabic and English", () => {
    expect(tables.ar!.smr_note_room).toBe("الورشة وبطاقات الخطوات والحوض والجرس من خيال اللعب، وليست صورة لمصنع ورق في سمرقند.");
    expect(tables.en!.smr_note_room).toBe("The workshop, the cards of the steps, the vat and the bell are invented for play; they are not a picture of a paper mill in Samarkand.");
  });
  it("carry no parenthesis, no digit and no honorific, and the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(v.trim(), `${l} ${k}`).not.toBe("");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|الرسول/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("name every thing in the workshop, in every way of playing and either reading direction", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of smrThings(style, rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the workshop's own, not another room's", () => {
    const others = Object.keys(tables.en!).filter((k) => /_bye$/.test(k) && k !== "smr_maker_bye");
    expect(others.length).toBeGreaterThan(5);
    for (const l of LANGS) for (const other of others) expect(tables[l]!.smr_maker_bye, `${l} ${other}`).not.toBe(tables[l]![other]);
  });
  it("are every one used by the workshop's page or its things", () => {
    const ui = source("ui/samarkand.ts") + source("content/samarkand-room.ts");
    for (const k of keys) expect(ui, k).toContain(`"${k}"`);
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
        calls.push(`${String(k)}(${a.map((x) => (typeof x === "number" ? x.toFixed(3) : Array.isArray(x) ? `[${x.join(",")}]` : typeof x)).join(",")})`);
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

describe("the paper workshop: no letters, and the page's own cards", () => {
  it("its painting, the cards' drawing it uses, and its scene never write text", () => {
    for (const f of ["art/samarkand-room.ts", "art/paper.ts", "art/kit.ts", "scenes/samarkand.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(/);
  });
  it("painting every picture of the workshop calls neither fillText nor strokeText", async () => {
    const calls = new Map<string, number>();
    const proxy = new Proxy({} as Record<string | symbol, unknown>, {
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
      const art = await import("../art/samarkand-room");
      const cast = await import("../art/cast");
      art.samarkandWorkshop(1);
      for (const style of STYLES) {
        const p = paperPuzzle(style);
        const n = p.places.length;
        for (const part of p.parts) for (const mode of ["plain", "held", "stopped"] as const) art.cardArt(1, part.id, n, mode);
        art.cardRing(1, n);
        art.cardShadow(1, n);
        for (let i = 0; i < n; i++) art.slotArt(1, n, i);
      }
      for (const st of PAPER_STATES) art.materialArt(1, st);
      art.bellArt(1);
      art.spareMould(1);
      cast.papermaker(1);
      cast.paperChild(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it.each(STYLES)("every card of %s on the bench is drawn by the page quest's own code, call for call, on its plain backing (shared code, not a copy)", async (style) => {
    const paper = await import("../art/paper");
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    try {
      const art = await import("../art/samarkand-room");
      const p = paperPuzzle(style);
      const n = p.places.length;
      for (const part of p.parts) {
        for (const mode of ["plain", "held", "stopped"] as const) {
          const room = recorder();
          g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => room.ctx }) };
          art.cardArt(1, part.id, n, mode);
          const page = recorder();
          const r = art.cardRect(n);
          paper.drawCardBox(page.ctx, r, mode === "held", mode === "stopped");
          paper.drawCardSigns(page.ctx, part.id, r.x + r.w / 2, r.y + r.h / 2, r);
          const backing = recorder();
          art.drawCardBacking(backing.ctx, r);
          // The workshop's card is a canvas set up by the kit (its scale, joins and caps), its plain backing, then exactly the page's drawing.
          expect(room.calls.slice(-page.calls.length), `${part.id} ${mode}`).toEqual(page.calls);
          expect(room.calls.slice(-page.calls.length - backing.calls.length, -page.calls.length), `${part.id} ${mode}`).toEqual(backing.calls);
          expect(room.calls.length - page.calls.length - backing.calls.length, `${part.id} ${mode}`).toBeLessThanOrEqual(3);
        }
      }
      // The material above a place is the page's own drawing too.
      for (const st of PAPER_STATES) {
        const room = recorder();
        g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => room.ctx }) };
        art.materialArt(1, st);
        const page = recorder();
        paper.drawMaterial(page.ctx, st, 45, 40);
        expect(room.calls.slice(-page.calls.length), st).toEqual(page.calls);
        expect(room.calls.length - page.calls.length, st).toBeLessThanOrEqual(3);
      }
    } finally {
      g.document = had;
    }
    // The page's own picture draws its cards with the same functions.
    const pageSource = source("art/paper.ts");
    const body = pageSource.slice(pageSource.indexOf("export function drawPaper("), pageSource.indexOf("export function drawCardBox("));
    for (const fn of ["drawCardBox(c, r, moved, v.stopped === i)", "drawCardRing(c, r)", "drawCardDots(c, x, dotY, i)", "drawCardSigns(c, id, x, cy, r)", "drawMaterial(c, v.made[i]!, x, matY)"]) expect(body, fn).toContain(fn);
    expect(source("art/samarkand-room.ts")).toMatch(/import \{ boxWidth, drawCardBox, drawCardDots, drawCardRing, drawCardSigns, drawMaterial, PAPER_ART \} from "\.\/paper";/);
    expect(source("art/samarkand-room.ts")).not.toMatch(/ICON|JOINED/);
  });
  it("draws the material at the page's own distance above a card, at the cards' size", () => {
    expect(SMR_MATERIAL_UP).toBeCloseTo((PAPER_ART.y - PAPER_ART.matY) * SMR_CARD.k, 6);
  });
});

describe("the paper workshop: the bench and the reading direction", () => {
  it.each(STYLES)("in %s the bench has a place for every card, the first on the left, or on the right on a page read right to left; the ids are the same either way", (style) => {
    const n = paperPuzzle(style).places.length;
    const ltr = smrThings(style, false).filter((t) => t.kind === "place");
    const rtl = smrThings(style, true).filter((t) => t.kind === "place");
    expect(ltr.map((t) => t.place)).toEqual(Array.from({ length: n }, (_, p) => p));
    expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
    expect(ltr.map((t) => t.x)).toEqual([...ltr.map((t) => t.x)].sort((a, b) => a - b));
    expect(rtl.map((t) => t.x)).toEqual([...rtl.map((t) => t.x)].sort((a, b) => b - a));
    expect(new Set([...ltr, ...rtl].map((t) => t.y)).size).toBe(1);
  });
  it.each(STYLES)("in %s every card stands on the bench, the cards do not overlap, the material over them stays below the ceiling, and the bell stands on the bench after the last of them", (style) => {
    const n = paperPuzzle(style).places.length;
    const { w, h } = cardSize(n);
    for (const rtl of [false, true]) {
      const xs = Array.from({ length: n }, (_, p) => placeAt(p, n, rtl).x).sort((a, b) => a - b);
      for (let i = 1; i < n; i++) expect(xs[i]! - xs[i - 1]!).toBeGreaterThan(w + 20);
      expect(xs[0]! - w / 2).toBeGreaterThan(SMR_BENCH.x);
      expect(xs[n - 1]! + w / 2 + 8).toBeLessThan(SMR_BELL.x - 50);
    }
    expect(SMR_CARD.y + h / 2).toBeLessThan(SMR_BENCH.top);
    expect(SMR_CARD.y - SMR_MATERIAL_UP - 40).toBeGreaterThan(60);
    expect(SMR_BELL.x + 50).toBeLessThan(SMR_BENCH.x + SMR_BENCH.w);
  });
});

describe("the paper workshop: reach by flight, and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every card and the bell, flown to, is in reach where the bird lands on the bench, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    const things = smrThings(style, rtl);
    for (const t of things) {
      const at = landing(t, SMR_ROOM, SMR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
      if (t.kind === "place" || t.kind === "bell") expect(at.y, t.id).toBe(SMR_BENCH.top);
    }
  });
  it("the spare mould with the feather caught in it needs flight: it is out of reach from the floor and from the tall rack's shelves", () => {
    const mould = smrThings("explorer", false).find((t) => t.id === "mould")!;
    expect(near(mould, { x: mould.x, y: SMR_WORLD.floor })).toBe(false);
    for (const y of SMR_RACK.shelves) for (let x = SMR_RACK.x; x <= SMR_RACK.x + SMR_RACK.w; x += 10) expect(near(mould, { x, y }), `${x} ${y}`).toBe(false);
    expect(landing(mould, SMR_ROOM, SMR_APPROACH.mould).y).toBe(SMR_RACK.top);
  });
  it("no card and not the bell can be touched from the floor: the bird flies up to the bench", () => {
    for (const style of STYLES) for (const t of smrThings(style, false).filter((k) => k.kind === "place" || k.kind === "bell")) for (let x = t.x - 80; x <= t.x + 80; x += 10) expect(near(t, { x, y: SMR_WORLD.floor }), `${style} ${t.id}`).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, RZR_DOOR, AHR_DOOR]) expect(SMR_DOOR).toEqual(d);
    for (const w of [WORLD, RZR_WORLD, AHR_WORLD]) expect({ h: SMR_WORLD.height, floor: SMR_WORLD.floor, view: SMR_WORLD.view, w: SMR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, RZR_ROOM]) expect(SMR_ROOM.bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, SMR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, SMR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(SMR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(SMR_ROOM.bounds.x + SMR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: making the sheet never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of smrThings(style, rtl)) expect(near(SMR_DOOR, landing(t, SMR_ROOM, SMR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("puts the papermaker before the bench and the child after it, clear of each other and of the door", () => {
    const maker = drawnBox(SCHOLAR, SMR_START.maker, SMR_WORLD.floor, "either");
    const child = drawnBox(HELPER, SMR_START.child, SMR_WORLD.floor, "either");
    expect(maker.right).toBeLessThan(SMR_BENCH.x);
    expect(child.left).toBeGreaterThan(SMR_BENCH.x + SMR_BENCH.w);
    expect(child.right).toBeLessThan(SMR_DOOR.x - 60);
  });
});

describe("the paper workshop: in words, and where it is used", () => {
  it("says the page's own sentences for a run, the page's words for every card, and the quest's notes with the workshop's own", () => {
    const room = source("ui/samarkand.ts");
    for (const k of ["pp_end_done", "pp_end_idle", "pp_needs", "pp_reached", "pp_note_1", "pp_note_2", "pp_note_3", "pp_review", "pp_rec_paper", "pp_rec_place", "pp_moves", "pp_go", "smr_note_room"]) expect(room, k).toContain(`"${k}"`);
    for (const k of ["pp_did_", "pp_part_", "pp_kind_", "pp_who_"]) expect(room, k).toContain(`\`${k}\${`);
  });
  it("offers no list of cards to choose from, so nothing in its words can give the row's answer away: each place is a button that names the card standing there now", () => {
    const room = source("ui/samarkand.ts");
    expect(room).not.toMatch(/h\("select"|"option"/);
    expect(room).toContain('t("smr_thing_place", { n: num(k.place! + 1), card: cardName(state.paper.puzzle.places[k.place!] ?? null) })');
  });
  it("is opened from the Atlas and the journey as Samarkand's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[PAPER_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*samarkandRoom\(/);
    expect(app).toContain("fallback: () => openPage(PAPER_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(PAPER_QUEST, restoreSamarkand)");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(PAPER_QUEST, snap)");
    expect(app).toContain("finish: (g) => pageFinish(PAPER_QUEST, g)");
    expect(app).toContain("startPaper: () => openPage(PAPER_QUEST, null, true)");
    expect(app).toContain("startSamarkand: () => openPage(PAPER_QUEST)");
    expect(PAPER_QUEST).toBe("w10q5-samarqand");
  });
  it("shows a run a place at a time, or at once through the one helper that keeps movement still", () => {
    const room = source("ui/samarkand.ts");
    expect(room).toContain("host.reducedMotion() ? 0 : 750");
    expect(source("scenes/samarkand.ts")).toMatch(/this\.host\.look\(\)\.reducedMotion/);
  });
});
