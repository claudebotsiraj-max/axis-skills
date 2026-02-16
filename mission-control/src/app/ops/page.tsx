"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TabBar } from "@/components/tab-bar";
import { OpsView } from "@/components/ops-view";
import { SuggestedTasksView } from "@/components/suggested-tasks-view";
import { CalendarView } from "@/components/calendar-view";

const tabs = [
  { id: "operations", label: "Operations" },
  { id: "tasks", label: "Tasks" },
  { id: "calendar", label: "Calendar" },
];

function OpsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "operations";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Operations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">System operations & task management</p>
      </div>
      <TabBar tabs={tabs} layoutId="ops-tabs" />
      {tab === "operations" && <OpsView />}
      {tab === "tasks" && <SuggestedTasksView />}
      {tab === "calendar" && <CalendarView />}
    </div>
  );
}

export default function OpsPage() {
  return (
    <Suspense>
      <OpsContent />
    </Suspense>
  );
}
