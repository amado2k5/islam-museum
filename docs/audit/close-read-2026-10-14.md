# Close-read Sunni-compliance audit, 2026-10-14

Scope: every Arabic prose page in `content/ar/` on `origin/main` for the classes place, group, event, journey, concept, polity, period, work, source and exhibit (459 pages at the time of the final listing). Each page's prose was read paragraph by paragraph and checked for (a) doctrinal, sectarian or moral judgements in the museum's own voice without attribution, (b) insulting or sectarian terms without attribution, (c) at least one `{cite:key}` whose key exists in `data/source/`, and (d) honorifics (ﷺ, رضي الله عنه, عليه السلام). Fixes are minimal wording changes that attribute a judgement to a named source or tradition already on the page. No claims or citations were added, no status fields were changed, and `status.review: draft` is unchanged everywhere.

Pages are committed in 19 batches of at most 25 pages. This document grows by one batch per push; the batch number is in each section heading.

## Results across all batches

- Pages checked: 459 (place 57, group 64, event 214, journey 32, concept 46, polity 8, period 13, work 11, source 9, exhibit 5).
- Pages with a fix: 19 (21 edits).
- Honorifics (criterion d): none found in prose. One automated hit was a false positive (`يرضي الله` contains the substring `رضي الله`).
- Missing citation keys (criterion c): none. Pages with no cite marker at all: 5, listed below.
- Pages added to origin/main by other sessions during this audit (read in this pass, no fix needed): 6 event pages, listed in the batch that contains them. Five place pages (al-akhdar, al-jurf, maysan, thaniyyat-al-wada, wadi-al-mushaqqaq) gained citations from another session during the audit and are no longer in the no-citation list.

## Changes

| Page | Before | After | Reason |
|---|---|---|---|
| `group/banu-al-dil.md` | فكان خطؤهم بداية نهاية الحرب كلها | فكان فعلهم بداية نهاية الحرب كلها | moral label in the children's section; describes the act |
| `group/banu-hashim.md` | صار لاحقًا اسم الحقّ الذي قامت عليه دول هاشمية وعلوية وفاطمية | صار لاحقًا اسمًا ترفع به دول هاشمية وعلوية وفاطمية دعوى الشرعية | museum voice presented a claim as the truth; reframed as the dynasties' claim |
| `group/banu-shayban.md` | لأن سيدها حفظ الأمانة | وتذكر الرواية أن سيدها حفظ أمانة النعمان | causal moral explanation in museum voice; attributed to the narrative |
| `group/jahmiyya.md` | يزعم أصحاب هذا القول أن القرآن مخلوق | بحسب وصف الكتاب، يقول أصحاب هذا القول إن القرآن مخلوق | dismissive verb in museum voice; attributed to the cited book |
| `group/hawazin.md` | حارب الإسلام في حنين | حارب المسلمين في حنين | framed a religion as a party; factual wording |
| `group/hawazin.md` | ردّة حنين سنة 630م على بيعة الفتح | حرب حنين سنة 630م بعد بيعة الفتح | 'ردّة' (apostasy) asserted in museum voice |
| `group/thaqif.md` | فسلّموا على شروط التصنّع | فسلّموا بشروط خاصّة | imputed insincerity in museum voice; no source states it |
| `group/himyar.md` | ومنهم الملك الظالم الذي أحرق أهل نجران | ومنهم الملك الذي تذكر الرواية أنه أحرق أهل نجران | moral label in the children's section; attributed to the tradition |
| `event/battle-of-uhud.md` | ## غلطة الرماة والانتكاسة | ## ترك الرماة مواقعهم والانتكاسة | evaluative heading ('mistake') in museum voice |
| `event/battle-of-uhud.md` | ## قبل المعركة: انسحاب المنافقين | ## قبل المعركة: انسحاب عبد الله بن أبي | heading labelled a named person with a faith category |
| `event/death-of-abdullah-ibn-ubayy.md` | مات رجل كان يقول أنه مسلم لكنه كان يضرّ بالمسلمين سراً | مات رجل كانت الرواية تصفه بأنه يقول إنه مسلم ويضرّ بالمسلمين سراً | faith and hidden harm inferred in the children's section (no citation there) |
| `event/fath-mecca-proscribed-persons.md` | الذين ارتكبوا جرائم قتل وغدر واضحة | الذين تذكر الروايات أنهم ارتكبوا جرائم قتل وغدر | judgement in the children's section (no citation there) |
| `event/hypocrites-ambush-at-the-pass.md` | اختبأ بعض الرجال المنافقين في ممر جبلي ضيق | اختبأ بعض الرجال الذين تصفهم الروايات بالنفاق في ممر جبلي ضيق | faith category asserted in the children's section (no citation there) |
| `event/funeral-prayer-for-the-negus.md` | مات ملك الحبشة العادل الذي حمى المسلمين الأوائل في بلده | مات ملك الحبشة الذي تصفه الروايات بالعدل، والذي حمى المسلمين الأوائل في بلده | moral label in the children's section; attributed to the tradition |
| `event/expulsion-of-jurhum.md` | فلما أساءت إلى الحجاج حاربتها خزاعة | فلما أساءت، كما تذكر الروايات، إلى الحجاج حاربتها خزاعة | moral judgement in the children's section; attributed |
| `event/isra-and-miraj.md` | أسري برسول الله بجسده على الصحيح بصحبة جبريل | أسري برسول الله بجسده، وهو الصحيح عند أهل السنة، بصحبة جبريل | doctrinal verdict stated without attribution; attributed to Sunni tradition |
| `concept/anwa.md` | عدّها الإسلام كفراً بالنعمة | عدّها حديث النبي كفراً بالنعمة | doctrinal verdict in the lede without attribution; attributed to the hadith |
| `concept/hums.md` | وابتدعوا به بدعاً في مناسك الحج | وأحدثوا به أموراً في مناسك الحج | bid'a label applied in the lede without attribution |
| `concept/sacred-livestock-jahiliyya.md` | حرّموا الانتفاع بها على أنفسهم ابتداعاً، فأنكرها القرآن | حرّموا الانتفاع بها على أنفسهم، فأنكرها القرآن | bid'a label applied in the lede without attribution |
| `concept/jahili-marriage-forms.md` | فيها ظلم للمرأة والولد | تراها الشريعة ظلماً للمرأة والولد | moral judgement in the children's section; attributed to the Shari'a |
| `concept/maysar.md` | حرّمه الله لأن فيه عداوة وخسارة للناس | حرّمه الله، وذكر القرآن أن إثمه أكبر من نفعه | unattributed causal moral claim in the children's section; attributed to the Qur'an (2:219) |

