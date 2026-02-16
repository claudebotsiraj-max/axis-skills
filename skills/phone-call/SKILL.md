# Phone Call Skill (Vapi.ai)

Make outbound AI phone calls via the Vapi.ai API.

## Setup

- **Provider**: Vapi.ai (https://vapi.ai)
- **Account**: claudebotsiraj@gmail.com
- **Dashboard**: https://dashboard.vapi.ai
- **API Docs**: https://docs.vapi.ai
- **API Keys**: See TOOLS.md

## How It Works

Vapi provides voice AI agents that can make and receive phone calls. The agent uses:
- **STT** (Speech-to-Text): Deepgram Nova 3
- **LLM**: GPT-4o (or any supported model)
- **TTS** (Text-to-Speech): Vapi's built-in voices

## Making an Outbound Call

### Quick Call (with inline assistant)

```bash
curl -X POST 'https://api.vapi.ai/call' \
  -H "Authorization: Bearer $VAPI_PRIVATE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "outboundPhoneCall",
    "phoneNumberId": "6e48bf4e-513a-48af-8502-e689b969ec06",
    "customer": {
      "number": "+1XXXXXXXXXX"
    },
    "assistant": {
      "firstMessage": "Hi, this is an AI assistant calling on behalf of Siraj. I would like to make a reservation for tonight at 7pm for 2 people.",
      "model": {
        "provider": "openai",
        "model": "gpt-4o",
        "messages": [
          {
            "role": "system",
            "content": "You are a polite assistant making a restaurant reservation. Be concise and natural. Confirm the reservation details before ending the call."
          }
        ]
      },
      "voice": {
        "provider": "vapi",
        "voiceId": "Elliot"
      }
    }
  }'
```

### Call with Existing Assistant

```bash
curl -X POST 'https://api.vapi.ai/call' \
  -H "Authorization: Bearer $VAPI_PRIVATE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "outboundPhoneCall",
    "phoneNumberId": "6e48bf4e-513a-48af-8502-e689b969ec06",
    "assistantId": "23c3f2f3-c5ab-4df1-808d-b73e8889388b",
    "customer": {
      "number": "+1XXXXXXXXXX"
    }
  }'
```

### Check Call Status

```bash
curl 'https://api.vapi.ai/call/{call_id}' \
  -H "Authorization: Bearer $VAPI_PRIVATE_KEY"
```

### List Recent Calls

```bash
curl 'https://api.vapi.ai/call' \
  -H "Authorization: Bearer $VAPI_PRIVATE_KEY"
```

## Resources

| Resource | ID |
|---|---|
| Phone Number | `6e48bf4e-513a-48af-8502-e689b969ec06` (+12085109585) |
| Default Assistant (Riley) | `23c3f2f3-c5ab-4df1-808d-b73e8889388b` |
| Org ID | `9157f0c3-cd22-48bc-8ecb-46c1fe1c26ae` |

## Common Use Cases

### Restaurant Reservation
Set system prompt to: "You are calling to make a restaurant reservation. Ask for availability at [time] for [party size]. Confirm the reservation details."

### Appointment Scheduling
Set system prompt to: "You are calling to schedule an appointment. Ask for availability and provide the caller's name and preferred times."

### General Inquiry
Set system prompt to: "You are calling to ask about [topic]. Be polite and concise."

## Pricing

- Vapi charges per minute of call time
- Free tier includes some initial credits
- Costs include: transport + STT + LLM + TTS + Vapi fee
- Typical cost: ~$0.05-0.15/minute depending on models used

## Notes

- The phone number (+12085109585) is a free Vapi number, US only
- For international calls, you'd need to import a Twilio number
- Calls can be monitored in the Vapi dashboard under "Call Logs"
- The API returns call transcripts and recordings after completion
