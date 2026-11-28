# Animals walking — step C evidence

Six frames from `tools/granada-animals-walk-shot.ts` against the local workspace server (seed 7, Photo Mode, High, motion on), 2026-11-28:

- `pasture-0/1/2.png` — a pasture at ~0.7 s intervals: sheep and goats amble and graze, the donkey grazes beside them; legs swing on the authored leg geometries.
- `caravan-0/1/2.png` — the west road: two camels pace at caravan speed on the far side of the riders, legs swinging; the ox-carts and riders share the same road system.

All six kinds load their authored glTF (`models` lists all six `granada/animals/*`, no page errors). The camel is new in this change: `granada_animals.py` gained a hump and a camel spec (1,620 triangles), `animals.ts`/`buildings.ts`/`three-valley.ts` give it instanced bodies and legs, `CAMEL_LEGS` joints, a code-made fallback shape, and a slow road pace. Consecutive frames differ well beyond compression noise (pixel diff checked).

Not checked: how the camel reads at distance in the composed valley, and the side-view references in `granada/reference/` could not be opened by this model — proportions follow the horse/donkey family conventions, for the founder's eye.
