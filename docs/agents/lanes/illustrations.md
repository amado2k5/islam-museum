# Lane `illustrations`: AI-assisted illustrations for the pages, generated on the founder's Mac

This document is the prompt. Hand it to an agent with the standard task text at the end. It assumes the agent runs on the founder's Mac (the models, the GPU and the harvest workspace are there) in its own clone or worktree, following `AGENTS.md`, `docs/agents/workflow.md` and `docs/agents/content-standards.md`.

Plan: `docs/plan/22-illustration-run.md` (execution), built on `docs/plan/10-image-generation.md` (prompt system, house style, templates by class) and `docs/plan/16-event-maps-and-images.md` (event briefs, templates by event kind, worked prompts). Read all three before the first render.

## Scope and ownership

| | |
|---|---|
| Goal | One approved, reviewed-by-a-human illustration per page, derived only from that page's data and prose, labelled as an AI-assisted artist's impression, reproducible from a committed prompt and seed, released CC0 |
| Owns | `scripts/media/illustrate/**` (new), `media/prompts/**`, `data/media/illus-*.yaml`, `site/public/media/illustrations/**`, the `media.hero` line on entities it illustrates, `docs/delegation/illustrations-progress.md` |
| Uses, never edits | `scripts/media/brief.py`, `scripts/media/accuracy.yaml` (write a request if an entry is missing: `docs/requests/illustrations-accuracy-<period>-<region>.md`, and leave `accuracy_status: missing` in the prompt file), `schema/**`, `scripts/validate.ts`, `site/src/**` (the hero figure is maintainer work: `docs/plan/22` §6; write `docs/requests/illustrations-site-hero.md` if it is not there yet) |
| Branch | `media/illustrations-<agent>` |
| Progress file | `docs/delegation/illustrations-progress.md` |
| Stubs | none (this lane creates no entities other than `media`) |
| Commits | `content(illustrations): <batch> — <n> illustrations (draft)` + attribution trailers; at most 25 entities per commit; `npm run validate && npm test && npm run coverage` before every push |

## Rules that never bend for images

