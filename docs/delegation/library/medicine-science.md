# Lane `lib-exp-medicine-science`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-medicine-science`; `data/_stubs.d/lib-exp-medicine-science.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | not started |
| 2. Downloaded (filename, source URL, size recorded below) | not started |
| 3. OCR (local, drive only) | not started |
| 4. Distilled into draft entities | not started |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started |

## Batch 1 (draft, branch `lib-exp-medicine-science/canon-batch-1`)

- **Pages covered (OCR markers):** p.1 (title page), pp.2–18 (Book I, Fann 1, Ta'lim 1–5), p.69 (Ta'lim 6 heading), and heading-only checks at pp.77, 158, 197, 232, 543.
- **Entities created (all `status.review: draft`):**
  - `work/al-qanun-fi-al-tibb` (book; ID was already referenced by `person/ibn-sina`, so it is now written)
  - `concept/medicine` (was a stub in `data/_stubs.yaml`; the stub line is removed)
  - `concept/four-elements`, `concept/temperament`, `concept/humours`
  - `source/canon-ibn-sina-print` (the printed copy, edition not verified; `status` only, no provenance block, since a source with a provenance layer needs cited sources)
- **Skipped and why:**
  - The author's front matter and the five-book division with page numbers: not in the OCR. p.1 is the title page only; p.2 opens Book I directly. Book IV and Book V were not located in the headings found so far.
  - Author death date (428 AH) for the work record: not stated in the pages read. The person record `person/ibn-sina` already holds it, sourced to Gutas and al-Dhahabi; the work record carries no date.
  - Organs (Ta'lim 5, p.18), powers and actions (Ta'lim 6, p.69), and the rest of Book I: next batch.
  - No prose for the three concept files beyond the data summaries (matches `concept/madhahib-al-tibb`).
- **Schema or enum needs:** none found for this batch. `source/` kinds and `provenance.layer` values used as the schema allows.

## Duplicates found and skipped

No duplicate for the Canon, Ibn Sina, or the medical concepts in this batch: `grep` over `data/` found `person/ibn-sina` (existing), `concept/madhahib-al-tibb` (different topic, left alone) and `concept/arab-medicine-in-european-schools` (left alone). Pre-check counts (18 Oct 2026) are in the lane document.

## Downloads

None yet.

## First book: al-Qanun fi al-Tibb (Ibn Sina)

- **Source file (local, not in git):** `/Users/ahmedabdelaal/Downloads/القانون في الطب_63329_Foulabook.com_.pdf`, copied to `raw/library/medicine-science/canon-ibn-sina/canon-ibn-sina.pdf` on the harvest drive. 1,161 pages, 6.9 MB, Arabic printed edition. Its own text layer exists but is partly broken, so the whole book is OCR'd with Apple Vision (`--force-ocr`).
- **Edition:** not verified yet (no publisher, date or volume on the title page we have read). Must be checked before the source is marked reviewed.
- **Category:** `medicine-science` is not in the category list of `books.yaml`; it is a harvest folder name only. Founder to confirm.
- **OCR:** started 18 Oct 2026 with `ocr_book.py --force-ocr`, log `logs/ocr-canon-ibn-sina.log`.

## Canon print volumes (user-supplied, 18 Oct 2026)

- Volume 1: https://archive.org/details/alqanun-iiibn-sina1 (raw/library/medicine-science/canon-ibn-sina-print-v1/)
- Volume 2: https://archive.org/details/alqanun-iiibn-sina2 (raw/library/medicine-science/canon-ibn-sina-print-v2/)
- Volume 3: https://archive.org/details/alqanun-iiibn-sina3 (raw/library/medicine-science/canon-ibn-sina-print-v3/)
- Queued for OCR after the current items. The front matter and the five-book division are expected in these volumes; the earlier 1,161-page OCR has none. Edition details come from the printed title pages.
- Source for future downloads: https://www.al-mostafa.com/ (requested by the founder). Not yet checked for licence or terms; not added to any fetch step.

## Batch 1b: al-Khwarizmi, al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala (draft, 18 Oct 2026)

