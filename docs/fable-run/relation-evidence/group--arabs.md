# group/arabs

Neighbours before: 0. Relations added: 5.

The prose is a restatement of the Encyclopaedia of Islam article (its front matter gives `source_lang: en`). Each paragraph ends with one cite token, which covers the sentences of that paragraph.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| lived_in -> place/jazirat-al-arab | «وكان مداه يتوقف على ظروف معينة، وعلى الضغط السكاني المتكرر في الجزيرة، الذي يتزايد مع تراجع الزراعة وتجارة القوافل والحج.» English of the same sentence: "its extent depended on particular circumstances and on the recurrent pressure of population in Arabia". Same paragraph: «وجاءت تنوخ وأسد من شرق الجزيرة إلى سهوب الفرات الأدنى قبل العصر الساساني، ثم تبعتهم نزار من وسط الجزيرة وغربها» | {cite:encyclopaedia-of-islam-2 vol. 1 p. 551} | content/ar/group/arabs.md, section «توسع العرب عامة، والهلال الخصيب»; content/en/group/arabs.md, section "The expansion of the Arabs: general, and the Fertile Crescent" |
| has_part -> group/banu-hilal | «فأرسل الخليفة، بنصيحة اليازوري، البدو العرب الذين كانوا شرقي النيل ضده، ومنحهم سلفًا ما يفتحونه من المدن والأرياف. وكانت بنو هلال وبنو سليم، من نسل مضر، قد سكنت نجدًا، ثم شمال الجزيرة والبادية السورية» | {cite:encyclopaedia-of-islam-2 vol. 1 p. 557} | content/ar/group/arabs.md, section «الزحف الهلالي» |
| has_part -> group/banu-sulaym | the same two sentences; also «ومرّت بنو هلال وبنو سليم بمصر في القرن الخامس الهجري قبل هجومهم على شمال أفريقيا.», which follows «وظهر العرب في تاريخ مصر قبائل تُحشد عند الأزمات وتُعاقب أحيانًا.» | {cite:encyclopaedia-of-islam-2 vol. 1 p. 557}; the second sentence {cite:encyclopaedia-of-islam-2 vol. 1 p. 555-556} | content/ar/group/arabs.md, sections «الزحف الهلالي» and «فتح العرب للمحروسة ⁦(مصر)⁩ واستيطانها» |
| participated_in -> event/conquest-of-egypt | «وفي آخر سنة 18هـ ⁦(639م)⁩ ظهر جيش عربي على الحدود السورية المصرية، وانتزعت معاهدة في 20 ربيع الآخر 20هـ ⁦(9 أبريل 641م)⁩ البلاد من الحكم البيزنطي، وصمدت الإسكندرية نحو ثمانية عشر شهرًا أخرى.» | {cite:encyclopaedia-of-islam-2 vol. 1 p. 555-556} | content/ar/group/arabs.md, section «فتح العرب للمحروسة ⁦(مصر)⁩ واستيطانها» |
| participated_in -> event/hilali-into-ifriqiya-440 | «ففي منتصف القرن الخامس الهجري خرج المعز أمير بني زيري على الخليفة الفاطمي المستنصر، فأرسل الخليفة، بنصيحة اليازوري، البدو العرب الذين كانوا شرقي النيل ضده، ومنحهم سلفًا ما يفتحونه من المدن والأرياف.» | {cite:encyclopaedia-of-islam-2 vol. 1 p. 557} | content/ar/group/arabs.md, section «الزحف الهلالي» |

How the targets were identified:

- place/jazirat-al-arab is the published record of the Arabian Peninsula («جزيرة العرب», "Jazirat al-Arab (the Arabian Peninsula)"). In this prose «الجزيرة» in the quoted paragraph is the Peninsula (the English has "Arabia"); elsewhere in the same file the word also names Upper Mesopotamia, which is why the English is quoted beside it. A second record for the same region exists, place/arabian-peninsula ⁦(a Wikidata card whose Arabic summary reads «موقع في الإمارات العربية المتحدة»)⁩; the published, sourced record was chosen.
- group/banu-hilal and group/banu-sulaym: labels «بنو هلال» and «بنو سليم»; each record's own summary calls the tribe one of the great «أحياء العرب». `has_part` is the inverse name of `part_of` (group to group), the predicate the sub-tribes of Hilal already use (`group/riyah-arabs part_of group/banu-hilal`).
- event/conquest-of-egypt is «فتح مصر والإسكندرية» (year 20 AH in its own sources).
- event/hilali-into-ifriqiya-440 is «أول دخول العربان إلى إفريقية»; its own summary tells the same episode (the Zirid al-Mu'izz drops the Fatimid al-Mustansir, who sends an army of Arabs against him, 440 AH).

Looked for and not found as records:
- the battle of Qarqar (854 BC) and the battle of Raphia (217 BC): `ls data/event | grep -iE "qarqar|raphia"` gives nothing.
- the Nabataeans, the Lihyanites and Qedar as groups: `ls data/group | grep -iE "nabat|anbat|lihyan|qedar|kedar"` gives nothing (there is a `polity/nabataean-kingdom`, but the prose names the people, and no predicate was a clear fit).

Could have been added but the record does not state it in so many words, or does not cite it:
- `has_part` to group/kinda, group/tanukh, group/ghassan, group/banu-lakhm, group/abd-al-qays, group/akk, group/judham, group/juhayna, group/tayy, group/banu-tamim, group/al-azd, group/qays-aylan, group/riyah-arabs. All are named in the cited prose inside the history of the Arabs, and all are real records, but the sentences tell their movements and do not say "an Arab tribe" the way the Hilal and Sulaym passage does. They are candidates for a later pass if the lead accepts the section context as enough; each target's identity would still need checking against its own record.
- `spoke -> language/arabic`. Only the data summary says «الجماعات الناطقة بالعربية», and that summary says of itself that it came from a Wikidata description and was «لم تُراجع على صفحات المصدر بعد»; source/wikidata is not in this record's `sources:` list, so no relation was written on it.
- concept/ayyam-al-arab. The prose says «تُدرج النزاعات بين القبائل البدوية تحت «أيام العرب»» {cite:encyclopaedia-of-islam-2 vol. 1 p. 550-551}; no registered predicate from a group to a concept says "is the name given to their battles".
