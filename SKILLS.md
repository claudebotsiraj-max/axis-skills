# SKILLS.md — Axis Skill Manifest & SOP

## Operating Mode: Skill-Based Shell Agent

I am a hosted container, not a chat assistant. Before answering any question:
1. **Check if a skill exists** for this task
2. **Check if dependencies are installed** to execute it
3. **Run the skill** — don't describe what I'd do, DO it
4. If no skill exists and the task is repeatable, **create one**

## Hierarchy

### 1. The Shell
I am a runtime environment. My first instinct is to execute, not explain.
- Before answering: Can I run a script to get the real answer? Do it.
- Before guessing: Can I fetch live data? Fetch it.
- Before theorizing: Can I test it? Test it.

### 2. The Skills (`skills/`)
Every repeatable task gets encoded as a skill. Skills are self-contained with:
- `SKILL.md` — When to use, when NOT to use, dependencies, examples
- Scripts/tools needed to execute
- Negative examples (documented failures so I don't repeat them)

### 3. The Memory (Compaction)
When context gets long:
- Summarize state to `memory/YYYY-MM-DD.md`
- Save key artifacts to `artifacts/` (our handoff boundary)
- Update `MEMORY.md` with distilled learnings
- Never lose critical state — write it down before it compacts away

## Execution Rules

### Description Over Marketing
Skill docs tell you EXACTLY:
- ✅ When to use this skill
- ❌ When NOT to use it
- ⚠️ Known failure modes
- 📦 Dependencies required

### Artifacts First
All final outputs saved to `artifacts/`:
- Reports, generated content, exports → `artifacts/`
- Videos, images, media → `liberty/` or `artifacts/media/`
- Data files, CSVs, JSON → `artifacts/data/`
- This is the handoff boundary. If it's not in a file, it doesn't exist.

### Negative Examples (Failure Log)
Document every significant failure so future-me doesn't repeat it.

---

## Installed Skills Registry

### Finance & Trading
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `yahoo-finance` | Need stock prices, fundamentals, options chains, earnings | Need real-time intraday data (15min delay) | ✅ Ready |
| `crypto-market-data` | Need crypto prices, market cap, volume | Need historical chart data | ✅ Ready |
| `finance-news` | Need market news briefings, earnings summaries | Need real-time breaking news | ✅ Ready |
| `trading-coach` | Analyzing trade CSV exports, scoring entry/exit quality | Live trade execution | ✅ Ready |
| `investing` | ETF research, DCA calculations, portfolio allocation | US-specific tax advice (it's Lithuanian-focused) | ✅ Ready |

### Social Media
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `upload-post` | Posting content to any platform via API | Need to read/scrape posts | ✅ Ready |
| `instagram-scraper` | Scraping IG profiles, posts, follower data | Posting content | ✅ Ready |
| `tiktok-crawling` | Downloading/analyzing TikTok videos | Posting to TikTok | ✅ Ready |
| `x-post-automation` | Auto-generating and posting to X/Twitter | Reading X feed (use browser) | ✅ Ready |

### Research & Content
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `youtube-transcript` | Extracting/summarizing YouTube video content | Downloading video files | ✅ Ready |
| `reddit-readonly` | Monitoring subreddits, searching posts | Posting/commenting on Reddit | ✅ Ready |
| `google-trends` | Trending searches, keyword comparison, interest over time | Historical data beyond 5 years | ✅ Ready |
| `gemini-image-gen` | Generating images from text prompts | Photo editing/manipulation | ✅ Ready |

### Productivity
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `email-to-calendar` | Auto-extracting events from emails | Managing existing calendar events | ✅ Ready |

### Media Production
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `video-frames` | Extracting frames/clips from video files | Creating videos from scratch | ✅ Bundled |
| `nano-pdf` | Editing PDFs with natural language | Creating PDFs from scratch | ✅ Bundled |
| Liberty Video Pipeline | Creating slide-based video carousels | Complex video editing with effects | ✅ Custom |

### System
| Skill | Use When | Don't Use When | Status |
|-------|----------|---------------|--------|
| `phone-call` | Making/receiving calls via Vapi/Twilio | SMS (use Twilio API directly) | ✅ Ready |
| `weather` | Current weather and forecasts | Historical weather data | ✅ Bundled |
| `healthcheck` | Security audits, system hardening | Application-level debugging | ✅ Bundled |

---

## Custom Skills (Built by Axis)

### Liberty Video Pipeline
- **Location**: `liberty/slides/`
- **Use when**: Creating Instagram/TikTok carousel videos for Liberty Academy
- **Pipeline**: HTML slides → CDP capture (port 18800) → PNG → ffmpeg stitch → music overlay
- **Dependencies**: Node.js, ws module, ffmpeg, openclaw browser running
- **Photo source**: `~/Claudebot WF/Liberty/Liberty photos/` (449 jpeg, 37 mov)
- **Style**: 1080x1920, gradient overlay ~38% opacity, white bold text, Liberty Academy badge
- **Known failures**:
  - ❌ Overlay opacity too high (>60%) washes out photos — keep at 35-40%
  - ❌ First sub-agent attempt didn't execute (just planned) — always say "EXECUTE EVERYTHING"
  - ❌ sed batch replacements miss values outside expected ranges — use Python regex instead
  - ❌ Image tool can't read files outside workspace — copy to workspace first

### Morning Briefing
- **Cron**: `326c455b` — 8 AM ET daily
- **Checks**: Gmail, Calendar, X, Notion, Trends, Reminders, Expenses, Notion sync
- **Delivers to**: Discord channels (personal, x-post, general)

### Stock Pivot Alert
- **Cron**: `1605299e` — every 15 min, market hours only
- **Known failures**:
  - ❌ Browser-based TradingView screenshots timeout — use snapshot instead
  - ❌ 120s timeout too short — bumped to 180s

---

## Failure Log

| Date | Task | Failure | Fix | Lesson |
|------|------|---------|-----|--------|
| 2026-02-13 | Stock Pivot Alert | Browser screenshot timeout | Switched to snapshot, bumped timeout 180s | Browser screenshots unreliable for cron |
| 2026-02-14 | ClawHub skill install | Rate limit (3/min) | Add 15-60s delays between installs | ClawHub rate limits aggressively |
| 2026-02-14 | Sub-agent video build | Completed in 91ms, did nothing | Added explicit "EXECUTE EVERYTHING" instruction | Sub-agents need explicit action commands |
| 2026-02-14 | Image tool access | "Not under allowed directory" | Copy files into workspace | Image tool sandboxed to specific dirs |
| 2026-02-14 | Discord file upload | "Not under allowed directory" | Use local file server or `open` command | Message tool file paths also sandboxed |
| 2026-02-15 | Video overlay opacity | Photos washed out, too faint | Reduced from 65-88% to 38% | Keep overlays ≤40% for photo visibility |
| 2026-02-15 | Batch sed opacity fix | Only fixed first slide, rest unchanged | Used Python regex for comprehensive fix | sed misses values outside expected patterns |
| 2026-02-14 | OpenClaw self-update | EACCES permission denied | Needs `sudo` — can't escalate from agent | System updates require user's Terminal |
| 2026-02-14 | Browser after sleep | Stale Chrome processes | Kill Chrome + restart browser | MacBook sleep kills browser silently |

---

## Dependency Check Protocol

Before executing any skill:
```
1. Is the skill installed? → ls skills/<name>/
2. Are dependencies met? → Check SKILL.md requirements
3. Is the browser needed? → browser status (profile=openclaw)
4. Is ffmpeg needed? → which ffmpeg
5. Is a Node module needed? → Check package.json in skill dir
6. Is an API key needed? → Check TOOLS.md
```

## Artifact Locations

| Type | Path |
|------|------|
| Daily memory | `memory/YYYY-MM-DD.md` |
| Long-term memory | `MEMORY.md` |
| Expenses | `memory/expenses/YYYY-MM.md` |
| Reminders | `memory/reminders.md` |
| Stock watchlist | `memory/stock-watchlist.md` |
| X watchlist | `memory/x-watchlist.md` |
| Social playbook | `memory/social-media-playbook.md` |
| Liberty content | `liberty/` |
| Liberty photos | `~/Claudebot WF/Liberty/Liberty photos/` |
| Mission Control | `mission-control/` |
| Backups | `~/Desktop/openclaw-backup-*` + Discord #backup-bot |
| Notion Session Notes | DB `307db8f6-06d4-819f-8cdd-f4aa8a85ac50` |
