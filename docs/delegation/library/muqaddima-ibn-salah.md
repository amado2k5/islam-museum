# muqaddima-ibn-salah: Ibn al-Salah, Ma'rifat Anwa' Ilm al-Hadith (Muqaddima)

- Lane: OCR harvest, worker F (Claude Code, claude-opus-5-5, run ocr-harvest-2026-11-04)
- Text: `harvest-text/books/hadith-sciences/muqaddima-ibn-salah/` (not in git)

## Items
| Item | What it is | Used |
|---|---|---|
| `MughadimatIbnSalah` | Nur al-Din Itr's edition with his notes. Printed page = PDF page. No imprint page, so publisher and year are unknown. | yes: `source/muqaddima-ibn-salah-itr` |
| `AAlexandrina-109485` | Older print or manuscript, poor OCR | not used |
| `nuruosmaniye-607`, `nuruosmaniye-608` | Nuruosmaniye manuscripts, OCR largely unreadable | excluded |

## Records
New
- `source/muqaddima-ibn-salah-itr` (self-listing)
- `question/tashih-al-hadith-fi-al-usur-al-mutaakhkhira` (trio): Ibn al-Salah's ban on later authentication, against al-Nawawi and al-Iraqi, with al-Suyuti's reconciliation (pp. 16–17)
- `question/ifadat-ma-ittafaqa-alayhi-al-shaykhan-al-qat` (trio): Ibn al-Salah's view that hadith agreed by both Sahihs yield certainty, against al-Nawawi's view that they yield probability (pp. 27–29)
- prose trio for `work/muqaddimat-ibn-al-salah`

Enriched
- `work/muqaddimat-ibn-al-salah`: was a Wikidata draft card. It is now published, covering the title, the 65 types, the definitions of sahih and hasan, his known positions and the edition.
- `person/ibn-al-salah`: section from his book, covering the definition, the two disputed views, and the teachers who appear in his closing chains.
- `concept/adalat-al-sahaba`: Ibn al-Salah's definition of a Companion and his statement on their uprightness (pp. 293–294).

## Notes
- The footnotes are the editor's. Views of al-Nawawi, al-Iraqi and al-Suyuti are cited as Itr quotes them and attributed to him.
- Page 19's folio is misread by the OCR. Pages cited in this batch were checked against the printed folios.

## Second pass (worker F, run 2, ocr-harvest-2026-11-04)
Batch C — the technical terms of hadith criticism (types 9–22; printed = PDF, pp. 51–102), with al-Kifaya (Hyderabad) where al-Khatib is quoted:
- New concept trios: `concept/munqati` (type 10, pp. 56–59), `concept/mudal` (type 11, pp. 59–61), `concept/muanan` (appendices 1–3, pp. 61–67; Muslim vs proven-meeting view as Sunni perspectives), `concept/muallaq` (appendix 4, pp. 67–70; Ibn Hazm on the ma'azif hadith), `concept/shadhdh` (type 13, pp. 76–80; three definitions), `concept/itibar` (type 15, pp. 82–85), `concept/ziyadat-al-thiqa` (type 16 + appendix 5, pp. 71–72, 85–88; Kifaya p. 411), `concept/mudtarib` (type 19, pp. 93–95), `concept/mudraj` (type 20, pp. 95–98), `concept/maqlub` (type 22, pp. 101–102).
- Enriched (hadith-science sections appended, published): `concept/irsal-fiqh` (the mursal: type 9 pp. 51–56 + Kifaya pp. 384–387, 404; perspectives al-Shafi'i / Malik–Abu Hanifa / hadith critics), `concept/tadlis` (type 12 pp. 73–76 + Kifaya pp. 355–356). Both were fiqh-encyclopedia headwords; reused rather than duplicated.
- Not created: `concept/munkar` (exists as the fiqh sense "wrongdoing"; the hadith sense of type 14 still needs a home — candidate id `concept/al-hadith-al-munkar`), mu'allal (concept/illa is the usul sense), mawdu' (concept/wad-al-hadith exists).
