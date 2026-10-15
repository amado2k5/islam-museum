# 08 · Prior art — what exists, what to reuse, what is missing

Survey as of October 2026 (web research; items marked *verify* could not be confirmed from the source page). Use this to decide what to **ingest**, **link**, **partner with**, or **learn from**. Since 15 October 2026 (`docs/sources-policy.md`) every text source in this survey, whatever its licence, may be read and rewritten in the museum's own words with a citation; "link" and "cite only" below now describe what may be republished verbatim, not what may be read.

## 1. Digital museums and collections of Islamic art and heritage

| Project | What | Openness | Verdict for us |
|---|---|---|---|
| **Met Museum Open Access** — metmuseum.org/openaccess, API + CSV on GitHub | ~490k public-domain images and records; Islamic Art department filterable | **CC0** images and data; REST API | **Ingest** (objects, media). Best single legal source of Islamic-art images. Dates are free text plus begin/end ints. |
| **Smithsonian Open Access (NMAA / Freer–Sackler)** — si.edu/openaccess | ~2.8M CC0 images; NMAA ~46k objects with strong Islamic holdings | **CC0** per record; API via api.data.gov key | **Ingest** with CC0 filter. |
| **Walters Art Museum** — github.com/WaltersArtMuseum; OPenn manuscripts | >10k records; famous Islamic manuscripts | Images **CC0**; static CSV dumps; OPenn TEI metadata (GFDL) | **Ingest** manuscripts; API v1 closed, use CSVs. |
| **Qatar Digital Library (QNL + British Library)** — qdl.qa | 1.6M+ pages: Gulf archives and Arabic scientific manuscripts | **IIIF manifests**; per-item PD/CC marking | **Link/embed** via IIIF; read rights per item. Best IIIF source for Arabic manuscripts. |
| **Museum of Islamic Art Doha / Qatar Museums online collections** — collections.qm.org.qa (2025) | ~1,600 curated objects, EN/AR, some 3D | No API, no open license | **Link**; partner later. |
| **Aga Khan Museum** — agakhanmuseum.org | ~1,200 objects; free "Islamic Art 101" course | Images **CC BY-NC**; no API | **Link**; NC images admissible on an ad-free site but keep isolated. |
| **Archnet (MIT Aga Khan Documentation Center)** — archnet.org | 8,500+ sites, 125k media, 9,500 publications on architecture of Muslim societies | Free, per-image rights, no public API | **Link** every `building` to its Archnet ID; richest architecture gazetteer. |
| **Discover Islamic Art (Museum With No Frontiers)** — islamicart.museumwnf.org | 2,443 artefacts and monuments from 29 countries; 18 virtual exhibitions; EN/AR/FR/ES | No API; copyright MWNF | **Learn from** (closest existing pan-Islamic virtual museum; Mediterranean-centric; 2000s UI; no linked data). |
| **David Collection (Copenhagen)** — davidmus.dk | Major European Islamic collection organised by dynasty/region | No open license or API found | **Link**; copy its dynastic framing. |
| **Islamic Arts Museum Malaysia** — iamm.org.my | 7k+ objects; virtual tours | No online catalogue/API | **Partner** target; Southeast Asian art is nearly absent from open data. |
| **Google Arts & Culture** — Islamic partner stories, MIA Doha gigapixels, Historic Jeddah | Proprietary | **Link** only. |
| **Muslim Heritage / 1001 Inventions (FSTC)** | Popular science-and-technology-in-Muslim-civilisation articles | Copyright | **Link**; treat claims with care (criticised for over-claiming). |
| **Smarthistory "The Islamic World"** | Art-history essays | **CC BY-NC-SA** | **Ingest with isolation** for object context. |
| **Ithra "Hijrah" exhibit; Prophet's Biography Museum (Madinah); Darah platform** | Saudi immersive/360 exhibits and archives | Closed | **Learn from** the demand for narrative; none is open or linked. |

Also useful IIIF manuscript sources: Digital Bodleian, Gallica (BnF Arabe), Library of Congress, Biblissima IIIF search, Chester Beatty.

