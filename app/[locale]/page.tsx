import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active agents", value: "18", delta: "+3" },
  { label: "Running tasks", value: "42", delta: "+7" },
  { label: "Tokens today", value: "1.2M", delta: "+8%" },
  { label: "Est. cost", value: "$94.20", delta: "-$3" },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Command Dashboard"
        description="Real-time snapshot of the Kohelet agentic operating system."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <Badge variant="default">{stat.delta}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Operations Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              Forge spun up a QA swarm for the onboarding flow.
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              Atlas scheduled a client standup for product alignment.
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              Nimbus reported token usage anomaly in devops cluster.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Convex latency</span>
              <span className="text-white">42ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Clerk auth</span>
              <span className="text-emerald-400">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Schedulers</span>
              <span className="text-white">4 running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
