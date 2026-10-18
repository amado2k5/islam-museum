# Lane `lib-wafayat-ayan`: Wafayat al-A'yan wa-Anba' Abna' al-Zaman (Ibn Khallikan, d. 681 AH)

**Book id:** `wafayat-ayan` · **Work:** `work/wafayat-al-ayan` · **Source:** `source/wafayat-ayan` · **Branch:** `content/lib-wafayat-ayan` · **Stubs:** `data/_stubs.d/lib-wafayat-ayan.yaml`

**Edition and items used:** the harvest scans under `~/islam-museum-harvest/books/tareekh/wafayat-ayan/` — a mixed-edition set, all OCR'd with Apple Vision (no text layer in the PDFs):
- `AAlexandrina-154776` (254 pp): «الجزء الأول» — early letters (أ–ز seen); ends near زيري بن مناد.
- `AAlexandrina-224013` (548 pp): early-alphabet volume (table of contents opens with أبو دواد / أحمد / إبراهيم entries).
- `AAlexandrina-147125` (458 pp): «الجزء الثاني» — حرف الميم.
- `7_20211208_20211208` (383 pp): حرف الياء + the editor's concordance and name indexes (entry numbers like ٧٩٣ - يحيى بن أكثم point to other works' folios, not pages here).
- Printed page ≠ scan page; printed numbers appear as standalone numeral lines in the OCR.

**Method (dictionary lane rules):** do not read entry by entry. Work the priority list: unresolved `person/` stubs in `data/_stubs*.yaml` first, then narrators/figures with the most inbound references. For each target, search the four `book.txt` files for the normalised name; a hit inside a nasab chain or a «عن … قال» mention is not an entry — only mine a real biography (name opening its own section, followed by nasab/kunya/life/death material). Quote at most 40 words verbatim, own words otherwise; cite the scan page and the printed page where legible.

## Progress

