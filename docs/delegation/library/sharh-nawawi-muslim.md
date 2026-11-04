# Library lane: al-Minhaj Sharh Sahih Muslim — al-Nawawi (d. 676 AH)

**Book id:** `sharh-nawawi-muslim` · category `hadith` · worker: Claude Code (OCR-harvest worker A), run `ocr-harvest-2026-11-04`.

## Items (`books/hadith/sharh-nawawi-muslim/`)
| item | pages | md5 (8) | what it is | used |
|---|---|---|---|---|
| `SahihMuslimSharhNawawi` | 248 | — | al-Matba'a al-Misriyya bi-l-Azhar 1st ed. 1347/1929, vol. 1 (introduction + Muslim's muqaddima) | **yes** → `source/sharh-nawawi-misriyya-1347-v1`; printed = PDF |
| `al-minhaj`, `minhaj-sahih-muslim` | 674 each | 4ef3f342 (identical) | al-Risala "Mawsu'at Shuruh Kutub al-Sunna" ed. Mahir Jaywash, vol. 2 | not yet; duplicate pair |
| `20191210_20191210_1233` | 2,068 | — | Sahih text edition keyed to Fath al-Bari numbering | not used |

## Batch 1 (4 Nov 2026) — al-Nawawi's introduction (pp. 2–36)
- New: `source/sharh-nawawi-misriyya-1347-v1`, `concept/mustakhraj`; prose for `work/al-minhaj-sharh-sahih-muslim` (yaml rewritten from a Wikidata draft card) and `work/al-ilzamat-ala-sahih-al-bukhari` (draft card enriched; al-Daraqutni vs al-Nawawi perspectives).
- Enriched: `work/sahih-muslim` (transmission, Abu Zur'a and Ibn Wara episode, distinctions), `concept/shart-al-shaykhayn` (Ibn al-Salah's definition via al-Nawawi).
- Also fixed `tour/halls.yaml` stop for `event/conquest-constantinople-857` to mirror the record's sources (validator rule) after the Silsila batch added a source.
- Note for the coordinator: precheck now reports other tour stops out of sync (conquest-of-mecca, al-khwarizmi, iman, al-jabr, ihya) — not touched by worker A.
