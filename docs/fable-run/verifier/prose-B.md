# Prose verification, batch B

Records checked: 14. Sentences read: 246 (123 Arabic, 123 English). Source pages opened: about 118 (book pages, transcript segments, the two frozen Tanzil files and one GeoNames row). Findings: 2 ERROR, 23 WEAK, 3 MISMATCH.

Working tree at HEAD `28b8581286`; baseline `e1d721298ab4b2494a4c8f04d3defcde1808b939`. I did not write these texts. Nothing was edited; this file is the only thing written.

How to read the tables: "S3" is the third sentence of the lead as the evidence file numbers it. "Carried" means the sentence stood in the baseline record with the same meaning, so the rewrite did not create the problem, but it now stands in the Tour's most visible text. Verse fragments are referred to by sura and verse and are not retyped here.

Mechanical checks run on all 14 leads, both languages (script in my scratchpad, not in the repository):

- `python3 scripts/fable/o03_tour_prose.py <14 ids>`: GREEN, no citation outside the baseline source list, all leads 156 to 178 Arabic words and 222 to 247 English words.
- Citation sequence and link sequence are identical in Arabic and English for every record. Every number written in digits in one language is in the other.
- No typed honorific and no Qur'an bracket in any lead. No Qur'an wording typed in any lead, in any language.
- Every Arabic parenthesis that holds Arabic script has the U+2066 / U+2069 isolates.
- Every link target has a data file, except one that resolves through an alias (see `event/conquest-of-mecca`).
- No blocked organisation in any lead. `place/marj-dabiq` is the place, a named non-match.
- Outside the lead, 13 of the 14 Arabic files and 13 of the 14 English files are byte-identical to the baseline. The fourteenth is `event/conquest-of-mecca`, reported below.

Things outside my brief that I saw and did not check: the data files of `work/quran` (`wings: []` became `[words]`), `person/ahmed-iii-uthmani` (`importance: 2` became `1`) and `object/kiswa` (four relations and a wing added) changed beyond the `lead_deepened` line. Those belong to the relations check.

## event/first-revelation
Checked: baseline Arabic and English prose and data; al-Raheeq local copy `20210430_20210430_0628`, pages 64, 65, 66; al-Raheeq 2014 copy, PDF pages 55, 56, 57 (the footnote on the month and the day; its text layer is stored reversed but is readable).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| MISMATCH | en | S4 "Aisha relates in the Sahih that revelation began with the true dream" | Arabic has «الرؤيا الصالحة». "True dream" is the other reading, «الرؤيا الصادقة», and this same record keeps the two apart. | Raheeq local p.65, Aisha's hadith: «الرؤيا الصالحة في النوم»; local p.64, the author's own narrative: «الرؤيا الصادقة». Baseline English had "the good dream". The record's al-Heweny section says both readings are established and names them separately. |

Everything else is in the baseline record with the same citations and is on the pages named. The footnote exists and names the three books; those three books were not opened by the writer or by me (disclosed as carried).

## event/battle-of-badr
Checked: baseline prose and data; al-Raheeq local copy, pages 196 to 200, 204, 205, 209, 210, 213, 214, 218, 224 to 227.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S4 «وخرج في ثلاثمائة وبضعة عشر رجلاً» / "He set out with just over three hundred men" | "One horse or two" is on the page, but it now contradicts the same record three times, and the evidence file's header says nothing new was taken from a source. | Page 197: «فلم يكن معهم إلا فرس أو فرسان: فرس للزبير ... وفرس للمقداد»; page 198: the two were «الفارسين الوحيدين في الجيش». Record, section «السياق»: «فرسان فقط»; English "Context": "only two horses"; data `sides[0].strength.note`: «فرسان وسبعون بعيراً». |
| WEAK | ar, en | S5 «فحوّل أبو سفيان العير إلى الساحل وأرسل إلى مكة مستصرخًا، فخرج جيش قريش» / "Abu Sufyan turned the caravan to the coast and sent to Mecca for help" | Order of events reversed against the page. Carried from the baseline «السياق». | Page 198: he sent Damdam to Mecca for help first. Page 199: the army set out. Page 200: only when near Badr did he turn the caravan to the coast, and what he then sent was a message telling the army to go back. |
| WEAK | ar, en | S10 «ويصفها صاحب «الرحيق المختوم» بأنها أول معارك الإسلام الفاصلة» / "calls it the first decisive battle of Islam" | Citation points at the wrong pages, and "struck fear" is stronger than the page. Carried. | The words are the chapter title, local p.196 (the record's p.204), not p.229-233. The tribes: local p.227 says the Bedouin around Medina «أخذهم القلق، واضطربوا ... وخافوا أن تقوم في المدينة دولة قوية»; the lead has «أُرعبت». |
| WEAK | ar, en | S2 «بدأت مطاردةً لقافلة تجارية» / "It began as the pursuit of a trade caravan" | «غيّر ميزان القوى في الحجاز» is an assessment in the museum's voice that is not on the cited page. Carried; the writer says the same. | Local pp.225 to 227 (the record's p.231 to 233): «معركة فاصلة أكسبت المسلمين نصراً حاسماً شهد له العرب قاطبة»; nothing on the balance of power in the Hijaz. |
| MISMATCH | en | S9 "The captives were ransomed" | Arabic says the decision settled on ransom; English says the captives were ransomed, all of them. | Page 224: ransom was taken, and the Prophet «منّ ... على عدة من الأسارى فأطلقهم بغير فداء». The record's own body has two captives executed on the way back. |

