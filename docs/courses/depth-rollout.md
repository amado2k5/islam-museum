# The depth layer: what is done and what comes next

The depth rubric is `docs/courses/depth-rubric.md`. This file records where it has been applied and the order proposed for the rest. Lesson counts are read from the records (`data/course/`), not from memory.

## Done in the first run (13 November 2026)

26 courses, 147 lessons: every Science and Technology course and every Social Studies and Geography course in the Explorer. Arabic and English; Urdu untouched (section "Across all courses" below).

| Group | Courses | Lessons |
|---|---|---|
| Science and Technology, Grades 1–8 | `ca-on-g1-science` … `ca-on-g8-science` | 55 |
| Science, secondary | `snc1w`, `snc2d`, `snc2p`, `sbi3u`, `sch3u`, `sph3u`, `svn3m`, `ses4u`, `snc4m`, `sph4c`, `sph4u` | 64 |
| Social Studies, Grades 1–4 and 6 | `ca-on-g1-social-studies` … `ca-on-g6-social-studies` | 16 |
| Geography, Grades 7–8 | `ca-on-g7-geography`, `ca-on-g8-geography` | 12 |

`python3 scripts/courses/check_depth.py --all-enriched` lists, course by course, how many lessons carry the layer. A lesson without one is a lesson whose linked records could not honestly carry it; the reasons are in section "Lessons left without a depth layer".

## Done in the second run (13 November 2026)

Group 1 of the order below: 4 courses, 17 lessons, all in the Grades 9–12 band, through the justice-and-morality lens: `hse4m` Equity and Social Justice (7), `hsb4u` Challenge and Change in Society (2), `hsc4m` World Cultures (5), `hsp3u` Anthropology, Psychology and Sociology (3). All 17 carry the layer. The rubric applied as written. Two notes from the run: where a lesson's records give the jurists' rules but no historian's judgement of how far they were kept (`hse4m-b-3`), the lesson says so and leaves the weighing to the class; and "Often misunderstood" was sometimes used for a record's account of rule against practice (`hse4m-d-2`), which is a looser fit than a correction and worth a reader's eye. Record faults met: `practice/aqiqa` (Abu Hanifa's view, "recommended" in Arabic and "optional" in English), `event/coffee-banned-damascus-953` (whose house was demolished), and `concept/zakat` and `concept/riq-fiqh` (Arabic passages the English lacks).

## Done in the third run (13 November 2026)

Group 2: the two Philosophy courses, `hzb3m` The Big Questions (6) and `hzt4u` Questions and Theories (5). All 11 lessons carry the layer, in the Grades 9–12 band. Rubric 2.2 was read for philosophy: each lesson lets a student reconstruct one argument (the claim, the thinker's reasons as the record reports them, a named critic's objection), always as the thinker's view. Positions on the decree and human freedom are given as the creed texts the record quotes; the schools' positions on ending a pregnancy are reported as the jurists' encyclopaedia gives them, with no ruling and no guidance. Record faults met: `concept/qadar` points to `concept/kasb`, which is about earning a living and not the theological term; in `person/aflatun` a definition of the soul stands under "Thought" although its sentence attributes it to "some people"; five of the records these lessons rest on are still drafts (`concept/ibtal-al-falsafa`, `concept/qadar`, `concept/ilm-al-kalam`, `concept/ijhad`, `work/fasl-al-maqal`).

## Done in the fourth run (13 November 2026)

