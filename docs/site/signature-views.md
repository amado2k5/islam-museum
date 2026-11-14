# Signature views of the browsers

Founder request, 13 November 2026: each browser and explorer presents its subject with its own
view, one that fits its content, instead of the shared card grid alone. A signature view is a
build-time drawing at the top of a browser's landing page, made from the browser's own records.
The first was the Prophets' Tree (`docs/plan/41-messengers-browser.md` section 8); the rules it
set bind every view listed here.

## Rules

1. **An application of the graph.** Every number, order, position and link comes from the
   browser's lib and the graph at build time. Nothing is typed from memory. Where a view needs a
   fixed order or layout, the constant lives beside the component and the build throws when the
   data no longer matches it.
2. **Undated, unlocated and unlinked records are counted, not placed.** The caption says how
   many, and they stay reachable from the lists below.
3. **Readable without JavaScript.** Every mark is a real link in the HTML; scripts only add
   highlighting, read-outs and motion, and motion is skipped under `prefers-reduced-motion`.
4. **Three languages, both directions, both themes, phone and desktop**, checked by screenshot
   before merge. Strings live in a `viz:` map under the browser's own i18n key.
5. **Abstract geometry only**: beads, rings, bars, maps. No figurative depiction of anyone.
6. **One page only.** A view lives in `site/src/components/sig/`, with its script in
   `site/src/scripts/sig-*.ts` and its styles inline in the component, and touches no file in
   `tools/deploy/shell-paths.list`.

## Register

