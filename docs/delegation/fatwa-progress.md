# Fatwa lane — progress

Lane: `fatwa` (`docs/agents/lanes.md`; plan `docs/plan/25-fatwa-explorer.md`).

## Batches

- `fatwa-websites-33` (16 Nov 2026, Devin / SWE-2 Medium): 3 new IIFA resolution records —
  `work/fatwa-iifa-267-eating-insects`, `work/fatwa-iifa-263-stunning-before-slaughter`,
  `work/fatwa-iifa-259-loan-increase-third-party-letter-of-guarantee`.
  All three were read on iifa-aifi.org (URLs on the records); each deferred the question for further study,
  and the records say so plainly. Source: `source/iifa` (pointer-only, as on the earlier IIFA records).
  Same batch, later in the run: `work/fatwa-iifa-258-artificial-intelligence`,
  `work/fatwa-iifa-257-istishab`, `work/fatwa-iifa-256-childhood-care` (substantive resolutions,
  read on iifa-aifi.org).
  Then `work/fatwa-iifa-239-education-of-males-and-females`,
  `work/fatwa-iifa-243-prayer-behind-phone-radio-television`,
  `work/fatwa-iifa-240-covid-worship-family-crimes`,
  `work/fatwa-iifa-241-covid-contracts-financial-obligations`,
  `work/fatwa-iifa-242-non-arabic-recitation-in-prayer`,
  `work/fatwa-iifa-244-social-media-rulings` (25th session, Jeddah 1444/2023; read on iifa-aifi.org).
  Batch total: 12 records. YAML self-check passed for all 18 `fatwa-iifa-*` files (id/kind/lang/sources/provenance).
  Then `work/fatwa-iifa-245-foundlings-unknown-lineage`,
  `work/fatwa-iifa-246-street-children-child-labour`,
  `work/fatwa-iifa-247-maqasid-financial-transactions`,
  `work/fatwa-iifa-248-debt-rollover-hybrid-sukuk`,
  `work/fatwa-iifa-249-modern-mental-illness-capacity`,
  `work/fatwa-iifa-250-abortion-after-rape`,
  `work/fatwa-iifa-251-sex-change`,
  `work/fatwa-iifa-252-islamic-social-finance-humanitarian`,
  `work/fatwa-iifa-253-bequests-against-poverty` (25th session 25/7–25/15; read on iifa-aifi.org).
  249, 250 and 253 defer the question for further study; the records say so plainly.
  Batch total so far: 21 new records (27 `fatwa-iifa-*` files in data/work).
  Index page 4 (24th session, Dubai 1441/2019) complete:
  `work/fatwa-iifa-254-ijara-ending-in-ownership`,
  `work/fatwa-iifa-255-letter-of-guarantee-documentary-credit`,
  `work/fatwa-iifa-230-smart-contracts`,
  `work/fatwa-iifa-231-inflation-currency-value`,
  `work/fatwa-iifa-232-fidic-contracts`,
  `work/fatwa-iifa-233-tolerance-in-islam`,
  `work/fatwa-iifa-234-food-water-security`,
  `work/fatwa-iifa-235-human-genome-bioengineering`,
  `work/fatwa-iifa-236-religious-education-peace`.
  254, 255 and 230 defer the ruling pending study; the records say so plainly.
  Batch total: 30 new records, 36 `fatwa-iifa-*` files in data/work, all YAML-validated.
  Index page 5 (23rd session, Medina 1440/2018 + one 24th) complete:
  `work/fatwa-iifa-237-electronic-currencies`,
  `work/fatwa-iifa-238-hedging-islamic-financial-institutions`,
  `work/fatwa-iifa-229-dignified-coexistence-declaration`,
  `work/fatwa-iifa-228-sukuk-committee-proposals`,
  `work/fatwa-iifa-227-marriage-contract-spouses-property`,
  `work/fatwa-iifa-226-predominance-subordination-financial-transactions`,
  `work/fatwa-iifa-225-halal-smiic-queries`,
  `work/fatwa-iifa-224-hedging-controls-rulings`,
  `work/fatwa-iifa-223-physician-liability-medical-errors` (marked a draft resolution on the source page).
  Batch total: 39 new records, 45 `fatwa-iifa-*` files, all YAML-validated.
  Index page 6 (rest of 23rd session + 22nd session, Kuwait 1436/2015) complete:
  `work/fatwa-iifa-222-bank-perks-current-account`,
  `work/fatwa-iifa-221-measures-against-extremism`,
  `work/fatwa-iifa-220-female-circumcision`,
  `work/fatwa-iifa-219-fasting-nullifiers-medicine`,
  `work/fatwa-iifa-218-insolvency-bankruptcy`,
  `work/fatwa-iifa-217-marriage-of-minors`,
  `work/fatwa-iifa-205-shura-democracy`,
  `work/fatwa-iifa-206-smiic-questions`,
  `work/fatwa-iifa-207-jihad-al-talab-wal-daf`.
  206 is a referral back to the secretariat (recorded as such); 223 on page 5 was a draft resolution.
  Batch total: 48 new records, 54 `fatwa-iifa-*` files, all YAML-validated, no typed honorifics.
  Index page 7 (rest of 22nd session, Kuwait 1436/2015) complete:
  `work/fatwa-iifa-208-takfir-of-a-muslim`,
  `work/fatwa-iifa-209-non-muslim-citizens`,
  `work/fatwa-iifa-210-istihala-istihlak-additives`,
  `work/fatwa-iifa-211-women-public-offices`,
  `work/fatwa-iifa-212-bank-guarantee-investment-losses`,
  `work/fatwa-iifa-213-rights-of-disabled`,
  `work/fatwa-iifa-214-predominance-subordination-referral` (referral; continued by 226 (23/10)),
  `work/fatwa-iifa-215-cooperative-insurance-issues`,
  `work/fatwa-iifa-216-visiting-jerusalem`.
  Validation pass over all 63 `fatwa-iifa-*` files: YAML parses, required fields, trilingual
  summaries, all relation targets and sources resolve, no typed honorifics. Bad targets fixed:
  daman→kharaj-bil-daman, talaq-fiqh→talaq, tadakhkhum→al-tadakhkhum, istisna→muamalat,
  mudaraba→qirad, ziyarah/masjid-al-aqsa→ziyarat-al-qubur/place-al-aqsa-mosque,
  rukh-sa→rukhsa-usul.
  Batch total: 57 new records, 63 `fatwa-iifa-*` files.

