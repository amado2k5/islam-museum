# Library lane: Nayl al-Awtar — al-Shawkani (d. 1250 AH)

**Book id:** `nayl-awtar` · worker: Claude Code (OCR-harvest worker A), run `ocr-harvest-2026-11-04`.

## Items (`books/hadith/nayl-awtar/`)
| item | pages | md5 (8) | what it is | used |
|---|---|---|---|---|
| `AAlexandrina-124014` | 396 | f25e0224 | old printing, vol. 2, 'Awn al-Bari in the margin | **yes** (chapter table, a few body pages) → `source/nayl-awtar-awn-bari-hamish` |
| `AAlexandrina-128364` | 382 | 00279b18 | same printing, vol. 3 | **yes** (title page, chapter table) |
| `AAlexandrina-132076` | 380 | 9b0f0422 | same printing, vol. 5 | **yes** (title page, chapter table, 'Awn al-Bari colophon) |
| `4-1_20240815_202408` | 672 | 65e93add | al-Shawkani's *Fath al-Qadir* (tafsir), vol. 4, Dar al-Kalim al-Tayyib — misfiled here | not used |

The Alexandrina OCR is poor; citations give volume + PDF page. Vol. 1 (with any introduction) is not in the folder; the imprint (place, year) was not found.

## Batch 1 (4 Nov 2026)
- New: source; `work/awn-al-bari` (first half completed 1 Sha'ban 1293, Bhopal), `work/al-tajrid-al-sarih`, `person/ahmad-al-sharji-al-zabidi` (name only, no dates in the pages read).
- Rewritten: `work/nayl-al-awtar-shawkani` (was a Devin Wikidata draft card): method and contents of vols. 2, 3, 5.
- Enriched: `person/siddiq-hasan-khan` (prose section, authored edge, source).
- Stub: `place/bhopal` in `data/_stubs.d/claude-ocr-harvest-a.yaml`.
- Not asserted: the author of *Muntaqa al-Akhbar* (not named in the pages read), so no `commentary_on` edge to a Muntaqa record.
