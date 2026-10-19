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

## Batch 1 (draft, branch `lib-exp/batch-1-abduh-fiqh-algebra`, 18 Oct 2026)

- **Book:** Muhammad Abduh, *Risalat al-Tawhid*, ed. Muhammad Imara (Dar al-Shuruq, Cairo; imprint 1994 on scan p.4). Local OCR on the harvest drive, not in git. 197 scan pages.
- **Pages covered (scan markers):** pp.1, 4, 5 (title and imprint), pp.7–11 (editor's introduction). Nothing from the body of the treatise yet.
- **Entities created (all `status.review: draft`):**
  - `work/risalat-al-tawhid` (book; author `person/muhammad-abduh`, existing record; `about concept/tawhid`)
  - `source/abduh-risalat-tawhid-imara-1994` (primary; edition not verified)
  - `content/ar/work/risalat-al-tawhid.md`
- **Labelled:** Abduh's emphasis on reason against imitation (taqlid), scan p.11, is marked as his own view and not as the Sunni consensus.
- **Skipped and why:**
  - Abduh's birth and death years (1849, 1905, as the editor gives them on scan p.7): one source only, so no date is written on any record; flagged in the source note.
  - Positions in the body of the treatise: next batch.
  - `person/muhammad-abduh` and `person/jamal-al-din-al-afghani` already exist and are linked, not recreated. `concept/tawhid` exists and is linked, not recreated.
- **Next step:** read the body of the treatise (the chapters after scan p.11), state Abduh's positions with labels where they differ from the Sunni mainstream, and confirm the edition against a second print before any record leaves draft.

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

## Batch 1 (18 Oct 2026, draft)

- **Book:** al-Ghazali (Muhammad), Islam wal-Manahij al-Ishtirakiyya (Nahdat Misr, 4th ed., 2005)
- **Pages covered:** pp. 1-5 of the scan
- **Entities created (draft, `status.review: draft`):** work/al-islam-wal-manahij-al-ishtirakiyya; person/muhammad-al-ghazali-modern (new)
- **Sources created:** one `source/` record for this edition, with `reliability_note` stating that the edition is unverified and that citations use scan page numbers (the `[pN]` OCR markers), not printed pages.
- **Skipped:** no concept records; no perspectives block (no sourced Sunni-frame lead has been read yet, so none is written); no death year for the author where the book does not state it; no dates beyond those in the book's own text.
- **Next step:** read the book beyond the pages listed above, add the sources needed for the second citation of any dated fact, and decide whether any concept record is warranted.

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

## Tafsir al-Manar, volumes 6 and 8 (batch 1, library-expansion, 19 Oct 2026, draft)

- **Branch:** `content/lib-exp-tafsir-manar-v6-v8` (from `origin/main` at `ae8727f52`; not pushed to main, not merged).
- **Pages covered (OCR page markers, which match the printed page numbers where a number is visible):**
  - Vol. 6: pp. 1 to 14 (title pages; the commentary from Q. 4:148 to 4:161, including the covenant and the Sabbath); pp. 95 to 98 (the opening of al-Ma'ida, Q. 5:1-2, and the relation of al-Ma'ida to al-Nisa).
  - Vol. 8: pp. 1 to 13 (title pages; Q. 6:111 to 6:115); pp. 260 to 263 (opening of al-A'raf, its place among the surahs, and the disjoined letters).
  - Not read: vol. 6 from p. 15 to p. 94 and p. 99 on; vol. 8 from p. 14 to p. 259 and p. 264 on.
- **Entities created (9, all `status.review: draft` with a provenance block):**
  - `source/tafsir-manar-v06`, `source/tafsir-manar-v08` (primary, book; reliability note: edition not verified; editor's name and year read with OCR errors, not recorded)
  - `concept/tahrif` (Rida's reading of Q. 6:115 and of the Qur'an's statement on the alteration of earlier scripture; one `perspectives` entry, Sunni lead, attributed to the Qur'an as Rida reads it)
  - `concept/ahl-al-kitab` (Rida's argument on belief in some messengers; the Constantine polemic labelled as his)
  - `concept/sunnat-allah` (Rida's reading of the patterns in the enmity of the proud against the prophets; sociological terms he uses, labelled)
  - `concept/shayatin-al-ins-wal-jinn` (the disagreement over whether humans can be shayatin; two `perspectives` entries, both Sunni tafsir views as Rida reports them)
  - `concept/al-ummi` (the Prophet described as unlettered as evidence of revelation; Rida's argument)
  - `concept/uqud` (the duty to keep contracts; two `perspectives` entries: the verbal-offer rule as described by Rida, and Rida's critique)
  - `concept/al-sabt` (the Sabbath and the breach recorded in the Qur'an and in the Manar's gloss)
  - `concept/mithaq-bani-israil` (the covenant; Rida's reading of the end of the Torah and of Paran; the Torah passage must be checked on a printed copy)
  - `concept/al-muqattaat` (Rida's preferred view of the disjoined letters; other views not yet read)
- **Reused, not created:** `person/rashid-rida`, `concept/israiliyyat` (not edited), `person/mujahid-ibn-jabr`, `person/qatada-ibn-diama`, `person/al-hasan-al-basri`, `person/al-tabari`, `passage/quran-4-150` to `quran-4-155`, `quran-5-1`, `quran-6-111` to `quran-6-115`, `quran-7-1` (cited in prose only, since the schema has no concept-to-passage edge). `work/tafsir-al-manar` was not edited.
- **Skipped / blocked:**
  - No `person/ibn-abbas` or `person/ikrima` record: not found in `data/` by slug; the names are cited in prose.
  - No `relations` on the concept records: the predicates that would link a concept to a passage (`mentions`, `revealed_about`) do not take a concept as their domain.
  - The Qur'an verses are only referenced, never typed. The Torah passage quoted by Rida (vol. 6, pp. 12-13) is summarised, not quoted.
  - The sentence in vol. 8, p. 12 on whether God guarantees the wording of earlier books ends at a page break in the OCR; flagged in `concept/tahrif`.
- **Checks:** `npm run validate` reports 0 errors and no warnings on the new files.
- **Next step:** read vol. 6 from p. 15 (the rest of Q. 4:161 onward, including Q. 4:171 and the Trinity passage) and p. 99 onward (the rest of al-Ma'ida's opening); read vol. 8 from p. 14 (the rest of Q. 6:115 onward, including the lawful food verses) and the body of al-A'raf (from p. 264, starting with the story of Adam). Each read yields one or two concept records; add a classical tafsir source (al-Tabari or Ibn Kathir) for the perspectives marked as Sunni.
## Tafsir al-Manar, volumes 2 and 3 (batch, 19 Oct 2026, draft)

- **Branch:** `worktree-agent-a98d87fbd80a5d886` (lane `lib-exp-tafsir-manar`; not pushed, not merged).
- **Pages covered (OCR markers):** vol. 2, pp. 1 to 9 (title pages; commentary on Q. 2:142 to 2:143, the qibla dispute and the "wasat" passage; the end of 2:143 begins on p. 9). Vol. 3, pp. 1 to 7 (title pages; Q. 2:253 on the messengers, the speech of God, "raf'a darajat", and the "law shaa Allah" passage). Later pages of both volumes are not read.
- **Entities created (all `status.review: draft`, with provenance):**
  - `source/tafsir-manar-v02` (primary, book; edition not verified; reliability note records the death-year discrepancy with v01 and v07)
  - `source/tafsir-manar-v03` (primary, book; edition not verified)
  - `concept/ummat-wasat` (wasat: Rida's reading next to the classical "justice and choice" sense)
  - `concept/ibtila` (the two readings of "li-na'lam" in 2:143)
  - `concept/tafdil-al-rusul` (2:253: the majority reading of "raf'a darajat" as the Prophet, and the Idris reading)
  - `concept/ikhtilaf-ahl-al-adyan` (2:253: the compulsion reading, rejected, and the reading of God's sunna in human choice)
  - `person/al-baydawi` (named only as Rida quotes him; no dates or full name recorded)
- **Entities extended:** `event/change-of-qibla`: `source/tafsir-manar-v02` added to its `sources` list only. No prose sentence added yet.
- **Reused, not created:** `work/tafsir-al-manar`, `person/rashid-rida`, `person/muhammad-abduh`, `person/mujahid-ibn-jabr`, `concept/tafsir-bil-raay`, `event/change-of-qibla`, passages `quran-2-143`, `quran-2-253` (prose links only).
- **Skipped and why:**
  - A new `concept/tahwil-al-qibla` was drafted and removed: `event/change-of-qibla` already covers the same thing (duplicate title).
  - `person/jalal-al-din-al-mahalli` not created: the volume names him only as "al-Jalal" and does not state the Jalalayn attribution; a second source is needed first.
  - `concept/ilm-al-ghayb-wal-shahada` and `concept/ruh-al-qudus` not drafted (read in part, not written up).
  - No Qur'an text typed; the verses appear only as `passage` links.
- **Checks:** `npm run validate` 0 errors (1953 warnings, mostly pre-existing title-collision warnings); `npm run graph` and `npm run coverage` run in the same commit.
- **Next step:** read vol. 2 from p. 10 (2:144 on) and vol. 3 from p. 8 (2:254 on, and 3:1 onward); add a second source for the two publication dates and the author's death year before any record leaves draft; add a sentence from Rida on the qibla view to `event/change-of-qibla` (its prose is not yet changed); decide whether a `concept/naskh` record is warranted once the naskh discussion in vol. 2 is read.
