"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentItem } from "@/lib/types";
import { FileText, ArrowRight } from "lucide-react";

const columns: { status: ContentItem["status"]; label: string; color: string }[] = [
  { status: "idea", label: "Ideas", color: "text-zinc-400" },
  { status: "drafting", label: "Drafting", color: "text-blue-400" },
  { status: "review", label: "Review", color: "text-amber-400" },
  { status: "scheduled", label: "Scheduled", color: "text-purple-400" },
  { status: "published", label: "Published", color: "text-emerald-400" },
];

export function ContentView() {
  const { data } = useApi<ContentItem[]>("/api/content-pipeline", 15000);
  const items = data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Content Pipeline</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Content kanban — track drafts through publishing</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colItems = items.filter((i) => i.status === col.status);
          return (
            <div key={col.status} className="min-w-[220px] flex-1">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-[10px] font-semibold uppercase ${col.color}`}>{col.label}</span>
                <Badge variant="secondary" className="text-[9px]">{colItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {colItems.map((item) => (
                  <Card key={item.id} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[9px]">{item.platform}</Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {colItems.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-white/[0.06] text-center">
                    <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[10px] text-muted-foreground">Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
