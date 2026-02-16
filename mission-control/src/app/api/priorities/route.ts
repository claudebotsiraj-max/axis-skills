import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getWorkspacePath } from "@/lib/utils";

export async function GET() {
  try {
    const raw = await readFile(join(getWorkspacePath(), "shared-context/priorities.md"), "utf-8");
    return NextResponse.json({ content: raw });
  } catch {
    return NextResponse.json({ content: "No priorities found." }, { status: 500 });
  }
}
