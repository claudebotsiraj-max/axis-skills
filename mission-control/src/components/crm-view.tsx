"use client";

import { motion } from "framer-motion";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClientInfo } from "@/lib/types";
import { Users, DollarSign } from "lucide-react";

const stages: { key: ClientInfo["stage"]; label: string; color: string }[] = [
  { key: "lead", label: "Leads", color: "text-zinc-400" },
  { key: "prospect", label: "Prospects", color: "text-blue-400" },
  { key: "active", label: "Active", color: "text-emerald-400" },
  { key: "churned", label: "Churned", color: "text-red-400" },
];

export function CrmView() {
  const { data } = useApi<ClientInfo[]>("/api/clients", 30000);
  const clients = data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageClients = clients.filter((c) => c.stage === stage.key);
          return (
            <div key={stage.key} className="min-w-[240px] flex-1">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-[10px] font-semibold uppercase ${stage.color}`}>{stage.label}</span>
                <Badge variant="secondary" className="text-[9px]">{stageClients.length}</Badge>
              </div>
              <div className="space-y-2">
                {stageClients.map((client) => (
                  <Card key={client.id} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{client.name}</span>
                      </div>
                      {client.value && (
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400">{client.value}</span>
                        </div>
                      )}
                      {client.notes && (
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{client.notes}</p>
                      )}
                      {client.lastContact && (
                        <span className="text-[9px] text-muted-foreground mt-1 inline-block">Last contact: {client.lastContact}</span>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {stageClients.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-white/[0.06] text-center">
                    <span className="text-[10px] text-muted-foreground">No clients</span>
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
