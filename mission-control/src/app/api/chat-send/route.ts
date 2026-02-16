import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { message, channel } = await req.json();
    const entry = JSON.stringify({ role: "user", content: message, channel, timestamp: new Date().toISOString() });
    await writeFile(join(getWorkspacePath(), "state/chat-queue.jsonl"), entry + "\n", { flag: "a" });
    return NextResponse.json({ success: true, message: "Message queued" });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
