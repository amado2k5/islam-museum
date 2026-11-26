# Hudhud artist brief

_26 November 2026. Draft for the founder only. No illustrator, animator, vendor or tool is engaged or approved by this document. Its purpose is to make the paid test and production work commissionable when the founder chooses the route. The visual direction remains unaccepted until the founder accepts it in words and then approves a runtime proof._

## 1. Assignment being tested

Produce painterly, production-ready parts for the Hudhud golden scene: a side-on 2D children's adventure scene in the atmosphere of the supplied founder references. This is a game-art test, not a concept-art commission and not permission to cut up or reuse the supplied thumbnails.

The test must prove four things at once:

1. the warm painterly look of the supplied references can survive as authored game assets;
2. characters can be separated into consistent, animatable parts;
3. faces, hands, cloth, feathers and materials outperform the current code-drawn trial;
4. the art can be packed into atlases, lit by the engine, animated and measured on ordinary hardware.

The golden-scene subject is Ibn al-Haytham's light workshop opening toward an evening garden/town. The place is composite and must be labelled composite. No real building or city should be claimed. Historical review is pending.

## 2. Non-negotiables

- **No baked-in words, letters, numbers, logos, signatures or title text anywhere.** This includes books, scrolls, maps, instruments, wall decoration and UI.
- **No fake script and no sacred text as texture.** Use blank pages or abstract non-script strokes approved by the team.
- **No generic “Islamic” architecture across eras.** Every architectural or costume choice must carry a place/century note or be explicitly labelled composite/fictional.
- **No direct reuse of the supplied thumbnails or reference pictures.** They are visual direction only.
- **No copied third-party game/film assets, stock silhouettes or unlicensed material.**
- **No duplicated faces across different historical people.**
- **No impossible instruments presented as real.** If a device is decorative fiction, label it fictional. If it represents an astrolabe, armillary or other instrument, its moving parts must be mechanically coherent enough for interaction.
- **No modern objects** unless the museum-visitor frame explicitly calls for them.
- **Nothing may imply a portrait likeness of a real historical person.** These are warm imaginative game figures and must remain labelled that way.

## 3. Visual target

The references define a teal-and-gold bedtime-storybook world:

- saturated deep teal evening sky and cool shadows;
- warm sunset/lantern gold as the key light;
- ochre stone, terracotta, amber, bronze and cream;
- small accents of lapis, turquoise tile and emerald foliage;
- soft dark-brown contour, stronger on characters than environment;
- visible but controlled painterly texture: cloth folds, feather scallops, fur/hair, stone wear, leaf clusters, water strokes;
- warm/cool separation and atmospheric depth rather than flat colour;
- open composition with uncluttered sky or wall space for gameplay/UI readability.

Do not copy the exact fantasy geography of the references. They are especially strong for mood and weak for historically specific architecture, instruments, hand construction and repeatable faces.

## 4. Style risks the artist must solve

The test is specifically looking for solutions to these known failure modes:

- faces that look warm and alive rather than flat vector masks;
- hands that can hold and gesture without broken or uncertain fingers;
- Hudhud's feather anatomy simplified consistently rather than turned into generic shapes;
- cloth with weight, embroidery and secondary motion, not stiff rectangles;
- stone/tile/wood/brass/paper materials that remain distinct at gameplay scale;
- architectural ornament used with restraint, place and century logic;
- characters that can turn, walk, emote and interact rather than pose once;
- detail that survives at 1280×720 and remains readable at small size;
- no dependency on baked glow, blur or one-off painterly effects that the engine cannot reproduce.

## 5. Canonical character requirements

### Hudhud

Correct hoopoe anatomy simplified consistently:

- small orange/amber body with cream scalloped breast;
- fan crest with black-tipped feathers, opening in surprise/flight/landing and lying back when calm;
- black wings with white bars;
- long, gently downcurved beak;
- one large bright expressive eye visible in side view;
- friendly, curious, never sarcastic or menacing;
- consistent crest-feather count, wing-bar count, tail length and body size across every pose.

Required animation coverage, at minimum: idle, blink, look, talk/bark, hop, run, takeoff, flap, glide, brake, land, perch, startled, delighted, thinking, wet/windy and interaction. The current logical part sizes in the trial are approximately: body 78×62 px; tail 54×30; folded wing 56×40; spread wing 96×84; head with beak 92×50; crest 74×56; legs 34×18. These are production guides, not sacred dimensions.

### Storykeepers

