# Hudhud art-reference analysis

_26 November 2026. Analysis of the founder-provided reference package only. These pictures are atmosphere, composition and fidelity references; they are **not** deployable game art, not historical evidence and not accepted production art. Nothing here approves a route, engages an artist or uses the pictures directly in the game._

## Source verification

The outer package `/Users/ahmedabdelaal/Downloads/Claude-Fable-5.2-Hudhud-production-package.zip` was read locally. Its embedded `hudhud-thumbnails-80.zip` and `thumbnails-index.md` match the directive's SHA-256 values exactly:

- `hudhud-thumbnails-80.zip`: `18c1c869877d7074012fdf6dae9cd54b55a01e1da8b87d39d6df7f8c1e976885`
- `thumbnails-index.md`: `3150dac29a72999c37857207078f16c718fad86fe705d53bd469fb628a26a2ec`

The eight additional pictures also match the directive exactly:

| file | SHA-256 verified | intended use in the directive |
|---|---|---|
| `ChatGPT Image Nov 26, 2026, 12_02_20 PM.png` | `a321fc68a1cf759d569371111cd5266aa58674dafbe35cceac49a21f1a94b402` | restored Atlas/hub panorama |
| `ChatGPT Image Nov 26, 2026, 12_00_32 PM.png` | `7220f1cf7f0487c327340a97cc07ea1ad0ffa49a0dbeaa358f8557f005808d44` | city overview and civic care |
| `ChatGPT Image Nov 26, 2026, 11_59_09 AM.png` | `599e9ebecb26718add36edee026ca7c373e4d7b1869047f23c9cab9306394b53` | garden-library world |
| `ChatGPT Image Nov 26, 2026, 11_56_49 AM.png` | `420e2c4c853313bb52edc073e956ba1d8cbba667cc185cc760871bef9e351cb6` | astronomy/observation |
| `ChatGPT Image Nov 26, 2026, 11_55_06 AM.png` | `2c3f5824d30dadecc3cffcc4a634c82986aaaa577b8444c77e34704ef6651375` | books, study and courtyard |
| `ChatGPT Image Nov 26, 2026, 11_53_49 AM.png` | `e847abd80f1ea4084f2758582a6507df673adf9064c0cbf1c4cedea0016821b8` | city traversal and skyline |
| `ChatGPT Image Nov 26, 2026, 11_52_42 AM.png` | `0b573bc0d2e83c3dc5eefa55d7da6370e0f82f772b3e09960b2a84b0a3eac78b` | civic/architectural garden route |
| `ChatGPT Image Nov 26, 2026, 11_49_52 AM.png` | `88dc7c587b490739d56ced9c427753fe88d5dce81054736e2b41b103171eda45` | Monkey and Tortoise literary quest |

## How the measurements were made

Palette figures below were measured locally with Pillow. Each PNG was resized to 400 pixels wide, quantized by median-cut to ten colours, and the occupied pixels were counted. “Warm/cool” is a rough hue classification of those quantized colours, not a perceptual lighting measurement. The thumbnail aggregate was measured the same way from a 40-image contact grid per language. Percentages may not total 100 because only the leading colours are listed.

The eighty thumbnails are 16:9 JPEG files at 1280×720, 1320×743 or 1672×941. Aggregate leading colours: English sample `#175356` 12.44%, `#793d19` 10.34%, `#ac5f23` 9.65%, `#1d2a25` 9.19%, `#d88333` 8.92%, `#bca767` 8.46%, `#f0ae4c` 8.37%; Arabic sample `#985e24` 12.55%, `#055c6e` 11.65%, `#7d3b14` 11.53%, `#d47e1c` 9.85%, `#f9d476` 7.94%, `#f3ac45` 7.89%. This confirms the same teal/gold/brown system across the set.

## Per picture

### 1. `11_49_52` — Monkey and Tortoise riverside

**Composition.** The monkey occupies the upper-left third in a tree and reaches diagonally down toward the tortoise at lower centre-right. Hudhud is a large foreground silhouette at lower left. The river makes a long horizontal/diagonal line from the lower middle to the sunset horizon. The right upper sky is intentionally empty. The eye moves monkey hand → hanging red fruit → tortoise face → reflective river and sunset.

**Measured palette.** Warm 55.3%, cool 37.4%, mean luma 0.366. Leading colours: `#3c3d19` 18.60%, `#01586a` 12.09%, `#7c6f2a` 11.92%, `#166b6c` 11.47%, `#04545f` 10.63%, `#88441d` 9.61%.

