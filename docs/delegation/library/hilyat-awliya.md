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

## Batch 10 (run microsd-books-b18, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 340–343. Enriched `person/dhu-al-nun-al-misri` (notice 456, continued). The notice continues from 9/344 onward and is not finished.

## Batch 11 (run microsd-books-b19, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 280–285. New draft `person/ahmad-ibn-asim-al-antaki` (449, 9/280–284). No death date entered: the notice's opening pages give none, and none was taken from elsewhere. Notice continues to about 9/310 (not yet mined). Notice 451 (heading illegible) still to identify.

## Batch 12 (run microsd-books-b20, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 285–296. Enriched `person/ahmad-ibn-asim-al-antaki` (449, to 9/296). Notice continues to about 9/309 (not yet mined: 9/297–309).

## Batch 13 (run microsd-books-b21, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 297–309. Notice 449 ends at 9/297 (closing poem, not transcribed). New draft `person/muhammad-ibn-al-mubarak-al-suri` (451, 9/298–309): the dialogue is attributed to Abu Nu'aym's grandfather's written record, the sayings to Muhammad ibn Asbagh ibn al-Faraj. The chains on 9/304–309 are described only, not quoted.
- Identity: 451 is Muhammad ibn al-Mubarak al-Suri, not a separate heading; no existing record for him was found (searched data/person).

## Batch 14 (run microsd-books-b22, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 344–349. Enriched `person/dhu-al-nun-al-misri` (456, to 9/349). Unclear OCR at 9/344 (the woman at the crops) rendered only in its clearest sense. Notice continues from 9/350.

## Batch 15 (run microsd-books-b23, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 350–355. Enriched `person/dhu-al-nun-al-misri` (456, to 9/355). A Qur'an verse on 9/353 is referred to, not quoted (Qur'an text is never typed). Notice continues from 9/356.

## Batch 16 (run microsd-books-b24, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 356–361. Enriched `person/dhu-al-nun-al-misri` (456, to 9/361). Notice continues from 9/362.

## Batch 17 (run microsd-books-b25, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 362–368. Enriched `person/dhu-al-nun-al-misri` (456, to 9/368). The closing supplication on 9/368 is described, not quoted (Qur'an text is never typed). Notice continues from 9/369.

## Batch 18 (run microsd-books-b26, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 369–375. Enriched `person/dhu-al-nun-al-misri` (456, to 9/375). Notice continues from 9/376.

## Batch 19 (run microsd-books-b27, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 376–382. Enriched `person/dhu-al-nun-al-misri` (456, to 9/382). Notice continues from 9/383.

## Batch 20 (run microsd-books-b28, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 383–389. Enriched `person/dhu-al-nun-al-misri` (456, to 9/389). The notice runs to about 9/395; 9/390–395 not yet read.

## Batch 21 (run microsd-books-b29, Claude Code / claude-fable-5-2)
- Pages read: vol. 9 pp. 390–395. Enriched `person/dhu-al-nun-al-misri`: notice 456 complete at about 9/395. The cosmic poem on 9/390–391 is described, not quoted. The hadith referred to on 9/394 is described, not quoted.

## Batch 22 (run microsd-books-b30, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 51–55. Enriched `person/yahya-ibn-muadh-al-razi` (463, to 10/55); Hilyat source added to the record's sources. Notice continues from 10/56.

## Batch 23 (run microsd-books-b31, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 56–61. Enriched `person/yahya-ibn-muadh-al-razi` (463, to 10/61). Notice continues from 10/62 to about 72.

## Batch 24 (run microsd-books-b32, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 62–67. Enriched `person/yahya-ibn-muadh-al-razi` (463, to 10/67). Notice continues from 10/68 to about 72.

## Batch 25 (run microsd-books-b33, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 68–70. Enriched `person/yahya-ibn-muadh-al-razi`: notice 463 complete at about 10/70. A new notice heading (OCR "٣٦٤ سعيد بن العباس الرازي", i.e. almost certainly notice 464, Sa'id ibn al-Abbas al-Razi) begins on 10/70. It is not in the queue and needs a separate lead; 10/71–72 belong to it.
- Correction to the queue: notice 463 ends at about 10/70, not 72.

## Batch 26 (run microsd-books-b34, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 70–72. New draft `person/said-ibn-al-abbas-al-razi` (464, 10/70–72). Identity: notice 464 is a real separate notice; its OCR heading number is 364, but the sequence (463 Yahya, 464 here, 465 al-Harith al-Muhasibi on 10/73) fixes it as 464. No existing record for this Sa'id was found in data/person. No death date entered: the notice gives none on these pages.
- Notice 465 al-Harith al-Muhasibi begins on 10/73 and runs to about 110.

## Batch 27 (run microsd-books-b35, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 73–77. Enriched `person/al-harith-al-muhasibi` (465, part one to 10/77); Hilyat source added to the record's sources. Notice continues from 10/78 to about 110.

## Batch 28 (run microsd-books-b36, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 78–82. Enriched `person/al-harith-al-muhasibi` (465, to 10/82). Notice continues from 10/83. The Qur'anic verse on 10/82 is referred to, not quoted.

## Batch 29 (run microsd-books-b37, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 83–88 (page 87 and the end of 88 read in full after a first draft had ellipses; the regenerated section was checked for ellipses and honorifics before committing). Enriched `person/al-harith-al-muhasibi` (465, to 10/88). Notice continues from 10/89 to about 110. The honorific in the source on 10/83 and 10/88 is not typed.

## Batch 30 (run microsd-books-b38, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 89–94. Enriched `person/al-harith-al-muhasibi` (465, to 10/94). Notice continues from 10/95 to about 110. The hadith on humility on 10/90 is described, not quoted.

## Batch 31 (run microsd-books-b39, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 95–100 (full text read before writing; the draft was rewritten in full after two earlier drafts had ellipses, and the regenerated output was checked for ellipses, honorifics and stray Latin text). Enriched `person/al-harith-al-muhasibi` (465, to 10/100). Notice continues from 10/101 to about 110. The Qur'anic verse cited on 10/99 is referred to, not quoted; the hadith on 10/99 is described.

## Batch 32 (run microsd-books-b40, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 101–110. Enriched `person/al-harith-al-muhasibi` (465, complete at 10/110). Notice 466 (Ali al-Jurjani) begins on 10/110 and is not part of this entry. Qur'anic verses cited on 10/102–103 and 10/105 are referred to, not quoted. The text says "four stations" for reckoning and names three; the entry states only the three named.

