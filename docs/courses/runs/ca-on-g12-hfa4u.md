# Run log: ca-on-g12-hfa4u (HFA4U, Nutrition and Health, Ontario Grade 12)

Start 2026-11-12T06:25Z. End 2026-11-12T06:38Z (times from `date -u`).

## Steps
- 06:25Z `fetch_ontario.py --list "HFA"` listed HFA4C and HFA4U; `fetch_ontario.py "HFA4U" ontario-hfa4u` fetched 5 strands, 17 overall, 75 specific expectations. `ontario_source.py ontario-hfa4u` printed `source/ontario-curriculum-social-sciences-humanities` (existing record, reused).
- Read all 75 expectations. Strand A (15) is research skills: all skills. Strands B, C and E ask for nutrient science, Canada's Food Guide, kitchen and food safety and cooking skills; strand D asks for food security, production and environment.
- Searches: about 40 topic searches with `find_entity.py` (three or more spellings each, run in parallel) and `entity_brief.py` on 28 records. Results are recorded in the gap register.

## Lesson plan (expectation codes)
| Lesson | Title | Expectations |
|---|---|---|
| ca-on-g12-hfa4u-b-1 | When war and plague empty the market | B4.3 |
| ca-on-g12-hfa4u-c-1 | Feeding the child, carrying the child | C1.1 |
| ca-on-g12-hfa4u-c-2 | Belief and the shopping list | C1.2 |
| ca-on-g12-hfa4u-c-3 | Eating for health and in illness | C2.1 |
| ca-on-g12-hfa4u-c-4 | Why people fast | C3.2 |
| ca-on-g12-hfa4u-d-1 | Land and water: the base of food | D1.1 |
| ca-on-g12-hfa4u-d-2 | Withholding food from the market | D1.4 |
| ca-on-g12-hfa4u-d-3 | Changing animals for food | D2.4 |
| ca-on-g12-hfa4u-e-1 | A recipe and the rules of slaughter | E3.4 |
| ca-on-g12-hfa4u-e-2 | Measuring grain, then and now | E3.5 |

Each lesson has one expectation because the expectations that the museum can serve are far apart; the runbook's two to four per lesson would have grouped unrelated ones.

## Honest sentences for each link ("The expectation asks the student to ___; this record shows ___.")
- B4.3 / baghdad-famine-334: explain how factors such as war affect the nutritional status of a group; this record shows prices, the seizure of crops by soldiers and the flight of the weak in a war-time famine, with prices falling when the strife ended.
- B4.3 / famine-iraq-egypt-448: same, for plague and disorder; shows a dearth with plague and looting, and the prices of fruit.
- C1.1 / breastfeeding-and-weaning: analyse infancy and lactation for nutritional needs; shows only a commentator's legal treatment of suckling and maintenance (the Brief says the museum offers legal texts, not nutrition science).
- C1.1 / fasting-while-pregnant-or-nursing: same, for pregnancy and nursing; shows a ruling that weighs harm to the mother or child against the fast.
- C1.2 / halal-haram: explain how influences such as religion affect food choices; shows one scholar's list of lawful, unlawful and doubtful foods.
- C2.1 / hamiyya-diet: explain why eating practices are linked to managing a condition; shows diet in illness as a lawful treatment, with two reported examples.
- C2.1 / fasting-with-chronic-illness: shows how an eating pattern (the fast) is adjusted to named conditions (diabetes, heart disease, high blood pressure, kidney disease, ulcers).
- C3.2 / sawm-ramadan: explain why people adopt an eating pattern; shows the Ramadan fast and the reasons two speakers give.
- D1.1 / agriculture-in-islam and shirb-water-rights: explain the importance of the components of food security; shows rules about who may work land and who may reach water (availability and access), as one legal tradition's rules.
- D1.4 / hoarding fatwa: evaluate food-distribution systems; shows one ruling on one practice, withholding food from sale. The Brief says the systems themselves are the class's.
- D2.4 / GM animal foods fatwa: analyse the effect of agricultural trends (genetic engineering) on supply; shows the definition, aims and conditions in one resolution; the Brief says the effect is the class's to establish.
- E3.4 / dhabaih-fiqh: adapt recipes to religious dietary practices; shows the conditions for a lawful slaughter, which decide which meat items a recipe may use.
- E3.5 / saa and tatfif: measure quantities accurately; shows an old dry measure with two sizes and a rule against short measure (the history around the skill, not the skill).

