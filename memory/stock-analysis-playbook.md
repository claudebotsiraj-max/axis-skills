# Stock Analysis & Research Playbook

> For a PM who trades options (wheel strategy) focused on Tesla, EVs, and tech stocks.
> Last updated: 2026-02-13

---

## 1. Quick Research URLs (Replace `{T}` with ticker)

### Price, Quote & Overview
| Source | URL |
|--------|-----|
| Yahoo Finance Quote | `https://finance.yahoo.com/quote/{T}` |
| Yahoo Key Stats | `https://finance.yahoo.com/quote/{T}/key-statistics` |
| Yahoo Financials | `https://finance.yahoo.com/quote/{T}/financials` |
| Yahoo Options Chain | `https://finance.yahoo.com/quote/{T}/options` |
| Yahoo Holders | `https://finance.yahoo.com/quote/{T}/holders` |
| Yahoo Analysis (estimates) | `https://finance.yahoo.com/quote/{T}/analysis` |
| Finviz Snapshot | `https://finviz.com/quote.ashx?t={T}` |
| MarketWatch Quote | `https://www.marketwatch.com/investing/stock/{T}` |
| Google Finance | `https://www.google.com/finance/quote/{T}:NASDAQ` |

### Options & Flow
| Source | URL |
|--------|-----|
| Barchart Options | `https://www.barchart.com/stocks/quotes/{T}/options` |
| Barchart Options by Expiry | `https://www.barchart.com/stocks/quotes/{T}/options?expiration={YYYY-MM-DD}` |
| Unusual Whales Stock | `https://unusualwhales.com/stock/{T}/overview` |
| Unusual Whales Flow | `https://unusualwhales.com/stock/{T}/flow` |
| Max Pain (Swaggystocks) | `https://swaggystocks.com/dashboard/options-max-pain/{T}` |
| CBOE Options | `https://www.cboe.com/delayed_quotes/{T}/quote_table` |

### Fundamentals & Filings
| Source | URL |
|--------|-----|
| SEC EDGAR (full-text search) | `https://efts.sec.gov/LATEST/search-index?q={T}` |
| SEC EDGAR Company Page | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={T}&type=&dateb=&owner=include&count=40` |
| SEC EDGAR Full-Text Search UI | `https://efts.sec.gov/LATEST/search-index?q={T}&forms=10-K,10-Q` |
| Macrotrends Revenue | `https://www.macrotrends.net/stocks/charts/{T}/{NAME}/revenue` |
| Macrotrends PE Ratio | `https://www.macrotrends.net/stocks/charts/{T}/{NAME}/pe-ratio` |
| Macrotrends FCF | `https://www.macrotrends.net/stocks/charts/{T}/{NAME}/free-cash-flow` |
| OpenInsider (insider trades) | `http://openinsider.com/screener?s={T}` |
| Finviz Insider Trading | `https://finviz.com/insidertrading.ashx?tc=1&b=1` |

### Screeners & Sector
| Source | URL |
|--------|-----|
| Finviz Screener | `https://finviz.com/screener.ashx` |
| Finviz Sector Map | `https://finviz.com/map.ashx` |
| TradingView Chart | `https://www.tradingview.com/chart/?symbol={T}` |
| Stockanalysis.com | `https://stockanalysis.com/stocks/{T}/` |

### Earnings
| Source | URL |
|--------|-----|
| Earnings Whispers | `https://www.earningswhispers.com/stocks/{T}` |
| Seeking Alpha Earnings | `https://seekingalpha.com/symbol/{T}/earnings` |
| Estimize (crowd estimates) | `https://www.estimize.com/tsla` |

### News & Sentiment
| Source | URL |
|--------|-----|
| Seeking Alpha | `https://seekingalpha.com/symbol/{T}` |
| Barron's | `https://www.barrons.com/quote/stock/{T}` |
| Finviz News | `https://finviz.com/quote.ashx?t={T}` (scroll to news) |

---

## 2. How to Use web_fetch for Research

### Quick Stock Check (do all at once)
```
1. web_fetch Yahoo Finance quote → price, PE, EPS, market cap, 52w range
2. web_fetch Finviz snapshot → technicals + fundamentals in one page
3. web_fetch Yahoo options chain → current premiums, IV
```

