// Hudhud's progress between localStorage and the vault: nothing lost on the way in, the newer of the two leading,
// "saved" said only when it is, and an older build or a dead store handled without a wrong word.
import { memoryStore, type Store } from "@im/platform/save/vault";
import { describe, expect, it } from "vitest";
import { openDurable, type SaveStatus } from "../save/durable";
import { current, newSave, recordQuest, type SaveFile } from "../save/save";

let clock = 5000;
const hooks = () => {
  const seen: { adopted: [SaveFile, string][]; statuses: SaveStatus[]; told: number[] } = { adopted: [], statuses: [], told: [] };
  return { seen, h: { adopt: (s: SaveFile, why: "vault" | "tab" | "import") => void seen.adopted.push([s, why]), status: (s: SaveStatus) => void seen.statuses.push(s), told: (r: number) => void seen.told.push(r), now: () => ++clock } };
};
const done = (s: SaveFile, quest: string, turns = 3): SaveFile => ({ ...s, slots: [recordQuest(current(s), quest, { turns, curiosity: true, ingenuity: true, kindness: false, feather: false }), s.slots[1]!, s.slots[2]!] });
const withText = (s: SaveFile, scale: number): SaveFile => ({ ...s, slots: [{ ...current(s), settings: { ...current(s).settings, textScale: scale } }, s.slots[1]!, s.slots[2]!] });