## Batch 33 (run microsd-books-b41, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 110–112 (notice 466 in full; notice 467 on page 112). New drafts: `person/ali-al-jurjani-al-mutaabbid` (466, 10/110–112; distinct from `person/al-sharif-al-jurjani-ali-ibn-muhammad` and `person/al-jurjani-ali-ibn-abd-al-aziz`, decision dec-20261112-264), `person/abu-hashim-fadim` (467, 10/112). Notice 468 (Sharih ibn Yunus) begins on 10/113 and is next.
- Notice order: 466 and 467 done before 469 (per the coordinator's instruction).
- Engine run note: the batch run also processed another lane's inbox question (omar-abdelkafy, Assabile lecture series); its generated record was removed from the working tree and not committed; that question remains in the inbox for its owner.

## Exclusions and garbled readings (batch 41)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 466 | 112 | first word of the list of God's gifts | smudged in the scan | read as likely "تعظيم" and flagged in the prose |
| 466 | 111 | a place-name in Ali's instruction on where to live | garbled in the scan | omitted; not transcribed |
| 466 | 111 | the closing clause "I do not know whether he entered the sea" | unclear in the scan | omitted |
| 466 | 110–112 | Qur'anic verses cited | Qur'an text never typed | referred to only |
| 467 | 112 | the chain of the Bedouin anecdote | the name of the narrator's father is not clear in the scan | described as "his father", no name given |

## Batch 34 (run microsd-books-b42, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 113–115 (full text read before writing). New draft `person/shurayh-ibn-yunus` (468, complete at 10/115). The death year 235 AH is taken from 10/113 ("خمس وثلاثين ومائتين"). Qur'anic surahs referred to, not quoted.

## Exclusions and garbled readings (batch 42)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 468 | 113 | the reporter's name in the dream (given in the scan as "انكشاب") | smudged in the scan | described as "Ahmad ibn al-Dahhak" with the surname omitted |
| 468 | 113 | Shurayh's words in the dream "رحال سر بسر" | garbled in the scan | omitted |
| 468 | 115 | the object Abd al-Muttalib was first told to dig up ("برة") | unclear in the scan | described as "a thing (the word is garbled in the scan)" |
| 468 | 113–115 | Qur'anic surahs cited | Qur'an text never typed | referred to only |

## Batch 35 (run microsd-books-b43, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 116–128 (the opening 116–122 was already in the record from batch 15; read again in full here). Enriched `person/sari-al-saqati` (469, to 10/128). Notice 470 (Ibrahim ibn Shammas) begins on 10/128 and is next. Ahmad ibn Hanbal and Bishr ibn al-Harith are placed in Baghdad, the city of the notice.

## Exclusions and garbled readings (batch 43)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 469 | 126 | the word after "رجل" (given as "لديرانى" in the scan) | unclear | read as "a monk of the monasteries (Dayrani)" with the reading flagged as uncertain in the note |
| 469 | 125 | a hadith on the Friday prayer, the ending of the anecdote | cut in the scan | described only as far as the text runs |

## Batch 36 (run microsd-books-b44, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 128–130 (full text read before writing). New drafts: `person/ibrahim-ibn-shammas` (470, 10/128), `person/muhammad-ibn-amr-al-maghribi` (471, 10/128–130). The earlier draft of 471 had an unfinished sentence and a garbled reporter name; both were rewritten before commit, and the Moses and Aisha hadiths on 10/129–130 were added.

## Exclusions and garbled readings (batch 44)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 471 | 128 | the reporter's name in the chain ("أبو د… بن حيان") | smudged in the scan | not named; the chain is not attributed |
| 471 | 128 | the sentence after "أكلتين من غير تكلف" in Ramadan | cut in the scan | not recorded |
| 471 | 129–130 | Qur'anic verses cited | Qur'an text never typed | none quoted; the Moses and Aisha hadiths are described |

## Batch 37 (run microsd-books-b45, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 130–131 (full text read before writing). New drafts: person/bishr-al-tabari (472, 10/130), person/khuzayma-al-abid (473, 10/130-131), person/qadim-al-daylami (474, 10/131). Notice 475 (Ahmad ibn al-Ghamr) begins on 10/131 and is next.

## Exclusions and garbled readings (batch 45)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 473 | 130 | the nisba in the heading (given in the scan as "إصرى") | smudged in the scan | not recorded; the record gives no place |

## Batch 38 (run microsd-books-b46, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 131–133 (full text read before writing). New drafts: person/ahmad-ibn-al-ghamr (475, 10/131–132), person/bishr-ibn-bashshar-al-mujashi (476, 10/132–133), person/mujahid-al-sufi (477, 10/133). Notice 478 (Abu al-Abyad) begins on 10/133 and is next.
- Earlier drafts of 475 contained ellipses; they were rewritten before commit, and the regenerated output was checked for ellipses and honorifics.

## Exclusions and garbled readings (batch 46)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 475 | 132 | Ahmad's answer on food ("بذمن أبذره من بذر اللطيف الخير") | garbled in the scan | not recorded; the prose says so |
| 476 | 132 | some letters of the heading (the nisba's last letters) | smudged in the scan | the nisba given as read on 10/133 |
| 477 | 133 | the word read as "الدماء" in Mujahid's saying | smudged; likely "الدعاء" | the record renders it as supplication, the likely reading; the prose does not flag this reading, a gap to fix in revision |
| 477 | 133 | a clause "ومانق الفقر" | garbled in the scan | omitted |

## Batch 39 (run microsd-books-b47, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 133–134 (full text read before writing). New drafts: person/abu-al-abyad (478, 10/133–134), person/ahmad-al-maymuni (479, 10/134), person/ahmad-al-mawsili (480, 10/134), person/arif-al-yamani (481, 10/134). Notice 482 (Arfajah al-Kufi) begins on 10/135 and is next.
- An earlier draft of 479 ended the hadith in an ellipsis; it was completed from the scan before commit.

## Exclusions and garbled readings (batch 47)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 478 | 134 | the last sentence of Abu al-Abyad's letter after the word "أسود" | cut in the scan (the next heading follows on the same line) | not completed; the note in the prose says so |

## Batch 40 (run microsd-books-b48, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 135–136 (full text read before writing). New drafts: person/arfajah-al-kufi (482, 10/135), person/amr-ibn-jarir-al-bajali (483, 10/135), person/muhammad-ibn-abi-al-qasim-al-hashimi (484, 10/135–136). Notice 485 (Sabba' al-Mawsili) begins on 10/136 and is next.

## Exclusions and garbled readings (batch 48)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 482 | 135 | the mother's dream after "لِمَ أذنتِ لإمامنا الليلة" | cut in the scan; the page ends there | the account stops at the cut; the note in the prose says so |
| 483 | 135 | the Qur'anic verse behind the voice | Qur'an text never typed | referred to by its sense only |

## Batch 41 (run microsd-books-b49, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 136 (full text read before writing). New drafts: person/sabba-al-mawsili (485, 10/136), person/muhammad-ibn-sabba-al-numayri (486, 10/136). Notice 487 (Miskin al-Sufi) begins on 10/136 and is next.

## Exclusions and garbled readings (batch 49)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 485 | 136 | the last word of Mada's question and answer, read in the scan as "الأأس" | unclear in the scan; "الأنس" (intimacy) fits the answer | given as "intimacy"; the prose says the word is unclear in the scan |

## Batch 50 (run microsd-books-b50, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 136–137 (full text read before writing). New drafts: person/miskin-al-sufi (487, 10/136–137), person/abu-ayyub-mawla-bani-hashim (488, 10/137). Notice 489 (Abu Abd Allah al-Barani) begins on 10/137 and continues onto 10/138; it is next.
- An early draft of 488 rendered the saying on the lamps of admonition more freely than the scan allows; it was corrected before commit, and the regenerated output was checked for ellipses and honorifics.

## Exclusions and garbled readings (batch 50)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 488 | 137 | the bracketed clause "ومن أنار اللّٰه قلبه بضوء مصابيح العبر..." | the edition marks it as an addition from another manuscript (footnote "زيادة من مغ") and the scan is unclear | not rendered; the prose says so |
| 488 | 137 | the sentence after "ومن لم يملها لم تطفأ مصابيح عبره" | unclear in the scan ("يملها") | not rendered; the prose says so |

## Batch 51 (run microsd-books-b51, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 137–138 (full text read before writing). New draft: person/abu-abd-allah-al-barani (489, 10/137–138). Notice 490 (Ahmad ibn Musa al-Thaqafi, with a poem) begins on 10/138 and is next.

## Exclusions and garbled readings (batch 51)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 489 | 138 | the transmitter's name after "قال حدثني" ("حكيم بن جمة" in the scan) | unclear in the scan | given as the context reads it; the prose says so |

## Batch 52 (run microsd-books-b52, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 138 (full text read before writing). New draft: person/ahmad-ibn-musa-al-thaqafi (490, 10/138). Notice 491 (Abu Mahriz al-Tufawi) begins on 10/138 and is next.

## Exclusions and garbled readings (batch 52)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 490 | 138 | the verses on the fool, the palace and the slave-women | several words garbled in the scan ("بدافوق السرير", "وادرما هي") | the verses are described, not quoted; garbled words are not given |

## Batch 53 (run microsd-books-b53, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 138–139 (full text read before writing). New draft: person/abu-mahriz-al-tufawi (491, 10/138–139). Notice 492 begins on 10/139 and is next.

## Exclusions and garbled readings (batch 53)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 491 | 138 | the word after "تشمر في" ("المبددة" in the scan) | unclear in the scan; "المجاهدة" (striving) is the likely reading | given as striving; the prose does not flag it, a gap to fix in revision |
| 491 | 138 | "ولحق المتقدمين في الوفادة" | "الوفادة" unclear in the scan | rendered in the sense of the earlier generation; the prose notes nothing further |
| 491 | 138 | the opening "لا بان للأكياس" | read as "لا بأن" (it is evident) | given as read; the sense is the discerning's highest station |

## Batch 54 (run microsd-books-b54, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 139–140 (full text read before writing). New draft: person/khaythama-al-ajli (493, 10/139). Correction to the batch 53 note: no notice 492 heading appears in the OCR of pages 138–140. The OCR runs from 491 (Abu Mahriz al-Tufawi) straight to a heading printed "493". No record was made for 492; it needs checking against the page image before anything is written for it.
- Page 139 carries two headings printed "493": Khaythama al-Ajli (first) and Hasan al-Hafari (second). The second is most likely notice 494 misprinted; Hazim al-Hanafi (printed 494) and Qays ibn al-Sakan (printed 495) and al-Hakam ibn Aban (printed 496) follow on page 140 and in the same sequence. Their printed numbers are kept until the page image confirms the numbering. Hasan al-Hafari is the next notice to read in full.

## Exclusions and garbled readings (batch 54)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 493 | 139 | the opening of the notice ("نبه صلى خدع الماجلة") | garbled in the scan; "صلى" is not a word here | the sense (renounced the world once its deception was clear) is given; the garbled words are not |
| 493 | 139 | words inside the verses | unclear in the scan | not given; the prose says so |
| 492 | 139 | the missing heading | no heading in the OCR | no record; see the correction above |

## Batch 55 (run microsd-books-b55, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 139–140 (full text read before writing). New draft: person/hasan-al-hafari (printed 493, by sequence 494; 10/139–140). Notice 494 by sequence was Hasan; the next printed heading is "٤٩٤ - حازم الحنف" on 10/140 (Hazim al-Hanafi, printed 494, by sequence 495), then Qays ibn al-Sakan (printed 495) and al-Hakam ibn Aban (printed 496).
- Numbering: the printed numbers now run one behind the sequence from notice 493 onward. The library and the prose keep the printed numbers and note the sequence number; whether to renumber is for the coordinator to decide. The page image has not been checked for this.

## Exclusions and garbled readings (batch 55)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 493 (printed) | 139 | the bracketed name "إبراهيم بن الجنيد" and its footnote "زيادة من مغ" | the edition marks it as an addition from another manuscript | the chain is given without the bracketed name; the prose does not render the bracket |
| 493 (printed) | 139 | "أمد عوانس مؤمني الجن" | "عوانس" unclear in the scan | rendered loosely as a support to the believing jinn; flagged for revision |
| 493 (printed) | 139 | the nisba "الحفري" and the mosque's name | read as in the scan | kept as written |

## Batch 56 (run microsd-books-b56, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 140–141 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/hazim-al-hanafi (printed 494, sequence 495, 10/140), person/qays-ibn-al-sakan (printed 495, sequence 496, 10/140), person/al-hakam-ibn-aban (printed 496, sequence 497, 10/140–141). The scan of 496 breaks off at the foot of page 141 and the notice's remaining text is not in the OCR; the prose says so. Notice 498 (Abu Karima al-Abdi, printed 498) begins on page 141 and is next; it is numbered 498 in print, so the sequence would be 499 unless the printed series is renumbered.
- Numbering: the printed series has run one behind the sequence since the second heading 493. Kept as printed here, as the coordinator directed; the page image has not been checked.

## Exclusions and garbled readings (batch 56)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 494 (printed) | 140 | "رأيته عندسليم" | the words run together in the scan | read as "عند سليم" |
| 494 (printed) | 140 | the saying on the bleeding head | the report gives no further explanation of the practice | the report is stated as it is; no reason is supplied |
| 495 (printed) | 140 | the words opening the notice ("جيس نفسه") | garbled in the scan | the sense (held himself and tongue as a prison) is given; the words are not |
| 495 (printed) | 140 | the narrator "أبو يل الأشعري" | the name is unclear in the scan (possibly a different name) | left as read; a gap to verify against the page image |
| 496 (printed) | 140–141 | the place "أهل المن" and the nisba in "أهل عوف" | unclear in the scan | rendered as in the report, with the place name not identified |
| 496 (printed) | 141 | the notice's text after "أسبح الله مع الحيتان" | the scan breaks off at the foot of page 141 | the account stops at the cut; the prose says so |

## Batch 57 (run microsd-books-b57, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 141–142 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/abu-karima-al-abdi (printed 498, sequence 499, 10/141–142), person/ali-ibn-thabit (printed 499, sequence 500, 10/142), person/sulayman-ibn-hayyan-al-ahmar (printed 500, sequence 501, 10/142). Printed 501 (Muhammad ibn Mu'awiya al-Sufi, with a story of a wise man among young men on a meadow) begins on 10/142 and is next.
- Numbering: the printed series remains one behind the sequence. Kept as printed here; the page image has not been checked.

## Exclusions and garbled readings (batch 57)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 498 (printed) | 141 | the name of the chain's first authority ("نريمة ..") | garbled in the scan; the context reads it as Abu Karima | the name is given as Abu Karima; the scan's own note of a break is not reproduced |
| 498 (printed) | 141 | "المبدي" in the opening line | the nisba is read as "العبدي" | given as al-Abdi |
| 499 (printed) | 142 | the word after "الريات" | unclear in the scan | not given |
| 499 (printed) | 142 | "كلا العمرين" | read as "both lives"; the sense is uncertain | rendered as "both lives", flagged for revision |
| 500 (printed) | 142 | the transmitter named after "حجاج بن" | cut in the scan | not given |

## Batch 58 (run microsd-books-b58, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 142–143 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/muhammad-ibn-muawiya-al-sufi (printed 501, sequence 502, 10/142–143), person/mughith-al-aswad (printed 502, sequence 503, 10/143), person/muhammad-ibn-salih-al-taymi (printed 503, sequence 504, 10/143). Printed 504 (Ali ibn al-Hasan ibn Musa, a learned man who was a narrator of the Hakam) begins on 10/143 and is next.
- The verse that Muhammad ibn Salih's chain recites is referred to by its sense only; the Qur'an text is never typed.
- Numbering: the printed series remains one behind the sequence. Kept as printed here; the page image has not been checked.

## Exclusions and garbled readings (batch 58)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 501 (printed) | 142 | the names in the chain ("# بن معاوية", "عبدالله بن # بن سفيان", "# بن العباس بن #") | the names are garbled in the scan | not given; the prose says some names are unclear |
| 502 (printed) | 143 | the chain's named authority ("حدثني شيخ من قريش") | the sheikh is unnamed in the text | given as "a man of the Quraysh", as the text reads |
| 503 (printed) | 143 | the Qur'anic phrase in the chain | the Qur'an text is never typed | referred to by its sense only |
| 503 (printed) | 143 | "موسومًا" and "رجم الاحتجاب" | read as in the scan; the sense is uncertain | rendered loosely, flagged for revision |

## Batch 59 (run microsd-books-b59, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 143–144 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/ali-ibn-al-hasan-ibn-musa (printed 504, sequence 505, 10/143–144), person/khattab-al-abid (printed 505, sequence 506, 10/144), person/abu-jafar-al-mahwali (printed 506, sequence 507, 10/144). Printed 507 (Umar al-Sufi, who crossed the deserts alone and apologised to his master in tears) begins at the foot of 10/144 and is next.
- Numbering: the printed series remains one behind the sequence. Kept as printed here; the page image has not been checked.

## Exclusions and garbled readings (batch 59)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 504 (printed) | 143 | the chain's wording before the saying | garbled in the scan | the saying is given; the chain names are not |
| 505 (printed) | 144 | "فيجىً إخوانه" | the verb is unclear in the scan; "فيلقى" (meets) is the likely reading | read as "meets"; the prose gives the reading as read |
| 505 (printed) | 144 | a word in the report | unclear in the scan | not given |
| 506 (printed) | 144 | the names in the chain ("حمدين احد بن ممر", "على ابن أبى مريم") | garbled in the scan | the names as read are not reproduced in the prose beyond the two clearest |

## Batch 60 (run microsd-books-b60, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 144–145 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/umar-al-sufi (printed 507, sequence 508, 10/144–145), person/abbas-al-majnun (printed 508, sequence 509, 10/145). Printed 509 (Shaddad al-Majdhum, a leper worshipper) begins on 10/145 and is next.
- The poem in the notice of 508 is described in prose, not quoted. Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 60)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 507 (printed) | 145 | the names in the chain ("محمد بن أحمد", "عبد الله بن عل", "ل بن إدريس") | garbled in the scan | not given; the prose says so |
| 508 (printed) | 145 | "مفتقة الأكمام" and "الشوع" | "الشوع" read as "الشعر" (hair cloth) | the reading given in the prose; flagged for revision |
| 508 (printed) | 145 | the names in the chain ("محمد بن يوسف البناء", "إبراهيم الهروي") | garbled in the scan | the names as read are not reproduced beyond the two clearest |
| 508 (printed) | 145 | a word in the description of the man | unclear in the scan | not given |

## Batch 61 (run microsd-books-b61, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 145–146 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/shaddad-al-majdhum (printed 509, sequence 510, 10/145–146), person/abu-said-al-baraqai (printed 510, sequence 511, 10/146). Printed 511 (Abu Hashim al-Karim, who gives to the needy and to whom people give from a good opinion of him) begins on 10/146 and is next.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 61)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 509 (printed) | 146 | the names in the chain ("سهل بن ماصم", "هل بن ميينة") | garbled in the scan | not given; the prose says so |
| 510 (printed) | 146 | "الطلاوة" | read as sweetness, delight; the sense is clear from the saying | rendered as sweetness |
| 510 (printed) | 146 | the names "عبيد الله بن زحر", "صالح المري" | legible, given as read | no further flag |

## Batch 62 (run microsd-books-b62, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 146–147 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/abu-hashim-al-karim (printed 511, sequence 512, 10/146–147), person/masud-ibn-al-harith-al-jahmi (printed 512, sequence 513, 10/147). Printed 513 (Zuhayr al-Babi, on patience and certainty, with a story of Zuhayr and the blind reader) begins on 10/147 and continues onto 10/148; it is next.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 62)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 511 (printed) | 146 | most names in the chain (before "قال أبو هاشم") | garbled in the scan | not given; the prose says so |
| 511 (printed) | 146 | "فأولئك أولئك" | the repetition is in the scan; the sense is clear | given as the saying reads |
| 512 (printed) | 147 | "أخا خالد" | read as the brother of Khalid, who is not otherwise named | given as read; flagged for revision |
| 512 (printed) | 147 | the names of the chain ("إبراهيم بن محمد بن يحي", "سليمان بن موسى") | legible but some letters broken | the names given as read, the rest omitted |

## Batch 63 (run microsd-books-b63, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 147–150 (full text read before writing). New draft, printed number kept with the sequence number noted: person/zuhayr-ibn-numayr-al-babi (printed 513, sequence 514, 10/147–150). The notice is long and runs to the top of page 150. Printed 514 (Muhammad ibn Ishaq al-Kufi, who guarded his hours and grieved over their loss) begins on 10/150 and is next.
- The Qur'anic verse on the absence of lineages on the Day of Resurrection, which Zuhayr answers with, is referred to by its sense only; the Qur'an text is never typed. The poem's line is paraphrased.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 63)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 513 (printed) | 149 | the narrator of the accusation "عبد الرحمن بن ممر" | the name reads as "عمر" (the scan renders عمر as ممر elsewhere) | given as Abd al-Rahman ibn Umar; flagged for revision |
| 513 (printed) | 148 | the couplet Zuhayr often recited | the couplet is paraphrased, not quoted | paraphrased in the prose |
| 513 (printed) | 149 | the words "ويخطئ" and the tail of the saying about hearing a beating | cut at the foot of page 149 | the saying is given to its end on page 150 |
| 513 (printed) | 148 | the chain between "ثم قال: حدثني ممدي" and the plague account | the narrator's name ("ممدى", maternal uncle or kinsman) is unclear | the uncle is named as the source of the plague account in the prose only as "a kinsman", with the scan's name not given |

## Batch 64 (run microsd-books-b64, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 150–151 (full text read before writing). New draft, printed number kept with the sequence number noted: person/muhammad-ibn-ishaq-al-kufi (printed 514, sequence 515, 10/150–151). Printed 515 (Qasim ibn Muhammad al-Sufi, who kept himself and was strict about monastic practice) begins on 10/151 and is next.
- The verses on the back of a book are described, not quoted. Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 64)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 514 (printed) | 150 | "أبو عبد الله بن عبد الله (؟)" chain opening | garbled in the scan | not given; the chain is summarised by its named links |
| 514 (printed) | 151 | "عبد الله بن الذرج" | the name is unclear in the scan ("الدرج" or "الذرج") | written as "الدرج" in the prose; flagged for revision |
| 514 (printed) | 151 | the verses on the back of the book | the lines are garbled in the scan | described in prose, not quoted; no line given |
| 514 (printed) | 151 | "ميراث الجوع" | the saying is repeated in the scan | given once as read, with the repetition noted |

