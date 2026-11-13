#!/bin/sh
# A scoped production build for the audit run's page checks: the same `astro build`, config, layouts, components,
# styles and data as the real build, over a page tree cut down to the pages named. Modelled on
# scripts/fable/scoped-build.sh (which builds only the homepage, the wing landings and the Grand Tour).
#
#   PAGES="tafsir quran surah words/quran" IDS="passage/quran-2-255 passage/quran-36-58" sh scripts/audit/scoped-build.sh
#
# PAGES: folders or files under site/src/pages/[lang]/ to keep. IDS: entity ids the entity route renders (none if empty).
# Needs .cache/graph.json and the derived files (npm run graph, derive, api). Output: .cache/audit-dist (git-ignored),
# or AUDIT_OUT. AUDIT_SRC builds another checkout's site source at this same path, for byte comparisons.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="${AUDIT_SRC:-$ROOT/site}"
T="$ROOT/.audit-site"
OUT="${AUDIT_OUT:-$ROOT/.cache/audit-dist}"
CFG="$ROOT/site/.astro-audit.config.mjs"
rm -rf "$T" "$OUT"
trap 'rm -rf "$T" "$CFG"' EXIT
mkdir -p "$T/src/pages/[lang]" "$T/public/api/v1/meta"
for d in components data islands layouts lib scripts styles; do cp -R "$SRC/src/$d" "$T/src/$d"; done
for p in $PAGES; do
  mkdir -p "$T/src/pages/[lang]/$(dirname "$p")"
  cp -R "$SRC/src/pages/[lang]/$p" "$T/src/pages/[lang]/$p"
done
if [ -n "$IDS" ]; then
  mkdir -p "$T/src/pages/[lang]/[class]"
  # the real entity route, with its node list cut down to the ids asked for
  # (the route reads `sample(nodes, ...)` since the sample-build change, and `nodes.map(` before it: both are handled)
  sed -e "s#sample(nodes, #sample(nodes.filter((n) => process.env.IDS.split(/\\\\s+/).includes(n.id)), #" -e "s#nodes.map((n) => ({ params#nodes.filter((n) => process.env.IDS.split(/\\\\s+/).includes(n.id)).map((n) => ({ params#" "$SRC/src/pages/[lang]/[class]/[slug].astro" > "$T/src/pages/[lang]/[class]/[slug].astro"
  grep -q "process.env.IDS" "$T/src/pages/[lang]/[class]/[slug].astro" || { echo "scoped build FAILED: could not scope the entity route"; exit 1; }
fi
ln -s "$ROOT/site/node_modules" "$T/node_modules"
for f in shell brand vendor favicon.svg; do [ -e "$ROOT/site/public/$f" ] && cp -R "$ROOT/site/public/$f" "$T/public/$f"; done
[ -f "$ROOT/site/public/api/v1/meta/counts.json" ] && cp "$ROOT/site/public/api/v1/meta/counts.json" "$T/public/api/v1/meta/counts.json"
cat > "$CFG" <<CONFIG
import base from "./astro.config.mjs";
export default { ...base, srcDir: "$T/src", publicDir: "$T/public", outDir: "$OUT", integrations: base.integrations.filter((i) => i.name !== "@astrojs/sitemap") };
CONFIG
cd "$ROOT/site"
IDS="$IDS" npx astro build --config .astro-audit.config.mjs
N="$(find "$OUT" -name index.html | wc -l | tr -d ' ')"
echo "scoped build: $N pages -> $OUT (site source $SRC; commit $(git -C "$ROOT" rev-parse --short HEAD); uncommitted paths under site/ data/ content/ i18n/: $(git -C "$ROOT" status --porcelain -- site data content i18n | wc -l | tr -d ' '))"
