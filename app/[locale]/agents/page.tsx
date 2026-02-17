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

const departmentStyles: Record<string, { badge: string; glow: string }> = {
  dev: { badge: "bg-blue-500/20 text-blue-200", glow: "hover:shadow-[0_0_24px_rgba(59,130,246,0.35)]" },
  creative: { badge: "bg-purple-500/20 text-purple-200", glow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]" },
  bizdev: { badge: "bg-orange-500/20 text-orange-200", glow: "hover:shadow-[0_0_24px_rgba(249,115,22,0.35)]" },
  admin: { badge: "bg-teal-500/20 text-teal-200", glow: "hover:shadow-[0_0_24px_rgba(20,184,166,0.35)]" },
  devops: { badge: "bg-emerald-500/20 text-emerald-200", glow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.35)]" },
  qa: { badge: "bg-red-500/20 text-red-200", glow: "hover:shadow-[0_0_24px_rgba(248,113,113,0.35)]" },
  product: { badge: "bg-indigo-500/20 text-indigo-200", glow: "hover:shadow-[0_0_24px_rgba(99,102,241,0.35)]" },
  executive: { badge: "bg-yellow-500/20 text-yellow-200", glow: "hover:shadow-[0_0_24px_rgba(234,179,8,0.35)]" },
};

const tierStyles: Record<string, string> = {
  csuite: "border border-yellow-500/40 text-yellow-200",
  manager: "border border-zinc-300/40 text-zinc-200",
  worker: "border border-amber-700/40 text-amber-300",
};

type TreeNode = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: string;
  department: string;
  tier: string;
  href?: string;
  children: TreeNode[];
};

export default function AgentsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const agents = useQuery(api.agents.list);
  const [tier, setTier] = useState("all");
  const [department, setDepartment] = useState("all");
  const [view, setView] = useState("grid");

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

  const treeData = useMemo(() => {
    if (!agents) return null;
    const rootId = "itai";
    const byParent = new Map<string, typeof agents>();

    agents.forEach((agent) => {
      const parentId = agent.reportsTo ?? rootId;
      const key = String(parentId);
      const current = byParent.get(key) ?? [];
      current.push(agent);
      byParent.set(key, current);
    });

    const buildNode = (parentId: string): TreeNode[] => {
      const children = byParent.get(parentId) ?? [];
      return children.map((agent) => ({
        id: agent._id,
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        status: agent.status,
        department: agent.department,
        tier: agent.tier,
        href: `/${locale}/agents/${agent._id}`,
        children: buildNode(agent._id),
      }));
    };

    const root: TreeNode = {
      id: rootId,
      name: "Itai",
      role: "CEO",
      emoji: "🧭",
      status: "active",
      department: "executive",
      tier: "csuite",
      children: buildNode(rootId),
    };

    return root;
  }, [agents, locale]);

  const renderNodeCard = (node: TreeNode) => {
    const departmentKey = node.department.toLowerCase();
    const deptStyle = departmentStyles[departmentKey] ?? {
      badge: "bg-white/10 text-white",
      glow: "",
    };
    const cardBody = (
      <Card
        className={`w-48 border border-white/10 bg-white/[0.04] text-left transition-all duration-200 hover:-translate-y-0.5 ${deptStyle.glow}`}
      >
        <CardContent className="space-y-3 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{node.emoji}</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusColor[node.status] ?? "bg-zinc-500"
              } ${
                node.status === "active" || node.status === "running"
                  ? "animate-pulse"
                  : ""
              }`}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {node.name}
            </div>
            <div className="text-xs text-zinc-400">{node.role}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={deptStyle.badge}>{node.department}</Badge>
            <Badge className={tierStyles[node.tier] ?? "border border-white/10 text-white"}>
              {node.tier === "csuite"
                ? "C-Suite"
                : node.tier === "manager"
                  ? "Manager"
                  : "Worker"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );

    if (!node.href) return cardBody;
    return <Link href={node.href}>{cardBody}</Link>;
  };

  const TreeBranch = ({ node }: { node: TreeNode }) => {
    const hasChildren = node.children.length > 0;
    return (
      <div className="relative flex flex-col items-center">
        {renderNodeCard(node)}
        {hasChildren && (
          <div className="relative mt-8 flex flex-wrap justify-center gap-8">
            <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-white/10" />
            <div className="absolute left-6 right-6 top-6 h-px bg-white/10" />
            {node.children.map((child) => (
              <div
                key={child.id}
                className="relative flex flex-col items-center pt-6"
              >
                <div className="absolute top-0 h-6 w-px bg-white/10" />
                <TreeBranch node={child} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Agents"
        description="All agent personas, roles, and current status."
      />
      <div className="flex flex-col items-start gap-3 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4" style={{ WebkitOverflowScrolling: "touch" }}>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="tree">Tree</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-6 w-px bg-white/10" />
        <Tabs value={tier} onValueChange={setTier}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="csuite">C-Suite</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="worker">Workers</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          className="w-full sm:w-48"
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
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="space-y-3 py-6">
                <div className="h-12 w-12 rounded-full bg-white/10" />
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => {
            const departmentKey = agent.department.toLowerCase();
            const deptStyle = departmentStyles[departmentKey] ?? {
              badge: "bg-white/10 text-white",
              glow: "",
            };
            return (
              <Link key={agent._id} href={`/${locale}/agents/${agent._id}`}>
                <Card
                  className={`h-full border border-white/10 bg-white/[0.03] transition-all duration-200 ${deptStyle.glow} hover:-translate-y-0.5 hover:bg-white/[0.06]`}
                >
                  <CardContent className="flex h-full flex-col gap-4 py-6">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{agent.emoji}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusColor[agent.status] ?? "bg-zinc-500"
                        } ${
                          agent.status === "active" || agent.status === "running"
                            ? "animate-pulse"
                            : ""
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {agent.name}
                      </div>
                      <div className="text-sm text-zinc-400">{agent.role}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={deptStyle.badge}>{agent.department}</Badge>
                      <Badge className={tierStyles[agent.tier] ?? "border border-white/10 text-white"}>
                        {agent.tier === "csuite"
                          ? "C-Suite"
                          : agent.tier === "manager"
                            ? "Manager"
                            : "Worker"}
                      </Badge>
                      <Badge variant="secondary">{agent.primaryModel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          {filteredAgents.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No agents found for this filter.
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto pb-6" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="min-w-[720px] px-2">
            {treeData ? (
              <div className="flex justify-center">
                <TreeBranch node={treeData} />
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Tree view unavailable.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
