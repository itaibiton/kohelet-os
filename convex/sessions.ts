import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").order("desc").take(50);
  },
});

export const getByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const end = mutation({
  args: { id: v.id("sessions"), summary: v.optional(v.string()) },
  handler: async (ctx, { id, summary }) => {
    await ctx.db.patch(id, {
      status: "completed",
      endedAt: Date.now(),
      ...(summary !== undefined ? { summary } : {}),
    });
  },
});

export const updateTokens = mutation({
  args: { id: v.id("sessions"), tokenCount: v.number(), cost: v.number() },
  handler: async (ctx, { id, tokenCount, cost }) => {
    const session = await ctx.db.get(id);
    if (!session) return;
    await ctx.db.patch(id, {
      tokenCount: (session.tokenCount ?? 0) + tokenCount,
      cost: (session.cost ?? 0) + cost,
    });
  },
});
