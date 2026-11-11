# Noticed while reading: problems outside the run's scope

The delegated writers, graph editors and adjudicators read about 150 records closely. Each was told to change only
what its task covered and to report anything else that looked wrong. This file is those reports, grouped by record.

**Nothing here was fixed by this run** unless the line says so. None of it is counted in the 122 contradictions of the
sweep: these were found by a reader, not by a detector. They are written down so that none is silently left. Each line
is a reader's observation, with the page they read; it has not been re-verified by a second reader.

## Patterns that reach many records

- **An earlier date-enrichment pass.** 5,836 person records carry dates noted "Date-enrichment pass". Most of the 70 contradictions that stand registered come from one of these dates disagreeing with the record's own cited source. In 86 to 88 records the date's own note names one year ("source: ~650") while the `edtf` holds another (625~); in about 45 sampled the `edtf` was 18 to 30 years earlier. This looks like a column shift in that pass. (Adjudicators, batches 2, 3 and 4.)
- **Page numbers of al-Raheeq al-Makhtum.** Records cite at least three paginations of this book; the scan the source record names is a fourth. Facts were found in the local copy 1 to 8 pages away from the cited page. (Prose writers, batches 1 and 2.)
- **Page numbers that are scan pages, not printed pages**, without saying so: Nafh al-Tib in `event/fall-of-granada-897` (scan 529-531 is printed 525-527); Shadharat al-Dhahab cited by printed page in one record and PDF page in two others; the Fihrist cited by the old Cairo print's pages against the edition the source record describes; the Kuwaiti fiqh encyclopaedia cited by pages of one unverified 18,079-page file.
- **Typed Qur'an wording in body sections** (outside the leads): `event/first-revelation`, `event/battle-of-badr`, `practice/hajj` («حكمه»), `practice/eid-al-fitr` («صلاة العيد»). The validator's bracket rule does not catch wording in guillemets.
- **Judgements resting on a database citation**: "most famous Islamic building in the world" and "symbol of India, love and death" (`building/taj-mahal`), "symbol of civil rights" (`person/malcolm-x`), each cited to Wikidata. The first and third were dropped from the leads; the second is in a body section.
- **Narrators written as participants.** `event/qaratis-dinar-crisis` lists the narrator Awana ibn al-Hakam as `had_participant`; al-Mada'ini the same elsewhere.
- **The Abyssinia roster.** `event/return-of-abyssinian-emigrants` carries Ibn Ishaq's whole roster (80 persons by `participated_in`), including people he lists as having died in Abyssinia. Four more are undetected because their death dates are late enough: `person/abdullah-ibn-al-harith-sahmi`, `person/adi-ibn-nadla`, `person/al-muttalib-ibn-azhar`, `person/ubaydullah-ibn-jahsh`.
- **Doubled links.** Nine events write `related_to -> person` while the person writes `participated_in -> event` for the same link (for example `treaty-with-taghlib`, `faryani-mahdi-848`, `letter-of-himyar-kings`). `event/battle-of-badr` writes several `had_participant` edges that the persons also write.
- **Predicate gaps.** No registered predicate runs period to polity or building, object to building (the Kiswa to the Kaaba, a minbar to its mosque), building to building, practice to practice, or says "branch of". The period schema has unused `defining_events` and `parent_period` fields.

## Probable duplicate records

