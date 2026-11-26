# Prompt for Devin: the finish of Granada's authored buildings

_Written 26 November 2026 by Claude Code at the founder's request, for a second agent working on the same Mac at the same time. Paste everything below the line._

---

You are working on islam.museum's games, in the repository `amado2k5/islam-museum`. Another agent (Claude Code) is working in the same repository at the same time on Granada's game rules and page. Your job is separate from its job and must stay separate.

## Read first

1. `AGENTS.md` (the rules that never bend) and `docs/ai-change-gates.md`.
2. `docs/gaming/spec-production/proof-granada.md`: the proof frame, set beside the founder's target picture `docs/gaming/spec-granada/assets/granada-v3.jpeg`. Read its section "What the picture has, and what the target has that it has not".
3. `docs/gaming/spec-production/owner-decisions-2026-11-26-b.md`, decision O3 (proof frames).
4. `gaming/art/blender/common.py`, `kit.py`, `granada_town.py`, `granada_landmarks.py`, `granada_mill.py`, and `gaming/art/sources.json`, `gaming/art/manifest.json`, `gaming/art/manifest.py`.

## The task

The game has twelve authored pieces made by headless Blender scripts: four houses, a wall section, a tower, a gate, scaffolding, a crane, a market stall, a palace, an olive estate, and a mill. They are plain volumes with photographed surfaces. The target picture's buildings have arcades, mouldings, carved doors, balconies, awnings, worn edges and things lying about them.

**Raise the finish of these same pieces. Do not make new kinds of piece and do not make pieces in number.** The founder has said no asset is mass-produced before he accepts a proof; a better version of the same twelve is a second proof candidate, which is allowed.

For each piece, in this order of priority: the four houses; the estate; the gate and tower; the palace; the rest.

- Add real architectural detail by script: door and window reveals, lintels and sills, shutters, eaves with tile ends, a balcony or a wooden lattice on some houses, an arcade on the estate and the palace court, crenellation and string courses on wall, tower and gate, a worn base course, awnings and jars at the stall.
- Bevel hard edges; vary wall planes slightly; add vertex-colour or texture-based dirt at the base and under eaves.
- Keep each house under about 4,000 triangles and the palace under about 15,000; give every piece one lower level of detail at about a third of that.
- Keep each piece's origin, footprint, front direction (+Z after glTF export) and overall size exactly as now, so the game places it unchanged.
- Architecture is a general picture of a walled town of the western Mediterranean. Copy no named building. Do not call anything the Alhambra. No figures of people, no inscriptions, no religious text of any kind.

## Hard limits

- **Work only under `gaming/art/`.** Do not edit anything under `gaming/games/`, `gaming/packages/`, `gaming/tools/`, `workers/`, `site/`, `data/`, `content/`, or `docs/gaming/LEDGER.md`. Do not edit `CANARY.md` until your one final commit, and then only append one entry.
- **Use your own clone or git worktree and your own branch** (`gaming/granada-art-finish-devin`). Never work in `.claude/worktrees/`. Never force-push. Never touch the git stash.
- **Media is never committed.** Models, textures and renders stay in the git-ignored `gaming/media/`. Commit scripts, `sources.json` and `manifest.json` only.
- **Write to a new folder, `gaming/media/models/granada/3/`.** Never overwrite anything in `granada/2/`: files already on the host are never replaced.
- **Textures: Poly Haven (polyhaven.com) CC0 only**, images only, each one's licence read on its own page and recorded in `gaming/art/sources.json` with its address and the date. Nothing from any other site. No AI-generated textures or images.
- **Do not upload anything to UAT or production, do not run any deploy workflow, do not change `MODEL_SET` in the game.** You hand the models over; you do not wire them in.
- **Do not open a browser to measure the game, and do not run `npm test`, the play scripts or any long render between 10:30 and 12:15 UTC on 26 November 2026**: the other agent is measuring frame times on this machine then, and anything heavy spoils the measurement. Light Blender script runs are fine.
- Make no claim about quality, performance or history that you have not checked. You are not the judge of whether the result matches the target: the founder is.

## How to check your own work

- Each script must run headless and reproducibly (`npm --prefix gaming run art:town` and its like); two runs give byte-identical files.
- Render each piece alone from Blender at three-quarter view on a neutral ground, 1600 by 1000, old and new side by side, into `gaming/media/renders/granada-3/` (not committed).
- Record for each piece: triangles before and after, file size before and after, textures used.

## What to hand back

One pull request against `main` from your branch, containing the changed scripts, `sources.json`, `manifest.json`, and one new document `docs/gaming/spec-production/art-finish-granada-3.md` with: the table of pieces (triangles, sizes, what was added), where the renders are on this Mac, what you could not reach by script, and what you would need to go further. One `CANARY.md` entry. Commit trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:` as `AGENTS.md` requires. **Do not merge it.** Say in the pull request that the models are in `gaming/media/models/granada/3/` on this Mac and are not yet in the game or on any host.
