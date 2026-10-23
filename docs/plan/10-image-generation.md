# 10 · Image generation on a local Mac — plan, setup, commands, monitoring, prompts

This document covers every image the museum needs that is not a photograph of a real object, how to generate them on your Mac (Apple M4 Max, 128 GB unified memory, macOS 26, ComfyUI Desktop and Draw Things already installed), how to run and monitor thousands of generations unattended, how the results enter the content graph with full provenance, and the complete prompt system for every class of entity.

## 1. What AI images are for, and what they are never for

The museum's imagery has three layers, and only the third is generated:

| Layer | Source | Examples |
|---|---|---|
| **Documentary** | Real photographs and scans from open collections (Met, Smithsonian, Walters, Wikimedia Commons, QDL via IIIF) | The actual Blue Qur'an folio, the actual Great Mosque of Córdoba, a real astrolabe |
| **Programmatic** | Scripts render these from data and fonts, deterministically | Calligraphic name tiles, Arabic text samples, maps, timelines, girih patterns, icons, OpenGraph cards, charts |
| **Illustrative (generated)** | Local diffusion models, from prompts derived from entity data, approved by the automated gates of doc 22 §5 step 6 | Atmosphere of Baghdad around 800 CE, a caravan on the trans-Saharan route, a physician's table for Ibn Sina, a wing's hero art |

Rules that follow from the charter (05-editorial §3) and apply to every generated image:

1. **No faces of real people.** No AI "portraits" of historical or living figures. People are represented by calligraphic name tiles (programmatic) and by *attribute still-lifes* (generated): the tools, manuscripts, places and light of their world.
2. **No figurative depictions of prophets, ever**, and no human figures at all in scenes from the Prophet's life or involving companions. Those scenes are landscapes, architecture, objects and light.
3. **Human figures elsewhere** only as distant, non-identifiable silhouettes, hands, or back views, dressed accurately for time and place, and diverse. Never crowds that could be read as a specific historic group being mocked or glorified.
4. **Never a generated image of a real object or a real surviving building presented as the object.** Generated images of lost or reconstructed buildings (the Round City of Baghdad, Madinat al-Zahra in its prime, the House of Wisdom) are allowed and labelled "artist's impression".
5. **No text inside generated images.** Diffusion models mangle Arabic; all text is rendered programmatically on top.
6. **Every generated image is labelled** on the page ("Illustration · AI-assisted artist's impression"), carries `kind: illustration` in its media record, and never appears in the Objects wing as evidence.
7. **Only models whose license permits releasing outputs freely**, so the images can be published under CC0 like the rest of our data. Use Apache-2.0-licensed models (listed below). Avoid "dev"/non-commercial-licensed models for anything that will be published.
8. **The pipeline approves an image only when it passes every automated gate** (doc 22 §5 step 6), and records `status.approved_by: "pipeline"` with the gate report hash. Every approval is written to the daily audit file `review/<batch>/auto-approved.json`. No human approval step.

A visitor setting (`illustrations: show | hide`) lets anyone browse the museum with documentary and programmatic images only.

## 2. Models to use (Apple Silicon, open licenses)

Pick one primary model for consistency of style, and one fallback. All of these run comfortably in 128 GB without quantization.

| Model | License | Why | Notes |
|---|---|---|---|
| **FLUX.2 [klein]** (9B, Black Forest Labs, Jan 2026) | Apache 2.0 | Strong composition and materials, fast, supports reference images for style consistency | Primary candidate. Runs in ComfyUI and in mflux (MLX). |
| **Z-Image-Turbo** (6B, Alibaba Tongyi, Nov 2025) | Apache 2.0 | Very fast (8 steps), photoreal and painterly both good | Primary or fallback; excellent throughput for thousands of images. |
| **Qwen-Image** (20B, Aug 2025) | Apache 2.0 | Best at complex, crowded compositions and consistent scenes | Slower; use for exhibit covers and wing heroes. |
| **FLUX.1 [schnell]** | Apache 2.0 | Mature, 4 steps, mflux-native | Fallback if the newer models misbehave in mflux. |

Do not use FLUX.1 [dev] or FLUX.2 [dev] for published images (non-commercial model licenses complicate our CC0 release). Verify the exact license text of whichever checkpoint you download; the Hugging Face model card states it.

Style consistency across thousands of images comes from four things: one model, one fixed style prefix and suffix in every prompt (section 7), a fixed palette, and fixed seeds derived from the entity ID so regenerations are reproducible.

## 3. Setup on your Mac, step by step

You already have Homebrew, uv, ComfyUI Desktop and Draw Things. Two runners are set up below; ComfyUI is the primary because it exposes an HTTP API for unattended batches, and mflux is a lightweight CLI alternative.

### 3.1 System preparation

```bash
# keep the Mac awake during long batches (run in the batch terminal; Ctrl-C to end)
caffeinate -dims &
```

```bash
# monitoring tools: tmux for detached sessions, asitop for a live GPU/CPU/RAM view
brew install tmux && uv tool install asitop
```

