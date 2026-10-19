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

## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Batch 1: al-Mawsu'a al-Fiqhiyya (draft, 18 Oct 2026)

- **Copy:** `fiqh/fiqh-mawsua-foulabook`, a Shamela digital text file (1,246 scan pages) on the harvest drive, not in git.
- **Identity mismatch:** the brief names the Kuwaiti encyclopedia, but the title page of this copy credits a Dorar.net compilation under Alawi al-Saqqaf in three volumes. Not attributed to the Kuwaiti encyclopedia. Founder to confirm which printed edition is wanted.
- **Pages covered (scan markers):** pp.1–4 (title page, table of contents for worship chapters, start of the first topic, purity). The first real entry is purity (al-tahara); the table of contents lists it, the body was only skimmed.
- **Entities created (all `status.review: draft`):**
  - `work/al-mawsua-al-fiqhiyya` (book; no authors given in the copy)
  - `source/fiqh-mawsua-foulabook-copy` (secondary; edition not verified)
  - `content/ar/work/al-mawsua-al-fiqhiyya.md`
- **Skipped and why:**
  - `concept/tahara` already exists, so the first entry is linked (`mentions`), not created.
  - `concept/fiqh` already exists and is linked.
  - Authors: the copy names a supervisor and a team of researchers only; no person or group record created.
  - Honorific formulas in the OCR text: not copied.
- **Next step:** confirm the printed edition (volumes, publisher, date) before any dated claim. Read the start of the first topic body and decide whether any later entry is a new concept. Muwafaqat, Burhan, Mustasfa, Bidayat al-Mujtahid and Mughni remain on the lane list, not yet started.

## Batch 2: al-Mawsu'a al-Fiqhiyya al-Kuwaitiyya, Noor-Book copy (draft, 19 Oct 2026)

- **Copy:** `books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git. OCR completeness: `pages.json` holds 18,079 entries and `book.txt` holds 18,079 page markers, matching the PDF's 18,079 pages.
- **Identity:** the file name says volume 3 of 45, but the OCR title page (scan p.2) reads «الجزء الإول» (Part 1). The second-edition date (1404 AH / 1983, scan p.5) is the page's own statement and is flagged `needs_source`. Printed volume and edition not verified; the publisher is the Ministry of Awqaf and Islamic Affairs, Kuwait, as the page states. The title of the Shamela copy (batch 1) is a different book; both are kept, distinct ids.
- **Pages covered (scan markers):** pp.1–8 (title and index), pp.1279–1344 (introduction: the encyclopedia's definition, aims, scope, exclusions, method, conclusion; read: pp.1282, 1326, 1327, 1331, 1338, 1340, 1341, 1344); entry «آبار» pp.1351–1353 (read in full); entry «إباحة» pp.1405–1407 (read in full).
- **Entities created (all `status.review: draft`):**
  - `work/al-mawsua-al-fiqhiyya-al-kuwaitiyya` (book)
  - `source/fiqh-mawsua-kuwaitiyya-noor-v3` (secondary; edition and volume not verified)
  - `concept/al-abar` (wells, fiqh of wells; Sections 1–3 of the entry only)
  - `concept/ibaha` (permissibility; pp.1405–1407)
  - content: `content/ar/work/al-mawsua-al-fiqhiyya-al-kuwaitiyya.md`, `content/ar/concept/al-abar.md`, `content/ar/concept/ibaha.md`
- **Existing entities linked, not duplicated:** `concept/fiqh` (mentioned from the work). `concept/bida` exists and is the headword «ابتداع» of this encyclopedia; not yet linked from this batch.
- **Skipped and why:**
  - Headwords آبق, آجن, إبانة, إبدال, إبراء and the rest of the first pages of headings: outside this batch's three-page window or not yet read.
  - Introduction pp.1283–1325 (the phases of fiqh, the history of the encyclopedia): read only in index form.
  - No person or group records created: the pages read name no authors and no scholars as subjects.
  - Honorific formulas in the OCR text: not copied; the Qur'an verses cited in the entries are referenced by passage id only (`quran-2-29`), never typed.
- **Next step:** read scan pp.1354–1360 to finish «آبار» (Shafi'i and Hanbali abundance thresholds), then pp.1404 and 1408–1410 for «إباحة», then the next headings (آبق, آجن, إبانة, إبدال). Confirm the printed volume number and edition before any dated claim beyond the second-edition date.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
