// Coffee on three shelves: the second use of the sorting rules (sim/sort.ts, proved for the animal cards of al-Jahiz in
// sort.gtest.ts). Here it is proved for coffee: in each way of playing every card has exactly one shelf and every shelf
// holds a card; the answer table is written again by hand with the museum record's sentence beside every card, and each
// anchor is found in the record's own file; the goals, a saved place that is proved and not trusted, a finished sorting
// that nothing changes, and the picture's hit-test both ways round, on a page that reads right to left too; and the
// words in all seven languages, with the lines written for the quest kept word for word, no card sentence long, no
// digit and no «الرسول» in any string of the quest. The last block proves the two leftovers of the ninth quest: every
// quest that animates follows the game's setting, the system preference and `motion=reduced` through one helper, and a
// finished quest's chosen radio button is drawn by shape.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { COFFEE_CARDS, COFFEE_QUEST, COFFEE_RECORDS, COFFEE_SLACK, COFFEE_SUBJECT, SHELVES, coffeeDef } from "../content/coffee";
import { SORT_ART, cardRects, restBand, sortHit, trayGrid, trayRects } from "../art/sort";
import { SORT_FLAGS, applySort, checkDef, newSort, place, restoreSort, show, snapshotSort, sortGoals, wrongOnes, type SortCommand, type SortState, type SortStyle } from "../sim/sort";

const STYLES: SortStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const here = (...p: string[]) => resolve(__dirname, "..", ...p);
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const fresh = (style: SortStyle) => newSort(style, coffeeDef(style));
const run = (s: SortState, cs: SortCommand[]) => cs.reduce(applySort, s);
const sorted = (s: SortState): SortState => s.items.reduce((acc, i) => place(acc, i, s.answer[i]!), s);
/** The record's text with its links and citations written as plain words, on one line. */
const plain = (path: string) => readFileSync(resolve(root, path), "utf8").replace(/\[\[[^|\]]*\|([^\]]*)\]\]/g, "$1").replace(/\s*\{cite:[^}]*\}/g, "").replace(/\s+/g, " ");
const yemen = plain("content/en/invention/coffee-yemen.md");
const yemenAr = plain("content/ar/invention/coffee-yemen.md");
const house = plain("content/en/invention/coffeehouse-yemen.md");

// What the museum's record says, written down again here by hand and not read from the content file: each card, the
// shelf the game puts it on, the sentence of the record it rests on (as the English record has it), and an anchor in
// that sentence that is looked for in the record's own file, in English and in Arabic.
//   shelf "stated"     the record says it plainly, in its own voice
//   shelf "tradition"  the record gives it as what traditions credit, and says the traditions compete rather than agree
//   shelf "legend"     the record's source treats it as unhistorical
const EXPECTED: Record<string, { shelf: string; record: string; en: string; ar: string; file?: "house" }> = {
  // "the tree grew wild in Ethiopia"
  ethiopia: { shelf: "stated", record: "coffee-yemen, The world before it: the tree grew wild in Ethiopia", en: "the tree grew wild in Ethiopia", ar: "برّية في إثيوبيا" },
  // "or from the dried husk of the bean (qishr) as Yemenis preferred"; "in Yemen the favoured drink was an infusion of the husk (qishr)"
  husk: { shelf: "stated", record: "coffee-yemen, What it is: the dried husk of the bean (qishr) as Yemenis preferred; How it works: in Yemen the favoured drink was an infusion of the husk", en: "in Yemen the favoured drink was an infusion of the husk", ar: "وفي اليمن كان المفضل مغليَّ القشر" },
  // "drinking spread from Sufi circles because it aided wakefulness for devotional nights"
  sufis: { shelf: "stated", record: "coffee-yemen, Summary: drinking spread from Sufi circles because it aided wakefulness for devotional nights", en: "drinking spread from Sufi circles because it aided wakefulness for devotional nights", ar: "وانتشر الشرب من أوساط الصوفية" },
  // "from Yemen it passed to Mecca, Cairo and Istanbul"
  spread: { shelf: "stated", record: "coffee-yemen, Summary: from Yemen it passed to Mecca, Cairo and Istanbul", en: "from Yemen it passed to Mecca, Cairo and Istanbul", ar: "فمن اليمن إلى مكة فالقاهرة فإسطنبول" },
  // "Kha'ir Beg's attempt to ban it in 917/1511 failed to stop it"; the coffeehouse record: "in 1511 the governor of Mecca closed the coffeehouses"
  ban: { shelf: "stated", record: "coffee-yemen, The story: Kha'ir Beg's attempt to ban it failed to stop it; coffeehouse-yemen, The story: the governor of Mecca closed the coffeehouses", en: "Kha'ir Beg's attempt to ban it", ar: "وحاول خاير بك منعها" },
  // "Traditions credit its introduction at Aden to the jurist Muhammad ibn Sa'id al-Dhabhani"; "the traditions compete rather than agree"
  dhabhani: { shelf: "tradition", record: "coffee-yemen, Summary: traditions credit its introduction at Aden to the jurist al-Dhabhani; The story: the traditions compete rather than agree", en: "Traditions credit its introduction at Aden to the jurist Muhammad ibn Sa'id al-Dhabhani", ar: "تنسب الروايات إدخاله إلى عدن للفقيه" },
  // "and at Mocha to 'Ali ibn 'Umar al-Shadhili"; "the patron saint of Mocha, the 'innovator of coffee'"
  shadhili: { shelf: "tradition", record: "coffee-yemen, Summary: traditions credit its introduction at Mocha to 'Ali ibn 'Umar al-Shadhili; The story: the 'innovator of coffee'", en: "and at Mocha to 'Ali ibn 'Umar al-Shadhili", ar: "وإلى موكا لعلي بن عمر الشاذلي" },
  // "Ukers likewise treats the Omar-and-the-goats-type legends as unhistorical"
  goats: { shelf: "legend", record: "coffee-yemen, The maker(s): Ukers treats the Omar-and-the-goats-type legends as unhistorical", en: "Omar-and-the-goats-type legends as unhistorical", ar: "قصص عمر والماعز لا تصح وقائع" },
};

