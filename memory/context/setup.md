# Setup & Infrastructure

## Identity
- Name: Axis 🌀
- First session: 2026-02-12
- Model: Claude Opus 4
- Runtime: MacBook Air, OpenClaw local mode

## Connected Services
- Discord, X, Gmail, Calendar, Notion, TradingView — all via openclaw browser
- Chrome relay extension broken — always use openclaw browser profile
- Browser doesn't survive MacBook sleep — kill stale Chrome + restart before cron runs

## Accounts
- **Bot email**: claudebotsiraj@gmail.com (browser u/0) — blocked by age verification
- **Notion**: workspace "Cluadbot Siraj's Space" (openclaw bot connected)
  - Tasks DB: `2f6db8f6-06d4-81b4-9feb-c2e0b43cb569`
  - Session Notes DB: `307db8f6-06d4-819f-8cdd-f4aa8a85ac50`
  - API Key: in TOOLS.md
- **Postiz**: API connected — Instagram (@liberty_academy) + TikTok (@libertyacademyrg)
- **Vapi.ai**: claudebotsiraj@gmail.com — phone calls via Twilio
- **GitHub**: claudebotsiraj-max — repo: axis-skills
- **Grok/xAI**: API key saved, needs credits loaded on console

## Discord Channels
- **#general** (`1471495542604562576`) — trends, everything else
- **#personal** (`1472035483931508808`) — email, calendar, appointments, reminders
- **#stock-alert** (`1472035598884667484`) — stock pivot alerts, options flow
- **#x-post** (`1472035536532410552`) — X/Twitter posts
- **#skills** (`1472770409643376764`) — skills dashboard
- **#backup-bot** (`1472080922739347592`) — weekly backups
- Guild: `1471495542025486489`
- Bot: `1471493506634748070`
- Salah: `707726343252607029`

## Known Issues
- Bot Gmail blocked by age verification
- Browser unreliable after MacBook sleep
- Cron delivery to Discord: isolated jobs + message tool > announce mode
- Stock Pivot Alert has timeout issues (increased to 240s)
