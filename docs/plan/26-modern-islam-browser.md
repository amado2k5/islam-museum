# 26 · The Modern Islam Browser (متصفح الإسلام المعاصر): proposal

Status: **approved by the founder on 6 November 2026 (D-000 in `docs/modern-islam/progress.md`); Phase 1 implemented the same day.** Written 6 November 2026 at the founder's request as a proposal under `docs/ai-change-gates.md` §1. This document, its companion folder [`docs/modern-islam/`](../modern-islam/README.md) (taxonomy, seed programme, the agent prompt, progress) and a planning-only lane row are the only files this proposal adds.

Companion files:

| File | What it holds |
|---|---|
| [`docs/modern-islam/README.md`](../modern-islam/README.md) | Index of the companion folder and the live status line |
| [`docs/modern-islam/taxonomy.yaml`](../modern-islam/taxonomy.yaml) | The machine-readable list of sections, kinds, award kinds, honour results, horizon stages and footprint channels |
| [`docs/modern-islam/seeds.md`](../modern-islam/seeds.md) | The seed programme: how the first 10,000 to 50,000 subjects are found, with named leads per section and the generators that produce the rest |
| [`docs/modern-islam/prompt.md`](../modern-islam/prompt.md) | The operative prompt to hand to any agent or model, with a role and a section filled in |
| [`docs/modern-islam/progress.md`](../modern-islam/progress.md) | Progress, decisions log and the excluded-items table (one file per section once waves start) |
| [`docs/agents/lanes/modern-islam.md`](../agents/lanes/modern-islam.md) | The lane document, planning-only until Phase 1 is approved |

## 0 · What the browser is, and what it is not

The Modern Islam Browser is the museum's entrance to **the last fifty years of Islam and Muslims, up to today and into what comes next**: from 1 Muharram 1396 (3 January 1976, conversion derived) to the day of the build, plus an "upcoming" horizon. It shows, in Arabic, English and Urdu, what Muslims anywhere in the world and in any language have made, said, organised, won, built, published, broadcast, sung, filmed, protested and are working on: websites, music, films, series, conferences, heritage months and festivals, protests and rights campaigns, books and bookshops, famous people, organisations, media, sport, awards and competitions, achievements and firsts, companies, arts, buildings, learning, and the upcoming.

It is a **front door and a set of views over the museum's one graph**, not a parallel database. A modern mosque stays a `building`; a nasheed album becomes a `work`; a convention is an `event`; a preacher is a `person`; a television series stays a `screen`. The browser adds what the graph lacks for the modern period (a few kinds, a few fields, one small class for prizes, and a handful of predicates) and then **filters, sorts and groups** the existing classes by date, country, language, section and footprint. Every record it shows is an ordinary museum record with sources, provenance and trilingual prose, reachable from every other page.

It is **not**:

- a ranking by taste: the "top 1000 songs" and every other "top" list is a transparent, sourced *reach index* computed at build time from cited inputs (section 4.6), never an editorial judgement;
- a streaming, listening or reading service: facts and official links only, no embedded video or audio, no lyrics, no copies of articles;
- a directory of advertisements: no paid placement, no ratings, no affiliate links (the rule of plan 11 applies);
- a platform for violent extremist media (the rule of plan 12 §2 applies);
- a judge of anyone's faith: a person's or a maker's religion is recorded only with its basis, never inferred from a name, a country or a subject.

## 1 · Why this belongs in the museum

- The museum's spine runs from the world Islam was born into to the present, but the last fifty years are the thinnest part of the graph relative to how much was made: about 11,200 persons, 2,150 works, 315 screens, 393 groups and 116 listings exist today, and only a small share of them are modern.
- Visitors alive today met Islam through a website, a nasheed, a Ramadan series, a convention, a protest, a sports star, an app. No open, multilingual, structured record of that exists; it is scattered across Wikipedia categories in fifty languages, award sites, chart databases, festival programmes, broadcasters' archives and news.
- Several plans and lanes already cover pieces of it: the Screen index (plan 12), the Made directory (plan 11), Figures (plan 13), the `modern-figures` lane, the Khutab and Durus Explorer (plan 25), the Fatwa Explorer's website index (plan 25 §3.4), the Themes atlas families for organisations, websites and apps, sport and modern relief (plan 14). The browser gives them one entrance and fills the gaps between them: music, awards and competitions, protests and rights, sport, media outlets, heritage months, achievements, enterprise, the upcoming.

## 2 · Scope: the window and the sections

### 2.1 The window

| Rule | Detail |
|---|---|
| Start | 1 Muharram 1396 / 3 January 1976. A record enters the browser when at least one of its dated facts falls on or after this day: a launch, release, first broadcast, first edition, founding, award, match, birth of the subject's public work, or a `horizon` (upcoming) block. |
| End | The day of the build. "Today" is computed at build time from the system clock, never typed. |
| Horizon | Anything announced, in production, under construction or scheduled for a future date carries a `horizon` block and appears in the Upcoming section until its date passes and a source confirms it happened; the record then stays in the browser as an ordinary dated record. |
| Older subjects | A person born before 1976 belongs when their public work in the window is documented. A series that began in 1975 and ran into the window belongs. A book first published in 1950 belongs only through its dated events in the window (a new translation, a prize, a ban), which are the things recorded. |
| Historical subjects of modern works | The historical subject of a modern work (a series about Umar, a nasheed about Badr) is linked with `about`; the subject itself stays in its own period and is not pulled into the browser. |

### 2.2 The nineteen sections

Each section has an id (used in the taxonomy, routes, lanes and progress files), a scope, the classes it is a view over, the lane or plan that already owns part of it, and targets for the first wave (the first 10,000 to 14,000 subjects) and for the full build (50,000 and beyond). Counts are subjects to find and write, not promises; the seed programme in [`seeds.md`](../modern-islam/seeds.md) shows how each number is reached.

