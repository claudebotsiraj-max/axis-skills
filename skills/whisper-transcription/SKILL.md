---
name: whisper-transcription
description: >
  Transcribe voice notes and audio files using LOCAL OpenAI Whisper.
  Completely private - audio never leaves your device.
---

# Whisper Voice Transcription (LOCAL)

Transcribe audio/voice messages to text using **local** Whisper.

## Setup

- **Engine:** `whisper` CLI (openai-whisper Python package)
- **Model:** base (small, fast) or small (better accuracy)
- **Location:** `/opt/homebrew/bin/whisper` (or wherever pip installed it)
- **Supports:** mp3, mp4, m4a, wav, webm, ogg
- **Max size:** Limited by disk space only
- **Privacy:** 100% local - never leaves your machine

## When to Use

Automatically triggered when:
- User sends an audio/voice attachment to the agent
- Explicitly asked: "transcribe this audio" or similar

## Transcription Process

```
1. Receive audio file (via attachment in message tool)
2. Check file format (must be supported)
3. Run whisper CLI locally
4. Return transcription to user
5. Optional: Process transcription for commands/actions
```

## Local Command

```bash
# Basic transcription
whisper /path/to/audio.mp3 --model base --language en --output_format txt --output_dir /tmp

# With timestamps (for long audio)
whisper /path/to/audio.mp3 --model small --language en --output_format json --output_dir /tmp

# Read the output file
cat /tmp/audio.txt
```

**Installation (if needed):**
```bash
brew install ffmpeg
pip install -U openai-whisper
```

## Response Handling

**Success:**
```
whisper /path/to/audio.mp3 --model base --language en

Output file: /tmp/audio.txt

Content:
This is the transcribed voice message...
```

**Error cases:**
- File too large (disk space) → Ask user to re-record shorter
- Unsupported format → Convert with ffmpeg: `ffmpeg -i input.m4a output.mp3`
- Whisper not installed → Prompt user to install: `pip install -U openai-whisper`

## Transcription Context

When transcribing for Salah:
- Maintain original formatting (newlines for pauses)
- Note any [unclear] sections
- Include timestamp if multiple voice notes
- Process commands in transcription if obvious

## Integration with Main Session

The main agent (Axis) should:
1. Detect audio attachments automatically
2. Call this skill implicitly when voice note received
3. Present transcription: "🎙️ **Voice Note Transcribed:**\n\n> [transcription]"
4. Ask follow-up: "What would you like me to do with this?"

## Privacy Note ✅

**100% PRIVATE.** Audio is processed locally on your Mac using the open-source `openai-whisper` package. Never sent to any server. Only you and this local agent can access it.
