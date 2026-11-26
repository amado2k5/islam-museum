# Hudhud reviewer briefs

_26 November 2026. Documents only; sent to nobody. These briefs prepare the human review the game is waiting on. A reviewer is not being asked to approve “Islamic content” in general, copyedit the game, or validate portraits of real people. They are asked to rule on specific claims, representations and risks from the quest dossiers. **Historical review remains pending for every subject.**_

## Common rules for every reviewer

1. Review the dossier claims, not the AI author's confidence. Each dossier is under `docs/gaming/hudhud/dossiers/`; draft claim rows are in `ledger-drafts.json`, outside the real historical-review ledger.
2. Distinguish four kinds of material:
   - **supported**: a museum record/source supports the claim closely enough for a children's game;
   - **uncertain/contested**: the claim may be true but the record is thin, late, disputed or ambiguous;
   - **invented for play**: a scene, object, conversation, mechanism or compression created for the game;
   - **unsupported**: present in the reference art or design but not supported and therefore not usable as fact.
3. Never rule from memory alone. Name the record/source you used, or write `not enough evidence`.
4. A ruling may be `allow`, `allow with exact wording`, `allow only as labelled invention`, `change`, `remove`, or `escalate to founder`.
5. Review age fit separately from truth. A true claim can still be unsuitable for the intended scene or age band.
6. Do not judge whether the game is beautiful or fun. That belongs to playtesting and art review.
7. If a question crosses specialties, say which other reviewer must rule. Do not silently answer outside your specialty.

## Required form of a ruling

```text
Ruling id:
Reviewer specialty:
Subject and dossier version/commit:
Claim or representation reviewed:
Evidence read (records/sources):
Ruling: allow / exact wording / labelled invention / change / remove / escalate
Reason, in two to five sentences:
Exact replacement wording or design constraint, if any:
Age-fit concern, if any:
Further specialist needed, if any:
Date and reviewer initials or agreed pseudonym:
```

No reviewer's legal name, address, employer or personal detail goes into the repository unless the founder explicitly chooses that form of credit.

## 1. Science and medicine

**Scope.** Astronomy, mathematics, optics, mechanics, measurement, engineering, natural philosophy, medicine, surgery, pharmacology and the functioning of instruments. This reviewer must catch both false claims and objects that look scientific but could not work.

**Asked to rule on**

- whether each claimed discovery, invention, measurement or practice is supported closely enough for the game;
- whether simplified game mechanisms preserve the truthful core or accidentally teach a falsehood;
- whether instruments, vessels, surgical tools, engines, clocks, observatories and measuring devices are mechanically plausible;
- whether modern scientific hindsight is being projected backwards;
- whether medicine is shown as care and observation rather than as a safe instruction children should imitate;
- correct uncertainty language where the evidence is late, traditional, disputed or incomplete.

**Subjects falling primarily to this reviewer**

- World 1: `abbas-ibn-firnas`, `al-sufi`, `al-tusi`, `ibn-al-shatir`, `al-battani`
- World 2: `al-jazari`, `al-khwarizmi`, `al-kindi`, `banu-musa`
- World 3: `ibn-al-haytham`, `al-biruni`, `al-karaji`, `thabit-ibn-qurra`
- World 4: `ibn-al-nafis`, `ibn-sina`, `al-zahrawi`, `al-razi`, `ibn-zuhr`
- Shared/secondary: `ibn-al-baytar` for botany/pharmacology; `al-qazwini` for natural-history compilation; `pigeon-post` only if a biological claim is made.

**Known test case.** The prism in the Ibn al-Haytham reference pictures is unsupported by the museum records read and is currently removed. This reviewer should not reinstate it unless evidence is produced.

## 2. Architecture, material culture and dress

**Scope.** Buildings, cities as built fabric, clothing, textiles, ornament, tools, furniture, manuscripts as objects, ships, animals' equipment, food objects, musical/visual material culture, and whether a visual reference mixes places or centuries.

**Asked to rule on**

- whether architecture is identifiable, composite or impossible, and how it must be labelled;
- whether dress and headwear fit place, century, gender, age and status, or whether the design is explicitly modern/composite;
- whether ornament is geometric/plant-like without fake script or sacred text used as decoration;
- whether objects are physically possible: hinges, shelves, lamps, canals, looms, book storage, ships, instruments and building structure;
- where the founder's art references fuse regions or centuries and must not be copied literally;
- whether wealth, palaces or “eastern” clutter are being used as lazy shorthand.

**Subjects falling primarily to this reviewer**

