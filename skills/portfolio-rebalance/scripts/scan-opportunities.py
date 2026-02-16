# /// script
# requires-python = ">=3.11"
# dependencies = ["yfinance>=0.2.36", "rich>=13.7"]
# ///
"""
Opportunity Scanner — finds best CC/CSP trades matching strategy rules.
Scans options chains for optimal strikes at 0.15-0.20 delta, 30-45 DTE.
"""

import yfinance as yf
from rich.console import Console
from rich.table import Table
from datetime import datetime, timedelta
import json
import sys

console = Console()

# Holdings eligible for covered calls (need 100+ shares)
CC_CANDIDATES = {
    "TSLA":  6760,  # 67 contracts max
    "TSLL":  6000,  # 60 contracts max
    "PLTR":  900,   # 9 contracts max
    "NVDA":  525,   # 5 contracts max
    "TSM":   203,   # 2 contracts max
    "RKLB":  1000,  # 10 contracts max
    "AVGO":  201,   # 2 contracts max
    "AAPL":  203,   # 2 contracts max
    "GOOG":  151,   # 1 contract max
}

# CSP watchlist (quality names we'd own)
CSP_WATCHLIST = ["AMZN", "AMD", "SOFI", "HOOD", "MSFT", "META", "GOOGL"]

TARGET_DELTA_LOW = 0.15
TARGET_DELTA_HIGH = 0.20
TARGET_DTE_LOW = 30
TARGET_DTE_HIGH = 45
MIN_PREMIUM = 0.50  # minimum premium per share
CASH_BUFFER = 200_000


def get_earnings_date(ticker_obj):
    """Get next earnings date for a ticker."""
    try:
        cal = ticker_obj.calendar
        if cal is not None and hasattr(cal, 'iloc'):
            return cal.iloc[0, 0] if len(cal) > 0 else None
        elif isinstance(cal, dict) and 'Earnings Date' in cal:
            dates = cal['Earnings Date']
            return dates[0] if dates else None
    except Exception:
        pass
    return None


def find_optimal_strike(chain, target_delta_low, target_delta_high, option_type="call"):
    """Find the best strike within target delta range."""
    if chain is None or chain.empty:
        return None

    # Filter for reasonable volume
    chain = chain[chain['volume'] > 0] if 'volume' in chain.columns else chain
    
    best = None
    for _, row in chain.iterrows():
        delta = abs(row.get('delta', 0) or 0)
        if target_delta_low <= delta <= target_delta_high:
            premium = row.get('lastPrice', 0) or row.get('ask', 0) or 0
            if premium >= MIN_PREMIUM:
                if best is None or premium > best.get('premium', 0):
                    best = {
                        'strike': row['strike'],
                        'premium': premium,
                        'delta': delta,
                        'volume': row.get('volume', 0),
                        'openInterest': row.get('openInterest', 0),
                        'impliedVolatility': row.get('impliedVolatility', 0),
                        'bid': row.get('bid', 0),
                        'ask': row.get('ask', 0),
                    }
    return best


