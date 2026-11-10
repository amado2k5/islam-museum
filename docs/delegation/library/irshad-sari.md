# Library lane: Irshad al-Sari li-Sharh Sahih al-Bukhari — al-Qastallani (d. 923 AH)

**Book id:** `irshad-sari` · category `hadith` · worker: Claude Code (OCR-harvest worker A), run `ocr-harvest-2026-11-04`.

## Items (`books/hadith/irshad-sari/`)
| item | pages | md5 (8) | what it is | used |
|---|---|---|---|---|
| `1323_20210120` | 136 | a89583fc | Shamela digital text (PDF export) of the 7th Amiriyya ed. 1323 AH — the commentator's introduction | **yes** → `source/irshad-sari-amiriyya-1323` (cited by export page) |
| `AAskZad-1239831` | 531 | 75553a72 | Bulaq 6th ed. 1304 AH vol. 1; al-Nawawi's Sharh Muslim in the margin; OCR interleaves the two texts | title page + contents only → `source/irshad-sari-bulaq-1304` |
| `1-1886-1888` | 692 | 522f0a22 | NYU Bobst library scan of a Bulaq printing (vol. 1) | no — same text, not needed |
| `alfirdwsiy2018_gmail_2677` | 2,398 | d972655c | lithograph printing; OCR very poor | **excluded** (garbled) |

## Batch 1 (4 Nov 2026) — the introduction (chs. 1–4)
- New: `source/irshad-sari-amiriyya-1323`, `source/irshad-sari-bulaq-1304`, `concept/shart-al-shaykhayn` (al-Hakim vs Ibn Tahir al-Maqdisi and al-Hazimi; Bukhari-vs-Muslim ranking; "jaza al-qantara"), prose for `work/irshad-al-sari` (yaml rewritten from a Wikidata draft card).
- Enriched: `event/beginning-of-tadwin` (al-Qastallani's and Ibn al-Athir's accounts appended).
- **Duplicates found, not merged (merging is submission-impacting, founder's call):** `person/al-qastallani-shihab-al-din` (richest, used), `person/al-qastalani`, `person/al-qastallani-ahmad` — all the author of Irshad al-Sari. Also `person/ibn-khuzayma` vs `person/ibn-khuzayma-muhammad`, and `person/ibn-al-qaysarani` (the hadith scholar) vs `person/ibn-al-qaysarani-muhammad` (the poet — different person, OK).
- Not used: ch. 5 (al-Bukhari's life) — `person/al-bukhari` already rich; ch. 3 term definitions — candidates for concept pages.

## Duplicate merges (OCR-harvest worker A, second run, 4 Nov 2026)
- Correction to the note above: `person/al-qastalani` and `person/al-qastallani-ahmad` are Abu al-Abbas Ahmad b. Ali al-Qastallani (d. Mecca 636 AH), pupil of Abu Abd Allah al-Qurashi, not the author of Irshad al-Sari. They were merged (`al-qastalani` is now an alias of `al-qastallani-ahmad`). `person/al-qastallani-shihab-al-din` (d. 923 AH, author of Irshad al-Sari) stays a separate record, and so do his son-namesakes `qutb-al-din-al-qastallani` and the Ottoman `muslih-al-din-al-qastallani`.
- Also merged: `ibn-khuzayma-muhammad` into `ibn-khuzayma`; `qawwam-al-sunna-ismail` into `ismail-al-taymi` (the Isfahani hafiz's death date corrected to 10 Dhu al-Hijja 535 = 17 July 1141, derived; en/ur prose said 434 for 534); `al-iraqi-zayn-al-din` into `abd-al-rahim-al-iraqi` (the alias had been declared but the duplicate file was still present). All relations and wiki links repointed; the generated `data/time-browser-media-index.json` still lists the old ids until it is regenerated.