## 2. Texts and open data

| Project | Content | License / format | Verdict |
|---|---|---|---|
| **Tanzil** — tanzil.net | Verified Qur'an text (Uthmani, simple), many translations | **CC BY 3.0**, verbatim redistribution with link; TXT/XML/SQL | **Ingest** Qur'an text; translations per their own terms. |
| **Quran Foundation API (Quran.com)** — api-docs.quran.foundation | Text, translations, tafsir, audio, fonts, Mushaf images; OAuth; MCP server | **Not open data**: non-sublicensable; no dataset redistribution; cache ≤ 7 days; no ML training | **Call client-side only** within terms; never pre-bake into the static site. Frontend and backend are open source. |
| **Quranic Arabic Corpus** — corpus.quran.com | Word-by-word morphology, syntax, ontology | **GPL**, research-oriented | **Isolate** as a separate dataset if used. |
| **Corpus Coranicum (BBAW)** | Manuscripts, variant readings, intertexts | Academic; no bulk dump | **Link**. |
| **Sunnah.com** — sunnah.com/developers | Major hadith collections AR/EN with canonical numbering | API key via GitHub issue; bulk dump not yet; license *verify* | **Deep-link** by collection/number; ingest only after terms are confirmed. |
| **Open hadith datasets** — Open-Hadith-Data, hadith-json (50,884 hadiths, 17 books), Sanadset 650K, hadith-kg (715k, SQLite KG), Multi-IsnadSet | Text and narrator chains | Inconsistent licenses | Classical Arabic text is public domain; **verify** translations and numbering before use. Isnad datasets are the raw material for the narrator network. |
| **OpenITI / KITAB** — kitab-project.org; release 2025.1.9 on Zenodo | 9,106 books, 3,618 authors, 2.35B words, Arabic + Persian + manuscripts subcorpus; mARkdown; metadata TSV; text-reuse data | **CC BY-NC-SA 4.0** | **Ingest metadata, mine texts** (biographical dictionaries for Hijri dates and teacher–student links); keep NC-SA isolated; no public reader exists, so our Words wing adds real value. |
| **Maktaba Shamela; al-Maktaba al-Waqfiya** | Largest Arabic libraries | No stated open license | Use via OpenITI. |
| **Al-Islam.org (DILP)** | Twelver Shia library since 1995 | Copyright DILP | **Link** for sectarian balance. |
| **Sefaria** — sefaria.org/developers | Interlinked Jewish texts; Linker API; dumps; 70+ "powered by" projects | Open code; per-version licenses | **The model to copy**: open code, per-version license field, link graph, Linker. **No Islamic equivalent exists.** |

## 3. Timelines, maps, knowledge graphs

