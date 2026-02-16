# /// script
# requires-python = ">=3.11"
# dependencies = ["yfinance>=0.2.36", "rich>=13.7"]
# ///
"""
Portfolio Position Checker — pulls current prices, options data, and Greeks
for all positions in Salah's Rollover IRA.
"""

import yfinance as yf
from rich.console import Console
from rich.table import Table
from datetime import datetime, timedelta
import json
import sys

console = Console()

# ── Portfolio Configuration ──────────────────────────────────────────
HOLDINGS = {
    "TSLA":  {"shares": 6760, "cost": 245.00},
    "TSLL":  {"shares": 6000, "cost": 15.06},
    "PLTR":  {"shares": 900,  "cost": 84.00},
    "NVDA":  {"shares": 525,  "cost": 166.00},
    "TSM":   {"shares": 203,  "cost": 221.00},
    "RKLB":  {"shares": 1000, "cost": 50.00},
    "AVGO":  {"shares": 201,  "cost": 250.00},
    "AAPL":  {"shares": 203,  "cost": 216.00},
    "GOOG":  {"shares": 151,  "cost": 175.00},
}

CASH = 70_000  # approximate cash position
MAX_WEIGHT = 0.40
CASH_BUFFER = 200_000

# Short options to monitor (ticker, type, strike, expiry, qty)
SHORT_OPTIONS = [
    ("PLTR", "call", 60,  "2026-12-18", 5),
    ("AVGO", "call", 230, "2026-12-18", 1),
    ("TSLA", "call", 465, "2026-02-27", 3),
    ("TSLA", "call", 475, "2026-02-27", 5),
    ("TSLA", "call", 580, "2026-07-17", 8),
    ("TSLA", "call", 700, "2026-09-18", 10),
    ("TSLA", "call", 700, "2027-01-15", 8),
    ("TSLA", "call", 750, "2027-01-15", 2),
    ("TSLA", "put",  450, "2027-01-15", 1),
    ("RKLB", "call", 105, "2026-07-17", 3),
    ("RKLB", "call", 115, "2026-07-17", 5),
    ("PLTR", "call", 100, "2027-06-18", 1),
    ("HIMS", "call", 65,  "2027-01-15", 5),
    ("TSLL", "call", 24.70, "2027-01-15", 10),
    ("TSLL", "call", 28.70, "2027-01-15", 10),
    ("TSLL", "put",  12.70, "2027-01-15", 15),
]

def get_prices(tickers):
    """Fetch current prices for all tickers."""
    data = {}
    all_tickers = list(set(tickers + [s[0] for s in SHORT_OPTIONS]))
    for ticker in all_tickers:
        try:
            t = yf.Ticker(ticker)
            info = t.info
            price = info.get("regularMarketPrice") or info.get("currentPrice") or info.get("previousClose", 0)
            data[ticker] = {
                "price": price,
                "change_pct": info.get("regularMarketChangePercent", 0),
                "day_high": info.get("dayHigh", 0),
                "day_low": info.get("dayLow", 0),
                "fifty_two_high": info.get("fiftyTwoWeekHigh", 0),
                "fifty_two_low": info.get("fiftyTwoWeekLow", 0),
            }
        except Exception as e:
            console.print(f"[red]Error fetching {ticker}: {e}[/red]")
            data[ticker] = {"price": 0}
    return data

def calc_portfolio(prices):
    """Calculate portfolio values and weights."""
    positions = []
    total_stock_value = sum(
        HOLDINGS[t]["shares"] * prices.get(t, {}).get("price", 0)
        for t in HOLDINGS
    )
    total_value = total_stock_value + CASH

    for ticker, holding in HOLDINGS.items():
        price = prices.get(ticker, {}).get("price", 0)
        value = holding["shares"] * price
        cost_basis = holding["shares"] * holding["cost"]
        weight = value / total_value if total_value > 0 else 0
        pnl = value - cost_basis
        pnl_pct = (pnl / cost_basis * 100) if cost_basis > 0 else 0

        # Health status
        if weight > MAX_WEIGHT:
            health = "🔴"
        elif weight > 0.25:
            health = "🟡"
        else:
            health = "🟢"

        positions.append({
            "ticker": ticker,
            "shares": holding["shares"],
            "price": price,
            "value": value,
            "weight": weight,
            "cost": holding["cost"],
            "pnl": pnl,
            "pnl_pct": pnl_pct,
            "health": health,
        })

    positions.sort(key=lambda x: x["value"], reverse=True)
    return positions, total_value

