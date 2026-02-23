# UW Options Flow - Browser Issue

**Since:** 2026-02-22
**Status:** BLOCKED

The cron job `578e6806` (Unusual Whales Options Flow) cannot complete because the browser control service routes through the Chrome extension relay instead of the openclaw CDP profile. All `navigate`, `act`, `snapshot` calls fail with "no tab is connected."

**Fix needed:** Disable Chrome extension relay or configure openclaw profile to bypass it.

**Note:** Markets closed on weekends, so no real data loss on Sat/Sun runs.
