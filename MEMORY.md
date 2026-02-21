# MEMORY.md — Axis Index

> Lightweight index. Detail in memory/ subdirectories. Max 5 drill-downs per session.

## Always Load (active context)
- `memory/context/setup.md` — infra, Discord channels, known issues
- `memory/context/cron-jobs.md` — all scheduled jobs with IDs

## People
| File | Triggers | Summary |
|------|----------|---------|
| `memory/people/salah.md` | salah, phone, voice, preferences | Owner. PM, EST. TSLA/trading focus. |

## Projects
| File | Triggers | Summary |
|------|----------|---------|
| `memory/projects/portfolio.md` | stocks, options, TSLA, portfolio, trading, IRA | $4M IRA, 72% TSLA, options income strategy |
| `memory/projects/liberty-academy.md` | liberty, gymnastics, content, instagram, tiktok | RG school content pipeline, Postiz integration |
| `memory/projects/mission-control.md` | dashboard, mission control, convex | Next.js + Convex dashboard (built Feb 13) |
| `memory/projects/fundamental.md` | fundamental, business, webflow | Salah's business |

## Decisions
| File | Period |
|------|--------|
| `memory/decisions/2026-02.md` | Feb 2026 — all key decisions this month |
| `memory/2026-02-19.md` | System overhaul, model hierarchy, orchestrator mode |

## Operating Mode
- **Orchestrator pattern**: Axis plans, subagents execute. Don't do tasks directly — spawn subagents.
- **Model hierarchy (Feb 19)**: Flash (routine cron/subagents) → Sonnet (complex/fallback) → Kimi (free fallback)
- Gemini Flash is default for all subagents/cron since Feb 19
- Gemini API key in gateway config (google provider)

## Quick Reference
- Discord guild: `1471495542025486489`
- #general: `1471495542604562576` | #personal: `1472035483931508808`
- #stock-alert: `1472035598884667484` | #x-post: `1472035536532410552`
- #discord-alerts: `1473075200454164520` | #skills: `1472770409643376764`
- Salah Discord: `707726343252607029` | Bot: `1471493506634748070`
- GitHub: <https://github.com/claudebotsiraj-max/axis-skills>
- Notion API key: in TOOLS.md
- Brave Search API: in config + .env (needs gateway restart)

## Systems
- Reminders: `memory/reminders.md` — repeat until dismissed
- Expenses: `memory/expenses/YYYY-MM.md`
- X watchlist: `memory/x-watchlist.md` (20 accounts + 2 lists)
- Stock watchlist: `memory/stock-watchlist.md`
- Portfolio: `memory/portfolio-watchlist.md` + `memory/portfolio-analysis.md`
- Discord alerts: `memory/discord-alerts-last.json` (Insiders Trading + Ovtlyr)
- AI digest tracking: `memory/ai-digest-posted.json`
