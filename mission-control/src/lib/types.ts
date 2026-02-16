export interface ServerHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  url: string;
  lastCheck: string;
  responseTime?: number;
  uptime?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "offline";
  model: string;
  lastActive: string;
  channels: string[];
  soulExcerpt?: string;
  rulesExcerpt?: string;
  subAgents?: string[];
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "healthy" | "warning" | "error";
  duration?: number;
}

export interface RevenueEntry {
  source: string;
  amount: number;
  currency: string;
  period: string;
  trend: "up" | "down" | "flat";
  changePercent?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: "idea" | "drafting" | "review" | "scheduled" | "published";
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  source?: string;
}

export interface Observation {
  timestamp: string;
  content: string;
  source?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  channel?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  channel: string;
  lastMessage: string;
  messageCount: number;
  updatedAt: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  stage: "lead" | "prospect" | "active" | "churned";
  value?: string;
  lastContact?: string;
  notes?: string;
}

export interface RepoInfo {
  name: string;
  path: string;
  branch: string;
  lastCommit: string;
  lastCommitDate: string;
  dirty: boolean;
  ahead?: number;
  behind?: number;
}

export interface KnowledgeEntry {
  path: string;
  title: string;
  excerpt: string;
  category: string;
  modifiedAt: string;
}

export interface EcosystemProduct {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "beta" | "dev" | "planned";
  url?: string;
  description?: string;
  stack?: string[];
}

export interface ModelInfo {
  id: string;
  provider: string;
  name: string;
  contextWindow: string;
  costPer1k: string;
  speed: "fast" | "medium" | "slow";
  capabilities: string[];
}
