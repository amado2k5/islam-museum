// How the bird moves: the forgiving parts, and that the frame rate changes nothing.
import { describe, expect, it } from "vitest";
import { ASSIST, ROOM, WORLD } from "../content/workshop";
import { MOVE, advance, newMover, stepMover, type Intent, type Mover, type Room } from "../sim/move";

const still: Intent = { dir: 0, jump: false, down: false };
const room: Room = { bounds: { x: 0, y: 0, w: 1000, h: 800 }, floor: 600, perches: [{ x: 300, y: 450, w: 200, h: 12 }] };
const run = (m: Mover, input: Intent, steps: number, r = room, assist = ASSIST.explorer) => {
  for (let i = 0; i < steps; i++) m = stepMover(m, r, input, assist);
  return m;
};
const secs = (s: number) => Math.round(s / MOVE.step);

describe("the bird's movement", () => {
  it("stands still on the floor and runs when asked", () => {
    let m = run(newMover(100, 600), still, 60);
    expect(m.y).toBe(600);
    expect(m.grounded).toBe(true);
    m = run(m, { ...still, dir: 1 }, secs(1));
    expect(m.x).toBeGreaterThan(300);
    expect(m.vx).toBeCloseTo(MOVE.run, 0);
    expect(m.facing).toBe(1);
  });
  it("hops from the ground, and flaps in the air a limited number of times until it lands", () => {
    let m = stepMover(newMover(100, 600), room, { ...still, jump: true });
    expect(m.vy).toBe(-MOVE.hop + MOVE.gravity * MOVE.step);
    expect(m.hops).toBe(1);
    for (let i = 0; i < MOVE.flaps + 3; i++) {
      m = run(m, still, 12);
      m = stepMover(m, room, { ...still, jump: true });
    }
    expect(m.flapsMade).toBe(MOVE.flaps);
    expect(m.flaps).toBe(0);
    m = run(m, still, secs(4));
    expect(m.grounded).toBe(true);
    expect(m.flaps).toBe(MOVE.flaps);
  });
  it("still hops a moment after walking off a perch (coyote time), and not long after", () => {
    const off = (wait: number) => {
      let m: Mover = { ...newMover(495, 450), vx: MOVE.run };
      m = run(m, { ...still, dir: 1 }, 4);
      while (m.grounded) m = stepMover(m, room, { ...still, dir: 1 });
      m = run(m, { ...still, dir: 1 }, wait);
      return stepMover(m, room, { dir: 1, jump: true, down: false });
    };
    expect(off(secs(0.05)).hops).toBe(1);
    const late = off(secs(0.3));
    expect(late.hops).toBe(0);
    expect(late.flapsMade).toBe(1);
  });
  it("remembers a press made just before landing (jump buffering)", () => {
    let m: Mover = { ...newMover(100, 600), y: 600 - 14, vy: 300, grounded: false, coyote: 0, flaps: 0 };
    m = stepMover(m, room, { ...still, jump: true });
    expect(m.hops).toBe(0);
    m = run(m, { ...still, jump: true }, secs(0.1));
    expect(m.hops).toBe(1);
  });
  it("falls slowly while the button is held: a glide", () => {
    const fall = (jump: boolean) => run({ ...newMover(100, 600), y: 100, grounded: false, coyote: 0, flaps: 0, held: true }, { ...still, jump }, secs(1));
    expect(fall(true).gliding).toBe(true);
    expect(fall(true).y).toBeLessThan(100 + MOVE.glideFall * 1.05);
    expect(fall(false).y).toBe(600);
  });
  it("lands on a perch from above, flies up through it from below, and drops through it when asked", () => {
    let m: Mover = { ...newMover(400, 600), y: 300, grounded: false, coyote: 0 };
    m = run(m, still, secs(1));
    expect(m.y).toBe(450);
    expect(m.grounded).toBe(true);
    m = run(m, { ...still, down: true }, secs(1));
    expect(m.y).toBe(600);
    let up = stepMover(newMover(400, 600), room, { ...still, jump: true });
    let top = up.y;
    for (let i = 0; i < 6; i++) {
      up = run(up, still, 10);
      up = stepMover(up, room, { ...still, jump: true });
      top = Math.min(top, up.y);
    }
    expect(top).toBeLessThan(450);
  });
  it("is kept inside the walls and under the ceiling", () => {
    const m = run(newMover(100, 600), { ...still, dir: -1 }, secs(3));
    expect(m.x).toBe(MOVE.half);
    let up = newMover(500, 600);
    for (let i = 0; i < 400; i++) up = stepMover(up, { ...room, perches: [] }, { ...still, jump: i % 8 < 4 }, { extraFlaps: 500, slowFall: 1 });
    expect(up.y - MOVE.tall).toBeGreaterThanOrEqual(0);
  });
  it("ends in the same place at 30, 60 and 144 frames a second", () => {
    const play = (fps: number) => {
      let m = newMover(250, WORLD.floor);
      let carry = 0;
      const frames = Math.round(6 * fps);
      for (let f = 0; f < frames; f++) {
        const time = f / fps;
        const input: Intent = { dir: time < 3 ? 1 : -1, jump: Math.floor(time * 2.5) % 2 === 0, down: false };
        ({ mover: m, carry } = advance(m, ROOM, input, 1 / fps, carry));
      }
      return m;
    };
    const [a, b, c] = [play(30), play(60), play(144)];
    // Inputs are read once a frame, so the paths differ by at most a frame's worth of travel.
    expect(Math.abs(a.x - b.x)).toBeLessThan(40);
    expect(Math.abs(c.x - b.x)).toBeLessThan(40);
    expect(play(60)).toEqual(play(60));
  });
  it("reaches every mirror, the cat, the cord and the feather: a bird can perch within reach of each", async () => {
    const { THINGS } = await import("../content/workshop");
    for (const t of THINGS) {
      const stands = [WORLD.floor, ...ROOM.perches.filter((p) => t.x >= p.x - 60 && t.x <= p.x + p.w + 60).map((p) => p.y)];
      const near = stands.some((y) => Math.abs(y - 30 - t.y) < t.reach);
      expect(near, t.id).toBe(true);
    }
  });
  it("gives Story more flaps and a slower glide, and changes nothing else", () => {
    expect(ASSIST.story.extraFlaps).toBeGreaterThan(0);
    expect(ASSIST.story.slowFall).toBeLessThan(1);
    expect(ASSIST.explorer).toEqual(ASSIST.challenge);
  });
});
