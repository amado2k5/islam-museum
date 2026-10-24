# Publication standard: citations, not review

_Founder's instruction, 24 October 2026. This document supersedes `docs/agents/review-and-promotion.md` (adopted and repealed the same day) and every earlier rule that made publication wait for review. It is binding on every agent, model, tool and human collaborator in this repository._

## The bar

A record is **published** when three things are true:

1. **It cites its sources.** Every sentence that states a fact carries `{cite:<source-id> <anchor>}`; every `data/` fact traces to a cited source.
2. **Its sources are defined.** Every cited id resolves to a `data/source/` entity a reader can open — the source is clearly defined, never a bare name in prose.
3. **Its provenance is recorded.** `provenance` says what the record was built from, by whom or what, and in which run.

That is the whole bar. A record that meets it is museum content, full stop.

## No review

No review — by a human or by another agent — is required before, during or after publication. There is no promotion ladder, no reviewer, no panel, no audit gate. The museum shows every reader the citations and the provenance and leaves the judgement to them: **the reader takes the topic or the prose or leaves it, with the sources in front of them.** Do not reintroduce a review step, a "review-ready" queue or a sign-off anywhere in a lane, a plan or a tool; if a document you are following still describes one, this standard wins and the document is out of date.

## One source is enough

One source is enough for any fact, **dated or not**. A second source strengthens a record and lanes should add one when it is cheap to do so, but its absence never blocks publication, never holds a record back, and never has to be flagged as a defect. `needs_source` flags and `confidence: low` remain available as honest annotations when a *source itself* expresses doubt — they are annotations, not gates, and a record carrying them is as published as any other.

## `status.review`

- **`published`** is the normal state of museum content. New records enter as `status.review: published` as soon as they meet the bar above.
- **`draft`** survives only as an author's own work-in-progress marker inside a working session; a batch is committed as `published` when it meets the bar. Draft is a scratch state, not a judgement on content and not a barrier to anything.
- **`reviewed` / `verified`** remain in the enum as truthful labels for work that was in fact reviewed by someone; nothing requires them and nothing waits for them.

Records written under the old rules still carry `draft` values. Read such a value as "written before this standard," nothing more; it does not make the record unpublished, unpublishable or second-class.

## What still binds (unchanged)

- The validator's mechanical rules: schema, citations resolve, no typed honorifics, no Qur'an text outside the Tanzil corpus, media only from the licence whitelist, no figurative depictions of prophets or Companions, no AI-generated portraits.
- The charter's writing rules: describe, attribute, label; Sunni frame first and labelled; contested topics use `perspectives` with no verdict in the museum's voice.
- Provenance honesty: `generated_by`, `model`, `run` state what really happened; a page number not read is a flagged guess, not a citation.
- The change gates in `docs/ai-change-gates.md` for code, schema, policy and submission-impacting work.

## Tooling

`npm run cite-check -- <class/slug> [...]` verifies the bar mechanically for a batch: sources present, every source defined, provenance recorded, every `{cite:...}` in the prose resolving. Run it before committing a batch; a failure means the bar is not met yet — fix the record, not the rule.
