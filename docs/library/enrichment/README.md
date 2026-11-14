# Enrichment register

The register of everything in the graph that still needs work: records missing an identifier or a fact, prose that is missing or partial, wanted records not yet created, and the open questions the lanes have logged. Founder instruction, 14 November 2026: "we also need a register of all the pending records, all the records that are missing wikidata id or anything else you or other agents still wants to enrich, and all the proses that are partial or empty. and their status, so that at any time any agent can directly and easily find those and work on them." The counterpart for books, audio, websites and datasets is `docs/library/harvest-register.yaml`.

Nothing here is a second source of truth. The gaps are **derived from `data/` and `content/`** every time the script runs; the committed files are a snapshot of that derivation plus the one hand-kept file, `claims.yaml`.

## Find work

```
npm run enrichment-queue -- --gap wikidata --class person --limit 50      # next 50 open items, highest priority first
npm run enrichment-queue -- --gap prose.missing.en --class event --limit 25
npm run enrichment-queue -- --gap prose --limit 40                         # a gap prefix matches every gap under it
npm run enrichment-queue -- --gap id.viaf --all                            # --all also shows items someone has claimed
npm run enrichment-queue                                                  # regenerate queue/, status.yaml and the counts below
```

Without filters the script rewrites the shards; with `--gap`, `--class` or `--limit` it only prints (add `--write` to also rewrite). The script reads about 45,500 YAML records and 80,000 prose files: about 25 seconds of CPU, but the first measured run took 136 seconds wall-clock on the microSD with other agents reading it; on the internal disk expect well under a minute.

Or open a shard directly, no script needed: `docs/library/enrichment/queue/<gap>.<class>.txt`. One item per line, tab-separated: `score`, `slug`, `label (English | Arabic)`, `facts` (kind, existing Wikidata id, `in=` inbound links, `rel=` outgoing relations, `src=` sources, and gap-specific facts such as `chars=` and `sections=`). Highest score first. A shard over about 1.4 MB is split into `.part1.txt`, `.part2.txt`.

## Gaps

| Gap | Meaning | Classes |
|---|---|---|
| `wikidata` | no `external_ids.wikidata` | person, place, building, group, polity, work, object, event, concept, award, language, period, invention |
| `id.viaf`, `id.openiti` | no VIAF or OpenITI id | person (only persons who authored a work), work (kind book) |
| `id.biblissima` | no Biblissima id | work (kind book) |
| `id.geonames`, `id.pleiades`, `id.idai` | no GeoNames, Pleiades or iDAI.gazetteer id | place |
| `prose.missing.<ar\|en\|ur>` | no `content/<lang>/<class>/<slug>.md` | every prose class except passage, source, media, dataset |
| `prose.partial.<lang>` | file exists but is **partial** (below) | same |
| `review.draft.<lang>` | prose with `status.review: draft`. **Not a gap to fill: a review queue for a human reader.** No agent promotes it | same |
| `sources.none` | the record cites no source | all classes except source, media, passage |
| `sources.weak` | exactly one source and it is a Wikipedia or Wikidata record | same |
| `fact.born`, `fact.died` | person without `born` or `died` | person |
| `fact.coordinates` | place without `coordinates` | place |
| `fact.date` | event without `date` | event |
| `fact.author`, `fact.composed` | work without an author (no `authors`, no `written_by`, no inbound `authored`) or without `composed` or `date` | work |
| `stub` | an id wanted in `data/_stubs.yaml` or `data/_stubs.d/*` that has no record yet: **create this record** | any |
| `ledger.gemini` | a `GEMINI:` line in `docs/delegation/**`: a question outside research must settle. **Blocked (needs Gemini); agents skip them** | ledger |
| `ledger.flagged` | a lane-ledger line that flags an unlinked match, identity mismatch or unmatched item | ledger |
| `ledger.open` | a bullet under a resume, next, open or held heading in the lane ledgers; items under "Not decided" are marked HELD FOR THE FOUNDER and skipped | ledger |

Thresholds and why:

- **Partial prose** is body text (frontmatter, headings and `{cite:}` tokens removed, links reduced to their label) of **fewer than 500 characters**, or **fewer than two `##` sections and fewer than 1,500 characters**. The gold example `event/expedition-of-al-sawiq` and the median entity are far above both; a single short paragraph, a lone summary or a stub that only repeats the data summary falls under them. The numbers are in `scripts/enrichment-queue.ts` (`PARTIAL`) and `status.yaml`; change them there and document the change here.
- **Weak source** is a deliberate narrow test: one source, and it is a Wikipedia or Wikidata record. One source is enough to publish (`docs/agents/publication-standard.md`), so this is a strengthening queue, not a defect list.
- **Identifiers not queued:** `archnet` and `unesco` (a building either has an entry or the site has none, and the graph cannot tell which; the harvest finds them), and the Qur'an `passage` class. `nomisma` and `lccn` are not registered identifier keys in `schema/external-id-patterns.yaml` yet; they join the table when the schema registers them.
- **Persons without `died`** include the living and recently deceased; check the era before adding a date.

## Priority score

`score = 3 * inbound + min(outgoing relations, 20) + min(sources, 5) + 2 if an Arabic prose file exists`, where `inbound` counts relations from other records (and work `authors`) that point at the record. Records the rest of the graph already leans on come first, then the better-connected and better-sourced. Wanted stubs score `3 * inbound` alone. Scores are relative within a shard.