## Batch 65 (run microsd-books-b65, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 151–152 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/qasim-ibn-muhammad-al-sufi (printed 515, sequence 516, 10/151–152), person/yazid-ibn-yazid (printed 516, sequence 517, 10/152). Printed 517 (al-Khadim, the servant, a copyist who was wronged by a young man who took his copy) begins on 10/152 and continues onto 10/153; it is next.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 65)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 515 (printed) | 151 | "حدثني *د بن الحسين" and "أحد بن همام" | the names are garbled in the scan | not given; the prose says the chain runs through named transmitters only where clear |
| 515 (printed) | 152 | "همة الحبيز" | read as "المحبين" (the lovers) | rendered as lovers |
| 515 (printed) | 152 | "فترة" and "فمم ذلك" | legible; the sense is clear from the answers | given as read |
| 516 (printed) | 152 | "عثمان بن ممرو بن أبي ماصم" | read as Uthman ibn Amr ibn Abi Asim | given as read; flagged for revision |

## Batch 66 (run microsd-books-b66, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 152–153 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/al-khadim-al-makhdum (printed 517, sequence 518, 10/152–153), person/al-farrar-al-jar (printed 518, sequence 519, 10/153). Both notices are headed by an epithet, and the scan gives no name for either; the records say so and carry the epithet as the label. Printed 519 (al-Daylami, captive and crucified, whose companions cut him down) begins on 10/153 and continues onto 10/154; it is next.
- Flag for the coordinator: two records (517, 518) are made from epithets with no name. Their slugs and labels are the epithets. Whether such entries belong in the person class, or whether the coordinator wants them held, is a decision for the coordinator; they are not dropped.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 66)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 517 (printed) | 152 | the chain's sheikh ("شيخ ابن حالم المكلى") | garbled in the scan | not given |
| 517 (printed) | 153 | the copying young man's name | the text gives no name | the notice is kept as an epithet record; no name supplied |
| 518 (printed) | 153 | "خوفا من المملة" | read as "الملامة" (blame) in the prose; "المملة" is the scan's reading | the prose renders the fear as of blame, a reading flagged for revision |
| 518 (printed) | 153 | one word describing the fear | unclear in the scan | not given |

