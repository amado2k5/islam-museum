// Ibn Battuta and the thread of the road: a stage of his journeys, threaded stop by stop. Each way of playing follows one
// stage of the museum record's own eight (written again here by hand, with the record's sentence beside each, and
// anchored to the record's file); the rules of the thread, the sentence and the slips are covered in the three ways of
// playing; a saved place is proved, not trusted; the picture's hit-test works both ways round and the ring is not a
// map; and the words, in all seven languages, keep the lines written for the quest exactly.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { ROUTE_QUEST, ROUTE_RECORDS, ROUTE_STOPS, ROUTE_SUBJECT, routeStage, stopKey } from "../content/route";
import { ROUTE_ART, SIGNS, beadPos, routeHit } from "../art/route";
import { ROUTE_FLAGS, ROUTE_SLACK, applyRoute, checkStage, go, newRoute, nextStop, peek, restoreRoute, routeGoals, snapshotRoute, threaded, type RouteCommand, type RouteState, type RouteStyle, type Stage } from "../sim/route";

const STYLES: RouteStyle[] = ["story", "explorer", "challenge"];
const LANGS = ["ar", "en", "ur", "fr", "es", "tr", "id"];
const root = resolve(__dirname, "..", "..", "..", "..", "..");
const table = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n", `${lang}.json`), "utf8")) as Record<string, string>;
const atlasTable = (lang: string) => JSON.parse(readFileSync(resolve(__dirname, "..", "..", "i18n-atlas", `${lang}.json`), "utf8")) as Record<string, string>;
const play = (s: RouteState, cs: RouteCommand[]) => cs.reduce(applyRoute, s);
const thread = (s: RouteState, stops: string[]) => stops.reduce((x, id) => go(x, id), s);
const fresh = (style: RouteStyle) => newRoute(style, routeStage(style));
/** The record's text with its links written as plain words, on one line. */
const record = readFileSync(resolve(root, "content", "en", "person", "ibn-battuta-muhammad.md"), "utf8").replace(/\[\[[^|\]]*\|([^\]]*)\]\]/g, "$1").replace(/\s+/g, " ");

// What the record says each stage is, written down again here and not read from the content file. The record
// (person/ibn-battuta-muhammad, "The Eight Stages of His Journeys", after the Encyclopaedia of Islam, vol. 3, p. 767).
const EXPECTED: Record<RouteStyle, string[]> = {
  // "In the first stage he left Tangier on 2 Rajab 725 ... and crossed North Africa, Egypt, Upper Egypt and Syria, leaving Damascus for Mecca"
  story: ["tangier", "north-africa", "egypt", "upper-egypt", "syria", "damascus", "mecca"],
  // "The third stage took him down the Red Sea to Yemen and Aden, then to Zayla, Mogadishu and the trading ports of East Africa, and back by Oman and the Persian Gulf"
  explorer: ["red-sea", "yemen", "aden", "zayla", "mogadishu", "east-africa-ports", "oman", "persian-gulf"],
  // "In the second he left Mecca ... and went through Iraq, Khuzistan, Fars and the Jibal, then to Tabriz, Baghdad, Samarra and Mosul, returning to Baghdad"
  challenge: ["mecca", "iraq", "khuzistan", "fars", "jibal", "tabriz", "baghdad", "samarra", "mosul", "baghdad"],
};
/** The words the record uses for each stop, each of which occurs in the record's own file. */
const ANCHOR: Record<string, string> = {
  tangier: "Tangier", "north-africa": "North Africa", egypt: "Egypt", "upper-egypt": "Upper Egypt", syria: "Syria", damascus: "Damascus", mecca: "Mecca",
  "red-sea": "Red Sea", yemen: "Yemen", aden: "Aden", zayla: "Zayla", mogadishu: "Mogadishu", "east-africa-ports": "ports of East Africa", oman: "Oman", "persian-gulf": "Gulf",
  iraq: "Iraq", khuzistan: "Khuzistan", fars: "Fars", jibal: "Jibal", tabriz: "Tabriz", baghdad: "Baghdad", samarra: "Samarra", mosul: "Mosul",
};
/** The part of the record that is each stage's sentence: from where it opens to where the next opens. */
const SEGMENT: Record<RouteStyle, [string, string]> = { story: ["In the first stage", "In the second"], challenge: ["In the second", "The third stage"], explorer: ["The third stage", "In the fourth"] };
const segment = (style: RouteStyle): string => {
  const [from, to] = SEGMENT[style];
  const a = record.indexOf(from);
  const b = record.indexOf(to, a + 1);
  expect(a, from).toBeGreaterThanOrEqual(0);
  expect(b, to).toBeGreaterThan(a);
  return record.slice(a, b);
};
const mod = (n: number, m: number) => ((n % m) + m) % m;

