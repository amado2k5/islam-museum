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
| 4. Distilled into draft entities | first batch drafted (branch `lib-exp-qiraat-grammar/al-kitab-batch-1`, 18 Oct 2026): al-Kitab pp. 1–28 (editor's introduction) and pp. 53–55 (opening bab on the word classes) |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started |

## Duplicates found and skipped

- `work/kitab-sibawayh` (Devin draft, Fihrist-based) and `person/sibawayh` already exist. Not recreated; the Zein 2015 edition was added to their `sources` and the `authored` edge was added once on the person side. Their claims were not altered.
- `person/al-sirafi`, `person/al-zajjaji`, `person/al-shantamari-yusuf-ibn-sulayman`, `person/ali-ibn-isa-al-rummani`, `person/al-kisai`, `person/al-mubarrad`, `person/yunus-ibn-habib`, `person/abu-zayd-al-ansari`, `person/isa-ibn-umar-al-thaqafi`, `person/hammad-ibn-salama`, `person/al-akhfash-al-awsat-said`, `person/al-khalil-ibn-ahmad-al-farahidi`, `person/ibn-khaldun` already exist. Not recreated.
- `concept/ibtida-al-nahw` and `concept/madrasat-al-nahw-al-basriyya-kufiyya` already exist. Not recreated.
- No existing record for the opening bab's word-class concept, nor for al-Sirafi's commentary as a work. Both created.

## Batch 1 (18 Oct 2026, draft)

- Edition: `source/bakka-kitab-sibawayh-2015`. Muhammad Kazim al-Bakka, Zein Legal and Literary Library, Beirut, 2015, vol. 1 part 1. Edition NOT yet verified against the physical book; ISBN and statement read from the OCR copyright page (p.3).
- Pages covered: OCR pp. 1–28 (editor's introduction, outline, method, and Sibawayh's life pp. 13–16, title and attribution pp. 17–18, method pp. 21–28) and pp. 53–55 (the opening bab "هذا باب علم ما الكلم من العربية", the bab on the courses of word endings).
- Entities created: `concept/al-kalim-wal-kalam`, `work/sharh-kitab-sibawayh-al-sirafi`, `source/bakka-kitab-sibawayh-2015`.
- Entities edited (additions only): `work/kitab-sibawayh` (source and content section on the edition), `person/sibawayh` (`authored` edge and source), `person/al-sirafi` (`authored` edge and source).
- Not added: no death date for Sibawayh. The editor (p.15) gives 180 AH only as a view of some modern scholars, citing al-Hadithi. Needs a second source before any date is recorded. Birth in Shiraz (p.14) is a closest-opinion claim in the editor's introduction, also not recorded.
- Skipped: Sibawayh's birth and death details beyond the above; the editor's manuscript list (pp. 4–11) beyond the sources line.

## Next step (batch 2)

- Read OCR from p.56 onward in slices of about 30 pages: the bab on the courses of word endings (p.55 onward) and the verb's three courses (المجاري) noted in p.25. Create concept entities only where `data/concept/` lacks them.
- Check `data/concept/` for an existing entry on i'rab (inflection) before creating one.
- Two independent sources are needed for any death or birth date of Sibawayh before it is recorded.

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


## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

## Batch 1 (18 Oct 2026, draft)

- **Book:** al-Shatibi, Hirz al-Amani (al-Ghawthani, 5th ed., 2010)
- **Pages covered:** pp. 1-3 of the scan (title page, publication page, correction note)
- **Entities created (draft, `status.review: draft`):** work/hirz-al-amani-wa-wajh-al-tahani; person/al-shatibi (reused, not changed)
- **Sources created:** one `source/` record for this edition, with `reliability_note` stating that the edition is unverified and that citations use scan page numbers (the `[pN]` OCR markers), not printed pages.
- **Skipped:** no concept records; no perspectives block (no sourced Sunni-frame lead has been read yet, so none is written); no death year for the author where the book does not state it; no dates beyond those in the book's own text.
- **Next step:** read the book beyond the pages listed above, add the sources needed for the second citation of any dated fact, and decide whether any concept record is warranted.
