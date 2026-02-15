import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, { department }) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_department", (q) => q.eq("department", department))
      .collect();
  },
});

export const getByTier = query({
  args: { tier: v.union(v.literal("csuite"), v.literal("manager"), v.literal("worker")) },
  handler: async (ctx, { tier }) => {
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("tier"), tier))
      .collect();
  },
});

export const getChildren = query({
  args: { parentId: v.id("agents") },
  handler: async (ctx, { parentId }) => {
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("reportsTo"), parentId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    tier: v.union(v.literal("csuite"), v.literal("manager"), v.literal("worker")),
    department: v.string(),
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
    reportsTo: v.optional(v.id("agents")),
    lastActiveAt: v.optional(v.number()),
    sessionKey: v.optional(v.string()),
    totalTokens: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("running"),
      v.literal("error"),
      v.literal("offline")
    ),
    lastActiveAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, lastActiveAt }) => {
    await ctx.db.patch(id, {
      status,
      ...(lastActiveAt !== undefined ? { lastActiveAt } : {}),
    });
  },
});

export const updateTokens = mutation({
  args: { id: v.id("agents"), tokens: v.number(), cost: v.number() },
  handler: async (ctx, { id, tokens, cost }) => {
    const agent = await ctx.db.get(id);
    if (!agent) return;
    await ctx.db.patch(id, {
      totalTokens: (agent.totalTokens ?? 0) + tokens,
      totalCost: (agent.totalCost ?? 0) + cost,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
