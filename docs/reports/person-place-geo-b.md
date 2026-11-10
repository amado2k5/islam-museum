# person-place-geo-b — geographic enrichment report

Worktree: `.claude/worktrees/devin-person-full-b` (based on origin/main). Not committed.

## Processed ranges

- `data/person/*.yaml` alphabetical positions **3771–7540** (3,770 files, `azlan-shah` … `mohammad-shafi-heravi`)
- `data/place/*.yaml` alphabetical positions **607–1212** (606 files, `dabarras` … `muwrids`)

## Method

- For every person with a Wikidata QID (2,127 of 3,770), P19/P20/P119/P551 claims were read via the Wikidata API and mapped to `born_in` / `died_in` / `buried_in` / `lived_in` edges.
- Referenced place QIDs already in the graph resolved to existing entities; the rest were materialised as new `place/` entities (labels, coordinates, country → region inference, `coordinate_precision: approx`, `source/wikidata`, `status.review: draft`, `provenance.layer: own-research`, run `person-place-geo-b`).
- Every written edge carries `confidence: medium` and `note: "Place link from Wikidata; pending a second source."`, citing the person's own `source/wikidata-<slug>` when it exists, else `source/wikidata`.
- For the 606 in-range places: coordinates + `coordinate_precision` + `coordinate_note` + `wikidata` external id + `source/wikidata` added where a Wikidata item could be confirmed by QID already on file or by an exact name match (`wbsearchentities`, Arabic/English label equality); `regions` and `provenance` filled where absent.

## Results

- **~2,600 new person→place edges** on **1,426 person files** (all inside the assigned range).
- **818 new `place/` entities** created from Wikidata (kind, ar/en/ur labels where available, Arabic summary, regions, coordinates `approx`, external_ids, draft status, own-research provenance).
- **171 in-range place files updated**: 100 received coordinates by verified name match, 10 by on-file QID, 35 received missing `provenance` blocks, 15 received missing `regions`.
- **~55 out-of-range place files enriched** as merge targets: where a new place was found to duplicate a pre-existing entity (matched by English label or shared QID), the duplicate was deleted, relations repointed, and the existing entity gained the `wikidata` id, coordinates and `source/wikidata` (85 label merges + 8 QID-pair merges, e.g. `damghan-2`→`damghan`, `derbent`→`darband`, `fergana`→`farghana`, `kahramanmara`→`marash`, `mopsuestia`→`massisa`).
- **64 `buried_in` edges retargeted** to existing `building/` entities (mausoleums, shrines, mosques); 46 edges to non-place entities (polities, dynasties-as-QIDs) were dropped rather than written against a wrong class.
- `data/language/indonesian.yaml`: corrected wrong `external_ids.wikidata` Q9248 (Baku) → Q26849 (Indonesian); `place/baku` was then created with the correct QID.
- `jabal-abi-qubays`, `mount-sal`: pre-existing Arabic coordinate notes merged into the new note rather than discarded.

## Unresolved / uncertain

- **~1,640 persons in range have no Wikidata QID** → no edges added; their birth/death place names live only in free-text `note:` fields (future pass could parse them).
- **210 referenced Wikidata places had no Arabic label** → no entity created and no edge written (listed in working data; candidates for a translation pass).
- **~420 in-range places still have no coordinates** (historical towns whose Arabic names did not match a Wikidata item exactly).
- 19 name-matched coordinates were **rejected and reverted** after region-consistency checks showed impossible locations (e.g. `madyan`→Lithuania, `kasan`→Alaska, `meknes`→Catalonia); noted here for a manual gazetteer pass.
- `traveled_to`, `ruler_of`, `ruled_over`: Wikidata does not expose travel; office-held → polity mapping was out of scope for a safe automated pass.
- All new edges are single-source (Wikidata) and flagged `confidence: medium` pending a second source, per the Wikidata reliability note.

## Validation

