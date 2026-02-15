import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agents = [
  { id: "atlas", name: "Atlas", role: "CEO", status: "active" },
  { id: "forge", name: "Forge", role: "CTO", status: "running" },
  { id: "halo", name: "Halo", role: "COO", status: "idle" },
  { id: "nimbus", name: "Nimbus", role: "DevOps", status: "active" },
];

const statusVariant: Record<string, "default" | "secondary" | "warning" | "danger"> = {
  active: "default",
  running: "secondary",
  idle: "warning",
  error: "danger",
};

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <PageHeader
        title="Agents"
        description="All agent personas, roles, and current status."
      />
      <div className="grid gap-4">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/${locale}/agents/${agent.id}`}>
            <Card className="transition hover:border-white/20">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="text-white">{agent.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.role}
                  </div>
                </div>
                <Badge variant={statusVariant[agent.status]}>{agent.status}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
