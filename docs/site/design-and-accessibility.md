# Design and accessibility rules

These rules keep the existing design system (ivory, ink, gold, lapis; Amiri display and Noto Naskh Arabic body; soft-tint cards with accent bars; intentional dark mode) and make it meet WCAG 2.2 AA. They are not a redesign. When you add UI, use the tokens and classes below rather than inline colours.

## Colour tokens (`site/src/styles/global.css`)

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--gold` | `#b8932f` | same | **decorative only**: borders, accent bars, hover outlines, the depth-dial selection ring. |
| `--gold-text` | `#6e5414` | `#b8932f` | **any text in gold**. Light value is 6.45:1 on ivory `#f7f3ea` and 5.24:1 on sand `#e6dcc6`. |
| `--muted` | `#5f5a53` | `#bdb7ac` | secondary text. Dark value is 8.97:1 on `#17171a` and 6.78:1 on the dark panel `#22232a`. |
| `--fg`, `--bg`, `--panel` | ink / ivory / sand | `#ede8dd` / `#17171a` / `#22232a` | body text, page, panels. |
| `--link`, `--focus` | lapis | `#8fb3e8` / `#b9d2ff` | links and focus rings. |

Rule: **never put `--gold` on text.** Check any new text colour against its background. The target is 4.5:1 for body and small text, and 3:1 for large text and UI borders. Compute the ratio; do not judge by eye.

## Type

- Arabic is the default and primary script (`html[lang="ar"]`). Body is Noto Naskh Arabic; headings and `.display` use Amiri.
- **Letter-spacing and uppercase are for Latin text only.** Arabic letters must join, and tracking breaks the joins. `html[lang="ar"] .eyebrow` resets tracking to 0, and `.kicker` resets it under `lang="ar"` as well. Do not add `letter-spacing` to any element that can contain Arabic.
- Do not set `letter-spacing` inline in templates. Put styles in `global.css`.

## Headings and cards

Card titles are real headings, styled by `.card .card-title`. The look matches the old bold `<b>`; only the markup changed.

Choose the level by where the card sits in the outline:

| Page context | Card title element |
|---|---|
| Directly under the page `h1` (wing, exhibits, questions, screen, themes index) | `h2.card-title` |
| Under a section `h2` (homepage wings and entrances) | `h3.card-title` |
| Under a group heading `h3` (themes wing, grouped by class) | `h4.card-title` |

Rules:
- The outline never skips a level. Verify with a heading map in the browser console: `[...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.textContent.trim())`. The homepage must read h1 → h2 → h3; `/ar/time/` must read h1 → h2.
- Do not use `<b>` or a styled `<span>` as a title, and do not put a bare title inside `<a>` without a heading element.

## Header, navigation and the phone menu

- Above 720px the 14 nav links sit in one wrapping row under the header.
- At 720px and below, the list collapses behind a real `<button id="menu-btn">` labelled "القائمة". It sets `aria-expanded`. Escape closes it and returns focus to the button; opening moves focus to the first link.
- The search pill and the theme toggle always stay visible outside the menu.
- The collapse needs JavaScript, so it is gated on `html.js`. The class is added by the first inline script in `BaseLayout.astro`. Without JS the nav is simply visible.
- The decorative `·` separator inside the nav is `aria-hidden` and is hidden in the phone menu.

If you add a nav item, add it to `WINGS` or the explicit list in `BaseLayout.astro`. Keep the list short, or the phone menu gets long.

## Disclosure (`<details>`)

The native marker (a triangle) pointed the wrong way in RTL and appeared as a stray ◀. `global.css` hides it and shows `+`, or `−` when open. New `<details>` blocks use the same styling; do not add a custom marker per page.

## Phone width (390px is the reference)

- Grids use `auto-fit, minmax(…)` and drop to one column at 720px (`.grid-cards`).
- Panels that sit side by side on desktop (the entity "at a glance" block, the "في الزمان / في المكان" panel) stack through `auto-fit`. Do not set fixed column counts.
- Acceptance check: on `/`, `/ar/time/`, `/ar/event/hijra/` and `/ar/search/` at 390px, `document.documentElement.scrollWidth` must equal `clientWidth`. An iframe of width 390 on a page is a quick way to measure several URLs.

## Dark mode

Tokens switch in `:root[data-theme="dark"]` and under `prefers-color-scheme` when no theme is stored. When you add a colour, add its dark value to both dark blocks.

The theme toggle's accessible name names the action: "تبديل الوضع الفاتح" while the dark theme shows, "تبديل الوضع الداكن" otherwise. It is synced on every load and after each click (`BaseLayout.astro`).

## Visual anchors

Cards are text-first. Do not add decorative images to every card. A future motif should be abstract, built from the existing geometric pattern, and should not mean generating thousands of images.

## The accessibility statement

The public statement is `/[lang]/accessibility/` (`site/src/pages/[lang]/accessibility/index.astro`, texts in `i18n/*.yaml` under `accessibility:`, linked from the footer fine line on every page). It follows the European Commission's model accessibility statement: conformance status (WCAG 2.2 AA target, partially conformant, self-assessed until a third-party audit runs), the standards and laws we follow (CRPD, Marrakesh Treaty, ADA and Section 508, ACA and CAN/ASC-EN 301 549, AODA, EAA and EN 301 549, UK Equality Act), a per-visitor-group description, known limitations, the feedback route (`discover@islam.museum` and the `accessibility.yml` issue template, five-working-day reply), alternative formats, enforcement routes and how the statement was prepared.

Rules for contributors:

- **Keep the statement true.** A feature listed on it must exist; a limitation removed from the page must be removed from the statement in the same commit. Change the `updated` date with any content change.
- **No overlay.** Never add a third-party accessibility toolbar, overlay or widget: it breaks the no-script/no-network rule and does not make the site conformant.
- **Every `<audio>` and `<video>`** must have a `<track kind="captions">` and/or a visible linked transcript on the page; a media alternative for text (like the kids' story narrations) must say so in its `<figcaption>` and be linked to the player with `aria-describedby`. Audio never autoplays.
- **Media alt text is per language.** Templates use `alt[lang] ?? alt.ar`; never render `alt.ar` on `/en/` or `/ur/` pages. The art gallery's English and Urdu alt text is filled in `site/src/data/architecture-art.json`.
- **Braille and sign language.** The site does not render braille; screen readers relay text to braille displays — keep `lang` correct on every page and every foreign-language run. Sign-language videos, braille-ready (BRF) and EPUB downloads, and an easy-read level are in the accessibility megaplan, not yet built.
- **Claims:** schema.org `accessibilityFeature`/`accessibilityHazard`/`accessMode`/`accessibilitySummary` metadata is the approved plan (megaplan A6); add it to `BaseLayout.astro` JSON-LD only after the listed features exist.
