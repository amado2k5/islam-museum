# Relation verification

Relations checked: 82. SUPPORTED 65, STRETCHED 16, UNSUPPORTED 1.

Verifier: fresh context, read-only, 11 November 2026. Baseline for 'was it in the record before today': commit e1d721298ab4b2494a4c8f04d3defcde1808b939.

## How the verdicts were reached

- Every relation was read against the record's Arabic prose, its English prose and its data file, and the target record was opened. All 82 quoted sentences are in the records. The prose of 22 of the 25 records is unchanged since the baseline; the three leads rewritten today (Dome of the Rock, Taj Mahal, Kiswa) were compared with the baseline text.
- `npx tsx scripts/fable/check-relations.ts` on the 25 records: every added relation passes (registered predicate, classes fit, real target, sources in the record's own list, no edge written twice, none already written from the other side). Its three failures are `related_to` edges that were in the files before this run.
- No target is a namesake or the wrong record, and no direction is wrong. The failures are all of one kind: the edge says more than the sentence, or the sentence has no citation of its own.
- SUPPORTED includes edges where the nearest registered predicate says less than the sentence, or is entailed by it. They are listed below so they can be re-sorted if a stricter line is wanted.
- STRETCHED is used where the predicate claims something the sentence does not entail, where a fact true of one time or one stage is written as an undated edge, or where the evidence is a data note or summary with no citation of its own.

## Not supported or stretched, in one place

| Record | Relation | Verdict |
|---|---|---|
| building/sulaymaniyya-mosque | `patronized_by` -> person/sulayman-al-qanuni | STRETCHED |
| object/kiswa | `made_in` -> place/mecca | STRETCHED |
| work/alf-layla-wa-layla | `translation_of` -> work/hazar-afsan | STRETCHED |
| work/alf-layla-wa-layla | `mentioned_in` -> work/al-fihrist | STRETCHED |
| concept/arabesque | `exemplified_by` -> building/masjid-ibn-tulun | STRETCHED |
| practice/eid-al-fitr | `based_on` -> concept/ramadan-fiqh | STRETCHED |
| practice/eid-al-fitr | `based_on` -> passage/quran-108-2 | STRETCHED |
| concept/al-hadith-al-nabawi | `has_part` -> concept/kutub-al-sitta | STRETCHED |
| concept/al-hadith-al-nabawi | `basis_for` -> concept/ibada | STRETCHED |
| concept/sharia | `has_part` -> concept/madhhab | STRETCHED |
| concept/sharia | `has_part` -> concept/ijtihad | STRETCHED |
| period/abbasid-fragmentation | `has_part` -> event/death-of-mutawakkil | UNSUPPORTED |
| period/abbasid-fragmentation | `has_part` -> event/buyid-entry-baghdad-334 | STRETCHED |
| period/buyid-seljuk-fatimid-era | `has_part` -> event/buyid-entry-baghdad-334 | STRETCHED |
| period/buyid-seljuk-fatimid-era | `has_part` -> event/abbasid-khutba-egypt-567 | STRETCHED |
| period/buyid-seljuk-fatimid-era | `has_part` -> group/al-fatimiyun | STRETCHED |
| period/modern-era | `has_part` -> event/abolition-caliphate-1342 | STRETCHED |

## Supported, but the loosest of the supported

These pass, each with a caveat written in its row: building/masjid-sultan-hasan `during_reign` (entailed, never literal); building/taj-mahal `exemplifies` chaharbagh (said of its garden); building/dome-of-the-rock `located_in` place/al-aqsa-mosque (the lead links the building record, the edge the place record); object/kiswa `written_about_by` al-Azraqi (second-hand); concept/arabesque `influenced_by` (said of style B, as its birth); concept/masjid-umum `exemplified_by` (an origin, not an example); concept/imama `influenced` (proxy predicate); concept/umma `has_part` mumin (membership); group/arabs `lived_in` (by implication); object/mushaf-birmingham `exemplifies` mushaf (leaves, not a codex); event/battle-of-nahrawan `had_participant` Hujr ibn Adi (the record's summary spells the name differently).

## building/hassan-ii-mosque
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `located_in` -> place/casablanca | SUPPORTED | Arabic lead: «جامع في الدار البيضاء افتُتح سنة 1993م» {cite:wikidata}. Prose unchanged since the baseline. Target is the city of Casablanca. |
| `built_by` -> person/hassan-ii-of-morocco | SUPPORTED | Section «الأثر»: «بناه الملك الحسن الثاني بأيدي ستة آلاف صانع مغربي» {cite:wikidata}. The record's own verb is 'built'. Target is King Hassan II of Morocco, r. 1961-1999. |

## building/masjid-sultan-hasan
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `located_in` -> place/cairo | SUPPORTED | Lead: «مسجد ومدرسة في القاهرة بدأ السلطان حسن عمارته سنة 757هـ» {cite:khitat-maqrizi-1998 p.2111}; the record's own wikilink on the city is place/cairo. |
| `during_reign` -> polity/mamluk-sultanate | SUPPORTED | «يعدّ يومانز جامع السلطان حسن ... أعظم روائع المماليك المعمارية», dated 1356-1361 {cite:yeomans-islamic-cairo-2006 p.154-155}, and «نضج العمارة المملوكية» {p.162}. The record never writes 'sultanate' or 'in the reign of'; the edge is entailed (a Mamluk masterpiece built by a reigning sultan), not literal. Target is the Cairo sultanate of 1250-1517, not a namesake. |
| `exemplifies` -> concept/iwan | SUPPORTED | «وفي قلبه مخطط صليبي ناضج بأربعة إيوانات عملاقة على صحن مكعب عميق» {cite:yeomans-islamic-cairo-2006 p.156, p.161}; the next sentence has its qibla iwan exceed the Taq-i Kisra. Same use of the predicate as other buildings in the graph (a building that shows the element). Target is the architectural iwan. |
| `written_about_by` -> person/al-maqrizi | SUPPORTED | «يذكر المقريزي أن العمارة استمرت ثلاث سنين لا تنقطع» {cite:khitat-maqrizi-1998 p.2111}. Target is Taqi al-Din al-Maqrizi, the author of the Khitat. |
| `mentioned_in` -> work/art-and-architecture-of-islamic-cairo | SUPPORTED | «يعدّ يومانز جامع السلطان حسن ... أعظم روائع المماليك المعمارية وأكبر جوامع القاهرة وأفخمها» {cite:yeomans-islamic-cairo-2006 p.154-155}. The work record is Yeomans, Garnet 2006, the same book as the cited source. |

## building/sulaymaniyya-mosque
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `located_in` -> place/istanbul | SUPPORTED | Lead: «جامع سليمان القانوني في إسطنبول بناه سنان سنة 1557م» {cite:wikidata}; the record's own wikilink is place/istanbul. |
| `built_by` -> person/mimar-sinan | SUPPORTED | Same sentence: «بناه سنان سنة 1557م» {cite:wikidata}. The record says only 'Sinan'; for the mosque of Suleiman in 1557 that is Mimar Sinan, and none of the other Sinans in data/person fits (atik-sinan is a century earlier). |
| `patronized_by` -> person/sulayman-al-qanuni | STRETCHED | The one cited sentence says «جامع سليمان القانوني ... بناه سنان»: Suleiman's mosque, built by Sinan. 'For Suleiman' appears only in summary.en, a data field with no citation. That is possession or dedication, not patronage: the record nowhere says he ordered, paid for or sponsored it, and gives no dates for him. The evidence file concedes it ('does not say in so many words that he ordered it'). Target itself is the right Suleiman. |

## building/dome-of-the-rock
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `located_in` -> place/al-aqsa-mosque | SUPPORTED | In the record at the baseline: lead «قبة الصخرة في صحن المسجد الأقصى في القدس» {cite:wikidata}, and summary.ar «قبة الصخرة في صحن المسجد الأقصى؛ وصفها المقدسي» {cite:ahsan-al-taqasim p. 144}. I read al-Muqaddasi's scan p.143: the mosque's paved court, the platform in its middle and the domes on it. Target is the site record, whose summary says the name covers the whole walled enclosure; place/western-wall is already part_of it. Two caveats, neither changes the verdict: today's lead links the words to building/al-aqsa-mosque, not to this place record; and another source the record cites (Qabbani p.163) treats al-Aqsa as a separate mosque built «بالقرب من ساحة مسجد قبة الصخرة». |
| `commissioned_by` -> person/abd-al-malik-ibn-marwan | SUPPORTED | The sentence is only in today's lead: «ويذكر محمد قباني أن عبد الملك بن مروان أمر سنة 72هـ ببناء مسجد فوق الصخرة» {cite:umayyad-birth-to-fall-2006 p.163, p.161}. The baseline record named no builder. It is not from memory: the source was already in the record's sources list at the baseline, and I read the page in the local scan. p.163: «مسجد قبة الصخرة: أمر عبد الملك بن مروان سنة 72هـ ببناء مسجد فوق الصخرة»; p.161: «مسجد قبة الصخرة الذي أنشأه عبد الملك بن مروان في القدس». The predicate's Arabic label is the same verb, «أمر ببناء». |
| `written_about_by` -> person/al-muqaddasi | SUPPORTED | Baseline section «وصف المقدسي»: «وصفها المقدسي لما رآها نحو سنة 375هـ» {cite:ahsan-al-taqasim p. 144}. Target is the geographer, author of the cited book. |
| `mentioned_in` -> work/ahsan-al-taqasim | SUPPORTED | The same baseline description, cited to this work {cite:ahsan-al-taqasim p. 144}; today's lead names the work in words: «ووصفها المقدسي في أحسن التقاسيم». |
| `written_about_by` -> person/ibn-fadl-allah-al-umari | SUPPORTED | Baseline section «صفتها سنة 743هـ عند العمري»: «يصف ابن فضل الله العمري في مسالك الأبصار المسجد الأقصى والصخرة» {cite:umari-masalik-1924 p.177, p.178}; the record's own wikilinks are the two targets. |
| `mentioned_in` -> work/masalik-al-absar | SUPPORTED | Same baseline sentence and citation as the edge above; the work is named and linked in the record. |

## building/taj-mahal
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `located_in` -> place/agra | SUPPORTED | Baseline lead: «ضريح في آغرة بناه شاه جهان لزوجته ممتاز محل» {cite:wikidata}, linked to place/agra; summary.ar «ضريح بناه شاه جهان في آكره» {cite:brookes-gardens-of-paradise-1987 p.152, p.154}. |
| `built_by` -> person/shah-jahan-mughal | SUPPORTED | Baseline section «البناء والبستان عند بروكس»: «يذكر جون بروكس أن شاه جهان بنى التاج ذكرى لزوجه ممتاز محل» {cite:brookes-gardens-of-paradise-1987 p.151, p.152, p.154}, with the record's own link to this person. |
| `burial_place_of` -> person/shah-jahan-mughal | SUPPORTED | Baseline section «موضعه من البستان»: «ودُفن شاه جهان بجوار زوجه فيه سنة 1666م» {cite:brookes-gardens-of-paradise-1987 p.159}. |
| `exemplifies` -> concept/chaharbagh | SUPPORTED | Baseline: «يقوم الضريح على منصة ... فوق مستوى البستان الرباعي» {cite:brookes-gardens-of-paradise-1987 p.152, p.154}, linked to concept/chaharbagh. The record calls the Taj's garden a chaharbagh; it says this of the garden, not of the tomb, and the same paragraph says the tomb is not at the garden's centre. Supported if the garden is read as part of the record, as its two section titles do. Loose. |

## object/al-mushaf-al-azraq
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `exemplifies` -> concept/kufic-script | SUPPORTED | Section «وصفه»: «في كل صفحة خمسة عشر سطرًا من الكوفي بحبر الذهب محدَّد بالسواد» {cite:blair-islamic-calligraphy-2006 p. 126, p. 166}. |
| `exemplifies` -> concept/mushaf | SUPPORTED | Same sentence: «كان مصحفًا في سبعة أجزاء على رق مصبوغ بالنيلي» {cite:blair-islamic-calligraphy-2006 p. 126, p. 166}. Target is the term mushaf. |
| `written_about_by` -> person/sheila-blair | SUPPORTED | «بحسب شيلا بلير كان مصحفًا في سبعة أجزاء» {cite:blair-islamic-calligraphy-2006 p. 126, p. 166}; the record's own wikilink is the target. |
| `mentioned_in` -> work/islamic-calligraphy-blair | SUPPORTED | The same sentences are cited to Blair 2006, and the work record is that book (Sheila Blair, Islamic Calligraphy, 2006). |

## object/kiswa
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `mentioned_in` -> work/masalik-al-absar | SUPPORTED | Baseline section headed «في «مسالك الأبصار» للعمري», every sentence of it cited to umari-masalik-1924 pp.137-139. |
| `written_about_by` -> person/ibn-fadl-allah-al-umari | SUPPORTED | Baseline: «يجمع ابن فضل الله العمري أخبار كسوة الكعبة» {cite:umari-masalik-1924 p.137}, with the record's own link; and «ويروي أنه تولّى بيده خلع الكسوة العتيقة وإلباس الجديدة في حجه سنة 738هـ» {p.138}. |
| `written_about_by` -> person/al-azraqi-muhammad-ibn-abd-allah | SUPPORTED | Baseline: «ثم ما حكاه الأزرقي من أن معاوية كساها الديباج» {cite:umari-masalik-1924 p.138}, «وينقل عن الأزرقي عن ابن جريج أن تبّعاً أول من كساها كسوة كاملة» {p.139}. Second-hand: the citation is al-Umari quoting al-Azraqi, and the record's verb is 'related', not 'wrote'. The wikilink to this person was added in today's lead; the target, the third-century historian of Mecca, is the al-Azraqi meant. |
| `made_in` -> place/mecca | STRETCHED | Section «الأثر»: «تصنع اليوم في دار كسوة الكعبة بأم الجود» {cite:wikidata}, and summary «إلى مصنع مكة الحديث». That is true of today. The same record says that in al-Umari's time it was «تُحمل من الخزانة السلطانية بمصر مع الركب» and that the ruler of Yemen sent another. made_in takes no date, so the edge reads as the object's origin; only the relation's note keeps the time. Mildest of the stretched. |

## object/minbar-kutubiyya
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `made_in` -> place/cordoba | SUPPORTED | Lead: «منبر خشبي مرصّع بالعاج صنعته ورش قرطبة سنة 1137م لجامع الكتبية في مراكش» {cite:wikidata}. 'Made by the workshops of Cordoba' and then sent to Marrakesh is 'made in Cordoba'. Target is Cordoba in al-Andalus. |
| `exemplifies` -> concept/minbar | SUPPORTED | Same sentence: it is a minbar, «أجمل منبر إسلامي باقٍ» {cite:wikidata}. Target is the pulpit as an element of the mosque. |

## object/mushaf-birmingham
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `exemplifies` -> concept/hijazi-script | SUPPORTED | Lead: «رقوق قرآنية مكتوبة بالحجازي في جامعة برمنغهام» {cite:wikidata}. |
| `exemplifies` -> concept/mushaf | SUPPORTED | Same sentence: «فهي من أقدم أوراق المصحف المعروفة» {cite:wikidata}; the record's label is «مصحف برمنغهام». It is leaves of a mushaf, not a whole codex; slightly loose. |

## work/alf-layla-wa-layla
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `translation_of` -> work/hazar-afsan | STRETCHED | What the record says: al-Mas'udi «ذكر كتباً منقولة من الفارسية، منها «هزار أفسانه» ... وقال إن الناس يسمونه «ألف ليلة وليلة»» {cite:muruj-al-dhahab p.550}; and Abbott's six stages begin with «ترجمة من القرن الثامن لـ«هزار أفسانه»» {cite:encyclopaedia-of-islam-2 vol. 1 p. 380-386}, followed by an Islamised version, a ninth-century composite with Arabic material, Ibn Abdus, an Egyptian stage and a last one. So the record supports 'began as a translation of' and 'al-Mas'udi identifies the two'; it does not say the work it goes on to describe (Baghdad and Cairo layers, an eighteenth-century Egyptian recension) is a translation. The record's own label treats the two titles as one work, while the edge treats Hazar Afsan as a separate source. |
| `mentioned_in` -> work/muruj-al-dhahab | SUPPORTED | Section «عند المسعودي»: «في سنة 332هـ ذكر المسعودي ... وقال إن الناس يسمونه «ألف ليلة وليلة»» {cite:muruj-al-dhahab p.550}: the title is named in the cited work. |
| `mentioned_in` -> work/al-fihrist | STRETCHED | What the record says the Fihrist mentions is Hazar Afsan, «ويذكر ابن النديم في «الفهرست» «هزار أفسان» ويلخص إطارها الحكائي» {cite:encyclopaedia-of-islam-2 vol. 1 p. 380-386}, and al-Jahshiyari's unfinished book of a thousand tales {cite:fihrist-ibn-al-nadim p.423}. It never says the Fihrist names Alf Layla wa-Layla. Hazar Afsan has its own record, built from Fihrist pp. 422-423, and it is the target of the edge above: if it is a separate work, the Fihrist's mention belongs to it. The record does present the Fihrist as a witness to the collection, «وبعد المسعودي و«الفهرست» ذكر المؤرخ المصري ...», so stretched, not unsupported. |
| `mentions` -> person/shahrazad | SUPPORTED | «خبر الملك والوزير وابنته وجاريتهما، وهما شيرزاد ودينازاد» {cite:muruj-al-dhahab p.550}; «وفارسية كشهرزاد ودينازاد» {cite:encyclopaedia-of-islam-2 vol. 1 p. 380-386}. Target is the figure of the frame story. |
| `mentions` -> person/harun-al-rashid | SUPPORTED | «وتتركز نوادر الحكام على خلفاء بني العباس، وأشهرهم هارون الرشيد» {cite:encyclopaedia-of-islam-2 vol. 1 p. 380-386}. |

## concept/islamic-calligraphy
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> concept/kufic-script | SUPPORTED | The record's one cited sentence: «وتنوعت خطوطه بين الكوفي والنسخ والثلث والديواني» {cite:wikidata}: 'its scripts' are named as its kinds. |
| `has_part` -> concept/naskh-script | SUPPORTED | Same sentence, «... والنسخ ...» {cite:wikidata}. Target is the naskh script. |
| `has_part` -> concept/thuluth-script | SUPPORTED | Same sentence, «... والثلث ...» {cite:wikidata}. Target is the thuluth script. |
| `has_part` -> concept/divani-script | SUPPORTED | Same sentence, «... والديواني» {cite:wikidata}. Target is the divani script. |

## concept/arabesque
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `influenced_by` -> concept/samarran-stucco-styles | SUPPORTED | «يرى يومانز أن مولد الأرابيسك الإسلامي يُشهد في طراز سامراء الثاني» {cite:yeomans-islamic-cairo-2006 p.37}, the record's own link being the target. 'Born in' entails 'influenced by'; the edge says less than the sentence. The target covers styles A, B and C; the record says B. |
| `exemplified_by` -> building/masjid-ibn-tulun | STRETCHED | «ويُرى هذا الطراز في موضعه في بطون عقود جامع ابن طولون» {cite:yeomans-islamic-cairo-2006 p.38, p.39}. 'This style' is the Samarra style of the sentence before. The record never calls the soffits arabesque or the mosque an example of the arabesque; the edge takes two steps (the arabesque is born in style B; style B survives at Ibn Tulun). What the sentence does say is already an edge: building/masjid-ibn-tulun exemplifies concept/samarran-stucco-styles. The Ibn Tulun record itself never uses the word arabesque. |
| `mentioned_in` -> work/art-and-architecture-of-islamic-cairo | SUPPORTED | «يرى يومانز أن مولد الأرابيسك الإسلامي ...» {cite:yeomans-islamic-cairo-2006 p.37}; the work record is that book. |

## concept/masjid-umum
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `exemplified_by` -> building/prophets-mosque | SUPPORTED | «من مسجد النبي في المدينة تطورت بنيته» {cite:wikidata}. The record names the Prophet's mosque as a mosque and as the model the plan grew from. It states an origin, not 'an example'; the edge says less than the sentence. Loose. |
| `has_part` -> concept/minbar | SUPPORTED | «تطورت بنيته حول المصلى والقبلة والمنبر والصحن» {cite:wikidata}: the minbar is named as an element of the structure. |

## practice/eid-al-fitr
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `based_on` -> concept/ramadan-fiqh | STRETCHED | Rests only on summary.ar, «عيد انقضاء صيام رمضان في أول شوال», a data field with no citation of its own. No cited sentence of the prose mentions Ramadan: the cited lead says only «يوم الفطر أول شوال». 'The festival at the end of the fast' is an occasion, not a basis. The target is the legal entry on the month, used because no predicate links a practice to practice/sawm-ramadan. Weakest of the stretched; close to unsupported. |
| `based_on` -> passage/quran-108-2 | STRETCHED | «وفرض كفاية عند الحنابلة لقوله», followed by the words of Q 108:2 {cite:fiqh-mawsua-kuwaitiyya-noor-v3 p.11984}. What the record says: the verse is the Hanbali evidence for one ruling, the communal obligation of the Eid prayer, which belongs to both Eids. The edge makes the verse a basis of the festival of Eid al-Fitr. The perspective tag and the note narrow it, but the predicate still says more than the sentence. The target verse is the right one. |

## concept/al-hadith-al-nabawi
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> concept/kutub-al-sitta | STRETCHED | «وقد جُمع في مصنفات مرتبة على الأبواب أو على مسانيد الرواة، وأشهرها الكتب الستة»: in the prose section «طريق وصوله» and in summary.ar this sentence has no citation. The only source list is on education.did_you_know, [sahih-al-bukhari, sahih-muslim], and those two books cannot attest a later term that counts them among six; the relation repeats that attribution. 'Gathered in compilations, the best known being the Six Books' is also not 'has the Six Books as a part'. |
| `basis_for` -> concept/ibada | STRETCHED | «يبيّن مجمله ويقرر تفاصيل العبادة والمعاملة والسيرة والأخلاق»: predicate and target fit the words. But the prose sentence in section «مكانته» and summary.ar are uncited; the only source list is the same did_you_know one, which the clause about the Six Books shows to be the record's list carried over, not a citation of the sentence. The record's provenance calls the text «صياغة المتحف». Stretched on citation alone. |

## concept/imama
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `influenced` -> group/imamiyya | SUPPORTED | «يصف أحمد أمين الإمامة بأنها الملوّن لعقيدة الإمامية» and «أهم مسألة يدور عليها كلام الإمامية. فهي مركز بحوثهم» {cite:duha-islam p.850}. 'That which colours their creed' is a statement of shaping. A proxy predicate, since nothing says 'central doctrine of'; the edge says less than the sentence. |
| `mentioned_in` -> work/al-kafi | SUPPORTED | «ويصف الكافي الإمامة بأنها «منزلة الأنبياء وإرث الأوصياء ...»» {cite:duha-islam p.850-852}. Second-hand, and the record says so: «من كتاب الكافي للكليني كما ينقله أحمد أمين». Target is al-Kulayni's al-Kafi, not the two other works of that name. |
| `mentioned_in` -> work/duha-al-islam | SUPPORTED | Lead: «الإمامة، كما يعرضها أحمد أمين في ضحى الإسلام، أهم مسألة يدور عليها كلام الإمامية» {cite:duha-islam p.850}. |
| `written_about_by` -> person/ahmad-amin | SUPPORTED | «يصف أحمد أمين الإمامة بأنها الملوّن لعقيدة الإمامية» {cite:duha-islam p.850}. Target is the author of Duha al-Islam. |

## concept/sharia
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> concept/ibada | SUPPORTED | The record's one sentence: «الإطار المعياري الإسلامي الجامع للعبادة والمعاملة والأخلاق» {cite:wikidata}: the framework 'that takes in worship'. |
| `has_part` -> concept/madhhab | STRETCHED | Same sentence, second half: «وتتنوع فيه المذاهب والاجتهادات» {cite:wikidata}, 'the schools and the interpretations vary within it'. That schools differ within the Sharia is not the statement that the madhhab is a part of the Sharia; on the madhhab's page the edge would read 'part of the Sharia', which the sentence does not say. |
| `has_part` -> concept/ijtihad | STRETCHED | Same clause, «وتتنوع فيه المذاهب والاجتهادات» {cite:wikidata}. As for madhhab; and the sentence's word is the plural, the differing opinions, while the target is ijtihad as the jurist's method. |

## concept/umma
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `mentioned_in` -> work/quran | SUPPORTED | The record's one sentence: «مفهوم مركزي في القرآن» {cite:wikidata}. |
| `has_part` -> concept/mumin | SUPPORTED | Same sentence: «جماعة المؤمنين الواحدة عابرة الأجناس والأمصار» {cite:wikidata}. The record defines the umma as the community of the believers; has_part encodes that membership and says no more. The target is the term 'believer'. Loosest of the supported. |

## group/arabs
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `lived_in` -> place/jazirat-al-arab | SUPPORTED | By implication, not in so many words: «الضغط السكاني المتكرر في الجزيرة» as what drove the Arabs' expansion, and «وجاءت تنوخ وأسد من شرق الجزيرة ... ثم تبعتهم نزار من وسط الجزيرة وغربها» {cite:encyclopaedia-of-islam-2 vol. 1 p. 551}. The only sentence that says it outright is the summary, which is uncited and was rightly not used. Target is the sourced record of the Peninsula. |
| `has_part` -> group/banu-hilal | SUPPORTED | Section «الزحف الهلالي»: «فأرسل الخليفة ... البدو العرب الذين كانوا شرقي النيل ضده ... وكانت بنو هلال وبنو سليم، من نسل مضر، قد سكنت نجدًا» {cite:encyclopaedia-of-islam-2 vol. 1 p. 557}: the Arab nomads sent are named in the next sentence as Hilal and Sulaym. |
| `has_part` -> group/banu-sulaym | SUPPORTED | Same two sentences {cite:encyclopaedia-of-islam-2 vol. 1 p. 557}; also «ومرّت بنو هلال وبنو سليم بمصر» straight after «وظهر العرب في تاريخ مصر قبائل» {p. 555-556}. |
| `participated_in` -> event/conquest-of-egypt | SUPPORTED | «ظهر جيش عربي على الحدود السورية المصرية، وانتزعت معاهدة ... البلاد من الحكم البيزنطي، وصمدت الإسكندرية نحو ثمانية عشر شهرًا أخرى» {cite:encyclopaedia-of-islam-2 vol. 1 p. 555-556}, under a heading that calls it the Arabs' conquest of Egypt. Target is the conquest of Egypt and Alexandria of 20 AH. |
| `participated_in` -> event/hilali-into-ifriqiya-440 | SUPPORTED | «خرج المعز أمير بني زيري على الخليفة الفاطمي المستنصر، فأرسل الخليفة ... البدو العرب الذين كانوا شرقي النيل ضده» {cite:encyclopaedia-of-islam-2 vol. 1 p. 557}. The target event tells the same episode (al-Mu'izz ibn Badis, al-Mustansir, an army of Arabs). |

## period/abbasid-fragmentation
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> event/death-of-mutawakkil | UNSUPPORTED | The only words are start.note: 'Conventional start: the troubles after the murder of al-Mutawakkil; scholars place the transition differently.' The record puts the period after the murder and says the boundary is disputed; it does not say the murder belongs to the period. A data note with no citation; the prose says of the boundaries «وضعها المتحف للتنظيم وليست قطعية». The relation's sources, Hodgson and Hourani, are cited by the record only as further reading, not for this. The event record has no periods field of its own. |
| `has_part` -> event/buyid-entry-baghdad-334 | STRETCHED | end.note: 'The Buyids enter Baghdad.' The event closes the period; the record does not say it belongs to it. Uncited curatorial note, borrowed sources, as above. The event's own periods field lists only the next period, its own date is 17 January 946 while this period ends in 945, and the next period now claims the same event as a part. |

## period/buyid-seljuk-fatimid-era
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> event/buyid-entry-baghdad-334 | STRETCHED | start.note: 'Starts when the Buyids enter Baghdad'. The best of the period edges: the event opens the period, and the event's own periods field names this period. But it is still an uncited curatorial note, the prose saying «وهذه الحدود وضعها المتحف للتنظيم وليست قطعية», and Hodgson and Hourani are attached to the relation though the record cites them only as further reading. |
| `has_part` -> event/abbasid-khutba-egypt-567 | STRETCHED | start.note: 'ends with the fall of the Fatimid caliphate'. The record names no event. The agent matched the phrase to the end of the Fatimid khutba in 567 by the year and the death of al-Adid; the match is sound, but it is the agent's, not the record's. Boundary event, uncited note, borrowed sources; and the event's own periods field lists only period/crusades-ayyubid-mamluk. |
| `has_part` -> group/al-fatimiyun | STRETCHED | summary.ar, also the first line of the prose, neither cited: «حكمت أسر كالبويهيين والفاطميين والسلاجقة». Houses that ruled in these centuries are not said to be parts of the period, and the Fatimid house (909 to 1171 in its own record) begins before the period does (945). Sources on the relation are the record's further-reading pair. |

## event/battle-of-nahrawan
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `occurred_at` -> place/al-nahrawan | SUPPORTED | «وثبت قوم فساروا إلى النهروان وتعرضوا للسبيل، فسار إليهم علي فقتلهم» {cite:tarikh-khulafa-minhaj-1434 p. 294}. Target is the town on the Nahrawan canal east of Baghdad. |
| `had_participant` -> person/ali-ibn-abi-talib | SUPPORTED | Lead: «هي قتال علي بن أبي طالب الخوارج الذين خرجوا عليه بعد التحكيم», with the record's own link; «فسار إليهم علي فقتلهم» {cite:tarikh-khulafa-minhaj-1434 p. 294}. |
| `had_participant` -> group/khawarij | SUPPORTED | «يذكر السيوطي أن الخوارج خرجوا بعد التحكيم ... وثبت قوم فساروا إلى النهروان ... فسار إليهم علي فقتلهم» {cite:tarikh-khulafa-minhaj-1434 p. 294}. |
| `had_participant` -> person/abdallah-ibn-wahb-al-rasibi | SUPPORTED | «النهروان كانت في شعبان سنة ثمان وثلاثين، وقُتل فيها عبد الله بن وهب الراسبي» {cite:tarikh-khalifa-umari-1985 p. 197}. Target's own summary has him lead the Kharijites to Nahrawan in 38. |
| `had_participant` -> person/dhu-al-thudiyya | SUPPORTED | «فسار إليهم علي فقتلهم، وقُتل منهم ذو الثدية، سنة 38هـ» {cite:tarikh-khulafa-minhaj-1434 p. 294}. |
| `had_participant` -> person/abu-ayyub-al-ansari | SUPPORTED | Section «المعركة»: «وعلى الخيل أبا أيوب الأنصاري» and «وأرسل أبا أيوب يرفع راية أمان» {cite:sallabi-ali-vol2 p. 177}. I could not open that volume; the same passage in the author's other edition (sallabi-ali-tawzi-2004, scan p.643) reads the same. |
| `had_participant` -> person/qays-ibn-sad | SUPPORTED | «وعلى أهل المدينة قيس بن سعد» {cite:sallabi-ali-vol2 p. 177} and «وكان على ميمنة علي قيس بن سعد» {cite:tarikh-khalifa-umari-1985 p. 197}. The record gives no grandfather's name; the other edition's page prints «قيس بن سعد بن عبادة», which is the target. |
| `had_participant` -> person/hujr-ibn-adi | SUPPORTED | «وجعل على الميمنة حجر بن عدي» {cite:sallabi-ali-vol2 p. 177}. Caveat for the lead: the record's own summary, from the author's other edition, names the same commander «حجر بن علي», and that is what the page image of that edition prints (scan p.643, printed p.639). I could not open vol. 2 to see whether it prints «عدي» or the prose corrected it. The edge stands on the prose sentence as cited. |
| `had_participant` -> person/maqil-ibn-qays | SUPPORTED | «وعلى الميسرة شبث بن ربعي ومعقل بن قيس» {cite:sallabi-ali-vol2 p. 177}. The other edition prints «معقل بن قيسى الرياحى», which matches the target, Ma'qil ibn Qays al-Riyahi, one of Ali's commanders. |
| `had_participant` -> person/shabath-ibn-ribi | SUPPORTED | Same sentence: «وعلى الميسرة شبث بن ربعي» {cite:sallabi-ali-vol2 p. 177}. The other edition's page prints the same name; the record's summary garbles it as «شبث بن ربيعة». |

## period/modern-era
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `has_part` -> event/abolition-caliphate-1342 | STRETCHED | start.note: 'From the abolition of the caliphate to the Iranian revolution; conventional boundaries.' The summary puts the period after the event: «السنوات التي أعقبت إلغاء الخلافة العثمانية سنة 1924». A boundary marker in an uncited curatorial note; Hodgson and Hourani are on the relation though the record cites them only as further reading. In its favour: the event's own periods field lists this period, and the years agree. |

## polity/delhi-sultanate
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `had_capital` -> place/delhi | SUPPORTED | Lead: «سلطنة قامت سنة 1206م وانتهت سنة 1526م، وعاصمتها دلهي» {cite:wikidata}; the record's own wikilink is place/delhi, not new-delhi or old-delhi. |

## polity/seljuk-empire
| Relation | Verdict | Why (quote what the record actually says) |
|---|---|---|
| `had_capital` -> place/nishapur | SUPPORTED | Lead: «إمبراطورية قامت سنة 1037م وانتهت سنة 1194م، وعاصمتها نيسابور» {cite:wikidata}; the record's own wikilink is the target. The edge says exactly what the record says. That the record gives the empire a single capital is thin (its Urdu summary hedges it), but that is a question about the record, not about the edge. |

## Other things seen while checking (no verdict depends on them)

- Period edges: all six carry `sources: [source/hodgson-1974, source/hourani-1991]`. The three period records cite those two books once, as further reading, and say in their own prose that the boundaries are the museum's convention. Whatever is kept, those two sources do not attest the edges.
- event/buyid-entry-baghdad-334 is now written as a part of two successive periods.
- event/battle-of-nahrawan: the data summary and the prose name Ali's commanders differently. Checked on the page image of sallabi-ali-tawzi-2004 (scan p.643): it prints the right-wing commander with the patronymic «على», and the left wing as «شبث بن ربعى» and «معقل بن قيسى الرياحى». The prose, citing the other edition (vol. 2 p. 177), has «حجر بن عدي». One of the two readings needs a look at vol. 2.
- building/dome-of-the-rock: today's lead links «المسجد الأقصى» to building/al-aqsa-mosque while the new edge points to place/al-aqsa-mosque. Two records carry the same name; the graph already treats the place record as the enclosure.
- practice/eid-al-fitr: the prose section «صلاة العيد» carries the words of Q 108:2 typed inside guillemets. It was there before this run; the rule is that Qur'an text is referenced by passage, not typed.
- polity/delhi-sultanate and polity/seljuk-empire: each new `had_capital` restates the record's own `capitals:` field, which the graph build does not turn into an edge. building/taj-mahal likewise has `location:` and `patron:` fields beside its new edges.
- work/alf-layla-wa-layla: the record's label joins the two titles as one work, while work/hazar-afsan is a separate record. The two stretched edges on this record both come from that unresolved question.
