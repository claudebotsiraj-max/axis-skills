import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

const getPath = () => join(getWorkspacePath(), "state/suggested-tasks.json");

export async function GET() {
  try {
    const raw = await readFile(getPath(), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body as { id: string; action: "approve" | "reject" };
    const raw = await readFile(getPath(), "utf-8");
    const tasks = JSON.parse(raw);
    const task = tasks.find((t: { id: string }) => t.id === id);
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    task.status = action === "approve" ? "approved" : "rejected";
    await writeFile(getPath(), JSON.stringify(tasks, null, 2));
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
