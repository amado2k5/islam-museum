# Person–place geo enrichment, lane devin-person-full-c

Session worktree: `.claude/worktrees/devin-person-full-c` (origin/main). Nothing committed.

## Scope processed

- `data/person/*.yaml` alphabetical positions 7541–11310 (mohammad-taghi-khalaji … ziyadat-allah-iii): all 3,770 files scanned for place evidence in `born.note`, `died.note` and `summary` (en/ar/ur); 684 candidate edges were extracted by pattern matching and **every candidate was manually reviewed** against the context in the file.
- `data/place/*.yaml` alphabetical positions 1213–1819 (muzdalifa … ziyadat): all 607 files surveyed for kind, labels, regions, coordinates, sources, status and provenance.

## Results

### Person files: 226 files edited, ~310 place relations written

Edges added with `born_in`, `died_in`, `buried_in`, `lived_in`, `traveled_to`, `ruler_of`; every edge carries `sources` taken from the corresponding fact block (born/died `sources:`) or the entity's own `sources`. Files edited (see git status for full list) include major clean-ups such as:

- mohammed-hanif: `born_in` place/okara, `lived_in` place/karachi, place/london (note had recorded that no place entities existed).
- mohammad-taqi-bahar: `died_in` place/tehran.
- muhammad-ali-jauhar: `died_in` place/london (was previously unwritable); `buried_in` place/jerusalem.
- mohammed-bin-rashid-al-maktoum: `born_in` place/dubai.
- murtuza-mukhtarov: `died_in` place/baku.
- muhammad-sayyid-tantawi: `died_in` place/riyadh, `buried_in` place/medina.
- osman-nuri-hadzic: `born_in` place/mostar.
- zahir-shah: `born_in`/`died_in` place/kabul, `lived_in`/`ruler_of` place/afghanistan.
- Rulers: ~120 `ruler_of`/`ruled_over` edges for attested governors, amirs, sultans and mayors (e.g. muhammad-i-jalabi → died_in edirne; ubayd-allah-ibn-ziyad → basra+kufa+iraq; sanjar-al-jawli → gaza+hama; nur-al-din-mahmud → aleppo+damascus; qaboos-bin-said → oman; recep-tayyip-erdogan → istanbul (mayor)).
- Classical `بحران` matches were retargeted to `place/harran` (the texts' spelling of Harran, confirmed by each family's Harrani context) for najm-al-din-ibn-shabib, sawab-al-adili, sayf-al-din-ibn-taymiyya and shihab-al-din-ibn-taymiyya.
- Hijra-era `lived_in place/abyssinia` edges for the attested Abyssinian emigrants (umm-habiba, sawda, utba-ibn-ghazwan, etc.), `died_in place/qubrus` for umm-haram-bint-milhan.

### Rejected candidates (precision review)

Roughly half of all machine-matched candidates were rejected; recurring false-positive classes recorded for future lanes:

- `place/malay` (a small classical town) matched every "the Malay article" phrase → all ~20 rejected (onn-jaafar, tok-kenali, zainal-abidin-ahmad, etc.).
- `place/ways` matched "given two/three/four ways" phrases; `place/rashid` matched the personal name Rashid; `place/badr` matched "al-Shaykh Badr" (a different village); `place/alma` matched "Alma-Ata"; `place/orleans` is Orléans, France, not New Orleans; `place/buhran` is an Arabian site, not Harran.
- Kinship/narrative false positives: subaya-bint-al-harith (husband died at Mecca, not her), umm-aban-bint-utba (husband fell at Ajnadayn), ridwan-ibn-tutush (father fell at Rayy), salman-khan (born Indore), mohammed-ibn-al-sharif (killer's name).
- Ruler false positives: muhammad-ibn-ajlan ("the governor of Medina pardoned **him**"), sayf-al-din-al-mashtub (sultan embraced **at** Jerusalem), nashwan-al-himyari (descended from, not king), nizam-al-din-awliya (a Sufi master, not a ruler), sallam-al-tarjuman, tjokroaminoto ("Crownless King" nickname).
- Disputed/unstated places left without an edge, as the files themselves note (mohammad-yaqub-khan born/died, mohammed-ben-abdallah, moulay-slimane, montek-singh-ahluwalia, motaz-azaiza, tawhida-ben-cheikh, ubayd-zakani, tansen, yasser-arafat, mustafa-al-sibai, talat-pasha, sher-ali-khan, nazir-akbarabadi, sayed-al-naqshabandi, zaynab-bint-ali → only the Damascus reading of several was kept… see notes below).

### New place entities (8), all draft + provenance.layer own-research

- place/dubai, place/tehran, place/baku, place/okara, place/karachi, place/london, place/riyadh, place/mostar — each with kind=city, ar/en/ur label+summary, region, coordinates (precision `locality`), Wikidata QID where certain, `sources: [source/geonames-gazetteer]`, `status.review: draft`.
- Note: `place/baku` does **not** carry `wikidata: Q9248` although Q9248 is genuinely Baku — `data/language/indonesian.yaml` already (and wrongly) claims that QID; the collision would fail validation. Left for a steward to fix in indonesian.yaml.

### Place files: 128 files edited

- 102 files received `coordinates` + `coordinate_precision` (+`coordinate_note` where approximate) and `source/geonames-gazetteer` appended: major fixes include nablus, najran, nasibin, nineveh, petra, siffin, wasit, tikrit, tarsus, tirmidh, tadmur, tabariyya, tarabulus-sham, wahran, srinagar, tinnis, tinmal, ubulla, ur, urmiya, ush, yazd, zaila, zanjan, zaranj, silves, velez-malaga, ubda, wadi-ash, washqa, sharshal, tahirt, tarudant, wargla, qadis-andalus, nawtas, pantelleria, vlora, surqusa, tabarmin, siwri-hisar, siraf, sirjan, sumaysat, sus-khuzistan, sohar, sur, sirt, suways, tarim, talaqan, tanja, tarifa, shabwa, shamkur, shimshat, sierra-nevada, and regional approximations (najd, oman, yemen, sijistan, tabaristan, transoxiana, sughd, sind, tukharistan, zabulistan, shirwan, nuba, sus-al-adna/aqsa, sayhad, persian/venetian gulfs).
- 5 files received missing `regions:` (philippines → southeast-asia, tinmal → maghreb, ukaz → arabia, wabar → arabia, wadi-nakhla → arabia).
- 27 files received a `provenance` block (own-research, noting the record predates the lane).
- `data/place/sirwah.yaml` and `data/place/thaniyyat-al-wada.yaml` were **not** given coordinates: both already carried an explicit coordinate_note saying the site is undetermined; the earlier judgement was kept.

## Unresolved / uncertain

- ~373 place files in the range still lack coordinates — mostly obscure classical toponyms (nahr-* canals, small villages, unlocated sites) that need specialist gazetteer work (Le Strange / Yaqut concordances); left for a future run rather than guessed.
- Several persons named places with no entity yet: Meerut, La Marsa, Jericho, Soltaniyeh, Mazar-e Sharif, Suresnes, Toronto, Semarang/Surakarta, Ksar Hellal, Deir Atiyah, Suq al-Shuyukh town, Ijzim, Dhanbari, Habiganj, Sibu, Kota Bharu, Johor Bahru, Kuala Lumpur, Bandar Seri Begawan, Jilka, Chiniot, Sargodha, Hyderabad (Sindh), Mumbai, Abuja, Rome, Berlin, Chittagong, Birmingham, Metairie, Sumgait, Ganja, Nangarhar, Pacitan, Jombang, Jember, Blitar, Panarukan, Tremas, Baabdat, Kardzhali, Cotabato, Kelantan towns, Asaka, Frashër, Shlisselburg, Balanjar-region villages, al-Mansura (Yemen). Creating them all was out of this run's scope; notable gaps listed for the place-creation lane.
- `muhammad-khwarazmshah` died on a Caspian island (Abaskun/Dihistan) — no confident target; edge skipped.
- `zayd-ibn-sana` died during the Tabuk expedition per Mustadrak (al-Dhahabi disputes the wording); edge written with the file's own cited source — flagged here as low-confidence.
- `ubayd-zakani` death place (Shiraz/Isfahan/Baghdad) unresolved — no edge, conflict preserved in the file.
- `zaynab-bint-ali` death place (Damascus/Cairo/Medina) contested — only `died_in place/damascus` was written pending a perspectives treatment; flagged.

## Validation

- `npm run validate` — **0 errors**, 8524 warnings (pre-existing warnings unchanged; baseline before this work: 1 error which was my own duplicate-QID issue, fixed).
- `npm run graph` — built cleanly: 53,140 nodes, 88,376 edges.
- All person and place YAML files parse; no `review` status was promoted (all edits keep their existing/draft status).


## Update: coverage criterion pass (person range 7541–11310)

After the new acceptance rule — every person in the range must carry at least one
schema-valid person→place association — two further passes were run:

- **Result: 1,576 of 3,770 person files now carry ≥1 place edge** (born_in, died_in,
  buried_in, lived_in, traveled_to, ruler_of, ruled_over, or an occupations[].place link).
- Second pass added **858 files** via nisba/origin inference (`lived_in`, `confidence: low`,
  with an explicit `note` stating the nisba basis) and single-place-mention inference
  (trap-filtered against false hits such as place/ways 'two ways', place/malay 'Malay article',
  place/nabil the given name, al-Shaykh Badr vs Badr, Alma-Ata vs alma, Orléans vs New Orleans).
- Third pass added **33 files** from place names in born/died notes outside strict patterns.
- **2,194 files remain `unresolved_without_place`**: they are overwhelmingly thin draft cards
  (dynastic stubs, OCR-mined rijal entries) whose texts name no locatable place entity, or whose
  only place mentions are conflicts the file itself flags as unresolved. No edge was fabricated.

### unresolved_without_place (2194 files)

(First 120 of 2194; full list in git working tree diff / `/tmp/geoc/unresolved.txt`)

- mohammad-taghi-khalaji
- mohammed-al-bashar-al-rashidi
- mohammed-bahjah-al-athari
- mohammed-bin-abdulrahman-al-thani
- mohammed-bin-hamad-al-bandanji
- mohammed-bin-salman
- mohammed-hijab
- mohammed-ibn-al-sharif
- mohammed-shahabuddin
- mohammed-vi-of-morocco
- mohamoud-ali-shire
- mohiuddin-mahdi
- moktar-ould-daddah
- molana-abdul-hafeez-makki
- molla-arif-ali
- molla-fathollah-kashani
- molla-fenari
- molla-jafer-celebi
- molla-sinan-al-din-yusuf
- molla-yegan
- molla-zeyrek
- momena-khatun
- mona-elghdban
- mona-eltahawy
- moncef-marzouki
- monia-mazigh
- monke-khan
- montgomery-watt
- morali-dervis-mehmed-pasa
- morteza-hosseini-fayaz
- morteza-qoli-khan-shamlu
- mosaad-anwar
- moshe-cordovero
- moshood-abiola
- moslem-malakouti
- mostafa-arrid
- mostafa-khomeini
- mostarli-hasan-ziyai
- moulay-hassan
- moussa-traore
- moutasem-al-hameedi
- muadh-ibn-al-harith
- muadh-ibn-amr-ibn-al-jamuh
- muadh-ibn-anas-al-juhani
- mualla-ibn-mansur
- muammar-ibn-rashid
- muanis-al-muzaffar
- muattib-ibn-qushayr
- muawiya-al-ashari-abu-ubaydallah
- muawiya-ibn-amr-al-mawsili
- muawiya-ibn-hisham
- muawiya-ibn-khudayj
- muawiya-ibn-salih
- muawiya-ibn-yazid
- muawwaz-ibn-amr-ibn-al-jamuh
- muawwid-awad-ibrahim
- muawwidh-ibn-afra
- muayyad-ahmad-ibn-inal
- muayyid-al-dawla
- muaz-habib
- mubarak-ahmad-khan
- mubarak-al-sabah
- mubarakah-ibrahim
- mubariz-al-din-muhammad-muzaffar
- mubashir-ibn-abd-al-mundhir
- mudar-ibn-nizar
- mudrik-ibn-al-muhallab
- mudrika-ibn-ilyas
- mudzafar-shah-i-kedah
- muflih
- mufti-abdul-razzaq
- mufti-barkatulla
- mufti-muhammad-naeem
- muftizade-ahmed-efendi
- mughallis-al-abdi
- mughith-al-rumi
- muhamed-seid-serdarevic
- muhammad-abd-al-daim-al-jundi
- muhammad-abd-al-rahman-al-marzuqi
- muhammad-abduh
- muhammad-abu-al-layth-khayrabadi
- muhammad-abu-al-suud-al-hanafi
- muhammad-abu-khubzah
- muhammad-abu-zahra
- muhammad-adil-shah-bijapur
- muhammad-ahmad-rayan-haydarabadi
- muhammad-ajmal-raza-qadri
- muhammad-akbar-mughal
- muhammad-al-amin-al-mithqab
- muhammad-al-amin-al-shinqiti
- muhammad-al-amin
- muhammad-al-bahi
- muhammad-al-bakri-siddiqi
- muhammad-al-bashir-al-khawja
- muhammad-al-burtuqali
- muhammad-al-faqih-al-yunini
- muhammad-al-ghazali-modern
- muhammad-al-hajwi-al-tha-alibi
- muhammad-al-hasan-al-hamawi
- muhammad-al-hattab
- muhammad-al-jurbadhaqani
- muhammad-al-kanemi
- muhammad-al-khidr-husayn
- muhammad-al-khudari
- muhammad-al-mahruq
- muhammad-al-mannuni
- muhammad-al-mukhtar-al-shinqiti-mufti
- muhammad-al-mukhtar-al-shinqiti
- muhammad-al-nafs-al-zakiyya
- muhammad-al-naqib
- muhammad-al-nasharti
- muhammad-al-ruhuni
- muhammad-al-sadr
- muhammad-al-saeedi-al-jardi
- muhammad-al-samaluti
- muhammad-al-shaykh-al-mamun
- muhammad-al-shubrawi
- muhammad-al-tafilalti
- muhammad-ali-al-hammami
- muhammad-ali-al-sayis

### Validation (final)

- `npm run validate` — **0 errors**, 8,524 warnings.
- `npm run graph` — 53,140 nodes, **90,164 edges** (up from 88,376 after this pass).
- All added edges carry `confidence: low` + `note` where the link is inferred, keep
  `status.review` unchanged, and cite the record's own sources.

## Update: web-research and nisba pass on `unresolved_without_place`

- Romanized-nisba pass (names ending in -i/-awi/-ani matched against place slugs and a curated
  nisba dictionary of ~250 entries, e.g. dimashqi→damascus, shirazi→shiraz, tustari→tustar,
  rumi→anatolia) added `lived_in` `confidence: low` edges to **62 more person files**, each with
  a note stating the nisba basis.
- Dedicated web research (English + official sources) resolved **2 heads of state**:
  mohammed-bin-abdulrahman-al-thani (`born_in` place/doha, `ruler_of` place/qatar — US Qatar
  Business Council official bio, Qatari profiles) and mohammed-vi-of-morocco (`born_in`
  place/rabat, `ruler_of` place/morocco — Moroccan Foreign Ministry, LC n00029052,
  Oxford Reference). Wikipedia was used only as a pointer, never cited.
- **New places (4):** place/doha, place/rabat (cities, coordinates `locality`, Q3861/Q3551),
  place/qatar, place/morocco (regions, `approx`, Q846/Q1028); all draft, `geonames-gazetteer`
  source, own-research provenance.

### Final counts

- **1,640 of 3,770 person files in the range now carry ≥1 schema-valid person→place edge.**
- **2,130 remain `unresolved_without_place`** — almost entirely thin OCR/draft stubs whose
  texts name no locatable place; web research was bounded to the first files of the list and
  could not cover all 2,130 in one session. Verbs attempted: born_in/died_in queries plus
  moved/settled/based/worked forms; accepted only when an institutional or scholarly source
  supported the fact.
- `npm run validate` → **0 errors**, 8,525 warnings.
- `npm run graph` → **53,144 nodes, 90,296 edges**.

## Update: second-wave web-research batch

Deep-research batch (first files of `unresolved_without_place`, ≤25):

- **mohammad-taghi-khalaji** — `lived_in` place/qumm: studied and taught at the Qom seminary
  since c.1971 (BBC Persian detention report; Persian biographical sources).
- **mohammed-bahjah-al-athari** — `born_in` place/baghdad: born in the Jadid Hasan Pasha
  quarter of Baghdad 1320 AH/1902 CE (King Faisal Prize biography; alukah.net biography).
- **mohammed-al-bashar-al-rashidi**, **mohammed-bin-hamad-al-bandanji** — thin draft cards;
  no locatable source found, remain unresolved.

### Counts after this batch

- **1,642 resolved / 2,128 unresolved** of 3,770 person files in range.
- `npm run validate` → **0 errors**, 8,525 warnings.
- `npm run graph` → **53,144 nodes, 90,300 edges**.

## Update: third pass — Wikidata-claims enrichment

Bulk external-ID pass over all unresolved persons carrying a Wikidata QID
(1,306 of the then-2,142 unresolved):

- Fetched `wbgetentities` claims P19/P20/P119/P551/P937 for all 1,306 persons;
  1,065 had at least one place claim across 1,001 distinct place items.
- Mapped 149 place items to existing `place/*` entities (by wikidata id,
  name index and slug) and created **669 new place entities** for claimed
  places that had no canonical entity (labels + Arabic label/summary, kind,
  regions, representative coordinates + precision, wikidata/geonames
  external IDs, `source/wikidata`, draft status, own-research provenance).
- Added edges to **1,023 person files**: P19→`born_in`, P20→`died_in`,
  P119→`buried_in` (medium confidence), P551/P937→`lived_in` (low), each
  cited to `source/wikidata` (or the person's own `wikidata-<slug>` source).
- Merge decisions: 42 burial/building targets resolved to existing
  `building/*` entities (edges retargeted; born/died/lived claims to
  buildings dropped as invalid range); place/place duplicates merged
  (izmir, rayy); 13 new place entities for polity-class realms kept with
  the wikidata id stripped (id lives on the `polity/*` record); 16 edges
  dropped where the only claim was a building with a person-only range.
- Skipped non-geographic claims (battles, hospitals, organisations, a
  misattributed person item) — recorded in `/tmp/geoc/new_places_skip.json`.

### Counts after this pass

- **2,649 resolved / 1,121 unresolved** of 3,770 person files in range.
- Remaining unresolved: ~836 records with no Wikidata identifier plus ~285
  whose only place claims were non-geographic or unlabelled items.
- `npm run validate` → **0 errors**, 8,544 warnings.
- `npm run graph` → **53,764 nodes, 93,686 edges**.

## Update: fourth pass — record-text and Wikidata-ancestor enrichment

Against the consolidated `/tmp/geo-unresolved-c.txt` (1,128 files):

- **217 files** gained edges mined from the record's own cited biographical text:
  verb→place proximity matching over summaries/notes (ولد/توفي/دفن/أقام/سكن/
  استقر/درس/عمل/خدم/عُيّن/ولّاه/حكم/ملك/سافر/رحل/حج and English equivalents).
  Predicates: born_in/died_in/buried_in/ruler_of/ruled_over/lived_in/traveled_to;
  confidence medium where the sentence carried a `{cite:}` tag mapped to a
  source entity, low otherwise; the note quotes the supporting sentence.
- **28 more persons** resolved through Wikidata claims that pointed at
  previously unmappable items: village/district claims resolved via P131
  ancestors (e.g. Wurno→Sokoto State, Sanghar→al-Sind, Əmircan→Baku) and
  institutional hops (St Mary's Hospital→London, Battle of Uhud→Uhud).
- **24 new place entities** (districts/provinces/counties, ar+en labels,
  representative coordinates, wikidata ids, draft, own-research);
  duplicate-merge fixes: sindh→sind; baku-uyezd dropped in favour of baku.
- Remaining 878: records with no external IDs (≈590, mostly thin stubs) or
  QIDs whose only place claims were unlabelled/unmappable items — these need
  per-person bilingual web research beyond batch scale.

### Counts after this pass

- **250 of the 1,128-list resolved; 878 remaining unresolved.**
- `npm run validate` → **0 errors**, 8,563 warnings.
- `npm run graph` → **53,784 nodes, 94,442 edges**.

## Update: fifth pass — nisba edges + record-text extraction on the 883-list

Against `/tmp/geo-unresolved-c.txt` (883 files; 878 still unresolved at start):

- **69 classical-stub files** gained `lived_in` `confidence: low` edges from
  Arabic nisbas attested inside the record (بغدادي، خراساني، تونسي، موصلي،
  دمشقي، شيرازي، نسفي، صولي، طوسي، بلخي، عدني، نهرواني، مرواني، خوارزمي،
  ديلمي، فارسي، سندي، عراقي، مصري، جوري، توجي، غوري، روياني، صوري، ملايي،
  وداني، بالسي), each noted with the nisba form; tribal/ambiguous nisbas
  (همداني، بدري، معاني، عماني…) were dropped.
- **44 documented people** gained edges from facts already stated in their
  own sourced text where a place entity now exists or could be created:
  born_in/died_in/buried_in/lived_in/ruler_of (e.g. okarvi→karachi,
  nusrat-abdullah-haroon→iran+karachi, sunan-giri→gresik, pogba→france,
  zidane/garaudy→marseille, hasina→bangladesh+india, mukhtarov-style
  ancestor fallback for Pabna→bangladesh, Arosbaya→indonesia).
- **24 new place entities**: philadelphia, kelantan, gujranwala, brest,
  marseille, sylhet, abha, gonbad-e-kavus, sargodha, gujrat, montreal,
  berkeley, jhelum, quetta, pakistan, bangladesh, france, guyana,
  balochistan, gothenburg, linkoping, gresik, eritrea, united-states —
  all with ar+en labels/summaries, regions, coordinates+precision,
  wikidata/geonames IDs, source/wikidata, draft, own-research.
- Queries attempted on remaining stubs: wikidata claims (already exhausted),
  Arabic nisba forms, verb→place proximity on summaries/notes; ~765 files
  yield no defensible location from their record text or identifiers and
  would need per-person bilingual web research.

### Counts after this pass

- **118 of the 883-list resolved this pass (69 nisba + 44 text + prior); 765 remain unresolved.**
- `npm run validate` → **0 errors**, 8,563 warnings.
- `npm run graph` → **53,808 nodes, 94,682 edges**.

## Update: sixth pass — P39-office and note-field sweep on the 770-list

- **14 persons** resolved via Wikidata P39 office claims mapped to realm
  places (Sultan of Banten/Ternate/Oman/Brunei/Terengganu, Bahmani and
  Ahmadnagar Sultans, Hafsid sultan, Khwarazmshah → `ruled_over`, low
  confidence, office named in note) plus 1 died_in from a `died:` note
  (muslih-al-din-al-qastallani → constantinople).
- New places: ternate, bahmani, ahmadnagar, terengganu, somalia, tunisia
  (banten created then merged into existing `place/banten-sultanate`).
- Queries attempted on the rest: date-note fields (1 hit), regions fields,
  wikidata P19/20/119/551/937 (exhausted), P39 (exhausted). The remaining
  ~751 files are stubs lacking both identifiers and locatable record text —
  only per-person bilingual web research can resolve them.

### Counts after this pass

- **19 of the 770-list resolved this pass; 751 remain unresolved.**
- `npm run validate` → **0 errors**, 8,565 warnings.
- `npm run graph` → **53,813 nodes, 94,710 edges**.

### Sixth pass — supplement

- +5 more resolved from stub summaries (muammar-ibn-rashid→basra;
  muadh-ibn-amr-ibn-al-jamuh & muawwidh-ibn-afra→badr; muayyid-al-dawla→
  rayy+isfahan; muhammad-al-amin al-mithqab/al-shinqiti→mauritania).
- **25 of the 770-list resolved this pass total; 745 remain.**
- `npm run validate` → **0 errors**; `npm run graph` → **53,813 nodes, 94,724 edges**.
- +2 more: mohammed-ibn-al-sharif→ruled_over tafilalt (new place/tafilalt,
  Maghreb oasis realm, Q2480844); momena-khatun→lived_in bengal.
- **27 of the 770-list resolved this pass; 743 remain unresolved.**

## Update: seventh pass — manual review of the 748-file unresolved list

List: `/tmp/geo-unresolved-c.txt` (748 person files with no schema-valid
person→place edge after the sixth pass).

### Method

All 748 files were scanned three ways: (1) English summaries plus `born.note`
and `died.note` matched against every place label and alias; (2) Arabic/Urdu
summaries and all `names:` values matched the same way; (3) nisba tokens in
labels/names matched against place slugs. Every candidate was then manually
reviewed against the sentence it came from — no edge was written from a match
alone.

### Results

- **445 of 748 files resolved** this pass (~600 person→place edges written:
  `born_in`, `died_in`, `buried_in`, `lived_in`, `traveled_to`, `ruler_of`,
  `ruled_over`). 303 files remain unresolved — almost all are draft stubs
  carrying only a name and a Wikidata QID whose P19/P20/P39/P551/P937 claims
  were already exhausted in the sixth pass, plus a residue of pre-Islamic and
  legendary figures for whom no defensible place exists.
- **50 new place entities**, all `status.review: draft` +
  `provenance.layer: own-research`, with ar/en/ur labels and summaries,
  coordinates + precision + note, region, sources and Wikidata QIDs where
  certain: portugal, denmark, united-kingdom, galicia, georgia-us, bahamas,
  spain, florida, trinidad-and-tobago, tanzania, zimbabwe, ethiopia,
  connecticut, california, kashmir, kazakhstan, astana, boston, samsun, tanta,
  jurbadhaqan, mzab, amad, sahyun, fakhkh, nukhayla, al-ajfar, humayma, ifat,
  nangarhar, al-sin, kenya, nairobi, mombasa, south-africa, australia, sydney,
  newcastle, saray, ayn-al-warda, beirut, golconda, khwarazm, sasanian-empire,
  adal, sulu, niger, yunin, arcos.

### Rejected candidates (continuing the false-positive registry)

- Personal-name collisions: place/rashid (al-Rashid), place/saa and place/sa-la
  (Sa'sa'a names, ghul lore), place/sila, place/suhaym, place/safwan,
  place/dahman, place/tarifa, place/saada (Sa'd/Sa'da names), place/sawar,
  place/sari (Abu'l-Sari, Sarigorez), place/al-qays (the tribe Abd al-Qays),
  place/qayn, place/mihran (father's name Mihran), place/sa-la, place/nasa
  (NASA the agency vs town Nasa), place/bari (al-Bari's treatise).
- Kinship/context false positives: place/zafar for qatada-ibn-al-numan (Banu
  Zafar clan, not Zafar of Yemen); place/jabala for shurayh-ibn-al-ahwas
  (Sha'b Jabala ravine ≠ city Jabala — edge removed after review);
  place/al-mansura for sad-al-din-ibn-hamuwayh (Egypt's al-Mansura vs the
  Sind entity — kept only traveled_to misr); place/madyan hits on
  "Abu Madyan's line" and "distinct from Shu'ayb of Madyan"; place/hamadan
  hits on the Hamdan tribe; place/erbaa on أربعة ("four"); place/msaken on
  مساكن ("dwellings"); place/al-hay on الحي; place/utba-jariyat العين.
- Person-vs-other-actor: ubaydallah-ibn-ali's Basra mention (killer's
  location), yazid-ibn-ziyad-al-himyari's Kirman (land grant, not residence),
  murra-ibn-ali's Azerbaijan (contested frontier), shurahah's husband in
  Syria, umayra-ibn-malik's Tabuk (reference point of the meeting, not his
  presence).
- Disputed or unattributed places left without edges per the files' own
  notes: nafisa-bint-munya kept at mecca (household attested), umm-maabad and
  umm-mabad left unresolved (unnamed tent site — also flagged as duplicate
  records for a steward).

### Validation

- `npm run validate` → **0 errors**, 8,565 warnings.
- `npm run graph` → **53,863 nodes, 95,768 edges**.

### Remaining work

- 303 files unresolved: dominated by `wikidata-import-wave2` draft stubs
  (Ottoman writers, early-community figures, modern creators) where no place
  fact exists in the record and Wikidata P19/P20/P39/P551/P937 is empty.
  Only per-person bilingual book research can advance them; the searches
  needed are the file's own epithet + "ولد/توفي/أقام" and name + birthplace/
  death-place queries in Arabic, English and Urdu.

## Pass 8 — residual list sweep (`/tmp/geo-final-c.txt`, 303 files)

A final careful pass over the 303 residual files, reading every full record
(label, names/aliases, nisbas, regions, periods, summary text in ar/en/ur,
born/died blocks, sources, external_ids) and adding only what the record
itself, a well-attested title, or an unambiguous nisba defends.

### Resolution

- **101 person→place edges added on 99 files; resolved total 544 of 748;
  remaining unresolved 204.**

### How the remaining signal was harvested

- **Title-derived realms** (`ruled_over`): muhammad-iii-ibn-al-mamun →
  almohad-caliphate; muhammad-muntasir-hafsid → ifriqiya; muhammad-rumfa →
  kano; qutb-al-din-shah-kashmir → kashmir; shams-al-din-dawud-shah-ii →
  bengal; shams-al-din-ibn-muhammad-adal and muhammad-ibn-azhar-ad-din-adal →
  adal; salim-i-of-anjouan and salimou-ben-mwe-fani → anjouan; shahrbaraz and
  shiruyeh-ibn-parviz → sasanian-empire; nogai-khan → saray; sultan-abylai →
  kazakhstan; raja-ali-khan-of-khandesh → khandesh; ruh-ibn-hatim-al-muhallabi
  → ifriqiya (attested governor); nizak-tarkhan → tukharistan + traveled_to
  marw (Yazdgard III host); muhammad-juki and pir-muhammad-ibn-jahangir →
  kabul (attested Timurid governors).
- **Nisba/institution-derived residences** (`lived_in`): Karbala (the two
  Bahr al-Ulum scholars), dehlavi→delhi, burhanpuri→burhanpur, sivasi→sivas,
  mahuzi→bahrayn, sumatrani→aceh, bangkalani→indonesia, tunkabuni→
  tonekabon, suzi-of-prizren→prizren, Qasmi/Thanvi/Korwi/Kidwai/Burha→india,
  Pakistani judges/scholars→pakistan, maghrebi→morocco, ennaifer→tunisia,
  kyari→bornu, comorian→comoros, habibi→iran, suma-din→united-kingdom,
  mufti-barkatulla→india + united-kingdom (Bhopal, then Woking), pan-zhiwan
  →china, umar-khalji→india, nanha-painter→mughal-empire.
- **Classical seat/court residences** (`lived_in`): Basra (mutamir-ibn-
  sulayman, Abu Zayd al-Ansari, al-A'rabi the linguist, suwayd-ibn-manjuf,
  nufay-abu-bakra); Medina (nafi-ibn-umar-al-jumahi, muhammad-ibn-safwan,
  suhayl-ibn-bayda, salma-umm-al-khayr, thabit-ibn-al-dahhak-al-ashhali,
  tuways); Kufa (umm-ghurab, umm-salama-bint-yaqub, sawwar-ibn-abdallah);
  misr (the Egyptian muqriʾa/scholars, nuaym-ibn-hammad, said-ibn-abd-al-malik
  whose canal Nahr Sa'id was Egyptian, umm-musa); Samarra (al-Zayyat,
  al-Jarjara'i viziers, utamish); Baghdad (the princes and court figures);
  aleppo (sitt-al-wuzara); amad (umm-al-sharif); constantinople
  (solakzade-mehmed); al-andalus (yahya-ibn-omar-al-kinani); isfahan
  (safiqoli-khan-undiladze); hisn-muslama (its named prince).
- **Genealogical Hijaz line** (`lived_in` at broad arabia units): mudar,
  mudrika, rabia ibn Nizar → hijaz; zuhayr-ibn-abi-sulma → hijaz (Muzayna);
  ratiya-bint-kab → mecca; zarara-ibn-udas and saffanah-bint-hatim → najd.
- **Attested movements** (`traveled_to`): qubath-ibn-ashyam → medina (met
  the Prophet); qudaa-al-asadi → mecca (bayʿa to Ibn al-Zubayr);
  warash-ghulam-uthman → hasma (caught there with the letter);
  ziyad-ibn-hudayr → jazira (sent to the Taghlib by Umar).

### New places added (10)

- `place/china`, `place/bornu`, `place/anjouan`, `place/aceh`,
  `place/prizren` (Q83095), `place/khandesh`, `place/hasma`,
  `place/hisn-muslama`, `place/tonekabon` — all draft, own-research
  provenance, ar/en/ur labels+summaries, coordinates + precision + note,
  region, sources. No `*-2` slugs; prior-pass slugs reused everywhere
  (adal, saray, kabul, karbala, ifriqiya, sasanian-empire, anjouan co-brother
  records, etc.).

### Fixes required by the rewrite path

- `yaml.safe_dump` re-emitting earlier files had stripped quotes on
  date-like strings; validator caught `date.edtf.match is not a function`.
  Re-quoted `edtf` values in `prem-nath-bazaz`, `chaudhry-ghulam-abbas`,
  `syed-mir-qasim`, `mirwaiz-yusuf-shah` (earlier-pass files) and
  `said-ibn-aws-abu-zayd-al-ansari` (`"0830"`); revalidation clean.

### Validation

- `npm run validate` → **0 errors**, 8,565 warnings; authenticity 0 errors;
  decisions 220/220; benchmark 112/112; sweep 0 stale citations.
- `npm run graph` → **53,872 nodes (51,881 entities, 1,991 stubs),
  95,970 edges**.

### Remaining unresolved (204) — attempted searches to document

All remaining files were searched on: full English summary text,
`born.note`/`died.note`/`born.place_name`, Arabic and Urdu summary text and
all `names:` values, nisba tokens against the whole place index (labels,
aliases, slugs, Wikidata/GeoNames ids), plus movement/residence verbs in
both scripts. For records with Wikidata QIDs, P19/P20/P39/P551/P937 signal
was already exhausted in earlier waves. The residue splits as:

- **Ottoman-era writers of uncertain seat** (muid-ahmed-efendi,
  muradi-writer, nazim-mustafa-efendi, petrelali-molla-bey, qadim-ashqi,
  ridwan-al-falaki, sadullah-enveri, sehdi-osman-efendi, seyyid-ebubekir-dede,
  sharif-mehmed-efendi, shashtari-murad-aga, subhi-mehmed-efendi, sucudi-celebi,
  tavukcubashi-damadi-mustafa-efendi, tevfik-efendi, uchunju-darwish-ali,
  uryani-osman-efendi, usshakizade-ibrahim-hasib, vahdi-efendi,
  vehbi-osman-celebi, yakubzade-mehmed-efendi, yusuf-dede-efendi,
  zayn-al-din-ibn-al-muwaffaq, zenbillizade-fudayl-celebi, etc.) — generic
  "Ottoman writer" stubs; Istanbul is not recorded, so no edge was written.
- **Early-community stubs** (wadfa, wadia, wahb-ibn-qabus, waqid-*, yazid-*,
  yusuf-*, thabit-ibn-amr, muadh-ibn-al-harith, ubayd-ibn-husayn, etc.) —
  "figure of the early community" cards with no location signal; delegation,
  Medina or Mecca would be guesses, so left unresolved.
- **Anecdotal figures** whose stories are someone else's location (naila's
  warning, mujashi's mosque post, tayhan's Ibn al-Ash'ath anecdote, salit's
  courier run, said-al-hajib's task, yazid-ibn-tazwan at court, turayfa's
  mission for Abu Bakr).
- **Prophets, scriptural and literary figures** (nuh, qabil, qarun, yusuf,
  yunus, sulayman, zakariyya, shahrazad, siyawush, thaun, niyulaus, ustath,
  salam-al-abrash) — no person-place edge is appropriate.
- **Modern creators/thinkers** (mostafa-arrid, muhammad-jalal,
  the-muslim-mum, the-muslimah-ideas, thom-defilet, wejdan-al-ali, sadeel,
  orthodox-muslim, stephen-covey, sun-tzu, vilfredo-pareto, william-oncken,
  muhammad-abu-al-suud-al-hanafi et al.) — no defensible place in record or
  readily verifiable sources.
- **Thin classical stubs** where the only lead is contested (muhammad-ibn-
  nusayr's al-Namiriya, muhammad-al-mahruq's Mahruq fortress, ubayd-ibn-abi-
  al-mukhariq's Faluja, zadanfarrukh's Mahallaban, sawran's "Great Land",
  musa-al-natiq's Yemen claim, yahya-ibn-abdallah's court-death location,
  muhammad-ibn-mahran, qahtaba-ibn-shabib, salih-ibn-wasif, sulayman-ibn-
  al-hasan, najah-ibn-salama, tayhan-ibn-abjar, muhammad-ibn-ibrahim-ibn-
  musab's Mazyar campaign, shuayb-ibn-mihdam's Banu Hudura, umayra-ibn-
  malik's Hamdan delegation site, yazid-ibn-rabi-a's Himyarite seat).
- **Duplicates flagged for stewardship**: nizak-tarkhan vs nizak (different
  men, same name — kept separate, both now resolved); umm-maabad vs
  umm-mabad (same woman, both still unresolved — tent site unlocated);
  saffanah-bint-hatim vs safana-bint-hatim (duplicate; resolved consistently
  at najd).
