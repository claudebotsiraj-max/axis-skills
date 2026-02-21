import json
from datetime import datetime

# Load config
with open('memory/stock-alerts-config.json', 'r') as f:
    config = json.load(f)

# Current prices from yfinance
prices = {
    "AAPL": {"price": 263.88, "change_pct": 3.17, "volume_ratio": 1.19},
    "GOOG": {"price": 302.82, "change_pct": -1.05, "volume_ratio": 0.97},
    "AMZN": {"price": 201.15, "change_pct": 1.19, "volume_ratio": 1.37},
    "NVDA": {"price": 184.97, "change_pct": 1.18, "volume_ratio": 0.88},
    "AMD": {"price": 203.08, "change_pct": -2.05, "volume_ratio": 0.85},
    "AVGO": {"price": 332.54, "change_pct": 2.27, "volume_ratio": 0.67},
    "MU": {"price": 399.78, "change_pct": -2.89, "volume_ratio": 0.86},
    "TSM": {"price": 364.2, "change_pct": -0.59, "volume_ratio": 0.76},
    "TSLA": {"price": 410.63, "change_pct": -1.63, "volume_ratio": 0.85},
    "HOOD": {"price": 75.44, "change_pct": -0.7, "volume_ratio": 1.11},
    "COIN": {"price": 166.02, "change_pct": 1.03, "volume_ratio": 1.59},
    "NBIS": {"price": 97.52, "change_pct": -0.5, "volume_ratio": 0.81},
    "CRWV": {"price": 91.0, "change_pct": -5.25, "volume_ratio": 0.59},
    "CRCL": {"price": 61.62, "change_pct": 2.63, "volume_ratio": 0.78}
}

alerts = []
all_data = []

for ticker, data in prices.items():
    cfg = config['tickers'][ticker]
    price = data['price']
    change = data['change_pct']
    vol_ratio = data['volume_ratio']
    threshold = cfg.get('alertThreshold', 0.02)
    
    # Determine trend
    trend = "✅" if change > 0 else "❌" if change < 0 else "↔️"
    
    # Find nearest level and signal
    level_info = "—"
    signal = "⚪ Hold"
    alert_reason = []
    
    # Check for >3% moves
    if abs(change) >= 3.0:
        alert_reason.append(f"{change:+.1f}% move")
        signal = "🔴 Break" if change > 0 else "🔴 Break"
    
    # Check SMA crossings/proximity
    sma50 = cfg.get('sma50')
    sma200 = cfg.get('sma200')
    
    if sma50:
        diff_sma50 = abs(price - sma50) / price
        if diff_sma50 <= threshold:
            level_info = f"SMA50 ${sma50:.2f}"
            if diff_sma50 <= 0.01:
                signal = "⚠️ Test"
                alert_reason.append("Testing 50 SMA")
            else:
                signal = "🟡 Near"
                alert_reason.append(f"Near 50 SMA ({diff_sma50*100:.1f}%)")
    
    if sma200 and signal == "⚪ Hold":
        diff_sma200 = abs(price - sma200) / price
        if diff_sma200 <= threshold:
            level_info = f"SMA200 ${sma200:.2f}"
            if diff_sma200 <= 0.01:
                signal = "⚠️ Test"
                alert_reason.append("Testing 200 SMA")
            else:
                signal = "🟡 Near"
                alert_reason.append(f"Near 200 SMA")
    
    # Check supports/resistances
    if signal == "⚪ Hold":
        all_levels = []
        for s in cfg['supports']:
            all_levels.append(('S', s))
        for r in cfg['resistances']:
            all_levels.append(('R', r))
        
        nearest_level = None
        nearest_dist = float('inf')
        nearest_type = None
        
        for lvl_type, lvl_price in all_levels:
            dist = abs(price - lvl_price) / price
            if dist < nearest_dist:
                nearest_dist = dist
                nearest_level = lvl_price
                nearest_type = lvl_type
        
        if nearest_dist <= threshold:
            level_info = f"{nearest_type} ${nearest_level}"
            if nearest_dist <= 0.01:
                signal = "⚠️ Test"
                alert_reason.append(f"Testing {nearest_type} ${nearest_level}")
            else:
                signal = "🟡 Near"
                alert_reason.append(f"Near {nearest_type} ${nearest_level}")
        elif nearest_dist <= 0.05:
            level_info = f"{nearest_type} ${nearest_level}"
            signal = "🟢 Appr"
    
    # Create row
    vol_str = f"{vol_ratio:.1f}x" if vol_ratio else "—"
    row = {
        'ticker': ticker,
        'price': price,
        'change_pct': change,
        'volume': vol_str,
        'trend': trend,
        'level': level_info,
        'signal': signal,
        'alert': len(alert_reason) > 0,
        'reason': ' | '.join(alert_reason) if alert_reason else ''
    }
    all_data.append(row)
    
    if row['alert']:
        alerts.append(row)

# Sort by change_pct descending
all_data.sort(key=lambda x: x['change_pct'], reverse=True)

# Generate output
now = datetime.now()
date_str = now.strftime("%b %d, %Y")
time_str = now.strftime("%H:%M")

print(f"📊 **Stock Pivot Alert** — {date_str}, {time_str} ET")
print("```")
print(f"{'Ticker':<6} {'Price':>8} {'Chg%':>7} {'Vol':>6} {'Trend':<4} {'Level':<16} {'Signal':<8}")
print("─" * 63)

for row in all_data:
    price_str = f"${row['price']:.2f}"
    chg_str = f"{row['change_pct']:+.2f}%"
    print(f"{row['ticker']:<6} {price_str:>8} {chg_str:>7} {row['volume']:>6} {row['trend']:<4} {row['level']:<16} {row['signal']:<8}")

print("```")

# Alert summary
if alerts:
    highlights = [f"{a['ticker']}: {a['reason']}" for a in alerts[:3]]
    print(f"\n🔔 {len(alerts)} active alerts | {' | '.join(highlights)}")
else:
    print("\n🔔 No active alerts | All positions within normal ranges")

# Save results for config update
with open('artifacts/stock_analysis.json', 'w') as f:
    json.dump({'prices': prices, 'alerts': alerts, 'all_data': all_data}, f, indent=2)
