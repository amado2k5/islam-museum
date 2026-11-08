# Research tier — how held questions get real answers

The deterministic pipeline (`decide.ts`) handles rules, gates and precedent matches.
Questions that reach `safe-default` are **held, not abandoned**: an agent with
tools (repo access, web search, the harvest corpora on the microSD, the founder's
browser for blocked sites) researches the question and writes a decision record
by hand in `docs/decisions/records/` using the same schema, with two differences:

- `status: recommended` — the agent's evidence-backed recommendation for the
  founder to confirm asynchronously (use for governance, contested or irreversible
  questions).
- `status: decided` + `step: research` — allowed only for reversible, draft-tier
  questions where the evidence is unambiguous (e.g. "which field marks X" — a
  measurement, not a judgment).

Every research record MUST carry `evidence:` — file paths, URLs, command output —
so the founder can verify the answer in under a minute. A recommendation without
evidence is not a record; it is a guess, and guesses stay in the inbox.

## Record template

```yaml
id: dec-YYYYMMDD-NNN
question_hash: <sha1-12 of normalized question — run decide.ts dry-run to get it>
date: "YYYY-MM-DD"
lane: <lane>
class: <class>
question: "..."
status: recommended        # or: decided (reversible draft-tier only)
step: research
decision: "<the recommendation, one sentence>"
confidence: 0.0-1.0
reversible: true|false
rationale: "<why, in two sentences>"
evidence:
  - "file:docs/..."
  - "cmd:grep -rl ... -> N files"
  - "url:https://..."
review_sampled: false
decided_by:
  agent: <agent id>
  pipeline: research-tier
```

## What the research tier may NOT do

Same non-delegable list as the pipeline: deploys, deletions, spending, outreach,
licence changes, review-status escalation, governance surfaces, content-safety
hard-block topics, Qur'an text. For those, `status: recommended` is the ceiling —
the founder still decides; the agent only prepares the brief.

## Worked example (8 Nov 2026)

Inbox question: *"Which flag field marks the ~4,199 records carrying second-source
debt?"* — held at safe-default (no precedent). Research found: there is **no
single flag field** — the debt is distributed across `needs_source` flags (281
files), provenance `note:`/`generated_by:` text saying "not verified against a
second source", and records whose only source is `source/wikidata`. Record
`dec-20261108-014` recommends measuring all three channels rather than confirming
one flag. This is the shape every held question should get.
