// The sorting rules and the animal-card quest: each way of playing has every card in exactly one group, every group
// with a card, and an answer that says only what the museum's record of al-Jahiz's passage says (the table is written
// again here by hand, with the passage's phrase beside each line); cards are placed and a showing is refused with a card
// unplaced and counted only when it fails; the four goals; a saved place that is proved, not trusted; the picture's
// hit-test both ways round and on a page that reads right to left; and the words in all seven languages, with the lines
// written for the quest kept exactly.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CARDS, SORT_QUEST, SORT_RECORDS, SORT_SLACK, SORT_SUBJECT, sortDef } from "../content/sort";
import { SORT_ART, cardRects, restBand, restRect, slotRect, sortHit, trayGrid, trayRects } from "../art/sort";
import {
  SORT_FLAGS,
  allRight,
  applySort,
  checkDef,
  newSort,
  place,
  restoreSort,
  rightOnes,
  show,
  snapshotSort,
  sortGoals,
  unplaced,
  wrongOnes,
  type SortCommand,
  type SortDef,
  type SortState,
  type SortStyle,
} from "../sim/sort";

const STYLES: SortStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const fresh = (style: SortStyle) => newSort(style, sortDef(style));
const run = (s: SortState, cs: SortCommand[]) => cs.reduce(applySort, s);
/** Every card put in the group the answer gives it. */
const sorted = (s: SortState): SortState => s.items.reduce((acc, i) => place(acc, i, s.answer[i]!), s);
/** Every card put in a group that is not its own (there are always at least two groups). */
const allWrong = (s: SortState): SortState => s.items.reduce((acc, i) => place(acc, i, s.groups.find((g) => g !== s.answer[i])!), s);

// What the passage says, written down again here and not read from the content file. The passage: al-Jahiz divides
// birds into predators, grazers and swarming insects; predators armed with talons such as the eagle, those armed with
// beaks such as vultures and crows; not everything that flies on two wings is a bird, locusts, bees and flies fly and are
// not called birds; the bat is reckoned among birds though featherless; the ostrich has feathers but is not a bird.
const EXPECTED: Record<SortStyle, { groups: string[]; answer: Record<string, string> }> = {
  story: {
    groups: ["story_bird", "story_other"],
    answer: {
      eagle: "story_bird", // a predator among the birds: "armed with talons such as the eagle"
      crow: "story_bird", // a predator among the birds: "armed with beaks such as vultures and crows"
      bee: "story_other", // "locusts, bees and flies fly but are not called birds"
      locust: "story_other", // the same sentence
    },
  },
  explorer: {
    groups: ["exp_in", "exp_out"],
    answer: {
      eagle: "exp_in", // armed with talons: among the birds
      vulture: "exp_in", // armed with beaks: among the birds
      crow: "exp_in", // armed with beaks: among the birds
      bat: "exp_in", // "the bat is reckoned among birds though featherless"
      ostrich: "exp_out", // "the ostrich has feathers but is not a bird"
      locust: "exp_out", // "fly but are not called birds"
      bee: "exp_out", // the same
      fly: "exp_out", // the same
    },
  },
  challenge: {
    groups: ["ch_talons", "ch_beak", "ch_bat", "ch_ostrich", "ch_wings"],
    answer: {
      eagle: "ch_talons", // "predators armed with talons such as the eagle"
      vulture: "ch_beak", // "armed with beaks such as vultures and crows"
      crow: "ch_beak", // the same
      bat: "ch_bat", // "reckoned among birds though featherless"
      ostrich: "ch_ostrich", // "has feathers but is not a bird"
      locust: "ch_wings", // "not everything that flies on two wings is a bird: locusts, bees and flies"
      bee: "ch_wings", // the same
      fly: "ch_wings", // the same
    },
  },
};
const PASSAGE_CARDS = ["eagle", "vulture", "crow", "bat", "ostrich", "locust", "bee", "fly"];

