import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const crons = [
  {
    name: "Daily memory sync",
    schedule: "Every day 02:00",
    enabled: true,
  },
  {
    name: "Weekly reporting",
    schedule: "Mondays 06:00",
    enabled: false,
  },
];

export default function CronsPage() {
  return (
    <div>
      <PageHeader
        title="Crons"
        description="Automated schedules and OpenClaw cron monitoring."
        actions={<Button variant="outline">Add cron</Button>}
      />
      <div className="grid gap-4">
        {crons.map((cron) => (
          <Card key={cron.name}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm">
              <div>
                <div className="text-white">{cron.name}</div>
                <div className="text-muted-foreground">{cron.schedule}</div>
              </div>
              <Badge variant={cron.enabled ? "default" : "secondary"}>
                {cron.enabled ? "enabled" : "disabled"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
