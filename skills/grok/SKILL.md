# Grok (xAI) Skill

Query Grok AI models via the xAI API. Useful for getting a second opinion, X/Twitter-aware analysis, market sentiment, and unfiltered takes.

## Setup

API Key required. Get one at: https://console.x.ai/team/default/api-keys
Store in TOOLS.md under `## Grok / xAI`

## API

- **Base URL:** `https://api.x.ai/v1`
- **Auth:** `Authorization: Bearer $XAI_API_KEY`
- **OpenAI-compatible** — uses `/v1/chat/completions` or `/v1/responses`

## Models

| Model | Best For | Context | Price (in/out per 1M) |
|-------|----------|---------|----------------------|
| `grok-4-1-fast-reasoning` | Deep analysis, reasoning | 2M tokens | $0.20 / $0.50 |
| `grok-4-1-fast-non-reasoning` | Fast queries, chat | 2M tokens | $0.20 / $0.50 |
| `grok-3` | General purpose | 131K | $3.00 / $15.00 |
| `grok-3-mini` | Quick/cheap reasoning | 131K | $0.30 / $0.50 |
| `grok-2-image-1212` | Image generation | — | $0.07/image |

## Usage

### Quick query (curl)

```bash
curl -s https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4-1-fast-non-reasoning",
    "messages": [
      {"role": "system", "content": "You are Grok, a witty AI with real-time X/Twitter awareness."},
      {"role": "user", "content": "YOUR PROMPT HERE"}
    ],
    "temperature": 0.7
  }' | python3 -c "import sys,json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
```

### With reasoning (for complex analysis)

```bash
curl -s https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -m 3600 \
  -d '{
    "model": "grok-4-1-fast-reasoning",
    "input": [
      {"role": "system", "content": "You are Grok."},
      {"role": "user", "content": "YOUR PROMPT HERE"}
    ]
  }'
```

### Python (OpenAI SDK compatible)

```python
from openai import OpenAI
import httpx

client = OpenAI(
    api_key="YOUR_KEY",
    base_url="https://api.x.ai/v1",
    timeout=httpx.Timeout(120.0),
)

response = client.chat.completions.create(
    model="grok-4-1-fast-non-reasoning",
    messages=[
        {"role": "system", "content": "You are Grok."},
        {"role": "user", "content": "What's the sentiment on $TSLA today?"}
    ]
)
print(response.choices[0].message.content)
```

## Best Use Cases

- **Market sentiment** — Grok has X/Twitter awareness, great for "what's the vibe on $TICKER"
- **Second opinion** — cross-reference analysis from Claude with Grok's take
- **Unfiltered takes** — Grok is less filtered than most models
- **Real-time awareness** — trained on X data, knows recent events

## Helper Script

Save as `skills/grok/ask-grok.sh`:

```bash
#!/bin/bash
# Usage: ./ask-grok.sh "your question here" [model]
# Default model: grok-4-1-fast-non-reasoning

PROMPT="$1"
MODEL="${2:-grok-4-1-fast-non-reasoning}"
API_KEY=$(grep -A1 'xAI API Key' /Users/sms/.openclaw/workspace/TOOLS.md | tail -1 | tr -d ' ')

curl -s https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [
      {\"role\": \"system\", \"content\": \"You are Grok, a sharp AI assistant with deep knowledge of markets, tech, and X/Twitter sentiment.\"},
      {\"role\": \"user\", \"content\": $(echo "$PROMPT" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read().strip()))')}
    ],
    \"temperature\": 0.7
  }" | python3 -c "import sys,json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
```

## Notes

- Rate limits: 480 RPM, 4M TPM on fast models
- Grok-4-1-fast is dirt cheap ($0.20/$0.50 per 1M tokens) — use liberally
- Image generation available via `grok-2-image-1212` at $0.07/image
- API is OpenAI-compatible, so any OpenAI SDK wrapper works
