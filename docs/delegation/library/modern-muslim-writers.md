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

## Tafsir al-Manar, volumes 4 and 5 (batch, draft, branch `lib-exp/tafsir-manar-v04-05`, 19 Oct 2026)

- **Pages covered (OCR page markers):** vol. 4, pp. 1 to 12 (title pages; commentary on Q. 3:93 to 97: Abraham's religion, the first house, the station, the sanctity of the Haram, the duty of the pilgrimage, Rida's footnote on the Hajj in his time); vol. 5, pp. 1 to 8 (title pages; opening of the commentary on Q. 4:24 and 4:25: married women, those whom the right hand possesses, captives in a religious war).
- **Entities created (all `status.review: draft`, with provenance):**
  - `source/tafsir-manar-v04` (primary, book; edition not verified, reliability note says so)
  - `source/tafsir-manar-v05` (primary, book; edition not verified, reliability note says so)
  - `concept/maqam-ibrahim-ayat-tafsir` (Rida's reading of the station and the signs listed for it; the stone itself is `object/maqam-ibrahim`, reused by link, not duplicated)
  - `concept/hurmat-al-haram-makka` (security of the Sacred Precinct; the two objections and Abduh's answers; Rida's footnote on Hajj in his time)
  - `concept/wujub-al-hajj-fawran-aw-tarakhi` (immediate or deferrable Hajj; perspectives with two sunni entries, holders not named in the text)
  - `concept/al-sabi-fi-al-harb-al-diniyya` (captives and married women, Q. 4:24; three perspectives: majority reading, Hanafi and some Hanbali view, Rida and Abduh's conditions labelled other)
- **Reused, not created (linked in prose or in perspectives):** `practice/hajj`, `place/mecca`, `object/maqam-ibrahim`, `person/rashid-rida`, `person/muhammad-abduh`, `person/ibrahim`, `person/al-hajjaj-ibn-yusuf`, `person/sad-ibn-ubada`, `person/sad-ibn-malik-al-khudri`, `passage/quran-3-97`. `work/tafsir-al-manar` is not yet linked from the new sources (no edge written in this batch).
- **Skipped and why:**
  - No new person record for Ibn Sa'ud (named in Rida's footnote; no record exists and no source beyond Rida was read).
  - No event record for the Hajjaj bombardment of the Ka'ba or the conquest of Mecca: no date is given in the text read, and a dated event needs two sources.
  - No perspectives entry on tawassul (Rida's criticism of seeking intercession through saints, vol. 4, p. 10): a Sunni lead needs a sourced Sunni position beyond Rida's report; left for a later batch.
  - No record for the Imamiyya view on married slave women (vol. 5, p. 5): reported only in one sentence; left as prose.
  - No Qur'an text typed anywhere; verses linked only as `passage/quran-3-97`.
  - Rida's remarks on France (vol. 5, p. 8) are not used.
- **Dates flagged:** the 1924 date in Rida's footnote (vol. 4, p. 9) is the book's own claim and needs a second source before any use. Hijri and other dates are not derived here.
- **Edition:** both volumes are an OCR of a modern printing (editor Ibrahim Shams al-Din; Dar al-Kutub al-Ilmiyya, Beirut). The year is not read in the OCR. Every page number must be checked against the printed copy.
- **Next step:** read vol. 4 from p. 13 (the rest of Q. 3:98 onward to 4:23) and vol. 5 from p. 9 (the rest of Q. 4:25), find a second source for the 1924 date, add a Sunni-frame source for the tawassul entry, and decide on a person record for Ibn Sa'ud only if an edge needs it.
## Tafsir al-Manar, volumes 9 and 10 (library-expansion, draft, 19 Oct 2026)

- **Branch:** `worktree-agent-ae03fbebc05a8aa96` (not pushed to main, not merged). Scope: at most 25 entities; 9 written.
- **Pages covered (OCR markers):** vol. 9: title page and pp. 3 to 11 (Al-A'raf 88 to 93, the Shu'ayb story); pp. 20 to 23 (Al-A'raf 94 to 100, sunan of peoples); pp. 486 to 493 (Al-Anfal opening and 1 to 4, wajal of hearts); pp. 512 to 513 (Al-Anfal 9 to 14, the angels at Badr). Vol. 10: title page and pp. 3 to 5 (Al-Anfal 41, khums and the definitions of ghanima and fay').
- **Entities created (all `status.review: draft`, with provenance):**
  - `source/tafsir-manar-v09` and `source/tafsir-manar-v10` (edition not verified; reliability notes say so; the editor's name is OCR-garbled and not recorded; OCR markers were not checked against page images)
  - `concept/ghanima` (term; Rida's definitions of ghanima, fay', nafl, salab, safi; the timing of the fifth at Badr as he reports it)
  - `concept/khums-al-ghanima` (legal; the first Anfal verse as abrogated or muhkam, with Rida preferring Ibn Zayd's view; `perspectives`)
  - `concept/angels-at-badr` (doctrine; `perspectives`: Rida's view that the angels did not fight, and the reports of angelic fighting he rejects)
  - `concept/rajfa` (term; quake versus cry in the Madyan and Thamud accounts)
  - `concept/sunan-allah-fi-al-umam` (doctrine; remnant of the righteous, religion and worldly good, causes of chastisement)
  - `concept/fath-bayn-al-qawm` (term; judgment, the Ibn Abbas narration and the Yemeni usage as Rida reports them)
  - `concept/wajal-al-qulub` (doctrine; awe versus fear at the remembrance of God, and his reconciliation with Ar-Ra'd 28)
- **Reused by id (linked in prose, not edited):** `person/rashid-rida`, `person/al-tabari`, `person/abdullah-ibn-abbas`, `person/mujahid-ibn-jabr`, `person/ikrima-mawla-ibn-abbas`, `event/battle-of-badr`, `concept/fay`, `concept/tawakkul` (not used), passages `quran-7-78`, `7-89`, `7-91`, `7-96`, `8-1`, `8-2`, `8-9`, `8-10`, `8-12`, `8-14`, `8-41`.
- **Skipped / blocked:**
  - Al-Suddi (the exegete, Ismail ibn Abd al-Rahman) has no record. `person/salim-al-suddi` is a different man (courtier of Umar II) and was not reused. Ibn Zayd and Ibn Kathir have no records either; they are named in plain text.
  - No edges from concepts to passages: the schema allows `revealed_about` only from passage to concept, so Qur'an links are in prose.
  - `concept/ghanima` is also listed as a stub in `data/_stubs.d/muwatta-prose.yaml` (another lane). Not edited here; the validator warns to remove it once that lane reconciles.
  - Ibn Abbas's narration on the word fath is cited as Rida gives it; the chain is not checked.
  - The academic and non-Sunni views on the angels and the abrogation question are not yet added.
  - Nothing on the Shu'ayb story beyond the verses read; no event or person entities created from tafsir alone.
- **Next step:** read vol. 9 from p. 12 to p. 19 and from p. 24 onward (Al-A'raf 101 to 170 and the rest of Al-Anfal 1 to 40), and vol. 10 from p. 6 (Al-Anfal 42 to the Badr accounts, then Al-Tawba). Add the second source for any dated fact (for example the battle dates in the Badr passages), and add the al-Suddi record only when an edge needs it.
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