describe("the cards and groups of each way of playing", () => {
  it("are the eight creatures the passage names, and no others", () => {
    expect([...CARDS]).toEqual(PASSAGE_CARDS);
    expect(SORT_QUEST).toBe("w09q1-al-jahiz");
    expect(SORT_SUBJECT).toBe("al-jahiz");
  });
  it.each(STYLES)("%s: the sorting is well made, its groups and its answer are what the passage says", (style) => {
    const def = sortDef(style);
    expect(() => checkDef(def)).not.toThrow();
    expect([...def.groups]).toEqual(EXPECTED[style].groups);
    expect({ ...def.answer }).toEqual(EXPECTED[style].answer);
    expect([...def.items].sort()).toEqual(Object.keys(EXPECTED[style].answer).sort());
  });
  it.each(STYLES)("%s: every card has exactly one right group and every group has at least one card", (style) => {
    const def = sortDef(style);
    for (const i of def.items) expect(def.groups.filter((g) => def.answer[i] === g), i).toHaveLength(1);
    for (const g of def.groups) expect(def.items.filter((i) => def.answer[i] === g).length, g).toBeGreaterThanOrEqual(1);
    for (const v of Object.values(def.answer)) expect(def.groups).toContain(v);
  });
  it("have the numbers of cards and groups of the way of playing: 4 and 2, 8 and 2, 8 and 5", () => {
    expect(STYLES.map((s) => [sortDef(s).items.length, sortDef(s).groups.length])).toEqual([[4, 2], [8, 2], [8, 5]]);
    // The surprises of Explorer: the bat is counted among the birds, the ostrich is not.
    expect(sortDef("explorer").answer.bat).toBe("exp_in");
    expect(sortDef("explorer").answer.ostrich).toBe("exp_out");
    // The five groups of Challenge hold 1, 2, 1, 1 and 3 cards.
    const d = sortDef("challenge");
    expect(d.groups.map((g) => d.items.filter((i) => d.answer[i] === g).length)).toEqual([1, 2, 1, 1, 3]);
  });
  it("refuses a sorting that is not well made", () => {
    const base: SortDef = { items: ["a", "b"], groups: ["x", "y"], answer: { a: "x", b: "y" } };
    expect(() => checkDef(base)).not.toThrow();
    expect(() => checkDef({ ...base, answer: { a: "x" } })).toThrow(); // b has no group
    expect(() => checkDef({ ...base, answer: { a: "x", b: "z" } })).toThrow(); // an unknown group
    expect(() => checkDef({ ...base, answer: { a: "x", b: "x" } })).toThrow(); // y has no card
    expect(() => checkDef({ ...base, answer: { a: "x", b: "y", c: "y" } })).toThrow(); // an unknown card
    expect(() => checkDef({ ...base, items: ["a", "a"] })).toThrow(); // named twice
    expect(() => checkDef({ ...base, groups: ["x"], answer: { a: "x", b: "x" } })).toThrow(); // one group is no sorting
    expect(() => checkDef({ items: [], groups: ["x", "y"], answer: {} })).toThrow();
  });
  it("hold failed showings allowed as the quest says: none counted in Story, one in Explorer and in Challenge", () => {
    expect(SORT_SLACK).toEqual({ story: null, explorer: { shows: 1 }, challenge: { shows: 1 } });
  });
});