### Deep Dive
```
4. web_fetch Yahoo key-statistics → valuation, profitability, balance sheet
5. web_fetch Yahoo holders → institutional ownership, insider %, recent trades
6. web_fetch Macrotrends → historical revenue/earnings trends
7. web_fetch OpenInsider → recent insider buys/sells
8. web_fetch Barchart options → full chain with Greeks
```

### Tips
- **Finviz is the single best page** — one fetch gets you: price, P/E, P/S, P/B, EPS, revenue growth, margins, RSI, SMA 20/50/200, ATR, beta, short float, institutional ownership, insider ownership, target price, and news headlines
- **Yahoo Finance** is best for options chains and holder data
- **SEC EDGAR** blocks automated fetches (403) — use the EFTS search API or guide user to the URL
- **Macrotrends** needs the company name slug (e.g., `tesla`, `nvidia`) in the URL

---

## 3. Technical Analysis Reference

### Moving Averages
| Indicator | What It Tells You |
|-----------|-------------------|
| **50 SMA** | Medium-term trend. Price above = bullish. Popular institutional trigger. |
| **200 SMA** | Long-term trend. The "big picture" line. |
| **Golden Cross** | 50 SMA crosses above 200 SMA → bullish signal |
| **Death Cross** | 50 SMA crosses below 200 SMA → bearish signal |
| **9/21 EMA** | Short-term momentum. Good for swing trades. |

### Key Indicators
| Indicator | How to Read |
|-----------|-------------|
| **RSI** (14) | >70 = overbought, <30 = oversold. For TSLA, >80/<20 more meaningful due to momentum nature. |
| **MACD** | Signal line crossover = momentum shift. Histogram divergence from price = reversal warning. |
| **Bollinger Bands** | Price at upper band = stretched. Width contraction ("squeeze") → big move coming. |
| **Volume** | Confirm breakouts with above-average volume. Low-volume moves = suspect. |
| **ATR** | Average True Range = daily expected move. Use for stop-loss and strike selection. |
| **VWAP** | Volume-weighted average price. Day traders' reference. Institutional benchmark. |

### Chart Patterns (Action-Oriented)
| Pattern | What to Do |
|---------|------------|
| **Head & Shoulders** | Sell/short on neckline break. Measure head-to-neckline for target. |
| **Double Bottom** | Buy on neckline break with volume. Common reversal. |
| **Bull Flag** | Buy the breakout. Continuation pattern after strong move up. |
| **Ascending Triangle** | Bullish. Buy on flat resistance break. |
| **Descending Wedge** | Bullish reversal. Buy the breakout. |
| **Cup & Handle** | Bullish. Buy the handle breakout. |

### Support & Resistance
- **Round numbers** matter (TSLA: $400, $350, $300)
- **Previous earnings gaps** create levels
- **High-volume nodes** from volume profile = strong S/R
- **50/200 SMA** act as dynamic support/resistance
- **Finviz chart** shows SMA lines visually for quick read

---

## 4. Fundamental Analysis Reference

### Valuation Metrics
| Metric | What's Good | Notes |
|--------|-------------|-------|
| **P/E (TTM)** | Depends on sector. Tech: <30 reasonable, >50 = growth premium | TSLA typically trades 50-100x; it's a "story stock" |
| **Forward P/E** | More useful than TTM for growth stocks | Yahoo Analysis page has estimates |
| **P/S** | <10 for tech, <5 preferred for value | Revenue-based; useful when earnings are volatile |
| **P/B** | <3 for value. Less meaningful for tech/asset-light | |
| **PEG** | <1 = undervalued relative to growth. 1-2 = fair | Finviz shows this |
| **EV/EBITDA** | <15 = reasonable. Better than P/E for comparing across capital structures | |

