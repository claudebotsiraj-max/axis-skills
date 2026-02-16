"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ModelInfo } from "@/lib/types";
import { Cpu } from "lucide-react";

const models: ModelInfo[] = [
  { id: "opus", provider: "Anthropic", name: "Claude Opus 4", contextWindow: "200K", costPer1k: "$15/$75", speed: "slow", capabilities: ["reasoning", "coding", "analysis", "vision"] },
  { id: "sonnet", provider: "Anthropic", name: "Claude Sonnet 4", contextWindow: "200K", costPer1k: "$3/$15", speed: "medium", capabilities: ["coding", "analysis", "vision", "tools"] },
  { id: "haiku", provider: "Anthropic", name: "Claude Haiku 3.5", contextWindow: "200K", costPer1k: "$0.25/$1.25", speed: "fast", capabilities: ["chat", "classification", "extraction"] },
  { id: "gpt4o", provider: "OpenAI", name: "GPT-4o", contextWindow: "128K", costPer1k: "$2.50/$10", speed: "medium", capabilities: ["chat", "vision", "tools", "coding"] },
  { id: "gemini", provider: "Google", name: "Gemini 2.5 Pro", contextWindow: "1M", costPer1k: "$1.25/$5", speed: "medium", capabilities: ["reasoning", "coding", "long-context"] },
];

const speedBadge = (s: string) => {
  if (s === "fast") return "success" as const;
  if (s === "medium") return "warning" as const;
  return "destructive" as const;
};

export function ModelsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Model Inventory</CardTitle>
          <Badge variant="secondary">{models.length} models</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Model</th>
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Provider</th>
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Context</th>
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Cost (in/out)</th>
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Speed</th>
                  <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase">Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-medium">{m.name}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{m.provider}</td>
                    <td className="py-2.5 px-3">{m.contextWindow}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px]">{m.costPer1k}</td>
                    <td className="py-2.5 px-3"><Badge variant={speedBadge(m.speed)}>{m.speed}</Badge></td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {m.capabilities.map((c) => (
                          <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
