"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bell, Send as SendIcon } from "lucide-react";

interface CommItem {
  id: string;
  platform: string;
  from: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockComms: CommItem[] = [
  { id: "1", platform: "discord", from: "DevServer", message: "New PR #42 ready for review — mission control dashboard", timestamp: "2026-02-13T21:30:00Z", read: false },
  { id: "2", platform: "telegram", from: "Salah", message: "Hey, can you check the client proposal?", timestamp: "2026-02-13T20:00:00Z", read: false },
  { id: "3", platform: "discord", from: "BuildBot", message: "Deploy succeeded: mission-control@v0.1.0", timestamp: "2026-02-13T19:00:00Z", read: true },
  { id: "4", platform: "telegram", from: "Calendar Bot", message: "Reminder: Client call in 1 hour", timestamp: "2026-02-13T13:00:00Z", read: true },
  { id: "5", platform: "discord", from: "AI-General", message: "Cool article about agent memory systems shared by @user", timestamp: "2026-02-12T22:00:00Z", read: true },
];

const platformIcon: Record<string, string> = {
  discord: "🟣",
  telegram: "🔵",
};

export function CommsView() {
  const unread = mockComms.filter((c) => !c.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" /> Communications
          </CardTitle>
          {unread > 0 && <Badge variant="destructive">{unread} unread</Badge>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockComms.map((c) => (
              <div
                key={c.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${!c.read ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
              >
                <span className="text-sm">{platformIcon[c.platform] || "💬"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{c.from}</span>
                    <Badge variant="outline" className="text-[8px]">{c.platform}</Badge>
                    {!c.read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.message}</p>
                </div>
                <span className="text-[9px] text-muted-foreground shrink-0">
                  {new Date(c.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
