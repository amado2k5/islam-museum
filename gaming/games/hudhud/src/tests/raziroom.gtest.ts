// Al-Razi's study (sim/raziroom.ts, content/razi-room.ts, ui/razi.ts, art/razi.ts, scenes/razi.ts): the loose leaves
// played by flying. A leaf touched while another is lifted gives exactly the `put` the page's second press on its picture
// gives for those two places (one move, the two leaves change places), lifting and putting down give nothing (as the
// page's first press and its press again), the binding frame is the page's "Bind the notebook" and stops where the page's
// binding stops, and a question, an answer or the feather a `flag`, so that the counts, the goals and the three ways of
// playing are the page quest's. The place kept is the quest's own snapshot with the lifted leaf added. The study draws no
// text, nothing medical, and its leaves are the page's own drawing. And the study's things and door pass the same
// nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LEAVES_SLACK, leavesPuzzle } from "../content/leaves";
import { RZR_APPROACH, RZR_DESK, RZR_DOOR, RZR_FRAME, RZR_LEAF, RZR_ROOM, RZR_SCRIPTS, RZR_SHELF, RZR_WORLD, leafSize, placeAt, rzrThings } from "../content/razi-room";
import { ISR_DOOR, ISR_ROOM, ISR_WORLD } from "../content/idrisi-room";
import { KDR_DOOR, KDR_ROOM, KDR_WORLD } from "../content/kindi-room";
import { AKR_DOOR, AKR_ROOM, AKR_WORLD } from "../content/khwarizmi-room";
import { JR_DOOR, JR_ROOM, JR_WORLD } from "../content/jazari-room";
import { TSR_DOOR, TSR_ROOM, TSR_WORLD } from "../content/tusi-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { run } from "../sim/chain";
import { applyLeaves, leavesGoals, newLeaves, restoreLeaves, snapshotLeaves, type LeavesState, type LeavesStyle } from "../sim/leaves";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { afterRun, applyRaziRoom, commandOf, keptAfter, newRaziRoom, raziGoals, restoreRazi, snapshotRazi, type RaziCommand, type RaziState } from "../sim/raziroom";

const STYLES: LeavesStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A study past its opening words. */
const ready = (style: LeavesStyle): RaziState => applyRaziRoom(newRaziRoom(style), { type: "skip" }).state;
const touch = (s: RaziState, id: string) => applyRaziRoom(s, { type: "touch", id });
const playAll = (s: RaziState, cs: RaziCommand[]) => cs.reduce((x, c) => applyRaziRoom(x, c).state, s);
/** Two leaves exchanged by flight: the first touched (lifted), then the other place. */
const swap = (s: RaziState, a: number, b: number) => touch(touch(s, `place-${a}`).state, `place-${b}`);
/** The page's own second press on its picture (ui/rowpage.ts): the leaf of the place pressed put into the place chosen first. */
const pagePress = (s: LeavesState, a: number, b: number) => applyLeaves(s, { type: "put", place: a, part: s.puzzle.places[b]! });
/** The order that binds, worked out by the rules' own run over every order is too slow here; the page quest's test pins it. Read it from the parts: each takes what the one before gives. */
const answer = (s: LeavesState): string[] => {
  const out: string[] = [];
  let carrying = s.puzzle.start;
  for (let i = 0; i < s.puzzle.places.length; i++) {
    const part = s.puzzle.parts.find((p) => p.takes === carrying && !out.includes(p.id))!;
    out.push(part.id);
    carrying = part.gives;
  }
  return out;
};
/** The row put in order by exchanges made by flight: for the first wrong place, the place where its right leaf stands. */
const ordered = (style: LeavesStyle): RaziState => {
  let s = ready(style);
  const want = answer(s.leaves);
  for (let p = s.leaves.puzzle.places.findIndex((id, i) => id !== want[i]); p >= 0; p = s.leaves.puzzle.places.findIndex((id, i) => id !== want[i])) s = swap(s, p, s.leaves.puzzle.places.indexOf(want[p]!)).state;
  return s;
};

