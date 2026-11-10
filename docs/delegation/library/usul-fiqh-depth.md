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

## Kuwaiti encyclopedia, batch 2 from p.1408 (draft, 19 Oct 2026)

- **Copy and identity:** as in the batch above (`books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git). The batch above is the first Kuwaiti batch on main; this section is the second, and its naming in the earlier prose ("Batch 2") predates this numbering.
- **Pages read (scan markers):** pp.1408-1416 (end of «إباحة» at the top of p.1408; «إباق» pp.1408-1412; «إبانة» pp.1412-1413; «ابتداع» cross-reference pp.1413; «إبدال» pp.1413-1415; first heading «إبراء» at p.1415-1416, not written up).
- **Entities created (all `status.review: draft`, with `provenance` and `sources: [source/fiqh-mawsua-kuwaitiyya-noor-v3]`):**
  - `concept/ibaq` (الإباق, running away of a slave; pp.1408-1411)
  - `concept/ibana` (الإبانة, severance of a part of a living body; pp.1412-1413; the report «ما أبين من حي فهو ميت» is marked debated, with the encyclopedia's own account of its grading)
  - `concept/ibdal` (الإبدال, substitution; pp.1413-1415)
  - content for each in `content/ar/concept/`, `content/en/concept/`, `content/ur/concept/`.
- **Skipped and why:**
  - `ابتداع`: the encyclopedia says «انظر: بدعة»; `concept/bida` already exists, so no entity.
  - The top of p.1408 (the end of «إباحة»: how permission ends by revocation, the death of the permitter or of the permitted): not added to `concept/ibaha` in this batch, to keep batch 1 unchanged. Next step.
  - Sections of «إباق» on pp.1411-1412 (the runaway's transactions, booty before division, ownership claims, zakat al-fitr, punishment): read but not written up, to stay within the page budget. Next step.
  - «إبراء» (pp.1415-1416): begins this batch's last page; not written up.
  - No person or group records: the pages name no scholars as subjects beyond the schools.
- **Checks:** `npm run validate` 0 errors; no new warnings on the new files; no honorifics; no Qur'an text typed.
- **Next step:** finish «إباق» pp.1411-1412 as a second record only if it is a distinct concept (likely not; add as a section), then «إبراء» from p.1415 (an entity `concept/ibra`, with the note that its prose has a separate section on «المبارأة» that the encyclopedia treats under khul'). Check the pages read against the Kuwaiti volume and edition before any dated claim.

## Kuwaiti encyclopedia, batch 3 from p.1415 (draft, 19 Oct 2026)

- **Copy and identity:** as above (`books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git). Batch 1 (pp.1351-1353, 1405-1407) and batch 2 (pp.1408-1415) are not recreated.
- **Pages read (scan markers):** pp.1415-1429 (about 15 pages). The headword «إبراء» starts on p.1415 and continues past p.1429, so the first complete headword is not reached inside the page budget.
- **Entity created (`status.review: draft`, `completeness: 0` = partial):**
  - `concept/ibra` (الإبراء, release of a debt or right). Covers pp.1415-1429: definition and related terms, ruling, kinds, dropping or transfer, elements and wording, acceptance and rejection, conditions on the releasor, the released and the matter released, and the conditions on the release itself.
  - content: `content/ar/concept/ibra.md`, `content/en/concept/ibra.md`, `content/ur/concept/ibra.md`.
  - Partiality is recorded in `status.generated_by` and in the closing line of each prose file. Do not treat this record as the whole headword.
- **Entities drafted:** 1 of the 25 allowed. No further headword is complete within the pages read.
- **Skipped and why:** none in the range. No other headword begins on pp.1415-1429: the rest of that span belongs to «إبراء».
- **Qur'an:** referenced by passage id only (`quran-2-280`, `quran-2-237`, `quran-4-92`); no verse text typed.
- **Next step (exact):** resume «إبراء» at scan p.1429, in the paragraph «ج - شرط ...» of the section «شروط للإبراء في ذاته» (the printed heading at p.1429 continues with the conditions on the release and on the subject of the release), read pp.1430-1445 or until the next headword («إبراء» ends where the next heading begins; find its first line, which is the next complete headword). Extend `concept/ibra` (its completeness goes from 0 to a higher value only after the full headword is written up), then draft the following complete headwords from that point. A later agent should confirm the first heading after «إبراء» by reading its start page; this batch did not read past p.1429.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

