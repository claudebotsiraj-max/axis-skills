"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RepoInfo } from "@/lib/types";
import { GitBranch, GitCommit, AlertCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } } };

export function CodePipeline() {
  const { data } = useApi<RepoInfo[]>("/api/repos", 30000);
  const repos = data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Code</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Git repositories & deployment status</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {repos.map((repo) => (
          <motion.div key={repo.name} variants={item}>
            <Card className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium">{repo.name}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{repo.path}</p>
                  </div>
                  {repo.dirty && (
                    <Badge variant="warning" className="shrink-0">
                      <AlertCircle className="w-2.5 h-2.5 mr-1" /> dirty
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="outline">{repo.branch}</Badge>
                    {(repo.ahead ?? 0) > 0 && <span className="text-[9px] text-emerald-400">↑{repo.ahead}</span>}
                    {(repo.behind ?? 0) > 0 && <span className="text-[9px] text-amber-400">↓{repo.behind}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground truncate">{repo.lastCommit}</span>
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {formatRelativeTime(repo.lastCommitDate)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
