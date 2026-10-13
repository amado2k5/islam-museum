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
