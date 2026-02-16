import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("contentDrafts")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("contentDrafts").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    platform: v.string(),
    status: v.string(),
    body: v.optional(v.string()),
    author: v.optional(v.string()),
    scheduledFor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentDrafts", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contentDrafts"),
    status: v.optional(v.string()),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});
