# Stock Pivot Alert — Discord Message Template

## Format
```
📊 **Stock Pivot Alert** — {date}, {time} ET

\```
Ticker   Price     Chg%     Vol   Trend  Level          Signal
───────────────────────────────────────────────────────────────
COIN    $165.96  +17.63%   3.4x   ✅    Res $190       🟡 Near
AMAT    $357.71   +8.93%   2.8x   ✅    —              ⚪ Hold
NBIS    $ 97.04   +8.15%   1.9x   ✅    Res $110       🟡 Near
HOOD    $ 76.49   +7.54%   2.1x   ✅    Res $90        🟢 Appr
...
VIX     $ 19.98   -4.03%   —      ❌    —              ⚪ Hold
AMKR    $ 48.49   -6.01%   1.8x   ❌    —              ⚪ Hold
\```
🔔 {count} alerts | {key highlights}
```

## Sorting
- **ALWAYS sort by Chg% DESCENDING** (biggest gainers on top, biggest losers on bottom)

## Columns
| Column | Description |
|--------|------------|
| Ticker | Stock symbol |
| Price  | Current price (right-align with $) |
| Chg%   | Daily % change |
| Vol    | Relative volume vs average (e.g. 1.3x = 130% of avg). Use — if unavailable |
| Trend  | ✅ (up/bullish) ❌ (down/bearish) ↔️ (sideways/neutral) |
| Level  | Nearest key support, resistance, or SMA from stock-alerts-config.json |
| Signal | See signal legend below |

## Signal Legend
| Signal | Meaning |
|--------|---------|
| 🟢 Appr | Approaching key level (within 5%) |
| 🟡 Near | Near key level (within 2%) |
| ⚠️ Test | Testing/touching key level |
| 🔴 Break | Broke through key level |
| ⚪ Hold | No signal / normal range |

## Footer
- Show alert count
- Highlight most notable signals (e.g. "NVDA testing 50 SMA | GOOG near $300 support")

## Data Sources
- Prices: TradingView "Openclaw" watchlist (https://www.tradingview.com/chart/IY77feDs/)
- Levels: memory/stock-alerts-config.json
- Context: memory/stock-watchlist.md
