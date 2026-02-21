#!/bin/bash
# Voice Briefing Generator — ElevenLabs TTS
# Usage: echo "briefing text" | ELEVENLABS_API_KEY=xxx bash generate.sh
# Output: artifacts/voice-briefing-YYYY-MM-DD.mp3

VOICE_ID="nRiVCZYVwPE2ZU2mhhm6"
MODEL="eleven_turbo_v2_5"
DATE=$(date +%Y-%m-%d)
OUTPUT="/Users/sms/.openclaw/workspace/artifacts/voice-briefing-${DATE}.mp3"
mkdir -p /Users/sms/.openclaw/workspace/artifacts

TEXT=$(cat)
if [ -z "$TEXT" ]; then
  echo "ERROR: No text provided on stdin" >&2
  exit 1
fi
if [ -z "$ELEVENLABS_API_KEY" ]; then
  echo "ERROR: ELEVENLABS_API_KEY not set" >&2
  exit 1
fi

TEXT_ESCAPED=$(echo "$TEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"text\":${TEXT_ESCAPED},\"model_id\":\"${MODEL}\",\"voice_settings\":{\"stability\":0.5,\"similarity_boost\":0.75,\"style\":0.3}}" \
  --output "${OUTPUT}"

if [ -s "${OUTPUT}" ]; then
  echo "${OUTPUT}"
else
  echo "ERROR: Empty output — API call may have failed" >&2
  exit 1
fi
