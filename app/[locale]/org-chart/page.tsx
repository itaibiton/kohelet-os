"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusColor: Record<string, string> = {
  active: "bg-emerald-400",
  running: "bg-emerald-400",
  idle: "bg-yellow-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
};

const departmentStyles: Record<string, string> = {
  dev: "border-blue-500/40",
  creative: "border-purple-500/40",
  bizdev: "border-orange-500/40",
  admin: "border-teal-500/40",
  devops: "border-emerald-500/40",
  qa: "border-red-500/40",
  product: "border-indigo-500/40",
  executive: "border-yellow-500/40",
};

function NodeCard({
  emoji,
  name,
  role,
  status,
  highlight,
  department,
  onClick,
}: {
  emoji: string;
  name: string;
  role: string;
  status: string;
  highlight?: string;
  department?: string;
  onClick?: () => void;
}) {
  const deptKey = department?.toLowerCase() ?? "";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06] ${
        highlight ?? ""
      } ${departmentStyles[deptKey] ?? ""}`}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{name}</div>
        <div className="text-xs text-zinc-400">{role}</div>
      </div>
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          statusColor[status] ?? "bg-zinc-500"
        }`}
      />
    </button>
  );
}

export default function OrgChartPage() {
  const agents = useQuery(api.agents.list);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { csuite, managers, workersByManager } = useMemo(() => {
    if (!agents) {
      return {
        csuite: [],
        managers: [],
        workersByManager: new Map<string, typeof agents>(),
      };
    }

    const csuiteAgents = agents
      .filter((agent) => agent.tier === "csuite")
      .sort((a, b) => a.name.localeCompare(b.name));
    const managerAgents = agents
      .filter((agent) => agent.tier === "manager")
      .sort((a, b) => a.name.localeCompare(b.name));

    const workerMap = new Map<string, typeof agents>();
    agents
      .filter((agent) => agent.tier === "worker" && agent.reportsTo)
      .forEach((agent) => {
        const list = workerMap.get(agent.reportsTo!) ?? [];
        list.push(agent);
        workerMap.set(agent.reportsTo!, list);
      });

    workerMap.forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));

    return { csuite: csuiteAgents, managers: managerAgents, workersByManager: workerMap };
  }, [agents]);

  const toggle = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <PageHeader
        title="Org Chart"
        description="Interactive view of agent hierarchy and reporting lines."
      />
      {agents === undefined ? (
        <Card className="animate-pulse">
          <CardContent className="h-32" />
        </Card>
      ) : (
        <div className="space-y-10">
          <div className="relative flex justify-center">
            <div className="absolute -bottom-6 left-1/2 h-6 w-px bg-white/10" />
            <NodeCard
              emoji="👑"
              name="Itai"
              role="CEO"
              status="active"
              highlight="border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-amber-500/5"
              department="executive"
            />
          </div>

          <div className="relative">
            <div className="absolute -top-6 left-1/2 h-6 w-px bg-white/10" />
            <div className="absolute -top-6 left-1/2 h-px w-2/3 -translate-x-1/2 bg-white/10" />
            <div className="grid gap-6 md:grid-cols-2">
              {csuite.map((agent) => (
                <NodeCard
                  key={agent._id}
                  emoji={agent.emoji}
                  name={agent.name}
                  role={agent.role}
                  status={agent.status}
                  highlight="border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-emerald-500/10"
                  department={agent.department}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Managers
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {managers.map((manager) => {
                const workers = workersByManager.get(manager._id) ?? [];
                const isCollapsed = collapsed[manager._id];
                return (
                  <div key={manager._id} className="relative">
                    <div className="absolute -top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-white/10" />
                    <NodeCard
                      emoji={manager.emoji}
                      name={manager.name}
                      role={manager.role}
                      status={manager.status}
                      department={manager.department}
                      onClick={() => toggle(manager._id)}
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                      <Badge variant="secondary">{manager.department}</Badge>
                      <span>{isCollapsed ? "Expand" : "Collapse"} workers</span>
                    </div>
                    {!isCollapsed && (
                      <div className="relative mt-4 space-y-2 border-l border-white/10 pl-4">
                        {workers.length === 0 ? (
                          <div className="text-xs text-zinc-500">No workers assigned.</div>
                        ) : (
                          workers.map((worker) => (
                            <div key={worker._id} className="relative">
                              <div className="absolute left-[-17px] top-4 h-px w-4 bg-white/10" />
                              <NodeCard
                                emoji={worker.emoji}
                                name={worker.name}
                                role={worker.role}
                                status={worker.status}
                                department={worker.department}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
