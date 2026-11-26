// The save vault as rules: what survives a second tab, a damaged copy, a failed write, a newer build and a file.
import { describe, expect, it } from "vitest";
import { Vault, canonical, memoryStore, type Snapshot, type Store, type VaultOptions } from "../src/save/vault";

interface Game {
  pages: string[];
  volume: number;
}
let clock = 1000;
const opts = (over: Partial<VaultOptions<Game>> = {}): VaultOptions<Game> => ({
  game: "test",
  schema: 2,
  // Schema 1 called the list "done".
  migrate: (from, data) => (from === 1 && typeof data === "object" && data !== null && Array.isArray((data as { done?: unknown }).done) ? { pages: (data as { done: string[] }).done, volume: 1 } : null),
  accept: (d) => (typeof d === "object" && d !== null && Array.isArray((d as Game).pages) && typeof (d as Game).volume === "number" ? (d as Game) : null),
  // Pages found anywhere are kept; this page's settings win.
  merge: (mine, stored) => ({ pages: [...new Set([...stored.pages, ...mine.pages])].sort(), volume: mine.volume }),
  now: () => ++clock,
  ...over,
});
const snaps = async (s: Store) => Promise.all(["test/a", "test/b"].map((k) => s.get(k) as Promise<Snapshot<Game> | undefined>));

