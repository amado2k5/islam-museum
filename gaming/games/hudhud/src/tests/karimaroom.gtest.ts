// Karima al-Marwaziyya's room (sim/karimaroom.ts, content/karima-room.ts, ui/karima.ts, art/karima.ts, scenes/karima.ts):
// the copies compared by flying. A sign touched gives exactly the command the page's button for that sign gives (`mark`
// when it is not marked, refused and counted when it is not a slip, `unmark` when it is), and a question, an answer or
// the feather a `flag`, so that the counts, the goals and the three ways of playing are the page quest's. The place kept
// is the quest's own snapshot. The room draws no text, shows no sacred place and no religious text, and its signs are
// the page's own drawing. And the room's things and door pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { COLLATE_SLACK, collatePuzzle, showsRemaining } from "../content/collate";
import { KRR_APPROACH, KRR_DOOR, KRR_SCRIPTS, KRR_SHELF, KRR_STANDS, KRR_START, KRR_WORLD, SIGN_REACH, cellOf, krrRoom, krrThings, markAt, pitchOf, rowsOf, signAt } from "../content/karima-room";
import { RZR_DOOR, RZR_ROOM, RZR_WORLD } from "../content/razi-room";
import { ISR_DOOR, ISR_ROOM, ISR_WORLD } from "../content/idrisi-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { faults } from "../narrative/dialogue";
import { applyCollate, collateGoals, isMarked, newCollate, remaining, restoreCollate, slipsOf, snapshotCollate, type CollateCommand, type CollateState, type CollateStyle } from "../sim/collate";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { afterDone, applyKarimaRoom, commandOf, karimaGoals, keptAfter, newKarimaRoom, restoreKarima, snapshotKarima, type KarimaCommand, type KarimaState } from "../sim/karimaroom";

const STYLES: CollateStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A room past its opening words. */
const ready = (style: CollateStyle): KarimaState => applyKarimaRoom(newKarimaRoom(style), { type: "skip" }).state;
const touch = (s: KarimaState, id: string) => applyKarimaRoom(s, { type: "touch", id });
const playAll = (s: KarimaState, cs: KarimaCommand[]) => cs.reduce((x, c) => applyKarimaRoom(x, c).state, s);
/** The page's own press on a sign's button (ui/collate.ts toggle): unmark if marked, mark if not. */
const pagePress = (s: CollateState, copy: number, place: number): CollateState => applyCollate(s, isMarked(s, copy, place) ? { type: "unmark", copy, place } : { type: "mark", copy, place });
const signId = (copy: number, place: number) => `sign-${copy}-${place}`;

