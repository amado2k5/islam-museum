# Library lane: Bidayat al-Mujtahid wa-Nihayat al-Muqtasid (Ibn Rushd al-Hafid) — OCR-harvest worker L

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker L), claude-opus-5-5. Covers both book ids `fiqh/bidayat-mujtahid` and `fiqh/bidayat-mujtahid-ibn-rushd` (same work).

## Items (md5)

| item | what | used |
|---|---|---|
| bidayat-mujtahid/Bedayatt = bidayat-mujtahid-ibn-rushd/Bedayatt (md5 2c43b092…, byte-identical) | vol. 1, ed. Muhammad Subhi Hasan Hallaq, Maktabat Ibn Taymiyya / Maktabat al-Ilm, 1st ed. 1415 | `source/bidaya-hallaq-v1` (printed = PDF − 1) |
| bidayat-mujtahid/Bedayat = bidayat-mujtahid-ibn-rushd/Bedayat (md5 15191058…, byte-identical) | vol. 3, Dar al-Salam 1416/1995, with marginal commentary al-Sabil al-Murshid; editor's given name unclear in OCR | `source/bidaya-abbadi-dar-al-salam-v3` (printed = PDF + 1162; cites PDF) |
| bidayat-mujtahid/talib-al-ilm-776107e3… (md5 dc5e35ac…) | whole work in one vol., ed. Abu Aws Yusuf al-Bakri, Bayt al-Afkar al-Dawliyya (2007 card / printed 2009) | `source/bidaya-bakri-bayt-al-afkar` (printed = PDF) — main source |
| bidayat-mujtahid/4_20260211_20260211_2115 (md5 73991648…) | vol. 4 of 6, ed. Ali ibn Muhammad ibn Wanis et al., Dar Ibn al-Jawzi 1442 | `source/bidaya-ibn-wanis-v4` (cites PDF) |

## Batch 1

Pages: Bakri 1-23, 71-72, 111, 326-327, 1006-1008 and the kutub list; Hallaq PDF 1-36; Dar al-Salam PDF 1-14; Ibn Wanis PDF 1-10.

- Enriched: `work/bidayat-al-mujtahid` (was a thin Devin draft from al-A'lam; rewritten in full, ar/en/ur, kept the al-A'lam citation), `person/ibn-rushd` (bio from both editors' introductions; prose rewritten keeping the al-A'lam facts; birth/death, teachers, father, Seville, relations), `concept/qiyas` (new section on Ibn Rushd's definition).
- Created: four sources; `person/abu-al-abbas-ahmad-ibn-rushd` (father); questions `is-niyya-a-condition-of-wudu`, `does-a-pregnant-woman-menstruate`, `new-crescent-seen-by-day`, `ruling-of-the-aqiqa`, `hunting-with-trained-animals-other-than-dogs` (all with Sunni-school perspectives as Ibn Rushd reports them).
- Stub: `work/al-istidhkar`.
- Doubts: the father's kunya is given as Abu al-Abbas by Hallaq (kept as the source gives it). No date of composition found in the pages read.

## Next

Ibn Rushd's other causes-of-disagreement worked examples (zakat, nikah, buyu'); the Ibn Wanis introduction on manuscripts; the closing classification of sunan (p. 1008) as its own concept.
