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
