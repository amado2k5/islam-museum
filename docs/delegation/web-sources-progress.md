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
