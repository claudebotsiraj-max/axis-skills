# /// script
# requires-python = ">=3.11"
# dependencies = ["yfinance>=0.2.36", "rich>=13.7"]
# ///
"""
Earnings Calendar — checks earnings dates for all held stocks,
flags conflicts with short options positions.
"""

import yfinance as yf
from rich.console import Console
from rich.table import Table
from datetime import datetime, timedelta
import json
import sys

console = Console()

# All tickers we hold or have options on
ALL_TICKERS = ["TSLA", "TSLL", "PLTR", "NVDA", "TSM", "RKLB", "AVGO", "AAPL", "GOOG",
               "OSCR", "AMZN", "AMD", "SOFI", "HOOD"]

# Active short options (update from portfolio-watchlist.md)
SHORT_OPTIONS = [
    {"ticker": "TSLA", "type": "call", "strike": 465, "expiry": "2026-02-27"},
    {"ticker": "TSLA", "type": "call", "strike": 475, "expiry": "2026-02-27"},
    {"ticker": "TSLA", "type": "call", "strike": 400, "expiry": "2026-03-20"},
    {"ticker": "GOOG", "type": "call", "strike": 315, "expiry": "2026-02-27"},
    {"ticker": "PLTR", "type": "call", "strike": 60, "expiry": "2026-12-18"},
    {"ticker": "AVGO", "type": "call", "strike": 230, "expiry": "2026-12-18"},
    {"ticker": "OSCR", "type": "call", "strike": 25, "expiry": "2026-03-20"},
]


def get_earnings_info(ticker_str):
    """Get next earnings date and estimate info."""
    try:
        t = yf.Ticker(ticker_str)
        cal = t.calendar
        
        earnings_date = None
        if cal is not None:
            if hasattr(cal, 'iloc') and len(cal) > 0:
                earnings_date = cal.iloc[0, 0]
            elif isinstance(cal, dict):
                dates = cal.get('Earnings Date', [])
                earnings_date = dates[0] if dates else None
        
        return {
            'ticker': ticker_str,
            'earnings_date': str(earnings_date) if earnings_date else "Unknown",
            'earnings_dt': earnings_date,
        }
    except Exception as e:
        return {
            'ticker': ticker_str,
            'earnings_date': f"Error: {e}",
            'earnings_dt': None,
        }


def check_conflicts(earnings_data):
    """Check if any short options span an earnings date."""
    console.print("\n[bold red]⚠️ EARNINGS vs SHORT OPTIONS CONFLICTS[/bold red]\n")
    
    conflicts = []
    now = datetime.now()
    
    for opt in SHORT_OPTIONS:
        ticker = opt['ticker']
        expiry = datetime.strptime(opt['expiry'], "%Y-%m-%d")
        
        # Find earnings for this ticker
        earn = next((e for e in earnings_data if e['ticker'] == ticker), None)
        if earn and earn['earnings_dt']:
            try:
                earn_dt = earn['earnings_dt']
                if isinstance(earn_dt, str):
                    earn_dt = datetime.strptime(earn_dt, "%Y-%m-%d")
                
                if now < earn_dt < expiry:
                    conflicts.append({
                        'ticker': ticker,
                        'option': f"${opt['strike']} {opt['type']}",
                        'expiry': opt['expiry'],
                        'earnings': str(earn_dt.date()) if hasattr(earn_dt, 'date') else str(earn_dt),
                        'action': "CLOSE BEFORE EARNINGS or ROLL PAST",
                    })
            except Exception:
                pass
    
    if conflicts:
        table = Table(show_header=True, header_style="bold red")
        table.add_column("Ticker")
        table.add_column("Short Option")
        table.add_column("Expiry")
        table.add_column("Earnings")
        table.add_column("Action")
        
        for c in conflicts:
            table.add_row(c['ticker'], c['option'], c['expiry'], c['earnings'], c['action'])
        
        console.print(table)
    else:
        console.print("[green]No earnings conflicts with current short options. ✅[/green]")
    
    return conflicts


if __name__ == "__main__":
    console.print("[bold]📅 Earnings Calendar & Conflict Check[/bold]")
    console.print(f"[dim]Run time: {datetime.now().strftime('%Y-%m-%d %H:%M ET')}[/dim]\n")
    
    # Fetch earnings for all tickers
    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Ticker")
    table.add_column("Next Earnings")
    table.add_column("Days Away")
    table.add_column("Status")
    
    earnings_data = []
    now = datetime.now()
    
    for ticker in ALL_TICKERS:
        info = get_earnings_info(ticker)
        earnings_data.append(info)
        
        days_away = ""
        status = ""
        if info['earnings_dt']:
            try:
                earn_dt = info['earnings_dt']
                if isinstance(earn_dt, str):
                    earn_dt = datetime.strptime(earn_dt, "%Y-%m-%d")
                delta = (earn_dt - now).days
                days_away = f"{delta}d"
                if delta <= 7:
                    status = "🔴 THIS WEEK"
                elif delta <= 14:
                    status = "🟡 Next 2 weeks"
                elif delta <= 30:
                    status = "🟢 This month"
                else:
                    status = "⚪ 30+ days"
            except Exception:
                status = "❓"
        else:
            status = "❓ Unknown"
        
        table.add_row(ticker, info['earnings_date'], days_away, status)
    
    console.print(table)
    
    # Check conflicts
    conflicts = check_conflicts(earnings_data)
    
    if "--json" in sys.argv:
        output = {
            'earnings': [{k: v for k, v in e.items() if k != 'earnings_dt'} for e in earnings_data],
            'conflicts': conflicts,
        }
        print(json.dumps(output, indent=2, default=str))
