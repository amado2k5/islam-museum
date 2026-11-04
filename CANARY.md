# Canary — islam.museum release notes

The museum's public release notes: every change that lands on `main`, recorded in
reader's language in the same commit that makes the change. Newest release first.
The site build reads the version and date from the top block below and shows them
in the footer of every page and on the changelog page (`/{lang}/changelog/`).

Rules for every agent and contributor (`docs/engineering/15-release-notes-and-versioning.md`):
append your entry under the current version block, grouped by kind — Added, Changed,
Fixed, Removed, Performance, Tests, Data, Breaking, Rolled back. Write what changed
and why it matters, never a bare commit message. If your change bumps the version,
open a new block on top with the new version and today's date.

---

## v1.1.0 — 2026-11-03

### Added
- **Developers page** (`/{lang}/developers/`, Arabic, English, Urdu): the museum's open data and API documented for libraries and builders — endpoints, the node/edge/record schema, worked examples with real responses, sample code, starter prompts for AI coding agents, and an honest list of what is not here yet.
- **Network page** (`/{lang}/network/`): the scholars, institutions and communities in conversation with the museum.
- **Canary release notes**: this file, the changelog page that renders it, and the site version now shown in the footer of every page — so any reader can watch the museum change and know exactly which version they are looking at.
- **A standing rule for every agent** (in the repo's `AGENTS.md`): anyone who changes anything in this repository records the change here in the same commit, then commits, opens a pull request and merges it — finished work is never left sitting locally.
- **Forty more Timeline Explorer stories**: follow twenty places and twenty people through 303 dated, cited stops drawn from existing museum records. Every new subject has Arabic, English and Urdu titles and summaries; individual event text retains the documented Arabic fallback where a translation is missing.

### Data
- **Clearer subject metadata**: Urdu labels and summaries added to forty existing records, with recorded localization provenance. Missing provenance restored on seven places and one migration event without changing existing event dates or relationships.
- **Honest Explorer image status**: the forty-story batch remains unpublished pending replacement of five shared backdrops that contain figures. The owner request identifies each file and affected story; a prompt or an earlier screening claim is not treated as proof that an image is safe.

---

## v1.0.2 — 2026-10-31

### Added
- **Disclaimer page** in all three editions, linked from the footer: what the museum is, how its content is gathered and checked, and the terms on which it is offered.
- **Raisely** added as a fifth voluntary support channel on the Support page.
- **Dataset archived on Zenodo** (27 Oct): the museum's CC0 dataset with a permanent DOI — 10.5281/zenodo.23692511 — so libraries and researchers can cite and keep it forever.

---

## v1.0.1 — 2026-10-17

### Added
- **Kids' wing** («جناح الصغار»): a Hudhud-guided children's wing — Word Garden, Prophet Quest, Kindness Quest, bedtime stories and a teacher's kit — in Arabic and English.

---

## v1.0.0 — 2026-10-11

### Added
- **Public launch of islam.museum**: an Arabic-first digital museum of Islamic history with an English edition, nine wings, and a sourced knowledge graph of people, places, buildings, objects, works, passages, concepts and events — published the same day the domain was registered.
