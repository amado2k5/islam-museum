// Al-Kindi's room (sim/kindiroom.ts, content/kindi-room.ts, ui/kindi.ts, art/kindi.ts): the secret page played by
// flying. A sign carried to a mark's place gives exactly the `assign` the page's list of choices gives for that mark and
// that sign, a place touched with nothing carried the page's "not yet", the bell the page's "Read the page", and a
// question, an answer or the feather a `flag`, so that the counts, the refusals, the failed readings, the goals and the
// three ways of playing are the page quest's. The place kept is the quest's own snapshot with the beak added. The room
// draws no text. And the room's things and door pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CIPHER_SLACK, cipherPuzzle } from "../content/cipher";
import { KDR_APPROACH, KDR_BOOKS, KDR_COUNTS, KDR_DOOR, KDR_ROOM, KDR_SCRIPTS, KDR_WORLD, boardMarks, kdrThings, type KdrThing } from "../content/kindi-room";
import { AKR_DOOR, AKR_ROOM, AKR_WORLD } from "../content/khwarizmi-room";
import { JR_DOOR, JR_ROOM, JR_WORLD } from "../content/jazari-room";
import { TSR_DOOR, TSR_ROOM, TSR_WORLD } from "../content/tusi-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { applyCipher, cipherGoals, newCipher, ranked, restoreCipher, snapshotCipher, used, type CipherState, type CipherStyle } from "../sim/cipher";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { applyKindiRoom, commandOf, keptAfter, kindiGoals, newKindiRoom, restoreKindi, snapshotKindi, type KindiCommand, type KindiState } from "../sim/kindiroom";

const STYLES: CipherStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A room past its opening words. */
const ready = (style: CipherStyle): KindiState => applyKindiRoom(newKindiRoom(style), { type: "skip" }).state;
const touch = (s: KindiState, id: string) => applyKindiRoom(s, { type: "touch", id });
const playAll = (s: KindiState, cs: KindiCommand[]) => cs.reduce((x, c) => applyKindiRoom(x, c).state, s);
/** A sign carried to a mark's place: the token, then the place. */
const give = (s: KindiState, mark: string, sign: string) => touch(touch(s, `token-${sign}`).state, `slot-${mark}`);
/** Every mark given its right sign by carrying. */
const solved = (style: CipherStyle): KindiState => {
  let s = ready(style);
  for (const m of boardMarks(s.cipher.puzzle)) s = give(s, m, s.cipher.puzzle.key[m]!).state;
  return s;
};