Group 3: the two World Religions courses, `hrt3m` (10) and `hrf3o` (12). All 22 lessons carry the layer, in the Grades 9–12 band, under the fourth lens the founder approved that day (rubric 2.4: beliefs and practices as their adherents hold them, attributed, Sunni position first, then the academic view, then other views, no verdict; the page teaches about a religion and never teaches it). "Why they did it" was not used. Where a record gives one tradition at length and another in a sentence (`practice/ashura`), the lesson says the page is incomplete at that point and adds nothing from outside the record. Thin lessons: `hrt3m-f-2` (the record of the Day is short), `hrt3m-e-2` (the record says nothing of how the festival was instituted), `hrf3o-c-3` (the imam and muezzin records rest on Wikidata alone). Several "Go deeper" sections in `hrt3m` run to about 190 words, over the rubric's range and inside the checker's bound: a reader may want them cut. One softening to review: in `hrf3o-e-2` the Encyclopaedia of Islam's judgement of the jurists' law of fasting beside al-Ghazali's is given only as "supplements". Record faults met: `practice/ramadan-fiqh` and `practice/eid-al-fitr` differ between Arabic and English in one sentence each; `event/hijri-calendar-decree` gives year 16 where `concept/hijri-calendar` says the reports differ; `concept/akhira` and `concept/tawhid` say of themselves that the Maturidi and non-Sunni statements are not yet added.

## Done in the fifth run (13 November 2026)

Group 4: Mathematics, `ca-on-g1-math` … `ca-on-g8-math` (45) and `mth1w` (8). All 53 lessons carry the layer. Because a few records recur at many grades (`invention/algorism` in eight lessons, `concept/ilm-al-misaha` in eight), the work was dealt out by strand and not by grade (number; algebra and patterns; measurement and data in two bands; financial literacy), so that each record's scenes were shared out once and no two lessons repeat one. The motivation lens (2.3) carried the number, algebra and measurement lessons; the financial-literacy lessons used the justice lens (2.1), with every ruling on saving, debt, interest and alms given as the jurists' and nothing reading as financial advice. The lessons teach no mathematics the records do not state: the class supplies the mathematics, the lesson supplies who, why, how we know and a question. Stated purposes used: al-Khwarizmi's preface to his algebra (in full at Grade 8, in a clause elsewhere), al-Uqlidisi's introduction, al-Kindi's introduction and his addressee's request. No motive in the records: Abu al-Wafa', al-Farisi, al-Karaji. Record faults met: `concept/girih` rests on Wikidata alone with uncited sections, so the four pattern lessons lean on the arabesque, Samarra stucco and geometric-pattern records; `concept/zakat` (the rate on irrigated crops is clear in Arabic and ambiguous in English, so crop rates were left out); `concept/idkhar-fiqh` (English adds "jurists agree" and a condition the Arabic lacks); `event/egypt-census-837` names no one who ordered the count; `concept/hijri-calendar` says nothing in English about the crescent that begins a month. `scripts/courses/check_depth.py` gained `DEPTH_EVIDENCE_EXTRA`, so that several writers can share one course without sharing its evidence file.

## Done in the sixth run (13 November 2026)

Group 5: `lvv4u` Classical Civilization, 7 lessons, all carrying the layer in the Grades 9–12 band. The lens was source criticism: how Greek and Roman learning is known through Arabic hands (Ibn al-Nadim's Fihrist, al-Mas'udi, al-Biruni), who reports what, and what the records hold only as titles and reports of reading. Scenes already used by the Philosophy lessons were not repeated. One lesson (`lvv4u-c-2`) rests on a single modern book, and says so. Record faults met: `work/usul-uqlidis` and `person/uqlidis` name the carpenter and the translator of the Elements differently (the lesson reports both and does not decide); `person/batlamus` has Arabic sections with no English; seven of the records these lessons rest on are still drafts.

## Done in the seventh run (13 November 2026)

