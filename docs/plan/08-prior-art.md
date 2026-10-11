# 08 · Prior art — what exists, what to reuse, what is missing

Survey as of October 2026 (web research; items marked *verify* could not be confirmed from the source page). Use this to decide what to **ingest**, **link**, **partner with**, or **learn from**.

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

## 8. Atlas-type projects

See the addendum below (added after a second research pass on the Oxford Centre for Islamic Studies Atlas Project and similar atlas initiatives).
