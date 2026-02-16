"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SuggestedTask } from "@/lib/types";
import { Check, X } from "lucide-react";
import { useState } from "react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export function SuggestedTasksView() {
  const { data, refetch } = useApi<SuggestedTask[]>("/api/suggested-tasks", 30000);
  const [acting, setActing] = useState<string | null>(null);

  const tasks = data || [];
  const grouped = tasks.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, SuggestedTask[]>);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    await fetch("/api/suggested-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await refetch();
    setActing(null);
  };

  const priorityVariant = (p: string) => {
    if (p === "high") return "destructive" as const;
    if (p === "medium") return "warning" as const;
    return "secondary" as const;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {Object.entries(grouped).map(([category, catTasks]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>{catTasks[0]?.emoji}</span> {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {catTasks.map((task) => (
              <motion.div key={task.id} variants={item}>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{task.title}</span>
                          <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{task.description}</p>
                        {task.source && (
                          <span className="text-[9px] text-muted-foreground mt-1 inline-block">via {task.source}</span>
                        )}
                      </div>
                      {task.status === "pending" ? (
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-emerald-400 hover:bg-emerald-400/10"
                            onClick={() => handleAction(task.id, "approve")}
                            disabled={acting === task.id}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-400 hover:bg-red-400/10"
                            onClick={() => handleAction(task.id, "reject")}
                            disabled={acting === task.id}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant={task.status === "approved" ? "success" : "destructive"}>
                          {task.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
