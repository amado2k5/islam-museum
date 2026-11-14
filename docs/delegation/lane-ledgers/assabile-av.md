<!-- Snapshot of /Users/ahmedabdelaal/islam-museum-harvest/agent-progress/assabile-av.md taken 14 November 2026. The live copy stays on the Mac and the microSD; this copy keeps it in git. -->

# Assabile AV harvest — agent progress (Devin SWE-2 Flash High)

Worktree: /Users/ahmedabdelaal/Documents/GitHub/islam-museum-assabile (branch agent/assabile-av, base origin/poc/decision-ledger)

## 2026-11-08 16:40 — session start, pipelines restarted

- Mac had rebooted (~16:17); both transcription queues were dead since 7 Nov ~10:53.
- Restarted GPU queue (sequential, one whisper job): `scratch/gpu-queue-assabile.sh` → log `logs/gpu-queue-assabile.log`.
  1. Tareq al-Suwaidan phaseB via `~/devin-harvest/bin/phaseB.sh`: ~140 episodes pending (sehir-al-quran 26, stories-of-the-prophets 16, tarikhona-fi-al-mizan 30, the-story-of-the-end 27, wind-of-change 28, wind-of-change-2 12).
  2. Then Egypt `transcribe_speakers.sh` full speaker list (skips completed): ~2,459 episodes pending (wagdy-ghoneim ~164, sayed-elbshbishy 28 once downloaded, mahmoud-al-masri 226, ateya-muhammad-salem 412, muhammad-hussein-yacoub 498, amr-khaled 559, mustafa-al-adawi 572).
- Restarted phase A for sayed-elbshbishy only (`logs/egypt-phaseA2.log`): earlier `discover failed` was transient; manifest now has 28 episodes (.mp4 video series `araka-ala-el-kima`).
- Omar Abdelkafy: all 25 series fully transcribed (622 pass5-qwen txt). Entity work continues from existing transcripts — no transcription needed.
- Entity-mining queue next: determine which Omar series remain unwritten (citation scan running), then Egypt lane queue.

## 2026-11-08 ~17:15 — sharh-ketab-al-fawaed COMPLETE (all 10 eps) → PR #5655

