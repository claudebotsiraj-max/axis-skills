"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { KnowledgeBase } from "@/components/knowledge-base";
import { EcosystemView } from "@/components/ecosystem-view";

const tabs = [
  { id: "knowledge", label: "Knowledge" },
  { id: "ecosystem", label: "Ecosystem" },
];

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "knowledge";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Knowledge</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Knowledge base & product ecosystem</p>
      </div>
      <TabBar tabs={tabs} layoutId="knowledge-tabs" />
      {tab === "knowledge" && <KnowledgeBase />}
      {tab === "ecosystem" && <EcosystemView />}
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense>
      <KnowledgeContent />
    </Suspense>
  );
}
