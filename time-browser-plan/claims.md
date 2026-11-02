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
2026-11-01 | person/ibn-hajar-al-asqalani | devin | claimed
2026-11-01 | person/ibn-hajar-al-asqalani | devin | done — 14 nodes, curated journey (born Cairo 773/1372 → orphan 777 → hajj 784 → hadith turn 796 → marriage 798 → rihla Hijaz-Yemen 799-803 → Ta'liq al-Ta'liq 804 → Shaykhuniyya 808 → Baybarsiyya 813 → chief qadi 827 → Fath al-Bari complete 842 → death 852/1449); 12 new events from EI2 vol. 3 pp. 808-810 + shadharat pp. 270-274; person record gained born + participated_in edges, died corrected to 18 Dhu al-Hijja; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-hajar.json
2026-11-01 | place/edirne | devin | claimed
2026-11-01 | place/edirne | devin | done — 14 curated nodes (conquest Ramadan 763/July 1362 by Lala Shahin → capital moved from Bursa ~1369/771 → Eski Cami 804-816/1402-1413 → Üç Şerefeli 841-851/1437-47 → Saray-ı Cedid 854/1450 → Mehmed II's siege preparations 857/1453 → Beyazidiye külliye 1484-1488 → Sinan's Selimiye 1569-1575 → Edirne incident 1115/1703 → great fire 1158/1745 → Russian occupation 1829 → Russian occupation 1878-9 → Bulgarian siege & fall 1912-13 → Greek occupation 1920-1922); 15 new events from EI2 vol. 2 EDIRNE pp. 710-713 + Freely pp. 64-75 + Salabi pp. 57, 82-83, 93, 306; 5 wikidata cards enriched (edges, cites, prose, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-edirne.json
2026-11-01 | person/al-qurtubi | devin | claimed
2026-11-01 | person/al-qurtubi | devin | done — 6 nodes, curated journey (fall of Cordoba 636/1239 context → emigration east ~640 → hears al-Mufhim under its author at Alexandria, master dies 14 Dhu al-Qa'da 656 → settles Munyat Bani Khusayb ~660 → composes al-Jami' li-Ahkam ~670 → death 9 Shawwal 671/29 Apr 1273, buried at the munya); 4 new events from Nafh al-Tib vol. 2 pp. 210-211 + Shadharat p. 335 + Siyar al-Nubala 17/97-98 + EI2 vol. 5.1 pp. 550-551 (Arnaldez); new source/siyar-alam-nubala; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-qurtubi.json
2026-11-01 | person/ibn-al-abbar | devin | claimed
2026-11-01 | person/ibn-al-abbar | devin | done — 10 nodes, journey (born Valencia Rabi' II 595/Feb 1199 → disciple of Abu al-Rabi' ibn Salim ~615/1218 → katib to Mu'minid governors of Valencia ~630/1233 → embassy to Abu Zakariyya' at Tunis with the siniyya qasida 635/1238 → fall of Valencia 17 Safar 636 reuse → settles at Tunis as head of chancellery 636 → 'alama affair ~645/1247 → Takmila finished at Tunis ~650/1252 → killed by lance 20 Muharram 658/6 Jan 1260, books burnt); 6 new events + person record rewritten (born Rabi' II 595, born_in/died_in, student_of, authored takmila, 8 participated_in edges, published) + stubs abu-al-rabi-ibn-salim & james-i-aragon; all dated facts from EI2 vol. 3 pp. 705-706 (Ben Cheneb-Pellat) + shadharat-dhahab p. 303 + nafh-tib p. 464; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-al-abbar.json
2026-11-01 | place/lahore | devin | claimed
2026-11-01 | place/lahore | devin | done — 14 curated nodes (first mention in the Hudud al-'alam 372/982 → failed Hindu princes' siege 435/1043-4 → Ghurid capture ends the Ghaznavids 583/1187 → al-Duz killed 611/1214 → Iltutmish's capture 613/1217 → Mongol sack 639/1241 → Balban's restoration 664/1266 → Shaykha Khokar's submission to Timur 801/1398 → Babur's Mughal occupation 930/1524 → Humayun's reoccupation Rabi' II 962/1555 → Jahangir's capital 1031/1623 → Ahmad Shah Durrani's occupation Muharram 1161/1748 → Ranjit Singh takes the city Safar 1214/1799 → British annexation March 1849); 9 new events + 4 wikidata cards rewritten + alduz published, all from EI2 vol. 5.2 LAHAWR PDF pp. 37-39 (printed 597-599, P. Jackson); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-lahore.json (14 nodes need images)
2026-11-01 | person/al-thaalibi | devin | claimed
2026-11-01 | person/al-thaalibi | devin | done — 12 nodes, journey (born Nishapur 350/961 → studies adab under Abu Bakr al-Khwarazmi ~375/985 → schoolmaster & Mikali patrons ~380/990 → Bukhara in the Samanids' last days ~389/999 → two Jurjan sojourns, dedications to Qabus ~395/1005 → Khwarazmshah Ma'mun II's court at Jurjaniyya with Ibn Sina & al-Biruni ~403/1012 → Ghazna residence ~408/1017 → return via Herat ~412/1022 → Tatimmat al-Yatima ~420/1029 → death Nishapur 429/1038); 10 new events from EI2 vol. 10 pp. 450-452 + wafayat-ayan + shadharat-dhahab s.a. 429 pp. 246-247; stubs for Qabus, Ma'mun II, al-Mikali, al-Hamidi; person record rewritten (ur added, born_in/died_in, student_of, 10 participated_in, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-thaalibi.json
2026-11-01 | person/al-safadi | devin | claimed
2026-11-01 | person/al-safadi | devin | done — 11 nodes, journey (born Safad ~696/1297 → Ibn Taymiyya meeting Damascus 717/1317 → copying attested 718 → chancery service Safad/Aleppo/al-Rahba 723-726 → brother's death 742/1341 → hajj 755/1354 → Umayyad Mosque ijaza 756/1355 → Aleppo lectures 759/1358 → death Damascus 10 Shawwal 764/23 Jul 1363); 8 new events + place/safad + work/al-wafi-bil-wafayat from EI2 vol. 8 pp. 759-760 (Rosenthal) + Durar al-Kamina vol. 2 pp. 88-89 + nafh-tib p. 403; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-safadi.json
2026-11-01 | person/al-ashari | devin | claimed
2026-11-01 | person/al-ashari | devin | done — 8 nodes, journey (born Basra 260/873-4 → pupil of al-Jubba'i + three-brothers debate ~874-913 → public renunciation in Basra jami' 300/912-13 → composes Maqalat al-Islamiyyin & refutations ~914-936 → moves to Baghdad late life ~915-936 → death Baghdad 324/935-6); 6 new events from EI2 vol. 1 PDF p. 743 (Watt) + siyar-alam-nubala 15/85-86 + fihrist pp. 648-649 + wafayat (Jubba'i entry); merged duplicate cards person/al-ashari-ali-ibn-ismail and person/abu-ali-al-jubbai as aliases; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-ashari.json

2026-11-01 | person/al-bukhari | devin | claimed

2026-11-01 | person/al-bukhari | devin | done — 10 nodes, journey (born Bukhara Shawwal 194/810 → first hearing 205/820 → hajj & Hijaz stay 210/825 → composes the Tarikh at the Prophet tomb ~212/828 → foremost of Nishapur 247/861 → al-Dhuhli ordeal & departure ~250/864 → expelled from Bukhara, settles at Khartank Ramadan 256 → death at Khartank, festival night 1 Shawwal 256/31 Aug 870); 8 new events + place/khartank + grave-istisqa 464 event from EI2 vol. 1 PDF pp. 1360-1361 + tabaqat-shafiiyya-subki j.2 pp. 2-15; person record rewritten (born/died, ur, born_in/died_in, 8 participated_in, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-bukhari.json (10 nodes need images)
2026-11-01 | person/muslim-ibn-al-hajjaj | devin | claimed
2026-11-01 | person/muslim-ibn-al-hajjaj | devin | done — 11 nodes, journey (born Nishapur ~206/821 → first hearing 218 → rihla Hijaz-Iraq-Sham-Egypt ~215 → hears Ahmad b. Hanbal ~220 → compiles Sahih in 15 yrs ~246 → al-Bukhari at Nishapur 247 reuse → leaves al-Dhuhli's majlis over lafz ~250 → last Baghdad entry 259 → death Nasrabad 25 Rajab 261/6 May 875); 8 new events + had_participant on bukhari-foremost-nishapur-247; sources Wafayat v p.195 + EI2 vol.7 pp.690-692 + tazkirat j.2 pp.526-528 + fihrist p.322; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-muslim-ibn-al-hajjaj.json
2026-11-01 | person/taqi-al-din-al-subki | devin | claimed
2026-11-01 | person/taqi-al-din-al-subki | devin | done — 15 nodes, journey (born Subk al-Abid/Egypt 1 Safar 683/Apr 1284 → studies & jadal under Sayf al-Din Isa b. Dawud ~700 → rihla Damascus + hajj ~710 → Mansuriyya Cairo 723 → Zahiriyya mashyakha Shawwal 723 → chief qadi Damascus 19 Jumada II 739 → Ashrafiyya+Nuriyya 17 Rabi' I 740 → Egypt summons & return with khitaba decree 743 → Shamiyya Barraniyya 21 Dhu al-Hijja 745 → sulh with Ibn Qayyim 16 Jumada II 750 → son Taj al-Din appointed in his lifetime Safar 756 → departure in mahaffa 26 Rabi' II 756 → death Egypt 3 Jumada II 756, buried Sa'id al-Su'ada); 13 new events, all dated facts from al-Bidaya wa-l-Nihaya s.a. 723/739/740/743/745/750/756 (printed pp. 108-109, 195-196, 204, 215-217, 226, 244, 263-264) + EI2 vol. 9 pp. 744-745 + siyar p. 2986 + durar 3/63-70; person record rewritten (born/died, ur, died_in cairo, 13 participated_in, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-subki.json (15 nodes need images)
2026-11-01 | person/ibn-al-tiqtaqa | devin | claimed
2026-11-01 | person/ibn-al-tiqtaqa | devin | done — 7 nodes, journey (born shortly after the Mongol sack of Baghdad ~660/1262 → father's fall in the Juwayni intrigue, undated → naqib of the Alids, travels in Iraq and Adharbaydjan, undated → composes al-Fakhri at Mosul Jumada II-Shawwal 701/Feb-Jun 1302 for Fakhr al-Din Isa → death 709/1309); 5 new events + event/tajarib-salaf-723 (posthumous, outside the journey) + work/al-fakhri-adab-sultaniyya + new source/tarikh-islam-dhahabi + 6 stubs; all dated facts from EI2 vol. 3 p. 988 (Rosenthal) + Tarikh al-Islam source list p. 738 (ت ٧٠٩هـ) + al-A'lam j.3 p. 149 (1302 CE variant); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-al-tiqtaqa.json (7 nodes need images)
2026-11-01 | person/al-nasai | devin | claimed
2026-11-01 | person/al-nasai | devin | done — 9 nodes, journey (born Nasa 215/830 → Qutayba at Balkh aged 15 ~230 → rihla after 240 Khurasan-Iraq-Sham-Egypt-Hijaz-Jazira → settles Misr at Zuqaq al-Qanadil ~270 → leaves Egypt Dhu al-Qa'da 302 → beaten at Damascus mosque over Mu'awiya's virtues ~Muharram 303 → dies al-Ramla Monday 13 Safar 303/1 Sep 915, Mecca variant); 7 new events + person record rewritten (born/died day-precision, ur, born_in/died_in, student_of qutayba+ishaq, 3 authored, 7 participated_in, published); all dated facts from Tarikh al-Islam s.a. 303 printed pp. 105-109 + Tadhkirat al-Huffaz j.2 pp. 617-620 + Wafayat i pp. 26-27 + EI2 vol. 7 pp. 1023-1024; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-nasai.json
2026-11-01 | place/konya | devin | claimed
2026-11-01 | place/konya | devin | done — 14 curated nodes (First Crusade passes 490/1097 → Mas'ud I makes it the Rum Seljuk capital ~512/1118 → Barbarossa at Konya 586/1190 → Rukn al-Din Sulayman dies 600 → Kaykhusraw I restored Rajab 600/1204 → Rumi family settles 625/1228 → Baha al-Din Walad dies 628/1231 → Rumi meets Shams 642/1244 → Shams disappears 645/1247 → Karatay madrasa 649/1251 → Ince Minareli c. 663/1264 → Rumi dies 17 Dec 672/1273 → Karamanid occupation & Jimri 675/1277 → Ottoman annexation 880/1475; battle-of-konya-1832 rewritten but cut by MAX_NODES=14); 7 new events all from EI2 vol. 5.1 ḲONYA pp. 287-289 (Cahen) + britannica-rumi; person/masud-i-rum stubbed; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-konya.json (10 nodes need images)
2026-11-01 | person/taj-al-din-al-subki | devin | claimed
2026-11-01 | person/taj-al-din-al-subki | devin | done — 11 nodes, journey (born Cairo 727-729/1327-9 → arrives Damascus with father 739/1339 → Ibn al-Naqib's ijaza before 20 ~745/1345 → tawqi' al-dast 754/1353 → Shafi'i qadi in father's lifetime Safar 756 → dismissed Sha'ban 759, restored first Shawwal 759 → ordeal: 'azl & imprisonment 769/1368 → death Damascus 7 Dhu al-Hijja 771/2 Jul 1370, plague per EI2); 8 new events + reuse taj-al-din-qadi-756 from EI2 vol. 9 p. 745 + Durar al-Kamina 2/425-427 (entry 2547) + Bidaya s.a. 756 p. 263; stubs for Ibn Abi al-Yusr, Ibn al-Naqib, Baha' al-Din, Ibn Raf'a; work/tabaqat-al-shafiiyya-al-kubra and work/jam-al-jawami enriched (jam-al-jawami authorship corrected from al-Mahalli); person record rewritten (born/died, ur, born_in cairo, died_in damascus, 4 student_of, 2 authored, 9 participated_in, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-taj-al-din-subki.json (11 nodes need images)
2026-11-01 | person/ibn-al-nafis | devin | claimed
2026-11-01 | person/ibn-al-nafis | devin | done — 9 nodes, journey (born Damascus ~607/1210 → studies under al-Dakhwar before 628/1230 → settles Cairo 633/1235 at the Nasiri hospital → Chief Physician of Egypt & Baybars's private physician ~658/1260 → composes the Theologus Autodidactus ~670/1270 → Mansuri maristan completed 683/1284 → dies Cairo 21 Dhu al-Qa'da 687/Dec 1288, estate & books endowed to the maristan); 7 new events from Tarikh al-Islam s.a. 687 p. 312 + Shadharat s.a. 687 pp. 401-402 + EI2 vol. 3 pp. 897-898 + al-A'lam j.5 p. 78 + assabile ep17; person record rewritten (born/died, ur, born_in damascus, student_of al-dakhwar, 2 authored, 7 participated_in, published); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-al-nafis.json
2026-11-01 | person/al-mawardi | devin | claimed
2026-11-01 | person/al-mawardi | devin | done — 10 nodes, journey (born Basra 364/974, father a rose-water maker → teacher then qadi at Ustuwa near Nishapur and Baghdad ~411 → embassy to Abu Kalijar at al-Ahwaz, laqab refused «al-Sultan al-Mu'azzam» 423 → aqda'l-qudat laqab 429 → reuse shahanshah-laqab-429, Mawardi refuses Malik al-Muluk → caliph's rescript to Jalal al-Dawla over the Jawali 434 → reuse tughril-takes-rayy-435, envoy censuring Tughril → dies Baghdad 30 Rabi I 450/27 May 1058, buried Bab Harb, works bequeathed at death); 6 new events + stub abu-al-tayyib-al-tabari; person record rewritten (born/died day-precision, ur, born_in basra/died_in baghdad, authored tafsir-al-mawardi, 8 participated_in, published); all dated facts from EI2 vol. 6 p. 896 + muntazam j.8 pp. 199-200, 407-409, 439-440, 455-459 + shadharat p. 294; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-mawardi.json (10 nodes need images)
2026-11-01 | person/al-kulayni | devin | claimed
2026-11-01 | person/al-kulayni | devin | done — 6 nodes, journey (Qumm studies 903-913 → shaykh of Imamiyya Rayy ~910s → Baghdad Darb al-Silsila ~913-923 → completes al-Kafi ~328 → death Sha'ban 329/May 941, Abu Qirat funeral, buried near Bab al-Kufa); 5 new events + place/kulayn + 4 stubs from EI2 vol. 5 pp. 400-401 + tarikh-islam p. 250 + duha-islam pp. 850, 891; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-kulayni.json
2026-11-01 | person/al-umari | devin | claimed
2026-11-01 | person/al-umari | devin | done — 13 nodes, journey (person/ibn-fadl-allah-al-umari; born Damascus 3 Shawwal 700/12 Jun 1301 → father moves to Cairo chancery 729 → quarrel with al-Nasir over Ibn al-Qutb and dismissal ~737 → father's death 9 Ramadan 738, brother Ala al-Din succeeds → arrested Sha'ban 739 → released Rabi' II 740 → katib al-sirr Damascus Muharram 741 after Tankiz's fall → dismissed 3 Safar 743, brother Badr al-Din succeeds → retirement and the great works 743-749 → plague flight to Jerusalem, wife dies ~748 → death of quartan fever 9 Dhu al-Hijja 749/1 Mar 1349); 11 new events + person record rewritten (born/died day-precision, ur, born_in/died_in damascus, child_of father, authored al-tarif stub, 11 participated_in, published) + work/masalik-al-absar published + 6 stubs; all dated facts from Durar al-Kamina (Dar al-Jil 1993) 1/331-333, 1/425-426 + EI2 vol. 3 pp. 790-791 (K. S. Salibi); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-umari.json (13 nodes need images)
2026-11-01 | person/al-bayhaqi-abu-bakr-ahmad-ibn-al-husayn | devin | done — 9 nodes, journey (born Khusrawjird/Bayhaq 384/994 → hearing al-Hakim al-Nisaburi before 405/1014 → rihla for hadith ~430/1038 → Kunduri pulpit-cursing ordeal opens Nishapur start of 445/1053 → letter to Amid al-Mulk al-Kunduri ~446/1054 → scholars' Hijaz exodus with al-Qushayri ~450/1058 → Tughril dies + al-Kunduri killed + cursing rescinded 455-456 → final Nishapur years, ~1000 fascicules ~457/1065 → death Nishapur 458/1066, buried Khusrawjird); 7 new events from EI2 vol. 1 p. 1190 + Subki Tabaqat pp. 269-276 + Shadharat p. 309; person record rewritten (ur, born_in bayhaq/died_in nishapur, student_of al-hakim, 4 authored, 7 participated_in, published); reuses person/al-hakim-al-nisaburi, al-qushayri, imam-al-haramayn-al-juwayni, al-kunduri, tughril-beg, alp-arslan, nizam-al-mulk + places bayhaq/nishapur/mecca; dropped posthumous tughril-beg edge from kunduri-fall-456 (was breaking person/tughril-beg journey order); GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-bayhaqi.json (9 nodes need images)
2026-11-01 | person/ibn-qayyim-al-jawziyya | devin | claimed
2026-11-01 | person/ibn-qayyim-al-jawziyya | devin | done — 11 nodes, journey (born Damascus 7 Safar 691/29 Jan 1292 → attaches to Ibn Taymiyya on his return 712/1313, EI2: 713 → imprisoned with him in Damascus citadel 726-728 (reused event) → hajj 731/1331 → first khutba Ghuta 2 Rajab 736/1336 → Sadriyya inaugural lecture 6 Safar 743/1342 → musabaqa dispute with al-Subki Muharram 746/1345 → sulh 16 Jumada II 750 reuse → death 13 Rajab 751 (EI2: 23 Rajab/26 Sep 1350), buried Bab al-Saghir); 7 new events + had_participant ibn-qayyim on ibn-taymiyya-final-imprisonment-726; person record rewritten (born/died day-precision, en/ur, born_in/died_in damascus, student_of ibn-taymiyya + safi-al-din-al-hindi, 6 authored, 9 participated_in, published); all dated facts from EI2 vol. 3 pp. 853-855 (de la Granja) + Durar al-Kamina j.3 pp. 400-403; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-ibn-qayyim.json (11 nodes need images)
2026-11-01 | person/jamal-al-din-al-mizzi | devin | claimed
2026-11-01 | person/jamal-al-din-al-mizzi | devin | done — 10 nodes (8 events + birth/death stops), journey (born al-Ma'qiliyya outside Aleppo 10 Rabi' II 654/7 May 1256 → begins hadith quest 675/1276 → al-Dhahabi hears Sahih al-Bukhari from him 694/1294 → jailed over Ibn Taymiyya & Khalq Af'al al-Ibad 705/1305 → shaykh of Dar al-Hadith al-Ashrafiyya 718/1318 → Nuriyya shaykhhood after Ibn Abi al-Fath ~740 → reuse al-subki-ashrafiyya-740 → dies Damascus Saturday 12 Safar 742/28 Jul 1341, buried Maqabir al-Sufiyya near Ibn Taymiyya); 7 new events + person record rewritten (born/died day-precision, ur, born_in aleppo/died_in damascus, student_of al-nawawi, authored tahdhib-al-kamal + new work/tuhfat-al-ashraf, 8 participated_in, published) + work/tahdhib-al-kamal published; all dated facts from Tarikh al-Islam (Dhayl) s.a. 742 printed pp. 486-493 + Durar al-Kamina (Dar al-Jil 1993) 4/457-461 + EI2 vol. 7 art. al-Mizzi (Juynboll) pp. 240-241 + Subki Tabaqat j.10 p. 398 + Bidaya s.a. 740 p. 204; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-mizzi.json (10 nodes need images)
2026-11-01 | person/imam-al-haramayn-al-juwayni | devin | claimed
2026-11-01 | person/imam-al-haramayn-al-juwayni | devin | done — 12 nodes, journey (born Bushtanikan 18 Muharram 419/17 Feb 1028 → father's chair before twenty, Dhu al-Qa'da 438 → fitna-445 + Khurasan minbar-cursing 1053 reuse → Baghdad & Kunduri's circle ~448/1056 → exodus & Kirman-road hiding ~450/1058 reuse → Mecca-Medina mujawara 450-454 → Nizamiyya Nishapur for him ~459 reuse → death Bushtanqan 25 Rabi' II 478/20 Aug 1085; bayhaqi-settles-457 tags along); 5 new events + nizamiyya-nishapur-founded-459 published + person record rewritten (born/died day-precision, ur, born_in/died_in nishapur, child_of+student_of father, student_of iskaf stub, 7 authored, 8 participated_in, published) + 2 stubs; all dated facts from Tarikh al-Islam s.a. 478 printed pp. 229-239 + Siyar 18/2574-2576 + EI2 vol. 2 pp. 605-606 + Subki Tabaqat pp. 269-276 + Shadharat p. 310 + Wafayat 3; GPU busy (cursor queue) so no Explorer images — jobs staged at .cache/time-browser/jobs-al-juwayni.json (11 nodes need images)
2026-11-01 | person/al-daraqutni | devin | claimed
