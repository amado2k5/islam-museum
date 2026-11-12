# Prose verification, batch A

Records checked: 14. Sentences read: 254 (127 Arabic, 127 English). Source pages opened: about 126 pages of local scans, plus 24 thirty-second transcript windows. Findings: 2 ERROR, 23 WEAK, 5 MISMATCH.

How the pages were read: each page named below was opened from the `pages.json` of the local copy the evidence file names. Most were read by searching the page text for the words of the claim and reading the passage around them; a few were read whole (Raheeq pp.26 and 34, Muruj p.577, Ibn Khuzayma pp.186, 188, 192, 529, al-Tabari's tafsir pp.241 to 243, Ahsan al-Taqasim scan pp.143 and 144, Usd al-ghaba p.897). One page image was looked at (al-A'lam, `p0046.png`). Sources that are not on this machine were not read by me either: `qalb-jazirat-al-arab`, `muhadarat-tarikh-al-umam-al-islamiyya`, `mukhtasar-sirat-al-rasul`, `ibn-hisham-sira` in the cited edition, `ibn-ishaq-guillaume`, `watt-1956-medina`, `ibn-sad-tabaqat-bewley`, `britannica-umar-i`, `gohlman-1974`, `gutas-2014`, `wikidata`, `tei-epigraphie`.

Oracle: `python3 scripts/fable/o03_tour_prose.py` on the fourteen ids gave GREEN (lengths 150 to 250, no uncited sentence, no citation outside the baseline source list, cite-check 14 pass). The last column is "-" for all fourteen.

Mechanical checks on all fourteen leads: every `[[class/slug|...]]` target has a data file; no typed honorific; every Arabic parenthesis that holds Arabic script has the U+2066 / U+2069 isolates; every superlative found ("أشهر", "أكبر", "most famous", "foremost", "greatest", "at its best") sits inside an attributed sentence.

A severity note. "ERROR" below is used only for the two Qur'an-wording cases, because the brief lists Qur'an wording "in any form" as a rule break. I found no sentence that is unsupported by the page named, and no sentence that contradicts its source. Rows marked "inherited" were already in the record before the rewrite and were carried into the lead.

## building/kaaba
Checked: baseline Arabic and English prose and data. Raheeq, 460-page copy `raheeq-makhtum/20210430_20210430_0628`, printed pp.17, 18, 26 (whole), 27, 28, 29, 34 (whole), 40, 52, 60, 61. `data/passage/quran-14-37.yaml`, `quran-22-27.yaml`, `quran-2-127.yaml`. Not read: Ibn Hisham, qalb-jazirat-al-arab, muhadarat, mukhtasar-sirat-al-rasul.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| ERROR | ar (and en) | وكان موضع البيت، حين أسكن إبراهيم | Qur'an wording typed in the lead: «أسكن … بوادٍ غير ذي زرع» is four consecutive words of Qur'an 14:37, with the same verb. English "settled … in a barren valley" is the same phrase translated. The words reach the lead through the Raheeq's own sentence and were in the baseline body (sections «القصة», «للمستكشفين»), not in the baseline lead. | `data/passage/quran-14-37.yaml` text: «أَسْكَنتُ مِن ذُرِّيَّتِى بِوَادٍ غَيْرِ ذِى زَرْعٍ عِندَ بَيْتِكَ ٱلْمُحَرَّمِ». Raheeq local p.17: «وأسكنهما بواد غير ذي زرع عند بيت الله المحرم». |
| ERROR | ar (and en) | الكعبة هي البيت الذي بناه إبراهيم | Qur'an wording typed in the lead, in a clause the rewrite added: «أذّن إبراهيم في الناس بالحج» is the opening of Qur'an 22:27 with the verb put in the past and the name inserted. English "proclaimed the pilgrimage to the people". The same sentence keeps the baseline lead's «رفعا قواعده», which echoes 2:127. | `quran-22-27.yaml`: «وَأَذِّن فِى ٱلنَّاسِ بِٱلْحَجِّ». Raheeq local p.18: «وأذّن إبراهيم في الناس بالحج كما أمره الله». The evidence file says this clause "was not in the record before". |
| WEAK | ar, en | الكعبة هي البيت الذي بناه إبراهيم | The page number for the added clause was not seen. The record's edition is not on this machine; `p.20` is assumed from the neighbouring fact. Disclosed in the evidence file. | Evidence file, row 1: "the page number is the record's page for that sentence, not a page of the cited edition that I saw". In the copy read, the words are on p.18. |
| WEAK | ar, en | وأراد أبرهة أن يصرف حج العرب | A motive stated as fact in the museum's voice, with no "the Raheeq says". Inherited from the record body. | Raheeq local p.40: «وأراد أن يصرف حج العرب إليها ويهدم بيت الله». The page supports the wording; the finding is the unattributed motive only. |
| MISMATCH | en | Since Ismail's time the Kaaba had been | English adds "just": "just above a man's height, nine cubits high". Arabic «رضماً فوق القامة». Nine cubits is not "just above" a man's height. The baseline English had "rising above a man's height". | Raheeq local p.60: «رَضْمًا فوق القامة، ارتفاعها تسعة أذرع». |
| MISMATCH | en | Five years before the mission a flood | "in the thirty-fifth year after the Prophet's birth" against Arabic «لخمس وثلاثين سنة من مولد النبي» (thirty-five years after his birth). Inherited from the baseline English. | Raheeq local p.60: «ولخمس وثلاثين سنة من مولده». |

