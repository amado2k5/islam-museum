# Run log: ca-on-g12-hse4m (HSE4M, Equity and Social Justice: From Theory to Practice, Ontario Grade 12)

Start 2026-11-12T06:23Z. End 2026-11-12T06:35Z (times from `date -u`).

## Steps
- 06:23Z `fetch_ontario.py --list HSE` listed HSE3E and HSE4M; `fetch_ontario.py "HSE4M" ontario-hse4m` fetched 4 strands, 13 overall, 50 specific expectations. `ontario_source.py ontario-hse4m` printed `source/ontario-curriculum-social-sciences-humanities` (existing record, reused).
- Read all 50 expectations. Strand A (15) and D3 (5) are skills. Strand B and C are mostly theory and Canadian content; D1, D2 are personal action and careers.
- Searches (find_entity.py, three or more spellings each) are recorded inside the gap register; topical searches were run once and reused across entries.
- 06:30Z wrote records with a script kept under the scratchpad (YAML dumped by library). Gate at 06:34Z.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-hse4m-b-1 | When belief shapes a view of fairness | B1.4 |
| ca-on-g12-hse4m-b-2 | Written rules and what people make of them | B1.5 |
| ca-on-g12-hse4m-b-3 | Who held power, and who did not | B2.1 |
| ca-on-g12-hse4m-c-1 | A current issue in Canada: Islamophobia | C1.2 |
| ca-on-g12-hse4m-c-2 | A caliph who returned unjustly taken property | C2.2, C2.3 |
| ca-on-g12-hse4m-d-1 | Strategies against a wrong, and how well they worked | D1.4 |
| ca-on-g12-hse4m-d-2 | An old office that watched over markets and the weak | D2.1, D2.2 |

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- B1.4 / equality-in-islam: analyse how belief systems affect views on equity; this record shows one author's reading of equality as a duty of Islam, labelled as his reading.
- B1.4 / zakat: same; shows the jurists' definition of a prescribed giving as the third pillar, with its thresholds.
- B1.5 / constitution-of-medina: analyse how legislation and policy approach equity issues; shows a written pact with named communities and clauses against injustice.
- B1.5 / international-day-to-combat-islamophobia: shows a General Assembly resolution and a follow-up asking for legislative and policy measures.
- B2.1 / bilal-ibn-rabah: analyse power relations in settings such as slave societies; shows one man's account of an owner and an enslaved man and the buyer who freed him.
- B2.1 / riq-fiqh: same; shows the jurists' rules on owner and slave, including the asymmetry in retaliation.
- C1.2 / islamufubiya, international-day: analyse a current issue named in the examples (Islamophobia) with strategies for addressing it; shows a debate on the word and a UN day against it. No Canadian record exists.
- C2.2, C2.3 / umar-ibn-abd-al-aziz: explain how circumstances and qualities made a person an agent of change; analyse issues faced by religious leaders; shows one caliph's acts as one author reports them.
- D1.4 / hilf-al-fudul, invention/waqf: assess strategies used historically; shows a public appeal answered by a pledge that recovered a due, and an endowment institution with what it funded.
- D2.1, D2.2 / muhtasib: describe careers and the training and skills they need; shows a historical office, its duties and the knowledge it required. The Brief says plainly it is not a present-day career.

## Judgement calls
- Hilf al-Fudul was not used for C2.4 (secular movements): a clan pledge is not a secular organisation of the kind named. It carries D1.4 instead (a strategy and its immediate outcome). C2.4 went to the gap register.
- invention/waqf was used rather than concept/waqf: the concept record's English prose lists only learned centres; the invention record states the definition and what was funded in both languages.
- concept/islamufubiya: its audience vote on causes (the "Jewish fingers" option) was left out of the connection; only the question, the 51/49 split and the phobia-versus-phenomenon distinction are restated, all as the panel's.
- concept/riq-fiqh: the English summary says "food, clothing and care" and "torment or disfigure"; the Arabic says nafaqa and kiswa and tamthil (disfigure). Only what both say is written. The record's Arabic prose carries a long run of repeated page citations (pp. 8864 to 8877); the connection cites the source once.
- event/constitution-of-medina: Arabic "النصر والأسوة" against English "support and assistance"; only "support" is written.
- screen/bilal-jil-jadid-2015 (B3.3), concept/islamic-feminism (B1.1), concept/environmental-protection-in-islam (C1.4), concept/adl (D1.1), concept/tatawwu (D2.3) were read and not used; reasons are in the gap register.
- No Qur'an connection written: no linked record cites a verse in a way the lessons need.
- Kinds: Bilal, Medina pact, Umar and the UN day use `story`; zakat, equality, riq, islamufubiya use `reflection`; waqf uses `invention`; muhtasib uses `career`.