describe("the three stages", () => {
  it.each(STYLES)("follows the record's order, and uses only its own stops, in %s", (style) => {
    const s = routeStage(style);
    expect(s.road).toEqual(EXPECTED[style]);
    expect(checkStage(s)).toBeNull();
    for (const id of s.road) expect(s.stops, id).toContain(id);
    // Every bead is on the road, and no bead of another stage is here (Mecca is in two stages and has a bead in each).
    expect([...s.stops].sort()).toEqual([...new Set(EXPECTED[style])].sort());
    expect(new Set(s.stops).size).toBe(s.stops.length);
  });
  it("has seven, eight and nine beads over seven, eight and ten steps: Story is the first stage, Explorer the third and Challenge the second", () => {
    expect(STYLES.map((s) => [routeStage(s).stops.length, routeStage(s).road.length])).toEqual([[7, 7], [8, 8], [9, 10]]);
    expect(routeStage("story").road[0]).toBe("tangier");
    expect(routeStage("explorer").road[0]).toBe("red-sea");
    expect(routeStage("challenge").road[0]).toBe("mecca");
  });
  it("visits Baghdad twice in Challenge and no other stop twice, and no stop twice in the other two", () => {
    for (const style of STYLES) {
      const count = new Map<string, number>();
      for (const id of routeStage(style).road) count.set(id, (count.get(id) ?? 0) + 1);
      const twice = [...count].filter(([, n]) => n > 1).map(([id]) => id);
      expect(twice, style).toEqual(style === "challenge" ? ["baghdad"] : []);
      expect(Math.max(...count.values()), style).toBe(style === "challenge" ? 2 : 1);
    }
    expect(routeStage("challenge").road.indexOf("baghdad")).toBe(6);
    expect(routeStage("challenge").road.lastIndexOf("baghdad")).toBe(9);
  });
  it("sets the beads round the ring in an order that is not the road's: no bead where the road has it, no road neighbours side by side, and no turning or flipping of the road", () => {
    for (const style of STYLES) {
      const s = routeStage(style);
      const order = [...new Set(s.road)];
      const n = s.stops.length;
      expect(s.stops, style).not.toEqual(order);
      s.stops.forEach((id, i) => expect(order[i], `${style} position ${i}`).not.toBe(id));
      // Neighbours on the road (the pairs of consecutive steps) are never neighbours on the ring, first and last included.
      const adjacent = (a: string, b: string) => {
        const d = Math.abs(s.stops.indexOf(a) - s.stops.indexOf(b));
        return d === 1 || d === n - 1;
      };
      for (let k = 0; k + 1 < s.road.length; k++) expect(adjacent(s.road[k]!, s.road[k + 1]!), `${style}: ${s.road[k]} then ${s.road[k + 1]}`).toBe(false);
      // The road read round the ring from any bead, either way, is never the ring.
      for (let r = 0; r < n; r++) {
        expect(s.stops.map((_, i) => order[mod(i + r, n)]), `${style} turned by ${r}`).not.toEqual(s.stops);
        expect(s.stops.map((_, i) => order[mod(r - i, n)]), `${style} flipped at ${r}`).not.toEqual(s.stops);
      }
    }
  });
  it("starts every way of playing with the thread at the first stop to be threaded and the sentence on the page", () => {
    for (const style of STYLES) {
      const s = fresh(style);
      expect([s.at, s.slips, s.showing, s.done, s.last, s.flags]).toEqual([0, 0, true, false, null, []]);
      expect(nextStop(s)).toBe(EXPECTED[style][0]);
      expect(threaded(s)).toEqual([]);
    }
  });
  it("refuses a stage that does not make sense", () => {
    const ok: Stage = { stops: ["a", "b", "c"], road: ["a", "b", "c"] };
    expect(checkStage(ok)).toBeNull();
    expect(checkStage({ ...ok, stops: ["a"] })).not.toBeNull();
    expect(checkStage({ ...ok, stops: ["a", "a", "b"] })).not.toBeNull();
    expect(checkStage({ ...ok, road: ["a"] })).not.toBeNull();
    expect(checkStage({ ...ok, road: ["a", "z"] })).not.toBeNull();
    expect(checkStage({ ...ok, stops: ["a", "b", "c", "d"] })).not.toBeNull();
    expect(() => newRoute("story", { ...ok, road: ["a", "z"] })).toThrow(/cannot be played/);
    expect(checkStage({ stops: ["a", "b"], road: ["a", "b", "a"] })).toBeNull();
  });
});

describe("the record behind the stages", () => {
  it("has every stop's name somewhere in the record's file, in the order of the stage's own sentence", () => {
    for (const style of STYLES) {
      const seg = segment(style).toLowerCase();
      const firsts = [...new Set(EXPECTED[style])].map((id) => ({ id, at: seg.indexOf(ANCHOR[id]!.toLowerCase()) }));
      for (const f of firsts) expect(f.at, `${style}: ${f.id}`).toBeGreaterThanOrEqual(0);
      const at = firsts.map((f) => f.at);
      expect([...at].sort((a, b) => a - b), style).toEqual(at);
    }
    for (const id of ROUTE_STOPS) expect(record.toLowerCase(), id).toContain(ANCHOR[id]!.toLowerCase());
    // Baghdad is threaded a second time after Mosul: "returning to Baghdad".
    const two = segment("challenge");
    expect(two.indexOf("returning to Baghdad")).toBeGreaterThan(two.indexOf("Mosul"));
    // The stage's sentence in the game uses the record's own words for each stop, in English, in the same order.
    for (const style of STYLES) {
      const sentence = table("en")[`ib_stage_${style}`]!.toLowerCase();
      const ats = [...new Set(EXPECTED[style])].map((id) => sentence.indexOf(ANCHOR[id]!.toLowerCase()));
      ats.forEach((a, i) => expect(a, `${style}: ${EXPECTED[style][i]}`).toBeGreaterThanOrEqual(0));
      expect([...ats].sort((a, b) => a - b), style).toEqual(ats);
    }
    expect(table("en").ib_stage_challenge.lastIndexOf("Baghdad")).toBeGreaterThan(table("en").ib_stage_challenge.indexOf("Mosul"));
  });
  it("rests the written lines on the sentences of the record: the day, the year, the purpose, alone, the age, who ordered the account written, who dictated it, who edited it, the eight stages, the lost notes and the rearranged itineraries", () => {
    const at = (needle: string) => {
      const i = record.indexOf(needle);
      expect(i, needle).toBeGreaterThanOrEqual(0);
      return i;
    };
    expect(record).toContain("He left Tangier on Thursday 2 Rajab 725 AH for the pilgrimage, alone, aged twenty-two");
    expect(record).toContain("The sultan ordered his journey written down; he dictated it and Ibn Juzayy edited it");
    expect(record).toContain("not written down by Ibn Battuta himself");
    expect(record).toContain("commissioned by the Marinid ruler of the time, Abu Inan");
    expect(record).toContain("sets out the chronology of his travels in eight stages");
    expect(record).toContain("Ibn Battuta himself admitted that he had sometimes lost the notes he made on his travels and rewrote them from memory");
    expect(record).toContain("the rearranging of several itineraries");
    expect(record).toContain("come from Ibn Juzayy");
    expect(record).toContain("these weaknesses do not detract from the value of the whole");
    // The lost notes come before the editor's rearranging, as in the note.
    expect(at("lost the notes")).toBeLessThan(at("rearranging of several itineraries"));
    const en = table("en");
    expect(en.ib_note_3.indexOf("losing some of his travel notes")).toBeLessThan(en.ib_note_3.indexOf("rearranged several of its routes"));
    // The museum's record is the one that says the article sets the journeys in eight stages, and the note says three are followed.
    expect(en.ib_note_2).toContain("eight stages");
    expect(en.ib_note_2).toContain("follows three");
  });
  it("names the stages as the record's first, second and third, and not as any other order, in the order the game tells them", () => {
    // Story first stage, Challenge second stage, Explorer third stage: the record's own order of opening words.
    const order = ["In the first stage", "In the second", "The third stage"].map((x) => record.indexOf(x));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(order.every((i) => i >= 0)).toBe(true);
  });
  it("links only to records that exist in the museum's data: the person, his book, and the question of believing his reports", () => {
    expect([...ROUTE_RECORDS]).toEqual(["person/ibn-battuta-muhammad", "work/rihla-ibn-battuta", "question/credibility-of-ibn-battuta"]);
    for (const id of ROUTE_RECORDS) expect(existsSync(resolve(root, "data", `${id}.yaml`)), id).toBe(true);
  });
  it("builds the quest's id from the subject's quest code in the Atlas, and the subject has the person and the book", () => {
    const atlas = JSON.parse(readFileSync(resolve(__dirname, "..", "content", "atlas.v1.json"), "utf8")) as { subjects: { id: string; world: string; quest: string; records: string[] }[] };
    const sub = atlas.subjects.find((s) => s.id === ROUTE_SUBJECT)!;
    expect(ROUTE_SUBJECT).toBe("ibn-battuta");
    expect(ROUTE_QUEST).toBe(`${sub.quest}-ibn-battuta`);
    expect(ROUTE_QUEST).toBe("w06q1-ibn-battuta");
    expect(sub.world).toBe("journeys-maps");
    expect(sub.records).toContain("person/ibn-battuta-muhammad");
  });
});

