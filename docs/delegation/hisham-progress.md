# Ibn Hisham Lane — Progress

**Lane:** hisham
**Book:** السيرة النبوية لابن هشام — الجزء الرابع (السقا والأبياري وشلبي، 1936); printed page = PDF page - 4
**Sessions:** kiro (2026-10-11), Claude Sonnet 5.5 (2026-10-12, worktree `islam-museum-kiro`), Claude Fable 5.1 (2026-10-15, worktree `gallant-lewin-a0a7bd`, branch `content/ibn-hisham-182-358`, lane 2 of `held-back-content.md` under `docs/sources-policy.md`)

## Status

- Batches 1-3 (فتح مكة، حنين والطائف، أموال هوازن pp. 31-143): on main.
- Batch 4 (مؤتة pp. 15-30): on main.
- Batch 5 (مهاجرة الحبشة pp. 3-11):
  - 5a (Hashim, Abd Shams, Asad), 5b (Taym, Jumah, Sahm, Adi, Amir, Al-Harith) and a part of 5c: on main (thin Codex-generated person files).
  - 5c-i (0c678b7): repaired three entities clobbered by earlier thin overwrites (banu-hashim, yazid-ibn-zamaa, umm-habiba-bint-abi-sufyan), merged duplicates (event/return-from-abyssinia -> alias of event/return-of-abyssinian-emigrants; person/umm-salama-bint-abi-umayya -> alias of person/umm-salama), 9 groups, 4 events, 1 journey, 1 concept, 1 place, roster dataset `datasets/abyssinia-muhajirun-roster.csv` (86 rows).
  - 5c-ii: Abd Shams / Umayya allies / Asad / Abd al-Dar persons (21), 3 places, Ubaydullah event prose.
  - 5c-iii: Zuhra, Taym, Makhzum persons, Abdullah ibn Jafar, Muhammad ibn Abi Hudhayfa (18), places al-Qadisiyya, al-Yarmuk, al-Yamama, Ayn al-Tamr, Fahl; Ruqayya (Isaba file) gets the Abyssinia edges.
  - 5c-iv: Jumah (12) and Sahm (12) persons incl. Hatib's household, Hasana and Shurahbil, al-Saib, Umayr ibn Ri'ab, Abdullah ibn Hudhafa (Khosrow's envoy).
  - 5c-v: Adi (5), Amir (6), Al-Harith (4) persons incl. al-Nu'man ibn Adi and Salit ibn Amr, event prose for Umar's dismissal of al-Nu'man, Sawda edge, stub person/hawdha-ibn-ali-al-hanafi.
  - 5c-vi: prose for 13 clan groups and 6 allied tribes (member lists with cites), 9 thin Codex group files upgraded, roster-by-clan section in the return event prose.
  - 5c-vii: four poem works (verses of Said ibn al-As, Aban, Khalid's reply, al-Nu'man ibn Adi), text not reproduced.
  - Task A is complete for pp. 3-11 (see doubt markers below).

- Batch 6 (تبوك pp. 159-173, ends with the Abu Ruhm report; Dirar mosque 173-174 and the three 175-181 belong to batch 7), branch `content/ibn-hisham-batch-6`, pushed straight to main in sub-batches:
  - 6a: 12 places (incl. Ayla, Jarba, Adhruh, Dumat al-Jandal, al-Rabadha), groups Ghifar and Aslam, concepts takhalluf / al-bakkaun / jaysh al-usra, journey, 5 events (mobilisation, al-Jadd, 'do not march in the heat', Uthman's funding, departure and deputies). Forward references go through `data/_stubs.d/ibn-hisham.yaml` and are removed as entities are written.
  - 6b: 12 events (Suwaylim's house, the Weepers, Bedouin excuse-makers, four who lagged, Ibn Ubayy's camp, Ali and the manzila report with perspectives sunni/academic/shia-twelver marked needs_source, Abu Khaythama, al-Hijr and the rain, the strayed she-camel and Ibn al-Lusayt, Abu Dharr lagging and dying at al-Rabadha); passage edges 9:49, 9:81, 9:82 added on the passage files.
  - 6c: 8 events (mockers and 9:65, treaty of Ayla, Khalid and Ukaydir, treaty of Ukaydir, stay and return, Wadi al-Mushaqqaq, burial of Dhu al-Bijadayn, Abu Ruhm), work covenant-of-ayla (summary only), object Ukaydir's brocade coat, dataset `datasets/tabuk-participants-and-absentees.csv`, parent event/expedition-to-tabuk extended with has_part children and prose.
  - 6d: 24 persons (Abu Khaythama, the seven Weepers and Ibn Yamin, al-Jadd, Suwaylim, al-Dahhak, Siba ibn Urfuta, Umayr ibn Wahb, Zayd ibn al-Lusayt, Umara ibn Hazm, Wadia, Mukhashin, Yuhanna, Ukaydir and Hassan, Bujayr, Dhu al-Bijadayn, Abu Ruhm) and three verse works (text not reproduced). Batch 6 complete for pp. 159-173; Ka'b ibn Malik, Murara and Hilal are only named (batch 7).

- Batch 7 (مسجد الضرار pp. 173-174, الثلاثة المخلفون pp. 175-181), branch `content/ibn-hisham-batch-7`, pushed to main:
  - 7a (20c09c5): building/masjid-dirar, builders' request and demolition events, place/dhu-awan, group of the twelve builders + dataset, 11 builder persons, 3 demolition persons (Malik ibn al-Dukhshum, Ma'n and Asim ibn Adi), Wadia edges, passage edges 9:107 (explicit) and 9:108 (via 'إلى آخر القصة', needs_source).
  - 7b (428606e): parent event the-three-left-behind + 9 sub-events (return and excuses, Ka'b's delay, truthfulness, 50-night boycott, Abu Qatada, Ghassan letter, order on wives, acceptance of repentance, wealth and vow), event and dataset of the 17 prayer places Medina-Tabuk (pp. 174-175), Murara, Hilal, Abu Qatada (cousin of Ka'b), Abdullah ibn Ka'b, place/mount-sal, work of Ka'b's narration (isnad), dataset of stages. Mu'ta elegy author repointed to person/kaab-ibn-malik; duplicate stub dropped.
  - 7c: nine clan/tribe groups (Amr ibn Awf, Ubayd ibn Zayd, Dubay'a, Umayya ibn Zayd, Salim ibn Awf, al-Ajlan, Salima, Waqif, Ghassan), concepts tawba / hajr / sidq, member_of edges on persons, passage edges 9:95, 9:96, 9:117, 9:118, 9:119. No poems occur in pp. 173-181.

## Doubt markers captured so far (pp. 3-11)

- p3 «قال ابن هشام» introduces Ja'far's arrival report (Sufyan ibn Uyayna -> al-Ajlah -> al-Sha'bi).
- p3-4 «ويقال: هُمينة بنت خلف» for Khalid ibn Said's wife (Amina).
- p7 «فكان يقال: إن كان لأول رجل ورث أباه في الإسلام» (Abdullah ibn al-Muttalib).
- p7 «يشك فيه أقتل ثم أم لا» (Abdullah ibn Sufyan); editors' footnote (via al-Istiab): Hisham vs Hashim ibn Abi Hudhayfa.
- p8 «ويقال: قتل يوم خيبر، يشك فيه» (al-Sa'ib ibn al-Harith).
- p5 vs p11: Rayta bint al-Harith died in Abyssinia (p5) or on the road (p11); unresolved, recorded as debated.
- Page-image corrections: جعفر (p3, verified on image), Abu al-Rum ibn Umayr and Firas ibn al-Nadr (p7, OCR line garbled), Umm Habiba's daughter Habiba (p6).

- Batch 8 (الوفود ١ pp. 199-223), pushed to main (97ecf895), first batch under the sources policy of 15 Oct 2026 (classical text and editors' apparatus read and rewritten, every sentence cited):
  - 8a: event/delegation-of-banu-tamim with full prose (the shouting from behind the apartments, Utarid's speech and Thabit's reply, the Zibriqan/Hassan exchange, al-Aqra's verdict, Amr ibn al-Ahtam and Qays ibn Asim); 8 poem works with own-words accounts (Hassan's three poems closing Bara'a pp. 199-204, Zibriqan's two boasts, Hassan's two replies, Amr's satire); persons al-Hutat ibn Yazid (the brother-pact list of Muhajirun pairs, Farazdaq's verses), Nu'aym ibn Yazid, Qays ibn al-Harith; groups Banu Darim, Banu Minqar; Banu Tamim prose; passage edge 49:4.
  - 8b: Amir/Arbad (event extended with Ibn Ishaq's version, new death events for each, Jabbar ibn Salma, groups Banu Amir ibn Sa'sa'a and Banu Salul, Labid's six elegies as one work, passage edges 13:8, 13:11, 13:13 via Ibn Hisham <- Zayd ibn Aslam <- Ata' <- Ibn Abbas); Dimam (event with Ibn Ishaq's isnad to Ibn Abbas, group Banu Sa'd ibn Bakr); Abd al-Qays (event extended, al-Jarud enriched with his three names and the ridda stand, al-Gharur ibn al-Mundhir, al-Mundhir ibn Sawa and the event of al-Ala's mission); Banu Hanifa (event extended with both of Ibn Ishaq's accounts, event/musaylima-claims-prophethood with perspectives); question/why-is-9-ah-the-year-of-delegations.
  - Repairs: group/banu-amir (Quraysh clan) was wrongly used for Banu Amir ibn Sa'sa'a in three files; person/jarud-ibn-al-ala aliased into person/al-jarud-al-abdi; Musaylima's perspectives now cite sources; three stubs removed.
- Batch 9 (الوفود ٢ pp. 224-247), on main:
  - 9a (pp. 224-231): event/delegation-of-tayy, places Fayd and Farda, Zayd al-Khayl extended (death at Farda, the burned writs); event/islam-of-adi-ibn-hatim with the whole dialogue and the three prophecies, event/capture-and-release-of-hatims-daughter, person/safana-bint-hatim (name from al-Suhayli via the editors), Adi extended (faith christian then sunni, the Rakusiyya note); event/battle-of-al-radm (leader of Hamdan debated: al-Ajda' ibn Malik vs Malik ibn Harim), event/delegation-of-farwa-ibn-musayk, work/farwa-ibn-musayk-poems, group/murad, Madhhij and Banu Zubayd prose, Khalid ibn Sa'id's posting; event/delegation-of-zubayd (Amr ibn Ma'dikarib; perspectives on whether he met the Prophet), work/amr-ibn-madikarib-poem-to-qays-ibn-makshuh, event/apostasy-of-amr-ibn-madikarib, Qays ibn Makshuh prose. Duplicate person/amr-ibn-madi-karib (Futuh/Muruj) merged into person/amr-ibn-madikarib as an alias. group/tayy arrived from the raheeq lane during the rebase: kept theirs, appended the Ibn Hisham section.

  - 9b (pp. 232-238, on main 487cef8c): event/delegation-of-kinda (al-Ash'ath, the silk, the Akil al-Murar claim), person/akil-al-murar (identity debated), Surad ibn Abdullah and his campaign against Jurash (place Shakar, concept hima), work/letter-to-the-kings-of-himyar with the five Himyari addressees as persons, event/mission-of-muadh-to-yemen (the charge «يسّر ولا تعسّر»), Farwa al-Judhami's prison verses and place/afra; al-Abbas, Mu'adh, al-Ash'ath, Kinda, Khath'am, Jurash extended.
  - 9c (pp. 239-247, on main f9c0117d): group/banu-al-harith-ibn-kab and event/mission-of-khalid-to-banu-al-harith (the delegation of six named men, «لألقيت رؤوسكم تحت أقدامكم» attributed), event/mission-of-amr-ibn-hazm-to-najran with work/charge-to-amr-ibn-hazm, Rifa'a ibn Zayd's islam and place/harrat-al-rajla, the Hamdan letter and Malik ibn al-Namt's poem, the dream of the two gold bracelets (al-Aswad / Musaylima), Musaylima's letter and the reply as event + work; the sadaqa collectors list patched onto dispatch-of-sadaqa-collectors.
- Batches 11-12 (حجة الوداع من ص248: شكوى جند علي، الخطبة، قائمتا الغزوات والسرايا pp. 248-257): event/complaint-against-ali-after-yemen (perspectives sunni / shia-twelver), farewell-sermon-at-arafat and work/farewell-sermon extended with Ibn Ishaq's full account (Rabi'a ibn Umayya repeating, the calendar passage, the women passage, the «قد بلّغت» close), question on the calendar in the sermon, person/amr-ibn-kharija, expedition-of-usama (Ibn Hisham's placement), letters-to-rulers-and-kings (Ibn Hisham's recap of the apostles pp. 254-255), concept/khilaf-adad-al-maghazi with prose, datasets ibn-ishaq-ghazawat-list (27 rows) and ibn-ishaq-saraya-list (rows grow with the sariya batches).

- Batch 13 (السرايا ١ pp. 257-274): events raid-of-ghalib-on-banu-al-mulawwah (Jundab ibn Makith's account, the flood of Qudayd), raid-of-zayd-on-judham (al-Hunayd and Dihya, the Dubayb riders, Rifa'a's ride, Ali sent to return the booty, Abu Ji'al's poem), raid-of-zayd-on-banu-fazara-and-umm-qirfa [Tier A, perspectives], killing-of-al-yasir-ibn-rizam, killing-of-khalid-ibn-sufyan-al-hudhali (staff object, Ibn Unays's verses), raid-of-ghalib-on-banu-murra (Mirdas and Usama's «من لك بلا إله إلا الله»); sariyya-of-uyayna-to-banu-tamim extended with Ibn Ishaq's Banu al-Anbar account (Aisha's slave, the delegation of eight, the named dead and captives, Salma bint Attab's and al-Farazdaq's verses as works); expedition-of-dhat-al-salasil extended (the «لا تختلفا» exchange, Rafi' al-Ta'i merged into person/rafi-ibn-umayra with Abu Bakr's counsel, Awf ibn Malik's camel, place al-Salsal, group Banu Udhra); groups Banu al-Mulawwah, Dubayb, Dula', Fazara, al-Anbar, Murra, Juhayna; 16 persons; saraya dataset rows 24-30. Repair: dhat-al-salasil had occurred_at place/mecca (Devin), replaced by place/al-salsal with a note.

## Doubt markers, batches 8-9a (pp. 199-231)

- p199 «قال ابن هشام: وتروى لابنه عبد الرحمن بن حسان» (the maghazi poem); p200, p201, p216, p219 «عن غير ابن إسحاق» lines; p204 Abu Zayd al-Ansari's readings; p204 n.8 end of the sira's juz' 18.
- p206 الحبحاب / الحتات (Ibn Hisham), n.1 MSS «زيد» and one MS merging him with Amr ibn al-Ahtam; p207 n.1 al-Aqra's nasab variant; p209 «ويروى» two Zibriqan readings «رواه لي بعض بني تميم، وأكثر أهل العلم بالشعر ينكرها للزبرقان»; p211 the second Zibriqan poem from «بعض أهل العلم بالشعر من بني تميم»; p213 «بقي بيت واحد تركناه لأنه أقذع فيه».
- p213 n.3 Arbad «ابن جزء» vs Abu Dharr «جزي» vs Abu Ubayd/Ibn al-Kalbi «ابن جزء»; p214 «قال ابن هشام: ويقال أغدة كغدة الإبل وموتاً في بيت سلولية»; p214 n.2 «خالني» two readings; p215 Ibn Hisham's isnad to Ibn Abbas for 13:8-13; p215 n.1 «يبيعه».
- p220 n.1 «فلا تحدث بها علي»; p220 n.3 «بئست» (Sharh al-Mawahib) vs MSS «باست»; Dimam's year (Waqidi 5 / Ibn Hajar 9).
- p221 al-Jarud ibn Amr ibn Hanash (Ibn Ishaq) / ibn Bishr ibn al-Mu'alla (Ibn Hisham) / ibn al-Ala' (Raheeq); n.2 «الحسن» vs «الحسين»; p222 «ويروى: وأكفي من لم يشهد»; n.1 «صليباً»; n.2 al-Suhayli on al-Gharur's name.
- p222 Musaylima ibn Habib (Ibn Ishaq) / ibn Thumama, Abu Thumama (Ibn Hisham); p223 two accounts of his presence, «فالله أعلم أي ذلك كان».
- p224 «فلم يثبته» (the name the Prophet gave the fever); p225 الجوشية / الحوشية (Ibn Hisham), n.4 Safana via al-Suhayli; p227 bracketed additions from MS ١; p228 Hamdan's leader (Ibn Ishaq vs Ibn Hisham); p229 Abu Ubayda's reading of Farwa's line, «أول بيت منها وقوله فإن نغلب عن غير ابن إسحاق»; p231 Abu Ubayda's three lines «ولم يعرف سائرها», «بثفر» from Abu Ubayda.
- Page-image verified: p206 (the delegation names), p213 (Arbad's nasab and the footnote), p221 (al-Jarud's two names, the Hasan/Husayn note).

## Tier A for review (batches 8-9a)

- event/musaylima-claims-prophethood: perspectives (two Sunni accounts, al-Mubarakpuri, academic needs_source).
- event/assassination-attempt-of-amir-and-arbad: Ibn Ishaq's «عدو الله» and «شياطينهم» attributed, not in the museum's voice; the death events keep «بعث الله عليه الطاعون/الصاعقة» as the tradition's narrative.
- event/capture-and-release-of-hatims-daughter: captives of Tayy held in an enclosure by the mosque; sensitivity slavery-and-freedom.

## Doubt markers, batches 9b-12 (pp. 232-257)

- p232 «قال ابن هشام: الأشعث من ولد آكل المرار من قبل النساء»; p233 Akil al-Murar «معاوية بن كندي، ويقال كندة» (Ibn Hisham); p234 Surad's campaign «فيما بلغني»; p235 n. on Shakar's vowelling; p236 the Himyar letter's date «بعد تبوك» and the addressees' names in the MSS (al-Harith / Nu'aym ibn Abd Kulal, al-Nu'man qayl Dhi Ru'ayn).
- p237 Mu'adh's charge via Abdullah ibn Abi Bakr (no isnad beyond him); p238 Farwa's verses: two MS readings noted by the editors; Afra «من أرض فلسطين» placed under al-Sham for want of a place entity.
- p239 Khalid's letter «فيما بلغني»; p240-241 the six delegates' names vary in the MSS (Yazid ibn Abd al-Madan / ibn al-Muhajjal); p242 Amr ibn Hazm's charge «فيما بلغني» and the date «بعد ذلك» undated; p244 Malik ibn al-Namt's poem «ويروى ... » for one line; p245 the dream: «ويقال: الكذابان» two readings of the bracelets' interpretation; p246 the collectors' list order differs between MSS; p247 Musaylima's letter read in Ibn Hisham's own transmission (not Ibn Ishaq).
- p248-249 the complaint against Ali: Ibn Ishaq via Yahya ibn Abdullah ibn Abd al-Rahman from his father (anonymous soldier); p250 n. on «لا ترجعن بعدي كفاراً» MS variants; p251 «قال ابن هشام: ويقال ...» on the Nasi' passage; p252 Rabi'a's repetition «فيما بلغني»; p254-255 Ibn Hisham's own recap of the apostles, not Ibn Ishaq's text; p256-257 Ibn Hisham counts 27 ghazawat, 9 fought, and the saraya «ثمان وثلاثون» with «وبعض الناس يقدم غزوة حمزة».

## Tier A for review (batches 9b-12)

- event/mission-of-khalid-to-banu-al-harith: the threat «لألقيت رؤوسكم تحت أقدامكم» is attributed to the Prophet in Ibn Ishaq's text and left as reported speech.
- event/musaylimas-letter-and-the-prophets-reply: the reply's wording and Ibn Hisham's transmission.
- event/complaint-against-ali-after-yemen: perspectives (Sunni reading of the soldiers' complaint vs the Twelver reading as prelude to Ghadir), both marked needs_source for the second voice.

- Batch 17 (وفد ثقيف والبراءة pp. 182-199), this commit: delegation-of-thaqif and demolition-of-al-lat extended with Ibn Hisham's account (Urwa ibn Mas'ud's death and burial with the martyrs, Abd Yalil's mission, the Lat stipulations, the tent, the letter, Abu Mulayh and Qarib); person/abu-mulayh-ibn-urwa created; prayer over Ibn Ubayy extended with Ibn Ishaq's account of Umar, the verses linked as revealed_about on passages 9:80 and 9:84, and perspectives (Tier A); hajj-led-by-abu-bakr extended with the Bara'a commentary (al-Ill, al-Dhimma, Ali's announcement, the four months); concept/nasi extended with the verse on intercalation.
  - Source conflict recorded: Ibn Hisham gives the destruction of al-Lat to Abu Sufyan and al-Mughira; the existing demolition event credits Khalid ibn al-Walid. Both are kept and marked needs_source.
  - Doubt markers pp. 182-199: «قال ابن هشام: ويقال من أبصارهم» (Urwa's words); «تُبكَيَنّ» from outside Ibn Ishaq; killer of Urwa named two ways (Awf ibn Awf / Wahb ibn Jabir); the Ahlaf/Banu Malik dispute; «الديل» vs «الدَّيل» in 9:1-3 MSS.
  - Tier A: prayer over Ibn Ubayy (perspectives, Umar's objection narrated by Ibn Ishaq).
- Batch 14 (السرايا ٢ pp. 275-291), on main with this commit: events raid-of-ibn-abi-hadrad-on-batn-idam (Muhallim kills Amir ibn al-Adbat after the greeting; blood-money at Hunayn; the prayer against Muhallim), raid-of-ibn-abi-hadrad-on-al-ghaba (Rifa'a ibn Qays and the thirteen camels), sariyya-of-abd-al-rahman-ibn-awf-to-dumat-al-jandal (the turban, the five afflictions, the banner charge), sariyya-of-abu-ubayda-to-sif-al-bahr (the dates and the sea creature), mission-of-amr-ibn-umayya-against-abu-sufyan (Ibn Hisham's addition), sariyya-of-zayd-to-madyan, killing-of-abu-afak [Tier A], killing-of-asma-bint-marwan [Tier A], capture-and-islam-of-thumama-ibn-uthal, sariyya-of-kurz-ibn-jabir-against-the-killers-of-yasar [Tier A], ali-expeditions-to-yemen; works hadith-of-the-five-afflictions, Abu Afak's and Asma's verses, Hassan's reply; places al-Salsal, Idam, al-Ghaba; groups Juhayna, Banu Umayya ibn Zayd and Banu Khatma extended; saraya dataset complete at 38 rows.
  - Repair: group/banu-khatma was added on main by the geography lane; this batch adds to that file and does not replace it.
  - Cite check on this machine reports 287 problems in other lanes' citations to books whose extracted pages are absent; none are in ibn-hisham-saqqa.

## Doubt markers, batch 13 (pp. 257-274)

- p257 saraya list: «في نسختين ثنية ذي المروة» (editors: corruption), «وبعض الناس يقدم غزوة حمزة»; p260 «قال ابن هشام والشافعي: من أرض حسمى» for Judham's land; p260-261 vowelling of al-Dula' and the archer's name (editors' notes); p261 «قال ابن هشام: ويقال حيان بن ملة».
- p263-264 the Dubayb riders' speech and Abu Zayd's «تحت قدمي هذه» without isnad; p265 Zayd's vow not to wash «من جنابة» (one MS reading); p266 Umm Qirfa's killing described without comment; al-Yasir's thirty companions in one MS; p267 «بنخلة أو بعرنة» (narrator's doubt); p268 the staff «آية بيني وبينك يوم القيامة» via Ibn Unays alone.
- p269 «تمت الغزاة وعدنا إلى خبر البعوث» missing in one MS; p270 «الخالفين» (Abu Dharr) vs «الخائفين» (three MSS); the eight delegates' names; al-Farazdaq's verses are Ibn Hisham's addition.
- p271 Ibn Hisham on al-Huraqa via Abu Ubayda, sentence disordered in two MSS; p272 Rafi' «فيما بلغني», identified by Ibn Ishaq as Rafi' ibn Umayra; p274 Awf via Yazid ibn Abi Habib «أنه حُدّث عن عوف»; one MS adds «ولم يزدني على السلام».
- None of the batch-13 raids is dated by Ibn Ishaq; every date is marked debated with needs_source.

## Tier A for review (batch 13)

- event/raid-of-zayd-on-banu-fazara-and-umm-qirfa and person/umm-qirfa: the manner of killing, perspectives Sunni-first, sensitivity violence.
- event/raid-of-ghalib-on-banu-murra: Usama's killing of a man who had pronounced the shahada; the Prophet's rebuke.
- event/killing-of-al-yasir-ibn-rizam and event/killing-of-khalid-ibn-sufyan-al-hudhali: targeted killings reported as the Prophet's dispatch; the opponents' intent is what «بلغ» the Prophet.

## Next step

Batch 14 (pp. 275-291: Batn Idam, Rifa'a ibn Qays, Dumat al-Jandal, Sayf al-Bahr, Amr al-Damri, Madyan, Abu Afak and Asma' bint Marwan [Tier A], Thumama, Alqama, Kurz, Ali, Usama), 17 (pp. 182-199), 19-22 (pp. 291-322), 23 (indexes).

## Doubt markers, batch 7 (pp. 173-181)

- p173 «أو كما قال» (the Prophet's reply to the builders); n.4 vowel of Dhu Awan (Abu Dharr / al-Khushani).
- p174 «ومعن بن عدي، أو أخاه عاصم بن عدي»; n.1 Bijad/Nijad (Abu Dharr; al-Daraqutni fixes Bijad); n.2 Wadia's «[بن زيد]» from MS A.
- p175 «ولم يعذرهم الله ولا رسوله» vocalisation unclear; p177 «بضعة وثمانين رجلا»; p178 «هلال بن [أبي] أمية» bracket from MS A, n.2 al-Zurqani adds «قد شهدا بدرا»; p180 n.1 «ما بقيت» for «ما حييت».
- Page-image verified: builders list (Abu Habiba ibn al-Azar, Ubayd not Unayd), Murara al-Amri, Hilal al-Waqifi, the Ghassan letter, dhat al-khitmi.

## Open items

- `place/al-balqa`, `place/maab` and the Mu'ta stubs in `data/_stubs.d/ibn-hisham.yaml` are still stubs.
- Coordinates for the new places (Marj al-Suffar, Ajnadayn, al-Zurayba, Maysan...) are not given: no docs/plan/16 §6 entry and no Wikidata check yet.
- Two Negus entities exist (`person/al-najashi`, `person/negus-of-aksum`); not merged here (owned by another session).
