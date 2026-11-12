# Run log ca-on-g11-hsp3u
Start 2026-11-12T06:21Z. End 2026-11-12T06:33Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:21Z Read the fleet prompt and the runbook. `fetch_ontario.py --list HSP` gave HSP3C and HSP3U; fetched "HSP3U" as `ontario-hsp3u` (manifest `docs/courses/curricula/ontario-hsp3u.json`; "Introduction to Anthropology, Psychology, and Sociology"; 4 strands, 13 overall, 43 specific expectations). Source id from `ontario_source.py ontario-hsp3u`: source/ontario-curriculum-social-sciences-humanities.
- Read all 43 expectations. Strand A (15) names no subject matter: gap register as skills expectations.
- Searched the graph with find_entity.py for every topic (people, schools of thought, methods, factors, topic words in Arabic) and read the brief of each candidate with entity_brief.py `--full`.
- Wrote 4 lessons, 3 units (B, C, D), 1 subject through a script kept in the scratchpad (not in the repository), Arabic, English and Urdu throughout, then the gap register, the evidence table and this log.
- 06:31Z first gate run: GREEN. Word counts of two English connection texts exceeded 80; trimmed them (the gate does not check this); gate and cite-check re-run at 06:32Z, results below.

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| b-1 how cultures differ and meet | B2.2, B2.3, B3.1 | practice/aqiqa, concept/harakat-al-tarjama, person/al-biruni-muhammad-ibn-ahmad |
| c-1 needs, motivation, personality in a lecturer's talks | C1.2, C2.3, C3.2 | concept/nazariyyat-al-dafiyya, concept/al-tahfiz, concept/tahlil-disc |
| d-1 Ibn Khaldun and the science of human society | D1.1 | person/ibn-khaldun, concept/umran, concept/asabiyya |
| d-2 how environment and kinship shape groups | D2.1, D3.2 | concept/athar-al-iqlim, concept/social-condition-jahiliyya |

