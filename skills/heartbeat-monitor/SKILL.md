---
name: heartbeat-monitor
description: >
  Proactive system health monitoring with auto-healing. Runs every 15 minutes
  to detect and fix issues before they cause failures. Reports only when
  something was broken and fixed, or when human intervention is needed.
---

# Heartbeat Monitor

Comprehensive system health check that prevents issues before they break cron jobs.

## Purpose

Unlike the Cron Guardian (which fixes failed *jobs*), the Heartbeat Monitor prevents
system failures *before* they affect jobs.

## Schedule

- **Every 15 minutes** (cron: `*/15 * * * *`)
- **Time limit:** 90 seconds
- **Model:** Flash (routine task)

## What It Monitors & Auto-Fixes

### 1. Gateway Health
- **Check:** `openclaw gateway status`
- **Fail condition:** Not running or unresponsive
- **Auto-fix:** `openclaw gateway restart`
- **Escalate:** If restart fails 3x in a row

### 2. Browser Health
- **Check:** `browser status` (both openclaw and chrome profiles)
- **Fail condition:** CDP not ready, process dead
- **Auto-fix:** `browser stop` then `browser start --profile openclaw`
- **Escalate:** If browser stuck in zombie state (CDP ready but not responding)

### 3. Cron Job Staleness (Early Warning)
- **Check:** Expected run times vs last run for critical jobs
- **Threshold:** Alert if job >1.5x overdue
- **Preemptive action:** Force-run job if looks stuck
- **Auto-fix:** `cron run --jobId <id> --runMode force`

### 4. API Connectivity
- **Check:** Ping key APIs (ElevenLabs, Vapi)
- **Fail condition:** Timeout or 401/403 errors
- **Escalate:** If >3 consecutive failures

### 5. Disk Space
- **Check:** `df -h ~/.openclaw`
- **Fail condition:** >90% full
- **Auto-fix:** Clean old screenshots, logs
- **Escalate:** If still >90% after cleanup

## Response Logic

For each check:
  IF healthy: Continue silently
  IF can auto-fix: Apply fix, verify, log, notify
  IF after fix still broken: Mark "needs human", send Discord alert

## Output Format

**Discord (only when something fixed):**
```
🫀 **Heartbeat — [time]**

🔧 Fixed:
- Gateway: was stopped → restarted
- Browser CDP: not ready → restarted

✅ All systems green now.
```

**Escalation:**
```
🫀 **Heartbeat — [time]**

🚨 Cannot auto-fix: Gateway restart failed 3x. Needs manual check.
```

## Comparison: Heartbeat vs Guardian

|                 | Heartbeat Monitor          | Cron Guardian             |
|-----------------|----------------------------|---------------------------|
| **Focus**       | System health              | Cron job health           |
| **Frequency**   | Every 15 min               | Every 30 min              |
| **Catches**     | Before jobs fail           | After jobs fail           |
| **Fixes**       | Gateway, Browser, Disk     | Job timeouts, errors      |

## Emergency Full Reset

If everything is broken:
```
browser stop
openclaw gateway restart
openclaw browser start --profile openclaw
```

This skill auto-runs these commands when catastrophic failure detected.
