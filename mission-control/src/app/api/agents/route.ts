import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function GET() {
  try {
    const ws = getWorkspacePath();
    const raw = await readFile(join(ws, "agents/registry.json"), "utf-8");
    const agents = JSON.parse(raw);
    return NextResponse.json(agents);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
