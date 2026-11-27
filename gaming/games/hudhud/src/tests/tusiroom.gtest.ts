// Al-Tusi's room (sim/tusiroom.ts, content/tusi-room.ts, ui/tusi.ts): the two circles played by flying. A lever touched
// gives exactly the `set` the page's radio button gives for the same choice, the crank gives the page's `turn`, and a
// question, an answer or the feather a `flag`, so that the counts, the shapes, the goals and the three ways of playing
// are the page quest's. The place kept is the quest's own snapshot. The note that states the model is shown only once
// the line is found. And the room's things and door pass the same nearness test as the other rooms'.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { coupleOffer } from "../content/couple";
import { TSR_APPROACH, TSR_DOOR, TSR_ROOM, TSR_SCRIPTS, TSR_THINGS, TSR_WORLD, type TsrThing } from "../content/tusi-room";
import { JR_DOOR, JR_ROOM, JR_WORLD } from "../content/jazari-room";
import { DOOR, ROOM, WORLD } from "../content/workshop";
import { faults } from "../narrative/dialogue";
import { COUPLE_SLACK, SIZES, applyCouple, coupleGoals, isLine, newCouple, restoreCouple, settingsOf, snapshotCouple, trace, type CoupleCommand, type CoupleField, type CoupleState, type CoupleStyle } from "../sim/couple";
import { distance, landing, near } from "../sim/door";
import { MOVE, advance, newMover } from "../sim/move";
import { POINTS, afterTurn, applyTusiRoom, hasLever, keptAfter, leverAngle, modelOf, newTusiRoom, nextValue, restoreTusi, snapshotTusi, tusiGoals, valueNow, valuesOf, type TusiCommand, type TusiState } from "../sim/tusiroom";

