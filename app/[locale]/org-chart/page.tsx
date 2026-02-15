"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusColor: Record<string, string> = {
  active: "bg-emerald-400",
  running: "bg-emerald-400",
  idle: "bg-yellow-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
};

type AgentNode = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: string;
  tier: string;
  children: AgentNode[];
};

export default function OrgChartPage() {
  const agents = useQuery(api.agents.list);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const tree = useMemo<AgentNode | null>(() => {
    if (!agents) return null;
    const byParent = new Map<string | null, AgentNode[]>();

    agents.forEach((agent) => {
      const node: AgentNode = {
        id: agent._id,
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        status: agent.status,
        tier: agent.tier,
        children: [],
      };
      const parentKey = agent.reportsTo ?? null;
      const list = byParent.get(parentKey) ?? [];
      list.push(node);
      byParent.set(parentKey, list);
    });

    const attachChildren = (node: AgentNode) => {
      const kids = byParent.get(node.id) ?? [];
      node.children = kids.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(attachChildren);
    };

    const csuite = (agents.filter((agent) => agent.tier === "csuite") ?? [])
      .map((agent) => ({
        id: agent._id,
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        status: agent.status,
        tier: agent.tier,
        children: [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    csuite.forEach(attachChildren);

    return {
      id: "itai",
      name: "Itai",
      role: "CEO",
      emoji: "👑",
      status: "active",
      tier: "csuite",
      children: csuite,
    };
  }, [agents]);

  const toggle = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: AgentNode, depth = 0) => {
    const isCollapsed = collapsed[node.id];
    return (
      <div key={node.id} className="space-y-3">
        <div
          className={`flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 ${
            depth === 0 ? "bg-white/10" : ""
          }`}
        >
          <span className="text-xl">{node.emoji}</span>
          <div>
            <div className="text-white">
              {node.name} · {node.role}
            </div>
            <div className="text-xs text-muted-foreground">{node.tier}</div>
          </div>
          <span
            className={`ml-auto h-2.5 w-2.5 rounded-full ${
              statusColor[node.status] ?? "bg-zinc-500"
            }`}
          />
          {node.children.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggle(node.id)}
            >
              {isCollapsed ? "Expand" : "Collapse"}
            </Button>
          )}
        </div>
        {!isCollapsed && node.children.length > 0 && (
          <div className="ml-6 grid gap-3 border-l border-white/10 pl-6">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Org Chart"
        description="Interactive view of agent hierarchy and reporting lines."
      />
      {tree === null ? (
        <Card className="animate-pulse">
          <CardContent className="h-32" />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              Hierarchy
              <Badge variant="secondary" className="ml-auto">
                {agents?.length ?? 0} agents
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderNode(tree)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
