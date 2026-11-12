# Open data: how to reuse the museum's graph

islam.museum is a knowledge graph kept in git and published as static files. Everything a visitor sees is derived from plain text in this repository, so the whole collection can be copied, read, queried and reused without any account, key or server. This page is the reuse guide for people and programs; the editorial model behind it is in [`docs/plan/02-content-model.md`](../plan/02-content-model.md).

## 1. Licences

| What | Where | Licence |
|---|---|---|
| Structured facts (entities, relations, dates, coordinates, identifiers) | `data/`, `geo/`, `datasets/`, `schema/` | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain dedication) |
| Prose (articles, summaries, questions, exhibit text), all languages | `content/` | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Code (pipeline, site, workflows) | `scripts/`, `site/`, `.github/` | MIT, see [`LICENSE`](../../LICENSE) |
| Third-party media and quotations | recorded per item in `data/media/*.yaml` | Their own licence, from the whitelist in `schema/enums/licenses.yaml` |

The static JSON API repeats the licence of each record in a `license` field. Attribution for prose: "islam.museum contributors, <page URL>, CC BY-SA 4.0". Full text in [`LICENSE-CONTENT.md`](../../LICENSE-CONTENT.md).

## 2. Three ways to get the data

1. **Clone the repository** (the complete graph, with its history):
   ```bash
   git clone https://github.com/amado2k5/islam-museum.git
   ```
   Source of truth: `data/<class>/<slug>.yaml` (facts) and `content/<lang>/<class>/<slug>.md` (prose). YAML is a superset of JSON; any YAML library reads it.