## Batch 6 — index page 8 (21st session, Riyadh, 15–19 Muharram 1435 / 18–22 Nov 2013)

Source index: `https://iifa-aifi.org/ar/القرارات/page/8` — all 9 resolutions on the page recorded (run `fatwa-websites-33`):

- `fatwa-iifa-195-hedging-deferral` — 195 (21/1) hedging in financial transactions: **deferral** for further research, incl. sharia alternatives to conventional hedges (later taken up in 224 and 238) — ar/2382.
- `fatwa-iifa-196-islamic-sukuk-continued` — 196 (21/2) completing Islamic sukuk: deferral/instalment/advance of rent in liability leases, trading of sukuk before specifying the leased object, mixed-asset issuance under the predominance/subordination rules (predominance & subordination criteria themselves deferred — completed in 214 and 226) — ar/2385.
- `fatwa-iifa-197-driver-criminal-liability` — 197 (21/3) criminal liability of drivers for speeding and recklessness: traffic rules binding, reckless acts prohibited and compensated, ta'zir for the ruler — ar/2388.
- `fatwa-iifa-198-istihala-food-medicine` — 198 (21/4) istihala, istihlak and additives in food and medicine: complete chemical transformation renders impure/forbidden animal-derived additives lawful (blood plasma lawful; blood products without istihala forbidden); istihlak deferred — ar/2392.
- `fatwa-iifa-199-depicting-prophets-companions` — 199 (21/5) depicting prophets and Companions in artworks: **deferral** — ar/2394.
- `fatwa-iifa-200-cooperative-insurance-foundations` — 200 (21/6) cooperative insurance foundations: cooperative vs commercial insurance, 12 differences, 21 governing articles (fund management, wakala/mudaraba, surplus, deficit & qard hasan, reinsurance, sharia supervision, liquidation, subrogation) — ar/2396.
- `fatwa-iifa-201-slaughter-after-electric-stunning` — 201 (21/7) slaughter after electric-shock stunning: reaffirms resolution 95 (10/3), committee for field visits to meat-exporting countries, SMIIC certificate credibility — ar/2410.
- `fatwa-iifa-202-dialogue-among-schools` — 202 (21/8) dialogue among followers of the Islamic schools: definition, courtesies, foundations (agreed reference, accord/dissent boundary, ijtihad questions as the field), 2005 Mecca summit plan adopted; recommendations incl. inviolability of Muslims' blood and no organised cross-school proselytising — ar/2412.
- `fatwa-iifa-203-genetics-human-genome` — 203 (21/9) genetics, genetic engineering and the human genome: genome reading controls, somatic vs germline gene therapy, genetic engineering in humans vs plants/animals, genetic counselling, screening rulings (pre-marital, pre-implantation, prenatal, neonatal) — ar/2416.

