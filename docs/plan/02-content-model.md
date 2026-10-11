# 02 · Content model — the Graph

The museum is a **knowledge graph stored as plain text in git**. This document defines the entity classes, the relationship vocabulary, how time, space, language, uncertainty and disagreement are represented, and what a file looks like. It is designed so that a new kind of content (3D scans, oral histories, recipes, datasets, lesson plans) is one new class file away, never a rewrite.

## 1. Design decisions

| Decision | Choice | Why |
|---|---|---|
| Storage | Plain text files in git: YAML for structured data, Markdown for prose | Free, durable, diffable, reviewable via pull requests, forkable, no database to run or pay for. Git history is provenance. |
| Separation of data and prose | One language-neutral `data/<class>/<id>.yaml` per entity; one `content/<lang>/<class>/<id>.md` per language | Facts are written once; prose is translated. A translator never touches dates or IDs. Enables partial translations gracefully. |
| Identity | Stable slug IDs `class/slug` (e.g. `person/ibn-sina`) with `aliases` for renames | URLs never break. IDs are human-readable in links. |
| Validation | JSON Schema per class + a predicate registry + referential integrity check at build | A broken link or a malformed date fails CI, never reaches visitors. |
| Dates | **EDTF** (ISO 8601‑2 Extended Date/Time Format) for Gregorian/Julian + explicit Hijri string + calendar flag | Historical dates are uncertain; EDTF expresses `~`, `?`, ranges, decades, unknown parts. Hijri is stored, not derived, because sources give Hijri. |
| Space | WGS84 coordinates; GeoJSON for extents; historical names with time ranges | Standard, map-ready, Pleiades/Wikidata-compatible. |
| Alignment | External IDs: Wikidata QID first, then VIAF, Pleiades, GeoNames, Archnet, OpenITI, museum accession numbers | Interoperability; we can round-trip with Wikidata and link to collections. |
| Relationships | Typed, directional, optionally time-scoped and sourced; inverses computed at build | One place to write a fact; both pages show it. |
| Perspectives | Structured `perspectives` block keyed by tradition | Plurality is in the schema, not fought out in prose. |
| Claim status | Every dated fact and key statement can carry `status` | Readers see what is scripture, tradition, consensus, debate or legend. |
| Depth | Every entity has `summary` (1 sentence), `abstract` (1 paragraph), full body, optional `kids` and `scholarly` sections | One node, many depths; the UI has a depth dial. |

## 2. Entity classes

Twenty classes, grouped by what they are. Each has a JSON Schema in `schema/<class>.schema.json` and a Markdown template in `templates/<class>.md`.

### Actors
| Class | What | Key fields beyond the common base |
|---|---|---|
| `person` | A human individual | `names` (given, kunya, nasab, nisba, laqab, regnal, pen), `gender`, `born`, `died`, `floruit`, `roles[]`, `traditions[]`, `disciplines[]`, `languages[]` |
| `group` | A collective: `kind ∈ {tribe, clan, family, people, denomination, madhhab, order, movement, organization, institution, guild, army}` | `kind`, `founded`, `dissolved`, `founder`, `headquarters`, `members_estimate`, `active_regions[]` |
| `polity` | A state, caliphate, dynasty, emirate, sultanate, empire, modern nation | `kind`, `start`, `end`, `capitals[] (time-scoped)`, `extent[] (GeoJSON by date)`, `predecessor`, `successor`, `official_languages[]`, `religious_policy` |

### Happenings
| Class | What | Key fields |
|---|---|---|
| `event` | A dated happening: battle, treaty, revelation, migration, founding, death, conquest, discovery, publication, conference | `kind`, `date` (point or range), `places[]`, `participants[] (role)`, `outcome`, `part_of`, `casualties`, `significance` |
| `period` | A curatorial era: Pre-Islamic Arabia, Prophetic era, Rashidun, Umayyad, Abbasid, Fragmentation, Gunpowder empires, Colonial, Modern; regional periods (al-Andalus, Delhi Sultanate) | `start`, `end`, `regions[]`, `parent_period`, `defining_events[]` |
| `journey` | An ordered route: a person's travel, a pilgrimage route, a trade route, the spread of an idea, a migration | `kind ∈ {travel, pilgrimage_route, trade_route, diffusion, migration, military_campaign}`, `travelers[]`, `legs[] {from, to, start, end, mode, events[], note}`, `distance_km`, `geometry` |