2. **Fetch the static JSON API**, one file per record or one file per class, served from the museum's own storage at `api.islam.museum` (since 21 October 2026; the older `islam.museum/api/v1/...` addresses answer with a permanent redirect to the same files). No key, no rate limit beyond the CDN's, CORS-neutral static files:
   | URL | Contents |
   |---|---|
   | `https://api.islam.museum/api/v1/meta/index.json` | API version, generation date, list of classes, licences |
   | `https://api.islam.museum/api/v1/meta/coverage.json` | Counts by class, wing, period, region, review status |
   | `https://api.islam.museum/api/v1/<class>/index.json` | Compact rows for every record of a class (id, labels, summaries, dates, coordinates, Wikidata id, review status) |
   | `https://api.islam.museum/api/v1/<class>/<slug>.json` | Full record: all data fields, resolved labels, outgoing `connections`, computed `related` list, licences |
   | `https://api.islam.museum/api/v1/graph/nodes.ndjson` | Every node, one compact JSON object per line |
   | `https://api.islam.museum/api/v1/graph/edges.ndjson` | Every forward edge, one JSON object per line (`from`, `to`, `type`, time span, sources) |
   | `https://api.islam.museum/api/v1/graph/<class>/<slug>.json` | Two-hop neighbourhood of a record (at most 40 nodes) for network views |
   | `https://api.islam.museum/api/v1/themes/index.json` | The 130-odd themes with the ids of their entries |
   | `https://api.islam.museum/api/v1/companions.json` | Companions Browser: every Companion record with gender, roles, birth and death, the Ten flag, circle and clan `groups`, `events`, `death_ah` / `death_decade` (with `death_ah_derived` when converted from the Gregorian date), connections and prose languages |
   | `https://api.islam.museum/api/v1/inventions.json` | Inventions with domain and era filters, makers, attribution, origins, chains and media |
   | `https://api.islam.museum/api/v1/inventions/chains.json` | Invention dependency graph, including internal and external precursor/dependent links |
   | `https://api.islam.museum/api/v1/invention/index.json` | Compact index of invention records (empty until invention records are added) |
   | `https://api.islam.museum/api/v1/award/index.json` | Compact index of award records: prizes, medals, certifications, rankings, titles and competition prizes (empty until award records are added) |
   | `https://api.islam.museum/api/v1/modern/index.json` | The Modern Islam Browser (docs/plan/26): the window (1976 to the build year), the nineteen sections with their counts, the years with counts, the reach lists |
   | `https://api.islam.museum/api/v1/modern/<section>.json` | Every record of one derived section (`web`, `music`, `film`, `tv`, `conferences`, `heritage`, `rights`, `books`, `upcoming`, `figures`, `organizations`, `media`, `sports`, `awards`, `achievements`, `enterprise`, `arts`, `built`, `learning`) with its year, kind, countries, honours and footprint counts and horizon |
   | `https://api.islam.museum/api/v1/modern/year/<yyyy>.json` | Every record with a dated fact in one Gregorian year from 1976 on |
   | `https://api.islam.museum/api/v1/modern/top/<list>.json` | A reach index (`songs`, `albums`, `websites`, `channels`, `books`): scores computed from cited inputs with the printed formula and weights; not a ranking by taste |
   | `https://api.islam.museum/api/v1/jobs.json` | Job Browser: every job with domain, kind, craft flag, era, its edges and its holders (persons whose `occupations:` name it) |
   | `https://api.islam.museum/api/v1/qudsi.json` | Hadith Qudsi Browser: every hadith qudsi narration of the six books and the Muwatta (passages tagged `hadith-qudsi`) with work, ref, matn excerpt of at most 40 words, its `qudsi-<slug>` hadith tag, themes and edges |
   | `https://api.islam.museum/api/v1/fatwa.json` | Fatwa Explorer: every fatwa and fatwa collection with publisher, URL, languages, dates and its edges (mufti, basis, chain) |
   | `https://api.islam.museum/api/v1/tafsir.json` | Tafsir Browser: the commentary (Jami' al-Bayan) and each of its volumes as `tafsir-volume` works, with `part_of` and `about` edges to the verses each volume covers |
   | `https://api.islam.museum/api/v1/khutab.json` | Khutab and Durus Explorer: every sermon, lesson and lecture series with speaker, occasion, host, audience, series order and edges |
   | `https://api.islam.museum/api/v1/poetry.json` | Poetry: every poem and diwan with its poets, language, genre, metre and edges |
   | `https://api.islam.museum/api/v1/screens.json` | Screening Room: every film, series and programme with format, relevance, titles, release, countries, languages, approach, depiction, database ids and edges |
   | `https://api.islam.museum/api/v1/ghayb.json` | Ghayb Browser (متصفح ما وراء الطبيعة): every unseen-topic record tagged `ghayb-browser` — jinn, angels, the soul, divine time measures, the Ascent, the greatest creations, the barzakh, the signs of the Hour — with kind, wings, themes, section tags and edges |
   | `https://api.islam.museum/api/v1/nature.json` | Nature Explorer (مستكشف الطبيعة): every natural-world record tagged `nature-browser` — land animals, birds, insects, sea creatures, plants and trees, and the phenomena of creation — with kind, wings, themes, section tags and edges |
   | `https://api.islam.museum/api/v1/angels.json` | Angels Browser (متصفح الملائكة): every angel-related record tagged `angels-browser` — named angels, orders and hosts, recording angels and angel-human encounters — with kind, wings, themes, section tags and edges |
   | `https://api.islam.museum/api/v1/dreams.json` | Dream Browser (متصفح الأحلام): every dream the museum's sources mention — Qur'an verses, hadith reports, seerah books and every harvested work — detected at build time plus the curated `dream-browser` concept records, each with its corpus `section` (quran, sunnah, seerah, books, concepts), work, ref, text excerpt and edges |
   | `https://api.islam.museum/api/v1/duas.json` | Du'a Browser (متصفح الأدعية): every supplication the museum's sources mention or write — Qur'an verses, hadith reports, seerah books and every harvested work — detected at build time by `scripts/dua.ts` plus the curated `dua-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `dua_kind` (`formula`/`mention`), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/places.json` | Sacred Places Browser (متصفح الأماكن المقدسة والهامة وذات القيمة في الإسلام): every place and building of sanctity, importance and value in Islam — `places-browser`-tagged records plus every record a passage mentions — each with its sanctity `section` (sanctuaries, hajj, seerah, quran, sacred, mentioned), per-corpus `mentions` counts (quran, sunnah, seerah, books), kind, coordinates, regions, tags and edges |
   | `https://api.islam.museum/api/v1/islamic-economy.json` | Islamic Economy Browser (متصفح العملات والصكوك والوقف الإسلامي): every mention of money and Islamic economics, deeds/instruments/covenants, and endowments — currencies, usury, debt, trade contracts, weights and measures, fiscal dues, waqf and sadaqa jariya — in the Qur'an, Sunnah, seerah and every harvested work, detected at build time by `scripts/islamic-economy.ts` plus the curated `islamic-economy-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `topics` chips (money, sukuk, waqf), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/sayyiat.json` | Sayyi'at Browser (متصفح السيئات): every mention of the sayyi'at and the sins theme in the Qur'an, Sunnah, seerah and harvested books — the «سيّئ» family, the names of sin, guilt and disobedience, major and minor sins, transgression, immorality and wrongdoing — detected at build time by `scripts/sayyiat.ts` plus the curated `sayyiat-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `sayyiat_kind` (`sayyi`/`related`), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/hudud.json` | Hudud Allah and Kaba'ir Browser (متصفح حدود الله والكبائر): every mention of the limits of God, the fixed penalties (stoning, flogging, the amputated hand, discretionary punishment and their crimes) and the major sins in the Qur'an, Sunnah, seerah and harvested books — detected at build time by `scripts/hudud.ts` plus the curated `hudud-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `hudud_kind` (`hudud`/`kabair`), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/hasanats.json` | Hasanat Browser (متصفح الحسنات): every mention of the good deeds (al-hasanat) the museum's sources carry — Qur'an verses, hadith reports, seerah books and every harvested work — detected at build time by `scripts/hasanat.ts` plus the curated `hasanat-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `hasanat_kind` (`hasanat`/`hasana`/`husna`), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/hisab.json` | Hasanat and Sayyi'at Ledger, Calculator and Counter (قائمة وآلة حاسبة وعدّاد الحسنات والسيئات): every passage that counts, writes, multiplies, erases, weighs or reckons a deed — detected at build time by `scripts/hisab.ts` — plus the curated `hisab-browser` records; each item has `section` (quran, sunnah, seerah, books, curated), `hisab_kinds` (hasanat, sayyiat, erasure, scale), `signals`, and for the calculator rows a `reckoning` block (`effect`, `hasanat`, `hasanat_max`, `sayyiat`, `erased`, `degrees`, `times`, `unbounded`, localized `unit` and `result`, `basis` passage ids) |
   | `https://api.islam.museum/api/v1/mukatabat.json` | Mukatabat Browser (متصفح المكاتبات): every mention of correspondence the museum's sources carry — the Prophet's letters to kings and emperors, the letters, replies and reports received, the caliphs' letters and chancery reports, and Sulayman's letter to the Queen of Sheba — detected at build time by `scripts/mukatabat.ts` plus the curated `mukatabat-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `mukatabat_kind` (`letter`/`mention`), `sender` (prophetic/caliphal/royal/other), the matched `signals`, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/magic.json` | Magic and Magicians Browser (متصفح السحر والسحرة): every mention of magic and the magicians in the Qur'an, Sunnah, seerah and harvested books — sorcery, soothsaying and augury, ruqyah, the evil eye and envy — detected at build time by a guarded lexicon plus the curated `magic-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, concepts), `topics` chips, work, ref, text excerpt, kind, themes and edges |
   | `https://api.islam.museum/api/v1/bayt.json` | Household of the Prophet Browser (متصفح بيت النبوة وآل النبي): everything mentioned about the Prophet's household and family — Ahl al-Bayt, the 'itrah, Banu Hashim and Banu Abd al-Muttalib, the wives, daughters, children and descendants, the imams line — detected at build time by `scripts/bayt.ts` plus the curated `bayt-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, ahl, mawaqif, concepts), work, ref, text excerpt, kind, themes and edges |
   | `https://api.islam.museum/api/v1/jinn-devils.json` | Jinn & Devils Browser (متصفح الشياطين والجن): every record tagged `jinn-devils-browser` — jinn, devils and demons, angels, and the dreams that carry them — plus `angels-browser` angel records, with kind, wings, themes, section tags and edges |
   | `https://api.islam.museum/api/v1/messengers.json` | Messengers and Prophets Browser (متصفح الرسل والأنبياء): every mention of the messengers and prophets in the Qur'an, Sunnah, seerah and harvested books — named prophets, the class terms and unnamed prophets — detected at build time by `scripts/messengers.ts` and joined to the canonical `mentions` edges, plus the curated `messengers-browser` records and the `subjects` index, each with its corpus `section` (quran, sunnah, seerah, books, curated), `subjects`/`topics` chips, work, ref, text excerpt and edges |
   | `https://api.islam.museum/api/v1/miracles.json` | Divine and Prophetic Miracles Browser (متصفح المعجزات الإلهية ومعجزات الرسل): every mention of the divine miracles and the prophets' miracles in the Qur'an, Sunnah, seerah and harvested books — the miracle of the Qur'an, the Prophet's signs, the staff, the sea, the she-camel, the ark, the fire, the clay bird, the cradle speech, the heavenly table, Sulayman's signs, the dreams, the annunciation, the covenant chest, the cosmic signs and the destruction of the nations — detected at build time by `scripts/miracles.ts` and joined to the canonical `mentions` edges, plus the curated `miracles-browser` records and the `subjects` index, each with its corpus `section` (quran, sunnah, seerah, books, curated), `kind` (event, sign, mention), `subjects`/`topics` chips, work, ref, text excerpt and edges |
   | `https://api.islam.museum/api/v1/madhahib.json` | Four Madhhabs Browser (متصفح المذاهب الأربعة): every record tagged `madhahib-browser` with `mh-<section>` tags — the four imams and schools, other schools, the salaf forebears, the canonical books and the fiqh/usul concepts — plus every work, passage, event, exhibit or question whose `mentions` edge names a madhhab group or the madhhab concept, each with its computed `sections` (aima, hanafi, maliki, shafii, hanbali, ukhra, salaf, kutub, mafahim, dhikr), kind, traditions, themes and edges |
   | `https://api.islam.museum/api/v1/nubuwat.json` | Prophecies and Miracles Browser (متصفح النبؤات وأسرار القرآن ومعجزاته): every prophecy of the Prophet, proof of prophethood, secret and marvel of the Qur'an, miracle of the Prophet, report of unseen knowledge and eschatological prediction in the Qur'an, Sunnah, seerah and harvested books — detected at build time by `scripts/nubuwat.ts` plus the curated `nubuwat-browser` records, each with its corpus `section` (quran, sunnah, seerah, books, curated), `topics` chips, work, ref, text excerpt, kind, themes, tags and edges |
   | `https://api.islam.museum/api/v1/eschatology.json` | Signs of the Hour Browser (متصفح علامات الساعة): every mention of the signs of the Hour and all eschatology in the Qur'an, Sunnah, seerah and harvested books — the major and minor signs, the barzakh, resurrection, reckoning, the Scale, the Sirat, the Hawd, paradise and hell — detected passages plus `eschatology-browser` records, each with its corpus `section`, `topics` chips, work, ref, text excerpt, kind, themes and edges |
   | `https://api.islam.museum/api/v1/asma.json` | Asma ul Husna Browser: the 99 divine-name concepts in enumeration order with transliteration, root, enumeration, trilingual labels and edges |
   | `https://api.islam.museum/api/v1/battles.json` | Battles, Wars and Conquests Browser: every military-kind event with date, periods, sides, outcome, casualties, map, edges and the derived `ghazwa` flag |
   | `https://api.islam.museum/api/v1/khulafa.json` | Khulafa Browser: every caliph person record with roles and story_roles reigns |
   | `https://api.islam.museum/api/v1/khulafa/chains.json` | Khulafa Browser: the ordered succession chain of each caliphate, computed from story_roles reigns |
   | `https://api.islam.museum/api/v1/time-browser/index.json` | Time Browser: the subject index (id, kind, titles, node count, journey flag, span) |
   | `https://islam.museum/llms.txt` | Plain-text index of every entry with its URL, for language models and crawlers |
   | `https://islam.museum/sitemap-index.xml` | Sitemap of every page in every language |
3. **Build the API yourself** from a clone, which also gives you the derived files the site uses:
   ```bash
   npm install && npm run validate && npm run graph && npm run derive && npm run api
   # output: site/public/api/v1/
   ```

The data model, including the JSON Schemas in `schema/*.schema.json`, is itself CC0, so the same formats can be reused for another collection.

## 3. The record: `data/<class>/<slug>.yaml`

Twenty-four classes: `person`, `group`, `polity`, `event`, `period`, `journey`, `place`, `building`, `object`, `media`, `work`, `passage`, `concept`, `language`, `practice`, `exhibit`, `question`, `source`, `dataset`, `listing`, `screen`, `job`, `invention`, `award`. Each has a JSON Schema in `schema/<class>.schema.json`; the fields every class shares are in `schema/_base.schema.json` and are described here. Class-specific fields are documented in each schema; the invention record shape is also illustrated in `docs/inventions/schema.md`.

| Field | Type | Meaning |
|---|---|---|
| `id` | `class/slug` | Immutable identifier. Slugs are ASCII transliterations; the visible name is `label`. |
| `class` | enum | One of the 24 classes above. |
| `aliases` | list of ids | Former ids that now redirect here (renames and merged duplicates). |
| `label` | map lang → string | Short display name. `ar` is required; `en` and other BCP-47 codes optional. |
| `summary` | map lang → string | One sentence. `ar` required. |
| `wings` | list of enum | Museum wings surfacing the record (`time`, `place`, `people`, `ideas`, `objects`, `words`, `living`, `today`, `made`). |
| `themes` | list of enum | Controlled themes from `schema/enums/themes.yaml`. |
| `tags` | list of strings | Free keywords. |
| `periods` | list of `period/...` ids | Named periods the record belongs to. |
| `regions` | list of enum | Controlled regions from `schema/enums/regions.yaml`. |
| `external_ids` | map | Identifiers in other systems: `wikidata` (Q-id), `viaf`, `geonames`, `pleiades`, `openiti`, `isbn`, and others listed in `schema/external-id-patterns.yaml`. Wikipedia and Wikidata are pointers for reconciliation, not sources. |
| `relations` | list of edges | Outgoing edges, written once; inverses are computed at build (see §4). |
| `sources` | list of `source/...` ids | Works the facts come from; prose cites inline as `{cite:<source-id> p.N}`. Every dated fact needs two sources or a flag. |
| `perspectives` | list | Labelled, cited positions on a contested point, Sunni position first, then the academic view, then others; no verdict (`docs/plan/02-content-model.md` §8). |
| `media` | `{hero, gallery[]}` | Media ids; each media record carries its own licence, alt text and sensitivity flag. |
| `status` | `{review, completeness, last_reviewed, reviewers}` | `review` is `draft`, `reviewed` or `verified`; `completeness` 0 to 5. AI-assisted drafts are always `draft`. |
| `provenance` | map | Who or what produced the record: `generated_by`, `model`, `run`, `source`, `layer`. |
| `sensitivity` | enum | `none`, `figurative-prophet`, `violence`, `human-remains`, `sacred`, `contested`, `mature`, `polemical` (`schema/enums/sensitivity.yaml`). |
| `issue` | string | An open editorial question about the record. |

### Dates

A date is an object (`schema/_base.schema.json`, `$defs.date`) so that nothing is lost in conversion: an [EDTF](https://www.loc.gov/standards/datetime/) string (`edtf`), the Hijri date as written in the sources (`hijri`), the calendar the source used (`calendar`: `julian` or `gregorian`), the `precision` (`day`, `month`, `year`, `decade`, `century`), a claim `status` (`scriptural`, `tradition`, `historical`, `debated`, `legend`), and the `sources` of the date itself. Conversions are marked `derived: true`. Details and the Hijri anchor tests: `docs/site/dates-timeline-maps.md` and `scripts/hijri/`.

### Collection context

Records are harvested from classical Arabic sources first (sira, hadith collections, tabaqat, chronicles, geographers) and from modern reference works, by human contributors and by AI-assisted pipelines working under `docs/agents/`. Every record names its sources; the provenance block says who or what wrote it. All records are currently in `draft` review status: nothing is marked `reviewed` until a person has checked it against its sources, and `docs/coverage.md` (regenerated on every content commit) reports the counts by review status. Read the data as a cited draft reference, not as a verified corpus.

## 4. Relations: `schema/predicates.yaml`

An edge is `{ type, target, start?, end?, role?, confidence?, perspective?, sources?, note? }` in the `relations` list of the record it starts from (`target` is the other record's id; `confidence` is `high`, `medium` or `low`; `perspective` labels an edge asserted by one tradition only). `type` must be a predicate from `schema/predicates.yaml`, which fixes each predicate's domain classes, range classes, bilingual labels, inverse name and whether it is time-scoped. The build computes every inverse, so `person/x born_in place/y` also yields `place/y birthplace_of person/x` in the API, flagged `inverse: true`. `edges.ndjson` carries forward edges only. Time-scoped roles (`story_roles`, allies, opponents) carry `start` and `end` so a relationship can be read at a given moment.

## 5. Prose: `content/<lang>/<class>/<slug>.md`

Markdown with YAML front matter: `id`, `lang`, `source_lang` (the language the text was first written in, Arabic by charter) and `translators` (who or what translated it, empty for an original). Sections follow `docs/plan/02-content-model.md` §7 (Brief, Life or Story, Work, Legacy, For young visitors, Notes for scholars). Facts are cited inline as `{cite:<source-id> p.N}`. Links between records are wiki links `[[class/slug|label]]`; Qur'an passages are referenced as `[[passage/quran-<sura>-<aya>|label]]` and the text itself comes only from the frozen Tanzil files in `data/work/quran-source/`. The API includes the prose of each language in the full record.

## 6. Geography and datasets

- `geo/` holds GeoJSON for events, journeys, polity extents and regions, each feature with its sources (`geo/README.md`).
- `datasets/` holds CSV tables extracted from sources (rosters, lists, summaries) and described by a `data/dataset/<slug>.yaml` record.
- Places carry `coordinates` (WGS 84) and GeoNames or Pleiades ids where a unique match exists.

## 7. Validation and conventions you can rely on

- `npm run validate` must report 0 errors before any push: JSON Schema per class, EDTF and Hijri checks, link resolution, licence whitelist, alt text, predicate registry, honorific and Qur'an-text guards.
- Ids never change; renames leave an alias. A merged duplicate becomes an alias of the richer record.
- Encoding UTF-8, line endings LF, Western Arabic digits in data.
- Standards used: JSON Schema (draft 2020-12), EDTF for dates, GeoJSON (RFC 7946) and WGS 84 for geography, BCP-47 language codes, NDJSON for graph dumps, Schema.org JSON-LD on every page, sitemaps, `llms.txt`.

## 8. Citing and giving feedback

Cite a record by its page URL or its id. A monthly graph export with a DOI is planned (`docs/plan/03-architecture.md` §11) but not yet in place. Errors, missing sources and reuse questions: the "Report an error" issue form, GitHub Discussions, or discover@islam.museum.
