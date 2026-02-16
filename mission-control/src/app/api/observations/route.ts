import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function GET() {
  try {
    const raw = await readFile(join(getWorkspacePath(), "state/observations.md"), "utf-8");
    const observations: { timestamp: string; content: string }[] = [];
    let currentDate = "";
    for (const line of raw.split("\n")) {
      const dateMatch = line.match(/^## (\d{4}-\d{2}-\d{2})/);
      if (dateMatch) { currentDate = dateMatch[1]; continue; }
      const entryMatch = line.match(/^- (\d{2}:\d{2}) — (.+)/);
      if (entryMatch && currentDate) {
        observations.push({
          timestamp: `${currentDate}T${entryMatch[1]}:00Z`,
          content: entryMatch[2],
        });
      }
    }
    return NextResponse.json(observations);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