```bash
# fonts for programmatic Arabic rendering (name tiles, text overlays)
brew install --cask font-amiri font-noto-naskh-arabic font-reem-kufi font-source-serif-4 font-inter
```

```bash
# Arabic shaping library used by Pillow for correct Arabic text rendering
brew install libraqm fribidi harfbuzz
```

### 3.2 Project environment

```bash
# an isolated Python 3.12 environment for the media scripts (Python 3.14 from miniconda is too new for some wheels)
cd ~/Documents/GitHub/islam-museum && uv venv --python 3.12 .venv-media && source .venv-media/bin/activate && uv pip install pillow requests pyyaml tqdm websocket-client
```

### 3.3 Runner A: ComfyUI Desktop (primary, API-driven)

1. Open **Comfy Desktop.app** once, finish its first-run setup, and note the server address shown in Settings → Server (by default `http://127.0.0.1:8000`; the classic ComfyUI port is 8188).
2. Install the model files. Open ComfyUI's **Model Library** / Manager and download the checkpoint you chose (FLUX.2 [klein] or Z-Image-Turbo) with its text encoder and VAE; or download from Hugging Face into ComfyUI's `models/diffusion_models`, `models/text_encoders`, `models/vae` folders (the paths are listed in Settings → Server → Model paths).
3. In the ComfyUI canvas, open the model's template workflow (Workflow → Browse Templates), generate one test image, then export the workflow in **API format** (Workflow menu → Export (API)) and save it as `scripts/media/workflows/<model>.api.json`. The batch script fills in the prompt, seed, size and filename fields of that JSON.
4. Keep ComfyUI running during batches (it can stay in the background).

### 3.4 Runner B: mflux (MLX, command line)

```bash
uv tool install mflux
```

```bash
# first run downloads the model (tens of GB); check the current model list for the newest Apache-2.0 options
mflux-generate --help | head -60
```

```bash
# test render; --seed makes it reproducible; 1536x1024 is the museum's 3:2 hero size
mflux-generate --model schnell --steps 4 --seed 7 --width 1536 --height 1024 --prompt "warm ivory and lapis museum illustration of a quiet courtyard with a fountain at dawn" --output ~/Desktop/test.png
```

### 3.5 Runner C: Draw Things (GUI, for one-off art direction)

Use Draw Things to explore styles interactively before committing to the house style, and to re-do individual rejected images by hand. Settings → API Server can also expose a local endpoint if you prefer it over ComfyUI for batches.

## 4. Where images live and how they enter the graph

```
islam-museum-media/            (separate repo → media.islam.museum; or an R2 bucket)
  raw/<media-id>.png           full-resolution output (kept out of git if > 100 MB total → R2)
  img/<media-id>/{320,640,1280,1920}.{avif,webp}
islam-museum/
  data/media/<media-id>.yaml   provenance + license + alt text (committed)
  media/prompts/<class>/<slug>.json   generated prompts (committed; reproducible)
  media/review/<batch>/auto-approved.json, screen.json  audit and gate reports (gitignored)
  media/generation.log.jsonl   one line per attempt (gitignored, kept locally)
```

`data/media/ill-place-baghdad-0800.yaml`:

```yaml
id: media/ill-place-baghdad-0800
class: media
kind: illustration
label: { en: "Baghdad around 800 CE, artist's impression", ar: "بغداد نحو سنة 800م، تصور فني" }
alt:
  en: "Painterly view of a round walled city on a river at dawn, domes and palm groves, no people."
  ar: "منظر تصويري لمدينة مدورة مسورة على نهر عند الفجر، قباب وبساتين نخيل، بلا أشخاص."
depicts: [place/baghdad, period/abbasid-early]
generated:
  tool: comfyui
  model: flux2-klein-9b          # exact checkpoint filename + sha256 recorded by the script
  prompt_file: media/prompts/place/baghdad.json
  seed: 2890471233
  size: [1536, 1024]
  steps: 4
  date: 2026-11-03
  reviewed_by: ahmed
  review_note: "approved by pipeline; seed 2 of 3"
license: CC0-1.0
attribution: "islam.museum, AI-assisted illustration"
sensitivity: none
caption_badge: illustration
```

The site renders the `illustration` badge, the caption, and a "How this image was made" disclosure with model and prompt. Reproducibility is a feature: anyone can regenerate the image from the committed prompt and seed.

## 5. Sizes and formats

| Use | Size | Ratio | Notes |
|---|---|---|---|
| Entity hero, exhibit room | 1536 × 1024 | 3:2 | The default |
| Wing / period / region banner | 2016 × 864 | 21:9 | Generated at 1536 × 658 and upscaled, or native if the model supports it |
| Card tile | 1024 × 1024 | 1:1 | Can be a centre crop of the hero when composition allows; otherwise its own prompt |
| Portrait-orientation (mobile hero) | 1024 × 1536 | 2:3 | Only for wing heroes |