## Batch 67 (run microsd-books-b67, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 153–154 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/al-daylami-al-masloub (printed 519, sequence 520, 10/153; epithet-only, laqab), person/umayya-ibn-al-samit (printed 520 in the scan as "530", sequence 521, 10/154). Printed 521 (Hilal ibn al-Wazir, who prays for God's witnessing and reads the verse on what God knows of the people) begins on 10/154 and is next.
- Flag for the coordinator: the scan prints the heading of notice 520 as "530"; it is read here as 520 by sequence, and the printed series is one behind the sequence as before.
- The al-Daylami vision is described only by its effect (the need for ritual washing); its detail is omitted as not appropriate to render. Qur'an verses in Umayya's account are referred to by sense only.

## Exclusions and garbled readings (batch 67)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 519 (printed) | 153 | the vision's detail | the detail is not rendered | the effect of the vision (the need for washing) is stated; the detail is omitted |
| 519 (printed) | 153 | the name of the narrator's sheikh | the scan gives an unnamed sheikh | "the sheikh" stated; no name supplied |
| 520 (printed as 530) | 154 | the heading number | misprinted as "530" in the scan | read as 520 by sequence; flagged for the coordinator |
| 520 (printed as 530) | 154 | a phrase in the weeping account | garbled in the scan | not given |

