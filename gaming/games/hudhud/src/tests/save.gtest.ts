// What is kept on the device: it comes back as it went, a broken file is set aside and not destroyed, a newer file
// is not written over, and a device that refuses storage still plays.
import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, MIGRATIONS, QUARANTINE_KEY, SAVE_KEY, SAVE_VERSION, SLOTS, current, load, newSave, newSlot, readSave, recordQuest, store, writeSave, type Storage } from "../save/save";

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
    s = { ...s, slots: [recordQuest({ ...current(s), keeper: { skin: 3, outfit: 2, hair: 1 } }, "w03q1-ibn-al-haytham", { turns: 4, curiosity: true, ingenuity: false, kindness: true, feather: false }), null, newSlot()] };
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
    expect(first.keeper).toEqual({ skin: 3, outfit: 0, hair: 0 });
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
  it("has a migration from every version before this one", () => {
    for (let v = 1; v < SAVE_VERSION; v++) expect(typeof MIGRATIONS[v], `from version ${v}`).toBe("function");
    // An older file with no migration to carry it is set aside, never guessed at.
    expect(readSave(JSON.stringify({ v: 0, slots: [] })).kind).toBe(SAVE_VERSION > 0 && !MIGRATIONS[0] ? "quarantined" : "ok");
  });
});