**Light and materials.** Low warm golden sunlight from the river horizon/right edge against deep teal sky and water. Leaves have yellow rim light; grass is painted in separate blade clusters; the monkey's fur is built from directional tufts; the tortoise shell has individual scutes with bevels and warm edge light; water uses horizontal reflection strokes rather than mirror detail.

**Faces, hands and Hudhud.** Monkey and tortoise have oversized eyes, rounded cheeks and open smiling mouths. The monkey's reaching hand is readable but simplified; exact digit count should not be copied without checking. Hudhud is large relative to the tortoise, about half the tortoise's visible height, with a fully opened orange/black crest, black-and-white barred wing and long curved beak.

**Defects not to carry over.** The red fruit is botanically ambiguous and oversized on thin stems; firefly-like glows are decorative without a story reason; leaf clusters repeat; animal anatomy is acting-first, not anatomically rigorous. There is no architecture here. No legible baked text was found.

**Gameplay implication.** This is naturally side-on: tree canopy overhead, ground plane, river/backdrop layers and animals at interaction height. It translates well to a 2D quest. The wide empty sky is useful for flight, but the direct thumbnail composition is a cutscene, not a playable room.

### 2. `11_52_42` — Blossom route toward mosque/city

**Composition.** A foreground wall and flowering branches frame the left edge, with Hudhud perched at lower left. A lantern and arch lead into a narrow street pointing toward a large dome/minaret complex. The minaret sits near the left vertical third, the dome near centre, the sunset behind them. The eye moves Hudhud → lantern glow → minaret → dome and golden mosaic façade.

**Measured palette.** Warm 63.9%, cool 36.1%, mean luma 0.404. Leading colours: `#473a0d` 13.23%, `#a6713f` 13.18%, `#825020` 12.40%, `#015c68` 10.78%, `#d9a25b` 10.05%, `#ab8957` 9.45%.

**Light and materials.** Golden-hour sun behind the complex; warm lanterns are secondary keys. Stone is sandy, blocky and hand-varied; roof tiles are terracotta; flowers are dense individual shapes with yellow-white rims. The sky is a flat-to-soft teal gradient with sparse clouds.

**Faces, hands and Hudhud.** No human face or hands are available for reference. Hudhud is calm, crest open but less vertical than in flight, body round and feet visible on stone.

**Defects not to carry over.** The central building is a hybrid rather than a reliable place: a courtyard/mosque-like façade is fused to a basilican/gabled roof and a dome/minaret arrangement that does not document one real building or period. Window tracery and carved stone repeat decoratively. Blossoms and vines are simultaneously dense everywhere. Several lamps sit close to timber/plant material in a way that reads pictorially rather than practically. This must not be presented as the Umayyad Mosque or any real monument without architectural review.

**Gameplay implication.** Strong side-scrolling structure: foreground wall, walkable alley, arches, rooftops and landmark depth. The skyline should be broken into parallax layers and geographic logic, not copied as one impossible building.

### 3. `11_53_49` — Dense city panorama

**Composition.** Hudhud is large on a carved balcony at far left; the city occupies the lower two-thirds and the citadel/mosque on the hill is the main destination. Countless vertical minarets form a rhythm. The eye starts at Hudhud, crosses the foreground domes/minarets and climbs to the hilltop complex.

**Measured palette.** Warm 59.7%, cool 40.3%, mean luma 0.457. Leading colours: `#026a6c` 22.15%, `#774519` 14.56%, `#906332` 13.12%, `#0b7b79` 12.18%, `#f2a438` 10.18%, `#aa8146` 8.85%.

**Light and materials.** Warm low sun from the left/horizon with cool teal sky. Stone is ochre and gold; distant city detail becomes noise and haze. Palm crowns and balcony lattice are crisp foreground occluders.

**Faces, hands and Hudhud.** No people. Hudhud is in profile, body upright, crest open, wings folded; beak very thin and slightly downcurved.

**Defects not to carry over.** This is explicitly a fused fantasy skyline: an Ottoman-looking citadel/mosque, medieval-style minarets, dense domes and generic walls of different centuries share one impossible city. Minaret density is ornamental rather than urban. Repetition in the distant houses and towers is visible at close inspection. The foreground carved balcony is evocative but not a documented object.

**Gameplay implication.** Best used as an Atlas/world-map or arrival vista. A side-on game can borrow three depth bands—foreground balcony, middle roofs/minarets, far hill—but should not turn the panorama into a literal walkable continuous city.

### 4. `11_55_06` — Reader in courtyard/library