const STYLES: CoupleStyle[] = ["story", "explorer", "challenge"];
const FIELDS: CoupleField[] = ["dir", "speed", "size"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"] as const;
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
/** A room past its opening words. */
const ready = (style: CoupleStyle): TusiState => applyTusiRoom(newTusiRoom(style), { type: "skip" }).state;
const touch = (s: TusiState, id: string) => applyTusiRoom(s, { type: "touch", id });
const playAll = (s: TusiState, cs: TusiCommand[]) => cs.reduce((x, c) => applyTusiRoom(x, c).state, s);
/** The touches that bring a lever from where it stands to a value. */
const leverTo = (s: TusiState, field: CoupleField, value: number): TusiCommand[] => {
  const list = valuesOf(s.couple.offer, field);
  const n = (list.indexOf(value) - list.indexOf(valueNow(s.couple, field)) + list.length) % list.length;
  return Array.from({ length: n }, () => ({ type: "touch", id: `lever-${field}` }) as const);
};
/** The page quest's commands that bring its radio buttons to a setting, one `set` for each group that changes. */
const pageTo = (s: CoupleState, set: { r: number; k: number; d: number }): CoupleCommand[] =>
  ([["dir", set.d], ["speed", set.k], ["size", set.r]] as const).filter(([f, v]) => valueNow(s, f) !== v).map(([field, value]) => ({ type: "set", field, value }));

describe("al-Tusi's room: a lever or the crank is the page quest's command", () => {
  it.each(STYLES)("has a lever only for a choice the way of playing offers, as the page shows only the groups with more than one value, in %s", (style) => {
    const s = ready(style);
    const levers = FIELDS.filter((f) => hasLever(s.couple.offer, f));
    expect(levers).toEqual({ story: ["dir"], explorer: ["dir", "speed"], challenge: ["dir", "speed", "size"] }[style]);
    // A lever the way of playing has not: touching where it would be gives nothing.
    for (const f of FIELDS.filter((x) => !levers.includes(x))) {
      const r = touch(s, `lever-${f}`);
      expect(r.commands).toEqual([]);
      expect(r.state).toBe(s);
    }
  });
  it.each(STYLES)("a lever touched is exactly one set of its choice to the next value offered, the same state as the page's radio button for that value gives, and it goes round, in %s", (style) => {
    let s = ready(style);
    for (const field of FIELDS.filter((f) => hasLever(s.couple.offer, f))) {
      const values = valuesOf(s.couple.offer, field);
      const seen: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const value = nextValue(s.couple, field);
        const r = touch(s, `lever-${field}`);
        const cmd: CoupleCommand = { type: "set", field, value };
        expect(r.commands).toEqual([cmd]);
        expect(r.state.couple).toEqual(applyCouple(s.couple, cmd));
        expect(r.happened).toEqual([{ type: "lever", field, value }]);
        seen.push(valueNow(r.state.couple, field));
        s = r.state;
      }
      // Every value offered is reached, and after the last the lever is back at the first it showed.
      expect([...seen].sort()).toEqual([...values].sort());
    }
  });
  it.each(STYLES)("the crank is the page's turn: the same counts, the same measured shape, in %s", (style) => {
    const s = ready(style);
    const r = touch(s, "crank");
    expect(r.commands).toEqual([{ type: "turn" }]);
    expect(r.state.couple).toEqual(applyCouple(s.couple, { type: "turn" }));
    expect(r.state.couple.turned).toBe(1);
    expect(r.state.couple.misses).toBe(1);
    expect(r.state.couple.last?.shape.kind).not.toBe("line");
  });
  it.each(STYLES)("every setting the way of playing offers can be set with the levers and turned with the crank, giving the page quest's state for the same setting turned, in %s", (style) => {
    const s0 = ready(style);
    for (const set of settingsOf(s0.couple.offer)) {
      const touches: TusiCommand[] = [...leverTo(s0, "dir", set.d), ...(hasLever(s0.couple.offer, "speed") ? leverTo(s0, "speed", set.k) : []), ...(hasLever(s0.couple.offer, "size") ? leverTo(s0, "size", set.r) : []), { type: "touch", id: "crank" }];
      const room = playAll(s0, touches);
      const page = [...pageTo(s0.couple, set), { type: "turn" } as const].reduce((x, c) => applyCouple(x, c), s0.couple);
      expect(room.couple.setting).toEqual(set);
      expect(room.couple.last).toEqual(page.last);
      expect(room.couple.done).toBe(isLine(set));
    }
  });
  it.each(STYLES)("played to its end with a wrong turning first, the room's goals are the page's, and once the line is found nothing more is touched, in %s", (style) => {
    let s = touch(ready(style), "crank").state;
    s = playAll(s, [...leverTo(s, "dir", -1), ...(hasLever(s.couple.offer, "speed") ? leverTo(s, "speed", 2) : []), ...(hasLever(s.couple.offer, "size") ? leverTo(s, "size", 1 / 2) : [])]);
    const r = touch(s, "crank");
    expect(r.state.couple.done).toBe(true);
    expect(r.state.couple.turned).toBe(2);
    expect(r.state.couple.misses).toBe(1);
    expect(tusiGoals(r.state)).toEqual(coupleGoals(r.state.couple, COUPLE_SLACK[style]));
    expect(afterTurn(r.state).talk?.script).toBe("done");
    for (const id of TSR_THINGS.map((t) => t.id)) expect(touch(r.state, id).state, id).toBe(r.state);
  });
});