describe("the thread", () => {
  it.each(STYLES)("moves on at the next stop and at no other, and ends at the last, in %s", (style) => {
    let s = fresh(style);
    const road = EXPECTED[style];
    road.forEach((id, k) => {
      expect(nextStop(s)).toBe(id);
      s = go(s, id);
      expect(s.at, `${style} step ${k + 1}`).toBe(k + 1);
      expect(s.last).toEqual({ stop: id, right: true });
      expect(s.done).toBe(k === road.length - 1);
    });
    expect(threaded(s)).toEqual(road);
    expect(nextStop(s)).toBeNull();
    expect(s.slips).toBe(0);
  });
  it("counts a wrong stop as a slip and leaves the thread where it is in Story and Explorer, and sends it back to the start in Challenge", () => {
    for (const style of ["story", "explorer"] as const) {
      const s = thread(fresh(style), EXPECTED[style].slice(0, 3));
      const wrong = EXPECTED[style][5]!;
      const t = go(s, wrong);
      expect([t.at, t.slips, t.last]).toEqual([3, 1, { stop: wrong, right: false }]);
      expect(threaded(t)).toEqual(EXPECTED[style].slice(0, 3));
      expect(go(go(t, wrong), wrong).slips).toBe(3);
    }
    const c = thread(fresh("challenge"), EXPECTED.challenge.slice(0, 4));
    expect(c.at).toBe(4);
    const t = go(c, "tabriz");
    expect([t.at, t.slips, t.last, t.done]).toEqual([0, 1, { stop: "tabriz", right: false }, false]);
    expect(nextStop(t)).toBe("mecca");
    // A stop already threaded is not the next stop either, and is a slip.
    expect(go(thread(fresh("story"), EXPECTED.story.slice(0, 3)), "tangier").slips).toBe(1);
    // A first stop that is wrong is a slip, with nothing to send back.
    expect(go(fresh("challenge"), "iraq")).toMatchObject({ at: 0, slips: 1 });
  });
  it("lets Baghdad be threaded twice in Challenge: the first time at the seventh step, the second at the last", () => {
    let s = thread(fresh("challenge"), EXPECTED.challenge.slice(0, 7));
    expect(s.at).toBe(7);
    expect(threaded(s).filter((x) => x === "baghdad")).toHaveLength(1);
    // Baghdad is not the next stop while Samarra is.
    expect(go(s, "baghdad").slips).toBe(1);
    s = thread(s, ["samarra", "mosul"]);
    expect(nextStop(s)).toBe("baghdad");
    s = go(s, "baghdad");
    expect([s.at, s.done, s.slips]).toEqual([10, true, 0]);
    expect(threaded(s).filter((x) => x === "baghdad")).toHaveLength(2);
  });
  it("ignores a press on a stop that is not a bead of the stage, and changes nothing once the stage is done", () => {
    const s = fresh("explorer");
    expect(go(s, "tangier")).toBe(s);
    expect(go(s, "nonsense")).toBe(s);
    expect(go(s, "")).toBe(s);
    for (const style of STYLES) {
      const done = thread(fresh(style), EXPECTED[style]);
      expect(done.done).toBe(true);
      expect(go(done, EXPECTED[style][0]!)).toBe(done);
      expect(peek(done)).toBe(done);
      expect(applyRoute(done, { type: "flag", flag: "feather" })).toBe(done);
      expect(applyRoute(done, { type: "go", stop: EXPECTED[style][0]! })).toBe(done);
      expect(applyRoute(done, { type: "peek" })).toBe(done);
    }
  });
  it("can be threaded to its end with no slip in every way of playing, with all four goals met when the flags are set", () => {
    for (const style of STYLES) {
      let s = play(fresh(style), [{ type: "flag", flag: "askedLeft" }, { type: "flag", flag: "askedWritten" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }]);
      s = thread(s, EXPECTED[style]);
      expect(s.done).toBe(true);
      expect(routeGoals(s, ROUTE_SLACK[style])).toEqual({ turns: EXPECTED[style].length, curiosity: true, ingenuity: true, kindness: true, feather: true });
    }
  });
});

