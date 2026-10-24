# 13 · Using this repo as a template — cloning a knowledge-graph museum

This repository is a working template for **any** "open digital museum" or
structured knowledge project: a graph of facts in git, prose per language,
a compiled static site, executable editorial rules, and a governed
multi-agent workforce. This document explains what transfers, what to
change, and includes a ready-to-paste prompt for handing the scaffold to an
agent.

## 1. What you get for free by forking

| Layer | What transfers unchanged | Effort saved |
|---|---|---|
| Content model | `schema/_base.schema.json`, predicates-with-inverses pattern, EDTF date handling, immutable-ID/alias scheme, provenance/status blocks | weeks of data modelling |
| Pipeline | `scripts/validate.ts`, `build-graph.ts`, `derive.ts`, `export-api.ts`, `gen-schema.ts`, `check-static.ts`, git-dates, coverage reporter | the entire build brain |
| Site | Astro layouts, hall/entity page patterns, RTL-safe Tailwind + logical CSS, Pagefind wiring, loaders, components | a full museum front-end |
| Governance | `AGENTS.md` charter, `docs/ai-change-gates.md`, `docs/agents/` workflow+lanes+standards, issue forms, PR template, CODEOWNERS | the hard part nobody builds |
| DevOps | workflows (validate/build/deploy/r2-*), R2 manifest sync worker, IndexNow, Lighthouse config | a tested CI/CD |
| Licensing scaffold | MIT/CC0/CC BY-SA split, `LICENSE-CONTENT.md`, `schema/enums/licenses.yaml` | legal structure |

## 2. What you must replace or strip

| Replace | Notes |
|---|---|
| `data/**`, `content/**`, `geo/**`, `datasets/**`, `i18n/*.yaml` values | The *content* — CC BY-SA prose may be reused only with attribution+share-alike; simplest is to start empty (keep `data/_stubs.yaml` structure) |
| `schema/<class>.schema.json` files | Rename classes to your domain (a museum of astronomy ≠ person/event/place mix). Keep `_base` and the predicates registry *pattern* |
| `schema/predicates.yaml`, `schema/enums/*` | Rewrite for your relations/vocabularies |
| Domain-specific validator rules | Honorific/Qur'an/perspectives-ordering rules are Islam-specific — remove or replace with your domain's invariants (this is the *pattern* that matters: executable editorial policy) |
| `site/` copy, themes, wings, branding, fonts | Astro structure stays; labels come from `i18n/` |
| `scripts/harvest/`, `scripts/media/` | Source pipelines are source-specific; keep the *shape* (download → licence-layer → extract → judge → promote) |
| `docs/plan/*` | Write your own plan docs; keep the format |
| Deployment config | `wrangler.toml`/workflow secrets, domains, R2 buckets, `PAGEFIND_BASE_URL` |
| `GOVERNANCE.md`, `docs/scope.md`, `docs/language.md`, `docs/sources-policy.md` | Rewrite to your editorial stance |
| `docs/status.md`, `docs/coverage.md` | Regenerate (`npm run coverage`) |

## 3. Recommended clone procedure

1. **Fork or clone** the repo; keep `LICENSE` (MIT) attribution for code.
2. **Delete content, keep structure**: empty `data/<class>/` and
   `content/<lang>/` except `_stubs.yaml`, `_base` templates in
   `templates/`.
3. **Rename classes**: pick your entity classes (e.g., for a museum of
   mathematics: `person`, `work`, `concept`, `theorem`, `institution`,
   `era`, `problem`, `proof`); write one schema per class extending
   `_base`.
4. **Rewrite `predicates.yaml`** with your relation vocabulary (each with
   inverse, domain, range, labels).