## Judgement calls
- Not used: work/filaha-nabatiyya ("The Nabataean Agriculture"): the record is Ibn Wahshiyya's corpus of magic and talismans, not agriculture. concept/water-distribution-in-islam: it has no English or Urdu prose, so its English could not follow its own English record; concept/shirb-water-rights was used instead. concept/halal-lawful: a general definition of the lawful, little about food. concept/tayyib: about acceptance of deeds, not food. work/fatwa-aliftaa-jo-understated-calories-on-a-product-label (B1.3): about honesty in selling, not reading nutrition data. work/fatwa-aliftaa-jo-poultry-raised-on-animal-protein-feed: a purity ruling on feed, not a trend in agriculture. concept/simad (fertilizer, D2.2): purity and sale of manure, nothing on methods or yields. concept/poverty-and-sufficiency-in-islam (D1.3): defines a poverty line, not food insecurity. concept/environmental-protection-in-islam (D3.x): one author's essay on pollution, no law and no food supply. concept/athar-al-iqlim (D2.1): Ibn Khaldun on climate and temperament, nothing on food supply. work/al-mufradat-ibn-baytar and work/al-hawi-fi-al-tibb (B1.x): materia medica in a humoral frame, not nutrient content.
- The famine records contain graphic passages (eating the dead); the connection texts leave them out and keep to prices, crops, flight and recovery.
- Disagreement between the record's Arabic and English, event/famine-iraq-egypt-448 (Arabic summary: القحط, "dearth"; English prose: "famine", English summary: "drought"): written as "dearth" / القحط. For the IIFA resolution (Arabic: مقاومة الآفات, "resistance to pests"; English: "resistant to disease"): written as "resistance" only in all three languages.
- Disagreement between two speakers in the sawm-ramadan record: Omar Abdelkafy says one wisdom of fasting is to feel the state of the hungry; al-Sha'rawi says the aim is not that the faster feel the poor's hunger. The lesson uses al-Qaradawi and al-Sha'rawi only, each attributed, and leaves al-Abdelkafy out rather than set the two opposed views side by side as if they agreed.
- The Qur'an: C-1 connection names the nursing verse by number (al-Baqara 2:233) as the commentary's subject, as the record does, and says to read it in the museum's text; it does not paraphrase or quote it. No Qur'an connection was written.
- kind choices: legal and ethical concepts, fatwas and events used as `reflection` or `story` (famines as `story`, the sa' as `object`); see Proposals.
- The sa' record is itself a draft card ("the page not yet checked") but its prose cites the Kuwaiti encyclopaedia pages; the connection restates only the cited prose.
- Connection texts in English run 75 to 84 words for three connections (c-4, d-3 and e-1); the gate does not count words, and the extra words are the closing question and the "museum records this as a document" sentence.
- Strand A (15 expectations) went to the register as skills; strand D3 (4) has no lesson, so there is no D3 content at all.

## Counts
Units 4 (B, C, D, E), lessons 10, connections 15 (15 distinct records), expectations in lessons 10 of 75, in the gap register 65 (15 skills expectations without subject matter, 50 with searches).

## More lessons possible
None beyond those written. Two weaker links I judged too thin to write: B1.3 (the calorie-label fatwa) and D1.3 (poverty and sufficiency).

## Problems with the runbook
- zsh: `read -a` and `echo =====` fail (the second is parsed as a command); not a runbook problem but it cost a call. 
- The runbook's step 5 says a lesson groups two to four expectations; for this course the museum's records match single expectations, so lessons have one each. The gate accepts it.
- `entity_brief.py` prints `prose (ar)` only when a record has no English prose; a missing English or Urdu section is easy to miss (concept/water-distribution-in-islam). The runbook could say: check that the record has all three languages before choosing it.

## Proposals
- Connection kinds: no `concept`, `practice`, `event`, `work` or `art` kind; fatwas, legal concepts and famine events went to `reflection` and `story`.
- A `skills` flag for expectations that name no subject matter, so they need not each carry a placeholder search.
- A link from each expectation to the authority's page, so texts cut at 40 words can point to the full wording.
- Records the museum lacks and an HFA4U student would want: a nutrition and food-guide hub, Prophetic-medicine dietary advice with sources (sunna of eating), the medieval Islamic agricultural revolution, qanats and norias, and the bimaristan's diet therapy.

## Corrections after the fleet review
Review: docs/courses-mission/verifier/fleet-flagged.md. Lesson ca-on-g12-hfa4u-e-1 was KEEP and is unchanged.

- **c-1 (nursing and fasting while pregnant), KEEP-BUT-FIX.** Fatwa card: "answered that fasting is obligatory" became "answered that, in its view, fasting is obligatory" (ar "بأن الصيام، في رأيها، يجب"; ur "جواب دیا کہ اس کی رائے میں"), and "The text does not say who judges whether harm is feared" was added before the closing question (ar "ولا يذكر النص من يقدّر وقوع الضرر المخوف"; ur "متن یہ نہیں بتاتا کہ خوف کیے گئے نقصان کا فیصلہ کون کرے"). Brief gained, in all three languages: neither text is evidence about nutritional needs and the lesson uses them as examples of how a community's rules respond to a life stage; the fatwa does not say who judges the feared harm; this is the history of a ruling, not medical advice, and a pregnant or nursing person should ask her doctor. The Sha'rawi card is unchanged. The fatwa connection was kept, as the reviewer allowed.
- **c-3 (eating for health and in illness), KEEP-BUT-FIX plus MOVE-TO-GAP of one connection.** The chronic-illness fasting fatwa connection (work/fatwa-aliftaa-jo-fasting-with-diabetes-heart-disease-and-other-chronic-illness) was deleted from the lesson, with its two evidence rows and the sentences naming it in the Brief and Try this (all three languages). The lesson keeps the hamiyya connection, so it stays and C2.1 stays in it; no gap entry was needed. Hamiyya card: "Diet must follow..." became "The encyclopaedia adds that the diet is to follow ..." plus the historical-reports-not-advice line; English "barley and soup" became "barley and chard (silq)"; Urdu "جو اور چقندر (سلق)" became "جو اور سلق، یعنی چقندر کے خاندان کا ساگ". Brief rewritten to describe one text, say it gives its own reason (keeping the sick from what harms) but no medical or nutritional account, and carry the not-advice sentence; summary no longer mentions the fatwa; Try this table now reads "the example, the change in eating, and the reason the text gives".
- **Record defect, not fixed here.** concept/hamiyya-diet English says "soup" where its Arabic says السلق; the card follows the Arabic.
- **Judged and not applied:** none. The hfa4u C2.1 expectation is arguably still only loosely served by hamiyya alone (the text gives no medical reason linking a practice to a condition); I followed the reviewer's verdict to keep it, and the Brief now says so.

## Corrections after the sweep review

Source: docs/courses-mission/verifier/sweep-secondary-social-languages.md. Applied by a fix agent (Claude Code; claude-sonnet-5-5), 2026-11-12.

- ca-on-g12-hfa4u-b-1, event/baghdad-famine-334 (and the 448 record), FIX, with the order to keep the lesson away from the graphic accounts: the Brief gains "The linked records contain graphic accounts of the famine." (ar, ur the same). The Try this no longer sends the student to read the two records: old "Read [the Baghdad famine of 334 AH] and [the general famine and plague of 448]. Make a two-column table: what each writer names as a cause, and what each says happened to what people ate." -> "Use the two cards above ... Make a two-column table: what each writer names as a cause, and what changed in prices, crops or harvest, up to the recovery when the card gives one. Stay with the prices and the causes; you do not need to read the records to do this." The section line "Read each account for ..." became "Take the card for each case and look at ...". The cards themselves are unchanged (the review found them mild). The card for 448 still says people ate carrion, which is the writer's own cause-and-effect line; it was not changed because the review did not ask for it.
- ca-on-g12-hfa4u-c-2, concept/halal-haram, FIX: en "crops, fruits and cattle" -> "crops, fruits and livestock"; the card opens "This is Ibn Rajab's classification of rulings and things, not a food list" (ar, ur the same); its title "Lawful, unlawful and doubtful foods" -> "Lawful, unlawful and doubtful" (ar, ur the same) so it does not read as a food list; the Brief gains "This is a religious classification, not dietary guidance."
- ca-on-g12-hfa4u-c-4, practice/sawm-ramadan, FIX: the Brief gains one sentence: the reasons are those of religious teachers, not nutritional or health advice, and the linked record also holds a ruling on fasting for diabetics, which is the history of a ruling and not medical guidance (ar, ur the same). The Try this now says "find only the two passages" from al-Qaradawi and al-Sha'rawi. The card was not changed.
- ca-on-g12-hfa4u-d-1, concept/agriculture-in-islam, FIX: old "forbids farming usurped land. Reviving dead land gives title, and a tract left unworked for three years may pass to another who works it, subject to the ruler's permission in practice." -> "warns against farming usurped land. He holds that whoever revives dead land has the best claim to it, and that a tract left unworked for three years may be worked by another, conditioned on the ruler's leave." Arabic and Urdu now attribute the same two rules to al-Maraghi ("ويذكر أن ..."; "وہ لکھتے ہیں کہ ..."). The Brief gains "The fit is loose: these are rules about land and water, not measures of any component of food security."
- ca-on-g12-hfa4u-d-2, work/fatwa-aliftaa-jo-hoarding-food-for-higher-prices, FIX: the Brief gains "The record is a ruling on one practice, not a system." (ar, ur the same).
- ca-on-g12-hfa4u-e-2, concept/saa and concept/tatfif-short-measure, REMOVE: both connections go, so the whole lesson, its three prose files and its evidence rows were deleted and the lesson removed from unit E; E3.5 moved to the gap register with two searches. The unit E summary and Brief, and the subject's summary and prose (ten lessons -> nine; "measures" dropped from the list of topics), were corrected to match.

Verdicts not applied: none.
