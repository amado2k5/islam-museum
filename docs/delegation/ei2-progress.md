# ei2 progress: Encyclopaedia of Islam, 2nd edition

Lane document: `docs/agents/lanes/ei2.md`. Approved by the founder on 24 Oct 2026, scope B (all entries, A to Z, volume by volume).

## State

- Harvest: all 15 PDFs (13,908 pages) downloaded and checksummed. Apple Vision OCR (en-US, accurate) running on the Mac, in order of volumes; output in `~/islam-museum-harvest/books/encyclopaedia-of-islam-2/`. Volume 1 is first.
- Tools on main: `scripts/harvest/encyclopaedia/split_entries.py` (entry splitter). The OCR runner is `ocr_ei2.py` in the same folder.
- Source entity: `source/encyclopaedia-of-islam-2`.

## Batches

| Batch | Volume | Entries | Status |
|---|---|---|---|
| ei2-b01 | vol. 1 (A–B), pp. 21–34 | 7 new entities written (ar, en, ur): place/abadah, place/abarkuh, place/abarshahr, person/abu-asim-al-abbadi, person/al-abbas-ibn-muhammad, person/al-abbas-ibn-al-walid, person/abbas-hilmi-ii | done in this session; enrichment of existing records (place/abar-qubadh, place/abaskun, place/al-abbasiyya, place/abadan) and the ABBAS B. NASIH, ABAZA, AL-SHINHADJI, AL-HAYY, AL-DJILI, RAHMAN AL-MARWANI and ZAYYANIDS entries are next |

## Next step

Finish batch 1 (English draft, Arabic, Urdu), run the checks, open the pull request, merge it, then continue with the next 25 real entries of vol. 1 in printed order.

## Notes for the next batch

- The splitter's headword can be wrong. In batch 1 "ALLAH" was the split of "AL-'ABBAS B. MUHAMMAD B. 'ALI B. 'ABD ALLAH" (checked on PDF page 31). Verify every headword on the page image before writing.
- Reading order: English two-column pages are read left column then right. The earlier run read them the other way; those pages were discarded and re-OCR'd.
- Entries with the same page as others: ABASKUN starts inside the ABARSHAHR text (PDF p. 22); the splitter does not see its heading because it has no comma. Enrich place/abaskun from its own paragraph.

## Doubts

- Vol. 1 OCR was still running when batch 1 was written; the batch uses only pp. 21–34, which were complete in the first 100 pages.
- Some OCR column order and special characters need checking against the page image.
