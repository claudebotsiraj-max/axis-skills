"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

export function TabBar({ tabs, layoutId }: { tabs: Tab[]; layoutId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || tabs[0]?.id;

  return (
    <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tab.id);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className={cn(
            "relative px-4 py-1.5 text-xs font-medium rounded-lg transition-colors",
            currentTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {currentTab === tab.id && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 bg-white/[0.06] rounded-lg"
              transition={{ type: "spring" as const, bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
