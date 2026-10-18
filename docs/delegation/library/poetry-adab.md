# Lane `lib-exp-poetry-adab`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-poetry-adab`; `data/_stubs.d/lib-exp-poetry-adab.yaml`

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

### aghani-isfahani

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get al-aghani-03  0.02 GiB  كتاب الأغاني 3
- would get al-aghani-05  0.02 GiB  كتاب الأغاني 5

### bayan-tabyin-jahiz

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get al-Jahiz  0.02 GiB  البيان والتبيين
- would get 20240524_20240524_0853  0.01 GiB  البيان والتبيين - الجاحظ

### adab-katib-ibn-qutayba

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-196408  0.05 GiB  196408 - ادب الكاتب
- would get AAlexandrina-195125  0.05 GiB  195125 - أدب الكاتب

### maqamat-hariri

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 20200714_20200714_1723  0.01 GiB  مقامات الحريري
- would get idmehmedefend-147  0.19 GiB  مقامات الحريري

### lisan-arab-ibn-manzur

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-068632  0.12 GiB  068632 - لسان العرب
- would get AAlexandrina-137925  0.08 GiB  137925 - لسان العرب

### qamus-muhit-fayruzabadi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-155214  0.06 GiB  155214 - القاموس المحيط
- would get AAlexandrina-140896  0.07 GiB  140896 - القاموس المحيط


## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
