#!/bin/bash
cd /Users/sms/.openclaw/workspace/liberty/slides
OUT=/Users/sms/.openclaw/workspace/liberty

build_video() {
  local outname="$1"; shift
  local slides=("$@")
  local n=${#slides[@]}
  local dur=2
  local fade=0.5
  
  # Build inputs
  local inputs=""
  for s in "${slides[@]}"; do
    inputs="$inputs -loop 1 -t ${dur} -i ${s}.png"
  done
  
  # Build xfade filter chain
  local filter=""
  local offset
  offset=$(echo "$dur - $fade" | bc)
  
  if [ $n -eq 1 ]; then
    filter="[0:v]scale=1080:1920,format=yuv420p[v]"
  elif [ $n -eq 2 ]; then
    filter="[0:v][1:v]xfade=transition=fade:duration=${fade}:offset=${offset},format=yuv420p[v]"
  else
    # First pair
    filter="[0:v][1:v]xfade=transition=fade:duration=${fade}:offset=${offset}[x1]"
    local cum=$offset
    for ((i=2; i<n; i++)); do
      cum=$(echo "$cum + $dur - $fade" | bc)
      if [ $i -eq $((n-1)) ]; then
        filter="${filter};[x$((i-1))][${i}:v]xfade=transition=fade:duration=${fade}:offset=${cum},format=yuv420p[v]"
      else
        filter="${filter};[x$((i-1))][${i}:v]xfade=transition=fade:duration=${fade}:offset=${cum}[x${i}]"
      fi
    done
  fi
  
  echo "=== Building $outname ($n slides) ==="
  ffmpeg -y $inputs -i music.aac \
    -filter_complex "$filter" \
    -map "[v]" -map "${n}:a" \
    -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -shortest \
    -movflags +faststart \
    "$OUT/${outname}.mp4" 2>&1 | tail -3
  echo "Done: $OUT/${outname}.mp4"
}

build_video "summer-launch-music" summer-a1 summer-a2 summer-a3 summer-a4 summer-a5 summer-a6
build_video "summer-why-music" summer-b1 summer-b2 summer-b3 summer-b4 summer-b5
build_video "summer-fomo-music" summer-c1 summer-c2 summer-c3 summer-c4