describe("placing and showing", () => {
  it("starts with every card unplaced, nothing counted and nothing done", () => {
    for (const style of STYLES) {
      const s = fresh(style);
      expect(unplaced(s)).toHaveLength(s.items.length);
      expect([s.moves, s.shows, s.done, s.last]).toEqual([0, 0, false, null]);
      expect(rightOnes(s)).toEqual([]);
    }
  });
  it("places a card, moves it, takes it out, and counts each as a placement", () => {
    let s = fresh("explorer");
    s = place(s, "bat", "exp_out");
    expect([s.placed.bat, s.moves, s.last]).toEqual(["exp_out", 1, { type: "place", item: "bat", group: "exp_out" }]);
    s = place(s, "bat", "exp_in");
    expect([s.placed.bat, s.moves]).toEqual(["exp_in", 2]);
    s = place(s, "bat", null);
    expect([s.placed.bat, s.moves, s.last]).toEqual([null, 3, { type: "place", item: "bat", group: null }]);
  });
  it("changes nothing for a card or a group it does not know, or for a card put where it already is", () => {
    const s = place(fresh("explorer"), "bat", "exp_in");
    expect(place(s, "dog", "exp_in")).toBe(s);
    expect(place(s, "bat", "exp_none")).toBe(s);
    expect(place(s, "bat", "story_bird")).toBe(s); // another way of playing's group
    expect(place(s, "bat", "exp_in")).toBe(s);
    expect(place(fresh("explorer"), "bat", null)).toEqual(fresh("explorer"));
    expect(applySort(s, { type: "place", item: "toString", group: "exp_in" })).toBe(s);
  });
  it("refuses a showing with a card unplaced, says how many, and does not count it", () => {
    for (const style of STYLES) {
      let s = fresh(style);
      const n = s.items.length;
      expect(show(s).last).toEqual({ type: "show", refused: true, unplaced: n });
      expect(show(s).shows).toBe(0);
      s = place(s, s.items[0]!, s.answer[s.items[0]!]!);
      const r = show(s);
      expect(r.last).toEqual({ type: "show", refused: true, unplaced: n - 1 });
      expect([r.shows, r.done]).toEqual([0, false]);
    }
  });
  it("counts a showing that finds a card in the wrong group, and names the cards that are wrong", () => {
    let s = sorted(fresh("explorer"));
    s = place(s, "bat", "exp_out"); // the bat outside the birds
    expect(wrongOnes(s)).toEqual(["bat"]);
    const r = show(s);
    expect(r.shows).toBe(1);
    expect(r.done).toBe(false);
    expect(r.last).toEqual({ type: "show", refused: false, right: 7, total: 8, wrong: ["bat"] });
    const w = show(allWrong(fresh("story")));
    expect(w.last).toEqual({ type: "show", refused: false, right: 0, total: 4, wrong: ["eagle", "crow", "bee", "locust"] });
    expect(show(w).shows).toBe(2);
  });
  it("is done on the showing that finds every card right, and not before: the cards in their groups are not yet shown", () => {
    for (const style of STYLES) {
      const s = sorted(fresh(style));
      expect(allRight(s)).toBe(true);
      expect(s.done).toBe(false);
      const r = show(s);
      expect(r.done).toBe(true);
      expect(r.shows).toBe(0);
      expect(r.moves).toBe(s.items.length);
    }
  });
  it("changes nothing after it is done: no placement, no showing, no flag", () => {
    const done = show(sorted(fresh("challenge")));
    expect(done.done).toBe(true);
    expect(place(done, "bat", "ch_beak")).toBe(done);
    expect(show(done)).toBe(done);
    expect(applySort(done, { type: "flag", flag: "kind" })).toBe(done);
    expect(applySort(done, { type: "place", item: "bat", group: null })).toBe(done);
  });
  it("keeps the flags once each, in any order, and ignores one it does not know", () => {
    let s = fresh("story");
    s = run(s, [{ type: "flag", flag: "feather" }, { type: "flag", flag: "feather" }, { type: "flag", flag: "kind" }]);
    expect(s.flags).toEqual(["feather", "kind"]);
    const same = applySort(s, { type: "flag", flag: "nonsense" as never });
    expect(same).toBe(s);
    expect(SORT_FLAGS).toEqual(["askedDivision", "askedBirds", "kind", "feather", "answered"]);
  });
  it("can be played to its end from any wrong start, in every way of playing", () => {
    for (const style of STYLES) {
      let s = allWrong(fresh(style));
      s = show(s);
      expect(s.done).toBe(false);
      s = show(sorted(s));
      expect(s.done).toBe(true);
      expect(s.shows).toBe(1);
    }
  });
});

