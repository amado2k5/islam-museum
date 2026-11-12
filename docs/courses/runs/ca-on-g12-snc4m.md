# Run log: ca-on-g12-snc4m (SNC4M, Science, Ontario Grade 12)

Start 2026-11-12T06:08Z. End 2026-11-12T06:33Z (times from `date -u`).

## Steps
- 06:08Z `fetch_ontario.py --list "SNC4M"` found the course; `fetch_ontario.py "SNC4M" ontario-snc4m` fetched 6 strands, 17 overall and 73 specific expectations. `ontario_source.py ontario-snc4m` printed `source/ontario-curriculum-secondary-science` (existing record, reused).
- Read all 73 expectations. Strand A1 (13) is investigation skills; the terminology expectations B2.1, C2.1, D2.1, E2.1, F2.1 (5) are communication skills with no subject matter: 18 skills expectations. Strands B2, C2, D2 and most of E1, E2 and F2 are laboratory or research work the museum cannot hold.
- Searches: the stock `find_entity.py` reloads the 350 MB graph on every call and the machine was heavily loaded (many fleet agents), so the searches were run through a helper under the scratchpad that loads the graph once and calls `find_entity.search` with the same spellings (three or more per topic, English, Arabic, a transliteration or related term). Results are recorded in the gap register.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-snc4m-a-1 | Physicians: training and contributions | A2.1, A2.2 |
| ca-on-g12-snc4m-b-1 | Surgeon's instruments and sutures | B3.3, B3.4 |
| ca-on-g12-snc4m-b-2 | Two remedies: cupping and honey | B1.2 |
| ca-on-g12-snc4m-c-1 | How do we know a drug works? | C2.2 |
| ca-on-g12-snc4m-c-2 | Contagion and the choices of individuals | C1.2, C3.5 |
| ca-on-g12-snc4m-d-1 | What a person eats: illness and the grades of eating | D1.2, D3.3 |
| ca-on-g12-snc4m-e-1 | Epidemics in the histories | E3.2 |
| ca-on-g12-snc4m-e-2 | Protecting the public from plague | E3.5 |
| ca-on-g12-snc4m-e-3 | Pollution as a threat to health | E3.3 |
| ca-on-g12-snc4m-f-1 | Modified foods and cloned plants: who sets the limits? | F1.1, F1.2 |

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- A2.1 / job/physician: describe a career and the education and training it needs; shows how the physician's craft was learned and how licensing by examination arose in the Abbasid period.
- A2.2 / invention/pulmonary-circulation: describe a scientist's contribution to the field; shows what Ibn al-Nafis wrote against Galen's pores in the heart's wall.
- A2.2 / invention/al-razi-smallpox-measles: same; shows al-Razi's comparison of two diseases, with the record's limits.
- B3.3 / zahrawi-dental-scrapers, zahrawi-mishab: explain the function and use of devices for treatment; shows tools described for tooth surfaces and for a urethral stone.
- B3.4 / zahrawi-intestinal-suture: describe a technique for repair; shows animal-intestinal filaments described for joining an internal wound.
- B1.2 / concept/hijama, concept/asal: identify alternative therapies and assess one; shows two therapies in the jurists' encyclopaedia and, plainly, that it reports rulings and measures no effect (the Brief says the assessment is the class's own).
- C2.2 / invention/ibn-sina-seven-drug-assessment-conditions: analyse the effects of treatments on the basis of inquiry; shows a text on what must be known before accepting that a substance caused an improvement.
- C1.2, C3.5 / concept/adwa, concept/al-taun: evaluate individual choices on disease control and describe non-medical protection; shows scholars' views on contagion and the instruction not to enter or leave a plague land.
- D1.2, D3.3 / concept/hamiyya-diet, concept/akl: evaluate how factors such as disease affect eating and how needs vary; shows keeping the sick from harmful food and grades of eating by need.
- E3.2 / event/plague-of-amwas, ibn-khaldun-parents-die-black-death-1349, smallpox-epidemic-423: explain how pandemics affected humanity; shows three epidemics as the sources report them (the Black Death in Tunis in 1349 matches the expectation's own 1347 to 1352 example).
- E3.5 / passage/muwatta-31-2611, concept/al-waba, invention/walid-bimaristan: describe public health measures; shows a caliph turning back from a stricken land, the saying on entering and leaving, and lepers confined in a hospital.
- E3.3 / concept/environmental-protection-in-islam: explain threats including environmental factors; shows one author's account of water, air and soil pollution as a threat (attributed to him).
- F1.1, F1.2 / work/fatwa-iifa-266-genetically-modified-animal-foods, work/fatwa-aliftaa-jo-plant-cloning: analyse social, ethical and legal issues of an application of biotechnology; shows two rulings on modified animal foods and cloned plant cells.

## Judgement calls
- Strands: all six have a unit. F2 and F3 have no lesson (everything in them went to the gap register).
- concept/al-tibb-al-nabawi-wal-badil (B1.2) NOT used: it is a draft summary of a television panel's debate with audience polls; restating it as findings about alternative medicine would not be honest (the same call as the HSC4M run made for similar panel records).
- group/islamic-relief (C3.6) NOT used: it does not describe disease control, and its record centres on allegations by governments. concept/al-tadkhin (E1.2, E2.4) NOT used: one preacher's exhortation, not a government initiative or a media report.
- work/fatwa-aliftaa-jo-forging-a-covid-vaccination-certificate (E3.5) NOT used: a ruling on honesty about certificates; restating it as a public health measure would stretch it.
- invention/ibn-baytar-comparative-materia-medica and work/al-mufradat-ibn-baytar read but not linked: nothing in them answers an expectation of this course.
- event/umari-jerusalem-plague-748 read and dropped in favour of the Black Death record (one lesson, three connections at most).
- Two records disagree between their languages and the connection follows only what both say: concept/adwa (English: "entering a land of plague is forbidden"; Arabic: leaving or entering is forbidden by the text) so only entering is stated; invention/pulmonary-circulation (English "thirteenth century"; Arabic "seventh century AH") so the Arabic and Urdu say the seventh century AH and the English the thirteenth, each following its own record.
- walid-bimaristan: the record's own hedge "first, disputed" is kept; no superlative is added.
- `kind` choices: records of physician, scholar-made things and methods are `career` / `invention`; juristic and conceptual records are `reflection`; epidemic events are `story`; the Muwatta passage is `hadith`; the fatwas are `reflection`.
- No Qur'an connection written: no linked record cites a verse in a way a lesson needs.

## Counts
Units 6 (A to F), lessons 10, connections 22 (22 distinct records), expectations in lessons 15 of 73, in the gap register 58 (18 skills expectations without subject matter, 40 with searches).

## Problems with the runbook
- `find_entity.py` loads the whole graph per call and took minutes per call under load; batching the queries in one process through `find_entity.search` is far faster (suggest a `--batch` option taking a file of query lines).
- `cite-check.ts` takes one id at a time (as earlier runs noted); ran it once per record, 17 records.
- Unit `expectations` need translated overall (strand level) expectations, which the runbook mentions only in passing; 17 translations were written.

## Proposals
- Connection kinds: no `concept`, `fatwa`/`ruling`, `institution` or `epidemic`; fatwas and juristic concepts went to `reflection`, epidemics to `story`, a hospital to `invention`.
- A `skills` flag for expectations that name no subject matter, so they need not each carry a placeholder search.
- A link from each expectation to the authority's page, so texts cut at 40 words can point to the full wording.
- Several of the linked concept records (hijama, asal, adwa, al-taun, al-waba, hamiyya, akl) are `draft` in the graph; the lessons cite only sources those records already cite, but a reviewer should promote or revise them before the lessons are published.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/fleet-flagged.md. Lesson ca-on-g12-snc4m-f-1 was KEEP and is unchanged. All four verdicts below were KEEP-BUT-FIX and were applied in en, ar and ur.

- **b-2 (cupping and honey).** Cupping card: "Jurists regard cupping as recommended for treatment" became "Jurists classify cupping as a recommended (mustahabb) act of treatment, in the legal sense of a rewarded act ... a legal classification, not a medical recommendation" (ar: "ويصنّف الفقهاء التداوي بها مندوبًا، أي فعلًا مثابًا عليه ... تصنيف فقهي لا توصية طبية"; ur: "مستحب، یعنی ثواب والا عمل ... فقہی درجہ بندی ہے، طبی سفارش نہیں"). Honey card: "In the lexicon, asal is ..." became "The jurists' encyclopaedia reports that, in the lexicon's wording, asal is ...", and "Using honey as medicine is permitted, and most scholars read..." became "It reports that using honey as medicine is permitted, and that most scholars read..." (ar "تنقل الموسوعة ... بحسب عبارة المعجم"; ur "موسوعہ نقل کرتا ہے"). Brief gained the no-medical-advice sentence in all three languages. The reviewer's fix 4 (disputes on wudu' and the fast) is not added: the card stays partial and says so by reporting only the classification.
- **c-2 (contagion).** Contagion card: opens with "In the jurists' theology of causation, most scholars hold ..." (ar "في عقيدة الفقهاء في السببية"; ur "فقہا کے نظریۂ اسباب میں"). Plague card: "Whoever hears of it ... does not flee" became "It gives a saying reported in the Sahih collections of al-Bukhari and Muslim: whoever hears of it ..." (ar "ويورد السجل توجيهًا مرويًّا في صحيحي البخاري ومسلم"; ur "ریکارڈ ایک ارشاد دیتا ہے جو صحیح بخاری اور صحیح مسلم میں روایت ہوا ہے"). Brief gained "These are scholars' views on causation, not an account of how infection spreads; medical explanations come from your class's sources." The martyr's-wage clause stays omitted.
- **e-2 (public protection).** Deleted "The record describes this as a divinely-wise quarantine before the science of contagion" from the al-waba card in all three languages, and its evidence row. Brief: "three records on plague" became "two records on plague and one on a hospital and the confinement of lepers". Lesson title and summary: "plague" became "epidemic disease" (ar "الأوبئة", ur "وبائی امراض"). Leper card gained "Al-Maqrizi reports the confinement; the museum does not assess it" (ar "ينقل المقريزي الحبس ولا يقيّمه المتحف"; ur "المقریزی روکے رکھنے کو نقل کرتے ہیں؛ میوزیم اس کا جائزہ نہیں لیتا").
- **d-1 (illness and eating).** Hamiyya card: the unattributed "Diet must follow the principles of medicine and sound experience" became "The encyclopaedia adds that the diet is to follow ..." (ar "وتضيف الموسوعة"; ur "موسوعہ مزید کہتا ہے"), followed in all three by the line that these are historical reports and a legal ruling about treatment, not dietary or medical advice, and that someone who is ill should follow a doctor's advice. English "barley and soup" became "barley and chard (silq)"; Urdu "جو اور چقندر" became "جو اور سلق، یعنی چقندر کے خاندان کا ساگ". Akl card gained "These grades are the encyclopaedia's legal classification, not dietary advice" (ar, ur the same). Brief gained the not-advice sentence.
- **Record defect, not fixed here.** concept/hamiyya-diet English says "barley and soup" while its Arabic says السلق (silq); the card follows the Arabic. The record's English should be corrected by its owner.
- **Judged and not applied:** none. The "rewarded act" gloss in b-2 is the reviewer's definition of the legal term, not a sentence of the record; it is applied as asked and flagged in the evidence table.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/sweep-secondary-sciences.md. Gate GREEN, cite-check 16 pass, 0 fail.
- snc4m-e-3 (concept/environmental-protection-in-islam), REMOVE, whole lesson (its only connection): lesson record and its three prose files deleted; removed from the unit's `lessons:` list; expectation E3.3 added to the gap register (text copied from the lesson's English expectation; why: the only record is one modern author's reading that pollution threatens safety, with no health effect, disease or exposure; two searches recorded); its evidence section deleted. Consequential counts corrected: the unit summary (en, ar, ur: "three lessons" → "two", the pollution clause removed), the unit Brief ("3 lessons" → "2"), the subject Brief ("10 lessons" → "9") in en, ar, ur.
- Other lessons: KEEP, unchanged. The review's note on snc4m-e-1 (add the succession dispute of Amwas) is a comment on a KEEP verdict and was not applied, as instructed ("do not add any sentence the review does not ask for").
- Not applied: none.

### Records for the founder
- concept/environmental-protection-in-islam is thin (three sentences, one modern author's reading) and cannot serve a science expectation; it is also unused now by snc4m and svn3m.
- event/plague-of-amwas carries a lecture-sourced paragraph marked needs_source (noted by the review).