### Where
| Class | What | Key fields |
|---|---|---|
| `place` | A location: city, town, region, province, oasis, river, mountain, sea | `kind`, `coordinates`, `geometry`, `historical_names[] (lang, name, from, to)`, `modern_country`, `part_of`, `founded` |
| `building` | A built structure or site: mosque, madrasa, palace, fort, tomb, garden, bimaristan, observatory, bazaar, khan, hammam, bridge, minaret | `kind`, `style`, `built`, `patron`, `architect`, `location (place + coordinates)`, `status ∈ {standing, ruined, destroyed, rebuilt, converted}`, `unesco_id`, `archnet_id`, `materials[]`, `dimensions` |

### Things
| Class | What | Key fields |
|---|---|---|
| `object` | A physical artifact: manuscript, folio, astrolabe, ceramic, textile, carpet, coin, sword, relic, tile, lamp, globe | `kind`, `made` (date), `made_in`, `maker`, `materials[]`, `dimensions`, `inscriptions[]`, `holding_institution`, `accession_number`, `iiif_manifest`, `provenance[]`, `sensitivity` |
| `media` | A digital asset the museum shows: image, audio, video, 3D model, map tile set | `kind`, `url` or `iiif_image`, `thumbnail`, `license`, `attribution`, `creator`, `depicts[]`, `alt` (multilingual, required), `sensitivity` |

### Thought and word
| Class | What | Key fields |
|---|---|---|
| `work` | An intellectual or creative work: book, treatise, poem, diwan, map, musical composition, film, website | `kind`, `genre[]`, `disciplines[]`, `authors[]`, `language`, `composed`, `structure` (chapters/surahs), `editions[]`, `translations[]`, `openiti_uri`, `commentaries[]`, `manuscripts[]` |
| `passage` | An addressable unit inside a `work`: Qur'an ayah or surah, hadith number, poem line, chapter | `work`, `ref` (canonical locator e.g. `2:255`, `bukhari:1`), `text` (original), `translations{lang: {text, translator, license}}`, `audio[]`, `context` |
| `concept` | An idea, term, doctrine, legal notion, discipline, virtue, science, art form, architectural element | `term` (Arabic + transliteration + other langs), `kind ∈ {belief, doctrine, legal, ethical, discipline, art_form, architectural_element, scientific, political, social, term}`, `definitions[] (by tradition)`, `parent_concept`, `etymology` |
| `language` | A language or script associated with Muslim peoples | `kind ∈ {language, script, dialect}`, `scripts[]`, `speakers_estimate`, `regions[]`, `literary_tradition_from`, `iso639`, `sample_media[]` |

### Lived
| Class | What | Key fields |
|---|---|---|
| `practice` | A ritual, custom, festival, art practice, foodway, dress, music, everyday habit | `kind ∈ {ritual, pillar, festival, rite_of_passage, custom, food, dress, music, art, craft, sport, etiquette}`, `when` (calendar rule), `who`, `where_variations[] (region, description)`, `obligation ∈ {obligatory, recommended, cultural}`, `scriptural_basis[] (passages)` |

### Curatorial
| Class | What | Key fields |
|---|---|---|
| `exhibit` | A curated narrative: `kind ∈ {exhibition, story, tour, lesson, trail}` | `audience[]`, `duration_minutes`, `rooms[] {title, body, features[] (entity refs), media[]}`, `curator`, `opened`, `prerequisites[]` |
| `question` | A plain-language question and answer for newcomers | `question` (multilingual), `short_answer`, `long_answer`, `related[]`, `audience`, `sensitivity` |
| `source` | A bibliographic source: primary text, edition, article, book, website, archive, museum record | CSL-JSON fields (`type`, `title`, `author`, `issued`, `publisher`, `URL`, `DOI`, `ISBN`), `kind ∈ {primary, secondary, tertiary, reference_data}`, `language`, `reliability_note`, `open_access` |
| `dataset` | A table of structured facts: Muslim population by country by year, Hajj attendance, mosque counts, manuscript counts, rulers lists | `columns[]`, `rows_file` (CSV), `source`, `license`, `coverage` (time/space), `method_note` |