5. **Adapt validator domain rules**: delete Islam-specific checks; add your
   own executable invariants (e.g., "every theorem cites a proof or is
   flagged conjecture").
6. **Update `i18n/` + language policy**; keep the "primary language first"
   pattern — it's the translation discipline that works.
7. **Rebrand `site/`**: names in config, layout copy, hall pages.
8. **Point CI/CD at your accounts**: CF Pages project, R2 bucket, secrets
   ([06-deployment](06-deployment.md) §3); or simplify to GitHub Pages
   alone if under file limits.
9. **Write your `docs/plan/00–06`** (vision, content model, architecture
   delta, experience, editorial, roadmap) — the format is the deliverable.
10. **Register lanes** in `docs/agents/lanes.md` before unleashing agents —
    a lane listing is what makes batch work a "standing approved proposal".
11. `npm run validate && npm test && npm run build` → 0 errors, then let
    the first lane commit seed entities.

## 4. The master prompt (paste to an agent)

The single most reusable asset is the *governance text*. Replace the
bracketed parts and hand this to any capable agent:

```text
You are an agent building <NAME>, an open, free, all-digital museum of
<DOMAIN>, modelled on the islam.museum repository
(github.com/amado2k5/islam-museum) — read its AGENTS.md, docs/ai-change-gates.md,
docs/agents/workflow.md and docs/plan/02-content-model.md first; copy the
pattern, not the content.

Mission: a knowledge graph in git published as a static site.
- Facts: data/<class>/<slug>.yaml (language-neutral, CC0). Prose:
  content/<lang>/<class>/<slug>.md (CC BY-SA). IDs immutable; renames via aliases.
- Static only: no servers, no database, no AI or compute at runtime.
  Everything dynamic is precomputed at build (search index, related items,
  timelines, maps).
- Every entity cites sources; every dated fact needs two sources or a flag.
  Dates: EDTF + <calendar(s) for your domain> + precision; never invent a date,
  quote or citation.
- <PRIMARY LANGUAGE> is written first; <other languages> ship as translations
  in the same commit.
- Relations use a predicate registry (schema/predicates.yaml): each edge
  written once, inverses computed. Reuse before creating; duplicates → aliases.
- AI output is always status.review: draft with a provenance block
  (generated_by, model, run, source). Never mark anything reviewed/verified.
- Voice: warm, precise, neutral docent. Describe, never prescribe. Contested
  topics carry a labelled perspectives block, no verdict. <Add your domain's
  stance rule, e.g. "mainstream scientific consensus is the default frame;
  dissent is labelled before stated".>
- Media only from a licence whitelist; <add domain-specific prohibitions>.
- WCAG 2.2 AA; every page readable without JavaScript; alt text required.

Process (all in the repo):
1. Write docs/plan/01-vision, 02-content-model (classes + predicates),
   03-architecture (reuse the islam.museum stack: Astro + Svelte islands +
   Tailwind logical-CSS + Pagefind + MapLibre/PMTiles + Sigma.js + R2/CF Pages),
   05-editorial, 06-roadmap (phases + seed lists + exit criteria).
2. Fork the islam-museum repo. Delete data/** and content/** bodies (keep
   _stubs.yaml and templates/). Write schema/<class>.schema.json per class
   on _base; rewrite predicates.yaml and enums/; replace Islam-specific
   validator rules with our domain invariants — the validator IS our editorial
   policy, executable.
3. Keep the governance files (AGENTS.md, ai-change-gates.md, docs/agents/):
   rewrite scope/language/sources policies for our domain; keep proposal/
   merge/quality/attribution gates and the AI-Agent/AI-Model/AI-Editor
   trailers verbatim — they are vendor-neutral law.
4. Get npm run validate, npm test, npm run build to 0 errors on an empty
   corpus, then open the first lane (registry in docs/agents/lanes.md): seed
   the ~<N> anchor entities of the domain, ≤25 per batch, draft + provenance,
   coverage regenerated every commit.

Do not start authoring entities until the plan docs and schema exist.
Push small validated commits; explicit paths; never git add -A.
```

## 5. Variations the template supports

| Variant | What changes |
|---|---|
| Single-language project | Drop the ar/en/ur rule to one language; keep the prose/facts split anyway (it future-proofs translation) |
| No-AI / human-only project | Keep everything; the gates degrade gracefully into normal editorial workflow (provenance = author credit) |
| Non-museum knowledge app (field guide, legal corpus, standards registry, family archive, course knowledge base) | Same graph+prose+static pattern; classes and predicates are the only real design work |
| Small project (<5k entities) | GitHub Pages alone suffices; skip R2/worker complexity; keep validate+derive+astro |
| Private corpus | Private repo + CF Pages still works; note GitHub Actions free minutes differ; keep the structure identical |
| Live data needed | Violates the ADR — resist it; precompute nightly instead (a scheduled deploy preserves the whole architecture) |

## 6. Honest cost of cloning

The scaffold transfers in days, not weeks — but the **plan documents are
the real asset**: a weekend writing your domain's 01/02/05/06 determines
whether the agents produce a museum or a mess. The validator rules are the
second investment: generic schema checks port in an hour; *your domain's
executable editorial policy* (what must be cited, labelled, forbidden) is
the work that makes output trustworthy. Budget: ~1–2 days scaffold, ~1 week
content-model + plan + validator rules, then lanes run themselves.

## 7. Licence note

Code: MIT — fork freely, keep attribution. Data: CC0. Prose: CC BY-SA 4.0 —
the museum's own prose may not be silently rebranded; either keep the
licence + attribution or write your own (recommended for a new project).
The *documents* you're reading (plan, agents, engineering) are part of the
code side (MIT): adapt them freely.
