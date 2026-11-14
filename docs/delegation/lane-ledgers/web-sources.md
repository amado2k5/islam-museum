<!-- Snapshot of /Users/ahmedabdelaal/islam-museum-harvest/agent-progress/web-sources.md taken 14 November 2026. The live copy stays on the Mac and the microSD; this copy keeps it in git. -->


## 2026-11-08 ~16:55 EST — lane opened, Tier-1 registered

- Lane registered + committed (855354b22c): lane doc, lanes.md row, status.md row, progress file.
- 7 decision questions filed; engine: 4 decided (all via rule-language-ar-first FALSE POSITIVE on "Arabic" in assessment text), 3 founder-docket (unesco/whc legit; archnet+vam were gate false-positives, reworded and re-decided).
- Wrote 6 override records dec-201..206 adopting the assessments: **all six Tier-1 facts-only**. UNESCO WHC stays founder-docket (dec-198).
- Registered 6 families: sources.yaml + 5 new data/source entities + enriched existing source/vam-collection + attribution.md + source-families.md. Commit c7e6550a22.
- Repaired sources.yaml parse breakage (orphan khutab-durus block + bad scalars) — pre-existing on base branch.
- NEXT: pilot-enrich ~10 records per family (V&A API + TEI fiches first — live channels).

## 2026-11-08 ~17:10 EST — first pilot batch committed

- V&A pilot: 8 object records enriched (made_in: Damascus x3, Konya x2, Samarqand x2, Rayy x1) + provenance blocks added (cite-check 8/8). Commit 80d0f23ca2.
- Skipped non-matches documented (Hashim painter ≠ Mir Hashim; empire-level places have no entities).
- Running npm run validate now; then push + PR.
- NEXT: TEI fiches, Archnet/Wayback, Khalili/Qatar HTML, then Tier-2 families.

## 2026-11-08 ~17:15 EST — PR #5654 OPEN

- Branch agent/web-sources pushed (5 commits). PR https://github.com/amado2k5/islam-museum/pull/5654 → base poc/decision-ledger.
- validate 0 errors; tests 428 pass (1 flaky cache race, passes standalone).
- Checks pending: build, shell-impact, test, Devin Review, CF Pages. Merge only when green.
- NEXT SESSION: Tier-2 families + remaining pilots. See docs/delegation/web-sources-progress.md for full state.

## 2026-11-08 ~17:45 EST — Tier-2 registered, PR to main next

