import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("crons").collect();
  },
});

export const getEnabled = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("crons")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    cronId: v.optional(v.string()),
    schedule: v.string(),
    agentId: v.optional(v.id("agents")),
    enabled: v.boolean(),
    lastRun: v.optional(v.number()),
    lastOutput: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crons", args);
  },
});

export const toggle = mutation({
  args: { id: v.id("crons"), enabled: v.boolean() },
  handler: async (ctx, { id, enabled }) => {
    await ctx.db.patch(id, { enabled });
  },
});

export const updateLastRun = mutation({
  args: { id: v.id("crons"), output: v.string() },
  handler: async (ctx, { id, output }) => {
    await ctx.db.patch(id, { lastRun: Date.now(), lastOutput: output });
  },
});

export const remove = mutation({
  args: { id: v.id("crons") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
