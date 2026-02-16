import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { stage: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.stage) {
      return await ctx.db
        .query("contacts")
        .withIndex("by_stage", (q) => q.eq("stage", args.stage!))
        .collect();
    }
    return await ctx.db.query("contacts").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    stage: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contacts"),
    stage: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, filtered);
  },
});