Output PNG → sharp/Pillow derivatives in AVIF and WebP at 320/640/1280/1920 widths. Keep total committed media small; the main repo holds YAML only.

## 6. The batch pipeline

```
data/<class>/*.yaml ──► gen-prompts.py ──► media/prompts/<class>/<slug>.json
                                                   │
                                   generate.py (ComfyUI API or mflux CLI), resumable, 3 seeds per entity
                                                   │
                               raw/*.png + generation.log.jsonl ──► approve.py (gates) ──► media/review/<batch>/auto-approved.json
                                                   │
                                        gates pass ──► status.approved_by: pipeline; failures re-queued once (seed + 100)
                                                   │
                       ingest.py ──► data/media/*.yaml + derivatives in media repo + hero link in entity YAML
```

### 6.1 Prompt generator (`scripts/media/gen-prompts.py`)

Reads every entity, picks the template for its class and kind (section 7), fills the variables from data (dates, places, materials, roles, region, period), appends the house style, and writes one JSON per entity:

```json
{
  "id": "place/baghdad",
  "media_id": "ill-place-baghdad-0800",
  "model": "flux2-klein-9b",
  "size": [1536, 1024],
  "seeds": [2890471233, 2890471234, 2890471235],
  "prompt": "…",
  "avoid": "text, letters, captions, watermark, faces, modern objects, …",
  "policy": { "figures": "none", "label": "illustration" }
}
```

Seeds are derived from a stable hash of the media ID so a rerun produces the same images.

### 6.2 Generator (`scripts/media/generate.py`), ComfyUI API version

```python
#!/usr/bin/env python3
"""Batch-generate museum illustrations through the ComfyUI API. Resumable; one JSONL log line per attempt."""
import json, sys, time, uuid, hashlib, pathlib, urllib.request
from tqdm import tqdm

SERVER = "http://127.0.0.1:8000"          # ComfyUI Desktop default; classic ComfyUI uses 8188
WORKFLOW = pathlib.Path("scripts/media/workflows/flux2-klein.api.json")
PROMPTS = pathlib.Path("media/prompts")
OUT = pathlib.Path("../islam-museum-media/raw")
LOG = pathlib.Path("media/generation.log.jsonl")

def post(path, payload=None):
    req = urllib.request.Request(SERVER + path, data=json.dumps(payload).encode() if payload else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        return json.load(r)

def fill(workflow, prompt, avoid, seed, w, h, filename):
    wf = json.loads(json.dumps(workflow))
    for node in wf.values():                     # API-format workflow: {id: {class_type, inputs}}
        t, i = node["class_type"], node["inputs"]
        if t == "CLIPTextEncode" and i.get("_role") == "positive": i["text"] = prompt
        if t == "CLIPTextEncode" and i.get("_role") == "negative": i["text"] = avoid
        if "seed" in i: i["seed"] = seed
        if "noise_seed" in i: i["noise_seed"] = seed
        if t in ("EmptyLatentImage", "EmptySD3LatentImage", "EmptyFlux2LatentImage"): i["width"], i["height"] = w, h
        if t == "SaveImage": i["filename_prefix"] = filename
    return wf

def wait(prompt_id, timeout=900):
    t0 = time.time()
    while time.time() - t0 < timeout:
        h = post(f"/history/{prompt_id}") if False else json.load(urllib.request.urlopen(SERVER + f"/history/{prompt_id}"))
        if prompt_id in h and h[prompt_id].get("status", {}).get("completed"):
            return h[prompt_id]
        time.sleep(2)
    raise TimeoutError(prompt_id)

def main(only_class=None):
    workflow = json.loads(WORKFLOW.read_text())
    jobs = sorted(PROMPTS.glob(f"{only_class or '*'}/*.json"))
    done = {json.loads(l)["media_id"] + ":" + str(json.loads(l)["seed"]) for l in LOG.read_text().splitlines()} if LOG.exists() else set()
    todo = [(j, s) for j in jobs for s in json.loads(j.read_text())["seeds"] if f"{json.loads(j.read_text())['media_id']}:{s}" not in done]
    print(f"{len(todo)} renders to do ({len(done)} already logged)")
    with LOG.open("a") as log:
        for job, seed in tqdm(todo, unit="img"):
            p = json.loads(job.read_text())
            name = f"{p['media_id']}__{seed}"
            t0 = time.time()
            try:
                wf = fill(workflow, p["prompt"], p.get("avoid", ""), seed, *p["size"], name)
                pid = post("/prompt", {"prompt": wf, "client_id": str(uuid.uuid4())})["prompt_id"]
                res = wait(pid)
                files = [o["filename"] for out in res["outputs"].values() for o in out.get("images", [])]
                status = "ok"
            except Exception as e:
                files, status = [], f"error: {e}"
            log.write(json.dumps({"media_id": p["media_id"], "seed": seed, "model": p["model"], "status": status,
                                  "files": files, "seconds": round(time.time() - t0, 1), "ts": time.strftime("%Y-%m-%dT%H:%M:%S")}) + "\n")
            log.flush()

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
```

