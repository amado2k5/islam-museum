// Karima and the copies, the thirteenth quest: comparing copies sign by sign. The three puzzles have copies of one
// length, the number of slips stated, and at every place where the copies do not agree exactly one copy differs from
// the others (in Story, always the other copy; with three copies, never a place where all three differ); a mark stands
// only on a slip, a wrong mark is refused and counted, a mark can be taken away; the four goals; a saved place proved
// and not trusted; nothing changes after the end; the picture's hit-test both ways round, with place 1 on the right on a
// page that reads right to left; and the words, in all seven languages, keep the lines written for the quest exactly,
// rest on the record's own file, show no religious text (the words for hadith, Sahih, Qur'an and verse appear only in
// the narrator's and the notes' named lines), no «الرسول», no digit but the year 463, and the names are checked against
// the Atlas headings, the museum's labels and its pages.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { COLLATE_ART, cellCentre, cellRect, collateHit, collateLayout } from "../art/collate";
import { COLLATE_QUEST, COLLATE_RECORDS, COLLATE_SLACK, COLLATE_SUBJECT, NEAR_ALIKE, SIGNS, collatePage, collatePuzzle, nearAlike, showsRemaining } from "../content/collate";
import {
  COLLATE_FLAGS,
  applyCollate,
  collateGoals,
  differences,
  isSlip,
  lengthOf,
  mark,
  newCollate,
  remaining,
  restoreCollate,
  slipAt,
  slipsOf,
  snapshotCollate,
  unmark,
  type CollateCommand,
  type CollatePuzzle,
  type CollateState,
  type CollateStyle,
} from "../sim/collate";

const STYLES: CollateStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const here = (...p: string[]) => resolve(__dirname, "..", ...p);
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const atlasTable = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
const kr = (lang: string) => Object.entries(table(lang)).filter(([k]) => k.startsWith("kr_"));
/** The strings of Karima al-Marwaziyya's room (krr_, 27 November 2026), which keeps the quest's rule of no religious text. */
const krr = (lang: string) => Object.entries(table(lang)).filter(([k]) => k.startsWith("krr_"));
const play = (s: CollateState, cs: CollateCommand[]) => cs.reduce(applyCollate, s);
const fresh = (style: CollateStyle) => newCollate(style, collatePuzzle(style));
const page = (lang: string) => readFileSync(resolve(root, "content", lang, "person", "karima-al-marwaziyya.md"), "utf8").replace(/\s+/g, " ");
const record = page("en");
const recordAr = page("ar");
/** Marks every slip of the puzzle, in place order. */
const markAll = (s: CollateState): CollateCommand[] => slipsOf(s.puzzle).map((x) => ({ type: "mark", ...x }));

// The slips each puzzle is written to have, written down again here by hand (1-based: copy, place) and not read from the
// content file's slip lists.
const EXPECTED: Record<CollateStyle, [number, number][]> = {
  story: [[2, 3], [2, 6], [2, 9], [2, 11]],
  explorer: [[2, 2], [1, 5], [3, 8], [2, 10], [3, 13], [1, 15]],
  challenge: [[3, 2], [1, 4], [2, 6], [3, 9], [2, 12], [1, 14], [2, 17], [3, 20]],
};