- `npm run validate` → **0 errors** (51,951 entities; ~8,500 pre-existing warnings).
- `npm run graph` → `graph: 53942 nodes (51951 entities, 1991 stubs), 92922 edges -> .cache/graph.json`.

## Files changed (summary)

- `data/person/*.yaml`: 1,426 modified (all in assigned range).
- `data/place/*.yaml`: 226 modified (171 in range, ~55 merge-target enrichments outside range) + 818 new.
- `data/language/indonesian.yaml`: 1 corrected external id.

## Second pass — cleanup and coverage (this session)

### Place identity cleanup
- All 12 `*-2` slugs audited. Merged into canonical entities (alias recorded, wikidata id/coords/sources carried over, relations repointed): `amasya-2`→`amasya`, `anatolia-2`→`anatolia`, `gaziantep-2`→`gaziantep`, `homs-2`→`homs`, `malatya-2`→`malatya`, `qazvin-2`→`qazvin`, `ramla-2`→`ramla`, `raqqa-2`→`raqqa`, `yarmuk-2`→`yarmuk`, `tripoli-2`→`tripoli-al-sham`, plus `deccan`→`deccan-plateau` (QID duplicate).
- Renamed genuinely different places off numeric slugs: `asadabad-2`→`asadabad-afghanistan` (Kunar, vs Asadabad near Hamadan), `hyderabad-2`→`hyderabad-sindh` (vs Hyderabad, India), `tripoli`→`tripoli-greece` (Tripolis, Greece, vs Tripoli al-Sham/Libya).
- Repointed all references; fixed broken YAML (`relations: []` blocks, mixed sequence indents, duplicate `relations:` keys) introduced by scripted inserts.
- One false positive corrected by hand: `ivan-iii-moscow` briefly carried a wrong `ruler_of` edge to the Ottoman Empire (wording in source text); replaced with a defensible low-confidence `lived_in` to `place/russia`.

### Person coverage (range 3771–7540)
- **3,552 of 3,770 person files (94.2%)** now carry at least one person→place association (`born_in`, `died_in`, `buried_in`, `lived_in`, `ruler_of`).
- Beyond the ~2,600 first-pass Wikidata edges, mined the record's own `born`/`died` notes and ar/en summaries for place names against the place index (labels + aliases + a curated Arabic place-name map): **+94 note-mined edges** (born_in/died_in, confidence low), **+1,488 summary/region-fallback `lived_in` edges**, **+67 curated-map edges**, **+37 country/major-city edges**, **+27 hand-checked ruler-seat edges** (`lived_in`/`ruler_of` to entities like `polity/bahmani-sultanate`, `polity/samanid-dynasty`, `place/cordoba`, `place/multan`).
- **22 new place entities** added this pass (countries/regions and towns needed by person records): india, bengal, bangladesh, tanzania, sierra-leone, south-africa, portugal, kenya, china, libya, ethiopia, canada, turkey, philippines, indonesia, malaysia, nigeria, senegal, ghana, guinea, niger, somalia, uganda, georgia, deccan-plateau-adjacent (deccan merged), hamdullahi, bandiagara — all kind city/region, ar/en(+ur) labels, coords approx, `source/wikidata`, draft, own-research.

### unresolved_without_place — 218 files
Persons with no defensible location after mining text, nisbas, regions and Wikidata: mostly early-Islamic/classical stub cards (Tabari, Fihrist, Ansab entries) with no named locality. Attempted: label/nisba matching, Arabic place-name dictionary (~90 entries), region→place fallback, polity matching. Kept unresolved rather than guess.

### Validation (final)
- `npm run validate` → **0 errors** (51,963 entities; ~8.5k pre-existing warnings).
- `npm run graph` → `graph: 53953 nodes (51963 entities, 1990 stubs), 96354 edges -> .cache/graph.json`.

## Third pass — deep research of the 218 unresolved (this session)

