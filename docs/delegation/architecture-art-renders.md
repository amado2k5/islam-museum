# Architecture and Art gallery: AI-drawn illustrations, work log

Status written 17 October 2026. This is a working log of how the gallery at `/<lang>/art/` was made, what is on main, what is still rendering, and how to resume after a crash.

## 1. What is on main

- **Page:** `site/src/pages/[lang]/art/index.astro` (gallery, three groups: architecture, patterns, art and objects), `[slug].astro` (one detail page per image, image enlarged, full-size link).
- **Data:** `site/src/data/architecture-art.json`, one entry per image with slug, Arabic and English labels, group, and Arabic alt text.
- **Images:** `site/public/media/architecture-art/<slug>.webp`, 1280 px wide, WebP quality 78. Force-added because `site/public/media/` is git-ignored.
- **Menus:** Art, Browse types and Support in the top menu, and the Art, Browse, Support and gift-shop links in the footer.
- **Landing page:** a strip of four random gallery images (`site/src/components/ArtStrip.astro`).

Gallery size on main: 99 images (50 first batch, 49 second batch).

## 2. How the images were made

- **Model:** Z-Image-Turbo (Tongyi-MAI, Apache 2.0), run locally through mflux (`mflux.models.z_image.variants.z_image.ZImage`). 8 steps, 1536 x 1024, no guidance, no negative prompt.
- **Prompt rules:** every prompt ends with a house-style suffix that rules out people, faces, figures, text, writing and letters. Objects are described as plain, centred, on a neutral background.
- **Seeds:** one seed per image, recorded in the render scripts.
- **Masters:** full-resolution PNGs, converted to WebP only after they pass verification.

## 3. Verification

Every image was checked by eye against its brief. Verdicts are PASS, PASS WITH NOTE, or FAIL. The rules were:

- FAIL if any person, face, figure or body is visible.
- FAIL if any text, letters, calligraphy or script-like marks are visible.
- FAIL if the object type is clearly wrong for its name, or it shows a modern item.
- PASS WITH NOTE for a loose match (object type or material close to the name).

Failures were re-rendered once with a corrected prompt, and a second failure was dropped.

This is a visual review, not an automated gate. The illustrations lane's automated approval gates (`docs/agents/lanes/illustrations.md`) are not built yet, so approvals recorded here are the reviewer's judgement and should be treated as such.

### Results so far

- **First batch (50), second batch (49):** on main. Second batch: 49 of 50 approved; the ten-fold star tessellation was excluded after two renders still showed an eight-point star.
- **Art batch (300 items, rebuilt list):** items 001 to 260 were checked in the earlier session (158 pass, 34 with notes, 21 fail, then 22 re-renders queued). That earlier session's render folder was lost (see section 5), so those verdicts and re-renders must be redone once the images are regenerated.

## 4. Scripts and prompt lists

- `items4.json`: the 300-item prompt list, generated from 30 object types times 10 regional styles, with slug, Arabic and English label, group and description.
- `gen_single.py`: single-thread renderer. Skips any slug whose PNG already exists, so it can be restarted safely. Seeds are 5000 plus the item index.
- `persist.sh`: copies finished renders from the scratch folder to a permanent folder every 60 seconds.

Copies of the list, the script and the persistence loop are kept in `~/islam-museum-media/` and in `~/islam-museum-media/art-renders-300/`.

## 5. Incident: renders lost

The earlier session's scratch folder (`…e7a0c6a0…/scratchpad`) was empty when this session started. About 263 renders from items 001 to 263 were lost, along with their verdicts and the three re-render scripts. A whole-disk search (by name and by date, all image extensions, in the last 12 hours, plus Trash and temp folders) found none of them. Items 001 to 007 of the new run are the only art renders that survived on disk from that point.

Lesson: write finished images to a permanent folder as they finish, not only to a session scratch folder. The `persist.sh` loop now does this.

## 6. Current run

- Single thread, started 21:05 on 17 October, restarted from item 001.
- Pace: about 90 seconds per image; 300 images need roughly 7.5 hours.
- Health checks every three minutes (process alive, new images, errors, PNG count).

## 7. How to resume after a crash

1. Check the render folder and the persistent folder: `ls ~/islam-museum-media/art-renders-300 | wc -l`.
2. Copy the persistent folder back into the scratch folder: `cp -n ~/islam-museum-media/art-renders-300/*.png <scratch>/raw4/`.
3. Restart the renderer with `gen_single.py` from the scratch folder (it skips finished images). Start `persist.sh` again.
4. Verify the new images, re-render failures once, convert approved images to WebP in `site/public/media/architecture-art/`, add entries to `architecture-art.json` with group `art`, then commit, merge main, validate, build and push.

## 8. Still open

- Finish the 300-item render.
- Verify every new image (the earlier verdicts were lost).
- Decide whether to publish all approved images or only sampled ones.
- Native-speaker review of the Arabic and English strings added for the gallery, and of the Urdu fallback text.
- The Today page (`/ar/today/`) has no entries, so the menu link leads to an empty page.
