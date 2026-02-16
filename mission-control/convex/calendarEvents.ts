import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("calendarEvents").withIndex("by_date").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEvents", args);
  },
});
