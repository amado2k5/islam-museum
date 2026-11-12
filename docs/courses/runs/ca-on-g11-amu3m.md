# Run log ca-on-g11-amu3m
Start 2026-11-12T06:34Z. End 2026-11-12T06:42Z.
Outcome: ingested (draft). Fleet run: graph already built; validate, test, build, derive and step 9 not run.

## Steps
- 06:34Z Read runbook and fleet prompt. `fetch_ontario.py --list "AMU"` returned AMU1O, AMU1O (PDF), AMU2O, AMU2O (PDF), AMU3M, AMU3O, AMU4E, AMU4M; fetched "AMU3M" (archive slug `ontario-amu3m`): 3 strands, 10 overall, 29 specific expectations as published (28 distinct codes, see below). Source id from `ontario_source.py`: source/ontario-curriculum-secondary-arts (reused).
- Read all expectations. Ran about 20 topic searches with find_entity (several in parallel, 10 to 20 s each), then read the briefs of the candidates. A first pass (music, Ziryab, al-Farabi, oud, maqam, al-Kindi) found only the Abbasid-court records; a second pass by topic (qawwali, Sufi music, nasheed, adhan, tajwid, notation, copyright, ensemble, careers) found the qawwali and nasheed records, which carry B2.2 and B2.3.
- Wrote 5 lessons in 2 units (strand A became wholly gap) and the subject through a script kept in the scratchpad, YAML dumped with a library; Arabic, English and Urdu throughout.
- Gate and cite-check run (results below).

## Plan (lesson: expectations; records)
| Lesson | Expectations | Records linked |
|---|---|---|
| b-1 music and its community | B2.1 | concept/al-qiyan, work/kun-faya-kun-rockstar |
| b-2 musicians who shaped the music | B2.2 | person/ziryab, person/ishaq-al-mawsili, person/abida-parvin |
| b-3 traditional, popular and world music meet | B2.3 | person/nusrat-fatih-ali-khan, work/night-song-nusrat, group/raihan-band |
| b-4 how do we know about a musician | B1.4 | person/ziryab, invention/ziryab-fifth-string |
| c-1 instruments, forms and music of other lands | C2.1, C2.2 | invention/ziryab-fifth-string, work/javahir-al-musiqat-i-muhammadi, person/abida-parvin |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- B2.1 / qiyan, Kun Faya Kun: analyse how music responds to and reflects its community; the records show a court institution of trained singing slave women of the early Abbasid age and a film qawwali dedicated to a saint and drawn from time spent with the qawwals at his dargah.
- B2.2 / Ziryab, Ishaq, Abida Parveen: analyse the impact of significant individuals from various cultures; the records show attributed contributions of a ninth-century musician, a singer and the pupil who took from him, and a Sufi singer trained by her father at shrines.
- B2.3 / Nusrat, Night Song, Raihan: analyse interrelationships between traditional, commercial and art music; the records show a qawwal signing with a label and working with a film-score composer, an album joining qawwali to ambient production and Senegalese musicians, and a nasheed group on a commercial label reaching a Commonwealth meeting and sales abroad.
- B1.4 / Ziryab, fifth string: gather information from reliable sources on musicians and weigh it; the records show a source-critical comparison of a later biography with older reports and a photograph the record itself says is a later instrument.
- C2.1 / fifth string: understand the development of a form or instrument; the record shows an added string on an inherited four-string oud as a refinement, not a new instrument.
- C2.2 / Javahir, Abida Parveen: research and report on traditional music around the world; the museum serves only a South Asian manuscript on music and dance (whose music the record does not describe; the connection says so) and a singer's forms, languages and venues. The Brief says that nothing on Aboriginal music in Canada exists.

