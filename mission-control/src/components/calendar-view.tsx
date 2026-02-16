"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
}

// Mock data - in production would come from Convex
const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Standup", date: "2026-02-14", time: "09:00", duration: "15m", type: "recurring" },
  { id: "2", title: "Client Call - Acme Corp", date: "2026-02-14", time: "14:00", duration: "60m", type: "meeting" },
  { id: "3", title: "Content Review", date: "2026-02-15", time: "10:00", duration: "30m", type: "task" },
  { id: "4", title: "Deploy v2.1", date: "2026-02-15", time: "16:00", duration: "45m", type: "deployment" },
  { id: "5", title: "Weekly Retro", date: "2026-02-16", time: "11:00", duration: "45m", type: "recurring" },
  { id: "6", title: "Investor Update", date: "2026-02-17", time: "13:00", duration: "30m", type: "meeting" },
  { id: "7", title: "Newsletter Send", date: "2026-02-18", time: "08:00", duration: "15m", type: "task" },
];

const typeColors: Record<string, string> = {
  recurring: "bg-blue-400/10 text-blue-400",
  meeting: "bg-purple-400/10 text-purple-400",
  task: "bg-amber-400/10 text-amber-400",
  deployment: "bg-emerald-400/10 text-emerald-400",
};

export function CalendarView() {
  const days: Record<string, CalendarEvent[]> = {};
  for (const e of mockEvents) {
    if (!days[e.date]) days[e.date] = [];
    days[e.date].push(e);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> This Week
          </CardTitle>
          <Badge variant="secondary">{mockEvents.length} events</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {Object.entries(days).map(([date, events]) => (
              <div key={date}>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </div>
                <div className="space-y-1.5">
                  {events.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground w-16 shrink-0">
                        <Clock className="w-3 h-3" />
                        {e.time}
                      </div>
                      <span className="text-xs font-medium flex-1">{e.title}</span>
                      <span className="text-[10px] text-muted-foreground">{e.duration}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${typeColors[e.type] || ""}`}>{e.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