## event/hijra
Checked: baseline Arabic prose and data. Muruj al-Dhahab p.577 (whole). Sahih al-Bukhari, copy `sahih-bukhari/20191204_20191204_0622`, pp.951, 952, 961, 962 (hadith 3905 and 3934). Raheeq 460-page copy pp.154, 160, 161, 162, 166, 167, 178. Not read: ibn-ishaq-guillaume.

All ten sentences are supported where the evidence file says.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | وخرج من مكة ومعه أبو بكر | A statement of a person's faith that was not in the baseline lead: Abdullah ibn Urayqit «ولم يكن مسلماً». It is on the page cited, so it has its basis; listed because the brief asks for every new faith statement. | Muruj p.577: «وعبد الله بن أريقط الديلي دليل لهم على الطريق، ولم يكن مسلما». Raheeq local p.162: «وكان على دين كفار قريش». |
| WEAK | ar, en | الهجرة النبوية هي انتقال النبي محمد (and four more) | `muruj-al-dhahab p. 577`, cited five times, is a scan-page index. The printed folio on that page is 573. The source record states no page convention. Inherited from the data summary. | `muruj-dhahab/AAlexandrina-011911/pages.json`, page 577, last line: «٥٧٣». |
| WEAK | ar, en | ونزل قباء يوم الإثنين 8 ربيع | The lead contradicts another section of the same record and its data. Section «ما جرى» still says the reported date of arrival at Quba is 12 Rabi' al-Awwal; data `date.end` is `0622-09-24` with hijri `0001-03-12`. The lead gives Quba as Monday 8 Rabi' al-Awwal, 23 September, and Medina on the Friday, which is 27 September in the same source. Disclosed in the evidence file, not repaired in the record. Also: the same event (entry into Medina on the Friday) is cited here as Raheeq p.172 and in `person/muhammad` as Raheeq p.168. | Raheeq local p.166: «يوم الاثنين 8 ربيع الأول … الموافق 23 سبتمبر سنة 622م نزل … بقباء»; local p.178: Friday «12 ربيع الأول سنة 1هـ الموافق 27 سبتمبر سنة 622م». Baseline «ما جرى»: «التاريخ المروي للوصول إلى قباء هو 12 ربيع الأول». |

## practice/salah
Checked: baseline Arabic prose and data. Ibn Khuzayma, scan `sahih-ibn-khuzayma/61667`, pp.186, 188, 192, 529 (whole pages). Al-Tabari, Shakir vol. 1, pp.241, 242, 243 (whole pages). `data/passage/quran-4-103.yaml`.

All eight sentences are supported where the evidence file says.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | وفي القرآن الأمر بإقامة الصلاة مقروناً | Close to Qur'an wording. «فريضة لها أوقات محددة على المؤمنين» keeps «على المؤمنين» from 4:103 and paraphrases the rest; English "a duty with set times upon the believers" reads as a translation of the verse. The rewrite removed the baseline's quoted «كتاب موقوت», which is an improvement; what is left is still a rendering of the verse rather than a description of it. | `quran-4-103.yaml`: «إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًا مَّوْقُوتًا». |

## person/muhammad
Checked: baseline Arabic prose and data. Raheeq 460-page copy, pp.49, 54, 57, 58, 60, 61, 62, 63, 64, 66, 75, 168, 178, 180, 444, 454. `data/source/mubarakpuri-raheeq.yaml`.

