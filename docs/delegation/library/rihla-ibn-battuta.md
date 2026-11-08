# Library lane: rihla-ibn-battuta

**Book:** رحلة ابن بطوطة — ابن بطوطة (ت 779هـ) · category `geography` · authenticity register: `accept` / school `sunni` (dec-187 canon sweep, agent-decided under dec-186 delegation).
**Source entity:** `source/rihla-ibn-battuta` (draft, edition details pending human check).
**Harvest wave:** approved 21-book wave, 8 Nov 2026 (pilot order: arbaun-nawawi first).

## Extraction state (verified 8 Nov 2026)

Copies extracted under `~/islam-museum-harvest/books/geography/rihla-ibn-battuta/`:
- 20200917_20200917_2022 (22682 lines)
- 20220828_20220828_1853 (15438 lines)
- 20240218_20240218_2121 (22252 lines)
- 20240313_20240313_1733 (16071 lines)
- Rihlat_Ibn_Batuta (15424 lines)
- ar115voyag04 (22683 lines)
- jaloute2003_yahoo (28465 lines)

## Mining state

Entities citing `source/rihla-ibn-battuta` outside `data/source/`: **50**.

## Done

- (8 Nov 2026, wave 21, run `lib-wave-21-rihla-ibn-battuta-1`) Gap-filled 5 existing `data/place/` entities that cite other sources but not the Rihla, using the `20220828_20220828_1853` scan (= `source/rihla-ibn-battuta-1958`, Maktaba Tijariyya 1331 ed. / Istanbul 1958). **Page offsets verified against page footers:** part 1 printed = PDF − 4 (e.g. PDF 89 → printed 85); part 2 printed = PDF − 260 (e.g. PDF 423 → printed 163, PDF 466 → printed 206). This corrects the source record's "printed = PDF − 1" note, which does not match this copy's footers — flagged for reconciliation. Enriched: `place/damascus` (arrival 9 Ramadan 726, Sharbashiyya madrasa, Ibn Jubayr's «jannat al-mashriq», Umayyad Mosque, printed pp. 50–52), `place/mecca` (Sacred Mosque gates/domes, Safa–Marwa measures, Dar al-Nadwa, printed pp. 85–88), `place/quanzhou` («madinat al-zaytun», name origin, cloths, Muslim quarter, printed pp. 163–164), `place/gao` («madinat mali», seat of Mansa Sulayman, ~4 months, gifts, printed pp. 197–198), `place/timbuktu` (Masufa, Farba Musa, al-Sahili's tomb, Kukah, printed pp. 206–207). Skipped: `place/cairo` (Rihla mentions are plague/caravan logistics, not a city portrait — left for a later batch); `place/jerusalem`, `place/baghdad` etc. not yet verified line-by-line.

## Next step

Read `mining-sources.md` + `categories/` guidance for `geography`, pick the clearest copy, work in ≤25-entity batches from the museum's priority list. All labeling/classification/decisions route through the decision ledger (mining-sources.md §4b). AI output enters draft-tier until a human read (AGENTS.md).