- `place/dome-of-the-rock` and `building/dome-of-the-rock` (the English search for "Dome of the Rock" returns the place record first).
- `person/selim-i-uthmani` and `person/selim-i-ottoman`.
- `person/omar-mukhtar` and the stub `person/umar-al-mukhtar`.
- `place/arabian-peninsula` and `place/jazirat-al-arab` (the first one's Arabic summary reads "a site in the United Arab Emirates").
- `person/ibn-abdus-al-jahshiyari` and `person/al-jahshiyari-abu-abd-allah-muhammad-ibn-abdus`.
- `person/damat-ibrahim-pasha` mixes two viziers; `person/nevshehirli-damat-ibrahim-pasha` also exists.
- Almohads: `abu-dabbous` and `al-wathiq-abu-dabus`; `al-rashid-almohad` and `abd-al-wahid-ibn-idris-almohad`; `al-mamun-almohad` and `idris-ibn-yaqub-almohad`; `al-said-ali-almohad`, `said-al-mutadid-almohad` and `al-mutadid-almohad`; `abd-al-wahid-ii-almohad` duplicates `abd-al-wahid-al-makhlu-almohad` in content under a different label.
- The same book under two source ids: `usd-al-ghaba` and `usd-ghaba`.
- `concept/mahdiyya` and `concept/al-mahdi` (related, perhaps deliberately separate).

## One record holding two people

- `person/al-mustakfi-billah`: label, lead and dates (1285-1340) are the Cairo caliph, who also has `person/al-mustakfi-i-cairo`; its `successor_of`, its ruler role of 944-946 and seven events mean the Baghdad caliph, who has no record. Seven contradictions stand registered on it.
- `person/ibn-al-khashab`: a 4th-century reciter carrying the dates of the grammarian of the same name (1099-1172).
- `person/al-qasim-ibn-muhammad`: the Arabic summary carries two sentences about a different al-Qasim (d. 108 AH).
- `person/ibn-sayyid-al-nas-al-akbar`: `born_in` and `died_in` Cairo "from Wikidata" beside `died_in` Tunis; the Cairo links, and probably the Wikidata id, look like the grandson's.
- `person/al-wathiq-ibrahim-cairo`: `died: 1386` looks like his namesake al-Wathiq Umar's year.

## By record

**Tour stops**

- `building/kaaba`: says the Kaaba was built on Abraham's "third journey"; the cited book numbers it the fourth. "Qusayy's five offices": the local copy lists six.
- `event/first-revelation`: status line says the date was checked at p.64 while the prose cites p.66; the local copy has "the eleventh of Ramadan" on a later page against the twenty-first.
- `person/khadija`: "two or three months" after Abu Talib where the page says "about two months, or three days"; the data summary says Usd al-Ghaba "reports a group" where Ibn al-Athir says it himself; two sources cited with no page.
- `event/hijra`: end date 24 September 622 with Hijri 12 Rabi' I while its own note implies Friday 27 September; Quba arrival is the 12th in the body, Monday the 8th in al-Raheeq; the «الأهمية» section is uncited.
- `event/battle-of-badr`: two malformed citations (`{cite:... ; cite:...}`), one naming a source not in the record's list; «فرسان فقط» should be "one horse or two".
- `concept/five-pillars`: a quotation cited to Ibn Khuzayma p.192 is not on that page (corrected in the lead; the same mis-citation remains in «تفصيل الأركان»).
- `event/conquest-of-mecca`: data gives the entry as 20 Ramadan 8 AH; the copy read gives Tuesday 17 Ramadan; `summary.en` has Arabic sentences pasted into it; the Urdu file still opens without a heading.
- `person/abu-bakr`: «رأيتني وإني رابع الإسلام» is given to Abu Bakr where the page's speaker is Amr ibn Abasa; a garbled Arabic clause in the Encyclopaedia section; the Prophet's death dated 13 Rabi' I here and the 12th in `person/muhammad`.
- `practice/hajj`: provenance says the record rests on Bukhari 8, 46 and 50 but no prose cites al-Bukhari.
- `practice/salah`: the `did_you_know` fact has no page and was not found on the cited pages.
- `person/muhammad`: "c. 570" beside the source's April 571; Arabic "once" against English "twice" (the page has "only twice").
- `work/quran`: «للدارسين» states the twenty-three years and the gathering under Uthman with no source.
- `person/umar-ibn-al-khattab`: `died.hijri` is month 11 while its note says Dhu al-Hijja; the summary says he was a soothsayer where the page says that is what he thought of the recitation; mother's name bint Hisham against bint Hashim on the pages.
- `person/ali-ibn-abi-talib`: lineage cited to pp. 880-886 but found on p.871; "in the mosque of Kufa" cited to the wrong book; `periods` lists only the prophetic era.
- `person/aisha`: the Encyclopaedia section credits the wrong author (a merged index entry); "more than two thousand hadith" where the page reads 1210; the `spouse_of` note contradicts the record's own sections; a page-form al-Bukhari citation.
- `building/dome-of-the-rock`: al-Maqdisi "saw it around 375" where 375 is the year he finished the book; several page numbers off by one to seven; `built.note` says the date needs a second source while citing one; `status.generated_by` still says "no prose yet".
- `person/umar-ibn-abd-al-aziz`: the day of the pledge conflicts between sources and within one of them; `died_in` points at the Church of Saint Simeon Stylites from Wikidata where the source says only Dayr Sim'an near Homs.
- `place/baghdad`: `founded` credits 762 to a page that gives no founding date.
- `person/al-bukhari`: «أمير المؤمنين في الحديث» is cited to a Fihrist entry that does not contain it (dropped from the lead; still in the data summary); «أعلم من دخل نيسابور» where the page reads «العراق».
- `building/al-azhar`: Encyclopaedia page numbers drift by one to three pages; «بيبرس» for Taybars and «الهلالي» for al-Hilli; one section says the founding is undated and the next dates it.
- `place/cairo`: the Golius paragraph says the city was named after Fatima where Golius says that of the dynasty; the English file lacks the Golius paragraphs.
- `person/al-khwarizmi`: a Muruj citation matches no local scan; «للدارسين» gives 232 AH against the lead's 235.
- `person/malik-ibn-anas`: "about 636 hadiths" where the page has no "about".
- `person/ibn-sina`: a Latin sentence rendered as "more than a lifetime could count" where it says his works outnumber the years of his life; birthplace differs between two cited sources; "lived 53 years" conflicts with 370-428; a link to the stub `person/al-ghazali` instead of the record.
- `person/al-ghazali-abu-hamid`: ten years in Damascus in one source, two in another section; the vizier named differently in two sections.
- `work/ihya-ulum-al-din`: an attribution to al-Nawawi rests on a marginal note where the main text says «قيل».
- `person/ibn-rushd`: the data summary repeats a claim that he "translated Aristotle into Arabic".
- `event/sack-of-baghdad-656`: the data summary cites a source not in the record's list; "their treasuries were thrown into the Tigris" should be the books in them; the relation role «الوزير الخائن» is a judgement in the museum's voice.
- `person/baybars`: the `kids` text says "second Bahri Mamluk sultan" against fourth and third in two cited sources.
- `person/ibn-taymiyya`: `summary.ar` is unreadable (double-encoded); a death date in the data summary looks like another person's entry; several page numbers off.
- `person/ibn-battuta-muhammad`: death given as 779 in one section and 776 in the lead and data; the "117,000 km" figure has no citation.
- `person/ibn-khaldun`: joined Abu Inan at the end of 757 in the record, 756 on the page.
- `event/conquest-constantinople-857`: the date and the length of the siege differ by source and are not reconciled; an English label contains Arabic.
- `event/fall-of-granada-897`: `date.start` has `precision: month` though a day is given.
- `person/sulayman-al-qanuni`: a revolt dated 926 AH where the page says 1526 CE; the birth year is cited to a book that does not give it; no English label.
- `building/taj-mahal`: completion is 1653 in the data, 1654 in a cited book; two wikilinks resolve only to stubs.
- `person/ahmed-iii-uthmani`: the old English lead had the succession reversed (fixed in the lead); the cited pages do not state his father.
- `person/mahmud-ii-uthmani`: the English «Dress and reform» section says "replacing the fez with the turban", which is reversed; no English label.
- `person/malcolm-x`: `summary.en` is just "Malcolm X."; "left school" where the transcript says expelled.
- `object/kiswa`: "two hundred craftsmen" rests on a database citation.

**Other records**

- `object/minbar-kutubiyya`: El Badi Palace Museum in Arabic and data, "Bahia Palace Museum" in English.
- `object/ardabil-carpet`: the Arabic summary and second paragraph are garbled.
- `work/alf-layla-wa-layla`: al-Mas'udi's date is 332 AH in one place and 336 AH in another.
- `event/battle-of-nahrawan`: the data summary garbles three commanders' names against its own prose.
- `concept/sharia`, `concept/umma`: `summary.en` is a single word. `concept/imama`: the prose refers to "the data summary".
- `group/arabs`: the summary still calls itself an unchecked database card while the record is published with full prose.
- `polity/delhi-sultanate`, `polity/seljuk-empire`, `polity/timurid-empire`: status notes mention fields that do not exist; two Urdu summaries carry a citation token inside the data.
- Period records: both neighbouring periods give 945 for the Buyid entry where the event record's own date is January 946; `polity/ghaznavid-empire` (962-1187) is listed under a period that ends in 945.
- `person/al-mutadid-billah-cairo`: the summary places the killing of Sultan al-Mansur Abu Bakr in his days where the source puts it under his predecessor.
- `person/al-wathiq-umar-cairo`: 19 Shawwal in English and prose where the source and the Arabic summary say the 29th.
- An adhan innovation event is dated about 786 AH where its own cited page says Sha'ban 791 AH, three years after the caliph it is placed under died.
- `person/al-hakim-bi-amr-illah-ii`: `died_in -> place/qus` rests on a phrase about his father.
- `person/abu-al-hasan-al-shirji-al-faradi`: `died: 1425` for a man a writer of 476 AH calls his own shaykh.
- `person/abu-al-husayn-ahmad-ibn-muhammad-al-kazaruni`: born 49 years before his teacher's recorded birth.
- `person/al-mustansir-billah-egypt`: ruler role ends in 1262 where the death now recorded falls in November 1261.
- `person/al-mustansir-fatimid`: carries `died 1094` from the enrichment pass; the fuller death notice displaced from his namesake belongs here.
- `person/al-adil-abdallah-almohad`, `person/yahya-ibn-al-nasir`: `died: 621~` against their own reigns of the 1220s.
- `person/al-mahdi`: Hijri death day the 7th where its own note implies the 22nd or 23rd.
- `person/sad-ibn-amr-ibn-haram`: three relations sourced to a source not in its list, with raw YAML in their notes.
- `person/fatima-bint-safwan`, `person/umm-harmala-bint-abd-al-aswad`: role `returnee` though both died in Abyssinia; the first is born 615~ yet emigrated as a wife.
- `person/ibn-al-raffa-qari` and `person/ibn-al-khashab`: `student_of` and `teacher_of` both written between them.
- Al-Jawhari's prose gives Abu Ali al-Farisi's death as 356 AH (as its cited source prints) against 377 AH on his own record.
- `event/loss-of-merida-626`, `event/siege-of-alaro-1229`: generated `sides` name a wrong party; one side is labelled "The defenders of Loss".
- `person/mohamed-abdullahi-mohamed`: `born_in -> place/mogadishu` is written twice.
- The canon carries `person/ibn-al-athir-al-jazri`, who is Majd al-Din the hadith scholar; the historian, author of al-Kamil, is `person/ibn-al-athir-izz-al-din` and is not in the canon.
