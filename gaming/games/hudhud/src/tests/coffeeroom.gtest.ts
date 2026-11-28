// The coffee room (content/coffee-room.ts, art/coffee-room.ts, scenes/coffee.ts, ui/coffeeroom.ts) on the shared sorting
// room (sim/sortroom.ts, ui/sortroom.ts): the journey of coffee sorted by flying. A shelf's sign touched with a card in
// Hudhud's beak gives exactly the command the page gives for that card and that shelf (`place`), the carried card's empty
// place on the table exactly the page's band of cards not placed (`place` with no shelf), and the bell exactly the page's
// "Show the record" (`show`); picking a card up gives no command, as choosing one on the page's picture gives none; a
// question, an answer or the feather a `flag`; so the moves, the failed showings, the goals and the three ways of playing
// are the page quest's. The place kept is the quest's own snapshot with the card in the beak added. The room draws no
// text, every card, sign and the bell is reached by flight and none from the floor, and the room's door and people pass
// the same tests as the other rooms'. The shared module is also proved here on a made-up set of cards and groups.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { COFFEE_RECORDS, COFFEE_SLACK, SHELVES, coffeeDef } from "../content/coffee";
import { CQR_APPROACH, CQR_BELL, CQR_CASE, CQR_DOOR, CQR_IDS, CQR_ROW, CQR_SCRIPTS, CQR_SPEC, CQR_START, CQR_TABLE, CQR_WORLD, REACH, SECTION, boxSpot, cqrRoom, cqrThings, shelfSpot, signSpot, tableSpot, type CqrThing } from "../content/coffee-room";
import { IBR_DOOR, IBR_WORLD, ibrRoom } from "../content/battuta-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { HELPER, SCHOLAR, drawnBox } from "../content/people";
import { faults, type Script } from "../narrative/dialogue";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover, type Room } from "../sim/move";
import { applySort, newSort, restoreSort, snapshotSort, sortGoals, type SortCommand, type SortStyle } from "../sim/sort";
import { afterDone, applySortRoom, cardPlaces, commandOf, keptAfter, newSortRoom, restoreSortRoom, snapshotSortRoom, sortRoomGoals, thingOf, type SortRoomCommand, type SortRoomSpec, type SortRoomState } from "../sim/sortroom";

const STYLES: SortStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const source = (rel: string) => readFileSync(resolve(__dirname, "..", rel), "utf8");
/** A room past its opening words. */
const ready = (style: SortStyle): SortRoomState => applySortRoom(CQR_SPEC, newSortRoom(CQR_SPEC, style), { type: "skip" }).state;
const touch = (s: SortRoomState, id: string) => applySortRoom(CQR_SPEC, s, { type: "touch", id });
const playAll = (s: SortRoomState, cs: SortRoomCommand[]) => cs.reduce((x, c) => applySortRoom(CQR_SPEC, x, c).state, s);
const touches = (s: SortRoomState, ids: string[]) => playAll(s, ids.map((id) => ({ type: "touch", id })));
/** A card carried to a shelf: the card, then the shelf's sign. */
const carryTo = (s: SortRoomState, item: string, group: string) => touches(s, [`card-${item}`, `group-${group}`]);
/** Every card carried to the shelf the record treats it on. */
const sortAll = (s: SortRoomState) => s.sort.items.reduce((x, i) => carryTo(x, i, x.sort.answer[i]!), s);

