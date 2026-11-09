# Library progress: Abu Nu'aym, Hilyat al-Awliya'

- Harvest folder: `sahaba/hilyat-awliya/hilyah-01` to `-07`, `-09` and `-10` (vol. 8 missing). Dar al-Kutub al-'Ilmiyya, Beirut, 1st ed. 1409/1988.
- Page numbers: in vol. 1 the printed page = PDF page. For the other volumes, citations give PDF pages.
- Worker: Claude Code (OCR-harvest worker K), run ocr-harvest-2026-11-04.

## Source record
- `source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988`: one record for the set; citations take the form `vol/page`.

## Entities (batch 1)
- `work/hilyat-al-awliya` (new): ar/en/ur prose covering the aim, the introduction on the marks of God's friends and on tasawwuf, the arrangement and the edition.
- `concept/tasawwuf`: a section was appended on Abu Nu'aym's etymologies, the three kinds of Sufi speech and his genuine-versus-imitator distinction.
- `person/abu-nuaym-al-asbahani-ahmad`: a "Hilyat al-Awliya'" section was appended.

## Pages read
- Vol. 1 pp. 1–8, 17, 22–24, 28, and the notice headings to p. 124. Title pages and first/last notice numbers of vols 2, 5, 7, 9 and 10.
- Batch 2 (run microsd-books-b10): vol. 2 pp. 357–389 (Malik ibn Dinar, notice 200); vol. 5 pp. 364–391 (Ka'b al-Ahbar, notice 325); vol. 7 pp. 367–395 (Ibrahim ibn Adham, notice 394 — last notice of the volume); vol. 9 pp. 254–280 (Abu Sulayman al-Darani, notice 448); vol. 10 pp. 189–226 (Sahl al-Tustari, notice 546).

## Entities (batch 2)
- `person/ibn-adham-ibrahim`, `person/malik-ibn-dinar-al-khattat`, `person/kab-al-ahbar`, `person/abu-sulayman-al-darani`, `person/sahl-al-tustari`: each gained a trilingual "In Hilyat al-Awliya" section citing `vol/page` (PDF pages), and the source record was added to each `sources` list.
- Identity resolution: Malik ibn Dinar the ascetic IS `person/malik-ibn-dinar-al-khattat` — the Fihrist entry (mushaf copyist for hire, d. 130 AH, kunyat Abu Yahya, mawla of a woman of Banu Sama) matches the vol. 2 notice 200 ("أبو يحي مالك بن دينار"). The slug keeps the descriptive `al-khattat`; no duplicate record needed.
- Ahmad ibn Abi al-Hawari remains without a record — still a lead.

## Not done / leads
- The notices themselves (about 600) are not mined; ~595 remain after batch 2.
- `concept/wali` and `concept/karamat-al-awliya` could take a section from the introduction (vol. 1 pp. 4–17).
- Next high-value notices still unmined include Ahmad ibn Abi al-Hawari (vol. 10, notice 457), Sufyan al-Thawri (end of vol. 7, notice ~390s per vol. 7 index), and the vol. 9–10 Sufi shaykhs.