describe("the four goals", () => {
  const finished = (style: SortStyle, fails: number, flags: SortCommand[]) => {
    let s = allWrong(fresh(style));
    for (let i = 0; i < fails; i++) s = show(s);
    return show(run(sorted(s), flags));
  };
  it("count Curiosity only when both questions were asked", () => {
    expect(sortGoals(finished("story", 0, [{ type: "flag", flag: "askedDivision" }]), null).curiosity).toBe(false);
    expect(sortGoals(finished("story", 0, [{ type: "flag", flag: "askedBirds" }]), null).curiosity).toBe(false);
    expect(sortGoals(finished("story", 0, [{ type: "flag", flag: "askedBirds" }, { type: "flag", flag: "askedDivision" }]), null).curiosity).toBe(true);
  });
  it("count Ingenuity by failed showings: none counted in Story, one allowed in Explorer and in Challenge", () => {
    expect(sortGoals(finished("story", 5, []), SORT_SLACK.story).ingenuity).toBe(true);
    for (const style of ["explorer", "challenge"] as const) {
      expect(sortGoals(finished(style, 0, []), SORT_SLACK[style]).ingenuity, style).toBe(true);
      expect(sortGoals(finished(style, 1, []), SORT_SLACK[style]).ingenuity, style).toBe(true);
      expect(sortGoals(finished(style, 2, []), SORT_SLACK[style]).ingenuity, style).toBe(false);
    }
  });
  it("count Kindness and the feather from their flags, and report the placements and the failed showings", () => {
    const g = sortGoals(finished("explorer", 1, [{ type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]), SORT_SLACK.explorer);
    expect(g).toEqual({ turns: 16, slips: 1, curiosity: false, ingenuity: true, kindness: true, feather: true });
    const none = sortGoals(finished("story", 0, []), null);
    expect([none.kindness, none.feather, none.slips]).toEqual([false, false, 0]);
  });
  it("count a blunt answer as no Kindness, and keep it as answered", () => {
    const blunt = finished("explorer", 0, [{ type: "flag", flag: "answered" }]);
    expect(sortGoals(blunt, SORT_SLACK.explorer).kindness).toBe(false);
    expect(blunt.flags).toEqual(["answered"]);
  });
});

describe("a saved place", () => {
  const mid = (style: SortStyle) => run(fresh(style), [{ type: "place", item: sortDef(style).items[0]!, group: sortDef(style).groups[1]! }, { type: "flag", flag: "askedBirds" }, { type: "show" }]);
  const through = (s: SortState) => restoreSort(JSON.parse(JSON.stringify(snapshotSort(s))), sortDef);
  const refused = (x: unknown) => restoreSort(x, sortDef);
  const snap = (style: SortStyle) => JSON.parse(JSON.stringify(snapshotSort(mid(style)))) as Record<string, unknown>;
  it("comes back as it was, through a round trip of JSON, in every way of playing", () => {
    for (const style of STYLES) {
      const s = mid(style);
      const back = through(s)!;
      expect(back).not.toBeNull();
      expect(back.placed).toEqual(s.placed);
      expect([back.moves, back.shows, back.flags, back.style, back.done, back.last]).toEqual([s.moves, s.shows, s.flags, style, false, null]);
      expect(back.items).toEqual(sortDef(style).items);
      // And it can be played on to its end.
      expect(show(sorted(back)).done).toBe(true);
    }
  });
  it("keeps a fresh sorting too, and one with every card in its group but not yet shown", () => {
    for (const style of STYLES) {
      expect(through(fresh(style))).not.toBeNull();
      const s = sorted(fresh(style));
      expect(through(s)!.done).toBe(false);
      expect(show(through(s)!).done).toBe(true);
    }
  });
  it("refuses a card or a group that is not the style's own, whatever else is right", () => {
    const good = snap("explorer");
    const placed = good.placed as Record<string, string | null>;
    const bad: unknown[] = [
      { ...placed, dog: "exp_in" },
      { ...placed, bat: "exp_nope" },
      { ...placed, bat: "story_bird" }, // another way of playing's group
      { ...placed, bat: 3 },
      { ...placed, bat: "" },
      { ...placed, bat: undefined, __proto__: { x: 1 }, constructor: "exp_in" },
      [["bat", "exp_in"]],
      "x",
      null,
      undefined,
      4,
    ];
    for (const b of bad) expect(refused({ ...good, placed: b }), JSON.stringify(b)).toBeNull();
    // A Story card is not an Explorer one: the vulture is no card of Story.
    expect(refused({ ...snap("story"), placed: { vulture: "story_bird" } })).toBeNull();
    // A group of one way of playing is not another's.
    expect(refused({ ...good, style: "story" })).toBeNull();
    expect(refused({ ...good, style: "challenge" })).toBeNull();
  });
  it("refuses counts that are not whole non-negative numbers, and a count of placements fewer than the cards placed", () => {
    const good = snap("explorer");
    const inTrays = Object.values(good.placed as Record<string, string | null>).filter((g) => g !== null).length;
    expect(inTrays).toBe(1);
    expect(refused({ ...good, moves: inTrays })).not.toBeNull();
    expect(refused({ ...good, moves: 0 })).toBeNull(); // a card is in a tray, so at least one placement was made
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, moves }), String(moves)).toBeNull();
    expect(refused({ ...good, moves: 40 })!.moves).toBe(40);
    for (const shows of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, shows }), String(shows)).toBeNull();
    expect(refused({ ...good, shows: 3 })!.shows).toBe(3);
    expect(refused({ ...good, shows: 0 })!.shows).toBe(0);
  });
  it("refuses what cannot be trusted at all, drops flags it does not know, and never takes cards, groups, answer, a finish or the last command from the file", () => {
    const good = snap("story");
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }, { ...good, flags: "feather" }, { ...good, flags: undefined }, { ...good, placed: undefined }]) expect(refused(bad)).toBeNull();
    const back = refused({ ...good, flags: ["feather", "askedBirds", "nonsense", 7, "kind", "kind"], done: true, last: { type: "show" }, items: ["x"], groups: ["y", "z"], answer: { x: "y" } })!;
    expect(back.flags).toEqual(["askedBirds", "kind", "feather"]);
    expect([back.done, back.last]).toEqual([false, null]);
    expect(back.items).toEqual(sortDef("story").items);
    expect(back.groups).toEqual(sortDef("story").groups);
    expect({ ...back.answer }).toEqual({ ...sortDef("story").answer });
  });
  it("keeps `answered` for a blunt answer too, without making it a goal", () => {
    const blunt = run(fresh("explorer"), [{ type: "flag", flag: "answered" }]);
    expect(sortGoals(blunt, SORT_SLACK.explorer).kindness).toBe(false);
    expect(restoreSort(JSON.parse(JSON.stringify(snapshotSort(blunt))), sortDef)!.flags).toEqual(["answered"]);
  });
});

