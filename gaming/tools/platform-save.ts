// The save vault on a real browser's IndexedDB: saved, the page loaded again, read back; two tabs, the stale one
// undoing nothing and each hearing of the other's save; a damaged copy set aside; and no network request made by
// saving. In real Chrome, against the workspace's own files.
// Usage: npx tsx --tsconfig tsconfig.json tools/platform-save.ts [out dir]
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright-core";
import { serveWorkspace } from "./serve";

const outDir = process.argv[2] ? resolve(process.argv[2]) : null;
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--window-size=900,700"] });
const ctx = await browser.newContext();
const results: { check: string; pass: boolean; detail: unknown }[] = [];
const errors: string[] = [];
const SETUP = `
  const { Vault } = await import('/packages/platform/src/save/vault.ts');
  const { openStore, saveChannel, askToPersist } = await import('/packages/platform/src/save/idb.ts');
  const store = await openStore();
  const heard = [];
  const channel = saveChannel('lab', (r) => heard.push(r));
  const vault = new Vault(store, { game: 'lab', schema: 1, migrate: () => null, accept: (d) => (d && Array.isArray(d.pages) ? d : null), merge: (m, s) => ({ pages: [...new Set([...s.pages, ...m.pages])].sort(), volume: m.volume }), now: () => Date.now() });
  window.lab = { vault, store, heard, channel, askToPersist };
`;
const open = async (): Promise<{ page: Page; requests: string[] }> => {
  const page = await ctx.newPage();
  const requests: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // A page of the workspace's own origin with no script of its own (a string table, shown as text): IndexedDB needs
  // an origin, and nothing on this page asks for anything by itself.
  await page.goto(`${served.base}/packages/platform/i18n/en.json`, { waitUntil: "load" });
  await page.evaluate(`(async () => { ${SETUP} })()`);
  page.on("request", (r) => requests.push(r.url()));
  return { page, requests };
};
const lab = <T>(page: Page, body: string) => page.evaluate(`(async () => { const { vault, store, heard, channel, askToPersist } = window.lab; ${body} })()`) as Promise<T>;

let a = await open();
const first = await lab<{ kind: string }>(a.page, "return await vault.load();");
const saved = await lab<{ ok: boolean; revision: number }>(a.page, "const s = await vault.save({ pages: ['light'], volume: 0.5 }); channel.tell(s.revision); return s;");
await a.page.close();
a = await open();
const back = await lab<{ kind: string; data: { pages: string[] }; revision: number }>(a.page, "return await vault.load();");
results.push({ check: "a save is still there after the page is closed and opened again", pass: first.kind === "fresh" && saved.ok && back.kind === "ok" && back.revision === 1 && back.data.pages.join() === "light", detail: { first, saved, back } });

const b = await open();
await lab(b.page, "await vault.load();");
const fromB = await lab<{ ok: boolean; revision: number }>(b.page, "const s = await vault.save({ pages: ['light', 'clock'], volume: 1 }); channel.tell(s.revision); return s;");
await a.page.waitForTimeout(200);
const heardByA = await lab<number[]>(a.page, "return heard;");
const stale = await lab<{ ok: boolean; merged: boolean; revision: number }>(a.page, "return await vault.save({ pages: ['light'], volume: 0.2 });");
const afterBoth = await lab<{ data: { pages: string[]; volume: number } }>(b.page, "return await vault.load();");
results.push({ check: "two tabs: the stale one undoes nothing, and hears of the other's save", pass: fromB.ok && heardByA.includes(2) && stale.ok && stale.merged && afterBoth.data.pages.join() === "clock,light" && afterBoth.data.volume === 0.2, detail: { fromB, heardByA, stale, afterBoth } });

const damaged = await lab<{ kind: string; setAside?: number; revision?: number; keys: string[] }>(b.page, "const keys = await store.keys(); const snaps = await Promise.all(['lab/a','lab/b'].map((k) => store.get(k))); const newest = snaps[0].revision > snaps[1].revision ? 'lab/a' : 'lab/b'; await store.put(newest, { ...(await store.get(newest)), data: { pages: ['forged'], volume: 1 } }); const r = await vault.load(); return { kind: r.kind, setAside: r.setAside, revision: r.revision, keys: await store.keys() };");
results.push({ check: "a damaged copy is set aside and the one before it is used", pass: damaged.kind === "recovered" && damaged.setAside === 1 && damaged.keys.some((k) => k.startsWith("lab/quarantine-")), detail: damaged });

const file = await lab<string>(b.page, "return await vault.exportFile();");
const persist = await lab<string>(b.page, "return await askToPersist();");
results.push({ check: "saving, loading and exporting ask nothing of the network", pass: a.requests.length === 0 && b.requests.length === 0 && typeof file === "string" && file.includes('"im.play.save"'), detail: { requestsA: a.requests, requestsB: b.requests, exportBytes: file?.length ?? 0, persistAnswer: persist } });

await lab(b.page, "for (const k of await store.keys()) if (k.startsWith('lab/')) await store.delete(k);");
await browser.close();
await served.close();
const report = { ran: new Date().toISOString(), browser: "chrome", results, errors };
if (outDir) (mkdirSync(outDir, { recursive: true }), writeFileSync(resolve(outDir, "platform-save.json"), `${JSON.stringify(report, null, 1)}\n`));
console.log(JSON.stringify(report, null, 1));
if (errors.length || results.some((r) => !r.pass)) process.exit(1);
