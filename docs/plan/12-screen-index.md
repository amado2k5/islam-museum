# 12 · The Screen index — every film, series and programme about Islam, in any language

A catalogue of **everything made for the screen about Islam**: feature films, television series, miniseries, documentaries, documentary series, animation, children's programmes, religious broadcasting, short films and web series, from every country and in every language. It is an index, not a streaming service: the museum stores facts and links, never the video. Each title is a node in the graph, connected to the people, events, places, ideas and periods it is about, so a visitor reading about Ibn Rushd finds the film about him, and a visitor who watched a series about Umar finds the history behind it.

## 1. Why this belongs in the museum

- For most people alive today, **the screen is where they met Islam's story**: a Ramadan series, a documentary, a film at school. Those works shape what people believe happened.
- **No open, multilingual, structured catalogue exists** (survey in §3 and `08-prior-art.md` §9). English Wikipedia's "List of Islam-related films" has about 110 titles; its category has 85 pages. Wikidata has a few dozen works tagged with Islam as their main subject, out of roughly 337,000 films. The Arabic, Turkish, Persian, Urdu, Indonesian and Hausa production of the last seventy years is scattered across national databases that do not talk to each other.
- The museum's graph is what makes the index useful: a title is filed by **what it is about**, in the same vocabulary as the rest of the museum.

## 2. Scope and boundaries

**Included**, each with a `relevance` level so the default view stays focused:

| Level | Meaning | Examples |
|---|---|---|
| `primary` | Islam, its scripture, figures, history or practice is the subject | *The Message* (1976) · *Omar* (2012) · *Islam: Empire of Faith* (2000) · *Koran by Heart* (2011) · *Para Pencari Tuhan* |
| `substantial` | Muslim history, civilisation or religious life carries the story | *Destiny / al-Masir* (1997) · *Diriliş: Ertuğrul* · *Le Grand Voyage* (2004) · *Sang Pencerah* (2010) · *Malcolm X* (1992) |
| `setting` | Muslim society is the setting; religion is context rather than subject | *Mughal-e-Azam* (1960) · *Kingdom of Heaven* (2005) · *Wadjda* (2012) |

Default browsing shows `primary` and `substantial`; `setting` is one filter away.

**Formats:** `film`, `short`, `tv_film`, `series`, `miniseries`, `episode` (of a strand such as *Witness* or *Al Jazeera World*), `documentary`, `documentary_series`, `animation`, `children`, `programme` (recitation, lecture, talk, competition, travel, cookery), `web_series`, `recorded_performance`.

**Boundaries**

- **Index, do not host.** Metadata, identifiers and links only. No video files, no clips, no subtitles files, no posters (see §7).
- **Listed is not endorsed.** The museum does not rate, review or rank, and does not rule on whether a work or a depiction is permissible.
- **Critical and polemical works are recorded.** The museum is honest about the record, so *Submission* (2004), *Fitna* (2008) and *Innocence of Muslims* (2012) have entries: a neutral description, who made them, how they were received, what followed. The entry links to reference sources, not to the video, and carries `sensitivity: polemical`.
- **Never a platform for violent extremist propaganda.** Media produced by violent groups is not indexed or linked. If a release mattered historically it is described inside the relevant `event`, from scholarship.
- **Incidental appearances are out.** A film with one Muslim character is not "about Islam". Candidates below `setting` stay in the private wanted-list.
- **Living people:** principal credits only, from public sources; the living-person policy of `05-editorial.md` applies.

## 3. Sources: what can be ingested, what can only be linked

Survey of October 2026. V = confirmed on the source's own page; S = confirmed second-hand; U = could not be confirmed and must be re-checked on the Mac before use.

