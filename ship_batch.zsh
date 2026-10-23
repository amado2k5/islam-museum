#!/bin/zsh
cd /private/tmp/claude-501/scratch/wt/w04 || exit 1
B=$1; T=$2
F=(${(f)"$(git status --porcelain | awk '{print $2}')"})
/private/tmp/claude-501/scratch/w04/newbranch.sh "$B" "${F[@]}" || exit 1
/private/tmp/claude-501/scratch/w04/ship.sh "$B" "$T" "${F[@]}"
