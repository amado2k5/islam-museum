# Run log: ca-on-g11-sph3u
Course: Ontario Ministry of Education, "SPH3U" (Science, Physics, Grade 11 university preparation; archive slug `ontario-sph3u`), subject `course/ca-on-g11-sph3u`.

Start 2026-11-12T06:07Z (fleet run; graph pre-built; no validate, test or build run). End 2026-11-12T06:33Z.

## Steps
- 06:07Z read the fleet prompt and the runbook.
- 06:08Z `fetch_ontario.py --list "Physics"` printed nothing; `--list "SPH"` printed SPH3U, SPH4C, SPH4U. Fetched SPH3U: 6 strands, 17 overall, 100 specific expectations. Source record: `source/ontario-curriculum-secondary-science` (ontario_source.py, reused).
- 06:10Z read the specific expectations; searched the graph by topic (kinematics, force, energy, waves, electricity and magnetism, careers, skills) with find_entity.py, two batches of about 38 searches; read the briefs of every candidate with entity_brief.py --full.
- 06:25Z wrote the plan below; generated the records, prose and gap register with helper scripts in the scratchpad (not in the repository).
- 06:31Z gate: `check_course.py ... --strict --save` GREEN (23 checks). cite-check: 12 pass, 0 fail.

## Lesson plan (final)
| Lesson | Title | Expectations | Records linked |
|---|---|---|---|
| a-1 | Careers in physics | A2.1 | person/al-jazari-engineer |
| a-2 | What did scientists contribute? | A2.2 | person/ibn-al-haytham, invention/balance-of-wisdom, invention/biruni-displacement-vessel |
| b-1 | What happens to a thrown object? | B3.3 | concept/earth-rotation-ship-analogy, event/bira-siege-674 |
| c-1 | What pulls, and what holds? | C3.1 | invention/tabula-rogeriana, object/sanam-multan |
| d-1 | Where does a machine's energy come from? | D3.1 | invention/jazari-hidden-drive-water-lifter, invention/jazari-animal-scoop-water-lifter, invention/taqi-six-cylinder-pump |
| e-1 | How do design choices shape sound? | E1.1 | invention/ziryab-fifth-string, invention/jazari-musical-boat |

Counts: 5 units (strands A, B, C, D, E), 6 lessons, 13 connections, 6 specific expectations in lessons, 94 in the gap register, out of 100. Strand F (Electricity and Magnetism) is wholly in the register and has no unit record.

## Links: "The expectation asks the student to ___; this record shows ___."
- A2.1: identify and describe careers and the training they need; this record shows one engineer-author at a court (his service and his book), and says plainly that his training is not known. The museum's part is one career; the education and training are the class's.
- A2.2: describe the contributions of scientists; these records show a scholar of mathematics and physics and his book on optics, a balance for metals and gems, and a vessel for displaced water, each with the record's own statement of what it was and was not.
- B3.3: describe a projectile's motion in the vertical and horizontal planes, with examples; these records show scholars arguing whether a stone thrown upward would fall west of its start, and a catapult shot that went too high and a later one that struck. They give no measurements, and the Brief says so.
- C3.1: give examples of different forces and their effect on velocity; these records show an attraction of objects towards the Earth compared with a magnet's pull on iron, and an iron figure said to be held by lodestones on all sides with equal forces. Neither says anything about speed; the Brief leaves friction, normal force and the effect on velocity to the class.
- D3.1: describe energy transfers and transformations; these records show water as the hidden drive of a lifter (with a cow that only looks like the source), an animal as the source of a geared lifter, and a six-piston pump whose common pipe is not an energy source. The law of conservation of energy is the class's.
- E1.1: analyse how the properties of sound influence the design of devices; these records show an extra oud string with tuning and plucking kept as separate questions, and a machine whose whistle is driven by displaced air while its harpist's fingers do not touch the strings. The wave physics is the class's.

