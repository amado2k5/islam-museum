// IndexedDB as the vault's store, and the two things a browser offers beside it: a channel to tell a game's other
// tabs that a save was made, and a request that the browser keep the site's data.
//
// One database for all the games, "im.play", with one object store of whole values by key. Every put is its own
// transaction, so a value is stored whole or not at all. If the database cannot be opened (private browsing in some
// browsers, storage blocked, an upgrade held up by another tab) open() rejects, and a game plays on without saving
// and says so.
import type { Store } from "./vault";

const DB = "im.play";
const KV = "kv";

export function openStore(factory: IDBFactory | undefined = globalThis.indexedDB, timeoutMs = 4000): Promise<Store> {
  return new Promise((resolve, reject) => {
    if (!factory) return reject(new Error("IndexedDB is not available"));
    let settled = false;
    const fail = (why: string) => {
      if (settled) return;
      settled = true;
      reject(new Error(why));
    };
    // A request that never answers (blocked by another tab's upgrade, or a browser that hangs) must not hang a game.
    const timer = setTimeout(() => fail("IndexedDB did not open in time"), timeoutMs);
    let req: IDBOpenDBRequest;
    try {
      req = factory.open(DB, 1);
    } catch (e) {
      clearTimeout(timer);
      return fail(String(e));
    }
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(KV)) req.result.createObjectStore(KV);
    };
    req.onblocked = () => fail("IndexedDB is blocked by another tab");
    req.onerror = () => (clearTimeout(timer), fail(String(req.error ?? "IndexedDB could not be opened")));
    req.onsuccess = () => {
      clearTimeout(timer);
      if (settled) return req.result.close();
      settled = true;
      const db = req.result;
      // Another tab wants to upgrade the database: let it, and let this page's next save fail honestly.
      db.onversionchange = () => db.close();
      const run = <R>(mode: IDBTransactionMode, work: (s: IDBObjectStore) => IDBRequest<R>): Promise<R> =>
        new Promise((res, rej) => {
          let tx: IDBTransaction;
          try {
            tx = db.transaction(KV, mode);
          } catch (e) {
            return rej(e);
          }
          const r = work(tx.objectStore(KV));
          // "Saved" means the transaction is complete, not that the request was accepted.
          tx.oncomplete = () => res(r.result);
          tx.onerror = () => rej(tx.error ?? r.error);
          tx.onabort = () => rej(tx.error ?? new Error("the transaction was aborted"));
        });
      resolve({
        get: (key) => run("readonly", (s) => s.get(key)),
        put: (key, value) => run("readwrite", (s) => s.put(value, key)).then(() => undefined),
        delete: (key) => run("readwrite", (s) => s.delete(key)).then(() => undefined),
        keys: () => run("readonly", (s) => s.getAllKeys()).then((k) => k.map(String)),
      });
    };
  });
}

/** Tells a game's other tabs that a save of a given revision exists, and hears the same from them. */
export function saveChannel(game: string, heard: (revision: number) => void): { tell(revision: number): void; close(): void } {
  if (typeof BroadcastChannel === "undefined") return { tell: () => undefined, close: () => undefined };
  const ch = new BroadcastChannel(`im.play.save.${game}`);
  ch.onmessage = (e) => {
    const r = (e.data as { revision?: unknown } | null)?.revision;
    if (typeof r === "number") heard(r);
  };
  return { tell: (revision) => ch.postMessage({ revision }), close: () => ch.close() };
}

/** Asks the browser to keep this site's data. To be called after a press, once; the answer is reported, never nagged. */
export async function askToPersist(): Promise<"granted" | "denied" | "unsupported"> {
  try {
    const s = navigator.storage;
    if (!s?.persist) return "unsupported";
    if (await s.persisted?.()) return "granted";
    return (await s.persist()) ? "granted" : "denied";
  } catch {
    return "unsupported";
  }
}
