# modern-figures — progress

Lane: `docs/agents/lanes/modern-figures.md` · Branch: `content/modern-figures` · Opened 24 October 2026 (founder's instruction; harvest handoff from the founder's Mac, checked by Muse the same day).

## Compliance (founder's rules in force)

- Publication standard: records publish on citations + defined sources + provenance; no review step; one source is enough for a fact.
- Wikipedia broad rule (founder-approved; applied to AGENTS.md and docs/sources-policy.md): Wikipedia/Wikidata are fact sources under the charter conditions — a fact is used only where the article cites a source for it; the revision is recorded in the source entity. Wikipedia validates entity facts, never the text of a work.
- Faith discipline per the model entry (person/amr-khaled): school recorded only on two independent sources; otherwise `unknown` with the note.
- Founder's standing instruction (24 Oct 2026): full test suite and CI deferred to the founder's Mac. Per batch: cite-check; validate at checkpoints.

## Batches

- Batch 1 (scholars and preachers, 15): group C DONE 24 Oct 2026 — sayyid-qutb, abd-al-fattah-abu-ghudda, ismail-ibn-musa-menk (new) + al-albani-muhammad-nasir-al-din, hasyim-asyari (enriched 1 → 3, published). Faith outcomes: abu-ghudda `sunni-hanafi` (two sources); qutb and menk `unknown` with notes. Group A DONE — ali-gomaa, ahmed-el-tayeb, yusuf-al-qaradawi, muhammad-sayyid-tantawi (all `sunni / documented`). Group B DONE — ahmed-raza-khan-barelvi (`sunni-hanafi`), ahmed-kuftaro (`sunni`), said-nursi, ahmed-deedat, hamka (`unknown` with notes; for Nursi and Deedat a 429 rate-limit blocked re-verification of the EN infobox wikitext, so the two-source rule was applied conservatively — a browser infobox check could upgrade both). Al-Sha'rawi enriched under his existing slug `muhammad-mutawalli-al-shaarawi` (draft skeleton → published, completeness 3; faith `sunni-ashari` documented — AR infobox citing a peer-reviewed study + Wikidata P140). **Batch 1 COMPLETE: 15/15.** PRs #1522 (lane + group C), #1523 (group A), #1524 (group B) merged 24 Oct 2026. Batch 2 in flight (groups D–G).
- Batch 2 (public/political, 18 + 1 enrichment): group E DONE 24 Oct 2026 — ibn-e-insha, junaid-jamshed, deddy-corbuzier (new; all `faith: unknown` — no two sources name a school; Deddy's conversion documented via an added Indonesian-Wikipedia source entity, no AR article) + ahmad-dahlan enriched (1 → 3, published, book source kept). Group G DONE — necmettin-erbakan, muhsin-yazicioglu (no AR article; noted), devlet-bahceli, ali-erbas, emine-erdogan (all `faith: unknown` — Wikidata alone gives Sunni, the articles name no school). Group D DONE — anwar-sadat, farouk-of-egypt, pervez-musharraf, nawaz-sharif (`unknown`; the Barelvi line in his EN article is about the family, attributed — not forced), malala-yousafzai (`sunni / documented`, both articles + Wikidata). Group F in flight. NOTE (fleet fix 75fd2e1e0, 24 Oct): the person-schema faith enum has NO sunni-ashari/sunni-maturidi — creed goes in the note with value `sunni`; the fleet also merged a duplicate `ahmad-kaftaru` card into `person/ahmed-kuftaro` as an alias (8910a993c).
- Batch 3 (remaining figures, 16): queued.

## Skips

(none yet)

NEXT STEP: Batch 1 write, then cite-check + validate, commit, continue to Batch 2.
