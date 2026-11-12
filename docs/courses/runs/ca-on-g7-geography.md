# Run log: ca-on-g7-geography

Started: 2026-11-12T05:57Z (date -u)
Agent: Claude Code; claude-sonnet-5-5

## Step 0 (05:57Z)
- Fleet run: graph already built, no git/graph/validate commands run. `.cache/graph.json` present.

## Step 1 (05:58Z)
- `fetch_ontario.py --list "Grade 7"` gave "GEO - Grade 7". Fetch ok: strand A Physical Patterns in a Changing World (3 overall, 21 specific), strand B Natural Resources Around the World: Use and Sustainability (3 overall, 16 specific) = 37 specific expectations, all with codes. Manifest docs/courses/curricula/ontario-geo-g7.json.
- Step 2: `ontario_source.py ontario-geo-g7` printed source/ontario-curriculum-sshg-2023 (existing record, not edited).

## Steps 3-4 (06:00Z to 06:08Z): search and plan
- Searches run (find_entity.py, three or more spellings each): irrigation/qanat, dam/Marib, Nile/flood, desert/Sahara, water/well, climate/monsoon, mountain, river/Tigris/Euphrates, agriculture, mining/salt, hima/pasture, earthquake, drought/famine, wind, sea, pearl, oil, quarry, zamzam, snow, island, volcano/harra, geography; later Netherlands/Mississippi, Indigenous/First Nations, topographic map, climate graph, vegetation, rainforest, deforestation, fishing, coal, environment/conservation, renewable, timber, map/GIS, tsunami, locust, UN/NGO, natural resources, pollution, gold/iron, energy, wildlife, hydroelectric.
- Rejected links: place/al-nil (a town in the Sawad dug by al-Hajjaj, not the river); concept/environmental-protection-in-islam (one author's reading, names no group or action: kept out of B1.3); concept/al-mawarid-al-tabiiyya (lists resources, no renewable/non-renewable sorting, prose in Arabic only: B3.1 stays a gap); the Ramla and Mecca flood and earthquake records (accounts of damage, nothing on landform or water-body change: A3.2 stays a gap); event/mecca-flood-859, event/flood-of-al-aram as separate cards (flood-of-al-aram's content is already in the Marib card); concept/hima (Ibn Hisham version) in favour of concept/hima-protected-pasture, whose sourcing is fuller; place/rayy (a city, name only matches "irrigation" by the Arabic spelling).
- Plan:
  | slug | title | expectations |
  |---|---|---|
  | ca-on-g7-geography-a-1 | Answering the land with water works | A1.1, A3.5 |
  | ca-on-g7-geography-a-2 | Which environment weighs most on people? A desert crossing | A1.3 |
  | ca-on-g7-geography-a-3 | Mountains, ranges and lava fields | A3.1 |
  | ca-on-g7-geography-a-4 | Rivers in flood and in low water | A3.4 |
  | ca-on-g7-geography-a-5 | Dividing the earth into climates | A3.6, A3.7 |
  | ca-on-g7-geography-b-1 | Land, water and pasture: using and sharing | B3.2, B3.5 |
- Links, as "The expectation asks the student to ___; this record shows ___":
  - a-1 Marib dam: asks to describe a response to the environment (a dam) and its long-term effects; the record shows a Sabaean dam, its breaches and the flood that ended it (author's estimate, 450 or 451 CE).
  - a-1 Ubulla canal: asks for human activities that create or change water systems; the record shows a canal dug for Basra from the Tigris creek.
  - a-1 Karaji: asks for responses to the environment (getting water); the record shows levelling methods for qanat tunnels.
  - a-2 Jubayr road: asks to judge which environment weighs most on people; the record shows one desert road on which thirst killed pilgrims. A single case, flagged in the prose.
  - a-3: location and physical features of landforms; Uhud gives location only (coordinates), al-Muqattam a range through desert with ochre and lime, Harrat al-Rajla a lava field.
  - a-4: describe patterns of major water systems; the Nilometer shows a yearly flood measured in cubits, the Euphrates and Nile records a flood year and a record low.
  - a-5: describe climate regions and the factors behind them; two medieval authors' divisions and factors, labelled as such.
  - b-1: how people use land, water and pasture; farming (agriculture-in-islam), public drinking water (sabil), protected pasture (hima).
- 28 of 37 specific expectations go to the gap register; 9 are in lessons. 28 + 9 = 37.

## Judgement calls
- B3.5 and the hima: the record says a hima is a reserved pasture whose ruling is prohibition except for stated uses; it does not call it conservation. I linked it to B3.5 ("responses to challenges arising from the use of natural resources") because the record itself frames it as a rule over a shared resource that "narrows the common ground", and I kept the card to that wording. Not used for B1.3 (preserving resources), where it would be a stretch.
- A1.3 is served by a single desert road, one environment of the many the expectation compares. The lesson prose says the class must bring the others.
- A3.1 uses Uhud for location only; the record has no physical description of it.
- The two climate cards restate medieval theory; the second omits the record's statement about skin colour, which is not needed and is contested.
- A3.3, A3.8 and B3.6 (reading topographic maps, climate graphs, GIS maps) put in the register with real searches rather than the "skills expectation" line, since they name specific material the museum would need to hold.
- B1.4 (a personal plan of action) went to the register with searches, for the same reason.

## Step 5-7 (06:08Z to 06:11Z): records, prose, gate
- Records and prose were generated from one script kept in the scratchpad (not in the repository), so that the three languages and the isolate-wrapping of Arabic parentheses are applied the same way everywhere. Arabic written first, then English, then Urdu.
- Gate (`check_course.py ... --strict --save`): RESULT: GREEN (23 checks passed). cite-check over the 9 records: 9 pass, 0 fail.
- `npm run validate`, `npm test`, `npm run graph` not run (fleet rules).

## More lessons possible
- None beyond the six. Candidates considered and left out because the records would not carry them honestly: A3.2 (landform processes), A3.9 and A3.10 (vegetation), B1.x.

## Runbook problems
- The runbook says a lesson groups two to four expectations; a-2, a-3 and a-4 have one each because the museum's matter for the neighbouring expectations is absent. Not harmful, but the checker does not enforce the range and the runbook does not say what to do.
- Step 4 says to use `entity_brief.py` for facts; it prints both Arabic and English prose and was long. I cut the Arabic with awk. A `--lang en` option would help.
- No Urdu rule is stated for the isolate marks; I applied the same U+2066/U+2069 wrapping to Urdu parentheses that contain Arabic-script text.

## Proposals
- Connection kinds: the Marib dam, the canal and the sabil are works of engineering and architecture; the closed list gave `place`, `story` and `place`. A kind `structure` or `work` would be more accurate.
- The list also has no kind for a legal institution (the hima); used `reflection`.
- An expectation-level link to the authority's page for each expectation, so the text over 40 words can be restored without storing it.

Ended: 2026-11-12T06:12Z

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 7 geography). Applied in all three languages. No connection was added.

