// The elephant clock's rules: each way of playing has one answer, a known fewest number of moves, and four goals.
import { describe, expect, it } from "vitest";
import { CLOCK_PARTS, CLOCK_ROAD, CLOCK_SLACK, clockPuzzle } from "../content/clock";
import { benchHit } from "../art/bench";
import { run, solutions, spare } from "../sim/chain";
import { applyClock, clockGoals, fewest, newClock, put, restoreClock, snapshotClock, type ClockCommand, type ClockState, type ClockStyle } from "../sim/clock";

const STYLES: ClockStyle[] = ["story", "explorer", "challenge"];
const play = (s: ClockState, cs: ClockCommand[]) => cs.reduce(applyClock, s);
/** The moves that put the road in order, place by place. */
const fix = (s: ClockState): ClockCommand[] => {
  const out: ClockCommand[] = [];
  let p = s.puzzle;
  CLOCK_ROAD.forEach((part, place) => {
    if (p.places[place] === part) return;
    out.push({ type: "put", place, part });
    p = put(p, place, part);
  });
  return out;
};

describe("the elephant clock", () => {
  it.each(STYLES)("starts not working and has one answer only, in %s", (style) => {
    const p = clockPuzzle(style);
    expect(run(p).end).not.toBe("done");
    expect(solutions(p)).toEqual([[...CLOCK_ROAD]]);
    expect(p.places.length).toBe(5);
  });
  it("is deeper in each way of playing: 2 moves, then 3 with two parts that do not belong, then 4 with every place wrong", () => {
    const of = (style: ClockStyle) => ({ par: fewest(clockPuzzle(style)), parts: clockPuzzle(style).parts.length, spare: spare(clockPuzzle(style)).map((x) => x.id), wrong: clockPuzzle(style).places.filter((id, i) => id !== CLOCK_ROAD[i]).length });
    expect(of("story")).toEqual({ par: 2, parts: 5, spare: [], wrong: 4 });
    expect(of("explorer")).toEqual({ par: 3, parts: 7, spare: ["falcon", "dragon"], wrong: 4 });
    expect(of("challenge")).toEqual({ par: 4, parts: 7, spare: ["dragon", "bowl"], wrong: 5 });
    expect(CLOCK_SLACK).toEqual({ story: null, explorer: 2, challenge: 0 });
  });
  it("keeps the two parts off the ball's road true to what they answer to: the bird to the sinking float, the rider to a ball", () => {
    const by = Object.fromEntries(CLOCK_PARTS.map((p) => [p.id, p]));
    expect([by.bird!.takes, by.falcon!.takes, by.float!.gives]).toEqual(["sink", "sink", "sink"]);
    expect([by.rider!.takes, by.dragon!.takes, by.falcon!.gives]).toEqual(["ball", "ball", "ball"]);
    // Neither hands on anything another part answers to: put on the road, each stops the clock one place later.
    for (const id of ["bird", "rider"]) expect(CLOCK_PARTS.some((p) => p.takes === by[id]!.gives)).toBe(false);
  });
  it.each(STYLES)("can be finished in the fewest moves, and then nothing more changes, in %s", (style) => {
    let s = newClock(style, clockPuzzle(style));
    s = play(s, [{ type: "go" }]);
    expect([s.done, s.runs, s.last?.end === "done"]).toEqual([false, 1, false]);
    s = play(s, fix(s));
    expect(s.last).toBeNull();
    s = play(s, [{ type: "go" }]);
    expect(s.done).toBe(true);
    expect(s.last!.moved.map((m) => m.part)).toEqual([...CLOCK_ROAD]);
    expect(play(s, [{ type: "put", place: 0, part: "bowl" }, { type: "go" }, { type: "flag", flag: "feather" }])).toBe(s);
    // Putting the road in order place by place is never worse than one move over the fewest.
    expect(s.moves).toBeLessThanOrEqual(s.par + 1);
  });
  it("counts only moves that change something, and gives its four goals as every quest does", () => {
    let s = newClock("explorer", clockPuzzle("explorer"));
    s = play(s, [{ type: "put", place: 0, part: "float" }, { type: "put", place: 9, part: "float" }, { type: "put", place: 1, part: "nobody" }]);
    expect(s.moves).toBe(0);
    s = play(s, [{ type: "flag", flag: "askedFloat" }, { type: "flag", flag: "askedFloat" }, { type: "flag", flag: "nonsense" as never }]);
    expect(s.flags).toEqual(["askedFloat"]);
    expect(clockGoals(s, 2)).toEqual({ turns: 0, par: 3, curiosity: false, ingenuity: true, kindness: false, feather: false });
    s = play(s, [{ type: "flag", flag: "askedBalls" }, { type: "flag", flag: "kind" }, { type: "flag", flag: "feather" }, { type: "put", place: 1, part: "rider" }, { type: "put", place: 1, part: "bird" }, { type: "put", place: 1, part: "rider" }, { type: "put", place: 1, part: "bird" }]);
    s = play(s, [...fix(s), { type: "go" }]);
    expect(s.done).toBe(true);
    expect(clockGoals(s, CLOCK_SLACK.explorer)).toMatchObject({ curiosity: true, ingenuity: false, kindness: true, feather: true });
    expect(clockGoals(s, CLOCK_SLACK.story).ingenuity).toBe(true);
  });
  it("says where a wrong row stops: the bird whistles and no ball is let go", () => {
    const s = play(newClock("explorer", clockPuzzle("explorer")), [{ type: "go" }]);
    expect(s.last).toMatchObject({ end: "idle", at: 2, carrying: "whistle" });
    expect(s.last!.moved.map((m) => m.part)).toEqual(["float", "bird"]);
  });
});