All ten sentences are supported on the pages cited (this record's page numbers match the 460-page copy).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | محمد بن عبد الله بن عبد | The sentence carries «نحو 570–632م» under a citation to p.49, which has the lineage only. The next sentence gives the source's own birth date as April 571. A reader sees "about 570" and "571" in consecutive sentences. Inherited from the old lead; disclosed. | Raheeq p.49: lineage to Adnan, no date. Raheeq p.54: «سنة 571م». |
| WEAK | ar, en | وُلد بشعب بني هاشم في مكة | «ويوافق ذلك عند المباركفوري» / "which al-Mubarakpuri equates with": the page credits the equation to another scholar, whom al-Mubarakpuri follows. Inherited (the baseline had «عند المؤلف»). | Raheeq p.54: «ويوافق ذلك عشرين أو اثنين وعشرين من شهر أبريل سنة 571م حسبما حققه العالم الكبير محمد سليمان المنصورفوري». |
| WEAK | ar, en | وتوفي بالمدينة في 12 ربيع الأول (and the last sentence) | Citation pages `p.444` and `p.454` lie beyond the copy that the source record names as the checked local copy (344 PDF pages); the source record says citations past p.344 "must be checked against the edition the team intends". Across the Tour the one source id `mubarakpuri-raheeq` is cited in three page systems: this record (460-page copy), `building/kaaba` (one to two pages ahead of it) and `event/hijra` (two to six pages ahead). Disclosed in the evidence files. | `data/source/mubarakpuri-raheeq.yaml`, `reliability_note`. Entry into Medina: p.168 here, p.172 in `event/hijra`. "Al-Amin": p.62 here; in `building/kaaba` p.62 is the roofing of the Kaaba. |

## person/umar-ibn-al-khattab
Checked: baseline Arabic prose and data. Usd al-ghaba, scan `usd-ghaba/20191216_20191216_1124`, pp.897 (whole), 900, 908, 909, 913, 914. Khalifa ibn Khayyat, ed. al-Umari, pp.119, 122, 125, 135, 142, 152, 153. Sahih al-Bukhari hadith 3863 in copy `20191204_20191204_0622`, p.940 (and its twin 3684, p.901). Source records `watt-1956-medina`, `britannica-umar-i`. Not read: Watt, Ibn Sa'd (Bewley), Britannica.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | وفي سنواته العشر فُتحت الشام ومصر (and sentence 1) | The citation `watt-1956-medina` now stands under "most of the Sasanian Empire" (and under "ruled 634 to 644" in sentence 1). In the baseline the cited sentence said Syria, Egypt and Iraq; "most of the Sasanian Empire" was the old lead's uncited wording. The source record describes the book as a study of the Prophet's Medinan period. No page, not re-read. A page the lead already cites would carry the conquests. | Baseline «الحياة»: «فشهد عهده فتح الشام ومصر والعراق … {cite:watt-1956-medina}». `data/source/watt-1956-medina.yaml`: "study of the Prophet's Medinan period and the early community". Usd al-ghaba p.909: «ففتح العراق، والشام، ومصر، والجزيرة … وبلاد فارس، وخوزستان». |

Note, not a finding on the lead: the evidence file says the only local Bukhari is the al-Bugha scan, so hadith 3863 was "not re-read". The copy `20191204_20191204_0622`, which the Hijra evidence file used, has the standard numbers; 3863 is on its p.940 and supports the quotation.

## building/dome-of-the-rock
Checked: baseline Arabic and English prose and data. Qabbani (`tarikh-umayyad-salabi/2006_20231111`) title page, pp.161, 163. Ahsan al-Taqasim scan pp.12, 143 (whole), 144 (whole). Al-Umari 1924 scan pp.177, 178, 180, 181, 182. Source records for the three. Not read: Wikidata, TEI.

All nine sentences are supported where the evidence file says.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | ووصفها المقدسي في أحسن التقاسيم (and the next two) | `ahsan-al-taqasim p. 12 / 143 / 144` are scan-page indices, not printed pages: the printed folios on those scans are 146 and 147. A reader with the printed book will not find the passage at p.143 or p.144. The al-Umari source record tells writers to cite the scan page; the Ahsan al-Taqasim source record does not. Inherited convention; disclosed. | Scan p.143 ends with the printed folio «١٤٦»; scan p.144 ends with «١٤٧». |

## person/malik-ibn-anas
Checked: baseline data. Siyar (Ideas House scan) pp.3145, 3147, 3152, 3153. Fihrist, old Cairo print, scan pp.276, 277 (printed 280, 281). Muwatta, ed. Ma'ruf, vol. 1 pp.5, 6, 7. Source record `fihrist-ibn-al-nadim`.

All ten sentences are supported where the evidence file says. The printed folio of the Muwatta introduction equals the PDF page (p.5 prints «٥»), so `ج1 ص6` is a printed page.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | ويذكر ابن النديم أن جعفر بن (and the two after it) | `fihrist-ibn-al-nadim p. 280-281` are pages of the old Cairo print. The source record defines the source as the Furqan edition (Ayman Fuad Sayyid, 2 vols). The page numbers do not belong to the edition the citation resolves to. Inherited; disclosed. | `data/source/fihrist-ibn-al-nadim.yaml` summary: "Al-Furqan Islamic Heritage Foundation edition". Local scan `AAlexandrina-192984`, scan p.277 prints «-٢٨١-». |

## person/al-tabari
Checked: Fihrist scan pp.322, 323 (printed 326, 327). Al-Kamil scan pp.99, 100. EI2 vol. 10 PDF pp.21, 22, 23. Baseline lead through the evidence file only.

All nine sentences are supported where the evidence file says. "Returned from Egypt to Baghdad around the year 256/870" is on EI2 PDF p.21 in those words; the same page also has "came back to Egypt, possibly in 256/870", which is a different journey.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | أبو جعفر محمد بن جرير الطبري (and four more) | Same edition problem as Malik: `fihrist-ibn-al-nadim p.326-327` are the old Cairo print's pages, against a source record that names the Furqan edition. And `kamil-ibn-al-athir p.99-100` has no volume; the pages are scan pages of one local volume. Inherited; disclosed. | Scan p.323 prints «-٣٢٧-». Evidence file: "The Kamil citation has no volume". |

## person/ibn-sina
Checked: baseline Arabic prose and data. Shadharat al-Dhahab, `AAlexandrina-223861`, PDF pp.242 to 245 (printed 234 to 237). Golius on al-Farghani, PDF p.420. Transcript `al-mubdioune/pass5-qwen/ep27.json`, windows 00:01:30, 00:02:00, 00:16:30, 00:17:00, 00:17:30. Not read: gohlman-1974, gutas-2014 (four of the nine sentences lean on them, without a page).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | أبو علي الحسين بن عبد الله | "Known in Europe as Avicenna" is more specific than the page cited. Golius says "commonly called Avicenna"; "in Europe" is the old uncited lead's wording, now under his citation. | Golius PDF p.420: "medicus & philosophus Ibn Sina, vulgo Avicenna dictus". Baseline «ملاحظات للباحثين»: «ابن سينا المعروف باسم أفيسينا». |
| WEAK | ar, en | وُلد نحو سنة 980م في قرية | The birthplace is stated as fact from a source nobody read (Gohlman, no page), while a page the same paragraph cites gives a different village: Ibn Khallikan, as quoted there, has him born at Kharmaythan, with his mother from Afshana. Disclosed in the evidence file, not in the lead. | Shadharat printed p.234 (OCR text, spelling normalised): «تولى العمل بقرية من ضياع بخارا يقال لها خرميثن … وولد الرئيس أبو علي وكذلك أخوه بها واسم أمه ستارة وهي من قرية يقال لها أفشنة». The same page, from al-'Ibar: «وأصله بلخي ومولده ببخارى». |
| WEAK | ar, en | وتفاوتت أحكام العلماء عليه: رأى الغزالي | Two things. (1) The record's perspective is labelled Sunni («تفاوتت أحكام علماء أهل السنة عليه»); the lead drops the label and says «العلماء» / "Scholars". (2) A judgement on a person's faith (three teachings held to be unbelief) is new to the lead; it comes from the record's perspectives block and is attributed to al-Ghazali, cited to Gutas unread, with the Shadharat page in support. | Baseline data `perspectives[0]` (tradition: sunni). Shadharat printed p.237, Ibn al-Ahdal as quoted by Ibn al-Imad: «وقد كفّره الغزالي في كتابه المنقذ من الضلال … وأثنى عليه ابن خلكان». |
| MISMATCH | ar / en | وتفاوتت أحكام العلماء عليه | Arabic «تفضي إلى الكفر» (lead to unbelief); English "amounted to unbelief". Inherited from the two halves of the perspectives block. | Baseline data `perspectives[0].summary.ar` and `.en`. |

## person/ibn-rushd
Checked: baseline leads. Bidayat al-Mujtahid ed. Hallaq PDF pp.12, 13. Ed. al-Bakri pp.9, 10, 11, 12, 13. Al-A'lam PDF p.46 (text and the page image `p0046.png`, where the dates read ٥٢٠–٥٩٥ and ١١٢٦–١١٩٨; the OCR text misreads the second as 1136). Source record `al-aalam`.

All eight sentences are supported where the evidence file says.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | درس الفقه وبرع فيه، وعرض «الموطأ» | Praise in the museum's own voice: «وبرع فيه», «حتى صار يُضرب به المثل فيها» / "excelled in it", "became proverbial in them". The words are the editor's (al-Bakri) and the sentence does not say so; the later sentences do name him. Carried from the record body into the lead. | Al-Bakri p.10: «فدرس الفقه وبرع به … حتى صار يضرب به المثل فيها». |
| WEAK | ar, en | أبو الوليد محمد بن أحمد بن (and sentences 3 and 8) | `al-aalam p. 850` is the printed page of volume 3 of the 1347/1928 printing. The source record defines al-A'lam as the Cairo second edition (1945), and the body of this same record still cites the same entry as `p. 849`. One entry, two page numbers in one record, neither from the defined edition. Disclosed. | `data/source/al-aalam.yaml`: `publisher: "القاهرة، الطبعة الثانية"`, issued 1945. Evidence file: "The record's body cites p. 849; the lead cites … p. 850". |
| MISMATCH | ar / en | أبو الوليد محمد بن أحمد بن | Arabic «يسميه الأفرنج» (the Franks, as the source has it); English "whom the Latins call". Inherited from the baseline lead. | Al-A'lam printed p.850: «يسميه الافرنج (Averroès)». |

## person/ibn-taymiyya
Checked: baseline leads and data. EI2 vol. 3 PDF pp.983, 984, 985, 986, 987. Al-Durar al-Kamina vol. 1 pp.144, 145, 149, 150, 151, 152 (the praise on pp.150 to 151 is introduced «قال الذهبي ما ملخصه»). Wasitiyya title page not opened.

No finding in the lead. All nine sentences are supported where the evidence file says; every double date is the source's own (EI2). "Hanbali" and the title "Shaykh al-Islam" were in the baseline lead.

Outside the lead, and visible on the same page (not counted above):
- `data/person/ibn-taymiyya.yaml`, `summary.ar` is mojibake: it reads «Ø´ÙØ® Ø§ÙØ¥Ø³ÙØ§Ù …». The bytes are double-encoded and some are lost, so it cannot be decoded back. It was like this at the baseline commit. This is the Arabic summary of a Tour stop.
- The same file's `summary.en` says, from `siyar-alam-nubala 17/541`, that he "died Saturday 4 Jumada al-Akhira 728 and was buried at al-Qarafa". The lead, EI2 PDF p.985, the Durar 1/149 and the summary's own next sentence all have 20 Dhu al-Qa'da 728, the citadel of Damascus and the Sufiyya cemetery. The Siyar reading looks like a namesake or a wrong entry. The evidence file notes it.

## event/conquest-constantinople-857
Checked: baseline leads, data `date`, and the body's siege lengths. Shadharat al-Dhahab, `AAlexandrina-223853`, scan pp.352, 353 (printed 344, 345). Al-Sallabi pp.90, 92, 94, 95, 98, 99, 105, 106, 109, 110, 111.

All nine sentences are supported where the evidence file says.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | فتح السلطان محمد الفاتح القسطنطينية الكبرى | "After a siege of fifty days" stands outside the attribution (in both languages "according to Shadharat" governs the date of entry only), and the lead's own dates from al-Sallabi do not give fifty days: arrival on 6 April and entry on 29 May 1453 are 53 days apart. The record's section «للدارسين» says about fifty-three days, and the evidence file reports 54 from al-Sallabi p.113. | Shadharat printed p.345: «وحاصرها خمسين يوما … في اليوم الحادي والخمسين». Al-Sallabi p.94 (6 April) and p.110 (29 May). |
| MISMATCH | ar / en | وفي مجلس الشورى دعا الوزير خليل | Arabic «فعارضه زوغنوش باشا وأيده الشيخ آق شمس الدين» leaves open whom the shaykh supported; English says "supported Zaganos". The source is clear, so the Arabic should be too. | Al-Sallabi p.106: «فأجابا أنهما على رأي زوغنوش باشا». |

## building/taj-mahal
Checked: baseline lead, section «الأثر», data. Brookes scans 27, 28, 29, 31 (printed pp.151, 152, 154, 159). Rezavi PDF pp.4, 6, 7, 13, 15 (printed 129, 131, 132, 138, 140). Not read: Wikidata.

All eight sentences are supported where the evidence file says. The removal of the old lead's "most famous Islamic building in the world" is right.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | تاج محل ضريح في آغرة بناه | The whole first sentence, including the description (white marble dome above the Yamuna, garden crossed by channels, inlaid calligraphy and stones), is cited to `wikidata` only. A database entry can carry the place, the patron and the years; it cannot carry a description. The pages that do carry it are already cited two sentences later. Inherited from the old lead. | Brookes p.154 and Rezavi pp.131 to 132 have the description. Evidence file, row 1: "Most of it is also on the Brookes pages I read". |

## person/malcolm-x
Checked: baseline Arabic prose and data. Transcript `/Volumes/exmicroSD/devin-harvest/books/assabile/tareq-al-suwaidan/kissa-wa-fikra/pass5-qwen/ep02.txt`, windows 00:00:30, 00:01:00, 00:01:30, 00:06:30 to 00:08:30, 00:12:30 to 00:13:30, 00:16:00 to 00:21:30, 00:22:30 to 00:25:00. Source record `assabile-tareq-al-suwaidan`. Not read: Wikidata. I did not listen to the recording.

Every statement after the first sentence is in the transcript window cited. The lead keeps out the speaker's own vocabulary (he calls the movement "deviant" and the victim a martyr), which is right.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | وفي السجن جاءته رسائل إخوته بأنهم | «التي أسسها إلايجا محمد» / "founded by Elijah Muhammad" is stronger than the transcript. The speaker says a man he calls Muhammad Farad came first and Elijah preached for him, then gives his own judgement that Elijah was "the real founder". The lead turns that judgement into a plain relative clause. Inherited from the record's section. | Window 00:08:30: «قام رجل ادعى النبوة، اسمه محمد فراد، ودعا لـ محمد فراد رجل اسمه ألاجة محمد … فألاجة محمد هو المؤسس الحقيقي لجماعة سموها أمة الإسلام». |
| WEAK | ar, en | ولما عاد تبرّأ من مبادئ «أمة | "The Nation's racist principles" is a judgement on an organisation with no attribution in its own sentence; it rests on the blanket sentence 2 ("the dates and judgements below are his"). Sentences 8 and 9 name the speaker again; this one does not. | Window 00:18:30: «أعلن براءته من مبادئ حركة أمة الإسلام العنصرية». |
| WEAK | ar, en | ويقول السويدان إنه صار رمزًا لنضال | The killing by "three of the movement's followers" is attributed, and the window says it. A careful reader will still object: this is from general knowledge, not from any source in the record, and I have not checked it here, but two of the three men convicted were cleared by a New York court in 2021. The only source for the event is a lecture that the source record says is "not independent corroboration of historical events". | Window 00:23:30: «قام ثلاثة مجرمين من جماعة ألا يجه محمد من أمة الإسلام قاموا بإغتياله». `data/source/assabile-tareq-al-suwaidan.yaml`, summary. |

Small point, not counted: the Arabic lead spells the first name two ways, «مالكولم إكس» in sentence 1 and «مالكوم ليتل» in sentence 3.

## Outside the leads (not counted in the totals)
- `person/ibn-taymiyya`: `summary.ar` is unreadable mojibake; `summary.en` carries a death date and burial place that contradict the lead (both described above).
- `person/umar-ibn-al-khattab`: data `died` has `hijri: "0023-11"` (the eleventh month) while its own note, the lead and both pages read say Dhu al-Hijja (the twelfth).
- `event/hijra`: data `date.end` (24 September, 12 Rabi' al-Awwal) agrees with neither date the lead now gives from the Raheeq.
- Evidence files: the Umar file's statement that no local Bukhari with standard numbering exists is contradicted by the Hijra file, which used one.