describe("the stage's sentence", () => {
  it("is always on the page in Story, and a request to show it changes nothing and costs nothing", () => {
    let s = fresh("story");
    expect(s.showing).toBe(true);
    for (const id of EXPECTED.story.slice(0, 4)) {
      s = go(s, id);
      expect(s.showing).toBe(true);
    }
    s = go(s, "mecca");
    expect(s.showing).toBe(true);
    expect(peek(s)).toBe(s);
    expect(s.slips).toBe(1);
  });
  it("is on the page in Explorer until the first stop is threaded, then hidden, and can be shown again for nothing, as often as asked", () => {
    let s = fresh("explorer");
    expect(s.showing).toBe(true);
    // A wrong first stop does not hide it: the thread has not begun.
    s = go(s, "oman");
    expect([s.showing, s.slips]).toEqual([true, 1]);
    s = go(s, "red-sea");
    expect([s.showing, s.at]).toEqual([false, 1]);
    for (let k = 0; k < 3; k++) {
      const shown = peek(s);
      expect([shown.showing, shown.slips, shown.at]).toEqual([true, 1, 1]);
      expect(peek(shown)).toBe(shown);
      // The next right stop hides it again.
      expect(go(shown, "yemen").showing).toBe(false);
    }
    s = go(s, "yemen");
    // A wrong stop with the sentence hidden leaves it hidden and counts a slip.
    const wrong = go(s, "oman");
    expect([wrong.showing, wrong.slips]).toEqual([false, 2]);
  });
  it("is shown before the first step in Challenge and hidden once the thread starts, and showing it again is a slip", () => {
    let s = fresh("challenge");
    expect(s.showing).toBe(true);
    // Showing what is already shown is not a slip.
    expect(peek(s)).toBe(s);
    s = go(s, "mecca");
    expect([s.showing, s.slips]).toEqual([false, 0]);
    const shown = peek(s);
    expect([shown.showing, shown.slips, shown.at, shown.last]).toEqual([true, 1, 1, null]);
    expect(peek(shown)).toBe(shown);
    // The next right step hides it again; a second look is a second slip.
    const hidden = go(shown, "iraq");
    expect([hidden.showing, hidden.slips]).toEqual([false, 1]);
    expect(peek(hidden).slips).toBe(2);
    // A wrong step sends the thread back and the sentence stays hidden.
    const back = go(hidden, "fars");
    expect([back.at, back.showing, back.slips]).toEqual([0, false, 2]);
  });
  it("is worked out again when a place is put back: Story shows it, Explorer shows it only before the thread begins, Challenge only before a first step and before any slip", () => {
    const back = (style: RouteStyle, at: number, slips: number) => restoreRoute({ style, at, slips, flags: [] }, routeStage)!;
    expect([back("story", 0, 0).showing, back("story", 3, 4).showing]).toEqual([true, true]);
    expect([back("explorer", 0, 0).showing, back("explorer", 0, 3).showing, back("explorer", 1, 0).showing]).toEqual([true, true, false]);
    expect([back("challenge", 0, 0).showing, back("challenge", 0, 1).showing, back("challenge", 2, 0).showing]).toEqual([true, false, false]);
  });
});

