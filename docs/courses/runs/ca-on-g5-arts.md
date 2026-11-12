# Run log: Grade 5 Arts (course/ca-on-g5-arts)

Agent: Claude Code; claude-sonnet-5-5. Fleet run in a shared worktree. Started 2026-11-12T06:28Z (`date -u`); gates passed 2026-11-12T06:36Z.

## Outcome
Ingested. 1 subject, 2 units, 5 lessons, 11 connections (10 distinct records). 6 of 38 specific expectations are in lessons, 32 are in the gap register. Everything is draft.

## Steps
- 06:28Z fetched `Arts - Grade 5` as `ontario-arts-g5` (4 strands; 12 overall, 38 specific expectations). Source record `source/ontario-curriculum-elementary-arts` (reused, made by `ontario_source.py`).
- 06:29Z searched the graph (about 25 spellings and topics) and read the briefs of 14 records.
- 06:34Z wrote records and prose with scripts kept in the scratchpad (`ca-on-g5-arts/`), then the gap register, evidence table.
- 06:35Z gate with `--strict --save`: RESULT: GREEN (23 checks passed). cite-check: 8 pass, 0 fail.

## Lesson plan

| Lesson | Title | Expectations | Records |
|---|---|---|---|
| ca-on-g5-arts-c-1 | Music in today's culture | C3.1 | work/kun-faya-kun-rockstar, person/nusrat-fatih-ali-khan |
| ca-on-g5-arts-c-2 | Instruments across time: the oud | C3.2 | concept/al-ud, invention/ziryab-fifth-string |
| ca-on-g5-arts-d-1 | Reading a style | D2.3 | concept/kufic-script, concept/nastaliq-script |
| ca-on-g5-arts-d-2 | Pattern, surface and colour | D2.2 | concept/arabesque, concept/zellij |
| ca-on-g5-arts-d-3 | Art that carries a belief | D3.1, D3.2 | concept/islamic-calligraphy, practice/manuscript-illumination-tazhib, concept/kufic-script |

## Link sentences ("The expectation asks the student to ___; this record shows ___")
- C3.1 / Kun Faya Kun: identify influences of music within contemporary culture; this record shows a qawwali written for a 2011 film scene.
- C3.1 / Nusrat: same; this record shows a qawwal whose work for film and a world-music label widened his audience.
- C3.2 / al-ud: show awareness of instruments in traditions from early times; this record shows the oud as the caliphs' courts' chief instrument and an attributed origin story, hedged.
- C3.2 / Ziryab string: same; this record shows an attributed extra string, with its source-critical limits.
- D2.3 / Kufic and nasta'liq: read signs, symbols and style; these records show how a style's name, features and origin story read.
- D2.2 / arabesque and zellij: explain how elements and principles of design communicate meaning; these show flat vegetal pattern respecting its surface, and colour and cutting carrying a tile design.
- D3.1, D3.2 / calligraphy, illumination, kufic: describe how forms and styles represent messages and contexts and reflect beliefs; these show the art honoured for its link to writing the Qur'an, the decoration of Qur'an pages, and a script on coins and a monument.

## Judgement calls
- The oud record: the English says "chief instrument", the Arabic "first" (الأولى); both mean the leading instrument and I kept each language's own word. The English says the instrument's "body" was made like a thigh, the Arabic says "صدر" (chest); I left that clause out and kept only the neck and head clause, which agree.
- The `al-ud` record is itself draft and says its account "needs a further source"; the connection says so.
- Kufic is linked in two lessons (d-1 and d-3) with different sentences of its record.
- The kinds are the nearest of the closed list: `object` for a song, a script on coins and tilework, `invention` for scripts and arts, `career` for a singer.
- Lesson summaries carry the expectation codes without parentheses in Arabic and Urdu, so no Arabic-script parenthetical needs the isolate wrap.

## Gap register (32)
27 are skills or making/performing expectations (A1.1 to A1.4, A2.1 to A2.3, B1.1 to B1.4, B2.1 to B2.3, C1.1 to C1.5, C2.1 to C2.3, D1.1 to D1.4, D2.4). Five have real searches: A3.1, A3.2 (dance), B3.1, B3.2 (drama and theatre), D2.1 (interpreting art works).

## More lessons possible
None. The museum has no honest link beyond these five lessons.

## Runbook problems
- None that cost time. The fleet prompt says skip graph and validate; the gate ran without them.

## Proposals
- Connection kinds: no `song`, `script` or `art form` kind; `object` and `invention` were the nearest.
- Dance and Drama: the museum has no records on dance forms or theatre; a harvest lane on Islamic-world performing arts would let Grade 5 to 8 Arts use strands A and B.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g5-arts-d-3, KEEP-BUT-FIX: calligraphy superlative. Calligraphy superlative (review section 5, verdict KEEP-BUT-FIX): the connection to concept/islamic-calligraphy no longer says it is "the most honoured of the Islamic arts" / "أشرف الفنون الإسلامية" / "اسلامی فنون میں سب سے معزز" (the record cites only Wikidata, which cannot carry a superlative). Old clause -> new clause: en "It is the most honoured of the Islamic arts because of its link to the writing of the Qur'an, and its scripts varied among kufic, naskh, thuluth and diwani." -> "Its scripts include Kufic, Naskh, Thuluth and Diwani."; ar "وهو أشرف الفنون الإسلامية لارتباطه بكتابة القرآن، وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني" -> "ومن خطوطه الكوفي والنسخ والثلث والديواني"; ur "قرآن کی کتابت سے تعلق کی وجہ سے یہ اسلامی فنون میں سب سے معزز ہے، اور اس کے خط ... میں مختلف رہے" -> "اس کے خطوں میں کوفی، نسخ، ثلث اور دیوانی شامل ہیں". The attributions "the record calls it" / "یہ ریکارڈ کہتا ہے" were removed with the superlative. The lesson's own question and Brief were checked for the same claim. Beyond the card: the title "The most honoured of the arts" -> "Writing as art" (ar "الكتابة فنًّا", ur "تحریر بطور فن"); its question "What does it mean for a society to honour an art because of what it writes?" -> "What does a choice of script tell you about those who used it?"; the prose heading "What does art say about what its makers honour?" -> "What does art say about the beliefs of its makers?" (ar and ur the same). Evidence: the calligraphy row (claim and quotation, Arabic and English) was rewritten to the scripts clause and the first sentence only, and says the superlative is not restated.

