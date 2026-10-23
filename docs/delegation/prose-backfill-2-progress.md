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