- **Copy:** `unidentified/columbia-aco000196` (Columbia scan, 130 pages, Apple Vision OCR; not in git). The OCR is partly garbled but the title page and the editors' introduction are readable, so the copy was not treated as empty.
- **Edition found:** Cairo, 1939, edited by Ali Mustafa Mosharafa and Muhammad Morsi Ahmad (Faculty of Science, Egyptian University; the preface is dated 1937 in the OCR). The printed title is "kitab al-jabr wal-muqabala"; the longer title in the brief is not confirmed by the OCR.
- **Pages covered (scan markers):** pp.1, 2, 7, 8–9 (partly), 11–12 (editors' introduction). p.13 begins a historical section ("Algebra before al-Khwarizmi") and is not yet read.
- **Entities created (all `status.review: draft`):**
  - `work/al-jabr-wal-muqabala` (book; author `person/al-khwarizmi`, existing record, which keeps the sourced dates; no death year written here)
  - `concept/algebra` (scientific; new)
  - `source/khwarizmi-jabr-cairo-1939` (primary; edition not verified)
  - `content/ar/work/al-jabr-wal-muqabala.md`, `content/ar/concept/algebra.md`
- **Flags:** the editors say their base manuscript was a copy made about five hundred years after the author's death, with copying errors (scan pp.11–12). The text is treated as a late copy, not an autograph.
- **Skipped and why:**
  - Death year of al-Khwarizmi: not in the book, left empty on the work.
  - `person/al-khwarizmi` already exists; not recreated.
- **Next step:** read the mathematics (chapters after p.13) to check statements of method before any claim about content beyond the editors' introduction. Confirm the edition against a second print.

## Batch 2: first batch for the other three books (draft, branch `lib-exp-medicine-science-batch1`, 18 Oct 2026)

- **Pages covered (OCR markers):**
  - al-Razi, *al-Hawi*, vol. 1 (Dar al-Kutub al-Ilmiyya, Beirut): pp.1, 5 (title block, contents of the three parts, start of Juz 1). The volume is 3,945 scan pages; only the front matter was read.
  - Ibn al-Nafis, *Sharh Tashrih al-Qanun*: pp.1 (preface), 7, 9, 15 (headings), 35 (heading and neck vertebrae). The text has 202 pages.
  - al-Biruni, *al-Athar al-Baqiya*: pp.2 (cataloguing page), 3 (opening), 4 (purpose). The 2008 Cairo printing has 448 scan pages; pp.3 and 4 are read.
  - al-Tusi, *Tahrir al-Majisti*: pp.1, 3 (colophon), 4 and 5 (cataloguing). The scan is a British Library manuscript (Add MS 23392), not a printed edition.
- **Entities created (all `status.review: draft`):**
  - `work/al-hawi-fi-al-tibb` (author `person/al-razi-abu-bakr`, existing)
  - `work/sharh-tashrih-al-qanun` (author `person/ibn-al-nafis`, existing)
  - `work/tahrir-al-majisti` (author `person/nasir-al-din-al-tusi`, existing; distinct from `work/al-majisti`, Ptolemy's text)
  - `concept/anatomy` (new; `part_of` `concept/medicine`)
  - Sources: `source/hawi-razi-dar-kutub-ilmiyya`, `source/sharh-tashrih-qanun-print`, `source/athar-baqiya-thaqafa-2008`, `source/tahrir-majisti-bl-add-23392`. Each carries a `reliability_note` that says the edition is not verified (for the Tusi copy: that it is a manuscript and that 956 AH is a copy date).
- **Skipped and why:**
  - `work/al-athar-al-baqiya` already exists (Kashf al-Zunun citation). Not duplicated. The new source `source/athar-baqiya-thaqafa-2008` is not yet linked from it; to be added in a later batch as an append to that record.
  - Al-Razi's death year (printed as 313 in the title block) is not entered: the OCR is unclear and no second source has been checked. Work records carry no dates.
  - No dedication verse is typed; the Qur'an verse at Biruni p.3 is left to `[[passage/...]]` linking in a later batch.
  - The heart, arteries and diaphragm sections (flagged on Nafis p.7) are not read yet; they are the next Nafis batch.
- **Schema or enum needs:** none. `based_on` cannot start from a work (predicate domain), so the Tahrir–Almagest link is in prose only.

## Batch 2 (draft, branch `lib-exp-medicine-science/manazir-maalim-zij-batch-1`)

- **Pages covered (scan markers):**
  - *Kitab al-Manazir*, vol. 1 (Books 1–3, Kuwait 1983, ed. Sabra): pp.1–13 (title, editor's preface, contents). The text of Book 1 itself is not yet read.
  - *al-Zij al-Sabi* (al-Battani, Byblion 2005, ed. Nallino): pp.1–7 (title pages, contents, opening of the chapter list).
- **Entities created (all `status.review: draft`):**
  - `work/kitab-al-manazir`, `person/ibn-al-haytham` (the editor places him in the 5th century AH; no birth or death date in the pages read), `concept/optics`, `source/manazir-sabra-1983`
  - `work/al-zij-al-sabi` (author linked to the existing `person/al-battani`; the existing record is not edited), `concept/astronomy`, `source/zij-sabi-nallino-byblion`
- **Skipped and why:** the al-Battani person record already exists and is not changed in this batch. The Zij's author name varies across the title pages and is noted in the source's reliability note. Ibn al-Haytham's other names (kunya, nisba) are not printed in the pages read, so none are entered. No Qur'an text or honorifics typed.
- **Schema or enum needs:** none.
- **Edition notes:** the Manazir copy is volume 1 only (Books 1–3); the Zij copy's original Nallino edition is not confirmed from this reprint.

## Batch 3: Canon print volumes 1 to 3 (draft, branch `worktree-agent-af5112308d410cab4`, 19 Oct 2026)

- **Pages covered (scan markers):**
  - Vol. 1 (741 scan pages): pp.1–2 (title page, verso), 3–4 (editor's introduction, read for edition only), 9–10 (author's preface and the plan of the five books), 11–35 (Book I, Fann 1 Ta'lim 1–5), 94–95 (Fann 1 Ta'lim 6 opening), 103–104 (Fann 2 Ta'lim 1), 112 (Ta'lim 2), 154 (Fann 2 Ta'lim 3 opening), 200 and 203 (Fann 3), 221 (Fann 3 Ta'lim 2 opening), 267 (Fann 4), 311 and 313 (end of Book I, start of Book II), 728 (end of Book II). Headings were checked with a scan-by-scan search.
  - Vol. 2 (864 scan pages): pp.1–2 (title page, verso), 3 (start of Book III), 6 (Fann 1), 841 (start of a contents list).
  - Vol. 3 (590 scan pages): pp.1–2 (title page, verso), 3 (start of Book IV), 4–5 (preface and Fann 1), 393 (end of Book IV), 395 (start of Book V), 588–590 (last scanned pages).
- **Structure recorded** on the existing `work/al-qanun-fi-al-tibb` (the five books, fanns and page ranges). Batch 1 had wrong page numbers for the fanns and Book II, which pointed to the editor's introduction and to Book I. These are corrected in this batch.
- **Entities created (all `status.review: draft`, provenance with `run: lib-exp-medicine-science-canon-batch-2`):**
  - Sources: `source/canon-ibn-sina-print-v1`, `source/canon-ibn-sina-print-v2`, `source/canon-ibn-sina-print-v3` (edition from each title page: Dar al-Kutub al-Ilmiyya, Beirut, 1st ed. 1420 AH / 1999 CE, notes by Muhammad Amin al-Dannawi; the date rests on one source and is flagged).
  - Concepts (Book I subjects, none existed before, checked by `ls data/concept`): `concept/health`, `concept/disease`, `concept/symptoms-and-signs`, `concept/powers-and-actions`, `concept/regimen-of-health`, `concept/medical-treatment`. Each has `relations: part_of concept/medicine`. No content md for these six; the data summary carries the text, as with the other concepts of this lane.
- **Corrected existing records (reuse, not recreated):** `work/al-qanun-fi-al-tibb` (data and md), `concept/medicine` (data and md), `concept/four-elements`, `concept/temperament`, `concept/humours`. Their citations pointed to scan pages 2 to 13, which are the editor's introduction and the Book I preface. They now point to the Book I pages where the text is (13, 14, 15, 17, 19, 28, 30, 33, 35). `concept/medicine` also had the definition attributed to `sunni-hanafi`; the definition is Ibn Sina's own, so the tradition is now `academic`.
- **Skipped and why:**
  - Ibn Sina's death year: the title page of each volume reads 428 AH (scan p.1). It is not written in any record here: the person record `person/ibn-sina` already holds its own sourced date, and this batch does not add one.
  - The Book I ta'lim 5 (organs, p.36) and the rest of Book I (fanns 2 to 4): read only at heading level. Organs are already covered by `concept/anatomy` (Nafis lane); not duplicated.
  - Book III's end is not located: the text is followed by a contents list from scan p.841. Book V ends at scan p.590 in vol. 3 and its close is not in the scan.
  - The old source `source/canon-ibn-sina-print` (edition unverified, 1,161-page copy from the earlier batch) is not used by any record in this batch and is left as it is. `content/en/work/al-qanun-fi-al-tibb.md` and `content/en/concept/medicine.md` still cite it with the old pages. They are outside this lane's Arabic scope and are not edited here; `content/ur/` is not touched (no-go registry).
  - The ISBN printed on the verso of each volume (2-7451-2617-2) is the same on all three; it is not entered.
- **Schema or enum needs:** none. New class, predicate or enum: none.
- **Flags for the founder:** the three volumes give the edition, but not a catalogue check. The publisher series name in the OCR is partly garbled and is noted in the source records.

## Next step

0. Manazir: read Book 1 of the text (after the contents, scan p.13 on), and the Zij chapter bodies (scan pp.5–7 onward); add entities only where `data/` has none.
1. Canon (Ibn Sina): read Book I, Fann 1 Ta'lim 5 (organs, scan p.36 on) and Fann 2 to 4 in the text (pages not yet read beyond headings), then add only concepts `data/` does not have. Book II (simple drugs from scan p.313) is the next book; its entities need a separate batch.
2. Confirm the edition against a catalogue record or a second copy before any record moves from draft.
3. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
## Batch 4a (draft, branch `agent/microsd-books-b4`, 9 Nov 2026)

- **Manazir Book 1 (Article 1) read:** `ibn-haytham-manazir/book.txt` scan pp. 60–200 = Article 1 «في كيفية الإبصار بالجملة», eight chapters (book-opening survey of the two opposed doctrines — intromission vs the emitted visual cone — and their internal disagreements; inductive method; ~144 propositions in ch. 3 proving rectilinear propagation via holes into darkened rooms, moving starlight, straight shadows, light-strength vs visible source portion, colours accompanying light; ch. 4 afterimages/glare/eye fatigue; ch. 5 eye anatomy; ch. 6 mechanism; ch. 7 tunics as instruments, first the cornea; ch. 8 the conditions of vision). Added an "Article 1" section to `content/{ar,en,ur}/work/kitab-al-manazir.md` citing scan pages. No new entities needed — `work/kitab-al-manazir`, `person/ibn-al-haytham`, `concept/optics`, `invention/camera-obscura`, `invention/haytham-incoming-light-vision` already cover it.
- **Farghani Elements:** identity already resolved by the earlier run (Golius's note: "Ahmad" per Ibn Qifti and the old Latin version = "Muhammad ibn Kathir" of the manuscript, one person; `person/al-farghani` = Muhammad ibn Kathir al-Farghani, Fusul al-thalathin author — the Elements attribution rides on that record per the source's own note). Completed missing translations: en/ur sections appended to `content/{en,ur}/person/al-farghani.md`; new `content/{en,ur}/work/jawami-ilm-al-nujum.md` translating the existing Arabic record. Thin concepts (qiyas-al-ard, ikhtilaf-al-manzar, eclipses, etc.) still lack en/ur prose — flagged for a later batch.
- **Canon next fanns:** not started (Book I Fann 1 Ta'lim 5 organs, scan p.36+; Fann 2–4 headings only).

## Batch 8 (draft, branch `agent/microsd-books-b8`, 9 Nov 2026)

- **Canon Book I, Fann 1, Ta'lim 5 read** (`canon-ibn-sina-print-v1/book.txt` scan pp.36–41): Ibn Sina's definition of the organ (عضو) as a body generated from the first temperament of the humours; the simple/composite division (similar-part vs instrumental organs); the ordered list — bone, cartilage, nerve, sinews/ligaments/'aqib, arteries, veins, membranes, flesh; the accepting/giving organ typology with the physicians–philosophers dispute over heart, brain and liver; the principal organs (heart, brain, liver, plus the generative organs for the species) and the preparatory/effective serving organs; Galen's act/benefit distinction; regeneration from the two seeds vs blood; and strong organs pushing waste to weak neighbours.
- **Entity work (reuse, no new entities):** `concept/anatomy` gains `source/canon-ibn-sina-print-v1` in `sources` and `relations`, an extended trilingual summary, and a new "في القانون: ماهية العضو وأقسامه" section in `content/{ar,en,ur}/concept/anatomy.md` citing pp.36–41. The bones division (pp.42 onward, thirty chapters) is a later batch.
- **books.yaml:** added `canon-ibn-sina-print-v1/v2/v3` and `farghani-elements-astronomy` under `cat: medicine-science` (the Canon volumes are the same work as `canon-ibn-sina`; volume labels are scan copies, not separate works).
- **Skipped:** the bone/joint chapters (pp.42+) not yet read; no new concept created — `concept/anatomy` and `concept/powers-and-actions` cover the material; the edition still awaits a catalogue check before records leave draft.

## Batch 9 (draft, branch `agent/microsd-books-b9`, 9 Nov 2026)

- **Manazir Article 2 opened:** `ibn-haytham-manazir/book.txt` scan pp.198–238 read (title page, chapter plan, chapter 2 ray-line geometry, samples of chapters 3–4). Article 2 «في تفصيل المعاني التي يدركها البصر وعللها وكيفية إدراكها» has four chapters: (1) opening — meanings sight perceives beyond light and colour; (2) distinguishing the ray-lines — the ray as the line from the centre of sight through the eye's humours, the vitreous humour's refracting surface (plane or sphere not centred on sight), images ordered at the vitreous then refracted at that surface, the point on the central ray clearest and most certain; (3) visible objects other than light and colour — meanings perceived by mere sensation, by acquaintance (familiar written words), or by a distinguishing measure (whole greater than part); a repeated meaning comes to be perceived by acquaintance; (4) how each partial meaning is perceived — images of visible objects compounded of partial meanings.
- **Entity work (reuse):** new "المقالة الثانية" sections appended to `content/{ar,en,ur}/work/kitab-al-manazir.md` citing scan pp.198–309. No new entities — Article 2's doctrines ride on the existing work/concept records.
- **Skipped:** Article 2 chapters 3–4 bodies read only at sampled pages (pp.222, 226, 230, 234, 238, 309); Article 3 (errors of sight, pp.340–533) untouched.

- **Manazir Article 3 opened (batch 113):** `ibn-haytham-manazir/book.txt` scan pp. 340–351 read in full. Article 3 «في أغلاط البصر فيما يدركه على استقامة وعللها» (errors of sight in what it perceives straight on, and their causes) has seven chapters. Chapter 1 (pp. 342–343): errors of sight in general, with the examples of distance and size, square and round, sphere and flat, and a moving star or slow walker seen as still. Chapter 2 (pp. 344–351, continues past 351): what must be set out first, namely that sight perceives only through ray-lines, that one object seen by two eyes is one when placed alike and two when not, the equal action of the two eyes, the cone between object and centre of sight, the meeting point of the two ray-lines, and the images of the parts and of separate objects at the common nerve. Added an "Article 3" section to `content/{ar,en,ur}/work/kitab-al-manazir.md` citing scan pages 340–351. No new entities.
- **Resume point:** Article 3 chapter 2 from scan p. 351 (the image coincidence sentence), then chapters 3–7 (pp. 352–533). Article 2 chapters 3–4 bodies (pp. 230–339) remain open from batch 9.
- **Manazir Article 3, chapter 2 completed to p. 358 (batch 114):** scan pp. 351–358 read in full. The two images of one object end at one point of the common nerve and coincide; the centre on the common ray-line; the sharpness of objects on or off the common ray-line; the double images of objects outside it; the test board with three wax figures (pp. 356–358). The description of the test continues beyond p. 358. Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 351–358.
- **Resume point:** the test description from scan p. 358 (the sentence "فإذا أدرك المعتبر هذه الخطوط"), then chapters 3–7 (pp. 359–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, the board test to scan p. 363 (batch 115):** scan pp. 358–363 read in full. The repeated figures on the board; the geometric proof with lettered figures (pp. 359–361, figures and letters left as in the scan); the summary of which objects are seen as one or two (pp. 362–363); the four lines seen at the crossing point and the explanation of the close and apart pairs (pp. 363). Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 358–363. The Arabic text of the proof's letters is not reproduced in the work file.
- **Resume point (batch 115):** scan p. 363 after the paragraph on the eye that covers the apparent widening ("ويظهر ذلك إذا ستر المعتبر"), then chapters 3–7 (pp. 364–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, scan pp. 363–367 (batch 116):** read in full. The widening gap and its cause deferred to the errors chapter; the rule that an object on the common ray-line is seen in its true place and an off-line one nearer to that line; the paper-slip test (pp. 365–367); the conclusions on clarity (pp. 367). The second paper test (lines of text) begins on p. 367. Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 363–367.
- **Resume point (batch 116):** scan p. 367 after "فإن المبصر ... " the second paper test with fine lines of text, then the rest of Article 3 chapter 2 and chapters 3–7 (pp. 368–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, scan pp. 367–371 (batch 117):** read in full. The paper test at the centre and at the sides, tilted and untilted, with one eye and two; the conclusions on facing and tilt (p. 369); the paper placed farther than the board is long and the moved slip (pp. 371–372). Correction (batch 118): the summary opens at the foot of p. 371 and is completed on p. 372; the completion is recorded in batch 118, so nothing is missing. Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 367–371.
- **Resume point (batch 117):** scan p. 371, the summary sentence cut off at the foot of the page ("فيتبين من جميع هذه الاعتبارات"), then Article 3 chapter 2 to its end and chapters 3–7 (pp. 372–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, scan pp. 371–375 (batch 118):** read in full. The summary completed on p. 372; the end of chapter 2 on steep tilt and facing (pp. 372–374); chapter 3 opens with its title and lists the conditions of correct perception (pp. 374–375). Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 371–375.
- **Resume point (batch 118):** scan p. 375, "وتختلف هذه الأبعاد بحسب كل مبصر" then the rest of chapter 3 (pp. 375–376 onward), then chapters 4–7 (pp. 376–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, chapter 3 finished to p. 381 (batch 119):** scan pp. 375–381 read in full. The remaining conditions (position, light, size, density and air, motion, the eye) and the concluding general rule of moderation (pp. 375–381). Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 375–381.
- **Resume point (batch 119):** scan p. 381 ("وإذ قد تبين ذلك فلنسم العرض") the definition of the measure of moderation, then chapters 4–7 (pp. 381–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, the measure of moderation to scan p. 385 (batch 120):** scan pp. 381–384 read in full. The definition of the measure; its dependence on colour, subtle meanings and the other conditions; the examples for distance, time and the eye (pp. 382–384); the statement that each remaining condition has its own measure (p. 384). Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 381–384 only; page 385 has not been read.
- **Resume point (batch 120):** scan p. 385 onward (not yet read), the per-condition measures (the detail for position, light, size, density, air, time and the eye), then chapters 4–7 (pp. 385–533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, the cause of error and chapter 4 opened (batch 121):** scan pp. 385–388 read in full. Chapter 3 ends with the cause of all errors (pp. 385–387). Chapter 4 "في تمييز أغلاط البصر" opens with the three kinds of perception and error, the building of knowledge by repetition, and two examples (p. 388). The knowledge example (Zayd) is cited to p. 388 and its explanation continues beyond that page. Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 385–388.
- **Resume point (batch 121):** scan p. 388, after the Zayd example ("فيظنه زيدًا وليس هو زيدًا ..."), the rest of chapter 4 (pp. 388 onward), then chapters 5–7 (to p. 533), then Article 2 chapters 3–4 (pp. 230–339).
- **Manazir Article 3, chapter 4 to its end and chapter 5 opened (batch 122):** scan pp. 388–391 read in full (p. 391 through the second paragraph of section 2). The Zayd error explained by distance; the moon and the moving cloud as an error of inference (pp. 389–390); the three kinds of error (p. 390); chapter 5 on errors of mere sensation in light and colour (pp. 390–391). Added to `content/{ar,en,ur}/work/kitab-al-manazir.md`, citing scan pages 388–391.
- **Resume point (batch 122):** scan p. 391 after "وقد يعرض أيضاً أن يدرك البصر المبصر المختلف الألوان ذا لون واحد إذا كانت أجزاؤه المختلفة الألوان أو بعضها صغاراً", then the rest of chapter 5 (pp. 391 onward), then chapters 6–7 (to p. 533), then Article 2 chapters 3–4 (pp. 230–339).

