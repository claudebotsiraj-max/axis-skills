"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusDot, formatRelativeTime } from "@/lib/utils";
import type { AgentInfo } from "@/lib/types";
import { Bot, X, Hash, Cpu } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } } };

export function AgentsView() {
  const { data } = useApi<AgentInfo[]>("/api/agents", 15000);
  const [selected, setSelected] = useState<AgentInfo | null>(null);
  const agents = data || [];

  return (
    <div className="flex gap-4">
      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map((agent) => (
          <motion.div key={agent.id} variants={item}>
            <Card
              className="p-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
              onClick={() => setSelected(agent)}
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(agent.status)}`} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{agent.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[9px]">
                        <Cpu className="w-2.5 h-2.5 mr-1" />{agent.model}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">{formatRelativeTime(agent.lastActive)}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {agent.channels.map((ch) => (
                        <Badge key={ch} variant="secondary" className="text-[9px]">
                          <Hash className="w-2 h-2 mr-0.5" />{ch}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 shrink-0"
        >
          <Card className="sticky top-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{selected.name}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setSelected(null)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Role</div>
                <p className="text-xs">{selected.role}</p>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Model</div>
                <p className="text-xs">{selected.model}</p>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot(selected.status)}`} />
                  <span className="text-xs capitalize">{selected.status}</span>
                </div>
              </div>
              {selected.subAgents && selected.subAgents.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Sub-Agents</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.subAgents.map((sa) => (
                      <Badge key={sa} variant="secondary">{sa}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Last Active</div>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(selected.lastActive)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