describe("the coffee room: a card carried to a shelf, the table and the bell are the page quest's commands", () => {
  it.each(STYLES)("in %s, picking a card up gives no command (as choosing it on the page's picture), and putting it on a shelf's sign is the page's `place` for that card and shelf, from the start, part way and after a wrong showing", (style) => {
    const s0 = ready(style);
    const items = s0.sort.items;
    const part = carryTo(carryTo(s0, items[0]!, "legend"), items[1]!, "stated");
    const wrong = touch(sortAll(carryTo(s0, items[0]!, "legend")), "bell").state;
    // sortAll puts every card where it belongs, so make one wrong again before the showing.
    const wrongShown = touch(carryTo(sortAll(s0), items[0]!, "legend"), "bell").state;
    expect(wrong.sort.done).toBe(true);
    expect(wrongShown.sort.shows).toBe(1);
    for (const start of [s0, part, wrongShown]) {
      for (const item of items) {
        const picked = touch(start, `card-${item}`);
        expect(picked.commands, item).toEqual([]);
        expect(picked.state.sort, item).toBe(start.sort);
        expect(picked.state.carrying).toBe(item);
        expect(picked.happened).toEqual([{ type: "pick", item }]);
        for (const group of SHELVES) {
          const r = touch(picked.state, `group-${group}`);
          const want: SortCommand = { type: "place", item, group };
          if (start.sort.placed[item] === group) {
            // Already there: nothing is counted, and the card is put back, as choosing the same tray changes nothing on the page.
            expect(r.commands).toEqual([]);
            expect(r.state.sort).toBe(start.sort);
            expect(r.happened).toEqual([{ type: "drop", item }]);
          } else {
            expect(r.commands, `${item} ${group}`).toEqual([want]);
            expect(r.state.sort, `${item} ${group}`).toEqual(applySort(start.sort, want));
            expect(commandOf(CQR_SPEC, picked.state, `group-${group}`)).toEqual(want);
          }
          expect(r.state.carrying).toBeNull();
        }
      }
    }
  });
  it.each(STYLES)("in %s, a card carried from its shelf and put on its own empty place on the table is the page's `place` with no shelf; the place is there only while that card is carried", (style) => {
    const s0 = ready(style);
    const item = s0.sort.items[1]!;
    const placed = carryTo(s0, item, "tradition");
    expect(thingOf(CQR_SPEC, placed, `rest-${item}`)).toBeNull();
    expect(cqrThings(placed, false).some((t) => t.kind === "rest")).toBe(false);
    const lifted = touch(placed, `card-${item}`).state;
    expect(cqrThings(lifted, false).filter((t) => t.kind === "rest").map((t) => t.id)).toEqual([`rest-${item}`]);
    const r = touch(lifted, `rest-${item}`);
    const want: SortCommand = { type: "place", item, group: null };
    expect(r.commands).toEqual([want]);
    expect(commandOf(CQR_SPEC, lifted, `rest-${item}`)).toEqual(want);
    expect(r.state.sort).toEqual(applySort(placed.sort, want));
    expect(r.state.sort.moves).toBe(2);
    expect(r.state.carrying).toBeNull();
    // A card carried from the table has no second place: touching its own place puts it back, with nothing counted.
    const fromTable = touch(s0, `card-${item}`).state;
    expect(cqrThings(fromTable, false).some((t) => t.kind === "rest")).toBe(false);
    const back = touch(fromTable, `card-${item}`);
    expect(back.commands).toEqual([]);
    expect(back.state.carrying).toBeNull();
    expect(back.happened).toEqual([{ type: "drop", item }]);
  });
  it.each(STYLES)("in %s, touching another card while one is carried puts the carried one back and takes the other, with nothing counted", (style) => {
    const s0 = ready(style);
    const [a, b] = s0.sort.items as [string, string];
    const r = touch(touch(s0, `card-${a}`).state, `card-${b}`);
    expect(r.commands).toEqual([]);
    expect(r.state.carrying).toBe(b);
    expect(r.happened).toEqual([{ type: "drop", item: a }, { type: "pick", item: b }]);
    expect(r.state.sort).toBe(s0.sort);
  });
  it.each(STYLES)("in %s, the bell is the page's 'Show the record': refused and not counted with a card off the shelves, counted when a card is on the wrong shelf, the end when every card is right; with a card carried it is put back first", (style) => {
    const s0 = ready(style);
    const first = touch(s0, "bell");
    expect(first.commands).toEqual([{ type: "show" }]);
    expect(commandOf(CQR_SPEC, s0, "bell")).toEqual({ type: "show" });
    expect(first.state.sort).toEqual(applySort(s0.sort, { type: "show" }));
    expect(first.state.sort.shows).toBe(0);
    expect(first.state.sort.last).toEqual({ type: "show", refused: true, unplaced: s0.sort.items.length });
    // Every card on its shelf but one tradition (or, in Story, the first card) put on the first shelf's opposite.
    const items = s0.sort.items;
    const odd = items.find((i) => s0.sort.answer[i] === "tradition")!;
    const almost = carryTo(sortAll(s0), odd, "stated");
    const carrying = touch(almost, `card-${items[0]}`).state;
    const wrong = touch(carrying, "bell");
    expect(wrong.happened).toEqual([{ type: "drop", item: items[0] }, { type: "show" }]);
    expect(wrong.commands).toEqual([{ type: "show" }]);
    expect(wrong.state.carrying).toBeNull();
    expect(wrong.state.sort).toEqual(applySort(almost.sort, { type: "show" }));
    expect(wrong.state.sort.shows).toBe(1);
    expect(wrong.state.sort.done).toBe(false);
    const right = touch(carryTo(wrong.state, odd, "tradition"), "bell").state;
    expect(right.sort.done).toBe(true);
    expect(right.sort.shows).toBe(1);
  });
  it.each(STYLES)("in %s, the cards sorted by touch finish the quest as the page does: the same sorting, the page's goals, Hudhud's last line, and nothing more is touched", (style) => {
    const s = ready(style);
    const done = touch(sortAll(s), "bell").state;
    let page = newSort(style, coffeeDef(style));
    for (const i of page.items) page = applySort(page, { type: "place", item: i, group: page.answer[i]! });
    page = applySort(page, { type: "show" });
    expect(done.sort).toEqual(page);
    expect(sortRoomGoals(CQR_SPEC, done)).toEqual(sortGoals(page, COFFEE_SLACK[style]));
    const after = afterDone(CQR_SPEC, done);
    expect(after.talk?.script).toBe("done");
    expect(CQR_SCRIPTS.done!.nodes["1"]!.lines[0]!.key).toBe("cq_done_1");
    const quiet = applySortRoom(CQR_SPEC, after, { type: "skip" }).state;
    for (const t of cqrThings(quiet, false)) expect(touch(quiet, t.id).state, t.id).toBe(quiet);
  });
  it("gives a command for a shelf's sign (with a card carried), the carried card's empty place and the bell only; a shelf's sign with nothing carried says what the shelf is", () => {
    for (const style of STYLES) {
      const s = ready(style);
      for (const t of cqrThings(s, false)) if (t.kind !== "bell") expect(commandOf(CQR_SPEC, s, t.id), t.id).toBeNull();
      expect(touch(s, "group-legend").happened).toEqual([{ type: "look", group: "legend" }]);
      expect(touch(s, "group-legend").state).toBe(s);
      expect(cqrThings(s, false).map((t) => t.kind).filter((k) => k !== "card")).toEqual(["keeper", "child", "box", "bell", "group", "group", "group"]);
    }
  });
});