- **85 of 218 resolved** → unresolved now **133 of 3,770 (96.5% coverage)**.
- Methods: re-pulled extended Wikidata claims (P937 work location, P27 citizenship, P69 education, P119 burial) for the 42 record-QID holders; resolved 17 direct place links and 10 extended-claim links (e.g. `khalil-ahmad-al-saharanpuri` born_in Nanauta / died_in Medina / buried_in al-Baqi); searched names via `wbsearchentities`; mined full record text (not only summaries) with the curated Arabic/English place dictionary (+59 edges); hand-checked ruler stubs.
- **New place entities (this pass)**: phulwari-sharif, ulakan, madavoor, washington-dc, mansehra-district, coventry, davis-california, los-angeles, kresek, ghazipur, new-york-city, chhachh, dubai, pindi-gheb, turangzai, golra-sharif, nanauta, bulandshahr, tanda-ambedkar, mianwali-district, south-korea — all with ar/en labels, coords `approx`, `source/wikidata`, draft, own-research. `place/shrine-meher-ali-shah` was created then merged away (duplicate of `building/shrine-of-meher-ali-shah`; edge retargeted).
- **Queries attempted on remaining 133**: wbsearchentities by en/ar label variants; nisba matching; region/polity fallbacks; full-record text scan for ~110 place names. Mostly classical stub cards (Tabari/Fihrist/Ansab entries, "draft card — not yet read on the page") with genuinely no named locality; left unresolved rather than guess.
- Validation: `npm run validate` → **0 errors** (51,985 entities). `npm run graph` → `graph: 53973 nodes (51984 entities, 1989 stubs), 96548 edges`.

## Fourth pass — targeted resolution of the 133 unresolved (this session)

- **27 of 133 resolved** → unresolved now **106 of 3,770 (97.2% coverage)**.
- External-ID sweep: extended claims (P19/P20/P119/P551/P937/P69/P27/P39) fetched for all remaining QID holders — only 4 usable place links yielded (Q42332244, Q104398311 P39 offices are offices not places; Q8733/Q238445/Q33296 are polities and were deliberately not written as places).
- Hand-researched batch (23 edges, all `confidence: low` with explanatory notes): institutional/public-record residences for modern figures (ibrahim-hooper → Washington DC/CAIR, henry-ford → Dearborn, george-sale → London, elton-mayo → Adelaide, emile-dermenghem → Algeria, jack-welch → born_in Salem MA, hamza-tzortzis → London, miftah-maulana-habiburrahman → Jakarta, mamurjon-boytorayev → Tashkent, khaled-al-juhaim → Riyadh, karaeng-bisai → Indonesia/Sulawesi, ibn-abi-zamanayn → Cordoba, mikhnaf-ibn-sulaym → Kufa, mai-safoora → India, liu-zhi → China, burhan-al-din-al-bijuri → Bijur via nisba, plus US/Indonesia/Turkey/Egypt/Pakistan/Somalia/Karachi associations for modern media figures).
- **New place entities**: adelaide, nanjing, toronto, dearborn, bijur, salem-massachusetts (ar/en labels, coords approx, `source/wikidata`, draft, own-research).
- Remaining 106: overwhelmingly classical stub cards from Tabari/Fihrist/Ansab/Kamil/Wafayat harvests and prophet/qisas narrative figures (habil, iblis, lut, maryam, dawud, harun) with no named locality in any consulted source; kept unresolved, attempts documented.
- Validation: `npm run validate` → **0 errors** (51,990 entities). `npm run graph` → `graph: 53979 nodes (51990 entities, 1989 stubs), 96602 edges`.

## Fifth pass — consolidated unresolved list (/tmp/geo-unresolved-b.txt, 127 files)

