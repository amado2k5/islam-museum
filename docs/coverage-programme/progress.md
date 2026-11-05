# Coverage expansion programme: progress

Programme home: [`README.md`](README.md). One dated entry per merged batch. Flags are one line each. Phase queues and their states (`[ ]` / `[x]` / `[~]`) are kept in each phase's own progress section, added when that phase starts.

## Log

- **31 October 2026 — Phase 0 (planning).** Audit and measurement, programme home written (master README, fourteen phase files, this file). Corrections to the gap map are in README section 2.10. Not yet merged; no content built.
  - FLAG: Nadwi volume count is 43, not 57 (README 2.3).
  - FLAG: PR #1599 (EI2) is recorded MERGED on 25 Oct 2026 in GitHub, not closed; read on `main` before Phase 5 (README 2.9).
  - FLAG: EI2 lane already exists and runs at scope B; Phase 5 is a re-scope (README 2.9).
  - FLAG: canon decisions are founder-only; Phase 1 is founder-bound (README 2.2).
  - FLAG: `{cite:}` is valid source markup; the render-QA sweep runs on built HTML only (README 2.7).
  - FLAG: the Wikidata flag count (about 4,199) is not measured; 5,604 files mention Wikidata (README 2.8).
  - FLAG: rijal and Nadwi text is not readable from this environment; Phases 2–3 open with a founder-run pilot (README section 5).

- **31 October 2026 — Phase 1 opened (founder go).** Queue `phase-02-queue.md`: 286 undecided canon books in 12 batches of 25, ordered by harvest folder. Batch 01 is with the founder. Decisions are recorded only by the founder.

- **5 November 2026 — Amendment folded in; Phase 1 opened (founder go).** The 1 November 2026 founder amendment is now part of the plan: the AI-resource moves are Phase 1, and the fourteen phases of 31 October 2026 are renumbered 2–15 (files renamed to match). Gap 13 was re-measured on current main (49,418 data files; README section 2.11): the audit's Muhammad-neighbourhood numbers are unchanged (6 relations on his record; 61 inbound edges from 60 records; no successor edge; no Ali edge), companion-role records are 474 (was 448) with zero `member_of` edges to `group/sahaba`, and per-entity JSON-LD already exists — Phase 1's Move 5 is reduced to its relational extension. Phase 1 queue opened (`phase-01-queue.md`, 474 records + the group). Canon (now Phase 2) batch 01 remains with the founder.
  - FLAG: Content-Signal flip and the Sahaba lane stay founder-gated (README section 7, decisions 10–11); neither is executed under this go.

- **5 November 2026 — Phase 1, Move 1, batch 01.** `group/sahaba` published (definition per al-Isaba, already cited; provenance extended to record the membership roll), and `member_of → group/sahaba` edges added to the first 24 published companion-role records (queue `phase-01-queue.md`, batch 01: al-Abbas ibn Abd al-Muttalib through Abu Khaythama). Each edge cites the source(s) its own record rests on — al-Isti'ab, Fada'il al-Sahaba or Ibn Sa'd where the record has them, else its sira source. 25 entities in the batch. Remaining in Move 1: 182 published + 268 draft companion records, then the Muhajirun/Ansar extension.
