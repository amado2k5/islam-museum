# Proposal: the founder's entity-policy decisions of 7 November 2026, as rules for every agent

Status: **proposed**. The decisions themselves are the founder's, given in chat on 7 November 2026. This text, which turns them into rules in `AGENTS.md` and `docs/modern-islam/prompt.md`, waits for his approval.
Author: Claude Code (claude-opus-5-5), Modern Islam Browser enrichment lane.
Risk rating: `non-impacting`. This changes rules and documentation only, plus one enum value. No filed submission is affected.

## 1. The founder's decisions (his words in quotation marks)

| # | Question | Decision |
|---|---|---|
| Q1 | Allegations about living people and institutions | "we can say allegations and armed group": tell them in an attributed "allegations and outcomes" passage, with the response or an outcome; any group on the hard-block list is written as "an armed group" |
| Q2 | "Made by Muslims" for companies | "do that": the layered option. The strict flag stays, with descriptive tags beside it (`docs/delegation/made-context-proposal.md`) |
| Q3 | Propaganda: games, a forum, an app | "keep them out": Under Ash, Under Siege, Special Force 1 and 2 and Huroof stay out, with no exhibit. The Palestinian Dialogue Network was already a published record on the founder-approved exceptions list; asked which decision wins, the founder said "Keep the record" (7 November 2026) |
| Q4 | Muslim artists' secular work | "ok": album records only for artists already in the browser for their religious work; their other work is named in the biography |
| Q5 | Hamid Choi's faith | "ok": Muslim, basis `documented`, citing the first-person quotation the prize publishes in his name |
| Q6 | Items held for want of a source | "ok": a leads file in the repository now (`docs/modern-islam/leads.md`); a public page later, as its own proposal |

## 2. Proposed rule text for `AGENTS.md` (one new bullet under "Rules that never bend")

> **Entity policy (founder decisions of 7 November 2026).**
> - (1) **Allegations** against a living person or an institution are told only in a short, attributed "allegations and outcomes" passage. It names who made the claim, gives the response or denial, and gives any court or regulator outcome. There is no verdict. If neither a response nor an outcome has been read, the allegation stays held. A group on the hard-block list is written as "an armed group", never by name.
> - (2) **"Made by Muslims"** stays strict: `made.by_muslims: true` needs a founder's or company's own statement (`self-identified`) or a reliable source (`documented`). A company that cannot meet that is described with `made.context` tags (`state-owned-muslim-majority`, `halal-certified`, `sharia-compliant-by-charter`, `serves-muslim-market`), each sourced, which claim no one's faith.
> - (3) **Works by armed groups**, and works the founder has ruled out under the propaganda rule, are not listed, exhibited or mentioned. Records on the founder-approved exceptions list stay as they are.
> - (4) **A Muslim artist's secular work** gets its own records only when the artist is already in the browser for religious work; otherwise it is named in the biography.
> - (5) **A first-person statement of faith published in a person's name** by the body that honours them counts as a `documented` basis, never as `self-identified`. `self-identified` needs the person's own channel (an interview, their own book or site).
> - (6) **An item held only for want of a source** moves, after the section's standard search, to `docs/modern-islam/leads.md`. Nothing is dropped from it without the founder.

## 3. One enum value

`schema/enums/faith.yaml` has traditions (`sunni`, `sufi`, `shia-…`) but no tradition-neutral value for a Muslim whose school no source names. Decision Q5 needs one.

- **Proposed:** add `muslim` ("Muslim, tradition not stated"), with ar/en/ur labels in the UI string files. The validator still requires a basis and a source, and the two-source rule for a named school (plan 26 §3.6) is not triggered by `muslim`.
- Hamid Choi's record is updated once this is approved.

## 4. Files touched (after approval)

- `AGENTS.md`: the bullet in section 2.
- `docs/modern-islam/prompt.md` and `docs/modern-islam/session-prompt.md`: the same rules, for section agents.
- `schema/enums/faith.yaml`: `muslim`.
- `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml`: its label, if the faith values are labelled there.
- `scripts/validate.ts`: treat `muslim` as not naming a school.
- `data/person/hamid-choi.yaml`: `faith: muslim`, `basis: documented`.
- `CANARY.md`: a Changed entry.

## 5. Gates

`npm run validate` (0 errors) and `npm test` (all pass). If the i18n files change, `npm run build` too, because those strings reach pages.
