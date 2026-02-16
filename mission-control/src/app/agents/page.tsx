"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { AgentsView } from "@/components/agents-view";
import { ModelsView } from "@/components/models-view";

const tabs = [
  { id: "agents", label: "Agents" },
  { id: "models", label: "Models" },
];

function AgentsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "agents";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Agents</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Agent fleet & model inventory</p>
      </div>
      <TabBar tabs={tabs} layoutId="agents-tabs" />
      {tab === "agents" && <AgentsView />}
      {tab === "models" && <ModelsView />}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense>
      <AgentsContent />
    </Suspense>
  );
}
