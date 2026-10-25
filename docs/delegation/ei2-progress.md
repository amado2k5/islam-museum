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
| ei2-b001-tail | vol. 1 (A–B), pp. 85–115 (rest of ei2-b001) | 9 new entities (person/abd-al-karim-al-jili, person/abd-al-samad-al-palimbani, person/abd-al-rauf-al-sinkili, person/abd-al-rashid-al-tattawi, person/abaza-pasha-d-1634, person/abaza-hasan-pasha, person/abaza-muhammad-pasha, person/abu-abd-allah-muhammad-al-abdari, person/abd-al-hayy-al-lakhnawi) and 6 enrichments (person/abd-al-latif-al-baghdadi, person/abd-al-rahim-khan-i-khana, person/abd-al-razzaq-samarqandi, person/abd-al-wahid-al-marrakushi, polity/zayyanid-tlemcen, group/qabilat-durrani), en/ar/ur | done; PR open (see log) |
| ei2-b01 | vol. 1 (A–B), pp. 21–34 | 7 new entities written (ar, en, ur): place/abadah, place/abarkuh, place/abarshahr, person/abu-asim-al-abbadi, person/al-abbas-ibn-muhammad, person/al-abbas-ibn-al-walid, person/abbas-hilmi-ii | done in this session; enrichment of existing records (place/abar-qubadh, place/abaskun, place/al-abbasiyya, place/abadan) and the ABBAS B. NASIH, ABAZA, AL-SHINHADJI, AL-HAYY, AL-DJILI, RAHMAN AL-MARWANI and ZAYYANIDS entries are next |

## Next step

Continue ei2-b002 part 2: seq 38-50 (ABU 'I-'ATAHIYA, NADIDIARI AL-ANSARI, ABU BAKR, AL-DIN PANIPATI (page image needed), ABU DAMDAM, AL-ASH'ATH (Abu Dawud al-Sijistani), ABU DHARR, ABU DUAD, ABU DULAF, AL-KURASHI, ABU 'I-FIDA', ABU DJAHL is done). Then ei2-b003 from seq 51 on a branch from origin/main. Checks: npm run validate (0 errors), npm run cite-check, npm run graph, npm run coverage; then commit, push, open PR and merge without waiting for CI (coordinator instruction, 25 Oct 2026).

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