Produce both girl and boy Storykeeper test designs with approved diverse customization, plus the museum-facing explanation of whether they are historically framed or modern museum visitors. Do not tokenize skin/hair/outfit variations. Each variant must be a coherent child, not a recolour.

Current logical parts are approximately legs 30×70 each, tunic 96×118, arm 28×78, head 96×104, satchel/Atlas 50×56. They must walk, run after the bird, look upward, gesture, speak, breathe, blink, hold objects and express more than glad/thinking/alarmed.

### Ibn al-Haytham test figure

One warm imaginative historical figure, not a portrait. He must have full facial acting, expressive brows/eyes/mouth, correct hands, cloth weight, asymmetric non-mirrored details and gestures suitable for explaining light. He should read as a specific person in a specific workshop rather than the recurring generic bearded scholar of the thumbnails.

### One expressive animal

The existing test animal is a cat about 110 px wide, but another small animal may be proposed if it better serves the golden scene. It must be animatable and expressive without stealing focus.

## 6. Golden-scene environment test

Create a side-on layered environment at a world scale suitable for a 2400×720 scene with a 1280×720 view. The existing trial room is about 1760 px wide; final dimensions may be adjusted after gameplay review, but the test must show understanding of horizontal play space.

Required layers:

1. far evening sky and distant town silhouettes;
2. far roofs/garden silhouettes;
3. near garden/terrace with fountain, lantern, plants and outdoor occlusion;
4. dark teal workshop interior wall/floor, shelves, niche, reading stand, chest, shutter/window opening;
5. interactive light path elements: shutter opening, mirror stands, book obstruction, pale page target;
6. foreground occluders: column, curtain/arch, leaves or lamp forms;
7. engine-effect placeholders or overlays for beam, dust, sparkle, water, cloth/leaf motion and day-to-night change.

The prism is currently removed because the supplied pictures show one but no museum record read for the scene supports it. Do not reintroduce a prism unless the founder explicitly rules otherwise.

## 7. Layering and cut-out requirements

Everything must be authored for a 2D engine:

- each character supplied as separate named parts with transparent backgrounds;
- pivot/pin positions clearly marked or documented;
- no important joint hidden inside a flattened body;
- asymmetric details not dependent on mirroring;
- overlapping clothing/hair/cloth parts separated so secondary motion is possible;
- environment supplied in horizontal parallax layers, not one flat painting;
- foreground occlusion separate from midground;
- interactive props separate from background;
- clean alpha edges suitable for WebP texture atlases;
- no rasterized drop shadows that prevent relighting unless intentionally supplied as a separate shadow layer.

Suggested naming pattern:

```text
hudhud/body_idle.png
hudhud/head_beak_open.png
hudhud/crest_open.png
hudhud/wing_spread_01.png
storykeeper/girl-a/tunic_front.png
storykeeper/girl-a/arm_left_upper.png
scene/light-workshop/sky_far.png
scene/light-workshop/roofs_far.png
scene/light-workshop/interior_wall.png
props/mirror_stand_01/base.png
props/mirror_stand_01/mirror_face.png
```

Final naming may change to fit the pipeline, but parts must not arrive as unstructured flattened files.

## 8. Resolution, texture and atlas constraints

- Logical game view: 1280×720.
- Source character parts should be painted at least 2× final logical size where practical.
- One packed texture must not exceed 2048×2048 without a measured written reason.
- Deliver clean transparent PNG or lossless WebP masters for the test. The game pipeline may pack/compress them later.
- Avoid tiny one-pixel noise that will disappear in compression.
- Keep silhouette readability at 50% display scale.
- Provide layer dimensions and anchor positions in a simple manifest or spreadsheet.

Budgets are not final art budgets; they are the current proposed engineering constraints: first load at most 15 MB compressed; one world about 12 MB compressed; texture memory at any moment roughly Low 48 MB, Medium 96 MB, High 160 MB. The artist does not need to hit final atlas compression in the test, but must not produce a workflow that cannot fit it.

## 9. Paid test deliverables

A small paid test should ask for only enough work to judge capability:

### A. Hudhud animation proof

- front-side canonical turnaround at rest;
- expression sheet: calm, alert, delighted, thinking, startled;
- separated part set for idle, hop/run, takeoff/flap/glide/brake/land and perch;
- three key frame sequences or rough pose strips showing motion arcs;
- one short handoff sheet naming every part and pivot.

### B. One human acting proof

Choose Ibn al-Haytham or one Storykeeper:

- full-body side pose;
- head/face close-up expressions;
- two hand poses, one holding an object and one gesturing;
- robe/tunic separated for cloth motion;
- one walk or gesture pose strip;
- notes on place/century/composite status of clothing.

