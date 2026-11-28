// Al-Jahiz's room (content/jahiz-room.ts, art/jahiz-room.ts, scenes/jahiz.ts, ui/jahizroom.ts) on the shared sorting room
// made for the coffee room (sim/sortroom.ts, ui/sortroom.ts): the animal cards sorted by flying. A tray's sign touched with
// a card in Hudhud's beak gives exactly the command the page gives for that card and that tray (`place`), the carried
// card's empty place on the bench exactly the page's "not placed yet" (`place` with no tray), and the bell exactly the
// page's "Show al-Jahiz" (`show`); picking a card up gives no command, as choosing one on the page's picture gives none; a
// question, an answer or the feather a `flag`; so the moves, the failed showings, the goals and the three ways of playing
// are the page quest's. After the second of his two questions the hoopoe's lines come once, as on the page. The place
// kept is the quest's own snapshot with the card in the beak added. The room draws no text, its trays stand side by side
// at the same height, every card, sign and the bell is reached by flight and none from the floor, and the room's door and
// people pass the same tests as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CARDS, SORT_RECORDS, SORT_SLACK, sortDef } from "../content/sort";
import { JZR_APPROACH, JZR_BASKET, JZR_BELL, JZR_BENCH, JZR_DOOR, JZR_IDS, JZR_ROW, JZR_SCRIPTS, JZR_SHELVES, JZR_SPEC, JZR_START, JZR_TRAYS, JZR_WORLD, REACH, benchSpot, jzrRoom, jzrThings, signSpot, trayBox, traySpot, type JzrThing } from "../content/jahiz-room";
import { CQR_DOOR, CQR_WORLD, cqrRoom } from "../content/coffee-room";
import { DOOR, WORLD } from "../content/workshop";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { choicesOf, faults } from "../narrative/dialogue";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover, type Room } from "../sim/move";
import { applySort, newSort, restoreSort, snapshotSort, sortGoals, type SortCommand, type SortStyle } from "../sim/sort";
import { afterDone, applySortRoom, commandOf, keptAfter, newSortRoom, restoreSortRoom, snapshotSortRoom, sortRoomGoals, thingOf, type SortRoomCommand, type SortRoomState } from "../sim/sortroom";

const STYLES: SortStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A room past its opening words. */
const ready = (style: SortStyle): SortRoomState => applySortRoom(JZR_SPEC, newSortRoom(JZR_SPEC, style), { type: "skip" }).state;
const touch = (s: SortRoomState, id: string) => applySortRoom(JZR_SPEC, s, { type: "touch", id });
const playAll = (s: SortRoomState, cs: SortRoomCommand[]) => cs.reduce((x, c) => applySortRoom(JZR_SPEC, x, c).state, s);
const touches = (s: SortRoomState, ids: string[]) => playAll(s, ids.map((id) => ({ type: "touch", id })));
/** A card carried to a tray: the card, then the tray's sign. */
const carryTo = (s: SortRoomState, item: string, group: string) => touches(s, [`card-${item}`, `group-${group}`]);
/** Every card carried to the tray of al-Jahiz's division. */
const sortAll = (s: SortRoomState) => s.sort.items.reduce((x, i) => carryTo(x, i, x.sort.answer[i]!), s);
/** A group the card does not belong to. */
const other = (s: SortRoomState, item: string) => s.sort.groups.find((g) => g !== s.sort.answer[item])!;

