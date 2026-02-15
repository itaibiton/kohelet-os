import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const columns = [
  {
    title: "Todo",
    items: [
      { title: "Draft standup agenda", priority: "medium" },
      { title: "Map org chart tiers", priority: "high" },
    ],
  },
  {
    title: "In Progress",
    items: [
      { title: "Convex schema review", priority: "urgent" },
      { title: "Auth flow audit", priority: "high" },
    ],
  },
  {
    title: "Review",
    items: [{ title: "Ops dashboard polish", priority: "medium" }],
  },
  {
    title: "Done",
    items: [{ title: "Create sidebar navigation", priority: "low" }],
  },
];

const priorityVariant: Record<string, "default" | "secondary" | "warning" | "danger"> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "danger",
};

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Kanban view of current workstreams."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.title}>
            <CardHeader>
              <CardTitle className="text-base">{column.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-white/5 bg-white/5 p-3 text-sm text-white"
                >
                  <div className="font-medium">{item.title}</div>
                  <Badge
                    variant={priorityVariant[item.priority]}
                    className="mt-2"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
