# Run log: ontario-arts-g2
Start: 2026-11-12T06:35Z

Agent: Claude Code (claude-sonnet-5-5), fleet run. Authority: Ontario Ministry of Education. Course "Arts - Grade 2", archive slug `ontario-arts-g2`, subject `course/ca-on-g2-arts`, grade `course/ca-on-g2`, jurisdiction `course/ca-on-english`.

## Steps
- 06:35Z read runbook and fleet prompt; `--list "Grade 2"` found "Arts - Grade 2".
- 06:35Z fetched: 4 strands (Dance, Drama, Music, Visual Arts), 12 overall, 38 specific expectations. Source `source/ontario-curriculum-elementary-arts` (existing, not edited).
- 06:36Z to 06:38Z searched topics (Mughal and miniature painting, pottery, qawwali, festivals, symbols, murals, dance, drama and puppets) and read briefs for mughal-painting, iznik-pottery, nusrat-fatih-ali-khan, al-qiyan.
- 06:38Z wrote records and prose by scripts kept outside the repository; gap register and evidence.
- 06:39Z gate: GREEN (23 checks). cite-check: 8 pass, 0 fail.

## Plan (lessons)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g2-arts-b-1 | Storytellers on the road | B3.2 |
| ca-on-g2-arts-c-1 | Why people make music | C3.1, C3.2 |
| ca-on-g2-arts-d-1 | Paintings and pots from other places | D3.2 |
| ca-on-g2-arts-d-2 | Patterns that cover surfaces | D2.2 |

Strand A (Dance) has no unit: all nine specific expectations are in the register.

## Link sentences
- B3.2 / concept/ashik: be aware of drama and theatre traditions of communities around the world (the examples name a narrator in street theatre); the record shows wandering poet-minstrels who sang and recited at public gatherings among Anatolian and Azerbaijani Turks.
- B3.2 / work/alpamish: same; the record shows a heroic poem whose Central Asian versions are in verse, with prose only at the divisions.
- C3.1 / concept/al-qiyan: describe contexts in which people make music; the record shows singing women as an early Abbasid social institution, trained and owned by caliphs, the wealthy or a broker.
- C3.2 / person/nusrat-fatih-ali-khan: identify musical forms of different communities, times and places (the examples name Indian classical music); the record shows qawwali, the Sufi devotional song of Pakistan and India, passed down in a family for some six centuries.
- D3.2 / concept/mughal-painting: be aware of works of art from diverse communities (the examples name miniature paintings from India); the record shows Mughal court painting with its naturalism and portraiture. The record never says "miniature", so the texts and Brief do not either.
- D3.2 / concept/iznik-pottery: the examples name ceramics; the record shows Ottoman pottery with naturalistic flowers.
- D2.2 / concept/islamic-geometric-patterns and concept/arabesque: explain how design communicates meaning; the records give a description of the patterns and Yeomans's analysis of the arabesque as surface-respecting. D2.2 covers the student's own work too; the lesson says the records do not discuss colour or texture.

## Judgement calls
- C3.1 asks for reasons people make music in daily life. The qiyan record shows one context (listening gatherings arranged by owners), and the qawwali record shows a devotional setting only as "Sufi devotional song". The lesson Brief says the museum offers two cases and the rest is for the class.
- concept/al-qiyan is `draft` itself (as in the Grade 4 run); its Arabic says "houses of the muqayyin", English "houses of those who hired them": the clause is left out.
- Nusrat record: English "above all associated with qawwali"; Arabic does not say "above all": left out. English "Hindu (Rajput)" vs Arabic "Indian (Rajput)" in the Mughal record: only "Rajput" is written.
- The Ashik, Alpamish, al-qiyan, geometric-patterns and arabesque connection texts are the Grade 4 run's bytes, already checked against their records there.
- Dance A3.1/A3.2: no honest link (see register); sama is not called a dance by the museum's records.

## Counts
Units 3 (B, C, D); lessons 4; connections 8; expectations in lessons 5 of 38; in the gap register 33 of 38 (28 skills, 5 topical: A3.1, A3.2, B3.1, D2.3, D3.1).

## Runbook problems
- None that cost time. `find_entity.py` was fast (about 10 seconds each, run in parallel).

## More lessons possible
- D3.2: concept/deccani-painting or concept/bijapur-painting for a second Indian painting tradition; concept/zellij or building/alhambra for a Moroccan or Andalusian tradition.
- C3.2: person/begum-akhtar or person/mehdi-hassan (ghazal) for further South Asian music, if their briefs hold enough.

