# S8 works log (Wikidata insertion wave 1)

Scope: works by Islamic-world authors before 1800 with P31 book/written work, P50 author in scope, at least 10 sitelinks, not yet in data/work. Subset: wikidata-subset.duckdb (read-only). Totals: 17 linked, 9 created, 3 new source records, 0 duplicate-of-existing created, the rest skipped with reason.

## Linked (existing work record gets external_ids.wikidata)
- linked work/sunan-abi-dawud: Q947278 Sunan Abu Dawood
- linked work/sunan-al-nasai: Q2175237 Al-Sunan al-Sughra (Nasa'i)
- linked work/sira-ibn-ishaq-ibn-hisham: Q12217763 Sirat Ibn Hisham
- linked work/tarikh-al-rusul-wa-al-muluk: Q129048 History of the Prophets and Kings (Tabari)
- linked work/tarikh-al-khulafa: Q5869196 History of the Caliphs (Suyuti)
- linked work/al-aghani-abu-l-faraj: Q2476995 Kitab al-Aghani
- linked work/aqida-tahawiyya: Q12190349 al-Aqidah al-Tahawiyyah
- linked work/tawq-al-hamama: Q1168719 The Ring of the Dove (Ibn Hazm)
- linked work/al-kafi: Q2632318 Kitab al-Kafi (al-Kulayni)
- linked work/nahj-al-balagha: Q2119296 Nahj al-Balagha
- linked work/tahafut-al-falasifa: Q2736005 The Incoherence of the Philosophers
- linked work/muwatta-malik: Q1050556 al-Muwatta
- linked work/sahih-al-bukhari: Q1023470 Sahih al-Bukhari
- linked work/sahih-muslim: Q886659 Sahih Muslim
- linked work/ihya-ulum-al-din: Q4165276 Ihya Ulum al-Din
- linked work/al-qanun-fi-al-tibb: Q466060 The Canon of Medicine
- linked work/al-ahkam-al-sultaniyya-mawardi: Q12183295 Al-Ahkam al-Sultaniyya

## Created (new work/ record, existing or new source/ record)
- created work/tafsir-ibn-kathir: Q1088356 (source/tafsir-ibn-kathir; no person record for the author, so no authors link)
- created work/al-bidaya-wal-nihaya: Q4164713 (source/al-bidaya-wal-nihaya; no author link)
- created work/fath-al-bari: Q2829212 (source/fath-al-bari; person/ibn-hajar-al-asqalani)
- created work/bulugh-al-maram: Q4997170 (source/bulugh-al-maram; person/ibn-hajar-al-asqalani)
- created work/rihla-ibn-battuta: Q60797163 (source/rihla-ibn-battuta-1958; person/ibn-battuta-muhammad)
- created work/kitab-al-masalik-wal-mamalik: Q2590941 (source/masalik-mamalik-ibn-khurdadhbih; person/ubaydallah-ibn-khurdadhbih)
- created work/riyad-al-salihin: Q1806888 (NEW source/riyad-al-salihin, Dar al-Minhaj ISBN 9789953620633 from publisher retail listing; person/al-nawawi)
- created work/sahih-ibn-hibban: Q4115861 (NEW source/sahih-ibn-hibban, Mu'assasat al-Risala, al-Ihsan edition, from secondary database; no author link)
- created work/akbarnama: Q2577614 (NEW source/akbarnama, Bibliotheca Indica 79, Calcutta 1877-1886, BnF record; no author link)

## Skipped (reason)
- Q4063309 al-Istibsar (Tusi): existing work/al-istibsar is a different book (al-Mas'udi); no source record for Tusi's work.
- Q430163 Tafsir al-Jalalayn: only retailer ISBNs, conflicting; no catalogue record confirmed.
- Q7638821 Sunan al-Darimi: source/musnad-al-darimi has no publisher or edition.
- Q1087557 Musnad Ahmad: source/musnad-ahmad states no edition or publisher.
- Q12234949 Kashf al-Zunun: source exists (kashf-zunun-furqan) but no work record yet; left for next wave.
- Q1030940 Book of Healing (Avicenna): no source record; existing work/al-shifa-bi-tarif-huquq-al-mustafa is a different book.
- Q4120116 Sahih Ibn Khuzaymah, Q4116066 Man la yahduruhu al-Faqih, Q4452816 Tahdhib al-Ahkam, Q4119254 Tafsir al-Kabir (Razi), Q4164550 Jami al-Bayan (Tabari), Q1906014 Baburnama, Q19454977 al-Fiqh al-Akbar, Q12243010 Musnad Abu Hanifa, Q12194651 al-Hidaya, Q12201305 al-Adab al-mufrad, Q12217063 Sunan al-Daraqutni, Q31303228 Sunan al-Kubra (Bayhaqi), Q4703001 al-Mawahib al-Ladunniyya, Q5961360 Rawzat al-Safa, Q3786648 Lisan al-Arab, Q4699994 Ajurrumiyya, Q22686539 Tafsir al-Maturidi, Q3815705 Kitab al-Umm, Q534888 al-Risala, Q7686082 Tarikh-e Beyhaqi, Q64666984 Poem of Sidi Boushaki, Q3215775 Qasida al-Burda, Q1231638 Diwan-e Shams, Q6579646 Masnavi, Q4115385 Fihi Ma Fihi, Q4119485 Wasa'il al-Shi'a, Q6864903 Minhaj al-Sunnah, Q5437335 al-Fatawa al-Alamgiriyya, Q202813 Zij-i Sultani, Q8071845 Zij-i Ilkhani, Q16127829 Al-Biruni's India, Q5375730 Rasa'il Ikhwan al-Safa, Q3513801 Ma'alim al-tanzil, Q2080955 Padmavat (not an Islamic-scope work): no confirmed book source in data/source and none confirmed in this run.
- Q7378644 Ruh al-Ma'ani (author d. 1854, after 1800): out of period.
- Q6720594 Milestones (1964), Q20806739 (2015), Q2876569 (novel), Q12220069 (Mubarakpuri, modern): out of period or scope.
- Scripture items (Q1369122 Zabur, Q1762323 Injil, Q2383104 Tawrat, Q235131, Q2283078, Q7439284): not authored written works; out of scope.
- Q2095353-linked and similar: not works.

## Next
Wave 2 candidates: Kashf al-Zunun (source exists), Sahih Ibn Khuzaymah and Tusi's works (need catalogue sources), Tafsir al-Jalalayn (needs one confirmed catalogue record).
