# Lane `lib-exp-siyasa-hisba`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-siyasa-hisba`; `data/_stubs.d/lib-exp-siyasa-hisba.yaml`

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

### siyasa-shariyya-ibn-taymiyya

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-149786  0.00 GiB  149786_كتاب_السياسة_الشرعية_فى_اصلاح_الراعى_والرعية
- would get AAskZad-1110324  0.01 GiB  Book السياسة الشرعية في إصلاح الراعي والرعية [1110324] --- تقي الدين أ

### hisba-ibn-taymiyya

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get alfirdwsiy2018_gmail_602_201809  0.00 GiB  ابن تيمية الحسبة في الإسلام أو وظيفة الحكومة الإسلامية كتاب اقرا اونلا
- would get alfirdwsiy1433_gmail_019_20180212_0642  0.00 GiB  019 اقرا اونلاين كتاب ابن تيمية إبن تيميه الحسبة في الإسلام أو وظيفة ا

### maalim-qurba-ibn-ukhuwwa

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- no candidate found


## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Batch 1 (draft, branch `lib-exp-medicine-science/manazir-maalim-zij-batch-1`, shared with the medicine-science batch)

- **Book:** Ibn al-Ukhuwwa, *Maʿalim al-Qurba fi Ahkam al-Hisba*. Local OCR copy on the harvest drive (`books/fiqh/maalim-qurba-ibn-ukhuwwa/`, 421 scan pages). The earlier "no candidate found" note above is superseded: the copy is on the drive.
- **Pages covered (scan markers):** pp.1–9 (title pages, editors' introduction, start of the "importance of the manuscript" section). Chapters after p.9 not yet read.
- **Entities created (all `status.review: draft`):**
  - `work/maalim-al-qurba-fi-ahkam-al-hisba`
  - `person/ibn-al-ukhuwwa` (death 729 AH from the editors' introduction, p.6; flagged `needs_source`)
  - `concept/hisba`
  - `source/maalim-qurba-edition-1976` (edition not verified; a second printing of 1408 AH is named on p.4)
- **Skipped and why:** the author's nisba is OCR'd as الفرشي on p.2 and as القمرشي on p.4; the spelling used is القرشي, to be checked on the image. No traditions field set: the faith or madhhab of Ibn al-Ukhuwwa is not stated in the pages read.
- **Schema or enum needs:** none.

## Next step

1. Read the Maʿalim chapters from p.10 (the muhtasib's duties in markets, weights, crafts, and forbidden contracts), create concept or work entities only where they are absent from `data/`.
2. Find a second source for Ibn al-Ukhuwwa's death year (729 AH) before it leaves draft.
3. Confirm the printed edition on the page images (pp.2 and 4) before any record moves from draft.
4. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