1. **No prophet is ever depicted**: not Muhammad, not any other prophet, not as a figure, silhouette, back view, hand, beam of light, angel or any stand-in. Every event, place, passage or concept of the Prophetic era, and every entity linked to a person with `roles: [prophet]`, is rendered with `figure_policy: none` (landscape, architecture, objects, light only). Companions and the Prophet's family are not depicted as figures either.
2. **No likeness of any real person**: no portraits, no faces, no bodies that could be read as a specific person. Person pages get attribute still-lifes (doc 10 §8.3) or landscapes of their places.
3. **Everything else may be illustrated**: places, landscapes, seasons, buildings (lost or reconstructed ones as "artist's impression"), objects as generic types, plants, animals, tools, manuscripts with illegible pages, markets and roads of later centuries with distant non-identifiable figures in accurate dress.
4. **No text inside an image**, ever (Arabic is mangled; the Qur'an must never be approximated). Prompts end with the "no text" suffix; the OCR gate rejects any recognised letters.
5. **Nothing invented.** Every visible element traces to the page's data, its prose (a cue with its source sentence) or the sourced accuracy table. The cue extractor restates; it never adds. If the page gives no visual cue, the image is a landscape of the place in the right season.
6. **Sensitive subjects** follow doc 05 §3 and doc 16 §5: aftermath template only for massacres, atrocities and disasters (no bodies, blood or fire in progress); no polemical material; `sensitivity` set on the record.
7. **Licence.** Published images come only from Z-Image-Turbo (Apache 2.0; confirm the licence text once and note it in the progress file). The cached FLUX.2 [klein] 9B weights are under the FLUX Non-Commercial License and are never used for anything that reaches `data/` or `site/`. Record model, exact snapshot, seed, steps, size, quantisation and prompt hash in every media record. Never name a living artist, studio or copyrighted work in a prompt.
8. **A human approves every image.** You pre-screen (lint, OCR, face and person gates, contact sheets); the founder or a named reviewer approves one seed per entity in `review.html`; you ingest only approved seeds; you never set `status.review` above `draft` and never approve your own images.
9. **Arabic first.** `label.ar`, `summary.ar` and `alt.ar` on every record; the alt text describes what is visible in one or two sentences and ends with the note that the scene is illustrative. English is optional.
10. **No honorifics anywhere** (not in alt text, labels, summaries or prompt files); no Qur'an text; no `.yaml` under `content/`.

## Setup on the Mac (once)

```
cd ~/Documents/GitHub/islam-museum && git fetch origin
git worktree add ../islam-museum-illustrations -b media/illustrations-<agent> origin/main
cd ../islam-museum-illustrations && ln -s ../islam-museum/node_modules node_modules && git config core.hooksPath .githooks
npm run validate && npm test                      # 0 errors, all tests pass, before anything else
source ../islam-museum/.venv-media/bin/activate    # Python 3.12 with pillow and pyyaml
uv pip install ocrmac pyobjc-framework-Vision tqdm
mflux-generate-z-image-turbo --help | head -5      # mflux 0.22.0 is installed with uv tool; the model is in ~/.cache/huggingface/hub
ollama list                                        # qwen3:32b is the cue extractor
mkdir -p ~/islam-museum-media/raw/illustrations ~/islam-museum-media/review
```

Keep the Mac awake and the batch detached: `tmux new -s illustrate -d 'caffeinate -dims python scripts/media/illustrate/generate.py event 2>&1 | tee -a ~/islam-museum-media/illustrate.out'`. Do not run a render batch while another session runs a large local-model job (check `tmux ls` and `ps aux | grep -E "ollama|mlx|mflux"`).

## The work, batch by batch

Follow `docs/plan/22-illustration-run.md` §5 for the scripts and §7 for the order. In short, for each batch:

1. `cues.py <class> --slug …` → `.cache/cues/`: the local model lists only what the Arabic prose states, each cue with its verbatim source sentence; cues whose source is not in the prose are dropped.
2. `prompts.py <class> --slug …` → `media/prompts/<class>/<slug>.json`: template by class and kind, filled from data, cues and `accuracy.yaml`; seeds from the media id; house style prefix and suffix from doc 10 §8.1; `figure_policy` from the table in doc 22 §2.
3. `lint.py` on the prompt files: figure words under `none`, person label with face words, anachronisms, text words, artist names, length. Fix the template or the cue, not the lint.
4. `generate.py <class>` under tmux and caffeinate: Z-Image-Turbo loaded once, 1536 × 1024, 8 steps, three seeds per entity, resumable log in `~/islam-museum-media/generation.log.jsonl`. Expect about 80 s per image.
5. `screen.py <batch>`: OCR and face and person gates; failed seeds re-queued once with seed + 100.
6. `contact.py <batch>` → `~/islam-museum-media/review/<batch>/review.html`. Tell the reviewer in the progress file that the sheet is ready and stop the batch there; continue with the next batch's steps 1–6 while waiting.
7. After `decisions.json` exists: `ingest.py <batch>` writes WebPs, records and `media.hero` links; write the Arabic alt text yourself from the approved image; `npm run validate && npm test && npm run coverage`; commit explicit paths; `git pull --rebase origin main`; validate and test again; push to main and to your branch.
8. Update `docs/delegation/illustrations-progress.md` (batch done, images approved and rejected with reasons, prompt or template changes, next step) and the lane's row in `docs/status.md`.

Batch 0 comes first: regenerate `illus-event-battle-of-badr`, `illus-event-battle-of-uhud` and `illus-event-battle-of-the-trench` with Z-Image-Turbo under the same ids, replace the three WebPs and complete their records (section 5 of doc 22 shows the finished shape); say in the commit message that the earlier files came from a non-commercially licensed model.

## Writing the scripts

- Python 3.12 in `.venv-media`; no new services, no network calls except Ollama on localhost; nothing at site runtime.
- `generate.py` uses the mflux Python API so the model loads once: `from mflux.models.z_image.variants.z_image import ZImage`; `model = ZImage()` (add `quantize=8` only after a measured 20-image trial, and record it); `img = model.generate_image(seed=seed, prompt=prompt, num_inference_steps=8, width=1536, height=1024)`; save with the image's `save` method so the metadata is embedded. Z-Image-Turbo ignores guidance and negative prompts: every "avoid" item goes into the positive prompt as a "No …" sentence (doc 10 §8.1 suffix).
- Deterministic: same prompt file and seed → same image; the `inputs_hash` in the record is the sha256 of the prompt file.
- Every script prints what it skipped and why; nothing fails silently; no `try/except: pass`.
- Tests: `scripts/media/illustrate/test_illustrate.py` covers seed derivation, lint rules (a prompt with "a man" under `none` fails; a person label with "portrait" fails; an anachronism from the accuracy table fails), cue filtering (a cue whose source sentence is not in the prose is dropped), and the record writer (a record validates against `schema/media.schema.json`). `npm test` must keep passing; add a Python test runner line to the progress file if the repo's `npm test` does not run Python tests.

## Reviewer checklist (shown in `review.html`, applied by the human)

Any text or pseudo-letters · any face, figure or silhouette where the policy is `none` · any face at all · a figure that could be read as a specific person · anachronism for the period and region (minarets or domes in the Prophetic era, paper before its time, plate armour, firearms before the 14th century, modern objects) · wrong architecture for the region · inaccurate religious practice · sensational violence, bodies, blood, fire in progress · orientalist clichés · glossy or oversaturated finish that breaks the house style · a scene that contradicts the page's prose or its map (season, terrain, time of day).

## Handing off

Nothing is lost if you followed `workflow.md`: prompts, records and WebPs are on main; masters and review sheets are in `~/islam-museum-media/`; the progress file says which batch is in review and which is next. The next agent resumes at "next step".

## Standard task text (paste to the agent)

```
You are an agent working on islam.museum, on the founder's Mac. Read AGENTS.md, then docs/agents/workflow.md, docs/agents/content-standards.md and your lane document docs/agents/lanes/illustrations.md, then docs/plan/22-illustration-run.md, docs/plan/10-image-generation.md and docs/plan/16-event-maps-and-images.md. Follow them exactly. Set up your own worktree from origin/main, check validate and tests pass, then build the scripts in scripts/media/illustrate/ and run batch 0 (regenerate Badr, Uhud and the Trench with Z-Image-Turbo) and batch 1 (the seven events with map blocks). Never depict a prophet, a Companion or any real person; never put text in an image; derive every prompt from the page's own data and prose; keep every record draft and leave approval to the human reviewer. Push small validated commits to main often, keep docs/delegation/illustrations-progress.md current, and stop each batch at the contact sheet until decisions.json exists.
```
