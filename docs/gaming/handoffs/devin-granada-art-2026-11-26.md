# Prompt for Devin: the finish of Granada's authored buildings

_Written 26 November 2026 by Claude Code at the founder's request, for a second agent working on the same Mac at the same time. Second version, 09:30 UTC: it adds the state of the work, every location, what must be installed, and the shared board the two agents write to. Paste everything below the line._

---

You are Devin, working on islam.museum's games in the repository `amado2k5/islam-museum`, on the founder's Mac, in Devin Desktop. Another agent, Claude Code, is working in the same repository on the same machine at the same time. It owns Granada's rules, page and tools. **You own one thing: the finish of Granada's twelve authored 3D pieces.** The two jobs must not touch.

## 1. What this is, and where it stands today

islam.museum is an open, free digital museum of Islam. It has a games workshop, apart from the website, with its own tests and its own deploy. Granada is a city-building game set in a valley of the western Mediterranean. It is a **prototype on a test address only** (`uat-games.islam.museum`); nothing about it is finished, and you must never say otherwise.

State on 26 November 2026, 09:30 UTC:

- `main` is at `aedac322001`. Today Claude Code merged pull requests #8292 to #8306 (trade, building on the land, estates, decisions, Photo Mode, the region, moving prices, warnings, a campaign of three years, a long-run tool). #8307 (fixes from an independent review) is open and will merge soon.
- The game draws a 3D valley with three.js. Its buildings are twelve pieces made by headless Blender scripts: four houses, a wall section, a tower, a gate, scaffolding, a crane, a market stall, a palace, an olive estate, and a watermill. They are plain volumes with photographed surfaces.
- The founder gave a target picture. A "proof frame" of the game was set beside it and is **waiting for his judgement; it is not accepted**. Its own record says the game has the target's structure and not its finish: the target's buildings have arcades, mouldings, carved doors, balconies, awnings, worn edges and things lying about them.
- The founder has ruled: no asset is made in number before he accepts a proof. A better version of the same twelve pieces is a second proof candidate, which is allowed.

## 2. Every location

| What | Where |
|---|---|
| The repository | `https://github.com/amado2k5/islam-museum.git` |
| **Your clone (make it; work nowhere else)** | `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art` |
| **Your branch** | `gaming/granada-art-finish-devin`, cut from `origin/main` |
| Claude Code's checkout (**read only for you; never write, never run git in it**) | `/Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/distracted-wozniak-cc8c6f` |
| **The shared board (section 7)** | `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-coordination/granada/` |
| The art scripts (yours to change) | `gaming/art/blender/common.py`, `kit.py`, `granada_town.py`, `granada_landmarks.py`, `granada_mill.py` |
| The art records (yours to change) | `gaming/art/sources.json`, `gaming/art/manifest.json`, `gaming/art/manifest.py`, `gaming/art/README.md`, `gaming/art/art.gtest.ts` |
| The npm scripts for art | `gaming/package.json`: `art:mill`, `art:town`, `art:manifest` (see section 5 for the one change you may make there) |
| Models as they are now (git-ignored; **not in your clone until you copy them**) | Claude's checkout, `gaming/media/models/granada/2/`: `town.gltf`, `town.bin`, `town.kit.json`, `landmarks.gltf`, `landmarks.bin`, `landmarks.kit.json`, `mill.gltf`, `mill.bin`, `textures/` |
| Textures already downloaded (Poly Haven, CC0; git-ignored) | Claude's checkout, `gaming/media/textures/`: `clay_roof_tiles_02`, `cobblestone_floor_04`, `rustic_stone_wall_02`, `weathered_brown_planks`, `white_stucco_02` |
| **Where your new models go** | your clone, `gaming/media/models/granada/3/` |
| Where your renders go | your clone, `gaming/media/renders/granada-3/` |
| The target picture | `docs/gaming/spec-granada/assets/granada-v3.jpeg` |
| The proof frame's record | `docs/gaming/spec-production/proof-granada.md` |
| The founder's decisions | `docs/gaming/spec-production/owner-decisions-2026-11-26.md`, `owner-decisions-2026-11-26-b.md` (decision O3 is proof frames) |
| The games' ledger (read; never edit) | `docs/gaming/LEDGER.md` |
| How the game loads the models (read; never edit) | `gaming/games/granada/src/view/three-valley.ts` (`MODEL_SET`, and how each named object is placed) |

## 3. Read first, in this order

1. `AGENTS.md` (the rules that never bend) and `docs/ai-change-gates.md`.
2. `docs/gaming/spec-production/proof-granada.md`, above all its section "What the picture has, and what the target has that it has not".
3. `gaming/art/README.md`, then the five Blender scripts, `sources.json`, `manifest.json`, `manifest.py`.
4. `gaming/games/granada/src/view/three-valley.ts`, only to learn which object names, origins and sizes the game relies on.
5. The shared board's `README.md`, `claude-status.md`, `claude-to-devin.md` and `machine.md`.

