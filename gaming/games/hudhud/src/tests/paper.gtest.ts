// The paper of Samarkand: a papermaker's steps in a row. Each way of playing has one answer, which is the order of the
// museum record's own recipe (written again here by hand, with the record's phrase beside each step), a known fewest
// number of moves and four goals; the rules shared with the elephant clock are covered for both quests; a saved place
// is proved, not trusted; the picture's hit-test works both ways round; and the words, in all seven languages, keep the
// lines written for the quest exactly.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAPER_PARTS, PAPER_QUEST, PAPER_RECORDS, PAPER_SLACK, PAPER_STATES, PAPER_SUBJECT, paperPuzzle } from "../content/paper";
import { clockPuzzle } from "../content/clock";
import { PAPER_ART, boxWidth, paperHit, placeRect, placeX } from "../art/paper";
import { run, solutions, spare, type ChainPuzzle } from "../sim/chain";
import { chainRules, fewest, put } from "../sim/chainquest";
import { applyClock, newClock } from "../sim/clock";
import { PAPER_FLAGS, applyPaper, newPaper, paperGoals, restorePaper, snapshotPaper, type PaperCommand, type PaperState, type PaperStyle } from "../sim/paper";

const STYLES: PaperStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const atlasTable = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
const play = (s: PaperState, cs: PaperCommand[]) => cs.reduce(applyPaper, s);

// What the record says the work is, written down again here and not read from the content file. The record
// (invention/paper-mill-samarkand): "rotten linen, flax or hemp rags cut small, cleaned, bleached and pounded in mortars,
// stampers or paper-mills, then dressed with wheat-starch size and drawn through a deckle", and "Rag fibres are separated
// in water and pounded to pulp, dressed with starch, lifted on a deckle and shaken until the fibres interlace; the sheet
// is laid flat, dried on a wall, rubbed with flour-and-starch and polished smooth".
const EXPECTED: Record<PaperStyle, string[]> = {
  story: [
    "cut", //          "rags cut small"
    "clean-bleach", // "cleaned, bleached" (one sentence of the record)
    "pound", //        "pounded ... to pulp"
    "size-lift", //    "dressed with starch, lifted on a deckle and shaken until the fibres interlace"
    "dry-polish", //   "the sheet is laid flat, dried on a wall, rubbed ... and polished smooth"
  ],
  explorer: [
    "cut", //          "cut small"
    "clean-bleach", // "cleaned, bleached"
    "pound", //        "pounded ... to pulp"
    "size", //         "dressed with wheat-starch size"
    "lift", //         "lifted on a deckle and shaken until the fibres interlace"
    "dry", //          "laid flat, dried on a wall"
    "polish", //       "rubbed with flour-and-starch and polished smooth"
  ],
  challenge: [
    "cut", //          "cut small"
    "clean", //        "cleaned"
    "bleach", //       "bleached"
    "pound", //        "pounded ... to pulp"
    "size", //         "dressed with wheat-starch size"
    "lift", //         "lifted on a deckle and shaken until the fibres interlace"
    "dry", //          "laid flat, dried on a wall"
    "polish", //       "rubbed with flour-and-starch and polished smooth"
  ],
};
/** The moves that put the row in order, place by place. */
const fix = (s: PaperState): PaperCommand[] => {
  const out: PaperCommand[] = [];
  let p = s.puzzle;
  EXPECTED[s.style].forEach((part, place) => {
    if (p.places[place] === part) return;
    out.push({ type: "put", place, part });
    p = put(p, place, part);
  });
  return out;
};
const wrongAtStart = (style: PaperStyle) => paperPuzzle(style).places.filter((id, i) => id !== EXPECTED[style][i]).length;

