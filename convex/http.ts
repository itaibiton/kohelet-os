import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// POST /api/agent-status — update agent status
// Body: { name: string, status: "active"|"idle"|"running"|"error", tokens?: number, cost?: number }
http.route({
  path: "/api/agent-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as any;
    const { name, status, tokens, cost } = body;

    // Find agent by name
    const agents = await ctx.runQuery(api.agents.list);
    const agent = agents.find((a) => a.name.toLowerCase() === name.toLowerCase());
    if (!agent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), { status: 404 });
    }

    // Update status
    await ctx.runMutation(api.agents.updateStatus, {
      id: agent._id,
      status,
      lastActiveAt: Date.now(),
    });

    // Update tokens if provided
    if (tokens || cost) {
      await ctx.runMutation(api.agents.updateTokens, {
        id: agent._id,
        tokens: tokens ?? 0,
        cost: cost ?? 0,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }),
});

// POST /api/session-log — log a completed session
// Body: { agentName: string, sessionKey?: string, tokenCount: number, cost: number, summary?: string }
http.route({
  path: "/api/session-log",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as any;
    const { agentName, sessionKey, tokenCount, cost, summary } = body;

    const agents = await ctx.runQuery(api.agents.list);
    const agent = agents.find((a) => a.name.toLowerCase() === agentName.toLowerCase());
    if (!agent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), { status: 404 });
    }

    await ctx.runMutation(api.sessions.create, {
      agentId: agent._id,
      openclawSessionKey: sessionKey,
      startedAt: Date.now(),
      status: "completed",
      tokenCount,
      cost,
      summary,
    });

    // Also update agent totals
    await ctx.runMutation(api.agents.updateTokens, {
      id: agent._id,
      tokens: tokenCount,
      cost,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }),
});

// POST /api/task — create or update a task
// Body: { title, description?, status?, priority?, agentName?, department? }
http.route({
  path: "/api/task",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as any;
    const { title, description, status, priority, agentName, department } = body;

    let assignedTo = undefined;
    if (agentName) {
      const agents = await ctx.runQuery(api.agents.list);
      const agent = agents.find((a) => a.name.toLowerCase() === agentName.toLowerCase());
      if (agent) assignedTo = agent._id;
    }

    await ctx.runMutation(api.tasks.create, {
      title,
      description,
      status: status ?? "todo",
      priority: priority ?? "medium",
      assignedTo,
      department,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }),
});

// POST /api/cron — create a cron entry
// Body: { name: string, schedule: string, agentName?: string, cronId?: string, enabled?: boolean }
http.route({
  path: "/api/cron",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = (await request.json()) as any;
    const { name, schedule, agentName, cronId, enabled } = body;

    let agentId = undefined;
    if (agentName) {
      const agents = await ctx.runQuery(api.agents.list);
      const agent = agents.find((a) => a.name.toLowerCase() === agentName.toLowerCase());
      if (agent) agentId = agent._id;
    }

    await ctx.runMutation(api.cronJobs.create, {
      name,
      schedule,
      cronId,
      agentId,
      enabled: enabled ?? true,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }),
});

// GET /api/stats — get dashboard stats (for external polling)
http.route({
  path: "/api/stats",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const stats = await ctx.runQuery(api.stats.dashboard);
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
