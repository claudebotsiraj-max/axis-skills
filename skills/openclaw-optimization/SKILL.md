# OpenClaw Optimization & Efficiency

This skill defines the gold standard for high-performance, low-latency, and cost-effective OpenClaw operation.

## 1. Token Hygiene (The "Zero-Bloat" Rule)
- **Never read whole files** unless absolutely necessary. Use `read` with `offset/limit` or `grep` first.
- **Prefer `memory_search`** over loading full memory files.
- **Truncate outputs.** If a command outputs 1000 lines, pipe to `tail` or `head` or `grep`.
- **Edit precisely.** Use `edit` (replace string) instead of `write` (overwrite full file) for small changes.

## 2. Browser Performance
- **Always set `mode="efficient"`** in `browser` calls unless visual debugging is required.
- **Block heavy resources.** The browser tool automatically blocks ads/trackers; do not override this.
- **One-shot actions.** Prefer `browser(action="act", ...)` chains over multiple separate `browser` calls.

## 3. Sub-agent Orchestration
- **Spawn for depth.** If a task takes >3 steps or >1 minute, spawn a sub-agent.
- **Model Routing:**
  - **Flash (google/gemini-2.0-flash):** Cron jobs, status checks, simple data fetching.
  - **Sonnet (anthropic/claude-opus-4-6):** Coding, complex reasoning, writing.
  - **Kimi:** Fallback only.
- **Kill aggressively.** When a sub-agent is done, ensure it cleans up. `sessions_spawn(cleanup="delete")` is default.

## 4. Tool Usage Optimization
- **`web_search`:** Use `count=3` by default. Only increase if results are poor.
- **`web_fetch`:** Always use `extractMode="markdown"` for cleaner, smaller context.
- **`exec`:** Chain commands with `&&` where safe to avoid round-trip latency.

## 5. Self-Correction
- If a tool fails, **do not retry the exact same way**. Change parameters, simplify, or check status first.
- If context exceeds 50k tokens, **trigger self-compaction** (summarize state to memory, clear context).
