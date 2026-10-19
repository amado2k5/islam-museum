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

## Downloads

None yet.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

## Batch 1 (18 Oct 2026, draft)

- **Book:** al-Ghazali (Muhammad), Islam wal-Manahij al-Ishtirakiyya (Nahdat Misr, 4th ed., 2005)
- **Pages covered:** pp. 1-5 of the scan
- **Entities created (draft, `status.review: draft`):** work/al-islam-wal-manahij-al-ishtirakiyya; person/muhammad-al-ghazali-modern (new)
- **Sources created:** one `source/` record for this edition, with `reliability_note` stating that the edition is unverified and that citations use scan page numbers (the `[pN]` OCR markers), not printed pages.
- **Skipped:** no concept records; no perspectives block (no sourced Sunni-frame lead has been read yet, so none is written); no death year for the author where the book does not state it; no dates beyond those in the book's own text.
- **Next step:** read the book beyond the pages listed above, add the sources needed for the second citation of any dated fact, and decide whether any concept record is warranted.