describe("al-Razi's study: a leaf touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every leaf lifted and every other place touched gives the page's put of those two places, one move, from the start and from a row part way, and none stays lifted", (style) => {
    const s0 = ready(style);
    const n = s0.leaves.puzzle.places.length;
    const mid = swap(swap(s0, 0, n - 1).state, 1, 2).state;
    for (const start of [s0, mid]) {
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          if (a === b) continue;
          const r = swap(start, a, b);
          const page = pagePress(start.leaves, a, b);
          expect(r.state.leaves, `${a} ${b}`).toEqual(page);
          expect(r.commands, `${a} ${b}`).toEqual([{ type: "put", place: a, part: start.leaves.puzzle.places[b] }]);
          expect(r.state.leaves.moves).toBe(start.leaves.moves + 1);
          expect(r.state.leaves.puzzle.places[a]).toBe(start.leaves.puzzle.places[b]);
          expect(r.state.leaves.puzzle.places[b]).toBe(start.leaves.puzzle.places[a]);
          expect(r.state.lifted).toBeNull();
          expect(r.happened).toEqual([{ type: "exchange", a, b }]);
        }
      }
    }
  });
  it.each(STYLES)("in %s, lifting a leaf and putting it down again is not a move and changes nothing of the row, as the page's first press and its press again", (style) => {
    const s = ready(style);
    for (let p = 0; p < s.leaves.puzzle.places.length; p++) {
      const up = touch(s, `place-${p}`);
      expect(up.state.lifted).toBe(p);
      expect(up.commands).toEqual([]);
      expect(up.state.leaves).toBe(s.leaves);
      expect(up.happened).toEqual([{ type: "lift", place: p }]);
      const down = touch(up.state, `place-${p}`);
      expect(down.state.lifted).toBeNull();
      expect(down.commands).toEqual([]);
      expect(down.state.leaves).toBe(s.leaves);
      expect(down.happened).toEqual([{ type: "put", place: p }]);
    }
  });
  it("gives the page's command for every touchable thing that has one, and none for a person, the bundle or a leaf only lifted or put down", () => {
    for (const style of STYLES) {
      const s = ready(style);
      const up: RaziState = { ...s, lifted: 0 };
      for (const t of rzrThings(style, false)) {
        const c = commandOf(up, t.id);
        if (t.kind === "frame") expect(c).toEqual({ type: "go" });
        else if (t.kind === "place") expect(c, t.id).toEqual(t.place === 0 ? null : { type: "put", place: 0, part: s.leaves.puzzle.places[t.place!] });
        else expect(c, t.id).toBeNull();
        if (t.kind === "place") expect(commandOf(s, t.id), t.id).toBeNull();
      }
      expect(rzrThings(style, false).map((t) => t.kind).filter((k) => k !== "place")).toEqual(["razi", "child", "bundle", "frame"]);
    }
  });
  it.each(STYLES)("in %s the binding frame is the page's Bind the notebook: a wrong row is bound as far as it holds and stops where the page's binding stops, counted as a binding and not a move; a leaf lifted is let go", (style) => {
    const s = touch(ready(style), "place-1").state;
    const r = touch(s, "frame");
    const page = applyLeaves(s.leaves, { type: "go" });
    expect(r.state.leaves).toEqual(page);
    expect(r.commands).toEqual([{ type: "go" }]);
    expect(r.happened).toEqual([{ type: "bind" }]);
    expect(r.state.leaves.runs).toBe(1);
    expect(r.state.leaves.moves).toBe(0);
    expect(r.state.leaves.done).toBe(false);
    expect(r.state.leaves.last).toEqual(run(s.leaves.puzzle));
    expect(r.state.leaves.last!.end).not.toBe("done");
    expect(r.state.lifted).toBeNull();
  });
  it.each(STYLES)("in %s the row put in order by flight is bound by the frame: the notebook is done, the goals are the page's, Hudhud says the page's last line after the binding is shown, and nothing more is touched", (style) => {
    const s = ordered(style);
    expect(s.leaves.done).toBe(false);
    expect(run(s.leaves.puzzle).end).toBe("done");
    let page = newLeaves(style, leavesPuzzle(style));
    const want = answer(page);
    want.forEach((part, place) => (page = applyLeaves(page, { type: "put", place, part })));
    expect(s.leaves.puzzle.places).toEqual(page.puzzle.places);
    const r = touch(s, "frame");
    expect(r.state.leaves.done).toBe(true);
    expect(raziGoals(r.state)).toEqual(leavesGoals(r.state.leaves, LEAVES_SLACK[style]));
    expect(raziGoals(r.state).turns).toBe(s.leaves.moves);
    const after = afterRun(r.state);
    expect(after.talk?.script).toBe("done");
    expect(RZR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("rz_done_1");
    const quiet = applyRaziRoom(after, { type: "skip" }).state;
    for (const t of rzrThings(style, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
});

describe("al-Razi's study: the lifted leaf", () => {
  it("survives a snapshot: kept with the page's own snapshot, and put back as it was", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "place-0" }, { type: "touch", id: "place-3" }, { type: "touch", id: "place-4" }]);
    expect(s.lifted).toBe(4);
    const snap = JSON.parse(JSON.stringify(snapshotRazi(s)));
    expect(snap).toEqual({ ...snapshotLeaves(s.leaves), lifted: 4 });
    const back = restoreRazi(snap)!;
    expect(back.lifted).toBe(4);
    expect(back.leaves.puzzle.places).toEqual(s.leaves.puzzle.places);
    expect(back.leaves.moves).toBe(1);
    expect(back.talk).toBeNull();
    // The page quest takes the study's place up as it is, and the study takes the page's with no leaf lifted.
    expect(restoreLeaves(snap, leavesPuzzle)?.puzzle.places).toEqual(s.leaves.puzzle.places);
    expect(restoreRazi(JSON.parse(JSON.stringify(snapshotLeaves(s.leaves))))?.lifted).toBeNull();
    // A place that is not in this way of playing's row is not put back as lifted.
    expect(restoreRazi({ ...snap, lifted: 6 })?.lifted).toBeNull();
    expect(restoreRazi({ ...snap, lifted: -1 })?.lifted).toBeNull();
    expect(restoreRazi({ ...snap, lifted: 1.5 })?.lifted).toBeNull();
    expect(restoreRazi(null)).toBeNull();
  });
  it("is kept by the page's rule with the lifted leaf added: a move, a flag or a leaf lifted keeps the study; a binding and a talk keep nothing new; a leaf put down with nothing else done clears the place; a binding that lets go of a lifted leaf keeps the study without it", () => {
    const s = ready("challenge");
    const step = (x: RaziState, id: string) => {
      const r = touch(x, id);
      return { r, kept: keptAfter(x, r.state, r.commands) };
    };
    expect(step(s, "place-2").kept).toEqual({ ...snapshotLeaves(s.leaves), lifted: 2 });
    expect(step(s, "razi").kept).toBeUndefined();
    expect(step(s, "frame").kept).toBeUndefined();
    const up = touch(s, "place-2").state;
    expect(step(up, "place-2").kept).toBeNull();
    const swapped = step(up, "place-4");
    expect(swapped.kept).toEqual({ ...snapshotLeaves(swapped.r.state.leaves), lifted: null });
    expect(step(s, "bundle").kept).toMatchObject({ flags: ["feather"], lifted: null });
    const moved = swapped.r.state;
    const liftedThenBound = step(touch(moved, "place-1").state, "frame");
    expect(liftedThenBound.kept).toEqual({ ...snapshotLeaves(moved.leaves), lifted: null });
    const done = touch(ordered("challenge"), "frame");
    expect(keptAfter(ordered("challenge"), done.state, done.commands)).toBeUndefined();
  });
});