- a-1 `building/marib-dam` (FIX): "The record says breaches began" -> "Al-Raheeq al-Makhtum says breaches began" (ar: "ويذكر السجل" -> "ويذكر الرحيق المختوم"; ur: "ریکارڈ بتاتا ہے" -> "الرحیق المختوم بتاتی ہے"); "by the author's estimate" -> "by the estimate of its author, al-Mubarakpuri" (ar: بتقدير مؤلفه المباركفوري; ur: اس کے مصنف مبارکپوری کے اندازے سے). "al-Arim" -> "al-Aram", the record's spelling. The other two cards of a-1 (Ubulla canal, Karaji qanat) are KEEP, unchanged.
- a-2 `journey/qus-to-aydhab-jubayr-desert` (FIX): removed "The record says the order of these points is not settled, and that the book states ..." and wrote "Ibn Jubayr's book states that this road was deadly to pilgrims through thirst" (ar: "ويقول كتاب ابن جبير إن هذا الطريق كان مهلكًا للحجاج عطشًا"; ur: "ابن جبیر کی کتاب کہتی ہے کہ یہ راستہ ... ہلاکت خیز تھا"). The thirst claim is kept, now attributed by name.
- a-3 `place/uhud` (REMOVE): connection deleted, evidence rows deleted; the prose no longer names it. Expectation A3.1 stays in the lesson, served by al-Muqattam.
- a-3 `place/harrat-al-rajla` (REMOVE): same. The lesson, its label, summary, Brief and Try this now speak of one landform, a desert mountain range.
- a-3 `place/al-muqattam` (KEEP with the reviewer's addition): "Al-Idrisi describes al-Muqattam as a mountain ..." -> "In al-Idrisi's medieval description, al-Muqattam is a mountain ..." (ar: "في وصف الإدريسي الوسيط"; ur: "ادریسی کے قرونِ وسطیٰ کے بیان کے مطابق"). I wrote "medieval" and not "twelfth-century" because the record does not state the date; a reader should check that judgement.
- a-4 `event/nile-record-low-278` (REMOVE): connection deleted, evidence row deleted; label, summary and Try this adjusted (a flood and its absence, no "record low"). A3.4 stays, served by the Nilometer and the Euphrates flood.
- a-5 `concept/al-aqalim-al-saba` (FIX): after the al-Masudi report added "This is a medieval view, and it is not what modern climate maps show." (ar: "هذا رأي وسيط، وليس ما تُظهره خرائط المناخ الحديثة"; ur: "یہ قرونِ وسطیٰ کا نقطۂ نظر ہے، اور جدید موسمی نقشے یہ نہیں دکھاتے"); cut "which is Iraq for this group" (and ar/ur equivalents). The added sentence is the museum's note, marked as such in the evidence table.
- a-5 `concept/athar-al-iqlim` (REMOVE, done first, by the founder's order): connection removed and every mention in the three prose files; evidence rows and the reviewer note deleted. The lesson keeps one connection and now speaks of one medieval climate scheme.
- b-1 `concept/hima-protected-pasture` (FIX): "The rule is prohibition" now reads "The encyclopedia says the rule is prohibition", the majority view is introduced with "it says", and the agent who admits the herds of the weak and bars those of the strong is added from the record (p.7287); ar/ur follow. The card does not say the hima answers a shortage. In the lesson's Try this, the closing question now asks which, if any, of the three the record presents as a response to a challenge.
- Unchanged by verdict (KEEP): a-1 Ubulla canal and Karaji qanat; a-4 Nilometer and Euphrates flood 329; b-1 agriculture-in-islam and sabil.
- Verdicts judged wrong and not applied: none.

### Records for the founder

- `concept/athar-al-iqlim`: climate determinism about peoples' character and religion, skin colour and the Ham story; it should be reviewed before any use in an educational context. It was linked in this course (a-5) and, by the same grep, in `ca-on-g11-hsp3u-d-2`; both links are removed. The museum record itself was not edited.
- `grep -l "concept/athar-al-iqlim" data/course/*.yaml` found two lessons: `ca-on-g7-geography-a-5` and `ca-on-g11-hsp3u-d-2`.