describe("the elephant clock kept in the middle", () => {
  const through = (s: ClockState) => restoreClock(JSON.parse(JSON.stringify(snapshotClock(s))), clockPuzzle);
  /** A clock with a move or two made and a flag set, not yet working. */
  const started = (style: ClockStyle) => play(newClock(style, clockPuzzle(style)), [{ type: "put", place: 0, part: "float" }, { type: "flag", flag: "feather" }]);
  const snap = (style: ClockStyle) => JSON.parse(JSON.stringify(snapshotClock(started(style)))) as Record<string, unknown>;
  const refused = (x: unknown) => restoreClock(x, clockPuzzle);

  it.each(STYLES)("comes back through JSON as it was, with no run shown and not done, in %s", (style) => {
    const s = started(style);
    const back = through(s)!;
    expect(back).not.toBeNull();
    expect(back.puzzle.places).toEqual(s.puzzle.places);
    expect([back.style, back.moves, back.flags, back.par, back.last, back.runs, back.done]).toEqual([style, s.moves, s.flags, s.par, null, 0, false]);
    expect(back.puzzle.parts).toEqual(clockPuzzle(style).parts);
    // And it can be played on to its end.
    const end = play(back, [...fix(back), { type: "go" }]);
    expect(end.done).toBe(true);
  });
  it("keeps a clock with nothing changed too, and an empty place", () => {
    expect(restoreClock(snapshotClock(newClock("story", clockPuzzle("story"))), clockPuzzle)).not.toBeNull();
    expect(refused({ ...snap("explorer"), places: [null, "bird", "rider", "bowl", "vessel"] })).not.toBeNull();
  });
  it("refuses what cannot be trusted", () => {
    const good = snap("explorer");
    expect(refused(good)).not.toBeNull();
    for (const bad of [null, undefined, 3, "x", [], { ...good, style: "easy" }, { ...good, style: undefined }]) expect(refused(bad)).toBeNull();
    // Parts: unknown, one standing twice, a number, and one that belongs to another style's bench.
    expect(refused({ ...good, places: ["float", "nobody", "rider", "bowl", "vessel"] })).toBeNull();
    expect(refused({ ...good, places: ["float", "bird", "bird", "bowl", "vessel"] })).toBeNull();
    expect(refused({ ...good, places: ["float", 2, "rider", "bowl", "vessel"] })).toBeNull();
    expect(refused({ ...snap("story"), places: ["float", "bird", "rider", "bowl", "vessel"] })).toBeNull();
    // Length.
    expect(refused({ ...good, places: ["float", "bird", "rider", "bowl"] })).toBeNull();
    expect(refused({ ...good, places: ["float", "bird", "rider", "bowl", "vessel", "falcon"] })).toBeNull();
    expect(refused({ ...good, places: "float" })).toBeNull();
    // Moves.
    for (const moves of [-1, 1.5, "3", null, NaN, Infinity, 1e9]) expect(refused({ ...good, moves })).toBeNull();
    expect(refused({ ...good, moves: undefined })).toBeNull();
    // Flags that are not a list.
    expect(refused({ ...good, flags: "feather" })).toBeNull();
    // A row that works in fewer moves than the fewest there are cannot be true.
    expect(refused({ ...good, places: [...CLOCK_ROAD], moves: 0 })).toBeNull();
    expect(refused({ ...snap("story"), places: [...CLOCK_ROAD], moves: 1 })).toBeNull();
    // Put right but not yet set going, it comes back as it was left, and one press finishes it.
    const ready = refused({ ...snap("story"), places: [...CLOCK_ROAD], moves: 2 })!;
    expect([ready.done, ready.moves, ready.last]).toEqual([false, 2, null]);
    expect(applyClock(ready, { type: "go" }).done).toBe(true);
  });
  it("drops flags it does not know, keeps the ones it does, and works the fewest moves out again", () => {
    const back = refused({ ...snap("explorer"), flags: ["feather", "askedFloat", "nonsense", 7, "kind", "kind"], par: 99, runs: 5, done: true, last: { end: "done" } })!;
    expect(back.flags).toEqual(["askedFloat", "kind", "feather"]);
    expect([back.par, back.runs, back.done, back.last]).toEqual([3, 0, false, null]);
    expect(back.par).toBe(fewest(clockPuzzle("explorer")));
  });
});