- **Wikidata** (CC0, SPARQL): millions of relevant items; **only Gregorian/Julian calendar models**; Hijri must be converted; precision and circa qualifiers exist. No active WikiProject for hadith narrators. → **Ingest and round-trip**; propose Hijri notes.
- **Histropedia**: Wikidata-driven timelines; engine licensable. → Learn from.
- **Chronas** (chronas.org): 2,000-year borders/religions map; one-developer project whose status is uncertain. → **Lesson**: crowd-edited history maps stall without open data and institutional backing.
- **Running Reality**: proprietary 4D world-history model. → Learn from the "snapshot year" idea.
- **Pleiades** (CC BY 3.0, API + dumps): ancient places; thin after the classical period. → **Ingest** IDs.
- **World Historical Gazetteer** (whgazetteer.org): **Linked Places Format** (JSON-LD/GeoJSON with `when`), reconciliation API. → **Adopt LPF** as our gazetteer interchange and contribute our places back.
- **Pelagios / Peripleo**: linked-places infrastructure, community-maintained. → Learn from.
- **al-Thurayya** (althurayya.github.io; Maxim Romanov): 2,000+ toponyms and route sections from Cornu's atlas, pathfinding, **static GitHub Pages site** — a direct architectural precedent; license *verify* (dataset DOI 10.34894/6DVTXP). → **Align IDs**; ask about license.
- **Islamic History Atlas (İslam Tarihi Atlası, Selçuk University / T-CORPUS–TİMAV, August 2026)**: 632–1924; 186 dynasties, 830 rulers, 13,940 Zirikli biographies, 8,528 DİA scholar biographies, 12,954 Yaqut places, 3,458 mints, al-Muqaddasi, Ibn Battuta (317 stops), Evliya Çelebi (5,444 entries), teacher–student and kinship links; TR/AR/EN; reported as open source with downloadable data (*verify* URL and terms). → **Closest existing knowledge graph of Islamic history**; align and ingest if the license allows; it is Turkish-institution-centric and new.
- **Onomasticon Arabicum (IRHT-CNRS)**: prosopography of 15k+ persons of the first Islamic millennium; no open dump. → Link.
- **Isnad / network DH**: isnad2network (MIT), Muhaddithat Networks datasets, KITAB isnad detection, a 2026 narrator entity-resolution pipeline, "hadithtransmitters" (100,915 narrators). Fragmented; **no shared narrator IDs**. → Our `person` IDs with Wikidata alignment can become that authority.
- **Travel and Hajj maps**: Ibn Battuta maps (Mariners' Museum; Nugent StoryMap), Northeastern NULab "Mapping the Late Ottoman Hajj", Egyptian Hajj ArcGIS map. One-off, unlinked. → Our `journey` class generalises them.
- **World History Encyclopedia**: per-item CC BY-NC-ND/SA. → Link.

## 4. Encyclopedic and educational

- **Encyclopaedia of Islam THREE (Brill)**: subscription; the authoritative reference stays closed. → Cite and link.
- **Oxford Islamic Studies Online**: retired 2022; content now in paywalled Oxford Reference.
- **Encyclopaedia Iranica**: open access since 2021 (still free in 2026). → Retrieve and cite; Persianate world.
- **Diyanet İslam Ansiklopedisi (DİA)**: free, 17k+ Turkish articles; feeds the Turkish atlas. → Retrieve and cite.
- **Yaqeen Institute**, **IslamiCity (ChatILM, 2026)**, PBS "Islam: Empire of Faith" timeline (Flash, dead), history podcasts: no structured data.

## 5. Recent "all-of-Islam" attempts (2024–2026)

- **Islamic Civilization Center, Tashkent** (opened March 2026): physical museum with AI/AR/VR avatars of 100+ scholars; ICESCO "unified digital manuscript platform" planned; closed.
- **Islamic Development Organization knowledge graph** (ido.international): proposal-stage.
- **AI Q&A apps** (Ilmverse, ChatILM, aifiqh.com, others): chatbots over Qur'an and hadith; no provenance graph, no museum layer; often sectarian or commercial.
- **King Faisal Center (KFCRIS)**: claims of 1.5M digitised manuscripts and an AI research platform (*verify*).
- **University of Toronto symposium "Exploring the Digital: Islamic Art and the Museum" (2024)**: the field acknowledges fragmentation.

Recurring failure modes: closed data behind national or institutional branding; UI-first "virtual tours" with no reusable data; single-developer tools that stall; Flash-era timelines lost; no persistent identifiers shared across projects.

## 6. Standards

- **CIDOC-CRM** (ISO 21127): event-centric; E52 Time-Span with E49 Time Appellation can carry "1215 Hegira" alongside a normalised span.
- **Linked Art 1.0** (2025): JSON-LD profile of CIDOC-CRM for objects, people, places, concepts, provenance, exhibitions; Getty vocabularies; IIIF. → Our export target for objects.
- **Europeana Data Model**: heavier; only if we contribute to Europeana.
- **IIIF** Image and Presentation 3.0: consume QDL/Bodleian/Gallica manifests in a static site with OpenSeadragon/Mirador.
- **EDTF** (ISO 8601-2): uncertainty, approximation, unspecified digits, intervals, sets; **no non-Gregorian calendar support** → hence our explicit Hijri field.
- **TEI** `<date calendar="#islamic">` is the only mainstream standard with a native Hijri slot; Wikidata has none.
- **Schema.org** for SEO; insufficient as the primary model.
- Hijri conversion: ICU `islamic-umalqura` / `islamic-civil`; Umm al-Qura valid roughly 1300–1500 AH; pre-modern dates need tabular conversion with ±1-day uncertainty.

## 7. Synthesis

**Gaps nobody fills:** an open, cross-linked hub joining objects ↔ texts ↔ people ↔ places ↔ events ↔ time; shared persistent IDs for scholars, narrators and dynasties outside Wikidata; a Hijri-native date model; a public narrative layer over OpenITI; Southeast Asia, Africa, China and post-1800 Islam; per-version text licensing made legible; civilization-scoped rather than institution-branded museums.

**Ingest freely (CC0):** Met, Smithsonian (CC0 flag), Walters, Wikidata. **Ingest with attribution (CC BY):** Tanzil, Pleiades, WHG open datasets. **Ingest isolated (NC/SA):** OpenITI, Smarthistory, Aga Khan images, KITAB reuse data. **Link/embed only:** QDL (IIIF), Archnet, MWNF, Qatar Museums, Google Arts & Culture, Brill, sunnah.com, Quran Foundation API (client-side). **Verify first:** sunnah.com license, Islamic History Atlas terms, al-Thurayya license, hadith JSON repos.

**What is genuinely new in islam.museum** (echoing 01-vision §6): one civilization-scoped graph with stable `islam.museum` URIs reconciled to Wikidata, Pleiades/WHG, OpenITI and al-Thurayya; a first-class Hijri time model published as a small open spec; object-to-text-to-person links (a QDL manuscript page ↔ the ayah ↔ its tafsir ↔ the scholar ↔ the city ↔ the dynasty); a Sefaria-style license registry and linker for Islamic texts; equal coverage of traditions and of non-Arab regions; and all of it as static, forkable, CC-licensed data on GitHub, so the data outlives the site.

## 8. Atlas-type projects (second research pass)

### The Oxford Centre for Islamic Studies "Atlas Project"
- **URL:** https://www.oxcis.ac.uk/the-atlas-project (annual-report PDFs linked from the page).
- **What it is:** a research programme running since about 2000 to produce a multi-volume print *Historical Atlas of the Islamic World* for Oxford University Press, mapping the **social and intellectual history of Muslims**: Sufi orders, madrasa scholarship, intellectual genealogies, teaching centres, migration and transmission of texts and ideas. It is a prosopographical, network atlas built from biographical dictionaries and chronicles, not a political-borders atlas.
- **Structure:** five regional volumes (Arabia/SW Asia/Nile; West-Central Asia and Inner Eurasia; North and West Africa; South Asia; Southeast Asia and Indian Ocean). Only the South Asia volume is advanced: 23 chapters, 162 maps, 142 charts, 109 tables, a gazetteer, about 200k words of commentary. Directed by Dr Farhan Nizami; commentary by Dr Moin Ahmad Nizami; Uzbekistan's Centre of Islamic Civilization contributing a section since a 2024 MoU.
- **Status:** "nearing completion" in the 2017–18, 2023 and 2024–25 reports; no publication date. Funded by Leverhulme, Mellon (including a 2012 digital-publishing feasibility study), Carnegie, Faisal Islamic Bank and KFAS.
- **Openness:** nothing online; no maps, data, API or licence; the internal research database is unpublished. OXCIS's only open digital output is the **Maldives Heritage Survey** (maldivesheritage.oxcis.ac.uk: 288 sites, 1,154 structures, 3,734 objects, 231 manuscripts, 87 point clouds), a good model for site and object records.
- **What it teaches us:** derive maps from verified prosopographical data rather than redrawn borders; combine maps with generational charts, tables and a gazetteer; use one reproducible regional template. **What it leaves open:** the entire digital, open, multilingual, continuously updated space. Partnership idea: offer islam.museum as the digital edition for the Atlas Project's gazetteer and network data, which has no outlet.

### Other atlas and cartographic-encyclopaedic projects

| Project | What | Openness | Verdict |
|---|---|---|---|
| **Atlas of Islamic History (İslam Tarih Atlası), Selçuk University + T-CORPUS/TİMAV, 2024–26** — https://islamicatlas.org; code github.com/alicetinkaya76/islamic-civilization-atlas; software DOI zenodo.org/records/19183845; dataset DOI zenodo.org/records/18824469 (12 CSV tables) | 632–1924: 186 dynasties and 830 rulers (Bosworth), 13,940 al-Zirikli biographies, 8,528 DİA scholar biographies with 8,127 teacher–student edges and 44,611 works, 12,954 Yaqut places (88.6 % geocoded), 3,458 mints, 2,049 al-Muqaddasi settlements, Ibn Battuta and Evliya Çelebi stops, 801 structures, battles, madrasas, waqfs, trade routes, an isnad layer, causal links, 10 guided tours, deep links; React/Leaflet/D3/Three.js on Vercel; TR/EN | **CC BY 4.0** on Zenodo (README says CC BY-SA; confirm before redistributing) | **Ingest as a seed layer** for dynasties, rulers, scholars, places, after reconciliation to Wikidata (which they lack). **Partner**: they need Wikidata/Pleiades IDs, Arabic UI and scholarly review for v2; we need their tables. Gaps: small team, thin per-fact citations, no persistent external IDs. |
| **Atlas of Islamic Thought (İslam Düşünce Atlası), İLEM / Konya** — islamdusunceatlasi.org | Timemap, books map/network, persons map/network (~4,000 scholars, 6,000+ works), period and discipline essays, a new periodisation by schools of thought; 6 print volumes | Free to browse; no licence, API or download; Turkish (partial EN) | **Learn from** the three linked maps (time × persons × books) and the defended periodisation; **link**. |
| **Brill, Historical Atlas of Islam (Kennedy 2002)** — referenceworks.brill.com | Authoritative print/online atlas | Paid, institutional | **Cite** only. |
| **Sluglett & Currie, Atlas of Islamic History (Routledge 2014)** | ~44 narrative maps, pre-Islam to 1920 | Print/e-book | **Learn from** text-per-map; cite. |
| **Scanned print atlases** (Roolvink 1957; Ruthven & Nanji on Internet Archive with an uploader-asserted CC BY-NC-ND) | Reference | Not legitimately reusable | Reference only. |
| **al-Thurayya** — althurayya.github.io | 2,000+ localities and routes of the 9th–10th-century Islamic world, pathfinding, itineraries, links to EI/Iranica/Pleiades; static GitHub Pages; DOI 10.34894/6DVTXP | Licence unstated | **Align IDs; ask for licence.** |
| **Idrisi: Open Library of Historical Geography of the Premodern Islamic World (Univ. of Maryland, NEH, 2024–26)** | Coordinates from Arabic/Persian/Turkish scientific manuscripts, to be published via World Historical Gazetteer | Pending | **Watch and ingest** on release. |
| **Digital Ottoman Gazetteer (Marmara Univ.)** | ~16k historical↔modern toponyms, GIS | "Open" promised; no platform yet | Watch. |
| **IRCICA Islamic Architectural Heritage Database (OIC)** — islamicarchitecturalheritage.com | Since 2008; 14 building types; data from member states | All rights reserved; no API | **Link**. |
| **ICESCO Islamic World Heritage Centre** — iwh.icesco.org | Islamic World Heritage List (~430+ items, target 1,000) with interactive map | No download or licence | **Link** as an authority list. |
| **Archnet** — archnet.org (terms: default CC BY-NC 4.0) | 600k+ images, sites, authorities, timeline, pedagogy | No API or bulk download | **Deep-link per site; partner for IIIF.** |
| **Early Islamic Mosques Database (Hagit Nol, Open Context)** — opencontext.org | ~120 excavated 7th–10th-century mosques | **CC BY 4.0**; CSV/GeoJSON/JSON API; EN/AR/HE | **Ingest**; the model of a well-licensed, multilingual, API-first dataset. |
| **Database of Historical Monuments in Islamic Cairo (Tokyo; Omeka S + IIIF)** — islamic-architecture.aa-ken.jp | 1,257 monuments, 6,000+ images; CSV/JSON-LD export | Per item | **Ingest metadata where open; link images.** |
| **Al-Furqan Digital Library** — digitallibrary.al-furqan.com | ~165k manuscript records from 106 countries | Free search; no bulk/API | **Link**. |
| **Open Jerusalem**; **sirah-atlas.com** (hobbyist sira map); **OpenHistoricalMap** (public domain; Rashidun borders tagged "fixme") and **Ourednik historical-basemaps** (GeoJSON by year, with a border-precision field) | | | The only open polygon sources for dynastic borders; both coarse. **Ingest with an explicit precision flag.** |
| **Knowledge-graph research (2024–26):** SemanticHadith KG, Multi-IsnadSet, muhaddithat/isnad-datasets, LLM sira–hadith mapping | | Mostly open | No LLM-built general atlas or graph of Islamic history exists beyond the Turkish atlas's layers: **an open niche**. |

### What the atlases teach about structuring our "atlas dimension" (adopted in 02–04)
1. **Data first, maps second.** Every map is a query over entity tables, never a drawn image (OXCIS, Turkish atlas, Open Context). Our `derive.ts` emits GeoJSON from the graph.
2. **Three linked axes:** place, time, and theme/network (persons, works, institutions), with every entity reachable from all three (İLEM's three maps; the Turkish atlas's panels). Our wings and the "In time / In space / Connections" panels implement this.
3. **Networks over borders.** Intellectual genealogies and isnad graphs are the distinctive content; political polygons are secondary and must carry a precision flag. Added `extent[].precision` to `polity` in 02.
4. **A gazetteer with historical↔modern toponym links and stable external IDs** (Wikidata, Pleiades, WHG Linked Places, Yaqut entry IDs): the gap every current project admits. Our `place.historical_names[]` and `external_ids` are built for it; we publish Linked Places Format.
5. **Provenance per fact**, not per dataset (al-Thurayya, OXCIS). Our quote-span claims in 09.
6. **Ship CC BY/BY-SA CSV + GeoJSON + JSON, bilingual Arabic/English fields natively, deep links and DOIs** (Open Context and the Turkish atlas prove a small team can). Our `api/v1`, monthly Zenodo releases.
7. **Guided tours and narratives per map** (Sluglett's text-per-map; the Turkish atlas's ten tours) as the museum-style entry on top of the data. Our `exhibit` class.

## 9. Film, television and directory data (third research pass, October 2026)

Survey for `12-screen-index.md` and `15-local-harvest.md`. V = confirmed on the source's own page; S = second-hand; U = not confirmed.

**What exists as a list of films about Islam**

| Attempt | Size | Verdict |
|---|---|---|
| English Wikipedia "List of Islam-related films" and "List of Islam-related animated films" | about 110 and about 41 titles (V) | Pointers |
| Wikipedia "Category:Films about Islam" (Wikidata Q6832758) and its counterparts in ar, tr, fa, id, ur, fr | 85 pages and 9 subcategories in English (S) | Walk offline from the dumps; pointers |
| Wikidata: audiovisual works with Islam as `main subject` | 5 exact, 19 including sub-topics; about 30 films by looser label matching, out of about 337,000 films (measured on a mirror) | The gap we fill and give back |
| *Muslims in the Movies: A Global Anthology* (2021) · Jack Shaheen's *Reel Bad Arabs* (about 1,000 films, 1896–2000) and his archive at NYU · Lancaster "Islamism in Arab Fiction and Film" · USC Annenberg *Missing & Maligned* (2021) · the Riz Test | Scholarship and criteria, not catalogues | Cite; mine filmographies |

**No open, multilingual, structured catalogue of films and television about Islam was found.**

**Film and television data sources**

- **Ingest (CC0):** Wikidata (225 film-identifier properties, 60 for television); Europeana metadata including the European Film Gateway and EUscreen; DPLA.
- **Separate share-alike layer or ID only:** TVmaze (CC BY-SA, V).
- **Identifier and link only:** TMDB (non-commercial use with attribution, V; six-month cache limit, S); IMDb non-commercial datasets (personal and non-commercial use, local copies allowed, republishing not, V); TheTVDB; OMDb; EIDR; ISAN; elCinema (Arabic; all rights reserved, non-commercial copying of documents allowed, V); SinemaTürk, Sinemalar and the Turkish Cinema Archive Database (TSA); SourehCinema (Persian); filmindonesia.or.id; Indiancine.ma (more than 80,000 films, no stated licence); Pakistan Film Magazine; Bangla Movie Database; Africiné (27,663 films) and Africultures; Kinopoisk; Douban.
- **Discovery only:** Letterboxd, MUBI, JustWatch; broadcasters and platforms; festivals (the Kazan festival of Muslim cinema, held since 2005; the Muslim International Film Festival in London; Mizna); curated services (Alchemiya, Unity Productions Foundation, Qalbox, Muslim Kids TV).
- **Do not harvest:** YouTube API data (30-day storage limit, aggregation restricted, V).
- **Weakest coverage, needing people:** Hausa cinema, Central Asia, Malay television, Bangladesh, Egyptian state television.

**Wikimedia bulk access (V unless marked):** monthly XML dumps (English 25.1 GiB, Arabic 2.0, Persian 1.5, Turkish 1.1, Indonesian 1.2, French 6.7, Urdu 0.5, Bengali 0.5, Malay 0.4); Wikidata JSON dump 96 GiB bz2; two connections per IP on the dump servers; a descriptive User-Agent required, including for dumps since mid-2026; new global API rate limits in 2026 favour identified clients (numbers S); the query service was split in January 2026 into a main graph and a scholarly graph (S); Wikimedia Enterprise offers free monthly snapshots with an account. Wikipedia text is CC BY-SA 4.0; Wikidata is CC0.

**Qur'an text sources:** Tanzil v1.1 (CC BY 3.0, verbatim copies only, attribution, link and notice required, V) → **ingest verbatim**; King Fahd Complex Hafs text (free use in software and websites; fonts may not be modified, V) → second witness; Tarteel QUL (227 translations, 115 tafsirs, 30 scripts as SQLite and JSON; code MIT, data rights vary per resource, V) → per resource; Quran Foundation API (no storage beyond a week, no redistribution, no build-time bundles, V) → client-side links only; GitHub collections under permissive repository licences do not clear translators' rights → **verify per translation**. Public-domain English translations: Sale, Rodwell, Palmer; Pickthall's 1930 edition in the United States from 1 January 2026 (by the publication-year rule; confirm the edition).

**Directories:** Charity Commission for England and Wales (daily full extract and API, Open Government Licence, V); ACNC Australia (weekly, CC BY, V); IRS exempt-organisations file (V); Curlie, the successor of DMOZ (data dump, CC BY 3.0, V); OpenStreetMap (ODbL: cannot be merged into CC0 data, V); MuslimsInBritain.org (reproduction permitted with acknowledgement, no API, V); Zabihah and Mawaqit (automated collection or commercial use prohibited, V) → **not harvested**. DOAJ dumps are now by request; Encyclopaedia Iranica asserts all rights and offers no bulk access → cite and link.

**Local tooling (October 2026):** Ollama with JSON-schema structured outputs; mlx-lm; llama.cpp; Apache-2.0 multilingual models that fit in 20–25 GB (the Qwen 3.x family); BGE-M3 and Qwen3-Embedding for multilingual embeddings; QLever can index all of Wikidata with about 2 TB of disk.
