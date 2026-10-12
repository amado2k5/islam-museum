# Ibn Hisham Lane — Progress

**Lane:** hisham
**Book:** السيرة النبوية لابن هشام — الجزء الرابع (السقا والأبياري وشلبي، 1936); printed page = PDF page - 4
**Sessions:** kiro (2026-10-11), Claude Sonnet 5.5 (2026-10-12, worktree `islam-museum-kiro`)

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

## Doubt markers captured so far (pp. 3-11)

- p3 «قال ابن هشام» introduces Ja'far's arrival report (Sufyan ibn Uyayna -> al-Ajlah -> al-Sha'bi).
- p3-4 «ويقال: هُمينة بنت خلف» for Khalid ibn Said's wife (Amina).
- p7 «فكان يقال: إن كان لأول رجل ورث أباه في الإسلام» (Abdullah ibn al-Muttalib).
- p7 «يشك فيه أقتل ثم أم لا» (Abdullah ibn Sufyan); editors' footnote (via al-Istiab): Hisham vs Hashim ibn Abi Hudhayfa.
- p8 «ويقال: قتل يوم خيبر، يشك فيه» (al-Sa'ib ibn al-Harith).
- p5 vs p11: Rayta bint al-Harith died in Abyssinia (p5) or on the road (p11); unresolved, recorded as debated.
- Page-image corrections: جعفر (p3, verified on image), Abu al-Rum ibn Umayr and Firas ibn al-Nadr (p7, OCR line garbled), Umm Habiba's daughter Habiba (p6).

## Next step

Continue Batch 6 (6b events, 6c treaties/works/dataset/parent event, 6d persons), then (تبوك pp. 159-172) on branch `content/ibn-hisham-batch-6`; Batch 7 (مسجد الضرار والثلاثة pp. 173-181) is not started.

## Open items

- `place/al-balqa`, `place/maab` and the Mu'ta stubs in `data/_stubs.d/ibn-hisham.yaml` are still stubs.
- Coordinates for the new places (Marj al-Suffar, Ajnadayn, al-Zurayba, Maysan...) are not given: no docs/plan/16 §6 entry and no Wikidata check yet.
- Two Negus entities exist (`person/al-najashi`, `person/negus-of-aksum`); not merged here (owned by another session).
