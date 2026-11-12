# Run log: ca-on-g4-social-studies

Started: 2026-11-12T05:32:30Z (date -u)
Agent: Claude Code; claude-sonnet-5-5

## Step 0 (05:33Z, real)
- git fetch ok; git status not clean: two untracked files (PIPELINE.md, an oracle output) belonging to the other process. Runbook says "a clean worktree"; conservative reading: continue, touch nothing of theirs.
- .cache/graph.json already existed; running npm run graph anyway as the runbook says.
- `npm run graph` took over the 120 s foreground tool timeout (runbook says "about one minute"); it was backgrounded and finished OK. Runbook gives no hint that it can exceed 2 min.
- Read pilot records (subject, unit, grade, jurisdiction, lesson, AR prose). Noted: pilot records carry `ur`; I omit it per rule 6. Pilot lesson expectation texts are not the authority's (known fault).

## Step 1 (05:38Z)
- `fetch_ontario.py --list "Grade 4"` ok; exact name "SSHG - Grade 4". Fetch ok (manifest docs/courses/curricula/ontario-sshg-2023-g4.json).
- Only a DeprecationWarning (datetime.utcnow) printed; harmless. Result: strand A (3 overall, 20 specific), strand B (3 overall, 16 specific) = 36 specific expectations. All have codes.

## Step 2
- data/source/ontario-curriculum-sshg-2023.yaml exists for exactly this document family (Social Studies 1-6, History and Geography 7-8, 2023, URL .../elementary-sshg). Use it, not edited.
- Runbook gap: that source's reliability_note says "the museum quotes nothing from it and writes its expectations in its own words", which contradicts the runbook's stored quote_official text. Runbook says use existing and don't edit; following it.
- (time note) my first sed -i (BSD sed on macOS, needs '') failed with 'extra characters at the end of d command'; log timestamp left; harmless.

