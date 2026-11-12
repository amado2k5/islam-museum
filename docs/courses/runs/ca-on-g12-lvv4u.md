# Run log: ca-on-g12-lvv4u (LVV4U, Classical Civilization, Ontario Grade 12)

Start 2026-11-12T06:20Z. End 2026-11-12T06:38Z (times from `date -u`).

## Steps
- 06:20Z `fetch_ontario.py --list` found the course as `LVV4U`; `fetch_ontario.py "LVV4U" ontario-lvv4u` fetched 5 strands, 20 overall, 46 specific expectations. The document is the Ministry's Classical Studies and International Languages curriculum, course title Classical Civilization. `ontario_source.py ontario-lvv4u` printed `source/ontario-curriculum-classical-studies-intl-languages` (existing record, reused).
- Read all 46 expectations. The subject is the Greek and Roman world. The museum holds no record on classical myth, literature, Roman engineering or archaeology; it does hold Arabic-source records on Greek philosophers and scientists, the translation movement, and a few Roman-power and Greek-model records. Lessons therefore use the Arabic reception of Greek learning, with each Brief saying plainly that the class must bring the classical side.
- 06:21Z-06:35Z searches with `find_entity.py` (three or more spellings each; topic words included) and `grep -ril` over content/en; results are recorded in the gap register.
- Gate run and cite-check both clean on the first pass after fixing: a 82-word English connection text (cut to the 80-word limit), a missing Urdu/Arabic translation for E4.1, and one missing gap entry (C4.2) found by the coverage assertion in my generator.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-lvv4u-a-1 | Whose account is it? | A1.3, A2.2 |
| ca-on-g12-lvv4u-c-1 | When does the era begin? | C1.1 |
| ca-on-g12-lvv4u-c-2 | Rome's reach into Arabia | C4.1 |
| ca-on-g12-lvv4u-d-1 | From Socrates to Aristotle | D1.1 |
| ca-on-g12-lvv4u-d-2 | Geometry, the sphere and the heavens | D1.2 |
| ca-on-g12-lvv4u-d-3 | Greek books in Arabic hands | D4.1, D4.2 |
| ca-on-g12-lvv4u-e-1 | What happens to a classical site? | E1.3 |
| ca-on-g12-lvv4u-e-2 | A Greek coin in Arabia | E4.1 |

Strands B (Mythology and Literature) gets no unit: all 8 of its expectations are in the gap register.

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- A1.3, A2.2 / work/usul-uqlidis: weigh sources and their reliability; shows two accounts of one book's origin (Qadi-zada al-Rumi and al-Kindi) as Kashf al-Zunun relays them.
- A1.3, A2.2 / concept/harakat-al-tarjama: same; shows a story the record itself marks as resting on Ibn al-Nadim alone and needing a further source.
- A1.3, A2.2 / person/aflatun: same; shows a source that keeps two figures for Plato's age (eighty-one; eighty in Ishaq's report).
- C1.1 / concept/tarikh-al-iskandar: place key periods in a chronological framework; shows the division of Alexander's realm and the true start of the era named after him.
- C4.1 / polity/byzantine-empire: describe how Roman actions influenced other societies; shows, in one book's account, Roman control of sea routes against Yemen's trade and Roman-made client kings among the Arabs of Syria. The Brief says the Greek side and the rest of the empire are for the class.
- D1.1 / person/suqrat, person/aflatun, person/aristutalis: identify key philosophers and how they influenced their societies; shows the line Socrates, Plato, Aristotle as Ibn al-Nadim gives it, and the commentators on Aristotle.
- D1.2 / person/uqlidis, person/arshimidis, person/batlamus: understand scientific inquiry in the classical world; shows three authors, their books as the sources name them, and the transmission of the Elements.
- D4.1, D4.2 / building/bayt-al-hikma, person/aristutalis, concept/falsafa: describe the influence of classical philosophy and science on later cultures; shows the House of Wisdom, al-Jahiz not always deferring to Aristotle, and Ibn Rushd's work on Aristotle. The Brief says influence on other cultures and on religion is for the class.
- E1.3 / place/athens: explain practical and ethical issues at classical sites; shows one site's reuse and damage (Parthenon as mosque, 1687 bombardment, 1777 wall from ancient remains). Only the damage and reuse side of the expectation is served; the Brief says so.
- E4.1 / concept/pre-islamic-arabian-coinage: describe aspects of classical material culture reflected in other ancient societies; shows Sabaean coins on a Greek model (Athena, owl) and Hellenistic influence on Nabataean coins.

