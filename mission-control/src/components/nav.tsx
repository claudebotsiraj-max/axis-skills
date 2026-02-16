"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings2,
  Bot,
  MessageSquare,
  FileText,
  Radio,
  BookOpen,
  Code2,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/ops", label: "Ops", icon: Settings2 },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/comms", label: "Comms", icon: Radio },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/code", label: "Code", icon: Code2 },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center h-12 gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 mr-4 shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span className="font-semibold text-xs tracking-wide hidden sm:inline">
              MISSION CONTROL
            </span>
          </Link>
          <div className="flex flex-1 gap-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                    "text-[clamp(0.45rem,0.75vw,0.6875rem)] font-medium",
                    isActive
                      ? "text-primary bg-primary/[0.06]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
