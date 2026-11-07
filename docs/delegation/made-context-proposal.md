# Proposal: `made.context`, descriptive tags beside "made by Muslims"

Status: **proposed**, waiting for the founder's approval of this text. The founder approved the approach in chat on 7 November 2026 (Q2, "do that").
Author: Claude Code (claude-opus-5-5), Modern Islam Browser enrichment lane.
Risk rating: `non-impacting`. This is an optional data field, validated, and exported in the static API. No page renders `made` today, so no visible page changes and no rewrite of every page. No filed submission (DPGA, UNESCO) is affected.

## 1. Why

Every listing, group and work carries `made: { by_muslims, basis, sources }`. The faith rule allows `by_muslims: true` only with `basis: self-identified` or `documented`, and never infers it from a country, a product, an audience or an owner. That rule stays exactly as it is.

Some enterprise records cannot meet it, but they are still plainly part of the modern Islamic economy:
- state carriers and hotel groups (Emirates, Qatar Airways, Etihad, Rotana, Jumeirah);
- halal food chains (The Halal Guys, Al Tazaj, Marrybrown, Ramly);
- Islamic banks whose charter, not their founders, makes them what they are.

They are held now, because the only way to describe them is the faith flag. The founder's decision (Q2, option B "layered") is to keep the strict flag and add descriptive tags that make no claim about anyone's faith.

## 2. The change

An optional array `made.context`, each item `{ tag, sources }`, where `tag` is one of a new controlled list, `schema/enums/made-context.yaml`. Each tag has ar/en/ur labels:

| tag | meaning | evidence it needs |
|---|---|---|
| `state-owned-muslim-majority` | owned or controlled by the government, or a sovereign fund, of a Muslim-majority state | a cited source naming the state owner; the record also carries the `owned_by` relation where the owner has a record |
| `halal-certified` | holds a halal certification | a cited source; the record's existing `certifications` field names the certifier, recorded and never adjudicated |
| `sharia-compliant-by-charter` | operates under a Sharia charter or a Sharia supervisory board by its own constitution or licence | a cited source stating the charter, licence or board |
| `serves-muslim-market` | built mainly for Muslim users or customers (an Islamic app, a modest-fashion label) | a cited source stating it |

Rules the validator enforces:
1. Every `context` item needs at least one source.
2. `context` never changes `by_muslims`, and a record may carry `context` with `by_muslims: false` or with `basis: unverified`.
3. `halal-certified` needs a non-empty `certifications` field.

## 3. Files touched

- `scripts/gen-schema.ts`: `madeBlock` gains `context`. Regenerated `schema/group.schema.json`, `schema/listing.schema.json` and `schema/work.schema.json`.
- `schema/enums/made-context.yaml` (new): the four tags with ar/en/ur labels. Arabic first, Urdu and English in the same commit.
- `scripts/validate.ts`: the three rules above.
- `scripts/modern.test.ts`: tests for the three rules, one passing and one failing case each.
- `docs/data/README.md`, `site/public/openapi/v1.json`, `llms.txt`: document the field in the static API. It is exported automatically with the class exports.
- `docs/modern-islam/prompt.md` and `docs/modern-islam/session-prompt.md`: one paragraph telling section agents when to use each tag.
- `CANARY.md`: a Changed entry (minor version, new field).

Not touched: no page, layout, component or stylesheet; no shell path (`tools/deploy/shell-paths.list`), so this is not a `rewrites-all-pages` change.

## 4. After approval

The enterprise section applies the tags to its held rows (the state carriers, hotel groups and halal chains), each with its source, and moves those rows from "held" to "resolved". Islamic banks may add `sharia-compliant-by-charter` beside their existing flag.

## 5. Gates

`npm run validate` (0 errors) and `npm test` (all pass) before the pull request. No `npm run build` is needed, since no site change is made, though the build is run once to confirm the API export.
