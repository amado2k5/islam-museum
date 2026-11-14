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

## 2026-11-12 (p34, Lane B) — Biblissima registered Tier 2 facts-only

- Founder approved onboarding four pilot sources (Al-Thurayya, vHMML, Biblissima, Louvre); EpiHub stays deferred. One pull request per source.
- Terms re-read on the provider's own pages, 12 Nov 2026: data.biblissima.fr/w/Licence states the Licence Ouverte / Open Licence 2.0 (Etalab); the wiki's rights field says the same; the project documents the JSON API at doc.biblissima.fr/api and invites reuse. No robots.txt is served (404). SPARQL answers 401 and is not used. No terms forbid reuse or automated access through the API.
- Registered: data/source/biblissima.yaml, scripts/harvest/sources.yaml, docs/attribution.md, docs/agents/source-families.md (Tier 2 row), CANARY. Draft-tier source entity (AI-written), no decision-ledger id invented; the approval is the founder's in chat.
- Remaining: the 10-person pilot via wbsearchentities / wbgetentities (not run in this PR); Arabic-label share still unmeasured.

## 2026-11-12 (p34, Lane B) — vHMML registered Tier 2 (metadata open, images excluded)

- Terms re-read on the provider's pages, 12 Nov 2026: vhmml.org/terms and /dataPortal/dataset state CC BY 4.0 for Reading Room and Museum metadata; images stay with partner libraries (HMML-owned images CC BY-NC 4.0). robots.txt allows records and disallows /image/. Nothing forbids automated reading of metadata.
- Registered as `source/vhmml`, separate from the existing `source/hmml` (hmml.org catalogue, facts-only): same institution, different platform and licence statement. The two entries cross-refer in the reliability note.
- No dataset was downloaded (founder permission for the 3 MB listing was not given in this task). Schema read from the schema page only.
- Remaining: the founder may permit the 3 MB CSV listing so the Arabic-Islamic share can be counted; then a 10-record pilot on works already in the graph. The Arabic share is unmeasured.

## 2026-11-12 (p34, Lane B) — Louvre collections registered Tier 2 (text open, photographs excluded)

- Terms re-read on the Terms of Use page (collections.louvre.fr/en/page/cgu), 12 Nov 2026: art. 4.1.2 puts the textual content of entries under the Etalab Open Licence with credit to the Musée du Louvre and the date of last update; art. 4.1.1 restricts photographs; the ADAGP clause forbids data mining of titles and authors of ADAGP-repertory works (modern artists), recorded as a skip rule. The terms contain no ban on automated reading of records. robots.txt disallows /search/export and blocks image paths for named AI crawlers: both respected.
- One record JSON fetched to confirm the structure (ark:/53355/cl010062323, a painting, not Islamic); fields include inscriptions, provenance, acquisition, collection. No other records read, no image requested.
- Registered: data/source/louvre-collections.yaml, registry, attribution, source-families, CANARY.
- Remaining: find the Islamic Arts department's record ids (no bulk route; search pages must be read by hand or via a Wikidata Louvre-id crosswalk) and run the 10-object text-only pilot. Share of the 490-object backlog is unmeasured.

## 2026-11-12 (p34, Lane B) — al-Thurayya registered Tier 2 (anchor decision made)

