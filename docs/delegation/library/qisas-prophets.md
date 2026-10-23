# Lane `lib-exp-qisas-prophets`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-qisas-prophets`; `data/_stubs.d/lib-exp-qisas-prophets.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | not started |
| 2. Downloaded (filename, source URL, size recorded below) | not started |
| 3. OCR (local, drive only) | not started |
| 4. Distilled into draft entities | batch 01 drafted (pp. 1–47 read; pp. 47–54 not yet read in detail) |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started (batch 01 on branch, not merged) |

## Batch 01 (18 Oct 2026, branch `worktree-agent-af3625b8b947afe36`)

- **Source read:** OCR of al-Tha'labi, *Qisas al-Anbiya'* (title page: 4th edition, Beirut; publisher and date not verified). Citations use OCR page markers `p.N` only; printed page numbers do not match the markers consistently.
- **Pages covered:** p. 1–4 (title page, author's introduction and the five reasons for narrating past stories); pp. 4–23 (cosmology, skimmed by heading only, no entities drawn); pp. 24–47 (Adam: creation, soul, Hawwa, the test, the fall, descent, repentance, Hajj, Qabil and Habil).
- **Not yet read in detail:** pp. 47–54 (rest of the Adam section, which ends where the Nuh section begins on p. 54). Nuh is not yet drafted.
- **Entities created (all `status.review: draft`):**
  - `work/qisas-anbiya-thaalabi` (content: `content/ar/work/qisas-anbiya-thaalabi.md`)
  - `source/qisas-anbiya-thaalabi-edition` (the scanned edition, unverified)
  - `person/hawwa`, `person/iblis`, `person/qabil`, `person/habil`
  - `event/murder-of-habil`
- **Reused, not duplicated:** `person/adam` (existing, Bukhari-based summary; not edited), `person/abu-ishaq-al-thalabi` (author), `source/shadharat-dhahab` (death date, second source for 427 AH), `place/sarandib`, `place/jeddah`, `place/basra` and `place/mina`/`arafat` (mentioned in prose only), `passage/quran-5-27` and related passages (not yet referenced in prose; Qur'an text is never typed).

## Duplicates found and skipped

- `person/adam`: already present; not recreated.
- `person/iblis`: listed as a stub in `data/_stubs.d/quran-mentions.yaml` (another lane's file). Now a real record; that stub line should be removed by its owner (validate warning, not an error).

## Open issues for review

- The "isra'iliyyat" and unisnadded reports (Ibn Abbas, Wahb ibn Munabbih) are presented as the book's reports. No secondary source for their grading has been added yet; prose says so.
- The Ja'far al-Sadiq view on sibling marriage (p. 44) and the "light of Muhammad" report (p. 26) are labelled as the book's reports. A perspective block needs a cited secondary view before any ruling-like wording.
- The poems on Habil's death are marked spurious in an editorial footnote (p. 46), which belongs to the edition's editor, not to al-Tha'labi.
- The title on the title page is garbled in OCR ("عزايين المجالين"); the work label uses "قصص الأنبياء (العرائس)" from the author's known title. Verify against the scan.
- Relations on the Qur'an-based passages were not added; first batch used no Qur'an references in prose.

## Downloads

Pre-download record. Each file is named by its archive.org identifier; the titles were checked only by the fetcher's token match, so each one must be confirmed against the book before OCR.

### qisas-anbiya-kisai

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- would get AAlexandrina-146548  0.04 GiB  146548 - قصص الانبياء
- would get 7_20210114  0.00 GiB  قصص الأنبياء

### qisas-anbiya-thaalabi

Candidates (dry run, 18 Oct 2026; `--max-items 2`; identifier, file, size; source archive.org/download/<identifier>/):

- no candidate found


## Download status (18 Oct 2026)

- Run stopped by the coordinator, not finished: 75 download attempts started; 0 `FAILED` lines; 0 new rows in `library/manifest.jsonl` (966 file rows before and after). The attempts re-fetched files already on the drive, so the run was stopped.
- `fetch_books.py` now skips a book with a downloaded file and skips a file already on disk. Not yet committed.
- Books with no candidate found: see the lane's Downloads section.

## Next step

Batch 02: read pp. 47–54 (rest of Adam, the Nuh opening), then draft Nuh and any other prophets whose stories begin in the next slices (Hud, Salih, Ibrahim per the grep for "مجلس فى قصة" headings: lines 1770, 2018, 2200 and later). Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
