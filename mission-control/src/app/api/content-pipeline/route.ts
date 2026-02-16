import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";

function parseContentQueue(md: string): ContentItem[] {
  const items: ContentItem[] = [];
  let currentStatus: ContentItem["status"] = "idea";
  const statusMap: Record<string, ContentItem["status"]> = {
    "Ideas": "idea",
    "Drafting": "drafting",
    "Review": "review",
    "Scheduled": "scheduled",
    "Published": "published",
  };

  for (const line of md.split("\n")) {
    const sectionMatch = line.match(/^## (.+)/);
    if (sectionMatch) {
      currentStatus = statusMap[sectionMatch[1]] || "idea";
      continue;
    }
    const itemMatch = line.match(/^- \[[ x]\] (.+?)(?:\s*\((\w+)\))?(?:\s*—\s*(.+))?$/);
    if (itemMatch) {
      items.push({
        id: `content-${items.length}`,
        title: itemMatch[1].trim(),
        platform: itemMatch[2] || "blog",
        status: currentStatus,
        createdAt: itemMatch[3] || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  return items;
}

export async function GET() {
  try {
    const raw = await readFile(join(getWorkspacePath(), "content/queue.md"), "utf-8");
    return NextResponse.json(parseContentQueue(raw));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
