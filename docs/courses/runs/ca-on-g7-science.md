# Run log: ca-on-g7-science
Start 2026-11-12T06:06Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Sci & Tech - Grade 7", archive slug `ontario-scitech-g7`, subject `course/ca-on-g7-science`, grade `course/ca-on-g7`, jurisdiction `course/ca-on-english`.

## Steps
- 06:06Z read runbook and fleet prompt. `fetch_ontario.py --list "Grade 7"` found "Sci & Tech - Grade 7".
- 06:07Z fetched: 5 strands, 11 overall, 50 specific expectations. Source id from `ontario_source.py ontario-scitech-g7`: `source/ontario-science-tech-2022` (reused; not edited).
- 06:08Z to 06:20Z searched and read briefs of candidate records (distillation, architecture, patterns, materials, water, agriculture, earthquakes, numbers, paper); then gap searches for every uncovered topic.
- 06:20Z to 06:26Z wrote the generator (outside the repository, in the scratchpad) and the records, then the gap register.
- 06:26Z first gate run: RESULT: GREEN, no fixes needed.
- 06:31Z cite-check run on all 14 records: 14 pass, 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g7-science-a-1 | Mathematics at work: water tunnels and ceilings | A3.1, A3.2 |
| ca-on-g7-science-a-2 | Numbers and paper: contributions that travelled | A3.3 |
| ca-on-g7-science-b-1 | One author on the environment | B1.2 |
| ca-on-g7-science-c-1 | Separating mixtures: the head of a still | C2.7 |
| ca-on-g7-science-d-1 | A fountain for a neighbourhood | D1.1 |
| ca-on-g7-science-d-2 | Arches and domes | D2.1 |
| ca-on-g7-science-d-4 | When a building falls | D2.5 |
| ca-on-g7-science-d-5 | What it is made of | D2.6 |

Strand E (Earth and Space Systems) gets no unit: all ten specific expectations are in the gap register. 41 of 50 specific expectations are in the register.

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- A3.1 / job/architect: describe science and technology concepts applied in an occupation; the record shows a trade whose holder was expected to know geometry, building technique and land measurement.
- A3.1, A3.2 / karaji-qanat-surveying: apply science with other subjects to a real problem; the record shows levelling and tunnel alignment for water in a manual from exploration to handover.
- A3.2 / kashi-muqarnas-mensuration: use maths with another field; the record shows arithmetic used to measure a muqarnas ceiling.
- A3.3 / algorism, baghdad-papermaking: analyse contributions of communities; the records separate an Indian numeral system carried by a Baghdad book from a Chinese craft moved to Baghdad.
- B1.2, B2.8 / hima, environmental-protection-in-islam, ibn-bassal-soil-water-matching: look at ways of managing land and farming; the records show a reserved pasture, one author's reading on pollution and a method of matching land, water and crop. None measures effects: the Brief says so.
- C2.7 / anbik: name an apparatus used to separate a mixture; the record names the head of the still and its use for rose-water.
- D1.1 / sabil: factors in building for a community need; the record gives siting, endowments and water supply of a public fountain building.
- D2.1 / chahartaq, keel-arch: classify structures; the records describe a domed chamber on four arches and a dome on keel arches with tie-beams. They do not classify them.
- D2.4 / girih, islamic-geometric-patterns: identify symmetry in structures; the records describe repeating star and polygon patterns on surfaces and do not name symmetry.
- D2.5 / earthquake-tsunami-425, baghdad-rains-collapse-332: factors that make a structure fail; the records name wind, earthquake and rain and what fell.
- D2.6 / zellij, abbasid-tin-glazed-ware: factors that decide a material's suitability; the records show glazed terracotta for floors and walls and a tin-oxide glaze chosen to look like porcelain.

## Judgement calls
- D2.4, D2.5, D2.1 and D2.6 are partial: the records serve the examples, not the principle. Each Brief says what the class must bring.
- Dropped as links: concept/agriculture-in-islam (author's presentation, no extra support for B1.2/B2.8 beyond the other three); concept/four-elements and the Jabir/alchemy records (older theories, not elements and compounds of atoms); concept/al-tawazun-al-kawni (a preacher's narration the record itself flags as needing a source); invention/jazari-musical-boat (its record says it is not the first programmed robot); the Jazari pumps for E1.2 (they name a power source, not impacts).
- girih and Islamic geometric patterns are thin records (one sentence each, cited to Wikidata). Used because D2.4 asks for instances of symmetry and these are the only pattern records; the connection texts restate only the overviews.
- Kinds: `career` for job/architect, `invention` for methods, `place` for buildings and the hima, `object` for the anbik, patterns and ceramics, `story` for events, `reflection` for one author's reading (closed list).
- Urdu was written for every text, including lessons, units and subject.

