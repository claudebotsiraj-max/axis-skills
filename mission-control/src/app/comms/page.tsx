"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { CommsView } from "@/components/comms-view";
import { CrmView } from "@/components/crm-view";

const tabs = [
  { id: "comms", label: "Comms" },
  { id: "crm", label: "CRM" },
];

function CommsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "comms";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Communications</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Messages, notifications & client pipeline</p>
      </div>
      <TabBar tabs={tabs} layoutId="comms-tabs" />
      {tab === "comms" && <CommsView />}
      {tab === "crm" && <CrmView />}
    </div>
  );
}

export default function CommsPage() {
  return (
    <Suspense>
      <CommsContent />
    </Suspense>
  );
}
