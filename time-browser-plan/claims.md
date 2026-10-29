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