| Source | What it gives | Terms | Verdict |
|---|---|---|---|
| **Wikidata** | Items for films and TV works, labels in many languages, credits, dates, and 225 film-ID properties | CC0 (V) | **Ingest. The spine of the index.** |
| **Europeana** (carries European Film Gateway and EUscreen) · **DPLA** | Archive records for European and US holdings | Metadata CC0 (V) | **Ingest** |
| **Wikipedia category trees** in en, ar, tr, fa, id, ur, fr and others | Membership lists: which titles the editors of each language filed under Islam | Text CC BY-SA; membership facts reach us through Wikidata sitelinks | **Discover**, then take the facts from Wikidata |
| **TVmaze** | Series and episodes | CC BY-SA (V) | Store the ID; if ingested, keep in a separate share-alike layer, never in the CC0 core |
| **TMDB** | Titles in many languages, credits | Free for non-commercial use with attribution and the notice "This product uses the TMDB API but is not endorsed or certified by TMDB" (V); a six-month cache limit reported second-hand (S) | **Store the ID and link.** Optional look-ups at harvest time only; nothing from TMDB is republished |
| **IMDb** non-commercial datasets | Titles, alternative titles, crew | "Personal and non-commercial use"; local copies allowed; republishing to build a database is not (V) | **Store the `tt` ID and link.** May be used locally to check a year or a title, never copied out |
| **TheTVDB · OMDb · Trakt · Letterboxd · MUBI · JustWatch** | Various | Restricted or request-only (V/U) | ID or discovery only |
| **EIDR · ISAN** | Industry identifiers | Registries, member access | Store the identifier when Wikidata has it |
| **elCinema** (Arabic) · **SinemaTürk**, **TSA**, **Sinemalar** (Turkish) · **SourehCinema** (Persian) · **filmindonesia.or.id** · **Indiancine.ma**, **Bollywood Hungama**, **Cinemaazi** (India) · **Pakistan Film Magazine** · **BMDb** (Bangladesh) · **Africiné**, **Africultures**, **African Film Database** · **Kinopoisk** and other Russian databases · **Douban**, **1905.com**, **Mtime** (China) | The national and regional record, usually far deeper than any global database | All rights reserved or no stated licence (V/U) | **Store the ID and link.** Read by a person or a polite crawler to *discover* titles and confirm facts; cite as a source, copy nothing |
| **Broadcasters and platforms** (Al Jazeera, MBC/Shahid, TRT/tabii, IRIB, PTV, TV AlHijrah, AREWA24, BBC, PBS, ARTE, ZDF, NHK, CBC and others) | Their own catalogues and archives | Copyright | Discovery and official watch links |
| **Festivals and curators** (Kazan "Altyn Minbar" festival, first held 2005 as the Golden Minbar festival of Muslim cinema; Muslim International Film Festival, London; Mizna's Arab Film Festival; Alchemiya; Unity Productions Foundation; Qalbox; Muslim Kids TV) | Programmes and line-ups | Copyright | Discovery |
| **Scholarship** (*Muslims in the Movies: A Global Anthology*, 2021; Jack Shaheen's *Reel Bad Arabs* and his archive at NYU; Lancaster's "Islamism in Arab Fiction and Film"; USC Annenberg's *Missing & Maligned*, 2021; the Riz Test) | Filmographies and analysis | Copyright | Cite; mine the filmographies for candidates |
| **YouTube Data API** | Channel and video metadata | Stored API data must be refreshed or deleted within 30 days; aggregation restricted (V) | Do not harvest. Store only a video or channel ID that we curated or that Wikidata already holds |

**Rule that follows:** the CC0 core of the index holds only facts we may release: titles, dates, countries, languages, formats, credits and identifiers taken from Wikidata, from open archives, or established by our own research and cited. Everything else is a pointer.

**Giving back:** every title we establish that Wikidata lacks is added to Wikidata, and every title gets a `main subject` statement there. That keeps our facts CC0 at the source and repairs the gap for everyone.

## 4. Data model: one new class, `screen`

Films move out of `work` (which keeps books, treatises, poems, maps, music and websites) into a class of their own, because they need fields that texts do not and will number in the thousands.

```yaml
id: screen/al-risala-1976
class: screen
format: film
relevance: primary
label: { en: The Message, ar: الرسالة, tr: Çağrı }
titles:
  - { lang: ar, value: الرسالة, kind: original }
  - { lang: en, value: The Message, kind: original, note: "Released first as Mohammad, Messenger of God" }
  - { lang: tr, value: Çağrı, kind: dubbed }
summary:
  en: Epic film about the birth of Islam, shot in separate Arabic and English versions with different casts; the Prophet is never shown or heard.
released: { edtf: "1976", calendar: gregorian, precision: year }
countries: [lb, ly, kw, ma, gb]            # ISO codes, as documented
languages: { original: [ar, en], dubbed: [tr, ur, fa], subtitled: [] }
versions:
  - { lang: ar, runtime_min: null, note: "Arabic-language version with an Arab cast" }
  - { lang: en, runtime_min: null, note: "English-language version" }
depiction:
  prophet: not-shown                        # not-shown | voice | point-of-view | figure-without-face | face
  companions: some-shown
  imams: not-applicable
  note: "Scenes addressing the Prophet are filmed from his point of view."
approach: historical-drama                  # see enum below
themes: [sira, early-community]
relations:
  - { type: directed_by, target: person/moustapha-akkad }
  - { type: about, target: person/muhammad }
  - { type: about, target: event/hijra }
  - { type: about, target: event/battle-of-badr }
  - { type: set_in, target: period/prophetic-era }
  - { type: set_in, target: place/mecca }
reception:
  - { kind: approval, by: "al-Azhar (as stated in the film's opening title)", date: { edtf: "1976" }, sources: [], status: debated,
      note: "Later reported as withdrawn. Record both statements with sources." }
  - { kind: objection, by: group/muslim-world-league, sources: [] }
  - { kind: ban, where: [sa, eg, kw], sources: [], note: "Saudi ban reported lifted in 2018." }
watch:
  - { kind: official-free | official-paid | archive, url: ..., region: [..], checked: 2026-10-11 }
external_ids: { wikidata: Q588464, imdb: ..., tmdb: ..., elcinema: ..., eidr: ... }
sensitivity: none
sources: []
status: { review: draft, completeness: 2 }
```

Key fields beyond the common base:

| Field | Notes |
|---|---|
| `format`, `relevance` | Enums above |
| `titles[]` | Original script first, then transliteration and every release, dubbed or broadcast title we can source. Search indexes all of them, so *Çağrı* finds *The Message* |
| `released` / `first_broadcast` | EDTF; Hijri derived and flagged. `ramadan_season: 1433` for series made for a Ramadan season, so the Ramadan line-ups of each year can be browsed |
| `countries[]`, `languages{}` | Production countries; original, dubbed and subtitled languages |
| `seasons`, `episodes`, `runtime_min`, `broadcaster`, `part_of` | Series data; an `episode` points to its strand |
| `versions[]` | Language versions, cuts, censored releases |
| `depiction{}` | How prophets, Companions and Imams are shown. Drives the sensitivity flag and tells a visitor what to expect before they press play |
| `approach` | `devotional` · `historical-drama` · `documentary` · `journalism` · `educational` · `children` · `drama-of-muslim-life` · `comedy` · `travel` · `recitation-or-lecture` · `critical` · `polemical`. Describes the kind of work. `polemical` is used only when reliable sources describe it that way, and they are cited |
| `reception[]` | Dated, sourced events: approvals, objections, fatwas, bans, cuts, awards, protests. Contested receptions use the `perspectives` block. The museum reports the reception and takes no side |
| `watch[]` | Official links only (see §7) with region and a last-checked date |
| `external_ids` | `wikidata`, `imdb`, `tmdb`, `tvdb`, `tvmaze`, `eidr`, `isan`, `elcinema`, `sinematurk`, `tsa`, `sinemalar`, `sourehcinema`, `filmindonesia`, `indiancinema`, `bmdb`, `africultures`, `african_film_db`, `kinopoisk`, `douban`, `bfi`, `afi`, `filmportal`, `youtube`, `internet_archive` and any other film-ID property Wikidata carries |

New predicates: `about`/`subject_of` (domain `screen`, `work`; range any class) · `set_in`/`setting_of` · `directed_by`/`directed` · `written_by`/`wrote_screenplay` · `produced_by`/`produced` · `broadcast_by`/`broadcast` · `features`/`appears_in` (principal cast and presenters) · `adaptation_of`/`adapted_as` · `version_of`/`has_version` · `episode_of`/`has_episode`.

`about` is the edge that matters. Every title should carry at least one `about` or `set_in` edge to an existing museum entity or a stub; a title with none is not yet indexed, only listed.

## 5. Discovery: finding everything, in every language

Wikidata's `main subject` property finds only tens of titles, so discovery runs on several independent signals and keeps every candidate with the signals that found it.

1. **Graph-driven queries (the strongest signal).** For every museum entity that has a Wikidata QID, ask Wikidata which audiovisual works have it as `main subject` (P921), `depicts` (P180), `characters` (P674), `narrative location` (P840), `set in period` (P2408) or `based on` (P144). As the museum grows, the index grows with it: adding `person/rabia-al-adawiyya` surfaces the 1963 Egyptian film about her.
2. **Category trees in every Wikipedia that has one.** Start from "Films about Islam" (Wikidata Q6832758) and its siblings: ar تصنيف:أفلام عن الإسلام, تصنيف:مسلسلات تلفزية إسلامية · tr Kategori:İslam ile ilgili filmler · fa رده:فیلم‌های مرتبط با اسلام · id Kategori:Film tentang Islam · ur زمرہ:اسلام کے بارے میں فلمیں · fr Catégorie:Film sur l'islam, and the documentary equivalents. Walk each tree to a fixed depth from the offline `categorylinks` dump (see `15-local-harvest.md`), map pages to QIDs, union the results.
3. **Keyword sweep in 30+ languages** over Wikidata labels and descriptions of audiovisual items, using a term list per language (Islam, Muslim, Qur'an, Prophet, mosque, hajj, Ramadan, imam, Sufi, caliph, and the names of the 300 most-linked museum figures and events).
4. **Regional databases by genre.** Browse the religious and historical genres of elCinema (ديني، تاريخي), TSA and SinemaTürk, SourehCinema (مذهبی، تاریخی), filmindonesia (religi), Pakistan Film Magazine, Africiné and the rest; a person or a polite crawler records title, year and ID only.
5. **Broadcaster archives and Ramadan line-ups**, year by year and country by country: the Ramadan drama season is the largest single source of religious and historical series in Arabic, Turkish, Urdu, Indonesian and Malay.
6. **Festival programmes, curated platforms and scholarly filmographies** (§3).
7. **Library and archive catalogues** for educational films and older documentaries: Europeana, DPLA, Library of Congress, WorldCat (identifier only), Internet Archive.
8. **Public submissions:** an issue form "Add a film or programme" with title in the original script, year, country, language, a link and what it is about.

**Language sweep order:** Arabic · Persian · Turkish · Urdu · Indonesian · Malay · Bengali · Hindi · English · French · Hausa · Swahili · Somali · Wolof · Amharic · Bosnian · Albanian · Russian · Tatar · Uzbek · Kazakh · Azerbaijani · Kurdish · Pashto · Punjabi · Sindhi · Tamil · Malayalam · Chinese · Uyghur · Thai · Tagalog · Japanese · Korean · German · Spanish · Portuguese · Italian · Dutch, then any language a candidate turns up in. The public coverage page shows titles per language so thin languages are visible.

**Known weak spots** (no usable open source found): Hausa (Kannywood), Central Asia, Malay television, Bangladesh, and Egyptian state television's archive. These need people: a country steward who knows the output, working from broadcaster schedules and press archives, with every find written back to Wikidata.

## 6. The pipeline branch

Same stages and gates as `09-ai-content-pipeline.md`, run locally per `15-local-harvest.md`:

```
HARVEST   screen-candidates   → candidates with the signals that found each (§5), one row per raw hit
DEDUPE    screen-reconcile    → merge on Wikidata QID → IMDb/TMDB/EIDR ID → normalised title + year + country;
                                dubbed and retitled releases become titles[] and versions[], never new entries
CLASSIFY  screen-relevance    → primary | substantial | setting | incidental, with the evidence sentence;
                                local model proposes, rules check, a person samples every batch
VERIFY    screen-verify       → existence, year, country and format confirmed by two independent sources
                                (one may be a national database); conflicts recorded, never averaged
LINK      screen-about        → about / set_in edges to museum entities; unknown targets go to the stub list
RECEPTION screen-reception    → approvals, objections, bans, awards from news archives and scholarship, each cited
DRAFT     draft-screen        → data/screen/<slug>.yaml + content/<lang>/screen/<slug>.md (status: draft)
GIVE BACK wikidata-proposals  → a file of new items and missing statements for Wikidata, reviewed before upload
VALIDATE  → PR → REVIEW       → same gate as every other entity
```

Review tiers: titles depicting prophets, Companions or Imams, polemical titles, and titles about living people are Tier A (two reviewers). Ordinary documentaries and dramas are Tier B. Bare `imported` records from Wikidata are sampled.

## 7. Watching, images and rights

- **Watch links are official or absent.** Accepted: the rights holder's own page, a licensed streaming service, the broadcaster's own channel, a public-domain file at the Internet Archive or Wikimedia Commons. A YouTube link is accepted only when the channel is verifiably the producer's or broadcaster's. Unofficial uploads are never linked, however complete.
- **Region and date on every link.** A weekly link-health job flags dead links; `checked` is shown to the visitor.
- **Embeds are opt-in per click**, as everywhere in the museum (`03-architecture.md` §11). Default is a text link.
- **No posters or stills.** They are copyright-protected almost everywhere and Wikimedia Commons rejects them. Each title gets a programmatic title card: the name in its original script, year, country, on the museum's geometric ground (`10-image-generation.md` §8.4). A poster is shown only when Commons holds it as public domain or freely licensed.
- **Depiction policy carries over.** A title whose `depiction.prophet` is anything other than `not-shown` takes `sensitivity: figurative-prophet`: no still from it is ever displayed, and the page says plainly how the work depicts him.
- **Attribution page:** the Screen index credits Wikidata, each open archive, and each database we link to, with the TMDB notice if TMDB look-ups are used.

## 8. How it appears in the museum

A third cross-cutting entrance beside Questions and Exhibits: the **Screening Room**.

- **Browse by what it is about.** The front of the hall is the museum's own map of subjects: the Prophet's life · the Companions · Karbala and the Imams · the caliphates and empires · al-Andalus · science and scholars · Sufis and poets · Hajj and the holy cities · Ramadan and daily practice · Muslim life today · Islam and the West · for children.
- **Facets:** language · country · decade made · era depicted · format · approach · tradition of the production where documented · "can be watched free" · relevance.
- **Two timelines.** When it was made, and the time it depicts. *Saladin the Victorious* sits in 1963 on one and in the 1180s on the other; the Time hall can show either as a layer.
- **Map.** Where it was produced and where it is set.
- **Ramadan seasons.** The series of each Ramadan, by Hijri year and country.
- **"On screen" panel on every entity page.** `person/ibn-rushd` lists *Destiny* (1997); `event/karbala` lists the films and series about it, each labelled with its tradition of production and its approach.
- **Title page:** all titles and scripts · format, year, countries, languages · what it is about (linked) · how it depicts sacred figures · versions and dubs · how it was received (dated, sourced, with perspectives) · where to watch officially · identifiers · sources. No stars, no score, no review.
- **"Check it against the record":** from a title, one link opens the museum entities it is about, so the visitor can compare the drama with what the sources say. The museum does not publish fact-checks of films; it puts the history one click away.
- **Kid mode** shows only `children` and family titles and hides `violence`, `polemical` and `contested` items.
- **Exports:** the whole index as CSV and JSON under CC0, per language and per subject.

## 9. Seed list (verified October 2026)

Each row was checked against Wikidata or another reference page; years are as recorded there. It is a starting spine of well-known titles across languages, to prove the model, not a canon.

**Arabic** — *The Message / الرسالة* (1976, separate Arabic and English versions) · *Omar / عمر* (2012 series) · *Mu'awiya, al-Hasan wa al-Husayn* (2011 series) · *The Imam / الإمام* (2017 series on Ahmad ibn Hanbal) · *Khalid ibn al-Walid* (2006 series) · *Dawn of Islam / فجر الإسلام* (1971) · *Al-Shaimaa / الشيماء* (1972) · *Hijrat al-Rasul / هجرة الرسول* (1964) · *Wa Islamah / وا إسلاماه* (1961) · *Saladin the Victorious / الناصر صلاح الدين* (1963) · *Destiny / المصير* (1997) · *Rabea al-Adaweya / رابعة العدوية* (1963) · *Muhammad Rasul Allah / محمد رسول الله* (Egyptian series, from 1980) · the Andalusian trilogy: *Saqr Quraish* (2002), *Rabee' Qurtuba* (2003), *Muluk al-Tawa'if* (2005) · *Al-Qa'qa' ibn Amr al-Tamimi* (2010) · *Muhammad: The Final Legacy / قمر بني هاشم* (2008) · *Resalat al-Imam / رسالة الإمام* (2023, on al-Shafi'i) · *Muawiya* (2025) · *Bilal: A New Breed of Hero* (2015 animation, UAE) · *You Will Die at Twenty / ستموت في العشرين* (2019, Sudan) · *A Door to the Sky / باب السماء مفتوح* (1989, Morocco)

**Persian** — *Muhammad: The Messenger of God / محمد رسول‌الله* (2015) · *Imam Ali / امام علی* (1990s series; sources differ on the year) · *Mokhtarnameh / مختارنامه* (2010–2011) · *Prophet Joseph / یوسف پیامبر* (2008–2009) · *The Men of Angelos / مردان آنجلس* (1997) · *Saint Mary / مریم مقدس* (2000) · *The Kingdom of Solomon / ملک سلیمان* (2010) · *The Fateful Day / روز واقعه* (1995) · *Hussein Who Said No / رستاخیز* (2014) · *Velayat-e Eshgh / ولایت عشق* (2000)

**Turkish** — *Diriliş: Ertuğrul* (2014–2019) · *Kuruluş: Osman* (2019–2025) · *Yunus Emre: Aşkın Yolculuğu* (2015–2016) · *Payitaht: Abdülhamid* (2017–2021) · *Mavera* (2021) · *Uyanış: Büyük Selçuklu* (2020–2021) · *Aşkın Yolculuğu: Hacı Bayram-ı Veli* (2022) · *Mehmed: Fetihler Sultanı* (2024–) · *Kudüs Fatihi Selahaddin Eyyubi* (2023–2025) · *Fetih 1453* (2012) · *Hazreti Ömer'in Adaleti* (1973) · *Mevlana Celaleddin-i Rumi: Aşkın Dansı* (2008)

**Urdu, Hindi, Bengali** — *Alif* (2019–2020) · *Shaheen* (1980, PTV) · *Khuda Kay Liye* (2007) · *The Sword of Tipu Sultan* (1990–1991) · *Garm Hava* (1973) · *The Clay Bird / মাটির ময়না* (2002) · *Lalsalu / লালসালু* (2001) · setting level: *Mughal-e-Azam* (1960), *Jodhaa Akbar* (2008)

**Indonesian and Malay** — *Sang Pencerah* (2010) · *Sang Kiai* (2013) · *Ayat-Ayat Cinta* (2008) · *Ketika Cinta Bertasbih* (2009) · *Hafalan Shalat Delisa* (2011) · *Para Pencari Tuhan* (2007–, Ramadan series) · *Sembilan Wali* (1985) · *99 Cahaya di Langit Eropa* (2013) · *Omar & Hana* (2017–, children's) · *Upin & Ipin* (2007–, began as a Ramadan special) · *Nur Kasih* (2009) · *Munafik* (2016)

**African languages and French** — *Ceddo* (1977, Senegal, Wolof) · *Timbuktu* (2014) · *Le Grand Voyage* (2004) · *Shaihu Umar* (1976, Nigeria, Hausa) · *The Milkmaid* (2020, Nigeria) · *Watu Wote* (2017 short, Kenya)

**English** — *Islam: Empire of Faith* (2000) · *Muhammad: Legacy of a Prophet* (2002) · *The Life of Muhammad* (BBC, 2011) · *Science and Islam* (BBC, 2009) · *An Islamic History of Europe* (BBC, 2005) · *Inside Mecca* (2003) · *Journey to Mecca* (2009) · *Koran by Heart* (2011) · *Prince Among Slaves* (2007) · *One Day in the Haram* (2017) · *Hajj: The Journey of a Lifetime* (BBC, 2001) · *Malcolm X* (1992) · *Little Mosque on the Prairie* (2007–2012) · *Ramy* (2019–2022) · *Ms. Marvel* (2022) · *We Are Lady Parts* (2021–2024) · *Citizen Khan* (2012–2016) · *1001 Inventions and the Library of Secrets* (2010 short)

**Other languages** — *Musulmanin / Мусульманин* (1995, Russian) · *Na putu* (2010, Bosnian) · *Alquibla* (from 1988, Spanish, TVE) · *Réquiem por Granada* (1991, Spanish) · *O Clone* (2001–2002, Portuguese, Brazil) · *Der Heilige Krieg* (2011, German, ZDF) · *Morgenland* (2009, German, ZDF) · *Knife in the Clear Water / 清水里的刀子* (2016, Chinese; subject still to be confirmed)

**Contested or polemical, recorded with their reception** — *The Lady of Heaven* (2021, UK) · *Islam: The Untold Story* (2012, UK) · *Submission* (2004, Netherlands) · *Fitna* (2008, Netherlands) · *Innocence of Muslims* (2012, US)

**Worked examples of the reception record** (each needs its sources attached before publication):
- *The Message*: the Prophet is never shown or heard. Its opening title states approval from al-Azhar and the High Islamic Congress of the Shia in Lebanon; al-Azhar's approval is reported to have been withdrawn later; the Muslim World League objected; filming moved from Morocco to Libya; it was banned in several countries.
- *Omar*: actors played the four Rashidun caliphs. Scholars including Yusuf al-Qaradawi and Salman al-Odah supported the production; al-Azhar's Islamic Research Academy and the Saudi Grand Mufti objected to portraying Companions.
- *Muhammad: The Messenger of God*: the face is not shown, the figure is. Al-Azhar and the Saudi Grand Mufti objected; the film had state backing in Iran.
- Iranian productions: the faces of Imams are usually not shown or are replaced by light (*Imam Ali*, *Mokhtarnameh*); *Hussein Who Said No* was withdrawn from cinemas in 2015 over its depiction of Abbas ibn Ali. The practice is documented case by case, not by one written rule.

## 10. Roadmap for the index

- **Phase 0:** `screen` schema, template, predicates, title-card generator, issue form.
- **Phase 1 (with the spine):** the seed list above as reviewed entries in English and Arabic (about 120), plus 180 more from the first harvest: **300 titles across at least 25 languages**, each with an `about` edge. Screening Room hall, "On screen" panel, exports.
- **Phase 2:** the full harvest of §5 run on the Mac; the first honest measure of the universe. Target **2,000 verified titles**, all Wikipedia category trees walked, first Wikidata give-back batch, Ramadan seasons for the last 20 years in Arabic, Turkish, Urdu and Indonesian.
- **Phase 4 (community):** country and language stewards for the weak spots of §5; partnerships with national film archives and festivals.
- **Year 2:** documentary strands at episode level; religious programming; 10,000+ records, most of them `imported`, with the curated core deep.
- **Ongoing:** weekly link health; monthly Wikidata diff; a public coverage grid of language × country × decade × format.

Nobody knows how many titles exist. The Phase 2 harvest reports the number per language with the signals that found each, and the coverage page shows it.

## 11. Risks

| Risk | Mitigation |
|---|---|
| "Everything" never finishes | Coverage grid by language, country, decade and format; relevance levels; curated core plus imported long tail |
| Copying a database we may not copy | Layered storage; the CC0 core takes facts only from Wikidata, open archives and our own cited research; IDs elsewhere |
| Linking to piracy | Official-only rule; channel verification; link-health job |
| Appearing to endorse or condemn a work | No ratings; reception reported with sources and perspectives; listed-not-endorsed banner |
| Depictions of the Prophet, Companions, Imams | `depiction` block; no stills; policy stated on the page; Tier A review |
| Polemical or hateful works | Neutral record, no video link, sensitivity flag, hidden in kid mode; extremist propaganda not indexed |
| Sectarian reading of the catalogue | Tradition of production recorded only when documented; equal treatment in facets; contested receptions as perspectives |
| One-language bias | Language sweep order; per-language targets; stewards |
| Misfiling a film as "about Islam" | Relevance classifier with evidence sentence; human sampling; `setting` level kept separate |
| Dead links and vanished platforms | `checked` dates; Internet Archive snapshot of the official page recorded as a source |

## 12. Acceptance tests

1. Searching *Çağrı*, *الرسالة* or *Mohammad, Messenger of God* reaches the same entry.
2. `person/ibn-rushd` shows *Destiny* under "On screen"; `screen/al-masir-1997` links back to him and to Córdoba.
3. A title with `depiction.prophet: figure-without-face` displays no image and states the depiction in words.
4. *Fitna* has an entry with a neutral description, its reception, no watch link, and is absent in kid mode.
5. The validator rejects a `watch` link without `kind`, `checked` and a source for its official status.
6. The validator rejects a `screen` entity whose only source is a database we may not copy from.
7. The coverage page reports titles per language and lists the languages with fewer than ten.
8. The CC0 export contains no field that came from TMDB, IMDb or any all-rights-reserved database.
