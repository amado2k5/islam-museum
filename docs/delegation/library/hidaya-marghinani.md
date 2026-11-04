# Library lane: al-Hidaya Sharh Bidayat al-Mubtadi (al-Marghinani) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/fiqh/hidaya-marghinani/`

| item | what | used |
|---|---|---|
| 20260610_20260610_0648 (544 pp.) | vol. 1 of the Sa'id Bakdash edition, Dar al-Siraj, Medina, 1440/2019 | yes → `source/hidaya-bakdash-v1` (printed = PDF page) |
| hsbmubtdi (544 pp.) | same vol. 1 (different md5, same title/intro text) | duplicate, not used |
| 20250906_20250906_2029 (3929 pp.) | apparently the full Bakdash set in one file | not used this batch |
| 5_20200622_202006 (547 pp.) | a different edition ("طبعة جديدة ملونة") | not used |

## Batch 1 (this commit)

Pages read: editor's introduction and study pp. 2–13, 14–37, 50–61, 98–102.

- Created: `source/hidaya-bakdash-v1`; works `bidayat-al-mubtadi`, `kifayat-al-muntahi`, `al-tajnis-wal-mazid`; stub `work/mukhtasar-al-quduri`.
- Enriched (from Wikidata draft cards to full records with ar/en/ur prose): `work/al-hidayah-marghinani`, `person/burhan-al-din-al-marghinani` (birth 8 Rajab 511, death 14 Dhu al-Hijja 593, burial Samarqand, teachers, sons, 12 works).

## Next

The text of al-Hidaya (Kitab al-Tahara onwards in the full-set item) for madhhab questions with Shafi'i/Maliki positions as al-Marghinani reports them; the editor's list of commentaries pp. 104–125 (stubs for al-Binaya, Ghayat al-Bayan, al-Nihaya, Nasb al-Raya).