## Pages needing citations (not added here)

- `exhibit/path-abyssinia-migrations.md`
- `exhibit/path-from-opposition-to-islam.md`
- `exhibit/path-islam-in-30-minutes.md`
- `exhibit/path-meccan-period.md`
- `exhibit/path-women-around-the-prophet.md`

## Batch 1 of 19

Pages place/abyssinia.md to place/dhu-tuwa.md (25 pages).

| Page | Result |
|---|---|
| `place/abyssinia.md` | ok |
| `place/ajnadayn.md` | ok |
| `place/aksum.md` | ok |
| `place/al-akhdar.md` | ok |
| `place/al-hijr.md` | ok |
| `place/al-hira.md` | ok |
| `place/al-jirana.md` | ok |
| `place/al-jurf.md` | ok |
| `place/al-khaliqa.md` | ok |
| `place/al-khandama.md` | ok |
| `place/al-kudayd.md` | ok |
| `place/al-rabadha.md` | ok |
| `place/al-sham.md` | ok |
| `place/al-watir.md` | ok |
| `place/al-yamama.md` | ok |
| `place/asfan.md` | ok |
| `place/awtas.md` | ok |
| `place/badr.md` | ok |
| `place/baghdad.md` | ok |
| `place/bahrayn.md` | ok |
| `place/basra.md` | ok |
| `place/cairo.md` | ok |
| `place/damascus.md` | ok |
| `place/dhu-awan.md` | ok |
| `place/dhu-tuwa.md` | ok |

## Batch 2 of 19

Pages place/dumat-al-jandal.md to place/taif.md (25 pages).

| Page | Result |
|---|---|
| `place/dumat-al-jandal.md` | ok |
| `place/ghar-hira.md` | ok |
| `place/ghar-thawr.md` | ok |
| `place/hamadan.md` | ok |
| `place/iraq.md` | ok |
| `place/isfahan.md` | ok |
| `place/istanbul.md` | ok |
| `place/jerusalem.md` | ok |
| `place/khaybar.md` | ok |
| `place/kufa.md` | ok |
| `place/maan.md` | ok |
| `place/marib.md` | ok |
| `place/marr-al-zahran.md` | ok |
| `place/maysan.md` | ok |
| `place/mecca.md` | ok |
| `place/medina.md` | ok |
| `place/mount-sal.md` | ok |
| `place/mutah.md` | ok |
| `place/najran.md` | ok |
| `place/petra.md` | ok |
| `place/quba.md` | ok |
| `place/qudayd.md` | ok |
| `place/sanaa.md` | ok |
| `place/tabuk.md` | ok |
| `place/taif.md` | ok |

