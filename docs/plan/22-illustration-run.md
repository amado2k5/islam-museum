# 22 · Illustrating the pages: running the local image model on the Mac

Execution plan for turning the prompt system of `10-image-generation.md` and the event briefs of `16-event-maps-and-images.md` into approved illustrations on real pages, using only the founder's Mac (Apple M4 Max, 128 GB unified memory, macOS 26) and models already on disk. Written 15 October 2026 from the state of `origin/main` and of the machine; it supersedes the throughput and model-licence assumptions in doc 10 §2 and §7 where they differ.

The agent prompt for this work is the lane document `docs/agents/lanes/illustrations.md`.

## 1. What "relevant to the content on the page" means here

Every page of the museum is an entity (`data/<class>/<slug>.yaml`) with Arabic prose (`content/ar/<class>/<slug>.md`). An illustration is relevant when every visible thing in it comes from that page's own data and prose, or from the sourced period × region accuracy table, and nothing else. So the prompt for a page is assembled, never written freehand:

| Input | Where it comes from | Example (غزوة أحد) |
|---|---|---|
| Place, terrain, elevation, coordinates | `occurred_at` → `data/place/*.yaml`, ETOPO1 lookup (`scripts/media/brief.py`) | Mount Uhud, 24.50 N 39.61 E, rocky mountain north of an oasis town |
| Date → season, light | `date.start.edtf` (`brief.py`) | Shawwal 3 AH / March 625 → spring, bright morning |
| Period and region → dress, material culture, anachronisms to avoid, figure policy | `scripts/media/accuracy.yaml` | Arabia, Prophetic era: no minarets, no domes, no paper, no figures |
| Scene cues: concrete visual nouns the prose itself states | new `scripts/media/illustrate/cues.py`: a local LLM reads the Arabic prose and lists only what the text says (terrain, objects, weather, time of day, animals, buildings), each with the sentence it came from | "الرماة على الجبل" → a small rocky hill; "حمراء الأسد على ثمانية أميال" → a track leading south |
| Template for the class and kind | doc 10 §8.3, doc 16 §5 | battle, Prophetic era → "the setting of … empty before anything happens" |
| House style | doc 10 §8.1 | palette, light, finish, "no text, no faces" |

The cue step is the only place a language model touches the content, and it works under the restate-only rules already used for prose drafts: it may list what the page says, it may not add, infer or embellish. Each cue carries its source sentence so a reviewer can check it in seconds. If the prose gives no visual cue, the image is made from data alone (place, season, period), which is always enough for a landscape.

## 2. The depiction rule (Sunni practice, applied to generated images)

Founder instruction, 15 October 2026: generate images for the content of the pages, never a depiction of a prophet; everything else may be illustrated. Applied together with the standing rules (`AGENTS.md`, doc 05 §3, doc 10 §1):

