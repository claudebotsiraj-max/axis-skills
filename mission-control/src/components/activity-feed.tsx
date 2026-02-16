"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Observation } from "@/lib/types";
import { Activity } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export function ActivityFeed() {
  const { data } = useApi<Observation[]>("/api/observations", 15000);
  const observations = data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {observations.map((o, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs">{o.content}</p>
                  <span className="text-[9px] text-muted-foreground">{formatRelativeTime(o.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