## Batch 3 of 19

Pages place/thaniyyat-al-wada.md to group/banu-dubaya-ibn-zayd.md (25 pages).

| Page | Result |
|---|---|
| `place/thaniyyat-al-wada.md` | ok |
| `place/uhud.md` | ok |
| `place/ukaz.md` | ok |
| `place/wadi-al-mushaqqaq.md` | ok |
| `place/wadi-hunayn.md` | ok |
| `place/wadi-nakhla.md` | ok |
| `place/yemen.md` | ok |
| `group/adnan.md` | ok |
| `group/ahl-al-bayt.md` | ok |
| `group/al-arab-al-baida.md` | ok |
| `group/al-azd.md` | ok |
| `group/ansar.md` | ok |
| `group/aslam.md` | ok |
| `group/banu-abd-dar.md` | ok |
| `group/banu-abd-shams.md` | ok |
| `group/banu-adi.md` | ok |
| `group/banu-al-ajlan.md` | ok |
| `group/banu-al-dil.md` | fixed (1) |
| `group/banu-al-harith.md` | ok |
| `group/banu-amir.md` | ok |
| `group/banu-amr-ibn-awf.md` | ok |
| `group/banu-asad-ibn-khuzayma.md` | ok |
| `group/banu-asad.md` | ok |
| `group/banu-bakr.md` | ok |
| `group/banu-dubaya-ibn-zayd.md` | ok |

## Batch 4 of 19

Pages group/banu-ghifar.md to group/early-muslims.md (25 pages).

| Page | Result |
|---|---|
| `group/banu-ghifar.md` | ok |
| `group/banu-hamdan.md` | ok |
| `group/banu-hashim.md` | fixed (1) |
| `group/banu-jumah.md` | ok |
| `group/banu-jusham.md` | ok |
| `group/banu-lakhm.md` | ok |
| `group/banu-makhzum.md` | ok |
| `group/banu-nadir.md` | ok |
| `group/banu-nasr.md` | ok |
| `group/banu-qaynuqa.md` | ok |
| `group/banu-qurayza.md` | ok |
| `group/banu-sahm.md` | ok |
| `group/banu-salim-ibn-awf.md` | ok |
| `group/banu-salima.md` | ok |
| `group/banu-shayban.md` | fixed (1) |
| `group/banu-tahm.md` | ok |
| `group/banu-tamim.md` | ok |
| `group/banu-ubayd-ibn-zayd.md` | ok |
| `group/banu-umayya-ibn-zayd.md` | ok |
| `group/banu-umayya.md` | ok |
| `group/banu-waqif.md` | ok |
| `group/banu-zubayd.md` | ok |
| `group/banu-zuhra.md` | ok |
| `group/builders-of-masjid-al-dirar.md` | ok |
| `group/early-muslims.md` | ok |

## Batch 5 of 19

Pages group/ghassan.md to event/abu-khaythama-joins-the-army.md (25 pages).

| Page | Result |
|---|---|
| `group/ghassan.md` | ok |
| `group/hanbali-madhhab.md` | ok |
| `group/hawazin.md` | fixed (2) |
| `group/himyar.md` | fixed (1) |
| `group/hudhayl.md` | ok |
| `group/jahmiyya.md` | fixed (1) |
| `group/jews-of-khaybar.md` | ok |
| `group/jurhum.md` | ok |
| `group/kahlan.md` | ok |
| `group/khathum.md` | ok |
| `group/khuzaa.md` | ok |
| `group/kinana.md` | ok |
| `group/mothers-of-the-believers.md` | ok |
| `group/muhajirun.md` | ok |
| `group/murjia.md` | ok |
| `group/mutazila.md` | ok |
| `group/qadariyya.md` | ok |
| `group/qahtan.md` | ok |
| `group/qudaa.md` | ok |
| `group/quraysh.md` | ok |
| `group/thaqif.md` | fixed (1) |
| `event/abolition-caliphate-1342.md` | ok |
| `event/abu-bakr-leads-the-prayers.md` | ok |
| `event/abu-dharr-lags-behind-on-the-march.md` | ok |
| `event/abu-khaythama-joins-the-army.md` | ok |