Before using it, open the exported API workflow once and add `"_role": "positive"` / `"_role": "negative"` inside the inputs of the two text-encode nodes (or adapt the `fill` function to your node IDs). ComfyUI writes images to its own `output/` folder; `ingest.py` moves them to the media repo.

mflux version (simpler, no server): the same loop calls `mflux-generate --model … --seed … --width … --height … --prompt … --output …` through `subprocess.run`, and logs identically.

### 6.3 Running a batch

```bash
# start a detached session so the batch survives closing the terminal; attach later with: tmux attach -t media
tmux new -s media -d 'cd ~/Documents/GitHub/islam-museum && source .venv-media/bin/activate && caffeinate -dims python scripts/media/generate.py place 2>&1 | tee -a media/batch.out'
```

Order of batches: `wing` (9) → `period` (12) → `region` (14) → `exhibit` (8) → `place` (60) → `event` (200) → `person` (150 attribute still-lifes) → `concept` → `practice` → `journey` → `question`. Small batches first so the house style is settled before the long tail.

## 7. Monitoring

```bash
# live progress bar and the last errors
tail -f ~/Documents/GitHub/islam-museum/media/batch.out
```

```bash
# counts, failure rate, average seconds per image and ETA, from the log
python3 - <<'PY'
import json, pathlib, statistics
rows=[json.loads(l) for l in pathlib.Path("media/generation.log.jsonl").read_text().splitlines()]
ok=[r for r in rows if r["status"]=="ok"]; todo=sum(len(json.loads(p.read_text())["seeds"]) for p in pathlib.Path("media/prompts").rglob("*.json"))
avg=statistics.mean(r["seconds"] for r in ok) if ok else 0
print(f"done {len(ok)}/{todo}  errors {len(rows)-len(ok)}  avg {avg:.1f}s/img  ETA {(todo-len(ok))*avg/3600:.1f} h")
PY
```

```bash
# GPU, CPU and memory pressure in a top-like view (asitop needs sudo for powermetrics)
sudo asitop
```

Other checks: the ComfyUI window's queue shows the running job and the last outputs; `tmux attach -t media` shows the live loop; Activity Monitor → Memory → "Memory Pressure" should stay green (a 9B model in bf16 uses roughly 20–30 GB; Qwen-Image around 40–50 GB; you have room for one model at a time plus the OS). If generation slows sharply, the Mac is thermally throttling: pause, or lower the batch to night hours.

Expected throughput on an M4 Max (rough, verify on your first 20 images): Z-Image-Turbo at 1536 × 1024 about 10–20 s per image; FLUX.2 [klein] 9B about 20–40 s; Qwen-Image 1–3 min. Three seeds per entity for 1,000 spine entities ≈ 3,000 renders ≈ one to two nights with klein. The long tail of 10,000 entities is a few weeks of idle machine time, which is why the pipeline is resumable.

### Review

```bash
# applies the automated gates per class and writes the audit file
python scripts/media/illustrate/approve.py place
```

`approve.py` writes `media/review/<batch>/auto-approved.json` for every approval (seed, gate results, timestamp). `ingest.py` then creates the derivatives and the `data/media/*.yaml` records for approved images, sets `media.hero` on the entity if it has none, and queues rejected ones for a new seed or a prompt edit.

Rejection checklist: any text or pseudo-letters; any face; anachronism (modern glass, wires, printed books before 1450, firearms before the 14th century); wrong architecture style for the region (Mughal domes in Andalusia); inaccurate religious practice (prayer postures, qibla orientation, mixed-gender rows where they would not be); sensational violence; "orientalist" clichés (veiled-woman-as-mystery, harem tropes, snake charmers); copyrighted motifs; over-saturated or glossy look that breaks the house style.

## 8. The prompt system

### 8.1 House style (prepended and appended to every prompt)

```
STYLE_PREFIX = "Museum illustration in a restrained, painterly-but-precise style for a digital museum of Islamic civilisation. Palette of warm ivory, sand, lapis blue, deep teal and a little muted gold. Soft natural light, early morning or late afternoon. Historically accurate materials, dress and architecture for the stated place and period. Calm, dignified, spacious composition with a clear focal point and generous negative space for a caption. "
STYLE_SUFFIX = " No text, no letters, no calligraphy, no captions, no watermark, no borders. No faces. No modern objects. Fine, matte, slightly textured finish like gouache on paper. 3:2 composition."
AVOID = "text, letters, words, calligraphy, captions, watermark, signature, border, frame, faces, portraits, eyes, modern clothing, cars, wires, plastic, neon, glossy 3D render, oversaturated, cartoon, anime, lens flare, blur, deformed hands, extra limbs, cross-hatching, photographic grain"
```

Models that take a single prompt (FLUX, Qwen) ignore the negative; keep the "No …" sentences in the suffix. Z-Image and SD-style models can take `AVOID` as the negative prompt.

