import { describe, expect, it } from "vitest";
import { readKeys, translate, type Action } from "../src/keymap";

const actions: Action[] = [{ id: "pause", key: "p" }, { id: "day", key: "n" }, { id: "undo", key: "u" }];

describe("the player's own keys", () => {
  it("keeps the defaults until the player chooses, and refuses a clash or a broken record", () => {
    expect(readKeys("t", actions, null)).toEqual({ pause: "p", day: "n", undo: "u" });
    expect(readKeys("t", actions, "{bad")).toEqual({ pause: "p", day: "n", undo: "u" });
    expect(readKeys("t", actions, JSON.stringify({ pause: "K" }))).toEqual({ pause: "k", day: "n", undo: "u" });
    // Two actions on one key: the later goes back to its default.
    expect(readKeys("t", actions, JSON.stringify({ pause: "z", day: "z" }))).toEqual({ pause: "z", day: "n", undo: "u" });
  });

  it("turns a chosen key into the game's own, and silences a default the player moved", () => {
    const keys = readKeys("t", actions, JSON.stringify({ pause: " " }));
    expect(translate(" ", actions, keys)).toBe("p");
    expect(translate("p", actions, keys)).toBeNull();
    // Keys the player did not touch, and keys no action uses, pass as they are.
    expect(translate("n", actions, keys)).toBe("n");
    expect(translate("ArrowUp", actions, keys)).toBe("ArrowUp");
    expect(translate("N", actions, keys)).toBe("n");
  });
});
