# Lane `lib-exp-qiraat-grammar`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-qiraat-grammar`; `data/_stubs.d/lib-exp-qiraat-grammar.yaml`

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

### taysir-dani

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-424516  0.01 GiB  424516_كتاب_التيسير_في_القراءات_السبع
- would get AAlexandrina-223598  0.02 GiB  223598_كتاب_التيسير_في_القراءات_السبع

### nashr-ibn-jazari

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get tajjibatuannashrfialqiraatialashribnaljazari  0.04 GiB  طيبة النشر في القراءات العشر
- would get nashrqraatashr  0.02 GiB  النشر في القراءات العشر الجزري

### mughni-labib-ibn-hisham

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 20250501_20250501_1944  0.02 GiB  مغني اللبيب عن كتب الأعاريب
- would get mokhni00  0.01 GiB  مغني اللبيب عن كتب الأعاريب

### alfiyya-ibn-malik

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get 4000pdf  0.01 GiB  4000 كتاب اقرا اونلاين Pdf شروح الألفية لابن مالك الخلاصة فى النحو الم

### kitab-sibawayh

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- no candidate found


## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
