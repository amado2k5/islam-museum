// The chain of parts: a motion handed from one to the next, where it stops, and puzzles made from seeds.
import { Rng } from "@im/kernel/prng";
import { describe, expect, it } from "vitest";
import { distance, elapsed, generate, lift, run, solutions, spare, stand, swap, type ChainPuzzle } from "../sim/chain";

// The elephant clock's hand-overs as the museum's record names them: a ball passes from the falcon to the dragon
// to the vessel with the gong. The names of the motions are placeholders until the quest is written and reviewed.
const clock: ChainPuzzle = {
  start: "half-hour",
  goal: "gong",
  places: ["falcon", "dragon", "vessel"],
  parts: [
    { id: "falcon", takes: "half-hour", gives: "ball-falls" },
    { id: "dragon", takes: "ball-falls", gives: "ball-carried" },
    { id: "vessel", takes: "ball-carried", gives: "gong" },
    { id: "drum", takes: "ball-falls", gives: "drumbeat" },
  ],
};

describe("the chain", () => {
  it("does its work when every part hands on what the next one takes", () => {
    const r = run(clock);
    expect(r.end).toBe("done");
    expect(r.moved.map((m) => m.part)).toEqual(["falcon", "dragon", "vessel"]);
    expect(r.carrying).toBe("gong");
  });
  it("stops at the first part that does not answer, and says where and with what in the air", () => {
    const r = run(swap(clock, 1, 2));
    expect(r).toMatchObject({ end: "idle", at: 1, carrying: "ball-falls" });
    expect(r.moved.map((m) => m.part)).toEqual(["falcon"]);
  });
  it("stops at an empty place", () => {
    expect(run(lift(clock, 1))).toMatchObject({ end: "empty", at: 1, carrying: "ball-falls" });
  });
  it("runs to the end and still fails when the last part gives the wrong thing", () => {
    const p = stand(lift({ ...clock, places: ["falcon", "drum", null] }, 2), 1, "drum");
    expect(run({ ...p, places: ["falcon", "drum"] })).toMatchObject({ end: "wrong", carrying: "drumbeat" });
  });
  it("keeps the parts that are not standing as spare, and changes nothing when asked for nonsense", () => {
    expect(spare(clock).map((x) => x.id)).toEqual(["drum"]);
    expect(swap(clock, 0, 9)).toBe(clock);
    expect(swap(clock, 1, 1)).toBe(clock);
    expect(stand(clock, 0, "falcon")).toBe(clock);
    expect(stand(clock, 0, "nobody")).toBe(clock);
    expect(lift(lift(clock, 0), 0).places[0]).toBeNull();
    const withDrum = stand(clock, 1, "drum");
    expect(withDrum.places).toEqual(["falcon", "drum", "vessel"]);
    expect(spare(withDrum).map((x) => x.id)).toEqual(["dragon"]);
  });
  it("has one arrangement that works, and counts how far any muddle is from it", () => {
    expect(solutions(clock)).toEqual([["falcon", "dragon", "vessel"]]);
    expect(distance(clock)).toBe(0);
    expect(distance(swap(clock, 0, 2))).toBe(2);
    expect(distance({ ...clock, goal: "nothing-gives-this" })).toBeNull();
  });
  it("can always be put right from any muddle: no arrangement is a dead end", () => {
    const ids = [...clock.parts.map((p) => p.id), null];
    for (const a of ids) for (const b of ids) for (const c of ids) {
      if ([a, b, c].filter(Boolean).length !== new Set([a, b, c].filter(Boolean)).size) continue;
      expect(distance({ ...clock, places: [a, b, c] })).not.toBeNull();
    }
  });
});

describe("chains made from a seed", () => {
  it("are the same for the same seed", () => {
    expect(generate(new Rng("hudhud-chain-1"))).toEqual(generate(new Rng("hudhud-chain-1")));
  });
  it("start in a muddle and can be put right, for 3,000 seeds at three sizes", () => {
    let n = 0;
    for (const opts of [{ length: 3, decoys: 1 }, { length: 4, decoys: 2 }, { length: 6, decoys: 2 }]) {
      for (let seed = 0; seed < 1000; seed++) {
        const p = generate(new Rng(`hudhud-chain-${opts.length}-${seed}`), opts);
        expect(run(p).end, `seed ${seed}`).not.toBe("done");
        const d = distance(p);
        expect(d, `seed ${seed}`).not.toBeNull();
        expect(d!, `seed ${seed}`).toBeGreaterThanOrEqual(2);
        expect(new Set(p.places).size).toBe(p.places.length);
        n++;
      }
    }
    expect(n).toBe(3000);
  });
});

describe("the balls in the vessel", () => {
  it("are read as half hours gone", () => {
    expect(elapsed(0)).toEqual({ hours: 0, half: false });
    expect(elapsed(1)).toEqual({ hours: 0, half: true });
    expect(elapsed(5)).toEqual({ hours: 2, half: true });
    expect(elapsed(8)).toEqual({ hours: 4, half: false });
    expect(elapsed(-3)).toEqual({ hours: 0, half: false });
  });
});
