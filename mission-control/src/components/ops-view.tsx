"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusDot, formatRelativeTime } from "@/lib/utils";
import type { ServerHealth, Observation } from "@/lib/types";
import { Server, Eye, Target, GitBranch } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function OpsView() {
  const { data: systemState } = useApi<{ servers: ServerHealth[]; branch: { branch: string; lastCommit: string; dirty: boolean } }>("/api/system-state", 15000);
  const { data: observations } = useApi<Observation[]>("/api/observations", 15000);
  const { data: priorities } = useApi<{ content: string }>("/api/priorities", 30000);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="w-3.5 h-3.5" /> Server Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(systemState?.servers || []).map((s) => (
                <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${statusDot(s.status)}`} />
                    <div>
                      <div className="text-xs font-medium">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.url}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{s.responseTime}ms</div>
                    <div className="text-[10px] text-muted-foreground">{s.uptime}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> Branch Status</CardTitle>
          </CardHeader>
          <CardContent>
            {systemState?.branch && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{systemState.branch.branch}</Badge>
                  {systemState.branch.dirty && <Badge variant="warning">dirty</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{systemState.branch.lastCommit}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(observations || []).slice(0, 12).map((o, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="text-muted-foreground shrink-0 text-[10px] w-12">{formatRelativeTime(o.timestamp)}</span>
                  <span>{o.content}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-xs max-w-none">
              {priorities?.content?.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return null;
                if (line.startsWith("## ")) return <h4 key={i} className="text-xs font-semibold mt-3 mb-1">{line.replace("## ", "")}</h4>;
                if (line.match(/^\d+\./)) return <p key={i} className="text-xs text-muted-foreground ml-2 my-0.5">{line}</p>;
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