| # | id | What it shows | Classes it is a view over | Already owned by | Wave 1 | Full |
|---|---|---|---|---|---|---|
| 1 | `web` | Websites, portals, forums, digital libraries, apps, games and devices made by Muslims or about Islam, in any language: what each is and is about, who runs or makes it, when it launched and closed, which languages and platforms, how it is covered on Wikipedia and in the news (founder's widening of 6 November 2026: not only the famous websites but the apps, the games and the devices) | `work` kind `website`, `app`, `online-library`; `listing` kind `app`, `software`, `platform`, `game`, `device` | Fatwa Explorer §3.4 (fatwa websites), theme `websites-and-apps`, Made wing (apps, games) | 1,200 | 6,000 |
| 2 | `music` | Albums, songs, artists, groups, labels and producers of nasheed, qawwali, naat, ilahi, inshad, Sufi music, religious pop and every song by a Muslim about Islam or religion; charts, certifications, awards; the reach index of 1,000 songs | `work` kinds `album`, `song` (new), `composition`; `person`, `group`; `listing` kind `record-label` (new); `award` | theme `music` (permissibility debate, recorded as perspectives) | 1,900 | 8,000 |
| 3 | `film` | Feature films, documentaries, shorts and animation about Islam made by Muslims anywhere, in any language: cast, crew, runtime, release, festivals, awards, reception, news | `screen` formats `film`, `short`, `tv_film`, `documentary`, `animation`; `person`; `event` kind `festival` | Screen index (plan 12) owns the class and the pipeline; the browser is its 1976+ view with `made.by_muslims` | 600 | 2,500 |
| 4 | `tv` | Television and web series, programmes, Ramadan line-ups, religious broadcasting and children's programmes: cast, producers, directors, broadcaster, seasons, trivia, reception, news | `screen` formats `series`, `miniseries`, `programme`, `web_series`, `documentary_series`, `children`; `listing` kind `tv-channel` | Screen index (plan 12) | 400 | 2,000 |
| 5 | `conferences` | Annual and recurring conferences, conventions, summits, ijtemas, forums and academic meetings about Islam or of Muslim bodies, with each edition's dates, venue, attendance, speakers, declarations, recordings and media | `event` kinds `conference`, `congress`, `gathering`, `council`, `declaration`; editions as `event` records `part_of` the series | Khutab and Durus lane (plan 25) owns recorded lectures and conference sermons as `work`; the browser owns the event series and editions | 900 | 4,000 |
| 6 | `heritage` | Islamic heritage months and days, festivals, commemorations, mawlid and urs gatherings, open iftars, Eid festivals, biennales and cultural seasons: where, when, who, programme, attendance | `event` kinds `heritage-month` (new), `festival` (new), `gathering`, `pilgrimage-season`; `practice` kind `festival` for the practice itself | theme `pilgrimages-and-mass-gatherings` | 300 | 1,500 |
| 7 | `rights` | Protests to defend Islam and against Islamophobia; the incidents, laws, bans, court rulings, reports and campaigns they respond to; rights bodies and monitoring projects; the UN day against Islamophobia | `event` kinds `protest` (new), `attack` (new), `law-enacted`, `court-ruling`, `persecution`, `declaration`; `work` kinds `report`, `law`, `court-judgment`; `group` | themes `modern-conflicts`, `rights-and-freedoms`; Figures (plan 13) for opponents and critics with time-scoped `story_roles` | 600 | 3,000 |
| 8 | `books` | Books about Islam and by Muslim writers since 1976 in every language, their writers, translators, publishers, bookshops, book fairs, prizes and news; Qur'an and hadith translations and editions of the period | `work` kind `book`; `person`; `listing` kinds `publisher`, `bookshop`; `event` kind `festival` (book fairs); `award` | Library and `lib-exp-modern-muslim-writers` lanes own mining of texts; Made wing owns bookshops as listings; the browser owns the modern catalogue view | 1,800 | 10,000 |
| 9 | `upcoming` | Everything announced and not yet done: buildings under construction, films and series in production, conferences and competitions scheduled, books and albums announced, apps in beta, expansions, bids and hosting rights | any class with a `horizon` block | none | 200 | 1,000 (rolling) |
| 10 | `figures` | Famous Muslims of the last fifty years by field: scholars and preachers, politicians and heads of state, diplomats, bankers and economists, scientists, doctors, historians, teachers and professors, writers, artists, journalists, influencers and creators, activists; what they did, where, their honours, their footprint | `person` with `roles`, `occupations`, `story_roles`, `faith`, `honours`, `footprint`, `reach` | `modern-figures` lane (media figures), Figures (plan 13), Job Browser (`occupations`) | 1,500 | 6,000 |
| 11 | `organizations` | Muslim organisations by country, worldwide and virtual: councils, unions, charities and relief agencies, student and professional bodies, women's organisations, da'wa bodies, interfaith bodies, mosque associations, think tanks, online communities and groups; names, founding, scope, leaders, news | `group` (all organisation kinds) with `scope` (new) and `made`; `listing` for platforms | Made wing (institutions shelf), theme `organisations` family, `modern-relief-and-development` | 1,000 | 4,000 |
| 12 | `media` | Newspapers, magazines, newsletters, news sites, television channels, radio stations, YouTube channels and podcasts about Islam and Muslims, from anywhere in any language: owner, founded, reach, languages, notable programmes, controversies, news | `listing` kinds `media`, `magazine`, `podcast`, `newspaper`, `tv-channel`, `radio-station`, `newsletter`, `channel` (new kinds); `work` kinds `newspaper`, `journal`, `podcast` for titles | Made wing (media kinds) | 500 | 2,000 |
| 13 | `sports` | Muslims in sport: athletes, teams, clubs, national sides, tournaments, Olympic and world results, awards and recognitions, firsts, hosting of major events; individual and team sports | `person` with `sports` (new block), `honours`; `group` kind `team` (new); `event` kind `tournament` (new); `award` | theme `sport`; Job Browser domain `sport` | 800 | 3,000 |
| 14 | `awards` | Awards, prizes, medals, rankings and competitions: Qur'an memorisation and recitation competitions, Islamic prizes, Arab and Muslim film, music and book awards, television competition shows; each award's history, categories, editions, winners, recordings, links and news | `award` (new class); `event` kinds `competition`, `award-ceremony` (new); `screen` format `programme` for competition shows; `honours` ties on every honoured record | none | 500 | 2,000 |
| 15 | `achievements` | Laureates, firsts and records: Nobel and other major laureates, astronauts, Olympic firsts, first Muslim office-holders, record-breaking buildings and gatherings, diplomats and office-holders in international bodies | `person`, `event`, `building` with `honours` and a `firsts` facet (taxonomy) | Figures (plan 13) | 500 | 2,000 |
| 16 | `enterprise` | Every kind of business Muslims have founded or own since 1976 (founder's widening of 6 November 2026): companies and conglomerates, industries and manufacturers, chains and groceries, restaurants and food products, travel companies, airlines and hotels, brands and fashion houses, shops, crafts, clinics, technology companies and start-ups, banks and funds; the halal industry; Islamic finance institutions and standards; wealth and power rankings as sourced rankings | `listing` kinds `company`, `startup`, `conglomerate`, `manufacturer`, `brand`, `fashion`, `chain`, `grocery`, `shop`, `restaurant`, `food_product`, `travel`, `airline`, `hotel`, `product`, `craft`, `clinic`, `fund`; `group` kinds `bank`, `standards-body`, `certifier`; `award` kind `ranking` | Made wing (plan 11) owns the directory and its basis rules; the browser is its 1976+ view | 1,000 | 5,000 |
| 17 | `arts` | Calligraphy, visual arts, architecture prizes, modest fashion, comedy, spoken word and poetry, theatre, exhibitions, museums and biennales of Islamic art, arts awards and arts-competition shows involving Muslims | `person`; `work` kinds `poem`, `diwan`, `composition`; `event` kinds `exhibition` (new), `festival`; `building` kind `museum` (new); `award` | theme family P (arts) | 400 | 1,500 |
| 18 | `built` | Mosques, Islamic centres, museums, universities and major works built or completed since 1976, and the works at the two Holy Mosques: architect, client, cost where sourced, capacity, opening, awards | `building` (existing kinds plus `islamic-centre`, `museum`, `university-campus`); `event` kind `founding` | Prose-fill buildings lane owns thin existing buildings | 400 | 1,500 |
| 19 | `learning` | Universities, colleges, seminaries and schools; online academies; scholarships; curricula; Qur'an and hadith translations and editions of the period; digital libraries and corpora | `group` kinds `university`, `seminary`, `school` (listing), `institution`; `work` kinds `book` (translations), `curriculum`, `online-library` | Education programme (learning *surfaces*, not the catalogue), `lib-*` lanes | 500 | 2,000 |
| | | **Totals** | | | **≈ 14,000** | **≈ 65,000** |

Cross-cutting views (section 4) are not sections: the year-by-year timeline, the world map, the language view, the footprint view (on Wikipedia, in the news), the reach indices and the "new this month" list.

### 2.3 What is in and what stays out

In: anything in the nineteen sections made by Muslims, about Islam or Muslims, from any country in any language, documented by at least one defined source. Non-Muslim makers of works *about* Islam (a documentary by a non-Muslim broadcaster, a book by an academic) are in the sections about works and are marked `made.by_muslims: false` with the basis, because the section's subject is Islam; they are excluded only from the "by Muslims" filter. Critics, opponents and polemics are in, labelled and attributed, with time-scoped `story_roles`, as plan 13 requires.

Out: incidental appearances (a film with one Muslim character, a company with one Muslim director), content whose only source is a social-media post with no second signal, violent extremist media, private individuals, and personal data beyond public roles.

## 3 · The data model

The browser reuses the twenty-three classes and adds the minimum: one small class, a few kinds, five fields, and a few predicates. Everything below is a proposal until approved; names follow the repository's conventions.

### 3.1 Reuse map

| Thing | Class and kind | Fields already there |
|---|---|---|
| Website, portal, forum, digital library | `work` kind `website` / `online-library` | `url`, `launched`, `closed`, `languages`, `publisher`, `archive_url`, `orientation`, `content_type`, `reception`, `audience`, `host` |
| App | `work` kind `app` or `listing` kind `app` | `links`, `made`, `founded`, `languages` |
| Film, documentary, short, animation | `screen` | `format`, `relevance`, `titles`, `released`, `countries`, `languages`, `runtime_min`, `depiction`, `approach`, `reception`, `watch`, `external_ids`, relations `directed_by`, `written_by`, `produced_by`, `features`, `about`, `set_in` |
| Series, programme | `screen` | `first_broadcast`, `ramadan_season`, `seasons`, `episodes`, `broadcaster`, `part_of`, `episode_of`, `broadcast_by` |
| Conference, convention, summit, ijtema, festival edition, competition edition | `event` | `kind`, `date`, `places`, `participants`, `recurs`, `first_held`, `editions[]` with `attendance`, `part_of`, `outcome`, `significance` |
| Protest, attack, law, ruling | `event` kinds `protest`, `attack` (new), `law-enacted`, `court-ruling`, `persecution`, `declaration` | `sides`, `casualties`, `outcome`, `caused` / `caused_by`, `responded_to` (range widened to `event`) |
| Book, translation, report | `work` kind `book`, `report` | `authors`, `language`, `composed`, `editions`, `translations`, `publisher`, `reception` |
| Famous person | `person` | `roles`, `occupations`, `story_roles`, `faith` (two-source rule), `born`, `died`, `languages`, `traditions` |
| Organisation | `group` | `kind`, `made`, `founded`, relations `founder_of`, `member_of`, `funds`, `serves`, `located_in` |
| Media outlet | `listing` | `kind`, `categories`, `made`, `founded`, `status_business`, `location`, `links`, `languages` |
| Company, bank, fund | `listing` kinds `company`, `startup`, `fund`; `group` kind `bank` | as above |
| Mosque, centre, museum, campus | `building` | existing building fields, `built` / `commissioned` |
| Reach of a channel, a lesson, a recording | `media` records and the recordings index | as the audio-video harvest defines them |

### 3.2 New kinds (enum additions, `schema/enums/kinds.yaml`, append-only)

| Enum | Add |
|---|---|
| `work` | `album`, `song` |
| `event` | `protest`, `attack`, `competition`, `award-ceremony`, `festival`, `heritage-month`, `exhibition`, `tournament`, `launch` |
| `listing` | `newspaper`, `tv-channel`, `radio-station`, `newsletter`, `channel`, `record-label`, `production-company`, `device`, `product`, `chain`, `grocery`, `airline`, `hotel`, `manufacturer`, `conglomerate` |
| `group` | `team`, `think-tank`, `online-community` |
| `building` | `islamic-centre`, `museum`, `university-campus` |
| `roles` (`schema/enums/roles.yaml`) | `singer`, `composer`, `actor`, `director`, `producer`, `presenter`, `journalist`, `diplomat`, `banker`, `economist`, `entrepreneur`, `comedian`, `influencer`, `coach`, `astronaut`, `judge`, `lawyer`, `nurse`, `professor`; added 6 November 2026 at the founder's request: `reciter`, `muezzin`, `munshid`, `sufi-singer` (figures field "Reciters, muezzins and munshids", listed first) |

Where the Job Browser already models an occupation, `occupations` is used as well; `roles` stays the quick facet.

### 3.3 One new class: `award`

A prize, medal, certification scheme or ranking is a thing with its own history, categories and editions, and it is referenced by hundreds of honoured records. It fits no existing class (`group` is the body that gives it, `event` is one ceremony). The class is small and read-mostly.

```yaml
id: award/king-faisal-prize
class: award
kind: prize                   # prize | medal | certification | ranking | title | scholarship | competition-prize
label: { ar: "جائزة الملك فيصل", en: "King Faisal Prize", ur: "شاہ فیصل ایوارڈ" }
summary: { ar: "…", en: "…", ur: "…" }
awarded_by: group/king-faisal-foundation
since: { edtf: "1979", calendar: gregorian, precision: year, sources: [source/…] }
until: null
fields: [service-to-islam, islamic-studies, arabic-language, medicine, science]   # free list; labels in taxonomy where shared
categories:                    # named categories with their own dates where a source gives them
  - { id: service-to-islam, label: { ar: "خدمة الإسلام", en: "Service to Islam", ur: "خدمتِ اسلام" }, since: { edtf: "1979" } }
country: sa
recurs: annual
ceremony: event/king-faisal-prize-ceremony          # optional series event
honours_count: derived          # computed at build from honours ties
external_ids: { wikidata: "Q…" }
links: { website: "https://…" }
sources: [source/…]
provenance: { … }
status: { review: published, completeness: 3 }
```

A win, nomination, shortlist, certification or ranking position is **not** an award record. It is an `honours` tie on the honoured record (3.4), and the graph builder derives `awarded` / `awarded_to` edges from it. Competitions themselves (a Qur'an competition) are `event` series with editions; the prize they give may also be an `award` record when it has a life of its own (a named trophy, a ranking).

If the founder prefers no new class, the fallback is `work` kind `award` with the same fields; the plan recommends the class because an award is not a work and because the class list is already quoted by the submissions as growing (the `invention` precedent, D-000).

### 3.4 Five new fields on existing classes

All are optional, sourced per entry, and validated. They are what the browser filters and sorts on.

**`honours[]`** on `person`, `work`, `screen`, `group`, `listing`, `building`, `event`:

```yaml
honours:
  - { award: award/king-faisal-prize, category: service-to-islam, year: 1983, result: won, note: "…", sources: [source/…] }
  - { award: award/grammy-awards, category: best-contemporary-world-music-album, year: 2005, result: won, for: work/egypt-youssou-ndour, sources: [source/…] }
  - { award: award/riaa-certification, result: certified, level: platinum, territory: us, date: { edtf: "2011-03" }, sources: [source/…] }
  - { award: award/muslim-500, result: ranked, position: 12, year: 2024, sources: [source/…] }
# result: won | nominated | shortlisted | longlisted | certified | ranked | honoured | finalist | participant
```

**`footprint`** on every class: how the subject is covered elsewhere, each entry sourced and dated. It drives the "on Wikipedia / in the news" badges and the language view.

```yaml
footprint:
  wikipedia: { languages: [ar, en, ur, tr, id, fr], checked: 2026-11-06, sources: [source/wikidata-…] }
  wikidata: Q…
  press:                                   # dated press coverage, each a defined source entity
    - { source: source/bbc-2010-…, date: { edtf: "2010-05-12" }, outlet: listing/bbc-news, lang: en, kind: feature }
    - { source: source/aljazeera-2015-…, date: { edtf: "2015" }, outlet: listing/al-jazeera, lang: ar, kind: news }
  # kind: news | feature | interview | review | obituary | investigation | opinion
  catalogues: { imdb: "tt…", musicbrainz: "…", discogs: "…", openlibrary: "OL…", isbn: ["…"] }
```

**`reach[]`** on `person`, `work`, `screen`, `listing`, `group`: dated platform or circulation figures, never stated as museum facts in prose.

```yaml
reach:
  - { platform: youtube, metric: subscribers, value: 12000000, date: 2026-11-01, sources: [source/youtube-channel-…] }
  - { platform: spotify, metric: monthly-listeners, value: 2100000, date: 2026-11-01, sources: [source/…] }
  - { platform: print, metric: circulation, value: 45000, date: 2019, sources: [source/…] }
  - { platform: similarweb, metric: monthly-visits, value: null, note: "not recorded: no open source", sources: [] }
# platform: youtube | spotify | apple-music | anghami | tiktok | instagram | x | facebook | telegram | website | print | broadcast | app-store | play-store
```

**`horizon`** on any class: the upcoming block.

```yaml
horizon:
  stage: under-construction        # announced | in-development | in-production | under-construction | scheduled | beta | bid | postponed | cancelled
  expected: { edtf: "2027", calendar: gregorian, precision: year, sources: [source/…] }
  announced: { edtf: "2023-05-10", sources: [source/…] }
  by: group/…                       # who announced it
  note: { ar: "…", en: "…", ur: "…" }
  sources: [source/…]
```

When `expected` has passed and a source confirms the thing happened, the agent removes `horizon` and records the dated fact; when it is postponed or cancelled, `stage` says so with a source. A build check lists every `horizon` whose `expected` is more than 90 days in the past.

**`sports[]`** on `person`, and **`tracks[]`** on `work` kind `album`:

```yaml
sports:
  - { sport: football, discipline: null, position: forward, teams: [group/liverpool-fc], national_team: eg, start: { edtf: "2006" }, end: null, sources: [source/…] }
tracks:
  - { n: 1, title: { ar: "…", en: "…" }, work: work/…, duration_s: 254, lang: ar, performers: [person/…], sources: [source/…] }
```

`group` gets **`scope`** (`local | national | regional | international | virtual`) and **`countries[]`** for the organisations view; `listing` already has `location.online_only` and `serves`.

### 3.5 Predicates (`schema/predicates.yaml`, append-only)

| Predicate | Inverse | Domain → range | Use |
|---|---|---|---|
| `performed` | `performed_by` | person, group → work | singer or group to song or album |
| `composed` | `composed_by` | person → work | composer to song |
| `produced_work` | `work_produced_by` | person, group, listing → work | producer or label to album; `produced_by` stays for screens |
| `played_for` | `had_player` | person → group | athlete to club or team, temporal |
| `represented` | `represented_by` | person, group → polity, place | athlete or team to the country or city represented, temporal |
| `owns` | `owned_by` | person, group → listing, group | owner to outlet, company, club |
| `organized` | `organized_by` | person, group → event | protest or festival organiser; `convened` stays for conferences |
| `awarded` | `awarded_to` | award → person, work, screen, group, listing, building, event | **derived** from `honours`, rejected in hand-written relations |
| `hosted` | `hosted_by` | place, polity, building → event | host city or country of a tournament, summit or fair |

Existing predicates reused with widened domain or range where the validator needs it: `about` (add `event`, `award` to the domain so a protest or a prize can be about something), `responded_to` (add `event` → `event` for a protest that answers an incident), `opposed` (add `event`, `work` to the range), `wrote_about` (add `listing` to the domain for outlets), `features` (add `event` for a festival's line-up), `publishes` (already listing, group → work).

### 3.6 Validator rules (Phase 1)

- Every record with a browser section needs at least one dated fact on or after 3 January 1976 or a `horizon` block; the section is derived from class, kind and fields by `scripts/modern/sections.ts`, never typed.
- `honours[]`: `award` must resolve to an `award` record, `result` is enumerated, `year` or `date` is present, `sources` non-empty, `position` only with `ranked`, `level` only with `certified`.
- `footprint.press[]`: each `source` resolves to a `data/source/` record of kind `secondary`, `date` present, `outlet` resolves when given.
- `reach[]`: `platform`, `metric`, `date` and `sources` required; a figure without a date is rejected.
- `horizon`: `stage` enumerated, `expected` or `announced` present, `sources` non-empty; a build warning lists stale horizons.
- `sports[]`: `sport` from the taxonomy, teams resolve to `group` records, dates are date objects.
- `tracks[]`: `n` unique and ascending, `work` resolves when given.
- `award`: `kind` enumerated, `awarded_by` resolves, `since` is a date object.
- Faith: the two-independent-sources rule of the `modern-figures` lane applies verbatim; structured data alone never settles faith; a bare branch settles nothing; headship never counts.
- Made basis: `made.by_muslims` requires `basis` and, for `documented`, at least one source; `unverified` is never published as "by Muslims".
- No lyrics: a prose lint rejects more than two consecutive lines of a song's words, and any lyric block.
- No typed honorifics, no typed Qur'an text, no quotation over 40 words: the existing rules.
- Living persons: the living-person policy of plan 05; family detail only where the public work needs it.

### 3.7 Sources and their licences for this period

The screen-index survey (plan 12 §3) is the model. Verdicts for the sources this browser adds:

| Source | Gives | Verdict |
|---|---|---|
| Wikidata | Items for people, works, events, organisations, awards, with identifiers; `P166` award received, `P1411` nominated for, `P2031`/`P2032` work period, `P571` inception, `P856` website, `P641` sport, `P54` member of sports team, `P1303` instrument, `P136` genre, `P175` performer, `P264` record label, `P577` publication date, `P495` country of origin, `P407` language, `P921` main subject, `P140` religion | **Ingest** (CC0), record the revision, use for entity facts only, per the broad rule |
| Wikipedia in every language | Articles, categories, infoboxes | **Discover and cite** for entity facts where the article cites a source; never for prose |
| MusicBrainz, Discogs database dumps | Albums, tracks, artists, labels, release dates, identifiers | **Ingest** (CC0 data), store ids in `footprint.catalogues` |
| Open Library, national library catalogues, ISBN agencies | Books, editions, authors, ISBNs | **Ingest** identifiers and bibliographic facts; cite |
| IMDb, TMDB, elCinema and the national film databases | Titles, credits | **Store the id and link**, exactly as plan 12 says |
| RIAA, BPI, IFPI, SNEP, RIM (Malaysia), ASIRI (Indonesia) certification databases; official charts | Certifications, chart peaks | **Cite** each certification or peak as a dated fact; copy no tables |
| Award and festival websites, prize registers | Winners, categories, editions | **Cite**; each edition as a fact with the page |
| Olympic, FIFA, ICC, UFC, IAAF/World Athletics, UCI and federation databases; Olympedia | Results, medals, caps | **Cite**; results are facts |
| Wayback Machine | Earliest capture of a website | **Cite** as "earliest archived capture", never as the launch date; the launch date comes from the site, Wikidata or press |
| WHOIS / RDAP | Domain registration date | **Cite** as "domain registered", a distinct fact from launch |
| YouTube, Spotify, Apple Music, Anghami, TikTok, Instagram, X, Telegram | Audience figures | **Record as dated platform figures** in `reach`, the figure read in the browser on the date given; no API harvest, no stored API data (plan 12 §3 YouTube rule) |
| Press: Al Jazeera, BBC, Anadolu, AP, Reuters, Middle East Eye, The Muslim News, Republika, Dawn, Hürriyet and every outlet in the `media` section | News about the subject | **Cite** as `data/source/` records of kind `secondary`; list in `footprint.press`; copy nothing |
| Tell MAMA, CAIR, Runnymede, OSCE ODIHR, Pew, ISPU, Muslim 500, Forbes lists | Reports, rankings | **Cite** as reports (`work` kind `report`) and rankings (`award` kind `ranking`); figures attributed |
| Festival programmes, conference sites, broadcaster schedules | Editions, line-ups | **Cite**; record the page and the date read |

What stays out of git is unchanged: no dumps, no scraped tables, no lyrics, no article text, no video, no images outside the whitelist. Everything downloaded during research lives on the microSD harvest drive, `/Volumes/exmicroSD/islam-museum-harvest/modern/<section>/` (founder's standing rule, restated 6 November 2026: always the microSD, never the Mac's main drive; anything found on the main drive is moved there and deleted from the Mac), outside the repository.

## 4 · Views and UI

The browser follows the Inventions and Jobs browsers: static Astro pages, Svelte islands only for filtering and the map, complete lists in HTML without JavaScript, trilingual from the first commit, WCAG 2.2 AA, byte budgets measured and recorded. Design rules: `docs/site/README.md`.

### 4.1 Routes

| Route | Page |
|---|---|
| `/[lang]/modern/` | Browser home |
| `/[lang]/modern/<section>/` | One of the nineteen section pages |
| `/[lang]/modern/<section>/<facet>/` | A facet page where the section defines them (for example `music/songs/`, `music/albums/`, `music/artists/`, `awards/quran-competitions/`, `rights/protests/`, `figures/politicians/`, `sports/football/`) |
| `/[lang]/modern/year/<yyyy>/` | Everything in one Gregorian year, with the Hijri year(s) shown |
| `/[lang]/modern/country/<cc>/` | Everything of one country |
| `/[lang]/modern/language/<code>/` | Everything in one language |
| `/[lang]/modern/upcoming/` | The horizon list, soonest first |
| `/[lang]/modern/new/` | Records added or changed in the last 30 days (from git dates at build) |
| `/[lang]/modern/top/<list>/` | Reach indices: `songs`, `albums`, `websites`, `channels`, `books`, with the formula on the page |
| `/[lang]/award/<slug>/` | Award page (generic entity route) |
| `/api/v1/modern/<section>.json`, `/api/v1/modern/year/<yyyy>.json`, `/api/v1/award/<slug>.json`, `/api/v1/modern/top/<list>.json` | Static exports, built with the site |

Entity pages stay at `/[lang]/<class>/<slug>/`; the browser adds strips to them (4.5).

### 4.2 Home

- Arabic-first title and lede; a status line with counts per section from the built graph; a "growing" badge until the first wave is complete.
- The **year ribbon**: 1396 → today in Hijri with Gregorian beneath, fifty-one ticks, each tick's height the count of records in that year; clicking a year opens the year page; built as HTML with a Svelte enhancement for hover counts.
- The **nineteen section tiles**, each with its count, its newest three records and its icon; order fixed by the taxonomy.
- **This month** strip: anniversaries and recurring events falling in the current month (built from `recurs` and `editions`), and the records added this month.
- **Upcoming** strip: the five soonest `horizon` items.
- **World map** (MapLibre + PMTiles, reused from the atlas): one dot per country sized by count; a country click opens the country page; a plain country list beneath for no-JS readers.
- **Language strip**: the languages the records are in, by count, linking to language pages.

### 4.3 Section pages

Common frame for every section: lede, counts, filter bar (country, language, year range, kind, "by Muslims" basis, "on Wikipedia", "in the news"), a sort (newest, oldest, A–Z, most honours, most footprint), the complete list as cards or rows in HTML, pagination by static pages of 100. Each section adds its own view:

| Section | Added view |
|---|---|
| `web` | Table: name, what it is about (`content_type`), languages, launched, closed, runs it, Wikipedia languages, press count; "active / closed" toggle; a timeline of launches by year |
| `music` | Tabs: songs, albums, artists, labels; the reach index link; filter by genre (nasheed, qawwali, naat, ilahi, inshad, religious pop, hip-hop, Sufi); honours badge (award, certification); "about" chips to the historical subjects |
| `film`, `tv` | The Screen index cards with the browser's filters; Ramadan season view for `tv` (one row per Hijri year); cast and crew strips; festivals and honours |
| `conferences` | Series list with next edition date and city; an editions table per series (year, city, venue, attendance, theme, declaration, recordings link); a calendar view by month |
| `heritage` | Calendar by month and by Hijri month; a map of festivals; heritage months by country with the year they began |
| `rights` | Timeline of incidents and the protests that answered them, side by side; laws and rulings by country; reports shelf; organisations shelf. Two cited voices on every contested item, no verdict |
| `books` | Shelf by language and genre; writers A–Z; publishers and bookshops map; fairs calendar; translations of the Qur'an and hadith as their own shelf; prizes column |
| `upcoming` | Soonest first; stage badge; a "happened" archive once the date passes |
| `figures` | Field tabs (scholars and preachers, politics and state, diplomacy, finance and economics, science, medicine, history and the academy, teaching, writing, arts, media and creators, activism, sport links); country and decade filters; honours and footprint columns; faith shown only where recorded with basis |
| `organizations` | By country (map and list), worldwide bodies, virtual; kind facet (council, charity, student, women's, da'wa, interfaith, think tank, online community); founding decade; leaders strip |
| `media` | Kind tabs (newspapers, magazines, newsletters, news sites, TV channels, radio, YouTube channels, podcasts); language and country; founded; reach column with dates; owner strip |
| `sports` | Sport tabs; athletes, teams, tournaments; medals table (Olympics, World Cups, world championships, continental titles); firsts shelf; hosting shelf (World Cup 2022, Islamic Solidarity Games, Asian Games, Expo) |
| `awards` | Tabs: Qur'an competitions, Islamic prizes, film awards, music awards, book awards, rankings, television competition shows; award page with editions and winners table; "search a winner" |
| `achievements` | Laureates (by prize), firsts (by field and country), records, space, international office-holders |
| `enterprise` | Kind tabs; Islamic finance shelf (banks, standards bodies, indices); halal industry shelf; rankings shelf, each ranking labelled with its publisher and year |
| `arts` | Discipline tabs; exhibitions and biennales calendar; museums map; prizes |
| `built` | Map and list; completed by year; architect and client strips; the Holy Mosques works as a timeline |
| `learning` | Institutions map; online academies list; translations shelf; scholarships; digital libraries |

### 4.4 Entity pages

The generic entity layout renders everything; the browser adds, in order, where the data exists:

1. **Section chip** ("Modern Islam · Music") linking back to the section.
2. **Quick facts** row for the class: launched/released/founded, country, languages, runtime or tracks, broadcaster or label or publisher, status (active, closed, upcoming).
3. **Honours strip**: each award with year, category, result; links to the award page.
4. **Footprint strip**: Wikipedia languages as chips, Wikidata link, catalogue ids, and the **Press** list sorted by date (outlet, headline in the museum's words, date, language, link to the source record).
5. **Reach strip**: dated platform figures with the date of reading, each attributed to its platform.
6. **Upcoming badge** when `horizon` exists, with stage and expected date.
7. **Listen / watch / read / visit** official links only (`watch[]`, `links`, `url`), with region and last-checked date; never an embed.
8. **About and set in** chips to the historical subjects, and the usual relations, perspectives and sources.

### 4.5 Strips on other pages

- Person page: honours, sports, reach, "appears in" (songs performed, films featured, conferences attended, protests organised).
- Place and country pages: "Modern Islam here" strip with counts per section.
- Period page for the modern era: a link to the browser's year ribbon.
- Award page: editions and winners table; related awards; the awarding body.
- Theme hubs `websites-and-apps`, `music`, `sport`, `modern-relief-and-development`, `modern-conflicts`: a "browse all" link into the section.
- Landing page card and Explore menu entry, shipped with the pilot (Phase 2) so the browser is on the main page from its first day in production.

### 4.6 The reach indices ("top 1000 songs" and the others)

The museum does not rank by taste. Each list is a **reach index**: a score computed at build time from cited inputs, with the formula printed on the page and every input visible on the record. Proposed formula for songs and albums (weights are a Phase 1 decision, printed and versioned):

| Input | Where it comes from | Points |
|---|---|---|
| Award won / nominated | `honours` | 10 / 4 per entry, capped at 40 |
| Certification | `honours` with `certified` | gold 6, platinum 10, multi-platinum 15, capped at 30 |
| Chart peak | `honours` with `ranked` on a chart award | top 10: 8, top 40: 4, charted: 2, capped at 16 |
| Dated platform figures | `reach` | log10 of the largest figure per platform, summed over at most three platforms, capped at 24 |
| Wikipedia languages | `footprint.wikipedia.languages` | 1 per language, capped at 15 |
| Press items | `footprint.press` | 1 per dated item, capped at 10 |
| Cover versions and uses | relations `version_of` | 1 each, capped at 5 |

Ties sort by release date, oldest first. A record with no inputs has no score and is not listed. The page says: "This index measures how widely a song is documented, not how good it is; the museum does not rank music by taste." The same mechanism, with its own weights, builds the website, channel, album and book indices. The permissibility debate on music is recorded once, on `theme/music` and `concept/music`, as perspectives with Sunni positions first, and linked from the section lede, with no verdict.

### 4.7 Components and files (Phase 2, to confirm against `main` at the time)

`site/src/pages/[lang]/modern/**`, `site/src/lib/modern.ts` (sections, filters, reach indices, year ribbon data), `site/src/components/modern/{SectionTiles,YearRibbon,HonoursStrip,FootprintStrip,ReachStrip,HorizonBadge,PressList,EditionsTable,MedalsTable}.astro|svelte`, `site/src/lib/nav.ts`, `site/src/components/Landing.astro`, `site/src/lib/browse.ts`, `site/src/lib/entity.ts`, `site/src/pages/llms.txt.ts`, `i18n/{ar,en,ur}.yaml` (one `modern:` block, every key in all three in the same commit), `scripts/modern/{sections,reach,census}.ts`, `scripts/check-site.ts`, `scripts/check-weight.ts`, tests in `scripts/*.test.ts`. The map reuses the atlas tiles; no new tileset.

Byte budgets are set from measured output. Browser checks at 390 px and desktop, light and dark, RTL and LTR, with JavaScript off.

## 5 · Discovery: how 10,000 become 50,000

The seed programme ([`seeds.md`](../modern-islam/seeds.md)) gives, per section, the named leads to start from and the **generators** that produce the rest. The generators, in order of yield:

1. **Wikidata queries** on the local subset already on the founder's Mac (the `wikidata-import` lane's P140 = Islam set, about 82,000 candidates) and on the live endpoint for properties the subset lacks: works with `P921` main subject in the Islam tree, people with `P140` Islam and an occupation in the section's list, organisations with `P140` or an Islam-related `P31`, awards and competitions, sports people with `P140` Islam, albums and songs by those people.
2. **Wikipedia category trees** in at least thirty languages (ar, en, ur, tr, fa, id, ms, bn, hi, fr, de, es, ru, sw, ha, so, uz, kk, az, ku, ps, sd, pa, ta, ml, zh, ja, ko, nl, it, bs, sq, ta): the categories of Islamic websites, nasheed artists, Islamic films, Islamic organisations by country, Muslim sportspeople by country, Islamic awards, Qur'an competitions, Islamophobia incidents, protests. Membership is a lead; facts come from Wikidata and cited articles.
3. **Registers and lists**: award sites (winners by year), festival archives, competition results, certification databases, Olympic and federation databases, the Muslim 500 (as a ranking), chamber and council member lists, broadcaster programme archives, book-fair exhibitor lists, publisher catalogues, app-store categories, podcast directories.
4. **Press archives** in the `media` section's outlets: each year's coverage of each section's subjects.
5. **The museum itself**: every existing modern record (persons with `wings: [living]`, screens since 1976, listings, groups founded since 1976, recurring events) joins the browser on day one through the derived section; the census script counts them.
6. **Snowballing**: every new record's relations (performer → label → other artists; convention → speakers → organisations; protest → organisers → campaigns) are leads for the next batch.

Every lead enters the section's queue file (`docs/modern-islam/queue/<section>.yaml`, the Inventions browser's shape: state, batch, lead sources, flags, disposition). Exclusions are recorded with reason, gate and an override line, per the founder's standing rule.

### 5.1 Browser first, APIs last (founder's instruction, 6 November 2026)

Research runs **in the founder's Mac browser** (Google Chrome, with its sign-ins, driven by the agent's browser tools), reading pages the way a visitor does: Wikipedia and Wikidata pages, award sites, festival archives, chart and certification pages, broadcasters' schedules, platform pages for dated figures, press archives, publisher catalogues. An API or a dump is used only where the browser cannot do the job at the scale needed (the local Wikidata subset already on the Mac for the first candidate sweep, MusicBrainz and Open Library identifiers), and never for a platform whose terms forbid it. The agent may **install any tool on the Mac** that helps (Homebrew, `uv`/`pip`, `npm`, Playwright for repeatable page reads, DuckDB or SQLite for the local queues, Apple Vision for OCR of scanned programmes and posters, Ollama or MLX for local drafts and translations with the model named in `provenance`), as the Inventions browser's D-000 item 2 already allows. On any site where the founder is logged in, one action at a time, with pauses, no parallel calls. Everything saved stays outside git, on the microSD harvest drive under `/Volumes/exmicroSD/islam-museum-harvest/modern/<section>/`, never on the Mac's main drive; what enters git is facts, citations, the museum's own prose and dated figures.

## 6 · Phases: a pilot in production first, then enrichment

The founder's instruction of 6 November 2026 sets the order: **get the browser to production sooner rather than later**, with at least one real, sourced subject under every section and the UI on the landing page, then keep adding subjects and prose incrementally. The phases are therefore:

| Phase | Scope | Gate | Label |
|---|---|---|---|
| 0 · Plan | This proposal, the taxonomy, the seed programme, the prompt, the lane (planning-only), a census script counting existing modern records per derived section | Founder's written approval of sections 3 and 12 | `non-impacting` |
| 1 · Schema and API | `award` class; new kinds and roles; `honours`, `footprint`, `reach`, `horizon`, `sports`, `tracks`, `scope`; predicates and widened domains; `scripts/modern/sections.ts`; validator rules; tests with invalid fixtures; static API routes; three locales; claims register and evidence map updated in the same commit | `npm run validate` 0 errors, `npm test`, `npm run build`, invalid fixtures each fail, PR merged | **`submission-impacting`** (class list, API routes); needs explicit sign-off |
| 2 · Pilot: one subject per section, the browser, the landing card | **Nineteen records, one per section** (the pilot list in `seeds.md` §0), each complete to the rich-first-pass standard with its source records, `honours`, `footprint`, `reach` and `horizon` where sources exist, and trilingual prose; plus the existing modern records the census assigns to sections. Then the browser home, the nineteen section pages, the year, country, language, upcoming and new pages, the award page, the strips, the API exports, and the **landing-page card and Explore menu entry**. The home says plainly that the browser is growing and shows live counts. | Validate, cite-check, tests, build, `check:static`, `check:weight`, accessibility and browser checks (390 px and desktop, light and dark, RTL and LTR, JavaScript off); PR merged; `progress.md` tells the founder exactly what to deploy and whether a Worker or workflow file is among the files. **First production push is the founder's deploy of this phase.** | records `non-impacting`; new routes and i18n keys need their own approval (granted with this plan if the founder approves section 12) |
| 3 · Incremental waves | After the pilot is live: per section, batches of ≤ 25 entities per PR (a record, its source records, its three prose files and its media records count), Arabic first with English and Urdu in the same commit, rich first pass, in the section order the founder sets; discovery (the queue per section, section 5) runs alongside and never blocks a batch | Validate, `npm run cite-check -- <ids>` 0 fail, tests, coverage regenerated, progress and excluded-items table updated, PR merged; the founder deploys at his own cadence | `non-impacting` inside the lane |
| 4 · Discovery to depth | Queue per section to at least the wave-1 target (≈13,000 leads in total) from the generators, browser first; source families registered (`scripts/harvest/sources.yaml`, `data/source/`, `docs/attribution.md`); exclusions recorded | Every lead has section, kind, lead source, state; at least five independent sources opened per section | `non-impacting` |
| 5 · Refresh and enrichment | Yearly honours and editions pass per award and series; link-health job for `url`, `watch`, `links`; `horizon` sweep (happened, postponed, cancelled); press pass per year; reach figures re-read with new dates (old figures kept) | A refresh report per quarter in `progress.md` | `non-impacting` |
| 6 · Scale | Waves continue to 50,000 and beyond; reach indices published once a section has ≥ 1,000 scored records; exports per country and language | Stop only when two discovery passes with five new sources add nothing eligible | `non-impacting` |

Phase 2 is one agent's work, a few days, and ends with the first deploy. Phases 3 and 4 run per section in parallel and from the first day after the pilot merges; nothing in the browser waits for a section to be "complete". Phase 5 begins with the first full year after the pilot.

## 7 · Lanes and parallel work

- One lane, `modern-islam`, with nineteen **sub-lanes**, one per section: `modern-web`, `modern-music`, … `modern-learning`. An agent takes one sub-lane at a time; two agents never share one.
- Branch pattern `modern/<section>-<agent>`; stubs `data/_stubs.d/modern-<section>.yaml`; progress `docs/modern-islam/progress/<section>.md` (created with the first batch); queue `docs/modern-islam/queue/<section>.yaml`.
- Overlaps are resolved by **ownership of the class and reuse of the record**: the Screen index owns `screen` and its pipeline, so the `film` and `tv` sub-lanes add 1976+ titles through that pipeline and enrich existing ones; the Made wing owns `listing` basis rules; the `modern-figures` lane keeps its model for media figures, and `modern-figures` persons are enriched, never duplicated; the Khutab and Durus lane owns recorded lectures, and the `conferences` sub-lane links to its `lecture` works rather than re-recording them; the Fatwa Explorer's website index is reused in `web`.
- Before every batch: fetch `origin/main`, search `data/` for the subject (label in every script, `external_ids.wikidata`, aliases), enrich the existing record when found, and record the duplicate check in the progress file.
- The usual limits: ≤ 25 entities per PR, explicit paths, trailers, three-way merge, never deploy.

## 8 · Editorial rules specific to this browser

1. **Describe, attribute, label, no verdict.** Protests, incidents, bans, polemics, controversies and contested figures are described with at least two cited voices where views differ, and the museum takes no side. Never "enemy of Islam" or its equivalent in the museum's voice; describe the act and attribute the judgement.
2. **Faith only with basis.** The `modern-figures` lane's six rulings of 1 November 2026 are the law here too: two independent sources naming the school, structured data never settles it, bare branch settles nothing, headship never counts, doubt stays `unknown`. A Muslim-majority country, an Islamic subject or a nasheed career is not a faith attestation.
3. **"By Muslims" with basis.** `made.by_muslims` is `true` only with `basis: self-identified` (the maker's own public statement, linked) or `documented` (a reliable source). `unverified` is recorded and not shown as "by Muslims".
4. **Default to include Muslims.** A Muslim maker or subject is included by default; an explicitly sourced non-Sunni affiliation is labelled (tradition on the record, label before the view in prose), not excluded, as `docs/scope.md` requires. Sunni positions come first wherever views are stated.
5. **Dated platform figures are not facts.** Followers, views, listeners, visits and circulation go in `reach` with platform and date; prose says "the channel showed about 12 million subscribers in November 2026", never "has 12 million followers".
6. **No lyrics, no article text, no embeds.** A song's words are never reproduced beyond a 40-word cited quotation and never as a lyric block; news is cited, summarised in the museum's words and linked; official links only, never an embed.
7. **Living persons.** Public roles and public work only; family detail only where the public work needs it; health, legal and private matters only when they are the documented public story and then attributed; removal requests honoured as plan 11 §4 says.
8. **Rankings are quoted, not endorsed.** "Richest", "most powerful", "most influential" lists appear as sourced rankings with their publisher and year, never as the museum's statement.
9. **Awards are facts, prestige is not.** The record says who gave what to whom and when; it does not say an award is the "highest" unless a source says so and is cited.
10. **Upcoming is sourced.** A `horizon` needs an announcement source; rumours are not recorded.
11. **Sensitive subjects.** Incidents with casualties follow plan 05's sensitive-content rules: no graphic description, no perpetrator media, no naming of private victims beyond public memorials.
12. **Arabic first, three languages always.** Every record and prose file ships in ar, en and ur in the same commit, `source_lang: ar`, with `provenance`.

## 9 · Risks

| Risk | Mitigation |
|---|---|
| The browser becomes a popularity contest | Reach indices with printed formulas; no editorial "best"; the lede says so |
| Mislabelling someone's religion | Rule 2 and the validator; `unknown` is the default; corrections honoured |
| Looks like advertising or an endorsement of outlets, apps or companies | No ads, no ratings, no affiliate links; "listed is not endorsed" banner; plain presentation |
| Copyright: lyrics, articles, images, posters | Lyric lint; press summarised and cited; media only from the whitelist; posters and album covers only where the licence allows, otherwise no image |
| Platform terms: harvesting YouTube or Spotify data | No API harvest; figures read in the browser and dated; nothing stored but the figure, the date and the id |
| Stale data: dead sites, closed channels, past "upcoming" items | Link-health job; `status_business`; the horizon sweep; `checked` dates shown |
| One-country or one-language bias | Per-country and per-language targets on the coverage page; thirty-language category sweep; Urdu, Indonesian, Turkish, Hausa, Swahili, Bengali and Persian sources from the first wave |
| Contested events (protests, incidents, bans) attract one-sided writing | Two voices required where views differ; `perspectives` with Sunni first then academic then others; tension cards for hard questions; the one-sided-conflict lint |
| Scale: 50,000 records strain the build | Static pages of 100; section JSON exports; measured budgets; the Inventions and Jobs browsers' patterns |
| Overlap with existing lanes creates duplicates | Ownership map (section 7); search before create; duplicates become aliases |
| Agents infer faith, dates or awards from popular lists | The queue keeps the lead and the disposition apart; nothing enters without a defined source; exclusions reported with overrides |

## 10 · Acceptance tests

- The validator accepts the new class, kinds, fields and predicates, and rejects: an `honours` entry with no award, no year or no source; a `reach` figure with no date; a `horizon` with no source; a `faith` value with one source; a `made.by_muslims: true` with `basis: unverified`; a lyric block; a hand-written `awarded` relation; a `sports` entry with an unknown sport.
- `scripts/modern/sections.ts` assigns every existing modern record to a section deterministically; a fixture per section passes.
- The reach index is reproducible: the same inputs give the same score, and the page prints the formula version.
- Browser pages render with JavaScript off; filters, the ribbon and the map degrade to lists; RTL and LTR, light and dark, 390 px and desktop pass the site checks.
- Every record in the first wave has a dated fact in the window or a `horizon`, at least one defined source, trilingual label, summary and prose, and `provenance`; a spot check of 25 random records per section against their sources is recorded in the progress file.
- `npm run validate`, `npm test`, `npm run build`, `check:static`, `check:weight` pass; `docs/coverage.md` regenerated in each entity commit; `CANARY.md` carries an entry for each merged change.

## 11 · Files this proposal touches, and risk labels

| File | Intent | Label |
|---|---|---|
| `docs/plan/26-modern-islam-browser.md` (new), `docs/plan/00-README.md` (one row) | This proposal | `non-impacting` |
| `docs/modern-islam/{README,seeds,prompt,progress}.md`, `taxonomy.yaml` (new) | Companion documents | `non-impacting` |
| `docs/agents/lanes/modern-islam.md` (new), `docs/agents/lanes.md` (one row), `docs/status.md` (one row) | The lane, planning-only | `non-impacting` |
| `CANARY.md` | One entry | `non-impacting` |
| Phase 1: `schema/award.schema.json` (new), `schema/_base.schema.json` (`footprint`, `honours`, `reach`, `horizon`), `schema/{person,work,group,listing,event,screen,building}.schema.json`, `schema/enums/{kinds,roles}.yaml`, `schema/enums/modern-*.yaml` (new, generated from the taxonomy), `schema/predicates.yaml`, `scripts/validate.ts`, `scripts/gen-schema.ts`, `scripts/modern/*.ts`, tests, `site/src/pages/api/v1/**`, `i18n/{ar,en,ur}.yaml` | The data model and API | **`submission-impacting`**: class list and `/api/v1/` routes are quoted by the submissions; claims register A.5 and evidence map updated in the same commit |
| Phases 2–4: `data/**`, `content/{ar,en,ur}/**`, `data/_stubs.d/modern-*.yaml`, `docs/modern-islam/queue/*.yaml`, `docs/modern-islam/progress/*.md`, `scripts/harvest/sources.yaml`, `docs/attribution.md`, `docs/coverage.md` | Records and prose | `non-impacting` inside the approved lane |
| Phase 2 (browser): `site/src/pages/[lang]/modern/**`, components, `site/src/lib/{modern,nav,browse,entity}.ts`, `Landing.astro`, `llms.txt.ts`, `i18n/*` (`modern:` block), `scripts/check-*.ts` | The browser | new routes and i18n keys: own approval; `non-impacting` to the submissions unless a script, form or network call is added (none planned) |
| `workers/site/src/route.js`, `workers/r2-sync/batch/publish.mjs`, `workers/site/wrangler.production.toml`, `.github/workflows/deploy.yml` | **Not touched** (correction of 6 November 2026, D-000 in `docs/modern-islam/progress.md`): those lists name site output folders, not data classes; a class reaches the API through `/api/v1/<class>/` like every other, as `invention` did | — |
| `docs/outreach/*` | Touched only inside a `submission-impacting` commit, as the gates require | — |

## 12 · Decisions for the founder

1. Approve the window (1 Muharram 1396 / 3 January 1976 to today, plus the horizon) and the nineteen sections of 2.2, or strike or merge sections.
2. Approve the `award` class (3.3) or choose the `work` kind `award` fallback.
3. Approve the kinds and roles of 3.2, the five fields of 3.4 and the predicates of 3.5, as a `submission-impacting` Phase 1 with the outreach files updated in the same commit. (The `data/award/` R2 folder change first listed here turned out to be unnecessary: see the correction in D-000.)
4. Approve the reach-index formula of 4.6 as the way every "top" list is built, or set different weights.
5. Confirm the inclusion rule of 8.4 (Muslims by default, non-Sunni affiliation labelled not excluded) for this browser.
6. Confirm the pilot list of nineteen records in `seeds.md` §0 (one per section, the first production push), the first-wave targets of 2.2 (≈ 13,300) and the order of sections for the wave agents (seeds.md §0 proposes: `figures`, `web`, `music`, `organizations`, `conferences`, `film`, `tv`, `books`, `awards`, `sports`, then the rest).
7. Decide whether the lane row in `docs/agents/lanes.md` becomes the standing approval for Phases 3–4 once the pilot merges.
8. Confirm the browser-first research rule of 5.1 (the Mac browser with its sign-ins, any tool installed on the Mac, APIs last) as the lane's standing method.

## 13 · Order of work after approval

1. Record the approval in `docs/modern-islam/progress.md` (D-000, the founder's words transcribed).
2. Phase 1 by one maintainer agent, from Prompt A in `prompt.md`; merge.
3. Phase 2 by the same or one site agent, from Prompt B: the nineteen pilot records, the browser, the landing card; merge; tell the founder what to deploy. **The founder deploys: the browser is in production.**
4. Phase 3 by one agent per section, from Prompt C, in the order the founder sets; 25 entities per PR; merge continuously; the founder deploys at his cadence.
5. Phase 4 by one agent per section, from Prompt D, alongside Phase 3; queue files to target; merge.
6. Phases 5 and 6 as standing work in the lane.
