import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("memory")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();
  },
});

export const get = query({
  args: { agentId: v.id("agents"), key: v.string() },
  handler: async (ctx, { agentId, key }) => {
    return await ctx.db
      .query("memory")
      .withIndex("by_key", (q) => q.eq("key", key))
      .filter((q) => q.eq(q.field("agentId"), agentId))
      .first();
  },
});

export const set = mutation({
  args: { agentId: v.id("agents"), key: v.string(), value: v.string() },
  handler: async (ctx, { agentId, key, value }) => {
    const existing = await ctx.db
      .query("memory")
      .withIndex("by_key", (q) => q.eq("key", key))
      .filter((q) => q.eq(q.field("agentId"), agentId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value, updatedAt: Date.now() });
      return existing._id;
    }

    return await ctx.db.insert("memory", {
      agentId,
      key,
      value,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { agentId: v.id("agents"), key: v.string() },
  handler: async (ctx, { agentId, key }) => {
    const existing = await ctx.db
      .query("memory")
      .withIndex("by_key", (q) => q.eq("key", key))
      .filter((q) => q.eq(q.field("agentId"), agentId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
