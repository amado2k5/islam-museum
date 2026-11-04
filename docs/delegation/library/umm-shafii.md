# Library lane: Kitab al-Umm (al-Shafi'i) — OCR-harvest worker D

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker D), claude-opus-5-5.

## Items in `books/fiqh/umm-shafii/`

All four items (AloumShafiee, alom00_201911, alom08_202205, 8_20211129_20211129_1028) are byte-identical (md5 67eebf21…): one volume, **vol. 8 of the Dar al-Wafa' edition** (ed. Rif'at Fawzi Abd al-Muttalib, Mansura, 1st ed. 1422/2001, 788 PDF pp.). Source: `source/kitab-al-umm-wafa-v8`. **Printed page = PDF page.** Clean OCR of a typeset edition.

Contents: (65) Kitab al-Da'wa wa-l-Bayyinat p. 5; (66) Kitab al-Shahadat p. 107; Kitab al-Ayman wa-l-Nudhur p. 149; (68) Ikhtilaf al-Iraqiyyin p. 217; (69) Ikhtilaf Ali wa Ibn Mas'ud p. 391; (70) Ikhtilaf Malik wa-l-Shafi'i p. 513–~784; index p. 785 ff.

## Batch 1 (this commit)

Pages read: 1–7, 15–19, 217–218, 391–392, 513–514, 541–544; running heads throughout.

- Created: `source/kitab-al-umm-wafa-v8`; works `ikhtilaf-al-iraqiyyin`, `ikhtilaf-ali-wa-ibn-masud`, `ikhtilaf-malik-wal-shafii` (part_of al-Umm); `concept/al-qada-bil-yamin-maa-al-shahid` (perspectives), `concept/tadmin-al-sunna` (perspectives: Abu Hanifa, Abu Yusuf, Ibn Abi Layla, al-Shafi'i), `practice/raf-al-yadayn-fil-salah` (perspectives) — all with ar/en/ur prose.
- Enriched: `work/kitab-al-umm` (was a Wikidata draft; full data and prose), `concept/khabar-al-ahad` (al-Shafi'i's rule, pp. 513–514), `practice/salat-al-kusuf` (p. 514), `person/muhammad-ibn-abd-al-rahman-ibn-abi-layla` (p. 217).

## Flags

- The opponents in "al-khilaf fi al-yamin ma'a al-shahid" are "ba'd al-nas", unnamed on the pages read; the museum does not name them. The addressees of Ikhtilaf Ali wa Ibn Mas'ud are likewise not named by the museum.
- Ikhtilaf Malik wa-l-Shafi'i is al-Shafi'i's critique of Malik; Maliki answer marked needs_source.

## Next

Kitab al-Shahadat (p. 107 ff.: testimony of women, of the blind, of the slave), Kitab al-Ayman (p. 149 ff.), more questions from Ikhtilaf al-Iraqiyyin (shuf'a p. 245, muzara'a p. 253) and Ikhtilaf Malik (jahr bi-amin p. 545, nikah bi-ghayr wali p. 610, aqall al-sadaq p. 613).
