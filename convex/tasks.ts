import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
  },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});

export const getByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("assignedTo"), agentId))
      .collect();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, completedAt }) => {
    await ctx.db.patch(id, {
      status,
      ...(completedAt !== undefined ? { completedAt } : {}),
    });
  },
});

export const assign = mutation({
  args: { id: v.id("tasks"), agentId: v.id("agents") },
  handler: async (ctx, { id, agentId }) => {
    await ctx.db.patch(id, { assignedTo: agentId });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