## event/conquest-of-mecca
Checked: baseline prose (the four heading-less paragraphs), data, and the Urdu file; al-Raheeq local copy, pages 377, 378, 380 to 386, 390, 391, 392.

File integrity, as asked: the front matter is byte-identical in both languages. Everything from «## علي في فتح مكة» (Arabic, 4,992 bytes) and from "## For Sprouts" (English, 3,188 bytes) to the end of the file is byte-identical to the baseline. The only change is that the four heading-less paragraphs were replaced by the new heading and lead. All eight sentences are on the pages the lead cites. No Qur'an wording is left in the lead; the three quoted words of the pardon are hadith, verbatim from p.386.

What the old opening said and where it went: kept, 10 Ramadan 8 AH, ten thousand Companions, the breach at al-Watir, Marr al-Zahran, Abu Sufyan and al-Abbas, the house of safety, Dhu Tuwa and the four commanders, al-Khandama and the twelve dead, the circling of the House, the 360 idols, the bow, the address at the door. Dropped with a stated reason: the two verse fragments, the question and answer before the pardon, the praise wording, the motive for the house of safety, the count "four banners", the two unnumbered `sahih-al-bukhari` citations. Dropped with no stated reason: see the third row.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S1 «فتح مكة غزوة خرج إليها النبي» / "The conquest of Mecca was a campaign" | "January 630 CE" is now attached to the departure from Medina on 10 Ramadan. The baseline attached it to the conquest, 20 Ramadan. It is not on the cited page, so it is a derived date on a different day, inside a sentence cited only to p.380. | Baseline data `date.start`: `0630-01-11~`, hijri `0008-09-20`. By that same reckoning 10 Ramadan is 1 January 630, the first day of the month, and a one-day difference in the table used puts it in December 629. The writer notes the date is not on the page. |
| WEAK | ar, en | S4 «ومضى النبي حتى بلغ ذي طوى», second clause / "the banner of the Ansar had been handed to Qays" | Stated as fact; the page gives a second report. | Page 383: «ودفعه إلى ابنه قيس ... وقيل: بل دفعه إلى الزبير». The evidence file quotes the second report and the lead leaves it out. |
| WEAK | ar, en | whole lead | Three things the old opening said are gone and the evidence file's list of what was dropped does not name them: that the Muslims entered Mecca peacefully but for a small skirmish; that the Prophet entered Mecca at all (the lead goes from Dhu Tuwa to the circling of the House); and that the address was a pardon (the word went out with "historic"). | Baseline paragraph 3: «فدخل المسلمون مكة سلماً إلا مناوشة يسيرة بالخندمة»; paragraph 4: «ودخل رسول الله مكة», «وأعلن عفوه». Page 384 has the heading «الجيش الإسلامي يدخل مكة» and does not say "peacefully": Khalid's men killed whoever met them and two Muslims were killed, so dropping "peacefully" can be defended, but it should be declared. |
| WEAK | ar, en | S3 «ولما نزل الجيش مرّ الظهران» / "When the army camped at Marr al-Zahran" | «وجعل النبي من دخل داره آمناً» / "the Prophet declared safe whoever entered his house": the pronoun now reads as the Prophet's house. | Page 382: «من دخل دار أبي سفيان فهو آمن». |
| WEAK | ar | S4 «ومضى النبي حتى بلغ ذي طوى» | Grammar: after «بلغ» the name is accusative, «ذا طوى». The page has «انتهى إلى ذي طوى»; the verb was changed and the case was not. | Page 384. |
| WEAK | ar, en | S4, link `person/qays-ibn-sad-ibn-ubada` | `ls data/person/qays-ibn-sad-ibn-ubada.yaml` fails. The id is an alias of `person/qays-ibn-sad`. Carried, but the writer replaced the same kind of alias for Abu Ubayda in the English lead and left this one. | `data/person/qays-ibn-sad.yaml` line 4: `aliases: [person/qays-ibn-sad-ibn-ubada]`. |