Twenty classes. Adding `oral_history`, `recipe`, `lesson_plan`, `model3d`, `game` later = new schema + template + page layout; the graph, build and UI patterns already handle it.

## 3. Common base (every entity)

```yaml
id: person/ibn-sina            # class/slug; immutable
class: person
aliases: [person/avicenna]     # old IDs that redirect here
label:                         # short display name, multilingual
  en: Ibn Sina (Avicenna)
  ar: ابن سينا
  fa: ابن سینا
summary:                       # one sentence, multilingual
  en: Persian polymath (c. 980–1037) whose Canon of Medicine shaped medicine in the Islamic world and Europe for six centuries.
  ar: ...
wings: [people, ideas]         # which museum wings surface this node
tags: [medicine, philosophy, golden-age]
periods: [period/abbasid-fragmentation]
regions: [region/persia-central-asia]   # controlled list, see schema/enums
external_ids:
  wikidata: Q8011
  viaf: "31996761"
  openiti: 0428IbnSina
relations: []                  # see §4
sources: []                    # list of source IDs used in this file (prose cites inline)
media:
  hero: media/ibn-sina-portrait-1950s-stamp
  gallery: []
status:                        # editorial state
  review: reviewed             # draft | reviewed | verified
  completeness: 3              # 0–5
  last_reviewed: 2026-10-01
  reviewers: [ahmed]
sensitivity: none              # none | figurative-prophet | violence | contested | sacred
```

## 4. Relationships (edges)

Edges live in the **subject's** YAML under `relations:`. Each edge:

```yaml
relations:
  - type: student_of
    target: person/abu-abdallah-al-natili
    start: { edtf: "099X" }
    sources: [source/gohlman-1974]
    note: Taught him logic and Euclid in Bukhara.
    confidence: high            # high | medium | low
  - type: authored
    target: work/al-qanun-fi-al-tibb
    start: { edtf: "1012~", hijri: "0403~" }
    end:   { edtf: "1024~" }
  - type: died_in
    target: place/hamadan
  - type: patron_of           # inverse: patronized_by — written on the patron's file instead
```

The **predicate registry** (`schema/predicates.yaml`) defines each type once:

```yaml
student_of:
  inverse: teacher_of
  domain: [person]
  range: [person]
  label: { en: "Studied under", ar: "تلقى العلم عن" }
  inverse_label: { en: "Taught", ar: "تتلمذ عليه" }
  temporal: true
authored:
  inverse: authored_by
  domain: [person, group]
  range: [work]
located_in:
  inverse: contains
  domain: [place, building, event]
  range: [place]
```

Core predicates (v0.1): `born_in`, `died_in`, `buried_in`, `lived_in`, `traveled_to`, `student_of`/`teacher_of`, `child_of`/`parent_of`, `spouse_of`, `sibling_of`, `member_of`/`has_member`, `founder_of`/`founded_by`, `ruler_of`/`ruled_by`, `successor_of`/`predecessor_of`, `patron_of`/`patronized_by`, `authored`/`authored_by`, `commentary_on`/`has_commentary`, `translation_of`/`translated_as`, `built`/`built_by`, `commissioned`/`commissioned_by`, `located_in`/`contains`, `capital_of`/`had_capital`, `occurred_at`/`site_of`, `participated_in`/`had_participant`, `part_of`/`has_part`, `caused`/`caused_by`, `influenced`/`influenced_by`, `opposed`/`opposed_by`, `depicts`/`depicted_in`, `held_by`/`holds`, `made`/`made_by`, `made_in`/`origin_of`, `mentions`/`mentioned_in`, `exemplifies`/`exemplified_by`, `practiced_in`/`has_practice`, `wrote_in`/`language_of`, `spoke`, `revealed_about`, `basis_for`/`based_on`, `same_as` (external), `related_to` (typed fallback, discouraged).