describe("the cards and shelves of each way of playing", () => {
  it("are the eight cards the record gives, on the three shelves, and the quest's id is built from the Atlas", () => {
    expect([...COFFEE_CARDS]).toEqual(Object.keys(EXPECTED));
    expect([...SHELVES]).toEqual(["stated", "tradition", "legend"]);
    expect(COFFEE_QUEST).toBe("w07q3-coffee");
    expect(COFFEE_SUBJECT).toBe("coffee");
    const atlas = JSON.parse(readFileSync(here("content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[]; worlds: { id: string; order: number }[] };
    const sub = atlas.subjects.find((s) => s.id === COFFEE_SUBJECT)!;
    expect(COFFEE_QUEST).toBe(`${sub.quest}-coffee`);
    expect(sub.world).toBe("seas-trade-golden-books");
    expect(atlas.worlds.find((w) => w.id === sub.world)?.order).toBe(7);
    expect([...sub.records].sort()).toEqual([...COFFEE_RECORDS].sort());
  });
  it.each(STYLES)("%s: the sorting is well made, every card has exactly one shelf, and every shelf holds a card", (style) => {
    const def = coffeeDef(style);
    expect(() => checkDef(def)).not.toThrow();
    expect([...def.groups]).toEqual(["stated", "tradition", "legend"]);
    for (const i of def.items) expect(def.groups.filter((g) => def.answer[i] === g), i).toHaveLength(1);
    for (const g of def.groups) expect(def.items.filter((i) => def.answer[i] === g).length, g).toBeGreaterThanOrEqual(1);
    expect(Object.keys(def.answer).sort()).toEqual([...def.items].sort());
  });
  it("have the cards of the way of playing: four in Story, six in Explorer, eight in Challenge, each way holding the cards of the one before", () => {
    const items = STYLES.map((s) => [...coffeeDef(s).items]);
    expect(items[0]).toEqual(["ethiopia", "sufis", "dhabhani", "goats"]);
    expect(items[1]).toEqual(["ethiopia", "husk", "sufis", "dhabhani", "shadhili", "goats"]);
    expect(items[2]).toEqual(Object.keys(EXPECTED));
    for (const c of items[0]!) expect(items[1]).toContain(c);
    for (const c of items[1]!) expect(items[2]).toContain(c);
    // Shelf by shelf: Story 2, 1, 1; Explorer 3, 2, 1; Challenge 5, 2, 1.
    const counts = STYLES.map((s) => SHELVES.map((g) => coffeeDef(s).items.filter((i) => coffeeDef(s).answer[i] === g).length));
    expect(counts).toEqual([[2, 1, 1], [3, 2, 1], [5, 2, 1]]);
  });
  it.each(STYLES)("%s: the answer is what the record says, written again here card by card", (style) => {
    const def = coffeeDef(style);
    for (const i of def.items) expect(def.answer[i], i).toBe(EXPECTED[i]!.shelf);
  });
  it("finds each card's anchor in the museum record's own file, in English and in Arabic", () => {
    for (const [card, e] of Object.entries(EXPECTED)) {
      expect(yemen, `${card} en`).toContain(e.en);
      expect(yemenAr, `${card} ar`).toContain(e.ar);
    }
    // The tradition cards rest on the record's words that the traditions compete, and that the record does not choose between them.
    expect(yemen).toContain("the traditions compete rather than agree");
    expect(yemen).toContain("No inventor is established");
    expect(yemen).toContain("their plurality points to local traditions rather than one documented event");
    // The ban card has no date and no name on it, and rests on two records: the governor of Mecca closed the coffeehouses (the other record) and Kha'ir Beg's attempt failed (this one).
    expect(house).toContain("in 1511 the governor of Mecca closed the coffeehouses");
    expect(yemen).toContain("attempt to ban it");
    expect(yemen).toContain("failed to stop it");
    expect(yemen).toContain("treats the Omar-and-the-goats-type legends as unhistorical");
  });
  it("puts no date and no person's name on the ban card, no detail of the tale on the goats card, and nothing of the word's old use for wine on any card or line", () => {
    for (const l of LANGS) {
      expect(table(l).cq_c_ban, l).not.toMatch(/[0-9٠-٩۰-۹]|Kha.?ir|خاير|خیر بیگ|Hayr/i);
      expect(table(l).cq_c_goats, l).not.toMatch(/dance|danc|monk|راهب|رقص|شیخ|moine|monje|keşiş|biarawan|راہب/i);
    }
    expect(yemen).toContain("used in poetry for wine");
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("cq_")) expect(v, `${l}:${k}`).not.toMatch(/\bwine\b|\bvin\b|\bvino\b|şarap|anggur|الخمر|خمر\b|شراب العنب|شراب الخمر/i);
  });
});

describe("the sorting rules for the shelves", () => {
  it("start with every card off the shelves and nothing counted, and refuse a showing with a card off a shelf, without counting it", () => {
    for (const style of STYLES) {
      const s = fresh(style);
      expect([s.moves, s.shows, s.done, s.last]).toEqual([0, 0, false, null]);
      const refused = show(s);
      expect(refused.last).toEqual({ type: "show", refused: true, unplaced: s.items.length });
      expect(refused.shows).toBe(0);
      const one = show(place(s, s.items[0]!, "stated"));
      expect(one.last).toEqual({ type: "show", refused: true, unplaced: s.items.length - 1 });
      expect(one.shows).toBe(0);
    }
  });
  it("count a showing with a tradition put on the first shelf as failed, and name the cards on the wrong shelf (the cards are named in Story, counted in Explorer)", () => {
    for (const style of STYLES) {
      const done = sorted(fresh(style));
      const wrong = place(done, "dhabhani", "stated");
      const shown = show(wrong);
      expect(shown.done).toBe(false);
      expect(shown.shows).toBe(1);
      expect(shown.last).toEqual({ type: "show", refused: false, right: done.items.length - 1, total: done.items.length, wrong: ["dhabhani"] });
      expect(wrongOnes(shown)).toEqual(["dhabhani"]);
    }
  });
  it("end on the showing that finds every card right, in every way of playing, from the worst start", () => {
    for (const style of STYLES) {
      const s = fresh(style);
      const worst = s.items.reduce((acc, i) => place(acc, i, s.groups.find((g) => g !== s.answer[i])!), s);
      const first = show(worst);
      expect(first.done).toBe(false);
      expect(first.shows).toBe(1);
      const end = show(sorted(first));
      expect(end.done).toBe(true);
      expect(end.shows).toBe(1);
    }
  });
  it("change nothing once it is done: no placement, no showing, no flag", () => {
    for (const style of STYLES) {
      const end = show(sorted(fresh(style)));
      expect(end.done).toBe(true);
      expect(place(end, end.items[0]!, "legend")).toBe(end);
      expect(show(end)).toBe(end);
      expect(applySort(end, { type: "flag", flag: "feather" })).toBe(end);
      expect(applySort(end, { type: "place", item: end.items[0]!, group: null })).toBe(end);
    }
  });
});

describe("the four goals", () => {
  const finished = (style: SortStyle, fails: number, flags: SortCommand[]): SortState => {
    let s = run(fresh(style), flags);
    for (let i = 0; i < fails; i++) {
      const wrong = place(sorted(s), s.items[0]!, s.groups.find((g) => g !== s.answer[s.items[0]!])!);
      s = show(wrong);
      s = { ...s, placed: { ...sorted(s).placed } };
    }
    return show(sorted(s));
  };
  it("allow no count in Story, and one failed showing in Explorer and in Challenge", () => {
    expect(COFFEE_SLACK).toEqual({ story: null, explorer: { shows: 1 }, challenge: { shows: 1 } });
    expect(sortGoals(finished("story", 3, []), COFFEE_SLACK.story).ingenuity).toBe(true);
    for (const style of ["explorer", "challenge"] as const) {
      expect(sortGoals(finished(style, 0, []), COFFEE_SLACK[style]).ingenuity, style).toBe(true);
      expect(sortGoals(finished(style, 1, []), COFFEE_SLACK[style]).ingenuity, style).toBe(true);
      expect(sortGoals(finished(style, 2, []), COFFEE_SLACK[style]).ingenuity, style).toBe(false);
    }
  });
  it("count Curiosity only when both questions were asked, Kindness only for a kind answer, and the feather", () => {
    const flag = (f: (typeof SORT_FLAGS)[number]): SortCommand => ({ type: "flag", flag: f });
    expect(sortGoals(finished("explorer", 0, [flag("askedDivision")]), COFFEE_SLACK.explorer).curiosity).toBe(false);
    expect(sortGoals(finished("explorer", 0, [flag("askedDivision"), flag("askedBirds")]), COFFEE_SLACK.explorer).curiosity).toBe(true);
    const all = sortGoals(finished("challenge", 1, [flag("askedBirds"), flag("askedDivision"), flag("kind"), flag("feather"), flag("answered")]), COFFEE_SLACK.challenge);
    expect(all).toMatchObject({ slips: 1, curiosity: true, ingenuity: true, kindness: true, feather: true });
    const blunt = sortGoals(finished("explorer", 0, [flag("answered")]), COFFEE_SLACK.explorer);
    expect([blunt.kindness, blunt.feather]).toEqual([false, false]);
  });
});

describe("a saved place", () => {
  const mid = (style: SortStyle) => run(fresh(style), [{ type: "place", item: coffeeDef(style).items[0]!, group: "legend" }, { type: "flag", flag: "askedBirds" }, { type: "show" }]);
  const refused = (x: unknown) => restoreSort(x, coffeeDef);
  const snap = (style: SortStyle) => JSON.parse(JSON.stringify(snapshotSort(mid(style)))) as Record<string, unknown>;
  it("comes back as it was, through a round trip of JSON, in every way of playing, and can be played on to its end", () => {
    for (const style of STYLES) {
      const s = mid(style);
      const back = restoreSort(JSON.parse(JSON.stringify(snapshotSort(s))), coffeeDef)!;
      expect(back).not.toBeNull();
      expect(back.placed).toEqual(s.placed);
      expect([back.moves, back.shows, back.flags, back.style, back.done, back.last]).toEqual([s.moves, s.shows, s.flags, style, false, null]);
      expect(back.items).toEqual(coffeeDef(style).items);
      expect(show(sorted(back)).done).toBe(true);
    }
  });
  it("refuses a card or a shelf that is not the way of playing's own, a count that is not a whole number, and what cannot be trusted at all", () => {
    const good = snap("explorer");
    const placed = good.placed as Record<string, string | null>;
    // The ban card is no card of Explorer, and "tray" is no shelf.
    for (const bad of [{ ...placed, ban: "stated" }, { ...placed, ethiopia: "tray" }, { ...placed, ethiopia: 3 }, { ...placed, ethiopia: "" }, [["ethiopia", "legend"]], "x", null, undefined, 4]) expect(refused({ ...good, placed: bad }), JSON.stringify(bad)).toBeNull();
    expect(refused({ ...snap("story"), placed: { husk: "stated" } })).toBeNull();
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined, 0]) expect(refused({ ...good, moves }), String(moves)).toBeNull();
    for (const shows of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, shows }), String(shows)).toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }, { ...good, flags: "feather" }, { ...good, flags: undefined }, { ...good, placed: undefined }]) expect(refused(bad)).toBeNull();
    // What the file says about the cards, the shelves, the answer, a finish and the last command is not taken, and unknown flags are dropped.
    const back = refused({ ...snap("story"), flags: ["feather", "askedBirds", "nonsense", 7, "kind", "kind"], done: true, last: { type: "show" }, items: ["x"], groups: ["y", "z"], answer: { x: "y" } })!;
    expect(back.flags).toEqual(["askedBirds", "kind", "feather"]);
    expect([back.done, back.last]).toEqual([false, null]);
    expect(back.items).toEqual(coffeeDef("story").items);
    expect(back.groups).toEqual(["stated", "tradition", "legend"]);
    expect({ ...back.answer }).toEqual({ ...coffeeDef("story").answer });
  });
});