## Judgement calls and record problems noticed (none edited; not mine to edit)
- Each connection text follows the linked record's prose in its own language; every quotation in the evidence file was checked by program to be a substring of the record's prose or summary in that language.
- `work/usul-uqlidis` (from Kashf al-Zunun) gives the carpenter as Apollonius ("ابلونيوس"), while `person/uqlidis` (from the Fihrist) gives Ablinus ("أبلينس"). The lesson uses the first, with its own source, and does not say the two are the same man.
- `person/jalinus` (Galen) merges a Persian commander at the Battle of the Bridge with the Greek physician under one name and says so itself; it was not used for D1.2 (Galen) for that reason.
- `concept/falsafa` and `concept/harakat-al-tarjama` flag themselves as needing a further source; the connection texts repeat that hedge.
- `polity/byzantine-empire` calls the power "the Romans" (as its source, al-Raheeq al-Makhtum, does); the connection says "the Romans".
- Records used as drafts (person/uqlidis, person/arshimidis, person/suqrat, work/usul-uqlidis, building/bayt-al-hikma, concept/falsafa, polity/byzantine-empire) are cited only for sources they already cite.

## Counts
Units 4, lessons 8, connections 16 (14 distinct records), expectations in lessons 10 of 46, in the gap register 36. Of the 36, 11 are skills expectations and 25 name a topic the museum has no record on.

## More lessons possible
- D1.2 could take a fourth card on Hippocrates (person/buqrat, Mas'udi's saying on love) but it concerns love, not medicine or inquiry; not stretched.
- C4.1 could take person/heraclius or the Ghassanid records; not read for this run.
- person/hunayn-ibn-ishaq and person/thabit-ibn-qurra exist (searched, not briefed) and may support a second D4.1 lesson on the translators.

## Proposals (schema cannot say)
- Connection kinds: the closed list has no `work` (a book) or `concept`; `object` was used for Euclid's Elements and for a coin type, `story` for the translation movement, the Seleucid era and the Roman power, `scholar` for Ibn Rushd's entry in a concept record, `place` for the House of Wisdom.
- Expectation texts over 40 words are cut with " …" (A2.2); a link to the Ministry's page for each expectation would restore the rest.
- A lesson cannot say "this expectation is only partly served"; each Brief says it in prose instead.

## Runbook problems that cost time
- zsh does not word-split `$ids`, so `cite-check.ts $ids` fails with a single bad id; list the ids explicitly or use an array.
- The runbook says the gate checks the quotation of overall expectations for units too; there is no explicit instruction to include all overall expectations of a strand (not only mapped ones). I included all four per strand, as the hsc4m pilot does.

## Corrections after the fleet review (sweep: secondary religion and philosophy)

Source: docs/courses-mission/verifier/sweep-secondary-religion-philosophy.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12. No connection of this course links event/change-of-qibla, concept/malaika or passage/quran-3-97 (checked by grep).

