"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusVariant: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-200",
  completed: "bg-white/10 text-zinc-300",
  error: "bg-red-500/20 text-red-200",
};

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

export default function SessionsPage() {
  const sessions = useQuery(api.sessions.list);
  const agents = useQuery(api.agents.list);
  const [agentFilter, setAgentFilter] = useState("all");

  const agentById = new Map(agents?.map((agent) => [agent._id, agent]) ?? []);

  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    if (agentFilter === "all") return sessions;
    return sessions.filter((session) => session.agentId === agentFilter);
  }, [sessions, agentFilter]);

  return (
    <div>
      <PageHeader
        title="Sessions"
        description="Review agent conversations and performance metrics."
      />
      <Card className="border border-white/5 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Select value={agentFilter} onChange={(event) => setAgentFilter(event.target.value)}>
            <option value="all">All agents</option>
            {agents?.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </Select>
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </Select>
          <Select defaultValue="30d">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
        </CardContent>
      </Card>
      {sessions === undefined ? (
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="h-16" />
            </Card>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <Card className="mt-6 border border-white/5 bg-white/[0.03]">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-sm text-zinc-400">
            <span className="text-4xl">🛰️</span>
            <div>No sessions yet.</div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 border border-white/5 bg-white/[0.03]">
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Started</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Tokens</th>
                  <th className="pb-3">Cost</th>
                  <th className="pb-3">Summary</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredSessions.map((session, index) => {
                  const agent = agentById.get(session.agentId);
                  return (
                    <tr
                      key={session._id}
                      className={`border-t border-white/5 ${
                        index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                      }`}
                    >
                      <td className="py-4 font-medium">
                        {agent ? `${agent.emoji} ${agent.name}` : "Unknown agent"}
                      </td>
                      <td className="py-4 text-zinc-400">
                        {formatRelative(session.startedAt)}
                      </td>
                      <td className="py-4">
                        <Badge className={statusVariant[session.status] ?? "bg-white/10 text-zinc-300"}>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-zinc-400">
                        {(session.tokenCount ?? 0).toLocaleString()}
                      </td>
                      <td className="py-4 text-zinc-400">
                        {formatCurrency(session.cost ?? 0)}
                      </td>
                      <td className="py-4 text-zinc-400">
                        {session.summary ?? "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