| Subject | Rule | How the pipeline enforces it |
|---|---|---|
| Any prophet (Muhammad, Ibrahim, Musa, Isa, all others) | Never depicted: no figure, no silhouette, no "back view", no hand, no symbolic stand-in (light beam as a person, an angel, a veiled figure) | `figure_policy: none` for every entity linked to `person/muhammad` or any `roles: [prophet]` person, every Prophetic-era event, every place during the Prophetic era, every `passage`; prompt lint rejects figure words; face and person detection on the output |
| The Prophet's family and Companions | Not depicted as figures (same policy as the era) | as above; a person page of a Companion gets a still-life of attributes or a landscape of their places, never a figure |
| Other real people (scholars, rulers, travellers, modern figures) | No portrait, no likeness, no face (`AGENTS.md`: "no AI-generated portraits") | `figure_policy: still-life`; lint rejects a person label together with portrait/face/man/woman/figure |
| Scenes after the Prophetic era with people in them (markets, battles, pilgrim roads) | Allowed as distant, non-identifiable figures in correct dress; no faces | `figure_policy: distant`; face detection on the output rejects any detectable face |
| Places, landscapes, buildings (lost or reconstructed), objects as generic types, plants, animals, tools, manuscripts (illegible), skies, seasons | Allowed and encouraged; this is most of the museum | default |
| Surviving real buildings and real museum objects | Not generated as themselves; use photographs (doc 10 rule 4); a generated "artist's impression of the city around year X" is fine and labelled | `kind: illustration`, caption badge, never in the Objects wing as evidence |
| Massacres, atrocities, disasters | Aftermath template only: no bodies, no blood, no fire in progress | doc 16 §5 template; reviewer checklist |
| Text of any kind | Never inside a generated image (Arabic is mangled; Qur'an must never be approximated) | prompt suffix; OCR pass rejects any detected text |

Every published illustration says on the page that it is an AI-assisted artist's impression, and a visitor can hide all illustrations.

## 3. Models on the machine, and which one to use

Checked on 15 October 2026 (`~/.cache/huggingface/hub`, `mflux` 0.22.0 installed with `uv tool`, Draw Things, Comfy Desktop and DiffusionBee installed; Ollama with `qwen3:32b`, `gemma4:26b`):

| Model on disk | Size | Licence of the cached weights | Use |
|---|---|---|---|
| **Z-Image-Turbo** (Tongyi-MAI, 6B) | 31 GB | Apache 2.0 (confirm on the model card before the first publication; the local snapshot has no README) | **House model for every published illustration.** 8 steps, no guidance, no negative prompt (the CLI ignores both), bf16 |
| FLUX.2 [klein] 9B (Black Forest Labs) | 49 GB | **FLUX Non-Commercial License v2.1** (the `LICENSE.md` in the local snapshot says so) | Not for anything published. Exploration only. The three existing illustrations (Badr, Uhud, the Trench; `data/media/illus-event-*.yaml`) were made with it and must be regenerated with Z-Image-Turbo (section 7, batch 0) |
| FLUX.2 [klein] 4B | not downloaded | Apache 2.0 per the vendor (verify) | Optional second model if a different look is wanted; not needed |
| Qwen-Image-Edit-2509 | 54 GB | Apache 2.0 | Edit model, not a generator; keep for later targeted fixes (remove an object, extend a sky). Qwen-Image (the generator, 20B) is not on disk |
| sd-turbo | 4.8 GB | non-commercial research licence | Not used |
| Draw Things models (`flux_1_schnell_q8p`, sd 2.1) | | schnell is Apache 2.0 | Art-direction experiments by hand only |

Measured on this Mac with Z-Image-Turbo through `mflux-generate-z-image-turbo`, 1536 × 1024, 8 steps, seed 7, bf16: 78 s of denoising (about 9 s per step after warm-up), 1 min 39 s wall clock including model load, peak MLX memory 26 GB. The output matched the house style on the first try (flat painterly finish, no text, no people; test image kept outside git). Consequences:

- Doc 10's estimate of 10–20 s per image was optimistic; plan on **80 s per hero image** with the model kept loaded, about 45 images an hour, about 350 in an eight-hour night.
- Load the model once per batch through the Python API (`mflux.models.z_image.variants.z_image.ZImage`), not once per image through the CLI, which saves about 20 s per image.
- Three seeds per entity means about 115 entities a night. The 214 event pages with prose take two nights; the whole spine of pages with prose (about 500 non-person entities) takes a week of nights. Person still-lifes (546 pages) are a second phase.
- Memory leaves room for Ollama (`qwen3:32b`, about 20 GB) to run the cue extraction at the same time; do not run the harvest LLM jobs and a render batch at the same time.
- `--quantize 8` roughly halves the memory and may speed the step; test on 20 images before adopting it, and record the setting in every media record (an 8-bit render is not reproducible from a bf16 seed).

## 4. Folders and what is committed

```
~/islam-museum-media/                      outside git (the future media.islam.museum repo or R2 bucket)
  raw/illustrations/<media-id>__<seed>.png  full-resolution masters with mflux metadata (prompt, seed, steps in EXIF)
  review/<batch>/contact-*.jpg, review.html, decisions.json
  generation.log.jsonl                      one line per attempt (resumable)
islam-museum/                              the repository
  media/prompts/<class>/<slug>.json         committed: the exact prompt, seeds, size, policy, cue sources (reproducible)
  .cache/cues/<class>/<slug>.json           git-ignored: raw cue extraction with source sentences
  data/media/illus-<class>-<slug>.yaml      committed: provenance, licence, Arabic alt text, depicts, sensitivity
  site/public/media/illustrations/<class>/<slug>.webp   committed: the one approved image, 1280 px wide, ≤ 150 KB
```

Decision to confirm with the founder: `site/public/media/` is git-ignored (media belongs in the media repo, doc 03 §8), yet the three existing illustrations were force-added there so that the deployed site shows them. Until the media repo and `media.islam.museum` exist, this plan continues that practice deliberately: add `!site/public/media/illustrations/` to `.gitignore`, keep each file ≤ 150 KB, and cap the folder at 100 MB (about 700 images). When the media repo is live, `ingest.py` switches its destination and the records' `files` paths change in one commit.

## 5. The pipeline, step by step

All scripts live in `scripts/media/illustrate/` (new, owned by the `illustrations` lane) and run in `.venv-media` (Python 3.12, exists). They reuse `scripts/media/brief.py` and `scripts/media/accuracy.yaml` unchanged.

1. **`cues.py <class> [--slug …]`** reads `content/ar/<class>/<slug>.md`, strips citations and headings, and asks the local model (Ollama `qwen3:32b`, temperature 0, JSON output) for at most 12 cues: `{ "cue": "...", "kind": terrain|object|building|animal|weather|time|season|plant, "source": "<the sentence, verbatim>" }`. Rules in the system prompt: only what the text states; no people, no names, no actions, no emotions; nothing about the Prophet; Arabic in, Arabic out. The script drops any cue whose `source` is not a substring of the prose (a cheap guard against invention) and any cue containing a figure word. Output to `.cache/cues/`. A page without prose gets an empty cue list and is still illustrated from data.
2. **`brief.py`** (existing) builds the data brief for events; `prompts.py` extends the same idea to place, period, polity, group, concept, journey, question, exhibit, building, practice and person, choosing the template of doc 10 §8.3 or doc 16 §5 by class and kind and filling it from data, cues and the accuracy table. It writes `media/prompts/<class>/<slug>.json`:
   ```json
   { "id": "event/battle-of-uhud", "media_id": "illus-event-battle-of-uhud", "model": "z-image-turbo", "size": [1536, 1024], "steps": 8,
     "seeds": [1193046329, 1193046330, 1193046331], "figure_policy": "none", "sensitivity": [],
     "prompt": "<STYLE_PREFIX> The setting of the Battle of Uhud (March 625) below Mount Uhud, north of Medina: …", "cues": [ … with sources … ],
     "accuracy_status": "unreviewed", "sources": ["source/mubarakpuri-raheeq", "source/ibn-hisham-dar-ibn-hazm"] }
   ```
   Seeds are the first 31 bits of `sha256(media_id)` plus 0, 1, 2, so a rerun gives the same images.
3. **`lint.py`** rejects a prompt before any GPU time is spent: figure words under `figure_policy: none` (man, woman, people, crowd, rider, soldier, figure, silhouette, hand, face, angel, prophet, and their Arabic equivalents in the cues); any person label together with portrait/face words; anachronisms listed for the period and region; the words text, calligraphy, inscription, banner with writing; any living artist's or studio's name; any prompt longer than 1,200 characters. A failed lint writes the reason into the prompt file and skips it.
4. **`generate.py <class>`** loads Z-Image-Turbo once, walks the prompt files, skips seeds already in `generation.log.jsonl`, renders, saves PNG masters with embedded metadata, logs `{media_id, seed, model, mflux_version, quantize, seconds, status, file}`. Runs under `caffeinate -dims` in `tmux` (doc 10 §6.3) with a battery stop. Peak memory and seconds per image are printed every 10 images.
5. **`screen.py <batch>`** runs the automatic gates on every PNG and writes `screen.json`: text detection with Apple Vision OCR (`ocrmac`, already used by the library pipeline; any recognised string of two or more letters fails the image), face detection with Vision (`VNDetectFaceRectanglesRequest` through `pyobjc-framework-Vision`; any face fails), and a person check with the same framework's human-rectangle request under `figure_policy: none`. Failed images never reach the contact sheet; their seed is replaced by seed + 100 and re-queued once.
6. **`contact.py <batch>`** builds contact sheets and a static `review.html` (no server: a plain page with radio buttons that produces `decisions.json` through a "copy" button) showing, per image: the three seeds, the prompt, the cues with their source sentences, the accuracy status, the figure policy, and the checklist of doc 10 §7 (rejection list) and doc 16 §9.
7. **A human reviews.** The founder, or a reviewer the founder names, approves at most one seed per entity. The agent never approves its own images and never sets `status.review` beyond `draft`.
8. **`ingest.py <batch>`** writes, for each approved image: the WebP (1280 px, quality 82, ≤ 150 KB; re-encode at 78 if larger), the media record below, and `media.hero: media/illus-<class>-<slug>` on the entity when it has no hero. It appends the decision (`reviewed_by`, date, seed) to the record's `generated` block. Then `npm run validate && npm test && npm run coverage`.

Media record (shape of the existing `data/media/illus-event-battle-of-uhud.yaml`, completed):

```yaml
id: media/illus-event-battle-of-uhud
class: media
kind: illustration
label: { ar: "صورة تصويرية: غزوة أحد", en: "Scene illustration: The Battle of Uhud" }
summary: { ar: "مشهد تصويري لموضع غزوة أحد، مولَّد محلياً بنموذج Z-Image-Turbo من بيانات الصفحة؛ بلا أشخاص ولا نص." }
wings: [place]
alt: { ar: "سهل رملي أمام جبل أحمر طويل القمة شمال واحة نخيل في ضوء صباح الربيع؛ تل صخري صغير في المقدمة؛ بلا أشخاص. الصورة تصور المكان لا مواضع المعركة." }
depicts: [event/battle-of-uhud, place/uhud]
sensitivity: none
generated:
  tool: "mflux 0.22.0 (MLX, Apple M4 Max)"
  model: z-image-turbo
  version: "Tongyi-MAI/Z-Image-Turbo f332072"
  seed: 1193046330
  prompt_hash: "sha256:…"
  inputs_hash: "sha256:…"            # of the prompt file
  date: "2026-10-20"
precision: approximate
license: CC0
attribution: "islam.museum, CC0. تصوير فني بمساعدة الذكاء الاصطناعي، مولَّد محلياً؛ الموجِّه والبذرة في media/prompts/event/battle-of-uhud.json."
files: { webp: media/illustrations/event/battle-of-uhud.webp }
sources: [source/mubarakpuri-raheeq, source/ibn-hisham-dar-ibn-hazm]
status: { review: draft, completeness: 2, generated_by: "illustrations lane; <agent>, <model>; approved seed by <reviewer> on <date>" }
provenance: { generated_by: "<agent>", model: "<llm used for cues>", run: "<batch id>", source: "media/prompts/event/battle-of-uhud.json" }
```

Alt text is written in Arabic by the agent from the prompt and the approved image (what is visible, in one or two sentences, ending with the note that the scene is illustrative), never by the image model.

## 6. What the site needs (maintainer lane)

`media.hero` is accepted by the schema and checked by the validator but not rendered on main; only `media.map` is (`site/src/components/Extras.astro`). Needed, in `site/src/layouts/EntityLayout.astro` and `i18n/ar.yaml`:

- A hero `<figure>` above the brief when `media.hero` points to a `kind: illustration` record whose WebP exists at build time: `loading="lazy"`, width and height set, Arabic alt from the record, caption "صورة تصويرية بمساعدة الذكاء الاصطناعي · انطباع فني، لا وثيقة" and a `<details>` "كيف صُنعت هذه الصورة" listing model, seed, date and a link to the media record page.
- The media record page itself shows the prompt file contents (committed JSON) so anyone can regenerate the image.
- A visitor setting "إخفاء الصور التصويرية" stored in `localStorage` by a tiny island; the page reads without it (the figure is plain HTML; the setting only adds a class). No runtime call anywhere (`npm run check:static`).
- Illustrations never appear in the Objects wing listings and never as the OpenGraph image of a `person` page (name tiles there, doc 10 §8.4).

Until this lands, ingested records and hero links are valid but invisible; that is acceptable for the first two batches.

## 7. Batches, in order

| Batch | Pages | Why first | Nights |
|---|---|---|---|
| 0 | Regenerate Badr, Uhud, the Trench with Z-Image-Turbo; fix their records (model, seed, prompt file, licence note); same slugs and ids | Removes the non-commercial-licence images from main | hours |
| 1 | The 7 events with `map` blocks (Badr, Uhud, Trench, Hudaybiyya, Khaybar, Hunayn, Tabuk) | Richest data; the map and the illustration sit on the same page and must agree (terrain, season) | 1 |
| 2 | 13 periods and the 8 polities with prose (banners 21:9 and heroes 3:2) | Settles the house style on few, prominent pages | 1 |
| 3 | Events with Arabic prose, 25 per batch, Prophetic era first (about 214) | The spine | 2–3 |
| 4 | Places with prose and coordinates (57), then journeys (32: one image per leg with a place) | | 1–2 |
| 5 | Concepts (46), questions (31), exhibits (5), practices (4), buildings (5, lost or altered only) | Symbolic and editorial templates | 1 |
| 6 | Groups (64): landscapes of their territory and attribute still-lifes, never crowds that could be read as a group | | 1 |
| 7 | Person still-lifes (546), 25 per batch, after programmatic name tiles exist | Second phase | many |

Each batch is one lane commit set (prompts, records, WebPs, coverage), at most 25 entities per commit, pushed to main after validate and tests.

## 8. Monitoring and acceptance

- `tmux attach -t illustrate`; `tail -f ~/islam-museum-media/generation.log.jsonl`; the ETA one-liner of doc 10 §7; `sudo asitop` for GPU and memory; stop if Memory Pressure leaves green.
- Acceptance for a batch: every prompt file passes lint; every approved image passed OCR and face gates; no Prophetic-era image contains a person; every record has Arabic alt, licence CC0, `depicts`, sources, `generated` with seed and hashes, `status.review: draft`; the same prompt file and seed regenerate a visually identical image; `npm run validate` 0 errors; `docs/coverage.md` regenerated; WebP ≤ 150 KB each.
- Open items to flag in `docs/status.md`: Z-Image-Turbo licence text confirmed; `accuracy.yaml` entries still unreviewed (every record inherits `accuracy_status`); the `site/public/media` decision of section 4; the site work of section 6.
