# Lane `showcase-prose`: the Showcase Tier to completeness 3

_Opened 24 October 2026 on the founder's instruction (unattended enrichment run). Binding with `AGENTS.md`, `docs/ai-change-gates.md` (this lane is the standing approved proposal for content inside its scope), `docs/agents/publication-standard.md` and `docs/agents/source-families.md`. Where the founder's run instruction of 24 October 2026 differs from older repo text, the instruction wins (see the progress file, checklist 0.0)._

## Mission

Raise the **Showcase Tier** to completeness 3 with trilingual prose (ar, en, ur) in the same commit, every fact cited to a defined `data/source/` entity, and provenance recorded. The tier is what visitors meet first: the exhibits and journeys, and every record they feature.

## Scope and queue

- **Tier** = every `data/exhibit/` and `data/journey/` record, plus every record they feature (`rooms[].features`, journey legs and waypoints, travellers, and any other `class/slug` reference inside those records). Generated list: [`../../delegation/showcase-queue.md`](../../delegation/showcase-queue.md) (one-off generation from `data/`, 24 Oct 2026; regenerate the same way when the tier changes).
- **Order**: exhibits and journeys first; then featured records by inbound links (count of data records that reference them), highest first. Within a batch, group by class and by source.
- **Phase order for the day's run**: Phase 1 the Sicily pilot (`exhibit/path-sicily-islam`, 11 records); Phase 2 the Egypt showcase set; Phase 3 the rest of the queue.
- Do not chase the long tail: the link-ranked prose-backfill queue belongs to `prose-backfill-2`. If the tier is exhausted, say so in the report.

## Batch loop

1. Pick at most 25 records from the current phase, grouped by class and by source.
2. **Gather evidence locally first.** Every claim in a batch cites a file in the local harvest workspace (`~/islam-museum-harvest/`, path plus page or anchor). Your own knowledge may find a resource; it never supplies a fact. Fetch with the family's fetcher once and cache; work offline afterwards. Never circumvent a login, paywall or terms page.
3. Build a claims table per record (claim, value, local file and anchor, quotation of 40 words at most).
4. Write `data/<class>/<slug>.yaml` (dates, relations, `sources`, `provenance`, `status`) and `content/{ar,en,ur}/<class>/<slug>.md` at completeness 3. Arabic first; English and Urdu translate it in the same commit. Each fact-stating sentence carries `{cite:<source-id> <anchor>}`. Status: `review: published`, `completeness: 3`, provenance completed (`layer`, `source`, `generated_by`, `model`, `run`).
5. `npm run cite-check -- <ids>`. Fix failures; a record that still fails is skipped and logged, not forced.
6. `npm run coverage` (regenerates `docs/coverage.md`), commit with the attribution trailers, push, and update the progress file (batch id, records done, records skipped with reasons, families registered, decisions, `NEXT STEP:`).

## Exhibit prose standard

- Every room body (`rooms[].body`) is **3 to 5 cited sentences in each of ar, en and ur**: what the visitor is looking at, the story it carries, and the fact that anchors it. One-line bodies are replaced.
- Room bodies must be in the language of their field. An English body that contains Arabic text is a defect and is rewritten, not patched.
- An exhibit or journey is treated as finished only when every record it features is at completeness 3.

## Skip-and-log rule

If the local evidence cannot support a sentence, the sentence is left out. If it cannot support prose for a record at all, the record is skipped and logged in the progress file with the reason (for example "no local page for the claimed date"). A logged skip is a success state. An invented date, quote, page number or citation is the only real failure.

## Families and onboarding order

Register a family before its first use (`source-families.md` section 5.3: registry entry, `data/source/<family-id>.yaml`, attribution row, one commit). Onboarding order, as the run instruction sets it:

1. Archnet (buildings; the unlock for the Egypt set)
2. Thesaurus d'Épigraphie Islamique (inscriptions; foundation dates)
3. UNESCO WHC / ICOMOS (property dossiers)
4. Museum collections (objects; per-collection licence check; BM is facts-only)
5. Tier 2 of `source-families.md` (Arabic Papyrology Database, Princeton Geniza Project, Zeno, and the rest)

The classical sources already in the harvest library (al-Baladhuri, Ibn Jubayr, al-Idrisi, Ibn Khaldun, Ibn al-Athir, Ibn Khallikan, al-Maqrizi where present) need no new registration; they are `data/source/` entities already.

## Overlap warning

The `lib-futuh-buldan`, `lib-wafayat-ayan`, `prose-backfill-2` and sira lanes also write records under `data/event/`, `data/person/` and `data/place/`. Before each batch, `git fetch origin` and read what has arrived. Reuse an existing record; add a source as an extra citation; never duplicate an entity.

## Scope limits

Content and data only: `data/`, `content/`, `docs/`. No change to `site/`, `schema/`, `i18n/`, licence files, `docs/outreach/`, or the validator. No honorifics typed; no Qur'an text typed; no figurative depictions of prophets or Companions; media only from the whitelist.