## Batch 68 (run microsd-books-b68, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 154–155 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/hilal-ibn-al-wazir (printed 521, sequence 522, 10/154–155), person/muharib-ibn-hassan (printed 522, sequence 523, 10/155), person/abu-amr-al-marwazi (printed 523, sequence 524, 10/155). Printed 524 (Ibrahim ibn Sa'd al-Mulawi, known for signs and marvels, with the Prophetic bequest) begins on 10/155 and is next.
- The Qur'an verse Hilal recites is referred to by sense only. The honorific form in Muharib's reply is omitted. Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 68)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 521 (printed) | 155 | the Qur'an verse Hilal recites | the Qur'an text is never typed | referred to by sense only |
| 522 (printed) | 155 | the epithet "شروانى القلب والطرف" | garbled in the scan | not given |
| 522 (printed) | 155 | the honorific form in Muharib's reply | the museum never types honorifics | omitted |
| 523 (printed) | 155 | the name of Abu al-Abbas al-Thaqafi | legible; given as read | no flag |

## Batch 69 (run microsd-books-b69, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 155–159 (full text read before writing). New draft, printed number kept with the sequence number noted: person/ibrahim-ibn-sad-al-mulawi (printed 524, sequence 525, 10/155–158). The notice's letter ends at the top of page 158; the text on page 159 belongs to the next printed notice.
- Flag for the coordinator (possible duplicates, not acted on): (a) printed 525, Abu Muhriz, has a chain that matches notice 491 (Abu Mahriz al-Tufawi) almost name for name (Awn ibn Hamara, Muhammad ibn al-Husayn al-Barjalani, Abu Bakr ibn Ubayd). It may be a second notice on the same person, to be merged as an alias or an added citation, or a separate person; not decided here. (b) A heading on page 158 reads "٥٣٧" (printed notice numbering off) and names Miskin al-Sufi again, with a saying of Ibrahim ibn Adham about the two sorrows, which is a second report on the subject of notice 487. Also flagged, not acted on.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 69)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 524 (printed) | 156 | "المجة أخذت برجلك" | the word is unclear in the scan; "اللجة" (deep water) is the likely reading | rendered as deep water; the prose gives the reading as the likely one |
| 524 (printed) | 157 | the name of the man who brought the letter ("واضحا") | read as Wadih, a client of Ibrahim; the spelling is uncertain | given as Wadih, flagged for revision |
| 524 (printed) | 156 | "إبراهيم بن سعد العلوي" | the nisba is read as "العلوي" | given as read; the record uses the name only |
| 524 (printed) | 157 | the claim that the letter is Ibrahim's own words | the letter is attributed by the report to Ibrahim | the attribution is stated as the report's, not as a verified text |

## Batch 70 (run microsd-books-b70, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 158–159 (full text read before writing). Decision applied (coordinator's ruling on the two flags from batch 69):
  - Printed 525 (Abu Muhriz) is the same person as notice 491 (Abu Mahriz al-Tufawi): the saying names "قال أبو محرز الطفاوي" and the chain is Muhammad ibn al-Husayn al-Barjalani, Awn ibn Hamara, Abu Bakr ibn Ubayd, the same as 491. It is a different notice, so it is added to person/abu-mahriz-al-tufawi as a second sourced notice (10/158–159), in all three languages. No new record was created.
  - The heading "٥٣٧" on page 159 (printed 527, sequence 528) is Miskin ibn Ubayd al-Sufi, the same person as notice 487, with a different saying (two kinds of sorrow, transmitted through al-Mutawakkil from Ibrahim ibn Adham). It is not the same notice as 487, so it is added to person/miskin-al-sufi as a second sourced notice (10/159), in all three languages. No duplicate notice was written.
- Printed sequence note: 525 is sequence 526; 527 (Miskin) is sequence 528; the printed number 526 has no heading in the OCR and is noted as missing.
- The opening of the Abu Muhriz saying is not in the scan (the page turns on "وشح عليك"); the prose says so.

## Exclusions and garbled readings (batch 70)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 525 (printed) | 158–159 | the opening words of the saying | the scan resumes at "وشح عليك" after the page turn | the opening is not given; the prose flags it |
| 525 (printed) | 159 | the footnote "(١)" | an editorial note in the edition | not reproduced |
| 527 (printed as 537) | 159 | the heading number | misprinted as "537" | read as 527 by sequence; flagged |
| 526 (printed) | — | no heading | none in the OCR of pages 158 to 159 | recorded as missing; no record made |

## Batch 71 (run microsd-books-b71, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 159–161 (full text read before writing). Records:
  - person/abbas-ibn-al-muammal (printed 528, sequence 529, 10/159–160). New record. The editorial note on page 159 ("كذا بالأصلين، والظاهر أنه هو الذي تقدم في ص ١٣٦") is recorded here and not acted on; the identity it suggests is not confirmed from the text.
  - person/abu-abd-allah-al-qalansi (printed 530, sequence 531, 10/160–161). New record, not the same person as person/muayyad-ibn-al-qalansi (different name). The editorial note on page 160 suggests a page-142 entry; not confirmed, so not asserted.
  - person/mughith-al-aswad: second notice added to the existing record (printed 529, which the scan prints as "5٣a", sequence 530, 10/160). It is a different saying from notice 502 (the monk at the monastery of the creatures), so it is a second sourced notice, not a duplicate.
- Printed 526 was flagged in batch 70 as missing; printed 527 is Miskin (already added as a second notice). Printed 531 (Shibl al-Madri) begins on 10/161 and is next.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 71)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 528 (printed) | 159 | the editor's note "كذا بالأصلين" | an editorial note suggesting an earlier page-136 entry | recorded only; the identity is not asserted |
| 528 (printed) | 159 | "أمر هارون بالمعروف فيسبه دهرا" | read as "فحبسه دهرا" (imprisoned a long time) | the reading as read is used |
| 530 (printed) | 160 | the editor's note "كذا بالأصلين" pointing at page 142 | an editorial note | recorded only; not asserted |
| 530 (printed) | 161 | the word after "حملت ورجمت" | read as "حُمل ورجع" (carried back and returned) | rendered as carried back and returned |
| 529 (printed as "5٣a") | 160 | the heading number | misprinted in the scan | read as 529 by sequence; flagged |

## Batch 72 (run microsd-books-b72, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 161–162 (full text read before writing). Records:
  - person/shibl-al-madri (printed 531, sequence 532, 10/161–162). New record. The manuscript variant in the footnote ("ل مغ: شبل الروزى") is noted and not preferred.
  - person/musawwir-al-maghribi (printed 533, sequence 534, 10/162). New record. Written in all three languages.
  - printed 532, Abd Allah ibn Dinar al-Ju'fi (10/162): HELD. An existing record, person/abd-allah-ibn-dinar, is a stub ("بطاقة أولية ... لم تُراجع ترجمته على الصفحة بعد", role scholar, region arabia) with no detail that identifies it. Nothing is written for 532 and nothing is merged. The coordinator is asked to decide whether the stub and the ascetic Abd Allah ibn Dinar al-Ju'fi are the same person, and whether a second notice belongs on that record.
- Printed 534 (Faraj ibn Sa'id al-Sufi, "أبو روح") begins on 10/162 and is next, if the coordinator's ruling on 532 does not change the order.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 72)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 531 (printed) | 161–162 | the order of two fragments in the kite account | the scan's lines are out of order around "فسقط منها" | rendered in the sequence the sense gives; flagged for revision |
| 531 (printed) | 161 | the nisba "المدري" and the manuscript variant "الروزي" | variant in the footnote | the variant is noted; the nisba as printed is used |
| 533 (printed) | 162 | the chain name "كرد بن عنبسة" | read as "كرز بن عنبسة" | given as Kurz (Kurz ibn Anbasa); flagged |
| 532 (printed) | 162 | the whole notice | held for the coordinator's decision on the stub | not written |

