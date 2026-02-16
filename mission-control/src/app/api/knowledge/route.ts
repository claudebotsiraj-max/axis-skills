import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join, relative } from "path";
import { getWorkspacePath } from "@/lib/utils";
import type { KnowledgeEntry } from "@/lib/types";

async function walkDir(dir: string, base: string): Promise<KnowledgeEntry[]> {
  const entries: KnowledgeEntry[] = [];
  try {
    const items = await readdir(dir);
    for (const item of items) {
      if (item.startsWith(".") || item === "node_modules") continue;
      const full = join(dir, item);
      const s = await stat(full).catch(() => null);
      if (!s) continue;
      if (s.isDirectory()) {
        const sub = await walkDir(full, base);
        entries.push(...sub);
      } else if (item.endsWith(".md") || item.endsWith(".json") || item.endsWith(".txt")) {
        const content = await readFile(full, "utf-8").catch(() => "");
        const title = content.match(/^#\s+(.+)/m)?.[1] || item;
        const relPath = relative(base, full);
        const category = relPath.split("/")[0] || "root";
        entries.push({
          path: relPath,
          title,
          excerpt: content.slice(0, 200).replace(/\n/g, " "),
          category,
          modifiedAt: s.mtime.toISOString(),
        });
      }
    }
  } catch { /* skip */ }
  return entries;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase();
  const ws = getWorkspacePath();

  try {
    let entries = await walkDir(ws, ws);
    if (query) {
      entries = entries.filter(
        (e) => e.title.toLowerCase().includes(query) || e.excerpt.toLowerCase().includes(query) || e.path.toLowerCase().includes(query)
      );
    }
    return NextResponse.json(entries.slice(0, 100));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
