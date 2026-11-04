# Library lane: Minhaj al-Sunna al-Nabawiyya (Ibn Taymiyya)

**Worker:** Claude Code (OCR-harvest worker C), run `ocr-harvest-2026-11-04`.

## Items and editions
| item | what it is | md5 (book.txt) | pages | used as |
|---|---|---|---|---|
| `1416_20210502` | Shamela digital export of the full text with Rashad Salim's apparatus (sigla ن م أ ل ب ك) | cbce5a91… | 2540 | `source/minhaj-sunna-shamela` — PDF page = Shamela footer page; digits in the export are often reversed («٨٢٧» = 728) |
| `AAlexandrina-154485` | vol. 2 of the first Bulaq printing, al-Matba'a al-Kubra al-Amiriyya, 1321 AH, with *Muwafaqat Sarih al-Ma'qul* in the margin | 2c843886… | 270 | `source/minhaj-sunna-bulaq-v2` — printed page = PDF − 5; OCR interleaves the margin text |
| `4_20260213_202602` | Rashad Salim ed., vol. 4, Dar al-Fadila reprint (permission 6/2/1424 AH) | f5eee2d7… | 831 | `source/minhaj-sunna-salim-v4` — PDF pages cited (margins carry Bulaq refs) |
| `minhaj_sona` | Rashad Salim ed., vol. 8, 1st ed. 1406/1986 | 3c942364… | 599 | `source/minhaj-sunna-salim-v8` — printed page = PDF page |

No byte-identical items.

## Done (4 Nov 2026), batch 1
Read: Shamela pp. 1–27 (title, table of contents, preface), 47–68 (later Imamis and the Mu'tazila; al-Hilli's introduction and the first replies), 90–93 (al-Hilli's chapter 1), 345, 1883, 2367, 2376, 2404, 2529–2540; Bulaq v2 pp. 2–6, 219–221, 262–267; Salim v4 pp. 1–11; Salim v8 pp. 1–6, 440–445, 560–590 (sampled).
- New sources: `minhaj-sunna-shamela`, `minhaj-sunna-bulaq-v2`, `minhaj-sunna-salim-v4`, `minhaj-sunna-salim-v8`.
- Enriched: `work/minhaj-al-sunnah` (draft Wikidata card → full ar/en/ur, `sensitivity: polemical`), `work/minhaj-al-karamah` (→ full ar/en/ur from Ibn Taymiyya's quotations), `person/al-allama-al-hilli` (names, faith with basis, relation, ar/en/ur prose; dates NOT added — not read on a page).
- New question cards (Sunni/Hanbali view first, then the Imami view as quoted by Ibn Taymiyya; `sensitivity: contested`): `is-the-imamate-the-most-important-matter-of-religion`, `must-the-imam-be-infallible`, `did-the-prophet-indicate-abu-bakr-as-successor`, `did-ali-found-the-science-of-kalam`, `was-muawiya-a-scribe-of-the-revelation`.

## Flags
- Every Imami position in these records is taken from Ibn Taymiyya's quotation of al-Hilli; each card says so and that the Imami view in their own books is still to be added.
- Polemical passages (likening the Imamiyya to Jews, the accusation over the Tatars at Baghdad, Bulaq v2 p. 263) are recorded only in the work page, attributed to the author, under a heading naming them as his positions.
- `person/khudabanda` and `person/oljaitu` look like duplicates of the same Ilkhan (one from al-Suyuti, one richer); not merged here — linked to `person/oljaitu`.

## Excluded
- Nothing excluded as garbled; the Bulaq v2 pages where margin and main text interleave were not used except where the sequence is clear.

## Next
The long digression on the eternity of the world (Shamela pp. 105–275: Ibn Sina, Abu al-Barakat Ibn Malka, Democritus, Abu Bakr al-Razi, the atom), chapter 2 on Ali's virtues (pp. 345ff.), chapter 4 on the Twelve (pp. 2367ff.), and the persons the preface names (Ibn Saba as reported, the Sabaiyya, al-Nawbakhti's Firaq al-Shi'a as cited by the editor).

## Second run (4 Nov 2026)
- Duplicate resolved: `person/khudabanda` (draft, al-Suyuti p. 735) merged into `person/oljaitu` as an alias; its one cited sentence carried into the oljaitu prose (ar/en/ur) with source `tarikh-khulafa-minhaj-1434`; the duplicate's data and prose files deleted.

## Third run (4 Nov 2026), batch 7 — deep pass
Page note: the Shamela table of contents numbers (digits reversed in the export) run about 12 below the PDF/footer page; all citations use the PDF page, which equals the "NNNN Shamela.org" footer.
Read: Shamela pp. 5–12 (full table of contents), 1078–1083 (the twelfth imam), 1128–1133 (wiping the feet), 1142–1147 (Fatima's inheritance), 1355–1361 (Yazid, al-Husayn, Ashura), 1785–1806 (the ten causes), 2112–2118 (Ghadir).
- New question cards (Ibn Taymiyya first; the Imami or other positions only as he quotes them, each card saying so; `sensitivity: contested`): `must-the-feet-be-washed-in-wudu`, `do-prophets-leave-an-inheritance`, `how-should-yazid-ibn-muawiya-be-judged`, `how-should-the-killing-of-al-husayn-be-judged`, `does-the-ghadir-hadith-designate-ali-as-imam`, `did-al-hasan-al-askari-leave-a-son`.
- New concept: `asbab-suqut-al-uquba` (the ten causes that avert punishment for sins).
- Flags: Ibn Taymiyya's descriptions of Shi'i Ashura rites and of the occultation are an opponent's, recorded attributed to him; the editor's footnotes (al-Kafi narrative, Ahmad Subhi) are labelled as the editor's.

## Next
The verse of wilaya (pp. ~1936ff.), the hadith of the rank of Aaron (~2119), Fadak as gift (1148–1160), Khalid and Malik ibn Nuwayra (1323), the eternity-of-the-world digression (105–275).