### Profitability & Growth
| Metric | Where to Find | What Matters |
|--------|---------------|--------------|
| **Revenue Growth (YoY)** | Finviz, Yahoo, Macrotrends | Accelerating growth = bullish. Decelerating = caution. |
| **EPS Growth** | Yahoo Analysis | Beat/miss history matters for options around earnings |
| **Gross Margin** | Macrotrends, Yahoo Financials | Trend matters more than absolute. Declining = pricing pressure. |
| **Operating Margin** | Same | Shows operational leverage |
| **FCF** | Macrotrends, Yahoo | Positive and growing = can self-fund. Negative = dilution risk. |
| **Debt/Equity** | Finviz, Yahoo | <1 preferred. >2 = leveraged. Context matters (tech vs. utilities). |

### Ownership Signals
| Signal | What It Means | Where |
|--------|---------------|-------|
| **Insider buying (clusters)** | Very bullish — they know more than you | OpenInsider, Finviz, Yahoo Holders |
| **Insider selling** | Often routine (10b5-1 plans). Large unexpected sales = caution. | Same |
| **Institutional ownership increase** | Smart money accumulating | Yahoo Holders, 13F filings |
| **Short interest > 10%** | High short interest = squeeze potential OR fundamental problem | Finviz (Short Float) |

---

## 5. Options Analysis (Wheel Strategy Focus)

### The Wheel: Quick Review
```
1. SELL Cash-Secured Put (CSP) at a strike you'd happily own
2. If assigned → own shares at your desired price
3. SELL Covered Call (CC) above your cost basis
4. If called away → profit. Repeat from step 1.
5. Collect premium at every step.
```

### What Makes a Good Wheel Candidate
| Criteria | Why | Check |
|----------|-----|-------|
| **Stock you'd own long-term** | You WILL get assigned eventually | Do you believe in the company? |
| **High IV / options premium** | More premium = better returns | Barchart IV, Yahoo options |
| **Liquid options** | Tight bid-ask spreads | Bid-ask spread < 2% of premium |
| **$20-$500 stock price** | Capital efficient (100 shares manageable) | Yahoo quote |
| **Not in freefall** | Don't catch falling knives | Check RSI, trend, news |
| **Earnings not imminent** | Unless you want the volatility | Check earnings date |
| **Strong fundamentals** | Survive downturns | Positive FCF, manageable debt |

### Good Wheel Tickers (EV/Tech Focus)
- **TSLA** — High IV, liquid, you know it well. Capital-intensive ($40K+ per contract).
- **NVDA** — AI leader, great premium. Also capital-intensive.
- **AMD** — Good premium, more affordable than NVDA.
- **PLTR** — High IV, strong retail interest, affordable.
- **SOFI** — Affordable, decent IV.
- **RIVN** — EV play, affordable, but watch fundamentals.
- **MARA/MSTR** — Crypto-adjacent, very high IV (risky).

### CSP (Cash-Secured Put) Selection
| Parameter | Guideline |
|-----------|-----------|
| **Delta** | -0.20 to -0.30 (70-80% probability OTM) |
| **DTE** | 30-45 days optimal (theta decay accelerates) |
| **Strike** | At or below a support level you'd buy at |
| **Premium target** | 1-2% of capital at risk per month |
| **IV Rank** | >30 preferred. >50 = excellent for selling |
| **Earnings** | Avoid selling through earnings unless intentional |

### CC (Covered Call) Selection
| Parameter | Guideline |
|-----------|-----------|
| **Delta** | 0.20 to 0.30 (70-80% probability OTM) |
| **DTE** | 30-45 days |
| **Strike** | Above cost basis. Ideally above a resistance level. |
| **Premium target** | 1-2% of position value per month |
| **Earnings** | Consider selling CCs before earnings (IV crush benefits you) |

### Options Greeks — What They Mean for Sellers
| Greek | What It Tells You | Seller's Perspective |
|-------|-------------------|---------------------|
| **Delta** | Probability of expiring ITM (roughly). Directional risk. | Sell 0.20-0.30 delta. Lower = safer, less premium. |
| **Gamma** | Rate of delta change. Accelerates near expiration/ATM. | Avoid high gamma (ATM, short DTE). Can blow up fast. |
| **Theta** | Daily time decay. Positive for sellers! | Your best friend. Peaks 30-45 DTE. Accelerates last 2 weeks. |
| **Vega** | Sensitivity to IV changes. | Sell when IV is high (high vega = more premium). IV crush after events = profit. |

