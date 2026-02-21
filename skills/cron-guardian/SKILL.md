---
name: cron-guardian
description: >
  Proactive cron job monitoring, self-healing, and auto-repair. Monitors ALL cron jobs,
  detects failures, stale runs, browser issues, and fixes them automatically without
  human intervention. Reports only when something was broken AND fixed, or when it
  needs human help.
trigger: cron health, job monitoring, fix crons, broken alerts
---

# Cron Guardian — Proactive Self-Healing

## Philosophy
Don't wait for Salah. Detect → Diagnose → Fix → Verify → Report only if needed.

## Checks to Run (every cycle)

### 1. Stale Job Detection
For each enabled job with `everyMs` schedule:
- Calculate: `now - lastRunAtMs` vs `everyMs * 3`
- If a job hasn't run in 3x its interval → it's STALE
- **Fix**: Force-run the job immediately via `cron run`

### 2. Consecutive Errors
- `consecutiveErrors >= 1` → investigate lastError
- `consecutiveErrors >= 3` → auto-fix based on error type:
  - "delivery target" → patch delivery to `{"mode": "none"}`
  - "timed out" → increase timeoutSeconds by 60 (max 360)
  - "browser" errors → restart browser, then re-run job
  - Unknown → disable job, alert Salah

### 3. Browser Health (Critical)
Many cron jobs depend on the openclaw browser. Check:
```
browser status → is it running?
browser snapshot → does it respond?
```
- If browser is down → `browser start --profile openclaw`
- After restart, force-run any browser-dependent jobs that are stale

### 4. Browser-Dependent Jobs (tag these)
- X Watchlist Alert (`c6a918d8`)
- Unusual Whales Options Flow (`578e6806`)
- External Discord Alerts Scanner (`77c76a6d`)
- Daily Morning Briefing (`326c455b`)

### 5. Schedule Sanity
- Jobs with `cron` schedule: verify next run is in the future
- Jobs with `every` schedule: verify nextRunAtMs makes sense
- Market-hours jobs (stock pivot, portfolio): skip checks on weekends/holidays

### 6. Delivery Config Validation
- Isolated jobs should have `delivery.mode: "none"` (they use message tool internally)
- If delivery is "announce" with missing target → fix to "none"

## Auto-Fix Actions (no human needed)
| Problem | Fix |
|---------|-----|
| Stale job (3x interval) | Force-run |
| Browser down | Restart browser, re-run dependent jobs |
| Delivery target missing | Patch to mode: "none" |
| Timeout error | Increase timeout +60s (max 360) |
| consecutiveErrors >= 3 | Reset: disable → re-enable |

## Escalate to Salah (Discord #general)
- Job fails 5+ times consecutively after auto-fix attempts
- Browser won't start after 2 attempts
- Unknown error type not in the fix table
- Job disabled by guardian (explain why)

## Report Format (Discord #general, only when issues found)
```
🛡️ **Cron Guardian** — [time]

🔧 **Fixed:**
- [job name]: [what was wrong] → [what was done]

⚠️ **Needs Attention:**
- [job name]: [issue that couldn't be auto-fixed]

✅ [X]/[Y] jobs healthy
```

If everything is fine → NO message. Silent success.

## Monitoring Schedule
Run every 30 minutes via cron. Fast, cheap, catches issues before they pile up.