### 8.2 Figure policy per class

| Policy | Where | Meaning |
|---|---|---|
| `none` | prophets, companions, any event of the Prophetic era, sacred places, relics, Qur'an and hadith | No human figures at all |
| `distant` | battles, cities, journeys, festivals, markets, practices in public | Only small, far, non-identifiable figures, back views or silhouettes, period dress |
| `hands` | practices and crafts (wudu, calligraphy, weaving, cooking, prayer beads) | Hands and objects only, diverse skin tones, no faces |
| `still-life` | people (all), concepts, disciplines | Objects, interiors, landscapes that evoke the person or idea, no figures |

### 8.3 Templates by class (variables in braces come from the entity YAML)

**wing** (9 hero images, 21:9 and 3:2)
```
{STYLE_PREFIX} Hero image for the "{wing_name}" wing of the museum. {wing_motif}. {STYLE_SUFFIX}
```
wing_motif values:
- Time: "A long, low horizon with a great sundial-like courtyard whose shadow sweeps across stone inlaid with a subtle star pattern; crescent moon and sun both faintly visible; layers of architecture receding from mud-brick to marble to modern glass far away"
- Place: "A bird's-eye view of a river valley where a desert road leads to an oasis city with domes and minarets, then mountains, then a distant sea with lateen-sail ships; morning haze"
- People: "An empty scholar's majlis: cushions arranged in a circle on a carpet, open manuscripts, an inkwell, a reed pen, a lamp, a window of carved wooden lattice casting patterned light"
- Ideas: "A domed library interior with light falling from an oculus onto a single open book on a wooden stand, shelves of manuscripts in niches, an astrolabe and a globe nearby"
- Objects: "A museum vitrine composition of an astrolabe, an Iznik-style dish, a glass mosque lamp, a carved wooden Qur'an stand and a textile fragment, each lit softly"
- Words: "An open manuscript with blank illuminated borders in gold and lapis, a reed pen, a burnished page, a lamp; shelves of bound books behind, out of focus"
- Living: "A courtyard home at dusk with lanterns, a laid iftar table seen from above with dates, water, bread and fruit, a prayer rug folded on a bench, henna leaves and an oud nearby, no people"
- Today: "A contemporary mosque with a clean geometric facade beside a modern city at blue hour, a university library and a small bookshop glowing warmly, a tram passing, rain on the pavement"
- Made: "A sunlit shopfront street with a bookshop, a spice merchant, a calligraphy studio and a tailor, awnings in sand and teal, hand-made goods in windows, no signage text"

**period** (12 banners)
```
{STYLE_PREFIX} An evocative panoramic scene that captures the {label} ({start}–{end}), set in {regions}: {period_motif}. Figures: {figure_policy_sentence}. {STYLE_SUFFIX}
```
Examples of period_motif:
- Pre-Islamic Arabia: "a caravan resting under acacia trees by a well at the foot of red cliffs, black tents, incense smoke, a trade road vanishing into dunes"
- Prophetic era: "the valley of Mecca at dawn seen from a hillside, a cube-shaped sanctuary at the centre of a low town, mountains around, pilgrims absent, soft light" (figures: none)
- Rashidun: "a new garrison town of reed and mud-brick on a riverbank, a simple square mosque with a palm-trunk roof, boats, date groves" (figures: none)
- Umayyad: "a great mosque courtyard with golden mosaics of trees and rivers on arcades, marble floor, a fountain, cypresses beyond" (figures: distant)
- Abbasid early: "a round walled city on a wide river at dawn, a green dome at its centre, canals, palm groves, paper mills and libraries hinted by lamps" (figures: distant)
- Abbasid fragmentation / Buyid–Seljuk: "a brick caravanserai gate on a high plateau road, snow on mountains, a caravan of camels and mules, a minaret of patterned brick" (figures: distant)
- Crusades and Ayyubid–Mamluk: "a citadel on a hill over a crowded city of domes, a bimaristan courtyard with a fountain and shade, glass lamps, a river of pilgrims absent" (figures: distant)
- Mongol and post-Mongol: "a turquoise-tiled dome and portal rising over a steppe city, ribbed melon dome, tents outside the walls, blossoming orchards" (figures: distant)
- Gunpowder empires: "three silhouettes of architecture in one horizon: a domed imperial mosque with slender minarets, a tiled bridge over a river, a white marble mausoleum in a garden" (figures: distant)
- Colonial era: "a port city with steamships beside dhows, telegraph poles meeting an old madrasa, a printing press glimpsed in a doorway, a railway station" (figures: distant)
- Modern (1900–1990): "a university campus with a modernist mosque, a radio tower, an open-air cinema, a bus, a bookstall" (figures: distant)
- Contemporary: "a skyline at dusk with an elegant contemporary mosque, a mobile phone screen glow on a balcony, satellite dishes, a laptop on a cafe table beside a Qur'an stand, rain" (figures: distant)

