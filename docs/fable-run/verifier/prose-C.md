# Prose verification, batch C

Records checked: 13. Sentences read: 230 (115 Arabic, 115 English). Source pages opened: about 105 (most read in full, some by targeted line extraction; one page image). Findings: 1 ERROR, 10 WEAK, 2 MISMATCH.

Checks run on all thirteen leads, both languages:

- `python3 scripts/fable/o03_tour_prose.py <id>`: GREEN for each; last column "-" (no citation outside the baseline source list) for each.
- Arabic and English carry the same citations in the same order in every record (compared by script; `ص` against `p.` in person/abu-bakr only).
- No typed honorific, no Qur'an bracket, no Qur'an wording (the hajj lead gives 3:97 as a link only), no blocked organisation.
- Every Arabic parenthesis that holds Arabic script has the U+2066 / U+2069 isolates; no isolates around a non-Arabic parenthesis.
- Every `[[class/slug|...]]` target exists; each target's label was read to rule out namesakes (for example `person/al-mustansir-billah-egypt` is al-Mustansir II of Cairo, `person/katip-celebi` is Hajji Khalifa).
- Every date in each lead was compared with the page it is cited to; none is converted or invented.
- `git diff` against the baseline: only the lead section changed in each prose file; each data file gained one `provenance.lead_deepened` line (hajj and al-azhar also a `wings` change, not prose).

Not on this machine, so not checked by me either: `ibn-sad-tabaqat-bewley`, `ibn-hisham-sira`, `fiqh-al-sira-al-ghazali`, the `sahih-al-bukhari` printing behind «3», the MacTutor page, the al-Suwaidan recording, and the printing of al-Raheeq al-Makhtum whose page numbers the Khadija record uses.

## person/aisha
Checked: baseline Arabic and English prose in full, data file in full (perspectives, faith, born, died). Fada'il al-Sahaba pp. 1097, 1098, 1099, 1100. EI2 vol. 1 PDF pp. 329, 330.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «ثم عاشت في المدينة أكثر من عشرين سنة وتصالحت مع علي» / "She then lived in Medina for over twenty years and was reconciled with Ali"; also the sentence before it («وبعد مقتل عثمان خرجت إلى البصرة ...») | On a subject where Sunni and Shia accounts differ, these two sentences are in the museum's own voice with only a citation. At the baseline the same statements stood inside a section headed as the Encyclopaedia's account and introduced by «تذكر المقالة». Sentences 4 and 9 of the lead keep "the article says"; 6, 7 and 8 do not. | EI2 p. 330: "became reconciled to 'Ali" is the article's own characterisation. Baseline section «حساب موسوعة الإسلام». |
| WEAK | ar, en | «وتذكر المقالة أن أكثر من ألف حديث رُويت عنها» / "The article says more than a thousand hadiths" | The sentence is right against the page, but the record now contradicts itself about the same article: the unchanged section «حساب موسوعة الإسلام» still says «وتذكر المقالة أن أكثر من ألفي حديث رُويت عنها» ("more than two thousand"), with the same citation, and «الحياة» and `education.did_you_know` also say two thousand. | EI2 p. 330: "It is said that I210 traditions were related on her authority, but barely 300 of these were retained" (OCR prints 1 as I). `content/ar/person/aisha.md` line 51, `content/en/person/aisha.md` line 50. |