describe("the apprentice's answer is kept, whichever answer it was", () => {
  const through = (s: ClockState) => restoreClock(JSON.parse(JSON.stringify(snapshotClock(s))), clockPuzzle)!;
  it("keeps `answered` for a blunt answer too, without making it a goal, and a resume still knows", () => {
    const blunt = play(newClock("explorer", clockPuzzle("explorer")), [{ type: "flag", flag: "answered" }]);
    expect(blunt.flags).toEqual(["answered"]);
    expect(clockGoals(blunt, 2).kindness).toBe(false);
    const back = through(blunt);
    expect(back.flags).toEqual(["answered"]);
    expect(clockGoals(back, 2).kindness).toBe(false);
    // The same flag set twice is one flag, and a kind answer carries both.
    const kind = play(blunt, [{ type: "flag", flag: "answered" }, { type: "flag", flag: "kind" }]);
    expect(through(kind).flags).toEqual(["kind", "answered"]);
    expect(clockGoals(through(kind), 2).kindness).toBe(true);
  });
  it("accepts a snapshot kept before the flag existed", () => {
    const old = { style: "story", places: [...clockPuzzle("story").places], moves: 1, flags: ["askedBalls", "kind"] };
    const back = restoreClock(old, clockPuzzle)!;
    expect(back).not.toBeNull();
    expect(back.flags).toEqual(["askedBalls", "kind"]);
  });
});

describe("the picture of the bench can be played by touch", () => {
  it("finds the place under a point, the spare part in the box, or nothing", () => {
    // Places stand at x = 110 + 150 i, half as wide as 62 and 78 high around y = 190; the box at x = 880.
    for (let i = 0; i < 5; i++) expect(benchHit(110 + 150 * i, 190, false, 2)).toEqual({ place: i });
    expect(benchHit(110 + 62, 190 + 78, false, 2)).toEqual({ place: 0 });
    expect(benchHit(110 + 63, 190, false, 2)).toBeNull();
    expect(benchHit(110, 190 - 79, false, 2)).toBeNull();
    expect(benchHit(775, 190, false, 2)).toBeNull();
    expect(benchHit(880, 125, false, 2)).toEqual({ spare: 0 });
    expect(benchHit(880, 237, false, 2)).toEqual({ spare: 1 });
    expect(benchHit(880, 237, false, 1)).toBeNull();
    expect(benchHit(880, 125, false, 0)).toBeNull();
    expect(benchHit(880, 60, false, 2)).toBeNull();
    expect(benchHit(880, 125, false, 5)).toEqual({ spare: 0 });
    expect(benchHit(880, 330, false, 2)).toBeNull();
    expect(benchHit(500, 20, false, 2)).toBeNull();
  });
  it("is the mirror image on a page that reads right to left: the first place is on the right", () => {
    for (let i = 0; i < 5; i++) {
      expect(benchHit(1000 - (110 + 150 * i), 190, true, 2)).toEqual({ place: i });
    }
    expect(benchHit(120, 125, true, 2)).toEqual({ spare: 0 });
    expect(benchHit(120, 237, true, 2)).toEqual({ spare: 1 });
    expect(benchHit(880, 125, true, 2)).toEqual({ place: 0 });
    // On a right-to-left page the last place stands at 290, and the box of spare parts is at the left.
    expect(benchHit(290, 190, true, 2)).toEqual({ place: 4 });
  });
});
