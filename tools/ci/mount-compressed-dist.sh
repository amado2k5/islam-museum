#!/usr/bin/env bash
# Mounts a zstd-compressed btrfs filesystem at the given directory (default: dist), so the ~100 GB of rendered
# pages take a fraction of that on the runner's disk. The pages are HTML with the stylesheet inlined in each one and
# compress about 20 to 1 (the zstd tar of the 23 November 2026 build: 72 GB in 2.8 GB); a hosted runner has about
# 115 GB free after the unused toolchains are removed, which seven languages of pages no longer fit in (run
# 45939222493: ENOSPC at 06:38 UTC). Nothing in the build changes: Astro, Pagefind, the checks and tar read and write
# ordinary files. The backing file is sparse and lives on whichever disk has more room (/mnt or /).
# Ubuntu runners only; linux kernels on hosted runners ship btrfs. Usage: tools/ci/mount-compressed-dist.sh [dir]
set -euo pipefail
target="$(realpath -m "${1:-dist}")"
if ! command -v mkfs.btrfs >/dev/null; then
  sudo apt-get install -y -qq btrfs-progs >/dev/null || { sudo apt-get update -qq && sudo apt-get install -y -qq btrfs-progs >/dev/null; }
fi
free_of() { df -BG --output=avail "$1" 2>/dev/null | tail -1 | tr -dc '0-9'; }
backing=/
if [ -d /mnt ] && [ "$(free_of /mnt || echo 0)" -gt "$(free_of /)" ]; then backing=/mnt; fi
image="$backing/islam-museum-dist.btrfs"
sudo truncate -s 600G "$image"
sudo mkfs.btrfs -q -f -m single "$image"
mkdir -p "$target"
test -z "$(ls -A "$target")" || { echo "::error::$target is not empty; refusing to mount over it."; exit 1; }
sudo mount -o loop,compress-force=zstd:1,noatime "$image" "$target"
sudo chown "$(id -u):$(id -g)" "$target"
echo "compressed $target on $image (backing disk $backing: $(free_of "$backing") GB free)"