describe("al-Kindi's room: a thing touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every sign carried to every mark's place gives the page's assign of that sign to that mark, from an empty page and from a full one, and the beak is empty after", (style) => {
    const s0 = ready(style);
    const p = s0.cipher.puzzle;
    // A full page: every mark with its right sign, so that each move also takes a sign from another mark, as the page does.
    const full: KindiState = { ...s0, cipher: boardMarks(p).reduce<CipherState>((c, m) => applyCipher(c, { type: "assign", mark: m, sign: p.key[m]! }), s0.cipher) };
    for (const start of [s0, full]) {
      for (const mark of boardMarks(p)) {
        for (const sign of p.signs) {
          const r = give(start, mark, sign);
          const page = applyCipher(start.cipher, { type: "assign", mark, sign });
          expect(r.state.cipher, `${mark} ${sign}`).toEqual(page);
          expect(r.commands, `${mark} ${sign}`).toEqual(page === start.cipher ? [] : [{ type: "assign", mark, sign }]);
          expect(r.state.carrying).toBeNull();
          const freed = Object.keys(start.cipher.guess).filter((m) => m !== mark && start.cipher.guess[m] === sign);
          expect(r.happened, `${mark} ${sign}`).toEqual([{ type: "assign", mark, sign, freed, changed: page !== start.cipher }]);
        }
        // With nothing carried, a place with a sign is cleared (the page's "not yet"); an empty place gives nothing.
        const cleared = touch(full, `slot-${mark}`);
        expect(cleared.commands).toEqual([{ type: "assign", mark, sign: null }]);
        expect(cleared.state.cipher).toEqual(applyCipher(full.cipher, { type: "assign", mark, sign: null }));
        expect(touch(s0, `slot-${mark}`).state).toBe(s0);
      }
    }
  });
  it("gives the page's command for every touchable thing that has one, and none for a person, a token or the torn page", () => {
    const s = ready("explorer");
    const carrying: KindiState = { ...s, carrying: "sun" };
    for (const t of kdrThings("explorer", false)) {
      const c = commandOf(carrying, t.id);
      if (t.kind === "bell") expect(c).toEqual({ type: "read" });
      else if (t.kind === "slot") expect(c).toEqual({ type: "assign", mark: t.mark, sign: "sun" });
      else expect(c, t.id).toBeNull();
    }
    expect(commandOf(s, "slot-m1")).toEqual({ type: "assign", mark: "m1", sign: null });
  });
  it.each(STYLES)("the bell with a mark still empty is the page's refused reading in %s: nothing counted", (style) => {
    const r = touch(ready(style), "bell");
    expect(r.commands).toEqual([{ type: "read" }]);
    expect(r.state.cipher).toEqual(applyCipher(ready(style).cipher, { type: "read" }));
    expect(r.state.cipher.last?.complete).toBe(false);
    expect(r.state.cipher.reads).toBe(0);
    expect(r.state.cipher.fails).toBe(0);
  });
  it("a wrong reading is counted and says how many marks are right, as on the page", () => {
    let s = ready("explorer");
    const p = s.cipher.puzzle;
    const [a, b] = boardMarks(p) as [string, string];
    for (const m of boardMarks(p)) s = give(s, m, m === a ? p.key[b]! : m === b ? p.key[a]! : p.key[m]!).state;
    const r = touch(s, "bell");
    expect(r.state.cipher).toEqual(applyCipher(s.cipher, { type: "read" }));
    expect(r.state.cipher.reads).toBe(1);
    expect(r.state.cipher.fails).toBe(1);
    expect(r.state.cipher.last).toMatchObject({ complete: true, right: boardMarks(p).length - 2, total: boardMarks(p).length, ok: false });
    expect(r.happened).toEqual([{ type: "read" }]);
  });
  it.each(STYLES)("every mark given its right sign by carrying, then the bell, reads the page in %s: the goals are the page's, Hudhud says the page's last line, and nothing more is touched", (style) => {
    const s = solved(style);
    let page = newCipher(style, cipherPuzzle(style));
    for (const m of boardMarks(page.puzzle)) page = applyCipher(page, { type: "assign", mark: m, sign: page.puzzle.key[m]! });
    page = applyCipher(page, { type: "read" });
    const r = touch(s, "bell");
    expect(r.state.cipher).toEqual(page);
    expect(r.state.cipher.done).toBe(true);
    expect(r.happened.map((x) => x.type)).toEqual(["read", "opened", "talk"]);
    expect(r.state.talk?.script).toBe("done");
    expect(KDR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("cf_done_1");
    expect(kindiGoals(r.state)).toEqual(cipherGoals(page, CIPHER_SLACK[style]));
    const after = applyKindiRoom(r.state, { type: "skip" }).state;
    for (const t of kdrThings(style, false)) expect(touch(after, t.id).state, t.id).toBe(after);
  });
});

describe("al-Kindi's room: what Hudhud carries", () => {
  it("a token touched is picked up, touched again is put back, and another token touched takes its place; none is a move", () => {
    const s = ready("story");
    const a = touch(s, "token-sun");
    expect(a.state.carrying).toBe("sun");
    expect(a.commands).toEqual([]);
    expect(a.happened).toEqual([{ type: "pick", sign: "sun" }]);
    const b = touch(a.state, "token-moon");
    expect(b.state.carrying).toBe("moon");
    expect(b.happened).toEqual([{ type: "drop", sign: "sun" }, { type: "pick", sign: "moon" }]);
    const c = touch(b.state, "token-moon");
    expect(c.state.carrying).toBeNull();
    expect(c.happened).toEqual([{ type: "drop", sign: "moon" }]);
    expect(c.state.cipher).toBe(s.cipher);
  });
  it("survives a snapshot: kept with the page's own snapshot, and put back with the beak as it was", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "token-leaf" }, { type: "touch", id: "slot-m1" }, { type: "touch", id: "token-star" }]);
    const snap = JSON.parse(JSON.stringify(snapshotKindi(s)));
    expect(snap).toEqual({ ...snapshotCipher(s.cipher), carrying: "star" });
    const back = restoreKindi(snap)!;
    expect(back.carrying).toBe("star");
    expect(back.cipher.guess).toEqual(s.cipher.guess);
    expect(back.talk).toBeNull();
    // The page quest takes the room's place up as it is, and the room takes the page's with an empty beak.
    expect(restoreCipher(snap, cipherPuzzle)?.guess).toEqual(s.cipher.guess);
    expect(restoreKindi(JSON.parse(JSON.stringify(snapshotCipher(s.cipher))))?.carrying).toBeNull();
    // A sign that is not of this way of playing is not put back in the beak.
    expect(restoreKindi({ ...snap, style: "story", guess: {}, carrying: "lamp" })?.carrying).toBeNull();
    expect(restoreKindi(null)).toBeNull();
  });
  it("is kept by the page's rule with the beak added: a sign given or taken, a flag, a counted reading or a sign picked up keeps the room; a refused reading or a talk keeps nothing new; the page read keeps nothing", () => {
    const s = ready("explorer");
    const step = (x: KindiState, id: string) => {
      const r = touch(x, id);
      return { r, kept: keptAfter(x, r.state, r.commands) };
    };
    expect(step(s, "token-sun").kept).toEqual({ ...snapshotCipher(s.cipher), carrying: "sun" });
    expect(step(s, "bell").kept).toBeUndefined();
    expect(step(s, "kindi").kept).toBeUndefined();
    const picked = touch(s, "token-sun").state;
    expect(step(picked, "token-sun").kept).toBeNull();
    const placed = step(picked, "slot-m1");
    expect(placed.kept).toEqual({ ...snapshotCipher(placed.r.state.cipher), carrying: null });
    expect(step(s, "page").kept).toMatchObject({ flags: ["feather"] });
    const done = touch(solved("explorer"), "bell");
    expect(keptAfter(solved("explorer"), done.state, done.commands)).toBeUndefined();
  });
});

