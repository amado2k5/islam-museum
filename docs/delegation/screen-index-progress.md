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
