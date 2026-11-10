# Library lane: الشفا بتعريف حقوق المصطفى — القاضي عياض (OCR-harvest worker E)

**Book id:** `shifa-qadi-iyad` · category `shamail` · worker E (claude-opus-5-5, run `ocr-harvest-2026-11-04`) · stubs `data/_stubs.d/claude-ocr-harvest-e.yaml`.

## Items and editions
| Item | Edition | Pages | md5 (book.txt) | Used |
|---|---|---|---|---|
| `AlshivaBiTa3rifMustafa` | Dar al-Kutub al-Ilmiyya, Beirut, 2 vols in one file, with al-Shumunni's Muzil al-Khafa' beneath; no date shown | 701 | bd8bba88… | **yes** → `source/al-shifa-ilmiyya-shumunni` |
| `AlshivaBiTarifMustafa` | same printing, vol. 1 only (its p. 1 = p. 2 of the above) | 382 | b1f8be77… | no (subset) |
| `ShifaTarifMustafaM` | facsimile of Walters Art Museum Ms. W.586 (Walters catalogue sheet p. 2) | 493 | e36289eb… | no (manuscript images, no usable OCR) |
| `bensaoud_gmail_20170321_1517` | Dubai International Holy Qur'an Award edition | 952 | cb6ad472… | no (OCR garbled) |

**Page offset:** vol. 1 printed = PDF − 7 (PDF 381 = 374); vol. 2 printed = PDF − 383 (PDF 478 = 95, 690 = 307). Citations use PDF pages.

## Structure (contents pp. 382–383, 698–701)
Biographies of Iyad (from Ibn Farhun's al-Dibaj) pp. 3–5 and al-Shumunni (from al-Badr al-Tali') pp. 6–7; author's preface pp. 8–17; Part 1 (God's honouring of the Prophet) pp. 18–381, incl. ch. 4 miracles from p. 253, i'jaz al-Qur'an pp. 265–287; Part 2 (people's duties) pp. 385–477; Part 3 ('isma and human states) pp. 478–593; Part 4 (rulings on disparaging him) pp. 594–697; colophon of Muzil al-Khafa' p. 696.

## Duplicate check (task note)
The task named `work/kitab-al-shifa` vs `work/al-shifa-bi-tarif-huquq-al-mustafa` as duplicates. They are **not**: `work/kitab-al-shifa` is Ibn Sina's philosophical Kitab al-Shifa' (Wikidata Q1030940, linked from `person/ibn-sina`, with prose on Avicenna). The confusion came from `work/nur-al-yaqin` (worker E, earlier run), which linked Qadi Iyad's Shifa to `work/kitab-al-shifa`; those four links (data + ar/en/ur) were repointed to `work/al-shifa-bi-tarif-huquq-al-mustafa`. Nothing was deleted.

## Done
- (4 Nov 2026) Batch 1 (7 entities): new `source/al-shifa-ilmiyya-shumunni`; `work/al-shifa-bi-tarif-huquq-al-mustafa` rewritten from a one-line Shadharat card (structure, method, i'jaz, miracles, 'isma, sabb al-sahaba; ar/en/ur); `person/al-qadi-iyyad` enriched (nasab, teachers, offices, Almohads, death, works; edges to teachers and places; prose trio rewritten keeping earlier facts); `person/al-shamunni` enriched (dates, life, works; prose trio rewritten); new `work/muzil-al-khafa-an-alfaz-al-shifa`; new `concept/ijaz-al-quran`; new `question/can-prophets-commit-minor-sins` (three Sunni views as Iyad reports them). Fix: `work/nur-al-yaqin` links. Pages read: 1–17, 263–287, 370–392, 526–540, 690–701.

## Flags
- Birth year: the OCR of the Dibaj biography reads Sha'ban "496", Shadharat gives 476; 476 kept in data, flagged in prose.
- The "died poisoned" report is a "qila" and is recorded as unsupported.
- The question card has only Sunni perspectives (all from al-Shifa); academic and Imami views still to add.

## Next
Part 2 chapters (love, reverence, salat, ziyara) could enrich `concept/mahabbat-al-nabi`, `concept/al-salat-ala-al-nabi`, `what-is-ziyara`; Part 4 is legally sensitive and was deliberately only summarised.
