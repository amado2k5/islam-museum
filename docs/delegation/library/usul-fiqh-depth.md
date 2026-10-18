# Lane `lib-exp-usul-fiqh-depth`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-usul-fiqh-depth`; `data/_stubs.d/lib-exp-usul-fiqh-depth.yaml`

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

### muwafaqat-shatibi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 1_20250527_20250527_1859  0.01 GiB  الموافقات - الشاطبي
- would get 20200129_20200129_0618  0.02 GiB  الموافقات في أصول الشريعة

### burhan-juwayni

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 20251009_20251009_0414  0.00 GiB  البرهان في اصول الفقه الجويني، عبدالمالک المعالی، عربی ۔حق
- would get Pdf0881  0.00 GiB  كتاب اقرا اونلاين Pdf 0881 البرهان في أصول الفقه الجويني

### mustasfa-ghazali

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-187868  0.06 GiB  187868 - المستصفى من علم الاصول
- would get AAlexandrina-020376  0.04 GiB  020376 - كتاب المستصفى من علم الاصول

### risala-shafii

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 20240703_20240703_0812  0.07 GiB  كتاب الرساله للامام الشافعي
- would get noor-book.com-2_20240118  0.02 GiB  Noor Book.com الرسالة الشافعي 2

### bidayat-mujtahid-ibn-rushd

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get Bedayatt  0.01 GiB  بداية المجتهد ونهاية المقتصد
- would get Bedayat  0.01 GiB  بداية المجتهد ونهاية المقتصد

### mughni-ibn-qudama

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get mghni1  0.02 GiB  المغني لابن قدامة
- would get 15_20261015  0.02 GiB  المغني _ ابن قدامة المقدسي


## Duplicates skipped (canon)

- Duplicate skipped: `risala-shafii` and `mughni-ibn-qudama` are already in the canon; no second entry added.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
