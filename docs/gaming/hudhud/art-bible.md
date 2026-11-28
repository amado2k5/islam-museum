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

## The fifth room: al-Kindi's room (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/kindi.ts`, 493 lines, which draws the quest's own signs and marks with `art/cipher.ts`; the figures in `art/cast.ts`; the board's pieces placed by `scenes/kindi.ts`), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a scholar's study by lamplight, deep teal walls warming to brown low down, the band of star tiles dimmed by the night, dark stone slabs; an arched window with a lattice on a night sky with stars and a thin crescent; a bookcase (coloured spines, no writing); a reading desk with a closed book and a small clay oil lamp whose glow breathes on the wall; two count boards on stands; and on the wall the large board in a dark wooden frame, with a parchment strip along its top, a brass cord the tiles hang from, a ledge along its foot (a perch), a long shelf of tokens on two brackets below it, and a bell on a low stand beside it. **No letter of any script, no writing and no numeral is drawn anywhere in the room**; a unit test runs every painter of `art/kindi.ts` against a recording canvas and finds no call to `fillText` or `strokeText`.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Al-Kindi** (about 335) | the scholar's cut-out again (`scholar(scale, KINDI_LOOK)`): an indigo robe, a pale turban with saffron bands, a dark beard, gold borders; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when a sign is given and when he speaks; blinks |
| **The young messenger** (about 175) | the explorer's cut-out in one fixed look of his own (`messenger(scale)`: a boy in a green tunic) with a leather strap across the chest and a pouch at the hip; the quest's invented person, «حامل الرسالة الصغير» in Arabic, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The board's strip** | the message's marks in order, the quest's ink shapes (`markArt`), small, with a short red line under the first two (`openingLine`), as on the page's picture | when the page reads, each mark shows the sign it stands for |
| **The tiles and places** | a plain parchment tile on a short cord for each mark the message uses (`tile`, the mark on it), and under each a place (`slotArt`): a dashed frame while empty, a solid lapis frame with the sign in it once given | the sign appears and changes with the quest's state; a burst of sparks when one is given |
| **The tokens** | each sign of the page (`signArt`, the quest's own drawn signs) on a small wooden stand (`tokenBase`) | rises a little when picked up; hidden while in the beak; dimmed while a mark has it |
| **The sign in the beak** | the same sign at half size by Hudhud's beak | follows the bird |
| **The count boards** (150 by 236) | the page's two tables as bars of dots (`countBoard`): each row the sign or mark, then one dot for each time it occurs, the commonest first; a small whole page with a sun, or a folded message with a mark, at the head; mirrored on a right to left page | none |
| **The bell** | a small brass bell on a strap (`bell`) | swings when rung |
| **Props** | the torn page on the bookcase (`tornPage`: parchment with a ragged edge and four of the quest's ink marks), the feather | the feather peeks from under the page until found |

**Script size** (measured 27 November 2026, UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-BFbKDH7O.js` is 1,838,405 bytes (390,812 with Brotli at quality 11, 499,415 with gzip at level 9), its style 19,496 bytes (124 more, for the room's tables of counts); with al-Khwarizmi's room it was measured at 1,806,410 bytes (385,697 with Brotli), so the fifth room adds about 32 KB (about 5 KB with Brotli).

**Measured beside the other four rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, all five run one after another in the same session; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 47.5 MB | interior, columns of at most 2045×1080 | 129 | 19 | 8.33 / 9.2 / 9.3 / 14.7 ms | 0 of 1,698 | 92 MB |
| Al-Jazari's workshop | 42 | 19.8 MB | jazari-room, columns of at most 2045×1080 | 51 | 8 | 8.33 / 8.9 / 9.3 / 9.4 ms | 0 of 1,692 | 64 MB |
| Al-Tusi's observatory | 39 | 19.2 MB | tusi-room, columns of at most 2045×1080 | 57 | 10 | 8.33 / 9.1 / 9.4 / 11.7 ms | 0 of 1,699 | 64 MB |
| Al-Khwarizmi's room | 41 | 19.2 MB | khwarizmi-room, columns of at most 2045×1080 | 41 | 8 | 8.33 / 9.2 / 9.5 / 12.6 ms | 0 of 1,697 | 63 MB |
| Al-Kindi's room | 54 | 20.3 MB | kindi-room, columns of at most 2045×1080 | 105 | 9 | 8.33 / 9.1 / 9.4 / 11.9 ms | 0 of 1,702 | 66 MB |

(Texture memory is the decoded bytes `info()` counts: 47,529,904, 19,776,420, 19,165,644, 19,196,856 and 20,310,600.) Al-Kindi's room holds more objects than the others (the strip of up to thirty marks, a tile, a place and a sign for each mark, and a stand and a sign for each token are each an image) and a texture for each mark and sign, but they are small: it adds about 1.1 MB of textures to the other rooms' and one draw call. Opening the room ten times left the same 54 textures, 20,310,600 bytes and 105 objects. A lost graphics context in the room is told to the player and the room is drawn again with the quest as it stood. Play to scene: 305 ms.

## The sixth room: al-Idrisi's hall (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/idrisi.ts`, 405 lines, which draws every sheet with the page quest's own `drawSheet` from `art/sheets.ts`; the figures in `art/cast.ts`; the sheets, their shadow, frame and seam marks placed by `scenes/idrisi.ts`), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a bright hall by day, warm sand walls paler high up, the band of star tiles in terracotta and teal, pale stone slabs; three tall arched windows on a pale sky with soft clouds and a wooden lattice, the sunlight falling from them across the wall and the floor; a tall shelf of plain parchment rolls and books (coloured spines, no writing); a basket of rolled sheets by the far end; and in the middle the **great table seen at an angle**, its wooden top a trapezoid sloping from a high back edge (640 wide) to a low front one (800 wide), with three low rails along it and short front legs. By it a plain brass lamp stands on a low stand. **No globe, no disc, no inscription, no letter of any script and no numeral is drawn anywhere in the hall**; a unit test runs every painter of `art/idrisi.ts` against a recording canvas and finds no call to `fillText` or `strokeText`, and another holds each sheet on the table to the page's own drawing, call for call.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Al-Idrisi** (about 335) | the scholar's cut-out again (`scholar(scale, IDRISI_LOOK)`): a sea-green robe and shawl, a white turban with teal bands, a dark beard, gold borders; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when two sheets are exchanged and when he speaks; blinks |
| **The young helper** (about 175) | the explorer's cut-out in one fixed look of the helper's own (`mapHelper(scale)`: a headscarf, a teal tunic) holding a loose sheet of parchment against the chest; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The sheets** (100 game pixels square at the front row, 93 and 86 per cent further back) | each the page quest's own drawing (`sheetArt`, which calls `drawSheet`): parchment, a coast (a thick line with water ticks), a river (a blue double line) and a road (dots) made from the edge codes, its number as dots in a corner; mirrored on a right to left page, as on the page | an exchanged pair slides into its new places; a lifted sheet rises a little and grows by six per cent |
| **The lifted sheet's shadow and frame** | a soft dark shadow (`sheetShadow`) and a thick gold frame (`liftFrame`) | follow the lifted sheet |
| **The seam marks** | the page's broken red line (`seamMark`, upright or lying), on every seam that does not match, in Story and Explorer only | appear and go with the quest's state |
| **The lamp** | a plain brass oil lamp with a small flame (`lamp`) on a low stand | its light breathes; it flares when the map is checked |
| **Props** | the stack of blank loose sheets on the tall shelf (`looseStack`), the feather | the feather peeks from under the stack until found |

**Script size** (measured 27 November 2026, UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-BsWdJavn.js` is 1,868,115 bytes (395,780 with Brotli at quality 11, 509,691 with gzip at level 9), its style 19,670 bytes (174 more, for the hall's rows of sheet buttons and table of edges); with al-Kindi's room it was measured at 1,838,405 bytes (390,812 with Brotli), so the sixth room adds about 30 KB (about 5 KB with Brotli).

**Measured beside the other five rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, all six run one after another in the same session, between 14:19 and 14:24 local time, with the load average between about 5 and 9.5 as `uptime` read it before and after each run; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Largest | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 47.5 MB | interior, columns of at most 2045×1080 | 129 | 19 | 8.33 / 9.1 / 9.4 / 11.4 ms | 0 of 1,701 | 95 MB |
| Al-Jazari's workshop | 42 | 19.8 MB | jazari-room, columns of at most 2045×1080 | 51 | 8 | 8.33 / 9.3 / 9.6 / 10.5 ms | 0 of 1,702 | 66 MB |
| Al-Tusi's observatory | 39 | 19.2 MB | tusi-room, columns of at most 2045×1080 | 57 | 10 | 8.33 / 9.2 / 9.5 / 11.9 ms | 0 of 1,701 | 65 MB |
| Al-Khwarizmi's room | 41 | 19.2 MB | khwarizmi-room, columns of at most 2045×1080 | 41 | 8 | 8.33 / 9.3 / 9.6 / 10.9 ms | 0 of 1,704 | 67 MB |
| Al-Kindi's room | 54 | 20.3 MB | kindi-room, columns of at most 2045×1080 | 105 | 9 | 8.33 / 9.2 / 9.6 / 12.0 ms | 0 of 1,705 | 66 MB |
| Al-Idrisi's hall | 49 | 20.1 MB | idrisi-hall, columns of at most 2045×1080 | 89 | 9 | 8.33 / 9.3 / 9.6 / 11.3 ms | 0 of 1,702 | 65 MB |

(Texture memory is the decoded bytes `info()` counts: 47,529,904, 19,776,420, 19,165,644, 19,196,856, 20,310,600 and 20,104,632.) The hall holds a texture for each sheet of the way of playing's map (twelve in Explorer) and an image for each place on the table and for each of up to forty seam marks; they are small: it adds about 0.9 MB of textures to the plainest rooms' and one draw call. Opening the hall ten times left the same 49 textures, 20,104,632 bytes and 89 objects. A lost graphics context in the hall is told to the player and the hall is drawn again with the map as it stood. Play to scene: 248 ms.

## The seventh room: al-Razi's study (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/razi.ts`, 366 lines, which draws every leaf with the page quest's own `drawLeafPaper`, `drawLeafSigns`, `drawChosenRing` and `drawPlaceDots`, taken out of `art/leaves.ts`'s `drawLeaves` so that the page and the study share them, the page's picture drawing call for call as before; the figures in `art/cast.ts`; the leaves, their slots, the ring, the thread and its knot placed by `scenes/razi.ts`), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a quiet study, warm plaster walls, the band of star tiles in ochre and teal, warm wooden floorboards; three tall arched windows on a late afternoon sky, the light falling from them across the wall and the floor; a tall bookcase of books (coloured spines, no writing) and bound notebooks lying in stacks (plain covers tied with a red cord); a low cupboard of bound notebooks by the far end; and along the middle a **long desk** (1,000 game pixels) with a low shelf of notebooks under it, on whose top the **plain wooden slots** of the notebook stand in a row, each numbered by the page's own dots, each holding a leaf. At the end of the desk stands a **plain binding frame** (two uprights, a crossbar, three cords and a spool of red thread), taller than the bird so that its top shows over it. **Nothing medical is drawn: no bottle, no jar, no instrument, no patient and no bed**; the room is a place of books and notebooks. **No inscription, no letter of any script and no numeral is drawn anywhere in the study**; a unit test runs every painter of `art/razi.ts` (and al-Razi's and the child's cut-outs) against a recording canvas and finds no call to `fillText` or `strokeText`, another holds each leaf on the desk to the page's own drawing, call for call, and a third finds no prop but the feather in the study and no word for a bottle, jar, flask, vial, instrument, patient, bed, potion, remedy, dose, pill or herb in its code.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Al-Razi** (about 335) | the scholar's cut-out again (`scholar(scale, RAZI_LOOK)`): a walnut-brown robe, an ochre shawl, a cream turban with brown bands, a dark beard greying, gold borders; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when two leaves are exchanged and when he speaks; blinks |
| **The child who helps** (about 175) | the explorer's cut-out in one fixed look of the child's own (`leafChild(scale)`: a boy in a red tunic) holding two blank loose leaves against the chest; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The leaves** (the page's own leaf at 0.72: about 75 by 112 game pixels in Challenge's row of eight, 103 in Explorer's six, 108 in Story's four) | each the page quest's own drawing (`leafArt`, which calls `drawLeafPaper` and `drawLeafSigns`): a paper leaf with a folded corner and a hole for the thread, a sign for its part of the body (a head and shoulders with no face, a ribcage, a rounded belly, a footprint) and a mark for its kind (a closed book or an open eye); in three looks, as on the page: plain, held by the binding (a gold outline), and where the binding stopped (a pink leaf with a broken red outline: shape, not colour alone) | an exchanged pair slides into its new places; a lifted leaf rises out of its slot and is held up in front of the bird |
| **The slots** | a plain wooden block with a groove for each place, the page's dots on its front (one dot for place one, eight for place eight) | still |
| **The lifted leaf's ring and shadow** | the page's own ring round the place chosen (`drawChosenRing`: a thick light line with a dark edge) and a soft shadow | follow the lifted leaf |
| **The thread** | the page's red thread (`threadArt`), a length from outside the row into the first leaf and one into each leaf after it that held, and the page's knot after the last when the notebook is bound | grows a leaf at a time as a binding is shown (at once with movement kept still) |
| **The binding frame** | two uprights, a crossbar, three pale cords and a spool of red thread on a peg (`bindingFrame`) | sways a little while a binding is shown |
| **Props** | the bundle of blank loose leaves on top of the bookcase, tied with a loose turn of thread (`leafBundle`), the feather | the feather peeks from between the leaves until found |

**Script size** (measured 27 November 2026, UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-BkJWzCW8.js` is 1,898,053 bytes (399,724 with Brotli at quality 11, 520,036 with gzip at level 9), its style 19,670 bytes (unchanged: the study's list reuses the hall's row of buttons); with al-Idrisi's hall it was measured at 1,868,115 bytes (395,780 with Brotli), so the seventh room adds about 30 KB (about 4 KB with Brotli).

**Measured beside the other six rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, all seven run one after another in the same session, between 15:09 and 15:15 local time (20:09 to 20:15 UTC), with the load average between about 3.1 and 7.3 as `uptime` read it before and after each run; frame times while the bird crosses the whole room and back for 14 seconds):

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.3 / 9.4 / 10.0 ms | 0 of 1,705 | 95 MB |
| Al-Jazari's workshop | 42 | 19.8 MB | 51 | 8 | 8.33 / 9.1 / 9.4 / 9.6 ms | 0 of 1,704 | 65 MB |
| Al-Tusi's observatory | 39 | 19.2 MB | 57 | 10 | 8.33 / 9.2 / 9.4 / 9.5 ms | 0 of 1,703 | 67 MB |
| Al-Khwarizmi's room | 41 | 19.2 MB | 41 | 8 | 8.33 / 9.1 / 9.4 / 9.7 ms | 0 of 1,702 | 67 MB |
| Al-Kindi's room | 54 | 20.3 MB | 105 | 9 | 8.33 / 9.2 / 9.4 / 9.6 ms | 0 of 1,703 | 64 MB |
| Al-Idrisi's hall | 49 | 20.1 MB | 89 | 9 | 8.33 / 9.2 / 9.4 / 9.6 ms | 0 of 1,704 | 68 MB |
| Al-Razi's study | 61 | 24.7 MB | 56 | 7 | 8.33 / 9.1 / 9.3 / 10.1 ms | 0 of 1,703 | 71 MB |

(Texture memory is the decoded bytes `info()` counts: 47,529,904, 19,776,420, 19,165,644, 19,196,856, 20,310,600, 20,104,632 and 24,724,416; the largest texture in each room is a column of its painting of at most 2045×1080.) The study holds a texture for each leaf of the way of playing in each of its three looks (eighteen in Explorer), a slot for each place and the ring, shadow, thread and knot; that is about 4.6 MB more than the hall, and one draw call fewer. Opening the study ten times left the same 61 textures, 24,724,416 bytes and 56 objects. A lost graphics context in the study is told to the player and the study is drawn again with the row as it stood. Play to scene: 242 ms.

## The eighth room: Karima al-Marwaziyya's room (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/karima.ts`, 331 lines, which draws every sign with the page quest's own `drawSign`, and her copy's seal, the other copies' dots and a marked slip's broken ring with the page's own `seal`, `dots` and `slipRing`, now exported from `art/collate.ts` so that the page and the room share them, the page's picture unchanged; the figures in `art/cast.ts`; the cells, the rings and the stack placed by `scenes/karima.ts`, 245 lines), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a plain, quiet room of a house, pale lime plaster, a plain painted band of cream stripes and teal and ochre diamonds low on the wall, a floor of plain fired tiles; one arched window with a wooden lattice, its light falling across the wall and the floor; a plain rug with four low cushions under it; a tall bookcase of books with plain covers by the far end, with a stack of plain spare copies on its top. In the middle stand **the reading stands**: a long board for each copy, sloping a little back, one above another (centres of the rows at 262, 372 and 482 game pixels; Story's two copies on the lower two), each with a ledge at its foot that is the perch the bird stands on, its legs going down behind the stands in front. Each copy is a row of cells, 46 to 58 game pixels wide and 56 tall (52 pixels apart in Challenge's rows of twenty, 64 in Story's twelve and Explorer's sixteen), each with one sign drawn at the page's own size in its cell, every other place a shade lighter, each place in the same column on every stand; her copy's row begins with the page's seal and the others' with the page's dots, on a dark wooden plate. **No sacred place is drawn**: no Kaaba, no sanctuary, no mosque, no dome, no minaret; **no inscription, no letter of any script and no numeral is drawn anywhere in the room**, and nothing of any religious text. A unit test runs every painter of `art/karima.ts` (and Karima's and the boy's cut-outs) against a recording canvas and finds no call to `fillText` or `strokeText`; another finds no word for the Kaaba, a sanctuary, a mosque, a minaret, a dome, a mihrab, an inscription, calligraphy, a letter, the Qur'an, a verse, hadith or Mecca in its art, scene, content, rules or page code, and no prop but the feather.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Karima** (about 335) | a figure of her own drawn at the scholar's sizes and with the scholar's parts (`karima(scale)`): a cream headscarf that frames the face and falls over the shoulders, a plain long dress of deep blue-green with a brown border, a plain wrap at the waist; not a likeness, and her speaker label says "in imagined words" | turns to the bird; raises her arm when a slip is marked and when she speaks; blinks |
| **The boy who carries the copies** (about 175) | the explorer's cut-out in one fixed look of the boy's own (`copyBoy(scale)`: a round cap, a teal tunic) holding a bundle of plain folded copies tied with a cord; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The cells** | the page's own sign in each (`cellArt`, which calls `drawSign`), on the page's parchment or cream | still |
| **A marked slip** | the page's broken red ring (`slipArt`, which calls `slipRing`: dashed, so shape as well as colour) | shown and hidden from the quest's state |
| **The sign within reach** | its own cell raised over the bird at 1.18 times its size, with its broken ring if it is marked, inside a solid ring of lantern gold with a dark edge (`focusArt`) | breathes a little, unless movement is kept still |
| **The stands' light** | a soft glow over the stands once every slip is marked | fades in |
| **Props** | the stack of plain spare copies on top of the bookcase (`stackArt`), the feather | the feather peeks from between the copies until found |

**Script size** (measured 27 November 2026, 20:50 UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-PzHnX4Xh.js` is 1,929,212 bytes (404,532 with Brotli at quality 11, 530,818 with gzip at level 9); no style was changed; with al-Razi's study it was measured at 1,898,053 bytes (399,724 with Brotli), so the eighth room and the change to how the explorer follows add about 31 KB (about 5 KB with Brotli).

**Measured beside the other rooms** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, run between 15:59 and 16:01 local time (20:59 to 21:01 UTC), the load average between 2.6 and 3.7 as `uptime` read it before and after; frame times while the bird crosses the whole room and back for 14 seconds). Only the workshop was run again beside it this time; the other six rooms' rows are those measured with al-Razi's study above, on the same machine, and are not a fresh run.

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop (run again) | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.2 / 9.4 / 9.6 ms | 0 of 1,705 | 93 MB |
| Al-Razi's study (earlier run) | 61 | 24.7 MB | 56 | 7 | 8.33 / 9.1 / 9.3 / 10.1 ms | 0 of 1,703 | 71 MB |
| Karima al-Marwaziyya's room | 54 | 23.9 MB | 134 | 8 | 8.33 / 9.1 / 9.4 / 9.5 ms | 0 of 1,704 | 71 MB |

(Texture memory is the decoded bytes `info()` counts: 47,529,904 for the workshop and 23,942,304 for Karima's room, whose largest texture is a column of its painting of 2045×1080, then the stands' column of 1830×624.) The room has a cell and a ring for each of Explorer's 48 signs (each sign's cell is one of at most 24 small textures, shared), which is why it holds more objects than the study. Opening the room ten times left the same 54 textures, 23,942,304 bytes and 134 objects. A lost graphics context in the room is told to the player and the room is drawn again with the copies as they stood. Play to scene: 239 ms. The frame time is the display's 8.33 ms: these numbers say the room is light on this machine, not how light.

## The ninth room: Ibn Battuta's inn (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/battuta.ts`, 517 lines, which draws every bead's sign with the page quest's own `traceSign`, now exported from `art/route.ts` so that the page and the inn share it, the page's picture unchanged; the figures in `art/cast.ts`; the beads, the thread, the marks and the props placed by `scenes/battuta.ts`, 276 lines), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: the arcade of a travellers' inn at evening, warm plaster darkening toward a beamed ceiling, seven plain round arches along the back wall opening onto an evening sky (deep blue at the top, terracotta and amber low down, a few early stars) over a plain courtyard wall, a plain painted band of cream stripes and teal and ochre diamonds low on the wall, a floor of beaten earth and worn flagstones; rolled carpets with plain stripes and two saddlebags with plain diamonds against the wall near where the bird comes in; a hanging brass lantern with a soft flickering glow; a camel resting with its legs folded and a striped blanket in the last arch (a simple, friendly shape that breathes slowly); bales piled by the far end, their top a step, under a high ledge with a saddlebag on it. In the middle **the great ring** (radius 190 game pixels, centred at 1,180 by 330) hangs by two cords from the beam of a wooden stand with two posts: a plain wooden hoop, the same all round, with the stage's beads on it in the ring's order (the first at the top, the rest clockwise, mirrored on a page read right to left, as on the page), each bead 60 game pixels across with the page's sign and its number as cream dots set outside it, away from the middle, and a small wooden peg 32 pixels under each bead. Beside the stand, a lectern with a plain parchment scroll on it. **The ring is not a map**: nothing draws a coast, a compass, a direction, a distance or a place, and nothing is written anywhere (a test holds the art and the scene to drawing no text).

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Ibn Battuta** (about 640) | the scholar's cut-out at the scholar's sizes (`battuta(scale)`, `BATTUTA_LOOK`): a sand-coloured traveller's turban, a dusty brown cloak over a plain gown, a strap across the cloak, a tall walking staff held at his side; not a likeness, and his speaker label says "in imagined words" | turns to the bird; raises his arm when the thread moves on and when he speaks; blinks |
| **The child with the camel** (about 1,760) | the explorer's cut-out in one fixed look of the child's own (`camelChild(scale)`: a head cloth, an ochre tunic, a sash) holding the camel's rope in a loop; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The beads** | a dark bead with a cream sign, or once on the thread a gold bead with a dark sign and a heavy outline (`beadArt`, which calls `traceSign`), as on the page; the number as dots (`dotsArt`) | changed from the quest's state |
| **The thread** | one picture of a dark line under a gold one (`threadArt`), stretched and turned from bead to bead in the order threaded | drawn again whenever the thread changes; a Challenge slip clears it |
| **The bead reached last, the last slip** | the page's cream ring with eight rays (`lastArt`) and the page's broken red ring (`wrongArt`): shape as well as colour | from the quest's state |
| **The bead within reach** | the bead raised over the bird at 1.18 times its size inside a solid ring of lantern gold with a dark edge (`focusArt`) | breathes a little, unless movement is kept still |
| **The scroll** | a plain scroll on a lectern (`lecternArt`), with a soft light on it while the stage's sentence is hidden | the light pulses gently, unless movement is kept still |
| **Props** | the camel (`camelArt`), the lantern (`lanternArt`), the saddlebag on the high ledge (`saddlebagArt`), the feather | the camel breathes, the lantern flickers, the saddlebag sways a little; the feather peeks from the saddlebag until found |

**Script size** (measured 27 November 2026, 21:43 UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-D6UTXYRQ.js` is 1,960,176 bytes (409,242 with Brotli at quality 11, 540,647 with gzip at level 9); two style rules were added; with Karima al-Marwaziyya's room it was measured at 1,929,212 bytes (404,532 with Brotli), so the ninth room adds about 31 KB (about 5 KB with Brotli).

**Measured beside the workshop** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, run between 16:53 and 16:55 local time (21:53 to 21:55 UTC), the load average between 6.1 and 7.5 as `uptime` read it before, between and after the two runs, which is below 10 but higher than for the earlier rooms; frame times while the bird crosses the whole room and back for 14 seconds). Only the workshop was run again beside it; Karima's room's row is the one measured with it above, on the same machine, and is not a fresh run.

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop (run again) | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.0 / 9.3 / 11.3 ms | 0 of 1,703 | 95 MB |
| Karima al-Marwaziyya's room (earlier run) | 54 | 23.9 MB | 134 | 8 | 8.33 / 9.1 / 9.4 / 9.5 ms | 0 of 1,704 | 71 MB |
| Ibn Battuta's inn | 64 | 23.2 MB | 66 | 11 | 8.33 / 9.0 / 9.3 / 11.4 ms | 0 of 1,700 | 68 MB |

(Texture memory is the decoded bytes `info()` counts: 23,231,988 for the inn, whose largest textures are the two columns of its painting, 2045×1080 and 1557×1080.) The inn has two small textures for every bead (off and on the thread) and one for each number of dots, which is why it holds more textures than Karima's room and fewer objects. Opening the inn ten times left the same 64 textures, 23,231,988 bytes and 66 objects. A lost graphics context in the inn is told to the player and the inn is drawn again with the thread as it stood. Play to scene: 304 ms. The frame time is the display's 8.33 ms: these numbers say the inn is light on this machine, not how light.

## The tenth room: the coffee room (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/coffee-room.ts`, 352 lines, which draws every card with the page quest's own `drawCard` and `coffeeFace` and every shelf's sign with the page quest's own `sign`, now exported from `art/sort.ts` and `art/coffee.ts` so that the page and the room share them, the page's picture unchanged; the figures in `art/cast.ts`; the cards, the signs, the bell, the box and the frame placed by `scenes/coffee.ts`, 229 lines), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a quiet room of records in a coffee-trading town in the late afternoon, whitewashed plaster gone warm, a latticed pointed window high on the wall over plain flat roofs, a low bench under it with a round brass tray, a brass coffee pot with a long spout and two small handleless cups (decoration only), a plain teal band with cream and ochre squares low on the wall, worn floorboards and a long plain rug, the long low table, and a dark wooden bookcase of three shelves with a box of blank spare cards on top. Nothing is written anywhere; no goat and no face is drawn on any card.

**The shelves side by side** (changed later on 27 November 2026, from the lead agent's review): the three shelves stood one above another, shelf 1 at the bottom and the legend's shelf 3 at the top with its sign highest, which could be read as a ranking. The bookcase is now one case of three equal sections side by side, parted by two plain uprights, with three tiers of boards that run across all three sections (each shelf's cards stand three across its section, the lowest tier first, up to nine) and the three shelves' plaques at one height on the top of the case, each over the start of its section (shelf 1 at the end the page begins from); the box of spare cards stands on the top at the other end. The plaques, their signs and their dots are unchanged.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **The keeper of the records** (about 640) | the scholar's cut-out at the scholar's sizes (`archivist(scale)`, `ARCHIVIST_LOOK`): a plain white turban, a deep green robe over a cream gown; the quest's invented person, not a likeness of anyone, and the label says so | turns to the bird; raises his arm when a card is put on a shelf and when he speaks; blinks |
| **The child who tidies the cards** (about 1,610) | the explorer's cut-out in one fixed look of the child's own (`cardChild(scale)`: a round cap, a green tunic) holding a small stack of blank cards; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The cards** | the quest's own small scroll with its plain sign (`cardArt`, which calls the page's `drawCard` and `coffeeFace`) and its number as gold dots under it, drawn at 0.74 of the page's 72 pixels | slide to where the sorting says they stand; hidden from their place while carried, and a smaller copy rides at Hudhud's beak |
| **The shelves' signs** | a small teal plaque with a gold rim, the quest's own sign for the shelf (the solid seal, the two speech marks, the cloud, drawn by the page's `sign`) and one, two or three dots (`signArt`), on the top of the case over the start of its shelf's section, all three at one height | still |
| **The bell** | a plain brass hand bell on a small wooden stand (`bellArt`); nothing on it | swings a little when rung, unless movement is kept still |
| **The thing within reach** | a frame of lantern gold with a dark edge (`focusArt`) round the card, sign or bell the bird can touch | breathes a little, unless movement is kept still |
| **Props** | the bench, the tray, the coffee pot and the cups (painted into the room), the box of blank spare cards (`boxArt`), the feather | the feather peeks from the box until found |

**Script size** (measured 27 November 2026, 23:03 UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-FiSVoYnh.js` is 1,991,700 bytes (414,333 with Brotli at quality 11, 550,818 with gzip at level 9); no style rule was added; with Ibn Battuta's inn it was measured at 1,960,176 bytes (409,242 with Brotli), so the tenth room with the shared sorting room adds about 31 KB (about 5 KB with Brotli).

**Measured beside the workshop** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, run between 18:00 and 18:02 local time (23:00 to 23:02 UTC), the load average between 3.0 and 3.4 as `uptime` read it before, between and after the two runs, below 10; frame times while the bird crosses the whole room and back for 14 seconds). Only the workshop was run again beside it; the inn's row is the one measured with it above, on the same machine, and is not a fresh run.

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop (run again) | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.1 / 9.4 / 9.6 ms | 0 of 1,704 | 93 MB |
| Ibn Battuta's inn (earlier run) | 64 | 23.2 MB | 66 | 11 | 8.33 / 9.0 / 9.3 / 11.4 ms | 0 of 1,700 | 68 MB |
| The coffee room | 43 | 19.4 MB | 45 | 8 | 8.33 / 9.3 / 9.4 / 9.6 ms | 0 of 1,701 | 65 MB |

(Texture memory is the decoded bytes `info()` counts: 19,402,164 for the coffee room, whose largest textures are the two columns of its painting, 2045×1080 and 1557×1080.) Opening the room ten times left the same 43 textures, 19,402,164 bytes and 45 objects. A lost graphics context in the room is told to the player and the room is drawn again with the cards as they stood. Play to scene: 231 ms. The frame time is the display's 8.33 ms: these numbers say the room is light on this machine, not how light.

## The eleventh room: al-Jahiz's room (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/jahiz-room.ts`, 344 lines, which draws every card with the page quest's own `drawCard` and `animalFace`, now exported from `art/sort.ts` so that the page and the room share them, the page's picture unchanged; the bell and the frame round what is within reach are the coffee room's own `bellArt` and `focusArt`, shared; the figures in `art/cast.ts`; the trays, the signs, the cards, the bell, the basket and the frame placed by `scenes/jahiz.ts`, 236 lines), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long room of 2,400 by 720 game pixels with the same floor and the same door: a scholar's room in a garden house in the morning, pale plaster, a tall rounded window near where the bird comes in with a plain upright and crossbar over a morning sky, two soft clouds, three round trees and grass, a plain blue band with cream and ochre circles low on the wall, worn floorboards and a long plain blue rug under the bench, two shelves of books on brackets over the bench (plain coloured spines with two light bands each and now and then a book lying flat; no title on any), the long low bench, and the trays. Nothing is written anywhere.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **Al-Jahiz** (about 640) | the scholar's cut-out at the scholar's sizes (`jahiz(scale)`, `JAHIZ_LOOK`): a sand turban, a deep blue robe over a cream gown; not a likeness, and nothing about his face or person is drawn from any record; the label says his words are imagined | turns to the bird; raises his arm when a card is put in a tray and when he speaks; blinks |
| **The girl who carries the cards** (about 430) | the explorer's cut-out in one fixed look of her own (`cardGirl(scale)`: a headscarf, a teal tunic) holding two blank cards; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The cards** | the quest's own card with its creature (`cardArt`, which calls the page's `drawCard` and `animalFace`) and its number as gold dots under it, drawn at 0.6 of the page's 72 pixels | slide to where the sorting says they stand; hidden from their place while carried, and a smaller copy rides at Hudhud's beak |
| **The trays** | one picture for every tray (`trayArt`): a small dark wooden stand of three tiers on a low table of its own, as wide as a tray, standing side by side at the same height along the room, two in Story and Explorer, five in Challenge | still |
| **The trays' signs** | a small teal plaque with a gold rim on the tray's top, with the tray's own plain shape in pale gold (a circle, a square, a triangle, a diamond, a star) and one to five dots (`signArt`); every plaque the same size and colour | still |
| **The bell** | the coffee room's plain brass hand bell on a small wooden stand, at the far end of the bench | swings a little when rung, unless movement is kept still |
| **Props** | the books and the shelves (painted into the room), the basket of blank spare cards on the lower shelf (`basketArt`), the feather | the feather peeks from the basket until found |

**Script size** (measured 27 November 2026, 23:37 UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-CGSZkUwx.js` is 2,011,514 bytes (417,206 with Brotli at quality 11, 555,030 with gzip at level 9); no style rule was added; with the coffee room it was measured at 1,991,700 bytes (414,333 with Brotli), so the eleventh room, the explorer's new rule and the coffee room's new shelves add about 20 KB (about 3 KB with Brotli).

**Measured beside the workshop and the coffee room** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, 27 November 2026, three runs one after another between 18:49 and 18:52 local time (23:49 to 23:52 UTC), the load average between 3.8 and 4.5 as `uptime` read it before, between and after the runs, below 10; frame times while the bird crosses the whole room and back for 14 seconds). The coffee room was run again for its new shelves.

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop (run again) | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.2 / 9.4 / 9.6 ms | 0 of 1,704 | 94 MB |
| The coffee room, its shelves side by side (run again) | 43 | 19.4 MB | 45 | 8 | 8.33 / 9.1 / 9.4 / 9.5 ms | 0 of 1,702 | 66 MB |
| Al-Jahiz's room | 45 | 20.0 MB | 48 | 8 | 8.33 / 9.1 / 9.4 / 9.6 ms | 0 of 1,702 | 70 MB |

(Texture memory is the decoded bytes `info()` counts: 19,995,264 for al-Jahiz's room, whose largest textures are the two columns of its painting, 2045×1080 and 1557×1080.) Opening the room ten times left the same 45 textures, 19,995,264 bytes and 48 objects; the JS heap read 72 MB after one opening and 99 MB after ten (in the coffee room 70 and 72 MB), not looked into further, and five canvases were counted on the page after ten openings, as in the other rooms. A lost graphics context in the room is told to the player and the room is drawn again with the cards as they stood. Play to scene: 233 ms. The frame time is the display's 8.33 ms: these numbers say the room is light on this machine, not how light.

## The twelfth room: the Alhambra's court (27 November 2026)

Drawn in code in the same kit, palette and brushed surface as the other rooms (`art/alhambra-room.ts`, 351 lines, which draws every piece of the grid with the page quest's own `drawPlace`, now exported from `art/channels.ts` with the channels' colours `CHANNEL_INK` and `grooveWidth`, so that the page and the court share them, the page's picture unchanged; the figures in `art/cast.ts`; the pieces, the spout, the lever, the feather and the page placed by `scenes/alhambra.ts`, 297 lines), and like them **trial art, a trial of the look and not final art**, built after the founder said on 27 November 2026 to continue all the remaining work. One long court of 2,400 by 720 game pixels with the same floor and the same door: an open court at evening, a deep blue sky warming to orange low down with a few stars, a plastered arcade of twelve plain round arches with dark generic round trees seen through them, a plain cornice, a low plain wall with a coping along the arches' foot and two plain clay pots of round shrubs on it, a paved floor, and in the middle the great stone panel. Nothing is written anywhere, and on purpose there is no muqarnas, no inscription, no carved stucco, no stone lion, no tower, no myrtle and no named court.

| Figure or thing | Parts | Moves the code makes |
|---|---|---|
| **The keeper of the water** (about 560) | the scholar's cut-out at the scholar's sizes (`waterkeeper(scale)`, `WATERKEEPER_LOOK`): a plain grey-white turban, an earth-brown robe over a cream gown, a teal shawl; the quest's invented person, not a likeness of anyone, and the label says so | turns to the bird; raises his arm when a piece is turned and when he speaks; blinks |
| **The girl who sweeps the court** (about 1820) | the explorer's cut-out in one fixed look of her own (`sweeper(scale)`: a headscarf, a red tunic) holding a plain broom of twigs; the quest's invented person, and the label says so | looks at the bird; waves when speaking; a small hop when spoken to; blinks |
| **The stone panel** | painted into the court: a sloping stone face (a trapezoid, 640 wide at the back, 760 at the front), joints running from back to front, two stone piers behind, a thick front edge on the floor, and a plain stone ledge along the foot of each of its five rows | still |
| **The pieces** | one canvas for each place of the grid, 84 game pixels square with 40 round it for the drops and the gold outline, painted with the page's own `drawPlace` (the tile, the groove, the basin, the drops, the outline of the piece turned last) and mirrored on a page read right to left; the places 96 apart with the page's gap of 12, so the grooves meet in the middle of the gap | painted again only when a place changes (turned, wet, spilling, marked); the water runs a step at a time after a turn as on the page, unless movement is kept still |
| **The spout and its pipe** | a plain stone block with a dark mouth high on the wall at the end of the grid's first column, a plain pipe down and across to the grid (an empty dark groove, or blue with pale dashes while the water is shown), a small stone ledge on a bracket under it (`spoutArt`, dry and wet) | dry or wet as the way of playing shows the water |
| **The sluice lever** (Challenge) | a short stone post with a wooden handle and a brass knob on the ledge under the spout (`leverArt`) | raised while the sluice is shut, lowered while it is open: shape and position, not colour alone |
| **Props** | the feather on the rim of the dry fountain; the page of the Atlas (`props.page`) and a soft glow over the fountain at the end | the feather shows until found; the page floats up out of the fountain once the water reaches it, at once when movement is kept still |

**Script size** (measured 28 November 2026, 01:20 UTC, from the file `build:release` wrote, compressed with Node's zlib): Hudhud's main script `app-CdlWGSYe.js` is 2,040,874 bytes (421,670 with Brotli at quality 11, 562,995 with gzip at level 9); no style rule was added; with al-Jahiz's room it was measured at 2,011,514 bytes (417,206 with Brotli), so the twelfth room and the trays fix add about 29 KB (about 4.5 KB with Brotli).

**Measured beside the workshop, the coffee room and al-Jahiz's room** (`hudhud-play.ts`, Medium, 1920×1080, Explorer, the founder's Mac, Chrome 158, four runs one after another on 27 November 2026 between 20:16 and 20:19 local time (28 November, 01:16 to 01:19 UTC), the load average between 2.4 and 4.6 as `uptime` read it before and after each run, below 10; frame times while the bird crosses the whole room and back for 14 seconds). Since this run the play tool reads the JS heap after a forced garbage collection too (Chrome started with `--expose-gc`, `gc()` called before `performance.memory.usedJSHeapSize` is read), in every room's lifecycle, so that the rooms' figures can be compared; the last column is that figure after one opening (or one restart, for the workshop) and after ten.

| Room | Textures | Texture memory (decoded) | Objects | Draw calls a frame | Frame time: mean / p95 / p99 / max | Frames over 16.7 ms | JS heap after a forced collection, one / ten openings |
|---|---:|---:|---:|---:|---|---:|---:|
| Ibn al-Haytham's workshop (run again) | 50 | 47.5 MB | 129 | 19 | 8.33 / 9.3 / 9.5 / 9.6 ms | 0 of 1,704 | 92.3 / 92.8 MB |
| The coffee room (run again) | 43 | 19.4 MB | 45 | 8 | 8.33 / 9.3 / 9.4 / 9.5 ms | 0 of 1,702 | 65.1 / 65.9 MB |
| Al-Jahiz's room (run again) | 45 | 20.0 MB | 48 | 8 | 8.33 / 9.2 / 9.4 / 9.6 ms | 0 of 1,705 | 65.7 / 66.6 MB |
| The Alhambra's court | 50 | 25.3 MB | 51 | 7 | 8.33 / 9.1 / 9.4 / 9.6 ms | 0 of 1,705 | 71.1 / 71.8 MB |

(Texture memory is the decoded bytes `info()` counts: 25,262,568 for the court, whose largest textures are the two columns of its painting, 2045×1080 and 1557×1080, then the spout's two pictures, 660×495 each; the sixteen pieces of Explorer are 246×246 each.) Opening the court ten times left the same 50 textures, 25,262,568 bytes and 51 objects, and five canvases were counted on the page after ten openings, as in the other rooms. A lost graphics context in the court is told to the player and the court is drawn again with the pieces as they lay (the check found what the picture shows agreeing with the quest). Play to scene: 237 ms. The frame time is the display's 8.33 ms: these numbers say the court is light on this machine, not how light.

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
