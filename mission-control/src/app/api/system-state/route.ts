import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function GET() {
  try {
    const ws = getWorkspacePath();
    const [serversRaw, branchRaw] = await Promise.all([
      readFile(join(ws, "state/servers.json"), "utf-8").catch(() => "[]"),
      readFile(join(ws, "state/branch-check.json"), "utf-8").catch(() => "{}"),
    ]);
    return NextResponse.json({
      servers: JSON.parse(serversRaw),
      branch: JSON.parse(branchRaw),
    });
  } catch {
    return NextResponse.json({ servers: [], branch: {} }, { status: 500 });
  }
}