## Judgement calls and notes
- Every other expectation (22) went to the gap register: strand A (performing, composing, technology: skills), B1.1 to B1.3, B3.1 to B3.3, B4.1 to B4.3, C1.1, C1.2, C3.1 to C3.3. B1.2 was weighed: the museum has singers and a film song but nothing that supplies the listening, so it stays a gap.
- Arabic and English of the Abida Parveen record disagree: English says she sang "at dargahs and urs", Arabic says "dargahs and weddings" (الأعراس). The connection says only "dargahs", which both say.
- The Kun Faya Kun record's Arabic says the museum writes the Arabic title in Latin letters only; the connection text does the same and does not gloss its meaning.
- The record on Abida Parveen mentions her refusal of film offers on account of her faith; not used.
- Qur'an: no Qur'an connection; no linked record cites a verse the lesson needs.

## Search register (what the key searches returned)
- "music" "موسيقى" "Musiqa": 31 records (awards, a film soundtrack, a record label, a singer, a book on music and dance, a fatwa); "Ziryab": person/ziryab, invention/ziryab-fifth-string; "oud" "عود" "lute": object/ud-shami (draft, two lines, a Cleveland oud), concept/al-ud (origin story only, draft; not used); "al-Farabi": person/al-farabi (a music treatise is mentioned in one line only; not used); "qawwali" "Sufi music": Nusrat, Abida Parveen, Kun Faya Kun, Night Song, sama' (a fiqh term); "nasheed": Raihan, Rabbani.
- Gap searches are in the register, docs/courses/gaps/ca-on-g11-amu3m.yaml.

## Runbook problems that cost time
- The authority's document prints one expectation under code B1.3 in strand C (it should read C1.3) after the strand B expectation of the same code. The checker keys expectations by code, so the second overwrites the first: the register holds one B1.3 entry with the strand C text, and the strand B B1.3 (analyse and assess the effectiveness of music) is covered by no entry of its own. This is a defect of the source and of the checker, not of the course. Proposal: key by strand and position, or flag a duplicate code.
- `sed -i` on macOS needs an empty suffix argument; a chained command failed silently on it and I repeated the edits with Python.

## Proposals
- Connection kinds: a group (Raihan) and an album (Night Song) had to be `story` and `object`; the closed list has no `work` or `group`. A person who is a singer is `scholar`.
- Duplicate codes in the authority's document (above).

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-arts-mathematics.md.

- b-1, concept/al-qiyan, FIX. en: "owned by a broker who displayed them in the houses of those who hired them, so that young men might listen" removed; "The Kitab al-Aghani is full of their biographies" added (record: "full of their biographies"); closing "What does such an institution show about the society that kept it?" → "Where was this music heard, and who made it?". ar: "ومنهم قيان عامة يملكهن نخّاس ... والإنفاق عليهن" removed, الأغاني sentence added, closing question replaced. ur: the broker sentence ("جن کا مالک ایک دلال ... خرچ اٹھائیں") removed, Aghani sentence added, closing question replaced. Lesson text (three languages): "who paid for it or sponsored it" → "who made it".
- b-2, person/ishaq-al-mawsili, REMOVE: connection deleted; Brief ("two cases") and Try this in en, ar, ur no longer name the record; evidence rows deleted.
- b-2, person/abida-parvin, FIX: the training card replaced by the record's own facts on her mark (breakthrough on Radio Pakistan 1973, forms and languages, tours since 1993, Nishan-e-Imtiaz 23 March 2021), in en, ar, ur; title changed ("A voice of the shrines" → "A Sufi singer's reach" and the matching ar, ur); closing question now asks what the record shows of her mark and what it leaves out. Evidence rows rewritten.
- c-1, work/javahir-al-musiqat-i-muhammadi, REMOVE: connection deleted; Brief, section text and Try this in the three languages no longer name it ("one instrument and one singer"); the unit's Brief and summaries changed to match; evidence rows deleted.
- c-1, expectation C2.1 moved to the gap register (no remaining connection serves a musical form); lesson summary and unit summary no longer cite C2.1.
- Urdu: the unwrapped "(ابوریجنل)" in expectation C2.2 and in the lesson Brief now wrapped in U+2066 ... U+2069.
- No verdict was judged wrong.
