# Grand Tour mission: living progress file

This is a diary. It is evidence of nothing. The board's state is in `VERIFICATION.md`, and every
green there comes from running that statement's oracle, never from this file.

A resumed session reads this file top to bottom, then runs `npx tsx scripts/fable/board.ts`.

## Frozen facts (do not change)

| Fact | Value |
|---|---|
| Mission start | 2026-11-11 (launch morning) |
| Production (what visitors see) | commit `8d1b0ef9d7556cc570e9e452e8cd3257e346ab1f`, build run 42832259141, site v1.10.0, deployed 2026-11-10T18:33:45Z |
| Baseline (main at branch start) | `e1d721298ab4b2494a4c8f04d3defcde1808b939` (merge of PR #6021; one merge past the `e0dc3155` named in the brief) |
| Working branch | `claude/islam-museum-mission-cd2fcb` |
| Graph artifact at baseline | `.cache/graph.json` from `npm run graph` at the baseline: 56,030 nodes (54,135 records, 1,895 stubs), 133,438 edges |

Merged is not live. Nothing on this branch, and nothing on main after `8d1b0ef9`, is in production.

## Rules of this run (from the brief; where they differ from AGENTS.md the brief wins for this run)

- No merging, no deploying. One pull request per phase, stacked (each PR's base is the previous phase's branch).
- Never rebase onto a moving main mid-phase. Integration check happens once, at the end, in a scratch checkout.
- Decisions go to `docs/fable-run/PROPOSALS.md`. Nothing is written to `docs/decisions/`.
- Never touch `/ur/`: no file under `content/ur/` is edited and the Tour builds no `/ur/` page. New UI strings still land in `ar.yaml`, `en.yaml`, `ur.yaml` with identical keys.
- At most 25 entities per commit; a `CANARY.md` entry in every commit; ship gates are the strings `0 errors` (validator) and `0 fail` (cite-check).
- No invented data. Prose is deepened only from sources the record already cites. A relation is added only where the record's own cited sources support it.

## Environment findings that shape the plan

- Disk: about 12 GB free. A full site build is about 19 GB (AGENTS.md), so a full `npm run build` cannot run on this machine. Rendered-page oracles use the Astro dev server or a scoped build, and say so.
- Playwright Chromium is installed locally, so screenshots and a no-JavaScript run are possible.
- Wikidata's query service answered HTTP 429 on first try; the canon's sitelink cache is outside git by design.

## What the baseline already holds (found, not built by this run)

- A canon exists on main (PR #5975): `importance` in `schema/_base.schema.json`, 824 records marked (270 at importance 1), `docs/canon.md`, `scripts/report/canon.py`, `scripts/canon.test.ts`.
- `/[lang]/tour/` is the visitor's saved list ("My tour"); `/[lang]/3d/` is the 3D walk. The Grand Tour is a new route, `/[lang]/grand-tour/`.

## Findings so far (each to be re-proven by an oracle before it is quoted anywhere)

1. Review state at baseline: 35,436 draft, 18,699 published.
2. 26,336 records have no authored outgoing relation; 22,056 have no relation in either direction.
3. 94 of the 270 cornerstones have no authored outgoing relation.
4. 48 cornerstones carry no wing at all (all 13 periods, 12 polities, 9 practices including salah, hajj, zakat, sawm; 11 works including the Qur'an record and Sahih al-Bukhari; 3 groups). No canon record sits in the Today or Made wings.
5. No cornerstone is dated to the 12th Hijri century (1101-1200 AH).
6. `docs/canon.md` lists as "not in the graph yet" several subjects that the same file lists as canon records under another slug (Shah Jahan, Aurangzeb, Selim I, Ibn Jubayr, Piri Reis, Abd al-Rahman III, Ibn al-Athir, Osman I).

## Phase plan

| Phase | Content | PR |
|---|---|---|
| 1 | Baseline, canon oracles, canon coverage repairs (century floor, wings on wingless cornerstones) | pending |
| 2 | Tour manifest, River, rooms, completion room, entry link, coverage oracle | pending |
| 3 | Tour prose in Arabic and English, cite-check | pending |
| 4 | Cornerstone dead ends, three-hop reachability, hop distribution | pending |
| 5 | Cross-record contradiction sweep | pending |
| 6 | Canon-first search test, absence list with verifier | pending |
| 7 | Vision pass, no-JavaScript run, integration re-run, ledger, SHOWCASE, PUBLISH | pending |

## Log

- 08:11 Session start. Read charter, AGENTS.md, change gates, publication standard, site README.
- 08:15 Graph built at baseline (1 min). Site dependencies installed.
- 08:40 Baseline exploration done (findings 1-6). Next: baseline oracle, canon oracle, canon coverage rule.

## Usage

Credit consumption is not observable from inside the session so far; noted at each phase boundary if that changes.
