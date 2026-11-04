# Library lane: Radd al-Muhtar ala al-Durr al-Mukhtar (fiqh, Hanafi) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/fiqh/radd-muhtar/` (all md5-distinct)

| item | what it is | used | source id | page offset |
|---|---|---|---|---|
| AAlexandrina-050183 (723 pp.) | Radd al-Muhtar vol. 3 (Itq → Waqf); imprint page illegible in OCR | yes | `source/radd-al-muhtar-scan-v3` | printed = PDF − 19 |
| AAlexandrina-147484 (530 pp.) | Radd al-Muhtar vol. 4 (Buyu' → Hiba), Bulaq, Dar al-Tiba'a al-Misriyya, early Sha'ban 1271 AH (colophon PDF p. 528) | yes | `source/radd-al-muhtar-bulaq-v4` | printed = PDF − 7 |
| AAlexandrina-109509 (536 pp.) | NOT Radd al-Muhtar: a later Egyptian Hanafi fatwa collection (questions dated 1260–1302 AH, cites Ibn Abidin's Tanqih al-Hamidiyya; probably al-Fatawa al-Mahdiyya, not verified) | no | — | — |
| xboxgamer-4308 (488 pp., scanned back to front) | NOT the gloss itself: a volume whose writer cites "my father" the author of the Tanqih and the Ottoman Majalla — probably vol. 1 of the son's Takmila (Qurrat Uyun al-Akhyar), from Kitab al-Da'wa; not verified | no | — | — |

OCR quality: readable but noisy (many misread letters); names checked in context; the corrector's name on v4 p. 528 read as «قطة» (OCR «قملة») and flagged in the source record.

## Batch 1 (this commit)

Pages read: v3 PDF pp. 3–22, 73–77, 495–498; v4 PDF pp. 2–10, 18–22, 31, 528.

- Created: `source/radd-al-muhtar-scan-v3`, `source/radd-al-muhtar-bulaq-v4`; concepts `itq-fiqh`, `istilad-umm-al-walad` (perspectives), `baghy-fiqh` (perspectives, sensitivity: contested — Ibn Abidin's passage on the Najdi movement, p. 497, recorded as his view; the movement's own view and an academic view marked needs_source), `bay-al-taati`, `bay-al-istijrar`, `nuzul-an-al-wazaif`, `kasad-al-nuqud` (perspectives) — each with ar/en/ur prose.
- Enriched: `work/radd-al-muhtar` (was a 1-line Wikidata draft; now full data + ar/en/ur prose), `person/ibn-abidin` (relations, new prose sections), `concept/mal-fiqh` (section from v4 p. 10), `concept/urf` (section on particular/general custom, v4 p. 21).
- Stubs (`data/_stubs.d/claude-ocr-harvest-d.yaml`): `work/al-durr-al-mukhtar`, `work/nashr-al-urf`, `work/tanbih-al-ruqud`.

## Contested points flagged

- `concept/baghy-fiqh`: Ibn Abidin's description of "the followers of Abd al-Wahhab" (v3 p. 497). The link to Muhammad ibn Abd al-Wahhab and the 1811–1818 war is the museum's reading of the context and is said so in the prose.

## Next

v3: Kitab al-Ayman (PDF ~86 ff.), Hudud, Sariqa, Siyar/jizya, Murtadd, Waqf (shart al-waqif); v4: riba (p. 183), salam (210), sarf (241), qada' (303), shahadat (378), wakala (408). Identify items 109509 and xboxgamer-4308 from their title pages and harvest as their own works.
