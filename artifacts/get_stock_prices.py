import yfinance as yf
import json
from datetime import datetime

# Get all tickers from config
with open('memory/stock-alerts-config.json', 'r') as f:
    config = json.load(f)

tickers = list(config['tickers'].keys())
results = {}

for ticker in tickers:
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period='2d', interval='1d')
        
        if len(hist) >= 2:
            current_price = hist['Close'].iloc[-1]
            prev_close = hist['Close'].iloc[-2]
            change_pct = ((current_price - prev_close) / prev_close) * 100
        else:
            current_price = info.get('regularMarketPrice', info.get('currentPrice', 0))
            prev_close = info.get('regularMarketPreviousClose', 0)
            change_pct = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0
        
        volume = info.get('regularMarketVolume', info.get('volume', 0))
        avg_volume = info.get('averageVolume', 0)
        volume_ratio = volume / avg_volume if avg_volume else 0
        
        results[ticker] = {
            'price': round(current_price, 2) if current_price else None,
            'change_pct': round(change_pct, 2) if change_pct else None,
            'volume': volume,
            'volume_ratio': round(volume_ratio, 2) if volume_ratio else None,
            'prev_close': round(prev_close, 2) if prev_close else None
        }
    except Exception as e:
        results[ticker] = {'error': str(e)}

print(json.dumps(results, indent=2))
