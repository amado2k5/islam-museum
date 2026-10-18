# Lane `lib-exp-heresiography-polemics`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-heresiography-polemics`; `data/_stubs.d/lib-exp-heresiography-polemics.yaml`

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

Pre-download record. Each file is named by its archive.org identifier; the titles were checked only by the fetcher's token match, so each one must be confirmed against the book before OCR.

### milal-nihal-shahrastani

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-150817  0.04 GiB  150817 - الملل والنحل
- would get AAlexandrina-214563  0.01 GiB  214563 - كتاب الملل والنحل

### fisal-ibn-hazm

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 20211016_20211016_0215  0.01 GiB  الفصل في الملل والأهواء والنحل
- would get AAlexandrina-150032  0.03 GiB  150032_الفصل_فى_الملل_والاهواء_والنحل

### talbis-iblis-ibn-jawzi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get noor-book.com_20260811  0.02 GiB  تلبيس إبليس
- would get AAlexandrina-142479  0.05 GiB  142479 - تلبيس ابليس

### farq-bayn-firaq-baghdadi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-155048  0.03 GiB  155048 - الفرق بين الفرق
- would get 1492Pdf_201812  0.01 GiB  1492 الفرق بين الفرق البغدادي Pdf


## Duplicates skipped (canon)

- Duplicate skipped: `fisal-ibn-hazm` is already in the canon (`books.yaml`, Ibn Hazm entry); no second entry added.

## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