describe("the picture's layout and hit-test", () => {
  const view = (s: SortState, rtl: boolean) => ({ items: s.items, placed: s.items.map((i) => (s.placed[i] === null ? null : s.groups.indexOf(s.placed[i]!))), groups: s.groups.length, rtl });
  const centre = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
  it.each(STYLES)("holds every card of %s in its tray with room to spare, inside the picture, apart from every other", (style) => {
    const s = sorted(fresh(style));
    const rects = cardRects(view(s, false));
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(SORT_ART.w);
      expect(r.y + r.h).toBeLessThanOrEqual(SORT_ART.h);
    }
    for (let a = 0; a < rects.length; a++) for (let b = a + 1; b < rects.length; b++) expect(Math.abs(rects[a]!.x - rects[b]!.x) >= SORT_ART.card || Math.abs(rects[a]!.y - rects[b]!.y) >= SORT_ART.card, `${a} ${b}`).toBe(true);
    // Each card lies wholly inside its own tray.
    const trays = trayRects(s.groups.length, false);
    s.items.forEach((i, k) => {
      const t = trays[s.groups.indexOf(s.placed[i]!)]!;
      expect(rects[k]!.x).toBeGreaterThanOrEqual(t.x);
      expect(rects[k]!.x + rects[k]!.w).toBeLessThanOrEqual(t.x + t.w);
      expect(rects[k]!.y + rects[k]!.h).toBeLessThanOrEqual(t.y + t.h);
    });
    // And every tray has room for every card of the sorting in it (any card may be placed in any tray).
    const { cols, rows } = trayGrid(s.groups.length);
    expect(cols * rows).toBeGreaterThanOrEqual(Math.max(...s.groups.map((g) => s.items.filter((i) => s.answer[i] === g).length)));
  });
  it("leaves trays side by side without touching, and the band of unplaced cards under them", () => {
    for (const g of [2, 5]) {
      const t = trayRects(g, false);
      for (let i = 1; i < t.length; i++) expect(t[i]!.x).toBeGreaterThan(t[i - 1]!.x + t[i - 1]!.w);
      expect(t[0]!.y + t[0]!.h).toBeLessThan(restBand(false).y);
      expect(restRect(8, 7, false).x + SORT_ART.card).toBeLessThanOrEqual(restBand(false).x + restBand(false).w);
    }
  });
  it.each(STYLES)("finds the card under the middle of every card, and the tray under an empty part of every tray, left to right and on a right to left page, in %s", (style) => {
    for (const rtl of [false, true]) {
      // All cards unplaced: each lies in the band at the bottom, and is hit there.
      const s = fresh(style);
      cardRects(view(s, rtl)).forEach((r, i) => {
        const c = centre(r);
        expect(sortHit(c.x, c.y, view(s, rtl)), `${rtl} rest ${i}`).toEqual({ type: "card", item: i });
      });
      // Every card placed rightly: the cards are hit in their trays and the empty header of each tray is the tray.
      const p = sorted(fresh(style));
      cardRects(view(p, rtl)).forEach((r, i) => {
        const c = centre(r);
        expect(sortHit(c.x, c.y, view(p, rtl)), `${rtl} tray ${i}`).toEqual({ type: "card", item: i });
      });
      trayRects(p.groups.length, rtl).forEach((t, g) => expect(sortHit(t.x + t.w / 2, t.y + 8, view(p, rtl)), `${rtl} header ${g}`).toEqual({ type: "tray", group: g }));
      // The band, where no card lies: the unplaced band; an empty place of a tray is the tray.
      const band = restBand(rtl);
      expect(sortHit(band.x + band.w - 3, band.y + 3, view(p, rtl))).toEqual({ type: "rest" });
      const empty = slotRect(p.groups.length, 0, trayGrid(p.groups.length).cols * trayGrid(p.groups.length).rows - 1, rtl);
      expect(sortHit(centre(empty).x, centre(empty).y, view(p, rtl))).toEqual({ type: "tray", group: 0 });
    }
  });
  it("mirrors the layout on a right to left page: the first tray and the first card are on the right, and the hit-test follows", () => {
    const s = fresh("explorer");
    const ltr = trayRects(2, false);
    const rtlT = trayRects(2, true);
    expect(ltr[0]!.x).toBeLessThan(ltr[1]!.x);
    expect(rtlT[0]!.x).toBeGreaterThan(rtlT[1]!.x);
    expect(rtlT[0]!.x).toBe(SORT_ART.w - ltr[0]!.x - ltr[0]!.w);
    expect(restRect(8, 0, true).x).toBeGreaterThan(restRect(8, 7, true).x);
    // The same point is a different card the other way round, and the mirror image of a card's middle is that card.
    const first = centre(restRect(8, 0, false));
    expect(sortHit(first.x, first.y, view(s, false))).toEqual({ type: "card", item: 0 });
    expect(sortHit(SORT_ART.w - first.x, first.y, view(s, true))).toEqual({ type: "card", item: 0 });
    expect(sortHit(first.x, first.y, view(s, true))).not.toEqual({ type: "card", item: 0 });
  });
  it("finds nothing in the margin, between the trays and the band, or outside the picture", () => {
    const s = sorted(fresh("challenge"));
    const t = trayRects(5, false);
    const gap = (t[0]!.x + t[0]!.w + t[1]!.x) / 2;
    for (const [x, y] of [[gap, t[0]!.y + 40], [0, 0], [SORT_ART.w, SORT_ART.h], [-5, 10], [10, -5], [5000, 5000], [500, t[0]!.y + t[0]!.h + 5]] as [number, number][]) expect(sortHit(x, y, view(s, false)), `${x},${y}`).toBeNull();
  });
  it("puts a card that is taken out of a tray back in its own place in the band, and the cards left in the tray close up", () => {
    let s = sorted(fresh("explorer"));
    const before = cardRects(view(s, false));
    s = place(s, "eagle", null);
    const after = cardRects(view(s, false));
    expect(after[0]).toEqual(restRect(8, 0, false));
    expect(after[1]).toEqual(before[0]); // the vulture now stands first in its tray
    expect(after[4]).toEqual(before[4]); // the ostrich's tray did not change
  });
});