Rules:
- Write the edge once, on whichever side is more natural; the build creates the inverse.
- Time-scoped edges (`ruler_of` 750–754) make the snapshot-year view possible.
- Any edge may carry `sources`, `note`, `confidence`, and `perspectives` (e.g. the first caliph succession has different `successor_of` edges in Sunni and Shia perspectives; both are stored with `perspective: sunni` / `perspective: shia-twelver`).
- Edges to a target that does not exist fail the build **unless** the target is declared in `data/_stubs.yaml` (a wanted-list that renders as a gentle "not yet in the museum" placeholder and feeds the coverage map).

## 5. Time

```yaml
born:
  edtf: "0980~"          # EDTF: ~ approximate, ? uncertain, X unknown digit, / interval, [a,b] one of
  hijri: "0370~"         # YYYY[-MM[-DD]] AH, same uncertainty markers
  calendar: julian       # julian | gregorian (proleptic); default julian before 1582-10-15
  precision: year        # day | month | year | decade | century
  note: "Traditional date; al-Juzjani's biography implies 980, some give 973."
  sources: [source/gutas-2014]
  status: historical     # scriptural | tradition | historical | debated | legend
```

- The build normalises EDTF to a sortable numeric range (`earliest`, `latest`) for timelines.
- Hijri ↔ Gregorian conversion is **tabular** (Umm al-Qura for modern dates, astronomical/arithmetical for historical) and only used to fill a missing side, always marked `derived: true`. Sources disagree on days; we store what the source says.
- Pre-Islamic and deep time: `edtf: "-0570"` works; for "6th century" use `"05XX"`.
- Relative dates in sources ("the year of the Elephant", "three years after the Hijra") go in `note`; the `event` for the anchor is linked.

## 6. Space

```yaml
coordinates: [24.4686, 39.6142]        # [lat, lon], WGS84
geometry: geo/place/medina.geojson      # optional, for areas/routes; file in repo or external URL
historical_names:
  - { name: Yathrib, lang: ar-Latn, until: { edtf: "0622" } }
  - { name: المدينة المنورة, lang: ar }
modern_country: polity/saudi-arabia
part_of: place/hejaz
external_ids: { wikidata: Q35484, geonames: "109223", pleiades: "..." }
```

- `polity.extent[]` holds dated GeoJSON snapshots (e.g. 661, 750, 900) for the map's time slider. Start coarse (hand-drawn simplified polygons), refine later.
- `journey.legs[]` compile to a LineString with per-leg dates for animated routes.
- Regions controlled list (`schema/enums/regions.yaml`): Arabia · Levant & Iraq · Egypt & Nile · Maghreb · al-Andalus & Europe · Anatolia, Caucasus & Balkans · Persia & Central Asia · South Asia · Southeast Asia · China & East Asia · West Africa & Sahel · East Africa & Swahili coast · Americas & Oceania · Global/Diaspora.

## 7. Languages and prose

```
data/person/ibn-sina.yaml          ← facts, once
content/en/person/ibn-sina.md      ← English prose
content/ar/person/ibn-sina.md      ← Arabic prose
content/fr/person/ibn-sina.md      ← may not exist yet → page falls back to English body with the Arabic/English label, and shows "Help translate"
```

Prose file:

```markdown
---
id: person/ibn-sina
lang: en
source_lang: en              # or translation_of: en@<content-hash> for staleness detection
translators: []
---

## Brief
<!-- 2–3 sentences, used by the Brief depth setting and by cards -->

## Life
Ibn Sina was born near [[place/bukhara]] around 980 CE ... He studied logic under [[person/abu-abdallah-al-natili]] {cite:gohlman-1974 p.20}...

## Work
...

## Legacy
...

:::perspectives
- **Academic**: ...
- **Shia (Twelver)**: ...
:::

## For young visitors
<!-- optional, plain language -->

## Notes for scholars
<!-- optional -->
```

