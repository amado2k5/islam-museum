# Phase 08: Manuscripts and libraries

Part of the coverage expansion programme. Master plan: [`README.md`](README.md). Progress: [`progress.md`](progress.md).

## Scope

Named codices (Sanaa palimpsest, Birmingham folios, the great Qur'an manuscripts), the collections that hold them (Süleymaniye, Chester Beatty, Escorial, BnF, Timbuktu's Mamma Haidara and Ahmed Baba libraries), copyists, illuminators and binders. Object pass for books; place and institution pass for libraries.

## Source corpora and access

- Institutional catalogues (Süleymaniye, Chester Beatty, Escorial, BnF, Timbuktu libraries): **not checked for access in this session.**
- Qur'an text is never typed: manuscript descriptions cite the codex, never reproduce its text.

## Size estimate and derivation

Unsized. Presence measure: codex 28 files, manuscript 153 (mostly mentions); Sulaymaniye 0 matches. Institutions: place entities to be counted. Pilot: one library, all its codices in the museum's scope, with a yield and overlap measure.

## Entry criteria

- Phase 1 for cited books.
- Founder decision 5 (catalogue access).

## Exit criteria (definition of done)

- Sample-based yield and overlap recorded.
- Qur'an text: never typed; references use `[[passage/...]]` only.
- Validate 0 errors; cite-check 0 fail.

## Lane mechanics

Waves by library, then by codex. Waves of 10 (5+5 across two writers); at most 25 entities per batch; schema-shape checklist in every brief; cite-check gated on the literal "0 fail"; validate gated on the literal "0 errors" as a separate asserted step; queue file with `[ ]` / `[x]` / `[~]`; STOPs logged, not guessed; founder flags one line each; no-skip rule within scope.

## Dependencies on other phases

- Contends with 7 for Timbuktu institutions.
- Contends with 9 for `object/`.

## Known risks

- Images: media only from whitelisted licences (`schema/enums/licenses.yaml`); no figurative prophet imagery.

## Founder decisions needed before this phase starts

- Decision 5 (catalogue access and image licences).
