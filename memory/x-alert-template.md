# X Watchlist Alert — Discord Message Template

## Format
```
🐦 **X Watchlist** — {date}, {time} ET

🔹 **{display_name}** • `@{handle}` • {count} post(s)

> {summary of tweet — keep it tight, 1-2 lines max}

🕐 {time} · <{link}>

> {summary of next tweet}

🕐 {time} · <{link}>

🔸 **{display_name}** • `@{handle}` • {count} post(s)

> {summary of tweet}

🕐 {time} · <{link}>

📬 **{total posts} posts** from **{total accounts} accounts**
```

## Rules
- **Group by sender** — all posts from same account together
- **Handle in backtick code format** — `@handle` makes it pop visually
- **Quote block** (`>`) for tweet content — gives it a left border, easier to scan
- **Blank line** between quote and timestamp for breathing room
- **Alternate diamond colors** — 🔹 🔸 between sender blocks for visual separation
- **Bold** the display name AND the footer stats
- **NO divider lines** around sender headers — just the handle line alone is enough
- **Include tweet time** (🕐) for every post
- **Wrap links** in `<>` to suppress Discord embeds
- **Post count** per sender in header
- **Summary footer** with total posts and accounts
- **Ticker symbols** — wrap in bold when mentioned: **$TSLA**, **$SPY**, etc.

## Sender Emojis (use in addition to 🔹/🔸 alternation)
- 🎯 Options/trading accounts (TJTheWheelDeal, smdcapital, GregProctor, RealSimpleAriel, etc.)
- 📊 Market analysis accounts (EliteOptions, blondebroker, colin_gladman, Todd_Sykon, etc.)
- 📈 Stock/market news (SawyerMerritt, unusual_whales, StockAlerts, tslaming, PolymarketIntel)
- 🚗 Tesla/EV accounts (truthandtesla, sa_futurist)
- 🎲 Prediction markets (Kalshi)
- 🧠 Tech/AI accounts (nerdalert, Boca_Bill_R)
- 🐦 Default/other

## Data Sources
- Notifications: https://x.com/notifications (openclaw browser)
- @StockAlerts list: https://x.com/i/lists/1478008405440794627
- Options list: https://x.com/i/lists/1608225337883648000
- Watchlist accounts: memory/x-watchlist.md
- Dedup tracking: memory/x-watchlist-last.json
