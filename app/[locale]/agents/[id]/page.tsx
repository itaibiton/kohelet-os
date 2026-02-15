import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agentName = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <div>
      <PageHeader
        title={`${agentName} — Agent Profile`}
        description="Soul, memory, and recent activity."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Soul / Persona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              {agentName} is tuned for high-leverage orchestration, balancing speed
              with quality and enforcing the Kohelet OS operating principles.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">active</Badge>
              <Badge variant="secondary">primary: opus46</Badge>
              <Badge variant="secondary">secondary: gemini-pro</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Memory</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Last updated 2h ago. 12 key memories synced.
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              09:10 UTC · Planning sprint allocation · 42k tokens
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              08:02 UTC · Vendor onboarding review · 18k tokens
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Threads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              Agentic guardrails update
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-3">
              Convex schema sync
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