### IV Rank & IV Percentile
- **IV Rank**: Current IV vs. its 52-week range. IVR 50 = IV is at midpoint of its range.
- **IV Percentile**: % of days in past year that IV was lower than current. IVP 80 = IV higher than 80% of days.
- **Sell premium when IVR > 30** (ideally > 50). This is THE edge for options sellers.
- Find IVR on: Barchart, TastyTrade platform, Market Chameleon.

### Managing Positions
| Situation | Action |
|-----------|--------|
| **Option at 50% profit** | Close it. Don't get greedy. Redeploy capital. |
| **CSP going ITM** | Roll down and out (lower strike, further expiry) for credit. Or accept assignment. |
| **CC going ITM** | Roll up and out for credit. Or let shares get called away (profit). |
| **Assigned on CSP** | Start selling CCs immediately above cost basis. |
| **Stock drops significantly after assignment** | Sell CCs at/above cost basis even if far OTM. Be patient. Consider selling more CSPs below to average down. |
| **Earnings approaching** | Close or roll positions before earnings to avoid gap risk. |

### Max Pain
- The price at which the most options expire worthless (max pain for option buyers).
- Stocks tend to gravitate toward max pain by expiration (debated but useful reference).
- Check: `https://swaggystocks.com/dashboard/options-max-pain/{T}`
- Use as one data point for strike selection, not gospel.

---

## 6. Earnings Analysis Framework

### Pre-Earnings Checklist (1-2 weeks before)
- [ ] **Check date & time**: Before/after market? (Yahoo Finance, Earnings Whispers)
- [ ] **Consensus estimates**: Revenue & EPS expectations (Yahoo Analysis)
- [ ] **Whisper number**: What the street really expects (Earnings Whispers)
- [ ] **Historical beat/miss rate**: Does this company usually beat? By how much?
- [ ] **IV rank**: Is IV elevated enough to make an earnings play? (Usually is)
- [ ] **Expected move**: Options-implied move = ATM straddle price / stock price
- [ ] **Key metrics to watch**: For TSLA: deliveries, margins, energy revenue, FSD progress
- [ ] **Guidance**: Prior quarter's forward guidance — are they set up to beat?
- [ ] **Position check**: Close/adjust any existing options positions

### What to Look for in Earnings Results
1. **Revenue vs estimates** — beat/miss and by how much
2. **EPS vs estimates** — beat/miss
3. **Margins** — expanding or contracting? (Gross, operating)
4. **Guidance** — raised, maintained, or lowered? THIS MOVES STOCKS MORE THAN THE QUARTER.
5. **Key KPIs**: Deliveries (TSLA), subscribers (NFLX), users (META), etc.
6. **Cash flow**: Improving or deteriorating?
7. **Tone of earnings call**: Confident or hedging? New products or delays?

### Post-Earnings Plays
| Scenario | Action |
|----------|--------|
| **Gap up + good earnings** | Wait for consolidation. Sell CSPs on pullback. |
| **Gap down + good earnings (overreaction)** | Sell CSPs at support. Often the best opportunities. |
| **Gap down + bad earnings** | Wait. Don't catch the knife. Let it base. |
| **IV crush** | If you sold options before earnings, close for profit (IV crush = value drops). |

---

## 7. Sector & Macro Analysis

### Sector Rotation Model
```
Early Recovery:   Tech, Consumer Discretionary, Financials  ← BUY
Mid Expansion:    Industrials, Materials, Energy             ← HOLD
Late Expansion:   Energy, Utilities, Healthcare              ← REDUCE RISK
Recession:        Utilities, Healthcare, Consumer Staples    ← DEFENSIVE
```

### Key Macro Indicators
| Indicator | Where to Check | Why It Matters |
|-----------|----------------|----------------|
| **Fed Funds Rate** | fred.stlouisfed.org | Rate cuts = bullish growth/tech. Hikes = bearish. |
| **10Y Treasury Yield** | `https://finance.yahoo.com/quote/%5ETNX` | Rising yields = headwind for tech/growth. |
| **VIX** | `https://finance.yahoo.com/quote/%5EVIX` | Fear gauge. >20 = elevated fear (good for selling premium). >30 = consider reducing risk. |
| **CPI / PCE** | BLS.gov, FRED | Inflation data drives Fed policy. |
| **ISM Manufacturing** | ISM website | Leading indicator. <50 = contraction. |
| **Unemployment** | BLS.gov | Lagging but moves markets. |

