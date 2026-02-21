import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

# The tickers mentioned in the prompt
watchlist = ['TSLA', 'PLTR', 'NVDA', 'RKLB', 'GOOG', 'TSM', 'AVGO', 'AAPL']

print("Starting portfolio check...")

for symbol in watchlist:
    try:
        t = yf.Ticker(symbol)
        
        # Current price
        info = t.info
        current_price = info.get('currentPrice')
        prev_close = info.get('previousClose')
        
        if not current_price:
            print(f"Skipping {symbol} (no price data)")
            continue
            
        pct_change = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0
        
        print(f"\n=== {symbol} ===")
        print(f"Price: ${current_price:.2f} ({pct_change:+.2f}%)")
        
        if abs(pct_change) > 5.0:
            print(f"⚠️  ALERT: >5% MOVE DETECTED ({pct_change:+.2f}%)")
            
        # Get options expirations for the next 7 days
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        
        expirations = t.options
        near_term = [e for e in expirations if today <= datetime.strptime(e, "%Y-%m-%d").date() <= next_week]
        
        if not near_term:
            print("No options expiring within 7 days.")
            continue
            
        for exp_date in near_term:
            print(f"Scanning options expiring: {exp_date}")
            chain = t.option_chain(exp_date)
            
            # CALLS
            for idx, row in chain.calls.iterrows():
                strike = row['strike']
                iv = row['impliedVolatility']
                volume = row['volume'] if not pd.isna(row['volume']) else 0
                oi = row['openInterest'] if not pd.isna(row['openInterest']) else 0
                bid = row['bid']
                ask = row['ask']
                last = row['lastPrice']
                in_the_money = row['inTheMoney']
                
                # Check for ITM approach (within 2.5%)
                dist_pct = (current_price - strike) / strike
                is_near_money = abs(dist_pct) < 0.025
                
                # Check for high IV (>50%) with decent liquidity
                is_high_iv = iv > 0.50 and (volume > 500 or oi > 1000)
                
                if is_near_money:
                    status = "ITM" if in_the_money else "OTM"
                    print(f"  [NEAR MONEY] Call ${strike} ({status}) | IV: {iv:.2%} | Vol: {volume}")

                if is_high_iv:
                     print(f"  [HIGH IV] Call ${strike} | IV: {iv:.2%} | Vol: {volume}")
                     
            # PUTS
            for idx, row in chain.puts.iterrows():
                strike = row['strike']
                iv = row['impliedVolatility']
                volume = row['volume'] if not pd.isna(row['volume']) else 0
                oi = row['openInterest'] if not pd.isna(row['openInterest']) else 0
                bid = row['bid']
                ask = row['ask']
                last = row['lastPrice']
                in_the_money = row['inTheMoney']

                # Check for ITM approach (within 2.5%)
                dist_pct = (strike - current_price) / current_price
                is_near_money = abs(dist_pct) < 0.025

                # Check for high IV (>50%) with decent liquidity
                is_high_iv = iv > 0.50 and (volume > 500 or oi > 1000)

                if is_near_money:
                    status = "ITM" if in_the_money else "OTM"
                    print(f"  [NEAR MONEY] Put ${strike} ({status}) | IV: {iv:.2%} | Vol: {volume}")

                if is_high_iv:
                     print(f"  [HIGH IV] Put ${strike} | IV: {iv:.2%} | Vol: {volume}")

    except Exception as e:
        print(f"Error checking {symbol}: {e}")