describe("Hudhud's durable save", () => {
  it("takes a save that was only in localStorage into the vault on the first run", async () => {
    const store = memoryStore();
    const local = done(newSave(), "w03q1-ibn-al-haytham");
    const { seen, h } = hooks();
    const d = await openDurable(store, local, 100, h);
    expect(d.status().state).toBe("saved");
    expect(seen.adopted).toEqual([]);
    // A second visit with localStorage wiped still has the quest.
    const again = hooks();
    await openDurable(store, newSave(), 0, again.h);
    expect(current(again.seen.adopted[0]![0]).quests["w03q1-ibn-al-haytham"]?.done).toBe(true);
    expect(again.seen.adopted[0]![1]).toBe("vault");
  });
  it("starts quietly when there is nothing anywhere, and writes nothing until there is something", async () => {
    const store = memoryStore();
    const { h } = hooks();
    const d = await openDurable(store, newSave(), 0, h);
    expect(d.status()).toEqual({ state: "saved", at: 0, revision: 0 });
    expect(await store.keys()).toEqual([]);
  });
  it("lets the place written last lead on settings, and keeps finished quests from both", async () => {
    const store = memoryStore();
    const a = hooks();
    const first = await openDurable(store, newSave(), 0, a.h);
    await first.write(withText(done(newSave(), "q1"), 1.4), true); // the vault: q1 done, large text
    const savedAt = (first.status() as { at: number }).at;
    // localStorage is older and has q2: the vault's settings lead, both quests are kept.
    const b = hooks();
    await openDurable(store, done(newSave(), "q2"), savedAt - 1, b.h);
    const got = current(b.seen.adopted[0]![0]);
    expect(Object.keys(got.quests).sort()).toEqual(["q1", "q2"]);
    expect(got.settings.textScale).toBe(1.4);
    // localStorage is newer (a write the vault missed): its settings lead.
    const c = hooks();
    await openDurable(store, withText(newSave(), 1.2), clock + 1000, c.h);
    expect(current(c.seen.adopted[0]![0]).settings.textScale).toBe(1.2);
    expect(Object.keys(current(c.seen.adopted[0]![0]).quests).sort()).toEqual(["q1", "q2"]);
  });
  it("says saving, then saved, and saved only once the write is done", async () => {
    let release: () => void = () => undefined;
    // The store tells the test when it has been asked to write, so that the test releases a write that has really
    // begun. A fixed wait of a few milliseconds was not enough when the machine was busy: the save was still working
    // out its checksum, the release did nothing, and the write waited until the test timed out.
    let asked: () => void = () => undefined;
    const reached = new Promise<void>((r) => (asked = r));
    const inner = memoryStore();
    const slow: Store = { ...inner, put: (k, v) => new Promise<void>((res) => ((release = () => void inner.put(k, v).then(res)), asked())) };
    const { seen, h } = hooks();
    const d = await openDurable(slow, newSave(), 0, h);
    const writing = d.write(done(newSave(), "q1"), true);
    await reached;
    expect(d.status().state).toBe("saving");
    expect(seen.told).toEqual([]);
    release();
    expect((await writing).state).toBe("saved");
    expect(seen.told).toEqual([1]);
    expect(seen.statuses.map((s) => s.state)).toEqual(["saved", "saving", "saved"]);
  });
  it("says a save failed, keeps playing, and saves again when the store answers", async () => {
    const inner = memoryStore();
    let fail: string | null = null;
    const flaky: Store = { ...inner, put: (k, v) => (fail ? Promise.reject(new Error(fail)) : inner.put(k, v)) };
    const { h } = hooks();
    const d = await openDurable(flaky, newSave(), 0, h);
    fail = "QuotaExceededError";
    expect(await d.write(done(newSave(), "q1"), true)).toMatchObject({ state: "failed", reason: "quota" });
    fail = null;
    expect((await d.write(done(newSave(), "q1"), true)).state).toBe("saved");
  });
  it("joins what another tab saved and hands the page the joined save", async () => {
    const store = memoryStore();
    const a = hooks();
    const b = hooks();
    const tabA = await openDurable(store, newSave(), 0, a.h);
    const tabB = await openDurable(store, newSave(), 0, b.h);
    await tabB.write(done(newSave(), "q1"), true);
    // Tab A, told of it, takes it up.
    await tabA.refresh();
    expect(current(a.seen.adopted.at(-1)![0]).quests.q1?.done).toBe(true);
    expect(a.seen.adopted.at(-1)![1]).toBe("tab");
    // A stale tab that writes a setting undoes nothing.
    const c = hooks();
    const tabC = await openDurable(memoryStore(), newSave(), 0, c.h);
    void tabC;
    const stale = hooks();
    const tabD = await openDurable(store, newSave(), 0, stale.h);
    await tabB.write(done(done(newSave(), "q1"), "q2"), true);
    await tabD.write(withText(newSave(), 1.5), false);
    const end = hooks();
    await openDurable(store, newSave(), 0, end.h);
    const got = current(end.seen.adopted[0]![0]);
    expect(Object.keys(got.quests).sort()).toEqual(["q1", "q2"]);
    expect(got.settings.textScale).toBe(1.5);
  });
  it("leaves a newer version's save alone and says so", async () => {
    const store = memoryStore();
    await store.put("hudhud/a", { format: "im.play.save", game: "hudhud", schema: 99, revision: 4, savedAt: 1, checksum: "x", data: {} });
    // Sealed properly, as a newer build would have.
    const { Vault } = await import("@im/platform/save/vault");
    const future = memoryStore();
    await new Vault<unknown>(future, { game: "hudhud", schema: 99, migrate: () => null, accept: (d) => d, merge: (m) => m, now: () => ++clock }).save({ future: true });
    const before = JSON.stringify([...future.data]);
    const { h } = hooks();
    const d = await openDurable(future, done(newSave(), "q1"), 10, h);
    expect(d.status()).toEqual({ state: "newer" });
    expect((await d.write(done(newSave(), "q1"), true)).state).toBe("newer");
    expect(JSON.stringify([...future.data])).toBe(before);
  });
  it("plays on with no store at all, and with one that cannot be used", async () => {
    const { h } = hooks();
    expect((await openDurable(null, newSave(), 0, h)).status()).toEqual({ state: "unavailable" });
    const dead: Store = { get: () => Promise.reject(new Error("no")), put: () => Promise.reject(new Error("no")), delete: () => Promise.reject(new Error("no")), keys: () => Promise.reject(new Error("no")) };
    const d = await openDurable(dead, newSave(), 0, hooks().h);
    expect(d.status()).toEqual({ state: "unavailable" });
    expect((await d.write(newSave(), true)).state).toBe("unavailable");
    expect(await d.exportFile()).toBeNull();
  });
  it("exports to a file and takes it back in a fresh browser", async () => {
    const { h } = hooks();
    const d = await openDurable(memoryStore(), done(newSave(), "q1"), 10, h);
    const file = (await d.exportFile())!;
    expect(file).toContain('"im.play.save"');
    const fresh = hooks();
    const there = await openDurable(memoryStore(), newSave(), 0, fresh.h);
    expect(await there.importFile(file)).toEqual({ ok: true });
    expect(fresh.seen.adopted.at(-1)![1]).toBe("import");
    expect(current(fresh.seen.adopted.at(-1)![0]).quests.q1?.done).toBe(true);
    expect(await there.importFile("not a save")).toEqual({ ok: false, reason: "not-a-save" });
  });
  it("lets localStorage lead when the page closed before the vault's last write was done", async () => {
    const inner = memoryStore();
    let hold = false;
    const never: Promise<void> = new Promise(() => undefined);
    const store: Store = { ...inner, put: (k, v) => (hold ? never : inner.put(k, v)) };
    const { h } = hooks();
    const d = await openDurable(store, newSave(), 0, h);
    await d.write(done(newSave(), "q1", 5), true); // reaches the vault
    const localAt = ++clock; // the page then writes its last step to localStorage at once...
    hold = true;
    void d.write(done(newSave(), "q1", 3), true); // ...and the vault's write of it never completes: the tab is closed
    await new Promise((r) => setTimeout(r, 5));
    const again = hooks();
    await openDurable(inner, done(done(newSave(), "q1", 3), "q2"), localAt, again.h);
    const got = current(again.seen.adopted[0]![0]);
    expect(Object.keys(got.quests).sort()).toEqual(["q1", "q2"]);
    expect(got.quests.q1!.bestTurns).toBe(3);
  });
});