## Kuwaiti encyclopedia, batch 4 from p.1429 (draft, 19 Oct 2026)

- **Copy and identity:** as above (`books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git). Branch `lib-exp-usul-fiqh-depth-batch4` from `origin/main` with batch 3 merged in (`docs/coverage.md` taken from main and regenerated).
- **Pages read (scan markers):** pp.1429-1455 (27 pages, the page budget for this batch). Pages 1456 onward were not read.
- **`concept/ibra` finished (completeness 1):** the headword runs pp.1415-1443 and ends where «إبراد» begins on p.1444. Arabic, English and Urdu prose rewritten to cover the whole headword (sections 1-60). Batch 3's partial status is superseded; the entity id is unchanged.
- **Headwords drafted as complete (all `status.review: draft`, `completeness: 1`):**
  - `concept/ibrad` (الإبراد, delaying the noon prayer to the cool; p.1444)
  - `concept/ibda` (الإبضاع, sending capital to trade as a gift; pp.1445-1451)
  - `concept/ibtal` (الإبطال, invalidation of acts and worship; pp.1452-1453). Distinct from `concept/ibtal-al-falsafa`, which is a different headword.
  - `concept/abkam` (الأبكم, the mute person in fiqh; pp.1454-1455)
- **Entities drafted in this batch:** 4 new, 1 completed (ibra). Concept entities of the lane so far: 10 (al-abar, ibaha, ibaq, ibana, ibdal, ibra, ibrad, ibda, ibtal, abkam), excluding the work and source records.
- **Skipped and why:**
  - `إبط` (p.1451): cross-reference entry; its one ruling (removing armpit hair is recommended by most jurists) is a fitra matter, to be folded into a fitra entry, not a concept of its own.
  - `إبل` (pp.1455-1456): a list of cross-references to other chapters with little independent ruling; not drafted.
  - `إبلاغ`, `أبرص`, `إبريسم`: cross-reference only ("انظر").
  - `أبطح` (p.1454): a place (Mina valley area), not a concept; belongs to the place class if wanted.
  - `ابن` (from p.1456): started but not finished within the page budget; next step.
- **Qur'an:** referenced by passage id only (`quran-2-280`, `quran-2-237`, `quran-4-92`, `quran-47-33`); no verse text typed or completed. No honorific formulas typed (the OCR's «صلى الله عليه وسلم» and «رضي الله عنه» are not copied; the Urdu draft has no ؓ or ﷺ).
- **Not yet done:** `perspectives` blocks for contested points in ibra (the school-by-school positions are attributed in prose, as in batch 1-3 entries, but no structured perspectives block was added). A reviewer should decide whether to add them.
- **Checks:** `npm run validate` 0 errors; `npm test` 101 of 101 passed (exit 0); `npm run graph` and `npm run coverage` run after the content edits.
- **Next headword and page (exact):** `ابن` (ibn, the son, kinship and inheritance entry), begins on scan p.1456 (the heading «ابن» appears after «إبلاغ / انظر: تبليغ» at the foot of p.1456). Its completeness must be checked by reading to the next heading; the entry is long and likely needs a separate batch. If the next batch prefers shorter headwords first, the next short complete headword after p.1456 has not yet been checked; read from p.1456 and look for the next heading.

## Kuwaiti encyclopedia, batch 5 from p.1456 (draft, 20 Oct 2026)

- **Copy and identity:** as above (`books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git). Branch `lib-exp-usul-fiqh-depth-batch5` from `origin/main` with batch 4 merged in (`docs/coverage.md` taken from main and regenerated).
- **Pages read (scan markers):** pp.1456-1466 (11 pages). Headword «إبلاغ» (p.1456) is a cross-reference only («انظر: تبليغ»); not drafted.
- **Headwords drafted as complete (all `status.review: draft`, `completeness: 1`), 12 entities:**
  - `concept/ibn` (ابن, the son; pp.1456-1458): definition, general ruling, places of discussion
  - `concept/ibn-al-ibn` (ابن الابن; pp.1458-1459)
  - `concept/ibn-al-akh` (ابن الأخ; pp.1459-1460)
  - `concept/ibn-al-ukht` (ابن الأخت; pp.1460-1461)
  - `concept/ibn-al-bint` (ابن البنت; pp.1461-1462)
  - `concept/ibn-al-khal` (ابن الخال; p.1462)
  - `concept/ibn-al-khala` (ابن الخالة; pp.1462-1463)
  - `concept/ibn-al-sabil` (ابن السبيل; pp.1463-1464)
  - `concept/ibn-al-amm` (ابن العم; pp.1464-1465)
  - `concept/ibn-al-amma` (ابن العمة; p.1465)
  - `concept/ibn-labun` (ابن لبون; pp.1465-1466)
  - `concept/ibn-makhad` (ابن المخاض; pp.1466-1467)