### EV/Tech Sector Specific
| What to Watch | Why |
|---------------|-----|
| **EV delivery numbers** | Monthly/quarterly. TSLA, BYD, Rivian, Lucid. |
| **Battery costs** | Declining = margin expansion for EVs |
| **Charging infrastructure** | Policy + buildout progress |
| **AI capex** | NVDA, AMD, MSFT, GOOGL spending trends |
| **Semiconductor supply** | Chip shortages/surplus cycles |
| **China EV market** | BYD competition, tariffs, regulations |
| **Regulatory/policy** | EV credits, tariffs, EPA rules |

### Useful Sector Checks
- **Finviz sector map**: `https://finviz.com/map.ashx` — visual heat map of market
- **Sector ETFs**: XLK (tech), XLY (consumer disc), ARKK (innovation), QCLN (clean energy), LIT (lithium/battery)
- **TSLA peers on Finviz**: Auto-shows LI, XPEV, NIO, RIVN, LCID, TM, GM, F

---

## 8. Research Workflow Templates

### Quick Daily Check (5 min)
```
1. web_fetch Yahoo Finance quote/{T} → price, volume, any big moves
2. web_fetch Finviz snapshot → RSI, SMA position, any news
3. Check VIX level
```

### Pre-Trade Analysis (15 min)
```
1. Finviz snapshot → full fundamentals + technicals overview
2. Yahoo key-statistics → detailed valuation
3. Yahoo options chain → premium levels, IV
4. Barchart options → Greeks, IV rank
5. OpenInsider → recent insider activity
6. Check max pain for expiration week
7. Review support/resistance levels
```

### Earnings Week Research (30 min)
```
1. Yahoo Analysis → estimates, revisions, beat history
2. Earnings Whispers → whisper number, expected move
3. Seeking Alpha → recent analysis articles
4. Yahoo options chain → straddle price (expected move)
5. Historical earnings reactions (Google: "{TICKER} earnings history stock move")
6. Position review → close/adjust before event
```

### Wheel Candidate Screening
```
Finviz screener with:
- Market Cap > $10B (liquid)
- Option/Short: Optionable
- Average Volume > 1M
- Country: USA
- Sort by: Volatility (Week) or Performance
Then check each candidate:
- IVR > 30
- Options liquid (tight spreads)
- Fundamentals acceptable (positive FCF, manageable debt)
- Would you own 100 shares?
```

---

## 9. Risk Management Rules

1. **Never risk more than 5% of portfolio on a single position**
2. **Keep 20-30% cash** for assignments and opportunities
3. **Close winners at 50% profit** — redeploy capital
4. **Cut losers** — roll for credit or close at 2x premium received (e.g., sold for $2, close at $4)
5. **Don't sell CSPs through earnings** unless you explicitly want the volatility
6. **Diversify across sectors** — don't be 100% EV/tech
7. **Track your trades** — keep a journal of entries, exits, and lessons

---

## 10. Tesla-Specific Research Notes

### Key TSLA Resources
- Deliveries tracker: `https://ir.tesla.com` (quarterly reports)
- Energy deployments: Same IR page
- FSD progress: Watch YouTube reviewers, Tesla AI Day
- China sales: CPCA monthly data (search "Tesla China monthly sales")
- Supercharger network: Growing revenue source

### TSLA Wheel Considerations
- **Capital requirement**: ~$40K per contract (100 shares at ~$400)
- **IV is usually high**: Great for premium selling
- **Binary events**: Earnings, delivery reports, Elon tweets — create gaps
- **Support levels to watch**: 50 SMA, 200 SMA, round numbers ($400, $350, $300)
- **Earnings typically late Jan & late Apr/Jul/Oct**
- **Delivery numbers** released first week of each quarter month (Jan, Apr, Jul, Oct)

---

*This playbook is a living document. Update as you learn and as market conditions change.*
