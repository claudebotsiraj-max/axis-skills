import { NextResponse } from "next/server";

const products = [
  { slug: "openclaw", name: "OpenClaw", tagline: "AI Agent Runtime", status: "live", description: "The core runtime that powers AI agents with persistent memory, tool use, and multi-channel communication.", stack: ["TypeScript", "Node.js", "LLM APIs"], url: "https://openclaw.ai" },
  { slug: "mission-control", name: "Mission Control", tagline: "Agent Dashboard", status: "beta", description: "Real-time monitoring and management dashboard for AI agent systems.", stack: ["Next.js 15", "Convex", "Tailwind CSS"], url: "/mission-control" },
  { slug: "voice-bridge", name: "Voice Bridge", tagline: "Phone AI Integration", status: "dev", description: "Connect AI agents to phone calls via Vapi.ai. Inbound and outbound voice automation.", stack: ["Vapi.ai", "Twilio", "ElevenLabs"], url: null },
  { slug: "memory-engine", name: "Memory Engine", tagline: "Persistent Agent Memory", status: "live", description: "File-based and database-backed memory system for maintaining agent context across sessions.", stack: ["Markdown", "Convex", "Vector DB"], url: null },
];

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}
