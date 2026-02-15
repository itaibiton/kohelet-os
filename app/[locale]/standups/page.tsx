import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const standups = [
  {
    title: "Ops Daily Standup",
    time: "08:30 UTC",
    status: "completed",
  },
  {
    title: "Product Sync",
    time: "10:00 UTC",
    status: "scheduled",
  },
];

export default function StandupsPage() {
  return (
    <div>
      <PageHeader
        title="Standups"
        description="Scheduled standups with transcripts and audio playback."
        actions={<Button>Schedule standup</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {standups.map((standup) => (
          <Card key={standup.title}>
            <CardHeader>
              <CardTitle>{standup.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>{standup.time}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  {standup.status}
                </span>
              </div>
              <audio controls className="w-full">
                <source src="" />
              </audio>
              <p>Transcript placeholder for captured standup notes.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
