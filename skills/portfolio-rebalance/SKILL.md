---
name: portfolio-rebalance
description: Automated portfolio rebalancing and options income management for Salah's $4M+ Rollover IRA. Runs position checks, scans for CC/CSP opportunities, monitors risk, and produces Discord-formatted reports.
triggers: ["portfolio report", "rebalance check", "options scan", "position check", "premium report"]
---

# Portfolio Rebalance Skill

Automated options income management for a $4M+ Rollover IRA focused on covered calls, cash-secured puts, and premium harvesting.

## Dependencies

- Python 3.11+ with `uv`
- Yahoo Finance skill (`skills/yahoo-finance/yf`) for market data
- `yfinance` library (auto-installed via uv inline metadata)

## Strategy Rules (Salah's IRA)

### Portfolio Parameters
- **Account**: $4M+ Rollover IRA (tax-deferred, no wash sale concerns)
- **Core position**: TSLA — maintain minimum 3,000 shares
- **Target TSLA weight**: 25-40% (flag if >40%)
- **Cash buffer**: $200K minimum (5% of portfolio)
- **Monthly premium target**: $8,000 - $15,000

### Covered Call Rules
- **Delta**: 0.15-0.20 (probability of profit ~80-85%)
- **DTE**: 30-45 days to expiration
- **Close**: at 50% profit
- **Roll**: at 21 DTE if still OTM
- **NEVER sell calls through earnings** — check earnings dates before every trade
- **Tranching**: For large positions (TSLA), sell in 2-3 tranches at different strikes/dates

### Cash-Secured Put Rules
- **When**: IVR > 50 on quality names
- **Delta**: 0.15-0.20 (10-15% OTM)
- **DTE**: 30-45 days
- **Sizing**: Only deploy cash above $200K buffer
- **Close**: at 50% profit
- **Quality filter**: Only sell puts on stocks you'd own (analyst consensus buy, strong fundamentals)

### Position Management
- **Close winners**: 50% profit target
- **Roll losers**: At 21 DTE if still OTM, roll same delta 30 days out for credit
- **Deep ITM shorts**: Roll up and out if possible for credit, or take loss to free shares
- **Max single stock**: 40% of portfolio (TSLA currently over — trim via CC assignment or sales)

## Current Holdings (sync from memory/portfolio-watchlist.md)

| Ticker | Shares | ~Weight | Role |
|--------|--------|---------|------|
| TSLA | 6,760 | ~70% | Core — trimming via CCs |
| TSLL | 6,000 | ~2.4% | Leveraged TSLA exposure |
| PLTR | 900 | ~2.9% | Growth/AI |
| NVDA | 525 | ~2.4% | AI/Semis |
| TSM | 203 | ~1.8% | Semis |
| RKLB | 1,000 | ~1.7% | Space/Defense |
| AVGO | 201 | ~1.6% | AI/Semis |
| AAPL | 203 | ~1.3% | Mega-cap |
| GOOG | 151 | ~1.1% | Mega-cap |

## Automated Checks

### 1. Position Sizing
Flag any single stock > 40% of portfolio value. Track TSLA weight trend over time.

### 2. Delta Management
Alert if any short option delta exceeds 0.40 (becoming too directional).

### 3. Gamma Risk
Flag positions within 7 DTE with high gamma — these need immediate action (close/roll).

### 4. IV Rank Screening
Scan watchlist for IVR > 50 — premium selling opportunities. Higher IVR = fatter premiums.

### 5. Expiration Calendar
List all expirations in next 30 days with recommended action (close/roll/let expire).

### 6. Roll Recommendations
When a position hits 21 DTE and is still OTM: suggest new strike, expiration, and expected credit.

### 7. New Trade Scanner
Find best CC/CSP opportunities matching strategy rules across all holdings + watchlist.

### 8. Earnings Guard
Before recommending any covered call, verify no earnings within the option's DTE. Block the trade if earnings conflict.

### 9. Cash Utilization
If cash > $200K, recommend CSP deployments. If cash < $200K, flag and avoid new CSPs.

### 10. Concentration Monitor
Track TSLA weight weekly. Calculate how many shares need to be sold/called-away to reach 40% target.

## Scripts

### check-positions.py
Pulls current prices, options chains, and Greeks for all positions.
```bash
uv run skills/portfolio-rebalance/scripts/check-positions.py
```

### scan-opportunities.py
Scans for new CC/CSP trades matching strategy rules.
```bash
uv run skills/portfolio-rebalance/scripts/scan-opportunities.py
```

### earnings-calendar.py
Checks earnings dates for all held stocks, flags conflicts with short options.
```bash
uv run skills/portfolio-rebalance/scripts/earnings-calendar.py
```

## Usage

### Full Portfolio Report
```bash
# Run all three scripts in sequence
uv run skills/portfolio-rebalance/scripts/check-positions.py
uv run skills/portfolio-rebalance/scripts/scan-opportunities.py
uv run skills/portfolio-rebalance/scripts/earnings-calendar.py
```

### Quick Position Check
```bash
uv run skills/portfolio-rebalance/scripts/check-positions.py
```

## Output Format (Discord)

When triggered, produce this format:

```
📊 **Portfolio Rebalance Report** — {date}

💰 **Portfolio Value**: ${total} | Cash: ${cash} ({pct}%)
⚖️ **TSLA Weight**: {pct}% (target: 25-40%)

🟢🟡🔴 **Position Health**
- 🟢 GOOG — 1.1% weight, no issues
- 🟡 TSLA — 70% weight ⚠️ CONCENTRATION
- 🔴 PLTR $60 CC — deeply ITM, action needed

📅 **Upcoming Expirations**
- Feb 20: 4x NVDA $160 long calls — SELL TUESDAY
- Feb 27: 3x TSLA $465 CC, 5x TSLA $475 CC — monitor

⚡ **Actionable Trades**
- SELL 30x TSLA Mar 7 $440 CC @ ~$9 = ~$27K
- SELL 9x PLTR Mar 21 $145 CC @ ~$4.50 = ~$4K
- SELL 1x AMZN Mar 21 $185 CSP @ ~$3.50 = $350

⚠️ **Risk Alerts**
- TSLA concentration: 70% (max 40%) — trim 2,760 shares over 6 months
- PLTR $60 CC: $35K underwater — consider rolling to Jan '27 $100
- NVDA earnings Feb 25 — NO covered calls until after

📈 **Premium Tracking**
- This week: $X collected
- MTD: $X collected
- Target: $8-15K/month
```

## Maintenance
- Update `memory/portfolio-watchlist.md` after every trade
- Review strategy rules quarterly
- Adjust delta targets based on market regime (tighter in high-vol, wider in low-vol)
