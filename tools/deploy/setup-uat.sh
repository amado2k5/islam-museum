#!/usr/bin/env bash
# One-time setup of the UAT environment (founder, 1 November 2026). Idempotent: every step
# creates what is missing and leaves what exists. Run from any checkout of the repository.
#
#   tools/deploy/setup-uat.sh github       GitHub Environments `production` and `uat`, their
#                                          variables, and the uat R2_SYNC_TOKEN (generated here,
#                                          never printed). Needs: gh logged in as the owner.
#   tools/deploy/setup-uat.sh r2-keys      Prompts (hidden) for the UAT bucket's S3 Access Key ID
#                                          and Secret and stores them as the uat Environment's
#                                          R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY. Create the
#                                          token first: dash.cloudflare.com → R2 → Manage API
#                                          tokens → Create: Object Read & Write, bucket
#                                          islam-museum-uat only.
#   tools/deploy/setup-uat.sh cloudflare   R2 bucket islam-museum-uat, its custom domain
#                                          uat-api.islam.museum, and the Pages project
#                                          islam-museum-uat. Needs: `npx wrangler login` done in
#                                          workers/r2-sync (or CLOUDFLARE_API_TOKEN exported),
#                                          and CF_ZONE_ID (the islam.museum zone id, from the
#                                          dashboard overview page) exported or passed as $2.
#   tools/deploy/setup-uat.sh check        Prints what exists on both sides (no changes).
#
# The Workers themselves (islam-museum-site-uat, islam-museum-r2-sync-uat[-N]) and the
# uat.islam.museum Custom Domain are created by the first run of deploy-uat.yml, from
# wrangler.production.toml `[env.uat]`; nothing here deploys code.
#
# Never pass a secret on the command line: the two secrets this script handles are read
# from a hidden prompt (r2-keys) or generated in memory (github), then piped to gh.
set -euo pipefail

REPO="${REPO:-amado2k5/islam-museum}"
BUCKET="islam-museum-uat"
API_DOMAIN="uat-api.islam.museum"
PAGES_PROJECT="islam-museum-uat"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
WRANGLER="$ROOT/workers/r2-sync/node_modules/.bin/wrangler"

say() { printf '\n== %s\n' "$*"; }

ensure_environment() {
  # PUT creates or updates; an existing environment keeps its secrets and variables.
  gh api -X PUT "repos/$REPO/environments/$1" --silent && echo "environment $1: ok"
}

set_var() {
  # gh variable set is an upsert.
  local env="$1" name="$2" value="$3"
  printf '%s' "$value" | gh variable set "$name" --repo "$REPO" --env "$env" --body "$value" >/dev/null && echo "  $env.$name = $value"
}

github_setup() {
  say "GitHub Environments and variables ($REPO)"
  ensure_environment production
  # Production names: the shared workflow (deploy-env.yml) checks them against the known values.
  set_var production R2_BUCKET islam-museum-search
  set_var production PAGES_PROJECT islam-museum
  set_var production SITE_URL https://islam.museum
  set_var production SYNC_WORKER_COUNT 7
  # WRANGLER_ENV stays unset for production: the top-level wrangler environment.
  ensure_environment uat
  set_var uat R2_BUCKET "$BUCKET"
  set_var uat WRANGLER_ENV uat
  set_var uat PAGES_PROJECT "$PAGES_PROJECT"
  set_var uat SITE_URL https://uat.islam.museum
  set_var uat SYNC_WORKER_COUNT 7
  if gh secret list --repo "$REPO" --env uat --json name --jq '.[].name' | grep -qx R2_SYNC_TOKEN; then
    echo "  uat.R2_SYNC_TOKEN already set (kept; delete it in GitHub to rotate)"
  else
    # The UAT sync Workers' bearer token: generated here, stored only in GitHub. Every UAT
    # deploy copies it into the Workers (wrangler secret put), so GitHub is the source of truth.
    openssl rand -hex 32 | tr -d '\n' | gh secret set R2_SYNC_TOKEN --repo "$REPO" --env uat
    echo "  uat.R2_SYNC_TOKEN generated and set"
  fi
}

