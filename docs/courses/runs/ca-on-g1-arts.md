# Run log: ca-on-g1-arts

Course: Ontario Arts - Grade 1, archive slug `ontario-arts-g1`, subject `course/ca-on-g1-arts`. Agent: Claude Code, claude-sonnet-5-5.
Start 2026-11-12T06:35Z. End 2026-11-12T06:43Z.

## Steps
- 06:35Z read the runbook; `fetch_ontario.py "Arts - Grade 1" ontario-arts-g1` (4 strands, 12 overall, 38 specific). Source id from `ontario_source.py`: `source/ontario-curriculum-elementary-arts` (existing record reused).
- 06:37Z searched the graph (find_entity, entity_brief) on dance, drama, theatre, shadow play, song, drum, instruments, oud, painting, colour, textiles, sculpture, tales, weddings, calligraphy, geometric patterns, pottery, Taj Mahal.
- 06:40Z wrote records, prose, gaps with a generator kept in the scratch directory (not in the repository); gate and cite-check.
- 06:43Z wrote evidence and this log.

## Plan
| Lesson | Title | Expectations |
|---|---|---|
| a-1 | Dances of many communities | A3.1 |
| b-1 | Tales to act out | B1.1, B3.2 |
| d-1 | Lines and shapes that repeat | D1.3, D2.2 |
| d-2 | Buildings and bowls from other times and places | D3.2 |

Strand C (Music) has no lesson and no unit: every music expectation is in the gap register.

## Links, as the sentence "The expectation asks the student to ___; this record shows ___."
- a-1 practice/sama-mawlawiyya: asks the student to describe dances of different communities (A3.1); the record shows one Sufi gathering with whirling to the ney. The Brief says the class brings the other dances. The record's English summary is the same as its label, so the English text restates the Arabic and English overview lines.
- b-1 work/kalila-wa-dimna: asks the student to enact stories from diverse communities and to know the roles and subjects of stories from around the world (B1.1, B3.2); the record shows a book of fables from India rendered into Arabic. The record says only that opinions differ about who made it; the text keeps that and names no author as the maker.
- d-1 concept/islamic-geometric-patterns: asks the student to use elements of design such as line and shape to communicate (D1.3, D2.2); the record shows repeated patterns of stars, polygons and grids. The record is one cited line (Wikidata), so the text restates only that line.
- d-1 concept/arabesque: the same expectations; the record shows interlaced plant ornament and Yeomans's view that it is two-dimensional and respects the surface.
- d-2 building/taj-mahal: asks for awareness of works of art from diverse places and times, naming iconic architecture such as the Taj Mahal (D3.2); the record shows its builder, dates, dome, calligraphy and inlay. The record's Arabic overview mentions a "garden crossed by channels" in words ("متقاطعة الأنهار") that differ from the English ("channels"); the text omits the garden.
- d-2 object/qasa-firuz: asks for decorations on old artefacts and ceramic works (D3.2); the record shows a bowl with a lute player.

## Judgement calls
- B1.1 placed in the drama lesson although it asks for dramatic play: the museum serves only the sources part, and the Brief says so.
- Music expectations C1.1, C2.2, C3.1, C3.2 went to the register after searches: the museum holds records on the oud and on an instrument-bowl but no piece of music, song or lullaby to sing or hear. concept/al-ud was not linked (its record carries a legendary origin report, "needs a further source").
- D2.3 (signs and symbols) not linked to calligraphy: calligraphy is an art of script, not a record on signs and symbols in daily life.
- D3.1 (art forms in the student's own surroundings) went to the register although tiraz and carpet records exist; the object is the student's surroundings.
- Skills expectations (making, performing, reflecting, self-assessment) go to the register with the standard reason: 24 of 32.
- Urdu connection text for the arabesque uses "ایک مخصوص اسلوب کا" for "stylised", a paraphrase; flagged for a reviewer.

## More lessons possible
None beyond those written: the museum's textile records (tiraz, Mamluk carpets) could illustrate D3.1 if the expectation were read as about art forms in general rather than the student's own surroundings; not done.

## Problems with the runbook
- None that cost time. The runbook says subject records carry no `order` in earlier courses; this run followed that (no `order` on the subject).

## Proposals
- Connection kinds: no `instrument`, `ritual` or `book` kind; used `reflection` (Sufi gathering), `story` (book of fables), `object` (patterns, ornament, bowl) and `place` (Taj Mahal).

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g1-arts-a-1, practice/sama-mawlawiyya, REMOVE (b), the only connection: whole lesson MOVE-TO-GAP. Deleted the lesson record and its en/ar/ur prose; unit ca-on-g1-arts-a had no other lesson, so the unit record and its three prose files were deleted and the unit removed from the subject's `lessons:` list. A3.1 added to the gap register (text copied from the lesson; reason: the record is one Wikidata-only sentence, never says dance, and carries the unattributed "best-known Sufi ritual"). Its 3 evidence rows deleted. The A3.2 gap's search note ("which serves A3.1") was updated to say the record was tried for A3.1 and removed.
- ca-on-g1-arts-b-1, work/kalila-wa-dimna, REMOVE (b), the only connection: whole lesson MOVE-TO-GAP. Lesson and prose deleted; unit ca-on-g1-arts-b deleted the same way. B1.1 and B3.2 added to the gap register. Its 4 evidence rows deleted.
- ca-on-g1-arts (subject): the summary (en, ar, ur) and the Brief (en, ar, ur) said the museum maps parts of three strands (dance, drama, visual arts); now they say parts of one, visual arts.
- ca-on-g1-arts-d-1, concept/islamic-geometric-patterns, KEEP: unchanged.
- ca-on-g1-arts-d-1, concept/arabesque, FIX: removed the Yeomans sentence. en: "It adds that Yeomans sees the vegetal arabesque as stylised and two-dimensional, respecting the surface." -> (deleted); ar: "ويضيف أن يومانز يرى الأرابيسك النباتي منمّطًا ثنائي البعد يحترم السطح." -> (deleted); ur: "وہ مزید کہتا ہے کہ یومانز کے نزدیک نباتاتی عربسک ایک مخصوص اسلوب کا اور دو جہتی ہے اور سطح کا لحاظ رکھتا ہے۔" -> (deleted). The plant-ornament sentence and the closing question are kept. The connection no longer cites source/yeomans-islamic-cairo-2006; the Yeomans evidence row was deleted and the Arabic row trimmed.
- ca-on-g1-arts-d-2, building/taj-mahal, FIX: removed the Rezavi sentence. en: "It adds that Syed Ali Nadeem Rezavi finds its facades the most representative Mughal example of calligraphic decoration." -> (deleted); ar: "ويضيف أن سيد علي نديم رضوي يرى واجهاته أدلّ مثال مغولي على الزخرفة الخطية." -> (deleted); ur: "وہ مزید کہتا ہے کہ سید علی ندیم رضوی کے نزدیک اس کے اگواڑے مغل خطاطانہ آرائش کی سب سے نمائندہ مثال ہیں۔" -> (deleted). Source rezavi-iranian-influence-indian-architecture-2002 dropped from the connection; the Rezavi evidence row deleted and the Arabic row trimmed.
- ca-on-g1-arts-d-2, object/qasa-firuz, KEEP: unchanged.

Verdicts not applied: none.

Records for the founder (not edited): practice/sama-mawlawiyya states "best-known Sufi ritual" with no attribution (Wikidata only) and never says dance; work/kalila-wa-dimna is a bibliographic note with no tale, character or theme.