describe("the picture's layout and hit-test", () => {
  const view = (s: SortState, rtl: boolean) => ({ items: s.items, placed: s.items.map((i) => (s.placed[i] === null ? null : s.groups.indexOf(s.placed[i]!))), groups: s.groups.length, rtl });
  const centre = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
  it.each(STYLES)("holds every card of %s on its shelf inside the picture, apart from every other, with room for any card on any shelf", (style) => {
    const s = sorted(fresh(style));
    const rects = cardRects(view(s, false));
    for (const r of rects) expect([r.x >= 0, r.y >= 0, r.x + r.w <= SORT_ART.w, r.y + r.h <= SORT_ART.h]).toEqual([true, true, true, true]);
    for (let a = 0; a < rects.length; a++) for (let b = a + 1; b < rects.length; b++) expect(Math.abs(rects[a]!.x - rects[b]!.x) >= SORT_ART.card || Math.abs(rects[a]!.y - rects[b]!.y) >= SORT_ART.card, `${a} ${b}`).toBe(true);
    const trays = trayRects(3, false);
    s.items.forEach((i, k) => {
      const t = trays[s.groups.indexOf(s.placed[i]!)]!;
      expect(rects[k]!.x).toBeGreaterThanOrEqual(t.x);
      expect(rects[k]!.x + rects[k]!.w).toBeLessThanOrEqual(t.x + t.w);
      expect(rects[k]!.y + rects[k]!.h).toBeLessThanOrEqual(t.y + t.h);
    });
    const { cols, rows } = trayGrid(3);
    expect(cols * rows).toBeGreaterThanOrEqual(s.items.length);
  });
  it.each(STYLES)("finds the card under the middle of every card, and the shelf under the head of every shelf, left to right and on a right to left page, in %s", (style) => {
    for (const rtl of [false, true]) {
      // Card to point: every card, off the shelves, is found in the band along the bottom; every card on its shelf is found there.
      const s = fresh(style);
      cardRects(view(s, rtl)).forEach((r, i) => expect(sortHit(centre(r).x, centre(r).y, view(s, rtl)), `${rtl} rest ${i}`).toEqual({ type: "card", item: i }));
      const p = sorted(fresh(style));
      cardRects(view(p, rtl)).forEach((r, i) => expect(sortHit(centre(r).x, centre(r).y, view(p, rtl)), `${rtl} shelf ${i}`).toEqual({ type: "card", item: i }));
      // Point to shelf: the head of each shelf is the shelf, and the band along the bottom where no card lies is the band.
      trayRects(3, rtl).forEach((t, g) => expect(sortHit(t.x + t.w / 2, t.y + 8, view(p, rtl)), `${rtl} head ${g}`).toEqual({ type: "tray", group: g }));
      const band = restBand(rtl);
      expect(sortHit(band.x + band.w - 3, band.y + 3, view(p, rtl))).toEqual({ type: "rest" });
    }
  });
  it("lays the shelves from the right on a right to left page, and finds nothing between the shelves or outside the picture", () => {
    const ltr = trayRects(3, false);
    const rtlT = trayRects(3, true);
    expect(ltr[0]!.x).toBeLessThan(ltr[1]!.x);
    expect(rtlT[0]!.x).toBeGreaterThan(rtlT[1]!.x);
    expect(rtlT[0]!.x).toBe(SORT_ART.w - ltr[0]!.x - ltr[0]!.w);
    const s = sorted(fresh("challenge"));
    const gap = (ltr[0]!.x + ltr[0]!.w + ltr[1]!.x) / 2;
    for (const [x, y] of [[gap, ltr[0]!.y + 40], [0, 0], [SORT_ART.w, SORT_ART.h], [-5, 10], [5000, 5000]] as [number, number][]) expect(sortHit(x, y, view(s, false)), `${x},${y}`).toBeNull();
  });
});

