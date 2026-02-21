# /// script
# requires-python = ">=3.11"
# dependencies = ["yfinance"]
# ///
import yfinance as yf
import json
import sys

tickers = ['AAPL', 'GOOG', 'AMZN', 'NVDA', 'AMD', 'AVGO', 'MU', 'TSM', 'TSLA', 'HOOD', 'COIN', 'NBIS', 'CRWV', 'CRCL']
results = {}

for t in tickers:
    try:
        stock = yf.Ticker(t)
        hist = stock.history(period='2d')
        if len(hist) >= 2:
            current = hist['Close'].iloc[-1]
            prev = hist['Close'].iloc[-2]
            change_pct = ((current - prev) / prev) * 100
            volume = hist['Volume'].iloc[-1]
            vol_avg = stock.info.get('averageVolume', 0)
            rel_vol = volume / vol_avg if vol_avg > 0 else 1.0
            
            results[t] = {
                'price': round(current, 2),
                'change_pct': round(change_pct, 2),
                'volume': int(volume),
                'rel_volume': round(rel_vol, 1)
            }
    except Exception as e:
        print(f'Error for {t}: {e}', file=sys.stderr)

print(json.dumps(results, indent=2))
