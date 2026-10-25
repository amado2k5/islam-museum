# ei2 progress: Encyclopaedia of Islam, 2nd edition

Lane document: `docs/agents/lanes/ei2.md`. Approved by the founder on 24 Oct 2026, scope B (all entries, A to Z, volume by volume).

## State

- Harvest: all 15 PDFs (13,908 pages) downloaded and checksummed. Apple Vision OCR (en-US, accurate) running on the Mac, in order of volumes; output in `~/islam-museum-harvest/books/encyclopaedia-of-islam-2/`. Volume 1 is first.
- Tools on main: `scripts/harvest/encyclopaedia/split_entries.py` (entry splitter). The OCR runner is `ocr_ei2.py` in the same folder.
- Source entity: `source/encyclopaedia-of-islam-2`.

## Batches

| Batch | Volume | Entries | Status |
|---|---|---|---|
| ei2-b01 | vol. 1 (A–B), from ABADAH | 25 | in progress |

## Next step

Finish batch 1 (English draft, Arabic, Urdu), run the checks, open the pull request, merge it, then continue with the next 25 real entries of vol. 1 in printed order.

## Doubts

- OCR of vol. 1 completed in this session's background run; check the entry count after the full run, since the partial split used pages 1–300 only.
- Some OCR column order and special characters need checking against the page image.
