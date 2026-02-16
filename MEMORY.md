# MEMORY.md — Axis Long-Term Memory

## Salah
- Project manager, Eastern timezone
- X: @salahsiraj — heavy Tesla/trading/EV focus
- Phone: +19172702468 (T-Mobile, scam block disabled)
- Notion workspace: "Cluadbot Siraj's Space" (openclaw bot connected)
- Discord guild: `1471495542025486489`
  - **#personal** (`1472035483931508808`) — email, calendar, appointments, reminders
  - **#stock-alert** (`1472035598884667484`) — stock pivot alerts, options flow
  - **#x-post** (`1472035536532410552`) — X/Twitter posts
  - **#general** (`1471495542604562576`) — trends, everything else

## Setup
- First session: 2026-02-12
- Identity: Axis 🌀 — sharp, direct, sci-fi themed
- Discord, X, Gmail, Calendar, Notion, TradingView all connected via openclaw browser
- Chrome relay extension broken — always use openclaw browser profile
- Browser doesn't survive MacBook sleep — kill stale Chrome + restart before cron runs

## Cron Jobs
- **Daily Morning Briefing** (`326c455b`) — 8 AM ET, checks Gmail/Calendar/X/Notion/Trends/Reminders/Expenses → Discord (split across channels)
- **X Watchlist Alert** (`c6a918d8`) — every 15 min → #x-post
- **Unusual Whales Options Flow** (`578e6806`) — every 15 min → #stock-alert (forwards ALL posts)
- **Stock Pivot Alert** (`1605299e`) — every 15 min Mon-Fri 8AM-5:45PM ET, skips holidays, always sends full table
- **Twilio Billing Reminder** (`ade00fd5`) — 15th of month, 10 AM ET
- **Mission Control Build Check** (`28c7893a`) — DISABLED (one-time use, complete)
- **Weekly Workspace Backup** (`10c208d8`) — Fridays 11 PM ET → zips workspace, sends to Discord #backup-bot (`1472080922739347592`)

## Accounts & Services
- **Personal email**: siraj.salah@gmail.com (browser u/1)
- **Bot email**: claudebotsiraj@gmail.com (browser u/0)
- N Greenberg forwards E*Trade alerts for "Nata" account (natasmiles@hotmail.com)
- librhythm.com = Liberty Academy of Rhythmic Gymnastics (WordPress/Wordfence)
- Fundamental = Salah's business (Webflow)
- Acorns, PayPal, Coinbase ($200 recurring ETH), SoFi, Gemini
- Life Time Florham Park gym member
- Citi Simplicity card (ending 1858)

## Phone/Voice
- Vapi.ai: Twilio NYC number +19175402881 (working)
- Idaho number +12085109585 (blocked by T-Mobile, don't use)
- Salah's voice clone: `YesQ8j2Xtut6bA4o4QpD` (11labs, from 1:15 sample)
- Old clone `cgcAWJbm66mPIgEYhwzo` needs deletion from Vapi dashboard
- **DO NOT call Salah to test without asking**

## Mission Control Dashboard
- Built 2026-02-13 at `mission-control/`
- Next.js 15 + Convex + Tailwind v4 + Framer Motion + ShadCN + TypeScript
- Convex deployment: `dutiful-hippopotamus-803` (dev), `adamant-orca-350` (prod)
- Convex account: claudebotsiraj@gmail.com
- 8 pages, 17 API routes, 6 Convex tables seeded
- Run: `cd mission-control && npm run dev`

## Systems
- Persistent reminders in `memory/reminders.md` — repeat until dismissed
- Expense tracking in `memory/expenses/YYYY-MM.md`
- X watchlist in `memory/x-watchlist.md` (7 accounts)
- Stock watchlist in `memory/stock-watchlist.md`

## Known Issues
- Bot Gmail blocked by age verification
- Browser unreliable after MacBook sleep
- Cron delivery to Discord: isolated jobs + message tool > announce mode

## Preferences
- Proactive behavior — suggest ideas, don't wait
- Stock alerts: market hours only, Mon-Fri, skip holidays
- X alerts: always include display name + @handle
- Reminders: keep repeating until explicitly dismissed
