"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statLabels = [
  { key: "totalAgents", label: "Total agents" },
  { key: "activeAgents", label: "Active agents" },
  { key: "runningTasks", label: "Running tasks" },
  { key: "totalTokensToday", label: "Tokens today" },
  { key: "totalCostToday", label: "Est. cost" },
] as const;

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

function LoadingCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 w-28 rounded bg-white/10" />
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="h-7 w-16 rounded bg-white/10" />
        <div className="h-5 w-12 rounded bg-white/10" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.stats.dashboard);

  return (
    <div>
      <PageHeader
        title="Command Dashboard"
        description="Real-time snapshot of the Kohelet agentic operating system."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {stats === undefined
          ? statLabels.map((stat) => <LoadingCard key={stat.key} />)
          : statLabels.map((stat) => {
              const rawValue = stats[stat.key];
              const value =
                stat.key === "totalCostToday"
                  ? formatCurrency(rawValue)
                  : formatCompact(rawValue);
              return (
                <Card key={stat.key}>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-white">
                      {value}
                    </div>
                    <Badge variant="secondary">Live</Badge>
                  </CardContent>
                </Card>
              );
            })}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Operations Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {stats === undefined ? (
              <div className="space-y-3">
                <div className="h-12 rounded-lg bg-white/5" />
                <div className="h-12 rounded-lg bg-white/5" />
                <div className="h-12 rounded-lg bg-white/5" />
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                No completed tasks yet. Activity will appear here as work finishes.
              </div>
            ) : (
              stats.recentActivity.map((task) => (
                <div
                  key={task._id}
                  className="rounded-lg border border-white/5 bg-white/5 p-4"
                >
                  <div className="text-white">{task.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Completed {task.completedAt ? new Date(task.completedAt).toUTCString() : "recently"}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Convex latency</span>
              <span className="text-white">42ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Clerk auth</span>
              <span className="text-emerald-400">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Schedulers</span>
              <span className="text-white">4 running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
