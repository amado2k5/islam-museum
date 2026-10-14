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

## Progress (cont. 2) — the 562–629 volume
- Second local scan `kamilt00_201908` (OCR text `book.txt`, printed-page markers `[pN]`) covers annals 562–629: Salah al-Din era through the Mongol eruption and Jalal al-Din's collapse.
- Mined: Babayn 562 / Alexandria defense, Ayla ships-by-camel 566, Egypt's Sunni judiciary set-pieces 566, Aleppo succession 577 (Izz al-Din Mas'ud, Zangi II), Ibn Ghaniya's Ifriqiya 581, Turkmen-Kurd fitna, Raynald's Red Sea fleet 578 (Husam al-Din Lu'lu's naval chase), Ramla/Montgisard 573, Hama 573, Hattin 583 (al-Afdal's tent scene), Acre 587 prisoner massacre, Barbarossa 586/590, Salah al-Din's death 589, Tughril III 590 ending the western Seljuks, Shihab al-Din Ghuri's assassination 602 + his sira, Fakhr al-Din al-Razi, Qutb al-Din Aybak, Taj al-Din Yildiz, Khwarazmshah's Qara Khitay capture/escape 604, Ibn Khurmil's Herat waterworks 604, Qara Khitay annihilation, Georgian Qars 604, the 617 annal — the 'would that I had died' lament, ethnography of the Tatars, the hide-tub Jayhun crossing, Mazandaran taken (unconquered since 90), Khwarazmshah's death at Abaskun + his sira (the Prophet's-chamber servant anecdote), Rayy/Qazvin/Hamadan sweep 617, Aqush defection, Tiflis fight, Maragha sack 618 (captive-shield assault, the false all-clear), al-Adil's obituary (the Afdal pattern, the sons' partition), al-Nasir's obituary (futuwwa monopoly, the Tatar-correspondence charge), Damietta siege detail (Ibn al-Mashtub conspiracy, Kamil's night flight), Jerusalem cession 626 terms, Yassichimen 627, al-Ashraf takes Damascus 626, the 628 Diyar Bakr/Jazira raid (Is'ird, the Qurayshiyya Kurds, 'la billah' taunt-song), Jalal al-Din's Tiflis conquest 623 (first since 515), Qatada of Mecca and son Hasan's regicide + amir al-hajj killing 618, Wasit Batini pogrom (~600), Himyari's al-Ahmadiyya on the Mirbat coast 609, al-Mu'azzam's scholar-obituary 624.
- Volume mined through 629; remaining yield is minor (petty annals, obituary stubs). Lane essentially complete for this scan.
