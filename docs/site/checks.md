# Checks: what fails, where, and how to add one

Checks run at three points. Each one is a rule a change must keep true. If a check fails, fix the cause (the data, the template or the code). Do not weaken the check, skip it, or add a guard that hides bad data.

| When | Command | What it checks |
|---|---|---|
| Any data or content change | `npm run validate` | Schema, references, dates, honorifics, Qur'an text, licences, content lints (below). |
| Any logic change | `npm test` | Validator rules, the Qur'an text is frozen, scope rules, and the date rules (`scripts/hijri/*.test.ts`). |
| Any site change | `npm run build` | `validate`, then the graph and derive steps, the Astro build (which contains its own assertions), then `check:site`. |
| Network guard | `npm run check:static` | No runtime calls to external origins; the site stays static. |

## Content lints (`scripts/validate.ts`)

Errors (the build stops):

- **Replacement character** (U+FFFD) anywhere in data text or prose. Corrupted text has to be restored from a clean source, not left in.
- **Placeholder digit in a date:** an `X` after a hyphen (`0571-04-2X`) in an `edtf` or `hijri` value. Use the intended date, or `~` for an approximation.
- **`ق.م هـ`** in data or prose. The BCE Hijri form is `ق.هـ`.
- Plus the existing schema, reference, scope and licence rules.

Warnings (reported, do not stop the build):

- **Same title on two entities of different classes** (after normalising diacritics, alef and ta marbuta forms). Often a place and an event that share a name, which is legitimate. If it is one thing, merge it: keep one id and list the other under `aliases`.

## Rendered-output assertions (`scripts/check-site.ts`, run after the Astro build)

Errors:

- `0 هـ` (a Hijri year 0) on any page. The check ignores `10 هـ`, `20 هـ` and so on.
- U+FFFD, or `ق.م هـ`, on any page.
- A date rendered with a placeholder digit (`dddd-dd-dX`).
- A footnote link `#note-N` with no `id="note-N"` on the same page.

Warnings:

- An empty `<meta name="description">`.
- An empty `<li>`.

## Build-time assertions in the components

- **Time wing** (`site/src/pages/[lang]/[hall]/index.astro`): the rendered entries are non-decreasing by `timelineKey`. Throws otherwise.
- **Timeline strip** (`site/src/components/TimeStrip.astro`): every marker lies within the scale. Throws otherwise.
- **JSON-LD and metadata** fall back to a stub sentence for entities with no summary, so no page ships an empty description.

## Tests (`npm test`)

- `scripts/hijri/anchors.test.ts`: the Hijri converter anchors.
- `scripts/hijri/dates.test.ts`: BH rendering (no year 0), the era sort (an era after the events of its start year), Hijri-first ordering (8 AH after 7 AH), Hijri-only dates getting a position, and undated entries sorting last.
- `scripts/pipeline.test.ts`: validator rules, the frozen Qur'an text, scope rules, and content guards.

## Adding a check

1. Decide the level: a data problem is a `validate` error; a rendering problem is a `check-site` error; a judgement you cannot make mechanically is a warning.
2. Add the rule next to its siblings (`scripts/validate.ts` for data, `scripts/check-site.ts` for HTML). Keep messages specific: name the file and the value.
3. Add a unit test in `scripts/hijri/` or `scripts/pipeline.test.ts` for the rule itself, including a case that must pass.
4. Run `npm run validate && npm test && npm run build` and confirm the rule fails on a deliberately bad input, then remove the bad input.