**Composition.** A close half-length reader fills the left third, book in hand, chin lifted. Hudhud sits on books at extreme lower left. The courtyard arcade begins behind him and extends right toward the fountain. Orange trees and red-white arches create repeated curves. The eye moves face → open book/lantern → arcade rhythm → fountain.

**Measured palette.** Warm 55.9%, cool 44.1%, mean luma 0.385. Leading colours: `#046a72` 18.74%, `#015c63` 16.86%, `#593a17` 14.22%, `#ba6f2b` 12.13%, `#984b18` 10.83%, `#f7b357` 8.74%.

**Light and materials.** A warm lantern is the foreground key; interior arches glow amber against a teal evening sky. Cloth has embroidered gold borders, layered robe weight and soft folds. Books have leather texture, page thickness and worn edges. Fountain water is bright but simple.

**Faces, hands and Hudhud.** The reader is warm and idealized: large eyes, soft brows, small beard, rounded cheeks. One hand supports the chin/thought pose while the other holds the book; occlusion means the image is not enough to define correct finger construction. Hudhud is very large relative to the books, almost a portrait companion rather than natural scale.

**Defects not to carry over.** Cordoba-like red-and-white voussoirs are fused with a cathedral/bell-tower-like vertical element and other courtyard forms; it is not a historically reliable single place. Open shelves full of books sit in a courtyard/loggia with little weather logic. The open book is blank, which avoids fake script but does not support a “reading” close-up; book spines/covers carry illegible ornament that must never become invented writing. Repeated arches and foliage become decorative wallpaper.

**Gameplay implication.** Excellent dialogue/cutscene reference: intimate face, warm lamp, deep room behind. For gameplay it needs a full-body character, hand poses and reusable room layers; the picture itself is not enough as a puppet source.

### 5. `11_56_49` — Astronomer at sunset

**Composition.** The astronomer is lower-left centre, pointing up into the large empty teal sky. Huge circular instruments frame the far left and far right. The blue-tiled dome/minaret group sits centrally behind him, with sunset at the horizon. The eye follows pointing finger → star/sky → sunset → instrument rings.

**Measured palette.** Warm 48.6%, cool 51.4%, mean luma 0.360. Leading colours: `#014c5c` 18.93%, `#175f6c` 13.87%, `#86633d` 11.03%, `#66421c` 10.95%, `#d78e40` 10.93%, `#ae7840` 10.12%.

**Light and materials.** Warm sunset at the horizon and golden instrument rims against the coolest sky in the set. Brass/gold instruments have specular edges and dark recesses; robe embroidery is lapis/gold; stonework is ochre with turquoise tile inserts.

**Faces, hands and Hudhud.** The astronomer has a broad smile, large eye, expressive eyebrow and stylized beard. The pointing hand is readable but simplified; the exact finger construction should not be treated as correct. The scroll-holding hand is partly hidden. Hudhud perches calmly on books at lower left.

**Defects not to carry over.** The large left “astrolabe” is decorative: radial spokes, arcs and rings do not form a coherent rete/plate system, there is no readable scale, and the central pin is oversized. The small armillary-like object has intersecting rings that would collide. The large right disc is a blank radial lattice, not a usable instrument. The scroll is blank. The skyline mixes blue-tiled forms into a generic golden-age city rather than a documented place.

**Gameplay implication.** Very useful for a rotating-ring/sighting puzzle and a sunset-to-night transition. The game can use big instrument silhouettes, but every mechanism must be designed from reviewed sources so it can actually work.

### 6. `11_59_09` — Garden library and water axis

**Composition.** Hudhud dominates the immediate left foreground at a fountain. A columned library pavilion starts at left centre and recedes into the middle. The canal/water axis pulls the eye from foreground fountain to central fountain and then to hills. Flower beds fill the right foreground. The upper sky is clear teal.

**Measured palette.** Warm 56.1%, cool 39.4%, mean luma 0.384. Leading colours: `#005461` 16.36%, `#4a420f` 14.04%, `#b18b41` 13.26%, `#e7bd70` 12.45%, `#004b56` 11.58%, `#0c676d` 10.99%.

**Light and materials.** Warm low light glows inside the library and on stone edges; sky and water remain teal. Stone is cream/ochre, roof tiles terracotta, hedges glossy, flowers saturated pink/violet/white, and water uses cyan reflections.

**Faces, hands and Hudhud.** No people. Hudhud is very large, with detailed cream breast feather scallops, black wing bars, open crest and a gentle smiling eye.

