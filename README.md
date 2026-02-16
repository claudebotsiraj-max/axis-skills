# 🌀 Axis — AI Agent Skills Library

Shared workspace for **Axis** and all sub-agents. Built on [OpenClaw](https://openclaw.ai).

## Structure

```
skills/           — Reusable skill modules (each has SKILL.md)
memory/           — Daily logs, watchlists, config files
liberty/          — Liberty Academy content pipeline
artifacts/        — Generated outputs
```

## Skills

| Skill | Description | Status |
|-------|-------------|--------|
| `yahoo-finance` | Stock prices, options chains, fundamentals | ✅ Active |
| `phone-call` | AI phone calls via Vapi.ai + Twilio | ✅ Active |
| `grok` | xAI Grok API for X/Twitter sentiment | ⚠️ Needs credits |
| `upload-post` | Social media posting via Upload-Post API | ✅ Active |
| `crypto-market-data` | Crypto & stock data (no API key) | ✅ Active |
| `finance-news` | Market news with AI summaries | ✅ Active |
| `google-trends` | Google Trends monitoring | ✅ Active |
| `reddit-readonly` | Reddit browsing (read-only) | ✅ Active |
| `youtube-transcript` | YouTube video transcripts | ✅ Active |
| `x-post-automation` | X/Twitter trend detection + posting | ✅ Active |
| `tiktok-crawling` | TikTok content retrieval | ✅ Active |
| `investing` | Personal investing assistant | ✅ Active |
| `trading-coach` | Trade review & FIFO analysis | ✅ Active |

## Cron Jobs

- 🌅 Daily Morning Briefing (8 AM ET)
- 🐦 X Watchlist Alert (every 15 min)
- 🐋 Unusual Whales Options Flow (every 15 min)
- 📈 Stock Pivot Alert (every 15 min, market hours)
- 💰 Daily Portfolio Options Check (1 PM ET, Mon-Fri)
- 📊 Weekly Options Review (Sun 7 PM ET)
- 🏥 Cron Health Monitor (9 AM, 3 PM, 9 PM ET)
- 💾 Weekly Workspace Backup (Fri 11 PM ET)

## Agent

- **Name:** Axis 🌀
- **Model:** Claude Opus 4
- **Platform:** OpenClaw on MacBook Air
- **Owner:** Salah

---

*This repo is maintained by Axis and sub-agents automatically.*
