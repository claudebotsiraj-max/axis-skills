# Discord Channel Monitor — Unusual Whales

## Channel
- **Server**: Unusual Whales (ID: `710524439133028512`)
- **Channel**: #free-options-flow (ID: `1186354600622694400`)
- **URL**: https://discord.com/channels/710524439133028512/1186354600622694400
- **Access**: Browser-based (Salah's personal Discord login in openclaw browser)

## What It Posts
- 🔥 **Hot Contracts** — unusual volume on a single contract (overall volume spike)
- 🕑 **Interval Alerts** — 5-min interval volume spikes on a contract
- Each post includes: ticker, strike, expiry, DTE, side (ask/bid), volume, OI, Vol/OI ratio, OTM%, bid/ask %, premium, avg fill, multi-leg %

## Filtering Strategy
- **No filtering** — forward ALL new posts to Discord #general

## Dedup
- Track last seen message timestamp in `memory/uw-options-last.json`