## Runbook problems
- None that cost time. The fleet prompt names `quote_official` for `[…]` marks; the Arabic and Urdu keep them, and the gate accepted.
- find_entity.py was run in parallel batches of 12 to 15 background jobs; each took under a minute.

## More lessons possible
- None beyond the seven; the remaining expectations have no honest record.

## Proposals
- Connection kinds: `institution` (waqf, muhtasib) and `treaty` (Medina pact, UN resolution) are missing from the closed list; `invention`, `career` and `story` were used.
- The museum holds no record on Canada beyond two empty place records; a Canadian layer would let C1.1, C1.2, C2.1 and C3.2 be taught.

## Corrections after the fleet review

Source: docs/courses-mission/verifier/fleet-flagged.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hse4m-c-1, MOVE-TO-GAP of one connection (done first): deleted the connection to concept/islamufubiya (a television panel's audience vote, whose record also carries an antisemitic poll result). Removed its two evidence rows. The lesson keeps the UN-day connection (event/international-day-to-combat-islamophobia), so C1.2 stays served. Rewrote the summary (en: "A name for prejudice against Muslims, how people argue about the word, and how the United Nations answered it" -> "A United Nations day set aside to combat Islamophobia, and what a commemoration can do"; ar and ur the same change), the Brief (en: "It offers a debate about the word and a United Nations day against it" -> "It offers one United Nations day against it"; ar "ويقدّم نقاشًا حول الكلمة ويومًا للأمم المتحدة ضدها" -> "ويقدّم يومًا واحدًا للأمم المتحدة ضدها"; ur the same), the section heading and body (now "What can a commemoration do about an issue?" and ar/ur equivalents; the "compare what the panellists say" sentence is gone) and Try this (en no longer links "Islamophobia (the phobia of Islam)"; ar and ur no longer link concept/islamufubiya). No prose file or Brief of the lesson now names or links the record. The record itself (its "Jewish fingers" line) is outside the lesson and is still to be reported to its owners.
- ca-on-g12-hse4m-b-3, KEEP-BUT-FIX: riq card, all three languages: added "The same record lets the owner sell, pledge or give the slave, and sets the hadd for a slave at half a free man's" (ar "وللسيد أن يبيع رقيقه أو يرهنه أو يهبه، ويُحد الرقيق بنصف حد الحر"; ur the same two facts) and replaced the question "Where do these rules protect, and where do they set persons apart?" with "What may one person do to another under these rules, and what is forbidden?" (ar "فماذا يجوز لشخص أن يفعله بآخر في ظل هذه القواعد، وماذا يحرم عليه؟"; ur "ان قواعد کے تحت ایک شخص دوسرے کے ساتھ کیا کر سکتا ہے، اور کیا حرام ہے؟"). The ur card says "اسی ریکارڈ کے مطابق" for the new sentence, as the en says "the same record". The Brief gained, in all three languages, the sentence "The record describes a legal institution as the jurists set it out; the museum does not endorse it. Abolition, the transatlantic slave trade and slavery today are for your class." Added two evidence rows (sale/pledge/gift p.8878; hadd p.8925). The Bilal card is unchanged (the review keeps it). Not changed: the prose section "Who could do what to whom, and who decided?" asks "where do the rules limit the one who holds power, and where do they confirm the difference between persons?"; it is the lesson's method question, not a claim, and I left it.

Verdicts not applied: none.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hse4m-b-2, event/constitution-of-medina, FIX: the book is named and the record's note on the reports added. Old clause -> new clause (en): "The book lists among its clauses:" -> "Al-Raheeq al-Makhtum lists among its clauses:"; added "The record notes that the early reports differ in the order and detail of the clauses." ar: "ويذكر الكتاب" -> "ويذكر «الرحيق المختوم»", plus "ويشير السجل إلى أن الروايات تتفاوت في ترتيب البنود وتفاصيلها."; ur: "کتاب" -> "«الرحیق المختوم»", plus "ریکارڈ بتاتا ہے کہ روایات شقوں کی ترتیب اور تفصیل میں مختلف ہیں۔"

Verdicts not applied: none.