describe("the picture and the page", () => {
  const art = readFileSync(here("art", "coffee.ts"), "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
  const ui = readFileSync(here("ui", "coffee.ts"), "utf8");
  const page = readFileSync(here("ui", "sortpage.ts"), "utf8");
  it("draws no word, numeral or person: three shelf signs that differ in shape, eight card signs, and no face", () => {
    expect(art).not.toMatch(/fillText|strokeText/);
    expect((art.match(/^\s*\(c, r\) => \{/gm) ?? []).length).toBe(3);
    for (const card of COFFEE_CARDS) expect(art, card).toMatch(new RegExp(`^  ${card}\\(c\\) \\{`, "m"));
    expect(SORT_ART.w / SORT_ART.h).toBeCloseTo(1000 / 460, 6);
  });
  it("sets the picture as an image with a description, one list of choices for every card in a numbered list, a button that shows the record, a polite live region, and the key in real HTML", () => {
    expect(page).toMatch(/setAttribute\("role", "img"\)/);
    expect(page).toMatch(/aria-label/);
    expect(page).toMatch(/aria-live/);
    expect(page).toMatch(/h\("select"/);
    expect(page).toMatch(/h\("ol", \{ class: "tray-key" \}\)/);
    expect(page).toMatch(/spec\.numbered \? "ol" : "ul"/);
    expect(ui).toMatch(/numbered: true/);
    expect(ui).toMatch(/cq_where/);
    expect(ui).toMatch(/cq_show/);
    expect(ui).toMatch(/cq_shelf_line/);
    // The rules are given no clock and no randomness.
    const sim = readFileSync(here("sim", "sort.ts"), "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    expect(sim).not.toMatch(/Date\.now|performance\.|setTimeout|requestAnimationFrame|Math\.random|document\.|window\./);
  });
  it("shares one page between the two sorting quests: the animal cards' page and this one are each a spec handed to the same function, and neither copies it", () => {
    const jz = readFileSync(here("ui", "sort.ts"), "utf8");
    expect(jz).toMatch(/sortPage\(host, SPEC\)/);
    expect(ui).toMatch(/sortPage\(host, SPEC\)/);
    expect(jz.split("\n").length).toBeLessThan(100);
    expect(ui.split("\n").length).toBeLessThan(100);
    expect(page).not.toMatch(/jz_|cq_/);
  });
});

describe("the record behind the lines", () => {
  it("links only to records that exist in the museum's data, and each is one the Atlas subject names", () => {
    expect([...COFFEE_RECORDS]).toEqual(["invention/coffee-yemen", "invention/coffeehouse-yemen"]);
    for (const id of COFFEE_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("rests the narrator's lines on the record's own sentences: more than one name is credited, the plurality points to local traditions, the tree grew wild in Ethiopia, Kaffa is unproven, the Sufi nights, the spread, the two traditions, the source that does not take the tales as history", () => {
    const en = table("en");
    // "Three names contest the honour of the introduction: al-Dhabhani, al-Shadhili and al-'Aidarus": the line says "more than one name" and does not count them.
    expect(yemen).toContain("Three names contest the honour of the introduction: al-Dhabhani, al-Shadhili and al-'Aidarus");
    expect(en.cq_names_1).toBe("The museum's record says more than one name is credited with bringing coffee, and that so many names point to local traditions and not to one documented event.");
    expect(en.cq_names_1).not.toMatch(/three|two\b/i);
    expect(yemen).toContain("their plurality points to local traditions rather than one documented event");
    expect(yemen).toContain("native to Ethiopia");
    expect(yemen).toContain("a derivation from 'Kaffa' remains unproven");
    expect(yemen).toContain("the tree grew wild in Ethiopia");
    expect(yemen).toContain("drinking spread from Sufi circles because it aided wakefulness for devotional nights");
    expect(yemen).toContain("from Yemen it passed to Mecca, Cairo and Istanbul");
    expect(yemen).toContain("jurist Muhammad ibn Sa'id al-Dhabhani");
    expect(yemen).toContain("'Ali ibn 'Umar al-Shadhili");
    expect(yemen).toContain("the traditions compete rather than agree");
    expect(yemen).toContain("Ukers likewise treats the Omar-and-the-goats-type legends as unhistorical");
    // The record names the third name (al-'Aidarus) and the game gives it no card: a reviewer is asked about that (ledger HR-HH-37).
    for (const l of LANGS) for (const k of COFFEE_CARDS) expect(table(l)[`cq_c_${k}`], `${l}:${k}`).not.toMatch(/Aidarus|Aydarus|العيدروس|عیدروس/);
  });
  it("writes al-Dhabhani as the museum's Arabic record writes him, with the heh, and not with the ha that the brief typed", () => {
    expect(yemenAr).toContain("الذبهاني");
    expect(yemenAr).not.toContain("الذبحاني");
    expect(table("ar").cq_note_3).toContain("الفقيه الذبهاني في عدن");
    for (const [k, v] of Object.entries(table("ar"))) if (k.startsWith("cq_")) expect(v, k).not.toContain("الذبحاني");
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. One word differs from the brief: the Arabic spelling of al-Dhabhani in `cq_note_3` (the brief typed ح for the museum's ه). */
  const WRITTEN: [string, string, string][] = [
    ["cq_intro_1", "سقطت من صفحة الأطلس بطاقات عن القهوة. بعضها خبر ثابت، وبعضها رواية، وبعضها حكاية. فكيف نفرّق بينها؟", "Cards about coffee have fallen out of the page of the Atlas. Some are settled, some are tellings, and some are tales. How do we tell them apart?"],
    ["cq_intro_2", "لا نرمي بطاقة. نضع كل واحدة على رفّها: ما يقوله السجل صريحًا، وما يُروى، وما يُحكى.", "We throw no card away. We put each one on its shelf: what the record states, what is told, and what is a tale."],
    ["cq_names_1", "يقول سجل المتحف إن أكثر من اسم يُنسب إليه إدخال القهوة، وإن كثرة الأسماء تدل على روايات محلية لا على حدث واحد موثّق.", "The museum's record says more than one name is credited with bringing coffee, and that so many names point to local traditions and not to one documented event."],
    ["cq_word_1", "ويقول إن شجرة البن أصلها من إثيوبيا وكانت تنبت فيها برّية، وإن ردّ اسم القهوة إلى اسم كافا لم يثبت.", "It says the coffee tree comes from Ethiopia, where it grew wild, and that tracing the name of the drink to the name Kaffa remains unproven."],
    ["cq_note_1", "هذه لعبة وليست كتاب تاريخ. البطاقات والرفوف وأمين السجلات والطفل الذي يرتّبها وكل كلمة تُقال من خيال اللعب.", "This is a game, not a history. The cards, the shelves, the keeper of the records, the child who tidies them and every spoken line are invented for play."],
    ["cq_note_2", "من سجل المتحف: انتشر شرب القهوة في اليمن من حلقات الصوفية لأنها تعين على السهر في ليالي العبادة، ومن اليمن انتقلت إلى مكة والقاهرة وإسطنبول.", "From the museum's record: the drinking of coffee spread in Yemen from Sufi circles, because it helped them stay awake through nights of devotion, and from Yemen it passed to Mecca, Cairo and Istanbul."],
    ["cq_note_3", "أما من أدخلها فالروايات فيه مختلفة: رواية تنسبه إلى الفقيه الذبهاني في عدن، وأخرى إلى الشاذلي في المخا. يذكر السجل الروايتين ولا يرجّح واحدة.", "As for who brought it, the tellings differ: one credits the jurist al-Dhabhani at Aden, another al-Shadhili at Mocha. The record gives both and does not choose between them."],
    ["cq_note_4", "بُسِّط من أجل اللعب: ثلاثة رفوف فقط. والرفّ الثالث لا يقول إن الحكاية كذب، بل إن مصدر السجل لا يعدّها تاريخًا.", "Made simpler for play: there are only three shelves. The third shelf does not say the tale is a lie; it says the record's source does not take it as history."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' and the shelves' words", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    const en = table("en");
    const ar = table("ar");
    expect(en.cq_who_keeper).toBe("The keeper of the records, an invented person");
    expect(ar.cq_who_keeper).toBe("أمين السجلات، شخصية من الخيال");
    expect(en.cq_who_child).toBe("The child who tidies the cards, an invented person");
    expect(ar.cq_who_child).toBe("الطفل مرتّب البطاقات، شخصية من الخيال");
    expect([en.cq_g_stated, en.cq_g_tradition, en.cq_g_legend]).toEqual(["the record states it plainly", "a tradition: one of several tellings that do not agree", "a legend: the record's source does not take it as history"]);
    expect([en.cq_rec_coffee, en.cq_rec_house, en.cq_show]).toEqual(["coffee in Yemen", "the coffeehouse", "Show the record"]);
    // Four notes and no fifth; the third says who brought it and the fourth says that the shelves are simplified.
    expect(Object.keys(en).filter((k) => k.startsWith("cq_note_"))).toEqual(["cq_note_1", "cq_note_2", "cq_note_3", "cq_note_4"]);
  });
  it("anchors each line to the record's own file: the sentence of the record it rests on is there, in English and in Arabic", () => {
    // [key, a phrase of the English record, a phrase of the Arabic record]
    const rests: [string, string, string][] = [
      ["cq_names_1", "Three names contest the honour of the introduction", "ثلاثة أسماء تتنازع شرف الإدخال"],
      ["cq_word_1", "a derivation from 'Kaffa' remains unproven", "مع بقاء فرضية أصل «كافا» دون برهان"],
      ["cq_note_2", "drinking spread from Sufi circles because it aided wakefulness for devotional nights", "وانتشر الشرب من أوساط الصوفية"],
      ["cq_note_3", "the traditions compete rather than agree", "والروايات متنافسة لا متفق عليها"],
      ["cq_note_4", "Ukers likewise treats the Omar-and-the-goats-type legends as unhistorical", "يوافق يوكرز على أن قصص عمر والماعز لا تصح وقائع"],
    ];
    for (const [k, en, ar] of rests) {
      expect(table("en")[k], k).toBeTruthy();
      expect(yemen, `${k} en`).toContain(en);
      expect(yemenAr, `${k} ar`).toContain(ar);
    }
  });
  it("never calls an invented character the Messenger, in any language that has the word", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("cq_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) {
      if (!k.startsWith("cq_")) continue;
      expect(v.replace(/\{\w+\}/g, "").match(/[0-9٠-٩۰-۹]+/g) ?? [], `${l}:${k}`).toEqual([]);
    }
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("cq_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("cq_")) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
  });
  it("keeps every card's sentence short: not one is longer than 110 characters, in any language, and none is empty or the same as another", () => {
    for (const l of LANGS) {
      const sentences = COFFEE_CARDS.map((c) => table(l)[`cq_c_${c}`]!);
      for (const [i, s] of sentences.entries()) {
        expect(s.trim().length, `${l}:${COFFEE_CARDS[i]}`).toBeGreaterThan(0);
        expect(s.length, `${l}:${COFFEE_CARDS[i]} is ${s.length}`).toBeLessThanOrEqual(110);
      }
      expect(new Set(sentences).size, l).toBe(COFFEE_CARDS.length);
      expect(new Set(COFFEE_CARDS.map((c) => table(l)[`cq_n_${c}`])).size, l).toBe(COFFEE_CARDS.length);
    }
  });
  const ui = readFileSync(here("ui", "coffee.ts"), "utf8");
  it("has every key the page uses, in all seven languages, with no part left empty, the same placeholders, and no key that nothing uses", () => {
    const keys = new Set([...ui.matchAll(/"(cq_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const c of COFFEE_CARDS) for (const p of ["cq_c_", "cq_n_"]) keys.add(`${p}${c}`);
    for (const g of ["stated", "tradition", "legend"]) keys.add(`cq_g_${g}`);
    expect(keys.size).toBeGreaterThan(60);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("cq_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("cq_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("cq_")));
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("is appended at the end of each language's file, after the keys of the ninth quest, and only the next quests' keys (`ah_`, then `rz_`, then `kr_`) and the journey's (`jn_`), then al-Jazari's room's (`jr_`) come after it", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("cq_"));
      expect(first, l).toBeGreaterThan(0);
      expect(ks.slice(first, first + ks.filter((k) => k.startsWith("cq_")).length).every((k) => k.startsWith("cq_")), l).toBe(true);
      expect(ks.slice(first + ks.filter((k) => k.startsWith("cq_")).length).every((k) => k.startsWith("ah_") || k.startsWith("rz_") || k.startsWith("kr_") || k.startsWith("jn_") || k.startsWith("jr_")), l).toBe(true);
      expect(ks[first - 1]!.startsWith("ts_"), l).toBe(true);
    }
  });
  it("no longer says in the hub that nine quests are built, in any language (the count itself is pinned in leaves.gtest.ts)", () => {
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bnine quests|\bneuf quêtes|\bnueve misiones|\bdokuz görev|\bsembilan misi|تسع مهمات|نو مہمیں/i);
  });
  it("takes each name from the museum's records unless it is on a short list of named exceptions, which is exactly this list", () => {
    const label = (path: string) => (parse(readFileSync(resolve(root, "data", path), "utf8")) as { label: Record<string, string | undefined> }).label;
    // The form of each name the cards use, in each language, and the record that has it.
    const USED: Record<string, Record<string, string>> = {
      ethiopia: { ar: "إثيوبيا", en: "Ethiopia", ur: "ایتھوپیا", fr: "Éthiopie", es: "Etiopía", tr: "Etiyopya", id: "Ethiopia" },
      yemen: { ar: "اليمن", en: "Yemen", ur: "یمن", fr: "Yémen", es: "Yemen", tr: "Yemen", id: "Yaman" },
      mecca: { ar: "مكة", en: "Mecca", ur: "مکہ", fr: "La Mecque", es: "La Meca", tr: "Mekke", id: "Mekah" },
      cairo: { ar: "القاهرة", en: "Cairo", ur: "قاہرہ", fr: "Caire", es: "El Cairo", tr: "Kahire", id: "Kairo" },
      istanbul: { ar: "إسطنبول", en: "Istanbul", ur: "استنبول", fr: "Istanbul", es: "Estambul", tr: "İstanbul", id: "Istanbul" },
      aden: { ar: "عدن", en: "Aden", ur: "عدن", fr: "Aden", es: "Adén", tr: "Aden", id: "Aden" },
      dhabhani: { ar: "الذبهاني", en: "al-Dhabhani", ur: "ذبھانی", fr: "al-Dhabhani", es: "al-Dhabhani", tr: "el-Dhabhani", id: "al-Dhabhani" },
      shadhili: { ar: "الشاذلي", en: "al-Shadhili", ur: "شاذلی", fr: "al-Shadhili", es: "al-Shadhili", tr: "el-Shadhili", id: "al-Shadhili" },
    };
    const RECORD: Record<string, string> = { ethiopia: "place/ethiopia.yaml", yemen: "place/yemen.yaml", mecca: "place/mecca.yaml", cairo: "place/cairo.yaml", istanbul: "place/istanbul.yaml", aden: "place/aden.yaml", dhabhani: "person/muhammad-ibn-said-al-dhabhani.yaml", shadhili: "person/ali-ibn-umar-al-shadhili.yaml" };
    // Where the game's form is not the record's label, and why. French: the label of Mecca lacks the article and the label of Ethiopia its accent (the museum's French records write La Mecque, Éthiopie; the label of Cairo is the card's "au Caire" without its article). Spanish: Mecca is lower-cased in the label (la meca) and Istanbul is Estanbul (the museum's Spanish records write La Meca and Estambul). Arabic: the label of Mecca carries the epithet al-Mukarrama (the museum's records and the brief write مكة). Urdu: the label of al-Dhabhani has the Arabic heh (the museum's Urdu pages write ذبھانی), and the label of al-Shadhili is the mangled الشہدلی (the museum's Urdu pages write شاذلی and الشاذلی, 88 and 12 times). Turkish and Indonesian: the two persons have no label there, so the transliteration of the English label is used.
    const EXCEPTIONS: Record<string, string> = {
      "ethiopia:fr": "Ethiopie -> Éthiopie",
      "istanbul:es": "Estanbul -> Estambul",
      "mecca:ar": "مكة المكرمة -> مكة",
      "mecca:es": "la meca -> La Meca",
      "mecca:fr": "Mecque -> La Mecque",
      "dhabhani:ur": "محمد بن سعید ذبهانی -> ذبھانی",
      "dhabhani:tr": "undefined -> el-Dhabhani",
      "dhabhani:id": "undefined -> al-Dhabhani",
      "shadhili:ur": "علی ابن عمر الشہدلی -> شاذلی",
      "shadhili:tr": "undefined -> el-Shadhili",
      "shadhili:id": "undefined -> al-Shadhili",
    };
    const found: Record<string, string> = {};
    for (const [name, path] of Object.entries(RECORD)) {
      const lab = label(path);
      for (const l of LANGS) {
        const used = USED[name]![l]!;
        const lb = lab[l];
        // A person's label is the full name: the short form on the card is in it. A place's label is the name itself.
        const ok = name === "dhabhani" || name === "shadhili" ? (lb ?? "").includes(used) : lb === used;
        if (!ok) found[`${name}:${l}`] = `${lb} -> ${used}`;
      }
    }
    expect(found).toEqual(EXCEPTIONS);
    // The names the cards use are the names on the cards.
    const needs: [string, string][] = [["cq_c_ethiopia", "ethiopia"], ["cq_c_husk", "yemen"], ["cq_c_spread", "yemen"], ["cq_c_spread", "mecca"], ["cq_c_spread", "cairo"], ["cq_c_spread", "istanbul"], ["cq_c_ban", "mecca"], ["cq_c_dhabhani", "aden"], ["cq_c_dhabhani", "dhabhani"], ["cq_c_shadhili", "shadhili"]];
    for (const l of LANGS) for (const [k, name] of needs) expect(table(l)[k], `${l}:${k}:${name}`).toContain(USED[name]![l]);
    // Mocha has no record of its own among the museum's places: its name is the one the museum's coffee record uses, with the forms below.
    for (const f of ["mocha", "mokha", "moka", "al-mukha", "mukha"]) expect(existsSync(resolve(root, "data", "place", `${f}.yaml`)), f).toBe(false);
    const MOCHA: Record<string, string> = { ar: "المخا", en: "Mocha", ur: "موکا", fr: "Mocha", es: "Mocha", tr: "Mokha", id: "Mokha" };
    for (const l of LANGS) expect(table(l).cq_c_shadhili, l).toContain(MOCHA[l]!);
  });
});

describe("the two leftovers of the ninth quest", () => {
  const app = readFileSync(here("ui", "app.ts"), "utf8");
  it("makes every quest that animates a run follow the game's setting, the system preference and `motion=reduced`, through one helper that is handed to all of them", () => {
    expect(app).toMatch(/const calm = \(\) => asked\.motion === "reduced" \|\| settings\(\)\.reducedMotion \|\| window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches;/);
    expect(app).toMatch(/reducedMotion: calm,/);
    // No page quest is given the game's setting alone.
    expect(app).not.toMatch(/reducedMotion: \(\) => settings\(\)\.reducedMotion/);
    expect(app).not.toMatch(/reducedMotion: \(\) => calm\(\)/);
    // The quests that read it: the clock, the row page (shared by the paper and al-Razi's leaves) and the two circles (and the road, which has the host's function and does not animate).
    for (const f of ["clock", "rowpage", "couple"]) expect(readFileSync(here("ui", `${f}.ts`), "utf8"), f).toMatch(/host\.reducedMotion\(\)/);
    for (const f of ["paper", "leaves"]) expect(readFileSync(here("ui", `${f}.ts`), "utf8"), f).toMatch(/rowPage\(host, SPEC\)/);
  });
  it("draws the chosen radio button of a finished quest by shape (a ring with a solid disc and bold, underlined words) and not in the browser's pale disabled style", () => {
    const css = readFileSync(here("ui", "hudhud.css"), "utf8");
    expect(css).toMatch(/input\[type="radio"\] \{ appearance: none;/);
    expect(css).toMatch(/input\[type="radio"\]::after \{ content: ""/);
    expect(css).toMatch(/input\[type="radio"\]:checked::after \{ transform: scale\(1\); \}/);
    expect(css).toMatch(/input\[type="radio"\]:disabled \{ cursor: default; opacity: 1;/);
    expect(css).toMatch(/input:disabled:checked\) span \{ text-decoration: underline;/);
  });
});
