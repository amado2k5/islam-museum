import { describe, expect, it } from "vitest";
import { keysHeld, padEvents, type PadMap } from "../src/gamepad";

const map: PadMap = { buttons: { 0: "Enter", 1: "Escape", 9: "p" }, move: ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"], look: ["r", "e", "f", "q"], repeatMs: 100 };
const pad = (pressed: number[], axes: number[] = [0, 0, 0, 0]) => ({ buttons: Array.from({ length: 16 }, (_, i) => pressed.includes(i)), axes });

describe("a controller read as keys", () => {
  it("maps buttons, the cross and both sticks to the game's keys, with a dead zone", () => {
    expect([...keysHeld(pad([0, 9]), map)].sort()).toEqual(["Enter", "p"]);
    expect([...keysHeld(pad([12, 14]), map)].sort()).toEqual(["ArrowLeft", "ArrowUp"]);
    expect([...keysHeld(pad([], [0.9, -0.8, -0.7, 0.6]), map)].sort()).toEqual(["ArrowRight", "ArrowUp", "f", "q"]);
    expect(keysHeld(pad([], [0.3, -0.3, 0.2, 0.1]), map).size).toBe(0);
    // A button the game gave no key does nothing.
    expect(keysHeld(pad([5]), map).size).toBe(0);
  });

  it("presses a key once, repeats it while held, and releases it", () => {
    const sent = new Map<string, number>();
    const a = new Set<string>();
    const b = new Set(["Enter"]);
    expect(padEvents(a, b, sent, 0, map)).toEqual([{ type: "down", key: "Enter", repeat: false }]);
    expect(padEvents(b, b, sent, 50, map)).toEqual([]);
    expect(padEvents(b, b, sent, 100, map)).toEqual([{ type: "down", key: "Enter", repeat: true }]);
    expect(padEvents(b, a, sent, 120, map)).toEqual([{ type: "up", key: "Enter", repeat: false }]);
    expect(sent.size).toBe(0);
  });
});