- (Before this file) An earlier session mined ~36 `person/` records citing `source/wafayat-ayan`, concentrated on حرف الياء (Yusuf b. Tashfin dossier, Ya'qub b. Killis, Salah al-Din dossier, Almohad biographies, Yahya-group tarajim) — commits `be9dd8268` … `550177e03` under prefixes `feat(data): lib-wafayat` and `content(wafayat)`.
- **Batch 5 (`lib-wafayat-batch-5`, Devin SWE-2):** 22 `person/` records from `AAlexandrina-154776` (حروف أ–ز). Entries verified as real biographies (standalone name openings + nasab/life/death bodies): Abu Bakr b. Abd al-Rahman al-Makhzumi (resolves a `muwatta-prose` stub; alias covers the -ibn-hisham variant), al-Shibli, Barkiyaruq, Ibrahim b. Hilal al-Sabi', Ibn Faris, Ibn Tabataba, al-Manazi, Ibn al-Khayyat, al-Urjani, Iyas b. Mu'awiya, Asbagh b. al-Faraj, Abu al-Salt al-Andalusi, Ibn Waki' al-Tinnisi, Abu al-Jawa'iz, al-Fariqi, Ibn Rashiq al-Qayrawani, al-Sukkari, Ahmad b. Harun al-Rashid, Ja'far b. Fallah al-Kutami, Nasir al-Din Ja'far b. Ya'qub, Abd al-Azim al-Mundhiri (author of the Takmila; Wafayat gives only a memorial line), Da'laj b. Ahmad. Dates only where the entry states them; `derived: true` on all converts.
- **Corpus map (verified this session):** `154776` = «الجزء الأول» Wafayat text **with a bound-in later Sufi/Ottoman work interleaved in its back half** (entries like السلطان أورخان، ابن الفناري are NOT Ibn Khallikan — skip those pages); `224013` = a *second, fuller witness* of the early letters in a different print (2-up spreads, printed page numbers inline — useful for cross-verifying dates that `154776` garbles); `147125` = حرف الميم text; `7_20211208` = حرف الياء text + the editor's concordance/index (the numbered roster lists ALL ~850 entries — good for finding entry existence, useless for facts).
- **Rejected this session (already written under other slugs):** al-Muzani, Aqsunqur al-Bursuqi, Sahib b. Abbad, Malik al-Nuhat (al-Baghdadi), al-Zajjaj, Ibn Zaydun, al-Karabisi, Dawud al-Zahiri, Ibn Sina, Khumarawayh, Raja' b. Haywa, Jawhar al-Siqilli, Rukn al-Dawla, Ziri b. Manad, Abu Yazid Makhlad, Abu Ali al-Tabari, al-Mansur (Ubadi). And `abd-al-rahman-ibn-abi-hurayra` stayed unwritten: the «ابن أبي هريرة» hit is a nasab mention inside another tarjama, no dedicated entry found.
- **Batch 6 (`lib-wafayat-batch-6`, Devin SWE-2):** 10 `person/` records from `AAlexandrina-147125` («الجزء الثاني» — its printed TOC covers حروف م–ي; the scan's own Wafayat text ends ~printed 557 and its back pages carry the same bound-in Shaqa'iq Ottoman work — entries with «المولى» titles, beys/pashas are NOT Ibn Khallikan). Resolves two more muwatta-prose stubs: `person/hisham-ibn-urwa` (d. ~146, Mansur anecdote, Baqi' grave dispute) and `person/makhul-al-dimashqi` (d. 118 with four variants, Kabul-born, «مكحول بالشام ولم يكن في زمنه أبصر منه بالفتيا»). Also: Shihab al-Din al-Suhrawardi (strangled Aleppo citadel 587 on Salah al-Din's order — Ibn Khallikan's firsthand Aleppo note), Ibn Jazla (Christian convert physician, d. 483), Nasir al-Mutarrizi (b. 538/d. 610, al-Mughrib), Nasrallah b. Qalaqis (drowned off Dahlak), Nasr b. Ahmad al-Khubzaruzzi (the illiterate Basran baker-poet, d. 317), Qadi al-Mu'afa b. Zakariya, Yazid b. al-Tathriyya (al-Muwaddiq), Jalal al-Din b. Matruh (b. 582 Asyut, d. Sha'ban 649 — Ibn Khallikan was deputy qadi of Cairo then and attended him).
- **False friends avoided:** the م volume's «السلطان محمود» is Mahmud of Ghazna (`mahmud-ghaznawi` exists), not Mahmud b. Malikshah; the p265 «هشام» continuation is Ibn al-Kalbi (exists); مكحول's entry sits between two Shaqa'iq leaves.
- **Still unlocated in this volume:** al-Sayyida Nafisa (TOC printed 223 — name not found in scan text, may be a lost page or in another volume), al-Mihyar al-Daylami, Abu al-Hajjaj al-Bayasi (printed 548 — probably in the ي volume `7_20211208`).

- **Batch 7 (`lib-wafayat-batch-7`, Devin SWE-2):** 22 `person/` records — the المحمدون pass. **New witness added:** the 8-volume Ihsan Abbas edition set on archive.org (`*_20220803` items) ships `_djvu.txt` server-side OCR — much cleaner than the Apple Vision scans; downloaded vols 4–6 to `~/islam-museum-harvest/books/tareekh/wafayat-ayan/ihsan-abbas-8vol/`. The المحمدون section lives in v4 (غ–م mid) and its full ~850-entry index is appended at v4's end (use it as the canonical roster). **Key finding:** the local scans' م volume (`AAlexandrina-147125`) is «الجزء الثاني» of حرف الميم starting at printed ~86 — the المحمدون (printed 1–85) are simply not in it; the v4 text is the only witness for them. Written this batch: al-Qada'i (Shafi'i na'ib-qadi of Egypt, Sahib al-Shihab, d. 454), al-Ma'afiri (khatam 'ulama' al-Andalus per Ibn Bashkuwal, b. 468/d. 543), al-Tartushi (Sahib Siraj al-Muluk, b. 451/d. 520), Ibn Furak (poisoned d. 406), Abu Musa al-Madini (b. 501/d. 581, dhayl on Ibn Manda), Ibn al-Qaysarani (d. 507 Hamadan), Abu Talib al-Makki (Qut al-Qulub, d. 386), al-Qazzaz al-Qayrawani (1000-folio Jami' for al-Aziz), al-Zubaydi (Mu'addib al-Mu'ayyad, d. 379), al-Khwarizmi al-Tabarkhazi (Ibn Abbad's 20k-verse test; Ibn Jarir's nephew), Ibn Hani' al-Andalusi (killed Barqa 362), al-Farbari (last Sahih transmitter, d. 320), al-Farawi Kamal al-Din (d. 530), al-Jubba'i (shaykh al-Mu'tazila, al-Ash'ari's teacher, d. 303), Abu al-Husayn al-Basri (al-Mu'tamad, d. 436), Ibn Dawud al-Zahiri (al-Zahira), Qutrub (Sibawayh's pupil, first muthallath, d. 206), al-Kalabadhi Abu Nasr (d. 398 per Sam'ani — flagged discrepancy), Ibn Shahuya al-Farisi (d. 362), al-Mas'udi al-Shafi'i, Ibn Sam'un (al-Hariri's model in Maqama 21, d. 387), al-Abdi ibn Manda (Tarikh Isbahan, d. 301). Removed one stale stub (`muhammad-ibn-al-hasan-al-shaybani` — record already exists).
- **Muhammad-section reality:** Ibn Khallikan's Muhammads are the famous ones — the minor Muwatta-era transmitters (`muhammad-ibn-al-munkadir`, `ibn-kab-al-qurazi`, `ibn-yahya-ibn-hibban`, etc.) have **no Wafayat entries**; those stubs need a different source (Tahdhib al-Kamal / Tabaqat). `muhammad-ibn-abd-al-wahhab` stays open — the stub most likely means the Najdi reformer, not al-Jubba'i.

- **Batch 8 (`lib-wafayat-batch-8`, Devin SWE-2):** 25 `person/` records — the ي volume (`7_20220803`, Ihsan Abbas v7, `v7.txt` in the harvest dir). Earlier-session coverage was better than assumed (al-Bayyasi, al-Sirafi, Ibn Ya'ish, Yunus b. Habib, Ibn Kajj, Ibn Mardanish all existed). Main-section entries mined: al-Najirmi (Basran grammarian of Egypt, famed calligrapher, b. 345/d. 423 — Ibn Barakat's 520 is a century off per al-Dhahabi), Yusuf b. Wahra al-Hamadhani (Shafi'i turned ascetic, al-Shirazi's pupil, Nizamiyya preacher 515, d. 535 Bamiyan), al-Rammadi (Cordoba's poet laureate, d. 403), Radi al-Din al-Irbili (d. 675 or 676 — sons disagreed). **عارضة (appended) notices** numbered (355)–(397) embed inside related main entries and gave: 4 missing Almohad caliphs (al-Mustansir d. 620; Abd al-Wahid al-Makhlu' strangled after 9 months; al-Muhtadid Yahya killed at a Tlemcen fort; al-Sa'id Ali b. Idris), al-Fayd b. Abi Salih (al-Mahdi's vizier, d. 173), Mu'awiya al-Ash'ari (d. ~170, buried maqabir Quraysh), Abu Hansh al-La'i (centenarian Basran who elegised Ya'qub b. Dawud in al-Hamasa), al-Qa'id Fadl b. Salih (al-Hakim's commander, killed Dhu al-Qa'da 399 — بلدة منية القائد فضل named for him), Abd al-Ghaffar (al-Hakim's court poet, burned 395), and **Ibn Khallikan's own teachers and Aleppo circle**: Ibn al-Shirzaji (qadi of Basra, Atabakiyya madrasa Mosul — ijaza 567), al-Tusi khatib of Mosul (b. 487/d. 578), al-Ashiri al-Sinhaji (d. 561 Baalbek), Najm al-Din b. al-Habbaz (b. 557/d. 631 — Ibn Khallikan attended his funeral), Shihab al-Din Tughril atabeg of Aleppo (d. 631), Ibn Kharruf al-Adib the Cordoban (d. 630, fell in a well — NOT the grammarian), Abdallah b. Ghaniya (last Banu Ghaniya king of Majorca, killed ~599), al-Kurani al-Harawi (poet-archive of three Almohad courts), Abd al-A'la al-Sadafi (b. 121/d. 201, father of Yunus), al-Dula'i khatib of the Umayyad Mosque (d. 598), and al-Malik al-Mushammar b. Salah al-Din (b. 565 Cairo/d. 627 Harran).
- **عارضة skipped (already exist):** Amr b. al-As, Kharija b. Hudhafa, Hakim b. Jabala, Ali b. Ghaniya, Ibn Mardanish, Ibn Tufayl (notice 388 *is* the Hayy b. Yaqzan author), al-Murtada, al-Wathiq Abu Dabus.
- **Unlocated roster leftovers:** al-Hattaz, Abdallah b. Yusuf al-Namiri, Suhayl b. Amr al-Qurashi, Ibn al-Habrani, Ahmad b. Mah al-Abbadi, Majid al-Din al-Hadim, Muhalhil b. Yamut, Abd al-Rahman b. Yunus al-Sadafi family details — OCR garbling hides their host entries; retry with fuzzy search.

- **Next:** أ–ز remainder in `154776`/`224013` (~800 indexed headings, many already covered), then v5/v6 of the Ihsan Abbas set for m-name gaps (al-Mukhtar Izz al-Malik, al-Shahrazuri, al-Darir ibn Mukhallad were indexed but their bodies weren't in v4 — check v5; al-Mihyar al-Daylami is entry 755 in the index — find its host volume).

- **Batch 9 (`lib-wafayat-batch-9`, Devin SWE-2):** 22 `person/` records — systematic roster diff of the whole Ihsan Abbas set (v1–v7 in `ihsan-abbas-8vol/`). Method: extracted each volume's own end-of-volume index as the canonical entry roster, hand-matched against `data/person/*.yaml` labels/aliases (auto-diff over-reports — short names miss transliteration variants; every candidate was verified against existing files before writing). **Both batch-6 loose ends resolved:** al-Sayyida Nafisa was in v5 all along (b. ?, d. Ramadan 208, Cairo shrine, al-Shafi'i attended her sessions and she prayed over his funeral) and al-Mihyar al-Daylami (converted by al-Sharif al-Radi 394, d. Jumada II 428). Also written: **al-Qadi al-Nu'man** (Fatimid chief jurist, Da'a'im al-Islam, d. 363), Abdallah b. Yusuf al-Juwayni (Imam al-Haramayn's father, d. 438/434), Hammad b. Abi Hanifa (d. 176, the wada'i' story), Taj al-Muluk Buri b. Ayyub (Salah al-Din's youngest brother, b. 556, died of a wound at the Aleppo siege — the OCR drops his exact death year), Bahaa al-Din Zuhayr (b. 581 Mecca, d. 656 Cairo epidemic — Ibn Khallikan missed his funeral by illness), Abu Dalama, Ash'ab al-Tami' (b. 9, no death stated), Shabib b. Shayba, **Ibn Naqiya** (Maqamat author, b. 410/d. 485), Dik al-Jinn (b. 161/d. ~236), Abu Hashim al-Jubba'i (b. 247/d. 321, died same day as Ibn Durayd), **Sharaf al-Din Ibn Abi Asrun** (b. 492/d. 585, qadi of Damascus — al-Qadi al-Fadil sent condolences), Abu Sa'd al-Mutawalli (Shirazi's Nizamiyya successor, b. 426/d. 478), Abu Zayd al-Dabusi (first writer of ilm al-khilaf, d. 430), Khalid b. Khudash (d. 223), Abu al-Marhaf al-Namiri (blind Hanbali poet, no death stated), **Radi al-Din al-Mu'ayyad** (last high-isnad Nishapuri, b. 524/d. 617 — Ibn Khallikan's father held his ijaza), al-Mu'ayyad al-Ulumbi (javish turned poet, b. 494/d. 557 — Ibn Khallikan met him in 555), Abu Sa'id Ibn Yunus al-Sadafi (the Egyptian historian, b. 281/d. 347), Shaqiq al-Balkhi (Ibrahim b. Adham's teacher).
- **False friends avoided this round:** «سحنون» was a reference not an entry — `sahnun` exists; `al-jarmi-salih-ibn-ishaq` and `ziyad-al-bakkai` already exist under those slugs; the al-Sadafi عارضة notice is Yunus's *grandson* the historian (new), distinct from `abd-al-ala-al-sadafi` (Yunus's father, batch 8) and `al-sadafi` (Abu Ali, a different family line).
- **Open:** v5/v6 gaps from the batch-7 list remain (al-Mukhtar Izz al-Malik, al-Shahrazuri entries, al-Darir ibn Mukhallad); ~140 roster candidates remain unchecked but most are probably covered by alternate transliterations — each needs a hand check; Muwatta stubs stay open (not Wafayat material); the أ–ز remainder of `154776`/`224013` is now redundant with the cleaner Ihsan Abbas v1–v3 (prefer those for future batches).

- **Batch 10 (`lib-wafayat-batch-10`, Devin SWE-2):** 13 `person/` records — late-Muhammad-section and roster leftover entries in v4 (Ihsan Abbas), located via the volume index then body-matched. Written: **al-Musabbihi** (Fatimid historian, 13,000-folio Tarikh of Egypt, b. 306/d. 420), **Fakhr al-Din Ibn Taymiyya** — the father of Taqi al-Din — (Hanbali khatib of Harran, b. 552/d. 621), **Bahaa al-Din Ibn Hamdun** (author of the Tadhkira, died in al-Mustanjid's prison 562), **Ibn Quri'a** (the wit-qadi of the tufayli responsa, d. 367), **al-Wahrani** (Rukn al-Din, the Manamat satirist, d. 575 at Dariyya — death reported in al-Qadi al-Fadil's hand), **Ibn Naqta** (hadith traveller, d. 629 — Ibn Khallikan heard the news at Aleppo), **Ibn al-Dubaythi** (Wasiti historian, dhayl on Tarikh Baghdad, d. 637), **Ibn Zafar al-Siqilli** (Sulwan al-Muta' author, d. ~570), **Ibn Sakra** (Hashimi satirist, d. 385), **Ibn Zubraj al-Utabi** (grammarian-calligrapher, b. 484/d. 555), **Taj al-Din Ibn al-Sa'adat al-Masudi** (the 5-volume Sharh al-Maqamat, b. 522/d. 584 — the Aleppo waqf-books story), **al-Salami** (Makhzumi poet of Adud al-Dawla, b. 336/d. 393), **Ibn al-Sarraj** (al-Mubarrad's pupil, author of al-Usul — entry verified, his death year is lost in OCR).
- **Still unlocated despite roster presence:** the three Shahrazuri tarajim (Kamal al-Din qadi, his son Imad al-Din Ahmad, al-Muzaffar b. Ali) — bodies absent from v4 and the Vision scans; al-Thumali and al-Utbi the poet are index-listed but their bodies weren't matched; al-Darir ibn Mukhallad, al-Ablah (Muhammad b. Bakhtiyar), al-A'la/Thamali spellings need fuzzier matching or another witness.
- **Rejected this round:** ibn-hamdun-muhammad (d. 255) and abu-bakr-al-utbi are DIFFERENT people from the roster's Ibn Hamdun/al-Utbi — new records were still needed; sahnun, al-jarmi, ziyad-al-bakkai already exist.

- **Batch 11 (`lib-wafayat-batch-11`, Devin SWE-2):** 9 `person/` records — the philologist sequence at v4's tail (Ihsan Abbas). Written: **Abu al-Ayna** (the blind wit, b. 190/d. 283), **Abu Umar al-Mutarriz** (ghulam Tha'lab, 30,000-folio dictator, b. 161/d. 345), **Ibn al-Qutiyya** (the Gothic-descended philologist of Cordoba, d. 367), **Abu Bakr Ibn al-Anbari** (d. 328, Gharib al-Hadith = 45,000 folios), **al-Dawlabi** (warraq-historian, d. 320), **al-Hatimi** (Risala vs. al-Mutanabbi, d. 388), **al-Qasim al-Shahrzuri** (patriarch of the qadi house, date lost in OCR), **al-Yazidi** (tutor of al-Muqtadir's sons, d. 310), **al-Shatibi** (author of Hirz al-Amani / the Shatibiyya, d. 590 — Ibn Khallikan visited his grave in al-Qadi al-Fadil's turba).
- **Roster-only entries confirmed lost (index-listed, body absent from all witnesses):** al-Thumali, al-Utbi the poet, Ibn Shan, and the three Shahrazuri tarajim proper (Kamal al-Din, Imad al-Din Ahmad, al-Muzaffar b. Ali) — the ancestor notice was recovered instead.