describe("the paper of Samarkand", () => {
  it.each(STYLES)("starts not working and has one answer only, the record's order, in %s", (style) => {
    const p = paperPuzzle(style);
    expect(run(p).end).not.toBe("done");
    expect(solutions(p)).toEqual([EXPECTED[style]]);
    expect(p.places.length).toBe(EXPECTED[style].length);
  });
  it("has five, seven and eight places, with no spare and no decoy card: every card is a step of the recipe", () => {
    expect(STYLES.map((s) => paperPuzzle(s).places.length)).toEqual([5, 7, 8]);
    for (const style of STYLES) {
      const p = paperPuzzle(style);
      expect(spare(p), style).toEqual([]);
      expect([...p.parts.map((x) => x.id)].sort(), style).toEqual([...EXPECTED[style]].sort());
      expect(p.places.includes(null as never)).toBe(false);
    }
  });
  it("is deeper in each way of playing: 2 moves with two pairs changed over, then 3 with five of seven places wrong, then 5 with every place wrong", () => {
    const of = (style: PaperStyle) => ({ par: fewest(paperPuzzle(style)), wrong: wrongAtStart(style) });
    expect(of("story")).toEqual({ par: 2, wrong: 4 });
    expect(of("explorer")).toEqual({ par: 3, wrong: 5 });
    expect(of("challenge")).toEqual({ par: 5, wrong: 8 });
    expect(wrongAtStart("explorer")).toBeGreaterThanOrEqual(5);
    expect(wrongAtStart("challenge")).toBe(paperPuzzle("challenge").places.length);
    expect(PAPER_SLACK).toEqual({ story: null, explorer: 2, challenge: 0 });
    // Two pairs exchanged at the start of Story: undoing two exchanges of the right order gives the right order.
    const story = paperPuzzle("story").places;
    const swapped = EXPECTED.story.map((id, i) => (i === 0 ? EXPECTED.story[1] : i === 1 ? EXPECTED.story[0] : i === 3 ? EXPECTED.story[4] : i === 4 ? EXPECTED.story[3] : id));
    expect(story).toEqual(swapped);
  });
  it("joins steps only where the record's own sentence joins them: three joined cards, each taking what its first step takes and giving what its last gives", () => {
    const by = Object.fromEntries(PAPER_PARTS.map((p) => [p.id, p]));
    expect([by["clean-bleach"]!.takes, by["clean-bleach"]!.gives]).toEqual([by.clean!.takes, by.bleach!.gives]);
    expect([by["size-lift"]!.takes, by["size-lift"]!.gives]).toEqual([by.size!.takes, by.lift!.gives]);
    expect([by["dry-polish"]!.takes, by["dry-polish"]!.gives]).toEqual([by.dry!.takes, by.polish!.gives]);
    expect(PAPER_PARTS.length).toBe(11);
    // The states between the steps, in order, from the rags to the goal.
    expect([...PAPER_STATES]).toEqual(["rags", "pieces", "clean", "white", "pulp", "sized", "wet-sheet", "dry-sheet", "paper"]);
    const single = EXPECTED.challenge.map((id) => by[id]!);
    expect(single[0]!.takes).toBe("rags");
    expect(single.map((p) => p.gives)).toEqual(PAPER_STATES.slice(1));
    single.slice(1).forEach((p, i) => expect(p.takes).toBe(single[i]!.gives));
  });
  it("lets only the record's order work, and says in a failed run that the work stops, never that a place is empty or the end is wrong, over every order of the cards", () => {
    for (const style of STYLES) {
      const base = paperPuzzle(style);
      const ids = base.places as string[];
      const seen = { done: 0, idle: 0, other: 0 };
      const go = (rest: string[], row: string[]) => {
        if (rest.length === 0) {
          const r = run({ ...base, places: row });
          if (r.end === "done") {
            seen.done++;
            expect(row, style).toEqual(EXPECTED[style]);
          } else if (r.end === "idle") {
            seen.idle++;
            // It stops at the first place whose card does not take what reached it, and says what reached it.
            expect(r.moved.length).toBe(r.at);
            expect(row[r.at]).not.toBe(EXPECTED[style][r.at]);
          } else seen.other++;
          return;
        }
        for (let i = 0; i < rest.length; i++) go([...rest.slice(0, i), ...rest.slice(i + 1)], [...row, rest[i]!]);
      };
      go(ids, []);
      expect(seen.done, style).toBe(1);
      expect(seen.other, style).toBe(0);
    }
  });
  it.each(STYLES)("can be finished in the fewest moves, and then nothing more changes, in %s", (style) => {
    let s = newPaper(style, paperPuzzle(style));
    s = play(s, [{ type: "go" }]);
    expect([s.done, s.runs, s.last?.end]).toEqual([false, 1, "idle"]);
    s = play(s, fix(s));
    expect(s.last).toBeNull();
    s = play(s, [{ type: "go" }]);
    expect(s.done).toBe(true);
    expect(s.last!.moved.map((m) => m.part)).toEqual(EXPECTED[style]);
    expect(s.last!.moved.map((m) => m.gave).at(-1)).toBe("paper");
    expect(play(s, [{ type: "put", place: 0, part: "pound" }, { type: "go" }, { type: "flag", flag: "feather" }])).toBe(s);
    expect(s.moves).toBeLessThanOrEqual(s.par + 1);
  });
  it("reaches the fewest in every way of playing by exchanging exactly the cards that are wrong", () => {
    for (const style of STYLES) {
      const s0 = newPaper(style, paperPuzzle(style));
      // n places less the cycles of the arrangement is the fewest number of exchanges.
      const to = EXPECTED[style];
      const from = s0.puzzle.places as string[];
      const seen = new Set<number>();
      let cycles = 0;
      for (let i = 0; i < from.length; i++) {
        if (seen.has(i)) continue;
        cycles++;
        for (let j = i; !seen.has(j); j = to.indexOf(from[j]!)) seen.add(j);
      }
      expect(s0.par, style).toBe(from.length - cycles);
    }
  });
  it("says where a wrong row stops: the card that cannot take what reached it, and what reached it", () => {
    const s = play(newPaper("challenge", paperPuzzle("challenge")), [{ type: "go" }]);
    expect(s.last).toMatchObject({ end: "idle", at: 0, carrying: "rags" });
    expect(s.last!.moved).toEqual([]);
    const e = play(newPaper("explorer", paperPuzzle("explorer")), [{ type: "go" }]);
    expect(e.last).toMatchObject({ end: "idle", at: 0, carrying: "rags" });
    const st = play(newPaper("story", paperPuzzle("story")), [{ type: "put", place: 0, part: "cut" }, { type: "go" }]);
    // [cut, clean-bleach, pound] work; the fourth place holds the drying card, and what reaches it is pulp.
    expect(st.last).toMatchObject({ end: "idle", at: 3, carrying: "pulp" });
    expect(st.last!.moved.map((m) => m.part)).toEqual(["cut", "clean-bleach", "pound"]);
  });
  it("counts only moves that change something, and gives its four goals as every quest does", () => {
    let s = newPaper("explorer", paperPuzzle("explorer"));
    s = play(s, [{ type: "put", place: 3, part: "size" }, { type: "put", place: 99, part: "size" }, { type: "put", place: 1, part: "nobody" }, { type: "put", place: 1, part: "pound" }]);
    expect(s.moves).toBe(0);
    s = play(s, [{ type: "flag", flag: "askedStory" }, { type: "flag", flag: "askedStory" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedStory"]);
    expect(paperGoals(s, 2)).toEqual({ turns: 0, par: 3, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = play(s, [{ type: "flag", flag: "askedHow" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
    // Exchange two places four times (back where they were), then put the row right: more than two moves over the fewest.
    const there = s.puzzle.places;
    for (const [a, b] of [[0, 1], [0, 1], [0, 1], [0, 1]]) s = play(s, [{ type: "put", place: a!, part: s.puzzle.places[b!]! }]);
    expect(s.puzzle.places).toEqual(there);
    expect(s.moves).toBe(4);
    s = play(s, [...fix(s), { type: "go" }]);
    expect(s.done).toBe(true);
    expect(paperGoals(s, PAPER_SLACK.explorer)).toMatchObject({ curiosity: true, ingenuity: false, kindness: true, feather: true });
    expect(paperGoals(s, PAPER_SLACK.story).ingenuity).toBe(true);
    expect(paperGoals(s, null).ingenuity).toBe(true);
  });
  it("does not count a blunt answer as kindness, and a kind answer carries `kind` and `answered`", () => {
    const blunt = play(newPaper("story", paperPuzzle("story")), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(paperGoals(blunt, null).kindness).toBe(false);
    const kind = play(blunt, [{ type: "flag", flag: "kind" }]);
    expect(paperGoals(kind, null).kindness).toBe(true);
    expect([...PAPER_FLAGS]).toEqual(["askedStory", "askedHow", "kind", "feather", "answered"]);
  });
});

describe("the rules the paper shares with the elephant clock", () => {
  it("are one module: neither quest has rules of its own for a count of moves, the fewest, the goals or a saved place", () => {
    const sim = (f: string) => readFileSync(resolve(__dirname, "..", "sim", f), "utf8");
    for (const f of ["paper.ts", "clock.ts"]) {
      const src = sim(f);
      expect(src, f).toMatch(/from "\.\/chainquest"/);
      expect(src, f).not.toMatch(/function (fewest|put|restore|applyClock|applyPaper)\b/);
      expect(src, f).not.toMatch(/runChain|swap\(|stand\(/);
    }
  });
  it("give the same fewest for the same row, whichever quest it belongs to", () => {
    const p: ChainPuzzle = { start: "a", goal: "d", places: ["y", "x", "z"], parts: [{ id: "x", takes: "a", gives: "b" }, { id: "y", takes: "b", gives: "c" }, { id: "z", takes: "c", gives: "d" }] };
    expect(fewest(p)).toBe(1);
    expect(fewest({ ...p, places: ["x", "y", "z"] })).toBe(0);
    // A row with a part left out of the places can be mended by standing the spare part in.
    expect(fewest({ ...p, places: ["x", "y", null as never] })).toBe(1);
    expect(fewest({ ...p, parts: p.parts.slice(0, 2) })).toBeNull();
  });
  it("work for any list of flags and any row: a made-up quest gets the same counting, goals and refusing", () => {
    const flags = ["one", "two", "kind", "feather", "answered"] as const;
    const toy = chainRules("a toy", flags, ["one", "two"]);
    const puzzle: ChainPuzzle = { start: "a", goal: "c", places: ["q", "p"], parts: [{ id: "p", takes: "a", gives: "b" }, { id: "q", takes: "b", gives: "c" }] };
    let s = toy.newState("explorer", puzzle);
    expect(s.par).toBe(1);
    s = toy.apply(s, { type: "flag", flag: "one" });
    s = toy.apply(s, { type: "flag", flag: "nope" as never });
    expect(s.flags).toEqual(["one"]);
    expect(toy.goals(s, 0).curiosity).toBe(false);
    s = toy.apply(toy.apply(s, { type: "flag", flag: "two" }), { type: "put", place: 0, part: "p" });
    expect([s.moves, s.puzzle.places]).toEqual([1, ["p", "q"]]);
    s = toy.apply(s, { type: "go" });
    expect(s.done).toBe(true);
    expect(toy.goals(s, 0)).toMatchObject({ curiosity: true, ingenuity: true });
    const snap = JSON.parse(JSON.stringify(toy.snapshot(toy.newState("explorer", puzzle))));
    expect(toy.restore(snap, () => puzzle)).not.toBeNull();
    expect(toy.restore({ ...snap, places: ["p", "p"] }, () => puzzle)).toBeNull();
    expect(() => toy.newState("story", { ...puzzle, places: ["p", "q"] })).toThrow(/already works/);
    expect(() => toy.newState("story", { ...puzzle, parts: [puzzle.parts[0]!] })).toThrow(/cannot be made to work/);
  });
  it("keep the clock's own flags apart from the paper's: a clock flag means nothing to the paper, and the other way round", () => {
    const c = applyClock(newClock("story", clockPuzzle("story")), { type: "flag", flag: "askedStory" as never });
    expect(c.flags).toEqual([]);
    const p = applyPaper(newPaper("story", paperPuzzle("story")), { type: "flag", flag: "askedFloat" as never });
    expect(p.flags).toEqual([]);
  });
});

describe("the paper kept in the middle", () => {
  const through = (s: PaperState) => restorePaper(JSON.parse(JSON.stringify(snapshotPaper(s))), paperPuzzle);
  const started = (style: PaperStyle) => play(newPaper(style, paperPuzzle(style)), [{ type: "put", place: 0, part: "cut" }, { type: "flag", flag: "feather" }]);
  const snap = (style: PaperStyle) => JSON.parse(JSON.stringify(snapshotPaper(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restorePaper(x, paperPuzzle);
  it.each(STYLES)("comes back through JSON as it was, with no run shown and not done, in %s", (style) => {
    const s = started(style);
    const back = through(s)!;
    expect(back).not.toBeNull();
    expect(back.puzzle.places).toEqual(s.puzzle.places);
    expect([back.style, back.moves, back.flags, back.par, back.last, back.runs, back.done]).toEqual([style, s.moves, s.flags, s.par, null, 0, false]);
    expect(back.puzzle.parts).toEqual(paperPuzzle(style).parts);
    expect(play(back, [...fix(back), { type: "go" }]).done).toBe(true);
  });
  it("keeps a paper with nothing changed too", () => {
    for (const style of STYLES) expect(restorePaper(snapshotPaper(newPaper(style, paperPuzzle(style))), paperPuzzle)).not.toBeNull();
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    expect(refused(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    const row = EXPECTED.explorer;
    expect(refused({ ...good, places: [row[0], "nobody", ...row.slice(2)] })).toBeNull();
    expect(refused({ ...good, places: [row[0], row[0], ...row.slice(2)] })).toBeNull();
    expect(refused({ ...good, places: [row[0], 2, ...row.slice(2)] })).toBeNull();
    // A card of another way of playing's row: Challenge's `clean` is not a card of Explorer.
    expect(refused({ ...good, places: [row[0], "clean", ...row.slice(2)] })).toBeNull();
    expect(refused({ ...snap("story"), places: ["cut", "clean", "bleach", "pound", "size"] })).toBeNull();
    // Length, and not a list.
    expect(refused({ ...good, places: row.slice(1) })).toBeNull();
    expect(refused({ ...good, places: [...row, "cut"] })).toBeNull();
    expect(refused({ ...good, places: "cut" })).toBeNull();
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9]) expect(refused({ ...good, moves })).toBeNull();
    expect(refused({ ...good, moves: undefined })).toBeNull();
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    // A row that works in fewer moves than the fewest there are cannot be true.
    expect(refused({ ...good, places: row, moves: 0 })).toBeNull();
    expect(refused({ ...snap("story"), places: EXPECTED.story, moves: 1 })).toBeNull();
    // Put right but not yet set going, it comes back as it was left, and one press finishes it.
    const ready = refused({ ...snap("story"), places: EXPECTED.story, moves: 2 })!;
    expect([ready.done, ready.moves, ready.last]).toEqual([false, 2, null]);
    expect(applyPaper(ready, { type: "go" }).done).toBe(true);
  });
  it("drops flags it does not know, keeps the ones it does, and works the fewest moves out again", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedHow", "nonsense", 7, "kind", "kind", "askedFloat"], par: 99, runs: 5, done: true, last: { end: "done" } })!;
    expect(back.flags).toEqual(["askedHow", "kind", "feather"]);
    expect([back.par, back.runs, back.done, back.last]).toEqual([3, 0, false, null]);
    expect(back.par).toBe(fewest(paperPuzzle("explorer")));
  });
  it("accepts a snapshot with the flag `answered` missing, as one kept before it existed would be", () => {
    const back = refused({ style: "story", places: [...paperPuzzle("story").places], moves: 1, flags: ["askedHow", "kind"] })!;
    expect(back.flags).toEqual(["askedHow", "kind"]);
  });
});

describe("the picture of the row can be played by touch", () => {
  const centre = (n: number, i: number, rtl: boolean) => ({ x: placeX(n, i, rtl), y: PAPER_ART.y });
  it.each([5, 7, 8])("finds the place under a point, and nothing between places or outside, in a row of %i places on a page that reads left to right", (n) => {
    for (let i = 0; i < n; i++) {
      const c = centre(n, i, false);
      expect(paperHit(c.x, c.y, n, false)).toBe(i);
      const r = placeRect(n, i, false);
      expect(paperHit(r.x + 1, r.y + 1, n, false)).toBe(i);
      expect(paperHit(r.x + r.w - 1, r.y + r.h - 1, n, false)).toBe(i);
      expect(paperHit(r.x - 1, c.y, n, false)).not.toBe(i);
      expect(paperHit(c.x, r.y - 2, n, false)).toBeNull();
      expect(paperHit(c.x, r.y + r.h + 2, n, false)).toBeNull();
    }
    const gap = (placeRect(n, 0, false).x + placeRect(n, 0, false).w + placeRect(n, 1, false).x) / 2;
    expect(paperHit(gap, PAPER_ART.y, n, false)).toBeNull();
    for (const [x, y] of [[0, 0], [PAPER_ART.w, PAPER_ART.h], [-5, 10], [5000, 5000]] as [number, number][]) expect(paperHit(x, y, n, false)).toBeNull();
    expect(boxWidth(n)).toBeLessThanOrEqual(PAPER_ART.boxMax);
  });
  it.each([5, 7, 8])("is the mirror image on a page that reads right to left: the first place is on the right, in a row of %i", (n) => {
    for (let i = 0; i < n; i++) {
      const ltr = centre(n, i, false);
      const rtl = centre(n, i, true);
      expect(rtl.x).toBeCloseTo(PAPER_ART.w - ltr.x, 9);
      expect(paperHit(rtl.x, rtl.y, n, true)).toBe(i);
      expect(paperHit(PAPER_ART.w - ltr.x, ltr.y, n, true)).toBe(i);
      // The same point is another place the other way round (except in the middle of an odd row).
      if (n % 2 === 0 || i !== (n - 1) / 2) expect(paperHit(ltr.x, ltr.y, n, true)).not.toBe(i);
    }
    expect(placeX(n, 0, true)).toBeGreaterThan(placeX(n, n - 1, true));
    expect(placeX(n, 0, false)).toBeLessThan(placeX(n, n - 1, false));
  });
  it("keeps every box inside the picture and apart from the next", () => {
    for (const n of [5, 7, 8]) for (const rtl of [false, true]) {
      const rs = Array.from({ length: n }, (_, i) => placeRect(n, i, rtl));
      for (const r of rs) expect(r.x).toBeGreaterThanOrEqual(0), expect(r.x + r.w).toBeLessThanOrEqual(PAPER_ART.w);
      const xs = rs.map((r) => r.x).sort((a, b) => a - b);
      xs.slice(1).forEach((x, i) => expect(x - xs[i]!).toBeGreaterThan(boxWidth(n)));
    }
  });
});

describe("the words and the records", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["pp_intro_1", "صفحة الأطلس ابتلّت في العاصفة وتمزّقت. نحتاج إلى ورقة جديدة!", "The page of the Atlas was soaked in the storm and torn. We need a new sheet!"],
    ["pp_intro_2", "الورق يُصنع خطوةً خطوة، ولكل خطوة مكانها. لكن بطاقات الخطوات اختلطت.", "Paper is made step by step, and each step has its place. But the cards of the steps are mixed up."],
    ["pp_story_1", "يقول سجل المتحف إن خبرًا قديمًا يروي أن صنّاعًا صينيين أُسروا في معركة قرب نهر طلاس سنة 751 علّموا أهل سمرقند صناعة الورق من الخِرَق البالية. ويقول السجل إن هذا خبر منقول، لا بداية مثبتة.", "The museum's record says an old report tells that Chinese craftsmen captured in a battle near the Talas river in 751 taught the people of Samarkand to make paper from worn-out rags. The record calls this a report handed down, not a proved beginning."],
    ["pp_how_1", "ويذكر السجل طريقة الصنع: تُقطَّع خِرَق الكتّان أو القنّب صغيرة، وتُنظَّف وتُبيَّض، ثم تُدَقّ في الماء حتى تصير عجينة، وتُعالَج بنشا القمح، ثم تُرفع على قالب وتُهَزّ حتى تتماسك أليافها. وتُبسط الورقة وتُجفَّف على جدار، ثم تُدلَك وتُصقَل.", "The record gives the way it was made: rags of linen or hemp are cut small, cleaned and bleached, then pounded in water to a pulp and dressed with wheat starch, then lifted on a mould and shaken until the fibres hold together. The sheet is laid flat and dried on a wall, then rubbed and polished smooth."],
    ["pp_note_1", "هذه لعبة وليست كتاب تاريخ. الورشة وصانع الورق والطفل الذي يساعده وبطاقات الخطوات وكل كلمة تُقال من خيال اللعب.", "This is a game, not a history. The workshop, the papermaker, the child who helps, the cards of the steps, and every spoken line, are invented for play."],
    ["pp_note_2", "من سجل المتحف: الصينيون هم من اخترعوا الورق. وكان دور العالم الإسلامي أن يتلقّى هذه الصناعة ويطوّعها وينشرها. ومن سمرقند انتقلت إلى بغداد، ثم إلى مصر ودمشق والمغرب وشاطبة في الأندلس وبلاد أخرى.", "From the museum's record: the Chinese invented paper. The part of the Islamic world was to receive the craft, adapt it and spread it. From Samarkand it moved to Baghdad, and on to Egypt, Damascus, the Maghrib, Jativa in Spain and other lands."],
    ["pp_note_3", "بُسِّط من أجل اللعب: تجعل اللعبة كل خطوة بطاقة في صف. ويذكر السجل للدقّ الهواوين والمداقّ ومطاحن الورق، وتُظهر اللعبة مدقّة واحدة.", "Made simpler for play: the game makes each step one card in a row. For the pounding the record names mortars, stampers and paper-mills; the game shows one mallet."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' labels and record names", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    expect(table("en").pp_who_maker).toBe("The papermaker, an invented person");
    expect(table("ar").pp_who_maker).toBe("صانع الورق، شخصية من الخيال");
    expect(table("en").pp_who_child).toBe("The child who helps, an invented person");
    expect(table("ar").pp_who_child).toBe("الطفل المساعد، شخصية من الخيال");
    expect(table("en").pp_rec_paper).toBe("paper-making at Samarkand");
    expect(table("en").pp_rec_place).toBe("Samarkand");
    expect(table("en").pp_go).toBe("Make a sheet");
    // Three notes and no fourth.
    expect(Object.keys(table("en")).filter((k) => k.startsWith("pp_note_"))).toEqual(["pp_note_1", "pp_note_2", "pp_note_3"]);
    // The invented characters are never called the Messenger, in any language that has the word.
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("pp_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("rests each written line on a sentence of the record: the battle, the year, the report not a proved act, the recipe's steps and their order, the spread, who invented paper", () => {
    const rec = readFileSync(resolve(root, "content", "en", "invention", "paper-mill-samarkand.md"), "utf8").replace(/\s+/g, " ");
    const at = (needle: string) => {
      const i = rec.indexOf(needle);
      expect(i, needle).toBeGreaterThanOrEqual(0);
      return i;
    };
    // A battle near the Talas, in 751; taught to make paper from linen and hemp rags; the prisoner story is a transmitted account rather than a proved foundation act.
    expect(rec).toMatch(/battle of Atlakh near the Talas in .{0,6}\(133–134\/751\)/);
    expect(rec).toContain("Chinese artisans captured");
    expect(rec).toContain("linen and hemp rags");
    expect(rec).toContain("the prisoner story is a transmitted account rather than a proved foundation act");
    expect(rec).toContain("The Chinese invented paper; the Islamic world's role was to receive, adapt and spread the craft");
    // The order of the steps, as the record gives it in its two sentences.
    const steps = ["cut small", "cleaned, bleached and pounded", "dressed with wheat-starch size"].map(at);
    expect([...steps].sort((a, b) => a - b)).toEqual(steps);
    const how = ["separated in water and pounded to pulp", "dressed with starch", "lifted on a deckle and shaken until the fibres interlace", "laid flat, dried on a wall", "rubbed with flour-and-starch and polished smooth"].map(at);
    expect([...how].sort((a, b) => a - b)).toEqual(how);
    expect(rec).toContain("rotten linen, flax or hemp rags");
    expect(rec).toContain("in mortars, stampers or paper-mills");
    expect(rec).toMatch(/From Samarkand the craft moved to Baghdad.*Egypt, Damascus.*the Maghrib, Jativa in Spain/);
    // The game's English says the same things in the same order: no step is named in the game's order that the record's order contradicts.
    const how1 = table("en").pp_how_1;
    const order = ["cut small", "cleaned and bleached", "pounded in water", "wheat starch", "lifted on a mould", "laid flat", "rubbed and polished"].map((p) => how1.indexOf(p));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language, and the one year it names is 751", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) {
      if (!k.startsWith("pp_")) continue;
      const digits = v.replace(/\{\w+\}/g, "").match(/\d+/g) ?? [];
      expect(digits.every((d) => d === "751"), `${l}:${k}`).toBe(true);
      if (k !== "pp_story_1") expect(digits, `${l}:${k}`).toEqual([]);
    }
    for (const l of LANGS) expect(table(l).pp_story_1, l).toContain("751");
    // No Hijri year is added to the line.
    for (const l of LANGS) expect(table(l).pp_story_1, l).not.toMatch(/13[34]/);
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("pp_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
  });
  it("has every key the page and the content use, in all seven languages, with no part left empty, and no key that nothing uses", () => {
    const src = readFileSync(resolve(__dirname, "..", "ui", "paper.ts"), "utf8");
    const keys = new Set([...src.matchAll(/"(pp_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const w of ["hudhud", "maker", "child", "narrator"]) keys.add(`pp_who_${w}`);
    for (const p of PAPER_PARTS) {
      keys.add(`pp_part_${p.id.replace(/-/g, "_")}`);
      keys.add(`pp_did_${p.id.replace(/-/g, "_")}`);
    }
    // What can have reached a place where the work stops: every state but the goal.
    for (const s of PAPER_STATES.filter((x) => x !== "paper")) keys.add(`pp_kind_${s.replace(/-/g, "_")}`);
    expect(keys.size).toBeGreaterThan(60);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("pp_")) expect(keys.has(k), k).toBe(true);
  });
  it("names every card and every state differently from the others, in every language", () => {
    for (const l of LANGS) {
      const t = table(l);
      const cards = PAPER_PARTS.map((p) => t[`pp_part_${p.id.replace(/-/g, "_")}`]);
      expect(new Set(cards).size, l).toBe(PAPER_PARTS.length);
      const did = PAPER_PARTS.map((p) => t[`pp_did_${p.id.replace(/-/g, "_")}`]);
      expect(new Set(did).size, l).toBe(PAPER_PARTS.length);
      const kinds = PAPER_STATES.filter((x) => x !== "paper").map((s) => t[`pp_kind_${s.replace(/-/g, "_")}`]);
      expect(new Set(kinds).size, l).toBe(kinds.length);
    }
  });
  it("names Samarkand in each language as the Atlas heading does (the English record name is the one written for the quest), and the records the results link to exist", () => {
    for (const l of LANGS.filter((x) => x !== "en")) expect(table(l).pp_rec_place, l).toBe(atlasTable(l).s_samarqand);
    expect(PAPER_SUBJECT).toBe("samarqand");
    expect([...PAPER_RECORDS]).toEqual(["invention/paper-mill-samarkand", "place/samarqand"]);
    for (const id of PAPER_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("builds the quest's id from the subject's quest code in the Atlas, and the subject has the two records", () => {
    const atlas = JSON.parse(readFileSync(resolve(__dirname, "..", "content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[] };
    const sub = atlas.subjects.find((s) => s.id === PAPER_SUBJECT)!;
    expect(PAPER_QUEST).toBe(`${sub.quest}-samarqand`);
    expect([...sub.records].sort()).toEqual([...PAPER_RECORDS].sort());
    expect(sub.world).toBe("voices-wisdom-society");
  });
  it("says in the hub that quests are built, in every language, and no longer six (the count itself is pinned in coffee.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Seven|Eight|Nine|Ten) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bsix quests|\bsix quêtes|\bseis misiones|\baltı görev|\benam misi|ست مهمات|چھ مہمیں/i);
  });
});
