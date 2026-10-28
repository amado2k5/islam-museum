# Timeline Explorer: the story pipeline, and how Claude and Devin add stories in parallel

Status: adopted 28 October 2026 (founder request). Read with `DESIGN.md` (decisions, §9 shared notes) and `docs/site/README.md` (Timeline Explorer section).

## 1. What we take from TimelineThis, and how it maps here

From the TimelineThis demo (Sept 2025) the experience rests on four visual things:

| TimelineThis | islam.museum Timeline Explorer |
|---|---|
| A full-bleed picture behind the stage that changes with each event | A **pre-rendered backdrop per node**, crossfading as you travel (`/media/time-browser/explorer/<node-slug>.webp`) |
| A picture at the top of "Read Details" | The **same image at the top of Full details**, with alt text in ar/en/ur |
| Kids mode swaps the picture to cartoon art and rewrites the text | The **Kids toggle swaps to a picture-book backdrop** (`<node-slug>-kids.webp`) and to the record's own `kids` text where it exists |
| Sidebar of people, wars, topics, sources | The rail: about, related people, events and places, sources (change per node), explore more |

What we do differently, by rule: everything is prepared before deployment. No model runs when a visitor reads; no image is fetched from another site; no "Ask AI". Pictures never show people (no faces, no figures, no text), in both styles, so no image can depict a prophet or a Companion and none is a portrait. Places, buildings, landscapes, objects and animals only.

## 2. The pipeline, end to end

All of it runs on the founder's MacBook Pro (M4 Max). Model sessions (Claude, Devin) only drive it.

```
scripts/explorer-subjects/<class>-<slug>.json      one file per story (who owns it, kind, journey flag)
        │
data/…  content/…  (existing records: people, events, places, sources, prose ar/en/ur, kids text)
        │  npm run graph
.cache/graph.json
        │  npx tsx scripts/time-browser-explorer.ts           (also in prebuild)
.cache/time-browser/explorer.json, explorer-index.json      ordered, cited nodes per story
        │  npx tsx scripts/time-browser-explorer-images.ts --subject <id>
.cache/time-browser/explorer-image-jobs.json                 prompts for nodes without images
        │  HF_HOME=/Volumes/exmicroSD/hf-cache ~/tb-img-venv/bin/python scripts/time-browser-explorer-gen.py <jobs> --agent <name>
site/public/media/time-browser/explorer/<node-slug>.webp, <node-slug>-kids.webp
        │  npm run build   (pages read the JSON and the files at build time)
/<lang>/time-browser/s/<class>/<slug>/                       the stage, fully static
```

- **Eligibility.** A node ships when its record meets the publication standard: cited, defined sources, recorded provenance (`npm run cite-check -- <id>` passes). The draft flag is never shown. A story needs at least 4 such nodes.
- **Order.** Nodes are sorted by date; the build fails on an inversion or an uncited node.
- **Images.** Optional per node. A node without its own Explorer image falls back to Devin's illustration for the same record (`/media/time-browser/images/<class>-<slug>.webp`), else a colour wash. A story ships without images and gains them later.
- **Maps.** The stage map is drawn at build time from place coordinates (`MiniMap.astro`); add coordinates (with a source and a ledger record) to make a node mappable.

## 3. One story, end to end (the recipe)

Each step names the files it touches. A story never touches another story's files.

1. **Claim it.** Append one line to `time-browser-plan/claims.md`: `<date> | <subject id> | <agent> | claimed`. Check nobody else claimed it. One subject, one owner.
2. **Reuse first.** Search `data/` and `content/` for the subject and its people, events and places. Reuse every record that exists; enrich instead of duplicating (`AGENTS.md`: duplicates become aliases).
3. **Fill gaps from sources.** Use Chrome on the Mac (Britannica and UNESCO are registered trusted sites; Wikipedia facts need a ledger record with the revision). Add missing records (`data/<class>/<slug>.yaml`) with ar/en/ur prose (`content/<lang>/<class>/<slug>.md`), sources and provenance. Dates as EDTF + Hijri; conversions marked derived.
4. **Link the story.** For a person, list life events as `participated_in` relations in the person's own record (these come first in the story). For an era, set `periods` on the events. For a place, set `occurred_at` on the events (or `regionPlaces` in the subject file).
5. **Kids text (optional).** Add `kids: { ar, en, ur }` to the records, short and cited like the adult text. Never machine-simplified at runtime.
6. **Subject file.** Add `scripts/explorer-subjects/<class>-<slug>.json`: `{ "id", "kind", "journey", "owner" }`.
7. **Build the data.** `npm run graph && npx tsx scripts/time-browser-explorer.ts` — the story must appear with ≥4 nodes.
8. **Images.** `npx tsx scripts/time-browser-explorer-images.ts --subject <id>`, then run the generator (above). It skips files that exist, so it can be stopped and restarted.
9. **Check locally.** `npm run validate`; `npm run cite-check -- <subject and node ids>`; `npx vitest run scripts/time-browser*.test.ts`; dev server (`cd site && npx astro dev --port 4321`) and look at `/ar/time-browser/s/<class>/<slug>/` in Chrome, with a screenshot.
10. **Ship.** Branch `explorer/<slug>-<agent>`, commit explicit paths only (records, prose, subject file, images), PR, merge once checks pass. Append a line to `time-browser-plan/claims.md` (`done`) and to `DESIGN.md` §9.

## 4. Working in parallel without stepping on each other