describe("al-Tusi's room: talk is the page quest's questions and answers", () => {
  it("asking al-Tusi why and about the observatory sets the quest's two flags, with the narrator's lines (the page's own)", () => {
    const s = touch(ready("explorer"), "tusi").state;
    expect(s.talk?.script).toBe("tusi");
    let r = applyTusiRoom(s, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedWhy" }]);
    expect(TSR_SCRIPTS.tusi!.nodes[r.state.talk!.node]!.lines[0]).toEqual({ who: "narrator", key: "ts_why_1", mood: "think" });
    r = applyTusiRoom(r.state, { type: "choose", index: 0 });
    expect(r.commands).toEqual([{ type: "flag", flag: "askedObs" }]);
    expect(TSR_SCRIPTS.tusi!.nodes[r.state.talk!.node]!.lines[0]!.key).toBe("ts_obs_1");
    expect(tusiGoals(r.state).curiosity).toBe(true);
  });
  it("the girl answered kindly is Kindness and answered, in the page's order; bluntly she is answered and not kind; she is not asked again", () => {
    const kind = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 0 }]);
    expect(kind.couple.flags).toEqual(["kind", "answered"]);
    expect(tusiGoals(kind).kindness).toBe(true);
    expect(touch(applyTusiRoom(kind, { type: "skip" }).state, "girl").state.talk?.script).toBe("girlKind");
    const blunt = playAll(ready("explorer"), [{ type: "touch", id: "girl" }, { type: "choose", index: 1 }]);
    expect(blunt.couple.flags).toEqual(["answered"]);
    expect(tusiGoals(blunt).kindness).toBe(false);
    expect(touch(applyTusiRoom(blunt, { type: "skip" }).state, "girl").state.talk?.script).toBe("girlBlunt");
  });
  it("the instruments on the high shelf hold the feather once, with the page's own lines", () => {
    const r = touch(ready("story"), "shelf");
    expect(r.commands).toEqual([{ type: "flag", flag: "feather" }]);
    expect(r.happened.map((x) => x.type)).toEqual(["feather", "talk"]);
    expect(TSR_SCRIPTS.shelf!.nodes["1"]!.lines[0]!.key).toBe("ts_feather_1");
    const again = touch(applyTusiRoom(r.state, { type: "skip" }).state, "shelf");
    expect(again.commands).toEqual([]);
    expect(again.state.talk?.script).toBe("shelfAgain");
  });
  it("while someone speaks nothing in the room is touched", () => {
    const s = newTusiRoom("explorer");
    expect(s.talk?.script).toBe("intro");
    expect(touch(s, "crank").state).toBe(s);
    expect(touch(s, "lever-dir").state).toBe(s);
  });
  it.each(LANGS)("has no fault in its scripts, and every line is in the %s table", (lang) => {
    expect(faults(TSR_SCRIPTS, table(lang))).toEqual([]);
  });
  it("adds at most three spoken lines of its own; every other line is the two circles' quest's", () => {
    const keys = new Set(Object.values(TSR_SCRIPTS).flatMap((s) => Object.values(s.nodes).flatMap((n) => [...n.lines.map((l) => l.key), ...(n.choices ?? []).map((c) => c.key)])));
    const own = [...keys].filter((k) => !k.startsWith("ts_"));
    expect(own.sort()).toEqual(["tsr_thanks", "tsr_tusi_bye", "tsr_tusi_hello"]);
  });
});

describe("al-Tusi's room: the place kept", () => {
  it("is the quest's own snapshot, so that the page quest takes the room's place up and the room takes the page's", () => {
    const s = playAll(ready("explorer"), [{ type: "touch", id: "crank" }, { type: "touch", id: "lever-speed" }, { type: "touch", id: "lever-dir" }]);
    expect(snapshotTusi(s)).toEqual(snapshotCouple(s.couple));
    const page = restoreCouple(JSON.parse(JSON.stringify(snapshotTusi(s))), coupleOffer);
    expect(page?.setting).toEqual(s.couple.setting);
    const back = restoreTusi(JSON.parse(JSON.stringify(snapshotCouple(s.couple))));
    expect(back).not.toBeNull();
    expect(back!.couple).toEqual({ ...s.couple, last: null });
    expect(back!.talk).toBeNull();
  });
  it("is kept by the page's rule: after a wrong turning, the quest; after the turning that finds the line, nothing new; after a lever, the quest once it has a turning or a flag, and nothing before", () => {
    const s = ready("explorer");
    const lever = touch(s, "lever-speed");
    expect(keptAfter(lever.state, lever.commands)).toBeNull();
    const wrong = touch(lever.state, "crank");
    expect(keptAfter(wrong.state, wrong.commands)).toEqual(snapshotCouple(wrong.state.couple));
    const lever2 = touch(wrong.state, "lever-speed");
    expect(keptAfter(lever2.state, lever2.commands)).toEqual(snapshotCouple(lever2.state.couple));
    const right = playAll(s, [...leverTo(s, "dir", -1), ...leverTo(s, "speed", 2)]);
    const found = touch(right, "crank");
    expect(found.state.couple.done).toBe(true);
    expect(keptAfter(found.state, found.commands)).toBeUndefined();
    // Touching a person gives no command, and leaves the place as it is.
    const talk = touch(s, "tusi");
    expect(keptAfter(talk.state, talk.commands)).toBeUndefined();
  });
  it("comes back set and not turned, with no path and no talk, even when the setting kept is the answer; and refuses what cannot be trusted", () => {
    const s = ready("explorer");
    const right = playAll(touch(s, "crank").state, [...leverTo(s, "dir", -1), ...leverTo(s, "speed", 2)]);
    const back = restoreTusi(JSON.parse(JSON.stringify(snapshotTusi(right))))!;
    expect(back.couple.done).toBe(false);
    expect(back.couple.last).toBeNull();
    expect(back.couple.setting).toEqual({ r: 1 / 2, k: 2, d: -1 });
    expect(back.couple.turned).toBe(1);
    expect(restoreTusi(null)).toBeNull();
    expect(restoreTusi({ style: "story", size: 1, speed: 3, dir: 1, misses: 0, turned: 0, flags: [] })).toBeNull();
  });
});