**region** (14 banners)
```
{STYLE_PREFIX} A characteristic landscape and architecture panorama of {region_label}, timeless but pre-modern: {region_motif}. Figures: distant only. {STYLE_SUFFIX}
```
e.g. West Africa & Sahel: "a mud-brick mosque with wooden torons and tapering towers above a river town, pirogues on the water, acacia and baobab, dust-gold light"; Southeast Asia: "a tiered-roof wooden mosque with a tall meru roof among rice terraces and coconut palms, a river with prahu boats, monsoon clouds"; China & East Asia: "a mosque built as a Chinese courtyard with upturned eaves, a pagoda-shaped minaret, stone lions absent, pine trees and a moon gate".

**place** (cities, sites)
```
{STYLE_PREFIX} Artist's impression of {label} around {year} CE ({hijri} AH), {region_label}: {place_motif_from_data}. Architecture and landscape only; {figure_policy_sentence}. Viewpoint: {viewpoint}. {STYLE_SUFFIX}
```
`place_motif_from_data` is assembled from the entity's `kind`, `historical_names`, climate, river/sea, and the buildings linked by `located_in` with `built ≤ year`. Examples:
- Medina (c. 630): "an oasis town of low mud-brick houses and date palms in a plain between black lava fields and a mountain, a simple mosque with a palm-trunk colonnade, wells and gardens, dawn" (figures: none)
- Córdoba (c. 950): "a river with a long Roman bridge leading to a great mosque with striped arches glimpsed through gates, white houses with patios, orange trees, a palace city on the hills beyond"
- Timbuktu (c. 1500): "a Sahelian city of ochre mud-brick with three large mosques with wooden torons, a market square, salt slabs stacked, camels arriving from the north, dunes"
- Samarkand (c. 1420): "a great square of three turquoise-tiled madrasa portals, ribbed domes, an observatory on a hill, orchards and snow mountains"
- Xi'an Great Mosque (c. 1400): "a Chinese-style mosque complex of courtyards, a pagoda minaret, carved wooden pavilions, stone steles blank, pines"
- Jerusalem (c. 700): "a hill city with an octagonal golden-domed shrine on a wide stone platform, cypresses, city walls, limestone glowing"

**building** (only for lost, ruined or heavily altered buildings; surviving buildings use photographs)
```
{STYLE_PREFIX} Architectural reconstruction impression of {label} as it may have looked around {year} CE in {place_label}: {architectural_description_from_data}; materials {materials}; style {style}. Exterior three-quarter view in morning light, no figures. {STYLE_SUFFIX}
```

**event** (the full event system, including maps, scene briefs, per-kind templates, twenty worked prompts and seed coordinates, is in `16-event-maps-and-images.md`)
```
{STYLE_PREFIX} The setting of {label} ({date_human}) at {place_label}: {event_scene}. Figures: {figure_policy_sentence}. Mood: {mood}. {STYLE_SUFFIX}
```
- Battle of Badr (figures: none): "a dry valley with a few wells between low dark hills, two small abandoned camps on either side at dawn, sand, scattered palms, a quiet before anything happens; no weapons visible"; mood: "still, expectant"
- Treaty of Hudaybiyya (none): "an acacia tree by a well on the edge of the Meccan hills, a few tents at a distance, afternoon light"
- Fall of Baghdad 1258 (distant): "a river city under a smoke-darkened sky, bridges of boats, a distant encampment on the plain, manuscripts' pages drifting on the water" mood: "grief, restraint"
- Fatima al-Fihri founds al-Qarawiyyin (none): "a modest courtyard mosque in a new city in a valley, green-tiled roof, a fountain, carpenters' tools resting"
- Mansa Musa's Hajj arrives in Cairo (distant): "a vast caravan of camels with loads approaching a citadel city at sunset, dust, gold-coloured light"
- Conquest of Constantinople 1453 (distant): "a walled city on a point between two seas at dawn, great domed church silhouette, ships on a chain across a harbour, tents on the land side"
- Farewell Pilgrimage (none): "the plain of Arafat with a low rocky hill, empty, under a wide sky at noon"

