import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWorkspacePath(): string {
  return process.env.WORKSPACE_PATH || `${process.env.HOME}/.openclaw/workspace`;
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "healthy":
    case "online":
    case "active":
    case "running":
      return "text-emerald-400";
    case "warning":
    case "degraded":
      return "text-amber-400";
    case "error":
    case "offline":
    case "down":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

export function statusDot(status: string): string {
  switch (status.toLowerCase()) {
    case "healthy":
    case "online":
    case "active":
    case "running":
      return "bg-emerald-400";
    case "warning":
    case "degraded":
      return "bg-amber-400";
    case "error":
    case "offline":
    case "down":
      return "bg-red-400";
    default:
      return "bg-zinc-400";
  }
}
