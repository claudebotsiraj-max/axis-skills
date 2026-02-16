import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";
import type { RepoInfo } from "@/lib/types";

export async function GET() {
  try {
    const projectsDir = join(process.env.HOME || "~", "Desktop/Projects");
    let dirs: string[] = [];
    try {
      dirs = await readdir(projectsDir);
    } catch {
      // Fallback: return sample data
      return NextResponse.json([
        { name: "mission-control", path: "~/Desktop/Projects/mission-control", branch: "main", lastCommit: "feat: initial dashboard", lastCommitDate: "2026-02-13T21:00:00Z", dirty: false, ahead: 0, behind: 0 },
        { name: "openclaw", path: "~/Desktop/Projects/openclaw", branch: "main", lastCommit: "fix: memory persistence", lastCommitDate: "2026-02-12T18:00:00Z", dirty: true, ahead: 2, behind: 0 },
        { name: "voice-bridge", path: "~/Desktop/Projects/voice-bridge", branch: "develop", lastCommit: "chore: update deps", lastCommitDate: "2026-02-10T12:00:00Z", dirty: false, ahead: 0, behind: 3 },
      ]);
    }

    const repos: RepoInfo[] = [];
    for (const dir of dirs) {
      const fullPath = join(projectsDir, dir);
      const s = await stat(fullPath).catch(() => null);
      if (!s?.isDirectory()) continue;
      try {
        const gitDir = await stat(join(fullPath, ".git")).catch(() => null);
        if (!gitDir) continue;
        const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: fullPath }).toString().trim();
        const lastCommit = execSync("git log -1 --format=%s", { cwd: fullPath }).toString().trim();
        const lastCommitDate = execSync("git log -1 --format=%aI", { cwd: fullPath }).toString().trim();
        const dirty = execSync("git status --porcelain", { cwd: fullPath }).toString().trim().length > 0;
        repos.push({ name: dir, path: fullPath, branch, lastCommit, lastCommitDate, dirty, ahead: 0, behind: 0 });
      } catch {
        continue;
      }
    }
    return NextResponse.json(repos.length > 0 ? repos : [
      { name: "mission-control", path: "~/.openclaw/workspace/mission-control", branch: "main", lastCommit: "feat: initial build", lastCommitDate: "2026-02-13T22:00:00Z", dirty: false, ahead: 0, behind: 0 },
    ]);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
