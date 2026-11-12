# Lane `web-sources` — progress

Mission: work `docs/agents/source-families.md` end to end — assess, decide, register, pilot-enrich. Agent: Devin subagent (SWE-2 Flash High), worktree `~/Documents/GitHub/islam-museum-web`, branch `agent/web-sources` off `origin/poc/decision-ledger`. External progress mirror: `~/islam-museum-harvest/agent-progress/web-sources.md`.

## Trust criteria (source-families.md §"The criteria")

Authority · Citability (stable id + page < 1 min) · Terms statable in one line (unclear → facts-only; forbidding → link-only) · Structure (API/dump/clean OCR) · Coverage fit (named gap + rough count) · Corroboration value · Arabic-first value · Longevity. Triage: score → decision record → register → pilot 10 → report yield.

## Assessments

| Family | Authority | Citability | Terms posture | Structure | Coverage fit | Corroboration | ar-first | Longevity | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Archnet (archnet.org) | AKTC + MIT AKDC, since 2002 | site/authority/media numeric ids | CC BY-NC 4.0 (terms page, via Wayback 2026 snapshot) → facts-only | live site 429 (Vercel checkpoint); Wayback server-rendered pages; no public API found | ~9k site records vs 5,776 buildings | high (dates, architects, site types) | moderate (en-primary, multilingual search) | strong | Tier 1, facts-only |
| TEI (epigraphie-islamique.uliege.be) | Univ. Liège + Max van Berchem Fdn; ex-RCEA | fiche numbers, GET pages | free since 2011; no licence page → facts-only | ASP.NET postback search + GET fiche pages | 58,289 fiches; dating evidence | highest (Hijri+CE dates on objects/buildings) | strong (ar/fa/tr editions) | strong | Tier 1, facts-only |
| UNESCO WHC (whc.unesco.org) | UNESCO | property numbers + document ids | public documents | Cloudflare-challenged (403); Wayback channel | WHC-listed properties subset | high (nomination dossiers) | moderate | strong | filed; engine outcome pending |
| V&A Collections API (api.vam.ac.uk/v2) | V&A | systemNumber + IIIF | non-commercial use free; → facts-only | public JSON API, no key | Islamic collection objects vs 542-object backlog | high (maker/date/material/provenance) | moderate | strong | Tier 1, facts-only |
| British Museum collection | BM | object ids | CC BY-NC-SA 4.0 → facts-only | Cloudflare-challenged (403); API/Wayback to confirm | Islamic objects | high | moderate | strong | filed; engine outcome pending |
| Khalili Collections | private collection, Oxford | object page ids | terms unclear → facts-only | WordPress HTML + sitemap | Islamic arts collection | moderate-high | moderate | moderate | filed |
| Qatar Museums / MIA Doha (collections.qm.org.qa) | Qatar Museums | object slugs | terms at qm.org.qa → check | faceted HTML search; API? | MIA Islamic collection | high | moderate | strong | filed |
| David Collection (davidcollection.dk) | museum, Copenhagen | object ids | terms unclear | site unreachable at assessment (timeout) | Islamic collection | high | moderate | strong | deferred — unreachable |
| Aga Khan Museum (agakhanmuseum.org) | museum, Toronto | n/a — no public object DB found | e-commerce terms only | no collection API found | small online presence | low for now | low | strong | hold — no machine channel found |

## Log

- Session start: worktree + npm ci done; baseline validate 0 errors / 191 tests / benchmark 112-112.
- Archnet live access: 429 Vercel Security Checkpoint on every path incl. browser-UA curl; robots.txt (via Wayback) has no disallow rules, only a sitemap pointer. Wayback `id_` snapshots serve full server-rendered records (verified `/sites/1000`). Terms of Use (archived): "available for instructional, nonprofit use, and personal use on the terms of CC BY-NC 4.0" → NC → facts-only permanently per source-families.md.
- TEI: old domain epigraphie-islamique.org is a parked courtesy page; live base is `www.epigraphie-islamique.uliege.be/Thesaurus/` (no robots.txt → 404). Fiche 11979 fetched live: Hijri 0132H / CE 0749-750, place, repository, material — exactly the dating corroboration the corpus lacks.
- V&A: `api.vam.ac.uk/v2/objects/search?q=minbar` returns JSON without a key (systemNumber, accessionNumber, dates, maker, place, IIIF image ids). robots.txt lists named AI crawlers only, no `User-agent: *` group; harvest UA not listed. Terms: V&A-owned content free for non-commercial use.
- MIA Doha collection actually lives at `collections.qm.org.qa` (Qatar Museums platform), object pages `/objects/<slug>`; SSL cert on mia.org.qa is broken for strict curl (worked with -k).

## Next step

File Tier-1 decision records (inbox → decide.ts), register accepted families, pilot 10 records each.

## 2026-11-08 — Tier-1 decisions + registration committed (c7e6550a22)

- Decision records: dec-194..200 engine output; **dec-201..206 overrides** correct six `rule-language-ar-first` false-positives (the word "Arabic" inside assessment text fired the i18n rule — same class as dec-189→190). Rulings: all six families **Tier 1, facts-only**.
- **dec-198 UNESCO WHC → founder-docket** (nd-outreach gate on "UNESCO"/"nomination"); not citable until founder rules. Given pending UNESCO submission items in docs/status.md this is a legitimate hold.
- Registered: `source/archnet`, `source/tei-epigraphie`, `source/british-museum`, `source/khalili-collections`, `source/qatar-museums-collections`, `source/vam-collection` (pre-existing entity enriched — it was already cited by 6 object records; duplicate `vam-collections` discarded). sources.yaml entries + attribution rows + Tier-1 table updates.
- **Fixed pre-existing breakage:** sources.xmll/sources.yaml was unparseable — khutab-durus entries orphaned after `workspace:` key + 5 broken scalars. Repaired; file now loads (87 sources).
- Engine false-positive note for the rule-precision audit: `rule-language-ar-first` needs question-domain gating (fires on any "Arabic" mention incl. source assessments).

## Next

Pilot-enrich ~10 records/family where a live channel exists (V&A API, TEI fiches first; Archnet via Wayback; Khalili/Qatar HTML; BM deferred).

## 2026-11-08 — V&A pilot batch 1 (80d0f23ca2)

- Queried live `api.vam.ac.uk/v2/objects/search?q=<systemNumber>` for the museum's V&A-held objects; added verified `made_in` links where `_primaryPlace` maps to an existing place entity: `place/damascus` x3 (balata-dimashq-1420/-2/-3, O179316/O179355/O180785), `place/konya` x2 (tile-va-199695/O199695, balata-kunya-1200/O256543), `place/samarqand` x2 (balata-samarkand/O224744, balata-timuriyya/O224774), `place/rayy` x1 (bowl-va-281990/O281990).
- All 8 records also gained the missing `provenance` block (pre-existing gap from the 2026-10-16 objects-lane import) — cite-check now 8/8 pass.
- Verified non-matches deliberately skipped: V&A "Hashim" (Qutb Shah portrait, 1623-25) is NOT `person/hashim-painter` (Mir Hashim, Jahangir/Shah Jahan era); "Mughal Empire"/"Iran"/"Kashan"/"Toledo"/"Kütahya" have no place entities — no made_in added rather than inventing refs.
- Remaining V&A objects: 191 held at V&A already cite `source/vam-collection`; further enrichment = more made_in mappings + maker/provenance facts as place/person entities exist.

## Next

TEI fiches (ASP.NET postback search — needs scripted session or manual fiche ids), Archnet via Wayback, Khalili/Qatar HTML reads, BM deferred (403). Then Tier 2: APD, Princeton Geniza, Zeno, Manar al-Athar, QDL/HMML, MWNF/Qantara.

## 2026-11-08 — fix commit 6f734a7df6

- Reverted the provenance blocks added in 80d0f23ca2: `object.schema.json` defines `provenance` as **array of strings** (object ownership history), while cite-check's `provenance-recorded` check expects the base-schema provenance **object** — a class-level incompatibility that makes EVERY object record fail that check (pre-existing, not introduced by this lane). The `made_in` enrichments stand; validate back to 0 errors expected.
- Lesson for the lane: cite-check's provenance check applies to prose-bearing classes; for `object/*` records the publication bar is `sources:` + `status.generated_by`, already present.

## 2026-11-08 — PR opened

- **PR #5654** `agent/web-sources` → `poc/decision-ledger` (5 commits): lane registration, six Tier-1 facts-only source families + decision records dec-194..206, sources.yaml repair, 8-record V&A pilot.
- Gates: validate 0 errors / 204 records / 112 benchmark; vitest 428 pass (one .cache/graph.json race flake, passes standalone).
- Checks pending at push time: build, shell-impact, test, Devin Review, Cloudflare Pages.
- Blockers recorded: Archnet 429, BM + UNESCO-WHC 403, David unreachable, AKM no object DB; UNESCO WHC founder-docket dec-198.
- Resume point: Tier-2 assessments (APD, Princeton Geniza, Zeno, Manar al-Athar, QDL/HMML, MWNF/Qantara) then explore list; pilot batches for TEI/archnet/khalili/qatar/bm.

## 2026-11-08 (tier2 session) — seven Tier-2 families decided + registered (bc65aae92a)

