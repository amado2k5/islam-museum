#!/bin/sh
# Contact sheet of a clip: N frames spread evenly, for checking a recording or a render at a glance.
#   scripts/sheet.sh clip.mp4 [frames=8] [columns=4] [tile width=640]
in="$1"; n="${2:-8}"; cols="${3:-4}"; w="${4:-640}"
frames=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$in" | tr -d ", \n")
step=$(( (frames - 1) / (n - 1) )); [ "$step" -lt 1 ] && step=1
rows=$(( (n + cols - 1) / cols ))
ffmpeg -y -loglevel error -i "$in" -vf "select='not(mod(n\,$step))',scale=$w:-1,tile=${cols}x${rows}:padding=4:margin=4:color=white" -frames:v 1 -q:v 3 "${in%.mp4}.sheet.jpg"
echo "${in%.mp4}.sheet.jpg ($frames frames)"
