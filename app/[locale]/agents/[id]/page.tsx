"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const statusColor: Record<string, string> = {
  active: "bg-emerald-400",
  running: "bg-emerald-400",
  idle: "bg-yellow-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AgentDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const agent = useQuery(api.agents.get, id ? { id: id as Id<"agents"> } : "skip");
  const agents = useQuery(api.agents.list);

  const reportsTo = useMemo(() => {
    if (!agent?.reportsTo || !agents) return null;
    return agents.find((item) => item._id === agent.reportsTo) ?? null;
  }, [agent, agents]);

  if (agent === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 animate-pulse">
            <CardContent className="h-40" />
          </Card>
          <Card className="animate-pulse">
            <CardContent className="h-40" />
          </Card>
        </div>
      </div>
    );
  }

  if (agent === null) {
    return (
      <div>
        <PageHeader title="Agent not found" description="No agent matches this ID." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`${agent.name} — Agent Profile`}
        description="Soul, memory, and recent activity."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{agent.emoji}</span>
              <div>
                <div className="text-xl font-semibold text-white">
                  {agent.name}
                </div>
                <div className="text-sm text-muted-foreground">{agent.role}</div>
              </div>
              <span
                className={`ml-auto h-2.5 w-2.5 rounded-full ${
                  statusColor[agent.status] ?? "bg-zinc-500"
                }`}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{agent.persona}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{agent.tier}</Badge>
              <Badge variant="secondary">{agent.department}</Badge>
              <Badge variant="secondary">primary: {agent.primaryModel}</Badge>
              {agent.secondaryModel && (
                <Badge variant="secondary">secondary: {agent.secondaryModel}</Badge>
              )}
              {agent.fallbackModel && (
                <Badge variant="secondary">fallback: {agent.fallbackModel}</Badge>
              )}
            </div>
            {reportsTo && (
              <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-xs">
                Reports to {reportsTo.emoji} {reportsTo.name}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Total tokens</span>
              <span className="text-white">
                {agent.totalTokens ? agent.totalTokens.toLocaleString() : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total cost</span>
              <span className="text-white">
                {formatCurrency(agent.totalCost ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              Sessions will appear here as {agent.name} works.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Threads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              No active threads assigned.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
