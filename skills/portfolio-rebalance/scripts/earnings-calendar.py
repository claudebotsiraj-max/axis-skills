# /// script
# requires-python = ">=3.11"
# dependencies = ["yfinance>=0.2.36", "rich>=13.7"]
# ///
"""
Earnings Calendar — checks earnings dates for all held stocks and flags
conflicts with short option positions.
"""

import yfinance as yf
from rich.console import Console
from datetime import datetime, timedelta

console = Console()

# All tickers to check (holdings + watchlist + short option underlyings)
TICKERS = ["TSLA", "PLTR", "NVDA", "TSM", "RKLB", "AVGO", "AAPL", "GOOG",
           "AMZN", "AMD", "SOFI", "HOOD", "HIMS", "TSLL"]

# Short calls that could conflict with earnings
SHORT_CALLS = [
    ("PLTR", 60,  "2026-12-18"),
    ("AVGO", 230, "2026-12-18"),
    ("TSLA", 465, "2026-02-27"),
    ("TSLA", 475, "2026-02-27"),
    ("TSLA", 580, "2026-07-17"),
    ("TSLA", 700, "2026-09-18"),
    ("TSLA", 700, "2027-01-15"),
    ("TSLA", 750, "2027-01-15"),
    ("RKLB", 105, "2026-07-17"),
    ("RKLB", 115, "2026-07-17"),
    ("PLTR", 100, "2027-06-18"),
    ("HIMS", 65,  "2027-01-15"),
]

def get_earnings_dates():
    """Fetch next earnings date for each ticker."""
    earnings = {}
    today = datetime.now().date()

    for ticker in TICKERS:
        try:
            t = yf.Ticker(ticker)
            # Try calendar first
            cal = t.calendar
            if cal is not None:
                if isinstance(cal, dict):
                    date = cal.get("Earnings Date")
                    if isinstance(date, list) and date:
                        date = date[0]
                    if hasattr(date, "date"):
                        date = date.date()
                    elif isinstance(date, str):
                        date = datetime.strptime(date, "%Y-%m-%d").date()
                    earnings[ticker] = date
                    continue

            # Fallback: try earnings_dates
            ed = t.earnings_dates
            if ed is not None and not ed.empty:
                future = [d.date() for d in ed.index if d.date() >= today]
                if future:
                    earnings[ticker] = min(future)
                    continue

            earnings[ticker] = None
        except Exception as e:
            console.print(f"[dim]Could not get earnings for {ticker}: {e}[/dim]")
            earnings[ticker] = None

    return earnings

def check_conflicts(earnings):
    """Check if any short call has earnings within its DTE."""
    today = datetime.now().date()
    conflicts = []

    for ticker, strike, expiry_str in SHORT_CALLS:
        expiry = datetime.strptime(expiry_str, "%Y-%m-%d").date()
        earn_date = earnings.get(ticker)

        if earn_date and today <= earn_date <= expiry:
            days_to_earnings = (earn_date - today).days
            conflicts.append({
                "ticker": ticker,
                "strike": strike,
                "expiry": expiry_str,
                "earnings": str(earn_date),
                "days_to_earnings": days_to_earnings,
            })

    return conflicts

def main():
    console.print("[bold blue]Checking earnings calendar...[/bold blue]")
    today = datetime.now().date()
    earnings = get_earnings_dates()

    print(f"\n📅 **Earnings Calendar** — {today}\n")

    # Sort by date
    dated = [(t, d) for t, d in earnings.items() if d is not None]
    dated.sort(key=lambda x: x[1])
    undated = [t for t, d in earnings.items() if d is None]

    # Next 60 days
    print("**Upcoming (next 60 days):**")
    for ticker, date in dated:
        days = (date - today).days
        if 0 <= days <= 60:
            urgency = "🔴" if days <= 7 else "🟡" if days <= 21 else "🟢"
            print(f"{urgency} **{ticker}** — {date} ({days} days)")

    print("\n**Later:**")
    for ticker, date in dated:
        days = (date - today).days
        if days > 60:
            print(f"⬜ **{ticker}** — {date} ({days} days)")

    if undated:
        print(f"\n**No date found:** {', '.join(undated)}")

    # Conflict check
    conflicts = check_conflicts(earnings)
    if conflicts:
        print(f"\n⚠️ **EARNINGS CONFLICTS WITH SHORT CALLS:**")
        for c in conflicts:
            print(f"🔴 **{c['ticker']}** ${c['strike']} call (exp {c['expiry']}) — "
                  f"EARNINGS {c['earnings']} ({c['days_to_earnings']} days!)")
            print(f"   → Consider closing/rolling BEFORE earnings")
    else:
        print(f"\n✅ No immediate earnings conflicts with short calls in next expiry cycle")

    # New CC warnings
    print(f"\n**⚠️ Do NOT sell new covered calls on:**")
    for ticker, date in dated:
        days = (date - today).days
        if 0 < days <= 45:
            print(f"- **{ticker}** — earnings {date} ({days} days) — wait until after")

if __name__ == "__main__":
    main()