- New branch agent/web-sources-tier2 off merged main (PR #5654 merged as 914b38c2e6).
- 7 Tier-2 families assessed live; decisions dec-207..213 engine → dec-214..220 overrides (rule-source-families false-positive, third class).
- Registered: APD, Princeton Geniza, Manar al-Athar, QDL (Tier 1 facts-only); HMML, MWNF, Qantara (Tier 2 facts-only); Zeno → Tier-3 pointer. Commit bc65aae92a.
- Pilots for new families need scripted sessions (APD POST, Qantara POST, Manar JS) — documented in delegation progress file.
- Running validate → push → PR to main → self-merge (CI waived per founder).

## 2026-11-08 (pilots session)

- PR #5656 merged → main @ 9ea00077f4. New branch `agent/web-sources-pilots` off origin/main.
- TEI fiches now GET-able: `EpigraphyDisplay.aspx?id=<n>&pan=1&st=&sc=5`. Created 4 object entities for the 132 AH tiraz silk fragments (V&A London f.47, Brooklyn f.9321, Whitworth f.11979, Moscow f.11980) + trilingual stubs, related_to edges, draft status. Fixed ur-paren validation errors. CANARY + progress updated. Gates re-running.
- Pushed `agent/web-sources-pilots`, opened PR #5657 → main. Gates: validate chain green, vitest 428 pass / 2 skip. Awaiting checks.

## 2026-11-08 (p2 session) — resumed on agent/web-sources-p2 off main@df149f8f89

- PR #5657 merged → main @ 8b596d3098. Fresh branch agent/web-sources-p2.
- Duplicate-source review CLOSED: data/source/vam-collections.yaml never existed in git — only name mentions in dec-200/206 records, inbox file and progress docs. Single canonical entity is source/vam-collection (cited by all object records). No merge needed.
- Next: TEI fiche batch #2 via pan=1 fix; APD/Qantara POST pilots; Archnet Wayback; Khalili/Qatar HTML.

## 2026-11-08 (p2 cont.) — TEI building batch done

- Cracked TEI enumeration: ids 1-800 = core monuments; parsed all rows + ~40 detail pages. Enriched 15 buildings (dome-of-the-rock got its needed 2nd source via 72H foundation inscription f.9). Skipped uncertain IDs (Umariyya≠Nuri, Taif mausoleum≠mosque). Leads: Cizre Ulu Camii entity, Gaza mosque mapping, ids 800+ unswept. CANARY+progress updated; gates next.

## 2026-11-08 — TEI batch #2 (fiches 800–1600) DONE, uncommitted on agent/web-sources-p2

- 801 fiche rows swept; 44 new building enrichments + 5 fiche-list extensions (total 64 TEI-linked buildings). `tei` pattern registered in schema/external-id-patterns.yaml.
- Next after commit/PR: remaining unswept TEI id space (~1601–52000, mostly regional), APD/Qantara POST pilots, Archnet Wayback, Khalili/Qatar HTML, explore-list families.

## 2026-11-08 (p3) — Archnet pilot DONE pending commit; TEI 1601-4800 sweeping

- Branch agent/web-sources-p3 off main@8ffd7d6b25. Archnet via Wayback: 30 buildings enriched (source/archnet + external_ids.archnet). Fixed nested-sources insertion bug + 2 dup lines. CANARY+progress updated.
- vam-collections dedupe CLOSED (no such entity; only source/vam-collection, 191 citations).
- TEI sweep 1601-4800 in progress (~25%). After: match fiches → enrich; then APD/Qantara POST, Khalili/Qatar HTML, explore-list.
- Flag: al-ashraf-barsbay-complex vs khanqah-mausoleum-of-sultan-barsbay possible duplicate entity.

## 2026-11-08 (p3 cont.) — APD pilot DONE (4 enrichments), Archnet batch pending commit

- APD cracked via show_new.jsp POST (content/origplaceid fields). Enriched place/al-fustat, building/qasr-al-hayr-al-gharbi (Hisham letter fragment!), place/mecca, person/ahmad-ibn-tulun — all {cite:apd <inv>} facts-only.
- Pending in tree: 30 Archnet enrichments + 4 APD enrichments + CANARY/progress. Gates next.
- TEI sweep 1601-4800 at ~63%.

## 2026-11-08 — PR #5661 MERGED (Archnet 30 + APD 4)
- All APD anchors re-verified live (P.Vind.inv. A.Ch. 36581/10354, P.SchlumbergerQasr, P.Lond.inv. Syriac Mss. BM Add 12137, P.Michael.inv. B 937/B 327/CQ 37).
- tour/halls.yaml mecca mirror fixed. validate 0 err, tests 428+2skip.
- V&A dedup formally closed: no plural entity exists; decision-record text immutable.
- TEI sweep 1601-4800 ~87% and running.

## 2026-11-08 (p3 cont.) — TEI batch 3 done: 23 entities, sweep continues 4801-8800
- 3200 fiches harvested (1601-4800). 22 buildings + maqam-ibrahim enriched; ~90 false candidates rejected with reasons logged in delegation progress.
- Qantara: do_id record pages live; search broken. Khalili/Qatar HTML + explore-list still pending.

## 2026-11-08 (p3 cont.) — EAMENA registered (dec-222) + commit for TEI batch 3
- TEI fiches 4801-8800 sweep still running (~1.2k/4k at last check); fiches-1601-4800 matching already applied: 23 entities.
- EAMENA explore-list verdict: REGISTERED. ~383k MENA heritage-place records, Oxford/Leicester/Durham + Getty/WMF ARCHES; CC BY 4.0 per open-access policy (attribution posture); public tier withholds coordinates/zoom/condition — no coordinate claims without research access. decision dec-20261108-222 (manual override of engine false-positive dec-20261108-221, same 'Arabic' substring class as dec-190). sources.yaml + data/source/eamena.yaml + attribution.md + source-families.md Tier-1 row. Pilot of 10 records is next.
- Explore-list: Papyri.info reachable (Greek/Latin-focused — APD already covers Arabic papyri; deprioritised). Chester Beatty: no public catalogue/API found — deferred. AlFehrest already Tier-3 per dec-190.
- Qantara: document pages live via do_id; search POST returns empty chrome (broken). Khalili/Qatar verified reachable but ZERO corpus-object matches — enrichment deferred; leads logged.
- Gates: validate 51134 entities 0 errors; tests 428 pass / 2 skip.

## 2026-11-08 (p3 cont.) — TEI batch 4 rolling + EAMENA verdict
- PRs #5664 (TEI batch3 23 entities + EAMENA registration), #5665 (batch4 partial +3), #5666 (EAMENA channel verification), #5667 (+2), #5668 (+8 fiches/4 entities), #5669 (+minaret-of-masud-iii) ALL MERGED.
- TEI 4801-8800 sweep ~77% at handoff; match5.py pipeline re-run per increment; ~15 legit enrichments total this range so far; false-positive classes documented (namesake cities, movable objects, proximity-only, moved inscriptions).
- EAMENA: REGISTERED (dec-222, CC BY 4.0) but anonymous harvest channel verified CLOSED — all API/export forms return []; pilot deferred pending research access or working public query.
- Khalili/Qatar: reachable but ZERO corpus-object matches — deferred, leads logged.
- Qantara: document pages live via do_id; search broken.
- Chester Beatty: no public catalogue — deferred. Papyri.info deprioritised (Greek/Latin focus).

## 2026-11-09 (p4 session) — TEI ranges 4801-8800 COMPLETE + 8801-12800 sweeping
- PRs #5670-5674 merged. TEI 4801-8800 done (4000 fiches, ~24 verified enrichments total in range). New sweep 8801-12800 running (PID 24630, ~28% at last check).
- Batch-5 highlights: Mu'ayyad Shaykh mosque +7 fiches; Taynal +5; Zaytuna +6 total; Alhambra +3; Salahiyya madrasa, Hanabila +4, Qarawiyyin +4, Bab al-Futuh, Dar al-Arqam +2, Salih Tala'i, Pir-i Bakran, Minaret of Masud III.
- DEDUP: melik-gazi-turbesi merged into melikgazi-tomb via aliases (same Niksar türbe). Hassan cluster verified 3 distinct entities (Rabat unfinished / 1196 heritage / Casablanca 1993) — no merge.
- Rejected classes keep growing: namesake cities, quarter-name proximity (Atabey Gazi, Gazi Alemşah), movable objects, moved inscriptions.
- Leads logged: Damascus "Mosquée Hassan" unidentified; Marrakesh Kutubiyya mosque has no building entity (only minbar object); Sinjar Iraq mosque vs Bangladesh entity.

## 2026-11-09 (p4 cont.) — PRs #5670-5677 merged; TEI 8801-12800 ~55%
- Enrichments this range so far: muayyad +7, qarawiyyin +4, uc-serefeli +2, hanabila +1, dastur-khan +1, achut-bibi +1, firuz-aga +1 = 17 fiches/8 entities. All verified per-fiche; ~20 false candidates rejected with classes documented.
- Sweep PID 24630 at ~2050/4000. match6.py runs per increment against fiches-8801-12800.jsonl.
- Queue after TEI: remaining explore-list is exhausted (EAMENA deferred-channel, Chester Beatty no-catalogue, Papyri deprioritised, AlFehrest Tier-3). Next frontier: TEI ranges 12801+ and possibly new families per source-families.md "onboard next" list.

## 2026-11-09 (p5 session) — TEI 8801-12800 COMPLETE + 12801-16800 sweeping
- PRs #5681-5685 merged. Range 8801-12800 done (4000 fiches); range totals now: 1-4800 (5200), 4801-8800 (4000), 8801-12800 (4000) = ~13.2k fiches swept.
- 12801-16800 running PID 21396 (~1600/4000 at handoff). match7.py for this range.
- New-entity leads accumulating: Gawriyya madrasa-mausoleum Cairo (6+ fiches), Kutubiyya mosque Marrakesh, Damascus "Mosquée Hassan".
- Dup-pair checks: melik-gazi MERGED; iskender-pasha pair VERIFIED DISTINCT (Istanbul vs Diyarbakir); abdulvehhab-gazi pair logged.
- All false-positive classes documented per batch in docs/delegation/web-sources-progress.md.

## 2026-11-09 p6 — PR #5690 MERGED: new entities from TEI leads

- **NEW building/madrasa-al-ghawri** (draft): Cairo complex between al-Moski and Bab Zuwayla; 8 TEI fiches (12112–12118, 13542/13566/13573); inscriptions 1503–1517 CE identify Sultan al-Ashraf Qansuh al-Ghawri's foundation.
- **NEW building/kutubiyya-mosque** (draft): Almohad mosque Marrakesh; fiches 9431, 9433, 9434.
- building/masjid-al-haram +17611 (Ḥiǧr Ismā'īl restoration 1516–17), +17646 (gate al-'Abbāsī testimony 1576–77) — both Meccan Ḥaram records; rejected matcher hits sultan-ismail-mosque and el-abbasi-mosque as false positives.
- object/maqam-ibrahim +17616 (Maqām Ibrāhīm restoration 1509–10).
- object/minbar-kutubiyya +7946 (minbar fabricated in Cordoba).
- Damascus Mosquée Hassan (fiche 7961): single unidentified record — NOT created, kept as lead.
- TEI 16801–20800 sweep in progress (~900/4000 at merge time).

## 2026-11-09 p7 — PR #5694 MERGED: 7 new TEI entities, range 16801-20800 complete

- building/shah-i-zinda (Samarkand necropolis): 80 TEI fiches — richest single entity yet
- building/po-i-kalyan (Bukhara): 5 fiches | building/vabkent-minaret: 2 | building/turabek-khanym-mausoleum: 2 | building/mausoleum-of-najm-al-din-kubra: 3 | building/mausoleum-of-sultan-tekesh: 2 | building/ulu-cami-cizre: 3
- object/maqam-ibrahim +17726
- Abdulvehhab Gazi pair resolved as 3 distinct tombs (Wikidata coords: Bayburt/Bolvadin/Elmalı)
- TEI coverage now complete through 20800; next sweep 20801-24800 running (pid 80419)

## 2026-11-09 p8 — PR #5696 MERGED: TEI 20801+ partial (4 enrichments)

- aslam-al-silahdar-mosque +21240 | sayyida-nafisa-mosque +21401 | yakutiye-madrasa +22218 | mama-hatun-turbesi-tercan +22226
- Rejected: humayun-tomb, tomb-of-mahmud x2. Sweep ~1900/4000.

## 2026-11-09 p9 — PR #5697 MERGED: TEI 20801-24800 COMPLETE

- 9 enrichments + NEW hammam-darwaza-mosque-jaunpur; rich rejects documented (masjid-ibn-ladin Jeddah-vs-Kot, hazrat-sultan Kitob-vs-India, humayun-tomb x7, mahmud x4)
- TEI coverage through 24800; next sweep 24801-28800 running (~1000/4000)

## 2026-11-09 p10 — PR #5698 MERGED: TEI 24801-28800 COMPLETE

- ennejma-ezzahra +41, great-mosque-cordoba +9, alcazar-of-the-caliphs +5 (al-Andalus)
- quwwat-ul-islam +24851, ghiyath-tughluq tomb +25247, humayun-tomb +25438
- imam-al-bahir +26502, al-imam-muhsin +27024, mustansiriyya +26575
- alhambra +7 architectural (50 Objet deferred); NEW mahmud-gawan-madrasa; masud-iii +24849, muhafiz-khan +25407
- Rejects documented; leads logged: Aljaferia Zaragoza, Alcazaba Malaga/Almeria, Kushk-Mahal, Shah-i-Mardan Marot, Muchchandipalli Calicut, Sehwan Marwandi, Hathazari
- TEI through 28800; next sweep 28801-32800 running (~1000/4000)

## 2026-11-09 p11 — PR #5699 MERGED: TEI 28801-32800 COMPLETE

- 15 enrichments: alhambra +6, uc-serefeli +2, selimiye +1, kubadabad-palace +3, hanabila +1, cinili-kosk +1, ahi-evran +1, arap-baba-mescidi +1, tomb-of-dev-ali +1, al-firdaws-madrasa +1 (Aleppo!), yivli-minare +2, hamza-bey-turbesi +1
- ~100 namesakes rejected (Bab al-Nasr Aleppo/Damascus vs Cairo; Maqam Ibrahim Aleppo vs Mecca; Sidi Ansari Aleppo-region vs Tunis; Ahmad al-Badawi Damascus vs Tanta; Tankiziyya Damascus vs Jerusalem; Mahmud/Mehmed/Selcuk Hatun tombs-vs-mosques)
- Leads logged for new entities: Sehzade Mahmud Turbesi Muradiye Bursa, Gulbahar Hatun + Selcuk Hatun mescidi Edirne, Mashhad Sa'd al-Ansari Aleppo region, Zawiya Ahmad al-Badawi Damascus, Sofular Camii Yambol, Hamza Bey Cami Stara Zagora
- Next sweep: 32801-36800 running

## 2026-11-09 p12 — PR #5700 MERGED: TEI 32801-36800 COMPLETE

- 12 enrichments: suleymaniye +32831, yivli-minare +3 more, alhambra +33808, cifte-minareli +2, torumtay +32844
- turbe drafts: seyh-bedreddin +32808, seyh-tennuri +32928, seyyid-serif +32836, seyyid-battal-gazi +33444
- parizad-madrasa +36001 (Mashhad), diri-baba +36162 (Maragha), imamzadeh-abbas-sari +36297,36301
- ~30 rejects documented; next sweep 36801-40800 running (~1300/4000)

## 2026-11-09 p13 — PR #5701 MERGED: TEI 36801-40800 COMPLETE (thin range)

- 3 enrichments: bab-zuwayla +38857, sayyida-nafisa-mosque +39651,39653 (Cairo shrine, not Baghdad bimaristan), alhambra +40515
- ~20 rejects documented (Masud III palace-vs-minaret, Gawhar Shad vs Jam Ghurid, Turkmenistan Luqman mausoleum vs Levant fort, Tobolsk finds, Skopje namesakes)
- TEI coverage through fiche 40800; next sweep 40801-44800 running (~1500/4000)
- Remaining to ~52000: ~11200 fiches ≈ 3 ranges (40801-44800, 44801-48800, 48801-52000+)

## 2026-11-09 p14 — PR #5704 MERGED: TEI 40801-44800 COMPLETE + 6 new entities

- alhambra +49 palace fiches (Partal/Mexuar/Comares/Lions/Infantas/San Francisco)
- NEW: gulbahar-hatun-mescidi, selcuk-hatun-mescidi (Edirne), sehzade-mahmud-turbesi-bursa, mashhad-sad-al-ansari (Aleppo region, 6 fiches), zawiya-ahmad-al-badawi-damascus, sofular-cami-yambol
- old-mosque-stara-zagora +31898; maqam-ibrahim +43022 (Mecca); +8 more enrichments
- ~60 Istanbul namesakes rejected; next sweep 44801-48800 running (~1700/4000)

## 2026-11-09 p15 — PR #5705 MERGED: TEI 44801-48800 COMPLETE (thin)

- qarawiyyin +7 (sahn pavilion, Bab al-Ward dome, khatib hall, Bab al-Shammain lustres); guzelce-hasan-bey +45061
- ~12 rejects; next sweep 48801-52800 running (~1400/4000) — covers ~52000 target

## 2026-11-09 p16 — PR #5708 MERGED: TEI 48801-52800 COMPLETE — ~52000 milestone

- sehzade-mosque +49226, madrasa-of-al-nasir-muhammad +50259, madrasa-al-ghawri +50914,50915
- ~12 rejects; TEI coverage now fiches 1-52800
- PROBE: catalogue continues past 52800 (fiches exist at 53000/54000/55000/56000/60000) — real id space larger than ~52k estimate
- NEXT: sweep 52801-56800 launched in background

## 2026-11-09 p17b — Nomisma.org REGISTERED Tier 2 (dec-20261109-224)

- Engine fired rule-language-ar-first false positive on "Arabic" in assessment text (dec-223) → manual override dec-224, same class as dec-190/204
- Registered: data/source/nomisma.yaml, scripts/harvest/sources.yaml entry (layer: by), docs/attribution.md row, source-families.md Tier 2 row + explore-list update
- Pilot pending: SPARQL harvest script to be written; first pilot targets mint→place / issuer→person corroboration (only 2 kind:coin objects exist — duranir-andalusiyya, umm-hajara-hoard)
- Remaining numismatics explore candidates: ANS MANTIS, Tübingen Sylloge Nummorum Arabicorum, Fitzwilliam + Ashmolean online collections
- TEI sweep 56801-60800 running (~1839/4000 at registration time)

## 2026-11-09 p18 — Nomisma registered (PR #5719 MERGED) + TEI 56801-60800 COMPLETE

- Nomisma.org Tier 2 registered (dec-20261109-224 override of engine false-positive dec-223); pilot queued
- TEI 56801-60800: alhambra +3 only; ~4 rejects documented
- HORIZON: real TEI records end at fiche 61517 — final sweep 60801-61517 running

## 2026-11-09 p19 — TEI CATALOGUE EXHAUSTED (fiche 61517) + Nomisma pilot 10 places

- 60801-61517: 717 fiches, 0 candidates — catalogue tail is empty of matching inscriptions
- **TEI SWEEP COMPLETE: fiches 1-61517 all harvested+matched+verified**
- Nomisma pilot: 10 place records (damascus,cairo,baghdad,kufa,samarra,isfahan,nishapur,merv,qazvin,rayy) gained external_ids.nomisma + source/nomisma; mint defs verified per-record
- Nomisma SPARQL: GET /query?query=..., SPARQL 1.0 (Orbeon, no property paths), ~2000 mints
- Next: expand Nomisma pilot (more mint↔place pairs + issuer→person/polity); other explore families pending

## 2026-11-09 p20 — Nomisma pilot EXPANDED to 73 mint↔place links

- +63 places (19+44 verified): full Islamicate mint map — al-Andalus (cordoba,seville,granada,marrakesh,almeria,malaga,palermo,tunis,qayrawan,ceuta), Egypt (al-fustat,cairo), Levant (damascus,aleppo,jerusalem,tarsus,sur,ammon? no—amman), Iraq (baghdad,kufa,samarra,wasit,hilla,surraq,amid,mayyafariqin,ramhurmuz,sinjar,harran,hims,al-basrah,al-rafiqah), Iran/CAsia (isfahan,nishapur,rayy,qazvin,merv,marw,bukhara,samarqand?—no: samarquand not applied? CHECK,herat,shiraz,tabriz,yazd,ardabil,kirman,fasa,hamadhan,qumm,istakhr,gilan? no), Anatolia/Balkans (bursa,edirne,istanbul,izmir,tiflis,khilat), Arabia (mecca,medina? no—mecca only,muscat,aden,sanaa,zaranj,ghazna,kabul,delhi,agra,samarqand?,balkh,al-shash,mardin,petra)
- Note: place/samarqand existed but nm:samarqand not applied? — VERIFY before next batch; place/sana'a applied via slug "sana'a"
- Rejected ~30 name/kind mismatches documented in delegation ledger

## 2026-11-09 p21 — Nomisma ISSUER PASS COMPLETE (polities+persons+coins)

- Authority→polity: 16 files already carried nomisma external_ids from prior session (uncommitted) — verified present
- Person→issuer: 59 person records linked after per-concept skos:definition verification (SPARQL 1.0; canonical URI http://nomisma.org/id/<slug> — https returns zero triples)
  - Abbasid: al-mansur, al-amin, al-mutazz, al-muttaqi, al-nasir-billah, al-zahir-billah
  - Fatimid/Ubaydid: ubayd-allah-al-mahdi → al-qaim-fatimid → al-muizz → al-mansur-ubaydi → al-adid, al-amir, al-mustansir, al-mustali, al-zafir (9)
  - Ayyubid: al-malik-al-aziz-uthman, al-adil-ii, al-malik-al-adil-ayyub (Adil I), al-malik-al-adil-salamish, al-malik-al-kamil, al-malik-al-salih-ismail, turanshah (7)
  - Tulunid/Ikhshidid: ahmad-ibn-tulun, muhammad-ibn-tughj-al-ikhshid (2)
  - Cordoba Umayyads: abd-al-rahman-ii, abd-al-rahman-iii-al-nasir, hisham-i, al-hakam-i, al-mustansir-hakam (Hakam II), sulayman×2 dup pair (6 files)
  - Others: masud-ibn-mahmud, muhammad-tapar, masud-ibn-muhammad-saljuqi, ahmad-ibn-uways, al-nasir-muhammad-ibn-qalawun, al-malik-al-mansur-ali-ibn-aybak (6)
  - Mamluk: qutuz, faraj-ibn-barquq, jaqmaq-al-zahiri, al-ashraf-inal, al-mansur-fakhr-al-din-uthman (5)
  - Moroccan: hassan-i-of-morocco (1)
  - Ottoman: bayazid-i-yildirim, murad-iii/iv-uthmani, ahmad-iii-uthmani, mustafa-i/iii-uthmani, abd-al-hamid-i/ii-uthmani, abd-al-aziz-uthmani, abd-al-majid-i-uthmani, mehmed-ii, mehmed-iii-uthmani, muhammad-v-rashad, uthman-ii-uthmani (Osman II), bayazid-ii (14)
- Coin objects: duranir-andalusiyya + umm-hajara-hoard got denomination/issuer ids — kind:coin census = 2 records total, type pass DONE
- REJECTED by def-check: al-hasan-al-a'sam (Mamluk Yusuf≠Qarmati), muhammad_iv+muhammad_iii (Morocco≠Hafsid), al-'aziz-uthman-ibn-yusuf→ayyubid not fatimid, murad_iii→ottoman not bey, al-hafiz_b_al-hasan→Morocco not Fatimid, abd_al-rahman_ibn_hisham/ibn_yazid→Morocco/official not Cordoba
- NO FILE for: al-Saffah, Hisham II, Tumanbay (def garbled), Ayyubid-Egypt al-Mansur, Mamluk Ali II, Kayqubad II, Mamluk al-Mansur Abu Bakr, Shihab al-Din Ahmad, Marinid Abu al-Hasan, Zaydan, ghiyath_al-din_mas'ud_ii
- DUPLICATE FLAGGED: sulayman-al-mustain-cordoba ≡ sulayman-al-mustain-andalusi (same person, same nomi id on both pending merge ruling)
- Gates + PR next; then explore-list: ANS MANTIS, Tubingen Sylloge, Fitzwilliam/Ashmolean, ms catalogues, iDAI.gazetteer, Walters, muslimscholars.info

## 2026-11-09 p22 — ANS MANTIS REGISTERED Tier 1 facts-only (PR #5726 MERGED)

- ~98k coin objects, 60,672 Islamic-department records; ODbL data + PDM images; NUDS/RDF/JSON-LD/Atom APIs; records carry nomisma URIs matching our external_ids
- dec-225 engine false-positive: 'nomination' inside 'denominations' → override dec-226 Tier-1 ruling (4th substring specimen)
- Registered: data/source/ans-mantis.yaml + registry + attribution + Tier-1 row + CANARY
- Pilot next: bounded coins of already-linked rulers; ODbL share-alike review before bulk ingest
- Continue explore: Tübingen Sylloge, Fitzwilliam/Ashmolean, ms catalogues, iDAI.gazetteer, Walters, muslimscholars.info

## 2026-11-09 p23 — Explore-list: Tübingen DEFERRED, Fitzwilliam/Ashmolean probing

- Tübingen MK-TUE-FINT (SNAT online catalogue): authority excellent but site BROKEN (u-017-s126 host dead, fint-ikmk PHP fatal, Wayback 429) + only ~444 objects online; real corpus = copyrighted Wasmuth print vols → DEFERRED, revisit when live
- Fitzwilliam: main site live, robots.txt open, links data.fitzmuseum.cam.ac.uk/api — API host times out (000) → DEFERRED pending API reachability
- Ashmolean: /collection 404 on guessed path — needs real search URL + licence check → deferred with Fitzwilliam
- Next: manuscript catalogues beyond QDL/HMML, iDAI.gazetteer, Walters (Wayback/API-key), muslimscholars.info; then MANTIS pilot on coins of already-linked rulers

## 2026-11-09 p23 (cont.) — Walters probe + PR #5727 merged

- Walters Art Museum API (thewalters.org/api/v1): Cloudflare managed challenge on every request incl. robots.txt → DEFERRED, same class as Zeno/Archnet live-block; revisit via Wayback snapshots or founder contact, never bypass the challenge
- PR #5727 (scout-round ledger + canary) MERGED into main as f2bc249e5f; local main fast-forwarded; tree clean
- Next session: append the Walters line to docs/delegation/web-sources-progress.md with the next substantive PR; continue explore list — muslimscholars.info, iDAI.gazetteer, BnF Gallica, Chester Beatty, Leiden manuscripts; then MANTIS object pilot on coins of already-linked rulers
- muslimscholars.info probed: frameset-era site by Arees Institute, "All contents copyright", no API/structured access, single-institute authority → REJECTED as citation source; the Itqan narrator DB (MIT, ~115k rijal profiles) already covers the rijal cross-reference need far better
- State: main at f2bc249e5f, tree clean, all gates green. Uncommitted-to-repo: the Walters deferral line (carry into next PR's delegation-ledger append)

## 2026-11-09 p24 — iDAI.gazetteer ONBOARDED Tier 2 + 12-city pilot (branch agent/web-sources-p24)

- Coin-object Nomisma verification done: both kind:coin records' comma-joined nomisma ids decompose to verified concepts (dirham, umayyads_spain, umayyads, abbasids); no changes needed. nomisma pattern stays unregistered (sulayman dup pair would error).
- iDAI.gazetteer assessed → Tier 2: DAI place gazetteer, CC-BY 4.0, JSON API, ~25-lang names incl. Arabic, owl:sameAs→Pleiades/geonames. Decision dec-20261109-228 override (engine docked dec-227 on literal 'robots.txt' — 5th substring false-positive).
- Registered full package: source entity, harvest registry, attribution, source-families Tier-2 row, external-id-patterns `idai`, CANARY, delegation ledger.
- Pilot: 12 cities linked (damascus 2280221, aleppo 2280212, cairo 2042858, cordoba 2361201, fez 2118497, istanbul 2285315, qayrawan 2042772, marrakesh 2110784, mecca 2283160, medina 2043268, tunis 2042783, baghdad 2769425).
- Deferred re-probes all still down (Tübingen 000, Fitzwilliam API 000, Walters 403 CF).
- Next: more iDAI place batches; BnF Gallica, Chester Beatty, Leiden, Princeton/Cambridge MSS, Papyri.info.

## 2026-11-09 p25 — iDAI batch 2 MERGED (PR #5746): 34 cities total linked

- 22 more verified links: antioch 2283111, balkh 2410924, basra 2771817, bursa 2283204 (Prusa), constantine 2042624, edirne 2283001, granada 2359867, herat 2379586, jerusalem 2090049, khiva 2733465 (Chiwa), konya 2283197, kufa 2733318, malaga 2359874, murcia 2361205, nishapur 2368554, palermo 2359599, samarqand 2042967, samarra 2283182, seville 2361218, tlemcen 2764518, tus 2110058, valencia 2361215
- Wasit SKIPPED: iDAI admin-unit at [45.82,32.52] vs record's flagged-approx [46.30] — ~50km apart, needs coordinate reconciliation first
- No-match cities: bukhara, merv, rayy, qum(m), ghazna, zaranj, hamadhan, istakhr, abiward, algiers — gazetteer coverage thinner for some regions/modern names
- Gates green both PRs; local main current. Next: batch 3 candidates (nasa, balkh-province handled?, remaining Maghreb cities — oran/fes-variants, plus smaller Andalusi towns); or pivot to next source family (BnF Gallica, Chester Beatty, Leiden, Princeton/Cambridge MSS, Papyri.info); re-probe Tübingen/Fitzwilliam/Walters

## 2026-11-11 p27 — iDAI batch 3 (PR #6064 MERGED, merge commit 6116ab73d8): 59 cities linked; lane handed over

- +25 verified idai links: annaba 2110071, bejaia 2123033, biskra 2110421, oujda 2765527, setif 2096154, sfax 2042776, sousse 2042779, gabes 2099425, wahran 2092359 (Oran), t-touan 2770734, almeria 2359875, cartagena 2365651, tulaytula 2074550 (Toledo), tortosa 2359868, ubeda 2099325, ucl-s 2756492, isfahan 2089954, shiraz 2109666, tabriz 2109526, hamadan 2043471, tustar 2750078, urmia 2733746, aden 2287356, zabid 2043303, tayma 2281940. All populated-place, <=1.2 km, doc/<id>.json read.
- Not linked: asilah (entry = ancient Zilil), casablanca (no types), algiers/abu-dhabi (no city entry), sabzevar/khenchela/tabarqa/sidirokastro (two gazetteer entries each), place/fes + place/harat (ids already on fez/herat; idai key unique). No hit: bukhara, merv, rayy, qumm, ghazna, hamadhan, tashkent, tirmidh, sijilmasa, muscat, taif, hail, yanbu, doha, kuwait-city, qafsa, Arabic-spelled Andalusi slugs (sarqusta, shatiba, tarraqona...).
- GeoNames id mismatch seen (ours vs iDAI), NOT changed: sfax, sousse, gabes, tortosa, ubeda, ucl-s.
- BATCH 4 READY (doc-verified 11 Nov, not applied): miliana 2765865, nafta 2771890, ceuta 2042679, ibiza 2359879, messina 2299105, cefalu 2178796, trapani 2178811, tudela 2756485, sari 2379573, tehran 2096795, mashhad 2110061, maragha 2733333, ardakan 2110655, kabul 2090085, kandahar 2783275, khorramshahr 2749824, shibam 2751839, tabuk 2043287, radaa 2752099, jeddah 2751578, riyadh 2784883, dhi-as-sufal 2773916.
- NOMISMA MINT BATCH READY (25, each concept .jsonld read: nmo:Mint, Arabic label, coords; NOT applied): mukalla<-al-mukalla, taraz<-taraz, tulaytula<-tulaytulah, akka<-acre, ramla<-al-ramlah, khoy<-khoy, tustar<-tustar_min_al-ahwaz, sijilmasa<-sijilmasah, rabat<-rabat, constantine<-constantine_algeria, amol<-amol, tashkent<-tashkent (7.4 km, inside city), bukhara<-bukhara, tirmidh<-termez, tehran<-tehran, mashhad<-mashhad, kashan<-kashan, jayy<-jayy, rasht<-dar_al-marz_rasht, jannaba<-jannaba, sari<-sari, al-ahwaz<-ahwaz, murshidabad<-murshidabad, burhanpur<-burhanpur, belgrade<-belgrade. Rejected: madinat_al-zahra (definition garbled: a Gaza municipality), qarqisiyah (13.4 km), ra's_al-ayn (12.6 km), andarabah (definition garbled), qaysariyah->sariya (name false positive), ancient-site mints (ctesiphon, alexandreia_egypt, trebizond...), duplicate place records (ishbiliya, madinat-gharn-ah, harat, qazwin, sur-lubnan, rafiqa, al-meriyya). Later: ankara, serres. Noted, not changed: place/sijilmasa label.ar reads «مجلماسة» (Nomisma: سجلماسة).
- Sulayman dup pair: engine DRY-RUN answers rule-duplicate-alias (merge into richer, alias). Not written, not applied: ai-change-gates §3 labels merging/removing records submission-impacting (founder sign-off). Proposal: cordoba record canonical. Inbox draft: /tmp/claude-501/laneB/web-sulayman-al-mustain-duplicate-merge.yaml (temp; recreate if gone).
- Papyri.info ASSESSED, not registered: live site behind Anubis bot challenge (never bypass); data repo github.com/papyri/idp.data is CC BY 3.0 (README), layout DDbDP/<n>/<TM>.xml + HGV_meta_EpiDoc/HGV<n>/<TM>.xml. Proposed Tier 2 facts-only, anchor ddb-hybrid id. Pilot fact read: TM 19103 = sb;6;9576, Greek-Arabic receipt of emir "Abdella" for 65 sheep, 25 Apr 643, Herakleopolis? (cert low) -> place/ahnas. Engine dry-run false-positives: nd-review-status on the word 'verified'; without it rule-source-families fires on 'source family' -> needs kind: override. Drafts in /tmp/claude-501/laneB/ (papyri-info.yaml, web-papyri-info-onboarding.yaml).
- Probes 11 Nov: Gallica 403 Cloudflare; CUDL 403 CloudFront; Princeton dpul/catalog 000; Fihrist bot challenge; Chester Beatty viewer 200 (Goobi; robots disallows search/OAI; no licence line on home); Leiden 200 (Crawl-delay 10; terms not found on home). Re-probes: Tübingen fint-ikmk still PHP fatal, u-017-s126 000; Fitzwilliam data API 000; Walters 403 challenge.
- Env notes: fresh worktree needs `npm ci` at root AND `npm --prefix site ci`, and `npm run graph` before `npm run coverage`/`npm test`. With machine load ~90, validate ~15 min, tests ~13 min; main moves ~25 commits meanwhile, expect CANARY/coverage.md conflicts (coverage: take theirs, regenerate).
- Resume: worktree islam-museum-web is clean on agent/web-sources-p28 at origin/main. Next = apply iDAI batch 4 (22 ids above), then Nomisma mint batch, then dup-pair decision + Papyri.info registration.
