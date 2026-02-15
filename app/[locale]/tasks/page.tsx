"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const columns = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "review", title: "Review" },
  { key: "done", title: "Done" },
] as const;

const priorityStyles: Record<string, string> = {
  urgent: "bg-rose-500/20 text-rose-200",
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
        <PageHeader
          title="Tasks"
          description="Kanban view of current workstreams."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {columns.map((column) => (
            <Card key={column.key} className="animate-pulse">
              <CardHeader>
                <CardTitle className="text-base">{column.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-16 rounded-lg bg-white/5" />
                <div className="h-16 rounded-lg bg-white/5" />
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
      <PageHeader
        title="Tasks"
        description="Kanban view of current workstreams."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.key}>
            <CardHeader>
              <CardTitle className="text-base">
                {column.title} ({tasksByStatus[column.key].length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus[column.key].length === 0 ? (
                <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-muted-foreground">
                  No tasks yet.
                </div>
              ) : (
                tasksByStatus[column.key].map((task) => {
                  const assignee = task.assignedTo
                    ? agentById.get(task.assignedTo)
                    : null;
                  return (
                    <div
                      key={task._id}
                      className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white"
                    >
                      <div className="font-medium">{task.title}</div>
                      {assignee && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {assignee.emoji} {assignee.name}
                        </div>
                      )}
                      <Badge
                        className={`mt-2 ${priorityStyles[task.priority] ?? ""}`}
                      >
                        {task.priority}
                      </Badge>
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
