# Contributing to islam.museum

Thank you for being here. islam.museum is a free, open digital museum of Islam —
the faith, the civilization, the peoples, places, ideas, objects and living
culture, from the world Islam was born into until today. It is a **knowledge
graph in git**, published as a static site at https://islam.museum, and every
contribution — content, code, translation, correction — arrives as a pull
request.

This file is the short, human version. The full rulebook lives in
[`AGENTS.md`](AGENTS.md) (written for every collaborator, human or AI) and the
documents it points to. Where this file and `AGENTS.md` ever disagree,
`AGENTS.md` wins.

## Ways to contribute

- **Suggest or report** — use the issue forms: suggest an entity, report an
  error, request a translation, propose an exhibit. No code required.
- **Author content** — add or enrich an entity: a person, place, event,
  manuscript, building, object, concept. This is most of the museum.
- **Write or fix prose** — the narrative pages, in Arabic, English or Urdu.
- **Code** — the site (`site/`), the pipeline (`scripts/`), tools and tests.
- **Translate** — every page ships in Arabic, English and Urdu (see the
  trilingual rule below).

## The rules that never bend

- **Cite everything.** Every entity cites defined sources; **one source is
  enough for any fact**, dated or not. Never invent a date, quote, page number,
  ISBN or citation — if a fact has no source, it does not go in.
- **Describe, never prescribe.** A warm, precise, neutral docent voice: no
  rulings, no sermon. Beliefs are attributed to their holders. Contested topics
  use the `perspectives` block — Sunni position first, then the academic view,
  then any other view, each cited and labelled, no verdict. A person's faith is
  recorded only with its stated basis, never inferred.
- **No honorifics typed anywhere** (not ﷺ, not «عليه السلام» or the like): the
  site renders them. The validator rejects them in source files.
- **Qur'an text is never typed, completed or corrected.** It comes only from
  the frozen Tanzil files and is referenced as
  `[[passage/quran-<sura>-<aya>|label]]`.
- **Media:** only licences on the whitelist in `schema/enums/licenses.yaml`;
  no figurative depictions of prophets or Companions; no AI-generated
  portraits.
- **Sources may be read freely** — any source, copyrighted or not — and
  rewritten in the museum's own words with a citation. What stays out of git:
  verbatim text beyond a 40-word cited quotation, and the source files
  themselves (PDFs, OCR text, page images). Wikipedia and Wikidata may be cited
  for entity *facts* (dates, identifiers, names, places) taken from a recorded
  revision; they are never a source for prose. Full policy:
  [`docs/sources-policy.md`](docs/sources-policy.md).

## Setup

You need **Node ≥ 22**.

```bash
git clone https://github.com/amado2k5/islam-museum.git
cd islam-museum
npm install && npm install --prefix site
npm run dev        # compile the graph, then run the site locally
```

## Making a content contribution

1. **Start from a template and a gold example.** Copy a file from
   [`templates/`](templates/) into `data/<class>/<slug>.yaml` (the
   language-neutral facts) and `content/<lang>/<class>/<slug>.md` (the prose).
   Before writing, read two existing entities of the same class and copy their
   shape — for events, the gold example is
   `data/event/expedition-of-al-sawiq.yaml` with
   `content/ar/event/expedition-of-al-sawiq.md`. The merged record's shape
   always wins over any older description of the schema.
2. **Write the rich first pass.** Full, detailed prose and as many
   well-sourced details as the sources allow, the first time. Enrichment is
   not left for "later"; later work is revision.
3. **Ship all three languages in the same commit.** Arabic is written first —
   `label.ar` and `summary.ar` are required, new prose starts in
   `content/ar/` — and the same change includes the English
   (`content/en/`, `i18n/en.yaml`) and Urdu (`content/ur/`, `i18n/ur.yaml`)
   versions, each marked `status.review: published` with a `provenance` block.
   If a change genuinely cannot include its translations, say so in the commit
   message. (UI strings follow the same rule: a new key goes into
   `i18n/ar.yaml`, `i18n/en.yaml` and `i18n/ur.yaml` together — the test suite
   requires identical key sets.)
4. **Relations use only the predicates in `schema/predicates.yaml`**, written
   once, on one side (inverses are computed). Reuse existing entities before
   creating new ones; a duplicate becomes an alias of the richer entity.
