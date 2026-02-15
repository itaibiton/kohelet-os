import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const sessions = [
  {
    id: "S-1001",
    agent: "Atlas",
    status: "active",
    tokens: "42k",
    started: "09:10 UTC",
  },
  {
    id: "S-1000",
    agent: "Forge",
    status: "completed",
    tokens: "88k",
    started: "08:02 UTC",
  },
  {
    id: "S-0999",
    agent: "Halo",
    status: "error",
    tokens: "15k",
    started: "07:44 UTC",
  },
];

export default function SessionsPage() {
  return (
    <div>
      <PageHeader
        title="Sessions"
        description="Review agent conversations and performance metrics."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Search by agent or session ID" />
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </Select>
          <Select defaultValue="24h">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm">
              <div>
                <div className="text-white">{session.id}</div>
                <div className="text-muted-foreground">{session.agent}</div>
              </div>
              <div className="text-muted-foreground">{session.started}</div>
              <div className="text-muted-foreground">{session.tokens} tokens</div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {session.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
