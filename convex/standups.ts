import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("standups").order("desc").collect();
  },
});

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("standups")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "scheduled"),
          q.eq(q.field("status"), "in_progress")
        )
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    participants: v.array(v.id("agents")),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("standups", args);
  },
});

export const complete = mutation({
  args: {
    id: v.id("standups"),
    transcript: v.string(),
    actionItems: v.array(v.string()),
    audioUrl: v.optional(v.string()),
  },
  handler: async (ctx, { id, transcript, actionItems, audioUrl }) => {
    await ctx.db.patch(id, {
      status: "completed",
      transcript,
      actionItems,
      ...(audioUrl !== undefined ? { audioUrl } : {}),
      completedAt: Date.now(),
    });
  },
});
