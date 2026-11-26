# The founder's second set of decisions, 26 November 2026: the eleven open points

_Sent by the founder in chat on 26 November 2026, as one pasted text, in answer to the eleven points listed as still needing him (O1 to O11). It opens with a note that some items cannot honestly be given names yet, and "Here is a response you can send Claude": it was drafted with his outside reviewer and sent by him, and it is taken as his. It is kept below exactly as it arrived and is never edited. The first set is [`owner-decisions-2026-11-26.md`](owner-decisions-2026-11-26.md). What was done with this one: [`owner-register.md`](owner-register.md)._

```text
Some items cannot honestly be given names yet. They should remain explicit production dependencies rather than assigning fictional reviewers or testers.
Here is a response you can send Claude:
Claude, record the following owner decisions and dependencies.
O1. Historical reviewers and museum editor
No named historical reviewers or museum editor have been appointed yet.
Do not treat published museum records as human-approved. For now, classify them as existing source material requiring review.
Until appointments are made:

* Do not publish new historical claims as verified.
* Mark affected content `historical review pending`.
* Distinguish sourced text, uncertain claims, reconstructions and fictional simulation.
* Engineering, fictional mechanics and non-historical art prototyping may continue.
* Historical production approval remains blocked.

Please prepare reviewer briefs for these specialties:

* Nasrid Granada and al-Andalus
* Abbasid Baghdad and Islamic urban history
* Islamic architecture, material culture and clothing
* History of science, medicine and education
* Historical geography, borders and cartography
* Arabic and Urdu museum editing

I remain the product owner and final release approver, but I am not to be recorded as the historical authority merely because I approve the product. Prepare a reviewer ledger containing every claim, source, uncertainty, reviewer, decision and date.
O2. Performance machines and operators
No named operators currently have the M1 Air or Windows reference laptop. The M4 Max cannot substitute for minimum-spec validation.
Treat this as an external QA dependency. Prepare:

* A reproducible benchmark build
* A 60-minute test script
* A four-hour soak script
* Memory and renderer counters
* Instructions for gathering browser, OS and hardware information
* A standard results template
* A package that a non-developer tester can run safely

Required physical reference systems remain:

* M1 MacBook Air, 8 GB
* Windows 11 laptop with i5-1135G7 or equivalent, 8 GB and integrated graphics

Do not claim either performance gate passed until a named person runs the complete suite on the corresponding physical machine. I will arrange operators or authorize a QA coordinator separately.
O3. Art proof frames
Approved. Produce one real-time, interactive proof frame per game before full asset production.
These must be captured from the running browser game—not Blender renders, concept art, composited mockups or static backgrounds.
Each proof must include:

* A camera composition comparable to its target image
* Authored foreground, midground and background
* Target-quality architecture and materials
* Terrain, water, vegetation, atmosphere and lighting
* At least one animated human/activity group
* Weather or environmental motion
* Functional UI panels matching the target hierarchy
* At least one selectable building/location
* At least one visible simulation state change
* Low/medium/high quality comparisons
* Frame-time, memory and resource information
* Asset-production time and estimated scaling cost

Approval of a proof frame means approval of its quality direction, not automatic approval of the entire game. Do not mass-produce assets before the proof is accepted.
Create Granada’s proof first, followed by Golden Age and Atlas.
O4. Human testers
No testers have been recruited yet.
Prepare the recruitment screener, consent language, test build, facilitator guide, tasks, questionnaires and evidence template. I will recruit testers or appoint a testing coordinator.
Recruitment targets remain:

* Formative: 5–8 independent testers per game
* Beta: 12–20 testers with meaningful coverage of every game
* At least three native Arabic or Urdu readers
* Strategy-game players and non-strategy players
* Museum-oriented visitors
* People unfamiliar with islam.museum
* Keyboard-only and accessibility participants where possible

Testers must not be developers who already know the intended solution. Record device, browser, language, prior familiarity and whether assistance was required.
No enjoyment, difficulty, comprehension or “hours of engagement” gate passes until human evidence exists.
O5. Atlas picture collection
Approved target: 52 qualified pictures, sufficient for one new weekly picture round for a year.
Do not lower the quality threshold merely to reach 52.
Every picture requires:

* Rights and licence verification
* Permanent source and attribution metadata
* Museum-record association
* Accurate place/date/subject metadata
* Useful alt text
* Suitable resolution and crop
* No watermark or misleading restoration
* Historical/contextual review
* A fair clue that the image does not immediately disclose
* Clear labeling when it is a reconstruction, illustration or modern photograph

The existing four qualified pictures may be used after this metadata is complete. If 52 cannot be sourced responsibly, delay or reduce the publication schedule rather than reuse weak or unlicensed material.
O6. Atlas globe datasets
Conditionally approved, subject to documented licence and technical review for every dataset.
Relief, cloud and night-light datasets may be used only if:

* Public domain, CC0 or otherwise legally compatible with redistribution in the static game
* Attribution requirements are recorded and displayed where necessary
* Redistribution and derivative use are permitted
* The application can host/cache the required assets without a runtime paid service
* Resolution and file size fit the supported browser budgets
* Dataset version, source, download date and processing are documented
* The data does not create misleading historical meaning
* Low-quality and offline fallbacks remain functional

Modern night lights are a visual layer, not historical evidence. Label them accordingly or restrict them to appropriate presentation modes.
Return with the dataset/licence table before importing the production assets.
O7. Work order after Granada
Use sequential production with parallel preproduction:

1. Granada to its production gates
2. The Golden Age
3. Atlas

Do not attempt full production implementation of Golden Age and Atlas simultaneously unless a separately staffed team is assigned to each.
While Granada is being built, the following may proceed in parallel:

* Golden Age and Atlas proof-frame exploration
* Historical reviewer recruitment
* Atlas image collection and licensing
* Globe dataset licensing
* Human-test preparation
* Shared accessibility, localization, performance and lifecycle infrastructure

Full content and art production remains sequential so lessons from Granada’s rendering, memory, simulation, UI and asset pipeline can be applied to the other games.
O8. Granada defence
Approved: walls, readiness, logistics and diplomacy, with no tactical battle shown on screen.
The system may include:

* Walls, gates, towers and maintenance
* Defensive readiness
* Food/water reserves
* Supply routes
* Border intelligence and warnings
* Diplomacy, tribute, negotiation and alliances
* Population confidence and welfare
* Off-screen consequences
* Repairs and recovery

Do not add tactical combat units, battlefield control or graphic violence without separate approval. Conflict must remain historically reviewed, strategic and respectful.
O9. Baghdad status
Approved. The Golden Age remains explicitly labeled a fictional district inspired by historical Baghdad until reviewers are appointed.
Even after review, do not claim it is a precise reconstruction unless evidence supports that claim. Prefer language such as:
A fictional city simulation inspired by records of Abbasid Baghdad and other historical institutions of the Islamic world.
Every real institution, person, event, date or technical claim must link to its reviewed museum record. Simulation values and alternative outcomes remain clearly fictional.
O10. UAT rollback drill
Approved for one controlled UAT-only rollback exercise.
Authorization does not include production.
Requirements:

1. Record the current `_channel` release.
2. Confirm the exact rollback target.
3. Preserve current artifacts and local-save compatibility information.
4. Document rollback and forward-restore procedures.
5. Roll UAT back to the previous known release.
6. Run reachability and critical smoke tests.
7. Restore the current candidate.
8. Repeat the smoke tests.
9. Confirm `_channel` after each transition.
10. Record timings, errors, data effects and responsible operator.

Do not delete user browser data, production data or release artifacts. Stop if the rollback target cannot be verified or forward restoration is uncertain.
O11. Production deployment and labels
Confirmed: production deployment and removal of prototype labels require my separate explicit written approval.
Claude may:

* Prepare PRs
* Deploy approved UAT candidates
* Produce release artifacts
* Run permitted tests
* Prepare the production checklist and rollback plan

Claude may not, without a separate instruction:

* Deploy to production
* Redirect production traffic
* Remove prototype/not-finished labels
* Announce production readiness
* Mark a game final
* Waive failed gates

Production deployment approval and prototype-label removal are two distinct approvals. Neither should be inferred from PR approval, UAT approval or completion of one milestone.
Required next response
Please return:

1. The updated owner-decision register.
2. The remaining named-person dependencies.
3. The three proof-frame briefs and their acceptance checklist.
4. The historical-review recruitment briefs.
5. The hardware-test package outline.
6. The tester recruitment and study plan.
7. The Atlas picture and dataset licence tables.
8. The sequential roadmap and critical path.
9. The controlled UAT rollback procedure.
10. The explicit list of actions still requiring separate owner approval.

Do not mark O1, O2 or O4 complete merely because the process documents exist; they remain open until actual people are named.
```
