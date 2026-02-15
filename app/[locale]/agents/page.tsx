"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusColor: Record<string, string> = {
  active: "bg-emerald-400",
  running: "bg-emerald-400",
  idle: "bg-yellow-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
};

export default function AgentsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const agents = useQuery(api.agents.list);
  const [tier, setTier] = useState("all");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(() => {
    if (!agents) return [];
    return Array.from(new Set(agents.map((agent) => agent.department))).sort();
  }, [agents]);

  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    return agents.filter((agent) => {
      const tierMatch = tier === "all" ? true : agent.tier === tier;
      const deptMatch =
        department === "all" ? true : agent.department === department;
      return tierMatch && deptMatch;
    });
  }, [agents, tier, department]);

  return (
    <div>
      <PageHeader
        title="Agents"
        description="All agent personas, roles, and current status."
      />
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={tier} onValueChange={setTier}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="csuite">C-Suite</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="worker">Workers</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          className="w-48"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option value="all">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Select>
      </div>
      {agents === undefined ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="space-y-3 py-6">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Link key={agent._id} href={`/${locale}/agents/${agent._id}`}>
              <Card className="h-full transition hover:border-white/20">
                <CardContent className="flex h-full flex-col gap-4 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{agent.emoji}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        statusColor[agent.status] ?? "bg-zinc-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {agent.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {agent.role}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{agent.department}</Badge>
                    <Badge variant="secondary">{agent.primaryModel}</Badge>
                    <Badge variant="default">{agent.tier}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filteredAgents.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No agents found for this filter.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
