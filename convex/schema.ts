import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    tier: v.union(v.literal("csuite"), v.literal("manager"), v.literal("worker")),
    department: v.string(),
    reportsTo: v.optional(v.id("agents")),
    persona: v.string(),
    primaryModel: v.string(),
    secondaryModel: v.optional(v.string()),
    fallbackModel: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("running"),
      v.literal("error"),
      v.literal("offline")
    ),
    lastActiveAt: v.optional(v.number()),
    sessionKey: v.optional(v.string()),
    totalTokens: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    avatar: v.optional(v.string()),
  })
    .index("by_department", ["department"])
    .index("by_status", ["status"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assignedTo: v.optional(v.id("agents")),
    createdBy: v.optional(v.id("agents")),
    department: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    output: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  sessions: defineTable({
    agentId: v.id("agents"),
    openclawSessionKey: v.optional(v.string()),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("error")
    ),
    tokenCount: v.optional(v.number()),
    cost: v.optional(v.number()),
    summary: v.optional(v.string()),
  }).index("by_agent", ["agentId"]),

  messages: defineTable({
    sessionId: v.id("sessions"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_session", ["sessionId"]),

  standups: defineTable({
    title: v.string(),
    participants: v.array(v.id("agents")),
    transcript: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),
    audioUrl: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    scheduledAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  }).index("by_status", ["status"]),

  crons: defineTable({
    name: v.string(),
    cronId: v.optional(v.string()),
    schedule: v.string(),
    agentId: v.optional(v.id("agents")),
    enabled: v.boolean(),
    lastRun: v.optional(v.number()),
    lastOutput: v.optional(v.string()),
  })
    .index("by_agent", ["agentId"])
    .index("by_enabled", ["enabled"]),

  memory: defineTable({
    agentId: v.id("agents"),
    key: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_key", ["key"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("ceo"), v.literal("admin"), v.literal("viewer")),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk", ["clerkId"]),
});
