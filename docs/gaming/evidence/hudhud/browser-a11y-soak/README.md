# Hudhud browser, accessibility and soak evidence

_26 November 2026. UAT release `20261126-709707701f2`, commit `709707701f21a7d0507f0a02bb99ac4cd291511b`, measured through `https://uat-games.islam.museum/hudhud/` on this Mac (`darwin arm64`, Mac16,5, Apple M4 Max, 128 GB). **A pass on this Mac is not a pass on the two reference machines (M1 Air 8 GB; Windows 11 i5-1135G7 8 GB).** No reference-machine pass is claimed anywhere in this folder._

These are machine measurements of a prototype. They are not WCAG conformance certification, not screen-reader testing, not child playtesting, and not a judgement that the game is finished.

The Chrome measurements were made in headed system Chrome 158.0.8127.38; `preflight=off` was not used. The Firefox/WebKit tool also launches a headed browser when a binary exists.

The final tools were rerun against this same UAT release on 26 November 2026 after they learned to leave Hudhud's newer opening story. This UAT release predates that opening, so the opening-skipping path itself is **not measured here**; the measurements remain evidence for the named UAT release, not for the newer opening or Atlas picture on `main`.

## Commands run

From `gaming/`:

```sh
npm exec tsx -- --tsconfig tsconfig.json tools/hudhud-browsers.ts https://uat-games.islam.museum ../docs/gaming/evidence/hudhud/browser-a11y-soak
npm exec tsx -- --tsconfig tsconfig.json tools/hudhud-a11y.ts https://uat-games.islam.museum ../docs/gaming/evidence/hudhud/browser-a11y-soak
npm exec tsx -- --tsconfig tsconfig.json tools/hudhud-soak.ts https://uat-games.islam.museum ../docs/gaming/evidence/hudhud/browser-a11y-soak 10
```

All three commands exited 0. Earlier attempts were discarded before commit: the first soak read the wrong debug hook and then sampled after the quest renderer had been torn down, and UAT changed to this release during the measurement window. The committed browser, accessibility and soak JSON files all name the same UAT release and commit.

## Firefox and WebKit

- **firefox**: blocked before launch. Playwright's firefox browser binary is not installed or could not start. No binary was downloaded; install requires the founder's word. Error: browserType.launch: Executable doesn't exist at /Users/ahmedabdelaal/Library/Caches/ms-playwright/firefox-1555/firefox/Nightly.app/Contents/MacOS/firefox
- **webkit**: blocked before launch. Playwright's webkit browser binary is not installed or could not start. No binary was downloaded; install requires the founder's word. Error: browserType.launch: Executable doesn't exist at /Users/ahmedabdelaal/Library/Caches/ms-playwright/webkit-2370/pw_run.sh

Because neither browser launched, there is **no Firefox or WebKit quest-path result**: no console-error result, no failed-request result, no WebGL result and no capture for those browsers. No browser binary was downloaded because the instruction says to stop without the founder's word.

## Accessibility machine scan

English and Arabic were scanned at 1440×810 in headed system Chrome (the device preflight was not disabled). The states were Atlas, a talk, settings, pause and results. The JSON records semantic roles/names, DOM-order focusable lists, direct Tab sequences inside sheets, measured target boxes and measured CSS contrast.

| state | tabbables en/ar | targets under 44 px en/ar | low-contrast count en/ar | minimum measured ratio en/ar | direct sheet trap result |
|---|---:|---:|---:|---:|---|
| `atlas` | 13 / 13 | 4 / 4 | 0 / 0 | 8.69 / 8.69 | not applicable |
| `talk` | 14 / 14 | 4 / 4 | 0 / 0 | 9.21 / 9.21 | not applicable |
| `settings-sheet` | 46 / 46 | 8 / 8 | 0 / 0 | 5.39 / 5.39 | yes |
| `pause-sheet` | 19 / 19 | 4 / 4 | 0 / 0 | 9.19 / 8.69 | yes |
| `results-sheet` | 21 / 21 | 7 / 7 | 0 / 0 | 4.52 / 4.52 | yes |

- Browser/page console errors recorded by the scan: 0 in English, 0 in Arabic.
- Direct Tab sequences stayed inside the settings, pause and results sheets for the measured 14 Tab presses; the sequences are in `hudhud-a11y.json`.
- The contrast method is limited: it composites the computed foreground colour over ancestor CSS background colours. It does **not** measure text painted over the canvas, images, gradients or video-like effects. The zero low-contrast count is therefore not a WCAG pass.
- Sheets can be taller than the 810 px capture viewport; the screenshots preserve that fact for review.

Repeated targets under 44 px requiring design review:

- `link` “Skip to the game”: 122×24 px (first noted in `atlas`)
- `slider` “Volume”: 290×16 px (first noted in `atlas`)
- `link` “How it was made”: 101×15 px (first noted in `atlas`)
- `link` “islam.museum”: 104×18 px (first noted in `atlas`)
- `checkbox` “on”: 26×26 px (first noted in `settings-sheet`)
- `link` “In the museum: Ibn al-Haytham”: 227×18 px (first noted in `results-sheet`)
- `link` “In the museum: The dark room”: 221×18 px (first noted in `results-sheet`)
- `link` “In the museum: The Book of Optics”: 255×18 px (first noted in `results-sheet`)

## Ten-minute soak

- Completed quest/Atlas cycles: **134**; unfinished cycles: **0**; tool/browser errors: **0**.
- Overall resource verdict from the tool: **levels off: no**.
- Warm-up treatment: the first three minutes are excluded for trend judgement, matching the Granada soak pattern; raw minute-zero samples remain in the JSON.
- Quest renderer measurements are captured at the end of the last completed quest before `toAtlas()` destroys that Phaser game. This is explicit in each sample.

| measure | first after warm-up | last | change | levels off |
|---|---:|---:|---:|---|
| JavaScript heap | 65.9 MB | 65.5 MB | -0.6% | yes |
| DOM nodes | 313 | 313 | 0 | yes |
| instrumented live listeners | 254 | 719 | 465 | no |
| quest texture count | 48 | 48 | 0 | yes |

Frame samples: 11 quest-boundary samples; worst p95 `9.2` ms; worst p99 `9.4` ms; frames over 33.3 ms `0`; frames over 50 ms `0`. These are short samples from the quest just completed at each minute boundary, not a continuous human play session.

Listener counts are an instrumented add/remove-event-listener count inside the page, not a browser-internal exact count. The observed trend is nevertheless evidence the game-code owner should investigate; it is not fixed or explained by this report.

## Files

- `hudhud-browsers.json`: browser availability/launch report.
- `hudhud-a11y.json`: complete machine accessibility scan.
- `hudhud-a11y-*.webp`: captures for each scan state in English and Arabic. They were converted from the tool's PNG captures with `cwebp -q 82` so the committed evidence follows the repository's small-WebP evidence rule; the conversion was lossy and the figures/measurements come from the JSON, not these pictures.
- `hudhud-soak.json`: complete ten-minute soak samples and verdict.

## What was not measured

- Firefox and WebKit behaviour, because their Playwright binaries are absent.
- Screen readers, voice control, keyboard-only play beyond the machine Tab scan, cognitive accessibility, child comprehension or parental comfort.
- The two 8 GB reference machines, thermal throttling, battery use or a human-length continuous session.
- 60-minute and 4-hour soaks. They were not requested; the tool accepts those durations when asked.
