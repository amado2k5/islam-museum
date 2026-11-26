// What is kept on the device: it comes back as it went, a broken file is set aside and not destroyed, a newer file
// is not written over, and a device that refuses storage still plays.
import { describe, expect, it } from "vitest";
import { ACTIONS, DEFAULT_KEYS, DEFAULT_SETTINGS, MIGRATIONS, assignKey, QUARANTINE_KEY, SAVE_KEY, SAVE_VERSION, SLOTS, current, load, mergeSaves, newSave, newSlot, readSave, recordQuest, store, writeSave, type Storage } from "../save/save";

const memory = (init: Record<string, string> = {}): Storage & { data: Record<string, string> } => {
  const data = { ...init };
  return { data, getItem: (k) => (k in data ? data[k]! : null), setItem: (k, v) => void (data[k] = v) };
};
const refusing: Storage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};

describe("Hudhud's save", () => {
  it("starts fresh with three slots, one in use, and asks for nothing about the player", () => {
    const s = newSave();
    expect(s.slots).toHaveLength(SLOTS);
    expect(current(s).settings).toEqual(DEFAULT_SETTINGS);
    expect(JSON.stringify(s)).not.toMatch(/name|email|age|birth|location/i);
  });
  it("comes back as it went", () => {
    let s = newSave();
    s = { ...s, slots: [recordQuest({ ...current(s), keeper: { kind: 0, skin: 3, outfit: 2, hair: 1 } }, "w03q1-ibn-al-haytham", { turns: 4, curiosity: true, ingenuity: false, kindness: true, feather: false }), null, newSlot()] };
    const r = readSave(writeSave(s));
    expect(r.kind).toBe("ok");
    expect(r.save).toEqual(s);
  });
  it("keeps the best of each thing across plays of a quest", () => {
    let slot = recordQuest(newSlot(), "q", { turns: 6, curiosity: true, ingenuity: false, kindness: false, feather: false });
    slot = recordQuest(slot, "q", { turns: 3, curiosity: false, ingenuity: true, kindness: false, feather: true });
    slot = recordQuest(slot, "q", { turns: 9, curiosity: false, ingenuity: false, kindness: false, feather: false });
    expect(slot.quests.q).toEqual({ done: true, bestTurns: 3, curiosity: true, ingenuity: true, kindness: false, feather: true });
  });
  it("mends what is out of range and drops what it does not know", () => {
    const raw = JSON.stringify({ v: 1, slot: 7, slots: [{ settings: { style: "god-mode", quality: "ultra", textScale: 9, textSpeed: -4, volume: { ambience: 3 }, muted: "yes" }, keeper: { skin: 99, outfit: -1 }, quests: { "BAD KEY": { done: true }, ok: { done: true, bestTurns: -2 } }, extra: 1 }] });
    const r = readSave(raw);
    expect(r.kind).toBe("ok");
    const slot = current(r.save);
    expect(r.save.slot).toBe(SLOTS - 1);
    expect(slot.settings).toEqual(DEFAULT_SETTINGS);
    const first = r.save.slots[0]!;
    expect(first.settings).toMatchObject({ style: "explorer", quality: "medium", textScale: 1.6, textSpeed: 0, muted: false });
    expect(first.settings.volume).toEqual({ ambience: 1, voices: 0.8, effects: 0.8 });
    expect(first.keeper).toEqual({ kind: 1, skin: 3, outfit: 0, hair: 0 });
    expect(Object.keys(first.quests)).toEqual(["ok"]);
    expect(first.quests.ok!.bestTurns).toBeNull();
  });
  it.each(["{not json", "[]", '"text"', '{"v":"one","slots":[]}', '{"v":1}'])("sets a file it cannot read aside, untouched, and starts anew: %s", (raw) => {
    const st = memory({ [SAVE_KEY]: raw });
    const r = load(st);
    expect(r.kind).toBe("quarantined");
    expect(st.data[QUARANTINE_KEY]).toBe(raw);
    expect(r.save).toEqual(newSave());
    expect(r.stored).toBe(true);
  });
  it("leaves a newer game's file alone and does not save over it", () => {
    const raw = JSON.stringify({ v: SAVE_VERSION + 1, slot: 0, slots: [{ future: true }] });
    const st = memory({ [SAVE_KEY]: raw });
    const r = load(st);
    expect(r.kind).toBe("newer");
    expect(r.stored).toBe(false);
    expect(store(st, r.save, r.stored)).toBe(false);
    expect(st.data[SAVE_KEY]).toBe(raw);
  });
  it("plays without storage, and with storage that throws", () => {
    for (const st of [null, refusing]) {
      const r = load(st);
      expect(r.kind).toBe("fresh");
      expect(r.stored).toBe(false);
      expect(store(st, r.save, true)).toBe(false);
    }
  });
  it("writes and reads through real storage", () => {
    const st = memory();
    const first = load(st);
    expect(first.kind).toBe("fresh");
    expect(store(st, first.save, first.stored)).toBe(true);
    expect(load(st).kind).toBe("ok");
  });
  it("does not let one tab undo what another has finished", () => {
    const st = memory();
    const older = load(st).save; // a tab opened before anything was done
    const done = { ...older, slots: [recordQuest(current(older), "q", { turns: 3, curiosity: true, ingenuity: true, kindness: false, feather: false }), null, null] };
    expect(store(st, done, true)).toBe(true); // the other tab finishes the quest
    const changed = { ...older, slots: [{ ...current(older), settings: { ...current(older).settings, textScale: 1.4 } }, null, null] };
    expect(store(st, changed, true)).toBe(true); // the older tab changes a setting
    const now = load(st).save;
    expect(current(now).quests.q).toEqual({ done: true, bestTurns: 3, curiosity: true, ingenuity: true, kindness: false, feather: false });
    expect(current(now).settings.textScale).toBe(1.4);
    // Joined, each quest keeps the best of both.
    const a = { ...older, slots: [recordQuest(current(older), "q", { turns: 5, curiosity: false, ingenuity: false, kindness: true, feather: false }), null, null] };
    expect(current(mergeSaves(a, done)).quests.q).toEqual({ done: true, bestTurns: 3, curiosity: true, ingenuity: true, kindness: true, feather: false });
  });
  it("does not let an older tab put an older place back over a newer one", () => {
    const st = memory();
    const base = load(st).save;
    const at = (turns: number) => ({ ...base, slots: [{ ...current(base), resume: { quest: "q", snap: { turns } } }, null, null] });
    expect(store(st, at(1), true, true)).toBe(true); // both tabs know of turn 1
    expect(store(st, at(4), true, true)).toBe(true); // the newer tab plays on
    // The older tab, still holding turn 1, changes a setting: it does not own the quest's place.
    const old = { ...at(1), slots: [{ ...at(1).slots[0]!, settings: { ...current(base).settings, muted: true } }, null, null] };
    expect(store(st, old, true)).toBe(true);
    const now = current(load(st).save);
    expect(now.resume).toEqual({ quest: "q", snap: { turns: 4 } });
    expect(now.settings.muted).toBe(true);
    // A page that has just changed the place does own it, also when it clears it.
    expect(store(st, { ...base, slots: [{ ...current(base), resume: null }, null, null] }, true, true)).toBe(true);
    expect(current(load(st).save).resume).toBeNull();
    // Another slot's place is never touched by a save made from this one.
    const two = { ...base, slot: 1, slots: [current(base), { ...current(base), resume: { quest: "q", snap: { turns: 2 } } }, null] };
    expect(store(st, two, true, true)).toBe(true);
    expect(store(st, { ...at(7), slots: [at(7).slots[0]!, { ...current(base), resume: null }, null] }, true, true)).toBe(true);
    const both = load(st).save;
    expect(both.slots[0]!.resume).toEqual({ quest: "q", snap: { turns: 7 } });
    expect(both.slots[1]!.resume).toEqual({ quest: "q", snap: { turns: 2 } });
  });
  it("gives a key to one action only, and mends keys a broken file gives twice", () => {
    const keys = assignKey(DEFAULT_KEYS, "fly", "KeyA");
    expect(keys.fly).toEqual(["KeyA"]);
    expect(keys.left).toEqual(["ArrowLeft"]);
    const all = ACTIONS.flatMap((a) => keys[a]);
    expect(new Set(all).size).toBe(all.length);
    const file = (k: unknown) => current(readSave(JSON.stringify({ v: 1, slot: 0, slots: [{ settings: { keys: k } }] })).save).settings.keys;
    expect(file(keys)).toEqual(keys);
    expect(file({ ...DEFAULT_KEYS, fly: ["ArrowLeft"] })).toEqual(DEFAULT_KEYS);
    expect(file({ left: ["Escape"], right: [42], fly: "Space" })).toEqual({ ...DEFAULT_KEYS, left: [], right: [] });
    expect(file(undefined)).toEqual(DEFAULT_KEYS);
  });
  it("keeps a quest left in the middle, and drops one it cannot name", () => {
    const slot = (resume: unknown) => current(readSave(JSON.stringify({ v: 1, slot: 0, slots: [{ resume }] })).save).resume;
    expect(slot({ quest: "w03q1-ibn-al-haytham", snap: { turns: 2 } })).toEqual({ quest: "w03q1-ibn-al-haytham", snap: { turns: 2 } });
    for (const bad of [null, "x", { quest: "BAD QUEST", snap: {} }, { quest: "ok", snap: 5 }, { snap: {} }]) expect(slot(bad)).toBeNull();
  });
  it("has a migration from every version before this one", () => {
    for (let v = 1; v < SAVE_VERSION; v++) expect(typeof MIGRATIONS[v], `from version ${v}`).toBe("function");
    // An older file with no migration to carry it is set aside, never guessed at.
    expect(readSave(JSON.stringify({ v: 0, slots: [] })).kind).toBe(SAVE_VERSION > 0 && !MIGRATIONS[0] ? "quarantined" : "ok");
  });
});
