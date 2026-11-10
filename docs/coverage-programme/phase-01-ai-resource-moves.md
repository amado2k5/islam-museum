# Phase 01: The AI-resource moves

**Status: open (founder go, 5 November 2026).** Source: the AI-resource audit of 1 November 2026 (`islam-museum-ai-resource-audit-and-plan-2026-11-01.md`), folded into this programme as its first phase by the founder's amendment of the same day. All measurements below were re-derived on `origin/main` of 5 November 2026 (README section 2.11), not copied from the audit.

**Scope in one line:** five data-and-markup moves on records that already exist, so that AI answer engines — and the museum's own graph queries — can extract the Prophet's network, the Companion set, event rosters and hadith narrators as structured facts. No new UI, no new entity classes, no new predicates.

## The five moves

### Move 1 — The Companions as a queryable set (474 edges + 1 record)

- Add `- { type: member_of, target: group/sahaba, sources: [...] }` to every person record carrying `roles: [companion]` — **474 records** (206 published, 268 draft), counted 2026-11-05; **zero** carry the edge today.
- Publish `group/sahaba` (today: draft stub, completeness 1, sourced to al-Isaba): `review: published`, completeness 2, summary without the draft caveat, provenance extended to record this phase's membership roll. The definition follows al-Isaba, already cited on the record.
- Edge sourcing rule: each edge cites the source(s) the member record itself rests on, preferring a Companion-attesting work where the record has one (al-Isti'ab, al-Isaba, Fada'il al-Sahaba, Ibn Sa'd's Tabaqat), else the record's sira source (Ibn Hisham, Ibn Ishaq). The edge restates the record's existing, sourced `companion` role; it asserts nothing new.
- Extend Muhajirun/Ansar membership the same way, from existing Hijra/Aqaba participation edges (today: `group/muhajirun` 6 member edges, `group/ansar` 80; both groups draft). Sized when reached; the pattern is identical.
- Queue: `phase-01-queue.md`. Batches of at most 25 entities (the group record counts as one).

### Move 2 — Muhammad's neighbourhood (~15–25 edges)

Measured baseline: Muhammad's record carries 6 relations; inbound typed relations from person records total 61 edges from 60 records; **no `successor_of` edge to Muhammad exists**; **Ali has no typed relation to Muhammad in either direction**.

- `person/abu-bakr`: add `successor_of → person/muhammad`, sourced from his record's sira sources.
- Ali's kinship, written once each (inverses are computed): `child_of → person/abu-talib` if absent, `spouse_of → person/fatima-bint-muhammad` if absent — making cousin and son-in-law derivable rather than asserted with an invented predicate. There is no cousin predicate and none is proposed.
- Sibling edges among the sons of Abd al-Muttalib (Abu Talib, Abdullah, al-Abbas, Hamza, and the rest as their records allow), so the uncles are derivable from Muhammad's record.
- Commander roles on the expeditions he commissioned, where the event record already names the commander and the person record lacks the edge.
- Every edge is sourced from a source already cited on the record it lands on, or added with its citation in the same batch. This move is one careful batch, not a wave.

### Move 3 — One roster per event (~500–1,500 edges, audit estimate)

- Reconcile person-side vs event-side participation (write-once per the registry) for the ~30 prophetic-era events. Baseline example: `event/battle-of-badr` — 23 event-side person references vs 47 person-side `participated_in` edges; the classical roster is ~313, so reconciliation is not completion.
- Convert the researched `datasets/*.csv` rosters (prophetic battles, Tabuk participants and absentees, Abyssinia emigrants, Hunayn and Taif martyrs, the Prophet's wives) into edges.
- Where the two sides disagree, the event record wins and the person side is corrected. **Every disagreement is reported in the batch's progress entry; none is silently resolved, and no name is invented to fill a roster.**

### Move 4 — Narrator marking (~1,000–3,000 annotations, audit estimate)

- Annotate `role: narrator` on the existing `mentions` edge of hadith passage records for the transmitting Companion, starting with the Muhammad-mentioning passages and the Muwatta/Muslim sets (~3,100 hadith passage files among 10,079 passages).
- No narrator field and no new predicate: the annotation rides the existing edge. This seeds the isnad layer that Phase 4 (rijal graph) builds on; the two phases coordinate here and do not duplicate each other.

### Move 5 — JSON-LD relational extension (one template change)

- **Correction to the audit:** per-entity JSON-LD already exists (`jsonLd()` in `site/src/lib/entity.ts`): schema.org type per class, `sameAs` from `external_ids`, birth/death dates and places, event dates, place geo.
- What remains: draw the relational fields from the graph — `spouse`, `children`, `parent`, `memberOf` — so Moves 1–2 become visible to answer engines on the page itself. Markup only; no layout, no visible change. Verified on a sample of pages in all three languages; Urdu pages get markup only, no text changes. A site change: `npm run build` joins the gates for this batch.

## Entry criteria

- Founder go for the programme: **given 5 November 2026**.
- Gap 13 re-measured on current main: **done** (README section 2.11).
- Predicates confirmed registered (`member_of`, `successor_of`): **done** — no schema question goes to the founder from this phase.

## Exit criteria (definition of done)

- Move 1: all 474 companion-role records carry the `member_of` edge; `group/sahaba` is published; Muhajirun/Ansar extension done or explicitly deferred in `progress.md`.
- Move 2: the neighbourhood batch merged, with every new edge sourced; Ali's kinship derivable by graph query; Abu Bakr's succession edge present.
- Move 3: the ~30 prophetic-era events reconciled; the CSV rosters converted; every disagreement on record in `progress.md`.
- Move 4: narrator annotations complete for the Muhammad-mentioning passages and the Muwatta/Muslim sets.
- Move 5: relational JSON-LD live in the template, sample-verified in ar/en/ur.
- Each batch: validate gated on the literal "0 errors", cite-check on the literal "0 fail", coverage regenerated, CANARY entry in the same commit, one `progress.md` entry per merged batch.

## Founder-gated items attached to this phase (planned, never executed without his explicit word)

1. **The Content-Signal flip** (README section 7, decision 10). robots.txt still sends `ai-input=no`. Not part of any batch above.
2. **The Sahaba lane** (README section 7, decision 11). A separate harvest commission (al-Isaba / Usd al-Ghaba), sequenced after this phase. Registered here as a dependency with its decision point; it is not a batch of this phase.

## Dependencies and contention

- Seeds Phase 4 (rijal): Move 4's markings are its foundation; Phase 4 does not redo them.
- Contends with Phase 3 for `person/` writes: never the same records in the same batch window.
- No dependency on Phase 2's ledger: every edge in this phase cites sources already on the records.

## Risks

| Risk | Mitigation |
|---|---|
| A `member_of` edge restates a wrongly-assigned `companion` role | The edge cites the record's own sources; role corrections found on the way are logged as flags in `progress.md`, one line each, and fixed in the record — never silently propagated |
| Roster reconciliation invents names to reach classical counts | Forbidden in Move 3: disagreements reported, rosters stay partial and say so |
| JSON-LD change breaks the build | Move 5 batch carries `npm run build` and the full test suite as gates |