describe("al-Tusi's room: the model and the levers as drawn", () => {
  it("shows no path before a turning, the path growing while a turning is shown, and the whole closed path after it; a moved lever clears it", () => {
    const s = ready("explorer");
    expect(modelOf(s, false, 1)).toMatchObject({ setting: s.couple.setting, theta: 0, path: null });
    const turned = touch(s, "crank").state;
    const half = modelOf(turned, true, 0.5);
    expect(half.closed).toBe(false);
    expect(half.path).toHaveLength(POINTS / 2 + 1);
    expect(half.theta).toBeCloseTo(Math.PI);
    expect(half.path).toEqual(trace(turned.couple.last!.setting, POINTS).slice(0, POINTS / 2 + 1));
    const whole = modelOf(turned, false, 1);
    expect(whole.closed).toBe(true);
    expect(whole.path).toEqual(trace(turned.couple.last!.setting, POINTS));
    expect(modelOf(touch(turned, "lever-speed").state, false, 1).path).toBeNull();
  });
  it("leans a lever to the value it is set to: one value stands upright, two or three spread from -30 to 30 degrees", () => {
    expect(leverAngle([1 / 2], 1 / 2)).toBe(0);
    expect([1, -1].map((v) => leverAngle([1, -1], v))).toEqual([-30, 30]);
    expect([1, 2, 3].map((v) => leverAngle([1, 2, 3], v))).toEqual([-30, 0, 30]);
    expect([...SIZES].map((v) => leverAngle([...SIZES], v))).toEqual([-30, 0, 30]);
  });
});

describe("al-Tusi's room: the note that states the model is shown only once the line is found", () => {
  const src = readFileSync(resolve(__dirname, "..", "ui", "tusi.ts"), "utf8");
  const code = src.split("\n").filter((l) => !l.trim().startsWith("//") && !l.trim().startsWith("*") && !l.trim().startsWith("/**")).join("\n");
  it("puts ts_note_2 only in the panel, which only the end of a turning that found the line opens", () => {
    expect(code.match(/"ts_note_2"/g)).toHaveLength(1);
    const panelAt = code.indexOf("function showPanel(");
    const againAt = code.indexOf("function again(");
    expect(code.indexOf('"ts_note_2"')).toBeGreaterThan(panelAt);
    expect(code.indexOf('"ts_note_2"')).toBeLessThan(againAt);
    // The panel is opened from one place, the end; and the end from one place, after a turning whose quest is done.
    expect(code.match(/showPanel\(\)/g)).toHaveLength(2); // its definition and its one call
    expect(code.slice(code.indexOf("function end_("), code.indexOf("function showPanel(")).includes("showPanel()")).toBe(true);
    expect(code.match(/end_\(\)/g)).toHaveLength(2);
    expect(code).toContain("if (state.couple.done) end_();");
  });
  it("gives the answer away in none of the room's own strings, in any language", () => {
    const WORDS: Record<string, { twice: string; opposite: string }> = {
      ar: { twice: "بضعف", opposite: "المعاكس" },
      en: { twice: "twice", opposite: "opposite" },
      ur: { twice: "دوگنی", opposite: "الٹی" },
      fr: { twice: "deux fois", opposite: "opposé" },
      es: { twice: "al doble", opposite: "opuesto" },
      tr: { twice: "iki katı", opposite: "ters" },
      id: { twice: "dua kali", opposite: "berlawanan" },
    };
    for (const l of LANGS) {
      for (const [k, v] of Object.entries(table(l))) {
        if (!k.startsWith("tsr_")) continue;
        expect(v.toLowerCase(), `${l}:${k}`).not.toContain(WORDS[l]!.twice);
        expect(v.toLowerCase(), `${l}:${k}`).not.toContain(WORDS[l]!.opposite);
      }
    }
  });
});

