#!/bin/sh
# A scoped production build for the rendered-page oracles (statements 8 and 9).
#
# A full `npm run build` renders about 164,000 pages and needs about 19 GB; the machine this mission ran on had 12 GB
# free. This script runs the same `astro build`, with the same config, layouts, components, styles and data, over a
# page tree that holds only the pages the oracles look at: the homepage, the nine wing landings and the Grand Tour.
# It copies site/src verbatim into a temporary sibling folder (.fable-site/src, same depth as site/src so every
# relative import resolves as it does in the real tree), keeps only those pages, builds, and deletes the copy.
# Output: .cache/fable-dist (ignored by git). The search index is not built: it needs every page.
#
#   sh scripts/fable/scoped-build.sh     # needs .cache/graph.json and the derived files (npm run graph, derive, api)
#
# The script fails if the built pages carry no stylesheet: an unstyled build would let layout checks pass by accident.
set -e
# FABLE_SRC and FABLE_OUT let o08_unchanged.py run this same build, from the same folder, over the baseline's site
# source. The folder matters: Astro derives the hashes in class names and script file names from the source path, so two
# builds are only comparable byte for byte when they are built at the same path.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="${FABLE_SRC:-$ROOT/site}"
T="$ROOT/.fable-site"
OUT="${FABLE_OUT:-$ROOT/.cache/fable-dist}"
CFG="$ROOT/site/.astro-fable.config.mjs"
rm -rf "$T" "$OUT"
trap 'rm -rf "$T" "$CFG"' EXIT
mkdir -p "$T/src" "$T/public/api/v1/meta"
for d in components data islands layouts lib scripts styles; do cp -R "$SRC/src/$d" "$T/src/$d"; done
mkdir -p "$T/src/pages/[lang]"
cp "$SRC/src/pages/index.astro" "$T/src/pages/index.astro"
cp "$SRC/src/pages/[lang]/index.astro" "$T/src/pages/[lang]/index.astro"
cp -R "$SRC/src/pages/[lang]/[hall]" "$T/src/pages/[lang]/[hall]"
[ -d "$SRC/src/pages/[lang]/grand-tour" ] && cp -R "$SRC/src/pages/[lang]/grand-tour" "$T/src/pages/[lang]/grand-tour"
ln -s "$ROOT/site/node_modules" "$T/node_modules"
for f in shell brand vendor favicon.svg favicon-32.png favicon-64.png apple-touch-icon.png; do [ -e "$ROOT/site/public/$f" ] && cp -R "$ROOT/site/public/$f" "$T/public/$f"; done
[ -f "$ROOT/site/public/api/v1/meta/counts.json" ] && cp "$ROOT/site/public/api/v1/meta/counts.json" "$T/public/api/v1/meta/counts.json"
cat > "$CFG" <<CONFIG
import base from "./astro.config.mjs";
export default { ...base, srcDir: "$T/src", publicDir: "$T/public", outDir: "$OUT", integrations: base.integrations.filter((i) => i.name !== "@astrojs/sitemap") };
CONFIG
cd "$ROOT/site"
npx astro build --config .astro-fable.config.mjs
N="$(find "$OUT" -name index.html | wc -l | tr -d ' ')"
if ! grep -q "<style" "$OUT/en/index.html" || ! grep -q "fcols" "$OUT/en/index.html"; then echo "scoped build FAILED: the built pages carry no stylesheet"; exit 1; fi
echo "scoped build: $N pages -> $OUT, stylesheet inlined (site source $SRC; repository commit $(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo 'not a checkout'); uncommitted paths under site/ data/ content/ tour/ i18n/: $(git -C "$ROOT" status --porcelain -- site data content tour i18n 2>/dev/null | wc -l | tr -d ' '))"
