# Screen index lane (docs/plan/12)

Goal: catalogue films, TV series, documentaries and famous video works about Islam as `data/screen/<slug>.yaml` records rendered in the Screening Room at `/[lang]/screen/`.

## Conventions used in this lane

- `id`: `screen/<arabic-or-transliterated-slug>-<year>`; `format`, `relevance`, `titles[]`, `released`/`first_broadcast`, `depiction{}`, `approach`, `relations` (existing entity ids only), `external_ids` `{wikidata, imdb}`, `sources: [source/wikidata, source/imdb]`, `status.review: draft`.
- Verification: Wikidata QID resolved via enwiki `pageprops` (or direct Wikidata search); IMDb id taken from the Wikidata P345 claim. Records with no second source get only the source that exists.
- `depiction.prophet` refers to the Prophet Muhammad; other prophets shown on screen are described in `depiction.note` (`prophet: face` is rejected by the validator).
- `sensitivity`: `figurative-prophet` where Companions/Imams or the Prophet's silhouette appear; `contested` for controversy; `polemical` for hostile works (never carry `watch` links).
- `watch` links: official/rights-holder URLs only, each with `region` and `checked` date.
- Broadcasters used: `group/mbc`, `group/bbc`, `group/pbs`, `group/trt` — all stubs in `data/_stubs.d/screen-index.yaml`.
- New stub file: `data/_stubs.d/screen-index.yaml` (remove lines as entities are promoted).

## Done

- 2026-10-16: `source/imdb` created. Batch 1 (25 records): al-risala-1976 enriched with IMDb id; new — umar-2012, muhammad-rasul-allah-2015, muhammad-khatam-al-anbiya-2002, hayat-muhammad-2011, muhammad-irath-nabi-2002, al-nasir-salah-al-din-1963, umar-al-mukhtar-1981, al-massir-1997, mamlakah-al-sama-2005, fetih-1453-2012, qiyamat-ertugrul-2014, qiyamat-uthman-2019, yunus-emre-askin-yolculugu-2015, payitaht-abdulhamid-2017, kudus-fatihi-selahaddin-eyyubi-2023, takva-2006, yusuf-payambar-2008, maryam-muqaddas-2001, ashab-al-kahf-1997, al-masih-2007, mukhtarnameh-2011, shaheed-e-kufa-1995, al-imam-2017, muawiya-2025, al-muhajir-1994.

- 2026-10-16: Batch 5 (18): khawatir-2005, muawiya-wal-hasan-wal-husayn-2011, qamar-bani-hashim-2008, al-zahir-baybars-2005, saqr-quraysh-2002, rabee-qurtuba-2003, muluk-al-tawaif-2005, al-taghriba-al-filistiniyya-2004, salman-al-farisi-2023, nikaah-1982, ayat-al-hubb-2008, luwur-waktu-1999, ilm-wal-islam-2009, abu-lahab-1953, quran-bi-al-qalb-2011 (tt1766189), al-sultan-wal-qiddis-2016 (tt5977536), mudun-al-nur-2007 (tt1047890), zukhruf-al-alam-2019 (tt11007470, official PBS stream).
- 2026-10-16: Batch 6 web/children (6 + 2 sources): source/deen-show, source/one4kids, deen-show-2006, zaky-2010, umar-hana-2017 (Q85990452), salah-al-din-animated-2009 (Q3471948), nussa-film-2021 (Q109563749), layla-fi-al-aqsa-2019 (tt10499648).

## Done (cont.)

- 2026-10-16: Batch 7 (4): al-qadisiyya-1981 (Q4704628/tt0328295), fajr-al-islam-1971 (Q12230352/tt1458553), waris-1979 (Q7969446/tt5547882), muharib-al-sahra-2025 (Q110903821/tt13570066). paradise-now-2005 and not-without-my-daughter-1991 already existed as al-jannah-al-an-2005 and la-abla-bintati-1991 — deduped by QID.

- 2026-10-16: Enrichment pass over all 123 QID-carrying records: cast (P161→`features`, top ~8), directors (P57→`directed_by`), writers (P58→`written_by`), networks (P449→`broadcast_by`), official sites (P856→`external_ids.official`), awards (P166→`reception` kind:award). 648 new person/group stubs in this lane's stub file. 14 press source records minted for flagship works (The Message siege coverage, Omar fatwa debate, Muawiya bans, Ramy Golden Globe). Schema: `imdb` and `official` keys added to external-id-patterns.yaml (imdb had been an unregistered key generating warnings).

