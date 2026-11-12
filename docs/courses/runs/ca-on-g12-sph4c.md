# Run log: ca-on-g12-sph4c
Start 2026-11-12T06:36Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "SPH4C" (Physics, Grade 12, college preparation), archive slug `ontario-sph4c`, subject `course/ca-on-g12-sph4c`, grade `course/ca-on-g12`, jurisdiction `course/ca-on-english`.

## Steps
- 06:36Z read runbook and fleet prompt. `fetch_ontario.py --list SPH` returned the exact name `SPH4C` (no suffix).
- 06:37Z fetched: 6 strands, 17 overall and 91 specific expectations (A 15, B 17, C 13, D 19, E 12, F 15). Source id from `ontario_source.py ontario-sph4c`: `source/ontario-curriculum-secondary-science` (reused; not edited).
- 06:38Z to 06:48Z searched by topic and in three spellings (levers, gears, windmills, waterwheels, pumps, hydraulics, siphons, cams, catapults, friction, magnets, electricity, motion, energy, balances, density, automata, clocks, gravity, irrigation, fountains, careers, pressure, circuits, Newton, engines, robots, vehicles, torque, fluids, magnetism, scientists, acceleration). Read the briefs of the fourteen candidate records.
- 06:49Z wrote the generator (outside the repository), records, prose, gap register and evidence.
- 06:51Z first gate run could not load the course list: another fleet agent's file `data/course/ca-on-g11-sbi3u-d-1.yaml` was not valid YAML at that moment. Not mine; the gate was re-run at 06:54Z and now reports such files as skipped.
- 06:54Z gate: RESULT: GREEN (24 checks passed); cite-check: 10 pass, 0 fail.
End 2026-11-12T06:56Z

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-sph4c-a-1 | Scientists and engineers of the Islamic world | A2.2 |
| ca-on-g12-sph4c-c-1 | Gears, shafts and cams | C3.1, C3.2 |
| ca-on-g12-sph4c-e-1 | Water that does the work | E3.3 |
| ca-on-g12-sph4c-f-1 | From two pistons to six | F1.1, F3.3 |
| ca-on-g12-sph4c-f-2 | Weighing water to compare materials | F2.1 |

Strands B (Motion and its Applications) and D (Electricity and Magnetism) get no unit: every specific expectation is in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.2 / al-jazari-engineer: describe the contributions of scientists; the record shows an engineer who wrote a book of mechanical devices, with his service and the book's six divisions.
- C3.1, C3.2 / biruni-simplified-calendar-gearing: describe applications of simple machines (gears, wheels and axles) and explain the operation of compound machines; the record shows a gear train where one gear shares a shaft with another and meshes with a third.
- C3.1, C3.2 / jazari-double-piston-pump: a stream drives a wheel and gears, and a pin in a slotted rod turns rotation into back-and-forth piston motion.
- C3.2 / taqi-six-cylinder-pump: a cam raises a piston through a rocker and a weight drives it down; six units share an outlet.
- E3.3 / jazari-hidden-drive-water-lifter, jazari-double-piston-pump: describe how selected energy-transformation technologies operate; both records show flowing water driving a wheel and a shaft, and the first says the arrangement needs a supply, a drainage path and a fall.
- F1.1, F3.3 / jazari-double-piston-pump, taqi-six-cylinder-pump: research the development of a pump and describe its components; the records show a two-piston pump and a six-piston pump with valves, cams and weights, and the second record says no evidence of historical manufacture is known.
- F2.1 / biruni-displacement-vessel, balance-of-wisdom: use the term density; the records show a vessel that collects displaced water to compare the volume and weight of a sample, and a balance that compares air weight with loss of weight in water.

## Judgement calls
- Every connection text except the calendar gearing reuses a text already verified in an earlier course (SPH4U, SPH3U, Grade 8 Science), in all three languages, with its own sources. The calendar-gearing text is new; its Urdu is my translation, since the record has no Urdu prose.
- E3.3 asks for wind turbines, photoelectric cells or heat engines as examples; the museum has none. The two water-driven machines are an honest instance of "an energy-transformation technology", and the Brief says what the class must bring.
- F1.1 asks for a hydraulic or pneumatic system "used in a specific technology". The two pumps are water pumps, hydraulic in the plain sense; the Brief says the modern systems are for the class.
- F2.1 lists nine terms; the museum serves only density (through relative density, "specific gravity" as a ratio to water). The Brief says so.
- The siege of al-Bira (a duel of catapults) is not linked to C2.7 (construct a machine such as a trebuchet): the record tells a duel, not how a catapult is built or measured. It is in the register.
- Elephant clock, castle clock, taqi astronomical clock, hidden-drive and alternating fountain records were read or searched. The clocks name gears and floats but no SPH4C expectation is about timekeeping; the alternating fountain is a timing switch and no expectation asks for one.
- The magnetic-temple record (one tale of magnetic stones, a single source) describes no field, so D3.4 and D3.5 are in the register.
- A2.1 (careers) is in the register: the Jazari record documents a court engineer's service and no training path.
- Connection kind `invention` used for all device records; `career` for the person. `invention` is the nearest in the closed list to the instrument record of the calendar gearing.

## Failures and runbook problems
- Shell lesson: `find_entity.py` in a loop with unquoted arguments passes the quotation marks literally and returns "0 real records" for everything. Quote correctly (`eval` or an array) before trusting a "no record" result.
- `find_entity.py` and `entity_brief.py` each take 30 to 90 seconds when several run together; run them in the background to files and read the files.
- `entity_brief.py ... --full` on a device record returns 30 to 40 KB; reading the Arabic and English prose by section with a short script was quicker than printing it.
- `timeout` does not exist on this macOS shell; do not use it to wrap background runs.
- The gate loads every course YAML in the repository; one fleet agent's momentarily invalid file stops every other agent's gate. A suggestion: skip unparseable files with a warning, or have the gate load only the target subtree plus the grade and jurisdiction records.

## More lessons possible
- A lesson on the animal-powered scoop lifter (invention/jazari-animal-scoop-water-lifter) for C3.1: gears carrying rotation to a pin moving in a slot (already used in SPH4U). Not added, since it repeats the double-piston pump's mechanism and the lesson C-1 already has three records.
- A lesson on the alternating fountain for F3.3 (components that switch the supply) if a reviewer judges a bucket-and-pipe switch a component of a hydraulic system.

## Proposals
- Connection kinds: no `instrument`, `concept` or `event` kind (a calendar gear train and a pump are both `invention`; a siege was not used).
- The museum has no record on mechanics, friction, levers, fluids, electricity or magnetism as physics; a source family on the history of statics and hydrostatics (Banu Musa, al-Khazini, al-Biruni, Ibn al-Haytham on weights and fluids) would give strands C and F real material.
- The runbook's gap-register rule has no category between "skills" (no searches) and "content" (real searches) for "solve problems" and "conduct an inquiry" expectations with a physics topic; I gave them topical searches.
