# Hudhud: art bible, the golden scene's brief, and how the art can actually be made

_26 November 2026. Phase 0 and Phase 1. Written by an AI agent. **The look is not accepted.** The founder accepts the visual direction in words before any art is made in number ([instruction](owner-instruction-2026-11-26.md), section 3); until then this page describes a trial._

## Read this first: where the trial stands against the founder's pictures

![The founder's two pictures of Ibn al-Haytham (top) and four captures from the running scene (below)](../evidence/hudhud/golden-scene/comparison-founder-pictures-and-running-scene.webp)

_Top row: `en-09-ibn-al-haytham.jpg` and `ar-12-ibn-al-haytham.jpg`, as supplied, reduced. Below: four captures of the running game on 26 November 2026 (High preset, Chrome, 1920×1080), unretouched._

**What carries over.** The palette (teal walls, midnight sky, lantern gold, terracotta and lapis tile), Hudhud's silhouette (orange body, fan of black-tipped crest feathers, barred wings, long curved beak), the dark room with one beam, the prism and its colours, the turbaned scholar in a teal robe with gold borders, the town at evening through an opening, the upside-down picture on the wall.

**What does not, and it is most of what makes the founder's pictures what they are.**

- His are painted: modelled faces, cloth with weight and embroidery, soft light wrapping round forms, depth of field, grain. The trial is flat shapes with an outline, a two-colour wash and scattered brush marks. It reads as a tidy vector storybook, not as those paintings.
- His figures act with their whole faces. The trial's faces are two eyes, brows and a smile; they blink and tilt, and that is all.
- His Hudhud has feathers. The trial's has shapes.
- His scenes are composed as pictures. A side-on room that must hold a grid of mirrors is composed as a puzzle first.

**The author's own judgment**, for what an author's judgment is worth: the trial is pleasant, readable and consistent, and a child could play it; it is **not** at the level of the supplied art and would not pass as "premium". It is the same kind of result as Granada's code-made art, of which the founder's decision of 26 November 2026 says that neither set is accepted as a production-quality direction and that scripted generation "has not proved that it can author the required finish by itself" ([`owner-decisions-2026-11-26-c.md`](../spec-production/owner-decisions-2026-11-26-c.md)). The founder should expect to reach the same verdict here, and the plan below is written for that case.

## How the art can actually be made

No artist is engaged. No image-generation service is approved. Nothing has been bought. These are the routes, with what each needs from the founder.

| Route | What it is | What this agent can do | What it cannot | Needs from the founder |
|---|---|---|---|---|
| **A. Code-drawn** (the trial) | every picture drawn by Canvas 2D code when a scene opens; no picture files | all of it, now; consistent; tiny to ship; every picture reproducible from a seed | reach painterly depth; draw expressive faces or feathers; it tops out about where the trial is, with perhaps one more level from weeks of polish | only his verdict |
| **B. An illustrator and an animator** | people draw turnarounds, expressions, cut-out parts, environment layers and effects in the look of the supplied art; the agent builds rigs, atlases and scenes from their files | the brief, sprite lists, sizes, the rigging, atlas packing, the pipeline, a manifest of every file | the drawing | to engage and pay people: his decision alone, and the instruction forbids the agent to engage anyone |
| **C. The process that made the thumbnails** | whatever tool and hand produced the 80 pictures makes game parts in the same look: figures on plain grounds, in parts, in poses; layered backgrounds | prepare exact part lists and prompts or briefs; cut, clean, rig, pack and check what comes back; reject what is inconsistent | make the pictures (no such tool is available to it or approved); promise that parts for animation come out consistent, which is the hard part of this route | to say how the thumbnails were made, and to approve that process, and its licence terms, for game art |
| **D. A blend** | B or C for the cast, key props and hero backgrounds; A for what code is good at: light, beams, particles, sky gradients, tile patterns, parallax silhouettes, UI | the split, the pipeline and the code-drawn half | as B or C for the painted half | as B or C |

**Recommendation: D, with the founder choosing B or C for its painted half.** The golden scene was built so that this costs little: every figure is already a set of named parts pinned at named points (below), so replacing a code-drawn part with a painted one is a change of one texture, not of the scene. The light, the beam, the dust, the dark room, the sky and the tile work can stay code and are the parts of the trial that hold up best.

What may **not** be done on any route without his word: cut the supplied thumbnails into puppets or use them as backgrounds (the instruction forbids both); use an image service; publish AI-made portraits on the museum's pages (the museum's rule; the game's figures are imaginings for play and are labelled so, and whether that rule reaches the game's cast is itself a question for him).

