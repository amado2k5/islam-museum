# Review and promotion: how a record earns `reviewed` and `verified`

_This document replaces the founder-flip. Adopted 24 October 2026 on the founder's written instruction. It is binding on every agent, model, tool and human collaborator working in this repository. `status.review` is promoted by protocol — never by preference, never by the record's author, and never by hand-waving at this document: every promotion is a checkable event with an attestation. The founder audits by exception (§6); he is not a step in the flow._

_The museum already trusts machine-gated promotion in one place: an illustration that passes the automated gates of `docs/agents/lanes/illustrations.md` §3 is marked approved by the pipeline, with the gate report recorded. This protocol extends the same pattern — gates, evidence, attestation — to records._

## 1. The ladder

- **`draft`** — everything enters here, with a provenance block. Default state; carries no quality claim.
- **`reviewed`** — the record has passed the full promotion protocol of §2–§3 in a single review pass. This is the normal working target of every lane.
- **`verified`** — `reviewed`, plus a second independent review pass by a different model family at least 30 days later, plus a clean audit history (§5–§6). Reserved for records the museum showcases or cites externally; lanes nominate candidates, the protocol decides.

## 2. Promotion criteria — ALL must hold (draft → reviewed)

1. **Gates green.** `npm run validate` reports 0 errors and 0 warnings attributable to this record; `python scripts/harvest/library/verify_cites.py` passes for it; `npm test` is green in the promotion commit. The reviewer attaches the output of `npm run promote-check -- <record ids>` to the promotion commit: it evaluates the machine-checkable items below (2, 4, 5, 6 in part, and the strict rule in 3) and prints a pass/fail sheet per record.
2. **Every claim cited.** Every prose sentence that states a fact carries `{cite:<source-id> <anchor>}`; every `data/` fact is traceable to the record's claims table. No exceptions, no "common knowledge."
3. **Dated facts doubly sourced — the strict rule.** Every dated fact rests on two independent sources, or is absent. A record carrying any unresolved `needs_source` flag, or any dated fact with `confidence: low`, is **not promotable**: it stays draft until the second source lands. (Doubt stays visible in prose while a record is draft; promotion is the museum's statement that the doubt is resolved.)
4. **Real sources.** At least one cited source is a non-pointer source — not solely `source/wikidata`, a gazetteer (`source/geonames-*`, `source/pleiades`) or another authority/pointer family. All cited source ids resolve to `data/source/` entities.
5. **Provenance complete.** `provenance` carries `layer`, `source`, `generated_by` and `run`; the licence layer of every contributing source family is recorded; facts-only (`nc`) families contributed facts and citations only — no text, no images.
6. **Trilingual parity.** Where prose exists, it exists in Arabic, English and Urdu of equivalent completeness, written to the class structure of `docs/agents/content-standards.md` (Arabic first; translations in the same commit lineage). A record whose languages disagree in facts is not promotable.
7. **Structure complete for its class.** The class's required sections are present and non-empty (see `content-standards.md` §3: events carry wings, periods, regions, date with calendar and status; places carry kind, part_of, sourced coordinates; people carry names with nasab, gender, roles, traditions, faith with basis — and so on). Filler is failure: a section that restates the summary in other words fails this criterion.
8. **Graph hygiene.** Every `[[link]]` and edge resolves; no duplicate record exists (aliases checked); every entity the prose names that lacks a record is stubbed in the lane's `data/_stubs.d/<lane>.yaml`.
9. **House rules.** No typed honorifics; no Qur'an text outside Tanzil references; no verdicts in the museum's voice; non-Sunni views labelled before stated; media only from the licence whitelist (`schema/enums/licenses.yaml`); no figurative depiction of prophets or Companions; no AI-generated portraits. (Validator-enforced items are checked there; the reviewer confirms the rest.)
10. **Doubt preserved.** Every doubt marker, disagreement or single-source caveat the sources print is either resolved by the second source or carried into the record (a claim with `status: debated`, or the caveat stated in prose). A promotion that silently drops a source's caveat fails audit on sight.

## 3. The reviewer protocol

1. **Independence.** The reviewer is a different agent from the author and, wherever the working fleet allows, a **different model family** (Claude-written work is reviewed by a Devin/GPT-class reviewer or vice versa). Self-review is void: a promotion commit whose attestation names the author is reverted to draft on discovery.
2. **Re-derivation, not proofreading.** The reviewer opens the cited sources at the cited anchors and checks: **every dated fact**, and a random sample of **at least 30% of the remaining claims (minimum 5)**. For each checked claim: the value matches the source; the citation anchor is the page/record where a reader finds it in under a minute; quotations are at most 40 words and verbatim; doubt markers are preserved (§2.10).
3. **Attestation.** On pass, the reviewer writes into the record's provenance: `review: { by: <agent>, model: <model>, date: <ISO date>, checklist: "review-and-promotion v1", claims_checked: <n>, claims_sampled: <n> }`, flips `status.review` to `reviewed`, and logs one line in the lane's progress file (batch id, records promoted, claims checked/sampled, defects found). Promotion is its own commit (prefix `review(<lane>):`), at most 25 records, never mixed with content changes.
4. **On failure.** The record stays draft. The reviewer files the defects as a numbered list in the lane's progress file; the author lane fixes and re-submits. A record that fails twice goes to the panel path (§4) regardless of category.

## 4. The panel path (contested registry)

The following are **contested by definition** — no agent decides otherwise case-by-case: Saqifa and the Companions' disputes (the Fitna, Karbala, the Camel, Siffin, Nahrawan and their principals); `concept` records in aqidah; `practice` records where the madhhabs differ; works or persons whose `sensitivity` is `polemical`; **living persons**; and any record a reviewer flags as contested in writing in the lane's progress file.

Panel = **three independent reviewers, at least two model families**, each running §3 in full, plus: the `perspectives` block is complete (Sunni position(s) first, each position cited and labelled, no verdict), and the prose states no position in the museum's voice. Majority promotes; any dissent is recorded in the progress file with its reason, and a record with a dissent stays draft. Living persons additionally require: every dated fact from two *published* sources, no contact details, and no inference about faith or private life beyond what the sources state with basis (`content-standards.md` §3).

## 5. `verified`

A `reviewed` record is promoted to `verified` when: it has been `reviewed` for at least 30 days; a second reviewer of a different model family than the first re-runs §3 in full and passes it; and no audit (§6) has ever failed it. Attestation extends the provenance `review:` block with `verified_by`, `verified_model` and `verified_date`. `verified` is the tier external materials (the dossier, press, education partners) may quote as "editorially verified."

## 6. Audit and automatic demotion (the founder's exception feed)

1. **Standing audit.** The `maintainer` lane runs a weekly audit: a random **2% of all `reviewed`/`verified` records** (minimum 20) is re-checked by a fresh agent against §3.2, blind to the original review. Results append to `docs/delegation/review-audit.md`: records sampled, claims checked, errors found, by lane and author.
2. **Batch failure.** If a single author's batch shows claim errors in **more than 2% of checked claims**, every record of that batch demotes to `draft` automatically, the lane pauses, and an incident note is added to `docs/status.md`. The lane restarts after the defects are fixed and the batch re-reviewed.
3. **Instant demotion (any record, any time).** A validator regression attributable to the record; a cited source entity removed or renamed; a new source contradicting a dated fact (the claim becomes `status: debated` and the record demotes pending re-review); a broken edge or link; an audit failure. Demotion is a normal commit (`review(demote):`) with the reason recorded in the provenance `review_history`. Demotion is not a punishment and needs no one's permission — it is the protocol keeping its own promise.
4. **The founder's view.** `npm run coverage` reports counts by review status (`docs/coverage.md`, "By review status"); `docs/status.md` carries the audit summary. The founder may demote or promote any record at any time by hand — the protocol is the default, not a cage.

## 7. What this document does not change

`docs/ai-change-gates.md` §§1–5 and 7–8 stand: proposals for code, schema and policy; scope; submission-impacting labels and their explicit sign-off; merge discipline; quality gates; attribution; the no-go registry. The founder alone changes rules, schema, enums and policy text; deployment stays manual and the founder's alone. This protocol governs **content review status** — the queue that used to wait on a person.