## Claim, work, finish

1. Pick items from a shard or from the script. Skip `blocked` ones (they are listed in `claims.yaml`).
2. **Claim in your first commit**: append one entry to `claims.yaml`.
3. Do the work through the normal gates (`docs/agents/workflow.md`).
4. When the PR merges, set your entry's `state: done` and `prs: [number]` (a one-line commit, or in the same PR before merge when you know the number).

```yaml
- id: c-20261114-claude-wikidata-person-01   # unique
  gap: wikidata                              # a gap name or a prefix (prose, prose.missing, id)
  class: person                              # or "*" for every class
  slugs: [al-hakim-bi-amr-illah, mehmed-v-uthmani]   # a list, or:  range: "aa..al"  (slugs, inclusive, alphabetical); omit both to claim the whole shard
  agent: lane-or-agent-name
  state: claimed                             # open | claimed | in_progress | done | blocked | wontfix
  date: 2026-11-14
  prs: [6940]
  reason: ""                                 # required for blocked ("needs founder", "needs Gemini", "needs a source not on the drive") and wontfix
```

Every gap item is **open** unless a live claim covers it. `claimed`, `in_progress`, `blocked` and `wontfix` hide the item from the default query; `done` does not hide it, because the gap itself disappears from the next run once the fix is merged (an item that is done and still listed was not actually fixed). `npm run check:enrichment-register` (under 5 seconds, part of `npm run validate`) fails on duplicate ids, unknown states, malformed ranges, a `blocked` or `wontfix` entry without a reason, and **two live claims on the same items**. Never edit or delete another agent's entry; append.

Held for the founder (agents skip them): the items in `docs/delegation/lane-ledgers/README.md` under "Not decided", recorded in `claims.yaml` as `blocked` with reason "needs founder". Questions that need outside research are logged in lane progress files as `GEMINI:` lines; they are `blocked, needs Gemini` until the orchestrator hands back a verified answer, which you still verify against a primary source.

## Counts (snapshot; regenerate with `npm run enrichment-queue`)

<!-- COUNTS:START -->
| Gap | Total open | Claimed or closed | By class (open) |
|---|---|---|---|
| `fact.author` | 1512 | 0 | work 1512 |
| `fact.born` | 5966 | 0 | person 5966 |
| `fact.composed` | 2206 | 0 | work 2206 |
| `fact.coordinates` | 76 | 0 | place 76 |
| `fact.date` | 345 | 0 | event 345 |
| `fact.died` | 2557 | 0 | person 2557 |
| `id.biblissima` | 1683 | 0 | work 1683 |
| `id.geonames` | 3247 | 0 | place 3247 |
| `id.idai` | 3760 | 0 | place 3760 |
| `id.openiti` | 2080 | 0 | work 1683, person 397 |
| `id.pleiades` | 3843 | 0 | place 3843 |
| `id.viaf` | 1938 | 0 | work 1683, person 255 |
| `ledger.flagged` | 92 | 0 | ledger 92 |
| `ledger.gemini` | 0 | 186 |  |
| `ledger.open` | 36 | 13 | ledger 36 |
| `prose.missing.ar` | 13760 | 0 | building 5384, person 2442, event 2417, place 1903, work 1236, concept 151, group 114, polity 109, object 4 |
| `prose.missing.en` | 13966 | 0 | building 5384, event 2474, person 2460, place 1918, work 1236, concept 265, group 114, polity 109, object 4, journey 1, practice 1 |
| `prose.missing.ur` | 13980 | 0 | building 5386, event 2474, person 2460, place 1918, work 1236, concept 276, group 114, polity 109, object 5, journey 1, practice 1 |
| `prose.partial.ar` | 10799 | 0 | person 4789, event 1537, place 1277, concept 840, object 501, screen 310, exhibit 307, course 290, work 261, question 193, group 189, building 133, listing 87, polity 34, journey 16, language 13, practice 12, award 9, period 1 |
| `prose.partial.en` | 8479 | 0 | person 3657, place 1110, event 1071, concept 548, object 488, exhibit 305, course 286, screen 275, work 212, question 176, group 125, building 84, listing 83, polity 18, language 13, journey 11, award 10, practice 7 |
| `prose.partial.ur` | 9682 | 0 | person 4085, event 1194, place 1157, concept 927, object 491, exhibit 307, screen 294, course 293, work 270, question 178, group 158, listing 134, building 112, award 26, polity 20, language 13, journey 12, practice 10, period 1 |
| `review.draft.ar` | 200 | 0 | person 178, concept 17, event 5 |
| `review.draft.en` | 213 | 0 | person 178, concept 34, work 1 |
| `review.draft.ur` | 212 | 0 | person 178, concept 33, work 1 |
| `sources.none` | 22 | 0 | place 17, event 5 |
| `sources.weak` | 70 | 0 | person 52, event 6, award 5, work 5, building 1, listing 1 |
| `stub` | 1871 | 0 | person 1465, concept 92, group 89, place 86, work 80, practice 22, language 20, source 7, listing 4, event 3, building 2, object 1 |
| `wikidata` | 15417 | 0 | person 5600, concept 3084, event 2852, place 1537, work 1109, object 479, group 331, building 253, invention 100, polity 52, period 13, award 7 |
<!-- COUNTS:END -->

`status.yaml` holds the same counts by class with the date and the run time.
