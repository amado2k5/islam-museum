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
  - Remaining plan: 5c-iii Zuhra, Taym, Makhzum + places; 5c-iv Jumah and Sahm; 5c-v Adi, Amir, Al-Harith; 5c-vi clan group prose and thin-group upgrade.

## Doubt markers captured so far (pp. 3-11)

- p3 «قال ابن هشام» introduces Ja'far's arrival report (Sufyan ibn Uyayna -> al-Ajlah -> al-Sha'bi).
- p3-4 «ويقال: هُمينة بنت خلف» for Khalid ibn Said's wife (Amina).
- p7 «فكان يقال: إن كان لأول رجل ورث أباه في الإسلام» (Abdullah ibn al-Muttalib).
- p7 «يشك فيه أقتل ثم أم لا» (Abdullah ibn Sufyan); editors' footnote (via al-Istiab): Hisham vs Hashim ibn Abi Hudhayfa.
- p8 «ويقال: قتل يوم خيبر، يشك فيه» (al-Sa'ib ibn al-Harith).
- p5 vs p11: Rayta bint al-Harith died in Abyssinia (p5) or on the road (p11); unresolved, recorded as debated.
- Page-image corrections: جعفر (p3, verified on image), Abu al-Rum ibn Umayr and Firas ibn al-Nadr (p7, OCR line garbled), Umm Habiba's daughter Habiba (p6).

## Next step

5c-iii onward as above, then Batch 6 (تبوك pp. 159-172) on branch `content/ibn-hisham-batch-6`; Batch 7 (مسجد الضرار والثلاثة pp. 173-181) is not started.

## Open items

- `place/al-balqa`, `place/maab` and the Mu'ta stubs in `data/_stubs.d/ibn-hisham.yaml` are still stubs.
- Coordinates for the new places (Marj al-Suffar, Ajnadayn, al-Zurayba, Maysan...) are not given: no docs/plan/16 §6 entry and no Wikidata check yet.
- Two Negus entities exist (`person/al-najashi`, `person/negus-of-aksum`); not merged here (owned by another session).