r2_keys() {
  say "UAT bucket S3 keys → GitHub Environment uat"
  echo "Create them first: dash.cloudflare.com → R2 → Manage API tokens → Create API token:"
  echo "  Permissions: Object Read & Write; Specify bucket: $BUCKET only; TTL: forever."
  echo "The values are read hidden and sent straight to GitHub; nothing is echoed or stored here."
  read -r -s -p "Access Key ID: " key; echo
  read -r -s -p "Secret Access Key: " secret; echo
  [ -n "$key" ] && [ -n "$secret" ] || { echo "empty value; nothing set" >&2; exit 1; }
  printf '%s' "$key" | gh secret set R2_ACCESS_KEY_ID --repo "$REPO" --env uat
  printf '%s' "$secret" | gh secret set R2_SECRET_ACCESS_KEY --repo "$REPO" --env uat
  unset key secret
  echo "  uat.R2_ACCESS_KEY_ID and uat.R2_SECRET_ACCESS_KEY set"
}

cloudflare_setup() {
  local zone="${2:-${CF_ZONE_ID:-}}"
  [ -x "$WRANGLER" ] || { echo "wrangler not installed: run npm ci --prefix workers/r2-sync" >&2; exit 1; }
  say "Cloudflare: R2 bucket $BUCKET"
  if "$WRANGLER" r2 bucket list 2>/dev/null | grep -qx "name:\s*$BUCKET\|$BUCKET"; then
    echo "  bucket exists"
  else
    "$WRANGLER" r2 bucket create "$BUCKET"
  fi
  say "Cloudflare: custom domain $API_DOMAIN on $BUCKET"
  if "$WRANGLER" r2 bucket domain list "$BUCKET" 2>/dev/null | grep -q "$API_DOMAIN"; then
    echo "  domain exists"
  else
    [ -n "$zone" ] || { echo "CF_ZONE_ID (the islam.museum zone id) is needed to attach $API_DOMAIN: export it or pass it as the second argument" >&2; exit 1; }
    "$WRANGLER" r2 bucket domain add "$BUCKET" --domain "$API_DOMAIN" --zone-id "$zone" --force
  fi
  say "Cloudflare: Pages project $PAGES_PROJECT"
  if "$WRANGLER" pages project list 2>/dev/null | grep -q "$PAGES_PROJECT"; then
    echo "  project exists"
  else
    "$WRANGLER" pages project create "$PAGES_PROJECT" --production-branch main --force
  fi
}

check() {
  say "GitHub"
  gh api "repos/$REPO/environments" --jq '.environments[].name' | sed 's/^/  environment: /'
  for env in production uat; do
    echo "  $env variables:"; gh variable list --repo "$REPO" --env "$env" 2>/dev/null | sed 's/^/    /' || echo "    (none)"
    echo "  $env secrets:"; gh secret list --repo "$REPO" --env "$env" 2>/dev/null | sed 's/^/    /' || echo "    (none)"
  done
  say "Cloudflare"
  if [ -x "$WRANGLER" ]; then
    "$WRANGLER" r2 bucket list 2>/dev/null | grep -A1 "^name:" | sed 's/^/  /' || true
    "$WRANGLER" r2 bucket domain list "$BUCKET" 2>/dev/null | sed 's/^/  /' || echo "  (bucket domains: not readable; wrangler login?)"
    "$WRANGLER" pages project list 2>/dev/null | sed 's/^/  /' || echo "  (pages: not readable)"
  else
    echo "  wrangler not installed (npm ci --prefix workers/r2-sync)"
  fi
}

case "${1:-}" in
  github) github_setup ;;
  r2-keys) r2_keys ;;
  cloudflare) cloudflare_setup "$@" ;;
  check) check ;;
  *) sed -n '2,24p' "$0"; exit 2 ;;
esac
