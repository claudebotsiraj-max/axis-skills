import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ws = getWorkspacePath();
    const registryRaw = await readFile(join(ws, "agents/registry.json"), "utf-8");
    const agents = JSON.parse(registryRaw);
    const agent = agents.find((a: { id: string }) => a.id === id);
    if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const soul = await readFile(join(ws, `agents/${id}/SOUL.md`), "utf-8").catch(() => null);
    const rules = await readFile(join(ws, `agents/${id}/RULES.md`), "utf-8").catch(() => null);

    return NextResponse.json({ ...agent, soul, rules });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