### C. One environment slice

A crop or reduced section of the golden-scene environment, not the entire scene:

- sky/far roof layer;
- midground garden/interior boundary;
- interactive foreground element;
- one mirror stand and one page/book prop;
- lighting kept separable enough for engine beams/glow;
- a small annotated layer diagram.

### D. File-organization proof

- source file with named layers or a clean folder of transparent parts;
- simple manifest of dimensions, pivots and layer order;
- no embedded text layer converted into visible fake writing;
- licence/authorship statement supplied by the founder's chosen contracting process.

## 10. Acceptance criteria

The test is not accepted because it is beautiful as a still. It is accepted only if:

- the parts assemble without mismatched scale or perspective;
- Hudhud remains recognizably a hoopoe in silhouette at gameplay size;
- eyes, brows, mouth, hands and cloth can act;
- environment layers parallax correctly without exposed edges or impossible seams;
- lighting can be reproduced partly by engine effects rather than baked into every layer;
- interactive props are visually distinct from decoration;
- the art reads at 1280×720 and at reduced scale;
- no fake writing, sacred text, copied architecture collage or repeated generic face is present;
- file naming and layer organization are clear enough for an automated pipeline;
- runtime captures can be compared side by side with the references and the current trial.

Concept art alone does not pass. Acceptance requires assembled runtime proof and measured performance/memory, with Low/Medium/High presets reducing expensive effects rather than reducing art direction.

## 11. What the game team will supply to the artist

- the founder-provided reference package, clearly marked as direction only;
- this brief and the art-reference analysis;
- canonical Hudhud anatomy decisions once approved;
- the golden-scene gameplay layout and collision/interaction positions;
- exact part list, logical sizes, pivot expectations and naming schema;
- review notes for clothing, architecture and material culture;
- a simple test rig or assembled mockup for feedback.

## 12. What the artist is not being asked to do

- write the story or factual museum copy;
- decide historical accuracy alone;
- produce all fifty quests;
- create final UI branding or title text;
- implement code;
- generate work through an undisclosed or unapproved AI service;
- reuse the supplied thumbnails as paint-over assets;
- decide licensing, payment or publication terms.

## 13. Questions the founder must answer before production scales

1. Will the painted half be made by a human illustrator/animator, by the process that made the thumbnails, or by a blend?
2. If the thumbnail process is used, what exactly is it, who operates it, and are its licence terms acceptable for game art?
3. Does the museum's public rule against AI-made portraits apply to these imaginative game characters, and how should they be labelled?
4. Are the Storykeepers modern museum visitors, historical children, or a hybrid frame?
5. Which reviewer approves clothing, architecture, instruments and material culture before final line/colour?
6. What is the paid-test budget and what rights are purchased?

Until those answers exist, this brief is a commission-ready specification draft, not authorization to contact or pay anyone.

## 14. Master files, sprite sheets, provenance and rights

Deliverables must distinguish master art from game-packed output:

- layered editable source files, with non-destructive adjustment layers where the tool supports them;
- exported transparent cut-out parts as lossless PNG or lossless WebP masters;
- pose strips or frame sequences sufficient for sprite-sheet assembly;
- test sprite sheets packed no larger than 2048×2048, plus unpacked source parts so the pipeline can repack them;
- WebP test exports in addition to masters, so compression artefacts can be judged;
- a provenance manifest naming the artist/tool chain, source files, export date, licence/rights state, any reference material used, and confirmation that no supplied thumbnail was copied or cut up;
- a rights/package inventory suitable for the founder's legal review. This brief does not itself grant rights or define payment.

Any time or cost numbers in future planning are estimates only, not quotes. The paid-test scope and price must be agreed directly by the founder and the artist/vendor.

## 15. Review rounds

A practical review structure for the test, subject to founder approval:

1. **Silhouette and anatomy review** before colour: Hudhud, one human, one animal, key prop silhouettes.
2. **Construction and separation review** before final paint: joints, pivots, clothing overlap, hand construction, layer plan, non-mirrored details.
3. **Historical/material review** before final costume/architecture/instrument detail: reviewer flags place, century, composite status and anything invented.
4. **Colour/light review** against the consolidated palette: warm/cool split, readability, restraint of glow and ornament.
5. **Assembled runtime review** in the game: scale, parallax, interaction readability, atlas packing, animation arcs, compression and memory.
6. **Founder acceptance review** using side-by-side runtime captures at target viewports.

The artist should expect correction at each round. Final acceptance is in the running game, not in isolated stills.