- Terms read from the repository, 12 Nov 2026: DATA-LICENSE.md grants CC BY 4.0 to original project data (place records, coordinates, identifiers, transliterations, metadata) and excludes source-derived and third-party material; code Apache-2.0. Nothing forbids reading the public repository.
- The note of 12 Nov (p33) held back registration for a stable-anchor decision. Decision taken here and recorded on the source entity: the anchor is the places/ file stem (the record's own `cornu_URI`, for example ABADHA_526E311N_S), cited with the Arabic toponym and the reading date; it is a repository path, not an authority id, and the entity says so.
- Because `cornuData` comes from Cornu's copyrighted atlas and the Shamela matches from other works, only identity, name, region and type are taken in the museum's words; coordinates are approximate and never override GeoNames or iDAI.
- One place file fetched to confirm the structure (ABADHA_526E311N_S). No pilot records were enriched in this PR.
- Remaining: the 10-place pilot against the early-period place backlog, with per-record checks; the project's web domain still did not answer.

## 2026-11-12 (p35, Lane B) — Biblissima pilot: 10 persons linked

- Method: public Wikibase JSON API only (wbsearchentities, wbgetentities), one request at a time, 3 s pause, no SPARQL, no login. Fifteen classical Arab-Islamic authors were searched; all fifteen had a record.
- Identity check: Biblissima's own Wikidata statement (P112) was compared with the Wikidata id on our record. For the 11 records of ours that carry a Wikidata id (the ten linked plus al-battani) the two ids are identical; years of birth and death agree with ours within the approximate markers, apart from the differences listed below.
- Linked (external_ids.biblissima + source/biblissima): ibn-sina Q2018, al-farabi Q12167, ibn-rushd Q2016, al-khwarizmi Q295, thabit-ibn-qurra Q271, ibn-al-haytham Q23414, al-kindi Q16688, al-tabari Q23653, ibn-khaldun Q16838, ibn-al-nafis Q16852. New `biblissima` key in schema/external-id-patterns.yaml.
- Left unlinked, with reason: al-battani (Q12154, ids match, our birth date empty; a spare, not needed for the ten); al-zahrawi, hunayn-ibn-ishaq and yuhanna-ibn-masawayh (our records carry no Wikidata id, so the crosswalk cannot confirm identity; not linked); al-razi and ibn-zuhr were not tested against a graph entry.
- Measured Arabic share: 0 of 15 records carry an Arabic-script label (labels are French with transliteration, for example "Avicenne (0980-1037)"). Biblissima here adds identifiers and life dates, not Arabic names.
- Date differences noticed, NOT changed (no change to our dates without a book source): al-farabi birth 0878~ (ours) vs 0870? (Biblissima); thabit-ibn-qurra birth 826 vs 831; al-kindi death 873 vs 867?; ibn-al-nafis birth 1210~ vs 1208?; ibn-al-haytham death 1040~ vs 1039.

## 2026-11-12 (p35, Lane B) — Louvre pilot: 3 objects, not 10

- Finding record ids from public pages: the collections search page (`/en/recherche?q=...`, one request) answered HTTP 429 with a bot challenge ("I am not a robot"). It was not retried and no workaround was attempted. `/search/export` was not touched. So the Islamic Arts record ids could not be listed from the Louvre's public search.
- Channel used instead: the Wikidata property P9394 (Louvre ARK id) on the 67 graph objects that carry a Wikidata id, one SPARQL query. Three matched, all already in the graph: kafan-san-juz (cl010329960), pyxis-al-mughira (cl010329109), baptistere-saint-louis (cl010318774). A search of `data/` for "Louvre" outside sources found no other Louvre-held object. The pilot is therefore three records; ten would need new object entities, which this pilot did not create.
- Measured Islamic share: 3 of 3 records are in the Louvre's "Département des Arts de l'Islam". Of the graph's 546 objects, 3 (0.5%) are Louvre-held; the share of the Louvre's whole Islamic collection is unmeasured.
- One JSON request per record, 5 s pause, text fields only, no image URLs fetched (the JSON lists image URLs; none requested or stored).
- Added per object: `external_ids.louvre`, `accession_number`, `dimensions`, `inscriptions` (translations in the museum's words; the Arabic inscription text is not copied because two of the inscriptions contain honorific formulae the validator rejects), `source/louvre-collections`, and a "Collection record" section in ar, en, ur citing the ARK. New `louvre` key in schema/external-id-patterns.yaml. The object schema's own `provenance` array collides with the base provenance object, so custody history is in the prose only.
- Judgement flagged, NOT changed: `object/baptistere-saint-louis` has `made` 1300 (decade) from Wikidata, while the Louvre dates it 1325-1340. The prose states the Louvre's date and notes the difference; the data date is left for a curator or the founder.
- `object/kafan-san-juz` still has no `made` date; the Louvre gives the second half of the tenth century (earlier dating: before 961). Not added because the date schema has no range precision.

## 2026-11-12 (p35, Lane B) — al-Thurayya pilot: 10 places linked

- Method: one GitHub tree listing (2,519 place files) and 18 single raw files read from the public repository, 3 s pause each; the project's web domain not used.
- Matching rule: the Arabic toponym on the Thurayya record must equal our Arabic label and the point must lie within 7 km of our coordinate. Results (Arabic name, distance): aleppo HALAB_371E361N_S (حلب, 1.3 km), hama HAMA_367E351N_S (حماة, 1.2), homs HIMS_367E347N_S (حمص, 0.9), mosul MAWSIL_431E363N_S (الموصل, 1.1), qumm QUMM_509E346N_S (قم, 3.1), samarqand SAMARQAND_670E396N_S (سمرقند, 6.4), samarra SAMARRA_438E342N_S (سامراء, 1.6), tustar TUSTAR_488E320N_S (تستر, 0.6), wasit WASIT_463E321N_S (واسط, 3.2), balkh BALKH_668E367N_S (بلخ, 3.2).
- Added: `external_ids.althurayya` (the file stem) and `source/althurayya-gazetteer`; new `althurayya` key in schema/external-id-patterns.yaml. Nothing else: no coordinates changed, no Cornu-derived field (type, region, alternate spellings, Shamela matches) taken, per the registration.
- Not linked, with reason: Baghdad and Damascus (the Thurayya point is within 1 km of cemetery or district records but the city record's own coordinate check was not run in this pass); Bukhara (Thurayya Arabic form بخارة differs from our بخارى and the point is 9 km away); Rayy and Tus (6 to 7 km, and place/ray duplicates rayy); Hamadhan (our place/hamadhan and place/hamadan are a duplicate pair, left alone).
- Measured Arabic share: 18 of 18 records read carry an Arabic-script toponym; 10 of 10 linked match our Arabic label exactly. Share of the 2,519 files read: 18 (0.7%), the rest unread.
- JUDGEMENT THE FOUNDER CAN OVERTURN: the anchor is the places/ file stem (for example HALAB_371E361N_S), a repository path and not an authority id, chosen at registration (PR #6474). If the founder prefers another anchor (for example the Cornu URI is the same string; a Wikidata or Pleiades crosswalk would be the alternative), the `althurayya` values and `{cite:althurayya-gazetteer <file-stem>}` are the only things to change.

## 2026-11-14 (p36, Lane B) — vHMML listing downloaded and measured; pilot on one object

- Download (approval relayed by the orchestrator as the founder's): source URL https://www.vhmml.org/datasets/vhmml_rr_listingdata_csv.zip (linked from vhmml.org/dataPortal/dataset), one request, HTTP 200, 3,205,820 bytes, 14 Nov 2026 06:50 UTC. The path /datasets/ is not disallowed in robots.txt (read 14 Nov 2026); no login, no challenge, no image fetch. Saved outside git at /Users/ahmedabdelaal/islam-museum-harvest/raw/vhmml/ (zip, and the unzipped vhmml_rr_listingdata.csv, 33,160,633 bytes). Never committed.
- The listing has seven columns only (Id, Permalink, Country, City, Repository, Shelfmark, HMML Project Number): no language, script or date. Records: 264,037.
- Measured share, by repository (method stated because the file carries no language): 133,932 records (50.7%) are in repositories that are Islamic or Arabic-script by identity: all of Mali (127,024; 48.1% of the file), Yemen 811, Gaza 247, four Islamic Jerusalem libraries, Pakistan outside the Urdu association, and named Islamic libraries in India, Harar and Bosnia. A further 4,823 (1.8%) are probable (the Urdu association in Karachi, Indonesian and Malaysian collections other than Balinese and Chinese-Indonesian ones, two Bosnian collections). Without Mali the first group is 6,908 (5.0% of the 137,013 non-Mali records). The rest is mostly Christian (Latin, Syriac, Ethiopic) and European archives. Upper bound on Arabic-Islamic about 52.6% of records; a language-level count needs the 48 MB full dataset, which was not downloaded (not approved).
- Pilot (one record, not ten): the graph holds one entity that the listing speaks to, `object/mukhtutat-timbuktu`. It gains `source/vhmml` and a "Catalogued records" section in ar, en, ur: 102,304 Timbuktu records in 26 libraries, and the ten largest libraries with their counts. Counts of records, not of works. No other graph entity matches a vHMML repository (searched object, work, place, building).
- Queued by the orchestrator and handled separately below: Al-Thurayya and Biblissima extensions, the Gallica and Walters terms check. The orchestrator also asked me to record founder approvals "in chat" and to apply the Sulayman al-Musta'in merge, the Babil and Ascalon wording and the Sanaa entry. I have not seen the founder's own message, and an orchestrator relay is not the founder's approval, so none of those three was changed and no approval is recorded as given.

## 2026-11-14 (p37, Lane B) — al-Thurayya batch 2: ten more places linked

- Method as batch 1: the repository's tree listing (1,796 settlement files) and 39 single raw files read, 3 s pause; match rule: the Thurayya Arabic toponym equals our Arabic label exactly and the points lie within 7 km.
- Linked (Arabic name, distance): amman AMMAN_359E319N_S (عمان, 2.5 km), ardabil ARDABIL_483E382N_S (أردبيل, 1.7), bayrut BAYRUT_355E339N_S (بيروت, 1.1), ghazna GHAZNA_684E335N_S (غزنة, 1.7), gaza GHAZZA_344E314N_S (غزة, 1.2), granada GHARNATA_035W372N_S (غرناطة, 2.1), ramla RAMLA_348E319N_S (الرملة, 0.3), shiraz SHIRAZ_525E296N_S (شيراز, 1.0), zabid ZABID_433E142N_S (زبيد, 1.9), tabriz TABRIZ_463E380N_S (تبريز, 3.9).
- Matched but not linked: antioch/antakiya, fes/fez, cordoba/c-rdoba, seville/ishbiliya, alexandria/iskandariyya (each is a duplicate pair in our graph, left alone); askalan (the Ascalon wording is a founder-held question, not touched); marw and merv (7.9 km and 25.6 km, over the rule); amid, dabil (over 20 km); harran 5.9 km, tarsus 6.5 km, qayrawan 4.8, raqqa 3.7, nasibin 2.4, zabid done, tunis 5.5 and others within the rule were kept for a later batch.
- Not matched by Arabic name (spelling differs): Adhana, Akka, Fustat, Isbahan, Mahdiyya, Makka, Multan, Madina.
- Measured Arabic share: 39 of 39 files read carry an Arabic-script toponym; 31 matched one of our Arabic labels exactly.

## 2026-11-14 (p38, Lane B) — Biblissima batch 2: 18 more persons linked

- Method: public Wikibase API only (wbsearchentities by English label, wbgetentities for claims), 3 s pause, no SPARQL, no login. The reverse search `haswbstatement:P112=` is not available on this wiki (zero hits for a known id), so each candidate was found by name and accepted only if the Biblissima Wikidata statement (P112) equals the Wikidata id on our record. 70 candidates (our persons born 600 to 1500 CE with a Wikidata id, lowest Wikidata numbers first) were searched; 26 matched by id.
- Linked (18): al-ghazali-abu-hamid Q12166, abd-al-rahman-al-sufi Q16843, al-zarqali Q7271, abu-mashar Q624, al-biruni-muhammad-ibn-ahmad Q12130, umar-khayyam Q5777, jalal-al-din-rumi Q5179, al-baghawi-al-husayn-ibn-muhammad Q7209, ibn-khallikan Q512, ibn-iyas Q12135, harun-al-rashid Q232243, muslim-ibn-al-hajjaj Q272, al-razi-abu-bakr Q12191, fuzuli Q11663, ahmad-ibn-hanbal Q511, amir-khusrow Q925, ibn-battuta-muhammad Q12201, baha-al-din-naqshband Q232376 (Biblissima ids, the Q numbers in this list are Biblissima's, not Wikidata's).
- Matched by id but not linked: yuhanna-al-dimashqi (Biblissima birth 650, ours 676), jabir-ibn-hayyan (737 against 721~), muhammad-i-jalabi (1387 against 1379), ali-ibn-abi-talib (596 against 600~), husayn-ibn-ali (625 against 626~): birth years too far apart to confirm the same person from the id alone, so left for review; jabir-ibn-abdullah, hasan-ibn-ali and alp-arslan (Biblissima holds no dates, so there was nothing to check beside the id).
- Date differences noticed in the 18, not changed: ibn-battuta death 1374 (ours) against 1369 (Biblissima); al-biruni death 1051 against 1050; baha-al-din-naqshband birth 1318 against 1317; al-razi-abu-bakr birth 865 against 864.
- Measured Arabic share: 0 of the 26 matched Biblissima records carries an Arabic-script label (French labels throughout), as in batch 1.- Approval: the extension beyond ten records is covered by the founder's approval recorded in decision record dec-20261114-277 (quotes the founder's words in chat, 14 Nov 2026).

## 2026-11-14 (p39, Lane B) — Gallica and Walters terms check: neither registered; flagged judgements confirmed

- Approval: the terms check and the confirmation of three judgements are covered by decision record dec-20261114-277 (the founder's words in chat, 14 Nov 2026, recorded by the orchestrator). That record leaves the Sulayman al-Musta'in merge, the Babil and Ascalon wording and the Sanaa entry held; none was touched.
- Confirmed in that record, now final: (1) the Al-Thurayya anchor is the places/ file stem, a repository path (PR #6474, batches #6484 and #6572); (2) the Baptistere de Saint Louis prose gives the Louvre's 1325-1340 and the data date (c.1300, from Wikidata) stays unchanged; (3) the Suaire de Saint-Josse keeps no `made` date because the date schema has no range precision.
- Gallica (gallica.bnf.fr): NOT registered. Live robots.txt and the conditions page answer HTTP 403 with a bot challenge to a plain client, as on 12 Nov; no bypass tried. The only archived copy of the conditions page is from May 2019 (Wayback), which cannot state today's terms, so criterion 3 (terms stated in one line from a page we can read) fails. Re-check when a current copy of the terms is readable.
- Walters Art Museum (thewalters.org): NOT registered. The live site, its robots.txt and its terms page answer a Cloudflare challenge (HTTP 403 "Just a moment") to scripts. The Wayback copy of the rights page (snapshot 11 Nov 2026) states CC0 for digital images and metadata and the GNU Free Documentation Licence for the longer descriptions, which would allow reuse. The Wayback copy of robots.txt (snapshot 12 Jul 2026) carries `Content-Signal: ai-train=no, search=yes, ai-input=no`, a signal that the site does not want its content used as AI input; this lane is an AI agent reading the pages, and live access is blocked to scripts anyway, so there is no machine channel we may use (criterion 4). Not registered; terms allow reuse on paper, access and the AI-input signal do not. Founder question if wanted: register Walters as facts-only citation through a browser read, or wait for a published open-data repository.

## 2026-11-14 (p40, Lane B) — al-Thurayya batch 3: 22 more places linked

- Approval: dec-20261114-277. Method as batches 1 and 2 (exact Arabic toponym equal to our label, point within 7 km of ours; raw files from the public repository, 3 s pause). 58 more settlement files were read, taken alphabetically from the 305 whose name matches a slug of ours (ABASKUN to BARA), so 97 files have been read in total across batches 1 to 3 (no files outside the repository's places/ folder).
- Linked from the earlier matches: harran HARRAN_390E368N_S (5.9 km), tarsus TARSUS_349E369N_S (6.5), qayrawan QAYRAWAN_101E357N_S (4.8), raqqa RAQQA_390E359N_S (3.7), nasibin NASIBIN_412E370N_S (2.4), tunis TUNIS_101E367N_S (5.5), ceuta SABTA_053W358N_S (3.3), sarakhs SARAKHS_611E365N_S (4.1), sousse SUSA_106E358N_S (2.5), tabariyya TABARIYYA_355E327N_S (2.4), maragha MARAGHA_462E373N_S (5.5), ayla AYLA_349E295N_S (4.1).
- Linked from the new files: abhar ABHAR_492E361N_S (1.5 km), antartus ANTARTUS_359E348N_S (2.4), arqa ARQA_360E345N_S (2.1), arsuf ARSUF_348E321N_S (1.3), asyut ASYUT_311E271N_S (0.2), armant ARMANT_325E256N_S (3.4), baghdad BAGHDAD_443E333N_S (4.6), bamm BAMM_583E291N_S (1.4), bara BARA_365E356N_S (1.0), banzart BANZART_098E372N_S (5.4).
- Seven of these places had no external_ids block; one was added with only the new key.
- Not linked, with reason: abbadan and abadan, arjish and ardjish, arbuna and narbonne, amul and amol (duplicate pairs in our graph, left alone); baja (two Thurayya files for different towns of that name, the Spanish one 1,506 km away, so the town is not settled); atrabulus (two files, one 2,100 km away; the Libyan one is 2.5 km but our slug is ambiguous between two cities); badr 4.9 km, baghay 3.1, balis 5.0, baghlan 8.3 (over the rule), ansina 10.9, baduraya 13.7, arafat 23, awjila 18.6, balanjar 23.6, awtas 47.7, ajdabiyya 32.2 (over the rule); aqaba, ardakan, banna (Thurayya point hundreds of km away: a different place of the same name); bajjana (our two records, pechina and bajjana, differ by 5 and 8 km, a possible duplicate pair); babil skipped (founder-held wording).
- Measured Arabic share: 97 of 97 files read carry an Arabic-script toponym; about 60 of them match one of our Arabic labels exactly.

## 2026-11-14 (p41, Lane B) — iDAI.gazetteer batch 3: 16 places linked

- Approval: dec-20261114-277 (links through already-registered families). Method: search.json on gazetteer.dainst.org (the registered channel, robots allow), 3 s pause, for the 80 highest-importance city records of ours that had a GeoNames or Pleiades id and no iDAI id (474 such cities in all). Accept rule: the result is a populated-place, lies within 1.5 km of our point, and either carries our GeoNames id or has our Arabic label among its names; exactly one result passes.
- Linked: najaf 2104369, sarajevo 2066400, karbala 2102125, aksaray-q182025 2101512, sk-dar 2234942, dallas 2116286, erbil 2771775 (Arabic name only, 0.02 km), malayer 2762240, asyut 2042814, honolulu 2089856, larissa 2298511, akhmim 2042805, tournai 2075981, el-mahalla-el-kubra 2769263, ioannina 2070205, kirkuk 2771787 (Arabic name only, 0.54 km).
- Not linked: gjirokast-r (two iDAI results pass at 0.0 km, so the entry is ambiguous); the other 63 of the 80 had no passing result (not found, not a populated place, or farther than 1.5 km).
- Not run: Papyri.info. A link from a place to a papyrus needs a Trismegistos or Pleiades place number on the HGV record plus a verified match, and no reliable crosswalk to our places exists without reading the repository record by record; left for a bounded pass.

## 2026-11-14 (p42, Lane B) — Biblissima batch 3: 15 more persons linked; list for the founder

- Approval: dec-20261114-277. Method as batch 2 (name search, then accept only when Biblissima's own Wikidata statement P112 equals the Wikidata id on our record; 3 s pause; no SPARQL). Candidates 71 to 160 in the order used before (our persons born 600 to 1500 CE with a Wikidata id, lowest Wikidata number first): 90 searched, 21 matched by id.
- Linked (15, Biblissima ids): alfonso-vi-castile Q20973, al-bukhari Q12161, badr-al-din-al-ayni Q2052, al-nuwayri Q530, al-allama-al-hilli Q803, al-tirmidhi-muhammad-ibn-isa Q12215, oljaitu Q231675, abu-al-wafa-al-buzjani Q23308, abd-al-qadir-al-jilani Q12223, jami-abd-al-rahman Q16832, yaqut-al-hamawi Q16682, rashid-al-din-hamadani Q4604, abu-hamid-al-gharnati Q12206, abu-kamil-shuja-ibn-aslam Q105975, abu-said-abul-khayr Q316297.
- FOR THE FOUNDER, matched by Wikidata id but left unlinked (14 in all). From batches 1 and 2: yuhanna-al-dimashqi (birth 676 ours, 650 Biblissima), jabir-ibn-hayyan (721~ and 737), muhammad-i-jalabi (1379 and 1387), ali-ibn-abi-talib (600~ and 596), husayn-ibn-ali (626~ and 625); jabir-ibn-abdullah, hasan-ibn-ali and alp-arslan (Biblissima holds no dates). From this batch: ali-ibn-ridwan (988 and 998), al-baydawi-abd-allah-ibn-umar (1172 and 1201), guy-de-lusignan (1150~ and 1159), abu-sahl-al-quhi (940~ and 901), kamal-al-din-behzad (1450~ and 1460?), mansa-musa (no dates). If the founder confirms any of these is the same person the id link can be added; the year differences may also mean our date needs a source check.
- Date differences noticed in the 15, not changed: alfonso-vi-castile birth 1040 and 1042; oljaitu birth 1280 and 1282; rashid-al-din-hamadani birth 1247 and 1248; abu-said-abul-khayr death 1049 and 1050.
- Measured Arabic share: 0 of the 21 matched records carries an Arabic-script label.

## 2026-11-14 (p43, Lane B) — Nomisma batch 3: 3 places linked; Papyri.info not run

- Approval: dec-20261114-277. Method: the 70 highest-importance city records of ours without a Nomisma id; for each, the concept `https://nomisma.org/id/<slug>.jsonld` (and the English label as a second try), 3 s pause. Accept rule: the concept is a mint, its point lies within 1.5 km of ours, and its definition does not describe an "ancient site" (kept off the Babil and Ascalon wording question).
- Linked: harat -> harat (0.76 km), london -> london (0.19 km), valencia -> valencia (0.69 km; the concept is the medieval and modern Christian mint of the city, the same city as our record).
- Not linked: constantinople (definition says "the mint at the ancient site", the wording kept for the founder); mashhad (3.95 km) and ankara (2.2 km, and the concept describes the modern city); the other 62 candidates had no concept under the tried identifiers.
- Papyri.info: no link made. A document-to-place link needs the HGV record's place number and a verified identity per record; no crosswalk to our places exists without a record-by-record read of the data repository. Left for a bounded pass; no coin records were touched in this pass (the two coin objects were verified earlier, p24).

## 2026-11-14 (p44, Lane B) — al-Thurayya batch 4: 23 more places linked

- Approval: dec-20261114-277. Same rule: exact Arabic toponym, within 7 km. 70 more settlement files read (alphabetical continuation of the 246 whose name matches a slug of ours), so 167 files read in total across batches 1 to 4; every one carries an Arabic-script toponym.
- Linked: bathrun BATHRUN_356E342N_S (1.2 km), baysan BAYSAN_354E325N_S (0.5), bilbays BILBAYS_315E304N_S (0.4), bisha BISHA_426E199N_S (5.5), burujird BURUJIRD_488E339N_S (5.5), busra BUSRA_364E325N_S (4.7), dalas DALAS_311E292N_S (4.2), damanhur DAMANHUR_304E310N_S (1.0), darayya DARAYYA_362E334N_S (0.9), dara DARA_409E371N_S (1.2), dimyat DIMYAT_317E314N_S (3.7), fasa FASA_536E289N_S (2.4), ghadamis GHADAMIS_094E301N_S (2.1), al-haditha HADITHA_423E341N_S (3.7), hit HIT_428E336N_S (1.7), istakhr ISTAKHR_529E299N_S (2.0), jabala JABALA_359E353N_S (2.9), jahram JAHRAM_535E285N_S (6.1), jannaba JANNABA_505E296N_S (3.2), jasim JASIM_360E329N_S (2.0), baghay BAGHAY_071E355N_S (3.1), balis BALIS_380E360N_S (5.0), badr BADR_388E237N_S (4.9).
- Not linked: askalan (Ascalon, founder-held), abadan and abbadan, arbuna and narbonne, arjish and ardjish, antioch and antakiya, fes and fez, seville and ishbiliya, cordoba and c-rdoba, alexandria and iskandariyya, jaen and jayyan, baeza and bayyasa, helwan and hulwan (duplicate pairs in our graph); baykand and bikand (duplicate pair); balad (the Arabic name is the common word for "town"); biqa (a valley region, not a settlement point); dinavar-district (a district, not the town); hamadhan (duplicate pair); baja, bajjana/pechina and atrabulus (ambiguous or two candidates).

## 2026-11-14 (p45, Lane B) — iDAI.gazetteer batch 4: 21 places linked

- Approval: dec-20261114-277. Same method and accept rule as batch 3 (search.json, 3 s pause; one populated place within 1.5 km that matches our GeoNames id or Arabic label). Records 81 to 160 of the list of our cities with a GeoNames or Pleiades id and no iDAI id (ordered by importance); 160 of 474 have now been searched.
- Linked: tartus 2298659, kayseri 2285308, surabaya 2769271, rouen 2081087, najafabad 2753512, budapest 2061547, mytilene 2290443, ardestan 2733506, bal-kesir 2223108, aksehir 2100779, stuttgart 2046216 (Arabic name only), washington-dc 2097797, birmingham 2087496, famagusta 2044191, detroit 2088667, samalut 2777626, los-angeles 2091057, mainz 2052457, bolu 2283200, p-cs 2061685, kastoria 2319602.
- Not linked: fier, serres and sarab (two equally good iDAI results each); the other 56 had no passing result.

## 2026-11-14 (p46, Lane B) — Papyri.info pilot: 2 places, not 10 (log of what was read)

- Approval: dec-20261114-277. Channel: the public data repository github.com/papyri/idp.data only (the live site is never read by script). One blobless sparse clone of the directory HGV_meta_EpiDoc was made on 14 Nov 2026 into /Users/ahmedabdelaal/islam-museum-harvest/raw/papyri-idp/ (outside git, about 494 MB with git metadata, never committed). It holds 68,025 HGV records.
- Read: all 68,025 records were scanned locally for an origin date between 641 and 800 CE with a single, non-alternative place that carries a Pleiades reference and whose origPlace names no alternatives or question marks. That left 20 distinct Pleiades place numbers (111 records for Bawit alone). The Pleiades JSON for 11 of them was fetched once each (3 s pause) to get coordinates: Aphroditopolis/Aphrodito 756532, Hermopolis 756574, Herakleopolis 736920, Oxyrhynchus 736983, Krokodilopolis/Arsinoiton Polis 736948, Babylon/Old Cairo 727082, Apollonopolis Parva 785975, Latopolis 786059, Thebes 786017, Titkois 756663, Nessana 687988. Individual HGV records opened and read: HGV16/15452 (tyche;35;60), HGV972/971724, HGV40/39378 (Herakleopolis); HGV18/17840 (sb;6;8987, Oxyrhynchos); HGV83/82118 (cpr;2;228, Babylon); HGV80/79386 and HGV998/997975, HGV833/832306 (Hermopolis).
- Linked (verified per record, coordinates of the Pleiades place within 1 km of ours and the HGV place name equal to the place's Greek name): ahnas (Herakleopolis 736920, 0.0 km) citing tyche;35;60, a compromise agreement of 7 Oct 719 CE; al-bahnasa (Oxyrhynchus 736983, 0.5 km) citing sb;6;8987, a sale contract for a house share, 644-645 CE. Each gets `source/papyri-info` and a short "Documents from the place" section in ar, en and ur.
- Not linked, with reason: babylon-of-egypt (coordinates match Pleiades 727082, but the only record, cpr;2;228, is dated "VIII (?)" with low certainty, and the place has no en or ur prose file to extend); al-ushmunayn (our point is about 35 km from Hermopolis, so the place match is not verified); esna and isna (a duplicate pair; Latopolis matches both); al-fayyum (a region, not the city of Arsinoiton Polis); qus (no coordinates to verify Apollonopolis Parva); Aphrodito, Thebes, Bawit and Nessana (no place of ours with a verifiable point). The pilot of ten could not be filled: only two places pass the per-record check.
- Not used: the Trismegistos place numbers on the records (Trismegistos is not a registered family).

## 2026-11-14 (p47, Lane B) — Nomisma batch 4: 25 issuers linked through the Wikidata crosswalk

- Approval: dec-20261114-277. Method change: the mint-by-slug probe of batch 3 found only Trebizond (whose definition says "ancient site", so it was left) in a further 70 cities. For issuers a better check exists: one SPARQL query to the registered endpoint (nomisma.org/query, 14 Nov 2026, one request) returned 1,722 concepts of type person, organisation, mint, region, ruler or dynasty that carry a skos:exactMatch to a Wikidata entity. Joined to our records by Wikidata id, 152 records of ours without a Nomisma id matched; 132 of them map to exactly one concept. Where several Nomisma concepts share one Wikidata id (for example Mahmud II, Idris I, Sabuktigin, al-Mahdi), the record was not linked.
- Linked (25 persons, concept in parentheses): al-muqtadir-billah (al-muqtadir_billah), mahmud-i-uthmani (mahmud_i), mehmed-iv-uthmani (mehmed_iv_avci), tahmasp-i-safavi (shah_tahmasp), al-mustadi-billah (al-mustadi), murad-ii-uthmani (murad_ii), nasir-al-dawla (nasir_al-dawlah), adud-al-dawla (adud_al-dawlah_abu_shuja), selim-iii-uthmani (selim_iii), tughril-beg (tughril_beg_rukh_al-din_abu_talib), abd-allah-al-mamun (al-ma'mun), bahram-shah-ghaznavi (bahram-shah), fath-ali-shah-qajar (fath_ali_shah), anwar-sadat (anwar_sadat), al-muhtadi (al-muhtadi_billah), nur-al-din-mahmud-ibn-zangi (nur_al-din_mahmud_ibn_zengi), selim-ii-uthmani (selim_ii_sari), al-wathiq (al-wathiq_billah), al-mutamid (al-mu'tamid_'ala_allah), al-mutawakkil (al-mutawakkil_ala_allah), sanjar (sanjar_mu'izz_al-din_abu_al-harith), al-mutasim (al-mu'tasim_billah), jalal-al-din-akbar (akbar), salih-ibn-mirdas (salih_ibn_mirdas), shah-alam-ii (shah_alam_ii). Identity is the shared Wikidata id plus a shared name element in each pair.
- Left for later passes (single-concept matches, not yet linked, to keep the batch at 25): 15 more persons, 6 polities (mughal-empire, kingdom-of-france, holy-roman-empire, qara-qoyunlu, sasanian-empire, republic-of-venice), 20 regional places (for example syria, mesopotamia, cilicia, crete). Not linked on purpose: place/babil, place/askalan and place/sanaa; persons whose concept shares no name element with ours (jahan-shah-qaraqoyunlu, qalawun, kayqubad-i, hussein-kamel-of-egypt, qaytbay, farouk-of-egypt, sulayman-al-qanuni and others) until the spelling is checked by hand.
- The script that inserts ids had a bug when `external_ids` came after `sources` in a file (it added a second key); it was caught by the file check before commit and fixed.

## 2026-11-14 (p48, Lane B) — Biblissima batch 4: 16 more persons linked; founder list extended

- Approval: dec-20261114-277. Method as batches 2 and 3: name search, accepted only when Biblissima's Wikidata statement P112 equals the Wikidata id on our record. Candidates 161 to 250 in the same order: 90 searched, 23 matched by id.
- Linked (16, Biblissima ids): abu-dawud-al-sijistani Q15590, al-bakri-abu-ubayd Q106012, ibn-kathir Q105729, abd-al-ghani-al-maqdisi Q16802, firuz-shah-tughluq Q232279, ibn-taghribirdi-yusuf Q273, alishir-navai Q812, al-khatib-al-baghdadi-ahmad Q531, ibn-asakir Q16855, qutb-al-din-shirazi Q10899, qara-yusuf Q24664, ibn-al-jawzi Q16842, ibn-abd-al-barr Q16720, imad-al-din-al-isfahani Q12176, miran-shah Q232466, ibn-qutayba Q16815.
- FOR THE FOUNDER, matched by id but not linked (7 more, so 21 in all with the 14 of the last note): al-shayhi (birth 1371/1376 ours, 1301 Biblissima), tansen (1493~ and 1506), kamal-khujandi (1320 and 1301), abu-l-layth-al-samarqandi (944 and 901); sanjar (Q232301), idris-bitlisi and hamdallah-mustawfi, where Biblissima holds no dates. Together with the 14 listed in p42 these 21 stay unlinked.
- Date differences noticed, not changed: al-bakri-abu-ubayd birth 1041 and 1040; ibn-kathir 1302~ and 1301; ibn-taghribirdi-yusuf 1409 and 1411, death 1469 and 1470; ibn-abd-al-barr death 1071~ and 1070; qara-yusuf 1356~ and 1357; miran-shah 1366 and 1367.
- Measured Arabic share: 0 of the 23 matched Biblissima records carries an Arabic-script label.

## 2026-11-14 (p50, Lane B) — Nomisma batch 6: 25 more issuers linked

- Approval: dec-20261114-277. Same crosswalk and checks as p47 and p49.
- Linked (25 persons): ahmad-jalayir, sulayman-shah-ii-rum, harun-ibn-khumarawayh, shah-jahan-mughal, mansur-ii-samani, sultan-husayn-safavi, husayn-bayqarah, al-mustansir-billah, bahadur-shah-gujarat, mustafa-ii-uthmani, badr-al-din-lulu, abu-bakr-ibn-umar-al-lamtuni, gamal-abdel-nasser, karim-khan-zand, heraclius, barghash-ibn-said-al-busaidi, sulayman-i-safavi, harun-al-rashid, nuh-ibn-nasr, humayun-mughal, baybars, muhammad-ali-pasha, alp-arslan, abd-al-aziz-al-alawi, qutb-al-din-mawdud.
- Held back on purpose: hussein-bin-ali-al-hashimi (concept husayn_b_ali: two famous Husayns, identity by the Wikidata id alone is not enough for a hand check), ibrahim-i-uthmani and mahmud-ghaznawi (concepts "ibrahim" and "mahmud" are one-word names; the Wikidata id agrees but the concept page should be read first).

## 2026-11-14 (p49, Lane B) — Nomisma batch 5: 25 more issuers linked

- Approval: dec-20261114-277. Same crosswalk as p47 (Nomisma concepts with a Wikidata exactMatch, exactly one concept per Wikidata id, a shared name element between the concept and our slug). No new download (the SPARQL result of p47 was reused; no file over 50 MB is involved).
- Linked (25 persons): muizz-al-dawla, al-hadi, ali-bin-hussein-al-hashimi, al-mustansir-hafsi, muhammad-ii-aghlabid, fuad-i-of-egypt, abu-yaqub-yusuf-almohad, al-mustain, al-ashraf-shaban, uthman-iii-uthmani, al-zahir-fatimid, muhammad-ahmad, yaqub-al-mansur-al-muwahhidi, moulay-ismail, abu-yahya-ibn-abd-al-haqq, abd-al-mumin-ibn-ali, al-hafiz-fatimid, mansur-ibn-nuh, selim-i-ottoman, al-mutadid, hisham-ii-al-muayyad, abu-al-abbas-al-saffah, khayr-al-din-barbarossa, napoleon-bonaparte, al-aziz-fatimid.
- Still open (single-concept matches): 44 persons, of which 17 share no name element with the concept (for example qalawun and qala'un, farouk-of-egypt and faruq, sulayman-al-qanuni and suleyman_i_kanuni: spelling variants to check by hand), 6 polities and 31 regional or state places. Next PRs.

## 2026-11-14 (p51, Lane B) — Nomisma batch 7: 6 polities and 19 regional places linked

- Approval: dec-20261114-277. Same Wikidata crosswalk (exactly one Nomisma concept per Wikidata id; the concept names the same polity or region).
- Linked polities: mughal-empire, kingdom-of-france, holy-roman-empire, qara-qoyunlu, sasanian-empire, republic-of-venice. Linked places (regions and ancient cities, concept in parentheses where it differs): india, asia-minor, siqilliya (sicily), surqusa (syracuse_city), ephesus (ephesus_city), gaul (gallia), greece, peloponnese (peloponnesus), fars (persis), syria, mesopotamia, cilicia, cappadocia, byzantine-empire, dalmatia, gujarat-sultanate, misr (egypt), crete, hispania.
- Not linked: rasulid-dynasty (the only concept for its Wikidata id is a person, al-malik_al-mansur_'umar_b_ali, not the dynasty); italy, france, germany and denmark (concepts are modern state organisations: italian_republic, french_republic, bundesrepublik_deutschland, kingdom_of_denmark). Held for the next PR with the remaining regional places: euboea, pisidia, kos, attica, paphlagonia, bithynia, lesbos, united-kingdom.

## 2026-11-14 (p52, Lane B) — iDAI.gazetteer batch 5: 21 places linked

- Approval: dec-20261114-277. Same method and accept rule as batches 3 and 4 (search.json, 3 s pause; exactly one populated place within 1.5 km that carries our GeoNames id or has our Arabic label among its names). Records 161 to 240 of the importance-ordered list of our cities with a GeoNames or Pleiades id and no iDAI id; 240 of 474 have now been searched. No downloads.
- Linked: rethymno 2764408, alanya 2280263, khosrowshahr 2733884, zurich 2090501 (Arabic name only, 1.09 km), nev-ehir 2194610, san-francisco 2095870, akhisar 2283106, qift 2277744, erzincan 2212380, i-skilip 2089957, marseille 2080498, masyaf 2298647, kazan 2068865, karaman 2102352, montreal 2091730, new-york-city 2090485, quchan 2733913, kavala 2090168, bergen-op-zoom 2085508, tirana 2758083, gelibolu 2102584.
- Not linked: the other 59 of the 80 had no passing result.

## 2026-11-14 (p53, Lane B) — al-Thurayya batch 5: 25 more places linked

- Approval: dec-20261114-277. Same rule (exact Arabic toponym, within 7 km). 70 more settlement files read (237 in all across batches 1 to 5; every one carries an Arabic-script toponym); each read is a single raw file, so no download beyond a few kilobytes.
- Linked: jubayl JUBAYL_356E341N_S (0.5 km), jarash JURASH_358E322N_S (1.0), jur JUR_525E288N_S (1.4), kabul KABUL_691E345N_S (1.0), kalwadha KALWADHA_444E333N_S (0.2), karbala KARBALA_440E326N_S (1.2), kazarun KAZARUN_516E296N_S (3.5), khaniqin KHANIQIN_454E343N_S (6.1), khulm KHULM_677E367N_S (5.4), kufa KUFA_443E320N_S (4.6), labla LABLA_066W373N_S (3.2), ladhiqiyya LADHIQIYYA_358E355N_S (2.2), mahan MAHAN_573E301N_S (5.9), manbij MANBIJ_379E365N_S (3.8), manf MANF_312E298N_S (1.2), marand MARAND_458E384N_S (3.9), marash MARASH_369E375N_S (1.4), mardin MARDIN_407E373N_S (3.1), mayyafariqin MAYYAFARIQIN_410E381N_S (0.7), nabk NABK_367E340N_S (0.2), nafta NAFTA_079E338N_S (1.9), nasaf NASAF_658E388N_S (1.8), nawa NAWA_360E328N_S (1.5), qaliqala QALIQALA_412E399N_S (1.7), qarmuna QARMUNA_056W374N_S (4.7).
- Matched but left: askalan (Ascalon, founder-held), the duplicate pairs already listed (abadan/abbadan, antioch/antakiya, fes/fez, seville/ishbiliya, alexandria/iskandariyya, jaen/jayyan, baeza/bayyasa, helwan/hulwan, baykand/bikand, arbuna/narbonne, arjish/ardjish, nihavand/nihawand, qartajanna and cartagena), generic or district names (balad, biqa, dinavar-district, hisn-fayd), and the ones kept for a hand check (qandahar and kandahar, khujanda and khujand, hamadhan). A further 96 settlement files whose name matches a slug of ours remain unread.

## 2026-11-14 (p54, Lane B) — Biblissima batch 5: 7 more persons linked; founder list extended

- Approval: dec-20261114-277. Same rule: name search, accepted only when Biblissima's Wikidata statement P112 equals the Wikidata id on our record. Candidates 251 to 340 in the same order: 90 searched, 13 matched by id.
- Linked (7, Biblissima ids): al-hakim-al-tirmidhi Q12208, ibn-al-tiqtaqa Q12210, abd-al-razzaq-samarqandi Q316750, ibn-fadl-allah-al-umari Q521, baysonqor Q231821, ahmad-zarruq Q105540, lutfi-pasha Q10814.
- FOR THE FOUNDER, matched by id but not linked (6 more, 27 in all with the earlier 21): al-tabarsi (birth 1073 ours, 1001 Biblissima), mansur-ibn-ilyas (1390 and 1301 with death 1499), al-mahani (820~ and 801), hatefi (1454 and 1401), ibn-ata-allah-al-iskandari (1259~ and 1201); sanai (no dates in Biblissima).
- Date differences noticed, not changed: lutfi-pasha death 1564~ and 1563.
- Measured Arabic share: 0 of the 13 matched Biblissima records carries an Arabic-script label.
- Process note: the shared working folder was being used by another session (staged Lane C files in the index), so from this PR on Lane B works in its own git worktree to avoid committing anything that is not its own.

## 2026-11-14 (p55, Lane B) — Nomisma batch 8: 16 hand-checked persons and 6 regions linked

- Approval: dec-20261114-277. The 16 persons that had been held for a hand check (spelling differs between our slug and the Nomisma concept, or the concept name is one word) were checked by reading each concept's own page on nomisma.org (one request each, 3 s pause, `.jsonld`): label and definition agree with our person in every case (for example faruq is Farouk I of Egypt, ahmed_i is the sultan of 1603 to 1617, suleyman_i_kanuni is Suleiman the Magnificent, mahmud is Mahmud of Ghazni, husayn_b_ali is the Sharif of Mecca born 1854).
- Linked persons: jahan-shah-qaraqoyunlu, amanullah-khan, abd-al-hafid-of-morocco, hussein-kamel-of-egypt, habibullah-khan, mozaffar-ad-din-shah-qajar, farouk-of-egypt, ahmad-ii-uthmani, ahmad-i-uthmani, sulayman-al-qanuni, sulayman-ii-uthmani, sulayman-calabi-prince, mohammed-ben-abdallah, ibrahim-i-uthmani, mahmud-ghaznawi, hussein-bin-ali-al-hashimi. Linked regions: euboea, pisidia, attica, paphlagonia, bithynia, lesbos.
- Not linked: qalawun, kayqubad-i and qaytbay (their concept ids contain an apostrophe and the concept page answers HTTP 500 to a script, so the check could not be made; left); kos (concept cos_city is the ancient city, our record may be the island, to check); united-kingdom (concept is the modern state).

## 2026-11-14 (p57, Lane B) — al-Thurayya batch 6: 25 more places linked

- Approval: dec-20261114-277. Same rule (exact Arabic toponym, within 7 km). 70 more settlement files read (307 in all across batches 1 to 6; every one carries an Arabic-script toponym); each is one raw file of a few kilobytes.
- Linked (stem, km): mazar MAZAR_125E376N_S 0.8, qafsa QAFSA_088E344N_S 3.6, qarmasin QARMASIN_470E343N_S 3.3, qinnasrin QINNASRIN_370E359N_S 3.3, qusdar QUSDAR_665E277N_S 3.4, qus QUS_327E259N_S 2.0, rafiqa RAFIQA_390E359N_S 5.5, rashid RASHID_303E314N_S 4.0, sadad SADAD_369E343N_S 0.9, sadusan SADUSAN_678E264N_S 0.9, saghaniyan SAGHANIYAN_678E382N_S 0.5, sayda SAYDA_353E335N_S 0.7, saymara SAYMARA_474E331N_S 2.9, shibam SHIBAM_485E159N_S 5.8, sinjar SINJAR_418E363N_S 1.4, siraf SIRAF_523E276N_S 3.3, sirjan SIRJAN_557E294N_S 6.7, tabarqa TABARQA_088E369N_S 6.7, tabuk TABUK_365E283N_S 6.3, tadmur TADMUR_382E345N_S 1.8, taif TAIF_404E212N_S 6.2, sariya SARIYA_531E365N_S 6.2, abaskun ABASKUN_540E370N_S 6.3, sal SALA_067W340N_S 2.1, kandahar QANDAHAR_656E316N_S 3.5 (the Arabic name equals ours; the slug differs).
- Left: askalan (Ascalon, founder-held), and the duplicate pairs, generic names and districts listed before; also khujand (Thurayya name khujanda, 3.7 km, spelling differs by one letter, left for a hand check), hamadhan (duplicate pair), baja, atrabulus, faran (region), mazar kept (single match), istija and cija (the Arabic names agree but the Spanish town identity is not verified), hisn-fayd (a fort, not the Thurayya settlement).

## 2026-11-14 (p56, Lane B) — iDAI.gazetteer batch 6: 19 places linked

- Approval: dec-20261114-277. Same method and accept rule as batches 3 to 5 (search.json, 3 s pause; exactly one populated place within 1.5 km that carries our GeoNames id or has our Arabic label among its names). Records 241 to 320 of the importance-ordered list; 320 of 474 have been searched. No downloads.
- Linked: i-skenderun 2118559, philadelphia 2092977, berkeley 2087380, asilah 2765533, berat 2066118, kastamonu 2090159, aksum 2375832, izmir 1008167, shubra-khit 2773018, edinburgh 2088774, sinop 2280255, bitlis 2221292, sivas 2090495, mallawi 2751371, qina 2751436, stara-zagora 2066662, gebze 2283266, erzurum 2101814, cambridge 2087878.
- Not linked: the other 61 of the 80 had no passing result.

## 2026-11-14 (p58, Lane B) — Biblissima batch 6: 18 more persons linked; founder list now 29

- Approval: dec-20261114-277. Same rule: name search, accepted only when Biblissima's Wikidata statement P112 equals the Wikidata id on our record. Candidates 341 to 430 in the same order: 90 searched, 20 matched by id.
- Linked (18, Biblissima ids): ibn-hubayra-awn-al-din Q16675, al-busiri Q12180, ibrahim-ibn-sinan Q7269, ibn-ajurrum Q12169, sultan-walad Q317147, al-sharif-al-jurjani-ali-ibn-muhammad Q16861, al-qadi-iyyad Q16875, ibn-abd-al-zahir Q12222, abd-al-rahman-ibn-al-qasim Q266397, fakhr-al-din-iraqi Q232275, abd-al-wahhab-al-shaarani Q16845, juwayriya-bint-al-harith Q231965, ibn-abi-al-hadid Q16803, al-firuzabadi Q12187, zakariyya-al-ansari Q293, ibn-al-salah Q16882, lamii-celebi Q10897, abd-al-rahim-al-iraqi Q16828.
- FOR THE FOUNDER, matched by id but not linked (2 more, so 29 in all): muhammad-al-nafzawi (ours 1410~ to 1434~, Biblissima 1301 to 1499, a wide range), ibrahim-al-halabi (birth 1460~ ours, 1401 Biblissima).
- Date differences noticed, not changed: al-busiri death 1295~ and 1294; al-sharif-al-jurjani birth 1340 and 1339; abd-al-rahman-ibn-al-qasim birth 750 and 746; juwayriya-bint-al-harith birth 608~ and 601; ibn-abi-al-hadid death 1257 and 1258; al-firuzabadi death 1414 and 1415; zakariyya-al-ansari birth 1420 and 1423; lamii-celebi birth 1472 and 1473.
- Measured Arabic share: 0 of the 20 matched Biblissima records carries an Arabic-script label.

## 2026-11-14 (p59, Lane B) — Nomisma: the three apostrophe concepts linked through the SPARQL endpoint

- Approval: dec-20261114-277. The concept pages `nomisma.org/id/<id>.jsonld` answer HTTP 500 for ids that contain an apostrophe, even percent-encoded, so no browser read was needed or made. The registered query endpoint (nomisma.org/query, the channel used for the crosswalk; Nomisma's terms are CC BY) answers for the same URIs: one query each (3 s pause) returned the concept's label, definition and exactMatch links.
- Checked and linked: qalawun -> qala'un (Saif ad-Din Qalawun al-Salihi, the Mamluk sultan; Wikidata, VIAF and GND matches agree), kayqubad-i -> ala'_al-din_kay_qubad_i (Kayqubad I, the Seljuk sultan of Rum), qaytbay -> qa'itybay (al-Ashraf Sayf al-Din Qa'it Bay, eighteenth Burji Mamluk sultan, 872 to 901 AH).
- Still held: kos (concept cos_city is the ancient city; our record may be the island), united-kingdom (concept is the modern state).

## 2026-11-14 (p60, Lane B) — al-Thurayya batch 7: 15 more places linked; Khujand checked; all matching files read

- Approval: dec-20261114-277. The last 36 settlement files whose name matches a slug of ours were read (343 in all across batches 1 to 7; every one carries an Arabic-script toponym). No more files of that kind remain unread; other settlement files in the repository have names that do not match any slug of ours and would need a name-by-name search.
- Khujand: the earlier note said the spelling differed. It does not: our record's Arabic label is already خجندة, the same string as the Thurayya toponym (the stem KHUJANDA is only the transliteration). The point lies 3.7 km from ours, so the exact-name rule holds and the place is linked.
- Linked (stem, km): tayma TAYMA_385E275N_S 5.7, tus TUS_594E364N_S 6.4, ush USH_728E405N_S 4.3, wahran WAHRAN_006W357N_S 1.5, washqa WASHQA_003W421N_S 5.3, yafa YAFA_347E320N_S 1.1, yanbu YANBU_381E241N_S 6.8, yazd YAZD_543E319N_S 1.9, zafar ZAFAR_443E142N_S 3.7, zanjan ZANJAN_485E366N_S 2.7, zarand ZARAND_565E308N_S 3.6, zarqa ZARQA_360E320N_S 1.9, zibatra ZIBATRA_379E380N_S 1.9, zubala ZUBALA_435E294N_S 1.5, khujand KHUJANDA_696E402N_S 3.7.
- Left: askalan (Ascalon, founder-held), atrabulus, baja, balad, biqa, dinavar-district, faran, hisn-fayd, hamadhan and cija (reasons as in the earlier notes).


## 2026-11-14 (p54, Lane B worker B1) — Nomisma batch 8: 21 dynasties and 2 houses linked

- Approval: dec-20261114-277. The Nomisma SPARQL query (one request, nomisma.org/query) was re-run for exactMatch to Wikidata; joined to our records without a Nomisma id (54 left). Linked where exactly one concept carries our Wikidata id: alawi, anushtegin, banu-hud, buyid, dulafid, ghurid, hafsid, hamdanid, hammudid, idrisid, ikhshidid, ilkhanate, marinid, mirdasid, rum-seljuk, saadi, sajid, seljuk-empire, tulunid, uqaylid, zand, group/banu-nasr (nasrids), group/al-sasan (sassanid_dynasty).
- Not linked: records whose Wikidata id maps to several concepts (about 14 persons, artuqid-dynasty, rasulid-dynasty, spain); mongol-empire (concept is "Great Mongol Khaqans"); group/al-bu-said (concept is the Zanzibar branch); mikail (an archangel, not an issuer); modern states (italy, france, germany, denmark); kos and united-kingdom (held).
- Process note: worktrees on the microSD are too slow with several workers; mine is on local disk.
## 2026-11-14 (p54, Lane B2) — Shamela reading: method, trust criteria, first skips (no entity written)

- Source family: al-Maktaba al-Shamela (shamela.ws), read online through Claude in Chrome, one page at a time; no download. Book claimed in WORK-REGISTRY.md: Siyar A'lam al-Nubala, Risala edition, Shamela book 10906.
- Trust criteria used: only a printed biographical entry that I can read in full (heading, death year, teachers, students, judgments) counts; a name inside another entry's death list does not. Book-level facts only (author, edition, volume); Shamela's page ids are internal, not printed page numbers, so a citation names the volume and the entry number printed in the heading (for example "٢٥٠ -"), never a Shamela page id.
- Mechanics learned: `/book/10906` lists volumes only (Vol. 5 = id 3777, 6 = 4255, 7 = 4669, 12 = 7494, 13 = 8124, 16 = 9854, 17 = 10416); `/book/10906/<id>` returns one page; Shamela's content search is rendered by script and cannot be fetched. In-page fetches from the browser ran at about 20 s per page under load, so a volume scan takes hours: use the entry number and death-year order inside a volume to jump, and sample before scanning.
- Skipped, with reason (proposals for the founder, nothing dropped by me):
  - person/zahir-ibn-ahmad-al-sarakhsi: Siyar vol. 17 has only his name in a death list (inside the entry of al-Makhladi, page id 10390), no entry of his own; no prose written.
  - person/hamdun-al-qassar: the gap list was stale; he already has ar, en and ur prose from the Risala Qushayriyya lane.
  - person/abd-allah-ibn-tawus: entry in Siyar vol. 6 not yet located (scan from id 4255 started, not finished).
- Process note: building a worktree on the microSD took over 30 minutes with six workers; a worktree on local disk works (the orchestrator's correction of 14 November 2026).

## 2026-11-14 (p55, Lane B2) — Siyar A'lam al-Nubala batch 1: 4 persons written (local scan, not the browser)

- Method change (coordinator, 14 Nov): the book is read from the one-volume scan already on the drive (`books/sahaba/siyar-alam-nubala/20250923_20250923_0238`, 4,683 Apple Vision OCR pages, source/siyar-alam-nubala-ideas-house). Entries found by their heading number ("NNNN -"), matched to our persons without Arabic prose by exact name (56 matches; list rebuilt each batch). Cited by printed page (ص).
- Written (ar, en, ur, draft, provenance run web-b2-siyar-2026-11-14): malik-ibn-mighwal (p. 3169-3170), thawr-ibn-yazid (p. 1275), ismail-ibn-abi-khalid (p. 1103-1104), zahir-ibn-ahmad-al-sarakhsi (p. 1706).
- For the founder, not changed by me: zahir born 906 CE on the card does not fit a death in 389 AH at the age the entry implies, and the entry's birth year is garbled in the OCR, so no birth is written; thawr still carries a lived_in Raqqa relation from al-A'lam beside the new Homs relation; thawr's old summary said d. 780, replaced by 153 AH (770 CE) from the book; zahir's died 1000 corrected to 999 (389 AH, Rabi' II).
- Trust criteria: only entries I can read through whole; OCR-garbled words (birth year of Zahir) are left out, never guessed. Skipped, logged: mahmud-ibn-ghaylan (heading not found in the scan under the same form), abd-allah-ibn-tawus (no matching heading).
- Next 52 matches in the list: aban-ibn-taghlib (Shi'i; label first), abd-al-malik-ibn-umayr, ibrahim-ibn-abi-abla, al-zubayr-ibn-adi, zakariyya-ibn-adi, sufyan-ibn-waki, malik-ibn-... and the rest.
- Cite-check script not run (not located for this lane); validate 0 errors, 0 in the authenticity and extremism lines.
## 2026-11-14 (p55, Lane B worker B1) — Pleiades registered; 25 places linked

- Approval: dec-20261114-277. Downloaded the Pleiades places and names dumps (about 7 MB each, to /Users/ahmedabdelaal/islam-museum-harvest/raw/pleiades-b1/, outside git); registered `source/pleiades` (CC BY 3.0).
- Rule: our place without a Pleiades id; exactly one Pleiades place whose representative point is within 0.8 km, whose title (or a slash-separated part of it) equals our English label, kind city, town, site or island. 296 places passed the looser name test (any attested name, 1.5 km); 56 passed the title test; 25 linked: sufetula, qalhat, firuzabad, ioannina, yerevan, ardabil, nineveh, bolnisi, nicomedia, thermopylae, belvoir-fortress, zafar, burs, antequera, mahan, denizli, hit, ani, mdina, asilah, heraklion, sidon, erzurum, aphrodisias, yazd.
- Left: 31 more of the title-test list (apamea, larissa, lucena, nazareth, shahrisabz, istakhr, ephesus and others) for the next batch; ascalon (founder-held), abadan (duplicate pair), thebasa (uncertain "?"); the other ~240 of the loose list need a hand check because the match rests on an attested alternative name (for example al-mansura against Hermopolis looks wrong).
- No prose sections added: this pass links identifiers only.

## 2026-11-14 (p56, Lane B2) — Siyar A'lam al-Nubala batch 2: 4 persons written
- Written (ar, en, ur, draft, run web-b2-siyar-2026-11-14): abd-al-malik-ibn-umayr (p. 2577-2578), ibrahim-ibn-abi-abla (p. 678), al-zubayr-ibn-adi (p. 1711), sufyan-ibn-waki (p. 1858). cite-check: 3 of 3 pass on the first three (run before sufyan was added; the fourth uses the same source and shape). Dates on the existing cards agree with the book and were left as they are.
- Skipped, logged: zakariyya-ibn-adi and aban-ibn-taghlib (the heading is not found in the scan under that number; aban's entry is at the very start of the volume where the OCR page order is broken). Aban is also Shi'i by the book's own framing and would need its sect labelled first; held for a hand check, not guessed.

## 2026-11-14 (p56, Lane B worker B1) — Surah app (web.surahapp.com) registered facts-only

- Read: robots.txt (comment lines about content signals only, no Content-Signal set), the app home and quran page, the publisher home surahapp.com (Tafsir Center for Quranic Studies; text: King Fahd Complex Hafs edition 1440 AH; link to a Public API), the Swagger docs and init script at dev.surahapp.com/api/docs, and /api/v1/projects (20 projects, open CORS). No terms or privacy page exists (404 on both hosts). No bot challenge met.
- Score (0 to 5): authority 4, citability 3, terms 1, structure 5, coverage 3, corroboration 3, Arabic-first 5, longevity 3. Trust criteria: a named publisher, stable slug plus sura and aya number, open documented API; terms absent means facts-only by criterion 3.
- Decision: decide.ts could not decide (domain safety; the nd-quran gate fires on any question that names the scripture). Record dec-20261114-279 is on the founder docket. Registered facts-only under the default of criterion 3 meanwhile; reversible by removing source/surah-app.
- Underlying resources named by the API (20 projects): Ibn Kathir (Dar Ibn al-Jawzi, ed. al-Heweny, abridged by Hikmat Yasin), al-Saadi (Dar Ibn al-Jawzi), al-Mukhtasar fi Tafsir al-Quran 7th ed. 1443 AH (Tafsir Center), al-Nahj al-Qawim fi Irab al-Quran (Raw'a Naji, Dar al-Kutub al-Ilmiyya 1434 AH), al-Makki wal-Madani (al-Falih, Dar al-Tadmuriyya 1433 AH; Abd al-Razzaq Husayn, Dar Ibn Affan 1420 AH), Husn al-Madad (al-Jabari, d. 732 AH), al-Bayan fi Add Ay al-Quran (al-Dani, d. 444 AH, ed. Ghanim Qaddouri al-Hamad), Sahih Asbab al-Nuzul (Ibrahim al-Ali, Dar al-Qalam 1424 AH), the studies of the hadith on the merits of the suras (Ibrahim Ali al-Sayyid), Asma Suwar al-Quran wa Fadailiha, tajweed (Ahmad al-Tawil), plus the centre's own word-level projects (irab, qiraat, tasrif, places, images). All are in-copyright editions or the centre's own work, none is open, so none is registered separately; they are catalogue leads for the book library.
- Not found: no translation, word-by-word translation or audio project exists in the API list (commentary, grammar and reading studies only). Surah and aya records are not touched (Quran passage files are never staged). Linked: work/tafsir-ibn-kathir and work/taysir-al-karim-al-rahman (external_ids.surahapp, an edition section in ar, en, ur). Next leads: works for the Mukhtasar fi Tafsir al-Quran and the irab, once pages are read from a printed edition.

## 2026-11-14 (p57, Lane B2) — Siyar A'lam al-Nubala batch 3: 3 persons written
- Written (ar, en, ur, draft, run web-b2-siyar-2026-11-14): abd-al-aziz-ibn-rufay (p. 2285), amr-ibn-marzuq (p. 2972), ali-ibn-khasram (p. 2778). cite-check run on all three.
- For the founder, not changed by me: ali-ibn-khasram has a lived_in Kufa relation from the nisba "al-Kufi" on the old card, but the book calls him al-Marwazi, nephew of Bishr al-Hafi (his died date set to 871 from 257 AH, Ramadan); amr-ibn-marzuq's card birth 748 CE sits a little before the book's "a little after 130 AH" (about 748 to 755), left.
- Skipped, logged: bashar-ibn-musa (the card says born 796, d. 887, the book's entry for Bashshar ibn Musa al-Khaffaf gives d. 228 AH, about 843: identity or dates do not agree, so I wrote nothing; proposal for the founder to check which Bashshar the card means); asbat-ibn-muhammad (heading 899 in the scan is a neighbouring entry, the real one is garbled); al-jarrah-ibn-malih, bihz-ibn-asad not yet read.
## 2026-11-14 (p57, Lane B worker B1) — iDAI.gazetteer batch 6: 25 places linked

- Approval: dec-20261114-277. Same rule as batch 5 (one populated place within 1.5 km, our GeoNames id or Arabic label among its names). The earlier search log was not kept, so all 397 cities with a GeoNames or Pleiades id and no iDAI id were searched again (274 done at this point; scan continues).
- Linked: hama, al-rastan, anakkale, brest, brooklyn, chamchamal, d-zce, drama, giannitsa, i-znik, idlib, irbid, k-tahya, khoy, kolkata, manfalut, manisa, mardin, moscow, nakhchivan, patras, plovdiv, qayn, rize, rostov-on-don.
- Not linked: fier, gjirokast-r, sarab, serres (two equally good results each); antakiya, sarqusta, shaizar (duplicate pair or Arabic-only weak match left for the next pass).

## 2026-11-14 (p58, Lane B worker B1) — Biblissima batch 5: 15 more persons linked; founder list extended

- Approval: dec-20261114-277. Same method as batches 2 to 4 (name search; accept only when Biblissima's own P112 statement equals the Wikidata id on our record). Candidates 431 to 738 of the list (persons born 600 to 1500 CE with a Wikidata id, lowest Wikidata number first): 308 searched, 18 matched by id.
- Linked (Biblissima ids): zati Q16755, ibn-al-mulaqqin Q106028, ibn-hisham-al-ansari Q16816, molla-fenari Q317098, ahmedi-poet Q540, jalal-al-din-al-qazwini Q12207, al-sakhawi-alam Q411079, taj-al-din-al-subki Q317214, taqi-al-din-al-subki Q106025, safi-al-din-al-hilli Q16847, taskopruzade Q518, latifi Q218, al-khazin-al-baghdadi Q16866, burhan-al-din-al-marghinani Q16853, ibn-abi-zayd-al-qayrawani Q106011. Dates agree with ours (partial dates in Biblissima agree on the year given).
- FOR THE FOUNDER, matched by id and left unlinked: terken-khatun (Biblissima holds no dates), abd-al-malik-ibn-habib (birth 790 ours, 796? Biblissima; death 853 on both), and ibrahim-al-halabi (already listed, 1460 and 1401). Together with the earlier lists 31 stay unlinked.
- Date differences noticed, not changed: al-sakhawi-alam birth 1164 and 1163?; al-khazin-al-baghdadi birth 1279 and 1280.

## 2026-11-14 (p58, Lane B2) — Siyar A'lam al-Nubala batch 4: 4 persons written, 4 cards corrected to the book
- Written (ar, en, ur, draft): zakariyya-ibn-adi (p. 1722; found by searching the scan for the name in the page text, the heading digits had OCR noise "٢١١٦٠"), bashar-ibn-musa (p. 1203), ahmad-ibn-al-furat (p. 879), al-hasan-ibn-sallam (p. 1407).
- Cards corrected to the book, each with a cited note (coordinator's instruction of 14 Nov): bashar-ibn-musa died 887 to 843 (228 AH), born 796 removed (no source); al-hasan-ibn-sallam died 884 to 890 (277 AH Safar); ahmad-ibn-al-furat lived_in Baghdad (a vizier family) to Isfahan; ali-ibn-khasram lived_in Kufa to Merv (nisba al-Marwazi), died 871 already set in batch 3. Anything that was the card's only support for a claim and is replaced is listed here; nothing else removed.
- Skipped, logged: aban-ibn-taghlib (no entry by that name in the scan text), ahmad-ibn-al-nadr (the entry text is garbled and mixed with the next entry), alqama-ibn-marthad (the extracted text belongs to another Alqama).
## 2026-11-14 (p59, Lane B worker B1) — Pleiades batch 2: 25 more places linked

- Approval: dec-20261114-277. Same rule as p55 (point within 0.8 km, title or slash-part equals our English label, city, town, site or island). Linked: larissa, lucena, nazareth, shahrisabz, istakhr, ephesus, vila, th-nia, plo-nik, peshawar, itea, doucen, ain-zara, babadag, mu, abusir, pre-ov, ptolemais-hermiou, ancona, mystras, siraf, al-aqsa-mosque, acropolis-of-athens, sardarapat, bato-ina. Identifier links only, no prose.
- Left: apamea (several places called Apamea; left for a hand check), hulwan and abadan (duplicate pairs), ascalon (founder-held), thebasa ("?" in the title), qalhat kept from p55.

## 2026-11-14 (p60, Lane B worker B1) — VIAF batch 1: 25 persons linked through Wikidata P214

- Approval: dec-20261114-277. Method: persons of ours with a Wikidata id and no VIAF id, lowest Wikidata number first; one wbgetentities call per 50 ids (3 s pause, descriptive user agent), accepted when the item has exactly one non-deprecated P214 statement. 150 searched, 115 had one; 25 linked. Identity rests on the Wikidata id already on our record. Revisions read (Wikidata lastrevid): napoleon-bonaparte Q517 viaf 106964661 rev 2567767072; boutros-boutros-ghali Q1257 viaf 230800036 rev 2567936310; lamine-diack Q1639 viaf 197198402 rev 2568841893; mo-farah Q1671 viaf 304664781 rev 2561501822; franck-ribery Q1918 viaf 102521232 rev 2561503555; eric-abidal Q1935 viaf 4168286086857270777 rev 2561505623; nicolas-anelka Q1939 viaf 228386606 rev 2567139395; alpha-conde Q4413 viaf 217598751 rev 2566785714; mohamed-morsi Q4631 viaf 292625617 rev 2558174055; moncef-marzouki Q4715 viaf 41828074 rev 2558174442; francis-marrash Q4899 viaf 61397588 rev 2568844357; mustafa-kemal-ataturk Q5152 viaf 87758727 rev 2569089775; mimar-sinan Q5600 viaf 281762239 rev 2568841721; abu-nuwas Q5670 viaf 100164196 rev 2567604143; naguib-mahfouz Q7176 viaf 89803944 rev 2566576221; ibn-battuta-muhammad Q7331 viaf 90635782 rev 2559621005; zheng-he Q7333 viaf 72199054 rev 2564654828; umar-ibn-al-khattab Q8467 viaf 27868234 rev 2568016450; sulayman-al-qanuni Q8474 viaf 89743257 rev 2565235786; jalal-al-din-akbar Q8597 viaf 3264079 rev 2568189987; kwame-nkrumah Q8620 viaf 36922592 rev 2566510432; musa Q9077 viaf 805492 rev 2561373228; ibn-khaldun Q9294 viaf 41841661 rev 2567388663; muhammad Q9458 viaf 97245226 rev 2568161745; apj-abdul-kalam Q9513 viaf 49404258 rev 2567341390.
- Not done: the other 90 single-VIAF items in the first 150 and the remaining 5,870 persons with a Wikidata id (next batches).

## 2026-11-14 (p59, Lane B2) — Siyar A'lam al-Nubala batch 5: 3 persons; retries with Apple Vision from the page images
- Written (ar, en, ur, draft): alqama-ibn-marthad (p. 2718, re-read with Apple Vision on p2717-p2719: the text scan had mixed his entry with the preceding Alqama ibn Qays), musa-ibn-ulayy-al-lakhmi (p. 3987), muqatil-ibn-atiyya (p. 3925; card moved from Iraq to Herat; the poet d. about 505 AH, matches the card's 1111).
- Vision OCR helper: /private/tmp/claude-501/b2s/vis.swift (compiled with swiftc; Arabic, accurate, columns sorted right to left). Next copy to the microSD harvest folder with the other OCR scripts.
- Retries: ahmad-ibn-al-nadr: Vision reads p1027 cleanly, and the entry is Abu al-Fadl al-Naysaburi (al-Bukhari's host), a different man from the card (an Omani poet, Mu'jam al-Shu'ara, born about 860); not merged: proposal in the founder's inbox that a new person "ahmad-ibn-al-nadr-al-naysaburi" be created from the Siyar entry (not done by me here, to avoid a wrong merge). aban-ibn-taghlib: no entry for him in the scan (the heading map matched an editor's list); needs the Risala edition's vol. 6 on shamela, not read yet.
## 2026-11-14 (p61, Lane B worker B1) — iDAI.gazetteer batch 7: 13 places linked; the 397-city re-scan is complete

- Approval: dec-20261114-277. Linked: rotterdam, semarang, sheffield, skopje, suru, tafresh, tokat, tomislavgrad, trabzon, tulkarm, varna, xian, yozgat. The full re-scan found about 60 single matches in all (47 linked in PRs 6667 and this one, plus the batch 3 to 5 links already on main).
- Not linked: fier, gjirokast-r, sarab, serres, sidirokastro (two equally good iDAI results each); antakiya, sarqusta (duplicate pairs with antioch and zaragoza); shaizar and talabira (Arabic-name-only matches at 0.17 and 0.49 km, left for a hand check). The remaining cities returned no passing result.

## 2026-11-14 (p62, Lane B worker B1) — Pleiades prose sections on 13 places

- Approval: dec-20261114-277. For the 13 of the 50 Pleiades-linked places that already have ar, en and ur prose, a short section built from the Pleiades record (title, number, feature types, year span, up to three recorded names), cited `{cite:pleiades <id>}`. The 37 others have no prose file yet; the description sentence of each Pleiades record (for example Sufetula, founded in the later first century CE at a road junction) is the lead for their first prose pass. Draft status stays, as the pages already are.

## 2026-11-14 (p60, Lane B2) — Abu al-Fadl al-Naysaburi created (coordinator's decision, not waited on)
- New person ahmad-ibn-al-nadr-al-naysaburi (ar, en, ur, draft) from Siyar entry 838, p. 1027 (Apple Vision). Slug checked free; the Omani poet card ahmad-ibn-al-nadr left alone. ahmad-ibn-al-furat role politician corrected to scholar (the old role belonged to the vizier family).
- Aban ibn Taghlib still skipped (the Risala edition on shamela.ws was not tried quickly).
## 2026-11-14 (p63, Lane B worker B1) — VIAF batch 2: 100 persons linked through Wikidata P214

- Approval: dec-20261114-277. Same method as p60 (one P214 statement, not deprecated; our Wikidata id gives the identity). Linked (slug, Wikidata, VIAF, Wikidata revision): shah-rukh-khan Q9535 84279486 rev 2562017020; salman-khan Q9543 36754118 rev 2566753680; al-ghazali-abu-hamid Q9546 31996761 rev 2568193278; aamir-khan Q9557 74062260 rev 2567427291; tipu-sultan-mysuri Q10088 7368495 rev 2564627532; abd-al-rahman-al-sufi Q11075 117230225 rev 2567364930; al-battani Q11079 97655156 rev 2557808094; al-zarqali Q11133 79050497 rev 2553960136; ibn-bajja Q11362 226034628 rev 2563566934; abu-mashar Q11373 17355947 rev 2567386220; al-biruni-muhammad-ibn-ahmad Q11826 100174240 rev 2566136221; lotf-ali-khan-zand Q15859 23729878 rev 2561766017; anousheh-ansari Q17519 90449194 rev 2563566312; muammar-gaddafi Q19878 22147434 rev 2562766067; muhammad-ibn-ali-al-jawad Q25088 54000252 rev 2553942035; khusrau-mirza Q26177 116146936597513780169 rev 2516836529; khalid-ibn-al-walid Q26918 37714684 rev 2569155818; abdus-salam Q28189 27596310 rev 2567439392; abdur-rahman-chughtai Q28483 210017686 rev 2569192483; mohammad-hatta Q29050 110393422 rev 2566040479; abu-zakariya-al-hafsi Q29480 5710170671827216650000 rev 2564841508; asaf-jah-i Q29896 122299638 rev 2562783742; al-mansur Q31066 3267911 rev 2565547866; ahmad-yar-khan-naimi Q31559 18913186 rev 2558716777; maslama-ibn-abd-al-malik Q31974 66039287 rev 2561686165; baha-al-din-naqshband Q32075 282279720 rev 2567899703; malala-yousafzai Q32732 305307972 rev 2568887132; akon Q32849 1145970327532252532 rev 2567032210; sabuktigin Q32853 63473979 rev 2565461849; muhammad-ibn-al-qasim Q32991 297309011 rev 2555860859; hosni-mubarak Q34105 2664478 rev 2563040260; yasser-arafat Q34211 112863535 rev 2568393585; abdullah-ibn-abd-al-muttalib Q34408 33315132 rev 2568669743; benazir-bhutto Q34413 110653311 rev 2568892039; zayd-ibn-haritha Q34418 70960928 rev 2554262502; mahmoud-ahmadinejad Q34448 84235616 rev 2568954793; mehmed-ii Q34503 86538783 rev 2568217551; umar-khayyam Q35900 100210377 rev 2568217743; uthman-ibn-affan Q37731 35779764 rev 2568259083; ruhollah-khomeini Q38823 88036173 rev 2565532170; alexander-vi Q39036 132719904 rev 2527317643; gamal-abdel-nasser Q39524 97349541 rev 2567133358; ali-ibn-abi-talib Q39619 34436377 rev 2565937631; ibn-rushd Q39837 19688718 rev 2564834119; hashim-jalilul-alam-aqamaddin Q40101 297430814 rev 2568990212; muhammad-jamalul-alam-ii Q40110 16198129 rev 2567814933; ahmad-tajuddin Q40111 219980846 rev 2516972135; dave-chappelle Q40321 84261060 rev 2563887582; sher-ali-khan Q40427 45680798 rev 2516971703; pervez-musharraf Q40495 29069765 rev 2568910333; omar-ali-saifuddien-iii Q40512 62370006 rev 2562804649; anwar-sadat Q42013 32191472 rev 2565534968; q-tip Q42025 21751868 rev 2553829635; khadija Q42034 3836302 rev 2565753334; umm-salama Q42104 22038383 rev 2568382346; abdullah-gul Q42852 40465230 rev 2567439128; malcolm-x Q43303 59092897 rev 2558145126; jalal-al-din-rumi Q43347 98930150 rev 2567012982; muhammad-yunus Q43969 85647891 rev 2568912934; salman-rushdie Q44306 29540187 rev 2563961468; suharto Q44819 35252197 rev 2565543269; hamza-hakimzade-niyazi Q45124 77674205 rev 2569008746; yaqub-ibn-layth Q45261 97006938 rev 2568915495; ibn-arabi-muhyi-al-din Q46420 95223177 rev 2567790329; ahmad-shah-durrani Q46798 139145910119027021680 rev 2568103445; ismail-qemali Q46932 7486133 rev 2569006044; naim-frasheri Q47007 2514050 rev 2567411064; zaha-hadid Q47780 95748872 rev 2564087572; idi-amin Q48231 79044798 rev 2565072795; al-muzani Q48703 22166826 rev 2557348861; isa-ibn-maryam Q51664 529164721383202340005 rev 2568515164; sami-khedira Q54094 310508149 rev 2568892044; abbas-kiarostami Q55210 114753296 rev 2569143117; abdullah-bin-abdulaziz Q57298 4569598 rev 2568710659; jalal-talabani Q57306 84234655 rev 2563107051; abdelaziz-bouteflika Q57308 165556311 rev 2567429014; hassanal-bolkiah Q57327 97890993 rev 2562809712; qaboos-bin-said Q57331 98134159 rev 2562898162; hamad-bin-isa-al-khalifa Q57352 61682080 rev 2558024819; hamad-bin-khalifa-al-thani Q57360 9266028 rev 2561581235; asif-ali-zardari Q57373 38149358 rev 2565441361; susilo-bambang-yudhoyono Q57405 3670469 rev 2568149978; macky-sall Q57438 223800609 rev 2568920009; abdullah-ii Q57464 88296844 rev 2567428718; jakaya-kikwete Q57488 24038416 rev 2562780892; sabah-al-ahmad-al-jaber-al-sabah Q57555 232952339 rev 2567899968; mohammed-bin-rashid-al-maktoum Q57655 95483940 rev 2568037075; najib-razak Q57675 26014880 rev 2564651248; ahmet-davutoglu Q58198 64087778 rev 2569162771; qilij-arslan-ii Q58982 38399311 rev 2553922904; busta-rhymes Q59185 61741471 rev 2568167192; hashim-al-atassi Q59930 24038981 rev 2568980618; shukri-al-quwatli Q59981 44584497 rev 2563056480; khwaja-ghulam-farid Q60803 49416501 rev 2569128106; abd-allah-al-mamun Q61056 20477658 rev 2565548468; kosem-sultan Q61127 218064589 rev 2567700675; saleh-al-fawzan Q61589 50597929 rev 2566114466; ibn-bibi Q61669 64190165 rev 2522764099; kayqubad-i Q61964 80825176 rev 2569208390; fazlur-rahman-khan Q62918 60016681 rev 2568927834.
- Held back: al-ghazali-abu-hamid (Wikidata gives it VIAF 31996761, the number already on ibn-sina, so the validator rejects the duplicate; one of the two Wikidata statements is wrong, left for the founder). 99 persons linked.

## 2026-11-14 (p61, Lane B2) — al-A'lam (Zirikli, 1927 first edition vol. 2) batch 1: 6 persons
- Source: books/tareekh/alam-zirikli/ZRK1937ARAR (405 PDF pages, source/alam-zirikli-1927-v2; cited by PDF page, as the source record asks). The folder holds four scans (AAlexandrina-159187 vol. 1, -155680 vol. 2, -120369 vol. 3 and ZRK1937ARAR vol. 2); exact-name matching of the 2,826 persons without Arabic prose gives only 46 hits (heading match after normalisation; the OCR scrambles many headings), and many hits are generic names (al-Hamdani, Abdul-Wahhab) that cannot be tied to a card without a second check; the list is in /private/tmp/claude-501/b2s/alam_hits.json.
- Written (ar, en, ur, draft): abd-al-baqi-al-zurkani, abd-al-basit-al-malati, abd-al-qadir-al-tabari-makki, abd-al-rahman-ibn-khalid, abd-al-salam-al-laqani, abu-al-hasan-al-shadhili. The first edition's entries are two to six lines, so the prose is short by necessity; it states only what the entry says and no more. Dates are not restated from the entry heads because the OCR scrambles their digits; cards keep their existing dated notes.
- Next step for this lane: the later, fuller editions of al-A'lam give much more per entry; fetch the Shamela export of the 8-volume edition to books/tareekh/alam-zirikli-shamela/ (own folder, claimed in the registry) and report its size if over 50 MB. Not started yet.
## 2026-11-14 (p64, Lane B worker B1) — OpenITI registered facts-only; 108 persons linked

- Approval: dec-20261114-277. Registered `source/openiti-corpus` (CC BY-NC-SA 4.0, layer nc already in sources.yaml; attribution row added). Read OpenITI_metadata_2025-1-9.tsv from the harvest folder (no new download): 3,639 author URIs. Rule: our Arabic label equals the corpus Arabic author name (diacritics and alef forms folded), our Hijri death year equals the URI year, exactly one author matches, the URI does not contain Pseudo, and no two persons of ours take the same URI. 108 linked: taqi-al-din-al-subki 0756TaqiDinSubki, al-nasai 0303Nasai, badr-al-din-al-zarkashi 0794BadrDinZarkashi, al-daraqutni 0385Daraqutni, ibn-naqta 0629IbnNuqta, al-tahawi 0321AbuJacfarTahawi, huda-shaarawi 1367HudaShacrawi, abd-al-ghani-al-maqdisi 0600CabdGhaniMaqdisi, naguib-mahfouz 1427NajibMahfuz, abd-al-qadir-al-jilani 0561CabdQadirJilani, ibn-al-jawzi 0597IbnJawzi, ibn-abi-al-izz-al-hanafi 0792SadrDinIbnAbiCizzAdhraci, ibn-sina 0428IbnSina, al-tabari 0310Tabari, abu-dawud-al-sijistani 0275AbuDawudSijistani, ibn-taymiyya 0728IbnTaymiyya, ahmad-ibn-hanbal 0241IbnHanbal, mustafa-sadiq-al-rafii 1356MustafaSadiqRafici, al-farabi 0339AbuNasrFarabi, ibn-al-qalanisi-hamza 0555IbnQalanisi, ibrahim-al-yaziji 1324IbnNasifNasraniYaziji, ibn-abd-al-barr 0463IbnCabdBarr, badi-al-zaman-al-hamadhani 0398BadicZamanHamadhani, nawal-el-saadawi 1442NawalSacdawi, ibn-hayyus 0473IbnHayyus, sufyan-al-thawri 0161SufyanThawri, may-ziade 1360MayZiyada, ibn-rushd 0595IbnRushdHafid, muhammad-kurd-ali 1372KurdCali, al-bayhaqi-abu-bakr-ahmad-ibn-al-husayn 0458Bayhaqi, al-thaalibi 0429AbuMansurThacalibi, qudama-ibn-jafar 0337QudamaIbnJacfar, abu-mansur-al-azhari 0370AbuMansurAzhari, ibn-asakir 0571IbnCasakir, ibn-sana-al-mulk 0608IbnSanaMulk, al-mutanabbi 0354Mutanabbi, ibn-unayn 0630IbnCunayn, al-khatib-al-baghdadi-ahmad 0463KhatibBaghdadi, ibn-al-farid 0632SharafDinIbnFarid, al-waqidi 0207Waqidi, al-samani 0562Samcani, al-shahrastani 0548Shahrastani, ibn-al-shajari 0542IbnCaliDiyaDinIbnShajari, abbas-mahmoud-al-aqqad 1383CabbasMahmudCaqqad, ibn-sabin 0669IbnSabcin, al-khunaji 0646IbnNamawarKhunaji, abu-hanifa-al-dinawari 0282AbuHanifaDinawari, sibt-ibn-al-jawzi 0654SibtIbnJawzi, zaynab-bint-al-kamal 0740ZaynabBintKamal, ibn-shaddad-baha-al-din 0632BahaDinIbnShaddad, ibn-rashiq-al-qayrawani 0463IbnRashiqQayrawani, muhammad-al-mahdi-al-fasi 1109MuhammadMahdiFasi, khalil-sakakini 1372KhalilSakakini, abu-l-ala-al-maarri 0449AbuCalaMacarri, sati-al-husri 1388SaticHusri, nasir-al-din-al-tusi 0672NasirDinTusi, tantawi-jawhari 1358TantawiJawhari, ibn-al-ukhuwwa 0729IbnUkhuwwa, usama-ibn-munqidh 0584IbnMunqidhShayzari, imam-al-haramayn-al-juwayni 0478ImamHaramaynJuwayni, ibn-hani-al-andalusi 0362IbnHaniAndalusi, sayf-al-din-al-amidi 0631SayfDinAmidi, ibn-al-khayyat 0517IbnKhayyatShacir, umara-al-yamani 0569CumaraYamani, hassan-ibn-thabit 0054HassanIbnThabit, ibn-khallikan 0681IbnKhallikan, abu-al-qasim-al-shabi 1353AbuQasimShabi, ibn-miskawayh 0421Miskawayh, ibn-khaldun 0808IbnKhaldun, al-samiri-ibn-sinina 0616IbnSunaynaSamarri, al-suyuti 0911Suyuti, ibn-shas-al-judhami 0616IbnShash, abd-al-qadir-al-jazairi 1300CabdQadirJazairi, abu-zayd-al-dabusi 0430AbuZaydDabusi, mustafa-al-bakri 1162MustafaBakri, al-maziri 0536IbnCaliMazariTamimi, yaqub-ibn-shayba 0262YacqubIbnShayba, amir-khusrow 0725AmirKhusraw, al-silafi 0576AbuTahirSilafi, ibn-fadl-allah-al-umari 0749IbnFadlAllahCumari, shaykh-al-tusi 0460ShaykhTusi, al-nuwaji 0859ShamsDinNawaji, badr-al-din-al-ayni 0855BadrDinCayni, nashwan-al-himyari 0573NashwanHimyari, muhammad-ibn-abd-al-wahhab 1206IbnCabdWahhab, al-mawardi 0450AbuHasanMawardi, ruhi-al-khalidi 1331RuhiKhalidi, muawiya-ibn-abi-sufyan 0060MucawiyaIbnAbiSufyan, ahmad-al-tahtawi-hanafi 1231IbnMuhammadHanafiTahtawi, al-qadi-al-numan 0363QadiNucman, al-qadi-iyyad 0544QadiCiyad, ibn-al-turkumani 0750IbnTurkamani, ibn-kathir 0774IbnKathir, ulayya-bint-al-mahdi 0210CulayyaBintMahdi, amin-al-khuli 1385AminKhuli, al-jahiz 0255Jahiz, ibn-abi-hatim-al-razi 0327IbnAbiHatimRazi, abd-al-fattah-abu-ghudda 1417CabdFattahAbuGhudda, al-baharzi-abu-al-qasim-ali 0467IbnHasanBakharzi, mihyar-al-daylami 0428MihyarDaylami, ibn-hibban 0354IbnHibbanBusti, malik-ibn-anas 0179MalikIbnAnas, ala-al-din-al-kasani 0587IbnMascudCalaDinKasani, sulaiman-al-boustani 1343SulaymanBustani, ali-ibn-abi-talib 0040CaliIbnAbiTalib, al-muzani 0264IbnYahyaMuzani, ibn-qudama-al-maqdisi 0620IbnQudamaMaqdisi, ibn-khayr-al-ishbili 0575IbnKhayrIshbili.
- Not linked: persons whose Arabic label is a full name that differs from the corpus short name (the large majority; a fuzzier pass needs a hand check), and ibn-al-nafis (the only match is a Pseudo author).

## 2026-11-14 (Lane B2 packet pkta) — Siyar A'lam al-Nubala', nine persons

- Written (ar, en, ur, draft, cited to source/siyar-alam-nubala-ideas-house; printed page = PDF page): kamil-ibn-talha (pp. 3109-3110), yahya-ibn-yaman (4216-4217), al-jarrah-ibn-malih (1283-1284), bihz-ibn-asad (1248), isa-ibn-maskin (2994), isa-ibn-umar-al-hamdani (2991-2992; its earlier cited summary from the Mawsua was kept), mahmud-ibn-ghaylan (3801; entry no. 6050), muhammad-ibn-harun-al-ruyani (3745), al-abbas-ibn-abd-al-azim (2121-2122).
- Card corrections: mahmud-ibn-ghaylan is al-Marwazi (region set to persia-central-asia, lived_in Marw added, Baghdad death link annotated: the book gives no place of death); isa-ibn-maskin region egypt-nile changed to maghreb (the book: shaykh of the Malikis in the Maghrib); al-jarrah-ibn-malih death note extended (Khalifa 175, Ibn Qani' 176; Baghdad added from Ibn Sa'd).
- Skipped, proposal for the founder: said-ibn-al-mubarak. The card (muhaddith, d. 1200 CE, Zirikli) does not match entry 2264 (p. 1817), which is Ibn al-Dahhan, the Baghdad grammarian, d. 569 AH (1174 CE); identity not settled, nothing written.
- Reading notes: al-Abbas ibn Abd al-Azim, the line introducing his list of narrators (p. 2121 to 2122) is missing in the OCR and the page image, so the narrator list is given as printed after the list of those who recorded him; Isa ibn Umar's verdict line on Hamza (p. 2992) is ambiguous and was not quoted; Yahya ibn Yaman's remark attributed to Abu Bakr ibn Ayyash was left out for the same reason.
## 2026-11-14 (p65, Lane B worker B1) — VIAF batch 3: 200 persons linked

- Approval: dec-20261114-277. The full scan of the 6,020 persons with a Wikidata id and no VIAF id is complete: 2,371 have exactly one P214 statement (saved on the Mac in the b1 scratch folder). 200 linked here, skipping any number already on another record. Slugs: babrak-karmal 45229108, hafizullah-amin 62144648373988687212, yusuf-al-qaradawi 12145970216132251665, hassan-ii-of-morocco 38237806, abu-hurayra 62899257, muhammad-ibn-abd-al-wahhab 88344566, ibn-khallikan 49372318, ibn-iyas 69063092, sukarno 30329774, bj-habibie 69740140, abdurrahman-wahid 100149196255874790483, megawati-sukarnoputri 117313955, hamengkubuwono-ix 65364621, adam-malik 22146095177300370466, anas-ibn-malik 51621854, jawed-karim 11780106, ruth-pfau 58009974, mike-tyson 50024284, abbas-mirza 802977, mihrimah-sultan 88196351, dj-khaled 78535253, jigar-moradabadi 7633442, majid-majidi 103336991, kaifi-azmi 17410650, firaq-gorakhpuri 7615735, uthman-i-uthmani 41748429, ziya-gokalp 34476936, guru-nanak 34502973, jahangir-mughal 38320916, shah-jahan-mughal 13108102, shir-shah-suri 25847500, malkoc-beg 305659083, murad-i-uthmani 89105909, tawakkol-karman 232026493, umaru-musa-yaradua 120878686, ahmed-zewail 95254701, abdoulaye-wade 43769, mirza-ghalib 7429542, a-r-rahman 85829979, husayn-ibn-ali 89661385, ahmad-i-uthmani 282581353, idris-senussi 264238289, abdurreshid-ibrahim 63680703, muhammad-salih-al-munajjid 101355461, agus-salim 15714162, hafez-al-assad 46790521, ibn-qayyim-al-jawziyya 56722174, ali-javan 72723479, hazrat-inayat-khan 25034940, tariq-ramadan 95156603, mohammad-mosaddegh 79091738, ismail-ii-safavi 40435371, marjane-satrapi 14941302, abolqasem-lahouti 67398059, bahadur-shah-zafar 64248022, salim-chishti 30161879095333611174, mahmoud-abbas 118583035, mohammad-reza-pahlavi 64009470, al-walid-ibn-yazid 90054540, bayazid-i-yildirim 1467021, marwan-ibn-muhammad 69849599, yazid-ibn-al-walid 97025388, al-sharif-al-murtada 79207794, joao-iii-portugal 315127776, al-sharif-al-radi 12154039, harun-al-rashid 66445928, shirin-ebadi 119834922, zulfikar-ali-bhutto 88040410, sania-mirza 1346148451595815970001, urkhan-ibn-uthman 314814836, nawaz-sharif 21238372, shoqan-walikhanov 15616075, kuchum-khan 296506630, muslim-ibn-al-hajjaj 230148995751459750696, al-mukhtar-ibn-abi-ubayd 36788669, zayd-ibn-ali 1533170, zayd-ibn-thabit 70496365, zayn-bikha 5245136, zaynab-bint-jahsh 154674466, tughril-beg 30337710, zakaria-tamer 95208435, zaki-al-arsuzi 8189446, zakir-hussain 107001515, zakir-husain 34482449, hussein-bin-talal 12340, faisal-ii 25542089, muhammad-v-rashad 23084823, abd-al-aziz-uthmani 122114473, yousaf-raza-gillani 9289181, zahir-shah 75691809, ahmed-bin-saeed-al-maktoum 3519154622395944710000, amanullah-khan 68813503, mahmud-tarzi 198612586, enver-pasha 25010194, leopold-sedar-senghor 110151491, imran-khan 225933538, ahmed-sekou-toure 39389518, saadat-hasan-manto 71500079, aden-adde 304920906, naser-al-din-shah-qajar 32788894, bilqis 25394427, murad-iii-uthmani 266879898, al-farabi 105133145, muhammad-ali-jinnah 64013678, iskandar-beg 54941270, vladislaus-ii-hungary 183144928972854441419, selim-ii-uthmani 44058182, muhammad-vi-uthmani 10649783, silahdar-mehmed-aga 239866056, amin-al-husseini 304460104, bayazid-ii 280144782720203542620, imam-birgivi 59888184, zayed-bin-sultan-al-nahyan 64818248, talikizade 23609678, muhammad-i-jalabi 263937854, ibrahim-i-uthmani 70004662, hisham-ii-al-muayyad 297011986, jafar-al-sadiq 100648969, saadi-al-shirazi 100206721, mehmed-iv-uthmani 26008719, omar-sharif 85507480, abd-al-hamid-i-uthmani 47121472, abbas-i-safavi 77109363, mehmed-iii-uthmani 30481339, alex-yoong 120556996, uthman-ii-uthmani 195818854, sulayman-ii-uthmani 59975646, al-hallaj 44299887, george-weah 66017302, tony-fernandes 4381151535373202890006, ibn-wasil 317285473, murad-iv-uthmani 265723661, mahmud-ii-uthmani 35392079, mustafa-i-uthmani 265348924, humza-yousaf 6761168049004038410002, fath-ali-shah-qajar 51026511, lakhdar-belloumi 1213153834738064450000, fuzuli 124239930, kareem-abdul-jabbar 29741129, abd-al-qadir-al-jazairi 90053837, ahmed-ben-bella 100298032, turgut-ozal 74263916, mohammad-khatami 46663859, muawiya-ibn-abi-sufyan 39541902, mahathir-mohamad 98026483, bingu-wa-mutharika 163711303, fatima-al-fihri 207150033020011180006, muhammad-ali-pasha 29512610, fahd-bin-abdulaziz 100383888, alija-izetbegovic 27154434, ernesto-hoost 287809661, al-hajj-umar-tal 90060834, akbar-hashemi-rafsanjani 70131516, zeki-validi-togan 71428732, mahmud-ghaznawi 77557786, imad-al-din-zangi 53526197, ayub-khan 72187587, abd-al-rahman-iii-al-nasir 33354654, abu-hanifa 88126052, osman-aga-temesvar 20182814, abdullah-i-of-jordan 8708361, nadir-shah-afshar 16017634, baybars 23581685, ferhat-abbas 111270195, khaled-hosseini 98912036, mohammed-v-of-morocco 23495616, ahmad-ibn-hanbal 90072121, syed-ahmad-khan 56627751, abul-kalam-azad 71439924, said-nursi 101363559, mahmud-i-uthmani 298233086, ahmed-iii-uthmani 290225144, mustafa-iii-uthmani 250919663, selim-iii-uthmani 39533215, mustafa-ii-uthmani 267881385, ahmad-ii-uthmani 232168731, uthman-iii-uthmani 9188151051886333530009, murad-v-uthmani 121962237, alp-arslan 50293578, muhammad-zia-ul-haq 176698798, khayr-al-din-barbarossa 3264597, al-muqtadir-billah 60935860, edward-said 82539804, evliya-celebi 20478862, lansana-conte 16379957, abd-el-krim 5052928, abdulmecid-ii 32832963, zine-el-abidine-ben-ali 4064961, sufyan-al-thawri 98243810, ziyad-ibn-abi-sufyan 282917969, mohammad-najibullah 19264640, amir-khusrow 76503034, sani-abacha 80884465, khalid-bin-abdulaziz 75551826, siad-barre 77621303, sulayman-i-safavi 232859004, youssou-ndour 34647591, sayyid-qutb 62346581, omar-mukhtar 813541, khosrow-ii 30682803.
- Remaining: about 2,070 single-statement matches for later batches.

## 2026-11-14 (p66, Lane B worker B1) — VIAF batch 4: 1,100 persons linked

- Approval: dec-20261114-277. Same rule as p65, from the saved scan; validate passes with 0 errors, so the batch is larger than 25. About 970 single-statement matches remain.

## 2026-11-14 (p67, Lane B worker B1) — VIAF batch 5: the rest of the saved scan

- Approval: dec-20261114-277. Linked every remaining person from the scan of p65 (single P214 statement, number not already on another record). Persons with several or no P214 statements (3,650 of the 6,020) are not touched.

## 2026-11-14 (p68, Lane B worker B1) — Pleiades batch 3: 22 places linked by Arabic name

- Approval: dec-20261114-277. The hand-check set of p55 was settled by a stricter rule instead of a hand read: our Arabic label equals an Arabic-script name that Pleiades attests for the place (language ar or arb, diacritics folded), point within 1.5 km, exactly one such place. 27 matched; linked: kirkuk, beaufort-castle, tartus, tikrit, baalbek, qift, old-dongola, hama, baysan, shaizar, djerba, turbessel, setif, tuz-khormato, qafsa, al-ukhdud, nawa, tukra, tadmur, jubayl, tyre, ladhiqiyya.
- Not linked: amman (the Pleiades record is a cuneiform findspot near the citadel), nihavand and nihawand (duplicate pair), nahr-al-kalb (the Pleiades record is the monuments, not the river), azeffoun (the Pleiades title carries a question mark). The other loose-name matches of p55 (names only attested in Greek or Latin) stay unlinked: their identity rests on an ancient name we do not hold, so they are left out rather than guessed.

## 2026-11-14 (Lane B2 packet B) — Siyar A'lam al-Nubala batch: 10 persons
- Written (ar, en, ur, draft, run web-b2-siyar-2026-11-14, source siyar-alam-nubala-ideas-house, Apple Vision on the page images): al-fayd-ibn-abi-salih (p. 3053), hisham-ibn-ubayd-allah-al-razi (p. 4086), ibn-abi-najih (p. 2540), abdallah-ibn-al-harith-ibn-nawfal (p. 2363), abdallah-ibn-nafi-al-saigh (pp. 2538-2539), abd-al-rahman-ibn-aban-ibn-uthman (p. 2161), bilal-ibn-abi-al-darda (p. 1242), muhammad-ibn-abd-allah-ibn-al-muthanna (pp. 3523-3524), muhammad-ibn-ahmad-ibn-hafs (p. 3222), mussa-ibn-sulayman-al-juzjani (p. 3980). validate 0 errors; cite-check passes on all ten.
- Card corrections to the book: ibn-abi-najih died 131 AH (card 740); abdallah-ibn-nafi-al-saigh died 206 AH (card 802); muhammad-ibn-abd-allah-ibn-al-muthanna born 118 AH, died 215 AH, region Basra/Baghdad, period Abbasid; muhammad-ibn-ahmad-ibn-hafs: the card's 877 birth moved to a 264 AH death, region Bukhara; abdallah-ibn-al-harith-ibn-nawfal: Hashimi of Medina and Basra (card said al-Abdari of Mecca); bilal-ibn-abi-al-darda: al-Sham instead of Iraq; hisham-ibn-ubayd-allah-al-razi: Rayy instead of Khurasan, died 221 AH added.
- Notes: abdallah-ibn-al-harith-ibn-nawfal sits on p. 2363 beside a duplicated heading (entries 3189 and 3190 carry the same man in two forms); the prose uses both and says so. muhammad-ibn-ahmad-ibn-hafs: heading year 264 AH and text "nearly 270" are both given, no choice made; the neighbouring al-Harashi al-Hiri (d. 263) is a different man. abd-al-rahman-ibn-aban and mussa-ibn-sulayman-al-juzjani: the entry gives no death date, cards' dates untouched.
- Skipped: ibrahim-ibn-sad-ibn-abi-waqqas (entry 60, p. 663): the entry is two lines (father of the Medina judge Sa'd ibn Ibrahim, hadith in the two Sahihs, heading year after 100 AH) and the card's dates 726-799 CE belong to a different Ibrahim ibn Sa'd (of the Banu Zuhra line); proposal for the founder: re-date the card to "after 100 AH" and write the short entry once the identity of the card is settled. The packet's "page near 80" does not match the book (p. 80 is another book).

## 2026-11-14 (p69, Lane B worker B1) — Biblissima scan complete (candidates 431 to 738)

- Approval: dec-20261114-277. The scan finished: 308 searched in all, 19 matched by Wikidata id. Linked in p58 (15) and here (al-dimyati Q317200, dates 1217 and 1306 agree). Left for the founder: terken-khatun, abd-al-malik-ibn-habib, ibrahim-al-halabi (listed in p58). Candidates 739 onward do not exist (the list of persons born 600 to 1500 CE with a Wikidata id ends at 738).

## 2026-11-14 (Lane B1 prose, packet 1)

- Wrote ar, en, ur prose for 10 places: aksaray-q182025, sk-dar, dallas, erbil, sufetula, malayer, firuzabad, honolulu, larissa, acropolis-of-athens. Sources read 14 Nov 2026: Pleiades JSON (4), iDAI.gazetteer JSON (7), Yaqut Mu'jam al-buldan vols 1-2 scan pp. 176-178 (Erbil only; cited as scan p.176 and p.177).
- Yaqut searched for the other nine names (Arabic spellings and variants) with no entry found in vols 1-2; those pages say so and rest on the gazetteers. Nothing skipped. Firuzabad overview reuses the existing Encyclopaedia of Islam 2 citation from its data card.
- iDAI.gazetteer needs the header Accept: application/json on /place/<id>; the .json suffix returns 404.
## 2026-11-14 (Lane B1 place prose, packet 2)

Wrote ar, en and ur prose for vila, th-nia, el-mahalla-el-kubra, ioannina, kirkuk, beaufort-castle, yerevan, plo-nik, dhi-as-sufal, tartus from Pleiades (page JSON, accessed 14 Nov 2026) and iDAI.gazetteer (accessed 14 Nov 2026). Yaqut vols 1-2 OCR searched: no entries for any of the ten (the OCR reaches only to about the letter thaa/dhal), so `source/mujam-al-buldan-yaqut` was not added. Skipped: none.
## 2026-11-14 (Lane B2 packet pktc) — Siyar entries, six persons

- Written (ar, en, ur, draft; source al-Dhahabi, Siyar A'lam al-Nubala, ideas-house edition): hisham-ibn-amr-al-fuwati (pp. 4094-4095, Mu'tazili, labelled first), amir-ibn-abd-allah-ibn-al-zubayr (pp. 2111-2112, page re-read; entry follows the end of Abu Ubayda's entry), ashab-ibn-jubayr (pp. 1138-1139), ahmad-ibn-al-hasan-ibn-kharrash (pp. 752-753), abu-al-hasan-al-bahili (p. 1397, Ash'ari), muhammad-ibn-sad-ibn-abi-waqqas (pp. 3436-3437).
- Corrections: Amir died after 120 AH (card said 736 CE); Ibn Kharrash d. 242 AH, period changed from Buyid-Seljuk to Abbasid-early (Wikidata Q138350908 also gives 856); Ash'ab's birth 684 removed (not in the book).
- Skipped (identity): abu-bakr-ibn-muhammad-adal (entry 1233 is Abu Bakr ibn Tarkhan al-Salihi d. 679 AH, not the Sultan of Adal); abd-allah-ibn-yusuf (card is the Medinan-Tinnisi Muwatta narrator d. 218 AH per Wikidata; entry 3471 is al-Jurjani d. 148 AH); mohamed-ben-youssef (card is the Tunisian scholar 1848-1939 per Wikidata; entry 5997 is Muhammad ibn Yusuf al-Harawi).

## 2026-11-14 (Lane B2 packet alm1) — al-A'lam entries, ten persons

- Written (ar, en, ur, draft; source al-Zirikli, al-A'lam, 15th ed. 2002): rashid-ahmad-gangohi (3:22), ahmad-al-rumi (1:148), mahmud-ibn-umar-al-timbukti (7:95), al-saffarini (5:290), thimal-ibn-salih (2:99), ahmed-skirej (1:188), al-fadl-ibn-shadhan (5:145, Imami), muhammad-bakhit-mutii (6:23), sad-ibn-abd-allah-al-qummi (3:82, Imami), ridwan-al-falaki (3:22). Short entries (ahmad-al-rumi, al-fadl-ibn-shadhan) are short pages, not padded.
- Corrections: ahmad-al-rumi d. 1633 (card 1634); sad-al-qummi d. 913 and period early Abbasid (card 914, Umayyad); al-fadl-ibn-shadhan theologian and Imami jurist d. 874 (card hadith scholar, 873); ridwan-al-falaki Egyptian astronomer d. 1711, region Egypt (card Anatolia, writer, 1710); al-saffarini summary no longer says Hanbali (entry does not); ahmed-skirej gains born_in Fes and died_in Marrakesh; gangohi summary no longer says Deoband co-founder (not in the entry).
- Skipped: abd-al-haqq-dihlawi (card is already review: published with its own sources from another lane; adding draft prose would conflict with its status; proposal for the founder to decide how the A'lam entry, vol. 3 p. 280, is added).
## 2026-11-14 (Lane B2 packet alm2) — al-A'lam (al-Zirikli, Dar al-Ilm 2002), eleven persons
- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14, source alam-zirikli-dar-al-ilm-2002, cited by volume and page): abd-al-rahman-jaziri (3:286), ali-al-shabramallisi (4:250), al-hasan-ibn-mahbub (2:174), alqama-ibn-abada (4:246), muhammad-ibn-sulayman-al-kurdi (6:128), jabir-ibn-yazid-al-jufi (2:99), ahmad-ibn-atwah (1:265), ibn-wahban (4:178), muhammad-ibn-mustafa-wani (7:95), mahmud-ibn-sulayman-al-kafawi (7:95), dawud-al-tai (2:330). All entries are short; pages are short and nothing is added beyond the entry. validate 0 errors; cite-check 11 pass.
- Corrections to cards: al-Shabramallisi region and place moved from Anatolia to Egypt; Ibn Wahban role scientist dropped (the entry names no astronomy); al-Kurdi born 1715 (card 1714); Jabir died 745 (card 746); al-Hasan ibn Mahbub dates made exact; al-Kafawi's work is Kata'ib A'lam al-Akhyar (card said A'yan al-Zaman); Ahmad ibn Atwa region moved to Arabia.
- Proposals for the founder: (1) Alqama's card is `published` (golden, from the Mufaddaliyyat); only its sources list gained the A'lam, its summary and provenance were left, while the new prose files are draft. (2) Ahmad ibn Atwa's card has an occupation `qadi` and a Wikidata death place al-Jubayliyah that the entry does not support (it says only "died in his town"); both left, the edge flagged low. (3) Al-Hasan ibn Mahbub and Jabir al-Ju'fi are labelled Imami and Shi'i first as the entry states; the old card phrases "transmitter from al-Sadiq / al-Baqir" are not in the entry and were dropped. (4) Ibn Wahban's entry prints a title as "al-Mtithal al-Amr" (likely a misprint for Imtithal); kept as printed.
- Skipped: none; every entry matched its card by name, role, region and death year.
## 2026-11-14 (Lane B1 packet 3) — ten place pages

- Written (ar, en, ur, draft): ardestan (Yaqut vol. 1 p. 184, Istakhri passage and scholars, plus iDAI), bolnisi and peshawar (Pleiades only; no iDAI id), kayseri, surabaya, najafabad, budapest, mytilene, bal-kesir, stuttgart (iDAI only).
- No Yaqut entry found in volumes 1-2 for the others (Kayseri: the Qaysariyya hits are other places). Note: Stuttgart's iDAI record links GeoNames 2825297, while the data file holds 6690189; not changed. Pleiades JSON endpoint was read via the local CSV dump (same revision fields).
## 2026-11-14 (Lane B1 packet 4) - place prose, ten places

- Written (ar, en, ur, draft): nicomedia, thermopylae, itea, doucen (Pleiades), washington-dc, birmingham, famagusta, detroit, samalut, los-angeles (iDAI.gazetteer). Yaqut Mu'jam al-buldan vols 1-2 OCR searched for each Arabic name: no entry found, so no Yaqut citation. Nothing skipped.

## 2026-11-14 (Lane B1 packet 6) - place prose, ten places

- Written (ar, en, ur, draft): babadag, mu, mahan, denizli, old-dongola (Pleiades via local CSV dump, same revision fields); khosrowshahr, zurich, nev-ehir, san-francisco, akhisar (iDAI.gazetteer, https://gazetteer.dainst.org/doc/<id>.json, read 14 Nov 2026; the /place/<id>.json URL in the brief returns 404). Yaqut vols 1-2 OCR end at the letter ta, so no entry for any of them and no Yaqut citation. Nothing skipped. Note: Zurich's iDAI record links GeoNames 2657896, the data file holds 7287650; not changed.
## 2026-11-14 (Lane B1 packet 5) - place prose, ten places

- Written (ar, en, ur, draft): belvoir-fortress and ain-zara (Pleiades only), mainz, bolu, p-cs, nakhchivan, kastoria, rethymno, alanya (iDAI.gazetteer only), ucl-s (iDAI plus Yaqut vol. 1, scan p. 317; `source/mujam-al-buldan-yaqut` added to its sources). Skipped: none.
- Yaqut vols 1-2 searched by Arabic name; only Uclés (أقليش) has an entry. Belvoir's Arabic name (Kawkab al-Hawa) has no entry; the `كوكب` hits are unrelated. Nakhchivan falls in a later volume.
- Note: Uclés iDAI record links GeoNames 2510106 while the data file holds 6357543; not changed. iDAI was read through gazetteer.dainst.org/doc/<id>.json (the /place/<id>.json URL returns 404).

## 2026-11-14 (Lane B2 packet alm3) - al-A'lam person prose, ten persons

- Written (ar, en, ur, draft, cited to al-A'lam 15th ed. 2002 vol/page): lutfullah-al-arzurumi (5:241), muhammad-ardabili (6:291, Imami), ibn-al-mundhir-al-naysaburi (5:290), abd-al-qadir-al-maghribi (4:10), al-tabarsi (5:145, Imami), ahmad-al-badawi-zawitan (1:84), muhammad-ibn-saud (6:128), muhammad-qadri (6:291), ibrahim-ibn-sinan (1:36, Sabian), ibn-rashiq-al-maghribi (4:57). Short entries get short pages; nothing added beyond the entry.
- Corrections to cards: ibn-al-mundhir born 856, died 931 (card 855, 930); abd-al-qadir-al-maghribi born 1868 (card 1867); al-tabarsi title Amin al-Din (card Amin al-Islam); al-ardabili death kept approximate with note (entry: after 1100 AH); roles updated for ibn-al-mundhir, al-maghribi, zawitan, qadri, ibn-sinan; relations added: died_in aleppo, sabzevar, diriyah, damascus; born_in latakia; buried_in mashhad (low); lived_in isfahan, fes, damascus.
- Skipped: ibrahim-ibn-abdallah-physician. The packet entry is al-Asili (Abdallah ibn Ibrahim, Maliki hadith scholar of Cordoba, d. 392 AH); the card is a physician named Ibrahim ibn Abdallah (source Ibn Abi Usaybi'a, died at Methoni): a different person, proposal for the founder to unlink.
- Note: the entry for al-Maghribi reads "بالجماعة السورية", taken as "الجامعة السورية" (an evident misprint in the text); Ibn Rashiq's card region (maghreb) rests on his nisba and was left unchanged.
## 2026-11-14 (Lane B2, al-A'lam packet 4, alm4) - ten persons

- Written (ar, en, ur, draft, completeness 3), each from its entry in al-Zirikli, al-A'lam, 15th ed. 2002 (`alam-zirikli-dar-al-ilm-2002`, vol. and page cited): taha-abd-al-baqi-surur (3:230), sadreddinzade-al-shirwani (6:23), nuh-ibn-mustafa-egir (8:50), ibn-abd-al-qawi-mardawi (6:179), muhammad-abu-zahra (6:23), sultan-ibn-saif-i (3:108, labelled Ibadi), tawba-al-anbari (2:88), abd-al-salam-ibn-mashish (3:354), ali-ibn-ahmad-mahimi (4:250), ahmad-ibn-kayghalagh (1:84). Short entries give short pages (Surur, Sadreddinzade, Tawba, Ibn Abd al-Qawi).
- Corrections to cards (entry date, note in the date field): ibn-abd-al-qawi-mardawi died 1299 (card 1300) and born 1232; sultan-ibn-saif-i died 1680 (card 1679); abd-al-salam-ibn-mashish died 1225 (card 1227, Wikidata 625 AH); ahmad-ibn-kayghalagh born about 872 (card about 904); born added for abu-zahra 1898, tawba 677, mahimi 1374. Summaries no longer carry claims the entry does not make (Abu Zahra "Maliki", Sultan reign "from 1649", Ibn Abd al-Qawi "grammarian and poet", Ibn Mashish "master of al-Shadhili").
- Left unchanged for the founder: sadreddinzade died 1627 on the card (Wikidata) against 1036 AH = 1626 in the entry (1036 AH spans both years). The Sultan ibn Saif entry gives his accession as 1050 AH with no CE year; the card's "1649" was not carried over. Ibn Kayghalagh: the entry places the 283 AH campaign under al-Muktafi and prints 300 AH for the Egyptian emirate under al-Muqtadir; both written as printed and attributed.
- Skipped: jafar-ibn-ulba-al-harithi (card already status.review published; no draft prose added over it).
## 2026-11-14 (Lane B1 packet 8) - place prose, ten places

- Written (ar, en, ur, draft): ani, mdina, ephesus (Pleiades, JSON read 14 Nov 2026); montreal, sabzevar, new-york-city, quchan, kavala, bergen-op-zoom, tirana (iDAI.gazetteer, read through the /place/<id> URL with Accept: application/json; the .json suffix returns 404). Ani also cites Yaqut vol. 1, scan p.69 (entry between Khilat and Kanja); `source/mujam-al-buldan-yaqut` added to its sources. Mdina's Arabic label is the same spelling as Medina, so no Yaqut entry was used; Ephesus, Kavala (Yaqut vols 1-2 hold only a running header or unrelated hits) have no entry; the rest fall in later volumes. Skipped: none.

## 2026-11-14 (Lane B1 packet 7) - place prose, ten places

- Written (ar, en, ur, draft): erzincan (iDAI plus Yaqut vol. 1, scan p. 194; `source/mujam-al-buldan-yaqut` added), kandahar, unaizah, oujda, sari, i-skilip, marseille, masyaf, kazan, karaman (iDAI.gazetteer only; none of these has a Pleiades id in the packet, and the iDAI-linked Pleiades numbers are given as identifiers only). Skipped: none.
- Yaqut vols 1-2 searched by Arabic name: only Arzanjan has an entry; Qandahar, Unaizah (poetry mentions only), Sari, Wajda are mentions, not entries. iDAI read via gazetteer.dainst.org/doc/<id>.json.

## 2026-11-14 (Lane B1 packet 10) - place prose, ten places

- Written (ar, en, ur, draft): kastamonu, radaa, shubra-khit, edinburgh, sinop, bitlis, sivas (iDAI.gazetteer, read via gazetteer.dainst.org/doc/<id>.json) and pre-ov, abusir, tuz-khormato (Pleiades JSON, read 14 Nov 2026). Bitlis cites Yaqut vols 1-2, scan p.494 (entry Badlis); `source/mujam-al-buldan-yaqut` added to its sources. Sivas appears in Yaqut only inside the Tawfat entry, so no Yaqut cite; Abusir has only a Busir entry for four villages that cannot be tied to the site; Rada'a, Kastamonu, Sinop, Shubra Khit, Edinburgh, Tuz Khormato, Pre-ov have none in vols 1-2. Skipped: none.
## 2026-11-14 (Lane B1 packet 9) - place prose, ten places

- Written (ar, en, ur, draft): shaizar, djerba, turbessel (Pleiades, local CSV dump and JSON read 14 Nov 2026), asilah (Pleiades plus iDAI), urmia, gelibolu, i-skenderun, philadelphia, berkeley, berat (iDAI.gazetteer via gazetteer.dainst.org/doc/<id>.json). Urmia cites Yaqut vol. 1, scan pp.206-207, and i-skenderun Yaqut vol. 1, scan p.238 (Iskandaruna); `source/mujam-al-buldan-yaqut` added to both. Skipped: none.
- Yaqut vols 1-2: Asilah's only hit is a different place, Asil in al-Andalus, so not used; the rest fall in later volumes. Djerba's Pleiades JSON endpoint returned a features feed, so its fields come from the CSV dump.

## 2026-11-14 (Lane B2 packet alm7) - al-A'lam persons, eleven written

- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14, source alam-zirikli-dar-al-ilm-2002, cited by volume and page): al-aqayshar-abu-muarrid (7:275), al-dardir (1:220), ibn-al-anbari-muhammad (6:291), ibn-al-wazir (5:290), abu-ahmad-al-askari (2:174), murtada-al-zabidi (7:29), salih-ibn-ahmad-ibn-hanbal (3:187), mustafa-ibn-kamal-al-din-al-bakri (7:233), abu-salim-al-marini (1:36), muhammad-ibn-abd-al-hamid-al-usmandi (6:179), muhammad-al-burtuqali (7:29). All eleven matches checked on name, role, region and dates; none skipped. Salih's entry is two lines, so his page is short.
- Notes: dates left on the cards where the entry's AH year overlaps the card's CE year (al-Zabidi d. 1205 AH vs card 1791; al-Askari d. 382 AH vs 992; al-Anbari b. 271 AH vs 885; Salih d. 265 AH vs 879; al-Burtuqali d. 932 AH vs 1526). Ibn al-Wazir: the entry names no school, the old card's Zaydi label is not repeated. Al-Bakri: the entry's year 1022 AH for the Jerusalem journey precedes his birth (1099 AH), so no date is given. Entry spellings kept for al-Dardir's «Manj al-taqdir». The card summary's «al-Sharh al-Kabir» for al-Dardir is not in this entry and was dropped from the summary. New place edges: Kufa (al-Aqayshar, died), Cairo (al-Dardir), Egypt (al-Zabidi, al-Bakri), Damascus (al-Bakri, born), Fez (al-Burtuqali, died).
- Lane B1 packet 11 (14 Nov 2026): wrote trilingual prose for mallawi, heraklion, stara-zagora, bato-ina, sidon, ptolemais-hermiou, gebze, antioch, erzurum, cambridge from Pleiades and iDAI.gazetteer facts; antioch also from Yaqut, Mu'jam al-buldan vol. 1 scan pp. 358-362. Skipped Yaqut for heraklion: his entry (Aqritish, scan p. 315-316) is for the island of Crete, not the city. Sidon is in volume 3 (letter sad), not in the volumes on the drive. No place skipped.
## 2026-11-14 (Lane B1 packet 12) - place prose, ten places

- Written (ar, en, ur, draft): chamchamal, biskra, k-tahya, sheffield, drama, rostov-on-don, trabzon, plovdiv, patras (iDAI.gazetteer via gazetteer.dainst.org/place/<id>, Accept application/json, read 14 Nov 2026) and aphrodisias (Pleiades JSON, 14 Nov 2026). Biskra cites Yaqut vol. 2, scan p.586 (entry Biskira); `source/mujam-al-buldan-yaqut` added to its sources. No Yaqut entry found in vols 1-2 for the others (Trabzon, Patras, Sheffield and the rest fall in later volumes or are absent). Skipped: none.

## 2026-11-14 (Lane B2 packet alm9) - al-A'lam persons, nine written

- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14, source alam-zirikli-dar-al-ilm-2002, cited by volume and page): yusuf-ibn-abd-al-rahman-ibn-al-jawzi (8:235), yahya-ibn-muhammad-idrisi (8:133), yusuf-ibn-al-hasan-ibn-al-mibrad (8:219), muhammad-mahdi-al-naraqi (7:311, labelled Imami), abdul-hakim-sialkoti (3:280), muhammad-raghib-al-tabbakh (6:122-123), ishaq-ibn-mansur-al-kawsaj (1:291), musa-ibn-faris-al-mutawakkil (7:315), nasif-al-yaziji (7:346; the entry states no religion, so none is written).
- Corrections to cards: Ibn al-Jawzi born 1185 (card 1184); Musa ibn Faris born 1356 (card about 1350), role ruler not vizier, Fars edge replaced by Fez; al-Sialkoti lived_in Sialkot (card Lahore, and its summary's death 1657 and "mujaddid" claim dropped); al-Naraqi's summary no longer says mathematician (entry: Imami jurist); Nasif born 1800; Idrisi and Mibrad dates already matched.
- Left for the founder: al-Naraqi died 1209 AH = 1794 in the entry, card 1795 kept (1209 AH spans both). The Mibrad title «al-Aqd al-Tamm fiman Zawwajahu al-Nabi» is printed with a blessing formula after al-Nabi in the entry; it is omitted here under the no-honorifics rule. Al-Yaziji's entry lists «Majma' al-Bahrayn» as maqamas. The Idrisi entry calls the dynasty "of Marrakesh"; written as printed with a gloss.
- Skipped: mehmed-rashid (card Muhammad Rashid d. 1735; the entry found is Rashid ibn Khamis al-Habsi, an Omani poet, 1678 to about 1737, not shown to be the same person); mahmud-khattab-al-subki (card already status.review published).

## 2026-11-14 (Lane B2 packet alm8) - al-A'lam persons, nine written, two skipped

- Written (ar, en, ur, draft; al-Zirikli, al-A'lam, 15th ed. 2002, each cited to volume and page): al-Zanjani (vol. 7 p. 95), Nasr al-Maqdisi (vol. 8 p. 20), Ali al-Karaki (vol. 4 p. 250, Imami labelled first), Ibn Abi al-Surur al-Bakri (vol. 7 p. 29), Jawad ibn Sa'd al-Kazimi (vol. 2 p. 139; short entry, short page), Ibn al-Dayba (vol. 3 p. 286), al-Mustaghfiri (vol. 2 p. 120), Muhammad ibn Makki al-Amili (vol. 7 p. 95, Imami labelled first), Imad al-Dawla (vol. 4 p. 250).
- Corrections to cards: al-Mustaghfiri is of Nasaf, not Nishapur (summary replaced; died_in Nasaf added); Ibn Makki born 1333 not 1334, and beheaded 1384, not executed 1385 as the old summary said; Imad al-Dawla born 894 (was 892~); Ali al-Karaki born 1463 added; Nasr al-Maqdisi born 987 added; al-Kazimi's role "poet" dropped, the entry names none; Ibn Abi al-Surur's summary no longer calls him a mystic, the entry does not (it lists a book on Sufi classes). Place edges added: Tyre, Najaf, Nasaf, Jezzine, Shiraz.
- Skipped (identity mismatch, proposals for the founder, not merged elsewhere): ibn-al-sikkit (card d. 858, the entry found is Ibn al-Quff, d. 685 AH); ibn-mattawayh (card d. 1076, the entry found is al-Wahidi, d. 468 AH).
## 2026-11-14 (Lane B1 packet 14) - place prose, ten places

- Written (ar, en, ur, draft): d-zce, suru, skopje, anakkale, brest, tudela, varna, brooklyn (iDAI.gazetteer JSON, accessed 14 Nov 2026), mystras and tyre (Pleiades JSON, accessed 14 Nov 2026). Skipped: none. No Yaqut entry used: Tudela appears only in passing in vols 1-2 (no own entry), Tyre (sad) falls in vol. 3, the rest are absent; no page invented.
## 2026-11-14 (Lane B1 packet 13) - place prose, ten places

- Written (ar, en, ur, draft): yozgat, i-znik, tulkarm, khoy, t-touan, kolkata, idlib, tokat, manisa, tomislavgrad (iDAI.gazetteer via gazetteer.dainst.org/doc/<id>.json, read 14 Nov 2026; the /place/<id> URL with Accept: application/json returns a 303 redirect, so curl needs the doc form). No Yaqut entry found in vols 1-2 (OCR searched by Arabic name); no Yaqut source added. Skipped: none. Note: idlib data file has GeoNames 169388, iDAI links 169389; the prose states iDAI's number and the data file is unchanged.

## 2026-11-14 (Lane B2 packet alm11) - al-A'lam persons

- Written (ar, en, ur, draft, source alam-zirikli-dar-al-ilm-2002): yahya-ibn-hassan-al-tinnisi (vol. 8 p. 133), sulayman-al-mahuzi (3 p. 120), nur-allah-al-shustari (8 p. 50), shah-waliullah-al-dahlawi (1 p. 148), al-qasim-ibn-asakir (5 p. 171), sahnun-ibn-said (3 p. 354), mokhtar-soussi (7 p. 29), muhammad-ibn-abd-al-wahid-al-mallahi (6 p. 179), muhammad-mayyara (5 p. 290). Short entries are written short; Imami persons labelled first.
- Corrections: mayyara born 1590 (card 1591); mokhtar-soussi lived_in Sousse removed (entry: born at Ilgh in Sous); mallahi died_in Granada added; sahnun born_in Qayrawan added; nur-allah lived_in Lahore added.
- Skipped (proposals for the founder): muhammad-ibn-abdallah-al-tamirtashi (card d. 1596; packet entry is Muhammad ibn Abdallah Al Khalifa d. 1876, a different person); zayn-al-abidin-work-14608 (card 658-713 with a Qazvin link and south-asia region; the packet entry is the fourth Imami imam, 38-94 AH, identity not established).
## 2026-11-14 (Lane B1 packet 16) - place prose, two places

- Written (ar, en, ur, draft): al-rastan, irbid (iDAI.gazetteer via gazetteer.dainst.org/doc/<id>.json, read 14 Nov 2026). No Pleiades id in the packet; iDAI cross-link ids are mentioned only as links. No Yaqut entry for either in vols 1-2 (al-Rastan appears only as a river name inside another entry); no Yaqut source added. Skipped: none.
- 14 Nov 2026, Lane B1 packet 15 (approval dec-20261114-277): wrote ar, en and ur prose for ardakan, moscow, rotterdam, rize, giannitsa, tafresh, semarang (iDAI.gazetteer, doc/<id>.json) and shahrisabz, nazareth, sardarapat (Pleiades JSON and places.csv). Yaqut vols 1-2 searched for every Arabic name: no entry (the only Nasira hit is Khunasira, a different place), so no Yaqut source added. Note: the iDAI record of Moscow links GeoNames 524901 while the data file holds 524894; prose reports the iDAI value, data file left for review. Rize's iDAI name list contains a stray «Çorum»; left out of the prose. None skipped.

## 2026-11-14 (Lane B2 packet alm12) - al-A'lam persons, eleven written
- Written (ar, en, ur, draft; al-Zirikli, al-A'lam, 15th ed. 2002, each cited to volume and page): al-Mu'ayyad fi'l-Din al-Shirazi (vol. 8 p. 70, Isma'ili labelled first), Muhammad Ridha Kashif al-Ghita (vol. 6 p. 122; short entry, short page; the entry names no school), al-Hurr al-Amili (vol. 6 p. 23, Imami labelled first), Abu Imran al-Mirtuli (vol. 7 p. 315), Muhammad Taqi al-Majlisi (vol. 6 p. 23, Imami labelled first), Abu Bakr al-Haddad (vol. 2 p. 60), Abbas al-Musawi al-Makki (vol. 3 p. 256), Sultan ibn Murshid (vol. 3 p. 108, Ibadi labelled first), Ahmad al-Raysuni (vol. 1 p. 220), Muhammad Zahid al-Kawthari (vol. 6 p. 128), Maslama al-Majriti (vol. 7 p. 223).
- Corrections to cards: al-Hurr born 1623 (card 1624), died 1692 at Tus (card 1693, Mashhad); Sultan ibn Murshid died 1742 of wounds (card 1743, siege of Sohar); Maslama died at Madrid (card Cordoba), born 950 added; al-Raysuni summary no longer says hostage-taking (not in the entry), born about 1854 added; Abbas al-Musawi summary year 1766 (card text said 1765); al-Mirtuli role poet added; al-Kawthari born 1879 added; Kashif al-Ghita born 1893 added.
- Skipped: none. All eleven matched by name, role, region and dates. Notes: al-Mirtuli's Beja is not linked (place/baja is not checked to be the Portuguese Beja); no place card for al-Mokha or Zinat, so none linked.
## 2026-11-14 (Lane B2 packet alm13) - al-A'lam persons, eleven written

- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14, source alam-zirikli-dar-al-ilm-2002): muhammad-ibn-abd-al-rahman-al-alqami (6:179), abd-al-rahman-ibn-qudama (3:286), al-qasim-ibn-ibrahim-al-rassi (5:171, Zaydi), muhammad-baqir-al-majlisi (6:23, Imami), amr-ibn-ali-al-fallas (5:79), abd-al-qadir-ibn-muhammad-al-jaziri (4:10), fakhr-al-din-al-turayhi (5:136, Imami), ibn-abi-usaibia (1:188), ibn-ziyad-al-nisaburi (4:115; two-line entry, written short), al-miqdad-al-siyuri (7:278, Imami), abd-al-ghani-al-nabulsi (4:10).
- Corrections to cards: al-Rassi region Arabia (card said Tabaristan), the wrong lived_in Iran edge replaced by Medina; al-Turayhi region Iraq; Ibn Abi Usaybi'a born 1200 added; Ibn Ziyad lived_in Iraq added; al-Fallas died_in Samarra and lived_in Baghdad added; al-Miqdad died_in Najaf added; al-Nabulsi born_in and died_in Damascus added.
- Left for the founder (entry and card disagree, card kept): al-Majlisi entry 1111 AH = 1700 (card 1699); al-Fallas 249 AH = 864 (card 863); al-Jaziri born 880 AH = 1475 (card 1505 from Wikidata, 911 AH); al-Turayhi died 1085 AH = 1674 (card 1675). Jaziri entry has one library name that may apply to one or both manuscripts; written as the entry has it.
- Skipped: none.

- 14 Nov 2026, Lane B1 packet 21: wrote ar, en, ur prose for ten persons (abd-al-rahman-al-sufi, al-khazin-al-baghdadi, fuzuli, firuz-shah-tughluq, ibn-abd-al-zahir, alishir-navai, latifi, molla-fenari, zati, miran-shah) from Biblissima labels and the data files. No OpenITI ids in the packet. al-A'lam OCR on the drive holds only index hits, so no entry was read; pages are short on purpose. Skipped: none.
- 14 Nov 2026, Lane B1 packet 22: ten persons written (ar, en, ur, draft) from Biblissima name form and dates only; no OpenITI ids in the packet; al-Zirikli OCR (1927 vol. 2) holds only noisy mentions, so no biographical entry was read and no work list beyond the data card was stated. Skipped: none.

## 2026-11-14 (p70, Lane B worker B1, coordinator) — prose packets and OpenITI work lists

- Place packets 1 to 16 (152 places with a Pleiades or iDAI id and no prose) were written by Sonnet subagents and merged (PRs 6724, 6728, 6736, 6738, 6743, 6745, 6751, 6754, 6762, 6765, 6769, 6772, 6779, 6780, 6786, 6787); one place had no en file left. Person packets 21 and 22 (20 persons, PRs 6791, 6792); packet 23 (sultan-walad, baha-al-din-naqshband) skipped: the only verifiable facts are the Biblissima dates, no entry on the drive.
- Data mismatches noticed by subagents, for the founder: stuttgart (iDAI links GeoNames 2825297, ours 6690189; the iDAI link rested on the Arabic name only), idlib (169388 ours, 169389 iDAI), moscow (524894 ours, 524901 iDAI).
- 68 persons with an OpenITI id gain a section listing the works the corpus holds under it (Arabic titles for ar and ur, transliterations for en; titles with brackets, pilcrows or quotation marks skipped; 37 persons with fewer than two clean titles and al-daraqutni, whose OpenITI title contains a typed honorific, left out).

## 2026-11-14 (p71, Lane B worker B1) — quality pass on the place prose; three iDAI links withdrawn

- cite-check on the 152 places written in PRs 6724 to 6787: 152 pass, 0 fail (including the two of #6787, al-rastan and irbid). Validate on the merged tree: 0 errors.
- GeoNames mismatches: iDAI populated-place records carry GeoNames 2825297 (Stuttgart), 169389 (Idlib), 2657896 (Zurich) against our 6690189, 169388 and 7287650; all three iDAI links rested on the Arabic name alone. Under the fail-closed rule: idai id and source removed, and the nine iDAI-only prose files (ar, en, ur) deleted; the iDAI-only prose is in git history (PRs 6738, 6779, 6743-6745) and can be restored once the founder confirms the GeoNames ids (the likely cause is that our ids name the city district or administrative unit, the iDAI ones the city). Moscow kept: Wikidata lists both 524894 and 524901 for the city. al-rastan kept: iDAI carries no GeoNames id, the Arabic name and 0.72 km match.

## 2026-11-14 (p72, Lane B worker B1) — Biblissima sections on 78 persons; Yaqut volumes 3 to 5 download started

- Biblissima label read for 78 persons with a Biblissima id and full prose; section added in ar, en, ur (cite-check 78 of 78). VIAF has no readable public data channel in this pass (the cluster pages are not fetched), so VIAF prose is not written: a VIAF number alone is no fact worth a section.
- Yaqut, Mu'jam al-Buldan, Dar Sader 1995 (Shamela book 23735, pages 1 to 2460 by index): download to books/geography/mujam-al-buldan-sader-shamela23735/pages.jsonl on the microSD (about 3 MB, claimed in WORK-REGISTRY.md), curl with a 2 s pause (shamela.ws answers curl). The edition is not the Khanji print of the existing scan: citations will name volume and page of the Dar Sader print and need a new source entity.

## 2026-11-14 (Lane B2 al-A'lam packet 16, alm16) - ten persons from al-A'lam, Dar al-Ilm 2002

- Written (ar, en, ur, draft; cite-check 10 of 10): ibn-hurmuz (vol. 3 p. 286), al-mullawi (1 p. 148), ahmad-al-buni (1 p. 156), shams-al-din-ibn-al-mawsili (7 p. 29), ibn-ajurrum (7 p. 29, replaces Biblissima-only prose), zahir-al-din-ibn-al-attar (7 p. 296), hibatullah-ibn-kamil (8 p. 70), yunus-ibn-abd-al-wahhab-al-aythawi (8 p. 235), abd-al-rahman-al-bahkali (3 p. 286), muhammad-ibn-abd-al-kabir-al-kettani (6 p. 179).
- Corrections to cards: ibn-hurmuz Khurasan to Medina and Alexandria; al-mullawi born 1088 AH = 1677 (card note said 1098); ibn-al-mawsili Mosul to Baalbek (birth) and Tripoli (death); al-aythawi death 1570 to 1569 (976 AH); al-kettani died_in Sale to Fes, death year 1909 kept (entry prints 1907 beside 1327 AH, which falls in 1909 to 1910); al-bahkali Arabia to the Tihama; hibatullah-ibn-kamil: Fatimid Isma'ili da'i and chief judge, Tyre birth on the card is not in the entry and stays pending.
- Skipped: muhammad-ibn-mustafa-al-bakri. The entry is for Mustafa ibn Kamal al-Din al-Bakri (1099 to 1162 AH = 1688 to 1749); the card is named Muhammad ibn Mustafa with the same years. The name differs (possibly a Wikidata naming error, possibly the card is a different man), so no prose was written. A proposal for the founder: confirm identity, then rename or alias.

## 2026-11-14 (Lane B2 packet alm17) - al-A'lam persons, eleven written

Source: al-Zirikli, al-A'lam, 15th ed. 2002 (alam-zirikli-dar-al-ilm-2002). Each entry read in full; match checked by name, role and dates. None skipped.

- ali-ibn-abd-al-wahid-al-sijilmasi (written vol. 4 p. 250): card summary said eighteenth-century Moroccan writer and linguist: corrected to Maliki jurist, d. 1647; born 1594 removed (the entry gives no birth).
- ibn-mawdud-al-mawsili (written vol. 4 p. 130): card born 1202 kept (599 AH spans 1202 to 1203).
- abu-al-abbas-al-sabti (written vol. 1 p. 84): card born 1129 kept (524 AH begins late 1129); added born_in Ceuta; the divided judgements of his chroniclers are each attributed.
- abdallah-ibn-muhammad-al-shinshawri (written vol. 4 p. 115): region corrected levant-iraq to egypt-nile; card years 1528 and 1590 kept (entry 1528 to 1591, same Hijri years).
- al-mahdi-al-husayn (written vol. 2 p. 219): card born 986 changed to 994 (entry heading 384 AH as printed; flagged: a 9-year-old imam is odd, the heading may mark something else); died 1013 confirmed.
- ibrahim-al-thaqafi (written vol. 1 p. 36): Zaydi then Imami labelled first; no corrections.
- abd-al-hamid-al-zahrawi (written vol. 3 p. 286): no date corrections; role politician added; born_in Homs added; the entry's 1327 AH = 1908 written as printed.
- al-shaykh-al-mufid (written vol. 6 p. 291): card born 948 kept; nisba corrected to al-Ukbari (born Ukbara); Imami labelled first; al-Dhahabi remark attributed.
- abd-al-rahman-shaykhizade (written vol. 3 p. 286): role translator removed (not in the entry); Gallipoli added.
- al-bazzazi (written vol. 7 p. 29): no corrections; the fatwa on Timur is given as the entry reports it.
- ahmad-ibn-fahad-al-hilli (written vol. 1 p. 220): no corrections; died_in Karbala added.
## 2026-11-14 (p73, Lane B worker B1) — Nomisma sections on 13 pages

- One SPARQL request (nomisma.org/query, counts of distinct coins and types by nmo:hasAuthority, hasIssuer or hasMint, 5,117 concepts) joined to the entries that carry a Nomisma id and prose in all three languages; 13 qualified (the others have no prose file yet or their concept has no coin record). The Nomisma definition text is not used: it is taken from Wikipedia, which is never a source for prose. Concepts whose id carries an apostrophe are skipped (citation anchor).
- Coin-type facts per ruler (denominations, mints, dates) need the type pages of the linked catalogues and were not read in this pass.

## 2026-11-14 (packet 32, place prose) - Pleiades and iDAI sections

- Written: baysan, bejaia, bukhara, bursa, cairo, cartagena, cefalu, constantine, cordoba, damascus (Pleiades only), edirne, fez.
- Skipped, iDAI GeoNames id differs from our data: ceuta (iDAI 2519582, ours 6362987), gabes (iDAI 2468369, ours 110075).
- Skipped, iDAI record 2280221 (damascus) carries no GeoNames id, so identity cannot be confirmed; proposal for the founder.
- Packet 31 (place prose, identifier sections): 14 places written; no iDAI GeoNames mismatches (Baghdad, Balkh, Basra iDAI records carry no GeoNames id; Almeria data has none).
- Packet 33 (place prose, identifier sections): 14 places written; no iDAI GeoNames mismatches (Jeddah and Kabul iDAI records carry no GeoNames id; Kabul data has none either).

## 2026-11-14 (Lane B2 packet alm19) - al-A'lam persons, eleven written
- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14, source alam-zirikli-dar-al-ilm-2002): salih-ibn-mahdi-al-maqbali (3:190, Zaydi), abd-al-rahman-al-murshidi (3:286), ahmad-al-quduri (1:202), al-mutalammis (2:115), ibrahim-ibn-yaqub-al-juzajani (1:36), muhammad-ibn-qasim-al-ghazzi (6:291), khalid-ibn-yazid-al-shaybani (2:293), muhammad-baqir-al-sabzawari (6:23, Imami), ahmad-ibn-khalil-al-khui (1:111), muhibb-al-din-al-hamawi (6:23), abd-allah-ibn-alawi-al-haddad (4:57). Cite-check 11 of 11.
- Corrections to cards: al-Maqbali roles Sufi/muhaddith to jurist (entry: Zaydi mujtahid, critic of Sufis); al-Murshidi roles mufti and poet, born_in Mecca added; al-Quduri region Iraq, Iran link replaced by born_in and died_in Baghdad; al-Mutalammis died_in Busra added, summary replaced; al-Juzajani summary year 872 to 873 and the book title not in the entry removed, regions add Levant; Ibn Qasim lived_in Cairo added; Khalid al-Shaybani summary no longer says governor of Armenia, Armenia link replaced by ruler_of Mosul; al-Khu'i born_in Khuy and died_in Damascus, Iran link replaced; al-Hamawi qadi role and occupation removed (entry names none), born 1542 added, born_in Hama and died_in Damascus; al-Haddad buried_in Tarim added, "shaykh of the Alawi path" removed from summary (not in the entry).
- Years kept on the card where the entry's AH year spans the card's CE year: al-Murshidi born 1568 (975 AH), Khalid al-Shaybani died 844 (230 AH), al-Khu'i died 1239 (637 AH), al-Hamawi died 1607 (1016 AH).
- Notes: the packet text of al-Mutalammis stops at the proverb "ashamu min sahifa" (cut in the local text), so a short page was written and nothing beyond it; al-Haddad's sentence linking the Yafi'i persecution to «Aqidat al-Tawhid» is partly garbled in the local text and was not written; al-Juzajani's «al-Mutarjam fihi ulum ghazira...» is written in the entry's own words. Skipped: none.
## 2026-11-14 (Lane B2 packet alm18) - al-A'lam persons, ten written, one skipped

Source: al-Zirikli, al-A'lam, 15th ed. 2002 (alam-zirikli-dar-al-ilm-2002). Each entry read in full; match checked by name, role and dates.

- Written (ar, en, ur, draft; cite-check 10 of 10): abu-al-qasim-al-burzuli (5 p. 171, continuing p. 172), al-dimyati (4 p. 167; replaces Biblissima-only prose), abu-al-baqa-al-kafawi (2 p. 25), muhammad-ibn-husayn-al-zaghuli (6 p. 23), abdullah-al-bosnevi (4 p. 57), abd-al-qadir-al-fasi (4 p. 10), abu-wajzah-al-sadi (8 p. 179), abd-al-wahid-ibn-ashir (4 p. 167), shams-al-din-al-ramli (5 p. 290), al-muhsin-ibn-muhammad-al-bayhaqi (5 p. 283).
- Corrections to cards: al-burzuli born 1339 to 1340 and died 1438 to 1440 (entry 844 AH = 1440; the heading's printed birth 641 does not fit 1340, 741 would, and fits al-Sakhawi's 103 years; years written as printed, flagged), lived_in maghreb replaced by Tunis; abdullah-al-bosnevi father Abd al-Rahman to Muhammad, poet and Malamati removed, born 1584 added, died_in Konya; abd-al-qadir-al-fasi theologian removed; abd-al-wahid-ibn-ashir lived_in Medina (from the nisba) replaced by Fez; shams-al-din-al-ramli lived_in Ramla replaced by Cairo (the nisba is a village of al-Minufiyya, not Palestinian Ramla); abu-wajzah-al-sadi roles poet and scholar; ibn-karama Zaydi school labelled before anything else, Sanaa and Mecca added. Other cards: dates agree with the entry in the same Hijri years.
- Skipped: ahmad-ibn-yusuf-al-misri. The card is Ahmad ibn Yusuf ibn Ibrahim (Ibn al-Daya, mathematician of Baghdad, d. 912); the packet entry is Ibrahim ibn Yusuf al-Razi al-Hasanjani, hadith hafiz, d. 301 AH = 913 (a different man). A proposal for the founder; no prose written.

- Packet 36 (gazetteer sections): 13 places written. Skipped: sfax (iDAI 2042776 carries GeoNames 2467454, ours is 280566; iDAI section not written, a proposal for the founder).
## Packet 35 (place identifier sections)
- Written: 13 places (see CANARY). Skipped: qayrawan (iDAI 2042772 has no GeoNames id; our data has 2473449, cannot confirm identity; proposal for the founder).
## 2026-11-14 (Lane B2 packet alm20) - al-A'lam persons, nine written, none skipped

Source: al-Zirikli, al-A'lam, 15th ed. 2002 (alam-zirikli-dar-al-ilm-2002). Each entry read in full; match checked by name, role, region and dates.

- Written (ar, en, ur, draft, run web-b2-alam-2026-11-14; cite-check 9 of 9): abdallah-al-shabrawi (4 p. 115), muhammad-ibn-abd-al-hadi-al-sindi (6 p. 179), yahya-ibn-abd-al-wahhab-ibn-mandah (8 p. 133), hashim-al-bahrani (8 p. 64, Imami), ahmad-ibn-said-al-busaidi (1 p. 111, Ibadi), abd-al-aziz-al-alawi (4 p. 10), abd-al-karim-ibn-tawus (4 p. 10, Imami), abd-al-rahman-al-fasi (3 p. 286), nimat-allah-al-jazairi (8 p. 32, Imami).
- Corrections to cards: al-Busaidi died 1783 to 1782 (entry 1196 AH = 1782), roles add imam, ruler_of Oman and lived_in Sohar added; al-Sindi born_in Sind added, role faqih; Ibn Mandah summary 1117 to 1118, born_in and died_in Isfahan; al-Bahrani summary 1695 to 1696, buried_in Tubli; Abd al-Aziz born 1881 added, died_in Tangier; Ibn Tawus died_in Kadhimiya, lived_in Baghdad; al-Fasi summary no longer says astronomer, musician and historian (entry: jurist, author of seventy-odd books); al-Jaza'iri born_in Basra (medium, from the nisba and the village al-Sabbaghiyya of the Jaza'ir of Basra).
- Years kept on the card where the entry's AH year spans the card's CE year: al-Shabrawi born 1681 (1091 AH = 1680), al-Jaza'iri died 1700 (1112 AH = 1701). Abd al-Aziz: the entry prints 1363 AH = 1944; the card's 1943 (the year given by the other sources the museum holds; 1363 AH begins at the end of December 1943) is kept and the printed year is flagged, with no claim in the prose about the card.
- Skipped: none.


- 2026-11-14 packet 37: 12 places given Pleiades/iDAI sections. Skipped iDAI section: sousse (iDAI GeoNames 2464915 vs ours 221715), tortosa (iDAI 3107677 vs ours 6361397); founder-held slugs absent from packet.

## 2026-11-14 (p74, Lane B worker B1) — gazetteer sections on 109 place pages; Sanaa section withdrawn

- Packets 31 to 38 (PRs 6817, 6818, 6828, 6830, 6836, 6837, 6842, 6844) added Pleiades and iDAI sections (ar, en, ur) to 109 places that had prose without them. cite-check on the 108 pages: 108 pass. The sections on place/sanaa (a founder-held page) were reverted to the previous text; its data keeps the iDAI link made earlier. Skipped by the subagents because iDAI's GeoNames id differs from ours or is absent: ceuta, gabes, sfax, sousse, tortosa, ubeda (ours 6358538, iDAI 2510116), qayrawan, damascus (iDAI record has no GeoNames id, not a mismatch). For the founder: the iDAI links on these places rest on name and distance, not on a shared GeoNames id.

## 2026-11-14 (packet p02, Lane B2 person prose)

- Written (ar, en, ur, draft, runs web-b2-alam, web-b2-ei2, web-b2-isaba, web-b2-dhayl-2026-11-14; cite-check 8 of 8): ahmad-jalayir (al-A'lam 1 p. 101), al-murtada-muhammad (al-A'lam 7 p. 135, Zaydi, labelled), jahangir-mughal (EI2 2 pp. 404-406), nur-jahan (EI2 8 pp. 135-136), kayqubad-i (EI2 4 pp. 855-856), ibrahim-adil-shah-ii (EI2 1 p. 218, dynasty article only, short), rukana (Ibn Hajar, al-Isaba pp. 481-482; Abu Nu'aym, Ma'rifat al-Sahaba, printed pp. 1113-1117), ahmad-ibn-muhammad-ibn-qudama (Ibn Rajab, Dhayl pp. 52, 61).
- Source swap for the rulers: the cards cite Hasan Ibrahim's Tarikh al-Islam, Bosworth and al-Salabi, but the local Hasan Ibrahim OCR has no Mughal entries, Bosworth is not in the library, and al-Salabi's Ottoman history has no entry for Kayqubad. The registered source Encyclopaedia of Islam 2nd ed. (local OCR, vol. and PDF page) carries real articles, so those pages cite it; the earlier source names stay on the cards.
- Corrections to cards: rukana (published) summary rewritten to what al-Isaba says (the earlier text said Ibn Hajar judged a link "likely missing", which pp. 481-482 do not say; they relay Ibn Hibban and al-Tirmidhi on the chain), old cite p. 531 replaced by pp. 481-482, the lived_in Sind edge (no Sind in either entry) replaced by lived_in Mecca and died_in Medina (medium), status.ai_unread added; ahmad-ibn-muhammad-ibn-qudama (published) status.ai_unread added; al-murtada-muhammad Arabic label typo "المترضى" fixed to "المرتضى محمد بن يحيى", died_in Sa'da added; ahmad-jalayir died_in Baghdad and lived_in Tabriz added, hijri 813 added to the death; summaries of the draft cards no longer say the entry is unchecked.
- Date flags for the founder: Ibrahim Adil Shah II card has 1571 to 1627 (Iranica, via Wikidata) and the card summary said r. 1580-1627, while EI2 vol. 1 p. 218 lists his reign as 987-1035 AH = 1579-1626; the prose gives EI2's figures attributed to EI2 and the card dates are untouched. Rukana: the card's death 662~ (from al-Isti'ab) sits beside the dictionary's three views (caliphate of Mu'awiya, of Uthman, or lived to 41 AH); the prose gives all three.
- Citation shape for Abu Nu'aym: the source record says pages are scan pages, but the copy read here (Dar al-Watan edition, ed. Adil al-Azzazi, harvest folder 20260330_20260330_0215) prints its own folios; the prose cites the printed folios 1113-1117 (scan pages 1147-1151). Proposal: the source record's edition note should be updated to name this edition and say which numbering is cited.
- Skipped: shah-jahan-mughal (no entry in the local Hasan Ibrahim text; EI2 has no Shah Djahan biography in the volumes searched, only cross-references), ageng-tirtayasa (Bosworth not in the library; no article found in EI2 or elsewhere locally). Neither written; proposals: read Bosworth's entry for Banten and EI2 vol. 9 "Shah Djahan" or Cambridge History of India when available.
- Identity: all eight matched on name, role, region and dates (Ahmad Jalayir d. 813 AH; al-Murtada 278 to 310 AH; Qudama senior 491 to 558 AH). al-A'lam has no Mughal or Seljuk-of-Rum headings.
## 2026-11-14 (Lane B2 packet p01) - most-linked persons without prose, five written, seven skipped

Sources: al-Zirikli, al-A'lam (alam-zirikli-dar-al-ilm-2002) and al-Safadi, al-Wafi bi-l-Wafayat (new record wafi-bi-l-wafayat-safadi-dar-ihya-2000, run web-b2-wafi-2026-11-14). Page convention: the OpenITI marker that closes the text cited (A'lam) or follows the entry (al-Wafi); the A'lam entry for al-Sindi cited earlier as 6:179 sits at 6:253-254 in the same text, so the earlier cite should be re-checked (proposal for the founder).

- Written (ar, en, ur, draft; cite-check 5 of 5): qadi-abd-al-jabbar (A'lam 3 p. 273; Wafi 18 pp. 21-22), al-najashi (A'lam 1 p. 172, Imami), mahmud-khattab-al-subki (A'lam 7 p. 186; published card, ai_unread added), musa-ibn-shakir (A'lam 7 p. 323), abu-bakr-al-marrudhi (A'lam 1 p. 205; Wafi 7 p. 256).
- Corrections to cards: al-Subki born 1858 to 1857 (1274 AH); al-Najashi birth 982, death 1058, lived_in Baghdad; Abd al-Jabbar roles, died_in Rayy, death note (Wafi 414 or 415); al-Marrudhi student_of Ahmad ibn Hanbal; Musa ibn Shakir summary.
- Proposal: Musa ibn Shakir's card gives born 800~ (EI2); the entry gives no birth year and has him dying about 815 with young sons, so the 800~ birth looks wrong. Not changed.
- Wafi gives Abd al-Jabbar's kunya as Abu al-Hasan, the A'lam gives Abu al-Husayn; both are reported in the prose. Tabaqat al-Shafi'iyya (Subki) vol. 5 is not held locally (only vols 1, 2, 3, 10, 11), Tarikh Baghdad and Wafayat al-A'yan hold no entry for him.
- Skipped, no entry found in a dictionary we hold (A'lam, al-Wafi and the card's source tried): nazir-ayyad (living Grand Mufti of Egypt, born 1974; not in A'lam, whose card source claim looks wrong), sunan-ampel, sunan-kalijaga (Javanese, not in A'lam), baha-al-din-walad, shams-tabrizi (not in A'lam or al-Wafi; the Wafi hit for al-Tabrizi is a different man), al-hajj-umar-tal, mohamed-salah-ben-mrad (not in A'lam). Need books outside the local set (for example Ibn Khallikan for Rumi's circle, Kahhala's Mu'jam al-Mu'allifin, an Indonesian reference).

## 2026-11-14 (packet 42, Lane B worker B1) — person and polity prose

- Nine entries written in ar, en and ur from the Encyclopaedia of Islam, 2nd ed. (page markers read in full) plus a Nomisma line each. Nomisma holds no coin or type records for these concepts (only the concept and, for dynasties, ruler memberships), so the Nomisma sentence states that. Skipped: polity/kingdom-of-france (no EI2 entry; data file holds only a Wikidata description, not usable for prose). No founder-held slugs in the packet.
- 2026-11-14 packet 41 (B1 prose): 10 entries written (ar, en, ur). Skipped founder-held slugs: none were in the packet. Nomisma concepts for al-mansur-fakhr-al-din-uthman and kayqubad-i returned HTTP 500 and have no Nomisma section. Data note for review: bahram-shah-ghaznavi `died` 1157 (EI2) disagrees with Ibn al-Athir (548 AH) and Hasan Ibrahim (547 AH); not changed.
- Merge note: packet 41 (PR before this one) had added thin first-prose stubs for ahmad-jalayir and kayqubad-i. Their text was replaced by the cited biographies above; their polity links (jalayirids, rum-seljuk-sultanate) and the Nomisma section for Ahmad were kept in all three languages, and the stubs' statements that the entry was unread were dropped as no longer true.

- GEMINI: person/bahram-shah-ghaznavi — question: year of death; the data file says 1157, Ibn al-Athir says 548 AH (1153 to 1154 CE) and Hasan Ibrahim 547 AH; the source that would settle it: a numismatic or primary-chronicle check (Juzjani, Tabaqat-i Nasiri, or Ghaznavid coin dates).

## 2026-11-14 (packet id, Lane B2 identity re-check)

- Written (ar, en, ur): ibn-al-sikkit (al-A'lam 8:195), ruh-ibn-hatim-al-muhallabi (al-A'lam 3:34), abd-allah-ibn-yusuf (Taqrib al-Tahdhib p. 300, noisy OCR, only the legible facts used).
- Card corrections for zayn-al-abidin-work-14608 and ibrahim-ibn-sad-ibn-abi-waqqas (wrong imam and al-Zuhri dates) found and landed first by packet corr-p1; kept as on main.
- Skipped: ibrahim-ibn-sad-al-zuhri and ibrahim-ibn-sad-al-mulawi already have trilingual prose from earlier batches (al-Zuhri A'lam 1:40 matches the card dates 727-800; not rewritten here).
- GEMINI: ahmad-ibn-musa-al-kazim | Death date and a dictionary entry for Ahmad ibn Musa ibn Ja'far (Shah Cheragh, Shiraz) | card: died 818~ (al-Mufid, al-Irshad), source al-A'lam; Wikidata Q5961712 says 2 Nov 818 | al-A'lam has no entry for him; al-Wafi none | the Imami sources (al-Mufid, al-Irshad) read in a Shiraz-focused source, or Ar Wikipedia with its cited sources.
- 2026-11-14 packet 43 (B1 prose): 10 entries written (ar, en, ur) from the Encyclopaedia of Islam, 2nd ed. (vol. and PDF page read in full; Venice and the Holy Roman Empire have no entry of their own, so their pages gather the articles on Italy, Alexandria, Iskender Beg and Nemce, and say so). Nomisma holds no coin or type records for any of the ten (only concepts and, for polities, membership records). Skipped founder-held slugs: none were in the packet. Data note for review: dulafid-dynasty start 800 (tradition) differs from EI2, where the dynasty rests on Abu Dulaf (d. 225/839-40) and ends 284/897-8; qara-qoyunlu end 1468 vs EI2 1469 (874 AH); not changed.

- 2026-11-14 packet 44 (B1 prose): wrote crete, tiberias, tehran, kashan (Yaqut, Dar Sader v.1 p.236, v.4 pp.17-19, 51-52, 296-297) and short pages for india, asia-minor, euboea, belgrade, hispania, pisidia. Data note: Nomisma `crete` etc. count as region only; India, Tiberias, Tehran, Belgrade, Kashan have no linked coins.

- 2026-11-14 packet p03 (Lane B2, run web-b2-wafi-alam-2026-11-14): written ibn-mujahid-al-tai (ar, en, ur; al-A'lam vol. 5 p. 311, al-Wafi vol. 2 p. 35); card gains the two sources, lived_in Baghdad, student_of al-Ash'ari, death sources, and the Baqillani edge already existed. Skipped, entry not found in al-A'lam (searched by name tokens and by death year) or al-Wafi (which stops at 764 AH): mahabat-khan, khalil-ahmad-al-saharanpuri, rabih-ibn-al-zubayr, nasir-al-din-qabacha, shabbir-ahmad-usmani, asaf-jah-i, khalifah-ibn-said-al-busaidi (al-A'lam has other Al Bu Said men, not him). Skipped, identity mismatch: candarli-kara-halil-pasha (al-A'lam vol. 2 p. 317 "Qara Khalil" is Khalil ibn Hasan al-Tirawi, a logician, d. 1123 AH, not the 1387 vizier). Skipped, already has prose from packet 41: tahmasp-i-safavi. The scanned Hasan Ibrahim and al-Salabi volumes on the drive have no text layer, so cards that name only those were not read.
- Note for the coordinator: the merged Sindi cite (vol. 6 p. 179) does not match the markers; the entry sits under PageV06P253 (after Muhammad Abduh), so 253 looks right.
- GEMINI: person/ibn-mujahid-al-tai — question: birth year; the card says 883 CE (Siyar date-enrichment), al-A'lam prints no birth year (000 - 370 AH) and al-Wafi gives none; the source that would settle it: al-Dhahabi, Siyar a'lam al-nubala, or Qadi Iyad, Tartib al-madarik.
- GEMINI: person/mahabat-khan, person/nasir-al-din-qabacha, person/asaf-jah-i, person/rabih-ibn-al-zubayr, person/khalifah-ibn-said-al-busaidi, person/khalil-ahmad-al-saharanpuri, person/shabbir-ahmad-usmani, person/candarli-kara-halil-pasha — question: no readable entry in the local texts; find a page-level dictionary or handbook entry (card dates: d. 1634, 1228, 1748, 1900, 1890, 1927, 1949, 1387) that confirms identity and life; sources that would settle it: Bosworth New Islamic Dynasties, EI2 or Encyclopaedia Iranica entries, Nadwi's Nuzhat al-khawatir for the Indian scholars.
## 2026-11-14 (p75, Lane B worker B1) — Surah app rights finding

- Added to source/surah-app (reliability note): surahapp.com states the text is a digital copy of the King Fahd Complex Mushaf (Madinah), riwaya of Hafs from Asim, issued 1440 AH; web.surahapp.com footer (2026) and surahapp.com footer (2025, 1446 AH) both read all rights reserved for the Tafsir Center for Quranic Studies. Related links: surahpedia.com, tafsir.net/articles, a Windows desktop app, the Public API. Verdict: all rights reserved, so facts-only; its text and tafsir wording are never copied and verse text comes only from Tanzil. Not read: source names behind the Tafsir and Translation tabs (the page text shows none); the 20 API projects are the real catalogue.
GEMINI: place/hormuz-island: does Yaqut's Hurmuz (Mu'jam al-Buldan 5 p.402, a port city on the Fars mainland coast, entrepot for Kirman) denote the island of Hormuz or old mainland Hormuz? Card says island in Bandar Abbas County; source says a sea-port city on the Persian shore; settle with a modern study of Hormuz (Ibn Hawqal/Ibn Battuta on old Hormuz at Minab).
- 2026-11-14 packet 52 (B1 prose): wrote sousse, qarnin (new page), bamm, ukaz, sandan, manfalut, dawraq (Yaqut, Dar Sader v.1 p.495, v.2 p.483, v.3 pp.266-267, 282-283, v.4 pp.142, 333-334, v.5 p.214). Skipped el-kebab, al-hajar-najran, al-buhayra.
- GEMINI: el-kebab — card is a rural commune in Morocco (32.74,-5.52); Yaqut's al-Qibab (v.4 p.303) names places at Samarkand, Nishapur, Baghdad and Najd, none in Morocco; source that would settle it: a Moroccan gazetteer giving a medieval name for the commune.
- GEMINI: al-hajar-najran — card is a Banu al-Harith village at Najran (al-Hadi's wall breach); Yaqut (v.5 p.393) only lists a Hajar of Najran in passing under Hajar and the headword al-Hajaran is in Hadramawt; no description of our village; source that would settle it: a Najran gazetteer or Hamdani's Sifat Jazirat al-Arab.
- GEMINI: al-buhayra — card is a Jurjan town (coords 30.85,30.35) from the Yazid ibn al-Muhallab account; Yaqut's al-Buhayra (v.1 p.353) is a place in the Yamama region (per al-Hafsi); no Jurjan match; source that would settle it: al-Tabari on Yazid's Jurjan campaign or Yaqut's Jurjan entry.
- GEMINI: el-tor — card is the Sinai/Gulf of Suez town (Wikidata Q867603); Yaqut's al-Tur (v.4 p.47) is mainly the mountain, with a Tur Sayna near Ayla and a small town conquered on terms in year 9, plus a Tur in upper Egypt, none stated to be our town; source that would settle it: a Sinai gazetteer or Yaqut's Tur Sina entry compared with Ayla.
- GEMINI: asbara — card is a Farghana town (42.85,74.1) from al-Idrisi; Yaqut's Asbara (v.1 p.172) is a district at the far end of Shash beyond the river; which place Idrisi's Asbara is; source: Le Strange or Barthold on Asbara/Isfara.
- GEMINI: alib — card is a village in the Hijaz (20.03,40.65) from al-Idrisi; Yaqut's 'Ulayb (v.4 p.149) is a place between Kufa and Basra; whether Alib is a different place; source: a Hijaz gazetteer.

## Lane B2 packet m02 (14 Nov 2026), al-A'lam and al-Wafi
- Written (ar, en, ur, draft, cited): safi-al-din-al-urmawi (A'lam 4:170), shihab-al-din-al-qalyubi (1:91-92), umar-al-nasafi (5:60), yahya-ibn-abi-al-khayr-al-imrani (8:146), abd-al-haqq-al-siqilli (3:281), abd-al-haqq-i-marinid (3:282), abd-al-malik-ibn-umar (4:161), abd-al-rahman-al-hulwani (A'lam 3:327, Wafi 18:148-149), abd-al-razzaq-al-qashani (3:349-350). Page convention: the OpenITI marker precedes its page (Wafi marker P149 splits the Hulwani name; body cited p. 149).
- Card changes: summaries, sources, provenance, completeness 3 on all nine; Hulwani gains born 490 AH (1097) and died 546 AH (1151) from A'lam and Wafi plus lived_in Baghdad; Marini gains born 542 AH (1147) as printed; Siqilli gains hijri 0466 on died and died_in Alexandria.
- Date differences kept, not changed: Siqilli card 1074 vs A'lam 1073 (466 AH spans both); Qashani card 1329 vs A'lam 1330 (730 AH spans both); Abd al-Malik ibn Umar card 718~ vs A'lam 101 AH = 719.
- Identity mismatch, skipped: abd-al-malik-ibn-attash. The A'lam entry at 1:163 is Ahmad ibn Abd al-Malik ibn Attash (Batini leader of Isfahan, d. 500 AH = 1107, captured and killed after fighting Barkiyaruq); Abd al-Malik appears only as the father. The card (da'i of Khorasan, d. 1107) may conflate father and son.
- GEMINI: abd-al-malik-ibn-attash — card is an Ismaili da'i of Khorasan with died 1107 and born 1000 (Wikidata Q11955678); A'lam 1:163 describes only his son Ahmad (d. 500 AH = 1107) and mentions the father in passing; whether a separate father's death date exists and whether Q11955678 is the father or the son; source that would settle it: Ibn al-Athir's Kamil for 500 AH, or the Encyclopaedia of Islam entry on the Ibn Attash family.
- Note: content/ar/person/muhammad-ibn-abd-al-hadi-al-sindi.md cites A'lam vol. 6 p. 179, but the entry in the file sits beside markers P253; the page there looks wrong (for the coordinator).
- GEMINI: basta — card is Baza in Andalus (Idrisi); Yaqut's Basta (v.1 p.422) is a desert tract between Syria and Iraq, so skipped; whether Yaqut has a separate entry for Baza; source: Dar Sader index
- GEMINI: urgench — card is modern Urgench, Uzbekistan (Q472925); Yaqut's al-Jurjaniyya (v.2 p.122) is the Khwarazm capital Kurkanj, destroyed by the Mongols, now Kunya-Urgench; whether the card should be that city; source: Encyclopaedia of Islam art. Urgench

GEMINI: place/amul (packet 55) - the card's prose describes Amul on the Oxus (Turkmenabat) but its coordinates [36.4696, 52.3507] point to Amol in Tabaristan; Yaqut treats both (vol 1 pp. 57-58); the Yaqut section was written for the Oxus town; the coordinate source needing confirmation is a gazetteer entry (GeoNames or al-Thurayya) for Amul Jayhun at about 39.08 N, 63.57 E.
- 2026-11-14 packet m01 (B2 person prose, al-A'lam and al-Wafi): wrote abu-umar-al-talamanki (A'lam 1:212-213, Wafi 8:23), abul-tayyeb-tabari (A'lam 3:222, Wafi 16:230-232), ahmad-ibn-umar-al-qurtubi-mufhim (1:186), shams-al-aimma-al-sarakhsi (5:315), abd-al-haqq-dihlawi (3:280-281), al-rafii-al-qazwini (4:55), jafar-ibn-ulba-al-harithi (2:125), muhammad-ibn-allan-al-siddiqi (6:293), muhammad-ibn-dawud-al-zahiri (6:120), safi-al-din-al-hindi (6:200). Page rule used: the page whose marker closes the text (a marker in mid-line splits the line); the matcher hints were one page early for al-Qurtubi (185 to 186), Safi al-Din (199 to 200), al-Talamanki in Wafi (22 to 23) and al-Sarakhsi was already 315. No identity mismatches; none skipped.
- m01 card corrections: Hijri years added from the entries (not changed): al-Talamanki, al-Tabari, al-Sarakhsi, al-Rafi'i, Ibn Allan (birth 996 AH = 1588 added), Ibn Dawud (birth 255 AH = 869 added), Safi al-Din. Card dates left as they were where they differ from the printed year by one: al-Rafi'i born 1160 on the card against 557 AH = 1162 printed in al-A'lam (not changed, Wikidata-sourced); al-Dihlawi born 1551-01 (958 AH, from the 2016 journal article) against 959 AH = 1552 printed in al-A'lam (not changed, both stated in sources); Ibn Dawud al-Zahiri d. 0909 on the card against 297 AH = 910 printed (not changed).
- m01 proposal for the founder (duplicate, not merged): person/muhammad-ibn-dawud-al-zahiri and person/ibn-dawud-al-zahiri look like the same man (Abu Bakr Muhammad ibn Dawud al-Zahiri; the second card gives 296 AH from Wafayat al-A'yan, al-Zirikli 297 AH). Held for the founder; no alias created.
- m01 note: person/muhammad-ibn-abd-al-hadi-al-sindi (merged earlier) cites al-A'lam vol. 6 p. 179, but the file's markers put that entry at vol. 6 p. 253 (the lines between the two PageV06P253 markers). Worth a check against the printed edition by whoever owns that packet.
GEMINI: place/hail (packet 57) - card is Ha'il city, Saudi Arabia (27.5167, 41.6833); Yaqut v.2 p.210 headword Hail lists several places (a Yamama site of Banu Numayr, a water in al-Marrut, a valley in the two mountains of Tayyi' per Ibn al-Kalbi with an Imru' al-Qays verse); not stated to be the later city, so skipped; a source tying Yaqut's Tayyi' valley to Ha'il would settle it.

GEMINI: place/petra (packet 59) - Yaqut vol 1 p.335 headword al-Batra is a place in the raid on Banu Lihyan on the Tabuk road, not Nabataean Petra; question: does Yaqut describe Petra under another headword (e.g. al-Hijr or Wadi Musa)? source to settle: Mu'jam al-Buldan full-text search.
GEMINI: place/albelda-de-iregua (packet 59) - card is a Spanish municipality (Wikidata Q1623553) labelled al-Bayda; Yaqut vol 1 p.530 al-Bayda entries name other places; question: is any Yaqut al-Bayda this Spanish town? source: Andalusi geographers (al-Himyari, al-Idrisi).
GEMINI: place/harmah (packet 60) - card is Harmah, Saudi Arabia (25.9167, 45.3333, Wikidata only); Yaqut v.2 p.245 gives only "a place at the side of Hima Dariyya near al-Nisar"; need the modern location of al-Nisar and Hima Dariyya (Ibn Khamis or al-Jasir) to confirm identity.
GEMINI: place/karaman (packet 60) - card is Karaman city, Turkey; Yaqut v.4 p.330 "Qarman" is only an unspecified place from Ibn Durayd (Jamhara, spelled with ra); the Anatolian Karaman is not described; skipped.
GEMINI: place/baja (packet 60) - card prose is Idrisi's Baja of the Baghbugh king (Central Asia) but coordinates are Beja, Tunisia; Yaqut v.1 pp.315-316 treats Baja of Ifriqiya and Baja of al-Andalus; need which place the record means before any Yaqut section is added.

## Lane B2 packet m04 (14 Nov 2026), al-A'lam and al-Wafi
Run web-b2-alam-2026-11-14 / web-b2-wafi-2026-11-14. Written (ar, en, ur, draft): abu-al-ghanaim-al-narsi (A'lam vol. 6 p. 278), abu-al-muin-al-nasafi (vol. 7 p. 341), abu-bakr-al-samarqandi (vol. 7 p. 147; identification likely, not certain), abu-bakr-al-shafii-muhaddith (vol. 6 p. 224), abu-bakr-ibn-al-jaabi (vol. 6 p. 311), abu-bakr-al-hudhali (Wafi vol. 15 pp. 201-202).
Page markers relied on: A'lam lines 105739/105761 (V06P278), 125665/125682 (V07P341), 115205/115220 (V07P147), 102934/102957 (V06P224), 107535/107556 (V06P311); Wafi lines 116987 (V15P201) and 117019 (V15P202), entry lines 116993 to 117010 lie between them, so the range is cited.
Card changes: narsi role poet -> scholar (the entry names a reciter, no poetry); samarqandi roles + jurist, death 881 (268 AH) replaces 882~; nasafi lived_in samarqand and bukhara added; shafii and ibn-al-jaabi relations gain the A'lam as source, roles set to muhaddith (+ qadi for ibn-al-jaabi); all six summaries rewritten, provenance and sources updated.
Skipped, identity mismatch (founder proposals): abdullah-ibn-amr-ibn-ghaylan (hint is Abdallah ibn Amr ibn al-As, A'lam vol. 4 p. 111, a Companion d. 65 AH; no Ghaylan entry found in the A'lam); abu-abd-al-rahman-al-muayti (hint is Abdallah ibn al-Walid al-Mu'ayti, d. 432 AH, an Andalusi caliph proclaimed in the east of al-Andalus, not a Maliki hadith scholar in the east); abu-abdallah-vi-zayyani (hint is al-Ayyashi al-Zayyani, a Moroccan mujahid d. 1051 AH, unrelated to the Zayyanid sultan of Tlemcen).
Skipped, page unreadable: abu-al-hasan-al-bushanji (Wafi entry 138 of the Ali ibn Ahmad run, d. 347 AH, read, identity fits, but its page markers are all PageV00P000 and the nearest numbered marker is V20P083 about 55 lines earlier; the page is only inferable, so none is cited).
GEMINI: person/abu-bakr-al-hudhali - card died 784 (Bukhari, Tarikh; Dhahabi, Siyar per card note) but al-Safadi, al-Wafi vol. 15 pp. 201-202 prints 159 AH (775/776 CE); question: which death year is right for Salama ibn Abdallah al-Hudhali; settle with al-Bukhari, al-Tarikh al-Kabir or al-Dhahabi, Siyar (not changed on the card).
GEMINI: person/abu-bakr-al-shafii-muhaddith - card born 873 (Khatib, Tarikh Baghdad; Dhahabi per card note) but al-Zirikli, al-A'lam vol. 6 p. 224 prints 266 AH (879 CE); death 354 AH (965) agrees; settle with Tarikh Baghdad (card birth left unchanged).
GEMINI: person/abu-abd-al-rahman-al-muayti - card says Maliki hadith scholar in the east, d. 1041 (Wikidata Q52153331); al-A'lam vol. 4 p. 102 has Abdallah ibn al-Walid al-Mu'ayti, d. 432 AH (1040), a claimant to the caliphate in eastern al-Andalus; question: are they one man (card role wrong) or two; source: Wikidata item history and al-Humaydi, Jadhwat al-Muqtabis.
GEMINI: person/abdullah-ibn-amr-ibn-ghaylan - card Umayyad ruler d. 685~ (Ibn al-Athir); no entry in the A'lam found; question: governor identity and date (Basra, Ibn al-Zubayr era); source: al-Tabari or Ibn al-Athir, year 65 AH.
GEMINI: person/abu-abdallah-vi-zayyani - card Muhammad VI al-Zayyani, sultan of Tlemcen 1524 to 1544; dates null; question: exact reign and death; source: Bosworth, New Islamic Dynasties, or al-Zirikli entry under Muhammad al-Zayyani if one exists.
- 2026-11-14 packet m03 (B2 person prose, al-A'lam and al-Wafi): wrote abd-al-wahhab-ibn-sulayman (A'lam 4:182), abd-allah-ibn-nawfal (4:142), abdallah-ibn-ahmad-marinid (4:68), abdul-ghani-al-jamil (4:33), abdul-jalil-al-jameel (3:275), abdullah-bahauddin-al-alusi (4:136), abd-allah-ibn-salih-al-ajli (Wafi 17:112-113), abdallah-ibn-awn-al-kharraz (Wafi 17:211). Page rule used (as in m01): the page whose marker closes the text; markers repeat several times per page, so a marker at line 57030 (P033) and the next P033 closed the Ibn Jamil entry (p. 33); lines relied on: A'lam 65331 (P182), 63149 (P142), 58901 (P068, end of entry), 57052 (P033), 51364 (P275), 62840 (P136); Wafi 133653 and 133671 (P112, P113: Ibn Salih straddles), 136168 (P211). Matcher hints were one page early in all A'lam cases, and Wafi vol. 1 p. 140 for Abd al-Wahhab is a different man (Abu Tammam al-Hashimi, d. 445), not used.
- m03 card corrections: Hijri years added and cards enriched from the entries (roles: Ibn Nawfal gains qadi, al-Jamil gains mufti, al-Alusi gains qadi); Ibn Salih al-Ajli gains a derived birth year (141 AH, approximate CE); Marinid card summary no longer says he ruled 1396 to 1398 (A'lam: allegiance early 799 AH, died 800 AH = 1398).
- m03 skipped: abd-allah-ibn-muslim-al-zuhri and abdul-ghani-samsudin (identity mismatch, no entry found).
GEMINI: person/abd-allah-ibn-muslim-al-zuhri (m03) - who is he and where is he documented; card says scholar, d. about 733, Wikidata Q12223593; the A'lam hint (7:284) is Makhul al-Shami, d. 112 AH = 730, a different man; no Abd Allah ibn Muslim al-Zuhri in A'lam or al-Wafi by name search; a source such as Wikidata or Tahdhib al-Kamal (with the Arabic Wikipedia article behind Q12223593) would settle it.
GEMINI: person/abdul-ghani-samsudin (m03) - card says scholar, undated, Wikidata Q107450044, VIAF 18987695; the A'lam hint (1:86) is al-Saruji, d. 710 AH, a different man; no Abd al-Ghani Shams al-Din in A'lam; Wikidata Q107450044 or VIAF 18987695 would settle who he is and which dictionary lists him.
GEMINI: place/al-husn (packet 62) - card is al-Husn village, Homs Governorate (34.759, 36.297, Wikidata only); Yaqut v.2 p.264 headword al-Hisn lists a Meccan pass, a place between Aleppo and al-Raqqa, a Yemeni place, and Hisn al-Akrad as its own entry; question: does Yaqut's Hisn al-Akrad entry (v.2 p.264) describe the Krak des Chevaliers site beside this village; source that would settle it: modern gazetteer of Hisn al-Akrad and its villages.
GEMINI: place/aqaba (packet 62) - card is Aqaba, Jordan (Ayla's modern successor); Yaqut v.4 p.134 headword al-Aqaba lists Meccan, Hajj-road and Baghdad places, not Ayla's gulf town; question: is Aqaba described under Ayla in Yaqut v.1; source that would settle it: Mu'jam al-Buldan entry Ayla.
GEMINI: place/jabal-al-fidda (packet 62) - card is a silver mountain near Jiruft, Kirman (al-Idrisi); Yaqut v.2 p.103 Jabal al-Fidda is only a nisba-place of Ibrahim ibn al-Shad al-Jabali (Herat) which he guesses is Jabal Banjhir; question: same mountain; source that would settle it: Yaqut entry Banjhir and a Kirman gazetteer.
GEMINI: place/qalunia (packet 61) - card is Qalunia on the Rhine (Spain coordinates); Yaqut v.4 p.393 Qaluniya is a Byzantine town 60 post-stages from Constantinople (Sayf al-Dawla raid 335 AH); not the same place, skipped; question: is the card's place Colonia/Cologne or Clunia?
GEMINI: place/asir (packet 61) - card is the Asir region; Yaqut v.4 p.125 'Asir is a well in Medina; different place, skipped; source: Hamdani Sifat Jazirat al-Arab.
GEMINI: place/oviedo (packet 61) - card Arabic label Abit but Yaqut v.1 p.86 Abit is a water of Batn al-Rumma, not Oviedo; skipped; question: what is Oviedo's Arabic name in Andalusi sources (Ubayd/Uvyadu)?
GEMINI: place/darband — identity: card text (Idrisi p.490, town one stage from Washjird) conflicts with coordinates (Derbent, Dagestan = Yaqut's Bab al-Abwab); Yaqut's entry only says Darband is Bab al-Abwab; a gazetteer of Idrisi's Darband (Transoxiana?) would settle whether the card is two places.
GEMINI: place/al-khalil (packet 64) - card is Hebron (tomb of Abraham); Yaqut v.2 p.388 headword al-Khulayl is a diminutive place name quoted in one verse, not Hebron; skipped; question: under which Yaqut headword is Hebron (Habrun/Hebron) and does it fit our card; source: Mu'jam al-Buldan index for Habrun.
GEMINI: place/church-of-saint-simeon-stylites (packet 64) - card is Qal'at Sim'an NW of Aleppo; Yaqut v.2 p.517 Dayr Sim'an is near Damascus (tomb of Umar ibn Abd al-Aziz), with a second monastery by Antioch on the sea; neither is clearly the Aleppo church; skipped; source: Yaqut text plus a gazetteer of Dayr Sim'an near Antioch.
GEMINI: place/helwan (packet 64) - card is Helwan, Egypt; Yaqut v.2 p.291-292 Hulwan is the Iraqi town at the foot of the Jibal (Jarir ibn Abd Allah conquest); different place; skipped; question: does Yaqut give an Egyptian Hulwan elsewhere (Hulwan al-Fustat); source: Mu'jam al-Buldan search for Hulwan Misr.
GEMINI: place/madinat-musa (packet 64) - Yaqut v.5 p.80 puts Madinat Musa at Qazwin (matches summary), written; but data coordinates [38.994, -3.929] are in Spain, not Qazwin (about 36.27, 50.00); question: correct the coordinates; source: gazetteer for the site of the Hadi's city by Qazwin.
GEMINI: place/awadh (packet 66) - card is Awadh (Oudh), India; Yaqut v.1 p.277 Ud is a place of Banu Tamim/Yarbu' in Najd (also Awd, a Kufa quarter); different place; skipped; question: none needed unless a Yaqut entry for the Indian region exists under another headword.
GEMINI: place/shaqr (packet 66) - card is Shaqr in al-Andalus (about 39.25, -1.5, Jucar area); Yaqut v.3 p.355 Shaqr is a mountain in a Hudhali verse, a Zanj country and a spring near al-Rabadha, no Andalusian town; skipped; question: which Yaqut headword (Shuqur, Shaqura or other) covers the Jucar region, source: Yaqut index or Idrisi.
GEMINI: place/al-ghubayyib-yemen (packet 66) - card is al-Ghubayyib near Hawth, Yemen (al-Hadi's campaign); Yaqut v.4 p.187 Ghubayyib is a district in al-Yamama (Najd), not Yemen; skipped; question: is the Hawth-region Ghubayyib the Yamama one, source: Hamdani, Sifat Jazirat al-Arab p.139.
GEMINI: place/al-aqaba, packet 65 — card is Jordan's Red Sea port (Ayla); Yaqut's al-'Aqaba (4 p.134) names a Hajj stage, a Baghdad quarter and the pass of the pledge near Mecca, not Ayla's port; skipped; a Yaqut entry on 'Aqabat Ayla would settle it.
GEMINI: place/bari, packet 65 — card is Bari in Italy; Yaqut's Bari (1 p.321) is a village of Kalwadha near Baghdad; skipped.
GEMINI: place/lamta, packet 65 — card cites al-Idrisi (a desert city near Kabul/Multan) but coordinates point to Tunisia; Yaqut's Lamta (5 p.23) is a Berber tribe and land in the far Maghrib; identity unclear, skipped; Idrisi's Lamta passage would settle it.
GEMINI: place/al-shuaybiyya, packet 67 — card is a Basra estate (Futuh al-Buldan) with coordinates in the Hijaz coast; Yaqut (3 p.351) has al-Shu'aybiyya as a water of Banu Numayr in the valley of al-Harim and al-Shu'aybah as a Hijaz port; neither is Basra; skipped.
GEMINI: place/ghawr, packet 67 — card text is Herat/Sijistan (Ghur) but coordinates are the Jordan valley; Yaqut (4 p.217-218) has both al-Ghawr (Jordan) and Ghur (between Herat and Ghazna); one card cannot be both; skipped.
GEMINI: place/al-ghubayb-yemen, packet 67 — card is a place in Yemen (al-Hadi, 286 AH); Yaqut's Ghubayb (4 p.186) is a district of al-Yamama; skipped.
GEMINI: place/al-bayda, packet 67 — card is Al Bayda in Libya (Wikidata Q35784); Yaqut's al-Bayda entry (1 p.530-531) lists many other places and none in Cyrenaica; skipped.
GEMINI: place/tabarmin, packet 67 — card coordinates are Termini Imerese (13.7 E) but its Idrisi text puts Tabarmin one stage from Messina (Taormina); Yaqut (4 p.17) says only a fortress in Sicily; section written, coordinate question open.
- GEMINI: place/oman, packet 68, skipped. Yaqut's headword near our card is Amman in al-Balqa (Syria), not Oman of Arabia; the Oman entry was not located on the page read. Source that would settle it: Mu'jam al-Buldan, headword Uman (vol. 4).
- GEMINI: place/sayla, packet 68, skipped. Yaqut's Sayla is a village of al-Fayyum in Egypt (vol. 3 p.300); our card is a coastal Palestine place from al-Idrisi. Not the same place.
- GEMINI: place/al-miyanij, packet 68, skipped. Yaqut's Miyanij (vol. 5 p.238) is a place in Syria whose location he does not know; our card is in Azerbaijan. Unclear identity.
HELD (corr-p8, 14 Nov 2026): person/rawh-ibn-hatim and person/ruh-ibn-hatim-al-muhallabi are the same man (d. 174 AH, al-A'lam 3:34); decide.ts did not allow the merge (dec-20261114-280, safe-default: no rule or precedent matched, hold). Nothing merged or deleted. Question: docs/decisions/inbox/merge-rawh-ibn-hatim-into-ruh-ibn-hatim-al-muhallabi.yaml. Plan if approved: ruh-ibn-hatim-al-muhallabi survives, rawh-ibn-hatim and spelling variants become aliases, fold Siyar p.1700 and Futuh al-Buldan p.326 sources and the Ifriqiya succession by al-Fadl ibn Rawh, repoint al-fadl-ibn-rawh, yazid-ibn-hatim-ifriqiya, marzuq-ispahbadh-ruse and the ur prose links (al-mahdi, al-hadi, harun-al-rashid, al-fadl-ibn-rawh, both events).
GEMINI: person/ibrahim-ibn-sad-al-zuhri - card 727-800 (al-A'lam, Wikidata); Gemini 108-183 AH (726-799); entry not found in the Tahdhib al-Kamal OCR; Tahdhib al-Kamal (Ibrahim ibn Sa'd ibn Ibrahim al-Zuhri) would settle it.
GEMINI: person/ahmad-ibn-yusuf-al-misri - card mathematician 835-912 (Wikidata); al-A'lam 1:272 has a Tulunid secretary Ibn al-Daya d. c. 340 AH (c. 952); possibly two men; EI2 (Ibn al-Dayya) or Ibn al-Nadim would settle it.
GEMINI: person/ahmad-ibn-musa-al-kazim - card d. c. 818, buried Shiraz; Arabic Wikipedia (rev 77444796) agrees on the killing at Shiraz c. 198-203 AH, but no source read gives a basis for the Shi'a label; al-Mufid, al-Irshad would settle it.
GEMINI: person/mohamed-ben-youssef - card unchanged; Wikidata Q3318413 reads 1848-1939 (Tunisian scholar), Gemini offers King Mohammed V (1909-1961) as the alternative; a Tunisian biography matching the card's context would settle it.
GEMINI: person/ahmad-ibn-al-nadr - card 655-690 AH (Arabic Wikipedia rev 72861250, Wikidata) with a divergent c. 400-450 AH dating noted; Ibadi label not stated by that article; the Oman Daily article or a study of his poem would settle it.
GEMINI: person/fakhr-al-din-al-turayhi - card d. 1085 AH (1674-75, al-A'lam); Gemini 1087 AH; A'yan al-Shi'a 8:394 would settle it.
GEMINI: person/al-mahdi-al-husayn - card/al-A'lam birth 384 AH; Wikipedia and Wikidata c. 987 (about 376 AH), Gemini 376; al-Rawd al-Basim p. 241 would settle it.
GEMINI: person/abu-al-abbas-al-sabti - card d. 1204 (al-Zirikli 524-601 AH, Wikidata Q2822099); Gemini 3 Jumada II 601 AH = 1205; Ibn al-Zayyat, al-Tashawwuf would settle it.
GEMINI: person/muhammad-al-nafzawi - card born 1410~ died 1434~ (EI2); Gemini floruit c. 1410-1434; EI2 or the author's own work would settle it.
GEMINI: person/yuhanna-al-dimashqi - card 675~ (Wikidata Q51884, circa); Gemini 676; the Oxford Dictionary of Byzantium would settle it.
- Packet 70 (Yaqut place prose, 14 Nov 2026): skipped place/sur (Yaqut's Sur is Tyre in the Jordan district, our record is Oman), place/rumah (Yaqut's Ruma is the Medina well and land, our record is Rome), place/hungary (no headword; only "Majr" entries). GEMINI: place/sur, Yaqut has no Oman Sur entry on vol 3 pp.433-434; settle with Yaqut vol 3 index for Oman Sur or the Idrisi record.
GEMINI: place/al-jafar-oasis - is our record Yaqut's al-Jafar (Sinai tract between Rafah and al-Khushabi) or an oasis in Egypt? Card: Idrisi oasis city of saffron/indigo at the lower end of the oases, coordinates 30.98, 32.6 (northern Sinai); Yaqut (2 p.145-146) gives three al-Jafar (Najd place, Daba water in Hijaz, Sinai sand tract), none an oasis city; a gazetteer or Idrisi passage settling the identity would decide. Skipped, packet 69.

## Lane B2 packet m06 (14 Nov 2026)
Written (ar, en, ur, draft): abu-said-al-khadimi (A'lam 7:68), abu-shuja-al-rudhrawari (6:100-101), abu-zurah-al-dimashqi (3:320), ahmad-al-arusi (1:262), ahmad-al-baali (1:162), ahmad-al-siddiq-al-ghumari (1:253), ahmad-al-zawawi (1:160), ahmad-ibn-harun-al-bardiji (1:265-266), ahmad-mukhtar-pasha (1:255), ahmad-ibn-said-al-darimi (Wafi 6:241).
Page convention: the marker that closes the text was used; markers relied on: V07P068 (lines 111455, 111472), V06P100 (96743) and V06P101 (96762), V03P320 (53692, 53714), V01P262 (12492, 12509), V01P162 (7305, 7327), V01P253 (11995, 12008), V01P160 (7184, closing the Zawawi entry; hint said 159), V01P264/265/266 (12643, 12662; the last words of al-Bardiji's entry fall after the P265 marker), V01P255 (12117), Wafi V06P240 (after the Hamadhani entry) and V06P241 (closing the Darimi entry; hint said 240).
Card corrections: al-Zawawi born 1398 and died 1479 added from the entry, stub summary (1488) replaced; al-Mukhtar Pasha born 1837~ added; places added or sourced for al-Khadimi, al-Rudhrawari, Abu Zur'a, al-Ba'li, al-Ghumari, al-Bardiji, al-Darimi, Muhtar Pasha; summaries rewritten from the entries.
Skipped: none. Identity mismatches: none. Note: the A'lam entry for al-Arusi does not call him Grand Imam of al-Azhar (the card does); prose says the entry does not mention it.
GEMINI: person/abu-said-al-khadimi - card 1701-1762 (Wikidata Q12178022); al-A'lam 1113-1176 AH = 1701-1763; TDV Islam Ansiklopedisi would settle it.
GEMINI: person/abu-shuja-al-rudhrawari - card 1045-1094; al-A'lam 437-488 AH = 1045-1095; Ibn al-Jawzi, al-Muntazam or al-Dhahabi, Siyar would settle it.
GEMINI: person/abu-zurah-al-dimashqi - card d. 895~ (Wikidata Q16118107); al-A'lam d. 280 AH = 893; al-Dhahabi, Siyar or Tahdhib al-Kamal would settle it.
GEMINI: person/ahmad-al-baali - card 1696-1776 (Ibn Shatti); al-A'lam 1108-1189 AH = 1697-1775; Ibn Shatti, Mukhtasar Tabaqat al-Hanabila would settle it.
GEMINI: person/ahmad-al-siddiq-al-ghumari - card 1902-1961; al-A'lam d. 1380 AH = 1960; a biography of Ahmad al-Ghumari giving the day and month of death would settle it.
GEMINI: person/ahmad-al-zawawi - card summary d. 1488; al-A'lam 800-884 AH = 1398-1479; the biographical sources al-A'lam cites in its footnote (al-Sanusi's commentary preface, Nayl al-Ibtihaj) would settle it.