## Batch 6 of 19

Pages event/abu-quhafa-conversion.md to event/battle-of-the-trench.md (25 pages).

| Page | Result |
|---|---|
| `event/abu-quhafa-conversion.md` | ok |
| `event/abu-ruhm-and-the-stragglers-of-ghifar-and-aslam.md` | ok |
| `event/abu-sufyan-conversion.md` | ok |
| `event/abu-sufyan-medina-mission.md` | ok |
| `event/abu-talib-gathers-clans.md` | ok |
| `event/abyssinian-occupation-of-yemen.md` | ok |
| `event/address-to-the-ansar-at-jirana.md` | ok |
| `event/al-dawa-al-sirriyya.md` | ok |
| `event/al-jadd-ibn-qays-asks-to-stay-behind.md` | ok |
| `event/ali-expedition-to-al-fuls.md` | ok |
| `event/ali-left-with-the-prophets-family.md` | ok |
| `event/arab-congress-paris-1332.md` | ok |
| `event/assassination-attempt-of-amir-and-arbad.md` | ok |
| `event/assassination-of-sallam-ibn-abi-al-huqayq.md` | ok |
| `event/badr-council.md` | ok |
| `event/badr-duel.md` | ok |
| `event/badr-prisoners.md` | ok |
| `event/badr-qulayb.md` | ok |
| `event/bahira-encounter.md` | ok |
| `event/battle-of-badr.md` | ok |
| `event/battle-of-dhu-qar.md` | ok |
| `event/battle-of-hunayn.md` | ok |
| `event/battle-of-khaybar.md` | ok |
| `event/battle-of-mutah.md` | ok |
| `event/battle-of-the-trench.md` | ok |

## Batch 7 of 19

Pages event/battle-of-uhud.md to event/death-of-umm-kulthum-bint-muhammad.md (25 pages).

| Page | Result |
|---|---|
| `event/battle-of-uhud.md` | fixed (2) |
| `event/bayat-al-ridwan.md` | ok |
| `event/bedouin-excuse-makers.md` | ok |
| `event/believers-who-lagged-without-doubt.md` | ok |
| `event/betrayal-of-abdullah-ibn-ubayy.md` | ok |
| `event/boycott-of-banu-hashim.md` | ok |
| `event/boycott-of-the-three.md` | ok |
| `event/brotherhood-of-muhajirun-and-ansar.md` | ok |
| `event/building-of-the-kaaba.md` | ok |
| `event/burial-of-dhu-al-bijadayn.md` | ok |
| `event/burial-of-the-prophet.md` | ok |
| `event/burning-of-suwaylims-house.md` | ok |
| `event/camp-at-al-hijr.md` | ok |
| `event/change-of-qibla.md` | ok |
| `event/conquest-of-mecca.md` | ok |
| `event/constitution-of-medina.md` | ok |
| `event/conversion-of-umayr-ibn-wahb.md` | ok |
| `event/council-of-uhud.md` | ok |
| `event/dawat-al-ashira.md` | ok |
| `event/death-of-abdullah-ibn-ubayy.md` | fixed (1) |
| `event/death-of-abu-dharr-at-al-rabadha.md` | ok |
| `event/death-of-amina.md` | ok |
| `event/death-of-ibrahim.md` | ok |
| `event/death-of-the-prophet.md` | ok |
| `event/death-of-umm-kulthum-bint-muhammad.md` | ok |

## Batch 8 of 19

Pages event/delegation-of-abd-al-qays.md to event/expedition-of-dhu-al-ushayra.md (25 pages).

| Page | Result |
|---|---|
| `event/delegation-of-abd-al-qays.md` | ok |
| `event/delegation-of-banu-hanifa.md` | ok |
| `event/delegation-of-hamdan.md` | ok |
| `event/delegation-of-najran.md` | ok |
| `event/delegation-of-thaqif.md` | ok |
| `event/demolition-of-al-lat.md` | ok |
| `event/demolition-of-al-uzza-and-idols.md` | ok |
| `event/demolition-of-masjid-al-dirar.md` | ok |
| `event/deposition-abd-al-hamid-1327.md` | ok |
| `event/dispatch-of-sadaqa-collectors.md` | ok |
| `event/distribution-of-hunayn-spoils.md` | ok |
| `event/emigrants-carried-in-two-ships.md` | ok |
| `event/expedition-of-al-abwa-waddan.md` | ok |
| `event/expedition-of-al-kharrar.md` | ok |
| `event/expedition-of-al-kudr.md` | ok |
| `event/expedition-of-al-qarada.md` | ok |
| `event/expedition-of-al-sawiq.md` | ok |
| `event/expedition-of-badr-al-mawida.md` | ok |
| `event/expedition-of-banu-al-mustaliq.md` | ok |
| `event/expedition-of-banu-al-nadir.md` | ok |
| `event/expedition-of-buhran.md` | ok |
| `event/expedition-of-buwat.md` | ok |
| `event/expedition-of-dhat-al-riqa.md` | ok |
| `event/expedition-of-dhat-al-salasil.md` | ok |
| `event/expedition-of-dhu-al-ushayra.md` | ok |

