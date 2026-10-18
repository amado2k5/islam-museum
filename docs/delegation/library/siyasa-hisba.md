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


## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
