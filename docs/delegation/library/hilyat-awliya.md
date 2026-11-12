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

## Batch 3 (run microsd-books-b11)
- `concept/wali` and `concept/karamat-al-awliya`: trilingual sections appended on the introduction's "neat" (نعوت) of the friends of God and its karamat reports — the hadith qudsi on harming a wali (1/4–5), the groups listed pp. 5–17, Dhu al-Nun's description of the elite pp. 13–15 — cited `1/<page>` (vol. 1 printed = PDF page). Hilyat source added to both `sources` lists.
- Pages read: vol. 1 pp. 4–17 in full.

## Batch 4 (run microsd-books-b12)
- `person/ahmad-ibn-abi-al-hawari`: trilingual "In Hilyat al-Awliya" section appended — vol. 10, notice 457, PDF pp.5–41 read (the books-thrown-into-the-sea stories, the Jurayj exchange, the traveller's stations, marks of love and contentment). Record already existed (Sifat al-Safwa provenance, status published); hilyat source added to `sources`.

## Batch 5 (run microsd-books-b13)
- `person/sufyan-al-thawri`: trilingual "In Hilyat al-Awliya" section appended — notice 387 spans vol. 6 pp.356-393 + vol. 7 pp.3-144 ("بقية ترجة (٤)"). Mined: opening portrait, testimony of Ibn al-Mubarak/Shu'ba/Sufyan ibn Uyayna, the letter to Ubbad ibn Abbad (6/376-377), the Basra flight and lineage-adjuration story (7/4-5), Umm Hassan al-Asadiyya (7/9-10), zuhd definition and Abu Hanifa's death (7/16), fainting at the Kaaba and tears at al-Fatiha (7/17), imamate ordering and al-Mahdi (7/31), deathbed purse and grave visitor (7/62), Abu Nu'aym's closing "رواياته كالبحر" (7/125). Record already existed with rich non-Hilyat sources; hilyat source added to `sources`.

## Not done / leads
- The notices themselves (about 600) are not mined; ~588 remain after batch 5.
- Next high-value notices still unmined: the vol. 9–10 Sufi shaykhs (e.g. continuing from Ahmad ibn Abi al-Hawari vol.10 notice 457 onward, Sahl al-Tustari notice 546 already partially mined), and vol. 7's remaining notices 388–391 (Shu'ba, Masmar ibn Kaddam, Sufyan ibn Uyayna, al-Layth ibn Sa'd — all hadith imams, possibly better left to hadith lanes).

## Batch 6 (run microsd-books-b14, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 33–44 and 366–376 (printed page = PDF page in vol. 10).
- `person/bayazid-al-bistami` (notice 458, 10/33–42): the uncommitted draft left by the previous session was checked against the scan and rewritten. It had cite keys corrupted with an Arabic letter, a reversed meaning ("He who created it is watching you"), and near-verbatim quotation throughout; the new section is in the museum's own words with page-level citations, and adds Abu Nu'aym's note that a hadith was assembled and attached to Abu Yazid by Abu al-Fath ibn al-Himsi (10/41).
- `person/al-shibli` (notice 646, 10/366–375) and `person/ibn-al-arabi-ahmad` (notice 647, 10/375–376): trilingual sections appended; Hilyat source added.
- New draft records: `person/ahmad-ibn-khidruya` (459, 10/42–43), `person/ibrahim-al-harawi-sitanba` (460, 10/43–44), `person/abu-amr-al-zajjaji` (648, 10/376). No faith/tradition value (dec-20261112-237). The nickname of notice 460 is garbled in the OCR ("إستلبه", "بستذبه"); it is read as ستنبة.
- Not mined, short notices seen on these pages: 461 Dawud al-Balkhi (10/44), 644 Ali ibn Abd al-Hamid al-Ghada'iri (10/366), 645 Sa'id ibn Abd al-Aziz al-Halabi (10/366), 649 Muhammad ibn Ulayyan al-Nasawi (10/376) — leads for a later batch.
- Qur'an verses quoted inside the notices are described, never typed.

## Batch 7 (run microsd-books-b15, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 44–45, 116–122, 291–296, 366, 377, 385–389.
- Enriched: `person/sari-al-saqati` (notice 469, read 10/116–122; pp. 123–128 of the notice NOT yet mined), `person/amr-ibn-uthman-al-makki` (573, 10/291–296), `person/ibn-khafif` (660, 10/385–387), `work/hilyat-al-awliya` (new section on the three method statements of vol. 10: 10/41–42, 10/375, 10/387–389).
- New draft records: `person/dawud-al-balkhi` (461, 10/44–45), `person/ali-ibn-abd-al-hamid-al-ghadairi` (644, 10/366 with 10/117 and 10/121), `person/abu-bakr-ibn-abi-sadan` (650, 10/377). No faith/tradition value; Ibn Abi Sa'dan's Shafi'i affiliation is stated in prose with its page, not as a `traditions` value.
- Homonyms kept apart: notice 645 Sa'id ibn Abd al-Aziz al-Halabi (companion of al-Sari, 10/366) is NOT `person/said-ibn-abd-al-aziz-al-tanukhi`; no record written for him yet (lead).

## Batch 8 (run microsd-books-b16, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 310–339 (in vol. 9 the citations give PDF pages; on these pages printed = PDF).
- Enriched: `person/mansur-ibn-ammar` (notice 455, 9/325–331), `person/dhu-al-nun-al-misri` (notice 456, read 9/331–339 only; the notice runs to about p. 395 and the rest is NOT yet mined).
- New draft records: `person/abu-abd-allah-al-saji` (450, 9/310–317), `person/ali-ibn-bakkar` (452, 9/317–322), `person/al-qasim-ibn-uthman-al-jui` (453, 9/322–325), `person/mada-ibn-isa` (454, 9/324–325).
- OCR cautions recorded in the prose: the year in Ali ibn Bakkar's notice (9/318) reads "سنة ... ومائتين" with the units word garbled, so no death or floruit date was entered; one narrator's name on 9/318 is unreadable and is given as "a narrator".
- Not mined on these pages: notice 449 Ahmad ibn Asim al-Antaki (9/280–310) and notice 451 (heading not legible in the OCR) — leads.

## Batch 9 (run microsd-books-b17, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 45–51, 296–302, 376.
- Enriched: `person/ruwaym-ibn-ahmad` (notice 574, 10/296–302).
- New draft records: `person/abu-turab-al-nakhshabi` (462, 10/45–51; the notice gives no personal name and no death year, so none was entered), `person/muhammad-ibn-ulayyan-al-nasawi` (649, 10/376).
- Next in vol. 10: 463 Yahya ibn Mu'adh (from 10/51), 465 al-Muhasibi (10/73–110), the rest of 469 al-Sari (10/123–128), 575 Ibn Ata (from 10/302), 546 Sahl al-Tustari remainder, the Isfahan ascetics 661 onward (10/389–).
