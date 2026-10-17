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
2. **Fetch the static JSON API** from the live site, one file per record or one file per class. No key, no rate limit beyond the CDN's, CORS-neutral static files:
   | URL | Contents |
   |---|---|
   | `https://islam.museum/api/v1/meta/index.json` | API version, generation date, list of classes, licences |
   | `https://islam.museum/api/v1/meta/coverage.json` | Counts by class, wing, period, region, review status |
   | `https://islam.museum/api/v1/<class>/index.json` | Compact rows for every record of a class (id, labels, summaries, dates, coordinates, Wikidata id, review status) |
   | `https://islam.museum/api/v1/<class>/<slug>.json` | Full record: all data fields, resolved labels, outgoing `connections`, computed `related` list, licences |
   | `https://islam.museum/api/v1/graph/nodes.ndjson` | Every node, one compact JSON object per line |
   | `https://islam.museum/api/v1/graph/edges.ndjson` | Every forward edge, one JSON object per line (`from`, `to`, `type`, time span, sources) |
   | `https://islam.museum/api/v1/graph/<class>/<slug>.json` | Two-hop neighbourhood of a record (at most 40 nodes) for network views |
   | `https://islam.museum/api/v1/themes/index.json` | The 130-odd themes with the ids of their entries |
   | `https://islam.museum/llms.txt` | Plain-text index of every entry with its URL, for language models and crawlers |
   | `https://islam.museum/sitemap-index.xml` | Sitemap of every page in every language |
3. **Build the API yourself** from a clone, which also gives you the derived files the site uses:
   ```bash
   npm install && npm run validate && npm run graph && npm run derive && npm run api
   # output: site/public/api/v1/
   ```

The data model, including the JSON Schemas in `schema/*.schema.json`, is itself CC0, so the same formats can be reused for another collection.

## 3. The record: `data/<class>/<slug>.yaml`

Twenty-one classes: `person`, `group`, `polity`, `event`, `period`, `journey`, `place`, `building`, `object`, `media`, `work`, `passage`, `concept`, `language`, `practice`, `exhibit`, `question`, `source`, `dataset`, `listing`, `screen`. Each has a JSON Schema in `schema/<class>.schema.json`; the fields every class shares are in `schema/_base.schema.json` and are described here. Class-specific fields (for example `born`, `died`, `gender` on a person; `date`, `participants`, `sides` on an event; `coordinates` on a place) are documented in the schema file and in a filled template under `templates/<class>.yaml`.

| Field | Type | Meaning |
|---|---|---|
| `id` | `class/slug` | Immutable identifier. Slugs are ASCII transliterations; the visible name is `label`. |
| `class` | enum | One of the 21 classes above. |
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
