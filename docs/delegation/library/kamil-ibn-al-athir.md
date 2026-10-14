# Lane: lib-kamil — al-Kamil fi'l-Tarikh (Ibn al-Athir)

## Source
- Book: الكامل في التاريخ — Izz al-Din Ali b. Muhammad al-Jazari, Ibn al-Athir (d. 630 AH). Annalistic universal history.
- Scan (raw): `raw/library/tareekh/kamil-tarikh/AAlexandrina-129185.pdf` — vol. 2, years 1–40 AH (Hijra to Ali's era), 528 pp image scan. `02-163053.pdf` is the same volume (768 pp).
- OCR workspace (not in git): `books/tareekh/kamil-tarikh/v1/` — Apple Vision, `ocr_apple_vision.py`.

## Method
Same as lib-fihrist: read page ranges, reuse entities, create person/place/event/concept records, cite `{cite:kamil-ibn-al-athir p. N}` (printed page of the scan's edition). Validate, commit, push each batch. OCR/scans never enter git.

## Progress
- Setup: workspace + source/work records; OCR running (528 pp).

## Progress (cont.)
- The 528-page Törnberg scan turned out to cover AH ~295–373 (Muqtadir → Adud al-Dawla), not AH 1–40 as the filename suggested — OCR was treated as authoritative.
- Mined 16 batches end to end: Ibn al-Mu'tazz coup (296), Aghlabid collapse, Sistan 298, Ibn al-Furat executions, al-Hallaj 309, al-Tabari 310, Qarmatian Iraq 312, deposition crisis 317 (Mecca massacre), Mu'nis & Muqtadir's killing 320, Qahir's blinding, Shalmaghani trial, Mardavij & Asfar, first amir al-umara', Abu Yazid's revolt, Rus sack of Barda'a 332, Mustakfi blinding & Buyid takeover 334, Black Stone's return 339, Rayy 340, Umran ibn Shahin, Imad al-Dawla's death 338, Ayn Zarba 347, Aleppo sack 351, mosque curses 351, Rukn al-Dawla's Tabaristan, Mu'izz al-Dawla's death & the racing couriers 356, Muttaqi's death 357, Byzantine Antioch 358, Jawhar's Egypt conquest, Abu Firas killed 361, al-Ta'i's accession 363, Adud's Iraq entry 362, Qarmatian march on Egypt 363, Mu'izz li-Din Allah's death & al-Aziz 365, Bakhtiyar killed 367, Adud takes Mosul 367, Abu Taghlib killed 369, Umran ibn Shahin's death after 40 years, Hasanwayh the Kurd, Kalbid Calabria campaign 373, Thabit ibn Sinan d.365.
- Volume exhausted through the printed index (ends ~AH 373). The second scan `02-163053.pdf` (768 pp) duplicates the same volume — spot-checked.
- Volume DONE. Next: Ansab al-Ashraf scans (already OCR'd).