describe("Karima's copies: the three puzzles", () => {
  it("have two copies of twelve signs in Story, three of sixteen in Explorer and three of twenty in Challenge, all of one length, her copy first", () => {
    const shape = (s: CollateStyle) => [collatePuzzle(s).copies.length, lengthOf(collatePuzzle(s))];
    expect(STYLES.map(shape)).toEqual([[2, 12], [3, 16], [3, 20]]);
    for (const s of STYLES) {
      const p = collatePuzzle(s);
      expect(p.hers, s).toBe(0);
      expect(new Set(p.copies.map((c) => c.length)).size, s).toBe(1);
      for (const c of p.copies) for (const id of c) expect(SIGNS as readonly string[], `${s}: ${id}`).toContain(id);
    }
  });
  it("differ in four, six and eight places, the numbers the quest states, and nowhere else", () => {
    expect(STYLES.map((s) => differences(collatePuzzle(s)).length)).toEqual([4, 6, 8]);
    for (const s of STYLES) expect(slipsOf(collatePuzzle(s)).map((x) => [x.copy + 1, x.place + 1]), s).toEqual(EXPECTED[s]);
  });
  it("have exactly one copy that differs from the others at every place where they do not agree: in Story always the other copy, never hers", () => {
    for (const s of STYLES) {
      const p = collatePuzzle(s);
      for (const place of differences(p)) {
        const odd = slipAt(p, place);
        expect(odd, `${s} place ${place + 1}`).not.toBeNull();
        if (p.copies.length === 3) {
          const others = p.copies.filter((_, i) => i !== odd).map((c) => c[place]);
          expect(others[0], `${s} place ${place + 1}`).toBe(others[1]);
          expect(p.copies[odd!]![place], `${s} place ${place + 1}`).not.toBe(others[0]);
        }
      }
    }
    expect(slipsOf(collatePuzzle("story")).every((x) => x.copy === 1)).toBe(true);
  });
  it("never has a place where all three copies differ (proved over every place of the three-copy puzzles), and the rule refuses to name a slip where they would", () => {
    for (const s of ["explorer", "challenge"] as CollateStyle[]) {
      const p = collatePuzzle(s);
      for (let place = 0; place < lengthOf(p); place++) {
        const signs = p.copies.map((c) => c[place]!);
        const distinct = new Set(signs);
        expect(distinct.size, `${s} place ${place + 1}`).toBeLessThanOrEqual(2);
        if (distinct.size === 2) expect([...distinct].map((x) => signs.filter((y) => y === x).length).sort(), `${s} place ${place + 1}`).toEqual([1, 2]);
      }
    }
    const three: CollatePuzzle = { hers: 0, copies: [["ring", "key"], ["drop", "key"], ["wave", "key"]] };
    expect(slipAt(three, 0)).toBeNull();
    expect(slipsOf(three)).toEqual([]);
    expect(differences(three)).toEqual([0]);
  });
  it("agree, two copies against one, on the page as it should read; and in Story her copy is that page", () => {
    for (const s of ["explorer", "challenge"] as CollateStyle[]) {
      const p = collatePuzzle(s);
      const agreed = Array.from({ length: lengthOf(p) }, (_, place) => {
        const signs = p.copies.map((c) => c[place]!);
        return signs.find((x) => signs.filter((y) => y === x).length >= 2);
      });
      expect(agreed, s).toEqual([...collatePage(s)]);
    }
    expect([...collatePuzzle("story").copies[0]!]).toEqual([...collatePage("story")]);
  });
  it("spread the Explorer's slips over all three copies, two in each, her copy too", () => {
    const by = slipsOf(collatePuzzle("explorer")).reduce<number[]>((a, x) => ((a[x.copy] = (a[x.copy] ?? 0) + 1), a), []);
    expect(by).toEqual([2, 2, 2]);
  });
  it("make at least three of the Challenge's slips near alike (a ring for a drop, a crescent turned the other way, a star of five points for one of six), and the pairs are those three", () => {
    expect(NEAR_ALIKE.map((x) => [...x])).toEqual([["ring", "drop"], ["crescent-right", "crescent-left"], ["star-five", "star-six"]]);
    const p = collatePuzzle("challenge");
    const page = collatePage("challenge");
    const near = slipsOf(p).filter((x) => nearAlike(p.copies[x.copy]![x.place]!, page[x.place]!));
    expect(near.length).toBeGreaterThanOrEqual(3);
    expect(near.length).toBe(6);
    // Every pair is used at least once in Challenge; Story has none, so the first puzzle is the plainest.
    for (const [a, b] of NEAR_ALIKE) expect(near.some((x) => nearAlike(p.copies[x.copy]![x.place]!, page[x.place]!) && [a, b].includes(page[x.place]! as never)), `${a}/${b}`).toBe(true);
    const sp = collatePuzzle("story");
    expect(slipsOf(sp).filter((x) => nearAlike(sp.copies[x.copy]![x.place]!, sp.copies[0]![x.place]!))).toEqual([]);
    expect(nearAlike("drop", "ring")).toBe(true);
    expect(nearAlike("ring", "square")).toBe(false);
  });
});

