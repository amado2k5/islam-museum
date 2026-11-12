# Run log: ca-on-g12-sph4u
Start 2026-11-12T06:07Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "SPH4U" (Physics, Grade 12, university preparation), archive slug `ontario-sph4u`, subject `course/ca-on-g12-sph4u`, grade `course/ca-on-g12`, jurisdiction `course/ca-on-english`.

## Steps
- 06:07Z read runbook and fleet prompt. `fetch_ontario.py --list "SPH4U"` returned the exact name `SPH4U` (no suffix).
- 06:07Z fetched: 6 strands, 17 overall, 71 specific expectations. Source id from `ontario_source.py ontario-sph4u`: `source/ontario-curriculum-secondary-science` (reused; not edited).
- 06:08Z to 06:15Z searched by topic (circular motion, projectile, friction, energy, momentum, springs, pendulum, electricity, magnetism, waves, atoms, relativity, particles, careers, trebuchet, refraction, rainbow, specific gravity, noria, Jazari devices). Read briefs of the candidate records.
- 06:16Z wrote the generator (outside the repository) and the records, prose, gap register and evidence.
- 06:19Z gate: GREEN; cite-check: 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-sph4u-a-1 | Scientists and engineers of the Islamic world | A2.2 |
| ca-on-g12-sph4u-b-1 | A turning wheel, a straight push | B1.1 |
| ca-on-g12-sph4u-b-2 | Catapults in a siege | B1.2 |
| ca-on-g12-sph4u-b-3 | Moving relative to what? | B3.1 |
| ca-on-g12-sph4u-e-1 | Light in a drop of water | E3.2, E3.3 |

Strands C (Energy and Momentum), D (Fields) and F (Modern Physics) get no unit: every specific expectation is in the gap register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A2.2 / al-jazari-engineer, ibn-al-haytham: describe the contributions of scientists; the records show an engineer with a book of devices and a scholar whose Book of Optics is the principal optical work of the Islamic world.
- B1.1 / jazari-double-piston-pump, jazari-animal-scoop-water-lifter: analyse a device that applies linear or circular motion; both records turn rotation into back-and-forth motion with a pin in a slot.
- B1.2 / bira-siege-674, yaqub-ibn-sabir-al-munajjiniqi: assess the impact of devices that use linear or circular motion, such as projectile weapons; the first is an account of catapults used in a siege and its outcome, the second a catapult-corps soldier's life and book.
- B3.1 / earth-rotation-ship-analogy: distinguish reference systems; the record shows a debate that used a ship, its passengers and the shore to ask what moves relative to what, and the thrown stone as an argument.
- E3.2, E3.3 / optics, farisi-water-sphere-rainbow: describe refraction; explain the separation of light into colours; the records give light's three states including refraction, and a rainbow model of two refractions with one or two internal reflections, whose colour explanation the record says failed.

## Judgement calls
- B1.1 asks for analysis of a device; the museum gives machines described in a book, and the Brief leaves forces and calculation to the class.
- B1.2 is served by one account of a siege; the Brief says the wider assessment is the class's.
- B3.1 is served only by the ship analogy. The record never says "inertial"; Brief says so. I kept it because the expectation's object is the distinction between reference systems and the record's object is exactly motion relative to ship versus shore.
- E3.3 is served only in part: the museum's colour explanation is a failed one; the Brief says the museum offers no wave explanation. Kept because the rainbow is a case of light separating into colours and the lesson is honest about the limit.
- Ibn al-Haytham's dark room (camera obscura) and circular-mirror records were not linked: they treat straight travel and reflection by rays, not the wave nature of light (strand E) and no other SPH4U expectation fits.
- A2.1 (careers) went to the register: the Jazari record documents a court engineer's work and says nothing on training; no physics careers are held.
- Balance of wisdom (al-Khazini) and al-Biruni's displacement vessel concern weight and density; no SPH4U expectation is about them (D2.2 is universal gravitation).
- The magnetic temple record (al-Mas'udi's tale, one source, marked as needing a second source) names magnetic stones but describes no field; not linked.
- Connection kind `scholar` used for concept/optics and the ship-analogy debate (closed list); `story` for the siege; `career` for the two people.
- Skills expectations (A1.1 to A1.13) and expectations whose whole object lies outside the museum are in the register; those with a topical object carry real searches.
- Connection texts for al-Jazari, the pump, the scoop, Ibn al-Haytham and optics reuse texts already verified in the Grade 4 Science course; the Urdu was reused too.