- **Batch 12 (`lib-wafayat-batch-12`, Devin SWE-2):** 16 `person/` records from the فهرست الأجسام العارضة (embedded notices) — Ibn Khallikan's biographies tucked inside other entries. Written: **Rabi'a Khatun bt. Ayyub** (Salah al-Din's sister, d. 643, her Hanbali madrasa at Qasyun), **Ibn al-Mustawfi** (Tarikh Irbil, d. 638 — Ibn Khallikan heard from him), **Ibn al-Habbariyya** (Nizam al-Mulk's satirist, d. 504), **Ibn al-Manda'i** (417–605), **Anushirwan b. Khalid al-Qashani** (al-Mustarshid's vizier, d. 532 — the Maqamat dedication notice), **al-Aziz Ghiyath al-Din of Aleppo** (610–634, Ibn Khallikan present), **al-Salih Ahmad of Ayntab** (600–651), **Rajih al-Hilli** (570–627), **Fatkin al-Turki** (d. 372, lost Damascus to the Fatimids), **Abu Bakr al-Khwarazmi** (al-Tabari's nephew, d. 383 — the 'men's or women's poetry?' anecdote), **Ibn al-Ta'awidhi** (d. 553, 'unrivalled for 200 years'), **al-Ablah** (no dates recorded), **Qadi Taj al-Din Yahya** (492–572) and **Qadi Diya al-Din al-Qasim** (554–599) of Damascus/Hama, **al-Najjar Sahib al-Musalla** (d. 358), **Ali b. al-Muhsin al-Tanukhi**.
- **Skipped as already existing:** al-Mas'udi al-Shafi'i, Berke Khan (al-Malik al-Sa'id), Qalawun al-Alfi (= Sultan al-Mansur Qalawun), Ibn Rawaha, al-Qazzaz, Ibn Hani, Ibn Bajja, al-Rusafi, Ibn al-Qaysarani, Dagh fal b. Handhala, al-Kalabadhi, Ibn Barrajan, al-Nasir Yusuf.
- **Not locatable:** al-Abiwardi, Abu Umar al-Nahhas al-Misri (Ibn al-Kayrani), Yusuf b. al-Nafis 'Shaytan al-Sham', Baybars al-Sami, Imad al-Din Ahmad al-Shahrzuri, Taj al-Din Abd al-Rahim, Shihab al-Din al-Tusi, Zaki al-Din — index-listed but bodies not found in v4/v5 (likely in volumes we lack).

- **Batch 13 (`lib-wafayat-batch-13`, Devin SWE-2):** 16 `person/` records from v5's embedded notices. Written: **Ibn Ra'iq** (first amir al-umara' — the hand-cutting story, killed at Mosul by Nasir al-Dawla), **Matta b. Yunus** (al-Farabi's logic teacher, d. under al-Radi), **Bint Nizam al-Mulk** (wife of al-Muqtadi, d. 470), **al-Muwaffaq b. Ahmad al-Makki** (Manaqib Ahmad, d. 568 Khwarazm), **Ibn Abi al-Hadid** (Nahj al-Balagha commentator, b. 586/d. 655) and his brother **Muwaffaq al-Din** (b. 590/d. 656, after the Mongol sack), **Bardawil the Frank** (Baldwin I — the al-Farama raid, Sarkhat Bardawil mound), **al-Tawhidi** (alive 400, Mathalib al-Wazirayn), **Sabuktigin** (d. Sha'ban 387, Ghaznavid founder), **Ibn al-Umayd** (Rukn al-Dawla's katib, d. 359), **al-Adil II** (deposed 637, d. 645 — Ibn Khallikan witnessed his litter), **al-Mas'ud b. al-Kamil** (conqueror of Yemen/Mecca), **al-Mughith Umar** (last Ayyubid of Karak, lured by Baybars 661), **al-Aziz Uthman b. al-Mughith**, **Najm al-Din Khidr b. Baybars** (Karak till 685, exchanged out by Qalawun), **Kamal al-Din Ibn al-Nabih** (al-Ashraf's katib-poet).

- **Batch 14 (`lib-wafayat-batch-14`, Devin SWE-2):** 18 `person/` records from v6 (letter و + the عارضة notices). Written: **Ibn al-Tilmidh** (Amin al-Dawla, sultan al-hukama, d. Safar 560 near 100 — his Aqrabadhin still in use), **Awhad al-Zaman Ibn Malikan** (al-Mu'tabar; Jewish convert; snake-venom self-treatment for leprosy, cured but blinded), **Abu al-Makaram al-Misri** (poet punished by al-Qadi al-Sa'id), the **Sicily set**: William I (Ghulaym b. Rujar — Ibn Qalaqis praised him 563), Constance (Umm al-Anbur), Frederick II (the Anbur — correspondence with al-Kamil, recovered Jerusalem), **Hisham b. Mu'awiya al-Darir** (Sahib al-Kisa'i, d. 209 — taught Ishaq b. Ibrahim after his slip before al-Ma'mun), the **Zirids**: Yahya b. Tamim (accession 497, 30 sons), Ali b. Yahya (b. 499), al-Hasan b. Ali (b. 502 — last Zirid; Roger II took Tripoli 541 and al-Mahdiyya 543; Banu Badis ended after 208 years), **Suhaym b. Wathil** (the 'aqr contest with Ghalib — Ali b. Abi Talib ruled the meat unlawful), **Ghalib b. Sa'sa'a** (al-Farazdaq's father), **Nusayb** (black slave-poet, freed by praise of Abd al-Aziz b. Marwan), **al-Qahl b. Iyash** (killed Yazid b. al-Muhallab, mutual kill), **the last Saffarids** Tahir b. Muhammad (captured 296) and al-Layth b. Ali (captured 297, elephant parade — dynasty ended), **Abu Rifa'a Umara b. Wathima** (annalist, d. ~289), **Za'im al-Din Yahya Ibn Ja'far** (b. 511/d. 570, vizier-deputy), **Abd al-Aziz b. al-Majishun** (d. 164, al-Mahdi prayed over him). Skipped as roster-only/no-body: Hibat Allah b. Sa'id al-Tabib, Ja'far b. al-Mu'tamid, plus ~20 thin roster names. Dedupe hits dropped: Malik b. Nuwayra, Sa'sa'a, Roger II, Thabit Qutna, al-Atawi, Abd al-Malik b. Salih, al-Majishun, Amr b. al-Layth, Ziyad b. Abi Sufyan, Husayn b. Ali, Bahram Gur, Abu Bakra.

- **Batch 15 (`lib-wafayat-batch-15`, Devin SWE-2):** 17 `person/` records from v3's عارضة layer (the 'ayn-'ayn notices embedded in main entries). Written: **Asad b. al-Furat** (d. Rajab 213 besieging Syracuse — the Asadiyya source and Sicily's first conqueror-judge), **the al-Siddiq family**: Umm Kulthum bt. Abi Bakr (Talha's wife) and Muhammad b. Abd al-Rahman (founder of the Al Abi 'Atiq line), **the two rawis of Ibn Kathir's reading**: Qunbul (d. 191, age 96) and al-Bazzi (d. 270, age 90 — the roster's "النزي" is OCR garble for البزي), **Sitt al-Sham bint Ayyub** (Salah al-Din's sister, d. 616 — two Damascus madrasas), **Abu Rafi' al-Fadl b. Hazm** (Ibn Hazm's brother — killed at al-Mu'tamid's side at Zallaqa 479), **Ayyubid successors**: al-Malik al-Mansur Nasir al-Din of Hama (d. 617), al-Malik al-Nasir Dawud b. al-Mu'azzam of Damascus (b. 603/d. 656), Izz al-Din Aybak of Sarkhad (d. 646 in custody — Ibn Khallikan attended the funeral), **Ibn al-Salah's father** al-Salah Abd al-Rahman (d. 618 Aleppo) and **al-Zaki b. Rawaha** (d. 622), **the Hamdanid line**: Sa'd al-Dawla Sharif (d. 381 — "ما تركت لي اليمين يميناً"), Abu al-Fada'il Sa'd (last of the house), al-Husayn b. Sa'id (first Hamdanid of Aleppo, d. 338 Mosul), **Batikin** (Armenian amir of Irbil, d. 640), **Abu Ali Ibn al-Ikhwa** (Baghdad poet, d. 436). Skipped: entries with only roster-line traces (al-Sharif Diya al-Din, Uthman b. Ibn Dahiyya, the Ibn al-Furat sons, Abu Ja'far b. Qutayba — bodies not located in v3 text).

## بند 16 — الجزء الثاني (رسائل) — دُفع
- **المصدر:** الجزء الثاني (رسائل عارضة داخل تراجم بغداد/الشام)، طبعة إحسان عباس، djvu.
- **الحالة:** المقارنة عبر محصّلة أبو بكر سليمان/الأزهري/الابري/الشيركوهي.
- **السجلات:** أبو الساج؛ ضرغام اللخمي (٥٥٩)؛ طلائع بن رزيك (٤٩٥–٥٥٦)؛ بدران بن صدقة (٥٣٠)؛ قطب الدين محمد بن زنكي (سنجار)؛ عز الدين فروخشاه (٥٧٨)؛ عذراء بنت شاهنشاه (٥٩٣ — مدرسة عذراوية دمشق)؛ الأمجد بهرام شاه (٦٢٨)؛ شهدة الكاتبة (نحو ٥٧٤)؛ أبو نصر الإبري (٥٠٦)؛ ثقة الدولة ابن الأنباري (٤٧٥–٥٤٩)؛ شعيب بن حرب المدائني (١٩٩).
- **مصادقات:** رسائل تتضمن الطلعي والإبري والأنباري بلا أفراد. النسخة المزوية تشمل البعلبك والدمشق (العباسة الإبري).
- **قيد البحث:** غير الكتابة في النسخة الأولى والرسائل بلا أفراد، والرّازية والسيدية الرسائل.

## بند 17 — الجزء الأول (همزة–باء عارضة) — دُفع
- **المصدر:** الجزء الأول، فهرست التراجم العارضة (١٢ عنواناً)، طبعة إحسان عباس، djvu.
- **السجلات:** العراقي الخطيب (٥١٠–٥٩٦ — شرح المهذب بعشرة أجزاء، خطيب جامع مصر)؛ ولده عبد الحكم؛ عبد الله بن زيدون (٣٥٤–٤٠٥ — والد الشاعر)؛ أبو بكر بن ابن زيدون (٤٨٤ — وزير بني عباد)؛ ابن صورة سمسار كتب مصر (٦٠٧)؛ سيف الدين المشطوب (٥٨٨ — أمير عكا، اختلاف نابلس/القدس محفوظ)؛ إبراهيم بن ثابت بن قرة؛ صلاح الدين الإربلي (حجام صاحب إربل صار صاحب البدارقة عند الكامل)؛ ابن الأبار الخولاني (٤٦٣ — شاعر المعتضد، غير البلنسي)؛ الرشيد بن الزبير (٥٦٣ — صاحب كتاب الهدايا والتحف، قتله شاور)؛ المهذب بن الزبير (٥٦١).
- **موجودة أصلاً:** بدر الدين لؤلؤ، ثابت بن سنان بن قرة، ثابت بن قرة، ابن زيدون الشاعر.

## بند 18 — الجزء الأول (الفهرست الرئيسي أ–ج) — دُفع
- **المصدر:** فهرست الجزء الأول الرئيسي (أسماء أحمد–جوهر)، طبعة إحسان عباس، djvu.
- **السجلات:** شرف الدين ابن منعة (٥٧٥–٦٢٢ — شيخ ابن خلكان بإربل)؛ رضي الدين الجيلي (٦٣١ — مفتي النظامية)؛ النامي (٣٩٩ أو ٣٧٠ — مادح سيف الدولة)؛ الميداني (٥١٨ — مجمع الأمثال)؛ القسطلاني (صاحب أبي عبد الله القرشي)؛ باديس بن المنصور الزيري (٣٧٤–٤٠٦)؛ برجوان (٣٩٠ — واسطة العقد الفاطمية)؛ الأسعد بن مماتي (٦٠٦ — ناظر الدواوين ومنظم سيرة صلاح الدين)؛ ابن الخازن الكاتب (خطاط بغداد الأوحد)؛ ابن حنزابة (وزير الإخشيديين)؛ جنادة المروي (٣٩٩ — قتله الحاكم مع المقريء)؛ نور الدين أرسلان شاه (٦٠٧ — زنكي الموصل الوحيد الشافعي).
- **قيد البحث:** ابن الحياط الدمشقي؛ ابن السراج القارئ — متاع الفهرست فقط، لم يُعثر على متنيهما في الشواهد.

## بند 19 — الجزء الثاني (الفهرست الرئيسي س–ظ) — دُفع
- **المصدر:** فهرست الجزء الثاني الرئيسي، طبعة إحسان عباس، djvu.
- **السجلات:** نور الدولة شاهنشاه بن أيوب (٥٤٣ — أكبر إخوة صلاح الدين)؛ بدر الجمالي (٤٨٧)؛ الأفضل شاهنشاه (٥١٥)؛ يوسف الفندلاوي (٥٤٣ عند النيرب)؛ الحامض (٣٠٥)؛ الأرغياني (٥٢٩)؛ ابن الدهان النحوي (٥٦٩–٦١٦ — شرح الإيضاح بـ٤٣ مجلدة)؛ سليمان بن حرب (١٤٠–٢٢٤)؛ صالح المري (١٨٦).
- **دمج:** سليمان بن وهب — كان موجوداً بشاهد مروج الذهب؛ أُضيف شاهد الوفيات وتاريخ ٢٧٠ ومقتله مقبوضاً.
- **موجودة أصلاً:** شاور، صدقة بن منصور، صالح بن عبد القدوس، طاهر الطبري، صاعد الربعي، سيف الإسلام طغتكين، سكينة، طاوس، البسطامي، الدؤلي.

## بند 20 — الجزء الثالث (الفهرست الرئيسي — العين) — دُفع
- **المصدر:** فهرست الجزء الثالث الرئيسي (حرف العين)، طبعة إحسان عباس، djvu.
- **السجلات:** علي بن يونس المنجم (٣٩٩ — الزيج الحاكمي)؛ ابن البواب (٤٢٣)؛ ابن القطاع الصقلي (٤٣٣–٥٠٥ — فرّ من الفرنج)؛ ابن العصار (٥٠٨–٥٧٦ — حارس ديوان المتنبي)؛ شميم الحلي (٦٠١ — اللامسة يضاهي الحماسة)؛ علي الهروي السائح؛ المكاري (٤٠٩–٤٨٦ — لقي المعري)؛ العكوك؛ الزاهي (٣١٨–٣٦٢)؛ ابن السوادي (٤٨٢–٥٥٦)؛ ابن طبرزذ (٥١٦–٦٠٧ — عالي الإسناد).
- **قيد البحث:** السمسماني، الجلعي، الشابشي، ابن القابسي، الشلوبيني — عناوين فهرست بلا متون محققة في الشواهد.

## بند 21 — الجزء الرابع (المحمدون) — دُفع
- **المصدر:** الجزء الرابع، فهرست تراجم المحمدين الرئيسي، طبعة إحسان عباس، djvu.
- **السجلات:** ابن حيوس (٣٩٤ دمشق–٤٧٣ حلب — حُسم الاستب؛ شيخ ابن الخياط ومادح المرداسيين)؛ الأبيوردي (٤٠٨–٤٩٨ واسط — الأموي النسابة صاحب الألفية)؛ الشهرستاني (٤٦٧–٥٤٨ — الملل والنحل ونهاية الإقدام، خطب ببغداد ٥١٠)؛ الحاكم النيسابوري (٤٠٥، قيل ٤٠٣ — المستدرك وشيوخه قاربوا ألفين)؛ المازري (٥٣٦ — شرح مسلم وإيضاح المحصول، دفن بالمنستير)؛ النقاش المقرئ (٢٦٥–٣٥١ — شفاء الصدور والمعاجم في القراءات)؛ الهازمي الهمذاني (٥٤٨–٥٨٤ — الاعتبار وشروط الأئمة).
- **موجودة أصلاً:** الخوارزمي (أبو بكر)، ابن سكة، الشريف الرضي، ابن باجة، ابن زهر، ابن سراج النحوي، قترب، أبو العيناء، السمّاك، ابن سمعون، الفربري، القفال، أبو زيد المروزي، الماسرجسي، ابن المنذر، ومعظم وجوه الفهرست.
- **قيد البحث:** الرفاء الرصافي، ابن شتبوذ، الحانمي الكاتب — عناوين فهرست بلا متون في الشواهد.

## بند 22 — الجزء الخامس (تتمة المحمدين) — دُفع
- **المصدر:** الجزء الخامس، فهرست المحمدين المتأخرين، طبعة إحسان عباس، djvu.
- **السجلات:** المعتصم بن صمادح (٤٨٤ بالمرية — آخر ملوك بني طجيب، شارك المعتمد على يوسف بن تاشفين فخلعه)؛ عماد الدين الأصبهاني الكاتب (٥١٩–٥٩٧ — البرق الشامي والفتح القصي وخريدة القصر، كاتب نور الدين ثم صلاح الدين)؛ ابن باقية الوزير (٣٦٧ — طرح للسباع وصلب بباب الطاق)؛ فخر الملك أبو غالب (٤٠٧ — من أعظم وزراء آل بويه، قتله سلطان الدولة قرب الأهواز)؛ ابن الدهان الفرضي (٥٩٠ — غريب الحديث في ١٦ مجلداً، عثر جمله بالحلة عائداً من الحج)؛ البحراني موفق الدين (٥٨٥ إربل — ناقد الشعر وحالّ إقليدس)؛ ابن عنين (٥٤٩–٦٣٠ — مقراض الأعراض ونفيه صلاح الدين، وزّر بدمشق، دفن بمسجده بالمزة)؛ ابن المعلم الواسطي (بلا تاريخ في الشاهد — شعره يُغنَّى في سماع الرفاعية).
- **موجودة أصلاً:** الزيات، ابن مقلة، ابن العميد، ابن جهير، القائم، المعتمد بن عباد، ألب أرسلان، الأفضل، الكامل، صاحب بن عباد.

## بند 23 — الجزء الخامس (مسلم–مكي) — دُفع
- **المصدر:** الجزء الخامس، الفهرست الرئيسي (مسلم–مكي)، طبعة إحسان عباس، djvu.
- **السجلات:** مكي بن أبي طالب القيرواني (٣٥٥–٤٣٧ قرطبة — القراءات السبع)؛ قطب الدين الطريثيثي (٥٠٥–٥٧٨ دمشق — نائب الجويني بالنظامية نيسابور، زاره ابن خلكان بقبره)؛ مخلص الدولة الكناني (والد أصحاب شيزر آل منقذ)؛ الشريف البياضي (٥٦٨ بغداد)؛ مطرف بن مازن الصنعاني (قاضي صنعاء — خلاف الجرح والتعديل محفوظ)؛ مكي الماسرجسي (٦٠٣ الموصل — المقرئ الضرير حجة كلام العرب).
- **موجودة أصلاً:** مسلم بن الحجاج (= ابن ورد في النسب)، معن بن زائدة، معروف الكرخي، المقلد بن المسيب، مودود صاحب الموصل، مسعود بن قطب الدين، مكي أبو طالب، المعافى النهرواني، مقاتل بن سليمان.

## بند 24 — الجزء الخامس (النون + العارضة الأيوبية) — دُفع
- **المصدر:** الجزء الخامس، حرف النون والفهرست العارض، طبعة إحسان عباس، djvu.
- **السجلات:** نافع مولى ابن عمر (حسم استب موطأ — سلسلة الذهب: الشافعي عن مالك عن نافع)؛ مؤرج السدوسي (٢٠٤ البصرة — تلميذ الخليل، جماهر القبائل)؛ المعتضد بالله عباد (٤٦١ — قطب رحى الفتنة كما قال ابن بسّام)؛ الظافر القاضي محمد بن إسماعيل (مؤسس الدولة العبادية — أطاحوا يحيى بن علي الحمودي وملكوه)؛ ابن اللبانة الداني (لا تاريخ عند ابن خلكان — قدم مراكش ٤٣٩)؛ عميد الدولة ابن جهير (نائب أبيه فخر الدولة).
- **موجودة أصلاً:** زيد بن علي، يحيى بن زيد، النضر بن شميل، المطرزي، الخبزأرزي، ابن قلاقس، ابن الأثير ضياء الدين، الجواليقي، القاضي النعمان، نفيسة، مهيار، الألومبي، ابن جهير فخر الدولة.

### Batch 25 (session 7, diff-of-set) — pushed

Six records from the v5 roster tail: `marwan-al-asghar` (last of the Banu Abi Hafsa
poets — al-Mubarrad's "six poets in a line" remark), `al-hawfazan-ibn-shurayk`
(generous-and-brave Shaybani, spear-goad naming story), `abu-al-ghayth-munqidh`
(d. 539, Shayzar; Ibn al-Qaysarani's elegy), `abu-ata-marzuq-al-sindi` (the lisping
poet baited into "jarada wa-zaj wa-shaytan" by Hammad's circle), `al-mughira-ibn-
al-muhallab` (Muhallabid; Ziyad al-A'jam's dibaj satire), `abd-al-munim-ibn-ghulbun`
(Aleppine qari' settled Egypt 378; taught Makki b. Abi Talib; al-Tha'alibi's praise).
Three remain undated per OCR — bodies lack death lines. validate 0 errors, 19,835
entities.

### Batch 26 (session 7, diff-of-set) — pushed

Five records plus one enrichment from the v5 roster tail: `al-alusi-abu-said-
al-muayyad` (the Iraq poet; Ibn Khallikan met him in 555 half-blind after the
dungeon), `ibn-al-ardakhal` (b. 577 Mosul, d. 628 Mayyafariqin), `musa-ibn-abd-
al-malik-al-isbahani` (d. 246; kharaj-divan chief; the Qadisiyya singing-girl
story), `mansur-ibn-nuh` (Samanid amir d. 365; al-Razi's Mansuri dedicatee), and
`mutarrif-ibn-al-shikhkhir` (the Basran ascetic-faqih d. ~87). `ibn-al-nabih`
enriched with his 619 Nasibin death date. Roster-only names with no bodies
(Ildikizids, Baraka b. al-Muqallad, Abu Jutha) noted but not created. validate
0 errors, 19,840 entities.

### Batch 27 (session 7) — pushed; lane stubs cleared

The lane stub file's four entries resolved: `al-qadi-al-fadil` (b. 535, d. 7
Rabi' II 596; Salah al-Din's insha' chancellor; Ibn Khallikan read the death
date off his Qarafa tomb's marble), `imad-al-din-al-katib-al-isfahani` (b. 519
Isfahan; author of al-Barq al-Shami — death year lost to OCR, died at Damascus
early Ramadan post-589), `al-thaalibi` (350–429; Yatimat al-Dahr) — each with
Arabic prose. `al-afdal-shahanshah` was already covered by
`al-malik-al-afdal-shahanshah`; stub removed. Lane stub file now empty.
validate 0 errors, 19,843 entities.

### Batch 28 (session 7) — pushed

Six records from the v5 tail and v6 و-roster: `al-zafar-al-asadi` (b. 491
Merv, d. 544 Khuzistan, buried beside al-Junayd's enclosure), `harun-ibn-
al-munajjim` (Kitab al-Bari' on 161 poets), `yahya-ibn-ali-al-munajjim`
(Mu'tazili nadim of al-Muwaffaq and al-Muktafi; Kitab al-Bahir), `jaafar-ibn-
thiqat-al-dawla` (Kalbid prince-poet of Sicily), `jaafar-ibn-abd-al-wahid`
(d. ~258; al-Ma'mun's three-day qadi of Egypt, 217), `mahraz-ibn-ziyad`
(killed at Setif 555). Remaining v5/v6 roster-only names documented, no
records (no recoverable bodies). validate 0 errors, 19,849 entities.

### Batch 29 (session 7) — pushed

Three records closing the v6 و-roster diff: `yazid-ibn-mufarrigh` (d. 69, the
Zubayrids' famous satirist), `thabit-qutna` (Khurasani warrior-poet, the
minbar anecdote), `abu-shujaa-ibn-qasas` (al-Amir's confiscation monk, killed
and crucified by al-Miqdad). validate 0 errors, 19,851 entities.

### Batch 30 (session 7) — pushed; roster diff complete

`shihab-al-din-al-kuni` (Yusuf b. Isma'il al-Kuni al-Halabi, the Aleppine
poet Ibn Khallikan knew from 633 till his death; ~20,000-verse diwan).
The v1–v7 roster diff of the Ihsan Abbas 8-volume set (djvu text) is now
complete: every roster line was checked against `data/person/`; all bodies
recoverable from the OCR are written. Roster-only names without locatable
bodies documented per lane policy and not created.

#### Remaining roster-only / unlocatable (v5–v6)
- هلوان / شمس الدين / قزل بن ألدكز (Ildikizid atabegs — passing mention only)
- زعيم الدولة بركة بن المقلد, أبو المعالي قريش بن بدران (Uqaylids — roster only)
- أبو جوته عم الأمير قرواش; محمد بن مسلم بن قريش (embedded, no body)
- الطاهر الحزري, ابن جهور, علم الدين قيصر بن عبد الغني (roster only)
- بشر بن المغيرة بن المهلب, برهم بن بهرام, يوسف بن أبي يوسف القاضي,
  يزيد بن شرحبيل الكندي, محمد بن يزيد بن معاوية (roster only)
- Imad al-Din al-Katib's death year lost to OCR noise (b. 519 recorded)