| Browser | View | Component | Drawn from | Build check |
|---|---|---|---|---|
| Messengers | The Prophets' Tree | `ProphetsTree.astro` | `child_of` edges, the Ansab chain, `MESSENGERS_TREE` | every branch has its edge |
| Asma ul Husna | The ninety-nine beads: one string of three turns, a bead's core sized by Qur'an passages linked to the name | `sig/AsmaBeads.astro` | `asmaNodes`, `sectionsOf` | orders are exactly 1 to 99 |
| Qurun | The wheel of the Hijri year: a bar per month topic by passages that mention it | `sig/HijriWheel.astro` | `qurunItems`, `QURUN_TOPICS` | month topics, order and subject pages |
| Khulafa | The river of reigns: a lane per caliphate, a segment per reign, both calendars | `sig/KhulafaRiver.astro` | `CALIPHATES`, `CLAIM_POLITIES`, `reignOf`, `reignLanes` | every chain member has a reign start |
| Khutab | The minbar timeline of dated sermons, and a ring per lecturer by series held | `sig/KhutabMinbar.astro` | `lib/khutab.ts` | every sermon type has a mark |
| Battles | Campaigns across the Hijri centuries, stacked by kind; the Prophet's campaigns on a map | `sig/BattlesCenturies.astro`, `sig/BattlesCampaignMap.astro` | `battleNodes`, `ghazawat`, `saraya`, `placeOf` | every kind in one family; every record counted |
| Journeys | Routes on one map, by kind | `sig/JourneysMap.astro` | `journeys`, `stationsOf` (waypoints, else legs) | every kind is styled |
| Sacred Places | The sacred geography: a map with lenses on Mecca and Medina | `sig/PlacesGeography.astro` | `placesItems`, coordinates, counts | both anchor cities exist and are located |
| Companions | A generation, year by year: a dot per Companion by Hijri decade of death | `sig/CompanionsGeneration.astro` | `companions` index | dots placed equal Companions with a death year |
| Four Madhhabs | Four schools side by side in time: lifespans, books, teacher-to-student arcs | `sig/FourSchools.astro` | `madhahibItems`, `founder_of`, `student_of`/`teacher_of` | exactly one founding imam per school |
| Fatwa | What people ask about: packed circles of subjects, ringed by issuing source | `sig/QuestionField.astro` | `fatwaSubjects`, `fatwaSources` | sources fit the palette; ties never cut |
| Tafsir | The Mushaf and how far the commentary has reached: 114 blocks, covered ranges in place | `sig/MushafBand.astro` | `surahs`, `coveredIn`, `runs` | surahs 1 to 114; revelation order a permutation; covered sums agree |
| Hadith Qudsi | Themes across the collections: a matrix of discs | `sig/QudsiMatrix.astro` | `qudsiHadiths`, `QUDSI_WORKS`, `QUDSI_THEMES` | row totals sum to the hadith count |
| Inventions | The workshop of centuries: a lane per domain, a mark per invention at its first attestation, arcs to precursors and dependents | `sig/InventionsWorkshop.astro` | `inventionNodes`, `inventionWhen`, `inventionLinks` | every invention dated, every status and domain drawn |
| Jobs | The market street: a block per domain, a tile per job sized by recorded holders | `sig/JobsStreet.astro` | `jobNodes`, `holdersOf`, `squarify` | every domain has a block; tiles equal jobs |
| Screening Room | The reel of decades: a frame per decade, a tile per dated title | `sig/ScreenReel.astro` | `lib/screen.ts` | every format has a family; no title lost |
| Hisab | The ladder of multiplication: recorded reward figures on a logarithmic ladder; unbounded rewards as open arrows | `sig/HisabLadder.astro` | `hisabRows` | every figure a positive finite number |
| Hasanat | Where good deeds are named: a shelf of 114 surah spines and a shelf of hadith collections | `sig/HasanatShelves.astro` | `hasanatItems`, `lib/sig-quran.ts` | surahs 1 to 114; every item has its surah or work |
| Sayyi'at | Where misdeeds are named: a stream of 114 bars in order of revelation, with a Mushaf-order switch | `sig/SayyiatStream.astro` | `sayyiatItems`, surah records | revelation order a permutation of 1 to 114 |
| Janna and Nar | The two abodes, surah by surah: one diverging chart, each page lit on its own side | `sig/TwoAbodes.astro` | `jannaItems`, `narItems` (worldly fire excluded), `lib/sig-sura.ts` | surah checks; the four groups sum to 114 |
| Qiyama | The Day along the order of revelation: three bands of dots with one cursor | `sig/QiyamaRevelation.astro` | `qiyamaItems` | no kind outside the three; every counted ayah has a page |
| Signs of the Hour | The road of the signs: five stations in the customary order, the museum's records as waymarks | `sig/SignsRoad.astro` | `signSteps`, `SIGN_STEPS` | steps equal the constant |
| Ghayb | The eight doors; the ascent (the journey record's waypoints, numbered, then the heavens concepts, unnumbered); the ten signs | `sig/GhaybDoors.astro`, `sig/GhaybAscent.astro`, `sig/GhaybSigns.astro` | `ghaybItems`, `GHAYB_SECTIONS`, `journey/isra-and-miraj-route`, `GHAYB_SIGNS_ORDER` | eight sections, none empty; journey and concepts exist |
| Angels | Offices of the angels: a centre and five patterned sectors of plain discs | `sig/AngelsRing.astro` | `angelsItems`, `ANGELS_SECTIONS` | sections as expected, no empty sector |
| Nature | Six habitats: strata from cosmos to sea, a hexagon per concept sized by passages that mention it | `sig/NatureStrata.astro` | `natureItems`, `passagesOf` | strata equal the sections |
| Jinn & Devils | Four circles that overlap: an overlap chart of the section combinations that occur | `sig/JinnOverlap.astro` | `jinnDevilsItems`, `groupOf` | combinations sum to the records |
| Magic | A vocabulary of terms: a wheel of topics with chords for records that carry two | `sig/MagicWheel.astro` | `magicItems`, `MAGIC_TOPICS` | every topic and section named |
| Akhlaq | Virtues and vices, face to face: a butterfly chart, dealings apart | `sig/ButterflyVirtues.astro` | `akhlaqItems`, `AKHLAQ_TOPIC_KINDS` | every topic has a kind and a label |
| Ibadat | The acts of worship: a rosette of petals by passages, beads for the practice records by obligation | `sig/RoseWindow.astro` | `ibadatItems`, the practice records' `ibadat-<topic>` tags | every topic has a label; bead rings clear the labels |
| Du'a | The supplications by where they are found: 114 lamps, lit where a formula is recorded | `sig/LampStrings.astro` | `duaItems`, `surahs` | surahs 1 to 114; every item has its place |
| Miracles | Signs, prophet by prophet: a loom of prophets and themes | `sig/MiraclesLoom.astro` | `miracleItems`, `MIRACLE_TOPIC_SUBJECTS`, `MESSENGERS_TREE` order | every linked person has a subject page |
| Nubuwat | Seven threads: a seven-axis chart, one outline per corpus | `sig/NubuwatStar.astro` | `nubuwatItems`, `NUBUWAT_TOPICS` | corpus counts sum to each theme's total |
| Dreams | Dreams the sources relate: five constellations by section | `sig/DreamsSky.astro` | `dreamItems`, `DREAM_SECTIONS` | stars placed equal the records |
| Household | The household: a family chart from kinship edges only, and a dated strip of events | `sig/BaytHousehold.astro` | `baytItems`, `child_of`, `spouse_of`, `sibling_of`, `member_of` | every drawn line is an edge |
| Usra | Marriages on record: a knot diagram of `spouse_of` edges | `sig/UsraKnots.astro` | `usraCouples` | drawn marriages equal the edges |
| Medicine | The apothecary's jars: six shelves, a jar per remedy, disease or procedure filled by the passages that name it; gold lids open records | `sig/TibbJars.astro` | `tibbShelves`, `TIBB_JARS` | every signal in one jar; named records exist; every admitted passage in a jar |
| Ansab | The tree of tribes: trees from `part_of`, `member_of` and `founder_of` edges between group subjects | `sig/AnsabTribes.astro` | `ansabSubjects`, group edges | no loop, no second parent, every connector an edge |
| Mukatabat | Letters and their senders: a flow from sender class to kind to corpus | `sig/MukatabatFlow.astro` | `mukatabatItems` | every column sums to the records |
| Islamic Economy | Coin, deed and endowment through time: three ledgers on one axis, dated records only | `sig/IeLedgers.astro` | `ieItems`, `IE_TOPICS` | every topic, class and section drawn |
| Hudud | Limits and grave sins as the sources name them: a two-panel index of terms and references | `sig/HududIndex.astro` | `hududItems`, `hududSignals` | every term has a side and a label |

The Modern Islam Browser keeps its own year ribbon (`ol[data-modern-ribbon]`), built before this
programme. A browser added later gets its view, and its row here, in the commit that mounts it.

## Known limits (recorded, not hidden)

- Khulafa: on a phone most reign segments are narrower than a 24 px target, because reigns are
  short and adjacent; the arrow keys and the lists below give the same access.
- Sacred Places and the campaign map: marks that share a point are fanned apart, and the caption
  says so; a few marks in the densest clusters are under 24 px on a phone.
- Companions: the view adds about 180 KB to the landing (567 linked dots, the outline of 606 names, style and script), which takes the page to about 540 KB, over the 500 KB guide in `site/src/lib/paged.ts`; a lighter encoding of the dots is the open improvement.
- Qurun: the data has ten month topics (the two Rabi's and the two Jumadas are one topic each),
  and which months are sacred is recorded only in prose, so no sacred band is drawn.
- Qiyama, Sayyi'at, Du'a and the Ibadat beads: marks narrower than a 24 px target on some screens; the arrow keys,
  a drag along the Sayyi'at stream, and the links in each read-out give the same access.
- Ibadat: a practice bead stands at the worship family its own record names with an `ibadat-<topic>` tag
  (`ibadatTagTopics` in `scripts/ibadat.ts`); a practice whose record names none is listed under the rosette.
- Mukatabat: no map of letters is drawn, because the letter records hold no pair of sender place and recipient place.
- Household: Banu al-Muttalib has no `member_of` edge from anyone on the chart; six people of the section have no
  kinship edge and are listed as not yet linked. Usra and Household add about 83 KB and 72 KB.
- Ansab: 59 of the 125 group records have no edge to another subject and are listed, not placed.
- Inventions: 21 of 100 records carry a Hijri date; the rest are converted from the CE date and marked.
- Miracles, Nubuwat, Magic, Akhlaq, Ibadat: a topic has no anchor of its own on the page, so its mark fills the
  page's filter box, which needs JavaScript.