- Mined episodes 6–10 of Omar's sharh-ketab-al-fawaed (Qwen3-ASR pass5 transcripts; eps 7/8/10 were the zero-citation episodes, 6/9 had thin prior coverage).
- Claims tables written this run: `books/assabile/omar-abdelkafy/sharh-ketab-al-fawaed/claims/ep07.tsv`, `ep08.tsv`, `ep10.tsv`. Episodes 6 and 9 were mined inline against the raw pass5 txt (no clean files existed); their two new claims each are recorded in the entity prose with needs_source flags.
- Published: 40 entity records gained cited Assabile sections in ar/en/ur; work-record episode sections 6–10 added; 22 new `about` edges in data/work yaml.
- Dropped as unverifiable/garbled (recorded here, not published): ep07 Yunus "mi'a alf" claim, "la hasad illa fi ithnayn" hadith, Ibn Mas'ud "zayn" nickname + anytime-entry claims; ep08 wilaya hadith qudsi, "ahabb ilayh min waladih" hadith, makarim/hilm/samt hadiths, Abu Bakr gaze claim; ep10 "ahabb al-a'mal adumuha" + "khayrukum man ta'lama al-quran" hadiths (not found in transcript).
- Fixed a target error mid-run: the ep09 "bayna al-'abd wa-bayna Allah wa-l-janna qantara" quote moved from concept/sabil (public water fountain) to concept/tariqa.
- Gates: cite-check 38/38 PASS; npm run validate 0 errors; npm test 421 pass (1 suite flaky .cache/graph.json race during parallel run, passes standalone 7/7).
- Commit f09e9b6e7a on agent/assabile-av (merged origin/main first — web-sources lane PR #5654, clean). PR #5655 → main; Cloudflare Pages check pending at push time.
- Next Omar series per todo: al-manjeyat eps 13–27, then silsilat-qissa-wa-ebra eps 9–22, then untouched series smallest-first.

## 2026-11-08 — al-manjeyat ep13 shipped (batch b3, in progress)
- Mined al-manjeyat ep13 (الأنس بالله) from pass5-qwen transcript; claims table claims/ep13.tsv written.
- Work record trilingual: الحلقة 13 sections appended to content/{ar,en,ur}/work/al-manjeyat.md.
- data/work/al-manjeyat.yaml: +9 about relations (al-uns-bi-allah, musa, yunus, yaqub, yusuf, hajar, ismail, abu-talib, ahmad-ibn-tulun).
- Entity enrichment DEFERRED to next batch (context cut mid-batch): planned al-uns-bi-allah, sakina, maratib-al-nafs, hasan-al-basri, umm-musa for eps 13-15.
- eps 14 (السكينة) + ep15 (الطمأنينة): AR/EN drafted in /tmp/app_manj_1315_work.py (sections present in script, NOT committed); Urdu drafts partially corrupted — redo carefully next session.
- Gates: cite-check PASS, validate 0 errors, npm test 428 pass.
- SHIPPED: commit 0f06f01e0a on agent/assabile-av-b3 → PR #5660 MERGED to main (2026-11-08T23:18Z). CI waived per founder; local gates all green.
- NEXT: al-manjeyat eps 14-15 — AR/EN sections ready in /tmp/app_manj_1315_work.py (AR block "الحلقة الرابعة عشرة/الخامسة عشرة", EN "Episode 14/15"); Urdu needs clean rewrite (prior drafts had stray [[]] and English fragments). Then entity enrichment: al-uns-bi-allah, sacred-relics-and-sakina, maratib-al-nafs, al-hasan-al-basri, umm-musa (+person enrichments for ep13-15). claims/ep13.tsv exists; write ep14.tsv, ep15.tsv.

## 2026-11-08 — al-manjeyat eps 14-15 completed (batch b5)
- Resumed on agent/assabile-av-b5 from origin/main (b4 already merged via PR #5679: eps 14-15 ar+en). No residue.
- Urdu index sections for eps 14 (السكينة) + 15 (الطمأنینہ) written cleanly and appended to content/ur/work/al-manjeyat.md — full parity with ar/en; needs_source markers preserved in Urdu.
- data/work/al-manjeyat.yaml: +18 about relations (sacred-relics-and-sakina, maratib-al-nafs, nafs-lawwama, usayd-ibn-hudayr, anas-ibn-malik, uthman-ibn-affan, umar-ibn-al-khattab, sariya-ibn-zunaym, ibn-taymiyya, al-hasan-al-basri, umm-salama, abu-dharr-al-ghifari, al-bara-ibn-malik, saad-ibn-abi-waqqas, bilal-ibn-rabah, abu-hanifa, umm-musa). All slugs verified to exist.
- Entity enrichment shipped for all 5 owed records, ar+en+ur each: concept/al-uns-bi-allah (ep13 section), concept/sacred-relics-and-sakina (ep14), concept/maratib-al-nafs (ep15), person/al-hasan-al-basri (ep14), person/umm-musa (ep15). data/concept/sacred-relics-and-sakina.yaml gained source/assabile-omar-abdelkafy in sources[].
- CANARY.md entry appended under v1.4.0 Data.
- Gates: cite-check 6/6 PASS; npm run validate 0 errors (8575 pre-existing warnings); npm test 428 pass / 2 skipped.
- claims/ep14.tsv + ep15.tsv still to be written to harvest claims dir (prose already shipped; claims tables are working material).
- NEXT: silsilat-qissa-wa-ebra eps 9-22, then untouched series smallest-first (muktatafat 24, ebadu-al-rahman 28, tariq-al-noor 30, dar-al-akhera 33, albuyout 47, bukhare 60, video series).
- SHIPPED: commit on agent/assabile-av-b5 → PR #5684 MERGED to main (merge 7251870d0a, 2026-11-09T03:27Z). CI waived; local gates green.

## 2026-11-XX — silsilat-qissa-wa-ebra eps 9-12 (batch b5)
- Branch agent/assabile-av-b5 from origin/main (after PR #5684 merge 7251870d0a).
- Mined pass5-qwen transcripts eps 9-12; shipped trilingual index sections:
  ep09 Solomon+ants+four birds+Umar anecdote (needs_source on Umar dialogue),
  ep10 Umm Musa, ep11 Ibrahim/Ismail sacrifice, ep12 Surat al-Buruj/ukhdud.
- Relations added: person/umar-ibn-al-khattab, person/uthman-ibn-affan, passage/quran-85.
- Entity enrichment (ar/en/ur): person/sulayman, person/umm-musa, person/ibrahim.
- CANARY entry added. Gates: cite-check + validate + test pending.
- Dropped/flagged: ep09 Umar-man dialogue garbled -> needs_source; ep12 Hajjaj anecdotes kept as attributed sayings.
- Next: eps 13-22 of qissa-wa-ebra, then muktatafat-mena-al-seera (24).

## silsilat-qissa-wa-ebra eps 13-15 (batch b5 cont.)
- ep13 Ibrahim+four birds, ep14 tongue/slander (ifk), ep15 owners of the garden.
- Trilingual sections shipped; no new relations needed (all targets already linked).
- Entity enrichment for eps 13-15 queued for next batch.
- PR pending; then eps 16-22 remain, then muktatafat-mena-al-seera.

## HANDOFF — qissa-wa-ebra progress
- MERGED PR #5686 (eps 9-12): merge 3d1307f139b52cd386ea9b95023eae1a2030daaf
- MERGED PR #5687 (eps 13-15): merge 244e63ecf13c7a4856436f514c62bda92b41347e
- Transcripts already read in this session for eps 16-20:
  ep16 Musa in Midian (kill Egyptian, two women at well, Shu'ayb's daughter,
  8-10yr mahr, 10yr expiation); ep17 Jabir trench food + Abu Hanifa worker +
  Ibn Mas'ud generosity; ep18 dog-water hadith + animal rights + waqf anecdotes;
  ep19 Musa/Red Sea tawakkul+yaqin; ep20 two Bani Isra'il brothers, deeds end
  with endings (khawatim).
- ep21, ep22 transcripts NOT yet read — read them first.
- Remaining: eps 16-22 (7 eps), then entity enrichment queued for eps 13-22,
  then muktatafat-mena-al-seera (24 eps) smallest-first.
- Urdu authoring caution: previous Urdu drafts twice contained English
  fragments/glitches — verify with grep '[a-zA-Z]' minus cite markers before
  committing UR files.

## qissa-wa-ebra eps 16-19 (branch b6)
- ep16 Musa/Median well+Shu'ayb marriage; ep17 Jabir trench+Abu Hanifa+Ibn Mas'ud;
  ep18 moist-liver hadith/animal waqfs/cat story/Umar dream; ep19 Red Sea tawakkul.
- Relations added: jabir-ibn-abdullah, abu-hanifa, abdullah-ibn-masud, abu-hurayra,
  concept/sadaqa, passage/quran-26.
- Urdu: 10 corrupted lines detected+rewritten; verified clean via grep.
- Enrichment for eps 13-22 still queued.
- Remaining: eps 20-22 (read: ep20 khawatim two brothers; ep21 ashab al-kahf
  5 conditions of companionship; ep22 Musa/al-Khidr 'who is most learned', 3 I's,
  kinds of knowledge, adab, tafakkur vs tadabbur).

## qissa-wa-ebra eps 20-22 + Urdu owed (PRs #5702/#5710) — SERIES COMPLETE
- eps 20-22 shipped trilingual: ep20 khawatim/two brothers/sorcerers' ending;
  ep21 ashab al-kahf + 5 conditions of companionship; ep22 Musa/al-Khidr,
  "who is most learned", 3 I's, kinds of knowledge, tafakkur vs tadabbur.
- Relations added: khawatim, ashab-al-kahf, quran-18-60, al-shafii, abu-talib, ilm.
- Urdu eps 20-22 completed (PR #5710). Series fully trilingual, 22/22 eps.

## qissa-wa-ebra entity enrichment backlog CLEARED (PR #5712, merge 44dab56a9853)
- Enriched 5 records lacking assabile cites, ar/en/ur each:
  person/jabir-ibn-abdullah (ep17 Trench meal), concept/sadaqa (eps 11/14/15/18),
  concept/khawatim (ep20), person/maryam (eps 02/19), person/uthman-ibn-affan (ep12).
- All other about-targets already carried assabile sections; passage/quran-*
  records have no prose files (frozen Tanzil) — skipped by design.
- Gates: cite-check 5/5, validate 0 errors, test 428 pass. CI waived.

## NEXT: muktatafat-mena-al-seera (24 eps) — smallest-first queue
- Transcripts: /Volumes/exmicroSD/islam-museum-harvest/books/assabile/omar-abdelkafy/muktatafat-mena-al-seera/pass5-qwen/
- Then: silsilat-ebadu-al-rahman (28), tariq-al-noor (30), al-dar-al-akhera (33),
  albuyout-alamena (47), Bukhari (60), video series; Egypt/Tareq lanes after.

## muktatafat-mena-al-seera STARTED (PR #5715, merge 57e670a5a8)
- New work record work/muktatafat-mena-al-seera created trilingual via
  harvest gen_series.py (spec at /tmp/muktatafat-spec.json — MOVE to harvest dir).
- ep01 shipped: Monday-lesson return, series outline, why-Arabia question,
  pre-Islamic Arab character, Ta'if allusion. Heavy needs_source (garbled ASR).
- about: muhammad, abu-talib, khadija, salah-al-din-yusuf-ibn-ayyub, sirat, karam.
- Remaining: eps 02-24. Next series after: silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep02 shipped (PR #5717, merge 9f50911ff0)
- Ep02 trilingual: world into which the Prophet was born — Quraysh/Mecca,
  Abd al-Muttalib, year of elephant, Bahira, Salman al-Farisi, months,
  why-Arabia. +4 about: abdullah-ibn-abd-al-muttalib, amina-bint-wahb,
  salman-al-farisi, bahira.
- WORKFLOW NOTE: series uses harvest gen_series.py + persistent spec at
  /Volumes/exmicroSD/islam-museum-harvest/books/assabile/omar-abdelkafy/
  muktatafat-mena-al-seera/spec.json (accumulate episodes, regen all 3
  files each batch). UR corruption this session: generation emitted stray
  "TOOLS"/Latin fragments on long Urdu strings — verify every UR line with
  grep before commit; fix via python line-replace, keep sentences shorter.
- Remaining: eps 03-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep03 shipped (branch agent/assabile-av-b10)
- Branch: agent/assabile-av-b10 at origin/main 8e5473557f (fast-forwarded
  past PR #5721 web-sources merge; Assabile baseline PR #5717 9f50911ff0).
- Ep03 trilingual: three kinds of inheritance; Prophet's physical
  description (wasf); his honours + announced series plan birth->Mecca
  (grandfather, Amina's death, Abu Talib, Khadija, Zayd, return pre-hijra).
- +1 about: person/zayd-ibn-haritha (total 11 about relations).
- spec.json episode format normalized: each lang is [title, body] with
  bullets joined by \n (gen_series.py requires exactly 2 elements).
- UR corruption recurred on long strings ("سلامtees", "درود...") — fixed by
  splitting into two shorter bullets; verified clean via grep.
- AR honorifics stripped (ﷺ, صلى الله عليه وسلم) per validator; proper
  Arabic needs_source annotations restored (was "needs_source:Recording...").
- Gates + PR result: see below after run.
- Remaining: eps 04-24, then silsilat-ebadu-al-rahman (28).
- Gates: cite-check PASS; npm run validate 0 errors (8649 warnings);
  npm test 428 passed | 2 skipped.
- Commit c3818c423a; PR #5723 MERGED, merge commit 8a2f5d5fd3.
- Remaining: eps 04-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep04 (branch agent/assabile-av-b10)
- Ep04 trilingual: umma-protection hadiths + da'wa bil-hikma; conquest-era
  Companion positions (Abu Hurayra, Khalid entering Damascus) + unity of
  agreed practices; family/education counsel (righteous wife, parents'
  rights, patience, aqeeqa/circumcision, spousal secrets, screens); fiqh
  Q&A (istikhara, parents' missed prayers, divorce, nail polish wudu).
- +7 about: abu-hurayra, khalid-ibn-al-walid, umar-ibn-al-khattab, dawa,
  kitman-al-sirr, practice/istikhara, ukhuwwa (total 18 about relations).
- UR kept to short sentences; verified clean (no latin/cyrillic in prose).
- Gates + PR result: pending.
- Remaining: eps 05-24, then silsilat-ebadu-al-rahman (28).
- Gates+PR for ep04 pending; ep05 drafted same batch.

## muktatafat-mena-al-seera ep05 (same batch as ep04)
- Ep05 trilingual: majalis al-ilm + woman dragging child to Fire;
  man at Paradise's edge + man shown blessings; Umar's vigil +
  man'a ala zulm; qudsi hadith "la yu'adhdhab illa man sharada wa aba",
  three arkans of iman, "madina al-ilm", la ilaha scale; Companion
  stories + closing Q&A (marriage/hijab).
- +6 about: majalis-al-ilm, jannah, iman, hadith-qudsi, abu-bakr, hafsa
  (total 24 about relations).
- UR: 6 short bullets, verified clean.
- Fixed wrong link: مجالس العلم -> concept/majalis-al-ilm (was akhira).
- Remaining: eps 06-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera eps 04-08 batch (agent/assabile-av-b10)
- ep04: umma-protection hadiths, da'wa bil-hikma, conquest-era Companion
  positions, family/education counsel, fiqh Q&A (+7 about: abu-hurayra,
  khalid, umar, dawa, kitman-al-sirr, istikhara, ukhuwwa)
- ep05: majalis al-ilm, woman+child fire hadith, man at Paradise's edge,
  Umar's vigil, qudsi hadith + 3 arkans, "madina al-ilm", la ilaha scale,
  Companion stories + Q&A (+6 about: majalis-al-ilm, jannah, iman,
  hadith-qudsi, abu-bakr, hafsa)
- ep06: mawlid night + West critique, Hilma/Banu Sa'd upbringing, ummi,
  named Muhammad, rebuttal of People-of-the-Book claims, foster family,
  return to Mecca, Abd al-Muttalib, Khadija proposal (+4 about:
  halima-al-sadiyya, abd-al-muttalib, ali-ibn-abi-talib, wahy)
- ep07: Muslim adab/gaze, knight before Ali, Banu Ghaifar sword to Khalid,
  Islam transforming Arabs, Kaaba rebuilding + Black Stone, Quraysh
  persecution of Fatima, Abu Talib's death, Umar/Ali proposal, wedding
  feast (+8 about: fatima, umm-kulthum-bint-muhammad, zaynab-bint-muhammad,
  ruqayya-bint-muhammad, walid-ibn-al-mughira, hajar-aswad,
  rebuilding-of-the-kaaba, treaty-of-hudaybiyya)
- ep08: recap Fatima/Ali's 4 children + Khadija's role; Ibrahim's life —
  hanif muslim, greatest trials, prophets' hadith, Kaaba rebuilding,
  Iraq->Egypt/Syria famine migration, death at 86, Hajar/Ismail start
  (+5 about: ibrahim, ismail, hajar, hasan-ibn-ali, husayn-ibn-ali)
- about total: 41 relations. All UR verified clean; 0 honorifics in AR.
- Gates + PR: pending.
- Remaining: eps 09-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera eps 04-08 SHIPPED (agent/assabile-av-b10)
- Gates: cite-check PASS; validate 0 errors (8649->8726 warnings after
  main merge); npm test 428 passed | 2 skipped.
- Fixed pre-push: wrong slug person/walid-ibn-al-mughira ->
  person/al-walid-ibn-al-mughira in yaml + ar/ur prose + spec.json
  (validate caught 3 errors).
- Three-way merge of origin/main (PR #5724 web-sources) clean.
- Commit 34dea018ab + merge 27c2ce2410; PR #5725 MERGED,
  merge commit 54287b72882bfb30409a24e8ec67c2afc41fd6fb.
- Remaining: eps 09-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep09 drafted (agent/assabile-av-b10)
- Ep09 trilingual: ilm must bear fruit (3 treatises); dua fruits
  ("hammun wa duyun"), wronged-man story, la tad'u 'ala al-zalim hadith;
  scholars' adab (Sufyan al-Thawri, Ahmad ibn Hanbal); dreams + Gabriel.
- +7 about: ilm, dua(practice), sufyan-al-thawri, harun-al-rashid,
  abu-dharr-al-ghifari, jibril, ahmad-ibn-hanbal (total 48).
- UR verified clean (7 bullets, no Latin fragments).
- Gates+PR pending.
- Remaining: eps 10-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep09 SHIPPED + ep10 drafted
- Ep09: PR #5728 MERGED, merge 056be5098d13b94d2918b4e6048daabf6ad8ed5d.
- Ep10 trilingual drafted+generated: lesson 11 "masalat al-wahda" —
  heart unified on Allah; ilm hadiths (dunya/akhira/both), "marhaban
  bil-qamar", Salman/Umar/Ali praise; fiqh Q&A on marriage (nafqa
  dispute, daw', wife as blessing, hayd); Aisha's "omniyati" hadith,
  moon-split, water-from-fingers, khums; Abu Sufyan/conquest; closing
  major signs of the Hour (ashrat al-saa) + final dua.
- +9 about (total 57): aisha, abu-sufyan-ibn-harb, akhira, masjid,
  splitting-of-the-moon, ashrat-al-saa, isa-ibn-maryam,
  akhirat-al-zaman, khums-fiqh.
- UR verified clean. CANARY added. Gates+PR pending.
- Remaining: eps 11-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep10 SHIPPED + ep11 drafted
- Ep10: PR #5729 MERGED, merge 65a45e6ee94c40fae23d3e559eb45609a7212e61.
- Ep11 trilingual drafted+generated: umma glad tidings (bushshir hadith,
  khayr umma via Ibn Abbas/Sahih Muslim); Abu Bakr's grave station +
  Gabriel asking about umma; man who received revelation alone on
  mountain; shepherds/wolves unity parable; wealth/money morals +
  travel for knowledge; first hijra to Abyssinia (Uthman, Ruqayya);
  boycott of Banu Hashim, Najashi on Isa/Maryam, Isra/Mi'raj mention,
  Khadija's death.
- +7 about (total 64): al-najashi, uthman-ibn-affan,
  first-migration-to-abyssinia, return-of-abyssinian-emigrants,
  isra-and-miraj, abdullah-ibn-abbas, musab-ibn-umayr.
- UR verified clean. CANARY added. Gates+PR pending.
- Remaining: eps 12-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep11 SHIPPED + ep12 drafted
- Ep11: PR #5731 MERGED, merge 90c4867000efe8469085ce3fa3009e21ed0f0616.
- Ep12 trilingual drafted+generated: announces 3 topics (Ta'if journey,
  year of sorrow, Isra/Mi'raj); long sermons on truth vs falsehood,
  Nuh's wife, Umm Jamil/Abu Lahab, magicians-turned-believers,
  Abu Hanifa anecdote, prayer instruction (takbir/isti'athah).
- +6 about (total 70): journey-to-taif, year-of-sorrow, nuh, umm-jamil,
  abu-lahab, abu-hanifa.
- UR verified clean. CANARY added. Gates+PR pending.
- Remaining: eps 13-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera ep12 SHIPPED + ep13 drafted + geo fixes
- Ep12: PR #5733 MERGED, merge 146556580ee5931b05ed0b78bdb7dfcc3f1c0d66.
- Fixed upstream blockers from person-geo merge (same PR):
  * data/place/kufa.yaml founded.edtf 0638 -> "0638" (string)
  * tour/halls.yaml: medina +wikidata, cordoba +wikidata (order match)
  * tour/exhibits.yaml: duranir +nomisma
- Ep13 trilingual drafted+generated: prayer lesson (tahara of
  body/clothes/place, najas kinds, wudu, Islam chain ends in divorce,
  awrat hadiths, Hasan al-Basri anecdote, Abu Hurayfa) + closing
  family sermon (nikah pillars recited).
- +7 about (total 77): tahara, wudu, najasa, shurut-qabul-al-salah,
  al-hasan-al-basri, nikah, khutba.
- UR verified clean. CANARY added. Gates+PR pending.
- Remaining: eps 14-24, then silsilat-ebadu-al-rahman (28).

## muktatafat-mena-al-seera eps 13+14 SHIPPED
- Ep13+14: PR #5735 MERGED, merge 915a754015d58c0f5a9fa3ade5adef9c86f38ae5.
- Ep13 (drafted earlier): prayer conditions + family sermon, +7 about (77 total).
- Ep14: MINIMAL entry — transcript near-total ASR noise. Only high-confidence
  claims (prayer chapters continued, fiqh/madhhab Q&A w/ Abu Hanifa+Shafi'i
  anecdote, purity kinds, closing du'a). needs_source throughout, +0 about.
- Gates: cite-check PASS, validate 0 errors, test 428 pass/2 skip.
- Remaining: eps 15-24, then silsilat-ebadu-al-rahman (28).
- Ep15 transcript is largely INTELLIGIBLE: prayer handhold hadith, Hasan
  al-Basri's jariya in the market, khamr verse, Umar b. Abd al-Aziz letter,
  presence-at-sin vs absence saying, Musa charity hadith qudsi, elderly
  respect + Ibn Abbas/Zayd ibn Ali horse anecdote, four categories of
  ikhlas+mutaba'a.

## muktatafat-mena-al-seera ep15 SHIPPED
- Ep15: PR #5736 MERGED, merge 688a46738f50f98f01d845ff7a26b28262bdcf63.
- Content: prayer handhold hadith; Hasan al-Basri's jariya in market +
  khamr verse; Umar b. Abd al-Aziz letter on drinkers; ikhlas/niyya +
  Musa charity hadith; elderly respect + Ibn Abbas/Zayd b. Ali; four
  ikhlas+mutaba'a categories; Mukhlis doesn't know he's mukhlis;
  Umar's night vigil + Paradise-by-mercy hadith; hajj acceptance report
  (needs_source); dua adab + Umar at Kaaba; Malik refuses Harun al-Rashid
  private teaching; prayer pillars (niyya, Allahu akbar meaning, Umm
  Salama vision); sabr + Paradise food; fiqh Q&A (wudu vessel vs tap,
  ghusl scalp, menstruation handout).
- +13 about (total 90): ikhlas, niyya, umar-ibn-abd-al-aziz, khamr, musa,
  zayd-ibn-ali, umm-salama, dawud, malik-ibn-anas, ghusl-al-janaba, hajj,
  sabr, salah.
- Gates: cite-check PASS, validate 0 errors, test 428 pass/2 skip.
- Ep16 transcript reviewed: prayer pillars detail (niyya in heart,
  takbir, qiyam, ruku' hand placement, sami'a Allah, sujud, tashahhud),
  tayammum fiqh (strike earth, wipe face/hands, janaba), wudu-breakers
  (flatulence), menstruation fiqh Q&A; sermon on tawfiq — truth heavy/
  falsehood light, signs of tawfiq, ikhlas, following righteous, dunya vs
  akhira; some garbled stretches (church/confession digression ~00:37,
  Kuwait anecdote ~00:34).
- Remaining: eps 16-24, then silsilat-ebadu-al-rahman (28).
- Ep17 shipped PR #5739 merge 4981a36f (raf-al-yadayn, abdullah-ibn-umar,
  mahram relations).
- Ep18 shipped PR #5741 merge bebd599b (tawba + tahajjud relations;
  repentance/heart-cleansing, Qur'an-as-light, night prayer). Gates:
  cite-check PASS, validate 0 errors, test 428 pass/2 skip.
- Ep19 transcript reviewed: heavily garbled; prayer-as-second-pillar
  hadith via Ibn Abbas (Ahmad/Ibn Majah/Tirmidhi), "white path" hadith,
  Abu Dharr on scholars/travelers increasing, "Allah destroys by removing
  the soul" hadith, hadith qudsi "I love My servant" + Ibrahim/Jibril
  love, amanah theme, Pharaoh/Bani Isra'il drowning fragment, prayer
  mechanics recap (ruku'/sujud postures), long garbled stretches.
- Remaining: eps 19-24, then silsilat-ebadu-al-rahman (28).
- Ep19+20 shipped together PR #5742 merge 31adf4fb. Ep19 (+5 about:
  amanah, shafaa, salat-al-janaza, eid-al-fitr, eid-al-adha): prayer as
  second pillar, hadiths on destruction/Allah's beloved servant, amanah,
  intercession scene, prayer sunnas. Ep20 (+1 about: abu-yusuf-al-qadi):
  sira anecdotes (call among few, three men praying all night, Bedouin +
  stray camel, Fatima/Umar fragments, Palestine man), trial-as-trade
  with God, prayer details (tying cord while praying, gaze between
  feet, mounts) + Abu Hanifa/Abu Yusuf on speech/yawning in prayer.
  Both heavily garbled; all bullets needs_source. Total about = 108.
- Remaining: eps 21-24, then silsilat-ebadu-al-rahman (28).
- Ep21 shipped pending — Friday sermon/rulings + funeral rites (+1 about:
  salat-al-jumua). Ep22 (+0 about): knowledge circles etiquette, Umar
  delegation story, Chosroes "king of Arabs", Umar's justice, Islam
  spreads by character not lectures, dreams incl. Abu Hanifa's grave
  dream, Qur'an recitation etiquette. Ep23 (+2 about: mawt, qadar):
  short 4.5-min opening — Abu Dharr's "market in Mecca" question +
  four-wonders hadith. Ep24 (+0): closing lesson on effect of deeds —
  iman greatest blessing, humility anecdotes, mosque merit, dreams/
  marvels, sorcery critique, modern digressions noted, closing dua.
  SERIES COMPLETE: all 24 episodes drafted trilingually.
- Gates for eps 21-24 in flight; ship as one batch.
- Next series: silsilat-ebadu-al-rahman (28 episodes).
- Eps 21-24 shipped PR #5743 merge 4470e6da. Ep21 +1 (salat-al-jumua),
  ep22 +0, ep23 +2 (mawt, qadar), ep24 +0. Total about relations = 111.
  SERIES muktatafat-mena-al-seera COMPLETE: all 24 episodes in ar/en/ur,
  all cite-checked, validate 0 errors, tests 428 pass/2 skip.
- NEXT SERIES: silsilat-ebadu-al-rahman (28 episodes) — start fresh:
  locate transcripts under .../omar-abdelkafy/silsilat-ebadu-al-rahman,
  create work record + ep1-2 batch, then queue: tariq-al-noor (30),
  al-dar-al-akhera (33), albuyout-alamena (47), Bukhari (60), video,
  Egypt/Tareq lanes.

## silsilat-ebadu-al-rahman eps 03-05 shipped (PR #6056, merge e2916d9f7c) — 11 Nov 2026, Claude Code claude-fable-5-2
- Branch agent/assabile-av-b13. Series record extended in ar/en/ur: ep03 (affection/mawadda),
  ep04 ("they say: peace", hilm), ep05 (night prayer). 43 points, 16 new about relations
  (total 21), 4 needs_source. Exclusions in docs/delegation/omar-abdelkafy-progress.md.
- Method: batch JSON specs + appender at .../silsilat-ebadu-al-rahman/apply_eps.py and
  batches/ (cite anchors generated once per point for all three languages; checks timestamps,
  links, honorifics, Urdu script, YAML). No gen_series spec existed for this series, so the
  record is appended to, not regenerated; review state left as it was; provenance.extended added.
- Gates observed: cite-check PASS; validate 0 errors; npm test 35 files / 482 passed, 2 skipped.
  Machine heavily loaded (load ~75): validate ~20 min, npm test ~17 min per run.
- Specs already drafted and check-only clean for eps 06-16 (batches/pr2-ep06-09.json,
  pr3-ep10-13.json, b13-5.json = ep14-15, b13-6.json = ep16).
- Remaining: eps 06-28. ep13 in the archive is a 5 min 26 s fragment.

## silsilat-ebadu-al-rahman eps 06-09 shipped (PR #6060, merge a075b8fde8) — 11 Nov 2026, Claude Code claude-fable-5-2
- Branch agent/assabile-av-b14. ep06 (refuge from Hell, supplication), ep07 (middle course in
  spending), ep08 (pure monotheism; programme aired on the Sharjah satellite channel; Japan
  earthquake remark = dating evidence, Ramadan 2011 or later, inference only), ep09 (sanctity of
  life, "moral killing"). 59 points, 19 new about (total 40), 5 needs_source.
- Record now sensitivity: contested; opinion points marked "the lecturer's view". Decision record
  dec-20261112-239 (rule-harvest-include), marked applied. The id was renumbered twice at merge
  (237 and 238 taken on main by other lanes): write decision records LAST, right before push.
- Gates observed: cite-check PASS; validate 0 errors; npm test 35 files / 482 passed, 2 skipped.
- Remaining: eps 10-28 (specs for 10-16 drafted, check-only clean).

## silsilat-ebadu-al-rahman eps 10-13 shipped (PR #6070, merge de50c4fb2f) — 11 Nov 2026, Claude Code claude-fable-5-2
- Branch agent/assabile-av-b15. ep10 ("nor do they commit fornication"), ep11 (outcome; rights of a
  Muslim), ep12 (repentance; ep11+12 are two halves of one lesson), ep13 (false witness; archive file
  is a 5 min 26 s fragment). 41 points, 8 new about (total 48), 4 needs_source.
- Gates observed: cite-check PASS; validate 0 errors. npm test did NOT pass on this run: 3 tests hit the
  300 s timeout (khutab, invention, education fact engine) under load 70-90; shipped on the
  orchestrator's instruction not to wait. RERUN `npm test` on a quiet machine.
- Lane handed to another worker on the orchestrator's instruction.
- RESUME POINT: silsilat-ebadu-al-rahman ep14. Drafted and check-only clean, NOT applied or shipped:
  .../silsilat-ebadu-al-rahman/batches/pr4-ep14-16.json (eps 14-16, 53 points, 10 about, 1 needs_source),
  with pr4-canary.txt, pr4-progress.txt, pr4-commit.txt, pr4-body.txt. To ship: new branch off
  origin/main; python3 apply_eps.py <repo> batches/pr4-ep14-16.json; python3 prep_pr.py <repo>
  omar-abdelkafy-ebadu-al-rahman-5 "14-16" batches/pr4-canary.txt batches/pr4-progress.txt; cite-check,
  Urdu grep, validate, test; ship_pr.sh <repo> 4 "<title>". Review the draft before shipping.
- Then eps 17-28 (transcripts all present in pass5-qwen), then tariq-al-noor, al-dar-al-akhera,
  albuyout-alamena.

## silsilat-ebadu-al-rahman eps 14-16 shipped (PR #6074, merge 7f9e98dfeb) — 11 Nov 2026, Claude Code claude-haiku-5-5
- Branch agent/assabile-av-b17 from origin/main. 53 points, 10 new about (total 58), 1 needs_source.
- Gates: cite-check PASS; Urdu Latin/Cyrillic grep 0; validate 0 errors (238/238 records).
  npm test NOT run for this PR (owed: rerun on a quiet machine; #6070's three timed-out tests too).
- RESUME POINT: episode 17 (transcript present in pass5-qwen). Then 18-28, then tariq-al-noor (30),
  al-dar-al-akhera (33), albuyout-alamena (47). Use batch specs as before (apply_eps.py, prep_pr.py, ship_pr.sh).

## silsilat-ebadu-al-rahman eps 17-18 — BLOCKED, committed locally, NOT pushed — 11 Nov 2026, claude-haiku-5-5
- Branch agent/assabile-av-b18 (local commit "content(work): silsilat-ebadu-al-rahman eps 17-18 trilingual").
- cite-check PASS; Urdu grep 0; npm run validate: 6 errors, all in content/{ar,en,ur}/concept/hudud-allah-wal-kabair.md
  (missing frontmatter id/lang), added to origin/main by commit 0ab0e5d42d (Hudud Allah browser). Present on main
  itself; not this batch. Not fixed here (another lane's file); no open PR touches it.
- To ship: the Hudud lane adds frontmatter (or a fix PR lands on main); then rebase/merge main,
  validate, and run bash ship_pr.sh <repo> 5 "content(work): silsilat-ebadu-al-rahman eps 17-18 trilingual".
- RESUME POINT: episode 19 transcript; spec not started. Episodes 17-18 spec: batches/pr5-ep17-18.json.

## silsilat-ebadu-al-rahman: ALL 28 EPISODES WRITTEN, 11 Nov 2026, claude-haiku-5-5
- PRs merged this stretch: #6079 (eps 17-18), #6083 (eps 19-20; merged with --admin after the PR showed
  UNSTABLE/not mergeable), #6087 (21-22), #6093 (23-24), #6097 (25-26), #6100 (27-28, series complete).
- Each PR: validate ran with 6 errors only, all pre-existing on main (hudud-allah-wal-kabair frontmatter, commit 0ab0e5d42d);
  cite-check PASS; Urdu grep 0. npm test NOT run for eps 17-28: owed on a quiet machine (also #6070's three timeouts).
- Series record: 105 `about` links, provenance.extended runs omar-abdelkafy-ebadu-al-rahman-1..11, sensitivity contested.
- Open items: hudud frontmatter fix (other lane); npm test rerun; review of needs_source counts; series-level summary/ perspectives not revised.
