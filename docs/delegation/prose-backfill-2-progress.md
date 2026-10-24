# `prose-backfill-2` progress

Lane doc: `docs/agents/lanes/prose-backfill-2.md`. Programme plan: `docs/delegation/knowledge-completeness-plan.md` (Phase 1). Opened 23 Oct 2026 (Devin, SWE-2 Medium), after the plan PR (#603) merged.

**Queue.** Missing-prose tier ranked by inbound links, recomputed 23 Oct 2026 on `origin/main` (12,391 missing). Split boundary: this lane works missing prose top-down and stops before the zero-link tail; `prose-backfill` keeps the thin tier. Head of queue at open: `person/muhammad-mutawalli-al-shaarawi` (104 links), `person/muhammad-ibn-yahya-ibn-habban` (44), `person/malik-ibn-abi-amir-al-asbahi` (28), `person/yahya` (16), `place/najd` (8), `group/mongols` (7).

**Lane total: 29.**

## Batches

### Batch 1 (23 Oct 2026, 11 records, ar+en+ur)

Written (queue position noted):
- `place/najd` — Hamdani, Sifat Jazirat al-Arab pp. 87-88 (the Hijaz/Tihama boundary definition).
- `group/mongols` — Ibn Khaldun, al-Ibar (Heliopolis 1957) pp. 34-36; Kamil cited as record's source.
- `event/siege-of-uthman-35` — Suyuti, Tarikh al-Khulafa pp. 270-276 (Zuhri, Ibn Sa'd); **flag:** record's filed source is Tabari but the harvested Tabari vols do not cover 35 AH — Tabari comparison still needed.
- `person/al-hadi` — Tarikh al-Khulafa pp. 442, 451-452 (bay'a 159/169, death Rabi' II 170, disputed cause — all variants given).
- `person/al-baqillani` — Wafayat al-A'yan v.4 (Ihsan Abbas); **flag:** vol. 4 extract has no page markers, cited to the work; page to be added on page-image check.
- `person/abu-mansur-al-maturidi` — al-A'lam (mim vol, scan p. 164) + Wafayat.
- `person/sufyan-ibn-awf` — Isaba (Dar al-Faysaliyya) pp. 588-589 + al-A'lam p. 378; death 53/54 AH (Khalifa/Abu Ubayd) and killed near Constantinople (Zirikli) — variants given.
- `person/mikhnaf-ibn-sulaym` — Isaba p. 1381 (Azdi of Kufa/Basra, Arafat sacrifice hadith, ancestor of Abu Mikhnaf).
- `person/aktham-ibn-sayfi` — Nihayat al-Arab v.3 pp. 11, 15 (marginal notice + his proverbs); **flag:** death year unclear in OCR (~630 CE), needs image check.
- `person/mudar-ibn-nizar` — Nihayat al-Arab v.3 pp. 8-9 (Nizar's division and the al-Af'a arbitration).
- `work/kitab-al-shifa` — Hasan Ibrahim Hasan, Tarikh al-Islam (cultural vol.) pp. 392-393 quoting Ibn Khallikan 2/152-153.

Skipped, no readable book source located in the harvest (records cite `source/al-aalam` or similar but the entry was not found in the extracted volumes, or only passing isnad mentions exist):
- `person/muhammad-mutawalli-al-shaarawi` — record cites al-A'lam + his own works; no biographical entry found in the four extracted A'lam vols; his own books cannot source his bio.
- `person/muhammad-ibn-yahya-ibn-habban` — no A'lam entry under mim found; only isnad mentions in Ma'rifat al-Sahaba.
- `person/malik-ibn-abi-amir-al-asbahi` — A'lam entry not found in extracted vols; Wafayat v.2 mention not located in text.
- `person/muhammad-ibn-abd-al-rahman-ibn-nawfal` — nearest A'lam hit is Jubayr b. Mut'im, a different person.
- `person/mabad-ibn-kab-ibn-malik` — appears in Isaba only inside isnads (Ka'b b. Malik's repentance chain), no tarjama.
- `person/al-najashi` — record is Ahmad b. Ali al-Najashi (Imami rijal scholar); A'lam hits found are the Negus of Abyssinia — different person.
- `person/baha-al-din-naqshband`, `person/shaykh-al-tusi`, `person/yunus-emre`, `person/rashid-al-din-sinan`, `person/zahir-al-din-ibn-al-attar`, `person/qutb-al-din-mawdud`, `person/qurayba-bint-abi-umayya` — entries not located in the four extracted A'lam volumes (other vols absent from the drive) and no alternate book found.
- `person/kayqubad-i`, `person/sulayman-shah-ii-rum`, `person/qilij-arslan-ii`, `person/il-arslan-khwarazmshah` — Hasan Ibrahim vol. 4 gives only a dynastic table (p. 92); too thin for a sourced page; **flag:** find Seljuk-Rum narrative source.
- `person/qara-yusuf`, `person/mustafa-aga-mimarbashi` — no hits in the extracted Salabi Ottoman vols or al-Ibar.
- `concept/muslim-brotherhood-founding-idea`, `event/*ottoman*/modern buildings` — deferred to Phase 4 (`modern-century`) where they belong by period.

### Batch 2 (23 Oct 2026, 18 records, ar+en+ur) — directed fiqh-term batch

Owner directed (23 Oct): `prose-backfill-2` writes the fiqh-term prose now, not deferred to `practice-fiqh`. Batch = the thin/one-line fiqh terms in the practice/concept classes, expanded to full prose from the Kuwaiti Fiqh Encyclopedia (`source/fiqh-mawsua-kuwaitiyya-noor-v3`, Noor-Book OCR; scan-page cites). Note these records sat in the thin tier — normally `prose-backfill`'s queue — but were pulled by owner direction; sibling lane should not rework them (listed done here). Each record's yaml gained the Mawsu'a source and completeness 3.

Written:
- `practice/wudu` — headword «وضوء», pp.17364-17367 (madhhab definitions, shari'a qadima, ordinance with prayer, tayammum relation).
- `practice/tayammum` — «تيمم», pp.6082-6085 (definitions, sabab al-nuzul, ummah's privilege, rukhsa/azima, conditions and arkan).
- `practice/ghusl-al-janaba` — «غسل», pp.12064-12067 (definition, obligation by semen, madhhab conditions, ihtilam ruling).
- `practice/ghusl-al-janaza` — «جنائز», pp.6464-6469 (pre-wash rites, announcing death, kafn as fard kifaya, Quran beside the body); washing itself cited at p.6469 (fard kifaya, details under «تغسيل الميت»).
- `practice/salat-al-janaza` — «جنائز», pp.6476-6481 (fard kifaya, arkan across four schools, conditions, salam, sunnas).
- `practice/salat-al-jumua` — «يوم الجمعة», pp.18016-18019 (name and merit, fard 'ayn, Friday ghusl dispute, travel, fasting).
- `practice/salat-al-kusuf` — «صلاة الكسوف», pp.10614-10616 (definition, sunna mu'akkada / Hanafi wajib, time, forbidden-times dispute).
- `practice/itikaf` — «اعتكاف», pp.2996-2997 (definition, khalwa/ribat/jiwar, wisdom, sunna unless vowed).
- `practice/nadhr` — «نذر», pp.15558-15560 (definition, legitimacy by book/sunna/ijma, recommended vs disliked tendencies).
- `practice/kaffarat-al-yamin` — «كفارة», pp.13408-13410 + «يمين» p.18005 (definition, Ma'ida 89 expiation text, istighfar/tawba/'uquba).
- `practice/sadaqa` — «صدقة», pp.10295-10297 (definition, uses incl. waqf and every ma'ruf, hiba/hadiyya/'ariyya, wisdom and merit).
- `practice/nikah` — «نكاح», pp.16034-16036 (four definitions, haqiqa dispute and its musahara consequence).
- `practice/udhiyya` — «أضحية», pp.2864-2865 (definition, qurban/hady distinction by intention, 'aqiqa/far'/'atira).
- `practice/dafn` — «دفن», pp.8216-8218 (fard kifaya, Qabil, sea burial, cemetery, mosque burial, moving the body).
- `practice/taziya` — «تعزية», pp.5451-5453 (definition, recommendation, recipients, three days, after-burial, gathering dislike).
- `practice/zakat` — «زكاة», pp.9072-9074 (definition, sadaqa/'atiyya, obligation by book/sunna/ijma, fighting withholders).
- `practice/aqiqa` — «عقيقة», p.11783 (definition, nasika name preference).
- `concept/zina` — «زنى», pp.9222-9224 (four definitions, wat'/liwat/sihaq, prohibition and five universals).

Flags:
- The Mawsu'a copy is OCR-only on this drive; scan-page numbers cited are the Noor-Book scan markers (as used by the w01-w10 mining windows), not printed folio numbers.
- `concept/ushri` was **not** rewritten — its record is the land-tax status (ushri land, al-Baladhuri), while Mawsu'a's «عُشْر» covers the dhimmi trade tithe; related but not the record's subject. Left as-is; a fuller treatment can come when «زكاة»/«خراج» material is mined.
- `practice/dhabihah` (the only missing-prose practice) has no headword under «ذبيحة»; likely under «ذكاة» or inside «أضحية» — deferred to next batch sweep.

**Next step (exact):** the hadith-rijal cohort (`person/abu-salih-al-samman`, `person/abd-al-rahman-ibn-abd-al-qari`, …) still needs Isaba entries extracted; the extracted Tahdhib/Taqrib vols on the drive cover different letter-ranges, so per-entry lookup is required. Alternatively continue the fiqh-term tier with the remaining thin practices (`practice/khitan`, `practice/walima`, `practice/miswak`, `practice/istikhara`, `practice/suhur`, `practice/iftar`, `practice/taraweeh`, `practice/sujud-tilawa`, `practice/itikaf`… headwords located: «جنائز», «قيام الليل» p.13134, «عقيقة» p.11783).

## Batch 3 — remaining thin practice terms (16 records)

All from `source/fiqh-mawsua-kuwaitiyya-noor-v3` headwords; each record ar+en+ur prose, source added, completeness 3.

| record | headword scan page(s) |
|---|---|
| practice/adhan | p.2006–2007 |
| practice/istikhara | p.2322–2323 |
| practice/salat-al-istisqa | p.2385–2386 |
| practice/iftar | p.3088–3089 |
| practice/khitan | p.7550–7551 |
| practice/khutba | p.7700–7701 |
| practice/walima | p.17946 |
| practice/suhur | p.9473–9474 |
| practice/salat-al-witr | p.10651–10652 |
| practice/ashura | p.11347–11348 |
| practice/eid-al-fitr | p.11984–11985 («عيد») |
| practice/eid-al-adha | p.11984–11985 («عيد») |
| practice/qiyam-al-layl | p.13134 (+ p.10651 witr relation) |
| practice/tawaf | p.11248–11249 |
| practice/sai | p.9584–9585 |
| practice/umrah | p.11821–11822 |

### Skipped / deferred (no headword found in this scan)
- `practice/taraweeh` — no «تراويح» headword; covered partially inside qiyam/رمضان sections.
- `practice/miswak` — no «سواك» headword located.
- `practice/khatm-al-quran` — no «ختمة» headword.
- `practice/sujud-tilawa` — no «سجدة»/«سجدة التلاوة» headword located.
- `practice/dhabihah` — still deferred (see batch 2 note).
- `practice/sawm-ramadan`, `practice/tahajjud`, `practice/laylat-al-qadr`, `practice/salat-al-duha`, `practice/zakat-al-fitr`, `practice/ziyarat-al-qubur`, `practice/greeting-salam`, `practice/dhikr`, `practice/dua` — candidates for batch 4; headword variants still to check.
- `practice/aqiqah` — probable duplicate of `practice/aqiqa` (already done); needs alias decision, not prose.

## Batch 4 — remaining practice terms, second sweep (16 records)

| record | headword scan page(s) |
|---|---|
| practice/tahajjud | p.5920–5921 («تهجد») |
| practice/laylat-al-qadr | p.13731–13732 («ليلة القدر») |
| practice/salat-al-duha | p.10583 («صلاة الضحى») + p.10494 («صلاة الإشراق») |
| practice/zakat-al-fitr | p.9181 («زكاة الفطر») |
| practice/ziyarat-al-qubur | p.9284 («زيارة» §4–5) |
| practice/dua | p.8102–8103 («دعاء») |
| practice/greeting-salam | p.5084 («تسليم» — the greeting via سلّم على القوم) |
| practice/sujud-tilawa | p.9405–9407 («سجود» — سجود القرآن treated as sujud-like) |
| practice/dhabihah | p.8380–8381 («ذبائح»: نحر/عقر/تذكية) — batch-2 deferral resolved |
| practice/mahr | p.15120 («مهر») + p.14849 (مفوضة: مهر المثل) |
| practice/hajj | p.6836 («حج») |
| practice/tajwid | p.4610–4611 («تجويد») |
| practice/hifz-al-quran | p.7135–7136 («حفظ») |
| practice/ijaza | p.1576 («إجازة») |
| practice/taraweeh | p.10497 («صلاة التراويح») + p.6405 (جلوس بين الترويحتين) |
| practice/sawm-ramadan | p.8986 («رمضان»: ثبوت الشهر بالرؤية) + p.11623 («العشر الأواخر») |

### Still unresolved
- `practice/miswak`, `practice/khatm-al-quran` — no headword located in this scan.
- `practice/dhikr` — «ذكر» headword exists but covers the ritual term across many pages; the standalone-line search missed it; may need section-level extraction in a later pass.
- `practice/aqiqah` — duplicate of `practice/aqiqa`, alias decision pending (founder).
- `practice/mosque-study-circle`, `practice/mawlid-al-nabi`, `practice/urs`, `practice/sama-mawlawiyya`, `practice/rihla-ilm`, `practice/hajj` adjacent cultural records — cultural rather than mawsua headwords; better sourced elsewhere.
- Index pages: many headword hits at pp.~46–1200 are the encyclopedia's own فهرس; real headword = the later page. Batch 4 corrected earlier index false-positives (taraweeh 4930→10497, mahr 14847→15120, ramadan 11623→8986).

## Batch 5 — hadith-rijal cohort (7 records, ar+en+ur)

Pivot per founder direction from the fiqh tier to the missing-prose rijal/general queue. All seven are existing stubs (completeness 1 → 3) whose filed source was `source/al-aalam` (or siyar); prose written from the rijal books on the harvest drive, not from al-A'lam.

| record | source read on the page |
|---|---|
| person/qurayba-bint-abi-umayya | al-Isaba (Dar al-Jil facsimile), women's section p.1946 |
| person/muhammad-ibn-yahya-ibn-habban | Tahdhib al-Kamal, Muhammad-vol entry 6273, pp.551–552 |
| person/malik-ibn-abi-amir-al-asbahi | Taqrib al-Tahdhib entry 6443, pp.576–577 |
| person/muhammad-ibn-abd-al-rahman-ibn-nawfal | Tahdhib al-Kamal entry 6002, pp.408–409 |
| person/bukayr-ibn-al-akhnas-al-sadusi | Thiqat Ibn Hibban 4/76 + editor digest at Tahdhib 2067 (scan p.279) |
| person/abd-al-razzaq-al-sanani | Taqrib al-Tahdhib entry 4554 (Alexandrina scan, ~p.327) + Thiqat editor intro p.25 |
| person/mabad-ibn-kab-ibn-malik | al-Isaba pp.139, 772 + Tahdhib register p.1050 (Tahdhib 10/224) |

New source records created for citations: `source/taqrib-al-tahdhib`, `source/thiqat-ibn-hibban` (both draft, completeness 1).

### Deferred this batch (source not readable on the drive)
- `person/amir-ibn-sad-ibn-abi-waqqas` — his own entry sits in Thiqat vol. 5 (p.186) and Tahdhib vol. 9–10; neither volume is extracted locally. Isnad mentions only.
- `person/jamil-ibn-darraj` — only the badly-corrupted Mizan OCR; no clean own entry found in the extracted Tahdhib volumes.
- `person/abd-al-rahman-ibn-abd-al-qari`, `person/abu-salama-ibn-abd-al-rahman-ibn-awf` — no data records exist yet; out of lane scope (prose backfill, not record creation).
- `person/muhammad-mutawalli-al-shaarawi` (97 inbound links, queue head) — harvest drive holds his *works*, no biographical source extracted; needs siyar/obituary material, deferred.
- `person/al-najashi` — hits are for the wrong Najashi; deferred.

### Methodological notes
- The Taqrib Majmuat and Alexandrina scans carry heavy OCR noise; identity was always confirmed by the full label (nasab chain), never by a short name — e.g. «عامر بن سعد بن مالك الخثعمي» ≠ our «عامر بن سعد بن أبي وقاص», «مالك بن أبي عامر» the grandfather ≠ Imam Malik ibn Anas (entry 6425).
- Thiqat index vol. (BBib-07679) locates entries by vol/page; vols 5–6 of the Hyderabad printing are not extracted, so narrators filed there were deferred rather than guessed.
- Abd al-Razzaq's birth year (126 AH in printings) is not legible in the scan and was left out of prose; death year 211 AH is legible.

## Batch 6 — rijal cohort (agent pb2-rijal)

15 records, ar+en+ur; each record's yaml gained the rijal source actually read and `completeness: 3`. All entries are the person's own tarjama, confirmed by full nasab.

| record | source read on the page |
|---|---|
| person/unays-ibn-qatada | al-Isaba (al-Maktaba al-Asriyya 2012 scan) entry ٤٤٧, pp.105–106 |
| person/thabit-ibn-al-dahhak-al-ashhali | al-Isaba entry ٩٠٢, pp.178–179 + Taqrib entry ٨١٩ (Majmuat scan p.108) |
| person/ubada-ibn-al-khashkhash | al-Isaba entry ٤٥٦٧, pp.769–770 |
| person/dirar-ibn-al-khattab | al-Isaba entry ٤٢١٥, pp.712–713 |
| person/al-mustawrad-ibn-shaddad | al-Isaba entry ٨١٥٧, pp.1399–1400 |
| person/yazid-ibn-ruqaysh | al-Isaba entry ٩٣٤٥, p.1588 |
| person/abu-al-haytham-ibn-al-tayyihan | al-Isaba entry ١٠٧٣٥ (kunya section), pp.1795–1796 |
| person/maqil-ibn-sinan-al-ashjai | al-Isaba entry ١٠٧٨٩ (kunya section), pp.1802–1803 + name-form note p.69 |
| person/mahmud-ibn-maslama | al-Isaba entry ٨٠٠١, p.1374 |
| person/abd-allah-ibn-umm-maktum | al-Isaba entry ٦٦٩٩ (under عمرو), pp.1132–1134 + cross-ref p.833 |
| person/abdullah-ibn-suhayl | al-Isaba entries ٥٢٢٢/٥٢٢٣, pp.892–893 |
| person/amr-ibn-al-ahwas-al-bariqi | al-Isaba entry ٦٣٩٤, pp.1085–1086 |
| person/zirr-ibn-hubaysh | Thiqat Ibn Hibban vol.4 (BBib-07682), scan p.275 = printed p.269 |
| person/yahya-ibn-abi-zaida | Taqrib al-Tahdhib entry ٧٥٤٨ (Majmuat scan p.660) |
| person/hamzah-al-kufi | Taqrib al-Tahdhib entry ١٥١٨ (Majmuat scan p.165) |

### Flags
- `person/amr-ibn-al-ahwas-al-bariqi`: record's nisba «البارقي» vs Isaba text «الجشمي»; Jusham is a Bariq-affiliated Sarat clan, so the same person — both forms kept, flagged in the prose notes.
- `person/abd-allah-ibn-umm-maktum`: entry sits under عمرو (the commoner name); cited pp.1132–1134 with the naming cross-reference at p.833.
- `person/thabit-ibn-al-dahhak-al-ashhali`: Isaba ٩٠٢ vs ٩٠٠/٩٠١ near-namesakes — nasab checked (بن خليفة بن ثعلبة) before writing.
- The 20200217 Isaba scan is the al-Maktaba al-Asriyya one-volume print already registered as `source/ibn-hajar-isaba` (PDF page = printed page); no new source record needed.

### Deferred this batch
- `person/amir-ibn-sad-ibn-abi-waqqas`, `person/jamil-ibn-darraj`, `person/al-najashi`, `person/muhammad-mutawalli-al-shaarawi` — prior-batch deferrals still stand (Thiqat vols 5–6 and Mizan unreadable/absent locally).
- `person/qalun`, `person/ibn-kathir-al-makki` — Qalun's own Taqrib entry not legible in the Majmuat scan (only «محمد بن هارون صاحب قالون» at p.570); Ibn Kathir's own entry not located in the extracted scans.
- `person/zurara-ibn-ayun`, `person/yunus-ibn-abd-al-rahman`, `person/yahya-ibn-yaman` — no clean own-entry in the extracted Thiqat vols (they sit outside vol.4) or Taqrib scans; deferred.
- `person/mubashir-ibn-abd-al-mundhir`, `person/mihjan-ibn-al-adra`, `person/mahja-ibn-salih`, `person/al-hasan-al-muthanna`, `person/al-numan-ibn-amr-al-ansari`, `person/mahmud-ibn-maslama`'s near-namesakes — no own entry in the al-Asriyya Isaba scan (index/parenthetical mentions only).
- Non-rijal queue heads (`person/suleyman-celebi`, `person/yumni`, `person/yamini-poet`, `person/mustafa-aga`, `person/abu-al-hasan-al-shadhili`, `person/abu-abdallah-al-natili`, `person/taqi-al-din-al-subki`, `person/zakariyya-al-ansari`, `person/al-yasa`) — Ottoman/modern/prophetic-figure records; no extracted biography source for them in this lane's books.
## Batch 7 — general cohort (agent pb2-general, 12 records, ar+en+ur)

Return to the general (non-person) queue after the rijal pivot. Ranked by inbound links; every record moved completeness 1→3 with prose in all three languages.

| record | source read on the page |
|---|---|
| concept/saa | Mawsu'at Fiqhiyya Kuwaitiyya, «الصاع» own article pp.14858–14859 |
| practice/miswak | Mawsu'at Fiqhiyya, «السواك» own article pp.2589–2591 (index false-positives at ~46–1200 rejected) |
| practice/khatm-al-quran | Mawsu'at Fiqhiyya, «ختم القرآن» pp.12687–12688 |
| place/hijaz | Hamdani, Sifat Jazirat al-Arab pp.32–33 (Hijaz/Najd boundary) + p.87–88 |
| polity/takrur | Ibn Khaldun, al-Ibar pp.974, 977 + al-Umari, Masalik al-Absar pp.106–107, 254 |
| group/umayyads-of-cordoba | Ibn Khaldun, al-Ibar pp.33, 46, 1655, 1935, 2056 |
| polity/wattasid-dynasty | Ibn Khaldun, al-Ibar (Wattasid/Banu Wattas sections) |
| work/jami-al-bayan | Hasan Ibrahim Hasan, Tarikh al-Islam pp.351–352 |
| work/dalail-al-nubuwwa-bayhaqi | al-Subki, Tabaqat al-Shafi'iyya p.13 |
| work/shuab-al-iman | al-Subki, Tabaqat al-Shafi'iyya p.13 |
| work/taqrib-al-tahdhib | Shadharat al-Dhahab p.280 |
| work/al-isra-wal-miraj-shaarawi | Sha'rawi, al-Isra' wal-Mi'raj (Dar al-Jil) pp.5–9, 40, 49, 74, 86 |

### Deferred this batch
- `work/sujud-al-tilawa` (45 inbound links, queue head among non-person) — no own article located in the extracted Mawsu'at Fiqhiyya text; deferred rather than guessed.
- `work/mirqat-al-mafatih` — no readable own entry in inspected extracts (Kashf al-Zunun hits are bibliographic index material).
- `practice/dhikr` — «ذكر» headword spreads across many pages; still needs section-level extraction.
- `practice/aqiqah` — still deferred pending founder alias decision on `practice/aqiqa`.
- `work/al-adab-al-mufrad`, `work/tawrat`, `work/umm-al-kitab` — queued, not yet sourced this pass.

### Methodological notes
- Kuwaiti encyclopedia pages ~46–1200 are the book's own index; every headword used here is the later own-article page, never an index hit.
- `person/` records untouched; rijal lane owns them.

### Batch 8 (23 Oct 2026, 10 records, ar+en+ur) — general lane (Devin)

| record | source & pages |
|---|---|
| concept/mushaf | Fiqh Mawsu'a Kuwaitiyya pp.12678–12680 (own article); record gains that source (al-A'lam kept) |
| concept/mahram | Fiqh Mawsu'a Kuwaitiyya pp.12678–12680 (maharim/mahram article); Sabiq's Fiqh al-Sunna kept |
| event/mongol-invasions | Ibn Khaldun, al-Ibar pp.34–36 (Mongol rise in the Muqaddima-era material) |
| polity/zunbil-dynasty | al-Baladhuri, Futuh al-Buldan pp.571–577 (Rutbil/Zunbil section) |
| polity/brahmin-dynasty-sindh | al-Baladhuri, Futuh al-Buldan pp.624–633 (Dahir/Sindh conquest section) |
| polity/midrarid-dynasty | Ibn Khaldun, al-Ibar pp.1619–1621 (Sijilmasa, Banu Midrar); Ya'qut kept on record but unused (extracted vols stop before sin) |
| polity/rustamid-imamate | Ibn Khaldun, al-Ibar pp.1609–1614, 1620 (Berber dynasties chapter, Tahert/Ibadi revolt) |
| polity/aghlabid-emirate | Ibn Khaldun, al-Ibar pp.1022–1027 (Aghlabid chapter, Qayrawan + Sicily campaigns) |
| group/hafsids-of-bejaia | Ibn Khaldun, al-Ibar pp.1675–1680 (Banu Hafs chapter; scope limited to Bejaia passages per record's slug) |
| work/tawrat | Ahmad Amin, Duha al-Islam pp.298–303 (Jewish-culture chapter); tanzil-quran kept on record |

### Deferred this batch
- `work/sujud-al-tilawa` (45 links) — still no own article located in extracted Mawsu'a text.
- `work/mirqat-al-mafatih`, `work/umm-al-kitab`, `work/al-adab-al-mufrad` — no readable own entries this pass.
- `concept/mahram` ihram reading kept narrow to kinship/mahram per record scope.

### Methodological notes
- All citations are own-article/section pages, not index hits; OCR forms «رتبيل/وتبيل» verified in context before use.
- `person/` untouched.
## Batch 7 — rijal cohort (agent pb2-rijal)

Shipped after Batch 6 merge (PR #1182 merged 2026-10-23T21:13:57Z). Ten records, Arabic first with English and Urdu companions in the same commit; `completeness: 3` on all ten.

| record | source read on the page |
|---|---|
| person/talha-ibn-nafi | Taqrib al-Tahdhib entry ٣٠٣٥ (Majmuat scan p.291) + kunya section p.32 |
| person/zayd-ibn-abd-allah-ibn-umar | Taqrib al-Tahdhib entry ٢١٤٣ (Majmuat scan p.212) |
| person/yahya-ibn-urwa | Taqrib al-Tahdhib entry ٧٦٠٨ (Majmuat scan p.665) |
| person/ubayd-allah-ibn-abd-allah-ibn-umar | Taqrib al-Tahdhib entry ٤٣١٠ (Majmuat scan p.406) |
| person/yazid-ibn-haram | al-Isaba entry ٩٣٢٨, p.1586 |
| person/yazid-ibn-amir | al-Isaba entry ٩٣٧٧, pp.1593–1594 |
| person/yazid-ibn-qays-ibn-al-khatim | al-Isaba entry ٩٤٠٢, pp.1596–1597 |
| person/yazid-ibn-al-mundhir | al-Isaba entry ٩٤٣٢, pp.1600–1601 |
| person/yazid-ibn-al-harith | al-Isaba entry ٩٣٢٣, p.1586 |
| person/yaqub-al-dawraqi | Taqrib al-Tahdhib entry ٧٨١٢ (Majmuat scan p.680) |

### Flags
- `person/yazid-ibn-haram`: Isaba text is set in two interleaved columns; Ibn Hibban's «استشهد ببدر…» sentence sits inside entry ٩٣٢٨ (the neighbouring entry ٩٣٢٩ died 103 AH, so the Badr report cannot be his).
- `person/yazid-ibn-al-harith`: draft card claimed killed at Badr; the Isaba entry (ابن فسحم، بدري، مؤاخاة مع ذي الشمالين) does not state his death — prose follows the page, the claim is flagged in the research notes.
- `person/yaqub-al-dawraqi`: Taqrib scan reads «مات سنة اثنتين وخمسين»; completed to ٢٥٢هـ by context and his stated age 86 — matches the record's derived dates (d. 866).
- `person/talha-ibn-nafi`: identity fixed as أبو سفيان الواسطي الإسكاف (entry ٣٠٣٥ + kunya section), not طلحة بن نافع الجعفي.

### Deferred this batch
- `person/uthman-ibn-urwa`, `person/uthman-ibn-qaid-al-najdi`, `person/ubaydallah-ibn-ahmad-sahib-al-ard`, `person/ubaydallah-ibn-abdallah-ibn-tahir`, `person/sulayman-ibn-abdallah-ibn-tahir` — no readable own entry in the extracted Taqrib/Thiqat/Isaba scans (index or passing mentions only).
- `person/zurara-ibn-ayun`, `person/yunus-ibn-abd-al-rahman`, `person/yahya-ibn-yaman` — still deferred; no clean own entry in the scans on hand.
- `person/yaqub-al-jarkhi`, `person/yusuf-ibn-nafis`, `person/waki-al-qadi`, `person/ubayd-ibn-al-abras` — Sufi/poet/judge records outside this lane's extracted rijal books; deferred pending al-A'lam or equivalent scan coverage.

## Batch 8 — audit of the Isaba-candidate list (agent pb2-rijal)

The fifteen records shortlisted for Batch 8 (`saad-ibn-abi-waqqas`, `sad-ibn-muadh`, `sad-ibn-ubada`, `said-ibn-al-musayyab`, `salama-ibn-al-akwa`, `safwan-ibn-umayya`, `salim-mawla-abi-hudhayfa`, `sawda-bint-zama`, `thabit-ibn-qays`, `ubada-ibn-al-samit`, `ubayy-ibn-kab`, `uthman-ibn-mazun`, `uqba-ibn-amir-al-juhani`, `uyayna-ibn-hisn`, `usayd-ibn-hudayr`) turned out on inspection to already have committed ar+en+ur prose from earlier `isaba-batch-*` sessions (e.g. commit 136c4a496) — they were never missing-prose records. Their draft prose was left untouched.

What this batch did do: every candidate's own entry was located and verified on the page (Isaba ٢٧٧, ٤٧ kunya, ٩١٤, ٣١١٢, ٣٢٣٦, ٣٢٥٩, ٣٢٧٢, ٣٥٢٣, ٤١٢٩, ٤٥٧٢, ٥٩٣٢, ٦١٤٨, ٦٩٣٩, ١٠٧٦٦ kunya, ١١٤١١; Taqrib ٢٣٩٦), the used source (`source/ibn-hajar-isaba`, or `source/taqrib-al-tahdhib` for Sa'id ibn al-Musayyab) was added to each YAML where missing, and `completeness` was raised to 3 to match the already-present prose.

Batch 8 as a missing-prose batch is void; the next batch needs a fresh missing-prose selection from the ranked queue.

### Batch 9 (23 Oct 2026, 8 records, ar+en+ur) — general lane (Devin)

| record | source & pages |
|---|---|
| event/tabaristan-campaign-30 | Ibn al-Athir, al-Kamil (scan 02-163053) pp.480–481 — Sa'id b. al-As's year-30 campaign, Tamisa, treaty of Jurjan |
| event/masjid-nabawi-expansion-29 | al-Kamil p.475 — 'Uthman's enlargement, Rabi' I 29 |
| event/conquest-of-takrit | al-Kamil pp.348–349 — year 16, Ibn al-Mu'tim's forty-day siege, Taghlib/Iyad/Namir crossing |
| event/church-qatiat-al-daqiq-burned-392 | Ibn al-Jawzi, al-Muntazam (scan AAlexandrina-224011) p.219 — year 392, mob burning of the bi'a |
| event/tigris-dredging-400 | al-Muntazam p.245 — Rabi' I 400 low water, first recorded dredging |
| event/tigris-flood-401 | al-Muntazam pp.251–252 — 21-cubit rise Rajab–Ramadan 401 |
| event/dar-sultana-fire-515 | Ibn al-'Imad, Shadharat al-Dhahab (scan AAlexandrina-223861) p.527 — one-line notice kept brief |
| group/rifaiyya | Shadharat pp.739–740 — Ahmad al-Rifa'i notice, year 578; marvel reports kept attributed to Ibn Qadi Shuhba |

### Deferred this batch
- `event/conquest-of-fasa` — no own conquest narrative found in extracted Kamil/Futuh texts (Futuh p.563 has only a passing fort mention at Fasa).
- Remaining queue head is the thin tail (1–2 links): Ottoman mosque buildings without harvested narrative sources — deferred pending Ottoman source coverage (Salabi dawlat-uthmaniyya check next pass).

### Methodological notes
- Muntazam/Shadharat cites follow the printed page numbers used by the existing record summaries (verified against the scanned pages listed in each file's research notes).
- `person/` untouched.

## Batch 9 — audit of the queue head (agent pb2-rijal)

The twelve queue-head records (`nafi-mawla-ibn-umar` 560 links, `hisham-ibn-urwa` 489, `zayd-ibn-aslam` 340, `muhammad-ibn-al-munkadir` 32, `zayd-ibn-khalid-al-juhani` 32, `abu-bakr-ibn-abd-al-rahman-ibn-al-harith` 29, `amr-ibn-shuayb` 28, `abu-umama-ibn-sahl-ibn-hunayf` 24, `sahl-ibn-hunayf` 14, `abu-qatada-al-ansari` 12, `abd-al-rahman-ibn-abi-layla` 12, `abu-waqid-al-laythi` 12) all already had committed ar+en+ur prose (`prose-backfill` batches 002/004, `ebd1f80d7` narrators batch, sallabi-ali-vol1 harvests). Prose untouched.

Each record's own entry was located on the page by full nasab, the verified rijal source was added to the YAML where missing, and `completeness` raised to 3:

| record | own entry verified |
|---|---|
| person/nafi-mawla-ibn-umar | Taqrib ٧٠٨٦ (نافع مولى ابن عمر), scan p.625 |
| person/hisham-ibn-urwa | Taqrib ٧٣٠٢ (هشام بن عروة بن الزبير بن العوام الأسدي), p.640 |
| person/zayd-ibn-aslam | Taqrib ٢١١٧ (زيد بن أسلم العدوي مولى عمر), p.210; Tahdhib al-Tahdhib ٢١٩٢ p.373 |
| person/muhammad-ibn-al-munkadir | Taqrib ٦٣٢٧ (محمد بن المنكدر بن عبد الله بن الهدير), p.568 |
| person/zayd-ibn-khalid-al-juhani | Taqrib ٢١٣٣ (زيد بن خالد الجهني المدني صحابي), p.212; Tahdhib al-Tahdhib ٢٢٠٨ p.376 |
| person/abu-bakr-ibn-abd-al-rahman-ibn-al-harith | Taqrib ٧٩٧٦ (أبو بكر بن عبد الرحمن بن الحارث بن هشام المخزومي), p.693 |
| person/amr-ibn-shuayb | Tahdhib al-Tahdhib ٥٢٠٧ (عمرو بن شعيب بن محمد بن عبد الله بن عمرو بن العاص), p.798 |
| person/abu-umama-ibn-sahl-ibn-hunayf | Taqrib ٤٠٢ (أسعد بن سهل بن حنيف أبو أمامة) + ٨٧٩٠, pp.76/778 |
| person/sahl-ibn-hunayf | Taqrib ٢٦٥٦ (سهل بن حنيف بن واهب الأنصاري الأوسي بدري), p.259 |
| person/abu-qatada-al-ansari | Taqrib ٨٣١١ (أبو قتادة الأنصاري = الحارث بن ربعي السلمي), p.720 |
| person/abd-al-rahman-ibn-abi-layla | Taqrib ٣٩٩٣ (عبد الرحمن بن أبي ليلى الأنصاري المدني ثم الكوفي), p.375 |
| person/abu-waqid-al-laythi | Taqrib ٨٤٣٣ kunya (أبو واقد الليثي صحابي), p.729 |

### Notes
- `amr-ibn-shuayb`'s Taqrib own-entry head is lost to the scan's column interleaving in this copy; verified instead in Tahdhib al-Tahdhib (٥٢٠٧) with the full five-generation nasab.
- `muhammad-ibn-yahya-ibn-habban` and `malik-ibn-abi-amir-al-asbahi` were skipped per the batch plan (already done in batch 5).

## Batch 10 — audit + one prose record (agent pb2-rijal)

Eleven of the next queue segment already had committed prose (audit fixes only); `amir-ibn-sad-ibn-abi-waqqas` had none and got new ar+en+ur prose from Taqrib ٣٠٨٩ (p.297).

| record | disposition | own entry verified |
|---|---|---|
| person/amir-ibn-sad-ibn-abi-waqqas | NEW prose ar+en+ur; +taqrib, completeness 3 | Taqrib ٣٠٨٩ (عامر بن سعد بن أبي وقاص الزهري), p.297 |
| person/amir-ibn-rabia | audit: +taqrib, completeness 3 | Taqrib ٣٠٨٨ (عامر بن ربيعة بن كعب بن مالك العنزي), p.297 |
| person/abdallah-ibn-abdallah-ibn-umar | audit: +taqrib, completeness 3 | Taqrib ٣٤١٧ (عبد الله بن عبد الله بن عمر بن الخطاب), p.325 |
| person/abd-al-rahman-ibn-kab-ibn-malik | audit: +taqrib, completeness 3 | Taqrib ٣٩٩١ (عبد الرحمن بن كعب بن مالك الأنصاري), p.375 |
| person/suhayl-ibn-bayda | audit: +ibn-hajar-isaba, completeness 3 | Isaba ٣٧٤٤ (سهيل بن بيضاء), p.629 |
| person/makhul-al-dimashqi | audit: +taqrib, completeness 3 | Taqrib ٦٨٧٥ (مكحول الشامي أبو عبد الله), p.608 |
| person/umm-kulthum-bint-abi-bakr | audit: +ibn-hajar-isaba, completeness 3 | Isaba ١٢٢٦٥ (أم كلثوم بنت أبي بكر التيمية), p.2030 |
| person/abu-burda-ibn-niyar | audit: +taqrib, completeness 3 | Taqrib ٧٩٥٣ (أبو بردة بن نيار البلوي حليف الأنصار), p.691 |
| person/musab-ibn-sad-ibn-abi-waqqas | audit: +taqrib, completeness 3 | Taqrib ٦٦٨٨ (مصعب بن سعد بن أبي وقاص الزهري), p.594 |
| person/asim-ibn-umar | audit: +taqrib, completeness 3 | Taqrib ٣٠٦٩ (عاصم بن عمر بن الخطاب), p.295 |
| person/silkan-ibn-salama | audit: +ibn-hajar-isaba, completeness 3 | Isaba ٣٤٧٢ (سلكان بن سلامة) p.593 + kunya ١٠٦٧٥ (أبو نائلة) p.1778 |
| person/kabsha-bint-kab-ibn-malik | audit: +ibn-hajar-isaba, completeness 3 | Isaba ١١٧١٤ (كبشة بنت كعب بن مالك الأنصارية), p.1950 |

### Deferred this batch
- `person/jalal-al-dawla`, `person/abu-kalijar` — Buyid dynasts with committed prose and real sources already (shadharat/muntazam); own-entry verification belongs to the dynastic-history lane rather than the rijal books; completeness left to that lane.
- `person/mabad-ibn-kab-ibn-malik`, `person/muhammad-ibn-abd-al-rahman-ibn-nawfal` — already completeness 3 with verified sources; skipped.

## Batch 11 — thin-stub expansion cohort, 13 records (rijal lane, agent pb2-rijal)

Queue recomputed over `data/person/*.yaml` lacking or thin (`<900 B`) `content/ar` prose, ranked by distinct inbound-linking files. The truly missing heads are non-rijal (`muhammad-mutawalli-al-shaarawi`, Ottoman/Persian/modern figures) — deferred; the rijal tier below it was all thin one-section stubs. Each stub's own entry was located by full nasab, then the stub was expanded (existing cited paragraphs kept) and the used source id added with completeness 3.

| record | own entry verified |
|---|---|
| person/ata-ibn-yasar | Taqrib ٤٦٠٥ (عطاء بن يسار الهلالي أبو محمد المدني مولى ميمونة), Majmuat scan p.431 |
| person/abu-salama-ibn-abd-al-rahman | Taqrib ٨١٤٢ (أبو سلمة بن عبد الرحمن بن عوف الزهري), p.707 |
| person/al-tirmidhi-muhammad-ibn-isa | Taqrib ٦٢٠٦ (محمد بن عيسى بن سورة بن موسى بن الضحاك السلمي الترمذي), p.558 |
| person/said-ibn-jubayr | Taqrib ٢٢٧٨ (سعيد بن جبير الأسدي مولاهم الكوفي), p.223 |
| person/sahl-ibn-sad-al-saidi | Isaba ٣٧٠٩ (سهل بن سعد بن مالك بن خالد بن ثعلبة … الساعدي), al-Asriyya pp.624-625 |
| person/asad-ibn-zurara | Isaba ١٦٣ (أسد بن زرارة؛ تصحيح أسعد), p.46 |
| person/muawiya-ibn-khudayj | Isaba ٨٣٥٥ (معاوية بن حُديج بن جفنة من تجيب السكوني), p.1429 |
| person/iyyad-ibn-ghanm | Isaba ٦٩٢٨ (عياض بن غنم الأشعري؛ الفهري/الأشعري لبس داخل الترجمة), p.1166 + p.1000 (Mosul with Utba) |
| person/utba-ibn-farqad | Isaba ٥٨٧١ (عتبة بن فرقد بن يربوع … السلمي), pp.1000-1001 |
| person/abd-al-rahman-ibn-abi-bakr | Isaba ٤٦٥٤ (عبد الرحمن بن أبي بكر الصديق بن أبي قحافة), p.783 |
| person/ubaydallah-ibn-umar | Isaba ٥٨٠٤ (عبيد الله بن عمر بن الخطاب القرشي العدوي), pp.988-989 |
| person/abdallah-ibn-khazim-al-sulami | Isaba ٥٠٩٠ (عبد الله بن خازم ابن أسماء بن الصلت … أبو صالح الأمير المشهور), p.867 |
| person/al-rabi-ibn-ziyad-al-harithi | Isaba ٢٦١٥-٢٦١٦ (الربيع بن زياد … العبسي الحارثي، فتح سجستان 29هـ), p.455 |

### Notes
- `iyyad-ibn-ghanm`: the Isaba entry is titled الأشعري while the record and history works keep الفهري; the entry's own text records Ibn Manda's "الفهري أو الأشعري" — prose cites the entry and flags the نسبة reading instead of resolving it.
- `iyyad` conquest of Mosul (18 AH, with Utba) is cited from Utba's own Isaba entry ٥٨٧١, p.1000, not from a passing mention in Iyad's entry.
- `ubaydallah-ibn-umar`'s killing stays flagged (Mas'udi's three reports); `abdallah-ibn-khazim` and `al-rabi-ibn-ziyad` Companionship recorded as "not established" per Ibn Hajar.
- `qays-ibn-al-haytham`, `ubayd-allah-ibn-ziyad`, `musab-ibn-al-zubayr`, `abd-al-rahman-ibn-habib-al-fihri`, `ayyub-al-sakhtiyani` — queue neighbours without a readable own entry in the extracted Taqrib/Isaba scans (Ayyub's Tahdhib entry sits in vol. 1, not extracted; Mus'ab/Ubaydallah are non-Companion figures needing Tabari/Kamil passes) — deferred.

### Batch 11 (24 Oct 2026, 13 records: 8 written + 5 audit) — general lane (Devin)

(Renumbered from "Batch 10" after the sibling rijal lane's Batch 10 landed first.)

Single source this batch: John Freely, *A History of Ottoman Architecture* (WIT Press, 2011), harvest scan `extra-architecture/A_History_of_Ottoman_Architecture_J._Freely_WIT_2011_BBS` (page markers read in OCR). Salabi's *dawlat-uthmaniyya* was checked first: only passing references to these buildings, no own sections — used for context only.

**New prose (ar+en+ur), completeness 3; `source/freely-ottoman-architecture-2011` added to YAML (Goodwin kept as record source):**

| record | Freely pages |
|---|---|
| building/yesil-mosque-bursa | pp.60–63 — commissioned 1412, Mehmet I, architect Hacı Ivaz Pasha, cuerda seca tiles |
| building/uc-serefeli-mosque | pp.83–85 — Murat II 1437–47, 24.1 m dome, 67.6 m minaret |
| building/eski-mosque-edirne | pp.80–82 — begun 1403 Çelebi Süleyman, completed Mehmet I, nine-dome Ulu Cami type |
| building/yavuz-selim-mosque | pp.205–207 — completed 1522; Freely rejects Sinan attribution, architect unknown |
| building/mihrimah-sultan-mosque-uskudar | pp.246–248 — Iskele Camii, completed early 1548, three semidomes |
| building/sinan-pasha-mosque-besiktas | pp.296–297 — finished A.H. 963 (1555–6), copy of Üç Şerefeli plan |
| building/kilic-ali-pasha-mosque | pp.308–311 — 1580–1, Tophane on filled land, miniature Haghia Sophia replica |
| building/selimiye-mosque | pp.88–91 — audit-fix: record sourced only Wikidata; prose rewritten on Freely, source added, completeness 1→3 |

**Audit (existing ar+en+ur sibling prose with Freely citations; completeness 2→3, no prose edits):**
`building/sehzade-mosque`, `building/sokollu-mehmed-pasha-mosque`, `building/nuruosmaniye-mosque`, `building/laleli-mosque-istanbul`, `building/mihrimah-edirnekapi-mosque`. Note: sibling citations lack page numbers; left as-is.

### Deferred this batch
- `building/kalenderhane-mosque`, `building/eski-imaret-mosque`, `building/fenari-isa-mosque`, `building/gul-mosque-istanbul`, `building/zal-mahmud-pasha-mosque`, `building/hirami-ahmed-pasha-mosque`, `building/koca-mustafa-pasha-mosque` — no dedicated section found in the Freely OCR; Goodwin 1971 pages unread, so not citable yet.
- `building/muradiye-mosque-baghdad` — no coverage found in Hasan Ibrahim's Tarikh al-Islam extracts.
- `data/source/freely-ottoman-architecture-2011` itself remains completeness 1 (source record metadata not yet enriched).

### Methodological notes
- Each new record carries a curatorial note naming the read source + page range.
- The "build it on the sea" anecdote (Kılıç Ali Pasha) and Evliya Çelebi's tomb quote are relayed as anecdotes exactly as the source presents them.
- `person/` untouched.

### Batch 12 (24 Oct 2026, 15 records: 9 written + 6 audit) — general lane (Devin)

Same source as Batch 11: Freely, *A History of Ottoman Architecture* (2011), continuing through the Goodwin-tagged stub list — a re-scan found dedicated sections that the first pass missed (notably Zal Mahmut Pasha).

**New prose (ar+en+ur), completeness 3, `source/freely-ottoman-architecture-2011` added:**

| record | Freely pages |
|---|---|
| building/hudavendigar-mosque-bursa | pp.54–56 — Murat I 1365–85, two-storey mosque+medrese, unique plan |
| building/emir-sultan-mosque-bursa | p.64 — Hundi Hatun foundation, rebuilt Selim III era |
| building/haci-ozbek-mosque-iznik | p.71 — oldest surviving Ottoman mosque (inscription 1333), never had a minaret |
| building/yesil-turbe | pp.63–64 — Mehmet I's türbe, Murat II, Hacı Ivaz Pasha |
| building/mahmud-pasa-mosque-istanbul | pp.138–140 — 1462, earliest veziral mosque, Bursa style, founder's türbe |
| building/firuz-aga-mosque | pp.214–215 — 1491, treasurer of Beyazit II, simplest preclassical type |
| building/atik-ali-pasha-mosque | pp.215–218 — 1496, Hadım Ali Pasha, Pierre Gilles description of medrese |
| building/hadim-ibrahim-pasa-mosque | pp.295–296 — Sinan 1551, Silivri Gate, baroque minaret |
| building/zal-mahmud-pasha-mosque | pp.305–307 — Sinan ~1575–80, Eyüp, two medreses (un-deferred: dedicated section found) |

**Audit (existing ar+en+ur sibling prose with Freely citations; completeness 2→3, no prose edits):**
`building/bayezid-ii-mosque`, `building/blue-mosque`, `building/bursa-ulu-cami`, `building/fatih-mosque-istanbul` (also cites salabi), `building/kucuk-ayasofya`, `building/rustem-pasha-mosque`.

### Deferred this batch
- `building/vasat-atik-ali-pasha-mosque` — only a passing mention in Freely (no own section).
- `building/kalenderhane-mosque`, `building/eski-imaret-mosque`, `building/fenari-isa-mosque`, `building/gul-mosque-istanbul`, `building/hirami-ahmed-pasha-mosque`, `building/koca-mustafa-pasha-mosque` — still no dedicated Freely section found.
- `building/muradiye-mosque-baghdad` — no coverage (the Freely Muradiye sections are Edirne p.82 and Bursa p.64, different buildings).
- Freely covers further buildings (Muradiye Bursa/Edirne, Zincirli Kuyu, Ivaz Efendi, etc.) that have no records yet — creating new records is out of this lane's missing-prose scope.

### Methodological notes
- `person/` untouched.

## Batch 13 — thin-stub expansion cohort, 12 records (rijal lane, agent pb2-rijal)

**Reconciliation note:** the twelve queue-head names audited in Batch 9 (`nafi-mawla-ibn-umar`, `hisham-ibn-urwa`, `zayd-ibn-aslam`, `muhammad-ibn-al-munkadir`, `zayd-ibn-khalid-al-juhani`, `abu-bakr-ibn-abd-al-rahman-ibn-al-harith`, `amr-ibn-shuayb`, `abu-umama-ibn-sahl-ibn-hunayf`, `sahl-ibn-hunayf`, `abu-qatada-al-ansari`, `abd-al-rahman-ibn-abi-layla`, `abu-waqid-al-laythi`) were re-checked: all already carry committed ar+en+ur prose, verified rijal sources and completeness 3 — no work pending; the earlier "planned batch" framing was superseded by the Batch 9 audit itself.

Queue recomputed over `data/person/*.yaml` thin (`<900 B`) `content/ar` stubs ranked by inbound links; the missing-prose head is non-rijal (`muhammad-mutawalli-al-shaarawi`, `yunus-emre`, Ottoman/Persian figures) — deferred. Each chosen stub's own entry was located by full nasab, then the stub was expanded (existing paragraphs kept) and the used source added with completeness 3.

| record | own entry verified |
|---|---|
| person/abu-salih-al-samman | Taqrib ١٨٤١ (ذكوان أبو صالح السمان الزيات المدني), Majmuat scan p.190 |
| person/ikrima-mawla-ibn-abbas | Taqrib ٤٦٧٣ (عكرمة أبو عبد الله مولى ابن عباس), p.437 |
| person/habib-ibn-maslama | audit: Isaba ١٦٨٩ already cited in prose; +ibn-hajar-isaba, completeness 3 |
| person/umayr-ibn-sad | Isaba ٦٧٧٨ (عمير بن سعد بن عبيد بن النعمان … الأنصاري الأوسي، عامل عمر على حمص), p.1145 |
| person/al-ala-ibn-al-hadrami | Isaba ٦٢٠٤ (العلاء بن الحضرمي = عبد الله بن عماد بن أكبر…), p.1051 |
| person/hormuzan | Isaba ٩٠٢٨ (الهرمزان الفارسي), p.1542 |
| person/sahla-bint-suhayl | Isaba ١١٣٩٩ (سهلة بنت سهيل بن عمرو القرشية العامرية), p.1902 |
| person/mujashi-ibn-masud-al-sulami | Isaba ٧٨١١ (مجاشع بن مسعود بن ثعلبة … السلمي), p.1335 |
| person/abd-al-rahman-ibn-usayla-al-sunabihi | Isaba ٤٧٩٢ (عبد الرحمن بن عسيلة بن عسال المرادي الصنابحي), p.811 |
| person/khuzayma-ibn-thabit | Isaba ٢٣١٠ (خزيمة بن ثابت بن الفاكه … الأوسي ثم الخطمي), p.392 |
| person/salit-ibn-amr | Isaba ٣٥٦١ (سليط بن عمرو القرشي العامري ابن أخ سهيل بن عمرو), p.604 |
| person/rabia-ibn-umayya-ibn-khalaf | Isaba ٢٦٣٤ (ربيعة بن أمية بن خلف بن وهب بن حذافة بن جمح الجمحي), p.458 |

### Notes
- `ikrima-mawla-ibn-abbas` death year left as a recorded disagreement: Muruj 105, Taqrib 104/لاحقاً, Kashif 106-107.
- `rabia-ibn-umayya-ibn-khalaf`: the wine/exile-to-Caesar report is carried inside his own Isaba entry with its isnad to al-Zuhri — recorded attributed, not endorsed.
- `umayr-ibn-sad`: Ibn Hajar's correction of Abd al-Ghani's conflation with Umayr ibn al-Hammam is noted rather than resolved silently.
- `abd-al-rahman-ibn-usayla-al-sunabihi`: Isaba makes him a Companion-era envoy who prayed behind Abu Bakr and died 70-80 AH; the Shirazi "faqih of Egypt" framing is kept alongside.

### Deferred this batch
- `sawda-bint-zama`, `thuwayba` — no numbered own entry in the extracted Isaba scan (women's volume coverage incomplete; Sawda appears only inside relatives' entries).
- `busr-ibn-said`, `abdallah-ibn-abi-rabia`, `sallam-ibn-ziyad`, `musa-ibn-abdallah-ibn-khazim`, `abd-al-rahman-ibn-habib-al-fihri`, `ayyub-al-sakhtiyani`, `qays-ibn-al-haytham`, `ubayd-allah-ibn-ziyad`, `musab-ibn-al-zubayr` — no readable own entry in the extracted Taqrib/Isaba/Tahdhib/Thiqat scans (Busr only in the Thiqat name-index; abdallah-ibn-abi-rabia's own entry absent, the envoy's name only inside relatives' entries).
- `farazdaq`, `yusuf-ibn-tashfin`, `musa`, `ardashir-i-ibn-babak`, `baha-al-dawla`, `jahm-ibn-zahr`, `abu-al-bakhtari-ibn-hisham`, `shurahbil-ibn-al-harith`, `abd-al-aziz-ibn-marwan`, `amr-ibn-kulthum`, `shajar-al-durr`, `ibn-battuta-muhammad`, `ibn-qayyim-al-jawziyya`, `fakhr-al-din-al-razi`, `ibn-ishaq`, `ibn-al-nadim`, `abu-ishaq-ibrahim-al-marwazi`, `hormuzan`-adjacent non-rijal heads — poets, prophets, dynasts and scholars whose biography belongs to non-rijal sources.

### Batch 13 (24 Oct 2026, 15 records: 15 written) — general lane (Devin)

Founder-authorized record creation: 14 new `building/` stubs (minimal yaml, completeness 3 with prose) plus the existing `semsi-pasha-mosque` stub — all sourced to Freely, *A History of Ottoman Architecture* (2011). Side task: `data/source/freely-ottoman-architecture-2011.yaml` enriched (completeness 1→3, reliability note).

**Records (new prose ar+en+ur, completeness 3):**

| record | disposition | Freely pages |
|---|---|---|
| building/suleymaniye-mosque | NEW record + prose | pp.260–268 — külliye 1550–57, seven medreses, Şarhoş glass, earliest Iznik |
| building/atik-valide-mosque | NEW record + prose | pp.288–292 — Nurbanu külliye A.H. 978–991, last imperial Sinan complex |
| building/kara-ahmet-pasha-mosque | NEW record + prose | pp.297–298 — begun 1558, completed early 1560s |
| building/piyale-pasha-mosque | NEW record + prose | pp.326–329 — 1573, unique multi-domed classical mosque |
| building/mesih-pasha-mosque | NEW record + prose | pp.332–333 — 1585, Kuran's Davut Ağa attribution |
| building/nisanci-mehmet-pasha-mosque | NEW record + prose | pp.335–337 — 1584–88, not in Sinan's Tezkere |
| building/yeni-cami | NEW record + prose | pp.349–356 — two valide-sultan phases 1597→1665, Spice Bazaar, türbe |
| building/selimiye-mosque-uskudar | NEW record + prose | pp.408–409 — Selim III 1803–4, last pure baroque |
| building/nusretiye-mosque | NEW record + prose | pp.413–414 — Kirkor Balyan 1822–26, Auspicious Event dedication |
| building/muradiye-mosque-edirne | NEW record + prose | pp.82–83 — Murat II 1435 zaviye→mosque, early Iznik mihrab |
| building/muradiye-mosque-bursa | NEW record + prose | pp.64–65 — Murat II 1424–6, open-air türbe |
| building/rum-mehmet-pasha-mosque | NEW record + prose | pp.143–144 — 1471, most Byzantine of early mosques |
| building/murat-pasha-mosque-istanbul | NEW record + prose | pp.142–143 — 1469, Hass Murat Pasha, Palaeologue convert |
| building/davut-pasha-mosque | NEW record + prose | pp.210–211 — "A.H. 480 (1485)" inscription as printed |
| building/semsi-pasha-mosque | existing stub + prose | pp.312–313 — Sinan 988 A.H., adjoining türbe |

### Deferred this batch
- The remaining Goodwin-tagged stubs without dedicated Freely sections (kalenderhane, eski-imaret, fenari-isa, gul-mosque, hirami-ahmed-pasha, koca-mustafa-pasha, vasat-atik-ali-pasha, muradiye-baghdad) — still deferred.
- Freely covers many further buildings (Davut Pasha hamams, hans, külliye components, Edirne minor mosques, baroque buildings) — next batch can continue record creation if desired.
- `davut-pasha-mosque`: source prints "A.H. 480 (1485)" — kept verbatim, flagged as probable OCR/inscription misprint in curatorial notes.

### Methodological notes
- New yamls copy the existing stub shape (wings/regions/periods/themes per mosque class); no invented external_ids.
- `person/` untouched.

## Batch 14 — thin-stub expansion cohort, 11 records (rijal lane, agent pb2-rijal)

Same method as Batch 13: thin (`<900 B`) `content/ar` stubs ranked by inbound links; each stub's own entry located by full nasab, existing paragraphs kept, used source added, completeness 3.

| record | own entry verified |
|---|---|
| person/aqil-ibn-abi-talib | Taqrib ٤٦٦١ (عقيل بن أبي طالب الهاشمي أخو علي وجعفر), Majmuat scan p.435 |
| person/maqil-ibn-yasar | Isaba ٨٤٦٨ (معقل بن يسار … المزني، حفر نهر معقل بالبصرة), p.1447 |
| person/abd-al-rahman-ibn-abi-bakra | Isaba ٤٦٥٥ (عبد الرحمن بن أبي بكرة الثقفي، تابعي أول مولود بالبصرة), p.783 |
| person/amir-ibn-abi-waqqas | Isaba ٤٥٠٩ (عامر بن أبي وقاص الزهري = عامر بن مالك), p.763 |
| person/uhayha-ibn-al-julah | Isaba ٨٨ (أحيحة ابن الجلاح؛ قاتل عمه ووهم نسبته للصحابة), p.33 |
| person/umm-harmala-bint-abd-al-aswad | Isaba ١٢٠١٥ (أم حرملة بنت عبد الأسود … الخزاعية), p.1990 |
| person/suwayd-ibn-qutba | Isaba ٣٨١٢ (سويد بن قطبة الوائلي، ذكر في الفتوح), p.639 |
| person/firas-ibn-al-nadr | Isaba ٧٠١٥ (فراس بن النضر بن الحارث … العبدري أبو الحارث), p.1189 |
| person/ziyad-ibn-labid-al-bayadi | Isaba ٢٩٢٢ (زياد بن لبيد بن ثعلبة … الأنصاري البياضي), p.506 |
| person/utba-ibn-masoud | Isaba ٥٨٧٣ (عتبة بن مسعود الهذلي أخو عبد الله لأبويه), p.1000 |
| person/kharija-ibn-hudhafa-al-adawi | Isaba ٢١٤٢ (خارجة بن حذافة بن غانم … العدوي، شرطة عمرو ومقتله), p.361 |

### Notes
- `abd-al-rahman-ibn-abi-bakra`: Isaba corrects the Baladhuri-driven impression of companionship — he is a Successor born in 14 AH; prose carries Ibn Hajar's reservation on the "لا تطلب الإمارة" report rather than asserting his hearing it.
- `uhayha-ibn-al-julah`: the record describes his Jahiliyya role; Isaba explicitly doubts counting him a Companion — flagged, not asserted.
- `umm-harmala`: Isaba gives a Khuza'i nasab while Ibn Ishaq lists her among Banu Abd al-Dar — both kept and flagged.
- `aqil`: Taqrib gives 60 AH for his death "وقيل بعدها"; the Siyar record's "in Mu'awiya's caliphate" is compatible and kept.
- `kharija`: the night-of-Ali's-killing report is told "قيل" in the entry — carried as reported speech.

### Deferred this batch
- `suhayb-ibn-sinan` — the extracted Isaba scan reaches him only via the kunya cross-list (١٠٧٧٠), his own entry is outside the extracted pages.
- `said-ibn-uthman` (ibn Affan, Umayyad governor) — Isaba ٣٣٧٦ is a different, Ansari namesake; no own entry found.
- `umayr-ibn-wahb` (al-Jumahi), `umayr-ibn-riab`, `khazim-ibn-khuzayma`, `shurahbil-ibn-hasana` (only his sons' entries ٢٦٥٧-٢٦٥٨), `ubaydallah-ibn-abi-bakra`, `muhayyisa-ibn-masud`, `umama-al-muzayriyya`, `salih-ibn-kaysan` (only an isnad hit), `rawh-ibn-hatim`, `mukhallad-ibn-yazid`, `bujayr-ibn-waraqa`, `habbar-ibn-sufyan`, `waki-ibn-hassan`, `muhammad-ibn-kab-al-qurazi` (the Isaba hits are Ansari namesakes), `abu-qays-ibn-al-harith`, `ata-al-khurasani`, `amr-ibn-muslim`, `zamaa-ibn-al-aswad`, `umama-al-muzayriyya` — no readable own entry in the extracted scans.