## Judgement calls
- Modern Muslim physicists (person/abdus-salam, ali-javan, nader-engheta, feryal-ozel, mostafa-el-sayed) exist in the graph and would suit A2.2. Their records either record the faith as unknown (Javan, Engheta, Ozel) or an affiliation the records themselves flag as disputed (Salam: Ahmadiyya, with the 1974 declaration). I did not link any of them: a course page that offers them as contributions of "the Islamic world" would claim a faith the records do not establish. Proposed for the founder: decide whether the museum's modern scientists belong in curriculum lessons whatever their recorded faith.
- A2.1 (careers): only one real record (al-Jazari, engineer) says anything of a career; it is a single connection, and the Brief says the museum holds nothing on today's education and training.
- b-1: event/bira-siege-674 is a draft record (not published). It is linked because the lesson only restates its two shot sentences. Its passive "an arm was cut" is kept passive in every language, because the record's own sentence does not say who acted (the Arabic and English summaries phrase it differently; I wrote only what the full prose of both supports).
- d-1: the English record for the animal-scoop lifter says the animal "supplies motion", the Arabic says "supplies energy"; the connection says "powers", which both support.
- c-1: the Sanam Multan record is a reported description (Ibn al-Nadim, "it is said"); the connection keeps "it is said" and says the text gives no measurement. It is used for forces held in balance, not as physics evidence.
- Gap entries for C3.2 and C3.4 name the near records and say why they do not serve (Heinen compares a falling-stone argument with Galileo's examples but the record describes none of Galileo's or Newton's discoveries; the two weighing records say they are not about gravity).
- Wording of the register: where a search returned a record I read it before writing "no usable record" (the thermal bath of Eger, the draft card for Emarat-e Badgir, the music manuscript, the loudspeaker fatwas, the two earthquake events).

## More lessons possible
- invention/jazari-double-piston-pump (a waterwheel-driven pump: rotation to back-and-forth motion) could be a second D3.1 or a D3.2 connection.
- invention/jazari-castle-clock, invention/elephant-clock and invention/jazari-swordsman-candle-clock (water, weight and candle timekeeping) were read only by summary and not mapped; a lesson on the measurement of time (no SPH3U expectation names time-keeping, so left out).
- person/al-khazini and person/al-biruni-muhammad-ibn-ahmad could carry A2.2 as persons.

## Runbook problems that cost time
- `fetch_ontario.py --list "Physics"` returns nothing: the list filter matches the Ministry's course name (the code), not its subject word. `--list "SPH"` works. The runbook's example (`--list "Grade 4"`) does not suggest this.
- `find_entity.py` takes 20 to 40 seconds per call (it loads the whole graph); a loop of 26 searches ran 15 minutes and was moved to the background by the tool timeout. A batch mode (many queries, one graph load) would save most of that.
- `cite-check.ts` takes several ids as separate arguments; in zsh a variable holding the ids must be expanded as an array, otherwise it reports "no file at data/course/<all ids joined>.yaml".
- `quote_official` keeps the Ministry's skill tags (`[AI, C]`) after an e.g. list, so E1.1 ends "[…] [AI, C]"; the runbook says nothing of these tags. The translations keep them.
- A grep of the content tree is slow (about 15 s for three classes); `rg` is not installed.

## Proposals
- Connection kinds: the list has no kind for a scientific instrument or a physical thought experiment; I used `invention` for instruments, `reflection` for the earth-rotation discussion, `story` for the catapult event and `object` for the idol, as the nearest.
- A batch mode for find_entity.py (above).
- A link from each expectation to the Ministry's page for it, so that the full wording (cut by the 40-word rule) is reachable.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g11-sph3u-c-1, KEEP-BUT-FIX (tabula-rogeriana) and MOVE-TO-GAP (sanam-multan, one connection).** The Multan connection deleted; its three evidence rows deleted; every sentence naming it removed from the Brief, the section question and Try this in en, ar, ur, together with the "draw an arrow for it on a sketch of the object" instruction for it (Try this now asks for an arrow on a sketch of a falling object, then what the record does not say: how speed or direction changes). Brief: old "two historical descriptions of attraction: ... and one of an iron figure said to be held by lodestones" -> new "one historical description of attraction, a medieval author's explanation of why objects fall towards the Earth". Tabula card gains "The record says nothing about the speed or direction of the falling object." (ar, ur the same) and a matching evidence row. Lesson summary no longer mentions "forces that hold a body in place". Unit c Brief now says "one historical description". C3.1 stays in the lesson (still served by tabula-rogeriana), so it is not added to the gap register.
- Not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 10 pass, 0 fail.
- sph3u-a-2, card person/ibn-al-haytham, FIX: the editor's "most valuable thing Arab scholars produced in physics" clause cut in en, ar, ur (same change as snc2d-a-1 and snc2p-a-1). The lead's instruction was to cut it rather than name the editor.
- sph3u-b-1, card concept/earth-rotation-ship-analogy, FIX: the thrown stone is kept; one sentence added before the closing question, so the card no longer reads as if al-Jurjani backed rotation. en: "He then reaffirmed the earth's rest on other grounds."; ar: "ثم عاد فأكد سكون الأرض بحجة أخرى."; ur: "پھر انہوں نے زمین کے سکون کی تصدیق دوسری بنیاد پر کی۔".
- sph3u-b-1, card event/bira-siege-674, REMOVE (one connection): connection deleted; its two evidence rows deleted; the three prose files lose the sentence naming it (Brief now "one historical case of a thrown object", "In this case", Try this reads the ship-analogy record only). The lesson stands on the ship-analogy card, which serves B3.3.
- sph3u-e-1 (invention/ziryab-fifth-string, invention/jazari-musical-boat), REMOVE, whole lesson: lesson record and three prose files deleted; E1.1 added to the gap register (text copied from the lesson record; why and two searches recorded); evidence rows and one reviewer note deleted. The unit sph3u-e had no other lesson, so the unit record and its three prose files were deleted and removed from the subject's `lessons:` list; the subject summary and Brief now say the museum maps four of six strands (en, ar, ur). The subject stays with units a, b, c, d.
- Not applied: the review's note on sph3u-d-1 (animal-scoop card: rephrase the question to "where does the energy come from and where does it go") is attached to a KEEP verdict, and the instructions leave KEEP connections unchanged; not applied.
- Review note not applied for lack of a verdict: sph3u-a-1 and the others are KEEP.

### Records for the founder
- event/bira-siege-674: the data summary says the defenders "cut the arm off their own engine's man and hurled it", while the page says an arm was cut from the catapult's leg. The summary reads as a human limb thrown; it should be corrected in the record (outside this task's files). No card or prose in this course says a human arm was cut.
