# 67. Muslim Media-Makers Browser

The trilingual browser for «متصفح إعلاميو المسلمون من المؤذن للخطيب للكاتب للصحافي للإعلامي
للمؤثرون للثوار» — the people who carried the word, from the muezzin's call to the rebel's rising,
plus the state voices the founder added (spokesman, envoy, vizier, judge, caliph, sultan, king).

- Route: `/[lang]/i3lam/` (`site/src/pages/[lang]/i3lam/index.astro`), landing card and Explore
  entry through `explorePages` (`people` group).
- Reads: `site/src/lib/i3lam.ts`. The chain is `MEDIA_CHAIN` (muezzin, munadi, khatib,
  natiq-rasmi, diplomat, katib, sahafi, ilami, muaththir, muslih, thair); state offices are
  `STATE_JOBS`. Holders come from `occupations:` via `jobs.ts`; the feed comes from `mentions`
  edges plus the `i3lam-browser` tag, classified by corpus through `ansabCorpusOf`.
- Signature view: `site/src/components/sig/I3lamTransmission.astro` — a transmission line where
  each role is a station and its ring follows the holder count.
- Jobs created: munadi, natiq-rasmi, sahafi, ilami, muaththir, muslih, thair — trilingual prose.
- Requirements and production acceptance tests:
  `docs/engineering/59-i3lam-browser-requirements.md`.
