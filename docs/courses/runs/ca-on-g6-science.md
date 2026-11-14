# Run log: ca-on-g6-science (re-ingestion of the pilot)

Started 2026-11-14. The course was made by hand before the pipeline existed and failed seven checks of the ingestion gate (`docs/courses/FLEET.md`). It was re-ingested from the Ministry's text (`docs/courses/curricula/ontario-science-tech-2022-g6.json`, fetched again the same day) by two writers under one coordinator.

Two founder decisions (chat, 14 November 2026) differ from the runbook and explain the one check left failing:

1. Every existing lesson record and its URL is kept. No record was deleted and no id changed.
2. A lesson with no honest link is kept, emptied: it carries the Ministry's expectations, no card, and a Brief saying the museum holds no record for it yet. The gate's strict check "every lesson has at least one connection" therefore fails for eight lessons, on purpose: `ca-on-g6-sci-bio-1`, `-bio-3`, `-bio-4`, `-elec-1`, `-elec-2`, `-elec-3`, `-elec-4`, `-fly-4`.

The pilot followed an older curriculum's strand letters (flight as C, electricity as D). The units keep their ids and now carry the 2022 strands: biodiversity = B, electricity = C (Matter and Energy), flight = D (Structures and Mechanisms), space = E. A strand A unit and lesson were added, as every other grade's science course has.

## Writer notes: Strands B and D

### Run log: Strands B and D, Ontario Grade 6 Science (re-ingestion), 2026-11-14

Generator and drafts: scratchpad/g6/x/gen (content.py, prose.py, evidence_rows.py, build.py). Records written by build.py with a YAML library.

### Lessons kept
### ca-on-g6-sci-bio-2 (B2.1)
Cards (both work/kitab-al-hayawan; sources v1 only, cited at baseline):
- "Walk, fly, swim or creep": The expectation asks the student to describe the distinguishing characteristics of groups of organisms and use them to classify further with a classification system; this record shows al-Jahiz's division (inanimate or growing; animals and plants; animals walk, fly, swim or creep; those that walk are humans, beasts, predators, vermin) and his stated rule of following the names established among speakers of the language.
- "Feathers do not settle it": this record shows him dividing birds into predators, grazers and swarming insects, telling talon-armed predators from beak-armed ones, and noting the bat (reckoned a bird though featherless), the ostrich (feathers, not a bird) and that not everything that swims is a fish: characteristics used and tested against grouping.
Dropped: person/al-jahiz cards (humour, "examine accepted attitudes", al-Mas'udi's list of books) answer no part of B2.1; Qur'an 6:38 card (no linked record cites that verse); invention/ibn-baytar-comparative-materia-medica: an alphabetical reference where one plant has several names and one name several plants, mixing plants, animals and minerals; it names no distinguishing characteristics of groups and orders by alphabet, so it is not a classification by characteristics; it is also a remedies record (medicine must not read as advice); the "after career" card (Hill 1993, general knowledge) removed.
Depth layer: rewritten around al-Jahiz only (Go deeper: chapter lists of parts five and six; Why they did it; Often misunderstood; Think about it; Into the museum: kitab, al-Jahiz, concept/hayawan-animal). Ibn al-Baytar sections dropped.

### ca-on-g6-sci-fly-1 (D2.1, D2.2)
Cards (invention/firnas-reported-winged-flight, sources NASA Glenn + Maqqari, both cited at baseline):
- "Four forces, and a glider without an engine": the expectation asks for the relationships between lift, weight, thrust and drag; this record shows NASA Glenn's definitions of the four and the definition of a glider as subject to lift, drag and weight without engine thrust (a relationship among them), marked by the record itself as modern teaching, not a description of Ibn Firnas's wings.
- "Gliding on rising air": the expectation asks for flight-related applications of the properties of air; this record shows NASA's account of gliding, descending relative to the air while rising air can lift the glider relative to the ground, and says the explanation cannot invent an updraft for Ibn Firnas. WEAKEST link of D2.1: a moving mass of air is the nearest the record comes to "properties of air"; the Brief says the rest must come from the class.
Old cards removed: Qur'an card "Held up in the sky" (no linked record cites the verse), the Hill/Hourani "first attempt we know by name" card (person record, superlative "first", general knowledge). person/abbas-ibn-firnas is linked only in the depth layer.
Depth layer kept and rewritten for the new codes (Go deeper, Why they did it, Often misunderstood, Think about it, Into the museum).