describe("the coffee room: the place kept", () => {
  it("survives a snapshot with the card in the beak: the sorting's own snapshot plus `carrying`, taken up by the page as it is, and the page's taken up by the room with an empty beak", () => {
    const s = ready("explorer");
    const mid = playAll(carryTo(carryTo(s, "goats", "legend"), "ethiopia", "tradition"), [{ type: "touch", id: "card-husk" }, { type: "touch", id: "box" }, { type: "skip" }]);
    expect(mid.carrying).toBe("husk");
    const snap = JSON.parse(JSON.stringify(snapshotSortRoom(mid)));
    expect(snap).toEqual({ ...snapshotSort(mid.sort), carrying: "husk" });
    const back = restoreSortRoom(CQR_SPEC, snap)!;
    expect(back.carrying).toBe("husk");
    expect(back.sort.placed).toEqual(mid.sort.placed);
    expect(back.sort.moves).toBe(2);
    expect(back.sort.flags).toEqual(["feather"]);
    expect(back.talk).toBeNull();
    // The page quest takes the room's snapshot as it is (it reads no `carrying`), and the room takes the page's.
    expect(restoreSort(snap, coffeeDef)?.placed).toEqual(mid.sort.placed);
    expect(restoreSortRoom(CQR_SPEC, snapshotSort(mid.sort))?.carrying).toBeNull();
    // A card that is not of this way of playing, or not a card at all, comes back as an empty beak; a bad sorting as nothing.
    expect(restoreSortRoom(CQR_SPEC, { ...snap, carrying: "spread" })?.carrying).toBeNull();
    expect(restoreSortRoom(CQR_SPEC, { ...snap, carrying: 7 })?.carrying).toBeNull();
    expect(restoreSortRoom(CQR_SPEC, { ...snap, moves: -1 })).toBeNull();
    expect(restoreSortRoom(CQR_SPEC, null)).toBeNull();
  });
  it("is kept by the page's rule with the beak added: a card picked up is kept, a place or a flag keeps the sorting, a talk that changes nothing keeps nothing new, putting the only carried card back with nothing done clears it, and the end is left to the host", () => {
    const s = ready("challenge");
    const step = (x: SortRoomState, c: SortRoomCommand) => {
      const r = applySortRoom(CQR_SPEC, x, c);
      return { r, kept: keptAfter(x, r.state) };
    };
    const picked = step(s, { type: "touch", id: "card-ban" });
    expect(picked.kept).toEqual({ ...snapshotSort(s.sort), carrying: "ban" });
    expect(step(picked.r.state, { type: "touch", id: "card-ban" }).kept).toBeNull();
    expect(step(s, { type: "touch", id: "keeper" }).kept).toBeUndefined();
    expect(step(s, { type: "touch", id: "group-stated" }).kept).toBeUndefined();
    expect(step(s, { type: "touch", id: "box" }).kept).toMatchObject({ flags: ["feather"], carrying: null });
    const placed = step(picked.r.state, { type: "touch", id: "group-stated" });
    expect(placed.kept).toMatchObject({ moves: 1, carrying: null, placed: { ban: "stated" } });
    expect(step(s, { type: "touch", id: "bell" }).kept).toBeNull();
    const nearly = sortAll(s);
    expect(step(nearly, { type: "touch", id: "bell" }).kept).toBeUndefined();
  });
});

