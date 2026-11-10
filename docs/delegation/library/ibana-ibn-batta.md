# Library lane: al-Ibana al-Kubra (Ibn Batta al-Ukbari)

**Worker:** Claude Code (OCR-harvest worker C), run `ocr-harvest-2026-11-04`.

## Items and editions
| item | edition | md5 | pages | used |
|---|---|---|---|---|
| `01-02-110472_202207` | Kitab al-Iman (vol. 1), ed. Rida ibn Na'san Mu'ti, Dar al-Raya, Riyadh, 2nd ed. 1415/1994 | fccc51d0… | 944 | yes → `source/ibana-kubra-muti-iman`; printed page = PDF page |
| `01-02-110472_202511` | same | fccc51d0… (byte-identical) | 944 | duplicate, not used |
| `20240818_20240818_0222` | ed. Adil ibn Abd Allah Al Hamdan, vol. 1, «سلسلة كتب السنة والاعتقاد (8)», 1436 AH (publisher's name partly illegible in OCR) | b25fd8cc… | 878 | not yet used (printed page = PDF page) |
| `20251215_20251215_1339` | same edition, a different scan (pages differ in OCR only) | 92337c26… | 878 | not used |

## Done (4 Nov 2026), batch 2
Read: Mu'ti study pp. 1–4, 21–60, 136–139; text pp. 760–761, 862–864.
- New: `source/ibana-kubra-muti-iman`, `question/may-one-say-i-am-a-believer-god-willing` (Ibn Batta first, then the editor's report of the "distinguishing" view of al-Ajurri and Ibn Abi al-Izz, the forbidding view and the obliging view).
- Enriched: `work/ibana-al-kubra-ibn-batta` (draft → full ar/en/ur), `person/ibn-batta-al-ukbari-ubayd-allah` (lineage, birth/death with Ashura note, travels, teachers, students, works, relations; ar/en/ur rewritten in full), `concept/iman` (new perspective `ibana-ibn-batta` + section in ar/en/ur).

## Flags
- `person/ibn-battah-al-ukbari` (Wikidata draft, referenced nowhere) duplicates `person/ibn-batta-al-ukbari-ubayd-allah`; it should become an alias of the latter (not done here: deleting/merging records is left to the coordinator).
- The "forbid" view on the exception in faith is unnamed in the editor's note; its holders (Hanafi/Maturidi) still need their own books.

## Next
Kitab al-Iman chapters on abandoning prayer (pp. 669ff.), signs of hypocrisy, increase/decrease (p. 831); the Hamdan edition for the Qadar chapters (pp. 860–872 there).

## Second run (4 Nov 2026)
- Duplicate resolved: `person/ibn-battah-al-ukbari` (Wikidata draft Q5984193, no prose, no inbound links) is now an `aliases` entry of `person/ibn-batta-al-ukbari-ubayd-allah`, which also takes its Wikidata id; the duplicate's data file deleted.

## Third run (4 Nov 2026), batch 8 — deep pass on Kitab al-Iman
Read (Mu'ti ed., printed = PDF): pp. 669–685 (abandoning prayer), 703–704 (hypocrisy, author's comments), 720–746 (sins that are unbelief short of unbelief), 884–906 (the Murji'a), index pp. 936–942.
- New: `concept/kufr-duna-kufr` (ar/en/ur).
- Enriched: `group/murjia` (draft, 510-byte ar → full ar/en/ur with Ibn Batta's chapter; perspective `ibn-batta-ibana`; status published, completeness 2 — the group's own words still missing), `concept/abandoning-prayer-takfir` (draft with ar only → ar enriched + new en/ur; perspective `ibn-batta-ibana`; the narrator garbled in al-Sallabi is identified by the Ibana editor as Abu Hurayra in al-Hakim, p. 673).
- Flags: Ibn Batta's verdicts on the Murji'a ("unbelief and misguidance") are recorded as his.

## Next
Hypocrisy chapter (pp. 685–704) for `concept/nifaq`; faith as fear and hope (pp. 756ff.); increase and decrease (pp. 806–861) for `question/does-faith-increase-and-decrease`; the Hamdan edition (Qadar).