Verdicts not applied: none.

## Corrections after the fleet review (second pass: the Arts sweep)

Source: docs/courses-mission/verifier/sweep-arts.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. The review gives a verdict per connection: FIX is KEEP-BUT-FIX of that connection; REMOVE is MOVE-TO-GAP of that connection (and of the lesson when it was the only one). KEEP verdicts were left unchanged. Gate and cite-check were re-run after these changes (results in the report that launched this fix; the gate output is saved in docs/courses/gates/).

- ca-on-g5-arts-c-2, concept/al-ud, REMOVE (a): connection removed. The record's origin account (a man hanging his dead son's body from a tree until the limbs came apart, then shaping the oud on it) is not suitable for a ten-year-old, and its "chief instrument at the courts of the caliphs" is unattributed. Checked every other elementary Arts lesson (and all lesson records in data/course): concept/al-ud is linked nowhere else in Grades 1 to 8; it is still linked in the secondary lesson ca-on-g12-amu4m-c-1, which is outside this fix. The lesson stays through invention/ziryab-fifth-string (KEEP) and C3.2 is still served. Brief, the two question sections and the summary (en, ar, ur) rewritten to one example: summary "shown through the oud, the story of its origin and the account of a string added to it" -> "shown through the oud and the account of a string added to it"; "In the two examples notice who attributes what to whom, and what the source says and what still needs another source" -> "In the example notice who attributes what to whom, what the source says and what a later scholar says about it"; "In each example look for what already existed before the attributed addition, and for who played the instrument earlier" -> "Look for what already existed before the attributed addition". 3 evidence rows deleted.
- ca-on-g5-arts-c-2, invention/ziryab-fifth-string, KEEP: unchanged.
- ca-on-g5-arts-c-1 (both connections) and ca-on-g5-arts-d-1 (kufic, nastaliq), KEEP: unchanged.
- ca-on-g5-arts-d-2, concept/arabesque, FIX: en first sentence "Richard Yeomans sees the genesis of the Islamic arabesque in Samarra style B, where leaves and palmettes become abstract, lose their stems and are organised into the surface geometry of polygons and polylobes." -> "Richard Yeomans sees the beginning of the Islamic arabesque in a style found at Samarra, where leaves become simple shapes, lose their stems and are arranged into a flat pattern on the surface." ar: "... يُشهد في طراز سامراء الثاني ⁦(ب)⁩ ... من مضلعات ومتعددات الفصوص." -> "... يُشهد في طراز وُجد في سامراء، حيث تصير الأوراق أشكالًا بسيطة وتفقد سيقانها وتنتظم في نقش مسطّح على السطح." ur: "... سامرا کے طرزِ (ب) میں ... کثیر الفصوص کی سطحی ہندسی ترتیب میں منظم ہو جاتے ہیں۔" -> "... سامرا کے ایک طرز میں دکھائی دیتی ہے، جہاں پتے سادہ شکلیں بن جاتے ہیں، اپنے تنے کھو دیتے ہیں اور سطح پر ایک ہموار نقش میں ترتیب پاتے ہیں۔" The Graeco-Roman clause is kept at this age (the review did not flag it). Evidence row for the Samarra claim rewritten as a plain-word restatement.
- ca-on-g5-arts-d-2, concept/zellij, KEEP: unchanged.
- ca-on-g5-arts-d-3, concept/islamic-calligraphy, REMOVE (b): connection removed; D3.1 and D3.2 still served by manuscript illumination and the kufic script. Brief, Try this and summary (en, ar, ur) now name manuscript illumination and the kufic script only. 1 evidence row deleted.
- ca-on-g5-arts-d-3, practice/manuscript-illumination-tazhib, KEEP: unchanged.
- ca-on-g5-arts-d-3, concept/kufic-script, FIX: Ekhtiar named as the source. en: "The earliest dinars ... bear Qur'anic verses ... A dated architectural example is ... Once the new style and the rounded scripts took over, kufic was confined to ornament ..." -> "Maryam Ekhtiar writes that the earliest dinars ... bear Qur'anic verses ..., and that a dated architectural example is ... She adds that once the new style and the rounded scripts took over, kufic was confined to ornament such as sura headings." ar -> "تذكر مريم اختيار أن أقدم الدنانير ... وأن من أمثلته المعمارية ... وتضيف أنه مع ظهور الخط الجديد ... انحصر الكوفي في الزخرفة ..."; ur -> "مریم اختیار لکھتی ہیں کہ سب سے قدیم مؤرخ دینار ... وہ مزید لکھتی ہیں کہ جب نیا اسلوب ... کوفی آرائش تک محدود رہ گیا ...". Evidence claims prefixed "Ekhtiar writes".

Verdicts not applied: none.

Records for the founder (not edited): concept/al-ud tells the origin account of a dead son's body and carries an unattributed court superlative (and the record itself says it "needs a further source"); the secondary lesson ca-on-g12-amu4m-c-1 still links it. concept/islamic-calligraphy still contains the unattributed "most honoured" superlative (Wikidata only).
