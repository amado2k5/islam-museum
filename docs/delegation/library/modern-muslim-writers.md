# Lane `lib-exp-modern-muslim-writers`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-modern-muslim-writers`; `data/_stubs.d/lib-exp-modern-muslim-writers.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | not started |
| 2. Downloaded (filename, source URL, size recorded below) | not started |
| 3. OCR (local, drive only) | not started |
| 4. Distilled into draft entities | not started |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started |

## Duplicates found and skipped

None recorded yet. Pre-check counts (18 Oct 2026, `grep -ril` over `data/`) are in the lane document.

## Batch 1 (draft, branch `lib-exp/batch-1-abduh-fiqh-algebra`, 18 Oct 2026)

- **Book:** Muhammad Abduh, *Risalat al-Tawhid*, ed. Muhammad Imara (Dar al-Shuruq, Cairo; imprint 1994 on scan p.4). Local OCR on the harvest drive, not in git. 197 scan pages.
- **Pages covered (scan markers):** pp.1, 4, 5 (title and imprint), pp.7–11 (editor's introduction). Nothing from the body of the treatise yet.
- **Entities created (all `status.review: draft`):**
  - `work/risalat-al-tawhid` (book; author `person/muhammad-abduh`, existing record; `about concept/tawhid`)
  - `source/abduh-risalat-tawhid-imara-1994` (primary; edition not verified)
  - `content/ar/work/risalat-al-tawhid.md`
- **Labelled:** Abduh's emphasis on reason against imitation (taqlid), scan p.11, is marked as his own view and not as the Sunni consensus.
- **Skipped and why:**
  - Abduh's birth and death years (1849, 1905, as the editor gives them on scan p.7): one source only, so no date is written on any record; flagged in the source note.
  - Positions in the body of the treatise: next batch.
  - `person/muhammad-abduh` and `person/jamal-al-din-al-afghani` already exist and are linked, not recreated. `concept/tawhid` exists and is linked, not recreated.
- **Next step:** read the body of the treatise (the chapters after scan p.11), state Abduh's positions with labels where they differ from the Sunni mainstream, and confirm the edition against a second print before any record leaves draft.

## Downloads

None yet.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
