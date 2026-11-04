# Library lane: Bada'i' al-Sana'i' (al-Kasani) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/fiqh/badai-sanai/` (all md5-distinct)

| item | what | used |
|---|---|---|
| hanafi_01_20150718 (760 pp.) | vol. 1, ed. Ali Muhammad Mu'awwad & Adil Ahmad Abd al-Mawjud, Dar al-Kutub al-Ilmiyya, 2nd ed. 1424/2003 | yes → `source/badai-sanai-ilmiyya-v1` (printed = PDF page) |
| 02_20200513_20200513_1916 (679 pp.) | vol. 2, Dar al-Ulum edition (ed. Muhammad Tamir et al.; OCR of title poor) | no |
| BEDAIUSSANAII…02 (678 pp.) | vol. 2, same Dar al-Ulum edition (different scan) | no |
| 7_20200905 (398 pp.) | vol. 7, 2nd edition (publisher not read) | no |

## Batch 1 (this commit)

Pages read: 1–2, 73–80 (editors' biography of al-Kasani and Fatima, Tuhfa/Bada'i', manuscripts), 87–90 (author's preface, start of Kitab al-Tahara).

- Created: `source/badai-sanai-ilmiyya-v1`, `work/tuhfat-al-fuqaha`, `concept/taswib-al-mujtahidin` (perspectives, contested).
- Enriched from Wikidata draft cards to full records with ar/en/ur prose: `work/badai-al-sanai`, `person/ala-al-din-al-kasani` (death 10 Rajab 587, Halawiyya, burial outside Aleppo), `person/fatima-al-samarqandi`, `person/ala-al-din-al-samarqandi`.

## Flags

- The editors' biography quotes al-Jawahir al-Mudiyya / Ibn al-Adim without clear quotation boundaries; reports are attributed to the sources they name.
- al-Samarqandi's kunya is given as Abu Bakr (p. 77) and Abu Mansur (p. 88); both recorded.
- The Rumi jurist in the debate is unnamed; left unnamed.

## Next

Vol. 1 text (Kitab al-Tahara, al-Salat) for madhhab questions; the editors' general introduction pp. 5–70 (sources of law; life of Abu Hanifa pp. 70–73).
