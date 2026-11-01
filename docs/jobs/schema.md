# Job Browser: schema design

Part of the Job Browser plan. Master plan: [`README.md`](README.md). Nothing here is implemented until the founder approves Phase 1; the shapes below are the proposal the validator will enforce. Every shape reuses the base definitions in `scripts/gen-schema.ts` (`ref("date")`, `ref("localized")`, `entityRef`, `strs`) so the existing date, language and reference rules apply unchanged.

## 1. The `job` class

Files: `data/job/<slug>.yaml`, `content/{ar,en,ur}/job/<slug>.md`. Id `job/<slug>`, immutable; renames through `aliases`. Registered in `CLASSES` (`scripts/lib.ts`, `scripts/gen-schema.ts`, `site/src/pages/api/v1/meta/index.json.ts`), in `schema/enums/kinds.yaml` under `job:`, and in `BROWSE_CLASSES` (`site/src/lib/browse.ts`).

```yaml
id: job/qadi
class: job
label: { ar: "القاضي", en: "Qadi (judge)", ur: "قاضی" }
names:                                   # base name def: absorbed synonyms and historic spellings
  - { value: "الحاكم الشرعي", kind: variant }
  - { value: "kadı", kind: transliteration, lang: tr }
summary: { ar: "…", en: "…", ur: "…" }
domain: governance-law                   # schema/enums/job-domains.yaml (new)
kind: office                             # kinds.yaml job: [office, craft, scholarly, religious, commercial, military,
                                         #   medical, artistic, service, administrative, modern-profession]
broader: job/ruler                       # optional; display hierarchy only, counts never double
era:
  origins: early-caliphate               # pre-islamic | prophetic | early-caliphate | classical | medieval | early-modern | modern
  first_attested: { edtf: "0640~", hijri: "0020~", precision: decade, status: historical, note: "…", sources: [source/…] }
  status_today: transformed              # living | transformed | replaced | extinct
  successor_jobs: [job/…]                # written once here; predecessors are computed
places:                                  # where it flourished, dated where the source dates it
  - { place: place/baghdad, start: { edtf: "08XX" }, end: { edtf: "12XX" }, note: "…", sources: [source/…] }
regions: [levant-iraq, egypt-nile]       # base regions enum
organization:
  organized: court-office                # guild | neqaba | court-office | association | informal | mixed | none-known
  bodies: [group/…]                      # guilds, unions, orders, councils that exist as groups
training:
  mode: ijaza-chain                      # formal-schooling | apprenticeship | ijaza-chain | state-licence |
                                         #   mouth-to-mouth | hereditary-family | mixed
  certification: "…"                     # short prose or "none"
  duration: "…"                          # optional, prose
tools: [object/…]                        # the things of the job that exist as objects
workplaces: [building/…, place/…]        # where the work happened, existing entities only
outputs: [work/…, object/…]              # exemplary surviving output
media: { image: media/… }                # the base media block; alt text lives on the media entity in three languages
wings: [people]
periods: [period/…]                      # the periods the article covers
themes: [...]
relations: []                            # ordinary predicates where they fit (regulates, codified_in …)
sources: [source/…]                      # required
provenance: { layer: own-research, source: "…", generated_by: "…", model: "…", run: "jobs-p1-b01" }
status: { review: published, completeness: 3 }
```

The prose article's required sections (Arabic headings first, the English and Urdu files mirror them) follow the brief's seventeen questions: الموجز · الأصول · الأسماء الكبار · التطور · السياسة والاقتصاد · الجغرافيا · العمر والمآل · مكان العمل · الأدوات · الإنتاج · الأعلام عبر العصور · التنظيم · التكوين والإجازة · الأسرار والأعراف · المحافل · الأسفار · المراجع. A section the sources cannot fill says so in one sentence rather than being omitted, so a reader sees the gap.

## 2. The person `occupations:` block

Added to `classProps.person` in `scripts/gen-schema.ts`.

```yaml
occupations:
  - job: job/qadi                          # required; resolves to a job entity or a stub
    kind: primary                          # primary | secondary | episodic | honorary (prominence only, never "the one job")
    start: { edtf: "1180", hijri: "0576", precision: year, status: historical, sources: [source/…] }   # optional
    end:   { edtf: "1186", hijri: "0582", precision: year, status: historical, sources: [source/…] }   # optional
    place: place/damascus                  # optional, existing entity
    polity: polity/ayyubid-sultanate       # optional, existing entity
    under: person/salah-al-din             # optional: served under whom (office jobs)
    trained_under: [person/…]              # optional: educators for THIS job, where attested
    certification: "ijaza in fiqh from …"  # optional, only when attested
    family_business: true                  # optional, only when attested
    status: historical                     # historical | tradition | debated (claim-status enum values)
    note: "…"                              # the caveat, both readings when debated
    sources: [source/…]                    # REQUIRED, non-empty, every id known
```

Semantics the validator and the display honour:

- Several entries may overlap in time (a qadi who taught and led prayer at once); the career strip draws overlapping bars.
- The same job twice (qadi of two cities, vizier in two stints) is two entries.
- `kind` records prominence and nothing more. A record with one bootstrap entry has `primary`; a record with several has `secondary` on each until the sweep reads the sources.
- Nothing is inferred from family, descent, a relative's office or a modern analogy. Doubt is `status: debated` with both readings in `note`, or the entry is not written. Transmitted-but-unverifiable material is `status: tradition`.
- Dates follow `docs/site/README.md` (EDTF plus Hijri, calendar, precision, derived flag); a bootstrap entry has no dates.

## 3. The `jobs:` block on things