- **Partial headwords:** none drafted. `أبنة` (p.1466) begins on the same page and runs past p.1466; it is not drafted and is the next step.
- **Skipped and why:** none of the above headwords existed in `data/concept/` (grep for ibn-prefixed ids returned nothing). Cross-references only and not drafted: «إبلاغ» (p.1456, to «تبليغ»). Sub-entries of «ابن» were written as separate concepts because each has its own heading with its own definition and rulings.
- **Translation scope:** Arabic prose is the full record; English and Urdu are draft translations of the summary and the three sections in each file. Wording on the Malikis, Hanafis and Shafi'is follows the encyclopedia's own attribution.
- **Qur'an and honorifics:** no Qur'an text typed; no honorific formulas copied from the OCR (the Urdu and English drafts omit them). The OCR's statement on the Prophet's grandsons was not copied.
- **Checks:** `npm run validate` 0 errors (see the run record in the commit message); `npm test` run once: 101 of 101 passed (8 files, exit 0); `npm run graph` and `npm run coverage` run in the same commit.
- **Next headword and page (exact):** `أبنة` (the word on the Kuwaiti encyclopedia's p.1466, its definition runs into p.1467), then `أبوات` at p.1468, then `اتباع` at p.1468. Read to the next heading before drafting; `أبنة` has no complete record yet.

## Kuwaiti encyclopedia, batch 6 from p.1466 (draft, 23 Oct 2026)

- **Copy and identity:** as above (`books/fiqh/fiqh-mawsua-kuwaitiyya-noor-v3/`, OCR on the harvest drive, not in git). Branch `lib-exp-usul-fiqh-depth-batch6` from `origin/main`, which already holds batch 5.
- **Pages read (scan markers):** pp.1466-1469 (4 pages). The drive was unmounted for part of this session and read again once it was back.
- **Headwords drafted as complete (all `status.review: draft`, `completeness: 1`), 3 entities:**
  - `concept/ubna` (الأُبْنَة, a condition of desire for the forbidden act; pp.1466-1467). The entry is set out as definition, general ruling and places of discussion. Marked `sensitivity: mature`.
  - `concept/ibham` (الإبهام, ambiguity in speech and transactions, and the finger as a meaning of the word; pp.1467-1468). The usuli appendix on ambiguity is not read here.
  - `concept/abawan` (الأبوان, the two parents, with figurative use; pp.1468-1469). The Qur'an verse is referenced by surah only, not quoted.
- **Partial headword, not drafted:** `اتّباع` (following; begins p.1468 and runs past p.1469). Next batch starts there.
- **Skipped:** none. «أبوات» is a heading in the same layout as «أبوان» and was covered with it.
- **Language:** Arabic content and English draft translations of every file. **Urdu translation is not included in this batch** (no `content/ur/` files), to be added in a follow-up.
- **Checks:** `npm run validate` 0 errors. `npm test`: 92 passed, 1 skipped, 2 failed. Both failures are in `scripts/tour.test.ts` and come from this worktree lacking `site/` dependencies (`astro/tsconfigs/strict` cannot be resolved). `verify_cites.py` reports 284 problems, none in these files (they are in other batches' files). `npm run graph` and `npm run coverage` run, `docs/coverage.md` regenerated.
- **Next headword and page (exact):** `اتّباع`, begins on scan p.1468 (after the heading «أَبَوات» / «أبوان» block). Read to the next heading before drafting.