## Still open

- Press coverage is seeded for four flagship works only; extend reception/sources per work over time (every reception entry must cite a source entity — mint source/<outlet>-<work>-<year> records).
- Stubs are name-only; promote actors/directors as needed when prose wants them.
- Not minted (no verifiable catalogue/source yet): adams-world, ali-and-sumaya (Sound Vision/African works — official sites could be minted as primary sources if wanted), sang-kyai-2013 (idwiki page exists, no QID), hidayah-2005, al-shaimaa-1972, an-islamic-history-of-europe-2005 (Rageh Omaar C4 doc — no QID found), khalid-ibn-al-walid serials.
- Already in graph under other slugs: paradise-now (al-jannah-al-an-2005), not-without-my-daughter (la-abla-bintati-1991), ibn-hanbal series (al-imam-2017).
- No content/ar/screen/*.md prose yet; most records cite only wikidata/imdb and need a second source for dated facts before review.
- Screen index now ~130 records at data/screen/.

## Candidate backlog (verified QID+IMDb pairs already collected)

Documentaries: islam-empire-of-faith-2000, inside-mecca-2003, journey-to-mecca-2009, one-day-in-the-haram-2017, islam-the-untold-story-2012, a-road-to-mecca-2008 (Q1197953), prince-among-slaves-2007, when-the-moors-ruled-2005, ottomans-europes-muslim-emperors-2013, reel-bad-arabs-2006, new-muslim-cool-2009, the-feeling-of-being-watched-2018, four-daughters-2023, rise-of-empires-ottoman-2020, muslims-are-coming-2013.
Muslim-life film/series: little-mosque-2007, ramy-2019, mo-2022, we-are-lady-parts-2021, citizen-khan-2012, man-like-mobeen-2017, ms-marvel-2022, the-big-sick-2017, my-name-is-khan-2010, timbuktu-2014, ceddo-1977 (Q5057031/tt0077309), khuda-kay-liye-2007, sang-pencerah-2010, para-pencari-tuhan-2007, 99-cahaya-2013 (Q15277609/tt6096424), nussa-2019, bilal-new-breed-2015, le-grand-voyage-2004, wadjda-2012, mat-kilau-2022, ali-2001 (imdb tt0248667 — needs QID), malcolm-x-1992, four-lions-2010, a-prophet-2009, battle-of-algiers-1966, incendies-2010, where-do-we-go-now-2011, free-men-2011, the-insult-2017, the-13th-warrior-1999, garm-hava-1973, alif-2019, shehr-e-zaat-2012, khuda-aur-muhabbat-2011, zindagi-tamasha-2019, wa-islamah-1961, kingdom-of-solomon-2010, the-99-2011, paradise-now-2005, stoning-of-soraya-m-2009, osama-2003, a-separation-2011, persepolis-2007, taste-of-cherry-1997, brick-lane-2007, hur-adam-2011, times-and-winds-2006, the-unknown-saint-2019, barakah-meets-barakah-2016, the-perfect-candidate-2019, the-reluctant-fundamentalist-2012, damascus-time-2018, ketika-cinta-bertasbih-2009, raqs-e-bismil-2020, joyland-2022, tukang-bubur-naik-haji-2012 (Q7851815).
Polemical (neutral index entries, `sensitivity: polemical`, no watch links): fitna-2008, innocence-of-muslims-2012, submission-2004, obsession-2005.
Unresolved candidates (need arwiki/fawiki/idwiki resolution or manual): koran-by-heart, sultan-and-the-saint-2016, cities-of-light-2007, ayat-ayat-cinta-2008, an-islamic-history-of-europe-2005, science-and-islam-2009, ornament-of-the-world-2019, not-without-my-daughter-1991, sang-kyai-2013, lorong-waktu, hidayah, fajr-al-islam, al-zahir-baybars-2005, saqr-quraish-2002, rabee-qurtuba-2003, muluk-al-tawaif-2005, al-taghriba-al-filistiniyya-2004, al-shaimaa-1972, al-qadisiyya-1981, nikaah-1982, al-hassan-wal-hussain-2011, qamar-bani-hashim-2008, salman-al-farisi-2023, khawatir-2005, the-deen-show, zaky.

## Culture lane (2026-10-16, same session family)

The "anything cultural about Islam" sweep landed on `main` in four commits
(`e136afff`…`53e2bb34`): 26 fiction works (`data/work/`), 14 musicians +
5 bands (`data/person/`, `data/group/`), 15 monuments + 9 bazaars
(`data/building/`), 9 art objects (`data/object/`), 8 gatherings
(`data/event/`), 4 festival practices (`data/practice/`), 2 street
markets (`data/place/`), 2 iconic cafés (`data/listing/`), plus
`data/_stubs.d/culture-index.yaml` (21 author stubs).

- Resolution path: enwiki REST pageprops → wikibase_item (Wikidata API
  was 429-throttled; REST worked). QIDs keyed in
  `/tmp/screenindex/culture_resolved.json` during the run.
- Fiction authors are stubs — promote to full `person/` records when a
  lane picks them up.
- Two dedupe notes: `nussa-2019`/`salah-al-din-animated` etc. already
  existed; `dawud-wharnsby` kept its filename (no real collision — the
  other `dawud-*` people are distinct).
- Still open: more musicians (Maher Zain collaborators, Malaysian
  nasyid groups), more bazaars (Kashan, Grand Bazaar Tehran, Souk
  el-Attarine Tunis), folk festivals (Moussem of Tan-Tan, Mevlana
  week beyond Şeb-i Arus), and Islamic-art object records are a huge
  open field — the nine minted are the canonical headliners only.

## Source pass 2 (2026-10-16): elCinema, Dhliz, Shahid

Beyond IMDb/Wikidata, three Arabic-first catalogues were distilled:

- **elCinema** (`source/elcinema`, `external_ids.elcinema`, pattern
  `^\d+$` → `elcinema.com/en/work/{id}/`): 53 of 130 records matched,
  each verified by fetching the work page and comparing title+year.
  Method: `/en/search/work/?q=<title>` → candidate pages → `<title>`
  gives type+name+year. One false match dropped (zaky-2010 → an
  unrelated Egyptian film). Cast lists were captured but not imported
  as `features` — the page mixes crew and actors without labels.
- **Dhliz** (`source/dhliz`, `external_ids.dhliz`, pattern
  `^(film|series)/<slug>$`): title-slug search alone produced many
  false positives; only entries verified via the JSON-LD `sameAs`
  Wikidata QID on each work page were kept: `fajr-al-islam-1971`,
  `muawiya-2025`. Dhliz coverage of non-Arabic works is thin.
- **Shahid** (`source/shahid`): public search API at
  `api2.shahid.net/proxy/v2/search/<TV_SHOWS|MOVIES>` with headers
  `uuid: Web`, `language: AR`, profile JSON `{"id":<uuid>,"isAdult":
  false,"master":true}` and request `{"name": <title>}`. Strict
  whole-token title matching after substring false positives (علي ⊂
  عليه, مو ⊂ مودة). Only `bilal-jil-jadid-2015` streams there —
  watch entry `official-paid`, region `mena`, percent-encoded Arabic
  URL (validator requires `uri` format). Khawatir/Omar/al-Zahir
  Baybars are not in the current Shahid catalogue.

Caveat for future passes: never accept a catalogue match on title
alone — always confirm year ±1 or a Wikidata `sameAs` QID.

## Arabic prose pass (2026-10-16)

The non-passage Arabic prose backlog is closed. Every class except
`passage` now has a `content/ar/` page for every record:

- 107 culture-harvest entities (26 novels, 14 musicians, 5 bands,
  24 buildings/bazaars, 9 objects, 8 gatherings, 4 practices,
  3 places, 2 exhibits, 2 listings) — hand-written docent prose.
- 130 `screen/` pages generated from each record's own fields
  (format, year, countries, directors, cast wiki-links, subjects,
  depiction rule, bans/fatwas/awards), cited to the record's sources.
- 161 `source/` bibliography pages: title/author/publisher/kind/lang
  plus a computed "cited by N records" line.
- 16 `dataset/` + 4 `media/` pages.

Validation: 0 errors; prose total 14,600+ files. Remaining gap is
`passage` (9,505), owned by the `muwatta-prose` lane — do not
duplicate. If the generator is rerun, keep the year-fallback from the
slug suffix (50 records lack `released`) and verify wiki-link targets
exist (place/samarkand→samarqand, event/the-hijra→hijra, etc.).

## Passage prose (2026-10-16)

Founder confirmed no lane was running passage prose, so this session
closed the remaining 9,505 passage pages:

- 6,350 `quran-*` (114 sura + 6,236 ayah): موجز with sura name/link,
  meccan/medinan, ayah position, revelation order; revealed_about
  links cited. No ayah text in prose (frozen Tanzil rule).
- 3,155 hadith passages (muwatta/muslim/bukhari/arbaun): موجز reuses
  the record's own summary.ar; موضعه section links part_of kitab,
  mentions and basis_for targets.
- Fix: removed a typed ﷺ from `passage/muwatta-6-932` data+prose.

Generated from record fields only; deeper tafsir/isnad prose remains
a future lane (the 41 pre-existing muwatta files show the target
depth — OCR-sourced, page-cited).

## Breadth pass 2 (2026-10-16, same session)

Filled Phase-1 class gaps after prose closure:

- **language** — 15 records (0 → 15): Arabic, Persian, Turkish, Urdu,
  Bengali, Malay, Indonesian, Swahili, Hausa, Pashto, Kurdish, Punjabi,
  Somali, Bosnian, Amharic. Scripts, speaker estimates, ISO-639, QIDs.
  Language schema quirk: `scripts` is a plain string list — quote any
  value containing parentheses/colons.
- **practice** — 17 records (8 → 25): wudu, ghusl, adhan, khutba,
  taraweeh, itikaf, tawaf, sai, ziyara, istikhara, dua, janaza, aqiqa,
  khitan, walima, dhikr, miswak. Sunni `basis: prophetic-practice`;
  scriptural_basis linked to quran-* passages where relevant.
- **question** — 22 records (39 → 61): newcomer cards for the new
  practices plus hadith/sira/ilm/masjid-haram topics. No tensions —
  all `sensitivity: none`.
- **object** — 11 records (43 → 54): Black Stone, Maqam Ibrahim,
  Birmingham & Topkapi mushafs, al-Jazari elephant clock, Roger II
  coronation mantle, talismanic shirt, Piri Reis map, Sancak-ı Şerif,
  Blacas ewer, Luck of Edenhall. Plus `building/bir-zamzam`.
  Object schema quirk: `provenance` is the *chain-of-custody* field
  (array of strings) — do NOT put the AI provenance block there;
  attribution goes in `status.generated_by`.
- **listing** — 6 records (2 → 8): Café Riche, Bakdash, Karim's,
  Hafiz Mustafa 1864, Rick's Café Casablanca, Jarir Bookstore.
- **screen** — +43 records (130 → 173): Majidi trio, Bab'Aziz, The
  Physician, Black Gold, Ali and Nino, A Jihad for Love, Arranged,
  The Lady of Heaven, Amreeka, The Source, Cairo Time, Desert Dancer,
  Ali the Goat, Mawlana, Omar, Kandahar, Theeb, Farha, Boy from Heaven,
  Blue Caftan, Ali's Wedding, Jinn, The Swimmers, For Sama; then
  Alparslan, Uyanış Selçuklu, Mendirman Jaloliddin, Muhteşem Yüzyıl,
  Bab al-Hara, Yacoubian Building, Hassan & Marcus, Day I Became a
  Woman, Offside, Mustang, Limbo, It Must Be Heaven, Wajib,
  Tel Aviv on Fire, Caliphate, Sheikh Jackson, Hala.

Method note: "Children of Heaven" and "Offside" first resolved to
disambiguation items — always check `description` in the REST summary
before accepting a QID. "Imam Ali (1997 TV series)" resolves to
Shaheed-e Kufa — already catalogued, deduped.

## Session update — 2026-10-16 (objects + screen targets cleared)

- **object** — 43 → **512** (Phase 3 ≥500 target met): Met Open Access
  highlights (~210), Cleveland Islamic dept (~110), V&A targeted
  harvests (~180): Salting Mihrab, Kashan lustre, Kiswah fragments,
  Mamluk minbar + ceiling, Fatimid wood panels, Samarra fragments,
  Madinat al-Zahra ivories, Bursa velvets, Damascus tile group,
  astrolabes, Deccan paintings. Sources: source/met-open-access,
  source/cleveland-open-access, source/vam-collection.
- **screen** — 173 → **315** (Phase 1 ~300 target met): world cinema —
  Sembène trio (Ceddo, Moolaadé, Guelwaar, Xala), Majidi/Panahi/
  Makhmalbaf, Saudi new wave (Barakah, Perfect Candidate), Bosnian
  war films (Grbavica, Snow, Halima's Path, Aida), Syrian-war docs
  (White Helmets, Last Men in Aleppo, The Cave, City of Ghosts),
  Oscar winners (No Other Land), contested portrayals (Midnight
  Express, Not Without My Daughter, Rules of Engagement, Siege),
  Turkish epics (Fetih 1453, Mehmed series, Kingdoms of Fire,
  Rashash), Arab golden age (Cairo Station, Nightingale's Prayer,
  West Beirut, Capernaum), Bollywood (Mughal-e-Azam, Jodhaa Akbar,
  Haider, Shahid, Padmaavat, Manto, Gully Boy, Veer-Zaara),
  African cinema (Atlantics, Goodbye Julia, Gravedigger's Wife,
  Milkmaid, Amina), Arab docs (The Square, Trials of Ali).
- Method: batch `wbgetentities` (one call, all titles → QID + IMDb)
  beats per-title REST — no throttling. Validator's dup external-id
  check catches near-identical Arabic-slug dupes; ~20% of candidate
  titles already existed under Arabic slugs — dedupe to the existing
  record, never delete it.

## Questions lane (new — 2026-10-16)

- **question** — 61 → **220** (mid-term target met): "who was" cards for
  prophets, Companions, Rashidun, imams, scholars (Khwarizmi, Biruni,
  Razi, Tabari, Ibn Hajar, Nawawi), rulers (Harun, Akbar, Mansa Musa,
  Shajar al-Durr, Zheng He) and figures (Rumi, Malcolm X, Iqbal,
  Fatima al-Fihri); "what was" cards for cities (Mecca, Medina,
  Jerusalem, Damascus, Cairo, Istanbul, Fez, Granada, Samarra,
  Bukhara, Karbala, Konya, Cordoba, Timbuktu), polities (Umayyad,
  Abbasid, Fatimid, Seljuk, Safavid, Delhi Sultanate), battles
  (Badr, Uhud, Khandaq, Hunayn, Yarmuk, Qadisiyya, Hattin, Ayn
  Jalut, Constantinople), groups (Mutazila, Khawarij, Quraysh, Ahl
  al-Bayt) and ethics (adab, birr, haya, zuhd, ikhlas, riya, ghiba,
  sabr, tawakkul).
- New persons created: jalal-al-din-rumi, malcolm-x, muhammad-iqbal,
  akbar, zheng-he, fatima-al-fihri (all draft, wikidata-cited).
- Method: question cards link `related` to existing entity ids only —
  check `data/<class>/` first; ~20% of slug guesses need prefix fixes
  (e.g. `isa-ibn-maryam`, `battle-of-the-trench`, `ayn-jalut-658`,
  `conquest-constantinople-857`).

## Pathways lane (new — 2026-10-16)

- **exhibit/trail** — 7 → **105** (of ~300 aspirational): curated
  trails assembled entirely from existing graph entities — every
  room `features` link validates. Themes covered: worship year and
  life-cycle, prophets and mothers of believers, conquests and
  fitna, all regions (andalus, maghreb, egypt, iraq, persia,
  khorasan, anatolia, india, east/west africa, southeast asia,
  china, volga, americas), sciences (falsafa, astronomy, medicine,
  geography, grammar, calligraphy), objects (arms, textiles,
  relics, museum treasures), law/ethics (sharia, muamalat, tahara,
  creed, ethics), and meta-trails (screen room, questions, sira
  books).
- Method: trail rooms only link verified entity ids (checked via
  `ls data/<class>/` before writing); trails reuse the question
  cards created this session as learning anchors. All draft,
  `prerequisites: [exhibit/path-islam-in-30-minutes]`.
- Remaining trail ideas if continued: per-era timeline trails,
  per-country trails, object-collection trails, hadith-book deep
  trails. ~200 more possible but marginal value drops as themes
  get reused.