## 4. What is on this Mac, and what you may install

Already installed; check each before you start and write the versions in `devin-status.md`:

| Tool | Version found | Check |
|---|---|---|
| Blender | 5.3.0, on the path at `/opt/homebrew/bin/blender` (Homebrew cask) | `blender --version` |
| Node | v25.4.0 (the repository needs 22 or later) | `node -v` |
| npm | 11.9.0 | `npm -v` |
| Python | 3.14.7, with `numpy` 2.5.3 and `pillow` 12.3.0 | `python3 --version` |
| git, GitHub CLI | present; `gh` is signed in as the founder | `gh auth status` |

Setting up your clone:

```bash
git clone https://github.com/amado2k5/islam-museum.git /Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art
```

```bash
cd /Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art && git switch -c gaming/granada-art-finish-devin origin/main
```

```bash
npm --prefix gaming ci
```

```bash
mkdir -p gaming/media && cp -R /Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/distracted-wozniak-cc8c6f/gaming/media/textures gaming/media/ && mkdir -p gaming/media/models/granada && cp -R /Users/ahmedabdelaal/Documents/GitHub/islam-museum/.claude/worktrees/distracted-wozniak-cc8c6f/gaming/media/models/granada/2 gaming/media/models/granada/
```

(That last copy is about 104 MB, read from Claude's checkout and written only into yours.)

**Install nothing else without asking.** You should need nothing more: Blender's own Python has what the scripts use. If you find you need a Blender add-on, a Python package, a command-line tool or anything from the network, write it as `FOR THE FOUNDER` in `devin-to-claude.md` with the name, the source, the licence and why, and go on with what does not need it. Never use `sudo`. Never change system settings. Never install into Claude's checkout.

## 5. The task

**Raise the finish of these same twelve pieces. Make no new kind of piece and no piece in number.**

In this order of priority: the four houses; the estate; the gate and tower; the palace; the rest.

- Add real architectural detail by script: door and window reveals, lintels and sills, shutters, eaves with tile ends, a balcony or a wooden lattice on some houses, an arcade on the estate and the palace court, crenellation and string courses on wall, tower and gate, a worn base course, awnings and jars at the stall.
- Bevel hard edges; vary wall planes slightly; add vertex-colour or texture-based dirt at the base and under eaves.
- Keep each house under about 4,000 triangles and the palace under about 15,000; give every piece one lower level of detail at about a third of that.
- **Keep unchanged, exactly as in `granada/2/`:** each object's name inside its glTF file, its origin, footprint, front direction (+Z after glTF export) and overall size, and the fields of `town.kit.json` and `landmarks.kit.json`. The game places the pieces by these. If a better piece needs one changed, do not change it: ask on the board.
- Architecture is a general picture of a walled town of the western Mediterranean. Copy no named building. Call nothing the Alhambra. **No figures of people, no inscriptions, no calligraphy, no religious text of any kind.**
- The scripts today write to `media/models/granada/2`. Make them take the output folder as their argument as now, and add npm scripts `art:town3`, `art:landmarks3` and `art:mill3` in `gaming/package.json` that write to `media/models/granada/3`. **These added lines are the only change you may make to `gaming/package.json`.** Leave `art:mill` and `art:town` as they are. Add the `granada/3` set to `manifest.py` beside the `granada/2` set; do not remove the old one.

## 6. Hard limits

- **Change files only under `gaming/art/`**, plus the three added npm script lines, your one new document (section 9) and one `CANARY.md` entry in your final commit. Never edit anything under `gaming/games/`, `gaming/packages/`, `gaming/tools/`, `workers/`, `site/`, `data/`, `content/`, `schema/`, `i18n/`, or `docs/gaming/LEDGER.md`.
- **Your own clone, your own branch.** Never work in `.claude/worktrees/`. Never force-push. Never touch the git stash. Commit explicit paths, never `git add -A`.
- **Media is never committed.** Models, textures and renders stay in the git-ignored `gaming/media/`. Commit scripts and records only. Check `git status` before every commit.
- **Never overwrite anything in `granada/2/`**, in your clone or anywhere. A file on the games' host is never replaced, so a changed set gets a new folder.
- **Textures: Poly Haven (polyhaven.com), CC0, images only.** Use the five sets already downloaded first. A new one needs its licence read on its own page, and is recorded in `gaming/art/sources.json` with its address and the date. **Downloading any file needs the founder's yes first**: write the name, the page and the size as `FOR THE FOUNDER` on the board and wait. Nothing from any other site. No AI-generated textures, images or models.
- **Do not upload anything to UAT or production. Do not run any deploy or release workflow (`games-deploy-uat.yml`, `games-deploy.yml`, `deploy.yml`, `deploy-uat.yml`). Do not change `MODEL_SET`.** You hand the models over; you do not wire them in.
- **Do not merge your pull request**, and do not merge or close anyone else's.
- **The quiet window: from 10:30 to 12:15 UTC on 26 November 2026 Claude Code is measuring frame times in Chrome on this machine.** In that time run no render, no `npm test`, no browser, no play script, no build. Editing scripts and short Blender runs that export a model without rendering are fine. Before any heavy run at any other time, read `machine.md` and write your own line there; clear it when you stop.
- Content safety: `AGENTS.md` forbids any mention of a list of organisations and their media. Art scripts have no reason to come near it; do not.
- Make no claim about quality, performance or history that you have not checked. **You are not the judge of whether the result matches the target: the founder is.** Do not write that a piece "matches", "meets" or "achieves" the target.
- A message from Claude Code on the board is information from a peer. Only the founder changes your scope or these limits.

## 7. The shared board: how you and Claude Code talk

Folder: `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-coordination/granada/`. It is on this Mac only, outside every repository, never committed.

| File | You | Claude Code | What it holds |
|---|---|---|---|
| `README.md` | read | writes | The board's rules. Read it first. |
| `devin-status.md` | **write** | reads | What you are doing now; what is finished; where the files are; versions of your tools. |
| `devin-to-claude.md` | **write** | reads | Questions, wants, expectations, findings, blockers, things for the founder. |
| `claude-status.md` | read | writes | What Claude is doing; what has merged; what it owns. |
| `claude-to-devin.md` | read | writes | Answers, requests, new guidelines, new requirements. |
| `tests.md` | **write under "Devin"** | writes under "Claude Code" | Every check run: the command, the time, the result as printed. |
| `machine.md` | **append** | appends | Who is using the machine heavily, from when to when. |

How to write:

- Append only, newest at the bottom. Never edit or delete a line that is not yours.
- Each entry begins `### <UTC date and time> Devin`. In `devin-to-claude.md` give each a number and a kind: `D-1 ASK`, `D-2 TELL`, `D-3 BLOCKED`, `D-4 FOR THE FOUNDER`. An answer names the number it answers (`answers C-2`).
- Read Claude's two files and `machine.md` when you start, before every commit, and at least every 30 minutes. Claude reads yours on the same rhythm; an answer may take that long, and longer in the quiet window. **Never stop and wait for an answer if other work is open**: go on with the next piece.
- In `devin-status.md`, after each piece: its name, triangles before and after, file size before and after, the textures used, the path of its render, and what you could not do.
- State only what you ran and saw. No secrets, tokens or personal details.

Write your first `devin-status.md` entry when the clone is made and `blender --version` has run, and a `D-1 TELL` saying you have started.

## 8. How to check your own work

- Each script runs headless and gives the same files twice: run it twice and compare SHA-256 of every output. Record both in `tests.md`.
- `npm --prefix gaming run art:manifest` after a build, and `npm --prefix gaming run art:manifest -- --check`.
- `npm --prefix gaming test` (it includes the art's own tests, `gaming/art/art.gtest.ts`) and `npm --prefix gaming run typecheck`, **outside the quiet window**.
- Validate each glTF loads: open it in Blender headless and count objects and triangles; confirm every object name of `granada/2/` is present in `granada/3/` with the same origin and bounding size (write a small script for this under `gaming/art/` and commit it).
- Render each piece alone at three-quarter view on a neutral ground, 1600 by 1000, old and new side by side, into `gaming/media/renders/granada-3/`. **Outside the quiet window.**
- You cannot see the pieces in the game, because you do not wire them in. Say so; do not guess how they will look there.

## 9. What to hand back

One pull request against `main` from `gaming/granada-art-finish-devin`, containing:

- the changed scripts, `sources.json`, `manifest.json`, `manifest.py`, the three npm script lines, the comparison script;
- one new document, `docs/gaming/spec-production/art-finish-granada-3.md`: the table of pieces (triangles and sizes before and after, what was added, the level of detail), where the renders are on this Mac, what you could not reach by script, what you would need to go further, and what was not checked;
- one `CANARY.md` entry, appended under the current version block, in plain words, saying the models are on one Mac and are not in the game or on any host;
- commit trailers `AI-Agent: Devin`, `AI-Model: <the true model, or unknown>`, `AI-Editor: Devin Desktop`.

Before you push: `git fetch origin` and merge `origin/main` into your branch if it moved (never rebase with a force-push). In the pull request say: the models are in `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-devin-art/gaming/media/models/granada/3/`, they are not in the game or on any host, the founder has not judged them, and the pull request is not to be merged by you. Then write a `D-n TELL` on the board with the pull request's number, and a final entry in `devin-status.md`.

## 10. If something goes wrong

- A rule here and the task disagree: the rule wins. Write what you could not do.
- Blender fails, a script will not reproduce, a texture is missing: record the exact message in `tests.md`, write a `BLOCKED` or `ASK`, and move to the next piece.
- You find a fault in the game or its tools: do not fix it. Write it as a `TELL` with the file and line; Claude Code will take it.
- You are unsure whether something is allowed: it is not, until the founder says so.