**Defects not to carry over.** The building fuses courtyard/garden traditions with an Italianate tiled roof and arcade proportions; it is not a documented library. Books are openly shelved in a semi-outdoor space. Flower species bloom together densely and repeat. The water axis is mathematically tidy in a way that would look artificial if copied literally. Architectural ornament is generic repetition.

**Gameplay implication.** One of the best side-on environment references: foreground fountain occlusion, walkable garden edge, midground pavilion and far hills. The canal's perspective depth must be translated into layered horizontal bands rather than copied as a literal 3D vista.

### 7. `12_00_32` — Leader overlooking ideal city

**Composition.** A young ruler/civic figure stands in left foreground profile on a balcony, with Hudhud beneath him. The ideal walled city fills the centre, the golden gate/dome forms the focal point, and the river curves along the right. The eye moves figure → gate → central dome → river/boats.

**Measured palette.** Warm 54.2%, cool 45.8%, mean luma 0.434. Leading colours: `#05656d` 16.64%, `#1a7d83` 12.38%, `#816433` 11.82%, `#583b18` 11.40%, `#a17e46` 10.27%, `#e29d4d` 9.08%.

**Light and materials.** Sunset behind the city, warm rim on figure/city walls, cool teal sky and river. Costume material is ornate: heavy embroidered teal cloak, gold floral borders, cream robe, jewelled belt/turban. The city walls are sandy blocks with repeated towers.

**Faces, hands and Hudhud.** The figure is youthful, idealized and serene; hands are mostly hidden, so this is not useful as a hand reference. Hudhud is a quiet companion silhouette rather than the focal point.

**Defects not to carry over.** Costume is fantasy ceremonial rather than reviewed dress: jewelled turban, plume and ornate cloak need place/century scrutiny. The city is an impossible ideal collage—round-city logic, continuous wall/aqueduct-like ring, central golden-domed shrine, riverfront and citadel elements all blended. Repeated banners and towers are graphic decoration. It cannot be labelled Baghdad, Cairo, Damascus or any real city as it stands.

**Gameplay implication.** Useful as an establishing cutscene/Atlas vista and for a foreground overlook. It is not a side-scrolling environment. The emotional lesson is “leader looks over a living city”; the geography must be rebuilt per quest.

### 8. `12_02_20` — Atlas/hub panorama

**Composition.** This is a wide hub metaphor rather than a single place. Hudhud flies in at upper left carrying a lantern. A golden sparkling path snakes through water and land toward different cities. Children and an astronomer/scholar occupy the bottom centre; a ship and builders occupy the right; architectural landmarks fill both edges. The central upper sky is deliberately empty. The eye moves Hudhud/lantern → golden path → children/scholar → ship/builders and right-hand cities.

**Measured palette.** Warm 50.7%, cool 49.3%, mean luma 0.482. Leading colours: `#147478` 19.25%, `#8e6f38` 12.85%, `#73491f` 12.24%, `#cd9a4c` 11.79%, `#0e4f4f` 8.98%, `#3f877a` 8.50%.

**Light and materials.** Sunset plus magical golden path; teal evening sky above. Water, stone, cloth and architecture are all warm-edged. The lantern is a local warm source. Figures are small but expressive.

**Faces, hands and Hudhud.** Children have rounded faces, large eyes and simple excited gestures. Several faces are too small or similar to serve as production references. Hudhud is flying with crest fully open, spread barred wings, tail fanned and lantern held in the beak area. The exact attachment/holding logic is pictorial, not mechanical.

**Defects not to carry over.** This is the clearest forbidden collage: Cordoba-like arches, a golden-domed shrine form, a courtyard/mosque façade, Cairo/citadel-like Ottoman forms, blue-tiled Samarkand/Registan-like portals, African mudbrick towers, a hilltop palace, river/sea, ship and builders are contiguous in one impossible geography. The astrolabe/armillary details are decorative. Faces and clothing repeat. The golden road is metaphor, not terrain. Builders and ship scale/perspective do not withstand scrutiny.

**Gameplay implication.** Perfect as a design target for an Atlas hub: nodes, paths, travel of knowledge, children at the centre, many regions. It must become an interactive map abstraction, not a continuous literal landscape. The empty sky is valuable for UI/title space but no title text should be baked into art.

## Consolidated style sheet

### Palette

Use the measured system rather than copying any one image exactly:

- deep teal sky/shadow: `#014c5c` to `#026a6c`
- lighter atmospheric teal: `#147478` to `#3fa39b`
- warm dark earth/line: `#473a0d`, `#593a17`, `#73491f`
- stone ochre: `#a6713f` to `#cd9a4c`
- sunset/lantern gold: `#e8892b`, `#f2b94b`, `#f9d476`
- hoopoe orange/amber: approximately `#f08a24` with cream breast tones
- accent lapis/turquoise tile: deep blue `#2b4fa3` and tile turquoise, used sparingly
- foliage emerald/olive: `#2f8f5b`, `#4c8c65`, dark olive `#3c3d19`

The recurring contrast is not merely “warm versus cool”; it is a warm amber/ochre world against a saturated teal evening sky. Shadows remain coloured. Almost never use grey night, black sky or washed pastel ground.

### Line, texture and rendering

- Soft dark brown line, not hard black. Line is strongest around characters and foreground props, weakest in distant architecture.
- Painterly surfaces: visible fur tufts, feather scallops, cloth folds, stone variation, leaf clusters and horizontal water strokes.
- Materials are simplified but not flat: metal has warm specular edges; cloth has weight and embroidered borders; stone is blocky and worn; paper/leather have thickness.
- Depth comes from saturation loss, softened detail, atmospheric haze, occlusion and scale—not from blur alone.

### Light

- Almost every reference uses one warm low key (sunset, lamp or lantern) against cool teal ambient shadow.
- Lanterns and sunset are compositional magnets. Use them to direct the player.
- Upper-right or central sky is often deliberately clear for readability.
- Glow is soft and additive; it should be engine-driven in the game rather than painted permanently into every layer.

### Figure language

- Faces are rounded, warm and expressive, with large eyes, readable brows and open mouths when speaking or delighted.
- Hands are simplified but must still be anatomically consistent; the references do not provide reliable hand construction in all poses.
- Clothing has layered robes, turbans/headscarves and embroidered gold borders, but the references repeat one fantasy wardrobe too often. Production clothing must be reviewed by place and century.
- Children's proportions are compact and rounded; adult scholars are tall and vertical, often robed as broad triangular silhouettes.

### Hudhud anatomy across the references

Consistent elements: orange/amber body, cream scalloped breast, fan-shaped crest with black-tipped feathers, black wings with white bars, long thin downcurved dark beak, large friendly eye, small feet. Crest opens in flight/alarm and sits lower when calm.

Disagreements to resolve before production: number of crest feathers (roughly seven to nine across images), exact wing-bar count, tail length and spread, body size relative to children/animals, whether the beak can physically hold objects, and how much breast feather detail survives at gameplay size. The game needs one canonical turnaround.

### What the eighty thumbnails add

The thumbnails repeat a strict YouTube formula: huge yellow title text baked into the upper area, one large smiling hero or object, small Hudhud near an edge, golden books/instruments, teal sky and a sunset city/landscape behind. The Arabic set more often includes children clustered around the hero; the English set more often isolates the hero/object. This makes the series visually coherent but also exposes production hazards:

- **Text is baked into every thumbnail** and must never enter game art.
- The same smiling middle-aged bearded man in white turban and teal/gold robe recurs across unrelated people, centuries and regions.
- The same few child faces recur.
- Objects glow even when the glow has no physical or story cause.
- Many manuscripts, maps, instruments and buildings are decorative approximations.
- Architecture from different regions is often used as generic “Islamic golden age” backdrop.

## Global defect list: what must not be carried into the game

1. **Fake or mixed script.** No legible baked writing was found in the eight large pictures, but book covers/spines, scroll ornament and thumbnail text areas contain pseudo-writing or title text. Game art must use blank pages, real reviewed text only where needed, or abstract non-script strokes. Never use sacred text as decoration.
2. **Fused architecture.** Do not copy any skyline or building as fact. Especially: the hybrid building in `11_52_42`; Cairo/Ottoman/medieval mixture in `11_53_49`; Cordoba/courtyard mixture in `11_55_06`; generic blue-tiled city in `11_56_49`; Italianate/garden-library fusion in `11_59_09`; ideal circular city in `12_00_32`; and the multi-region collage in `12_02_20`.
3. **Impossible instruments.** The astrolabe/armillary-like props in `11_56_49` and `12_02_20` are decorative. Mechanisms, scales, rings and sighting parts must be reconstructed from reviewed references or simplified into clearly fictional game devices.
4. **Hands and repeated faces.** Do not trace hand shapes where fingers are occluded or uncertain. Do not reuse the same smiling scholar/child face across different historical people.
5. **Floating or physically unclear props.** Lantern brackets, object attachment to Hudhud's beak, open-air library shelves, thin fruit stems and some instrument mounts are pictorial conveniences.
6. **Over-dense ornament and bloom.** Flowers, vines, minarets, arches and geometric carving are often everywhere at once. Production scenes need restraint and geographic/seasonal logic.
7. **Text areas and thumbnail framing.** Large empty sky areas are useful compositionally, but no title lettering or YouTube layout should survive into runtime scenes.
8. **Magical glow as default.** The golden path, glowing books and fireflies are meaningful only when the story/game system explains them. Do not make every object magical.