describe("the words and the records", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. The one line that differs from the brief is the third part for the hoopoe: the record's chapter list puts the hoopoe in the third part (the second volume). */
  const WRITTEN: [string, string, string][] = [
    ["jz_intro_1", "صفحة الأطلس مخبأة بين بطاقات الحيوان، والبطاقات اختلطت أقسامها!", "The page of the Atlas is hidden among the animal cards, and the cards have lost their groups!"],
    ["jz_intro_2", "لا تحكم بالريش ولا بالجناح وحدهما. انظر كيف يسمّي الناس كل واحد.", "Do not judge by feathers or by wings alone. See what people call each one."],
    ["jz_divide_1", "يقول سجل المتحف إن الجاحظ قسّم الحيوان في كتابه بحسب حركته: ما يمشي وما يطير وما يسبح وما يزحف. وقال إنه يتبع في ذلك الأسماء المعروفة عند أهل لغته.", "The museum's record says al-Jahiz divided animals in his book by how they move: those that walk, fly, swim or creep. He says that in this he follows the names known among the people of his language."],
    ["jz_birds_1", "ويقول إنه ليس كل ما يطير بجناحين طائرًا: فالجراد والنحل والذباب تطير ولا تُسمّى طيرًا، والخفاش معدود في الطير وإن لم يكن له ريش، والنعامة لها ريش وليست عنده من الطير.", "He notes that not everything that flies on two wings is a bird: locusts, bees and flies fly but are not called birds; the bat is counted among the birds though it has no feathers; and the ostrich has feathers but is not, for him, a bird."],
    ["jz_hoopoe_1", "ويذكر السجل الهدهد بين ما تناوله الجزء الثالث من كتابه.", "The record lists the hoopoe among the creatures in the third part of his book."],
    ["jz_hoopoe_2", "أنا في كتابه!", "I am in his book!"],
    ["jz_note_1", "هذه لعبة وليست كتاب تاريخ. البطاقات والصواني والطفلة التي تحمل البطاقات وكل كلمة تُقال من خيال اللعب.", "This is a game, not a history. The cards, the trays, the girl who carries the cards and every spoken line are invented for play."],
    ["jz_note_2", "من سجل المتحف: يقسّم الجاحظ الحيوان إلى ما يمشي وما يطير وما يسبح وما يزحف، ويفرّق في سباع الطير بين ذوات المخالب كالعُقاب وذوات المناقير كالنسور والغربان. والمخلوقات الثمانية في اللعبة مذكورة كلها في هذا الموضع من كتابه.", "From the museum's record: al-Jahiz divides animals into those that walk, fly, swim or creep, and among birds of prey he tells those armed with talons, like the eagle, from those armed with beaks, like vultures and crows. All eight creatures in the game are named in this passage of his book."],
    // The Arabic clause about today's science reads "it counts the bat ...", so that it cannot be taken to speak of al-Jahiz.
    ["jz_note_3", "هذا تقسيم الجاحظ قبل أكثر من ألف سنة، وهو يتبع أسماء أهل لغته. والعلم اليوم يصنّف الحيوان بطريقة أخرى: فهو يعدّ الخفاش من الثدييات والنعامة من الطيور.", "This is al-Jahiz's division, more than a thousand years old, and it follows the names used by the people of his language. Science today sorts animals in another way: it counts the bat among the mammals and the ostrich among the birds."],
    ["jz_note_4", "بُسِّط من أجل اللعب: تأخذ اللعبة موضعًا واحدًا من كتاب الحيوان. ويقول السجل إن الكتاب أوسع من عنوانه، ففيه اللغة والعادات وعلوم كثيرة.", "Made simpler for play: the game takes one passage of the Book of Animals. The record says the book is wider than its title, with language, customs and much other learning in it."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' labels", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    expect(table("en").jz_who_jahiz).toBe("Al-Jahiz, in imagined words");
    expect(table("ar").jz_who_jahiz).toBe("الجاحظ، بكلمات متخيَّلة");
    expect(table("en").jz_who_girl).toBe("The girl who carries the cards, an invented person");
    expect(table("ar").jz_who_girl).toBe("الطفلة حاملة البطاقات، شخصية من الخيال");
    expect(table("en").jz_rec_person).toBe("al-Jahiz");
    expect(table("en").jz_rec_book).toBe("his Book of Animals");
    expect(table("ar").jz_rec_book).toBe("كتابه كتاب الحيوان");
    expect(table("en").jz_show).toBe("Show al-Jahiz");
    // The invented girl is never called the Messenger, in any language that has the word.
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("jz_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("keeps the five phrases of Challenge and the four of the other ways of playing exactly, in English", () => {
    const en = table("en");
    expect([en.jz_g_ch_talons, en.jz_g_ch_beak, en.jz_g_ch_bat, en.jz_g_ch_ostrich, en.jz_g_ch_wings]).toEqual([
      "a bird of prey armed with talons",
      "a bird of prey armed with a beak",
      "counted among the birds, though it has no feathers",
      "has feathers, but is not a bird",
      "flies on two wings, but is not called a bird",
    ]);
    expect([en.jz_g_story_bird, en.jz_g_story_other, en.jz_g_exp_in, en.jz_g_exp_out]).toEqual(["called a bird", "flies, but not called a bird", "counted among the birds", "not counted among the birds"]);
    expect(en.jz_where.replace("{card}", en.jz_c_bat)).toBe("Where does the bat go?");
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("jz_")) expect(v.replace(/\{\w+\}/g, "").match(/\d/g) ?? [], `${l}:${k}`).toEqual([]);
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("jz_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
  });
  it("has every key the page and the content use, in all seven languages, with no part left empty, and no key that nothing uses", () => {
    const src = readFileSync(resolve(__dirname, "..", "ui", "sort.ts"), "utf8");
    const keys = new Set([...src.matchAll(/"(jz_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const w of ["hudhud", "jahiz", "girl", "narrator"]) keys.add(`jz_who_${w}`);
    for (const c of CARDS) keys.add(`jz_c_${c}`);
    for (const style of STYLES) for (const g of sortDef(style).groups) keys.add(`jz_g_${g}`);
    expect(keys.size).toBeGreaterThan(50);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("jz_")) expect(keys.has(k), k).toBe(true);
  });
  it("names the records the results link to, and each is a museum record that exists", () => {
    expect([...SORT_RECORDS]).toEqual(["person/al-jahiz", "work/kitab-al-hayawan"]);
    for (const id of SORT_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("says in the hub that quests are built, in every language, and no longer five (the count itself is pinned in channels.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Six|Seven|Eight|Nine|Ten|Eleven) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bfive quests|\bcinq quêtes|\bcinco misiones|\bbeş görev|\blima misi|خمس مهمات|پانچ مہمیں/i);
  });
  it("gives each card a name in every language, different from every other card's name", () => {
    for (const l of LANGS) {
      const names = CARDS.map((c) => table(l)[`jz_c_${c}`]);
      expect(new Set(names).size, l).toBe(CARDS.length);
    }
  });
});
