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

The browsers not yet listed keep the shared layout until their view is built; they are added
here in the same commit that mounts the view.

## Known limits (recorded, not hidden)

- Khulafa: on a phone most reign segments are narrower than a 24 px target, because reigns are
  short and adjacent; the arrow keys and the lists below give the same access.
- Sacred Places and the campaign map: marks that share a point are fanned apart, and the caption
  says so; a few marks in the densest clusters are under 24 px on a phone.
- Companions: the view adds about 180 KB to the landing (567 linked dots, the outline of 606 names, style and script), which takes the page to about 540 KB, over the 500 KB guide in `site/src/lib/paged.ts`; a lighter encoding of the dots is the open improvement.
- Qurun: the data has ten month topics (the two Rabi's and the two Jumadas are one topic each),
  and which months are sacred is recorded only in prose, so no sacred band is drawn.
