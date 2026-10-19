# Lane `lib-exp-modern-muslim-writers`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-modern-muslim-writers`; `data/_stubs.d/lib-exp-modern-muslim-writers.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | Iqbal, *The Reconstruction of Religious Thought in Islam*: located on the harvest drive (174 PDF pages, OCR text present). Not yet in `books.yaml`. |
| 2. Downloaded (filename, source URL, size recorded below) | Found on the drive; no new download made. |
| 3. OCR (local, drive only) | Existing OCR read for pp. 3 to 19 (preface and Lecture I). |
| 4. Distilled into draft entities | First batch drafted: 5 entities (listed below), branch `content/lib-exp-modern-muslim-writers-iqbal`, review `draft`. |
| 5. Verified (`verify_cites.py`) | Not run. Edition not verified; each page citation is to the printed page number in the OCR text. |
| 6. Published in batches of at most 25 | Not published; awaiting merge by the founder or the lane owner. |

## Batch 1 (Iqbal, pp. 3 to 19)

Entities drafted (all `status.review: draft`, with provenance):

- `work/reconstruction-religious-thought-islam` (author `person/muhammad-iqbal`, existing record)
- `source/iqbal-reconstruction-religious-thought` (edition not verified; the reliability note says so)
- `concept/religious-experience` (new; no existing record found by grep)
- `concept/fuad-heart-as-insight` (new)
- `concept/tests-of-religious-experience` (new)

Pages covered: preface (p. 3) and Lecture I (pp. 4 to 19). Lecture II onward (from p. 20) is not covered.

Reused existing records: `person/muhammad-iqbal`, `person/muhammad`, `person/al-ghazali-abu-hamid`, `person/ibn-rushd`, `person/ibn-khaldun`, `concept/ilm`, `concept/tasawwuf` (the last two as `mentions` edges only).

## Duplicates found and skipped

- `concept/ilm` already exists with a different sense (the hadith on seeking knowledge); Iqbal's "knowledge" discussion is cited through it, not duplicated.
- No `perspectives` block was written on the three concepts: the validator requires a Sunni lead entry, and no sourced Sunni position for these notions has been read yet. Iqbal's views are labelled as his in the summaries.

## Downloads

None.

## Open items before review

- Verify the edition, publisher and year (the source record is `reliability_note`-flagged).
- Add a Sunni-frame perspective, from a Sunni source, to each concept where Iqbal's reading differs from the mainstream (Ghazali and kalam in particular).
- Read Lecture II onward (pp. 20 to 170 of the OCR).
- No Qur'an text is typed; Qur'an verses quoted by Iqbal are not linked yet (no passage record was checked for them).

## Next step

Founder or lane owner: review batch 1 and decide whether to merge. Then the next Iqbal batch is Lecture II (pp. 20 to 40) and a Sunni-frame perspective per concept. Also add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

| 1. Books located (`books.yaml` entries) | Tafsir al-Manar, volumes 1 to 6 on the harvest drive (`books/tafsir/tafsir-manar-v01` to `-v06`); volumes 7 to 12 also present, not in scope yet |
| 2. Downloaded (filename, source URL, size recorded below) | Local copy, volume 1 (406 PDF pages, OCR `book.txt`) |
| 3. OCR (local, drive only) | Volume 1 read; volumes 2 to 6 not yet read |
| 4. Distilled into draft entities | Batch 1 drafted (volume 1, pp. 3 to 34) |
| 5. Verified (`verify_cites.py`) | not run yet for this batch |
| 6. Published in batches of at most 25 | Batch 1: 7 entities created, 1 extended, branch `content/lib-exp-modern-muslim-writers-manar-1-6` |

## Tafsir al-Manar, volumes 1 to 6 (batch 1)