## Failures and runbook problems
- `find_entity.py` loads the graph on every call and takes 30 seconds or more under fleet load; running a dozen searches in a loop timed out the shell. Run them in the background to files.
- `cite-check` takes ids as separate arguments; passing one shell variable holding all ids fails with "no file at data/course/<ids joined>.yaml" (my mistake, noted for others).
- `entity_brief.py` takes the id first and `--full` after; `--full` first is read as the id.
- The runbook does not say how to cite a secondary course: the source's slug is `ontario-curriculum-secondary-science`.

## More lessons possible
None beyond what is written. A lesson on D2.5 (a laboratory inquiry into the behaviour of a particle in a field) or on C3.4 (shock absorbers, perpetual motion) would need records the museum does not hold.

## Proposals
- Connection kinds: no `concept`, `discipline`, `event` or `document` kind (optics and a scholarly debate were filed under `scholar`; a siege under `story`).
- Several SPH4U expectations are "solve problems" or "conduct an inquiry" with a physics topic; the runbook has no category for them between "skills" (no searches) and "content" (real searches). I gave them topical searches.
- The museum has no record on mechanics, energy, fields or modern physics. A source family on the history of mechanics (for example Banu Musa, al-Khazini, Ibn Bajja on motion) would give strands B and C real material.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g12-sph4u-b-3, KEEP-BUT-FIX.** Brief gains: "The medieval authors argue about whether the Earth could move without our noticing; they do not distinguish inertial from non-inertial frames or speak of apparent forces." Try this now begins "This exercise is your class's own physics, not something the record contains:" (ar, ur the same). Card unchanged.
- **ca-on-g12-sph4u-e-1, KEEP-BUT-FIX.** E3.3 moved from the lesson to the gap register (reviewer's reason: the two records describe light as rays and the one record that touches colour reports failure; searches: farisi-water-sphere-rainbow, optics). The lesson now serves E3.2 (refraction) only. Summary: old "Describing refraction and the separation of light into colours (E3.2, E3.3)" -> new "Describing refraction, one of the behaviours of light (E3.2)". Brief: old first two sentences (describe and explain refraction among the behaviours of light waves, use such concepts to explain colour; the museum offers two things ...) -> new "This lesson asks you to describe refraction among the behaviours of light. The museum's two records describe light as rays, not waves; the wave explanation of colour is for your class." (ar, ur the same). The ray-diagram Try this is kept. Cards unchanged. Evidence note for e-1 updated.
- Not applied: none.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 9 pass, 0 fail.
- sph4u-a-1, card person/ibn-al-haytham, FIX: "is the principal optical work of the Islamic world" (data summary only, unattributed) and the editor's "most valuable thing Arab scholars produced in physics" both cut in en, ar, ur. The card now says he is described as an Arab mathematician and physicist who wrote the Kitab al-Manazir and that its editor places him in the fifth century AH. Evidence row replaced.
- sph4u-b-2, card person/yaqub-ibn-sabir-al-munajjiniqi, REMOVE (one connection): connection deleted, its four evidence rows deleted, and the sentences naming it removed from the Brief and Try this in en, ar, ur. The lesson stands on event/bira-siege-674 (B1.2).
- sph4u-b-2, card event/bira-siege-674, FIX: "killing many, plundering and burning the catapults" cut in en, ar, ur (and its evidence row); the source is named at the start ("According to Ibn al-Imad in Shadharat al-Dhahab, …"; ar "بحسب ابن العماد في «شذرات الذهب»"; ur "ابن العماد کی «شذرات الذہب» کے مطابق"; ur "ریکارڈ بتاتا ہے" removed). The Arabic "ثم قُطع من رجل المنجنيق ذراع ورُمي به" was made unambiguous as "…ذراع، فرُمي بالمنجنيق" so that it cannot be read as a limb being thrown; the card says an arm was cut from the catapult's leg.
- Not applied: none. Other connections KEEP, unchanged.

### Records for the founder
- event/bira-siege-674 (draft): the data summary (English) says the defenders "cut the arm off their own engine's man and hurled it"; the page says an arm was cut from the catapult's leg. Summary to be corrected in the record.