| Area | Owner | Rule |
|---|---|---|
| `scripts/time-browser*.ts`, `scripts/time-browser-explorer-gen.py`, `site/src/**/time-browser/**`, `site/src/lib/explorer.ts`, `ExplorerModule.astro` | Claude | Devin proposes changes in `DESIGN.md` §9; does not edit |
| `scripts/time-browser-media*`, `scripts/time-browser-maps.ts`, `scripts/time-browser-cards.ts`, `site/public/media/time-browser/{images,cards,maps}/` | Devin | Claude proposes changes in §9; does not edit |
| `scripts/explorer-subjects/<file>` | the claiming agent | one file per story; never edit another agent's file |
| `site/public/media/time-browser/explorer/<node-slug>*.webp` | the agent whose story the node is in | file names are unique per node; a node shared by two stories is generated once, by whoever gets there first (the generator skips existing files) |
| Records under `data/`, `content/` | whoever adds or enriches | append-only edits; merge both sides on conflict (`docs/ai-change-gates.md` §4) |
| `time-browser-plan/DESIGN.md` §9, `time-browser-plan/claims.md` | both | append-only; on a merge conflict keep both lines |
| `docs/coverage.md` | both | regenerate with `npm run coverage` in the same commit as entity changes |

- **GPU.** One Apple GPU. Two generator queues can run at once but each runs slower; prefer to start a queue only when the other agent's queue is finished (check `ps aux | grep -E "gen_queue|explorer-gen"` and the other agent's log).
- **No shared lists.** Nothing in this pipeline needs a central list: subjects, images and claims are one file or one line each.
- **Branches.** One story per branch and PR. Fetch and merge `origin/main` before every push; never force-push.

## 5. Logging and status

- Every step appends one line to `.time-browser-logs/<agent>.log` (git-ignored): `ISO-time | <story or phase> | action | result | next`. The generator logs one line per image.
- Every merged story appends one line to `DESIGN.md` §9 and updates its line in `claims.md`.
- Every 10 minutes each agent reads `DESIGN.md` §9 and `claims.md` for new lines, blockers or requests addressed to it, and answers there.
- To report status to the founder: tail the last 50 lines of the log, then say what is done, what is running, and what is blocked, per story.

## 6. Deployment

Deployment stays the founder's action (`AGENTS.md`). Before deploying:

1. `npm run validate` (0 errors), `npm test`, `npm run build` (check:site 0 errors, check:weight 0 over budget).
2. Images live in `site/public/media/time-browser/` and are published to R2 with the rest of `media/` (founder rule of 28 Oct 2026: Pages holds code and logic only). A new data or media folder is added to `R2_DATA_DIRS` in `workers/site/src/route.js` and the lists named in `docs/engineering/06-deployment.md` "What goes where".

## 7. Prompt for Claude (copy into a new Claude session)

> You are adding stories to the islam.museum Timeline Explorer. Read `AGENTS.md`, `time-browser-plan/EXPLORER-STORY-PIPELINE.md` and `time-browser-plan/DESIGN.md` §9 first. Work in your own git worktree. Do all work on the founder's Mac: scripts, the dev server, local SDXL image generation, and Chrome for source research; keep model tokens for reading results and deciding. Pick the next unclaimed story from this list, claim it in `time-browser-plan/claims.md`, and complete it end to end with the recipe in §3: reuse existing records first, fill gaps from trusted sources with citations and provenance, link the events, add the subject file, build, generate images, check locally with a Chrome screenshot, and ship one PR per story. Never edit files that §4 assigns to Devin, never edit another agent's subject file, never add runtime AI, and never show people in images. Append one line per step to `.time-browser-logs/claude.log`. Every 10 minutes read `DESIGN.md` §9 and `claims.md` and answer anything addressed to Claude there. When blocked by Devin, write the blocker in §9 and move to another story.
> Stories for Claude, in order: Ibn Khaldun (needs ≥4 dated events), Khalid ibn al-Walid, Harun al-Rashid, Ibn Battuta, Ibn Sina, Umayyad Damascus, Fatimid Cairo, the Mamluks.

## 8. Prompt for Devin (copy into Devin)

> You are adding stories to the islam.museum Timeline Explorer. Read `AGENTS.md`, `time-browser-plan/EXPLORER-STORY-PIPELINE.md` and `time-browser-plan/DESIGN.md` §9 first. Run everything on the founder's Mac: scripts, the local SDXL queue (`scripts/time-browser-explorer-gen.py`), the dev server, and Chrome for source research. Pick the next unclaimed story from this list, claim it in `time-browser-plan/claims.md`, and complete it end to end with the recipe in §3. You own `scripts/time-browser-media*`, maps and cards; Claude owns the Explorer scripts and pages (§4) — propose changes to those in §9, do not edit them. Never edit another agent's subject file, never add runtime AI, never show people in images. Append one line per step to `.time-browser-logs/devin.log`. Every 10 minutes read §9 and `claims.md` and answer anything addressed to Devin. Before starting an image queue, check that Claude's queue is not running; if it is, do the data steps first.
> Stories for Devin, in order: the Ottomans (Mehmed II and Constantinople), Mughal Delhi, Ibn Rushd, al-Biruni, al-Khwarizmi, Abbasid Baghdad's House of Wisdom, Cordoba's Great Mosque, the Seljuks.

## 9. Images already made, and how they are reused

- Devin's 960+ SDXL illustrations under `site/public/media/time-browser/images/` (one per record, no people) are the fallback backdrop for any node whose record has one, with no extra work.
- The 470 whitelisted museum images (V&A objects, CC0 illustrations) are not used as backdrops: they show single objects, not scenes. They stay on the entity pages.
- New Explorer images are wide scenes (1024×640) per node, adult and kids, generated from the node's own title, place and year, so the same image works for the stage and Full details.