describe("the save vault", () => {
  it("starts fresh, then gives back what was saved", async () => {
    const store = memoryStore();
    const v = new Vault(store, opts());
    expect(await v.load()).toEqual({ kind: "fresh" });
    const saved = await v.save({ pages: ["light"], volume: 0.5 });
    expect(saved).toMatchObject({ ok: true, revision: 1, merged: false });
    const back = await new Vault(store, opts()).load();
    expect(back).toMatchObject({ kind: "ok", revision: 1, data: { pages: ["light"], volume: 0.5 } });
  });
  it("keeps the save before the last one: two snapshots, the older written over each time", async () => {
    const store = memoryStore();
    const v = new Vault(store, opts());
    for (let i = 1; i <= 5; i++) await v.save({ pages: Array.from({ length: i }, (_, k) => `p${k}`), volume: 1 });
    const [a, b] = await snaps(store);
    expect([a!.revision, b!.revision].sort()).toEqual([4, 5]);
    expect((await new Vault(store, opts()).load()) as { revision: number }).toMatchObject({ revision: 5 });
  });
  it("sets a damaged newest snapshot aside, untouched, and goes back to the one before", async () => {
    const store = memoryStore();
    const v = new Vault(store, opts());
    await v.save({ pages: ["one"], volume: 1 });
    await v.save({ pages: ["one", "two"], volume: 1 });
    const [a, b] = await snaps(store);
    const newest = a!.revision > b!.revision ? "test/a" : "test/b";
    const broken = { ...(await store.get(newest) as Snapshot<Game>), data: { pages: ["one", "two", "CHEATED"], volume: 1 } };
    await store.put(newest, broken);
    const back = await new Vault(store, opts()).load();
    expect(back).toMatchObject({ kind: "recovered", revision: 1, setAside: 1, data: { pages: ["one"] } });
    const kept = (await store.keys()).filter((k) => k.startsWith("test/quarantine-"));
    expect(kept).toHaveLength(1);
    expect(await store.get(kept[0]!)).toEqual(broken);
    // With both damaged, play starts fresh and both are still kept.
    const other = newest === "test/a" ? "test/b" : "test/a";
    await store.put(other, "rubbish");
    expect(await new Vault(store, opts()).load()).toEqual({ kind: "fresh" });
    expect((await store.keys()).filter((k) => k.startsWith("test/quarantine-"))).toHaveLength(2);
  });
  it("leaves the last good save in place when a write fails, and says the save failed", async () => {
    const store = memoryStore();
    const v = new Vault(store, opts());
    await v.save({ pages: ["one"], volume: 1 });
    let fail: string | null = "the disk is gone";
    const flaky: Store = { ...store, put: async (k, val) => (fail ? Promise.reject(new Error(fail)) : store.put(k, val)) };
    const v2 = new Vault(flaky, opts());
    await v2.load();
    expect(await v2.save({ pages: ["one", "two"], volume: 1 })).toMatchObject({ ok: false, reason: "unavailable" });
    fail = "QuotaExceededError: the quota has been exceeded";
    expect(await v2.save({ pages: ["one", "two"], volume: 1 })).toMatchObject({ ok: false, reason: "quota" });
    expect(await new Vault(store, opts()).load()).toMatchObject({ kind: "ok", revision: 1, data: { pages: ["one"] } });
    fail = null;
    expect(await v2.save({ pages: ["one", "two"], volume: 1 })).toMatchObject({ ok: true, revision: 2 });
  });
  it("joins in what another tab saved, so that a stale tab undoes nothing", async () => {
    const store = memoryStore();
    const first = new Vault(store, opts());
    const second = new Vault(store, opts());
    await first.load();
    await second.load();
    await second.save({ pages: ["light", "clock"], volume: 1 }); // the other tab finishes two quests
    const saved = await first.save({ pages: [], volume: 0.2 }); // the stale tab only changes a setting
    expect(saved).toMatchObject({ ok: true, revision: 2, merged: true });
    expect(await new Vault(store, opts()).load()).toMatchObject({ data: { pages: ["clock", "light"], volume: 0.2 } });
    // A page that has seen the newest save writes its own without a merge.
    expect(await first.save({ pages: ["clock", "light", "map"], volume: 0.2 })).toMatchObject({ ok: true, revision: 3, merged: false });
    // Three tabs, each a step behind.
    const third = new Vault(store, opts());
    await third.load();
    await second.save({ pages: ["light", "clock", "stars"], volume: 1 });
    await first.save({ pages: ["clock", "light", "map", "sea"], volume: 0.2 });
    await third.save({ pages: ["clock", "light", "map"], volume: 0.9 });
    expect(((await new Vault(store, opts()).load()) as { data: Game }).data).toEqual({ pages: ["clock", "light", "map", "sea", "stars"], volume: 0.9 });
  });
  it("migrates a save from every older schema, and sets aside one it cannot read", async () => {
    const store = memoryStore();
    const old = new Vault<{ done: string[] }>(store, { game: "test", schema: 1, migrate: () => null, accept: (d) => d as { done: string[] }, merge: (m) => m, now: () => ++clock });
    await old.save({ done: ["light"] });
    const back = await new Vault(store, opts()).load();
    expect(back).toMatchObject({ kind: "ok", data: { pages: ["light"], volume: 1 } });
    const odd = memoryStore();
    await new Vault<unknown>(odd, { game: "test", schema: 1, migrate: () => null, accept: (d) => d, merge: (m) => m, now: () => ++clock }).save({ nothing: true });
    expect(await new Vault(odd, opts()).load()).toEqual({ kind: "fresh" });
    expect((await odd.keys()).filter((k) => k.includes("quarantine"))).toHaveLength(1);
  });
  it("never writes over a save from a newer build", async () => {
    const store = memoryStore();
    await new Vault<Game>(store, opts({ schema: 3 })).save({ pages: ["future"], volume: 1 });
    const before = canonical(Object.fromEntries(store.data));
    const v = new Vault(store, opts());
    expect(await v.load()).toEqual({ kind: "newer", schema: 3 });
    expect(await v.save({ pages: [], volume: 1 })).toMatchObject({ ok: false, reason: "newer" });
    // Also a page that never called load.
    expect(await new Vault(store, opts()).save({ pages: [], volume: 1 })).toMatchObject({ ok: false, reason: "newer" });
    expect(canonical(Object.fromEntries(store.data))).toBe(before);
  });
  it("plays on when the store cannot be used at all", async () => {
    const dead: Store = { get: () => Promise.reject(new Error("blocked")), put: () => Promise.reject(new Error("blocked")), delete: () => Promise.reject(new Error("blocked")), keys: () => Promise.reject(new Error("blocked")) };
    const v = new Vault(dead, opts());
    expect(await v.load()).toMatchObject({ kind: "unavailable" });
    expect(await v.save({ pages: [], volume: 1 })).toMatchObject({ ok: false, reason: "unavailable" });
  });
  it("exports a save to a file and takes it back in a fresh place, keeping what it replaces", async () => {
    const store = memoryStore();
    const v = new Vault(store, opts());
    expect(await v.exportFile()).toBeNull();
    await v.save({ pages: ["light", "clock"], volume: 0.7 });
    const file = (await v.exportFile())!;
    expect(file).not.toMatch(/name|email|address/i);
    const fresh = memoryStore();
    const there = new Vault(fresh, opts());
    expect(await there.importFile(file)).toMatchObject({ ok: true, data: { pages: ["light", "clock"], volume: 0.7 }, revision: 1 });
    expect(await new Vault(fresh, opts()).load()).toMatchObject({ kind: "ok", data: { pages: ["light", "clock"], volume: 0.7 } });
    // Over an existing save: the old one is kept as a backup, and the import is not merged with it.
    await there.save({ pages: ["light", "clock", "map"], volume: 0.7 });
    expect(await there.importFile(file)).toMatchObject({ ok: true });
    expect(((await new Vault(fresh, opts()).load()) as { data: Game }).data.pages).toEqual(["light", "clock"]);
    const backups = (await fresh.keys()).filter((k) => k.startsWith("test/backup-"));
    expect(backups).toHaveLength(1);
    expect((await fresh.get(backups[0]!) as Snapshot<Game>).data.pages).toEqual(["light", "clock", "map"]);
  });
  it("refuses a file that is not a save, is another game's, was altered, or is from a newer build", async () => {
    const v = new Vault(memoryStore(), opts());
    const src = new Vault(memoryStore(), opts());
    await src.save({ pages: ["light"], volume: 1 });
    const file = (await src.exportFile())!;
    expect(await v.importFile("hello")).toEqual({ ok: false, reason: "not-a-save" });
    expect(await v.importFile("{}")).toEqual({ ok: false, reason: "not-a-save" });
    expect(await v.importFile(file.replace('"test"', '"other"'))).toEqual({ ok: false, reason: "another-game" });
    expect(await v.importFile(file.replace('"light"', '"every page"'))).toEqual({ ok: false, reason: "damaged" });
    const future = new Vault<Game>(memoryStore(), opts({ schema: 9 }));
    await future.save({ pages: [], volume: 1 });
    expect(await v.importFile((await future.exportFile())!)).toEqual({ ok: false, reason: "newer" });
    expect(await v.load()).toEqual({ kind: "fresh" });
  });
  it("holds through a thousand saves and loads", async () => {
    const store = memoryStore();
    let v = new Vault(store, opts());
    for (let i = 1; i <= 1000; i++) {
      const saved = await v.save({ pages: [`p${i}`], volume: (i % 10) / 10 });
      expect(saved.ok).toBe(true);
      if (i % 50 === 0) {
        v = new Vault(store, opts());
        expect(await v.load()).toMatchObject({ kind: "ok", revision: i, data: { pages: [`p${i}`] } });
      }
    }
    expect((await store.keys()).sort()).toEqual(["test/a", "test/b"]);
  });
  it("seals the same value the same way whatever the order of its keys", () => {
    expect(canonical({ b: 1, a: [2, { d: 3, c: undefined }] })).toBe(canonical({ a: [2, { d: 3 }], b: 1 }));
  });
});