**person** (attribute still-life; never a figure)
```
{STYLE_PREFIX} A still-life that evokes {label} ({born_year}–{died_year}), {roles_human} of {place_label} in {period_label}: {attributes_from_roles_and_works}, arranged on {surface} by {window_or_light}, {region_architecture_hint}. No people, no portrait, no face. {STYLE_SUFFIX}
```
Role → attributes table (data-driven):
- physician: "glass alembics and vials, a pharmacopoeia manuscript, dried herbs, a balance, a bronze mortar"
- astronomer: "a brass astrolabe, a celestial globe, an observation tube, a zij table manuscript, a quadrant"
- mathematician: "a dust-board with faint geometric diagrams (no legible numerals), compasses, a ruler, a bound treatise"
- jurist / hadith scholar: "stacked bound volumes, a reed pen case, an ink pot, a rosary, a lectern with an open book (text out of focus), a lamp"
- Sufi / poet: "a reed flute, a wool cloak on a peg, a single candle, a bowl of roses, an open diwan (illegible), a courtyard glimpse"
- ruler / caliph: "a signet seal, a folded standard, a map scroll, a sword in its scabbard, a minted coin pile, a cushioned dais, an empty throne room"
- traveler: "a leather satchel, a water skin, a compass rose on parchment, a walking staff, sandals, a sea-chart, a window on a harbour"
- architect / builder: "a plumb line, a set square, a scale model of a dome, tile samples, a scroll of plans (no text)"
- calligrapher: "a reed pen being cut on a bone slab, inkpots in lapis and gold, burnished paper, a knife, a pattern of blank ruled lines"
- merchant: "scales, cloth bolts in indigo and madder, spice sacks, a ledger (illegible), a caravan bell"
- modern scientist: "a laboratory bench with glassware of the 20th century, a chalkboard with faint diagrams (no equations), a window on a university campus"
- athlete: "a pair of boxing gloves on a bench, a towel, a gym window at dawn" (no body, no face)
Examples: Ibn Sina → "A still-life that evokes Ibn Sina (c. 980–1037), physician and philosopher of Hamadan in the Abbasid fragmentation era: glass alembics and vials, a pharmacopoeia manuscript, dried herbs, a balance, a bronze mortar, together with a bound philosophical treatise, arranged on a low walnut table by a lattice window with mountain light, Persian brick vault behind."
Prophets and the Prophet's family: no still-life either; a programmatic calligraphic tile only, plus landscapes of their places.

**polity**
```
{STYLE_PREFIX} An emblematic composition for the {label} ({start}–{end}): the skyline of its capital {capital_label} in its signature architecture ({style}), a coin and a seal on a draped cloth in the foreground (no legible text), a folded standard in {colour}. No figures. {STYLE_SUFFIX}
```

**concept**
```
{STYLE_PREFIX} A symbolic, non-figurative image for the concept of {label} ({term_ar} transliterated {term_latn}): {concept_motif}. {STYLE_SUFFIX}
```
- tawhid: "a single lamp in a vast dark domed space, its light reaching every surface evenly"
- zakat: "a measure of grain being poured from one earthen jar into another on a doorstep at dawn, a bag of coins beside, hands only"
- ijtihad: "a scholar's desk with many open books cross-referenced with ribbons, a reed pen mid-page, a window with the sky brightening"
- waqf: "a fountain, a school courtyard and a bakery all fed from one channel of water running through a street"
- hijra: "a path of footprints leaving a mountain cave at night under stars, toward a distant oasis glow"
- algebra: "a dust-board with balanced geometric squares and rectangles (no numerals), a scale, a reed pen"
- muqarnas: "a close view of a honeycomb vault catching light in cascading cells, stone and plaster"
- adab: "a laid table with a single guest's place prepared with care, a basin and ewer, a folded towel, a book of poetry"

**practice**
```
{STYLE_PREFIX} {practice_label} as lived in {region_or_global}: {practice_scene}. Figures: {hands|distant}. Accuracy: {accuracy_notes}. {STYLE_SUFFIX}
```
- Wudu (hands): "hands cupping water from a stone basin's spout, water in motion, sleeves rolled, morning light; accuracy: right hand first, clean simple basin"
- Salah (distant): "a row of prayer rugs in a sunlit mosque hall, people far away in prostration seen from behind at a low angle, no faces; accuracy: all facing the mihrab, orderly rows, men's and women's areas as separate rows"
- Iftar (hands): "hands passing dates and a glass of water at a crowded table at sunset, lanterns, bread, soup, a window with a crescent moon"
- Hajj / tawaf (distant, from above): "a vast circular motion of white-clad pilgrims around a black cube seen from far above at night, like a galaxy; no faces"
- Eid (distant): "a festive street at morning with lanterns, sweets stalls, children's silhouettes running, new clothes on a line"
- Henna (hands): "a hand being decorated with a fine henna pattern by another hand, a cone, a tray of sweets and candles"
- Qur'an recitation (hands): "a hand following lines of an open illuminated page on a wooden stand, lines out of focus and illegible, a lamp"
- Dhikr (hands): "wooden prayer beads moving through fingers, a dim room with a single candle"

**journey**
```
{STYLE_PREFIX} A leg of {label}: the landscape between {from_label} and {to_label} as travelled around {year}: {terrain_from_geo} with {mode} in the middle distance, {weather}. Figures: distant. {STYLE_SUFFIX}
```
- Trans-Saharan (Mansa Musa): "a caravan of hundreds of camels crossing dunes at sunset, salt slabs and gold-dust bags glimpsed, a far oasis"
- Ibn Battuta at sea: "a dhow with a lateen sail on the Indian Ocean under monsoon clouds, a coral-stone town on the coast"
- Hijra route (figures: none): "a narrow track between black basalt hills, a cave mouth in a mountain, a camel's tracks, night with stars"
- Zheng He: "a great treasure ship with battened sails at anchor off a tropical harbour with a wooden mosque's tiered roof on shore"

