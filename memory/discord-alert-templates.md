# Discord Alert Templates

## Stock Pivot Alert
```
📊 **Stock Pivot Alert**

\`\`\`
Ticker  Price     Chg%    Vol vs Avg  Trend  Level         Signal
────────────────────────────────────────────────────────────────────
NVDA    $183.34   -1.93%  1.3x ↑      ❌     50 SMA $184   ⚠️ Testing
AMZN    $198.50   -0.61%  0.8x        ❌     Supp $200     🔴 Below
TSLA    $415.81   -0.30%  0.9x        ↔️     50 SMA $390   ⚪ Holding
HOOD    $53.28    +8.06%  2.1x ↑↑     ✅     Res $52       🟢 Break
COIN    $271.91   +15.6%  3.4x ↑↑↑    ✅     Res $280      🟢 Approach
\`\`\`

[Actionable notes for triggered tickers]

✅ Uptrend  ❌ Downtrend  ↔️ Sideways
Vol: ↑↑↑ 3x+  ↑↑ 2x+  ↑ 1.2x+  (blank) normal

*Next check in 15 min*
```

### Signal Legend
- 🟢 Break — broke through resistance
- 🟡 Near — approaching key level
- 🔴 Below — broke support
- ⚠️ Testing — at critical level
- ⚪ Holding — no trigger

### Trend Icons
- ✅ Uptrend
- ❌ Downtrend
- ↔️ Sideways

## X Watchlist Alert
```
🐦 **X Watchlist Alert**

**@handle** (time ago)
[emoji] Brief summary of post
<link to tweet>
```

## Morning Briefing
- Full format in cron job prompt
- Sections: Calendar, Gmail, X/Twitter, Notion Tasks, Google Trends
- TL;DR at bottom with top 3 actions