describe("al-Razi's study: talk is the page quest's questions and answers", () => {
  it("asking al-Razi about his notebooks and about what he saw himself sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the study's own", () => {
    const s = touch(ready("explorer"), "razi").state;
    expect(s.talk?.script).toBe("razi");
    let r = applyRaziRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedNotes" }]);
    expect(RZR_SCRIPTS.razi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "rz_notes_1", mood: "think" });
    r = applyRaziRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedOwn" }]);
    expect(RZR_SCRIPTS.razi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "rz_own_1", mood: "think" });
    expect(raziGoals(r.state).curiosity).toBe(true);
    r = applyRaziRoom(r.state, { type: "choose", index: 1 });
    expect(RZR_SCRIPTS.razi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("rzr_razi_bye");
  });
  it("the child answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 0 }]);
    expect(kind.leaves.flags).toEqual(["kind", "answered"]);
    expect(raziGoals(kind).kindness).toBe(true);
    expect(touch(applyRaziRoom(kind, { type: "skip" }).state, "child").state.talk?.script).toBe("childKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 1 }]);
    expect(blunt.leaves.flags).toEqual(["answered"]);
    expect(raziGoals(blunt).kindness).toBe(false);
    expect(touch(applyRaziRoom(blunt, { type: "skip" }).state, "child").state.talk?.script).toBe("childBlunt");
  });
  it("between the leaves of the bundle is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "bundle");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(RZR_SCRIPTS.bundle!.nodes["1"]!.lines[0]!.key).toBe("rz_feather_1");
    const again = touch(applyRaziRoom(r.state, { type: "skip" }).state, "bundle");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("bundleAgain");
    expect(RZR_SCRIPTS.bundleAgain!.nodes["1"]!.lines[0]!.key).toBe("rz_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the study is touched", () => {
    const s = newRaziRoom("challenge");
    expect(RZR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "rz_intro_1"], ["razi", "rz_intro_2"]]);
    for (const id of ["place-0", "place-1", "frame", "bundle"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(RZR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the loose leaves' quest's", () => {
    const keys = new Set(Object.values(RZR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("rz_"));
    expect(own.sort()).toEqual(["rzr_razi_bye", "rzr_razi_hello", "rzr_thanks"]);
  });
});

describe("al-Razi's study: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("rzr_"));
  // They were the last sixteen of every table until Karima al-Marwaziyya's room (27 November 2026) appended its own after
  // them, and Ibn Battuta's inn its own after those; they are still one block, in the same order, in every table, and only
  // those rooms' keys come after them.
  it("are sixteen, one block in every table, in the same order, with only Karima's room's and Ibn Battuta's inn's keys after them", () => {
    expect(keys).toHaveLength(16);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("krr_") || k.startsWith("ibr_")), l).toBe(true);
    }
  });
  it("say that the room, the desk, the leaves on it and the binding frame are invented, not a picture of the hospital of Rayy or of where he worked, and that there is no medical advice, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.rzr_note_room).toBe("الغرفة والمكتب والأوراق عليه وإطار التجليد من خيال اللعب، وليست صورة لمستشفى الري ولا لمكان عمل الرازي. وليس في اللعبة أي نصيحة طبية.");
    expect(tables.en!.rzr_note_room).toBe("The room, the desk, the leaves on it and the binding frame are invented for play; they are not a picture of the hospital of Rayy or of where al-Razi worked. There is no medical advice in this game.");
  });
  it("carry no parenthesis, no digit and no honorific, and the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|الرسول/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("name every thing in the study, in every way of playing and either reading direction", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of rzrThings(style, rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the study's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["isr_idrisi_bye", "kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye", "d_scholar_bye"]) expect(tables[l]!.rzr_razi_bye, l).not.toBe(tables[l]![other]);
  });
  it("are every one used by the study's page or its things", () => {
    const ui = source("ui/razi.ts") + source("content/razi-room.ts");
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

describe("al-Razi's study: no letters, nothing medical, and the page's own leaves", () => {
  it("its painting, the leaves' drawing it uses, and its scene never write text", () => {
    for (const f of ["art/razi.ts", "art/leaves.ts", "art/kit.ts", "scenes/razi.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(/);
  });
  it("painting every picture of the study calls neither fillText nor strokeText", async () => {
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
      const art = await import("../art/razi");
      const cast = await import("../art/cast");
      art.raziStudy(1);
      for (const style of STYLES) {
        const p = leavesPuzzle(style);
        const n = p.places.length;
        for (const part of p.parts) for (const mode of ["plain", "held", "stopped"] as const) art.leafArt(1, part.id, n, mode);
        art.liftRing(1, n);
        art.leafShadow(1, n);
        for (let i = 0; i < n; i++) art.slotArt(1, n, i);
      }
      art.threadArt(1);
      art.knotArt(1);
      art.bindingFrame(1);
      art.leafBundle(1);
      cast.scholar(1, cast.RAZI_LOOK);
      cast.leafChild(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it("draws nothing medical: the study's painting takes no prop but the feather, and nothing in its art, scene or content names a bottle, jar, flask, vial, instrument, patient or bed", () => {
    expect(source("art/razi.ts")).not.toMatch(/from "\.\/props"/);
    expect([...source("scenes/razi.ts").matchAll(/props\.(\w+)/g)].map((m) => m[1])).toEqual(["feather"]);
    const code = (f: string) => source(f).split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*\*)/.test(l)).join("\n");
    for (const f of ["art/razi.ts", "scenes/razi.ts", "content/razi-room.ts", "ui/razi.ts"]) expect(code(f), f).not.toMatch(/bottle|jar|flask|vial|instrument|patient|\bbed\b|potion|remed|medic|dose|pill|herb/i);
  });
  it.each(STYLES)("every leaf of %s on the desk is drawn by the page quest's own code, call for call (shared code, not a copy)", async (style) => {
    const leaves = await import("../art/leaves");
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    try {
      const art = await import("../art/razi");
      const p = leavesPuzzle(style);
      const n = p.places.length;
      for (const part of p.parts) {
        for (const mode of ["plain", "held", "stopped"] as const) {
          const room = recorder();
          g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => room.ctx }) };
          art.leafArt(1, part.id, n, mode);
          const page = recorder();
          const r = art.leafRect(n);
          leaves.drawLeafPaper(page.ctx, r, r.x + r.w / 2, r.y + 16, mode === "held", mode === "stopped");
          leaves.drawLeafSigns(page.ctx, part.id, r.x + r.w / 2, r.y + r.h / 2, r);
          // The study's leaf is a canvas set up by the kit (its scale, joins and caps), then exactly the page's drawing.
          expect(room.calls.slice(-page.calls.length), `${part.id} ${mode}`).toEqual(page.calls);
          expect(room.calls.length - page.calls.length, `${part.id} ${mode}`).toBeLessThanOrEqual(3);
        }
      }
    } finally {
      g.document = had;
    }
    // The page's own picture draws its leaves with the same functions.
    const pageSource = source("art/leaves.ts");
    const body = pageSource.slice(pageSource.indexOf("export function drawLeaves("));
    for (const fn of ["drawLeafPaper(c, r, hx, hy", "drawChosenRing(c, r)", "drawPlaceDots(c, x, dotY, i)", "drawLeafSigns(c, id, x, cy, r)"]) expect(body, fn).toContain(fn);
    expect(source("art/razi.ts")).toMatch(/import \{ THREAD, drawChosenRing, drawLeafPaper, drawLeafSigns, drawPlaceDots \} from "\.\/leaves";/);
    expect(source("art/razi.ts")).not.toMatch(/BODY_SIGN|KIND_MARK/);
  });
});

describe("al-Razi's study: the desk and the reading direction", () => {
  it.each(STYLES)("in %s the desk has a place for every leaf, the first on the left, or on the right on a page read right to left; the ids are the same either way", (style) => {
    const n = leavesPuzzle(style).places.length;
    const ltr = rzrThings(style, false).filter((t) => t.kind === "place");
    const rtl = rzrThings(style, true).filter((t) => t.kind === "place");
    expect(ltr.map((t) => t.place)).toEqual(Array.from({ length: n }, (_, p) => p));
    expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
    expect(ltr.map((t) => t.x)).toEqual([...ltr.map((t) => t.x)].sort((a, b) => a - b));
    expect(rtl.map((t) => t.x)).toEqual([...rtl.map((t) => t.x)].sort((a, b) => b - a));
    expect(new Set([...ltr, ...rtl].map((t) => t.y)).size).toBe(1);
  });
  it.each(STYLES)("in %s every leaf stands on the desk, the leaves do not overlap, and the binding frame stands on the desk after the last of them", (style) => {
    const n = leavesPuzzle(style).places.length;
    const { w, h } = leafSize(n);
    for (const rtl of [false, true]) {
      const xs = Array.from({ length: n }, (_, p) => placeAt(p, n, rtl).x).sort((a, b) => a - b);
      for (let i = 1; i < n; i++) expect(xs[i]! - xs[i - 1]!).toBeGreaterThan(w + 20);
      expect(xs[0]! - w / 2).toBeGreaterThan(RZR_DESK.x);
      expect(xs[n - 1]! + w / 2 + 8).toBeLessThan(RZR_FRAME.x - 50);
    }
    expect(RZR_LEAF.y + h / 2).toBeLessThan(RZR_DESK.top);
    expect(RZR_FRAME.x + 50).toBeLessThan(RZR_DESK.x + RZR_DESK.w);
  });
});

describe("al-Razi's study: nearness and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the study, flown to, is in reach where the bird lands, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    const things = rzrThings(style, rtl);
    for (const t of things) {
      const at = landing(t, RZR_ROOM, RZR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
      if (t.kind === "place" || t.kind === "frame") expect(at.y, t.id).toBe(RZR_DESK.top);
    }
  });
  it("the bundle of loose leaves with the feather between them needs flight: it is out of reach from the floor and from the tall bookcase's shelves", () => {
    const bundle = rzrThings("explorer", false).find((t) => t.id === "bundle")!;
    expect(near(bundle, { x: bundle.x, y: RZR_WORLD.floor })).toBe(false);
    for (const y of RZR_SHELF.shelves) for (let x = RZR_SHELF.x; x <= RZR_SHELF.x + RZR_SHELF.w; x += 10) expect(near(bundle, { x, y }), `${x} ${y}`).toBe(false);
  });
  it("no leaf and not the frame can be touched from the floor: the bird flies up to the desk", () => {
    for (const style of STYLES) for (const t of rzrThings(style, false).filter((k) => k.kind === "place" || k.kind === "frame")) for (let x = t.x - 80; x <= t.x + 80; x += 10) expect(near(t, { x, y: RZR_WORLD.floor }), `${style} ${t.id}`).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, JR_DOOR, TSR_DOOR, AKR_DOOR, KDR_DOOR, ISR_DOOR]) expect(RZR_DOOR).toEqual(d);
    for (const w of [WORLD, JR_WORLD, TSR_WORLD, AKR_WORLD, KDR_WORLD, ISR_WORLD]) expect({ h: RZR_WORLD.height, floor: RZR_WORLD.floor, view: RZR_WORLD.view, w: RZR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, JR_ROOM, TSR_ROOM, AKR_ROOM, KDR_ROOM, ISR_ROOM]) expect(RZR_ROOM.bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, RZR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, RZR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(RZR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(RZR_ROOM.bounds.x + RZR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: putting the row in order never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of rzrThings(style, rtl)) expect(near(RZR_DOOR, landing(t, RZR_ROOM, RZR_APPROACH[t.kind])), t.id).toBe(false);
  });
});
