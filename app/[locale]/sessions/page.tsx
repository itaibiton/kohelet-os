"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusVariant: Record<string, "default" | "secondary" | "warning" | "danger"> = {
  active: "default",
  completed: "secondary",
  error: "danger",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SessionsPage() {
  const sessions = useQuery(api.sessions.list);
  const agents = useQuery(api.agents.list);
  const agentById = new Map(agents?.map((agent) => [agent._id, agent]) ?? []);

  return (
    <div>
      <PageHeader
        title="Sessions"
        description="Review agent conversations and performance metrics."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Search by agent or session ID" />
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </Select>
          <Select defaultValue="24h">
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
      ) : sessions.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-6 text-sm text-muted-foreground">
            No sessions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4">
          {sessions.map((session) => {
            const agent = agentById.get(session.agentId);
            return (
              <Card key={session._id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm">
                  <div>
                    <div className="text-white">
                      {agent ? `${agent.emoji} ${agent.name}` : "Unknown agent"}
                    </div>
                    <div className="text-muted-foreground">
                      {session.startedAt
                        ? new Date(session.startedAt).toUTCString()
                        : "--"}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {(session.tokenCount ?? 0).toLocaleString()} tokens
                  </div>
                  <div className="text-muted-foreground">
                    {formatCurrency(session.cost ?? 0)}
                  </div>
                  {session.summary && (
                    <div className="text-xs text-muted-foreground">
                      {session.summary}
                    </div>
                  )}
                  <Badge variant={statusVariant[session.status] ?? "secondary"}>
                    {session.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