describe("the coffee room: talk is the page quest's questions and answers", () => {
  it("asking the keeper who brought coffee and about the tree and the name sets the quest's two flags, with the narrator's lines (the page's own), and a goodbye of the room's own", () => {
    const s = touch(ready("explorer"), "keeper").state;
    expect(s.talk?.script).toBe("voice");
    let r = applySortRoom(CQR_SPEC, s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedDivision" }]);
    expect(CQR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "cq_names_1", mood: "think" });
    r = applySortRoom(CQR_SPEC, r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedBirds" }]);
    expect(CQR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "cq_word_1", mood: "think" });
    expect(sortRoomGoals(CQR_SPEC, r.state).curiosity).toBe(true);
    r = applySortRoom(CQR_SPEC, r.state, { type: "choose", index: 1 });
    expect(CQR_SCRIPTS.voice!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("cqr_keeper_bye");
  });
  it("the child answered kindly is Kindness and answered, in the page's order; bluntly is answered and not kind; and is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 0 }]);
    expect(kind.sort.flags).toEqual(["kind", "answered"]);
    expect(sortRoomGoals(CQR_SPEC, kind).kindness).toBe(true);
    expect(touch(applySortRoom(CQR_SPEC, kind, { type: "skip" }).state, "child").state.talk?.script).toBe("kidKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "child" }, { type: "choose", index: 1 }]);
    expect(blunt.sort.flags).toEqual(["answered"]);
    expect(sortRoomGoals(CQR_SPEC, blunt).kindness).toBe(false);
    expect(touch(applySortRoom(CQR_SPEC, blunt, { type: "skip" }).state, "child").state.talk?.script).toBe("kidBlunt");
    expect(CQR_SCRIPTS.kid!.nodes["1"]!.lines[0]!.key).toBe("cq_child_1");
  });
  it("in the box of spare cards on top of the shelves is the feather, once, with the page's own lines", () => {
    const r = touch(ready("story"), "box");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(CQR_SCRIPTS.hide!.nodes["1"]!.lines[0]!.key).toBe("cq_feather_1");
    const again = touch(applySortRoom(CQR_SPEC, r.state, { type: "skip" }).state, "box");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("hideAgain");
    expect(CQR_SCRIPTS.hideAgain!.nodes["1"]!.lines[0]!.key).toBe("cq_feather_again");
  });
  it("opens with the page's own two lines, and while someone speaks nothing in the room is touched", () => {
    const s = newSortRoom(CQR_SPEC, "challenge");
    expect(CQR_SCRIPTS.intro!.nodes["1"]!.lines.map((l) => [l.who, l.key])).toEqual([["hudhud", "cq_intro_1"], ["voice", "cq_intro_2"]]);
    for (const id of ["card-ban", "group-stated", "bell", "box", "child"]) expect(touch(s, id).state, id).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(CQR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the coffee quest's", () => {
    const keys = new Set(Object.values(CQR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("cq_"));
    expect(own.sort()).toEqual(["cqr_keeper_bye", "cqr_keeper_hello", "cqr_thanks"]);
  });
});

describe("the coffee room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("cqr_"));
  // They were the last twenty-two of every table until al-Jahiz's room (27 November 2026) appended its own after them;
  // they are still one block, in the same order, in every table, and only al-Jahiz's room's and the Alhambra's court's and the paper workshop's keys come after them.
  it("are twenty-two, one block in every table, in the same order, with only al-Jahiz's room's and the Alhambra's court's and the paper workshop's keys after them", () => {
    expect(keys).toHaveLength(22);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("jzr_") || k.startsWith("ahr_") || k.startsWith("smr_")), l).toBe(true);
    }
  });
  it("say that the room, the shelves, the cards, the bell and the keeper are invented for play, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.cqr_note_room).toBe("الغرفة والرفوف الثلاثة والبطاقات والجرس وأمين السجلات من خيال اللعب، وليست صورة لمقهى أو بيت بعينه.");
    expect(tables.en!.cqr_note_room).toBe("The room, the three shelves, the cards, the bell and the keeper of the records are invented for play; they are not a picture of any real coffeehouse or house.");
  });
  it("carry no parenthesis, no digit and no honorific, and have the same placeholders as English", () => {
    for (const l of LANGS) {
      for (const k of keys) {
        const v = tables[l]![k]!;
        const bare = v.replace(/\{\w+\}/g, "");
        expect(bare, `${l} ${k}`).not.toMatch(/[()]/);
        expect(bare, `${l} ${k}`).not.toMatch(/[0-9٠-٩۰-۹]/);
        expect(v, `${l} ${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله|رضی اللہ/);
        expect([...v.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l} ${k}`).toEqual([...tables.en![k]!.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
      }
    }
  });
  it("make no historical claim: no name, place, date or drink of the record is in the room's own lines (the cards' sentences stay the quest's)", () => {
    const NAMES = /\b(ethiopia|yemen|mecca|cairo|istanbul|aden|mocha|sufi|dhabhani|shadhili|omar|goat|kaffa|qishr|husk|governor|ban)\b/i;
    for (const k of keys) expect(NAMES.test(tables.en![k]!), `en ${k}: ${tables.en![k]}`).toBe(false);
  });
  it("name every thing in the room; a card is named by the page's own sentence for it", () => {
    for (const style of STYLES) for (const rtl of [false, true]) for (const t of cqrThings(touch(carryTo(ready(style), ready(style).sort.items[0]!, "stated"), `card-${ready(style).sort.items[0]}`).state, rtl)) expect(t.kind === "card" ? t.name === "cq_where" : keys.includes(t.name), t.id).toBe(true);
  });
  it("give a goodbye of the room's own, not another room's", () => {
    for (const l of LANGS) for (const other of ["ibr_ibn_bye", "krr_karima_bye", "rzr_razi_bye", "isr_idrisi_bye", "kdr_kindi_bye", "akr_khwarizmi_bye", "tsr_tusi_bye", "jr_jazari_bye", "d_scholar_bye"]) expect(tables[l]!.cqr_keeper_bye, l).not.toBe(tables[l]![other]);
  });
  it("are every one used by the room's page or its things", () => {
    const ui = source("ui/coffeeroom.ts") + source("content/coffee-room.ts");
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

describe("the coffee room: no letters, and the page's own signs", () => {
  it("its painting, the page's drawing it shares, its scene and its page never write text", () => {
    for (const f of ["art/coffee-room.ts", "art/coffee.ts", "art/sort.ts", "art/kit.ts", "scenes/coffee.ts"]) expect(source(f), f).not.toMatch(/fillText|strokeText|\.add\.text|\.text\(|font\s*=/);
  });
  it("painting every picture of the room calls neither fillText nor strokeText", async () => {
    const { ctx, calls } = counter();
    const g = globalThis as unknown as { document?: unknown };
    const had = g.document;
    g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx }) };
    try {
      const art = await import("../art/coffee-room");
      const cast = await import("../art/cast");
      art.coffeeRoom(1);
      for (const [i, item] of coffeeDef("challenge").items.entries()) art.cardArt(1, item, i + 1);
      for (let g2 = 0; g2 < 3; g2++) art.signArt(1, g2);
      art.bellArt(1);
      art.boxArt(1);
      art.focusArt(1);
      cast.archivist(1);
      cast.cardChild(1);
    } finally {
      g.document = had;
    }
    expect(calls.get("fill") ?? 0).toBeGreaterThan(100);
    expect(calls.get("fillText") ?? 0).toBe(0);
    expect(calls.get("strokeText") ?? 0).toBe(0);
  });
  it("draws every card and every shelf's sign by the page quest's own code (shared, not a copy), and draws no goat and no face on a card", () => {
    const art = source("art/coffee-room.ts");
    expect(art).toMatch(/import \{ coffeeFace, sign \} from "\.\/coffee";/);
    expect(art).toMatch(/import \{ drawCard \} from "\.\/sort";/);
    expect(art).toContain('drawCard(c, { x: 4, y: 2, w: s, h: s }, coffeeFace(item), "none", "scroll");');
    expect(art).toContain("sign(c, g, 35, 26, 17);");
    expect(source("art/coffee.ts")).toContain("export const coffeeFace");
    expect(source("art/sort.ts")).toContain("export function drawCard(");
    const code = (f: string) => source(f).split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*\*)/.test(l)).join("\n");
    for (const f of ["art/coffee-room.ts", "scenes/coffee.ts"]) expect(code(f), f).not.toMatch(/[Gg]oat|\bface\(|[Ii]nscri|[Cc]alligraph|[Ll]etter/);
    expect([...source("scenes/coffee.ts").matchAll(/props\.(\w+)/g)].map((m) => m[1])).toEqual(["feather"]);
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

/** The room in many states: each way of playing at the start, every card on one shelf, cards spread over the shelves, and a card carried from a shelf. */
function states(): { label: string; s: SortRoomState }[] {
  const out: { label: string; s: SortRoomState }[] = [];
  for (const style of STYLES) {
    const s0 = ready(style);
    out.push({ label: `${style} start`, s: s0 });
    for (const g of SHELVES) out.push({ label: `${style} all on ${g}`, s: s0.sort.items.reduce((x, i) => carryTo(x, i, g), s0) });
    out.push({ label: `${style} spread`, s: s0.sort.items.reduce((x, i, k) => (k % 4 === 3 ? x : carryTo(x, i, SHELVES[k % 3]!)), s0) });
    out.push({ label: `${style} sorted`, s: sortAll(s0) });
    const lifted = touch(carryTo(s0, s0.sort.items[2]!, "legend"), `card-${s0.sort.items[2]}`).state;
    out.push({ label: `${style} carrying from a shelf`, s: lifted });
  }
  return out;
}
const SMALL: CqrThing["kind"][] = ["card", "group", "bell", "rest"];

describe("the coffee room: every card, every sign and the bell are reached by flight", () => {
  const room = cqrRoom();
  it.each(states().flatMap(({ label, s }) => [false, true].map((rtl) => [label, rtl, s] as const)))("in %s (right to left: %s), every thing flown to is in reach where the bird lands, and is the nearest thing in reach there, as the room engine chooses", (_label, rtl, s) => {
    const things = cqrThings(s, rtl);
    for (const t of things) {
      const at = landing(t, room, CQR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const chosen = things.filter((k) => near(k, at)).sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(chosen.id, t.id).toBe(t.id);
      if (SMALL.includes(t.kind)) expect(room.perches.some((p) => p.y === at.y && at.x >= p.x && at.x <= p.x + p.w), t.id).toBe(true);
    }
  });
  it.each(states().flatMap(({ label, s }) => [false, true].map((rtl) => [label, rtl, s] as const)))("in %s (right to left: %s), the reaches of the cards, the signs and the bell never meet: the nearness is generous, but never two things at once", (_label, rtl, s) => {
    const small = cqrThings(s, rtl).filter((t) => SMALL.includes(t.kind));
    for (let i = 0; i < small.length; i++) for (let j = i + 1; j < small.length; j++) expect(Math.hypot(small[i]!.x - small[j]!.x, small[i]!.y - small[j]!.y), `${small[i]!.id} ${small[j]!.id}`).toBeGreaterThanOrEqual(small[i]!.reach + small[j]!.reach - 1e-9);
  });
  it("is generous on purpose: standing anywhere on the table within half a step of a card's middle touches that card; on a shelf, anywhere along a tier of cards touches the nearest", () => {
    expect(REACH.table).toBe(CQR_ROW.step / 2);
    expect(REACH.shelf).toBe(CQR_CASE.step / 2);
    for (const style of STYLES) {
      const s = ready(style);
      const cards = cqrThings(s, false).filter((t) => t.kind === "card");
      for (const c of cards) for (let dx = -REACH.table + 1; dx < REACH.table; dx += 3) expect(near(c, { x: c.x + dx, y: CQR_TABLE.top }), `${c.id} ${dx}`).toBe(true);
      const all = s.sort.items.reduce((x, i) => carryTo(x, i, "tradition"), s);
      const shelf = cqrThings(all, false).filter((t) => t.kind === "card");
      for (const c of shelf) for (let dx = -REACH.shelf + 1; dx < REACH.shelf; dx += 3) expect(near(c, { x: c.x + dx, y: c.y + 30 }), `${c.id} ${dx}`).toBe(true);
    }
  });
  it("no card, no sign and not the bell can be touched from the floor, wherever the bird stands: each needs a hop onto the table or a flight up to a shelf", () => {
    for (const { s } of states()) for (const rtl of [false, true]) for (const t of cqrThings(s, rtl).filter((k) => SMALL.includes(k.kind) || k.kind === "box")) for (let x = t.x - 120; x <= t.x + 120; x += 5) expect(near(t, { x, y: CQR_WORLD.floor }), t.id).toBe(false);
  });
  it("the table, every shelf and the top of the bookcase can be reached from the floor by flight: each within one climb (a hop and the flaps of the way of playing with none to spare) of the floor or of another that is; the top shelf needs more than one", () => {
    const up = climb();
    expect(up).toBeGreaterThan(300);
    expect(up).toBeLessThan(400);
    const perches = room.perches;
    const reached = new Set<number>();
    let from: number[] = [CQR_WORLD.floor];
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
    expect(reached.size).toBe(perches.length);
    expect(CQR_WORLD.floor - up).toBeGreaterThan(CQR_CASE.top);
  });
  it("the box with the feather in it needs flight: out of reach from the floor and from the highest tier, reached from the top of the bookcase, at the end the page ends at", () => {
    for (const rtl of [false, true]) {
      const box = cqrThings(ready("explorer"), rtl).find((t) => t.id === "box")!;
      for (let x = CQR_CASE.x; x <= CQR_CASE.x + CQR_CASE.w; x += 10) {
        expect(near(box, { x, y: CQR_WORLD.floor })).toBe(false);
        expect(near(box, { x, y: CQR_CASE.boards[2]! })).toBe(false);
      }
      expect(landing(box, room, CQR_APPROACH.box).y).toBe(CQR_CASE.top);
      expect(box.x > CQR_CASE.x + CQR_CASE.w / 2).toBe(!rtl);
    }
  });
  it("holds every card of every way of playing on the table and on any one shelf, inside the table and inside that shelf's own section of the bookcase, clear of every sign", () => {
    for (const style of STYLES) {
      const n = coffeeDef(style).items.length;
      for (const rtl of [false, true]) {
        for (let i = 0; i < n; i++) {
          const t = tableSpot(n, i, rtl);
          expect(t.x - REACH.table).toBeGreaterThanOrEqual(CQR_TABLE.x);
          expect(t.x + REACH.table).toBeLessThanOrEqual(CQR_BELL.x - REACH.bell);
          for (let g = 0; g < 3; g++) {
            const c = shelfSpot(g, i, rtl);
            const k = rtl ? 2 - g : g;
            expect(c.x - REACH.shelf).toBeGreaterThanOrEqual(CQR_CASE.x + k * SECTION);
            expect(c.x + REACH.shelf).toBeLessThanOrEqual(CQR_CASE.x + (k + 1) * SECTION);
            for (let h = 0; h < 3; h++) expect(Math.hypot(c.x - signSpot(h, rtl).x, c.y - signSpot(h, rtl).y)).toBeGreaterThanOrEqual(REACH.shelf + REACH.sign);
          }
        }
      }
    }
    // On a page read right to left the cards' order and the shelves are mirrored: the first card and the first shelf on the right.
    expect(tableSpot(8, 0, true).x).toBeGreaterThan(tableSpot(8, 7, true).x);
    expect(signSpot(0, true).x).toBeGreaterThan(signSpot(2, true).x);
    expect(shelfSpot(0, 0, true).x).toBeGreaterThan(shelfSpot(2, 0, true).x);
  });
  // The lead agent's review (27 November 2026): one above another, with the legend on top, the shelves read as a ranking.
  it("stands the three shelves side by side at the same height: their signs at one height on the top of the case, each shelf in a section of its own of the same width, and the cards of every shelf on the same three tiers", () => {
    for (const rtl of [false, true]) {
      const signs = [0, 1, 2].map((g) => signSpot(g, rtl));
      expect(new Set(signs.map((p) => p.y)).size).toBe(1);
      expect(new Set(signs.map((p) => p.x)).size).toBe(3);
      for (let slot = 0; slot < 9; slot++) expect(new Set([0, 1, 2].map((g) => shelfSpot(g, slot, rtl).y)).size, `slot ${slot}`).toBe(1);
      // Each shelf's cards and sign lie in its own third of the case, in the page's order.
      const third = (x: number) => Math.floor((x - CQR_CASE.x) / SECTION);
      for (let g = 0; g < 3; g++) {
        expect(third(signs[g]!.x)).toBe(rtl ? 2 - g : g);
        for (let slot = 0; slot < 9; slot++) expect(third(shelfSpot(g, slot, rtl).x)).toBe(rtl ? 2 - g : g);
      }
    }
    expect(SECTION * CQR_CASE.sections).toBe(CQR_CASE.w);
    expect(CQR_CASE.across * Math.floor(CQR_CASE.boards.length)).toBeGreaterThanOrEqual(8);
  });
});

describe("the coffee room: the door and the people, as in the other rooms", () => {
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    for (const d of [DOOR, IBR_DOOR]) expect(CQR_DOOR).toEqual(d);
    for (const w of [WORLD, IBR_WORLD]) expect({ h: CQR_WORLD.height, floor: CQR_WORLD.floor, view: CQR_WORLD.view, w: CQR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    for (const r of [ROOM, ibrRoom(8)]) expect(cqrRoom().bounds).toEqual(r.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    const room = cqrRoom();
    let m = newMover(250, room.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, room, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(CQR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(room.bounds.x + room.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: sorting the cards never takes the bird through it by itself", () => {
    for (const { s } of states()) for (const rtl of [false, true]) for (const t of cqrThings(s, rtl)) expect(near(CQR_DOOR, landing(t, cqrRoom(), CQR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("puts the keeper clear of the table, and the child clear of the table, of the bookcase and of the door", () => {
    const keeper = drawnBox(SCHOLAR, CQR_START.archivist, CQR_WORLD.floor, "either");
    expect(keeper.right).toBeLessThan(CQR_TABLE.x - 20);
    const child = drawnBox(HELPER, CQR_START.child, CQR_WORLD.floor, "either");
    expect(child.left).toBeGreaterThan(CQR_TABLE.x + CQR_TABLE.w);
    expect(child.right).toBeLessThan(CQR_CASE.x - 10);
    expect(child.right).toBeLessThan(CQR_DOOR.x - 40);
    for (const rtl of [false, true]) expect(boxSpot(rtl).x - 50 >= CQR_CASE.x && boxSpot(rtl).x + 50 <= CQR_CASE.x + CQR_CASE.w).toBe(true);
  });
});

describe("the coffee room: in words, and where it is used", () => {
  it("says every card with its number, its full sentence and where it lies, every shelf with its meaning, what Hudhud carries, and the page's own sentences for a place and a showing", () => {
    const ui = source("ui/sortroom.ts");
    expect(ui).toContain("t(k.cardBeak, { n, card: sentence })");
    expect(ui).toContain("t(k.cardGroup, { n, s: groupNo(g), card: sentence })");
    expect(ui).toContain("t(k.cardTable, { n, card: sentence })");
    expect(ui).toContain("t(k.thingGroup, { n: num(x.index! + 1), name: groupName(x.group!) })");
    expect(ui).toContain('beak.setAttribute("aria-live", "polite")');
    expect(ui).toContain('ran.setAttribute("aria-live", "polite")');
    expect(ui).not.toMatch(/\.style\./);
    const room = source("ui/coffeeroom.ts");
    for (const k of ["cq_did_place", "cq_did_unplace", "cq_refused", "cq_wrong_story", "cq_wrong_explorer", "cq_wrong_challenge", "cq_did_solved", "cq_progress", "cq_progress_shows", "cq_shelf_line", "cq_note_1", "cq_note_4", "cq_review"]) expect(room, k).toContain(`"${k}"`);
    expect(COFFEE_RECORDS).toHaveLength(2);
  });
  it("is opened from the Atlas and the journey as coffee's scene, falls back to the page without WebGL, and keeps one place for both", () => {
    const app = source("ui/app.ts");
    expect(app).toMatch(/\[COFFEE_QUEST\]: \{[\s\S]*?room: roomsOn,\s*makeRoom: \(c, title\) =>\s*coffeeRoom\(/);
    expect(app).toContain("fallback: () => openPage(COFFEE_QUEST, inJourney, true)");
    expect(app).toContain("resume: pageSaved(COFFEE_QUEST, (snap) => restoreSortRoom(CQR_SPEC, snap))");
    expect(app).toContain("keepPlace: (snap) => pageCheckpoint(COFFEE_QUEST, snap)");
    expect(app).toContain("startCoffee: () => openPage(COFFEE_QUEST, null, true)");
    expect(app).toContain("startCoffeeRoom: () => openPage(COFFEE_QUEST)");
  });
});

// The shared sorting room is not the coffee room's alone: proved here on a made-up set of three cards in two groups, with
// ids and talk of its own, so that the rules hold for any sorting quest that hands them in (al-Jahiz's cards next).
describe("the shared sorting room, on a made-up set of cards and groups", () => {
  const line = (key: string) => ({ start: "1", nodes: { "1": { lines: [{ who: "hudhud", key, mood: "glad" as const }] } } });
  const scripts: Record<string, Script<string>> = {
    intro: line("x_intro"),
    voice: { start: "1", nodes: { "1": { lines: [{ who: "voice", key: "x_hello", mood: "glad" }], choices: [{ key: "x_a", to: "a" }, { key: "x_b", to: "b" }] }, a: { lines: [{ who: "narrator", key: "x_a1", mood: "think" }], set: ["askedDivision"] }, b: { lines: [{ who: "narrator", key: "x_b1", mood: "think" }], set: ["askedBirds", "not-a-flag"] } } },
    kid: { start: "1", nodes: { "1": { lines: [{ who: "kid", key: "x_kid", mood: "think" }], choices: [{ key: "x_kind", to: "k" }, { key: "x_blunt", to: "b" }] }, k: { lines: [{ who: "kid", key: "x_k", mood: "glad" }], set: ["kind", "answered"] }, b: { lines: [{ who: "kid", key: "x_b", mood: "think" }], set: ["answered"] } } },
    kidKind: line("x_kk"),
    kidBlunt: line("x_kb"),
    hide: line("x_hide"),
    hideAgain: line("x_again"),
    done: line("x_done"),
  };
  const def = { items: ["sun", "moon", "lamp"], groups: ["sky", "room"], answer: { sun: "sky", moon: "sky", lamp: "room" } };
  const spec: SortRoomSpec = { scripts, def: () => def, slack: { story: null, explorer: { shows: 0 }, challenge: { shows: 0 } }, ids: { voice: "sage", kid: "girl", hide: "jar", bell: "gong" } };
  const go = (s: SortRoomState, ids: string[]) => ids.reduce((x, id) => applySortRoom(spec, x, { type: "touch", id }).state, s);
  const start = () => applySortRoom(spec, newSortRoom(spec, "explorer"), { type: "skip" }).state;
  it("knows its things by its own ids and by the cards and groups handed in, and nothing else", () => {
    const s = start();
    expect(thingOf(spec, s, "gong")).toEqual({ kind: "bell" });
    expect(thingOf(spec, s, "sage")).toEqual({ kind: "voice" });
    expect(thingOf(spec, s, "girl")).toEqual({ kind: "kid" });
    expect(thingOf(spec, s, "jar")).toEqual({ kind: "hide" });
    expect(thingOf(spec, s, "card-moon")).toEqual({ kind: "card", item: "moon" });
    expect(thingOf(spec, s, "group-room")).toEqual({ kind: "group", group: "room" });
    for (const id of ["bell", "keeper", "card-ethiopia", "group-stated", "rest-moon", "card-", "group-"]) expect(thingOf(spec, s, id), id).toBeNull();
    expect(CQR_IDS).toEqual({ voice: "keeper", kid: "child", hide: "box", bell: "bell" });
  });
  it("carries a card, puts it in a group, takes it out by its empty place, and shows: each a command of the sorting rules, the same as the page's", () => {
    const s = start();
    const a = go(s, ["card-moon", "group-room"]);
    expect(a.sort).toEqual(applySort(s.sort, { type: "place", item: "moon", group: "room" }));
    const lifted = go(a, ["card-moon"]);
    expect(thingOf(spec, lifted, "rest-moon")).toEqual({ kind: "rest", item: "moon" });
    const out = go(lifted, ["rest-moon"]);
    expect(out.sort).toEqual(applySort(a.sort, { type: "place", item: "moon", group: null }));
    expect(out.sort.moves).toBe(2);
    expect(go(out, ["gong"]).sort.last).toEqual({ type: "show", refused: true, unplaced: 3 });
    const wrong = go(out, ["card-sun", "group-sky", "card-moon", "group-room", "card-lamp", "group-room", "gong"]);
    expect(wrong.sort.shows).toBe(1);
    expect(wrong.sort.last).toEqual({ type: "show", refused: false, right: 2, total: 3, wrong: ["moon"] });
    const done = go(wrong, ["card-moon", "group-sky", "gong"]);
    expect(done.sort.done).toBe(true);
    expect(sortRoomGoals(spec, done)).toEqual(sortGoals(done.sort, { shows: 0 }));
    expect(sortRoomGoals(spec, done).ingenuity).toBe(false);
  });
  it("lays the cards out by the page's own order: each on the table in its own place, or in its group after the cards before it there; a carried card keeps its place", () => {
    const s = go(start(), ["card-lamp", "group-sky", "card-sun", "group-sky", "card-moon"]);
    expect(cardPlaces(s)).toEqual([
      { item: "sun", index: 0, group: "sky", slot: 0, carried: false },
      { item: "moon", index: 1, group: null, slot: 1, carried: true },
      { item: "lamp", index: 2, group: "sky", slot: 1, carried: false },
    ]);
  });
  it("talks by its own scripts, sets only the sorting's own flags, and hides the feather where its ids say", () => {
    let s = go(start(), ["sage"]);
    s = applySortRoom(spec, s, { type: "choose", index: 1 }).state;
    expect(s.sort.flags).toEqual(["askedBirds"]);
    s = applySortRoom(spec, s, { type: "skip" }).state;
    const f = applySortRoom(spec, s, { type: "touch", id: "jar" });
    expect(f.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(f.state.talk?.script).toBe("hide");
    expect(afterDone(spec, s)).toBe(s);
  });
  it("keeps the made-up room's place with its beak, and takes it back only for a card of its own", () => {
    const s = go(start(), ["card-sun", "group-sky", "card-lamp"]);
    const snap = JSON.parse(JSON.stringify(snapshotSortRoom(s)));
    expect(restoreSortRoom(spec, snap)?.carrying).toBe("lamp");
    expect(restoreSortRoom(spec, { ...snap, carrying: "ethiopia" })?.carrying).toBeNull();
    expect(restoreSortRoom(spec, { ...snap, placed: { sun: "stated" } })).toBeNull();
  });
});
