# islam.museum: instructions for every agent

This file is the single entry point for every AI agent, model, tool or human collaborator working on this repository, whatever the vendor, product or model. `CLAUDE.md`, `GEMINI.md`, `.kiro/steering/`, `.github/copilot-instructions.md` and `.cursor/rules/` are one-line pointers to this file; edit rules here and nowhere else.

islam.museum is an open, free, all-digital museum of Islam: the faith, civilization, peoples, places, ideas, objects, texts and living culture, from the world Islam was born into until today. It is a knowledge graph in git (`data/<class>/<slug>.yaml` for language-neutral facts, `content/<lang>/<class>/<slug>.md` for prose) published as a static site.

## Read, in this order

1. This file (the rules that never bend).
2. `docs/agents/README.md` (index of the agent documents), then the one or two you need:
   - `docs/agents/workflow.md`: how to set up, commit, push, merge, hand off.
   - `docs/agents/content-standards.md`: what a good entity looks like and the mistakes to avoid.
   - `docs/agents/mining-sources.md` (+ `docs/agents/categories/`): how to turn a book into entities.
   - `docs/agents/lanes.md`: who works on what, the lane for your task, how to open a new lane.
   - `docs/site/README.md`: how the site is built, the design and accessibility rules, the date and timeline rules, and every automated check. Read it before any change under `site/` or to a date.
3. `docs/status.md` (live state, ownership) and `docs/plan/` (the section you implement; key ones: 01-vision, 02-content-model, 05-editorial, 06-roadmap, 09-ai-content-pipeline, 13-figures, 14-themes-atlas, 15-local-harvest).
4. Two existing entities of the class you will write, from different authors, and copy their shape. `data/event/expedition-of-al-sawiq.yaml` with `content/ar/event/expedition-of-al-sawiq.md` is the gold example for events.

## Rules that never bend

- **Static, no AI at runtime.** Static site on GitHub Pages behind Cloudflare; no servers, no databases, no paid services. Models are used only in the building phase; nothing on the published site calls a model or any server code per visitor (`docs/plan/03-architecture.md` §13, ADR 0002). Astro + Svelte islands + Tailwind; TypeScript scripts; Pagefind; MapLibre + PMTiles; Sigma.js.
- **Graph in git.** IDs are `class/slug`, immutable; renames go through `aliases`. Relations use `schema/predicates.yaml` only; write each edge once (inverses are computed). Reuse before you create; a duplicate becomes an alias of the richer entity.
- **Sources.** Every entity cites sources; every dated fact needs two sources or a flag. Wikipedia and Wikidata are pointers, not sources. Never invent a date, quote, page number, ISBN or citation. Dates: EDTF + Hijri string + calendar + precision; conversions marked derived.
- **Arabic first** (`docs/language.md`). Phase 1 content, UI, alt text, maps and questions are Arabic only; English comes in Phase 4. `label.ar` and `summary.ar` are required; new prose goes in `content/ar/`.
- **Voice and scope.** A warm, precise, neutral docent: describe, never prescribe, no rulings, no sermon voice. Sunni Islam is the default and main frame, and research starts from Sunni sources (`docs/scope.md`); any other view is welcome and must be labelled before it is stated. Contested topics use the `perspectives` block: Sunni position(s) first, then the academic view, then any other view, each cited and labelled, no verdict. Never write "enemy of Islam" or an equivalent in the museum's voice: describe the act and attribute the judgement. A person's faith is recorded only with its basis, never inferred. Opponents, critics and allies are included with time-scoped `story_roles`. Hard questions are tension cards with at least two cited voices and no verdict.
- **No honorifics typed anywhere** (not ﷺ, not «صلى الله عليه وسلم», «عليه السلام», «رضي الله عنه», «رحمه الله»): the UI renders them. The validator rejects them.
- **Qur'an text is never typed, completed or corrected.** It comes only from the frozen Tanzil files and is referenced as `[[passage/quran-<sura>-<aya>|label]]`. The validator rejects ﴿ ﴾ in prose.
- **Prose only in `content/<lang>/<class>/<slug>.md`; data only in `data/<class>/<slug>.yaml`.** Never a `.yaml` under `content/`.
- **Licences.** Prose CC BY-SA 4.0, data CC0, code MIT. Third-party content keeps its own licence. Media only from the whitelist in `schema/enums/licenses.yaml`; no figurative depictions of prophets or Companions; no AI-generated portraits. **Sources** (`docs/sources-policy.md`, founder's standing rule of 15 Oct 2026): any source may be read, copyrighted or not, and its content rewritten in the museum's own words with a citation to the source and page; facts enter `data/` from any source. What stays out of git: verbatim text beyond a 40-word cited quotation, the source files themselves (PDFs, OCR text, page images, claims tables, dumps) and un-whitelisted media.
- **AI output is draft.** It enters as `status.review: draft` with a `provenance` block (`generated_by`, `model`, `run`, `source`). Never mark anything `reviewed` or `verified`.
- **Accessibility.** WCAG 2.2 AA; alt text required; no JS needed to read a page.
- **Checks before you push.** `npm run validate` (0 errors) and `npm test` (all pass); `npm run build` for any site change. Fix what fails; never lower a rule, skip a test or add a crash guard to hide bad data.

## Working together (details in `docs/agents/workflow.md`)

- Several agents work in parallel. **Never ignore, discard or revert another agent's work.** Fetch and review what is new on `origin/main` before you start and before every push, then merge it with yours; duplicates become aliases; nothing is deleted blindly.
- One git worktree or clone per session, never a shared folder; commit explicit paths (never `git add -A`); never force-push; never commit `node_modules`, PDFs, OCR text, page images or large files.
- Push small, validated commits to `main` often (work can be lost if you run out of credit or time), and keep your lane's progress file current.
- Shared files (`data/_stubs.yaml`, `data/_stubs.d/*`, `docs/status.md`, enums) are append-only: never replace one wholesale. Your own stubs go in your own `data/_stubs.d/<lane>.yaml`.
- **Every agent commit ends with attribution trailers** `AI-Agent:`, `AI-Model:` and `AI-Editor:` (truthful; `unknown` if you cannot tell), and the same facts go in each entity's provenance. See `docs/agents/workflow.md`.
- **Totals stay current.** Every check-in that changes entities, stubs or edges regenerates `docs/coverage.md` with `npm run coverage` in the same commit (never hand-edit it). See `docs/agents/workflow.md` section 4.
- Commit and push validated work without waiting for anyone's sign-off (founder's standing permission, `docs/sources-policy.md` §5); conventional commit messages; at most 25 entities per content batch.
