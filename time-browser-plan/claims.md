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
2026-10-30 | event/chess-match-al-suli-and-al-mawardi, event/mutadid-at-chess-when-al-qasim-entered, event/al-suli-chess-praised-before-al-radi | claude | published (ar/en/ur; Muruj pp. 598, 634, 660, 676-677); lead: Harun first chess (Muruj p.670), Harun chess gift to Charlemagne (Duha p.233), Aghani v5 p.277 riddle (OCR garbled); riddle terms are mostly theological polemic
2026-10-30 | place/aden | claude | done — 7 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/aleppo | claude | done — 14 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/alexandria | claude | done — 6 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/antioch | claude | done — 5 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/basra | claude | done — 12 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/damascus | claude | done — 5 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/herat | claude | done — 7 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/homs | claude | done — 6 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/isfahan | claude | done — 14 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/jeddah | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/karbala | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/kufa | claude | done — 14 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/marrakesh | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/merv | claude | done — 5 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/mosul | claude | done — 14 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/muscat | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/qumm | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/raqqa | claude | done — 5 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/tarabulus-gharb | claude | done — 6 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | place/tarabulus-sham | claude | done — 4 nodes; subject file already present (owner devin), verified against explorer output; no new subject added
2026-10-30 | lead: swimming, horse race, camel race, spear, prizes-recognitions | claude | not written: swimming only in hadith lines (Abu Nu'aym, Umar via Salabi, source record missing); horse race covered by concept/sabq-in-islam (draft); prizes covered by concept/jaiza; no 4 dated events found
2026-10-30 | concept/al-rimaya, concept/al-musara-a | claude | dropped own practice/ duplicates after merging main (#2599 already has both); no new records; undated, not stories

2026-11-01 | place/zanzibar | cursor | claimed
2026-11-01 | place/medina | devin | claimed
2026-11-01 | place/zanzibar | cursor | done — 6 nodes (capital move 1830s, Majid's accession 1856, his death 1870, protectorate 1890, revolution 1964, Karume's assassination 1972); reused existing person records and sources; new event records only

2026-11-01 | place/tunis | cursor | claimed
2026-11-01 | place/tunis | cursor | done — 8 nodes, all reused (Hafsid independence 1230, Eighth Crusade 1270, Marinid entry 1347, Ibn Khaldun's parents 1349, his court post 1352, conquests of 1534 and 1535, Ottoman recovery 1574); subject file only

2026-11-01 | place/algiers | cursor | claimed
2026-11-01 | place/algiers | cursor | done — 7 nodes, all reused (captures 1516 and 1529, Ottoman allegiance 1519, Charles V expedition 1541, Uluj Ali 1581, end of the beylerbeylik 1587, French occupation 1830); subject file only

2026-11-01 | place/ceuta | cursor | claimed
2026-11-01 | place/ceuta | cursor | done — 6 nodes (fall of 817/1415 already wired; added occurred_at on the sieges of 1143, 1309, the two of 1419, and 1790). Left the 1415 duplicate and the overlapping 1694–1727 drafts unwired.

2026-11-01 | place/bukhara | cursor | claimed — expansion past the 4 live nodes
2026-11-01 | place/bukhara | cursor | done — 6 nodes (kept Devin's four; wired the 1220 siege; gave Tabari's year-90 conquest its derived CE year 708 and an occurred_at edge). Subject file left with owner devin.

2026-11-01 | place/medina | devin | done — 14 nodes; 16 Explorer images generated, 1 reject (figure) regenerated clean
2026-11-01 | place/kabul | devin | claimed
2026-11-01 | place/kabul | devin | done — 5 nodes; 10 Explorer images generated, 6 rejects (figures/power lines) regenerated clean
2026-11-01 | place/shiraz | devin | claimed
2026-11-01 | place/shiraz | devin | done — 4 nodes (Fars conquest ~23 AH, al-Layth's seizure 297, battle at Bab Shiraz 297, Abu Kalijar's wall 425-440); 8 Explorer images generated and screened
2026-11-01 | person/jalal-al-din-rumi | devin | claimed
2026-11-01 | person/jalal-al-din-rumi | devin | done — 7 nodes, journey; Britannica source + ledger; 14 Explorer images, 2 rejects (text on gate, figure) regenerated clean
2026-11-01 | person/al-tabari | devin | claimed
2026-11-01 | person/al-tabari | devin | done — 9 nodes, journey; EI2 vol. 10 (Bosworth) for dated biography + fihrist/muntazam/kamil events; GPU busy (cursor queue) so no Explorer images this pass
2026-11-01 | person/al-mahdi | devin | claimed
2026-11-01 | polity/umayyads-of-cordoba | devin | claimed
2026-11-01 | person/al-mahdi | devin | done — 14 nodes (born Iydhaj 126/127 AH → death at Radhin 169/785); all reused events; jobs-al-mahdi.json staged, GPU busy (cursor queue)
2026-11-01 | polity/umayyads-of-cordoba | devin | done — 12 curated nodes (al-Dakhil's entry 138/756 → deposition of Hisham al-Mu'tadd 424/1033); new source/bayan-mughrib-idhari (end of caliphate from Bayan p.226-227); 5 mosque-building events given ar/en/ur prose; GPU busy (cursor queue) so no new Explorer images — 5 nodes already carry cursor's cordoba-mosque backdrops
2026-11-01 | building/al-aqsa-mosque | devin | claimed
2026-11-01 | building/al-aqsa-mosque | devin | done — 13 curated nodes (Isra ~621 → Umar's covenant 15 → Dome 66 → Umayyad completion ~96/715 → Abbasid rebuilds → quake 425/1033 → Fatimid rebuild 1034-1065 → Franks 492 → Nur al-Din's minbar 1169 → Saladin 583 → north porch 1217 → 1967 → fire 1969); 4 new events from EI2 vol. 6 (Grabar, pp. 734-735) + ahsan-al-taqasim; GPU busy (cursor queue) so no new Explorer images — jobs staged at .cache/time-browser/jobs-al-aqsa.json
2026-11-01 | place/constantinople | devin | claimed
2026-11-01 | place/constantinople | devin | done — 11 curated nodes (first Arab siege 47/667 → Umayyad siege 99/717 → Saqaliba raid 283 → Frankish capture 601/1204 → Bayezid blockade 1394-1402 → Murad II siege 825/1422 → conquest 857/1453 → Gulhane 1839 → constitution 1876 → deposition 1909 → abolition of caliphate 1924); wired occurred_at on 5 events, added derived EDTF to the two Hijri-only records, rewrote the 1394/1422 Wikidata draft cards from al-Salabi and EI2 vol. 7, enriched the place record (EI2 vol. 5.1 pp. 570-571) with ar/en/ur prose; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-constantinople.json
2026-11-01 | person/al-jahiz | devin | claimed
2026-11-01 | person/al-jahiz | devin | done — 6 nodes (born Basra ~150/767 → imamate works win al-Ma'mun's praise ~200/815-6 → Ibn al-Zayyat's fall 233/847 → al-Mutawakkil audience 232-247 → hemiplegia in last years 247-255 → death Basra 255/869); 4 new events from EI2 vol. 2 (Pellat p.385) + wafayat-ayan p.404-405 + muruj-al-dhahab; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-jahiz.json
2026-11-01 | person/al-muqaddasi | devin | claimed
2026-11-01 | person/al-muqaddasi | devin | done — 7 nodes, journey (born Jerusalem ~335/946 → hajj 356/967, Aleppo ~354-364/965-975, hajj 367/978, Khurasan 374/984, Shiraz composition decision 375/985 → died ~380/990); all from EI2 vol. 7 p. 544; 5 new events; jobs staged, GPU busy (cursor queue)

2026-11-01 | person/ibn-al-jawzi | devin | claimed

2026-11-01 | person/ibn-al-jawzi | devin | done — 10 nodes, journey (born Baghdad 510 → Muktafi career 530 → Nahrawani madrasas 556 → Abbasid khutba Egypt 567 wired → Ashura sermon 568 → zenith 574 → Wasit exile 590 → release 595 → death 597); 6 new events from EI2 vol. 3 pp. 783-784; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-al-jawzi.json
2026-11-01 | person/al-suyuti | devin | claimed
2026-11-01 | person/al-suyuti | devin | done — 14 nodes, journey (born Cairo 1 Rajab 849/3 Oct 1445 → father's death 855 → study begins Rabi I 864 → Shaykhu mosque 867 → Ibn Tulun imla 872 → Shaykhuniyya 877 → ijtihad claim ~888 → Baybarsiyya + retirement 891 → mujaddid claim ~898 → supreme qadi 902 → Rawda retreat 906 → death 19 Jumada I 911/18 Oct 1505); 12 new events from EI2 vol. 9 pp. 913-915 (Geoffroy) + shadharat-dhahab pp. 468-470; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-suyuti.json
2026-11-01 | person/al-nawawi | devin | claimed
2026-11-01 | person/al-nawawi | devin | done — 11 nodes, journey (born Nawa 631/1233 → death Nawa 676/1277); 9 new events + place/nawa from EI2 vol. 7 pp. 1096-1097 + bidaya s.a. 676 pp. 293-294 + shadharat s.a. 676 pp. 354-356; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-nawawi.json
2026-11-01 | person/al-zamakhshari | devin | claimed
2026-11-01 | person/al-zamakhshari | devin | done — 9 nodes, journey (Zamakhshar 467/1075 → Jurjaniyya 538/1144); 7 new events + place/zamakhshar + place/jurjaniyya from EI2 vol. 11/12 + shadharat s.a. 538; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-zamakhshari.json
2026-11-01 | place/multan | devin | claimed
2026-11-01 | place/multan | devin | done — 14 nodes (Ibn al-Qasim 712 → British 1848); 11 new events from EI2 vol. 7 MULTĀN pp. 602-604 + vol. 7 p. 461 + vol. 4 pp. 959-960 + Hasan Ibrahim pp. 97-98; both Wikidata siege cards (1222, 1398) rewritten; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-multan.json
2026-11-01 | person/al-mutanabbi | devin | claimed
2026-11-01 | person/al-mutanabbi | devin | done — 14 nodes, journey (born Kufa 303/915 → Samawa 312 → wandering 316 → revolt and Hims prison 322 → Badr at Damascus 328 → Sayf al-Dawla Aleppo 337 → secret flight ~346 → Kafur Fustat ~347 → satire and flight yawm al-nahr 350/20 Jan 962 → Baghdad lectures 353 → Shiraz Adud al-Dawla 354 → killed Dayr al-Aqul/Numaniyya Ramadan 354); 11 new events all from EI2 vol. 7 pp. 769-771 + reused killing event (muntazam j.7 p.36-37); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-mutanabbi.json
2026-11-01 | person/al-maqrizi | devin | claimed
2026-11-01 | person/al-maqrizi | devin | done — 10 nodes, journey (born Cairo ~765/1364 → father dies 779/1378 → muhtasib 801 & 807 → Damascus ~810/1408 for ~10 years, refuses judgeship → return ~820, full-time history → last child dies 826/1423 → death 16 Ramadan 845/14 Feb 1442); 8 new events from EI2 vol. 6 pp. 213-214 (Rosenthal) + shadharat-dhahab s.a. 845 pp. 254-255; GPU busy (cursor queue) so no Explorer images
2026-11-01 | person/ibn-taymiyya | devin | claimed
2026-11-01 | person/ibn-taymiyya | devin | done — 15 nodes, curated journey (born Harran 661 → death in Damascus citadel 728); 12 new events from EI2 vol. 3 pp. 983-985; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-taymiyya.json
2026-11-01 | person/al-dhahabi | devin | claimed
2026-11-01 | person/al-dhahabi | devin | done — 12 nodes, journey (born Damascus 3 Rabi II 673/1274 → hadith study 690 → rihla c.700 → Ghazan 699/700 reuse → Jami' session Muh 700 → Umm al-Salih ~710 → Tarikh al-Islam ~730 → blindness 743 → death 3 Dhu al-Qa'da 748/4 Feb 1348); 8 new events from EI2 vol. 2 pp. 214-216 + durar-kamina vol. 3 pp. 336-338; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-dhahabi.json (11 nodes need images)
2026-11-01 | place/bursa | devin | claimed
2026-11-01 | place/bursa | devin | done — 14 curated nodes (siege & conquest 717-726/1317-1326 → Osman reburied ~726 → Orhan Gazi mosque 739/1339 → capital moves to Edirne ~1369 → Yıldırım külliye 1390-6 → Ulu Cami 1396-9 → Timur seizes Bursa 804/1402 → Yeşil Cami & Türbe 1412-1425 → Karamanid siege 1413 → Mehmed I returns capital ~1413 → Muradiye 1424-6 → Jem's 18 days 886/1481 → Kalenderoğlu 1017/1608 → earthquake 1855); 11 new events + conquest card & place record enriched from Freely pp. 36-49, EI2 vol. 1 pp. 1397-1399 and Salabi pp. 47, 69-70, 78, 163; GPU busy (cursor queue) so no Explorer images
2026-11-01 | person/al-baqillani | devin | claimed
2026-11-01 | person/al-baqillani | devin | done — 7 nodes, journey (study under Ibn Mujahid al-Ta'i ~950-980 → qadi & Shiraz ~970-983 → Byzantine embassy 369/980 → mujaddid 4th century ~400 → reused fatimid-khutba-iraq-401 → death Baghdad 23 Dhu al-Qa'da 403/5 June 1013); 4 new events + work/ijaz-al-quran-baqillani from EI2 vol. 1 pp. 1018-1019 + p. 233, Wafayat no. 580, shadharat vol. 3 pp. 169-170; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-baqillani.json