describe("al-Jahiz's room: a card carried to a tray, the bench and the bell are the page quest's commands", () => {
  it.each(STYLES)("in %s, picking a card up gives no command (as choosing it on the page's picture), and putting it on a tray's sign is the page's `place` for that card and tray, from the start, part way and after a wrong showing", (style) => {
    const s0 = ready(style);
    const items = s0.sort.items;
    const part = carryTo(carryTo(s0, items[0]!, other(s0, items[0]!)), items[1]!, s0.sort.answer[items[1]!]!);
    const wrongShown = touch(carryTo(sortAll(s0), items[0]!, other(s0, items[0]!)), "bell").state;
    expect(wrongShown.sort.shows).toBe(1);
    for (const start of [s0, part, wrongShown]) {
      for (const item of items) {
        const picked = touch(start, `card-${item}`);
        expect(picked.commands, item).toEqual([]);
        expect(picked.state.sort, item).toBe(start.sort);
        expect(picked.state.carrying).toBe(item);
        for (const group of s0.sort.groups) {
          const r = touch(picked.state, `group-${group}`);
          const want: SortCommand = { type: "place", item, group };
          if (start.sort.placed[item] === group) {
            expect(r.commands).toEqual([]);
            expect(r.state.sort).toBe(start.sort);
            expect(r.happened).toEqual([{ type: "drop", item }]);
          } else {
            expect(r.commands, `${item} ${group}`).toEqual([want]);
            expect(r.state.sort, `${item} ${group}`).toEqual(applySort(start.sort, want));
            expect(commandOf(JZR_SPEC, picked.state, `group-${group}`)).toEqual(want);
          }
          expect(r.state.carrying).toBeNull();
        }
      }
    }
  });
  it.each(STYLES)("in %s, a card carried from its tray and put on its own empty place on the bench is the page's `place` with no tray; the place is there only while that card is carried", (style) => {
    const s0 = ready(style);
    const item = s0.sort.items[1]!;
    const placed = carryTo(s0, item, s0.sort.groups[0]!);
    expect(thingOf(JZR_SPEC, placed, `rest-${item}`)).toBeNull();
    const lifted = touch(placed, `card-${item}`).state;
    expect(jzrThings(lifted, false).filter((t) => t.kind === "rest").map((t) => t.id)).toEqual([`rest-${item}`]);
    const r = touch(lifted, `rest-${item}`);
    const want: SortCommand = { type: "place", item, group: null };
    expect(r.commands).toEqual([want]);
    expect(r.state.sort).toEqual(applySort(placed.sort, want));
    expect(r.state.carrying).toBeNull();
  });
  it.each(STYLES)("in %s, the bell is the page's 'Show al-Jahiz': refused and not counted with a card not placed, counted when a card is in the wrong tray, the end when every card is right; with a card carried it is put back first", (style) => {
    const s0 = ready(style);
    const first = touch(s0, "bell");
    expect(first.commands).toEqual([{ type: "show" }]);
    expect(first.state.sort.shows).toBe(0);
    expect(first.state.sort.last).toEqual({ type: "show", refused: true, unplaced: s0.sort.items.length });
    const items = s0.sort.items;
    const odd = items.includes("bat") ? "bat" : items[0]!;
    const almost = carryTo(sortAll(s0), odd, other(s0, odd));
    const carrying = touch(almost, `card-${items[1]}`).state;
    const wrong = touch(carrying, "bell");
    expect(wrong.happened).toEqual([{ type: "drop", item: items[1] }, { type: "show" }]);
    expect(wrong.state.sort).toEqual(applySort(almost.sort, { type: "show" }));
    expect(wrong.state.sort.shows).toBe(1);
    expect(wrong.state.sort.done).toBe(false);
    const right = touch(carryTo(wrong.state, odd, s0.sort.answer[odd]!), "bell").state;
    expect(right.sort.done).toBe(true);
    expect(right.sort.shows).toBe(1);
  });
  it.each(STYLES)("in %s, the cards sorted by touch finish the quest as the page does: the same sorting, the page's goals, Hudhud's last line, and nothing more is touched", (style) => {
    const done = touch(sortAll(ready(style)), "bell").state;
    let page = newSort(style, sortDef(style));
    for (const i of page.items) page = applySort(page, { type: "place", item: i, group: page.answer[i]! });
    page = applySort(page, { type: "show" });
    expect(done.sort).toEqual(page);
    expect(sortRoomGoals(JZR_SPEC, done)).toEqual(sortGoals(page, SORT_SLACK[style]));
    const after = afterDone(JZR_SPEC, done);
    expect(after.talk?.script).toBe("done");
    expect(JZR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("jz_done_1");
    const quiet = applySortRoom(JZR_SPEC, after, { type: "skip" }).state;
    for (const t of jzrThings(quiet, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
  it("has the quest's own cards and trays in each way of playing: two trays in Story and Explorer, five in Challenge, and its things are al-Jahiz, the girl, the basket, the bell and one sign a tray", () => {
    expect(ready("story").sort.groups).toHaveLength(2);
    expect(ready("explorer").sort.groups).toHaveLength(2);
    expect(ready("challenge").sort.groups).toHaveLength(5);
    expect(ready("challenge").sort.items).toEqual([...CARDS]);
    for (const style of STYLES) {
      const s = ready(style);
      expect(jzrThings(s, false).map((t) => t.kind).filter((k) => k !== "card")).toEqual(["jahiz", "girl", "basket", "bell", ...s.sort.groups.map(() => "group")]);
      for (const t of jzrThings(s, false)) if (t.kind !== "bell") expect(commandOf(JZR_SPEC, s, t.id), t.id).toBeNull();
    }
    expect(JZR_IDS).toEqual({ voice: "jahiz", kid: "girl", hide: "basket", bell: "bell" });
  });
});

describe("al-Jahiz's room: the place kept", () => {
  it("survives a snapshot with the card in the beak: the sorting's own snapshot plus `carrying`, taken up by the page as it is, and the page's taken up by the room with an empty beak", () => {
    const s = ready("explorer");
    const mid = playAll(carryTo(carryTo(s, "bat", "exp_in"), "ostrich", "exp_out"), [{ type: "touch", id: "card-crow" }, { type: "touch", id: "basket" }, { type: "skip" }]);
    expect(mid.carrying).toBe("crow");
    const snap = JSON.parse(JSON.stringify(snapshotSortRoom(mid)));
    expect(snap).toEqual({ ...snapshotSort(mid.sort), carrying: "crow" });
    const back = restoreSortRoom(JZR_SPEC, snap)!;
    expect(back.carrying).toBe("crow");
    expect(back.sort.placed).toEqual(mid.sort.placed);
    expect(back.sort.flags).toEqual(["feather"]);
    expect(back.talk).toBeNull();
    expect(restoreSort(snap, sortDef)?.placed).toEqual(mid.sort.placed);
    expect(restoreSortRoom(JZR_SPEC, snapshotSort(mid.sort))?.carrying).toBeNull();
    // A card that is not of this way of playing comes back as an empty beak; a bad sorting as nothing.
    expect(restoreSortRoom(JZR_SPEC, { ...snapshotSortRoom(touch(ready("story"), "card-eagle").state), carrying: "bat" })?.carrying).toBeNull();
    expect(restoreSortRoom(JZR_SPEC, { ...snap, moves: -1 })).toBeNull();
  });
  it("is kept by the page's rule with the beak added", () => {
    const s = ready("challenge");
    const step = (x: SortRoomState, c: SortRoomCommand) => {
      const r = applySortRoom(JZR_SPEC, x, c);
      return { r, kept: keptAfter(x, r.state) };
    };
    const picked = step(s, { type: "touch", id: "card-bat" });
    expect(picked.kept).toEqual({ ...snapshotSort(s.sort), carrying: "bat" });
    expect(step(picked.r.state, { type: "touch", id: "card-bat" }).kept).toBeNull();
    expect(step(s, { type: "touch", id: "jahiz" }).kept).toBeUndefined();
    expect(step(picked.r.state, { type: "touch", id: "group-ch_bat" }).kept).toMatchObject({ moves: 1, carrying: null, placed: { bat: "ch_bat" } });
  });
});

describe("al-Jahiz's room: talk is the page quest's questions and answers", () => {
  const voice = (s: SortRoomState) => touch(s, "jahiz").state;
  const pickKey = (s: SortRoomState, key: string) => {
    // The choices come once the node's last line is showing.
    while (choicesOf(JZR_SCRIPTS, s.talk!, new Set<string>(s.sort.flags)).length === 0) s = applySortRoom(JZR_SPEC, s, { type: "forward" }).state;
    const i = choicesOf(JZR_SCRIPTS, s.talk!, new Set<string>(s.sort.flags)).findIndex((c) => c.key === key);
    expect(i, key).toBeGreaterThanOrEqual(0);
    return applySortRoom(JZR_SPEC, s, { type: "choose", index: i });
  };
  const linesOf = (s: SortRoomState) => JZR_SCRIPTS.voice!.nodes[s.talk!.node]!.lines.map((l) => [l.who, l.key]);
  it("asks about his division of animals and about the birds with the narrator's lines (the page's own), and after the second of the two the hoopoe's lines come, once, in either order", () => {
    for (const [a, b, flagA, flagB, keyA, keyB] of [
      ["jz_ask_division", "jz_ask_birds", "askedDivision", "askedBirds", "jz_divide_1", "jz_birds_1"],
      ["jz_ask_birds", "jz_ask_division", "askedBirds", "askedDivision", "jz_birds_1", "jz_divide_1"],
    ] as const) {
      const s = voice(ready("explorer"));
      expect(linesOf(s)).toEqual([["voice", "jzr_jahiz_hello"]]);
      // Each question is offered once at a time.
      expect(choicesOf(JZR_SCRIPTS, s.talk!, new Set()).map((c) => c.key)).toEqual(["jz_ask_division", "jz_ask_birds", "jzr_thanks"]);
      let r = pickKey(s, a);
      expect(r.commands).toEqual([{ type: "flag", flag: flagA }]);
      expect(linesOf(r.state)).toEqual([["narrator", keyA]]);
      r = pickKey(r.state, b);
      expect(r.commands).toEqual([{ type: "flag", flag: flagB }]);
      expect(linesOf(r.state)).toEqual([["narrator", keyB], ["narrator", "jz_hoopoe_1"], ["hudhud", "jz_hoopoe_2"]]);
      expect(sortRoomGoals(JZR_SPEC, r.state).curiosity).toBe(true);
      // Asked again, the answer comes without the hoopoe's lines.
      r = pickKey(r.state, a);
      expect(linesOf(r.state)).toEqual([["narrator", keyA]]);
      r = pickKey(r.state, "jzr_thanks");
      expect(linesOf(r.state)).toEqual([["voice", "jzr_jahiz_bye"]]);
    }
  });
  it("brings the hoopoe's lines once when the two questions are asked in two talks, and not again in a third", () => {
    let s = applySortRoom(JZR_SPEC, pickKey(voice(ready("challenge")), "jz_ask_division").state, { type: "skip" }).state;
    s = voice(s);
    expect(choicesOf(JZR_SCRIPTS, s.talk!, new Set(s.sort.flags)).map((c) => c.key)).toEqual(["jz_ask_division", "jz_ask_birds", "jzr_thanks"]);
    const second = pickKey(s, "jz_ask_birds").state;
    expect(linesOf(second).map((l) => l[1])).toEqual(["jz_birds_1", "jz_hoopoe_1", "jz_hoopoe_2"]);
    const third = voice(applySortRoom(JZR_SPEC, second, { type: "skip" }).state);
    for (const key of ["jz_ask_division", "jz_ask_birds"]) expect(linesOf(pickKey(third, key).state)).toHaveLength(1);
  });
  it("the girl answered kindly is Kindness and answered; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 0 }]);
    expect(kind.sort.flags).toEqual(["kind", "answered"]);
    expect(touch(applySortRoom(JZR_SPEC, kind, { type: "skip" }).state, "girl").state.talk?.script).toBe("kidKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 1 }]);
    expect(blunt.sort.flags).toEqual(["answered"]);
    expect(sortRoomGoals(JZR_SPEC, blunt).kindness).toBe(false);
    expect(JZR_SCRIPTS.kid!.nodes["1"]!.lines[0]!.key).toBe("jz_girl_1");
  });
  it("in the basket of spare cards on the shelf of books is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "basket");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(JZR_SCRIPTS.hide!.nodes["1"]!.lines[0]!.key).toBe("jz_feather_1");
    const again = touch(applySortRoom(JZR_SPEC, r.state, { type: "skip" }).state, "basket");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("hideAgain");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the room is touched", () => {
    const s = newSortRoom(JZR_SPEC, "challenge");
    expect(JZR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "jz_intro_1"], ["voice", "jz_intro_2"]]);
    for (const id of ["card-bat", "group-ch_bat", "bell", "basket", "girl"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(JZR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the animal cards' quest's", () => {
    const keys = new Set(Object.values(JZR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    expect([...keys].filter((k) => !k.startsWith("jz_")).sort()).toEqual(["jzr_jahiz_bye", "jzr_jahiz_hello", "jzr_thanks"]);
  });
});

describe("al-Jahiz's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("jzr_"));
  it("are twenty-one, at the end of every table, in the same order", () => {
    expect(keys).toHaveLength(21);
    for (const l of LANGS) expect(Object.keys(tables[l]!).slice(-keys.length), l).toEqual(keys);
  });
  it("say that the room, the trays, the cards and the bell are invented for play and that his division is not today's science, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.jzr_note_room).toBe("الغرفة والصواني والبطاقات والجرس من خيال اللعب، وليست صورة لمكان عمل الجاحظ. وتقسيم الجاحظ ليس تصنيف العلم اليوم.");
    expect(tables.en!.jzr_note_room).toBe("The room, the trays, the cards and the bell are invented for play; they are not a picture of where al-Jahiz worked. Al-Jahiz's division is not how science sorts animals today.");
  });
  it("carry no parenthesis, no digit and no honorific, and have the same placeholders as English", () => {
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
  it("make no historical claim in the room's own lines: no place, date, book, creature or group of the record (the cards and the trays keep the quest's words)", () => {
    const NAMES = /\b(basra|baghdad|iraq|caliph|abbasid|mutazil\w*|book of animals|hayawan|eagle|vulture|crow|bat|ostrich|locust|bee|hoopoe|talons?|beak of prey|mammals?|feathers?|wings?|century|years?)\b/i;
    for (const k of keys.filter((x) => x !== "jzr_note_room")) expect(NAMES.test(tables.en![k]!), `en ${k}: ${tables.en![k]}`).toBe(false);
  });
  it("name every thing in the room; a card is named by the page's own words for it", () => {
    for (const style of STYLES)
      for (const rtl of [false, true]) {
        const s = touch(carryTo(ready(style), ready(style).sort.items[0]!, ready(style).sort.groups[0]!), `card-${ready(style).sort.items[0]}`).state;
        for (const t of jzrThings(s, rtl)) expect(t.kind === "card" ? t.name === "jz_where" : keys.includes(t.name), t.id).toBe(true);
      }
  });
  it("give a goodbye of the room's own, not another room's", () => {
    for (const l of LANGS) for (const o of ["cqr_keeper_bye", "ibr_ibn_bye", "krr_karima_bye", "rzr_razi_bye", "isr_idrisi_bye", "kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye", "d_scholar_bye"]) expect(tables[l]!.jzr_jahiz_bye, `${l} ${o}`).not.toBe(tables[l]![o]);
  });
  it("are every one used by the room's page or its things", () => {
    const ui = source("ui/jahizroom.ts") + source("content/jahiz-room.ts");
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

describe("al-Jahiz's room: no letters, and the page's own creatures", () => {
  it("its painting, the page's drawing it shares, its scene and its page never write text", () => {
    for (const f of ["art/jahiz-room.ts", "art/sort.ts", "art/kit.ts", "scenes/jahiz.ts", "ui/jahizroom.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(|font\s*=/);
  });
  it("painting every picture of the room calls neither fillText nor strokeText", async () => {
    const { ctx, calls } = counter();
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
    try {
      const art = await import("../art/jahiz-room");
      const shared = await import("../art/coffee-room");
      const cast = await import("../art/cast");
      art.jahizRoom(1);
      for (const [i, item] of CARDS.entries()) art.cardArt(1, item, i + 1);
      for (let g2 = 0; g2 < 5; g2++) art.signArt(1, g2);
      art.trayArt(1);
      art.basketArt(1);
      shared.bellArt(1);
      shared.focusArt(1);
      cast.jahiz(1);
      cast.cardGirl(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it("draws every card by the page quest's own code (shared, not a copy), and every tray by one picture", () => {
    const art = source("art/jahiz-room.ts");
    expect(art).toMatch(/import \{ animalFace, drawCard \} from "\.\/sort";/);
    expect(art).toContain('drawCard(c, { x: 4, y: 2, w: s, h: s }, animalFace(item), "none", "card");');
    expect(source("art/sort.ts")).toContain("export const animalFace");
    expect(source("scenes/jahiz.ts")).toContain('T("tray", () => trayArt(ts))');
    expect([...source("scenes/jahiz.ts").matchAll(/props\.(\w+)/g)].map((m) => m[1])).toEqual(["feather"]);
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

/** The room in many states: each way of playing at the start, every card in one tray, cards spread over the trays, sorted, and a card carried from a tray. */
function states(): { label: string; s: SortRoomState }[] {
  const out: { label: string; s: SortRoomState }[] = [];
  for (const style of STYLES) {
    const s0 = ready(style);
    const gs = s0.sort.groups;
    out.push({ label: `${style} start`, s: s0 });
    for (const g of gs) out.push({ label: `${style} all in ${g}`, s: s0.sort.items.reduce((x, i) => carryTo(x, i, g), s0) });
    out.push({ label: `${style} spread`, s: s0.sort.items.reduce((x, i, k) => (k % 4 === 3 ? x : carryTo(x, i, gs[k % gs.length]!)), s0) });
    out.push({ label: `${style} sorted`, s: sortAll(s0) });
    out.push({ label: `${style} carrying from a tray`, s: touch(carryTo(s0, s0.sort.items[2]!, gs[1]!), `card-${s0.sort.items[2]}`).state });
  }
  return out;
}
const SMALL: JzrThing["kind"][] = ["card", "group", "bell", "rest"];

describe("al-Jahiz's room: every card, every sign and the bell are reached by flight", () => {
  it.each(states().flatMap(({ label, s }) => [false, true].map((rtl) => [label, rtl, s] as const)))("in %s (right to left: %s), every thing flown to is in reach where the bird lands, and is the nearest thing in reach there, as the room engine chooses", (_label, rtl, s) => {
    const room = jzrRoom(s.sort.groups.length);
    const things = jzrThings(s, rtl);
    for (const t of things) {
      const at = landing(t, room, JZR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const chosen = things.filter((k) => near(k, at)).sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(chosen.id, t.id).toBe(t.id);
      if (SMALL.includes(t.kind)) expect(room.perches.some((p) => p.y === at.y && at.x >= p.x && at.x <= p.x + p.w), t.id).toBe(true);
    }
  });
  it.each(states().flatMap(({ label, s }) => [false, true].map((rtl) => [label, rtl, s] as const)))("in %s (right to left: %s), the reaches of the cards, the signs and the bell never meet", (_label, rtl, s) => {
    const small = jzrThings(s, rtl).filter((t) => SMALL.includes(t.kind));
    for (let i = 0; i < small.length; i++) for (let j = i + 1; j < small.length; j++) expect(Math.hypot(small[i]!.x - small[j]!.x, small[i]!.y - small[j]!.y), `${small[i]!.id} ${small[j]!.id}`).toBeGreaterThanOrEqual(small[i]!.reach + small[j]!.reach - 1e-9);
  });
  it("is generous on purpose: standing anywhere on the bench within half a step of a card's middle touches that card; in a tray, anywhere along a tier of cards touches the nearest", () => {
    expect(REACH.bench).toBe(JZR_ROW.step / 2);
    expect(REACH.tray).toBe(JZR_TRAYS.step / 2);
    for (const style of STYLES) {
      const s = ready(style);
      for (const c of jzrThings(s, false).filter((t) => t.kind === "card")) for (let dx = -REACH.bench + 1; dx < REACH.bench; dx += 3) expect(near(c, { x: c.x + dx, y: JZR_BENCH.top }), `${c.id} ${dx}`).toBe(true);
      const all = s.sort.items.reduce((x, i) => carryTo(x, i, s.sort.groups[0]!), s);
      for (const c of jzrThings(all, false).filter((t) => t.kind === "card")) for (let dx = -REACH.tray + 1; dx < REACH.tray; dx += 3) expect(near(c, { x: c.x + dx, y: c.y + 30 }), `${c.id} ${dx}`).toBe(true);
    }
  });
  it("no card, no sign, not the bell and not the basket can be touched from the floor, wherever the bird stands", () => {
    for (const { s } of states()) for (const rtl of [false, true]) for (const t of jzrThings(s, rtl).filter((k) => SMALL.includes(k.kind) || k.kind === "basket")) for (let x = t.x - 120; x <= t.x + 120; x += 5) expect(near(t, { x, y: JZR_WORLD.floor }), t.id).toBe(false);
  });
  it("the bench, both shelves of books and every tray's tiers and top can be reached from the floor by flight, each within one climb of the floor or of another that is, with two trays and with five", () => {
    const up = climb();
    for (const n of [2, 5]) {
      const perches = jzrRoom(n).perches;
      const reached = new Set<number>();
      let from: number[] = [JZR_WORLD.floor];
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
      expect(reached.size, `${n} trays`).toBe(perches.length);
    }
  });
  it("the basket with the feather in it needs flight: out of reach from the floor and from the bench, reached from the lower shelf of books", () => {
    const basket = jzrThings(ready("explorer"), false).find((t) => t.id === "basket")!;
    for (let x = JZR_BENCH.x; x <= JZR_BENCH.x + JZR_BENCH.w; x += 10) {
      expect(near(basket, { x, y: JZR_WORLD.floor })).toBe(false);
      expect(near(basket, { x, y: JZR_BENCH.top })).toBe(false);
    }
    expect(landing(basket, jzrRoom(2), JZR_APPROACH.basket).y).toBe(JZR_SHELVES.boards[0]);
    expect(JZR_BASKET.x).toBeLessThan(JZR_SHELVES.x + JZR_SHELVES.w);
  });
  it("holds every card of every way of playing on the bench and in any one tray, inside the bench and inside that tray", () => {
    for (const style of STYLES) {
      const n = sortDef(style).items.length;
      const g = sortDef(style).groups.length;
      for (const rtl of [false, true]) {
        for (let i = 0; i < n; i++) {
          const b = benchSpot(n, i, rtl);
          expect(b.x - REACH.bench).toBeGreaterThanOrEqual(JZR_BENCH.x);
          expect(b.x + REACH.bench).toBeLessThanOrEqual(JZR_BELL.x - REACH.bell);
          for (let k = 0; k < g; k++) {
            const c = traySpot(g, k, i, rtl);
            const t = trayBox(g, k, rtl);
            expect(c.x - REACH.tray).toBeGreaterThanOrEqual(t.x);
            expect(c.x + REACH.tray).toBeLessThanOrEqual(t.x + t.w);
          }
        }
      }
    }
    // On a page read right to left the cards' order and the trays are mirrored: the first card and the first tray on the right.
    expect(benchSpot(8, 0, true).x).toBeGreaterThan(benchSpot(8, 7, true).x);
    expect(signSpot(5, 0, true).x).toBeGreaterThan(signSpot(5, 4, true).x);
    expect(signSpot(2, 0, false).x).toBeLessThan(signSpot(2, 1, false).x);
  });
  it("stands the trays side by side at the same height: every sign at one height, the same tiers in every tray, no tray over another, all inside the row of trays and clear of the door", () => {
    for (const n of [2, 5])
      for (const rtl of [false, true]) {
        const signs = Array.from({ length: n }, (_, g) => signSpot(n, g, rtl));
        expect(new Set(signs.map((p) => p.y)).size).toBe(1);
        for (let slot = 0; slot < 9; slot++) expect(new Set(Array.from({ length: n }, (_, g) => traySpot(n, g, slot, rtl).y)).size).toBe(1);
        const boxes = Array.from({ length: n }, (_, g) => trayBox(n, g, rtl)).sort((a, b) => a.x - b.x);
        for (let i = 1; i < n; i++) expect(boxes[i]!.x).toBeGreaterThanOrEqual(boxes[i - 1]!.x + boxes[i - 1]!.w + 16);
        expect(boxes[0]!.x).toBeGreaterThanOrEqual(JZR_TRAYS.x);
        expect(boxes[n - 1]!.x + boxes[n - 1]!.w).toBeLessThanOrEqual(JZR_TRAYS.end);
        expect(JZR_TRAYS.end + 12).toBeLessThan(JZR_DOOR.x - 55);
      }
    expect(JZR_TRAYS.across * JZR_TRAYS.boards.length).toBeGreaterThanOrEqual(CARDS.length);
  });
});

describe("al-Jahiz's room: the door and the people, as in the other rooms", () => {
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, CQR_DOOR]) expect(JZR_DOOR).toEqual(d);
    for (const w of [WORLD, CQR_WORLD]) expect({ h: JZR_WORLD.height, floor: JZR_WORLD.floor, view: JZR_WORLD.view, w: JZR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    expect(jzrRoom(5).bounds).toEqual(cqrRoom().bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    for (const n of [2, 5]) {
      const room = jzrRoom(n);
      let m = newMover(250, room.floor);
      let carry = 0;
      let reached = false;
      for (let i = 0; i < 1200 && !reached; i++) {
        const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
        m = r.mover;
        carry = r.carry;
        reached = near(JZR_DOOR, m);
      }
      expect(reached).toBe(true);
      expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
    }
  });
  it("wherever the bird lands to touch a thing, the door is out of reach", () => {
    for (const { s } of states()) for (const rtl of [false, true]) for (const t of jzrThings(s, rtl)) expect(near(JZR_DOOR, landing(t, jzrRoom(s.sort.groups.length), JZR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("puts the girl and al-Jahiz clear of the window's foot, of the bench and of each other", () => {
    const jahiz = drawnBox(SCHOLAR, JZR_START.jahiz, JZR_WORLD.floor, "either");
    const girl = drawnBox(HELPER, JZR_START.girl, JZR_WORLD.floor, "either");
    expect(jahiz.right).toBeLessThan(JZR_BENCH.x - 20);
    expect(girl.right).toBeLessThan(jahiz.left);
  });
});

describe("al-Jahiz's room: in words, and where it is used", () => {
  it("says the page's own sentences for a place and a showing, and the quest's notes", () => {
    const room = source("ui/jahizroom.ts");
    for (const k of ["jz_did_place", "jz_did_unplace", "jz_refused", "jz_wrong_story", "jz_wrong_explorer", "jz_wrong_challenge", "jz_did_solved", "jz_progress", "jz_progress_shows", "jz_tray_line", "jz_note_1", "jz_note_3", "jz_note_4", "jz_review"]) expect(room, k).toContain(`"${k}"`);
    expect(SORT_RECORDS).toHaveLength(2);
  });
  it("is opened from the Atlas and the journey as al-Jahiz's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[SORT_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*jahizRoom\(/);
    expect(app).toContain("fallback: () => openPage(SORT_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(SORT_QUEST, (snap) => restoreSortRoom(JZR_SPEC, snap))");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(SORT_QUEST, snap)");
    expect(app).toContain("startSort: () => openPage(SORT_QUEST, null, true)");
    expect(app).toContain("startSortRoom: () => openPage(SORT_QUEST)");
  });
  it("lays the room out again for the way of playing it is built for: the trays and their perches are that way's", () => {
    expect(source("scenes/jahiz.ts")).toContain("this.layout.room = jzrRoom(groups);");
    expect(jzrRoom(2).perches.length).toBe(3 + 2 * 4);
    expect(jzrRoom(5).perches.length).toBe(3 + 5 * 4);
  });
});
