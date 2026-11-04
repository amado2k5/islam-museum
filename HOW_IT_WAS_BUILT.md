# How this was built — one person, a fleet of AI agents, 23 days

**islam.museum** is a free, open digital museum of Islamic history: 47,000+ sourced
records, ~89,000 pages, in Arabic, English and Urdu. It was built by **one person** —
Ahmed Abdel Aal, in Toronto, Canada — directing a fleet of AI coding agents from every
major lab, working in parallel lanes under written doctrine, with every step recorded
in this repository.

## Count it yourself

Every figure below is a command away (run against this repo's `main`):

- `git rev-list --count HEAD` → **14,216 commits** in the 23 days since the first
  commit (2026-10-11), with commits on every single day; the peak day (2026-10-23)
  saw **4,395 commits**.
- **2,999 pull requests merged** (5,614 merge commits).
- **4.67M lines inserted, 1.03M deleted**, across 136,404 unique files.
- The coordination is in the repo too: **328 delegation documents**, ~20 named agent
  lanes (`docs/agents/lanes/`), queue files worked row by row (the largest has 1,933
  rows), and ~7,750 commits carrying `AI-Agent` trailers.

## The system: lanes, waves, gates

The unit of work is a **wave**: a written brief names a lane (a subject area), a queue
of records to build, the schema checklist and the doctrine. An agent builds files only.
A coordinator then merges in cycles gated on three checks — the validator must print
**"0 errors"**, the citation check **"0 fail"** (every source must resolve to a real,
live revision), and the staged file set must match the brief exactly. Finished waves
are logged in `docs/delegation/*-progress.md` and handed to the next lane.

Doctrine (from `AGENTS.md`, commit #1 predates all content): a fact enters only with a
named, checkable source; classifications require **two independent texts** attesting
them for the person himself; doubt is recorded as `unknown`, never guessed; nobody in
a queue is skipped. When one model's loose settlements slipped through, all of them
were reverted in a single day (PR #2873) and the rule re-pinned. The method is older
than the technology: Islamic scholarship's *isnad* discipline — knowledge admitted
only with its chain of sources — implemented as a build pipeline.

## The fleet (capability-matched, cross-checked)

| System | Lane |
|---|---|
| Claude (Anthropic) | Production floor: record waves, prose, translation, schema-faithful writing (named in 5,843 commits) |
| Devin (Cognition) | Autonomous long lanes: the 4,199-record Wikidata import, library batches |
| Muse (Meta) | Orchestration: briefs, merge cycles, gates, progress logs (the AI-Agent trailers) |
| Cursor | Interactive, founder-in-the-loop iteration and fixes |
| Grok (xAI) | Adversarial QA — reviewed other models' work (PR #2825, with Cursor) |
| ChatGPT Codex (OpenAI) | Sandboxed, self-contained code tasks |
| Antigravity (Google) | Parallel agent-environment sessions |
| Gemini (Google) | The original prototype (Google AI Studio) — and the cautionary tale of PR #2873 |
| The founder | Doctrine, rulings on every doubtful case, deployments. Judgement stays human |

No model grades its own homework: writers, reviewers and the merge gate are different
systems, and lanes are model-agnostic — the brief is the interface, so a lane survives
any single model's failure.

## The architecture it produced

A knowledge graph stored as Git — YAML facts + per-language Markdown prose — validated
by a TypeScript pipeline (JSON Schema; EDTF + Hijri dates; citation, link and licence
checks; identical i18n key sets across ar/en/ur) and rendered by Astro to fully static
pages on Cloudflare. **No AI at runtime, no accounts, no cookies, no tracking.** Data is
CC0 (archived at Zenodo, DOI 10.5281/zenodo.23692511), prose CC BY-SA 4.0, code MIT.

*Press contact: the founder, via this repo or discover@islam.museum.*
