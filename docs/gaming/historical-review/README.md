# Historical review of the games

_Set up on 26 November 2026 on the founder's instructions of that day ([`../spec-production/owner-decisions-2026-11-26.md`](../spec-production/owner-decisions-2026-11-26.md), section 3; [`owner-decisions-2026-11-26-b.md`](../spec-production/owner-decisions-2026-11-26-b.md), O1). The ledger is [`ledger.json`](ledger.json), shown as [`ledger.md`](ledger.md); the briefs for the six reviewers are [`reviewer-briefs.md`](reviewer-briefs.md). **No reviewer has been named, so every entry reads "historical review pending", nothing here is approved, and historical approval of any production release is blocked.**_

## The rule

An AI may research, gather sources and draft. It never approves its own historical claims. A claim passes through four hands:

1. **The author** prepares the claim, the museum record and the sources. For everything so far that is an AI agent, and the ledger says so.
2. **A named human reviewer** with the right expertise for the place and period: a historian, an archaeologist, an architectural historian or a curator.
3. **The museum's editor** confirms the wording, the uncertainty, the tone and that it is fit to publish.
4. **The founder** approves the scope of the product. That is not, by itself, an approval of historical truth.

## Until reviewers are named

- The games reuse only what the museum's records already say, by showing the record's own label or summary and linking to it. **A published museum record is existing source material that itself needs review; it is not human-approved** (founder, 26 November 2026).
- No new historical claim is published as verified. Affected content is marked "historical review pending".
- Four kinds are told apart: text from a source, a claim that is uncertain, a reconstruction, and fiction.
- Engineering, fictional mechanics and art that states no history may go on.
- No date, dress, building, border, disaster, political claim, military detail or social practice is introduced as fact.
- A fictional district, a simulation and an outcome that did not happen are each labelled as such on the page.
- History that is disputed or approximate is marked so.
- Disease, famine, conflict and unrest are shown with mitigation and recovery, never as spectacle.

## How the ledger is kept

- **Before a statement of history reaches a page of a game, it has an entry**: the claim in plain words, where in the game it appears, its source (a museum record by id, or none), what is uncertain about it, and its kind.
- An entry is `historical review pending` until a reviewer named on the roster decides: `approved`, `approved-with-changes` or `rejected`, with the date. The generator refuses a decision whose reviewer is not on the roster by name. The founder approves the product and is never entered as a reviewer.
- Something the games show that no source stands behind (the shape of a house, the dress of a walker) is entered as a `reconstruction`. It is not stated anywhere as fact, and it is the first thing a reviewer is asked to look at.
- A rejected claim is taken out of the game in the same change that records the rejection.
- The museum's own records are not reviewed here. A doubt about one is raised with the museum's data, as Atlas's 263 held events are ([`../../../gaming/games/atlas/data/review.v1.json`](../../../gaming/games/atlas/data/review.v1.json)).

## What is open

Six reviewers and the museum's editor: none is named ([`../spec-production/owner-register.md`](../spec-production/owner-register.md), P1 and P2). Writing the briefs does not close this. The words "historical review pending" stand on each game's own page beside its note on history, in seven languages, and a test keeps them there while any entry of that game is pending (`gaming/games/review-mark.gtest.ts`).