## Batch 9 of 19

Pages event/expedition-of-dhu-amarr.md to event/funeral-prayer-for-the-negus.md (25 pages).

| Page | Result |
|---|---|
| `event/expedition-of-dhu-amarr.md` | ok |
| `event/expedition-of-dhu-qarad.md` | ok |
| `event/expedition-of-dumat-al-jandal.md` | ok |
| `event/expedition-of-nakhla.md` | ok |
| `event/expedition-of-rabigh.md` | ok |
| `event/expedition-of-safwan.md` | ok |
| `event/expedition-of-sif-al-bahr.md` | ok |
| `event/expedition-of-usama.md` | ok |
| `event/expedition-to-awtas.md` | ok |
| `event/expedition-to-tabuk.md` | ok |
| `event/expulsion-of-jurhum.md` | fixed (1) |
| `event/farewell-pilgrimage.md` | ok |
| `event/farewell-sermon-at-arafat.md` | ok |
| `event/farewell-visit-to-uhud-martyrs.md` | ok |
| `event/fasting-of-ramadan-prescribed.md` | ok |
| `event/fath-mecca-cleansing-kaaba.md` | ok |
| `event/fath-mecca-proscribed-persons.md` | fixed (1) |
| `event/fath-mecca-sermon.md` | ok |
| `event/fatrat-al-wahy.md` | ok |
| `event/first-encounter-with-the-ansar.md` | ok |
| `event/first-jumma.md` | ok |
| `event/first-migration-to-abyssinia.md` | ok |
| `event/first-revelation.md` | ok |
| `event/flood-of-al-aram.md` | ok |
| `event/funeral-prayer-for-the-negus.md` | fixed (1) |

## Batch 10 of 19

Pages event/ghar-thawr.md to event/journey-to-taif.md (25 pages).

| Page | Result |
|---|---|
| `event/ghar-thawr.md` | ok |
| `event/ghassan-kings-letter-to-kaab.md` | ok |
| `event/greek-landing-izmir-1338.md` | ok |
| `event/hajj-led-by-abu-bakr.md` | ok |
| `event/harb-al-fijar.md` | ok |
| `event/hawazin-delegation-and-amnesty.md` | ok |
| `event/herzl-audience-1901.md` | ok |
| `event/hijra-departure.md` | ok |
| `event/hijra.md` | ok |
| `event/hilf-al-fudul.md` | ok |
| `event/hypocrites-ambush-at-the-pass.md` | fixed (1) |
| `event/hypocrites-discourage-marching-in-the-heat.md` | ok |
| `event/hypocrites-mock-the-army-and-excuse.md` | ok |
| `event/ibn-ubayy-separate-camp-and-withdrawal.md` | ok |
| `event/incident-of-al-raji.md` | ok |
| `event/incident-of-bir-mauna.md` | ok |
| `event/incident-of-dhat-anwat.md` | ok |
| `event/incident-of-the-poisoned-sheep.md` | ok |
| `event/incident-of-the-slander.md` | ok |
| `event/introduction-of-idolatry-to-mecca.md` | ok |
| `event/islam-of-hamza.md` | ok |
| `event/islam-of-umar.md` | ok |
| `event/isra-and-miraj.md` | fixed (1) |
| `event/jafar-arrival-at-khaybar.md` | ok |
| `event/journey-to-taif.md` | ok |

## Batch 11 of 19

Pages event/kaab-and-abu-qatada-at-the-garden-wall.md to event/night-supplication-at-al-baqia.md (25 pages).