## Batch 73 (run microsd-books-b73, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 162–164 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/faraj-ibn-said-al-sufi (printed 534, sequence 535, 10/162–163), person/abu-al-yaman (printed 535, sequence 536, 10/163; epithet-only, laqab), person/hayyan-al-aswad (printed 536, sequence 537, 10/164), person/abu-al-fadl-al-hashimi (printed 537, sequence 538, 10/164). Printed 538 (Ibrahim al-Maghribi) begins on 10/164 and is next.
- Held: printed 532 (Abd Allah ibn Dinar al-Ju'fi) stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 73)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 534 (printed) | 163 | the final phrase of Ayyub's words ("مامم القوة من دمائك") | garbled in the scan | not given; flagged for revision |
| 534 (printed) | 163 | the narrator's name after "عثمان بن ممار" | the name reads as "عمار" | given as Uthman ibn Ammar |
| 535 (printed) | 163 | the closing phrase of the greatest-name saying | the text is cut at the foot of page 163 | the saying is given to its end as read |
| 536 (printed) | 164 | the name of Hayyan's transmitter ("جعفر بن محمد") | legible; the same Ja'far as in the chain | given as read |
| 537 (printed) | 164 | the word after "ولم يُعرف له سبب" | the phrase is clear; the word is interpreted as a means of living | rendered as no known means of living |

## Batch 74 (run microsd-books-b74, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 164–165 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/ibrahim-al-maghribi (printed 538, sequence 539, 10/164), person/abu-turab-al-ramli (printed 539, sequence 540, 10/164–165). Printed 540 (Sa'id al-Shahid, a fighter in armour who charged the enemy's wings and centre and recited verses) begins at the foot of 10/165 and continues onto 10/166; it is next.
- Held: printed 532 (Abd Allah ibn Dinar al-Ju'fi) stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 74)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 539 (printed) | 165 | "كذارمى إن حدأة" | read as "كذا رمت حدأة" (a kite threw down a piece of roast); the scan's "رمى" may be the verb | the sense given; the tense is flagged for revision |
| 538 (printed) | 164 | the chain's second name ("محمد بن عبد الله الرازي") | legible | given as read |

## Batch 75 (run microsd-books-b75, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 165–166 (full text read before writing). New drafts, printed numbers kept with the sequence number noted: person/said-al-shahid (printed 540, sequence 541, 10/165–166; laqab), person/sayyar-al-nabbaji (printed 541, sequence 542, 10/166), person/ahmad-ibn-rawh (printed 542, sequence 543, 10/166). Printed 543 (Jabir al-Rahhi, "له الأحوال الرقيقة، والألطاف البديعة") begins at the foot of 10/166 and is next.
- The honorific at the end of 540 is not typed; the prose says he was killed. The verses are paraphrased in prose, not quoted. Qur'an text: none in these notices.
- Held: printed 532 stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 75)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 540 (printed) | 166 | the honorific after the name of the slain man | the museum does not type honorifics | omitted; the prose says he was killed |
| 540 (printed) | 165–166 | the verses | paraphrased, not quoted | described in prose |
| 541 (printed) | 166 | the chain's first name ("عثمان بن محمد العثماني") and the sheikh "أبو الحسن المذكر" | legible; given as read | no flag |
| 542 (printed) | 166 | the transmitter name after "عثمان بن د" | garbled in the scan | not given |

## Batch 76 (run microsd-books-b76, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 166–167 (full text read before writing). New draft, printed number kept with the sequence number noted: person/jabir-al-rahbi (printed 543, sequence 544, 10/166–167). The heading reads "الرحى" and the body reads "الرحبي"; the body is used, since the heading is a misprint of the same nisba. Printed 544 (an unnamed man "المستأنس بالحق، المستوحش من الخلق"; his name is hidden in the text) begins at the top of 10/167 and runs onward onto 10/168; it is next.
- Held: printed 532 stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 76)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 543 (printed) | 166 | the nisba in the heading "الرحى" | misprint; the body reads "الرحبي" | the body reading is used; flagged |
| 543 (printed) | 167 | the word "يفتضح" describing the splashing water | read as "يتطاير" (flies) | rendered as the water flying; flagged for revision |

## Batch 77 (run microsd-books-b77, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 167–168 (full text read before writing). New draft: person/al-mustanis-bil-haqq (printed 544, sequence 545, 10/167–168; epithet-only, laqab; the name is hidden in the text). Printed 545 (Abd Allah ibn Khubayq, with sayings of Yusuf ibn Asbat, Hudhayfa al-Mar'ashi and al-Fadl) begins on 10/168 and continues onward; it is next.
- Honorifics in the text (the form after "Abraham" and after the saints) are not typed. Held: printed 532 stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 77)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 544 (printed) | 167 | the name of the place ("بالكام") | unclear in the scan | given as read, in brackets in the English |
| 544 (printed) | 168 | the phrase in the group's description of the man ("يعطر المطر") | garbled in the scan | not given |
| 544 (printed) | 168 | the honorific after Abraham | the museum never types honorifics | omitted |
| 544 (printed) | 167 | the narrator's cut name at the end of the group's remark | cut in the scan | not given |

## Batch 78 (run microsd-books-b78, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 168–171 (full text read before writing). New draft, printed number kept with the sequence number noted: person/abd-allah-ibn-khubayq (printed 545, sequence 546, 10/168–171). It is a long notice of sayings and transmitted reports; the reports are referred to by their place in the text and their wording is not given. Printed 546 begins on 10/172 (not yet read); it is next.
- Honorifics in the text are not typed; the prose refers to the Prophet without a formula. No Qur'an text is typed.
- Held: printed 532 stays held pending the coordinator's ruling; nothing written.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 78)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 545 (printed) | 169 | "أشر وبطر" and "دفتر" | legible; the sense is a proud man and a register | given as read |
| 545 (printed) | 169 | the saying on the sweetness of obedience and the sayings of Hudhayfa | legible | given as read |
| 545 (printed) | 170 | the reports on chains ("عن الأشج", "عن أبي ذيب") | some names garbled in the scan | the reports are described; their chains are not given |
| 545 (printed) | 171 | the words of the hadith on the trials of the last hour | the wording is a quoted report; not typed | described only |
| 545 (printed) | 170–171 | the Prophet's honorific formulas in the reports | the museum does not type honorifics | omitted |

