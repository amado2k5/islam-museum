# `prose-backfill-2` progress

Lane doc: `docs/agents/lanes/prose-backfill-2.md`. Programme plan: `docs/delegation/knowledge-completeness-plan.md` (Phase 1). Opened 23 Oct 2026 (Devin, SWE-2 Medium), after the plan PR (#603) merged.

**Queue.** Missing-prose tier ranked by inbound links, recomputed 23 Oct 2026 on `origin/main` (12,391 missing). Split boundary: this lane works missing prose top-down and stops before the zero-link tail; `prose-backfill` keeps the thin tier. Head of queue at open: `person/muhammad-mutawalli-al-shaarawi` (104 links), `person/muhammad-ibn-yahya-ibn-habban` (44), `person/malik-ibn-abi-amir-al-asbahi` (28), `person/yahya` (16), `place/najd` (8), `group/mongols` (7).

**Lane total: 11.**

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

**Next step (exact):** continue the queue below the logged skips — next head is the hadith-rijal cohort (`person/abu-salih-al-samman`, `person/abd-al-rahman-ibn-abd-al-qari`, `person/abu-salama-ibn-abd-al-rahman-ibn-awf`, …) sourced from Isaba/Tajrid on the drive, and the fiqh-term cohort (`concept/ushr`, `concept/qisas`, `concept/ila`, …) which needs fiqh sources, likely Phase 2 material — flag for the owner whether `prose-backfill-2` should write concept/practice prose now or defer to `practice-fiqh`.
