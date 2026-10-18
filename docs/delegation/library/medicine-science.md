# Lane `lib-exp-medicine-science`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-medicine-science`; `data/_stubs.d/lib-exp-medicine-science.yaml`

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

## First book: al-Qanun fi al-Tibb (Ibn Sina)

- **Source file (local, not in git):** `/Users/ahmedabdelaal/Downloads/القانون في الطب_63329_Foulabook.com_.pdf`, copied to `raw/library/medicine-science/canon-ibn-sina/canon-ibn-sina.pdf` on the harvest drive. 1,161 pages, 6.9 MB, Arabic printed edition. Its own text layer exists but is partly broken, so the whole book is OCR'd with Apple Vision (`--force-ocr`).
- **Edition:** not verified yet (no publisher, date or volume on the title page we have read). Must be checked before the source is marked reviewed.
- **Category:** `medicine-science` is not in the category list of `books.yaml`; it is a harvest folder name only. Founder to confirm.
- **OCR:** started 18 Oct 2026 with `ocr_book.py --force-ocr`, log `logs/ocr-canon-ibn-sina.log`.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
