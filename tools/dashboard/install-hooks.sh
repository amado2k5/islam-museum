#!/usr/bin/env bash
# Install git hooks that regenerate the local dashboard after every
# commit, merge, pull and checkout in a clone of islam-museum.
# Usage: bash tools/dashboard/install-hooks.sh [/path/to/repo ...]
set -e
GEN="$(cd "$(dirname "$0")" && pwd)/generate.mjs"
NODE_BIN="$(command -v node || echo /usr/local/bin/node)"

for REPO in "${@:-$(git rev-parse --show-toplevel)}"; do
  HOOKS="$REPO/.git/hooks"
  mkdir -p "$HOOKS"
  for HOOK in post-merge post-commit post-checkout; do
    cat > "$HOOKS/$HOOK" <<EOF
#!/usr/bin/env bash
# auto-regenerate the local islam.museum dashboard
("$NODE_BIN" "$GEN" >/dev/null 2>&1 &)
exit 0
EOF
    chmod +x "$HOOKS/$HOOK"
  done
  echo "hooks installed -> $HOOKS"
done
