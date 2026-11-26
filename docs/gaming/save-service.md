# The games' save vault: progress kept on the device, with no account

_26 November 2026. Asked for by the founder's directive of that day ([`hudhud/owner-directive-2026-11-26-production-completion.md`](hudhud/owner-directive-2026-11-26-production-completion.md), section 8) for every game. Code: `gaming/packages/platform/src/save/`. **This is the core, built and tested. No game uses it yet:** Hudhud still keeps its save in `localStorage`, as do the other three games._

## What is built

| Part | File | What it does |
|---|---|---|
| The vault's rules | `save/vault.ts` | Two snapshots a game (A and B), a save always written over the older, so the one before is still there. Each has a revision that only rises, the schema version, the time and a SHA-256 of all of it. A snapshot that fails its checksum is set aside under a quarantine key, never deleted, and the other is used. A newer build's save is left alone and nothing is written. What another tab saved since this page last looked is merged in by the game's own rule before this page writes. Export to a file and import from one, the replaced snapshot kept as a backup |
| IndexedDB as its store | `save/idb.ts` | One database for all games; every put its own transaction, and "saved" means the transaction completed. A database that cannot be opened, is blocked or does not answer in four seconds rejects, so a game plays on and says it is not saving |
| The channel between tabs | `save/idb.ts` | A `BroadcastChannel` per game: a tab tells the others the revision it saved |
| The request to keep data | `save/idb.ts` | `navigator.storage.persist()`, asked once after a press; the answer is reported |

The rules use no clock and make no network request; the time is passed in.

## What was run

- `gaming/packages/platform/test/vault.gtest.ts`, twelve tests in Node over a store in memory: fresh start and round trip; the save before the last is kept; a damaged newest copy set aside untouched and the one before used; both damaged; a write that fails (and one that fails for quota) leaves the last good save and says so; a stale tab, and three tabs each a step behind, undo nothing; migration from an older schema; a save that cannot be read set aside; a newer build's save never written over; a store that cannot be used at all; export and import into a fresh place and over an existing save; a file that is not a save, is another game's, was altered, or is from a newer build is refused; a thousand saves and loads.
- `gaming/tools/platform-save.ts`, in real Chrome on real IndexedDB: a save is there after the page is closed and opened again; with two tabs the stale one undoes nothing and hears of the other's save; a damaged copy is set aside; saving, loading and exporting make no network request. On this run the browser answered "denied" to the request to keep data, which is what an automated Chrome profile does and says nothing of a visitor's browser.

## Not done (each is asked for by the directive)

- **Any game using it.** Next: Hudhud (IndexedDB the authority, `localStorage` kept as a small fallback, a save taken over from `localStorage` on first run so nothing is lost), then Granada, The Golden Age and Atlas, each with a test that its existing save comes across.
- Autosave at every checkpoint the directive lists; a final save on `visibilitychange` and `pagehide`; a manual Save.
- The saving indicator, the last-saved time, and the failure banner; the player's wording in seven languages.
- Export and Import in a game's settings, with the confirmation before a slot is replaced.
- The tests that need a real browser being killed in the middle of a write, a real quota, private browsing, a database upgrade held up by another tab, and a four-hour soak. The rules for each are tested with a store that fails on purpose; the real conditions have not been produced.
