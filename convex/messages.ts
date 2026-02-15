import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    sessionId: v.id("sessions"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, role, content }) => {
    return await ctx.db.insert("messages", {
      sessionId,
      role,
      content,
      timestamp: Date.now(),
    });
  },
});