| Page | Result |
|---|---|
| `event/kaab-and-abu-qatada-at-the-garden-wall.md` | ok |
| `event/kaab-ibn-malik-delays-his-preparations.md` | ok |
| `event/kaab-ibn-zuhayr-pardon-and-burda.md` | ok |
| `event/kaab-offers-his-wealth-and-vows-truthfulness.md` | ok |
| `event/kaab-tells-the-prophet-the-truth.md` | ok |
| `event/khalid-expedition-to-ukaydir.md` | ok |
| `event/khandama-skirmish.md` | ok |
| `event/khirash-incident.md` | ok |
| `event/khuzaa-appeal-to-medina.md` | ok |
| `event/khuzaa-bakr-clash-al-watir.md` | ok |
| `event/killing-of-kab-ibn-al-ashraf.md` | ok |
| `event/last-minbar-sermon.md` | ok |
| `event/last-quraysh-delegation-to-abu-talib.md` | ok |
| `event/letter-of-himyar-kings.md` | ok |
| `event/letters-to-rulers-and-kings.md` | ok |
| `event/lian-between-uwaymir-and-his-wife.md` | ok |
| `event/marriage-to-khadija.md` | ok |
| `event/marriage-to-sawda.md` | ok |
| `event/marriage-to-zaynab-bint-jahsh.md` | ok |
| `event/martyrdom-of-farwa-al-judhami.md` | ok |
| `event/masjid-al-dirar-builders-ask-the-prophet-to-pray.md` | ok |
| `event/massacre-of-najran.md` | ok |
| `event/muslim-army-deployment-uhud.md` | ok |
| `event/muslim-intelligence-uhud.md` | ok |
| `event/night-supplication-at-al-baqia.md` | ok |

## Batch 12 of 19

Pages event/order-to-the-three-to-separate-from-their-wives.md to event/sariyya-of-al-dahhak-to-banu-kilab.md (25 pages).

| Page | Result |
|---|---|
| `event/order-to-the-three-to-separate-from-their-wives.md` | ok |
| `event/pen-and-paper-incident.md` | ok |
| `event/persecution-of-mustadafin.md` | ok |
| `event/persian-rule-of-yemen.md` | ok |
| `event/pledges-of-aqaba.md` | ok |
| `event/plot-of-dar-al-nadwa.md` | ok |
| `event/preparation-for-uhud.md` | ok |
| `event/proclamation-of-surat-baraa.md` | ok |
| `event/prophets-mosque-built.md` | ok |
| `event/prophets-mosques-between-medina-and-tabuk.md` | ok |
| `event/prophets-return-and-excuses-of-the-stragglers.md` | ok |
| `event/prophets-speech-to-the-ansar.md` | ok |
| `event/quba-sojourn.md` | ok |
| `event/qusayy-takes-mecca.md` | ok |
| `event/rain-at-al-hijr-after-the-prophets-prayer.md` | ok |
| `event/rebuilding-of-the-kaaba.md` | ok |
| `event/recovery-of-abd-al-muttalib-rights.md` | ok |
| `event/redigging-of-zamzam.md` | ok |
| `event/repentance-of-the-three-accepted.md` | ok |
| `event/return-of-abyssinian-emigrants.md` | ok |
| `event/sacrifice-of-ismail.md` | ok |
| `event/safa-proclamation.md` | ok |
| `event/sajdat-al-najm.md` | ok |
| `event/saqifa.md` | ok |
| `event/sariyya-of-al-dahhak-to-banu-kilab.md` | ok |

## Batch 13 of 19

Pages event/sariyya-of-alqama-to-jeddah.md to event/umar-dismisses-al-numan-ibn-adi.md (25 pages).

| Page | Result |
|---|---|
| `event/sariyya-of-alqama-to-jeddah.md` | ok |
| `event/sariyya-of-qutba-to-khatham.md` | ok |
| `event/sariyya-of-uyayna-to-banu-tamim.md` | ok |
| `event/second-migration-to-abyssinia.md` | ok |
| `event/sermon-at-mina-yawm-al-nahr.md` | ok |
| `event/settlement-of-hajar-and-ismail.md` | ok |
| `event/shaqq-al-sadr.md` | ok |
| `event/siege-of-banu-qaynuqa.md` | ok |
| `event/siege-of-banu-qurayza.md` | ok |
| `event/siege-of-taif.md` | ok |
| `event/stoning-of-al-ghamidiyya.md` | ok |
| `event/sunbadh-revolt-137.md` | ok |
| `event/tabuk-departure-and-deputies.md` | ok |
| `event/tabuk-mobilisation-order.md` | ok |
| `event/tabuk-stay-and-return.md` | ok |
| `event/the-choice-of-the-prophets-wives.md` | ok |
| `event/the-prophets-she-camel-strays.md` | ok |
| `event/the-three-left-behind.md` | ok |
| `event/the-weepers-al-bakkaun.md` | ok |
| `event/treaty-of-ayla.md` | ok |
| `event/treaty-of-hudaybiyya.md` | ok |
| `event/treaty-of-ukaydir.md` | ok |
| `event/ubaydullah-ibn-jahsh-leaves-islam-in-abyssinia.md` | ok |
| `event/uhud-tactical-deployment.md` | ok |
| `event/umar-dismisses-al-numan-ibn-adi.md` | ok |

