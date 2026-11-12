# Run log: ca-on-g12-hsb4u

Started: 2026-11-12T06:17Z (date -u)
Agent: Claude Code; claude-sonnet-5-5 (fleet run, shared worktree)

## Step 0-1 (06:17Z)
- Graph already built (fleet). `fetch_ontario.py --list "Grade 12"` printed nothing; `--list "HSB4U"` printed `HSB4U`. The Ministry's name for the course is the bare code, so the fetch used "HSB4U". Fetched OK: manifest docs/courses/curricula/ontario-hsb4u.json. Course title "Challenge and Change in Society"; 4 strands, 13 overall and 49 specific expectations, all with codes.
- Runbook problem: `--list "Grade 12"` finds no secondary courses because their names carry no grade; the runbook only shows elementary examples.

## Step 2
- `ontario_source.py ontario-hsb4u` printed source/ontario-curriculum-social-sciences-humanities (already existing). Used, not edited.

## Step 4: searches (06:18Z to about 06:23Z)
find_entity.py runs are slow (about 8 s each with the graph loaded), so batches of 15 exceeded the 120 s tool timeout and were backgrounded. Topics searched: Ibn Khaldun, asabiyya, social change, literacy, migration, trade, slavery, justice, poverty/zakat, hospital, library, paper, hisba, human rights, constitution of Medina, qisas, charter/treaty, women, environment, research method/isnad, technology, printing, revolution, immigration, labour, culture, population, demography, crime, racism, globalization, deviance, Canada, internment, money, waqf.

Course is mostly contemporary Canadian sociology. Honest links found:

| Lesson | Expectation | Link sentence ("The expectation asks the student to ___; this record shows ___.") |
|---|---|---|
| b-1 | B1.1, B1.2 | outline and compare a major theory of social change and the conditions it relies on; person/ibn-khaldun, concept/asabiyya, work/al-muqaddima show one medieval thinker's science of society, the bond (asabiyya) he makes the key to the rise and fall of states, and the book that sets it out |
| d-1 | D1.4 | explain how structures operate to alleviate poverty; practice/zakat shows a duty "taken from their rich and returned to their poor", invention/waqf shows an endowment system that funded mosques, colleges, hospitals and fountains |

Considered and rejected:
- B1.3 (research designs) with work/al-muqaddima: the record speaks of verifying the methods of history, not social-science designs.
- D1.1 (human-rights agreements) with event/constitution-of-medina and the early treaties: the expectation names modern provincial, national and international instruments; a stretch.
- B2.5 (poverty, affluence and social change) with practice/zakat: no record treats the relationship to social change.
- B2.2 with concept/athar-al-iqlim (climate's effect on people): not social change or resistance to it.
- C3.3 with qisas/diya and the Muwatta Book of blood-money: not read in full; possible second pass.
- A: all 15 skills expectations to the register.

Totals: 3 of 49 expectations in lessons, 46 in the gap register.

## Step 5-6: records
- Generated with a script under the scratchpad (YAML library dump). Records: 1 subject, 2 units (B, D), 2 lessons, 5 connections. Prose in ar, en, ur for each.
- Record faults noticed: work/al-muqaddima Urdu text renders "الدولة" (state) as «دولت» (wealth); the connection says «ریاست» (state), as the Arabic and English do. concept/asabiyya English summary is a fragment mixing Arabic ("born of نعرة"); text restates only what the Arabic summary and English prose both say. practice/zakat Arabic says growth, profit and increase, English growth, blessing and increase, Urdu growth, blessing and increase: only growth and increase used; the purification clause appears in Arabic and English only and was left out.
- Hedge kept: waqf "soup kitchens" in English only/ar "عمارات": left out.

## Proposals
- Connection kinds: zakat (a pillar) filed as `reflection`, waqf (an institution) as `invention`, asabiyya (a concept) as `reflection`.
- A lookup option in fetch_ontario.py for secondary course codes (`--list HSB4U` works only as an exact name).

## Gates (06:26Z, date -u)
- check_course.py --strict --save: RESULT: GREEN (23 checks passed).
- cite-check over the 5 records: 5 pass, 0 fail of 5 record(s).
- Ended: 2026-11-12T06:26Z.

## More lessons possible
- none beyond the second-pass idea for C3.3 above.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hsb4u-d-1, invention/waqf, FIX: the card now names the poor and attributes the system clause. Old clause -> new clause (en): "The record says that from this formula grew a system that funded most of the mosques, colleges, hospitals and public fountains" -> "the TDV encyclopedia says the beneficiary may be a described group such as the poor, students or travellers. The TDV encyclopedia also says that from this formula grew a system that funded most of the mosques, colleges, hospitals, public fountains and soup kitchens". The same two changes in ar ("ويقول السجل" -> "وتقول موسوعة TDV"; the group clause and "وعماراتها التي تطعم الفقراء" added) and ur. One evidence row added for the new clause.

Verdicts not applied: none.
