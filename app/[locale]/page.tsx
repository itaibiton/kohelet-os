"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statCards = [
  {
    key: "totalAgents",
    label: "Total Agents",
    icon: "🤖",
    format: "agents",
    spark: [6, 10, 9, 14, 12, 16, 18, 15],
    accent: "#1B6B6D",
  },
  {
    key: "runningTasks",
    label: "Running Tasks",
    icon: "📋",
    format: "number",
    spark: [3, 5, 4, 7, 6, 8, 7, 9],
    accent: "#C4875A",
  },
  {
    key: "totalTokensToday",
    label: "Tokens Today",
    icon: "⚡",
    format: "compact",
    spark: [12, 18, 16, 20, 24, 22, 28, 30],
    accent: "#38BDF8",
  },
  {
    key: "totalCostToday",
    label: "Est. Cost Today",
    icon: "💰",
    format: "currency",
    spark: [4, 6, 5, 9, 7, 10, 8, 12],
    accent: "#34D399",
  },
] as const;

const statusDot: Record<string, string> = {
  active: "bg-emerald-400",
  running: "bg-emerald-400",
  idle: "bg-yellow-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
  todo: "bg-zinc-400",
  in_progress: "bg-blue-400",
  review: "bg-yellow-400",
  done: "bg-emerald-400",
};

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatRelative(timestamp?: number) {
  if (!timestamp) return "--";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Sparkline({ data, accent }: { data: readonly number[]; accent: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 30 - ((value - min) / range) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 30" className="h-10 w-full">
      <polyline
        fill="none"
        stroke={accent}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingCard() {
  return (
    <Card className="border border-white/5 bg-white/[0.03]">
      <CardHeader>
        <div className="h-4 w-28 rounded bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-8 w-24 rounded bg-white/10" />
        <div className="h-3 w-16 rounded bg-white/10" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const stats = useQuery(api.stats.dashboard);
  const agents = useQuery(api.agents.list);

  const agentsByDepartment = useMemo(() => {
    if (!agents) return [] as Array<[string, typeof agents]>;
    const grouped = new Map<string, typeof agents>();
    agents.forEach((agent) => {
      const list = grouped.get(agent.department) ?? [];
      list.push(agent);
      grouped.set(agent.department, list);
    });
    return Array.from(grouped.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [agents]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Command Dashboard"
        description="Real-time snapshot of the Kohelet agentic operating system."
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {stats === undefined
          ? statCards.map((stat) => <LoadingCard key={stat.key} />)
          : statCards.map((stat) => {
              const rawValue = stats[stat.key];
              const value =
                stat.format === "currency"
                  ? formatCurrency(rawValue)
                  : stat.format === "compact"
                    ? formatCompact(rawValue)
                    : stat.format === "agents"
                      ? `${stats.activeAgents}/${stats.totalAgents}`
                      : rawValue.toLocaleString();
              const label =
                stat.format === "agents"
                  ? `${stats.activeAgents}/${stats.totalAgents} active`
                  : stat.label;
              return (
                <Card key={stat.key} className="border border-white/5 bg-[#0f1224]/80">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-zinc-400">
                      {stat.label}
                    </CardTitle>
                    <span className="text-lg">{stat.icon}</span>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-semibold text-white">
                      {value}
                    </div>
                    <div className="text-xs text-zinc-500">{label}</div>
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                      <Sparkline data={stat.spark} accent={stat.accent} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="border border-white/5 bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Agent Status Grid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {agents === undefined ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 rounded-xl bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              agentsByDepartment.map(([department, deptAgents]) => (
                <div key={department} className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {department}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {deptAgents?.map((agent) => (
                      <Link
                        key={agent._id}
                        href={`/${locale}/agents/${agent._id}`}
                        className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:shadow-[0_0_18px_rgba(27,107,109,0.2)]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{agent.emoji}</span>
                          <span>{agent.name}</span>
                        </span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            statusDot[agent.status] ?? "bg-zinc-500"
                          }`}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-white/5 bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats === undefined ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-12 rounded-lg bg-white/10 animate-pulse" />
                  ))}
                </div>
              ) : stats.recentActivity.length === 0 ? (
                <div className="rounded-lg border border-white/5 bg-white/5 p-4 text-sm text-zinc-400">
                  No completed tasks yet. Activity will appear here as work finishes.
                </div>
              ) : (
                stats.recentActivity.map((task) => {
                  const agent = agents?.find((item) => item._id === task.assignedTo);
                  return (
                    <div key={task._id} className="flex gap-3">
                      <div className="mt-1 flex flex-col items-center">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            statusDot[task.status] ?? "bg-zinc-500"
                          }`}
                        />
                        <span className="mt-2 h-full w-px bg-white/10" />
                      </div>
                      <div className="flex-1 rounded-lg border border-white/5 bg-white/[0.04] p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">
                            {task.title}
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {agent ? `${agent.emoji} ${agent.name}` : "Unassigned"} · {formatRelative(task.completedAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="border border-white/5 bg-white/[0.03]">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Convex status", ok: true, value: "Operational" },
                { label: "Clerk auth", ok: true, value: "Operational" },
                { label: "OpenClaw gateway", ok: true, value: "Connected" },
                { label: "Email listener", ok: false, value: "Offline" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  <span className={item.ok ? "text-emerald-400" : "text-red-400"}>
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
