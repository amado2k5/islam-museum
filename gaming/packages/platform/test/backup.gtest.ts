// A game's localStorage backed up to the vault: copied when it changes, and put back only where it has gone missing.
import { describe, expect, it } from "vitest";
import { collect, openBackup, restoreMissing, type StorageLike } from "../src/save/backup";
import { memoryStore } from "../src/save/vault";

const storageOf = (init: Record<string, string> = {}): StorageLike & { data: Map<string, string> } => {
  const data = new Map(Object.entries(init));
  return { data, get length() { return data.size; }, key: (i) => [...data.keys()][i] ?? null, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
};
let clock = 100;
const now = () => ++clock;

describe("a game's backup in the vault", () => {
  it("copies only the game's own keys", () => {
    const s = storageOf({ "im.atlas.save.v1": "A", "im.atlas.save.v1.unreadable": "B", "im.granada.save.v1": "G", "im.play.audio.v1": "P", other: "x" });
    expect(collect(s, "im.atlas.")).toEqual({ "im.atlas.save.v1": "A", "im.atlas.save.v1.unreadable": "B" });
  });
  it("puts back what is missing and never replaces what is there", () => {
    const s = storageOf({ "im.atlas.save.v1": "newer" });
    expect(restoreMissing(s, { "im.atlas.save.v1": "older", "im.atlas.prefs": "p", "im.granada.save.v1": "not this game" }, "im.atlas.")).toEqual(["im.atlas.prefs"]);
    expect(s.getItem("im.atlas.save.v1")).toBe("newer");
    expect(s.getItem("im.granada.save.v1")).toBeNull();
  });
  it("brings a game's progress back after its storage was cleared", async () => {
    const store = memoryStore();
    const s = storageOf({ "im.golden-age.save.v1": "season 12", "im.golden-age.prefs.v1": "low" });
    const b = await openBackup(store, s, "golden-age", now);
    expect(b.restored).toEqual([]);
    expect(await b.save()).toMatchObject({ ok: true, revision: 1 });
    expect(await b.save()).toBeNull(); // nothing changed: nothing written
    s.setItem("im.golden-age.save.v1", "season 13");
    expect(await b.save()).toMatchObject({ ok: true, revision: 2 });
    const cleared = storageOf();
    const again = await openBackup(store, cleared, "golden-age", now);
    expect(again.restored).toEqual(["im.golden-age.prefs.v1", "im.golden-age.save.v1"]);
    expect(cleared.getItem("im.golden-age.save.v1")).toBe("season 13");
  });
  it("does not write an empty copy over a good one when a game is opened with nothing stored", async () => {
    const store = memoryStore();
    const b = await openBackup(store, storageOf({ "im.atlas.save.v1": "day 3" }), "atlas", now);
    await b.save();
    // A storage that refuses to take anything back stays empty; the backup is not overwritten with emptiness.
    const stubborn: StorageLike = { length: 0, key: () => null, getItem: () => null, setItem: () => { throw new Error("full"); } };
    const c = await openBackup(store, stubborn, "atlas", now);
    expect(c.restored).toEqual([]);
    expect(await c.save()).toBeNull();
    const check = storageOf();
    await openBackup(store, check, "atlas", now);
    expect(check.getItem("im.atlas.save.v1")).toBe("day 3");
  });
  it("keeps a key only another tab has stored, and lets this page's own keys lead", async () => {
    const store = memoryStore();
    const a = await openBackup(store, storageOf({ "im.granada.save.v1": "day 20" }), "granada", now);
    const tabB = storageOf({ "im.granada.save.v1": "day 20" });
    const b = await openBackup(store, tabB, "granada", now);
    await a.save();
    tabB.setItem("im.granada.yearstart.v1", "year 2");
    await b.save();
    const fresh = storageOf();
    await openBackup(store, fresh, "granada", now);
    expect(Object.fromEntries(fresh.data)).toEqual({ "im.granada.save.v1": "day 20", "im.granada.yearstart.v1": "year 2" });
  });
  it("does nothing, quietly, with no store or no storage", async () => {
    expect((await openBackup(null, storageOf(), "atlas", now)).restored).toEqual([]);
    const b = await openBackup(memoryStore(), null, "atlas", now);
    expect(await b.save()).toBeNull();
    expect(await b.exportFile()).toBeNull();
  });
  it("gives the backup as a file", async () => {
    const b = await openBackup(memoryStore(), storageOf({ "im.atlas.save.v1": "day 3" }), "atlas", now);
    await b.save();
    expect(await b.exportFile()).toContain('"im.atlas.save.v1"');
  });
});
