# Library lane: صور من حياة الصحابة — عبد الرحمن رأفت الباشا (OCR-harvest worker E)

**Book id:** `suwar-hayat-sahaba` · category `sahaba` · worker E (claude-opus-5-5, run `ocr-harvest-2026-11-04`).

## Items
| Item | Edition | PDF pages | md5 | Used |
|---|---|---|---|---|
| `20250123_20250123_0839` | Dar al-Nafa'is, Beirut, 1st ed. 1412/1992 | 511 | dd879aa3… | **yes** → `source/suwar-min-hayat-al-sahaba-nafais-1992` |
| `20251231_20251231_0821` | same scan, second OCR | 511 | 8643000b… | no (duplicate) |
| `1997-swr_hayat_alsahaba-albasha` | 1997 printing | 588 | 8bf8aea3… | **excluded**: OCR in reversed visual order |
| `2006-swr_hayat_alsahaba-albasha` | Dar al-Adab al-Islami 1427/2006 | 572 | a15defe9… | **excluded**: same reversed OCR |

**Offset:** printed = PDF. Contents pp. 509–511; alphabetical index pp. 507–508.

## Done
- (4 Nov 2026) Batch 1 (6 entities): source; new `work/suwar-min-hayat-al-sahaba`, `person/abd-al-rahman-rafat-al-basha`; new Companions `rabia-ibn-kab-al-aslami` (pp. 361–368) and `salama-ibn-qays-al-ashjai` (pp. 489–496); al-Basha section added to `asim-ibn-thabit` (pp. 377–383). Fix in passing: duplicate `periods` key in `arwa-al-sulayhi` (from the previous batch merge).
- (9 Nov 2026) Batch 2 (5 targets, identity-resolved): `nuaym-ibn-masud` already carried the Trench stratagem — added attributed al-Basha chapter pp. 400–410 ar/en/ur; `fayruz-al-daylami` and `zayd-al-khayl` (= Zayd al-Khayr alias) already carried this book's enrichment — verified, no duplication; `majzaa-ibn-thawr` (Tustar tunnel, duel with Hormuzan, pp. 156–163) and `al-rabi-ibn-ziyad-al-harithi` (Umar's praise, Manadhir, Sijistan/Barwiz, Khurasan, pp. 419–427) enriched trilingual + relations. Rabi' kept distinct from `al-rabi-ibn-ziyad-al-bakri-al-khurasani`; Isaba lists him among tabi'in so `companion` role not asserted.

## Flags
- `person/burayda-ibn-al-husayb` and `person/buraydah-ibn-al-husayb` look like duplicates (not merged here; for the people lane).
- No event edge for Salama's Ahwaz campaign: `event/conquest-of-ahwaz` may be a different campaign.
- `al-rabi-ibn-ziyad-al-harithi`: Isaba (p. 455) lists him among tabi'in and questions Companion status — kept `roles: [general]`, no `companion`.

## Next
Thin records remaining in the book: scan `book.txt` index pp. 507–508 for other thin sahaba records (e.g. `ubaydallah-ibn-abi-bakra`, `fatima-bint-al-kharshub` flagged in earlier passes).
