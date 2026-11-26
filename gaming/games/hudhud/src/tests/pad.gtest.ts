// The controller's layout, without a controller: what is held, what has just been pressed, and changing a button.
import { describe, expect, it } from "vitest";
import { DEFAULT_PAD, PAD_ACTIONS, assignPad, firstPressed, readPad, type PadLike } from "../input/pad";
import { current, readSave } from "../save/save";

const pad = (down: number[] = [], axes: number[] = [0, 0]): PadLike => ({ buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: down.includes(i) })), axes });

describe("the gamepad", () => {
  it("uses the standard layout: lower button flies and goes on, right goes back, left touches, Start pauses", () => {
    expect(DEFAULT_PAD).toEqual({ fly: 0, back: 1, touch: 2, pause: 9 });
    expect(readPad(pad([0]), DEFAULT_PAD, []).pressed).toEqual(["fly"]);
    expect(readPad(pad([1]), DEFAULT_PAD, []).pressed).toEqual(["back"]);
    expect(readPad(pad([2]), DEFAULT_PAD, []).pressed).toEqual(["touch"]);
    expect(readPad(pad([9]), DEFAULT_PAD, []).pressed).toEqual(["pause"]);
  });
  it("reports a press once, however long the button is held", () => {
    const first = readPad(pad([0]), DEFAULT_PAD, []);
    expect(first.pressed).toEqual(["fly"]);
    const held = readPad(pad([0]), DEFAULT_PAD, first.held);
    expect(held.pressed).toEqual([]);
    expect(held.jump).toBe(true);
    const again = readPad(pad([0]), DEFAULT_PAD, readPad(pad([]), DEFAULT_PAD, held.held).held);
    expect(again.pressed).toEqual(["fly"]);
  });
  it("moves with the stick past its dead zone, or with the directional pad", () => {
    expect(readPad(pad([], [0.2, 0]), DEFAULT_PAD, [])).toMatchObject({ left: false, right: false });
    expect(readPad(pad([], [-0.5, 0]), DEFAULT_PAD, []).left).toBe(true);
    expect(readPad(pad([], [0.5, 0.7]), DEFAULT_PAD, [])).toMatchObject({ right: true, down: true });
    expect(readPad(pad([14]), DEFAULT_PAD, []).left).toBe(true);
    expect(readPad(pad([15, 13, 12]), DEFAULT_PAD, [])).toMatchObject({ right: true, down: true, jump: true });
  });
  it("lets a button be given to an action, and never leaves an action without one", () => {
    const m = assignPad(DEFAULT_PAD, "touch", 0);
    expect(m).toEqual({ fly: 2, back: 1, touch: 0, pause: 9 });
    expect(new Set(Object.values(m)).size).toBe(PAD_ACTIONS.length);
    expect(assignPad(DEFAULT_PAD, "pause", 8).pause).toBe(8);
    expect(readPad(pad([0]), m, []).pressed).toEqual(["touch"]);
    expect(firstPressed([false, true, true], [false, true, false])).toBe(2);
    expect(firstPressed([true], [true])).toBeNull();
  });
  it("is saved, and a broken record of it gives the standard layout back", () => {
    const slot = (padMap: unknown) => current(readSave(JSON.stringify({ v: 1, slot: 0, slots: [{ settings: { pad: padMap } }] })).save).settings.pad;
    expect(slot({ fly: 2, back: 1, touch: 0, pause: 9 })).toEqual({ fly: 2, back: 1, touch: 0, pause: 9 });
    for (const bad of [undefined, 5, { fly: 0 }, { fly: 0, back: 0, touch: 2, pause: 9 }, { fly: -1, back: 1, touch: 2, pause: 9 }, { fly: 0.5, back: 1, touch: 2, pause: 9 }]) expect(slot(bad)).toEqual(DEFAULT_PAD);
  });
  it("keeps the direction buttons for moving: none can be given to an action, by hand or by a broken file", () => {
    for (const b of [12, 13, 14, 15]) expect(assignPad(DEFAULT_PAD, "fly", b)).toBe(DEFAULT_PAD);
    expect(firstPressed([false, false, false, false, false, false, false, false, false, false, false, false, true, false], [])).toBeNull();
    const slot = (padMap: unknown) => current(readSave(JSON.stringify({ v: 1, slot: 0, slots: [{ settings: { pad: padMap } }] })).save).settings.pad;
    expect(slot({ fly: 15, back: 1, touch: 2, pause: 9 })).toEqual(DEFAULT_PAD);
  });
  it("reports one step up or down for one push of the pad or the stick, for choosing in a talk", () => {
    expect(readPad(pad([12]), DEFAULT_PAD, []).step).toBe(-1);
    expect(readPad(pad([13]), DEFAULT_PAD, []).step).toBe(1);
    const held = readPad(pad([13]), DEFAULT_PAD, []);
    expect(readPad(pad([13]), DEFAULT_PAD, held.held).step).toBe(0);
    const pushed = readPad(pad([], [0, 0.9]), DEFAULT_PAD, [], 0);
    expect(pushed.step).toBe(1);
    expect(readPad(pad([], [0, 0.9]), DEFAULT_PAD, pushed.held, pushed.stick).step).toBe(0);
    expect(readPad(pad([], [0, -0.9]), DEFAULT_PAD, [], 0).step).toBe(-1);
  });
});