Not a sentence finding: `content/ur/event/conquest-of-mecca.md` was not touched. It still opens with the heading-less paragraphs, so the Urdu page still shows no opening, and it still carries the praise wording and the two unnumbered `sahih-al-bukhari` citations that were removed from Arabic and English. Data `date.start` (Friday 20 Ramadan, credited to al-Raheeq) disagrees with the copy read (Tuesday 17 Ramadan, p.383); the writer reports this and the lead avoids the day.

## work/quran
Checked: baseline prose and data; both frozen files in full, by count and by reading the notice; `data/source/tanzil-quran.yaml`; `git log -- data/work/quran-source/`; `scripts/validate.ts` lines 86 to 87 and the `prebuild` script in `package.json`.

What holds. No Qur'an wording is typed in either language and no sura is named. Every count re-derives from both files: 114 suras, 6,236 verses, numbered without a gap; sura 2 the longest with 286; suras 103, 108 and 110 the shortest with 3; sura 1 with 7, sura 114 with 6; suras 1 to 26 hold 3,159 (suras 1 to 25 hold 2,932, half is 3,118); suras 78 to 114 are 37 suras with at most 46 (sura 77 has exactly 50). The notice says what S7 says. The two sha256 values in the data file match the files on disk. The files entered the repository in one commit dated 2026-10-11 and have not changed. The validator compares each passage with the frozen file, and `prebuild` runs the validator.

Is citing Tanzil for statements about how the museum stores the text honest? No. Four of the nine sentences (1, 2 in part, 8, 9) say things the cited source does not and cannot say. For 8 and 9 the real evidence is the repository, which I checked and which supports them except for the first clause of 8. The citation is there because the check requires one on every sentence, not because the source carries the claim. The evidence file admits this in one line; the page a visitor sees does not.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| ERROR | ar, en | S8 «ولا يكتب المتحف نص الآيات في صفحاته» / "The museum does not type the text of the verses on its pages" | False as a description of the museum, and cited to a source that cannot attest it. An outside checker refutes it with one search. The baseline had the sentence without a citation; it now carries one. | Verse wording typed in prose or data today, in this same batch: `content/ar/event/first-revelation.md`, section «رواية عائشة» and «ملاحظات للباحثين» (words of 96:5 in guillemets); `content/ar/event/battle-of-badr.md`, section «القرآن والمعركة» (words of 8:17); `data/event/conquest-of-mecca.yaml`, `summary.ar` (words of 17:81), and `content/ar/event/conquest-of-mecca.md` line 30. The writer's own evidence files for those three records note the first three. |
| WEAK | ar, en | S2 «ولغته العربية، ويعتمد المتحف في نصه على مشروع تنزيل» / "Its language is Arabic" | "In the Hafs transmission" is not in the cited source. The word Hafs is in neither frozen file, nor in their notice, nor in the source record. It rests only on the record's own earlier text. | Notice at the end of both files (31 non-verse lines): version, licence, verification, terms of use; no transmission named. `data/source/tanzil-quran.yaml`: no mention. Baseline lead: «برواية حفص كما في نص مشروع تنزيل». |
| WEAK | ar, en | S9 «وتُحال إلى هذين الملفين صفحات الآيات المنفردة» / "The pages for individual verses refer to these two files" (and the rest of S8) | True, but the citation is not the evidence. The freeze date, the two uses of the files and the build check are facts about the repository. | Data `text_source` (`frozen: "2026-10-11"`, `use: text`, `use: text_search`, `rule`); `scripts/validate.ts` line 87; `package.json` `prebuild`. None of this is in the Tanzil files. |
| WEAK | ar, en | S1 «القرآن كتاب الإسلام المقدس» / "The Qur'an is the holy book of Islam" | What Muslims believe is cited to a text file that does not say it. Carried with the same citation. | The files hold verses and a licence notice only. |

