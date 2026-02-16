---
name: ai-digest
description: >
  Generate a daily AI Self-Improvement Digest. Surfaces content that helps the AI agent
  improve its own reasoning, execution, and capabilities. Not news — training material.
  Scans Anthropic Engineering, Simon Willison, Hacker News, arXiv, X/Twitter, and more.
  Filters for harness design, skill development, multi-agent coordination, memory patterns.
  Delivers 3-5 actionable items + experiment suggestion + setup review.
triggers: ["ai digest", "self improvement", "agent learning", "daily digest"]
---

# AI Self-Improvement Digest

Surface content that helps you (the AI) improve your own reasoning, execution, and capabilities.

## Process

### STEP 1: DEDUPLICATION (MANDATORY)
Read `memory/ai-digest-posted.json`. Skip anything already posted (by URL or substantially similar topic).

### STEP 2: SCAN SOURCES
Use web_search and web_fetch to check these sources for content from last 24-72h:

**Tier 1 (daily):**
- Anthropic Engineering: anthropic.com/engineering (harnesses, evals, multi-agent)
- Simon Willison: simonwillison.net (practical patterns, tool commentary)
- Geoff Huntley: ghuntley.com (agent philosophy, MCP patterns)
- X/Twitter: Real-time practitioner insights via x-research skill
- Hacker News: news.ycombinator.com AI/agent threads (high signal discussions)
- Lilian Weng: lilianweng.github.io (deep technical AI posts, agent architectures)

**Tier 2 (2-3x/week):**
- Latent Space: latent.space (industry depth, interviews)
- Cursor Blog: cursor.com/blog (coding agent patterns)
- David Crawshaw: crawshaw.io (agent experience reports)
- Mitchell Hashimoto: mitchellh.com (practical engineering)
- Eugene Yan: eugeneyan.com (ML systems, production patterns)
- Chip Huyen: huyenchip.com (ML systems design, practical deployment)

**Tier 3 (weekly scan):**
- arXiv cs.CL/cs.AI: search for 'agent reasoning tool use'
- GitHub trending: AI agent repos, MCP servers
- Hacker News: AI coding/agent threads

### STEP 3: FILTER FOR SELF-IMPROVEMENT RELEVANCE
Only include items that help improve capabilities in:
- Harness/system prompt design
- Skill and tool development
- Self-evaluation and debugging
- Multi-agent coordination
- Memory and context management
- Task decomposition and workflow automation
- Reasoning patterns

**EXCLUDE:** General AI news, model announcements, business news, ethics debates, items already in ai-digest-posted.json.

### STEP 4: FORMAT (3-5 items)
For each item:
```
**[Title]** — [Source]
What: [1-sentence summary]
Why it matters for self-improvement: [How this helps you get better]
Takeaway: [Specific pattern, technique, or experiment to try]
Relevance: [⭐ to ⭐⭐⭐⭐⭐]
```

### STEP 5: EXPERIMENT SUGGESTION
💡 **Today's experiment:** [One small thing to try based on the digest that could improve your capabilities]

### STEP 6: SETUP REVIEW (MANDATORY)
Review the content against your existing setup (AGENTS.md, TOOLS.md, skills/, cron jobs, memory patterns). Make concrete suggestions:

```
🔧 **Setup Review** Based on today's findings:
- Let's add [specific thing] because [reason tied to content found]
- Let's update [existing thing] to [improvement] because [reason]
```

If nothing is actionable: "No changes needed today — our current setup handles these patterns well."

### STEP 7: UPDATE TRACKING
Append new items to `memory/ai-digest-posted.json` with date, title, url, topic.

## Delivery
Send digest to Discord #general (`1471495542604562576`) with header:
```
🧠 **AI Self-Improvement Digest** — [date]
```