## Failures and runbook problems
- None in the gate. `cite-check.ts` takes one id per run, although the runbook says to pass every id; I ran it once per record (14 runs, each "1 pass, 0 fail").
- `find_entity.py` is slow when other fleet agents are running (15 to 60 seconds per call, once beyond the 120 s tool timeout).
- The 40-word rule never cut anything in this course: the Grade 7 text has no `(e.g., …)` lists, so every expectation is identical to the official text.

## More lessons possible
None beyond what is written. A lesson on E1.1 would need prose on building/emarat-e-badgir (a wind-catcher house); at present the record has none.

## Proposals
- Connection kinds: no `concept` or `discipline` kind; no `event` kind (earthquakes and rains under `story`); no `institution` kind.
- Content: records on heat, matter and ecosystems would let the museum serve strands C and E; the museum has none (see the gap register).
- Runbook: say that `cite-check.ts` takes one id.

## Corrections after the fleet review
Source: docs/courses-mission/verifier/sweep-science.md, section "Grade 7 (age 12): ca-on-g7-science".

- a-1, job/architect (FIX). EN: "The architect (mi'mar) designs a building and oversees its construction, and was expected to know geometry..." -> "...oversees its construction. The Turkish encyclopaedia TDV, in its entry on the architect, writes that he was expected to know geometry, building technique and the measurement of land." AR: the same clause now opens "وتذكر الموسوعة التركية «TDV» في مدخل المعمار أنه كان يُنتظر منه ...". UR: "ترکی کا انسائیکلوپیڈیا «TDV» معمار کے مدخل میں لکھتا ہے کہ اس سے توقع تھی کہ ...". Karaji and Kashi kept unchanged (the optional Kashi caveat was not added, as instructed).
- a-2, invention/baghdad-papermaking (FIX). The Chinese-origin and Central-Asia clause is now attributed: EN "Jonathan Bloom, in the Encyclopaedia Iranica, presents this as the story of moving a craft to a city ..."; AR "يعرض جوناثان بلوم في موسوعة إيرانيكا هذه القصة قصةَ انتقال صناعة إلى مدينة ..."; UR "جوناتھن بلوم انسائیکلوپیڈیا ایرانیکا میں اسے ... کہانی کے طور پر پیش کرتے ہیں". Ersoy/Bloom disagreement unchanged.
- b-1 (FIX for the lesson, REMOVE for two connections). concept/hima and invention/ibn-bassal-soil-water-matching removed (cards, evidence rows, every prose sentence naming them). The lesson stays on concept/environmental-protection-in-islam serving B1.2 only. B2.8 moved to the gap register. Lesson label, summary and the three Briefs, the "What would show that it worked?" and "Try this" sections rewritten to the one remaining card (no more "reserved pasture"/"medieval method"); unit b summary and Brief, and the register's cross-references to b-1 under B2.8, updated.
- c-1, d-1 (KEEP): unchanged.
- d-2, concept/chahartaq (FIX). Cut the Mughal dating clause in all three languages (EN "Rezavi finds its earliest Mughal example in the Kabuli Bagh Mosque ..."; AR "وأقدم مثال مغولي عند رضوي ..."; UR "رضوی کے نزدیک اس کی قدیم ترین مغل مثال ..."). Evidence row deleted.
- d-2, concept/keel-arch (FIX). "Yeomans counts it a Fatimid innovation that replaced" -> "it replaced" (AR "يعدّه يومانز ابتكاراً فاطمياً حلّ" -> "حلّ"; UR "یومانز اسے فاطمی اختراع سمجھتے ہیں جس نے" -> "اس نے"). Tie-beams glossed in all three languages ("timber beams that tie the columns together"). Yeomans stays the named holder of the "much lighter" judgement.
- d-3 (REMOVE, whole lesson). girih and islamic-geometric-patterns both removed, so the lesson, its three prose files and its evidence rows are deleted, it is out of unit d's lessons list (unit summary and Brief now say four lessons), and D2.4 is in the gap register. Course Brief: nine lessons -> eight.
- d-4, event/baghdad-rains-collapse-332 (FIX). Cut the death clause: EN "and many died under the rubble" ; AR "ومات خلق كثير تحت الهدم" ; UR "اور بہت سے ملبے تلے دب کر مرے". Evidence row restated. earthquake-tsunami-425 (KEEP): the card names no death toll.
- d-5, concept/zellij (REMOVE of one connection). Card, evidence rows and the sentences naming zellij in the three Briefs and "Try this" removed; the lesson stays with concept/abbasid-tin-glazed-ware (KEEP). Lesson summary narrowed to the tin-oxide glaze. D2.6 is still served, so no gap entry.
- Verdicts judged wrong and not applied: none.
- No health, diet, fasting, pregnancy or contagion card in this course, so no "history of a view, not guidance" sentence was added.