- a-1, work/usul-uqlidis and person/aflatun, KEEP: unchanged.
- a-1, concept/harakat-al-tarjama, KEEP with attribution: "The record adds that this picture comes from Ibn al-Nadim alone and needs a further source." -> "This picture comes from Ibn al-Nadim alone, and the museum's record gives no second source for it." (ar and ur likewise; "ويقول السجل" / "ریکارڈ کہتا ہے" removed).
- c-1, concept/tarikh-al-iskandar, KEEP: unchanged (al-Biruni named).
- c-2, polity/byzantine-empire, FIX: en "The Sealed Nectar says Yemen's trade failed as the Romans prevailed ..." -> "In The Sealed Nectar, al-Mubarakpuri calls the Byzantine empire the Romans. He writes that Yemen's trade failed ... He also writes that the Romans made the Dajaima and then the Ghassanids kings over the Arabs of Syria, to restrain the desert Arabs and to serve against the Persians." The closing question now says "Which actions that he ascribes to the Romans ...". The review asked for the phrase "the Eastern Roman (Byzantine) empire"; the museum's record of this polity is labelled "The Byzantine Empire" (ar "الدولة البيزنطية (الروم)") and does not use "Eastern Roman" anywhere, so the card says "the Byzantine empire" and "the Romans" as the record does, with the name attributed to al-Mubarakpuri. ar "يذكر «الرحيق المختوم» كما يعرضه السجل" -> "يكتب صفي الرحمن المباركفوري في «الرحيق المختوم» عن الروم، وهم الدولة البيزنطية في سجل المتحف"; ur "جیسا کہ ریکارڈ اسے پیش کرتا ہے" -> "صفی الرحمن مبارکپوری ... رومیوں کا ذکر کرتے ہیں، جنہیں میوزیم کا ریکارڈ بازنطینی سلطنت کے طور پر درج کرتا ہے". The lesson summary, Brief, section and Try this now say that this is al-Mubarakpuri's account.
- d-1 (Socrates, Plato, Aristotle), KEEP: unchanged (Ibn al-Nadim named in each).
- d-2, person/uqlidis and person/arshimidis, KEEP: unchanged. person/batlamus, FIX: en "Ptolemy is the author of the Almagest and the Geography, in which, the record says, he counted four thousand two hundred cities." -> "... Al-Mas'udi writes that in the Geography he counted four thousand two hundred cities, and mentions him among the first who advanced ..." (ar "وقد عدّ في الأخير" -> "ويذكر المسعودي أنه عدّ في الأخير"; ur "آخر الذکر کتاب میں انہوں نے ... شمار کیا ہے" -> "مسعودی لکھتے ہیں کہ آخر الذکر کتاب میں ..."). The review's remark that the card shows nothing about inquiry beyond titles is left as it is; no sentence was added.
- d-3, building/bayt-al-hikma, KEEP with attribution: the card now opens "Ahmad Amin, in Duha al-Islam, writes that the House of Wisdom was a library in Baghdad ..." and "He adds that its system and exact location remain uncertain" (it had "The source says"); the card does not use "greatest" or "largest". ar and ur likewise.
- d-3, person/aristutalis, KEEP: unchanged (al-Jahiz named). concept/falsafa, FIX: "wrote about fifty books on him" -> "wrote about fifty books" (ar "وصنّف فيه نحو خمسين كتاباً" -> "وأنه صنّف نحو خمسين كتاباً"; ur "اس پر تقریباً پچاس کتابیں" -> "انہوں نے تقریباً پچاس کتابیں"), because the Ibn Rushd record, from the same al-A'lam page, gives about fifty works in all fields. The clause "The record notes that the subject needs a further source to define philosophy and its history" was cut (the record's own gap note, not a fact for the student), with its evidence row.
- e-1 (whole lesson), place/athens, REMOVE (b): the record is an Encyclopaedia of Islam history of the town, with no archaeological investigation. The lesson record and its three prose files were deleted, removed from unit e's lessons list, its evidence rows deleted, and E1.3 added to the gap register (official text copied from the lesson, reason, two searches). Unit e's summary and Brief now say one lesson (E4.1).
- e-2, concept/pre-islamic-arabian-coinage, KEEP with attribution: "The record adds that Nabataean coins were ..." -> "Farajallah Ahmad Yusuf writes that the Sabaeans struck coins ... He adds that Nabataean coins were ..." (ar and ur likewise).

Verdicts not applied: none. One verdict applied with a different wording: the "Eastern Roman" addition on c-2 (reason above).
