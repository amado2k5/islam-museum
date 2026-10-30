# Timeline Explorer story claims

Append-only. One line per change: `date | subject id | agent | claimed / done / blocked: <reason>`. Check here before starting a story; never take one claimed by the other agent. See EXPLORER-STORY-PIPELINE.md §3–§5.

2026-10-28 | person/salah-al-din-yusuf-ibn-ayyub | claude | done (data); images generating
2026-10-28 | person/al-ghazali-abu-hamid | claude | done (data)
2026-10-28 | person/khadija | claude | done (data)
2026-10-28 | person/umar-ibn-al-khattab | claude | done (data)
2026-10-28 | person/ibn-khaldun | claude | blocked: 3 eligible dated events (needs at least 4)
2026-10-28 | period/prophetic-era | claude | done (data)
2026-10-28 | period/rashidun | claude | done (data)
2026-10-28 | period/umayyad | claude | done (data)
2026-10-28 | period/abbasid-early | claude | done (data)
2026-10-28 | period/crusades-ayyubid-mamluk | claude | done (data)
2026-10-28 | period/gunpowder-empires | claude | done (data)
2026-10-28 | place/al-andalus | claude | done (data)
2026-10-28 | place/mecca | claude | done (data)
2026-10-28 | place/jerusalem | claude | done (data)
2026-10-28 | place/baghdad | claude | done (data)
2026-10-28 | place/cairo | claude | done (data)
2026-10-28 | place/cordoba | claude | done (data)
2026-10-28 | person/mehmed-ii | devin | claimed
2026-10-28 | person/mehmed-ii | devin | done (data); images generating (shared jobs file picked up by a running queue)
2026-10-28 | person/ibn-khaldun | claude | claimed (resuming; adding a 4th dated event so the story reaches 4 nodes)
2026-10-28 | place/delhi | devin | claimed
2026-10-28 | place/delhi | devin | done (data); image jobs staged at .cache/time-browser/jobs-delhi.json, GPU busy
2026-10-28 | person/ibn-rushd | devin | claimed
2026-10-28 | person/al-biruni-muhammad-ibn-ahmad | devin | claimed
2026-10-28 | person/al-khwarizmi | devin | claimed
2026-10-28 | person/ibn-khaldun | claude | done (data + 8 images; build not awaited, verified by validate and cite-check)
2026-10-28 | building/bayt-al-hikma | devin | claimed
2026-10-28 | building/great-mosque-cordoba | devin | claimed
2026-10-28 | person/tughril-beg | devin | claimed
2026-10-28 | person/ibn-rushd | devin | done (data); jobs-ibn-rushd.json staged
2026-10-28 | person/al-biruni-muhammad-ibn-ahmad | devin | done (data); jobs-al-biruni.json staged
2026-10-28 | person/al-khwarizmi | devin | done (data)
2026-10-28 | building/bayt-al-hikma | devin | done (data); jobs-bayt-al-hikma.json staged
2026-10-28 | building/great-mosque-cordoba | devin | done (data)
2026-10-28 | person/tughril-beg | devin | done (data) — Seljuks story, 13 nodes
2026-10-28 | person/khalid-ibn-al-walid | claude | claimed
2026-10-28 | person/al-farabi | devin | claimed
2026-10-28 | person/ibn-al-haytham | devin | claimed
2026-10-28 | person/umar-khayyam | devin | claimed
2026-10-28 | person/harun-al-rashid | claude | claimed
2026-10-28 | person/mansa-musa | devin | claimed
2026-10-28 | person/al-farabi | devin | done — 4 nodes (extra story beyond list)
2026-10-28 | person/ibn-al-haytham | devin | done — 4 nodes (extra)
2026-10-28 | person/umar-khayyam | devin | done — 4 nodes (extra)
2026-10-28 | person/mansa-musa | devin | done — 5 nodes (extra)
2026-10-28 | person/ibn-battuta-muhammad | claude | blocked: record has 2 dated nodes (birth, death); needs 2 cited journey events from source/rihla-ibn-battuta-1958, whose OCR on the drive covers only 9 of 257 pages (jaloute2003), so page numbers cannot be verified; moved to next story
2026-10-28 | place/damascus (Umayyad Damascus, 632-750) | claude | claimed; 5 nodes; images next
2026-10-28 | person/ibn-sina | claude | blocked: needs 2 more dated, cited events; Shadharat al-Dhahab mentions him only in passing; Gutas 2014 not on drive
2026-10-28 | place/cairo (Fatimid Cairo, 969-1171) | claude | claimed; 5 nodes; images next
2026-10-28 | period/mamluk | claude | blocked: no period record; period/crusades-ayyubid-mamluk already exists (1095-1517) and a place/cairo story now uses that id; needs a design decision (new period record with event tags, or a window subject with its own id)
2026-10-29 | polity/mamluk-sultanate (the Mamluks, 1250-1517) | claude | done — 13 curated nodes (Ayn Jalut 1260 to the capture of Cairo 1517); subject file lists its events
2026-10-28 | person/sulayman-al-qanuni | devin | claimed
2026-10-28 | person/al-idrisi-muhammad-ibn-abd-allah | devin | claimed
2026-10-29 | person/ibn-sina | claude | done — 7 nodes; 4 new events (1012 Gorgan, c.1014 Rayy, 1015 Hamadan vizierate, 1030 Khuzistan) from Wikipedia rev 1377286292, ledger recorded
2026-10-29 | person/ibn-battuta-muhammad | claude | done — 8 nodes, journey; 6 new events (1325-1353) from Britannica, ledger recorded
2026-10-29 | person/abu-bakr | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/uthman-ibn-affan | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/ali-ibn-abi-talib | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/abu-ubayda-ibn-al-jarrah | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/amr-ibn-al-as | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/muawiya-ibn-abi-sufyan | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/abd-al-malik-ibn-marwan | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/umar-ibn-abd-al-aziz | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/al-mansur | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/abd-allah-al-mamun | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/nur-al-din-mahmud-ibn-zangi | claude | done — story from existing cited events; Urdu label added
2026-10-29 | person/baybars | claude | done — story from existing cited events; Urdu label added
2026-10-28 | person/baybars | devin | claimed (the Mamluks story)
2026-10-28 | place/granada | devin | claimed
2026-10-28 | place/samarqand | devin | claimed
2026-10-28 | person/baybars | devin | done — Mamluks story, 16 nodes
2026-10-28 | place/granada | devin | done — 7 nodes
2026-10-28 | place/samarqand | devin | done — 4 nodes
2026-10-28 | person/ibn-jubayr-muhammad | devin | claimed
2026-10-28 | place/fes | devin | claimed
2026-10-28 | place/nishapur | devin | claimed
2026-10-28 | place/timbuktu | devin | claimed
2026-10-29 | person/ibn-khaldun | claude | done — 7 nodes; 3 new events (1349 Black Death in Tunis, c.1352 Tunis court, c.1365 Seville embassy) from Britannica, ledger recorded
2026-10-28 | place/tlemcen | devin | claimed
2026-10-28 | place/qayrawan | devin | claimed
2026-10-28 | place/bukhara | devin | claimed
2026-10-28 | person/timur-lang | devin | claimed
2026-10-28 | place/tlemcen | devin | done — 10 nodes
2026-10-28 | place/qayrawan | devin | done — 9 nodes
2026-10-28 | place/bukhara | devin | done — 4 nodes
2026-10-28 | person/timur-lang | devin | done — 7 nodes
2026-10-28 | person/ibn-jubayr-muhammad | devin | done — 7 nodes
2026-10-28 | place/fes | devin | done — 5 nodes
2026-10-28 | place/nishapur | devin | done — 7 nodes
2026-10-28 | place/timbuktu | devin | done — 4 nodes
2026-10-28 | place/alexandria | devin | claimed
2026-10-28 | place/karbala | devin | claimed
2026-10-28 | place/merv | devin | claimed
2026-10-28 | place/isfahan | devin | claimed
2026-10-28 | place/herat | devin | claimed
2026-10-28 | place/aleppo | devin | claimed
2026-10-28 | place/tarabulus-sham | devin | claimed (Syrian Tripoli)
2026-10-28 | place/kufa | devin | claimed
2026-10-28 | place/qumm | devin | claimed
2026-10-28 | place/homs | devin | claimed
2026-10-28 | place/mosul | devin | claimed
2026-10-28 | place/basra | devin | claimed
2026-10-28 | place/tarabulus-gharb | devin | claimed (Libya Tripoli)
2026-10-29 | concept/hayawan-animal | claude | done — 5 nodes (Thawr, Hijra road, she-camel, Battle of the Camel, Baghdad 389); animals coverage report time-browser-plan/ANIMALS-COVERAGE-2026-10-29.md; cats, ants, spiders, pigeons, dogs need sourced events (gap)
2026-10-28 | place/antioch | devin | claimed
2026-10-29 | person/ibn-hazm | claude | done — 3 nodes (birth Cordoba 384, death in exile Labla 456) from Nafh al-Tib vol. 5 pp. 78–81
2026-10-28 | place/raqqa | devin | claimed
2026-10-28 | place/marrakesh | devin | claimed
2026-10-28 | place/aden | devin | claimed
2026-10-28 | place/muscat | devin | claimed
2026-10-28 | place/jeddah | devin | claimed
2026-10-30 | concept/al-musara-a | claude | done (concept only, no dated event) — wrestling: Rukana bout, Ibn Ishaq (Zakkar) p.276, Isaba pp.499, 531; Abu Nu'aym index p.682 only
2026-10-30 | concept/al-rimaya | claude | done (concept only) — archery: Bukhari index p.1207 (Salama), Tirmidhi p.853 (Uhud, Sa'd); links event/battle-of-uhud
2026-10-30 | concept/games-leads | claude | lead, not written — horse racing (Bukhari index p.1615; Hafya to Thaniyat al-Wada placed race, covered by sabq-in-islam), swimming (Ibn Ishaq p.168 Amr ibn al-As at sea, not a game), dolls (Bukhari index p.1657), camel racing (Tirmidhi commentary; no dated event), nard (Muslim body OCR garbled)
2026-10-30 | concept/cat-in-hadith | claude | published
2026-10-30 | concept/ant-in-hadith | claude | published
2026-10-30 | event/spider-web-at-ghar-thawr | claude | published (content ar/en/ur added)
2026-10-30 | event/battle-of-the-camel | claude | participants linked (ali, zubayr, talha)
2026-10-30 | lead: animals pigeon-thawr, dog-ashab-al-kahf, horse-4-events | claude | lead (not found in drive OCR)
2026-10-30 | period/abbasid-fragmentation, period/buyid-seljuk-fatimid-era, period/colonial-era, period/contemporary-era, period/modern-era, period/mongol-post-mongol, period/pre-islamic-arabia | claude | done (7 era subjects added to explorer; 80 to 87 subjects; no records or prose changed)
<<<<<<< HEAD
2026-10-30 | event/chess-match-al-suli-and-al-mawardi, event/mutadid-at-chess-when-al-qasim-entered, event/al-suli-chess-praised-before-al-radi | claude | published (ar/en/ur; Muruj pp. 598, 634, 660, 676-677); lead: Harun first chess (Muruj p.670), Harun chess gift to Charlemagne (Duha p.233), Aghani v5 p.277 riddle (OCR garbled); riddle terms are mostly theological polemic
=======
2026-10-30 | lead: swimming, horse race, camel race, spear, prizes-recognitions | claude | not written: swimming only in hadith lines (Abu Nu'aym, Umar via Salabi, source record missing); horse race covered by concept/sabq-in-islam (draft); prizes covered by concept/jaiza; no 4 dated events found
2026-10-30 | concept/al-rimaya, concept/al-musara-a | claude | dropped own practice/ duplicates after merging main (#2599 already has both); no new records; undated, not stories
>>>>>>> origin/main
