import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Activities
    const activities = [
      { type: "system", content: "Mission control dashboard deployed", source: "deploy", timestamp: Date.now() - 3600000 },
      { type: "agent", content: "Heartbeat check completed — all systems nominal", source: "cron", timestamp: Date.now() - 1800000 },
      { type: "chat", content: "New conversation started on webchat", source: "webchat", timestamp: Date.now() - 900000 },
      { type: "content", content: "Blog post draft saved: AI Agent Architecture", source: "writer", timestamp: Date.now() - 7200000 },
    ];
    for (const a of activities) await ctx.db.insert("activities", a);

    // Calendar Events
    const events = [
      { title: "Standup", date: "2026-02-14", time: "09:00", duration: "15m", type: "recurring" },
      { title: "Client Call - Acme Corp", date: "2026-02-14", time: "14:00", duration: "60m", type: "meeting" },
      { title: "Content Review", date: "2026-02-15", time: "10:00", duration: "30m", type: "task" },
      { title: "Deploy v2.1", date: "2026-02-15", time: "16:00", duration: "45m", type: "deployment" },
      { title: "Weekly Retro", date: "2026-02-16", time: "11:00", duration: "45m", type: "recurring" },
    ];
    for (const e of events) await ctx.db.insert("calendarEvents", e);

    // Tasks
    const tasks = [
      { title: "Set up CI/CD pipeline", status: "todo", priority: "high", category: "Engineering", createdAt: Date.now(), updatedAt: Date.now() },
      { title: "Write blog post about agent memory", status: "in-progress", priority: "medium", category: "Content", createdAt: Date.now(), updatedAt: Date.now() },
      { title: "Review client proposals", status: "todo", priority: "high", category: "Business", createdAt: Date.now(), updatedAt: Date.now() },
    ];
    for (const t of tasks) await ctx.db.insert("tasks", t);

    // Contacts
    const contacts = [
      { name: "John Smith", email: "john@acme.com", company: "Acme Corp", stage: "active", createdAt: Date.now() },
      { name: "Sarah Lee", email: "sarah@startupxyz.io", company: "Startup XYZ", stage: "prospect", createdAt: Date.now() },
      { name: "Mike Johnson", email: "mike@bigco.com", company: "BigCo Inc", stage: "lead", createdAt: Date.now() },
    ];
    for (const c of contacts) await ctx.db.insert("contacts", c);

    // Content Drafts
    const drafts = [
      { title: "AI Agent Architecture Deep Dive", platform: "blog", status: "idea", createdAt: Date.now(), updatedAt: Date.now() },
      { title: "Building Mission Control with Next.js 15", platform: "blog", status: "drafting", createdAt: Date.now(), updatedAt: Date.now() },
      { title: "Weekly Newsletter #42", platform: "email", status: "review", createdAt: Date.now(), updatedAt: Date.now() },
    ];
    for (const d of drafts) await ctx.db.insert("contentDrafts", d);

    // Ecosystem Products
    const products = [
      { slug: "openclaw", name: "OpenClaw", tagline: "AI Agent Runtime", status: "live", description: "Core runtime for AI agents", stack: ["TypeScript", "Node.js"] },
      { slug: "mission-control", name: "Mission Control", tagline: "Agent Dashboard", status: "beta", description: "Real-time monitoring dashboard", stack: ["Next.js", "Convex"] },
      { slug: "voice-bridge", name: "Voice Bridge", tagline: "Phone AI Integration", status: "dev", description: "Voice automation via Vapi.ai", stack: ["Vapi.ai", "Twilio"] },
      { slug: "memory-engine", name: "Memory Engine", tagline: "Persistent Agent Memory", status: "live", description: "File and DB backed memory", stack: ["Markdown", "Convex"] },
    ];
    for (const p of products) await ctx.db.insert("ecosystemProducts", p);

    return "Seed data inserted successfully";
  },
});
