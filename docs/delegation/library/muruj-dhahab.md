# Lane: lib-muruj-dhahab — Muruj al-Dhahab (al-Mas'udi)

## Source
- Book: مروج الذهب ومعادن الجوهر — Abu'l-Hasan Ali ibn al-Husayn al-Mas'udi (d. ~336)
- Scans (raw): `raw/library/tareekh/muruj-dhahab/` — AAlexandrina-000944 (804 pp), AAlexandrina-011911 (768 pp) + two smaller prints
- OCR workspace (not in git): `books/tareekh/muruj-dhahab/` — Apple Vision, `ocr_apple_vision.py` (same harness as tarikh-khulafa)
- Existing records: `source/muruj-al-dhahab` (Sharq al-Islamiyya print, from the Raheeq bibliography); `person/al-masudi`, `work/muruj-al-dhahab` created in this lane's setup

## Method
Same as lib-tarikh-khulafa: read OCR page ranges, reuse existing entities (the Futuh/TK corpus now covers most caliphs, commanders and conquests), create missing persons/places/groups/events/works, enrich with `{cite:muruj-al-dhahab p. N}`, validate, commit, push each batch. OCR/scans never enter git.

## Progress
- Setup: workspace + run_all.sh launched; `person/al-masudi` + `work/muruj-al-dhahab` created.
- [in progress] OCR vol 1 (804 pp) then vol 2 (768 pp).
- OCR complete on all four scans: 000944 (804pp = vol 2: Mu'awiya→al-Muti'), 011911 (768pp = vol 1: creation→'Ali + 132-bab TOC + hajj-leaders to 335), Qumayha vol1 (360pp), Mar'i (352pp). Mining from the two big scans.
- Batch 1 (pushed): Mu'tazila five usul + naming (pp. 208-210), wasil-ibn-ata, amr-ibn-ubayd, works al-Maqalat/al-Ibana/al-Tanbih, wasf portraits enrichments (pp. 51-52, 204).
- Batch 2 (pushed): al-Qahir's informant interrogation — caliph portraits & "firsts" (pp. 668-677), Zubayda/ayn-al-mushash/ghulamiyyat, Nawbakht/Ibrahim al-Fazari/Ali ibn Isa astrologers, Ibn Durayd.
- [in progress] Vol 1 (011911): pre-Islamic universal history, nations, seas/geography, Jahiliyya religion, calendars, temples; caliphal half mostly overlaps earlier lanes — cherry-pick distinctive anecdotes only.
- Batches 3–123 (pushed): vol 1 ethnography/religion/geography chapters + vol 2 caliph-by-caliph adab dossiers, Mu'awiya → al-Muti'.
- Batch 124 (pushed): vol 2 colophon — author's warning and traveller's apology, pp. 750-751.
- COMPLETE: both Dar al-Afriqiyya vols mined end to end (011911 to p721, 000944 to p751 colophon). Qumayha vol 1 and Mar'i scans are duplicate coverage of the same text — not mined separately. Lane finished at 13,536 validated entities, 0 errors.