describe("al-Kindi's room: talk is the page quest's questions and answers", () => {
  it("asking al-Kindi how to begin and about short messages sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the room's own", () => {
    const s = touch(ready("explorer"), "kindi").state;
    expect(s.talk?.script).toBe("kindi");
    let r = applyKindiRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedCount" }]);
    expect(KDR_SCRIPTS.kindi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "cf_count_1", mood: "think" });
    r = applyKindiRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedShort" }]);
    expect(KDR_SCRIPTS.kindi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("cf_short_1");
    expect(kindiGoals(r.state).curiosity).toBe(true);
    r = applyKindiRoom(r.state, { type: "choose", index: 1 });
    expect(KDR_SCRIPTS.kindi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("kdr_kindi_bye");
  });
  it("the messenger answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "messenger" }, { type: "choose", index: 0 }]);
    expect(kind.cipher.flags).toEqual(["kind", "answered"]);
    expect(kindiGoals(kind).kindness).toBe(true);
    expect(touch(applyKindiRoom(kind, { type: "skip" }).state, "messenger").state.talk?.script).toBe("messengerKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "messenger" }, { type: "choose", index: 1 }]);
    expect(blunt.cipher.flags).toEqual(["answered"]);
    expect(kindiGoals(blunt).kindness).toBe(false);
    expect(touch(applyKindiRoom(blunt, { type: "skip" }).state, "messenger").state.talk?.script).toBe("messengerBlunt");
  });
  it("under the torn page is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "page");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(KDR_SCRIPTS.page!.nodes["1"]!.lines[0]!.key).toBe("cf_feather_1");
    const again = touch(applyKindiRoom(r.state, { type: "skip" }).state, "page");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("pageAgain");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the room is touched", () => {
    const s = newKindiRoom("explorer");
    expect(KDR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "cf_intro_1"], ["kindi", "cf_intro_2"]]);
    for (const id of ["token-sun", "slot-m1", "bell", "page"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(KDR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the secret page's quest's", () => {
    const keys = new Set(Object.values(KDR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("cf_"));
    expect(own.sort()).toEqual(["kdr_kindi_bye", "kdr_kindi_hello", "kdr_thanks"]);
  });
});

describe("al-Kindi's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("kdr_"));
  // They were the last eighteen of every table until al-Idrisi's hall (27 November 2026) appended its own after them, and
  // al-Razi's study its own after those; they are still one block, in the same order, in every table, and only those two
  // rooms' keys come after them.
  it("are eighteen, one block in every table, in the same order, with only al-Idrisi's hall's, al-Razi's study's and Karima's room's keys after them", () => {
    expect(keys).toHaveLength(18);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_") || k.startsWith("ahr_")), l).toBe(true);
    }
  });
  it("say that the room, the board, the marks hung on it and the bell are invented, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.kdr_note_room).toBe("الغرفة واللوح الكبير والعلامات المعلّقة عليه والجرس من خيال اللعب، وليست صورة لمكان عمل الكندي.");
    expect(tables.en!.kdr_note_room).toBe("The room, the large board, the marks hung on it and the bell are invented for play; they are not a picture of where al-Kindi worked.");
  });
  it("never call the messenger «الرسول», and name him in Arabic as the quest does", () => {
    for (const l of LANGS) for (const k of keys) expect(tables[l]![k], `${l} ${k}`).not.toMatch(/الرسول/);
    expect(tables.ar!.kdr_thing_messenger).toBe("حامل الرسالة الصغير");
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
  it("name every thing in the room, in every way of playing and either reading direction", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of kdrThings(style, rtl)) expect(keys, t.id).toContain(t.name);
  });
  it("give a goodbye of the room's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye"]) expect(tables[l]!.kdr_kindi_bye, l).not.toBe(tables[l]![other]);
  });
});

