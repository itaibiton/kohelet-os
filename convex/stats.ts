import { query } from "./_generated/server";

export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const sessions = await ctx.db.query("sessions").collect();

    const totalAgents = agents.length;
    const activeAgents = agents.filter((agent) =>
      agent.status === "active" || agent.status === "running"
    ).length;

    const runningTasks = tasks.filter(
      (task) => task.status === "in_progress"
    ).length;

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const startTs = startOfToday.getTime();

    let totalTokensToday = 0;
    let totalCostToday = 0;
    for (const session of sessions) {
      if (session.startedAt >= startTs) {
        totalTokensToday += session.tokenCount ?? 0;
        totalCostToday += session.cost ?? 0;
      }
    }

    const recentActivity = tasks
      .filter((task) => task.status === "done" && task.completedAt !== undefined)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
      .slice(0, 10);

    return {
      totalAgents,
      activeAgents,
      runningTasks,
      totalTokensToday,
      totalCostToday,
      recentActivity,
    };
  },
});
