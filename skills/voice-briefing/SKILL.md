---
name: voice-briefing
description: >
  Convert morning briefing text to audio using Salah's ElevenLabs voice clone.
  Runs Mon-Fri at 8:15 AM ET, 15 min after the text morning briefing.
  Sends voice note to Discord #personal.
---

# Voice Morning Briefing

Generates a ~60 second audio briefing in Salah's cloned voice using ElevenLabs TTS.

## Setup

- **Voice ID:** `nRiVCZYVwPE2ZU2mhhm6` (Salah's 11labs clone)
- **Model:** `eleven_turbo_v2_5` (fast, good quality)
- **Voice Settings:** stability 0.4, similarity_boost 0.85, style 0.1
- **API Endpoint:** `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **API Key:** Stored in TOOLS.md as `ELEVENLABS_API_KEY`
- **Output:** `artifacts/voice-briefing-YYYY-MM-DD.mp3`

## How It Works

1. Read the latest morning briefing messages from Discord #personal (`1472035483931508808`)
2. Condense to ~150 words max (~60 seconds spoken), focusing on:
   - Urgent items & action needed
   - Today's calendar events
   - Portfolio alerts / market movers
   - Active reminders
3. Generate audio via `generate.sh` or direct API call
4. Send voice note to Discord #personal

## Shell Script Usage

```bash
echo "Your briefing text here" | ELEVENLABS_API_KEY=xxx bash skills/voice-briefing/generate.sh
# Outputs: artifacts/voice-briefing-YYYY-MM-DD.mp3
```

## Agent Usage (Preferred)

```
1. Read last 5 messages from Discord #personal (channel: discord, target: 1472035483931508808) using message(action=read)
2. Identify today's morning briefing content
3. Condense to ~150 words — tight, spoken-word style:
   - "Good morning Salah. Here's your Thursday briefing."
   - Lead with urgent items
   - Calendar and meetings next
   - Portfolio/market highlights
   - Close with reminders
4. Run: exec("echo '<condensed text>' | ELEVENLABS_API_KEY=<key> bash /Users/sms/.openclaw/workspace/skills/voice-briefing/generate.sh")
5. Send audio: message(action=send, channel=discord, target=1472035483931508808, filePath=<output path>, message="🎙️ **Voice Briefing** — <date>")
```

## Cron Job Spec

Create with these settings:
- **Name:** `Voice Morning Briefing`
- **Schedule:** `15 8 * * 1-5` (Mon-Fri 8:15 AM ET)
- **Timezone:** `America/New_York`
- **Session:** `isolated`
- **Timeout:** 120s
- **Delivery:** `none`
- **Model:** Flash (routine task)

### Cron Payload Message:
```
Generate today's voice morning briefing.

Read the skill: /Users/sms/.openclaw/workspace/skills/voice-briefing/SKILL.md
Follow the "Agent Usage" section precisely.

ElevenLabs API key: [get from TOOLS.md]
Discord #personal channel: 1472035483931508808

If the morning briefing hasn't been posted yet (no briefing messages from today), skip and do nothing.
If ElevenLabs API fails, send a text-only note to #personal: "⚠️ Voice briefing failed — check ElevenLabs API key/credits"
```

## Notes

- 40,000 credits/month on Starter plan ($3.50/mo)
- Each briefing uses ~1,000-2,000 credits (~150 words)
- That's ~20-40 briefings/month — well within limits for weekdays only
- Audio quality is best with short, punchy sentences
- Avoid markdown formatting in the text — speak naturally