## Sentences "The expectation asks the student to ___; this record shows ___"
- D1.1 / person/ibn-khaldun: explain the significance of contributions of theorists to sociology (the Ministry's examples name Ibn Khaldun); this record shows his book's subject, umran, and the Mawsu'at's judgement that it is the first book on the philosophy of history and human society among the scholars of Arab-Islamic civilisation.
- D1.1 / concept/umran: same; shows his reasons why humans must associate.
- D1.1 / concept/asabiyya: same; shows a term he made the key to the rise and fall of states, with the record's own note that its source does not set out his theory.
- D2.1 / concept/athar-al-iqlim: explain how factors such as physical environment influence group behaviour; this record shows one thinker's account of climate and the character and colour of peoples, given as his view.
- D3.2 / concept/social-condition-jahiliyya: explain how social structures such as family affect behaviour; this record shows one contemporary author's account of kinship solidarity as the basis of tribal society, with his judgement marked as a judgement.
- B3.1 / practice/aqiqa: explain how culture produces diverse forms of behaviour, such as variation in rites of passage between cultures; this record shows one birth rite (kind `rite_of_passage`) with its differences between schools and between the Arabian desert and elsewhere.
- B2.2 / concept/harakat-al-tarjama: describe the effects of diffusion on culture; this record shows books of other peoples carried into Arabic, with al-Jahiz on what the carrying loses.
- B2.3 / person/al-biruni-muhammad-ibn-ahmad: explain how studying the cultural systems of other places and groups helps understanding; this record shows a scholar who lived among the Indians and learned their language to study them.
- C1.2 / concept/nazariyyat-al-dafiyya: summarize the key ideas of a major psychological theory (the Ministry's examples name humanistic theory and Maslow); this record shows a lecturer's retelling of Maslow's hierarchy of needs. Marginal: a management lecture, not psychology; the lesson Brief says so.
- C2.3 / concept/al-tahfiz: explain how motivation influences individual behaviour; this record shows a lecturer's definition and three conditions of motivation (his view).
- C3.2 / concept/tahlil-disc: assess how personality traits shape behaviour; this record shows the DISC model as one lecturer presents it, with his own statement that he is not a psychologist.

## Judgement calls
- **Marginal links, kept.** Strand C holds nothing from psychology as a discipline. I kept one lesson built only on a modern lecturer's management talks (three records, all citing source/assabile-tareq-al-suwaidan), because each expectation is partly served and the lesson Brief and each connection say plainly that it is a lecturer's account, that he says he is not a psychologist, and that the class must bring the psychology. A reviewer may prefer the strand in the gap register; the three expectations (C1.2, C2.3, C3.2) can move there without touching any other record.
- **Ibn Khaldun's climate passage.** concept/athar-al-iqlim attributes claims about peoples to Ibn Khaldun (colour, character, religion by climate). The text keeps "determined", "held", "one thinker's account" and rejects nothing; the closing question asks how a sociologist would test the claim. Only the sentences about the temperate fourth climate and about colour and temperament of air are restated; the sentence on prophecy and on Mali, Kukaw and Takrur is left out.
- **D2.1 and B2.1.** The same record could serve B2.1 (anthropological perspective). I linked it once, to D2.1, and put B2.1 in the register with that reason.
- **Rejected candidates.** concept/surat-al-mutadayyin-fi-al-ilam (a studio discussion of the screen image of the religious person, much of it about films on terrorism) for D2.2 and D2.3: it is about media content, not about influence on behaviour, and it would bring modern conflict material into a school course. concept/temperament (Ibn Sina's mizaj, a humoral quality) for C2.3: "temperament" there is a medical quality of the body, not the psychological factor of the expectation; linking by the shared word would be a loose match. concept/tarbiya for C3.1 and D3.3: a lecturer's advice on raising children, not an account of socialization. work/kitab-al-hind: a draft card with no prose, so nothing to restate. concept/malakat-al-lugha for B1.3: one thinker's theory of learning Arabic, not an area of anthropology.
- **Ur/Ar/En differences between the records.** person/ibn-khaldun: the Mawsu'at's "first book" sentence is in the Arabic and English prose, not in the Urdu prose. The Arabic and English connection texts state it (with the attribution); the Urdu text omits it and uses the Urdu record's own sentences about the Muqaddima. concept/social-condition-jahiliyya: the Arabic record's judgement is "الحضيض من الضعف والعماية" (weakness and blindness); the Urdu record says "ضعف اور جہالت" (weakness and ignorance). Each text follows its own record. concept/umran Urdu: "تو تعاون لازم ہے" follows the Urdu record.
- **Hedges kept.** "Al-Rahiq al-Makhtum states"; "the record notes ... not yet added" (modern studies); "The editor cites Sachau"; "Ibn al-Nadim reports from Abu Sulayman al-Mantiqi"; "he is not a psychologist"; "a lecturer's account". No superlative stated in the museum's voice; the one superlative (Sachau's "greatest phenomenon") is attributed.
- **Era marks.** The records write the years 1943 and 1030 CE; the Arabic and Urdu texts follow each record (1943 bare; 1030م and 1887م in Arabic, 1030ء and 1887ء in Urdu, as the al-Biruni record writes them).
- **Kind choices.** The list is closed: concepts and a practice use `reflection`, persons `scholar`. The practice/aqiqa record has kind `rite_of_passage`, which the closed list cannot say (see Proposals).
- **Subject order.** The subject has `order: 1` like the other Grade 11 subjects; the grade record's `lessons:` list is not mine to edit, so the subject is not listed there (as for the other fleet subjects).

## Gate results
- 06:32Z `python3 scripts/courses/check_course.py course/ca-on-g11-hsp3u --official .cache/curricula/ontario-hsp3u/official.json --strict --save`: `RESULT: GREEN (23 checks passed)`. Saved at `docs/courses/gates/check-ca-on-g11-hsp3u.out`.
- `npx tsx scripts/cite-check.ts` over the 8 records: `cite-check: 8 pass, 0 fail of 8 record(s) — the bar is citations to defined sources plus recorded provenance (docs/agents/publication-standard.md)`.
- `npm run validate`, `npm test`, build: not run (fleet rule).

## Counts
1 subject, 3 units, 4 lessons, 11 connections (11 distinct records); 9 of 43 specific expectations in lessons; 34 in the gap register (15 skills of strand A; 19 on subject matter: B1.1, B1.2, B1.3, B1.4, B2.1, B3.2, C1.1, C1.3, C1.4, C2.1, C2.2, C3.1, C3.3, D1.2, D1.3, D2.2, D2.3, D3.1, D3.3). Strand A has no unit.

## More lessons possible
None. Every expectation the records honestly serve is in a lesson. work/al-muqaddima (the book) is left unlinked: person/ibn-khaldun and concept/umran already carry its subject, and a fourth connection would exceed the three a lesson holds.

## Proposals (what the schema cannot say yet)
- **Connection kinds.** The closed list has no `practice` or `rite` (practice/aqiqa is a `rite_of_passage` record), no `term`/`concept`, and no `work`/`document` (the translation movement and a book). I used `reflection` for concepts and rites.
- **Positions.** The closed list `before | within | after` suits all four lessons; nothing needed.
- **Stranded strand.** A strand whose expectations are all skills (strand A) gets no unit; the register carries it. A way to say "this strand is deliberately method-only" would help the surface show it.

## Runbook problems that cost time
- The runbook's connection-text length (40 to 80 words) is not checked by the gate; two English texts ran to 82 and 87 words and had to be trimmed by hand. A word count in `check_course.py` would catch it.
- No other runbook problem.

## Corrections after the fleet review

Review: docs/courses-mission/verifier/fleet-flagged.md. Each change is made in en, ar and ur so the three still say the same.

- **ca-on-g11-hsp3u-c-1, MOVE-TO-GAP (whole lesson).** Lesson deleted with its three prose files; unit c (its only lesson) deleted with its three prose files and removed from the subject's `lessons:`; its 11 evidence rows deleted; C1.2, C2.3 and C3.2 added to the gap register (text copied from the lesson, the reviewer's reason in one sentence, two searches each). The subject keeps units b and d, so the subject stays; its summary and Brief (en, ar, ur) now say six expectations in two strands, through Islamic examples, and 37 in the gap register (was nine, three strands, one contemporary lecturer's talks, 34). The three Suwaidan records (concept/nazariyyat-al-dafiyya, concept/al-tahfiz, concept/tahlil-disc) are no longer linked anywhere in this course.
- Earlier text in this log that keeps the strand C lesson as a marginal link ("Marginal links, kept") is superseded by this correction.
- Not applied: none.

## Correction after the Grade 1-8 social studies fleet review

By the founder's order the connection to `concept/athar-al-iqlim` was removed from `ca-on-g11-hsp3u-d-2` (the record ranks peoples by climate and carries a skin-colour explanation), with every mention in the lesson's three prose files and its evidence rows. The lesson now rests on `concept/social-condition-jahiliyya` alone; its Brief, summary and Try this say so. Expectations D2.1 and D3.2 were left in the lesson: the kinship record still serves D3.2 and, as a factor that shapes group behaviour, D2.1, but D2.1 names the physical environment as an example and no record in the museum now serves that example. A reviewer should decide whether D2.1 moves to the gap register. The museum record itself was not edited.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g11-hsp3u-b-1, person/al-biruni-muhammad-ibn-ahmad, FIX: the superlative cut, "mastered Sanskrit to study the Indians" kept. Old clause -> new clause (en): "cites Sachau, who edited it in 1887, as calling al-Biruni the greatest phenomenon in the history of science in Islamic civilisation for having mastered Sanskrit for the sake of study" -> "cites Sachau, who edited it in 1887, as noting that al-Biruni mastered Sanskrit for the sake of study". ar: "أنه يعد البيروني أكبر ظاهرة في تاريخ العلم في الحضارة الإسلامية لأنه أتقن السنسكريتية قصدًا للدراسة" -> "أن البيروني أتقن السنسكريتية قصدًا للدراسة"; ur: the "سب سے بڑا مظہر" clause removed likewise. Evidence rows updated.
- ca-on-g11-hsp3u-d-2, concept/social-condition-jahiliyya, FIX (Brief out of step): checked and not applied. The Brief and Try this in en, ar and ur no longer promise a climate record (the lesson's prose names only the one record and says the class brings the physical environment), so there is nothing to cut. The card was left unchanged; it keeps to kinship.

Verdicts not applied: the d-2 item above, for the reason given.