def scan_covered_calls():
    """Scan all holdings for covered call opportunities."""
    console.print("\n[bold cyan]📞 COVERED CALL OPPORTUNITIES[/bold cyan]\n")
    
    table = Table(show_header=True, header_style="bold green")
    table.add_column("Ticker")
    table.add_column("Price")
    table.add_column("Strike")
    table.add_column("DTE")
    table.add_column("Premium")
    table.add_column("Delta")
    table.add_column("Contracts")
    table.add_column("Total $")
    table.add_column("Earnings")
    
    results = []
    
    for ticker, shares in CC_CANDIDATES.items():
        try:
            t = yf.Ticker(ticker)
            price = t.info.get('regularMarketPrice') or t.info.get('currentPrice', 0)
            earnings = get_earnings_date(t)
            max_contracts = shares // 100
            
            # Get expiration dates in target range
            expirations = t.options
            now = datetime.now()
            
            for exp_str in expirations:
                exp_date = datetime.strptime(exp_str, "%Y-%m-%d")
                dte = (exp_date - now).days
                
                if TARGET_DTE_LOW <= dte <= TARGET_DTE_HIGH:
                    # Check earnings conflict
                    earnings_conflict = False
                    if earnings:
                        try:
                            if isinstance(earnings, str):
                                earnings_dt = datetime.strptime(earnings, "%Y-%m-%d")
                            else:
                                earnings_dt = earnings
                            if now < earnings_dt < exp_date:
                                earnings_conflict = True
                        except Exception:
                            pass
                    
                    chain = t.option_chain(exp_str)
                    best = find_optimal_strike(chain.calls, TARGET_DELTA_LOW, TARGET_DELTA_HIGH)
                    
                    if best:
                        total = best['premium'] * 100 * max_contracts
                        earnings_str = "⚠️ CONFLICT" if earnings_conflict else "✅ Clear"
                        
                        results.append({
                            'ticker': ticker,
                            'price': price,
                            'strike': best['strike'],
                            'dte': dte,
                            'premium': best['premium'],
                            'delta': best['delta'],
                            'contracts': max_contracts,
                            'total': total,
                            'earnings': earnings_str,
                            'conflict': earnings_conflict,
                            'expiration': exp_str,
                        })
                        
                        table.add_row(
                            ticker,
                            f"${price:.2f}",
                            f"${best['strike']:.0f}",
                            str(dte),
                            f"${best['premium']:.2f}",
                            f"{best['delta']:.3f}",
                            str(max_contracts),
                            f"${total:,.0f}",
                            earnings_str,
                        )
                    break  # take first valid expiration
                    
        except Exception as e:
            console.print(f"[red]Error scanning {ticker}: {e}[/red]")
    
    console.print(table)
    
    # Filter out earnings conflicts and summarize
    safe = [r for r in results if not r['conflict']]
    total_premium = sum(r['total'] for r in safe)
    console.print(f"\n[bold green]Total available premium (no earnings conflict): ${total_premium:,.0f}[/bold green]")
    
    return results


def scan_cash_secured_puts():
    """Scan watchlist for CSP opportunities when IVR is high."""
    console.print("\n[bold cyan]💵 CASH-SECURED PUT OPPORTUNITIES[/bold cyan]\n")
    
    table = Table(show_header=True, header_style="bold yellow")
    table.add_column("Ticker")
    table.add_column("Price")
    table.add_column("Strike")
    table.add_column("DTE")
    table.add_column("Premium")
    table.add_column("Delta")
    table.add_column("Collateral")
    table.add_column("IVR")
    
    for ticker in CSP_WATCHLIST:
        try:
            t = yf.Ticker(ticker)
            price = t.info.get('regularMarketPrice') or t.info.get('currentPrice', 0)
            
            expirations = t.options
            now = datetime.now()
            
            for exp_str in expirations:
                exp_date = datetime.strptime(exp_str, "%Y-%m-%d")
                dte = (exp_date - now).days
                
                if TARGET_DTE_LOW <= dte <= TARGET_DTE_HIGH:
                    chain = t.option_chain(exp_str)
                    best = find_optimal_strike(chain.puts, TARGET_DELTA_LOW, TARGET_DELTA_HIGH, "put")
                    
                    if best:
                        collateral = best['strike'] * 100
                        iv = best.get('impliedVolatility', 0) * 100
                        
                        table.add_row(
                            ticker,
                            f"${price:.2f}",
                            f"${best['strike']:.0f}",
                            str(dte),
                            f"${best['premium']:.2f}",
                            f"{best['delta']:.3f}",
                            f"${collateral:,.0f}",
                            f"{iv:.0f}%",
                        )
                    break
                    
        except Exception as e:
            console.print(f"[red]Error scanning {ticker}: {e}[/red]")
    
    console.print(table)


if __name__ == "__main__":
    console.print("[bold]📊 Portfolio Opportunity Scanner[/bold]")
    console.print(f"[dim]Run time: {datetime.now().strftime('%Y-%m-%d %H:%M ET')}[/dim]\n")
    
    cc_results = scan_covered_calls()
    scan_cash_secured_puts()
    
    # Output JSON for agent consumption
    if "--json" in sys.argv:
        print(json.dumps(cc_results, indent=2, default=str))