### ca-on-g6-sci-fly-2 (D2.4, D2.5) retitled "Changing the forces: how living things fly"
- "How the forces set the glide angle" (firnas record): the expectation asks for ways the four forces can be altered; this record shows NASA's relation of the lift-to-drag ratio to a glider's descent angle, with a modern paper example. The record does NOT say "alter a force"; it says the ratio sets the angle. WEAKEST link of the whole share. I kept it because it is the only passage of the graph that relates the forces to a changing outcome, the card ends in our own question ("which force would you change") and states no new fact, and the Brief says plainly that the ways of altering the forces must come from the class. Reviewer may prefer to drop it: the lesson would then keep D2.4 with no card.
- "Flying, but not called birds" (kitab-al-hayawan, sources v1 + v4): the expectation asks for characteristics that enable organisms to fly; this record shows al-Jahiz noting that locusts, bees and flies fly on two wings but are not called birds. Thin: the record names the two wings, not how wings work. Brief says so. The bat/ostrich clauses are used in bio-2, the division in bio-2; this card uses only the two-wings clause (and the seven-parts fact for context).
Removed: invention/camera-obscura card (Ibn al-Haytham dark room: light, not forces), "Feathers before aluminium" career card (general knowledge).
Depth layer rewritten (Go deeper on the chapter list of the third part and the fly/horse remark; Think about it; Into the museum).

### ca-on-g6-sci-fly-3 (D2.3)
- "Two accounts of the landing" (kept as corrected on 14 Nov): the expectation asks how machines and organisms control flight; this record shows Maqqari's explanation of a landing difficulty by a missing tail, compared with a bird's landing, and Hasan's different account (unharmed survival). Honest scope: control of landing by a tail, not "balanced and unbalanced forces" in words; the Brief says the class brings the rest.
- "Balanced, yet still moving" (firnas record, NASA): the expectation names balanced forces; this record shows NASA's steady-glide diagram in which components are balanced while motion continues (unchanged speed and direction).
Removed: "Who designs tomorrow's wings" career card (general knowledge).
Depth: Go deeper (tail, TDV repetition, few elements), How do we know?, Think about it, Into the museum. The old lesson prose on rudders, ailerons and axes (general science) was removed: nothing from general knowledge.

