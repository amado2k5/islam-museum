# Historical review of the games

_Set up on 26 November 2026 on the founder's instruction of that day ([`../spec-production/owner-decisions-2026-11-26.md`](../spec-production/owner-decisions-2026-11-26.md), section 3). The ledger is [`ledger.json`](ledger.json), shown as [`ledger.md`](ledger.md). **No reviewer has been named yet, so every entry is pending and nothing here is approved.**_

## The rule

An AI may research, gather sources and draft. It never approves its own historical claims. A claim passes through four hands:

1. **The author** prepares the claim, the museum record and the sources. For everything so far that is an AI agent, and the ledger says so.
2. **A named human reviewer** with the right expertise for the place and period: a historian, an archaeologist, an architectural historian or a curator.
3. **The museum's editor** confirms the wording, the uncertainty, the tone and that it is fit to publish.
4. **The founder** approves the scope of the product. That is not, by itself, an approval of historical truth.

## Until reviewers are named

- The games reuse only what the museum's records already say, by showing the record's own label or summary and linking to it.
- No date, dress, building, border, disaster, political claim, military detail or social practice is introduced as fact.
- A fictional district, a simulation and an outcome that did not happen are each labelled as such on the page.
- History that is disputed or approximate is marked so.
- Disease, famine, conflict and unrest are shown with mitigation and recovery, never as spectacle.

## How the ledger is kept

- **Before a statement of history reaches a page of a game, it has an entry**: the claim in plain words, where in the game it appears, its source (a museum record by id, or none), what is uncertain about it, and its kind.
- An entry is `pending` until a named reviewer decides: `approved`, `approved-with-changes` or `rejected`, with the reviewer's name and the date. The generator refuses a decision that has no reviewer and no date.
- Something the games show that no source stands behind (the shape of a house, the dress of a walker) is entered as `unsourced-look`. It is not stated anywhere as fact, and it is the first thing a reviewer is asked to look at.
- A rejected claim is taken out of the game in the same change that records the rejection.
- The museum's own records are not reviewed here. A doubt about one is raised with the museum's data, as Atlas's 263 held events are ([`../../../gaming/games/atlas/data/review.v1.json`](../../../gaming/games/atlas/data/review.v1.json)).

## What is open

Who the reviewers and the editor are is the founder's to say ([`../traceability.md`](../traceability.md), "Decisions that still need the founder", O1). "Already approved islam.museum records" is read here as the records the museum has published; the museum publishes on cited sources without a human read (founder's ruling of 15 November 2026), so a museum record is not, by itself, a record a historian has read.