The three points asked about:
- Verdict in the museum's voice: none found. The Battle of the Camel is told without a judgement («معلنةً الطلب بثأره» / "professing"); the slander episode and the merit drawn from it are attributed to the article and to the editor.
- Judgements attributed: yes for sentences 2, 3, 4, 5, 9, 10. Not in the text for 6, 7, 8 (first row above).
- Statement of faith or school: none added about her. The baseline lead's Sunni-attributed sentence is reworded from the data file's Sunni perspective («تُجلّها السنة أماً للمؤمنين ومن أهم رواة الحديث»), and "most learned women of the first Islamic century" is replaced by the editor's «أفقه نساء المسلمين», which is on p. 1097. The data file's Twelver Shia perspective is not in the lead (the evidence file says why: its source is not in the record's list), so the lead carries a Sunni voice and an academic voice only.

Not a finding: the lead does not name the article's author. The baseline record's «وقد وقعها ش. بيلا» is wrong on the page: "(CH. PELLAT)" on p. 330 closes the next article, 'A'isha bint Talha.

## person/abu-bakr
Checked: baseline Arabic prose (headings of all sections; «لقباه», «إسلامه», «خلافته», «وفاته» and the three Encyclopaedia sections in full), data file (summary, issue, perspectives, sources). Usd al-Ghaba pp. 700, 701, 711, 712, 713. EI2 vol. 1 PDF pp. 128, 129, 130.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «ولما توفي النبي قال رجل من الأنصار ... ثم بايع الناس أبا بكر يوم سقيفة بني ساعدة» / "then the people pledged allegiance to Abu Bakr on the day of the Saqifa" | Supported word for word by one report on the page, but stronger than the page as a whole, and in the museum's voice (the sentence does not say "Ibn al-Athir relates"). The same page, in the same paragraph as "Umar was the first to pledge", separates the Saqifa pledge from the general pledge the next day and lists those who held back. On the one question where the record's own `issue` says the traditions differ, the lead keeps one half of the page. | Usd al-Ghaba p. 712: «وكانت بيعته في السقيفة يوم وفاة رسول الله ثم كانت بيعة العامة في الغد. وتخلف عن بيعته: علي، وبنو هاشم، والزبير بن العوام، وخالد بن سعيد بن العاص، وسعد بن عبادة ... ثم إن الجميع بايعوا بعد موت فاطمة ... إلا سعد بن عبادة ... بعد ستة أشهر على القول الصحيح». |
| WEAK | ar, en | «وكان من رؤساء قريش في الجاهلية، وسبق إلى الإسلام، وذهب جماعة من العلماء، منهم ابن عباس، إلى أنه أول من أسلم» / "a number of scholars, Ibn Abbas among them, held that he was the first to do so" | On the page and attributed, so not unsupported. But it is a statement about priority in Islam that the baseline lead did not make, it is one of the points on which Sunni and Shia accounts differ, and the lead gives one side only. A source the record already cites qualifies it, and the Tour's own Khadija lead quotes the same book saying no man or woman preceded her. The baseline section «إسلامه» also has the narrower «أول من أسلم من الرجال». | Usd al-Ghaba p. 701 (as quoted). EI2 p. 128: "According to some traditions he was the first male Muslim after Muhammad ... but this may simply be a reflection of his later preeminence, since the same claim is made for 'Ali and Zayd b. Haritha." Usd al-Ghaba p. 1502 (Khadija): «أول خلق الله أسلم بإجماع المسلمين، لم يتقدمها رجل ولا امرأة». |

The three points asked about:
- Verdict in the museum's voice: no explicit verdict on the succession. «والخليفة بعده» is given as Ibn al-Athir's entry has it; the pilgrimage of 9 AH and the leading of prayer are given as the Encyclopaedia's statement, and the lead leaves out the article's "he was marked as successor". The Saqifa sentence is the exception described above: no verdict, but one-sided and unattributed.
- Judgements attributed: yes for 1, 5, 7; reasons for the two titles (2, 3) are carried from the baseline section «لقباه» in the same wording.
- Statement of faith or school: no school. The conversion and priority clause in sentence 4 is new to the lead (second row above).

Every other fact was found on the page named: entry 3067 and the lineage at the foot of p. 700; the three explanations of «عتيق» and the five quoted words on p. 701; the four quoted words on p. 712; Jumada al-Akhira 13 AH, sixty-three years, Umar's prayer on p. 713; "22 Djumada II, 13/23 August 634, and was buried beside Muhammad" on EI2 p. 130.

Note: the lead cites `usd-al-ghaba`; the data file's `sources:` lists `usd-ghaba` (a second id for the same book). The oracle passes because the baseline prose already used `usd-al-ghaba`.

## person/khadija
Checked: baseline Arabic prose (sections «الحياة», «الأثر», the three Raheeq sections, «للدارسين»), data file (`died`, relations, sources). Usd al-Ghaba p. 1502. Al-Isaba pp. 1854, 1856. Al-Raheeq al-Makhtum, local copy, pp. 60, 65, 115.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «ويقول صاحب «الرحيق المختوم» إنها بقيت معه ربع قرن» / "The author of al-Raheeq al-Makhtum writes that she stayed with him a quarter of a century" | The sentence is new to the record and its page number was not read. The words are on p. 115 of the local copy; the lead cites p. 116, the record's number for the paragraph before, in a printing the writer says he did not see. The same holds, as carried locators, for the other five Raheeq citations (p.60, p.61, p.67, p.116): in the copy that can be read the passages are on pp. 60, 60, 65, 115. | Local Raheeq p. 115: «بقيت معه ربع قرن تحن عليه ساعة قلقه، وتؤازره في أحرج أوقاته ... وتواسيه بنفسها ومالها». Evidence file, row 10: "I did not see p.116 of the cited edition". |
| WEAK | ar, en | «وتوفيت في رمضان من السنة العاشرة ... بنحو شهرين، وقيل بثلاثة أيام» / "about two months after the death of Abu Talib, or by another report three days" | Right against the page, but the record now contradicts itself with the same citation: the unchanged section «وفاتها» still says «بنحو شهرين أو ثلاثة» ("two or three months"). | Local Raheeq p. 115: «وبعد وفاة أبي طالب بنحو شهرين أو بثلاثة أيام ـ على اختلاف القولين». `content/ar/person/khadija.md` line 34, `content/en/person/khadija.md` line 31. |

Everything else was found where the evidence file says: lineage, "first woman he married" and the consensus sentence on Usd al-Ghaba p. 1502 (the last attributed to Ibn al-Athir, as it should be); al-Hujun and the funeral prayer on al-Isaba p. 1856; the trade, the two months, forty years, no other wife, all children but Ibrahim, the return from Hira and Waraqa on the local Raheeq pp. 60 and 65. `ibn-hisham-sira`, `fiqh-al-sira-al-ghazali` and `sahih-al-bukhari 3` are carried and were not opened by the writer or by me.

## concept/five-pillars
Checked: baseline lead. Sahih al-Bukhari (al-Bugha scan) p. 14, hadith 8 and the editor's note. Sahih Ibn Khuzayma pp. 192, 906. Ibn Rajab, Jami' al-'Ulum wa-l-Hikam pp. 75, 121, 122.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «وفي شرحه لحديث جبريل يقسّم هذه الأعمال ... وما تركّب منهما كالحج» / "and one compounded of both, such as the hajj" | Broader than the page: Ibn Rajab limits the compound case to the pilgrim who comes from far. | Ibn Rajab p. 75: «وإلى ما هو مركَّبٌ منهما: كالحجّ بالنسبة إلى البعيد عن مكّة». |

Note on the evidence file, not on the lead: it says p. 192 of Ibn Khuzayma "has «شهادة أن لا إله إلا الله» without «وأن محمداً رسول الله»". That is true of hadith 308 only. Hadith 309, on the same page, has «شهادة أن لا إله إلا الله، وأن محمداً رسول الله ... وحج البيت، وصوم رمضان». So the second half of the testimony is on p. 192, and the hajj-before-fast order is on p. 192 as well as p. 906. The lead's sentence 3 remains true.

## practice/hajj
Checked: baseline lead and section «حكمه», data file (`scriptural_basis`, relations). Kuwaiti Encyclopaedia of Fiqh, pages.json pp. 6836, 6837, 6838, 6839, 6840.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| MISMATCH | en | "Among its purposes the encyclopaedia names the gathering of Muslims ... where they come to know one another and differences ... fall away" | The English drops «ويتآلفون». Arabic: «فيتعارفون ويتآلفون، وتذوب بينهم فوارق ...». | p. 6840: «فيتعرف بعضهم على بعض، ويألف بعضهم بعضا». |

Not counted: sentence 3 states the ruling («فرض عين على كل مكلف مستطيع») in the museum's voice with a citation only. It is carried word for word from the baseline section «حكمه», and sentences 4 to 8 attribute what follows to the encyclopaedia and to the named jurists.

## place/baghdad
Checked: baseline prose (lead, «بغداد وزيج السند هند», «للدارسين»), data summary. Ahsan al-Taqasim scan pp. 12, 106, 107, 108. Le Strange, printed pp. 15 to 19 (in `inventions/b94-le-strange-layout.txt`). The saved TDV page `inventions/b94-tdv-bagdat.html` (headnote, section I, the markets paragraph). `khwarizmi-mactutor` not on this machine.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «وظلت مركز الخلافة منذ تأسيسها إلى سقوط الدولة العباسية سنة 1258م» / "It remained the seat of the caliphate from its foundation until ... 1258 CE" | In the museum's voice, and stronger than the article taken whole. It restates the article's opening sentence, but the same article says further down that the caliphs resided at Samarra from 836 to 892. A careful reader will call "from its foundation until 1258" wrong. | TDV section I, first paragraph: «Kuruluşundan Abbâsî Devleti'nin yıkılışına (1258) kadar hilâfet merkezi olarak kalan Bağdat»; later: «Halifelerin Sâmerrâ'da oturdukları dönemde (836-892) Bağdat onların fazla ilgisini çekmedi». |
| MISMATCH | ar | «ويعرّفها مدخلها في الموسوعة الإسلامية التركية بأنها من أهم مراكز التاريخ والعلم والثقافة» | Arabic says "among the most important centres"; English says "one of the important centres". The source has the English sense, so the Arabic is also stronger than the source. | TDV headnote: «İslâm dünyasının önemli tarih, ilim ve kültür merkezlerinden biri». |

All other facts were found on the pages named, including 145 (A.D. 762), the double wall and four gates, 146 (A.D. 763) and "both banks of the Tigris" in Le Strange; 773 and the move to Karkh in TDV; the questions about winter and summer, the jurists and Abu Hanifa, 145 and 149 AH, «هواء رقيق، وعلم دقيق», «فأما المدينة فخراب» and 375 AH in al-Maqdisi.

## person/al-bukhari
Checked: baseline lead, section «مؤلفاته», data file (`summary`, `born`, `died`). Al-Subki vol. 2 scan pp. 13, 14, 16, 18, 22, 24, 25 (printed 2, 3, 5, 7, 11, 13, 14), and the page image `pages-png/p0025.png`. EI2 vol. 1 PDF pp. 1360, 1361. Fihrist scan pp. 317, 318 (printed 321, 322).

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| ERROR | ar, en | «وكان قد بلغ اثنتين وستين سنة غير ثلاث عشرة ليلة» / "He had reached sixty-two years less thirteen nights" | The cited page says twelve nights, not thirteen. The number is carried from the data file's `died.note`; the evidence file says it was "read on the page, printed p.14". The OCR of that line is garbled («غير ملتى عشرة ليلة»), and the page image reads «غير ثنتى عشرة ليلة»: a short word ending in ى, with no alif and no lam, which cannot be «ثلاث». | `tabaqat-shafiiyya-subki/AAlexandrina-149925/pages-png/p0025.png`, the line «... شوال سنة ست وخمسين ومائتين وكان بلغ عمره اثنتين وستين سنة غير ثنتى عشرة ليلة». The scan is bitonal; I read the word at five times enlargement. I have not seen another printing. The same wrong number is in `data/person/al-bukhari.yaml`, `died.note`. |
| WEAK | ar, en | «وأشهر كتبه «الصحيح»» / "His best-known book is the Sahih" | A "most famous" in the museum's own voice. It is the Encyclopaedia's phrase, cited but not attributed in the sentence. | EI2 p. 1360: "His most famous work is the Sahih which took him sixteen years to compile." |

Everything else was found on the page: name and «صاحب الجامع الصحيح» (al-Subki p. 2); 194, orphan, first hearing 205, set out 210 (p. 3); the pilgrimage with mother and brother (p. 5); 600,000 and sixteen years (p. 7 and EI2); envy (pp. 11, 13 and EI2); Khartank, the night of the Fitr, Shawwal 256 (p. 14 and EI2); the Fihrist's «من علماء المحدثين الثقات» and its list of books; "just one among others ... at the head of collections of Sunni tradition" (EI2 p. 1361). The removal of «أمير المؤمنين في الحديث» is right: the Fihrist entry does not have it.

## building/al-azhar
Checked: baseline lead, the Arabic file for 665/1266. Hasan Ibrahim Hasan scan p. 403. Khitat scan pp. 1030, 1031, 1032. EI2 vol. 1 PDF pp. 862, 863, 865. Yeomans printed p. 55 (PDF p. 64).

No finding. Every sentence was found on the page named, with the dates as printed (24 Jumada I 359/4 April 970; 7 Ramadan 361/22 June 972; 818/1415-6; 1953; 30,000 and 4,500). The 1260 of Yeomans against the Encyclopaedia's 665/1266 is disclosed in the evidence file and the lead gives 1260 as Yeomans's.

## work/ihya-ulum-al-din
Checked: baseline lead. Kashf al-Zunun pp. 221, 222, 223. Majmu' al-Fatawa vol. 10 pp. 551, 552. The Ihya' file pp. 9 to 18 (by phrase).

No finding. Note only: on Kashf p. 221 the saying about the books of Islam stands in the text as «قيل فيه»; the attribution to al-Nawawi is the author's marginal note, reported in the editors' footnote 3. "Hajji Khalifa reports from al-Nawawi" rests on that note.

## person/baybars
Checked: baseline lead (four paragraphs). Shadharat al-Dhahab PDF pp. 299, 358. Al-Suyuti, Tarikh al-Khulafa' pp. 720, 721, 723, 728. Yeomans printed pp. 127, 129 (PDF pp. 136, 138).

No finding. The correction of «وهذا حكم ابن العماد» to a quotation from al-'Ibar is right (p. 358: «قاله في العبر»), and the corrected al-Suyuti locators (721 for the killing of Qutuz, 728 for Nubia) match the pages.

## person/ibn-khaldun
Checked: baseline lead. Al-Daw' al-Lami' part 4 pp. 145, 146, 147, 148. Ibar pp. 2058, 2059, 2121. Muqaddima pp. 3, 22, 48, 652. Mawsu'a vol. 8 p. 407.

No finding. Not counted: "Maliki judge" names an office given on al-Daw' 4/146 («قضاء المالكية بالديار المصرية»); it is not an inferred school, though the baseline lead had no such word.

## person/sulayman-al-qanuni
Checked: baseline lead, section «الفتوح», the al-Suwaidan section in both languages. Al-Sallabi pp. 198, 200, 201, 202, 276. The al-Suwaidan recording is not on this machine.

| Severity | Language | Sentence (first words) | What is wrong | Evidence |
|---|---|---|---|---|
| WEAK | ar, en | «ثم شنّ حرباً كبيرة على رودس ابتداء من منتصف سنة 1522م» / "He then waged a great war on Rhodes from the middle of 1522 CE" | «ثم» / "then" follows a sentence that ends with the Egyptian revolt of 930 AH, which the page dates 930/1524. The war on Rhodes began two years before it. The book treats the revolts first by theme, not by date; the baseline section «الفتوح» had no "then". The two calendars hide the slip. | Al-Sallabi p. 200: «أحمد شاه الخائن في مصر وكان هذا عام ٩٣٠هـ / ١٥٢٤م»; p. 201: «ابتداء من منتصف عام ١٥٢٢م». |

Everything else on the page as cited, including «فرسان القديس يوحنا» (p. 201), Mohács 1526, Buda on 11 September, Vienna 1529 and the withdrawal (p. 202), the golden age (p. 202) and "historians agree" (p. 276). The reign's end is 972 on p. 202 and 974 on p. 276, as the evidence file says. Sentence 7 is carried from the record and could not be checked.

## person/mahmud-ii-uthmani
Checked: baseline lead. Al-Sallabi pp. 339, 340, 341, 374, 548, 549.

No finding. "Son of Abd al-Hamid I" is carried from the baseline lead and is not on p. 548, as the evidence file says. The judgement in sentence 7 is marked as al-Salabi's own.

## Outside the brief

- Ten of the thirteen records still carry `status.review: published` (all but khadija, hajj and baghdad) while their `provenance.lead_deepened` line says the new lead is "AI text awaiting a human read".
- The author's name is spelled "Al-Sallabi" in the English lead of person/sulayman-al-qanuni and "Al-Salabi" in person/mahmud-ii-uthmani.