- `[[class/slug]]` wiki-links resolve to the localized label and URL; `[[class/slug|custom text]]` overrides. Unresolved links fail the build (or render as stubs if in the wanted-list).
- `{cite:source-id p.20}` renders a footnote and registers the source on the page.
- Markdown directives (`:::perspectives`, `:::quote`, `:::timeline`, `:::map`, `:::gallery`, `:::compare`) embed interactive islands.
- Section headings are conventional per class (templates), so the depth dial knows what to show.

## 8. Perspectives and claim status

```yaml
perspectives:
  - tradition: sunni
    summary: { en: "...", ar: "..." }
    sources: [source/...]
  - tradition: shia-twelver
    summary: ...
  - tradition: academic
    summary: ...
```

Tradition enum (`schema/enums/traditions.yaml`): `sunni`, `sunni-hanafi`, `sunni-maliki`, `sunni-shafii`, `sunni-hanbali`, `shia-twelver`, `shia-ismaili`, `shia-zaydi`, `ibadi`, `sufi`, `ahmadiyya`, `quranist`, `academic`, `other` — extendable. UI shows perspectives as parallel columns with equal weight.

Claim status enum: `scriptural` (stated in the Qur'an), `tradition` (reported in hadith/sira/tabaqat), `historical` (consensus of historians), `debated` (live scholarly disagreement), `legend` (popular, not supported). Shown as subtle badges, explained once in a "How to read this museum" page.

## 9. Sensitivity and media policy flags

`sensitivity` on entities and media: `none`, `figurative-prophet` (figurative depictions of prophets: never shown by default, text-described), `violence`, `human-remains`, `sacred` (e.g. relics: handle reverently), `contested` (political), `mature`. The UI respects visitor settings.

## 10. Example files

### `data/event/hijra.yaml`
```yaml
id: event/hijra
class: event
kind: migration
label: { en: The Hijra, ar: الهجرة النبوية }
summary:
  en: The migration of the Prophet Muhammad and his followers from Mecca to Medina in 622 CE, the event from which the Islamic calendar is counted.
  ar: هجرة النبي محمد ﷺ وأصحابه من مكة إلى المدينة سنة 622م، وهي الحدث الذي يبدأ منه التقويم الهجري.
wings: [time, place, people]
periods: [period/prophetic-era]
regions: [arabia]
date:
  start: { edtf: "0622-09", hijri: "0001-02", calendar: julian, precision: month }
  end:   { edtf: "0622-09-24", hijri: "0001-03-12", calendar: julian, precision: day, status: tradition,
           note: "Traditional date of arrival at Quba; the calendar epoch (1 Muharram 1 AH = 16 July 622) was fixed later under Umar." }
relations:
  - { type: occurred_at, target: place/mecca, note: departure }
  - { type: occurred_at, target: place/medina, note: arrival }
  - { type: had_participant, target: person/muhammad, role: protagonist }
  - { type: had_participant, target: person/abu-bakr, role: companion }
  - { type: had_participant, target: person/ali-ibn-abi-talib, role: stayed-behind-then-followed, sources: [source/ibn-ishaq-guillaume] }
  - { type: part_of, target: period/prophetic-era }
  - { type: caused_by, target: event/pledges-of-aqaba }
  - { type: basis_for, target: concept/hijri-calendar }
  - { type: mentioned_in, target: passage/quran-9-40 }
  - { type: has_part, target: journey/hijra-route }
external_ids: { wikidata: Q180226 }   # TODO verify QID
sources: [source/ibn-ishaq-guillaume, source/watt-1956-medina]
status: { review: draft, completeness: 2 }
```

### `data/person/ibn-sina.yaml`
```yaml
id: person/ibn-sina
class: person
aliases: [person/avicenna]
label: { en: Ibn Sina (Avicenna), ar: ابن سينا, fa: ابن سینا }
names:
  - { kind: full, lang: ar, value: أبو علي الحسين بن عبد الله بن الحسن بن علي بن سينا }
  - { kind: kunya, lang: ar-Latn, value: Abu Ali }
  - { kind: laqab, lang: ar-Latn, value: al-Shaykh al-Ra'is }
  - { kind: latinized, lang: la, value: Avicenna }
gender: male
born: { edtf: "0980~", hijri: "0370~", calendar: julian, precision: year }
died: { edtf: "1037-06", hijri: "0428-09", calendar: julian, precision: month }
roles: [physician, philosopher, astronomer, vizier, poet]
disciplines: [concept/medicine, concept/falsafa, concept/logic]
traditions: [sunni-hanafi]         # upbringing contested (Ismaili father); see perspectives
languages: [language/arabic, language/persian]
summary:
  en: Persian polymath (c. 980–1037) whose Canon of Medicine and Book of Healing shaped medicine and philosophy across the Islamic world and Europe for centuries.
wings: [people, ideas]
periods: [period/abbasid-fragmentation]
regions: [persia-central-asia]
relations:
  - { type: born_in, target: place/afshana }
  - { type: died_in, target: place/hamadan }
  - { type: buried_in, target: building/avicenna-mausoleum-hamadan }
  - { type: lived_in, target: place/bukhara, end: { edtf: "1002~" } }
  - { type: lived_in, target: place/isfahan, start: { edtf: "1024~" } }
  - { type: student_of, target: person/abu-abdallah-al-natili, sources: [source/gohlman-1974] }
  - { type: authored, target: work/al-qanun-fi-al-tibb }
  - { type: authored, target: work/kitab-al-shifa }
  - { type: patronized_by, target: person/ala-al-dawla-muhammad, start: { edtf: "1024~" } }
  - { type: influenced_by, target: person/al-farabi }
  - { type: influenced_by, target: person/aristotle }
  - { type: influenced, target: person/al-ghazali, note: "Through critique in Tahafut al-Falasifa." }
  - { type: influenced, target: person/ibn-rushd }
  - { type: influenced, target: person/thomas-aquinas }
perspectives:
  - tradition: academic
    summary: { en: "His father served the Samanids and is reported to have been Ismaili; Ibn Sina's own confessional identity is debated and his philosophy was attacked by al-Ghazali and defended by later thinkers." }
    sources: [source/gutas-2014]
external_ids: { wikidata: Q8011, viaf: "31996761", openiti: "0428IbnSina" }
sources: [source/gohlman-1974, source/gutas-2014]
media: { hero: media/ibn-sina-canon-folio-1632 }
status: { review: draft, completeness: 3 }
```

### `data/source/gutas-2014.yaml`
```yaml
id: source/gutas-2014
class: source
kind: secondary
type: book
title: "Avicenna and the Aristotelian Tradition"
author: [{ family: Gutas, given: Dimitri }]
issued: { "date-parts": [[2014]] }
edition: 2
publisher: Brill
ISBN: "9789004255808"
language: en
reliability_note: Standard academic reference on Ibn Sina's life and works.
open_access: false
```

## 11. Build-time derived artifacts

From these files the build produces, for every entity: an HTML page per language, `api/v1/<class>/<slug>.json` (full), an entry in `api/v1/<class>/index.json` (compact: id, labels, summary, dates, coords), JSON-LD in the page head (schema.org `Person`/`Place`/`Event`/`CreativeWork`/`VisualArtwork`, with `sameAs` to Wikidata), inverse edges, timeline rows, map features, search index chunks, sitemap entries, redirects for aliases, and coverage statistics (entities per wing/period/region/language, review status).

## 12. Future-proofing checklist

- New class → add schema, template, page layout, enum entries, predicate domain/range. No migration.
- New language → add `i18n/<lang>.yaml` and start translating prose; labels can be added to data files incrementally.
- New relationship → one entry in `predicates.yaml`.
- New external system → one key under `external_ids` and a URL pattern in `schema/external-id-patterns.yaml`.
- Export to CIDOC-CRM / Linked Art later → a mapping file, since classes and predicates already map cleanly (person→E21, event→E5, object→E22, place→E53, work→F1).
