// The light puzzle: the beam's path, the workshop's own puzzle in each way of playing, and puzzles made from seeds.
import { Rng } from "@im/kernel/prng";
import { describe, expect, it } from "vitest";
import { TURN_SLACK, solvedLean, workshopPuzzle, type PlayStyle } from "../content/workshop";
import { generate, solve, trace, turnMirror, type LightPuzzle } from "../sim/light";

const bare: LightPuzzle = { cols: 6, rows: 4, source: { col: 0, row: 1, dir: "E" }, mirrors: [], blocks: [], prisms: [], target: { col: 5, row: 1 } };

describe("the beam", () => {
  it("goes straight to the target when nothing is in the way", () => {
    const t = trace(bare);
    expect(t.lit).toBe(true);
    expect(t.segments).toHaveLength(1);
    expect(t.touched).toEqual([]);
  });
  it("is cut by a solid body, as the museum's record of the dark-room tests says", () => {
    const t = trace({ ...bare, blocks: [{ col: 3, row: 1 }] });
    expect(t.end).toBe("block");
    expect(t.lit).toBe(false);
    expect(t.last).toEqual({ col: 3, row: 1 });
  });
  it("is turned a quarter by a mirror, one way or the other by its lean", () => {
    const up = trace({ ...bare, mirrors: [{ id: "a", col: 2, row: 1, lean: "/" }] });
    expect(up.segments[1]!.dir).toBe("N");
    expect(up.end).toBe("wall");
    const down = trace({ ...bare, mirrors: [{ id: "a", col: 2, row: 1, lean: "\\" }], target: { col: 2, row: 3 } });
    expect(down.segments[1]!.dir).toBe("S");
    expect(down.lit).toBe(true);
    expect(down.touched).toEqual(["a"]);
  });
  it("passes through a prism and is spread from there on, with the rule unchanged", () => {
    const t = trace({ ...bare, prisms: [{ col: 2, row: 1 }] });
    expect(t.lit).toBe(true);
    expect(t.segments.map((s) => s.spread)).toEqual([false, true]);
  });
  it("ends, and says so, when mirrors send it round in a ring", () => {
    const ring: LightPuzzle = { cols: 4, rows: 4, source: { col: 0, row: 1, dir: "E" }, blocks: [], prisms: [], target: { col: 3, row: 3 }, mirrors: [{ id: "a", col: 2, row: 1, lean: "\\" }, { id: "b", col: 2, row: 2, lean: "/" }, { id: "c", col: 1, row: 2, lean: "\\" }, { id: "d", col: 1, row: 1, lean: "/" }] };
    const t = trace(ring);
    expect(["loop", "wall"]).toContain(t.end);
    expect(t.segments.length).toBeLessThan(40);
  });
  it("turning a mirror twice puts it back", () => {
    const p = workshopPuzzle("explorer");
    expect(turnMirror(turnMirror(p, "c"), "c")).toEqual(p);
    expect(turnMirror(p, "nobody")).toEqual(p);
  });
});

describe("the workshop's puzzle", () => {
  const PAR: Record<PlayStyle, number> = { story: 3, explorer: 3, challenge: 5 };
  it.each(["story", "explorer", "challenge"] as PlayStyle[])("starts dark and can be lit, in %s", (style) => {
    const p = workshopPuzzle(style);
    expect(trace(p).lit).toBe(false);
    const s = solve(p);
    expect(s.turns).toBe(PAR[style]);
    // One setting only lights the page: there is no accident to stumble on and no second answer to miss.
    expect(s.settings).toBe(1);
    let q = p;
    for (const id of s.ids) q = turnMirror(q, id);
    const t = trace(q);
    expect(t.lit).toBe(true);
    expect(t.touched).toEqual(["a", "b", "c", "d", "e"]);
    // No prism stands in the workshop: nothing spreads the beam (it was taken out on 26 November 2026).
    expect(p.prisms).toEqual([]);
    expect(t.segments.every((seg) => !seg.spread)).toBe(true);
    for (const m of q.mirrors) expect(m.lean, m.id).toBe(solvedLean(m.id));
  });
  it("cannot be crossed in a straight line: the books are in the way", () => {
    const p = workshopPuzzle("explorer");
    expect(trace({ ...p, mirrors: [], target: { col: 11, row: 1 } }).end).toBe("block");
  });
  it("gives Story no turn count, Explorer two spare turns and Challenge none", () => {
    expect(TURN_SLACK).toEqual({ story: null, explorer: 2, challenge: 0 });
  });
  it("can always be lit from wherever the player has got to: no setting is a dead end", () => {
    const p = workshopPuzzle("explorer");
    for (let mask = 0; mask < 32; mask++) {
      let q = p;
      p.mirrors.forEach((m, i) => mask & (1 << i) && (q = turnMirror(q, m.id)));
      expect(solve(q).turns, `setting ${mask}`).not.toBeNull();
    }
  });
});

describe("puzzles made from a seed", () => {
  it("are the same for the same seed", () => {
    expect(generate(new Rng("hudhud-daily-1"))).toEqual(generate(new Rng("hudhud-daily-1")));
  });
  it("start dark and can be lit, for 3,000 seeds at three sizes", () => {
    let total = 0;
    for (const opts of [{ turns: 2, decoys: 1 }, { turns: 3, decoys: 2 }, { turns: 5, decoys: 3 }]) {
      for (let seed = 0; seed < 1000; seed++) {
        const p = generate(new Rng(`hudhud-light-${opts.turns}-${seed}`), opts);
        expect(trace(p).lit, `seed ${seed}`).toBe(false);
        const s = solve(p);
        expect(s.turns, `seed ${seed}`).not.toBeNull();
        expect(s.turns!, `seed ${seed}`).toBeGreaterThanOrEqual(1);
        expect(new Set(p.mirrors.map((m) => `${m.col},${m.row}`)).size).toBe(p.mirrors.length);
        total++;
      }
    }
    expect(total).toBe(3000);
  });
});