**language / script**
```
Programmatic only: text samples are rendered with fonts. Optional generated background: "{STYLE_PREFIX} An abstract paper-and-ink texture background in warm ivory with faint, blurred, illegible pen marks, for a text panel. {STYLE_SUFFIX}"
```

**object** (category illustrations only; real objects use photographs)
```
{STYLE_PREFIX} An illustrative, generic example of a {kind} of the {period_label} {region_label} type, {materials}, {decoration_style}, shown on a neutral museum plinth with soft light. Not a specific real object. {STYLE_SUFFIX}
```

**question** (editorial illustration)
```
{STYLE_PREFIX} A gentle, welcoming editorial illustration for a newcomer's question "{question_en}": {question_motif}. Figures: {policy}. Tone: open, calm, non-didactic. {STYLE_SUFFIX}
```
- "Why do Muslims fast?": "a simple table with a glass of water and three dates in evening light, a window with the sun just set" (none)
- "What is a mosque?": "an empty, sunlit prayer hall with carpets, a mihrab niche, a minbar, shoes left neatly at the door" (none)
- "What is Sharia?": "a path of worn stone steps through a garden between a spring and a house, a lantern at the gate" (none)

**exhibit** (covers)
```
{STYLE_PREFIX} Cover image for the exhibition "{title}": {exhibit_motif}. Figures: {policy}. Cinematic 21:9 panorama. {STYLE_SUFFIX}
```
- The House of Wisdom: "a vast library hall in Abbasid Baghdad with scribes' desks empty, paper, astrolabes, a translator's twin books open side by side, lamps, dawn"
- Women who shaped Islam: "a composition of attributes: a founding charter scroll, a hadith teacher's lectern, a poet's inkpot, a queen's seal, a scientist's astrolabe, a jurist's books, arranged in a madrasa courtyard" (none)
- Islam in China: "a Chinese courtyard mosque with a pagoda-minaret in winter, plum blossom, a copper teapot and a Qur'an stand side by side"

**listing / Made wing** (category tiles)
```
{STYLE_PREFIX} A tile for the "{category}" category of a directory of Muslim-made businesses and works: {category_motif}, contemporary and global, no logos, no brand names, no text. Figures: hands only. {STYLE_SUFFIX}
```
e.g. bookshop: "a small bookshop interior with bilingual spines blurred, a reading nook, a cat asleep on a stack"; modest fashion: "a tailor's table with fabric bolts in sand and teal, pins, a measuring tape, a sketch (no text)"; halal restaurant: "a kitchen pass with steaming dishes, hands plating, copper pots".

### 8.4 Programmatic images (not generated)

- **Calligraphic name tiles** for every person and for all prophets: Arabic name set in Amiri or Reem Kufi on an ivory tile with a faint girih texture; Latin transliteration beneath; rendered by Pillow with libraqm (correct shaping) or satori. These are the *default* hero for people.
- **Arabic text samples** for languages and scripts; **Qur'an verses** in Amiri Quran with proper Uthmani marks from Tanzil text.
- **Girih / star patterns**: SVG generated from parameters seeded by entity ID, used as textures everywhere.
- **Maps**: MapLibre renders at build time or on demand; **timelines** and **charts**: D3.
- **OpenGraph cards**: satori → PNG: name in both scripts, dates in both calendars, a motif.
- **Icons**: a hand-drawn SVG set (crescent-free, neutral): compass, lamp, book, dome, star, astrolabe, footprints, calendar, globe, hands.

## 9. Volume plan

| Phase | Generated images | Programmatic | Documentary |
|---|---|---|---|
| Phase 0–1 (spine) | 9 wings × 2 ratios, 12 periods, 14 regions, 8 exhibits, 60 places, 200 events, 150 person still-lifes, 60 concepts, 25 practices, 10 journeys × 3 legs, 60 questions ≈ 650 approved (≈ 2,000 renders at 3 seeds) | 150+ name tiles, all OG cards, patterns, icons | 150 CC0 photos and scans with alt text |
| Phase 2–3 | long tail by cell batch; object category tiles; building reconstructions (≈ 2,000) | tiles for every person | 500+ objects via IIIF/CC0 imports |
| Later | regenerate everything once when the house style or model improves (prompts and seeds are committed, so this is one command) | | |

## 10. Legal and ethical notes

- Outputs of Apache-2.0 models carry no model-license restriction; we publish our generated images under CC0 with attribution "islam.museum, AI-assisted illustration". Whether AI images are copyrightable at all varies by country; CC0 sidesteps the question.
- Never prompt with the name of a living artist or a copyrighted work as a style reference; the house style is described in plain words.
- Never prompt for a real person's likeness; the pipeline's lint rejects prompts containing a `person` label together with words like portrait, face, man, woman, figure.
- Label every generated image on the page and in the data; provide the hide-illustrations setting; keep the Objects wing documentary.
- Sacred and sensitive subjects follow 05-editorial §3 without exception.