Validation after batch: **72 IIFA files, 0 issues** (YAML parse, class/kind, trilingual label+summary, source/iifa, publisher stub, provenance block, about-targets exist, no typed honorifics).

## Batch 7 — 20th session completed (Oran, 26 Shawwal–2 Dhu al-Qada 1433 / 13–18 Sep 2012) + resolution 204

Source: sessions archive `https://iifa-aifi.org/ar/دورات-المجمع` (the public paginated index 404s at page 9). Run `fatwa-websites-33`. With 186–188 written earlier, the full 20th session (186–194) is now covered, plus the last unrecorded 21st-session item:

- `fatwa-iifa-189-maintenance-contracts` — 189 (20/4) maintenance contracts: definition, types (attached/estimated), rulings incl. penalty clauses, warranty overlap — ar/~2345.
- `fatwa-iifa-190-fiqh-academies-role` — 190 (20/5) the role of fiqh academies in guiding Islamic financial institutions: recommendation-style resolution — ar/~2348.
- `fatwa-iifa-191-prisoners-rights` — 191 (20/6) rights of the prisoner in Islamic jurisprudence: dignity, medical care, family contact, religious practice; recommendation-style — ar/2354.
- `fatwa-iifa-192-death-penalty` — 192 (20/7) the death penalty from the Islamic perspective: legitimacy in the three cases (qisas, hudud, ta'zir for egregious crime), strict procedural controls — ar/2358.
- `fatwa-iifa-193-genetics-deferral` — 193 (20/8) genetic engineering and the human genome: **deferral**; completed in resolution 203 (21/9) after the Jeddah medical seminar — ar/2362.
- `fatwa-iifa-194-evidence-presumptions` — 194 (20/9) proof by circumstantial evidence and indicia (new developments): qarina definition, conclusive evidence usable for financial rights and crimes except hudud/qisas, genetic fingerprint as strong evidence for lineage (several laboratories), not to negate lineage nor override li'an — ar/2364.
- `fatwa-iifa-204-infighting-deferral` — 204 (21/10) fighting between Muslims in the name of jihad: **deferral** for further research — ar/2427.

Target fixes this batch: `huqum`→`uquba` (doesn't exist), `qada`/`nasab-fiqh`→`ithbat`/`nasab`, `al-handasa-al-wirathiyya`→`la-darar`.

Validation after batch: **82 IIFA files, 0 issues** (YAML parse, class/kind, trilingual label+summary, source/iifa, publisher stub, provenance block, about-targets exist, no typed honorifics).

IIFA coverage now: resolutions 186–267 contiguous except gaps at 210–216 region filled earlier — full run 186–267 minus any items the Academy did not publish in this numbering (none observed); plus unnumbered recent items from index pages 1–2. Older sessions (19 → 1, pre-186 numbering) remain.

## Batch 8 — 19th session (Sharjah, 1–5 Jumada al-Ula 1430 / 26–30 Apr 2009) — all items

Source: sessions archive `https://iifa-aifi.org/ar/دورات-المجمع`. Run `fatwa-websites-33`. Full session covered: resolutions 175–185 plus the unnumbered session statement.

- `fatwa-iifa-175-religious-freedom` — 175 (19/1) religious freedom in Islamic law: established principle joined to responsibility; no compulsion; doctrinal diversity natural; apostasy/takfir fatwas reserved to scholars with court-supervised istitaba; publicly proclaimed apostasy treated as a punishable danger to social unity (summarised neutrally) — ar/2292.
- `fatwa-iifa-176-freedom-of-expression` — 176 (19/2) freedom of expression: protected right within controls (no injury to honour/reputation, objectivity, lawful means, etiquette of disagreement) — ar/2294.
- `fatwa-iifa-177-sharia-supervision` — 177 (19/3) sharia supervision of Islamic banks: definition, three components (supervisory board ≥3 specialists with binding decisions and GA-secured independence, internal supervision, external sharia audit) — ar/2297.
- `fatwa-iifa-178-islamic-sukuk-securitisation` — 178 (19/4) Islamic sukuk (securitisation): conventional securitisation impermissible; taskik defined; six sukuk properties; no manager undertaking to cover shortfalls; trustee liability only for breach; redemption at market not nominal; tradability per resolution 30 (4/5); no using permissibility to securities debts; contemporary applications — ar/2300.
- `fatwa-iifa-179-tawarruq` — 179 (19/5) tawarruq: classical tawarruq permissible under sale conditions; organised and reverse tawarruq impermissible as collusive riba; qard hasan recommended — ar/2302.
- `fatwa-iifa-180-family-violence` — 180 (19/6) violence within the family: definition and prohibition; the Academy's list of what it does not count as violence; graded conflict sequence (admonition → bed separation → 'non-severe beating' qualified as near-gesture and contrary to the preferable, citing that the Prophet never struck a woman → two arbiters → divorce); recommendations at family/institutional/international levels (summarised neutrally) — ar/2304.
- `fatwa-iifa-181-waqf-shares-sukuk` — 181 (19/7) waqf of shares, sukuk, intangible rights and usufructs: all valid as waqf; retention of endowed shares; substitution rules; usufruct/services/cash waqf; temporisation; cleansing suspect wealth via public-charity waqf — ar/2307.
- `fatwa-iifa-182-bot-contracts` — 182 (19/8) Build–Operate–Transfer (BOT) contracts for developing awqaf and public facilities: novel contract, permissible; further research recommended — ar/2310.
- `fatwa-iifa-183-diabetes-fasting` — 183 (19/9) diabetes and fasting (with the Islamic Organisation for Medical Sciences): diabetes types; four-category patient risk classification; fasting ruling per category — ar/2312.
- `fatwa-iifa-184-emergency-medical-consent` — 184 (19/10) consent for emergency medical procedures (completing 67 (7/5) and 172 (18/10)): emergencies defined; competent patient's consent obligatory, physician may act under necessity; incapacitated patient's guardian's refusal disregarded, consent passes to public authority — ar/2314.
- `fatwa-iifa-185-environment` — 185 (19/11) the environment from an Islamic perspective: prohibition of harmful-waste dumping and of acts upsetting ecological balance; WMD removal; waqf for the environment; Academy environment committee; legislation and criminal penalties recommended — ar/2316.
- `fatwa-iifa-session19-palestine-statement` — unnumbered statement on Palestine, Iraq, Somalia and Sudan (statement, not a resolution; summarised neutrally) — ar/2643.

Validation after batch: **94 IIFA files, 0 issues** (YAML parse, class/kind, trilingual label+summary, source/iifa, publisher stub, provenance block, about-targets exist, no typed honorifics).

IIFA coverage now: sessions 19–26 complete (resolutions 175–267 plus unnumbered items). Older sessions 1–18 remain (resolutions ~1–174).

## Batch 9 — 18th session (Putrajaya, 24–29 Jumada al-Akhira 1428 / 9–14 Jul 2007) — all items

Run `fatwa-websites-33`. Full session covered: resolutions 163–174.

- `fatwa-iifa-163-civilisational-method` — 163 (18/1) outlines of a return to the civilisational method in Islam (programmatic) — ar/2252.
- `fatwa-iifa-164-human-resource-development` — 164 (18/2) human resource development in the Islamic world — ar/2257.
- `fatwa-iifa-165-zakat-poverty` — 165 (18/3) activating zakat against poverty: ijtihad on unlisted wealth, eight-category coverage, disbursement timing, sufficiency standard — ar/2261.
- `fatwa-iifa-166-islamophobia` — 166 (18/4) Islamophobia: strategic response framework (summarised neutrally) — ar/2266.
- `fatwa-iifa-167-maqasid-istinbat` — 167 (18/5) maqasid and their role in deriving rulings: definition, ijtihad functions, human-rights frame, no suspension of texts/ijma' — ar/2268.
- `fatwa-iifa-168-age-of-puberty` — 168 (18/6) age of puberty and taklif: discernment at 7; minors' transactions tripartite; puberty by signs or completion of 15 — ar/2270.
- `fatwa-iifa-169-muslim-woman-rights` — 169 (18/7) rights and duties of the Muslim woman (recommendation-style; summarised neutrally) — ar/2273.
- `fatwa-iifa-170-timesharing` — 170 (18/8) time-sharing ownership contract: definition, full vs usufruct forms, permissibility of buying/leasing undivided shares with time-allocated use — ar/2276.
- `fatwa-iifa-171-easements` — 171 (18/9) easement rights (shurb, masil, passage, elevation): causes, baseline rule (benefits free, harms prohibited), contemporary easements (utilities), private parking — ar/2278.
- `fatwa-iifa-172-emergency-surgery-consent` — 172 (18/10) consent for urgent surgery: three no-consent emergency cases, five intervention conditions; refusals deferred — completed by 184 (19/10) — ar/2281.
- `fatwa-iifa-173-cosmetic-surgery` — 173 (18/11) cosmetic surgery: definition and 8 conditions; necessary/need-level surgery permissible (reconstruction, congenital and acquired defects, disfigurement); beautification altering sound creation impermissible — ar/2283.
- `fatwa-iifa-174-fast-nullifiers-deferral` — 174 (18/12) completing the review of fast-nullifiers (appended to 93 (10/1)): **deferral** — ar/2287.

Validation after batch: **106 IIFA files, 0 issues**.

IIFA coverage now: sessions 18–26 complete (resolutions 163–267 + unnumbered items). Sessions 1–17 remain (~1–162).

## Batch 10 — 17th session (Amman, 28 Jumada al-Ula–2 Jumada al-Akhira 1427 / 24–28 Jun 2006) — all items

Run `fatwa-websites-33`. Full session covered: resolutions 152–162 plus the unnumbered session statement.

- `fatwa-iifa-152-umma-schools` — 152 (17/1) Islam, the one umma and the creedal/juristic schools (Amman Message convergence) — ar/2200.
- `fatwa-iifa-153-ifta-conditions` — 153 (17/2) ifta: conditions and etiquettes — mufti's required sciences, etiquette, warning against unqualified ifta — ar/2203.
- `fatwa-iifa-154-extremism-terrorism` — 154 (17/3) position on excess, extremism and terrorism: all terrorist acts prohibited as hiraba offences; inciters counted; distinguished from resistance to occupation (neutrally summarised) — ar/2206.
- `fatwa-iifa-155-citizenship-minorities` — 155 (17/4) reconciling fixed principles with citizenship for Muslims outside Muslim lands: participation permitted within thawabit; civil-court litigation allowed to recover rights; sharia binding in personal status — ar/2209.
- `fatwa-iifa-156-partnership-sukuk-assets` — 156 (17/5) partnership sukuk asset composition (completing 30 (4/5), 60 (6/11), 137 (15/3)) — ar/2211.
- `fatwa-iifa-157-promise-contracts` — 157 (17/6) mutual promising and collusion in contracts: promises binding in conscience; riba-device promises prohibited; binding promises for future contracts (documentary credit) — ar/2214.
- `fatwa-iifa-158-sale-of-debt` — 158 (17/7) sale of debt: debt-for-debt cancellation expanded; contemporary debt-sale forms, hawala, discounting — ar/2216.
- `fatwa-iifa-159-women-social-role` — 159 (17/8) women and their social role (building on 114 (12/8); neutrally summarised) — ar/2218.
- `fatwa-iifa-160-state-relations-treaties` — 160 (17/9) the Islamic state's relations with other states and international covenants: peace-based relations, war as last resort, no bar to accords not conflicting with sharia — ar/2221.
- `fatwa-iifa-161-biomedical-research` — 161 (17/10) legal controls for biomedical research on humans (adopting the IOMS Cairo guidelines) — ar/2223.
- `fatwa-iifa-162-diabetes-deferral` — 162 (17/11) diabetes and fasting: **deferral**, IOMS committee commissioned — completed by 183 (19/9) — ar/2226.
- `fatwa-iifa-session17-palestine-statement` — unnumbered statement on Palestine/al-Aqsa, Iraq, Somalia (statement; neutrally summarised) — ar/2228.

Validation after batch: **118 IIFA files, 0 issues**.

IIFA coverage now: sessions 17–26 complete (resolutions 152–267 + unnumbered items). Sessions 1–16 remain (~1–151).

## Batch 11 — 16th session (Dubai, 30 Safar–5 Rabi al-Awwal 1426 / 9–14 Apr 2005) — all items

Run `fatwa-websites-33`. Full session covered: resolutions 143–151 plus two unnumbered statements.

- `fatwa-iifa-143-zakat-restricted-accounts` — 143 (16/1) zakat on restricted/investment and current accounts, insurance premiums, cash deposits, end-of-service gratuities — ar/2171.
- `fatwa-iifa-144-working-wife-disputes` — 144 (16/2) husband and employed wife: separate estates, full maintenance unless nushuz, employment controls (neutrally summarised) — ar/2174.
- `fatwa-iifa-145-aqila-diya` — 145 (16/3) the aqila and contemporary bearers of blood-money: no intentional/settlement/confession diya; Islamic insurance, unions, solidarity funds may substitute — ar/2176.
- `fatwa-iifa-146-new-reading-texts` — 146 (16/4) 'new reading' of the Qur'an and religious texts: Academy's rejection where it distorts meaning outside consensus (neutrally summarised) — ar/2178.
- `fatwa-iifa-147-international-commodities` — 147 (16/5) international commodities dealings, reaffirming the four controlled modes of 63 (7/1) — ar/2180.
- `fatwa-iifa-148-commercial-suretyship` — 148 (16/6) commercial kafala (licence lending vs partnership) distinguished from sharia suretyship; concealment prohibited — ar/2182.
- `fatwa-iifa-149-health-insurance` — 149 (16/7) health insurance: direct contracts with treatment institutions permissible under gharar-minimising controls; intermediary and cooperative forms — ar/2184.
- `fatwa-iifa-150-self-and-other` — 150 (16/8) 'us and the other': umma unity, media message, dialogue framework — ar/2188.
- `fatwa-iifa-151-muslim-minorities` — 151 (16/9) care of Muslims outside the Muslim world: abandoning 'minorities/expatriates' labels; identity-preserving integration; research centre — ar/2190.
- `fatwa-iifa-session16-jerusalem-statement` — unnumbered statement on Jerusalem and al-Aqsa (statement; neutrally summarised) — ar/2193.
- `fatwa-iifa-session16-iraq-statement` — unnumbered statement on Iraq (statement; neutrally summarised) — ar/2195.

Validation after batch: **129 IIFA files, 0 issues**.

IIFA coverage now: sessions 16–26 complete (resolutions 143–267 + unnumbered items). Sessions 1–15 remain (~1–142).


## IIFA session 15 (Muscat, March 2004) — added 10 records
- fatwa-iifa-135 (Islamic discourse, features & challenges), 136 (diminishing partnership / musharaka mutanaqisa), 137 (ijara sukuk), 138 (Islamisation of curricula — recommendation), 139 (credit cards — completing resolutions 63 (7/1) and 108 (12/2)), 140 (investing waqf assets & yields), 141 (al-masalih al-mursala), 142 (physician's liability — 8 liability cases, cites 67 (7/5) and 79 (8/10))
- fatwa-iifa-session15-palestine-statement, fatwa-iifa-session15-iraq-statement (unnumbered session items, recorded as statements, neutrally summarised)
- Source: iifa-aifi.org/ar/2144–2166.html. Validation: 139 fatwa-iifa files, 0 issues.
- Coverage now: resolutions 135–267 + unnumbered items; next: sessions 14→1 (oldest material).

## IIFA session 14 (Doha, January 2003) — added 9 records
- fatwa-iifa-127 (competition/sweepstakes cards — unlawful where card value feeds the prize, as gambling), 128 (human rights & international violence — Academy's own definition of terrorism vs jihad, recorded as its text), 129 (muqawala/contracting — istisna' vs hire-of-work, cites 65 (7/3)), 130 (modern companies — joint-stock, limited-by-shares, LLC, holding), 131 (mass-transit driver's liability — deferred on 3 questions), 132 (adhesion contracts), 133 (arrears in Islamic financial institutions — page ar/54153), 134 (globalisation & regional blocs)
- fatwa-iifa-session14-palestine-iraq-statement (unnumbered, eve of Iraq war)
- Source: iifa-aifi.org/ar/2114–54153.html. Validation: 148 fatwa-iifa files, 0 issues.
- Coverage now: resolutions 127–267 + unnumbered items.

## IIFA session 13 (Kuwait, December 2001) — added 8 records
- fatwa-iifa-119 (waqf investment — deferred; later settled in 140 (15/6)), 120 (zakat on agriculture — deduction rules), 121 (zakat on shares held for dividends — completing 28 (4/3)), 122 (diminishing partnership — deferred; later 136 (15/2)), 123 (qirad/joint mudaraba — investment accounts), 124 (health insurance — deferred; later 149 (16/7)), 125 (events in Palestine — post-9/11 text, recorded as the Academy's own), 126 (human rights in Islam — detailed charter)
- Source: iifa-aifi.org/ar/2087–2107.html. Validation: 156 fatwa-iifa files, 0 issues.
- Coverage now: resolutions 119–267 + unnumbered items.

## IIFA session 12 (Riyadh, September 2000) — added 12 records
- fatwa-iifa-107 (supply contracts & tenders — istisna' vs salam classification, cites 65 (7/3), 85 (9/2)), 108 (uncovered credit cards — cites 63 (7/1), 96 (10/4); completed by 139 (15/5)), 109 (penalty clause — lawful except on debts), 110 (hire-purchase/ijara ending in ownership + ijara sukuk — full lawful/prohibited forms), 111 (waqf investment — deferred, five named points), 112 (proof by presumptions — deferred), 113 (children's & elderly rights — cites Kuwait medico-fiqh seminar 1999), 114 (Islamic Declaration on women's role in developing the community — Tehran 1995 seminar), 115 (inflation & currency change — reaffirms 42 (5/4), permits hedging baskets), 116 (Qur'an translation standards — King Fahd Complex working paper), 117 (international Qur'an body — Qatar/Saudi/KFC coordination), 118 (Jerusalem — Academy's own text, neutrally attributed)
- Source: iifa-aifi.org/ar/2053–2081.html. Validation: 168 fatwa-iifa files, 0 issues.
- Coverage now: resolutions 107–267 + unnumbered items.

## IIFA session 11 (Manama, November 1998) — added 9 records
- fatwa-iifa-98 (Islamic unity), 99 (secularism — Academy's position), 100 (Islam vs comprehensive modernity), 101 (sale of debt & bonds — unlawful to third party; reaffirms 60 (6/11), 7/2/64), 102 (currency trading — no forward sale; reaffirms 21 (3/9), 63 (7/1), 53 (6/4)), 103 (maintenance contract — novel independent contract, ijara classification), 104 (benefiting from nawazil/fatwa literature — named classical works), 105 (heredity/genetic engineering/genome — deferred), 106 (women's-role seminar — deferred; settled by 114 (12/8))
- Source: iifa-aifi.org/ar/2024–2046.html. Validation: 177 fatwa-iifa files, 0 issues.
- Coverage now: resolutions 98–267 + unnumbered items; sessions 11–26 complete.

## 2026-11-17 — new-source harvest wave (fatwa-websites-34)

Multi-source expansion of the fatwa lane beyond IIFA.

- **AMJA (amjaonline.org, Arabic):** indexed 5,409 unique fatwas via the category DataTables endpoint across all 20 Arabic categories; background fetcher streaming full question/answer/meta (430+ records captured so far). 7 records written and validated (`fatwa-amja-*`), incl. hijra to non-Muslim lands, citizenship, mosque on mixed funds, saved-sect criteria, jahiliyya remnants, COVID-martyr question. Source `source/amja`, publisher `group/assembly-of-muslim-jurists-america` (stub).
- **FCNA (fiqhcouncil.org):** all 82 WordPress posts captured via the REST API. 12 records written (`fatwa-fcna-*`) covering life insurance, stock options, credit cards, student loans, zakat on sukuk/stocks/retirement funds, fidyah amounts, Ramadan 1447 announcement, backbiting exceptions. Source `source/fcna`, publisher `group/fiqh-council-north-america` (stub). ~50 remaining posts are fatwa-kind; book reviews/obituaries excluded.
- **Dar al-Ifta (dar-alifta.org, Egypt):** 616 fatwa links collected via `/ar/Fatwa/GetPage?pageSize=100`; fetcher has captured 190+ full records (title, question, answer, mufti, category). 8 records written (`fatwa-dar-alifta-eg-*`).
- **Saudi open data (open.data.gov.sa):** portal unreachable from this network — TCP connect to 78.93.109.61:443 hangs; CKAN API also unresponsive. Investigation pending a different route.
- **IIFA:** session 11 (Manama 1998, resolutions 98–106) harvested — 177 `fatwa-iifa-*` files total, sessions 11–26 covered.

Counts: 545 `fatwa-*` work files total; +31 new-source records this wave (19 AMJA+FCNA + 8 Dar + rest); all parse- and schema-checked, all `about` targets resolve, no typed honorifics.

## 17 Nov 2026 — Dar al-Ifta wave 5 (PR #7258 merged)
- 37 more Dar al-Ifta records across two PRs: PR #7257 (16) and PR #7258 (20 + 10 unnumbered wave included in count).
- Standing total: ~695 `fatwa-*` files; Dar al-Ifta batch now ~127 of 616 captured.
- All trilingual, `source/dar-alifta` cited, `about` targets resolve.
- Remaining: ~490 Dar, ~50 FCNA, IIFA sessions 1-10, AMJA long tail (~5,400 fetched, 11 written).
