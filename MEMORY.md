# MEMORY.md — Axis Index 🌀

> **This is an index.** Detail lives in `memory/` subdirectories. Drill down on demand.

## Always Load
- `memory/people/salah.md` — owner context (load when any conversation)
- `memory/context/cron-jobs.md` — load when cron/scheduling topics arise

## People

| File | Triggers | Summary |
|---|---|---|
| `memory/people/salah.md` | salah, owner, phone, discord, preferences | Owner, PM, Eastern TZ, @salahsiraj |

## Projects

| File | Triggers | Summary |
|---|---|---|
| `memory/projects/mission-control.md` | mission control, dashboard, convex, next.js | Next.js 15 + Convex dashboard |
| `memory/projects/liberty-academy.md` | liberty, gymnastics, librhythm, instagram, tiktok | Rhythmic gymnastics academy site |
| `memory/projects/fundamental.md` | fundamental, webflow, salah business | Salah's business (Webflow) |

## Context

| File | Triggers | Summary |
|---|---|---|
| `memory/context/setup.md` | setup, browser, identity, systems, issues | Axis identity, connected services, known issues |
| `memory/context/cron-jobs.md` | cron, schedule, alert, briefing, backup | 7 cron jobs (morning brief, stocks, X, backup) |
| `memory/context/accounts.md` | account, email, vapi, phone, financial, postiz | All accounts & services |

## Decisions

| File | Triggers | Summary |
|---|---|---|
| `memory/decisions/2026-02.md` | decision, why, history, february | Feb 2026 key decisions |

## Quick Reference
- **Discord guild**: `1471495542025486489`
- **#general**: `1471495542604562576`
- **#personal**: `1472035483931508808`
- **#stock-alert**: `1472035598884667484`
- **#x-post**: `1472035536532410552`
- **Salah phone**: +19172702468
- **Vapi/Twilio**: +19175402881
- **Bot email**: claudebotsiraj@gmail.com
- **Personal email**: siraj.salah@gmail.com

## Drill-Down Rules
1. Session start: load this index only (~1.5K tokens)
2. Auto-drill when conversation matches trigger keywords
3. Max 5 drill-downs at session start
4. Always update index when changing detail files (same commit)
5. Keep index under 3K tokens — archive inactive items