## Step 4 (approx 05:37Z) search phase
- zsh gotcha (mine): `echo ====` in zsh errors "= not found" (EQUALS expansion) and aborted my loop; not a runbook issue.
- entity_brief.py prints whole prose (invention/baghdad-papermaking is ~12k words); runbook doesn't warn; I wrote a tiny wrapper in the scratchpad to print summary+sources only.
- 05:39Z search phase done. Key finds: the museum has NO record on First Nations, Inuit, Canadian geography or industry; place/canada, toronto, ottawa, ontario exist but have no prose (unusable). Every one of the 36 expectations A1-A3 names "at least one First Nation and one Inuit society", which no lesson can honestly satisfy. Judgement: still link lessons only to the Islamic-civilisation records for the other societies the expectations allow ("a few early societies", e.g. "religious rights in medieval Islam" is named in A3.10's own examples); each lesson prose states the museum covers one society only and the teacher's class must add the First Nation and Inuit ones. Runbook doesn't address expectations that REQUIRE a specific society the graph lacks.
- Considered and rejected: concept/hima and concept/environmental-protection-in-islam for B1.3 (hima is a reserved pasture, the other is one author's reading; neither records actions by industry/citizens); concept/gold-leaf-glass-tesserae for A3.2 (record is about gold purity, not daily life); invention/tabula-rogeriana for A2.3/A3.1 (not a thematic map of environment); place/canada etc. (no prose); concept/iqta for A3.8 feudal (about land grants only).
- Plan (lessons are single strand A; strand B wholly to the gap register, so no unit B):
  | slug | title | expectations |
  |---|---|---|
  | ca-on-g4-ss-a-1 | Living together: agreements between groups | A3.9, A3.10 |
  | ca-on-g4-ss-a-2 | Who kept the market honest and the sick cared for? | A3.7, A3.8 |
  | ca-on-g4-ss-a-3 | Measuring floods, making paper, gathering books | A3.4, A3.6 |
- Judgement call: A3.7 (how a society was governed) linked to invention/hisba because the record itself, citing Ibn Khaldun, places the office under the caliphate; modest link, flagged for the reviewer.
- Judgement call: A3.4 (river floods and food production) linked to the Nilometer: the record says readings set irrigation policy; it says nothing about food or crops, so my text says only "irrigation policy".
- Runbook tension: "group two to four expectations" is met (2 each).
- 30 expectations go to the gap register (A1.1-4, A2.1-6, A3.1-3, A3.5, B1.1-3, B2.1-6, B3.1-7); 6 in lessons. 30+6=36.
- Links (sentence "The expectation asks the student to ___; this record shows ___"):
  - a-1 Constitution of Medina: asks to describe attempts to deal with conflict and build cooperation (A3.10 names "religious rights in medieval Islam"); the record shows a treaty making the believers one community and leaving the Jews of Medina freedom in religion and property (mubarakpuri p.187, 192-193).
  - a-1 Umar's covenant: asks for reasons groups cooperated and attempts to settle conflict; the record shows a quoted covenant of safety for persons, property, churches, no compulsion in religion, jizya on them.
  - a-2 hisba: asks how a society was governed; record shows an appointed official watching markets, placed by Ibn Khaldun under the caliphate.
  - a-2 muhtasib: asks for roles of work-related groups; record shows the market official and named early overseers.
  - a-2 bimaristan Adudi: asks for roles of work-related groups (healers); record shows physicians, stewards and servants of a hospital.
  - a-3 Nilometer: asks how natural events (river floods) affected a society; record shows a gauge built to measure the annual flood whose readings set irrigation policy.
  - a-3 papermaking: asks to describe a technological development; record shows paper explained and its transfer to Baghdad.
  - a-3 House of Wisdom: asks to describe developments of the medieval world; record shows a library and translation effort.

- Log hygiene: I first wrote some step times from memory (05:38/05:45/06:00Z) that were later than the real clock (`date -u` said 05:39Z at the end of step 4). Corrected above; times from here on come from `date -u`.

## Steps 5-6 (05:38-05:41Z)
- Wrote records with a generator script (kept in the scratchpad, not committed) so that expectation texts come from quote_official byte for byte. Created: course/ca-on-g4 (grade), ca-on-g4-social-studies (subject), ca-on-g4-ss-a (unit), ca-on-g4-ss-a-1..3 (lessons); prose AR+EN for each (12 files); gap register (30); evidence file (21 rows). No Urdu.
- Runbook gap: it never says whether `ar` values for expectations containing "(حتى عام 1500)" etc. need the U+2066/2069 isolates; I applied them by regex to every Arabic string (rule 7 says so for parentheticals with Arabic).
- Runbook gap: no guidance on the Arabic rendering of `…` cut markers and `[…]` beyond "keep where they stand"; I kept them at the end / same place.
- Runbook gap: nothing on what to do when the expectations REQUIRE societies the graph lacks (here: First Nation and Inuit in 30+ expectations). I kept lesson Briefs explicit that the museum covers only the Islamic-world example and the class adds the others. Reviewer may disagree that these 6 lessons can honestly satisfy "at least one First Nation and one Inuit society"; the alternative is to put everything in the gap register.
- Judgement: the grade, subject and unit records carry a one-sentence Brief; unit Brief names lesson topics (no facts).
- Judgement: used `kind: invention` for invention/hisba and baghdad-papermaking, `career` for job/muhtasib, `place` for buildings, `story` for both events. No proposal needed except: there is no kind for a treaty/covenant document (used story).

## Step 7 (05:41Z)
- First gate run (before the second npm run graph) was already GREEN (22 checks). Runbook step 7 says to pass `--save`, which writes into docs/courses-mission/oracle-output/; my task limits forbade touching docs/courses-mission, so I did NOT pass --save. Runbook problem: a pipeline run is told to write into the mission's own folder, and --save of a different course would mix outputs.

## Step 8 (05:44-05:46Z)
- Second `npm run graph` also exceeded the foreground limit (ran in background, ~2 min).
- `npm run validate` final line: `validated 57196 entities, 87357 prose files: 16 errors, 4377 warnings`. Gate text "0 errors" NOT printed. All 16 errors are in files I did not touch: 10 data/concept/*.yaml (/provenance/layer value not allowed: abwab-al-jannah, azwaj-mutahhara, bab-al-rayyan, dar-al-salam, darajat-al-jannah, firdaws, ghuraf-al-jannah, jannat-al-mawa, shajarat-tuba, turab-al-jannah) and 6 for content/{ar,en,ur}/concept/hudud-allah-wal-kabair.md (frontmatter id/lang "undefined"). None mention ca-on-g4. Per step 8, recorded and went on. Runbook problem: gate 2 ("prints 0 errors") cannot be met on this worktree; the exception in step 8 is in a different place from the gate definition.
- `npx tsx scripts/cite-check.ts` on the 6 records: `cite-check: 6 pass, 0 fail of 6 record(s) ...`. Note: `timeout` is not on macOS; ignore.
- Gate 1 final: `RESULT: GREEN (22 checks passed)`.
- Not done (limits): step 9 and `--save`; scoped_build page check not run (optional in the runbook).

## Runbook problems, most costly first
1. No rule for expectations that REQUIRE societies the graph lacks (First Nation/Inuit in every A expectation); biggest judgement, no time-box.
2. entity_brief.py dumps whole prose (12k words for one record); needed a wrapper to read summaries and sources only.
3. `npm run graph` takes about 2 minutes, not "about one minute"; exceeds default tool timeout, twice.
4. Gate 2 as defined (0 errors) fails on pre-existing errors; exception only in step 8.
5. `--save` in step 7 writes into docs/courses-mission/, conflicting with a no-touch limit; also clean-worktree wording in step 0 vs untracked files of other processes.
6. Existing source record's reliability_note says the museum "quotes nothing", while the runbook stores quote_official text.
7. No mention of how to treat Arabic isolates in expectation translations, or Arabic for `…`.
8. fetch_ontario.py prints a datetime.utcnow DeprecationWarning (harmless).
9. Kind list lacks treaty/covenant document, office/official (used story, invention, career).

Finished: see final report time.

## Second pass (brings the course up to the current runbook)

Started: 2026-11-12T05:55Z (date -u). Agent: Claude Code; claude-sonnet-5-5. Helper scripts are in the session scratchpad, not in the repository.

### Urdu (rule 6)
- 05:55-06:00Z. Added `ur` to every label, summary, subject_name, expectation text, connection title and connection text of the six records (38 values), by inserting one line after each `ar:` line; Arabic, English, ids and connections untouched. Wrote `content/ur/course/` for the six records.
- Judgement: expectation texts that the English cuts with ` …` end with ` …` in Urdu too (runbook step 5). The first-pass Arabic of A1 is not cut at the same place; I left the Arabic alone as told.
- Judgement: Urdu is itself Arabic script, so I wrapped Urdu parentheticals in U+2066 … U+2069 as for Arabic (the pilot's Urdu does the same). Where a parenthesis was avoidable I avoided it.
- Judgement: "First Nation" is rendered by transliteration (فرسٹ نیشن) and "Inuit" as اِنوئٹ in Urdu, as the first-pass Arabic uses الأمم الأولى and الإنويت.
- The unit's Arabic and English Brief said "three lessons" and would now be false; I replaced that one sentence with the eight-lesson list (the only edit to existing ar/en prose; no data field of Arabic or English was changed).

### Re-examining the 14 expectations (new runbook rule "When an expectation asks for more than the museum holds")
Searches run (find_entity.py, three or more spellings each, then the briefs of the candidates; the brief wrapper is mine): "social classes / طبقات / tabaqat / society"; "women / المرأة / status of women"; "slave / رقيق / mamluk"; "children / أطفال / childhood / kuttab"; "food / طعام / cuisine / diet"; "dress / لباس / clothing / textile"; "house / مسكن / housing / courtyard house"; "kuttab / كتاب / school / madrasa"; "daily life / الحياة اليومية / market / souk"; "water / ماء / irrigation / qanat"; "agriculture / زراعة / farming"; "map / خريطة / atlas / world map"; "Tabula Rogeriana / الإدريسي / Idrisi map / نزهة المشتاق"; "mosaic / فسيفساء / Great Mosque of Damascus"; "pottery / فخار / ceramic / lustre"; "astrolabe / أسطرلاب / instrument / compass"; "frieze / منمنمات / miniature"; "climate / مناخ / desert / oasis"; "trade route / طريق التجارة / caravan / silk road"; "nomad / بدو / Bedouin / tent". Stubs seen and not linked: concept/umm-walad, concept/sayiba, concept/taam, group/kuttab-al-rum. Records read in full: unglazed-earthenware, sabil, sabil-kuttab, sabil-kuttab of Qaytbay, istirda-al-badiya, hima, agriculture-in-islam, qus-to-aydhab journey, medina-society-at-hijra, al-ziyy-al-andalusi, tabula-rogeriana.

New plan (an expectation in one lesson only):

| slug | working title | expectations |
|---|---|---|
| ca-on-g4-ss-a-4 | Clay jars and public fountains | A3.2, A3.3 |
| ca-on-g4-ss-a-5 | Who belonged to which group? | A1.1, A1.2 |
| ca-on-g4-ss-a-6 | Where did children grow up and learn? | A1.3 |
| ca-on-g4-ss-a-7 | Land, water and the way people lived | A1.4, A3.5 |
| ca-on-g4-ss-a-8 | Where in the world? A medieval map | A3.1 |

Links, with the sentence "The expectation asks the student to ___; this record shows ___":
- a-4 unglazed-earthenware: asks to take information on daily life from visual evidence; the record is Wilkinson's reading of excavated Nishapur earthenware as evidence of daily life neither described in literature nor pictured, with water jars and pitchers.
- a-4 sabil: asks to describe aspects of daily life; the record shows a charitable building endowed to give people fresh water daily and where it drew its water.
- a-5 medina-society-at-hijra: asks to compare social organisation; the record shows the three groups and the Ansar/Muhajirun split with the refugees' pressure on the economy. I deliberately left out the book's remarks on the Jews (the record itself flags them as the author's view).
- a-5 al-ziyy-al-andalusi: asks to compare aspects of daily life of different groups and relate differences to social organisation; the record shows dress marking judges and jurists, elders, scholars, and Jews.
- a-6 istirda-al-badiya: asks to compare one's own life with young people from different backgrounds (urban, rural); the record shows town infants raised among the desert people.
- a-6 sabil-kuttab: same; the record shows a Qur'an school for children above a public fountain.
- a-7 hima: asks to compare relationship with the environment (use of land and resources); the record shows reserved grazing land.
- a-7 agriculture-in-islam: same; the record shows farming, dead land and water as presented by al-Maraghi.
- a-7 qus-to-aydhab: asks how the local environment affected how people met their physical needs (water); the record shows water points on a desert road deadly through thirst. Modest link, flagged for the reviewer.
- a-8 tabula-rogeriana: asks to locate societies on maps and take information from them; the record shows a medieval world map with lands, rivers and roads. It is a map of its maker's world, and the Brief says so.

Judgement calls:
- Each Brief says plainly what the museum offers and that the class must bring the First Nation and Inuit societies (and, in a-7, the comparison with present-day Canada). I did not treat any lesson as satisfying the expectation whole.
- a-6 and a-8 teach one expectation each (runbook step 3 says two to four): the remaining expectations that would fit (A3.3 education, A2.3 maps) are either already in a-4 or are skills, and forcing a pairing would have stretched the links.
- Skills expectations A2.1-A2.6 stay in the register. A2.3 (maps) and A2.4 (analysing artefacts) came closest: the Idrisi map and the Nishapur earthenware serve A3.1 and A3.2 as subject matter, but A2.3 and A2.4 ask for the skill of analysing and constructing thematic maps and of using tools on First Nation and Inuit evidence, which no record teaches. I appended the better searches and the reason to each of the six entries.
- Considered and not used: concept/medina-society-at-hijra for A3.8 (already served by a-2); place/mamluk-sultanate-of-egypt, group/badw, place/al-ahsa-oasis (no prose); object/qita-tiraz-9, object/sharit-balat-1215, object/lawh-khayma (catalogue lines with no prose, nothing to write from); concept/albisa, libas-woman-fiqh, kiswa (fiqh rulings, not daily life); concept/childhood-sighar and tadib-al-awlad (fiqh); concept/al-qiyan (not read in full, not needed); work/filaha-nabatiyya (magic and talismans); concept/gold-leaf-glass-tesserae (gold purity, as in the first pass); concept/sabil as a place for a-6 (used a-4).
- Kinds (closed list): unglazed earthenware as `object`, al-ziyy as `object`, agriculture-in-islam as `reflection` (an author's presentation), hima, sabil, sabil-kuttab, qus-to-aydhab as `place`, istirda and the Medina society as `story`, the Idrisi map as `invention`.
- Moved out of the register: A1.1, A1.2, A1.3, A1.4, A3.1, A3.2, A3.3, A3.5 (8). Left: A2.1-A2.6 (6) and all of strand B (16) = 22.

### Written
- Lessons a-4 to a-8 with 10 connections and prose in ar, en and ur (15 files), the unit's lesson list and Brief, 30 new evidence rows, the shortened register.
- Connection texts keep to what each record says; closing questions are mine and state no fact. Arabic written first, then English, then Urdu.

### Gates (06:05Z)
- `check_course.py course/ca-on-g4-social-studies ... --strict --save`: `RESULT: GREEN (23 checks passed)`; output saved to docs/courses/gates/check-ca-on-g4-social-studies.out.
- `npx tsx scripts/cite-check.ts` over the 11 record ids: `cite-check: 11 pass, 0 fail of 11 record(s)`.
- Not run, as instructed: npm run graph, validate, build, step 9.

### Counts
| | before | after |
|---|---|---|
| lessons | 3 | 8 |
| connections | 8 | 18 |
| specific expectations in lessons | 6 | 14 |
| specific expectations in the register | 30 | 22 |

### Runbook problems found in this pass
1. Rule 7 and step 5 speak of "Arabic script" parentheticals but do not say that Urdu text, being in Arabic script, needs the same isolates; I assumed yes (the pilot does it).
2. Step 6 says unit/grade prose is "one Brief"; when lessons are added later the unit's Brief that names its lessons goes stale. The runbook should say a unit Brief names no count of lessons.
3. The ` …` cut marker: step 5 says it ends the text in every language, but the first-pass Arabic of A1 completes the sentence; the checker does not compare, so the two differ unnoticed.
4. entity_brief.py prints no short mode; for a record with no prose (object/qita-tiraz-9) it is useful, for a long one the wrapper was needed again.
5. Step 4's "group two to four expectations" cannot be met when only one expectation has an honest link (a-6, a-8); the runbook should allow one.

## Corrections after the enrichment verifier

Source: docs/courses-mission/verifier/proof-enrichment.md. Texts corrected in en, ar and ur in data/course/ca-on-g4-ss-a-1, -2 and -3; each language now restates its own record. Where a record's languages disagree, only what both say is written (a), or each language follows its own record and the drift is logged (b).

1. 1.2 "The record quotes, from al-Tabari" (STRETCHED). en: "The record quotes, from al-Tabari, the covenant Umar ibn al-Khattab gave" -> "The deed of safe-conduct Umar ibn al-Khattab wrote ..., as the source quotes it from al-Tabari" (the record's own words). ar: "ينقل السجل عن الطبري العهدة التي كتبها" -> "وثيقة الأمان التي كتبها ... ينقلها المصدر عن الطبري". ur: "ریکارڈ طبری سے ... نقل کرتا ہے" -> "جیسا کہ مصنف طبری سے نقل کرتا ہے" (the Urdu record's word).
2. 1.2 surrender/peace verb. en "when they surrendered the city", ar "عند صلحه معهم", ur "شہر کے حوالے کرتے وقت": the records differ (EN "at their surrender", AR "عند صلحه", UR "صلح پر"), so the circumstance is dropped in all three; each says only that he wrote the deed for the people of Iliya (rule a).
3. 1.2 churches clause. en "no church taken or destroyed" (from the EN data summary), ar "لا تُسكن ولا تُهدم", ur "نہ آباد کیے جائیں نہ مسمار": all three now say churches neither settled nor demolished (what the EN prose, AR and UR prose all say). en "safety" -> "security"; "no Jew to live" -> "no Jew to dwell with them".
4. 1.2 date. ar "ويضعها الكتاب في سنة 15هـ" -> "ويذكر الكتاب أنها كُتبت سنة 15هـ" (the AR record's wording); ur likewise "کتاب بتاتی ہے کہ یہ سن 15ھ میں لکھا گیا" (was "15 ہجری"). en keeps "The book places it in 15 AH". Urdu "جزیرہ" typo is in the Urdu record, not copied.
5. 2.1 officer's duties (STRETCHED, en and ar). en "looks into ... blocked streets and buildings about to fall" -> "looks into fraud in measures, weights and foodstuffs, keeps the streets from being blocked, orders buildings about to collapse to be pulled down". ar "وفي الشوارع المسدودة والأبنية الآيلة" -> "ويمنع تضييق الطرق، ويأمر بهدم الأبنية الآيلة للسقوط". ur likewise "راستوں کو تنگ ہونے سے روکتا ہے، گرنے والی عمارتوں کو گرانے کا حکم دیتا ہے".
6. 2.1 "السلطان" (STRETCHED). ar "السلطان يولّي" -> "الحسبة ولاية يعيّن فيها الحاكم"; ur "سلطان" -> "حکمران". 
7. 2.1 punishment clause in one language only. All three now say he punishes in proportion to the offence (en "punishes in proportion to the offence" added; ar "ويؤدّب على قدر المخالفة" was "ويعاقب بحسب الذنب"; ur "جرم کے مطابق سزا دیتا ہے"). ar "المأكولات" -> "الأقوات" (the record's word). The closing sentence on the religious offices (p. 216) was cut in the Arabic and English to stay within 80 words and that claim is no longer in the text; en and ar do not carry it, ur does not either.
8. 3.1 Arabic/Urdu. ar year "سنة 862" -> "سنة 862م"; "ويقسّم عمودها" (no subject) -> "والعمود مقسوم"; "ييومانز" -> "يومانز"; "حفرة" -> "بئر" (the AR record's term; ur uses "کنواں", the UR record's term; en keeps "pit", the EN record's term). ar "قياس النيل" -> "قياس ارتفاع ماء النيل أيام الفيضان السنوي"; ar "أساسية في وضع" -> "أساسًا في تقدير" (the AR record: "أساساً في تقدير سياسة الري"; the EN/UR records say "setting"/"طے کرنے", each kept). ur "ریڈنگز" -> "پیمائشیں"; "گڑھا" -> "کنواں".
9. 3.2 Bloom and Ersoy (STRETCHED, en and ar). The record's hedge is restored in all three languages: "without independently confirming that year or proposer" (ar "دون أن يثبت مستقلًا هذا العام أو اسم صاحب الاقتراح"; ur "اس سال یا تجویز کنندہ کے نام کی الگ تصدیق نہیں دیتے"). en "credits ... with proposing" -> "attributes the proposal"; ar "يرى جوناثان بلوم أن الصناعة قامت" -> "يؤيد جوناثان بلوم وجود الصناعة" (the record's "يؤيد"); ur "سہرا باندھتے" -> "منسوب کرتے".
10. 3.2 paper definition. ar "حصيرة ... غربال" -> "شبكة من ألياف السليلوز ... سطح شبكي" (the AR record's words); ur "چٹائی ... چھلنی" -> "تہ ... جالی" (the UR record's words); en keeps "mat ... screen" (EN record).
11. 3.3 "أعظم" (STRETCHED, ar). ar "أعظم مكتبة يبلغنا خبرها" -> "أكبر مكتبة نُقل خبرها"; ur "سب سے عظیم" -> "سب سے بڑا" (the UR record). en keeps "greatest" (the EN record). Judged not to merge: the EN record says "greatest" while the AR and UR records say "largest"; per the runbook each language follows its own record, and the record drift is for the owner of building/bayt-al-hikma to settle.
12. 3.3 "أساس" vs "نواة". ar "وضع أساسها ... نمّاها" -> "وضع نواتها ... نمّاها وقوّاها" (AR record). en "laid its foundation" and ur "بنیاد رکھی" kept (EN and UR records). Same record drift as 11.
13. Evidence table rows. Row 3 and its claim now say "as the source quotes it from al-Tabari"; row 4 claim now reads "churches neither settled nor demolished" to match its quotation; row 7 (hisba) quotes the record's full sentence with no ellipsis-built paraphrase; row 10 (muhtasib) quotes the two sentences it draws on and states that "Mecca and Medina" is the first sentence's framing; row 19 (papermaking) quotes Ersoy and Bloom verbatim, hedge included; row 22 notes the EN/AR/UR superlative drift. Rows kept English-only.

Not corrected, and why: the verifier's note that the muhtasib text (2.2) joins "of the markets of Mecca and Medina" to the five names. The text was marked SUPPORTED by the verifier, and the record's first sentence does frame the appointments in Mecca and Medina, so only the evidence row was made exact. The closing sentence on the religious offices in 2.1 was dropped from all three texts for length, which is a cut, not a correction. Findings not raised by the verifier were not touched.

Gates after the corrections: check_course RESULT: GREEN (23 checks passed); cite-check: 3 pass, 0 fail of 3 record(s).

## Corrections after the fleet review

Source: `docs/courses-mission/verifier/sweep-social-studies.md` (Grade 4, lessons ca-on-g4-ss-a-1 to a-8). Applied in all three languages. No connection was added. Gate and cite-check re-run after the changes (see the end of this section).

- a-1 `event/constitution-of-medina` (FIX): the first sentence is now "In Ibn Hisham's account, as the museum's record summarises it, the Prophet concluded a treaty ..." and the second "The Sealed Nectar adds that he agreed with the Jews a treaty ..." (was: "The record adds"); ar: "في رواية ابن هشام، كما يلخصها سجل المتحف" and "ويضيف الرحيق المختوم"; ur: "ابن ہشام کے بیان کے مطابق ..." and "الرحیق المختوم مزید بتاتی ہے".
- a-1 `event/umar-covenant-jerusalem` (FIX): added the circumstance, each language following its own record: en "when the city surrendered" (the English record: "at their surrender"); ar "عند صلحه معهم" (the Arabic record's words); ur "ان کے صلح کرنے پر" (follows the Arabic). The "no Jew to dwell with them" clause stays, attributed as before ("as the source quotes it from al-Tabari"). The lesson Brief (all three languages) now tells the teacher that one clause keeps Jews from living in the city and that the card should be read before it is assigned.
- a-2 `invention/hisba`, `job/muhtasib` (KEEP): unchanged.
- a-2 `building/bimaristan-adudi` (FIX): closing question "Which groups of workers did such a hospital need?" -> "Who worked in a hospital like this?" (ar: من كان يعمل في مستشفى كهذا؟; ur: ایسے ہسپتال میں کون کام کرتا تھا؟); the Brief says the record lists who worked there but says nothing of their roles or status, which the class supplies.
- a-3 `building/nilometer-of-rawda` (KEEP): unchanged.
- a-3 `invention/baghdad-papermaking` (FIX): cut the sentences naming Osman Ersoy, al-Fadl ibn Yahya, "178 AH" and Bloom's non-confirmation (en, ar, ur); kept "paper is a mat of fibres ... origin Chinese, so Baghdad's story is moving a craft rather than inventing it". Evidence row for the cut claim deleted.
- a-3 `building/bayt-al-hikma` (KEEP with the reviewer's addition): added that Ahmad Amin states its system and exact location remain shrouded in uncertainty (record: "The source states that its system and its exact location both remain shrouded in uncertainty"); new evidence row. The card keeps "greatest library", the attribution to Ahmad Amin and the English record's words, as before.
- a-4 `concept/unglazed-earthenware` (KEEP): unchanged. `concept/sabil` (FIX): cut the sentence "They were called siqayas in the first five centuries and widely sabils from the late fifth century AH ..." (ar, ur likewise); evidence row deleted.
- a-5 `concept/medina-society-at-hijra` (REMOVE, done first by the founder's order, verdict R-h): connection removed and every mention in the lesson's three prose files; evidence rows deleted. `grep -l "concept/medina-society-at-hijra" data/course/*.yaml` found only `ca-on-g4-ss-a-5.yaml` (the other greps in the run, for `concept/athar-al-iqlim`, are reported in the Grade 7 and Grade 11 logs). The museum record was not edited.
- a-5 `concept/al-ziyy-al-andalusi` (KEEP): unchanged. The lesson is left with this one connection, which the reviewer lists for A1.2 only, so A1.1 moved to the gap register (new entry, with the reason and three search lines). The lesson's summary, position of the card (still `after`) and Brief now speak of A1.2 only and of one example, dress in al-Andalus.
- a-6 `concept/istirda-al-badiya` (FIX): "children" -> "babies" (ar: لأطفالهم الرضّع; ur: اپنے شیر خوار بچوں) and the closing question "How would your own days differ if you had spent your first years there?" -> "Who looks after babies in your family?" (ar: من يرعى الرضّع في أسرتك؟; ur: آپ کے گھرانے میں شیر خوار بچوں کی دیکھ بھال کون کرتا ہے؟). `concept/sabil-kuttab` (KEEP): unchanged. I did not change the lesson's Try this ("I differ from this child because ..."), which still compares only with what the records say; a reviewer may want to soften it.
- a-7 `concept/hima` (FIX): cut "Whoever grazed his livestock there would have gained unlawfully" (en, ar, ur), the reviewer's second option (attribute or cut); nothing else needed it. `concept/agriculture-in-islam` (FIX): cut the dead-land and idle-three-years sentences with "the ruler's leave"; kept farming as the oldest livelihood and the warning against withholding surplus water. `journey/qus-to-aydhab-jubayr-desert` (FIX): "The book then names ..." -> "Ibn Jubayr's book then names ..." (ar: كتاب ابن جبير; ur: ابن جبیر کی کتاب), so the thirst claim is attributed by name; the card lists three water points, not eight, and does not say the order is unsettled. I did not add a note that "deadly" is softened, because I did not soften it.
- a-8 `invention/tabula-rogeriana` (REMOVE, whole lesson): lesson record and its three prose files deleted; removed from the unit's `lessons:`; evidence rows deleted; A3.1 added to the gap register with the reviewer's reason and two search lines (the expectation text copied from the lesson record before it was deleted). The unit keeps seven lessons, so no unit or subject record was deleted.
- Verdicts judged wrong and not applied: none.
- Gate after the changes: `RESULT: GREEN (24 checks passed)`; cite-check: 0 fail.

### Records for the founder

- `concept/medina-society-at-hijra`: prose reporting al-Raheeq al-Makhtum's description of the Jews of Medina ("considered their property lawful, earned through usury and pledges, and incited the tribes against one another"). Hateful content as a reported opinion; it should carry attribution and a perspectives block, or be reviewed. No lesson links or points to it any more. The museum record itself was not edited.
- `concept/athar-al-iqlim`: see the Grade 7 geography log; not linked from this course.