describe("the four goals", () => {
  it("allows no count of slips in Story, two in Explorer and one in Challenge", () => {
    expect(ROUTE_SLACK).toEqual({ story: null, explorer: 2, challenge: 1 });
  });
  it("counts Curiosity as both questions asked, and no other flag counts for it", () => {
    let s = fresh("story");
    expect(routeGoals(s, null).curiosity).toBe(false);
    s = play(s, [{ type: "flag", flag: "askedLeft" }, { type: "flag", flag: "askedLeft" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }, { type: "flag", flag: "answered" }]);
    expect(routeGoals(s, null)).toMatchObject({ curiosity: false, kindness: true, feather: true });
    s = play(s, [{ type: "flag", flag: "askedWritten" }]);
    expect(routeGoals(s, null).curiosity).toBe(true);
    expect(s.flags).toEqual(["askedLeft", "kind", "feather", "answered", "askedWritten"]);
  });
  it("counts Ingenuity as slips at most the allowance: in Explorer two slips are allowed and a third is not, in Challenge one is allowed and a second is not, in Story none is counted", () => {
    const slipped = (style: RouteStyle, n: number) => {
      let s = fresh(style);
      for (let k = 0; k < n; k++) s = go(s, style === "explorer" ? "oman" : style === "story" ? "mecca" : "iraq");
      return thread(s, EXPECTED[style]);
    };
    expect(routeGoals(slipped("explorer", 2), ROUTE_SLACK.explorer).ingenuity).toBe(true);
    expect(routeGoals(slipped("explorer", 3), ROUTE_SLACK.explorer).ingenuity).toBe(false);
    expect(routeGoals(slipped("challenge", 1), ROUTE_SLACK.challenge).ingenuity).toBe(true);
    expect(routeGoals(slipped("challenge", 2), ROUTE_SLACK.challenge).ingenuity).toBe(false);
    expect(routeGoals(slipped("story", 9), ROUTE_SLACK.story).ingenuity).toBe(true);
    expect(slipped("challenge", 2).slips).toBe(2);
    // A look at the sentence in Challenge is a slip too, so a look and a wrong step together are too many.
    let c = go(fresh("challenge"), "mecca");
    c = peek(c);
    c = go(go(c, "iraq"), "tabriz");
    expect(c.slips).toBe(2);
    expect(routeGoals(thread(c, EXPECTED.challenge), 1).ingenuity).toBe(false);
  });
  it("counts the turns as stops threaded and slips made, and refuses a flag it does not know", () => {
    let s = go(go(fresh("explorer"), "oman"), "red-sea");
    expect(routeGoals(s, 2).turns).toBe(2);
    s = play(s, [{ type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual([]);
    expect([...ROUTE_FLAGS]).toEqual(["askedLeft", "askedWritten", "kind", "feather", "answered"]);
  });
  it("does not count a blunt answer as kindness, and a kind answer carries `kind` and `answered`", () => {
    const blunt = play(fresh("story"), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(routeGoals(blunt, null).kindness).toBe(false);
    expect(routeGoals(play(blunt, [{ type: "flag", flag: "kind" }]), null).kindness).toBe(true);
  });
});

describe("the thread kept in the middle", () => {
  const started = (style: RouteStyle) => play(thread(fresh(style), EXPECTED[style].slice(0, 2)), [{ type: "flag", flag: "feather" }, { type: "flag", flag: "askedLeft" }]);
  const snap = (style: RouteStyle) => JSON.parse(JSON.stringify(snapshotRoute(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreRoute(x, routeStage);
  it.each(STYLES)("comes back through JSON as it was, with the sentence worked out again and not done, in %s", (style) => {
    const s = started(style);
    const back = refused(JSON.parse(JSON.stringify(snapshotRoute(s))))!;
    expect(back).not.toBeNull();
    expect([back.style, back.at, back.slips, back.flags, back.done, back.last]).toEqual([style, 2, 0, ["askedLeft", "feather"], false, null]);
    expect(back.stage).toEqual(routeStage(style));
    expect(nextStop(back)).toBe(EXPECTED[style][2]);
    expect(thread(back, EXPECTED[style].slice(2)).done).toBe(true);
  });
  it("keeps a thread with nothing threaded too, and one with slips", () => {
    for (const style of STYLES) expect(refused(snapshotRoute(fresh(style)))).not.toBeNull();
    const slipped = go(fresh("challenge"), "iraq");
    expect(refused(snapshotRoute(slipped))).toMatchObject({ at: 0, slips: 1 });
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    expect(refused(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    for (const at of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, at }), String(at)).toBeNull();
    // A place at the end of the road is a finished stage, which is not a place to come back to.
    expect(refused({ ...good, at: routeStage("explorer").road.length })).toBeNull();
    expect(refused({ ...good, at: routeStage("explorer").road.length - 1 })).not.toBeNull();
    for (const slips of [-1, 1.5, "3", null, NaN, Infinity, 1e9, undefined]) expect(refused({ ...good, slips }), String(slips)).toBeNull();
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    expect(refused({ ...good, flags: undefined })).toBeNull();
  });
  it("drops flags it does not know, keeps the ones it does in their own order, and ignores what a file says about the stage, the sentence or whether it is done", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedWritten", "nonsense", 7, "kind", "kind", "askedFloat"], stage: { stops: ["x"], road: ["x"] }, showing: true, done: true, last: { right: true }, par: 99 })!;
    expect(back.flags).toEqual(["askedWritten", "kind", "feather"]);
    expect([back.done, back.last, back.showing]).toEqual([false, null, false]);
    expect(back.stage).toEqual(routeStage("explorer"));
  });
  it("accepts a snapshot with the flag `answered` missing, as one kept before it existed would be", () => {
    const back = refused({ style: "story", at: 1, slips: 0, flags: ["askedWritten", "kind"] })!;
    expect(back.flags).toEqual(["askedWritten", "kind"]);
  });
  it("is not changed by the commands that change nothing", () => {
    const s = fresh("story");
    expect(applyRoute(s, { type: "go", stop: "nobody" })).toBe(s);
    expect(applyRoute(s, { type: "peek" })).toBe(s);
    expect(applyRoute(applyRoute(s, { type: "flag", flag: "kind" }), { type: "flag", flag: "kind" }).flags).toEqual(["kind"]);
  });
});

describe("the picture of the beads can be played by touch, and is not a map", () => {
  it.each([7, 8, 9])("finds the bead under a point, and nothing between beads or outside, in a ring of %i beads on a page that reads left to right", (n) => {
    for (let i = 0; i < n; i++) {
      const p = beadPos(n, i, false);
      expect(routeHit(p.x, p.y, n, false)).toBe(i);
      expect(routeHit(p.x + ROUTE_ART.bead - 1, p.y, n, false)).toBe(i);
      expect(routeHit(p.x, p.y - ROUTE_ART.bead + 1, n, false)).toBe(i);
      expect(routeHit(p.x + ROUTE_ART.bead + 2, p.y + ROUTE_ART.bead + 2, n, false)).not.toBe(i);
    }
    for (const [x, y] of [[ROUTE_ART.cx, ROUTE_ART.cy], [0, 0], [ROUTE_ART.w, ROUTE_ART.h], [-5, 10], [5000, 5000]] as [number, number][]) expect(routeHit(x, y, n, false)).toBeNull();
    // Half way between two neighbouring beads is nobody's.
    const a = beadPos(n, 0, false);
    const b = beadPos(n, 1, false);
    expect(routeHit((a.x + b.x) / 2, (a.y + b.y) / 2, n, false)).toBeNull();
  });
  it.each([7, 8, 9])("is the mirror image on a page that reads right to left: the first bead stays at the top and the rest go round the other way, in a ring of %i", (n) => {
    for (let i = 0; i < n; i++) {
      const ltr = beadPos(n, i, false);
      const rtl = beadPos(n, i, true);
      expect(rtl.x).toBeCloseTo(ROUTE_ART.w - ltr.x, 9);
      expect(rtl.y).toBeCloseTo(ltr.y, 9);
      expect(routeHit(rtl.x, rtl.y, n, true)).toBe(i);
      expect(routeHit(ROUTE_ART.w - ltr.x, ltr.y, n, true)).toBe(i);
      // The same point is another bead the other way round, except for the beads on the middle line.
      if (Math.abs(ltr.x - ROUTE_ART.w / 2) > 1) expect(routeHit(ltr.x, ltr.y, n, true)).not.toBe(i);
    }
    expect(beadPos(n, 0, true).x).toBeCloseTo(ROUTE_ART.w / 2, 9);
    expect(beadPos(n, 1, false).x).toBeGreaterThan(beadPos(n, 1, true).x);
  });
  it("keeps every bead and its dots inside the picture and apart from the next, with every bead the same distance from the middle (a ring, not a layout of places)", () => {
    for (const n of [7, 8, 9]) for (const rtl of [false, true]) {
      const ps = Array.from({ length: n }, (_, i) => beadPos(n, i, rtl));
      for (const p of ps) {
        expect(Math.hypot(p.x - ROUTE_ART.cx, p.y - ROUTE_ART.cy)).toBeCloseTo(ROUTE_ART.ring, 6);
        expect(p.x - ROUTE_ART.bead - 30).toBeGreaterThanOrEqual(0);
        expect(p.x + ROUTE_ART.bead + 30).toBeLessThanOrEqual(ROUTE_ART.w);
        expect(p.y - ROUTE_ART.bead - 30).toBeGreaterThanOrEqual(0);
        expect(p.y + ROUTE_ART.bead + 30).toBeLessThanOrEqual(ROUTE_ART.h);
      }
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) expect(Math.hypot(ps[i]!.x - ps[j]!.x, ps[i]!.y - ps[j]!.y)).toBeGreaterThan(2 * ROUTE_ART.bead + 10);
      // The beads are the same distance apart all round: the picture says nothing about how far one place is from another.
      const gaps = ps.map((p, i) => Math.hypot(p.x - ps[(i + 1) % n]!.x, p.y - ps[(i + 1) % n]!.y));
      for (const g of gaps) expect(g).toBeCloseTo(gaps[0]!, 6);
    }
  });
  it("tells nine beads apart by nine different signs, and draws no word, numeral, compass or coast: the file has none of them", () => {
    expect(new Set(SIGNS).size).toBe(SIGNS.length);
    expect(SIGNS.length).toBeGreaterThanOrEqual(9);
    const src = readFileSync(resolve(__dirname, "..", "art", "route.ts"), "utf8").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    expect(src).not.toMatch(/fillText|strokeText|compass|coast|latitude|longitude|north arrow/i);
  });
});

describe("the words", () => {
  /** The lines written for the quest, kept exactly: key, Arabic, English. */
  const WRITTEN: [string, string, string][] = [
    ["ib_intro_1", "صفحة الأطلس طارت على طريق رحّالة. لنتبع طريقه محطةً محطة!", "The page of the Atlas has flown along a traveller's road. Let us follow his road, stop by stop!"],
    ["ib_intro_2", "الطريق يُحفظ بترتيبه: من أين خرجت، ثم إلى أين.", "A road is remembered by its order: where you set out, and then where next."],
    ["ib_left_1", "يقول سجل المتحف إن ابن بطوطة خرج من طنجة يوم الخميس الثاني من رجب سنة 725 للهجرة قاصدًا الحج، وحده، وعمره اثنتان وعشرون سنة.", "The museum's record says Ibn Battuta left Tangier on Thursday the second of Rajab in the year 725 of the Hijra for the pilgrimage, alone, aged twenty-two."],
    ["ib_written_1", "ويقول إنه لم يكتب رحلته بيده: أمر السلطان أبو عنان بتدوينها، فأملاها ابن بطوطة وحرّرها ابن جُزَيّ.", "It says he did not write his journey down himself: Sultan Abu Inan ordered it written, Ibn Battuta dictated it, and Ibn Juzayy edited it."],
    ["ib_stage_story", "خرج من طنجة فقطع شمال أفريقيا ومصر وصعيد مصر والشام، ثم خرج من دمشق إلى مكة.", "He left Tangier and crossed North Africa, Egypt, Upper Egypt and Syria, then left Damascus for Mecca."],
    ["ib_stage_explorer", "نزل في البحر الأحمر إلى اليمن وعدن، ثم إلى زيلع ومقديشو وموانئ التجارة في شرق أفريقيا، وعاد عن طريق عُمان والخليج.", "He went down the Red Sea to Yemen and Aden, then to Zayla, Mogadishu and the trading ports of East Africa, and came back by Oman and the Gulf."],
    ["ib_stage_challenge", "خرج من مكة فمرّ بالعراق وخوزستان وفارس والجبال، ثم إلى تبريز وبغداد وسامرّاء والموصل، ثم عاد إلى بغداد.", "He left Mecca and went through Iraq, Khuzistan, Fars and the Jibal, then to Tabriz, Baghdad, Samarra and Mosul, and then returned to Baghdad."],
    ["ib_note_1", "هذه لعبة وليست كتاب تاريخ. الخيط والخرز والطفل صاحب الجمل وكل كلمة تُقال من خيال اللعب. والصورة ليست خريطة: الخرز موضوع على حلقة بلا اتجاه ولا مسافة.", "This is a game, not a history. The thread, the beads, the child with the camel and every spoken line are invented for play. The picture is not a map: the beads sit on a ring, with no direction and no distance meant."],
    ["ib_note_2", "من سجل المتحف: يرتّب السجل رحلات ابن بطوطة في ثماني مراحل، نقلًا عن مقالة في دائرة معارف. تتبع اللعبة ثلاثًا منها.", "From the museum's record: the record sets Ibn Battuta's journeys out in eight stages, after an article in an encyclopaedia. The game follows three of them."],
    ["ib_note_3", "يقول السجل إن الباحثين لا يأخذون كل ما في الرحلة على ظاهره: فقد ذكر ابن بطوطة أنه أضاع بعض ما كتبه في أسفاره وأعاد كتابته من حفظه، وترى المقالة أن محرّر الرحلة غيّر ترتيب عدد من الطرق. والترتيب هنا هو ترتيب الرحلة كما تعرضه تلك المقالة.", "The record says scholars do not take everything in the account as it stands: Ibn Battuta told of losing some of his travel notes and writing them again from memory, and the article holds that the editor of the account rearranged several of its routes. The order here is the order of the account as that article sets it out."],
  ];
  it("keeps the lines written for the quest exactly, in Arabic and English, and the speakers' labels and record names", () => {
    for (const [k, ar, en] of WRITTEN) {
      expect(table("ar")[k], k).toBe(ar);
      expect(table("en")[k], k).toBe(en);
    }
    expect(table("en").ib_who_ibn).toBe("Ibn Battuta, in imagined words");
    expect(table("ar").ib_who_ibn).toBe("ابن بطوطة، بكلمات متخيَّلة");
    expect(table("en").ib_who_child).toBe("The child with the camel, an invented person");
    expect(table("ar").ib_who_child).toBe("الطفل صاحب الجمل، شخصية من الخيال");
    expect(table("en").ib_rec_person).toBe("Ibn Battuta");
    expect(table("en").ib_rec_book).toBe("his travel account, the Rihla");
    expect(table("en").ib_show).toBe("Show the stage again");
    // Three notes and no fourth.
    expect(Object.keys(table("en")).filter((k) => k.startsWith("ib_note_"))).toEqual(["ib_note_1", "ib_note_2", "ib_note_3"]);
  });
  it("never calls an invented character the Messenger, in any language that has the word", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ib_")) expect(v, `${l}:${k}`).not.toMatch(/الرسول/);
  });
  it("writes no digit in any string of the quest except inside a placeholder, in any language, and the one number it names is 725", () => {
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) {
      if (!k.startsWith("ib_")) continue;
      const digits = v.replace(/\{\w+\}/g, "").match(/\d+/g) ?? [];
      expect(digits.every((d) => d === "725"), `${l}:${k}`).toBe(true);
      if (k !== "ib_left_1") expect(digits, `${l}:${k}`).toEqual([]);
    }
    for (const l of LANGS) expect(table(l).ib_left_1, l).toContain("725");
  });
  it("types no honorific and no bare parenthesis round Arabic or Urdu script in any string of the quest", () => {
    for (const l of ["ar", "ur"]) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ib_")) expect(/\(|\)/.test(v), `${l}:${k}`).toBe(false);
    for (const l of LANGS) for (const [k, v] of Object.entries(table(l))) if (k.startsWith("ib_")) expect(v, `${l}:${k}`).not.toMatch(/ﷺ|صلى الله|عليه السلام|رضي الله|رحمه الله/);
  });
  it("has every key the page and the content use, in all seven languages, with no part left empty, and no key that nothing uses", () => {
    const src = readFileSync(resolve(__dirname, "..", "ui", "route.ts"), "utf8");
    const keys = new Set([...src.matchAll(/"(ib_[a-z_0-9]+)"/g)].map((m) => m[1]!));
    for (const w of ["hudhud", "ibn", "child", "narrator"]) keys.add(`ib_who_${w}`);
    for (const id of ROUTE_STOPS) keys.add(`ib_stop_${stopKey(id)}`);
    for (const s of STYLES) keys.add(`ib_stage_${s}`);
    // The four strings shared with the paper's page are the same text under this quest's own keys.
    expect(keys.size).toBeGreaterThan(60);
    for (const l of LANGS) for (const k of keys) expect((table(l)[k] ?? "").trim().length, `${l}:${k}`).toBeGreaterThan(0);
    for (const k of Object.keys(table("en"))) if (k.startsWith("ib_")) expect(keys.has(k), k).toBe(true);
    for (const l of LANGS) expect(Object.keys(table(l)).filter((k) => k.startsWith("ib_")), l).toEqual(Object.keys(table("en")).filter((k) => k.startsWith("ib_")));
    // Every placeholder the English has, the other languages have too.
    for (const l of LANGS) for (const k of keys) expect([...(table(l)[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort(), `${l}:${k}`).toEqual([...(table("en")[k] ?? "").matchAll(/\{\w+\}/g)].map((m) => m[0]).sort());
  });
  it("is appended in one block after the keys that were there before it, and only the later quests' keys (`ts_`, then `cq_`, `ah_`, `rz_` and `kr_`, then the journey's `jn_` and al-Jazari's room's `jr_` and al-Tusi's room's `tsr_` and al-Khwarizmi's room's `akr_` and al-Kindi's room's `kdr_` and al-Idrisi's hall's `isr_` and al-Razi's study's `rzr_` and Karima's room's `krr_` and Ibn Battuta's inn's `ibr_` and the coffee room's `cqr_` and al-Jahiz's room's `jzr_`) come after", () => {
    for (const l of LANGS) {
      const ks = Object.keys(table(l));
      const first = ks.findIndex((k) => k.startsWith("ib_"));
      expect(first, l).toBeGreaterThan(0);
      const count = ks.filter((k) => k.startsWith("ib_")).length;
      expect(ks.slice(first, first + count).every((k) => k.startsWith("ib_")), l).toBe(true);
      expect(ks.slice(first + count).every((k) => k.startsWith("ts_") || k.startsWith("cq_") || k.startsWith("ah_") || k.startsWith("rz_") || k.startsWith("kr_") || k.startsWith("jn_") || k.startsWith("jr_") || k.startsWith("tsr_") || k.startsWith("akr_") || k.startsWith("kdr_") || k.startsWith("isr_") || k.startsWith("rzr_") || k.startsWith("krr_") || k.startsWith("ibr_") || k.startsWith("cqr_") || k.startsWith("jzr_") || k.startsWith("ahr_")), l).toBe(true);
    }
  });
  it("names every stop of a stage differently from the others, in every language, and the sentence of the stage in each language names every stop, in the road's order", () => {
    // Marks that a name or a sentence may carry and a plain name may not (Arabic points, shadda), and case, are not differences.
    const plain = (x: string) => x.normalize("NFD").replace(/[ً-ٰٟ]/g, "").toLowerCase();
    // The ports of East Africa are named by a phrase the sentence breaks up ("the trading ports of East Africa"), so their name is checked by its last words.
    const part: Record<string, Record<string, string>> = { "east-africa-ports": { ar: "شرق أفريقيا", en: "East Africa", ur: "مشرقی افریقہ", fr: "Afrique de l'Est", es: "África Oriental", tr: "Doğu Afrika", id: "Afrika Timur" }, mecca: { ar: "مكة" } };
    for (const l of LANGS) {
      const t = table(l);
      for (const style of STYLES) {
        const s = routeStage(style);
        const names = s.stops.map((id) => t[`ib_stop_${stopKey(id)}`]!);
        expect(new Set(names).size, `${l} ${style}`).toBe(s.stops.length);
        const sentence = plain(t[`ib_stage_${style}`]!);
        const ats = [...new Set(s.road)].map((id) => sentence.indexOf(plain(part[id]?.[l] ?? t[`ib_stop_${stopKey(id)}`]!)));
        ats.forEach((a, i) => expect(a, `${l} ${style}: ${s.road[i]}`).toBeGreaterThanOrEqual(0));
        expect([...ats].sort((a, b) => a - b), `${l} ${style}`).toEqual(ats);
      }
    }
  });
  it("takes each stop's name from the museum's place record unless it is on a short list of named exceptions, which is exactly this list", () => {
    const RECORD: Record<string, string> = { tangier: "tanja", "north-africa": "north-africa", egypt: "misr", syria: "syria", damascus: "damascus", mecca: "mecca", "red-sea": "red-sea", yemen: "yemen", aden: "aden", zayla: "zeila", mogadishu: "mogadishu", oman: "oman", "persian-gulf": "persian-gulf", iraq: "iraq", khuzistan: "khuzistan", fars: "fars", tabriz: "tabriz", baghdad: "baghdad", samarra: "samarra", mosul: "mosul" };
    // Where the game's name is not the record's label, and the reason: the record's label is a bracketed gloss, an article is missing, the label is a wrong word for the place, or the form is the one the stage's sentence uses.
    const EXCEPTIONS: Record<string, string> = {
      "tangier:ur": "تانگیر -> طنجہ",
      "north-africa:ar": "شمال إفريقيا -> شمال أفريقيا",
      "egypt:en": "Misr (Egypt) -> Egypt",
      "egypt:fr": "Misr (Égypte) -> Égypte",
      "egypt:es": "Misr (Egipto) -> Egipto",
      "syria:ar": "سوريا -> الشام",
      "mecca:fr": "Mecque -> La Mecque",
      "mecca:es": "la meca -> La Meca",
      "red-sea:fr": "mer Rouge -> Mer Rouge",
      "zayla:en": "Zeila -> Zayla",
      "zayla:ur": "زيلع -> زیلع",
      "zayla:fr": "Zeila -> Zayla",
      "zayla:es": "Zeila -> Zayla",
      "zayla:tr": "Sil -> Zayla",
      "zayla:id": "Hapus -> Zayla",
      // The museum's own place record names this sea differently from language to language (Persian in English,
      // French, Spanish and Urdu; Arabian in Arabic, Turkish and Indonesian). The game says only "the Gulf" in all
      // seven, taking no side; ledger HR-HH-30.
      "persian-gulf:ar": "الخليج العربي -> الخليج",
      "persian-gulf:en": "Persian Gulf -> the Gulf",
      "persian-gulf:es": "Golfo Pérsico -> el Golfo",
      "persian-gulf:fr": "Golfe Persique -> le Golfe",
      "persian-gulf:id": "Teluk Arab -> Teluk",
      "persian-gulf:tr": "Arap Körfezi -> Körfez",
      "persian-gulf:ur": "خلیج فارس -> خلیج",
      "khuzistan:ar": "الأهواز -> خوزستان",
      "khuzistan:en": "Khuzistan (al-Ahwaz) -> Khuzistan",
      "khuzistan:fr": "Khuzistan (al-Ahwaz) -> Khuzistan",
      "khuzistan:es": "Juzestán (al-Ahwaz) -> Juzestán",
      "khuzistan:tr": "Ahvaz -> Huzistan",
      "khuzistan:id": "Ahvaz -> Khuzestan",
      "fars:tr": "Şövalye -> Fars",
      "fars:id": "Ksatria -> Fars",
    };
    const found: Record<string, string> = {};
    for (const [stop, slug] of Object.entries(RECORD)) {
      const label = (parse(readFileSync(resolve(root, "data", "place", `${slug}.yaml`), "utf8")) as { label: Record<string, string> }).label;
      for (const l of LANGS) {
        const ours = table(l)[`ib_stop_${stopKey(stop)}`]!;
        if (label[l] !== ours) found[`${stop}:${l}`] = `${label[l]} -> ${ours}`;
      }
    }
    expect(found).toEqual(EXCEPTIONS);
    // The stops that have no record of their own, which the game names plainly.
    for (const id of ["upper-egypt", "east-africa-ports", "jibal"]) expect(Object.keys(RECORD)).not.toContain(id);
    // Tangier is named in the Atlas's own words nowhere, but Ibn Battuta's name is: the record name is the Atlas heading's.
    for (const l of LANGS.filter((x) => x !== "en")) expect(table(l).ib_rec_person, l).toBe(atlasTable(l).s_ibn_battuta);
  });
  it("says in the hub that quests are built, in every language, and no longer seven (the count itself is pinned in leaves.gtest.ts)", () => {
    expect(table("en").hub_note).toMatch(/(Eight|Nine|Ten|Eleven|Twelve|Thirteen) quests are built/);
    for (const l of LANGS) expect(table(l).hub_note).not.toMatch(/\bseven quests|\bsept quêtes|\bsiete misiones|\byedi görev|\btujuh misi|سبع مهمات|سات مہمیں/i);
  });
});

describe("the ways of playing as one quest", () => {
  it("changes nothing a way of playing should not: the same commands on the same stage give the same state", () => {
    const run = () => play(fresh("challenge"), [{ type: "go", stop: "mecca" }, { type: "peek" }, { type: "go", stop: "fars" }, { type: "flag", flag: "feather" }, { type: "go", stop: "mecca" }]);
    expect(run()).toEqual(run());
    const a = run();
    expect(a).toMatchObject({ at: 1, slips: 2, showing: false });
  });
});
