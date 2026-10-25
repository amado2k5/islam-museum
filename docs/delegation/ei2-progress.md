# ei2 progress: Encyclopaedia of Islam, 2nd edition

Lane document: `docs/agents/lanes/ei2.md`. Approved by the founder on 24 Oct 2026, scope B (all entries, A to Z, volume by volume).

## State

- Harvest: all 15 PDFs (13,908 pages) downloaded and checksummed. Apple Vision OCR (en-US, accurate) running on the Mac, in order of volumes; output in `~/islam-museum-harvest/books/encyclopaedia-of-islam-2/`. Volume 1 is first.
- Tools on main: `scripts/harvest/encyclopaedia/split_entries.py` (entry splitter). The OCR runner is `ocr_ei2.py` in the same folder.
- Source entity: `source/encyclopaedia-of-islam-2`.

## Batches

| Batch | Volume | Entries | Status |
|---|---|---|---|
| ei2-b002 (part 1) | vol. 1 (A–B), pp. 116–126, seq 26–37 | 12 entities: new place/abu-arish, person/abu-arubah-al-harrani, person/abu-dahbal-al-jumahi (content added to an existing record); enriched person/al-abhari-athir-al-din, place/abiward, person/al-abiwardi, person/abraha, person/abu-al-abbas-al-saffah, person/abu-abd-allah-al-shii, person/abu-ata-marzuq-al-sindi, person/abu-dhuayb-al-hudhali, person/abu-jahl | done; PR in progress |
| ei2-b002 part 2b | vol. 1 (A–B), pp. 128–137, seq 40, 44, 47, 48, 49, 50 | 6 entries: new person/abu-duad-al-iyadi, person/abu-dulaf-misar-ibn-muhalhil (heading ABU DULAF, Misar b. Muhalhil, not the existing abu-dulaf-al-qasim), person/abu-al-fida (Ismail b. Ali, not the mosque record); enriched person/abu-bakr (early life and family only; the caliphate and wars of the 11.6k-char entry are NOT yet written, open), person/abu-dharr-al-ghifari, person/abu-l-faraj-al-isfahani (the heading AL-KURASHI is clipped; the text is Abu l-Faraj's Kitab al-Aghani); en, ar, ur | done, except abu-bakr part 2 (open) |
| ei2-b002 part 2a | vol. 1 (A–B), pp. 126–133, seq 38, 39, 42, 43 | 4 entities: new person/abu-damdam; enriched person/abu-al-atahiyya, person/abu-ayyub-al-ansari (the NADIDIARI AL-ANSARI heading is this Companion), person/abu-dawud-al-sijistani (heading AL-ASH'ATH on p. 133); en, ar, ur | done |
| ei2-b001-tail | vol. 1 (A–B), pp. 85–115 (rest of ei2-b001) | 9 new entities (person/abd-al-karim-al-jili, person/abd-al-samad-al-palimbani, person/abd-al-rauf-al-sinkili, person/abd-al-rashid-al-tattawi, person/abaza-pasha-d-1634, person/abaza-hasan-pasha, person/abaza-muhammad-pasha, person/abu-abd-allah-muhammad-al-abdari, person/abd-al-hayy-al-lakhnawi) and 6 enrichments (person/abd-al-latif-al-baghdadi, person/abd-al-rahim-khan-i-khana, person/abd-al-razzaq-samarqandi, person/abd-al-wahid-al-marrakushi, polity/zayyanid-tlemcen, group/qabilat-durrani), en/ar/ur | done; PR open (see log) |
| ei2-b01 | vol. 1 (A–B), pp. 21–34 | 7 new entities written (ar, en, ur): place/abadah, place/abarkuh, place/abarshahr, person/abu-asim-al-abbadi, person/al-abbas-ibn-muhammad, person/al-abbas-ibn-al-walid, person/abbas-hilmi-ii | done in this session; enrichment of existing records (place/abar-qubadh, place/abaskun, place/al-abbasiyya, place/abadan) and the ABBAS B. NASIH, ABAZA, AL-SHINHADJI, AL-HAYY, AL-DJILI, RAHMAN AL-MARWANI and ZAYYANIDS entries are next |

## Next step

Continue ei2-b002 part 2: seq 38-50 (ABU 'I-'ATAHIYA, NADIDIARI AL-ANSARI, ABU BAKR, AL-DIN PANIPATI (page image needed), ABU DAMDAM, AL-ASH'ATH (Abu Dawud al-Sijistani), ABU DHARR, ABU DUAD, ABU DULAF, AL-KURASHI, ABU 'I-FIDA', ABU DJAHL is done). Then ei2-b003 from seq 51 on a branch from origin/main. Checks: npm run validate (0 errors), npm run cite-check, npm run graph, npm run coverage; then commit, push, open PR and merge without waiting for CI (coordinator instruction, 25 Oct 2026).

## Batch ei2-b003 (vol. 1 from seq 51)

| Part | Rows | Entries | Status |
|---|---|---|---|
| ei2-b003 part 3a | seq 52, 53, 56, 59 | enriched person/abu-al-ghazi-bahadur, person/abu-hamid-al-gharnati, person/abu-hatim-ahmad-al-razi, person/abu-hayyan-al-tawhidi (from the Encyclopaedia's text as read; the articles are only partly read: Abu l-Ghazi to 2300 chars of 5743, Abu Hayyan to 3000 of 7222, Abu Hamid to 900 of 4767; the rest is open) | done; PR in progress |
| ei2-b003 part 3b | seq 57, 60, 61 | 3 entries: new person/abu-hatim-al-sijistani (the printed heading AL-DIUSHAMI is garbled; identified from the works and pupils named; check the page image p. 144); enriched person/abu-al-hudhayl-al-allaf (read in full, pp. 146-147), person/abu-inan-faris (read to p. 148); en, ar, ur | done; PR in progress |
| ei2-b003 part 3c | seq 51 | 1 new: person/abu-ghanim-bishr-al-khurasani (Ibadi jurist; the heading SANI is confirmed on the page image p. 139 as ABU GHANIM BISR B. GHANIM AL-KHURASANI); en, ar, ur | done; PR in progress. Page-image checks for seq 54, 55, 62 are still open |
| ei2-b003 part 3t (seq 78, and 77 located) | seq 78, 77 | seq 78 NADDARA: located by page in entries.jsonl (page_start 160); the article is Ya'qub Sanu, Abu Naddara (James Sanua, 1839-1912), new person/yaqub-sanu-abu-naddara (en, ar, ur). seq 77 ABU MUSLIM (p. 160, unsigned, 4.4k): located, and the existing person/abu-muslim-al-khurasani record covers the same leader; to be enriched in the next part (read to the end of the entry first). | seq 78 done; seq 77 open |
| ei2-b003 part 3s (seq 79 only) | seq 79 | new person/kudama-al-sijilli (rajaz poet, d. after 105/724; no existing record found by grep for kudama and sijilli). OPEN: seq 77 ABU MUSLIM (p. 160, unsigned, 4.4k chars) and seq 78 NADDARA (pp. 160-161, unsigned, 2.5k chars) not yet read; the first lines did not print under the headings I searched, so the headings must be checked against the entries file (or the page image) first. | done for 79 |
| ei2-b003 part 3r (seq 75 only) | seq 75 | new person/abu-mashar-najih-al-madani (heading checked on p. 159; signed J. Horovitz-F. Rosenthal; the existing person/abu-mashar is a different man, the astrologer). seq 77, 78, 79 still open (see the next line). | done for 75 |
| ei2-b003 part 3q (decision) | seq 75 | Page image p. 159 checked: the heading is ABU MA'SHAR NAJIH b. 'ABD AL-RAHMAN AL-SINDI AL-MADANI (the queue's 'AL-MADANI' is clipped), signed J. Horovitz-F. Rosenthal, author of the Kitab al-Maghazi (d. Baghdad 170/787). New person record to write in the next part (check no existing record for najih/abu-mashar first). Seq 77 ABU MUSLIM (p. 160), 78 NADDARA (pp. 160-161), 79 KUDAMA AL-SIDJLI (p. 161) not yet read. | decision only |
| ei2-b003 part 3p (seq 76 only) | seq 76 | new person/ibn-baraka-al-umani (Ibadi author of Bahla, Oman; signed T. Lewicki; dates unknown). OPEN: seq 75 AL-MADANI (p. 159, H. A. R. Gibb): the text is about Abu Ma'shar's Kitab al-Maghazi (a freed slave of Yemeni origin, d. Baghdad 170/787). The heading is clipped; page image p. 159 still to check, then decide the record (probably Abu Ma'shar Najih al-Madani). seq 77 ABU MUSLIM (p. 160), 78 NADDARA (p. 160-161), 79 KUDAMA AL-SIDJLI (p. 161), 80 ABU NU'AYM AL-ISFAHANI (pp. 161-162, Rosenthal), 81 MSOS (p. 163), 82 ABO RIGHAL (p. 163-164) not yet read. | done for 76 |
| ei2-b003 part 3o (seq 73 only) | seq 73 | enriched existing person/abu-madyan (Shu'ayb b. al-Husayn al-Andalusi, read in full, pp. 156; the printed signature is G. Marcais, not W. Popper as the queue lists; the entry ends where Ibn Taghribirdi begins). Sections on his life, Bougie, Marrakesh and death (594/1197), the writings, and the al-Ubbad complex. | done. Next: seq 75 onward |
| ei2-b003 part 3n (seq 72 only) | seq 72 | enriched existing person/abu-l-layth-al-samarqandi (the Hanafi faqih Nasr b. Ahmad, d. 373/983-393/1002; EI section by J. Schacht: works, the 'Aqida; the article warns against confusing him with al-Hafiz al-Samarqandi). OPEN for the next part: seq 73 ABU MADYAN (pp. 156-157, W. Popper, 8.6k chars, to be read in pieces); then seq 75 onward (seq 74 is done). | done for 72 |
| ei2-b003 part 3m | seq 70, 71 | new person/abu-khirash-huwaylid-al-hudhali (heading from the page image p. 155; signed H. Peres); enriched existing place/jabal-abi-qubays (EI section by W. Montgomery Watt, read in full). OPEN for the next part: seq 72 ABU 'L-LAYTH AL-SAMARKANDI (p. 156, Schacht, 2.1k chars) and seq 73 ABU MADYAN (pp. 156-157, Popper, 8.6k chars, read in pieces). | done for 70 and 71 |
| ei2-b003 part 3l (decision only) | seq 70 | Page image p. 155 checked: the heading is ABU KHIRASH HUWAYLID b. MURRA al-HUDHALI, a mukhadram Arab poet who converted to Islam and died under 'Umar (the queue's 'HUDHALI' heading is clipped and the signature on the image is H. PERES, not Ch. Pellat). New person record to write in the next part. seq 71 ABU KUBAYS (p. 155-156, Watt) and seq 72 ABU 'L-LAYTH AL-SAMARKANDI (p. 156, Schacht) and seq 73 ABU MADYAN (pp. 156-157, Popper) are still open. Not written in this part. |
| ei2-b003 part 3k (seq 69 and 74 only) | seq 69, 74 | new person/abu-al-khayr-al-ishbili (the agronomist, author of Kitab al-Filaha; distinct from the record Ibn Khayr al-Ishbili); new person/abu-mansur-ilyas-al-nafusi (Ibadi governor of Nafusa and Tripolitania; signed T. Lewicki). OPEN for next part: seq 70 HUDHALI (p. 155, Ch. Pellat, heading to check on the page image), seq 71 ABU KUBAYS (p. 155-156, Watt), seq 72 ABU 'L-LAYTH AL-SAMARKANDI (p. 156, Schacht), seq 73 ABU MADYAN (pp. 156-157, Popper, 8.6k chars, to read in pieces). | done for 69 and 74 |
| ei2-b003 part 3j | seq 66, 67 | new person/abu-al-khattab-muhammad-ibn-abi-zaynab (the Khattabi heresiarch; heading from the page image p. 153; signed B. Lewis; dates uncertain, 145/762 per the article) and new person/abu-al-khattab-abd-al-ala-al-maafiri (first Ibadi imam of the Maghrib; heading from the page image p. 153; signed Motylinski-Lewicki); en, ar, ur. Next: seq 69 onward | done |
| ei2-b003 part 3i | seq 65 | new work/hikayat-abi-l-qasim-al-baghdadi (kind book; the entry is about the Hikaya of Muhammad b. Ahmad Abu l-Mutahhar al-Azdi, so a work record, not a person; en, ar, ur). Page image p. 153 checked for seq 66: the heading is ABU 'L-KHATTAB MUHAMMAD B. ABI ZAYNAB MIKLAS AL-ASADI, Muslim heresiarch (Khattabiyya), not a separate name; no existing record found (grep for khattab/zaynab/miqlas), so to be written as a new person record in the next part. seq 67: the page image shows ABU 'L-KHATTAB 'ABD AL-A'LA B. AL-SAMH AL-MA'AFIRI AL-HIMYARI AL-YAMANI, the first imam of the Maghrib Ibadis; no existing record found (grep for abd-al-ala, maafiri, samh); to be written in the next part as a new person record. | work record done; PR in progress |
| ei2-b003 part 3h | seq 68 | new person/abu-al-khayr-khan (Uzbek khan of the Shaybanids; the Hijri date 816 is given as an error by the article; read to the Syr Darya fortresses; the later reign and death are open). Decisions: seq 65 ABU 'L-KASIM: a WORK record, the Hikaya Abi l-Qasim al-Baghdadi of Muhammad b. Ahmad Abu l-Mutahhar al-Azdi (the article treats the hero as a Baghdad type of the parasite, and the book is the subject). Written in the next part as work/hikayat-abi-l-qasim-al-baghdadi after checking the work schema. seq 66 (MIKLAS AL-ADIDA' AL-ASADI, p. 153): the page image is still to be checked (heading ambiguous); open. seq 67 AL-MA'AFIRI AL-HIMYARI AL-YAMANI (p. 153, Motylinski-Lewicki): the first Ibadi imam of the Maghrib, elected at Sayyad in 140/757-8 by the Tripolitanian notables; the entry is about Abu l-Khattab al-Ma'afiri and is to be written as a new person record in the next part (check no existing 'abu-al-khattab' Ibadi record first); open. | done; PR in progress |
| ei2-b003 part 3g | seq 64 | new person/abu-kabir-al-hudhali (read in full; unsigned entry; the Ta'abbata Sharran story is reported as doubtful, per the article); en, ar, ur. OPEN, not yet written: seq 65 ABU 'L-KASIM (p. 152, Horovitz): the heading is the name of a literary character, the parasite of al-Azdi's Hikayat Abi l-Qasim al-Baghdadi; decide between a person record and a work record before writing (open). seq 66 MIKLAS AL-ADIDA' AL-ASADI (p. 153): the heading is ambiguous (the text names Miklas b. Abi l-Khattab as father and describes Abu l-Khattab's execution); needs the page image and a decision (open). seq 67 AL-MA'AFIRI AL-HIMYARI AL-YAMANI (p. 153, Motylinski-Lewicki) and seq 68 ABU 'I KHAYR (p. 154): not yet read (open). | part in progress |
| ei2-b003 part 3f | seq 62, 63 | Page image p. 149 checked: seq 62 heading ABU 'ISA AL-ISFAHANI (Jewish pretender; new person/abu-isa-al-isfahani; the printed 'ABSTINAAN' is garbled). seq 63 heading "SAID AL-TUDJIBI" is wrong: the text is Abu Ishaq al-Ilbiri, enriched existing person/abu-ishaq-al-ilbiri. | done. Next: seq 64 ABU KABIR AL-HUDHALI (pp. 149-150), 65 ABU 'L-KASIM (Horovitz, p. 152), 66, 67, 68 |
| ei2-b003 part 3d (decisions only) | seq 54, 55, 58, 62 | Page-image checks done for p. 144 (seq 55 and 58). Decisions: seq 55 is not the 'ABU HASHIM' heading of the splitter. On the page image, p. 144 shows "ABU HASHIM, Mu'tazili theologian [see AL-JUBBA'I]" (a cross-reference, skipped) followed by the entry ABU HATIM YA'KUB b. LABID (or LABIB, HABIB) AL-MAZUZI AL-NAFUSI, Ibadi imam in the Maghrib, signed A. de Motylinski and T. Lewicki. That entry is NEW and goes to the next part as person/abu-hatim-yaqub-al-mazuzi. seq 58 ABU 'L-HAWL (the Sphinx): DECISION, not written as a person; the building record building/abu-al-hawl exists and the entry is about the monument, so it is left to a building enrichment in a later part. seq 54 ABU HASHIM 'ABD ALLAH (Kaysanite leader, son of Muhammad b. al-Hanafiyya, p. 143): the existing person/abu-hashim-ibn-muhammad is to be enriched in the next part. seq 62 ABSTINAAN (p. 149): page image not yet checked; open. | decisions recorded; no content this part |
| ei2-b003 part 3a (open) | seq 51, 54, 55, 57, 58, 60, 61, 62 | not yet written | open |

Open reasons: seq 51 SANI is an Ibadi lawyer (Abu Ghanim's Mudawwana; heading clipped; needs its own record). seq 54 ABU HASHIM 'ABD ALLAH and seq 55 ABU HASHIM (the Mutazili/Ibadi line is mixed by the splitter) need the page image. seq 57, 58, 60 (ABU L-HUDHAYL AL-'ALLAF, 13.6k chars), 61, 62 not yet read.

Open after part 3b: seq 51 SANI (Ibadi lawyer, Abu Ghanim's Mudawwana; heading clipped, needs its own record after the page image check); seq 54 and 55 (ABU HASHIM; the splitter mixes the Mutazili and Ibadi lines; the page image is needed before writing); seq 58 (heading 'MMIA' is the tail of the AL-DIUSHAMI bibliography and the start of ABU 'L-HAWL, the Sphinx, which is already a building record, building/abu-al-hawl); seq 62 ABSTINAAN (Jewish messianic claimant under 'Abd al-Malik or Marwan II, Isawiyya; heading garbled, needs the page image).

Note: four content files (abu-al-ghazi-bahadur, abu-hamid-al-gharnati, abu-hatim-ahmad-al-razi) had no content file before; they now carry the encyclopaedia section only, with the record's existing summary in the yaml.

## Open after part 2b

- seq 30 AI-ABNA' (a term with five senses): OPEN, reason: needs a concept record, and the class is not yet checked against schema/enums.
- seq 34 AL-DIN PANIPATI: OPEN, reason: the page image is needed to confirm the heading (likely a Qalandar saint of Panipat, d. 724/1324).
- seq 40 ABU BAKR: the first part (early life and family) is written; the rest of the 11.6k-char entry (caliphate, wars, death) is OPEN and must be read in pieces.
- The second AL-ASH'ATH entry (p. 745, Ash'ath b. Qays) belongs to a later queue row.

## Next step (after part 2a)

ei2-b002 part 2b: seq 40 ABU BAKR (long; read in pieces, enrich person/abu-bakr), seq 41 is done, seq 44 ABU DHARR, 45 done, 47 ABU DUAD, 48 ABU DULAF (check which record), 49 AL-KURASHI, 50 ABU 'I-FIDA'. Also the second AL-ASH'ATH entry on p. 745 (Ash'ath b. Qays) belongs to a later queue row. AL-DIN PANIPATI (seq 34) needs the page image before writing. Also not yet written from part 1: seq 30 AI-ABNA' (a term with five senses; a concept record is needed, class to be checked against schema/enums) and seq 34 AL-DIN PANIPATI. Part 1's summary above lists 12 entities; seq 30 and 34 were not included there.

## Skipped rows (ei2-b001)

- RAHMAN AL-MARWANI (seq 10): the entry is 'Abd Allah b. Muhammad, Umayyad amir of Cordova; the record person/abd-allah-ibn-muhammad-cordova from PR 1579 already covers it. Not written again.
- GLECS (seq 26, b002): a running head of the ABDJAD article (pp. 98-99 text), not an entry; the text is already in the ABDJAD article. Not written.
- ALLAH (seq 7): splitter artefact, the text belongs to AL-'ABBAS B. MUHAMMAD (already person/al-abbas-ibn-muhammad). Not written.
- AL-DIN ISHAK AL-SAMARKANDI (seq 20): the text is 'Abd al-Razzaq b. Ishaq (Kamal al-Din) Samarqandi; enriched person/abd-al-razzaq-samarqandi, not duplicated.
- BANI (seq 21): the text is 'Abd al-Samad al-Palimbani; written as person/abd-al-samad-al-palimbani.
- AL-SINKILI (seq 19): the page image heading reads 'ABD AL-RA'UF b. 'ALI al-Djawi al-Fansuri; written as person/abd-al-rauf-al-sinkili.
- SAYNI AL-MADANI AL-TATTAWI (seq 18): the page image heading reads 'ABD AL-RASHID b. 'ABD AL-GHAFUR al-Madani al-Tattawi; written as person/abd-al-rashid-al-tattawi.
- ABAZA (seq 5): the family article; written as three person records (Abaza Pasha d. 1634, Abaza Hasan, Abaza Muhammad). The surname itself is not a record.
- MUHAMMAD (seq 25): the text is the start of AL-'ABDARI (Abu 'Abd Allah Muhammad al-Abdari); written as person/abu-abd-allah-muhammad-al-abdari.
- RAKUSHI (seq 23): the text is 'Abd al-Wahid al-Marrakushi; enriched person/abd-al-wahid-al-marrakushi.
- ZAYYANIDS (seq 22): enriched polity/zayyanid-tlemcen.
- ABDALI (seq 24): enriched group/qabilat-durrani.
- AL-HAYY (seq 14): the text is Abu l-Hasanat Muhammad 'Abd al-Hayy al-Lakhnawi (written). The second part of the page (the entry 'Abd al-Qadir b. Ghaybi, by H. G. Farmer) is a separate queue row for batch 2.

## Notes for the next batch

- The splitter's headword can be wrong. In batch 1 "ALLAH" was the split of "AL-'ABBAS B. MUHAMMAD B. 'ALI B. 'ABD ALLAH" (checked on PDF page 31). Verify every headword on the page image before writing.
- Reading order: English two-column pages are read left column then right. The earlier run read them the other way; those pages were discarded and re-OCR'd.
- Entries with the same page as others: ABASKUN starts inside the ABARSHAHR text (PDF p. 22); the splitter does not see its heading because it has no comma. Enrich place/abaskun from its own paragraph.

## Doubts

- Abd al-Hayy al-Lakhnawi: the year of death is cut off in the OCR ('died at Lucknow in'); the record gives no death date. Check the page image (p. 85) before adding one.
- Farhang-i Rashidi: the EI gives 1064/1683-4; the Hijri year corresponds to about 1653-4. The record notes the mismatch.
- Abd al-Karim al-Jili: the EI calls Ibn 'Arabi pantheistic; the record attributes the term to the article.
- Abaza Muhammad Pasha: the article text is cut off after the Crimea episode (OCR); the record stops there.
- Vol. 1 OCR was still running when batch 1 was written; the batch uses only pp. 21–34, which were complete in the first 100 pages.
- Some OCR column order and special characters need checking against the page image.