### Lessons emptied (connections key removed; Brief says the museum holds no record)
- bio-1 (B2.2, B2.3): searches "biodiversity / التنوع الحيوي / diversity of species" (only course records), "ecosystem / نظام بيئي / habitat" (no entity), "species / الأنواع / kinds of animals" (fiqh and hadith-science records). Kitab al-Hayawan lists chapters on many kinds of animals; that is a list of subjects, not "diversity among species in a community" or variety within a species. Rejected as adjacent.
- bio-3 (B2.4, B2.5): searches "food chain / predator / السلسلة الغذائية" (none), "balance of nature / التوازن" (concept/al-tawazun-al-kawni), "environment / البيئة / ecology". The closest record is concept/al-tawazun-al-kawni (sparrows, locusts, a "chain of fear" jest) but it reports a television presenter's anecdote with needs_source dates; per the runbook a talk is evidence of what was said, not of the subject; not linked (also concept/hayawan-animal's Ragheb El-Sergani passage on rats, snakes and a famine: television, and famine is not Grade 6 material). The old hadith "Mercy down the chain" and Hill 1993 cards were removed.
- bio-4 (B1.1, B1.2): concept/hima (land the ruler reserves for particular herds, Sira of Ibn Hisham), concept/hima-protected-pasture (Kuwaiti fiqh encyclopaedia: conditions, small, for weak herds) and concept/environmental-protection-in-islam (al-'Afifi on pollution of water, air and soil) were read in full. None speaks of benefits of biodiversity, loss of species or a local biodiversity issue: pasture reserved for horses and herds is adjacent, not a link. The hima prose of the lesson's old depth layer was removed.
- fly-4 (D1.1): searches "flight / الطيران / aviation" (27 records, all escape/flight events plus the Firnas record), "environment / البيئة", "aviation" nothing on aviation technologies or their impact on society. The Firnas record explicitly says the account has no public transport service or profession (a statement of absence, not an impact).
Depth rows of bio-1, bio-3, bio-4, fly-4 deleted from docs/courses/evidence/ca-on-g6-science.md; old rows of the kept lessons replaced by the new rows (28 rows); "Cards corrected" rows of my lessons deleted except the three Firnas rows of fly-3 (that card is kept unchanged).

### Gap register (gaps.yaml): B2.6, B2.7, B2.8. B2.8 was searched honestly (Ibn Bassal, agriculture-in-islam, Filaha texts, trees, botany): no record passes.

### Units
Labels fixed to the Ministry strand letters and titles; overall expectations B1, B2 (biodiversity unit) and D1, D2 (flight unit) with quote_official text and real translations; three prose files each rewritten to a cited Brief. The Brief of each says what the museum holds and does not hold. The unit id keeps the old slug (ca-on-g6-sci-flight etc.).

### Judgement calls and doubts
1. Arabic spelling "ينساح" and "همج" copied from the record. "Grazers" is the record's English for بهائم in the bird division.
2. The English record says "TDV", the Arabic record says "موسوعة الإسلام" for the same source; I followed each language's own record in the depth layer (fly-3 ar/en).
3. Tangent of the descent angle: the English card keeps the record's "tangent"; the Arabic and Urdu use "ظل"/"ظل" as the records do (the Urdu record writes the same). A Grade 6 reader will need the teacher for that word.
4. The grade fit: the Firnas landing card mentions injury; the wording is the record's ("suffering injury on landing"), nothing graphic.
5. In fly-2 Brief the card for D2.4 shows a relationship, not a method of altering forces; stated plainly to the student.
6. Kinds: books are `object` (as in ca-on-g8-science-c-1), the Firnas record `invention`, the corrected landing card keeps `story`.

### Runbook points that were unclear
- The pipeline says Arabic prose headings are `## موجز`; the old pilot files had `## Brief` in Arabic files. I used `## موجز` / `## مختصر`.
- check_depth evidence parsing joins fragments with " ... " and cannot take a quotation inside a fragment; I avoided inner quotation marks in evidence cells.
- No proposals.

## Writer notes: Subject record, strands A, C and E

### Run log: writer "y" (subject record, Strand A new unit, Strand C, Strand E), 14 November 2026

Files written: `data/course/ca-on-g6-science.yaml` (summary, lessons, status), the new `data/course/ca-on-g6-science-a.yaml` and `ca-on-g6-science-a-1.yaml`, `ca-on-g6-sci-electricity` and `elec-1..4`, `ca-on-g6-sci-space` and `space-1..4`, and the three prose files of each (subject, A unit, A-1, C unit, elec-1..4, E unit, space-1..4). Evidence rows of my lessons in the repo file `docs/courses/evidence/ca-on-g6-science.md`: my old rows removed (the corrected cards of space-1 and space-3 and the depth rows of elec-3 and space-1..4), new depth rows appended under "## Depth layer" for space-1..4 and ca-on-g6-science-a-1. Card rows are in `evidence.md` (scratch), for the coordinator to place under "Cards corrected".

### For the coordinator
- **Orders**: subject children are now A=1 (mine), B=? , C=3 (mine), D=?, E=5 (mine). The biodiversity unit must be `order: 2` and the flight unit `order: 4`; they are still 1 and 2, so the gate prints "TREE siblings have distinct order" until the other writer sets them.
- The subject `lessons:` list is `[science-a, sci-biodiversity, sci-electricity, sci-flight, sci-space]`. The subject summary says "the museum maps parts of strands A, B, D and E and none of strand C" (as Grade 1's does): correct it if B or D end up emptied entirely.
- `gaps.yaml`: A1.1-A1.5, A2.1, A2.2 (skills), A3.2, E1.3, E2.2, E2.3. **E1.1 and E1.2 are NOT gaps**: both are now in lesson space-4 (see below).
- Gate lines that still name my records: only "MAPPING (strict) every lesson has at least one connection" for elec-1..4 (emptied on purpose), plus COVERAGE for my gap codes until the register is written.

### Lessons emptied (all four of Strand C)
Searches (alias search, then topic grep of the prose, English and Arabic):
- `find_entity.py "electricity" "كهرباء" "kahraba"`: only the course records themselves (course/ca-on-g6-sci-elec-1, -elec-2, -electricity).
- `find_entity.py "amber" "كهرمان" "kahruba"`: Amber (the Rajput state: person/jai-singh-i-of-amber), building/amber-reis-turbesi (no prose), and Arabic "chamber"-type words; no record on amber as a rubbed material. The old elec-1 card on `language/arabic` (kahraba from kahruba) was written from general knowledge and the record says nothing of it.
- `find_entity.py "lightning" "برق" "magnet" "مغناطيس"`: concept/thunder-lightning (no prose), five event records of lightning striking a mosque (event/prophets-mosque-lightning-886, prophets-mosque-strike-898, jerusalem-lightning-851, medina-mosque-fire-886, death-of-arbad-ibn-qays) which are chronicles of a strike, not an explanation by the principles of static electricity (C2.1 asks to explain a phenomenon with the principles; the record gives none and one of them is a death, not for Grade 6); place/magnetic-temple-china (magnetism is not in these expectations).
- `find_entity.py "battery" "بطارية" "circuit" "conductor"`, `"power plant" "generator" "dynamo" "مولد كهربائي"`, `"energy" "طاقة" "taqa"`: nothing about electricity (circuit hits are the word "circuit" for a journey).
- `grep -rniE "electri|electrostat|static charge"` over content/en of concept, invention, work, person, event, place, building, object, passage, and `grep -rnE "كهرب"` over the Arabic: hits are the word in passing (a TV preacher's image of electricity and a lamp in concept/tawaffi and concept/janin, "electricity" as a public utility in concept/al-milkiyya-al-amma, a ruling on using workplace electricity for personal ends in concept/itqan-fil-amal, a bill-paying fatwa, biographies of electrical engineers or of a ruler who built electricity works). None contains static electricity, current, a conductor, a circuit, energy conversion into electricity, generation in Canada or a way to use electricity responsibly. The ruling in concept/itqan-fil-amal is a juristic opinion of a television preacher on workplace property, not C1.2.
- The old elec-3 card on a water-lifting machine and its depth layer (invention/jazari-hidden-drive-water-lifter): the lifter moves water by water power, not electrical energy; removed with its depth sections and rows, as the brief says. The old elec-2 cards (work/kitab-al-hiyal, a dead link; person/al-jazari-engineer) are gone; the Jazari card moved to the new Strand A lesson, rewritten from the record. The old elec-4 Qur'an card (eat, drink, waste not) cites no verse that a linked record cites (no linked record): removed.
Prose of each emptied lesson: Brief (what the Ministry asks + "the museum holds no record that serves these expectations yet, so this lesson offers none"), one method-only question, no "Try this".

### Cards and the honesty sentence "The expectation asks the student to ___; this record shows ___."
**space-1 (E2.5, effects of the relative positions and motions of Earth, the Moon and the Sun)**
- concept/eclipses (before): asks to describe effects of the relative positions of Earth, Moon, Sun; shows al-Farghani's account of an eclipse of the sun as the Moon at conjunction between Sun and Earth, covering the Sun wholly at a node, and parallax making it partial from one place and total from another. Passage used: "Solar eclipses" section (same record also used in space-2, other passage).
- person/al-battani (within): asks for effects of the motions; shows his years of observation of the Sun's course, solstices and equinoxes (882-883) and solar and lunar eclipses (883, 891). Kept from the corrected card; the Ja'far ibn al-Muktafi sentence dropped, the eclipse sentence added.
- invention/ibn-al-shatir-lunar-model (after): asks for effects of relative positions and motions of Earth and Moon; shows the changing distance of the Moon from Earth as the problem a model had to fit, and a model that reduced Ptolemy's exaggeration of it. **Judgement call**: this is the weakest of the three ("effects" is read as the changing distance); a second reader may drop it. Roberts only (King not cited in the card, so no source beyond baseline).
- Considered and not linked: event/solar-eclipse-836 (a report that the sun was eclipsed and the eclipse prayer held; it says nothing of positions), concept/hilal-fiqh and concept/hijri-calendar for the month beginning with the crescent (neither says anything about positions or motion; hijri-calendar's only lunar/solar-year sentences are an uncited "For Scholars" section and a television programme by Zaghloul El-Naggar, evidence of what was said, not of the subject).
**space-2 (E2.4, bodies that emit light and bodies that reflect it)**; retitled "Bodies that give light and bodies that reflect it"
- concept/eclipses (before): asks to identify bodies that emit and bodies that reflect light; shows al-Farghani's account that the moon is lit by the sun's light, the half facing the sun bright. (The brief named person/al-farghani for this sentence; it is in concept/eclipses, not in the person record, so that is the record linked.) Passage: "Lunar eclipses" section. The record does not use the word "reflect": the card says "lit", and its question asks which body gives light and which is only lit.
- concept/hilal-fiqh (after): asks to identify bodies that reflect light; shows that technically the hilal is the first sighting of the lit part of the moon. Weak by itself (it says "lit part" and not why); kept as a second card because the card's question ties it to the first. The old Qur'an card (2:189) removed: no linked record cites that verse.
**space-3 (E2.1, components of the solar system)**; retitled "The Sun, the planets, the Moon and comets"
- concept/al-harakat-al-thaniya (within): asks to identify the Sun, planets and natural satellites and describe a main characteristic; shows the Sun and planets' own motion along the zodiac, the Sun's period in a solar year (about 365 and a quarter days) (the Moon's own sphere and the five planets are in the depth layer).
- event/comet-905 (after): asks to identify comets and describe their main physical characteristics; shows a "tailed star" with its tail over Yemen, reported in Shadharat al-Dhahab (the record's label is "A comet appears, 905"; the record's date block carries hijri 0905, so the cards write 905 AH). It names the tail and says nothing else about physical nature.
- Not linked: concept/al-kawakib-al-thabita (fixed stars are not solar-system bodies; a door "set beside the planets" was written then removed as adjacent); invention/ibn-al-shatir-lunar-model (moved to space-1); building/maragha-observatory (the record has NO sources at the baseline commit, so no card can cite it; also dropped from the depth layer); the "star names" card (no record) removed.
**space-4 (E1.1, E1.2, E2.6)**; retitled "Exploring space: tools, crews and what we learn"
- invention/universal-astrolabe-al-zarqali (before): asks to describe how technological innovations contributed to understanding of space; shows an improvement of a sky-observing instrument (one disc for many latitudes) as Puig and Bir describe it, "an improvement within the astrolabe tradition".
- person/farouk-el-baz (within): E1.2 asks to assess the role of space-exploration technology in observing and understanding environmental changes on Earth; shows, per English Wikipedia, his use of satellite images to study desert landforms, credited with evidence that the desert is the result of major climatic variations. E2.6: shows his Apollo work of studying photographs of the Moon to choose landing sites. The credit sentence rests on English Wikipedia only (names the source in the card; hedged as "credited").
- person/sheikh-muszaphar-shukor (after): E1.1 asks to analyse the impact of conditions in space and how humans meet needs there; shows the conditions a guidebook had to address (low gravity, a day/night cycle every ninety minutes) and a crew celebrating Eid aboard the station, sharing food. The card gives the topics of the guidebook, not its rulings; the JAKIM statement and the cell experiments were left out. Wikipedia only.
- Not carded: work/risalat-al-mizzi-fi-al-asturlab (kept as a door in "Into the museum"; the record says nothing of an innovation), invention/shatir-polar-sundial (timekeeping by the Sun's shadow, used in Strand A instead), person/sultan-bin-salman-al-saud (a flight fact set; superseded by Muszaphar and El-Baz, who serve E1.1/E1.2; its "first Arab/Muslim" claims rest on Wikipedia only), person/anousheh-ansari (considered for E1.3: the record holds two crewmates' views on paying private passengers, which is a view about who flies, not an evaluation of impacts: gap), person/firouz-naderi (the record states that he had no religious affiliation, not a person of this museum's Muslim frame; person/apj-abdul-kalam: ballistic missile and nuclear-test content, not for Grade 6).
**Strand A, lesson ca-on-g6-science-a-1 (A3.1, A3.3)** (new; grade 5, 7, 8 lessons used bimaristan/Ibn al-Nafis, architect/karaji/kashi, and al-Jazari's commission and six divisions; grade 8 also Ibn al-Nafis)
- job/astronomer (before): A3.1 asks to describe practical applications in occupations and how they address real problems; shows the astronomer's tables (zijes), al-Fazari's zij giving the basic tables for computing Islamic dates by the lunar calendar, and observatories paid for by rulers.
- person/al-jazari-engineer (within): A3.3 asks to analyse contributions from various communities; shows TDV placing him in a tradition from Hellenistic engineering to the Banu Musa, an engineer improving earlier work; and the double-piston pump (A3.1). Different passage from Grade 8's.
- invention/shatir-polar-sundial (after): A3.1; shows a timekeeper whose marble dial gave equal-hour readings relative to sunrise, sunset, midday and the afternoon prayer (King).
- The old elec-2 Jazari card ("The engineer who wrote it down", source hill-1993) was not moved: it did not restate the record; written anew from record sentences whose source is TDV.

### Depth layers
- space-1 (Go deeper al-Battani at Antioch and his instruments; Why: his own stated aims; Often misunderstood: the lunar model is not heliocentrism), space-2 (Go deeper: Golius's example of the lunar eclipse observed by Ibn Yunus, and the Moon's borrowed light; Why: no stated motive, what Golius and al-Mas'udi say of his time), space-3 (Go deeper: the Moon and the planets in the second motion; Why: no stated motive, what the book shows), space-4 (Go deeper/Why/Often misunderstood on the universal plate), A-1 (Go deeper: translation from Sanskrit and Greek; Why: patron and a named historian's reason; Often misunderstood: the sundial is not the first clock). All Arabic and English; `check_depth.py --lesson ...` GREEN for all five. The Qur'an material of the old layers (Nallino's remark on the Zij's preface) was dropped from space-1 (not needed by E2.5); the Maragha and Copernicus "Two views" sections were dropped (maragha has no baseline sources; Copernicus is not asked by E2.5).
- elec-1..4: no depth layer, rows removed.

### Prose
Subject: Brief rewritten, "How this syllabus works" rewritten (it described Qur'an and verse cards). Front matter of existing files left as it was (including `source_lang: en` and `translators: [Devin]` in the old Urdu/English files). New files (A unit, A-1): ar source, en and ur translators [Claude Code; claude-sonnet-5-5].

### Unclear in the runbook / notes
- Card length: 40-80 words holds in English; the Urdu texts run longer (up to 99) because Urdu needs more words for the same clauses; the gate does not count words.
- The `find_entity.py` alias search did not find person/sheikh-muszaphar-shukor, person/farouk-el-baz or person/anousheh-ansari for "astronaut", "رائد فضاء", "space station": they were found only by grepping the prose (`grep -rliE "astronaut|spacecraft|space station|outer space|space shuttle|spaceflight|rocket|Apollo" content/en`). The runbook's advice to grep by topic was what refuted two of the gaps assigned to me (E1.1, E1.2).
- check_depth's required link count is 2-4 for Grades 6-8 (the rubric says 3-4).
- Subject record `lessons:` of Grade 1 etc. list only strands that have lessons; Grade 6 lists all five since each has at least one lesson.