**One question decides the route.** How were the 80 thumbnails made, and can that process make more? The archive does not say; its index says only that the English files were downloaded back from YouTube and the Arabic ones are finished files.

## Visual identity (from the supplied art)

| | |
|---|---|
| Palette | midnight `#0a1a36`, deep blue `#10305a`, teal `#1d6f78` and `#3fa39b`, lantern gold `#f2b94b`, amber `#e8892b`, terracotta `#c2643a`, ochre `#d49a45`, lapis `#2b4fa3`, emerald `#2f8f5b`, cream `#f3e6c8`; hoopoe orange `#f08a24` |
| Light | one warm key (sunset or lamp) against cool shadow; glows are additive and soft; night skies keep colour and never go grey |
| Line | a soft dark brown outline (`#2a1a12`), heavier on figures than on rooms |
| Hudhud | small, orange, a fan of eight crest feathers with black tips that opens when he is surprised, flying or landing and lies back when he is calm; black wings with white bars; a long, gently down-curved beak; one large bright eye; never sarcastic in pose |
| People | open, readable poses; large eyes; warmth before accuracy of feature, because no portraits of these people exist |
| Ornament | geometry (eight-pointed stars, bands) and plant forms. **No script as texture, no invented script, no sacred text as decoration.** The Atlas page in the scene carries plain strokes that are deliberately not writing in any language |
| Not to do | one costume, one face and one skyline for every century and region; "Oriental" clutter; wealth as shorthand for a place |

**What must be reviewed before it is drawn in number** (reviewer R3, architecture, material culture and clothing; not named): clothing and architecture by place and century for each of the fifty; the scholar's dress here follows the founder's pictures and has been checked against nothing.

## The golden scene: brief

| | |
|---|---|
| Subject | Ibn al-Haytham's light workshop, opening on a garden and a town at evening (world 3, quest 1) |
| Proves | the atmosphere; Hudhud moving; the Storykeeper; one person of history; one animal; a layered place; conversation; one puzzle; one secret; three depths of movement; sound; UI; three effects presets |
| The place | a dark teal room 1,760 px wide in a world of 2,400 by 720 (the view is 1,280 by 720): a shutter with a small hole, shelves, a niche, a reading stand, a chest; an arch with a curtain; beyond it a terrace with a lantern, a fountain, palms and cypresses, and roofs in two depths under an evening sky |
| The play | a beam enters by the hole; five to seven mirrors on stands (one hung from the ceiling in Challenge) turn it; a tower of books and a tall glazed jar stop it; it falls on the pale page and the ink returns (the prism was taken out on 26 November 2026) |
| The secret | fly to the ledge over the arch and pull the cord: the curtain closes, the room goes dark and the town appears upside down on the curtain, opposite the hole. A feather waits on the fountain |
| Composite, and said to be | the house and the skyline stand for no real building or city (ledger HR-HH-07) |
| The prism | **taken out on 26 November 2026** by the founder's directive: both supplied pictures show one and no museum record read for the scene supports it. The museum note says why none is shown (ledger HR-HH-03) |

## Sprite and animation list (what exists, by part)

Each figure is a container of parts; "pin" is where the part turns. This is the list an illustrator would be asked to redraw.

