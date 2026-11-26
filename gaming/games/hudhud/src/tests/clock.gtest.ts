// The elephant clock's rules: each way of playing has one answer, a known fewest number of moves, and four goals.
import { describe, expect, it } from "vitest";
import { CLOCK_PARTS, CLOCK_ROAD, CLOCK_SLACK, clockPuzzle } from "../content/clock";
import { run, solutions, spare } from "../sim/chain";
import { applyClock, clockGoals, fewest, newClock, put, type ClockCommand, type ClockState, type ClockStyle } from "../sim/clock";

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