Group 6: the Arts. `ca-on-g1-arts` … `ca-on-g8-arts` (31), Visual Arts `avi1o`, `avi2o`, `avi3m`, `avi3o`, `avi4e`, `avi4m` (34), Music `amu3m`, `amu4m` (8). All 73 lessons carry the layer, under the arts lens and the music rule the founder approved that day (rubric 2.5). The work was dealt out by theme (pattern and ornament; calligraphy, scripts and careers; materials, techniques and painting; function, patronage and display; elementary music and drama; senior music), because a few records serve most lessons (`job/calligrapher` in eighteen, `concept/arabesque` in fourteen). No lesson says in the museum's voice what a form means: whether ornament carries symbolic meaning appears once, as two named articles disagreeing (`g8-arts-d-1`), and the purpose of the Dome of the Rock as the three groups of explanation the Encyclopaedia of Islam sets out (`avi4m-b-2`). On music: the records the elementary lessons link carry no juristic view, so none raises the question; one senior lesson (`amu4m-b-1`) gives Ibn al-Qayyim's argument and the permitters' as he reports them, with no verdict, and says the schools' own positions are not yet in the record. Elementary lessons draw nothing from passages on slavery, wine or battle; the two senior lessons on the court's enslaved singers keep to training, service and how we know.

Thin or weak records met: `concept/girih`, `concept/islamic-geometric-patterns`, `concept/oriental-carpets-renaissance`, `concept/muqarnas` and `event/fez-sacred-music-festival` rest on Wikidata alone (names, places and dates only; the lessons lean on neighbouring records, and the Grade 3 festival lesson is short); the Doha museum, Nusrat Fateh Ali Khan, Abida Parveen, Night Song, Kun Faya Kun and Raihan records rest on Wikipedia (no praise, and "How do we know?" says so). Record faults: `person/abida-parvin` (Arabic renders "urs" as weddings); `concept/al-ud` ("frets" in English, pegs in Arabic); `practice/persian-painting-pigments-and-gold` (crimson in Arabic, vermilion in English); `concept/tasweer-images-and-picturing` (an Arabic clause the English lacks); `job/calligrapher` (an English sentence the Arabic lacks); several calligraphers and architects named in the records have no prose of their own (Hayreddin, Davud Ağa, Mir Ali Heravi, Hafiz Osman), and the Nizamuddin shrine record has none.

## The rest, in the proposed order

39 courses, 213 lessons when the first run ended; group 1 is now done, and group 2 after it, then group 3, then group 4, then group 5, then group 6, leaving 5 courses and 30 lessons. The order puts first the courses where the educator's three directions apply without a new decision, and last the ones that need a new lens or carry the most risk for the least depth.