| Figure | Parts (logical size in px) | Moves the code makes today |
|---|---|---|
| **Hudhud** (about 100 tall) | body 78×62; tail 54×30 (pin at its root); folded wing 56×40; spread wing 96×84 (pin at the shoulder); head with beak 92×50, eye open and shut; crest 74×56 (pin at its root); legs 34×18 | run bob; hop stretch and landing squash; flap (the spread wing beats) and glide (held open); crest opens in the air, on landing and on alarm; tail wag; head nod when speaking; blink |
| **Storykeeper** (about 210) | leg 30×70 ×2; tunic 96×118; arm 28×78; head 96×104, open and shut, in four styles of hair or headwear; satchel with the Atlas 50×56. A girl or a boy × four skins × three outfits × four styles | walks after the bird, legs and arm swinging; looks up when it flies; gestures when speaking; breathes; blinks |
| **The scholar** (about 335) | robe 210×270; arm 60×140; head 150×170, open and shut | turns to the bird; raises his arm when a mirror turns and when he speaks; nods; blinks |
| **The cat** (about 110 wide) | body 120×60; head 58×52, awake and asleep; tail 70×26 | sleeps; wakes when the bird is near; tail flicks; a small hop when greeted |

Props: mirror, three stands, prism, page (pale and inked), feather, curtain, cord, lamp glow, beam strip, rainbow strip, dust mote, sparkle. Places: sky, far roofs, near roofs, garden, room, a dark foreground column with a lamp, foreground leaves, the wall picture.

**Not yet made, and needed for the slice:** turnarounds (figures face one way and are mirrored); a walk cycle with knees; expressions beyond glad, thinking and alarmed (which today only move the crest and the arm, not the face); hands that hold; a perching pose and a pecking pose for Hudhud; a second animal that moves about.

## UI wireframe (as built)

```
+--------------------------------------------------------------------------------+
| Hudhud: The Atlas of Wonders  (Working title) [Prototype]   [music] [Pause] [Settings]
+--------------------------------------------------------------------------------+
| +----------------------------+                                 +-------------+ |
| | goal · mirrors turned: n   |                                 |  captions   | |
| +----------------------------+        the picture              +-------------+ |
|                                     (canvas, 16:9)                             |
|                          ( Touch mirror 3 )                                    |
|  (<) (>)                                                    ( Touch )   (^)    |
+--------------------------------------------------------------------------------+
| The scene in words                   | Museum note                             |
| "The beam meets: mirror 1 … It stops | game, not history · review pending      |
|  at the tower of books."             | pictures are a code-drawn trial         |
| [Turn mirror 1: leaning up …]        | nothing leaves this device              |
| [Go to Ibn al-Haytham] …             | Controls: keyboard · touch · gamepad    |
+--------------------------------------------------------------------------------+
A talk replaces the goal:  (face)  Name / the line / [choices…] [Next] [Back] what was said · skip
Sheets over the page: Paused · Settings · What was said · Results with the museum note
```

On a narrow screen the goal moves above the picture and the talk below it. Arabic and Urdu mirror the page; the picture, the beam and the arrow buttons are never mirrored.

## The second room: al-Jazari's workshop (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the workshop (`art/jazari.ts`, 440 lines; the figures in `art/cast.ts`), and like it a **trial awaiting the founder's word on the look**: no more rooms are drawn before it. One long room of 2,400 by 720 game pixels with the workshop's floor: warm plaster, terracotta below and dusk blue above; a band of star tiles in lapis and terracotta; a pointed window with plain lattice lines and an evening sky; a shelf of gears; a saw and a pair of dividers on pegs; a stone water basin (decoration only: it claims nothing); a long workbench where the spare parts stand; a high shelf with two pots, gears and the box that holds the feather; and on a low platform a frame of two posts and an arched brass beam with five plinths, each numbered by dots, joined by a dotted line in the order the motion passes. The parts are the clock quest's own pictures (`art/bench.ts`, drawn again at 120 by 120 for the room through its new `drawPart`). No elephant is drawn: the frame is the game's own and the room's note says so. No inscription, no writing, no real building.

