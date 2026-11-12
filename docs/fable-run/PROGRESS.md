# Grand Tour mission: living progress file

This is a diary. It is evidence of nothing. The board's state is in `VERIFICATION.md`, and every
green there comes from running that statement's oracle, never from this file.

A resumed session reads this file top to bottom, then runs `python3 scripts/fable/board.py --fast`.

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
| 3 | The Tour's narratives in Arabic and English (41 written; 40 stand after verification) | on the remote | #6027 |
| 4 | Dead-end cornerstones opened (29 down to 12 after the verifier removed 17 relations) | on the remote | #6028 |
| 5 | Contradiction sweep: 130 found, 38 fixed, 84 registered, 8 consistent (after its re-check) | on the remote | #6029 |
| 6 | Canon-first search test (production: 2 of 50), absence list corrected (24 of 31 found) | on the remote | #6030 |
| 7 | Verifier fixes, vision pass, no-JavaScript run, integration re-run, ledger, SHOWCASE, PUBLISH | on the remote | #6033 |

`docs/fable-run/phases.json` holds each phase's final commit and branch; `scripts/fable/o11_remote.py` checks them against the host.

## Where things stand right now (for a resumed session)

The mission's work is finished and on the remote as seven stacked pull requests (#6022, #6023, #6027, #6028, #6029, #6030, #6033). Nothing is merged and nothing is deployed; both are the founder's.

- The board's final state is the table in `VERIFICATION.md`, written by `python3 scripts/fable/board.py`. Do not trust this file for it.
- If anything under `data/`, `content/`, `tour/`, `schema/`, `scripts/`, `site/` or `i18n/` changes, the board is stale by its own rule (`o10_ledger.py` fails) and has to be run again in full: about fifteen minutes, most of it two site builds.
- To re-check against a newer main: `git fetch origin main && sh scripts/fable/integrate.sh <an empty folder outside the repository> && python3 scripts/fable/concurrency.py`.
- What is open is listed in `GAP-REGISTER.md` (what was not finished), `PROPOSALS.md` (what the founder is asked to decide), `NOTICED.md` (problems seen outside the task) and `vision/defects.json` (visible defects on older pages).
- The temporary dev-server entry in `.claude/launch.json` was restored, the dev server stopped and the scratch checkout removed.

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

Times are local (EST) and are the commit times in git, not recollections. An earlier version of this log carried times typed from memory that ran up to three hours ahead of the clock; they were replaced on reading `git log`.

- 08:11 Session start (the worktree's creation time). Read the charter, AGENTS.md, the change gates, the publication standard, the site README.
- 08:15 Graph artifact built at the baseline (one minute). Site dependencies installed.
- 08:32 Canon century floor committed (`18fa4222d3`); wings, batch 1 (`1d5a49572f`).
- 08:35 Wings, batch 2 (`bc57cc83af`). Validator: 0 errors.
- 08:52 Oracles o00 and o01 (`42db751657`). Phase 1 complete.
- 08:54 Grand Tour section (`1401a5cc97`): 42 stops, River, rooms, ribbon, completion room, entry link.
- 08:55 First captured oracle runs (`f07d617b73`). PRs #6022 and #6023 opened.
- 09:07 Oracles o03, o04, o05 with before-runs (`91dc7a62d3`). Fourteen subagents launched: seven prose writers, two graph editors, four adjudicators, one absence verifier.
- 09:29 Narratives committed in two batches (`0a1dbd751e`, `6c4420f475`): 41 finished, 1 cannot be (the contemporary era).
- 09:31 Dead-end relations (`7ddde0c7f4`, `0aca4b69f3`) and contradiction fixes (`28b8581286`). PRs #6027 to #6029.
- 09:42 Search test and absence list (`37fb25b9ef`). PR #6030. Production search: 2 of 50.
- 09:45 Five fresh-context verifiers launched (prose A, B, C; relations; fixes).
- 09:51 Fixes verifier acted on (`d6abc792fe`): 5 fixes reverted, 1 marked hidden, detectors taught Hijri-only dates, 8 new findings registered.
- 10:21 Prose verifiers acted on by three fixers (`3905338e7f`, `9d3cab2ca2`): 57 of 71 findings fixed; the Qur'an stop removed (40 stops).
- 10:22 17 relations removed after verification (`cfadf9bcfe`). Tour script moved to a plain shell file and the /ur/ homepage made byte-identical (`37f69b054c`).
- 10:41 Route drawing passes the accessibility scan; the no-JavaScript oracle (`933eedc1c6`). 10:43 first 90 screenshots (`efe522d7d1`). Three fresh-context vision reviewers and one numbers verifier launched.
- 11:12 The Tour's pages revised after the vision review: 121 defects listed, the Tour's own fixed (`0569404e3f`). The numbers verifier found two "before" figures measured mid-run and a count that included a predicate the ledger excludes; all three corrected.
- 11:20 Screenshots re-captured from the revised pages (`d646e46c83`). A second-round reviewer launched to look for every fixed defect again.
- 11:33 to 11:36 The ledger's self-check (`o10_ledger.py`), the integration script, the vision register, the wing probe on the branch's build (`64d54dbe26`, `b1e6863229`, `6c3d35c5f2`). Three earlier pull requests given a dated correction note. PR #6033 opened.
- 11:38 The second-round review came back: 22 of 50 earlier defects gone, 13 still there, 15 changed, 12 new. One fix called done was still visible and the Tour's Arabic arrows pointed backwards. The board run was stopped.
- 11:41 Those fixed (`e2c16d9083`); 11:50 screenshots taken again (`200aac2918`); a third fresh look launched on the six changed rows. Both ship gates run at that commit: validator 0 errors, cite-check 40 pass and 0 fail.
- 11:58 First integration run against main at `8bbf678441` (24 commits past the baseline): the homepages did not build, because the script skipped a preparation step. Script corrected (`ca0886cd1d`); 12:12 second run clean.
- 12:07 Third look back: 2 of 6 gone, 3 better but not gone, 1 stands, 2 new caused by the fix. All registered. Register: 135 defects, 23 fixed and confirmed gone, 112 standing.
- 12:12 to 12:26 Final board at `ca0886cd1d`: 11 of 13 rows green; statements 4 and 6 not green; the ledger's self-check green.

## Usage

Credit consumption is not observable from inside the session. What the harness reported for each subagent is in `delegation.json` and summed in `NUMBERS.md`; the orchestrating session's own use is not in those figures.