Added to object, building, work, group, event, place and journey.

```yaml
jobs:
  - job: job/astronomer
    relation: used-by          # made-by | used-by | built-by | staffed-by | reference-for | body-of | gathering-of |
                               #   produced-by | workplace-of | route-of
    status: historical
    note: "…"
    sources: [source/…]        # REQUIRED
```

Reading by class: an object is `made-by` (astrolabe: instrument maker) and `used-by` (astronomer); a building is `built-by` (architect, calligrapher of its inscriptions) and `staffed-by` (a named imam, muezzin, physician attested in its sources); a work is `reference-for` (a hisba manual: muhtasib) or `produced-by` (a craft treatise: the craft); a group is `body-of` (a guild, order, union, syndicate); an event is `gathering-of` (a convocation, competition, appointment); a place or journey is `workplace-of` or `route-of`.

**Kind-level links are display only.** A mosque is staffed by an imam, a muezzin and a khatib by its kind; the site shows that as "jobs of this kind of building" from a small kinds-to-jobs map in `site/src/lib/`, labelled as such, and no `jobs:` entry is written on 2,359 mosque records for it. A `jobs:` entry is written only where the record's sources attest the connection.

## 4. Derived edges

`scripts/build-graph.ts` emits, from the two blocks, edges that are never hand-written:

| Predicate | Inverse | Domain | Range | From |
|---|---|---|---|---|
| `practised` | `practised_by` | person | job | each `occupations[]` entry (one edge per distinct job; stints are kept in the block) |
| `tied_to` | `things_of` | object, building, work, group, event, place, journey | job | each `jobs[]` entry, with `relation` carried as the edge `role` |

Both are registered in `schema/predicates.yaml` with `derived: true` so the graph page labels them and the validator rejects them when written by hand in `relations:`. The connections graph (`scripts/export-api.ts`, all non-inverse edges) and the API neighbourhoods then carry jobs with no further code.

## 5. Validator rules (`scripts/validate.ts`)

Errors:

1. `occupations[i].job` and `jobs[i].job` resolve to a `job` entity or a declared stub.
2. `occupations[i].sources` and `jobs[i].sources` are non-empty and every id is a known source.
3. `place`, `polity`, `under`, `trained_under[]` resolve and are of the named class (the `REF_KEYS` walk already checks resolution; the class check is new).
4. `kind`, `status`, `relation`, `domain`, `era.origins`, `era.status_today`, `organization.organized`, `training.mode` are enumerated.
5. `broader`, `era.successor_jobs[]` resolve to jobs; `organization.bodies[]` to groups; `tools[]` to objects; `workplaces[]` to buildings or places; `outputs[]` to works or objects.
6. **Agreement check**: when a person has `occupations:`, every value left in `roles:` must be a descriptor (the `descriptors` list in `taxonomy.yaml`, which becomes the whole of `schema/enums/roles.yaml`). A job value in `roles:` beside an `occupations:` block is "maintained by hand twice" and fails.
7. `practised`, `practised_by`, `tied_to`, `things_of` in a hand-written `relations:` fail.

Warnings:

8. A person with job-mapped `roles:` and no `occupations:` (not yet swept): a count in the summary, not a per-file line, so the validator output stays readable through Phase 3.
9. A job entity with no `practised_by` edge (no holder yet) and no `jobs:` tie.
10. An occupation with `start` or `end` but no `place` where the job is an office (qadi, wali, vizier, imam): the place is usually in the same sentence of the source.

## 6. `roles:` after the sweep

`schema/enums/roles.yaml` is split in the Phase 1 commit: it keeps the descriptors (prophet, companion, successor, family-of-the-prophet, martyr, …) and loses the job values, which now live in the taxonomy. The i18n `roles:` block keeps the descriptor labels; job chips are rendered from the job entity's `label`, so the 19 enum values that never had a label stop needing one. Until a record is swept, the page shows its `roles:` line as today (`EntityLayout.astro` line 178). After the sweep the page shows descriptor chips plus the derived job chips; nothing is maintained twice.

## 7. Enums and files touched by Phase 1

| File | Change |
|---|---|
| `scripts/lib.ts`, `scripts/gen-schema.ts`, `site/src/pages/api/v1/meta/index.json.ts` | `job` in `CLASSES` |
| `scripts/gen-schema.ts` | `classProps.job`; `occupations` on person; `jobs` on seven classes; `npm run schema` regenerates `schema/*.schema.json` |
| `schema/enums/kinds.yaml` | `job:` kinds (append) |
| `schema/enums/job-domains.yaml` | new, from `taxonomy.yaml` domains |
| `schema/enums/roles.yaml` | split (descriptors stay) |
| `schema/predicates.yaml` | `practised`, `tied_to` with `derived: true` (append) |
| `scripts/validate.ts` | rules of section 5 |
| `scripts/build-graph.ts` | derived edges; `entitySpan` for job stays undefined (a job has no lifespan bar of its own) |
| `scripts/export-api.ts` | `jobs.json` dump with holder ids per job |
| `scripts/report/jobs-census.ts` | the Phase 0 census as a repeatable report, regenerating `docs/jobs/taxonomy.md` |
| `scripts/pipeline.test.ts` or a new `scripts/jobs.test.ts` | fixtures for the agreement check, the derived edges and the bootstrap mapping |

Every one of these is a `submission-impacting` change by the letter of `docs/ai-change-gates.md` section 3 (a class list and the API routes), so Phase 1's first commit carries the founder's sign-off under that label and updates `docs/outreach/unesco-nomination-dossier.md` A.5 and `docs/outreach/dpga-evidence-map.md` in the same commit.
