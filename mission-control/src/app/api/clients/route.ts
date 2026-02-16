import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";
import type { ClientInfo } from "@/lib/types";

function parseClientMd(content: string, filename: string): ClientInfo {
  const id = filename.replace(".md", "");
  const name = content.match(/^# (.+)/m)?.[1] || id;
  const stage = (content.match(/\*\*Stage\*\*:\s*(\w+)/)?.[1] || "lead") as ClientInfo["stage"];
  const value = content.match(/\*\*Value\*\*:\s*(.+)/)?.[1];
  const lastContact = content.match(/\*\*Last Contact\*\*:\s*(.+)/)?.[1];
  const notesMatch = content.match(/## Notes\n([\s\S]+)/);
  const notes = notesMatch?.[1]?.trim();
  return { id, name, stage, value, lastContact, notes };
}

export async function GET() {
  try {
    const dir = join(getWorkspacePath(), "clients");
    const files = await readdir(dir);
    const clients: ClientInfo[] = [];
    for (const f of files) {
      if (!f.endsWith(".md")) continue;
      const content = await readFile(join(dir, f), "utf-8");
      clients.push(parseClientMd(content, f));
    }
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