## Batch 14 of 19

Pages event/umrah-of-jirana.md to journey/hamra-al-asad-pursuit.md (25 pages).

| Page | Result |
|---|---|
| `event/umrah-of-jirana.md` | ok |
| `event/umrah-of-qada.md` | ok |
| `event/utba-offer.md` | ok |
| `event/uthman-funds-the-army-of-hardship.md` | ok |
| `event/vow-and-lot-of-abd-al-muttalib.md` | ok |
| `event/walid-council.md` | ok |
| `event/water-of-wadi-al-mushaqqaq.md` | ok |
| `event/year-of-delegations.md` | ok |
| `event/year-of-sorrow.md` | ok |
| `event/year-of-the-elephant-and-birth.md` | ok |
| `journey/aydhab-to-jeddah.md` | ok |
| `journey/badr-march.md` | ok |
| `journey/badr-to-medina-jubayr.md` | ok |
| `journey/baghdad-to-damascus-jubayr.md` | ok |
| `journey/baghdad-to-medina-jubayr.md` | ok |
| `journey/banu-qurayza-march.md` | ok |
| `journey/basra-to-persia-battuta.md` | ok |
| `journey/cairo-to-aydhab.md` | ok |
| `journey/dumat-al-jandal-5ah.md` | ok |
| `journey/dumat-al-jandal-expedition.md` | ok |
| `journey/farewell-pilgrimage-route.md` | ok |
| `journey/fath-mecca-march.md` | ok |
| `journey/first-migration-to-abyssinia.md` | ok |
| `journey/granada-to-cairo.md` | ok |
| `journey/hamra-al-asad-pursuit.md` | ok |

## Batch 15 of 19

Pages journey/hijra-route.md to concept/ariya-madmuna.md (25 pages).

| Page | Result |
|---|---|
| `journey/hijra-route.md` | ok |
| `journey/hudaybiyya-march.md` | ok |
| `journey/hunayn-and-taif.md` | ok |
| `journey/isra-and-miraj-route.md` | ok |
| `journey/journey-to-taif.md` | ok |
| `journey/mecca-to-iraq-by-medina.md` | ok |
| `journey/medina-to-mecca.md` | ok |
| `journey/mustaliq-raid.md` | ok |
| `journey/mutah-march.md` | ok |
| `journey/road-to-khaybar.md` | ok |
| `journey/sicily-to-granada-jubayr.md` | ok |
| `journey/syria-trade-for-khadija.md` | ok |
| `journey/syria-trade-with-abu-talib.md` | ok |
| `journey/tabriz-to-mosul-battuta.md` | ok |
| `journey/tabuk-march-out-and-back.md` | ok |
| `journey/tangier-to-cairo.md` | ok |
| `journey/uhud-approach.md` | ok |
| `concept/ahl-al-qibla.md` | ok |
| `concept/akhira.md` | ok |
| `concept/al-bakkaun.md` | ok |
| `concept/al-hajr-social-boycott.md` | ok |
| `concept/al-muallafa-qulubuhum.md` | ok |
| `concept/al-sidq-truthfulness.md` | ok |
| `concept/anwa.md` | fixed (1) |
| `concept/ariya-madmuna.md` | ok |

## Batch 16 of 19

Pages concept/ashara-mubashshara.md to concept/nasi.md (25 pages).

| Page | Result |
|---|---|
| `concept/ashara-mubashshara.md` | ok |
| `concept/ashrat-al-saa.md` | ok |
| `concept/azlam.md` | ok |
| `concept/emancipation-of-enemy-slaves.md` | ok |
| `concept/five-pillars.md` | ok |
| `concept/ghulul.md` | ok |
| `concept/hama.md` | ok |
| `concept/hubb-al-sahaba.md` | ok |
| `concept/hums.md` | fixed (1) |
| `concept/ihsan.md` | ok |
| `concept/iman.md` | ok |
| `concept/islam-din.md` | ok |
| `concept/jahili-marriage-forms.md` | fixed (1) |
| `concept/jaysh-al-usra.md` | ok |
| `concept/kahana.md` | ok |
| `concept/kalam-allah.md` | ok |
| `concept/karamat-al-awliya.md` | ok |
| `concept/kasb.md` | ok |
| `concept/khalq-al-quran.md` | ok |
| `concept/khatm-al-nubuwwa.md` | ok |
| `concept/khilafa-rashida.md` | ok |
| `concept/la-yanbaghi.md` | ok |
| `concept/maysar.md` | fixed (1) |
| `concept/muhajirun-of-abyssinia.md` | ok |
| `concept/nasi.md` | ok |