- World 5: `fatima-al-fihri`, `house-of-wisdom` for institutional/building representation
- World 7: `timbuktu`; `coffee` for material culture; `mansa-musa` for dress/wealth representation
- World 8: `mimar-sinan`, `alhambra`, `nur-al-din`, `salah-al-din`, `ibn-khaldun`
- World 10: `samarqand`
- Cross-cutting: every human costume in every world; the hub architecture; ships in worlds 6–7; books and libraries everywhere; instruments in worlds 1–3.

**Known test case.** `alhambra` must not be called a reconstruction of the whole palace or used as generic evidence for all Islamic palaces. Any composite game architecture must say composite.

## 3. Geography and travel

**Scope.** Routes, maps, distances, coasts, rivers, deserts, ports, seasons, travel times, trade networks, geographical scope of journeys, and the distinction between a documented journey and later literary or national myth.

**Asked to rule on**

- whether route simplification still teaches correct geography;
- whether places are in the right region and relation to one another;
- whether travel times, caravan/ship movement and seasonal constraints are plausible;
- whether a map is a modern game abstraction or presented as a historical map;
- whether a journey attributed to a person is supported, exaggerated or conflated with another traveller;
- whether coastal, river and sea imagery fits the actual geography.

**Subjects falling primarily to this reviewer**

- World 3: `al-biruni`, `al-idrisi`, `al-karaji` where measurement, maps and water geography are used
- World 6: `ibn-battuta`, `ibn-jubayr`, `evliya-celebi`, `al-hasan-al-wazzan`, `al-masudi`
- World 7: `sailor-of-sohar`, `sindbad`, `mansa-musa`, `timbuktu`
- World 10: `samarqand` as a place and route node
- Cross-cutting: the Atlas/hub golden path and every compressed journey map.

**Known test cases.** No named historical “Sailor of Sohar” was found in the records read. Sindbad belongs to story tradition, not a documented traveller; any route must be labelled literary, not biographical.

## 4. Literature, story and educational language

**Scope.** Poets, storytellers, story collections, adab, animal fable, wisdom literature, authorship, transmission, manuscript culture, and the difference between a historical person, a narrator, a character and a compiler.

**Asked to rule on**

- whether authorship and transmission claims are accurately bounded;
- whether animals, marvellous creatures or fictional events are clearly framed as story rather than natural history or biography;
- whether excerpts or adaptations preserve tone without inventing quotations;
- whether poetry, wisdom and moral meaning are simplified without becoming preachy or anachronistic;
- whether child-facing language explains the literary device honestly;
- whether sacred or religious texts are being used only within the museum's strict rules.

**Subjects falling primarily to this reviewer**

- World 5: `al-khalil`, `karima-al-marwaziyya`, `rashid-al-din` where language/compilation is central
- World 7: `sindbad`
- World 9: `al-jahiz`, `al-qazwini`, `monkey-and-tortoise`
- World 10: `wallada`, `nana-asmau`, `al-ghazali`, `usama-ibn-munqidh`
- Secondary: `sailor-of-sohar` if framed through sea-story tradition; `coffee` if story/legend is used.

**Known test case.** `monkey-and-tortoise` must be reviewed as a literary animal story. Its animal speech and moral compression are invention for play unless the exact source wording is used and cited.

## 5. Cities, politics and society

**Scope.** Rulers, patronage, administration, war and peace, social groups, education institutions, trade policy, endowments, urban welfare, slavery/captivity where present, sectarian or political conflict, and how power is represented to children.

**Asked to rule on**

- whether political claims are attributed and bounded rather than turned into simple hero/villain stories;
- whether war, conquest, captivity, slavery, disease or religious conflict are present in the evidence and how age fit is handled;
- whether patronage is distinguished from personal authorship or invention;
- whether cities are shown as living societies rather than monuments to rulers;
- whether endowment, welfare, hospitals, schools, markets and trade rules are represented accurately enough;
- whether the museum's hard content-safety rules and perspectives rules are triggered.

**Subjects falling primarily to this reviewer**

- World 5: `fatima-al-fihri`, `house-of-wisdom`, `karima-al-marwaziyya`, `rashid-al-din`
- World 7: `coffee`, `mansa-musa`, `timbuktu`
- World 8: `nur-al-din`, `salah-al-din`, `ibn-khaldun`; `mimar-sinan` and `alhambra` where patronage/political setting matters
- World 10: `nana-asmau`, `al-ghazali`, `usama-ibn-munqidh`, `samarqand`
- Cross-cutting: any use of war, sectarian labels, slavery/captivity, death, religious difference or contested modern memory.

## Output expected back

A reviewer need not write polished prose. The game team needs clear rulings in the form above. If a reviewer can review only one subject or one world, that is still useful. A negative or uncertain ruling is valuable and must not be treated as obstruction.
