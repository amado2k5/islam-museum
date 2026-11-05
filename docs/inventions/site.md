# Muslim Inventions Browser: site design

Phase 4 begins after 30 sourced invention records exist. Site rules in [`docs/site/README.md`](../site/README.md), design/accessibility standards and the byte/weight checks govern every change. The work is a static Astro page; no runtime AI, database, new worker route, external request or user tracking.

## 1. `/[lang]/inventions/` — browser home

Planned page: `site/src/pages/[lang]/inventions/index.astro`.

- Arabic-first title and lede, an honest "growing" status badge and counts based on the built graph.
- Browse by domain (19 labels from the enum), era and attribution status, then a trilingual A–Z list, all rendered in HTML.
- Chronological trail with each node's first-attested date and domain; preserve discovered/contested/legend labels.
- Filter controls may enhance the static list but the complete list remains readable without JavaScript.
- A sourced chain view links precursors to descendants. Every chain includes non-Muslim precursors and transmissions where a record exists.

## 2. `/[lang]/invention/<slug>/` — invention page

The generic entity route should build the record page without an allowlist; confirm this during Phase 4. Add invention-specific sections in this order:

1. Hero image with caption and localized alt text; no empty frame.
2. Quick facts: domain, kind, era, earliest attestation, present-day status and attribution label.
3. Maker and faith/tradition basis links, then claim/basis/perspectives.
4. What it does and the documented context in which it was made or described.
5. Predecessors, later dependents and dated spread; distinguish external precursors from museum entities.
6. Impact, significance and present-day form/descendants.
7. Describing works, surviving objects, sites, related concepts, map/diagram and references.

No material is hidden behind JavaScript. The only illustrations permitted are open/whitelisted sources or assets that pass the existing illustrations pipeline. Never depict a prophet or Companion, and never generate portraits.

## 3. Ties and discovery

- Person pages: sourced invention strip with the person's maker role.
- Object pages: example-of, tool-for or product-of links.
- Work, building, place, event and concept pages: sourced relation chips.
- Search and related entities use the built graph; `inventions` joins the Explore menu and landing-page card only after the browser home is ready.
- API consumes prebuilt graph exports; no on-request computation beyond the existing static API pattern.

## 4. Files, budgets and gates

Likely implementation files: `site/src/pages/[lang]/inventions/index.astro`, the generic entity layout or a small invention component, `site/src/lib/nav.ts`, `site/src/components/Landing.astro`, `site/src/lib/browse.ts`, `site/src/lib/entity.ts`, `site/src/pages/llms.txt.ts`, `i18n/{ar,en,ur}.yaml`, `scripts/check-site.ts` and `scripts/check-weight.ts`. Confirm actual integration points before editing; do not assume the Job Browser files are unchanged on current `main`.

Set route budgets from measured output, not guesses. Run `npm run build`, `npm run check:static`, `npm run check:weight`, accessibility checks and browser checks at 390px/desktop, light/dark, RTL/LTR. Record exact URLs and results in progress. Do not edit `workers/`, deployment workflows, R2 routing or Pages settings; deploy is the founder's alone.
