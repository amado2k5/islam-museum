# Lane: lib-fihrist — al-Fihrist (Ibn al-Nadim)

## Source
- Book: كتاب الفهرست — Abu al-Faraj Muhammad b. Ishaq al-Nadim (d. ~380s AH). The tenth-century bibliographic encyclopaedia: books, authors, sects, scripts, sciences.
- Scan (raw): `raw/library/tareekh/fihrist-ibn-nadim/20210224_20210224_2152.pdf` — Al-Furqan Islamic Heritage Foundation ed. (Ayman Fu'ad Sayyid), 2 vols, 981 pp. Other scans: AAlexandrina-192984 (536pp), ar106biog72 + hm1941 (545pp, likely same printing).
- OCR workspace (not in git): `books/tareekh/fihrist-ibn-nadim/furqan/` — Apple Vision, `ocr_apple_vision.py`.

## Method
Same as lib-muruj-dhahab/lib-muqaddima: read page ranges, reuse entities, create work/person/concept records (the distinctive yield is bibliographic — book titles, authors, translators, sects, firsts), cite `{cite:fihrist-ibn-al-nadim p. N}`. Validate, commit, push each batch. OCR/scans never enter git.

## Progress
- Setup: workspace + source/work/person records created; OCR of Furqan ed. running (981 pp).
