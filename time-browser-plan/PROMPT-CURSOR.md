# islam.museum — Timeline Explorer onboarding (Cursor agent)

You are joining an ongoing multi-agent effort on the islam.museum repository. Read everything below before touching a file.

## 1. Repos, branches, worktrees

- Main repo: `/Users/ahmedabdelaal/Documents/GitHub/uber_eats/islam-museum`
- Use the dedicated worktree for this work: `/Users/ahmedabdelaal/Documents/GitHub/uber_eats/islam-museum-time-browser` (exists already). If missing, create: `cd <repo> && git worktree add ../islam-museum-time-browser main`
- Work ONLY in that worktree. Never touch `islam-museum-mawsua-*` or other sibling worktrees — other agents live there.
- One branch per story, named `explorer/<slug>-cursor` (e.g. `explorer/zanzibar-cursor`). Always branch from fresh `origin/main`: `git fetch origin && git checkout -B explorer/<slug>-cursor origin/main`.
- `main` accepts pull requests only — no direct pushes, no force-push.

## 2. Required reading (do it first, in the worktree)

1. `AGENTS.md` — the binding rulebook.
2. `docs/ai-change-gates.md` — binding change gates.
3. `docs/agents/README.md` → `workflow.md`, `content-standards.md`, `publication-standard.md`, `lanes.md`.
4. `time-browser-plan/EXPLORER-STORY-PIPELINE.md` — the recipe you will follow.
5. `time-browser-plan/DESIGN.md` §9 — open items and agent coordination notes.
6. `time-browser-plan/claims.md` — shared claims file; check who's working on what.
7. `time-browser-plan/COVERAGE.md` — current coverage snapshot and method.

## 3. Your assignment

Five Timeline Explorer **place stories**, in this order:

1. Zanzibar (`data/place/zanzibar.yaml` exists)
2. Tunis
3. Algiers
4. Ceuta (`data/place/ceuta.yaml` exists)
5. Bukhara expansion (`place/bukhara` is live with only 4 nodes — enrich, don't duplicate)

One story = one PR. Do all data work for a story, verify, merge its PR, then move to the next.

## 4. How a story works (the recipe)

The Explorer (`npx tsx scripts/time-browser-explorer.ts`) builds `.cache/time-browser/explorer.json`. A subject appears only with **≥4 dated, cited nodes** — a dated, cited event record with `date.start.edtf`, `sources: [source/...]`, a `provenance` block, and `label.ar` + `summary.ar` (Arabic first; English and Urdu always — the museum voice is trilingual).

Per story:

1. **Claim it immediately**: append `YYYY-MM-DD | place/<slug> | cursor | claimed` to `time-browser-plan/claims.md`, commit, push, open a PR titled `chore: claim <slug>`, merge it. This stops other agents (Claude, Devin) from picking the same subject.
2. **Reuse before you create.** Search `data/event/` for events mentioning the city (`ls data/event | grep -i <city>`), check `grep -rln "place/<slug>" data/event/`. Wire existing dated events to the city with an `occurred_at` edge.
3. **Create subject file**: `scripts/explorer-subjects/place-<slug>.json` → `{"id":"place/<slug>","kind":"place","journey":false,"owner":"cursor"}`. Never edit another agent's subject file (check the `owner` field).
4. **Fill to ≥4 nodes** by adding `occurred_at: place/<slug>` to existing events or creating new event records.
5. **Places need `coordinates:`** — get them from GeoNames (`geonames.org` in the founder's Chrome or `curl`) and cite `source/geonames-gazetteer` in the record's `sources`.

## 5. Data rules that always apply

- **IDs**: `class/slug`, immutable; never rename — use `aliases: [<old-id>]`.
- **Duplicates become aliases of the richer record** — never delete blindly, never create a second record for a thing that exists (check `data/place/` for slug variants first: e.g. `tarabulus-gharb` vs `tarabulus-al-gharb` was a real duplicate pair).
- **Dates**: `edtf` + `hijri` + `calendar: julian` + `precision` + `status: tradition` + `derived: true` when converted. Every event needs a **CE `edtf`** — Hijri-only dates do not appear in the Explorer. Example:
  `start: { edtf: "1268-02~", hijri: "0666-05", calendar: julian, precision: month, status: tradition, derived: true, note: "...", sources: [source/...] }`
- **Sources**: `sources: [source/<slug>]` must point to records in `data/source/`. Use existing ones: `source/tarikh-islam-hasan-ibrahim`, `source/tarikh-ibn-khaldun-ibar`, `source/kamil-ibn-al-athir`, `source/shadharat-dhahab`, `source/khitat-maqrizi-1998`, `source/futuh-buldan-maarif-1407`, `source/tabari-tarikh-abu-al-fadl`, `source/mujam-al-buldan-yaqut`, `source/geonames-gazetteer`. If none fits, create the source record first. Never invent a quote, page, date or citation.
- **Provenance** on every touched record: `provenance: { layer: own-research, source: "...", generated_by: "Cursor", run: explorer-<slug> }` — many existing records fail the Explorer bar only because they lack this block; backfilling it is allowed and encouraged.
- **Enums must match**: `regions`, `periods`, event `kind`, place `kind` come from `schema/enums/` — check existing records for valid values (e.g. `maghreb` not `north-africa`; `egypt-nile` not `egypt-sudan`; event `kind` has no `journey`; place `kind` has no `fortress` — use `site`).
- **YAML pitfalls that repeatedly break the build**: a file may only have ONE `relations:` block — merge edges into the existing block (match its style: `- { type: ... }` inline vs `- type:` block form). A duplicate key anywhere kills `npm run graph`.
- **Voice**: warm, precise, neutral docent; describe, never prescribe; no honorifics typed (the UI renders them); Arabic first.

## 6. The wiring pattern that works (copy this)

```python
# add occurred_at to an event lacking it — pick the insertion style by what exists:
if 'relations:\n- type:' in s:
    s2=s.replace('relations:\n- type:', 'relations:\n- type: occurred_at\n  target: place/<slug>\n  sources:\n  - source/<src>\n- type:', 1)
elif 'relations:' in s:
    s2=s.replace('relations:\n', 'relations:\n  - { type: occurred_at, target: place/<slug>, sources: [source/<src>] }\n', 1)
else:
    s2=s.replace('wings:', 'relations:\n  - { type: occurred_at, target: place/<slug>, sources: [source/<src>] }\nwings:', 1)
# ALWAYS yaml.safe_load(s2) before writing
```

## 7. Build & verification loop

Run in the worktree, in order:

```
npm run graph                      # builds .cache/graph.json — watch for DUPLICATE_KEY / parse errors
npx tsx scripts/time-browser-explorer.ts   # expect "… subjects, … nodes" and your subject listed
python3 -c "import json; [print(len(s['nodes']), [n['id'] for n in s['nodes']]) for s in json.load(open('.cache/time-browser/explorer.json'))['subjects'] if '<slug>' in s['id']]"
npm run validate                   # must be 0 errors (warnings OK)
npm test                           # all suites pass
npm run coverage                   # regenerates docs/coverage.md — include it in the same commit
```

A subject skipped logs `time-browser-explorer: skipped place/<slug> (N dated, cited nodes)` — debug which events lack date/sources/provenance.

For visual verification you may start the site dev server and screenshot the Explorer page in Chrome.

## 8. Commit, push, PR, merge

- Commit explicit paths only — never `git add -A`.
- Every commit ends with:
  ```
  AI-Agent: Cursor
  AI-Model: <your model name>
  AI-Editor: Cursor
  ```
- Conventional messages: `feat(time-browser): Zanzibar story — N nodes`, `fix(time-browser): …`, `chore: claim <slug>`, `docs(time-browser): …`.
- Push: `git push -u origin explorer/<slug>-cursor`
- PR: `gh pr create --title "feat(time-browser): Zanzibar story — N nodes" --body "what changed, node count, sources used"`
- **Merge your own PR immediately** — `gh pr merge <num> --merge`. The founder has instructed: never wait on CI/review; merge and keep moving. If `not mergeable` → `git fetch origin && git merge origin/main --no-edit && git push && gh pr merge <num> --merge` again.
- Before EVERY push: `git fetch origin` and review what changed on main — other agents land work constantly. Merge their changes into yours; never ignore, discard or revert another agent's work. If you're unsure about anything on main, ask the founder before acting — **never reject or delete anything without asking first**.

## 9. Logging & reporting

- Append one line per meaningful step to `.time-browser-logs/devin.log` (shared log; append-only), format: `<UTC ISO> | place/<slug> | <step> | <result>`.
- Keep `claims.md` current (claimed → done).
- Report progress to the founder after each story: subject, node count, what was created vs reused, PR number.

## 10. What NOT to do

- No runtime AI, model calls, servers, databases, or remote media requests on the published site — it is 100% static (Cloudflare Pages + R2).
- Do not touch `site/` Explorer scripts/pages owned by other agents — propose changes in `DESIGN.md` §9 instead.
- Do not modify schema/enums, validators, or tests to make errors pass — fix the data.
- Do not run `deploy.yml` or any deployment — the founder deploys manually.
- Do not edit `workers/` (Cloudflare Worker routing, R2 publishing) unless explicitly asked. Data/content/map/media directories under `site/public/` sync to R2; code lives on Pages — if you add a new top-level data/media folder it must be registered in `workers/site/src/route.js` (`R2_DATA_DIRS`/`ROOT_FILES`) and `deploy.yml` — flag it to the founder rather than editing silently.
- No JavaScript requirement for reading pages; no figurative depictions of prophets/Companions; no AI-generated portraits; no people in generated imagery.
- No new `.yaml` under `content/` (prose) and no `.md` prose under `data/` — facts in `data/`, prose in `content/<lang>/`.
- Do not lower a validation rule, skip a test, or add crash guards to hide bad data.

## 11. Machine resources (founder's Mac)

- Chrome is available for research (GeoNames, encyclopaedia lookups, source verification).
- Apple Vision OCR may be used to read local scanned book pages if the founder provides them.
- For audio/video transcription or heavier local models the founder has a local AI stack — **ask first before installing anything**; once permitted, install via Homebrew.
- **Entity writing and analysis must use YOUR model inside Cursor**, not the founder's local models — the founder's instruction.
- A microSD may hold source scans; if a task needs it, ask the founder for its mount path rather than guessing.
- Local SDXL image generation exists (`scripts/time-browser-explorer-gen.py` + job JSON) — do NOT start a queue without checking `ps aux | grep explorer-gen` for running queues; the shared GPU serializes.

## 12. Multi-agent etiquette

Devin (Cognition) and Claude work the same tree. Their lanes: Devin owns media/maps/cards scripts; Claude owns Explorer scripts/pages. You own: nothing global — only your claimed subjects, your branches, your log lines. Shared files are append-only. When in doubt, ask the founder.