describe("al-Tusi's room: its strings", () => {
  const tables = Object.fromEntries(LANGS.map((l) => [l, table(l)]));
  const keys = Object.keys(tables.en!).filter((k) => k.startsWith("tsr_"));
  // They were the last nineteen of every table until al-Khwarizmi's room (27 November 2026) appended its own after them;
  // and al-Kindi's room, al-Idrisi's hall and al-Razi's study their own after those; they are still one block, in the
  // same order, in every table, and only those four rooms' keys come after them.
  it("are nineteen, one block in every table, in the same order, with only al-Khwarizmi's room's, al-Kindi's room's, al-Idrisi's hall's and al-Razi's study's keys after them", () => {
    expect(keys).toHaveLength(19);
    for (const l of LANGS) {
      const all = Object.keys(tables[l]!);
      const at = all.indexOf(keys[0]!);
      expect(all.slice(at, at + keys.length), l).toEqual(keys);
      expect(all.slice(at + keys.length).every((k) => k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_")), l).toBe(true);
    }
  });
  it("say that the observatory, the model, the levers and the crank are invented, in the founder's words in Arabic and English", () => {
    expect(tables.ar!.tsr_note_room).toBe("المرصد والنموذج القائم على حامله والأذرع والمقبض من خيال اللعب، وليست صورة لمرصد مراغة ولا لآلاته.");
    expect(tables.en!.tsr_note_room).toBe("The observatory, the model on its stand, the levers and the crank are invented for play; they are not a picture of the Maragha observatory or of its instruments.");
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
  it("name every thing in the room", () => {
    for (const t of TSR_THINGS) expect(keys, t.id).toContain(t.name);
  });
});

describe("al-Tusi's room: nearness and the door, as in the other rooms", () => {
  const touchable = (s: TusiState, t: TsrThing) => t.kind !== "lever" || hasLever(s.couple.offer, t.field!);
  it.each(STYLES)("every thing in the room, flown to, is in reach where the bird lands, and is the nearest thing there, in %s", (style) => {
    const s = ready(style);
    const things = TSR_THINGS.filter((x) => touchable(s, x));
    for (const t of things) {
      const at = landing(t, TSR_ROOM, TSR_APPROACH[t.kind]);
      expect(near(t, at), t.id).toBe(true);
      const nearest = [...things].sort((a, b) => distance(a, at) - distance(b, at))[0]!;
      expect(nearest.id, t.id).toBe(t.id);
    }
  });
  it("the feather's shelf needs flight: it is out of reach from the floor and from the long table", () => {
    const shelf = TSR_THINGS.find((t) => t.id === "shelf")!;
    expect(near(shelf, { x: shelf.x, y: TSR_WORLD.floor })).toBe(false);
    expect(near(shelf, { x: shelf.x, y: TSR_ROOM.perches.find((p) => p.y === 470)!.y })).toBe(false);
  });
  it("has the other rooms' door in their place, the same height and floor, and a world as wide", () => {
    expect(TSR_DOOR).toEqual(DOOR);
    expect(TSR_DOOR).toEqual(JR_DOOR);
    for (const w of [WORLD, JR_WORLD]) expect({ h: TSR_WORLD.height, floor: TSR_WORLD.floor, view: TSR_WORLD.view, w: TSR_WORLD.width }).toEqual({ h: w.height, floor: w.floor, view: w.view, w: w.width });
    expect(TSR_ROOM.bounds).toEqual(ROOM.bounds);
    expect(TSR_ROOM.bounds).toEqual(JR_ROOM.bounds);
  });
  it("walking right along the floor reaches the door, by the same test as a thing", () => {
    let m = newMover(250, TSR_ROOM.floor);
    let carry = 0;
    let reached = false;
    for (let i = 0; i < 1200 && !reached; i++) {
      const r = advance(m, TSR_ROOM, { dir: 1, jump: false, down: false }, 1 / 60, carry);
      m = r.mover;
      carry = r.carry;
      reached = near(TSR_DOOR, m);
    }
    expect(reached).toBe(true);
    expect(m.x).toBeLessThan(TSR_ROOM.bounds.x + TSR_ROOM.bounds.w - MOVE.half + 1);
  });
  it("wherever the bird lands to touch a thing, the door is out of reach: finding the line never takes the bird through it by itself", () => {
    for (const t of TSR_THINGS) expect(near(TSR_DOOR, landing(t, TSR_ROOM, TSR_APPROACH[t.kind])), t.id).toBe(false);
  });
  it("starts every way of playing on a setting that is not the line, as the page does", () => {
    for (const style of STYLES) expect(isLine(newCouple(style, coupleOffer(style)).setting)).toBe(false);
  });
});