def check_short_options(prices):
    """Analyze short options for delta/gamma risk and expiration proximity."""
    today = datetime.now().date()
    alerts = []

    for ticker, opt_type, strike, expiry_str, qty in SHORT_OPTIONS:
        expiry = datetime.strptime(expiry_str, "%Y-%m-%d").date()
        dte = (expiry - today).days
        price = prices.get(ticker, {}).get("price", 0)

        if opt_type == "call":
            itm = price > strike
            moneyness = (price - strike) / strike * 100 if strike > 0 else 0
        else:
            itm = price < strike
            moneyness = (strike - price) / strike * 100 if strike > 0 else 0

        # Determine status
        if dte <= 0:
            status = "🔴 EXPIRED"
        elif dte <= 7:
            status = "🔴 <7 DTE — GAMMA RISK"
        elif dte <= 21:
            status = "🟡 <21 DTE — ROLL WINDOW"
        elif itm and abs(moneyness) > 10:
            status = "🔴 DEEP ITM"
        elif itm:
            status = "🟡 ITM"
        else:
            status = "🟢 OTM"

        intrinsic = 0
        if opt_type == "call" and price > strike:
            intrinsic = (price - strike) * qty * 100
        elif opt_type == "put" and price < strike:
            intrinsic = (strike - price) * qty * 100

        alerts.append({
            "ticker": ticker,
            "type": opt_type.upper(),
            "strike": strike,
            "expiry": expiry_str,
            "dte": dte,
            "qty": qty,
            "itm": itm,
            "moneyness": moneyness,
            "intrinsic": intrinsic,
            "status": status,
        })

    alerts.sort(key=lambda x: x["dte"])
    return alerts

def print_report(positions, total_value, option_alerts, prices):
    """Print Discord-formatted portfolio report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    cash_pct = CASH / total_value * 100 if total_value > 0 else 0

    print(f"\n📊 **Portfolio Position Check** — {now}\n")
    print(f"💰 **Total Value**: ${total_value:,.0f} | Cash: ${CASH:,.0f} ({cash_pct:.1f}%)")

    if CASH < CASH_BUFFER:
        print(f"⚠️ **Cash below ${CASH_BUFFER:,.0f} buffer** — no new CSPs!")
    print()

    # Position table
    print("**📋 Holdings**")
    for p in positions:
        pnl_str = f"+${p['pnl']:,.0f}" if p['pnl'] >= 0 else f"-${abs(p['pnl']):,.0f}"
        print(f"{p['health']} **{p['ticker']}** — {p['shares']:,} shares @ ${p['price']:.2f} | "
              f"${p['value']:,.0f} ({p['weight']:.1%}) | P&L: {pnl_str} ({p['pnl_pct']:+.1f}%)")
    print()

    # Concentration alert
    tsla = next((p for p in positions if p["ticker"] == "TSLA"), None)
    if tsla and tsla["weight"] > MAX_WEIGHT:
        target_value = total_value * 0.35  # target 35% weight
        excess_value = tsla["value"] - target_value
        excess_shares = int(excess_value / tsla["price"])
        print(f"⚠️ **TSLA Concentration**: {tsla['weight']:.1%} (max {MAX_WEIGHT:.0%})")
        print(f"   Need to trim ~{excess_shares:,} shares (${excess_value:,.0f}) to reach 35% target")
        print(f"   Keep minimum 3,000 core shares\n")

    # Short options
    print("**📌 Short Options Monitor**")
    for a in option_alerts:
        itm_str = "ITM" if a["itm"] else "OTM"
        intrinsic_str = f" | Intrinsic: ${a['intrinsic']:,.0f}" if a["intrinsic"] > 0 else ""
        print(f"{a['status']} — {a['qty']}x {a['ticker']} {a['expiry']} ${a['strike']} {a['type']} | "
              f"{a['dte']} DTE | {itm_str} ({a['moneyness']:+.1f}%){intrinsic_str}")
    print()

    # Summary alerts
    gamma_risk = [a for a in option_alerts if a["dte"] <= 7 and a["dte"] > 0]
    roll_window = [a for a in option_alerts if 7 < a["dte"] <= 21]
    deep_itm = [a for a in option_alerts if a["itm"] and abs(a["moneyness"]) > 10]

    if gamma_risk:
        print(f"🔴 **{len(gamma_risk)} positions with GAMMA RISK (<7 DTE)** — close or roll immediately!")
    if roll_window:
        print(f"🟡 **{len(roll_window)} positions in ROLL WINDOW (<21 DTE)** — evaluate rolling")
    if deep_itm:
        total_underwater = sum(a["intrinsic"] for a in deep_itm)
        print(f"🔴 **{len(deep_itm)} positions DEEP ITM** — total intrinsic exposure: ${total_underwater:,.0f}")

    # JSON output for other scripts
    output = {
        "timestamp": now,
        "total_value": total_value,
        "cash": CASH,
        "positions": positions,
        "option_alerts": option_alerts,
    }
    return output

def main():
    console.print("[bold blue]Fetching market data...[/bold blue]")
    prices = get_prices(list(HOLDINGS.keys()))
    positions, total_value = calc_portfolio(prices)
    option_alerts = check_short_options(prices)
    output = print_report(positions, total_value, option_alerts, prices)

    # Save state for other scripts
    # Convert for JSON serialization
    json_output = json.dumps(output, indent=2, default=str)
    with open("/tmp/portfolio-state.json", "w") as f:
        f.write(json_output)
    console.print("\n[dim]State saved to /tmp/portfolio-state.json[/dim]")

if __name__ == "__main__":
    main()
