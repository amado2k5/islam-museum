# Library lane: al-Mustasfa min Ilm al-Usul (al-Ghazali) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/usul/mustasfa/` (all md5-distinct)

| item | what | used |
|---|---|---|
| 1_20200201_20200201_1051 (450 pp.) | vol. 1, ed. Hamza ibn Zuhayr Hafiz (Islamic University of Medina; intro dated 1 Ramadan 1413) | yes → `source/mustasfa-hafiz-v1` (PDF pages; printed numbering irregular) |
| mostasfa_min_3ilm_ossol (778 pp.) | vol. 3, same edition | yes → `source/mustasfa-hafiz-v3` (printed = PDF) |
| AAskZad-1238403 (447 pp.), BBib-Alex-09722 (424 pp.) | old prints with Fawatih al-Rahamut (likely Bulaq 1324) | not used |
| 1_20250323…, 2_20250323… | text layer unreadable (Latin garbage) | excluded: unreadable OCR |

## Batch 1 (this commit)

Pages: v1 PDF 1–7, 53–57, 63, 71–79, 97–101; v3 pp. 2, 199–202.

- Created: two sources, `work/al-mustasfa`, `concept/iqtida-al-nahy-al-fasad` (perspectives) — ar/en/ur.
- Enriched: `person/al-ghazali-abu-hamid` (section: death per Ibn al-Jawzi, 14 Jumada II 505).
- Book `mustasfa-ghazali` in books.yaml is the same work.

## Next

v3: dalalat al-mafhum, qiyas; v1: Pole 1 (definition of hukm, wajib, mubah); the editor's life of al-Ghazali pp. 9–56.

## lib-wave-21 batch (8 Nov 2026, Devin SWE-2 Flash)

Cited as `source/mustasfa` (the wave-21 book record); the same Hafiz-edition copies worker D registered as `source/mustasfa-hafiz-v1`/`v3`.

Enriched (existing entities; runs `lib-wave-21-mustasfa-1..4`):
- `concept/mafhum` — v3 dalalat al-alfaz, الضرب الخامس (printed pp. 413-415, 435-438): mafhum = dalil al-khitab definition, the denial-vs-affirmation dispute with al-Ghazali's own position, eight degrees of presumed negation, mafhum al-shart.
- `concept/qiyas` — v3 (printed pp. 654-657, 669-672): four ranked kinds of qiyas (mu'aththir → munasib → shibh → tard) and the four pillars with eight conditions on the asl.
- `concept/wajib-fiqh` — v1 muqaddima (printed folios 82-85 = PDF 165-168; v1 printed numbering irregular, the (NNN) folios were used): disputed definitions of wajib, the five-ahkam division, the gloss on ishar.
- `concept/hukm-ruling` — v1 muqaddima (printed folios 21-22 = PDF 102-103): hukm = khitab al-shar', no role for reason before revealed laws, la hukm illa lillah.

Skipped: `concept/iqtida-al-nahy-al-fasad` — already created/enriched by worker D; `person/al-ghazali-abu-hamid` — already enriched by worker D.

Remaining next: v3 dalalat al-mafhum remainder and qiyas chapter body (ithbat al-qiyas, arkan detail); v1 editor's life of al-Ghazali pp. 9-56.