## What a side-on 2D game can and cannot use

**Can use:** strong silhouettes; teal/gold light split; foreground occluders such as branches, walls, lattice and fountains; horizontal river/street/garden movement; large readable props; warm interior edge against cool exterior; close dialogue portraits; large celestial/instrument shapes as puzzle UI; parallax city layers; Hudhud flying through open sky.

**Cannot use directly:** one-point deep vistas as literal gameplay space; a continuous world containing every city; exact architectural collages; dense distant ornament; baked titles; cropped half-length characters as puppets; a static panorama as proof of animation readiness.

The correct production translation is decomposition: palette and light rules, authored parallax layers, reviewed places, canonical character turnarounds, functional props, engine-driven particles/water/lighting, and scene-specific compositions built for play.

## Positional defect index

These positions use the ordinary viewer's frame of each picture.

| picture | specific positions and defects |
|---|---|
| `11_49_52` | upper-left tree/hand: monkey digits are simplified and partly hidden by leaves; upper-left hanging fruit: stems too thin for fruit scale; lower-left Hudhud: mascot scale is much larger than natural beside the tortoise; centre/right riverbank: repeated leaf clusters and unexplained firefly-like glows; no architecture. |
| `11_52_42` | centre mosque/courtyard façade: several regional/period forms fused into one impossible building; left foreground lattice/window: ornamental tracery repeats without construction logic; lower/centre street: lantern brackets and vegetation crowd the architecture; right/centre dome and minaret: do not identify the ensemble as a real mosque; flowers throughout bloom simultaneously. |
| `11_53_49` | far upper/right hill complex: Ottoman-looking citadel/mosque combined with unlike city forms; whole middle distance: excessive repeated minarets/domes and copied housing texture; left foreground balcony: carved lattice is evocative but generic; foreground palms/city junction: scale and geography are pictorial rather than urban. |
| `11_55_06` | left/centre reader's hands: fingers partly occluded and insufficient as construction reference; lower-left/centre books: spine/cover ornament risks reading as pseudo-script; centre/right arcade: Cordoba-like arches mixed with a tower and courtyard elements from different logics; background open shelves: books exposed outdoors; repeated arches/foliage flatten into pattern. |
| `11_56_49` | far-left circular instrument: decorative spokes and arcs do not make a working astrolabe; centre-left small rings: armillary-like rings intersect/collide; right large disk: radial lattice has no legible scale or function; lower centre scroll: blank and physically underspecified; central skyline: generic blue-tiled hybrid city. |
| `11_59_09` | left/centre library pavilion: open shelves in semi-outdoor garden architecture; roof/arcade: Italianate and garden-court forms fused; right foreground flower beds: too many simultaneous blooms and repeated clusters; central canal: overly perfect perspective/reflection; building wings repeat symmetrically. |
| `12_00_32` | left foreground figure: jewelled/plumed costume is fantasy ceremonial until reviewed; centre ideal city: circular wall, shrine-like dome, citadel/river forms and banners fused into no real city; repeated towers/banners across wall; right river/boats: scale and geography serve mood more than plausibility. |
| `12_02_20` | left edge to right edge: architecture from many regions and centuries fused contiguously; centre/right astrolabe and instruments: decorative rather than functional; lower centre children: repeated face types and turbans; right builders/ship: scale/perspective inconsistent; golden path is a magical metaphor, not terrain; small ornamental marks on maps/books/instruments must not become script. |

## Hudhud proportion against children

The references do not establish one consistent scale. In the eight large pictures Hudhud is often portrait-mascot size: very large beside books, instruments, the fountain and even the tortoise. Across the thumbnails he is more often a small companion at the lower edge, roughly one-quarter to one-third of a child's visible height, but this varies with composition. Production must choose one canonical size and stick to it; the pictures support readability and silhouette, not a measured scale. The current trial's approximately 100 px tall bird against an approximately 210 px Storykeeper is a plausible gameplay starting point, not a conclusion from the art.
