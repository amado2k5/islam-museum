# Lane: lib-fihrist — al-Fihrist (Ibn al-Nadim)

## Source
- Book: كتاب الفهرست — Abu al-Faraj Muhammad b. Ishaq al-Nadim (d. ~380s AH). The tenth-century bibliographic encyclopaedia: books, authors, sects, scripts, sciences.
- Scan (raw): `raw/library/tareekh/fihrist-ibn-nadim/20210224_20210224_2152.pdf` — Al-Furqan Islamic Heritage Foundation ed. (Ayman Fu'ad Sayyid), 2 vols, 981 pp. Other scans: AAlexandrina-192984 (536pp), ar106biog72 + hm1941 (545pp, likely same printing).
- OCR workspace (not in git): `books/tareekh/fihrist-ibn-nadim/furqan/` — Apple Vision, `ocr_apple_vision.py`.

## Method
Same as lib-muruj-dhahab/lib-muqaddima: read page ranges, reuse entities, create work/person/concept records (the distinctive yield is bibliographic — book titles, authors, translators, sects, firsts), cite `{cite:fihrist-ibn-al-nadim p. N}`. Validate, commit, push each batch. OCR/scans never enter git.

## Progress
- Setup: workspace + source/work/person records created; OCR complete (981 pp Furqan + 536 pp Alexandrina).
- Mined: all ten maqalat — scripts/revealed books/readers (m1), grammarians Basra+Kufa (m2), akhbaris/kuttab/musicians (m3), kalam sects Mu'tazila-Shi'a-Ismailiyya incl. Ibn Rizam's expose (m5), jurists incl. Tabari school/Zahiris/Kharijites (m6), philosophers-translators-physicians-geometers-astrologers (m7), asmar/khurafat/Kalila wa-Dimna/lovers' books (m8), Harranians-dualists-Mani-Khurramiyya-Sumaniyya-India-China (m9), alchemists incl. Ibn Wahshiyya's cipher alphabets (m10), plus the Takmila appendix fragments (Baghdad theologians, Dhu'l-Nun).
- Famous set-pieces extracted: Ma'mun's Aristotle dream, Hazar Afsan/Alf Layla attestation, Mani's dossier, Banu Musa/Euclid transmission, Abu Ma'shar-Kindi feud, Hallaj's capture at al-Sus, Seven Balagh graded initiations.
