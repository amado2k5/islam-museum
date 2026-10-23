# S3 slice log: jurists, theologians, hadith scholars, Sufi masters (died before 1800 CE)

Run status: no records created, no existing records edited. Stopped before writing because the write to existing `data/person/*.yaml` files was denied by the permission check (shared resource) and is outside this slice's named files.

Scope query: P31 = Q5, P106 in {Q1999841 Islamic jurist, Q185992 mufti, Q1172458 muhaddith, Q2892720 Sufi, Q12270170 mutakallim, Q137351830 Islamic theologian, Q1234713 theologian (Islam-specific entries only)}, P570 earliest year before 1800. About 2,000 candidates not yet linked by Wikidata ID; most are obscure and have no confirmed book source yet.

## Linked (existing record, name and description match; edit pending owner or next run)
- linked: person/abu-hanifa -> Q190896
- linked: person/al-bukhari -> Q241026
- linked: person/al-shafii -> Q294281
- linked: person/ahmad-ibn-hanbal -> Q194442
- linked: person/ibn-taymiyya -> Q491558
- linked: person/malik-ibn-anas -> Q312299
- linked: person/muslim-ibn-al-hajjaj -> Q140124
- linked: person/al-tabari -> Q192124
- linked: person/ibn-hazm -> Q317787
- linked: person/al-ashari -> Q316349
- linked: person/al-nawawi -> Q293571
- linked: person/fakhr-al-din-al-razi -> Q333703
- linked: person/ibn-hajar-al-asqalani -> Q471116
- linked: person/abu-dawud-al-sijistani -> Q336558
- linked: person/ibn-qayyim-al-jawziyya -> Q119679
- linked: person/ibn-majah -> Q381469
- linked: person/al-suyuti -> Q468432
- linked: person/al-nasai -> Q293535
- linked: person/ibn-al-jawzi -> Q731866
- linked: person/sufyan-al-thawri -> Q205788
- linked: person/al-tahawi -> Q293771
- linked: person/al-mawardi -> Q335635
- linked: person/abd-al-qadir-al-jilani -> Q307365
- linked: person/al-ghazali-abu-hamid -> Q9546
- linked: person/al-hasan-al-basri -> Q293500
- linked: person/al-tirmidhi-muhammad-ibn-isa -> Q293578
- linked: person/al-junayd-ibn-muhammad -> Q735601
- linked: person/ibn-khallikan -> Q71394
- linked: person/ibn-qudama-al-maqdisi -> Q785506
- linked: person/muhammad-ibn-sirin -> Q2620027
- linked: person/al-tabarani -> Q2627801 (Wikidata entry is "Muslim philosopher"; record is the hadith scholar; confirm before writing)
- linked: person/al-bayhaqi-abu-bakr-ahmad-ibn-al-husayn -> Q293663
- linked: person/al-khatib-al-baghdadi-ahmad -> Q557961
- linked: person/al-qushayri-abu-l-qasim -> Q4115259
- linked: person/imam-al-haramayn-al-juwayni -> Q2584074
- linked: person/ibn-abd-al-barr -> Q732363
- linked: person/yahya-ibn-main -> Q2004370
- linked: person/ishaq-ibn-rahwayh -> Q439344
- linked: person/abd-allah-ibn-al-mubarak -> Q4666111
- linked: person/al-awzai-abd-al-rahman -> Q293669
- linked: person/muhammad-ibn-al-hasan-al-shaybani -> Q293612
- linked: person/urwa-ibn-al-zubayr -> Q423774
- linked: person/ahmad-al-ghazali -> Q320324
- linked: person/sahl-al-tustari -> Q1153185
- linked: person/ibn-asakir -> Q565665

## Skipped
- skipped: person/muhammad-ibn-al-musayyib vs Q4115160 (Said ibn al-Musayyib): record is Abu al-Darda Muhammad ibn al-Musayyib, a different person; no link.
- skipped: all other ~1,950 candidates: no book source confirmed yet (no catalogue check run in this slice); obscure, low sitelink count.
- skipped: dates left out; Wikidata death years are coarse (00-00 precision) and none is sourced here.

## Created
- none in this run

## Next
- Owner or next run: apply the 45 links above (add `external_ids: { wikidata: Q... }`), then confirm Q2627801 before writing it.
- Next run: pick new candidates with a catalogue-confirmed book source (WorldCat or a national library).