describe("marking a slip", () => {
  it("stands on a slip, is refused and counted anywhere else, and says why: every copy agrees, it agrees with another copy, or it is her careful copy", () => {
    let s = fresh("explorer");
    // Copy 2, place 2 slipped (0-based copy 1, place 1).
    s = mark(s, 1, 1);
    expect([s.marks, s.wrong, s.last]).toEqual([[{ copy: 1, place: 1 }], 0, { type: "mark", copy: 1, place: 1 }]);
    // Copy 1 at place 2 agrees with copy 3: not a slip.
    s = mark(s, 0, 1);
    expect([s.marks.length, s.wrong, s.last]).toEqual([1, 1, { type: "refused", copy: 0, place: 1, why: "agrees" }]);
    // Place 1: every copy agrees.
    s = mark(s, 2, 0);
    expect([s.wrong, s.last]).toEqual([2, { type: "refused", copy: 2, place: 0, why: "same" }]);
    // In Story, her copy at a place where the two differ is the careful one.
    const st = mark(fresh("story"), 0, 2);
    expect([st.wrong, st.last]).toEqual([1, { type: "refused", copy: 0, place: 2, why: "hers" }]);
    expect(mark(fresh("story"), 1, 2).marks).toEqual([{ copy: 1, place: 2 }]);
  });
  it("changes nothing for a mark already made, or a copy or place that does not exist", () => {
    const s = mark(fresh("challenge"), 2, 1);
    expect(mark(s, 2, 1)).toBe(s);
    for (const [c, p] of [[-1, 1], [3, 1], [0, -1], [0, 20], [0.5, 1], [0, NaN]] as [number, number][]) expect(mark(s, c, p), `${c},${p}`).toBe(s);
  });
  it("takes a mark away, and only one that stands; the slip is still to find afterwards", () => {
    let s = mark(fresh("story"), 1, 5);
    expect(remaining(s)).toBe(3);
    expect(unmark(s, 1, 2)).toBe(s);
    s = unmark(s, 1, 5);
    expect([s.marks, s.last, remaining(s), s.wrong]).toEqual([[], { type: "unmark", copy: 1, place: 5 }, 4, 0]);
  });
  it.each(STYLES)("is done when every slip is marked, and then nothing changes, in %s", (style) => {
    let s = fresh(style);
    const all = markAll(s);
    s = play(s, all.slice(0, -1));
    expect([s.done, remaining(s)]).toEqual([false, 1]);
    s = play(s, all.slice(-1));
    expect([s.done, remaining(s), s.wrong]).toEqual([true, 0, 0]);
    expect(play(s, [{ type: "unmark", ...slipsOf(s.puzzle)[0]! }, { type: "mark", copy: 0, place: 0 }, { type: "flag", flag: "feather" }])).toBe(s);
  });
  it("keeps its marks in place order, whatever order they are made in", () => {
    const s = play(fresh("challenge"), [...markAll(fresh("challenge"))].reverse().slice(0, 3));
    expect(s.marks.map((m) => m.place)).toEqual([...s.marks.map((m) => m.place)].sort((a, b) => a - b));
  });
  it("says how many slips remain where the way of playing shows it: Story and Explorer, not Challenge", () => {
    expect(STYLES.map(showsRemaining)).toEqual([true, true, false]);
    expect(STYLES.map((s) => remaining(fresh(s)))).toEqual([4, 6, 8]);
  });
});

