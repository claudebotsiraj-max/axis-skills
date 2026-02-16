"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusDot, formatRelativeTime } from "@/lib/utils";
import type { ServerHealth, AgentInfo, CronJob, RevenueEntry, ContentItem } from "@/lib/types";
import {
  Activity,
  Bot,
  Clock,
  DollarSign,
  FileText,
  Server,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      LIVE
    </div>
  );
}

function SystemHealthCard() {
  const { data } = useApi<{ servers: ServerHealth[] }>("/api/system-state", 15000);
  const servers = data?.servers || [];
  const allHealthy = servers.every((s) => s.status === "healthy");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5" /> System Health
        </CardTitle>
        <LiveIndicator />
      </CardHeader>
      <CardContent>
        {allHealthy && (
          <div className="text-emerald-400 text-lg font-semibold mb-3">All Systems Nominal</div>
        )}
        <div className="space-y-2.5">
          {servers.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusDot(s.status)}`} />
                <span className="text-xs">{s.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{s.responseTime}ms</span>
                <span>{s.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AgentStatusCard() {
  const { data } = useApi<AgentInfo[]>("/api/agents", 15000);
  const agents = data || [];
  const active = agents.filter((a) => a.status === "active").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-3.5 h-3.5" /> Agents
        </CardTitle>
        <Badge variant="success">{active} active</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusDot(a.status)}`} />
                <span className="text-xs font-medium">{a.name}</span>
                <span className="text-[10px] text-muted-foreground">{a.role}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{formatRelativeTime(a.lastActive)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CronHealthCard() {
  const { data } = useApi<CronJob[]>("/api/cron-health", 15000);
  const crons = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Cron Jobs
        </CardTitle>
        <Badge variant="secondary">{crons.length} jobs</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {crons.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusDot(c.status)}`} />
                <span className="text-xs">{c.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{c.schedule}</span>
                <span>{c.duration ? `${(c.duration / 1000).toFixed(1)}s` : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueCard() {
  const { data } = useApi<RevenueEntry[]>("/api/revenue", 15000);
  const entries = data || [];
  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-zinc-400" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5" /> Revenue
        </CardTitle>
        <Badge variant="default">${total.toLocaleString()}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {entries.map((e) => (
            <div key={e.source} className="flex items-center justify-between">
              <span className="text-xs">{e.source}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">${e.amount.toLocaleString()}</span>
                <TrendIcon trend={e.trend} />
                {e.changePercent !== undefined && e.changePercent !== 0 && (
                  <span className={`text-[10px] ${e.changePercent > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {e.changePercent > 0 ? "+" : ""}{e.changePercent}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContentPipelineCard() {
  const { data } = useApi<ContentItem[]>("/api/content-pipeline", 15000);
  const items = data || [];
  const byStatus = items.reduce(
    (acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" /> Content Pipeline
        </CardTitle>
        <Badge variant="secondary">{items.length} items</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {["idea", "drafting", "review", "scheduled", "published"].map((s) => (
            <div key={s} className="text-center">
              <div className="text-lg font-semibold">{byStatus[s] || 0}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{s}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {items.slice(0, 4).map((i) => (
            <div key={i.id} className="flex items-center justify-between text-xs">
              <span className="truncate">{i.title}</span>
              <Badge variant="outline" className="ml-2 shrink-0">{i.platform}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsCard() {
  const { data: agents } = useApi<AgentInfo[]>("/api/agents", 15000);
  const { data: crons } = useApi<CronJob[]>("/api/cron-health", 15000);
  const { data: revenue } = useApi<RevenueEntry[]>("/api/revenue", 15000);

  const stats = [
    { label: "Active Agents", value: agents?.filter((a) => a.status === "active").length || 0, icon: Bot },
    { label: "Cron Jobs", value: crons?.length || 0, icon: Clock },
    { label: "Monthly Revenue", value: `$${(revenue?.reduce((s, e) => s + e.amount, 0) || 0).toLocaleString()}`, icon: DollarSign },
    { label: "System Status", value: "Nominal", icon: Zap },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <motion.div variants={item}><SystemHealthCard /></motion.div>
      <motion.div variants={item}><AgentStatusCard /></motion.div>
      <motion.div variants={item}><CronHealthCard /></motion.div>
      <motion.div variants={item}><RevenueCard /></motion.div>
      <motion.div variants={item}><ContentPipelineCard /></motion.div>
      <motion.div variants={item}><QuickStatsCard /></motion.div>
    </motion.div>
  );
}