describe("al-Kindi's room: no letters are drawn", () => {
  it("its painting, the quest's signs and marks it draws with, and its scene never write text", () => {
    for (const f of ["art/kindi.ts", "art/cipher.ts", "art/kit.ts", "scenes/kindi.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(/);
  });
  it("painting every picture of the room calls neither fillText nor strokeText", async () => {
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
      const art = await import("../art/kindi");
      art.kindiRoom(1);
      art.tile(1);
      art.openingLine(1);
      for (const id of ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"]) art.markArt(1, id);
      for (const id of cipherPuzzle("challenge").signs) art.signArt(1, id);
      art.slotArt(1, true);
      art.slotArt(1, false);
      art.tokenBase(1);
      art.tornPage(1);
      art.bell(1);
      for (const style of STYLES) {
        const p = cipherPuzzle(style);
        for (const rtl of [false, true]) {
          art.countBoard(1, ranked(p.sample).map((r) => ({ kind: "sign" as const, ...r })), rtl, "sample");
          art.countBoard(1, ranked(p.message).map((r) => ({ kind: "mark" as const, ...r })), rtl, "message");
        }
      }
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it.each(STYLES)("the count boards in %s hold every row of both tables, and the longest bar fits the board", (style) => {
    const p = cipherPuzzle(style);
    for (const rows of [ranked(p.sample), ranked(p.message)]) {
      expect(rows.length).toBeLessThanOrEqual(8);
      const most = Math.max(...rows.map((r) => r.count));
      const pitch = Math.min(6.2, (KDR_COUNTS.w - 46) / most);
      expect(34 + most * pitch).toBeLessThanOrEqual(KDR_COUNTS.w - 8);
    }
  });
});

describe("al-Kindi's room: the board, the shelf and the reading direction", () => {
  it.each(STYLES)("in %s the board has a place for each mark the message uses, from the commonest, and the shelf a token for each sign of the page", (style) => {
    const p = cipherPuzzle(style);
    const things = kdrThings(style, false);
    expect(things.filter((t) => t.kind === "slot").map((t) => t.mark)).toEqual(used(p));
    expect(things.filter((t) => t.kind === "token").map((t) => t.sign)).toEqual(p.signs);
  });
  it("puts the first place and the first token on the left, and on the right on a page read right to left; the ids are the same either way", () => {
    for (const style of STYLES) {
      const ltr = kdrThings(style, false);
      const rtl = kdrThings(style, true);
      expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
      for (const kind of ["slot", "token"] as const) {
        const xs = (list: KdrThing[]) => list.filter((t) => t.kind === kind).map((t) => t.x);
        expect(xs(ltr)).toEqual([...xs(ltr)].sort((a, b) => a - b));
        expect(xs(rtl)).toEqual([...xs(rtl)].sort((a, b) => b - a));
      }
    }
  });
});

describe("al-Kindi's room: nearness and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the room, flown to, is in reach where the bird lands, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    const things = kdrThings(style, rtl);
    for (const t of things) {
      const at = landing(t, KDR_ROOM, KDR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
    }
  });
  it("the torn page with the feather under it needs flight: it is out of reach from the floor and from the bookcase's shelves", () => {
    const page = kdrThings("explorer", false).find((t) => t.id === "page")!;
    expect(near(page, { x: page.x, y: KDR_WORLD.floor })).toBe(false);
    for (const y of KDR_BOOKS.shelves) for (let x = KDR_BOOKS.x; x <= KDR_BOOKS.x + KDR_BOOKS.w; x += 10) expect(near(page, { x, y }), `${x} ${y}`).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, JR_DOOR, TSR_DOOR, AKR_DOOR]) expect(KDR_DOOR).toEqual(d);
    for (const w of [WORLD, JR_WORLD, TSR_WORLD, AKR_WORLD]) expect({ h: KDR_WORLD.height, floor: KDR_WORLD.floor, view: KDR_WORLD.view, w: KDR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, JR_ROOM, TSR_ROOM, AKR_ROOM]) expect(KDR_ROOM.bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, KDR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, KDR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(KDR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(KDR_ROOM.bounds.x + KDR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: reading the page never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of kdrThings(style, rtl)) expect(near(KDR_DOOR, landing(t, KDR_ROOM, KDR_APPROACH[t.kind])), t.id).toBe(false);
  });
});