| Figure | Parts | Moves the code makes |
|---|---|---|
| **Al-Jazari** (about 335) | the scholar's cut-out (`scholar(scale, JAZARI_LOOK)`): robe in terracotta, a lapis turban with gold bands, a darker beard, a leather apron; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when a part is put in place and when he speaks; blinks |
| **The apprentice** (about 175) | the explorer's cut-out in one fixed look (`apprentice(scale)`: a headscarf, a red tunic) with a work apron; an invented person, and her label says so | looks at the bird; waves when she speaks; a small hop when spoken to; blinks |
| **The clock's parts** | the float in its water, the falcon with its ball, the dragon, the vessel with the gong, the bowl of balls, the bird on its dome, the rider (each 120 by 120) | stand in their places or on the workbench; ride in Hudhud's beak at half size when carried; each place glows gold as the run passes it, red where it stopped; a gold ball shows at the last place the ball reached |
| **Props** | the lever and its block, the ball, the feather, the page of the Atlas | the lever leans over once pulled; the page comes loose above the last place when the clock works |

**Script size** (measured 27 November 2026, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-CWHEXDpU.js` is 1,744,176 bytes (375,559 with Brotli at quality 11, 468,734 with gzip at level 9), its style 19,372 bytes; with the journey it was 1,712,305 bytes (368,754 with Brotli) and 18,723 of style. The room engine and the second room add 31,871 bytes (6,805 with Brotli).

**Measured beside the workshop** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 45.3 MB | interior, columns of at most 2045×1080 | 129 | 19 | 8.33 / 9.2 / 9.4 / 9.7 ms | 0 of 1,702 | 88 MB |
| Al-Jazari's workshop | 42 | 18.9 MB | jazari-room, columns of at most 2045×1080 | 51 | 8 | 8.33 / 9.2 / 9.4 / 9.5 ms | 0 of 1,701 | 60 MB |

The room has fewer textures and objects and about half the draw calls because it has no sky, no town in two depths, no beam and no dust. Opening the room ten times left the same 42 textures and 51 objects; with a forced collection after each ten openings (a scratch script, not kept) the heap read 61, 35, 35 and 35 MB, and the workshop's 37 and 37 MB: nothing climbs. A lost graphics context in the room is told to the player and the room is drawn again with the clock as it stood.

## The third room: al-Tusi's observatory (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other two rooms (`art/tusi.ts`, 400 lines; the figures in `art/cast.ts`; the model drawn each frame in `scenes/tusi.ts`), and like them **trial art, a trial of the look and not final art**; the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a hall at night, night blue above and warm stone below, plain pointed arches along the wall with no writing, the band of star tiles in lapis and teal, and cooler stone slabs; a tall arched opening on the night sky with painted stars, far hills and, at Medium and High, a few stars that twinkle (none at Low, still with reduced motion); a tall case of books (coloured spines with gold bands, no titles, no writing), its two upper shelves perches; in the middle **the model's stand**: a broad base (a perch), a column, a brass fork that holds the large circle, a dark disc behind the circles so that they read, a post for the crank; and at the far end a long table and a high shelf of **plain instruments**: rings on small wooden feet, rods and closed boxes, none drawn as or claiming to be a named historical instrument. No inscription, no writing, no real building, and no picture of the observatory at Maragha (the room's note says so).

| Figure | Parts | Moves the code makes |
|---|---|---|
| **Al-Tusi** (about 335) | the scholar's cut-out again (`scholar(scale, TUSI_LOOK)`): a lapis robe, a pale turban with lapis bands, a grey-streaked beard, light gold borders; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when the circles are turned and when he speaks; blinks |
| **The girl who cleans the instruments** (about 175) | the explorer's cut-out in one fixed look of her own (`cleaner(scale)`: a headscarf, a green tunic) with a pale cleaning cloth over her shoulder; the quest's invented person, and her label says so | looks at the bird; waves when she speaks; a small hop when spoken to; blinks |
| **The model of the two circles** (300 across) | drawn each frame with one Phaser graphics object from `modelOf()` (`sim/tusiroom.ts`), the quest's own arithmetic, as the page's picture is (`art/couple.ts`): the large circle as a heavy cream ring with a dot at its middle, the small circle in teal with a gold rim, the arm to its centre in dashes, the spoke to the point, and the point as a gold star in a dark ring (shape, not colour alone) | turns while a turning is shown (once round in 2.4 s, as on the page), at once with reduced motion; redrawn only when what it shows changes |
| **The path in the air** (300 across, beside the model) | a faint ring the size of the large circle, the traced path as a dark line under a gold one, and the point as the same star; a soft glow once a path is drawn | grows while a turning is shown; whole and closed after it; gone once a lever is moved (the rules clear the path) |
| **The levers** | a wooden handle and a brass knob of its own shape (round for the direction, square for the speed, a ring for the size) on a pivot block with one dot for each setting offered; only the levers the way of playing offers are drawn | lean from -30 to 30 degrees to the setting chosen |
| **The crank** | a brass spoked wheel with a wooden handle on its post | turns once while a turning is shown |
| **Props** | the feather, the page of the Atlas | the feather lies among the instruments on the high shelf until found; the page comes to rest above the path in the air once it is a line |

**Script size** (measured 27 November 2026, UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-BC3SrFbr.js` is 1,774,170 bytes (380,608 with Brotli at quality 11, 477,888 with gzip at level 9), its style 19,372 bytes (unchanged); with al-Jazari's room it was 1,744,176 bytes (375,559 with Brotli). The third room adds 29,994 bytes (5,049 with Brotli).

**Measured beside the other two rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, all three run in the same session after the last merge of `main`; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 47.5 MB | interior, columns of at most 2045×1080 | 129 | 19 | 8.32 / 9.2 / 9.7 / 12.5 ms | 0 of 1,703 | 96 MB |
| Al-Jazari's workshop | 42 | 19.8 MB | jazari-room, columns of at most 2045×1080 | 51 | 8 | 8.33 / 9.2 / 9.4 / 11.0 ms | 0 of 1,695 | 67 MB |
| Al-Tusi's observatory | 39 | 19.2 MB | tusi-room, columns of at most 2045×1080 | 57 | 10 | 8.34 / 9.1 / 9.3 / 10.4 ms | 0 of 1,698 | 68 MB |

(Texture memory here is the decoded bytes `info()` counts, in millions of bytes: 47,529,904, 19,776,420 and 19,165,644.) The observatory has two draw calls more than al-Jazari's workshop: the model and the path in the air are drawn by two graphics objects, not textures. Opening the room ten times left the same 39 textures, 19,165,644 bytes and 57 objects. A lost graphics context in the room is told to the player and the room is drawn again with the quest as it stood (one turning counted). Play to scene: 433 ms.

## The fourth room: al-Khwarizmi's room (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/khwarizmi.ts`, 594 lines; the figures in `art/cast.ts`; the trays' boxes and coins placed by `scenes/khwarizmi.ts`), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a quiet scholar's room by day, warm plaster above and ochre low down, plain round arches along the wall with no writing, the band of star tiles in terracotta and teal, and warm stone slabs; an arched window with a wooden lattice, a pale sky and a palm far off; a tall case of books and scrolls (coloured spines and plain cream rolls, no writing); a low writing desk with a plain dark inkpot, two reed pens and a blank sheet, and a cushion before it; a low stand with the two weights; a long table with the two trays standing on it and two gold bars of an equals sign between them, as on the page's picture; and a plain stone plinth by the door with the locked box on it. **No numeral and no writing is drawn anywhere in the room.**

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Al-Khwarizmi** (about 335) | the scholar's cut-out again (`scholar(scale, KHWARIZMI_LOOK)`): a green robe, a pale turban with green bands, a dark beard, ochre borders; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when a move is made and when he speaks; blinks |
| **The child who carries the box** (about 175) | the explorer's cut-out in one fixed look of the child's own (`boxCarrier(scale)`: a round cap, a red tunic) with a cloth strap across the chest; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The two trays** (370 by 226 each) | painted in the room: a parchment board in a dark wooden frame on two small feet, with a strip along the bottom set off by a line, where what is taken away stands | none; what they hold changes |
| **Boxes and coins on the trays** | the page picture's shapes (`trayBox`, `trayCoin`): a closed wooden box with lid and clasp for a thing (44 across), a gold coin for a unit (24 across), and for what is taken away the same shape as a dashed outline with a bar through it (shape, not colour alone); placed from `trayLayout()` each time the problem changes, the first side on the right tray on a right to left page | appear and vanish with the problem; no motion between the trays |
| **The weights** | a squat brass bell with a handle (`weight`), one marked on its face with a small box shape and one with a coin shape; no numeral | dip a little when touched |
| **The scoop** | a wooden scoop lying on its side (`scoop`) | tips when touched |
| **The locked box** | a wooden chest with brass corners and a padlock (`lockedBox`), shut, or with its lid thrown back and the lock hanging open | opens when one thing equals a number; the page of the Atlas rises out of it and rests above it |
| **Props** | the feather, the page of the Atlas | the feather peeks from under the box until found |

**Script size** (measured 27 November 2026, UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-BNg-KE9W.js` is 1,806,410 bytes (385,697 with Brotli at quality 11, 487,975 with gzip at level 9), its style 19,372 bytes (unchanged); with al-Tusi's room it was measured at 1,774,170 bytes (380,608 with Brotli), and `main` has gained a small fix to al-Jazari's room since, so the fourth room adds about 32 KB (about 5 KB with Brotli).

**Measured beside the other three rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, all four run one after another in the same session; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 47.5 MB | interior, columns of at most 2045×1080 | 129 | 19 | 8.33 / 9.2 / 9.4 / 12.1 ms | 0 of 1,700 | 94 MB |
| Al-Jazari's workshop | 42 | 19.8 MB | jazari-room, columns of at most 2045×1080 | 51 | 8 | 8.33 / 9.2 / 9.4 / 11.2 ms | 0 of 1,703 | 64 MB |
| Al-Tusi's observatory | 39 | 19.2 MB | tusi-room, columns of at most 2045×1080 | 57 | 10 | 8.33 / 9.2 / 9.6 / 14.3 ms | 0 of 1,704 | 67 MB |
| Al-Khwarizmi's room | 41 | 19.2 MB | khwarizmi-room, columns of at most 2045×1080 | 41 | 8 | 8.33 / 9.1 / 9.3 / 16.3 ms | 0 of 1,700 | 65 MB |

(Texture memory is the decoded bytes `info()` counts: 47,529,904, 19,776,420, 19,165,644 and 19,196,856.) The trays' boxes and coins are images drawn from four small textures, so the room adds no graphics object and stays at 8 draw calls; its single slowest frame, 16.3 ms, was under the 16.7 ms of a 60 Hz frame. Opening the room ten times left the same 41 textures, 19,196,856 bytes and 41 objects. A lost graphics context in the room is told to the player and the room is drawn again with the quest as it stood (one slip counted, the same sentence). Play to scene: 266 ms. Run again after the merge of `main` (the same day, the workshop and this room only): the room 41 textures, 19,196,856 bytes, 41 objects, 8 draw calls, frames 8.33 / 9.2 / 9.4 / 12.6 ms, 0 of 1,700 over 16.7 ms; the workshop 8.33 / 9.0 / 9.3 / 11.1 ms, 0 of 1,704.

## Measurements (one machine, not a reference machine)

The founder's MacBook Pro (Apple M4 Max, 128 GB, macOS 27.2.1), Chrome 158, a 120 Hz display, device pixel ratio 1, window 1920×1080; `gaming/tools/hudhud-play.ts`, 26 November 2026. The reports are in [`../evidence/hudhud/golden-scene/`](../evidence/hudhud/golden-scene/). **Neither reference machine (M1 Air 8 GB; Windows 11, i5-1135G7, 8 GB) has run it. No 60-minute profile and no four-hour soak has been run.**

| Preset | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time over 14 s: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Low | 44 | 19.9 MB | the room, 1760×720 | 79 | 15 | 8.33 / 9.1 / 9.3 / 10.2 ms | 0 of 1,699 | 56 MB |
| Medium | 45 | 44.8 MB | the room, 2640×1080 | 119 | 19 | 8.34 / 9.2 / 9.4 / 18.7 ms | 1 of 1,697 | 82 MB |
| High | 45 | 79.7 MB | the room, 3520×1440 | 170 | 20 | 8.33 / 9.1 / 9.3 / 9.5 ms | 0 of 1,701 | 120 MB |

- The frame time is the display's 8.33 ms: the machine is not being worked, so these numbers say the scene is light, not how light.
- **From Play to the scene on screen: 350 to 415 ms** (every picture is painted in that time). **First flight: 6 s after pressing Play** in the script, which reads three lines first.
- **The download** for Hudhud's page in a release: 1,712,305 bytes of script (368,754 with Brotli at quality 11, 458,761 with gzip at level 9), 18,723 of style, no picture or sound file (measured 27 November 2026, UTC, with the journey and its doors: one door and one plain corridor drawn in code, from the built file `app-ClHkDr7S.js` that `build:release` wrote, compressed with Node's zlib). Past measurements, kept: 1,701,486 bytes (365,505 with Brotli) and 17,532 of style with Karima's copies; 1,685,922 bytes (362,446 with Brotli) and 16,737 of style with al-Razi's loose leaves; 1,678,439 bytes (360,482 with Brotli) and 16,594 of style with the Alhambra and the dry fountain; 1,656,596 bytes (355,841 with Brotli) and 16,274 of style with the journey of coffee; 1,648,736 bytes (352,941 with Brotli) and 15,330 of style with al-Tusi's two circles; 1,635,886 bytes (350,344 with Brotli) and 14,854 of style with Ibn Battuta's thread; 1,623,139 bytes (347,824 with Brotli) and 14,614 of style with the paper of Samarkand; 1,590,733 bytes (341,288 with Brotli) and 14,272 of style with the five quests, which was what this line gave before and was out of date; the first measurement was 1,456,166 bytes of script, 311,102 with Brotli, and 7,238 of style). The budget in the instruction is 15 to 20 MB.
- **Leaving and returning**: ten restarts of the scene leave the same 45 textures, 119 objects and no running tween. Twelve full rebuilds of the game, with a forced collection after each, read 82 to 83 MB or 132 to 133 MB (a rebuilt generation not yet collected) and do not climb: 81.9 MB after the first, 82.5 MB after the twelfth.
- **A lost graphics context** (forced with `WEBGL_lose_context`): the player is told, and the picture is rebuilt and playing within 2.5 s of the context returning; the quest is kept as it stood and the bird returns to the door.
- **No texture exceeds 2048 pixels** since 26 November 2026: the wide pictures (sky, roofs, room) are uploaded as columns. Before that, High used one of 3520×1440. The table above was measured before the change; the totals in megabytes are the same to within a tenth (19.9, 44.8 and 79.6), and the count of textures rose to 43, 47 and 48.

**Art time.** The code that draws the scene (`src/art/`, 1,715 lines) was written in roughly twenty minutes of the session and corrected in three rounds after looking at captures. That is fast because it is simple, which is the point of the section above.

## What scaling would cost (a projection, not a measurement)

| | One scene today | A world of five quests | Fifty quests |
|---|---|---|---|
| Code-drawn (route A): script | 88 KB of game code over the engine | about 250 to 400 KB | 2 to 4 MB, loaded a world at a time |
| Code-drawn: texture memory at Medium | 45 MB | 45 to 60 MB at a time if one quest's pictures are held and the last released (as now) | the same: it does not add up |
| Painted (routes B to D): files | none | perhaps 6 to 12 MB of WebP atlases a world (cast shared across the game, places per quest) | 60 to 120 MB in all, streamed a world at a time; first load within 15 to 20 MB if the hub and world 1 are kept to that |
| Painted: people's time | none | weeks, by an illustrator and an animator | about a year at a world a month |

The file sizes for painted art are estimates from general practice and have no measurement of this game behind them.

## Media budget (proposed, to be set by measurement before production)

| | Budget |
|---|---|
| First load (page, engine, hub, first quest) | 15 MB compressed at most; today 0.3 MB |
| A world | 12 MB compressed, fetched when the world is entered |
| Texture memory at any moment | Low 48 MB, Medium 96 MB, High 160 MB |
| One texture | 2048 on a side; 4096 only with a measured reason written down |
| Music | the museum's suite, already hosted and streamed; nothing new |
| Sound effects | synthesised in code today (none to host); if recorded later, 1 MB a world |
