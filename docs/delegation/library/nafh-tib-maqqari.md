# Lane: lib-nafh-tib — Nafh al-Tib (al-Maqqari)

## Source
- Book: نفح الطيب من غصن الأندلس الرطيب — al-Maqqari (d. 1041 AH).
- Scans: `raw/library/tareekh/nafh-tib/` — BBib-Alex-05311 (vol 1), 05312 (vol 2), 05310 (vol 3), 05307 (vol 4); all OCR'd (`books/tareekh/nafh-tib/<scan>/book.txt`).
- Source record: `source/nafh-tib-maqqari`. Cite `{cite:nafh-tib-maqqari p. N}`.

## Method
Alphabetical/thematic sections; mine set-piece dossiers (conquest, Cordoba descriptions, Umayyad amirs, famous Andalusi figures, literary anecdotes). Check existing entities (Ibar batches covered much Umayyad/taifa material) — enrich first, create second.

## Progress
- Setup: source record + lane doc.
- Vol 1 (BBib-Alex-05311): conquest narrative (Musa's istisqa, Tariq's Berbers, Mughith's storm of Cordoba, Rabah, Tudmir's ruse), early-governor register 92–129 AH (al-Ghafiqi, Balat al-Shuhada 114, Uqba's Rhone ribats, Abu'l-Khattar's jund districting, Shaqunda massacre), Ibn Hayyan's 46-year span, Umayyad amirs (al-Nasir's caliphal assumption + Khandaq + Ibn Shuhayd's gift + Dhu'l-Wizaratayn), Almanzor dossier (56 ghazwas, Santiago monk, Medinaceli death), Amirid successors (al-Muzaffar, Sanjul's 398 heirship deed, Ibn Burd the Elder), fitna (Ali b. Hammud's grape-justice and bath murder 408, Hammudid veil audience, Ibn Muqana's nuniyya), Jahwarids of Cordoba, city monographs (Almeria's thousand looms, Shantara's forty-day wheat), Solomon's table + Alexander's straits causeway + Toledo's House of Locks, Abu'l-Hakam's forty-camel maristan.
- Merges: place/toledo → place/tulaytula; place/qurtuba → place/cordoba.
- Note: object schema `provenance` means physical custody (array of strings) — omit the standard provenance block on objects; sources + status.generated_by carry the trail.