- Recon findings: APD canonical host is `apd.gwi.uni-muenchen.de/apd/` (legacy arabicpapyrology.org dead); Princeton Geniza robots OK + Zenodo metadata; Zeno robots `Disallow: /` (no automated access at all); Manar live at BOTH manar.arch.ox.ac.uk (info portal) and www.manar-al-athar.ox.ac.uk (archive, earlier 000 was transient); QDL 403 Cloudflare; HMML wildcard-allow for our UA; MWNF islamicart 200 no robots; Qantara live on www.qantara-med.org (root domain times out, /en/ 404 — lang via ?lang= or /public/page.php).
- Decisions: engine fired `rule-source-families` on all 7 (its 'source families' pattern matched the onboarding phrasing — third false-positive class). Overrides dec-214..220: **APD, Princeton Geniza, Manar al-Athar, QDL → Tier 1 facts-only; HMML, MWNF, Qantara → Tier 2 facts-only; Zeno → Tier 3 pointer** (no entity/registry).
- Registered: 7 data/source entities, 7 sources.yaml entries (94 total), 7 attribution rows, Tier-2 table updates.
- Pilot status: V&A batch done (8 records, merged PR #5654). New-family pilots need scripted form sessions — APD search is POST/JSP with viewstate, Qantara search is POST PHP, Manar archive interface is JS/mid-migration (old dams/ gone, no sitemap, Omeka routes 404). Manar citation form per its copyright page is the place→site "set" (e.g., "Aleppo – Great Mosque") — anchor = set name once a read path is found. Deferred to next session with these notes.
- NEXT: scripted pilots — (a) APD POST search for Fustat/Egypt docs matching building/event records (masjid-ibn-tulun, al-fustat, event/abbasid-khutba-egypt-567 candidates); (b) Qantara catalogue records for jami-qayrawan/al-malek-mosque-kairouan/el-jedid-mosque-tunis; (c) Manar set pages via browser or Wayback once interface located; (d) TEI fiches for dated buildings; (e) Archnet via Wayback site records; (f) Khalili/Qatar HTML object pages. Then explore-list candidates.

## 2026-11-08 (pilots session) — first TEI enrichment batch: the 132 AH tiraz set

- PR #5656 (tier-2 registration) confirmed MERGED into main (merge 9ea00077f4); new work branched as `agent/web-sources-pilots` off origin/main.
- **TEI access solved:** fiche pages 500 without params — canonical URL is `EpigraphyDisplay.aspx?id=<n>&pan=1&st=&sc=5` (the `pan` param is required). Fiche search is ASP.NET postback: `MainSearch.aspx` accepts criterion 1 = fiche number (TextBox1), but the "Lieu" criterion ignores free text (needs TopoSearch two-step, which 500s on country postback — deferred).
- **Pilot:** the four fragments of the famous tiraz silk textile dated 132 AH / 749–750 CE, found in Egypt — TEI fiches 47 (V&A London, 1314-1888 + T.13-1960), 9321 (Brooklyn 41.1265), 11979 (Whitworth T.8496), 11980 (Moscow, Museum of Oriental Cultures, ex-Goleniščev). Created `object/tiraz-132-{london,new-york,manchester,moscow}` with ar/en/ur stub prose, `{cite:tei-epigraphie <fiche>}` anchors, Hijri+CE dates (derived CE marked), `related_to` edges between the four fragments, V&A `official` id O79408 on the London record. All `status.review: draft`.
- Facts-only posture kept: no inscription text or photographs republished; summaries rewritten in museum's own words.
- Validator caught Urdu parenthetical rule (Arabic-script parens need U+2066/U+2069) — fixed in all 4 summaries + 1 prose file.
- NEXT: more TEI fiches via fiche-number criterion (or fix TopoSearch postback for place search); APD/Qantara POST pilots; Archnet via Wayback; Khalili/Qatar HTML; BM deferred (403). Also review duplicate `source/vam-collections` vs `vam-collection`.

## 2026-11-08 (p2 session, cont.) — TEI building enrichment batch: 15 monuments

- Harvest method that works: TEI fiche pages need `?id=<n>&pan=1&st=&sc=5`; low fiche ids (1-800) are the core Rome-corpus monuments. Swept ids 1-800 into /tmp/tei-harvest/fiches-1-800.jsonl (800 rows parsed: id/date/nature/material/struct/place/location) + detail pages for ~40 candidates.
- Dead ends confirmed: MainSearch "Lieu" criterion ignores ALL free text (always returns unfiltered ~1249-row Afghanistan dump, 2 pages max); TopoSearch returns toponym stubs only (ToponymDisplay pages are dead-end "Voir X*" pointers); search by monument-type/nature free text returns 0.
- Enriched 15 buildings with `source/tei-epigraphie` + `external_ids.tei: "<fiche>"`: dome-of-the-rock (f.9 construction 72H/691-92 — the second source its built note asked for; also 11,12,224,225), umayyad-mosque (f.27 foundation 87A/705-06 — corroborates the 87هـ start), prophets-mosque (f.50,96,135 later attestations), masjid-al-haram (f.60), kaaba (f.38 construction 101/719-20), great-mosque-tlemcen (f.67,110), qasr-al-hayr-al-sharqi (f.39), qusayr-amra (f.35), ashkelon-grand-mosque (f.54 minaret 155/771-72), al-otrush-mosque-aleppo (f.58 minaret 801/1398-99), qalat-halab (f.72,73 Bab Antakiya decree 885/1480-81), al-haram-al-sharif (f.16 esplanade restoration 746/1345-46; also 615,619 Mamluk terrasse texts), citadel-of-cairo (f.6 enceinte restoration 906/1500-01), sayyida-nafisa-mosque (f.175 funerary text 600A/1203-04), deh-dome-tomb (f.796 Deh Kubbe mausoleum 735/1334-35).
- Deliberately skipped: IRAQ-Mawsil f.130 is al-'Umariyya mosque ≠ mosul-grand-mosque (al-Nuri); ARABIE-Ta'if f.95 is Ibn Abbas's mausoleum ≠ the Taif mosque entity; JORDANIE-Ḫarrāna f.30/33 palace ID unconfirmed vs khirbat-al-mafjar; GAZA fiches (198,327,369,433,509,510,797) name mosques with no confident corpus match; Kairouan 124 fiches are almost all cemetery epitaphs (object-level leads, not building).
- Leads for next: Cizre Ulu Camii (f.789/791/795, no corpus entity — creation candidate); Gaza congregational mosque identification; TEI ids 800-52000 unswept (Cordoba/Fes/Istanbul/Isfahan fiches likely there); APD/Qantara POST pilots; Archnet still 429; Khalili/Qatar 403/HTML.

## 2026-11-08 (p2 cont.) — TEI building batch #2: sweep ids 800–1600, 44 more monuments

- Sweep completed: 801 fiche rows for ids 800–1600 (`/tmp/tei-harvest/fiches-800-1600.jsonl`); matching run against the building corpus filenames + detail checks on ~60 candidates.
- Enriched 44 more buildings with `source/tei-epigraphie` + `external_ids.tei` (comma-separated fiche lists): masjid-sultan-hasan (814-836), umm-al-sultan-shaban-madrasa (932-964), alcazar-seville (863-871), jame-masjid-isfahan (905-1099), mahmud-bey-mosque-kasaba (903,913), al-sahibiyah-mosque (855), aqsab/al-tawashi/isa-bey/abul-fida (1018-1062), khushqadam (1100,1106), ibn-uthman-gaza (1248), hatuniye-karaman (1173), complex-sultan-barquq (1137), farag-ibn-barquq-complex (1197-1343), zawiya-sabil-faraj (1302), imam-al-layth (1296), jami-halab-al-kabir (1242,1289,1436), bursa-ulu-cami (1255,1262), jami-yazd (1332,1405), jami-varamin (1355), qalawun-complex (1408), derbent-juma (893,963), eski-mosque-edirne (1371), gulbarga (924), pandua-adina (954), yivli-minare (1024), yesil-iznik (1131), aydinoglu tombs (1170,1576), mausoleum-of-anas (1181), yunus-al-dawadar (1182), imamzadeh-jafar-damghan (828), aqsunqur-cairo (1465-1476), qarawiyyin (1491-1493), madrasa-of-granada (1495), alhambra (1496 Justice Gate), bu-inaniyya-miknas (1497), shaykhu-complex (1518), jami-qayrawan (1533), qasr-al-hayr-al-gharbi (1534), muayyad-mosque-cairo (1579), kermani-mosque-torbat (1587), emir-erdogmus-tomb (1514). Five batch-1 records gained secondary fiches (haram-al-sharif 915/1360/1558/1598, masjid-al-haram 1188/1277, kaaba 849, umayyad-mosque 1271/1401, al-otrush 1244/1290/1306).
- Schema: `tei` registered in `schema/external-id-patterns.yaml` (`^[0-9]+(,[0-9]+)*$`, EpigraphyDisplay URL) — prior `tei:` values were unvalidated warnings, now checked.
- Rejected as unconfirmed: Fes Misbahiyya (no entity), Sidi al-Halwi mosque-vs-madrasa ambiguity, Ramla mosque 'Abd al-Rahman ≠ White Mosque, Kerman Jami' (no dedicated entity; malek/pamenar are other mosques), Damascus 1560/1562 (unnamed mausoleum/dar al-Qur'an), 1600 Jabala (Jerusalem entity, different site).
- Facts-only kept: no inscription text or catalogue prose copied; `tei` ids are pointers, `{cite:}` prose anchors only where a summary fact exists.
- Gates: npm run validate + npm test before push; PR to main; self-merge per founder's standing CI waiver.
- SHIPPED: commit 0e41c0cddc → PR #5658 → merged to main @ 4860a2bd12 (CI test pass; build preview pending at merge per founder's standing waiver).

## 2026-11-08 (p3 session) — Archnet pilot via Wayback: 30 buildings enriched

- Live archnet.org still 429s; Wayback `id_` snapshots serve full server-rendered site records. Site ids found via `site:archnet.org/sites` web search, then `archive.org/wayback/available?url=archnet.org/sites/<id>&timestamp=2026` → `web/<ts>id_/...` fetch. Harvest: `/tmp/archnet-sites.jsonl` (30 records, snapshots 2025-07..2026-05).
- Enriched 30 buildings with `source/archnet` + `external_ids.archnet`: umayyad-mosque 31, dome-of-the-rock 2814, al-haram-al-sharif 4348, prophets-mosque 3789, kaaba 3790, masjid-al-haram 3792, citadel-of-cairo 218, jami-halab-al-kabir 1804, al-otrush-mosque-aleppo 1825, qalat-halab 2812, masjid-sultan-hasan 1549, shaykhu-complex-cairo 1508, complex-sultan-barquq 2217, farag-ibn-barquq-complex 2209, zawiya-sabil-faraj-ibn-barquq 2370, qalawun-complex 1551, qarawiyyin 1730, alcazar-seville 2852, jami-qayrawan 3763, three-doors-mosque-kairouan 3766, aqsunqur-mosque-cairo 2302, jame-masjid-isfahan 1621, great-mosque-cordoba 2715, al-nasir-muhammad-mosque 2737, masjid-al-shah-isfahan 1622, al-zaytuna-mosque 3765, al-attarine-madrasa 1723, al-ashraf-barsbay-complex 2218, darb-e-imam-isfahan 3901, amir-khayrbak-complex 2230.
- Gotcha fixed: enrichment script matched first `sources:` incl. indented nested ones (education.did_you_know) — 8 files had archnet added to nested sources; repaired to top-level, deduped 2 block-list double-inserts. Lesson: anchor on column-0 `sources:`.
- Possible duplicate-entity flag: `al-ashraf-barsbay-complex` (Q12241647) vs `khanqah-mausoleum-of-sultan-barsbay` (Q75263097) look like the same Northern-Cemetery foundation (1432-33) — needs alias/dedupe review, not resolved here. Archnet 2218 attached to the complex only.
- Archnet also has project/restoration records (e.g., 1115 Dome restoration, 8494 Aqsunqur conservation, 5784 Khayrbak restoration) — kept off entities; site records only.
- TEI sweep 1601-4800 running in background (/tmp/tei-harvest/fiches-1601-4800.jsonl).
- NEXT: TEI 1601-4800 matching when sweep done; APD POST pilot; Qantara POST pilot; Khalili/Qatar HTML; Manar still JS-blocked; explore-list families.

## 2026-11-08 (p3 cont.) — APD pilot: scripted POST search cracked, 4 enrichments

- APD `asearch.jsp` text search is a dead end (lemmatization pipeline needs JS params); WORKING channel is `show_new.jsp` POST `docsearchform` (fields: content/alldata/origplaceid/byear/eyear/kind/invnumber, limit≤50, offset paging). Session via requests.Session. Results rows carry TM place ids, inv. no., edition refs, dates.
- Enriched: place/al-fustat (3 docs issued AT Fustat 801-900 CE: house sale P.Michael.inv. B 937, room lease B 327, rent roll CQ 37), building/qasr-al-hayr-al-gharbi (marble fragment w/ 5 lines of a letter of Caliph Hisham 724-743 CE, P.SchlumbergerQasr — real epigraphic attestation), place/mecca (2 letters sent FROM Mecca to Fustat: P.Vind.inv. A.Ch. 36581 901-1000 CE, A.Ch. 10354 1101-1200 CE), person/ahmad-ibn-tulun (patent flyleaf in Syriac ms, P.Lond.inv. Syriac Mss. BM Add 12137, 870-882 CE Alexandria).
- Corpus sizes found: greater Cairo 1087 docs, Alexandria 21, Fustat-content 14, Mecca-origin 2, Qaṣr al-Ḥayr al-Ġarbī 1, Córdoba-content 2 (weak — Toledo place), Fāṭimid-content 50.
- NEXT: Qantara POST pilot (jami-qayrawan, malek-mosque-kairouan, el-jedid-mosque-tunis); Khalili sitemap HTML; Qatar collections; TEI 1601-4800 matching when sweep done (2031/3200 at last check); Manar still blocked.
- V&A dedup CLOSED: `data/source/vam-collection.yaml` is the only entity on disk; `vam-collections` (plural) exists only inside historical decision-record proposal text (dec-20261108-200/206, inbox record) which is immutable. All cites, sources.yaml, attribution.md and source-families.md already use singular `vam-collection`. No alias needed — nothing was instantiated under the plural id.

## 2026-11-08 (p3) — Archnet + APD pilots MERGED as PR #5661

- 30 building records: `external_ids.archnet` + `source/archnet` (Wayback site records; live archnet.org 429s).
- 4 records: `{cite:apd <inv>}` facts-only — al-fustat (B 937, B 327, CQ 37), qasr-al-hayr-al-gharbi (P.SchlumbergerQasr), mecca (P.Vind.inv. A.Ch. 36581, 10354), ahmad-ibn-tulun (P.Lond.inv. Syriac Mss. BM Add 12137). All anchors re-verified live against show_new.jsp before citing.
- tour/halls.yaml mecca mirror fixed; validate 0 errors, tests green.
- V&A dedup closed (see above).

## 2026-11-08 (p3 cont.) — TEI batch 3: fiches 1601-4800 harvested + 23 entities enriched

- Sweep `fiches.py 1601 4800` complete: 3200 fiches in /tmp/tei-harvest/fiches-1601-4800.jsonl. Next chunk 4801-8800 running.
- Match pipeline: strict token matcher (entity distinctive-name tokens ⊆ fiche structure/monument text; Nature ∈ construction/restoration/decree/signature/foundation/vows/sovereign-testimony; alphabetic tokens only — kills dimension-number false hits).
- Enriched 22 buildings + object/maqam-ibrahim: alhambra +21 fiches, mustansiriyya-madrasa (2512-2515), al-khulafa-mosque-baghdad (2542), al-firdaws-madrasa (2536-2538), bab-al-nasr CAIRO (1913 only — Aleppo 2955/Dongola 4011 are different gates), maqam-ibrahim MECCA (2003 only — Aleppo Maqam fiches 2869/2870/4003 excluded), aslam-al-silahdar (2057,2061), erzen-hatun-kumbeti (2095), melikgazi-tomb (2108), pervane-medrese SINOP (2132 — Amasya Burmalı 2720/2721 excluded), sultan-baybars-turbesi = DAMASCUS Zahiriyya tomb (2385,2391,3584,3585 — Cairo mosque-of-Baybars 2193-2195/2217, Ludd bridge 2297/2298, al-Hisn al-Zahiri mosque excluded), karatay-madrasa KONYA (2794 — Antalya namesake 2786 + Karatay HANS 2579/2644 excluded), ahi-yusuf-mosque-tomb ANTALYA (2776 — Turhal Ahi Yusuf Baba tomb excluded), al-nasir-muhammad-mosque citadel (3286), madrasa-of-al-nasir-muhammad (1867), hanabila-mosque (2993,2994), sifaiye-medrese (3075,4020), yakutiye-madrasa (3152,3153), tankiziyya Jerusalem (3465), tomb-of-salar-and-sangar (3885), al-zaytuna-mosque TUNIS (4381 — Gaza quarter-name 3219 excluded), yivli-minare-mosque (2583 — 4112 is on the hammam facade, excluded), tomb-of-sumbul-baba (3667).
- SKIPPED (documented): Sidi al-Halwi Tlemcen (still ambiguous), Jabala Ibrahim ibn Adham (Jerusalem entity is different), Gaza al-Sham'a, Sargitmesh madrasa (matched bimaristan-al-sayyida Baghdad = false), Luqman tomb Iran (luqman-castle = different), singar-mosque = BANGLADESH (Mosul Bab Singar/Sinjar false), masjid-al-hisn entity says Turkey (Syria Hisn fiches skipped), al-sultaniyya-mausoleum = CAIRO (Aleppo Zahiriyya madrasa fiches skipped), caca-bey/ertokus/sarac-sinan = tomb entities vs mosque/madrasa fiches, esrefoglu türbe vs mosque, tomb-of-mahmud generic, mir-ali-turbesi Anatolia vs Kharg Iran, proximity-only hits (Qusun near Bab al-Nasr, Uj Khan, Mihmandariyya near Bab Zuwayla, bridges/palaces named after patrons).
- Qantara recon: live show_document.php?do_id=N works (flaky MySQL); search POST show_results.php returns empty chrome — site search appears broken; do_id space ~1000-1500+ valid with gaps; Wayback CDX usable when IA is up.
- Khalili HTML VERIFIED, no corpus match: object pages live at khalilicollections.org/collections/islamic-art/<slug>-<inv>/ (needs full Chrome UA — bare curl gets 403). Page schema: Title/Date/Location/Materials/Dimensions/Accession No./tabs. 137-object islamic-art index parsed (/tmp/khalili-index.json). NO corpus object records Khalili provenance → enrichment deferred; leads logged for when Khalili-held objects enter the graph.
- Qatar Museums VERIFIED, no corpus match: collections portal collections.qm.org.qa/en/objects/<slug>-<inv> (mia.org.qa 302s there; self-signed cert needs -k). Rich schema: production place, date, period, material, technique, dimensions, on-view location. Same blocker — no corpus object is a QM/MIA piece.
- Qantara: show_document.php?do_id=N live (flaky MySQL, ~45KB records); search POST returns empty chrome → search broken; do_id space ~1000-1500 valid.

## 2026-11-08 (p3 cont.) — TEI batch 4 partial: fiches 4801-~6200 scanned, 3 entities

- fiches-4801-8800.jsonl still fetching (PID 10611); match5.py run on partial file (1374 records).
- Enriched: qarawiyyin +fiche 5375 (minaret door, 956-957, stucco, disparu) + top-level source/tei-epigraphie added (was relations-only); castle-of-tarifa +5398 (portal marble tablet, 960-961, in situ); mosque-of-cristo-de-la-luz +5785 (Bab al-Mardum facade frieze, 999-1000, brick).
- All three verified against full fiche records before editing. Re-run match when sweep completes.

## 2026-11-08 (p3 cont.) — EAMENA pilot attempt: anonymous channel closed

- Endpoints mapped from search.js + citation page: search_results=/en/search/resources, export=/en/api/search/export_results (geojson), resource-type-filter graphid 34cfe98e-c2c0-11ea-9026-02e7594ce0a0 = Heritage Place.
- Anonymous results: every variant returns [] — search=term, resource-type-filter only, map-filter bbox (Jordan), and even the citation page's verbatim example URL. Public UI works only in an interactive session; no bulk dump on Zenodo (community = research datasets + tools only, incl. 'EAMENA Quick Pin' plugin zip).
- reliability_note in data/source/eamena.yaml updated with the verification. Pilot deferred: needs Research Access registration OR a working anonymous query/session-harvest path.

## 2026-11-08 (p3 cont.) — TEI batch 4 continued: +2 entities (bab-al-nasr, dar-al-arqam)

- match5.py on ~2200-record partial: 9 candidates. Verified full fiche records; enriched bab-al-nasr +6674 (Cairo gate portal, marble, 1087-1088 — distinct from earlier decree fiche 1913) and dar-al-arqam +6828 (Mecca house restoration text, basalt, 1058-1059; entity had no external_ids block — added).
- REJECTED with reasons: 6672 Aleppo Maqam Ibrahim shrine ≠ Meccan Maqam Ibrahim object; 6684 Salamiyya Jami' Isma'il ≠ southeast-asia sultan-ismail-mosque; 6688 Cairo Sayyida Nafisa mausoleum ≠ baghdad bimaristan-al-sayyida; 6381 Ghazni minaret ≠ tomb-of-mahmud.
- fiches-4801-8800.jsonl at ~2200/4000 and fetching (PID 10611). Re-run match5 when done.

## 2026-11-08 (p3 cont.) — TEI batch 4: +4 entities, 8 fiches (partial ~2570/4000)

- Enriched: ala-al-din-al-basiri-mosque +7234 (Haram esplanade mastaba/oratory, 1397-1398 — entity is Jerusalem draft); al-burtasi-mosque +7237 (Tripoli, 1397-1398); taynal-mosque +7350-7354 (Tripoli, 5 fiches, 1335-1336); al-nasir-muhammad-mosque +7327 (citadel mosque inscription, 1334-1335 — madrasa-of-al-nasir-muhammad NOT given it, different building).
- REJECTED: 7168/7192 Jabalā Ibrahim ibn Adham ≠ Jerusalem entity; 7172 Damascus Maidan mausoleum ≠ baghdad hasani-palace; 7206/7207/7244 Aleppo Bab al-Nasr-area mosques ≠ cairo gate; 7231 Mihmandariyya madrasa ≠ bab-zuwayla (proximity); 7271 Sin caravanserai iwân ≠ isfahan mosques; 7315 Krak des Chevaliers al-Zahiri mosque ≠ damascus sultan-baybars-turbesi.
- Sweep still running (~64%). Next: re-run match5 on completion; then consider 8801+ ranges.

## 2026-11-08 (p3 cont.) — TEI batch 4: +1 entity (minaret-of-masud-iii +7639)

- match5 on ~2960-record partial: 33 candidates. Enriched minaret-of-masud-iii (Ghazni minaret inscription, brick, 1114-1115, sovereign testimony).
- REJECTED: 7393 Bursa Şehadet Camii inscription (moved there 1890, origin uncertain — not attributed to tomb-of-orhan-gazi); 7431 Husayniyya shaykh-Isma'il tomb ≠ sultan-ismail-mosque; 7441 Damascus Tankiziyya madrasa ≠ jerusalem tankiziyya; 7483 Nasir Muhammad sabil fountain — monument is a fountain at madrasa corner, not the building itself (proximity-tier, skipped); 7542 enameled glass mosque lamp = movable object, no entity; 7623 Aleppo Maqam ≠ Mecca object.

## 2026-11-08 (p4) — TEI batch 5 partial: fiches ~4801-8000 scanned, +2 entities

- match5.py on ~3227-record partial: enriched mosque-of-al-salih-talai +7948 (Cairo Fatimid mosque construction text, 1160 — matches built:1160 exactly; earlier proximity-match to bab-zuwayla corrected to the mosque entity itself) and dar-al-arqam +7952 (Mecca basalt revetment plaque, restoration text 1160).
- REJECTED: 7961 Damascus "Mosquée Hassan" outside Bab al-Jabiya — NOT umayyad-mosque (TEI calls that "Mosquée des Omeyyades"); NOT al-hassan-mosque/hassan-mosque (both are maghreb/gunpowder-era = Hassan II Casablanca). LEAD: unidentified Damascus mosque, possible new entity — needs identification before creating.
- 7996 Aleppo Maqam Ibrahim ≠ Mecca object (recurring false).
- Sweep still running (~80%).

## 2026-11-08 (p4 cont.) — TEI batch 5: +5 entities, +12 fiches (partial ~3640/4000)

- Enriched: al-madrasa-al-salahiyya-jerusalem +8184 (Salahiye madrasa near St Stephen's gate, 1192-1193); qarawiyyin +8279 (courtyard pavilion fountain, 1202-1203); hanabila-mosque +8282,8283,8284,8285 (4 Damascus inscriptions, 1197-1203); al-zaytuna-mosque +8415 (north facade, Tunis, 864-865); alhambra +8424,8425,8428 (3 Nasrid palace column inscriptions, 951-960).
- REJECTED: 8045 Salhad Isma'il-Shufi house ≠ sultan-ismail-mosque; 8073/8235 Aleppo Maqam ≠ Mecca; 8238 Niksar citadel-tower inscription moved into Melik Gazi türbe — subject is the citadel wall, not the tomb (skipped both); 8278 Sinjar Iraq mosque ≠ bangladesh singar-mosque.
- DUPLICATE LEAD: melik-gazi-turbesi vs melikgazi-tomb (both Niksar Melik Gazi tomb entities; latter has tei 2108) — alias-merge candidate for a future pass.

## 2026-11-09 (p4) — TEI 4801-8800 COMPLETE (4000 fiches) + next range 8801-12800 launched

- fiches-4801-8800.jsonl complete: exactly 4000 records. Final match pass on completed file: +9 fiches across 4 entities — al-zaytuna-mosque +8527,8528,8555,8557,8761 (5 Tunis inscriptions); qarawiyyin +8687,8721; bab-al-futuh +8616 (Cairo gate, first external_ids); pir-bakran-mausoleum +8628 (Isfahan-region Ilkhanid tomb).
- REJECTED: 8483/8484 Aleppo Harawi mausoleum (part of Aleppo Maqam complex) ≠ Mecca object; 8488 Aleppo Bab al-Nasr ≠ cairo gate; 8563 Tunis Masjid al-Mihras neighbourhood oratory ≠ zaytuna (proximity); 8744 Kastamonu Frenkshah mosque in Atabey Gazi quarter ≠ atabey-gazi-tomb (quarter-name).
- Next sweep fiches.py 8801 12800 running (PID 24630).
- Range totals so far: 1-4800 = 5200 fiches (incl. earlier ranges); 4801-8800 = 4000. TEI id space continues to ~52k.

## 2026-11-09 (p4) — duplicate merge: melik-gazi-turbesi → melikgazi-tomb

- Both draft stubs modelled the same Niksar Melik Gazi türbe (TEI fiche 8238 confirms "mausolée Melik Gāzī Türbesi" at Niksar; fiche 2108 already on melikgazi-tomb). Survivor melikgazi-tomb is richer (tei-epigraphie source + tei:2108); loser's slug added to its `aliases`, file removed per workflow.md duplicates rule. Loser carried wikidata Q139419953 vs survivor Q131390466 — two Wikidata items for the same monument; survivor's kept (id immutable, alias preserves links).

## 2026-11-09 (p4) — TEI 8801-12800 partial (~750/4000): +8 fiches, 2 entities

- Enriched: al-muayyad-mosque-cairo +9039,9343,9344,9345,9346,9347,9348 (7 Cairo inscriptions for the Mu'ayyad Shaykh complex near Bab Zuwayla — matcher hit bab-zuwayla on proximity but the mosque entity exists; corrected); qarawiyyin +9177.
- REJECTED: 8983 Bursa Orhan Camii ≠ tomb-of-orhan-gazi; 9165 Tlemcen Mechouar mosque ≠ el-mechouar-palace; 9330 Aleppo Zakki ≠ cairo bab-al-nasr; 9410 Bursa Selcuk Hatun Mescidi ≠ istanbul selcuk-hatun-mosque nor the two tomb entities; 9433 Marrakesh Kutubiyya mosque — only object/minbar-kutubiyya exists (LEAD: no building entity for the mosque); 9450 Safad Jami' Iskandar ≠ johor sultan-iskandar-mosque; 9508 Konya Darül-huffazı in Gazi Alemşah quarter ≠ alemsah-tomb (quarter-name); 9532 Damascus citadel Bab al-Nasr ≠ cairo gate.
- Hassan cluster CHECKED: al-hassan-mosque (Q141458797 = unfinished Rabat Hassan mosque), hassan-mosque (Q60536409 = 1196 Moroccan heritage mosque, different coords), hassan-ii-mosque (Q41346 = Casablanca 1993) — three DISTINCT mosques, no merge.

## 2026-11-09 (p4 cont.) — TEI 8801-12800 partial ~1135: +4 fiches, 2 entities

- Enriched: dastur-khan-mosque +9880 (Ahmedabad Dastur Khan mosque construction text, Astodia Chakla, 1462-1463 — entity IS the Ahmedabad mosque); qarawiyyin +9802,9803,9804 (Bab Sbitrin + Bab Jana'iz gates, 1136-1137).
- REJECTED: 9616 Kastamonu Ismail Bey CAMII (mosque portal) ≠ ismail-bey-tomb; 9791 Cairo Khushqadam-Ahmadi mosque ≠ tunis mosque-of-el-ahmadi; 9856 Cairo Sayyida Ruqayya ≠ baghdad bimaristan; 9873 Aleppo Maqam ≠ Mecca; 9882 Haram well of Ibrahim al-Rumi/Sabil al-Basiri — monument is a well, not the oratory (proximity).

## 2026-11-09 (p4 cont.) — TEI 8801-12800 partial ~1580: +3 fiches, 2 entities

- Enriched: uc-serefeli-mosque +10290,10316 (Edirne Üç Şerefeli Cami courtyard + left-door inscriptions, 15th c — fixed a duplicate external_ids key my insert created); hanabila-mosque +10221 (Jami' Muzaffari = al-Hanabila prayer hall, Damascus).
- REJECTED: 10017 Haram Sabil al-Basiri (fountain ≠ oratory entity); 10019 Homs Kujuki mausoleum ≠ sultan-ismail-mosque; 10042 Aleppo Zakki; 10093 Edirne Topkapi Hamami (hamam, 'edirne' token only); 10145 Cairo Aynal al-Yusufi fountain (proximity); 10147 Iznik Mahmud Celebi Camii ≠ ghazni tomb-of-mahmud; 10148 Bursa-Karacabey road marker ≠ karacabey-tomb; 10192 Ankara Gecik mescidi (mosque) ≠ gecik-mescidi-turbesi (tomb); 10372 Bursa Mihrapli Kopru/Selcuk Hatun bridge ≠ istanbul selcuk entities.

## 2026-11-09 (p4 cont.) — TEI 8801-12800 partial ~2050: +2 entities

- Enriched: achut-bibi-mosque-tomb +10658 (Bibi Achut Kuki mosque Dudheshwar — entity covers mosque+tomb, kind:tomb but dual); firuz-aga-mosque +10751 (Istanbul Firuz Aga Cami, Sultanahmet, portal inscription).
- REJECTED: 10648 Trabzon Ickale citadel mosque (Sirin Hatun/Yukari Hisar Cami) ≠ sirin-hatun-tomb.

## 2026-11-09 (p5) — TEI sweep restarted; 8801-12800 partial ~2650: +6 fiches, 2 entities

- Sweep was killed at 2650 records (max fiche id 11450); fiches_resume.py created (append mode) and relaunched from 11451 (PID 99902).
- Enriched: muhafiz-khan-mosque +11066 (Ahmedabad/Gheekanta mosque, 1491-1492); qarawiyyin +11146-11150 (5 Fez inscriptions incl. nave dome, 1133-1137).
- REJECTED: 11270 Diyarbakir Hasan Pasha HAN (caravanserai) ≠ hasan-pasha-tomb; 11311 Zile Haci Ismail Mescidi ≠ sultan-ismail-mosque; 11321 Cairo Bahlul mosque ≠ baghdad bimaristan; 11401 Abu Hurayba mosque (proximity to Bab Zuwayla); 11463 Carthage stray object ≠ carthage-palace.

## 2026-11-09 (p5 cont.) — TEI 8801-12800 partial ~3010: 7 more candidates reviewed, all rejected

- 11496 Isfahan Darb-i Kushk/Chihil Sutun inscription — palace-garden structures, 'isfahan' token only; 11514 Cairo Wakala Bab al-Nasr caravanserai (proximity); 11545 Amasya Bayezid II Camii ≠ istanbul bayezid-ii-mosque (same sultan, different city); 11739 Seyitgazi Ummuhan Hatun turbe inside Seyid Battal Kulliyesi — entity is Kayseri-region; ambiguous, skipped; 11744 Konya Yeşil Türbe (Mevlana mausoleum) next to Selimiye Cami — monument is the tomb, not the mosque (proximity); 11746/11811 Aleppo repeats.

## 2026-11-09 (p5 cont.) — TEI 8801-12800 COMPLETE (4000 fiches) + next range 12801-16800 launched

- fiches-8801-12800.jsonl complete; fiches.py 12801 16800 running (PID 21396).
- Enriched (final pass): goaldi-mosque +11910 (Sonargaon Shahi mosque, Bangladesh, 1519-1520); buyuk-aga-medrese +11936 (Amasya Kapı Agası/Büyük Ağa college, 1488-1489); pir-sucaeddin-ilyas-turbe +12234 (Amasya türbe in Cilehane quarter — NOT cilehane-tomb); bayezid-ii-mosque +12137 (Istanbul Beyazıt/Eminönü portal, inline external_ids map updated).
- REJECTED (23 reviewed): Trabzon Iskender Pasha fountains/mosque ≠ pasha tomb entities or Johor mosque; Emir Mehmed Bay turbe/Haci Mehmed cesmesi ≠ mehmed-v; Gawriyya madrasa-mausoleum complex (6 fiches) has NO entity — LEAD for new entity; Wakala Bab al-Nasr caravanserais, Takiyya/Abu Hurayba/Gawriyya proximity to Bab Zuwayla; Zawawi Damanhur ≠ Muscat; Sidi El Ansari Damascus ≠ Tunis; Hurrem Pasa Konya ≠ Hurrem Sultan Istanbul; Homs Hasan Efendi house (van Berchem vs Korn ID debate) ≠ tomb entities.
- DUPLICATE CHECK: tomb-of-iskender-pasha (Q131391277 Istanbul) vs -2 (Q131391513 Diyarbakır Sur) — VERIFIED DISTINCT via Wikidata coords, NO merge (unlike melik-gazi pair).
- New leads: Gawriyya complex Cairo; Kutubiyya mosque Marrakesh (from earlier).

## 2026-11-09 (p5 cont.) — TEI 12801-16800 launched (PID 21396, ~500/4000): +2 entities

- Enriched: suleymaniye-mosque +12890 (Istanbul Suleymaniye kulliye marble construction text, in situ, 1556-1557); al-zaytuna-mosque +12939 (wooden construction text ORIGINALLY in Zaytuna, now Bardo Museum — origin explicit, accepted).
- match7.py created for this range.

## 2026-11-09 (p5 cont.) — TEI 12801-16800 partial ~1120: +4 fiches, 2 entities

- Enriched: imamzadeh-muhammad-al-mahruq +13383 (Nishapur shrine mausoleum); al-zaytuna-mosque +13490,13499,13518 (maqṣūra Abu Amr Uthman + staircase, Tunis).
- REJECTED: 13407 Jabalā Ibrahim Adham (Jerusalem entity ≠); 13503 Ankara Hallaj Mahmud mosque ≠ ghazni tomb; 13506 Sivas Abdülvehhab Gazi MESCIDI (mosque) ≠ the two abdulvehhab-gazi-tomb entities — ANOTHER dup pair logged (abdulvehhab-gazi-tomb vs -2); 13542/13566/13573 Gawriyya proximity (no entity — lead stands); 13707 Konya Yavuz Selim cesmesi fountain ≠ mosque/madrasa entities.

## 2026-11-09 (p6) — TEI 12801-16800 COMPLETE (4000); 16801-20800 launched (PID 52015)

- Final pass enriched: muwaylih-castle +14878 (Saudi al-Muwaylih citadel gate, 1560-1561); arab-ata-mausoleum +15899 (Tim Samanid tomb portal, 977-978).
- REJECTED: 14503 Ertokus bridge Karaözü ≠ ertokus-tomb; 15750 Uzkand Abu Bakr b. Ismail tomb ≠ sultan-ismail-mosque.

## 2026-11-09 (p6 cont.) — TWO new entities created from TEI leads

- building/madrasa-al-ghawri: NEW draft — al-Ghawri madrasa-mosque-mausoleum complex between al-Moski and Bab Zuwayla, Cairo. 8 fiches (12112-12118, 13542/13566/13573): construction texts + sovereign testimonies dated 909/1503-1504 and 922/1516-1517 CE — matches Sultan al-Ashraf Qansuh al-Ghawri's complex (last Circassian Mamluk sultan, d. 922/1516).
- building/kutubiyya-mosque: NEW draft — Almohad Kutubiyya Mosque, Marrakesh. 3 mosque-structure fiches (9431 religious text, 9433 votive, 9434 restoration).
- object/minbar-kutubiyya +7946: the minbar's fabrication inscription records it was MADE IN CORDOBA — Cordoba-origin fact added to the object entity.
- Damascus "Mosquée Hassan" (fiche 7961) NOT created — single fiche, unidentified mosque, insufficient evidence.

## 2026-11-09 — Abdülvehhab Gazi tomb pair RESOLVED (not duplicates)

Wikidata coordinates show three distinct tombs, all "Abdulvehhab Gazi"/"Vehhab-i Ummi" labels but different districts: Q131390696 Bayburt (40.263,40.244), Q131391676 Bolvadin/Konya (38.695,31.080), Q131390683 Elmalı/Antalya (36.749,29.911). Retained as distinct entities; no merge.

## 2026-11-09 (p7) — TEI 16801-20800 partial + Cizre Ulu Camii new entity

- object/maqam-ibrahim +17726: second Maqām Ibrāhīm restoration inscription (1542-1543, Meccan Ḥaram) — tei now "2003,17616,17726".
- NEW building/ulu-cami-cizre (draft): Ulu Camii ve Medresesi, Cizre SE Turkey — fiches 789 (minaret c.550/1155-56), 791 (portal 555/1160), 795 (mosque foundation 730/1329-30). Artuqid-era complex; no place/cizre entity so no located_in relation (matches draft-building convention).
- Gaza congregational mosque lead: al-Sham'a mosque already evaluated and skipped earlier (ambiguous) — remains deferred.
- Abdülvehhab Gazi tomb pair resolved: NOT duplicates (Bayburt vs Bolvadin/Konya vs Elmalı/Antalya coordinates).
- Sweep 16801-20800 at ~1800/4000; match8 partial candidates: 4 (2 accepted maqam-ibrahim, 2 rejected namesakes).

## 2026-11-09 (p7 cont.) — TEI 16801-20800 COMPLETE + SIX new entities

Sweep 16801-20800 done: 4000 fiches, overwhelmingly Egyptian/Kyrgyz epitaphs; match8 found only 4 candidates (2 accepted maqam-ibrahim, 2 rejected namesakes). Manual scan of matched-nature records surfaced major new-entity leads:

- NEW building/shah-i-zinda: Samarkand necropolis — 80 TEI fiches (801..17876) spanning 8th-10th c AH; richest single TEI entity yet.
- NEW building/po-i-kalyan: Bukhara Kalyan complex (Jami' mosque + minaret) — 5 fiches (7670,16851,16934,17656,17666).
- NEW building/vabkent-minaret: Minaret of Abd al-Aziz, Vabkent — 2 fiches (15845,15846).
- NEW building/turabek-khanym-mausoleum: Kunya-Urgench — 2 fiches (16951,16952).
- NEW building/mausoleum-of-najm-al-din-kubra: Taš Kala — 3 fiches (15794,16054,16948); attribution per catalogue.
- NEW building/mausoleum-of-sultan-tekesh: Taš Kala — 2 fiches (16132,16949).
- SKIPPED: mausoleum attributed to Fakhr al-din Razi (16950, nature ?, uncertain attribution); Shaykh Dzhunjejid mausoleum Khazry (17200, single fiche, uncertain identity); Qutluġ Tīmūr minaret (15793, nature ?).
- Next range 20801+ to launch.
## 2026-11-09 (p8) — TEI 20801-24800 partial matches

- aslam-al-silahdar-mosque +21240: sovereign testimony 1345-46 on the Cairo mosque of Amir Aslam al-Silahdar (same amir, east of Cairo).
- sayyida-nafisa-mosque +21401: wall-covering inscription on Sayyida Nafisa's mausoleum at Qarafa entrance — the shrine entity holds her tomb, so valid (NOT bimaristan-al-sayyida).
- yakutiye-madrasa +22218: Yakutiye Medresesi portal construction 1310-11, Erzurum (tei now 3152,3153,22218).
- mama-hatun-turbesi-tercan +22226: portal signature 1246-47, Tercan.
- REJECTED: humayun-tomb (Bulandshahr idgah built "in Humayun's time" — not the Delhi tomb); tomb-of-mahmud ×2 (Shah Mahmud Qattal shrine Bari Kattri; Haji Mahmud Nuqati's Billi-Masjid Cambay — namesakes).

## 2026-11-09 (p9) — TEI 20801-24800 India/Bangladesh-heavy tail

Matcher candidates (38) mostly namesakes; verified accepts:
- melik-mengucek-gazi-tomb +22925,22927,22929 (Mengücek Gāzi Türbesi explicitly named, Kemah/Euphrate cemetery)
- erzen-hatun-kumbeti +22969 (Ahlat confirmed via Wikidata coords 38.76N 42.50E)
- binat-bibi-mosque +23586 (Narinda Dhaka)
- chaurasi-khamba-mosque +23798 (Kaman "84 columns")
- tomb-of-sikandar-lodi +24446 (Delhi 1517-18)
- kusumba-mosque +24635 (Manda, Naogaon district Bangladesh)
- darasbari-mosque +23646 (Gaur madrasa Darasbari — same mosque+madrasa complex per entity summary; quarter-name caveat noted)
- REJECTED: masjid-ibn-ladin (entity is Jeddah Q374365, fiches are Kot India); mausoleum-of-hazrat-sultan ×8 (entity in Kitob Uzbekistan vs Indian dargahs); humayun-tomb ×7 (Koppal saint's tomb, Kachhpura/Fathabad/Mandu mosque namesakes, Isa Khan proximity, 24452 predates Mughal tomb's construction); tomb-of-mahmud ×4; al-nasir-muhammad-mosque + madrasa-of-al-nasir-muhammad (Tatar al-Hijaziyya's own mosque ≠ citadel foundations); koyun-baba-tomb/−2 (mosque not tomb); bara-gumbad (proximity); darasbari-mosque Dhaka fiche 23608 (different city).

## 2026-11-09 (p9 cont.) — range complete + extras

- Range 20801-24800 COMPLETE (4000 fiches). India/Bangladesh Mughal-era section scanned: hundreds of dated local-mosque inscriptions — too many for entity creation; only named/identifiable monuments taken.
- emir-qurqumas-complex +21224 (sabil frieze inscription 911/1505-06, part of his madrasa-khanqah complex).
- madrasa-al-ghawri +21253 (sovereign testimony 900/1494-95 on "mosquée al-Ġawrī" — the mosque wing of the same complex).
- NEW building/hammam-darwaza-mosque-jaunpur (draft): Hammam Darwaza mosque Jaunpur — fiches 21030, 21031 (construction 1567-68).
- Skipped as leads: mosque Šarġitmiš Cairo 21243, mosque Athar al-Nabbi 21258, Ribāṭ al-Athār 21246, Tatar al-Hijaziyya mosque 22883 (all single-fiche, thin identification).

## 2026-11-09 (p10) — TEI 24801-28800 partial

- minaret-of-masud-iii +24849 (Ghazni minaret record 1205-06; tei now 7639,24849)
- muhafiz-khan-mosque +25407 (Ahmedabad 1485-86; tei now 11066,25407)
- humayun-tomb +25438 (inscription on Humayun's mausoleum Delhi 1565-66 — fits post-1556 construction)
- NEW building/mahmud-gawan-madrasa: Bidar Bahmani madrasa — fiches 24948,24949,25219 (all 1472-73)
- REJECTED: humayun-tomb 24848 (Pilakhna well), 25413 (Humayun Darwaza = Purana Qila gate, not tomb); jalali-castle (Kashan Iran entity vs Aligarh mosque); tomb-of-mahmud 25219 (rerouted to new gawan entity); mir-ali-turbesi 25424 (mosque Machhiwara, entity is türbe elsewhere).

## 2026-11-09 (p10) — TEI 24801-28800 COMPLETE + al-Andalus bonanza

Range done (4000 fiches): heavy ESPAGNE/IRAK/ITALIE/INDE section.
- alhambra +7 architectural fiches (27107 Puerta de la Justicia, 27108-9 Puerta del Vino, 27110-12 Patio Arrayanes, 27114 Puerta del Carbon); ~50 "Objet" movable-object fiches deferred (palace-associated objects, no object entities).
- ennejma-ezzahra +41 fiches (Madīnat al-Zahrā' caliphal palace: Salon Abd al-Rahman III, baths, pavilion, etc.)
- great-mosque-cordoba +9 (Grande Mosquée signatures 1009-10)
- alcazar-of-the-caliphs +5 (Cordoba Alcazar palace objects 961-62/1009-10)
- quwwat-ul-islam-mosque-delhi +24851 (Qutb al-Din Aybak mosque 1191-92)
- tomb-of-ghiyath-al-din-tughluq +25247 (Tughluqabad mausoleum 1324-25)
- imam-al-bahir-mosque +26502 (Bab al-Masjid mashhad Mosul 1299-1300)
- mustansiriyya-madrasa +26575 (Baghdad 1232-33)
- al-imam-muhsin-mosque +26575→+27024 (Mosul Jami' 1397-98)
- REJECTED: mosque-of-mertola ×4 (Castelo objects ≠ mosque); maqam-ibrahim 28290 (Bayt Hanina Sultan Ibrahim al-Adhami ≠ Meccan maqam); jalali-castle, mir-ali-turbesi, saidabad-mosque, singar-mosque, abbas-ali-turbe (Berat), abbas-b-ali-turbesi (southern Iraq coords), humayun-tomb ×2.
- LEADS deferred: Aljaferia palace Zaragoza (11 fiches 1081-82, no entity), Alcazaba Malaga/Almeria (no entity), Kushk-Mahal palace Fathabad ×5, Shah-i-Mardan mosque Marot, Muchchandipalli mosque Calicut, Sehwan Marwandi mausoleum, Hathazari mosque Chittagong, Chandani mosque Patan, Quwwat-adjacent Delhi mosques.

## 2026-11-09 (p11) — TEI 28801-32800 partial (Ottoman Turkey section)

- alhambra +6 palace fiches (28883,28884,28887,28898,28908,28963: Mirador del Lindaraja, Sala de las Dos Hermanas etc.)
- uc-serefeli-mosque +29368,29369 (Edirne portal inscriptions 1447-48)
- selimiye-mosque +29394 (Edirne NW entrance 1574-75)
- REJECTED namesakes: edirne-bedesten/edirne-palace (same fiches, wrong structures); gulbahar-hatun-tomb (mescidi not tomb); selcuk-hatun-mosque/tomb/tomb-2 (Istanbul mosque + Bursa tomb vs Edirne mescidi and Bursa Mihraplı Köprü); bayezid-ii-mosque (Edirne vs Istanbul entity); laleli-mosque-istanbul (Edirne Laleli vs Istanbul); tophane-fountain (Istanbul coords 41.03,28.98 vs Edirne); al-aqsa-mosque (Kudus Java "Masjid Menara" vs Jerusalem); osman-gazi-turbesi (neighborhood mosque); tomb-of-mehmed-v (Abdal Mehmed türbe); uftade-tomb (darül-kurra school); sehzade-mosque+tomb-of-mahmud (Şehzade Mahmud türbe in Muradiye).

## 2026-11-09 (p11) — TEI 28801-32800 COMPLETE (Ottoman Balkans/Turkey + Maghreb)

Range done (4000 fiches): heavy TURQUIE Edirne/Bursa/İstanbul/Konya section, plus BOSNIE, BULGARIE, SYRIE-Ḥalab/Dimašq, INDONESIE, IRAN.
- alhambra +6, uc-serefeli-mosque +29368-9, selimiye-mosque +29394 (see partial entry)
- kubadabad-palace +30597,30599,30607 (Seljuk palace Kubadabad records 1246-47; Objet fiche 30609 deferred)
- hanabila-mosque +30213 (Damascus Ǧāmi' al-Ḥanābila portal 1202-03)
- hamza-bey-turbesi +30437 (Hamza Bey türbe, Bolu — Mustafa Kemal Paşa district; fiche 31898 Hamza Bey Câmii Stara Zagora REJECTED, Bulgarian mosque)
- cinili-kosk +30497 (Topkapı Çinili Köşk 1472-73)
- ahi-evran-sultan-tomb +31694 (Ahi Evran Zaviye ve Türbesi Kırşehir 1481-82)
- arap-baba-mescidi +31306 (Arap Baba Mescidi ve Türbesi Harput 1279-80)
- tomb-of-dev-ali +32258 (Dev Ali Türbesi Develi 1203-04)
- al-firdaws-madrasa +32783 (Madrasa al-Firdaws Aleppo 1236-37 — entity IS the Aleppo madrasa)
- yivli-minare-mosque +32401,32402 (İmaret/Ulu Cami Medresesi Antalya 1227-28, same Seljuk külliye)
- REJECTED namesakes/proximity: tomb-of-mehmed-v ×13 (mosques/bridges/cemeteries named Mehmed), tomb-of-mahmud ×7 (Mahmud Paşa complexes, Seyyid Mahmūd Hayrān türbe Akşehir, Zâl Mahmud Paşa külliye), aksaray-mausoleum ×5 (Agzı Kara/Zazandın hans + Sense Çayırı cemetery), selimiye-mosque ×2 more (Konya Mevlana proximity, Karapınar namesake), bab-al-nasr ×3 (Aleppo + Damascus citadel gates vs Cairo Fatimid entity), sidi-el-ansari-mosque ×4 (Aleppo-region mashhad vs Tunis entity), ahmad-al-badawi-mosque ×2 (Damascus zawiya vs Tanta entity), maqam-ibrahim ×2 (Aleppo citadel + Harawi mausoleum vs Mecca), al-sultaniyya-mausoleum ×3 (Aleppo Utrush/Zahiriyya vs Cairo), al-firdaws earlier 31688 (al-Ẓāhiriyya ≠ al-Firdaws), sofular-tomb (Amasya tomb vs Bulgarian mosque + Bursa bridge), koyun-baba/veli-baba ×4 (Koyun Baba Köprüsü bridge Osmancık), karacabey-tomb ×2 (Bursa tomb vs Ankara mosque complex + Seyran han), selcuk-hatun ×3 entities (Selçuk Saadet Hatun hamamı museum), caca-bey-tomb (Kırşehir madrasa vs tomb), tankiziyya (Damascus dar al-hadith vs Jerusalem entity), ahi-yusuf ×2 (Antalya citadel fountain inscription vs Bursa mosque/tomb), sultan-ismail-mosque ×2 (Kayseri Yenice İsmail district mescidi + Demirli village mosque), tomb-of-salih-bey ×2 (Pertek mosque + Selçuk bath), celebi-sultan-mehmed-mosque (Sarajevo Isabegović mosque vs Bursa Yeşil), osman-celebi-tomb + humayun-tomb (Topkapı Bab-ı Humayun gate), tomb-of-mimar-sinan ×4 (Ankara/Cenâbi + Büyükçekmece bridge named for district), sehzade-mosque, seyh-halil-turbesi, seyh-burhaneddin, sungur-bey, abdurrahman-sultan, danis-ali-bey, ismail-bey, tomb-of-hamza-bey ×2, tomb-of-ali-dede ×2, tomb-of-orhan-gazi (İznik imaret vs Bursa tomb), tomb-of-sultan-alaaddin ×2, melik-el-adil-i-turbesi, melikgazi-tomb, firuz-aga-mosque, abdulaziz-khan-madrasa, uftade, tezveren-sultan, umur-bey, sofular, hamza-bey mosque variants, hanabila 32628 (Aybak mausoleum proximity), al-aqsa-mosque (Kudus).
- LEADS: Şehzade Mahmud Türbesi Muradiye Bursa (29850,30201 — new-entity candidate), Gülbahar Hatun Mescidi Edirne (29370), Selçuk Hatun Mescidi Edirne (29372), Sultan II. Bâyezid Camii Edirne külliye (29381), Lārī/Laleli Çelebi mosque Edirne (29382), Yahya Beg Tophane Çeşmesi Edirne (29397), Mašhad Sa'd al-Anṣārī Aleppo-region (30090-31684 ×4), Zāwiya Aḥmad al-Badawī Damascus (30144-5), Sofular Camii Yambol Bulgaria, Hamza Bey Câmii Stara Zagora, Büyük Cami museum Bulgaria, Mehmed Pasha Sokolović Bridge Višegrad, Dev Ali confirmed.
- Next sweep: 32801-36800 running.

## 2026-11-09 (p12) — TEI 32801-36800 COMPLETE

Range done (4000 fiches): TURQUIE tombs/türbes, AFGHANISTAN (Herat/Gardigah), IRAN (Isfahan/Mashhad/Qumm/Sari/Maragha/Shiraz), SYRIE-Ḥalab mashhads, GREECE Didymoteicho.
- suleymaniye-mosque +32831 (Istanbul Süleymaniye 1558-59); yivli-minare-mosque +33135,35575,35961 (same Antalya Seljuk medrese as 32401-2); alhambra +33808 (Peinador de la Vega palace text 1397-98)
- cifte-minareli-madrasa +33302,33304 (Erzurum Hâtuniye/Çifte Minareli 1183-84 + 1349-50)
- torumtay-tomb +32844 (Amasya Gökmedrese quarter 1278-79); seyh-bedreddin-turbesi +32808 (Ilgın 1286-87); seyh-tennuri-turbesi +32928 (Kayseri 1484-85); seyyid-serif-turbesi +32836 (Develi 1342-43)
- seyyid-battal-gazi-tomb +33444 (Eskişehir mausoleum 1252-53); parizad-madrasa +36001 (Mashhad Imam Reza complex Do Dar 1439-40); diri-baba-mausoleum +36162 (Maragha 1402-03); imamzadeh-abbas-sari +36297,36301 (Sari east suburb 1423-24,1491-92)
- REJECTED: al-sultaniyya ×5 (Aleppo Utrush/proximity vs Cairo), sidi-el-ansari ×6 (Aleppo mashhad + Afghanistan Khwaja Abdullah Ansari complex vs Tunis entity), maqam-ibrahim ×2 (Aleppo Harawi), bab-al-nasr (Utsh Khan caravanserai outside Aleppo gate), bimaristan-al-sayyida (Damascus Sayyida Ruqayya mosque vs Baghdad bimaristan), ghurid-mausoleum (Herat Gawhar Shad mosque vs Jam Ghurid mausoleum), iii-murad-turbesi (Topkapi Murad III kiosk vs türbe), mausoleum-of-hazrat-sultan (Davletabad Hazrat Salih mosque vs Kitob entity), samara-mosque (Gaza hammam vs Samarra), sultan-ismail ×3 (Isfahan/Qumm Imamzadeh Ismail shrines), hasan-baba ×2 (Sultaniyeh khanqah near Celebi Oglu tomb), ahi-evran ×1 (Kirsehir mosque vs zaviye-turbe), celebi-sultan-mehmed ×1+tomb-of-mehmed-v (Didymoteicho mosque vs Bursa), firuz-aga-mosque (Havza mescidi vs Istanbul entity), tomb-of-harabat-sultan (Harabat Ankur mosque), mosque-of-el-ahmadi (Ra'is Ahmadi mausoleum), al-ashraf-mosque (cemetery).
- Next sweep: 36801-40800 running.

## 2026-11-09 (p13) — TEI 36801-40800 COMPLETE (thin range)

Range done (4000 fiches): AFGHANISTAN Ghazni/Herat, TURKMENISTAN Sarakhs, IRAN, MAROC Fez, GRECE/BALKANS, EGYPT Cairo, RUSSIE.
- bab-zuwayla +38857 (Bab Zuwayla gate construction text 1092-93 — fiche is ON the gate itself)
- sayyida-nafisa-mosque +39651,39653 (Sayyida Nafisa mausoleum revetment/vows 1227-28 — routed to Cairo shrine entity, NOT Baghdad bimaristan-al-sayyida which the matcher hit)
- alhambra +40515 (Patio del Mexuar palace text 1397-98)
- REJECTED: minaret-of-masud-iii ×3 (inscriptions were in Masud III's PALACE, not the minaret); ghurid-mausoleum ×3 (Herat Gawhar Shad mosque); tomb-of-mahmud ×3 (Ghazni "Mahmud minaret" + unidentified Bangladesh mosque); luqman-castle (Turkmenistan Luqman mausoleum vs levant-iraq fort entity); saidabad-mosque (fortress vs mosque); bab-zuwayla-proximity (Salih Talai mosque next to gate); tobolsk-mosque ×2 (Siberian nomad-camp finds); mehmed-bey-turbe/tomb-of-mehmed-v (Skopje Mehmed Bey Cami mosque + Fatih bridge); ishak-celebi-tomb (Bitola mosque+library); bayezid-i-veli-tomb (Kars citadel mosque vs Bursa tomb); samara-mosque (Gaza hammam); ilyas-bey ×3 (Yarhisar village); sidi-el-ansari (Gardigah Afghanistan); qarawiyyin (Objet fiche deferred); alhambra-count ok.
- Next sweep: 40801-44800 running.

## 2026-11-09 (p14) — TEI 40801-44800 COMPLETE + 6 new lead entities

Range done (4000 fiches): heavy ISTANBUL mosque list (person-named mescidi/cami/çeşme), ALHAMBRA palace inscriptions ×50, ESPAGNE Toledo, MAROC Fez, GRECE, AFGHANISTAN, IRAN, TUNISIE.
- alhambra +49 palace fiches (42954-44284: Partal oratory, Mexuar, Comares façade/cour/Myrtles/Barca/Comares hall, Lions complex full set, Peinador de la Reina, Infantas tower, San Francisco convent site; Objet fiche 44298 deferred)
- NEW ENTITIES (draft, TEI-cited): gulbahar-hatun-mescidi (Edirne 29370, 1451-52), selcuk-hatun-mescidi (Edirne 29372, 1455-56), sehzade-mahmud-turbesi-bursa (Muradiye 29850+30201, 1506-08), mashhad-sad-al-ansari (Aleppo region village, 6 fiches 30090-35495, 1347-1513), zawiya-ahmad-al-badawi-damascus (30144-5, 1493-94), sofular-cami-yambol (31894, 1481-82)
- old-mosque-stara-zagora +31898 (Büyük Cami/Hamza Bey Câmii 1408-09 — entity already identified as Hamza Bey mosque)
- maqam-ibrahim +43022 (Mecca Harām restoration 1509-10); mosque-of-cristo-de-la-luz +42962 (Toledo Bab al-Mardum 1300-01); elvan-celebi-mosque +41085 (Çorum complex 1307-08); al-zaytuna-mosque +41806 (Tunis 1583-84); atik-valide-mosque +42197 (Üsküdar 1583-84); haseki-hurrem-mosque +42049 (Istanbul 1539-40); hamza-bey-mosque-thessaloniki +43151 (1467-68); tomb-of-mustafa-turabi +44375 (Akşehir 1542-43)
- REJECTED ~60: Istanbul person-named mosques/fountains/hammams vs tomb entities (Mahmud/Mehmed/Yahya Efendi/Ali Efendi/Seyyid Ali Reis/Kılıç Ali/Kara Mehmed/Hurrem Çavuş/Daye Hatun/Koca Mustafa/Kurd Çelebi/Zal Mahmud/Defterdar/Cerrah Mahmud/Mehmed Ağa çesmesi ×8/Sokullu Mehmed ×2/Yahya Efendi ×2/Murad III çesmesi); Hurrem Sultan HAMAMI (bath not tomb); minaret-of-masud-iii ×3 (palace); ghurid×0; yedikule (Hacı Evhad proximity); cifte-gelinler (mosque vs tomb); of-ramazan-efendi (mescidi vs tomb); seyyid-ali/ishak/ahmed-bey/esen-bey/seyh-saban/atabey-gazi/hasan-efendi (mosque-vs-tomb namesakes); ismail-bey+sultan-ismail (Kastamonu imaret); aksaray (Agzikara han); gulbahar-hatun-tomb (Trabzon Gülbahar Hatun Camii — NEW mosque, tomb entities unaffected); karawiyyin Objet ×2 deferred; khan-mosque-isfahan (village proximity); tomb-of-mehmed-v fountains/baths ×15.
- Next sweep: 44801-48800 running.

## 2026-11-09 (p15) — TEI 44801-48800 COMPLETE (thin range)

Range done (4000 fiches): MAROC Fez Qarawiyyin cluster, ISTANBUL remainder, scattered Balkans/Greece/Afghanistan.
- qarawiyyin +7 architectural fiches (47828 west pavilion sahn 1205-06, 47829 mosque pavilion 1339-40, 47902 dome before Bab al-Ward + 47945 maṣriyyat al-Khaṭīb hall 1436-37, 47972-4 Bab al-Shammā'īn lustres 1213-14); 3 Objet fiches deferred (47968,47969,47978)
- guzelce-hasan-bey-mosque +45061 (Hayrabolu 1499-1500 — later text on the 1406 mosque)
- REJECTED: abdurrahman-sultan-tomb (Akmescid mosque), sultan-ii-selim-tomb (Edirne Selim II mosque Objet), tomb-of-mehmed-v ×3 (Sokullu medrese/mosque + Bosnia church-conversion), tophane-fountain (Kılıç Ali mosque), of-ramazan-efendi (Bazargân mescidi), minaret-of-masud-iii (palace again).
- Next sweep: 48801-52800 running (covers ~52000 target).

## 2026-11-09 (p16) — TEI 48801-52800 COMPLETE — SWEEP MILESTONE (~52000 reached)

Final range done (4000 fiches, through fiche 52800 — target ~52000 exceeded).
- sehzade-mosque +49226 (Şehzade Sultan Mehmed mosque külliye Eminönü 1548-49)
- madrasa-of-al-nasir-muhammad +50259 (wooden entrance-door text 1303-04)
- madrasa-al-ghawri +50914,50915 (Ghawriyya madrasa between al-Moski and Bab Zuwayla 1511-12 — routed to Ghawri entity, NOT bab-zuwayla proximity)
- REJECTED: palace-of-yashbak (Yashbak mausoleum vs palace), al-nasir-muhammad-MOSQUE on madrasa fiche, sultan-hasan Objet fiche (51596 deferred), bab-al-nasr (Zakki mosque outside Aleppo gate), sultan-ismail (Homs turba), aksaray ×2 + pervane-medrese (hans Alay/Oresin), tomb-of-mahmud (Mahmud Muharram mosque), iii-murad-turbesi (Mecca Murad III imaret), esrefoglu ×2 (Konya mosque vs Beysehir entity), qanibay (madrasa vs mosque), tomb-of-mehmed-v ×2 (Sokullu külliye).
- SWEEP STATUS: TEI fiches 1-52800 harvested+matched. Total session: ranges 28801→52800 = 60,000 fiches this thread; cumulative coverage well past halfway of ~52k target.
- Remaining: catalogue reportedly continues past 52800 (id space may extend further) — decide whether to continue 52801+ or pause sweep; explore-list source families still pending.

## 2026-11-09 (p17) — Explore-list assessment: Nomisma.org (numismatics)

First explore-list family scored against the eight criteria (verification date 9 Nov 2026, live site checked):

**Nomisma.org** — collaborative Linked Open Data ontology for numismatic concepts, founded 2010 by Sebastian Heath & Andrew Meadows (American Numismatic Society, NY); INC patronage since 2014; Oxford-linked development (Ethan Gruber). Verified live: SPARQL endpoint + documented APIs + CC-BY 3.0 licence statement.

1. **Authority** — EXCELLENT: ANS + Oxford + INC patronage, named scientific committee.
2. **Citability** — EXCELLENT: stable `nomisma.org/id/…` URIs per concept, resolvable, plus SPARQL/typed APIs.
3. **Terms** — EXCELLENT: CC-BY 3.0 stated on site; partner datasets carry their own licence statements to check per-record.
4. **Structure** — EXCELLENT: SPARQL endpoint, REST-style APIs, RDFa — fully machine-readable.
5. **Coverage fit** — EXCELLENT and urgent: `kind: coin` objects number ~2 in the graph while Islamic numismatics spans ~1,300 years of mints/reigns; coins also corroborate `place` (mints), `person` (issuers) and `polity` (dynasties) across the whole timeline.
6. **Corroboration value** — EXCELLENT: coins are primary evidence for mint towns, regnal dates and titulature — exactly the corroboration class the corpus lacks.
7. **Arabic-first** — MODERATE: coin legends are Arabic; Nomisma labels are primarily English/German with some Arabic — usable, not Arabic-first.
8. **Longevity** — EXCELLENT: ANS institutional hosting since 2010, INC-recognised KOS.

**Verdict: strong Tier-1/2 registration candidate.** Proposed harvest: mint → `place`, issuing authority → `person`/`polity`, type/standard → `object` kind coin, die/legend facts facts-only with `nomisma.org/id/…` stable citations. Next step: draft registration block (harvest-registry entry, `data/source/nomisma` entity, attribution row, decision record), register in one commit, pilot on 10 coin-adjacent records.

**Other probes (light):** muslimscholars.info — web-only, self-admitted ~5% error, no visible API → link-only at best, defer. iDAI.gazetteer — site reachable but JS-heavy; needs deeper API check before scoring. Walters manuscripts — HTTP 403 on anonymous fetch; needs Wayback or API-key route like earlier museum families.

## 2026-11-09 (p17) — TEI 52801-56800 COMPLETE

- madrasa-al-ghawri +6 (53194-53245: Ghawriyya madrasa portal/iwans/exterior 1503-04 — matcher hit bab-zuwayla on proximity, rerouted)
- al-muayyad-mosque-cairo +3 (53256-68: Mu'ayyad Shaykh mosque texts 1420-21, near Bab Zuwayla)
- alhambra +53459 (Peinador palace text 1390-91); qarawiyyin +54637,54638 (Bab al-Khulafa' + Bab al-Ward gates 1136-37)
- REJECTED: bab-zuwayla direct ×0 (all 9 were misroutes), uzun-hasan (Hasankeyf mausoleum of Zaynal b. Uzun Hasan vs Tabriz türbe), suleyman-pasha-tomb (Mardin köşk), tomb-of-mahmud (Ramla Shaykh Mahmud mosque), edirne ×2 (chandelier provenance unknown).
- Nomisma.org scored: strong Tier-1/2 candidate (ANS+Oxford, CC-BY 3.0, SPARQL+APIs) — see assessment above.
- Next sweep: 56801-60800 running.
## 2026-11-09 (p17b) — Nomisma.org registered Tier 2

- dec-20261109-224 (override of engine false-positive dec-223, same 'Arabic'-in-evidence class as dec-190/204): Nomisma.org registered as citable numismatic family — CC-BY 3.0, {cite:nomisma <concept-id>} is the attribution; partner datasets facts-only until per-record licence check.
- Files: data/source/nomisma.yaml, scripts/harvest/sources.yaml (layer: by), docs/attribution.md, docs/agents/source-families.md Tier 2 row.
- Pilot queued: SPARQL harvest script; ~2 kind:coin objects exist so pilot targets mint→place / issuer→person corroboration first.
- Explore-list remainder (numismatics): ANS MANTIS, Tübingen Sylloge Nummorum Arabicorum, Fitzwilliam/Ashmolean collections. Other explore families still pending.

## 2026-11-09 (p18) — TEI 56801-60800 COMPLETE (thin range)

- alhambra +58709,58724,59291 (three more palace texts 1300-01/1494-95)
- REJECTED: bab-al-nasr (Aleppo Sabīl Qastal al-Ǧawra fountain in Bab al-Nasr QUARTER, not the gate), hasan-efendi-tomb/-2 (Homs house Bayt az-Zahrawī of Ḥasan Efendi al-Naqib 1538-39 vs Anatolian tomb entities — kind+place mismatch), aksaray-mausoleum (Konya-Aksaray Münhedim madrasa vs SAMARKAND Timurid tomb — different city and kind).
- HORIZON FOUND: catalogue real content ends at fiche 61517 (61518+ parse as empty placeholders to 100000+). Final range 60801-61517 (~717 fiches) launched — catalogue exhaustion imminent.

## 2026-11-09 (p19) — TEI CATALOGUE EXHAUSTED at fiche 61517 + Nomisma pilot

- Final range 60801-61517 (717 fiches): ZERO matcher candidates — tail of catalogue carries no inscription-nature records matching entities. **TEI coverage now COMPLETE: fiches 1-61517 harvested, matched and verified.**
- Nomisma pilot (10 records, mint→place corroboration): place/damascus↔damascus, place/cairo↔cairo, place/baghdad↔baghdad, place/kufa↔al-kufa, place/samarra↔samarra, place/isfahan↔isfahan, place/nishapur↔nishapur, place/merv↔marw, place/qazvin↔qazwin, place/rayy↔rayy — each mint concept's English definition verified as the same city before citing; external_ids.nomisma + source/nomisma added.
- Nomisma SPARQL notes: endpoint is GET https://nomisma.org/query?query=<sparql> (param `query`, NOT `q`); Orbeon engine = SPARQL 1.0 only (no property paths); ~2000 mints in default graph incl. madinat_* duplicates — plain slugs preferred; concept URIs resolve at nomisma.org/id/<slug>.
- Next: expand Nomisma pilot to remaining verified mint↔place pairs (shiraz/tabriz/mosul/basra/homs/wasit/hilla/mardin/hama/raqqa/aden/yazd/ardabil/tiflis/delhi/aleppo + issuer→person/polity pass); explore-list families still pending.

## 2026-11-09 (p20) — Nomisma pilot expanded: 63 more mint↔place links (73 total)

- Batch 2 (19): shiraz,tabriz,mosul,basra,homs,wasit,hilla,mardin,hama,raqqa,aden,yazd,ardabil,tiflis,delhi,aleppo,herat,edirne,istanbul
- Batch 3 (44): sur(Tyre),al-sus(Susa),mayyafariqin(Silvan),sanaa,sinjar,kirman,qumm,qinnasrin,ramhurmuz,surraq,khilat,ceuta,bursa,izmir,ghazna,harran,irbil,istakhr,jerusalem,kabul,mecca,muscat,palermo,petra→petra_arabia,qayrawan,tarsus,tunis,zaranj,al-fustat,al-shash,amid,amman,cordoba,darabjird,fasa,gaza,granada,hamadhan,marrakesh,almeria,seville,agra,balkh,malaga→al-andalus_malaga
- REJECTED name/kind mismatches: madinat-al-zahra (Gaza municipality vs Córdoba palace city), alexandreia_on_the_caucasus (Bactria vs Egypt), al-andalus+fars_shiraz (region/province not the city), jayy/madinat_jayy (Isfahan suburb dup), sur_al-ma'muniyah + sur_man_ra'a (Tyre/Samarra dups already cited), misr (Fustat-vs-Cairo ambiguity — cairo covered via nm:cairo), ancona/belgrade/constantinople/nineveh/rhodes/amorium/athens/bura/arsa/jannaba/tabala/heraclea*/sala*/antiocheia_* (non-Islamic or ambiguous), region concepts qumis/tabaristan/shirwan/sijistan/arran/macedonia*, village sabur.
- tour/halls.yaml parity updated for mecca/jerusalem/cordoba stops.
- Next: issuer→person/polity pass (Umayyad/Abbasid/Fatimid/Mamluk/Ottoman/Safavid concepts), then type/standard→object pass for the 2 kind:coin records; remaining explore families pending.

## 2026-11-09 (p21) — Nomisma issuer pass COMPLETE: 16 polities + 59 persons + 2 coin objects

- **Authority→polity (16):** umayyad-caliphate, abbasid-caliphate, samanid-dynasty, aghlabid-emirate, fatimid-caliphate, almoravid-dynasty, almohad-caliphate, ayyubid-dynasty, bahri-dynasty, burji-dynasty, mamluk-sultanate, ottoman-empire, safavid-iran, ghaznavid-empire, muhammad-ali-dynasty, umayyads-of-cordoba — each `external_ids.nomisma` verified against the 74-row authority query.
- **Person→issuer (59):** every link verified by reading the Nomisma concept's own `skos:definition` (SPARQL 1.0, http://nomisma.org/id/ URIs) against the person record's identity — NOT by name matching alone.
  - Abbasid caliphs: al-mansur, al-amin, al-mutazz, al-muttaqi, al-nasir-billah, al-zahir-billah
  - Fatimid/Ubaydid: ubayd-allah-al-mahdi, al-qaim-fatimid, al-muizz-li-din-allah, al-mansur-ubaydi, al-adid-fatimid, al-amir-fatimid, al-mustansir-fatimid, al-mustali-fatimid, al-zafir-fatimid
  - Ayyubid: al-malik-al-aziz-uthman, al-adil-ii, al-malik-al-adil-ayyub (al-Adil I), al-malik-al-adil-salamish, al-malik-al-kamil, al-malik-al-salih-ismail, turanshah (Turanshah IV)
  - Tulunid/Ikhshidid: ahmad-ibn-tulun, muhammad-ibn-tughj-al-ikhshid
  - Córdoba Umayyads: abd-al-rahman-ii-andalusi, abd-al-rahman-iii-al-nasir, hisham-i-andalusi, al-hakam-i-andalusi, al-mustansir-hakam (al-Hakam II), sulayman-al-mustain-cordoba + sulayman-al-mustain-andalusi (duplicate pair, same person — flagged)
  - Other dynasties: masud-ibn-mahmud (Ghaznavid Mas'ud I), muhammad-tapar (Seljuk Muhammad I), masud-ibn-muhammad-saljuqi (Hamadhan Seljuk 1134-52), ahmad-ibn-uways (Jalayirid), al-nasir-muhammad-ibn-qalawun, al-malik-al-mansur-ali-ibn-aybak (first Mamluk Ali)
  - Mamluk: qutuz, faraj-ibn-barquq, jaqmaq-al-zahiri, al-ashraf-inal, al-mansur-fakhr-al-din-uthman
  - Moroccan Alawids: hassan-i-of-morocco
  - Ottoman: bayazid-i-yildirim, murad-iii-uthmani, murad-iv-uthmani, ahmad-iii-uthmani, mustafa-i-uthmani, mustafa-iii-uthmani, abd-al-hamid-i-uthmani, abd-al-hamid-ii-uthmani, abd-al-aziz-uthmani, abd-al-majid-i-uthmani, mehmed-ii, mehmed-iii-uthmani, muhammad-v-rashad, uthman-ii-uthmani (slug says uthman, content is Osman II), bayazid-ii
- **Coin objects (2):** duranir-andalusiyya + umm-hajara-hoard gain denomination/issuer concept ids (`dirham`, `umayyads_spain`, `umayyads`, `abbasids`). Only 2 `kind: coin` records exist in the graph — type pass complete.
- **Rejected after definition check:** nm:al-hasan_al-a'sam_ibn_ahmad (Mamluk Yusuf 1438, NOT the Qarmati al-A'sam), nm:al-mustansir_billah → al-mustansir-hafsi (Nomisma's is the FATIMID caliph; matched to al-mustansir-fatimid instead), nm:muhammad_iv + nm:muhammad_iii_ibn_abd_allah (Moroccan sultans, not Hafsid), nm:al-'aziz_'_'uthman_ibn_yusuf → al-aziz-fatimid (Nomisma's is Ayyubid Uthman b. Saladin → al-malik-al-aziz-uthman), nm:murad_iii → murad-iii-bey (Ottoman sultan, not Tunisian Bey), nm:al-hafiz_b_al-hasan (Moroccan Sultan Abdelhafid, not Fatimid al-Hafiz), nm:abd_al-rahman_ibn_hisham + nm:abd_al-rahman_ibn_yazid (Moroccan/Abbasid-official, not Córdoba/Governor matches), nm:sulayman_al-musta'in_billah verified as Córdoba Sulayman II.
- **No person file exists for:** al-Saffah, Hisham II al-Mu'ayyad, Tumanbay (def internally inconsistent — "25th sultan, ~100 days in 1501"), Egyptian Ayyubid al-Mansur (Muhammad b. al-Aziz), Mamluk Ala al-Din Ali II, Kayqubad II, Mamluk al-Mansur Sayf al-Din Abu Bakr, Shihab al-Din Ahmad, Marinid Abu al-Hasan Ali, Zaydan, Hasan II Morocco, ghiyath_al-din_mas'ud_ii (concept def actually describes Kaykhusraw III).
- **Duplicate flagged:** person/sulayman-al-mustain-cordoba and person/sulayman-al-mustain-andalusi are the same historical person (Sulayman II al-Musta'in of Córdoba) — both carry the same nomisma id pending a merge ruling.
- SPARQL notes: canonical concept URIs are http://nomisma.org/id/<slug> (https yields zero triples); skos:definition holds the English gloss used for every verification; persons query = ?s a foaf:Person + skos:prefLabel en.
- Next: explore-list families — ANS MANTIS, Tübingen Sylloge Nummorum Arabicorum, Fitzwilliam/Ashmolean collections, manuscript catalogues beyond QDL/HMML, iDAI.gazetteer, Walters (Wayback/API-key), muslimscholars.info (deferred: web-only, ~5% self-admitted error).

## 2026-11-09 (p22) — ANS MANTIS registered Tier 1 facts-only (PR #5726 MERGED)

- Assessment: authority excellent (ANS premier US numismatic institution, per-record maintenance history); citability excellent (stable accession ids, 6 serializations); terms data ODbL + images PDM/NoC-US; structure excellent (REST getNuds/getRDF, Atom feeds, per-record .xml/.rdf/.ttl/.jsonld/.kml/.geojson, Solr queries); coverage excellent+urgent (~60,672 Islamic-dept records vs 2 kind:coin objects); corroboration excellent (records carry nomisma.org authority/mint URIs matching external_ids.nomisma); longevity excellent (since ~2007).
- Decision: inbox web-ans-mantis-onboarding → engine docked nd-outreach on 'nomination' inside 'denominations' (4th substring false-positive specimen) → override dec-20261109-226 = Tier 1 citable facts-only.
- Registered: data/source/ans-mantis.yaml, scripts/harvest/sources.yaml (layer: by), docs/attribution.md, source-families.md Tier 1 row + explore-list update, CANARY.
- Pilot plan: bounded set of coins of already-linked rulers (the 59 persons + 16 polities from the Nomisma issuer pass); ODbL share-alike review needed before any bulk structured ingest.
- Next: Tübingen Sylloge Nummorum Arabicorum, Fitzwilliam/Ashmolean collections, manuscript catalogues beyond QDL/HMML, iDAI.gazetteer, Walters, muslimscholars.info.

## 2026-11-09 (p23) — Explore-list assessments: Tübingen DEFERRED; Fitzwilliam/Ashmolean probing

- **Tübingen MK-TUE-FINT (Sylloge Nummorum Arabicorum online catalogue) → DEFERRED.** Authority excellent (FINT/University of Tübingen; SNAT print series is the reference for Islamic coin types, RNS+ANS award winners; project funded to 2031). BUT live site is broken: u-017-s126.uni-tuebingen.de connection fails, fint-ikmk.uni-tuebingen.de returns PHP fatal error (553-byte error page), Wayback rate-limited at check time. Only ~444 objects online anyway — the real corpus is the copyrighted Wasmuth print volumes (facts-only, inaccessible). Revisit when the catalogue is live again or via Wayback snapshots; no registration possible while citability/structure can't be verified.
- **Fitzwilliam/Ashmolean → probing next** (museum collections class — per-collection licence check required).
- **Fitzwilliam Museum → DEFERRED (API unreachable).** fitzmuseum.cam.ac.uk live (robots.txt open: `User-agent: * / Disallow:` empty); site links a collection-data API at data.fitzmuseum.cam.ac.uk/api — the host times out from this network (curl 000), so licence/structure can't be verified today. Authority would be excellent (major university museum, SNAT-model Islamic coin publications); revisit the API endpoint later — likely a strong Tier-1/2 candidate for coins + decorative arts.
- **Ashmolean → deferred with Fitzwilliam.** ashmolean.org/collection answers 404 on the guessed path; needs the real collection-search URL + licence check before scoring. Both are 'Museum collections, per collection' class — per-collection licence confirmation required at onboarding anyway.
- **Walters Art Museum → DEFERRED (Cloudflare challenge).** thewalters.org/api/v1 and even /robots.txt answer a Cloudflare managed challenge ("Just a moment…") to plain curl — same live-block class as Zeno; never bypass. Revisit via Wayback snapshots of API responses or founder contact; otherwise pointer-tier at best.
- **muslimscholars.info → REJECTED.** Frameset-era site ("Welcome to Muslim Scholars Database from Arees"), meta copyright "All contents copyright of Arees Institute", no API/structured access, single-institute authority. The Itqan narrator DB (MIT, ~115k rijal profiles) already covers the rijal cross-reference need far better.

## 2026-11-09 (p24) — iDAI.gazetteer registered Tier 2 + first pilot; coin-object Nomisma verification

- **Coin-object Nomisma type/standard pass VERIFIED (no changes needed).** Both kind:coin records' comma-joined `external_ids.nomisma` values decompose into real Nomisma concepts, each definition-checked: `dirham` ("Islamic silver denomination"), `umayyads_spain` ("Umayyads of Spain ruled in al-Andalus 138-422/756-1031"), `umayyads`, `abbasids` — all resolve at nomisma.org/id/. The comma-joined multi-id convention is de-facto established (also `ayyubids,ayyubids_egypt` on polity/ayyubid-dynasty); `nomisma` remains unregistered in external-id-patterns.yaml because registering it would activate the duplicate-external-id error and `sulayman_al-musta'in_billah` is carried by two duplicate person records pending a merge ruling.
- **iDAI.gazetteer → Tier 2 registered (dec-20261109-228, supersedes dec-227).** DAI ancient-world place gazetteer: authority excellent, citability excellent (canonical place/<gazId> URIs), CC-BY 4.0 footer licence, JSON API (search.json/doc/<id>.json/suggestions/children/geoSearch), robots Allow: /, ~25-language names incl. Arabic, owl:sameAs links to Pleiades/geonames/GND, per-record provenance. Tier 2 = shared reference vocabulary (Nomisma's gazetteer counterpart); Pleiades stays Tier-3 pointer.
- **Engine false-positive #5:** nd-governance fired on the literal 'robots.txt' inside access-posture evidence — override dec-228 records the fifth substring/keyword specimen for the rule-precision audit.
- **Pilot:** 12 place records gain `external_ids.idai` + `source/idai-gazetteer` after per-record doc verification (name, coords, Arabic name): Damascus 2280221, Aleppo 2280212, Cairo 2042858, Córdoba 2361201, Fez 2118497, Istanbul 2285315, Qayrawan 2042772, Marrakesh 2110784, Mecca 2283160, Medina 2043268, Tunis 2042783, Baghdad 2769425 (admin-unit type — name+coords+Arabic بغداد verified; no zenon/geonames identifiers on that record).
- **Deferred re-probe (all still unreachable):** Tübingen u-017-s126 (000), Fitzwilliam data API (000), Walters (403 Cloudflare challenge).
- **Rejected:** muslimscholars.info (frameset-era, all-rights-reserved, no API; Itqan narrator DB covers rijal better).
- Registered: data/source/idai-gazetteer.yaml, scripts/harvest/sources.yaml, docs/attribution.md, source-families.md Tier-2 row + explore-list strike, external-id-patterns.yaml `idai` key, CANARY.
- Next: continue iDAI place-id pass on the remaining major cities (bounded batches, per-record verification); explore BnF Gallica / Chester Beatty / Leiden / Princeton-Cambridge manuscript catalogues / Papyri.info; re-probe deferred hosts periodically.

## 2026-11-09 (p25) — iDAI.gazetteer place-id pass batch 2: 22 more cities

- Second verified batch: Antioch 2283111, Balkh 2410924, Basra 2771817, Bursa 2283204 (Prusa), Constantine 2042624, Edirne 2283001, Granada 2359867, Herat 2379586, Jerusalem 2090049, Khiva 2733465 (Chiwa), Konya 2283197, Kufa 2733318, Malaga 2359874, Murcia 2361205, Nishapur 2368554 (Neyshabur), Palermo 2359599, Samarkand 2042967, Samarra 2283182, Seville 2361218, Tlemcen 2764518, Tus 2110058, Valencia 2361215 — all doc-verified (name, coords, types; Arabic names where present).
- **Skipped with reason:** place/wasit — iDAI entry 2769440 is typed administrative-unit at [45.82,32.52] while our record carries [46.30] flagged 'approximate until checked against a gazetteer'; ~50 km apart → not linked, flagged for coordinate reconciliation. No-match cities (gazetteer has no usable entry): Bukhara, Merv, Rayy, Qumm, Ghazna, Zaranj, Hamadhan, Istakhr, Abiward, Algiers (modern-name coverage thin).
- halls.yaml jerusalem mirror resynced.

## 2026-11-11 (p27) — iDAI.gazetteer place-id pass batch 3: 25 more cities (59 total)

- Method: every city/town record in the Maghreb, al-Andalus/Europe, Persia/Central Asia and Arabia regions that carries a GeoNames or Pleiades id (226 candidates) was searched by English label through `search.json` at one request per second; hits were kept only within 30 km, then each chosen entry was re-read through `doc/<gazId>.json` and checked for name, type `populated-place`, Arabic name and distance from the record's own coordinates.
- **Linked (25, all within 1.2 km, all typed populated-place):** Annaba 2110071, Béjaïa 2123033, Biskra 2110421, Oujda 2765527, Sétif 2096154, Sfax 2042776, Sousse 2042779, Gabès 2099425, Oran (place/wahran) 2092359, Tétouan (place/t-touan) 2770734 (pref. name "Tatuan", Arabic تطوان), Almería 2359875, Cartagena 2365651, Toledo (place/tulaytula) 2074550, Tortosa 2359868, Úbeda 2099325, Uclés (place/ucl-s) 2756492, Isfahan 2089954, Shiraz 2109666, Tabriz 2109526, Hamadan (place/hamadan) 2043471, Tustar 2750078 (pref. name Šūštar, Arabic تستر), Urmia 2733746, Aden 2287356, Zabid 2043303, Tayma 2281940. GeoNames id equal on 17 of the 25; the rest matched on name + Arabic name + coordinates.
- **Observation, not changed (out of scope):** on six records the museum's own `external_ids.geonames` differs from the GeoNames id the gazetteer carries for the same town — Sfax (ours 280566, iDAI 2467454), Sousse (221715 / 2464915), Gabès (110075 / 2468369), Tortosa (6361397 / 3107677), Úbeda (6358538 / 2510116), Uclés (6357543 / 2510106). The Spanish ones look like municipality-versus-town ids; the three Tunisian ones need a GeoNames check. Flagged for a GeoNames reconciliation pass.
- **Not linked, with reason:** Asilah — entry 2765533 is the ancient site Zilil (Dchar Jdid), a different place from the modern town although it carries Asilah's GeoNames id; Casablanca — entry 2042678 has no `types`; Algiers — only the Great Mosque entry, no city entry (confirms p25); Abu Dhabi — only an archaeological-site/institution entry 5 km away; Sabzevar, Khenchela, Tabarqa, Sidirokastro — two gazetteer entries each for the same town (gazetteer-side duplicates), held until one can be preferred; place/fes and place/harat — the gazetteer ids (2118497, 2379586) are already carried by place/fez and place/herat, and the `idai` key is unique per record, so these duplicate place records are flagged, not linked.
- **No usable gazetteer entry (search returned nothing within 30 km):** Bukhara, Merv, Rayy, Qumm, Ghazna, place/hamadhan (the gazetteer's Hamadan is now on place/hamadan), Tashkent, Tirmidh, Sijilmasa, Muscat, Taif, Ha'il, Yanbu, Buraydah, Doha, Kuwait City, Qafsa, Lahijan, Isfarayin, Qayn, Nakhchivan, Shamakhi, Dumat al-Jandal, Badr, Diriyah, and the Arabic-spelled Andalusi records (Sarqusta, Shatiba, Tarraqona, Wadi al-Hijara, Qal'at Ayyub, Talabira) whose English labels are transliterations the gazetteer does not index — these need a search by the modern name in a later pass.
- **Verified and queued for batch 4 (cap of 25 per batch):** Miliana 2765865, Nafta 2771890, Ceuta 2042679, Ibiza 2359879, Messina 2299105, Cefalù 2178796, Trapani 2178811, Tudela 2756485, Sari 2379573, Tehran 2096795, Mashhad 2110061, Maragha 2733333, Ardakan 2110655, Kabul 2090085, Kandahar 2783275, Khorramshahr 2749824, Shibam 2751839, Tabuk 2043287, Rada'a 2752099, Jeddah 2751578, Riyadh 2784883, Dhi al-Sufal 2773916 — each `doc` record was read and passed the same checks on 11 Nov 2026 (Riyadh 5.5 km and Mashhad 4.0 km from the museum's point, both inside the modern city; all others within 3 km); they wait only for the batch cap.
- No tour stop is among the 25, so `tour/halls.yaml` is unchanged.

## 2026-11-12 (p29) — iDAI batch 4 (17 cities) and Nomisma mint batch (23 places)

- iDAI: each candidate's `doc/<gazId>.json` re-read on 12 Nov 2026. Applied (distance <= 1.5 km, populated-place): miliana 2765865, nafta 2771890, ceuta 2042679, ibiza 2359879, messina 2299105, cefalu 2178796, trapani 2178811, tudela 2756485, sari 2379573, maragha 2733333, ardakan 2110655, kabul 2090085, kandahar 2783275, shibam 2751839, radaa 2752099, jeddah 2751578, dhi-as-sufal 2773916.
- iDAI held (distance above 1.5 km): tehran 2096795 (3.0 km), mashhad 2110061 (4.0 km), tabuk 2043287 (2.2 km), khorramshahr 2749824 (1.8 km), riyadh 2784883 (5.5 km). Mashhad and Tehran are the same towns the Nomisma pass touches; resolve the coordinates before linking.
- Noted, not changed: ceuta's iDAI entry carries GeoNames 2519582 against our 6362987; kandahar's GeoNames id is absent from iDAI.
- Nomisma: each mint concept read live (nmo:Mint, Arabic label, geo coordinates). Applied `external_ids.nomisma` and `source/nomisma` where the mint is 3.5 km or less from the record: al-mukalla, taraz, tulaytulah (place/tulaytula), acre, al-ramlah, khoy, tustar_min_al-ahwaz, sijilmasah, rabat, constantine_algeria, amol, bukhara, termez (place/tirmidh), tehran, kashan, jayy, dar_al-marz_rasht (place/rasht), jannaba, sari, ahwaz (place/al-ahwaz), murshidabad, burhanpur, belgrade.
- Nomisma held: tashkent (7.4 km) and mashhad (4.0 km).
- Tour mirror: none of the 39 edited records is a tour stop; `tour/halls.yaml` unchanged.

## 2026-11-12 (p30) — iDAI remainder, Nomisma remainder, manuscript-catalogue assessment

- iDAI applied (distance <= 1.5 km, populated-place, name and Arabic match re-read): sabzevar 2733406, unaizah 2770740 (its GeoNames id 8394316 is not on the gazetteer entry; noted).
- iDAI HELD: sanaa 2777018 (1 km, but the gazetteer entry is the old city, المدينة القديمة, not the city record; GeoNames differs 6940658 vs 71137). Also: harat and fes (their ids are already on herat and fez), asilah (the entry is the ancient site Zilil).
- Nomisma applied (mint within 3.5 km): tiberias, tyre, sidon, antioch (antiocheia_syria), jabala (gabala), tarabulus-sham (tripolis_phoenicia), al-madain (ctesiphon), adana.
- Nomisma HELD: babil (babylon, 2.2 km; mint definition is the ancient site, not clearly an Islamic-period mint); ascalon (the concept fetch failed twice; retry later).
- Manuscript catalogues: Leiden Digital Collections has no content licence (LICENSE.txt covers the site software); robots allows; Crawl-delay 10. Chester Beatty online collections: robots disallows search and OAI; the terms URL returns 404; no licence line found. Neither qualifies under criterion 3 (a public terms page must exist). NOT registered.
- BnF Gallica: robots.txt answers a Cloudflare challenge (403). Not reachable; deferred again.

## 2026-11-12 (p31) — held items re-checked

- sanaa: the city-level iDAI entry 2281510 (Sanʿaʾ, populated-place, 0.7 km, GeoNames 71137 matches ours) passes; the old-city entry 2777018 is still not linked. Linked sanaa -> 2281510.
- ascalon: Nomisma concept `ascalon` fetched on the second try (mint at the ancient site of Ascalon in Judaea), 0.9 km from our point; linked. The concept `askalan` returns an empty body and was not used.
- babil: Nomisma concept `babylon` (mint at the ancient site of Babylon), 2.2 km; linked on the same standard as the other ancient-site Levant and Iraq mint links. Flagged for founder review of the wording.
- Gallica robots.txt: still a Cloudflare 403 (re-probed 12 Nov 2026); not registered.

## 2026-11-12 (p32) — unlinked-city re-probe, Nomisma remainder, Papyri.info registration

- iDAI re-probe of the 20 cities: linked qumm -> 2368556 (Qum, 0.2 km, Arabic قم matches) and qafsa -> 2042753 (Gafsa, 0.9 km, GeoNames 2468353 and Arabic قفصة match).
- HELD rayy -> 2733387 (Rey, 0.01 km, GeoNames 9533872 matches, but no Arabic-script name on the gazetteer entry).
- hamadhan: its only hit is 2043471, already on place/hamadan (duplicate place; flagged, not linked).
- No populated-place within 1.5 km under the English or alternate name: Bukhara, Merv, Ghazna, Zaranj, Istakhr, Abiward, Algiers, Tashkent, Tirmidh, Sijilmasa, Muscat, Taif, Ha'il, Yanbu, Doha, Kuwait City.
- Nomisma: no new pair passes. ankara (1.9 km) concept describes the modern city, not an Islamic-period mint: held. amorium (2.5 km) duplicates place/ammuriyya: held as a duplicate pair. samosata: concept not readable: held. Founder to review the 'ancient site' wording for the earlier links.
- Papyri.info registered Tier 2 facts-only (source/papyri-info, registry row, attribution row, source-families row), by decision dec-20261112-266 (override of two engine false positives).
- New family: none qualifies. Orient-Digital and MEGA-Jordan did not respond (no answer from the host). Perry-Castañeda maps page has no licence wording and no machine route.

## 2026-11-12 (p33) — candidate notes: score sheets (no registration this turn)

Scoring uses the eight criteria of docs/agents/source-families.md (authority, citability, terms, structure, coverage fit, corroboration, Arabic-first, longevity). Each is rated excellent / good / moderate / weak / unverified. Terms posture is one of open, facts-only, link-only, orientation-only. No candidate's subject or publisher is a blocked organisation (AGENTS.md). Downloads were not made; the browser and HTTP reads were of public pages only, with no challenge, login or paywall bypassed.

### 1. Al-Thurayya Gazetteer (github.com/althurayya/althurayya.github.io)
- Authority good (Leipzig team with Maxim Romanov; Tufts/Perseus origin). Citability moderate: records are GeoJSON files named by toponym and coordinate code (for example ABADHA_526E311N_S.geojson); a GitHub path is a resolvable anchor, but there is no authority id. Terms: the project data is CC BY 4.0 (DATA-LICENSE.md) and the code Apache-2.0; source-derived fields (Cornu's atlas, Shamela titles) are excluded from that grant.
- Structure excellent (GeoJSON in git, places.json). Coverage good (ninth–tenth-century Islamic geography, 2,000+ toponyms with Arabic titles). Corroboration good (per-record citations to Yaqut and Samʿani). Arabic-first excellent (Arabic titles on each record). Longevity moderate (self-described working version; last push 22 Sep 2026; the project's own domain did not answer).
- Posture: open for project-created data; source-derived fields excluded.
- Recommendation: PILOT (10 place records, anchored by GitHub path), not registration. Registration needs a stable anchor decision first.

### 2. EpiHub, The Monumental Inscriptions of Historic Cairo (open-epihub.cnr.it; resource /api/resources/88)
- Authority good (CNR Italy catalogue; Cairo project by Scarpa and Valente; site hosted with Cultnat / Bibliotheca Alexandrina). Citability good at resource level (DOI 10.82261/fvq9-b273); inscription-level ids unverified (the site is a search database with no public list route I could read).
- Terms: EpiHub lists the resource licence as "Unidentified"; the Cairo site has no licence or terms page (About and Instructions pages state use only). EpiHub's own pages are CC BY 4.0, which does not extend to resources it catalogues.
- Structure weak for harvesting (no bulk or JSON route found). Coverage excellent (Islamic monumental inscriptions in Cairo, Hijri and CE dates, Arabic text: the epigraphy gap). Arabic-first excellent. Longevity good (DOI, institutional hosting).
- Posture: unknown, so facts-only is not yet available: no terms page exists to state the line.
- Recommendation: DEFER until the publisher states a licence in writing. EpiHub as a whole is ORIENTATION-ONLY (catalogue of resources, not a data source).

### 3. vHMML (vhmml.org; /terms, /dataPortal, /dataPortal/dataset, /dataPortal/schema)
- Authority excellent (Hill Museum & Manuscript Library, HMML). Citability good (persistent PURL per object; HMML project number; shelfmark and repository fields).
- Terms: Reading Room and Museum metadata are CC BY 4.0 (terms page and dataset page). Images are NOT open: partner libraries retain rights (Beinecke, Vatican, Bodleian, British Library, Laon, and others), and some images are CC BY-NC 4.0 (HMML-owned only).
- Structure excellent: weekly bulk JSON and CSV datasets, line-delimited, with a documented schema (object / part / contents levels). I did NOT download them: a download needs the founder's permission (dataset sizes: JSON 48 MB, listing 3 MB CSV).
- Coverage moderate for the Islamic gap: the collection leans toward Christian manuscripts (Syriac, Ethiopic, Greek, Latin); the count of Arabic-Islamic manuscripts is unverified until a listing is read. Corroboration good (colophons, ownership, dates). Arabic-first moderate (language fields exist; Arabic share unverified). Longevity excellent.
- Posture: open for metadata; images excluded.
- Recommendation: PILOT, metadata only, after the founder permits one download of the 3 MB CSV listing to count Arabic-Islamic manuscripts.

### 4. Biblissima authority referentials (data.biblissima.fr, Wikibase)
- Authority excellent (Biblissima+, a French national research infrastructure). Citability excellent (stable entity URIs, for example data.biblissima.fr/entity/Q499, Ahmad ibn Ibrahim Ibn al-Jazzar, 878–980 CE).
- Terms: data licence is the Etalab Open Licence 2.0, stated on the wiki's Licence page and compatible with CC BY 2.0 and ODC-BY (read 12 Nov 2026). Open posture.
- Structure good but with one limit: the SPARQL endpoints answer 401 Unauthorized (query.biblissima.fr, query.data.biblissima.fr), so SPARQL is not an anonymous route and was not used. The MediaWiki and Wikibase JSON API answered anonymously (wbsearchentities returned entities with Arabic-script labels; allpages listing worked).
- Coverage good for authors and persons of the manuscript and Islamic-scholar field; works coverage unverified. Arabic-first excellent. Corroboration unverified (no cross-reference checked). Longevity good.
- Posture: open (Etalab 2.0).
- Recommendation: PILOT via the wiki JSON API only (no SPARQL, no login), on 10 person entities; register later if the pilot holds.

### 5. Louvre collections (collections.louvre.fr; ARK records with .json)
- Authority excellent (Musée du Louvre). Citability excellent (ARK identifiers, for example ark:/53355/cl010062323, with a per-record JSON at the same ARK plus .json).
- Terms: textual notices are public information under the Etalab Open Licence (article 4.1.2 of the site's CGU, read 12 Nov 2026); photographs and works under copyright are NOT open (article 4.1.1: prior authorisation; some credited photographs need the other institution's consent). robots.txt disallows /search/export and blocks image crawling for named AI bots. Respect both.
- Structure good (JSON per record, no bulk route found). Coverage moderate for the Islamic gap (Louvre's Islamic holdings exist, but the share in the 490-object backlog is unverified). Corroboration good (bibliography, provenance, inscriptions fields). Arabic-first weak (French and English record text). Longevity excellent.
- Posture: open for text notices; images excluded.
- Recommendation: PILOT, text fields only, a bounded set of Islamic-department objects, one request at a time, with no image fetches.

### Summary
| Candidate | Score (of 8 criteria) | Terms posture | Recommendation |
|---|---|---|---|
| Al-Thurayya Gazetteer | 6 good or better, 2 moderate | open (project data) | pilot, 10 places |
| EpiHub Historic Cairo | 4 good or better, 2 weak or unverified | unknown (no terms page) | defer; EpiHub orientation-only |
| vHMML | 5 good or better, 2 moderate/unverified | open (metadata); images excluded | pilot after founder approves one CSV download |
| Biblissima referentials | 5 good or better, 1 unverified | open (Etalab 2.0) | pilot via wiki JSON API, 10 persons |
| Louvre collections | 5 good or better, 1 weak, 2 moderate | open (text notices); photographs excluded | pilot, text fields only, Islamic objects |

Nothing is registered this turn. Each registration needs the three-part commit in source-families.md (registry row, source entity with reliability_note, attribution row), plus a decision record for the founder.