describe("Karima's room: a sign touched is the page quest's command", () => {
  it.each(STYLES)("in %s, every sign of every copy touched from the start, and from a puzzle part way, gives the page's press on that sign's button: the same state and the same one command", (style) => {
    const s0 = ready(style);
    const slips = slipsOf(s0.collate.puzzle);
    // Part way: two slips marked and one wrong mark made.
    const wrongAt = (() => {
      for (let c = 0; c < s0.collate.puzzle.copies.length; c++) for (let p = 0; p < s0.collate.puzzle.copies[0]!.length; p++) if (!slips.some((x) => x.copy === c && x.place === p)) return [c, p] as const;
      throw new Error("no place to mark wrongly");
    })();
    const mid = playAll(s0, [{ type: "touch", id: signId(slips[0]!.copy, slips[0]!.place) }, { type: "touch", id: signId(slips[1]!.copy, slips[1]!.place) }, { type: "touch", id: signId(...wrongAt) }]);
    expect(mid.collate.marks).toHaveLength(2);
    expect(mid.collate.wrong).toBe(1);
    for (const start of [s0, mid]) {
      const copies = start.collate.puzzle.copies.length;
      const n = start.collate.puzzle.copies[0]!.length;
      for (let copy = 0; copy < copies; copy++) {
        for (let place = 0; place < n; place++) {
          const r = touch(start, signId(copy, place));
          const page = pagePress(start.collate, copy, place);
          expect(r.state.collate, `${copy} ${place}`).toEqual(page);
          const want: CollateCommand = isMarked(start.collate, copy, place) ? { type: "unmark", copy, place } : { type: "mark", copy, place };
          expect(r.commands, `${copy} ${place}`).toEqual([want]);
          expect(commandOf(start, signId(copy, place))).toEqual(want);
          expect(r.happened, `${copy} ${place}`).toEqual([{ type: page.last!.type, copy, place }]);
        }
      }
    }
  });
  it.each(STYLES)("in %s, a wrong mark by touch is refused and counted exactly as on the page, with the page's reason", (style) => {
    const s = ready(style);
    const slips = slipsOf(s.collate.puzzle);
    const n = s.collate.puzzle.copies[0]!.length;
    let wrong = 0;
    for (let copy = 0; copy < s.collate.puzzle.copies.length; copy++) {
      for (let place = 0; place < n; place++) {
        if (slips.some((x) => x.copy === copy && x.place === place)) continue;
        const r = touch(s, signId(copy, place));
        expect(r.state.collate.marks).toEqual([]);
        expect(r.state.collate.wrong).toBe(1);
        expect(r.state.collate).toEqual(applyCollate(s.collate, { type: "mark", copy, place }));
        expect(r.state.collate.last?.type).toBe("refused");
        expect(r.happened).toEqual([{ type: "refused", copy, place }]);
        wrong++;
      }
    }
    expect(wrong).toBeGreaterThan(0);
  });
  it.each(STYLES)("in %s, every slip marked by touch finishes the copies: the goals are the page's, Hudhud says the page's last line, and nothing more is touched", (style) => {
    const s = ready(style);
    const slips = slipsOf(s.collate.puzzle);
    const done = playAll(s, slips.map((x) => ({ type: "touch", id: signId(x.copy, x.place) })));
    expect(done.collate.done).toBe(true);
    let page = newCollate(style, collatePuzzle(style));
    for (const x of slips) page = applyCollate(page, { type: "mark", ...x });
    expect(done.collate).toEqual(page);
    expect(karimaGoals(done)).toEqual(collateGoals(page, COLLATE_SLACK[style]));
    const after = afterDone(done);
    expect(after.talk?.script).toBe("done");
    expect(KRR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("kr_done_1");
    const quiet = applyKarimaRoom(after, { type: "skip" }).state;
    for (const t of krrThings(style, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
  it("gives a command for a sign only, and none for Karima, the boy or the stack of spare copies", () => {
    for (const style of STYLES) {
      const s = ready(style);
      for (const t of krrThings(style, false)) if (t.kind !== "sign") expect(commandOf(s, t.id), t.id).toBeNull();
      expect(krrThings(style, false).map((t) => t.kind).filter((k) => k !== "sign")).toEqual(["karima", "boy", "stack"]);
    }
  });
});

describe("Karima's room: the place kept", () => {
  it("survives a snapshot: the page's own snapshot, taken up by the page as it is, and the page's taken up by the room", () => {
    const s = ready("explorer");
    const slips = slipsOf(s.collate.puzzle);
    const mid = playAll(s, [{ type: "touch", id: signId(slips[0]!.copy, slips[0]!.place) }, { type: "touch", id: "sign-0-1" }, { type: "touch", id: "stack" }, { type: "skip" }]);
    const snap = JSON.parse(JSON.stringify(snapshotKarima(mid)));
    expect(snap).toEqual(snapshotCollate(mid.collate));
    const back = restoreKarima(snap)!;
    expect(back.collate.marks).toEqual(mid.collate.marks);
    expect(back.collate.wrong).toBe(1);
    expect(back.collate.flags).toEqual(["feather"]);
    expect(back.talk).toBeNull();
    expect(restoreCollate(snap, collatePuzzle)?.marks).toEqual(mid.collate.marks);
    expect(restoreKarima(null)).toBeNull();
    expect(restoreKarima({ ...snap, wrong: -1 })).toBeNull();
  });
  it("is kept by the page's rule: a mark, a wrong mark or a flag keeps the copies; a talk keeps nothing new; the last mark taken away with nothing else done clears the place; the copies finished are left to the host", () => {
    const s = ready("challenge");
    const slip = slipsOf(s.collate.puzzle)[0]!;
    const step = (x: KarimaState, c: KarimaCommand) => {
      const r = applyKarimaRoom(x, c);
      return { r, kept: keptAfter(x, r.state) };
    };
    const marked = step(s, { type: "touch", id: signId(slip.copy, slip.place) });
    expect(marked.kept).toEqual(snapshotCollate(marked.r.state.collate));
    expect(step(s, { type: "touch", id: "karima" }).kept).toBeUndefined();
    expect(step(marked.r.state, { type: "touch", id: signId(slip.copy, slip.place) }).kept).toBeNull();
    expect(step(s, { type: "touch", id: "stack" }).kept).toMatchObject({ flags: ["feather"] });
    const all = slipsOf(s.collate.puzzle);
    const nearly = playAll(s, all.slice(0, -1).map((x) => ({ type: "touch", id: signId(x.copy, x.place) })));
    const last = all[all.length - 1]!;
    expect(step(nearly, { type: "touch", id: signId(last.copy, last.place) }).kept).toBeUndefined();
  });
});

describe("Karima's room: talk is the page quest's questions and answers", () => {
  it("asking Karima who she was and about her book sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the room's own", () => {
    const s = touch(ready("explorer"), "karima").state;
    expect(s.talk?.script).toBe("karima");
    let r = applyKarimaRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedWho" }]);
    expect(KRR_SCRIPTS.karima!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "kr_who_1", mood: "think" });
    r = applyKarimaRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedBook" }]);
    expect(KRR_SCRIPTS.karima!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "kr_book_1", mood: "think" });
    expect(karimaGoals(r.state).curiosity).toBe(true);
    r = applyKarimaRoom(r.state, { type: "choose", index: 1 });
    expect(KRR_SCRIPTS.karima!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("krr_karima_bye");
  });
  it("the boy answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "boy" }, { type: "choose", index: 0 }]);
    expect(kind.collate.flags).toEqual(["kind", "answered"]);
    expect(karimaGoals(kind).kindness).toBe(true);
    expect(touch(applyKarimaRoom(kind, { type: "skip" }).state, "boy").state.talk?.script).toBe("boyKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "boy" }, { type: "choose", index: 1 }]);
    expect(blunt.collate.flags).toEqual(["answered"]);
    expect(karimaGoals(blunt).kindness).toBe(false);
    expect(touch(applyKarimaRoom(blunt, { type: "skip" }).state, "boy").state.talk?.script).toBe("boyBlunt");
  });
  it("between the spare copies is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "stack");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(KRR_SCRIPTS.stack!.nodes["1"]!.lines[0]!.key).toBe("kr_feather_1");
    const again = touch(applyKarimaRoom(r.state, { type: "skip" }).state, "stack");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("stackAgain");
    expect(KRR_SCRIPTS.stackAgain!.nodes["1"]!.lines[0]!.key).toBe("kr_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the room is touched", () => {
    const s = newKarimaRoom("challenge");
    expect(KRR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "kr_intro_1"], ["karima", "kr_intro_2"]]);
    for (const id of ["sign-0-0", "sign-2-1", "stack", "boy"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(KRR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the copies' quest's", () => {
    const keys = new Set(Object.values(KRR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("kr_"));
    expect(own.sort()).toEqual(["krr_karima_bye", "krr_karima_hello", "krr_thanks"]);
  });
});

describe("Karima's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("krr_"));
  // They were the last eleven of every table until Ibn Battuta's inn (27 November 2026) appended its own after them, and the
  // coffee room its own after those; they
  // are still one block, in the same order, in every table, and only the inn's keys come after them.
  it("are eleven, one block in every table, in the same order, with only Ibn Battuta's inn's, the coffee room's and al-Jahiz's room's keys after them", () => {
    expect(keys).toHaveLength(11);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_")), l).toBe(true);
    }
  });
  it("say that the room and the copies on their stands are invented, not a picture of her home, and that the game shows nothing of the text of any hadith, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.krr_note_room).toBe("الغرفة والنسخ على حواملها من خيال اللعب، وليست صورة لبيت كريمة المروزية. ولا يظهر في اللعبة شيء من نصّ أي حديث.");
    expect(tables.en!.krr_note_room).toBe("The room and the copies on their stands are invented for play; they are not a picture of Karima al-Marwaziyya's home. The game shows nothing of the text of any hadith.");
  });
  it("carry no parenthesis, no digit and no honorific, never call anyone the Messenger, and have the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|رضی اللہ|الرسول|رسول/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("name no sacred place, in any language, and the record's Mecca only in the quest's own lines, never in the room's", () => {
    const SACRED: Record<string, RegExp> = {
      en: /\b(kaaba|ka'ba|mecca|makkah|sanctuary|mosque|haram)\b/i,
      fr: /\b(kaaba|la mecque|sanctuaire|mosquée)\b/i,
      es: /\b(kaaba|la meca|santuario|mezquita)\b/i,
      tr: /(kâbe|kabe|mekke|harem|cami|mescit)/i,
      id: /\b(ka'bah|kabah|mekah|makkah|tanah suci|masjid)\b/i,
      ar: /الكعبة|مكة|الحرم|مسجد|المسجد/,
      ur: /کعبہ|مکہ|حرم|مسجد/,
    };
    for (const l of LANGS) for (const k of keys) expect(SACRED[l]!.test(tables[l]![k]!), `${l} ${k}: ${tables[l]![k]}`).toBe(false);
  });
  it("name every thing in the room that is not a sign; a sign is named by the page's own words for it", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of krrThings(style, rtl)) expect(t.kind === "sign" ? t.name === "kr_cell" : keys.includes(t.name), t.id).toBe(true);
  });
  it("give a goodbye of the room's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["rzr_razi_bye", "isr_idrisi_bye", "kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye", "d_scholar_bye"]) expect(tables[l]!.krr_karima_bye, l).not.toBe(tables[l]![other]);
  });
  it("are every one used by the room's page or its things", () => {
    const ui = source("ui/karima.ts") + source("content/karima-room.ts");
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

describe("Karima's room: no letters, no sacred place, and the page's own signs", () => {
  it("its painting, the copies' drawing it uses, and its scene never write text", () => {
    for (const f of ["art/karima.ts", "art/collate.ts", "art/kit.ts", "scenes/karima.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(|font\s*=/);
  });
  it("painting every picture of the room calls neither fillText nor strokeText", async () => {
    const { ctx, calls } = counter();
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
    try {
      const art = await import("../art/karima");
      const cast = await import("../art/cast");
      art.karimaRoom(1);
      for (const style of STYLES) {
        const p = collatePuzzle(style);
        const n = p.copies[0]!.length;
        art.standsArt(1, p.copies.length);
        for (const sign of new Set(p.copies.flat())) for (const light of [true, false]) art.cellArt(1, sign, n, light);
        art.slipArt(1, n);
        art.focusArt(1, n);
        p.copies.forEach((_, copy) => art.markArt(1, copy, copy === p.hers));
      }
      art.stackArt(1);
      cast.karima(1);
      cast.copyBoy(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it("draws no sacred place and nothing of any religious text: no Kaaba, sanctuary, mosque, minaret, dome or mihrab, no inscription, calligraphy or letter, in its art, scene, content or page code (the dialogue's `script` is the word for a talk); the only prop is the feather", () => {
    const code = (f: string) => source(f).split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*\*)/.test(l)).join("\n");
    for (const f of ["art/karima.ts", "scenes/karima.ts", "content/karima-room.ts", "ui/karima.ts", "sim/karimaroom.ts"]) expect(code(f), f).not.toMatch(/kaaba|ka'ba|sanctuar|mosque|minaret|dome|mihrab|inscri|calligraph|letter|quran|qur'an|verse|hadith|mecca/i);
    expect(source("art/karima.ts")).not.toMatch(/from "\.\/props"/);
    expect([...source("scenes/karima.ts").matchAll(/props\.(\w+)/g)].map((m) => m[1])).toEqual(["feather"]);
  });
  it("draws every sign in a cell by the page quest's own drawSign, and the page's own seal, dots and broken ring (shared code, not a copy)", () => {
    const art = source("art/karima.ts");
    expect(art).toMatch(/import \{ drawSign, dots, seal, slipRing \} from "\.\/collate";/);
    expect(art).toContain("drawSign(c, sign, Math.min(w, h) * 0.36, bg)");
    const page = source("art/collate.ts");
    for (const fn of ["export function drawSign(", "export function seal(", "export function dots(", "export function slipRing("]) expect(page, fn).toContain(fn);
    // The page draws its signs at 0.36 of the cell's smaller side, and its broken ring with the same dashes.
    expect(page).toContain("const r = Math.min(cellW, cellH) * 0.36;");
    expect(page).toMatch(/setLineDash\(\[7, 5\]\)/);
  });
});

describe("Karima's room: the stands and the reading direction", () => {
  it.each(STYLES)("in %s every copy stands on its own stand, her copy on the top one, one above another, the first place on the left, or on the right on a page read right to left; the ids are the same either way", (style) => {
    const p = collatePuzzle(style);
    const copies = p.copies.length;
    const n = p.copies[0]!.length;
    expect(rowsOf(copies)).toHaveLength(copies);
    expect([...rowsOf(copies)]).toEqual([...rowsOf(copies)].sort((a, b) => a - b));
    for (let copy = 0; copy < copies; copy++) {
      const ltr = krrThings(style, false).filter((t) => t.kind === "sign" && t.copy === copy);
      const rtl = krrThings(style, true).filter((t) => t.kind === "sign" && t.copy === copy);
      expect(ltr.map((t) => t.place)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(rtl.map((t) => t.id)).toEqual(ltr.map((t) => t.id));
      expect(ltr.map((t) => t.x)).toEqual([...ltr.map((t) => t.x)].sort((a, b) => a - b));
      expect(rtl.map((t) => t.x)).toEqual([...rtl.map((t) => t.x)].sort((a, b) => b - a));
      expect(new Set([...ltr, ...rtl].map((t) => t.y))).toEqual(new Set([rowsOf(copies)[copy]]));
      // A place lies in the same column in every copy, so that the eye can run down it, as on the page.
      for (let place = 0; place < n; place++) expect(signAt(copy, place, copies, n, false).x).toBe(signAt(0, place, copies, n, false).x);
    }
  });
  it.each(STYLES)("in %s the cells do not overlap, lie on their stand between its ends with the copy's mark before the first, stand on the stand's ledge, and the rows do not overlap", (style) => {
    const p = collatePuzzle(style);
    const copies = p.copies.length;
    const n = p.copies[0]!.length;
    const { w, h } = cellOf(n);
    expect(pitchOf(n) - w).toBeGreaterThanOrEqual(6);
    for (const rtl of [false, true]) {
      for (let copy = 0; copy < copies; copy++) {
        const xs = Array.from({ length: n }, (_, place) => signAt(copy, place, copies, n, rtl).x);
        const mark = markAt(copy, copies, n, rtl).x;
        expect(Math.min(...xs, mark) - 28).toBeGreaterThan(KRR_STANDS.left);
        expect(Math.max(...xs, mark) + 28).toBeLessThan(KRR_STANDS.right);
        expect(rtl ? mark > Math.max(...xs) : mark < Math.min(...xs)).toBe(true);
      }
    }
    const rows = rowsOf(copies);
    for (const y of rows) expect(y + h / 2).toBeLessThanOrEqual(y + KRR_STANDS.ledge);
    for (let i = 1; i < rows.length; i++) expect(rows[i]! - rows[i - 1]!).toBeGreaterThan(h + 40);
  });
  it("puts Karima clear of the stands and the boy clear of the bookcase's front and of the door", () => {
    const k = drawnBox(SCHOLAR, KRR_START.karima, KRR_WORLD.floor, "either");
    expect(k.right).toBeLessThan(KRR_STANDS.left);
    const b = drawnBox(HELPER, KRR_START.boy, KRR_WORLD.floor, "either");
    expect(b.right).toBeLessThan(KRR_DOOR.x - 40);
  });
});

describe("Karima's room: nearness and the door, as in the other rooms", () => {
  it.each(STYLES.flatMap((style) => [false, true].map((rtl) => [style, rtl] as const)))("every thing in the room, flown to, is in reach where the bird lands, and is the nearest thing there, in %s (right to left: %s)", (style, rtl) => {
    const things = krrThings(style, rtl);
    const room = krrRoom(collatePuzzle(style).copies.length);
    for (const t of things) {
      const at = landing(t, room, KRR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
      if (t.kind === "sign") expect(at.y, t.id).toBe(t.y + KRR_STANDS.ledge);
    }
  });
  it.each(STYLES)("in %s the nearness for a sign is generous: wherever the bird stands on a stand's ledge between the first sign and the last, some sign of that copy is in reach and the nearest sign is of that copy, and the ring follows the nearest", (style) => {
    const p = collatePuzzle(style);
    const copies = p.copies.length;
    const n = p.copies[0]!.length;
    const things = krrThings(style, false);
    expect(SIGN_REACH).toBeGreaterThan(pitchOf(n) / 2 + 8);
    for (let copy = 0; copy < copies; copy++) {
      const y = rowsOf(copies)[copy]! + KRR_STANDS.ledge;
      const x0 = signAt(copy, 0, copies, n, false).x;
      const x1 = signAt(copy, n - 1, copies, n, false).x;
      for (let x = x0; x <= x1; x += 2) {
        const nearest = [...things].sort((a, b) => distance(a, { x, y }) - distance(b, { x, y }))[0]!;
        expect(nearest.kind === "sign" && nearest.copy === copy, `${copy} ${x}`).toBe(true);
        expect(near(nearest, { x, y }), `${copy} ${x}`).toBe(true);
      }
    }
  });
  it("no sign can be touched from the floor: the bird flies up to a stand", () => {
    for (const style of STYLES) for (const t of krrThings(style, false).filter((k) => k.kind === "sign")) for (let x = t.x - 80; x <= t.x + 80; x += 10) expect(near(t, { x, y: KRR_WORLD.floor }), `${style} ${t.id}`).toBe(false);
  });
  it("the stack of spare copies with the feather between them needs flight: it is out of reach from the floor and from the bookcase's shelves", () => {
    const stack = krrThings("explorer", false).find((t) => t.id === "stack")!;
    expect(near(stack, { x: stack.x, y: KRR_WORLD.floor })).toBe(false);
    for (const y of KRR_SHELF.shelves) for (let x = KRR_SHELF.x; x <= KRR_SHELF.x + KRR_SHELF.w; x += 10) expect(near(stack, { x, y }), `${x} ${y}`).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, RZR_DOOR, ISR_DOOR]) expect(KRR_DOOR).toEqual(d);
    for (const w of [WORLD, RZR_WORLD, ISR_WORLD]) expect({ h: KRR_WORLD.height, floor: KRR_WORLD.floor, view: KRR_WORLD.view, w: KRR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, RZR_ROOM, ISR_ROOM]) expect(krrRoom(3).bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    const room = krrRoom(3);
    let m = newMover(250, room.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(KRR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: marking the slips never takes the bird through it by itself", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of krrThings(style, rtl)) expect(near(KRR_DOOR, landing(t, krrRoom(collatePuzzle(style).copies.length), KRR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("has the stands of its way of playing only: two ledges in Story, three in the others; and the scene keeps only those", () => {
    expect(krrRoom(2).perches).toHaveLength(5);
    expect(krrRoom(3).perches).toHaveLength(6);
    expect(source("scenes/karima.ts")).toContain("this.layout.room.perches.splice(0, this.layout.room.perches.length, ...krrRoom(copies).perches);");
  });
});

describe("Karima's room: in words", () => {
  it("says how many slips remain where the way of playing shows it, as the page does, and offers every sign as a button with the page's own words", () => {
    const ui = source("ui/karima.ts");
    expect(ui).toContain('showsRemaining(state.collate.style) ? t("kr_left", { n: num(remaining(state.collate)) }) : t("kr_left_hidden")');
    expect(ui).toContain('t(marked ? "kr_cell_marked" : "kr_cell"');
    expect(ui).toContain('b.setAttribute("aria-pressed", String(isMarked(c, k.copy!, k.place!)))');
    expect(ui).toContain('left.setAttribute("aria-live", "polite")');
    expect(ui).toContain('ran.setAttribute("aria-live", "polite")');
    expect(ui).not.toMatch(/\.style\./);
    // The page's own words for a mark, an unmark and every refusal.
    for (const k of ["kr_did_mark", "kr_did_mark_story", "kr_did_unmark", "kr_did_same", "kr_did_hers", "kr_did_agrees", "kr_did_done"]) expect(ui, k).toContain(`"${k}"`);
    expect(showsRemaining("challenge")).toBe(false);
    expect(remaining(newCollate("story", collatePuzzle("story")))).toBe(4);
  });
  it("is opened from the Atlas and the journey as Karima's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[COLLATE_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*karimaRoom\(/);
    expect(app).toContain("fallback: () => openPage(COLLATE_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(COLLATE_QUEST, restoreKarima)");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(COLLATE_QUEST, snap)");
    expect(app).toContain("startKarima: () => openPage(COLLATE_QUEST)");
  });
});
