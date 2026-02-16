import { NextResponse } from "next/server";

// Returns mock chat sessions and messages since .jsonl transcripts may not exist yet
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session");

  const sessions = [
    { id: "s1", title: "Mission Control Build", channel: "webchat", lastMessage: "Building the dashboard now...", messageCount: 24, updatedAt: "2026-02-13T22:00:00Z" },
    { id: "s2", title: "Client Proposal Review", channel: "telegram", lastMessage: "Sent the updated proposal to Acme", messageCount: 12, updatedAt: "2026-02-13T18:00:00Z" },
    { id: "s3", title: "Code Review Session", channel: "discord", lastMessage: "LGTM, merging now", messageCount: 8, updatedAt: "2026-02-12T21:00:00Z" },
  ];

  if (sessionId) {
    const messages = [
      { id: "m1", role: "user", content: "Build a mission control dashboard", timestamp: "2026-02-13T21:00:00Z", channel: "webchat" },
      { id: "m2", role: "assistant", content: "I'll create a Next.js 15 app with Convex real-time backend. Starting with project initialization...", timestamp: "2026-02-13T21:01:00Z", channel: "webchat" },
      { id: "m3", role: "user", content: "Make it look like JARVIS meets Bloomberg terminal", timestamp: "2026-02-13T21:02:00Z", channel: "webchat" },
      { id: "m4", role: "assistant", content: "Perfect. Dark mode only, glass morphism cards, subtle animations. I'll use Framer Motion for transitions and Tailwind v4 for styling.", timestamp: "2026-02-13T21:03:00Z", channel: "webchat" },
    ];
    return NextResponse.json({ sessions, messages });
  }

  return NextResponse.json({ sessions });
}
