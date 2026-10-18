# Lane `lib-exp-regional-histories-travel`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-regional-histories-travel`; `data/_stubs.d/lib-exp-regional-histories-travel.yaml`

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

### khitat-maqrizi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 2_20201209_202012  0.03 GiB  المواعظ والاعتبار بذكر الخطط والآثار- للمقريزي
- would get 20221202_20221202_0332  0.07 GiB  المواعظ والاعتبار بذكر الخطط والآثار الخطط المقريزية

### rihla-ibn-jubayr

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get RihlatIbnGobair  0.01 GiB  رحلة ابن جبير
- would get 20200407_20200407_1750  0.02 GiB  ابن جبير رحلة

### rihla-ibn-battuta

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get ar115voyag04  0.01 GiB  ابن بطوطة تحفة النظار في غرائب الأمصار وعجائب الأسفار
- would get 20200917_20200917_2022  0.01 GiB  رحلة ابن بطوطة تحفة النظار في غرائب الأمصار وعجائب الأسفار

### nuzhat-mushtaq-idrisi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 1-2_20240914  0.02 GiB  كتاب نزهة المشتاق في اختراق الآفاق 1 و 2
- would get ar118hist53  0.02 GiB  الشريف الإدريسي نزهة المشتاق في اختراق الآفاق

### ahsan-taqasim-maqdisi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AhsanAlTakaseemFeyMarefatAlAkaleem  0.01 GiB  كتاب أحسن التقاسيم في معرفة الأقاليم
- would get ar120vieux99  0.01 GiB  المقدسي أحسن التقاسيم في معرفة الأقاليم

### bayan-mughrib-idhari

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get elshandawily9182  0.00 GiB  البيان المغرب في أخبار الأندلس و المغرب لابن عذاري المركشي
- would get elshandawily9178  0.02 GiB  البيان المغرب في أخبار الأندلس و المغرب لابن عذاري المركشي الجزء الاول


## Duplicates skipped (canon)

- Duplicate skipped: `rihla-ibn-battuta` is already in the canon; no second entry added.

## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
