# Muslim Inventions Browser: proposed schema

Phase 1 only. The sample is a shape, not a factual record. Reuse base definitions in `scripts/gen-schema.ts`, existing predicates and enums where they fit; do not create an alternate graph.

## 1. The `invention` class

File: `data/invention/<slug>.yaml`; id `invention/<slug>` is immutable and renamed through `aliases`. Prose belongs in `content/{ar,en,ur}/invention/<slug>.md`.

```yaml
id: invention/crankshaft-al-jazari
class: invention
label: { ar: "…", en: "…", ur: "…" }
names: [{ value: "…", kind: alternate, lang: en }]
summary: { ar: "…", en: "…", ur: "…" }
domain: mechanics-automata
kind: device
disciplines: [engineering]
era:
  origins: middle-period
  first_attested: { hijri: "0602", precision: year, status: historical, sources: [source/…] }
  status_today: living
origin:
  place: place/…
  polity: polity/…
  context: { ar: "…", en: "…", ur: "…" }
makers:
  - { person: person/…, role: inventor, start: { edtf: "1206" }, note: "…", sources: [source/…] }
attribution:
  status: original
  claim: { ar: "…", en: "…", ur: "…" }
  basis: { ar: "…", en: "…", ur: "…" }
  perspectives: []
precursors:
  - { invention: invention/…, note: "…", sources: [source/…] }
  - { external: { ar: "…", en: "…" }, note: "…", sources: [source/…] }
dependents:
  - { invention: invention/…, note: "…", sources: [source/…] }
spread:
  - { place: place/…, start: { edtf: "13XX" }, via: journey/…, note: "…", sources: [source/…] }
impact:
  fields: [mechanics-automata]
  changed: { ar: "…", en: "…", ur: "…" }
  history: { ar: "…", en: "…", ur: "…" }
  significance: 4
  why: "A sourced sentence explaining the rating."
described_in: [work/…]
examples: [object/…]
sites: [building/…, place/…]
concepts: [concept/…]
today:
  form: { ar: "…", en: "…", ur: "…" }
  descendants: { ar: "…", en: "…", ur: "…" }
external_ids: { wikidata: Q…, patent: "US…", doi: "…" }
media: { image: media/…, diagram: media/…, map: media/… }
kids: { ar: "…", en: "…", ur: "…" }
wings: [ideas]
periods: [period/…]
themes: [theme/…]
regions: [region]
relations: []
sources: [source/…]
provenance: { layer: own-research, source: "…", generated_by: "github-copilot", model: "…", run: "inventions-p3-b01" }
status: { review: published, completeness: 3 }
```

Every maker is checked against the Sunni inclusion rule in [`taxonomy.yaml`](./taxonomy.yaml); each maker's faith basis must be cited. An unsupported identity remains a lead. If `attribution.status` is `contested` or `legend`, `perspectives` is required and non-empty; for `original`, it is absent or empty. `first_attested` is not automatically the invention date.

The referenced hero-image media record records its image step in provenance (`existing`, `found` or `generated`), along with the source, licence and localized alt text. The invention itself does not duplicate that media provenance.

## 2. Ties on existing classes

Add one sourced `inventions:` block per touched record; preserve every unrelated field and concurrent change.

| Class | Entry shape |
|---|---|
| person | `{ invention, role, start?, end?, place?, note?, sources }` |
| object | `{ invention, relation: example-of \| tool-for \| product-of, sources }` |
| work | `{ invention, relation: describes \| first-describes \| patent-of \| disputes, sources }` |
| building, place | `{ invention, relation: site-of \| spread-to \| made-in, start?, sources }` |
| event | `{ invention, relation: first-use \| demonstration \| publication \| patent-granted, sources }` |
| concept | `{ invention, relation: theory-of \| applied-in, sources }` |

## 3. Predicates and derived edges

Register canonical predicates and inverses in `schema/predicates.yaml`: `invented`/`invented_by`, `improved`/`improved_by`, `described`/`described_by`, `transmitted`/`transmitted_by`, `built_on`/`enabled`, `spread_to`/`received`, and `example_of`/`exemplified_by`. Reuse `relies_on`, `influenced`, `caused`, `mentions`, `depicts`, `made`, `made_in`, `wrote_about` and `part_of` where they fit. Inverses are computed, never written twice.

The graph builder derives `invented`, `improved`, `described` and `transmitted` from `makers:` and existing-class ties; `built_on`/`enabled` from precursors/dependents; `spread_to` from `spread:`; and `example_of` from `examples:` and object ties. Derived predicates are marked `derived: true` and rejected in hand-written `relations:`.

## 4. Validator and API

The Phase 1 validator requires all invention fields and localized labels/summaries; checks every reference resolves to the stated class; enumerates `domain`, `kind`, attribution status, maker role, tie relation, era and present-day status; checks non-empty source lists and defined source IDs; requires perspectives for contested/legend and rejects them for original; validates significance 1–5 and media references; and rejects missing maker faith basis. Probe invalid records in a temporary fixture, verify each rule fails, then remove the fixture.

The proposed static endpoints are `/api/v1/invention/index.json`, `/api/v1/invention/<slug>.json`, `/api/v1/inventions.json`, and `/api/v1/inventions/chains.json`. The list gives domain and era filters; chains include computed precursor/dependent links. API output is generated at build time, not served by a runtime model or database.

Phase 1 touches the class list, generated JSON Schema, `kinds.yaml`, the invention-domain and attribution enums, predicates, validation, graph derivation, export scripts, API meta list and three i18n locales. It is `submission-impacting`: the claim register A.5 and DPGA evidence map are updated in the same commit, as required by the standing sign-off in D-000.