describe("the goals and the flags", () => {
  it("are the four every quest has: both questions, wrong marks within the slack (Story no count, Explorer 2, Challenge 1), the boy answered kindly, the feather", () => {
    expect(COLLATE_SLACK).toEqual({ story: null, explorer: 2, challenge: 1 });
    expect([...COLLATE_FLAGS]).toEqual(["askedWho", "askedBook", "kind", "feather", "answered"]);
    let s = play(fresh("explorer"), [{ type: "flag", flag: "askedWho" }, { type: "flag", flag: "askedWho" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedWho"]);
    expect(collateGoals(s, 2)).toEqual({ turns: 0, slips: 0, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = play(s, [{ type: "flag", flag: "askedBook" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }, { type: "mark", copy: 0, place: 0 }, { type: "mark", copy: 0, place: 0 }]);
    s = play(s, markAll(s));
    expect(s.done).toBe(true);
    expect(collateGoals(s, COLLATE_SLACK.explorer)).toEqual({ turns: 8, slips: 2, curiosity: true, ingenuity: true, kindness: true, feather: true });
    const c = play(fresh("challenge"), [{ type: "mark", copy: 0, place: 0 }, { type: "mark", copy: 1, place: 0 }]);
    expect(collateGoals(play(c, markAll(c)), COLLATE_SLACK.challenge).ingenuity).toBe(false);
    expect(collateGoals(play(fresh("story"), [{ type: "mark", copy: 0, place: 2 }, { type: "mark", copy: 0, place: 3 }, { type: "mark", copy: 0, place: 5 }]), COLLATE_SLACK.story).ingenuity).toBe(true);
  });
  it("does not count a blunt answer as kindness", () => {
    const blunt = play(fresh("story"), [{ type: "flag", flag: "answered" }]);
    expect(collateGoals(blunt, null).kindness).toBe(false);
    expect(collateGoals(play(blunt, [{ type: "flag", flag: "kind" }]), null).kindness).toBe(true);
  });
});

describe("the copies kept in the middle", () => {
  const started = (style: CollateStyle) => play(fresh(style), [markAll(fresh(style))[0]!, { type: "mark", copy: 0, place: 0 }, { type: "flag", flag: "askedBook" }]);
  const snap = (style: CollateStyle) => JSON.parse(JSON.stringify(snapshotCollate(started(style)))) as Record<string, unknown>;
  const back = (x: unknown) => restoreCollate(x, collatePuzzle);
  it.each(STYLES)("comes back through JSON as it was, not done and with nothing said, in %s", (style) => {
    const s = started(style);
    const b = back(snap(style))!;
    expect(b).not.toBeNull();
    expect([b.style, b.marks, b.wrong, b.flags, b.last, b.done]).toEqual([style, s.marks, 1, ["askedBook"], null, false]);
    expect(play(b, markAll(b)).done).toBe(true);
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }]) expect(back(bad)).toBeNull();
    // A mark on a place that is not a slip of that copy, on a place or copy that does not exist, a mark twice, or not a pair at all.
    for (const marks of [[{ copy: 0, place: 1 }], [{ copy: 0, place: 0 }], [{ copy: 3, place: 1 }], [{ copy: 1, place: 16 }], [{ copy: 1, place: 1 }, { copy: 1, place: 1 }], [[1, 1]], [{ copy: "1", place: 1 }], [null], "x"]) expect(back({ ...good, marks }), JSON.stringify(marks)).toBeNull();
    // A Story slip is in the other copy: the same place on her copy is refused.
    expect(back({ ...snap("story"), marks: [{ copy: 0, place: 2 }] })).toBeNull();
    // Every slip marked would be a finished puzzle: never restored as done.
    expect(back({ ...good, marks: slipsOf(collatePuzzle("explorer")) })).toBeNull();
    for (const wrong of [-1, 1.5, "3", null, NaN, 1e9]) expect(back({ ...good, wrong }), String(wrong)).toBeNull();
    expect(back({ ...good, flags: "feather" })).toBeNull();
    // Unknown flags are dropped; marks come back in place order.
    const odd = back({ ...good, flags: ["feather", "askedStory", 7, "askedWho"], marks: [{ copy: 2, place: 7 }, { copy: 1, place: 1 }] })!;
    expect([odd.flags, odd.marks]).toEqual([["askedWho", "feather"], [{ copy: 1, place: 1 }, { copy: 2, place: 7 }]]);
    // Nothing marked yet is a puzzle to go on with.
    expect(back({ ...good, marks: [], wrong: 0, flags: [] })).not.toBeNull();
  });
});

describe("the picture of the copies", () => {
  const sizes: [number, number][] = [[2, 12], [3, 16], [3, 20]];
  it("finds every sign under its own middle, both ways round, and place 1 is on the left, or on the right when the page reads right to left", () => {
    for (const [copies, n] of sizes) {
      for (let copy = 0; copy < copies; copy++) {
        for (let place = 0; place < n; place++) {
          for (const rtl of [false, true]) {
            const c = cellCentre(copy, place, copies, n, rtl);
            expect(collateHit(c.x, c.y, copies, n, rtl), `${copies}x${n} ${rtl} ${copy},${place}`).toEqual({ copy, place });
          }
          // A page of the other direction is the mirror image: the same place lies at the mirrored point.
          const c = cellCentre(copy, place, copies, n, false);
          expect(collateHit(COLLATE_ART.w - c.x, c.y, copies, n, true)).toEqual({ copy, place });
          expect(cellCentre(copy, place, copies, n, true).x).toBeCloseTo(COLLATE_ART.w - c.x, 6);
        }
      }
      expect(cellCentre(0, 0, copies, n, false).x).toBeLessThan(cellCentre(0, n - 1, copies, n, false).x);
      expect(cellCentre(0, 0, copies, n, true).x).toBeGreaterThan(cellCentre(0, n - 1, copies, n, true).x);
      expect(cellCentre(0, 0, copies, n, true).x).toBeGreaterThan(COLLATE_ART.w / 2);
    }
  });
  it("finds nothing in the gaps between signs and rows, on the copies' marks, or outside the picture, and lays every cell inside the picture apart from the others", () => {
    for (const [copies, n] of sizes) {
      const { x0, pitch, y0, rowPitch } = collateLayout(copies, n);
      for (const rtl of [false, true]) {
        // Between two places, between two rows, on the mark at the start of a row.
        const between = rtl ? COLLATE_ART.w - (x0 + pitch) : x0 + pitch;
        expect(collateHit(between, y0 + rowPitch / 2, copies, n, rtl)).toBeNull();
        expect(collateHit(cellCentre(0, 0, copies, n, rtl).x, y0 + rowPitch, copies, n, rtl)).toBeNull();
        expect(collateHit(rtl ? COLLATE_ART.w - COLLATE_ART.margin - 30 : COLLATE_ART.margin + 30, y0 + rowPitch / 2, copies, n, rtl)).toBeNull();
      }
      for (const [x, y] of [[0, 0], [COLLATE_ART.w, COLLATE_ART.h], [-5, 100], [500, -5], [5000, 5000]] as [number, number][]) expect(collateHit(x, y, copies, n, false)).toBeNull();
      for (let copy = 0; copy < copies; copy++)
        for (let place = 0; place < n; place++)
          for (const rtl of [false, true]) {
            const r = cellRect(copy, place, copies, n, rtl);
            expect(r.x).toBeGreaterThanOrEqual(0);
            expect(r.y).toBeGreaterThanOrEqual(0);
            expect(r.x + r.w).toBeLessThanOrEqual(COLLATE_ART.w);
            expect(r.y + r.h).toBeLessThanOrEqual(COLLATE_ART.h);
            expect(r.w).toBeGreaterThan(30);
          }
    }
  });
  it("writes no text in the picture and draws every sign as a plain shape, the same way round on every page; a marked slip is a broken ring", () => {
    const art = readFileSync(here("art", "collate.ts"), "utf8");
    expect(art).not.toMatch(/fillText|strokeText|drawImage|font\s*=/);
    // The signs are never mirrored: only their places are laid out from the right.
    expect(art).not.toMatch(/scale\(-1/);
    for (const id of SIGNS) expect(art, id).toContain(`id === "${id}"`);
    expect(art).toMatch(/setLineDash\(\[7, 5\]\)/);
    expect(art).toContain("function seal(");
  });
});

describe("the page and the registry", () => {
  const app = readFileSync(here("ui", "app.ts"), "utf8");
  const ui = readFileSync(here("ui", "collate.ts"), "utf8");
  it("adds the quest through the registry of page quests: its subject, its trial line, what it keeps, how it is made, a button on the Atlas, and the test hook", () => {
    expect(app).toMatch(/\[COLLATE_QUEST\]: \{\s*subject: COLLATE_SUBJECT,\s*trial: "kr_trial",/);
    expect(app).toContain("restoreCollate(snap, collatePuzzle)");
    // The table of built quests is content/journey.ts's since the journey (27 November 2026).
    expect(readFileSync(here("content", "journey.ts"), "utf8")).toContain("[COLLATE_SUBJECT]: COLLATE_QUEST");
    // Since Karima al-Marwaziyya's room (27 November 2026) the hook opens the quest on its page, the way it is played without WebGL.
    expect(app).toContain("startCollate: () => openPage(COLLATE_QUEST, null, true)");
    expect(app).toMatch(/collate: \(\) => \{ const r = pageOf<CollateQuest>\(COLLATE_QUEST\)/);
    expect(app).toContain("collateCommand:");
  });
  it("is played by a table of real buttons, each labelled in words with its copy, place and sign and whether it is marked, with a polite live region, and no inline style", () => {
    expect(ui).toMatch(/h\("button", \{ type: "button", textContent: name/);
    expect(ui).toContain('t(marked ? "kr_cell_marked" : "kr_cell"');
    expect(ui).toContain('b.setAttribute("aria-pressed", String(marked))');
    expect(ui).toContain('ran.setAttribute("aria-live", "polite")');
    expect(ui).toContain('canvas.setAttribute("role", "img")');
    expect(ui).not.toMatch(/\.style\./);
    expect(table("en").kr_cell).toBe("Copy {c}, place {p}: {sign}");
    expect(table("en").kr_did_mark).toBe("Copy {c}, place {p} marked: it differs from the other copies.");
    expect(table("en").kr_did_agrees).toBe("Copy {c}, place {p} agrees with another copy: not a slip.");
  });
  it("builds the quest's id from the subject's quest code in the Atlas, in world 5, and links only to the record, which exists", () => {
    const atlas = JSON.parse(readFileSync(here("content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[] };
    const sub = atlas.subjects.find((s) => s.id === COLLATE_SUBJECT)!;
    expect(COLLATE_QUEST).toBe(`${sub.quest}-${COLLATE_SUBJECT}`);
    expect(COLLATE_QUEST).toBe("w05q3-karima-al-marwaziyya");
    expect(sub.world).toBe("books-schools-language");
    expect([...COLLATE_RECORDS]).toEqual(["person/karima-al-marwaziyya"]);
    expect(sub.records).toEqual([...COLLATE_RECORDS]);
    for (const id of COLLATE_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
});

describe("the record behind the lines", () => {
  it("rests each line on the record's own sentences, in English and in Arabic", () => {
    // [key, a phrase of the English record, a phrase of the Arabic record]
    const rests: [string, string, string][] = [
      ["kr_who_1", "was a woman hadith transmitter who lived as a neighbour of the sanctuary at Mecca", "المجاورة بمكة، محدثة"],
      ["kr_who_1", "she transmitted the Sahih on the authority of al-Kushmihani", "روت «الصحيح» عن الكشميهني"],
      ["kr_book_1", "she kept her book carefully and collated it against other copies", "كانت تضبط كتابها وتقابل بنسخها"],
      ["kr_book_1", "leading scholars read hadith with her", "الأئمة قرؤوا عليها"],
      ["kr_note_2", "leading scholars read hadith with her, among them al-Khatib", "ومنهم الخطيب"],
      ["kr_note_2", "She died at Mecca in 463 AH", "وتوفيت بمكة في سنة 463 هـ"],
    ];
    for (const [k, en, ar] of rests) {
      expect(table("en")[k], k).toBeTruthy();
      expect(record, `${k} en`).toContain(en);
      expect(recordAr, `${k} ar`).toContain(ar);
    }
    // The record does not say whose Sahih it is, and neither do the lines, in any language.
    expect(record).not.toMatch(/Bukhari/);
    for (const l of LANGS) for (const [k, v] of kr(l)) expect(v, `${l}:${k}`).not.toMatch(/Bukh|بخار|Buhar/i);
    // The names as the museum's Arabic record writes them.
    for (const name of ["كريمة", "المروزية", "الكشميهني", "الخطيب"]) expect(recordAr, name).toContain(name);
    expect(table("ar").kr_who_1).toContain("الكشميهني");
    expect(table("ar").kr_note_2).toContain("الخطيب");
    // The year is the record's, 463 of the Hijra, and no year of the Common Era is given.
    for (const l of LANGS) expect(table(l).kr_note_2, l).toContain("463");
  });
  it("writes al-Kushmihani and al-Khatib in each language as the museum's own page in that language does", () => {
    const NAMES: Record<string, [string, string]> = {
      ar: ["الكشميهني", "الخطيب"],
      en: ["al-Kushmihani", "al-Khatib"],
      ur: ["کشمیہنی", "خطیب"],
      fr: ["al-Kushmihani", "al-Khatib"],
      es: ["al-Kushmihani", "al-Khatib"],
      tr: ["el-Keşmihani", "el-Hatib"],
      id: ["al-Kashmihani", "al-Khatib"],
    };
    for (const l of LANGS) {
      const [kush, khatib] = NAMES[l]!;
      expect(table(l).kr_who_1, `${l} kushmihani`).toContain(kush);
      expect(table(l).kr_note_2, `${l} khatib`).toContain(khatib);
      expect(page(l), `${l} page kushmihani`).toContain(kush);
      expect(page(l), `${l} page khatib`).toContain(khatib);
    }
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["kr_intro_1", "صفحة الأطلس نُسخت أكثر من مرة، والنسخ لا تتفق في كل موضع!", "The page of the Atlas was copied more than once, and the copies do not agree everywhere!"],
    ["kr_intro_2", "قابِل النسخة بالنسخة، علامةً علامة. الخطأ الصغير يظهر لمن تأنّى.", "Compare copy with copy, sign by sign. A small slip shows itself to whoever takes their time."],
    ["kr_who_1", "يقول سجل المتحف إن كريمة المروزية كانت امرأة تروي الحديث، جاورت الحرم بمكة، وروت الصحيح عن الكشميهني.", "The museum's record says Karima al-Marwaziyya was a woman who transmitted hadith, lived as a neighbour of the sanctuary at Mecca, and transmitted the Sahih on the authority of al-Kushmihani."],
    ["kr_book_1", "ويقول إنها كانت تضبط كتابها وتقابله بالنسخ الأخرى، وإن كبار العلماء قرأوا عليها الحديث.", "It says she kept her book carefully and checked it against other copies, and that leading scholars read hadith with her."],
    ["kr_note_1", "هذه لعبة وليست كتاب تاريخ. النسخ والعلامات المرسومة فيها والصبيّ الذي يحمل النسخ وكل كلمة تُقال من خيال اللعب.", "This is a game, not a history. The copies, the signs drawn in them, the boy who carries the copies and every spoken line are invented for play."],
    ["kr_note_2", "من سجل المتحف: كانت كريمة المروزية تضبط كتابها وتقابله بالنسخ الأخرى. وقرأ عليها الحديث علماء كبار، منهم الخطيب. وتوفيت بمكة سنة 463 للهجرة.", "From the museum's record: Karima al-Marwaziyya kept her book carefully and checked it against other copies. Leading scholars read hadith with her, among them al-Khatib. She died at Mecca in 463 of the Hijra."],
    ["kr_note_3", "بُسِّط من أجل اللعب: في اللعبة علامات مرسومة بدل الكلمات، ولا يظهر فيها شيء من نصّ أي حديث. وقاعدة اللعبة أن ما اتفقت عليه نسختان هو الصواب، وهي قاعدة من وضع اللعبة، وليست طريقة المحدّثين في مقابلة كتبهم.", "Made simpler for play: the game uses drawn signs in place of words, and shows nothing of the text of any hadith. Its rule, that what two copies agree on is right, is the game's own, and is not how scholars of hadith collated their books."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' words and the record's name", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    const en = table("en");
    const ar = table("ar");
    expect([en.kr_who_karima, ar.kr_who_karima]).toEqual(["Karima, in imagined words", "كريمة، بكلمات متخيَّلة"]);
    expect([en.kr_who_boy, ar.kr_who_boy]).toEqual(["The boy who carries the copies, an invented person", "الصبيّ حامل النسخ، شخصية من الخيال"]);
    expect(en.kr_rec_person).toBe("Karima al-Marwaziyya");
    // Three notes and no fourth.
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("kr_note_")), l).toEqual(["kr_note_1", "kr_note_2", "kr_note_3"]);
  });
  it("shows no religious text: the words for hadith, Sahih, Qur'an and verse appear in no string of the quest but the narrator's two answers and the second and third notes, nor in any string of Karima's room but its note, in any of the seven languages", () => {
    const NAMED = new Set(["kr_who_1", "kr_book_1", "kr_note_2", "kr_note_3"]);
    // Whole words (or the start of words) in the Latin-script languages; the letters themselves in Arabic and Urdu, so
    // that a word joined to a conjunction or an article is caught too.
    const BANNED: Record<string, RegExp> = {
      en: /\b(hadiths?|sahih|qur'?ans?|korans?|verses?)\b/i,
      fr: /\b(hadiths?|sahih|corans?|versets?)\b/i,
      es: /\b(hadiz|hadices|hadith|sahih|cor[aá]n|vers[ií]culos?|versos?)\b/i,
      tr: /(^|[^\p{L}])(hadis\p{L}*|sahih\p{L}*|kur'?an\p{L}*|ayet\p{L}*)/iu,
      id: /\b(hadis|hadits|sahih|al-?qur'?an|quran|ayat)\b/i,
      ar: /حديث|صحيح|قرآن|القران|آية|آيات/,
      ur: /حدیث|حديث|صحیح|صحيح|قرآن|آیت|آیات/,
    };
    let named = 0;
    for (const l of LANGS) {
      for (const [k, v] of kr(l)) {
        if (NAMED.has(k)) {
          if (BANNED[l]!.test(v)) named++;
          continue;
        }
        expect(BANNED[l]!.test(v), `${l}:${k}: ${v}`).toBe(false);
      }
    }
    // The named lines do carry the word, in every language: the test would see it if it strayed.
    expect(named).toBe(LANGS.length * 4);
    // Karima's room keeps the rule: of its strings only its note (krr_note_room), which says that the game shows nothing of
    // the text of any hadith, may carry one of these words, and it does, in every language.
    let roomNote = 0;
    for (const l of LANGS) {
      expect(krr(l).length, l).toBeGreaterThan(0);
      for (const [k, v] of krr(l)) {
        if (k === "krr_note_room") {
          if (BANNED[l]!.test(v)) roomNote++;
          continue;
        }
        expect(BANNED[l]!.test(v), `${l}:${k}: ${v}`).toBe(false);
      }
      expect(krr(l).map(([, v]) => v).join(" "), l).not.toMatch(/[﴿﴾«»“”]|passage\//);
    }
    expect(roomNote).toBe(LANGS.length);
    // And no ﴿ ﴾, no Qur'anic passage link, no quotation marks round any text in any string of the quest.
    for (const l of LANGS) for (const [k, v] of kr(l)) expect(v, `${l}:${k}`).not.toMatch(/[﴿﴾«»“”]|passage\//);
  });
  it("never calls an invented character the Messenger, in any language", () => {
    for (const l of LANGS) for (const [k, v] of kr(l)) expect(v, `${l}:${k}`).not.toMatch(/الرسول|رسول/);
  });
  it("writes no digit in any string of the quest outside a placeholder, except the year 463", () => {
    for (const l of LANGS) for (const [k, v] of kr(l)) for (const d of v.replace(/\{\w+\}/g, "").match(/[0-9٠-٩۰-۹]+/g) ?? []) expect(d, `${l}:${k}`).toBe("463");
    expect(LANGS.flatMap((l) => kr(l).filter(([, v]) => v.includes("463")).map(([k]) => k))).toEqual(LANGS.map(() => "kr_note_2"));
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of kr(l)) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of kr(l)) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|رضی اللہ/);
  });
  it("has every key the page uses, in all seven languages, with no part left empty, the same placeholders, and no key that nothing uses", () => {
    const ui = readFileSync(here("ui", "collate.ts"), "utf8");
    const keys = new Set([...ui.matchAll(/"(kr_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const id of SIGNS) keys.add(`kr_sign_${id.replace(/-/g, "_")}`);
    for (const who of ["hudhud", "karima", "boy", "narrator"]) keys.add(`kr_who_${who}`);
    expect(keys.size).toBe(66);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("kr_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("kr_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("kr_")));
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("names every sign differently from the others, in every language, and the near-alike pairs apart", () => {
    for (const l of LANGS) {
      const t = table(l);
      expect(new Set(SIGNS.map((id) => t[`kr_sign_${id.replace(/-/g, "_")}`])).size, l).toBe(SIGNS.length);
    }
  });
  it("is appended at the end of each language's file, after the keys of the twelfth quest, and only the journey's keys (`jn_`) and al-Jazari's room's (`jr_`), then al-Tusi's room's (`tsr_`), then al-Khwarizmi's room's (`akr_`), then al-Kindi's room's (`kdr_`), then al-Idrisi's hall's (`isr_`), then al-Razi's study's (`rzr_`), then Karima's room's (`krr_`), then Ibn Battuta's inn's (`ibr_`), then the coffee room's (`cqr_`), then al-Jahiz's room's (`jzr_`) come after it", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("kr_"));
      expect(first, l).toBeGreaterThan(0);
      const count = ks.filter((k) => k.startsWith("kr_")).length;
      expect(ks.slice(first, first + count).every((k) => k.startsWith("kr_")), l).toBe(true);
      expect(ks.slice(first + count).every((k) => k.startsWith("jn_") || k.startsWith("jr_") || k.startsWith("tsr_") || k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_")), l).toBe(true);
      expect(ks[first - 1]!.startsWith("rz_"), l).toBe(true);
    }
  });
  it("says in the hub that thirteen quests are built, in every language, and no longer twelve", () => {
    expect(table("en").hub_note).toMatch(/Thirteen quests are built/);
    expect(table("ar").hub_note).toContain("ثلاث عشرة مهمة");
    expect(table("ur").hub_note).toContain("تیرہ مہمیں");
    expect(table("fr").hub_note).toContain("Treize quêtes");
    expect(table("es").hub_note).toContain("trece misiones");
    expect(table("tr").hub_note).toContain("on üç görev");
    expect(table("id").hub_note).toContain("tiga belas misi");
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bTwelve quests|\bDouze quêtes|\bdoce misiones|\bon iki görev|\bdua belas misi|اثنتا عشرة مهمة|بارہ مہمیں/i);
  });
  it("takes Karima's name from the Atlas heading in every language, and differs from the museum's labels only where this list says", () => {
    const label = (parse(readFileSync(resolve(root, "data", "person", "karima-al-marwaziyya.yaml"), "utf8")) as { label: Record<string, string | undefined> }).label;
    const found: Record<string, string> = {};
    for (const l of LANGS) {
      const heading = atlasTable(l).s_karima_al_marwaziyya!;
      expect(table(l).kr_rec_person, l).toBe(heading);
      expect(table(l).kr_who_1, l).toContain(heading);
      expect(table(l).kr_note_2, l).toContain(heading);
      // Her short name, at the head of her speaker's label and in the first question, is the first word of the heading.
      const short = table(l).kr_who_karima!.split(/[,،]/)[0]!;
      expect(heading.startsWith(short), l).toBe(true);
      expect(table(l).kr_ask_who, l).toContain(short);
      if (heading !== label[l]) found[l] = `${label[l] ?? "no label"} -> ${heading}`;
    }
    // Urdu: the label writes an alif the Atlas heading and the museum's Urdu page do not (the page has «مروزیہ»). Turkish
    // and Indonesian: the record has no label in either language; the Atlas headings are the game's.
    expect(found).toEqual({ ur: "کریمہ المروازیہ -> کریمہ المروزیہ", tr: "no label -> Kerime el-Mervaziyye", id: "no label -> Karimah al-Marwaziyah" });
    expect(page("ur")).toContain("مروزیہ");
  });
});
