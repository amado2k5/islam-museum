# Lane `lib-tafsir-tantawi-wasit`: al-Tafsir al-Wasit lil-Qur'an al-Karim (Muhammad Sayyid Tantawi, d. 1431 AH / 2010)

**Book id:** `tafsir-tantawi-wasit` · **Work:** `work/al-tafsir-al-wasit` · **Source:** `source/tafsir-tantawi-wasit` · **Author:** `person/muhammad-sayyid-tantawi` · **Stubs:** `data/_stubs.d/claude-ocr-harvest-b.yaml` · **Worker:** Claude Code (OCR-harvest worker B), run `ocr-harvest-2026-11-04`

## Items and editions
- `000078115` (6,906 PDF pages): the full Dar al-Ma'arif printing, 15 volumes in one file, revised by Dr Abd al-Rahman al-Adawi; vol. 1 title page dated 1412 AH / 1992. **Used.**
- `793Pdf115`, `noor-book.com-1-15-3`: byte-identical to `000078115` (md5 `7aee430bd5d7398d391a113a0514e606`). Not used separately.
- `tafseer-sourat-almolk-altantawi` (780 pages, md5 `cbe9e84c…`): separate print of the Surat al-Mulk commentary; **excluded** — the OCR is garbled (gate: garbled material may be discarded, `mining-sources.md` §4a.5). Surat al-Mulk is covered by vol. 15 of the main item.

## Page offset
Citations are PDF pages of `000078115`. Each volume restarts its printed pagination: vol. 1 printed = PDF; vol. 6 printed p. 5 = PDF 2326 (offset 2321). Volume title pages: 2 → p. 676, 3 → 1068, 4 → 1490, 5 → 1850, 6 → 2322, 8 → 3368, 9 → 3965, 10 → 4320, 11 → 4770, 12 → 5137, 14 → 5866, 15 → 6353 (vol. 7 starts ≈ p. 2773, vol. 13 ≈ p. 5511, no title page in the scan).

## Batch 1 (this commit)
Pages read: 1–30 (title, author's introduction and method, al-Fatiha, al-Baqara intro), 680–681 (Al Imran), 1074, 1496, 2322–2336 (al-Anfal), 2496–2503, 2515–2516 (al-Tawba), 2770–2772, 3061, 3196, 4392–4393 (al-Nur), 5763–5764 (al-Fath), 6353, 6900–6906 (end and colophon).
- Created: `source/tafsir-tantawi-wasit`; `concept/tafsir-bil-mathur`; `concept/add-al-ay`; `question/why-no-basmala-in-surat-al-tawba` (six perspectives, Sunni, `sensitivity: contested`).
- Enriched: `work/al-tafsir-al-wasit` (was a Wikidata draft card; now full record + ar/en/ur prose); `person/muhammad-sayyid-tantawi` (new section on the tafsir, dated stages of writing, lived_in Cairo); `concept/al-basmala` (Tantawi's account of the disagreement); sura prose `passage/quran-1, -2, -3, -8, -9, -24, -48` (new section "In Tantawi's al-Tafsir al-Wasit" in ar/en/ur; the script-generated passage YAML was left untouched).
- Doubts: the Wikidata id Q120484118 on the work was carried over from the earlier card and not re-checked (an Azhar committee work has a similar title). Composition start date is not stated (author says ~15 years; earliest dated preface 1395/1975).

## Next
Sura introductions for the remaining Medinan suras that carry museum events (al-Ahzab ~p. 4830?, al-Hashr ~p. 6182, al-Munafiqun p. 6262, al-Mumtahana, al-Hujurat p. 5805), then Meccan suras with notable makki/madani discussions (Yunus p. 2772, al-Ra'd p. 3196).
