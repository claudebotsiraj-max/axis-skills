"use client";

import { DashboardOverview } from "@/components/dashboard-overview";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time system overview</p>
        </div>
      </div>
      <DashboardOverview />
    </div>
  );
}
