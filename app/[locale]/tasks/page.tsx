"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const columns = [
  {
    key: "todo",
    title: "To Do",
    bar: "bg-zinc-500/40",
    fill: "bg-zinc-500",
  },
  {
    key: "in_progress",
    title: "In Progress",
    bar: "bg-blue-500/40",
    fill: "bg-blue-500",
  },
  {
    key: "review",
    title: "Review",
    bar: "bg-yellow-500/40",
    fill: "bg-yellow-500",
  },
  {
    key: "done",
    title: "Done",
    bar: "bg-emerald-500/40",
    fill: "bg-emerald-500",
  },
] as const;

const priorityStyles: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-200",
  high: "bg-orange-500/20 text-orange-200",
  medium: "bg-yellow-500/20 text-yellow-200",
  low: "bg-white/10 text-white",
};

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const agents = useQuery(api.agents.list);

  const agentById = new Map(agents?.map((agent) => [agent._id, agent]) ?? []);

  if (tasks === undefined) {
    return (
      <div>
        <PageHeader title="Tasks" description="Kanban view of current workstreams." />
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((column) => (
            <Card key={column.key} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-24 rounded bg-white/10" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-20 rounded-lg bg-white/5" />
                <div className="h-20 rounded-lg bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.key] = tasks.filter((task) => task.status === column.key);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div>
      <PageHeader title="Tasks" description="Kanban view of current workstreams." />
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.key} className="border border-white/5 bg-white/[0.03]">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-white">{column.title}</div>
                <Badge variant="secondary">{tasksByStatus[column.key].length}</Badge>
              </div>
              <div className={`h-1 w-full rounded-full ${column.bar}`}>
                <div className={`h-1 w-2/3 rounded-full ${column.fill}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus[column.key].length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-500">
                  No tasks
                </div>
              ) : (
                tasksByStatus[column.key].map((task) => {
                  const assignee = task.assignedTo
                    ? agentById.get(task.assignedTo)
                    : null;
                  return (
                    <div
                      key={task._id}
                      className="rounded-xl border border-white/5 bg-white/[0.04] p-4 text-sm text-white shadow-sm"
                    >
                      <div className="font-semibold">{task.title}</div>
                      {task.description && (
                        <div
                          className="mt-1 text-xs text-zinc-400"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {task.description}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge className={priorityStyles[task.priority] ?? "bg-white/10"}>
                          {task.priority}
                        </Badge>
                        {task.department && (
                          <Badge variant="secondary">{task.department}</Badge>
                        )}
                      </div>
                      {assignee && (
                        <div className="mt-2 text-xs text-zinc-400">
                          {assignee.emoji} {assignee.name}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
