# Lane `lib-exp-sufism`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-sufism`; `data/_stubs.d/lib-exp-sufism.yaml`

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

### risalat-qushayri

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get Library.mmn_20160412  0.02 GiB  الرسالة القشيرية
- would get rquchairya  0.03 GiB  الرسالة القشيرية

### luma-sarraj

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get al-luma_fit_tasawwuf_202506  0.03 GiB  اللمع في التصوف - ت الجادر للشاملة
- would get al-luma_fit_tasawwuf  0.01 GiB  اللمع في التصوف - ت نيكلسون للشاملة

### kashf-mahjub-hujwiri

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get ar117myst27  0.01 GiB  الهجويري كشف المحجوب
- would get elshandawily519  0.01 GiB  كشف المحجوب الهجويري 1

### tabaqat-sufiyya-sulami

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get BBib-Alex-17435  0.02 GiB  طبقات_الصوفية_17435_السلمى,_ابو_عبد_الرحمن_محمد_بن_الحسين_بن_محمد
- would get TabakatSufiya  0.02 GiB  طبقات الصوفية

### hikam-ibn-ataillah

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-095550  0.02 GiB  095550 - الحكم العطائية
- would get Library.mmn_20150920  0.00 GiB  المنح القدسية على الحكم العطائية


## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