| # | Courses | Lessons | Lens | Why here | New decision needed first |
|---|---|---|---|---|---|
| 1 (done) | `hse4m` Equity and Social Justice (7), `hsb4u` Challenge and Change in Society (2), `hsc4m` World Cultures (5), `hsp3u` Anthropology, Psychology and Sociology (3) | 17 | Justice and morality (rubric 2.1), Grades 9–12 band | The educator's first direction, at the grade where shortfall and historiography are required. The rubric applies as written. | None. |
| 2 (done) | `hzb3m` Philosophy: The Big Questions (6), `hzt4u` Philosophy: Questions and Theories (5) | 11 | The scientists' and philosophers' frame (2.2) and counter-arguments | The "metaphysical understanding" the educator asked for is the subject of these courses. | None, if each lesson keeps to named thinkers and their named critics. |
| 3 (done) | `hrt3m` (10) and `hrf3o` (12) World Religions | 22 | A beliefs-and-practices lens | The museum's densest holdings, and the courses a faith-school teacher and a public-school teacher will both read most closely. | Done: the fourth lens, approved by the founder on 13 November 2026, is rubric section 2.4. |
| 4 (done) | Mathematics: `ca-on-g1-math` … `ca-on-g8-math` (45), `mth1w` (8) | 53 | Motivation (2.3) | "Why did they do it" has strong material here (the record of algorism reports al-Khwarizmi's own preface; inheritance shares, the direction of prayer and the calendar as problems mathematics served). | None. Expect many lessons with only the three required sections: the museum's mathematics records are few. |
| 5 (done) | `lvv4u` Classical Civilization | 7 | Source criticism (rubric section 3, "How do we know?") | Transmission and translation of Greek learning: the Grades 9–12 band fits as written. | None. |
| 6 (done) | The Arts: `ca-on-g1-arts` … `ca-on-g8-arts` (31); Visual Arts `avi1o`, `avi2o`, `avi3m`, `avi3o`, `avi4e`, `avi4m` (34); Music `amu3m`, `amu4m` (8) | 73 | An arts lens | Not done in the first run on purpose: the three lenses do not transfer. A lesson on a mosque lamp or a muqarnas vault needs its own questions (what the maker and the patron meant the object to do, what the inscription says, how historians read the avoidance of figures), and those are new decisions. | Done: the arts lens and the music rule, approved by the founder on 13 November 2026, are rubric section 2.5. |
| 7 | `hfa4u` Nutrition and Health (9), `hnb4m` The World of Fashion (6) | 15 | Justice and morality (2.1) for fashion and labour; none natural for nutrition | Low depth for the risk: food and health records report rulings and remedies, and the rule that nothing reads as advice leaves little to deepen. | None, but review every nutrition lesson by hand. |
| 8 | International Languages, Levels 1–3 | 15 | None of the three | The expectations ask for cultural knowledge of a language's regions; depth here is a "Go deeper" scene and links. | None. Lowest priority. |

## Across all courses

- **Urdu.** The first run did not touch `content/ur/` (the instruction for the run), so an Urdu lesson page shows the lesson as it was. Adding the Urdu sections means writing them, adding the Urdu headings to `DEPTH` in `site/src/lib/courses.ts` and to `HEAD` in `scripts/courses/check_depth.py`, and checking them. One pass over all enriched lessons, after the Arabic and English have been read by a person.
- **The Grade 6 Science pilot.** `ca-on-g6-science` is the pre-pipeline pilot and fails the ingestion gate (`docs/courses/FLEET.md`): several of its cards link no record. Its depth layer was written only from real records, and its cards were not changed. Re-ingesting that course through the pipeline is a separate task and would let its remaining lessons be deepened.
- **A human reading.** Every lesson stays `status.review: draft`. The reader's check in the rubric (section 9) is the step that turns this layer from checked to trusted; the educator who asked for it is the natural first reader for the Grades 1–8 lessons.
- **Records worth strengthening.** Where a lesson's "Why they did it" had to say that the records preserve no motive, the fix belongs in the person or work record (a read of the preface, cited), not in the lesson. The list is in section "Motives the records do not yet hold".

## Lessons left without a depth layer

Four lessons, all in the Grade 6 Science pilot. Each was searched and no record honestly serves its expectations; nothing was stretched.

| Lesson | Why |
|---|---|
| `ca-on-g6-sci-elec-1` Static electricity | The card links `language/arabic`, whose record says nothing about amber or electricity. The lightning records are about strikes on buildings and a death, not static charge. |
| `ca-on-g6-sci-elec-2` Current electricity and circuits | `work/kitab-al-hiyal` is not a record; the al-Jazari and Banu Musa records describe mechanical devices, not circuits. |
| `ca-on-g6-sci-elec-4` Using energy wisely | No record on electrical energy use. `concept/al-israf` has Arabic prose only. |
| `ca-on-g6-sci-fly-4` Flight, society and the environment | The card links nothing; no record covers the costs and benefits of aviation. |

## Motives the records do not yet hold

"Why they did it" had to say that the records preserve no stated motive for these scientists, and then give what the records do show (patron, post, problem served). A cited reading of the preface or introduction, added to the person or work record, would let the lessons say more.

| Scientist | Lessons | What the records give today |
|---|---|---|
| al-Jazari | Grades 1, 4, 8; `sph3u`, `sph4c`, `sph4u` | The commission by Nasir al-Din Mahmud; TDV's remark that little is known of his life beyond his book's introduction. What the introduction itself says is not in the record. |
| Ibn al-Haytham | Grades 4, 10; `snc2p`, `sph4u` | That the Manazir opens with the basmala; the theological treatises TDV lists; the Nile task. No statement of purpose. |
| al-Khazini | Grade 8; `sch3u`, `sph3u`, `sph4c` | The treasury of Sanjar; that his preface names Muhammad as his prophet; his history of predecessors. |
| Ibn al-Nafis | Grades 5, 8, 10; `sbi3u`, `snc4m` | The aim of the commentary (to explain Ibn Sina's anatomy). |
| al-Karaji, al-Kashi | Grade 7 | The scope of the manual; the audiences a historian names. |
| Jabir ibn Hayyan, Ibn Sina (drug testing) | `sch3u`, `snc4m` | Where they worked and what the text sets out; no motive. |
| The Banu Musa | Grade 2 | That they spent generously on books and translators. |

Where the records do hold a stated purpose, the lessons use it: al-Khwarizmi's preface to his algebra (Grade 7), al-Razi's preface to the treatise on smallpox and measles (`snc2d`), al-Jahiz's opening of the Book of Animals (Grade 2, `sbi3u`), al-Battani's preface as Nallino reads it (Grade 6), al-Biruni's preface to al-Qanun al-Mas'udi (`ses4u`), Taqi al-Din's stated intention (Grade 8), the emperor's requirement for Hagia Sophia (Grade 5).

## Found on the way: records and cards for a later fix

None of these was changed in the depth run (the run's scope was the lessons' prose). Each is a separate, small task.

- **The Grade 6 Science pilot's cards say more than the records do.** `sci-fly-3` says every account ends with the missing tail (only al-Maqqari gives it; another account has him land unharmed). `sci-space-1` gives a year length for al-Battani that his record does not hold. `sci-space-3` says Copernicus borrowed from Ibn al-Shatir (the record keeps the question open between Roberts and King) and that scholars of several faiths worked at Maragha (not in the record). `sci-bio-1`, `sci-bio-2` and `sci-bio-3` credit al-Jahiz and Ibn al-Baytar with claims their records do not carry. `sci-elec-3` has a card on the "Baghdad battery" with no record behind it. `object/astrolabe` is a stub. The depth layers of those lessons state what the records support.
- **`ca-on-g3-science-d-1`.** The card says al-Muqaddasi described three layers and an iron lattice in the Dome of the Rock; `building/dome-of-the-rock` does not hold this in either language.
- **Two records speak in the museum's own voice.** `concept/al-waba` ends by calling a hadith "a divinely-wise quarantine", and `concept/al-taun` opens "A torment God sent upon whom He willed". Both need attribution.
- **Arabic and English disagree.** `person/ibn-al-nafis` (eighty volumes "left unfinished" against "fair-copied"); `concept/hijama` (the Hanbali view on cupping in ihram); `person/al-farghani` (the name Golius reports); `person/mubarak-ahmad-khan` (bags "banned and harmful" against "polluting"); `invention/jazari-hidden-drive-water-lifter` (the cow "hollow" against "light"). `concept/hima`, `concept/al-aqalim-al-saba` and `event/earthquake-tsunami-425` have Arabic passages the English lacks; `concept/al-abad-al-falakiyya` has no English prose.
- **A dangling link.** Both Jordanian fatwa records link `group/general-iftaa-department-jordan`, which has no record.
- **Run-together text.** Several English invention records have lost spaces around numbers ("in416 AH", "dated432", "astronomy,surveying"): `invention/algorism`, `invention/kashi-muqarnas-mensuration`, `invention/baghdad-papermaking`, `invention/al-biruni-earth-radius`, `invention/tusi-linear-astrolabe`, `invention/haytham-incoming-light-vision`. The evidence rows quote them as they stand, so a clean-up of those records must update the rows (the checker will name them).
- **`person/al-jazari-engineer`** carries `born: 1136` and `died: 1206` in its data while its prose says the service years are not to be converted into birth and death dates.