5. **Keep it small:** at most **25 entities per pull request**.

Content standards in depth: [`docs/agents/content-standards.md`](docs/agents/content-standards.md)
and the publication standard, [`docs/agents/publication-standard.md`](docs/agents/publication-standard.md).

## Making a code contribution

- Read [`docs/site/README.md`](docs/site/README.md) before changing anything
  under `site/` or touching a date or timeline.
- The site is **fully static** — no servers, no databases, and no AI or model
  calls at runtime. Models are a building-phase tool only.
- **Accessibility is a gate, not a polish step:** WCAG 2.2 AA, alt text on
  images, and every page readable with JavaScript off.
- Never break the layout on any screen size (phone, tablet, desktop), and
  never hide or orphan a page or a feature.

## The checks — your PR must pass all of them

```bash
npm run validate   # must finish with 0 errors
npm run cite-check # every citation must resolve: 0 fail
npm test           # the whole suite — it validates ~50,000 entities, allow it several minutes
npm run build      # required for any site change
npm run coverage   # required when your change adds or alters entities —
                   # commit the regenerated docs/coverage.md with your change
```

Fix what fails. Never lower a rule, skip a test, or add a guard that hides bad
data.

## The canary — every change, no exceptions

Every change that lands on `main` — feature, fix, content, docs, config —
**appends an entry to [`CANARY.md`](CANARY.md) in the same commit**. Append it
under the current version block at the top, grouped by kind (Added, Changed,
Fixed, Removed, Performance, Tests, Data, Breaking, Rolled back), written for
readers: what changed and why it matters, never a bare commit message. A change
without its canary entry is not finished and does not merge. Details:
[`docs/engineering/15-release-notes-and-versioning.md`](docs/engineering/15-release-notes-and-versioning.md).

## Submitting your pull request

- `main` accepts **pull requests only** — direct pushes are blocked by a
  repository ruleset. Work on a branch (your fork's, or a branch here if you
  are a collaborator) and open the PR against `main`.
- **`main` moves fast.** Fetch it before you push; if it has moved, merge it
  into your work (three-way) — never overwrite someone else's work, and never
  force-push. Never discard or revert another contributor's changes; if two
  versions of an entity collide, the richer one survives and the other becomes
  its alias.
- Commit **explicit paths** (`git add data/person/example.yaml …`), never
  `git add -A`. Use conventional commit messages (`feat:`, `fix:`, `docs:`,
  `content:`).
- Fill in the PR template, including its sensitivity check.
- **There is no human review gate.** The automated gates above *are* the
  gate: when they pass, the PR may be merged — if you have merge rights, merge
  your own; otherwise a maintainer will. Finished work is never left sitting
  in an open PR.
- **Merged is not live.** Deployment is a separate manual step by the project
  founder, usually once a day, to keep hosting costs down. Your change appears
  on islam.museum at his next deploy.

## AI-assisted contributions

They are welcome — this museum is itself built by a pipeline of AI agents
working under the rules above, and it says so openly
([`HOW_IT_WAS_BUILT.md`](HOW_IT_WAS_BUILT.md)). Two conditions:

- **Disclose.** Content records carry a `provenance` block naming what
  generated the draft (`generated_by`, `model`, `run`, `source`); commits by
  agents end with `AI-Agent:`, `AI-Model:` and `AI-Editor:` trailers.
- **The gates decide, and you are responsible.** AI-assisted work enters as
  `status.review: published` with its provenance once it cites defined sources
  and passes every check — exactly like human work, no more and no less.

## Licences — what you contribute under

By contributing you agree that your contribution is published under the
project's licences: **structured data CC0, prose CC BY-SA 4.0, code MIT**
([`LICENSE`](LICENSE), [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)). Third-party
material keeps its own licence and must come from the media whitelist above.

## Conduct, governance, security

- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — how we treat each other here.
- [`GOVERNANCE.md`](GOVERNANCE.md) — how decisions are made and by whom.
- [`SECURITY.md`](SECURITY.md) — how to report a vulnerability (please do not
  open a public issue for one).

Questions that are not an issue or a PR? Open a discussion, or an issue and
say it is a question. Welcome aboard — اكتب، وابنِ، وشارك.