- **50 of 127 resolved** → **77 remaining** on the consolidated list.
- External-ID sweep found no usable new place claims (remaining QIDs return empty or polity-valued claims only; polities were not written as places per predicate ranges).
- **Hand-researched classical edges (29, all `confidence: low` with notes)**: Sasanian kings → `ruler_of` polity/sasanian-empire (bahram-i, bahram-ii, balash-ibn-firuz, farrukhzad-khosrow, khurrazad-khosrow, kisra-ibn-mihrajashnas); `ruler_of` polity/buyid-dynasty (baha-al-dawla); court/city seats: badr-mawla-al-mutadid, bayakbak, bani-ibn-nafis, buran-bint-al-hasan, bint-nizam-al-mulk → Baghdad; itakh → Samarra; inal → Cairo; kitbugha-al-mansuri, bishr-ibn-al-walid-al-kindi → Egypt; bar-daysan → al-Ruha (Edessa); mazdak → Ctesiphon; hisham-al-kalbi, kumayl-ibn-ziyad, mikhnaf-ibn-sulaym → Kufa; barra-bint-abd-al-uzza → Mecca; makhrama-ibn-nawfal → Medina; ibn-khafaja-ibrahim → Valencia; mashaallah, maslama-ibn-muharib → Basra; jurjis-ibn-bakhtishu → Jundishapur; dawud, maryam → Jerusalem; harun → Egypt.
- No new places needed this pass (all targets already existed: al-ruha, ctesiphon, jundishapur, samarra, valencia, kufa, basra, mecca, medina, jerusalem, egypt, baghdad, cairo).
- Remaining 77: classical stub cards and narrative figures with no named locality in consulted sources; kept unresolved rather than guess.
- Validation: `npm run validate` → **0 errors**. `npm run graph` → `graph: 53979 nodes (51990 entities, 1989 stubs), 96660 edges`.

## Sixth pass — consolidated list (/tmp/geo-unresolved-b.txt, 105 files)

