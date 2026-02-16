# Active Cron Jobs

## Running
| ID | Name | Schedule | Target |
|----|------|----------|--------|
| `326c455b` | Daily Morning Briefing | 8 AM ET daily | Split across channels |
| `c6a918d8` | X Watchlist Alert | Every 15 min | #x-post |
| `578e6806` | Unusual Whales Options Flow | Every 15 min | #stock-alert |
| `1605299e` | Stock Pivot Alert | */15 8-17 Mon-Fri ET | #stock-alert |
| `0f20c690` | Daily Portfolio Options Check | 1 PM ET Mon-Fri | #stock-alert |
| `77fdf8a1` | Weekly Options Review | Sun 7 PM ET | #stock-alert |
| `d4307c81` | Options Checklist (Mon) | Mon 8:30 AM ET | main session |
| `e8c68a92` | Options Checklist (Wed) | Wed 8:30 AM ET | main session |
| `55ec21f8` | Cron Health Monitor | 9 AM, 3 PM, 9 PM ET | #general (only on errors) |
| `e7d0c9f6` | Daily Git Auto-Commit & Push | 11 PM ET daily | #general |
| `ade00fd5` | Twilio Billing Reminder | 15th of month, 10 AM | main session |
| `10c208d8` | Weekly Workspace Backup | Fri 11 PM ET | #backup-bot |

## Disabled
| ID | Name | Reason |
|----|------|--------|
| `28c7893a` | Mission Control Build Check | One-time, completed |
| `1446c449` | DTF Reservation Check | Date passed (Feb 15) |
