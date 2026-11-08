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
