# Lanes: who works on what

A **lane** is a stream of work with its own scope, files, branch naming and progress file, so that several agents (of any vendor or model) can work at once without overlap. The registry below is the source of truth for scope; the live state of each lane is in its progress file and in the "Parallel work" table of [`../status.md`](../status.md).

Rules for every lane: [`../../AGENTS.md`](../../AGENTS.md), [`workflow.md`](workflow.md), [`content-standards.md`](content-standards.md); lanes that mine a source also follow [`mining-sources.md`](mining-sources.md).

## Registry

| Lane | Scope | Lane document | Progress file | Branch pattern | Stubs file |
|---|---|---|---|---|---|
| `raheeq` | Mine al-Raheeq al-Makhtum (plan 17): the Prophetic-era spine, 27 batches | [`lanes/raheeq.md`](lanes/raheeq.md) | `docs/delegation/raheeq-progress.md` | `content/raheeq-<agent>` | `data/_stubs.d/raheeq.yaml` |
| `hisham` | Mine Sirat Ibn Hisham, juz' 4 (plan 18): the endgame, conquests, expeditions, delegations, the passing and the Saqifa, 23 batches | [`lanes/hisham.md`](lanes/hisham.md) | `docs/delegation/hisham-progress.md` | `content/ibn-hisham-<agent>` | `data/_stubs.d/ibn-hisham.yaml` |
| `lib-<book-id>` | Mine one book of the library of prominent Sunni works (hadith, tafsir, sira, sahaba, sahabiyat, creed, history, fiqh…) | [`lanes/library.md`](lanes/library.md) | `docs/delegation/library/<book-id>.md` | `content/lib-<book-id>` | `data/_stubs.d/lib-<book-id>.yaml` |
| `people` | Prophetic-era people and groups (complete; historical) | [`lanes/prophetic-people.md`](lanes/prophetic-people.md) | `docs/status.md` | `people-batch-*` | `data/_stubs.d/devin-people.yaml` |
| `maintainer` | Schema, scripts, validator, site, i18n, periods, maps, Qur'an, local harvest, core concepts and practices | [`lanes/maintainer.md`](lanes/maintainer.md) | `docs/status.md` | any | `data/_stubs.yaml` |

`<agent>` in a branch name is any short name for the session or tool (so two sessions never collide on a branch). A lane may have several sessions over time, one at a time unless the lane document says otherwise.

## Overlap between lanes: reuse, never duplicate

The sira lanes (`raheeq`, `hisham`) and the library lanes cover the same events and people from different books. For any event, person, place or group: search `data/` first; if it exists, add your book's page as another source and your claims as additional claims, keep a different date or number as a second dated claim (`status: debated`), and create new sub-entities only where they do not exist. Run `git pull --rebase origin main` and look at `data/event/` and `data/person/` again before each batch that touches the other lane's period.

## Starting a lane

1. Write the lane document in `docs/agents/lanes/<lane>.md` (scope, source and where it lives, plan document, batch order, overlap warnings, tier-A sections) and add a row above.
2. Create the progress file `docs/delegation/<lane>-progress.md` with the "next step".
3. Add a row to the "Parallel work" table in `docs/status.md`.
4. Hand an agent the standard task text in [`README.md`](README.md); for a library book, `python scripts/harvest/library/make_work_order.py <book-id>` composes it.

## Handing a lane to another agent (credit ran out, tool changed, session ended)

Nothing is lost if the previous agent followed `workflow.md`: its work is on `main`, and its progress file says where it stopped. The new agent: `git fetch origin`, reads the lane document and the progress file, checks `git log origin/main` for the lane's last commits, sets up its own clone and branch (`workflow.md` §1), and resumes at the "next step". It does not start from a vendor-specific prompt: the lane document is the prompt.

## Historical vendor prompts

Earlier per-vendor prompts (Devin, Antigravity, Kiro, Codex) have been replaced by this registry. `docs/delegation/devin-people-lane.md` is kept as the record of the completed `people` lane.
