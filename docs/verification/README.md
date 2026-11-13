# Evidence package — the Fable 5.2 run, independently verified

This folder is the public evidence behind a simple claim: **a major AI build on this
repository was measured by an independent tester, before and after deployment, and the
failures were published alongside the successes.**

- **The product:** [islam.museum](https://islam.museum) — a free digital museum of Islamic
  history: 58,128 sourced entries in Arabic, English and Urdu (live count, verifiable at
  [`/api/v1/meta/counts.json`](https://islam.museum/api/v1/meta/counts.json)).
- **The builder:** Claude Fable 5.2, given one goal-based mission prompt against the whole
  repository (exhibit C).
- **The tester:** a different AI agent (Muse), which acceptance-tested production before
  the run and re-ran the identical checks after deployment (exhibits A and B).
- **The human:** the founder reviewed, merged and deployed. Agents did not self-merge,
  and deployment to production is a manual, human act in this project.

## The workflow

1. **Baseline.** The tester acceptance-tests the live site and writes the defects down
   (nine, D1–D9, 10 November 2026).
2. **Goal, not steps.** The builder receives one mission: verifiable statements about the
   finished state, the repository's standing rules as boundaries, and two literal ship
   gates — the validator must print `0 errors`, the citation check `0 fail`.
3. **Self-grading, not trusted.** The builder's own run ledger (exhibit D) marks 11 of its
   13 statements GREEN and 2 NOT GREEN; its verifiers corrected several of its own PR
   claims in the small. Both halves are public.
4. **Human gate.** The work landed on a release branch first; the founder merged and
   deployed it (production deploy of 12 November 2026, commit
   [`eeb962b7`](https://github.com/amado2k5/islam-museum/commit/eeb962b73d58f80a602b4ff9a011fe017182d68f),
   site v1.28.0).
5. **Retest.** The tester repeats the same checks on the live build and publishes the diff.

## The machinery around the build

The run did not happen in a vacuum. Three pieces of the project's own machinery are
part of the story, and part of why the result can be checked:

- **Orchestration.** The founder directs a fleet of specialised agents — builders,
  verifiers and the independent tester — working in parallel lanes on separate
  branches. Writers are files-only in named worktrees; they never commit, merge or
  deploy. Every merge is asserted against the freshest `main` first, and the ship gates
  are literal: the validator must print `0 errors`, the citation check `0 fail`.
- **A local judge LLM.** Governance decisions in this project accumulate in a decision
  ledger. A judge model that runs locally, on the founder's own hardware (Ollama,
  `qwen2.5:32b`), triages proposed decisions against the founder's recorded rulings and
  the precedents mined from them. The judge advises; it does not decide — founder
  rulings govern, and for the ledger itself, agents do not self-merge (the founder
  merges).
- **The UAT build.** Agent work lands on a release branch (`release/uat`) and is built
  in the UAT environment before it is allowed near `main`; the deploy configuration was
  changed to allow UAT releases from a release branch while production stays
  `main`-only. The Fable stack was built and verified at UAT first (CANARY v1.21.0 on
  that branch), merged to `main` second, and deployed to production by the founder,
  by hand, last.

## The result (independent retest, production, 12 November 2026)

- **7 of the 9 baseline defects fixed** — map city selection (Baghdad now opens with 982
  linked records; Mecca with 554), object photographs, leaked editorial markers,
  Backstage freshness, the populated People hall, changelog rendering, and the Battles
  ghazawat counts, which now agree with themselves (57 + 15, total 3,251).
- **1 partial** — footnote anchors work where a page carries them, but the sampled nature
  pages still render with no footnote apparatus (D8).
- **1 not fixed** — `chains.json` and the OpenAPI index still return 404 (D9).
- **New features verified live:** the Grand Tour, entered through the River of Time
  (40 cornerstone stops, 14 centuries, 9 wings —
  [walk it](https://islam.museum/en/grand-tour/)), and the Education Explorer
  (65 Ontario courses, Grades 1–12, lessons tied to official curriculum codes —
  [browse it](https://islam.museum/en/learn/courses/)).
- **Search, honestly:** "Saladin" now returns the person page first; "Muhammad" still
  returns an object first — the production echo of the run ledger's own NOT-GREEN
  statement on canon-first search.

## Exhibits

| # | Exhibit | What it establishes |
|---|---|---|
| A | [Production test — before (2026-11-10)](production-test-2026-11-10-before.md) | The independent baseline: build v1.10.0, defects D1–D9 documented before the run |
| B | [Production test — after (2026-11-12)](production-test-2026-11-12-after.md) | The identical checks re-run on the deployed build v1.28.0, defect by defect |
| C | [The mission prompt](fable-5-2-mission-prompt.md) | The single goal-based prompt the builder worked from (the launch text; its header records its own version history) |
| D | [The builder's run records](../fable-run/) | Fable's own gap register, absences, contradictions and notices — including what it marked NOT GREEN |
| E | The live site itself | [Grand Tour](https://islam.museum/en/grand-tour/) · [Education Explorer](https://islam.museum/en/learn/courses/) · [live counts](https://islam.museum/api/v1/meta/counts.json) · [deploy stamp](https://islam.museum/api/v1/meta/deploy.json) |
| F | The dataset | Released CC0, archived on Zenodo — concept DOI [10.5281/zenodo.23692511](https://doi.org/10.5281/zenodo.23692511) — so any reader can re-run the verification independently |

*Prepared by the project's own agents and published by the founder. Corrections are
welcome — that is rather the point of the exercise.*