## Batch 17 of 19

Pages concept/prohibition-killing-women-children.md to period/colonial-era.md (25 pages).

| Page | Result |
|---|---|
| `concept/prohibition-killing-women-children.md` | ok |
| `concept/qadar.md` | ok |
| `concept/riwayat-al-imam.md` | ok |
| `concept/ruyat-allah.md` | ok |
| `concept/sacred-livestock-jahiliyya.md` | fixed (1) |
| `concept/shafaa.md` | ok |
| `concept/shahada.md` | ok |
| `concept/taat-wulat-al-amr.md` | ok |
| `concept/takhalluf-an-ghazwat-tabuk.md` | ok |
| `concept/tawba.md` | ok |
| `concept/tawhid.md` | ok |
| `concept/tiyara.md` | ok |
| `concept/wad.md` | ok |
| `polity/aksumite-kingdom.md` | ok |
| `polity/byzantine-empire.md` | ok |
| `polity/ghassanid-kingdom.md` | ok |
| `polity/himyarite-kingdom.md` | ok |
| `polity/kingdom-of-saba.md` | ok |
| `polity/lakhmid-kingdom.md` | ok |
| `polity/nabataean-kingdom.md` | ok |
| `polity/sasanian-empire.md` | ok |
| `period/abbasid-early.md` | ok |
| `period/abbasid-fragmentation.md` | ok |
| `period/buyid-seljuk-fatimid-era.md` | ok |
| `period/colonial-era.md` | ok |

## Batch 18 of 19

Pages period/contemporary-era.md to source/rahma-lil-alamin.md (25 pages).

| Page | Result |
|---|---|
| `period/contemporary-era.md` | ok |
| `period/crusades-ayyubid-mamluk.md` | ok |
| `period/gunpowder-empires.md` | ok |
| `period/modern-era.md` | ok |
| `period/mongol-post-mongol.md` | ok |
| `period/pre-islamic-arabia.md` | ok |
| `period/prophetic-era.md` | ok |
| `period/rashidun.md` | ok |
| `period/umayyad.md` | ok |
| `work/abu-khaythama-verses.md` | ok |
| `work/al-dahhak-ibn-khalifa-verses.md` | ok |
| `work/al-mughni.md` | ok |
| `work/bujayr-ibn-bujra-verses.md` | ok |
| `work/covenant-of-ayla.md` | ok |
| `work/farewell-sermon.md` | ok |
| `work/hatib-letter-to-quraysh.md` | ok |
| `work/kaab-ibn-malik-account-of-tabuk.md` | ok |
| `work/madkhal-ila-madhhab-ahmad.md` | ok |
| `work/mukhtasar-al-kharaqi.md` | ok |
| `work/qasidat-banat-suad.md` | ok |
| `source/al-aalam.md` | ok |
| `source/ikhbar-al-kiram.md` | ok |
| `source/muhadarat-tarikh-al-umam-al-islamiyya.md` | ok |
| `source/qalb-jazirat-al-arab.md` | ok |
| `source/rahma-lil-alamin.md` | ok |

## Batch 19 of 19

Pages source/sifr-al-takwin.md to exhibit/path-women-around-the-prophet.md (9 pages).

| Page | Result |
|---|---|
| `source/sifr-al-takwin.md` | ok |
| `source/tafhim-al-quran.md` | ok |
| `source/tarikh-al-tabari.md` | ok |
| `source/tarikh-ard-al-quran.md` | ok |
| `exhibit/path-abyssinia-migrations.md` | no citation: listed for citation |
| `exhibit/path-from-opposition-to-islam.md` | no citation: listed for citation |
| `exhibit/path-islam-in-30-minutes.md` | no citation: listed for citation |
| `exhibit/path-meccan-period.md` | no citation: listed for citation |
| `exhibit/path-women-around-the-prophet.md` | no citation: listed for citation |