- **~69 of 105 resolved → 36 remaining** on the consolidated list.
- New edges (all `confidence: low`, cited to each record's own defined source):
  - **Mughal/Indian courts (`lived_in` place/india):** balchand-painter, bishan-das, govardhan-painter, hashim-painter, manohar-painter, darayat-khan-calligrapher, farrukh-husain (Bijapur), malik-al-muhaddithin (Gujarat), khan-zaman-ali-quli-khan (Jaunpur), hasan-ibn-nuh-al-bahrugi (Bohra Gujarat).
  - **al-Andalus/Cordoba:** ibn-al-nahwi, ibn-baqi-yahya → al-andalus; ibn-battal, ishaq-ibn-ibrahim-ibn-masarra → cordoba.
  - **Iraq:** hisham-ibn-muawiya-al-darir, harith-ibn-badr → kufa; dirar-ibn-muslim → basra; ~20 Abbasid-era Baghdad figures (bani-ibn-nafis, bayakbak, bint-nizam-al-mulk, buran-bint-al-hasan, badr-mawla-al-mutadid, ibn-abi-al-shawarib, ibn-abi-awn, ibn-rizam, ibn-shanabudh, ishaq-al-nubakhti, ishaq-ibn-al-mutadim, fastaqa, ghulam-thalab, ibn-al-anbari-abu-bakr, ibn-al-bazyar, mahmud-al-warraq, mansur-al-majjab, hubaysh-ibn-al-hasan, masarjis, jafar-ibn-harb, ghiyath-ibn-ibrahim) → baghdad.
  - **Hijaz:** bashir-ibn-sad, man-ibn-isa-al-qazzaz, makhrama-ibn-nawfal, jabir-ibn-abdullah-ibn-riab → medina; bashir-ibn-al-khasasiyya → medina; jubayr-ibn-mutim → hudaybiyya; malik-ibn-nuwayra → yemen (broad region per summary).
  - **Other:** maria-al-hakima → egypt; jashnasdah → ruler_of polity/sasanian-empire.
- Rejected/not written: maliha-al-khulani and bichitr edges removed — unsupported/incorrect source for the claim; kept unresolved.
- No new places or sources created (all targets and cited sources already existed; bare-source ids corrected to `source/` ids).
- Remaining 36: narrative/short-card figures with no named locality in any cited source.
- Fixes this pass: 40 missing `place/` prefixes; 1 nonexistent source id.
- Final: `npx tsx scripts/validate.ts` → **0 errors** (8,506 pre-existing warnings); `npm run graph` → `graph: 53979 nodes (51990 entities, 1989 stubs), 96742 edges`.

## Seventh pass — consolidated list (/tmp/geo-unresolved-b.txt, 65 files)

- **60 of 65 resolved → 5 remaining** (bidukh, habil, iblis, iyad-ibn-nizar — mythic/genealogical; diya-al-din-ali — bare stub).
- 31 new `lived_in` edges (`confidence: low`, cited to each record's own defined source):
  - Baghdad Fihrist milieu: babak-ibn-bahram, maliha-al-khulani, hafs-ibn-ashim, ibrahim-ibn-ishaq-al-ibadi, janji-al-jukhani, khusraw-al-arzmaqan, jabal-ibn-yazid, ibn-hilal-al-bakili, ghulam-khalil, hakam-al-wadi → baghdad
  - Basran Azd/Muhallab family: harb-ibn-salm, khalid-ibn-yazid-al-muhallabi, khayra-bint-damra, mansur-ibn-ammar, manjuf-ibn-thawr → basra
  - Kufa: jir-ibn-ghalib; Iraq: husayn-ibn-muhammad-al-talibi → iraq; Khuzistan: khalid-ibn-zayd-al-muzani (siege of al-Sus)
  - Hijaz: fihr-ibn-malik → mecca; dirar-ibn-al-khattab, karima-bint-al-miqdad → medina
  - Broad regions: fatima-bint-sad-al-azdiyya → yemen; mabad-ibn-zurara, ghunayya-al-arabiyya, lut → arabian-peninsula; malik-ibn-abi-amir-al-asbahi, ibn-al-ukhuwwa → egypt; bichitr → india (beach-grand-mogul-1978); empedocles, batlimyus-al-gharib → greece; kenneth-blanchard → united-states
- Reused existing places incl. arabian-peninsula, khuzistan, united-states; no new places/sources.
- `npx tsx scripts/validate.ts` → **0 errors**; `npm run validate` full suite → pass; `npm run graph` → `graph: 53979 nodes (51990 entities, 1989 stubs), 96804 edges`.

## Eighth pass — consolidated list (/tmp/geo-unresolved-b.txt, 34 files)

- **29 of 34 resolved → 5 remaining** (bidukh, habil, iblis, iyad-ibn-nizar — mythic/genealogical figures with no named locality; diya-al-din-ali — bare stub, Wikidata Q16190973 carries no P19/P20/P119/P551/P569/P570 claims).
- Hand-researched edges, all `confidence: low` and cited to each record's own defined source:
  - **Sasanian stubs → `ruled_over` place/iran** (broad region): bahram-i-ibn-hormizd, bahram-ii-ibn-bahram, balash-ibn-firuz, farrukhzad-khosrow, jashnasdah, khurrazad-khosrow, kisra-ibn-mihrajashnas — each summary attests "ملك من ملوك الفرس" (source/tabari-tarikh-abu-al-fadl). `khosrow-ii` also gained `ruled_over` place/iran plus `died_in` place/al-madain (executed at Ctesiphon in Kavadh II's coup; source/tabari-bosworth-1999, source/kaegi-2003).
  - **Text-mined seat/death places:** bad-al-kurdi → `ruled_over` diyarbak-r + `died_in` mosul; baha-al-dawla → `ruled_over` iraq + `died_in` arrajan (توفي بأرجان, shadharat); ishaq-ibn-ali-murabiti → `died_in` marrakesh; karsasf → `ruled_over` yazd (صاحب مدينة يزد); janibeg-khan → `ruled_over` khurasan (ملكها سنة ٧٣٨); mawdud-ibn-masud → `ruled_over` + `died_in` ghazna; iraq-ibn-mansur-khwarazmshah → `ruled_over` khwarizm (the book-sourced medieval-region record; `place/khwarazm` is a Wikidata duplicate kept unmerged); mansur-umar-ibn-ali-rasuli → `ruled_over` yemen; mahmud-shah-bahmani → `ruled_over` deccan-plateau; mansur-ad-din-of-adal → `ruled_over` adal-sultanate; mansur-ibn-nuh → `ruled_over` transoxiana; mansa-musa → `ruled_over` mali + `traveled_to` mecca + `traveled_to` cairo (hajj 724 AH, مرّ بمصر); mansa-sulayman → `ruled_over` mali; mari-jata → `ruled_over` mali; mengu-timur-dashti → `traveled_to` constantinople (marched on it 670 AH); jabala-ibn-al-ayham → `ruled_over` al-sham + `traveled_to` byzantine-empire (دخل بلاد الروم, futuh-buldan); jafar-al-khatti → `lived_in` bahrain + `lived_in` + `died_in` fars (رحل إلى فارس وأقام فيها حتى مات, al-aalam); fathali-hijab-shirazi → `lived_in` shiraz (nisba + Shah Chiragh burial); ibrahim-quli-qutb-shah → `ruled_over` golconda-sultanate.
  - **ivan-iii-moscow**: the erroneous `ruler_of` polity/ottoman-empire edge (source wording misread) replaced by `lived_in` place/russia — same fix documented in the second pass.
  - **idris-shah-i-of-perak**: `born_in` + `died_in` place/perak (Kuala Keboi/Kuala Kangsar both in Perak state, per the record's own born/died notes and cited Wikipedia/Wikidata sources).
- **New place entity**: `place/perak` (Q188953; ar فيرق / ur پیراک / en Perak; coords [4.75, 101] approx; region southeast-asia; source/wikidata; draft; own-research, run person-place-geo-b).
- Queries attempted on the remaining 5: Wikidata extended-claim pulls (Q16190973: only P31/P39/P21/P106/P2671 — no place-bearing claims), nisba and full-text scan; nothing defensible — left unresolved rather than guess.
- Validation: `npm run validate` → **0 errors** (81 pre-existing warnings). `npm run graph` → `graph: 53980 nodes (51991 entities, 1989 stubs), 96880 edges -> .cache/graph.json`.

## Ninth (final) pass — residual list (/tmp/geo-final-b.txt, 5 files)

- **1 of 5 resolved → 4 remaining** — the residual list is now closed as far as defensible evidence allows.
- **`iyad-ibn-nizar`**: `lived_in` place/arabian-peninsula (`confidence: low`; the al-Nuwayri sons-of-Nizar narrative is set in pre-Islamic Arabia; broad region only, consistent with the pass-7 precedent for genealogical figures).
- **Still unresolved (searches documented):**
  - `bidukh` — sorcerers' entity (Iblis's daughter "enthroned on the water", Fihrist p. 432): mythic/proverbial; no locality attested. Searched: full record fields, al-Nadim entry text.
  - `habil` — Abel narrative (al-Tha'labi only): no named locality in the cited source; external burial traditions (Damascus/Qasioun) are outside the record's sources and were not written.
  - `iblis` — narrative adversary; no locality.
  - `diya-al-din-ali` — al-A'lam stub, entry never read on the page; Wikidata Q16190973 carries only P31/P39 (sultan)/P21/P106 (sovereign)/P2671 — no place-bearing claims and contradicting the record's `roles: [scholar]`. Attempted: Wikidata extended-claim pull, `wbsearchentities`, ar.wikipedia + en.wikipedia opensearch for "ضياء الدين علي"/"Diya al-Din Ali", bilingual web search (returned ضياء الدين العراقي and Safavid-era namesakes — none matching). Left unresolved rather than guess.
- No new places or sources needed; no `*-2` slugs introduced.
- Validation: `npm run validate` → **0 errors** (51,991 entities; 8,506 pre-existing warnings; extremism sweep clean). `npm run graph` → `graph: 53980 nodes (51991 entities, 1989 stubs), 96882 edges -> .cache/graph.json`.