## Batch 80: chapter note on unnamed hidden saints, vol. 10 pages 171–199 (run microsd-books-b80, Claude Code / claude-fable-5-2)
- Status: a single chapter note, as the coordinator directed. No person records are created for these stories. Printed 546 is HELD with this note: the page-172 opening has no heading and no subject, so no record is written for it. The attribution of every story below is unattributed: each names a transmitter and a chain, but the subject is not named.
- Printed 532 (Abd Allah ibn Dinar al-Ju'fi) stays held pending the coordinator's ruling.
- Pages read: vol. 10 pp. 171–199, openings of every page read; the stories below are listed by their page.

### Rain-prayer stories (unattributed; no named subject in the text)
- 172–173: Muhammad ibn al-Munkadir says that at night, facing this pulpit, he heard a man near a pillar, his head covered, pray that the drought be lifted and swear to God that he would be given rain; a cloud came within the hour. Ibn al-Munkadir wanted to know him, followed him to a house, found him turning cups by hand, offered him money, which he refused, and asked not to be named while he lived. The man moved and was not seen again. Unattributed.
- 172–173: Abd Allah ibn Ubayd ibn Umayr, with his father, lost their way; they found a man praying beside a dry trough and a dry waterskin; when his father asked him to fill the skin, the man waved that he would not, and a cloud rained until the trough was full. The villagers said he was a man whose prayer for rain is always answered. Unattributed.
- 173–175: Malik ibn Dinar relates that rain was held back at Basra and the people went out to pray for it, and nothing came; he and a group stayed at the prayer-ground until a black man of worn appearance prayed two short units, raised his eyes and asked God for rain by his love; the sky covered them and they walked out to their knees in water. Malik asked him how he knew God loved him; he answered that God had singled him out and that the love was according to each one's measure. Unattributed.

### Other stories on pages 171–199 (unattributed)
- 171: a narration on the trials before the Hour, in which a man is faithful in the morning and faithless by evening (a report from the Prophet, not typed here).
- 174: a man who looks for a slave to serve him, and the slave-trader presents a hundred, none suits.
- 175: a story of Ibn al-Mubarak's journey in the year 250: a young man with neither provision nor mount is found on the road, and the narrator is taught.
- 176–177: a youth who prays beside a man at dawn; a dialogue of two lovers in worship on whether God would punish those who love Him.
- 178: Abu Hamza in the desert: a lion speaks to him, and he composes verses of hope.
- 179–180: Dhu al-Nun on a voice in the desert; a request that is delayed, with a reply that the delay is because of a word spoken.
- 181–182: on the hearts' light and God's greatness; a man repeats "Lord, how strange is he who knows You and hopes in anyone else".
- 183–184: Abu Sulayman al-Darani on a worshipper at Arafat who calls to God; verses on grief.
- 185–186: a visit that is refused; a dream of Abu Amir after death in a garden.
- 187: a man cries "my longing" and falls.
- 188: Mansur ibn Ammar, passing a street in Kufa in a dark night, hears a crier reciting a verse of warning; the sound stops.
- 190–199: Sahl ibn Abd Allah al-Tustari's sayings (on the three ways of worship, the signs of certainty, Adam and the companions of God, intention, and the people of the world who love what God hates), with a dialogue with Adam at 194.

Note: the chapter note does not name any subject for these stories; the chains are given where the text gives them, and the sayings of Sahl al-Tustari at 190–199 are attributed by the text itself.

## Batch 81 (run microsd-books-b81, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 302–305 (full text read before writing). New draft: person/ahmad-ibn-muhammad-ibn-ata (printed 575, sequence 576, 10/302–305). Ibn Ata is not an existing person record (the existing names with "ibn-ata" are other people: Ibn Ata Allah, Wasil ibn Ata). The notice ends at the top of page 305, where a separate "قال الشيخ" passage on a group of Baghdad scholars begins; that passage is not part of 575.
- Qur'an text is never typed: the verse on those whose sides forsake their beds is referred to by sense only. Traditions are described by their transmitters, not quoted. Honorific forms are omitted.
- Held: printed 532 (Abd Allah ibn Dinar al-Ju'fi) stays held; printed 546 is held with the chapter note.
- Numbering: the printed series remains one behind the sequence (575 printed = 576 sequence); kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 81)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 575 (printed) | 304 | the words of the verses on glory and patience | several words unclear in the scan | not given |
| 575 (printed) | 302–305 | the traditions on connected chains | the wording is a quoted report; not typed | described by transmitter only |
| 575 (printed) | 304 | the Qur'an verse on those whose sides forsake their beds | the Qur'an text is never typed | referred to by sense |
| 575 (printed) | 305 | the "قال الشيخ" passage on Baghdad scholars | a separate passage, not part of 575 | excluded from this record; its own notice, if any, is for a later batch |

## Batch 82 (run microsd-books-b82, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 366 (full text read before writing). New draft: person/said-ibn-abd-al-aziz-al-halabi (printed 645, sequence 646, 10/366). Kept apart from the existing records, as directed: person/said-ibn-abd-al-aziz-al-tanukhi is a Damascus jurist (d. 166 AH) with a Tanukh nisba and is not the same person; person/said-ibn-abd-al-aziz is a different man (the governor of Khurasan). No merge.
- The report is described, not quoted; no honorific is typed.
- Next: printed 646 (Abu Bakr al-Shibli) begins on 10/366; 661 onward follows in vol. 10.
- Held: printed 532 and printed 546 stay held.

## Exclusions and garbled readings (batch 82)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 645 (printed) | 366 | the chain's cut name "عبد المزيز بن مروان" | legible | given as read |
| 645 (printed) | 366 | the hadith's wording | a quoted report with an honorific | described; not typed |

## Batch 83 (run microsd-books-b83, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 366–376 and 389 (full text read before writing).
- Printed 646 (Abu Bakr al-Shibli, pages 366–375): ALREADY ON RECORD. The existing person/al-shibli (Abu Bakr Dulaf ibn Jahdar) is the same man, and its Arabic, English and Urdu prose already cites vol. 10 pages 366–374 for this notice. Nothing is duplicated; the existing record is the place for it.
- Printed 647 (Ibn al-A'rabi, page 375–376): ALREADY ON RECORD. The existing person/ibn-al-arabi-ahmad (Abu Sa'id Ahmad ibn Muhammad ibn Ziyad, al-Basri, resident of Mecca) cites 10/375–376. Nothing is duplicated.
- Printed 661 (al-Nu'man ibn Abd al-Salam, page 389): new record person/numan-ibn-abd-al-salam (sequence 662, 10/389). No existing record of that name. Trilingual draft.
- Printed 532 and 546 stay held.
- Coverage note: the existing prose already cites vol. 10 pages 300–316, 324–328, 366–377 and 385–387. Pages 317–323, 329–365, 378–384 and 388 and later are not cited by any existing record.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 83)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 661 (printed) | 389 | the dream's wording | the report is short; no more is given | the dream is stated as the report gives it |
| 661 (printed) | 389 | "أبو محمد بن حيان" and "أبو عبد الله الكسائي" | legible | given as read |

## Batch 84: re-reading 646 and 647 from the scan (run microsd-books-b84, Claude Code / claude-fable-5-2)
- Printed 646 (Abu Bakr al-Shibli, person/al-shibli, pages 366–375) re-read in full from the scan and compared with the existing prose in all three languages. The existing record is the same man (Abu Bakr Dulaf ibn Jahdar al-Shibli) and its prose was largely faithful, but it omitted and misplaced material. Added as "إضافات من نص الحلية وتصحيحات" in all three languages, with citations to the pages: the vizier's exchange (10/367); the slap on Junayd's head and the foot-strike that preceded the fainting (10/367); "أحسب أني قدمت فيكم..." (10/368); the sayings on the stages of the seeker and the knower, on glance, passing thought and sign, and on being cut off and joined (10/368); love before God's love as polytheism, "تاهت الخليقة" (10/369–370); God's veiling and the student's question (10/370); keeping secrets, jealousy and drunkenness (10/371–372); Abu al-Fath ibn Shafi' and the beggar's "يا جواد" (10/373); trust, fear and hope, and bare tawhid (10/374); lowliness and honour (10/374); the dream (10/375); and the correction of the Ibn Mujahid sequence (10/373–374).
- Printed 647 (Ibn al-A'rabi, pages 375–376) re-read in full and compared with person/ibn-al-arabi-ahmad. Two errors corrected in all three languages: the sentence on the world and Paradise had its halves reversed (the scan says the world was made pleasant by the mention of leaving it, and Paradise was not made pleasant by the mention of staying in it). Added: the chain of the socks report (Sulayman ibn Ahmad, Ibn al-A'rabi, al-Hasan ibn Ali ibn Affan, Yahya ibn Fudayl, al-Hasan ibn Salih, Abu Janab al-Kalbi, Talha ibn Musarrif, Zirr ibn Hubaysh, Safwan ibn Assal), and Abu Nu'aym's note that it is a rare report from Talha; and the saying that God gave some qualities of His friends to His enemies.
- Printed 661 (al-Nu'man ibn Abd al-Salam) is written (batch 83). Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 84)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 646 (printed) | 367 | the gloss "يريد الخليفة المقتدر" | the scan gives it inside the report | given as the scan's gloss, not as Abu Nu'aym's own statement |
| 646 (printed) | 371 | "التصوف لا حال يقل ولا ساء يظل" | the words are garbled in the scan | the saying is given as the scan reads it, flagged for revision |
| 646 (printed) | 374 | "نسيان القرى" as the definition of remembrance | "القرى" unclear in the scan | not asserted; flagged for revision |
| 646 (printed) | 370 | the verse on the sword and "ذو الفقار" at 375 | the saying is a reported gloss | not expanded |
| 647 (printed) | 376 | the phrase "أي الأوقات يرضى" answer's pronoun | the scan reads "عني" (me) where the prose read "عليه" | flagged; the prose keeps the meaning |

## Batch 85 (run microsd-books-b85, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 389–390 (full text read before writing). New draft: person/muhammad-ibn-yusuf-ibn-maadan (printed 662, sequence 663, 10/389–390). No existing record of the name. The "عروس الزهاد" is recorded as a laqab. The line of verse is paraphrased, not quoted.
- Printed 663 (Amir ibn Hamdawayh al-Zahid, who lived in Musayla and transmitted questions from Sufyan) begins on 10/390 and is next.
- Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 85)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 662 (printed) | 390 | the verse line | a single line of verse; the museum paraphrases | described, not quoted |
| 662 (printed) | 389–390 | "وقد تقدم ذكره" | refers to an earlier mention in the book | recorded as the book's own cross-reference |

## Batch 86 (run microsd-books-b86, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 390 (full text read before writing). New draft: person/amir-ibn-hamdawayh-al-zahid (printed 663, sequence 664, 10/390). The notice is three lines; no existing record of the name. The place name "مسيلة" is recorded as Musayla in the Maghreb (region maghreb); the identification is not confirmed from the text and is flagged.
- Printed 664 (Isam ibn Yazid, "أبو سعيد الملقب بخير") begins on 10/390 and is next.
- Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 86)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 663 (printed) | 390 | the place "مسيلة" | the region is not stated in the text | region set to maghreb as a likely reading; flagged for revision |
| 663 (printed) | 390 | the nisba "الثودي" for "الثوري" | a misprint in the scan | read as Sufyan al-Thawri |

