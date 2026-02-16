import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    type: v.string(),
    content: v.string(),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  calendarEvents: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
  }).index("by_date", ["date"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    category: v.optional(v.string()),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]),

  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    stage: v.string(),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_stage", ["stage"]),

  contentDrafts: defineTable({
    title: v.string(),
    platform: v.string(),
    status: v.string(),
    body: v.optional(v.string()),
    author: v.optional(v.string()),
    scheduledFor: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]),

  ecosystemProducts: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    status: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    stack: v.optional(v.array(v.string())),
  }).index("by_slug", ["slug"]),
});
