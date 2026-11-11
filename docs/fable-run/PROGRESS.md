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

| Phase | Content | State | PR |
|---|---|---|---|
| 1 | Baseline, canon oracles, century floor, wings on wingless cornerstones | on the remote | #6022 |
| 2 | Tour manifest, River, rooms, completion room, entry link, coverage oracle | on the remote | #6023 |
| 3 | The Tour's 41 narratives in Arabic and English | on the remote | #6027 |
| 4 | Dead-end cornerstones opened (22 of 29) | on the remote | #6028 |
| 5 | Contradiction sweep: 122 found, 44 fixed, 70 registered, 8 consistent | on the remote | #6029 |
| 6 | Canon-first search test (production: 2 of 50), absence list corrected (24 of 31 found) | on the remote | #6030 |
| 7 | Verifier fixes, vision pass, no-JavaScript run, integration re-run, ledger, SHOWCASE, PUBLISH | in progress | pending |

`docs/fable-run/phases.json` holds each phase's final commit and branch; `scripts/fable/o11_remote.py` checks them against the host.

## Where things stand right now (for a resumed session)

- Running in the background when this was written: five fresh-context verifiers (prose batches A, B, C; relations; contradiction fixes), each writing to `docs/fable-run/verifier/`; and `scripts/fable/o08_unchanged.py` (two scoped builds, about ten minutes).
- Next actions, in order:
  1. Read each verifier report in `docs/fable-run/verifier/`. Fix every ERROR in the leads; remove every UNSUPPORTED relation; re-status every WRONG contradiction fix (edit the record back or forward, then `npx tsx scripts/fable/o05_contradictions.ts --merge <file>`). Commit in batches of 25 records or fewer. Record what the verifiers caught in SHOWCASE.md and PUBLISH.md.
  2. `npm run graph && npm run derive && sh scripts/fable/scoped-build.sh && node scripts/fable/capture.mjs --dist .cache/fable-dist docs/fable-run/vision/shots`, commit the screenshots, then brief two fresh-context reviewers to list defects from the committed screenshots into `docs/fable-run/vision/review-*.md`; merge their lists into `docs/fable-run/vision/defects.json` (fields: id, where, screenshots, description, status fixed or registered, note).
  3. A fresh-context agent re-derives the headline numbers from the published commands.
  4. Integration: `git fetch origin main`; list what main changed that touches the oracles; rebase a scratch copy; re-run the affected oracles there.
  5. `python3 scripts/fable/board.py && python3 scripts/fable/numbers.py`, then write VERIFICATION.md (around the generated board), SHOWCASE.md, PUBLISH.md; add phase 7 to `phases.json`; open the last PR.
  6. Restore `.claude/launch.json` (`git checkout -- .claude/launch.json`; the temporary dev-server entry must not be committed) and stop the dev server.

## Decisions taken (each also in PROPOSALS.md where it is the founder's to confirm)

- The canon already existed on main (PR #5975). This run audits it and repairs two coverage holes; it does not re-run the fame-ranked selection (Wikidata's query service was rate-limited to one request a minute on launch day).
- Century floor added to the canon script (P-1). It raises `person/ahmed-iii-uthmani`.
- Wings filled on 48 wingless cornerstones by class rule, plus three additions (P-2).
- "Fourteen centuries" means the Hijri centuries 1 to 14. Before the Hijra is a prelude; the 15th is the present.
- A stop's century comes from the record's own date; a work with none takes its author's death; anything else floats and never counts toward century coverage.
- The Tour's narrative at a stop is the lead section of the record's own prose. Deepening the Tour means deepening those records.
- The Tour is Arabic and English only. No `/ur/` page is built. The homepage entry link is rendered for `ar` and `en` only.
- Published records whose lead is deepened keep `status.review: published` and gain a provenance note, following the precedent on `event/battle-of-badr` (to be raised as a proposal).
- The Tour is not registered in `openapi/v1.json`, `llms.txt` or the Explore menu: those are existing pages and the brief limits the change to one section and one link. To be raised as a proposal.

## Dead ends

- A full site build cannot run on this machine (about 12 GB free, about 19 GB needed).
- `capture.mjs --nojs` against the dev server stalled past five minutes. The no-JavaScript run uses a scoped production build instead.
- First scoped build used symbolic links for the source tree. Astro then emitted pages with no stylesheet at all, and the no-JavaScript check ("the river is a list, not a band") passed for the wrong reason. Rebuilt from a verbatim copy; the build script now fails if the pages carry no stylesheet, and the oracle needs a positive control (with JavaScript on, the same list is a band).
- A shell loop over an unquoted variable (zsh does not word-split) left a commit's file list empty: the relation evidence was committed without the 25 records. Fixed in the next commit; history not rewritten.
- The absence oracle at first failed on generic search words ("belief", "jurisprudence"); the verifier separated real spellings from generic terms and explained every remaining match.

## Log

- 08:11 Session start. Read charter, AGENTS.md, change gates, publication standard, site README.
- 08:15 Graph built at baseline (1 min). Site dependencies installed.
- 08:40 Baseline exploration done. Canon holes found: no 12th-century cornerstone; 48 wingless cornerstones; no canon record in Today or Made.
- 09:30 Canon floor committed (`18fa4222d3`). Wings committed in two batches (`1d5a49572f`, `bc57cc83af`). Validator: 0 errors.
- 10:10 Oracles o00 and o01 committed (`42db751657`). Phase 1 complete locally.
- 10:40 Grand Tour section committed (`1401a5cc97`): 42 stops, River, rooms, ribbon, completion room, entry link. o00, o01, o02 green at that commit.
- 11:10 Oracles o03, o04, o05 written with before-runs. Seven prose writers, two graph editors, four adjudicators and one absence verifier launched (14 subagents).
- 12:30 All 14 back. Prose: 41 finished, 1 cannot be (contemporary era, removed from the Tour). Dead ends: 29 to 7. Contradictions: 44 fixed, 70 registered, 8 consistent. Absences: 24 of 31 found.
- 13:00 Phases 3 to 6 committed, pushed, PRs #6027 to #6030 open. Production search measured: 2 of 50.
- 13:10 Five fresh-context verifiers launched to break the prose, the relations and the fixes.

## Usage

Credit consumption is not observable from inside the session so far; noted at each phase boundary if that changes.