## Batch 87 (run microsd-books-b87, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 390 (full text read before writing). New draft: person/isam-ibn-yazid (printed 664, sequence 665, 10/390). No existing record of the name. The laqab "خير" is recorded as the notice gives it.
- Printed 665 (Musa ibn Musawwir al-Dabbi, "الضبي") begins on 10/390 and is next.
- Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 87)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 664 (printed) | 390 | the words "لو أتينهم" | the OCR's "أتينهم" is read as "أتيناهم" (we came to them) | given as "shall we go to them" |

## Batch 88 (run microsd-books-b88, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 390–391 (full text read before writing). New draft: person/musa-ibn-musawwir-al-dabbi (printed 665, sequence 666, 10/390). No existing record of the name. The notice is complete on page 390.
- Printed 666 (Muhammad ibn Ali, "له الدعوة المجابة"; the heading is on 390 and its text begins at the top of 391) runs onto page 391 and is next. Its first lines on 391 concern a man among the substitutes (abdal) whose prayer is answered.
- Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 88)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 665 (printed) | 390 | the nisba "الضي" | read as "الضبي" | given as al-Dabbi |
| 665 (printed) | 390 | the dream's wording "رؤى في المنام" | the dream report is the transmitter's report | stated as reported by Abu Muhammad ibn Hayyan |

## Batch 89 (run microsd-books-b89, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 390–392 (full text read before writing).
- Printed 666: HELD. The heading reads "محمد بن الوليد الأموي، من أهل المدينة، سمع سفيان بن عيينة" (Muhammad ibn al-Walid al-Umawi of Medina, heard Sufyan ibn Uyayna) and ends on page 390; page 391 begins mid-sentence with "بعيد من الأبدال. له الدعوة المجابة" (far from the substitutes; his prayer is answered). The scan omits everything between the two. The heading also reads as Muhammad ibn al-Walid, not "Muhammad ibn Ali" as the coordinator's message had it. Nothing is written for 666 until the page image or a second scan supplies the missing text.
- Printed 667 (Muhammad ibn al-Nu'man ibn Abd al-Salam, pages 391): new record person/muhammad-ibn-al-numan-ibn-abd-al-salam (sequence 668, 10/391). Trilingual draft. No existing record of the name.
- Next: printed 668 (Abd Allah ibn Khalid, on 392) is next, after 667. Printed 668 in the scan is "صالح بن مهران" on 391 (the heading "٦٦٨" is Salih ibn Mihran, who is in the scan at 391 and follows 667); so the next to read is Salih ibn Mihran (printed 668), and then Abd Allah ibn Khalid (printed 669, 392).
- Printed 532 and 546 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 89)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 666 (printed) | 390–391 | the whole middle of the notice | the scan omits the text between "سمع سفيان بن عيينة" and "بعيد من الأبدال" | HELD; nothing invented |
| 667 (printed) | 391 | "تفابد أهل أصبهان" (Zayd ibn Akhram's epithet) | garbled in the scan | not given |
| 667 (printed) | 391 | "تقتصدق" in the saying on the dirham | garbled in the scan | the first saying is given; the garbled one is not |
| 667 (printed) | 391 | "المصر لا يقبل له حمل" | unclear in the scan | not given |

## Batch 90 (run microsd-books-b90, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 391–392 (full text read before writing). New draft: person/salih-ibn-mihran (printed 668, sequence 669, 10/391–392; laqab "الحكيم" recorded). No existing record of the name.
- The notice's final saying is cut in the scan at the foot of page 391 ("والإخلاص اليقين" followed by a closing quotation mark); page 392 opens with the printed 669 heading. The record says the scan breaks off there and does not supply the rest.
- Printed 669 (Abd Allah ibn Khalid, page 392) is next.
- Printed 532, 546 and 666 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 90)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 668 (printed) | 391 | the end of the saying on sincerity | the scan breaks off after "والإخلاص اليقين" | the record says the scan breaks off; no continuation is supplied |
| 668 (printed) | 391 | "ورحان" (the two kinds of scrupulousness) | the scan has "ورحان" for "ورعان" | read as "ورعان" (two kinds) |

## Batch 91 (run microsd-books-b91, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 392 (full text read before writing). New draft: person/abd-allah-ibn-khalid-judge (printed 669, sequence 670, 10/392). The record is keyed "-judge" because the bare name is shared with other people in the museum; the notice itself gives only "عبد الله بن خالد". No existing record of this man.
- Printed 670 (Raja' ibn Suhayb, "أبو غسان" of Jurwan, on 392) is next.
- Printed 532, 546 and 666 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 91)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 669 (printed) | 392 | the chain's name "عبد الله بن "خالد" | the quotation mark is a scan artefact | given as Abd Allah ibn Khalid |
| 669 (printed) | 392 | the words of the condemned man and of the judge | garbled in the scan ("حدا بترس"; "قاض خاكس بسر") | not given; described as unclear |
| 669 (printed) | 392 | "فلم يربعده" | read as "فلم يبعده" (he was not sent away) | rendered as he was sent to the frontier one day |

## Batch 92 (run microsd-books-b92, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 392 (full text read before writing). New draft: person/raja-ibn-suhayb (printed 670, sequence 671, 10/392). No existing record of the name.
- The name: the heading reads "رجاء بن صهيب" and the body reads "رجاء بن حسسيب" (the scan's "حسسيب"). The heading reading is used; the body reading is flagged as a probable misprint and not asserted.
- The place "الجروانى" is not identified; the region is set to persia-central-asia as a likely reading, flagged.
- Printed 671 (Abd Allah ibn Dawud, "سنديلة") begins at the foot of 10/392 and continues onto 10/393; it is next.
- Printed 532, 546 and 666 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 92)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 670 (printed) | 392 | the father's name in the body "حسسيب" | the heading reads "صهيب" | heading reading used; flagged |
| 670 (printed) | 392 | the nisba "الجروانى" | not identified from the text | region set as a likely reading; flagged |

## Batch 93 (run microsd-books-b93, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 pp. 392–393 (full text read before writing). New draft: person/abd-allah-ibn-dawud-sindila (printed 671, sequence 672, 10/392). Kept apart from the existing person/abdallah-ibn-dawud-al-khuraybi (a Baghdad hadith transmitter; its card is an unchecked draft): the Hilyat gives a different nisba (Sindila) and a different chain (al-Husayn ibn Hafs), so no merge is made.
- The nisba "سنديله" is read as al-Sindila; its meaning is not identified from the text and is flagged.
- Printed 672 (Ibrahim ibn Isa al-Zahid, companion of Ma'ruf al-Karkhi, on 393) is next.
- Printed 532, 546 and 666 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 93)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 671 (printed) | 392 | the nisba "سنديله" | not identified | rendered as al-Sindila; flagged |
| 671 (printed) | 392 | the name of the book-transmission link | legible | no flag |

## Batch 94 (run microsd-books-b94, Claude Code / claude-fable-5-2)
- Pages read: vol. 10 p. 393 (full text read before writing). New draft: person/ibrahim-ibn-isa-al-zahid (printed 672, sequence 673, 10/393). No existing record of the name.
- The notice has a report from Ibn Umar about a man of Paradise who appears; it is described, not quoted, and no honorific formula is typed. Its judgement is left to hadith scholars.
- Printed 673 (Abd al-Wahhab ibn al-Mundhir al-Dabbi, on 393) is next.
- Printed 532, 546 and 666 stay held.
- Numbering: the printed series remains one behind the sequence; kept as printed; the page image has not been checked.

## Exclusions and garbled readings (batch 94)

| Notice | Page | Passage | Reason | Handling |
|---|---|---|---|---|
| 672 (printed) | 393 | the report from Ibn Umar | the wording is a quoted report with an honorific formula | described only; not typed |
| 672 (printed) | 393 | the chain's garbled name ("العباس أحمد بن #") | garbled in the scan | not given |