## person/ali-ibn-abi-talib
Checked: baseline lead and sections «الإسلام والهجرة» to «وفاته»; Usd al-ghaba local copy, pages 871 to 875, 881 to 886; Abu Nu'aym, scan p.2002.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S9 «وتوفي ليلة الأحد لإحدى عشرة ليلة بقيت من رمضان» / "He died on the night of Sunday" | Age sixty-three is given flat; the page read opens the matter with a disagreement. Carried from the baseline lead. | Usd al-ghaba p.886: «واختلفوا في عمره ... وكان سنه يوم قتل ثلاثاً وستين سنة. قال الواقدي: وهذا أثبت عندنا». Abu Nu'aym scan p.2002 gives sixty-three without the disagreement. |

All nine sentences are on the pages cited. No statement of faith or school was added. "Joined him in Medina" is on p.873. The change of the lead's citations from the old range to the page each fact is on is correct.

## person/umar-ibn-abd-al-aziz
Checked: baseline lead, sections and the data summary; al-Sallabi, pages 159, 161, 172, 173, 193, 196, 202, 203, 298; al-Tabari, scans 72, 73, 75, 78; al-Mas'udi, scan 172.

No finding. All eight sentences are on the pages cited, including the three taken newly from the page (the governor of Egypt and the jizya, p.203; "counted among the Rightly Guided Caliphs", p.159, given as al-Sallabi's report; the testament and the month). "His governor of Iraq" is al-Tabari's wording on scan 75; al-Sallabi p.203 calls the same man governor of Kufa.

## person/al-khwarizmi
Checked: baseline prose; Mawsu'a vol. 8 p.523; London edition scan 121; Cairo edition scans 22 to 25; al-Mas'udi in `extracted/muruj/muruj.txt` at the marker `PageV01P253`.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S1 «أبو عبد الله محمد بن موسى الخوارزمي عالم رياضيات وفلك» / "Abu Abd Allah Muhammad ibn Musa al-Khwarizmi was a scholar" | The locator `muruj-al-dhahab p. 519` matches no local copy. The passage is real. Carried; the writer says the same. | Found between the markers `PageV01P253` and `PageV01P254`. In this same batch `person/umar-ibn-abd-al-aziz` cites the same source id by the page index of another scan, so one id carries at least two paginations. |

The other six sentences are on the pages cited. The Mawsu'a entry's report of a former religion was rightly not used. The dates 164/780 and 235/850 are the Mawsu'a's own heading.

## place/cairo
Checked: baseline prose and data; al-Maqrizi, scans 1001, 1030, 1031, 1032, 1067; al-Suyuti, pp.620 to 621; Golius, PDF pp.397 to 398 (Latin); GeoNames row 360630.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S2 «أسسها الفاطميون بجوار الفسطاط» / "The Fatimids founded it beside Fustat" | The year 969 CE is on neither cited page. The sentence says it is the museum's dating, but the two citations after it are al-Maqrizi's. | Scan 1030 gives Tuesday 17 Sha'ban 358 and, as another report, Jumada II 359. Data `founded.edtf: 0969` is a conversion and is not marked derived (the writer notes this). |

All eleven sentences are on the pages cited, including the three new ones (the fortress against the Qarmatians, scans 1030 to 1031; the two names of the mosque, scan 1032; Golius's sentence, PDF p.398, which I read in Latin and which the Arabic and English render fairly).

## person/al-ghazali-abu-hamid
Checked: baseline prose and data; Shadharat al-Dhahab, PDF pp.490 to 493; Kashf al-Zunun p.221 with its footnote 3; al-Mustasfa PDF p.2. `britannica-al-ghazali` is not on this machine; the year 1058 is carried from the data file.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| ERROR | ar, en | S3 «ثم ارتحل إلى نيسابور فلازم إمام الحرمين حتى صار أنظر أهل زمانه» / "until he became the ablest debater of his time" | A superlative in the museum's own voice. It is al-Isnawi's praise, quoted by Ibn al-Imad, and the lead states it with no attribution. It was not in the baseline lead nor in the baseline section «سيرته»; it stood only inside the data summary's retelling. | Shadharat PDF p.491: «وقال الإسنوي في طبقاته ... ولازمه حتى صار أنظر أهل زمانه». Baseline «سيرته»: «انتقل إلى نيسابور فلازم إمام الحرمين، وندب للتدريس». Brief, rule 4. |
| WEAK | ar, en | S5 «ثم زار القدس والإسكندرية وعاد إلى طوس» / "He then visited Jerusalem and Alexandria" | The second return home is dropped, so «ثم ابتنى إلى جواره» has lost its antecedent and reads as "beside the Nizamiyya of Nishapur". English supplies "his home", which the Arabic does not have. | PDF p.492: «ثم عاد إلى وطنه بطوس ... فأجاب إلى ذلك وأقام عليه مدة ثم تركه وعاد إلى وطنه ... وابتنى إلى جواره خانقاه للصوفية ومدرسة للمشتغلين». |

The other sentences are on the pages cited. "Al-Shafi'i" and the title were in the baseline lead. The attribution of the saying about the Ihya' to al-Nawawi is the author's marginal note, in the editors' footnote 3 on p.221; the main text has «حتى قيل فيه».

Seen outside the lead: `data/person/al-nawawi.yaml`, the target of the lead's last link, has a mis-encoded Arabic summary (UTF-8 read as Latin-1). It is unchanged since the baseline.

## event/sack-of-baghdad-656
Checked: baseline prose and data; al-Suyuti, pp.715, 716, 719, 721; Ibn Khaldun, pp.900 to 901; lecture transcripts `ep16.json` (segments 1020 to 1080 s) and `ep17.json` (segments 810 to 870 s).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S2 and S3 «يروي السيوطي أنهم كانوا مئتي ألف» / «ويؤرّخ طارق السويدان الهجوم الكبير» | Two datings that do not agree stand side by side and the reader is not told. Entry "on the day of Ashura" is 10 Muharram 656; the lecturer's "great assault" is twelve days later. The lead cut the lecturer's date down to the month, which hides the conflict. | Al-Suyuti p.716: «ودخلوا بغداد يوم عاشوراء». Transcript ep16 at 1050 s: Tuesday 22 Muharram, 2 February 1258. The writer's evidence file records the disagreement. |
| WEAK | ar, en | S7 «ويذكر ابن خلدون أن المدينة استُبيحت أياماً» / "Ibn Khaldun says the city was given over to plunder" | «في خزائنها» / "its treasuries": the page has the caliphs' treasuries, not the city's. | Ibn Khaldun p.901: «واستولوا من قصور الخلافة وذخائرها ... وألقيت كتب العلم التي كانت بخزائنهم جميعاً في دجلة». |

All nine sentences are on the pages or in the segments cited. The change from "Ibn al-Alqami's letter" to "a letter carrying Ibn al-Alqami's counsel" follows p.900 and is right. No sect is stated for the vizier.

## person/ibn-battuta-muhammad
Checked: baseline prose and data; al-Durar al-Kamina 3/480 and 3/481; the Rihla, scans 12, 14, 15, 313, 412, 565, 566, 567; Mawsu'a vol. 3 pp.575, 576, 577.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S8 «ورماه بعض معاصريه بالكذب فبرّأه ابن مرزوق» / "Some contemporaries accused him of lying" | «نهاه» / "warned him": on the page the vizier warns Ibn Khaldun. Every other pronoun in the sentence is Ibn Battuta, so the sentence reads as if the vizier warned Ibn Battuta. | Rihla scan 313, the corrector quoting the Muqaddima: «ولقيت أنا يومئذ ... وزير السلطان فارس بن ودرار ... ففاوضته في هذا الشأن ... فقال الوزير فارس: إياك أن تستنكر مثل هذا من أحوال الدول بما أنك لم تره». |
| WEAK | ar, en | S5 «وفي دهلي ولّاه السلطان محمد شاه قضاء دار الملك» / "In Delhi Sultan Muhammad Shah made him judge" | Brief, rule 4: a statement of a person's school that was not in the baseline lead. It has its basis: it is his own reported speech on the cited page, and it was in the baseline body. Reported so that you decide. | Rihla scan 412: «أنا على مذهب مالك وهؤلاء حنفية وأنا لا أعرف اللسان». Baseline lead: no school. |
| MISMATCH | en | S7 "he dictated it and Ibn Juzayy edited it, finishing on 3 Dhu al-Hijja 756 AH" | English gives the date to Ibn Juzayy's editing. Arabic has the impersonal «وفُرغ من تقييدها», which is what the cited page says of the shaykh's record. | Rihla scan 566: «وكان الفراغ من تقييدها في ثالث ذي الحجة عام ستة وخمسين وسبعمائة», then «قال ابن جزي: انتهى ما لخصته من تقييد الشيخ». (The Mawsu'a, vol. 3 p.576, does give the date to Ibn Juzayy, but that page is not cited for this sentence.) |

The other sentences are on the pages cited, including the new ones (pilgrimage in 726, Durar 3/480; dictation, scan 14; the Mawsu'a's assessment, p.577, given as the Mawsu'a's). «الرحلة المشهورة» / "the well-known Rihla" is the baseline lead's own word, carried. The link `person/ibn-juzayy-muhammad` is the editor of the Rihla, not his father the jurist.

## event/fall-of-granada-897
Checked: baseline prose; Nafh al-Tib, scans 528 to 533; lecture transcript `ep07.json`, segments 990 to 1140 s.

No finding. All nine sentences are on the pages cited, including the three new ones (the papal condition, scan 530; the death at Fez in 940, scan 533; the closing description, scan 532).

Two corrections to the evidence file, neither a fault in the lead. First, it says the lecture transcripts are not on this machine and that sentence 2 could not be checked. The transcript is at `~/devin-harvest/books/assabile/tareq-al-suwaidan/alamani-al-tarikh/pass5-qwen/ep07.json`, and the segment at 1050 s has both dates, 2 Rabi' al-Awwal 897 and 2 January 1492. Second, in that segment the date is given for Abu Abd Allah's leaving his kingdom, where the lead uses it for the entry into the Alhambra; both fall on the same day in the record's sources, so the sentence stands. English "the Moroccan shore" glosses «العدوة», the far shore, which the page leaves unnamed.

## person/ahmed-iii-uthmani
Checked: baseline prose and data; al-Sallabi, Ottoman State, pages 310, 311, 312.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S4 «ثم وُقّعت معاهدة أدرنة سنة 1125هـ» / "The Treaty of Edirne followed in 1125 AH" | "Russia gave up the Black Sea coasts" is wider than the page. Carried. | Page 311: «وتنازلت فيها روسيا عن كل ما استولت عليه من سواحل البحر الأسود». |

All nine sentences are on the pages cited, including the four new ones. The correction of the English "was succeeded by Mustafa II" to "succeeding Mustafa II" is right. The word jihad is al-Sallabi's and is attributed to him. For the reader of S2 and S3: page 310 itself says both that the state regained Azov and that the treaty of Falksen led to Azov being evacuated to the Russians; the lead gives the first under al-Sallabi's name and leaves the second out, as the evidence file says.

## object/kiswa
Checked: baseline prose and data; al-Umari, Masalik al-Absar, scans 138 and 139 (OCR text; I did not open the page images).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | S1 «كسوة الكعبة غطاؤها الأسود المطرّز بالذهب والفضة» / "The kiswa is the black covering of the Kaaba" | Three present-tense facts (silver in the embroidery, yearly replacement in the hajj season, the old cloth given as gifts) rest on `{cite:wikidata}` with no item, property or revision, which nobody re-read. The standing rule allows Wikidata for entity facts from a recorded revision, not for prose. Carried from the baseline lead. | Data: `external_ids.wikidata: Q1511204`, `materials: silk, gold thread` (no silver). The writer says the citation was carried unread. I could not re-read it either. |

Sentences 2 to 8 are on scans 138 and 139 as cited, including the two new ones (people covering the Kaaba after Tubba'; the Prophet and the caliphs after him). The honorific printed on the page was not typed.