- **Pages covered (volume 1, OCR page markers):** pp. 1 to 2 (title pages), 3 to 8 (editor's foreword), 9 to 26 (Rida's introduction to the tafsir, from Abduh's lessons, method and aims), 31 to 34 (opening of the commentary on al-Fatiha: its Meccan status, names, and the question of the first revelation). Printed page numbers agree with the markers on the pages checked.
- **Entities created (7):** `work/tafsir-al-manar`, `source/tafsir-manar-v01`, `concept/israiliyyat`, `concept/tafsir-bil-raay`, `concept/tawil-quran`, `concept/awwal-ma-nazal-min-al-quran`, `concept/hidayat-al-quran`.
- **Entities extended:** `person/kab-al-ahbar` (source `source/tafsir-manar-v01` added to its `sources` list; no summary sentence from Rida added yet).
- **Reused (not created):** `person/rashid-rida`, `person/muhammad-abduh`, `person/ibn-taymiyya`, `person/ahmad-ibn-hanbal`, `person/al-zamakhshari`, `passage/quran-7-53`.
- **Skipped:** Ka'b al-Ahbar was first created as `person/kaab-al-ahbar`; it already exists as `person/kab-al-ahbar`, so the new file was removed. Dates of the Manar's publication (1317 and 1318 AH) are the book's own claim and carry a flag for a second source.
- **Edition:** the local copy is an OCR of a modern printing (editor Ibrahim Shams al-Din; publisher Dar al-Kutub al-Ilmiyya, Beirut). Its year is not read in the OCR and is not recorded. The edition is not verified.
- **Rules applied:** no Qur'an text typed (passage link only); no honorifics; every entity `status.review: draft` with a provenance block; Rida's views labelled as his; the first-revelation question carries a `perspectives` block with the majority view first.

## Duplicates found and skipped

- `person/kab-al-ahbar` (existing) matches Ka'b al-Ahbar; reused.

## Downloads

None (the books are already on the harvest drive; nothing fetched in this batch).

## Next step

Read volume 1 from p. 35 on (the commentary on al-Baqara's opening) and volumes 2 to 6 in later batches, one `source/tafsir-manar-v0N` record per volume read; find a second source for the 1317 and 1318 AH dates; add a sentence from Rida (vol. 1, p. 14) to the `person/kab-al-ahbar` summary when the person record is next reviewed.

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

## Tafsir al-Manar, volumes 7 to 12 (first batch, drafted by a sub-agent)

- **Branch:** `worktree-agent-a01d71126811eb10d` (new branch, not pushed to main, not merged). Lane: tafsir (`docs/agents/categories/tafsir.md`).
- **Pages covered:** vol. 7, pp. 1–11 of the OCR (title page; Ma'ida 82 to 85 commentary, the opening discussion of Christians and Jews). Pages 12 onward and volumes 8 to 12 are not yet read.
- **Entities created (all `status.review: draft`):**
  - `source/tafsir-manar-v07` (primary, book; reliability note says the edition is not verified)
  - `concept/al-adawa-wal-mawadda` (term; Rida's definitions of enmity and affection, against the majority reading; labelled as his own)
  - `concept/qissisun-wal-ruhban` (term; Rida's glosses of priests and monks, and the two transmitted readings of who is meant)
- **Reused, not created:** `person/rashid-rida`, `passage/quran-5-82` to `quran-5-85` (cited in prose only), `person/negus-of-aksum` (not linked yet).
- **Skipped / blocked:**
  - `work/tafsir-al-manar` is not on `origin/main` and was not created here; the other agent (volumes 1 to 6) owns it. No `commentary_on` or `authored` edge was written for the source.
  - The schema has no edge from a concept to a passage (`revealed_about` runs passage to concept only), so the verse links are in prose, not in `relations`.
  - No question or tension card written yet for the Crusades passage (Rida's answer on p. 9–10 is recorded only in the concept prose).
- **Next step:** read vol. 7 from p. 12 on (Ma'ida 86 onward, then An'am), add a `person` record for the Negus only if it is needed for an edge, and once the other agent's `work/tafsir-al-manar` is on main, link the source to it. Then volumes 8 to 12, one source record each.