## Proposals
- Connection kinds: `object` was used for art forms (Mughal painting, Iznik pottery) and `story` for a social institution and a musician; the closed list has no `art_form`, `institution` or `musician`.
End: see the final UTC line below.
End: 2026-11-12T06:39Z

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g2-arts-c-1, MOVE-TO-GAP of one connection (coordinator's grade-suitability decision under "Fit the grade", not in the review): removed the connection to concept/al-qiyan. Reason: a record about enslaved singing women, "owned by a broker who displayed them", is not suitable for Grades 2 to 4, however well it fits the music expectation. Its three evidence rows were deleted. The lesson keeps the qawwali connection (person/nusrat-fatih-ali-khan) and both expectations (C3.1 and C3.2, which the qawwali card, a devotional song and who gathers to hear it, still serves). Summary, Brief and Try this rewritten in all three languages to name one case, not two (the Try this no longer links concept/al-qiyan).

Verdicts not applied: none.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g2-arts-b-1, concept/ashik and work/alpamish, REMOVE (b), both connections: whole lesson MOVE-TO-GAP. Lesson and prose deleted; unit ca-on-g2-arts-b deleted. B3.2 added to the gap register (the Brief itself said "not staged theatre"; the epic tells of captivity and a killing, not suited to age 7). Its 6 evidence rows deleted.
- ca-on-g2-arts (subject): summary (en, ar, ur) and Brief (en, ar, ur) said three strands with four lessons; now two strands with three lessons, Dance and Drama in the gap register.
- ca-on-g2-arts-c-1, person/nusrat-fatih-ali-khan, KEEP: unchanged.
- ca-on-g2-arts-d-1, concept/mughal-painting, FIX: en: "From the late sixteenth century into the mid-seventeenth it concentrated on naturalism and portraiture: a Mughal elephant is a specific elephant in a relatively naturalistic space, where the line makes a Deccani one a general type." -> "Beach describes a Mughal elephant as a specific elephant in a relatively naturalistic space." ar: "ومنذ أواخر القرن السادس عشر ... أما الفيل الدكني فيجعله الخط نمطًا عامًا." -> "ويصف بيتش الفيل المغولي بأنه فيل بعينه في فضاء طبيعي نسبيًا." ur: "سولہویں صدی کے آخر سے ... خط ایک عمومی نمونہ بنا دیتا ہے۔" -> "بیچ مغل ہاتھی کو ایک مخصوص ہاتھی بتاتا ہے جو نسبتاً فطری فضا میں دکھایا گیا ہے۔" Beach is named; the Rajput clause of the first sentence was kept (the review did not ask to cut it). Evidence: the naturalism row deleted, the elephant row rewritten.
- ca-on-g2-arts-d-1, concept/iznik-pottery, KEEP: unchanged.
- ca-on-g2-arts-d-2, concept/islamic-geometric-patterns, KEEP: unchanged.
- ca-on-g2-arts-d-2, concept/arabesque, FIX: cut the Owen Jones / Graeco-Roman sentences and also the geometric-forms clause (age 7), keeping the surface and two-dimensional idea in plain words. en: "In Yeomans's view geometric forms in Islamic art are dynamic and open-ended, ... unlike closed, naturalistic Graeco-Roman ornament. He cites Owen Jones's Grammar of Ornament (1856): ... What would you change in a drawing so that it works with its surface?" -> "In Yeomans's view the plant arabesque is stylised and flat, that is two-dimensional, respecting the surface. What would you change in a drawing so that it respects its surface?" ar -> "يرى يومانز أن الأرابيسك النباتي منمّط ومسطّح، أي ثنائي البعد، يحترم السطح. ماذا تغيّر في رسم لتجعله يحترم سطحه؟" ur -> "یومنز کے خیال میں نباتی عربیسک تجریدی اور سپاٹ یعنی دو جہتی ہے اور سطح کا احترام کرتا ہے۔ آپ ڈرائنگ میں کیا بدلیں گے کہ وہ اپنی سطح کا احترام کرے؟" The question was reworded because "works with it" was Owen Jones's phrase. Evidence: the Owen Jones row deleted, the Yeomans row rewritten.

Verdicts not applied: none.

Records for the founder (not edited): concept/iznik-pottery (Arabic record) gives the tulip as "الخزامى" (that word means lavender; the tulip is simply التوليب); the card repeats the Arabic record's word, as the review asked ("fix in the record, not the card"). concept/ashik and work/alpamish: see the gap entry.
